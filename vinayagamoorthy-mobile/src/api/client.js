import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT: 'localhost' does not point at your computer from a phone or
// emulator. Set this to your backend's actual reachable address:
//  - Android emulator:  http://10.0.2.2:8000
//  - Physical device:   http://<your-computer's-LAN-IP>:8000
//  - Deployed backend:  https://your-app.onrender.com
export const API_BASE_URL = 'http://10.0.2.2:8000';

const client = axios.create({ baseURL: API_BASE_URL });

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let onUnauthorized = null;
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['access_token', 'user_id']);
      if (onUnauthorized) onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default client;

// FastAPI validation errors arrive as an array of {msg, loc, ...} objects,
// not always a plain string — never render err.response.data.detail directly.
export function extractErrorMessage(err, fallback = 'ஏதோ தவறு நடந்துவிட்டது.') {
  const detail = err?.response?.data?.detail;
  if (!detail) return fallback;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => (typeof d === 'string' ? d : d.msg || JSON.stringify(d))).join(', ');
  }
  return fallback;
}

// ---- Auth ----
export const signup = (payload) => client.post('/auth/signup', payload);
export const login = (payload) => client.post('/auth/login', payload);
export const forgotPassword = (payload) => client.post('/auth/forgot-password', payload);
export const resetPassword = (payload) => client.post('/auth/reset-password', payload);

// ---- Users ----
export const getMyProfile = () => client.get('/users/me');
export const updateMyProfile = (payload) => client.put('/users/me', payload);

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

// ---- Transit Predictions ----
export const getMyTransitPredictions = () => client.get('/transit/me');
