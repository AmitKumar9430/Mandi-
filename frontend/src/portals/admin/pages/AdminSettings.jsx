import React, { useEffect, useState } from 'react';
import { adminOpsApi } from '../../../shared/api/adminApi';
import { Settings, Shield, Server, CheckCircle2, Lock, Save, Loader2 } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    adminOpsApi.getSettings().then((res) => {
      if (res.data) setSettings(res.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminOpsApi.saveSettings(settings);
      alert('System configuration updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b-2 border-stone-200 pb-4">
        <h1 className="text-2xl font-black text-stone-900">System Settings & Operational Flags</h1>
        <p className="text-xs text-stone-500">
          Control platform-wide policies, AI classification thresholds, and operational passkey constraints.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-pine-700" />
          <p className="text-xs text-stone-500">Loading system parameters...</p>
        </div>
      ) : settings ? (
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Security & Access Box */}
          <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-stone-900 flex items-center space-x-2">
              <Shield className="w-5 h-5 text-pine-700" />
              <span>Admin Authentication & Security Policy</span>
            </h3>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-stone-700 font-bold">Authentication Mode:</span>
                <span className="font-mono text-emerald-800 font-black bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-300">
                  {settings.authPolicy || 'Dual System: EmailJS OTP + Password'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Admin accounts can be authenticated securely via EmailJS 6-digit verification codes or direct encrypted passwords.
              </p>
            </div>
          </div>

          {/* Engine Parameters */}
          <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-stone-900 flex items-center space-x-2">
              <Server className="w-5 h-5 text-pine-700" />
              <span>Platform Parameters</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Max Auto-Dispatch Radius (KM):</label>
                <input
                  type="number"
                  value={settings.maxDispatchRadiusKm || 50}
                  onChange={(e) => setSettings({ ...settings, maxDispatchRadiusKm: parseInt(e.target.value) })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-pine-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">TimeBank Credit Base Rate (₹):</label>
                <input
                  type="number"
                  value={settings.timeBankBaseCreditValue || 100}
                  onChange={(e) => setSettings({ ...settings, timeBankBaseCreditValue: parseInt(e.target.value) })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-pine-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="aiAutoClassify"
                checked={settings.aiAutoClassificationEnabled !== false}
                onChange={(e) => setSettings({ ...settings, aiAutoClassificationEnabled: e.target.checked })}
                className="rounded text-pine-700 focus:ring-pine-600"
              />
              <label htmlFor="aiAutoClassify" className="text-stone-700 font-bold">
                Enable Automated AI Problem Graph Generation on Submission
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="bg-pine-700 hover:bg-pine-800 text-white font-black px-6 py-3 rounded-2xl shadow-xl transition flex items-center space-x-2 text-sm border border-emerald-500"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Updating...' : 'Save System Configuration'}</span>
          </button>
        </form>
      ) : null}
    </div>
  );
}
