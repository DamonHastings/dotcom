import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingInput } from './dto/create-booking.input';
import { BookingModel } from './models/booking.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../modules/auth/admin.guard';

@Resolver()
export class BookingResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [BookingModel], { name: 'bookings' })
  async listBookings(): Promise<BookingModel[]> {
    const bookings = await this.prisma.booking.findMany({ orderBy: { startAt: 'asc' } });
    return bookings as any;
  }

  @Query(() => BookingModel, { name: 'booking', nullable: true })
  async getBooking(@Args('id') id: string): Promise<BookingModel | null> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) return null;
    return booking as any;
  }

  @Mutation(() => BookingModel, { name: 'createBooking' })
  async createBooking(@Args('input') input: CreateBookingInput): Promise<BookingModel> {
    if (!input.startAt) throw new BadRequestException('startAt is required');

    const booking = await this.prisma.booking.create({
      data: {
        leadId: input.leadId ?? null,
        userId: input.userId ?? null,
        startAt: new Date(input.startAt as any),
        endAt: input.endAt ? new Date(input.endAt as any) : null,
        timezone: input.timezone ?? null,
        provider: input.provider ?? null,
        providerEventId: input.providerEventId ?? null,
      },
    });

    return booking as any;
  }

  @Mutation(() => BookingModel, { name: 'confirmBooking' })
  @UseGuards(AdminGuard)
  async confirmBooking(@Args('id') id: string): Promise<BookingModel> {
    const existing = await this.prisma.booking.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Booking not found');

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: 'CONFIRMED' },
    });
    return updated as any;
  }

  @Mutation(() => BookingModel, { name: 'cancelBooking' })
  @UseGuards(AdminGuard)
  async cancelBooking(@Args('id') id: string): Promise<BookingModel> {
    const existing = await this.prisma.booking.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Booking not found');

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
    return updated as any;
  }
}
