import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthUser {
  @Field()
  id!: string;
  @Field()
  username!: string;
  @Field()
  role!: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken!: string;
  @Field(() => AuthUser)
  user!: AuthUser;
}
