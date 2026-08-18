import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LogIn,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  Sprout,
  Users,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redirectTarget = searchParams.get('redirect') || 'dashboard';
  const prefilledText = searchParams.get('text');

  const handleLogin = async (e) => {
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
      await login(identifier.trim(), password);
      if (redirectTarget === 'submit' && prefilledText) {
        navigate('/submit?text=' + encodeURIComponent(prefilledText));
      } else {
        navigate('/' + redirectTarget);
      }
    } catch (err) {
      setErrorMsg(
        err.message?.includes('Bad credentials')
          ? (lang === 'hi' ? 'गलत मोबाइल नंबर या पासवर्ड। कृपया पुनः प्रयास करें।' : 'Invalid phone number or password. Please try again.')
          : (err.message || 'Login failed. Please check your credentials.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl border-2 border-stone-200 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Rural Friendly Banner */}
        <div className="relative hidden md:flex flex-col justify-between p-8 bg-pine-950 text-white overflow-hidden">
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

          {/* Value Highlights */}
          <div className="relative z-10 space-y-3 py-6">
            <div className="flex items-center space-x-2.5 text-xs text-stone-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>100% निःशुल्क जन-समस्या समाधान मंच</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-stone-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>किसान, कारीगर व ग्रामीणों का डिजिटल साथी</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-stone-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>सत्यापित मददगार व सरकारी योजना समन्वय</span>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-pine-800/80 text-[11px] text-stone-400 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>सुरक्षित व सत्यापित पोर्टल</span>
            </span>
            <span>24/7 हेल्पलाइन</span>
          </div>
        </div>

        {/* Right Side: Clean Login Form */}
        <div className="p-6 sm:p-10 flex flex-col justify-center space-y-6">
          <div className="space-y-1">
            <div className="md:hidden w-12 h-12 rounded-2xl bg-pine-700 text-white flex items-center justify-center font-black text-xl mb-3 shadow">
              म
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              {lang === 'hi' ? 'मंडी में प्रवेश करें' : 'Welcome to MANDI'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              {lang === 'hi' ? 'समस्या समाधान व सेवाओं के लिए लॉगिन करें' : 'Sign in to access your Problem Passports & services'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 text-red-800 text-xs sm:text-sm rounded-2xl border border-red-200 flex items-center space-x-2.5 font-bold animate-fadeIn">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="font-bold text-stone-800 block mb-1">
                {lang === 'hi' ? 'मोबाइल नंबर / ईमेल (Phone or Email):' : 'Phone Number or Email:'}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. 9876543210 or email@domain.com"
                required
                autoFocus
                className="w-full p-3.5 bg-stone-50 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-pine-500 font-semibold text-stone-900 text-sm"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                {lang === 'hi' ? 'पासवर्ड (Password):' : 'Password:'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full p-3.5 bg-stone-50 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-pine-500 font-semibold text-stone-900 pr-11 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pine-700 hover:bg-pine-800 text-white font-black py-3.5 rounded-2xl shadow-xl transition transform active:scale-98 flex items-center justify-center space-x-2 text-sm sm:text-base border border-emerald-400 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>प्रवेश हो रहा है...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>{lang === 'hi' ? 'लॉगिन करें (Sign In)' : 'Sign In'}</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-stone-200 text-center space-y-2">
            <p className="text-xs text-stone-600 font-medium">
              {lang === 'hi' ? 'मंडी पर नया खाता बनाना चाहते हैं?' : "Don't have an account yet?"}{' '}
              <Link to="/register" className="font-black text-pine-700 hover:underline">
                {lang === 'hi' ? 'नया पंजीकरण करें (Register Here)' : 'Register Here'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
