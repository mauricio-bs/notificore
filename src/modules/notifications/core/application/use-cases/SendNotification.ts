import { Result } from '../../domain/Result';
import { Notification, NotificationProps } from '../../domain/Notification';
import type { NotificationRepository } from '../ports/notification.repository';
import { NOTIFICATION_REPOSITORY } from '../ports/notification.repository';
import type { MessageProvider } from '../ports/message.provider';
import { MESSAGE_PROVIDER } from '../ports/message.provider';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class SendNotification {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
    @Inject(MESSAGE_PROVIDER)
    private readonly messageProvider: MessageProvider,
  ) {}

  async execute(props: NotificationProps): Promise<Result<Notification>> {
    const notificationResult = Notification.create(props);

    if (notificationResult.isFailure) {
      return notificationResult;
    }

    const notification = notificationResult.getValue();

    try {
      await this.notificationRepository.save(notification);

      await this.messageProvider.send(notification);
      notification.markAsSent();

      await this.notificationRepository.save(notification);

      return Result.ok<Notification>(notification);
    } catch (error) {
      return Result.fail<Notification>(
        error.message || 'An unexpected error occurred during dispatch',
      );
    }
  }
}
