import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { TelegramModule } from '../telegram/telegram.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [MqttService],
  exports: [MqttService],
  imports:[TelegramModule,PrismaModule]
})
export class MqttModule {}
