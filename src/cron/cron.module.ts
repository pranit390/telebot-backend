import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { MqttModule } from '../mqtt/mqtt.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [ScheduleModule.forRoot(), MqttModule, PrismaModule, TelegramModule], // Include MqttModule
  providers: [CronService],
})
export class CronModule {}
