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
import { Roles } from 'src/common/decorator/role.decorator';
import { UserDec } from 'src/common/decorator/user.decorator';
import {
  AdminAccessDto,
  AdminDto,
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
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  create(@UserDec() admin: Admin, @Body() data: UserDto) {
    return this.userService.create(data, admin.adminId);
  }

  @Post('/admin')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  createAdmin(@Body() data: AdminDto) {
    return this.userService.createAdmin(data);
  }

  @Get('/')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  getAllUsersOfAdmin(@UserDec() admin: Admin) {
    return this.userService.getAllUsersOfAdmin(admin.adminId);
  }


  @Get('/all-doors')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  getAllDoors(@UserDec() admin: Admin) {
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
      Number(Body.entityId),
      Body.entityType,
    );
  }


  @Post('/open-door')
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(RolesGuard)
  assignUserAccess(@Body() body: UserOpenDoorDto, @UserDec() user) {
    return this.userService.openDoor(
          body.entityId,
          user.telegramUserId
    );
  }

  @Post('/admin-access')
  @Roles(Role.SUPER_ADMIN)
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
  
      return this.userService.removeUserAccess(
        user.adminId,
        Body.userId,
        Number(Body.entityId),
        Body.entityType,
      );
  }
  @Delete('/admin/:id')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  deleteAdmin(@Param('id') id: string) {
    return this.userService.deleteAdmin(id);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  deleteUser(@Param('id') id: string, @UserDec() admin: Admin) {
    return this.userService.deleteUser(id, admin.adminId);
  }
}
