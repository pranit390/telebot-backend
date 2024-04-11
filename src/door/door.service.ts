import { Injectable } from '@nestjs/common';
import { DoorDto } from 'src/common/dtos/door.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MqttService } from '../mqtt/mqtt.service';

@Injectable()
export class DoorService {
  constructor(private prisma: PrismaService, private mqtt:MqttService) {}

  async create(data: DoorDto, userId:string) {

    const createdData = await this.prisma.door.create({ data });
   try{ const  payload = {

      "gateway_id": data.gatewayMacId,
      
      "command":  "onboard",
      
      "door_id": data.gatewayMacId == data.doorMacId? 0 :data.doorMacId,
      
      "user_id": userId
      
      };
    await this.mqtt.publish(`Solutions16/feeds/${data.gatewayMacId}`,JSON.stringify(payload));
   }
   catch(err){
    console.error(`onboarding failed:${err}`)
   }

    return createdData;
  }

  async getAll() {
    return this.prisma.door.findMany();
  }

  async getAllDoorByBuildingId(buildingId: number) {
    return this.prisma.door.findMany({
      where: { buildingId },
    });
  }

  async getAllGatewayByBuildingId(buildingId: number) {
    const datas = await this.prisma.door.findMany({
      where: { buildingId },
    });
    return datas.filter((data)=>data.doorMacId == data.gatewayMacId)

  }

  async getAllDoorByGatewayId(gatewayMacId: string) {
    return this.prisma.door.findMany({ where: { gatewayMacId } });
  }

  async getOne(doorId: number) {
    return this.prisma.door.findFirst({
      where: {
        doorId,
      },
    });
  }


  async getDoorInfoById(doorIds: number[]) {
    return this.prisma.door.findMany({
      where: {
        doorId:{
          in: doorIds
        },
      },
    });
  }


  async deleteOne(doorId: number) {
    return this.prisma.door.delete({
      where: {
        doorId,
      },
    });
  }

  async deleteAllNodeAndGatewayusingGatewaymacid(gatewayMacId: string) {
    return this.prisma.door.deleteMany({
      where: {
        gatewayMacId,
      },
    });
  }

}
