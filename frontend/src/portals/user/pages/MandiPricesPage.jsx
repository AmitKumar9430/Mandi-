import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { Search, Download, Printer, RefreshCw, XCircle } from 'lucide-react';

export default function MandiPricesPage() {
  const { lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'Agriculture, Rural & Environment';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedCommodity, setSelectedCommodity] = useState('All');
  const [sortBy, setSortBy] = useState('modalPrice');
  const [sortOrder, setSortOrder] = useState('desc');
  const [sidebarFilter, setSidebarFilter] = useState('');

  const categoriesSidebar = [
    { id: 'agri', label: 'Agriculture, Rural & Environment' },
    { id: 'benefits', label: 'Benefits & Social development' },
    { id: 'business', label: 'Business & Self-employed' },
    { id: 'citizenship', label: 'Citizenship, Visa & Passports' },
    { id: 'defence', label: 'Defence & Foreign affairs' },
    { id: 'transport', label: 'Driving & Transport' },
    { id: 'education', label: 'Education & Learning' },
    { id: 'governance', label: 'Governance & Planning' },
    { id: 'health', label: 'Health & Wellness' },
    { id: 'housing', label: 'Housing & Local services' },
    { id: 'infrastructure', label: 'Infrastructure & Industries' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'justice', label: 'Justice, Law & Grievances' },
    { id: 'taxes', label: 'Money & Taxes' },
    { id: 'science', label: 'Science, IT & Communication' },
    { id: 'travel', label: 'Travel & Tourism' },
    { id: 'welfare', label: 'Welfare of Families' },
    { id: 'youth', label: 'Youth sports & Culture' },
  ];

  const initialData = [
    // Grains & Wheat
    { id: 101, category: 'Agriculture, Rural & Environment', commodity: 'Wheat (गेहूँ)', variety: 'Sharbati / Premium Grade A', minPrice: 2150, maxPrice: 2500, modalPrice: 2380, arrivals: 4800, mandi: 'Khanna Mandi', district: 'Ludhiana', state: 'Punjab', date: '2026-08-26' },
    { id: 102, category: 'Agriculture, Rural & Environment', commodity: 'Wheat (गेहूँ)', variety: 'Kalyan Sona', minPrice: 2050, maxPrice: 2350, modalPrice: 2220, arrivals: 3200, mandi: 'Sirsa Grain Market', district: 'Sirsa', state: 'Haryana', date: '2026-08-26' },
    { id: 103, category: 'Agriculture, Rural & Environment', commodity: 'Basmati Paddy (धान)', variety: 'Pusa 1121', minPrice: 3850, maxPrice: 4300, modalPrice: 4100, arrivals: 5100, mandi: 'Karnal Grain Market', district: 'Karnal', state: 'Haryana', date: '2026-08-26' },
    { id: 104, category: 'Agriculture, Rural & Environment', commodity: 'Basmati Paddy (धान)', variety: 'PB 1509', minPrice: 3400, maxPrice: 3850, modalPrice: 3650, arrivals: 2900, mandi: 'Amritsar APMC', district: 'Amritsar', state: 'Punjab', date: '2026-08-26' },
    { id: 105, category: 'Agriculture, Rural & Environment', commodity: 'Mustard (सरसों)', variety: 'Black Bold 42% Oil', minPrice: 5200, maxPrice: 5750, modalPrice: 5500, arrivals: 1950, mandi: 'Alwar APMC', district: 'Alwar', state: 'Rajasthan', date: '2026-08-26' },
    { id: 106, category: 'Agriculture, Rural & Environment', commodity: 'Potato (आलू)', variety: 'Jyoti / Hybrid', minPrice: 980, maxPrice: 1350, modalPrice: 1180, arrivals: 8900, mandi: 'Agra Mandi', district: 'Agra', state: 'Uttar Pradesh', date: '2026-08-26' },
    { id: 107, category: 'Agriculture, Rural & Environment', commodity: 'Onion (प्याज़)', variety: 'Nashik Red Grade 1', minPrice: 1450, maxPrice: 2000, modalPrice: 1750, arrivals: 6400, mandi: 'Lasalgaon APMC', district: 'Nashik', state: 'Maharashtra', date: '2026-08-26' },
    { id: 108, category: 'Agriculture, Rural & Environment', commodity: 'Maize (मक्का)', variety: 'Yellow Hybrid', minPrice: 1880, maxPrice: 2200, modalPrice: 2050, arrivals: 2600, mandi: 'Chhindwara Mandi', district: 'Chhindwara', state: 'Madhya Pradesh', date: '2026-08-26' },
    
    // Business & Self-employed
    { id: 109, category: 'Business & Self-employed', commodity: 'Cotton (कपास)', variety: 'Long Staple 30mm', minPrice: 6200, maxPrice: 6800, modalPrice: 6550, arrivals: 3400, mandi: 'Rajkot APMC', district: 'Rajkot', state: 'Gujarat', date: '2026-08-26' },
    { id: 110, category: 'Business & Self-employed', commodity: 'Sugarcane (गन्ना)', variety: 'Co 0238', minPrice: 340, maxPrice: 380, modalPrice: 360, arrivals: 12000, mandi: 'Muzaffarnagar Mandi', district: 'Muzaffarnagar', state: 'Uttar Pradesh', date: '2026-08-26' },
    { id: 111, category: 'Business & Self-employed', commodity: 'Soyabean (सोयाबीन)', variety: 'Yellow JS-335', minPrice: 4300, maxPrice: 4750, modalPrice: 4550, arrivals: 4100, mandi: 'Indore Mandi', district: 'Indore', state: 'Madhya Pradesh', date: '2026-08-26' },

    // Benefits & Social development
    { id: 112, category: 'Benefits & Social development', commodity: 'PM Kisan DBT Subsidy Grain', variety: 'Fair Price Shop (FPS) Supply', minPrice: 1800, maxPrice: 2200, modalPrice: 2000, arrivals: 9500, mandi: 'Central Pool Procurement', district: 'Ludhiana', state: 'Punjab', date: '2026-08-26' },

    // Housing & Infrastructure
    { id: 113, category: 'Infrastructure & Industries', commodity: 'Agri Timber / Teak (लकड़ी)', variety: 'Polished Commercial Log', minPrice: 1200, maxPrice: 1600, modalPrice: 1450, arrivals: 800, mandi: 'Yamunanagar Timber Market', district: 'Yamunanagar', state: 'Haryana', date: '2026-08-26' },

    // Health & Wellness / Organic
    { id: 114, category: 'Health & Wellness', commodity: 'Organic Turmeric (हल्दी)', variety: 'Erode Salem Grade A', minPrice: 7500, maxPrice: 8900, modalPrice: 8200, arrivals: 650, mandi: 'Erode APMC', district: 'Erode', state: 'Tamil Nadu', date: '2026-08-26' },

    // Welfare of Families / Milk
    { id: 115, category: 'Welfare of Families', commodity: 'Fresh Buffalo Milk (दूध)', variety: '6.5% FAT / 9% SNF', minPrice: 52, maxPrice: 60, modalPrice: 56, arrivals: 15000, mandi: 'Verka Dairy Milk Pool', district: 'Mohali', state: 'Punjab', date: '2026-08-26' }
  ];

  // Filter Logic
  const filteredData = initialData.filter((item) => {
    const term = searchTerm.trim().toLowerCase();

    // If search term is present, match across commodity, mandi, district, state, or variety
    const matchesSearch =
      !term ||
      item.commodity.toLowerCase().includes(term) ||
      item.mandi.toLowerCase().includes(term) ||
      item.district.toLowerCase().includes(term) ||
      item.state.toLowerCase().includes(term) ||
      item.variety.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term);

    // If a specific sidebar category is active (and not "All"), match category
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === 'All' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesState = selectedState === 'All' || item.state === selectedState;
    const matchesDistrict = selectedDistrict === 'All' || item.district === selectedDistrict;
    const matchesCommodity =
      selectedCommodity === 'All' || item.commodity.toLowerCase().includes(selectedCommodity.toLowerCase());

    return matchesSearch && matchesCategory && matchesState && matchesDistrict && matchesCommodity;
  });

  // If strict filtering yields 0 records, fall back to matching by search or category alone so user is never stuck
  const displayData = filteredData.length > 0
    ? filteredData
    : initialData.filter((item) => {
        if (!searchTerm) return true;
        return item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.state.toLowerCase().includes(searchTerm.toLowerCase());
      });

  const finalData = displayData.length > 0 ? displayData : initialData;

  const sortedData = [...finalData].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (typeof valA === 'string') {
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  const handleCategoryClick = (categoryLabel) => {
    setSelectedCategory(categoryLabel);
    setSearchTerm('');
    setSearchParams({ category: categoryLabel });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Agriculture, Rural & Environment');
    setSelectedState('All');
    setSelectedDistrict('All');
    setSelectedCommodity('All');
    setSearchParams({});
  };

  const handleExportCSV = () => {
    const headers = 'ID,Category,Commodity,Variety,Min Price,Max Price,Modal Price,Arrivals,Mandi,District,State,Date\n';
    const rows = sortedData.map(r => `${r.id},"${r.category}","${r.commodity}","${r.variety}",${r.minPrice},${r.maxPrice},${r.modalPrice},${r.arrivals},"${r.mandi}","${r.district}","${r.state}",${r.date}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mandi_Prices_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredSidebarCategories = categoriesSidebar.filter(cat =>
    cat.label.toLowerCase().includes(sidebarFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-16" id="main-content">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Category Explorer */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-[#0A3663] border-b border-slate-200 pb-2 uppercase tracking-wide font-serif">
              EXPLORE : CATEGORY
            </h3>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search category..."
                value={sidebarFilter}
                onChange={(e) => setSidebarFilter(e.target.value)}
                className="w-full bg-slate-50 text-xs text-slate-800 rounded-2xs pl-7 pr-2 py-1.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0A3663]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>

            <ul className="space-y-1 text-xs font-semibold divide-y divide-slate-100 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredSidebarCategories.map((cat) => {
                const isActive = selectedCategory === cat.label;
                return (
                  <li key={cat.id} className="pt-1.5">
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(cat.label)}
                      className={`w-full text-left py-1.5 px-2 rounded-2xs transition flex items-center justify-between ${
                        isActive
                          ? 'text-[#DC2626] font-bold border-l-3 border-[#DC2626] bg-red-50'
                          : 'text-slate-700 hover:text-[#DC2626] hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{cat.label}</span>
                      {isActive && <span className="text-[10px] bg-[#DC2626] text-white px-1.5 rounded-full font-mono font-bold">Active</span>}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="pt-2 text-[11px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-100">
              <span>Total categories : {categoriesSidebar.length}</span>
              {(selectedCategory !== 'Agriculture, Rural & Environment' || searchTerm || selectedState !== 'All') && (
                <button
                  onClick={handleResetFilters}
                  className="text-[#DC2626] hover:underline font-bold text-[10px]"
                >
                  Reset All
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3 space-y-6">
          
          <div className="bg-white p-5 border border-slate-200 rounded-sm shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
              <div>
                <span className="text-xs text-[#DC2626] font-bold uppercase tracking-wider">
                  Category &gt; {selectedCategory}
                </span>
                <h1 className="text-2xl font-black text-[#0A3663] font-serif mt-1">
                  Daily Mandi Commodity Prices & Arrivals
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-extrabold px-3 py-1.5 rounded-2xs flex items-center space-x-1 shadow-2xs transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>EXPORT CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-2xs border border-slate-300 flex items-center space-x-1 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PRINT</span>
                </button>
              </div>
            </div>

            {/* Filter Controls Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs rounded-2xs p-1.5 border border-slate-200 focus:ring-1 focus:ring-[#0A3663] outline-none"
                >
                  <option value="All">All States</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs rounded-2xs p-1.5 border border-slate-200 focus:ring-1 focus:ring-[#0A3663] outline-none"
                >
                  <option value="All">All Districts</option>
                  <option value="Ludhiana">Ludhiana</option>
                  <option value="Sirsa">Sirsa</option>
                  <option value="Karnal">Karnal</option>
                  <option value="Amritsar">Amritsar</option>
                  <option value="Agra">Agra</option>
                  <option value="Alwar">Alwar</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Indore">Indore</option>
                  <option value="Rajkot">Rajkot</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Commodity</label>
                <select
                  value={selectedCommodity}
                  onChange={(e) => setSelectedCommodity(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs rounded-2xs p-1.5 border border-slate-200 focus:ring-1 focus:ring-[#0A3663] outline-none"
                >
                  <option value="All">All Commodities</option>
                  <option value="Wheat">Wheat (गेहूँ)</option>
                  <option value="Paddy">Basmati Paddy (धान)</option>
                  <option value="Mustard">Mustard (सरसों)</option>
                  <option value="Potato">Potato (आलू)</option>
                  <option value="Onion">Onion (प्याज़)</option>
                  <option value="Maize">Maize (मक्का)</option>
                  <option value="Cotton">Cotton (कपास)</option>
                  <option value="Soyabean">Soyabean (सोयाबीन)</option>
                  <option value="Milk">Fresh Milk (दूध)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs rounded-2xs p-1.5 border border-slate-200 focus:ring-1 focus:ring-[#0A3663] outline-none"
                >
                  <option value="modalPrice">Modal Price (₹/Qtl)</option>
                  <option value="arrivals">Arrival Quantity (Qtl)</option>
                  <option value="commodity">Commodity Name</option>
                </select>
              </div>
            </div>

            {/* Keyword Search Input Bar */}
            <div className="relative pt-2">
              <input
                type="text"
                placeholder="Filter by keyword (e.g. Wheat, Khanna, Ludhiana, Punjab)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 text-xs text-slate-800 rounded-2xs pl-8 pr-8 py-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0A3663]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-4" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-3.5 text-slate-400 hover:text-slate-700"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Commodity Prices Table */}
          <div className="bg-white border border-slate-200 rounded-sm shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0A3663] text-white uppercase tracking-wider font-bold text-[11px]">
                    <th className="p-2.5 border-b border-slate-700">Commodity</th>
                    <th className="p-2.5 border-b border-slate-700">Variety</th>
                    <th className="p-2.5 border-b border-slate-700 text-right">Min Price (₹/Qtl)</th>
                    <th className="p-2.5 border-b border-slate-700 text-right">Max Price (₹/Qtl)</th>
                    <th className="p-2.5 border-b border-slate-700 text-right bg-[#DC2626] text-white">Modal Price (₹/Qtl)</th>
                    <th className="p-2.5 border-b border-slate-700 text-right">Arrivals (Qtl)</th>
                    <th className="p-2.5 border-b border-slate-700">Mandi Name</th>
                    <th className="p-2.5 border-b border-slate-700">Location</th>
                    <th className="p-2.5 border-b border-slate-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                  {sortedData.map((row, idx) => (
                    <tr key={row.id} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-100'}>
                      <td className="p-2.5 font-bold text-[#0A3663]">🌾 {row.commodity}</td>
                      <td className="p-2.5 text-slate-500">{row.variety}</td>
                      <td className="p-2.5 text-right font-mono font-semibold">₹{row.minPrice.toLocaleString()}</td>
                      <td className="p-2.5 text-right font-mono font-semibold">₹{row.maxPrice.toLocaleString()}</td>
                      <td className="p-2.5 text-right font-mono font-black text-[#DC2626] bg-red-50 text-xs">
                        ₹{row.modalPrice.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-right font-mono font-semibold text-slate-600">{row.arrivals.toLocaleString()}</td>
                      <td className="p-2.5 font-bold text-slate-900">{row.mandi}</td>
                      <td className="p-2.5 text-slate-500">{row.district}, {row.state}</td>
                      <td className="p-2.5 text-[11px] text-slate-500 font-mono">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-2.5 border-t border-slate-200 text-xs text-slate-600 flex justify-between items-center font-medium">
              <div className="flex items-center space-x-2">
                <span>Showing {sortedData.length} records</span>
                {(searchTerm || selectedState !== 'All' || selectedDistrict !== 'All' || selectedCommodity !== 'All') && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[#DC2626] font-bold hover:underline text-[11px] ml-2 flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Clear Search Filters</span>
                  </button>
                )}
              </div>
              <span className="font-mono text-[11px]">Last Synced: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

        </main>

      </div>

    </div>
  );
}