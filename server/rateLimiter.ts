// ==========================================
// RATE LIMITING FOR AUTH ENDPOINTS
// ==========================================
// Without this, /api/auth/login accepts unlimited password guesses per
// second - a real credential-stuffing/brute-force risk on any endpoint
// that checks a password. Scoped narrowly to login + register, since
// those are the only endpoints where guessing is the actual threat.

import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please wait a few minutes and try again." }
});

export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 new accounts per IP per hour - generous for real signups, still blocks mass account creation
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many accounts created from this network. Please try again later." }
});

// Generic per-IP limiter for all /api/* traffic (protects the paid Gemini quota).
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down and try again shortly." }
});

// The public client-error endpoint would otherwise let anyone flood the error log.
export const clientErrorRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many error reports." }
});
