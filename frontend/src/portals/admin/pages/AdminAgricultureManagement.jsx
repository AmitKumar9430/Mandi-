import React, { useEffect, useState } from 'react';
import { adminOpsApi } from '../../../shared/api/adminApi';
import { Sprout, Trash2, Loader2, DollarSign } from 'lucide-react';

export default function AdminAgricultureManagement() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const res = await adminOpsApi.getCrops();
      if (res.data) setCrops(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this crop listing?')) {
      await adminOpsApi.deleteCrop(id);
      fetchCrops();
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-stone-200 pb-4">
        <h1 className="text-2xl font-black text-stone-900">Kisan Agriculture Hub & Produce Oversight</h1>
        <p className="text-xs text-stone-500">
          Moderate farmer grain listings, market prices, and buyer bids across districts.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-pine-700" />
          <p className="text-xs text-stone-500">Loading crops...</p>
        </div>
      ) : (
        <div className="bg-white border-2 border-stone-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 font-black uppercase border-b border-stone-200">
                <tr>
                  <th className="p-4">Produce</th>
                  <th className="p-4">Variety</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Expected Price</th>
                  <th className="p-4">Location</th>
                  <th className="p-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {crops.map((c) => (
                  <tr key={c.id} className="hover:bg-pine-50/40 transition">
                    <td className="p-4 font-bold text-stone-900">{c.cropName}</td>
                    <td className="p-4 text-stone-500">{c.variety || 'Standard'}</td>
                    <td className="p-4 font-bold text-stone-800">{c.quantityQuintals} Quintals</td>
                    <td className="p-4 font-black text-emerald-700">₹{c.expectedPricePerQuintal} / Qtl</td>
                    <td className="p-4 text-stone-600">{c.villageOrTown || c.district || 'Lucknow'}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 bg-stone-100 hover:bg-red-100 text-red-600 rounded-lg border border-stone-200"
                        title="Delete listing"
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
