import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProjectModel {
  @Field(() => ID)
  id!: string;
  @Field() slug!: string;
  @Field() title!: string;
  @Field({ nullable: true }) description?: string | null;
  @Field({ nullable: true }) url?: string | null;
  @Field({ nullable: true }) repoUrl?: string | null;
  @Field({ nullable: true }) imageUrl?: string | null;
  @Field() createdAt!: Date;
  @Field() updatedAt!: Date;
}
