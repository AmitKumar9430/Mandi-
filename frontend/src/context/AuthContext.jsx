import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext();

export const DEMO_USERS = [
  { roleName: 'Farmer (किसान)', phone: '9876543211', email: 'farmer@mandi.org', name: 'Balram Singh', icon: '🌾' },
  { roleName: 'Citizen (नागरिक)', phone: '9876543210', email: 'citizen@mandi.org', name: 'Rameshwar Kumar', icon: '👤' },
  { roleName: 'Volunteer (सेवा)', phone: '9876543213', email: 'volunteer@mandi.org', name: 'Pooja Sharma', icon: '🤝' },
  { roleName: 'Worker (कारीगर)', phone: '9876543212', email: 'worker@mandi.org', name: 'Chhotu Lal Mistri', icon: '🛠️' },
  { roleName: 'Provider (उपकरण)', phone: '9876543215', email: 'provider@mandi.org', name: 'Awadh Kisan Services', icon: '🚜' },
  { roleName: 'MANDI Mitra (मित्र)', phone: '9876543216', email: 'mitra@mandi.org', name: 'Suresh MANDI Mitra', icon: '🌟' },
  { roleName: 'Admin (प्रबंधक)', phone: '9876543217', email: 'admin@mandi.org', name: 'Super Admin', icon: '🛡️' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mandi_user');
      return saved && saved !== 'undefined' && saved !== 'null' ? JSON.parse(saved) : null;
    } catch (e) {
      localStorage.removeItem('mandi_user');
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      const savedToken = localStorage.getItem('mandi_token');
      return savedToken && savedToken !== 'undefined' && savedToken !== 'null' ? savedToken : null;
    } catch (e) {
      localStorage.removeItem('mandi_token');
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('mandi_token', token);
      if (!user) {
        authApi.getProfile()
          .then((res) => {
            if (res.data) {
              setUser(res.data);
              localStorage.setItem('mandi_user', JSON.stringify(res.data));
            }
          })
          .catch(() => {
            logout();
          });
      }
    } else {
      localStorage.removeItem('mandi_token');
      localStorage.removeItem('mandi_user');
    }
  }, [token]);

  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ identifier, password });
      if (res.success && res.data) {
        setToken(res.data.token);
        const userData = {
          id: res.data.userId,
          fullName: res.data.fullName,
          phone: res.data.phone,
          email: res.data.email,
          roles: res.data.roles,
          preferredLanguage: res.data.preferredLanguage
        };
        setUser(userData);
        localStorage.setItem('mandi_user', JSON.stringify(userData));
        return res.data;
      }
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoUser = async (phone) => {
    return login(phone, 'Password@123');
  };

  const register = async (registerData) => {
    setLoading(true);
    try {
      const res = await authApi.register(registerData);
      if (res.success && res.data) {
        setToken(res.data.token);
        const userData = {
          id: res.data.userId,
          fullName: res.data.fullName,
          phone: res.data.phone,
          email: res.data.email,
          roles: res.data.roles,
          preferredLanguage: res.data.preferredLanguage
        };
        setUser(userData);
        localStorage.setItem('mandi_user', JSON.stringify(userData));
        return res.data;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('mandi_token');
    localStorage.removeItem('mandi_user');
  };

  const isFarmer = user?.roles?.some(r => r.includes('FARMER'));
  const isVolunteer = user?.roles?.some(r => r.includes('VOLUNTEER'));
  const isWorker = user?.roles?.some(r => r.includes('WORKER'));
  const isProvider = user?.roles?.some(r => r.includes('SERVICE_PROVIDER'));
  const isMitra = user?.roles?.some(r => r.includes('MANDI_MITRA'));
  const isAdmin = user?.roles?.some(r => r.includes('ADMIN'));

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginAsDemoUser,
        register,
        logout,
        isFarmer,
        isVolunteer,
        isWorker,
        isProvider,
        isMitra,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
