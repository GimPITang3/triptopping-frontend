import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:3002/api/',
  timeout: 30000,
});

export default instance;
