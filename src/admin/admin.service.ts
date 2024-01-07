import { Injectable } from '@nestjs/common';
import { AdminDto } from 'src/common/dtos/admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async create(data: AdminDto) {
    return this.prisma.admin.create({ data });
  }

  async getAll() {
    return this.prisma.admin.findMany();
  }

  async getOne(telegramUserId: number) {
    return this.prisma.admin.findFirst({
      where: {
        telegramUserId,
      },
    });
  }

  async deleteOne(telegramUserId: number) {
    return this.prisma.admin.delete({
      where: {
        telegramUserId,
      },
    });
  }
}
