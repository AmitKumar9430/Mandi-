import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { problemApi, solutionApi, agricultureApi, jobApi } from '../api/client';
import {
  User,
  FileText,
  Sprout,
  HeartHandshake,
  Briefcase,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  Loader2
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  const [myProblems, setMyProblems] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [myCrops, setMyCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      problemApi.getMyProblems({ page: 0, size: 10 }).catch(() => ({ data: { content: [] } })),
      solutionApi.getMyTasks().catch(() => ({ data: [] })),
      agricultureApi.getMyCrops().catch(() => ({ data: [] }))
    ]).then(([probRes, taskRes, cropRes]) => {
      if (probRes?.data?.content) setMyProblems(probRes.data.content);
      if (taskRes?.data) setMyTasks(taskRes.data);
      if (cropRes?.data) setMyCrops(cropRes.data);
      setLoading(false);
    });
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Please login to access your Dashboard</h2>
        <Link to="/login" className="bg-pine-700 text-white font-bold px-5 py-2.5 rounded-xl inline-block">
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-pine-700 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-emerald-400">
            {user.fullName ? user.fullName[0] : 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-stone-900">{user.fullName || user.phone}</h1>
              {user.verified && (
                <span className="text-emerald-800 bg-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>VERIFIED CITIZEN</span>
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-0.5">Phone: {user.phone} • Email: {user.email || 'N/A'}</p>
            <div className="flex items-center space-x-1.5 mt-2 flex-wrap gap-1">
              {user.roles?.map((r, i) => (
                <span key={i} className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                  {r.replace('ROLE_', '')}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto flex-wrap gap-y-2">
          {user?.roles?.includes('ROLE_ADMIN') && (
            <Link
              to="/admin"
              className="bg-stone-900 hover:bg-black text-amber-300 font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow transition flex items-center space-x-1.5 border border-amber-500/50"
            >
              <span>🛡️ Admin Panel</span>
            </Link>
          )}

          <Link
            to="/submit"
            className="bg-pine-700 hover:bg-pine-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow transition flex items-center space-x-2 border border-emerald-500"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'hi' ? 'नई समस्या दर्ज करें' : 'Post New Problem'}</span>
          </Link>
        </div>
      </div>

      {/* Grid: My Problems & My Assigned Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Problems Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-stone-200 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-pine-700" />
              <h2 className="text-lg font-bold text-stone-900">
                {lang === 'hi' ? 'मेरी समस्याएं (My Problems)' : 'My Problems & Passports'}
              </h2>
            </div>
            <span className="text-xs font-semibold text-stone-500">{myProblems.length} Active</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-stone-500 font-medium">Loading...</div>
          ) : myProblems.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-xs text-stone-500">You haven't submitted any problems yet.</p>
              <Link to="/submit" className="text-xs font-bold text-pine-700 hover:underline">
                + Report a problem
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myProblems.map((p) => (
                <Link
                  key={p.id}
                  to={`/problems/${p.id}`}
                  className="block p-4 rounded-2xl bg-stone-50 hover:bg-pine-50/50 border border-stone-200 transition space-y-1"
                >
                  <div className="flex justify-between text-xs">
                    <span className="font-mono font-black text-pine-800">{p.passportCode || `MDI-2026-${p.id}`}</span>
                    <span className="font-semibold text-stone-600 uppercase text-[10px]">{p.status}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">{p.title}</h4>
                  <p className="text-xs text-stone-500 line-clamp-1">"{p.rawDescription}"</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* My Assigned Tasks / Seva Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-stone-200 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <HeartHandshake className="w-5 h-5 text-pine-700" />
              <h2 className="text-lg font-bold text-stone-900">
                {lang === 'hi' ? 'मेरे ज़िम्मेदार कार्य (My Claimed Tasks)' : 'My Claimed Tasks & Seva'}
              </h2>
            </div>
            <span className="text-xs font-semibold text-stone-500">{myTasks.length} Active</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-stone-500 font-medium">Loading...</div>
          ) : myTasks.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-xs text-stone-500">You have no active task assignments.</p>
              <Link to="/volunteer" className="text-xs font-bold text-pine-700 hover:underline">
                Explore available Seva tasks
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myTasks.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-pine-50/60 border border-pine-200 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-bold text-pine-900">{t.title}</span>
                    <span className="font-bold text-emerald-800">{t.status}</span>
                  </div>
                  <p className="text-stone-600">{t.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
