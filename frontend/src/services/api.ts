import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const FINGERPRINT_KEY = 'fenmo_user_fingerprint';

const getDeviceFingerprint = () => {
  let fp = localStorage.getItem(FINGERPRINT_KEY);
  if (!fp) {
    fp = uuidv4();
    localStorage.setItem(FINGERPRINT_KEY, fp);
  }
  return fp;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  config.headers['X-User-Fingerprint'] = getDeviceFingerprint();
  return config;
});

export default api;
