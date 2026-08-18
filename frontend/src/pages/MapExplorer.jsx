import React, { useEffect, useState } from 'react';
import MandiMapView from '../components/MandiMapView';
import { problemApi, resourceApi } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Layers, Filter, Loader2, Sparkles } from 'lucide-react';

export default function MapExplorer() {
  const { lang } = useLanguage();
  const [problems, setProblems] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL'); // ALL, PROBLEMS, RESOURCES

  useEffect(() => {
    Promise.all([
      problemApi.getMapProblems().catch(() => ({ data: [] })),
      resourceApi.getMapResources().catch(() => ({ data: [] }))
    ]).then(([probRes, resRes]) => {
      if (probRes?.data) setProblems(probRes.data);
      if (resRes?.data) setResources(resRes.data);
      setLoading(false);
    });
  }, []);

  const visibleProblems = filterType === 'RESOURCES' ? [] : problems;
  const visibleResources = filterType === 'PROBLEMS' ? [] : resources;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Layer Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-mandi-600 font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>{lang === 'hi' ? 'भौगोलिक संसाधन एवं समस्या नक्शा' : 'Geographic Community Map'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            {lang === 'hi' ? 'मंडी मानचित्र एक्सप्लोरर (Map Explorer)' : 'MANDI Map Explorer'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {lang === 'hi'
              ? 'आस-पास के उपलब्ध ट्रैक्टर, अस्पताल वाहन, वालंटियर और सक्रिय समस्या पासपोर्ट'
              : 'Interactive map of nearby verified resources, tractors, volunteer hubs, and active problems'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 bg-stone-200 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg transition ${filterType === 'ALL' ? 'bg-white text-stone-950 shadow' : 'text-stone-600'}`}
          >
            🗺️ All Layers ({problems.length + resources.length})
          </button>
          <button
            onClick={() => setFilterType('PROBLEMS')}
            className={`px-3 py-1.5 rounded-lg transition ${filterType === 'PROBLEMS' ? 'bg-rose-600 text-white shadow' : 'text-stone-600'}`}
          >
            🔴 Problems ({problems.length})
          </button>
          <button
            onClick={() => setFilterType('RESOURCES')}
            className={`px-3 py-1.5 rounded-lg transition ${filterType === 'RESOURCES' ? 'bg-emerald-600 text-white shadow' : 'text-stone-600'}`}
          >
            🟢 Resources ({resources.length})
          </button>
        </div>
      </div>

      {/* Map View */}
      {loading ? (
        <div className="h-[600px] bg-stone-100 rounded-2xl flex items-center justify-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-mandi-500" />
        </div>
      ) : (
        <MandiMapView
          problems={visibleProblems}
          resources={visibleResources}
          height="620px"
        />
      )}
    </div>
  );
}
