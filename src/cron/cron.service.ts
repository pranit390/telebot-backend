import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MqttService } from '../mqtt/mqtt.service';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { Prisma } from '@prisma/client';


@Injectable()
export class CronService {
  constructor(private readonly mqtt: MqttService,private readonly telegramService: TelegramService, private prisma: PrismaService) {} // Inject MqttService

  @Cron('0 */30 * * * *')
  async handleCron() {
    try{
    const inactiveDoors = await this.prisma.door.findMany({
      where: {
        isActive: {
          equals: 0,
        },
      } as unknown,
      include:{
        building:{
          include:{
            location:{

            }
          }
        }
      }
    });
    const admins = await this.prisma.admin.findMany({
      where: {
        role: 'SUPER_ADMIN',
      } as unknown,
    });
    const doorMacIds = inactiveDoors.map(door => door.building.location.locationName +'=>'+door.building.buildingName +'=>'+door.doorName +'=>'+ door.doorMacId);
    const  joinedDoorMacIds = doorMacIds.join('\n');
    admins.forEach((admin)=>{
      this.telegramService.sendMessage(admin.telegramUserId, `Inactive Gateway/Nodes: ${joinedDoorMacIds}`);
    })
  }catch(err){

    console.error(err);
  }

  }
}
