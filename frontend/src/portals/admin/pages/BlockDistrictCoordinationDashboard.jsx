import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  Layers,
  MapPin,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Truck,
  Tractor,
  Wheat,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BarChart3
} from 'lucide-react';

export default function BlockDistrictCoordinationDashboard() {
  const { lang } = useLanguage();
  const [district, setDistrict] = useState('Lucknow');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoordinationData();
  }, [district]);

  const fetchCoordinationData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/coordination/district?district=${district}`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data?.data || null);
      }
    } catch (err) {
      console.warn('Failed to load coordination data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-stone-900 via-pine-950 to-emerald-950 rounded-3xl border-2 border-emerald-500/40 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-black tracking-tight text-emerald-100">
              {lang === 'hi' ? '🏛️ ब्लॉक व जिला स्तरीय संसाधन समन्वय एवं मांग-आपूर्ति विश्लेषण' : '🏛️ Block & District Regional Coordination Hub'}
            </h1>
          </div>
          <p className="text-xs text-stone-300 mt-1">
            {lang === 'hi'
              ? 'ग्राम-स्तरीय मांग व आपूर्ति अंतराल, ट्रैक्टर व परिवहन की कमी, तथा उच्च मांग वाले मार्गों का विश्लेषण।'
              : 'Village-level demand-supply gap intelligence, machinery shortages, high-demand cargo routes, and escalations.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="coord-district-select" className="text-xs font-bold text-stone-300">
            District:
          </label>
          <select
            id="coord-district-select"
            name="coordDistrict"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="p-2 bg-stone-900 border border-emerald-500/40 rounded-xl text-xs font-bold text-white focus:outline-none"
          >
            <option value="Lucknow">Lucknow (लखनऊ)</option>
            <option value="Mohali">Mohali / SAS Nagar (मोहाली)</option>
            <option value="Gaya">Gaya (गया)</option>
            <option value="Patna">Patna (पटना)</option>
            <option value="Jaipur">Jaipur (जयपुर)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-stone-400 space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
          <p className="text-xs font-semibold">Calculating district demand-supply analytics...</p>
        </div>
      ) : !analytics ? (
        <div className="p-8 text-center text-stone-500 text-xs">No analytics available for {district}</div>
      ) : (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400">Total Grievances</span>
              <p className="text-2xl font-black text-stone-900">{analytics.totalProblems}</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-600">Active Crop Listings</span>
              <p className="text-2xl font-black text-emerald-700 font-mono">{analytics.availableCropsCount}</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-blue-600">Transport Fleet</span>
              <p className="text-2xl font-black text-blue-700 font-mono">
                {analytics.transportSupply} <span className="text-xs font-normal text-stone-400">carriers</span>
              </p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-red-600">Transport Gap</span>
              <p className="text-2xl font-black text-red-700 font-mono">
                {analytics.transportGap} <span className="text-xs font-normal text-stone-400">deficit</span>
              </p>
            </div>
          </div>

          {/* High Demand Routes */}
          <div className="p-6 bg-white rounded-3xl border-2 border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-black text-stone-900 text-sm">
                {lang === 'hi' ? '🚚 उच्च मांग वाले कृषि परिवहन मार्ग (High-Demand Cargo Routes)' : 'High-Demand Cargo Transport Routes'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analytics.highDemandRoutes?.map((route, idx) => (
                <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-stone-900 text-xs">
                      {route.origin} → {route.destination}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      {route.demandJobs} trips needed
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600">
                    Cargo: <strong>{route.cargoSummary}</strong> • Recommended: <strong>{route.recommendedVehicle}</strong>
                  </p>

                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px]">
                    <span className="text-stone-500">Active Carriers: <strong>{route.activeCarriers}</strong></span>
                    {route.combinedRouteFeasible && (
                      <span className="text-emerald-700 font-bold">✓ Combined Trip Feasible</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Gap Intelligence Clusters */}
          <div className="p-6 bg-white rounded-3xl border-2 border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <h3 className="font-black text-stone-900 text-sm">
                {lang === 'hi' ? '📊 क्षेत्रीय संसाधन अंतराल क्लस्टर (Resource Shortage Clusters)' : 'Resource Shortage & Deficit Clusters'}
              </h3>
            </div>

            <div className="space-y-3">
              {analytics.gapClusters?.map((c, idx) => (
                <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-black text-[10px] rounded uppercase">
                        {c.resourceType}
                      </span>
                      <h4 className="font-black text-stone-900 text-sm">{c.description}</h4>
                    </div>
                    <p className="text-stone-500 mt-1">
                      Demand: <strong>{c.demandCount} requests</strong> • Active Local Supply: <strong>{c.supplyCount} units</strong>
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-base font-black text-red-700 font-mono">-{c.shortage} Shortage</span>
                      <span className="text-[10px] text-stone-400 block">{c.fulfillmentPercentage}% Fulfilled</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
