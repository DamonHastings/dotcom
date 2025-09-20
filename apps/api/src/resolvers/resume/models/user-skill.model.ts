import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Skill } from './skill.model';

@ObjectType()
export class UserSkill {
  @Field(() => ID)
  userId!: string; // Composite key part

  @Field(() => ID)
  skillId!: string; // Composite key part

  @Field(() => String, { nullable: true })
  note?: string | null;

  @Field()
  order!: number;

  @Field(() => Skill)
  skill!: Skill;
}
