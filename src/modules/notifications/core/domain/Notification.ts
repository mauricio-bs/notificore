import { Result } from './Result';
import { NoDisturbError } from './errors/no-disturb-error';
import { randomUUID } from 'crypto';

export interface NotificationProps {
  userId: string;
  content: string;
  type: 'EMAIL' | 'SMS';
  createdAt?: Date;
  sentAt?: Date;
}

export class Notification {
  private readonly props: NotificationProps;
  private readonly _id: string;

  private constructor(props: NotificationProps, id?: string) {
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
    };
    this._id = id || randomUUID();
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get content(): string {
    return this.props.content;
  }

  get type(): 'EMAIL' | 'SMS' {
    return this.props.type;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get sentAt(): Date | undefined {
    return this.props.sentAt;
  }

  public markAsSent(): void {
    this.props.sentAt = new Date();
  }

  public static create(
    props: NotificationProps,
    id?: string,
  ): Result<Notification> {
    // Business Rule: No-Disturb between 22:00 and 06:00
    const currentHour = new Date().getHours();
    if (currentHour >= 22 || currentHour < 6) {
      return Result.fail<Notification>(new NoDisturbError().message);
    }

    if (!props.content || props.content.trim() === '') {
      return Result.fail<Notification>('Content cannot be empty.');
    }

    const notification = new Notification(props, id);
    return Result.ok<Notification>(notification);
  }
}
