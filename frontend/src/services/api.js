import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Auth functions
export const sendOTP = async (username, phone_number) => {
  const response = await api.post('/auth/send-otp/', { username, phone_number });
  return response.data;
};

export const verifyOTP = async (phone_number, otp, username, password) => {
  const response = await api.post('/auth/verify-otp/', { phone_number, otp, username, password });
  return response.data;
};

export const login = async (username, password) => {
  const response = await api.post('/auth/login/', { username, password });
  return response.data;
};

export const register = async (data) => {
  const response = await api.post('/auth/register/', data);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout/');
  return response.data;
};

export const apiService = {
  // Health check
  healthCheck: () => api.get('/health/'),

  // Preprocess text
  preprocessText: (text) => api.post('/preprocess/', { text }),

  // Translate Kannada to English
  translateKannada: (text) => api.post('/translate/kannada/', { text }),

  // Generate code from description
  generateCode: (description) => api.post('/generate/code/', { description }),

  // Execute code locally
  executeCode: (code, inputs = []) => api.post('/execute/code/', { code, inputs }),

  // Full pipeline (Kannada -> English -> Code -> Execute/Trinket)
  fullPipeline: (kannadaDescription, useTrinket = true, inputs = []) =>
    api.post('/pipeline/full/', {
      kannada_description: kannadaDescription,
      use_trinket: useTrinket,
      inputs,
    }),

  // Generate Trinket embed
  generateTrinketEmbed: (code) => api.post('/trinket/embed/', { code }),

  // ============ MONGODB ENDPOINTS ============

  // Files & Study Materials
  getStudyMaterials: async () => {
    try {
      const response = await api.get('/public/materials/study_materials/');
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response || error);
      throw error;
    }
  },

  downloadStudyMaterial: (fileId) => {
    window.location.href = `${API_BASE_URL}/public/materials/download_material/?id=${fileId}`;
  },

  // User Files (Authenticated)
  getUserFiles: () => api.get('/files/list_files/'),

  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  downloadUserFile: (fileId) => {
    window.location.href = `${API_BASE_URL}/files/download/?id=${fileId}`;
  },

  deleteUserFile: (fileId) => api.delete(`/files/delete_file/?id=${fileId}`),

  getFileInfo: (fileId) => api.get(`/files/get_file_info/?id=${fileId}`),

  // Notes (Authenticated)
  getNotes: (page = 1, limit = 10) => api.get('/notes/', { params: { page, limit } }),

  createNote: (title, content, language = 'kannada', tags = []) =>
    api.post('/notes/', { title, content, language, tags }),

  getNote: (noteId) => api.get(`/notes/${noteId}/`),

  updateNote: (noteId, title, content, tags) =>
    api.put(`/notes/${noteId}/`, { title, content, tags }),

  deleteNote: (noteId) => api.delete(`/notes/${noteId}/`),

  searchNotes: (query) => api.get('/notes/search/', { params: { q: query } }),

  // Quiz Questions (Public)
  getPublicQuizQuestions: (category, difficulty = null) => {
    const params = { category };
    if (difficulty) params.difficulty = difficulty;
    return api.get('/public/quiz-questions/', { params });
  },

  getRandomQuizQuestions: (limit = 5, difficulty = null) => {
    const params = { limit };
    if (difficulty) params.difficulty = difficulty;
    return api.get('/public/quiz-questions/random/', { params });
  },

  // Quiz Questions (Authenticated)
  getQuizQuestions: (category, difficulty = null) => {
    const params = { category };
    if (difficulty) params.difficulty = difficulty;
    return api.get('/quiz-questions/', { params });
  },

  getRandomQuizzes: (difficulty = null, limit = 5) => {
    const params = { limit };
    if (difficulty) params.difficulty = difficulty;
    return api.get('/quiz-questions/random_by_difficulty/', { params });
  },

  // Quiz Attempts
  getQuizAttempts: () => api.get('/quiz-attempts/'),

  submitQuizAnswer: (questionId, selectedOptionId, isCorrect) =>
    api.post('/quiz-attempts/', { question_id: questionId, selected_option_id: selectedOptionId, is_correct: isCorrect }),

  getQuizPerformance: () => api.get('/quiz-attempts/performance/'),

};

export default api;
