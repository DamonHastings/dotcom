# Changelog

All notable changes to this project will be documented in this file.

The format follows Conventional Commits.

## Unreleased
- (pending)

## 2025-09-19

### Features
- feat(api): add JWT admin auth (login, me) with guard & strategy (`0fc97e9`)
- feat(api): add GraphQL resume queries (skills, experiences, education) (`54a916a`)
- feat(api): add resume domain models, migrations, and seed; docs: add prisma auth troubleshooting; chore: update infra compose and config (`ce98b5f`)
- feat(api): add Prisma schema (Postgres target) and database layer docs (`f8c25f9`)

### Documentation
- docs(changelog): initialize CHANGELOG with recent commits (`089ae59`)

### Chores
- chore(repo): lint fixes, ESLint config for App Router, README updates; deps reinstalled (`f6a31a6`)
- chore(ci): add release drafter, dependabot, and CI badge (`e5b1597`)
- chore: initial commit (scaffold monorepo: web, api, shared packages, infra, ci) (`f86c351`)
