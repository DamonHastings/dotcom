# Running Locally

This document describes the fastest way to get the monorepo running on your machine for local development.

Prerequisites

- Node.js 20+ (recommended)
- npm 10+
- Docker & Docker Compose (optional but recommended for DB + Redis)

1. Install dependencies

```bash
git clone <repo-url>
cd <repo>
npm install
```

2. Create environment

Copy the root `.env` template (there is a root `.env` in this repo — update values as needed):

```bash
cp .env .env.local
# Edit .env.local and set credentials (DATABASE_URL, JWT_SECRET)
```

3. Start local services (Postgres + Redis)

```bash
docker compose -f infra/docker-compose.yml up -d
```

Confirm Postgres is listening on `127.0.0.1:5432` and Redis on `6379`.

4. Generate Prisma client and apply migrations

Run from the repo root or from `apps/api` workspace:

```bash
cd apps/api
npx prisma generate
# If you changed models or need to apply migrations:
npx prisma migrate deploy
# For development you may use:
npx prisma migrate dev
npm run db:seed
```

5. Start development servers

From repo root:

```bash
npm run dev
```

This runs both the web and api dev servers in parallel:

- Web: `http://localhost:${WEB_PORT:-3000}`
- API: `http://localhost:${API_PORT:-4000}`

Troubleshooting

- Prisma P1001 (Can't reach database): ensure Docker compose is up and your `DATABASE_URL` points to the same host/port as the Postgres container. Example: `postgresql://appuser:xx12345xx@127.0.0.1:5432/career_platform`.
- If using Apple Silicon or M1/M2 and the `postgres:15-alpine` image fails, try `postgres:15` or set `platform: linux/amd64` in `infra/docker-compose.yml`.
- If you need to reset local DB (destructive):

```bash
cd apps/api
npx prisma migrate reset --force
npm run db:seed
```

Next steps

- See `docs/ARCHITECTURE.md` for component responsibilities and data flow.
- See `docs/API_REFERENCE.md` for GraphQL examples and auth notes.
