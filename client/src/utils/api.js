import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Important for sending/receiving HTTP-only cookies
});

export default api;
