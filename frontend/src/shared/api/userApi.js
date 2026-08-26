import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8080/api';
  }
  return 'https://mandi-backend-j7g8.onrender.com/api';
};

const userClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

userClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('mandi_user_token') ||
    localStorage.getItem('mandi_admin_token') ||
    localStorage.getItem('mandi_token') ||
    localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

userClient.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('mandi_token');
      localStorage.removeItem('mandi_user_token');
      localStorage.removeItem('mandi_admin_token');
      localStorage.removeItem('mandi_user');
      localStorage.removeItem('mandi_user_profile');
      localStorage.removeItem('mandi_admin_profile');
      const msg = err.response?.data?.message || 'Access Denied / Session Expired: Please log in with a valid account to perform this action.';
      return Promise.reject(new Error(msg));
    }
    const msg = err.response?.data?.message || err.message || 'Network request failed';
    return Promise.reject(new Error(msg));
  }
);

export const userProblemApi = {
  create: (data) => userClient.post('/problems', data),
  createProblem: (data) => userClient.post('/problems', data),
  getBestMatches: (id, limit) => userClient.get(`/problems/${id}/best-matches?limit=${limit || 5}`),
  previewClassify: (text, category) => userClient.post(`/problems/classify-preview?text=${encodeURIComponent(text)}${category ? `&category=${category}` : ''}`),
  detectDuplicates: (params) => userClient.post('/problems/detect-duplicates', null, { params }),
  getById: (id) => userClient.get(`/problems/${id}`),
  getByPassport: (code) => userClient.get(`/problems/passport/${code}`),
  search: (params) => userClient.get('/problems', { params }),
  getMyProblems: (params) => userClient.get('/problems/my', { params }),
  getOrgProblems: (orgId, params) => userClient.get(`/problems/organization/${orgId}`, { params }),
  getMapProblems: () => userClient.get('/problems/map'),

  // Workflow transition APIs
  assign: (id, data) => userClient.post(`/problems/${id}/assign`, data),
  accept: (id, data) => userClient.post(`/problems/${id}/accept`, data || {}),
  startWork: (id, data) => userClient.post(`/problems/${id}/start-work`, data || {}),
  addProgress: (id, data) => userClient.post(`/problems/${id}/progress`, data),
  markCompleted: (id, data) => userClient.post(`/problems/${id}/mark-completed`, data),
  verify: (id, data) => userClient.post(`/problems/${id}/verify`, data),
  feedback: (id, data) => userClient.post(`/problems/${id}/feedback`, data),
  escalate: (id, data) => userClient.post(`/problems/${id}/escalate`, data),
  addComment: (id, data) => userClient.post(`/problems/${id}/comments`, data),
  addInternalNote: (id, data) => userClient.post(`/problems/${id}/internal-note`, data),
};

export const userOrgApi = {
  getAll: (params) => userClient.get('/organizations', { params }),
  getById: (id) => userClient.get(`/organizations/${id}`),
  getCategories: () => userClient.get('/organizations/categories'),
};

export const userNotificationApi = {
  getAll: (params) => userClient.get('/notifications', { params }),
  getRecent: () => userClient.get('/notifications/recent'),
  getUnreadCount: () => userClient.get('/notifications/unread-count'),
  markAsRead: (id) => userClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => userClient.post('/notifications/read-all'),
};

export const userSolutionApi = {
  getByProblemId: (problemId) => userClient.get(`/solutions/problem/${problemId}`),
  getMatches: (problemId) => userClient.get(`/solutions/problem/${problemId}/matches`),
  acceptSolution: (problemId) => userClient.post(`/solutions/problem/${problemId}/accept`),
  claimStep: (stepId, data) => userClient.post(`/solutions/steps/${stepId}/claim`, data || {}),
  completeStep: (stepId, data) => userClient.post(`/solutions/steps/${stepId}/complete`, data),
  getClaimableTasks: () => userClient.get('/solutions/tasks/claimable'),
  getMyTasks: () => userClient.get('/solutions/tasks/my'),
};

export const userAgriApi = {
  createCrop: (data) => userClient.post('/crops', data),
  searchCrops: (params) => userClient.get('/crops', { params }),
  getMyCrops: () => userClient.get('/crops/my'),
  getCropById: (id) => userClient.get(`/crops/${id}`),
  submitInquiry: (cropId, data) => userClient.post(`/crops/${cropId}/inquiries`, data),
  getInquiries: (cropId) => userClient.get(`/crops/${cropId}/inquiries`),
  getMandiRates: (params) => userClient.get('/crops/mandi-rates', { params }),
  getDemandBoard: (params) => userClient.get('/crops/demand-board', { params }),
  getWeatherAdvisory: (params) => userClient.get('/crops/weather-advisory', { params }),
  getNearbyAgriServices: (params) => userClient.get('/crops/nearby-agri-services', { params }),
  getStorageFacilities: (params) => userClient.get('/crops/storage-facilities', { params }),
  broadcastEmergency: (data) => userClient.post('/crops/emergency-broadcast', data),
};

export const userJobApi = {
  createJob: (data) => userClient.post('/jobs', data),
  searchJobs: (params) => userClient.get('/jobs', { params }),
  getMyJobs: () => userClient.get('/jobs/my'),
  registerTimeBank: (data) => userClient.post('/jobs/timebank', data),
  getTimeBankList: () => userClient.get('/jobs/timebank'),
};

export const userCivicApi = {
  create: (data) => userClient.post('/civic', data),
  search: (params) => userClient.get('/civic', { params }),
  getAll: (params) => userClient.get('/civic', { params }),
  getMyReports: () => userClient.get('/civic/my'),
  upvote: (id) => userClient.post(`/civic/${id}/upvote`),
};

export const userSchemeApi = {
  search: (params) => userClient.get('/schemes', { params }),
  getById: (id) => userClient.get(`/schemes/${id}`),
};

export const userPulseApi = {
  getOverview: () => userClient.get('/pulse/overview'),
};

export const userCropOrderApi = {
  createOrder: (data) => userClient.post('/crop-orders', data),
  getMyPurchases: () => userClient.get('/crop-orders/my-purchases'),
  getMySales: () => userClient.get('/crop-orders/my-sales'),
  getOrderById: (id) => userClient.get(`/crop-orders/${id}`),
  acceptOrder: (id) => userClient.post(`/crop-orders/${id}/accept`),
};

export const userTransportApi = {
  registerVehicle: (data) => userClient.post('/transport/vehicles', data),
  getMyVehicles: () => userClient.get('/transport/vehicles/my'),
  setAvailability: (id, data) => userClient.post(`/transport/vehicles/${id}/availability`, data),
  createRequest: (data) => userClient.post('/transport/requests', data),
  getMyRequests: () => userClient.get('/transport/requests/my'),
  getProviderJobs: () => userClient.get('/transport/requests/provider-jobs'),
  getNearbyRequests: (params) => userClient.get('/transport/requests/nearby', { params }),
  acceptRequest: (id, data) => userClient.post(`/transport/requests/${id}/accept`, data || {}),
  counterRequest: (id, data) => userClient.post(`/transport/requests/${id}/counter`, data),
  updateTripStatus: (id, status) => userClient.post(`/transport/requests/${id}/status?status=${status}`),
};

export const userMitraApi = {
  getNearest: (params) => userClient.get('/village-mitra/nearest', { params }),
  requestAssistance: (data) => userClient.post('/village-mitra/assistance', data),
  getMyRequests: () => userClient.get('/village-mitra/my-requests'),
  getMyCases: () => userClient.get('/village-mitra/my-cases'),
  recordVerification: (data) => userClient.post('/village-mitra/verify', data),
  escalateCase: (data) => userClient.post('/village-mitra/escalate', data),
};

export const userCoordinationApi = {
  getOpportunities: (limit) => userClient.get(`/coordination/opportunities?limit=${limit || 10}`),
  createLinkedTransport: (data) => userClient.post('/coordination/crop-order-transport', data),
  submitCounterOffer: (data) => userClient.post('/coordination/counter-offer', data),
  requestMitraFallback: (data) => userClient.post('/coordination/mitra-fallback', data),
  getDemandSupplyGap: () => userClient.get('/coordination/demand-supply-gap'),
};

export default userClient;
