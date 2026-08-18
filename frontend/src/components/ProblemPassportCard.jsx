import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ImageModalViewer from './ImageModalViewer';
import {
  FileText,
  ShieldCheck,
  Clock,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  MapPin,
  Sparkles,
  Volume2,
  VolumeX,
  ZoomIn,
  Camera
} from 'lucide-react';

const STATUS_CONFIG = {
  SUBMITTED: { label: 'Submitted (दर्ज)', bg: 'bg-blue-100 text-blue-900 border-blue-400' },
  UNDER_REVIEW: { label: 'Under Review (जाँच)', bg: 'bg-purple-100 text-purple-900 border-purple-400' },
  VERIFIED: { label: 'Verified (सत्यापित)', bg: 'bg-pine-100 text-pine-900 border-pine-500 font-black' },
  MATCHING: { label: 'Matching (खोज जारी)', bg: 'bg-emerald-100 text-emerald-900 border-emerald-400' },
  SOLUTION_FOUND: { label: 'Solution Found (समाधान तैयार)', bg: 'bg-teal-100 text-teal-900 border-teal-400 font-bold' },
  AWAITING_USER: { label: 'Awaiting Acceptance (स्वीकृति बाकी)', bg: 'bg-pine-50 text-pine-900 border-pine-400' },
  ASSIGNED: { label: 'Assigned (मददगार आवंटित)', bg: 'bg-indigo-100 text-indigo-900 border-indigo-400 font-bold' },
  IN_PROGRESS: { label: 'In Progress (प्रगति पर)', bg: 'bg-emerald-100 text-emerald-950 border-emerald-500 font-bold' },
  WAITING: { label: 'Waiting on Dependency', bg: 'bg-stone-100 text-stone-900 border-stone-400' },
  ESCALATED: { label: 'Escalated (उच्चाधिकारी)', bg: 'bg-red-100 text-red-900 border-red-400' },
  RESOLVED: { label: 'Resolved (सफलतापूर्वक हल)', bg: 'bg-emerald-100 text-emerald-950 border-emerald-600 font-black' },
  CLOSED: { label: 'Closed (बंद)', bg: 'bg-gray-100 text-gray-900 border-gray-400' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-rose-100 text-rose-900 border-rose-400' }
};

export default function ProblemPassportCard({ problem, passport, onOpenResolveModal }) {
  const { lang, t } = useLanguage();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  if (!problem) return null;

  const passportCode = passport?.passportCode || `MDI-2026-${String(problem.id).padStart(6, '0')}`;
  const statusInfo = STATUS_CONFIG[problem.status] || STATUS_CONFIG.SUBMITTED;

  const handleReadPassportAloud = () => {
    if (!window.speechSynthesis) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const narration = `समस्या पासपोर्ट संख्या ${passportCode}। स्थिति है ${statusInfo.label}। समस्या: ${problem.title}। विश्लेषण: ${passport?.aiAnalysisSummary || ''}। प्रस्तावित समाधान: ${passport?.identifiedSolutionPath || ''}।`;
    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border-4 border-stone-300 overflow-hidden">
      {/* Photo Lightbox with Zoom Controls */}
      <ImageModalViewer
        src={problem.photoUrl}
        alt={problem.title}
        isOpen={showPhotoModal}
        title={`Passport Photo: ${passportCode} - ${problem.title}`}
        onClose={() => setShowPhotoModal(false)}
      />

      {/* Passport Header Strip in Pine Green */}
      <div className="bg-pine-950 text-white p-5 sm:p-7 flex flex-wrap items-center justify-between gap-4 border-b-8 border-pine-500">
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-2xl bg-pine-700 text-white flex items-center justify-center font-black text-2xl shadow-lg border-2 border-emerald-400">
            म
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-widest text-emerald-300 font-extrabold">
                {lang === 'hi' ? 'डिजिटल समस्या पासपोर्ट' : 'MANDI Problem Passport'}
              </span>
              <span className="bg-emerald-800 text-emerald-100 text-[11px] font-black px-2 py-0.5 rounded border border-emerald-600 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>OFFICIAL RECORD</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-mono font-black tracking-wider text-white mt-0.5">
              {passportCode}
            </h2>
          </div>
        </div>

        {/* Status Badge & Audio Read Button */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleReadPassportAloud}
            className="flex items-center space-x-1.5 bg-pine-900 hover:bg-pine-800 text-emerald-300 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border border-pine-500/50 shadow"
            title="Read aloud in Hindi/English"
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isPlayingAudio ? 'रोकें (Stop)' : '🔊 आवाज़ में सुनें (Listen)'}</span>
          </button>

          <span className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black border-2 shadow ${statusInfo.bg}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Passport Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Title & Description */}
        <div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-stone-500 mb-2 font-bold flex-wrap gap-y-1">
            <span className="text-pine-800 bg-pine-100 px-2.5 py-0.5 rounded">{problem.category}</span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-stone-700">
              <MapPin className="w-4 h-4 text-pine-600" />
              <span>{problem.locationName || problem.district || 'Village Location'}</span>
            </span>
            <span>•</span>
            <span className="text-stone-500">{new Date(problem.createdAt).toLocaleDateString()}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
            {problem.title}
          </h3>

          <p className="mt-3 text-sm sm:text-base text-stone-800 font-medium leading-relaxed bg-pine-50/50 p-4 rounded-2xl border-2 border-pine-200">
            "{problem.rawDescription}"
          </p>

          {/* Attached Photo Display with Zoom Trigger */}
          {problem.photoUrl && (
            <div className="mt-4 p-3 bg-stone-100 rounded-2xl border-2 border-stone-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  onClick={() => setShowPhotoModal(true)}
                  className="relative group cursor-pointer"
                  title="Click to Zoom In / Zoom Out"
                >
                  <img
                    src={problem.photoUrl}
                    alt="Problem attachment"
                    className="w-16 h-16 object-cover rounded-xl border border-stone-300 shadow group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    {lang === 'hi' ? 'संलग्न वास्तविक फोटो' : 'Attached Photo Evidence'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPhotoModal(true)}
                    className="text-xs text-pine-700 font-bold hover:underline flex items-center space-x-1 mt-0.5"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>🔍 फोटो ज़ूम करें (Zoom In / Out)</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="bg-pine-700 hover:bg-pine-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Zoom</span>
              </button>
            </div>
          )}
        </div>

        {/* Passport Analysis & Solution Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-pine-50 p-5 rounded-2xl border-2 border-pine-200 space-y-2">
            <div className="text-xs sm:text-sm font-black text-pine-950 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-pine-700" />
              <span>{lang === 'hi' ? 'विश्लेषण एवं आवश्यकताएं' : 'Engine Analysis & Needs'}</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
              {passport?.aiAnalysisSummary || 'Resource requirements analyzed by MANDI Engine.'}
            </p>
          </div>

          <div className="bg-emerald-50 p-5 rounded-2xl border-2 border-emerald-200 space-y-2">
            <div className="text-xs sm:text-sm font-black text-emerald-950 flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'hi' ? 'समाधान मार्ग (Solution Chain)' : 'Identified Solution Path'}</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
              {passport?.identifiedSolutionPath || 'Multi-step resolution path coordinated with local providers.'}
            </p>
          </div>
        </div>

        {/* Resolution State or Citizen Confirmation Banner */}
        {problem.status === 'RESOLVED' || problem.status === 'CLOSED' ? (
          <div className="bg-emerald-100 border-4 border-emerald-500 p-5 rounded-2xl text-emerald-950 flex items-start space-x-4 shadow">
            <CheckCircle className="w-7 h-7 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-black text-base sm:text-lg text-emerald-950">
                {lang === 'hi' ? 'समस्या का पूर्ण समाधान हो चुका है (Resolved)' : 'Problem Successfully Resolved'}
              </h4>
              <p className="text-xs sm:text-sm text-emerald-900 font-medium mt-1">
                {passport?.resolutionSummary || 'Resolution confirmed by citizen.'}
              </p>
              {passport?.userRating && (
                <div className="flex items-center space-x-1 mt-2 text-pine-800 text-xs sm:text-sm font-black">
                  <span>{lang === 'hi' ? 'नागरिक संतुष्टि रेटिंग:' : 'Citizen Rating:'}</span>
                  {[...Array(passport.userRating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-stone-200">
            <div className="flex items-center space-x-4 text-xs sm:text-sm text-stone-600 font-bold">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-stone-400" />
                <span>Tracking Live</span>
              </span>
              <span className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-stone-400" />
                <span>{passport?.estimatedPeopleImpacted || 1} Person(s) Benefited</span>
              </span>
            </div>

            {onOpenResolveModal && (
              <button
                onClick={onOpenResolveModal}
                className="bg-pine-700 hover:bg-pine-800 text-white text-xs sm:text-sm font-black px-5 py-2.5 rounded-2xl shadow-lg transition flex items-center space-x-2 border border-pine-500"
              >
                <CheckCircle className="w-5 h-5" />
                <span>{t?.passport?.confirm_resolution || (lang === 'hi' ? 'समस्या हल हो गई (Confirm Resolution)' : 'Confirm Problem Resolved')}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
