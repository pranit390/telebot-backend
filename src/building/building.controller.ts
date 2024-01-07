import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorator/role.decorator';
import { BuildingDto } from 'src/common/dtos/building.dto';
import { RolesGuard } from 'src/common/gurds/role.gurds';
import { BuildingService } from './building.service';

@Controller('v1/building')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @Get('/:id')
  getMe(@Param() id: number) {
    return this.buildingService.getOne(id);
  }

  @Post('/')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  create(data: BuildingDto) {
    return this.buildingService.create(data);
  }

  @Get('/')
  async getAll() {
    return this.buildingService.getAll();
  }

  @Delete('/:id')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async deleteOne(@Param() id: number) {
    return this.buildingService.deleteOne(id);
  }
}
