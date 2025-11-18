import { Injectable, Logger, Optional } from '@nestjs/common';
import { ContactRequestDto, ContactResponseDto } from './dto/contact.dto';
import { randomUUID } from 'crypto';
import { SendGridService } from '../notifications/sendgrid.service';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(@Optional() private readonly sendgrid?: SendGridService) {}

  async handle(dto: ContactRequestDto): Promise<ContactResponseDto> {
    const id = randomUUID();
    this.logger.log(
      `Contact submission ${id} from ${dto.email}: ${dto.subject || '(no subject)'} - ${dto.message.slice(0, 120)}${
        dto.message.length > 120 ? '…' : ''
      }`,
    );

    // Send a notification to site admin (best-effort)
    try {
      if (this.sendgrid) {
        await this.sendgrid.sendMail(
          process.env.NOTIFY_EMAIL || process.env.EMAIL_FROM || 'admin@example.com',
          `New contact: ${dto.subject ?? 'Contact Form'}`,
          `From: ${dto.name} <${dto.email}>\n\n${dto.message}`,
        );
      }
    } catch (err) {
      this.logger.warn('Notification send failed: ' + (err as any)?.message);
    }

    return { success: true, receivedAt: new Date().toISOString(), id };
  }
}
