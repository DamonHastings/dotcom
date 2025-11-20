import { Body, Controller, Headers, HttpCode, HttpStatus, Post, UnauthorizedException, Req } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';
import { Request } from 'express';

@Controller('webhook')
export class WebhookController {
  constructor(private prisma: PrismaService) {}

  // Calendly will POST event payloads here. We support a simple upsert for 'invitee.created' or 'event.canceled' etc.
  @Post('calendly')
  @HttpCode(HttpStatus.NO_CONTENT)
  async handleCalendly(@Req() req: Request, @Body() body: any, @Headers('calendly-hook-signature') signature: string | undefined) {
    // Validate signature when CALENDLY_WEBHOOK_SECRET is set
    const secret = process.env.CALENDLY_WEBHOOK_SECRET;
    if (secret) {
      if (!signature) {
        throw new UnauthorizedException('Missing Calendly signature');
      }

      // Signature may be provided as raw hex/base64 or with prefixes like 'sha256='
      const incoming = signature.split('=')?.pop() || signature;

      // Use raw body captured by middleware if available, otherwise fallback to JSON stringify
      const payloadString = (req as any).rawBody || (typeof body === 'string' ? body : JSON.stringify(body));
      const expectedHmac = crypto.createHmac('sha256', secret).update(payloadString).digest();

      let incomingBuf: Buffer;
      try {
        // try hex
        incomingBuf = Buffer.from(incoming, 'hex');
        if (incomingBuf.length === 0) throw new Error('empty hex');
      } catch (e) {
        // fallback to base64
        incomingBuf = Buffer.from(incoming, 'base64');
      }

      // Constant-time compare
      const ok = incomingBuf.length === expectedHmac.length && crypto.timingSafeEqual(incomingBuf, expectedHmac);
      if (!ok) throw new UnauthorizedException('Invalid Calendly webhook signature');
    }
    try {
      const event = body.event || body;
      // Calendly payloads differ depending on event subscription; capture relevant fields safely
      const eventType = event && event.event ? event.event : event.type || (body.event && body.event.type) || null;

      // Support common Calendly webhook shapes: get the invitee, event, start/end, and invitee_email
      const payload = body.payload || body.data || {};

      // Attempt to extract event info
      const invitee = payload.invitee || payload.invitees?.[0] || payload.participant || null;
      const meeting = payload.event || payload.scheduling?.event || payload.meeting || null;

      // Extract fields carefully
      const providerEventId = meeting?.uri || meeting?.id || meeting?.resource?.uri || meeting?.resource?.id || (payload.resource && payload.resource.id) || null;
      const startAt = meeting?.start_time || meeting?.start_at || invitee?.start_time || invitee?.start_at || null;
      const endAt = meeting?.end_time || meeting?.end_at || null;
      const timezone = meeting?.timezone || invitee?.timezone || null;
      const inviteeEmail = invitee?.email || invitee?.email_address || payload?.email || null;
      const inviteeName = invitee?.name || invitee?.full_name || null;

      if (!providerEventId) {
        // Nothing to upsert
        return;
      }

      // Build booking data
      const bookingData: any = {
        providerEventId,
        provider: 'calendly',
        timezone: timezone || undefined,
      };

      if (startAt) bookingData.startAt = new Date(startAt);
      if (endAt) bookingData.endAt = new Date(endAt);

      // If invitee email present, try to link to Lead otherwise create a lead
      if (inviteeEmail) {
        const lead = await this.prisma.lead.findFirst({ where: { email: inviteeEmail } });
        if (lead) bookingData.leadId = lead.id;
        else {
          const newLead = await this.prisma.lead.create({ data: { name: inviteeName || undefined, email: inviteeEmail, source: 'calendly' } });
          bookingData.leadId = newLead.id;
        }
      }

      // If providerEventId is not a unique field in the schema, do a find-then-update/create
      const existingBooking = await this.prisma.booking.findFirst({ where: { providerEventId } });
      if (existingBooking) {
        await this.prisma.booking.update({ where: { id: existingBooking.id }, data: { ...bookingData, status: 'CONFIRMED' } });
      } else {
        await this.prisma.booking.create({ data: { ...bookingData, status: 'CONFIRMED' } });
      }

      return;
    } catch (err) {
      // swallow errors; webhook should return 204 to acknowledge
      console.error('Failed to process Calendly webhook', err);
      return;
    }
  }
}
