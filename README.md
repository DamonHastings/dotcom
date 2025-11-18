# Personal Career Web Application Monorepo

![CI](https://github.com/Since84/dotcom/actions/workflows/ci.yml/badge.svg)

This repository hosts a full‑stack portfolio and career development platform. It showcases engineering skill through real production‑style architecture, code quality, testing, and DevOps practices.

See `DevPlan.md` for the strategic product & feature roadmap.

## Structure

```
apps/
  web/                # Next.js (App Router) frontend
  api/                # NestJS backend (REST + GraphQL)
packages/
  ui/                 # Shared React components library
  config/             # Env/config loader utilities
infra/
  docker-compose.yml  # Local Postgres + Redis
  Dockerfile.web
  Dockerfile.api
DevPlan.md            # Product & feature roadmap
```

## Tech Stack

Frontend: Next.js, React, TailwindCSS, shadcn/ui
Backend: NestJS, GraphQL, REST, PostgreSQL, Redis
Tooling: TypeScript, ESLint, Prettier, Jest, Docker

## Getting Started (Monorepo)

1. Install Node.js (>= 20 LTS recommended) & Docker (optional for DB/cache).
2. Clone & install:

```bash
git clone <REPLACE_WITH_YOUR_REPO_URL>.git
cd <repo>
npm install
cp .env.example .env
```

3. (Optional) Start local dependencies (Postgres + Redis):

```bash
docker compose -f infra/docker-compose.yml up -d
```

4. Run both frontend & backend:

```bash
npm run dev
```

5. Visit:

```
Web: http://localhost:${WEB_PORT:-3000}
API Health: http://localhost:${API_PORT:-4000}/health
GraphQL Playground: http://localhost:${API_PORT:-4000}/graphql
```

## Documentation

More detailed developer and operational documentation is available in the `docs/` folder. Key guides:

- `docs/RUNNING_LOCALLY.md` — quickstart for local development (Docker, env, Prisma, seeding).
- `docs/ARCHITECTURE.md` — high-level architecture, diagrams, data flow, and component responsibilities.
- `docs/API_REFERENCE.md` — GraphQL entry points, sample queries/mutations, and auth notes.
- `docs/CONTRIBUTING.md` — how to contribute, run tests, lint, and create PRs.
- `docs/DEPLOYMENT.md` — build and deployment checklist, production envs, and migration steps.

If you prefer a docs site later, these Markdown files can be published with MkDocs or Docusaurus.

## Scripts (Root)

| Script                    | Purpose                                 |
| ------------------------- | --------------------------------------- |
| `npm run dev`             | Run web & api in parallel               |
| `npm run dev:web`         | Dev server for Next.js app              |
| `npm run dev:api`         | Dev server for NestJS API               |
| `npm run build`           | Build all workspaces                    |
| `npm run migration:check` | Verify Prisma schema applied (no drift) |
| `npm test`                | Run all Jest tests                      |
| `npm run lint`            | ESLint across repo                      |
| `npm run format`          | Prettier write                          |
| `npm run typecheck`       | TypeScript project references check     |

## Environment Variables

Copy `.env.example` to `.env` in the root (and/or each app) then adjust.

| Variable       | Description                                |
| -------------- | ------------------------------------------ |
| `DATABASE_URL` | PostgreSQL connection string               |
| `REDIS_URL`    | Redis connection URL                       |
| `API_PORT`     | Port for NestJS API (default 4000)         |
| `WEB_PORT`     | Port for Next.js dev server (default 3000) |
| `NODE_ENV`     | One of `development`, `production`, `test` |

## Testing Strategy

- Unit tests colocated near code (e.g. `*.test.ts`).
- API integration tests (supertest) under `apps/api/test`.
- Frontend component tests (React Testing Library) under `apps/web/__tests__`.
- Code coverage aggregated at root (future: badge in README / CI).

Run all tests:

```bash
npm test
```

Watch mode (example):

````bash
npx jest apps/api --watch

Note: You may see ts-jest warnings about hybrid module kind; to silence, set `"isolatedModules": true` in your `tsconfig.json` (root or per-package). This is optional and non-blocking.

## ESLint & Next.js App Router

This repo uses Next.js App Router (no `pages/` directory). To align ESLint:

- Disabled `next/no-html-link-for-pages` since `pages/` isn’t used.
- Set `settings.next.rootDir = ['apps/*/']` in `.eslintrc.cjs` to point the Next plugin at the app workspaces.
- Import order is enforced (`import/order`) with alphabetized groups and mandatory blank lines between groups.
- Disabled `import/no-named-as-default` to avoid noise for packages like `clsx`.

Quick checks:

```bash
npm run lint
npm run typecheck
````

## Database Layer (Prisma)

The backend (`@apps/api`) uses Prisma as the ORM. Default target is PostgreSQL for production, but you can temporarily switch to SQLite for rapid local iteration.

### Switching Between Postgres and SQLite

Postgres (default / recommended):

1. Set `DATABASE_URL` in either root `.env` or `apps/api/prisma/.env`:

```env
DATABASE_URL=postgresql://appuser:password@localhost:5432/career_platform
```

2. Ensure Postgres is running (Docker compose service `db`):

```bash
docker compose -f infra/docker-compose.yml up -d db
```

3. Apply migrations:

```bash
npx -w @apps/api prisma migrate dev -n init
npm -w @apps/api run db:seed
```

SQLite (fast local fallback):

1. Edit `apps/api/prisma/schema.prisma` datasource:

```prisma
datasource db { provider = "sqlite" url = env("DATABASE_URL") }
```

2. Set local file DB URL `apps/api/prisma/.env`:

```env
DATABASE_URL="file:./dev.db"
```

3. Reset & migrate:

```bash
npx -w @apps/api prisma migrate dev --name init
npm -w @apps/api run db:seed
```

### Migrations Workflow

Generate + apply new migration after model changes:

```bash
npx -w @apps/api prisma migrate dev -n add_feature
```

Open Prisma Studio:

```bash
npm -w @apps/api run prisma:studio
```

Check for migration drift (ensures all schema changes are represented by committed migrations):

```bash
npm run migration:check
```

If this exits with a non-zero code in CI, create a new migration with `prisma migrate dev` and commit it.

### Seeding

The seed script (`apps/api/prisma/seed.ts`) creates:

- A default user (damon@example.com)
- Tags (nextjs, nestjs, graphql)
- One project & one blog post

Re-run seed (will upsert records):

```bash
npm -w @apps/api run db:seed
```

### Production Notes

- Use managed Postgres (RDS, Neon, Supabase, etc.).
- Run `prisma migrate deploy` in CI/CD for production.
- Maintain separate `.env.production` with secure credentials.
- Consider connection pooling (pgBouncer) if deploying serverless.

#### Troubleshooting: Prisma Auth Failures (P1000/P1010)

If you see `P1000: Authentication failed` but your `prisma/.env` credentials look correct, check whether you have a shell-exported `DATABASE_URL` or `SHADOW_DATABASE_URL` (for example in `~/.zshrc`). An exported variable will override the value loaded from `apps/api/prisma/.env` and can silently point Prisma at stale credentials. Fix by:

```bash
unset DATABASE_URL SHADOW_DATABASE_URL
```

Then re-run:

```bash
npm -w @apps/api run prisma:migrate
```

Add a precautionary note for contributors not to `export` these values globally; prefer per-project `.env` files.

````

## Roadmap Alignment

MVP scope to be delivered first:

- Interactive resume & portfolio
- Blog (Markdown)
- Secure contact form

Subsequent phases integrate analytics dashboards, booking system, and DevOps observability showcase.

## Conventions

- Commit messages: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.).
- Branching: GitHub Flow (feature -> PR -> main).
- Import resolution: path aliases via `@api/*`, `@web/*`, `@ui/*`, `@config/*`.
- Absolute imports prefer stable shared packages over deep relative paths.

## Docker Production Build (Preview)

Build images (after code exists):

```bash
docker build -f infra/Dockerfile.api -t career-api:local .
docker build -f infra/Dockerfile.web -t career-web:local .
````

Run containers:

```bash
docker run --rm -p 4000:4000 --env-file .env career-api:local
docker run --rm -p 3000:3000 --env-file .env career-web:local
```

## Deprecation & Modernization Plan

This repository intentionally begins lean; several tooling choices will evolve.

| Area                    | Current                 | Issue / Risk                | Planned Action                                                     |
| ----------------------- | ----------------------- | --------------------------- | ------------------------------------------------------------------ |
| Task orchestration      | `npm-run-all`           | Legacy, no caching          | Migrate to `turbo` (preferred) or `concurrently` Q1 next iteration |
| Apollo Server           | v4 via `@nestjs/apollo` | v4 EOL Jan 2026             | Track Nest + Apollo v5 migration; upgrade before Q4 2025           |
| GraphQL Playground      | Enabled (legacy)        | Unmaintained                | Replace with Apollo Sandbox plugin soon                            |
| Env loading             | Ad hoc root `.env`      | Shell mismatch for scripts  | Introduce validated loader + per-app `.env.local` pattern          |
| Dockerfiles duplication | Separate build logic    | Repeated dependency install | Create shared base stage or multi-project builder                  |
| ESLint config (v8)      | Legacy style            | Flat config ecosystem shift | Migrate after core feature MVP (target: later phase)               |
| Missing DB layer        | None yet                | Hard to persist content     | Introduce Prisma + migrations for PostgreSQL early MVP             |
| No CI pipeline          | Manual only             | Risk of regressions         | Add GitHub Actions: lint → typecheck → test → build → docker       |

### Short-Term Enhancements

1. Add Prisma schema for `User`, `Project`, `BlogPost`.
2. Replace Playground with Apollo Sandbox.
3. Introduce `turbo.json` for pipeline caching.
4. CI workflow with matrix Node versions (18, 20).
5. Basic accessibility audit (Lighthouse) integrated into CI.

### Longer-Term

- Observability integration (OpenTelemetry traces → collector → backend).
- Production Docker multi-stage optimizing layer cache reuse.
- Analytics event pipeline (queue + aggregator service) once traffic instrumentation begins.

Create GitHub issues to track each item and reference this section for rationale.

## License

Proprietary © 2025 Damon Hastings. Select components may later be open‑sourced with notice.

---

Auto‑generated initial scaffold. Expand as code is added.
