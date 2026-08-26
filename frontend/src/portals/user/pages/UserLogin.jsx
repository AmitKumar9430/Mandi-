import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useUserAuth } from '../../../auth/UserAuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import MobileAccessModal from '../../../components/MobileAccessModal';
import {
  LogIn,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Smartphone,
  KeyRound,
  RotateCcw,
  ArrowRight,
  Check
} from 'lucide-react';

export default function UserLogin() {
  const { user, requestOtp, verifyOtp, login } = useUserAuth();
  const { lang, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectTarget = searchParams.get('redirect') || '/user/dashboard';
  const prefilledText = searchParams.get('text');

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(redirectTarget, { replace: true });
    }
  }, [user, navigate, redirectTarget]);

  // Login mode: 'OTP' (default & primary) vs 'PASSWORD'
  const [loginMode, setLoginMode] = useState('OTP');

  // OTP Step: 'INPUT' (enter mobile/email) vs 'VERIFY' (enter 6-digit OTP)
  const [otpStep, setOtpStep] = useState('INPUT');

  const [identifier, setIdentifier] = useState('');
  const [otpRequestId, setOtpRequestId] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(
    searchParams.get('redirect')
      ? (lang === 'hi' ? 'कृपया इस सरकारी पोर्टल में प्रवेश करने के लिए पहले लॉगिन करें।' : 'Please sign in to access the requested portal.')
      : ''
  );
  const [successMsg, setSuccessMsg] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  // 45-second Resend countdown timer
  const [countdown, setCountdown] = useState(0);
  const digitInputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMsg(
        lang === 'hi'
          ? 'कृपया अपना पंजीकृत मोबाइल नंबर या ईमेल दर्ज करें।'
          : 'Please enter your registered mobile number or email.'
      );
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const data = await requestOtp(cleanId);
      setOtpRequestId(data.otpRequestId || '');
      setMaskedPhone(data.maskedPhone || '******0000');
      setOtpDigits(['', '', '', '', '', '']);
      setOtpStep('VERIFY');
      setCountdown(45);

      setSuccessMsg(
        lang === 'hi'
          ? `सत्यापन कोड (OTP) आपके पंजीकृत मोबाइल पर भेज दिया गया है।`
          : `Verification code (OTP) has been dispatched directly to your registered phone.`
      );

      setTimeout(() => {
        if (digitInputRefs.current[0]) {
          digitInputRefs.current[0].focus();
        }
      }, 100);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to request OTP. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setErrorMsg(
        lang === 'hi'
          ? 'कृपया 6 अंकों का सही OTP कोड दर्ज करें।'
          : 'Please enter the complete 6-digit OTP code.'
      );
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const userData = await verifyOtp(otpRequestId, fullOtp);
      handleSuccessfulLogin(userData);
    } catch (err) {
      setErrorMsg(
        err.message ||
          (lang === 'hi' ? 'अमान्य या समाप्त OTP। कृपया पुनः प्रयास करें।' : 'Invalid or expired OTP.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg(lang === 'hi' ? 'कृपया मोबाइल नंबर या ईमेल दर्ज करें।' : 'Please enter your phone number or email.');
      return;
    }
    if (!password) {
      setErrorMsg(lang === 'hi' ? 'कृपया पासवर्ड दर्ज करें।' : 'Please enter your password.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const userData = await login(identifier.trim(), password);
      handleSuccessfulLogin(userData);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessfulLogin = (userData) => {
    const rawRoles = userData?.roles ? (Array.isArray(userData.roles) ? userData.roles : [userData.roles]) : [];
    const roles = rawRoles.map(r => (typeof r === 'string' ? r : r?.role || r?.name || r?.authority || String(r)));

    if (roles.some((r) => typeof r === 'string' && (r.includes('ADMIN') || r.includes('SUPER_ADMIN') || r.includes('MODERATOR')))) {
      navigate('/admin/dashboard');
      return;
    }

    if (
      redirectTarget &&
      redirectTarget !== '/user/login' &&
      redirectTarget !== '/user/dashboard' &&
      redirectTarget !== '/user' &&
      redirectTarget !== '/'
    ) {
      if (redirectTarget.includes('create') && prefilledText) {
        navigate('/user/problems/create?text=' + encodeURIComponent(prefilledText));
      } else {
        navigate(redirectTarget.startsWith('/') ? redirectTarget : '/user/' + redirectTarget);
      }
      return;
    }

    if (roles.some((r) => typeof r === 'string' && r.includes('FARMER'))) {
      navigate('/user/agriculture');
    } else {
      navigate('/user/dashboard');
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
          aria-label={lang === 'hi' ? 'मोबाइल एक्सेस QR कोड खोलें' : 'Open Mobile QR Code'}
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

      <div className="max-w-4xl w-full bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border border-white/70 overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10">
        
        {/* Left Side: Rural Friendly Banner */}
        <div className="relative hidden md:flex flex-col justify-between p-8 bg-pine-950/70 text-white overflow-hidden backdrop-blur-xs border-r border-white/20">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
            style={{ backgroundImage: "url('/rural_village_landscape.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pine-950/85 via-pine-900/45 to-transparent" />

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

          {/* Value Highlights */}
          <div className="relative z-10 space-y-3 py-6">
            <div className="flex items-center space-x-2.5 text-xs text-stone-100 font-semibold drop-shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{lang === 'hi' ? '100% सुरक्षित एवं गोपनीय OTP प्रमाणीकरण' : 'Confidential OTP Dispatched to Phone'}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-stone-100 font-semibold drop-shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{lang === 'hi' ? 'सीधे पंजीकृत मोबाइल SIM पर प्रेषण' : 'Direct Mobile SIM Transmission'}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-stone-100 font-semibold drop-shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{lang === 'hi' ? 'सुरक्षित 6-अंकों का सत्र' : 'End-to-End Encrypted Session'}</span>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-white/20 text-[11px] text-stone-200 font-semibold flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'hi' ? 'नागरिक एवं किसान पोर्टल' : 'Citizen & Farmer Portal'}</span>
            </span>
            <span>{lang === 'hi' ? '24/7 सुरक्षित वॉल्ट' : '24/7 Secure Access'}</span>
          </div>
        </div>

        {/* Right Side: Dynamic OTP Verification Form */}
        <div className="p-6 sm:p-10 flex flex-col justify-center space-y-5 bg-white/50 md:bg-white/35 backdrop-blur-xs">
          
          {/* Header */}
          <div className="space-y-1">
            <div className="md:hidden w-12 h-12 rounded-2xl bg-pine-700 text-white flex items-center justify-center font-black text-xl mb-2 shadow">
              म
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-black text-stone-950 drop-shadow-xs">
                {otpStep === 'INPUT'
                  ? (lang === 'hi' ? 'मंडी में प्रवेश करें' : 'User Login')
                  : (lang === 'hi' ? 'सत्यापन कोड (OTP)' : 'VERIFY OTP')}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 font-semibold">
              {loginMode === 'OTP'
                ? (otpStep === 'INPUT'
                    ? (lang === 'hi' ? 'मोबाइल नंबर या ईमेल पर OTP प्राप्त कर सुरक्षित लॉगिन करें' : 'Enter registered email or mobile to receive OTP')
                    : (lang === 'hi' ? `OTP भेजा गया: ${maskedPhone}` : `OTP sent to: ${maskedPhone}`))
                : (lang === 'hi' ? 'पासवर्ड द्वारा अपने खाते में प्रवेश करें' : 'Sign in using your account password')}
            </p>
          </div>

          {/* Method Switch Pills */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-stone-200/80 rounded-2xl border border-stone-300 shadow-inner text-xs font-black">
            <button
              type="button"
              onClick={() => {
                setLoginMode('OTP');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition ${
                loginMode === 'OTP'
                  ? 'bg-pine-800 text-white shadow-md'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? '📱 OTP सत्यापन' : '📱 OTP Login'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMode('PASSWORD');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition ${
                loginMode === 'PASSWORD'
                  ? 'bg-pine-800 text-white shadow-md'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? '🔑 पासवर्ड लॉगिन' : '🔑 Password'}</span>
            </button>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div
              id="user-login-error"
              role="alert"
              aria-live="assertive"
              className="p-3 bg-red-100/90 text-red-900 text-xs rounded-2xl border border-red-300 flex items-center space-x-2 font-bold animate-fadeIn backdrop-blur-sm"
            >
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              id="user-login-status"
              role="status"
              aria-live="polite"
              className="p-3 bg-emerald-100/90 text-emerald-950 text-xs rounded-2xl border border-emerald-300 flex items-center space-x-2 font-bold animate-fadeIn backdrop-blur-sm"
            >
              <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE 1: SECURE OTP AUTHENTICATION */}
          {loginMode === 'OTP' && (
            <>
              {/* STEP 1: ENTER EMAIL OR MOBILE */}
              {otpStep === 'INPUT' ? (
                <form onSubmit={handleSendOtp} className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <label htmlFor="user-login-identifier" className="font-black text-stone-900 block mb-1">
                      {lang === 'hi' ? 'ईमेल या मोबाइल नंबर (Email or Mobile):' : 'Email or Mobile Number:'}
                    </label>
                    <div className="relative">
                      <input
                        id="user-login-identifier"
                        name="identifier"
                        type="text"
                        autoComplete="username"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g. 9876543210 or citizen@mandi.org"
                        required
                        autoFocus
                        className="w-full p-3.5 pl-11 bg-white/70 focus:bg-white rounded-2xl border border-stone-400 focus:outline-none focus:ring-2 focus:ring-pine-500 font-bold text-stone-950 text-sm backdrop-blur-xs placeholder:text-stone-500 transition shadow-xs"
                      />
                      <Smartphone className="w-5 h-5 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1.5 font-medium">
                      {lang === 'hi'
                        ? '🛡️ सुरक्षा नियम: OTP केवल आपके पंजीकृत फोन पर भेजा जाएगा।'
                        : '🛡️ Security Rule: OTP will be sent strictly to your registered phone.'}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-600 via-pine-700 to-pine-800 hover:from-emerald-700 hover:to-pine-900 text-white font-black py-3.5 rounded-2xl shadow-xl transition transform active:scale-98 flex items-center justify-center space-x-2 text-sm sm:text-base border border-emerald-400 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{lang === 'hi' ? 'OTP भेजा जा रहा है...' : 'Sending OTP...'}</span>
                      </>
                    ) : (
                      <>
                        <span>SEND OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* STEP 2: VERIFY 6-DIGIT OTP (NOT SHOWN ON SCREEN) */
                <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs sm:text-sm animate-fadeIn">

                  {/* Masked Destination Badge */}
                  <div className="p-3.5 bg-emerald-50/90 rounded-2xl border border-emerald-300 flex items-center justify-between shadow-xs">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                      <div>
                        <span className="text-[11px] text-emerald-900 font-bold block">
                          {lang === 'hi' ? 'OTP भेजा गया:' : 'OTP sent to:'}
                        </span>
                        <span className="text-xs font-mono font-black text-stone-900">{maskedPhone}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep('INPUT');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-xs font-bold text-pine-800 hover:text-pine-950 underline px-2 py-0.5"
                      aria-label={lang === 'hi' ? 'मोबाइल नंबर अथवा ईमेल बदलें' : 'Change Identifier'}
                    >
                      {lang === 'hi' ? 'Change Identifier' : 'Change Identifier'}
                    </button>
                  </div>

                  {/* 6-Digit Auto-Focus Numeric Inputs inside Fieldset & Legend */}
                  <fieldset aria-describedby={errorMsg ? 'user-login-error' : (successMsg ? 'user-login-status' : undefined)}>
                    <legend className="font-black text-stone-900 block mb-2 text-center text-xs sm:text-sm w-full">
                      {lang === 'hi' ? '6-अंकों का OTP कोड दर्ज करें:' : 'Enter 6-Digit OTP:'}
                    </legend>
                    <div className="flex justify-center space-x-2 sm:space-x-3" onPaste={handleDigitPaste}>
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (digitInputRefs.current[idx] = el)}
                          id={`user-otp-digit-${idx + 1}`}
                          name={`otp-digit-${idx + 1}`}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          autoComplete="one-time-code"
                          aria-label={`OTP digit ${idx + 1}`}
                          value={digit}
                          onChange={(e) => handleDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                          className="w-10 h-12 sm:w-12 sm:h-14 text-center font-mono font-black text-lg sm:text-2xl bg-white border-2 border-stone-400 focus:border-emerald-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition shadow-sm text-stone-950"
                        />
                      ))}
                    </div>
                  </fieldset>

                  {/* Resend Cooldown Timer */}
                  <div className="flex items-center justify-between text-xs font-bold text-stone-600 pt-1">
                    <span>
                      {countdown > 0 ? (
                        <span className="text-stone-500">
                          {lang === 'hi' ? `Resend OTP in ${countdown} seconds` : `Resend OTP in ${countdown} seconds`}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendOtp()}
                          disabled={loading}
                          className="text-pine-800 hover:text-pine-950 font-black underline flex items-center space-x-1"
                          aria-label={lang === 'hi' ? 'OTP पुनः भेजें' : 'Resend OTP'}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{lang === 'hi' ? 'Resend OTP' : 'Resend OTP'}</span>
                        </button>
                      )}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {lang === 'hi' ? '5 मिनट के लिए वैध' : 'Valid for 5 mins'}
                    </span>
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={loading || otpDigits.join('').length !== 6}
                    className="w-full bg-gradient-to-r from-emerald-600 via-pine-700 to-pine-800 hover:from-emerald-700 hover:to-pine-900 text-white font-black py-3.5 rounded-2xl shadow-xl transition transform active:scale-98 flex items-center justify-center space-x-2 text-sm sm:text-base border border-emerald-400 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{lang === 'hi' ? 'सत्यापन हो रहा है...' : 'Verifying...'}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                        <span>{lang === 'hi' ? 'VERIFY' : 'VERIFY'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {/* MODE 2: PASSWORD LOGIN (FALLBACK) */}
          {loginMode === 'PASSWORD' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs sm:text-sm animate-fadeIn">
              <div>
                <label htmlFor="user-password-identifier" className="font-black text-stone-900 block mb-1">
                  {lang === 'hi' ? 'मोबाइल नंबर अथवा ईमेल:' : 'Phone Number or Email:'}
                </label>
                <input
                  id="user-password-identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210 or citizen@mandi.org"
                  required
                  autoFocus
                  className="w-full p-3.5 bg-white/70 focus:bg-white rounded-2xl border border-stone-400 focus:outline-none focus:ring-2 focus:ring-pine-500 font-bold text-stone-950 text-sm backdrop-blur-xs placeholder:text-stone-500 transition shadow-xs"
                />
              </div>

              <div>
                <label htmlFor="user-login-password" className="font-black text-stone-900 block mb-1">
                  {lang === 'hi' ? 'पासवर्ड (Password):' : 'Password:'}
                </label>
                <div className="relative">
                  <input
                    id="user-login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full p-3.5 bg-white/70 focus:bg-white rounded-2xl border border-stone-400 focus:outline-none focus:ring-2 focus:ring-pine-500 font-bold text-stone-950 pr-11 text-sm backdrop-blur-xs placeholder:text-stone-500 transition shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-900 p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pine-800 hover:bg-pine-900 text-white font-black py-3.5 rounded-2xl shadow-xl transition transform active:scale-98 flex items-center justify-center space-x-2 text-sm sm:text-base border border-emerald-400 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{lang === 'hi' ? 'प्रवेश हो रहा है...' : 'Signing In...'}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>{lang === 'hi' ? 'पासवर्ड से लॉगिन करें' : 'Sign In with Password'}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Registration & Admin Portal Links */}
          <div className="pt-3 border-t border-stone-300/80 text-center space-y-2.5">
            <p className="text-xs text-stone-800 font-bold">
              {lang === 'hi' ? "Don't have an account?" : "Don't have an account?"}{' '}
              <Link to="/user/register" className="font-black text-pine-900 hover:underline">
                {lang === 'hi' ? 'Register' : 'Register'}
              </Link>
            </p>

            <div className="pt-1">
              <Link
                to="/admin/login"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-100/90 hover:bg-stone-200 text-stone-900 border border-stone-300 rounded-xl text-xs font-black transition shadow-xs"
              >
                <span>🛡️ {lang === 'hi' ? 'प्रशासक लॉगिन (Administrator Portal)' : 'Administrator Portal'} →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
