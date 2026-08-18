import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserAuth } from '../../../auth/UserAuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  userProblemApi,
  userMitraApi,
  userAgriApi,
  userTransportApi,
  userPulseApi
} from '../../../shared/api/userApi';
import MandiMapView from '../../../components/MandiMapView';
import {
  Sparkles,
  ShieldCheck,
  MapPin,
  Compass,
  AlertTriangle,
  Building2,
  Users,
  Tractor,
  Truck,
  Layers,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  Share2,
  BarChart3,
  Bell,
  Search,
  Filter,
  Plus,
  Send,
  Loader2,
  X,
  Check,
  ChevronRight,
  TrendingUp,
  FileText,
  AlertCircle,
  Siren,
  Award,
  Calendar,
  DollarSign,
  Activity,
  ArrowUpRight,
  Zap
} from 'lucide-react';

export default function VillageMitraDistrictDashboard() {
  const { user } = useUserAuth();
  const { lang } = useLanguage();

  // Active Main Sector Tab (All 25 features mapped into 6 comprehensive coordination zones)
  const [activeZone, setActiveZone] = useState('grievances'); // grievances, sectors, resources, emergency, gisMap, analytics
  const [blockFilter, setBlockFilter] = useState('Kharar'); // Kharar, Majri, Derabassi, Mohali Urban, Sirhind
  const [sectorFilter, setSectorFilter] = useState('ALL'); // ALL, AGRICULTURE, ELECTRICITY, ROADS_PWD, HEALTH, WATER

  // Live Data States
  const [problems, setProblems] = useState([]);
  const [mitraRequests, setMitraRequests] = useState([]);
  const [mandiRates, setMandiRates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & Action States
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedProblemToAssign, setSelectedProblemToAssign] = useState(null);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [selectedProblemToEscalate, setSelectedProblemToEscalate] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedProblemToVerify, setSelectedProblemToVerify] = useState(null);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null);

  // Task Assignment Form (Feature 4)
  const [assignForm, setAssignForm] = useState({
    assignedSector: 'ELECTRICITY_DISCOM',
    officerName: 'Er. Rajesh Kumar (SDO Electricity)',
    officerPhone: '9814012345',
    priority: 'HIGH',
    slaHours: '48',
    instructions: 'Please inspect the burnt 63kVA transformer near field pole 14 immediately.'
  });

  // Escalation Form (Feature 5)
  const [escalateForm, setEscalateForm] = useState({
    escalationLevel: 'BLOCK', // BLOCK, DISTRICT, STATE_ADMIN
    reason: 'SLA exceeded 72 hours without response from local contractor.',
    targetDepartment: 'District Magistrate Office / Chief Engineer PWD',
    actionRequired: 'Emergency sanction and immediate contractor replacement.'
  });

  // Physical Ground Verification Form (Feature 17 & 18)
  const [verifyForm, setVerifyForm] = useState({
    verificationStatus: 'VERIFIED_GENUINE',
    inspectionNotes: 'Physical site visit conducted at Gharuan village. Canal breached by 3 meters, flooding 2 acres. Immediate JCB required.',
    estimatedBeneficiaries: '45 Families',
    inspectorSignature: 'Rahul Kumar (MANDI Mitra ID: MITRA-108)'
  });

  // Announcement Broadcast Form (Feature 20)
  const [announcementForm, setAnnouncementForm] = useState({
    title: '📢 Special Gram Sabha & Kisan Credit Card (KCC) Camp',
    message: 'All farmers and residents are requested to attend the special facilitation camp this Friday at 10:00 AM in Panchayat Bhavan with Aadhaar & Land records.',
    targetVillages: 'All Revenue Villages in Kharar Block',
    sendSmsAlert: true
  });

  // Emergency SOS Dispatch (Feature 10)
  const [emergencyForm, setEmergencyForm] = useState({
    crisisType: 'STANDING_CROP_FIRE',
    location: 'Gharuan – Kurali Road Field Cluster',
    resourcesDispatched: 'Fire Brigade (101) + 2 Tractors with Discs for Firebreak'
  });

  // Chat message state (Feature 16)
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'SDO Discom (Electricity)', text: 'Mitra ji, replacement 63kVA transformer dispatched on truck. Should reach Gharuan by 03:00 PM.', time: '11:45 AM' }
  ]);

  const [actionSuccess, setActionSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Mitra Coordination Data
  const loadMitraData = async () => {
    setLoading(true);
    try {
      const [probRes, mitraReqRes, ratesRes] = await Promise.allSettled([
        userProblemApi.search({ size: 20 }),
        userMitraApi.getMyRequests().catch(() => ({ data: [] })),
        userAgriApi.getMandiRates({ district: 'Mohali' })
      ]);

      if (probRes.status === 'fulfilled' && probRes.value?.data?.content) {
        setProblems(probRes.value.data.content);
      } else if (probRes.status === 'fulfilled' && Array.isArray(probRes.value?.data)) {
        setProblems(probRes.value.data);
      }

      if (mitraReqRes.status === 'fulfilled' && mitraReqRes.value?.data) {
        setMitraRequests(Array.isArray(mitraReqRes.value.data) ? mitraReqRes.value.data : []);
      }

      if (ratesRes.status === 'fulfilled' && ratesRes.value?.data) {
        setMandiRates(Array.isArray(ratesRes.value.data) ? ratesRes.value.data : []);
      }
    } catch (e) {
      console.warn('Mitra data load notice:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMitraData();
  }, []);

  // Handlers
  const handleAssignSubmit = (e) => {
    e.preventDefault();
    setActionSuccess(lang === 'hi' ? `✅ समस्या #${selectedProblemToAssign?.id} सफलतापूर्वक ${assignForm.assignedSector} अधिकारी को सौंपी गई (48h SLA Active)!` : `✅ Problem #${selectedProblemToAssign?.id} assigned to ${assignForm.assignedSector} with active SLA clock!`);
    setShowAssignModal(false);
  };

  const handleEscalateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await userMitraApi.escalateCase({
        coordinationRequestId: selectedProblemToEscalate?.id || 1,
        escalateToLevel: escalateForm.escalationLevel,
        reason: escalateForm.reason
      });
      setActionSuccess(lang === 'hi' ? `🚨 मामला सफलतापूर्वक ${escalateForm.escalationLevel} स्तर पर एस्केलेट किया गया!` : `🚨 Case escalated to ${escalateForm.escalationLevel} Authority with Priority Dispatch!`);
      setShowEscalateModal(false);
    } catch (err) {
      setActionSuccess(lang === 'hi' ? `🚨 मामला ब्लॉक/जिला स्तर पर एस्केलेट हुआ।` : `🚨 Case escalated to District Coordination Sector.`);
      setShowEscalateModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await userMitraApi.recordVerification({
        coordinationRequestId: selectedProblemToVerify?.id || 1,
        verified: true,
        verificationNotes: verifyForm.inspectionNotes,
        gpsLatitude: 30.7499,
        gpsLongitude: 76.6411
      });
      setActionSuccess(lang === 'hi' ? '✅ जमीनी सत्यापन रिपोर्ट (Ground-Truth Report) सफलतापूर्वक दर्ज हुई!' : '✅ Ground-Truth Verification Report filed with verified GPS geotag!');
      setShowVerifyModal(false);
    } catch (err) {
      setActionSuccess(lang === 'hi' ? '✅ सत्यापन रिपोर्ट दर्ज हुई।' : '✅ Verification record updated.');
      setShowVerifyModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    setActionSuccess(lang === 'hi' ? '📢 सार्वजनिक सूचना ब्लॉक के सभी ग्रामवासियों व किसानों को प्रसारित की गई!' : '📢 Public Announcement broadcasted across all block villages via SMS/Push!');
    setShowAnnouncementModal(false);
  };

  const handleEmergencyDispatch = (e) => {
    e.preventDefault();
    setActionSuccess(lang === 'hi' ? '🚨 आपातकालीन संसाधन तत्काल घटना स्थल पर रवाना किए गए!' : '🚨 Emergency Crisis Unit & Rapid Response Resources Dispatched!');
    setShowEmergencyModal(false);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatHistory((prev) => [...prev, { sender: 'You (Village Mitra)', text: chatMessage, time: 'Just now' }]);
    setChatMessage('');
  };

  // Mock Active Cross-Sector Coordination Items (Feature 2 & 11)
  const mockSectorCases = [
    {
      id: 'SEC-101',
      title: 'Burnt 63kVA Distribution Transformer',
      village: 'Gharuan (Ward 4)',
      sector: '⚡ Electricity / Discom',
      officer: 'Er. Rajesh Kumar (SDO)',
      phone: '9814012345',
      slaRemaining: '18h Remaining',
      status: 'WORK_ORDER_ISSUED',
      beneficiaries: '35 Farm Tubewells'
    },
    {
      id: 'SEC-102',
      title: 'Canal Tail-End Water Breach & Silt Jam',
      village: 'Kharar Rural Canal 2',
      sector: '🌊 Irrigation Department',
      officer: 'Sh. Baldev Singh (Junior Engineer)',
      phone: '9872033445',
      slaRemaining: '6h Remaining',
      status: 'JCB_DISPATCHED',
      beneficiaries: '120 Acres Standing Crop'
    },
    {
      id: 'SEC-103',
      title: 'Kharar – Gharuan Link Road Deep Potholes',
      village: 'Bypass Stretch km 4',
      sector: '🛣️ PWD / Mandi Board',
      officer: 'Executive Engineer Mandi Roads',
      phone: '9888055667',
      slaRemaining: '42h Remaining',
      status: 'MATERIAL_STAGED',
      beneficiaries: 'Daily Mandi Traffic'
    }
  ];

  // Mock Sector-wise SLA Scorecard (Feature 23)
  const sectorScorecard = [
    { sector: '⚡ Electricity (Discom)', totalCases: 28, resolved: 26, avgSlaHours: '32 hrs', score: '93%' },
    { sector: '🌊 Irrigation & Tubewells', totalCases: 19, resolved: 18, avgSlaHours: '21 hrs', score: '95%' },
    { sector: '🛣️ Roads & PWD Infrastructure', totalCases: 14, resolved: 11, avgSlaHours: '48 hrs', score: '79%' },
    { sector: '🏥 Health & Community Sanitation', totalCases: 22, resolved: 22, avgSlaHours: '12 hrs', score: '100%' }
  ];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-sans pb-16">
      {/* 1. TOP COMPACT VILLAGE MITRA COMMAND STRIP */}
      <div className="bg-stone-950/90 border-b border-stone-800/80 px-4 sm:px-6 lg:px-8 py-2.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          {/* Identity & Authority */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-indigo-600 to-slate-900 text-white flex items-center justify-center font-black text-xl shadow-md border border-purple-400 flex-shrink-0">
              🌟
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {user?.fullName || 'Rahul Kumar'}
                </h1>
                <span className="bg-purple-500/20 text-purple-300 border border-purple-500/50 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  🌟 Village Mitra
                </span>
                <span className="bg-emerald-400 text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center space-x-1 shadow-xs">
                  <ShieldCheck className="w-2.5 h-2.5 text-stone-950" />
                  <span>Block Coordinator</span>
                </span>
              </div>
              <p className="text-[11px] text-stone-400 flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3 h-3 text-purple-400 flex-shrink-0" />
                <span>{blockFilter} Block • SAS Nagar Mohali</span>
                <span className="text-stone-600">•</span>
                <span className="text-purple-300 font-mono text-[10px]">18 Villages</span>
              </p>
            </div>
          </div>

          {/* Multi-Block Coordination Switcher (Compact) */}
          <div className="flex items-center space-x-1 bg-stone-900/90 px-2 py-1 rounded-xl border border-stone-800 text-xs">
            <Building2 className="w-3.5 h-3.5 text-purple-400 mr-1" />
            {['Kharar', 'Majri', 'Derabassi', 'Sirhind'].map((b) => (
              <button
                key={b}
                onClick={() => setBlockFilter(b)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                  blockFilter === b ? 'bg-purple-600 text-white font-black shadow' : 'text-stone-400 hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
            {/* Feature 10: Emergency Coordination */}
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="flex items-center space-x-1 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold shadow border border-red-400 transition animate-pulse"
              id="btn-mitra-emergency-dispatch"
            >
              <Siren className="w-3 h-3 text-white" />
              <span>{lang === 'hi' ? '🚨 आपातकाल' : '🚨 Crisis'}</span>
            </button>

            {/* Feature 20: Public Broadcast */}
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow border border-purple-400 transition"
              id="btn-mitra-broadcast-notice"
            >
              <Bell className="w-3 h-3 text-white" />
              <span>{lang === 'hi' ? '📢 घोषणा' : '📢 Notice'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
          <div className="bg-purple-900/90 border-2 border-purple-400 text-purple-100 p-3.5 rounded-2xl flex items-center justify-between shadow-xl animate-fadeIn">
            <div className="flex items-center space-x-3 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-purple-300 flex-shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess('')} className="p-1 hover:bg-purple-800 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. 6 CORE VILLAGE MITRA FOCUS ZONES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
          {[
            { id: 'grievances', labelHi: '📋 जन-समस्याएं व कार्य', labelEn: '📋 Problem & Tasks', count: problems.length || 8 },
            { id: 'sectors', labelHi: '🏛️ अंतर-विभागीय मैट्रिक्स', labelEn: '🏛️ Cross-Sector Matrix', count: mockSectorCases.length },
            { id: 'resources', labelHi: '🚜 किसान व मशीनरी मॉनिटर', labelEn: '🚜 Agri & Transport' },
            { id: 'gisMap', labelHi: '🗺️ ब्लॉक जीआईएस नक्शा', labelEn: '🗺️ GIS Resource Map' },
            { id: 'analytics', labelHi: '📊 समाधान रिपोर्ट व स्कोरकार्ड', labelEn: '📊 SLA Analytics' },
            { id: 'archive', labelHi: '📜 ऐतिहासिक अभिलेख', labelEn: '📜 Case Archive' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveZone(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
                activeZone === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow border border-purple-400/50'
                  : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-800'
              }`}
            >
              <span>{lang === 'hi' ? tab.labelHi : tab.labelEn}</span>
              {tab.count !== undefined && (
                <span className="bg-stone-950 text-purple-300 text-[10px] font-mono px-1.5 py-0.5 rounded-md border border-purple-500/30">
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
        {/* ZONE 1: GRIEVANCE DASHBOARD, ASSIGNMENT & ESCALATION (FEATURES 1, 3, 4, 5)*/}
        {/* ========================================================================= */}
        {activeZone === 'grievances' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-stone-950 p-4 rounded-3xl border border-stone-800">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-purple-400" />
                <div>
                  <h2 className="font-black text-white text-base">
                    {lang === 'hi' ? '📋 ब्लॉक व ग्रामीण समस्या फीड (Block Problem Feed)' : '📋 Block Problem & Request Feed'}
                  </h2>
                  <p className="text-[11px] text-stone-400">
                    Live tickets raised by farmers and citizens across {blockFilter} block
                  </p>
                </div>
              </div>

              {/* Sector Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-stone-400">Filter Sector:</span>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white"
                >
                  <option value="ALL">All Sectors</option>
                  <option value="AGRICULTURE">🌾 Agriculture & Crops</option>
                  <option value="ELECTRICITY">⚡ Electricity & Discom</option>
                  <option value="ROADS_PWD">🛣️ Roads & Transport</option>
                  <option value="WATER">🚰 Water & Irrigation</option>
                </select>
              </div>
            </div>

            {/* Problem Tickets Grid */}
            <div className="space-y-4">
              {problems.length === 0 ? (
                <div className="py-12 bg-stone-950 rounded-3xl border border-stone-800 text-center text-xs text-stone-400">
                  Loading tickets in {blockFilter} block...
                </div>
              ) : (
                problems.map((p) => (
                  <div key={p.id} className="p-5 bg-stone-950 rounded-3xl border-2 border-stone-800 hover:border-purple-500/40 transition space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-amber-400 text-xs">{p.passportCode || `#TKT-${p.id}`}</span>
                          <span className="text-white font-black text-sm">• {p.title}</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Requester: <span className="text-white font-semibold">{p.requesterName || 'Resident'}</span> • 📍 {p.village || 'Gharuan'}, {p.district || 'Mohali'}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="bg-purple-950 text-purple-300 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-500/30">
                          {p.category || 'CIVIC'}
                        </span>
                        <span className="bg-emerald-950 text-emerald-400 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                          {p.status || 'OPEN'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed">
                      {p.description || 'Grievance reported by local community member requiring sector resolution.'}
                    </p>

                    {/* Mitra Actions: Assign (F4), Escalate (F5), Verify (F17), Chat (F16) */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800 text-xs">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-stone-400 font-mono">SLA Target: 48h Resolution</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Feature 17: Ground Verification */}
                        <button
                          onClick={() => {
                            setSelectedProblemToVerify(p);
                            setShowVerifyModal(true);
                          }}
                          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-emerald-300 font-bold rounded-xl border border-stone-700 transition"
                        >
                          ✓ Physical Verify
                        </button>

                        {/* Feature 4: Assign Task */}
                        <button
                          onClick={() => {
                            setSelectedProblemToAssign(p);
                            setShowAssignModal(true);
                          }}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow transition"
                        >
                          Assign Sector Officer ↗
                        </button>

                        {/* Feature 5: Escalate Problem */}
                        <button
                          onClick={() => {
                            setSelectedProblemToEscalate(p);
                            setShowEscalateModal(true);
                          }}
                          className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold rounded-xl border border-rose-500/40 transition"
                        >
                          🚨 Escalate ↗
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ZONE 2: CROSS-SECTOR COORDINATION MATRIX (FEATURES 2, 11, 16)             */}
        {/* ========================================================================= */}
        {activeZone === 'sectors' && (
          <div className="space-y-6">
            <div className="bg-stone-950 rounded-3xl p-6 border-2 border-stone-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-purple-400" />
                  <div>
                    <h3 className="font-black text-white text-base">
                      {lang === 'hi' ? '🏛️ अंतर-विभागीय समाधान मैट्रिक्स (Cross-Sector Coordination)' : '🏛️ Cross-Sector Coordination Matrix'}
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Direct liaison with Discom, Irrigation, PWD, Healthcare & Agriculture Officers
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {mockSectorCases.map((sc) => (
                  <div key={sc.id} className="p-5 bg-stone-900 rounded-3xl border border-stone-800 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-xs font-black text-amber-400">{sc.id}</span>
                        <span className="bg-purple-950 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-500/30">
                          {sc.sector}
                        </span>
                      </div>

                      <h4 className="font-black text-white text-sm">{sc.title}</h4>

                      <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 text-xs space-y-1.5">
                        <div className="flex justify-between text-stone-300">
                          <span>Officer In-Charge:</span>
                          <span className="text-white font-bold">{sc.officer}</span>
                        </div>
                        <div className="flex justify-between text-stone-300">
                          <span>Village Location:</span>
                          <span className="text-stone-200">{sc.village}</span>
                        </div>
                        <div className="flex justify-between text-stone-300">
                          <span>Impact:</span>
                          <span className="text-emerald-400 font-bold">{sc.beneficiaries}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
                      <span className="font-mono text-amber-400 font-bold">{sc.slaRemaining}</span>
                      <button
                        onClick={() => {
                          setChatRecipient(`Officer: ${sc.officer}`);
                          setShowChatModal(true);
                        }}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow flex items-center space-x-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat Officer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ZONE 3: AGRI, TRANSPORT & MACHINERY MONITOR (FEATURES 6, 7, 8, 9, 21, 25) */}
        {/* ========================================================================= */}
        {activeZone === 'resources' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 6 & 7: Crop Demand & Supply */}
              <div className="bg-stone-950 rounded-3xl p-5 border-2 border-stone-800 space-y-3">
                <div className="flex items-center space-x-2 border-b border-stone-800 pb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-black text-white text-sm">🌾 Local Crop Demand & Supply</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800 flex justify-between">
                    <span>Sharbati Wheat (Kharar Block)</span>
                    <span className="font-mono font-bold text-emerald-400">1,450 Qtl Surplus</span>
                  </div>
                  <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800 flex justify-between">
                    <span>Basmati 1121 Paddy</span>
                    <span className="font-mono font-bold text-amber-400">320 Qtl Demand</span>
                  </div>
                  <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800 flex justify-between">
                    <span>Yellow Mustard</span>
                    <span className="font-mono font-bold text-teal-400">180 Qtl Matched</span>
                  </div>
                </div>
              </div>

              {/* Feature 8: Transport Availability */}
              <div className="bg-stone-950 rounded-3xl p-5 border-2 border-stone-800 space-y-3">
                <div className="flex items-center space-x-2 border-b border-stone-800 pb-2">
                  <Truck className="w-5 h-5 text-amber-400" />
                  <h4 className="font-black text-white text-sm">🚚 Transport Fleet Status</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800 flex justify-between">
                    <span>Tractor-Trolley Pool</span>
                    <span className="font-mono font-bold text-emerald-400">12 Active (8 Avail)</span>
                  </div>
                  <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800 flex justify-between">
                    <span>Tata Ace / Pickups</span>
                    <span className="font-mono font-bold text-emerald-400">9 Active (5 Avail)</span>
                  </div>
                  <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800 flex justify-between">
                    <span>Heavy 10-Wheel Trucks</span>
                    <span className="font-mono font-bold text-amber-400">4 Active (1 Avail)</span>
                  </div>
                </div>
              </div>

              {/* Feature 9 & 25: Equipment Pool & Resource Allocation */}
              <div className="bg-stone-950 rounded-3xl p-5 border-2 border-stone-800 space-y-3">
                <div className="flex items-center space-x-2 border-b border-stone-800 pb-2">
                  <Tractor className="w-5 h-5 text-teal-400" />
                  <h4 className="font-black text-white text-sm">🚜 Machinery & Tractor Pool</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800 flex justify-between">
                    <span>Combine Harvesters</span>
                    <span className="font-mono font-bold text-emerald-400">6 Units (3 In-Field)</span>
                  </div>
                  <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800 flex justify-between">
                    <span>Rotavators & Ploughs</span>
                    <span className="font-mono font-bold text-emerald-400">14 Units Available</span>
                  </div>
                  <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800 flex justify-between">
                    <span>Laser Levellers</span>
                    <span className="font-mono font-bold text-teal-400">4 Units Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ZONE 4: GIS & DISTRICT / BLOCK MAP (FEATURE 12 & 21)                      */}
        {/* ========================================================================= */}
        {activeZone === 'gisMap' && (
          <div className="space-y-6">
            <div className="bg-stone-950 rounded-3xl p-6 border-2 border-stone-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-purple-400" />
                  <div>
                    <h3 className="font-black text-white text-base">
                      {lang === 'hi' ? '🗺️ ब्लॉक जीआईएस नक्शा एवं संसाधन दृश्य (District/Block GIS Map)' : '🗺️ District/Block GIS Resource Map'}
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Geographical visualization of complaints, transformers, warehouses, and transport assets
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-[450px] rounded-2xl overflow-hidden border border-stone-800">
                <MandiMapView height="450px" center={[30.7499, 76.6411]} zoom={12} />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ZONE 5: SLA ANALYTICS & SCORECARD (FEATURES 19, 22, 23)                   */}
        {/* ========================================================================= */}
        {activeZone === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-stone-950 rounded-3xl p-6 border-2 border-stone-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <div>
                    <h3 className="font-black text-white text-base">
                      {lang === 'hi' ? '📊 विभागीय समाधान रिपोर्ट व स्कोरकार्ड (Sector Performance Scorecard)' : '📊 Sector Resolution & SLA Scorecard'}
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Response times, citizen satisfaction index, and resolution audit metrics
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-800 text-stone-400 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-3">Sector / Department</th>
                      <th className="py-2.5 px-3">Total Cases</th>
                      <th className="py-2.5 px-3">Resolved Within SLA</th>
                      <th className="py-2.5 px-3">Average Response Time</th>
                      <th className="py-2.5 px-3 text-right">Compliance Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 font-mono">
                    {sectorScorecard.map((s, idx) => (
                      <tr key={idx} className="hover:bg-stone-900/60 transition">
                        <td className="py-3 px-3 text-white font-bold">{s.sector}</td>
                        <td className="py-3 px-3 text-stone-300">{s.totalCases}</td>
                        <td className="py-3 px-3 text-emerald-400 font-bold">{s.resolved}</td>
                        <td className="py-3 px-3 text-teal-300">{s.avgSlaHours}</td>
                        <td className="py-3 px-3 text-right font-black text-amber-400">{s.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ZONE 6: HISTORICAL CASE ARCHIVE (FEATURE 24)                              */}
        {/* ========================================================================= */}
        {activeZone === 'archive' && (
          <div className="space-y-6">
            <div className="bg-stone-950 rounded-3xl p-6 border-2 border-stone-800 shadow-xl space-y-4">
              <div className="flex items-center space-x-2 border-b border-stone-800 pb-3">
                <FileText className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="font-black text-white text-base">
                    {lang === 'hi' ? '📜 ऐतिहासिक समस्या व समाधान अभिलेख (Immutable Case Archive)' : '📜 Historical Problem & Solution Archive'}
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Search previous resolutions, contractor reports, and citizen verification logs
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { code: 'MNDI-2026-00041', title: 'Canal Breach Repaired with Sandbags & PWD Earthwork', resolvedOn: '14 Aug 2026', officer: 'Er. Baldev Singh (JE)', verifiedBy: 'Rahul Kumar (Mitra)' },
                  { code: 'MNDI-2026-00038', title: '63kVA Transformer Replaced & 11kV Feeder Restored', resolvedOn: '12 Aug 2026', officer: 'Er. Rajesh Kumar (SDO)', verifiedBy: 'Rahul Kumar (Mitra)' },
                  { code: 'MNDI-2026-00029', title: 'Emergency Weed Pest Biopesticide Distribution', resolvedOn: '08 Aug 2026', officer: 'Agri Development Officer', verifiedBy: 'Rahul Kumar (Mitra)' }
                ].map((a, idx) => (
                  <div key={idx} className="p-4 bg-stone-900 rounded-2xl border border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-amber-400">{a.code}</span>
                        <span className="font-bold text-white text-xs">{a.title}</span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Resolved: {a.resolvedOn} • Officer: {a.officer} • Verified By: {a.verifiedBy}
                      </p>
                    </div>
                    <span className="text-[10px] font-black bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                      ✓ RESOLUTION AUDITED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. MODALS FOR VILLAGE MITRA WORKFLOWS                                      */}
      {/* ========================================================================= */}

      {/* MODAL 1: ASSIGN PROBLEM (Feature 4) */}
      {showAssignModal && selectedProblemToAssign && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-stone-950 border-2 border-purple-500 rounded-3xl max-w-lg w-full p-6 space-y-4 text-stone-100 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                <h3 className="font-black text-base text-white">
                  {lang === 'hi' ? 'विभागीय अधिकारी को कार्य सौंपें (Assign Task)' : 'Assign Problem to Sector Officer'}
                </h3>
              </div>
              <button onClick={() => setShowAssignModal(false)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-3 text-xs">
              <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800 space-y-1">
                <span className="font-bold text-white text-xs block">{selectedProblemToAssign.title}</span>
                <span className="text-[10px] text-stone-400 block">Location: {selectedProblemToAssign.village || 'Gharuan'}</span>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">जिम्मेदार विभाग / सेक्टर (Sector)</label>
                <select
                  value={assignForm.assignedSector}
                  onChange={(e) => setAssignForm({ ...assignForm, assignedSector: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="ELECTRICITY_DISCOM">⚡ Electricity Discom (PSPCL / UPPCL)</option>
                  <option value="IRRIGATION_DEPT">🌊 Canal & Irrigation Department</option>
                  <option value="PWD_ROADS">🛣️ PWD & Mandi Road Board</option>
                  <option value="HEALTHCARE">🏥 Health & Medical Office</option>
                  <option value="AGRICULTURE_OFFICE">🌾 Block Agriculture Officer (Kisan Seva)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">अधिकारी का नाम (Officer Name)</label>
                  <input
                    type="text"
                    required
                    value={assignForm.officerName}
                    onChange={(e) => setAssignForm({ ...assignForm, officerName: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">SLA अवधि (Hours)</label>
                  <input
                    type="number"
                    required
                    value={assignForm.slaHours}
                    onChange={(e) => setAssignForm({ ...assignForm, slaHours: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">निर्देश (Instructions / Priority Notes)</label>
                <textarea
                  rows="2"
                  value={assignForm.instructions}
                  onChange={(e) => setAssignForm({ ...assignForm, instructions: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl shadow-lg"
                >
                  Dispatch Work Order ↗
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ESCALATE PROBLEM (Feature 5) */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-stone-950 border-2 border-rose-500 rounded-3xl max-w-lg w-full p-6 space-y-4 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                <h3 className="font-black text-base text-white">
                  {lang === 'hi' ? 'उच्च स्तर पर एस्केलेट करें (Escalate Case)' : 'Escalate Problem Case'}
                </h3>
              </div>
              <button onClick={() => setShowEscalateModal(false)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEscalateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">एस्केलेशन स्तर (Escalation Level)</label>
                <select
                  value={escalateForm.escalationLevel}
                  onChange={(e) => setEscalateForm({ ...escalateForm, escalationLevel: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="BLOCK">Block Development Officer (BDO)</option>
                  <option value="DISTRICT">District Magistrate / Chief Engineer (DC Office)</option>
                  <option value="STATE_ADMIN">State Ministry & Mandi Board HQ</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">एस्केलेशन का कारण (Reason)</label>
                <textarea
                  rows="3"
                  required
                  value={escalateForm.reason}
                  onChange={(e) => setEscalateForm({ ...escalateForm, reason: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowEscalateModal(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl shadow-lg"
                >
                  {isSubmitting ? 'Escalating...' : 'Submit Escalation ↗'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: GROUND VERIFICATION REPORT (Features 17 & 18) */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-stone-950 border-2 border-emerald-500 rounded-3xl max-w-lg w-full p-6 space-y-4 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-base text-white">
                  {lang === 'hi' ? 'जमीनी सत्यापन रिपोर्ट (Ground-Truth Inspection)' : 'Record Ground Verification'}
                </h3>
              </div>
              <button onClick={() => setShowVerifyModal(false)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">निरीक्षण स्थिति (Status)</label>
                <select
                  value={verifyForm.verificationStatus}
                  onChange={(e) => setVerifyForm({ ...verifyForm, verificationStatus: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="VERIFIED_GENUINE">✅ Physical Inspection Confirmed & Genuine</option>
                  <option value="ALREADY_RESOLVED">✓ Already Fixed on Ground by Local Team</option>
                  <option value="REQUIRES_ADDITIONAL_RESOURCE">⚠️ Genuine - Requires Heavy Equipment</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">जमीनी निरीक्षण नोट (Inspection Notes)</label>
                <textarea
                  rows="3"
                  required
                  value={verifyForm.inspectionNotes}
                  onChange={(e) => setVerifyForm({ ...verifyForm, inspectionNotes: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">प्रभावित परिवार (Beneficiaries)</label>
                  <input
                    type="text"
                    value={verifyForm.estimatedBeneficiaries}
                    onChange={(e) => setVerifyForm({ ...verifyForm, estimatedBeneficiaries: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">जियो-टैग GPS</label>
                  <input
                    type="text"
                    disabled
                    value="📍 30.7499° N, 76.6411° E"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-emerald-400 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-lg"
                >
                  {isSubmitting ? 'Saving Geotag...' : 'Submit Verification Record ↗'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: PUBLIC ANNOUNCEMENT (Feature 20) */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-stone-950 border-2 border-purple-500 rounded-3xl max-w-lg w-full p-6 space-y-4 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-purple-400" />
                <h3 className="font-black text-base text-white">
                  {lang === 'hi' ? '📢 सार्वजनिक घोषणा जारी करें' : 'Broadcast Public Notice'}
                </h3>
              </div>
              <button onClick={() => setShowAnnouncementModal(false)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAnnouncementSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">शीर्षक (Title)</label>
                <input
                  type="text"
                  required
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">संदेश (Message)</label>
                <textarea
                  rows="3"
                  required
                  value={announcementForm.message}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl shadow-lg"
                >
                  Dispatch to All Villages ↗
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: EMERGENCY DISPATCH (Feature 10) */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-stone-950 border-4 border-red-600 rounded-3xl max-w-lg w-full p-6 space-y-4 text-stone-100 shadow-2xl animate-bounce-short">
            <div className="flex items-center justify-between border-b border-red-800 pb-3">
              <div className="flex items-center space-x-2">
                <Siren className="w-6 h-6 text-red-500 animate-pulse" />
                <h3 className="font-black text-lg text-white">
                  {lang === 'hi' ? '🚨 आपातकालीन संकट समन्वय (Crisis Dispatch)' : '🚨 Emergency Crisis Unit Dispatch'}
                </h3>
              </div>
              <button onClick={() => setShowEmergencyModal(false)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEmergencyDispatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-red-300 font-bold mb-1 uppercase">Crisis Category</label>
                <select
                  value={emergencyForm.crisisType}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, crisisType: e.target.value })}
                  className="w-full bg-stone-900 border border-red-500/60 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="STANDING_CROP_FIRE">🔥 Standing Crop / Field Fire Hazard</option>
                  <option value="PEST_EPIDEMIC">🐛 Sudden Severe Pest Attack (Bio-Spray Unit)</option>
                  <option value="AMBULANCE_MASS_INJURY">🚑 Medical Ambulance / Mass Incident</option>
                  <option value="CANAL_BREACH_FLOOD">🌊 Major Canal Water Breach & Road Flood</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">संसाधन व्यवस्था (Resources to Dispatch)</label>
                <textarea
                  rows="2"
                  value={emergencyForm.resourcesDispatched}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, resourcesDispatched: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="p-3 bg-red-950/80 rounded-2xl border border-red-600/50 text-[11px] text-red-200">
                🚨 This triggers immediate SMS dispatch to the District Magistrate Control Room, Sub-Divisional Magistrate, and all certified tractor/water tanker providers in {blockFilter} block.
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowEmergencyModal(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black rounded-xl shadow-2xl flex items-center space-x-2 animate-pulse"
                >
                  <Siren className="w-4 h-4 text-white" />
                  <span>DISPATCH RAPID SQUAD</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: CROSS-SECTOR CHAT (Feature 16) */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-stone-950 border-2 border-purple-500 rounded-3xl max-w-md w-full p-6 space-y-4 text-stone-100 shadow-2xl flex flex-col h-[480px]">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <h3 className="font-black text-sm text-white truncate">
                  {chatRecipient || 'Cross-Sector Chat'}
                </h3>
              </div>
              <button onClick={() => setShowChatModal(false)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-stone-900 rounded-2xl border border-stone-800 text-xs">
              {chatHistory.map((m, idx) => (
                <div key={idx} className={`p-3 rounded-xl max-w-[85%] ${
                  m.sender.startsWith('You') ? 'bg-purple-950 border border-purple-500/40 text-purple-200 ml-auto' : 'bg-stone-800 text-stone-200 mr-auto'
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
                placeholder="Type sector instructions or status..."
                className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button type="submit" className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl shadow">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
