export class MessageDeliveryError extends Error {
  constructor(provider: string, details: string) {
    super(`${provider} Error: Failed to send message. Details: ${details}`);
    this.name = 'MessageDeliveryError';
  }
}
