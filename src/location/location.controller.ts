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
import { LocationDto } from 'src/common/dtos/location.dto';
import { RolesGuard } from 'src/common/gurds/role.gurds';
import { LocationService } from './location.service';

@Controller('v1/location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('/:id')
  getMe(@Param() id: number) {
    return this.locationService.getOne(id);
  }

  @Post('/')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  create(data: LocationDto) {
    return this.locationService.create(data);
  }

  @Get('/')
  async getAll() {
    return this.locationService.getAll();
  }

  @Delete('/:id')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async deleteOne(@Param() id: number) {
    return this.locationService.deleteOne(id);
  }
}
