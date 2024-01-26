import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MqttService } from '../mqtt/mqtt.service';
import { MqttModule } from '../mqtt/mqtt.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [ PrismaModule, MqttModule],
})
export class UserModule {}
