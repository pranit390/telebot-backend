import { HttpException, Injectable } from '@nestjs/common';
import { EntityType } from '@prisma/client';
import { AdminDto, UserDto } from 'src/common/dtos/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: UserDto) {
    return this.prisma.user.create({
      data: {
        userName: data.userName,
        telegramUserId: data.telegramUserId,
      },
    });
  }

  async createAdmin(data: AdminDto) {
    return this.prisma.admin.create({
      data: {
        adminName: data.adminName,
        telegramUserId: data.telegramUserId,
      },
    });
  }

  async updateUser(telegramUserId: number, adminId: number) {
    return this.prisma.user.update({
      where: { telegramUserId },
      data: {
        adminId,
      },
    });
  }

  async getAllUsersOfAdmin(adminId: number) {
    return this.prisma.user.findMany({
      where: {
        adminId: adminId,
      },
    });
  }

  async getAllAdmin() {
    return this.prisma.admin.findMany();
  }

  async getOne(telegramUserId: number) {
    return this.prisma.user.findFirst({
      where: {
        telegramUserId,
      },
    });
  }

  async deleteUser(telegramUserId: number, adminId: number) {
    return this.prisma.user.delete({
      where: {
        telegramUserId,
        adminId,
      },
    });
  }

  async deleteAdmin(telegramUserId: number) {
    return this.prisma.admin.delete({
      where: {
        telegramUserId,
      },
    });
  }

  async getAdminOrUserDetails(telegramUserId: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        telegramUserId,
      },
      include: {
        userAccessMap: {},
      },
    });

    if (user?.telegramUserId) {
      return user;
    }

    const admin = await this.prisma.admin.findFirst({
      where: {
        telegramUserId,
      },
      include: {
        AdminAccessMap: {},
      },
    });
    return admin;
  }

  async assignUserAccess(
    userId: number,
    entityId: number,
    entityType: EntityType,
  ) {
    return this.prisma.userAccessMap.create({
      data: {
        userId,
        entityId,
        entityType,
      },
    });
  }

  async assignAdminAccess(
    adminId: number,
    entityId: number,
    entityType: EntityType,
  ) {
    return this.prisma.adminAccessMap.create({
      data: {
        adminId,
        entityId,
        entityType,
      },
    });
  }

  async removeAdminAccess(
    adminId: number,
    entityId: number,
    entityType: EntityType,
  ) {
    return this.prisma.adminAccessMap.delete({
      where: {
        adminId_entityId_entityType: {
          adminId,
          entityId,
          entityType,
        },
      },
    });
  }

  async removeUserAccess(
    adminId: number,
    userId: number,
    entityId: number,
    entityType: EntityType,
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        userId: userId,
        adminId: adminId,
      },
    });

    if (!user?.userId) {
      throw new HttpException('forbidden', 403);
    }

    return this.prisma.userAccessMap.delete({
      where: {
        userId_entityId_entityType: {
          userId,
          entityId,
          entityType,
        },
      },
    });
  }

  async getBuildingFromDoor(id: number) {
    return this.prisma.door.findFirst({
      where: {
        doorId: id,
      },
    });
  }
}
