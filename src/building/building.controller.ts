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
import { EntityType, Role } from '@prisma/client';
import { Roles } from 'src/common/decorator/role.decorator';
import { UserDec } from 'src/common/decorator/user.decorator';
import { BuildingDto } from 'src/common/dtos/building.dto';
import { RolesGuard } from 'src/common/gurds/role.gurds';
import { AccessValidator } from 'src/common/utils/access-validator';
import { UserEntitiesByType } from 'src/common/utils/user-entitites';
import { BuildingService } from './building.service';

@Controller('v1/building')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @Get('/:id')
  getOne(@Param('id') id: number) {
    return this.buildingService.getOne(+id);
  }

  @Post('/')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() data: BuildingDto) {
    return this.buildingService.create(data);
  }

  @Get('/')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(RolesGuard)
  async getAll(@UserDec() user) {
    if (user.role == Role.SUPER_ADMIN) {
      return this.buildingService.getAll();
    }

    const userEntitiesIds = UserEntitiesByType(
      user?.AdminAccessMap,
      EntityType.LOCATION,
    );

    return this.buildingService.getAllUserBuilding(userEntitiesIds);
  }

  @Get('/location/id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getBuildingsByLocationId(@Body()body: GetBuildingByLocationArrayDto) {
   
    return this.buildingService.getBuildingsByLocationId(body.locationIdArray);
  }

  @Delete('/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(RolesGuard)
  async deleteOne(@UserDec() user, @Param('id') id: number) {
   if (
      AccessValidator(user.role, user?.AdminAccessMap, +id, EntityType.BUILDING)
    ) {
      return this.buildingService.deleteOne(+id);
    }
    throw new HttpException('forbidden', 403);

  }
}

type GetBuildingByLocationArrayDto = {
  locationIdArray: Array<number>
}
