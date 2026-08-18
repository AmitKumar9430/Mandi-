import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAdminAuth } from '../../../auth/AdminAuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Boxes,
  Building2,
  HeartHandshake,
  Sprout,
  FileSpreadsheet,
  AlertOctagon,
  ShieldAlert,
  BarChart3,
  ScrollText,
  Settings,
  Shield,
  X,
  Crown,
  Layers
} from 'lucide-react';

const ADMIN_NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
  { to: '/admin/users', label: 'User Directory & Roles', icon: Users },
  { to: '/admin/problems', label: 'Problems & Passports', icon: FileText },
  { to: '/admin/resources', label: 'Resource Verification', icon: Boxes },
  { to: '/admin/ngos', label: 'NGOs & Organizations', icon: Building2 },
  { to: '/admin/agriculture', label: 'Agriculture & Crops', icon: Sprout },
  { to: '/admin/schemes', label: 'Scheme Management', icon: FileSpreadsheet },
  { to: '/admin/reports', label: 'Civic Grievances', icon: AlertOctagon },
  { to: '/admin/regional-coordination', label: 'Regional Coordination & Gap', icon: Layers },
  { to: '/admin/moderation', label: 'Content Moderation', icon: ShieldAlert },
  { to: '/admin/analytics', label: 'System Analytics', icon: BarChart3 },
  { to: '/admin/audit-logs', label: 'Immutable Audit Logs', icon: ScrollText },
  { to: '/admin/settings', label: 'System Settings', icon: Settings },
];

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const { adminUser, isSuperAdmin } = useAdminAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-stone-900 text-stone-200 border-r-2 border-pine-700/50 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 shadow-xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Top */}
        <div>
          <div className="h-16 sm:h-20 flex items-center justify-between px-5 border-b-2 border-pine-700/40 bg-gradient-to-r from-stone-950 via-pine-950 to-stone-950">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-pine-600 to-pine-800 text-white flex items-center justify-center font-black text-xl shadow-lg border-2 border-emerald-400">
                म
              </div>
              <div>
                <span className="font-black text-white text-lg tracking-tight block leading-none">
                  मंडी <span className="text-emerald-400 font-mono text-sm">OPS</span>
                </span>
                <span className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold">
                  Admin Command
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-stone-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-thin">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-pine-700 text-white font-black shadow-lg border border-emerald-400/50'
                        : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logged-In Admin Role Pill */}
        <div className="p-4 border-t-2 border-pine-700/40 bg-stone-950 text-[11px] text-stone-400 space-y-2.5">
          {/* Admin Role Identity Tag */}
          <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              {isSuperAdmin ? (
                <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              ) : (
                <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              )}
              <span className="font-bold text-white text-xs truncate max-w-[110px]">
                {adminUser?.fullName || 'Super Admin'}
              </span>
            </div>
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
              isSuperAdmin
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {isSuperAdmin ? 'SUPER' : 'ADMIN'}
            </span>
          </div>

          <a
            href="/user/dashboard"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center space-x-1.5 w-full py-2 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 rounded-xl font-bold border border-emerald-500/60 transition text-xs shadow-md"
          >
            <span>🌾 Switch to Citizen Portal ↗</span>
          </a>

          <div className="flex items-center justify-between text-stone-400 text-[10px]">
            <div className="flex items-center space-x-1 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Root Ops Active</span>
            </div>
            <span className="font-mono text-stone-500">v2.4.0 ManDi</span>
          </div>
        </div>
      </aside>
    </>
  );
}
