import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Wheat,
  Search,
  Filter,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Clock,
  Loader2,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import CropPurchaseModal from './CropPurchaseModal';

export default function CropMarketplace({ user, onSelectCropForTransport }) {
  const { lang } = useLanguage();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('ALL');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // Match / Filter parameters
  const [matchedResults, setMatchedResults] = useState([]);
  const [isMatching, setIsMatching] = useState(false);
  const [matchQuantity, setMatchQuantity] = useState('');
  const [matchBudget, setMatchBudget] = useState('');

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/crops?size=50');
      if (res.ok) {
        const data = await res.json();
        const list = data?.data?.content || data?.data || (Array.isArray(data) ? data : []);
        setCrops(list);
      }
    } catch (err) {
      console.warn('Failed to load crops:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunSmartMatch = async (e) => {
    e?.preventDefault();
    setIsMatching(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('cropName', searchQuery);
      if (matchQuantity) params.append('quantity', matchQuantity);
      if (matchBudget) params.append('budget', matchBudget);
      if (selectedQuality !== 'ALL') params.append('quality', selectedQuality);
      if (user?.profile?.district) params.append('district', user.profile.district);
      if (user?.profile?.latitude) params.append('latitude', user.profile.latitude);
      if (user?.profile?.longitude) params.append('longitude', user.profile.longitude);

      const res = await fetch(`/api/crop-orders/best-matches?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMatchedResults(data?.data || []);
      }
    } catch (err) {
      console.warn('Matching error:', err);
    } finally {
      setIsMatching(false);
    }
  };

  const handleBuyClick = (cropItem) => {
    setSelectedCrop(cropItem);
    setShowPurchaseModal(true);
  };

  const displayedList = matchedResults.length > 0
    ? matchedResults.map(m => ({ ...m.crop, _matchScore: m.matchScore, _distanceKm: m.distanceKm, _reasons: m.matchReasons }))
    : crops.filter(c => {
        const matchesSearch = !searchQuery ||
          c.cropName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.variety?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.district?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesQuality = selectedQuality === 'ALL' || c.qualityGrade === selectedQuality;
        return matchesSearch && matchesQuality;
      });

  return (
    <div className="space-y-6">
      {/* Header & Smart Buyer Match Bar */}
      <div className="p-6 bg-gradient-to-r from-emerald-950 via-pine-950 to-stone-900 rounded-3xl border-2 border-emerald-500/40 text-white shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Wheat className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-black tracking-tight text-emerald-100">
                {lang === 'hi' ? '🌾 किसान फसल मंडी (Direct Crop Marketplace)' : '🌾 Direct Farmer Crop Marketplace'}
              </h2>
            </div>
            <p className="text-xs text-stone-300 mt-1">
              {lang === 'hi'
                ? 'सीधे किसानों से असली फसलें, गेहूं, धान, दालें व तिलहन खरीदें। 0% बिचौलिया कमीशन।'
                : 'Direct farm-gate produce purchase from accredited local farmers with zero commission.'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full text-xs font-bold">
              ✓ Direct Farm Connect
            </span>
            <span className="px-3 py-1 bg-pine-500/20 text-pine-300 border border-pine-400/40 rounded-full text-xs font-bold">
              🚚 Integrated Transport
            </span>
          </div>
        </div>

        {/* 6-Factor Smart Match Search Form */}
        <form onSubmit={handleRunSmartMatch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              id="crop-search-input"
              name="cropSearch"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'फसल का नाम (उदा. Wheat, Basmati, Sarson)...' : 'Crop name (e.g. Wheat, Basmati)...'}
              className="w-full pl-9 pr-3 py-2.5 bg-stone-900/90 border border-emerald-500/40 rounded-xl text-xs text-white placeholder-stone-400 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
          </div>

          <div>
            <input
              type="number"
              id="crop-quantity-input"
              name="cropQuantity"
              value={matchQuantity}
              onChange={(e) => setMatchQuantity(e.target.value)}
              placeholder={lang === 'hi' ? 'मात्रा (क्विंटल में)' : 'Quantity (Quintals)'}
              className="w-full px-3 py-2.5 bg-stone-900/90 border border-emerald-500/40 rounded-xl text-xs text-white placeholder-stone-400 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
          </div>

          <div>
            <input
              type="number"
              id="crop-budget-input"
              name="cropBudget"
              value={matchBudget}
              onChange={(e) => setMatchBudget(e.target.value)}
              placeholder={lang === 'hi' ? 'बजट (₹/क्विंटल)' : 'Max Budget (₹/qtl)'}
              className="w-full px-3 py-2.5 bg-stone-900/90 border border-emerald-500/40 rounded-xl text-xs text-white placeholder-stone-400 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isMatching}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition active:scale-98 disabled:opacity-50"
          >
            {isMatching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{lang === 'hi' ? 'स्मार्ट मैच खोजें' : 'Smart Match'}</span>
          </button>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase text-stone-500 tracking-wider">
            {displayedList.length} {lang === 'hi' ? 'फसलें उपलब्ध' : 'Crop Listings Available'}
          </span>
          {matchedResults.length > 0 && (
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
              🎯 Ranked by 6-Factor Compatibility
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <select
            id="crop-quality-filter"
            name="cropQualityFilter"
            value={selectedQuality}
            onChange={(e) => setSelectedQuality(e.target.value)}
            className="text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Grades (सभी ग्रेड)</option>
            <option value="Organic">Organic (जैविक)</option>
            <option value="Grade A">Grade A (उत्तम)</option>
            <option value="Grade B">Grade B (मानक)</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="py-16 text-center text-stone-400 space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
          <p className="text-xs font-semibold">Loading live crop listings...</p>
        </div>
      ) : displayedList.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-sm space-y-3">
          <Wheat className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-800 text-base">No matching crops found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search keywords, budget, or clearing quality filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedList.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl border-2 border-stone-200/80 hover:border-emerald-500 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden flex flex-col justify-between group"
            >
              <div className="p-5 space-y-4">
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-black rounded-full uppercase tracking-wider border border-emerald-200">
                      {c.qualityGrade || 'Standard'}
                    </span>
                    <h3 className="font-black text-stone-900 text-base mt-1 group-hover:text-emerald-700 transition">
                      {c.cropName}
                    </h3>
                    {c.variety && (
                      <p className="text-xs text-stone-500 font-medium">
                        Variety: <span className="font-bold text-stone-700">{c.variety}</span>
                      </p>
                    )}
                  </div>

                  {c._matchScore ? (
                    <div className="text-right">
                      <span className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-black rounded-xl shadow-sm">
                        {Math.round(c._matchScore)}% MATCH
                      </span>
                      {c._distanceKm && (
                        <p className="text-[10px] text-emerald-700 font-bold mt-0.5">{c._distanceKm} km away</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="text-lg font-black text-emerald-700 font-mono">
                        ₹{c.expectedPricePerQuintal}
                      </span>
                      <span className="text-[10px] text-stone-400 block font-medium">/ quintal</span>
                    </div>
                  )}
                </div>

                {/* Match Reasons if available */}
                {c._reasons && c._reasons.length > 0 && (
                  <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 space-y-1">
                    {c._reasons.slice(0, 2).map((r, i) => (
                      <div key={i} className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span className="font-medium truncate">{r}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-2xl border border-stone-100">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Available Stock</span>
                    <span className="font-black text-stone-800 font-mono text-sm">
                      {c.quantityQuintals} <span className="text-xs font-normal">qtl</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Rate</span>
                    <span className="font-black text-stone-800 font-mono text-sm">
                      ₹{c.expectedPricePerQuintal}
                    </span>
                  </div>
                </div>

                {/* Location & Farmer Info */}
                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span className="truncate font-medium">
                      {c.villageOrTown ? c.villageOrTown + ', ' : ''}{c.district}, {c.state}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate font-medium">
                      Farmer: <strong className="text-stone-800">{c.farmerName || 'Verified Producer'}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBuyClick(c)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition active:scale-98"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'खरीदें (Buy Crop)' : 'Buy Produce'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && selectedCrop && (
        <CropPurchaseModal
          crop={selectedCrop}
          user={user}
          onClose={() => setShowPurchaseModal(false)}
          onSuccess={(order) => {
            setShowPurchaseModal(false);
            if (onSelectCropForTransport) {
              onSelectCropForTransport(order);
            }
          }}
        />
      )}
    </div>
  );
}
