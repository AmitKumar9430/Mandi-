import React, { useEffect, useState } from 'react';
import { agricultureApi, resourceApi } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  PlusCircle,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Tag,
  ShieldCheck,
  Send,
  Loader2,
  Tractor,
  Warehouse
} from 'lucide-react';

export default function AgricultureHub() {
  const { lang } = useLanguage();
  const { user } = useAuth();

  const [crops, setCrops] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('crops'); // crops, equipment, postCrop

  // Form states for listing crop
  const [cropName, setCropName] = useState('Sharbati Wheat (शरबती गेहूँ)');
  const [variety, setVariety] = useState('HD-2967');
  const [quantity, setQuantity] = useState('50');
  const [price, setPrice] = useState('2450');
  const [district, setDistrict] = useState('Malihabad, Lucknow');
  const [desc, setDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inquiry modal state
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [offeredPrice, setOfferedPrice] = useState('');
  const [reqQty, setReqQty] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [isInquiring, setIsInquiring] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cropRes, eqRes] = await Promise.all([
        agricultureApi.searchCrops({ page: 0, size: 20 }).catch(() => null),
        resourceApi.search({ category: 'TRACTOR_EQUIPMENT', size: 10 }).catch(() => null)
      ]);
      if (cropRes?.data?.content) setCrops(cropRes.data.content);
      if (eqRes?.data?.content) setEquipment(eqRes.data.content);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePostCrop = async (e) => {
    e.preventDefault();
    if (!user) {
      alert(lang === 'hi' ? 'फसल दर्ज करने के लिए कृपया लॉगिन करें।' : 'Please login to list produce.');
      return;
    }
    setIsSubmitting(true);
    try {
      await agricultureApi.createCrop({
        cropName,
        variety,
        quantityQuintals: parseFloat(quantity),
        expectedPricePerQuintal: parseFloat(price),
        district,
        description: desc
      });
      alert(lang === 'hi' ? 'फसल सफलतापूर्वक किसान बाज़ार में दर्ज हो गई!' : 'Crop listed successfully in Kisan Desk!');
      setActiveTab('crops');
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to list crop');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to send inquiry/bid.');
      return;
    }
    setIsInquiring(true);
    try {
      await agricultureApi.submitInquiry(selectedCrop.id, {
        offeredPricePerQuintal: parseFloat(offeredPrice),
        requestedQuantityQuintals: parseFloat(reqQty),
        message: inquiryMsg,
        contactPhone: inquiryPhone || user.phone
      });
      alert(lang === 'hi' ? 'किसान भाई को खरीद प्रस्ताव भेज दिया गया है!' : 'Inquiry sent to farmer successfully!');
      setSelectedCrop(null);
      setInquiryMsg('');
    } catch (err) {
      alert(err.message || 'Failed to send inquiry');
    } finally {
      setIsInquiring(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Kisan Banner with Rural Backdrop */}
      <div className="bg-kisan-banner text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-emerald-600/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-300 font-black text-xs uppercase tracking-wider">
              <Sprout className="w-4 h-4" />
              <span>{lang === 'hi' ? 'मंडी किसान सहायता एवं फसल बाज़ार' : 'Farmer Produce & Agri Hub'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-1">
              {lang === 'hi' ? '🌾 किसान डेस्क (Kisan Agri Hub)' : '🌾 MANDI Kisan Desk'}
            </h1>
            <p className="text-sm sm:text-base text-stone-200 mt-2 max-w-2xl font-medium">
              {lang === 'hi'
                ? 'बिचौलियों के बिना फसल की सीधी बिक्री, सत्यापित अनाज व्यापारी, किराए पर ट्रैक्टर-उपकरण एवं वेयरहाउस'
                : 'Direct harvest listings, verified buyers, tractor rental & storage facilities'}
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="flex items-center space-x-2 bg-stone-900/80 p-1.5 rounded-2xl text-xs sm:text-sm font-black border border-stone-700">
            <button
              onClick={() => setActiveTab('crops')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'crops' ? 'bg-amber-400 text-stone-950 shadow-lg' : 'text-stone-300'}`}
            >
              🌾 {lang === 'hi' ? 'फसलें (Produce)' : 'Harvest'}
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'equipment' ? 'bg-amber-400 text-stone-950 shadow-lg' : 'text-stone-300'}`}
            >
              🚜 {lang === 'hi' ? 'ट्रैक्टर (Rentals)' : 'Equipment'}
            </button>
            <button
              onClick={() => setActiveTab('postCrop')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'postCrop' ? 'bg-emerald-500 text-white shadow-lg' : 'text-stone-300'}`}
            >
              + {lang === 'hi' ? 'फसल बेचें' : 'Post Crop'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Areas */}
      {activeTab === 'crops' && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            {lang === 'hi' ? 'किसान भाइयों द्वारा सूचीबद्ध ताज़ा फसलें' : 'Active Farmer Produce Listings'}
          </h2>

          {loading ? (
            <div className="py-20 text-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
              <p className="text-xs text-stone-500">Loading crops...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {crops.map((crop) => (
                <div key={crop.id} className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl border-2 border-stone-200 hover:border-emerald-500 transition flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs uppercase font-black bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-300">
                          {crop.qualityGrade || 'Grade A Quality'}
                        </span>
                        <h3 className="text-lg font-black text-stone-900 mt-2">{crop.cropName}</h3>
                        <p className="text-xs text-stone-600 font-semibold">वैरायटी: {crop.variety}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-700">₹{crop.expectedPricePerQuintal}</span>
                        <span className="text-xs text-stone-500 font-bold block">/ क्विंटल (Quintal)</span>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-stone-50 rounded-2xl space-y-2 text-xs sm:text-sm text-stone-800 border border-stone-200">
                      <div className="flex justify-between">
                        <span className="text-stone-500 font-bold">मात्रा (Quantity):</span>
                        <span className="font-black text-stone-900">{crop.quantityQuintals} Quintals</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500 font-bold">स्थान (Location):</span>
                        <span className="font-bold text-stone-900">{crop.district || 'Lucknow Area'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500 font-bold">किसान (Farmer):</span>
                        <span className="font-bold text-emerald-800">{crop.farmerName || 'Verified Kisan'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                    {crop.contactPhone && (
                      <a href={`tel:${crop.contactPhone}`} className="text-xs sm:text-sm font-bold text-stone-700 flex items-center space-x-1 hover:text-stone-950">
                        <Phone className="w-4 h-4 text-emerald-600" />
                        <span>कॉल करें</span>
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setSelectedCrop(crop);
                        setOfferedPrice(crop.expectedPricePerQuintal);
                        setReqQty(crop.quantityQuintals);
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-black px-4 py-2 rounded-xl shadow transition"
                    >
                      {lang === 'hi' ? 'खरीद प्रस्ताव भेजें (Bid)' : 'Make Offer / Buy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'equipment' && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            {lang === 'hi' ? 'किराए पर उपलब्ध ट्रैक्टर व कृषि उपकरण' : 'Tractors & Farm Machinery Pool'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((eq) => (
              <div key={eq.id} className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl border-2 border-stone-200 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Tractor className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-stone-900">{eq.name}</h3>
                    <span className="text-xs text-stone-500 font-bold">{eq.villageOrTown || 'Lucknow Area'}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">{eq.description}</p>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-black text-emerald-700 text-base">₹{eq.costPerUnit} / {eq.costUnit}</span>
                  {eq.contactPhone && (
                    <a href={`tel:${eq.contactPhone}`} className="bg-stone-900 text-white px-4 py-2 rounded-xl font-bold flex items-center space-x-1 shadow">
                      <Phone className="w-4 h-4 text-amber-400" />
                      <span>Book Now</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'postCrop' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-stone-300 space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h2 className="text-2xl font-black text-stone-900">
              {lang === 'hi' ? 'अपनी फसल मंडी में दर्ज करें' : 'List Harvest Produce for Direct Sale'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              MANDI will match you directly with licensed grain traders and verified buyers.
            </p>
          </div>

          <form onSubmit={handlePostCrop} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-800 block mb-1">फसल का नाम (Crop Name):</label>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  required
                  className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-stone-800 block mb-1">किस्म / वैरायटी (Variety):</label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-800 block mb-1">मात्रा (Quintals):</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-stone-800 block mb-1">अपेक्षित मूल्य (₹/Quintal):</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">गाँव / ज़िला (Location):</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
                className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">अतिरिक्त विवरण (Notes):</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="e.g. Dry clean grain, immediate farm pickup available."
                rows={2}
                className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3.5 rounded-2xl shadow-xl transition text-base"
            >
              {isSubmitting ? 'Listing Produce...' : 'फसल बाज़ार में दर्ज करें (List Produce)'}
            </button>
          </form>
        </div>
      )}

      {/* Buyer Inquiry Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border-2 border-stone-300 text-xs sm:text-sm">
            <div className="flex items-center space-x-2 text-emerald-800 font-black text-base">
              <Send className="w-5 h-5" />
              <span>Make Purchase Offer to Farmer</span>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-1">
              <span className="font-black text-stone-900 block text-base">{selectedCrop.cropName} ({selectedCrop.variety})</span>
              <span className="text-stone-600 font-bold">Available: {selectedCrop.quantityQuintals} Quintals • Listed at ₹{selectedCrop.expectedPricePerQuintal}/Q</span>
            </div>

            <form onSubmit={handleSendInquiry} className="space-y-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Your Offered Price (₹/Quintal):</label>
                <input
                  type="number"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Required Quantity (Quintals):</label>
                <input
                  type="number"
                  value={reqQty}
                  onChange={(e) => setReqQty(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Message to Farmer:</label>
                <textarea
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  placeholder="e.g. Ready to lift from Malihabad farm gate within 2 days with cash on spot."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCrop(null)}
                  className="px-4 py-2 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInquiring}
                  className="bg-emerald-700 text-white font-black px-5 py-2 rounded-xl shadow"
                >
                  {isInquiring ? 'Sending...' : 'Send Offer to Farmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
