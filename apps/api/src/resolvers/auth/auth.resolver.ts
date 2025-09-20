import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '../../modules/auth/auth.service';
import { LoginInput } from './dto/login.input';
import { AuthPayload, AuthUser } from './models/auth-payload.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../modules/auth/gql-auth.guard';
import { CurrentUser } from '../../modules/auth/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private auth: AuthService) {}

  @Mutation(() => AuthPayload, { name: 'login' })
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    return this.auth.login(input.username, input.password);
  }

  @Query(() => AuthUser, { name: 'me' })
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: any): AuthUser {
    return user;
  }
}
