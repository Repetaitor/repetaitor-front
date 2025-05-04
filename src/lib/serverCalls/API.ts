import axios from 'axios';
import { SERVER_URL } from '@/constants';

const api = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

export default api;
