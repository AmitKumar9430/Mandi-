import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageModalViewer from '../../../components/ImageModalViewer';
import { AlertOctagon, ThumbsUp, MapPin, Loader2, CheckCircle2, ZoomIn } from 'lucide-react';

export default function AdminReportsManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/civic');
      if (res.data?.data?.content) setReports(res.data.data.content);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="space-y-6">
      {/* Lightbox for viewing photos with Zoom In/Out & Pan */}
      <ImageModalViewer
        src={selectedPhoto}
        isOpen={!!selectedPhoto}
        title="Admin Civic Evidence Inspector"
        onClose={() => setSelectedPhoto(null)}
      />

      <div className="border-b-2 border-stone-200 pb-4">
        <h1 className="text-2xl font-black text-stone-900">Civic Infrastructure Reports & Grievances</h1>
        <p className="text-xs text-stone-500">
          Monitor public defect escalations to Jal Nigam, PWD, and Gram Panchayats.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-pine-700" />
          <p className="text-xs text-stone-500">Loading civic grievances...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => (
            <div key={r.id} className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-3 hover:border-emerald-400/60 transition">
              <div className="flex justify-between items-start">
                <span className="bg-teal-50 text-teal-800 font-bold text-xs px-2.5 py-1 rounded-lg border border-teal-200">
                  {r.category}
                </span>
                <span className="text-xs text-stone-500 font-semibold">{r.department}</span>
              </div>
              <h3 className="font-black text-stone-900 text-base">{r.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">{r.description}</p>
              {r.photoUrl && (
                <div
                  onClick={() => setSelectedPhoto(r.photoUrl)}
                  className="relative group cursor-pointer border border-stone-200 rounded-2xl overflow-hidden shadow-sm"
                  title="Click to Zoom In/Out"
                >
                  <img src={r.photoUrl} alt="Evidence" className="w-full h-44 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold space-x-1 transition">
                    <ZoomIn className="w-4 h-4" />
                    <span>Zoom In / Out</span>
                  </div>
                </div>
              )}
              <div className="pt-3 border-t border-stone-100 flex justify-between text-xs text-stone-500">
                <span>📍 {r.villageOrTown || r.district || 'Lucknow'}</span>
                <span className="text-teal-700 font-bold">👍 {r.upvotes || 1} Citizen Upvotes</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
