import React, { useEffect, useState } from 'react';
import { adminOpsApi } from '../../../shared/api/adminApi';
import { ScrollText, ShieldCheck, Clock, Loader2, RefreshCw } from 'lucide-react';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminOpsApi.getAuditLogs();
      if (res.data) setLogs(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b-2 border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900">Immutable Operations Audit Ledger</h1>
          <p className="text-xs text-stone-500">
            Cryptographically timestamped log of all administrator decisions, status overrides, and user state changes.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="p-2.5 bg-white border-2 border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl shadow-sm"
          title="Refresh Audit Logs"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-pine-700" />
          <p className="text-xs text-stone-500">Retrieving audit trail...</p>
        </div>
      ) : (
        <div className="bg-white border-2 border-stone-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 font-black uppercase border-b border-stone-200">
                <tr>
                  <th className="p-4">Action</th>
                  <th className="p-4">Entity</th>
                  <th className="p-4">Performed By</th>
                  <th className="p-4">Details & Remarks</th>
                  <th className="p-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-pine-50/40 transition">
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-800 font-black px-2 py-0.5 rounded border border-emerald-200">
                        {l.action}
                      </span>
                    </td>
                    <td className="p-4 text-stone-800 font-bold">
                      {l.entityType} #{l.entityId}
                    </td>
                    <td className="p-4 text-stone-600">{l.actor}</td>
                    <td className="p-4 text-stone-800 font-sans">{l.details}</td>
                    <td className="p-4 text-right text-stone-500">{new Date(l.timestamp).toLocaleString()}</td>
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
