import { Injectable } from '@nestjs/common';

import { TelegramService } from '../telegram/telegram.service';
import { PaymentDataDto } from './dto/payment-data.dto';

@Injectable()
export class PaymentService {
  constructor(private telegramService: TelegramService) {}

  async submitPaymentData(paymentDataDto: PaymentDataDto): Promise<void> {
    const {
      gender,
      position,
      name,
      surname,
      email,
      phone,
      message,
    } = paymentDataDto;

    const msg = `*Новые данные!*\nПол: ${gender}\nДолжность: ${position}\nИмя: ${name}\nФамилия: ${surname}\nПочта: ${email}\nТелефон: ${phone}\nСообщение: ${message}`;

    await this.telegramService.sendFullData(msg);
  }

  submitPaymentNotification = async payload => {
    const { type } = payload;

    const initialMessage = `*Новый лог!*`;

    let typeMessage = '';

    if (type === 'VISIT') {
      typeMessage = '\nПользователь посетил сайт';
    }

    if (type === 'CONTACT') {
      typeMessage = '\nПользователь посетил страницу контактов';
    }

    if (typeMessage) {
      const message = initialMessage + typeMessage;

      await this.telegramService.sendUsersMessage(message, {
        parse_mode: 'Markdown',
      });
    }
  };
}
