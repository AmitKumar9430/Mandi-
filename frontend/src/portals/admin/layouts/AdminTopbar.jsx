import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../auth/AdminAuthContext';
import NotificationBell from '../../../components/NotificationBell';
import {
  Menu,
  Shield,
  LogOut,
  Bell,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Crown
} from 'lucide-react';

export default function AdminTopbar({ setSidebarOpen }) {
  const { adminUser, isSuperAdmin, logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 bg-stone-900 border-b-2 border-pine-700/50 px-4 sm:px-6 flex items-center justify-between shadow-xl">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-stone-400 hover:text-white rounded-xl lg:hidden hover:bg-stone-800"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-2">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
            ADMIN OPERATIONS
          </span>
          <span className="hidden sm:inline text-xs text-stone-300 font-medium">
            मंडी केन्द्रीय संचालन व समाधान नियंत्रण कक्ष
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <NotificationBell portalType="ADMIN" />

        <a
          href="/user/dashboard"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-pine-700 hover:from-emerald-700 hover:to-pine-800 text-white px-3.5 py-2 rounded-xl text-xs font-black border border-emerald-400/50 transition shadow-md"
          title="Open Citizen User Portal in new tab"
        >
          <span>🌾 Citizen Desk</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="text-right hidden sm:block">
          <div className="text-xs font-black text-white flex items-center space-x-1 justify-end">
            {isSuperAdmin && <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
            <span className="truncate max-w-[150px]">{adminUser?.fullName || 'Super Administrator'}</span>
          </div>
          <div className="flex items-center space-x-1 justify-end mt-0.5">
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
              isSuperAdmin
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              {isSuperAdmin ? 'SUPER_ADMIN' : (adminUser?.roles?.[0]?.replace('ROLE_', '') || 'ADMIN')}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            logoutAdmin();
            navigate('/admin/login');
          }}
          className="flex items-center space-x-1.5 bg-stone-800 hover:bg-red-950/80 text-stone-300 hover:text-red-300 px-3 py-2 rounded-xl text-xs font-bold border border-stone-700 transition"
          title="Sign out of Admin Operations"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit</span>
        </button>
      </div>
    </header>
  );
}
