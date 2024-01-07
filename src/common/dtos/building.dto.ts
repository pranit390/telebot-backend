import { IsString } from 'class-validator';

export class BuildingDto {
  @IsString()
  buildingName: string;

  locationId: number;
}
