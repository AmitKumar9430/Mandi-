import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../auth/AdminAuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Mail,
  KeyRound,
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff,
  Activity,
  Globe,
  Server,
  Terminal,
  UserCheck
} from 'lucide-react';

export default function AdminLogin() {
  const { requestAdminOtp, verifyAdminOtp, loginAdmin } = useAdminAuth();
  const { lang, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  // Login Mode: 'OTP' vs 'PASSWORD'
  const [authMode, setAuthMode] = useState('OTP');

  // OTP Flow States: 'INPUT' vs 'VERIFY'
  const [otpStep, setOtpStep] = useState('INPUT');
  const [identifier, setIdentifier] = useState('amitkr9523da@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [otpRequestId, setOtpRequestId] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 60-second Resend countdown timer
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

  const handleRequestAdminOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMsg(
        lang === 'hi'
          ? 'कृपया व्यवस्थापक ईमेल या मोबाइल नंबर दर्ज करें।'
          : 'Please enter Administrator Email or Mobile.'
      );
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const data = await requestAdminOtp(cleanId);
      setOtpRequestId(data.otpRequestId || '');
      setMaskedPhone(data.maskedPhone || cleanId);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpStep('VERIFY');
      setCountdown(60);

      setSuccessMsg(
        lang === 'hi'
          ? `व्यवस्थापक सत्यापन कोड (OTP) आपके ईमेल/मोबाइल पर भेज दिया गया है।`
          : `Verification OTP dispatched to authorized administrator email/mobile.`
      );

      setTimeout(() => {
        if (digitInputRefs.current[0]) {
          digitInputRefs.current[0].focus();
        }
      }, 100);
    } catch (err) {
      setErrorMsg(err.message || 'Access Denied: Unrecognized administrator account.');
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

  const handleVerifyAdminOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setErrorMsg(
        lang === 'hi'
          ? 'कृपया 6-अंकों का व्यवस्थापक OTP कोड दर्ज करें।'
          : 'Please enter the 6-digit admin OTP code.'
      );
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      await verifyAdminOtp(otpRequestId, fullOtp);
      navigate('/admin/dashboard');
    } catch (err) {
      setErrorMsg(
        err.message ||
          (lang === 'hi' ? 'अमान्य OTP अथवा अनधिकृत व्यवस्थापक।' : 'Invalid OTP or Unauthorized Administrator.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMsg(lang === 'hi' ? 'ईमेल या मोबाइल दर्ज करें।' : 'Please enter Email or Mobile.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg(lang === 'hi' ? 'पासवर्ड दर्ज करें।' : 'Please enter Password.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await loginAdmin(cleanId, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Access Denied: Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  const autofillDemoCredentials = (type) => {
    if (type === 'SUPER_ADMIN') {
      setIdentifier('amitkr9523da@gmail.com');
      setPassword('Admin@123');
      setErrorMsg('');
      setSuccessMsg(
        lang === 'hi'
          ? '👑 सुपर एडमिन क्रेडेंशियल्स भरे गए (EmailJS OTP या पासवर्ड का उपयोग करें)'
          : '👑 Super Admin credentials filled (Use EmailJS OTP or Password)'
      );
    } else if (type === 'ADMIN_PHONE') {
      setIdentifier('9876543217');
      setPassword('Password@123');
      setErrorMsg('');
      setSuccessMsg(
        lang === 'hi'
          ? '🛡️ एडमिन (फोन) क्रेडेंशियल्स भरे गए'
          : '🛡️ Admin (Phone) credentials filled'
      );
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative bg-rural-hero">
      
      {/* Top Floating Governance Status & Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        {/* System Status Pill */}
        <div className="hidden sm:flex items-center space-x-2 bg-stone-900/85 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-xs font-bold shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Root Vault 256-Bit</span>
        </div>

        {/* Return to Citizen Portal */}
        <Link
          to="/user/login"
          className="flex items-center space-x-1.5 bg-emerald-950/85 hover:bg-emerald-900 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-500/50 text-xs font-bold shadow-lg backdrop-blur-md transition"
        >
          <span>🌾 {lang === 'hi' ? 'नागरिक पोर्टल' : 'User Portal'}</span>
        </Link>

        {/* Language Toggle */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="flex items-center space-x-1.5 bg-stone-900/85 hover:bg-stone-900 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-xs font-bold shadow-lg backdrop-blur-md transition"
          aria-label={lang === 'hi' ? 'Switch language to English' : 'भाषा हिन्दी में बदलें'}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'English' : 'हिन्दी'}</span>
        </button>
      </div>

      {/* Main Glassmorphic 2-Column Administrative Card */}
      <div className="max-w-4xl w-full bg-stone-900/80 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-500/30 overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10">
        
        {/* Left Side: Governance & Security Showcase Banner */}
        <div className="relative hidden md:flex flex-col justify-between p-8 bg-pine-950/75 text-white overflow-hidden backdrop-blur-xs border-r border-emerald-500/20">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
            style={{ backgroundImage: "url('/rural_village_landscape.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-pine-950/70 to-transparent" />

          {/* Top Branding & Emblem */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-pine-700 flex items-center justify-center text-stone-950 font-black text-2xl shadow-lg border-2 border-emerald-300">
                म
              </div>
              <div className="p-2 bg-emerald-950/60 rounded-xl border border-emerald-500/30">
                <ShieldAlert className="w-6 h-6 text-emerald-400" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
                <span>{lang === 'hi' ? 'प्रशासनिक वॉल्ट' : 'Admin Command Vault'}</span>
              </h2>
              <span className="text-emerald-400 font-mono text-xs font-bold tracking-wider">
                MANDI GOVERNANCE & CONTROL
              </span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed font-medium">
              {lang === 'hi'
                ? '"सुरक्षित प्रशासनिक नियंत्रण, गाँव-स्तरीय नीति समन्वय एवं आपातकालीन समाधान निगरानी।"'
                : '"Secure system administration, village policy coordination & emergency triage oversight."'}
            </p>
          </div>

          {/* Key Administration Features */}
          <div className="relative z-10 space-y-3 py-4">
            <div className="flex items-center space-x-2.5 text-xs text-stone-200 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{lang === 'hi' ? '256-बिट सुरक्षित रूट वॉल्ट एवं RBAC प्रमाणीकरण' : '256-bit Encrypted Root Vault & RBAC Access'}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-stone-200 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{lang === 'hi' ? 'नागरिक एवं किसान आपातकालीन समस्या मॉडरेशन' : 'Live Civic & Farmer Emergency Incident Triage'}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-stone-200 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{lang === 'hi' ? 'मंडी पल्स (MANDI Pulse) विश्लेषिकी व ऑडिट लॉग' : 'MANDI Pulse Multi-Village Analytics & Audit Logs'}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-stone-200 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{lang === 'hi' ? 'EmailJS व SMS द्वैध-कारक OTP सत्यापन' : 'EmailJS & SMS Dual-Factor OTP Verification'}</span>
            </div>
          </div>

          {/* Bottom Trust & Switcher */}
          <div className="relative z-10 pt-4 border-t border-emerald-500/20 text-[11px] text-stone-300 flex items-center justify-between font-semibold">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>GovEngine v2.4 Operational</span>
            </span>
            <span className="text-stone-400">TLS 1.3 Certified</span>
          </div>
        </div>

        {/* Right Side: Interactive Admin Access Console */}
        <div className="p-6 sm:p-10 flex flex-col justify-center space-y-5 bg-stone-950/60 md:bg-stone-950/45 backdrop-blur-xs">
          
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-pine-800 text-white flex items-center justify-center shadow-lg border border-emerald-400/40">
                  <ShieldAlert className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {otpStep === 'INPUT'
                      ? (lang === 'hi' ? 'प्रशासक लॉगिन' : 'Admin Login')
                      : (lang === 'hi' ? 'व्यवस्थापक OTP सत्यापन' : 'Verify Admin OTP')}
                  </h1>
                  <p className="text-xs text-emerald-400 font-semibold font-mono">
                    ROOT GOVERNANCE CONSOLE
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-stone-400 font-medium pt-1">
              {authMode === 'OTP'
                ? (otpStep === 'INPUT'
                    ? (lang === 'hi' ? 'अधिकृत ईमेल या मोबाइल पर सुरक्षित 6-अंकीय OTP प्राप्त करें।' : 'Enter authorized email or mobile to receive secure 6-digit OTP.')
                    : (lang === 'hi' ? `सत्यापन कोड भेजा गया: ${maskedPhone}` : `OTP dispatched to: ${maskedPhone}`))
                : (lang === 'hi' ? 'व्यवस्थापक खाते के पासवर्ड द्वारा लॉगिन करें।' : 'Sign in using authorized administrator password.')}
            </p>
          </div>

          {/* Authentication Mode Switcher Tabs */}
          {otpStep === 'INPUT' && (
            <div className="grid grid-cols-2 p-1 bg-stone-900/90 rounded-2xl border border-stone-700 text-xs font-black shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('OTP');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition ${
                  authMode === 'OTP'
                    ? 'bg-gradient-to-r from-emerald-600 to-pine-700 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? '📱 OTP सत्यापन' : '📱 OTP Login'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('PASSWORD');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition ${
                  authMode === 'PASSWORD'
                    ? 'bg-gradient-to-r from-emerald-600 to-pine-700 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? '🔑 पासवर्ड लॉगिन' : '🔑 Password'}</span>
              </button>
            </div>
          )}

          {/* Alert Messages */}
          {errorMsg && (
            <div
              id="admin-login-error"
              role="alert"
              aria-live="assertive"
              className="p-3 bg-red-950/85 border border-red-500/50 text-red-300 rounded-xl text-xs flex items-center space-x-2 font-semibold animate-fadeIn"
            >
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              id="admin-login-status"
              role="status"
              aria-live="polite"
              className="p-3 bg-emerald-950/85 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs flex items-center space-x-2 font-semibold animate-fadeIn"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* AUTH MODE 1: OTP FLOW */}
          {authMode === 'OTP' && (
            <>
              {otpStep === 'INPUT' ? (
                <form onSubmit={handleRequestAdminOtp} className="space-y-4 text-xs">
                  <div>
                    <label htmlFor="admin-login-identifier" className="font-bold text-stone-200 block mb-1">
                      {lang === 'hi' ? 'व्यवस्थापक ईमेल या मोबाइल नंबर:' : 'Admin Email or Mobile Number:'}
                    </label>
                    <input
                      id="admin-login-identifier"
                      name="identifier"
                      type="text"
                      autoComplete="username"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. amitkr9523da@gmail.com or 9876543217"
                      required
                      autoFocus
                      className="w-full p-3 bg-stone-900/90 rounded-xl border border-stone-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs transition placeholder-stone-500"
                    />
                    <p className="text-[10px] text-stone-400 mt-1.5 font-medium flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      <span>
                        {lang === 'hi'
                          ? 'सुरक्षित 6-अंकीय सत्यापन कोड ईमेल/फोन पर प्रेषित किया जाएगा।'
                          : 'Secure 6-digit OTP will be dispatched to registered admin inbox.'}
                      </span>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-600 via-pine-700 to-pine-800 hover:from-emerald-700 hover:to-pine-900 text-white font-black py-3.5 rounded-2xl shadow-xl transition transform active:scale-98 flex items-center justify-center space-x-2 text-xs sm:text-sm disabled:opacity-50 border border-emerald-400/40"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{lang === 'hi' ? 'OTP भेजा जा रहा है...' : 'Sending Admin OTP...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{lang === 'hi' ? 'सत्यापन OTP भेजें' : 'SEND ADMIN OTP'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* STEP 2: VERIFY ADMIN 6-DIGIT OTP */
                <form onSubmit={handleVerifyAdminOtp} className="space-y-4 text-xs animate-fadeIn">
                  {/* Masked Destination Badge */}
                  <div className="p-3 bg-emerald-950/80 rounded-2xl border border-emerald-500/50 flex items-center justify-between shadow-xs">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <div>
                        <span className="text-[10px] text-emerald-300 font-bold block uppercase tracking-wider">
                          {lang === 'hi' ? 'OTP भेजा गया:' : 'OTP Sent To:'}
                        </span>
                        <span className="text-xs font-mono font-black text-white">{maskedPhone}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep('INPUT');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-xs font-bold text-emerald-400 hover:underline px-2 py-0.5"
                      aria-label={lang === 'hi' ? 'पहचान बदलें' : 'Change Identifier'}
                    >
                      {lang === 'hi' ? 'बदलें' : 'Change'}
                    </button>
                  </div>

                  {/* 6-Digit Numeric Inputs */}
                  <fieldset aria-describedby={errorMsg ? 'admin-login-error' : (successMsg ? 'admin-login-status' : undefined)}>
                    <legend className="font-bold text-stone-200 block mb-2 text-center text-xs w-full">
                      {lang === 'hi' ? '6-अंकों का व्यवस्थापक OTP दर्ज करें:' : 'Enter 6-Digit Admin OTP:'}
                    </legend>
                    <div className="flex justify-center space-x-2" onPaste={handleDigitPaste}>
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (digitInputRefs.current[idx] = el)}
                          id={`admin-otp-digit-${idx + 1}`}
                          name={`otp-digit-${idx + 1}`}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          autoComplete="one-time-code"
                          aria-label={`Admin OTP digit ${idx + 1}`}
                          value={digit}
                          onChange={(e) => handleDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                          className="w-10 h-12 text-center font-mono font-black text-xl bg-stone-900 border-2 border-emerald-500/60 focus:border-emerald-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition shadow-inner text-emerald-300"
                        />
                      ))}
                    </div>
                  </fieldset>

                  {/* Resend Cooldown */}
                  <div className="flex items-center justify-between text-xs font-bold text-stone-400 pt-1">
                    <span>
                      {countdown > 0 ? (
                        <span className="text-stone-500">
                          {lang === 'hi' ? `पुनः भेजें ${countdown}s` : `Resend OTP in ${countdown}s`}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRequestAdminOtp()}
                          disabled={loading}
                          className="text-emerald-400 hover:text-emerald-300 underline flex items-center space-x-1"
                          aria-label="Resend Admin OTP"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>{lang === 'hi' ? 'OTP पुनः भेजें' : 'Resend OTP'}</span>
                        </button>
                      )}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {lang === 'hi' ? '5 मिनट वैधता' : '5 min validity'}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpDigits.join('').length !== 6}
                    className="w-full bg-gradient-to-r from-emerald-600 via-pine-700 to-pine-800 hover:from-emerald-700 hover:to-pine-900 text-white font-black py-3.5 rounded-2xl shadow-xl transition transform active:scale-98 flex items-center justify-center space-x-2 text-xs sm:text-sm disabled:opacity-50 border border-emerald-400/40"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{lang === 'hi' ? 'सत्यापन हो रहा है...' : 'Verifying Root Access...'}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>{lang === 'hi' ? 'सत्यापित करें एवं प्रवेश करें' : 'VERIFY & ENTER VAULT'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {/* AUTH MODE 2: PASSWORD LOGIN */}
          {authMode === 'PASSWORD' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
              <div>
                <label htmlFor="admin-pass-identifier" className="font-bold text-stone-200 block mb-1">
                  {lang === 'hi' ? 'व्यवस्थापक ईमेल या मोबाइल:' : 'Admin Email or Mobile:'}
                </label>
                <input
                  id="admin-pass-identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. amitkr9523da@gmail.com or 9876543217"
                  required
                  className="w-full p-3 bg-stone-900/90 rounded-xl border border-stone-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs transition placeholder-stone-500"
                />
              </div>

              <div>
                <label htmlFor="admin-pass-input" className="font-bold text-stone-200 block mb-1">
                  {lang === 'hi' ? 'व्यवस्थापक पासवर्ड:' : 'Admin Password:'}
                </label>
                <div className="relative">
                  <input
                    id="admin-pass-input"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full p-3 pr-10 bg-stone-900/90 rounded-xl border border-stone-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs transition placeholder-stone-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 via-pine-700 to-pine-800 hover:from-emerald-700 hover:to-pine-900 text-white font-black py-3.5 rounded-2xl shadow-xl transition transform active:scale-98 flex items-center justify-center space-x-2 text-xs sm:text-sm disabled:opacity-50 border border-emerald-400/40"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{lang === 'hi' ? 'प्रवेश हो रहा है...' : 'Authenticating...'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'पासवर्ड से लॉगिन करें' : 'SIGN IN WITH PASSWORD'}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Credentials Autofill Pill Bar */}
          {otpStep === 'INPUT' && (
            <div className="pt-2 border-t border-stone-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-stone-400 font-semibold">
                <span className="flex items-center space-x-1">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'hi' ? 'त्वरित डेमो क्रेडेंशियल्स:' : 'Quick Demo Admin Autofill:'}</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => autofillDemoCredentials('SUPER_ADMIN')}
                  className="px-2.5 py-1.5 bg-stone-900/80 hover:bg-stone-800 text-emerald-300 border border-emerald-500/30 rounded-xl text-[11px] font-bold text-left transition truncate shadow-xs flex items-center space-x-1"
                  title="amitkr9523da@gmail.com / Admin@123"
                >
                  <span>👑</span>
                  <span className="truncate">Super Admin (Email)</span>
                </button>
                <button
                  type="button"
                  onClick={() => autofillDemoCredentials('ADMIN_PHONE')}
                  className="px-2.5 py-1.5 bg-stone-900/80 hover:bg-stone-800 text-emerald-300 border border-emerald-500/30 rounded-xl text-[11px] font-bold text-left transition truncate shadow-xs flex items-center space-x-1"
                  title="9876543217 / Password@123"
                >
                  <span>🛡️</span>
                  <span className="truncate">Admin (Phone)</span>
                </button>
              </div>
            </div>
          )}

          {/* Footer Portal Switcher */}
          <div className="pt-2 border-t border-stone-800 text-center space-y-1.5">
            <p className="text-stone-400 text-xs">
              {lang === 'hi' ? 'नागरिक या किसान सहायता के लिए यहाँ जाएं:' : 'Looking for citizen problem reporting or kisan desk?'}
            </p>
            <Link
              to="/user/login"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 rounded-xl font-bold border border-emerald-700/60 text-xs transition shadow"
            >
              <span>🌾 {lang === 'hi' ? 'नागरिक एवं किसान पोर्टल पर जाएं →' : 'Go to Citizen & Farmer Portal →'}</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
