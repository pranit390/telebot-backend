import { IsInt, IsString } from 'class-validator';

export class AdminDto {
  @IsString()
  adminName: string;

  @IsInt()
  telegramUserId: string;
}
