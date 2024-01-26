import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { MqttModule } from '../mqtt/mqtt.module';
import { BuildingController } from './building.controller';
import { BuildingService } from './building.service';

@Module({
  controllers: [BuildingController],
  imports: [PrismaModule, UserModule,MqttModule],
  providers: [BuildingService, UserService],
})
export class BuildingModule {}
