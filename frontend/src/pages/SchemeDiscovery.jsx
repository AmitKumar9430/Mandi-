import React, { useEffect, useState } from 'react';
import { schemeApi } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText,
  Search,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function SchemeDiscovery() {
  const { lang } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('ALL');

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const params = { page: 0, size: 20 };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (category !== 'ALL') params.category = category;

      const res = await schemeApi.search(params);
      if (res?.data?.content) {
        setSchemes(res.data.content);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSchemes();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>{lang === 'hi' ? 'सत्यापित सरकारी कल्याणकारी योजनाएं' : 'Verified Welfare Schemes'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
          {lang === 'hi' ? 'सरकारी योजना खोज (Government Scheme Discovery)' : 'Government Scheme Discovery'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          {lang === 'hi'
            ? 'पात्रता, लाभ, आवश्यक दस्तावेज़ व आवेदन प्रक्रिया की सत्यापित जानकारी'
            : 'Authoritative eligibility criteria, benefits, required documents & application methods'}
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'hi' ? 'योजना का नाम या लाभ खोजें (उदा. पीएम किसान, आयुष्मान, आवास)...' : 'Search schemes by keyword or benefits...'}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            type="submit"
            className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-4 py-2 rounded-xl"
          >
            Search
          </button>
        </form>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {['ALL', 'AGRICULTURE', 'HEALTHCARE', 'HOUSING', 'EDUCATION'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                category === cat ? 'bg-amber-500 text-stone-950 font-bold shadow' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500" />
          <p className="text-xs text-stone-500">Loading government schemes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemes.map((scheme) => (
            <div key={scheme.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {scheme.category}
                  </span>
                  {scheme.isDemoData ? (
                    <span className="bg-rose-100 text-rose-800 font-bold text-[10px] px-2 py-0.5 rounded border border-rose-200">
                      [DEMO SAMPLE DATA]
                    </span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded flex items-center space-x-1 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" />
                      <span>VERIFIED OFFICIAL</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-stone-900 leading-snug">{scheme.name}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{scheme.description}</p>

                <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 text-xs text-stone-800 border border-stone-200">
                  <div>
                    <span className="font-bold text-stone-900">पात्रता (Eligibility): </span>
                    <span className="text-stone-700">{scheme.eligibilityCriteria}</span>
                  </div>
                  <div className="pt-1 border-t border-stone-200">
                    <span className="font-bold text-krishi-700">लाभ (Benefits): </span>
                    <span className="text-stone-700">{scheme.benefits}</span>
                  </div>
                  <div className="pt-1 border-t border-stone-200">
                    <span className="font-bold text-stone-900">दस्तावेज़ (Documents): </span>
                    <span className="text-stone-600">{scheme.requiredDocuments}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">{scheme.applicationMethod || 'Apply online/CSC'}</span>
                {scheme.officialSourceUrl && (
                  <a
                    href={scheme.officialSourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-mandi-700 font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
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
