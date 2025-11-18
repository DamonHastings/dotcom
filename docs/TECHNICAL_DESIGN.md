# Technical Design Document

**Project:** Personal marketing website — creative marketing design, multimedia production, and software consulting

**Author:** Damon Hastings

**Date:** 2025-11-17

## Objective

Build a marketing website that showcases services (creative marketing design, multimedia production, software development). Visitors should be able to browse work, complete a project questionnaire, and request a consultation (book a meeting). The site must be easy to maintain, secure, and scaleable for future growth.

## Scope

- Public website (Next.js): content pages, case studies, blog, resume
- Contact / intake form for project briefs
- Booking/consultation scheduling (Calendly embed or custom booking)
- Admin area / API to manage content (optional MVP: local scripts + Prisma seed)
- Data capture stored in Postgres via Prisma

## High-level architecture

See `docs/diagrams/web.drawio` for a visual diagram. Key components:

- Frontend: `apps/web` — Next.js (App Router), static and dynamic pages, GraphQL client
- Backend: `apps/api` — NestJS GraphQL API, Prisma ORM, business logic and auth
- Database: Postgres (local dev via `infra/docker-compose.yml`, production via managed DB)
- Cache: Redis (sessions, rate-limiting)
- File storage: S3-compatible (uploads for attachments or multimedia)
- Email: transactional provider (SendGrid, Postmark, or similar)
- Scheduling: Calendly embed + webhook to capture bookings, or custom booking service using Google Calendar API

## Data Model (Prisma)

Core models required for MVP: `Lead`, `Booking`, `Project`, `BlogPost`, `User` (admin). Keep models minimal and extendable.

Prisma schema snippet (example):

```prisma
model Lead {
  id         String   @id @default(cuid())
  name       String
  email      String
  company    String?
  website    String?
  message    String   // short project summary
  budget     String?
  timeline   String?
  source     String?  // 'website' | 'calendly' | 'email'
  utm        Json?    // optional UTM fields
  createdAt  DateTime @default(now())
  contacted  Boolean  @default(false)
}

model Booking {
  id         String   @id @default(cuid())
  leadId     String?
  lead       Lead?    @relation(fields: [leadId], references: [id])
  provider   String   // 'calendly' | 'google' | 'manual'
  startAt    DateTime
  endAt      DateTime
  timezone   String
  status     String   // 'booked' | 'cancelled' | 'rescheduled'
  createdAt  DateTime @default(now())
}

model Project {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  summary     String
  content     String   // MDX or HTML
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model User {
  id       String @id @default(cuid())
  email    String @unique
  name     String?
  password String? // hashed, only for admin local auth (avoid storing cleartext)
}
```

Notes:

- Store attachments as metadata (URL, size, mime) in a `Json` field or a separate `File` model if needed.
- Keep UTM/referrer data to help with lead attribution.

## API design

Prefer GraphQL (already present) for the public API and simple REST endpoints for webhooks.

GraphQL entrypoints (examples):

- Query `publishedPosts(limit, cursor)` → list of `BlogPost`
- Query `project(slug)` → `Project`
- Mutation `submitLead(input: LeadInput!)` → returns `Lead` id
- Mutation `createBookingFromWebhook(payload: CalendlyPayload!)` → creates `Booking`

Sample GraphQL mutation to capture a lead (used by the contact form):

```graphql
mutation SubmitLead($input: LeadInput!) {
  submitLead(input: $input) {
    id
    createdAt
  }
}
```

REST webhook endpoints:

- POST `/webhooks/calendly` — receive Calendly booking events (verify with Calendly signing key), write `Booking` record, link to `Lead` if possible, notify admin.

Security and validation:

- All form inputs must be validated server-side (use `zod` or `class-validator`).
- Apply rate limits (Redis-backed) to contact endpoints to avoid abuse.
- Use reCAPTCHA or hCaptcha on the public form.

## Frontend: pages & components

Pages (MVP):

- `/` — Hero, value proposition, CTA to schedule or open contact form
- `/about` — bio, values, resume download
- `/projects` → list, `/projects/[slug]` → case study page
- `/blog` → list, `/blog/[slug]`
- `/contact` — short contact form + link to `book` page
- `/book` — embedded Calendly widget or custom booking UI

Key components:

- `Hero` — headline, CTAs
- `CaseStudyCard` / `ProjectPage` — images, problem → solution → outcomes
- `ContactForm` — progressive questionnaire (short first, expand for details)
- `BookingWidget` — Calendly embed or custom schedule UI

ContactForm UX:

- Step 1: Basic info (name, email, one-line summary)
- Step 2 (optional advanced): budget, timeline, attachments (presigned upload)
- Final: confirmation & suggested next steps (Calendly link or thank-you message)

Client-side validation and optimistic UX — show spinner and confirmation; save partial answers to localStorage if user leaves mid-flow.

## Attachments & Uploads

- Use S3 presigned URLs for direct uploads from the client to avoid routing large files through the API.
- Enforce size and type limits server-side and in the upload policy (e.g., max 10 MB, allowed types: pdf, png, jpg, mp4).

## Scheduling integration

Options:

1. Calendly (recommended MVP):
   - Embed Calendly widget on `/book` or use a CTA to open overlay.
   - Configure Calendly webhook to POST booking events to `/webhooks/calendly`.
   - On webhook: create `Booking` record, attach `Lead` if present (match by email), send admin notification.

2. Custom scheduler (later):
   - Use Google Calendar API with OAuth, implement availability logic, handle timezone conversions, and create calendar events.

Calendly is faster to implement and lowers maintenance.

## Security

- HTTPS everywhere; rely on host-managed TLS (Vercel, Cloud Run load balancer).
- Store secrets in the hosting provider secret store (Vercel envs, Cloud Run secrets, GitHub Actions secrets).
- Input validation, parameterized DB queries (Prisma handles this), limit file upload sizes.
- Use CSP headers and sanitize any HTML/MDX rendered from content.

## Observability & Monitoring

- Add request logging (structured JSON) at API layer.
- Add Sentry for error tracking, and optional OpenTelemetry for traces.
- Add Prometheus metrics for request counts, latencies, DB connection counts; export via a `/metrics` endpoint if hosting supports it.

## Dev & Local setup

Follow `docs/RUNNING_LOCALLY.md`. Important commands:

```bash
# start local services
docker compose -f infra/docker-compose.yml up -d

# generate client & apply migrations
cd apps/api
npx prisma generate
npx prisma migrate dev
npm run db:seed

# run both web & api
npm run dev
```

Dev notes: if you get `PrismaClientInitializationError: Can't reach database server at 127.0.0.1:5432` (P1001), ensure Docker compose is running and that `DATABASE_URL` host matches the container host. On macOS, `127.0.0.1:5432` should map to the container's forwarded port when `ports: '5432:5432'` is configured.

## Deployment

Recommended stack:

- Frontend: Vercel (Next.js optimized hosting) — automatic builds on push
- Backend: Google Cloud Run / AWS Fargate / Heroku Container — containerized NestJS API
- Database: Managed Postgres (Cloud SQL, RDS) with daily backups
- Redis: Managed Redis (ElastiCache / Memorystore)
- Storage: S3 or compatible (Backblaze/Wasabi) for uploads

Deployment steps (CI):

1. Run `npm test`, `npm run lint`, `npm run typecheck`.
2. Build artifacts: `npm run build` (monorepo) or let Vercel build the frontend.
3. Run `npx prisma migrate deploy` against production DB.
4. Deploy API container and update envs.

## CI/CD

- Use GitHub Actions (CI already present) or other CI to run tests and build.
- Add a job to run `prisma migrate status` and fail the pipeline if migrations are not applied.

## Backup & Maintenance

- Daily DB backups with point-in-time restore if provider supports it.
- Periodic `prisma migrate status` checks before releases.
- Monitor disk usage for attachments and implement lifecycle rules on S3 (move to Glacier/Cold storage after 90 days) if needed.

## Cost & Scaling considerations

- Initially serve on Vercel (free/low-cost tiers) and managed Cloud SQL single-node for small traffic.
- For higher scale: use read replicas, connection pooling (PgBouncer), and upgrade Redis.

## Rollout plan & timeline (2-week MVP)

Week 1 — MVP

- Static frontend pages: Home, About, Projects list + project pages
- Contact form + Lead capture stored in DB
- Calendly embed + webhook to capture bookings
- Deploy to staging (Vercel + Cloud Run), ensure envs and migrations run

Week 2 — Polish & Admin

- Add blog and CMS workflow (MDX or headless CMS)
- Add seed & admin auth for content updates
- Add automated tests, monitoring, and CI migration checks

## Appendix: Environment variables

- `DATABASE_URL` — Postgres connection string
- `SHADOW_DATABASE_URL` — for Prisma migrations
- `REDIS_URL` — Redis connection
- `JWT_SECRET` — JWT signing secret
- `NEXT_PUBLIC_API_URL` — GraphQL API URL for frontend
- `SENDGRID_API_KEY` (or other mail provider)
- `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY`, `S3_SECRET`
- `CALENDLY_WEBHOOK_SECRET` — for verifying webhook signatures

## Appendix: Sample GraphQL LeadInput type

```graphql
input LeadInput {
  name: String!
  email: String!
  company: String
  website: String
  message: String!
  budget: String
  timeline: String
}
```

---

If you'd like, I can:

- Export `docs/diagrams/web.drawio` to `docs/diagrams/web-content-architecture.png` and include it in `ARCHITECTURE.md`.
- Generate Prisma migration and add `Lead` and `Booking` models to `apps/api/prisma/schema.prisma` (I can draft a patch).
- Implement the contact handler and the Calendly webhook endpoint.

Which of these next steps should I take for you?
