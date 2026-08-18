import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../../auth/AdminAuthContext';
import { adminOpsApi } from '../../../shared/api/adminApi';
import {
  LayoutDashboard,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Users,
  FileText,
  Boxes,
  Building2,
  HeartHandshake,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  MapPin,
  Flame,
  Clock,
  Crown,
  Lock,
  Sparkles,
  ShieldAlert,
  UserPlus
} from 'lucide-react';

export default function AdminDashboard() {
  const { adminUser, isSuperAdmin } = useAdminAuth();
  const [analytics, setAnalytics] = useState(null);
  const [demandSupply, setDemandSupply] = useState(null);
  const [recentProblems, setRecentProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [anRes, probRes, dsRes] = await Promise.all([
        adminOpsApi.getAnalytics().catch(() => ({ data: null })),
        adminOpsApi.getProblems({ page: 0, size: 6 }).catch(() => ({ data: { content: [] } })),
        fetch('/api/demand-supply/summary').then((r) => r.json()).catch(() => ({ data: null }))
      ]);
      if (anRes?.data) setAnalytics(anRes.data);
      if (probRes?.data?.content) setRecentProblems(probRes.data.content);
      if (dsRes?.data) setDemandSupply(dsRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Logged-In Admin Role Showcase */}
      <div className="bg-gradient-to-r from-stone-950 via-pine-950 to-stone-950 rounded-3xl p-6 sm:p-8 border-2 border-pine-700/50 shadow-xl text-white space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className={`text-[11px] font-black px-3 py-1 rounded-xl shadow border flex items-center space-x-1.5 ${
                isSuperAdmin
                  ? 'bg-amber-400 text-stone-950 border-amber-300'
                  : 'bg-emerald-500 text-stone-950 border-emerald-300'
              }`}>
                {isSuperAdmin ? <Crown className="w-3.5 h-3.5 text-stone-950" /> : <Shield className="w-3.5 h-3.5 text-stone-950" />}
                <span>{isSuperAdmin ? '👑 ROOT SUPER ADMINISTRATOR' : '🛡️ SYSTEM ADMINISTRATOR'}</span>
              </span>

              <span className="text-xs text-emerald-300 font-mono font-bold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>System Health: 100% Operational</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
              मंडी केन्द्रीय संचालन व समाधान नियंत्रण कक्ष
            </h1>
            <p className="text-xs text-stone-300 mt-1">
              Welcome back, <strong className="text-white text-sm">{adminUser?.fullName || 'Administrator'}</strong> ({adminUser?.email || adminUser?.phone})
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {isSuperAdmin ? (
              <Link
                to="/admin/users"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 text-xs font-black px-4 py-2.5 rounded-xl border border-amber-300 flex items-center space-x-1.5 transition shadow-lg"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Provision Admin</span>
              </Link>
            ) : (
              <Link
                to="/admin/users"
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-stone-700 flex items-center space-x-1.5 transition"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>User Directory</span>
              </Link>
            )}

            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="bg-pine-800 hover:bg-pine-700 text-emerald-200 text-xs font-black px-4 py-2.5 rounded-xl border border-emerald-400/40 flex items-center space-x-2 transition shadow-lg"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Operations</span>
            </button>
          </div>
        </div>

        {/* Admin Role Privileges & Policy Strip */}
        <div className="p-4 rounded-2xl bg-stone-900/80 border border-pine-600/40 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Active Roles:</span>
              <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                {adminUser?.roles?.map((r, idx) => (
                  <span
                    key={idx}
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg border ${
                      r.includes('SUPER_ADMIN')
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {r.replace('ROLE_', '')}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-stone-300">
              {isSuperAdmin
                ? '✨ Full Administrative Control: You have exclusive authority to add/manage administrators, modify roles, and oversee all system records.'
                : '🛡️ Operational Control: You can triage problems, verify crops/resources, and manage civic reports. (Note: Only SUPER_ADMIN can add more administrators).'}
            </p>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <Link
              to="/admin/users"
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center space-x-1"
            >
              <span>Manage Administrators & Citizens</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Operational Metrics Grid */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white p-5 rounded-3xl border-2 border-stone-200 shadow-sm space-y-1">
            <span className="text-[10px] font-black uppercase text-stone-500 block">Total Raised</span>
            <div className="text-2xl font-black text-stone-900">{analytics.totalProblems}</div>
            <div className="text-[10px] text-stone-500 font-semibold">Master Ledger</div>
          </div>

          <div className="bg-emerald-50 p-5 rounded-3xl border-2 border-emerald-200 shadow-sm space-y-1">
            <span className="text-[10px] font-black uppercase text-emerald-800 block">Solved</span>
            <div className="text-2xl font-black text-emerald-900">{analytics.solvedProblems}</div>
            <div className="text-[10px] text-emerald-700 font-bold">{analytics.resolutionRate}% Success</div>
          </div>

          <div className="bg-pine-50 p-5 rounded-3xl border-2 border-pine-200 shadow-sm space-y-1">
            <span className="text-[10px] font-black uppercase text-pine-800 block">Active Solutions</span>
            <div className="text-2xl font-black text-pine-900">{analytics.inProgressProblems}</div>
            <div className="text-[10px] text-pine-700 font-semibold">In Progress</div>
          </div>

          <div className="bg-blue-50 p-5 rounded-3xl border-2 border-blue-200 shadow-sm space-y-1">
            <span className="text-[10px] font-black uppercase text-blue-800 block">Registered Users</span>
            <div className="text-2xl font-black text-blue-900">{analytics.totalUsers}</div>
            <div className="text-[10px] text-blue-700 font-semibold">{analytics.verifiedUsers} Verified</div>
          </div>

          <div className="bg-teal-50 p-5 rounded-3xl border-2 border-teal-200 shadow-sm space-y-1">
            <span className="text-[10px] font-black uppercase text-teal-800 block">Crops Listed</span>
            <div className="text-2xl font-black text-teal-900">{analytics.totalCrops}</div>
            <div className="text-[10px] text-teal-700 font-semibold">Agri Market</div>
          </div>

          <div className="bg-amber-50 p-5 rounded-3xl border-2 border-amber-200 shadow-sm space-y-1">
            <span className="text-[10px] font-black uppercase text-amber-800 block">Civic Reports</span>
            <div className="text-2xl font-black text-amber-900">{analytics.totalReports || 0}</div>
            <div className="text-[10px] text-amber-700 font-semibold">Village Grievance</div>
          </div>
        </div>
      )}

      {/* 3. Geographic Performance Matrix */}
      {analytics?.cityBreakdown && Object.keys(analytics.cityBreakdown).length > 0 && (
        <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-pine-700" />
              <h2 className="text-base font-black text-stone-900">City & District Resolution Velocity</h2>
            </div>
            <Link to="/admin/analytics" className="text-xs font-bold text-pine-700 hover:underline">
              Full Analytics →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(analytics.cityBreakdown).map(([city, stats]) => (
              <div key={city} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-stone-900 text-sm">{city}</h4>
                    <span className="text-[10px] text-stone-500 font-medium">{stats.state}</span>
                  </div>
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {stats.resolutionRate}%
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-[11px] text-stone-600 font-semibold">
                  <span>Total: {stats.totalProblems}</span>
                  <span className="text-emerald-700">Solved: {stats.solvedProblems}</span>
                  <span className="text-amber-700">Active: {stats.activeProblems}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3.5 Regional Demand-Supply Gap Matrix */}
      {demandSupply?.topShortages && demandSupply.topShortages.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <Boxes className="w-5 h-5 text-pine-700" />
              <h2 className="text-base font-black text-stone-900">Regional Demand-Supply Gap & Critical Shortages</h2>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {demandSupply.totalCriticalShortages} Unmet Demands Across Districts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {demandSupply.topShortages.map((item, idx) => (
              <div key={idx} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-stone-900 text-sm">{item.serviceCategory}</h4>
                    <span className="text-[10px] text-stone-500 font-medium">District: {item.district}</span>
                  </div>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                    -{item.gap} Shortage
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-[11px] text-stone-600 font-semibold">
                  <span>Demands: <strong className="text-stone-900">{item.demandCount}</strong></span>
                  <span>Supplies: <strong className="text-emerald-700">{item.supplyCount}</strong></span>
                  <span>Fulfillment: <strong className="text-pine-700">{item.fulfillmentRate}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Live Problem Queue */}
      <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-pine-700" />
            <h2 className="text-base font-black text-stone-900">Critical & Recent Problem Passports</h2>
          </div>
          <Link to="/admin/problems" className="text-xs font-bold text-pine-700 hover:underline">
            Manage All ({analytics?.totalProblems || 0}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentProblems.map((p) => (
            <div key={p.id} className="bg-stone-50 hover:bg-pine-50/40 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs transition">
              <div className="flex justify-between items-start">
                <span className="font-mono font-black text-pine-800">{p.passportCode || `MDI-2026-${p.id}`}</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                  {p.status}
                </span>
              </div>
              <h4 className="font-black text-stone-900 text-sm line-clamp-1">{p.title}</h4>
              <p className="text-stone-600 text-xs line-clamp-2">"{p.rawDescription}"</p>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-stone-500 text-[11px]">
                <span>📍 {p.villageOrTown || p.district || 'Lucknow'}</span>
                <span>{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
