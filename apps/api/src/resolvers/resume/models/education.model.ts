import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Education {
  @Field(() => ID)
  id!: string;

  @Field()
  userId!: string;

  @Field()
  institution!: string;

  @Field(() => String, { nullable: true })
  degree?: string | null;

  @Field(() => String, { nullable: true })
  field?: string | null;

  @Field()
  startDate!: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date | null;

  @Field(() => String, { nullable: true })
  location?: string | null;

  @Field(() => String, { nullable: true })
  gpa?: string | null;

  @Field(() => String, { nullable: true })
  honors?: string | null;
}
