import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { TrendingUp, FileText, Download, Calendar, BarChart2 } from 'lucide-react';

export default function ReportsPage() {
  const { lang } = useLanguage();
  const [reportType, setReportType] = useState('DAILY_PRICES');
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState('2026-08-25');

  const reportLogs = [
    { name: 'Daily Market Arrival & Price Summary Report', code: 'REP-DLY-20260825', date: '25 Aug 2026', size: '2.4 MB', type: 'PDF' },
    { name: 'Monthly Commodity Arrival & Modal Trend Matrix', code: 'REP-MTH-20260731', date: '31 Jul 2026', size: '8.1 MB', type: 'PDF' },
    { name: 'APMC District Deficit & Inter-Mandi Freight Log', code: 'REP-FRT-20260820', date: '20 Aug 2026', size: '1.8 MB', type: 'CSV' },
    { name: 'Kisan Produce Bidding & Purchase Settlement Audit', code: 'REP-SET-20260822', date: '22 Aug 2026', size: '4.5 MB', type: 'PDF' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-12" id="main-content">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white border-b-4 border-emerald-700 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="bg-amber-500 text-slate-950 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            STATISTICAL DATA & ANALYTICS
          </span>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white font-serif mt-1">
            {lang === 'hi' ? 'दैनिक बाज़ार रिपोर्ट एवं आंकड़े' : 'Market Intelligence & Analytical Reports'}
          </h1>
          <p className="text-xs text-slate-300">
            Download verified daily price bulletins, arrival metrics, and regional trade trends.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* Report Generator Controls */}
        <div className="bg-white p-5 rounded-md border border-slate-300 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 pb-2">
            <BarChart2 className="w-4 h-4 text-emerald-700" />
            <span>Generate Official Market Bulletin Report</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Select Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs rounded p-2.5 border border-slate-300 font-medium"
              >
                <option value="DAILY_PRICES">Daily Mandi Price Bulletin</option>
                <option value="ARRIVALS">Commodity Arrival Quantity Matrix</option>
                <option value="PRICE_TRENDS">30-Day Price Velocity & Inflation Trend</option>
                <option value="AUCTION_SUMMARY">E-Auction Settlement Summary</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs rounded p-2 border border-slate-300 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs rounded p-2 border border-slate-300 font-mono font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              onClick={() => alert(`Generated ${reportType} report for period ${fromDate} to ${toDate}`)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-5 py-2.5 rounded shadow flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Generate & Download Report</span>
            </button>
          </div>
        </div>

        {/* Recent Official Reports Table */}
        <div className="bg-white rounded-md border border-slate-300 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-xs text-slate-900 uppercase">
            Published APMC Bulletins & Statistical Archives
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800 text-slate-100 uppercase tracking-wider font-bold text-[11px]">
                  <th className="p-3 border-b border-slate-700">Report Reference</th>
                  <th className="p-3 border-b border-slate-700">Bulletin Name</th>
                  <th className="p-3 border-b border-slate-700">Release Date</th>
                  <th className="p-3 border-b border-slate-700">File Size</th>
                  <th className="p-3 border-b border-slate-700 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {reportLogs.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-100'}>
                    <td className="p-3 font-mono font-bold text-slate-900">{item.code}</td>
                    <td className="p-3 font-bold text-slate-900">📄 {item.name}</td>
                    <td className="p-3 text-slate-600 font-mono">{item.date}</td>
                    <td className="p-3 text-slate-600 font-mono">{item.size}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => alert(`Downloading archive file: ${item.code}.${item.type.toLowerCase()}`)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center space-x-1 mx-auto"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download {item.type}</span>
                      </button>
                    </td>
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

