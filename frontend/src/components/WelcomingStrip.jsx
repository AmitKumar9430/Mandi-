import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Heart, Sprout, ShieldCheck, Sun } from 'lucide-react';

export default function WelcomingStrip() {
  const { lang } = useLanguage();

  const welcomePhrases = [
    {
      id: 1,
      tag: 'WELCOME TO ManDi',
      tagColor: 'bg-emerald-600 text-white font-black shadow-xs',
      text: lang === 'hi'
        ? '🌾 मंडी डिजिटल समाधान मंच में आपका हार्दिक स्वागत है! (WELCOME TO ManDi)'
        : '🌾 Hearty Welcome to MANDI — Empowering Rural India Through Real-Time Resolution!',
      highlight: true
    },
    {
      id: 2,
      tag: lang === 'hi' ? 'जन सेवा' : 'PUBLIC SEVA',
      tagColor: 'bg-pine-700 text-white font-bold',
      text: lang === 'hi'
        ? '✨ "समस्या बताओ। मंडी समाधान तक ले जाएगा।" • 100% निःशुल्क जन-समस्या समाधान'
        : '✨ "Describe Problem. MANDI Guides You To Solution." • 100% Free Public Service',
      highlight: false
    },
    {
      id: 3,
      tag: lang === 'hi' ? 'सशक्त किसान' : 'EMPOWERMENT',
      tagColor: 'bg-amber-600 text-white font-black',
      text: lang === 'hi'
        ? '🚜 किसान उपज बिक्री, ट्रैक्टर-हार्वेस्टर किराया, सरकारी योजनाएं व 24/7 हेल्पलाइन: 1800-MANDI-SEVA'
        : '🚜 Direct Crop Sales, Farm Machinery Rental Pool, Welfare Schemes & 24/7 Support: 1800-MANDI-SEVA',
      highlight: false
    },
    {
      id: 4,
      tag: lang === 'hi' ? 'जुड़ें आज ही' : 'JOIN TODAY',
      tagColor: 'bg-teal-600 text-white font-black',
      text: lang === 'hi'
        ? '🤝 नागरिक, किसान व सेवा प्रदाता — मंडी परिवार का हिस्सा बनें!'
        : '🤝 Join Thousands of Citizens, Farmers & Service Providers Resolving Local Problems Together!',
      highlight: true
    }
  ];

  return (
    <div className="w-full bg-gradient-to-r from-emerald-50 via-pine-50/80 to-amber-50/70 border-y-2 border-pine-500/30 py-3.5 shadow-sm overflow-hidden select-none relative z-30">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        
        {/* Left Welcoming Pill */}
        <div className="flex-shrink-0 mr-4 z-10 hidden sm:flex items-center space-x-2 bg-pine-900 text-white px-3.5 py-1.5 rounded-2xl shadow-md border border-emerald-400">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs font-black tracking-wide uppercase font-mono">
            {lang === 'hi' ? 'स्वागतम् • WELCOME' : 'WELCOME TO ManDi'}
          </span>
        </div>

        {/* Marquee Moving Content */}
        <div className="overflow-hidden flex-1 relative flex items-center">
          <div className="animate-marquee inline-flex items-center space-x-8 whitespace-nowrap cursor-default">
            {/* Set 1 */}
            {welcomePhrases.map((phrase) => (
              <div key={`w1-${phrase.id}`} className="inline-flex items-center space-x-2.5 flex-shrink-0">
                <span className={`px-2.5 py-0.5 rounded-xl text-[11px] uppercase tracking-wider ${phrase.tagColor}`}>
                  {phrase.tag}
                </span>
                <span className={`text-xs sm:text-sm font-black ${
                  phrase.highlight ? 'text-pine-950' : 'text-stone-800'
                }`}>
                  {phrase.text}
                </span>
                <span className="text-pine-400 font-bold ml-4">✦</span>
              </div>
            ))}

            {/* Set 2 (for seamless continuous loop) */}
            {welcomePhrases.map((phrase) => (
              <div key={`w2-${phrase.id}`} className="inline-flex items-center space-x-2.5 flex-shrink-0">
                <span className={`px-2.5 py-0.5 rounded-xl text-[11px] uppercase tracking-wider ${phrase.tagColor}`}>
                  {phrase.tag}
                </span>
                <span className={`text-xs sm:text-sm font-black ${
                  phrase.highlight ? 'text-pine-950' : 'text-stone-800'
                }`}>
                  {phrase.text}
                </span>
                <span className="text-pine-400 font-bold ml-4">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
