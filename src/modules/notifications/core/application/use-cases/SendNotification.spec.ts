import { SendNotification } from './SendNotification';
import type { NotificationRepository } from '../ports/notification.repository';
import type { MessageProvider } from '../ports/message.provider';
import { NoDisturbError } from '../../domain/errors/no-disturb-error';

describe('SendNotification Use Case', () => {
  let sendNotification: SendNotification;
  let mockNotificationRepository: jest.Mocked<NotificationRepository>;
  let mockMessageProvider: jest.Mocked<MessageProvider>;

  beforeEach(() => {
    // Mock implementations for the ports
    mockNotificationRepository = {
      save: jest.fn(),
      findById: jest.fn(),
    };

    mockMessageProvider = {
      send: jest.fn(),
    };

    sendNotification = new SendNotification(
      mockNotificationRepository,
      mockMessageProvider,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('error', () => {
    it('should reject the notification with NoDisturbError if the time is 23:00', async () => {
      // Mock the getHours method to simulate 23:00
      jest.spyOn(global.Date.prototype, 'getHours').mockReturnValue(23);

      const result = await sendNotification.execute({
        userId: 'user-123',
        content: 'Night time notification attempt',
        type: 'EMAIL',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe(new NoDisturbError().message);

      // Ensure the repository and provider were NOT called
      expect(mockNotificationRepository.save).not.toHaveBeenCalled();
      expect(mockMessageProvider.send).not.toHaveBeenCalled();
    });
  });

  describe('success', () => {
    it('should send the notification successfully if the time is 10:00', async () => {
      // Mock the getHours method to simulate 10:00 (allowed time)
      jest.spyOn(global.Date.prototype, 'getHours').mockReturnValue(10);

      const result = await sendNotification.execute({
        userId: 'user-123',
        content: 'Day time notification attempt',
        type: 'EMAIL',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().content).toBe('Day time notification attempt');

      // Ensure the repository and provider WERE called
      expect(mockNotificationRepository.save).toHaveBeenCalledTimes(2);
      expect(mockMessageProvider.send).toHaveBeenCalledTimes(1);
    });
  });
});
