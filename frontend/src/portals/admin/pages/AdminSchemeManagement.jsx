import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileSpreadsheet, PlusCircle, ExternalLink, Trash2, Loader2 } from 'lucide-react';

export default function AdminSchemeManagement() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/schemes').then(res => {
      const data = res.data?.data;
      const list = data?.content || (Array.isArray(data) ? data : []);
      setSchemes(list);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-stone-200 pb-4">
        <h1 className="text-2xl font-black text-stone-900">Government Welfare Scheme Directory</h1>
        <p className="text-xs text-stone-500">
          Maintain Central & State government schemes, subsidy rules and documentation requirements.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-pine-700" />
          <p className="text-xs text-stone-500">Loading schemes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schemes.map((s) => (
            <div key={s.id} className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-emerald-400/60 transition">
              <div>
                <div className="flex justify-between items-start">
                  <span className="bg-emerald-50 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-200">
                    {s.category}
                  </span>
                  <span className="text-[10px] text-stone-400 font-semibold">{s.sponsoringMinistry}</span>
                </div>
                <h3 className="font-black text-stone-900 text-base mt-2">{s.name}</h3>
                <p className="text-xs text-stone-600 line-clamp-3 mt-1 font-medium">{s.description}</p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
                <span className="text-stone-500 font-bold">{s.targetAudience}</span>
                {s.applicationUrl && (
                  <a href={s.applicationUrl} target="_blank" rel="noreferrer" className="text-pine-700 font-black hover:underline flex items-center space-x-1">
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
