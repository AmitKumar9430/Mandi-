import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { AlertTriangle, Search, CheckCircle2, Clock, Shield, FileText, Send } from 'lucide-react';

export default function GrievancePortalPage() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('SUBMIT'); // SUBMIT | TRACK

  // Submission Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [mandiName, setMandiName] = useState('Khanna Mandi');
  const [category, setCategory] = useState('WEIGHBRIDGE_DISCREPANCY');
  const [description, setDescription] = useState('');
  const [submittedRef, setSubmittedRef] = useState(null);

  // Tracking Search State
  const [trackId, setTrackId] = useState('');
  const [trackedGrievance, setTrackedGrievance] = useState(null);

  const sampleGrievanceDB = {
    'GRV-2026-9041': {
      id: 'GRV-2026-9041',
      name: 'Rameshwar Kumar',
      mobile: '9876543210',
      category: 'Weighbridge Calibration Discrepancy',
      mandi: 'Khanna Mandi, Punjab',
      date: '2026-08-24',
      status: 'IN_PROGRESS',
      department: 'Directorate of Weights & Measures & APMC Officer',
      timeline: [
        { status: 'Submitted', time: '24 Aug 10:15 AM', done: true, desc: 'Complaint registered via Mandi Sewa Portal.' },
        { status: 'Under Review', time: '24 Aug 11:30 AM', done: true, desc: 'Triage officer verified complaint details.' },
        { status: 'Assigned', time: '24 Aug 02:00 PM', done: true, desc: 'Assigned to Inspector S.K. Verma for site visit.' },
        { status: 'In Progress', time: '25 Aug 09:30 AM', done: true, desc: 'On-site digital scale recalibration underway.' },
        { status: 'Resolved', time: 'Expected 26 Aug', done: false, desc: 'Final inspection report & citizen OTP confirmation.' }
      ]
    }
  };

  const handleSubmitGrievance = (e) => {
    e.preventDefault();
    const newId = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef({
      id: newId,
      name: fullName,
      category,
      mandi: mandiName
    });
  };

  const handleTrackSearch = (e) => {
    e.preventDefault();
    const found = sampleGrievanceDB[trackId.trim().toUpperCase()];
    if (found) {
      setTrackedGrievance(found);
    } else {
      setTrackedGrievance({
        id: trackId.trim().toUpperCase(),
        name: 'Citizen Applicant',
        mobile: 'Registered Mobile',
        category: 'General Mandi Complaint',
        mandi: 'Local APMC Yard',
        date: '2026-08-25',
        status: 'UNDER_REVIEW',
        department: 'APMC Grievance Redressal Cell',
        timeline: [
          { status: 'Submitted', time: '25 Aug 09:00 AM', done: true, desc: 'Grievance received on portal.' },
          { status: 'Under Review', time: '25 Aug 10:30 AM', done: true, desc: 'Forwarded to District Nodal Officer.' },
          { status: 'Assigned', time: 'Pending', done: false, desc: 'Awaiting officer assignment.' },
          { status: 'In Progress', time: 'Pending', done: false, desc: 'Field inspection.' },
          { status: 'Resolved', time: 'Pending', done: false, desc: 'Resolution confirmation.' }
        ]
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-12" id="main-content">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white border-b-4 border-emerald-700 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
              CITIZEN GRIEVANCE REDRESSAL
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white font-serif mt-1">
              {lang === 'hi' ? 'लोक शिकायत एवं निवारण पोर्टल' : 'Public Grievance Redressal Portal'}
            </h1>
            <p className="text-xs text-slate-300">
              Lodge grievances regarding weighbridge issues, delayed payments, or mandi infrastructure.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('SUBMIT')}
              className={`px-4 py-2 text-xs font-bold rounded transition ${activeTab === 'SUBMIT' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-200'}`}
            >
              Lodge New Complaint
            </button>
            <button
              onClick={() => setActiveTab('TRACK')}
              className={`px-4 py-2 text-xs font-bold rounded transition ${activeTab === 'TRACK' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-200'}`}
            >
              Track Complaint Status
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* SUBMIT COMPLAINT FORM */}
        {activeTab === 'SUBMIT' && (
          <div className="bg-white p-6 rounded-md border border-slate-300 shadow-sm space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 font-serif flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>{lang === 'hi' ? 'शिकायत पंजीकरण फॉर्म' : 'Grievance Registration Form'}</span>
              </h2>
              <p className="text-xs text-slate-500">Please provide accurate details to ensure prompt department action.</p>
            </div>

            {submittedRef ? (
              <div className="bg-emerald-50 border-2 border-emerald-500 p-6 rounded-md text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-950 font-serif">Complaint Registered Successfully</h3>
                <p className="text-xs text-slate-700">Your complaint reference ID is:</p>
                <span className="inline-block bg-slate-900 text-amber-400 font-mono text-xl font-black px-4 py-2 rounded">
                  {submittedRef.id}
                </span>
                <p className="text-xs text-slate-600">
                  A confirmation SMS has been dispatched to your mobile. You can track resolution progress anytime using your Complaint ID.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setTrackId(submittedRef.id);
                      setSubmittedRef(null);
                      setActiveTab('TRACK');
                    }}
                    className="bg-slate-900 text-white font-bold text-xs px-5 py-2 rounded shadow"
                  >
                    Track Status Now &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitGrievance} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Complainant Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rameshwar Kumar"
                      className="w-full bg-slate-50 text-slate-900 text-xs rounded p-2.5 border border-slate-300 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Mobile Number (For SMS Tracking) *</label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full bg-slate-50 text-slate-900 text-xs rounded p-2.5 border border-slate-300 focus:outline-none focus:border-emerald-600 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Mandi / APMC Location *</label>
                    <select
                      value={mandiName}
                      onChange={(e) => setMandiName(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-xs rounded p-2.5 border border-slate-300 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Khanna Mandi">Khanna Mandi (Punjab)</option>
                      <option value="Karnal Grain Market">Karnal Grain Market (Haryana)</option>
                      <option value="Agra Mandi">Agra Mandi (Uttar Pradesh)</option>
                      <option value="Alwar APMC">Alwar APMC (Rajasthan)</option>
                      <option value="Lasalgaon APMC">Lasalgaon APMC (Maharashtra)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Grievance Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-xs rounded p-2.5 border border-slate-700 focus:outline-none focus:border-emerald-600 font-semibold"
                    >
                      <option value="WEIGHBRIDGE_DISCREPANCY">Weighbridge Calibration Discrepancy</option>
                      <option value="PAYMENT_DELAY">Delay in Crop Payment Release</option>
                      <option value="UNAUTHORIZED_CHARGES">Unauthorized Middleman Deduction</option>
                      <option value="INFRASTRUCTURE">Sanitation / Water / Storage Deficiency</option>
                      <option value="OTHER">Other Public Grievance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Detailed Description of Issue *</label>
                  <textarea
                    required
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the problem clearly including date, time, and involved parties..."
                    className="w-full bg-slate-50 text-slate-900 text-xs rounded p-2.5 border border-slate-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-6 py-2.5 rounded shadow flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Official Complaint</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TRACK COMPLAINT STATUS */}
        {activeTab === 'TRACK' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-md border border-slate-300 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 font-serif">
                Track Complaint Resolution Status
              </h2>

              <form onSubmit={handleTrackSearch} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  placeholder="Enter Complaint ID (e.g. GRV-2026-9041)..."
                  className="w-full bg-slate-50 text-xs font-mono font-bold rounded p-2.5 border border-slate-300 focus:outline-none focus:border-emerald-600 uppercase"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded shadow flex items-center space-x-1 flex-shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </form>
            </div>

            {/* Status Timeline Result */}
            {trackedGrievance && (
              <div className="bg-white p-6 rounded-md border border-slate-300 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between border-b border-slate-200 pb-3 gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">{trackedGrievance.id}</span>
                    <h3 className="text-base font-bold text-slate-900 font-serif">{trackedGrievance.category}</h3>
                    <span className="text-xs text-slate-500 block">{trackedGrievance.mandi}</span>
                  </div>
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-3 py-1 rounded self-start sm:self-auto">
                    STATUS: {trackedGrievance.status}
                  </span>
                </div>

                {/* Timeline Stepper */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Resolution Progress Timeline:</h4>
                  
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-300">
                    {trackedGrievance.timeline.map((step, idx) => (
                      <div key={idx} className="relative flex items-start space-x-3 text-xs">
                        <div className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          step.done ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                        }`}>
                          {step.done ? '✓' : idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900">{step.status}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{step.time}</span>
                          </div>
                          <p className="text-slate-600 mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-600">
                  <strong>Assigned Department:</strong> {trackedGrievance.department}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

