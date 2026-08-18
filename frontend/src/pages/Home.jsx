import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BoloHero from '../components/BoloHero';
import { useLanguage } from '../context/LanguageContext';
import { problemApi, pulseApi, resourceApi } from '../api/client';
import {
  Sprout,
  HeartPulse,
  Briefcase,
  HeartHandshake,
  FileText,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Users,
  Clock,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Tractor,
  Building,
  PhoneCall
} from 'lucide-react';

export default function Home() {
  const { lang, t } = useLanguage();
  const [pulseData, setPulseData] = useState(null);
  const [recentProblems, setRecentProblems] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      pulseApi.getOverview().catch(() => null),
      problemApi.search({ page: 0, size: 4, sortBy: 'createdAt', direction: 'desc' }).catch(() => null),
      resourceApi.search({ page: 0, size: 4 }).catch(() => null)
    ]).then(([pulseRes, probRes, resRes]) => {
      if (pulseRes?.data) setPulseData(pulseRes.data);
      if (probRes?.data?.content) setRecentProblems(probRes.data.content);
      if (resRes?.data?.content) setResources(resRes.data.content);
      setLoading(false);
    });
  }, []);

  const categoryCards = [
    {
      key: 'AGRICULTURE',
      title: lang === 'hi' ? '🌾 किसान बाज़ार व फसल' : '🌾 Kisan Agri Desk',
      sub: lang === 'hi' ? 'फसल खरीदार, ट्रैक्टर, खाद-बीज' : 'Produce buyers, tractors, storage',
      color: 'bg-pine-800 text-white',
      border: 'border-pine-700',
      link: '/agriculture'
    },
    {
      key: 'HEALTHCARE',
      title: lang === 'hi' ? '🏥 स्वास्थ्य एवं अस्पताल गाड़ी' : '🏥 Healthcare & Medical',
      sub: lang === 'hi' ? 'अस्पताल वाहन, मरीज सेवा, दवा' : 'Patient escort, ambulance aid',
      color: 'bg-rose-900 text-white',
      border: 'border-rose-800',
      link: '/volunteer'
    },
    {
      key: 'EMPLOYMENT',
      title: lang === 'hi' ? '💼 रोज़गार व कारीगर' : '💼 Jobs & Livelihood',
      sub: lang === 'hi' ? 'दैनिक मजदूरी, मिस्त्री, टाइम बैंक' : 'Local wages, skilled workers',
      color: 'bg-stone-800 text-white',
      border: 'border-stone-700',
      link: '/jobs'
    },
    {
      key: 'SOCIAL_WELFARE',
      title: lang === 'hi' ? '📋 सरकारी योजनाएं' : '📋 Govt Schemes',
      sub: lang === 'hi' ? 'पीएम-किसान, आवास, आयुष्मान' : 'PM-Kisan, Housing, Ayushman',
      color: 'bg-emerald-900 text-white',
      border: 'border-emerald-800',
      link: '/schemes'
    },
    {
      key: 'WATER_SANITATION',
      title: lang === 'hi' ? '💧 गाँव की समस्या (Civic)' : '💧 Civic & Handpumps',
      sub: lang === 'hi' ? 'खराब हैंडपंप, नाली, बिजली फॉल्ट' : 'Broken pumps, roads, power',
      color: 'bg-teal-900 text-white',
      border: 'border-teal-800',
      link: '/civic'
    },
    {
      key: 'VOLUNTEER',
      title: lang === 'hi' ? '🤝 मंडी सेवा (Seva)' : '🤝 Community Seva',
      sub: lang === 'hi' ? 'मददगार वालंटियर सहायता' : 'Volunteer tasks and dispatch',
      color: 'bg-indigo-950 text-white',
      border: 'border-indigo-900',
      link: '/volunteer'
    },
  ];

  return (
    <div className="space-y-12">
      {/* 1. Rural Centerpiece Voice/Text Intake Hero in Pine Green */}
      <BoloHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 2. Platform Real-Time Resolution Numbers in Pine Green */}
        {pulseData && (
          <div className="bg-gradient-to-r from-pine-900 via-pine-800 to-pine-950 rounded-3xl p-6 sm:p-8 shadow-2xl text-white grid grid-cols-2 md:grid-cols-4 gap-6 border-4 border-pine-600/50 text-center">
            <div className="bg-stone-900/40 backdrop-blur-sm p-4 rounded-2xl border border-pine-700/50">
              <div className="text-3xl sm:text-5xl font-black text-white">
                {pulseData.totalProblems || 0}
              </div>
              <div className="text-xs sm:text-sm text-emerald-300 font-extrabold uppercase mt-1">
                {lang === 'hi' ? 'कुल दर्ज समस्याएं' : 'Total Problems Registered'}
              </div>
            </div>

            <div className="bg-stone-900/40 backdrop-blur-sm p-4 rounded-2xl border border-pine-700/50">
              <div className="text-3xl sm:text-5xl font-black text-emerald-400 flex items-center justify-center space-x-1">
                <span>{pulseData.resolvedProblems || 0}</span>
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-xs sm:text-sm text-emerald-300 font-extrabold uppercase mt-1">
                {lang === 'hi' ? 'हल की गई समस्याएं' : 'Successfully Resolved'}
              </div>
            </div>

            <div className="bg-stone-900/40 backdrop-blur-sm p-4 rounded-2xl border border-pine-700/50">
              <div className="text-3xl sm:text-5xl font-black text-emerald-300">
                {pulseData.resolutionRatePercentage || 0}%
              </div>
              <div className="text-xs sm:text-sm text-emerald-300 font-extrabold uppercase mt-1">
                {lang === 'hi' ? 'समाधान दर' : 'Resolution Rate'}
              </div>
            </div>

            <div className="bg-stone-900/40 backdrop-blur-sm p-4 rounded-2xl border border-pine-700/50">
              <div className="text-3xl sm:text-5xl font-black text-white">
                {pulseData.averageResolutionTimeHours || 24}h
              </div>
              <div className="text-xs sm:text-sm text-emerald-300 font-extrabold uppercase mt-1">
                {lang === 'hi' ? 'औसत समाधान समय' : 'Avg Resolution Time'}
              </div>
            </div>
          </div>
        )}

        {/* 3. Rural Category Large Touch Tiles */}
        <div className="space-y-4">
          <div>
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-pine-800 bg-pine-100 px-3 py-1 rounded-full border border-pine-300">
              {lang === 'hi' ? 'सेवा चयन (Services)' : 'Community Services'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-900 mt-2">
              {lang === 'hi' ? 'आपको किस विषय में सहायता चाहिए?' : 'Select Your Area of Assistance'}
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              {lang === 'hi' ? 'बड़ा बटन दबाकर तुरंत समाधान व सत्यापित मददगार खोजें' : 'Choose a category to find verified community resources'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoryCards.map((cat) => (
              <Link
                key={cat.key}
                to={cat.link}
                className={`group ${cat.color} p-6 rounded-3xl shadow-md hover:shadow-2xl border-4 ${cat.border} transition-all transform hover:-translate-y-1.5 flex flex-col justify-between space-y-4`}
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90 mt-2 font-medium leading-relaxed">
                    {cat.sub}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/20 text-xs sm:text-sm font-black">
                  <span>{lang === 'hi' ? 'यहाँ जाएँ' : 'Explore'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 4. Active Problems Feed with Passports */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-pine-800 bg-pine-100 px-3 py-1 rounded-full border border-pine-300">
                {lang === 'hi' ? 'ताज़ा समाधान (Live Feed)' : 'Live Problem Passports'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
                {lang === 'hi' ? 'गाँव की समस्याएं एवं समाधान प्रगति' : 'Active Problem Resolution Stream'}
              </h2>
            </div>
            <Link
              to="/problems"
              className="bg-pine-800 hover:bg-pine-900 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition flex items-center space-x-1"
            >
              <span>{lang === 'hi' ? 'सभी समस्याएं देखें' : 'View All'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentProblems.map((prob) => (
              <Link
                key={prob.id}
                to={`/problems/${prob.id}`}
                className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl border-2 border-stone-200 hover:border-pine-500 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span className="font-mono font-black text-pine-800 bg-pine-50 px-2.5 py-1 rounded-lg border-2 border-pine-300 text-xs">
                      {prob.passportCode || `MDI-2026-${prob.id}`}
                    </span>
                    <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-lg font-bold uppercase text-[11px] border">
                      {prob.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-lg leading-snug">
                    {prob.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                    "{prob.rawDescription}"
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 pt-3 border-t border-stone-100 font-semibold">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-pine-600" />
                    <span>{prob.district || 'Lucknow'}</span>
                  </span>
                  <span className="text-pine-700 font-bold flex items-center space-x-1">
                    <span>{lang === 'hi' ? 'पासपोर्ट देखें' : 'View Passport'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 5. Village Help Desk & Helpline Banner in Deep Pine Green */}
        <div className="bg-kisan-banner text-white rounded-3xl p-6 sm:p-10 shadow-2xl space-y-4 border-4 border-pine-600/40">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="bg-emerald-500 text-stone-950 font-black text-xs px-3 py-1 rounded-full uppercase">
                Toll-Free Community Helpline
              </span>
              <h3 className="text-2xl sm:text-4xl font-black">
                {lang === 'hi' ? 'फोन द्वारा समस्या दर्ज कराएं' : 'Register Problem via Free Helpline'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 max-w-xl">
                {lang === 'hi'
                  ? 'यदि आपके पास इंटरनेट या स्मार्टफोन नहीं है, तो हमारे टोल-फ्री नंबर पर कॉल करें। ग्राम मंडी मित्र आपकी समस्या दर्ज करेंगे।'
                  : 'Call our toll-free helpline. MANDI Mitra facilitators will record your issue and assign verified help.'}
              </p>
            </div>

            <div className="bg-stone-950/85 p-5 rounded-2xl border-2 border-emerald-400 flex flex-col items-center space-y-2 flex-shrink-0">
              <span className="text-xs text-emerald-300 font-bold">24/7 निःशुल्क हेल्पलाइन</span>
              <a
                href="tel:18006263473"
                className="text-xl sm:text-2xl font-black text-white hover:text-emerald-300 flex items-center space-x-2"
              >
                <PhoneCall className="w-6 h-6 text-emerald-400 animate-pulse" />
                <span>1800-MANDI-SEVA</span>
              </a>
              <span className="text-[10px] text-stone-400">Gram Panchayat & CSC Facilitated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
