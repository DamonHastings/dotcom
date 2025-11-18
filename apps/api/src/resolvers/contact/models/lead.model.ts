import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LeadModel {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  source?: string;

  @Field({ nullable: true })
  resumeUrl?: string;

  @Field()
  createdAt!: Date;
}
