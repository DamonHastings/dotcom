import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/modules/app.module';
import request from 'supertest';

export interface AuthTokens { token: string }

export class AppTestFactory {
  app!: INestApplication;

  async init() {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    this.app = moduleRef.createNestApplication();
    await this.app.init();
    return this;
  }

  async close() { await this.app.close(); }

  gql(query: string, variables?: Record<string, unknown>) {
    return request(this.app.getHttpServer())
      .post('/graphql')
      .send({ query, variables });
  }

  http() { return request(this.app.getHttpServer()); }
}
