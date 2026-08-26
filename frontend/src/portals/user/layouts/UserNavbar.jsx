import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../../../auth/UserAuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import MobileAccessModal from '../../../components/MobileAccessModal';
import NotificationBell from '../../../components/NotificationBell';
import AshokaStambhaEmblem from '../../../components/AshokaStambhaEmblem';
import {
  Search,
  Calendar as CalendarIcon,
  Globe,
  Eye,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Shield,
  QrCode,
  Info,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function UserNavbar() {
  const { user, logout } = useUserAuth();
  const { lang, setLang, fontSize, setFontSize } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [searchCategory, setSearchCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const cleanQuery = searchQuery.trim();
    const queryParams = new URLSearchParams();
    if (cleanQuery) queryParams.append('search', cleanQuery);
    if (searchCategory !== 'All Categories') queryParams.append('category', searchCategory);
    
    navigate(`/mandi-prices?${queryParams.toString()}`);
  };

  const handleSkipToMainContent = (e) => {
    e.preventDefault();
    const mainElement = document.getElementById('main-content');
    if (mainElement) {
      mainElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

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

  const currentDateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="w-full bg-white font-sans text-slate-800 border-b border-slate-200 select-none shadow-xs">
      <MobileAccessModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />

      {/* Official Mandi Operating Calendar Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-slate-300 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2 text-[#0A3663]">
                <CalendarIcon className="w-5 h-5 text-[#DC2626]" />
                <h3 className="font-extrabold text-base font-serif">Mandi Operating Calendar</h3>
              </div>
              <button
                onClick={() => setShowCalendarModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-2xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="bg-slate-50 p-3 rounded-2xs border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Today's Date</span>
                <span className="font-extrabold text-slate-900 text-sm block font-mono">{currentDateStr}</span>
                <span className="text-[11px] text-emerald-700 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>All APMC Grain Markets Open & Operational</span>
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold uppercase text-[11px] text-[#0A3663] border-b border-slate-100 pb-1">
                  Standard APMC Market Hours
                </h4>
                <ul className="space-y-1.5 text-[11px]">
                  <li className="flex justify-between">
                    <span>Morning Gate Entry & Weighbridge:</span>
                    <strong className="font-mono">06:00 AM – 10:00 AM</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Live E-Auction Bidding Hall:</span>
                    <strong className="font-mono">10:30 AM – 03:00 PM</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Produce Dispatch & Transit Permits:</span>
                    <strong className="font-mono">03:30 PM – 08:00 PM</strong>
                  </li>
                </ul>
              </div>

              <div className="p-2.5 bg-amber-50 rounded-2xs border border-amber-200 text-[11px] text-amber-900 font-medium">
                📅 Next Gazetted APMC Mandi Holiday: 2 October (Gandhi Jayanti)
              </div>
            </div>

            <button
              onClick={() => setShowCalendarModal(false)}
              className="w-full bg-[#0A3663] hover:bg-[#072545] text-white font-extrabold py-2 rounded-2xs text-xs transition"
            >
              Close Calendar
            </button>
          </div>
        </div>
      )}

      {/* Official Tricolor Portal Info Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-slate-300 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2 text-[#0A3663]">
                <div className="flex items-center space-x-0.5 w-5 h-3.5 overflow-hidden border border-slate-300 rounded-2xs">
                  <div className="w-1.5 h-full bg-[#FF9933]" />
                  <div className="w-1.5 h-full bg-white" />
                  <div className="w-1.5 h-full bg-[#138808]" />
                </div>
                <h3 className="font-extrabold text-base font-serif">Government of India Portal</h3>
              </div>
              <button
                onClick={() => setShowFlagModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <p className="font-bold text-[#0A3663]">mandi.gov.in — National Agricultural Market Portal</p>
              <p>
                Managed under the Ministry of Agriculture & Farmers Welfare, Government of India. Providing single-window transparent access to daily APMC commodity prices, e-auctions, and farmer welfare services.
              </p>
            </div>

            <button
              onClick={() => setShowFlagModal(false)}
              className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold py-2 rounded-2xs text-xs transition"
            >
              Understand & Continue
            </button>
          </div>
        </div>
      )}

      {/* Topmost Tricolor Strip */}
      <div className="w-full h-1 bg-[#0A3663] flex">
        <div className="w-24 h-full bg-[#FF9933]" />
        <div className="w-24 h-full bg-white" />
        <div className="w-24 h-full bg-[#138808]" />
      </div>

      {/* 1. TOPMOST UTILITY BAR */}
      <div className="bg-slate-50 border-b border-slate-200 text-[11px] px-4 sm:px-6 lg:px-8 py-1 flex flex-wrap justify-between items-center text-slate-600 font-medium">
        
        <div className="flex items-center space-x-2">
          <Link to={getUserHomePath()} className="font-bold text-[#0A3663] hover:underline">
            mandi.gov.in
          </Link>
          <span className="text-slate-300">|</span>
          <Link to={getUserHomePath()} className="text-slate-500 hover:text-slate-800">
            National Portal of Agricultural Markets
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="#main-content"
            onClick={handleSkipToMainContent}
            className="hover:underline hover:text-[#DC2626]"
          >
            Skip to main content
          </a>
          <span className="text-slate-300">|</span>
          
          <button
            onClick={() => setShowCalendarModal(true)}
            className="flex items-center space-x-1 hover:text-[#0A3663] cursor-pointer"
            title="View Official Mandi Calendar & Hours"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-slate-500 hover:text-[#DC2626]" />
          </button>
          <span className="text-slate-300">|</span>

          {/* Language Selector */}
          <div className="flex items-center space-x-1">
            <Globe className="w-3.5 h-3.5 text-slate-500 mr-0.5" />
            <button
              onClick={() => setLang('en')}
              className={`hover:text-[#DC2626] ${lang === 'en' ? 'font-bold text-[#DC2626] underline' : 'text-slate-600'}`}
            >
              English
            </button>
            <span>|</span>
            <button
              onClick={() => setLang('hi')}
              className={`hover:text-[#DC2626] ${lang === 'hi' ? 'font-bold text-[#DC2626] underline' : 'text-slate-600'}`}
            >
              हिंदी
            </button>
            <span>|</span>
            <button
              onClick={() => setLang('pa')}
              className={`hover:text-[#DC2626] ${lang === 'pa' ? 'font-bold text-[#DC2626] underline' : 'text-slate-600'}`}
            >
              ਪੰਜਾਬੀ
            </button>
          </div>
          <span className="text-slate-300">|</span>

          {/* Font Size A-|A|A+ */}
          <div className="flex items-center space-x-1 font-bold text-slate-700">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-0.5 hover:text-[#DC2626] ${fontSize === 'normal' ? 'text-[#DC2626] underline' : ''}`}
              title="Normal Font Size"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-0.5 hover:text-[#DC2626] ${fontSize === 'large' ? 'text-[#DC2626] underline' : ''}`}
              title="Large Font Size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-0.5 hover:text-[#DC2626] ${fontSize === 'xlarge' ? 'text-[#DC2626] underline' : ''}`}
              title="Extra Large Font Size"
            >
              A+
            </button>
          </div>
          <span className="text-slate-300">|</span>

          {/* Indian Tricolor Icon Accent */}
          <button
            onClick={() => setShowFlagModal(true)}
            className="flex items-center space-x-0.5 w-4 h-3 overflow-hidden border border-slate-300 rounded-2xs cursor-pointer hover:opacity-80"
            title="Government of India Official Portal Information"
          >
            <div className="w-1.5 h-full bg-[#FF9933]" />
            <div className="w-1.5 h-full bg-white" />
            <div className="w-1.5 h-full bg-[#138808]" />
          </button>

          <span className="text-slate-300">|</span>

          <Link to="/admin/login" className="hover:text-[#DC2626] font-bold text-[#0A3663] flex items-center space-x-1">
            <Shield className="w-3 h-3 text-[#DC2626]" />
            <span>Admin</span>
          </Link>
        </div>

      </div>

      {/* 2. MAIN BRAND & CENTERED SEARCH HEADER (india.gov.in exact match) */}
      <div className="px-4 sm:px-6 lg:px-8 py-3.5 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo - Exact Replica of india.gov.in Header Logo */}
        <Link to={getUserHomePath()} className="flex items-center space-x-3.5 group">
          {/* Ashoka Lion Capital Pillar State Emblem of India */}
          <AshokaStambhaEmblem width={52} height={68} />

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

        {/* Center Prominent Search Bar (All Categories Dropdown + Red Button) */}
        <form onSubmit={handleSearchSubmit} className="flex items-center w-full md:w-[540px] shadow-xs rounded-sm overflow-hidden border border-slate-300">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Here (e.g. Wheat, Khanna Mandi, PM-Kisan)..."
              className="w-full bg-white text-slate-800 placeholder-slate-400 text-xs px-3 py-2 border-r border-slate-200 focus:outline-none"
            />
          </div>

          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="hidden sm:block bg-slate-50 text-slate-700 text-xs px-3 py-2 border-r border-slate-200 focus:outline-none font-medium cursor-pointer"
          >
            <option value="All Categories">All Categories</option>
            <option value="Mandi Prices">Mandi Prices</option>
            <option value="APMC Mandis">APMC Mandis</option>
            <option value="Farmer Produce">Farmer Produce</option>
            <option value="E-Auctions">E-Auctions</option>
            <option value="Schemes">Schemes & Grants</option>
          </select>

          <button
            type="submit"
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold px-6 py-2 transition flex items-center space-x-1 whitespace-nowrap"
          >
            <span>Search</span>
          </button>
        </form>

        {/* User Auth Controls */}
        <div className="hidden lg:flex items-center space-x-3">
          <button
            onClick={() => setShowQrModal(true)}
            className="p-2 text-slate-600 hover:text-[#DC2626] bg-slate-100 hover:bg-slate-200 rounded-sm transition"
            title="Mobile Access QR"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {user ? (
            <div className="flex items-center space-x-2">
              <NotificationBell portalType="USER" />
              <Link
                to="/user/profile"
                className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-sm border border-slate-200 text-xs font-semibold"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#0A3663]" />
                <span className="truncate max-w-[100px]">{user.fullName || user.phone}</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/user/login');
                }}
                className="p-1.5 text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-sm transition"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/user/login"
                className="bg-slate-100 hover:bg-slate-200 text-[#0A3663] text-xs font-bold px-3 py-1.5 rounded-sm border border-slate-300 transition"
              >
                SIGN IN
              </Link>
              <Link
                to="/user/register"
                className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold px-3 py-1.5 rounded-sm transition shadow-2xs"
              >
                REGISTER
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-[#0A3663] rounded-sm lg:hidden bg-slate-100 border border-slate-300"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-50 border-b border-slate-200 px-4 py-3 space-y-2">
          <div className="flex flex-col space-y-2 text-xs font-bold text-[#0A3663]">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-200">
              🏛️ Home & Portal Overview
            </Link>
            <Link to="/mandi-prices" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-200">
              📊 Daily Mandi Prices
            </Link>
            <Link to="/user/login" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-200 text-[#DC2626]">
              🔑 Sign In
            </Link>
            <Link to="/user/register" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-200 text-[#DC2626]">
              📝 Register Account
            </Link>
            <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} className="py-2 font-mono">
              🛡️ Admin Desk
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}



