# SQL Migrations

This folder contains SQL scripts for creating database tables.

## Files

- `create_todos_table.sql`
- `create_users_table.sql`

## Run Migrations Locally

From the repo root:

```bash
psql -d pern_app -f server/sql/create_todos_table.sql
psql -d pern_app -f server/sql/create_users_table.sql
```

## Run Migrations on Render Postgres

1. In Render, open your Postgres service (`pern-db`) and copy the **External Database URL**.
2. Export it as `DATABASE_URL` in your terminal:

```bash
export DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DATABASE"
```

3. Run migrations from the repo root:

```bash
psql "$DATABASE_URL" -f server/sql/create_todos_table.sql
psql "$DATABASE_URL" -f server/sql/create_users_table.sql
```

## Verify Tables

```bash
psql "$DATABASE_URL" -c "\d todos"
psql "$DATABASE_URL" -c "\d users"
```
