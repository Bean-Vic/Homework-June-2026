import { createApiClient } from './apiClientFactory';

export const createDogService = () => {
  const client = createApiClient('https://dog.ceo/api');

  return {
    getRandomDog: async () => {
      const response = await client.get('/breeds/image/random');
      if (response.data.status !== 'success') {
        throw new Error('API returned non-success status');
      }
      return response.data.message;
    },
  };
};
