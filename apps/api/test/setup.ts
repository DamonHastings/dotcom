import 'reflect-metadata';
import { execSync } from 'node:child_process';

// Ensure database is migrated before tests (idempotent)
try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit', cwd: process.cwd() });
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('Failed to run prisma migrate deploy in test setup:', e);
}
