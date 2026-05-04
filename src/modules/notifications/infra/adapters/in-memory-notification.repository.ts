import { Notification } from '../../core/domain/Notification';
import { NotificationRepository } from '../../core/application/ports/notification.repository';
import { Injectable } from '@nestjs/common';
import { NotificationSaveError } from '../../core/domain/errors/notification-save.error';

@Injectable()
export class InMemoryNotificationRepository implements NotificationRepository {
  private readonly notifications: Map<string, Notification> = new Map();

  save(notification: Notification): void {
    try {
      this.notifications.set(notification.id, notification);
    } catch (error) {
      throw new NotificationSaveError(String(error));
    }
  }

  findById(id: string): Notification | null {
    const notification = this.notifications.get(id);
    return notification || null;
  }
}
