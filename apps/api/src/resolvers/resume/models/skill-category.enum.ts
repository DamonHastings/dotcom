import { registerEnumType } from '@nestjs/graphql';

export enum SkillCategory {
  LANGUAGE = 'LANGUAGE',
  FRAMEWORK = 'FRAMEWORK',
  TOOL = 'TOOL',
  PLATFORM = 'PLATFORM',
  PRACTICE = 'PRACTICE',
  OTHER = 'OTHER',
}

registerEnumType(SkillCategory, { name: 'SkillCategory' });
