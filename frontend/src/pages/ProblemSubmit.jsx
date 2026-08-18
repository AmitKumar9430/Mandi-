import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { problemApi } from '../api/client';
import ImageLightboxModal from '../components/ImageLightboxModal';
import {
  Mic,
  MicOff,
  Sparkles,
  MapPin,
  Camera,
  AlertTriangle,
  ArrowRight,
  Loader2,
  FileText,
  X,
  ZoomIn,
  UploadCloud
} from 'lucide-react';

export default function ProblemSubmit() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [rawDescription, setRawDescription] = useState(searchParams.get('text') || '');
  const [category, setCategory] = useState('AGRICULTURE');
  const [urgency, setUrgency] = useState('MEDIUM');
  const [villageOrTown, setVillageOrTown] = useState('');
  const [district, setDistrict] = useState('Lucknow');
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [photoFileName, setPhotoFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showZoomModal, setShowZoomModal] = useState(false);

  const fileInputRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rawDescription.trim() || rawDescription.trim().length < 5) {
      setErrorMsg(lang === 'hi' ? 'कृपया समस्या का विवरण दर्ज करें।' : 'Please enter problem description.');
      return;
    }

    if (!user) {
      navigate('/login?redirect=submit&text=' + encodeURIComponent(rawDescription));
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await problemApi.create({
        rawDescription: rawDescription.trim(),
        category,
        urgency,
        villageOrTown,
        district,
        photoUrl: photoDataUrl || undefined
      });

      if (res.success && res.data) {
        navigate(`/problems/${res.data.id}`);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit problem');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Zoom In/Out Lightbox Modal */}
      {showZoomModal && photoDataUrl && (
        <ImageLightboxModal
          src={photoDataUrl}
          alt={photoFileName || 'Problem attachment'}
          onClose={() => setShowZoomModal(false)}
        />
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-stone-200 space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-center space-x-2 text-pine-700 font-black text-xs uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>{lang === 'hi' ? 'समस्या पंजीकरण' : 'Problem Registration'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 mt-1">
            {lang === 'hi' ? 'अपनी समस्या का विवरण दर्ज करें' : 'Describe Your Real-World Problem'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {lang === 'hi'
              ? 'मंडी इंजन आपकी समस्या का विश्लेषण कर डिजिटल पासपोर्ट और समाधान ग्रिड तैयार करेगा।'
              : 'MANDI will generate a Problem Passport & Solution Graph for you.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-800 text-xs sm:text-sm rounded-2xl border border-red-200 flex items-center space-x-2 font-bold">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
          <div>
            <label className="font-bold text-stone-800 block mb-1.5">
              {lang === 'hi' ? 'समस्या का पूरा विवरण (Detail):' : 'Detailed Description:'}
            </label>
            <textarea
              value={rawDescription}
              onChange={(e) => setRawDescription(e.target.value)}
              placeholder={lang === 'hi' ? 'जैसे: मेरे पास 50 क्विंटल गेहूँ है, खरीदार और ट्रांसपोर्ट चाहिए...' : 'e.g. I have 50 quintals of wheat harvest ready and need a verified buyer and transport...'}
              rows={4}
              required
              className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-300 focus:ring-2 focus:ring-pine-500 focus:outline-none font-medium text-base leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-stone-800 block mb-1.5">
                {lang === 'hi' ? 'श्रेणी (Category):' : 'Category:'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-stone-50 rounded-2xl border border-stone-300 focus:outline-none font-bold"
              >
                <option value="AGRICULTURE">🌾 Agriculture & Produce (कृषि)</option>
                <option value="HEALTHCARE">🏥 Healthcare & Hospital (स्वास्थ्य)</option>
                <option value="EMPLOYMENT">💼 Jobs & Labour (रोज़गार)</option>
                <option value="WATER_SANITATION">💧 Water & Handpumps (पानी)</option>
                <option value="ELECTRICITY">⚡ Electricity & Transformer (बिजली)</option>
                <option value="INFRASTRUCTURE">🛣️ Roads & Infrastructure (सड़क)</option>
                <option value="EDUCATION">📚 Education & Books (शिक्षा)</option>
                <option value="SOCIAL_WELFARE">📋 Government Schemes (योजनाएं)</option>
                <option value="OTHER">🤝 Other Community Help (अन्य)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1.5">
                {lang === 'hi' ? 'प्राथमिकता (Urgency):' : 'Urgency Level:'}
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full p-3 bg-stone-50 rounded-2xl border border-stone-300 focus:outline-none font-bold"
              >
                <option value="LOW">Low (सामान्य - 3-5 Days)</option>
                <option value="MEDIUM">Medium (मध्यम - 24-48 Hours)</option>
                <option value="HIGH">High (अति-आवश्यक - 12-24 Hours)</option>
                <option value="CRITICAL">Critical (तत्काल / Emergency)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-stone-800 block mb-1.5">
                {lang === 'hi' ? 'गाँव / कस्बा (Village / Town):' : 'Village / Town:'}
              </label>
              <input
                type="text"
                value={villageOrTown}
                onChange={(e) => setVillageOrTown(e.target.value)}
                placeholder="e.g. Malihabad, Bakshi Ka Talab"
                className="w-full p-3 bg-stone-50 rounded-2xl border border-stone-300 focus:outline-none font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1.5">
                {lang === 'hi' ? 'ज़िला (District):' : 'District:'}
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Lucknow, Barabanki, Sitapur"
                className="w-full p-3 bg-stone-50 rounded-2xl border border-stone-300 focus:outline-none font-semibold"
              />
            </div>
          </div>

          {/* Direct Local Device Photo Upload */}
          <div>
            <label className="font-bold text-stone-800 block mb-1.5">
              {lang === 'hi' ? 'फोटो संलग्न करें (Attach Photo from Device):' : 'Attach Photo from Device / Storage:'}
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleLocalFileChange}
              className="hidden"
            />

            {!photoDataUrl ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-5 border-2 border-dashed border-stone-300 rounded-2xl hover:border-pine-500 bg-stone-50 flex flex-col items-center justify-center gap-2 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-pine-100 text-pine-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="font-bold text-stone-800 block text-sm">
                    {lang === 'hi' ? 'गैलरी या कैमरे से फोटो चुनें' : 'Click to upload photo from storage / camera'}
                  </span>
                  <span className="text-xs text-stone-500">JPG, PNG, WebP up to 10MB</span>
                </div>
              </button>
            ) : (
              <div className="p-4 bg-stone-50 rounded-2xl border-2 border-stone-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    onClick={() => setShowZoomModal(true)}
                    className="relative group cursor-pointer"
                    title="Click to Zoom In / Zoom Out"
                  >
                    <img
                      src={photoDataUrl}
                      alt="Attached preview"
                      className="w-16 h-16 object-cover rounded-xl border border-stone-300 shadow group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-bold text-stone-900 block truncate max-w-[250px]">
                      {photoFileName || 'Attached photo'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowZoomModal(true)}
                      className="text-xs text-pine-700 font-bold hover:underline flex items-center space-x-1 mt-0.5"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>🔍 फोटो ज़ूम करें (Zoom In / Out)</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowZoomModal(true)}
                    className="px-3 py-1.5 bg-pine-100 hover:bg-pine-200 text-pine-900 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Zoom</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-1.5 bg-stone-200 hover:bg-red-100 text-stone-700 hover:text-red-700 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>हटाएं (Remove)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 text-stone-600 hover:bg-stone-100 font-bold rounded-2xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-pine-700 hover:bg-pine-800 text-white font-black px-7 py-3 rounded-2xl shadow-xl transition flex items-center space-x-2 border border-emerald-400 text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Generating Passport...</span>
                </>
              ) : (
                <>
                  <span>{lang === 'hi' ? 'पासपोर्ट बनाएं व समाधान खोजें' : 'Generate Problem Passport'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
