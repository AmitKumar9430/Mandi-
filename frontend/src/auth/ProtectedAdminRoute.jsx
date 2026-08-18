import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

export default function ProtectedAdminRoute({ children }) {
  const { adminUser, isAdmin, isSuperAdmin, isModerator } = useAdminAuth();
  const location = useLocation();

  if (!adminUser || (!isAdmin && !isSuperAdmin && !isModerator)) {
    return <Navigate to={`/admin/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}
