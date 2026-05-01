# PERN App

Monorepo structure for a Next.js client and Node/Express server.

## Project Structure

```text
.
├── client/    # Next.js app (App Router)
└── server/    # Node/Express API
```

## Getting Started

### 1) Clone and open the project

```bash
git clone <your-repo-url>
cd pern-app
```

### 2) Set up the Next.js client

```bash
cd client
npm install
npm run dev
```

The client runs at `http://localhost:3000` by default.

### 3) Set up the server

```bash
cd server
npm install
npm run dev
```

The API runs at `http://localhost:5000` by default.

## Environment Variables

Server (`server/.env`):
- `PORT` (default `5000`)
- `PGHOST`
- `PGPORT`
- `PGDATABASE`
- `PGUSER`
- `PGPASSWORD`
- `JWT_SECRET`

Client (`client/.env.local`):
- `NEXT_PUBLIC_API_URL` (example: `http://localhost:5000`)

Use the provided examples:
- `server/.env.example`
- `client/.env.example`

## Deploy on Render

Platform choice: Render.

This repo now includes `render.yaml` so Render can provision:
- a Node web service for the API (`pern-api`)
- a Node web service for the Next.js app (`pern-client`)
- a managed Postgres database (`pern-db`)

Deploy steps:
- Push this repo to GitHub
- In Render, create a new Blueprint and select the repo
- Render will read `render.yaml` and create services/resources
- After deploy, run SQL migrations against the Render Postgres database

Render environment variables are defined in `render.yaml`:
- API service gets DB credentials from `pern-db`
- API service gets generated `JWT_SECRET`
- Client gets `NEXT_PUBLIC_API_URL` from the API service URL

## Recommended Root Scripts

Add a root `package.json` so you can run both apps without changing directories.

```json
{
  "name": "pern-app",
  "private": true,
  "scripts": {
    "dev:client": "npm run dev --prefix client",
    "build:client": "npm run build --prefix client",
    "start:client": "npm run start --prefix client"
  }
}
```

Then run commands from the repo root, for example:

```bash
npm run dev:client
```

For server commands, also add:

```json
"dev:server": "npm run dev --prefix server",
"start:server": "npm run start --prefix server"
```

## Next Steps

- Set up the Express API in `server/` if it is not initialized yet.
- Add environment variables in local `.env` files.
- Connect the Next.js client to the server API.

