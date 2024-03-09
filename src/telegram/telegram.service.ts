// telegram.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly botToken = '6854052375:AAHzRpvmVCoM7Xzyh-OrPlgMMVyFNe24iBk';
  private readonly apiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

  async sendMessage(userId: string, message: string): Promise<void> {
    const data = {
      chat_id: userId,
      text: message,
    };

    try {
      const response = await axios.post(this.apiUrl, data);
      console.log('Message sent:', response?.data);
    } catch (error) {
      console.error('Error sending message:', error.response.data);
    }
  }
}
