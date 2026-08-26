import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Award, CheckCircle2, FileText, ExternalLink, Search, Filter } from 'lucide-react';

export default function GovernmentSchemesPage() {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');

  const schemes = [
    {
      id: 1,
      name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      category: 'FARMER_SCHEMES',
      authority: 'Ministry of Agriculture & Farmers Welfare',
      benefit: 'Direct financial assistance of ₹6,000 per year paid in 3 equal installments of ₹2,000.',
      eligibility: 'All landholding farmer families with cultivable land holdings in their name.',
      documents: ['Aadhaar Card', 'Land Ownership Records (Khata/Khasra)', 'Active Bank Passbook', 'e-KYC Verification'],
      process: 'Apply through PM-KISAN Portal, Common Service Center (CSC), or State Nodal Agriculture Office.',
      link: 'https://pmkisan.gov.in',
      lastUpdated: '2026-08-15'
    },
    {
      id: 2,
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      category: 'CROP_INSURANCE',
      authority: 'Department of Agriculture & Cooperation',
      benefit: 'Comprehensive insurance cover against crop loss due to droughts, floods, or pest attacks at 1.5%-2% premium.',
      eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.',
      documents: ['Land Possession Certificate', 'Sowing Certificate / Declaration', 'Aadhaar Card', 'Bank Account Details'],
      process: 'Enroll via National Crop Insurance Portal (NCIP), bank branch, or insurance representative within cutoff date.',
      link: 'https://pmfby.gov.in',
      lastUpdated: '2026-08-10'
    },
    {
      id: 3,
      name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
      category: 'SUBSIDIES',
      authority: 'State Department of Agriculture',
      benefit: '40% to 50% subsidy for purchasing tractors, power tillers, combine harvesters, and rotavators.',
      eligibility: 'Individual farmers, Small & Marginal farmers, Women farmers, and Custom Hiring Centers (CHCs).',
      documents: ['Identity Proof', 'Land Registry Copy', 'Quotation from Authorized Equipment Dealer', 'Bank Details'],
      process: 'Submit application online on Direct Benefit Transfer (DBT) Agriculture Portal before procurement.',
      link: 'https://agrimachinery.nic.in',
      lastUpdated: '2026-07-28'
    },
    {
      id: 4,
      name: 'Kisan Credit Card (KCC) Scheme',
      category: 'FINANCIAL_ASSISTANCE',
      authority: 'Reserve Bank of India & NABARD',
      benefit: 'Concessional crop loans up to ₹3 Lakh at an effective interest rate of 4% per annum.',
      eligibility: 'Farmers, cultivators, joint borrowers, self-help groups, and tenant farmers.',
      documents: ['KCC Application Form', 'Land Revenue Receipts', 'Voter ID / Aadhaar', 'Passport Photograph'],
      process: 'Fill form at any Commercial Bank, Regional Rural Bank (RRB), or Cooperative Bank branch.',
      link: 'https://nabard.org',
      lastUpdated: '2026-08-01'
    },
    {
      id: 5,
      name: 'Soil Health Card Scheme',
      category: 'MARKET_SERVICES',
      authority: 'National Mission for Sustainable Agriculture',
      benefit: 'Free soil testing report card with crop-specific fertilizer and nutrient recommendations.',
      eligibility: 'All agricultural landowners and cultivators across rural districts.',
      documents: ['Soil Sample Geo-Tag Code', 'Farmer Land Identification Number'],
      process: 'Soil samples collected by Village Mitra / Agri Field Officer and processed at District Soil Testing Lab.',
      link: 'https://soilhealth.dac.gov.in',
      lastUpdated: '2026-08-18'
    }
  ];

  const filteredSchemes = schemes.filter(s => {
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.benefit.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-12" id="main-content">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white border-b-4 border-emerald-700 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            PUBLIC WELFARE DIRECTORY
          </span>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white font-serif mt-1">
            {lang === 'hi' ? 'सरकारी कृषि योजनाएं एवं कल्याण सेवाएं' : 'Government Agricultural Schemes & Subsidies'}
          </h1>
          <p className="text-xs text-slate-300">
            Verified agricultural welfare programs, eligibility criteria, required documents, and official portals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* Search & Category Filter */}
        <div className="bg-white p-4 rounded-md border border-slate-300 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scheme name or benefit..."
              className="w-full bg-slate-50 text-xs rounded pl-8 pr-3 py-2 border border-slate-300 focus:outline-none focus:border-emerald-600 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {[
              { id: 'ALL', label: 'All Schemes' },
              { id: 'FARMER_SCHEMES', label: 'Farmer Welfare' },
              { id: 'SUBSIDIES', label: 'Subsidies' },
              { id: 'CROP_INSURANCE', label: 'Crop Insurance' },
              { id: 'FINANCIAL_ASSISTANCE', label: 'KCC & Loans' },
              { id: 'MARKET_SERVICES', label: 'Soil & Services' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Schemes Catalog */}
        <div className="space-y-4">
          {filteredSchemes.map(scheme => (
            <div key={scheme.id} className="bg-white p-5 rounded-md border border-slate-300 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
                <div>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-slate-300">
                    {scheme.authority}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 font-serif mt-1">{scheme.name}</h3>
                </div>
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center space-x-1 self-start sm:self-auto shadow"
                >
                  <span>Official Scheme Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                
                <div className="bg-emerald-50/60 p-3 rounded border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-950 uppercase text-[10px] block">Key Benefits:</span>
                  <p className="text-slate-800 leading-relaxed font-medium">{scheme.benefit}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 uppercase text-[10px] block">Eligibility Criteria:</span>
                  <p className="text-slate-700 leading-relaxed">{scheme.eligibility}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 uppercase text-[10px] block">Required Documents:</span>
                  <ul className="space-y-0.5 text-slate-700">
                    {scheme.documents.map((doc, idx) => (
                      <li key={idx} className="flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              <div className="bg-slate-100 p-2.5 rounded text-[11px] text-slate-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                <span><strong>Application Procedure:</strong> {scheme.process}</span>
                <span className="text-[10px] text-slate-500 font-mono">Last Verified: {scheme.lastUpdated}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

