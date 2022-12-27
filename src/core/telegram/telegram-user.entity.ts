import {
  Entity,
  Unique,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'telegram_user' })
@Unique(['id'])
export class TelegramUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  telegramId: string;

  @Column({ nullable: true })
  username: string;
}
