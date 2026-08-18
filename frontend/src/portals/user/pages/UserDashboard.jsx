import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserAuth } from '../../../auth/UserAuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { userProblemApi, userAgriApi } from '../../../shared/api/userApi';
import {
  FileText,
  Sprout,
  PlusCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileSpreadsheet,
  MapPin,
  Sparkles,
  UserCheck,
  Award,
  Crown,
  Briefcase,
  HelpCircle,
  Truck
} from 'lucide-react';
import MandiVillageMitraCard from '../../../components/mitra/MandiVillageMitraCard';
import FarmerProducerDashboard from './FarmerProducerDashboard';
import CitizenResidentDashboard from './CitizenResidentDashboard';
import EquipmentTransportProviderDashboard from './EquipmentTransportProviderDashboard';
import VillageMitraDistrictDashboard from './VillageMitraDistrictDashboard';

const ROLE_METADATA = {
  ROLE_CITIZEN: {
    titleHi: 'नागरिक (Citizen)',
    titleEn: 'Citizen / Community Resident',
    icon: '👤',
    color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    descHi: 'जन-समस्या समाधान, सरकारी योजनाएं व गाँव शिकायत ट्रैकिंग',
    descEn: 'Problem reporting, government schemes & civic passport tracking'
  },
  ROLE_FARMER: {
    titleHi: 'किसान (Farmer)',
    titleEn: 'Farmer / Agricultural Producer',
    icon: '🌾',
    color: 'bg-amber-100 text-amber-900 border-amber-300',
    descHi: 'फसल लिस्टिंग, मंडी भाव, ट्रैक्टर किराया व कृषि उपकरण पूल',
    descEn: 'Direct crop listings, mandi rates, tractor hire & farm machinery pool'
  },
  ROLE_SERVICE_PROVIDER: {
    titleHi: 'सेवा / उपकरण प्रदाता (Provider)',
    titleEn: 'Equipment & Transport Provider',
    icon: '🚜',
    color: 'bg-blue-100 text-blue-900 border-blue-300',
    descHi: 'ट्रैक्टर, कंबाइन हार्वेस्टर, लोडिंग वाहन व उपकरण रेंटल',
    descEn: 'Tractor fleet, harvester rentals, transport & logistics'
  },
  ROLE_MANDI_MITRA: {
    titleHi: 'मंडी मित्र (MANDI Mitra)',
    titleEn: 'MANDI Village Mitra',
    icon: '🌟',
    color: 'bg-purple-100 text-purple-900 border-purple-300',
    descHi: 'गाँव डिजिटल सहायक, समाधान मार्गदर्शन व फील्ड समन्वय',
    descEn: 'Village digital facilitator, KYC assistance & local problem coordinator'
  },
  ROLE_WORKER: {
    titleHi: 'कारीगर / श्रमिक (Worker)',
    titleEn: 'Skilled Artisan / Laborer',
    icon: '🛠️',
    color: 'bg-orange-100 text-orange-900 border-orange-300',
    descHi: 'पंप मरम्मत, इलेक्ट्रीशियन, राजमिस्त्री व टाइम-बैंक सेवा',
    descEn: 'Pump repair, carpentry, electrical & daily wage services'
  },
  ROLE_VOLUNTEER: {
    titleHi: 'मंडी स्वयंसेवक (Volunteer)',
    titleEn: 'MANDI Seva Volunteer',
    icon: '🤝',
    color: 'bg-teal-100 text-teal-900 border-teal-300',
    descHi: 'मंडी सेवा, मरीज़ अस्पताल सहायता व टाइम बैंक घंटे',
    descEn: 'Community volunteering, patient escort & TimeBank credits'
  },
  ROLE_NGO: {
    titleHi: 'गैर-सरकारी संगठन (NGO)',
    titleEn: 'NGO / Welfare Organization',
    icon: '🏢',
    color: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    descHi: 'सामाजिक राहत, कल्याणकारी सहायता व समुदाय सशक्तिकरण',
    descEn: 'Community relief, welfare programs & social assistance'
  },
  ROLE_SUPER_ADMIN: {
    titleHi: 'सुपर एडमिन (Super Admin)',
    titleEn: 'Super Administrator',
    icon: '👑',
    color: 'bg-amber-200 text-amber-950 border-amber-400',
    descHi: 'पूर्ण प्रशासनिक अधिकार एवं व्यवस्थापक प्रबंधन',
    descEn: 'Root system administration & user provisioning'
  },
  ROLE_ADMIN: {
    titleHi: 'व्यवस्थापक (Admin)',
    titleEn: 'System Administrator',
    icon: '🛡️',
    color: 'bg-emerald-200 text-emerald-950 border-emerald-400',
    descHi: 'प्रशासनिक मॉडरेशन व केन्द्रीय समाधान नियंत्रण',
    descEn: 'Platform administration & solution dispatch'
  }
};

export default function UserDashboard() {
  const { user } = useUserAuth();
  const { lang, t } = useLanguage();

  const [myProblems, setMyProblems] = useState([]);
  const [myCrops, setMyCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      userProblemApi.getMyProblems ? userProblemApi.getMyProblems().catch(() => ({ data: { content: [] } })) : Promise.resolve({ data: { content: [] } }),
      userAgriApi.getMyCrops ? userAgriApi.getMyCrops().catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
    ]).then(([probRes, cropRes]) => {
      if (probRes?.data?.content) setMyProblems(probRes.data.content);
      else if (Array.isArray(probRes?.data)) setMyProblems(probRes.data);
      if (cropRes?.data && Array.isArray(cropRes.data)) setMyCrops(cropRes.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Please login to access your Dashboard</h2>
        <Link to="/user/login" className="bg-pine-700 text-white font-bold px-5 py-2.5 rounded-xl inline-block">
          Login Now
        </Link>
      </div>
    );
  }

  const { isFarmer, isCitizen, isProvider, isMitra } = useUserAuth();
  const rawRoles = user?.roles ? (Array.isArray(user.roles) ? user.roles : [user.roles]) : ['ROLE_CITIZEN'];
  const userRoles = rawRoles.map(r => {
    if (typeof r === 'string') return r;
    return r?.role || r?.name || r?.authority || 'ROLE_CITIZEN';
  });

  // 1. When MANDI Village Mitra logs in, render dedicated 25-feature District/Block Coordination Dashboard
  if (isMitra || userRoles.some(r => typeof r === 'string' && (r.includes('MITRA') || r.includes('COORDINATOR')))) {
    return <VillageMitraDistrictDashboard />;
  }

  // 2. When equipment/transport provider logs in, render dedicated 24-feature Provider Dashboard
  if (isProvider || userRoles.some(r => typeof r === 'string' && (r.includes('PROVIDER') || r.includes('TRANSPORT')))) {
    return <EquipmentTransportProviderDashboard />;
  }

  // 3. When farmer/producer role user logs in, render dedicated 18-feature Farmer Dashboard
  if (isFarmer || userRoles.some(r => typeof r === 'string' && r.includes('FARMER'))) {
    return <FarmerProducerDashboard />;
  }

  // 4. When citizen/resident role user logs in (or default resident), render dedicated 20-feature Citizen Dashboard
  if (isCitizen || userRoles.some(r => typeof r === 'string' && (r.includes('CITIZEN') || r.includes('USER'))) || userRoles.length === 0) {
    return <CitizenResidentDashboard />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Profile Header with Prominent Logged-In Role Identification */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-stone-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-pine-700 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-emerald-400 flex-shrink-0">
              {user.fullName ? user.fullName[0] : 'U'}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h1 className="text-2xl font-black text-stone-900">{user.fullName || user.phone}</h1>
                <span className="text-emerald-800 bg-emerald-50 text-[10px] font-black px-2.5 py-0.5 rounded-lg border border-emerald-300 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>VERIFIED CITIZEN PASSPORT</span>
                </span>
              </div>
              
              <p className="text-xs text-stone-500 font-medium">
                📞 {user.phone} {user.email && <>• ✉️ {user.email}</>}
              </p>
            </div>
          </div>

          <Link
            to="/user/problems/create"
            className="bg-pine-700 hover:bg-pine-800 text-white font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md transition flex items-center space-x-2 border border-emerald-500 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'hi' ? '🎤 नई समस्या दर्ज करें' : 'Post New Problem'}</span>
          </Link>
        </div>

        {/* 2. Logged-In Role Badges & Capabilities Showcase */}
        <div className="pt-4 border-t border-stone-200 space-y-3">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-pine-700" />
            <span className="text-xs font-black uppercase text-stone-700 tracking-wider">
              {lang === 'hi' ? 'आपकी अधिकृत भूमिका एवं अधिकार (Your Active Roles)' : 'Your Active Role & Account Privileges'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {userRoles.map((roleKey, idx) => {
              const roleKeyStr = typeof roleKey === 'string' ? roleKey : String(roleKey);
              const meta = ROLE_METADATA[roleKeyStr] || {
                titleHi: roleKeyStr.replace('ROLE_', ''),
                titleEn: roleKeyStr.replace('ROLE_', ''),
                icon: '👤',
                color: 'bg-stone-100 text-stone-900 border-stone-300',
                descHi: 'सत्यापित ग्रामीण नागरिक पोर्टल सदस्य',
                descEn: 'Verified community platform member'
              };

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border-2 ${meta.color} flex items-start space-x-3 transition shadow-xs`}
                >
                  <span className="text-2xl flex-shrink-0">{meta.icon}</span>
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-black text-xs">
                        {lang === 'hi' ? meta.titleHi : meta.titleEn}
                      </h4>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-black/10 font-bold">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-[11px] opacity-80 leading-relaxed font-medium">
                      {lang === 'hi' ? meta.descHi : meta.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Grid: My Problems & Quick Community Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Problems Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-stone-200 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-pine-700" />
              <h2 className="text-lg font-bold text-stone-900">
                {lang === 'hi' ? 'मेरी समस्याएं (My Problems)' : 'My Problems & Passports'}
              </h2>
            </div>
            <span className="text-xs font-semibold text-stone-500">{myProblems.length} Active</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-stone-500 font-medium">Loading...</div>
          ) : myProblems.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-xs text-stone-500">You haven't submitted any problems yet.</p>
              <Link to="/user/problems/create" className="text-xs font-bold text-pine-700 hover:underline">
                + Report a problem
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myProblems.map((p) => (
                <Link
                  key={p.id}
                  to={`/user/problems/${p.id}`}
                  className="block p-4 rounded-2xl bg-stone-50 hover:bg-pine-50/50 border border-stone-200 transition space-y-1"
                >
                  <div className="flex justify-between text-xs">
                    <span className="font-mono font-black text-pine-800">{p.passportCode || `MDI-2026-${p.id}`}</span>
                    <span className="font-semibold text-stone-600 uppercase text-[10px]">{p.status}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">{p.title}</h4>
                  <p className="text-xs text-stone-500 line-clamp-1">"{p.rawDescription}"</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Community Resolution Shortcuts Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-stone-200 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-pine-700" />
              <h2 className="text-lg font-bold text-stone-900">
                {lang === 'hi' ? 'त्वरित ग्रामीण सेवाएं (Quick Services)' : 'Quick Resolution Hub'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/user/agriculture"
              className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 transition space-y-1 block"
            >
              <span className="text-2xl">🌾</span>
              <h4 className="font-black text-stone-900 text-sm">{lang === 'hi' ? 'किसान व फसल मंडी' : 'Kisan & Crops'}</h4>
              <p className="text-[11px] text-stone-600 font-medium">
                {lang === 'hi' ? 'फसल बिक्री व ट्रैक्टर किराया' : 'Sell produce & hire tractor'}
              </p>
            </Link>

            <Link
              to="/user/civic"
              className="p-4 rounded-2xl bg-teal-50 hover:bg-teal-100/70 border border-teal-200 transition space-y-1 block"
            >
              <span className="text-2xl">🚰</span>
              <h4 className="font-black text-stone-900 text-sm">{lang === 'hi' ? 'गाँव की समस्या (Civic)' : 'Civic Grievance'}</h4>
              <p className="text-[11px] text-stone-600 font-medium">
                {lang === 'hi' ? 'हैंडपंप, सड़क व बिजली शिकायत' : 'Handpump & rural infrastructure'}
              </p>
            </Link>

            <Link
              to="/user/schemes"
              className="p-4 rounded-2xl bg-blue-50 hover:bg-blue-100/70 border border-blue-200 transition space-y-1 block"
            >
              <span className="text-2xl">🏛️</span>
              <h4 className="font-black text-stone-900 text-sm">{lang === 'hi' ? 'सरकारी योजनाएं' : 'Welfare Schemes'}</h4>
              <p className="text-[11px] text-stone-600 font-medium">
                {lang === 'hi' ? 'किसान, आवास व पेंशन योजना' : 'PM-Kisan & housing schemes'}
              </p>
            </Link>

            <Link
              to="/user/map"
              className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100/70 border border-amber-200 transition space-y-1 block"
            >
              <span className="text-2xl">🗺️</span>
              <h4 className="font-black text-stone-900 text-sm">{lang === 'hi' ? 'समस्या नक्शा' : 'Live Map'}</h4>
              <p className="text-[11px] text-stone-600 font-medium">
                {lang === 'hi' ? 'आस-पास के समाधान देखें' : 'View nearby solutions on map'}
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* MANDI Village Mitra Local Coordination Card */}
      <MandiVillageMitraCard user={user} />
    </div>
  );
}
