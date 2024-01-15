import { IsInt, IsString } from 'class-validator';

export class BuildingDto {
  @IsString()
  buildingName: string;

  @IsInt()
  locationId: number;
}
