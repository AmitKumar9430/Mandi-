import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Building2, MapPin, Phone, Clock, Search, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MarketDirectoryPage() {
  const { lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedMandi, setSelectedMandi] = useState(null);

  const mandis = [
    {
      id: 1,
      name: 'Khanna Grain Market (खन्ना मंडी)',
      category: 'Principal Market Yard (APMC)',
      state: 'Punjab',
      district: 'Ludhiana',
      address: 'GT Road, Mandi Gobindgarh Access, Khanna, Punjab 141401',
      secretary: 'Shri Harpreet Singh (APMC Secretary)',
      phone: '+91 1628-223450',
      email: 'apmc.khanna@punjab.gov.in',
      status: 'OPEN',
      hours: '06:00 AM - 08:00 PM',
      commodities: ['Wheat', 'Paddy (Basmati)', 'Maize', 'Sunflower', 'Mustard'],
      facilities: ['Digital Weighbridge', 'Cold Storage (5,000 MT)', 'Assay Lab', 'Soil Testing Clinic', 'Farmer Rest House']
    },
    {
      id: 2,
      name: 'Karnal Agricultural Produce Market',
      category: 'Principal Market Yard (APMC)',
      state: 'Haryana',
      district: 'Karnal',
      address: 'G.T. Road, Near Grain Market Flyover, Karnal, Haryana 132001',
      secretary: 'Shri Rameshwar Dayal',
      phone: '+91 184-2256710',
      email: 'apmc.karnal@haryana.gov.in',
      status: 'OPEN',
      hours: '05:30 AM - 07:30 PM',
      commodities: ['Basmati Rice', 'Wheat', 'Mustard', 'Sugarcane', 'Vegetables'],
      facilities: ['Electronic Bidding Hall', 'E-NAM Terminal', 'Moisture Meters', 'Farmer Canteen']
    },
    {
      id: 3,
      name: 'Lasalgaon APMC Market',
      category: 'Specialized Commodity Market',
      state: 'Maharashtra',
      district: 'Nashik',
      address: 'APMC Complex, Station Road, Lasalgaon, Niphad, Nashik 422306',
      secretary: 'Shri Vijay Sonawane',
      phone: '+91 2550-266120',
      email: 'apmc.lasalgaon@mah.gov.in',
      status: 'OPEN',
      hours: '07:00 AM - 06:00 PM',
      commodities: ['Onion', 'Garlic', 'Pomegranate', 'Grapes', 'Tomatoes'],
      facilities: ['Onion Grading Center', 'Export Quality Testing', 'Cold Chain Storage', 'Banking Counter']
    },
    {
      id: 4,
      name: 'Agra Principal Market Yard',
      category: 'Principal Market Yard (APMC)',
      state: 'Uttar Pradesh',
      district: 'Agra',
      address: 'Fatehabad Road, Near Transport Nagar, Agra, Uttar Pradesh 282006',
      secretary: 'Er. S.K. Verma',
      phone: '+91 562-2230190',
      email: 'apmc.agra@up.gov.in',
      status: 'OPEN',
      hours: '06:00 AM - 07:00 PM',
      commodities: ['Potato', 'Wheat', 'Mustard', 'Bajra', 'Pulses'],
      facilities: ['Cold Storage Warehouse (12,000 MT)', 'Quality Grading', 'Logistics Terminal']
    },
    {
      id: 5,
      name: 'Alwar APMC Krishi Upaj Mandi',
      category: 'Principal Market Yard',
      state: 'Rajasthan',
      district: 'Alwar',
      address: 'Old Delhi Road, Industrial Area, Alwar, Rajasthan 301001',
      secretary: 'Shri Mahendra Sharma',
      phone: '+91 144-2334880',
      email: 'apmc.alwar@rajasthan.gov.in',
      status: 'OPEN',
      hours: '06:30 AM - 07:00 PM',
      commodities: ['Mustard', 'Bajra', 'Wheat', 'Guar', 'Gram'],
      facilities: ['Oilseed Quality Testing', 'Heavy Vehicle Parking', 'Kisan Rest House']
    }
  ];

  const filteredMandis = mandis.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.district.toLowerCase().includes(search.toLowerCase()) ||
      m.commodities.some(c => c.toLowerCase().includes(search.toLowerCase()));
    const matchesState = selectedState === 'All' || m.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-12" id="main-content">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white border-b-4 border-emerald-700 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
            DIRECTORY & INFRASTRUCTURE
          </span>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white font-serif mt-1">
            {lang === 'hi' ? 'राष्ट्रीय मंडी निर्देशिका व संपर्क केंद्र' : 'National Mandi Market Directory'}
          </h1>
          <p className="text-xs text-slate-300">
            Search APMC yards, operating hours, secretary contacts, and available cold storage facilities.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-md border border-slate-300 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Mandi Name, District or Commodity..."
              className="w-full bg-slate-50 text-xs rounded pl-8 pr-3 py-2 border border-slate-300 focus:outline-none focus:border-emerald-600 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-600">Filter State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-50 text-xs rounded p-2 border border-slate-300 font-medium"
            >
              <option value="All">All States</option>
              <option value="Punjab">Punjab</option>
              <option value="Haryana">Haryana</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Rajasthan">Rajasthan</option>
            </select>
          </div>
        </div>

        {/* Mandi Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMandis.map(mandi => (
            <div key={mandi.id} className="bg-white p-5 rounded-md border border-slate-300 shadow-sm space-y-3 flex flex-col justify-between">
              
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{mandi.category}</span>
                    <h3 className="text-base font-extrabold text-slate-900 font-serif">{mandi.name}</h3>
                  </div>
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px] px-2 py-0.5 rounded">
                    {mandi.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 flex items-start space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{mandi.address}</span>
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-500 block">APMC Secretary / Contact</span>
                    <span className="font-bold text-slate-800">{mandi.secretary}</span>
                    <span className="text-slate-600 block font-mono text-[11px]">{mandi.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Operating Hours</span>
                    <span className="font-semibold text-slate-800 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{mandi.hours}</span>
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Key Commodities Handled:</span>
                  <div className="flex flex-wrap gap-1">
                    {mandi.commodities.map((c, i) => (
                      <span key={i} className="bg-slate-100 text-slate-800 border border-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                        🌾 {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => setSelectedMandi(mandi)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded transition"
                >
                  View Full Details
                </button>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(mandi.name + ' ' + mandi.district)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-800 hover:underline text-xs font-bold flex items-center space-x-1"
                >
                  <span>Get Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* Modal Dialog */}
        {selectedMandi && (
          <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-lg w-full p-6 space-y-4 border-2 border-slate-800 shadow-2xl">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase">{selectedMandi.category}</span>
                  <h3 className="text-lg font-bold text-slate-900 font-serif">{selectedMandi.name}</h3>
                </div>
                <button onClick={() => setSelectedMandi(null)} className="text-slate-400 hover:text-slate-900 text-xl font-bold">
                  &times;
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block">Full Address:</span>
                  <p className="text-slate-600">{selectedMandi.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Official Contact</span>
                    <span className="font-bold text-slate-900">{selectedMandi.secretary}</span>
                    <p className="font-mono text-slate-700">{selectedMandi.phone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Official Email</span>
                    <p className="font-mono text-slate-700">{selectedMandi.email}</p>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-700 block mb-1">Available Infrastructure Facilities:</span>
                  <ul className="grid grid-cols-2 gap-1.5 text-slate-700">
                    {selectedMandi.facilities.map((fac, idx) => (
                      <li key={idx} className="flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 text-right">
                <button
                  onClick={() => setSelectedMandi(null)}
                  className="bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

