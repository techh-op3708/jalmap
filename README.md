# JalMap

JalMap is a water-quality monitoring dashboard for exploring risk levels, water-quality indicators, and state/city data across India.

## Current status

This is an active work in progress. The frontend currently includes the dashboard, India overview/map, state details, risk badges, charts, and sample/live data provider wiring. The backend contains an Express API with Prisma/Supabase-compatible database schemas and seed data.

## Tech stack

- React, TypeScript, Vite, and Tailwind CSS
- React Router, Leaflet, and Recharts
- Express, Prisma, PostgreSQL/Supabase

## Run the frontend

From the project root:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

Useful checks:

```bash
npm run typecheck
npm run build
npm run lint
```

## Run the backend

The backend has its own dependencies and environment file:

```bash
cd backend
npm install
copy .env.example .env
```

Fill in the database and Supabase values in `backend/.env`, then apply and seed the database if required:

```bash
npm run db:push
npm run db:seed
npm run dev
```

The API runs on the configured `PORT` and exposes health, state, and city routes under `/api`.

## Frontend routes

- `/` - Dashboard
- `/overview` - India overview and map
- `/map/:stateId` - Map focused on a state
- `/state/:stateId` - State details

## Environment and generated files

Do not commit secrets. Local `.env` files, `node_modules`, build output, and Vite cache files are excluded by `.gitignore`. Use `backend/.env.example` as the backend configuration template.

## GitHub

Repository: [techh-op3708/jalmap](https://github.com/techh-op3708/jalmap)