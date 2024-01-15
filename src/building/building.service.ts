import { Injectable } from '@nestjs/common';
import { BuildingDto } from 'src/common/dtos/building.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BuildingService {
  constructor(private prisma: PrismaService) {}

  async create(data: BuildingDto) {
    return this.prisma.building.create({ data });
  }

  async getAll() {
    return this.prisma.building.findMany();
  }

  async getAllUserBuilding(ids: number[]) {
    return this.prisma.building.findMany({
      where: {
        buildingId: {
          in: ids,
        },
      },
    });
  }

  async getOne(buildingId: number) {
    return this.prisma.building.findFirst({
      where: {
        buildingId,
      },
    });
  }

  async deleteOne(buildingId: number) {
    return this.prisma.building.delete({
      where: {
        buildingId,
      },
    });
  }
}
