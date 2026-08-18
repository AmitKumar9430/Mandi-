import React, { useEffect, useState } from 'react';
import { solutionApi } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  HeartHandshake,
  CheckCircle,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Award,
  Loader2
} from 'lucide-react';

export default function VolunteerSeva() {
  const { lang } = useLanguage();
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await solutionApi.getClaimableTasks();
      if (res?.data) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Failed to load volunteer tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleClaim = async (stepId) => {
    if (!user) {
      alert('Please login as a Volunteer / Citizen to accept tasks.');
      return;
    }
    setClaimingId(stepId);
    try {
      await solutionApi.claimStep(stepId);
      alert('Task claimed successfully! Check your Dashboard.');
      fetchTasks();
    } catch (err) {
      alert(err.message || 'Failed to claim task');
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-800/40 space-y-3">
        <div className="flex items-center space-x-2 text-mandi-400 font-bold text-xs uppercase tracking-wider">
          <HeartHandshake className="w-4 h-4" />
          <span>MANDI SEVA NETWORK</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {lang === 'hi' ? 'मंडी सेवा — जन सहायता वालंटियर डेस्क' : 'MANDI Seva — Volunteer Action Desk'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
          {lang === 'hi'
            ? 'गाँव एवं आस-पास के बुजुर्गों, मरीजों व छात्रों की सहायता के लिए तैयार कार्य। एक कार्य स्वीकार करें और समुदाय का जीवन आसान बनाएं।'
            : 'Immediate community assistance tasks: patient hospital escorts, paperwork assistance, and civic audits.'}
        </p>
      </div>

      {/* Available Tasks Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800">
            {lang === 'hi' ? 'स्वीकार करने हेतु उपलब्ध कार्य (Open Seva Tasks)' : 'Available Help Tasks Ready for Execution'}
          </h2>
          <span className="text-xs text-stone-500 font-semibold">{tasks.length} Tasks Active</span>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
            <p className="text-xs text-stone-500">Loading open seva tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
            <CheckCircle className="w-10 h-10 text-krishi-500 mx-auto" />
            <h3 className="text-base font-bold text-stone-800">
              {lang === 'hi' ? 'सभी कार्य वर्तमान में आवंटित हैं!' : 'All pending tasks are currently claimed!'}
            </h3>
            <p className="text-xs text-stone-500">Check back soon for new community assistance requests.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-stone-200 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                      {task.requiredResourceType || 'Volunteer Aid'}
                    </span>
                    <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                      Step {task.stepSequence}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900">{task.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{task.description}</p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 font-medium">Ready for Dispatch</span>
                  <button
                    onClick={() => handleClaim(task.id)}
                    disabled={claimingId === task.id}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow transition"
                  >
                    {claimingId === task.id ? 'Claiming...' : (lang === 'hi' ? 'यह कार्य स्वीकार करें' : 'Accept Seva Task')}
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
