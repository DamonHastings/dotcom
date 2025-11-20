import { Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { Lead } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../modules/auth/admin.guard';

@Resolver()
export class LeadResolver {
  constructor(private prisma: PrismaService) {}

  // Admin-only: fetch leads with recent bookings
  @Query(() => [Object], { name: 'adminLeads' })
  @UseGuards(AdminGuard)
  async adminLeads(): Promise<Lead[]> {
    const leads = await this.prisma.lead.findMany({
      include: { bookings: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return leads as any;
  }
}
