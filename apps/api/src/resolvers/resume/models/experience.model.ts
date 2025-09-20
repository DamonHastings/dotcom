import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ExperienceHighlight } from './experience-highlight.model';

@ObjectType()
export class Experience {
  @Field(() => ID)
  id!: string;

  @Field()
  userId!: string;

  @Field()
  company!: string;

  @Field()
  role!: string;

  @Field({ nullable: true })
  location?: string | null;

  @Field()
  startDate!: Date;

  @Field({ nullable: true })
  endDate?: Date | null;

  @Field({ nullable: true })
  summary?: string | null;

  @Field(() => [ExperienceHighlight])
  highlights!: ExperienceHighlight[];
}
