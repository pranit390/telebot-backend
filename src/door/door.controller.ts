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

  @Post('/')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() data: DoorDto, @UserDec() user) {
    return this.doorService.create(data, user.telegramUserId);
  }
  @Get('/')
  async getAll() {
    return this.doorService.getAll();
  }

  @Get('/building/:id')
  async getAllDoorByBuildingId(@Param('id') id: number) {
    return this.doorService.getAllDoorByBuildingId(+id);
  }

  @Get('/building/:id/gateway')
  async getAllGatewaysByBuildingId(@Param('id') id: number) {
    return this.doorService.getAllGatewayByBuildingId(+id);
  }

  @Get('/gateway/:id')
  async getAllDoorByGatewayId(@Param('id') id: string) {
    return this.doorService.getAllDoorByGatewayId(id);
  }

  @Get('/:id')
  getMe(@Param('id') id: number) {
    return this.doorService.getOne(+id);
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

  @Delete('/gateway/:gatewayMacId')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async deleteGateway(@UserDec() user, @Param('gatewayMacId') gatewayMacId: string) {
      return this.doorService.deleteAllNodeAndGatewayusingGatewaymacid(gatewayMacId);
  }

  @Get('/info/all')
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  async getDoorInfoById(@Body()body:GetDoorInfoByIdsDto) {
   
    return this.doorService.getDoorInfoById(body.doorIds);
  }
}

type GetDoorInfoByIdsDto = {
  doorIds: Array<number>
}