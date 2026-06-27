import axios from 'axios';

export const createApiClient = (baseURL, options = {}) => {
  const client = axios.create({
    baseURL,
    timeout: options.timeout || 5000,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', error.message);
      return Promise.reject(error);
    }
  );

  return client;
};
