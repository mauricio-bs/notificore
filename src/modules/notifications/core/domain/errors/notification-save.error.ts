export class NotificationSaveError extends Error {
  constructor(details: string) {
    super(`Database Error: Could not save notification. Details: ${details}`);
    this.name = 'NotificationSaveError';
  }
}
