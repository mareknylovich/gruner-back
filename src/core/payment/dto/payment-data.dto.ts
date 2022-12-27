import { IsNotEmpty } from 'class-validator';

export class PaymentDataDto {
  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  position: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  message: string;
}
