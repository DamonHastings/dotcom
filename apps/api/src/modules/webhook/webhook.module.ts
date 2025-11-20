import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [PrismaModule],
  controllers: [WebhookController],
})
export class WebhookModule {}
