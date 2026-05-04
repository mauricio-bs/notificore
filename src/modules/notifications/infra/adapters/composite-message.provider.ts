import { Injectable } from '@nestjs/common';
import { Notification } from '../../core/domain/Notification';
import { MessageProvider } from '../../core/application/ports/message.provider';
import { SmsTwilioAdapter } from './sms-twilio.adapter';
import { MailhogMailProvider } from './mailhog.provider';

@Injectable()
export class CompositeMessageProvider implements MessageProvider {
  constructor(
    private readonly smsAdapter: SmsTwilioAdapter,
    private readonly mailProvider: MailhogMailProvider,
  ) {}

  async send(notification: Notification): Promise<void> {
    if (notification.type === 'SMS') {
      return this.smsAdapter.send(notification);
    }

    return this.mailProvider.send(notification);
  }
}
