import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { LocationService } from './location/location.service';
import { BuildingService } from './building/building.service';
import { DoorService } from './door/door.service';
import { BuildingModule } from './building/building.module';
import { LocationModule } from './location/location.module';
import { DoorModule } from './door/door.module';
import { PrismaService } from './prisma/prisma.service';
import { AdminModule } from './admin/admin.module';
import { UserService } from './user/user.service';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    LocationModule,
    BuildingModule,
    DoorModule,
    AdminModule,
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
