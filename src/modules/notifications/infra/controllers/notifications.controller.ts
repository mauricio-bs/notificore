import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { SendNotification } from '../../core/application/use-cases/SendNotification';
import { SendNotificationDto } from './dtos/send-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly sendNotification: SendNotification) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async send(@Body() body: SendNotificationDto) {
    const result = await this.sendNotification.execute({
      userId: body.userId,
      targetContact: body.targetContact,
      content: body.content,
      type: body.type,
    });

    if (result.isFailure) {
      throw new HttpException(
        { error: result.error },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const notification = result.getValue();
    return {
      message: 'Notification processed successfully',
      notification: {
        id: notification.id,
        userId: notification.userId,
        sentAt: notification.sentAt,
      },
    };
  }
}
