import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Telegraf, Context, Markup } from 'telegraf';
import * as config from 'config';

import { TelegrafConfig } from '../../config/telegraf.config';
import { TelegramUser } from './telegram-user.entity';

declare const global: {
  bot: any;
};

@Injectable()
export class TelegramService implements OnModuleInit {
  bot: any;

  constructor() {}

  handleAuthorization = async (ctx?: any): Promise<void> => {
    const id = String(ctx.chat.id);

    const alreadyUser = await TelegramUser.findOne({
      where: { telegramId: id },
    });

    const vbivSostav = config.get('VBIV_SOSTAV').split(',');

    const isVbiver = vbivSostav.some(item => item === ctx.chat.username);

    if (isVbiver) {
      try {
        const id = String(ctx.chat.id);

        if (alreadyUser) {
          return ctx.reply('Вы уже в базе данных пользователей панели');
        }

        const user = new TelegramUser();

        user.username = ctx.chat.username;
        user.telegramId = id;

        await user.save();

        await ctx.reply(
          `Вы были внесены в базу данных пользователей панели. Теперь в этот чат будет приходить информация о работе панели, ваш ID: ${id}`,
        );
      } catch (e) {
        ctx.reply(`Произошла ошибка: ${e.message}`);
      }
    } else {
      ctx.reply('Нет доступа');
    }
  };

  onModuleInit = (): void => {
    const bot = new Telegraf(TelegrafConfig.botToken);

    bot.start(async ctx => {
      await this.handleAuthorization(ctx);
    });

    bot.launch();

    global.bot = bot;

    this.bot = bot;
  };

  sendFullData = async (message: string): Promise<void> => {
    await this.sendUsersMessage(message, { parse_mode: 'Markdown' });
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  sendUsersMessage = async (message: string, options?: any): Promise<any> => {
    const vbivSostav = config.get('VBIV_SOSTAV');

    const users = (await TelegramUser.find()).filter(user =>
      vbivSostav.includes(user.username),
    );

    const messages = await Promise.all(
      users.map(async item => {
        try {
          const data = await this.bot.telegram.sendMessage(
            item.telegramId,
            message,
            options,
          );

          return data;
        } catch (error) {
          // If user stopped bot
          const { code } = error;

          if (code === 403) {
            await TelegramUser.delete({
              telegramId: item.telegramId,
            });
          }
        }
      }),
    );

    return messages.filter(item => !!item);
  };
}
