import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuth } from '../auth/UserAuthContext';
import { useLanguage } from '../context/LanguageContext';
import { userProblemApi } from '../shared/api/userApi';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Minus,
  Maximize2,
  X,
  Languages,
  Loader2,
  HelpCircle,
  Sprout,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

// Comprehensive Bilingual Knowledge Base for instant high-confidence answers
const EXPERT_KNOWLEDGE_BASE = [
  {
    keywords: ['crop rotation', 'fasal chakra', 'फसल चक्र', 'crop cycle'],
    answer: {
      en: {
        title: 'Crop Rotation (फसल चक्र)',
        answer: 'Crop rotation means sequentially planting different crop families on the same soil across seasons to naturally replenish nutrients, break weed and pest cycles, and boost organic yield.',
        detail: 'Best Pattern: Legume (Moong/Gram/Soybean) → Cereal (Wheat/Paddy/Maize) → Oilseed (Mustard). Legumes contain root nodules that naturally fix atmospheric nitrogen (30-50 kg/ha), cutting fertilizer costs.',
        nextStep: 'You can list your seasonal produce or find tractor rental on the Kisan Desk.'
      },
      hi: {
        title: 'फसल चक्र (Crop Rotation)',
        answer: 'फसल चक्र का अर्थ है एक ही खेत में लगातार एक ही फसल उगाने के बजाय मौसम अनुसार बदल-बदल कर अलग-अलग प्रकार की फसलें बोना।',
        detail: 'आदर्श क्रम: दलहन (मूँग/चना) → धान्य (गेहूँ/धान) → तिलहन (सरसों)। दलहनी फसलों की जड़ों में राइजोबियम बैक्टीरिया होता है जो हवा से प्राकृतिक नाइट्रोजन लेकर मिट्टी को उपजाऊ बनाता है और यूरिया का खर्च 30-40% तक घटाता है।',
        nextStep: 'आप किसान डेस्क पर अपनी फसल बिक्री व ट्रैक्टर बुकिंग देख सकते हैं।'
      }
    }
  },
  {
    keywords: ['pm kisan', 'pm-kisan', 'samman nidhi', 'पीएम किसान', 'सम्मान निधि', '₹6000', '6000', 'kist'],
    answer: {
      en: {
        title: 'PM-Kisan Samman Nidhi (पीएम किसान सम्मान निधि)',
        answer: 'PM-KISAN is a 100% central government initiative providing ₹6,000 annually to all eligible landholding farmer families.',
        detail: 'Paid in 3 equal DBT installments of ₹2,000 every 4 months directly into Aadhaar-seeded bank accounts. Mandatory documents: Land Records (Khatauni) in applicant’s name, e-KYC completion via OTP/Biometric, and Aadhaar-DBT linked bank account.',
        nextStep: 'Visit Government Welfare Schemes on MANDI to explore direct official portal links.'
      },
      hi: {
        title: 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)',
        answer: 'पीएम किसान केंद्र सरकार की योजना है, जिसके तहत पात्र किसान परिवारों को प्रति वर्ष ₹6,000 की वित्तीय सहायता सीधे बैंक खाते में दी जाती है।',
        detail: 'यह राशि ₹2,000 की 3 समान किस्तों में हर 4 महीने पर DBT द्वारा सीधे बैंक खाते में भेजी जाती है। अनिवार्य नियम: आवेदक के नाम जमीन की खतौनी (Land Seeding), e-KYC सत्यापन और बैंक खाते में आधार NPCI DBT लिंक होना आवश्यक है।',
        nextStep: 'मंडी के "सरकारी योजनाएं" सेक्शन में जाकर आधिकारिक पोर्टल का विवरण देख सकते हैं।'
      }
    }
  },
  {
    keywords: ['transformer', 'bijli', 'power failure', 'ट्रांसफार्मर', 'बिजली', 'voltage', '1912', 'light'],
    answer: {
      en: {
        title: 'Rural Electricity & Burnt Transformer Replacement SLA',
        answer: 'Under the standard Electricity Supply Code, a burnt or damaged rural transformer must be repaired or replaced by the Discom within 48 hours in plain areas and 72 hours in remote villages.',
        detail: 'Action Steps: Log an official complaint on toll-free 1912 with village name, pole number, and transformer capacity (e.g. 25kVA). If delayed, report to the Sub-Divisional Officer (SDO) or file a Civic Grievance on MANDI.',
        nextStep: 'File a geotagged photo report on MANDI Civic Desk for community tracking.'
      },
      hi: {
        title: 'ग्रामीण बिजली व ट्रांसफार्मर खराबी समाधान',
        answer: 'विद्युत आपूर्ति संहिता के अनुसार गाँव में ट्रांसफार्मर फुंकने पर बिजली विभाग (डिस्कॉम) को 48 से 72 घंटे के अंदर नया ट्रांसफार्मर लगाना अनिवार्य है।',
        detail: 'ज़रूरी कदम: टोल-फ्री 1912 पर कॉल करके शिकायत नंबर लें, गाँव का पोल नंबर और ट्रांसफार्मर क्षमता (25kVA/63kVA) बताएं। यदि 3 दिन में समाधान न हो तो मंडी पर फोटो के साथ शिकायत दर्ज करें।',
        nextStep: 'गाँव की समस्या (Civic Desk) पर फोटो अपलोड करके रिपोर्ट दर्ज करें।'
      }
    }
  },
  {
    keywords: ['handpump', 'paani', 'water supply', 'हैंडपंप', 'नल', 'पानी', 'borewell', 'boring', 'peene ka paani'],
    answer: {
      en: {
        title: 'Village Handpump & Drinking Water Repair Mechanism',
        answer: 'Public handpumps in revenue villages are serviced under Gram Panchayat development funds and the Jal Nigam maintenance mechanic roster.',
        detail: 'Typical defects: Cylinder leather washer worn out, chain snapped, or riser pipe leakage. Minor repairs are executed by local certified mechanics within 24-48 hours once recorded in the Panchayat register.',
        nextStep: 'Submit a Handpump Civic Ticket on MANDI with photo evidence for quick mechanic dispatch.'
      },
      hi: {
        title: 'गाँव का सरकारी हैंडपंप व पेयजल मरम्मत',
        answer: 'गाँव के सरकारी हैंडपंपों की मरम्मत ग्राम पंचायत विकास निधि और जल निगम मैकेनिक पूल द्वारा की जाती है।',
        detail: 'मुख्य खराबी: सिलेंडर का वॉशर घिसना, चेन उतरना या पाइप में लीकेज होना। पंचायत सचिव या ग्राम प्रधान को अवगत कराकर 1-2 दिन में स्थानीय मिस्त्री से ठीक कराया जा सकता है।',
        nextStep: 'मंडी पर हैंडपंप की फोटो के साथ शिकायत दर्ज करें ताकि स्थानीय मिस्त्री तक त्वरित सूचना पहुंचे।'
      }
    }
  },
  {
    keywords: ['drip irrigation', 'tapak sinchai', 'ड्रिप सिंचाई', 'sprinkler', 'सिंचाई', 'subsidy'],
    answer: {
      en: {
        title: 'Micro-Irrigation (Drip & Sprinkler Subsidy)',
        answer: 'Under the Pradhan Mantri Krishi Sinchayee Yojana (PMKSY) - Per Drop More Crop, farmers receive 80% to 90% subsidy on drip and sprinkler irrigation systems.',
        detail: 'Benefits: Saves up to 60% water, increases fertilizer efficiency (fertigation), reduces weed growth, and boosts crop yield by 25-40% in vegetable, horticulture, and cash crops.',
        nextStep: 'Check the Welfare Schemes section for state agriculture department subsidy applications.'
      },
      hi: {
        title: 'ड्रिप व स्प्रिंकलर सिंचाई (Micro-Irrigation)',
        answer: 'प्रधानमंत्री कृषि सिंचाई योजना (PMKSY) के तहत ड्रिप और फव्वारा सिंचाई उपकरण लगाने पर छोटे व सीमांत किसानों को 80% से 90% तक सरकारी सब्सिडी मिलती है।',
        detail: 'फायदे: 50-60% पानी की बचत, सीधे पौधों की जड़ों में खाद पहुंचना (फर्टिगेशन), खरपतवार में भारी कमी और पैदावार में 25-40% की बढ़ोतरी होती है।',
        nextStep: 'मंडी के योजना सेक्शन में जाकर कृषि विभाग की सब्सिडी योजना देखें।'
      }
    }
  },
  {
    keywords: ['fasal bima', 'pmfby', 'crop insurance', 'फसल बीमा', 'मुआवजा', 'nuksan'],
    answer: {
      en: {
        title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        answer: 'PMFBY provides comprehensive crop insurance against natural calamities (drought, flood, unseasonal rains, hail, pest outbreaks).',
        detail: 'Farmer Premiums: 1.5% for Rabi crops (Wheat, Mustard), 2.0% for Kharif crops (Paddy, Maize), and 5.0% for Commercial/Horticulture crops. In case of localized crop loss, intimation must be given within 72 hours via Crop Insurance App or toll-free 1800-889-6868.',
        nextStep: 'Verify your sowing details with bank/CSC to ensure active insurance enrollment.'
      },
      hi: {
        title: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
        answer: 'पीएम फसल बीमा योजना प्राकृतिक आपदाओं (सूखा, बाढ़, ओलावृष्टि, बेमौसम बारिश व कीट) से हुए फसल नुकसान पर व्यापक आर्थिक सुरक्षा प्रदान करती है।',
        detail: 'प्रीमियम दरें: रबी फसल (गेहूँ, सरसों) के लिए केवल 1.5%, खरीफ (धान) के लिए 2%, और बागवानी के लिए 5%। नुकसान होने पर 72 घंटे के अंदर Crop Insurance App या 1800-889-6868 पर सूचना देना अनिवार्य है।',
        nextStep: 'मंडी योजना पोर्टल पर अपनी फसल बीमा पॉलिसी व पात्रता की जांच करें।'
      }
    }
  }
];

export default function MandiAiAssistant() {
  const { user } = useUserAuth();
  const { lang: globalLang } = useLanguage();
  const navigate = useNavigate();

  // Assistant-specific language preference (Default Hindi if global is Hindi or user chooses)
  const [chatLang, setChatLang] = useState(globalLang || 'hi');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);

  const [messages, setMessages] = useState([
    {
      id: 'welcome-init',
      sender: 'assistant',
      type: 'greeting',
      text: chatLang === 'hi'
        ? `नमस्ते ${user?.fullName || 'साथी'}! 🙏\nमैं आपका मंडी AI समाधान सहायक हूँ। आप मुझसे कोई भी सवाल पूछ सकते हैं या अपनी फसल, उपकरण, हैंडपंप या योजना की समस्या बता सकते हैं।`
        : `Hello ${user?.fullName || 'Friend'}! 🙏\nI am your MANDI AI Assistant. Ask any question or describe a problem for an instant verified solution path.`,
      time: 'Just now'
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sync with global language if changed
  useEffect(() => {
    setChatLang(globalLang);
  }, [globalLang]);

  // Load and cache browser TTS voices reliably
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          setAvailableVoices(voices);
        }
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Voice Recognition Setup (Speech-to-Text)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = chatLang === 'hi' ? 'hi-IN' : 'en-IN';
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInputQuery(transcript);
        handleSendQuery(transcript);
      };
      rec.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        setIsRecording(false);
      };
      rec.onend = () => setIsRecording(false);
      recognitionRef.current = rec;
    }
  }, [chatLang]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking, isOpen, isMinimized]);

  const toggleMic = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = chatLang === 'hi' ? 'hi-IN' : 'en-IN';
          recognitionRef.current.start();
          setIsRecording(true);
        } else {
          alert(chatLang === 'hi' ? 'आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है।' : 'Voice input is not supported in this browser.');
        }
      } catch (err) {
        console.warn(err);
        setIsRecording(false);
      }
    }
  };

  // Robust Text-to-Speech (Sound Player)
  const speakAloud = (msgId, text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert(chatLang === 'hi' ? 'आपके ब्राउज़र में आवाज़ (स्पीच) सुविधा उपलब्ध नहीं है।' : 'Text-to-speech is not supported in this browser.');
      return;
    }

    // Toggle stop if already speaking this message
    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Prepare clean text for voice engine
    const cleanText = text
      .replace(/[#*•↓→📋🌾🚰⚡🏛️📞🚨💡👉"']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLangCode = chatLang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.lang = targetLangCode;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    // Pick best available voice
    const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      let chosenVoice = null;
      if (chatLang === 'hi') {
        chosenVoice =
          voices.find((v) => v.lang.startsWith('hi')) ||
          voices.find((v) => v.name.toLowerCase().includes('hindi')) ||
          voices.find((v) => v.name.toLowerCase().includes('india') || v.lang === 'en-IN') ||
          voices[0];
      } else {
        chosenVoice =
          voices.find((v) => v.lang === 'en-IN') ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0];
      }
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }
    }

    utterance.onstart = () => {
      setSpeakingMsgId(msgId);
    };

    utterance.onend = () => {
      setSpeakingMsgId(null);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      setSpeakingMsgId(null);
    };

    // Workaround for Chrome paused state
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  };

  const clearChat = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMsgId(null);
    setMessages([
      {
        id: 'welcome-reset-' + Date.now(),
        sender: 'assistant',
        type: 'greeting',
        text: chatLang === 'hi'
          ? 'चैट रीसेट हो गई है। आप नया सवाल या समस्या बता सकते हैं।'
          : 'Chat history reset. How may I assist you today?',
        time: 'Just now'
      }
    ]);
  };

  const toggleChatLanguage = () => {
    const nextLang = chatLang === 'hi' ? 'en' : 'hi';
    setChatLang(nextLang);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMsgId(null);
  };

  const handleSendQuery = async (overrideText) => {
    const q = (overrideText || inputQuery).trim();
    if (!q || q.length < 2) return;

    // Detect if user typed in Hindi or Romanized Hindi
    const isHindiText =
      chatLang === 'hi' ||
      /[\u0900-\u097F]/.test(q) ||
      /\b(gehu|fasal|kisan|handpump|pani|bijli|transformer|rozgar|yojana|tractor|bechna|kharab)\b/i.test(q);

    const activeModeLang = isHindiText ? 'hi' : 'en';

    const userMsg = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    const lowerQ = q.toLowerCase();

    // 1. EMERGENCY TRIAGE
    const isEmergency =
      lowerQ.includes('khoon') || lowerQ.includes('blood') || lowerQ.includes('accident') ||
      lowerQ.includes('behosh') || lowerQ.includes('unconscious') || lowerQ.includes('aag') ||
      lowerQ.includes('fire') || lowerQ.includes('serious injury') || lowerQ.includes('poison');

    if (isEmergency) {
      setTimeout(() => {
        setIsThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            id: 'asst-' + Date.now(),
            sender: 'assistant',
            type: 'emergency',
            title: activeModeLang === 'hi' ? '🚨 तत्काल आपातकालीन सहायता (Emergency)' : '🚨 Immediate Emergency Guidance',
            text: activeModeLang === 'hi'
              ? 'यह एक गंभीर आपातकालीन स्थिति है। कृपया बिना किसी देरी के 108 (एम्बुलेंस) या 112 (राष्ट्रीय आपात सेवा) पर कॉल करें। तुरंत नज़दीकी स्वास्थ्य केंद्र या अस्पताल पहुंचें।'
              : 'This is an immediate medical/safety emergency. Please call 108 (Ambulance) or 112 (Emergency Police/Disaster) immediately.',
            helplines: [
              { name: '108 (Ambulance)', tel: '108' },
              { name: '112 (Emergency Police)', tel: '112' },
              { name: '102 (Pregnancy Aid)', tel: '102' }
            ],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 450);
      return;
    }

    // 2. CHECK EXPERT KNOWLEDGE BASE (Mode 1 — General QA)
    const matchedKb = EXPERT_KNOWLEDGE_BASE.find((kb) =>
      kb.keywords.some((k) => lowerQ.includes(k))
    );

    if (matchedKb) {
      setTimeout(() => {
        setIsThinking(false);
        const data = activeModeLang === 'hi' ? matchedKb.answer.hi : matchedKb.answer.en;
        setMessages((prev) => [
          ...prev,
          {
            id: 'asst-' + Date.now(),
            sender: 'assistant',
            type: 'mode1_qa',
            title: data.title,
            answer: data.answer,
            detail: data.detail,
            nextStep: data.nextStep,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 500);
      return;
    }

    // 3. REAL-WORLD PROBLEM SOLVER (Mode 2 — Solution Graph Engine)
    try {
      let classification = null;
      try {
        const res = await userProblemApi.previewClassify(q);
        if (res.success && res.data) {
          classification = res.data;
        }
      } catch {
        classification = null;
      }

      const category = classification?.category || (
        lowerQ.includes('wheat') || lowerQ.includes('gehu') || lowerQ.includes('crop') || lowerQ.includes('fasal') || lowerQ.includes('tractor') || lowerQ.includes('mandi') || lowerQ.includes('kisan') ? 'AGRICULTURE' :
        lowerQ.includes('handpump') || lowerQ.includes('sadak') || lowerQ.includes('road') || lowerQ.includes('bijli') || lowerQ.includes('light') || lowerQ.includes('nal') || lowerQ.includes('paani') ? 'INFRASTRUCTURE' :
        lowerQ.includes('yojana') || lowerQ.includes('scheme') || lowerQ.includes('pension') || lowerQ.includes('awas') ? 'GOVERNMENT_WELFARE' : 'GENERAL_ASSISTANCE'
      );

      const userLoc = user?.villageOrTown || user?.district || (activeModeLang === 'hi' ? 'लखनऊ क्षेत्र' : 'Lucknow District');

      let requiredResources = [];
      let solutionSteps = [];

      if (category === 'AGRICULTURE') {
        requiredResources = activeModeLang === 'hi' ? [
          'सत्यापित फसल खरीदार व न्यूनतम समर्थन मूल्य (MSP)',
          'ट्रैक्टर-ट्रॉली व स्थानीय परिवहन साधन',
          'डिजिटल तौल पर्ची व सीधा बैंक भुगतान'
        ] : [
          'Verified Crop Buyer & MSP Benchmark',
          'Local Tractor Trolley & Transport Pool',
          'Digital Weight Receipt & Direct Bank Transfer'
        ];
        solutionSteps = activeModeLang === 'hi' ? [
          { num: 1, title: 'फसल उपज का पंजीकरण', desc: `उपज विवरण: "${q.slice(0, 40)}..." (${userLoc})` },
          { num: 2, title: 'सत्यापित खरीदार मिलान', desc: 'मंडी के पंजीकृत व्यापारियों से भाव मिलान व संपर्क' },
          { num: 3, title: 'ट्रैक्टर परिवहन व्यवस्था', desc: 'खेत से मंडी तक ढुलाई हेतु ट्रैक्टर ट्रॉली समन्वय' },
          { num: 4, title: 'तौल, बिक्री व भुगतान', desc: 'पारदर्शी तौल पर्ची व सीधे खाते में राशि अंतरण' }
        ] : [
          { num: 1, title: 'Produce Registration', desc: `Produce lot: "${q.slice(0, 40)}..." in ${userLoc}` },
          { num: 2, title: 'Trader Matching', desc: 'Connecting with verified traders offering benchmark rates' },
          { num: 3, title: 'Transport Dispatch', desc: 'Arranging farmgate pickup trolley from machinery pool' },
          { num: 4, title: 'Settlement & Payment', desc: 'Weight verification and direct payment release' }
        ];
      } else if (category === 'INFRASTRUCTURE') {
        requiredResources = activeModeLang === 'hi' ? [
          'ग्राम पंचायत हैंडपंप/बिजली मिस्त्री',
          'रिप्लेसमेंट स्पेयर पार्ट्स किट (वॉशर/सिलेंडर)',
          'जियोटैग फोटो व जमीनी मरम्मत सत्यापन'
        ] : [
          'Panchayat Maintenance Mechanic',
          'Spare Replacement Parts Kit',
          'Geotagged Photo & Ground Repair Verification'
        ];
        solutionSteps = activeModeLang === 'hi' ? [
          { num: 1, title: 'समस्या टिकट दर्ज', desc: `नागरिक शिकायत: "${q.slice(0, 40)}..." (${userLoc})` },
          { num: 2, title: 'अधिकारी व मिस्त्री को सूचना', desc: 'ग्राम पंचायत सचिव व जल निगम/बिजली विभाग को अलर्ट' },
          { num: 3, title: 'साइट पर भौतिक मरम्मत', desc: 'स्थानीय प्रशिक्षित मिस्त्री द्वारा मौके पर सुधार' },
          { num: 4, title: 'नागरिक सत्यापन व क्लोजर', desc: 'सुधार के बाद फोटो अपलोड व नागरिक संतुष्टि पुष्टि' }
        ] : [
          { num: 1, title: 'Civic Ticket Logged', desc: `Complaint recorded for ${userLoc}` },
          { num: 2, title: 'Mechanic Alert', desc: 'Alerting nearest Gram Panchayat & technical roster' },
          { num: 3, title: 'Field Repair', desc: 'Dispatching technician for physical on-ground repair' },
          { num: 4, title: 'Citizen Sign-off', desc: 'Before/after verification and problem closure' }
        ];
      } else {
        requiredResources = activeModeLang === 'hi' ? [
          'मंडी मित्र व डिजिटल सहायता केंद्र',
          'आवश्यक दस्तावेज (खतौनी, आधार, बैंक पासबुक)',
          'आधिकारिक पोर्टल या CSC सेंटर रजिस्ट्रेशन'
        ] : [
          'MANDI Mitra Digital Help Desk',
          'Eligibility & Document Checklist',
          'Official Portal & CSC Registration'
        ];
        solutionSteps = activeModeLang === 'hi' ? [
          { num: 1, title: 'पात्रता की सटीक जांच', desc: 'सरकारी नियमावली के तहत पात्रता व आयु/भूमि शर्तें' },
          { num: 2, title: 'दस्तावेज व e-KYC तैयारी', desc: 'आधार, खतौनी व बैंक NPCI DBT लिंक की जांच' },
          { num: 3, title: 'आवेदन प्रस्तुति', desc: 'सीएससी सेंटर या ऑनलाइन पोर्टल पर फॉर्म सबमिशन' },
          { num: 4, title: 'डीबीटी सहायता प्राप्ति', desc: 'स्वीकृति ट्रैकिंग व सीधे खाते में सरकारी लाभ' }
        ] : [
          { num: 1, title: 'Eligibility Check', desc: 'Evaluating criteria under official welfare norms' },
          { num: 2, title: 'Document Verification', desc: 'Aadhaar, land records, passbook & e-KYC checks' },
          { num: 3, title: 'Application Submission', desc: 'Official portal or CSC center registration' },
          { num: 4, title: 'Benefit Disbursement', desc: 'Tracking application to final release' }
        ];
      }

      setTimeout(() => {
        setIsThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            id: 'asst-' + Date.now(),
            sender: 'assistant',
            type: 'mode2_problem',
            problemTitle: q,
            category: category,
            urgency: classification?.urgency || 'MEDIUM',
            requiredResources: requiredResources,
            solutionSteps: solutionSteps,
            actionPayload: {
              title: q.slice(0, 80),
              rawDescription: q,
              category: category,
              district: user?.district || 'Lucknow'
            },
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 550);
    } catch {
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: 'asst-' + Date.now(),
          sender: 'assistant',
          type: 'general',
          text: activeModeLang === 'hi'
            ? 'आपकी समस्या दर्ज कर ली गई है। आप नीचे दिए गए बटन से सीधे डिजिटल समाधान पासपोर्ट बना सकते हैं।'
            : 'Your issue has been recorded. You can generate a verified Problem Passport to mobilize community assistance.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleCreatePassport = (payload) => {
    setIsOpen(false);
    navigate('/user/problems/create?text=' + encodeURIComponent(payload.rawDescription || payload.title));
  };

  // Helper to get text for reading aloud
  const getMessageSpeechText = (m) => {
    if (m.answer && m.detail) {
      return `${m.title || ''}. उत्तर: ${m.answer}. विवरण: ${m.detail}. ${m.nextStep || ''}`;
    }
    if (m.type === 'mode2_problem') {
      const steps = m.solutionSteps?.map((s) => `${s.num}. ${s.title}: ${s.desc}`).join('. ') || '';
      return `समस्या: ${m.problemTitle}. श्रेणी: ${m.category}. समाधान चरण: ${steps}`;
    }
    return m.text || '';
  };

  return (
    <>
      {/* 1. FLOATING ACTION BOT BUTTON (FAB) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2 select-none">
        {!isOpen && (
          <div className="flex items-center space-x-2 animate-bounce">
            <div className="bg-stone-900 text-white text-xs font-black px-3.5 py-1.5 rounded-2xl shadow-xl border border-emerald-400/60 flex items-center space-x-1.5 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{chatLang === 'hi' ? '🤖 मंडी AI से पूछें' : '🤖 Ask MANDI AI'}</span>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
          }}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl transition-all transform active:scale-95 flex items-center justify-center relative group border-2 ${
            isOpen
              ? 'bg-stone-900 border-amber-400 text-white rotate-90'
              : 'bg-gradient-to-br from-emerald-500 via-pine-700 to-pine-900 border-emerald-300 text-white hover:scale-105'
          }`}
          title={isOpen ? 'Close MANDI AI Assistant' : 'Open MANDI AI Assistant'}
        >
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-40 animate-ping" />
          )}

          {isOpen ? (
            <X className="w-7 h-7 text-amber-300" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Bot className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-stone-950 animate-pulse" />
            </div>
          )}
        </button>
      </div>

      {/* 2. FLOATING INTERACTIVE CHAT WINDOW */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[94vw] sm:w-[460px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-pine-600/60 flex flex-col overflow-hidden transition-all duration-300 animate-fadeIn ${
            isMinimized ? 'h-16' : 'h-[580px] max-h-[82vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-stone-950 via-pine-950 to-stone-950 text-white p-3 sm:p-4 flex items-center justify-between border-b-2 border-emerald-500/40 flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-pine-600 text-stone-950 flex items-center justify-center font-black shadow-md border border-emerald-300">
                <Bot className="w-5 h-5 text-stone-950" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-black text-xs sm:text-sm text-white tracking-tight">
                    {chatLang === 'hi' ? 'मंडी AI समाधान सहायक' : 'MANDI AI Assistant'}
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-400/40">
                    LIVE
                  </span>
                </div>
                <p className="text-[10px] text-stone-300 font-medium">
                  {chatLang === 'hi' ? 'सत्यापित उत्तर • समाधान ग्राफ' : 'Verified Answers & Solution Graphs'}
                </p>
              </div>
            </div>

            {/* Header Control Buttons with Language Switch */}
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleChatLanguage}
                className="flex items-center space-x-1 bg-stone-900 hover:bg-stone-800 text-emerald-300 px-2 py-1 rounded-lg border border-emerald-500/40 text-[11px] font-black transition"
                title="Toggle Hindi / English"
              >
                <Languages className="w-3 h-3" />
                <span>{chatLang === 'hi' ? 'English' : 'हिन्दी'}</span>
              </button>
              <button
                onClick={clearChat}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
                title="Reset Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-stone-400 hover:text-red-400 rounded-lg hover:bg-stone-800 transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Body (Only when not minimized) */}
          {!isMinimized && (
            <>
              {/* Message Stream */}
              <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-stone-50/80 text-xs sm:text-sm">
                {messages.map((m) => {
                  const isCurrentSpeaking = speakingMsgId === m.id;
                  return (
                    <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[88%] rounded-2xl p-3.5 shadow-sm space-y-2 ${
                          m.sender === 'user'
                            ? 'bg-pine-800 text-white rounded-br-none'
                            : 'bg-white border border-stone-200 text-stone-900 rounded-bl-none'
                        }`}
                      >
                        {/* Assistant Header & Read Aloud Sound Button */}
                        {m.sender === 'assistant' && (
                          <div className="flex items-center justify-between border-b border-stone-100 pb-1 mb-1 text-[11px]">
                            <span className="font-black text-pine-800 flex items-center space-x-1">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>MANDI Engine</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => speakAloud(m.id, getMessageSpeechText(m))}
                              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-black transition ${
                                isCurrentSpeaking
                                  ? 'bg-emerald-600 text-white animate-pulse'
                                  : 'bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200'
                              }`}
                              title={isCurrentSpeaking ? 'Stop Audio' : 'Listen to Answer (बोलकर सुनें)'}
                            >
                              {isCurrentSpeaking ? (
                                <>
                                  <VolumeX className="w-3.5 h-3.5 text-white" />
                                  <span>{chatLang === 'hi' ? 'रोकें ⏹' : 'Stop'}</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5 text-pine-700" />
                                  <span>{chatLang === 'hi' ? 'सुनें 🔊' : 'Listen'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {/* Plain Text or Greeting */}
                        {m.text && <p className="leading-relaxed whitespace-pre-wrap font-medium">{m.text}</p>}

                        {/* Emergency Alert Card */}
                        {m.type === 'emergency' && (
                          <div className="p-3 bg-red-50 border-2 border-red-500 rounded-xl space-y-2 text-red-950">
                            <h4 className="font-black text-xs text-red-700 flex items-center space-x-1">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <span>{m.title}</span>
                            </h4>
                            <p className="text-[11px] font-semibold leading-relaxed">{m.text}</p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {m.helplines?.map((h, i) => (
                                <a
                                  key={i}
                                  href={`tel:${h.tel}`}
                                  className="bg-red-700 text-white px-2.5 py-1 rounded-lg text-[11px] font-black shadow hover:bg-red-800"
                                >
                                  📞 {h.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Mode 1: Clean General QA Card */}
                        {m.type === 'mode1_qa' && (
                          <div className="space-y-2 text-xs">
                            <div>
                              <span className="text-[9px] font-black uppercase text-stone-500 tracking-wider block">
                                {chatLang === 'hi' ? 'उत्तर (ANSWER):' : 'ANSWER:'}
                              </span>
                              <p className="font-black text-stone-950 text-xs sm:text-sm">{m.answer}</p>
                            </div>
                            <div>
                              <span className="text-[9px] font-black uppercase text-stone-500 tracking-wider block">
                                {chatLang === 'hi' ? 'विवरण (DETAIL):' : 'DETAIL:'}
                              </span>
                              <p className="text-[11px] sm:text-xs text-stone-700 leading-relaxed font-medium">
                                {m.detail}
                              </p>
                            </div>
                            {m.nextStep && (
                              <div className="pt-1.5 border-t border-stone-100 text-[11px] text-pine-800 font-bold flex items-start space-x-1">
                                <span className="text-emerald-600 font-black">👉</span>
                                <span>{m.nextStep}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Mode 2: Problem Solving & Solution Graph Ladder */}
                        {m.type === 'mode2_problem' && (
                          <div className="space-y-2.5 text-xs">
                            <div className="flex items-center justify-between flex-wrap gap-1">
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-pine-100 text-pine-900 border border-pine-200">
                                {m.category}
                              </span>
                              <span className="text-[9px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                                {m.urgency} Urgency
                              </span>
                            </div>

                            <div>
                              <span className="text-[9px] font-black uppercase text-stone-500 block">
                                {chatLang === 'hi' ? 'समस्या का आकलन:' : 'PROBLEM UNDERSTOOD:'}
                              </span>
                              <p className="font-black text-stone-950 text-xs">"{m.problemTitle}"</p>
                            </div>

                            {/* What May Be Needed */}
                            <div>
                              <span className="text-[9px] font-black uppercase text-stone-500 block mb-1">
                                {chatLang === 'hi' ? 'आवश्यक संसाधन सूची:' : 'WHAT MAY BE NEEDED:'}
                              </span>
                              <ul className="space-y-1 text-[11px]">
                                {m.requiredResources?.map((res, i) => (
                                  <li key={i} className="flex items-center space-x-1.5 text-stone-800 font-medium">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                                    <span>{res}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Solution Graph Flow */}
                            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 space-y-1.5">
                              <span className="text-[9px] font-black uppercase text-stone-600 block">
                                {chatLang === 'hi' ? 'समाधान चरण (SOLUTION GRAPH):' : 'SOLUTION GRAPH:'}
                              </span>
                              <div className="space-y-1 text-[11px]">
                                {m.solutionSteps?.map((step, idx) => (
                                  <div key={idx}>
                                    <div className="flex items-center space-x-1.5 bg-white p-1.5 rounded-lg border border-stone-200">
                                      <span className="w-4 h-4 rounded-full bg-pine-800 text-white font-black text-[9px] flex items-center justify-center flex-shrink-0">
                                        {step.num}
                                      </span>
                                      <div className="flex-1 truncate">
                                        <strong className="text-stone-900 text-[11px] block truncate font-sans">
                                          {step.title}
                                        </strong>
                                        <span className="text-[10px] text-stone-500 font-sans truncate block">
                                          {step.desc}
                                        </span>
                                      </div>
                                    </div>
                                    {idx < m.solutionSteps.length - 1 && (
                                      <div className="text-center text-pine-600 font-black text-[10px] my-0.5">↓</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => handleCreatePassport(m.actionPayload)}
                                className="w-full bg-pine-800 hover:bg-pine-900 text-white font-black px-3 py-2 rounded-xl shadow transition flex items-center justify-center space-x-1 text-xs border border-emerald-400"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                                <span>{chatLang === 'hi' ? '⚡ समस्या पासपोर्ट बनाएं (1-क्लिक)' : 'Create Problem Passport'}</span>
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="text-[9px] text-stone-400 text-right font-mono">
                          {m.time}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isThinking && (
                  <div className="flex items-center space-x-2 text-stone-600 bg-white p-2.5 rounded-2xl border border-stone-200 w-fit text-xs font-semibold animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-pine-700" />
                    <span>{chatLang === 'hi' ? 'मंडी AI समझ रहा है व समाधान तैयार कर रहा है...' : 'MANDI AI is analyzing and preparing solution...'}</span>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompts Chips Ribbon */}
              <div className="p-2 bg-stone-100 border-t border-stone-200 flex items-center space-x-1.5 overflow-x-auto text-[11px] scrollbar-thin flex-shrink-0">
                {(chatLang === 'hi' ? [
                  { label: '🌾 गेहूँ बेचना है', q: 'मेरे पास 50 क्विंटल गेहूँ है, सही खरीदार और ट्रैक्टर चाहिए' },
                  { label: '💧 हैंडपंप खराब है', q: 'गाँव में हैंडपंप 3 हफ्ते से खराब है, पानी नहीं आ रहा' },
                  { label: '⚡ ट्रांसफार्मर नियम', q: 'गाँव का ट्रांसफार्मर फुंक गया है, बिजली विभाग के क्या नियम हैं?' },
                  { label: '🏛️ पीएम किसान योजना', q: 'पीएम किसान सम्मान निधि क्या है और इसके क्या नियम हैं?' },
                  { label: '🌱 फसल चक्र क्या है?', q: 'फसल चक्र (Crop Rotation) क्या होता है और इसके क्या फायदे हैं?' }
                ] : [
                  { label: '🌾 Sell 50q Wheat', q: 'I have 50 quintals of wheat to sell and need transport' },
                  { label: '💧 Broken Handpump', q: 'The village public handpump has been broken for 3 weeks' },
                  { label: '⚡ Burnt Transformer', q: 'Transformer in village is burnt, what are the replacement rules?' },
                  { label: '🏛️ PM-Kisan Scheme', q: 'What is PM Kisan Samman Nidhi and how does it work?' },
                  { label: '🌱 Crop Rotation', q: 'What is crop rotation and what are its benefits?' }
                ]).map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendQuery(item.q)}
                    className="flex-shrink-0 bg-white hover:bg-pine-50 hover:border-pine-400 text-stone-800 px-2.5 py-1 rounded-xl border border-stone-300 font-bold transition whitespace-nowrap"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Input Bar with Mic & Send */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuery();
                }}
                className="p-2.5 sm:p-3 bg-white border-t border-stone-200 flex items-center gap-1.5 flex-shrink-0"
              >
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`p-2 sm:p-2.5 rounded-xl transition ${
                    isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                  }`}
                  title={isRecording ? 'Stop Recording' : (chatLang === 'hi' ? 'बोलकर पूछें (माइक चालू करें)' : 'Speak in Mic')}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-stone-700" />}
                </button>

                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={
                    isRecording
                      ? (chatLang === 'hi' ? 'सुन रहे हैं... बोलिए' : 'Listening... please speak')
                      : (chatLang === 'hi' ? 'अपनी समस्या बताएं या सवाल पूछें...' : 'Describe problem or ask question...')
                  }
                  className="flex-1 bg-stone-50 border border-stone-300 focus:border-pine-600 focus:bg-white rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-stone-900 focus:outline-none transition"
                />

                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isThinking}
                  className="bg-pine-800 hover:bg-pine-900 text-white p-2 sm:p-2.5 rounded-xl shadow transition disabled:opacity-50 flex-shrink-0"
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
