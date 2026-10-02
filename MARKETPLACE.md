# Live marketplace (Postgres)

The core trading loop now runs on real, persisted data:

    farm -> crop -> listing -> bid -> order -> payment (escrow ledger) -> shipment -> delivery

| Piece | Where |
|---|---|
| Schema (9 tables) | `server/schema.ts` |
| Connection, transactions | `server/pg.ts` |
| REST API, `/api/market/*` | `server/marketplace.ts` |
| Typed client | `src/services/marketApi.ts` |
| UI ("Live Marketplace" in the sidebar) | `src/components/marketplace/LiveMarketplace.tsx` |
| End-to-end test (35 checks) | `npm run test:market` |

## Run it
- **Production / real data:** set `DATABASE_URL` to a Postgres connection string. The schema is created on startup.
- **Quick dev:** leave `DATABASE_URL` unset. An in-memory Postgres is used and data is lost on restart.
- **Tests:** `npm run test:market` (in-memory) or `DATABASE_URL=... PGSSL=disable npm run test:market` against a scratch Postgres.

## What the server enforces
- Login required; role rules (only Farmers create farms/listings, only Buyers bid/pay, etc.).
- Ownership: you can only see or change your own farms, listings, orders and stock.
- No overselling: accepting a bid atomically reserves stock; two simultaneous accepts for the last kg -> exactly one wins.
- Order state machine: pending_payment -> paid -> shipped -> delivered -> completed (or cancelled with escrow refund + stock restored). Shipment steps must go in order.
- Money is integer paise in the database; the API speaks rupees.

## Known limits (next steps)
1. **Payments are an escrow LEDGER, not real money.** Replace `POST /orders/:id/pay` with Razorpay (create order, verify signature server-side, store the payment id).
2. **Users still live in SQLite**, so `seller_id`/`buyer_id` are plain text, not foreign keys. Move `users` into Postgres next.
3. The older dashboards (the 95 components that never call the backend) still show demo data. Port them to `marketApi` one by one; start with the ones closest to this loop (orders, bidding, logistics, warehouse).
4. Add a real migration tool (e.g. node-pg-migrate) before the first schema change.
5. `pg-mem` (dev fallback) ignores ROLLBACK; test against real Postgres before shipping.
