import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  hi: {
    brand_title: 'मंडी सेवा',
    brand_sub: 'कृषि बाज़ार सूचना एवं सेवा पोर्टल',
    disclaimer: 'डेमो / सॅम्पल - यह आधिकारिक सरकारी वेबसाइट नहीं है',
    nav: {
      home: 'मुख्य पृष्ठ',
      mandi_prices: 'मंडी भाव',
      market_directory: 'मंडी निर्देशिका',
      farmers: 'किसान पोर्टल',
      traders: 'व्यापारी पोर्टल',
      auctions: 'ई-नीलामी',
      commodities: 'फसल एवं कृषि उत्पाद',
      transport: 'परिवहन सेवा',
      schemes: 'सरकारी योजनाएं',
      notices: 'सूचना पट्ट',
      reports: 'बाज़ार रिपोर्ट',
      grievance: 'शिकायत निवारण',
      help: 'सहायता केंद्र',
      login: 'लॉग इन',
      register: 'पंजीकरण',
      dashboard: 'डैशबोर्ड'
    }
  },
  en: {
    brand_title: 'MANDI SEWA',
    brand_sub: 'Agricultural Market Information & Services Portal',
    disclaimer: 'Demo / Prototype — Not an Official Government Website',
    nav: {
      home: 'Home',
      mandi_prices: 'Mandi Prices',
      market_directory: 'Market Directory',
      farmers: 'Farmers',
      traders: 'Traders',
      auctions: 'Auctions',
      commodities: 'Commodities',
      transport: 'Transport',
      schemes: 'Schemes & Services',
      notices: 'Notices',
      reports: 'Reports',
      grievance: 'Grievance Portal',
      help: 'Help Desk',
      login: 'Sign In',
      register: 'Register',
      dashboard: 'Dashboard'
    }
  },
  pa: {
    brand_title: 'ਮੰਡੀ ਸੇਵਾ',
    brand_sub: 'ਖੇਤੀਬਾੜੀ ਮੰਡੀ ਜਾਣਕਾਰੀ ਅਤੇ ਸੇਵਾਵਾਂ ਪੋਰਟਲ',
    disclaimer: 'ਡੈਮੋ / ਪ੍ਰੋਟੋਟਾਈਪ - ਇਹ ਅਧਿਕਾਰਤ ਸਰਕਾਰੀ ਵੈੱਬਸਾਈਟ ਨਹੀਂ ਹੈ',
    nav: {
      home: 'ਮੁੱਖ ਪੰਨਾ',
      mandi_prices: 'ਮੰਡੀ ਭਾਅ',
      market_directory: 'ਮੰਡੀ ਡਾਇਰੈਕਟਰੀ',
      farmers: 'ਕਿਸਾਨ ਪੋਰਟਲ',
      traders: 'ਵਪਾਰੀ ਪੋਰਟਲ',
      auctions: 'ਈ-ਨੀਲਾਮੀ',
      commodities: 'ਫਸਲਾਂ',
      transport: 'ਟਰਾਂਸਪੋਰਟ',
      schemes: 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ',
      notices: 'ਨੋਟਿਸ ਬੋਰਡ',
      reports: 'ਰਿਪੋਰਟਾਂ',
      grievance: 'ਸ਼ਿਕਾਇਤ ਨਿਵਾਰਣ',
      help: 'ਮਦਦ',
      login: 'ਲੌਗਇਨ',
      register: 'ਰਜਿਸਟਰ',
      dashboard: 'ਡੈਸ਼ਬੋਰਡ'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('mandi_lang') || 'hi');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('mandi_fontsize') || 'normal');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('mandi_contrast') === 'true');

  useEffect(() => {
    localStorage.setItem('mandi_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('mandi_fontsize', fontSize);
    if (typeof document !== 'undefined') {
      if (fontSize === 'large') {
        document.documentElement.style.fontSize = '18px';
      } else if (fontSize === 'xlarge') {
        document.documentElement.style.fontSize = '20px';
      } else {
        document.documentElement.style.fontSize = '16px';
      }
    }
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('mandi_contrast', highContrast);
  }, [highContrast]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'hi' ? 'en' : prev === 'en' ? 'pa' : 'hi'));
  };

  const toggleContrast = () => {
    setHighContrast((prev) => !prev);
  };

  const currentTranslations = translations[lang] || translations.hi;

  const tFunction = (key, fallback = '') => {
    if (!key) return '';
    const parts = String(key).split('.');
    let val = currentTranslations;
    for (const p of parts) {
      if (val && typeof val === 'object' && p in val) {
        val = val[p];
      } else {
        return fallback || key;
      }
    }
    return typeof val === 'string' ? val : (fallback || key);
  };

  const t = Object.assign(tFunction, currentTranslations);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLanguage,
        fontSize,
        setFontSize,
        highContrast,
        toggleContrast,
        t
      }}
    >
      <div className={`${fontSize === 'large' ? 'text-[1.05rem]' : fontSize === 'xlarge' ? 'text-[1.15rem]' : 'text-base'} ${highContrast ? 'bg-slate-950 text-yellow-300' : ''}`}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
