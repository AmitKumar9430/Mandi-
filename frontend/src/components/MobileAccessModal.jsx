import React, { useState } from 'react';
import { QrCode, Smartphone, Copy, Check, ExternalLink, X, Wifi, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MobileAccessModal({ isOpen, onClose }) {
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Determine current host or LAN IP
  const currentHost = window.location.hostname;
  const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';
  // If user is on localhost, provide the LAN Wi-Fi IP (192.168.31.160)
  const lanIp = '192.168.31.160';
  const port = window.location.port || '5173';
  const mobileDirectUrl = isLocalhost
    ? `http://${lanIp}:${port}/`
    : `${window.location.protocol}//${currentHost}:${port}/`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    mobileDirectUrl
  )}&margin=10`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mobileDirectUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="max-w-md w-full bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-emerald-500/50 space-y-5 text-white relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {lang === 'hi' ? 'मोबाइल पर खोलें (Mobile Access)' : 'Mobile Phone Direct Access'}
              </h3>
              <p className="text-[11px] text-stone-400">
                {lang === 'hi' ? 'अपने फोन से QR कोड स्कैन करें' : 'Scan QR code or use direct link'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-inner border-2 border-emerald-400">
          <img
            src={qrImageUrl}
            alt="Mobile Access QR Code"
            className="w-52 h-52 object-contain rounded-xl"
            onError={(e) => {
              // Fallback to google chart API if primary has network issue
              e.target.src = `https://chart.googleapis.com/chart?cht=qr&chs=260x260&chl=${encodeURIComponent(
                mobileDirectUrl
              )}`;
            }}
          />
          <span className="text-[11px] font-mono font-bold text-stone-800 mt-2 bg-stone-100 px-3 py-1 rounded-full border border-stone-300">
            📱 {lang === 'hi' ? 'फोन कैमरा से स्कैन करें' : 'Scan with Phone Camera'}
          </span>
        </div>

        {/* Direct Link Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-300 flex items-center justify-between">
            <span>{lang === 'hi' ? 'सीधा मोबाइल लिंक (Direct URL):' : 'Direct Mobile URL:'}</span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
              <Wifi className="w-3 h-3" />
              <span>Same Wi-Fi Network</span>
            </span>
          </label>

          <div className="flex items-center space-x-2 bg-stone-950 p-2.5 rounded-xl border border-stone-700">
            <span className="font-mono text-xs text-amber-300 truncate flex-1 font-bold select-all">
              {mobileDirectUrl}
            </span>
            <button
              onClick={handleCopy}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 flex-shrink-0"
              title="Copy Link"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Easy Guide Instructions */}
        <div className="p-3.5 bg-stone-950/60 rounded-xl border border-stone-800 space-y-1.5 text-xs text-stone-300">
          <div className="font-bold text-emerald-400 flex items-center space-x-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'मोबाइल उपयोग निर्देश:' : 'Quick Connection Instructions:'}</span>
          </div>
          <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-stone-400 leading-relaxed">
            <li>
              {lang === 'hi'
                ? 'अपने मोबाइल को इसी वाई-फाई (Wi-Fi) या हॉटस्पॉट से कनेक्ट करें।'
                : 'Connect your phone to the same Wi-Fi network or hotspot.'}
            </li>
            <li>
              {lang === 'hi'
                ? 'फोन के कैमरा ऐप से ऊपर दिए गए QR कोड को स्कैन करें।'
                : 'Open your phone camera and scan the QR code above.'}
            </li>
            <li>
              {lang === 'hi'
                ? 'या सीधे फोन के ब्राउज़र में लिंक खोलें।'
                : 'Or type the direct URL into Chrome/Safari on your phone.'}
            </li>
          </ol>
        </div>

        <div className="pt-1 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl font-bold text-xs transition"
          >
            {lang === 'hi' ? 'बंद करें (Close)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
