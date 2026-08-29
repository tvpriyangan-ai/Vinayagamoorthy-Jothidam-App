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

// FastAPI error details can be a plain string OR an array of Pydantic
// validation error objects ({msg, loc, ...}) — React can't render the
// latter directly, so every page should go through this instead of
// reading err.response.data.detail directly.
export function extractErrorMessage(err, fallback = 'ஏதோ தவறு நடந்துவிட்டது.') {
  const detail = err?.response?.data?.detail;
  if (!detail) return fallback;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => (typeof d === 'string' ? d : d.msg || JSON.stringify(d))).join(', ');
  }
  return fallback;
}

// ---- Users ----
export const getMyProfile = () => client.get('/users/me');
export const updateMyProfile = (payload) => client.put('/users/me', payload);
export const uploadPalmPhoto = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  // Let the browser set Content-Type (incl. the multipart boundary). Setting
  // it to a bare "multipart/form-data" string omits the boundary and the
  // server then can't parse the upload.
  return client.post('/users/me/palm-photo', formData);
};

// ---- Auth ----
export const signup = (payload) => client.post('/auth/signup', payload);
export const login = (payload) => client.post('/auth/login', payload);
export const forgotPassword = (payload) => client.post('/auth/forgot-password', payload);
export const resetPassword = (payload) => client.post('/auth/reset-password', payload);

// ---- Jathagam ----
export const getMyJathagam = () => client.get('/jathagam/me');
export const getMyJathagamReading = (language, refresh = false) =>
  client.get('/jathagam/me/reading', {
    params: { ...(language ? { language } : {}), ...(refresh ? { refresh: true } : {}) },
  });

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
export const sendChatMessage = (message, language) =>
  client.post('/chat/message', { message, ...(language ? { language } : {}) });
export const getChatHistory = () => client.get('/chat/history');

// ---- Transit Predictions (+ Vimshottari dasha/bhukti) ----
export const getMyTransitPredictions = () => client.get('/transit/me');

// ---- Personal Vastu report ----
export const getMyVastuReport = (language, refresh = false) =>
  client.get('/vastu/me', {
    params: { ...(language ? { language } : {}), ...(refresh ? { refresh: true } : {}) },
  });

// ---- Content Library ----
export const listContent = (category) => client.get('/content', { params: category ? { category } : {} });
export const getContent = (id) => client.get(`/content/${id}`);
