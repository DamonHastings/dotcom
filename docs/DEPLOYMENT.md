# Deployment

This document outlines recommended deployment steps and a minimal checklist for production deployment.

Build & Release (example)

1. Ensure all migrations are applied and committed.

```bash
# From repo root (or workspace)
npm run build
```

2. Run Prisma migrations against production database

```bash
cd apps/api
npx prisma migrate deploy
```

3. Seed (if required / one-off) — use with caution in production

```bash
npm --workspace @apps/api run db:seed
```

Environment variables (production)

- `DATABASE_URL` — connection to production Postgres instance
- `SHADOW_DATABASE_URL` — optional shadow DB for migrations
- `REDIS_URL` — URL to production Redis (sessions, cache)
- `JWT_SECRET` — secure random secret for JWT signing
- `NEXT_PUBLIC_API_URL` — public GraphQL API URL used by the frontend

Recommended deployment patterns

- Frontend: deploy `apps/web` to Vercel/Netlify for automatic builds on push.
- Backend: deploy `apps/api` as a container (Docker) to ECS/GKE/Cloud Run or as a managed Node service.

CI checklist

- Run `npm test` and `npm run lint` in CI.
- Run `npm run migration:check` to ensure no migration drift.
- Build artifacts and publish container images or let Vercel build the frontend.

Rollbacks

- Keep database migrations backward-compatible where possible. If a migration is destructive, provide a rollback plan.

Secrets management

- Keep secrets in the hosting platform’s secret store and avoid committing them to the repo.
