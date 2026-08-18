import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../../auth/UserAuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import MobileAccessModal from '../../../components/MobileAccessModal';
import LocationPicker from '../../../components/LocationPicker';
import {
  UserPlus,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  QrCode,
  ArrowRight,
  RotateCcw,
  Mail,
  ShieldCheck,
  Check
} from 'lucide-react';

const USER_ROLES = [
  {
    id: 'ROLE_CITIZEN',
    title: 'नागरिक / परिवार',
    titleEn: 'Citizen / Resident',
    desc: 'समस्या समाधान, गाँव की बुनियादी सुविधाएं व योजनाएं',
    descEn: 'Report civic issues, access schemes & community tools',
    icon: '👤'
  },
  {
    id: 'ROLE_FARMER',
    title: 'किसान (Farmer)',
    titleEn: 'Farmer / Producer',
    desc: 'फसल बिक्री, ट्रैक्टर/उपकरण किराया व मंडी भाव',
    descEn: 'Sell crops, hire farm equipment & mandi rates',
    icon: '🌾'
  },
  {
    id: 'ROLE_SERVICE_PROVIDER',
    title: 'सेवा / उपकरण प्रदाता',
    titleEn: 'Equipment & Transport Provider',
    desc: 'ट्रैक्टर, कंबाइन हार्वेस्टर व वाहन मालिक पूल',
    descEn: 'Tractor pool, transport vehicles & agri machinery',
    icon: '🚜'
  },
  {
    id: 'ROLE_MANDI_MITRA',
    title: 'मंडी मित्र (Mitra)',
    titleEn: 'MANDI Village Mitra',
    desc: 'ग्रामीण डिजिटल सहायक व समस्या समाधान समन्वयक',
    descEn: 'Village digital facilitator & ground coordinator',
    icon: '🌟'
  }
];

export default function UserRegister() {
  const { requestRegisterOtp, verifyRegisterOtp } = useUserAuth();
  const { lang, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  // Registration step: 'FORM' (fill personal data) vs 'VERIFY' (enter 6-digit EmailJS OTP)
  const [step, setStep] = useState('FORM');

  // Form State
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('ROLE_CITIZEN');
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Lucknow');
  const [village, setVillage] = useState('');
  const [pincode, setPincode] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // OTP Verification State
  const [otpRequestId, setOtpRequestId] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  const digitInputRefs = useRef([]);

  // Countdown timer for 60-second Resend OTP cooldown
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // ==========================================================
  // STEP 1: REQUEST REGISTRATION OTP VIA EMAILJS
  // ==========================================================
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg(lang === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name (at least 2 characters).');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMsg(lang === 'hi' ? 'सत्यापन के लिए एक वैध ईमेल पता आवश्यक है।' : 'A valid email address is required to receive your verification code.');
      return;
    }
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg(lang === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg(lang === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters long.');
      return;
    }
    if (!password || password !== confirmPassword) {
      setErrorMsg(lang === 'hi' ? 'पासवर्ड और पासवर्ड पुष्टि मेल नहीं खाते।' : 'Password and Confirm Password do not match.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const payload = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone.slice(-10),
      password,
      confirmPassword,
      roles: [selectedRole],
      state: state || 'Uttar Pradesh',
      district: district.trim() || 'Lucknow',
      villageOrTown: village.trim() || 'Village',
      pincode: pincode.trim(),
      latitude,
      longitude,
      preferredLanguage: lang === 'hi' ? 'HI' : 'EN'
    };

    try {
      const data = await requestRegisterOtp(payload);
      setOtpRequestId(data.otpRequestId || data.verificationId || '');
      setMaskedEmail(data.maskedPhone || email.trim());
      setOtpDigits(['', '', '', '', '', '']);
      setStep('VERIFY');
      setCountdown(60);

      setSuccessMsg(
        lang === 'hi'
          ? `सत्यापन कोड आपके ईमेल पर भेज दिया गया है।`
          : `Verification code has been sent directly to your email.`
      );

      setTimeout(() => {
        if (digitInputRefs.current[0]) {
          digitInputRefs.current[0].focus();
        }
      }, 100);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // OTP INPUT HANDLERS
  // ==========================================================
  const handleDigitChange = (index, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const newDigits = [...otpDigits];

    if (numericValue.length > 1) {
      const pasted = numericValue.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setOtpDigits(newDigits);
      const nextIdx = Math.min(pasted.length, 5);
      if (digitInputRefs.current[nextIdx]) {
        digitInputRefs.current[nextIdx].focus();
      }
      return;
    }

    newDigits[index] = numericValue;
    setOtpDigits(newDigits);

    if (numericValue && index < 5) {
      if (digitInputRefs.current[index + 1]) {
        digitInputRefs.current[index + 1].focus();
      }
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      if (digitInputRefs.current[index - 1]) {
        digitInputRefs.current[index - 1].focus();
      }
    }
  };

  const handleDigitPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pastedData) {
      const newDigits = ['', '', '', '', '', ''];
      for (let i = 0; i < pastedData.length; i++) {
        newDigits[i] = pastedData[i];
      }
      setOtpDigits(newDigits);
      const nextIdx = Math.min(pastedData.length, 5);
      if (digitInputRefs.current[nextIdx]) {
        digitInputRefs.current[nextIdx].focus();
      }
    }
  };

  // ==========================================================
  // STEP 2: VERIFY REGISTRATION OTP
  // ==========================================================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setErrorMsg(
        lang === 'hi'
          ? 'कृपया 6 अंकों का सही सत्यापन कोड दर्ज करें।'
          : 'Please enter the complete 6-digit verification code.'
      );
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      await verifyRegisterOtp(otpRequestId, fullOtp);
      navigate('/user/dashboard');
    } catch (err) {
      setErrorMsg(
        err.message ||
          (lang === 'hi' ? 'अमान्य या समाप्त कोड। कृपया पुनः प्रयास करें।' : 'Invalid or expired verification code.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative bg-rural-hero">
      {/* Mobile QR Modal */}
      <MobileAccessModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />

      {/* Top Floating Language & Mobile QR Bar */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setShowQrModal(true)}
          className="flex items-center space-x-1.5 bg-emerald-950/85 hover:bg-emerald-900 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-500/50 text-xs font-black shadow-lg backdrop-blur-md transition animate-pulse"
          aria-label={lang === 'hi' ? 'मोबाइल QR कोड खोलें' : 'Open Mobile QR Code'}
        >
          <QrCode className="w-4 h-4 text-emerald-400" />
          <span className="hidden xs:inline">{lang === 'hi' ? '📱 मोबाइल QR' : '📱 Mobile QR'}</span>
        </button>

        <button
          type="button"
          onClick={toggleLanguage}
          className="flex items-center space-x-1.5 bg-stone-900/80 hover:bg-stone-900 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-xs font-bold shadow-lg backdrop-blur-md transition"
          aria-label={lang === 'hi' ? 'Switch language to English' : 'भाषा हिन्दी में बदलें'}
        >
          <span className="text-sm">🌐</span>
          <span>{lang === 'hi' ? 'English' : 'हिन्दी'}</span>
        </button>
      </div>

      <div className="max-w-5xl w-full bg-white/50 backdrop-blur-md rounded-3xl shadow-2xl border border-white/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Side: Rural Friendly Banner (4 Cols) */}
        <div className="lg:col-span-4 relative hidden lg:flex flex-col justify-between p-8 bg-pine-950/60 text-white overflow-hidden backdrop-blur-xs border-r border-white/20">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
            style={{ backgroundImage: "url('/rural_village_landscape.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pine-950/75 via-pine-900/40 to-transparent" />

          {/* Top Branding */}
          <div className="relative z-10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-stone-950 font-black text-2xl shadow-lg border-2 border-emerald-300">
              म
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              मंडी <span className="text-emerald-400 font-mono text-2xl">ManDi</span>
            </h2>
            <p className="text-xs text-stone-100 leading-relaxed font-semibold drop-shadow-sm">
              {lang === 'hi' ? '"समस्या बताओ। मंडी समाधान तक ले जाएगा।"' : '"Describe Problem. MANDI Guides You To Solution."'}
            </p>
          </div>

          {/* Role Info */}
          <div className="relative z-10 space-y-3 py-6">
            <div className="text-xs text-emerald-300 font-black uppercase tracking-wider">
              {lang === 'hi' ? 'भूमिका अनुसार सेवाएं:' : 'Tailored Services by Role:'}
            </div>
            <div className="space-y-2 text-xs text-stone-100 font-semibold drop-shadow-sm">
              <p>🌾 <strong>किसान:</strong> उपज सीधे खरीदार को बेचें व मंडी भाव</p>
              <p>🚜 <strong>उपकरण:</strong> ट्रैक्टर व मशीनरी किराया पूल</p>
              <p>🚰 <strong>नागरिक:</strong> गाँव की समस्याएं व हैंडपंप/सड़क निवारण</p>
              <p>🏛️ <strong>योजनाएं:</strong> सरकारी योजना सहायता व सब्सिडी</p>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-white/20 text-[11px] text-stone-200 font-semibold">
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>सत्यापित भारतीय ग्रामीण समाधान तंत्र</span>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form / OTP Verification (8 Cols) */}
        <div className="lg:col-span-8 p-6 sm:p-10 space-y-6 bg-white/40 lg:bg-white/25 backdrop-blur-xs">
          <div className="border-b border-stone-300/80 pb-4">
            <div className="flex items-center space-x-2 text-pine-900 font-black text-xs uppercase tracking-wider">
              <UserPlus className="w-4 h-4" />
              <span>{lang === 'hi' ? 'नागरिक पंजीकरण' : 'Citizen Registration'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-950 mt-1 drop-shadow-xs">
              {step === 'FORM'
                ? (lang === 'hi' ? 'मंडी में अपनी भूमिका चुनें व खाता बनाएं' : 'Join MANDI Community')
                : (lang === 'hi' ? 'ईमेल सत्यापन कोड (OTP)' : 'Verify Email Code')}
            </h1>
            <p className="text-xs sm:text-sm text-stone-700 font-semibold mt-0.5">
              {step === 'FORM'
                ? (lang === 'hi'
                    ? 'अपनी सही भूमिका का चयन करें ताकि आपको सही काम व सहायता मिल सके।'
                    : 'Select your primary role to receive tailored resolution tools and services.')
                : (lang === 'hi'
                    ? `सत्यापन कोड भेजा गया: ${maskedEmail}`
                    : `Verification code sent to: ${maskedEmail}`)}
            </p>
          </div>

          {errorMsg && (
            <div
              id="register-error"
              role="alert"
              aria-live="assertive"
              className="p-3.5 bg-red-100/90 text-red-900 text-xs sm:text-sm rounded-2xl border border-red-300 flex items-center space-x-2.5 font-bold animate-fadeIn backdrop-blur-sm"
            >
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              id="register-status"
              role="status"
              aria-live="polite"
              className="p-3.5 bg-emerald-100/90 text-emerald-950 text-xs sm:text-sm rounded-2xl border border-emerald-300 flex items-center space-x-2.5 font-bold animate-fadeIn backdrop-blur-sm"
            >
              <Check className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ==========================================================
              STEP 1: DETAILS & ROLE SELECTION FORM
              ========================================================== */}
          {step === 'FORM' && (
            <form onSubmit={handleRequestOtp} className="space-y-6 text-xs sm:text-sm">
              {/* 1. User Role Selector Grid */}
              <fieldset>
                <legend className="font-black text-stone-900 block mb-2 text-sm">
                  1. {lang === 'hi' ? 'अपनी प्राथमिक भूमिका चुनें (Select Your Role):' : 'Select Your Role:'}
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {USER_ROLES.map((r) => {
                    const isSelected = selectedRole === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setSelectedRole(r.id)}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            setSelectedRole(r.id);
                          }
                        }}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all backdrop-blur-xs ${
                          isSelected
                            ? 'border-pine-700 bg-pine-100/95 shadow-md ring-2 ring-pine-500/20'
                            : 'border-stone-400/60 hover:border-stone-500 bg-white/60 hover:bg-white/80'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2.5">
                            <span className="text-2xl">{r.icon}</span>
                            <div>
                              <div className="font-black text-stone-950 text-xs sm:text-sm">
                                {lang === 'hi' ? r.title : r.titleEn}
                              </div>
                              <div className="text-[11px] text-stone-700 font-semibold line-clamp-1">
                                {lang === 'hi' ? r.desc : r.descEn}
                              </div>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                            isSelected ? 'border-pine-700 bg-pine-700' : 'border-stone-400'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </fieldset>

              {/* 2. Personal Details Form */}
              <div className="space-y-4">
                <div className="font-black text-stone-900 block text-sm border-t border-stone-300/80 pt-4">
                  2. {lang === 'hi' ? 'व्यक्तिगत जानकारी (Personal Information):' : 'Personal Information:'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="register-full-name" className="font-black text-stone-900 block mb-1">
                      {lang === 'hi' ? 'पूरा नाम (Full Name):' : 'Full Name:'}
                    </label>
                    <input
                      id="register-full-name"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Balram Singh"
                      required
                      className="w-full p-3 bg-white/60 focus:bg-white/95 rounded-xl border border-stone-400/70 focus:outline-none focus:ring-2 focus:ring-pine-500 font-bold text-stone-950 backdrop-blur-xs placeholder:text-stone-500 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="register-email" className="font-black text-stone-900 block mb-1">
                      {lang === 'hi' ? 'ईमेल पता (Email Address):' : 'Email Address (for OTP):'}
                    </label>
                    <div className="relative">
                      <input
                        id="register-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. balram@mandi.org"
                        required
                        className="w-full p-3 pl-10 bg-white/60 focus:bg-white/95 rounded-xl border border-stone-400/70 focus:outline-none focus:ring-2 focus:ring-pine-500 font-bold text-stone-950 backdrop-blur-xs placeholder:text-stone-500 transition"
                      />
                      <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="register-phone" className="font-black text-stone-900 block mb-1">
                    {lang === 'hi' ? 'मोबाइल नंबर (Phone Number):' : 'Phone Number:'}
                  </label>
                  <input
                    id="register-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    required
                    className="w-full p-3 bg-white/60 focus:bg-white/95 rounded-xl border border-stone-400/70 focus:outline-none focus:ring-2 focus:ring-pine-500 font-bold text-stone-950 backdrop-blur-xs placeholder:text-stone-500 transition"
                  />
                </div>

                {/* Location Detection & Manual Selector */}
                <div className="bg-white/80 p-4 rounded-2xl border border-stone-300 backdrop-blur-xs shadow-xs">
                  <LocationPicker
                    state={state}
                    setState={setState}
                    district={district}
                    setDistrict={setDistrict}
                    village={village}
                    setVillage={setVillage}
                    pincode={pincode}
                    setPincode={setPincode}
                    latitude={latitude}
                    setLatitude={setLatitude}
                    longitude={longitude}
                    setLongitude={setLongitude}
                    lang={lang}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="register-password" className="font-black text-stone-900 block mb-1">
                      {lang === 'hi' ? 'पासवर्ड (Password):' : 'Password:'}
                    </label>
                    <div className="relative">
                      <input
                        id="register-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        required
                        className="w-full p-3 bg-white/60 focus:bg-white/95 rounded-xl border border-stone-400/70 focus:outline-none focus:ring-2 focus:ring-pine-500 font-bold text-stone-950 pr-10 backdrop-blur-xs placeholder:text-stone-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-900 p-1"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="register-confirm-password" className="font-black text-stone-900 block mb-1">
                      {lang === 'hi' ? 'पासवर्ड पुष्टि (Confirm Password):' : 'Confirm Password:'}
                    </label>
                    <div className="relative">
                      <input
                        id="register-confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        required
                        className="w-full p-3 bg-white/60 focus:bg-white/95 rounded-xl border border-stone-400/70 focus:outline-none focus:ring-2 focus:ring-pine-500 font-bold text-stone-950 pr-10 backdrop-blur-xs placeholder:text-stone-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-900 p-1"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit / Send OTP Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 via-pine-700 to-pine-800 hover:from-emerald-700 hover:to-pine-900 text-white font-black py-4 rounded-2xl shadow-xl transition transform active:scale-98 flex items-center justify-center space-x-2 text-sm sm:text-base border border-emerald-400 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{lang === 'hi' ? 'सत्यापन कोड भेजा जा रहा है...' : 'Sending Verification Code...'}</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>{lang === 'hi' ? 'SEND REGISTRATION OTP' : 'SEND REGISTRATION OTP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ==========================================================
              STEP 2: 6-DIGIT EMAILJS OTP VERIFICATION SCREEN
              ========================================================== */}
          {step === 'VERIFY' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 text-xs sm:text-sm animate-fadeIn">
              
              {/* Masked Destination & Back Button */}
              <div className="p-4 bg-emerald-50/90 rounded-2xl border border-emerald-300 flex items-center justify-between shadow-xs">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse" />
                  <div>
                    <span className="text-[11px] text-emerald-900 font-bold block">
                      {lang === 'hi' ? 'ईमेल पर कोड भेजा गया:' : 'Verification code sent to:'}
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-black text-stone-900">{maskedEmail}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('FORM');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs font-bold text-pine-800 hover:text-pine-950 underline px-2 py-1 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition"
                >
                  {lang === 'hi' ? 'विवरण बदलें (Edit)' : 'Edit Details'}
                </button>
              </div>

              {/* 6-Digit Numeric Input Boxes */}
              <fieldset aria-describedby={errorMsg ? 'register-error' : (successMsg ? 'register-status' : undefined)}>
                <legend className="font-black text-stone-900 block mb-3 text-center text-sm sm:text-base w-full">
                  {lang === 'hi' ? '6-अंकों का सत्यापन कोड दर्ज करें:' : 'Enter 6-Digit Verification Code:'}
                </legend>
                <div className="flex justify-center space-x-2 sm:space-x-3" onPaste={handleDigitPaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (digitInputRefs.current[idx] = el)}
                      id={`reg-otp-digit-${idx + 1}`}
                      name={`reg-otp-digit-${idx + 1}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      autoComplete="one-time-code"
                      aria-label={`Verification code digit ${idx + 1}`}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                      className="w-11 h-14 sm:w-14 sm:h-16 text-center font-mono font-black text-xl sm:text-3xl bg-white border-2 border-stone-400 focus:border-emerald-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition shadow-sm text-stone-950"
                    />
                  ))}
                </div>
              </fieldset>

              {/* Resend Timer and Validity */}
              <div className="flex items-center justify-between text-xs font-bold text-stone-600 pt-2">
                <span>
                  {countdown > 0 ? (
                    <span className="text-stone-500">
                      {lang === 'hi' ? `पुनः भेजें ${countdown} सेकंड में` : `Resend code in ${countdown}s`}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRequestOtp()}
                      disabled={loading}
                      className="text-pine-800 hover:text-pine-950 font-black underline flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'कोड पुनः भेजें (Resend Code)' : 'Resend Code'}</span>
                    </button>
                  )}
                </span>
                <span className="text-[11px] text-stone-500 font-medium">
                  {lang === 'hi' ? '⏱️ 5 मिनट के लिए मान्य' : '⏱️ Valid for 5 minutes'}
                </span>
              </div>

              {/* Verify & Create Account Button */}
              <button
                type="submit"
                disabled={loading || otpDigits.join('').length !== 6}
                className="w-full bg-gradient-to-r from-emerald-600 via-pine-700 to-pine-800 hover:from-emerald-700 hover:to-pine-900 text-white font-black py-4 rounded-2xl shadow-xl transition transform active:scale-98 flex items-center justify-center space-x-2 text-sm sm:text-base border border-emerald-400 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{lang === 'hi' ? 'सत्यापन व खाता निर्माण हो रहा है...' : 'Verifying & Creating Account...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    <span>{lang === 'hi' ? 'VERIFY & CREATE ACCOUNT' : 'VERIFY & CREATE ACCOUNT'}</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center text-xs text-stone-800 font-bold pt-2 border-t border-stone-300/80">
            <span>{lang === 'hi' ? 'पहले से खाता है?' : 'Already have an account?'} </span>
            <Link to="/user/login" className="font-black text-pine-900 hover:underline">
              {lang === 'hi' ? 'यहाँ लॉगिन करें (Sign In)' : 'Sign In Here'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
