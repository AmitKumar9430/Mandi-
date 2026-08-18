import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  hi: {
    brand_tagline: 'समस्या बताओ, समाधान तक ले जाएगा।',
    bolo_button: '🎤 बोलो अपनी प्रॉब्लम',
    search_help: 'मदद खोजें...',
    nearby_help: 'आस-पास की मदद',
    my_problems: 'मेरी समस्याएँ',
    categories: {
      AGRICULTURE: 'कृषि एवं फसल (Kisan)',
      HEALTHCARE: 'स्वास्थ्य एवं अस्पताल',
      EDUCATION: 'शिक्षा एवं छात्र',
      EMPLOYMENT: 'रोज़गार एवं कारीगर',
      INFRASTRUCTURE: 'सड़क एवं बुनियादी ढाँचा',
      WATER_SANITATION: 'पानी एवं स्वच्छता',
      ELECTRICITY: 'बिजली एवं ट्रांसफार्मर',
      EMERGENCY: 'आपातकालीन सहायता',
      SOCIAL_WELFARE: 'सरकारी योजनाएं',
      OTHER: 'अन्य सहायता'
    },
    nav: {
      home: 'होम',
      problems: 'समस्याएं (Feed)',
      agriculture: 'किसान बाज़ार (Kisan Desk)',
      jobs: 'रोज़गार व टाइम बैंक',
      volunteer: 'मंडी सेवा (Volunteer)',
      schemes: 'सरकारी योजनाएं',
      civic: 'गाँव की समस्या (Civic)',
      map: 'नक्शा (Map)',
      pulse: 'मंडी पल्स (Pulse)',
      dashboard: 'डैशबोर्ड',
      login: 'लॉग इन',
      register: 'नया खाता',
      logout: 'लॉग आउट'
    },
    hero: {
      title_1: 'कोई भी समस्या हो,',
      title_2: 'मंडी है आपके साथ।',
      subtitle: 'फसल का खरीदार चाहिए, अस्पताल जाने के लिए गाड़ी, खराब हैंडपंप का सुधार या रोज़गार — बस बोलकर या लिखकर बताएं।',
      input_placeholder: 'जैसे: "मेरे पास 50 क्विंटल गेहूँ है और खरीदार नहीं मिल रहा..." या "गाँव का हैंडपंप खराब है"',
      recording: 'सुन रहे हैं... बोलिए',
      voice_start: 'माइक दबाकर बोलें',
      submit_problem: 'समाधान खोजें (Submit Problem)',
      analyzing: 'मंडी AI समझ रहा है...',
    },
    passport: {
      title: 'समस्या पासपोर्ट (Problem Passport)',
      code: 'पासपोर्ट कोड',
      solution_path: 'समाधान मार्ग (Solution Graph)',
      assigned_resources: 'आवंटित संसाधन / मददगार',
      urgency: 'प्राथमिकता',
      status: 'स्थिति',
      timeline: 'प्रगति समय-सारिणी (Timeline)',
      confirm_resolution: 'समस्या हल हो गई (Confirm Resolution)',
      rate_assistance: 'अनुभव रेटिंग दें'
    }
  },
  en: {
    brand_tagline: 'Describe Problem. MANDI Guides You To Solution.',
    bolo_button: '🎤 Bolo Apni Problem',
    search_help: 'Search help & resources...',
    nearby_help: 'Nearby Help',
    my_problems: 'My Problems',
    categories: {
      AGRICULTURE: 'Agriculture & Crops',
      HEALTHCARE: 'Healthcare & Medical',
      EDUCATION: 'Education & Students',
      EMPLOYMENT: 'Jobs & Livelihood',
      INFRASTRUCTURE: 'Roads & Infrastructure',
      WATER_SANITATION: 'Water & Sanitation',
      ELECTRICITY: 'Electricity & Power',
      EMERGENCY: 'Emergency Aid',
      SOCIAL_WELFARE: 'Government Welfare',
      OTHER: 'General Community Help'
    },
    nav: {
      home: 'Home',
      problems: 'Problem Feed',
      agriculture: 'Kisan Agri Desk',
      jobs: 'Jobs & TimeBank',
      volunteer: 'MANDI Seva',
      schemes: 'Govt Schemes',
      civic: 'Civic Issues',
      map: 'Map Explorer',
      pulse: 'MANDI Pulse',
      dashboard: 'Dashboard',
      login: 'Login',
      register: 'Register',
      logout: 'Logout'
    },
    hero: {
      title_1: 'Whatever your real-world problem,',
      title_2: 'MANDI will guide you to solution.',
      subtitle: 'Need crop buyers, emergency hospital transport, pump repair, or livelihood — speak or type your problem in simple words.',
      input_placeholder: 'e.g. "I have 50 quintals of wheat and need verified buyer and tractor transport..."',
      recording: 'Listening... please speak',
      voice_start: 'Speak Problem (Voice)',
      submit_problem: 'Find Solution Path',
      analyzing: 'MANDI Engine analyzing problem...',
    },
    passport: {
      title: 'Problem Passport',
      code: 'Passport Code',
      solution_path: 'Solution Graph',
      assigned_resources: 'Assigned Resources / Providers',
      urgency: 'Urgency',
      status: 'Status',
      timeline: 'Execution Timeline',
      confirm_resolution: 'Confirm Problem Resolved',
      rate_assistance: 'Rate Assistance'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('mandi_lang') || 'hi');

  useEffect(() => {
    localStorage.setItem('mandi_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'hi' ? 'en' : 'hi'));
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
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
