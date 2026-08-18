import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { problemApi } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  ArrowRight,
  PlusCircle,
  FileText,
  AlertTriangle,
  Loader2
} from 'lucide-react';

const CATEGORIES = [
  { key: 'ALL', label: 'All (सभी)' },
  { key: 'AGRICULTURE', label: '🌾 Agriculture' },
  { key: 'HEALTHCARE', label: '🏥 Healthcare' },
  { key: 'EMPLOYMENT', label: '💼 Jobs' },
  { key: 'WATER_SANITATION', label: '💧 Water & Sanitation' },
  { key: 'ELECTRICITY', label: '⚡ Electricity' },
  { key: 'INFRASTRUCTURE', label: '🛣️ Roads' },
  { key: 'EDUCATION', label: '📚 Education' },
  { key: 'SOCIAL_WELFARE', label: '📋 Schemes' }
];

export default function ProblemList() {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        sortBy: 'createdAt',
        direction: 'desc'
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory !== 'ALL') params.category = selectedCategory;

      const res = await problemApi.search(params);
      if (res.success && res.data) {
        setProblems(res.data.content);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [selectedCategory, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchProblems();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Submit Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-pine-700 font-extrabold text-xs uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>{lang === 'hi' ? 'सामुदायिक समस्या फ़ीड' : 'Community Problem Feed'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 mt-1">
            {lang === 'hi' ? 'समस्या समाधान फ़ीड (Live Stream)' : 'Community Problem Resolution Stream'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {lang === 'hi'
              ? 'गाँव एवं नगर के नागरिकों द्वारा दर्ज की गई समस्याएं व उनकी समाधान प्रगति'
              : 'Real-world issues reported by citizens and their active resolution graphs'}
          </p>
        </div>

        <Link
          to="/submit"
          className="bg-pine-700 hover:bg-pine-800 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-lg transition flex items-center space-x-2 border border-emerald-500"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{lang === 'hi' ? 'नई समस्या दर्ज करें' : 'Post New Problem'}</span>
        </Link>
      </div>

      {/* Search Bar & Category Filter */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border-2 border-stone-200 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'hi' ? 'समस्या या स्थान खोजें (उदा. गेहूँ, हैंडपंप, मलिहाबाद)...' : 'Search by problem title, keyword, or village...'}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 text-xs sm:text-sm rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-pine-500 font-medium"
            />
          </div>
          <button
            type="submit"
            className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-2xl transition"
          >
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => { setSelectedCategory(cat.key); setPage(0); }}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-bold transition ${
                selectedCategory === cat.key
                  ? 'bg-pine-700 text-white shadow-md'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Cards Feed */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-pine-600" />
          <p className="text-xs text-stone-500 font-medium">Loading problem passports...</p>
        </div>
      ) : problems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-stone-200 space-y-3">
          <AlertTriangle className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">
            {lang === 'hi' ? 'कोई समस्या नहीं मिली' : 'No problems found'}
          </h3>
          <p className="text-xs text-stone-500">
            {lang === 'hi' ? 'अपने खोज शब्द बदलें या नई समस्या दर्ज करें।' : 'Try changing your search keywords or report a new problem.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {problems.map((p) => (
            <Link
              key={p.id}
              to={`/problems/${p.id}`}
              className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border-2 border-stone-200 hover:border-pine-500 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-mono font-black text-pine-800 bg-pine-50 px-2.5 py-1 rounded-lg border border-pine-200">
                    {p.passportCode || `MDI-2026-${p.id}`}
                  </span>
                  <span className="font-bold text-stone-600 uppercase">{p.category}</span>
                  <span>•</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    p.urgency === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    p.urgency === 'HIGH' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {p.urgency} Urgency
                  </span>
                </div>

                <h3 className="text-lg font-black text-stone-900 group-hover:text-pine-800 transition-colors">
                  {p.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed font-medium">
                  "{p.rawDescription}"
                </p>

                <div className="flex items-center space-x-4 text-xs text-stone-500 pt-1 font-semibold">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-pine-600" />
                    <span>{p.locationName || p.district || 'Lucknow'}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>

              {/* Status & View Arrow */}
              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0">
                <span className="text-xs font-bold bg-stone-100 text-stone-800 px-3 py-1 rounded-xl border border-stone-200">
                  {p.status}
                </span>
                <span className="text-xs sm:text-sm font-black text-pine-700 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Passport</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 pt-4">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-white border-2 border-stone-200 rounded-xl text-xs font-bold disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-stone-600 px-4 py-2 font-bold">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 bg-white border-2 border-stone-200 rounded-xl text-xs font-bold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
