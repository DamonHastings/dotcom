import { Injectable, Logger } from '@nestjs/common';
import { ContactRequestDto, ContactResponseDto } from './dto/contact.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  async handle(dto: ContactRequestDto): Promise<ContactResponseDto> {
    // For now just log; future: persist + send email
    const id = randomUUID();
    this.logger.log(`Contact submission ${id} from ${dto.email}: ${dto.subject || '(no subject)'} - ${dto.message.slice(0, 120)}${dto.message.length > 120 ? '…' : ''}`);
    return { success: true, receivedAt: new Date().toISOString(), id };
  }
}
