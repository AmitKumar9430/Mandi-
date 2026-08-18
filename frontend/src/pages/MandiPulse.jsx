import React, { useEffect, useState } from 'react';
import { pulseApi } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import {
  Activity,
  CheckCircle2,
  TrendingUp,
  Users,
  Clock,
  Award,
  ShieldCheck,
  FileText,
  Loader2
} from 'lucide-react';

export default function MandiPulse() {
  const { lang } = useLanguage();
  const [pulse, setPulse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pulseApi.getOverview()
      .then((res) => {
        if (res?.data) setPulse(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-2">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-mandi-500" />
        <p className="text-xs text-stone-500">Loading MANDI Pulse analytics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-mandi-600 font-bold text-xs uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>{lang === 'hi' ? 'पारदर्शी प्रभाव एवं सामुदायिक मेट्रिक्स' : 'Transparent Impact & Metrics'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
          {lang === 'hi' ? 'मंडी पल्स (MANDI Pulse & Impact Ledger)' : 'MANDI Pulse & Impact Ledger'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          {lang === 'hi'
            ? 'सार्वजनिक समाधान दर, समय-सीमा, श्रेणी वितरण और सत्यापित समाधान खाता (Impact Ledger)'
            : 'Aggregated community trends, resolution rates, resolution speed & verified outcomes'}
        </p>
      </div>

      {/* Top 4 Metrics Cards */}
      {pulse && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-2 text-center">
            <span className="text-xs text-stone-500 font-bold uppercase">Total Problems</span>
            <div className="text-3xl sm:text-4xl font-black text-stone-900">{pulse.totalProblems}</div>
            <span className="text-[11px] text-stone-400">All categories</span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-2 text-center">
            <span className="text-xs text-krishi-600 font-bold uppercase">Resolution Rate</span>
            <div className="text-3xl sm:text-4xl font-black text-krishi-600">{pulse.resolutionRatePercentage}%</div>
            <span className="text-[11px] text-krishi-700 font-semibold">{pulse.resolvedProblems} Resolved Cases</span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-2 text-center">
            <span className="text-xs text-seva-600 font-bold uppercase">People Helped</span>
            <div className="text-3xl sm:text-4xl font-black text-seva-600">{pulse.totalPeopleImpacted}+</div>
            <span className="text-[11px] text-stone-400">Citizens & Families</span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-2 text-center">
            <span className="text-xs text-mandi-600 font-bold uppercase">Avg Speed</span>
            <div className="text-3xl sm:text-4xl font-black text-mandi-600">{pulse.averageResolutionTimeHours}h</div>
            <span className="text-[11px] text-stone-400">From submission to fix</span>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {pulse?.categoryDistribution && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4">
          <h3 className="text-base font-bold text-stone-900">
            {lang === 'hi' ? 'समस्याओं का श्रेणीवार वितरण (Category Distribution)' : 'Category Breakdown'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(pulse.categoryDistribution).map(([cat, count]) => (
              <div key={cat} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[11px] font-semibold text-stone-500 block truncate">{cat}</span>
                <span className="text-xl font-bold text-stone-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verified Impact Ledger */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-stone-900">
            {lang === 'hi' ? 'सत्यापित समाधान लेजर (Impact Ledger)' : 'Verified Community Impact Ledger'}
          </h3>
        </div>

        <div className="space-y-3">
          {pulse?.recentImpactLedger?.length > 0 ? (
            pulse.recentImpactLedger.map((item) => (
              <div key={item.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-mandi-700 bg-mandi-100 px-2 py-0.5 rounded">
                      {item.passportCode}
                    </span>
                    <span className="font-bold text-stone-900">{item.title}</span>
                  </div>
                  <p className="text-stone-600">{item.outcomeSummary}</p>
                </div>

                <div className="flex items-center space-x-4 text-stone-500 font-medium flex-shrink-0">
                  <span>{item.peopleBenefited} Benefited</span>
                  <span>•</span>
                  <span>{item.district || 'Lucknow'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-stone-500">
              Resolved problem cases will generate transparent audit records here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
