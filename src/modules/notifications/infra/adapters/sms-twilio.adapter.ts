import { Notification } from '../../core/domain/Notification';
import type { MessageProvider } from '../../core/application/ports/message.provider';
import { Injectable } from '@nestjs/common';
import { MessageDeliveryError } from '../../core/domain/errors/message-delivery.error';

@Injectable()
export class SmsTwilioAdapter implements MessageProvider {
  async send(notification: Notification): Promise<void> {
    try {
      // Simulate Twilio API call
      console.log(`[SmsTwilioAdapter] Connecting to Twilio API...`);
      console.log(
        `[SmsTwilioAdapter] Sending SMS to user ${notification.userId}: "${notification.content}"`,
      );
    } catch (error) {
      throw new MessageDeliveryError('Twilio API', String(error));
    }
  }
}
