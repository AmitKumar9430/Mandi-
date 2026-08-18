import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  UserCheck,
  MapPin,
  Phone,
  HelpCircle,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

export default function MandiVillageMitraCard({ user, onOpenChat }) {
  const { lang } = useLanguage();
  const [mitra, setMitra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpTitle, setHelpTitle] = useState('');
  const [helpDesc, setHelpDesc] = useState('');
  const [helpType, setHelpType] = useState('LOCAL_ASSISTANCE');
  const [submittingHelp, setSubmittingHelp] = useState(false);
  const [helpSuccess, setHelpSuccess] = useState(false);

  useEffect(() => {
    fetchNearestMitra();
  }, [user?.profile?.district, user?.profile?.latitude]);

  const fetchNearestMitra = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (user?.profile?.latitude) params.append('latitude', user.profile.latitude);
      if (user?.profile?.longitude) params.append('longitude', user.profile.longitude);
      if (user?.profile?.villageOrTown) params.append('village', user.profile.villageOrTown);
      if (user?.profile?.district) params.append('district', user.profile.district);

      const res = await fetch(`/api/village-mitra/nearest?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMitra(data?.data || null);
      }
    } catch (err) {
      console.warn('Failed to fetch nearest mitra:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAssistance = async (e) => {
    e.preventDefault();
    setSubmittingHelp(true);
    const token = localStorage.getItem('mandi_user_token') || localStorage.getItem('token') || localStorage.getItem('mandi_token');

    const payload = {
      mitraId: mitra?.userId,
      coordinationType: helpType,
      title: helpTitle,
      description: helpDesc,
      village: user?.profile?.villageOrTown,
      district: user?.profile?.district || 'Lucknow',
      state: user?.profile?.state || 'Uttar Pradesh',
      latitude: user?.profile?.latitude,
      longitude: user?.profile?.longitude
    };

    try {
      const res = await fetch('/api/village-mitra/assistance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setHelpSuccess(true);
        setTimeout(() => {
          setHelpSuccess(false);
          setShowHelpModal(false);
          setHelpTitle('');
          setHelpDesc('');
        }, 2000);
      }
    } catch (err) {
      console.warn('Assistance request error:', err);
    } finally {
      setSubmittingHelp(false);
    }
  };

  if (loading) {
    return (
      <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm flex items-center justify-center space-x-2 text-xs text-stone-500">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
        <span>Finding your nearest MANDI Village Mitra...</span>
      </div>
    );
  }

  if (!mitra) return null;

  return (
    <div className="p-6 bg-gradient-to-br from-white via-emerald-50/30 to-pine-50/40 rounded-3xl border-2 border-emerald-500/40 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md flex-shrink-0 font-black text-lg">
            🌟
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-black text-stone-900 text-base">
                {lang === 'hi' ? 'MANDI ग्राम मित्र (Village Mitra)' : 'MANDI Village Mitra'}
              </h3>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-300">
                🟢 {mitra.status || 'Available'}
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              {lang === 'hi' ? 'आपका नजदीकी जमीनी सहायक व समन्वयक' : 'Your nearest local human coordinator & digital facilitator'}
            </p>
          </div>
        </div>

        {mitra.distanceKm && (
          <span className="px-3 py-1 bg-white text-emerald-800 border border-emerald-300 rounded-xl text-xs font-black shadow-sm flex-shrink-0">
            📍 {mitra.distanceKm} km
          </span>
        )}
      </div>

      {/* Mitra Details */}
      <div className="p-4 bg-white/90 rounded-2xl border border-stone-200/80 space-y-2.5 text-xs shadow-inner">
        <div className="flex items-center justify-between">
          <span className="font-bold text-stone-900 text-sm">{mitra.fullName || 'Rahul Kumar'}</span>
          <span className="flex items-center space-x-1 text-amber-600 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{mitra.rating || 4.9} ★ ({mitra.totalCoordinatedCases || 38} cases assisted)</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-600">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
            <span className="truncate">
              Block: <strong className="text-stone-800">{mitra.assignedBlock || 'Kharar'}</strong> ({mitra.assignedDistrict || 'Mohali'})
            </span>
          </div>
          {mitra.phone && (
            <div className="flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="font-mono font-bold text-stone-800">+91-{mitra.phone}</span>
            </div>
          )}
        </div>

        <div className="pt-1 text-[11px] text-stone-500">
          <strong className="text-stone-700">Services:</strong> {mitra.servicesOffered || 'Agriculture, Transport, Crop Sales, Civic Assistance'}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setShowHelpModal(true)}
          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition active:scale-98"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{lang === 'hi' ? 'सहायता का अनुरोध करें' : 'Request Mitra Assistance'}</span>
        </button>

        {onOpenChat && (
          <button
            type="button"
            onClick={() => onOpenChat('VILLAGE_MITRA', mitra.userId || 1, `Mitra - ${mitra.fullName}`)}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl border border-stone-300 flex items-center space-x-1.5 transition"
          >
            <MessageSquare className="w-4 h-4 text-emerald-700" />
            <span>Chat</span>
          </button>
        )}
      </div>

      {/* Assistance Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border-2 border-emerald-500/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h4 className="font-black text-stone-900 text-sm">
                  {lang === 'hi' ? 'ग्राम मित्र से मदद मांगें' : 'Request Local Assistance'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            {helpSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto animate-bounce" />
                <h5 className="font-black text-stone-900 text-sm">
                  {lang === 'hi' ? 'अनुरोध सफलतापूर्वक भेजा गया!' : 'Assistance Request Sent!'}
                </h5>
                <p className="text-xs text-stone-500">
                  Village Mitra {mitra.fullName} has been notified and will contact you directly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestAssistance} className="space-y-3 text-xs">
                <div>
                  <label htmlFor="mitra-help-type" className="font-bold text-stone-700 block mb-1">
                    Assistance Type*:
                  </label>
                  <select
                    id="mitra-help-type"
                    name="mitraHelpType"
                    value={helpType}
                    onChange={(e) => setHelpType(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                  >
                    <option value="TRANSPORT_COORDINATION">Transport / Vehicle Coordination (परिवहन व्यवस्था)</option>
                    <option value="TRACTOR_ASSISTANCE">Tractor / Machinery Help (ट्रैक्टर व उपकरण)</option>
                    <option value="CROP_SALE">Crop Sale / Purchase Help (फसल खरीद व बिक्री)</option>
                    <option value="CIVIC_PROBLEM">Civic Problem Ground Follow-up (सार्वजनिक शिकायत)</option>
                    <option value="DIGITAL_HELP">Digital Platform Assistance (ऑनलाइन सहायता)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="mitra-help-title" className="font-bold text-stone-700 block mb-1">
                    Title / Subject*:
                  </label>
                  <input
                    type="text"
                    id="mitra-help-title"
                    name="mitraHelpTitle"
                    value={helpTitle}
                    onChange={(e) => setHelpTitle(e.target.value)}
                    placeholder="e.g. Need help booking tractor for 5 acres"
                    required
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label htmlFor="mitra-help-desc" className="font-bold text-stone-700 block mb-1">
                    Description & Details:
                  </label>
                  <textarea
                    id="mitra-help-desc"
                    name="mitraHelpDesc"
                    rows="3"
                    value={helpDesc}
                    onChange={(e) => setHelpDesc(e.target.value)}
                    placeholder="Explain what help you require in detail..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowHelpModal(false)}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingHelp}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    {submittingHelp ? <Loader2 className="w-4 h-4 animate-spin" /> : <HelpCircle className="w-4 h-4" />}
                    <span>Submit Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
