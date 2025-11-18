import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { ContactService } from '../../modules/contact/contact.service';
import { SubmitLeadInput } from './dto/submit-lead.input';
import { LeadModel } from './models/lead.model';
import { BadRequestException } from '@nestjs/common';

@Resolver()
export class ContactResolver {
  constructor(private prisma: PrismaService, private contactService: ContactService) {}

  @Mutation(() => LeadModel, { name: 'submitLead' })
  async submitLead(@Args('input') input: SubmitLeadInput): Promise<LeadModel> {
    if (!input.email) throw new BadRequestException('Email is required');

    const lead = await this.prisma.lead.create({
      data: {
        name: input.name ?? null,
        email: input.email,
        message: input.message ?? null,
        source: input.source ?? null,
        resumeUrl: input.resumeUrl ?? null,
      },
    });

    // Log/send via ContactService (non-blocking)
    try {
      await this.contactService.handle({
        name: input.name ?? '',
        email: input.email,
        subject: input.source ?? 'lead',
        message: input.message ?? '',
      } as any);
    } catch (err) {
      // Do not fail the mutation if notification fails; log server-side
      // ContactService currently logs; leave silent for now
    }

    return lead as any;
  }
}
