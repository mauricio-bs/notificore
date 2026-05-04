import { Notification } from '../../core/domain/Notification';
import { MessageProvider } from '../../core/application/ports/message.provider';
import { Injectable } from '@nestjs/common';
import { MessageDeliveryError } from '../../core/domain/errors/message-delivery.error';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailhogMailProvider implements MessageProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      ignoreTLS: true,
    });
  }

  async send(notification: Notification): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: '"NotifiCore System" <no-reply@notificore.local>',
        to: `user-${notification.userId}@example.com`,
        subject: `New ${notification.type} Notification`,
        text: notification.content,
      });
      console.log(
        `[MailhogMailProvider] Email sent to user ${notification.userId}`,
      );
    } catch (error) {
      throw new MessageDeliveryError('Mailhog', String(error));
    }
  }
}
