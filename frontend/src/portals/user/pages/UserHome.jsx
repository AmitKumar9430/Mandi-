import React from 'react';
import { Link } from 'react-router-dom';
import BoloHero from '../../../components/BoloHero';
import { useLanguage } from '../../../context/LanguageContext';
import {
  Sprout,
  Briefcase,
  HeartHandshake,
  FileSpreadsheet,
  AlertOctagon,
  MapPin,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass
} from 'lucide-react';

export default function UserHome() {
  const { lang, t } = useLanguage();

  const serviceTiles = [
    {
      to: '/user/agriculture',
      title: lang === 'hi' ? 'किसान डेस्क व फसल मंडी' : 'Kisan Desk & Agri Market',
      desc: lang === 'hi' ? 'फसल बिक्री, ट्रैक्टर व हार्वेस्टर किराया, मंडी भाव' : 'Sell produce, rent tractors & combine harvesters',
      icon: '🌾',
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-950'
    },
    {
      to: '/user/civic',
      title: lang === 'hi' ? 'गाँव की समस्याएं (Civic Desk)' : 'Village Civic Grievance',
      desc: lang === 'hi' ? 'खराब हैंडपंप, टूटी सड़क, ट्रांसफार्मर खराबी शिकायत' : 'Broken handpumps, road defects, power failure reports',
      icon: '🚰',
      bg: 'bg-teal-50 border-teal-300 text-teal-950'
    },
    {
      to: '/user/schemes',
      title: lang === 'hi' ? 'सरकारी कल्याण योजनाएं' : 'Government Welfare Schemes',
      desc: lang === 'hi' ? 'पीएम किसान, ग्रामीण आवास व कृषि सब्सिडी' : 'PM-Kisan, rural housing & farm subsidies',
      icon: '🏛️',
      bg: 'bg-blue-50 border-blue-300 text-blue-950'
    },
    {
      to: '/user/problems',
      title: lang === 'hi' ? 'समस्या समाधान व पासपोर्ट' : 'Problem Feed & Solutions',
      desc: lang === 'hi' ? 'दर्ज समस्याएं, समाधान ग्राफ व डिजिटल पासपोर्ट' : 'Track submitted issues, solution graphs & passports',
      icon: '⚡',
      bg: 'bg-amber-50 border-amber-300 text-amber-950'
    },
    {
      to: '/user/map',
      title: lang === 'hi' ? 'समस्या व संसाधन नक्शा' : 'Live Problem & Resource Map',
      desc: lang === 'hi' ? 'गाँव व ज़िले के समाधान व संसाधन जीपीएस नक्शे पर देखें' : 'View nearby solutions and resources on live map',
      icon: '🗺️',
      bg: 'bg-stone-100 border-stone-300 text-stone-900'
    },
    {
      to: '/user/pulse',
      title: lang === 'hi' ? 'मंडी पल्स (Mandi Pulse)' : 'Mandi Pulse & Analytics',
      desc: lang === 'hi' ? 'गाँव-वार समाधान दर व लाइव प्रगति चार्ट' : 'Real-time district resolution velocity & metrics',
      icon: '📈',
      bg: 'bg-purple-50 border-purple-300 text-purple-950'
    }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* 1. Bolo Hero Interactive Voice & Camera Assistant */}
      <BoloHero />

      {/* 2. Primary Service Tiles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase text-pine-700 tracking-wider">
            {lang === 'hi' ? 'नागरिक सेवा केंद्र' : 'Community Services'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            {lang === 'hi' ? 'आपकी हर ज़रूरत का व्यावहारिक समाधान' : 'Practical Solutions For Real Needs'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {serviceTiles.map((tile, idx) => (
            <Link
              key={idx}
              to={tile.to}
              className={`p-6 rounded-3xl border-2 transition transform hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between space-y-3 ${tile.bg}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl">{tile.icon}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center space-x-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black text-stone-900">{tile.title}</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{tile.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
