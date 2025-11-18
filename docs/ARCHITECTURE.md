# Architecture

This file describes the high-level architecture of the project, component responsibilities, and data flow.

Overview

- `apps/web` — Next.js (App Router) public site. Contains pages, client GraphQL queries, and UI components.
- `apps/api` — NestJS backend exposing GraphQL (and REST endpoints). Uses Prisma for database access.
- `packages/*` — Shared code (UI, config) used by both web and api where applicable.
- `infra/docker-compose.yml` — Local dev services (Postgres, Redis).

Diagram

The main diagram is at `docs/diagrams/web.drawio`. It shows the flow:

```
Frontend (Next.js pages) -> GraphQL client -> API (NestJS resolvers) -> Prisma -> Postgres
```

Data Layer / Models

- Prisma schema is located at `apps/api/prisma/schema.prisma` and contains models such as `User`, `BlogPost`, `Project`, resume domain models, and join tables.
- Database access is performed using the generated Prisma client (`@prisma/client`).

Auth & Admin

- JWT-based admin authentication is available for admin routes (see `DevPlan.md` and `apps/api` auth modules).
- Admin credentials used for local seed are in `apps/api/prisma/seed.ts` and environment variables (`ADMIN_USERNAME`, `ADMIN_PASSWORD`).

Deployment boundaries

- The web app can be deployed to Vercel/Netlify or a static host.
- The API is suitable for a container or serverless deployment (requires Prisma connection to a production Postgres instance).

Observability & Monitoring

- Add logging and traces at API/resolver boundaries.
- In production, forward logs to a central service and add uptime checks for the API.
