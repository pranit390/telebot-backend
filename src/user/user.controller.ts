import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Admin, EntityType, Role, User } from '@prisma/client';
import { Roles } from 'src/common/decorator/role.decorator';
import { UserDec } from 'src/common/decorator/user.decorator';
import { UserDto } from 'src/common/dtos/user.dto';
import { RolesGuard } from 'src/common/gurds/role.gurds';
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
    return this.userService.getAllUsersOfAdmin(admin.adminId);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  deleteUser(@Param('id') id: number, @UserDec() admin: Admin) {
    return this.userService.deleteUser(+id, admin.adminId);
  }

  @Delete('/admin/:id')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  deleteAdmin(@Param('id') id: number) {
    return this.userService.deleteAdmin(id);
  }

  @Post('/user-access')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  assignUserAccess(
    @Body() Body: { userId: number; enityId: number; entityType: EntityType },
  ) {
    return this.userService.assignUserAccess(
      Body.userId,
      Body.enityId,
      Body.entityType,
    );
  }

  @Post('/admin-access')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  assignAdminAccess(
    @Body() Body: { adminId: number; enityId: number; entityType: EntityType },
  ) {
    return this.userService.assignAdminAccess(
      Body.adminId,
      Body.enityId,
      Body.entityType,
    );
  }
}
