import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../../auth/UserAuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { userAgriApi, userProblemApi, userSchemeApi } from '../../../shared/api/userApi';
import LocationPicker from '../../../components/LocationPicker';
import {
  Sprout,
  PlusCircle,
  TrendingUp,
  Truck,
  Tractor,
  Users,
  Warehouse,
  CloudSun,
  FileSpreadsheet,
  AlertTriangle,
  ShoppingBag,
  CreditCard,
  PackageCheck,
  Compass,
  Siren,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  MessageSquare,
  DollarSign,
  Calendar,
  Layers,
  Search,
  Filter,
  Send,
  Loader2,
  X,
  Check,
  Building,
  RotateCcw
} from 'lucide-react';

export default function FarmerProducerDashboard() {
  const { user } = useUserAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  // Active Main Navigation Tab (All 18 features mapped logically into 5 seamless focus zones)
  const [activeTab, setActiveTab] = useState('bazaar'); // bazaar, services, orders, advisory, emergency
  const [distanceRadius, setDistanceRadius] = useState(25); // GPS Proximity slider (km)

  // Live Data States
  const [myCrops, setMyCrops] = useState([]);
  const [mandiRates, setMandiRates] = useState([]);
  const [demandBoard, setDemandBoard] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [agriServices, setAgriServices] = useState([]);
  const [storageFacilities, setStorageFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & Forms
  const [showPostCropModal, setShowPostCropModal] = useState(false);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [showMachineryModal, setShowMachineryModal] = useState(false);
  const [showLabourModal, setShowLabourModal] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [selectedDemandOrInquiry, setSelectedDemandOrInquiry] = useState(null);

  // Post Crop Form State
  const [cropForm, setCropForm] = useState({
    cropName: 'Sharbati Wheat (शरबती गेहूँ)',
    variety: 'HD-2967',
    quantityQuintals: '60',
    expectedPricePerQuintal: '2450',
    harvestDate: new Date().toISOString().split('T')[0],
    qualityGrade: 'Grade A',
    villageOrTown: 'Gharuan',
    district: 'Mohali',
    state: 'Punjab',
    description: 'Dry harvested organic wheat, 12% moisture level, stored in clean jute bags.',
    contactPhone: user?.phone || '9876543211'
  });

  // Transport Request Form
  const [transportForm, setTransportForm] = useState({
    cargoType: 'Wheat Produce (गेहूँ की बोरियां)',
    weightQuintals: '60',
    pickupVillage: 'Gharuan, Mohali',
    dropDestination: 'Khanna Grain Market',
    preferredVehicle: 'Tractor-Trolley (ट्रैक्टर ट्रॉली)',
    date: new Date().toISOString().split('T')[0],
    budget: '2500'
  });

  // Machinery Rental Form
  const [machineryForm, setMachineryForm] = useState({
    machineryType: 'Combine Harvester (कंबाइन हार्वेस्टर)',
    landAreaAcres: '5',
    date: new Date().toISOString().split('T')[0],
    village: 'Gharuan, Mohali',
    withOperator: true
  });

  // Labour Request Form
  const [labourForm, setLabourForm] = useState({
    workType: 'Crop Harvesting & Bagging (कटाई व बोरी भराई)',
    workersCount: '4',
    dailyWagePerWorker: '500',
    daysRequired: '2',
    date: new Date().toISOString().split('T')[0]
  });

  // Farm Problem Reporting Form
  const [problemForm, setProblemForm] = useState({
    category: 'AGRICULTURE',
    title: 'Damaged canal outlet / Tubewell transformer breakdown',
    description: 'Irrigation water flow stopped due to low voltage and damaged canal gate near field 4.',
    village: 'Gharuan',
    district: 'Mohali',
    urgency: 'HIGH'
  });

  // Emergency SOS Form
  const [emergencyForm, setEmergencyForm] = useState({
    emergencyType: 'PEST_ATTACK',
    description: 'Severe sudden yellow rust attack on standing wheat crop over 8 acres. Urgent spray guidance and bio-fungicide needed.',
    village: 'Gharuan, Mohali'
  });

  // Negotiation Counter Offer
  const [counterOffer, setCounterOffer] = useState({
    price: '',
    message: ''
  });

  const [actionSuccess, setActionSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all initial data
  const loadFarmerData = async () => {
    setLoading(true);
    try {
      const [cropsRes, ratesRes, demandRes, weatherRes, servicesRes, storageRes] = await Promise.allSettled([
        userAgriApi.getMyCrops(),
        userAgriApi.getMandiRates({ district: user?.district || 'Mohali' }),
        userAgriApi.getDemandBoard({ district: user?.district || 'Mohali' }),
        userAgriApi.getWeatherAdvisory({ district: user?.district || 'Mohali' }),
        userAgriApi.getNearbyAgriServices({ district: user?.district || 'Mohali' }),
        userAgriApi.getStorageFacilities({ district: user?.district || 'Mohali' })
      ]);

      if (cropsRes.status === 'fulfilled' && cropsRes.value?.data) {
        setMyCrops(cropsRes.value.data);
      }
      if (ratesRes.status === 'fulfilled' && ratesRes.value?.data) {
        setMandiRates(ratesRes.value.data);
      }
      if (demandRes.status === 'fulfilled' && demandRes.value?.data) {
        setDemandBoard(demandRes.value.data);
      }
      if (weatherRes.status === 'fulfilled' && weatherRes.value?.data) {
        setWeatherData(weatherRes.value.data);
      }
      if (servicesRes.status === 'fulfilled' && servicesRes.value?.data) {
        setAgriServices(servicesRes.value.data);
      }
      if (storageRes.status === 'fulfilled' && storageRes.value?.data) {
        setStorageFacilities(storageRes.value.data);
      }
    } catch (e) {
      console.warn('Farmer data load notice:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmerData();
  }, []);

  // Handlers
  const handlePostCropSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await userAgriApi.createCrop({
        ...cropForm,
        quantityQuintals: parseFloat(cropForm.quantityQuintals),
        expectedPricePerQuintal: parseFloat(cropForm.expectedPricePerQuintal)
      });
      setActionSuccess(lang === 'hi' ? '✅ फसल सफलतापूर्वक मंडी किसान बाज़ार में दर्ज हो गई!' : '✅ Crop listed successfully in Farmer Marketplace!');
      setShowPostCropModal(false);
      loadFarmerData();
    } catch (err) {
      alert(err.message || 'Failed to list crop');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmergencyBroadcast = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await userAgriApi.broadcastEmergency(emergencyForm);
      setActionSuccess(lang === 'hi' ? '🚨 आपातकालीन अलर्ट नजदीकी मंडी मित्र व स्वयंसेवकों को भेज दिया गया है!' : '🚨 Farm Emergency Alert Dispatched to Nearest Mitra & Response Team!');
      setShowEmergencyModal(false);
    } catch (err) {
      alert(err.message || 'Failed to broadcast emergency');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportProblem = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await userProblemApi.create({
        ...problemForm,
        requesterName: user?.fullName || 'Verified Farmer',
        requesterPhone: user?.phone || '9876543211',
        title: `[कृषि समस्या] ${problemForm.title}`,
        category: 'AGRICULTURE'
      });
      setActionSuccess(lang === 'hi' ? '✅ कृषि समस्या टिकट सफलतापूर्वक दर्ज हुआ। समाधान दल को प्रेषित किया गया।' : '✅ Farm issue ticket logged successfully and routed for resolution.');
      setShowProblemModal(false);
    } catch (err) {
      alert(err.message || 'Failed to submit problem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenericBooking = (type) => {
    setActionSuccess(lang === 'hi' ? `✅ ${type} अनुरोध दर्ज हो गया! नजदीकी सेवा प्रदाताओं को सूचना भेज दी गई है।` : `✅ ${type} Request logged! Notified nearby certified service providers.`);
    setShowTransportModal(false);
    setShowMachineryModal(false);
    setShowLabourModal(false);
  };

  // Mock Active Orders
  const mockOrders = [
    {
      id: 'ORD-892',
      crop: 'Sharbati Wheat (शरबती गेहूँ)',
      buyer: 'Punjab Agro Processors Ltd',
      qty: '50 Quintals',
      price: '₹2,450 / Qtl',
      totalAmount: '₹1,22,500',
      status: 'FARMER_ACCEPTED',
      paymentStatus: 'ESCROW_SECURED',
      transporter: 'Gurpreet Singh (Tractor-Trolley PB-65)',
      dispatchDate: 'Tomorrow, 09:00 AM'
    },
    {
      id: 'ORD-841',
      crop: 'Mustard (पीली सरसों)',
      buyer: 'National Oilseeds Federation',
      qty: '30 Quintals',
      price: '₹5,700 / Qtl',
      totalAmount: '₹1,71,000',
      status: 'COMPLETED',
      paymentStatus: 'PAID_DIRECT',
      transporter: 'Balwinder Carrier (Tata 407)',
      dispatchDate: 'Delivered (15 Aug 2026)'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-16">
      {/* 1. TOP COMPACT FARMER CONTROL STRIP */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          {/* Identity & Location */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-sm bg-[#0A3663] text-white flex items-center justify-center font-black text-xl shadow-2xs flex-shrink-0">
              🌾
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-extrabold text-[#0A3663] tracking-tight font-serif">
                  {user?.fullName || 'Balram Singh'}
                </h1>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-2xs uppercase tracking-wider">
                  🌾 Kisan Producer
                </span>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded-2xs flex items-center space-x-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />
                  <span>Verified</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-600 flex items-center space-x-1 mt-0.5 font-medium">
                <MapPin className="w-3 h-3 text-[#DC2626] flex-shrink-0" />
                <span>{user?.villageOrTown || 'Gharuan'}, {user?.district || 'Mohali'}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-mono text-[10px]">GPS: 30.7499° N, 76.6411° E</span>
              </p>
            </div>
          </div>

          {/* Center GPS Proximity Slider (Compact Mini) */}
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-2xs border border-slate-200 text-xs text-slate-700">
            <Compass className="w-3.5 h-3.5 text-[#0A3663] flex-shrink-0" />
            <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap">Radius:</span>
            <span className="font-mono font-bold text-[#DC2626] text-xs">
              {distanceRadius}km
            </span>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={distanceRadius}
              onChange={(e) => setDistanceRadius(parseInt(e.target.value))}
              className="w-24 sm:w-32 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#DC2626]"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
            {/* Feature 18: Emergency Help */}
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="flex items-center space-x-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white px-3 py-1.5 rounded-2xs text-xs font-extrabold shadow-2xs transition"
              id="btn-farmer-emergency-sos"
            >
              <Siren className="w-3.5 h-3.5 text-white" />
              <span>{lang === 'hi' ? '🚨 कृषि SOS' : '🚨 Farm SOS'}</span>
            </button>

            {/* Feature 1: Sell Crops */}
            <button
              onClick={() => setShowPostCropModal(true)}
              className="flex items-center space-x-1.5 bg-[#0A3663] hover:bg-[#072545] text-white px-3.5 py-1.5 rounded-2xs text-xs font-extrabold shadow-2xs transition"
              id="btn-farmer-sell-crop"
            >
              <PlusCircle className="w-3.5 h-3.5 text-white" />
              <span>{lang === 'hi' ? '🌾 उपज बेचें' : '🌾 List Crop'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-2xs flex items-center justify-between shadow-2xs text-xs">
            <div className="flex items-center space-x-3 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess('')} className="p-1 hover:bg-emerald-100 rounded-2xs">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. 5 DEDICATED FARMER FOCUS TABS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1 border-b border-slate-200">
          {[
            { id: 'bazaar', labelHi: '🌾 उपज बिक्री व मंडी भाव', labelEn: '🌾 Produce Sales & Mandi Rates', count: mandiRates.length },
            { id: 'services', labelHi: '🚜 ट्रैक्टर, ढुलाई व लेबर', labelEn: '🚜 Transport, Machinery & Labour' },
            { id: 'orders', labelHi: '📦 ऑर्डर व भुगतान', labelEn: '📦 Orders & Payments', count: mockOrders.length },
            { id: 'advisory', labelHi: '⛅ मौसम व योजनाएं', labelEn: '⛅ Weather, Schemes & Civic' },
            { id: 'storage', labelHi: '🏬 स्टोरेज व सेवाएं', labelEn: '🏬 Storage & Agro Directory', count: storageFacilities.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap rounded-t-2xs ${
                activeTab === tab.id
                  ? 'bg-[#DC2626] text-white font-extrabold shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{lang === 'hi' ? tab.labelHi : tab.labelEn}</span>
              {tab.count !== undefined && (
                <span className="bg-slate-100 text-slate-800 text-[10px] font-mono px-1.5 py-0.5 rounded-2xs border border-slate-200">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. TAB CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        {/* ========================================================================= */}
        {/* TAB 1: BAZAAR, SALES, LIVE MANDI RATES & BUYER DEMAND                    */}
        {/* ========================================================================= */}
        {activeTab === 'bazaar' && (
          <div className="space-y-8">
            {/* Top Row: Live Mandi Rates (Feature 3) & Crop Demand Board (Feature 4) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Feature 3: Get Fair Price (Live Mandi Market Rates) */}
              <div className="lg:col-span-7 bg-white rounded-sm p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <TrendingUp className="w-5 h-5 text-[#0A3663]" />
                    <div>
                      <h2 className="font-extrabold text-[#0A3663] text-base font-serif">
                        {lang === 'hi' ? '📊 आज के ताज़ा मंडी भाव (Live Mandi Market Rates)' : '📊 Live Mandi Market Prices'}
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'hi' ? 'निकटवर्ती एपीएमसी मंडियों के वास्तविक भाव व सरकारी एमएसपी' : 'Real-time APMC arrivals, modal rates & MSP'}
                      </p>
                    </div>
                  </div>
                  <span className="bg-red-50 text-[#DC2626] text-[10px] font-mono font-bold px-2.5 py-1 rounded-2xs border border-[#DC2626]">
                    ● Live Today
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#0A3663] text-white font-bold uppercase text-[10px]">
                        <th className="py-2.5 px-3">फसल (Crop)</th>
                        <th className="py-2.5 px-3">मंडी (Mandi Yard)</th>
                        <th className="py-2.5 px-3">मौजूदा भाव (Current)</th>
                        <th className="py-2.5 px-3">सरकारी MSP</th>
                        <th className="py-2.5 px-3 text-right">ट्रेंड (Trend)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                      {mandiRates.map((r, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50 hover:bg-slate-100'}>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-[#0A3663] block">🌾 {r.crop}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{r.variety}</span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 font-medium">{r.mandi}</td>
                          <td className="py-2.5 px-3 font-mono font-black text-[#DC2626] text-sm">
                            ₹{r.currentPrice} <span className="text-[10px] text-slate-500 font-normal">/qtl</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">
                            {r.msp > 0 ? `₹${r.msp}` : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className={`inline-block font-mono text-[11px] font-bold px-2 py-0.5 rounded-2xs ${
                              r.trendDirection === 'UP' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-red-50 text-[#DC2626] border border-red-300'
                            }`}>
                              {r.trendDirection === 'UP' ? '▲' : '▼'} {r.trend}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Feature 4: Crop Demand Board (Direct Buyer Demands) */}
              <div className="lg:col-span-5 bg-white rounded-sm p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center space-x-2">
                      <ShoppingBag className="w-5 h-5 text-[#0A3663]" />
                      <div>
                        <h2 className="font-extrabold text-[#0A3663] text-base font-serif">
                          {lang === 'hi' ? '📈 खरीदार मांग बोर्ड (Crop Demand)' : '📈 Crop Demand Board'}
                        </h2>
                        <p className="text-[11px] text-slate-500">
                          {lang === 'hi' ? 'मिलों व खरीदारों द्वारा तुरंत खरीद आवश्यकताएं' : 'Verified purchase requests from bulk buyers'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {demandBoard.map((d) => (
                      <div key={d.id} className="p-3.5 rounded-sm bg-slate-50 border border-slate-200 hover:border-[#0A3663] transition space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-bold text-slate-900 text-xs block">{d.buyerName}</span>
                            <span className="text-[10px] text-[#DC2626] font-bold uppercase">{d.cropRequired} • {d.quantityQuintals} Qtl Required</span>
                          </div>
                          <span className="font-mono font-bold text-[#0A3663] text-xs bg-blue-50 px-2 py-0.5 rounded-2xs border border-blue-200">
                            ₹{d.budgetPerQuintal}/Qtl
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          📍 Delivery: {d.deliveryLocation} • By {d.requiredByDate}
                        </p>
                        {/* Feature 5: Negotiate & Feature 6: Direct Selling */}
                        <div className="flex items-center space-x-2 pt-1">
                          <button
                            onClick={() => {
                              setSelectedDemandOrInquiry(d);
                              setShowNegotiationModal(true);
                            }}
                            className="flex-1 py-1.5 bg-[#0A3663] hover:bg-[#072545] text-white font-extrabold text-xs rounded-2xs transition flex items-center justify-center space-x-1 shadow-2xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{lang === 'hi' ? '💬 बात करें व बेचें' : '💬 Negotiate & Sell'}</span>
                          </button>
                          <a
                            href={`tel:${d.contactPhone}`}
                            className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-2xs border border-slate-300 transition"
                            title="Direct Call"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-2xs border border-amber-200 text-[11px] text-amber-900 flex items-center justify-between font-medium">
                  <span>💡 Direct Farm Gate Selling saves ~8% middleman commission.</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Feature 1 & 6: My Listed Crops & Direct Marketplace */}
            <div className="bg-white rounded-md p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
                <div className="flex items-center space-x-2.5">
                  <Sprout className="w-5 h-5 text-[#0A3663]" />
                  <div>
                    <h2 className="font-extrabold text-[#0A3663] text-base font-serif">
                      {lang === 'hi' ? '🌾 मेरी लिस्टेड फसलें (My Active Crop Listings)' : '🌾 My Active Crop Listings'}
                    </h2>
                    <p className="text-xs text-slate-600">
                      {lang === 'hi' ? 'सीधे खरीदारों तक पहुंच • कोई बिचौलिया नहीं' : 'Direct farm gate listings visible to 500+ verified buyers'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPostCropModal(true)}
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-3.5 py-1.5 rounded-2xs font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'नई फसल जोड़ें' : 'Add New Crop'}</span>
                </button>
              </div>

              {myCrops.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Sprout className="w-12 h-12 text-slate-400 mx-auto" />
                  <p className="text-slate-600 text-xs">
                    {lang === 'hi' ? 'वर्तमान में कोई फसल लिस्टेड नहीं है। अपनी उपज बेचने के लिए ऊपर "अपनी उपज बेचें" पर क्लिक करें।' : 'No active crop listings found. Click "List Crop For Sale" to post.'}
                  </p>
                  <button
                    onClick={() => setShowPostCropModal(true)}
                    className="bg-[#0A3663] text-white px-4 py-2 rounded-2xs text-xs font-bold shadow-2xs hover:bg-[#072545]"
                  >
                    + {lang === 'hi' ? 'फसल लिस्टिंग बनाएं' : 'Create First Listing'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myCrops.map((c) => (
                    <div key={c.id} className="p-4 bg-slate-50 rounded-2xs border border-slate-200 hover:border-[#0A3663] transition space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-extrabold text-[#0A3663] text-sm">{c.cropName}</h4>
                          <span className="text-[11px] text-slate-600 font-mono">Variety: {c.variety}</span>
                        </div>
                        <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-2xs border border-emerald-300">
                          {c.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-2xs border border-slate-200">
                        <div>
                          <span className="text-[10px] text-slate-500 block">कुल मात्रा (Quantity)</span>
                          <span className="font-bold text-slate-900 font-mono">{c.quantityQuintals} Quintals</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">अपेक्षित भाव (Price)</span>
                          <span className="font-bold text-[#DC2626] font-mono">₹{c.expectedPricePerQuintal} /Qtl</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-stone-400 line-clamp-2">
                        {c.description || 'Farm-fresh quality produce ready for inspection.'}
                      </p>

                      <div className="flex items-center justify-between text-[11px] pt-1 text-stone-300">
                        <span>📍 {c.district || 'Mohali'}</span>
                        {/* Feature 7 Linkage: Request Transport for this crop */}
                        <button
                          onClick={() => {
                            setTransportForm((prev) => ({
                              ...prev,
                              cargoType: `${c.cropName} (${c.quantityQuintals} Qtl)`,
                              weightQuintals: String(c.quantityQuintals)
                            }));
                            setShowTransportModal(true);
                          }}
                          className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Book Transport ↗</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FARM SERVICES & LOGISTICS (TRACTOR, TRANSPORT & LABOUR)           */}
        {/* ========================================================================= */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 7: Transportation Request Card */}
              <div className="bg-white rounded-md p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xs bg-amber-100 text-amber-800 flex items-center justify-center font-black text-2xl border border-amber-200">
                    🚚
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0A3663]">
                      {lang === 'hi' ? 'फसल ढुलाई वाहन (Crop Transportation)' : 'Crop Transportation'}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      {lang === 'hi' ? 'खेत से मंडी या खरीदार तक फसल पहुंचाने के लिए नजदीकी ट्रैक्टर ट्रॉली या पिकअप बुक करें।' : 'Hire verified nearby tractor-trolleys, pickups & carriers with collision-free slot locks.'}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xs border border-slate-200 space-y-1 text-xs text-slate-700">
                    <p className="flex items-center justify-between">
                      <span>Available Carriers in {distanceRadius}km:</span>
                      <span className="font-mono font-bold text-emerald-700">8 Verified</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Average Freight Rate:</span>
                      <span className="font-mono text-amber-800 font-bold">₹35 - ₹50 /km</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTransportModal(true)}
                  className="w-full py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-2xs text-xs shadow-2xs transition"
                >
                  + {lang === 'hi' ? 'ढुलाई वाहन बुक करें' : 'Book Transport Vehicle'}
                </button>
              </div>

              {/* Feature 8: Tractor & Farm Machinery Rental Pool */}
              <div className="bg-white rounded-md p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xs bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-2xl border border-emerald-200">
                    🚜
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0A3663]">
                      {lang === 'hi' ? 'ट्रैक्टर व कृषि यंत्र (Tractor & Machinery)' : 'Tractor & Machinery'}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      {lang === 'hi' ? 'जुताई (Ploughing), कंबाइन कटाई, रोटावेटर, व लेजर लेवलर रेंटल पूल।' : 'Book heavy agri machinery with experienced operators on hourly or per-acre basis.'}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xs border border-slate-200 space-y-1 text-xs text-slate-700">
                    <p className="flex items-center justify-between">
                      <span>Available Machines Nearby:</span>
                      <span className="font-mono font-bold text-emerald-700">14 Units</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Harvester Rate:</span>
                      <span className="font-mono text-amber-800 font-bold">₹1,800 - ₹2,200 /acre</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMachineryModal(true)}
                  className="w-full py-2.5 bg-[#0A3663] hover:bg-[#072545] text-white font-bold rounded-2xs text-xs shadow-2xs transition"
                >
                  + {lang === 'hi' ? 'ट्रैक्टर / कंबाइन बुक करें' : 'Book Tractor / Harvester'}
                </button>
              </div>

              {/* Feature 9: Farm Labour Request System */}
              <div className="bg-white rounded-md p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xs bg-blue-100 text-blue-800 flex items-center justify-center font-black text-2xl border border-blue-200">
                    👥
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0A3663]">
                      {lang === 'hi' ? 'कृषि श्रमिक मांग (Farm Labour Request)' : 'Farm Labour Request'}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      {lang === 'hi' ? 'फसल कटाई, बोआई, निराई व बोरी लदान के लिए दैनिक दिहाड़ी मजदूर समूह बुलाएं।' : 'Request skilled farm workers for harvesting, planting, weeding & loading with fair wage transparency.'}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xs border border-slate-200 space-y-1 text-xs text-slate-700">
                    <p className="flex items-center justify-between">
                      <span>Worker Groups in Village:</span>
                      <span className="font-mono font-bold text-emerald-700">6 Available</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Standard Daily Wage:</span>
                      <span className="font-mono text-amber-800 font-bold">₹450 - ₹550 /day</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLabourModal(true)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xs text-xs shadow-2xs transition"
                >
                  + {lang === 'hi' ? 'श्रमिक समूह मांगें' : 'Request Labour Group'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ORDERS & PAYMENT TRACKING (FEATURES 15 & 16)                      */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-md p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2.5">
                  <PackageCheck className="w-5 h-5 text-[#0A3663]" />
                  <div>
                    <h2 className="font-extrabold text-[#0A3663] text-base font-serif">
                      {lang === 'hi' ? '📦 फसल ऑर्डर एवं भुगतान ट्रैकिंग (Order & Payment Lifecycle)' : '📦 Crop Orders & Payment Tracking'}
                    </h2>
                    <p className="text-xs text-slate-600">
                      {lang === 'hi' ? 'फसल अनुरोध से लेकर खेत से उठान और एस्क्रो भुगतान तक की लाइव स्थिति' : 'End-to-end milestone tracking from purchase order to bank settlement'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {mockOrders.map((ord) => (
                  <div key={ord.id} className="p-5 bg-slate-50 rounded-md border border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-[#DC2626] text-sm">{ord.id}</span>
                          <span className="text-slate-900 font-bold text-sm">• {ord.crop}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Buyer: <span className="text-slate-900 font-semibold">{ord.buyer}</span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-2xs border ${
                          ord.paymentStatus === 'ESCROW_SECURED'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}>
                          💳 {ord.paymentStatus === 'ESCROW_SECURED' ? '₹ Escrow Payment Locked' : '✅ Paid to Bank'}
                        </span>
                        <span className="bg-[#0A3663] text-white font-mono font-bold text-xs px-2.5 py-1 rounded-2xs">
                          {ord.totalAmount}
                        </span>
                      </div>
                    </div>

                    {/* Step-by-Step Progress Tracker */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-2xs bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold">
                        ✓ 1. Order Accepted
                      </div>
                      <div className={`p-2.5 rounded-2xs border font-bold ${
                        ord.status === 'FARMER_ACCEPTED' ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-emerald-100 border-emerald-300 text-emerald-900'
                      }`}>
                        {ord.status === 'FARMER_ACCEPTED' ? '⏳ 2. Packing / Staging' : '✓ 2. Packed & Ready'}
                      </div>
                      <div className={`p-2.5 rounded-2xs border font-bold ${
                        ord.status === 'COMPLETED' ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-white border-slate-300 text-slate-700'
                      }`}>
                        {ord.status === 'COMPLETED' ? '✓ 3. Transport Delivered' : '🚚 3. Transport Pickup'}
                      </div>
                      <div className={`p-2.5 rounded-2xs border font-bold ${
                        ord.paymentStatus === 'PAID_DIRECT' ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-white border-slate-300 text-slate-700'
                      }`}>
                        {ord.paymentStatus === 'PAID_DIRECT' ? '✓ 4. Payment Settled' : '💳 4. Final Settlement'}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-xs text-slate-700 bg-white p-3 rounded-2xs border border-slate-200 gap-2">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-[#0A3663]" />
                        <span>Transporter: <span className="text-slate-900 font-semibold">{ord.transporter}</span></span>
                      </div>
                      <span className="font-mono text-slate-600">{ord.dispatchDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: WEATHER, GOVT SCHEMES & REPORT PROBLEMS                           */}
        {/* ========================================================================= */}
        {activeTab === 'advisory' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Feature 11: Weather Information & Real-time Agro Advisory */}
              <div className="lg:col-span-6 bg-white rounded-md p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <CloudSun className="w-5 h-5 text-amber-600" />
                    <div>
                      <h2 className="font-extrabold text-[#0A3663] text-base font-serif">
                        {lang === 'hi' ? '⛅ 5-दिवसीय मौसम एवं कृषि सलाह' : '⛅ 5-Day Weather & Agro Advisory'}
                      </h2>
                      <p className="text-xs text-slate-600">
                        {weatherData?.location || 'Mohali, Punjab'} • Accurate Local Agro-Forecast
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-extrabold text-lg text-amber-700">
                    {weatherData?.temperatureC || 29.5}°C
                  </span>
                </div>

                {/* Weather Advisory Banner */}
                <div className="p-4 rounded-2xs bg-blue-50 border border-blue-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-[#0A3663] uppercase tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#0A3663]" />
                    <span>{lang === 'hi' ? 'विशेष कृषि सलाह (Crop Advisory)' : 'Tailored Crop Advisory'}</span>
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {lang === 'hi' ? weatherData?.advisoryHi : weatherData?.advisoryEn}
                  </p>
                </div>

                {/* 5-day Forecast Grid */}
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {(weatherData?.forecast || []).map((f, idx) => (
                    <div key={idx} className="p-2.5 rounded-2xs bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-600 font-bold block">{f.day}</span>
                      <span className="text-xl block">{f.icon}</span>
                      <span className="text-[10px] font-mono text-slate-900 font-bold block">{f.temp}</span>
                      <span className="text-[9px] font-mono text-blue-700 block">💧 {f.rain}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature 13: Report Problems (Irrigation, Road, Transformer, Mandi) */}
              <div className="lg:col-span-6 bg-white rounded-md p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2.5 border-b border-slate-200 pb-3">
                    <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
                    <div>
                      <h2 className="font-extrabold text-[#0A3663] text-base font-serif">
                        {lang === 'hi' ? '⚡ खेत / मंडी की समस्या दर्ज करें' : '⚡ Report Farm / Mandi Issue'}
                      </h2>
                      <p className="text-xs text-slate-600">
                        {lang === 'hi' ? 'ट्यूबवेल ट्रांसफार्मर, नहर पानी, संपर्क मार्ग, मंडी गेट जाम' : 'Direct civic grievance escalation to Discom, Irrigation Dept & Mandi Board'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-2xs bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-800 font-medium">⚡ Burnt Transformer / Voltage Low</span>
                      <span className="font-mono text-amber-800 font-bold">48h SLA</span>
                    </div>
                    <div className="p-3 rounded-2xs bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-800 font-medium">🌊 Canal Water Tail-End Shortage</span>
                      <span className="font-mono text-blue-800 font-bold">24h SLA</span>
                    </div>
                    <div className="p-3 rounded-2xs bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-800 font-medium">🚛 Mandi Gate Weighbridge Delay</span>
                      <span className="font-mono text-emerald-800 font-bold">Same Day</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowProblemModal(true)}
                  className="w-full py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-2xs text-xs shadow-2xs transition"
                >
                  + {lang === 'hi' ? 'नई समस्या दर्ज करें' : 'Report Farm / Mandi Problem'}
                </button>
              </div>
            </div>

            {/* Feature 12: Government Schemes & Subsidies */}
            <div className="bg-white rounded-md p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2.5">
                  <FileSpreadsheet className="w-5 h-5 text-[#0A3663]" />
                  <div>
                    <h2 className="font-extrabold text-[#0A3663] text-base font-serif">
                      {lang === 'hi' ? '🏛️ किसान कल्याणकारी सरकारी योजनाएं व सब्सिडी' : '🏛️ Government Farmer Welfare Schemes & Subsidies'}
                    </h2>
                    <p className="text-xs text-slate-600">
                      {lang === 'hi' ? 'सीधे आवेदन, पात्रता व डीबीटी सहायता पोर्टल' : 'Explore subsidies, PM-Kisan DBT & crop insurance'}
                    </p>
                  </div>
                </div>
                <Link
                  to="/user/schemes"
                  className="text-[#DC2626] hover:underline text-xs font-bold"
                >
                  View All Schemes ↗
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'PM-Kisan Samman Nidhi',
                    benefit: '₹6,000 / Year (3 Installments)',
                    desc: 'Direct DBT transfer into bank account for landholding farmer families.',
                    link: 'https://pmkisan.gov.in'
                  },
                  {
                    title: 'PM Fasal Bima Yojana (PMFBY)',
                    benefit: 'Comprehensive Crop Loss Insurance',
                    desc: 'Protection against drought, flood, pests, and unseasonal hail.',
                    link: 'https://pmfby.gov.in'
                  },
                  {
                    title: 'PM-KUSUM Solar Pump Subsidy',
                    benefit: 'Up to 60% Govt Subsidy on Solar Pumps',
                    desc: 'Install off-grid solar irrigation pumps to eliminate diesel costs.',
                    link: 'https://pmkusum.mnre.gov.in'
                  }
                ].map((s, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xs border border-slate-200 space-y-2 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-[#0A3663] text-xs">{s.title}</h4>
                      <span className="font-mono text-emerald-800 text-xs font-bold block mt-1">{s.benefit}</span>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-3 text-center py-1.5 bg-white hover:bg-slate-100 text-[#0A3663] font-bold text-xs rounded-2xs border border-slate-300 transition"
                    >
                      Apply on Official Portal ↗
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: STORAGE FACILITIES & NEARBY AGRI SERVICES                          */}
        {/* ========================================================================= */}
        {activeTab === 'storage' && (
          <div className="space-y-6">
            {/* Feature 10: Warehouses & Cold Storage */}
            <div className="bg-white rounded-md p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2.5">
                  <Warehouse className="w-5 h-5 text-amber-700" />
                  <div>
                    <h2 className="font-extrabold text-[#0A3663] text-base font-serif">
                      {lang === 'hi' ? '🏬 नजदीकी गोदाम व कोल्ड स्टोरेज (Storage Facilities)' : '🏬 Warehouses & Cold Storage Facilities'}
                    </h2>
                    <p className="text-xs text-slate-600">
                      {lang === 'hi' ? 'उपज सुरक्षित रखने हेतु क्षमता, तापमान व किराया विवरण' : 'Available capacity, monthly storage charges & GPS distance'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {storageFacilities.map((st) => (
                  <div key={st.id} className="p-4 bg-slate-50 rounded-2xs border border-slate-200 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-extrabold text-[#0A3663] text-xs">{st.name}</h4>
                          <span className="text-[10px] text-amber-800 font-bold">{st.facilityType}</span>
                        </div>
                        <span className="bg-white font-mono text-[10px] text-emerald-800 px-2 py-0.5 rounded-2xs border border-slate-200 font-bold">
                          {st.distanceKm} km
                        </span>
                      </div>

                      <div className="bg-white p-2.5 rounded-2xs border border-slate-200 text-xs space-y-1 font-mono">
                        <div className="flex justify-between text-slate-700">
                          <span>Available:</span>
                          <span className="font-bold text-slate-900">{st.availableCapacityMT} MT</span>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span>Rate:</span>
                          <span className="text-emerald-800 font-bold">₹{st.ratePerQuintalMonth} /qtl/mo</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600">
                        📍 {st.location} • {st.temperatureRange}
                      </p>
                    </div>

                    <a
                      href={`tel:${st.contactPhone}`}
                      className="w-full py-2 bg-white hover:bg-slate-100 text-[#0A3663] font-bold text-xs rounded-2xs flex items-center justify-center space-x-1.5 transition border border-slate-300"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#0A3663]" />
                      <span>{lang === 'hi' ? 'कॉल करें व स्थान बुक करें' : 'Call & Reserve Slot'}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 14: Nearby Agri-Services Directory */}
            <div className="bg-white rounded-md p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2.5">
                  <Building className="w-5 h-5 text-[#0A3663]" />
                  <div>
                    <h2 className="font-extrabold text-[#0A3663] text-base font-serif">
                      {lang === 'hi' ? '🏪 नजदीकी खाद, बीज, कीटनाशक व रिपेयर दुकानें' : '🏪 Nearby Fertilizer, Seeds & Repair Directory'}
                    </h2>
                    <p className="text-xs text-slate-600">
                      {lang === 'hi' ? 'प्रमाणित डीलर्स, मृदा परीक्षण केंद्र व ट्रैक्टर वर्कशॉप' : 'Certified input dealers & farm workshops within radius'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agriServices.map((srv) => (
                  <div key={srv.id} className="p-4 bg-slate-50 rounded-2xs border border-slate-200 flex items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-extrabold text-[#0A3663] text-xs truncate">{srv.name}</h4>
                        <span className="text-[9px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-mono font-bold">
                          ⭐ {srv.rating}
                        </span>
                      </div>
                      <span className="text-xs text-amber-800 font-bold block truncate">{srv.category}</span>
                      <p className="text-xs text-slate-600 truncate">📍 {srv.address}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{srv.services}</p>
                    </div>

                    <a
                      href={`tel:${srv.contactPhone}`}
                      className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-lg transition flex-shrink-0"
                      title="Direct Call"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. MODALS FOR ALL ESSENTIAL FARMER WORKFLOWS                               */}
      {/* ========================================================================= */}

      {/* MODAL 1: POST CROP LISTING (Feature 1) */}
      {showPostCropModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-sm max-w-xl w-full p-6 space-y-4 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Sprout className="w-5 h-5 text-[#0A3663]" />
                <h3 className="font-extrabold text-lg text-[#0A3663] font-serif">
                  {lang === 'hi' ? '🌾 अपनी उपज किसान बाज़ार में लिस्ट करें' : '🌾 List Crop Produce For Direct Sale'}
                </h3>
              </div>
              <button onClick={() => setShowPostCropModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostCropSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">फसल का नाम (Crop Name)</label>
                  <input
                    type="text"
                    required
                    value={cropForm.cropName}
                    onChange={(e) => setCropForm({ ...cropForm, cropName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-[#0A3663] outline-none"
                    placeholder="e.g. Sharbati Wheat, Mustard"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">किस्म / वैरायटी (Variety)</label>
                  <input
                    type="text"
                    required
                    value={cropForm.variety}
                    onChange={(e) => setCropForm({ ...cropForm, variety: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-[#0A3663] outline-none"
                    placeholder="e.g. HD-2967, Pusa 1121"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">मात्रा (Quintals)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={cropForm.quantityQuintals}
                    onChange={(e) => setCropForm({ ...cropForm, quantityQuintals: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900 font-mono font-bold focus:ring-2 focus:ring-[#0A3663] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">अपेक्षित मूल्य (₹/Quintal)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={cropForm.expectedPricePerQuintal}
                    onChange={(e) => setCropForm({ ...cropForm, expectedPricePerQuintal: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900 font-mono font-bold focus:ring-2 focus:ring-[#0A3663] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">गाँव / स्थान (Village)</label>
                  <input
                    type="text"
                    required
                    value={cropForm.villageOrTown}
                    onChange={(e) => setCropForm({ ...cropForm, villageOrTown: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">संपर्क मोबाइल (Phone)</label>
                  <input
                    type="text"
                    required
                    value={cropForm.contactPhone}
                    onChange={(e) => setCropForm({ ...cropForm, contactPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">फसल विवरण (Produce Description)</label>
                <textarea
                  rows="2"
                  value={cropForm.description}
                  onChange={(e) => setCropForm({ ...cropForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900 text-xs outline-none"
                  placeholder="Mention moisture percentage, bag packaging, storage condition..."
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowPostCropModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-2xs hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-2xs shadow-2xs flex items-center space-x-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{lang === 'hi' ? 'उपज प्रकाशित करें' : 'Publish Listing'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TRANSPORTATION REQUEST (Feature 7) */}
      {showTransportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 rounded-sm max-w-lg w-full p-6 space-y-4 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-[#0A3663]" />
                <h3 className="font-extrabold text-lg text-[#0A3663] font-serif">
                  {lang === 'hi' ? '🚚 फसल ढुलाई वाहन अनुरोध' : '🚚 Request Crop Transport'}
                </h3>
              </div>
              <button onClick={() => setShowTransportModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">फसल / भार (Cargo & Weight)</label>
                <input
                  type="text"
                  value={transportForm.cargoType}
                  onChange={(e) => setTransportForm({ ...transportForm, cargoType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">खेत उठाव (Pickup)</label>
                  <input
                    type="text"
                    value={transportForm.pickupVillage}
                    onChange={(e) => setTransportForm({ ...transportForm, pickupVillage: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">गंतव्य मंडी (Drop Location)</label>
                  <input
                    type="text"
                    value={transportForm.dropDestination}
                    onChange={(e) => setTransportForm({ ...transportForm, dropDestination: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">वाहन प्रकार (Vehicle)</label>
                  <select
                    value={transportForm.preferredVehicle}
                    onChange={(e) => setTransportForm({ ...transportForm, preferredVehicle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900"
                  >
                    <option>Tractor-Trolley (ट्रैक्टर ट्रॉली)</option>
                    <option>Tata Ace / Chota Hathi (छोटा हाथी)</option>
                    <option>Pickup 407 (पिकअप)</option>
                    <option>Heavy Carrier (10 Wheeler)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">प्रस्तावित भाड़ा (Budget ₹)</label>
                  <input
                    type="number"
                    value={transportForm.budget}
                    onChange={(e) => setTransportForm({ ...transportForm, budget: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowTransportModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-2xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleGenericBooking('ढुलाई वाहन')}
                className="px-5 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-2xs shadow-2xs"
              >
                Broadcast to Transporters ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: MACHINERY RENTAL (Feature 8) */}
      {showMachineryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 rounded-sm max-w-lg w-full p-6 space-y-4 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Tractor className="w-5 h-5 text-[#0A3663]" />
                <h3 className="font-extrabold text-lg text-[#0A3663] font-serif">
                  {lang === 'hi' ? '🚜 ट्रैक्टर व कृषि यंत्र बुकिंग' : '🚜 Book Tractor / Harvester'}
                </h3>
              </div>
              <button onClick={() => setShowMachineryModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">यंत्र का प्रकार (Machinery Type)</label>
                <select
                  value={machineryForm.machineryType}
                  onChange={(e) => setMachineryForm({ ...machineryForm, machineryType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900"
                >
                  <option>Combine Harvester (कंबाइन हार्वेस्टर - गेहूं/धान कटाई)</option>
                  <option>55HP Tractor with 4-Bottom Plough (गहरी जुताई)</option>
                  <option>Rotavator 7-Feet (रोटावेटर मिट्टी तैयारी)</option>
                  <option>Laser Land Leveller (लेजर लेवलर)</option>
                  <option>Super Seeder / Zero-Till Drill (सीड ड्रिल)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">खेत का क्षेत्रफल (Acres)</label>
                  <input
                    type="number"
                    value={machineryForm.landAreaAcres}
                    onChange={(e) => setMachineryForm({ ...machineryForm, landAreaAcres: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">आवश्यक तारीख (Date)</label>
                  <input
                    type="date"
                    value={machineryForm.date}
                    onChange={(e) => setMachineryForm({ ...machineryForm, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowMachineryModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-2xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleGenericBooking('कृषि यंत्र')}
                className="px-5 py-2 bg-[#0A3663] hover:bg-[#072545] text-white font-bold rounded-2xs shadow-2xs"
              >
                Send Booking Request ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: LABOUR REQUEST (Feature 9) */}
      {showLabourModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 rounded-sm max-w-lg w-full p-6 space-y-4 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#0A3663]" />
                <h3 className="font-extrabold text-lg text-[#0A3663] font-serif">
                  {lang === 'hi' ? '👥 कृषि श्रमिक समूह मांग' : '👥 Request Farm Labour'}
                </h3>
              </div>
              <button onClick={() => setShowLabourModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">कार्य का प्रकार (Work Type)</label>
                <input
                  type="text"
                  value={labourForm.workType}
                  onChange={(e) => setLabourForm({ ...labourForm, workType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">मजदूरों की संख्या (Count)</label>
                  <input
                    type="number"
                    value={labourForm.workersCount}
                    onChange={(e) => setLabourForm({ ...labourForm, workersCount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">दैनिक दिहाड़ी (₹/Day/Worker)</label>
                  <input
                    type="number"
                    value={labourForm.dailyWagePerWorker}
                    onChange={(e) => setLabourForm({ ...labourForm, dailyWagePerWorker: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowLabourModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-2xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleGenericBooking('कृषि श्रमिक')}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xs shadow-2xs"
              >
                Broadcast Labour Request ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: REPORT FARM ISSUE (Feature 13) */}
      {showProblemModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 rounded-sm max-w-lg w-full p-6 space-y-4 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
                <h3 className="font-extrabold text-lg text-[#0A3663] font-serif">
                  {lang === 'hi' ? '⚡ खेत / मंडी की समस्या दर्ज करें' : '⚡ Report Farm / Civic Issue'}
                </h3>
              </div>
              <button onClick={() => setShowProblemModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportProblem} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">समस्या का शीर्षक (Title)</label>
                <input
                  type="text"
                  required
                  value={problemForm.title}
                  onChange={(e) => setProblemForm({ ...problemForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">विस्तृत विवरण (Description)</label>
                <textarea
                  rows="3"
                  required
                  value={problemForm.description}
                  onChange={(e) => setProblemForm({ ...problemForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900 text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowProblemModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-2xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-2xs shadow-2xs"
                >
                  {isSubmitting ? 'Logging Ticket...' : 'Submit Grievance ↗'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: EMERGENCY SOS BROADCAST (Feature 18) */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-[#DC2626] rounded-sm max-w-lg w-full p-6 space-y-4 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-red-200 pb-3">
              <div className="flex items-center space-x-2">
                <Siren className="w-6 h-6 text-[#DC2626]" />
                <h3 className="font-extrabold text-lg text-[#0A3663] font-serif">
                  {lang === 'hi' ? '🚨 आपातकालीन कृषि सहायता (SOS Broadcast)' : '🚨 Urgent Farm Emergency SOS'}
                </h3>
              </div>
              <button onClick={() => setShowEmergencyModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEmergencyBroadcast} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#DC2626] font-bold mb-1 uppercase tracking-wider">
                  आपातकालीन प्रकार (Emergency Category)
                </label>
                <select
                  value={emergencyForm.emergencyType}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, emergencyType: e.target.value })}
                  className="w-full bg-slate-50 border border-[#DC2626] rounded-2xs px-3 py-2 text-slate-900 font-bold"
                >
                  <option value="PEST_ATTACK">🐛 Sudden Severe Pest Attack (कीट प्रकोप)</option>
                  <option value="CROP_FIRE">🔥 Standing Crop / Field Fire (खेत में आग)</option>
                  <option value="HARVEST_BREAKDOWN">🚜 Machine Breakdown During Rain Window</option>
                  <option value="WATER_CRISIS">🌊 Total Canal / Tubewell Breach</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">स्थिति का विवरण (Urgent Situation)</label>
                <textarea
                  rows="3"
                  required
                  value={emergencyForm.description}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900 text-xs outline-none"
                />
              </div>

              <div className="p-3 bg-red-50 rounded-2xs border border-red-200 text-[11px] text-[#DC2626] font-semibold">
                🚨 This will immediately trigger SMS/Push notifications to the nearest <strong>MANDI Village Mitra</strong>, Panchayat Secretary, and local community volunteers.
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowEmergencyModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-2xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-2xs shadow-2xs flex items-center space-x-2"
                >
                  <Siren className="w-4 h-4 text-white" />
                  <span>{lang === 'hi' ? '🚨 आपातकालीन अलर्ट भेजें' : 'DISPATCH SOS NOW'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: NEGOTIATE PRICE & DIRECT CHAT (Feature 5) */}
      {showNegotiationModal && selectedDemandOrInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 rounded-sm max-w-md w-full p-6 space-y-4 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-[#0A3663]" />
                <h3 className="font-extrabold text-base text-[#0A3663] font-serif">
                  {lang === 'hi' ? '💬 खरीदार से मूलभाव व चैट' : '💬 Negotiate with Buyer'}
                </h3>
              </div>
              <button onClick={() => setShowNegotiationModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xs border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 block">Buyer: {selectedDemandOrInquiry.buyerName}</span>
                <span className="font-bold text-[#0A3663] text-sm block">{selectedDemandOrInquiry.cropRequired}</span>
                <span className="text-emerald-800 font-mono font-bold">Buyer Offered: ₹{selectedDemandOrInquiry.budgetPerQuintal} /Qtl</span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">आपका प्रति-प्रस्ताव (Your Counter Price ₹/Qtl)</label>
                <input
                  type="number"
                  placeholder="e.g. 2520"
                  value={counterOffer.price}
                  onChange={(e) => setCounterOffer({ ...counterOffer, price: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">संदेश (Message / Delivery Terms)</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Farm gate pickup ready in 48 hours with 12% moisture certificate."
                  value={counterOffer.message}
                  onChange={(e) => setCounterOffer({ ...counterOffer, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xs px-3 py-2 text-slate-900 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowNegotiationModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-2xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setActionSuccess(lang === 'hi' ? '✅ प्रति-प्रस्ताव खरीदार को भेज दिया गया है!' : '✅ Counter-offer sent directly to buyer!');
                  setShowNegotiationModal(false);
                }}
                className="px-5 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-2xs shadow-2xs"
              >
                Send Offer ↗
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
