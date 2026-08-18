import React, { useEffect, useState } from 'react';
import { userSolutionApi } from '../../../shared/api/userApi';
import { useLanguage } from '../../../context/LanguageContext';
import { useUserAuth } from '../../../auth/UserAuthContext';
import {
  HeartHandshake,
  CheckCircle,
  MapPin,
  Clock,
  Shield,
  Loader2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function UserVolunteerSeva() {
  const { lang, t } = useLanguage();
  const { user } = useUserAuth();

  const [claimableTasks, setClaimableTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await userSolutionApi.getClaimableTasks();
      if (res.data) setClaimableTasks(res.data);
    } catch {
      setClaimableTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleClaim = async (stepId) => {
    if (!user) {
      alert('Please login to claim community tasks.');
      return;
    }
    setClaimingId(stepId);
    try {
      await userSolutionApi.claimStep(stepId, {});
      alert(lang === 'hi' ? 'आपने यह सेवा कार्य सफलतापूर्वक स्वीकार कर लिया है!' : 'Task claimed successfully!');
      fetchTasks();
    } catch (err) {
      alert(err.message || 'Failed to claim task');
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-pine-950 to-stone-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-rose-600/40 space-y-3">
        <div className="flex items-center space-x-2 text-rose-400 font-black text-xs uppercase tracking-wider">
          <HeartHandshake className="w-4 h-4" />
          <span>{lang === 'hi' ? 'निःशुल्क जन-सेवा एवं वालंटियर समन्वय' : 'Community Volunteer Network'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {lang === 'hi' ? '🤝 मंडी सेवा डेस्क (MANDI Seva)' : '🤝 MANDI Volunteer Seva'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl font-medium">
          {lang === 'hi'
            ? 'गाँव के बुजुर्गों, बीमारों और जरूरतमंदों की अस्पताल मदद, कागजी सहायता एवं सामाजिक सेवा कार्यों में अपना योगदान दें।'
            : 'Contribute to community problem resolution, emergency hospital transport, and verified civic tasks.'}
        </p>
      </div>

      {/* Task Feed */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-stone-900">
          {lang === 'hi' ? 'खुले सेवा कार्य (Open Community Tasks)' : 'Claimable Seva Tasks'}
        </h2>

        {loading ? (
          <div className="py-20 text-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-600" />
            <p className="text-xs text-stone-500">Finding open volunteer tasks...</p>
          </div>
        ) : claimableTasks.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border-2 border-stone-200 p-8 space-y-2">
            <HeartHandshake className="w-12 h-12 text-stone-400 mx-auto" />
            <h3 className="text-base font-bold text-stone-800">No open tasks right now</h3>
            <p className="text-xs text-stone-500">All current community tasks have been claimed. Check back shortly!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {claimableTasks.map((t) => (
              <div key={t.id} className="bg-white rounded-3xl p-6 shadow-md border-2 border-stone-200 hover:border-rose-400 transition flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="bg-rose-100 text-rose-900 font-bold text-xs px-2.5 py-1 rounded-lg">
                      {t.stepType || 'VOLUNTEER_SEVA'}
                    </span>
                    <span className="text-[10px] font-black uppercase text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      Open For Seva
                    </span>
                  </div>

                  <h3 className="text-base font-black text-stone-900">{t.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{t.description}</p>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-xs text-stone-500 font-semibold">📍 Local Area</span>
                  <button
                    onClick={() => handleClaim(t.id)}
                    disabled={claimingId === t.id}
                    className="bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition"
                  >
                    {claimingId === t.id ? 'Claiming...' : (lang === 'hi' ? 'सेवा स्वीकार करें (Claim)' : 'Claim Seva Task')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
