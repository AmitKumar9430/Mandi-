import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, AlertTriangle, XCircle, Trash2, Eye } from 'lucide-react';

export default function AdminModeration() {
  const [flaggedQueue, setFlaggedQueue] = useState([
    { id: 1, type: 'CROP_LISTING', reason: 'Abnormal price reporting (₹15,000/Qtl)', submittedBy: 'System Auto-Guard', entityId: 'CRP-108', status: 'PENDING' },
    { id: 2, type: 'CIVIC_REPORT', reason: 'Duplicate duplicate location entry', submittedBy: 'Community Upvote Sentinel', entityId: 'CVC-402', status: 'PENDING' }
  ]);

  const handleDismiss = (id) => {
    setFlaggedQueue(flaggedQueue.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-stone-200 pb-4">
        <h1 className="text-2xl font-black text-stone-900">Automated Moderation & Content Sentinel</h1>
        <p className="text-xs text-stone-500">
          Review automated safety flags, spam detection alerts and anomalous marketplace listings.
        </p>
      </div>

      {flaggedQueue.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border-2 border-stone-200 shadow-sm p-8 space-y-2">
          <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-base font-bold text-stone-900">All queues cleared</h3>
          <p className="text-xs text-stone-500">No flagged listings or policy violations require moderation.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {flaggedQueue.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="bg-red-50 text-red-700 text-[10px] font-black px-2 py-0.5 rounded border border-red-200">
                    FLAGGED {item.type}
                  </span>
                  <span className="text-xs font-mono text-stone-500 font-bold">{item.entityId}</span>
                </div>
                <h4 className="text-sm font-bold text-stone-900">{item.reason}</h4>
                <p className="text-[11px] text-stone-500">Triggered by: {item.submittedBy}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDismiss(item.id)}
                  className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200"
                >
                  Approve & Clear
                </button>
                <button
                  onClick={() => handleDismiss(item.id)}
                  className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200"
                >
                  Remove Content
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
