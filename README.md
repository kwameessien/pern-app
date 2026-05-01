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

## Next Steps

- Set up the Express API in `server/` if it is not initialized yet.
- Add environment variables in local `.env` files.
- Connect the Next.js client to the server API.

