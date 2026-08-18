import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
  }
  return 'https://mandi-backend-j7g8.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('mandi_admin_token') ||
      localStorage.getItem('mandi_user_token') ||
      localStorage.getItem('mandi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear stale token if unauthorized
      localStorage.removeItem('mandi_token');
      localStorage.removeItem('mandi_user');
    }
    const message =
      error.response?.data?.message ||
      (error.response?.data?.errors ? error.response.data.errors.join(', ') : null) ||
      error.message ||
      'Something went wrong. Please check your connection.';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

export const problemApi = {
  create: (data) => api.post('/problems', data),
  previewClassify: (text, category) => api.post(`/problems/classify-preview?text=${encodeURIComponent(text)}${category ? `&category=${category}` : ''}`),
  getById: (id) => api.get(`/problems/${id}`),
  getByPassport: (code) => api.get(`/problems/passport/${code}`),
  search: (params) => api.get('/problems', { params }),
  getMyProblems: (params) => api.get('/problems/my', { params }),
  getMapProblems: () => api.get('/problems/map'),
  updateStatus: (id, data) => api.patch(`/problems/${id}/status`, data),
  resolve: (id, data) => api.post(`/problems/${id}/resolve`, data),
};

export const solutionApi = {
  getByProblemId: (problemId) => api.get(`/solutions/problem/${problemId}`),
  getMatches: (problemId) => api.get(`/solutions/problem/${problemId}/matches`),
  acceptSolution: (problemId) => api.post(`/solutions/problem/${problemId}/accept`),
  claimStep: (stepId, data) => api.post(`/solutions/steps/${stepId}/claim`, data || {}),
  completeStep: (stepId, data) => api.post(`/solutions/steps/${stepId}/complete`, data),
  getClaimableTasks: () => api.get('/solutions/tasks/claimable'),
  getMyTasks: () => api.get('/solutions/tasks/my'),
};

export const resourceApi = {
  create: (data) => api.post('/resources', data),
  search: (params) => api.get('/resources', { params }),
  getById: (id) => api.get(`/resources/${id}`),
  getMapResources: () => api.get('/resources/map'),
  toggleAvailability: (id) => api.patch(`/resources/${id}/toggle-availability`),
};

export const agricultureApi = {
  createCrop: (data) => api.post('/crops', data),
  searchCrops: (params) => api.get('/crops', { params }),
  getMyCrops: () => api.get('/crops/my'),
  getCropById: (id) => api.get(`/crops/${id}`),
  submitInquiry: (cropId, data) => api.post(`/crops/${cropId}/inquiries`, data),
  getInquiries: (cropId) => api.get(`/crops/${cropId}/inquiries`),
  updateInquiryStatus: (inquiryId, status) => api.patch(`/crops/inquiries/${inquiryId}/status?status=${status}`),
};

export const jobApi = {
  createJob: (data) => api.post('/jobs', data),
  searchJobs: (params) => api.get('/jobs', { params }),
  getMyJobs: () => api.get('/jobs/my'),
  registerTimeBank: (data) => api.post('/jobs/timebank', data),
  getTimeBankList: () => api.get('/jobs/timebank'),
  postSkillExchange: (data) => api.post('/jobs/skill-exchange', data),
  getSkillExchanges: () => api.get('/jobs/skill-exchange'),
};

export const schemeApi = {
  search: (params) => api.get('/schemes', { params }),
  getById: (id) => api.get(`/schemes/${id}`),
};

export const civicApi = {
  create: (data) => api.post('/civic', data),
  search: (params) => api.get('/civic', { params }),
  upvote: (id) => api.post(`/civic/${id}/upvote`),
};

export const pulseApi = {
  getOverview: () => api.get('/pulse/overview'),
};

export const adminApi = {
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  getProblems: (params) => api.get('/admin/problems', { params }),
  editProblem: (id, data) => api.put(`/admin/problems/${id}`, data),
  deleteProblem: (id) => api.delete(`/admin/problems/${id}`),
  getUsers: () => api.get('/admin/users'),
  editUser: (id, data) => api.put(`/admin/users/${id}`, data),
  toggleUserVerify: (id) => api.patch(`/admin/users/${id}/toggle-verify`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getCrops: () => api.get('/admin/crops'),
  deleteCrop: (id) => api.delete(`/admin/crops/${id}`),
  getJobs: () => api.get('/admin/jobs'),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  getResources: () => api.get('/admin/resources'),
  deleteResource: (id) => api.delete(`/admin/resources/${id}`),
};

export default api;
