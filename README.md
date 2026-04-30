# PERN Store MVP

Portfolio-focused MVP e-commerce app with:
- customer flow (browse, cart, checkout, order history)
- admin flow (product management, order status updates)
- PostgreSQL-backed data model

## Setup

1. Copy env values:
   - `cp .env.example .env`
2. Create database and run schema:
   - `createdb pern_app`
   - `npm run db:schema`
3. Seed demo data:
   - `npm run db:seed`
4. Build frontend:
   - `npm run build:web`
5. Start API + static site:
   - `npm run dev` (API) or `npm start`
6. Open `http://localhost:4000`

## Frontend Development

- Run React app in dev mode with hot reload:
  - `npm run dev:web`
- Vite app root is `frontend/` and components live in `frontend/src/components`.
- API calls are proxied from Vite to `http://localhost:4000`.

## Demo Accounts

- Admin: `admin@example.com` / `password123`
- Customer: `customer@example.com` / `password123`
