import React, { useEffect, useState } from 'react';
import { userSchemeApi } from '../../../shared/api/userApi';
import { useLanguage } from '../../../context/LanguageContext';
import {
  FileSpreadsheet,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Loader2,
  Users,
  Building
} from 'lucide-react';

export default function UserSchemeDiscovery() {
  const { lang, t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await userSchemeApi.search({ search: search || undefined, category: category || undefined });
      const list = res.data?.content || (Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []));
      setSchemes(list);
    } catch (err) {
      console.warn('Failed to fetch schemes:', err);
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [category]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-pine-950 to-stone-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-blue-600/40 space-y-3">
        <div className="flex items-center space-x-2 text-blue-300 font-black text-xs uppercase tracking-wider">
          <FileSpreadsheet className="w-4 h-4" />
          <span>{lang === 'hi' ? 'कल्याणकारी सरकारी योजनाएं' : 'Government Welfare Schemes'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {lang === 'hi' ? '🏛️ सरकारी योजना साथी' : '🏛️ Welfare Scheme Discovery'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl font-medium">
          {lang === 'hi'
            ? 'पीएम किसान, आवास योजना, फसल बीमा व कृषि सब्सिडी की सटीक जानकारी व आवेदन मार्गदर्शन।'
            : 'Explore eligibility, required documents and direct application links for central and state schemes.'}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border-2 border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories (सभी योजनाएं)</option>
            <option value="AGRICULTURE">🌾 Kisan & Agriculture</option>
            <option value="HOUSING">🏠 Awas & Housing</option>
            <option value="SOCIAL_SECURITY">👴 Pension & Welfare</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchSchemes()}
            placeholder={lang === 'hi' ? 'योजना खोजें (जैसे: PM-Kisan)...' : 'Search scheme name...'}
            className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-xs text-stone-500 font-medium">{lang === 'hi' ? 'सरकारी योजनाएं लोड हो रही हैं...' : 'Loading government schemes...'}</p>
        </div>
      ) : schemes.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border-2 border-stone-200 p-8 space-y-2">
          <FileSpreadsheet className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">{lang === 'hi' ? 'कोई योजना नहीं मिली' : 'No schemes found'}</h3>
          <p className="text-xs text-stone-500">{lang === 'hi' ? 'कृपया अन्य श्रेणी या खोज शब्द चुनें।' : 'Try adjusting your keyword filter.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((s) => (
            <div key={s.id} className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl border-2 border-stone-200 hover:border-blue-500 transition flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="bg-blue-100 text-blue-900 font-black text-[10px] px-2.5 py-1 rounded-lg">
                    {s.category || 'WELFARE'}
                  </span>
                  {s.lastVerifiedDate && (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified {s.lastVerifiedDate}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-black text-stone-900 leading-snug">{s.name}</h3>
                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 font-medium">{s.description}</p>

                {s.benefits && (
                  <div className="p-3 bg-emerald-50/90 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-bold leading-relaxed">
                    💰 <span className="font-black">{lang === 'hi' ? 'लाभ (Benefits):' : 'Benefits:'}</span> {s.benefits}
                  </div>
                )}

                {s.eligibilityCriteria && (
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-1">
                    <span className="font-bold text-stone-900 block">{lang === 'hi' ? 'पात्रता (Eligibility):' : 'Eligibility:'}</span>
                    <p className="text-[11px] text-stone-600 leading-relaxed">{s.eligibilityCriteria}</p>
                  </div>
                )}

                {s.requiredDocuments && (
                  <div className="text-[11px] text-stone-600 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                    <span className="font-bold text-blue-950">📋 {lang === 'hi' ? 'ज़रूरी दस्तावेज:' : 'Documents:'} </span>
                    <span>{s.requiredDocuments}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-500 font-medium truncate max-w-[140px]">
                  {s.applicationMethod || 'Online / CSC'}
                </span>
                {(s.officialSourceUrl || s.applicationUrl) && (
                  <a
                    href={s.officialSourceUrl || s.applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-3.5 py-1.5 rounded-xl shadow text-xs flex items-center space-x-1 transition"
                  >
                    <span>{lang === 'hi' ? 'पोर्टल देखें' : 'Official Portal'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
