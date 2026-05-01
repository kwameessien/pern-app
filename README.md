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

### 3) Set up the server (pending initialization)

The `server/` folder is currently a placeholder and does not yet contain an Express app.
Initialize the backend first, then run install/dev commands there.

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

After the Express server is initialized, you can add:

```json
"dev:server": "npm run dev --prefix server",
"start:server": "npm run start --prefix server"
```

## Next Steps

- Set up the Express API in `server/` if it is not initialized yet.
- Add environment variables in local `.env` files.
- Connect the Next.js client to the server API.

