import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Briefcase, Gavel, ShoppingBag, CreditCard, ShieldCheck, FileCheck, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TraderDashboard() {
  const { lang } = useLanguage();

  const traderInfo = {
    licenseNo: 'APMC-TRD-2026-0892',
    firmName: 'M/S Oswal Agri Produce Traders & Exporters',
    proprietor: 'Mr. Anuj Oswal',
    registeredMandi: 'Karnal Grain Market (APMC Karnal)',
    validTill: '31-Mar-2028',
    status: 'ACTIVE & VERIFIED',
    depositBalance: 450000,
  };

  const myPurchases = [
    { id: 'PUR-9901', commodity: 'Basmati Paddy (Pusa 1121)', lotSize: '120 Qtl', rate: '₹4,150/Qtl', total: '₹4,98,000', status: 'Payment Complete', date: '25 Aug 2026' },
    { id: 'PUR-9902', commodity: 'Sharbati Wheat Grade A', lotSize: '300 Qtl', rate: '₹2,380/Qtl', total: '₹7,14,000', status: 'In Transit', date: '24 Aug 2026' },
    { id: 'PUR-9903', commodity: 'Black Bold Mustard', lotSize: '85 Qtl', rate: '₹5,650/Qtl', total: '₹4,80,250', status: 'Weighed & Staked', date: '23 Aug 2026' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-12" id="main-content">
      
      {/* Header Banner */}
      <div className="bg-[#0A3663] text-white border-b-4 border-[#DC2626] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#DC2626] text-white text-[10px] font-bold px-2 py-0.5 rounded-2xs uppercase">
                {traderInfo.status}
              </span>
              <span className="text-xs font-mono text-slate-200">License: {traderInfo.licenseNo}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white font-serif mt-1">
              {lang === 'hi' ? 'व्यापारी डिजिटल डेस्क' : 'APMC Licensed Trader Portal'}
            </h1>
            <p className="text-xs text-slate-200 font-medium">
              Welcome, {traderInfo.proprietor} ({traderInfo.firmName})
            </p>
          </div>

          <div className="bg-[#072545] p-3 rounded-2xs border border-slate-700 text-right">
            <span className="text-[10px] text-slate-300 uppercase block font-bold">Mandi Escrow Security Balance</span>
            <span className="text-lg font-mono font-black text-amber-300">₹{traderInfo.depositBalance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* Quick Action Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <Link
            to="/auctions"
            className="bg-white p-5 rounded-md border border-slate-300 shadow-sm hover:border-amber-500 hover:shadow-md transition flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] font-bold uppercase text-amber-700 block">E-Bidding Hall</span>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-amber-800">Participate Live Auctions</h3>
              <p className="text-xs text-slate-500 mt-0.5">Bid on incoming farmer crop lots</p>
            </div>
            <Gavel className="w-8 h-8 text-amber-600 group-hover:scale-110 transition" />
          </Link>

          <div className="bg-white p-5 rounded-md border border-slate-300 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-700 block">APMC Permit</span>
              <h3 className="text-base font-extrabold text-slate-900">Mandi Gate Pass & Transit</h3>
              <p className="text-xs text-slate-500 mt-0.5">Generate dispatch permits</p>
            </div>
            <FileCheck className="w-8 h-8 text-emerald-700" />
          </div>

          <div className="bg-white p-5 rounded-md border border-slate-300 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-blue-700 block">Financial Desk</span>
              <h3 className="text-base font-extrabold text-slate-900">Direct Farmer Settlements</h3>
              <p className="text-xs text-slate-500 mt-0.5">DBT crop payout vouchers</p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-700" />
          </div>

        </div>

        {/* Purchase History Table */}
        <div className="bg-white rounded-md border border-slate-300 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center font-bold text-xs text-slate-900 uppercase">
            <span>Recent Auction Purchase Settlements</span>
            <span className="text-slate-500 font-normal">Last 30 Days</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800 text-slate-100 uppercase tracking-wider font-bold text-[11px]">
                  <th className="p-3 border-b border-slate-700">Purchase Ref</th>
                  <th className="p-3 border-b border-slate-700">Commodity Lot</th>
                  <th className="p-3 border-b border-slate-700">Quantity</th>
                  <th className="p-3 border-b border-slate-700">Won Rate</th>
                  <th className="p-3 border-b border-slate-700 text-right">Total Amount</th>
                  <th className="p-3 border-b border-slate-700">Status</th>
                  <th className="p-3 border-b border-slate-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {myPurchases.map((row, idx) => (
                  <tr key={row.id} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-100'}>
                    <td className="p-3 font-mono font-bold text-slate-900">{row.id}</td>
                    <td className="p-3 font-bold text-slate-900">🌾 {row.commodity}</td>
                    <td className="p-3 font-mono text-slate-700">{row.lotSize}</td>
                    <td className="p-3 font-mono text-slate-700">{row.rate}</td>
                    <td className="p-3 text-right font-mono font-extrabold text-emerald-800">{row.total}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-500 text-[11px]">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

