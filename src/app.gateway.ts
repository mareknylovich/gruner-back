import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { PaymentService } from './core/payment/payment.service';
import { PaymentDataDto } from './core/payment/dto/payment-data.dto';
import { PaymentNotificationDto } from './core/payment/dto/payment-notification';

@WebSocketGateway({ cors: { origin: '*', credentials: false } })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private paymentService: PaymentService) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('PAYMENT_NOTIFICATION')
  handlePaymentNotification(
    client: Socket,
    payload: PaymentNotificationDto,
  ): void {
    this.paymentService.submitPaymentNotification(payload);
  }

  @SubscribeMessage('PAYMENT_DATA_SEND')
  handlePaymentData(client: Socket, payload: PaymentDataDto): void {
    this.paymentService.submitPaymentData(payload);
  }

  afterInit(server: Server): void {
    this.logger.log('Init', server);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
