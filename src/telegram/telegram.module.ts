// telegram.module.ts
import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Module({
  providers: [TelegramService],
  exports: [TelegramService], // Export the service to be used in other modules
})
export class TelegramModule {}
