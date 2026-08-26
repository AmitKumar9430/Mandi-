import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserFooter() {
  const [cookieConsent, setCookieConsent] = useState(true);

  return (
    <footer className="w-full bg-[#0A3663] text-white font-sans text-xs select-none">
      
      {/* Top Banner Accent */}
      <div className="bg-[#072545] text-slate-300 py-3 px-4 sm:px-6 lg:px-8 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white uppercase tracking-wider">mandi.gov.in</span>
            <span className="text-slate-500">|</span>
            <span>National Portal of India — Agricultural Market Platform</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-300">
            <a href="#main-content" className="hover:underline hover:text-white">Website Policies</a>
            <span>|</span>
            <Link to="/notices" className="hover:underline hover:text-white">Help & FAQ</Link>
            <span>|</span>
            <Link to="/grievance" className="hover:underline hover:text-white">Feedback & Contact</Link>
          </div>
        </div>
      </div>

      {/* Main Directory Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-sm bg-white text-[#0A3663] flex items-center justify-center font-bold text-base">
              🏛️
            </div>
            <span className="text-base font-black text-white tracking-tight font-serif uppercase">
              mandi.gov.in
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            National Agricultural Market Portal of India. Providing single-window access to daily mandi prices, market yard directories, e-bidding, and welfare services.
          </p>
          <div className="pt-1 text-[11px] text-amber-300 font-medium">
            Ministry of Agriculture & Farmers Welfare, Govt of India
          </div>
        </div>

        {/* Col 2 */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase text-white tracking-wider border-b border-slate-600/60 pb-1">
            Information Categories
          </h4>
          <ul className="space-y-1.5 text-slate-300 text-[11px]">
            <li><Link to="/mandi-prices" className="hover:underline hover:text-white">Agriculture, Rural & Environment</Link></li>
            <li><Link to="/gov-schemes" className="hover:underline hover:text-white">Benefits & Social Development</Link></li>
            <li><Link to="/market-directory" className="hover:underline hover:text-white">Business & Self-Employed</Link></li>
            <li><Link to="/farmer-dashboard" className="hover:underline hover:text-white">Farmers Produce & Harvest Desk</Link></li>
            <li><Link to="/trader-dashboard" className="hover:underline hover:text-white">Licensed APMC Traders Hub</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase text-white tracking-wider border-b border-slate-600/60 pb-1">
            Government Services
          </h4>
          <ul className="space-y-1.5 text-slate-300 text-[11px]">
            <li><Link to="/auctions" className="hover:underline hover:text-white">Live E-Bidding Commodity Auctions</Link></li>
            <li><Link to="/user/bookings" className="hover:underline hover:text-white">Logistics & Freight Fleet Transport</Link></li>
            <li><Link to="/notices" className="hover:underline hover:text-white">Public Notices & Department Circulars</Link></li>
            <li><Link to="/reports" className="hover:underline hover:text-white">Daily Market Statistical Reports</Link></li>
            <li><Link to="/grievance" className="hover:underline hover:text-white">Public Grievance Redressal Portal</Link></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div className="space-y-3 bg-[#072545] p-4 rounded-sm border border-slate-700/60">
          <h4 className="text-xs font-bold uppercase text-amber-300 tracking-wider border-b border-slate-700 pb-1">
            Toll-Free Kisan Helpline
          </h4>
          <div className="space-y-1 text-[11px]">
            <p className="font-mono text-base font-extrabold text-white">1800-MANDI-SEVA</p>
            <p className="text-slate-300 text-[10px]">Operational: 06:00 AM to 09:00 PM (All Working Days)</p>
            <div className="pt-2 border-t border-slate-700 text-slate-300 space-y-1">
              <p>Email: helpdesk@mandi.gov.in</p>
              <p>Krishi Bhawan, Dr. Rajendra Prasad Road, New Delhi 110001</p>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="bg-[#051A31] py-4 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div>
            <p>© 2026 MANDI PORTAL — National Portal of India Concept Prototype</p>
            <p className="text-amber-300 text-[10px]">Demo / Prototype — Not an Official Government Website</p>
          </div>
          <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-mono">
            <span>Last Updated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            <span>|</span>
            <span>Content Managed by APMC Board</span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Cookie Consent Banner (india.gov.in exact match) */}
      {cookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white text-slate-800 border-t border-slate-300 shadow-2xl py-2 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <div>
            <span className="font-bold text-[#0A3663]">This website uses cookies to provide a better user experience.</span>
            <span className="text-slate-500 ml-1">By clicking accept, you agree to the policies outlined in the Cookie Settings.</span>
          </div>
          <div className="flex items-center space-x-2 whitespace-nowrap">
            <button
              onClick={() => setCookieConsent(false)}
              className="bg-slate-100 hover:bg-slate-200 text-[#DC2626] font-bold px-2.5 py-1 rounded-2xs border border-[#DC2626] text-[10px] transition"
            >
              CUSTOMIZE COOKIES
            </button>
            <button
              onClick={() => setCookieConsent(false)}
              className="bg-slate-100 hover:bg-slate-200 text-[#DC2626] font-bold px-2.5 py-1 rounded-2xs border border-[#DC2626] text-[10px] transition"
            >
              DECLINE OPTIONAL COOKIES
            </button>
            <button
              onClick={() => setCookieConsent(false)}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold px-3 py-1 rounded-2xs text-[10px] transition shadow-xs"
            >
              ACCEPT ALL COOKIES
            </button>
          </div>
        </div>
      )}

    </footer>
  );
}

