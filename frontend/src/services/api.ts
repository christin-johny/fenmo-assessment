import axios from 'axios';

// Ensure it points to the backend development server properly
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000, // 10s wait for network tests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
