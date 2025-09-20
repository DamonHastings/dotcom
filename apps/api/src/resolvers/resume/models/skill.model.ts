import { Field, ID, ObjectType } from '@nestjs/graphql';
import { SkillCategory } from './skill-category.enum';
import { SkillProficiency } from './skill-proficiency.enum';

@ObjectType()
export class Skill {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => SkillCategory)
  category!: SkillCategory;

  @Field(() => SkillProficiency)
  proficiency!: SkillProficiency;

  @Field()
  order!: number;
}
