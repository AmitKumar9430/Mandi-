// Indian States and Union Territories (36 All States & UTs)
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

// District -> State Knowledge Map
const DISTRICT_TO_STATE = {
  // Punjab
  mohali: 'Punjab',
  'sas nagar': 'Punjab',
  's.a.s nagar': 'Punjab',
  'sahibzada ajit singh nagar': 'Punjab',
  kharar: 'Punjab',
  gharuan: 'Punjab',
  kurali: 'Punjab',
  derabassi: 'Punjab',
  'dera bassi': 'Punjab',
  zirkapur: 'Punjab',
  zirakpur: 'Punjab',
  ludhiana: 'Punjab',
  amritsar: 'Punjab',
  jalandhar: 'Punjab',
  patiala: 'Punjab',
  bathinda: 'Punjab',
  hoshiarpur: 'Punjab',
  pathankot: 'Punjab',
  moga: 'Punjab',
  batala: 'Punjab',
  abohar: 'Punjab',
  malerkotla: 'Punjab',
  khanna: 'Punjab',
  phagwara: 'Punjab',
  muktsar: 'Punjab',
  barnala: 'Punjab',
  firozpur: 'Punjab',
  kapurthala: 'Punjab',
  sangrur: 'Punjab',
  fazilka: 'Punjab',
  gurdaspur: 'Punjab',
  'fatehgarh sahib': 'Punjab',
  faridkot: 'Punjab',
  mansa: 'Punjab',
  rupnagar: 'Punjab',
  ropar: 'Punjab',
  nawanshahr: 'Punjab',
  'tarn taran': 'Punjab',

  // Bihar
  gaya: 'Bihar',
  'bodh gaya': 'Bihar',
  bodhgaya: 'Bihar',
  patna: 'Bihar',
  muzaffarpur: 'Bihar',
  bhagalpur: 'Bihar',
  darbhanga: 'Bihar',
  purnia: 'Bihar',
  begusarai: 'Bihar',
  samastipur: 'Bihar',
  vaishali: 'Bihar',
  nalanda: 'Bihar',
  biharsharif: 'Bihar',
  'bihar sharif': 'Bihar',
  rajgir: 'Bihar',
  saran: 'Bihar',
  chapra: 'Bihar',
  siwan: 'Bihar',
  gopalganj: 'Bihar',
  bhojpur: 'Bihar',
  arrah: 'Bihar',
  buxar: 'Bihar',
  rohtas: 'Bihar',
  sasaram: 'Bihar',
  kaimur: 'Bihar',
  bhabua: 'Bihar',
  jehanabad: 'Bihar',
  arwal: 'Bihar',
  aurangabad: 'Bihar',
  nawada: 'Bihar',
  jamui: 'Bihar',
  banka: 'Bihar',
  munger: 'Bihar',
  lakhisarai: 'Bihar',
  sheikhpura: 'Bihar',
  khagaria: 'Bihar',
  katihar: 'Bihar',
  madhepura: 'Bihar',
  saharsa: 'Bihar',
  supaul: 'Bihar',
  araria: 'Bihar',
  kishanganj: 'Bihar',
  motihari: 'Bihar',
  'east champaran': 'Bihar',
  'west champaran': 'Bihar',
  bettiah: 'Bihar',
  sitamarhi: 'Bihar',
  sheohar: 'Bihar',
  madhubani: 'Bihar',

  // Haryana
  gurugram: 'Haryana',
  gurgaon: 'Haryana',
  faridabad: 'Haryana',
  panipat: 'Haryana',
  ambala: 'Haryana',
  karnal: 'Haryana',
  rohtak: 'Haryana',
  hisar: 'Haryana',
  sonipat: 'Haryana',
  panchkula: 'Haryana',
  bhiwani: 'Haryana',
  sirsa: 'Haryana',
  jind: 'Haryana',
  kaithal: 'Haryana',
  rewari: 'Haryana',
  palwal: 'Haryana',
  yamunanagar: 'Haryana',
  kurukshetra: 'Haryana',
  fatehabad: 'Haryana',
  jhajjar: 'Haryana',

  // Delhi
  delhi: 'Delhi',
  'new delhi': 'Delhi',

  // Uttar Pradesh
  lucknow: 'Uttar Pradesh',
  malihabad: 'Uttar Pradesh',
  kanpur: 'Uttar Pradesh',
  'kanpur nagar': 'Uttar Pradesh',
  'kanpur dehat': 'Uttar Pradesh',
  varanasi: 'Uttar Pradesh',
  kashi: 'Uttar Pradesh',
  banaras: 'Uttar Pradesh',
  prayagraj: 'Uttar Pradesh',
  allahabad: 'Uttar Pradesh',
  agra: 'Uttar Pradesh',
  meerut: 'Uttar Pradesh',
  bareilly: 'Uttar Pradesh',
  aligarh: 'Uttar Pradesh',
  moradabad: 'Uttar Pradesh',
  gorakhpur: 'Uttar Pradesh',
  faizabad: 'Uttar Pradesh',
  ayodhya: 'Uttar Pradesh',
  jhansi: 'Uttar Pradesh',
  muzaffarnagar: 'Uttar Pradesh',
  mathura: 'Uttar Pradesh',
  budaun: 'Uttar Pradesh',
  rampur: 'Uttar Pradesh',
  shahjahanpur: 'Uttar Pradesh',
  firozabad: 'Uttar Pradesh',
  sitapur: 'Uttar Pradesh',
  hardoi: 'Uttar Pradesh',
  lakhimpur: 'Uttar Pradesh',
  'lakhimpur kheri': 'Uttar Pradesh',
  unno: 'Uttar Pradesh',
  unnao: 'Uttar Pradesh',
  barabanki: 'Uttar Pradesh',
  sultanpur: 'Uttar Pradesh',
  amethi: 'Uttar Pradesh',
  'rae bareli': 'Uttar Pradesh',
  raebareli: 'Uttar Pradesh',
  bahraich: 'Uttar Pradesh',
  shravasti: 'Uttar Pradesh',
  balrampur: 'Uttar Pradesh',
  gonda: 'Uttar Pradesh',
  basti: 'Uttar Pradesh',
  azamgarh: 'Uttar Pradesh',
  ballia: 'Uttar Pradesh',
  deoria: 'Uttar Pradesh',
  ghazipur: 'Uttar Pradesh',
  jaunpur: 'Uttar Pradesh',
  mirzapur: 'Uttar Pradesh',
  sonbhadra: 'Uttar Pradesh',
  etawah: 'Uttar Pradesh',
  mainpuri: 'Uttar Pradesh',
  hathras: 'Uttar Pradesh',
  etawh: 'Uttar Pradesh',
  bulandshahr: 'Uttar Pradesh',
  ghaziabad: 'Uttar Pradesh',
  noida: 'Uttar Pradesh',
  'gautam buddha nagar': 'Uttar Pradesh',
  'greater noida': 'Uttar Pradesh',
  hapur: 'Uttar Pradesh',
  baghpat: 'Uttar Pradesh',
  shamli: 'Uttar Pradesh',
  sambhal: 'Uttar Pradesh',
  amroha: 'Uttar Pradesh',
  bijnor: 'Uttar Pradesh',
  pilibhit: 'Uttar Pradesh',
  kasganj: 'Uttar Pradesh',
  farrukhabad: 'Uttar Pradesh',
  kannauj: 'Uttar Pradesh',
  auraiya: 'Uttar Pradesh',
  jalaun: 'Uttar Pradesh',
  orai: 'Uttar Pradesh',
  hamirpur: 'Uttar Pradesh',
  mahoba: 'Uttar Pradesh',
  banda: 'Uttar Pradesh',
  chitrakoot: 'Uttar Pradesh',
  fatehpur: 'Uttar Pradesh',
  kaushambi: 'Uttar Pradesh',
  pratapgarh: 'Uttar Pradesh',
  'ambedkar nagar': 'Uttar Pradesh',
  'sant kabir nagar': 'Uttar Pradesh',
  siddharthnagar: 'Uttar Pradesh',
  maharajganj: 'Uttar Pradesh',
  kushinagar: 'Uttar Pradesh',
  mau: 'Uttar Pradesh',
  chandauli: 'Uttar Pradesh',
  bhadohi: 'Uttar Pradesh',

  // Rajasthan
  jaipur: 'Rajasthan',
  jodhpur: 'Rajasthan',
  kota: 'Rajasthan',
  bikaner: 'Rajasthan',
  ajmer: 'Rajasthan',
  udaipur: 'Rajasthan',
  bhilwara: 'Rajasthan',
  alwar: 'Rajasthan',
  bharatpur: 'Rajasthan',
  sikar: 'Rajasthan',
  pali: 'Rajasthan',
  'sri ganganagar': 'Rajasthan',
  chittorgarh: 'Rajasthan',
  jhunjhunu: 'Rajasthan',
  barmer: 'Rajasthan',
  nagaur: 'Rajasthan',
  banswara: 'Rajasthan',

  // Madhya Pradesh
  bhopal: 'Madhya Pradesh',
  indore: 'Madhya Pradesh',
  jabalpur: 'Madhya Pradesh',
  gwalior: 'Madhya Pradesh',
  ujjain: 'Madhya Pradesh',
  sagar: 'Madhya Pradesh',
  dewas: 'Madhya Pradesh',
  satna: 'Madhya Pradesh',
  ratlam: 'Madhya Pradesh',
  rewa: 'Madhya Pradesh',
  katni: 'Madhya Pradesh',
  singrauli: 'Madhya Pradesh',

  // Maharashtra
  mumbai: 'Maharashtra',
  pune: 'Maharashtra',
  nagpur: 'Maharashtra',
  thane: 'Maharashtra',
  nashik: 'Maharashtra',
  aurangabad: 'Maharashtra',
  'chhatrapati sambhajinagar': 'Maharashtra',
  'navi mumbai': 'Maharashtra',
  solapur: 'Maharashtra',
  amravati: 'Maharashtra',
  kolhapur: 'Maharashtra',
  akola: 'Maharashtra',

  // Jharkhand
  ranchi: 'Jharkhand',
  jamshedpur: 'Jharkhand',
  dhanbad: 'Jharkhand',
  bokaro: 'Jharkhand',
  deoghar: 'Jharkhand',
  hazaribagh: 'Jharkhand',

  // West Bengal
  kolkata: 'West Bengal',
  howrah: 'West Bengal',
  darjeeling: 'West Bengal',
  siliguri: 'West Bengal',
  asansol: 'West Bengal',
  durgapur: 'West Bengal',

  // Gujarat
  ahmedabad: 'Gujarat',
  surat: 'Gujarat',
  vadodara: 'Gujarat',
  rajkot: 'Gujarat',
  bhavnagar: 'Gujarat',
  jamnagar: 'Gujarat',
  gandhinagar: 'Gujarat',

  // Karnataka
  bengaluru: 'Karnataka',
  bangalore: 'Karnataka',
  mysuru: 'Karnataka',
  mysore: 'Karnataka',
  hubballi: 'Karnataka',
  mangaluru: 'Karnataka',
  belagavi: 'Karnataka',

  // Telangana & Andhra Pradesh
  hyderabad: 'Telangana',
  warangal: 'Telangana',
  visakhapatnam: 'Andhra Pradesh',
  vijayawada: 'Andhra Pradesh',
  guntur: 'Andhra Pradesh',
  tirupati: 'Andhra Pradesh',

  // Chandigarh
  chandigarh: 'Chandigarh',

  // Uttarakhand & Himachal
  dehradun: 'Uttarakhand',
  haridwar: 'Uttarakhand',
  nainital: 'Uttarakhand',
  shimla: 'Himachal Pradesh',
  dharamshala: 'Himachal Pradesh',
  manali: 'Himachal Pradesh'
};

export function toTitleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function normalizeDistrict(district) {
  if (!district) return '';
  const trimmed = district
    .replace(/ district/gi, '')
    .replace(/ tahsil/gi, '')
    .replace(/ tehsil/gi, '')
    .trim();
  const lower = trimmed.toLowerCase();

  if (
    lower.includes('sahibzada ajit singh nagar') ||
    lower.includes('s.a.s nagar') ||
    lower.includes('sas nagar') ||
    lower === 'mohali'
  ) {
    return 'Mohali';
  }
  if (
    lower.includes('gautam buddha nagar') ||
    lower.includes('gautam budh nagar') ||
    lower === 'noida' ||
    lower === 'greater noida'
  ) {
    return 'Gautam Buddha Nagar';
  }
  if (lower === 'gurgaon' || lower === 'gurugram') return 'Gurugram';
  if (lower === 'bangalore' || lower === 'bengaluru') return 'Bengaluru';
  if (lower === 'allahabad' || lower === 'prayagraj') return 'Prayagraj';
  if (lower === 'faizabad' || lower === 'ayodhya') return 'Ayodhya';
  if (lower === 'banaras' || lower === 'kashi') return 'Varanasi';
  if (lower === 'lakhimpur kheri') return 'Lakhimpur';
  return toTitleCase(trimmed);
}

export function resolveDistrictState(district, currentSelectedState) {
  if (!district) return currentSelectedState || 'Uttar Pradesh';
  const cleanDist = district.trim().toLowerCase();
  const matchedState = DISTRICT_TO_STATE[cleanDist];
  if (matchedState) {
    return matchedState;
  }
  // Try sub-string match
  for (const [key, val] of Object.entries(DISTRICT_TO_STATE)) {
    if (cleanDist.includes(key) || key.includes(cleanDist)) {
      return val;
    }
  }
  return currentSelectedState || 'Uttar Pradesh';
}

/**
 * Reverse geocodes coordinates (lat, lon) with dual-stream high precision extraction
 */
export async function reverseGeocodeCoordinates(lat, lon) {
  let osmData = null;
  let bdcData = null;

  // Stream 1: OpenStreetMap Nominatim
  try {
    const osmRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en'
        },
        signal: AbortSignal.timeout(5000)
      }
    );
    if (osmRes.ok) {
      osmData = await osmRes.json();
    }
  } catch (e) {
    // Ignore and proceed
  }

  // Stream 2: BigDataCloud Reverse Geocoding
  try {
    const bdcRes = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (bdcRes.ok) {
      bdcData = await bdcRes.json();
    }
  } catch (e) {
    // Ignore and proceed
  }

  const osmAddr = osmData?.address || {};

  // 1. STATE EXTRACTION
  let rawState = osmAddr.state || bdcData?.principalSubdivision || '';
  if (!rawState && osmAddr.state_district) rawState = osmAddr.state_district;

  // 2. DISTRICT EXTRACTION
  let rawDistrict =
    osmAddr.state_district ||
    osmAddr.district ||
    osmAddr.county ||
    '';

  if (!rawDistrict && bdcData?.localityInfo?.administrative) {
    for (const item of bdcData.localityInfo.administrative) {
      if (item.adminLevel === 5 || (item.description && item.description.toLowerCase().includes('district'))) {
        rawDistrict = item.name;
        break;
      }
    }
  }

  if (!rawDistrict) {
    rawDistrict = bdcData?.city || bdcData?.locality || osmAddr.city || '';
  }

  const cleanDistrict = normalizeDistrict(rawDistrict);
  const finalState = resolveDistrictState(cleanDistrict, rawState);

  // 3. VILLAGE / LOCALITY EXTRACTION
  let village =
    osmAddr.village ||
    osmAddr.town ||
    osmAddr.suburb ||
    osmAddr.neighbourhood ||
    osmAddr.hamlet ||
    osmAddr.residential ||
    bdcData?.locality ||
    bdcData?.city ||
    '';

  if (village && (village.toLowerCase() === cleanDistrict.toLowerCase() || village.toLowerCase().includes('district'))) {
    if (bdcData?.localityInfo?.administrative) {
      for (const item of bdcData.localityInfo.administrative) {
        if (item.adminLevel === 6 && item.name && item.name !== cleanDistrict) {
          village = item.name.replace(/ tehsil/gi, '').replace(/ tahsil/gi, '');
          break;
        }
      }
    }
  }

  // 4. PINCODE EXTRACTION
  let pincode = osmAddr.postcode || bdcData?.postcode || '';
  const pinMatch = pincode.match(/\b\d{6}\b/);
  if (pinMatch) {
    pincode = pinMatch[0];
  } else if (!/^\d{6}$/.test(pincode)) {
    pincode = '';
  }

  // Format full address
  const formattedAddress =
    osmData?.display_name ||
    [village, cleanDistrict, finalState, pincode].filter(Boolean).join(', ');

  return {
    state: finalState || 'Uttar Pradesh',
    district: cleanDistrict || 'Lucknow',
    villageOrTown: toTitleCase(village) || cleanDistrict,
    pincode: pincode,
    formattedAddress: formattedAddress
  };
}

/**
 * Direct Exact Location Detection via HTML5 Geolocation + Dual Reverse Geocoding
 */
export async function detectExactLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      fetch('https://ipapi.co/json/')
        .then((r) => r.json())
        .then((data) => {
          const st = data.region || 'Uttar Pradesh';
          const dist = normalizeDistrict(data.city) || 'Lucknow';
          const pin = data.postal && /^\d{6}$/.test(data.postal) ? data.postal : '';
          resolve({
            latitude: data.latitude || 26.8467,
            longitude: data.longitude || 80.9462,
            accuracy: 1000,
            state: resolveDistrictState(dist, st),
            district: dist,
            villageOrTown: dist,
            pincode: pin,
            formattedAddress: `${dist}, ${st}, India`
          });
        })
        .catch(() => {
          reject(new Error('Geolocation is not supported by your browser. Please select your location manually below.'));
        });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;

        try {
          const geoData = await reverseGeocodeCoordinates(lat, lon);
          resolve({
            latitude: lat,
            longitude: lon,
            accuracy: Math.round(accuracy),
            state: geoData.state,
            district: geoData.district,
            villageOrTown: geoData.villageOrTown,
            pincode: geoData.pincode,
            formattedAddress: geoData.formattedAddress
          });
        } catch (err) {
          resolve({
            latitude: lat,
            longitude: lon,
            accuracy: Math.round(accuracy),
            state: 'Uttar Pradesh',
            district: 'Lucknow',
            villageOrTown: '',
            pincode: '',
            formattedAddress: `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`
          });
        }
      },
      (err) => {
        let msg = 'Unable to access GPS location.';
        if (err.code === 1) {
          msg = 'Location permission was denied. Please select your State & District from the manual dropdown below.';
        } else if (err.code === 2) {
          msg = 'GPS signal unavailable. Please choose your location from the dropdown below.';
        } else if (err.code === 3) {
          msg = 'Location request timed out. Please select your location manually below.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  });
}
