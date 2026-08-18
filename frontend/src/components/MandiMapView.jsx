import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import {
  MapPin,
  Phone,
  ShieldCheck,
  FileText,
  ArrowRight,
  Navigation,
  Loader2,
  Building2,
  Tractor,
  Ambulance,
  Sparkles,
  Layers
} from 'lucide-react';

// Fix leaflet default marker icons safely in Vite/Webpack builds
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

// Custom colored div markers
const createCustomIcon = (color, emoji = '', size = 26) => {
  try {
    if (typeof L !== 'undefined' && L?.divIcon) {
      return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; font-size: ${size > 26 ? '14px' : '11px'}; color: white; font-weight: bold;">${emoji}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });
    }
  } catch (e) {}
  return undefined;
};

const problemIcon = createCustomIcon('#e11d48', '⚠️', 26);
const resourceIcon = createCustomIcon('#10b981', '🌾', 26);
const blockIcon = createCustomIcon('#4f46e5', '🏛️', 32);
const getUserLocIcon = () => {
  try {
    if (typeof L !== 'undefined' && L?.divIcon) {
      return L.divIcon({
        className: 'user-loc-icon',
        html: `<div class="relative flex items-center justify-center">
          <div style="background-color: #0284c7; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 12px #38bdf8; z-index: 2;"></div>
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background-color: rgba(56, 189, 248, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        </div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });
    }
  } catch (e) {}
  return undefined;
};
const userLocationIcon = getUserLocIcon();

// Helper component to handle flying the map smoothly
function MapFlyController({ targetCoord, zoomLevel }) {
  const map = useMap();
  useEffect(() => {
    if (targetCoord) {
      map.flyTo(targetCoord, zoomLevel || 13, { duration: 1.4, easeLinearity: 0.25 });
    }
  }, [targetCoord, zoomLevel, map]);
  return null;
}

export const DISTRICT_BLOCKS_DATA = [
  {
    id: 'blk-malihabad',
    name: 'Malihabad (मलिहाबाद)',
    district: 'Lucknow',
    latitude: 26.9200,
    longitude: 80.7100,
    headquarters: 'Malihabad Tehsil HQ',
    kisanCenter: 'Mandi Agro Center, Malihabad Main Road',
    phone: '0522-297123',
    activeProblems: 3,
    cropsForSale: 14,
    tractorsAvailable: 8,
    emergencyAmbulance: '108 (Malihabad CHC)',
    description: 'Renowned mango and horticulture cluster with active tractor pools.'
  },
  {
    id: 'blk-bkt',
    name: 'Bakshi Ka Talab - BKT (बक्शी का तालाब)',
    district: 'Lucknow',
    latitude: 27.0100,
    longitude: 80.9300,
    headquarters: 'BKT Market, Sitapur Highway',
    kisanCenter: 'BKT Co-Operative Kisan Seva Kendra',
    phone: '0522-284560',
    activeProblems: 2,
    cropsForSale: 21,
    tractorsAvailable: 12,
    emergencyAmbulance: '108 (BKT Rural Hospital)',
    description: 'Dairy, pulses and seasonal vegetable cultivation corridor.'
  },
  {
    id: 'blk-mohanlalganj',
    name: 'Mohanlalganj (मोहनलालगंज)',
    district: 'Lucknow',
    latitude: 26.6800,
    longitude: 80.9800,
    headquarters: 'Mohanlalganj Tehsil Compound',
    kisanCenter: 'Kisan Kalyan Kendra, Raebareli Road',
    phone: '0522-273114',
    activeProblems: 4,
    cropsForSale: 18,
    tractorsAvailable: 9,
    emergencyAmbulance: '108 (Mohanlalganj CHC)',
    description: 'Paddy, wheat storage silos and major artisan cluster.'
  },
  {
    id: 'blk-kakori',
    name: 'Kakori (काकोरी)',
    district: 'Lucknow',
    latitude: 26.8800,
    longitude: 80.7900,
    headquarters: 'Kakori Block Parishad',
    kisanCenter: 'Kakori Rural Seva & Craft Hub',
    phone: '0522-289301',
    activeProblems: 1,
    cropsForSale: 9,
    tractorsAvailable: 6,
    emergencyAmbulance: '108 (Kakori Health Post)',
    description: 'Horticulture, guava groves & handloom cooperative.'
  },
  {
    id: 'blk-sarojini',
    name: 'Sarojini Nagar (सरोजिनी नगर)',
    district: 'Lucknow',
    latitude: 26.7500,
    longitude: 80.8700,
    headquarters: 'Sarojini Nagar Block HQ, Kanpur Road',
    kisanCenter: 'Krishi Vigyan Kendra (KVK), Sarojini Nagar',
    phone: '0522-243289',
    activeProblems: 3,
    cropsForSale: 11,
    tractorsAvailable: 7,
    emergencyAmbulance: '108 (Sarojini Nagar CHC)',
    description: 'Industrial-agricultural logistics, cold storages & seeds.'
  },
  {
    id: 'blk-chinhat',
    name: 'Chinhat (चिनहट)',
    district: 'Lucknow',
    latitude: 26.8900,
    longitude: 81.0400,
    headquarters: 'Chinhat Block Office, Faizabad Road',
    kisanCenter: 'Chinhat Gram Udyog & Kisan Hub',
    phone: '0522-281200',
    activeProblems: 5,
    cropsForSale: 7,
    tractorsAvailable: 5,
    emergencyAmbulance: '108 (Chinhat PHC)',
    description: 'Pottery, floriculture, vegetable market and wage workers.'
  },
  {
    id: 'blk-gosainganj',
    name: 'Gosainganj (गोसाईंगंज)',
    district: 'Lucknow',
    latitude: 26.7700,
    longitude: 81.1200,
    headquarters: 'Gosainganj Town Block Office',
    kisanCenter: 'Gosainganj Kisan Mandi Desk',
    phone: '0522-291443',
    activeProblems: 2,
    cropsForSale: 16,
    tractorsAvailable: 8,
    emergencyAmbulance: '108 (Gosainganj CHC)',
    description: 'Sugarcane, mustard, organic farming and cattle market.'
  },
  {
    id: 'blk-itaunja',
    name: 'Itaunja & Mahona (इटौंजा / महोना)',
    district: 'Lucknow',
    latitude: 27.0800,
    longitude: 80.9100,
    headquarters: 'Itaunja Rural Sub-Center',
    kisanCenter: 'Itaunja Agritech & Irrigation Point',
    phone: '0522-284990',
    activeProblems: 2,
    cropsForSale: 13,
    tractorsAvailable: 6,
    emergencyAmbulance: '108 (Itaunja PHC)',
    description: 'Canal irrigation zone, tube-wells and fertilizer distribution.'
  },
  {
    id: 'blk-barabanki',
    name: 'Nawabganj / Barabanki (नवाबगंज - बाराबंकी)',
    district: 'Barabanki',
    latitude: 26.9300,
    longitude: 81.1800,
    headquarters: 'Barabanki Mandi Samiti',
    kisanCenter: 'Barabanki Central Kisan & Weaver Hub',
    phone: '05248-222340',
    activeProblems: 4,
    cropsForSale: 24,
    tractorsAvailable: 15,
    emergencyAmbulance: '108 (Barabanki District Hospital)',
    description: 'Regional grain mandi, mentha oil and handloom hub.'
  }
];

export default function MandiMapView({
  problems = [],
  resources = [],
  selectedTarget = null,
  onLocationUpdate = null,
  height = '560px'
}) {
  const defaultCenter = [26.8467, 80.9462]; // Lucknow / Central UP region
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [flyTarget, setFlyTarget] = useState(null);
  const [flyZoom, setFlyZoom] = useState(11);
  const [statusNotice, setStatusNotice] = useState('');
  const [filterLayer, setFilterLayer] = useState('ALL'); // ALL, BLOCKS, PROBLEMS, RESOURCES

  // Sync selected external target (e.g. from block list)
  useEffect(() => {
    if (selectedTarget && selectedTarget.latitude && selectedTarget.longitude) {
      setFlyTarget([selectedTarget.latitude, selectedTarget.longitude]);
      setFlyZoom(13);
    }
  }, [selectedTarget]);

  // Current Location Geolocation handler
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setStatusNotice('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setStatusNotice('Detecting your live GPS location...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setFlyTarget(coords);
        setFlyZoom(14);
        setLocating(false);
        setStatusNotice(`Location found: ${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`);
        
        if (onLocationUpdate) {
          onLocationUpdate({ latitude: coords[0], longitude: coords[1], accuracy: pos.coords.accuracy });
        }

        setTimeout(() => setStatusNotice(''), 4000);
      },
      (err) => {
        setLocating(false);
        console.warn('Geolocation error:', err);
        setStatusNotice('Could not get GPS location. Showing district center.');
        setTimeout(() => setStatusNotice(''), 4000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div style={{ height }} className="w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-stone-300 relative z-10 flex flex-col">
      
      {/* Map Layer Filter Top Bar */}
      <div className="bg-stone-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 text-xs z-[1000]">
        <div className="flex items-center space-x-2 font-bold">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Live Map Layers:</span>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto">
          <button
            onClick={() => setFilterLayer('ALL')}
            className={`px-3 py-1 rounded-xl font-bold transition text-[11px] ${
              filterLayer === 'ALL' ? 'bg-pine-600 text-white shadow' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            🌟 All ({DISTRICT_BLOCKS_DATA.length + problems.length + resources.length})
          </button>
          <button
            onClick={() => setFilterLayer('BLOCKS')}
            className={`px-3 py-1 rounded-xl font-bold transition text-[11px] flex items-center space-x-1 ${
              filterLayer === 'BLOCKS' ? 'bg-indigo-600 text-white shadow' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <span>🏛️ District Blocks ({DISTRICT_BLOCKS_DATA.length})</span>
          </button>
          <button
            onClick={() => setFilterLayer('PROBLEMS')}
            className={`px-3 py-1 rounded-xl font-bold transition text-[11px] flex items-center space-x-1 ${
              filterLayer === 'PROBLEMS' ? 'bg-rose-600 text-white shadow' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <span>⚠️ Problems ({problems.length})</span>
          </button>
          <button
            onClick={() => setFilterLayer('RESOURCES')}
            className={`px-3 py-1 rounded-xl font-bold transition text-[11px] flex items-center space-x-1 ${
              filterLayer === 'RESOURCES' ? 'bg-emerald-600 text-white shadow' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <span>🌾 Resources ({resources.length})</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map */}
      <div className="relative flex-1 w-full h-full">
        <MapContainer
          center={defaultCenter}
          zoom={11}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapFlyController targetCoord={flyTarget} zoomLevel={flyZoom} />

          {/* User Live GPS Marker & Pulse Circle */}
          {userLocation && (
            <>
              <Circle
                center={userLocation}
                radius={800}
                pathOptions={{ color: '#0284c7', fillColor: '#38bdf8', fillOpacity: 0.2 }}
              />
              <Marker position={userLocation} icon={userLocationIcon}>
                <Popup>
                  <div className="p-1 space-y-1 text-xs text-stone-900">
                    <span className="font-black text-sky-700 block">📍 You Are Here (आपका स्थान)</span>
                    <p className="text-[11px] text-stone-600">
                      Live GPS Coordinates: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            </>
          )}

          {/* District Blocks Layer */}
          {(filterLayer === 'ALL' || filterLayer === 'BLOCKS') &&
            DISTRICT_BLOCKS_DATA.map((block) => (
              <Marker
                key={block.id}
                position={[block.latitude, block.longitude]}
                icon={blockIcon}
              >
                <Popup>
                  <div className="p-1.5 space-y-2 text-xs text-stone-900 max-w-[260px]">
                    <div className="flex items-center justify-between border-b border-indigo-100 pb-1">
                      <span className="bg-indigo-100 text-indigo-900 font-black text-[10px] px-2 py-0.5 rounded-md">
                        {block.district} Block
                      </span>
                      <span className="text-[10px] text-stone-500 font-bold">🏛️ HQ</span>
                    </div>

                    <div>
                      <h4 className="font-black text-sm text-stone-900">{block.name}</h4>
                      <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">{block.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 py-1 text-[11px]">
                      <div className="bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                        <span className="text-[10px] text-amber-900 font-bold block">🌾 Crops for Sale</span>
                        <strong className="text-amber-950 font-black">{block.cropsForSale} Listings</strong>
                      </div>
                      <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                        <span className="text-[10px] text-emerald-900 font-bold block">🚜 Tractors</span>
                        <strong className="text-emerald-950 font-black">{block.tractorsAvailable} Ready</strong>
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-700 bg-stone-50 p-2 rounded-xl border border-stone-200 space-y-1">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-pine-600 flex-shrink-0" />
                        <span className="font-bold">{block.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-rose-700 font-bold">
                        <Ambulance className="w-3 h-3 flex-shrink-0" />
                        <span>{block.emergencyAmbulance}</span>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-rose-600 font-bold">
                        ⚠️ {block.activeProblems} Open Issues
                      </span>
                      <Link
                        to="/user/agriculture"
                        className="text-pine-700 font-black hover:underline text-[11px] flex items-center space-x-0.5"
                      >
                        <span>View Produce</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* Active Problems Layer */}
          {(filterLayer === 'ALL' || filterLayer === 'PROBLEMS') &&
            problems.map((p) => {
              if (!p.latitude || !p.longitude) return null;
              return (
                <React.Fragment key={`prob-${p.id}`}>
                  <Circle
                    center={[p.latitude, p.longitude]}
                    radius={500}
                    pathOptions={{ color: '#e11d48', fillColor: '#f43f5e', fillOpacity: 0.15 }}
                  />
                  <Marker position={[p.latitude, p.longitude]} icon={problemIcon}>
                    <Popup>
                      <div className="p-1 space-y-1.5 text-xs text-stone-900">
                        <div className="flex items-center space-x-1.5 font-bold text-rose-600">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{p.passportCode || `MDI-2026-${p.id}`}</span>
                        </div>
                        <h4 className="font-bold text-stone-900 leading-tight">{p.title}</h4>
                        <p className="text-stone-600 text-[11px] line-clamp-2">{p.rawDescription}</p>
                        <div className="pt-1 border-t border-stone-200 flex justify-between items-center">
                          <span className="text-[10px] font-semibold uppercase bg-stone-100 px-1.5 py-0.5 rounded">
                            {p.category}
                          </span>
                          <Link
                            to={`/user/problems/${p.id}`}
                            className="text-pine-700 font-bold hover:underline flex items-center space-x-0.5"
                          >
                            <span>View Passport</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                </React.Fragment>
              );
            })}

          {/* Resources Layer */}
          {(filterLayer === 'ALL' || filterLayer === 'RESOURCES') &&
            resources.map((r) => {
              if (!r.latitude || !r.longitude) return null;
              return (
                <Marker key={`res-${r.id}`} position={[r.latitude, r.longitude]} icon={resourceIcon}>
                  <Popup>
                    <div className="p-1 space-y-1 text-xs text-stone-900">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                        {r.category || 'COMMUNITY'}
                      </span>
                      <h4 className="font-bold text-stone-900">{r.name}</h4>
                      <p className="text-stone-600 text-[11px]">{r.description}</p>
                      {r.contactPhone && (
                        <div className="text-[11px] font-semibold text-stone-800 flex items-center space-x-1 pt-1">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{r.contactPhone}</span>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>

        {/* Status Toast Alert */}
        {statusNotice && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-stone-950/90 text-emerald-300 font-bold text-xs px-4 py-2 rounded-2xl shadow-2xl border border-emerald-500/50 z-[1000] backdrop-blur animate-fadeIn flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{statusNotice}</span>
          </div>
        )}

        {/* 📍 CURRENT LOCATION BUTTON AT THE RIGHT BOTTOM */}
        <div className="absolute bottom-5 right-5 z-[1000] flex flex-col items-end space-y-2">
          <button
            onClick={handleLocateMe}
            disabled={locating}
            className="group bg-gradient-to-r from-pine-700 via-pine-800 to-pine-900 hover:from-pine-600 hover:to-pine-700 text-white font-black px-4 sm:px-5 py-3 rounded-2xl shadow-2xl border-2 border-emerald-400 flex items-center space-x-2.5 transition transform hover:scale-105 active:scale-95 text-xs sm:text-sm disabled:opacity-50"
            title="Locate my live position on GPS map"
          >
            {locating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-emerald-300" />
                <span>GPS डिटेक्ट हो रहा है...</span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping group-hover:bg-emerald-300" />
                <Navigation className="w-4 h-4 text-emerald-300 transform group-hover:rotate-45 transition-transform" />
                <span className="font-extrabold tracking-wide">📍 Current Location (मेरा स्थान)</span>
              </>
            )}
          </button>
        </div>

        {/* Map Legend Overlay at Bottom Left */}
        <div className="absolute bottom-5 left-5 bg-stone-950/90 text-white backdrop-blur px-3.5 py-2.5 rounded-2xl text-[11px] space-y-1.5 z-[1000] border border-stone-700 shadow-xl hidden sm:block">
          <div className="text-[10px] font-black uppercase text-stone-400 tracking-wider">Map Legend</div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500 flex items-center justify-center text-[8px]">🏛️</span>
            <span className="font-semibold text-stone-200">District Blocks (प्रशासनिक ब्लॉक)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-rose-600" />
            <span className="font-semibold text-stone-200">Active Problems (समस्याएं)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="font-semibold text-stone-200">Kisan & Community Resources</span>
          </div>
        </div>
      </div>
    </div>
  );
}
