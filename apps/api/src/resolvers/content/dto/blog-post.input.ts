import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBlogPostInput {
  @Field() slug!: string;
  @Field() title!: string;
  @Field({ nullable: true }) excerpt?: string;
  @Field() content!: string;
  @Field({ nullable: true }) coverImage?: string;
  @Field({ nullable: true }) published?: boolean;
}

@InputType()
export class UpdateBlogPostInput {
  @Field(() => ID) id!: string;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) excerpt?: string;
  @Field({ nullable: true }) content?: string;
  @Field({ nullable: true }) coverImage?: string;
  @Field({ nullable: true }) published?: boolean;
}
