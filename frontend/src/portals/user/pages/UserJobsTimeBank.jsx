import React, { useEffect, useState } from 'react';
import { userJobApi } from '../../../shared/api/userApi';
import { useLanguage } from '../../../context/LanguageContext';
import { useUserAuth } from '../../../auth/UserAuthContext';
import {
  Briefcase,
  PlusCircle,
  Phone,
  MapPin,
  Clock,
  Coins,
  ShieldCheck,
  CheckCircle,
  Loader2,
  Wrench,
  Sparkles,
  Users
} from 'lucide-react';

export default function UserJobsTimeBank() {
  const { lang, t } = useLanguage();
  const { user } = useUserAuth();

  const [jobs, setJobs] = useState([]);
  const [timeBankEntries, setTimeBankEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'timebank' | 'postJob'

  // Post Job Form
  const [title, setTitle] = useState('Experienced Farm Labor Required for Harvesting');
  const [category, setCategory] = useState('FARM_LABOR');
  const [wage, setWage] = useState('500');
  const [duration, setDuration] = useState('3 Days');
  const [village, setVillage] = useState('Kakori, Lucknow');
  const [desc, setDesc] = useState('Need 2 workers for wheat cutting and bagging. Food provided.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TimeBank Offer Form
  const [skillName, setSkillName] = useState('Electrical Pump & Motor Repair');
  const [skillCategory, setSkillCategory] = useState('ELECTRICAL');
  const [timebankDesc, setTimebankDesc] = useState('Can help repair submersible pumps and wiring in exchange for farm harvesting help or credits.');
  const [isTimebankSubmitting, setIsTimebankSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobRes, tbRes] = await Promise.all([
        userJobApi.searchJobs({ page: 0, size: 20 }).catch(() => null),
        userJobApi.getTimeBankList().catch(() => null)
      ]);
      if (jobRes?.data?.content) setJobs(jobRes.data.content);
      if (tbRes?.data) setTimeBankEntries(tbRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!user) {
      alert(lang === 'hi' ? 'कार्य दर्ज करने के लिए कृपया लॉगिन करें।' : 'Please login to post a job.');
      return;
    }
    setIsSubmitting(true);
    try {
      await userJobApi.createJob({
        title,
        jobCategory: category,
        dailyWageRate: parseFloat(wage),
        estimatedDurationDays: 3,
        villageOrTown: village,
        district: 'Lucknow',
        description: desc
      });
      alert('Job listing published successfully!');
      setActiveTab('jobs');
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterTimebank = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to offer skills in TimeBank.');
      return;
    }
    setIsTimebankSubmitting(true);
    try {
      await userJobApi.registerTimeBank({
        skillName,
        category: skillCategory,
        description: timebankDesc
      });
      alert('Skill offered successfully in MANDI TimeBank!');
      setActiveTab('timebank');
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to register skill');
    } finally {
      setIsTimebankSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-pine-900 to-pine-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-amber-600/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-black text-xs uppercase tracking-wider">
              <Briefcase className="w-4 h-4" />
              <span>{lang === 'hi' ? 'दैनिक रोज़गार व श्रम सहयोग' : 'Rural Livelihood & TimeBank'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-1">
              {lang === 'hi' ? '🛠️ रोज़गार व टाइम बैंक' : '🛠️ MANDI Jobs & TimeBank'}
            </h1>
            <p className="text-sm sm:text-base text-stone-200 mt-2 max-w-2xl font-medium">
              {lang === 'hi'
                ? 'गाँव के कुशल कारीगर (राजमिस्त्री, इलेक्ट्रीशियन, प्लम्बर) एवं बिना पैसे के समय और कौशल की अदला-बदली (TimeBank)'
                : 'Direct livelihood opportunities, fair daily wages, and cashless community skill exchange'}
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="flex items-center space-x-2 bg-stone-900/80 p-1.5 rounded-2xl text-xs sm:text-sm font-black border border-stone-700">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'jobs' ? 'bg-amber-400 text-stone-950 shadow-lg' : 'text-stone-300'}`}
            >
              💼 {lang === 'hi' ? 'उपलब्ध कार्य' : 'Daily Jobs'}
            </button>
            <button
              onClick={() => setActiveTab('timebank')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'timebank' ? 'bg-amber-400 text-stone-950 shadow-lg' : 'text-stone-300'}`}
            >
              ⌛ {lang === 'hi' ? 'टाइम बैंक' : 'TimeBank'}
            </button>
            <button
              onClick={() => setActiveTab('postJob')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'postJob' ? 'bg-emerald-500 text-white shadow-lg' : 'text-stone-300'}`}
            >
              + {lang === 'hi' ? 'कार्य दर्ज करें' : 'Post Work'}
            </button>
          </div>
        </div>
      </div>

      {/* 1. Daily Jobs List */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            {lang === 'hi' ? 'गाँव व आस-पास में उपलब्ध कार्य अवसर' : 'Current Rural Work Opportunities'}
          </h2>

          {loading ? (
            <div className="py-20 text-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-600" />
              <p className="text-xs text-stone-500">Loading jobs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl border-2 border-stone-200 hover:border-amber-500 transition flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-xs uppercase font-black bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-300">
                        {job.jobCategory || 'General Work'}
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-black text-pine-800">₹{job.dailyWageRate}</span>
                        <span className="text-xs text-stone-500 font-bold block">/ दिन (Daily Wage)</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-stone-900 mt-3">{job.title}</h3>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{job.description}</p>
                  </div>

                  <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-stone-500 font-bold flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{job.villageOrTown || 'Lucknow'}</span>
                    </span>

                    {job.contactPhone && (
                      <a
                        href={`tel:${job.contactPhone}`}
                        className="bg-pine-700 hover:bg-pine-800 text-white font-bold px-4 py-2 rounded-xl flex items-center space-x-1 shadow transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>कॉल करें</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. TimeBank Community Skill Exchange */}
      {activeTab === 'timebank' && (
        <div className="space-y-6">
          <div className="bg-amber-50 p-6 rounded-3xl border-2 border-amber-300 space-y-2">
            <h3 className="text-lg font-black text-amber-950 flex items-center space-x-2">
              <Coins className="w-5 h-5 text-amber-600" />
              <span>टाइम बैंक क्या है? (What is MANDI TimeBank?)</span>
            </h3>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
              टाइम बैंक एक निःशुल्क सामुदायिक सहयोग प्रणाली है जहाँ आप किसी साथी ग्रामीण की 1 घंटा मदद करते हैं और बदले में आपको 1 "टाइम क्रेडिट" मिलता है, जिसका उपयोग आप अपनी आवश्यकता के समय किसी अन्य विशेषज्ञ से मदद लेने में कर सकते हैं।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timeBankEntries.map((tb, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 shadow-md border-2 border-stone-200 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="bg-pine-100 text-pine-900 font-bold text-xs px-2.5 py-1 rounded-lg">
                    {tb.category || 'Skill Offer'}
                  </span>
                  <span className="text-xs font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    1 hr = 1 Credit
                  </span>
                </div>
                <h4 className="font-black text-stone-900 text-base">{tb.skillName}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{tb.description}</p>
                <div className="pt-3 border-t text-[11px] text-stone-500 font-semibold flex justify-between">
                  <span>Provider: {tb.userName || 'Community Member'}</span>
                  <span className="text-emerald-700 font-bold">Verified Skill</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Post Job Form */}
      {activeTab === 'postJob' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-stone-300 space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h2 className="text-2xl font-black text-stone-900">
              {lang === 'hi' ? 'नया कार्य या मजदूरी कार्य दर्ज करें' : 'Post a Job or Labor Request'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Local workers and skilled mistris will be notified immediately.
            </p>
          </div>

          <form onSubmit={handlePostJob} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="font-bold text-stone-800 block mb-1">कार्य शीर्षक (Job Title):</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-800 block mb-1">श्रेणी (Category):</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-bold"
                >
                  <option value="FARM_LABOR">कृषि मजदूरी (Farm Labor)</option>
                  <option value="MASONRY">राजमिस्त्री (Masonry & Construction)</option>
                  <option value="ELECTRICAL">इलेक्ट्रीशियन (Electrical)</option>
                  <option value="PLUMBING">प्लम्बर व हैंडपंप (Plumbing)</option>
                  <option value="CARPENTRY">बढ़ई (Carpentry)</option>
                  <option value="DRIVER">ड्राइवर व ट्रांसपोर्ट (Transport)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">दैनिक मजदूरी दर (₹/Day):</label>
                <input
                  type="number"
                  value={wage}
                  onChange={(e) => setWage(e.target.value)}
                  required
                  className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">गाँव / कार्यस्थल (Location):</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                required
                className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">कार्य का विवरण (Description & Perks):</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                required
                className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pine-700 hover:bg-pine-800 text-white font-black py-3.5 rounded-2xl shadow-xl transition text-base"
            >
              {isSubmitting ? 'Publishing...' : 'कार्य प्रकाशित करें (Publish Job)'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
