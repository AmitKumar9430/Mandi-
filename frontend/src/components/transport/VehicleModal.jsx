import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  Truck,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  MapPin,
  DollarSign
} from 'lucide-react';

const VEHICLE_TYPES = [
  { value: 'TRACTOR_TROLLEY', label: 'Tractor + Hydraulic Trolley (ट्रैक्टर ट्रॉली)' },
  { value: 'TRACTOR', label: 'Tractor Only (ट्रैक्टर)' },
  { value: 'MINI_TRUCK', label: 'Mini Truck / Tata Ace (छोटा हाथी / मिनी ट्रक)' },
  { value: 'PICKUP', label: 'Pickup / Bolero Maxi Truck (पिकअप)' },
  { value: 'TRUCK', label: 'Heavy Truck / 6-10 Wheeler (बड़ा ट्रक)' },
  { value: 'TEMPO', label: 'Tempo / Three Wheeler (टेम्पो)' },
  { value: 'WATER_TANKER', label: 'Water Tanker (पानी का टैंकर)' },
  { value: 'AUTO', label: 'Auto Rickshaw Cargo (ऑटो कार्गो)' }
];

export default function VehicleModal({ user, onClose, onSuccess }) {
  const { lang } = useLanguage();
  const [vehicleType, setVehicleType] = useState('TRACTOR_TROLLEY');
  const [regNumber, setRegNumber] = useState('');
  const [modelName, setModelName] = useState('');
  const [capacityTons, setCapacityTons] = useState('3.0');
  const [pricePerTrip, setPricePerTrip] = useState('1200');
  const [pricePerKm, setPricePerKm] = useState('25');
  const [pricePerHour, setPricePerHour] = useState('400');
  const [maxRadius, setMaxRadius] = useState('40');
  const [serviceVillage, setServiceVillage] = useState(user?.profile?.villageOrTown || '');
  const [serviceDistrict, setServiceDistrict] = useState(user?.profile?.district || 'Lucknow');
  const [serviceState, setServiceState] = useState(user?.profile?.state || 'Uttar Pradesh');
  const [driverIncluded, setDriverIncluded] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const token = localStorage.getItem('mandi_user_token') || localStorage.getItem('token') || localStorage.getItem('mandi_token');
    const payload = {
      vehicleType,
      registrationNumber: regNumber.toUpperCase(),
      modelName,
      capacityTons: Number(capacityTons),
      capacityQuintals: Number(capacityTons) * 10.0,
      pricePerTrip: Number(pricePerTrip),
      pricePerKm: Number(pricePerKm),
      pricePerHour: Number(pricePerHour),
      maxTravelRadiusKm: Number(maxRadius),
      serviceVillage,
      serviceDistrict,
      serviceState,
      driverAvailable: driverIncluded,
      latitude: user?.profile?.latitude || 26.8467,
      longitude: user?.profile?.longitude || 80.9462
    };

    try {
      const res = await fetch('/api/transport/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to register vehicle.');
      }

      const data = await res.json();
      if (onSuccess) onSuccess(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-2 border-emerald-500/40 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 to-stone-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-black text-sm text-emerald-100">
                {lang === 'hi' ? 'नया वाहन पंजीकृत करें (Register Fleet Vehicle)' : 'Register Fleet Vehicle'}
              </h3>
              <p className="text-[11px] text-stone-300">Add vehicle specifications, payload & service area</p>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="modal-vehicle-type" className="font-bold text-stone-700 block mb-1">
              Vehicle Type (वाहन का प्रकार)*:
            </label>
            <select
              id="modal-vehicle-type"
              name="vehicleType"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-900"
            >
              {VEHICLE_TYPES.map((vt) => (
                <option key={vt.value} value={vt.value}>
                  {vt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="modal-reg-number" className="font-bold text-stone-700 block mb-1">
                Vehicle Reg Number (गाड़ी नंबर)*:
              </label>
              <input
                type="text"
                id="modal-reg-number"
                name="regNumber"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="e.g. PB65-AB-1234"
                required
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono uppercase font-bold"
              />
            </div>

            <div>
              <label htmlFor="modal-model-name" className="font-bold text-stone-700 block mb-1">
                Model / Brand (मॉडल / ब्रांड)*:
              </label>
              <input
                type="text"
                id="modal-model-name"
                name="modelName"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="e.g. Mahindra 575 DI / Tata Ace"
                required
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="modal-capacity-tons" className="font-bold text-stone-700 block mb-1">
                Payload Capacity (क्षमता टन में)*:
              </label>
              <input
                type="number"
                step="0.5"
                id="modal-capacity-tons"
                name="capacityTons"
                value={capacityTons}
                onChange={(e) => setCapacityTons(e.target.value)}
                required
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold"
              />
            </div>

            <div>
              <label htmlFor="modal-price-trip" className="font-bold text-stone-700 block mb-1">
                Base / Trip Rate (₹ प्रति ट्रिप)*:
              </label>
              <input
                type="number"
                id="modal-price-trip"
                name="pricePerTrip"
                value={pricePerTrip}
                onChange={(e) => setPricePerTrip(e.target.value)}
                required
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="modal-village" className="font-bold text-stone-700 block mb-1">
                Base Village:
              </label>
              <input
                type="text"
                id="modal-village"
                name="serviceVillage"
                value={serviceVillage}
                onChange={(e) => setServiceVillage(e.target.value)}
                placeholder="e.g. Gharuan"
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label htmlFor="modal-district" className="font-bold text-stone-700 block mb-1">
                District*:
              </label>
              <input
                type="text"
                id="modal-district"
                name="serviceDistrict"
                value={serviceDistrict}
                onChange={(e) => setServiceDistrict(e.target.value)}
                placeholder="e.g. Mohali"
                required
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold"
              />
            </div>

            <div>
              <label htmlFor="modal-radius" className="font-bold text-stone-700 block mb-1">
                Radius (KM)*:
              </label>
              <input
                type="number"
                id="modal-radius"
                name="maxRadius"
                value={maxRadius}
                onChange={(e) => setMaxRadius(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold font-mono"
              />
            </div>
          </div>

          <label className="flex items-center space-x-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              id="driver-included-check"
              name="driverIncluded"
              checked={driverIncluded}
              onChange={(e) => setDriverIncluded(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
            <span className="font-bold text-stone-800">Professional driver / operator included with vehicle</span>
          </label>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-lg flex items-center space-x-1.5 transition active:scale-98 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Save & Publish Vehicle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
