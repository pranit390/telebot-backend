import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Admin, EntityType, Role, User } from '@prisma/client';
import { BuildingService } from 'src/building/building.service';
import { Roles } from 'src/common/decorator/role.decorator';
import { UserDec } from 'src/common/decorator/user.decorator';
import {
  AdminAccessDto,
  UserAccessDto,
  UserDto,
  UserOpenDoorDto,
} from 'src/common/dtos/user.dto';
import { RolesGuard } from 'src/common/gurds/role.gurds';
import { AccessValidator } from 'src/common/utils/access-validator';
import { UserService } from './user.service';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @Roles(Role.ADMIN, Role.USER, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  getMe(@UserDec() user: User) {
    return user;
  }

  @Post('/')
  create(@Body() data: UserDto) {
    return this.userService.create(data);
  }

  @Patch('/:telegramUserId')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  UpdateUser(
    @UserDec() admin: Admin,
    @Param('telegramUserId') telegramUserId: number,
  ) {
    return this.userService.updateUser(+telegramUserId, admin.adminId);
  }

  @Get('/')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  getAllUsersOfAdmin(@UserDec() admin: Admin) {
    return this.userService.getAllUsersOfAdmin(admin.adminId);
  }

  @Get('/admin')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  getAllAdmin(@UserDec() admin: Admin) {
    return this.userService.getAllAdmin();
  }

  @Post('/user-access')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  opendoor(@Body() Body: UserAccessDto) {
    return this.userService.assignUserAccess(
      Body.userId,
      Body.entityId,
      Body.entityType,
    );
  }


  @Post('/open-door')
  // @Roles(Role.USER, Role.ADMIN)
  // @UseGuards(RolesGuard)
  assignUserAccess(@Body() Body: UserOpenDoorDto) {
    return this.userService.openDoor(
      Body.userId,
      Body.entityId,
      Body.entityType,
    );
  }

  @Post('/admin-access')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  assignAdminAccess(@Body() Body: AdminAccessDto) {
    return this.userService.assignAdminAccess(
      Body.adminId,
      Body.entityId,
      Body.entityType,
    );
  }

  @Delete('/admin-access')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  deleteAdminAccess(@Body() Body: AdminAccessDto) {
    return this.userService.removeAdminAccess(
      Body.adminId,
      Body.entityId,
      Body.entityType,
    );
  }

  @Delete('/user-access')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async deleteUserAccess(@UserDec() user, @Body() Body: UserAccessDto) {
    if (Body.entityType === EntityType.DOOR) {
      const door = await this.userService.getBuildingFromDoor(Body.entityId);
      console.log(door);

      if (
        AccessValidator(
          user.role,
          user?.AdminAccessMap,
          door.buildingId,
          EntityType.BUILDING,
        )
      ) {
        return this.userService.removeUserAccess(
          user.adminId,
          Body.userId,
          Body.entityId,
          Body.entityType,
        );
      }
    }
    if (
      AccessValidator(
        user.role,
        user?.AdminAccessMap,
        Body.entityId,
        Body.entityType,
      )
    ) {
      return this.userService.removeUserAccess(
        user.adminId,
        Body.userId,
        Body.entityId,
        Body.entityType,
      );
    }
    throw new HttpException('forbidden', 403);
  }
  @Delete('/admin/:id')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  deleteAdmin(@Param('id') id: number) {
    return this.userService.deleteAdmin(id);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  deleteUser(@Param('id') id: number, @UserDec() admin: Admin) {
    return this.userService.deleteUser(+id, admin.adminId);
  }
}
