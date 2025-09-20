import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { loadEnv, required } from '@packages/config';

async function bootstrap() {
  loadEnv();
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = Number(required('API_PORT')) || 4000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
}

bootstrap();
