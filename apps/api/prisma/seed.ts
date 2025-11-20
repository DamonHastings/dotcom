import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Upsert a user
  const damon = await prisma.user.upsert({
    where: { email: 'damon@example.com' },
    update: {},
    create: {
      email: 'damon@example.com',
      name: 'Damon Hastings',
    },
  });

  // Create tags
  const tags = await prisma.$transaction([
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: { slug: 'nextjs', label: 'Next.js' },
    }),
    prisma.tag.upsert({
      where: { slug: 'nestjs' },
      update: {},
      create: { slug: 'nestjs', label: 'NestJS' },
    }),
    prisma.tag.upsert({
      where: { slug: 'graphql' },
      update: {},
      create: { slug: 'graphql', label: 'GraphQL' },
    }),
  ]);

  const [nextjs, nestjs, graphql] = await prisma.tag.findMany({
    where: { slug: { in: ['nextjs', 'nestjs', 'graphql'] } },
  });

  // Create a project
  await prisma.project.upsert({
    where: { slug: 'career-platform' },
    update: {},
    create: {
      slug: 'career-platform',
      title: 'Career Platform Monorepo',
      description: 'Full-stack portfolio and career development platform',
      repoUrl: 'https://github.com/Since84/dotcom',
      authorId: damon.id,
      tags: { create: [{ tagId: nextjs.id }, { tagId: nestjs.id }] },
    },
  });

  // Create a blog post
  await prisma.blogPost.upsert({
    where: { slug: 'hello-world' },
    update: {},
    create: {
      slug: 'hello-world',
      title: 'Hello World',
      excerpt: 'Initial post in the new monorepo',
      content: '# Hello World\n\nThis is the first post.',
      published: true,
      publishedAt: new Date(),
      authorId: damon.id,
      tags: { create: [{ tagId: graphql.id }] },
    },
  });

  // --- Resume Domain Seed ---
  // Skills
  const skillData: { name: string; category: any; proficiency: any; order: number }[] = [
    { name: 'TypeScript', category: 'LANGUAGE', proficiency: 'EXPERT', order: 1 },
    { name: 'NestJS', category: 'FRAMEWORK', proficiency: 'ADVANCED', order: 2 },
    { name: 'Next.js', category: 'FRAMEWORK', proficiency: 'ADVANCED', order: 3 },
    { name: 'PostgreSQL', category: 'PLATFORM', proficiency: 'ADVANCED', order: 4 },
    { name: 'Redis', category: 'PLATFORM', proficiency: 'INTERMEDIATE', order: 5 },
    { name: 'GraphQL', category: 'PRACTICE', proficiency: 'ADVANCED', order: 6 },
  ];

  for (const s of skillData) {
    const skill = await prisma.skill.upsert({
      where: { name: s.name },
      update: { proficiency: s.proficiency },
      create: {
        name: s.name,
        category: s.category,
        proficiency: s.proficiency,
        order: s.order,
      },
    });
    await prisma.userSkill.upsert({
      where: { userId_skillId: { userId: damon.id, skillId: skill.id } },
      update: {},
      create: { userId: damon.id, skillId: skill.id, order: skill.order },
    });
  }

  // Experience
  const exp = await prisma.experience.upsert({
    where: { id: 'exp-placeholder-1' },
    update: {},
    create: {
      id: 'exp-placeholder-1',
      userId: damon.id,
      company: 'Independent Consulting',
      role: 'Full-Stack Engineer',
      location: 'Remote',
      startDate: new Date(new Date().getFullYear() - 1, 0, 1),
      summary:
        'Delivering end-to-end web platform capabilities across frontend, backend, and DevOps.',
      highlights: {
        create: [
          { order: 1, text: 'Architected monorepo with shared packages and automated tooling.' },
          { order: 2, text: 'Implemented GraphQL + REST hybrid API using NestJS.' },
          {
            order: 3,
            text: 'Introduced Prisma-based data layer with PostgreSQL & seed workflows.',
          },
        ],
      },
    },
  });

  // Education
  await prisma.education.upsert({
    where: { id: 'edu-placeholder-1' },
    update: {},
    create: {
      id: 'edu-placeholder-1',
      userId: damon.id,
      institution: 'Example University',
      degree: 'B.S. Computer Science',
      field: 'Software Engineering',
      startDate: new Date(new Date().getFullYear() - 5, 8, 1),
      endDate: new Date(new Date().getFullYear() - 1, 5, 15),
      location: 'Somewhere, USA',
      honors: 'Magna Cum Laude',
    },
  });

  // Sample lead
  // Sample lead (use id for upsert because email is not unique)
  await prisma.lead.upsert({
    where: { id: 'lead-seed-1' },
    update: {},
    create: {
      id: 'lead-seed-1',
      name: 'Example Lead',
      email: 'lead@example.com',
      message: 'This is a seeded lead for local development.',
      source: 'seed',
    },
  });

  // Sample booking (for local development)
  const seededLead = await prisma.lead.findUnique({ where: { id: 'lead-seed-1' } });
  if (seededLead) {
    await prisma.booking.upsert({
      where: { id: 'booking-seed-1' },
      update: {},
      create: {
        id: 'booking-seed-1',
        leadId: seededLead.id,
        userId: damon.id,
        startAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
        timezone: 'UTC',
        provider: 'calendly',
        providerEventId: 'seed-event-1',
        status: 'PENDING',
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
