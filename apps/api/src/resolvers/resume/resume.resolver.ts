import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { UserSkill } from './models/user-skill.model';
import { Skill } from './models/skill.model';
import { Experience } from './models/experience.model';
import { Education } from './models/education.model';
import { ExperienceHighlight } from './models/experience-highlight.model';

@Resolver(() => UserSkill)
export class UserSkillResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [UserSkill], { name: 'skills' })
  async getUserSkills(@Args('userId') userId: string): Promise<UserSkill[]> {
    const userSkills = await this.prisma.userSkill.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
      include: { skill: true },
    });
    // Directly cast; fields align with GraphQL model (skill included)
    return userSkills as any;
  }

  @ResolveField(() => Skill)
  skill(@Parent() parent: any) {
    // Already included by parent resolver; just return
    return parent.skill;
  }
}

@Resolver(() => Experience)
export class ExperienceResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Experience], { name: 'experiences' })
  async getExperiences(@Args('userId') userId: string): Promise<Experience[]> {
    const experiences = await this.prisma.experience.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
      include: { highlights: { orderBy: { order: 'asc' } } },
    });
    return experiences as any;
  }

  @ResolveField(() => [ExperienceHighlight])
  highlights(@Parent() parent: any) {
    return parent.highlights || [];
  }
}

@Resolver(() => Education)
export class EducationResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Education], { name: 'education' })
  async getEducation(@Args('userId') userId: string): Promise<Education[]> {
    const education = await this.prisma.education.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
    return education as any;
  }
}
