import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  UserPlus,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  Shield,
  Sprout,
  User,
  Wrench,
  HeartHandshake,
  Truck,
  Sparkles,
  CheckCircle2,
  KeyRound,
  MapPin
} from 'lucide-react';

const ROLE_OPTIONS = [
  {
    id: 'ROLE_CITIZEN',
    title: 'नागरिक / परिवार',
    titleEn: 'Citizen / Resident',
    desc: 'समस्या समाधान, सरकारी योजनाएं व बुनियादी मदद',
    descEn: 'Report problems, access schemes & community help',
    icon: '👤',
    color: 'border-blue-500 bg-blue-50/50'
  },
  {
    id: 'ROLE_FARMER',
    title: 'किसान (Farmer)',
    titleEn: 'Farmer / Producer',
    desc: 'फसल बिक्री, ट्रैक्टर/उपकरण किराया व मंडी भाव',
    descEn: 'Sell crops, hire farm equipment & mandi rates',
    icon: '🌾',
    color: 'border-emerald-500 bg-emerald-50/50'
  },
  {
    id: 'ROLE_WORKER',
    title: 'कारीगर / श्रमिक (Worker)',
    titleEn: 'Skilled Worker / Mistri',
    desc: 'प्लम्बर, इलेक्ट्रीशियन, राजमिस्त्री व दिहाड़ी कार्य',
    descEn: 'Plumbing, electrical, masonry & daily wage work',
    icon: '🛠️',
    color: 'border-amber-500 bg-amber-50/50'
  },
  {
    id: 'ROLE_VOLUNTEER',
    title: 'वालंटियर (Volunteer)',
    titleEn: 'Community Volunteer',
    desc: 'निःशुल्क सेवा, अस्पताल मदद व समस्या सत्यापन',
    descEn: 'Voluntary help, hospital assistance & seva tasks',
    icon: '🤝',
    color: 'border-rose-500 bg-rose-50/50'
  },
  {
    id: 'ROLE_SERVICE_PROVIDER',
    title: 'सेवा / उपकरण प्रदाता',
    titleEn: 'Equipment & Transport Provider',
    desc: 'ट्रैक्टर, कंबाइन हार्वेस्टर व वाहन मालिक',
    descEn: 'Tractor pool, transport vehicles & agri machinery',
    icon: '🚜',
    color: 'border-teal-500 bg-teal-50/50'
  },
  {
    id: 'ROLE_MANDI_MITRA',
    title: 'मंडी मित्र (Mitra)',
    titleEn: 'MANDI Village Mitra',
    desc: 'ग्रामीण डिजिटल सहायक व समस्या समाधान समन्वयक',
    descEn: 'Village digital facilitator & ground coordinator',
    icon: '🌟',
    color: 'border-purple-500 bg-purple-50/50'
  },
  {
    id: 'ROLE_ADMIN',
    title: 'प्रशासक (Administrator)',
    titleEn: 'Portal Admin',
    desc: 'पोर्टल प्रबंधन, सत्यापन व नीतिगत निगरानी (Passkey Required)',
    descEn: 'Full administration & verification (Requires Passkey)',
    icon: '🛡️',
    color: 'border-red-500 bg-red-50/50',
    requiresPasskey: true
  }
];

export default function Register() {
  const { register } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('ROLE_CITIZEN');
  const [adminPasskey, setAdminPasskey] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('Lucknow');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMsg(lang === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMsg(lang === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg(lang === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.');
      return;
    }

    if (selectedRole === 'ROLE_ADMIN') {
      if (adminPasskey.trim() !== 'MandiAdmin@123') {
        setErrorMsg(
          lang === 'hi'
            ? 'गलत एडमिन पासकी! प्रशासक पंजीकरण के लिए MandiAdmin@123 दर्ज करें।'
            : 'Invalid Admin Passkey! Enter MandiAdmin@123 to register as Administrator.'
        );
        return;
      }
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const rolesToAssign = [selectedRole];
      if (selectedRole === 'ROLE_ADMIN') {
        rolesToAssign.push('ROLE_CITIZEN');
      }

      await register({
        phone: phone.trim(),
        fullName: fullName.trim(),
        password,
        email: email.trim() || undefined,
        villageOrTown: village.trim() || 'Lucknow Village',
        district: district.trim() || 'Lucknow',
        roles: rolesToAssign,
        adminPasskey: selectedRole === 'ROLE_ADMIN' ? adminPasskey.trim() : undefined
      });

      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl border-2 border-stone-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Rural Friendly Banner (4 Cols) */}
        <div className="lg:col-span-4 relative hidden lg:flex flex-col justify-between p-8 bg-pine-950 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{ backgroundImage: "url('/rural_village_landscape.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-900/80 to-transparent" />

          {/* Top Branding */}
          <div className="relative z-10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-stone-950 font-black text-2xl shadow-lg border-2 border-emerald-300">
              म
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              मंडी <span className="text-emerald-400 font-mono text-xl">MANDI 2.0</span>
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed font-medium">
              "समस्या बताओ। मंडी समाधान तक ले जाएगा।"
            </p>
          </div>

          {/* Role Info */}
          <div className="relative z-10 space-y-3 py-6">
            <div className="text-xs text-emerald-300 font-black uppercase tracking-wider">
              भूमिका अनुसार सेवाएं:
            </div>
            <div className="space-y-2 text-xs text-stone-200">
              <p>🌾 <strong>किसान:</strong> उपज सीधे खरीदार को बेचें</p>
              <p>🛠️ <strong>कारीगर:</strong> दैनिक मजदूरी व मिस्त्री काम</p>
              <p>🤝 <strong>वालंटियर:</strong> जरूरतमंदों की सेवा करें</p>
              <p>🚜 <strong>उपकरण:</strong> ट्रैक्टर व मशीनरी पूल</p>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-pine-800/80 text-[11px] text-stone-400">
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>सत्यापित भारतीय ग्रामीण समाधान तंत्र</span>
            </div>
          </div>
        </div>

        {/* Right Side: Rich Role Selection & Registration Form (8 Cols) */}
        <div className="lg:col-span-8 p-6 sm:p-10 space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <div className="flex items-center space-x-2 text-pine-700 font-black text-xs uppercase tracking-wider">
              <UserPlus className="w-4 h-4" />
              <span>{lang === 'hi' ? 'नया पंजीकरण' : 'New User Registration'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
              {lang === 'hi' ? 'मंडी में अपनी भूमिका चुनें व खाता बनाएं' : 'Create Your MANDI Account'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {lang === 'hi'
                ? 'अपनी सही भूमिका का चयन करें ताकि आपको सही काम व सहायता मिल सके।'
                : 'Select your primary role to receive tailored resolution tools and services.'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 text-red-800 text-xs sm:text-sm rounded-2xl border border-red-200 flex items-center space-x-2.5 font-bold animate-fadeIn">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6 text-xs sm:text-sm">
            {/* 1. Interactive Role Selector Grid */}
            <div>
              <label className="font-bold text-stone-900 block mb-2 text-sm">
                1. {lang === 'hi' ? 'अपनी प्राथमिक भूमिका चुनें (Select Your Role):' : 'Select Your Role:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ROLE_OPTIONS.map((r) => {
                  const isSelected = selectedRole === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-pine-600 bg-pine-50/80 shadow-md ring-2 ring-pine-500/20'
                          : 'border-stone-200 hover:border-stone-400 bg-stone-50/60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5">
                          <span className="text-2xl">{r.icon}</span>
                          <div>
                            <div className="font-black text-stone-900 text-xs sm:text-sm">
                              {lang === 'hi' ? r.title : r.titleEn}
                            </div>
                            <div className="text-[11px] text-stone-500 font-medium line-clamp-1">
                              {lang === 'hi' ? r.desc : r.descEn}
                            </div>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          isSelected ? 'border-pine-700 bg-pine-700' : 'border-stone-300'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Admin Secret Passkey Field (Shown only when Admin is selected) */}
            {selectedRole === 'ROLE_ADMIN' && (
              <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-2 animate-fadeIn">
                <div className="flex items-center space-x-2 text-amber-900 font-black text-xs sm:text-sm">
                  <KeyRound className="w-4 h-4 text-amber-700" />
                  <span>{lang === 'hi' ? 'प्रशासक सीक्रेट पासकी (Admin Passkey Required):' : 'Admin Security Passkey:'}</span>
                </div>
                <input
                  type="password"
                  value={adminPasskey}
                  onChange={(e) => setAdminPasskey(e.target.value)}
                  placeholder="Enter MandiAdmin@123"
                  required
                  className="w-full p-3 bg-white rounded-xl border border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm font-bold text-stone-900"
                />
                <p className="text-[11px] text-amber-800 font-semibold">
                  {lang === 'hi'
                    ? '⚠️ केवल अधिकृत एडमिन हेतु। एडमिन पैनल एक्सेस के लिए MandiAdmin@123 दर्ज करें।'
                    : '⚠️ For authorized administrators only. Enter MandiAdmin@123 to authorize.'}
                </p>
              </div>
            )}

            {/* 2. Personal Details Form */}
            <div className="space-y-4">
              <label className="font-bold text-stone-900 block text-sm border-t border-stone-200 pt-4">
                2. {lang === 'hi' ? 'व्यक्तिगत जानकारी (Personal Information):' : 'Personal Information:'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {lang === 'hi' ? 'पूरा नाम (Full Name):' : 'Full Name:'}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Balram Singh"
                    required
                    className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-pine-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {lang === 'hi' ? 'मोबाइल नंबर (Phone Number):' : 'Phone Number:'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    required
                    className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-pine-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {lang === 'hi' ? 'पासवर्ड (Password):' : 'Password:'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      required
                      className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-pine-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {lang === 'hi' ? 'ईमेल (वैकल्पिक / Optional):' : 'Email (Optional):'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. farmer@mandi.org"
                    className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {lang === 'hi' ? 'गाँव / कस्बा (Village / Town):' : 'Village / Town:'}
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Malihabad, Kakori"
                    className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {lang === 'hi' ? 'ज़िला (District):' : 'District:'}
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Lucknow, Barabanki"
                    className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pine-700 hover:bg-pine-800 text-white font-black py-4 rounded-2xl shadow-xl transition transform active:scale-98 flex items-center justify-center space-x-2 text-sm sm:text-base border border-emerald-400 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>खाता बन रहा है...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>
                    {selectedRole === 'ROLE_ADMIN'
                      ? (lang === 'hi' ? '🛡️ एडमिन के रूप में पंजीकरण करें' : '🛡️ Register as Administrator')
                      : (lang === 'hi' ? 'खाता बनाएं व सेवा शुरू करें' : 'Create Account & Continue')}
                  </span>
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-stone-500 font-medium pt-2 border-t border-stone-200">
            <span>{lang === 'hi' ? 'पहले से खाता है?' : 'Already have an account?'} </span>
            <Link to="/login" className="font-black text-pine-700 hover:underline">
              {lang === 'hi' ? 'यहाँ लॉगिन करें (Sign In)' : 'Sign In Here'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
