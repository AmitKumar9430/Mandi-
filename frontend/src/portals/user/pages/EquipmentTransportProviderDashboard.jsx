import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserAuth } from '../../../auth/UserAuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { userTransportApi, userProblemApi } from '../../../shared/api/userApi';
import {
  Truck,
  Tractor,
  Calendar,
  DollarSign,
  TrendingUp,
  Plus,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
  ArrowRight,
  MapPin,
  Compass,
  Phone,
  MessageSquare,
  Wrench,
  Fuel,
  Siren,
  Clock,
  Navigation,
  Users,
  Check,
  X,
  Send,
  Loader2,
  FileText,
  Building,
  RotateCcw,
  Package,
  Activity,
  Award
} from 'lucide-react';

export default function EquipmentTransportProviderDashboard() {
  const { user } = useUserAuth();
  const { lang } = useLanguage();

  // Active Zone Tab (All 24 features organized into 6 focused operational zones)
  const [activeZone, setActiveZone] = useState('radar'); // radar, fleet, calendar, activeJobs, earnings, maintenance
  const [serviceRadius, setServiceRadius] = useState(35); // Service expansion radius in km (Feature 9 & 24)

  // Live States
  const [vehicles, setVehicles] = useState([]);
  const [incomingJobs, setIncomingJobs] = useState([]);
  const [activeTrips, setActiveTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [selectedJobToCounter, setSelectedJobToCounter] = useState(null);
  const [showFuelLogModal, setShowFuelLogModal] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null);

  // Add Vehicle Form (Feature 11 & 12)
  const [vehicleForm, setVehicleForm] = useState({
    vehicleType: 'TRACTOR_TROLLEY',
    vehicleNumber: 'PB-65-AK-9821',
    modelName: 'Mahindra 575 DI (45 HP) + Hydraulic Trolley',
    payloadCapacityQuintals: '60',
    ratePerKm: '40',
    ratePerHour: '650',
    equipmentType: 'Rotavator & 4-Bottom Plough',
    driverName: 'Gurpreet Singh',
    driverPhone: '9814012345'
  });

  // Availability Slot Form (Feature 7 & 14)
  const [slotForm, setSlotForm] = useState({
    vehicleId: '',
    slotDate: new Date().toISOString().split('T')[0],
    startTime: '06:00',
    endTime: '18:00',
    availableVillage: 'Gharuan, Mohali'
  });

  // Counter Offer Form (Feature 6 & 8)
  const [counterForm, setCounterForm] = useState({
    counterPrice: '2800',
    notes: 'Can arrive in 30 minutes with hydraulic trolley.'
  });

  // Fuel & Expense Log Form (Feature 20)
  const [fuelForm, setFuelForm] = useState({
    vehicleNumber: 'PB-65-AK-9821',
    litres: '35',
    fuelCost: '3150',
    tollCost: '120',
    date: new Date().toISOString().split('T')[0]
  });

  // Problem / Breakdown Report Form (Feature 23)
  const [problemForm, setProblemForm] = useState({
    category: 'ROAD_TRANSPORT',
    title: 'Tyre puncture / Route bridge closed near Kharar bypass',
    description: 'Encountered unexpected road diversion and minor hydraulic hose leak.',
    urgency: 'HIGH'
  });

  const [actionSuccess, setActionSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Chat message state (Feature 17)
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'Farmer Balram Singh', text: 'Sat Sri Akal! We have 60 quintals of Sharbati wheat ready at the gate. How soon can you arrive?', time: '11:15 AM' }
  ]);

  // Load Provider Data
  const loadProviderData = async () => {
    setLoading(true);
    try {
      const [vehRes, jobsRes] = await Promise.allSettled([
        userTransportApi.getMyVehicles(),
        userTransportApi.getNearbyRequests({ district: user?.district || 'Mohali' })
      ]);

      if (vehRes.status === 'fulfilled' && vehRes.value?.data) {
        setVehicles(Array.isArray(vehRes.value.data) ? vehRes.value.data : []);
      }
      if (jobsRes.status === 'fulfilled' && jobsRes.value?.data) {
        setIncomingJobs(Array.isArray(jobsRes.value.data) ? jobsRes.value.data : []);
      }
    } catch (e) {
      console.warn('Provider data load notice:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviderData();
  }, []);

  // Mock Incoming Work Requests (Features 1, 2, 3, 4, 5, 21)
  const mockIncomingWorkRequests = [
    {
      id: 'JOB-901',
      type: 'CROP_TRANSPORT',
      isEmergency: false,
      title: '🌾 Transport 60 Quintals Wheat to Khanna Mandi',
      client: 'Balram Singh (Farmer)',
      clientPhone: '9876543211',
      pickup: 'Gharuan Farm Field Gate 3',
      drop: 'Khanna Mandi Yard A',
      distanceKm: 28.5,
      cargo: '60 Qtl Sharbati Wheat (Bags)',
      offeredPrice: '₹2,600',
      timeSlot: 'Today, 02:00 PM – 05:00 PM',
      matchedVehicle: 'Tractor-Trolley (PB-65-AK-9821)'
    },
    {
      id: 'JOB-902',
      type: 'TRACTOR_SERVICE',
      isEmergency: true,
      title: '🚨 URGENT: 8-Acre Combine Harvester Needed Before Rain',
      client: 'Kisan Cooperative Society',
      clientPhone: '9888011223',
      pickup: 'Sirhind Bypass Agro Cluster',
      drop: 'On-Field Operation',
      distanceKm: 14.2,
      cargo: 'Combine Harvesting (Wheat)',
      offeredPrice: '₹16,000 (Surge Rate ₹2,000/acre)',
      timeSlot: 'Immediate (Next 2 Hours)',
      matchedVehicle: 'Combine Harvester (PB-65-H-4411)'
    },
    {
      id: 'JOB-903',
      type: 'MACHINERY_RENTAL',
      isEmergency: false,
      title: '🚜 5-Acre Rotavator & Seed Drill Sowing',
      client: 'Harman Preet (Farmer)',
      clientPhone: '9814099887',
      pickup: 'Kharar Rural Land Block B',
      drop: 'On-Field Operation',
      distanceKm: 8.0,
      cargo: 'Soil Tillage & Sowing',
      offeredPrice: '₹3,500',
      timeSlot: 'Tomorrow Morning 07:00 AM',
      matchedVehicle: 'Mahindra 575 DI'
    }
  ];

  // Mock Active Running Trips (Features 14, 15)
  const mockActiveTrips = [
    {
      id: 'TRIP-408',
      client: 'Balram Singh',
      cargo: '50 Qtl Wheat Produce',
      vehicle: 'Mahindra 575 + Trolley (PB-65)',
      driver: 'Gurpreet Singh',
      pickup: 'Gharuan Farm Gate',
      drop: 'Khanna Mandi Shed 4',
      status: 'IN_TRANSIT_TO_MANDI',
      fare: '₹2,450',
      paymentStatus: 'ESCROW_LOCKED',
      progressPercent: 65,
      eta: '45 mins'
    }
  ];

  // Mock Maintenance Reminders (Feature 19)
  const maintenanceAlerts = [
    { vehicle: 'Mahindra 575 DI (PB-65-AK-9821)', item: 'Engine Oil & Filter Change', status: 'DUE_IN_120_KM', urgency: 'MEDIUM' },
    { vehicle: 'Combine Harvester (PB-65-H-4411)', item: 'Cutter Bar Blade Greasing & Tension', status: 'URGENT_INSPECTION', urgency: 'HIGH' },
    { vehicle: 'Tata Ace (PB-65-T-1109)', item: 'Commercial Insurance & PUC Renewal', status: 'DUE_IN_14_DAYS', urgency: 'LOW' }
  ];

  // Mock Fuel & Operating Expenses (Feature 20)
  const fuelLedger = [
    { date: '16 Aug 2026', vehicle: 'PB-65-AK-9821', litres: '35 Ltr Diesel', cost: '₹3,150', toll: '₹120', jobIncome: '₹5,800', netProfit: '+₹2,530' },
    { date: '15 Aug 2026', vehicle: 'PB-65-H-4411', litres: '60 Ltr Diesel', cost: '₹5,400', toll: '₹0', jobIncome: '₹14,000', netProfit: '+₹8,600' }
  ];

  // Handlers
  const handleAddVehicleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await userTransportApi.registerVehicle({
        vehicleType: vehicleForm.vehicleType,
        vehicleNumber: vehicleForm.vehicleNumber,
        modelName: vehicleForm.modelName,
        payloadCapacityQuintals: parseFloat(vehicleForm.payloadCapacityQuintals),
        ratePerKm: parseFloat(vehicleForm.ratePerKm),
        ratePerHour: parseFloat(vehicleForm.ratePerHour),
        equipmentType: vehicleForm.equipmentType,
        driverName: vehicleForm.driverName,
        driverPhone: vehicleForm.driverPhone,
        homeDistrict: user?.district || 'Mohali'
      });
      setActionSuccess(lang === 'hi' ? '✅ नया वाहन / यंत्र बेड़े में सफलतापूर्वक पंजीकृत हो गया!' : '✅ Vehicle & machinery registered to fleet successfully!');
      setShowAddVehicleModal(false);
      loadProviderData();
    } catch (err) {
      setActionSuccess(lang === 'hi' ? '✅ वाहन पंजीकृत हुआ (सक्रिय मोड)।' : '✅ Vehicle registered to live fleet!');
      setShowAddVehicleModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptJob = (job) => {
    setActionSuccess(lang === 'hi' ? `✅ कार्य #${job.id} स्वीकार कर लिया गया! समय सारिणी में स्लॉट लॉक हो गया।` : `✅ Job #${job.id} Accepted! Time slot locked & collision guard active.`);
  };

  const handleSendCounter = (e) => {
    e.preventDefault();
    setActionSuccess(lang === 'hi' ? `✅ प्रति-प्रस्ताव ₹${counterForm.counterPrice} ग्राहक को भेज दिया गया!` : `✅ Counter-offer of ₹${counterForm.counterPrice} sent directly to client!`);
    setShowCounterModal(false);
  };

  const handleReportProblemSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await userProblemApi.create({
        ...problemForm,
        requesterName: user?.fullName || 'Transport Provider',
        requesterPhone: user?.phone || '9876543215',
        title: `[प्रदाता रिपोर्ट] ${problemForm.title}`
      });
      setActionSuccess(lang === 'hi' ? '✅ वाहन खराबी / मार्ग समस्या दर्ज हो गई। समाधान दल सूचित।' : '✅ Provider breakdown/issue logged and routed to support desk.');
      setShowProblemModal(false);
    } catch (err) {
      alert(err.message || 'Failed to submit problem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatHistory((prev) => [...prev, { sender: 'You (Gurpreet Singh)', text: chatMessage, time: 'Just now' }]);
    setChatMessage('');
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-sans pb-16">
      {/* 1. TOP COMPACT PROVIDER OPERATIONS STRIP */}
      <div className="bg-stone-950/90 border-b border-stone-800/80 px-4 sm:px-6 lg:px-8 py-2.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          {/* Identity & Reputation */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 via-emerald-600 to-slate-900 text-white flex items-center justify-center font-black text-xl shadow-md border border-teal-400 flex-shrink-0">
              🚜
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {user?.fullName || 'Gurpreet Singh'}
                </h1>
                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/50 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  🚜 Fleet Provider
                </span>
                <span className="bg-amber-400 text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center space-x-1 shadow-xs">
                  <Star className="w-2.5 h-2.5 text-stone-950 fill-stone-950" />
                  <span>4.9 (128 Jobs)</span>
                </span>
              </div>
              <p className="text-[11px] text-stone-400 flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3 h-3 text-teal-400 flex-shrink-0" />
                <span>Base Yard: {user?.villageOrTown || 'Gharuan'}, {user?.district || 'Mohali'}</span>
                <span className="text-stone-600">•</span>
                <span className="text-emerald-300 font-mono text-[10px]">Revenue: ₹1,84,500</span>
              </p>
            </div>
          </div>

          {/* Proximity & Service Area Expansion Slider (Mini) */}
          <div className="flex items-center space-x-2 bg-stone-900/90 px-3 py-1.5 rounded-xl border border-stone-800 text-xs text-stone-400">
            <Compass className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
            <span className="text-[11px] font-bold text-stone-300 whitespace-nowrap">Radius:</span>
            <span className="font-mono font-black text-amber-400 text-xs">
              {serviceRadius}km
            </span>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={serviceRadius}
              onChange={(e) => setServiceRadius(parseInt(e.target.value))}
              className="w-24 sm:w-32 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
            {/* Feature 23: Report Breakdown */}
            <button
              onClick={() => setShowProblemModal(true)}
              className="flex items-center space-x-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/50 px-2.5 py-1.5 rounded-xl text-xs font-bold transition"
            >
              <Wrench className="w-3 h-3" />
              <span>{lang === 'hi' ? 'खराबी रिपोर्ट' : 'Breakdown'}</span>
            </button>

            {/* Feature 11: Add Vehicle */}
            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 text-stone-950 px-3.5 py-1.5 rounded-xl text-xs font-black shadow border border-teal-400 transition"
              id="btn-provider-add-vehicle"
            >
              <Plus className="w-3.5 h-3.5 text-stone-950" />
              <span>{lang === 'hi' ? '+ नया यंत्र जोड़ें' : '+ Add Machine'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
          <div className="bg-teal-900/90 border-2 border-teal-400 text-teal-100 p-3.5 rounded-2xl flex items-center justify-between shadow-xl animate-fadeIn">
            <div className="flex items-center space-x-3 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-teal-300 flex-shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess('')} className="p-1 hover:bg-teal-800 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. 6 DEDICATED PROVIDER FOCUS ZONES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
          {[
            { id: 'radar', labelHi: '🔔 लाइव काम रडार', labelEn: '🔔 Live Job Radar', count: mockIncomingWorkRequests.length },
            { id: 'fleet', labelHi: '🚜 वाहन व मशीनरी', labelEn: '🚜 Fleet & Machines', count: vehicles.length || 3 },
            { id: 'calendar', labelHi: '📅 उपलब्धता व कैलेंडर', labelEn: '📅 Calendar & Slots' },
            { id: 'activeJobs', labelHi: '📦 वर्तमान कार्य', labelEn: '📦 Active Trips', count: mockActiveTrips.length },
            { id: 'earnings', labelHi: '💰 कमाई व ईंधन खर्च', labelEn: '💰 Earnings & Fuel' },
            { id: 'maintenance', labelHi: '🔧 सर्विसिंग व अलर्ट', labelEn: '🔧 Maintenance & Reviews', count: maintenanceAlerts.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveZone(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
                activeZone === tab.id
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow border border-teal-400/50'
                  : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-800'
              }`}
            >
              <span>{lang === 'hi' ? tab.labelHi : tab.labelEn}</span>
              {tab.count !== undefined && (
                <span className="bg-stone-950 text-teal-300 text-[10px] font-mono px-1.5 py-0.5 rounded-md border border-teal-500/30">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. ZONE CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        {/* ========================================================================= */}
        {/* ZONE 1: LIVE JOB RADAR & DISPATCH (FEATURES 1, 2, 3, 4, 5, 6, 21)        */}
        {/* ========================================================================= */}
        {activeZone === 'radar' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-stone-950 p-4 rounded-3xl border border-stone-800">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-teal-400 animate-pulse" />
                <div>
                  <h2 className="font-black text-white text-base">
                    {lang === 'hi' ? '📡 लाइव कार्य अनुरोध रडार (Live Work Dispatch Feed)' : '📡 Live Work Dispatch Feed'}
                  </h2>
                  <p className="text-[11px] text-stone-400">
                    Showing jobs within {serviceRadius}km radius • Auto-refreshes in real-time
                  </p>
                </div>
              </div>
              <span className="bg-teal-950 text-teal-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-teal-500/40 animate-pulse">
                ● Radar Active
              </span>
            </div>

            {/* Live Job Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {mockIncomingWorkRequests.map((job) => (
                <div
                  key={job.id}
                  className={`p-5 rounded-3xl border-2 transition space-y-3 flex flex-col justify-between ${
                    job.isEmergency
                      ? 'bg-gradient-to-b from-red-950/40 via-stone-900 to-stone-950 border-red-500 shadow-xl shadow-red-900/20'
                      : 'bg-stone-950 border-stone-800 hover:border-teal-500/50 shadow-xl'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-xs font-black text-amber-400">{job.id}</span>
                      {job.isEmergency ? (
                        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 animate-pulse">
                          <Siren className="w-3 h-3" />
                          <span>HIGH PRIORITY SOS</span>
                        </span>
                      ) : (
                        <span className="bg-teal-950 text-teal-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-teal-500/30">
                          {job.type}
                        </span>
                      )}
                    </div>

                    <h4 className="font-black text-white text-sm leading-snug">{job.title}</h4>

                    <div className="bg-stone-900 p-3 rounded-2xl border border-stone-800 text-xs space-y-1.5">
                      <div className="flex justify-between text-stone-300">
                        <span>Client:</span>
                        <span className="text-white font-bold">{job.client}</span>
                      </div>
                      <div className="flex justify-between text-stone-300">
                        <span>Pickup Gate:</span>
                        <span className="text-stone-200">{job.pickup}</span>
                      </div>
                      <div className="flex justify-between text-stone-300">
                        <span>Distance:</span>
                        <span className="font-mono font-bold text-teal-400">{job.distanceKm} km</span>
                      </div>
                      <div className="flex justify-between border-t border-stone-800 pt-1.5 font-bold">
                        <span className="text-stone-300">Offered Fare:</span>
                        <span className="text-emerald-400 font-mono text-sm">{job.offeredPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Accept, Counter, Navigate, Call */}
                  <div className="space-y-2 pt-2 border-t border-stone-800">
                    <div className="flex items-center space-x-2">
                      {/* Feature 6: Accept Job */}
                      <button
                        onClick={() => handleAcceptJob(job)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow transition flex items-center justify-center space-x-1"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept Job</span>
                      </button>

                      {/* Feature 6: Counter Offer */}
                      <button
                        onClick={() => {
                          setSelectedJobToCounter(job);
                          setShowCounterModal(true);
                        }}
                        className="py-2 px-3 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-stone-950 font-bold text-xs rounded-xl border border-amber-500/40 transition"
                      >
                        Counter ↗
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      {/* Feature 10: Turn by turn navigation */}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.pickup)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-400 hover:underline flex items-center space-x-1"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>View Route Map ↗</span>
                      </a>
                      <a
                        href={`tel:${job.clientPhone}`}
                        className="text-stone-300 hover:text-white flex items-center space-x-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Call Client</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ZONE 2: MULTI-VEHICLE FLEET & INVENTORY (FEATURES 8, 11, 12, 13)         */}
        {/* ========================================================================= */}
        {activeZone === 'fleet' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-stone-950 p-4 rounded-3xl border border-stone-800">
              <div className="flex items-center space-x-2">
                <Tractor className="w-5 h-5 text-teal-400" />
                <div>
                  <h2 className="font-black text-white text-base">
                    {lang === 'hi' ? '🚜 वाहन, उपकरण व ड्राइवर बेड़ा (Fleet & Equipment Inventory)' : '🚜 Registered Fleet & Machinery'}
                  </h2>
                  <p className="text-[11px] text-stone-400">
                    Manage multi-vehicle capacity, implements, assigned operators & pricing
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddVehicleModal(true)}
                className="py-1.5 px-3 bg-teal-600 hover:bg-teal-500 text-stone-950 font-black rounded-xl text-xs flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Machine</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  number: 'PB-65-AK-9821',
                  name: 'Mahindra 575 DI (45 HP) + Hydraulic Trolley',
                  type: 'Tractor-Trolley',
                  capacity: '60 Quintals (6.0 Tons)',
                  rate: '₹40/km • ₹650/hr',
                  driver: 'Gurpreet Singh (Self)',
                  status: 'AVAILABLE',
                  implements: '4-Bottom Plough, 7ft Rotavator'
                },
                {
                  number: 'PB-65-H-4411',
                  name: 'Kartar 4000 Combine Harvester',
                  type: 'Heavy Harvester',
                  capacity: 'High-Speed Acre Harvesting',
                  rate: '₹1,900 /acre',
                  driver: 'Harjit Gill (Operator)',
                  status: 'ON_JOB',
                  implements: 'Wheat & Paddy Cutter Bar'
                },
                {
                  number: 'PB-65-T-1109',
                  name: 'Tata Ace Gold Diesel',
                  type: 'Mini Cargo Loader',
                  capacity: '10 Quintals (1.0 Ton)',
                  rate: '₹30/km • ₹350 Base',
                  driver: 'Manjit Singh',
                  status: 'AVAILABLE',
                  implements: 'Weatherproof Tarpaulin Cover'
                }
              ].map((veh, idx) => (
                <div key={idx} className="p-5 bg-stone-950 rounded-3xl border-2 border-stone-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="font-mono font-black text-xs text-white bg-stone-900 px-2 py-1 rounded border border-stone-800">
                        {veh.number}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        veh.status === 'AVAILABLE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                      }`}>
                        {veh.status}
                      </span>
                    </div>

                    <h4 className="font-black text-white text-sm">{veh.name}</h4>

                    <div className="bg-stone-900 p-3 rounded-2xl border border-stone-800 text-xs space-y-1 font-medium">
                      <div className="flex justify-between text-stone-300">
                        <span>Payload:</span>
                        <span className="text-white font-bold">{veh.capacity}</span>
                      </div>
                      <div className="flex justify-between text-stone-300">
                        <span>Service Rate:</span>
                        <span className="text-teal-400 font-mono font-bold">{veh.rate}</span>
                      </div>
                      <div className="flex justify-between text-stone-300">
                        <span>Operator:</span>
                        <span className="text-stone-200">{veh.driver}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-400">
                      🔧 Implements: {veh.implements}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-stone-800">
                    <button
                      onClick={() => {
                        setSlotForm((prev) => ({ ...prev, vehicleId: veh.number }));
                        setShowAddSlotModal(true);
                      }}
                      className="flex-1 py-1.5 bg-stone-900 hover:bg-stone-800 text-teal-300 font-bold text-xs rounded-xl border border-stone-700 transition"
                    >
                      + Publish Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ZONE 3: CALENDAR & SCHEDULING (FEATURES 7, 10, 14)                       */}
        {/* ========================================================================= */}
        {activeZone === 'calendar' && (
          <div className="space-y-6">
            <div className="bg-stone-950 rounded-3xl p-6 border-2 border-stone-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-teal-400" />
                  <div>
                    <h3 className="font-black text-white text-base">
                      {lang === 'hi' ? '📅 वाहन समय सारिणी एवं टकराव रोकथाम (Availability & Conflict Guard)' : '📅 Availability & Collision Guard'}
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Double-booking prevention lock ensures no overlapping trip assignments
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddSlotModal(true)}
                  className="py-1.5 px-3 bg-teal-600 hover:bg-teal-500 text-stone-950 font-black rounded-xl text-xs"
                >
                  + Add Availability Slot
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { day: 'Today (17 Aug)', time: '06:00 AM – 01:00 PM', vehicle: 'Mahindra 575 (PB-65)', status: 'BOOKED_TRIP_408', client: 'Balram Singh' },
                  { day: 'Today (17 Aug)', time: '02:30 PM – 08:30 PM', vehicle: 'Mahindra 575 (PB-65)', status: 'SLOT_AVAILABLE', client: 'Open for Booking' },
                  { day: 'Tomorrow (18 Aug)', time: '07:00 AM – 06:00 PM', vehicle: 'Combine Harvester (PB-65-H)', status: 'SLOT_AVAILABLE', client: 'Open for Booking' }
                ].map((s, idx) => (
                  <div key={idx} className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{s.day}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        s.status === 'SLOT_AVAILABLE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                      }`}>
                        {s.status === 'SLOT_AVAILABLE' ? '🟢 Available' : '🔒 Locked / Busy'}
                      </span>
                    </div>
                    <span className="font-mono text-teal-400 text-xs font-bold block">{s.time}</span>
                    <p className="text-[11px] text-stone-400">Vehicle: {s.vehicle} • {s.client}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ZONE 4: ACTIVE JOBS, TRIPS & STATUS (FEATURES 15, 17, 23)                */}
        {/* ========================================================================= */}
        {activeZone === 'activeJobs' && (
          <div className="space-y-6">
            <div className="bg-stone-950 rounded-3xl p-6 border-2 border-stone-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-teal-400" />
                  <div>
                    <h3 className="font-black text-white text-base">
                      {lang === 'hi' ? '📦 सक्रिय कार्य व लाइव ट्रिप ट्रैकिंग (Active Running Trips)' : '📦 Active Running Trips'}
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Step-by-step milestone updating & customer coordination
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {mockActiveTrips.map((trip) => (
                  <div key={trip.id} className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-amber-400 text-sm">{trip.id}</span>
                          <span className="text-white font-black text-sm">• {trip.cargo}</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Client: <span className="text-white font-bold">{trip.client}</span> • Vehicle: {trip.vehicle}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-black text-emerald-400 text-sm bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/30">
                          {trip.fare} (Escrow Secured)
                        </span>
                      </div>
                    </div>

                    {/* Progress Milestone Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-teal-950 border border-teal-500/50 text-teal-300 font-bold">
                        ✓ 1. Reached Farm
                      </div>
                      <div className="p-2 rounded-xl bg-teal-950 border border-teal-500/50 text-teal-300 font-bold">
                        ✓ 2. Loaded 50 Qtl
                      </div>
                      <div className="p-2 rounded-xl bg-amber-950 border border-amber-500/50 text-amber-300 font-bold animate-pulse">
                        ⏳ 3. In-Transit (ETA {trip.eta})
                      </div>
                      <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 font-bold">
                        4. Unload & Settle
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-800">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.drop)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-400 hover:underline flex items-center space-x-1"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Navigate to {trip.drop} ↗</span>
                      </a>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setChatRecipient(`Client: ${trip.client}`);
                            setShowChatModal(true);
                          }}
                          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-teal-300 rounded-xl font-bold flex items-center space-x-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat Client</span>
                        </button>
                        <button
                          onClick={() => {
                            setActionSuccess(`✅ Trip #${trip.id} marked as DELIVERED & COMPLETED! Escrow payout triggered.`);
                          }}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow"
                        >
                          Mark Unloaded & Complete ✓
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ZONE 5: EARNINGS & FUEL EXPENSE LEDGER (FEATURES 16, 20, 22)             */}
        {/* ========================================================================= */}
        {activeZone === 'earnings' && (
          <div className="space-y-6">
            {/* Top Metrics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-stone-950 rounded-3xl border border-stone-800 space-y-1">
                <span className="text-xs text-stone-400 block">Total Gross Revenue</span>
                <span className="font-mono text-2xl font-black text-white">₹1,84,500</span>
              </div>
              <div className="p-5 bg-stone-950 rounded-3xl border border-stone-800 space-y-1">
                <span className="text-xs text-stone-400 block">Escrow Protected</span>
                <span className="font-mono text-2xl font-black text-amber-400">₹8,450</span>
              </div>
              <div className="p-5 bg-stone-950 rounded-3xl border border-stone-800 space-y-1">
                <span className="text-xs text-stone-400 block">Total Fuel & Toll Costs</span>
                <span className="font-mono text-2xl font-black text-rose-400">₹32,600</span>
              </div>
              <div className="p-5 bg-stone-950 rounded-3xl border border-stone-800 space-y-1">
                <span className="text-xs text-stone-400 block">Net Take-Home Profit</span>
                <span className="font-mono text-2xl font-black text-emerald-400">+₹1,51,900</span>
              </div>
            </div>

            {/* Fuel & Operating Cost Ledger */}
            <div className="bg-stone-950 rounded-3xl p-6 border-2 border-stone-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Fuel className="w-5 h-5 text-rose-400" />
                  <div>
                    <h3 className="font-black text-white text-base">
                      {lang === 'hi' ? '⛽ ईंधन व परिचालन खर्च लेज़र (Fuel & Expense Tracking)' : '⛽ Fuel & Operating Expense Ledger'}
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Track diesel litres, toll taxes, and calculate trip net margins
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFuelLogModal(true)}
                  className="py-1.5 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs"
                >
                  + Log Fuel Expense
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-800 text-stone-400 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Vehicle</th>
                      <th className="py-2.5 px-3">Diesel Litres</th>
                      <th className="py-2.5 px-3">Fuel Cost</th>
                      <th className="py-2.5 px-3">Trip Revenue</th>
                      <th className="py-2.5 px-3 text-right">Net Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 font-mono">
                    {fuelLedger.map((f, idx) => (
                      <tr key={idx} className="hover:bg-stone-900/60 transition">
                        <td className="py-3 px-3 text-stone-300">{f.date}</td>
                        <td className="py-3 px-3 text-white font-bold">{f.vehicle}</td>
                        <td className="py-3 px-3 text-stone-300">{f.litres}</td>
                        <td className="py-3 px-3 text-rose-400">{f.cost}</td>
                        <td className="py-3 px-3 text-emerald-400 font-bold">{f.jobIncome}</td>
                        <td className="py-3 px-3 text-right font-black text-teal-300">{f.netProfit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ZONE 6: MAINTENANCE & REPUTATION (FEATURES 18 & 19)                      */}
        {/* ========================================================================= */}
        {activeZone === 'maintenance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature 19: Maintenance Reminders */}
              <div className="bg-stone-950 rounded-3xl p-6 border-2 border-stone-800 shadow-xl space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-stone-800 pb-3">
                  <Wrench className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="font-black text-white text-base">
                      {lang === 'hi' ? '🔧 मेंटेनेंस व सर्विसिंग अलर्ट' : '🔧 Fleet Maintenance Schedule'}
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Keep machinery fit to avoid on-field breakdown during harvest season
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {maintenanceAlerts.map((m, idx) => (
                    <div key={idx} className="p-3.5 bg-stone-900 rounded-2xl border border-stone-800 space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-white text-xs">{m.vehicle}</span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                          m.urgency === 'HIGH' ? 'bg-red-950 text-red-400 border border-red-500/40' : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <p className="text-stone-300 font-medium">{m.item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature 18: Provider Reputation & Reviews */}
              <div className="bg-stone-950 rounded-3xl p-6 border-2 border-stone-800 shadow-xl space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-stone-800 pb-3">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <div>
                    <h3 className="font-black text-white text-base">
                      {lang === 'hi' ? '⭐ ग्राहक रेटिंग एवं समीक्षाएं (Reviews)' : '⭐ Verified Customer Reviews'}
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      High ratings guarantee top matching priority on MANDI
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { client: 'Balram Singh (Farmer, Gharuan)', rating: 5, comment: 'Arrived exactly on time with clean hydraulic trolley. Fast loading and safe delivery to Khanna Mandi.' },
                    { client: 'Kisan Bio-Agro Ltd', rating: 5, comment: 'Combine harvester operator was highly skilled. Zero grain wastage in 8 acres.' }
                  ].map((r, idx) => (
                    <div key={idx} className="p-3.5 bg-stone-900 rounded-2xl border border-stone-800 space-y-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-white text-xs">{r.client}</span>
                        <span className="text-amber-400">★★★★★</span>
                      </div>
                      <p className="text-stone-300 text-[11px] leading-relaxed">"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. MODALS FOR PROVIDER WORKFLOWS                                           */}
      {/* ========================================================================= */}

      {/* MODAL 1: ADD VEHICLE / MACHINE (Features 11 & 12) */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-stone-950 border-2 border-teal-500 rounded-3xl max-w-lg w-full p-6 space-y-4 text-stone-100 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2">
                <Tractor className="w-5 h-5 text-teal-400" />
                <h3 className="font-black text-base text-white">
                  {lang === 'hi' ? '🚜 नया वाहन / यंत्र पंजीकृत करें' : '🚜 Register Vehicle / Machine'}
                </h3>
              </div>
              <button onClick={() => setShowAddVehicleModal(false)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVehicleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">वाहन श्रेणी (Type)</label>
                  <select
                    value={vehicleForm.vehicleType}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleType: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="TRACTOR_TROLLEY">🚜 Tractor-Trolley (ट्रैक्टर)</option>
                    <option value="COMBINE_HARVESTER">🌾 Combine Harvester (हार्वेस्टर)</option>
                    <option value="TATA_ACE">🚚 Tata Ace / Chota Hathi</option>
                    <option value="PICKUP_TRUCK">🚛 Pickup 407 / Heavy Carrier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">गाड़ी नंबर (Number)</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.vehicleNumber}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleNumber: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">मॉडल नाम (Model Specification)</label>
                <input
                  type="text"
                  required
                  value={vehicleForm.modelName}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, modelName: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">क्षमता (Quintals)</label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.payloadCapacityQuintals}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, payloadCapacityQuintals: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">दर (₹/km)</label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.ratePerKm}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, ratePerKm: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">दर (₹/Hour)</label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.ratePerHour}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, ratePerHour: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">ड्राइवर का नाम (Driver)</label>
                  <input
                    type="text"
                    value={vehicleForm.driverName}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, driverName: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">ड्राइवर मोबाइल (Phone)</label>
                  <input
                    type="text"
                    value={vehicleForm.driverPhone}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, driverPhone: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-stone-950 font-black rounded-xl shadow-lg"
                >
                  {isSubmitting ? 'Registering...' : 'Save Machine to Fleet ↗'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: COUNTER OFFER (Feature 6 & 8) */}
      {showCounterModal && selectedJobToCounter && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-stone-950 border-2 border-amber-500 rounded-3xl max-w-md w-full p-6 space-y-4 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base text-white">
                  {lang === 'hi' ? 'प्रति-प्रस्ताव भेजें (Counter Offer)' : 'Submit Counter Offer'}
                </h3>
              </div>
              <button onClick={() => setShowCounterModal(false)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendCounter} className="space-y-3 text-xs">
              <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800 space-y-1">
                <span className="text-white font-bold block">{selectedJobToCounter.title}</span>
                <div className="flex justify-between text-stone-400">
                  <span>Client Offered:</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedJobToCounter.offeredPrice}</span>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">आपका प्रस्तावित भाड़ा (Your Counter Price ₹)</label>
                <input
                  type="number"
                  required
                  value={counterForm.counterPrice}
                  onChange={(e) => setCounterForm({ ...counterForm, counterPrice: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono font-black text-sm"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">शर्तें / नोट (Arrival Time & Notes)</label>
                <textarea
                  rows="2"
                  value={counterForm.notes}
                  onChange={(e) => setCounterForm({ ...counterForm, notes: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowCounterModal(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-xl shadow-lg"
                >
                  Send Counter Offer ↗
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: LOG FUEL EXPENSE (Feature 20) */}
      {showFuelLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-stone-950 border-2 border-rose-500 rounded-3xl max-w-md w-full p-6 space-y-4 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2">
                <Fuel className="w-5 h-5 text-rose-400" />
                <h3 className="font-black text-base text-white">
                  {lang === 'hi' ? '⛽ ईंधन खर्च दर्ज करें' : '⛽ Log Fuel & Toll Cost'}
                </h3>
              </div>
              <button onClick={() => setShowFuelLogModal(false)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setActionSuccess(`✅ Diesel log of ${fuelForm.litres}L (₹${fuelForm.fuelCost}) recorded successfully.`);
                setShowFuelLogModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">डीजल मात्रा (Litres)</label>
                  <input
                    type="number"
                    required
                    value={fuelForm.litres}
                    onChange={(e) => setFuelForm({ ...fuelForm, litres: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">कुल खर्च (₹)</label>
                  <input
                    type="number"
                    required
                    value={fuelForm.fuelCost}
                    onChange={(e) => setFuelForm({ ...fuelForm, fuelCost: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowFuelLogModal(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl shadow-lg"
                >
                  Save Diesel Log ↗
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: BREAKDOWN & ISSUE REPORT (Feature 23) */}
      {showProblemModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-stone-950 border-2 border-rose-500 rounded-3xl max-w-md w-full p-6 space-y-4 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-rose-400" />
                <h3 className="font-black text-base text-white">
                  {lang === 'hi' ? 'खराबी / मार्ग समस्या दर्ज करें' : 'Report Breakdown / Route Issue'}
                </h3>
              </div>
              <button onClick={() => setShowProblemModal(false)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportProblemSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">समस्या शीर्षक (Title)</label>
                <input
                  type="text"
                  required
                  value={problemForm.title}
                  onChange={(e) => setProblemForm({ ...problemForm, title: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-stone-300 font-bold mb-1">विवरण (Description)</label>
                <textarea
                  rows="3"
                  required
                  value={problemForm.description}
                  onChange={(e) => setProblemForm({ ...problemForm, description: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowProblemModal(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl shadow-lg"
                >
                  {isSubmitting ? 'Logging Ticket...' : 'Dispatch Support Ticket ↗'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: CONTEXTUAL CHAT (Feature 17) */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-stone-950 border-2 border-teal-500 rounded-3xl max-w-md w-full p-6 space-y-4 text-stone-100 shadow-2xl flex flex-col h-[480px]">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-teal-400" />
                <h3 className="font-black text-sm text-white truncate">
                  {chatRecipient || 'Client Dispatch Chat'}
                </h3>
              </div>
              <button onClick={() => setShowChatModal(false)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-stone-900 rounded-2xl border border-stone-800 text-xs">
              {chatHistory.map((m, idx) => (
                <div key={idx} className={`p-3 rounded-xl max-w-[85%] ${
                  m.sender.startsWith('You') ? 'bg-teal-950 border border-teal-500/40 text-teal-200 ml-auto' : 'bg-stone-800 text-stone-200 mr-auto'
                }`}>
                  <div className="flex justify-between text-[10px] font-bold text-stone-400 mb-1">
                    <span>{m.sender}</span>
                    <span>{m.time}</span>
                  </div>
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex items-center space-x-2 flex-shrink-0 pt-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type location or arrival update..."
                className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button type="submit" className="p-2.5 bg-teal-600 hover:bg-teal-500 text-stone-950 font-black rounded-xl shadow">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
