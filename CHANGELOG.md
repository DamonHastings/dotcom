# Changelog

All notable changes to this project will be documented in this file.

The format follows Conventional Commits.

## Unreleased
- (pending)

## 2025-11-19

### Features
- feat(admin): add server-side admin actions and UI (`94a31c1`)
- feat(api): add AdminGuard and protect adminLeads; send admin secret from server admin page (`f041be0`)
- feat(api): verify Calendly webhook signature when CALENDLY_WEBHOOK_SECRET set (`83fccac`)
- feat(api): add Calendly webhook endpoint to upsert bookings (`027863a`)
- feat(api): add booking GraphQL queries and confirm/cancel mutations (`311fe3b`)

### Bug Fixes
- fix(api): relax LeadResolver return type to avoid prisma client type export mismatch (`f3cfbd8`)

### CI
- ci(docker): use debian-slim node image and build api with workspace build to avoid Alpine build issues (`7735ee4`)
- ci(deploy): lowercase GHCR owner in image tags (`4dd4761`)
- ci(deploy): lowercase GHCR owner in image tags (`6d1283e`)

### Chores
- chore(web): fix eslint import order and replace any types in admin UI (`7fe0419`)
- chore(api): fix content resolver types and webhook upsert handling (`3a11945`)

## 2025-11-17

### Features
- feat(api): enhance app-test factory with improved formatting and close method fix(api): correct tsconfig formatting for types array feat(web): add contact page with lead submission functionality docs: create API reference documentation with example queries and mutations docs: add architecture overview and component responsibilities docs: establish contributing guidelines for project collaboration docs: outline deployment steps and environment variable requirements docs: define project roadmap with epics and sprint planning docs: provide instructions for running the project locally docs: create technical design document detailing project objectives and architecture docs(diagrams): add web content architecture diagram chore: update package-lock.json and package.json for turbo integration fix(config): add development defaults for environment variables chore: initialize turbo configuration for task management (`749b713`)

### Other
- style: format code for better readability in contact resolver and contact page (`ac9e6a2`)

## 2025-09-20

### Features
- feat(config): add zod-based environment validation and integrate in API (`3c6e723`)
- feat(api): add contact REST endpoint with validation stub (`b8585c5`)

### Tests
- test(api): add jest setup, e2e tests for auth, content, contact (`1651f87`)

### Chores
- chore(prisma): re-enable shadowDatabaseUrl and update env example (`38924c3`)

## 2025-09-19

### Features
- feat(api,web): add project & blog list/detail queries and frontend pages (`1b09e5d`)
- feat(web): add initial GraphQL integration for resume and projects pages (`167a6fb`)
- feat(api): add protected CRUD mutations for Project and BlogPost (`2e8ab80`)
- feat(api): add JWT admin auth (login, me) with guard & strategy (`0fc97e9`)
- feat(api): add GraphQL resume queries (skills, experiences, education) (`54a916a`)
- feat(api): add resume domain models, migrations, and seed; docs: add prisma auth troubleshooting; chore: update infra compose and config (`ce98b5f`)
- feat(api): add Prisma schema (Postgres target) and database layer docs (`f8c25f9`)

### Bug Fixes
- fix(api): add explicit GraphQL scalar annotations to resolve UndefinedTypeError (`372c945`)

### Documentation
- docs(changelog): initialize CHANGELOG with recent commits (`089ae59`)

### Chores
- chore(changelog): add npm scripts and CI workflow for changelog verification (`c12c013`)
- chore(changelog): add automated generation script and regenerate log (`01243aa`)
- chore(repo): lint fixes, ESLint config for App Router, README updates; deps reinstalled (`f6a31a6`)
- chore(ci): add release drafter, dependabot, and CI badge (`e5b1597`)
- chore: initial commit (scaffold monorepo: web, api, shared packages, infra, ci) (`f86c351`)
