import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  Truck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

export default function TransportMatchModal({ transportRequest, matches = [], onClose, onBookSuccess }) {
  const { lang } = useLanguage();
  const [bookingId, setBookingId] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleBookVehicle = async (match) => {
    setBookingLoading(true);
    setErrorMessage('');

    const token = localStorage.getItem('mandi_user_token') || localStorage.getItem('token') || localStorage.getItem('mandi_token');

    try {
      const res = await fetch(`/api/transport/requests/${transportRequest.id}/accept?vehicleId=${match.vehicle.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Double booking conflict: Vehicle is unavailable on this slot.');
      }

      const data = await res.json();
      setBookingId(data.data?.id || transportRequest.id);
      setTimeout(() => {
        if (onBookSuccess) onBookSuccess(data.data);
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-emerald-500/40 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-pine-950 to-stone-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-black text-sm text-emerald-100">
                {lang === 'hi' ? '🚚 अनुकूलतम परिवहन वाहन मिलान (Smart Transport Matches)' : '🚚 7-Factor Smart Transport Matches'}
              </h3>
              <p className="text-[11px] text-stone-300">
                Route: {transportRequest.pickupVillage || transportRequest.pickupDistrict} → {transportRequest.destinationVillage || transportRequest.destinationDistrict} ({transportRequest.cargoType})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs rounded-xl flex items-center space-x-2 font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {bookingId ? (
            <div className="p-8 text-center space-y-3 animate-fadeIn my-auto">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-stone-900">
                {lang === 'hi' ? '🎉 परिवहन वाहन सफलतापूर्वक बुक किया गया!' : '🎉 Transport Carrier Booked!'}
              </h4>
              <p className="text-xs text-stone-600">
                Trip Request <strong className="font-mono text-emerald-800">#TR-{bookingId}</strong> has been confirmed. Carrier has been locked with collision protection.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>Ranked by Type, Schedule, Distance, Capacity & Rates</span>
                <span className="font-bold text-stone-700">{matches.length} compatible carriers found</span>
              </div>

              {matches.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <Truck className="w-8 h-8 text-stone-400 mx-auto" />
                  <p className="font-bold text-stone-700 text-xs">No active carriers found in district</p>
                  <p className="text-[11px] text-stone-500">
                    Nearby Village Mitra has been alerted to coordinate local private vehicle options.
                  </p>
                </div>
              ) : (
                matches.map((m, idx) => {
                  const v = m.vehicle;
                  return (
                    <div
                      key={v.id || idx}
                      className="p-4 bg-stone-50/70 hover:bg-emerald-50/30 rounded-2xl border-2 border-stone-200 hover:border-emerald-500 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 bg-emerald-600 text-white font-black text-[10px] rounded-lg shadow-sm">
                            {Math.round(m.matchScore)}% MATCH
                          </span>
                          <h4 className="font-black text-stone-900 text-sm">
                            {v.modelName || 'Cargo Carrier'} ({v.vehicleType})
                          </h4>
                          <span className="font-mono text-[10px] text-stone-500 font-bold bg-white px-2 py-0.5 rounded border border-stone-200">
                            {v.registrationNumber}
                          </span>
                        </div>

                        {/* Transparent Match Reasons */}
                        <div className="space-y-1 text-[11px] text-emerald-900">
                          {m.matchReasons?.slice(0, 3).map((reason, rIdx) => (
                            <div key={rIdx} className="flex items-center space-x-1.5 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 pt-1">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                            <strong>{m.distanceKm} km away</strong> ({v.serviceVillage || v.serviceDistrict})
                          </span>
                          <span className="flex items-center space-x-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <strong>{v.rating || 4.8} ★</strong> ({v.totalCompletedTrips || 24} trips)
                          </span>
                          <span>
                            Capacity: <strong>{v.capacityTons} Tons</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex md:flex-col items-end justify-between md:justify-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-stone-200 flex-shrink-0">
                        <div className="text-right">
                          <span className="text-base font-black text-emerald-800 font-mono">
                            ₹{m.estimatedCost || v.pricePerTrip || 1200}
                          </span>
                          <span className="text-[10px] text-stone-400 block font-medium">Est. Trip Rate</span>
                        </div>

                        <button
                          type="button"
                          disabled={bookingLoading}
                          onClick={() => handleBookVehicle(m)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition active:scale-98 disabled:opacity-50"
                        >
                          {bookingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                          <span>Book Carrier</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
