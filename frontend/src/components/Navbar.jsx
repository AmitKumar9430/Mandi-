import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Mic,
  Languages,
  User as UserIcon,
  LogOut,
  MapPin,
  Menu,
  X,
  Sprout,
  Briefcase,
  HeartHandshake,
  FileText,
  Activity,
  AlertCircle,
  HelpCircle,
  Phone,
  Shield
} from 'lucide-react';

import AshokaStambhaEmblem from './AshokaStambhaEmblem';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { to: '/user/problems', label: lang === 'hi' ? 'समस्याएं' : 'Problem Feed', icon: HelpCircle },
    { to: '/user/agriculture', label: lang === 'hi' ? 'किसान डेस्क' : 'Kisan Desk', icon: Sprout },
    { to: '/user/village-mitra', label: lang === 'hi' ? 'ग्राम मित्र' : 'Village Mitra', icon: HeartHandshake },
    { to: '/user/civic', label: lang === 'hi' ? 'गाँव की समस्या' : 'Civic Desk', icon: AlertCircle },
    { to: '/user/schemes', label: lang === 'hi' ? 'योजनाएं' : 'Schemes', icon: FileText },
    { to: '/user/map', label: lang === 'hi' ? 'नक्शा' : 'Map', icon: MapPin },
    { to: '/user/pulse', label: lang === 'hi' ? 'पल्स' : 'Pulse', icon: Activity },
  ];

  const getUserHomePath = () => {
    if (!user) return '/';
    const rawRoles = user?.roles ? (Array.isArray(user.roles) ? user.roles : [user.roles]) : ['ROLE_CITIZEN'];
    const roles = rawRoles.map((r) => {
      if (typeof r === 'string') return r;
      return r?.role || r?.name || r?.authority || String(r);
    });

    if (roles.some((r) => typeof r === 'string' && (r.includes('ADMIN') || r.includes('SUPER_ADMIN')))) {
      return '/admin/dashboard';
    }
    if (roles.some((r) => typeof r === 'string' && r.includes('FARMER'))) {
      return '/user/agriculture';
    }
    if (roles.some((r) => typeof r === 'string' && (r.includes('PROVIDER') || r.includes('SERVICE')))) {
      return '/user/provider';
    }
    if (roles.some((r) => typeof r === 'string' && (r.includes('MITRA') || r.includes('VILLAGE')))) {
      return '/user/village-mitra';
    }
    return '/user/citizen';
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ADMIN');

  return (
    <header className="sticky top-0 z-50 bg-white text-slate-800 shadow-xs border-b border-slate-200">
      {/* Topmost Tricolor Bar */}
      <div className="w-full h-1 bg-[#0A3663] flex">
        <div className="w-24 h-full bg-[#FF9933]" />
        <div className="w-24 h-full bg-white" />
        <div className="w-24 h-full bg-[#138808]" />
      </div>

      {/* Top Rural Helpline Bar */}
      <div className="bg-slate-50 text-slate-700 text-xs px-4 py-1 flex items-center justify-between font-medium border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="bg-[#0A3663] text-white px-2 py-0.5 rounded-2xs text-[10px] uppercase tracking-wider font-extrabold">
            MANDI PORTAL
          </span>
          <span className="truncate text-[11px] text-slate-600 font-semibold">
            {lang === 'hi' ? '🌾 भारत का राष्ट्रीय कृषि बाज़ार पोर्टल • हेल्पलाइन: 1800-MANDI-SEVA' : 'National Agricultural Market Portal of India — Helpline: 1800-MANDI-SEVA'}
          </span>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 font-bold bg-slate-100 hover:bg-slate-200 text-[#0A3663] px-2.5 py-0.5 rounded-2xs border border-slate-300 text-xs transition"
            title="Toggle Language"
          >
            <Languages className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>{lang === 'hi' ? 'English' : 'हिन्दी'}</span>
          </button>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo - Exact Replica of india.gov.in Header Logo */}
          <Link to={getUserHomePath()} className="flex items-center space-x-3.5 group">
            {/* Ashoka Lion Capital Pillar State Emblem of India */}
            <AshokaStambhaEmblem width={50} height={66} />

            {/* Logo Text & Dual Underline */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0A3663] tracking-tight font-sans">
                  mandi.gov.in
                </span>
                <span className="bg-[#FFBF00] text-black text-[11px] font-extrabold px-2 py-0.5 rounded-xs tracking-wide shadow-2xs uppercase">
                  BETA
                </span>
              </div>
              
              {/* Dual Colored Underline Bar (Saffron & Green) */}
              <div className="flex items-center h-1 w-full mt-0.5 rounded-full overflow-hidden">
                <div className="h-full w-[45%] bg-[#FF9933]" />
                <div className="h-full w-[55%] bg-[#138808]" />
              </div>

              <span className="text-[11px] font-bold text-[#0A3663] tracking-normal mt-0.5 font-sans">
                National Portal of India
              </span>
            </div>
          </Link>

          {/* Center Call to Action - Speak Problem */}
          <Link
            to="/submit"
            className="hidden md:flex items-center space-x-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold px-4 py-2 rounded-2xs shadow-2xs transition"
          >
            <Mic className="w-4 h-4 text-white" />
            <span className="text-sm">{lang === 'hi' ? '🎤 बोलो अपनी प्रॉब्लम' : '🎤 Speak Problem'}</span>
          </Link>

          {/* Desktop Right Links & Auth */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-black px-3 py-1.5 rounded-xl flex items-center space-x-1 transition shadow"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>ADMIN PANEL</span>
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 bg-stone-800 hover:bg-stone-700 text-stone-100 px-3.5 py-2 rounded-xl border border-stone-700 text-xs sm:text-sm font-bold"
                >
                  <UserIcon className="w-4 h-4 text-emerald-400" />
                  <span className="truncate max-w-[140px]">{user.fullName || user.phone}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-stone-200 hover:text-white text-xs sm:text-sm font-bold px-3 py-2 bg-stone-800 hover:bg-stone-700 rounded-xl border border-stone-700"
                >
                  {t.nav.login}
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black px-4 py-2 rounded-xl shadow border border-emerald-500"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Link
              to="/submit"
              className="flex items-center space-x-1 bg-emerald-600 text-white text-xs font-black px-3 py-2 rounded-xl shadow"
            >
              <Mic className="w-4 h-4" />
              <span>{lang === 'hi' ? 'समस्या' : 'Help'}</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Secondary Category Bar with Pine Green Highlights */}
        <div className="hidden lg:flex items-center space-x-2 py-2.5 border-t border-stone-800 text-xs sm:text-sm font-bold overflow-x-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-pine-600 text-white font-black shadow-md border border-emerald-400/40'
                    : 'text-stone-200 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-emerald-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-900 border-b border-stone-800 px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 p-3 rounded-xl bg-stone-800 text-stone-100 text-xs font-bold hover:bg-stone-700"
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-white truncate max-w-[200px]">{user.fullName || user.phone}</span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="text-xs font-bold text-red-400 bg-stone-800 px-3 py-1.5 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 w-full">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center p-2.5 bg-stone-800 text-white rounded-xl text-xs font-bold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center p-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
