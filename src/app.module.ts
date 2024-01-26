import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildingModule } from './building/building.module';
import { BuildingService } from './building/building.service';
import { DoorModule } from './door/door.module';
import { DoorService } from './door/door.service';
import { LocationModule } from './location/location.module';
import { LocationService } from './location/location.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { MqttModule } from './mqtt/mqtt.module';
import { MqttService } from './mqtt/mqtt.service';

@Module({
  imports: [
  
    PrismaModule,
    UserModule,
    LocationModule,
    BuildingModule,
    DoorModule,
    AdminModule,
    MqttModule
  ],
  controllers: [AppController],
  providers: [
  
    AppService,
    PrismaService,
    UserService,
    LocationService,
    BuildingService,
    DoorService,
  ],
})
export class AppModule {}
