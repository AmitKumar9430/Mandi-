import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import {
  Heart,
  Phone,
  ShieldCheck,
  Languages,
  ArrowRight,
  Sprout,
  HelpCircle
} from 'lucide-react';

export default function UserFooter() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t-4 border-pine-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-pine-600 flex items-center justify-center text-white font-black text-xl shadow-lg border border-emerald-400">
                म
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                मंडी <span className="text-emerald-400 font-mono text-sm">MANDI</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-medium">
              "समस्या बताओ। मंडी समाधान तक ले जाएगा।"
              <br />
              भारत का पहला बहुभाषी, समुदाय-संचालित जन-समस्या समाधान मंच।
            </p>
          </div>

          {/* Quick Problem Categories */}
          <div>
            <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider mb-3">
              {lang === 'hi' ? 'समस्या समाधान श्रेणियां' : 'Resolution Categories'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/user/agriculture" className="hover:text-white flex items-center space-x-1.5 transition">
                  <span>🌾</span>
                  <span>{lang === 'hi' ? 'किसान डेस्क व फसल मंडी' : 'Agriculture & Crops'}</span>
                </Link>
              </li>
              <li>
                <Link to="/user/civic" className="hover:text-white flex items-center space-x-1.5 transition">
                  <span>🚰</span>
                  <span>{lang === 'hi' ? 'गाँव की समस्याएं (Civic Desk)' : 'Village Civic Grievances'}</span>
                </Link>
              </li>
              <li>
                <Link to="/user/schemes" className="hover:text-white flex items-center space-x-1.5 transition">
                  <span>🏛️</span>
                  <span>{lang === 'hi' ? 'सरकारी कल्याण योजनाएं' : 'Government Welfare Schemes'}</span>
                </Link>
              </li>
              <li>
                <Link to="/user/problems" className="hover:text-white flex items-center space-x-1.5 transition">
                  <span>⚡</span>
                  <span>{lang === 'hi' ? 'समस्या समाधान पासपोर्ट' : 'Problem Resolution Passports'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Citizen Resources */}
          <div>
            <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider mb-3">
              {lang === 'hi' ? 'नागरिक सुविधाएं' : 'Citizen Portals'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/user/problems/create" className="hover:text-white transition">🎤 {lang === 'hi' ? 'बोलो अपनी प्रॉब्लम' : 'Voice Problem Assistant'}</Link></li>
              <li><Link to="/user/problems" className="hover:text-white transition">📋 {lang === 'hi' ? 'समस्या पासपोर्ट सूची' : 'Problem Passport Feed'}</Link></li>
              <li><Link to="/user/map" className="hover:text-white transition">🗺️ {lang === 'hi' ? 'ग्रामीण समस्या नक्शा' : 'Live Rural Issue Map'}</Link></li>
              <li><Link to="/user/pulse" className="hover:text-white transition">📈 {lang === 'hi' ? 'मंडी पल्स व एनालिटिक्स' : 'Mandi Pulse & Analytics'}</Link></li>
            </ul>
          </div>

          {/* Trust & Helpline */}
          <div className="space-y-3 bg-stone-800/60 p-4 rounded-2xl border border-stone-700">
            <h4 className="text-xs font-black uppercase text-white tracking-wider flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'hi' ? '24/7 निःशुल्क सहायता' : '24/7 Citizen Helpline'}</span>
            </h4>
            <p className="text-xs text-stone-300">
              टोल-फ्री नंबर: <strong className="text-white font-mono">1800-MANDI-SEVA</strong>
            </p>
            <p className="text-[11px] text-stone-400">
              किसी भी सरकारी अधिकारी या वालंटियर को कोई शुल्क न दें। मंडी 100% निःशुल्क जनसेवा है।
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-800 text-center text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 MANDI Platform. Dedicated to Empowering Rural India.</p>
          <div className="flex items-center space-x-4">
            <Link to="/user/dashboard" className="hover:text-white font-medium">User Dashboard</Link>
            <Link
              to="/admin/login"
              className="flex items-center space-x-1.5 px-3 py-1 bg-stone-800 hover:bg-amber-400/20 text-amber-300 rounded-xl border border-amber-500/40 font-bold transition text-xs shadow-sm"
              title="Restricted Super Admin and Operations Portal"
            >
              <span>🛡️ Admin Operations Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
