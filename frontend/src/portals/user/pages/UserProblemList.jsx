import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { userProblemApi } from '../../../shared/api/userApi';
import { useLanguage } from '../../../context/LanguageContext';
import ProblemPassportCard from '../../../components/ProblemPassportCard';
import {
  Search,
  Filter,
  PlusCircle,
  Clock,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

export default function UserProblemList() {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const category = searchParams.get('category') || '';
  const status = searchParams.get('status') || '';
  const search = searchParams.get('q') || '';

  const fetchProblems = async (page = 0) => {
    setLoading(true);
    try {
      const res = await userProblemApi.search({
        category: category || undefined,
        status: status || undefined,
        search: search || undefined,
        page,
        size: 10,
        sortBy: 'createdAt',
        direction: 'desc'
      });
      if (res.data) {
        setProblems(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setCurrentPage(res.data.page || 0);
      }
    } catch {
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems(0);
  }, [category, status, search]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Post CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            {lang === 'hi' ? 'समस्या समाधान मंच' : 'Problem Passport Feed'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {lang === 'hi'
              ? 'ग्रामीण भारत की समस्याएं, वास्तविक समय समाधान मार्ग व प्रगति स्थिति'
              : 'Real-time community problem passports and multi-step resolution paths'}
          </p>
        </div>

        <Link
          to="/user/problems/create"
          className="bg-pine-700 hover:bg-pine-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow transition flex items-center space-x-2 border border-emerald-400 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{lang === 'hi' ? 'नई समस्या दर्ज करें' : 'Post Problem'}</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border-2 border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <select
            value={category}
            onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), category: e.target.value })}
            className="p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
          >
            <option value="">All Categories (सभी श्रेणियां)</option>
            <option value="AGRICULTURE">🌾 Agriculture & Crops</option>
            <option value="HEALTHCARE">🏥 Healthcare & Medical</option>
            <option value="EMPLOYMENT">🛠️ Jobs & Daily Wage</option>
            <option value="WATER_SANITATION">🚰 Water & Sanitation</option>
            <option value="INFRASTRUCTURE">🛣️ Roads & Infrastructure</option>
            <option value="EDUCATION">🎓 Education & Students</option>
          </select>

          <select
            value={status}
            onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), status: e.target.value })}
            className="p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
          >
            <option value="">All Statuses (सभी स्थितियां)</option>
            <option value="SUBMITTED">Submitted (दर्ज)</option>
            <option value="IN_PROGRESS">In Progress (प्रगति पर)</option>
            <option value="RESOLVED">Resolved (हल हो गई)</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), q: e.target.value })}
            placeholder="Search problems..."
            className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="py-20 text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-pine-600 mx-auto" />
          <p className="text-xs text-stone-500">Loading problems...</p>
        </div>
      ) : problems.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border-2 border-stone-200 p-8 space-y-3">
          <HelpCircle className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No problems found</h3>
          <p className="text-xs text-stone-500">Try changing your search filters or submit a new problem.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {problems.map((p) => (
            <Link
              key={p.id}
              to={`/user/problems/${p.id}`}
              className="block bg-white p-5 rounded-3xl border-2 border-stone-200 hover:border-pine-500 hover:shadow-md transition space-y-2"
            >
              <div className="flex justify-between items-start text-xs">
                <span className="font-mono font-black text-pine-800 bg-pine-50 px-2.5 py-1 rounded-lg border border-pine-200">
                  {p.passportCode || `MDI-2026-${p.id}`}
                </span>
                <span className="font-bold uppercase text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                  {p.status}
                </span>
              </div>
              <h3 className="text-base font-black text-stone-900">{p.title}</h3>
              <p className="text-xs text-stone-600 line-clamp-2">"{p.rawDescription}"</p>
              <div className="text-[11px] text-stone-400 pt-2 border-t flex items-center justify-between">
                <span>📍 {p.villageOrTown || p.district || 'Lucknow'}</span>
                <span>{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
