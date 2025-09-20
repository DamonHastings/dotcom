import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { HelloResolver } from '../resolvers/hello.resolver';
import { UserSkillResolver, ExperienceResolver, EducationResolver } from '../resolvers/resume/resume.resolver';
import { PrismaModule } from '../prisma/prisma.module';

import { HealthModule } from './health/health.module';

@Module({
  imports: [
    HealthModule,
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      subscriptions: {
        'graphql-ws': true,
      },
    }),
  ],
  providers: [HelloResolver, UserSkillResolver, ExperienceResolver, EducationResolver],
})
export class AppModule {}
