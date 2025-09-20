import { registerEnumType } from '@nestjs/graphql';

export enum SkillProficiency {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

registerEnumType(SkillProficiency, { name: 'SkillProficiency' });
