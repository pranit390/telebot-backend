import { IsInt, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  userName: string;

  @IsInt()
  telegramUserId: number;
}
