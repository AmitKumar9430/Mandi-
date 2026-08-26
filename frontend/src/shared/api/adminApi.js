import axios from 'axios';

const getAdminBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    const base = envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
    return `${base}/admin`;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8080/api/admin';
  }
  return 'https://mandi-backend-j7g8.onrender.com/api/admin';
};

const adminClient = axios.create({
  baseURL: getAdminBaseUrl(),
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' }
});

adminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('mandi_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminClient.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      // Unauthorized admin access
    }
    const msg = err.response?.data?.message || err.message || 'Admin operation failed';
    return Promise.reject(new Error(msg));
  }
);

export const adminOpsApi = {
  // Analytics
  getAnalytics: (params) => adminClient.get('/analytics', { params }),

  // Problems Management
  getProblems: (params) => adminClient.get('/problems', { params }),
  editProblem: (id, data) => adminClient.put(`/problems/${id}`, data),
  deleteProblem: (id) => adminClient.delete(`/problems/${id}`),
  escalateProblem: (id) => adminClient.post(`/problems/${id}/escalate`),
  closeProblem: (id) => adminClient.post(`/problems/${id}/close`),
  assignProblem: (id, data) => adminClient.post(`/problems/${id}/assign`, data),

  // Organization & Department Management
  getOrganizations: () => adminClient.get('/organizations'),
  createOrganization: (data) => adminClient.post('/organizations', data),
  updateOrganization: (id, data) => adminClient.put(`/organizations/${id}`, data),
  deleteOrganization: (id) => adminClient.delete(`/organizations/${id}`),
  toggleVerifyOrganization: (id) => adminClient.patch(`/organizations/${id}/toggle-verify`),

  // Users Directory & Moderation
  getUsers: () => adminClient.get('/users'),
  editUser: (id, data) => adminClient.put(`/users/${id}`, data),
  toggleUserVerify: (id) => adminClient.patch(`/users/${id}/toggle-verify`),
  suspendUser: (id) => adminClient.post(`/users/${id}/suspend`),
  restoreUser: (id) => adminClient.post(`/users/${id}/restore`),
  deleteUser: (id) => adminClient.delete(`/users/${id}`),

  // Agriculture Crops
  getCrops: () => adminClient.get('/crops'),
  deleteCrop: (id) => adminClient.delete(`/crops/${id}`),

  // Jobs
  getJobs: () => adminClient.get('/jobs'),
  deleteJob: (id) => adminClient.delete(`/jobs/${id}`),

  // Resources
  getResources: () => adminClient.get('/resources'),
  verifyResource: (id) => adminClient.post(`/resources/${id}/verify`),
  rejectResource: (id) => adminClient.post(`/resources/${id}/reject`),
  deleteResource: (id) => adminClient.delete(`/resources/${id}`),

  // Administrators Management
  getAdministrators: () => adminClient.get('/administrators'),
  createAdministrator: (data) => adminClient.post('/administrators', data),
  deleteAdministrator: (id) => adminClient.delete(`/administrators/${id}`),

  // Audit Logs & Settings
  getAuditLogs: () => adminClient.get('/audit-logs'),
  getSettings: () => adminClient.get('/settings'),
};

export default adminOpsApi;
