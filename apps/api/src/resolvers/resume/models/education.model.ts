import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Education {
  @Field(() => ID)
  id!: string;

  @Field()
  userId!: string;

  @Field()
  institution!: string;

  @Field({ nullable: true })
  degree?: string | null;

  @Field({ nullable: true })
  field?: string | null;

  @Field()
  startDate!: Date;

  @Field({ nullable: true })
  endDate?: Date | null;

  @Field({ nullable: true })
  location?: string | null;

  @Field({ nullable: true })
  gpa?: string | null;

  @Field({ nullable: true })
  honors?: string | null;
}
