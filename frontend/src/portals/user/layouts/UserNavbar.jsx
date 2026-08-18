import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../../../auth/UserAuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import LiveMovingTicker from '../../../components/LiveMovingTicker';
import MobileAccessModal from '../../../components/MobileAccessModal';
import NotificationBell from '../../../components/NotificationBell';
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
  QrCode,
  Smartphone
} from 'lucide-react';

export default function UserNavbar() {
  const { user, logout } = useUserAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { to: '/user/problems', label: lang === 'hi' ? 'समस्याएं' : 'Problem Feed', icon: HelpCircle },
    { to: '/user/bookings', label: lang === 'hi' ? 'बुकिंग्स व मांग' : 'Bookings Hub', icon: Briefcase },
    { to: '/user/provider-hub', label: lang === 'hi' ? 'प्रदाता हब' : 'Provider Hub', icon: HeartHandshake },
    { to: '/user/agriculture', label: lang === 'hi' ? 'किसान डेस्क' : 'Kisan Desk', icon: Sprout },
    { to: '/user/civic', label: lang === 'hi' ? 'गाँव की समस्या' : 'Civic Desk', icon: AlertCircle },
    { to: '/user/schemes', label: lang === 'hi' ? 'योजनाएं' : 'Schemes', icon: FileText },
    { to: '/user/map', label: lang === 'hi' ? 'नक्शा' : 'Map', icon: MapPin },
    { to: '/user/pulse', label: lang === 'hi' ? 'पल्स' : 'Pulse', icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur-md text-stone-100 shadow-lg border-b border-stone-800/80">
      {/* Mobile QR & Direct Link Modal */}
      <MobileAccessModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />

      {/* Live Moving Ticker */}
      <LiveMovingTicker />

      {/* Top Rural Helpline Bar */}
      <div className="bg-gradient-to-r from-pine-900 via-pine-800 to-pine-900 text-white text-xs px-4 py-1.5 flex items-center justify-between font-bold border-b border-pine-700/40">
        <div className="flex items-center space-x-2">
          <span className="bg-stone-950 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider text-emerald-300 font-black">
            MANDI CITIZEN DESK
          </span>
          <span className="truncate hidden sm:inline text-emerald-100">
            {lang === 'hi' ? '🌾 निःशुल्क ग्रामीण समस्या समाधान मंच • हेल्पलाइन: 1800-MANDI-SEVA' : 'Free Community Problem-Resolution Platform'}
          </span>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center space-x-1 font-black bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 px-2.5 py-0.5 rounded-lg border border-emerald-500/50 transition text-[11px] shadow-sm animate-pulse"
            title="Scan QR to open on Mobile Phone"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'hi' ? '📱 मोबाइल QR' : '📱 Mobile QR'}</span>
          </button>
          <Link
            to="/admin/login"
            className="flex items-center space-x-1 font-black bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-stone-950 px-2.5 py-0.5 rounded-lg border border-amber-400/40 transition text-[11px]"
            title="Go to Admin Operations Center"
          >
            <span>🛡️ Admin Portal</span>
          </Link>
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 hover:underline font-black bg-stone-950/80 hover:bg-stone-900 text-emerald-300 px-2.5 py-0.5 rounded-lg border border-pine-500/40"
            title="Toggle Language"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'English' : 'हिन्दी'}</span>
          </button>
        </div>
      </div>

      {/* Main navigation bar - Compact Single Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Logo & Tagline */}
          <Link to="/user/dashboard" className="flex items-center space-x-2.5 group flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-pine-600 to-pine-800 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform border border-emerald-400">
              म
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  मंडी <span className="text-emerald-400 font-mono text-base">ManDi</span>
                </span>
              </div>
            </div>
          </Link>

          {/* Inline Navigation Links (Sleek Compact Pills) */}
          {user && (
            <div className="hidden xl:flex items-center space-x-1 text-xs font-bold overflow-x-auto scrollbar-none py-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-pine-700 text-white font-black shadow-sm border border-emerald-400/40'
                        : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-300' : 'text-emerald-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Desktop Right Links & Auth */}
          <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
            {user ? (
              <div className="flex items-center space-x-2">
                <NotificationBell portalType="USER" />
                <Link
                  to="/user/dashboard"
                  className="flex items-center space-x-1.5 bg-stone-800/90 hover:bg-stone-700 text-stone-100 px-3 py-1.5 rounded-xl border border-stone-700/80 text-xs font-bold shadow-sm transition"
                >
                  <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate max-w-[120px]">{user.fullName || user.phone}</span>
                  {user.roles?.[0] && (
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider">
                      {String(typeof user.roles[0] === 'string' ? user.roles[0] : user.roles[0]?.role || user.roles[0]?.name || user.roles[0]?.authority || '').replace('ROLE_', '')}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/user/login');
                  }}
                  className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/user/login"
                  className="text-stone-200 hover:text-white text-xs font-bold px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded-xl border border-stone-700 transition"
                >
                  {lang === 'hi' ? 'लॉग इन' : 'Sign In'}
                </Link>
                <Link
                  to="/user/register"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow border border-emerald-500 transition"
                >
                  {lang === 'hi' ? 'नया खाता' : 'Register'}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-900 border-b border-stone-800 px-4 pt-2 pb-6 space-y-3">
          {user && (
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
          )}

          <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-white truncate max-w-[200px]">{user.fullName || user.phone}</span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/user/login');
                  }}
                  className="text-xs font-bold text-red-400 bg-stone-800 px-3 py-1.5 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 w-full">
                <Link
                  to="/user/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center p-2.5 bg-stone-800 text-white rounded-xl text-xs font-bold"
                >
                  Login
                </Link>
                <Link
                  to="/user/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center p-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowQrModal(true);
              }}
              className="flex items-center justify-center space-x-2 w-full p-2.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 rounded-xl text-xs font-black border border-emerald-500/40"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'hi' ? '📱 मोबाइल QR कोड व डायरेक्ट लिंक' : '📱 Mobile QR Code & Direct Link'}</span>
            </button>
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-2 w-full p-2.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 rounded-xl text-xs font-black border border-amber-500/40"
            >
              <span>🛡️ Go to Admin Operations Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
