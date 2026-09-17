# JalMap Backend

A production-ready backend for the JalMap water quality dashboard.

## Tech stack
- Node.js
- Express.js
- PostgreSQL
- Prisma or raw SQL compatible with Supabase
- Supabase realtime ready integration

## Setup

1. Install dependencies:
   npm install

2. Create a `.env` file from `.env.example` and fill in your values.

3. Start PostgreSQL locally or use a Supabase project.

4. Apply the database schema:
   npm run db:push

5. Seed sample data:
   npm run db:seed

6. Start the API:
   npm run dev

## Environment variables
- DATABASE_URL
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- PORT

## API routes
- GET /api/health
- GET /api/states
- GET /api/states/:id
- POST /api/states
- PUT /api/states/:id
- DELETE /api/states/:id
- GET /api/cities
- GET /api/cities/:id
- POST /api/cities
- PUT /api/cities/:id
- DELETE /api/cities/:id

## Realtime
The API is designed to support Supabase Realtime or WebSocket updates. When the database changes, clients can subscribe to state and city updates and refresh the dashboard instantly.

## Frontend compatibility
The API response shape matches the current frontend expectations:
- state: { id, name, lat, lng, overallRisk, cities }
- city: { name, district, lat, lng, source, tds, ph, turbidity, fluoride, nitrate, arsenic, risk, reason, contaminants, updated }

