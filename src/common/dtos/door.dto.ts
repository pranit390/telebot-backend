import { IsInt, IsString } from 'class-validator';

export class DoorDto {
  @IsString()
  doorName: string;

  @IsInt()
  buildingId: number;

  @IsInt()
  gatewayId: number;
}
