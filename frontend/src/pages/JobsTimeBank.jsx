import React, { useEffect, useState } from 'react';
import { jobApi } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Clock,
  Repeat,
  PlusCircle,
  Phone,
  MapPin,
  DollarSign,
  UserCheck,
  CheckCircle,
  Loader2
} from 'lucide-react';

export default function JobsTimeBank() {
  const { lang } = useLanguage();
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [timebank, setTimebank] = useState([]);
  const [skillExchanges, setSkillExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs'); // jobs, timebank, skillExchange, postJob

  // Post Job form
  const [jobTitle, setJobTitle] = useState('');
  const [skillCategory, setSkillCategory] = useState('Mason');
  const [wage, setWage] = useState('600');
  const [wageType, setWageType] = useState('DAILY');
  const [district, setDistrict] = useState('Lucknow');
  const [jobDesc, setJobDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TimeBank contributor form
  const [tbSkill, setTbSkill] = useState('');
  const [tbHours, setTbHours] = useState('2');
  const [tbSchedule, setTbSchedule] = useState('Sunday Mornings');
  const [tbDesc, setTbDesc] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobRes, tbRes, seRes] = await Promise.all([
        jobApi.searchJobs({ page: 0, size: 20 }).catch(() => null),
        jobApi.getTimeBankList().catch(() => null),
        jobApi.getSkillExchanges().catch(() => null)
      ]);
      if (jobRes?.data?.content) setJobs(jobRes.data.content);
      if (tbRes?.data) setTimebank(tbRes.data);
      if (seRes?.data) setSkillExchanges(seRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to post a job opportunity.');
      return;
    }
    setIsSubmitting(true);
    try {
      await jobApi.createJob({
        title: jobTitle,
        skillCategory,
        compensationAmount: parseFloat(wage),
        compensationType: wageType,
        district,
        description: jobDesc
      });
      alert('Job posted successfully!');
      setActiveTab('jobs');
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterTimeBank = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to register TimeBank hours.');
      return;
    }
    try {
      await jobApi.registerTimeBank({
        skillOffered: tbSkill,
        hoursAvailablePerWeek: parseFloat(tbHours),
        availabilitySchedule: tbSchedule,
        description: tbDesc
      });
      alert('TimeBank hours registered!');
      setTbSkill('');
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to register TimeBank entry');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-seva-500 font-bold text-xs uppercase tracking-wider">
            <Briefcase className="w-4 h-4" />
            <span>{lang === 'hi' ? 'रोज़गार, कारीगर व कौशल विनिमय' : 'Livelihood, Wages & TimeBank'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            {lang === 'hi' ? 'रोज़गार एवं टाइम बैंक (Jobs & TimeBank)' : 'Livelihood & TimeBank'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {lang === 'hi'
              ? 'स्थानीय दैनिक मजदूरी कार्य, कुशल मिस्त्री-कारीगर, सेवा घंटे दान (TimeBank) और कौशल अदला-बदली'
              : 'Local daily wage jobs, skilled workers, voluntary service hour banking & skill barter'}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-1.5 bg-stone-200 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'jobs' ? 'bg-white text-stone-950 shadow' : 'text-stone-600'}`}
          >
            💼 {lang === 'hi' ? 'दैनिक रोज़गार' : 'Job Openings'}
          </button>
          <button
            onClick={() => setActiveTab('timebank')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'timebank' ? 'bg-white text-stone-950 shadow' : 'text-stone-600'}`}
          >
            ⏳ {lang === 'hi' ? 'टाइम बैंक' : 'Time Bank'}
          </button>
          <button
            onClick={() => setActiveTab('skillExchange')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'skillExchange' ? 'bg-white text-stone-950 shadow' : 'text-stone-600'}`}
          >
            🔄 {lang === 'hi' ? 'कौशल विनिमय' : 'Skill Barter'}
          </button>
          <button
            onClick={() => setActiveTab('postJob')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'postJob' ? 'bg-seva-500 text-white shadow' : 'text-stone-600'}`}
          >
            + {lang === 'hi' ? 'काम पोस्ट करें' : 'Post Work'}
          </button>
        </div>
      </div>

      {/* Tab: Jobs Openings */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-stone-800">
            {lang === 'hi' ? 'आस-पास उपलब्ध रोज़गार व काम के अवसर' : 'Available Local Jobs & Daily Wage Work'}
          </h2>

          {loading ? (
            <div className="py-20 text-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-seva-500" />
              <p className="text-xs text-stone-500">Loading jobs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-stone-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {job.skillCategory}
                      </span>
                      <div className="text-right">
                        <span className="text-base font-black text-seva-500">₹{job.compensationAmount}</span>
                        <span className="text-[10px] text-stone-500 block">/ {job.compensationType}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-stone-900 mt-2">{job.title}</h3>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-3 leading-relaxed">{job.description}</p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="flex items-center space-x-1 text-stone-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{job.district || 'Lucknow'}</span>
                    </span>
                    {job.contactPhone && (
                      <a href={`tel:${job.contactPhone}`} className="bg-stone-900 text-white font-semibold px-3 py-1 rounded-lg flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-mandi-400" />
                        <span>Apply</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: TimeBank Service Hour Ledger */}
      {activeTab === 'timebank' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-xl space-y-3">
            <div className="flex items-center space-x-2 text-mandi-400 font-bold text-xs">
              <Clock className="w-4 h-4" />
              <span>TIME BANK EXPLAINED</span>
            </div>
            <h2 className="text-2xl font-bold">1 घंटा समाज सेवा = 1 घंटा किसी और की मदद</h2>
            <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
              आप अपने खाली समय में किसी छात्र को पढ़ा सकते हैं, मोबाइल चलाना सिखा सकते हैं, या बाइक रिपेयर कर सकते हैं। बदले में जब आपको मदद चाहिए होगी, दूसरा सदस्य आपके लिए समय देगा।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Registered Contributors List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-stone-900">
                {lang === 'hi' ? 'समय योगदानकर्ता सदस्य (TimeBank Volunteers)' : 'Active TimeBank Contributors'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {timebank.map((tb) => (
                  <div key={tb.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-stone-900 text-sm">{tb.skillOffered}</span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        {tb.hoursAvailablePerWeek} hrs/week
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{tb.description || 'Available for community assistance.'}</p>
                    <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 flex justify-between">
                      <span>Schedule: {tb.availabilitySchedule || 'Weekends'}</span>
                      <span className="font-semibold text-stone-800">{tb.userName || 'Member'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TimeBank Register Form */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-4">
              <h3 className="text-base font-bold text-stone-900">
                {lang === 'hi' ? 'अपना समय दान करें (Contribute Hours)' : 'Offer Your Time (TimeBank)'}
              </h3>
              <form onSubmit={handleRegisterTimeBank} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">कौशल / सहायता (Skill):</label>
                  <input
                    type="text"
                    value={tbSkill}
                    onChange={(e) => setTbSkill(e.target.value)}
                    placeholder="e.g. Computer Help, Math Tutor, Form Filling"
                    required
                    className="w-full p-2 bg-stone-50 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">प्रति सप्ताह घंटे (Hours/Week):</label>
                  <input
                    type="number"
                    value={tbHours}
                    onChange={(e) => setTbHours(e.target.value)}
                    required
                    className="w-full p-2 bg-stone-50 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">उपलब्ध समय (Schedule):</label>
                  <input
                    type="text"
                    value={tbSchedule}
                    onChange={(e) => setTbSchedule(e.target.value)}
                    placeholder="e.g. Sunday 10 AM to 12 PM"
                    className="w-full p-2 bg-stone-50 rounded-lg border border-stone-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-seva-500 hover:bg-seva-600 text-white font-bold py-2 rounded-xl shadow transition"
                >
                  Join TimeBank
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Skill Barter */}
      {activeTab === 'skillExchange' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-stone-800">
            {lang === 'hi' ? 'कौशल अदला-बदली (Direct Peer Skill Barter)' : 'Direct Peer-to-Peer Skill Exchange'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillExchanges.map((se) => (
              <div key={se.id} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-500">{se.userName || 'Member'}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">{se.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-500 font-bold uppercase block">दे रहे हैं (Offered):</span>
                    <span className="font-bold text-stone-900">{se.skillOffered}</span>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-500 font-bold uppercase block">चाहिए (Needed):</span>
                    <span className="font-bold text-mandi-700">{se.skillNeeded}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Post Job Form */}
      {activeTab === 'postJob' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-stone-200 space-y-5">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="text-xl font-bold text-stone-900">
              {lang === 'hi' ? 'दैनिक रोज़गार / काम पोस्ट करें' : 'Post Local Job Opportunity'}
            </h2>
            <p className="text-xs text-stone-500">Connect directly with nearby verified workers and skilled mistris.</p>
          </div>

          <form onSubmit={handleCreateJob} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="font-bold text-stone-700 block mb-1">काम का शीर्षक (Job Title):</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Need Tractor Driver for 10 Days"
                required
                className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">कौशल श्रेणी (Skill Required):</label>
                <select
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-300"
                >
                  <option value="Mason">Mason / Mistri (मिस्त्री)</option>
                  <option value="Driver">Tractor / Vehicle Driver (ड्राइवर)</option>
                  <option value="Electrician">Electrician (इलेक्ट्रीशियन)</option>
                  <option value="Plumber">Plumber (प्लम्बर)</option>
                  <option value="Carpenter">Carpenter / Badhai (बढ़ई)</option>
                  <option value="Farm Labour">Farm Labour / Mazdoor (मज़दूर)</option>
                  <option value="Tutor">Teacher / Tutor (शिक्षक)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">मजदूरी राशि (Wage in ₹):</label>
                <input
                  type="number"
                  value={wage}
                  onChange={(e) => setWage(e.target.value)}
                  required
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">स्थान (District / Village):</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
                className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">काम का विवरण (Description):</label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="e.g. Need mason for 5 days boundary brickwork in village."
                rows={3}
                required
                className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-300"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-seva-500 hover:bg-seva-600 text-white font-bold py-3 rounded-xl shadow transition text-sm"
            >
              {isSubmitting ? 'Posting Job...' : 'Post Job Opportunity'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
