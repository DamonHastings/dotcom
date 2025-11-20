import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BlogPostModel {
  @Field(() => ID)
  id!: string;
  @Field() slug!: string;
  @Field() title!: string;
  @Field(() => String, { nullable: true }) excerpt?: string | null;
  @Field() content!: string;
  @Field() published!: boolean;
  @Field(() => Date, { nullable: true }) publishedAt?: Date | null;
  @Field(() => Date) createdAt!: Date;
  @Field(() => Date) updatedAt!: Date;
}
