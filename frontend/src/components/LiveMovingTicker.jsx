import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function LiveMovingTicker() {
  const { lang } = useLanguage();

  const tickerItems = [
    {
      id: 1,
      badge: 'WELCOME TO ManDi',
      badgeClass: 'bg-emerald-400 text-stone-950 font-black tracking-wider shadow-sm',
      text: lang === 'hi' ? '🌟 मंडी जन-समस्या समाधान मंच में आपका हार्दिक स्वागत है! (WELCOME TO ManDi)' : '🌟 WELCOME TO ManDi — Empowering Rural India with Real-Time Problem Resolution!',
      highlight: true
    },
    {
      id: 2,
      badge: lang === 'hi' ? 'मंडी विज़न' : 'VISION',
      badgeClass: 'bg-pine-600 text-white font-bold',
      text: lang === 'hi' ? '🌾 "समस्या बताओ। मंडी समाधान तक ले जाएगा।"' : '🌾 "Describe Problem. MANDI Guides You To Solution."',
      highlight: false
    },
    {
      id: 3,
      badge: '24/7 HELPLINE',
      badgeClass: 'bg-red-500 text-white font-black animate-pulse',
      text: lang === 'hi' ? '📞 100% निःशुल्क नागरिक सहायता: 1800-MANDI-SEVA • किसी को कोई शुल्क न दें' : '📞 100% Free Citizen Helpline: 1800-MANDI-SEVA • Zero Fees',
      highlight: false
    },
    {
      id: 4,
      badge: lang === 'hi' ? 'किसान डेस्क' : 'KISAN DESK',
      badgeClass: 'bg-amber-400 text-stone-950 font-bold',
      text: lang === 'hi' ? '🚜 फसल बिक्री, खरीदार मिलान व ट्रैक्टर किराया सीधे मंडी पर उपलब्ध' : '🚜 Live Crop Buyer Connect & Farm Machinery Rental Pool Active',
      link: '/user/agriculture'
    },
    {
      id: 5,
      badge: lang === 'hi' ? 'गाँव की समस्या' : 'CIVIC DESK',
      badgeClass: 'bg-teal-500 text-stone-950 font-bold',
      text: lang === 'hi' ? '🚰 खराब हैंडपंप, बिजली व सड़क की समस्या दर्ज करें और सुधार देखें' : '🚰 Report Handpump, Road & Utility Defects for Community Verification',
      link: '/user/civic'
    },
    {
      id: 6,
      badge: 'AI RESOLUTION',
      badgeClass: 'bg-emerald-500 text-stone-950 font-black',
      text: lang === 'hi' ? '⚡ बहुभाषी आवाज़ सहायता व डिजिटल समस्या पासपोर्ट सक्रिय है' : '⚡ Multi-Lingual Voice Input & Problem Passport System Live',
      link: '/user/problems/create'
    }
  ];

  return (
    <div className="bg-stone-950 text-stone-200 border-b border-pine-600/40 text-xs overflow-hidden flex items-center shadow-inner select-none h-8 sm:h-9 relative z-40">
      {/* Pinned Left "LIVE" Indicator Badge */}
      <div className="flex-shrink-0 bg-gradient-to-r from-pine-800 to-pine-900 text-white px-3 sm:px-4 h-full flex items-center space-x-1.5 font-black tracking-wider uppercase border-r border-pine-600 z-10 shadow-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <span className="text-[10px] sm:text-[11px] text-emerald-300 font-mono">LIVE</span>
      </div>

      {/* Infinite Scrolling Marquee Track */}
      <div className="overflow-hidden flex-1 relative flex items-center">
        <div className="animate-marquee inline-flex items-center space-x-8 py-1">
          {/* First set of items */}
          {tickerItems.map((item) => (
            <div key={`track1-${item.id}`} className="inline-flex items-center space-x-2 flex-shrink-0 group">
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${item.badgeClass}`}>
                {item.badge}
              </span>
              {item.link ? (
                <Link
                  to={item.link}
                  className="font-medium text-stone-200 hover:text-emerald-300 transition group-hover:underline flex items-center space-x-1"
                >
                  <span>{item.text}</span>
                  <span className="text-emerald-400 text-[10px]">↗</span>
                </Link>
              ) : (
                <span className={`font-medium ${item.highlight ? 'text-emerald-300 font-bold' : 'text-stone-200'}`}>
                  {item.text}
                </span>
              )}
              <span className="text-stone-600 font-bold ml-4">✦</span>
            </div>
          ))}

          {/* Duplicated set of items for seamless infinite loop */}
          {tickerItems.map((item) => (
            <div key={`track2-${item.id}`} className="inline-flex items-center space-x-2 flex-shrink-0 group">
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${item.badgeClass}`}>
                {item.badge}
              </span>
              {item.link ? (
                <Link
                  to={item.link}
                  className="font-medium text-stone-200 hover:text-emerald-300 transition group-hover:underline flex items-center space-x-1"
                >
                  <span>{item.text}</span>
                  <span className="text-emerald-400 text-[10px]">↗</span>
                </Link>
              ) : (
                <span className={`font-medium ${item.highlight ? 'text-emerald-300 font-bold' : 'text-stone-200'}`}>
                  {item.text}
                </span>
              )}
              <span className="text-stone-600 font-bold ml-4">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
