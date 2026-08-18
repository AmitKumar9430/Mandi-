import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useUserAuth } from '../auth/UserAuthContext';
import { userProblemApi } from '../shared/api/userApi';
import ImageLightboxModal from './ImageLightboxModal';
import {
  Mic,
  MicOff,
  Sparkles,
  Send,
  MapPin,
  Camera,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Volume2,
  VolumeX,
  Sprout,
  HelpCircle,
  X,
  ZoomIn,
  Image as ImageIcon
} from 'lucide-react';

export default function BoloHero() {
  const { lang, t } = useLanguage();
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [district, setDistrict] = useState('Lucknow');
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [photoFileName, setPhotoFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSpeakingText, setIsSpeakingText] = useState(false);

  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInputText(currentTranscript);
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, [lang]);

  // Live Rule/NLP preview classifier as user types or speaks
  useEffect(() => {
    if (!inputText || inputText.trim().length < 4) {
      setPreview(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsAnalyzing(true);
      try {
        const res = await userProblemApi.previewClassify(inputText.trim());
        if (res.success && res.data) {
          setPreview(res.data);
        }
      } catch (e) {
        console.warn('Preview classification failed:', e);
      } finally {
        setIsAnalyzing(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [inputText]);

  const toggleRecording = () => {
    if (!speechSupported) {
      alert(lang === 'hi' ? 'आपके फ़ोन/ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है। कृपया नीचे टाइप करें।' : 'Voice recognition not supported in this browser. Please type.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  // Text-To-Speech for low-literacy rural citizens
  const speakTextAloud = (text) => {
    if (!window.speechSynthesis) return;

    if (isSpeakingText) {
      window.speechSynthesis.cancel();
      setIsSpeakingText(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeakingText(false);
    utterance.onerror = () => setIsSpeakingText(false);

    setIsSpeakingText(true);
    window.speechSynthesis.speak(utterance);
  };

  // Direct Local File Upload from device storage / camera with client-side compression
  const handleLocalFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1000;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.80);
          setPhotoDataUrl(compressedDataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoDataUrl('');
    setPhotoFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleQuickExample = (text) => {
    setInputText(text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || inputText.trim().length < 4) {
      setErrorMessage(lang === 'hi' ? 'कृपया अपनी समस्या बोलकर या लिखकर बताएं।' : 'Please speak or describe your problem.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (!user) {
        navigate('/user/login?redirect=problems/create&text=' + encodeURIComponent(inputText));
        return;
      }

      const payload = {
        title: inputText.trim().slice(0, 80),
        rawDescription: inputText.trim(),
        district: district,
        locationName: district + ' Area',
        category: preview?.category || 'AGRICULTURE',
        urgency: preview?.urgency || 'MEDIUM',
        photoUrl: photoDataUrl || undefined
      };

      const res = await userProblemApi.create(payload);
      if (res.success && res.data) {
        navigate(`/user/problems/${res.data.id}`);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit problem. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [showZoomModal, setShowZoomModal] = useState(false);

  return (
    <div className="relative overflow-hidden bg-rural-hero text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 shadow-2xl border-b border-stone-800">
      {/* Zoom In/Out Lightbox Modal */}
      {showZoomModal && (
        <ImageLightboxModal
          src={photoDataUrl}
          alt={photoFileName || 'Attached problem image'}
          onClose={() => setShowZoomModal(false)}
        />
      )}

      <div className="max-w-4xl mx-auto relative z-10 space-y-7">
        {/* Top Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-black/60 border border-white/20 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-stone-100 backdrop-blur-md shadow-lg">
            <span className="text-base">🌾</span>
            <span>{lang === 'hi' ? 'गाँव, किसान, कारीगर एवं जन-समस्या समाधान मंच' : 'Rural Community Problem-Resolution Platform'}</span>
          </div>

          {/* Clean White Crisp Title with Drop Shadow */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-lg">
            {lang === 'hi' ? (
              <>
                अपनी समस्या बोलकर बताएं, <br />
                <span className="text-white">मंडी समाधान तक ले जाएगा।</span>
              </>
            ) : (
              <>
                Describe Problem in Your Words, <br />
                <span className="text-white">MANDI Guides You To Solution.</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-lg text-stone-100 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
            {lang === 'hi'
              ? 'फसल खरीदार, ट्रैक्टर-हार्वेस्टर किराया, खराब हैंडपंप व सड़क या सरकारी योजना — बस माइक दबाकर बोलें।'
              : 'Crop buyers, tractor & harvester rental, broken handpumps, road defects or welfare schemes — just speak into the mic.'}
          </p>
        </div>

        {/* Main Clean Frosted Glass Box */}
        <div className="bg-stone-950/80 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/20 relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/60 p-4 rounded-2xl border border-stone-700 focus-within:border-white/40 transition">
              {/* Giant Speak Button */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-xl transition-all transform active:scale-95 flex flex-col items-center justify-center font-bold text-xs gap-1 ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-500/50 scale-105'
                    : 'bg-white text-stone-950 hover:bg-stone-100 hover:scale-105 ring-2 ring-white/30'
                }`}
                title={isRecording ? 'Stop Recording' : 'बोलने के लिए दबाएँ (Tap to Speak)'}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-7 h-7 animate-bounce" />
                    <span className="text-[10px]">सुन रहे हैं...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-7 h-7 text-stone-950" />
                    <span className="text-[11px] font-black">{lang === 'hi' ? 'माइक' : 'Speak'}</span>
                  </>
                )}
              </button>

              {/* Text Input Area */}
              <div className="flex-1 w-full">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isRecording
                      ? (lang === 'hi' ? 'सुन रहे हैं... कृपया अपनी समस्या बोलें' : 'Listening... please describe your issue')
                      : (lang === 'hi' ? 'यहाँ बोलें या लिखें: "मेरे पास 50 क्विंटल गेहूँ है, खरीदार और ट्रैक्टर चाहिए..."' : 'Speak or type problem in simple words...')
                  }
                  rows={2}
                  className="w-full bg-transparent text-white placeholder-stone-400 text-base sm:text-lg font-medium focus:outline-none resize-none leading-relaxed"
                />

                <div className="flex items-center justify-between text-xs text-stone-400 pt-1 border-t border-stone-800">
                  <span className="text-stone-300 font-semibold flex items-center space-x-1">
                    <span>💡 {lang === 'hi' ? 'माइक दबाकर बोलें या टाइप करें' : 'Tap Mic to speak in Hindi/English'}</span>
                  </span>
                  {inputText && (
                    <button
                      type="button"
                      onClick={() => speakTextAloud(inputText)}
                      className="text-stone-300 hover:text-white flex items-center space-x-1 text-xs bg-stone-800 px-2 py-0.5 rounded"
                      title="Listen aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-white" />
                      <span>{isSpeakingText ? 'रोकें' : 'सुनें (Read)'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Local File Hidden Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleLocalFileChange}
              className="hidden"
            />

            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                {/* District Selector */}
                <div className="flex items-center space-x-1.5 bg-black/60 border border-stone-700 px-3.5 py-2 rounded-xl text-xs sm:text-sm text-stone-200">
                  <MapPin className="w-4 h-4 text-stone-300 flex-shrink-0" />
                  <span className="font-bold text-stone-400">{lang === 'hi' ? 'ज़िला:' : 'District:'}</span>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="Lucknow" className="bg-stone-900">Lucknow (लखनऊ)</option>
                    <option value="Malihabad" className="bg-stone-900">Malihabad (मलिहाबाद)</option>
                    <option value="Bakshi Ka Talab" className="bg-stone-900">Bakshi Ka Talab</option>
                    <option value="Mohanlalganj" className="bg-stone-900">Mohanlalganj</option>
                    <option value="Barabanki" className="bg-stone-900">Barabanki (बाराबंकी)</option>
                    <option value="Sitapur" className="bg-stone-900">Sitapur (सीतापुर)</option>
                    <option value="Unnao" className="bg-stone-900">Unnao (उन्नाव)</option>
                    <option value="Rae Bareli" className="bg-stone-900">Rae Bareli (रायबरेली)</option>
                  </select>
                </div>

                {/* Direct File Attachment Trigger Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition ${
                    photoDataUrl
                      ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500'
                      : 'bg-black/60 text-stone-300 border-stone-700 hover:bg-stone-800'
                  }`}
                >
                  <Camera className="w-4 h-4 text-stone-300" />
                  <span>{photoDataUrl ? '✓ फोटो जोड़ी गई' : '📷 डिवाइस से फोटो जोड़ें'}</span>
                </button>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-white hover:bg-stone-100 text-stone-950 font-black px-6 py-3 rounded-2xl shadow-xl transition transform active:scale-95 disabled:opacity-50 text-sm sm:text-base border border-stone-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-stone-950" />
                    <span>पासपोर्ट बन रहा है...</span>
                  </>
                ) : (
                  <>
                    <span>{lang === 'hi' ? 'समाधान खोजें (Get Solution)' : 'Find Solution Path'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Attached Photo Thumbnail Preview with Zoom In & Delete */}
            {photoDataUrl && (
              <div className="p-3.5 bg-black/75 rounded-2xl border border-stone-700 flex items-center justify-between animate-fadeIn">
                <div className="flex items-center space-x-3.5">
                  <div
                    onClick={() => setShowZoomModal(true)}
                    className="relative group cursor-pointer"
                    title="Click to Zoom In / Zoom Out"
                  >
                    <img
                      src={photoDataUrl}
                      alt="Attached preview"
                      className="w-16 h-16 object-cover rounded-xl border-2 border-white/30 shadow group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-white block truncate max-w-[220px]">
                      {photoFileName || 'Uploaded Image'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowZoomModal(true)}
                      className="text-xs text-emerald-400 font-bold hover:underline flex items-center space-x-1 mt-0.5"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>🔍 ज़ूम करके देखें (Click to Zoom)</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowZoomModal(true)}
                    className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl transition text-xs font-bold flex items-center space-x-1"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4 text-emerald-400" />
                    <span className="hidden sm:inline">Zoom</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-2 bg-stone-800 hover:bg-red-900/80 text-stone-300 hover:text-white rounded-xl transition"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-red-950/90 border border-red-700 text-red-200 text-xs sm:text-sm rounded-xl flex items-center space-x-2 font-bold">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>

          {/* Live NLP Preview Box */}
          {preview && (
            <div className="mt-4 p-4 bg-black/70 rounded-2xl border border-white/20 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center space-x-2 font-black text-white">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>मंडी AI समझ (Engine Assessment):</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-stone-800 text-white border border-stone-600">
                    {preview.category}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                    preview.urgency === 'CRITICAL' ? 'bg-red-900 text-red-100' :
                    preview.urgency === 'HIGH' ? 'bg-amber-900 text-amber-100' :
                    'bg-emerald-900 text-emerald-100'
                  }`}>
                    {preview.urgency} Urgency
                  </span>
                </div>
              </div>

              {/* Proposed Solution Path */}
              <div className="text-xs sm:text-sm text-stone-200 bg-stone-900/90 p-3 rounded-xl border border-stone-800 flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold text-white">समाधान मार्ग (Solution Path): </span>
                  <span className="text-stone-300">{preview.solutionPathSummary}</span>
                </div>
              </div>

              {/* Required Resources */}
              {preview.requiredResources && preview.requiredResources.length > 0 && (
                <div className="flex items-center space-x-2 flex-wrap text-xs text-stone-300 pt-1">
                  <span className="font-bold text-white">ज़रूरी संसाधन:</span>
                  {preview.requiredResources.map((res, i) => (
                    <span key={i} className="bg-stone-800 text-stone-200 px-2.5 py-1 rounded-md border border-stone-700 font-semibold">
                      ✓ {res}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Rural Problem Presets */}
          <div className="mt-4 pt-3 border-t border-stone-800">
            <span className="text-xs sm:text-sm text-stone-300 font-bold block mb-2">
              {lang === 'hi' ? '👇 सीधे क्लिक करके समस्या चुनें (Click sample problem):' : '👇 Or click any sample problem:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              {[
                { icon: '🌾', text: 'मेरे पास 50 क्विंटल गेहूँ है, खरीदार और ट्रैक्टर चाहिए' },
                { icon: '🚰', text: 'गाँव के प्राथमिक स्कूल के पास हैंडपंप 3 हफ्ते से खराब है' },
                { icon: '🚜', text: 'खेत की जुताई और कटाई के लिए ट्रैक्टर व कंबाइन किराए पर चाहिए' },
                { icon: '🏛️', text: 'पीएम किसान सम्मान निधि और ग्रामीण आवास योजना में सहायता' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickExample(item.text)}
                  className="text-left bg-black/60 hover:bg-stone-800 text-stone-200 hover:text-white p-2.5 rounded-xl border border-stone-700 transition flex items-center space-x-2 group"
                >
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <span className="truncate font-medium group-hover:text-white">"{item.text}"</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
