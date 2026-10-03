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

## Real payments (Razorpay)

Buyers pay through **Razorpay Checkout**. Card/UPI details are typed into Razorpay's own window and never reach this server (keeps you out of PCI scope).

Flow: `intent` (server creates a Razorpay order for the amount in OUR database) -> buyer pays in the Razorpay window -> `verify` (server checks Razorpay's signature, then re-reads the payment from Razorpay's API and confirms order id, amount and "captured" before marking the order paid). A **webhook** is the safety net for buyers who close the tab mid-payment.

Safety rules the tests prove: forged signatures rejected; amount always from our DB; double verify / duplicate webhooks harmless; late or duplicate payments are refunded automatically; cancelling a paid order refunds through Razorpay; a refund that fails is queued and retried (`POST /api/market/payments/admin/retry-refunds`, shown as "Refunds pending" in admin stats).

Modes (automatic): keys set -> **razorpay**. No keys + development -> **ledger** (bookkeeping only, no money). No keys + production -> **disabled** (refuses; never fakes a payment).

Set up:
1. Razorpay dashboard -> API Keys -> create TEST keys -> put `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` in `.env`.
2. Dashboard -> Webhooks -> add `https://<your-domain>/api/payments/razorpay/webhook`, events `payment.captured`, `order.paid`, `payment.failed`, and a secret -> `RAZORPAY_WEBHOOK_SECRET`.
   (Local testing: expose your port with a tunnel such as ngrok.)
3. `npm run check:feeds` confirms the keys work. Pay with a Razorpay test card/UPI from their docs.

**Important about "escrow":** Razorpay Checkout sends the money to YOUR Razorpay account. "Held in escrow" here is our bookkeeping state, and "release" does not yet pay the farmer. To pay sellers out you need **Razorpay Route** (marketplace split payments, with seller KYC) or RazorpayX payouts, plus legal/compliance review of holding customer funds. That is the next payments step before going live with real money.

## Live data feeds

| Feed | Source | Key |
|---|---|---|
| Mandi prices (+ saved history for trends) | data.gov.in daily mandi prices (Agmarknet data) | free `DATA_GOV_API_KEY` |
| Weather + farm advisories | Open-Meteo | none (**free tier is non-commercial only**; buy their commercial plan before charging users) |

Rules: cached (weather 15 min, mandi 30 min); every mandi fetch is saved to Postgres so price trends build over time; if a feed is down you get a clear error, or real saved prices marked **stale**. The API never invents numbers. IMD has no open public API, which is why Open-Meteo is used.

Endpoints: `GET /api/live/status`, `/weather?place=Anantapur` (or `?lat=&lon=`), `/mandi?state=&district=&market=&commodity=`, `/mandi/trend?commodity=&market=&days=30`.

## Tests
- `npm run test:market` - 35 checks, trading loop.
- `npm run test:live` - 35 checks, payments + feeds, against local stand-ins for Razorpay / Open-Meteo / data.gov.in.
- `npm run check:feeds` - run on YOUR machine with real keys to confirm the real services respond as expected (stand-ins can't prove that).

## Not built (and why)
- **Satellite NDVI**: needs a satellite data account (Sentinel Hub / Google Earth Engine / Planet) plus field boundaries; paid or approval-gated. Pick a provider first.
- **PM-KISAN / PMFBY status**: there is no public API; beneficiary lookups sit behind official portals and need the farmer's own Aadhaar/mobile verification. Needs a government partnership or an official aggregator. Don't build a scraper; it would break and may violate the portals' terms.

## Other known limits (next steps)
1. Seller payouts / real escrow (see above).
2. Remove the old fake payment screens so nobody mistakes them for real: `src/components/buyer/BuyerPaymentDashboard.tsx`, `src/components/startup/PaymentGatewayDemo.tsx`, `src/services/PaymentGatewayService.ts` (they collect card numbers into a demo form).
3. **Users still live in SQLite**, so `seller_id`/`buyer_id` are plain text, not foreign keys. Move `users` into Postgres next.
4. The older dashboards (the ~95 components that never call the backend) still show demo data. Port them to `marketApi` / `liveApi` one by one.
5. Add a real migration tool (e.g. node-pg-migrate) before the next schema change. Startup currently re-runs idempotent statements.
6. `pg-mem` (dev fallback) ignores ROLLBACK; test against real Postgres before shipping.
