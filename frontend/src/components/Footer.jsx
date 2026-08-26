import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, PhoneCall, Heart, MapPin, Sparkles } from 'lucide-react';

export default function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-12 pb-8 mt-16 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-mandi-500 flex items-center justify-center text-stone-950 font-bold text-lg">
                म
              </div>
              <span className="text-xl font-bold text-white">MANDI</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {lang === 'hi'
                ? '“समस्या बताओ, समाधान तक ले जाएगा।” ग्रामीण एवं जन-समुदाय समस्या समाधान, संसाधन बैंक व सेवा नेटवर्क।'
                : '“Describe Problem. MANDI Guides You To Solution.” AI-assisted community problem-resolution platform.'}
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-krishi-500 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'hi' ? '100% निःशुल्क एवं सत्यापित नेटवर्क' : '100% Free & Verified Community'}</span>
            </div>
            <div className="pt-2 border-t border-stone-800 space-y-1 text-xs">
              <div className="flex items-center space-x-1 text-stone-300">
                <span className="text-stone-400 font-medium">Founder:</span>
                <a
                  href="https://www.linkedin.com/in/abhishek-kumar-23bcs12748/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-amber-400 hover:text-white hover:underline transition inline-flex items-center space-x-1"
                >
                  <span>Abhishek Kumar</span>
                  <svg className="w-3 h-3 text-[#0077B5] fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                </a>
              </div>
              <div className="flex items-center space-x-1 text-stone-300">
                <span className="text-stone-400 font-medium">Co-Founder:</span>
                <a
                  href="https://www.linkedin.com/in/amit-kumar-9t5m2i3a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-amber-400 hover:text-white hover:underline transition inline-flex items-center space-x-1"
                >
                  <span>Amit Kumar</span>
                  <svg className="w-3 h-3 text-[#0077B5] fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {lang === 'hi' ? 'प्रमुख सेवाएँ' : 'Core Services'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link to="/user/problems/create" className="hover:text-white transition">🎤 {lang === 'hi' ? 'बोलो अपनी प्रॉब्लम' : 'Speak Problem'}</Link></li>
              <li><Link to="/user/agriculture" className="hover:text-white transition">🌾 {lang === 'hi' ? 'किसान डेस्क व मंडी' : 'Kisan Desk & Crops'}</Link></li>
              <li><Link to="/user/civic" className="hover:text-white transition">🚰 {lang === 'hi' ? 'गाँव की समस्या (Civic)' : 'Civic Grievances'}</Link></li>
              <li><Link to="/user/schemes" className="hover:text-white transition">🏛️ {lang === 'hi' ? 'सरकारी योजनाएं' : 'Welfare Schemes'}</Link></li>
              <li><Link to="/user/map" className="hover:text-white transition">🗺️ {lang === 'hi' ? 'समस्या व संसाधन नक्शा' : 'Live Map'}</Link></li>
              <li><Link to="/user/pulse" className="hover:text-white transition">📈 {lang === 'hi' ? 'मंडी पल्स' : 'Mandi Pulse'}</Link></li>
            </ul>
          </div>

          {/* Trust & Verification */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {lang === 'hi' ? 'पारदर्शिता एवं सहायता' : 'Trust & Verification'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link to="/pulse" className="hover:text-white transition">📊 {t.nav.pulse}</Link></li>
              <li><Link to="/map" className="hover:text-white transition">🗺️ {t.nav.map}</Link></li>
              <li><Link to="/problems" className="hover:text-white transition">🔍 {t.nav.problems}</Link></li>
              <li className="flex items-center space-x-1 text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>MANDI Mitra Network</span>
              </li>
            </ul>
          </div>

          {/* Helpline & Ground Support */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {lang === 'hi' ? 'गाँव सहायता केंद्र (Help Desk)' : 'Community Help Desk'}
            </h4>
            <div className="bg-stone-800 p-3 rounded-xl border border-stone-700 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-mandi-400 font-bold">
                <PhoneCall className="w-4 h-4" />
                <span>Toll-Free: 1800-MANDI-SEVA</span>
              </div>
              <p className="text-[11px] text-stone-400">
                {lang === 'hi' ? 'फोन या WhatsApp द्वारा समस्या दर्ज कराने के लिए उपलब्ध।' : 'Available for phone and assisted complaint registration.'}
              </p>
              <div className="text-[10px] text-stone-500 pt-1 border-t border-stone-700">
                Gram Panchayat & CSC Facilitated
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} MANDI — Community Problem-Resolution Platform. Built for India's heartland.</p>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0">
            <span>Privacy Preserved (Approx Geo Fuzzing)</span>
            <span>•</span>
            <span>No Dead-End Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
