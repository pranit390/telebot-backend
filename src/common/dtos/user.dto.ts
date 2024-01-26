import { EntityType } from '@prisma/client';
import { IsEnum, IsInt, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  userName: string;

  @IsInt()
  telegramUserId: number;
}

export class AdminAccessDto {
  @IsInt()
  adminId: number;
  @IsInt()
  entityId: number;

  @IsEnum(EntityType)
  entityType: EntityType;
}

export class UserAccessDto {
  @IsInt()
  userId: number;
  @IsInt()
  entityId: number;

  @IsEnum(EntityType)
  entityType: EntityType;
}

export class UserOpenDoorDto {
  @IsInt()
  userId: number;
  @IsInt()
  entityId: number;

  @IsEnum(EntityType)
  entityType: EntityType;
}
