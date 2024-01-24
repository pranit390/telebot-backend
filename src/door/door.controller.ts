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
import { DoorDto } from 'src/common/dtos/door.dto';
import { RolesGuard } from 'src/common/gurds/role.gurds';
import { AccessValidator } from 'src/common/utils/access-validator';
import { DoorService } from './door.service';

@Controller('v1/door')
export class DoorController {
  constructor(private readonly doorService: DoorService) {}
  @Get('/:id')
  getMe(@Param('id') id: number) {
    return this.doorService.getOne(+id);
  }

  @Post('/')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() data: DoorDto) {
    return this.doorService.create(data);
  }

  @Get('/building/:id')
  async getAllDoorByBuildingId(@Param('id') id: number) {
    return this.doorService.getAllDoorByBuildingId(+id);
  }
  @Get('/gateway/:id')
  async getAllDoorByGatewayId(@Param('id') id: number) {
    return this.doorService.getAllDoorByGatewayId(+id);
  }

  @Get('/')
  async getAll() {
    return this.doorService.getAll();
  }

  @Delete('/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(RolesGuard)
  async deleteOne(@UserDec() user, @Param('id') id: number) {
    const door = await this.doorService.getOne(+id);
    if (
      door?.buildingId &&
      AccessValidator(
        user.role,
        user?.AdminAccessMap,
        +door.buildingId,
        EntityType.BUILDING,
      )
    ) {
      return this.doorService.deleteOne(+id);
    }
    throw new HttpException('forbidden', 403);
  }
}
