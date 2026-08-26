import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { FileText, Download, Eye, AlertCircle, Calendar, Filter } from 'lucide-react';

export default function NoticesBoardPage() {
  const { lang } = useLanguage();
  const [selectedNotice, setSelectedNotice] = useState(null);

  const notices = [
    {
      id: 'NOT-2026-042',
      title: 'Mandi Gate Entry Timings & Operations for Wheat Harvest Peak Season 2026',
      date: '2026-08-25',
      department: 'Department of Agricultural Marketing & APMC Board',
      priority: 'URGENT',
      summary: 'All principal market yards and sub-yards across Punjab, Haryana, and UP will open gate entries from 05:00 AM to 09:00 PM starting 1st September 2026.',
      details: 'Due to expected bumper harvest arrivals, APMC secretaries are instructed to deploy extra weighing scales, digital moisture testers, and lighting facilities. Token systems will be strictly enforced to avoid traffic jams outside market yards.'
    },
    {
      id: 'NOT-2026-039',
      title: 'Kisan Credit Card (KCC) Interest Subvention Claim Guidelines for FY 2026-27',
      date: '2026-08-22',
      department: 'State Agricultural Development Board & NABARD',
      priority: 'HIGH',
      summary: 'Guidelines for claiming 3% prompt repayment incentive on crop loans up to ₹3,00,000.',
      details: 'Farmers who repay crop loans on or before the due date specified by their lending bank are eligible for 3% interest subvention. Submit Aadhaar-linked loan receipt at local Mandi Seva desk for verification.'
    },
    {
      id: 'NOT-2026-035',
      title: 'Annual Digital Weighbridge Calibration & Certification Drive',
      date: '2026-08-20',
      department: 'Directorate of Weights & Measures',
      priority: 'NORMAL',
      summary: 'Mandatory annual inspection and zero-calibration for all electronic weighbridges operating in APMC yards.',
      details: 'All private and APMC-owned weighbridges must be certified by the district inspector before 10th September 2026. Uncertified scales will face immediate suspension of operating license.'
    },
    {
      id: 'NOT-2026-031',
      title: 'Advisory on Soil Moisture & Pest Attack Safeguards during Harvesting',
      date: '2026-08-15',
      department: 'Krishi Vigyan Kendra (KVK) Advisory Board',
      priority: 'NORMAL',
      summary: 'Technical advisory for farmers regarding crop moisture content threshold during mandi procurement.',
      details: 'Farmers are advised to bring grains with moisture content below 12% for Wheat and 14% for Paddy to ensure maximum modal price bidding and avoid drying deductions.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-12" id="main-content">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white border-b-4 border-emerald-700 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="bg-amber-500 text-slate-950 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            PUBLIC ADVISORIES & CIRCULARS
          </span>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white font-serif mt-1">
            {lang === 'hi' ? 'सरकारी सूचना पट्ट व परिपत्र' : 'Official Public Notices & Department Circulars'}
          </h1>
          <p className="text-xs text-slate-300">
            Official government announcements, mandi operating rules, harvest advisories, and policy circulars.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-4">
        
        <div className="bg-white rounded-md border border-slate-300 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Published Circulars ({notices.length})</span>
            </span>
            <span className="text-[11px] text-slate-500">Official Document Format (PDF / Text)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800 text-slate-100 uppercase tracking-wider font-bold text-[11px]">
                  <th className="p-3 border-b border-slate-700">Notice Ref ID</th>
                  <th className="p-3 border-b border-slate-700">Publish Date</th>
                  <th className="p-3 border-b border-slate-700">Subject / Title</th>
                  <th className="p-3 border-b border-slate-700">Issuing Department</th>
                  <th className="p-3 border-b border-slate-700">Priority</th>
                  <th className="p-3 border-b border-slate-700 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {notices.map((row, idx) => (
                  <tr key={row.id} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-100'}>
                    <td className="p-3 font-mono font-bold text-slate-900">{row.id}</td>
                    <td className="p-3 text-slate-600 font-mono">{row.date}</td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block text-sm">{row.title}</span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">{row.summary}</span>
                    </td>
                    <td className="p-3 text-slate-700 font-semibold">{row.department}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        row.priority === 'URGENT'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : row.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {row.priority}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedNotice(row)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center space-x-1 mx-auto shadow"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Read Notice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PDF / Notice Viewer Modal */}
        {selectedNotice && (
          <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 space-y-4 border-2 border-slate-800 shadow-2xl">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-800">{selectedNotice.id}</span>
                  <h3 className="text-lg font-bold text-slate-900 font-serif mt-1">{selectedNotice.title}</h3>
                </div>
                <button onClick={() => setSelectedNotice(null)} className="text-slate-400 hover:text-slate-900 text-xl font-bold">
                  &times;
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-3 rounded border border-slate-200 grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="font-bold text-slate-900 block">Issuing Authority:</span>
                    <span>{selectedNotice.department}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Publication Date:</span>
                    <span className="font-mono">{selectedNotice.date}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px]">Official Order Text:</h4>
                  <p className="text-slate-800 leading-relaxed text-sm bg-amber-50/50 p-4 rounded border border-amber-200/60 font-serif">
                    {selectedNotice.details}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <button
                  onClick={() => alert(`Downloading official PDF document: ${selectedNotice.id}.pdf`)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded flex items-center space-x-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Official Circular (PDF)</span>
                </button>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

