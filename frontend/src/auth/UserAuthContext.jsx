import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserAuthContext = createContext();

const normalizeUser = (u) => {
  if (!u) return null;
  let roles = u.roles || ['ROLE_CITIZEN'];
  if (!Array.isArray(roles)) {
    roles = [roles];
  }
  roles = roles.map(r => (typeof r === 'string' ? r : r?.role || r?.name || r?.authority || String(r)));
  return { ...u, roles };
};

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mandi_user_profile');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        return normalizeUser(JSON.parse(saved));
      }
      return null;
    } catch {
      localStorage.removeItem('mandi_user_profile');
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      const saved = localStorage.getItem('mandi_user_token');
      return saved && saved !== 'undefined' && saved !== 'null' ? saved : null;
    } catch {
      localStorage.removeItem('mandi_user_token');
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('mandi_user_token', token);
      localStorage.setItem('mandi_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('mandi_user_token');
      localStorage.removeItem('mandi_user_profile');
      localStorage.removeItem('mandi_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const requestOtp = async (identifier) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login/request-otp', { identifier });
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
      throw new Error(res.data?.message || 'Failed to request OTP');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Unable to request OTP. Please try again.';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otpRequestId, otp) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login/verify-otp', { otpRequestId, otp });
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
        setToken(d.token);
        setUser(u);
        localStorage.setItem('mandi_user_token', d.token);
        localStorage.setItem('mandi_user_profile', JSON.stringify(u));
        return u;
      }
      throw new Error(res.data?.message || 'Invalid OTP');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid or expired OTP.';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (identifier) => {
    return requestOtp(identifier);
  };

  const verifyOtpLogin = async (identifier, otp) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/verify-otp-login', { identifier, otp });
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
        setToken(d.token);
        setUser(u);
        localStorage.setItem('mandi_user_token', d.token);
        localStorage.setItem('mandi_user_profile', JSON.stringify(u));
        return u;
      }
      throw new Error(res.data?.message || 'Invalid OTP');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid or expired OTP';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/user-login', { identifier, password });
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
        setToken(d.token);
        setUser(u);
        localStorage.setItem('mandi_user_token', d.token);
        localStorage.setItem('mandi_user_profile', JSON.stringify(u));
        return u;
      }
      throw new Error(res.data?.message || 'Login failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const requestRegisterOtp = async (registerData) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register/request-otp', registerData);
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
      throw new Error(res.data?.message || 'Failed to request registration verification code');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Unable to send registration code. Please try again.';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const verifyRegisterOtp = async (otpRequestId, otp) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register/verify-otp', { otpRequestId, otp });
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
        setToken(d.token);
        setUser(u);
        localStorage.setItem('mandi_user_token', d.token);
        localStorage.setItem('mandi_user_profile', JSON.stringify(u));
        return u;
      }
      throw new Error(res.data?.message || 'Registration verification failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid or expired verification code.';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', registerData);
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
        setToken(d.token);
        setUser(u);
        localStorage.setItem('mandi_user_token', d.token);
        localStorage.setItem('mandi_user_profile', JSON.stringify(u));
        return u;
      }
      throw new Error(res.data?.message || 'Registration failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('mandi_user_token');
    localStorage.removeItem('mandi_user_profile');
  };

  const userRolesList = Array.isArray(user?.roles)
    ? user.roles.map(r => (typeof r === 'string' ? r : r?.role || r?.name || r?.authority || String(r)))
    : [];

  const isFarmer = userRolesList.some(r => typeof r === 'string' && r.includes('FARMER'));
  const isVolunteer = userRolesList.some(r => typeof r === 'string' && r.includes('VOLUNTEER'));
  const isWorker = userRolesList.some(r => typeof r === 'string' && r.includes('WORKER'));
  const isProvider = userRolesList.some(r => typeof r === 'string' && (r.includes('SERVICE_PROVIDER') || r.includes('PROVIDER') || r.includes('TRANSPORT')));
  const isMitra = userRolesList.some(r => typeof r === 'string' && (r.includes('MANDI_MITRA') || r.includes('MITRA')));

  return (
    <UserAuthContext.Provider
      value={{
        user,
        token,
        loading,
        requestOtp,
        verifyOtp,
        sendOtp,
        verifyOtpLogin,
        requestRegisterOtp,
        verifyRegisterOtp,
        login,
        register,
        logout,
        isFarmer,
        isVolunteer,
        isWorker,
        isProvider,
        isMitra
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);
