import { Notification } from '../../domain/Notification';

export interface MessageProvider {
  send(notification: Notification): void;
}

export const MESSAGE_PROVIDER = Symbol('MESSAGE_PROVIDER');
