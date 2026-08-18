import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Loader2,
  DollarSign
} from 'lucide-react';

export default function ProviderAvailabilityCalendar({ providerId }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New slot form
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newStartTime, setNewStartTime] = useState('08:00');
  const [newEndTime, setNewEndTime] = useState('18:00');
  const [serviceType, setServiceType] = useState('TRACTOR');
  const [hourlyRate, setHourlyRate] = useState(1200);
  const [travelRadius, setTravelRadius] = useState(25);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('mandi_token');
      // For demonstration and live slots
      setSlots([
        {
          id: 1,
          availableDate: new Date().toISOString().split('T')[0],
          startTime: '08:00',
          endTime: '18:00',
          serviceType: 'TRACTOR',
          hourlyRate: 1200,
          maxTravelRadiusKm: 25,
          isBlocked: false
        },
        {
          id: 2,
          availableDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          startTime: '08:00',
          endTime: '18:00',
          serviceType: 'TRACTOR',
          hourlyRate: 1200,
          maxTravelRadiusKm: 25,
          isBlocked: false
        }
      ]);
    } catch (err) {
      console.warn('Fetch availability error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [providerId]);

  const handleAddSlot = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      availableDate: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      serviceType: serviceType,
      hourlyRate: Number(hourlyRate),
      maxTravelRadiusKm: Number(travelRadius),
      isBlocked: false
    };
    setSlots((prev) => [...prev, newEntry]);
    setShowAddModal(false);
  };

  const handleToggleBlock = (slotId) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, isBlocked: !s.isBlocked } : s))
    );
  };

  const handleDeleteSlot = (slotId) => {
    setSlots((prev) => prev.filter((s) => s.id !== slotId));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-600" />
            Equipment Availability Calendar (उपलब्धता कैलेंडर)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Publish your active dates and operational hours to accept direct farmer bookings.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Available Slot / स्लॉट जोड़ें
        </button>
      </div>

      {/* Slots List */}
      {loading ? (
        <div className="py-8 text-center">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
        </div>
      ) : slots.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          No active availability slots published. Add a slot to appear on the farmer matching radar.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {slots.map((s) => (
            <div
              key={s.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                s.isBlocked
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-emerald-50/40 border-emerald-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                  {s.serviceType}
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                    s.isBlocked ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {s.isBlocked ? 'BLOCKED' : 'OPEN FOR BOOKING'}
                </span>
              </div>

              <div>
                <p className="text-base font-black text-slate-900">{s.availableDate}</p>
                <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {s.startTime} – {s.endTime}
                </p>
              </div>

              <div className="text-xs text-slate-600 flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="font-bold text-emerald-700">₹{s.hourlyRate}/hr</span>
                <span>Max {s.maxTravelRadiusKm} km</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => handleToggleBlock(s.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200/60 transition text-xs flex items-center gap-1 font-bold"
                  title={s.isBlocked ? 'Unblock Slot' : 'Block Slot'}
                >
                  {s.isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  {s.isBlocked ? 'Unblock' : 'Block'}
                </button>
                <button
                  onClick={() => handleDeleteSlot(s.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                  title="Remove Slot"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <form
            onSubmit={handleAddSlot}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4"
          >
            <h4 className="text-lg font-black text-slate-900">Add Equipment Availability Slot</h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Service Type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
              >
                <option value="TRACTOR">Tractor & Machinery (ट्रैक्टर)</option>
                <option value="HARVESTER">Harvester (हार्वेस्टर)</option>
                <option value="WATER_TANKER">Water Tanker (जल टैंकर)</option>
                <option value="SKILLED_LABOUR">Skilled Labour / Tradesman</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">From</label>
                <input
                  type="time"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">To</label>
                <input
                  type="time"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hourly Rate (₹)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Radius (km)</label>
                <input
                  type="number"
                  value={travelRadius}
                  onChange={(e) => setTravelRadius(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
              >
                Save Slot
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
