import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
import { GqlAuthGuard } from '../../modules/auth/gql-auth.guard';
import { CreateProjectInput, UpdateProjectInput } from './dto/project.input';
import { CreateBlogPostInput, UpdateBlogPostInput } from './dto/blog-post.input';
import { ProjectModel } from './models/project.model';
import { BlogPostModel } from './models/blog-post.model';

@Resolver()
export class ContentResolver {
  constructor(private prisma: PrismaService) {}

  // --- Project Queries ---
  @Query(() => [String], { name: 'projectSlugs' })
  async projectSlugs(): Promise<string[]> {
    const projects = await this.prisma.project.findMany({
      select: { slug: true },
      orderBy: { createdAt: 'desc' },
    });
    return projects.map((p: { slug: string }) => p.slug);
  }

  @Query(() => [ProjectModel], { name: 'projects' })
  async projects(
    @Args('take', { type: () => Int, nullable: true }) take = 50,
    @Args('skip', { type: () => Int, nullable: true }) skip = 0,
  ): Promise<ProjectModel[]> {
    return this.prisma.project.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }) as any;
  }

  @Query(() => ProjectModel, { name: 'project', nullable: true })
  async project(@Args('slug') slug: string): Promise<ProjectModel | null> {
    return (await this.prisma.project.findUnique({ where: { slug } })) as any;
  }

  // --- Project Mutations ---
  @Mutation(() => String, { name: 'createProject' })
  @UseGuards(GqlAuthGuard)
  async createProject(@Args('input') input: CreateProjectInput): Promise<string> {
    const exists = await this.prisma.project.findUnique({ where: { slug: input.slug } });
    if (exists) throw new BadRequestException('Slug already exists');
    const project = await this.prisma.project.create({
      data: {
        slug: input.slug,
        title: input.title,
        description: input.description,
        url: input.url,
        repoUrl: input.repoUrl,
        imageUrl: input.imageUrl,
        author: { connect: { id: (await this.ensureAuthor()).id } },
      },
      select: { id: true },
    });
    return project.id;
  }

  @Mutation(() => Boolean, { name: 'updateProject' })
  @UseGuards(GqlAuthGuard)
  async updateProject(@Args('input') input: UpdateProjectInput): Promise<boolean> {
    const existing = await this.prisma.project.findUnique({ where: { id: input.id } });
    if (!existing) throw new NotFoundException('Project not found');
    await this.prisma.project.update({
      where: { id: input.id },
      data: {
        title: input.title ?? undefined,
        description: input.description ?? undefined,
        url: input.url ?? undefined,
        repoUrl: input.repoUrl ?? undefined,
        imageUrl: input.imageUrl ?? undefined,
      },
    });
    return true;
  }

  @Mutation(() => Boolean, { name: 'deleteProject' })
  @UseGuards(GqlAuthGuard)
  async deleteProject(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Project not found');
    await this.prisma.project.delete({ where: { id } });
    return true;
  }

  // --- BlogPost Mutations ---
  @Query(() => [BlogPostModel], { name: 'blogPosts' })
  async blogPosts(
    @Args('take', { type: () => Int, nullable: true }) take = 50,
    @Args('skip', { type: () => Int, nullable: true }) skip = 0,
    @Args('includeUnpublished', { type: () => Boolean, nullable: true }) includeUnpublished = false,
  ): Promise<BlogPostModel[]> {
    return this.prisma.blogPost.findMany({
      where: includeUnpublished ? {} : { published: true },
      skip,
      take,
      orderBy: { publishedAt: 'desc' },
    }) as any;
  }

  @Query(() => BlogPostModel, { name: 'blogPost', nullable: true })
  async blogPost(
    @Args('slug') slug: string,
    @Args('includeUnpublished', { type: () => Boolean, nullable: true }) includeUnpublished = false,
  ): Promise<BlogPostModel | null> {
    const post = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (!post) return null;
    if (!includeUnpublished && !post.published) return null;
    return post as any;
  }
  @Mutation(() => String, { name: 'createBlogPost' })
  @UseGuards(GqlAuthGuard)
  async createBlogPost(@Args('input') input: CreateBlogPostInput): Promise<string> {
    const exists = await this.prisma.blogPost.findUnique({ where: { slug: input.slug } });
    if (exists) throw new BadRequestException('Slug already exists');
    const blog = await this.prisma.blogPost.create({
      data: {
        slug: input.slug,
        title: input.title,
        excerpt: input.excerpt,
        content: input.content,
        // coverImage removed from schema; ignore if present
        published: input.published ?? false,
        publishedAt: input.published ? new Date() : null,
        author: { connect: { id: (await this.ensureAuthor()).id } },
      },
      select: { id: true },
    });
    return blog.id;
  }

  @Mutation(() => Boolean, { name: 'updateBlogPost' })
  @UseGuards(GqlAuthGuard)
  async updateBlogPost(@Args('input') input: UpdateBlogPostInput): Promise<boolean> {
    const existing = await this.prisma.blogPost.findUnique({ where: { id: input.id } });
    if (!existing) throw new NotFoundException('BlogPost not found');
    await this.prisma.blogPost.update({
      where: { id: input.id },
      data: {
        title: input.title ?? undefined,
        excerpt: input.excerpt ?? undefined,
        content: input.content ?? undefined,
        // coverImage removed from schema; ignore if present
        published: input.published ?? existing.published,
        publishedAt:
          input.published === undefined
            ? existing.publishedAt
            : input.published
              ? (existing.publishedAt ?? new Date())
              : null,
      },
    });
    return true;
  }

  @Mutation(() => Boolean, { name: 'deleteBlogPost' })
  @UseGuards(GqlAuthGuard)
  async deleteBlogPost(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('BlogPost not found');
    await this.prisma.blogPost.delete({ where: { id } });
    return true;
  }

  // Helper: ensure at least one user exists to assign as author.
  private async ensureAuthor() {
    let user = await this.prisma.user.findFirst();
    if (!user) {
      user = await this.prisma.user.create({ data: { email: 'admin@example.com', name: 'Admin' } });
    }
    return user;
  }
}
