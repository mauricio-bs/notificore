import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SendNotification } from '../../core/application/use-cases/SendNotification';

export class SendNotificationDto {
  userId: string;
  content: string;
  type: 'EMAIL' | 'SMS';
}

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly sendNotification: SendNotification) {}

  @Post()
  async send(@Body() body: SendNotificationDto) {
    const result = await this.sendNotification.execute({
      userId: body.userId,
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
