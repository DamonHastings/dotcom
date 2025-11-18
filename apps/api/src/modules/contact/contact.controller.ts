import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactRequestDto, ContactResponseDto } from './dto/contact.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('contact')
export class ContactController {
  constructor(private readonly contact: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async submit(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) body: ContactRequestDto,
  ): Promise<ContactResponseDto> {
    return this.contact.handle(body);
  }
}
