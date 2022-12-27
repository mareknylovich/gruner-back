import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TelegramService } from '../telegram/telegram.service';
import { TelegramUser } from './telegram-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TelegramUser])],
  controllers: [],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
