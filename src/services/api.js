import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  headers: {
    'x-api-key': 'your_secure_api_token'
  }
});

export default api;
