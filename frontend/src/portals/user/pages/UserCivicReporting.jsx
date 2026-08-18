import React, { useEffect, useState } from 'react';
import { userCivicApi } from '../../../shared/api/userApi';
import { useLanguage } from '../../../context/LanguageContext';
import { useUserAuth } from '../../../auth/UserAuthContext';
import ImageModalViewer from '../../../components/ImageModalViewer';
import {
  AlertCircle,
  ThumbsUp,
  MapPin,
  Camera,
  PlusCircle,
  Loader2,
  CheckCircle,
  X,
  Maximize2
} from 'lucide-react';

export default function UserCivicReporting() {
  const { lang } = useLanguage();
  const { user } = useUserAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'report'

  // Form State
  const [title, setTitle] = useState('Broken Handpump at Village Primary School');
  const [category, setCategory] = useState('WATER_SANITATION');
  const [department, setDepartment] = useState('Jal Nigam & Gram Panchayat');
  const [village, setVillage] = useState('Malihabad');
  const [district, setDistrict] = useState('Lucknow');
  const [desc, setDesc] = useState('Handpump handle broken for 2 weeks. Over 200 schoolchildren have no clean drinking water.');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState(false);
  const [selectedReportPhoto, setSelectedReportPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await userCivicApi.search({ page: 0, size: 20 });
      if (res.data?.content) setReports(res.data.content);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        setPhotoUrl(canvas.toDataURL('image/jpeg', 0.80));
      };
      img.src = uploadEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to report civic grievances.');
      return;
    }
    setIsSubmitting(true);
    try {
      await userCivicApi.create({
        title,
        category,
        department,
        villageOrTown: village,
        district,
        description: desc,
        photoUrl: photoUrl || undefined
      });
      alert('Civic grievance reported successfully!');
      setActiveTab('feed');
      fetchReports();
    } catch (err) {
      alert(err.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await userCivicApi.upvote(id);
      fetchReports();
    } catch {
      // Non-blocking
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Lightbox for viewing photos with Zoom In/Out & Pan */}
      <ImageModalViewer
        src={selectedReportPhoto}
        isOpen={!!selectedReportPhoto}
        title="Civic Defect Photo Inspector"
        onClose={() => setSelectedReportPhoto(null)}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-pine-950 to-stone-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-teal-600/40 space-y-3">
        <div className="flex items-center space-x-2 text-teal-400 font-black text-xs uppercase tracking-wider">
          <AlertCircle className="w-4 h-4" />
          <span>{lang === 'hi' ? 'गाँव की बुनियादी समस्याएं व शिकायत निवारण' : 'Civic Grievance Desk'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {lang === 'hi' ? '🚰 गाँव की समस्या (Civic Issues)' : '🚰 Village Civic Desk'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl font-medium">
          {lang === 'hi'
            ? 'खराब हैंडपंप, ट्रांसफार्मर खराबी, टूटी सड़क व स्वच्छता संबंधी समस्याओं को फोटो सहित दर्ज करें और ग्राम पंचायत तक पहुँचाएँ।'
            : 'Report broken handpumps, power failures, road damage and track department resolution.'}
        </p>

        <div className="pt-2 flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${activeTab === 'feed' ? 'bg-teal-500 text-stone-950' : 'bg-stone-800 text-stone-300'}`}
          >
            📋 {lang === 'hi' ? 'शिकायत सूची' : 'Grievance Feed'}
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${activeTab === 'report' ? 'bg-amber-400 text-stone-950' : 'bg-stone-800 text-stone-300'}`}
          >
            + {lang === 'hi' ? 'नई शिकायत दर्ज करें' : 'Report Issue'}
          </button>
        </div>
      </div>

      {/* Feed */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600" />
              <p className="text-xs text-stone-500">Loading civic reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border-2 border-stone-200 p-8 space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-stone-800">No active civic issues reported</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((r) => (
                <div key={r.id} className="bg-white rounded-3xl p-6 shadow-md border-2 border-stone-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="bg-teal-100 text-teal-900 font-bold text-xs px-2.5 py-1 rounded-lg">
                        {r.category}
                      </span>
                      <span className="text-xs font-bold text-stone-500">{r.department}</span>
                    </div>

                    <h3 className="text-base font-black text-stone-900">{r.title}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">{r.description}</p>

                    {r.photoUrl && (
                      <div
                        onClick={() => setSelectedReportPhoto(r.photoUrl)}
                        className="relative group cursor-pointer border rounded-2xl overflow-hidden max-h-48 mt-2"
                        title="Click to Zoom In/Out"
                      >
                        <img src={r.photoUrl} alt="Defect" className="w-full h-36 object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-xs space-x-1 transition">
                          <Maximize2 className="w-4 h-4" />
                          <span>फोटो ज़ूम करें (Zoom)</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-semibold">📍 {r.villageOrTown || r.district || 'Lucknow'}</span>
                    <button
                      onClick={() => handleUpvote(r.id)}
                      className="flex items-center space-x-1.5 bg-stone-100 hover:bg-teal-50 hover:text-teal-900 text-stone-700 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-stone-200"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{r.upvotes || 1} Upvotes</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Report Form */}
      {activeTab === 'report' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-stone-300 space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h2 className="text-2xl font-black text-stone-900">
              {lang === 'hi' ? 'गाँव की समस्या दर्ज करें' : 'Report Civic Infrastructure Defect'}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Photographic evidence helps expedite government department action.
            </p>
          </div>

          <form onSubmit={handleCreateReport} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="font-bold text-stone-800 block mb-1">समस्या शीर्षक (Issue Title):</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-800 block mb-1">श्रेणी (Category):</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-bold"
                >
                  <option value="WATER_SANITATION">पानी व हैंडपंप (Water / Handpump)</option>
                  <option value="ELECTRICITY">बिजली व ट्रांसफार्मर (Electricity)</option>
                  <option value="INFRASTRUCTURE">सड़क व नाली (Roads & Drainage)</option>
                  <option value="HEALTHCARE">स्वास्थ्य केंद्र (Health Sub-Centre)</option>
                  <option value="EDUCATION">स्कूल भवन (Primary School)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">संबंधित विभाग (Department):</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-800 block mb-1">गाँव (Village):</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  required
                  className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-stone-800 block mb-1">ज़िला (District):</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                  className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">फोटो संलग्न करें (Attach Evidence Photo):</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs" />
              {photoUrl && (
                <img src={photoUrl} alt="Preview" className="w-20 h-20 object-cover rounded-xl mt-2 border" />
              )}
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">विस्तृत विवरण (Description):</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                required
                className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white font-black py-3.5 rounded-2xl shadow-xl transition text-base"
            >
              {isSubmitting ? 'Submitting...' : 'शिकायत दर्ज करें (Submit Civic Grievance)'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
