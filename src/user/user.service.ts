import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { EntityType } from '@prisma/client';
import { AdminDto, UserDto } from 'src/common/dtos/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MqttService } from '../mqtt/mqtt.service';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private mqtt:MqttService) {


  }

  async create(data: UserDto, adminId: number) {
    return this.prisma.user.create({
      data: {
        userName: data.userName,
        telegramUserId: data.telegramUserId,
        adminId: adminId,
      },
    });
  }

  async createAdmin(data: AdminDto) {
    return this.prisma.admin.create({
      data: {
        adminName: data.adminName,
        telegramUserId: data.telegramUserId,
      },
    });
  }


  async getAllUsersOfAdmin(adminId: number) {
    return this.prisma.user.findMany({
      where: {
        adminId: adminId,
      },
    });
  }

  async getAllAdmin() {
    return this.prisma.admin.findMany();
  }

  async getOne(telegramUserId: string) {
    return this.prisma.user.findFirst({
      where: {
        telegramUserId,
      },
    });
  }

  async deleteUser(telegramUserId: string, adminId: number) {
    return this.prisma.user.deleteMany({
      where: {
        telegramUserId,
        adminId,
      },
    });
  }

  async deleteAdmin(telegramUserId: string) {
    return this.prisma.admin.delete({
      where: {
        telegramUserId,
      },
    });
  }

  async getAdminOrUserDetails(telegramUserId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        telegramUserId,
      },
      include: {
        userAccessMap: {
        },
  
      },
    });
    if (user?.telegramUserId) {
     const location =[]
     const building = []
     const doors = []
      user.userAccessMap.forEach((data)=>{
       if(data.entityType == EntityType.BUILDING)
           building.push(data.entityId);
       if(data.entityType == EntityType.LOCATION)
          location.push(data.entityId);
       if(data.entityType == EntityType.DOOR)
           doors.push(data.entityId);
      })
      const locationData = await this.prisma.location.findMany({
        where: {
          locationId:{
            in:location
          },
        },
      });
      const doorData = await this.prisma.door.findMany({
        where: {
          doorId:{
            in:doors
          },
        },
        include:{
          building:{
            include:{
              location:{

              }
            }
          }
        }
      });
      const buildingsData = await this.prisma.building.findMany({
        where: {
          buildingId:{
            in:building
          },
        
        },

        include:{
          location:{

          }
        }
      });
      
 


     
      let result = [];
      const allDoors = [];
   
      locationData.forEach((data)=>{
        result.push({entityName: data.locationName,entityType:EntityType.LOCATION, entityId: data.locationId})
      })

      buildingsData.forEach((data)=>{
        result.push({entityName: `${data.location.locationName} => ${data.buildingName}`,entityType:EntityType.BUILDING,entityId: data.buildingId})
      })

      doorData.forEach((data)=>{
        allDoors.push({entityName: `${data.building.location.locationName} => ${data.building.buildingName} => ${data.doorName}`,entityType:EntityType.DOOR,entityId: data.doorId})
      })
     result = [...result,...allDoors];


     
      const buildingsDataRest= await this.prisma.building.findMany({
        where: {
          locationId:{
            in:location
          },
        
        },
      });
     
      const restBuildingId = buildingsDataRest.map((data)=>data.buildingId);

      const doorDataRest = await this.prisma.door.findMany({
        where: {
          buildingId:{
            in:[...building,...restBuildingId]
          },
        },
        include:{
          building:{
            include:{
              location:{

              }
            }
          }
        }
      });

      doorDataRest.forEach((data)=>{
        allDoors.push({entityName: `${data.building.location.locationName} => ${data.building.buildingName} => ${data.doorName}`,entityType:EntityType.DOOR,entityId: data.doorId})
      })
     

      return {...user,result,allDoors};
    }

    const admin = await this.prisma.admin.findFirst({
      where: {
        telegramUserId,
      },
      include: {
        AdminAccessMap: {},
      },
    });
    return admin;
  }




  async assignUserAccess(
    userId: number,
    entityId: number,
    entityType: EntityType,
  ) {
    if(entityType === EntityType.BUILDING){
      await this.checkBuildingAccess(entityId);
    }


    if(entityType === EntityType.DOOR){
      const door = await this.prisma.door.findFirst({
        where: {
          doorId:entityId,
        },
        include:{
          building:{
            include:{
              location:{

              }
            }
          }
        }
      })
      if(!door){
        throw new BadRequestException('Incorrect door Id contact support');
      }

      const isBuiuldingOrLocationAccesExist = await this.prisma.userAccessMap.findFirst({
        where: {
          OR:[
            {
             userId:userId,
             entityId: door.buildingId
            },
            {
              userId:userId,
              entityId: door.building.location.locationId
             }
          ]
         
        },
      })

      if(isBuiuldingOrLocationAccesExist){
        throw new BadRequestException('User has access to entire building.');
      }
      
    }
    return this.prisma.userAccessMap.create({
      data: {
        userId,
        entityId,
        entityType,
      },
    });
  }

  async openDoor(
    entityId: string,
    userId:string
  ) {
   
    const door = await this.prisma.door.findFirst({
      where: {
        doorId: Number(entityId),
      },
    });
    const payload = {
      gateway_id :door.gatewayMacId,
      door_id: door?.doorMacId === door?.gatewayMacId? 0: door?.doorMacId,
      command: 'opendoor',
      user_id: userId
    }

    const data = await this.mqtt.publish(`pranitbhatt/feeds/${door.gatewayMacId}`,JSON.stringify(payload));


    return door;



}

  async assignAdminAccess(
    adminId: number,
    entityId: number,
    entityType: EntityType,
  ) {
    return this.prisma.adminAccessMap.create({
      data: {
        adminId,
        entityId,
        entityType,
      },
    });
  }

  async removeAdminAccess(
    adminId: number,
    entityId: number,
    entityType: EntityType,
  ) {
    return this.prisma.adminAccessMap.delete({
      where: {
        adminId_entityId_entityType: {
          adminId,
          entityId,
          entityType,
        },
      },
    });
  }

  async removeUserAccess(
    adminId: number,
    userId: number,
    entityId: number,
    entityType: EntityType,
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        userId: userId,
        adminId: adminId,
      },
    });

    if (!user?.userId) {
      throw new HttpException('forbidden', 403);
    }

    return this.prisma.userAccessMap.delete({
      where: {
        userId_entityId_entityType: {
          userId,
          entityId,
          entityType,
        },
      },
    });
  }

  async getBuildingFromDoor(id: number) {
    return this.prisma.door.findFirst({
      where: {
        doorId: id,
      },
    });
  }

  async  checkBuildingAccess(buildingId: number) {
    const data = await this.prisma.building.findFirst({
      where: {
        buildingId,
      },
      include:{
        Door:{

        }
      }
    });
  
    if (!data) {
      throw new BadRequestException('Incorrect Building Id contact support');
    }
  
    const isDoorExist = await this.prisma.userAccessMap.findFirst({
      where: {
        entityId:{
          in:data.Door.map((data)=>data.doorId)
        } ,
        entityType: EntityType.DOOR
      },
    });
  
    if (isDoorExist) {
      throw new BadRequestException('User has already access to one of the door of this building, please remove that first.');
    }
  }
  
}
