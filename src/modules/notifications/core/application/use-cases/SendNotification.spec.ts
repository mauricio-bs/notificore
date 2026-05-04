/* eslint-disable @typescript-eslint/unbound-method */
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
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn().mockResolvedValue(null),
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
        targetContact: '+5511999999999',
        content: 'Night time notification attempt',
        type: 'EMAIL',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe(new NoDisturbError().message);

      // Ensure the repository and provider were NOT called
      expect(mockNotificationRepository.save).not.toHaveBeenCalled();
      expect(mockMessageProvider.send).not.toHaveBeenCalled();
    });

    it('should return failure if content is empty', async () => {
      jest.spyOn(global.Date.prototype, 'getHours').mockReturnValue(10);

      const result = await sendNotification.execute({
        userId: 'user-123',
        targetContact: 'test@test.com',
        content: '  ',
        type: 'EMAIL',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Content cannot be empty.');
      expect(mockNotificationRepository.save).not.toHaveBeenCalled();
    });

    it('should return failure if repository fails during initial save', async () => {
      jest.spyOn(global.Date.prototype, 'getHours').mockReturnValue(10);
      mockNotificationRepository.save.mockRejectedValueOnce(
        new Error('Database connection failed'),
      );

      const result = await sendNotification.execute({
        userId: 'user-123',
        targetContact: 'test@test.com',
        content: 'Hello',
        type: 'EMAIL',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Database connection failed');
      expect(mockMessageProvider.send).not.toHaveBeenCalled();
    });

    it('should return failure if message provider fails', async () => {
      jest.spyOn(global.Date.prototype, 'getHours').mockReturnValue(10);
      mockMessageProvider.send.mockRejectedValueOnce(new Error('SMTP Error'));

      const result = await sendNotification.execute({
        userId: 'user-123',
        targetContact: 'test@test.com',
        content: 'Hello',
        type: 'EMAIL',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('SMTP Error');
      // Should have saved once before sending
      expect(mockNotificationRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('success', () => {
    it('should send the notification successfully if the time is 10:00', async () => {
      // Mock the getHours method to simulate 10:00 (allowed time)
      jest.spyOn(global.Date.prototype, 'getHours').mockReturnValue(10);

      const result = await sendNotification.execute({
        userId: 'user-123',
        targetContact: '+5511999999999',
        content: 'Day time notification attempt',
        type: 'EMAIL',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().content).toBe('Day time notification attempt');
      expect(result.getValue().sentAt).toBeDefined();

      // Ensure the repository and provider WERE called
      expect(mockNotificationRepository.save).toHaveBeenCalledTimes(2);
      expect(mockMessageProvider.send).toHaveBeenCalledTimes(1);
    });
  });
});
