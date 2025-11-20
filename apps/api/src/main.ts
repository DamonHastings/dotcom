import 'reflect-metadata';
import path from 'path';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { loadEnv, required } from '@packages/config';

async function bootstrap() {
  // Ensure we load the .env file from the API package root (apps/api/.env)
  // when running workspace scripts from the repo root. The config helper
  // defaults to process.cwd(), which is the repo root during npm workspace
  // execution — here we explicitly point it to the package directory.
  const packageRoot = path.resolve(__dirname, '..');
  loadEnv(packageRoot);
  const app = await NestFactory.create(AppModule, { cors: true });

  // Capture raw body for webhook signature verification
  // Store raw body string on `req.rawBody` for use in controllers.
  app.use(
    express.json({
      verify: (req: any, _res, buf: Buffer) => {
        req.rawBody = buf.toString();
      },
    }),
  );
  const port = Number(required('API_PORT')) || 4000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
}

bootstrap();
