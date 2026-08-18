import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  Clock,
  Star,
  ShieldCheck,
  ChevronRight,
  Loader2,
  X,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export default function ProviderMatchModal({
  isOpen,
  onClose,
  problem,
  matches = [],
  isLoading = false,
  onBookProvider
}) {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [bookingDate, setBookingDate] = useState(problem?.requiredDate || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(problem?.requiredStartTime || '09:00');
  const [endTime, setEndTime] = useState(problem?.requiredEndTime || '13:00');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState('');

  if (!isOpen) return null;

  const handleStartBooking = (candidate) => {
    setSelectedMatch(candidate);
    setBookingError('');
    setBookingSuccess(null);
  };

  const handleConfirmBooking = async () => {
    if (!selectedMatch || !onBookProvider) return;
    setSubmitting(true);
    setBookingError('');

    try {
      const payload = {
        providerId: selectedMatch.provider?.id || selectedMatch.resource?.owner?.id,
        problemId: problem?.id,
        resourceId: selectedMatch.resource?.id,
        serviceType: problem?.serviceType || 'TRACTOR',
        bookingDate: bookingDate,
        startTime: startTime,
        endTime: endTime,
        agreedPrice: selectedMatch.price || 1000,
        priceUnit: selectedMatch.priceUnit || 'per hour',
        serviceAddress: problem?.address || '',
        villageOrTown: problem?.villageOrTown || '',
        district: problem?.district || 'Lucknow',
        state: problem?.state || 'Uttar Pradesh',
        latitude: problem?.latitude,
        longitude: problem?.longitude,
        contactPhone: problem?.contactPhone || '',
        notes: notes
      };

      const res = await onBookProvider(payload);
      setBookingSuccess(res || true);
    } catch (err) {
      setBookingError(err.message || 'Failed to submit booking. Double booking or collision may exist.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-amber-950 uppercase tracking-wide">
                  Smart Match Engine
                </span>
                <span className="text-xs text-emerald-100 font-medium">
                  7-Factor Algorithm
                </span>
              </div>
              <h2 className="text-xl font-black mt-0.5">
                Top Compatible Providers & Equipment
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
              <p className="font-semibold text-slate-700">Calculating multi-factor compatibility scores...</p>
              <p className="text-xs text-slate-400">Matching date, time slots, horsepower, distance & ratings</p>
            </div>
          ) : bookingSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Booking Request Placed!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Provider has been notified. They will accept or propose a slot confirmation shortly.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-lg shadow-emerald-600/30"
                >
                  Done / ठीक है
                </button>
              </div>
            </div>
          ) : selectedMatch ? (
            /* Booking confirmation step */
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-black text-lg text-slate-900">Confirm Booking Details</h3>
                  <p className="text-xs text-slate-500">With {selectedMatch.resource?.name || 'Selected Provider'}</p>
                </div>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  ← Back to Matches
                </button>
              </div>

              {bookingError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold">Booking Warning / Collision</p>
                    <p className="text-xs mt-0.5">{bookingError}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Booking Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-sm"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Rate</span>
                  <p className="text-xl font-black text-emerald-700">₹{selectedMatch.price} <span className="text-xs font-semibold text-slate-500">{selectedMatch.priceUnit}</span></p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location Distance</span>
                  <p className="text-base font-bold text-slate-800">{selectedMatch.distanceKm} km away</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Special Instructions for Provider (वैकल्पिक निर्देश)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please bring rotavator implement, enter from eastern gate of village"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Confirm & Request Booking
                </button>
              </div>
            </div>
          ) : matches.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">No Direct Provider Match Found Yet</h4>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Your request has been published. Local MANDI Mitras and nearby providers will be alerted in real-time.
              </p>
            </div>
          ) : (
            /* Matches List */
            <div className="space-y-4">
              {matches.map((candidate, idx) => {
                const score = Math.round(candidate.score);
                const scoreColor =
                  score >= 85
                    ? 'bg-emerald-600 text-white'
                    : score >= 70
                    ? 'bg-teal-600 text-white'
                    : 'bg-amber-500 text-white';

                return (
                  <div
                    key={candidate.resource?.id || idx}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-white hover:shadow-lg transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide ${scoreColor}`}>
                            {score}% Match Score
                          </span>
                          {candidate.resource?.verified && (
                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              <ShieldCheck className="w-3.5 h-3.5" /> Verified
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {candidate.resource?.rating || 4.9}
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mt-1.5">
                          {candidate.resource?.name || 'Local Service Provider'}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {candidate.distanceKm} km ({candidate.resource?.villageOrTown || 'Nearby'}, {candidate.resource?.district})
                          </span>
                          <span className="font-bold text-emerald-700">
                            ₹{candidate.price} {candidate.priceUnit}
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={() => handleStartBooking(candidate)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20 flex items-center gap-1 shrink-0"
                      >
                        Book Now
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Transparent Match Reasons Checklist */}
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
                        Why this is a great match:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {candidate.matchedReasons && candidate.matchedReasons.map((reason, rIdx) => (
                          <div key={rIdx} className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>MANDI Smart Matching Engine with transparent scoring</span>
          <button onClick={onClose} className="font-bold text-slate-700 hover:text-slate-900">
            Close / बंद करें
          </button>
        </div>
      </div>
    </div>
  );
}
