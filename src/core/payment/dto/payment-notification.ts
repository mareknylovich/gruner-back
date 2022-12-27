import { IsNotEmpty } from 'class-validator';

export class PaymentNotificationDto {
  @IsNotEmpty()
  type: string;
}
