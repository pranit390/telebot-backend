import { Injectable } from '@nestjs/common';
import { LocationDto } from 'src/common/dtos/location.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async create(data: LocationDto) {
    return this.prisma.location.create({
      data: {
        locationName: data.locationName,
      },
    });
  }

  async getAllUserLocation(ids: number[]) {
    return this.prisma.location.findMany({
      where: {
        locationId: {
          in: ids,
        },
      },
    });
  }

  async getAllLocations() {
    return this.prisma.location.findMany();
  }

  async getOne(locationId: number) {
    return this.prisma.location.findFirst({
      where: {
        locationId,
      },
    });
  }
  async getLocationByName(name: string) {
    return this.prisma.location.findFirst({
      where: {
        locationName: name,
      },
    });
  }

  async deleteOne(locationId: number) {
    return this.prisma.location.delete({
      where: {
        locationId,
      },
    });
  }
}
