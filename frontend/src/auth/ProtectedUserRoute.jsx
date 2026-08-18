import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserAuth } from './UserAuthContext';

export default function ProtectedUserRoute({ children }) {
  const { user } = useUserAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={`/user/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}
