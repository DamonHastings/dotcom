import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProjectInput {
  @Field() slug!: string;
  @Field() title!: string;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true }) url?: string;
  @Field({ nullable: true }) repoUrl?: string;
  @Field({ nullable: true }) imageUrl?: string;
}

@InputType()
export class UpdateProjectInput {
  @Field(() => ID) id!: string;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true }) url?: string;
  @Field({ nullable: true }) repoUrl?: string;
  @Field({ nullable: true }) imageUrl?: string;
}
