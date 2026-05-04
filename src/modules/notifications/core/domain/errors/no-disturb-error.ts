export class NoDisturbError extends Error {
  constructor() {
    super(
      'Cannot send notifications between 22:00 and 06:00 (No-Disturb period).',
    );
    this.name = 'NoDisturbError';
  }
}
