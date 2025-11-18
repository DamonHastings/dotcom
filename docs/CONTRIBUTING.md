# Contributing

Thanks for wanting to contribute — this project follows a straightforward workflow to keep the codebase healthy and reviewable.

Branching & PRs

- Create short-lived feature branches from `main`: `feature/<short-desc>` or `fix/<short-desc>`.
- Open a Pull Request targeting `main` and provide a concise description of the change and any manual verification steps.
- Use small, focused PRs. One logical change per PR is easier to review.

Local checks (before opening PR)

```bash
# Install dependencies
npm install

# Run lint and typecheck
npm run lint
npm run typecheck

# Run tests locally
npm test
```

Commit messages

- Use Conventional Commits (e.g., `feat(api): add resume queries`, `fix(web): correct a11y issue`).

Coding conventions

- TypeScript with strict types where practical.
- Follow ESLint and Prettier config (see root `package.json` scripts).

Secrets & Sensitive Data

- Never commit sensitive credentials or private keys. Use `.env` and ensure secrets are stored in your deployment platform (Vercel/Netlify/GCP/AWS Secrets Manager).

Code Review

- Provide a short description of the change and a testing checklist in the PR body.
- Reviewers will check functionality, tests, and security considerations (input validation, auth boundaries).

CI

- Unit and integration tests run in CI. Ensure tests are passing locally before pushing.
