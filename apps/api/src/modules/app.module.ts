import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { HelloResolver } from '../resolvers/hello.resolver';
import {
  UserSkillResolver,
  ExperienceResolver,
  EducationResolver,
} from '../resolvers/resume/resume.resolver';
import { ContentResolver } from '../resolvers/content/content.resolver';
import { ContactResolver } from '../resolvers/contact/contact.resolver';
import { BookingResolver } from '../resolvers/booking/booking.resolver';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

import { HealthModule } from './health/health.module';
import { ContactModule } from './contact/contact.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    HealthModule,
    ContactModule,
    WebhookModule,
    AuthModule,
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      subscriptions: {
        'graphql-ws': true,
      },
      context: ({ req }: { req: Request }) => ({ req }),
    }),
  ],
  providers: [
    HelloResolver,
    UserSkillResolver,
    ExperienceResolver,
    EducationResolver,
    ContentResolver,
    ContactResolver,
    BookingResolver,
  ],
})
export class AppModule {}
