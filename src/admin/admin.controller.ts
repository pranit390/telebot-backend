import { Controller, Get, Param, Post } from '@nestjs/common';
import { AdminDto } from 'src/common/dtos/admin.dto';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/:id')
  getMe(@Param() id: string) {
    return this.adminService.getOne(id);
  }

  @Post('/')
  create(data: AdminDto) {
    return this.adminService.create(data);
  }

  @Get('/')
  async getAll() {
    return this.adminService.getAll();
  }

  @Get('/:id')
  async deleteOne(@Param() id: string) {
    return this.adminService.deleteOne(id);
  }
}
