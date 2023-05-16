import axios from 'axios';

const client = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:3001/',
  timeout: 30000,
});

export default client;
