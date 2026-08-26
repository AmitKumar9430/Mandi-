import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAdminAuth } from '../../../auth/AdminAuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Boxes,
  Building2,
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
  { to: '/admin/regional-coordination', label: 'Regional Coordination', icon: Layers },
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
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 bg-[#0A3663] text-white border-r border-[#072545] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 font-sans shadow-md ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Top */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#072545] bg-[#072545]">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-2xs bg-white text-[#0A3663] flex items-center justify-center font-black text-base shadow-xs">
                🏛️
              </div>
              <div>
                <span className="font-extrabold text-white text-sm tracking-tight block font-serif uppercase">
                  mandi.gov.in <span className="text-[#FF9933] text-xs font-mono">OPS</span>
                </span>
                <span className="text-[9px] text-slate-300 uppercase tracking-wider font-bold">
                  APMC Admin Desk
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-slate-300 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)] scrollbar-none">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-2.5 px-3 py-2 rounded-2xs text-xs font-bold transition ${
                      isActive
                        ? 'bg-[#DC2626] text-white font-extrabold shadow-2xs'
                        : 'text-slate-200 hover:bg-[#072545] hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0 text-amber-300" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-[#072545] bg-[#072545] text-[11px] text-slate-300 space-y-2">
          <div className="p-2 rounded-2xs bg-[#0A3663] border border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              {isSuperAdmin ? (
                <Crown className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
              ) : (
                <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              )}
              <span className="font-bold text-white text-xs truncate max-w-[100px]">
                {adminUser?.fullName || 'Super Admin'}
              </span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-2xs uppercase bg-[#DC2626] text-white">
              {isSuperAdmin ? 'SUPER' : 'OFFICER'}
            </span>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center space-x-1 w-full py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-2xs font-bold transition text-[11px]"
          >
            <span>🌾 Public Portal ↗</span>
          </a>
        </div>
      </aside>
    </>
  );
}

