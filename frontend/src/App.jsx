import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import UserLayout from './portals/user/layouts/UserLayout';
import AdminLayout from './portals/admin/layouts/AdminLayout';

// Route Guards
import ProtectedUserRoute from './auth/ProtectedUserRoute';
import ProtectedAdminRoute from './auth/ProtectedAdminRoute';

// User Portal Pages
import UserHome from './portals/user/pages/UserHome';
import UserLogin from './portals/user/pages/UserLogin';
import UserRegister from './portals/user/pages/UserRegister';
import UserDashboard from './portals/user/pages/UserDashboard';
import UserProblemSubmit from './portals/user/pages/UserProblemSubmit';
import UserProblemList from './portals/user/pages/UserProblemList';
import UserProblemDetail from './portals/user/pages/UserProblemDetail';
import UserAgricultureHub from './portals/user/pages/UserAgricultureHub';
import UserSchemeDiscovery from './portals/user/pages/UserSchemeDiscovery';
import UserCivicReporting from './portals/user/pages/UserCivicReporting';
import UserMapExplorer from './portals/user/pages/UserMapExplorer';
import UserMandiPulse from './portals/user/pages/UserMandiPulse';
import UserProfile from './portals/user/pages/UserProfile';
import UserBookings from './portals/user/pages/UserBookings';
import UserProviderHub from './portals/user/pages/UserProviderHub';
import UserMitraHub from './portals/user/pages/UserMitraHub';
import UserUnauthorized from './portals/user/pages/UserUnauthorized';
import UserNotFound from './portals/user/pages/UserNotFound';

// Mandi Sewa e-Governance Pages
import MandiPricesPage from './portals/user/pages/MandiPricesPage';
import MarketDirectoryPage from './portals/user/pages/MarketDirectoryPage';
import AuctionsPage from './portals/user/pages/AuctionsPage';
import GovernmentSchemesPage from './portals/user/pages/GovernmentSchemesPage';
import NoticesBoardPage from './portals/user/pages/NoticesBoardPage';
import GrievancePortalPage from './portals/user/pages/GrievancePortalPage';
import ReportsPage from './portals/user/pages/ReportsPage';
import TraderDashboard from './portals/user/pages/TraderDashboard';

// Admin Portal Pages
import AdminLogin from './portals/admin/pages/AdminLogin';
import AdminDashboard from './portals/admin/pages/AdminDashboard';
import AdminUserManagement from './portals/admin/pages/AdminUserManagement';
import AdminProblemManagement from './portals/admin/pages/AdminProblemManagement';
import AdminResourceVerification from './portals/admin/pages/AdminResourceVerification';
import AdminNgoManagement from './portals/admin/pages/AdminNgoManagement';
import AdminAgricultureManagement from './portals/admin/pages/AdminAgricultureManagement';
import AdminSchemeManagement from './portals/admin/pages/AdminSchemeManagement';
import AdminReportsManagement from './portals/admin/pages/AdminReportsManagement';
import AdminModeration from './portals/admin/pages/AdminModeration';
import AdminAnalytics from './portals/admin/pages/AdminAnalytics';
import AdminAuditLogs from './portals/admin/pages/AdminAuditLogs';
import AdminSettings from './portals/admin/pages/AdminSettings';
import BlockDistrictCoordinationDashboard from './portals/admin/pages/BlockDistrictCoordinationDashboard';
import AdminUnauthorized from './portals/admin/pages/AdminUnauthorized';
import AdminNotFound from './portals/admin/pages/AdminNotFound';

import { useUserAuth } from './auth/UserAuthContext';

function AppRootRedirect() {
  const { user } = useUserAuth();

  if (!user) {
    return <Navigate to="/user/login" replace />;
  }

  const rawRoles = user?.roles ? (Array.isArray(user.roles) ? user.roles : [user.roles]) : ['ROLE_CITIZEN'];
  const roles = rawRoles.map((r) => {
    if (typeof r === 'string') return r;
    return r?.role || r?.name || r?.authority || String(r);
  });

  if (roles.some((r) => typeof r === 'string' && (r.includes('ADMIN') || r.includes('SUPER_ADMIN')))) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (roles.some((r) => typeof r === 'string' && r.includes('FARMER'))) {
    return <Navigate to="/user/agriculture" replace />;
  }
  return <Navigate to="/user/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* ========================================================================= */}
      {/* 1. ROOT & USER PORTAL ROUTES (Strict Namespace: /user/* & Root /)         */}
      {/* ========================================================================= */}
      {/* Root Entry Point: Public e-Governance Home & Dedicated Pages */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<UserHome />} />
        <Route path="mandi-prices" element={<MandiPricesPage />} />
        <Route path="market-directory" element={<MarketDirectoryPage />} />
        <Route path="auctions" element={<AuctionsPage />} />
        <Route path="gov-schemes" element={<GovernmentSchemesPage />} />
        <Route path="notices" element={<NoticesBoardPage />} />
        <Route path="grievance" element={<GrievancePortalPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route
          path="trader-dashboard"
          element={
            <ProtectedUserRoute>
              <TraderDashboard />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="farmer-dashboard"
          element={
            <ProtectedUserRoute>
              <Navigate to="/user/agriculture" replace />
            </ProtectedUserRoute>
          }
        />
      </Route>
      <Route path="/home" element={<Navigate to="/" replace />} />

      <Route path="/user" element={<UserLayout />}>
        <Route index element={<AppRootRedirect />} />
        <Route path="login" element={<UserLogin />} />
        <Route path="register" element={<UserRegister />} />
        <Route path="home" element={<UserHome />} />
        <Route
          path="dashboard"
          element={
            <ProtectedUserRoute>
              <UserDashboard />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="problems"
          element={
            <ProtectedUserRoute>
              <UserProblemList />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="problems/create"
          element={
            <ProtectedUserRoute>
              <UserProblemSubmit />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="problems/:id"
          element={
            <ProtectedUserRoute>
              <UserProblemDetail />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="agriculture"
          element={
            <ProtectedUserRoute>
              <UserAgricultureHub />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="schemes"
          element={
            <ProtectedUserRoute>
              <UserSchemeDiscovery />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="civic"
          element={
            <ProtectedUserRoute>
              <UserCivicReporting />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="map"
          element={
            <ProtectedUserRoute>
              <UserMapExplorer />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="pulse"
          element={
            <ProtectedUserRoute>
              <UserMandiPulse />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedUserRoute>
              <UserProfile />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="bookings"
          element={
            <ProtectedUserRoute>
              <UserBookings />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="provider-hub"
          element={
            <ProtectedUserRoute>
              <UserProviderHub />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="village-mitra"
          element={
            <ProtectedUserRoute>
              <UserMitraHub />
            </ProtectedUserRoute>
          }
        />
        <Route path="403" element={<UserUnauthorized />} />
        <Route path="404" element={<UserNotFound />} />
        <Route path="*" element={<UserNotFound />} />
      </Route>

      {/* Legacy Shortcuts Redirecting Directly into User Portal */}
      <Route path="/submit" element={<Navigate to="/user/problems/create" replace />} />
      <Route path="/problems" element={<Navigate to="/user/problems" replace />} />
      <Route path="/problems/:id" element={<Navigate to="/user/problems/:id" replace />} />
      <Route path="/agriculture" element={<Navigate to="/user/agriculture" replace />} />
      <Route path="/village-mitra" element={<Navigate to="/user/village-mitra" replace />} />
      <Route path="/schemes" element={<Navigate to="/user/schemes" replace />} />
      <Route path="/civic" element={<Navigate to="/user/civic" replace />} />
      <Route path="/map" element={<Navigate to="/user/map" replace />} />
      <Route path="/pulse" element={<Navigate to="/user/pulse" replace />} />
      <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
      <Route path="/login" element={<Navigate to="/user/login" replace />} />
      <Route path="/register" element={<Navigate to="/user/register" replace />} />
      <Route path="/profile" element={<Navigate to="/user/profile" replace />} />

      {/* ========================================================================= */}
      {/* 2. ADMIN PORTAL ROUTES (Strict Namespace: /admin/*)                       */}
      {/* ========================================================================= */}
      {/* Public Admin Login with Security Passkey Verification */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/403" element={<AdminUnauthorized />} />
      <Route path="/admin/404" element={<AdminNotFound />} />

      {/* Protected Admin Operations Center */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUserManagement />} />
        <Route path="problems" element={<AdminProblemManagement />} />
        <Route path="resources" element={<AdminResourceVerification />} />
        <Route path="ngos" element={<AdminNgoManagement />} />
        <Route path="agriculture" element={<AdminAgricultureManagement />} />
        <Route path="schemes" element={<AdminSchemeManagement />} />
        <Route path="reports" element={<AdminReportsManagement />} />
        <Route path="moderation" element={<AdminModeration />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="regional-coordination" element={<BlockDistrictCoordinationDashboard />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<AdminNotFound />} />
      </Route>

      {/* Global Fallback */}
      <Route path="*" element={<Navigate to="/user/404" replace />} />
    </Routes>
  );
}
