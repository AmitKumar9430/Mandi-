import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminAuthContext = createContext();

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

const API_BASE = getBaseUrl();

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mandi_admin_profile');
      return saved && saved !== 'undefined' && saved !== 'null' ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem('mandi_admin_profile');
      return null;
    }
  });

  const [adminToken, setAdminToken] = useState(() => {
    try {
      const saved = localStorage.getItem('mandi_admin_token');
      return saved && saved !== 'undefined' && saved !== 'null' ? saved : null;
    } catch {
      localStorage.removeItem('mandi_admin_token');
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem('mandi_admin_token', adminToken);
      localStorage.setItem('mandi_token', adminToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
    } else {
      localStorage.removeItem('mandi_admin_token');
      localStorage.removeItem('mandi_admin_profile');
      localStorage.removeItem('mandi_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [adminToken]);

  const requestAdminOtp = async (identifier) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/admin-login/request-otp`, {
        identifier
      });
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
      throw new Error(res.data?.message || 'Admin OTP request failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Administrator OTP request failed.';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const verifyAdminOtp = async (otpRequestId, otp) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/admin-login/verify-otp`, {
        otpRequestId,
        otp
      });
      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        const u = {
          id: d.userId,
          fullName: d.fullName,
          phone: d.phone,
          email: d.email,
          roles: d.roles,
          preferredLanguage: d.preferredLanguage
        };
        setAdminToken(d.token);
        setAdminUser(u);
        localStorage.setItem('mandi_admin_token', d.token);
        localStorage.setItem('mandi_admin_profile', JSON.stringify(u));
        return u;
      }
      throw new Error(res.data?.message || 'Admin OTP verification failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid or expired OTP.';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (identifier, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/admin-login`, {
        identifier,
        password
      });

      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        const u = {
          id: d.userId,
          fullName: d.fullName,
          phone: d.phone,
          email: d.email,
          roles: d.roles,
          preferredLanguage: d.preferredLanguage
        };
        setAdminToken(d.token);
        setAdminUser(u);
        localStorage.setItem('mandi_admin_token', d.token);
        localStorage.setItem('mandi_admin_profile', JSON.stringify(u));
        return u;
      }
      throw new Error(res.data?.message || 'Admin authentication failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Admin Login Failed';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('mandi_admin_token');
    localStorage.removeItem('mandi_admin_profile');
  };

  const adminRolesList = Array.isArray(adminUser?.roles)
    ? adminUser.roles.map(r => (typeof r === 'string' ? r : r?.role || r?.name || r?.authority || String(r)))
    : [];

  const isSuperAdmin = adminRolesList.some(r => typeof r === 'string' && r.includes('SUPER_ADMIN')) || adminUser?.email === 'amitkr9523da@gmail.com';
  const isModerator = adminRolesList.some(r => typeof r === 'string' && r.includes('MODERATOR'));
  const isAdmin = adminRolesList.some(r => typeof r === 'string' && r.includes('ADMIN'));

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        adminToken,
        loading,
        requestAdminOtp,
        verifyAdminOtp,
        loginAdmin,
        logoutAdmin,
        isAdmin,
        isSuperAdmin,
        isModerator
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
