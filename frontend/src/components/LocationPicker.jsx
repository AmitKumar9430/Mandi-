import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import {
  INDIAN_STATES,
  detectExactLocation,
  reverseGeocodeCoordinates,
  normalizeDistrict,
  resolveDistrictState
} from '../shared/utils/locationService';
import {
  MapPin,
  Compass,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Crosshair,
  Building,
  Map as MapIcon,
  Maximize2,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

// Fix default leaflet marker asset paths for bundlers safely
try {
  if (typeof L !== 'undefined' && L?.Icon?.Default?.prototype) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }
} catch (e) {}

// Custom pulsating pinpoint icon getter
const getUserPinIcon = () => {
  try {
    if (typeof L !== 'undefined' && L?.divIcon) {
      return L.divIcon({
        className: 'user-pin-marker',
        html: `
          <div style="position: relative; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background-color: rgba(16, 185, 129, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="background-color: #059669; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; z-index: 2;">
              📍
            </div>
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21]
      });
    }
  } catch (e) {}
  return undefined;
};
const userPinIcon = getUserPinIcon();

// Component to handle smooth flying / panning on coordinate updates
function MapFlyController({ targetCoord, zoomLevel = 15 }) {
  const map = useMap();
  useEffect(() => {
    if (targetCoord && targetCoord[0] && targetCoord[1]) {
      map.flyTo(targetCoord, zoomLevel, {
        duration: 1.2,
        easeLinearity: 0.25
      });
      // Invalidate size to ensure proper rendering inside dynamic containers
      setTimeout(() => map.invalidateSize(), 300);
    }
  }, [targetCoord, zoomLevel, map]);

  return null;
}

// Component to handle map clicks & dragging to pin precise location
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

export default function LocationPicker({
  state,
  setState,
  district,
  setDistrict,
  village,
  setVillage,
  pincode,
  setPincode,
  address,
  setAddress,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  initialState,
  initialDistrict,
  initialVillage,
  initialPincode,
  initialAddress,
  onLocationChange,
  lang = 'hi',
  showAddressField = false
}) {
  // Local state fallbacks for uncontrolled or mixed usage
  const [localState, setLocalState] = useState(state || initialState || 'Uttar Pradesh');
  const [localDistrict, setLocalDistrict] = useState(district || initialDistrict || '');
  const [localVillage, setLocalVillage] = useState(village || initialVillage || '');
  const [localPincode, setLocalPincode] = useState(pincode || initialPincode || '');
  const [localAddress, setLocalAddress] = useState(address || initialAddress || '');
  const [localLatitude, setLocalLatitude] = useState(latitude || (initialDistrict === 'Mohali' ? 30.7716 : 26.8467));
  const [localLongitude, setLocalLongitude] = useState(longitude || (initialDistrict === 'Mohali' ? 76.5683 : 80.9462));

  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionSuccess, setDetectionSuccess] = useState(false);
  const [detectionError, setDetectionError] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Keep local state in sync if parent passes controlled props
  useEffect(() => {
    if (state !== undefined) setLocalState(state);
  }, [state]);

  useEffect(() => {
    if (district !== undefined) setLocalDistrict(district);
  }, [district]);

  useEffect(() => {
    if (village !== undefined) setLocalVillage(village);
  }, [village]);

  useEffect(() => {
    if (pincode !== undefined) setLocalPincode(pincode);
  }, [pincode]);

  useEffect(() => {
    if (address !== undefined) setLocalAddress(address);
  }, [address]);

  useEffect(() => {
    if (latitude !== undefined && latitude !== null) setLocalLatitude(latitude);
  }, [latitude]);

  useEffect(() => {
    if (longitude !== undefined && longitude !== null) setLocalLongitude(longitude);
  }, [longitude]);

  // Safe setter dispatcher
  const updateField = (fieldName, value) => {
    let nextState = localState;
    let nextDistrict = localDistrict;
    let nextVillage = localVillage;
    let nextPincode = localPincode;
    let nextAddress = localAddress;
    let nextLat = localLatitude;
    let nextLon = localLongitude;

    switch (fieldName) {
      case 'state':
        nextState = value;
        setLocalState(value);
        if (typeof setState === 'function') setState(value);
        break;
      case 'district':
        nextDistrict = value;
        setLocalDistrict(value);
        if (typeof setDistrict === 'function') setDistrict(value);
        break;
      case 'village':
        nextVillage = value;
        setLocalVillage(value);
        if (typeof setVillage === 'function') setVillage(value);
        break;
      case 'pincode':
        nextPincode = value;
        setLocalPincode(value);
        if (typeof setPincode === 'function') setPincode(value);
        break;
      case 'address':
        nextAddress = value;
        setLocalAddress(value);
        if (typeof setAddress === 'function') setAddress(value);
        break;
      case 'latitude':
        nextLat = value;
        setLocalLatitude(value);
        if (typeof setLatitude === 'function') setLatitude(value);
        break;
      case 'longitude':
        nextLon = value;
        setLocalLongitude(value);
        if (typeof setLongitude === 'function') setLongitude(value);
        break;
      default:
        break;
    }

    if (typeof onLocationChange === 'function') {
      onLocationChange({
        state: nextState,
        district: nextDistrict,
        villageOrTown: nextVillage,
        pincode: nextPincode,
        address: nextAddress,
        latitude: nextLat,
        longitude: nextLon
      });
    }
  };

  // 1. Direct GPS Location Detection Handler
  const handleDetectLocation = async () => {
    setIsDetecting(true);
    setDetectionError('');
    setDetectionSuccess(false);

    try {
      const loc = await detectExactLocation();
      const st = loc.state || 'Uttar Pradesh';
      const dist = loc.district || 'Lucknow';
      const vill = loc.villageOrTown || '';
      const pin = loc.pincode || '';
      const lat = loc.latitude || 26.8467;
      const lon = loc.longitude || 80.9462;
      const addr = loc.formattedAddress || '';

      setLocalState(st);
      setLocalDistrict(dist);
      setLocalVillage(vill);
      setLocalPincode(pin);
      setLocalLatitude(lat);
      setLocalLongitude(lon);
      if (addr && !localAddress) setLocalAddress(addr);

      // Automatically open map and redirect/fly directly to detected coordinates
      setShowMap(true);

      // Call parent setters safely
      if (typeof setState === 'function') setState(st);
      if (typeof setDistrict === 'function') setDistrict(dist);
      if (typeof setVillage === 'function') setVillage(vill);
      if (typeof setPincode === 'function') setPincode(pin);
      if (typeof setLatitude === 'function') setLatitude(lat);
      if (typeof setLongitude === 'function') setLongitude(lon);
      if (typeof setAddress === 'function' && addr && !address) setAddress(addr);

      if (typeof onLocationChange === 'function') {
        onLocationChange({
          state: st,
          district: dist,
          villageOrTown: vill,
          pincode: pin,
          address: addr || localAddress,
          latitude: lat,
          longitude: lon,
          locationName: vill ? `${vill}, ${dist}` : dist
        });
      }

      setDetectionSuccess(true);
      setTimeout(() => setDetectionSuccess(false), 8000);
    } catch (err) {
      setDetectionError(err.message || 'Unable to detect location. Please select manually below.');
    } finally {
      setIsDetecting(false);
    }
  };

  // 2. Interactive Map Click / Pin Drop Handler
  const handleMapPinDrop = async (lat, lon) => {
    setIsReverseGeocoding(true);
    setLocalLatitude(lat);
    setLocalLongitude(lon);
    if (typeof setLatitude === 'function') setLatitude(lat);
    if (typeof setLongitude === 'function') setLongitude(lon);

    try {
      const geo = await reverseGeocodeCoordinates(lat, lon);
      const st = geo.state || localState;
      const dist = geo.district || localDistrict;
      const vill = geo.villageOrTown || localVillage;
      const pin = geo.pincode || localPincode;
      const addr = geo.formattedAddress || localAddress;

      setLocalState(st);
      setLocalDistrict(dist);
      setLocalVillage(vill);
      setLocalPincode(pin);
      if (addr) setLocalAddress(addr);

      if (typeof setState === 'function') setState(st);
      if (typeof setDistrict === 'function') setDistrict(dist);
      if (typeof setVillage === 'function') setVillage(vill);
      if (typeof setPincode === 'function') setPincode(pin);
      if (typeof setAddress === 'function') setAddress(addr);

      if (typeof onLocationChange === 'function') {
        onLocationChange({
          state: st,
          district: dist,
          villageOrTown: vill,
          pincode: pin,
          address: addr,
          latitude: lat,
          longitude: lon,
          locationName: vill ? `${vill}, ${dist}` : dist
        });
      }
    } catch (err) {
      console.warn('Map reverse geocoding notice:', err);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const handleDistrictInputChange = (e) => {
    const val = e.target.value;
    updateField('district', val);
    if (val.trim().length >= 3) {
      const norm = normalizeDistrict(val);
      const autoState = resolveDistrictState(norm, localState);
      if (autoState && autoState !== localState) {
        updateField('state', autoState);
      }
    }
  };

  const handleDistrictBlur = () => {
    if (localDistrict) {
      const norm = normalizeDistrict(localDistrict);
      updateField('district', norm);
      const autoState = resolveDistrictState(norm, localState);
      if (autoState) {
        updateField('state', autoState);
      }
    }
  };

  const currentMapCenter = [localLatitude || 26.8467, localLongitude || 80.9462];

  return (
    <div className="space-y-4">
      {/* 1. GPS Trigger & Interactive Map Toggle Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-950/90 via-pine-950/90 to-stone-900 rounded-2xl border-2 border-emerald-500/40 text-white shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span className="text-xs font-black uppercase text-emerald-300 tracking-wider">
                {lang === 'hi' ? 'सटीक जीपीएस लोकेशन पहचान' : 'Direct Exact Location Detection'}
              </span>
            </div>
            <p className="text-[11px] text-stone-300">
              {lang === 'hi'
                ? 'अपने मोबाइल या कंप्यूटर जीपीएस से तुरंत अपना राज्य, जिला, गाँव व पिनकोड पहचानें और नक्शे पर देखें।'
                : 'Instantly pinpoint your exact State, District, Village, and Pincode on the live map.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Map Toggle Button */}
            <button
              type="button"
              id="toggle-location-map-btn"
              onClick={() => setShowMap(!showMap)}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition border ${
                showMap
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/50 hover:bg-emerald-500/30'
                  : 'bg-white/10 text-stone-200 border-white/20 hover:bg-white/20'
              }`}
              title={showMap ? 'Hide interactive map' : 'Show interactive map'}
            >
              <MapIcon className="w-4 h-4 text-emerald-400" />
              <span>{showMap ? (lang === 'hi' ? '🗺️ नक्शा छुपाएं' : '🗺️ Hide Map') : (lang === 'hi' ? '🗺️ नक्शा देखें' : '🗺️ View Map')}</span>
              {showMap ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Detect Exact Location GPS Button */}
            <button
              type="button"
              id="detect-exact-gps-btn"
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-pine-600 hover:from-emerald-600 hover:to-pine-700 text-stone-950 font-black text-xs rounded-xl shadow-lg border border-emerald-300 flex items-center justify-center space-x-2 transition transform active:scale-98 flex-shrink-0 disabled:opacity-50"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                  <span>{lang === 'hi' ? 'पहचान रहे हैं...' : 'Detecting GPS...'}</span>
                </>
              ) : (
                <>
                  <Crosshair className="w-4 h-4 text-stone-950" />
                  <span>{lang === 'hi' ? '📍 मेरी सटीक लोकेशन पहचानें' : '📍 Detect My Location'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success / Error Notification */}
        {detectionSuccess && (
          <div className="p-3 bg-emerald-900/80 rounded-xl border-2 border-emerald-400 text-xs text-emerald-100 flex flex-wrap items-center justify-between gap-2 animate-fadeIn font-semibold shadow-inner">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                {lang === 'hi'
                  ? `सटीक लोकेशन प्राप्त: ${localVillage ? localVillage + ', ' : ''}${localDistrict}, ${localState}${localPincode ? ' • पिनकोड: ' + localPincode : ''}`
                  : `Exact Location: ${localVillage ? localVillage + ', ' : ''}${localDistrict}, ${localState}${localPincode ? ' • PIN: ' + localPincode : ''}`}
              </span>
            </div>
            {localLatitude && localLongitude && (
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                GPS: {Number(localLatitude).toFixed(4)}, {Number(localLongitude).toFixed(4)}
              </span>
            )}
          </div>
        )}

        {detectionError && (
          <div className="p-2.5 bg-red-950/60 rounded-xl border border-red-400 text-[11px] text-red-200 flex items-center space-x-2 animate-fadeIn font-semibold">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{detectionError}</span>
          </div>
        )}
      </div>

      {/* 2. Interactive Live Map Section (Toggled or auto-opened upon GPS click) */}
      {showMap && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500/40 overflow-hidden shadow-lg animate-fadeIn space-y-0">
          <div className="bg-emerald-950 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs border-b border-emerald-800">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-emerald-200">
                {lang === 'hi'
                  ? '📍 लाइव लोकेशन मैप (नक्शे पर कहीं भी क्लिक करके सटीक खेत या मकान चुनें)'
                  : '📍 Live Interactive Map (Click anywhere to pinpoint exact farmland/house)'}
              </span>
            </div>

            {isReverseGeocoding && (
              <span className="flex items-center space-x-1 text-[11px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded font-mono">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Updating address...</span>
              </span>
            )}
          </div>

          <div className="relative w-full h-[320px] sm:h-[360px]">
            <MapContainer
              center={currentMapCenter}
              zoom={15}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%', zIndex: 1 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Flies to updated coordinates */}
              <MapFlyController targetCoord={currentMapCenter} zoomLevel={15} />

              {/* Captures clicks on map */}
              <MapClickHandler onMapClick={handleMapPinDrop} />

              {/* Pulsing Pin Marker */}
              {localLatitude && localLongitude && (
                <>
                  <Marker position={currentMapCenter} icon={userPinIcon}>
                    <Popup className="custom-leaflet-popup">
                      <div className="p-1 text-xs space-y-1 font-sans">
                        <p className="font-bold text-emerald-800">
                          {localVillage || localDistrict}, {localState}
                        </p>
                        {localPincode && <p className="text-[11px] text-stone-600 font-mono">PIN: {localPincode}</p>}
                        <p className="text-[10px] text-stone-500">
                          Lat: {Number(localLatitude).toFixed(4)}, Lon: {Number(localLongitude).toFixed(4)}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                  <Circle
                    center={currentMapCenter}
                    radius={150}
                    pathOptions={{
                      color: '#10b981',
                      fillColor: '#10b981',
                      fillOpacity: 0.15,
                      weight: 1.5
                    }}
                  />
                </>
              )}
            </MapContainer>

            {/* Floating Re-center GPS button inside Map */}
            <button
              type="button"
              onClick={handleDetectLocation}
              className="absolute bottom-4 right-4 z-[400] bg-white/95 hover:bg-white text-stone-900 font-bold text-xs px-3.5 py-2 rounded-xl shadow-xl border border-stone-300 flex items-center space-x-1.5 transition active:scale-95 backdrop-blur-sm"
              title="Re-center on detected GPS"
            >
              <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'hi' ? '🎯 जीपीएस केंद्र' : '🎯 Center GPS'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Manual Location Form Controls */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Building className="w-4 h-4 text-stone-500" />
          <span className="text-xs font-black text-stone-900 uppercase">
            {lang === 'hi' ? 'स्थान विवरण / मैन्युअल चयन (Manual Location Selection)' : 'Manual Location Details'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* State Selector */}
          <div>
            <label htmlFor="location-state-select" className="font-bold text-stone-700 text-xs block mb-1">
              राज्य (State / Union Territory)*:
            </label>
            <select
              id="location-state-select"
              name="locationState"
              value={localState || 'Uttar Pradesh'}
              onChange={(e) => updateField('state', e.target.value)}
              required
              className="w-full p-2.5 bg-stone-50 border-2 border-stone-300 rounded-xl text-xs text-stone-900 font-bold focus:ring-2 focus:ring-pine-600 focus:outline-none"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* District Input */}
          <div>
            <label htmlFor="location-district-input" className="font-bold text-stone-700 text-xs block mb-1">
              जिला (District / City)*:
            </label>
            <input
              type="text"
              id="location-district-input"
              name="locationDistrict"
              value={localDistrict}
              onChange={handleDistrictInputChange}
              onBlur={handleDistrictBlur}
              placeholder="e.g. Gaya, Mohali, Lucknow, Patna, Jaipur"
              required
              className="w-full p-2.5 bg-stone-50 border-2 border-stone-300 rounded-xl text-xs text-stone-900 font-bold focus:ring-2 focus:ring-pine-600 focus:outline-none"
            />
          </div>

          {/* Village / Town Input */}
          <div>
            <label htmlFor="location-village-input" className="font-bold text-stone-700 text-xs block mb-1">
              गाँव / कस्बा / क्षेत्र (Village / Town / Locality):
            </label>
            <input
              type="text"
              id="location-village-input"
              name="locationVillage"
              value={localVillage}
              onChange={(e) => updateField('village', e.target.value)}
              placeholder="e.g. Bodh Gaya / Kamlapur / Sector 62 / Gharuan"
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
            />
          </div>

          {/* Pincode Input */}
          <div>
            <label htmlFor="location-pincode-input" className="font-bold text-stone-700 text-xs block mb-1">
              पिनकोड (Pincode - 6 Digits):
            </label>
            <input
              type="text"
              id="location-pincode-input"
              name="locationPincode"
              value={localPincode}
              onChange={(e) => updateField('pincode', e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="e.g. 140413 / 823001"
              maxLength={6}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 font-mono"
            />
          </div>
        </div>

        {/* Optional Full Address Field */}
        {showAddressField && (
          <div>
            <label htmlFor="location-address-input" className="font-bold text-stone-700 text-xs block mb-1">
              पूरा पता व लैंडमार्क (Detailed Address & Landmark):
            </label>
            <input
              type="text"
              id="location-address-input"
              name="locationAddress"
              value={localAddress}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="e.g. Near Panchayat Bhavan, Main Road"
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
            />
          </div>
        )}
      </div>
    </div>
  );
}
