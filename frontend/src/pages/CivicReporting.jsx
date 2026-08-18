import React, { useEffect, useState, useRef } from 'react';
import { civicApi } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import ImageLightboxModal from '../components/ImageLightboxModal';
import {
  AlertTriangle,
  ThumbsUp,
  MapPin,
  Camera,
  PlusCircle,
  Clock,
  CheckCircle2,
  Building2,
  Loader2,
  X,
  ZoomIn
} from 'lucide-react';

export default function CivicReporting() {
  const { lang } = useLanguage();
  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeZoomImage, setActiveZoomImage] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('WATER_HANDPUMP');
  const [department, setDepartment] = useState('Gram Panchayat & Jal Nigam');
  const [village, setVillage] = useState('Bakshi Ka Talab');
  const [district, setDistrict] = useState('Lucknow');
  const [desc, setDesc] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [photoFileName, setPhotoFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await civicApi.search({ page: 0, size: 20 });
      if (res?.data?.content) setReports(res.data.content);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to report a civic issue.');
      return;
    }
    setIsSubmitting(true);
    try {
      await civicApi.create({
        title,
        category,
        department,
        villageOrTown: village,
        district,
        description: desc,
        photoUrl: photoDataUrl || undefined
      });
      alert('Civic grievance reported and routed to department!');
      setShowModal(false);
      setTitle('');
      setDesc('');
      setPhotoDataUrl('');
      setPhotoFileName('');
      fetchReports();
    } catch (err) {
      alert(err.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await civicApi.upvote(id);
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Zoom Lightbox */}
      {activeZoomImage && (
        <ImageLightboxModal
          src={activeZoomImage}
          alt="Civic defect photo"
          onClose={() => setActiveZoomImage(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>{lang === 'hi' ? 'जन-समस्या एवं बुनियादी ढाँचा' : 'Civic & Infrastructure Reports'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            {lang === 'hi' ? 'गाँव की समस्या (Civic Issue Reporting)' : 'Civic Infrastructure Reporting'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {lang === 'hi'
              ? 'सड़क गड्ढे, खराब हैंडपंप, बिजली फॉल्ट या कचरा समस्या दर्ज करें व विभाग समाधान ट्रैक करें'
              : 'Potholes, broken handpumps, power outages & public works issues with SLA tracking'}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow transition flex items-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{lang === 'hi' ? 'समस्या रिपोर्ट करें' : 'Report Civic Issue'}</span>
        </button>
      </div>

      {/* Reports Feed */}
      {loading ? (
        <div className="py-20 text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-500" />
          <p className="text-xs text-stone-500">Loading civic reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-krishi-500 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">
            {lang === 'hi' ? 'कोई सक्रिय नागरिक शिकायत नहीं है।' : 'No active civic complaints.'}
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-stone-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {report.category}
                  </span>
                  <span className="font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                    {report.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900">{report.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">{report.description}</p>

                {report.photoUrl && (
                  <div
                    onClick={() => setActiveZoomImage(report.photoUrl)}
                    className="relative group cursor-pointer overflow-hidden rounded-xl border border-stone-200"
                    title="Click to Zoom In / Zoom Out"
                  >
                    <img
                      src={report.photoUrl}
                      alt="Defect photo"
                      className="w-full h-36 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <span className="bg-stone-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow">
                        <ZoomIn className="w-4 h-4 text-emerald-400" />
                        <span>🔍 Zoom Photo</span>
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center space-x-2 text-xs text-stone-500">
                  <Building2 className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-semibold">{report.department}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="flex items-center space-x-1 text-stone-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{report.villageOrTown || 'Lucknow'}</span>
                </span>
                <button
                  onClick={() => handleUpvote(report.id)}
                  className="flex items-center space-x-1.5 bg-stone-100 hover:bg-stone-200 px-3 py-1 rounded-lg text-stone-800 font-bold transition"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-rose-600" />
                  <span>{report.upvotes || 1} Verify / Upvote</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Report Civic Issue */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-300 text-xs">
            <div className="flex items-center space-x-2 text-rose-600 font-bold text-sm border-b pb-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Report Village / Infrastructure Defect</span>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Issue Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Village Handpump broken near primary school"
                  required
                  className="w-full p-2 bg-stone-50 rounded-lg border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 bg-stone-50 rounded-lg border border-stone-300"
                  >
                    <option value="WATER_HANDPUMP">💧 Broken Handpump / Nal</option>
                    <option value="POTHOLE_ROAD">🛣️ Pothole / Bad Road</option>
                    <option value="ELECTRICITY_POLE">⚡ Transformer / Wire Fault</option>
                    <option value="DRAINAGE_SEWAGE">🚰 Choked Drain / Naali</option>
                    <option value="GARBAGE">🗑️ Garbage Pile</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Responsible Dept:</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2 bg-stone-50 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Location (Village & District):</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Bakshi Ka Talab, Lucknow"
                  required
                  className="w-full p-2 bg-stone-50 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Description:</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Describe the issue and how many villagers are affected..."
                  rows={3}
                  required
                  className="w-full p-2 bg-stone-50 rounded-lg border border-stone-300"
                />
              </div>

              {/* Direct Local File Attachment in Modal */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {lang === 'hi' ? 'गड्ढे / हैंडपंप की फोटो जोड़ें (Local Photo):' : 'Attach Photo from Device / Storage:'}
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
                    className="w-full p-3 border-2 border-dashed border-stone-300 rounded-xl hover:border-rose-500 bg-stone-50 flex items-center justify-center space-x-2 text-stone-600 font-semibold"
                  >
                    <Camera className="w-4 h-4 text-rose-600" />
                    <span>गैलरी / कैमरे से फोटो चुनें (Choose File)</span>
                  </button>
                ) : (
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-300 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={photoDataUrl}
                        alt="Civic preview"
                        className="w-10 h-10 object-cover rounded-lg border"
                      />
                      <span className="text-xs font-bold text-stone-800 truncate max-w-[200px]">
                        {photoFileName || 'Photo Attached'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-rose-600 text-white font-bold px-4 py-1.5 rounded-lg shadow"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Grievance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
