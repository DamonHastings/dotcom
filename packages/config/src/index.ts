import path from 'path';
import * as dotenv from 'dotenv';
import { z } from 'zod';

let loaded = false;

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().default(4000),
  WEB_PORT: z.coerce.number().optional(),
  DATABASE_URL: z.string().url(),
  SHADOW_DATABASE_URL: z.string().url().optional(),
  REDIS_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(16),
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default('1h'),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof schema>;
let parsed: Env | null = null;

export function loadEnv(rootDir: string = process.cwd()): Env {
  if (!loaded) {
    dotenv.config({ path: path.join(rootDir, '.env') });
    loaded = true;
    // Provide safe development defaults if running locally and vars missing
    const isDev = (process.env.NODE_ENV || 'development') !== 'production';
    if (isDev) {
      if (!process.env.JWT_SECRET) {
        // eslint-disable-next-line no-console
        console.warn('[env] Using generated dev JWT_SECRET. Set one in .env for consistency.');
        process.env.JWT_SECRET = 'dev_secret_change_me_please_1234567890';
      }
      if (!process.env.ADMIN_USERNAME) {
        // eslint-disable-next-line no-console
        console.warn('[env] Using default ADMIN_USERNAME=admin');
        process.env.ADMIN_USERNAME = 'admin';
      }
      if (!process.env.ADMIN_PASSWORD) {
        // eslint-disable-next-line no-console
        console.warn('[env] Using default ADMIN_PASSWORD=change_me_local_only');
        process.env.ADMIN_PASSWORD = 'change_me_local_only';
      }
    }
  }
  if (!parsed) {
    const result = schema.safeParse(process.env);
    if (!result.success) {
      const formatted = result.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('\n');
      throw new Error('Environment validation failed:\n' + formatted);
    }
    parsed = result.data;
  }
  return parsed;
}

export function getEnv(): Env {
  if (!parsed) throw new Error('Environment not loaded. Call loadEnv() first.');
  return parsed;
}

export function required(name: keyof Env): string | number {
  const env = getEnv();
  const val = env[name];
  if (val === undefined || val === null || val === '')
    throw new Error(`Missing required env var: ${name as string}`);
  return val as any;
}
