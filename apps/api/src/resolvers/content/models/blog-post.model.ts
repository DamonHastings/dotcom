import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BlogPostModel {
  @Field(() => ID)
  id!: string;
  @Field() slug!: string;
  @Field() title!: string;
  @Field({ nullable: true }) excerpt?: string | null;
  @Field() content!: string;
  @Field({ nullable: true }) coverImage?: string | null;
  @Field() published!: boolean;
  @Field({ nullable: true }) publishedAt?: Date | null;
  @Field() createdAt!: Date;
  @Field() updatedAt!: Date;
}
