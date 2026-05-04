import { Notification } from '../../domain/Notification';

export interface MessageProvider {
  send(notification: Notification): Promise<void>;
}

export const MESSAGE_PROVIDER = Symbol('MESSAGE_PROVIDER');
