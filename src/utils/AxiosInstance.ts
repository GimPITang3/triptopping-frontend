import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://localhost:3002/api/',
  timeout: 30000,
});

export default instance;
