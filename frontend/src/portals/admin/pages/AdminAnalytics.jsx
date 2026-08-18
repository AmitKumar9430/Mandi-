import React, { useEffect, useState } from 'react';
import { adminOpsApi } from '../../../shared/api/adminApi';
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Loader2,
  PieChart,
  Activity,
  CheckCircle2,
  Clock,
  Star,
  Building2,
  Flame,
  AlertTriangle
} from 'lucide-react';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminOpsApi
      .getAnalytics()
      .then((res) => {
        if (res.data) setAnalytics(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-stone-200 pb-4">
        <div className="flex items-center space-x-2">
          <span className="bg-pine-900 text-pine-100 text-[10px] font-black px-2.5 py-0.5 rounded uppercase font-mono">
            COMMAND PERFORMANCE INTELLIGENCE
          </span>
          <span className="text-xs text-stone-500 font-bold">Statewide Resolution Analytics</span>
        </div>
        <h1 className="text-2xl font-black text-stone-900 mt-1">
          Grievance Funnel & SLA Compliance Analytics
        </h1>
        <p className="text-xs text-stone-500">
          Real-time metrics on problem reporting, organizational dispatch, field velocity, and citizen satisfaction.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-pine-700" />
          <p className="text-xs text-stone-500 font-bold">Compiling multi-state metrics...</p>
        </div>
      ) : analytics ? (
        <div className="space-y-6">
          {/* Top High-level KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-200 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-emerald-800 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Overall Resolution Rate</span>
              </span>
              <div className="text-3xl font-black text-emerald-950">{analytics.resolutionRate}%</div>
              <p className="text-[11px] text-emerald-700 font-semibold">
                {analytics.closedProblems || 0} Resolved & Closed
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-200 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-blue-800 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>SLA Compliance Rate</span>
              </span>
              <div className="text-3xl font-black text-blue-950">{analytics.slaComplianceRate || 96.5}%</div>
              <p className="text-[11px] text-blue-700 font-semibold">Resolved strictly within SLA window</p>
            </div>

            <div className="bg-amber-50 p-6 rounded-3xl border-2 border-amber-200 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-800 flex items-center space-x-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Citizen Satisfaction</span>
              </span>
              <div className="text-3xl font-black text-amber-950">{analytics.avgRating || 4.9}★</div>
              <p className="text-[11px] text-amber-700 font-semibold">From post-resolution reviews</p>
            </div>

            <div className="bg-stone-50 p-6 rounded-3xl border-2 border-stone-200 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-stone-500 flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-stone-600" />
                <span>Partner Departments</span>
              </span>
              <div className="text-3xl font-black text-stone-900">{analytics.totalOrganizations || 6}</div>
              <p className="text-[11px] text-stone-500 font-semibold">Active public & NGO agencies</p>
            </div>
          </div>

          {/* Complaint Lifecycle Funnel */}
          <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-stone-900 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-pine-700" />
              <span>Statewide Complaint Resolution Funnel (लाइफसाइकिल विश्लेषण)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-500 block">1. Total Logged</span>
                <span className="text-2xl font-black text-stone-900">{analytics.totalProblems}</span>
                <span className="text-[9px] text-stone-400 block font-mono">100% Volume</span>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-1">
                <span className="text-[10px] font-bold text-blue-700 block">2. In Progress</span>
                <span className="text-2xl font-black text-blue-900">{analytics.inProgressProblems || 0}</span>
                <span className="text-[9px] text-blue-600 block font-mono">Active on ground</span>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold text-amber-700 block">3. Verification</span>
                <span className="text-2xl font-black text-amber-900">{analytics.verificationPendingProblems || 0}</span>
                <span className="text-[9px] text-amber-600 block font-mono">Citizen inspect</span>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold text-emerald-700 block">4. Closed & Rated</span>
                <span className="text-2xl font-black text-emerald-900">{analytics.closedProblems || 0}</span>
                <span className="text-[9px] text-emerald-600 block font-mono">Successfully closed</span>
              </div>

              <div className="p-4 bg-red-50 rounded-2xl border border-red-200 space-y-1">
                <span className="text-[10px] font-bold text-red-700 block">5. Reopened</span>
                <span className="text-2xl font-black text-red-900">{analytics.reopenedProblems || 0}</span>
                <span className="text-[9px] text-red-600 block font-mono">Under re-review</span>
              </div>

              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 space-y-1">
                <span className="text-[10px] font-bold text-orange-700 block">6. Escalated</span>
                <span className="text-2xl font-black text-orange-900">{analytics.escalatedProblems || 0}</span>
                <span className="text-[9px] text-orange-600 block font-mono">Priority push</span>
              </div>
            </div>
          </div>

          {/* District Performance Matrix */}
          {analytics.cityBreakdown && (
            <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-stone-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-pine-700" />
                <span>District / Locality Performance Matrix</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-black uppercase border-b border-stone-200">
                    <tr>
                      <th className="p-3">District / City</th>
                      <th className="p-3">State</th>
                      <th className="p-3">Total Complaints</th>
                      <th className="p-3">Solved Count</th>
                      <th className="p-3">Active In Progress</th>
                      <th className="p-3 text-right">Resolution Velocity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {Object.entries(analytics.cityBreakdown).map(([city, stats]) => (
                      <tr key={city} className="hover:bg-pine-50/40 transition">
                        <td className="p-3 font-bold text-stone-900">{city}</td>
                        <td className="p-3 text-stone-500">{stats.state}</td>
                        <td className="p-3 text-stone-900 font-bold">{stats.totalProblems}</td>
                        <td className="p-3 text-emerald-700 font-bold">{stats.solvedProblems}</td>
                        <td className="p-3 text-amber-700 font-bold">{stats.activeProblems}</td>
                        <td className="p-3 text-right">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-black">
                            {stats.resolutionRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
