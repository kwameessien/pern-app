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
4. Start app:
   - `npm run dev`
5. Open `http://localhost:4000`

## Demo Accounts

- Admin: `admin@example.com` / `password123`
- Customer: `customer@example.com` / `password123`
