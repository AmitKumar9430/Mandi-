/**
 * MANDI Form Schema Service
 * Role-aware dynamic form schema provider and validation engine.
 */

export const REQUEST_TYPES = [
  {
    id: 'REPORT_PROBLEM',
    labelEn: 'Report a Problem',
    labelHi: 'समस्या या शिकायत दर्ज करें',
    descEn: 'Public grievance, road damage, electricity cut, handpump failure',
    descHi: 'सड़क गड्ढे, ट्रांसफार्मर फुंकना, हैंडपंप खराब, जलभराव आदि',
    icon: '🚨',
    intent: 'REQUEST',
    badge: 'Civic Grievance'
  },
  {
    id: 'REQUEST_SERVICE',
    labelEn: 'Request Agricultural Service / Tractor',
    labelHi: 'ट्रैक्टर व कृषि उपकरण की मांग',
    descEn: 'Hire tractor, rotavator, harvester, or farm machinery for your land',
    descHi: 'जुताई, बुवाई, रोटावेटर, कटाई व ढुलाई हेतु उपकरण मांगें',
    icon: '🚜',
    intent: 'REQUEST',
    serviceType: 'TRACTOR',
    category: 'AGRICULTURE',
    badge: 'Farmer Demand'
  },
  {
    id: 'REQUEST_WORKER',
    labelEn: 'Hire Farm Labour & Skilled Workers',
    labelHi: 'श्रमिक व कुशल कारीगर की मांग',
    descEn: 'Hire farm harvesting workers, plumbers, electricians, masons',
    descHi: 'फसल कटाई मजदूर, मिस्त्री, प्लंबर व इलेक्ट्रीशियन खोजें',
    icon: '👷',
    intent: 'REQUEST',
    serviceType: 'FARM_LABOUR',
    category: 'EMPLOYMENT',
    badge: 'Workforce Hire'
  },
  {
    id: 'REQUEST_RESOURCE',
    labelEn: 'Request Water Tanker / Equipment',
    labelHi: 'जल टैंकर या सामुदायिक संसाधन मांग',
    descEn: 'Emergency water tanker, cold storage space, or toolkit',
    descHi: 'आपातकालीन पेयजल टैंकर, कोल्ड स्टोरेज या औजार',
    icon: '💧',
    intent: 'REQUEST',
    serviceType: 'WATER_TANKER',
    category: 'WATER_SANITATION',
    badge: 'Resource Request'
  },
  {
    id: 'OFFER_SERVICE',
    labelEn: 'Offer Tractor / Farm Machinery (प्रदाता)',
    labelHi: 'ट्रैक्टर व कृषि उपकरण उपलब्धता दर्ज करें',
    descEn: 'Publish tractor availability, horsepower, hourly rate, and radius',
    descHi: 'अपने ट्रैक्टर की उपलब्धता, किराया व कार्य क्षेत्र दर्ज करें',
    icon: '🚜',
    intent: 'OFFER',
    serviceType: 'TRACTOR',
    category: 'AGRICULTURE',
    badge: 'Service Provider'
  },
  {
    id: 'OFFER_WORK',
    labelEn: 'Offer Skilled Work & Labour (श्रमिक)',
    labelHi: 'श्रमिक व कारीगर सेवा उपलब्धता',
    descEn: 'Register your skills, daily wage expectation, and availability',
    descHi: 'अपना हुनर, दैनिक मजदूरी व उपलब्ध समय दर्ज करें',
    icon: '🛠️',
    intent: 'OFFER',
    serviceType: 'SKILLED_LABOUR',
    category: 'EMPLOYMENT',
    badge: 'Worker Provider'
  },
  {
    id: 'OFFER_RESOURCE',
    labelEn: 'Offer Water Tanker / Storage Facility',
    labelHi: 'जल टैंकर या भंडारण गोदाम उपलब्धता',
    descEn: 'Provide water tanker supply or warehouse storage for farmers',
    descHi: 'पानी का टैंकर या फसल भंडारण गोदाम सेवा दें',
    icon: '🏢',
    intent: 'OFFER',
    serviceType: 'WATER_TANKER',
    category: 'WATER_SANITATION',
    badge: 'Resource Provider'
  },
  {
    id: 'EMERGENCY_REQUEST',
    labelEn: 'Emergency Medical & Ambulance Help',
    labelHi: 'आपातकालीन चिकित्सा व एम्बुलेंस सहायता',
    descEn: 'Urgent hospital transport, patient support, and emergency care',
    descHi: 'तुरंत अस्पताल वाहन, डॉक्टर सहायता व जीवन रक्षक सेवा',
    icon: '🚑',
    intent: 'REQUEST',
    serviceType: 'MEDICAL_ASSISTANCE',
    category: 'HEALTHCARE',
    badge: 'Emergency'
  }
];

export const SERVICE_DOMAINS = [
  { id: 'TRACTOR', label: 'Tractor & Machinery (ट्रैक्टर व उपकरण)', icon: '🚜', category: 'AGRICULTURE' },
  { id: 'HARVESTER', label: 'Harvester & Thresher (हार्वेस्टर/थ्रेशर)', icon: '🌾', category: 'AGRICULTURE' },
  { id: 'WATER_TANKER', label: 'Water Tanker Supply (जल टैंकर)', icon: '🚰', category: 'WATER_SANITATION' },
  { id: 'FARM_LABOUR', label: 'Farm Labour (कृषि मजदूर)', icon: '👨‍🌾', category: 'EMPLOYMENT' },
  { id: 'SKILLED_LABOUR', label: 'Skilled Trades / Mason (मिस्त्री/कारीगर)', icon: '🧱', category: 'EMPLOYMENT' },
  { id: 'ELECTRICIAN', label: 'Electrician (इलेक्ट्रीशियन)', icon: '⚡', category: 'ELECTRICITY' },
  { id: 'PLUMBER', label: 'Plumber & Pump Mistri (प्लंबर/पंप मिस्त्री)', icon: '🔧', category: 'WATER_SANITATION' },
  { id: 'TRANSPORT_VEHICLE', label: 'Transport Trolley / Truck (ढुलाई वाहन)', icon: '🚚', category: 'AGRICULTURE' },
  { id: 'COLD_STORAGE', label: 'Grain & Cold Storage (भंडारण गोदाम)', icon: '🏬', category: 'AGRICULTURE' },
  { id: 'MEDICAL_ASSISTANCE', label: 'Doctor & Patient Help (चिकित्सा सहायता)', icon: '🩺', category: 'HEALTHCARE' },
  { id: 'GOVERNMENT_SCHEME_HELP', label: 'Govt Scheme Guidance (सरकारी योजना)', icon: '📜', category: 'SOCIAL_WELFARE' },
  { id: 'CIVIC_INFRASTRUCTURE', label: 'Road & Public Works (सड़क व निर्माण)', icon: '🏗️', category: 'INFRASTRUCTURE' }
];

export async function fetchFormSchema(role = 'ROLE_CITIZEN', requestType = 'REPORT_PROBLEM', category = 'AGRICULTURE', serviceType = null) {
  try {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (requestType) params.append('requestType', requestType);
    if (category) params.append('category', category);
    if (serviceType) params.append('serviceType', serviceType);

    const res = await fetch(`/api/problem-form/schema?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.data) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('Backend schema fetch failed, using fallback schema generator:', err);
  }

  // Fallback dynamic generator
  return generateClientSchema(role, requestType, category, serviceType);
}

function generateClientSchema(role, requestType, category, serviceType) {
  const isOffer = requestType && (
    requestType.startsWith('OFFER_')
  );

  let fields = [];
  let formTitle = isOffer ? 'Service & Resource Offering' : 'Problem & Service Request';
  let formDescription = isOffer ? 'Publish your resource availability for nearby citizens' : 'Provide exact details for fast resolution';

  if (serviceType === 'TRACTOR') {
    if (isOffer) {
      formTitle = 'Tractor & Machinery Offering (ट्रैक्टर प्रदाता फॉर्म)';
      formDescription = 'Publish your tractor horsepower, pricing, and operating radius for farmers.';
      fields = [
        { fieldName: 'tractorBrand', label: 'Tractor Brand & Model (ब्रांड व मॉडल)*', type: 'text', required: true, placeholder: 'e.g. Mahindra 575 DI / Swaraj 744 FE', step: 3, order: 1 },
        { fieldName: 'horsePower', label: 'Engine Horsepower (हॉर्सपावर - HP)*', type: 'number', required: true, placeholder: 'e.g. 45', step: 3, order: 2 },
        { fieldName: 'hourlyRate', label: 'Hourly Rate in ₹ (प्रति घंटा किराया)*', type: 'number', required: true, placeholder: 'e.g. 1200', step: 3, order: 3 },
        { fieldName: 'operatorAvailable', label: 'Driver / Operator Available? (चालक उपलब्ध है?)', type: 'boolean', required: true, step: 3, order: 4 },
        { fieldName: 'fuelIncluded', label: 'Fuel Included in Rate? (डीजल शामिल है?)', type: 'boolean', required: true, step: 3, order: 5 },
        { fieldName: 'maxTravelRadiusKm', label: 'Service Radius in Km (कार्य सीमा - किमी)*', type: 'number', required: true, placeholder: 'e.g. 25', step: 3, order: 6 },
        { fieldName: 'availableAttachments', label: 'Implements Available (उपलब्ध कृषि यंत्र)', type: 'text', placeholder: 'e.g. Rotavator, 9-Tine Cultivator, Trolley', step: 3, order: 7 }
      ];
    } else {
      formTitle = 'Tractor & Agri Machinery Request (ट्रैक्टर मांग फॉर्म)';
      formDescription = 'Specify land size, required horsepower, operator needs, date and time slots.';
      fields = [
        { fieldName: 'landSize', label: 'Land Size (ज़मीन का क्षेत्रफल)*', type: 'number', required: true, placeholder: 'e.g. 5', step: 3, order: 1 },
        {
          fieldName: 'landUnit', label: 'Land Unit (माप इकाई)*', type: 'select', required: true, step: 3, order: 2,
          options: [{ value: 'ACRES', label: 'Acres (एकड़)' }, { value: 'BIGHAS', label: 'Bigha (बीघा)' }, { value: 'HECTARES', label: 'Hectares (हेक्टेयर)' }]
        },
        {
          fieldName: 'workType', label: 'Work Required (कार्य का प्रकार)*', type: 'select', required: true, step: 3, order: 3,
          options: [
            { value: 'PLOUGHING', label: 'Ploughing / Tillage (जुताई)' },
            { value: 'ROTAVATOR', label: 'Rotavator (रोटावेटर)' },
            { value: 'CULTIVATION', label: 'Cultivator (कल्टीवेटर)' },
            { value: 'SOWING', label: 'Seed Sowing (बुवाई)' },
            { value: 'HARVESTING', label: 'Harvesting (कटाई)' },
            { value: 'TRANSPORTATION', label: 'Produce Transport / Trolley (ढुलाई)' }
          ]
        },
        {
          fieldName: 'minHorsePower', label: 'Tractor Power (हॉर्सपावर)*', type: 'select', required: true, step: 3, order: 4,
          options: [
            { value: 'ANY', label: 'Any Compatible Tractor (कोई भी उपयुक्त)' },
            { value: 'HP_30_40', label: 'Medium (30–40 HP)' },
            { value: 'HP_40_50', label: 'Standard (40–50 HP)' },
            { value: 'HP_50_60', label: 'Heavy Duty (50–60 HP)' },
            { value: 'HP_60_PLUS', label: 'Ultra Heavy (60+ HP)' }
          ]
        },
        { fieldName: 'operatorNeeded', label: 'Tractor Driver Needed? (ड्राइवर चाहिए?)', type: 'boolean', required: true, step: 3, order: 5 },
        {
          fieldName: 'fuelArrangement', label: 'Fuel Arrangement (ईंधन व्यवस्था)*', type: 'select', required: true, step: 3, order: 6,
          options: [
            { value: 'PROVIDER', label: 'Fuel Included by Provider (प्रदाता द्वारा)' },
            { value: 'REQUESTER', label: 'Fuel Supplied by Farmer (किसान द्वारा)' }
          ]
        }
      ];
    }
  } else if (serviceType === 'WATER_TANKER') {
    if (isOffer) {
      formTitle = 'Water Tanker Supply Offering (जल टैंकर सेवा प्रदाता)';
      fields = [
        { fieldName: 'tankCapacityLiters', label: 'Tanker Capacity (लीटर)*', type: 'number', required: true, placeholder: 'e.g. 5000', step: 3, order: 1 },
        { fieldName: 'pricePerTrip', label: 'Price per Trip in ₹ (प्रति ट्रिप किराया)*', type: 'number', required: true, placeholder: 'e.g. 800', step: 3, order: 2 },
        { fieldName: 'deliveryRadiusKm', label: 'Delivery Radius in Km (किमी)*', type: 'number', required: true, placeholder: 'e.g. 20', step: 3, order: 3 },
        { fieldName: 'driverIncluded', label: 'Driver Included?', type: 'boolean', required: true, step: 3, order: 4 }
      ];
    } else {
      formTitle = 'Emergency Water Tanker Request (जल टैंकर मांग)';
      fields = [
        { fieldName: 'waterQuantityLiters', label: 'Water Quantity in Litres (लीटर)*', type: 'number', required: true, placeholder: 'e.g. 5000', step: 3, order: 1 },
        {
          fieldName: 'waterPurpose', label: 'Purpose (उपयोग का प्रकार)*', type: 'select', required: true, step: 3, order: 2,
          options: [
            { value: 'DRINKING', label: 'Drinking / Household (पेयजल व घरेलू)' },
            { value: 'AGRICULTURE', label: 'Agriculture / Irrigation (कृषि व सिंचाई)' },
            { value: 'LIVESTOCK', label: 'Livestock / Animals (पशुपालन)' },
            { value: 'CONSTRUCTION', label: 'Construction (निर्माण कार्य)' }
          ]
        },
        { fieldName: 'urgentImmediate', label: 'Critical Shortage? (आपातकालीन कमी?)', type: 'boolean', required: true, step: 3, order: 3 }
      ];
    }
  } else if (serviceType === 'FARM_LABOUR' || serviceType === 'SKILLED_LABOUR') {
    if (isOffer) {
      formTitle = 'Skilled Work & Labour Offering (श्रमिक सेवा)';
      fields = [
        { fieldName: 'primarySkill', label: 'Primary Trade & Skill (मुख्य कार्य व हुनर)*', type: 'text', required: true, placeholder: 'e.g. Farm Harvesting / Mason / Plumber', step: 3, order: 1 },
        { fieldName: 'experienceYears', label: 'Experience in Years (अनुभव वर्ष)*', type: 'number', required: true, placeholder: 'e.g. 5', step: 3, order: 2 },
        { fieldName: 'expectedDailyWage', label: 'Expected Daily Wage in ₹ (दैनिक मजदूरी)*', type: 'number', required: true, placeholder: 'e.g. 600', step: 3, order: 3 },
        { fieldName: 'toolsAvailable', label: 'Own Tools Available? (स्वयं के औजार हैं?)', type: 'boolean', required: true, step: 3, order: 4 },
        { fieldName: 'travelRadiusKm', label: 'Travel Radius in Km (कार्य सीमा - किमी)*', type: 'number', required: true, placeholder: 'e.g. 15', step: 3, order: 5 }
      ];
    } else {
      formTitle = 'Hire Farm Labour & Skilled Workforce (श्रमिक मांग)';
      fields = [
        { fieldName: 'numberOfWorkers', label: 'Number of Workers Needed (श्रमिकों की संख्या)*', type: 'number', required: true, placeholder: 'e.g. 4', step: 3, order: 1 },
        { fieldName: 'durationDays', label: 'Work Duration in Days (कार्य दिवस)*', type: 'number', required: true, placeholder: 'e.g. 3', step: 3, order: 2 },
        { fieldName: 'workDescription', label: 'Work Scope (कार्य विवरण)*', type: 'text', required: true, placeholder: 'e.g. Wheat Harvesting / Brick Masonry', step: 3, order: 3 },
        { fieldName: 'dailyWageOffered', label: 'Daily Wage Offered per Worker in ₹ (दैनिक मजदूरी)*', type: 'number', required: true, placeholder: 'e.g. 500', step: 3, order: 4 }
      ];
    }
  } else if (category === 'HEALTHCARE' || serviceType === 'MEDICAL_ASSISTANCE') {
    formTitle = 'Healthcare & Patient Assistance (स्वास्थ्य सहायता)';
    fields = [
      { fieldName: 'patientName', label: 'Patient Name (रोगी का नाम)*', type: 'text', required: true, placeholder: 'e.g. Ram Prasad', step: 3, order: 1 },
      { fieldName: 'patientAge', label: 'Patient Age (आयु)*', type: 'number', required: true, placeholder: 'e.g. 45', step: 3, order: 2 },
      { fieldName: 'symptoms', label: 'Symptoms & Condition (लक्षण व समस्या विवरण)*', type: 'textarea', required: true, placeholder: 'Describe medical symptoms clearly', step: 3, order: 3 },
      { fieldName: 'isEmergency', label: 'Is this a Critical Emergency? (क्या यह आपातकालीन है?)*', type: 'boolean', required: true, step: 3, order: 4 }
    ];
  } else if (category === 'ELECTRICITY') {
    formTitle = 'Electricity & Transformer Fault Report (विद्युत समस्या)';
    fields = [
      {
        fieldName: 'electricityIssueType', label: 'Fault Type (समस्या का प्रकार)*', type: 'select', required: true, step: 3, order: 1,
        options: [
          { value: 'TRANSFORMER_BURNT', label: 'Transformer Burnt (ट्रांसफार्मर फुंक गया)' },
          { value: 'TOTAL_POWER_OUTAGE', label: 'Long Power Cut (लंबे समय से बिजली गुल)' },
          { value: 'BROKEN_POLE', label: 'Broken / Tilted Pole (खंभा टूटा हुआ)' },
          { value: 'SNAPPED_WIRE', label: 'Live Wire Snapped (तार जमीन पर गिरा)' }
        ]
      },
      { fieldName: 'poleOrTransformerNo', label: 'Pole / Transformer Number (खंभा या ट्रांसफार्मर संख्या)', type: 'text', placeholder: 'e.g. TX-45 / Pole-12', step: 3, order: 2 },
      { fieldName: 'consumerNumber', label: 'Consumer Account Number (उपभोक्ता संख्या)', type: 'text', placeholder: 'e.g. 1029384756', step: 3, order: 3 }
    ];
  }

  return {
    role,
    requestType,
    category,
    serviceType,
    isOffer,
    formTitle,
    formDescription,
    fields,
    defaultValues: {}
  };
}
