import { Injectable, OnModuleInit } from "@nestjs/common";
import { connect } from "mqtt";

@Injectable()
export class MqttService implements OnModuleInit {
  private mqttClient;

  onModuleInit() {

    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

    const connectUrl = `mqtt://io.adafruit.com`;

    this.mqttClient = connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      username: 'pranitbhatt',
      password: 'aio_qiGC61bvopAHXuEYLEeGHUCq0qtb',
      reconnectPeriod: 1000,
    });

    this.mqttClient.on("connect", function () {
      console.log("Connected to CloudMQTT");
    });

    this.mqttClient.on("error", function () {
      console.log("Error in connecting to CloudMQTT");
    });
}

  async publish(topic: string, payload: string): Promise<string> {
    await this.mqttClient.publish(topic, payload);
    return `Publishing to ${topic}`;
  }
}