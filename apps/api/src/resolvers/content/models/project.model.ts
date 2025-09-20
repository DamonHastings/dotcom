import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProjectModel {
  @Field(() => ID)
  id!: string;
  @Field() slug!: string;
  @Field() title!: string;
  @Field(() => String, { nullable: true }) description?: string | null;
  @Field(() => String, { nullable: true }) url?: string | null;
  @Field(() => String, { nullable: true }) repoUrl?: string | null;
  @Field(() => String, { nullable: true }) imageUrl?: string | null;
  @Field(() => Date) createdAt!: Date;
  @Field(() => Date) updatedAt!: Date;
}
