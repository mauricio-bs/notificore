import { Module } from '@nestjs/common';
import { NotificationsController } from './infra/controllers/notifications.controller';
import { SendNotification } from './core/application/use-cases/SendNotification';
import { NOTIFICATION_REPOSITORY } from './core/application/ports/notification.repository';
import { MESSAGE_PROVIDER } from './core/application/ports/message.provider';
import { InMemoryNotificationRepository } from './infra/adapters/in-memory-notification.repository';
import { SmsTwilioAdapter } from './infra/adapters/sms-twilio.adapter';
import { MailhogMailProvider } from './infra/adapters/mailhog.provider';
import { CompositeMessageProvider } from './infra/adapters/composite-message.provider';

@Module({
  controllers: [NotificationsController],
  providers: [
    SendNotification,
    SmsTwilioAdapter,
    MailhogMailProvider,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: InMemoryNotificationRepository,
    },
    {
      provide: MESSAGE_PROVIDER,
      useClass: CompositeMessageProvider,
    },
  ],
})
export class NotificationsModule {}
