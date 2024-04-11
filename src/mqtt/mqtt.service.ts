import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { connect, MqttClient } from "mqtt";
import { MqttResponse } from "../common/types/mqttReponseType";
import { MqttHeartbeat } from "../common/types/mqttHeartbeatType";
import { TelegramService } from "../telegram/telegram.service";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class MqttService implements OnModuleInit {
  private mqttClient: MqttClient | null = null;

  constructor(private readonly telegramService: TelegramService, private prisma: PrismaService) {}


  async onModuleInit() {
    await this.connectToBroker();
    await this.subscribe("Solutions16/feeds/reply",async (message) => {
      const data = JSON.parse(message)as unknown as MqttResponse;

      
      
      switch (data['command']) {
        case "Open Successfully":
          await this.telegramService.sendMessage(data.user_id.replace(/^USER-/, ''), 'Door Opened Succesfully.');
          break;
        case "Open Failed":
          this.telegramService.sendMessage(data.user_id.replace(/^USER-/, ''), 'Door Opening failed.');
          break;
        case "Onboard Successfully":
          const onboard = await  this.telegramService.sendMessage(data.user_id.replace(/^USER-/, ''), `Onbarding of gateway:${data?.gateway_id} Succesfull`);
          break;
        case "Onboard Failed":{
         if(Number(data.door_id) == 0){
          await this.prisma.door.deleteMany({
            where:{
              gatewayMacId:data?.gateway_id
            }
          })
         }
         else{
          await this.prisma.door.deleteMany({
            where:{
              doorMacId:data?.door_id
            }
          })
         }
          await this.prisma.door.deleteMany({
            where:{
              gatewayMacId:data?.gateway_id
            }
          })
          this.telegramService.sendMessage(data.user_id.replace(/^USER-/, ''), `Onbarding of gateway:${data?.gateway_id} Failed`);
           
          }

          break;         
      
        default:
          
          break;
      }
      console.log(`Received message: ${message}`);
      // Handle received message
    });

    await this.subscribe("Solutions16/feeds/heartbeat",async (message) => {
      const data = JSON.parse(message) as unknown as MqttHeartbeat;
      switch (data.command) {
        case "I am alive":
          await this.updateHeartbeatOfGateways(data.gateway_id,data.gateway_id,true);
          break;
        case "Not alive":
          await this.updateHeartbeatOfGateways(data.gateway_id,data.gateway_id,false); 
          break;
      
        default:
          break;
      }
      console.log(`Received message: ${message}`);
      // Handle received message
    });
  }

  private async connectToBroker() {
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    const connectUrl = `mqtt://io.adafruit.com`;

    try {
      this.mqttClient = connect(connectUrl, {
        clientId,
        clean: true,
        connectTimeout: 4000,
        username: 'Solutions16',
        password: 'aio_tlJv98g8GMY1vSN5gkTeEjdlXycE',
        reconnectPeriod: 1000,
      });
      

      this.mqttClient.on("connect", () => {
        console.log("Connected to CloudMQTT");
      });

      this.mqttClient.on("error", (error) => {
        console.error("Error in connecting to CloudMQTT:", error);
      });
    } catch (error) {
      console.error("Error while connecting to CloudMQTT:", error);
    }
  }

  async publish(topic: string, payload: string): Promise<string> {
    if (!this.mqttClient) {
      throw new NotFoundException("MQTT client is not initialized.");
    }

    await new Promise<void>((resolve, reject) => {
      this.mqttClient!.publish(topic, payload, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    return `Published to ${topic}: ${payload}`;
  }

  async subscribe(topic: string, callback: (message: string) => void): Promise<void> {
    if (!this.mqttClient) {
      throw new NotFoundException("MQTT client is not initialized.");
    }

    this.mqttClient.subscribe(topic, (err) => {
      if (err) {
        console.error(`Error subscribing to ${topic}:`, err);
        return;
      }
      console.log(`Subscribed to ${topic}`);
    });

    this.mqttClient.on("message", (receivedTopic, message) => {
      if (receivedTopic === topic) {
        const messageString = message.toString();
        callback(messageString);
      }
    });
  }

  async updateHeartbeatOfGateways(providedDoorMacId:string,providedGatewayMacId: string, isActive:boolean){
    await this.prisma.door.updateMany({
      where: {
        doorMacId: providedDoorMacId,
        gatewayMacId: providedGatewayMacId,
      },
      data: {
        isActive: Number(isActive),
      } as Prisma.DoorUpdateManyMutationInput,
    });
  }
  
}



