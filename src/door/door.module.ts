import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { DoorController } from './door.controller';
import { DoorService } from './door.service';

@Module({
  controllers: [DoorController],
  imports: [PrismaModule, UserModule],
  providers: [UserService, DoorService],
})
export class DoorModule {}
