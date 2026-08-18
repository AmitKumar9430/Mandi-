import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Truck,
  Plus,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  DollarSign,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import VehicleModal from './VehicleModal';

export default function TransportFleetHub({ user }) {
  const { lang } = useLanguage();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [selectedVehicleForAvailability, setSelectedVehicleForAvailability] = useState(null);

  // Quick availability slot state
  const [availDate, setAvailDate] = useState(new Date().toISOString().split('T')[0]);
  const [availStartTime, setAvailStartTime] = useState('08:00');
  const [availEndTime, setAvailEndTime] = useState('17:00');
  const [availPrice, setAvailPrice] = useState('');
  const [availStatus, setAvailStatus] = useState('AVAILABLE');
  const [savingAvail, setSavingAvail] = useState(false);
  const [availMessage, setAvailMessage] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    const token = localStorage.getItem('mandi_user_token') || localStorage.getItem('token') || localStorage.getItem('mandi_token');
    try {
      const res = await fetch('/api/transport/vehicles/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVehicles(data?.data || []);
        if (data?.data?.length > 0 && !selectedVehicleForAvailability) {
          setSelectedVehicleForAvailability(data.data[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to load fleet:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishAvailability = async (e) => {
    e.preventDefault();
    if (!selectedVehicleForAvailability) return;
    setSavingAvail(true);
    setAvailMessage('');

    const token = localStorage.getItem('mandi_user_token') || localStorage.getItem('token') || localStorage.getItem('mandi_token');
    const payload = {
      availableDate: availDate,
      startTime: availStartTime + ':00',
      endTime: availEndTime + ':00',
      status: availStatus,
      overridePrice: availPrice ? Number(availPrice) : null,
      notes: `Published slot by ${user?.fullName || 'Provider'}`
    };

    try {
      const res = await fetch(`/api/transport/vehicles/${selectedVehicleForAvailability.id}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setAvailMessage('✅ Availability slot successfully published!');
        setTimeout(() => setAvailMessage(''), 4000);
      }
    } catch (err) {
      setAvailMessage('⚠️ Failed to save availability.');
    } finally {
      setSavingAvail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-stone-900 via-pine-950 to-emerald-950 rounded-3xl border-2 border-emerald-500/40 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Truck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-black tracking-tight text-emerald-100">
              {lang === 'hi' ? '🚚 परिवहन वाहन व बेड़ा प्रबंधन (Fleet & Availability Hub)' : '🚚 Transportation Fleet & Availability Hub'}
            </h2>
          </div>
          <p className="text-xs text-stone-300 mt-1">
            {lang === 'hi'
              ? 'अपने ट्रैक्टर+ट्रॉली, मिनी ट्रक, पिकअप व टैंकर जोड़ें, तारीख/समय उपलब्धता तय करें व नई बुकिंग पाएं।'
              : 'Register multi-vehicle fleet, publish calendar availability, and manage trip requests with double-booking protection.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddVehicleModal(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2 transition active:scale-98 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'hi' ? '+ नया वाहन जोड़ें' : '+ Register Vehicle'}</span>
        </button>
      </div>

      {/* Vehicles Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase text-stone-600 tracking-wider">
          {lang === 'hi' ? 'पंजीकृत वाहन (Your Registered Fleet)' : 'Your Registered Fleet'} ({vehicles.length})
        </h3>

        {loading ? (
          <div className="py-12 text-center text-stone-400 space-y-2">
            <Loader2 className="w-7 h-7 animate-spin mx-auto text-emerald-600" />
            <p className="text-xs font-semibold">Loading your fleet...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <Truck className="w-10 h-10 text-stone-300 mx-auto" />
            <h4 className="font-bold text-stone-800 text-sm">No vehicles registered yet</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Add your tractor, pickup, or truck to start receiving trip requests from nearby farmers and buyers.
            </p>
            <button
              type="button"
              onClick={() => setShowAddVehicleModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
            >
              + Register First Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vehicles.map((v) => {
              const isSelected = selectedVehicleForAvailability?.id === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicleForAvailability(v)}
                  className={`p-5 rounded-3xl border-2 transition cursor-pointer shadow-sm flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-md ring-2 ring-emerald-400/30'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="px-2.5 py-0.5 bg-stone-100 text-stone-800 text-[10px] font-black rounded-full uppercase">
                        {v.vehicleType}
                      </span>
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
                        {v.registrationNumber}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-black text-stone-900 text-sm">{v.modelName || 'Transport Carrier'}</h4>
                      <p className="text-xs text-stone-500 font-medium mt-0.5">
                        Capacity: <strong className="text-stone-700">{v.capacityTons} Tons ({v.capacityQuintals} qtl)</strong>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase font-bold">Per Trip Rate</span>
                        <span className="font-bold text-stone-800 font-mono">₹{v.pricePerTrip || 1200}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase font-bold">Radius</span>
                        <span className="font-bold text-stone-800">{v.maxTravelRadiusKm || 40} km</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 text-xs text-stone-600">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                      <span className="truncate">{v.serviceVillage ? v.serviceVillage + ', ' : ''}{v.serviceDistrict}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>{isSelected ? '✓ Managing Availability' : 'Click to Set Calendar'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Vehicle Availability Publisher */}
      {selectedVehicleForAvailability && (
        <div className="p-6 bg-white rounded-3xl border-2 border-emerald-500/30 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-black text-stone-900 text-sm">
                  {lang === 'hi' ? '📅 वाहन समय सारणी व उपलब्धता प्रकाशन' : '📅 Publish Vehicle Availability Slot'}
                </h3>
                <p className="text-xs text-stone-500">
                  Target Vehicle: <strong className="text-stone-800">{selectedVehicleForAvailability.modelName}</strong> ({selectedVehicleForAvailability.registrationNumber})
                </p>
              </div>
            </div>

            {availMessage && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-fadeIn">
                {availMessage}
              </span>
            )}
          </div>

          <form onSubmit={handlePublishAvailability} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
            <div>
              <label htmlFor="avail-date-input" className="block text-xs font-bold text-stone-700 mb-1">
                Date (तारीख)*
              </label>
              <input
                type="date"
                id="avail-date-input"
                name="availDate"
                value={availDate}
                onChange={(e) => setAvailDate(e.target.value)}
                required
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label htmlFor="avail-start-time" className="block text-xs font-bold text-stone-700 mb-1">
                Start Time (शुरुआत)*
              </label>
              <input
                type="time"
                id="avail-start-time"
                name="availStartTime"
                value={availStartTime}
                onChange={(e) => setAvailStartTime(e.target.value)}
                required
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold font-mono"
              />
            </div>

            <div>
              <label htmlFor="avail-end-time" className="block text-xs font-bold text-stone-700 mb-1">
                End Time (समाप्ति)*
              </label>
              <input
                type="time"
                id="avail-end-time"
                name="availEndTime"
                value={availEndTime}
                onChange={(e) => setAvailEndTime(e.target.value)}
                required
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold font-mono"
              />
            </div>

            <div>
              <label htmlFor="avail-status-select" className="block text-xs font-bold text-stone-700 mb-1">
                Status (स्थिति)*
              </label>
              <select
                id="avail-status-select"
                name="availStatus"
                value={availStatus}
                onChange={(e) => setAvailStatus(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
              >
                <option value="AVAILABLE">AVAILABLE (उपलब्ध)</option>
                <option value="BLOCKED">BLOCKED (आरक्षित / व्यस्त)</option>
                <option value="MAINTENANCE">MAINTENANCE (सर्विसिंग)</option>
                <option value="HOLIDAY">HOLIDAY (अवकाश)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={savingAvail}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow flex items-center justify-center space-x-1.5 transition active:scale-98 disabled:opacity-50"
              >
                {savingAvail ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Publish Slot</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <VehicleModal
          user={user}
          onClose={() => setShowAddVehicleModal(false)}
          onSuccess={(newV) => {
            setShowAddVehicleModal(false);
            fetchVehicles();
          }}
        />
      )}
    </div>
  );
}
