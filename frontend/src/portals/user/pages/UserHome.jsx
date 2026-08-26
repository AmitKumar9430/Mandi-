import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { useUserAuth } from '../../../auth/UserAuthContext';
import {
  Search,
  ChevronRight,
  TrendingUp,
  FileText,
  Building2,
  Award,
  Users,
  Scale,
  Truck,
  Sprout,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function UserHome() {
  const { user } = useUserAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [searchCategory, setSearchCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');

  // If user is logged in, DO NOT show the landing page hero section.
  // Immediately redirect to their authenticated role dashboard.
  if (user) {
    const rawRoles = user?.roles ? (Array.isArray(user.roles) ? user.roles : [user.roles]) : ['ROLE_CITIZEN'];
    const roles = rawRoles.map((r) => {
      if (typeof r === 'string') return r;
      return r?.role || r?.name || r?.authority || String(r);
    });

    if (roles.some((r) => typeof r === 'string' && (r.includes('ADMIN') || r.includes('SUPER_ADMIN')))) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (roles.some((r) => typeof r === 'string' && r.includes('FARMER'))) {
      return <Navigate to="/user/agriculture" replace />;
    }
    if (roles.some((r) => typeof r === 'string' && (r.includes('PROVIDER') || r.includes('SERVICE')))) {
      return <Navigate to="/user/provider" replace />;
    }
    if (roles.some((r) => typeof r === 'string' && (r.includes('MITRA') || r.includes('VILLAGE')))) {
      return <Navigate to="/user/village-mitra" replace />;
    }
    return <Navigate to="/user/citizen" replace />;
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/mandi-prices?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const trendingSearches = [
    { label: "Today's Wheat Rate", query: 'Wheat' },
    { label: 'Karnal Mandi', query: 'Karnal' },
    { label: 'Apply KCC', query: 'KCC' },
    { label: 'PM-Kisan Status', query: 'PM-Kisan' },
    { label: 'Live E-Auctions', query: 'Auctions' }
  ];

  const floatingStats = [
    { num: '13,933', label: 'Online Services', icon: '🏛️' },
    { num: '3,680', label: 'APMC Mandis', icon: '🏢' },
    { num: '2,306', label: 'Citizen Engagements', icon: '👨‍🌾' },
    { num: '3,975', label: 'Freight Vehicles', icon: '🚜' },
    { num: '1,207', label: 'Commodities Listed', icon: '📦' },
    { num: '18', label: 'Information Categories', icon: '📑' }
  ];

  const flagshipSchemes = [
    { title: 'PM-Kisan Samman Nidhi', badge: 'Direct Benefit', bg: 'bg-[#0A3663]', icon: '🌾' },
    { title: 'Pradhan Mantri Fasal Bima', badge: 'Crop Insurance', bg: 'bg-emerald-700', icon: '🛡️' },
    { title: 'National Agriculture Market (e-NAM)', badge: 'E-Auction', bg: 'bg-[#DC2626]', icon: '⚖️' },
    { title: 'Kisan Credit Card Scheme', badge: 'Agri Credit', bg: 'bg-amber-600', icon: '💳' },
    { title: 'Sub-Mission on Agriculture Mechanization', badge: 'Equipment Subsidy', bg: 'bg-indigo-700', icon: '🚜' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-16" id="main-content">
      
      {/* 1. HERO BANNER (Dark Navy Blue with Watermark, emblem, mandi.gov.in BETA logo, central search bar) */}
      <section className="bg-[#0A3663] text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-[#DC2626] relative overflow-hidden shadow-lg">
        {/* Subtle Watermark Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-5 relative z-10">
          
          {/* Emblem Icon */}
          <div className="w-14 h-14 mx-auto rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center text-3xl shadow-inner">
            🏛️
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-serif text-white">
              mandi.gov.in <span className="text-sm font-sans font-bold bg-[#FF9933] text-slate-950 px-2 py-0.5 rounded-2xs align-middle">BETA</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-200 font-medium font-serif">
              National Portal of India — Where Agricultural Market Information Converges
            </p>
          </div>

          {/* Central Search Input Box with Dropdown + Red Search Button */}
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center rounded-sm overflow-hidden bg-white shadow-2xl border border-slate-300">
            <div className="relative flex-grow w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Mandi Prices, APMC Yards, Commodities, Schemes..."
                className="w-full bg-white text-slate-900 placeholder-slate-400 text-sm px-4 py-3 border-b sm:border-b-0 sm:border-r border-slate-200 focus:outline-none"
              />
            </div>

            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="bg-slate-50 text-slate-700 text-xs px-3 py-3 border-r border-slate-200 focus:outline-none font-semibold cursor-pointer w-full sm:w-auto"
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
              className="w-full sm:w-auto bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-extrabold px-8 py-3.5 transition flex items-center justify-center space-x-1.5 whitespace-nowrap shadow-xs uppercase tracking-wider"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Trending Searches Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs pt-1">
            <span className="text-slate-300 font-medium">Trending Searches:</span>
            {trendingSearches.map((item, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/mandi-prices?search=${encodeURIComponent(item.query)}`)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-2.5 py-0.5 rounded-2xs text-[11px] font-semibold transition"
              >
                {item.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 2. FLOATING WHITE STAT COUNTER STRIP (media_1787686038396.png exact match) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white border border-slate-200 rounded-sm shadow-md grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-slate-200">
          {floatingStats.map((stat, i) => (
            <div key={i} className="p-4 text-center space-y-1 hover:bg-slate-50 transition">
              <span className="text-xl block">{stat.icon}</span>
              <span className="font-extrabold font-mono text-base text-[#0A3663] block">{stat.num}</span>
              <span className="text-[11px] font-semibold text-slate-600 block">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. DUAL SECTION: ONLINE MANDI SERVICES (Bright Red Box) + FEATURED CARDS (media_1787686038396.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Bright Red Banner Box: Online Services */}
        <div className="bg-[#DC2626] text-white p-6 rounded-sm shadow-md space-y-5 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-extrabold font-serif border-b border-white/30 pb-3 uppercase tracking-tight">
              Online Mandi Services
            </h2>
            <div className="grid grid-cols-2 gap-3 mt-4 text-center">
              <div className="bg-white/10 p-3 rounded-2xs border border-white/20">
                <span className="font-extrabold font-mono text-xl block">1,092+</span>
                <span className="text-[10px] uppercase font-bold text-slate-100">Central Mandis</span>
              </div>
              <div className="bg-white/10 p-3 rounded-2xs border border-white/20">
                <span className="font-extrabold font-mono text-xl block">12,309+</span>
                <span className="text-[10px] uppercase font-bold text-slate-100">State APMC Yards</span>
              </div>
              <div className="bg-white/10 p-3 rounded-2xs border border-white/20">
                <span className="font-extrabold font-mono text-xl block">33</span>
                <span className="text-[10px] uppercase font-bold text-slate-100">Important Services</span>
              </div>
              <div className="bg-white/10 p-3 rounded-2xs border border-white/20">
                <span className="font-extrabold font-mono text-xl block">18</span>
                <span className="text-[10px] uppercase font-bold text-slate-100">Categories</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-right">
            <Link
              to="/mandi-prices"
              className="inline-block bg-white text-[#DC2626] hover:bg-slate-100 font-extrabold text-xs px-5 py-2 rounded-full transition shadow-xs"
            >
              Avail Online Services & Save Time &nbsp; View All &rarr;
            </Link>
          </div>
        </div>

        {/* Right Featured Interactive Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-xs space-y-3 hover:border-[#0A3663] transition flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-slate-100 text-[#0A3663] text-[10px] font-bold px-2 py-0.5 rounded-2xs uppercase border border-slate-200">
                Daily Price Bulletins
              </span>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Today's Mandi Commodity Prices & Arrivals Index
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Official minimum, maximum, and modal price quotations across all state APMC yards synced in real time.
              </p>
            </div>
            <Link
              to="/mandi-prices"
              className="text-xs font-extrabold text-[#DC2626] hover:underline flex items-center space-x-1"
            >
              <span>Explore Market Prices</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-xs space-y-3 hover:border-[#0A3663] transition flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-slate-100 text-[#0A3663] text-[10px] font-bold px-2 py-0.5 rounded-2xs uppercase border border-slate-200">
                Direct Farmer Connect
              </span>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Farmer Harvest Produce Listing & Trade Desk
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                List ready harvest crops directly to verified traders without intermediaries. Protect floor prices.
              </p>
            </div>
            <Link
              to="/farmer-dashboard"
              className="text-xs font-extrabold text-[#DC2626] hover:underline flex items-center space-x-1"
            >
              <span>Farmer Harvest Desk</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </section>

      {/* 4. SUBCATEGORIES DEEP BLUE HERO BOX (media_1787686038343.png exact match) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-4 shadow-sm">
          
          <div className="border-b border-slate-200 pb-3">
            <span className="text-xs text-[#DC2626] font-bold uppercase tracking-wider">Home &gt; Category &gt; Benefits & Social Development</span>
            <h2 className="text-2xl font-black text-[#0A3663] font-serif mt-1">
              Benefits & Social Development
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-4xl">
              This section focuses on enhancing citizen welfare by providing information on benefits, subsidies, and support for various agricultural social groups, ensuring equitable access to opportunities.
            </p>
          </div>

          {/* Deep Navy Blue Container Card */}
          <div className="bg-[#0A3663] text-white p-6 sm:p-8 rounded-sm shadow-md grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            
            {/* Left Subcategories Link List */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white border-b border-white/20 pb-2 uppercase tracking-wide">
                Subcategories
              </h3>
              <ul className="space-y-2 text-xs font-medium">
                <li>
                  <Link to="/farmer-dashboard" className="hover:text-amber-300 flex items-center space-x-2 transition">
                    <span>&rarr;</span>
                    <span className="hover:underline">Senior Farmers & Crop Producers</span>
                  </Link>
                </li>
                <li>
                  <Link to="/mandi-prices" className="hover:text-amber-300 flex items-center space-x-2 transition">
                    <span>&rarr;</span>
                    <span className="hover:underline">Mandi Price Index & Arrival Records</span>
                  </Link>
                </li>
                <li>
                  <Link to="/auctions" className="hover:text-amber-300 flex items-center space-x-2 transition">
                    <span>&rarr;</span>
                    <span className="hover:underline">Electronic Commodity Auction Hall</span>
                  </Link>
                </li>
                <li>
                  <Link to="/user/bookings" className="hover:text-amber-300 flex items-center space-x-2 transition">
                    <span>&rarr;</span>
                    <span className="hover:underline">Mandi Freight & Logistics Services</span>
                  </Link>
                </li>
                <li>
                  <Link to="/gov-schemes" className="hover:text-amber-300 flex items-center space-x-2 transition">
                    <span>&rarr;</span>
                    <span className="hover:underline">PM-Kisan Benefits, Grants & Subsidies</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right Featured Card Spotlight */}
            <div className="bg-white text-slate-900 p-6 rounded-sm shadow-lg space-y-3">
              <div className="flex items-center space-x-2 text-[#0A3663]">
                <span className="text-2xl">👩‍🌾</span>
                <h4 className="font-extrabold text-base font-serif">Women & Children Welfare in Agriculture</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Empowering women farmers through technology access, healthcare insurance, financial inclusion, and community self-help groups.
              </p>
              <Link
                to="/gov-schemes"
                className="inline-block bg-[#0A3663] hover:bg-[#072545] text-white text-xs font-bold px-4 py-2 rounded-2xs transition"
              >
                Explore
              </Link>
            </div>

          </div>

          {/* Stat Badges Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center pt-2">
            <div className="bg-slate-50 p-3 rounded-sm border border-slate-200">
              <span className="font-extrabold font-mono text-lg text-[#0A3663] block">1,379</span>
              <span className="text-[11px] font-bold text-slate-600">Schemes</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-sm border border-slate-200">
              <span className="font-extrabold font-mono text-lg text-[#0A3663] block">1,782</span>
              <span className="text-[11px] font-bold text-slate-600">Services</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-sm border border-slate-200">
              <span className="font-extrabold font-mono text-lg text-[#0A3663] block">95</span>
              <span className="text-[11px] font-bold text-slate-600">Open Data</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-sm border border-slate-200">
              <span className="font-extrabold font-mono text-lg text-[#0A3663] block">86</span>
              <span className="text-[11px] font-bold text-slate-600">Activities</span>
            </div>
          </div>

        </div>

      </section>

      {/* 5. FLAGSHIP SCHEMES CAROUSEL (media_1787686038343.png exact match) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-4">
        
        <div className="border-b border-slate-200 pb-2">
          <h2 className="text-xl font-extrabold text-[#0A3663] font-serif">
            Flagship Schemes and Services
          </h2>
          <p className="text-xs text-slate-500">Key central and state welfare initiatives for Indian agriculture.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {flagshipSchemes.map((scheme, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs hover:border-[#DC2626] transition flex flex-col justify-between space-y-3 group cursor-pointer"
              onClick={() => navigate('/gov-schemes')}
            >
              <div className="space-y-2">
                <div className={`w-10 h-10 ${scheme.bg} text-white rounded-sm flex items-center justify-center text-xl shadow-2xs`}>
                  {scheme.icon}
                </div>
                <span className="bg-slate-100 text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded-2xs uppercase">
                  {scheme.badge}
                </span>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#DC2626] leading-snug">
                  {scheme.title}
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#DC2626] group-hover:underline">
                View Scheme Details &rarr;
              </span>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
}

