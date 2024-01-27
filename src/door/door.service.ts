import { Injectable } from '@nestjs/common';
import { DoorDto } from 'src/common/dtos/door.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DoorService {
  constructor(private prisma: PrismaService) {}

  async create(data: DoorDto) {
    return this.prisma.door.create({ data });
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
    return this.prisma.door.groupBy({
      where: { buildingId },
      by: ['gatewayMacId'],
    });
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

  async deleteOne(doorId: number) {
    return this.prisma.door.delete({
      where: {
        doorId,
      },
    });
  }
}
