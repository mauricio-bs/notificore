import { Notification } from '../../core/domain/Notification';
import type { MessageProvider } from '../../core/application/ports/message.provider';
import { Injectable } from '@nestjs/common';
import { MessageDeliveryError } from '../../core/domain/errors/message-delivery.error';

@Injectable()
export class SmsTwilioAdapter implements MessageProvider {
  async send(notification: Notification): Promise<void> {
    try {
      const twilioUrl = process.env.TWILIO_BASE_URL || 'http://localhost:8080';

      console.log(
        `[SmsTwilioAdapter] Connecting to Twilio API emulator at ${twilioUrl}...`,
      );

      const response = await fetch(`${twilioUrl}/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: notification.targetContact,
          From: '+15005550006',
          Body: notification.content,
        }).toString(),
      });

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`,
        );
      }

      console.log(
        `[SmsTwilioAdapter] Successfully sent SMS to user ${notification.userId}: "${notification.content}"`,
      );
    } catch (error) {
      throw new MessageDeliveryError('Twilio API', String(error));
    }
  }
}
