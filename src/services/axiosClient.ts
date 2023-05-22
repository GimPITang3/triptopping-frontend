import axios from 'axios';

const client = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:3001/',
  timeout: 30000,
});

client.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    config.headers.Authorization = accessToken
      ? `Bearer ${accessToken}`
      : undefined;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default client;
