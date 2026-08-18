import React, { useEffect, useState, useMemo } from 'react';
import { userProblemApi } from '../../../shared/api/userApi';
import { useLanguage } from '../../../context/LanguageContext';
import MandiMapView, { DISTRICT_BLOCKS_DATA } from '../../../components/MandiMapView';
import {
  MapPin,
  Loader2,
  Layers,
  Filter,
  Compass,
  Building2,
  Tractor,
  Ambulance,
  Phone,
  ArrowRight,
  Sparkles,
  Navigation
} from 'lucide-react';

// Haversine distance calculator in KM
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

export default function UserMapExplorer() {
  const { lang } = useLanguage();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({ latitude: 26.8467, longitude: 80.9462, isLiveGPS: false });
  const [selectedBlock, setSelectedBlock] = useState(DISTRICT_BLOCKS_DATA[0]);

  useEffect(() => {
    userProblemApi.getMapProblems()
      .then((res) => {
        const list = res.data?.content || (Array.isArray(res.data) ? res.data : []);
        setProblems(list);
      })
      .catch(() => setProblems([]))
      .finally(() => setLoading(false));
  }, []);

  // Sort district blocks by proximity to user location
  const sortedBlocks = useMemo(() => {
    return [...DISTRICT_BLOCKS_DATA].map((block) => {
      const dist = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        block.latitude,
        block.longitude
      );
      return { ...block, distanceKm: dist };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [userLocation]);

  const handleLocationUpdate = (coords) => {
    setUserLocation({
      latitude: coords.latitude,
      longitude: coords.longitude,
      isLiveGPS: true
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pine-950 via-stone-900 to-pine-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-pine-600/40 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
            <span>{lang === 'hi' ? 'वास्तविक समय भू-नक्शा' : 'Live Geographic Map & Block Radar'}</span>
          </div>
          {userLocation.isLiveGPS && (
            <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-400/40 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>GPS Live: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white">
          {lang === 'hi' ? '🗺️ ग्रामीण समस्या, ब्लॉक व संसाधन नक्शा' : '🗺️ Live Issue, Block & Resource Map'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl font-medium leading-relaxed">
          {lang === 'hi'
            ? 'नज़दीकी ब्लॉक, सरकारी सहायता केंद्र, ट्रैक्टर किराए की स्थिति और गाँव की समस्याओं का लाइव अवलोकन करें।'
            : 'Explore nearby district blocks, verified citizen issues, farm machinery pools and emergency health posts in real-time.'}
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-800 text-xs">
          <div className="bg-stone-900/80 p-2.5 rounded-xl border border-stone-700">
            <span className="text-[10px] text-stone-400 font-bold block">Connected Blocks</span>
            <strong className="text-emerald-400 text-sm font-black">{DISTRICT_BLOCKS_DATA.length} Blocks</strong>
          </div>
          <div className="bg-stone-900/80 p-2.5 rounded-xl border border-stone-700">
            <span className="text-[10px] text-stone-400 font-bold block">Nearest Block</span>
            <strong className="text-amber-400 text-sm font-black truncate block">
              {sortedBlocks[0]?.name.split(' ')[0]} ({sortedBlocks[0]?.distanceKm} km)
            </strong>
          </div>
          <div className="bg-stone-900/80 p-2.5 rounded-xl border border-stone-700">
            <span className="text-[10px] text-stone-400 font-bold block">Active Grievances</span>
            <strong className="text-rose-400 text-sm font-black">{problems.length || 8} Issues</strong>
          </div>
          <div className="bg-stone-900/80 p-2.5 rounded-xl border border-stone-700">
            <span className="text-[10px] text-stone-400 font-bold block">Emergency Aid</span>
            <strong className="text-sky-400 text-sm font-black">24/7 Helpline: 108 / 1800</strong>
          </div>
        </div>
      </div>

      {/* Nearest District Blocks Selector Ribbon */}
      <div className="bg-white p-4 rounded-3xl border-2 border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs sm:text-sm font-black text-stone-900">
              {lang === 'hi' ? '📍 आपके नज़दीकी ज़िला ब्लॉक (Nearest District Blocks):' : '📍 Nearest Located District Blocks:'}
            </h2>
          </div>
          <span className="text-[11px] text-stone-500 font-medium hidden sm:block">
            {userLocation.isLiveGPS ? 'Sorted by live GPS distance' : 'Click any block to focus map'}
          </span>
        </div>

        {/* Scrollable Block Chips */}
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {sortedBlocks.map((block, idx) => {
            const isSelected = selectedBlock?.id === block.id;
            return (
              <button
                key={block.id}
                onClick={() => setSelectedBlock(block)}
                className={`flex-shrink-0 flex items-center space-x-2 px-3.5 py-2 rounded-2xl border transition-all text-xs font-bold ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg scale-105'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                }`}
              >
                {idx === 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
                <span>🏛️ {block.name.split(' ')[0]}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-lg ${
                    isSelected ? 'bg-indigo-800 text-indigo-200' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {block.distanceKm} km
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Block Spotlight Card */}
      {selectedBlock && (
        <div className="bg-gradient-to-r from-indigo-50/80 via-white to-emerald-50/60 p-4 sm:p-5 rounded-3xl border-2 border-indigo-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-lg uppercase">
                {selectedBlock.district} District
              </span>
              <span className="font-bold text-stone-500">Distance: {selectedBlock.distanceKm || 0} km away</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-stone-900">{selectedBlock.name}</h3>
            <p className="text-stone-600 text-xs max-w-xl font-medium">{selectedBlock.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-white px-3 py-2 rounded-xl border border-stone-200 shadow-xs text-center">
              <span className="text-[10px] text-stone-500 block font-bold">🌾 Crops Listed</span>
              <strong className="text-stone-900 font-black">{selectedBlock.cropsForSale} Lots</strong>
            </div>
            <div className="bg-white px-3 py-2 rounded-xl border border-stone-200 shadow-xs text-center">
              <span className="text-[10px] text-stone-500 block font-bold">🚜 Tractors Pool</span>
              <strong className="text-stone-900 font-black">{selectedBlock.tractorsAvailable} Units</strong>
            </div>
            <div className="bg-white px-3 py-2 rounded-xl border border-stone-200 shadow-xs text-center">
              <span className="text-[10px] text-rose-600 block font-bold">⚠️ Open Issues</span>
              <strong className="text-rose-700 font-black">{selectedBlock.activeProblems}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Main Map Container */}
      <div className="bg-white rounded-3xl p-3 sm:p-5 shadow-xl border-2 border-stone-200">
        {loading ? (
          <div className="h-[520px] flex items-center justify-center space-x-2 text-pine-700">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs sm:text-sm font-bold">Loading Live GPS map nodes...</span>
          </div>
        ) : (
          <MandiMapView
            problems={problems}
            selectedTarget={selectedBlock}
            onLocationUpdate={handleLocationUpdate}
            height="580px"
          />
        )}
      </div>
    </div>
  );
}
