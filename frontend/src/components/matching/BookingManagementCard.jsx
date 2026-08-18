import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  XCircle,
  Clock3,
  Star,
  Send,
  Loader2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function BookingManagementCard({
  booking,
  currentUserId,
  onAccept,
  onReject,
  onReschedule,
  onAcceptReschedule,
  onDeliver,
  onConfirm,
  onRate
}) {
  const [showRateModal, setShowRateModal] = useState(false);
  const [ratingVal, setRatingVal] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [ratingTags, setRatingTags] = useState('ON_TIME,EXCELLENT_EQUIPMENT');
  const [actionLoading, setActionLoading] = useState(false);

  if (!booking) return null;

  const isRequester = booking.requesterId === currentUserId;
  const isProvider = booking.providerId === currentUserId;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" /> Awaiting Provider Acceptance</span>;
      case 'ACCEPTED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Booking Confirmed / Scheduled</span>;
      case 'SERVICE_DELIVERED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Service Delivered (Awaiting Confirmation)</span>;
      case 'COMPLETED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-purple-600" /> Completed & Verified</span>;
      case 'RESCHEDULED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> Reschedule Proposed</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Declined</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  const handleRateSubmit = async () => {
    if (!onRate) return;
    setActionLoading(true);
    try {
      await onRate(booking.id, {
        rating: ratingVal,
        feedback: feedback,
        tags: ratingTags
      });
      setShowRateModal(false);
    } catch (err) {
      alert(err.message || 'Failed to submit rating');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all space-y-4">
      {/* Top row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-black text-slate-900 text-base">
            {booking.serviceType || 'Service'} Booking
          </span>
          <span className="text-xs text-slate-400">#BK-{booking.id}</span>
        </div>
        <div>{getStatusBadge(booking.bookingStatus)}</div>
      </div>

      {/* Main details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Date & Time</span>
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{booking.bookingDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{booking.startTime} – {booking.endTime}</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">
            {isRequester ? 'Service Provider' : 'Requester'}
          </span>
          <p className="font-bold text-slate-800">
            {isRequester ? booking.providerName : booking.requesterName}
          </p>
          {(isRequester ? booking.providerPhone : booking.requesterPhone) && (
            <a
              href={`tel:${isRequester ? booking.providerPhone : booking.requesterPhone}`}
              className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold hover:underline"
            >
              <Phone className="w-3 h-3" />
              {isRequester ? booking.providerPhone : booking.requesterPhone}
            </a>
          )}
        </div>

        <div className="space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Location</span>
          <p className="font-medium text-slate-700 flex items-center gap-1 text-xs">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {booking.villageOrTown || 'Village'}, {booking.district}
          </p>
          {booking.serviceAddress && (
            <p className="text-xs text-slate-500 line-clamp-1">{booking.serviceAddress}</p>
          )}
        </div>

        <div className="space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Agreed Rate</span>
          <p className="text-base font-black text-emerald-700">
            ₹{booking.agreedPrice} <span className="text-xs text-slate-500 font-normal">{booking.priceUnit}</span>
          </p>
        </div>
      </div>

      {booking.notes && (
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
          <span className="font-bold text-slate-700">Notes: </span>
          {booking.notes}
        </div>
      )}

      {/* Reschedule banner if pending */}
      {booking.bookingStatus === 'RESCHEDULED' && (
        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="font-bold">Proposed New Time: {booking.rescheduleSuggestedDate} ({booking.rescheduleSuggestedStartTime} – {booking.rescheduleSuggestedEndTime})</p>
              {booking.rescheduleReason && <p className="text-indigo-700 mt-0.5">Reason: {booking.rescheduleReason}</p>}
            </div>
          </div>
          {onAcceptReschedule && (
            <button
              onClick={() => onAcceptReschedule(booking.id)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0"
            >
              Accept New Time
            </button>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
        {/* Provider actions for PENDING */}
        {isProvider && booking.bookingStatus === 'PENDING' && (
          <>
            <button
              onClick={() => onReject && onReject(booking.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-700 hover:bg-red-50 transition border border-red-200"
            >
              Decline / अस्वीकार
            </button>
            <button
              onClick={() => onAccept && onAccept(booking.id)}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Accept Booking / स्वीकार करें
            </button>
          </>
        )}

        {/* Provider deliver button */}
        {isProvider && booking.bookingStatus === 'ACCEPTED' && onDeliver && (
          <button
            onClick={() => onDeliver(booking.id)}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Mark Service Delivered
          </button>
        )}

        {/* Requester confirmation and rating */}
        {isRequester && (booking.bookingStatus === 'SERVICE_DELIVERED' || booking.bookingStatus === 'ACCEPTED') && onConfirm && (
          <button
            onClick={() => onConfirm(booking.id)}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirm Completion / पूर्ण पुष्टि करें
          </button>
        )}

        {booking.bookingStatus === 'COMPLETED' && (
          <button
            onClick={() => setShowRateModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 transition flex items-center gap-1 border border-amber-200"
          >
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            Rate & Review (रेटिंग दें)
          </button>
        )}
      </div>

      {/* 5-Star Rating Modal */}
      {showRateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h4 className="text-lg font-black text-slate-900">Rate Your Service Experience</h4>
            <p className="text-xs text-slate-500">
              Your transparent rating helps fellow citizens and farmers in your community.
            </p>

            <div className="flex items-center justify-center gap-2 py-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingVal(star)}
                  className="p-1 text-2xl transition hover:scale-110"
                >
                  <Star className={`w-8 h-8 ${star <= ratingVal ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Feedback Comments</label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience regarding timeliness, machinery condition, and quality..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRateSubmit}
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
