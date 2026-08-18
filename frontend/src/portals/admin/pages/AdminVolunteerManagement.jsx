import React, { useEffect, useState } from 'react';
import { adminOpsApi } from '../../../shared/api/adminApi';
import { HeartHandshake, Users, ShieldCheck, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export default function AdminVolunteerManagement() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminOpsApi.getUsers().then((res) => {
      if (res.data) {
        setVolunteers(res.data.filter(u => u.roles?.some(r => r.includes('VOLUNTEER') || r.includes('MITRA'))));
      }
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-800 pb-4">
        <h1 className="text-2xl font-black text-white">Volunteer & MANDI Mitra Network</h1>
        <p className="text-xs text-stone-400">
          Track grassroots problem resolution facilitators, emergency volunteers and village coordinators.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500" />
          <p className="text-xs text-stone-500">Loading volunteer network...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {volunteers.map((v) => (
            <div key={v.id} className="bg-stone-950 p-5 rounded-3xl border border-stone-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-white text-base">{v.fullName || 'Volunteer'}</h3>
                  <span className="text-xs text-stone-400 font-mono">{v.phone}</span>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  {v.roles?.join(', ')}
                </span>
              </div>

              <div className="p-3 bg-stone-900 rounded-2xl text-xs space-y-1">
                <div className="flex justify-between text-stone-400">
                  <span>Location:</span>
                  <span className="text-white font-bold">{v.villageOrTown || v.district || 'Lucknow'}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-bold">{v.verified ? '✓ Verified Seva Worker' : 'Active'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
