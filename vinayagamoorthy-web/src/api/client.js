import axios from 'axios';

// Set VITE_API_BASE_URL in a .env file to point at your deployed Render backend.
// Falls back to localhost for local development against `uvicorn app.main:app --reload`.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const client = axios.create({ baseURL: API_BASE_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default client;

// ---- Auth ----
export const signup = (payload) => client.post('/auth/signup', payload);
export const login = (payload) => client.post('/auth/login', payload);
export const forgotPassword = (payload) => client.post('/auth/forgot-password', payload);
export const resetPassword = (payload) => client.post('/auth/reset-password', payload);

// ---- Jathagam ----
export const getMyJathagam = () => client.get('/jathagam/me');

// ---- Panchangam ----
export const getTodayPanchangam = (params) => client.get('/panchangam/today', { params });

// ---- Matching ----
export const checkMatching = (payload) => client.post('/matching/check', payload);

// ---- Lucky Notes ----
export const getMyLuckyNotes = () => client.get('/lucky-notes/me');

// ---- Dosha ----
export const getMyDosha = () => client.get('/dosha/me');

// ---- Temples ----
export const listTemples = (params) => client.get('/temples', { params });
export const getTemple = (id) => client.get(`/temples/${id}`);
export const getTemplesForMyDoshas = () => client.get('/temples/for-my-doshas');

// ---- Chat ----
export const sendChatMessage = (message) => client.post('/chat/message', { message });
export const getChatHistory = () => client.get('/chat/history');
