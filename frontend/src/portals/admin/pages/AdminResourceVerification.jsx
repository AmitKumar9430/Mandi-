import React, { useEffect, useState } from 'react';
import { adminOpsApi } from '../../../shared/api/adminApi';
import {
  Boxes,
  Check,
  X,
  Trash2,
  Loader2,
  ShieldCheck,
  Truck,
  Tractor
} from 'lucide-react';

export default function AdminResourceVerification() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await adminOpsApi.getResources();
      if (res.data) setResources(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleVerify = async (id) => {
    await adminOpsApi.verifyResource(id);
    fetchResources();
  };

  const handleReject = async (id) => {
    await adminOpsApi.rejectResource(id);
    fetchResources();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Permanently delete this resource from system?')) {
      await adminOpsApi.deleteResource(id);
      fetchResources();
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-stone-200 pb-4">
        <h1 className="text-2xl font-black text-stone-900">Equipment & Provider Verification Pool</h1>
        <p className="text-xs text-stone-500">
          Verify machinery, tractors, harvesters, and emergency service providers before public matching.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-pine-700" />
          <p className="text-xs text-stone-500">Loading resources...</p>
        </div>
      ) : (
        <div className="bg-white border-2 border-stone-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 font-black uppercase border-b border-stone-200">
                <tr>
                  <th className="p-4">Resource Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Pricing</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {resources.map((r) => (
                  <tr key={r.id} className="hover:bg-pine-50/40 transition">
                    <td className="p-4 font-bold text-stone-900">{r.name}</td>
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                        {r.category}
                      </span>
                    </td>
                    <td className="p-4 text-emerald-700 font-bold">
                      ₹{r.costPerUnit || 0} {r.costUnit}
                    </td>
                    <td className="p-4 text-stone-600">{r.villageOrTown || r.district || 'Lucknow'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                        r.verified ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {r.verified ? '✓ VERIFIED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      {!r.verified ? (
                        <button
                          onClick={() => handleVerify(r.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReject(r.id)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-amber-100 text-amber-800 font-bold rounded-lg border border-stone-200"
                        >
                          Revoke
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 bg-stone-100 hover:bg-red-100 text-red-600 rounded-lg border border-stone-200"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
