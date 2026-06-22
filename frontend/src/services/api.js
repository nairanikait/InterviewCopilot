import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ── Request interceptor: attach JWT ──────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ic_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: unwrap envelope + handle 401 ───────────────────────
// Backend always returns: { success: bool, message: string, data: any }
// We unwrap so callers receive `res.data` = the inner data object directly.
api.interceptors.response.use(
  (response) => {
    // Unwrap the envelope: { success, message, data } → expose inner data
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    // Preserve the backend error message from the envelope for useAsync
    const backendMessage = error.response?.data?.message;
    if (backendMessage) {
      error.message = backendMessage;
    }
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  },
);

// ── Auth ─────────────────────────────────────────────────────────────────────
// POST /api/auth/register  → { token, user: { id, name, email } }
// POST /api/auth/login     → { token, user: { id, name, email } }
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// ── Resume ───────────────────────────────────────────────────────────────────
// POST /api/resume/upload  → { resumeId, originalName, createdAt }
// Field name expected by multer: 'resume'
export const resumeService = {
  upload: (file) => {
    const form = new FormData();
    form.append('resume', file);
    return api.post('/resume/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ── Interview ─────────────────────────────────────────────────────────────────
// POST /api/interview/start
//   body: { resumeId: string, questionCount?: number }
//   → { sessionId, status, questions: [{ index, question }] }
//
// POST /api/interview/evaluate
//   body: { sessionId: string, answers: [{ questionIndex: number, answer: string }] }
//   → { sessionId, status, overallScore, overallFeedback, questions: [...] }
export const interviewService = {
  start: (data) => api.post('/interview/start', data),
  evaluate: (data) => api.post('/interview/evaluate', data),
};

// ── Sessions ──────────────────────────────────────────────────────────────────
// GET /api/sessions → { sessions: [ InterviewSession ] }
export const sessionService = {
  getAll: () => api.get('/sessions'),
};

export default api;
