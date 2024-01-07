import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
  controllers: [LocationController],
  imports: [PrismaModule, UserModule],
  providers: [LocationService, UserService],
})
export class LocationModule {}
