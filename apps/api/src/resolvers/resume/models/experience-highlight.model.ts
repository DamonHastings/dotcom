import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ExperienceHighlight {
  @Field(() => ID)
  id!: string;

  @Field()
  experienceId!: string;

  @Field()
  order!: number;

  @Field()
  text!: string;
}
