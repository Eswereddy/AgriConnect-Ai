// ==========================================
// REAL AUTHENTICATION (bcrypt + JWT, httpOnly cookie)
// ==========================================
// Replaces the old "click a sidebar icon to become that role" demo pattern
// with actual accounts: hashed passwords, signed session tokens, and
// middleware that can gate real endpoints by login state and role.
//
// The token is stored in an httpOnly cookie so client-side JS can't read it
// (mitigates XSS token theft), and is also accepted via an Authorization:
// Bearer header for API clients / mobile that can't use cookies.

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";
import { createUser, findUserByEmail, touchLastLogin, recordAudit, type UserRecord } from "./db";

const TOKEN_COOKIE = "agriconnect_token";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  // Fail loudly in the logs (not a hard crash) - a missing JWT_SECRET in a real
  // deployment means every restart invalidates all sessions, and the secret
  // is only as strong as this process's memory, which is not production-safe.
  console.warn(
    "[auth] JWT_SECRET is not set in the environment. Using a temporary, " +
    "process-local secret - every server restart will log everyone out, and " +
    "this is NOT safe for a real deployment. Set JWT_SECRET before shipping."
  );
}
const EFFECTIVE_SECRET = JWT_SECRET || `dev-only-insecure-${randomUUID()}`;

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthedRequest extends Request {
  user?: PublicUser;
}

function toPublicUser(u: UserRecord): PublicUser {
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}

export function signToken(user: PublicUser): string {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role, name: user.name }, EFFECTIVE_SECRET, {
    expiresIn: TOKEN_TTL_SECONDS
  });
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: TOKEN_TTL_SECONDS * 1000
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(TOKEN_COOKIE);
}

const VALID_ROLES = new Set([
  "Farmer", "Buyer", "Government Officer", "Supplier", "Agriculture Expert",
  "Logistics Provider", "Warehouse Operator", "Insurance Agent", "Bank Officer",
  "Researcher", "Extension Officer", "Admin"
]);

export async function registerUser(input: { name: string; email: string; password: string; role: string }): Promise<PublicUser> {
  const name = (input.name || "").trim();
  const email = (input.email || "").trim().toLowerCase();
  // Admin is deliberately NOT self-assignable through public registration -
  // anyone could otherwise grant themselves access to /api/auth/users and
  // /api/auth/errors. New admins are promoted out-of-band; see
  // server/scripts/promote-admin.ts and AGRICONNECT_HARDENING.md.
  const requestedRole = VALID_ROLES.has(input.role) ? input.role : "Farmer";
  const role = requestedRole === "Admin" ? "Farmer" : requestedRole;

  if (!name) throw new Error("Name is required.");
  if (!email || !email.includes("@")) throw new Error("A valid email is required.");
  if (!input.password || input.password.length < 8) throw new Error("Password must be at least 8 characters.");

  const existing = findUserByEmail(email);
  if (existing) throw new Error("An account with that email already exists.");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const id = randomUUID();
  createUser({ id, name, email, passwordHash, role });
  recordAudit(id, "user_registered", { email, role });

  return { id, name, email, role };
}

export async function authenticateUser(email: string, password: string): Promise<PublicUser> {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const user = findUserByEmail(normalizedEmail);
  // Same error message whether the email is unknown or the password is wrong,
  // so failed attempts don't reveal which accounts exist.
  const invalidCredentialsError = new Error("Invalid email or password.");
  if (!user) throw invalidCredentialsError;

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    recordAudit(user.id, "user_login_failed");
    throw invalidCredentialsError;
  }

  touchLastLogin(user.id);
  recordAudit(user.id, "user_login");
  return toPublicUser(user);
}

function extractToken(req: Request): string | undefined {
  const cookieToken = (req as any).cookies?.[TOKEN_COOKIE];
  if (cookieToken) return cookieToken;
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return undefined;
}

/** Attaches req.user if a valid token is present, but never blocks the request. */
export function attachUserIfPresent(req: AuthedRequest, _res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) return next();
  try {
    const payload = jwt.verify(token, EFFECTIVE_SECRET) as any;
    req.user = { id: payload.sub, email: payload.email, role: payload.role, name: payload.name };
  } catch {
    // Invalid/expired token on an optional-auth route - proceed as anonymous.
  }
  next();
}

/** Blocks the request with 401 unless a valid session is present. */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }
  try {
    const payload = jwt.verify(token, EFFECTIVE_SECRET) as any;
    req.user = { id: payload.sub, email: payload.email, role: payload.role, name: payload.name };
    next();
  } catch {
    res.status(401).json({ error: "Your session has expired. Please log in again." });
  }
}

/** Use after requireAuth to restrict an endpoint to specific roles. */
export function requireRole(...roles: string[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "You do not have permission to perform this action." });
      return;
    }
    next();
  };
}

export { TOKEN_COOKIE };
