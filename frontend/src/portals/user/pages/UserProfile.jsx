import React, { useState } from 'react';
import { useUserAuth } from '../../../auth/UserAuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import LocationPicker from '../../../components/LocationPicker';
import {
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Languages,
  LogOut,
  Edit,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function UserProfile() {
  const { user, logout } = useUserAuth();
  const { lang, toggleLanguage } = useLanguage();

  const [isEditingLoc, setIsEditingLoc] = useState(false);
  const [state, setState] = useState(user?.profile?.state || 'Uttar Pradesh');
  const [district, setDistrict] = useState(user?.profile?.district || 'Lucknow');
  const [village, setVillage] = useState(user?.profile?.villageOrTown || '');
  const [pincode, setPincode] = useState(user?.profile?.pincode || '');
  const [lat, setLat] = useState(user?.profile?.latitude || null);
  const [lon, setLon] = useState(user?.profile?.longitude || null);

  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user) return null;

  const handleSaveLocation = () => {
    // In local state or API
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditingLoc(false);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-stone-200 space-y-6">
        <div className="flex items-center space-x-4 border-b border-stone-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-pine-700 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-emerald-400">
            {user.fullName ? user.fullName[0] : 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-stone-900">{user.fullName || 'Citizen'}</h1>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 inline-flex items-center space-x-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>VERIFIED CITIZEN</span>
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
            <span className="text-stone-500 font-bold flex items-center space-x-2">
              <Phone className="w-4 h-4 text-pine-700" />
              <span>{lang === 'hi' ? 'मोबाइल नंबर (Phone):' : 'Phone Number:'}</span>
            </span>
            <span className="font-black text-stone-900 font-mono">{user.phone}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
            <span className="text-stone-500 font-bold flex items-center space-x-2">
              <Mail className="w-4 h-4 text-pine-700" />
              <span>{lang === 'hi' ? 'ईमेल (Email):' : 'Email:'}</span>
            </span>
            <span className="font-semibold text-stone-900">{user.email || 'Not provided'}</span>
          </div>

          {/* Location Information Card */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-stone-700 font-black flex items-center space-x-2 text-xs">
                <MapPin className="w-4 h-4 text-pine-700" />
                <span>{lang === 'hi' ? 'स्थान विवरण (Location Passport)' : 'Location Passport'}</span>
              </span>
              <button
                onClick={() => setIsEditingLoc(!isEditingLoc)}
                className="text-xs font-black text-pine-800 hover:text-pine-900 flex items-center space-x-1 bg-white px-2.5 py-1 rounded-lg border border-stone-300 shadow-xs"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>{isEditingLoc ? (lang === 'hi' ? 'रद्द करें' : 'Cancel') : (lang === 'hi' ? 'लोकेशन बदलें' : 'Update Location')}</span>
              </button>
            </div>

            {!isEditingLoc ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold block uppercase">State</span>
                  <span className="font-black text-stone-900 text-xs">{state}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold block uppercase">District</span>
                  <span className="font-black text-stone-900 text-xs">{district}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold block uppercase">Village/Town</span>
                  <span className="font-bold text-stone-900 text-xs">{village || '—'}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold block uppercase">Pincode</span>
                  <span className="font-bold font-mono text-stone-900 text-xs">{pincode || '—'}</span>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-2xl border border-stone-300 space-y-4 animate-fadeIn">
                <LocationPicker
                  state={state}
                  setState={setState}
                  district={district}
                  setDistrict={setDistrict}
                  village={village}
                  setVillage={setVillage}
                  pincode={pincode}
                  setPincode={setPincode}
                  latitude={lat}
                  setLatitude={setLat}
                  longitude={lon}
                  setLongitude={setLon}
                  lang={lang}
                />
                <div className="flex justify-end pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={handleSaveLocation}
                    className="px-4 py-2 bg-pine-800 hover:bg-pine-900 text-white font-black text-xs rounded-xl shadow flex items-center space-x-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'लोकेशन सहेजें' : 'Save Location'}</span>
                  </button>
                </div>
              </div>
            )}

            {saveSuccess && (
              <div className="p-2 bg-emerald-100 text-emerald-800 text-xs rounded-xl border border-emerald-300 flex items-center space-x-1.5 font-bold animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'hi' ? 'लोकेशन सफलतापूर्वक अपडेट की गई!' : 'Location updated successfully!'}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
            <span className="text-stone-500 font-bold flex items-center space-x-2">
              <User className="w-4 h-4 text-pine-700" />
              <span>Assigned Roles:</span>
            </span>
            <div className="flex items-center space-x-1">
              {user.roles?.map((r, i) => (
                <span key={i} className="text-[10px] font-bold bg-pine-100 text-pine-900 px-2 py-0.5 rounded">
                  {r.replace('ROLE_', '')}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1.5 text-xs font-bold text-pine-800 bg-pine-50 hover:bg-pine-100 px-4 py-2 rounded-xl transition"
          >
            <Languages className="w-4 h-4" />
            <span>{lang === 'hi' ? 'Switch to English' : 'हिन्दी में बदलें'}</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center space-x-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
