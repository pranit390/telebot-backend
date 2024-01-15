import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorator/role.decorator';
import { UserDec } from 'src/common/decorator/user.decorator';
import { LocationDto } from 'src/common/dtos/location.dto';
import { RolesGuard } from 'src/common/gurds/role.gurds';
import { AccessValidator } from 'src/common/utils/access-validator';
import { UserEntitiesByType } from 'src/common/utils/user-entitites';
import { LocationService } from './location.service';

@Controller('v1/location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('/:id')
  getMe(@Param('id') id: number) {
    return this.locationService.getOne(+id);
  }

  @Post('/')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() data: LocationDto) {
    return this.locationService.create(data);
  }

  @Get('/')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(RolesGuard)
  async getAll(@UserDec() user) {
    if (user.role == Role.SUPER_ADMIN) {
      return this.locationService.getAllLocations();
    }
    const userEntitiesIds = UserEntitiesByType(
      user?.AdminAccessMap,
      'LOCATION',
    );

    return this.locationService.getAllUserLocation(userEntitiesIds);
  }

  @Delete('/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(RolesGuard)
  async deleteOne(@UserDec() user, @Param('id') id: number) {
    if (AccessValidator(user.role, user?.AdminAccessMap, +id, 'LOCATION')) {
      return this.locationService.deleteOne(+id);
    }
    throw new HttpException('forbidden', 403);
  }
}
