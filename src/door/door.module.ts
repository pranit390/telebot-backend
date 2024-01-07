import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DoorController } from './door.controller';
import { DoorService } from './door.service';

@Module({
  controllers: [DoorController],
  imports: [PrismaModule],
  providers: [DoorService],
})
export class DoorModule {}
