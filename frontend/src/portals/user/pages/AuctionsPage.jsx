import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Scale, Clock, Gavel, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function AuctionsPage() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('LIVE');
  const [bidModalAuction, setBidModalAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');

  const [auctions, setAuctions] = useState([
    {
      id: 'AUC-2026-8801',
      commodity: 'Premium Basmati Rice (Pusa 1121)',
      quantityQuintals: 120,
      farmerName: 'Balram Singh',
      mandi: 'Karnal Grain Market, Haryana',
      startPrice: 3800,
      currentBid: 4150,
      highestBidder: 'M/S Oswal Agri Traders',
      status: 'LIVE',
      startTime: 'Today 09:00 AM',
      endTime: 'Today 04:00 PM',
      bidsCount: 14
    },
    {
      id: 'AUC-2026-8802',
      commodity: 'Sharbati Wheat (Grade A Organic)',
      quantityQuintals: 250,
      farmerName: 'Rameshwar Kumar',
      mandi: 'Khanna Mandi, Punjab',
      startPrice: 2200,
      currentBid: 2420,
      highestBidder: 'Garg Roller Flour Mill',
      status: 'LIVE',
      startTime: 'Today 10:00 AM',
      endTime: 'Today 05:00 PM',
      bidsCount: 9
    },
    {
      id: 'AUC-2026-8803',
      commodity: 'Black Bold Mustard (Oil Content 43%)',
      quantityQuintals: 85,
      farmerName: 'Gurdeep Singh',
      mandi: 'Alwar APMC, Rajasthan',
      startPrice: 5300,
      currentBid: 5650,
      highestBidder: 'Rajsthan Oil Industry Ltd',
      status: 'LIVE',
      startTime: 'Today 08:30 AM',
      endTime: 'Today 03:30 PM',
      bidsCount: 22
    },
    {
      id: 'AUC-2026-8804',
      commodity: 'Hybrid Jyoti Potato',
      quantityQuintals: 400,
      farmerName: 'Suresh Chandra',
      mandi: 'Agra Mandi, UP',
      startPrice: 1000,
      currentBid: 1180,
      highestBidder: 'PepsiCo Agri Procure',
      status: 'SCHEDULED',
      startTime: 'Tomorrow 09:00 AM',
      endTime: 'Tomorrow 04:00 PM',
      bidsCount: 0
    },
    {
      id: 'AUC-2026-8805',
      commodity: 'BT Cotton Long Staple',
      quantityQuintals: 150,
      farmerName: 'Jamanbhai Patel',
      mandi: 'Rajkot APMC, Gujarat',
      startPrice: 6600,
      currentBid: 7050,
      highestBidder: 'Gujarat Textile Mill',
      status: 'COMPLETED',
      startTime: 'Yesterday 09:00 AM',
      endTime: 'Yesterday 04:00 PM',
      bidsCount: 31
    }
  ]);

  const filteredAuctions = auctions.filter(a => activeTab === 'ALL' || a.status === activeTab);

  const handlePlaceBid = (e) => {
    e.preventDefault();
    const val = parseFloat(bidAmount);
    if (!val || val <= bidModalAuction.currentBid) {
      alert(`Bid amount must be higher than current bid of ₹${bidModalAuction.currentBid}/quintal`);
      return;
    }
    setAuctions(prev => prev.map(a => {
      if (a.id === bidModalAuction.id) {
        return {
          ...a,
          currentBid: val,
          highestBidder: 'My Trading Account (Self)',
          bidsCount: a.bidsCount + 1
        };
      }
      return a;
    }));
    setBidModalAuction(null);
    setBidAmount('');
    alert(`Success! Bid of ₹${val}/quintal placed for ${bidModalAuction.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-12" id="main-content">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white border-b-4 border-emerald-700 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="bg-amber-500 text-slate-950 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
              ONLINE E-AUCTION ROOM
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white font-serif mt-1">
              {lang === 'hi' ? 'ई-नीलामी एवं पारदर्शी बीडिंग पोर्टल' : 'Transparent Commodity E-Auctions'}
            </h1>
            <p className="text-xs text-slate-300">
              Live electronic bidding hall for certified farmers and registered mandi traders.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="bg-white p-2 rounded-md border border-slate-300 shadow-sm flex items-center space-x-2">
          {['LIVE', 'SCHEDULED', 'COMPLETED', 'ALL'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded transition ${
                activeTab === tab
                  ? 'bg-slate-900 text-amber-400 font-extrabold shadow'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab === 'LIVE' && '🔴 '}
              {tab} AUCTIONS
            </button>
          ))}
        </div>

        {/* Auctions Table */}
        <div className="bg-white rounded-md border border-slate-300 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800 text-slate-100 uppercase tracking-wider font-bold text-[11px]">
                  <th className="p-3 border-b border-slate-700">Auction ID</th>
                  <th className="p-3 border-b border-slate-700">Commodity & Farmer</th>
                  <th className="p-3 border-b border-slate-700 text-right">Lot Quantity</th>
                  <th className="p-3 border-b border-slate-700 text-right">Start Price</th>
                  <th className="p-3 border-b border-slate-700 text-right bg-slate-900 text-amber-400">Current Highest Bid</th>
                  <th className="p-3 border-b border-slate-700">Highest Bidder</th>
                  <th className="p-3 border-b border-slate-700">Status</th>
                  <th className="p-3 border-b border-slate-700 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {filteredAuctions.map((row, idx) => (
                  <tr key={row.id} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-100'}>
                    <td className="p-3 font-mono font-bold text-slate-900">
                      {row.id}
                      <span className="block text-[10px] text-slate-500 font-sans">{row.mandi}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block text-sm">🌾 {row.commodity}</span>
                      <span className="text-slate-500 text-[11px]">Farmer: {row.farmerName}</span>
                    </td>
                    <td className="p-3 text-right font-mono font-semibold text-slate-800">{row.quantityQuintals} Quintals</td>
                    <td className="p-3 text-right font-mono text-slate-600">₹{row.startPrice}/Qtl</td>
                    <td className="p-3 text-right font-mono font-black text-emerald-800 bg-emerald-50 text-sm">
                      ₹{row.currentBid.toLocaleString()}/Qtl
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-900 block">{row.highestBidder}</span>
                      <span className="text-[10px] text-slate-500">{row.bidsCount} total bids</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        row.status === 'LIVE'
                          ? 'bg-red-100 text-red-800 border-red-300 animate-pulse'
                          : row.status === 'SCHEDULED'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {row.status === 'LIVE' ? (
                        <button
                          onClick={() => {
                            setBidModalAuction(row);
                            setBidAmount(String(row.currentBid + 50));
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3 py-1.5 rounded shadow flex items-center justify-center space-x-1 mx-auto"
                        >
                          <Gavel className="w-3.5 h-3.5" />
                          <span>Submit Bid</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Bidding Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bid Modal */}
        {bidModalAuction && (
          <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
            <form onSubmit={handlePlaceBid} className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 border-2 border-slate-800 shadow-2xl">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase">E-BID SUBMISSION</span>
                  <h3 className="text-base font-bold text-slate-900 font-serif">{bidModalAuction.id}</h3>
                </div>
                <button type="button" onClick={() => setBidModalAuction(null)} className="text-slate-400 hover:text-slate-900 text-xl font-bold">
                  &times;
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="font-bold text-slate-900 text-sm">🌾 {bidModalAuction.commodity}</p>
                <div className="bg-slate-50 p-3 rounded border border-slate-200 grid grid-cols-2 gap-2 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Current Highest Bid</span>
                    <span className="font-extrabold text-emerald-800 text-sm">₹{bidModalAuction.currentBid}/Qtl</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Lot Quantity</span>
                    <span className="font-bold text-slate-800">{bidModalAuction.quantityQuintals} Qtl</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Enter Your Bid Amount (₹ per Quintal):</label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={bidModalAuction.currentBid + 10}
                    step="10"
                    required
                    className="w-full bg-slate-50 text-slate-900 font-mono text-base font-bold rounded p-2.5 border-2 border-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Must be higher than ₹{bidModalAuction.currentBid}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setBidModalAuction(null)}
                  className="bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-5 py-2 rounded shadow"
                >
                  Confirm & Lock Bid
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

