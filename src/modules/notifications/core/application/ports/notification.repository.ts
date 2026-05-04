import { Notification } from '../../domain/Notification';

export interface NotificationRepository {
  save(notification: Notification): void;
  findById(id: string): Notification | null;
}

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');
