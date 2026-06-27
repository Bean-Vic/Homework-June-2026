import axios from 'axios';
import { createDogService } from './dogServiceFactory';

jest.mock('axios');

describe('dogServiceFactory', () => {
  let mockClient;

  beforeEach(() => {
    mockClient = {
      get: jest.fn(),
      interceptors: {
        response: { use: jest.fn() },
      },
    };
    axios.create.mockReturnValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDogService', () => {
    it('creates a client with the correct base URL', () => {
      createDogService();

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://dog.ceo/api',
        })
      );
    });

    it('returns an object with getRandomDog method', () => {
      const service = createDogService();

      expect(service).toHaveProperty('getRandomDog');
      expect(typeof service.getRandomDog).toBe('function');
    });
  });

  describe('getRandomDog', () => {
    it('returns image URL on successful response', async () => {
      // Arrange
      const mockUrl = 'https://images.dog.ceo/breeds/terrier/test.jpg';
      mockClient.get.mockResolvedValue({
        data: { message: mockUrl, status: 'success' },
      });
      const service = createDogService();

      // Act
      const result = await service.getRandomDog();

      // Assert
      expect(result).toBe(mockUrl);
      expect(mockClient.get).toHaveBeenCalledWith('/breeds/image/random');
      expect(mockClient.get).toHaveBeenCalledTimes(1);
    });

    it('throws error when API returns non-success status', async () => {
      mockClient.get.mockResolvedValue({
        data: { message: '', status: 'error' },
      });
      const service = createDogService();

      await expect(service.getRandomDog()).rejects.toThrow(
        'API returned non-success status'
      );
    });

    it('propagates network errors from axios', async () => {
      const networkError = new Error('Network Error');
      mockClient.get.mockRejectedValue(networkError);
      const service = createDogService();

      await expect(service.getRandomDog()).rejects.toThrow('Network Error');
    });

    it('handles missing status field as failure', async () => {
      mockClient.get.mockResolvedValue({
        data: { message: 'some-url' },  // 没有 status 字段
      });
      const service = createDogService();

      await expect(service.getRandomDog()).rejects.toThrow(
        'API returned non-success status'
      );
    });
  });
});
