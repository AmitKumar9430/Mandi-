import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  Wheat,
  Truck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function CropPurchaseModal({ crop, user, onClose, onSuccess }) {
  const { lang } = useLanguage();
  const [quantity, setQuantity] = useState(crop.quantityQuintals >= 5 ? 5 : crop.quantityQuintals || 1);
  const [offeredPrice, setOfferedPrice] = useState(crop.expectedPricePerQuintal || 2200);
  const [deliveryPref, setDeliveryPref] = useState('DELIVERY');
  const [deliveryVillage, setDeliveryVillage] = useState(user?.profile?.villageOrTown || '');
  const [deliveryDistrict, setDeliveryDistrict] = useState(user?.profile?.district || 'Lucknow');
  const [deliveryState, setDeliveryState] = useState(user?.profile?.state || 'Uttar Pradesh');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.profile?.address || '');
  const [needTransport, setNeedTransport] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderComplete, setOrderComplete] = useState(null);

  const totalCost = Number(quantity) * Number(offeredPrice);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const token = localStorage.getItem('mandi_user_token') || localStorage.getItem('token') || localStorage.getItem('mandi_token');

    const payload = {
      cropId: crop.id,
      quantityQuintals: Number(quantity),
      offeredPricePerQuintal: Number(offeredPrice),
      deliveryPreference: deliveryPref,
      deliveryVillage,
      deliveryDistrict,
      deliveryState,
      deliveryAddress,
      requestTransport: needTransport
    };

    try {
      const res = await fetch('/api/crop-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to submit crop purchase order.');
      }

      const resData = await res.json();
      const savedOrder = resData.data || resData;
      setOrderComplete(savedOrder);
      setTimeout(() => {
        if (onSuccess) onSuccess(savedOrder);
      }, 2000);
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
            <Wheat className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-black text-sm text-emerald-100">
                {lang === 'hi' ? 'फसल खरीद ऑर्डर (Direct Crop Purchase)' : 'Direct Crop Purchase'}
              </h3>
              <p className="text-[11px] text-stone-300">
                {crop.cropName} {crop.variety ? `(${crop.variety})` : ''} • Farmer: {crop.farmerName || 'Verified Producer'}
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

        {orderComplete ? (
          <div className="p-8 text-center space-y-4 my-auto animate-fadeIn">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-black text-stone-900">
                {lang === 'hi' ? '🎉 खरीद अनुरोध सफलतापूर्वक भेजा गया!' : '🎉 Purchase Request Sent to Farmer!'}
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                Order ID: <strong className="font-mono text-emerald-800">#CO-{orderComplete.id}</strong>
              </p>
              <p className="text-xs text-stone-500 mt-2">
                {needTransport
                  ? 'Connecting to nearby transportation carriers for farm-to-home delivery...'
                  : 'Farmer has been notified and will confirm delivery readiness.'}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-5 overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Quantity & Rate */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="purchase-quantity-input" className="block text-xs font-bold text-stone-700 mb-1">
                  {lang === 'hi' ? 'मात्रा (क्विंटल)*' : 'Quantity (Quintals)*'}
                </label>
                <input
                  type="number"
                  id="purchase-quantity-input"
                  name="purchaseQuantity"
                  min="0.5"
                  step="0.5"
                  max={crop.quantityQuintals || 1000}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="w-full p-2.5 bg-stone-50 border-2 border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  Max available: {crop.quantityQuintals} qtl
                </span>
              </div>

              <div>
                <label htmlFor="purchase-rate-input" className="block text-xs font-bold text-stone-700 mb-1">
                  {lang === 'hi' ? 'प्रस्तावित दर (₹/क्विंटल)*' : 'Offered Rate (₹/qtl)*'}
                </label>
                <input
                  type="number"
                  id="purchase-rate-input"
                  name="purchaseRate"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(e.target.value)}
                  required
                  className="w-full p-2.5 bg-stone-50 border-2 border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  Farmer rate: ₹{crop.expectedPricePerQuintal}/qtl
                </span>
              </div>
            </div>

            {/* Price Summary Banner */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-500 font-medium block">Total Payable to Farmer</span>
                <span className="text-lg font-black text-emerald-800 font-mono">₹{totalCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 bg-emerald-200/70 text-emerald-900 font-bold rounded text-[10px]">
                  0% Commission
                </span>
              </div>
            </div>

            {/* Delivery Option */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">
                {lang === 'hi' ? 'प्राप्ति का तरीका (Delivery Mode)*' : 'Delivery Mode*'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-xl border-2 flex items-center space-x-2 cursor-pointer transition ${
                    deliveryPref === 'DELIVERY'
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-bold'
                      : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMode"
                    value="DELIVERY"
                    checked={deliveryPref === 'DELIVERY'}
                    onChange={() => setDeliveryPref('DELIVERY')}
                    className="accent-emerald-600"
                  />
                  <span className="text-xs">Doorstep Delivery (होम डिलीवरी)</span>
                </label>

                <label
                  className={`p-3 rounded-xl border-2 flex items-center space-x-2 cursor-pointer transition ${
                    deliveryPref === 'PICKUP'
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-bold'
                      : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMode"
                    value="PICKUP"
                    checked={deliveryPref === 'PICKUP'}
                    onChange={() => setDeliveryPref('PICKUP')}
                    className="accent-emerald-600"
                  />
                  <span className="text-xs">Self Farm-Gate Pickup (खेत से स्वयं लें)</span>
                </label>
              </div>
            </div>

            {/* Delivery Address */}
            {deliveryPref === 'DELIVERY' && (
              <div className="space-y-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="del-village-input" className="font-bold text-stone-700 block mb-0.5">
                      गाँव / कस्बा (Village / Town):
                    </label>
                    <input
                      type="text"
                      id="del-village-input"
                      name="delVillage"
                      value={deliveryVillage}
                      onChange={(e) => setDeliveryVillage(e.target.value)}
                      placeholder="e.g. Sector 62 / Bodhgaya"
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="del-district-input" className="font-bold text-stone-700 block mb-0.5">
                      जिला (District)*:
                    </label>
                    <input
                      type="text"
                      id="del-district-input"
                      name="delDistrict"
                      value={deliveryDistrict}
                      onChange={(e) => setDeliveryDistrict(e.target.value)}
                      placeholder="e.g. Lucknow / Mohali"
                      required
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="del-address-input" className="font-bold text-stone-700 block mb-0.5">
                    पूरा पता (Full Delivery Address):
                  </label>
                  <input
                    type="text"
                    id="del-address-input"
                    name="delAddress"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House No, Landmark, Road"
                    className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                {/* Integrated Transport Checkbox */}
                <label className="flex items-center space-x-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    id="request-transport-check"
                    name="requestTransport"
                    checked={needTransport}
                    onChange={(e) => setNeedTransport(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <span className="font-bold text-emerald-900 flex items-center space-x-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Find & coordinate nearest transport vehicle (ट्रक / पिकअप वाहन साथ में बुक करें)</span>
                  </span>
                </label>
              </div>
            )}

            {/* Buttons */}
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
                <span>{lang === 'hi' ? 'ऑर्डर पुष्टि भेजें' : 'Confirm Purchase Request'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
