import React, { useEffect, useState } from 'react';
import { userPulseApi } from '../../../shared/api/userApi';
import { useLanguage } from '../../../context/LanguageContext';
import {
  Activity,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  Sprout,
  HeartHandshake,
  Loader2
} from 'lucide-react';

export default function UserMandiPulse() {
  const { lang } = useLanguage();
  const [pulse, setPulse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userPulseApi.getOverview()
      .then((res) => {
        if (res.data) setPulse(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-pine-600 space-y-3">
        <div className="flex items-center space-x-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>{lang === 'hi' ? 'सामुदायिक प्रभाव व प्रगति' : 'Community Impact & Pulse'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {lang === 'hi' ? '📈 मंडी पल्स (MANDI Pulse)' : '📈 MANDI Community Pulse'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl font-medium">
          {lang === 'hi'
            ? 'पारदर्शी जन-आँकड़े: कितनी समस्याओं का समाधान हुआ, कितने किसान भाइयों को उपज का सही दाम मिला और कितने लोगों की मदद हुई।'
            : 'Live, open data tracking problem resolution velocity and grassroots impact across India.'}
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-pine-600" />
          <p className="text-xs text-stone-500">Loading community metrics...</p>
        </div>
      ) : pulse ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-stone-500 uppercase">Total Problems Registered</span>
            <div className="text-3xl font-black text-stone-900">{pulse.totalProblemsSubmitted || 0}</div>
            <div className="text-xs text-emerald-700 font-bold flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{pulse.resolutionRatePercentage || 0}% Resolved Successfully</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-stone-500 uppercase">Active In-Progress</span>
            <div className="text-3xl font-black text-pine-800">{pulse.activeProblemsCount || 0}</div>
            <div className="text-xs text-stone-500">Live multi-step coordination</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-stone-500 uppercase">Registered Volunteers</span>
            <div className="text-3xl font-black text-rose-700">{pulse.activeVolunteersCount || 0}</div>
            <div className="text-xs text-stone-500">Ready for seva tasks</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-stone-500 uppercase">Citizens Impacted</span>
            <div className="text-3xl font-black text-emerald-800">{pulse.peopleImpactedCount || 0}</div>
            <div className="text-xs text-emerald-600 font-bold">Verified outcomes</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
