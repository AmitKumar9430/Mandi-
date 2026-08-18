import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  Mic,
  MicOff,
  Camera,
  Layers,
  FileText,
  DollarSign,
  ShieldCheck,
  Building2,
  ChevronRight,
  Send
} from 'lucide-react';
import { useUserAuth } from '../../auth/UserAuthContext';
import { userProblemApi } from '../../shared/api/userApi';
import LocationPicker from '../LocationPicker';
import FieldRenderer from './FieldRenderer';
import ProviderMatchModal from '../matching/ProviderMatchModal';
import { REQUEST_TYPES, SERVICE_DOMAINS, fetchFormSchema } from '../../shared/utils/formSchemaService';

export default function DynamicProblemForm({ initialRequestType = null, onSuccess }) {
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const userRole = user?.roles?.[0] || 'ROLE_CITIZEN';

  const [currentStep, setCurrentStep] = useState(1);
  const [requestType, setRequestType] = useState(initialRequestType || 'REPORT_PROBLEM');
  const [category, setCategory] = useState('AGRICULTURE');
  const [serviceType, setServiceType] = useState('TRACTOR');

  // Form schema and dynamic fields
  const [schema, setSchema] = useState(null);
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [dynamicValues, setDynamicValues] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  // Core base fields
  const [title, setTitle] = useState('');
  const [rawDescription, setRawDescription] = useState('');
  const [urgency, setUrgency] = useState('MEDIUM');
  const [requiredDate, setRequiredDate] = useState(new Date().toISOString().split('T')[0]);
  const [requiredStartTime, setRequiredStartTime] = useState('09:00');
  const [requiredEndTime, setRequiredEndTime] = useState('14:00');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetUnit, setBudgetUnit] = useState('per hour');

  // Location fields
  const [district, setDistrict] = useState(user?.profile?.district || 'Lucknow');
  const [state, setState] = useState(user?.profile?.state || 'Uttar Pradesh');
  const [villageOrTown, setVillageOrTown] = useState(user?.profile?.villageOrTown || '');
  const [pincode, setPincode] = useState(user?.profile?.pincode || '');
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(user?.profile?.latitude || 26.8467);
  const [longitude, setLongitude] = useState(user?.profile?.longitude || 80.9462);

  // Attachments & contact
  const [contactName, setContactName] = useState(user?.fullName || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [photoUrl, setPhotoUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // Submission state & matching modal
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [createdProblem, setCreatedProblem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);

  // Load schema whenever role, requestType, category, or serviceType changes
  useEffect(() => {
    let isMounted = true;
    async function loadSchema() {
      setLoadingSchema(true);
      const data = await fetchFormSchema(userRole, requestType, category, serviceType);
      if (isMounted && data) {
        setSchema(data);
        if (data.defaultValues) {
          setDynamicValues((prev) => ({ ...data.defaultValues, ...prev }));
        }
      }
      setLoadingSchema(false);
    }
    loadSchema();
    return () => { isMounted = false; };
  }, [userRole, requestType, category, serviceType]);

  const handleDynamicFieldChange = (fieldName, val) => {
    setDynamicValues((prev) => ({ ...prev, [fieldName]: val }));
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const handleLocationChange = (loc) => {
    if (loc.district) setDistrict(loc.district);
    if (loc.state) setState(loc.state);
    if (loc.villageOrTown !== undefined) setVillageOrTown(loc.villageOrTown);
    if (loc.pincode !== undefined) setPincode(loc.pincode);
    if (loc.locationName) setLocationName(loc.locationName);
    if (loc.address) setAddress(loc.address);
    if (loc.latitude) setLatitude(loc.latitude);
    if (loc.longitude) setLongitude(loc.longitude);
  };

  // Speech-to-text / Voice simulation
  const toggleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.lang = 'hi-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setRawDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsRecording(false);
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
        recognition.start();
      } else {
        alert('Voice recognition is not supported in this browser. Please type your description.');
      }
    }
  };

  // Step navigation validations
  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Validate dynamic fields
      const errors = {};
      if (schema?.fields) {
        for (const f of schema.fields) {
          if (f.required && (dynamicValues[f.fieldName] === undefined || dynamicValues[f.fieldName] === '')) {
            errors[f.fieldName] = `${f.label} is required`;
          }
        }
      }
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Final Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmissionError('');

    // Generate fallback description if blank
    let desc = rawDescription.trim();
    if (!desc) {
      desc = `${schema?.formTitle || 'Request'} for ${serviceType || category} in ${villageOrTown || district}. Details: ${JSON.stringify(dynamicValues)}`;
    }

    const payload = {
      title: title || `${schema?.formTitle || 'MANDI Problem / Request'} - ${district}`,
      rawDescription: desc,
      category: category || 'AGRICULTURE',
      subCategory: serviceType || 'GENERAL',
      requestType: requestType,
      serviceType: serviceType,
      isOffer: schema?.isOffer || false,
      requiredDate: requiredDate,
      requiredStartTime: requiredStartTime,
      requiredEndTime: requiredEndTime,
      budgetAmount: budgetAmount ? Number(budgetAmount) : (dynamicValues.hourlyRate ? Number(dynamicValues.hourlyRate) : null),
      budgetUnit: budgetUnit,
      structuredAttributes: JSON.stringify(dynamicValues),
      urgency: urgency,
      locationName: locationName || villageOrTown || district,
      villageOrTown: villageOrTown,
      district: district,
      state: state,
      address: address,
      latitude: latitude,
      longitude: longitude,
      contactName: contactName,
      contactPhone: contactPhone,
      photoUrl: photoUrl,
      audioRecordingUrl: audioUrl
    };

    try {
      const createFn = userProblemApi.createProblem || userProblemApi.create;
      const res = await createFn(payload);
      const savedProblem = res?.data || res;
      setCreatedProblem(savedProblem);

      // If this was a service request, query matching engine immediately!
      if (!payload.isOffer && (requestType === 'REQUEST_SERVICE' || requestType === 'REQUEST_RESOURCE' || requestType === 'REQUEST_WORKER')) {
        setLoadingMatches(true);
        setShowMatchModal(true);
        try {
          const matchRes = await userProblemApi.getBestMatches(savedProblem.id, 5);
          const mData = matchRes?.data || matchRes;
          setMatches(Array.isArray(mData) ? mData : (mData?.data || []));
        } catch (mErr) {
          console.warn('Match fetching notice:', mErr);
        } finally {
          setLoadingMatches(false);
        }
      } else {
        if (onSuccess) {
          onSuccess(savedProblem);
        } else {
          navigate(payload.isOffer ? '/user/provider-hub' : '/user/problems');
        }
      }
    } catch (err) {
      setSubmissionError(err.message || 'Failed to submit form. Please check required fields.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookMatchedProvider = async (bookingPayload) => {
    const token = localStorage.getItem('token') || localStorage.getItem('mandi_token');
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingPayload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.message || 'Failed to book provider');
    }
    return await res.json();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-amber-950 uppercase tracking-wider shadow-sm">
                Role-Aware Smart Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-emerald-100">
                {userRole.replace('ROLE_', '')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {schema?.formTitle || 'Smart Problem & Service Coordination'}
            </h1>
            <p className="text-sm text-emerald-100/90 mt-1 max-w-xl">
              {schema?.formDescription || 'Intelligent dynamic form customized for your role and service requirements.'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-xs font-bold text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Step {currentStep} of 5</span>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-5 gap-2 mt-6 pt-4 border-t border-white/10 text-xs">
          {[
            { num: 1, label: '1. Intent' },
            { num: 2, label: '2. Domain' },
            { num: 3, label: '3. Specifics' },
            { num: 4, label: '4. Location' },
            { num: 5, label: '5. Verify' }
          ].map((s) => (
            <div key={s.num} className="space-y-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep >= s.num ? 'bg-amber-400' : 'bg-white/20'
                }`}
              />
              <span className={`block font-semibold ${currentStep >= s.num ? 'text-amber-200' : 'text-emerald-200/50'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {submissionError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 animate-fadeIn">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold">Submission Notice</p>
            <p className="text-xs mt-0.5">{submissionError}</p>
          </div>
        </div>
      )}

      {/* Step Content Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* STEP 1: Workflow Intent & Mode */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-black text-slate-900">What would you like to do today?</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your primary goal. The form will adapt dynamically to collect only what matters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {REQUEST_TYPES.map((rt) => {
                const isSelected = requestType === rt.id;
                return (
                  <button
                    key={rt.id}
                    type="button"
                    onClick={() => {
                      setRequestType(rt.id);
                      if (rt.category) setCategory(rt.category);
                      if (rt.serviceType) setServiceType(rt.serviceType);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <span className="text-3xl p-2 rounded-xl bg-white shadow-sm shrink-0">{rt.icon}</span>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm">{rt.labelEn}</h3>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                          rt.intent === 'OFFER' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {rt.intent}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-800">{rt.labelHi}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{rt.descEn}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Category & Service Domain */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-black text-slate-900">Select Specific Service & Category</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pinpoint the exact machinery, trade, or civic domain needed.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {SERVICE_DOMAINS.map((sd) => {
                const isSelected = serviceType === sd.id;
                return (
                  <button
                    key={sd.id}
                    type="button"
                    onClick={() => {
                      setServiceType(sd.id);
                      setCategory(sd.category);
                    }}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-3xl">{sd.icon}</span>
                    <span className="text-xs font-bold text-slate-800 line-clamp-2">{sd.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Dynamic Role & Service Specifications */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {schema?.isOffer ? 'Service Specifications & Rates' : 'Specific Requirements & Workload'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {schema?.isOffer
                    ? 'State your machinery horsepower, pricing, and operating radius.'
                    : 'Provide land size, horsepower needed, operator arrangement, and hours.'}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {serviceType} ({schema?.isOffer ? 'OFFER' : 'REQUEST'})
              </span>
            </div>

            {loadingSchema ? (
              <div className="py-12 text-center">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-500 mt-2 font-medium">Generating role-tailored fields...</p>
              </div>
            ) : schema?.fields && schema.fields.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schema.fields.map((f) => (
                  <div key={f.fieldName} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <FieldRenderer
                      field={f}
                      value={dynamicValues[f.fieldName]}
                      onChange={handleDynamicFieldChange}
                      error={fieldErrors[f.fieldName]}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 text-slate-600 text-xs font-medium">
                Standard parameters configured for {serviceType}. Proceed to schedule and location.
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Schedule, Budget & Location */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-black text-slate-900">Schedule, Budget & Geographical Location</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Set required service timing and verify village location for proximity calculation.
              </p>
            </div>

            {/* Date / Time Slot Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Required / Available Date*
                </label>
                <input
                  type="date"
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Start Time*
                </label>
                <input
                  type="time"
                  value={requiredStartTime}
                  onChange={(e) => setRequiredStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  End Time*
                </label>
                <input
                  type="time"
                  value={requiredEndTime}
                  onChange={(e) => setRequiredEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm"
                />
              </div>
            </div>

            {/* Budget Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {schema?.isOffer ? 'Offered Price in ₹ (किराया)*' : 'Target Budget in ₹ (बजट)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    placeholder="e.g. 1200"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pricing Unit</label>
                <select
                  value={budgetUnit}
                  onChange={(e) => setBudgetUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm font-medium"
                >
                  <option value="per hour">per hour (प्रति घंटा)</option>
                  <option value="per day">per day (प्रति दिन)</option>
                  <option value="per acre">per acre (प्रति एकड़)</option>
                  <option value="per trip">per trip (प्रति ट्रिप)</option>
                  <option value="fixed">Fixed Price (कुल तय राशि)</option>
                </select>
              </div>
            </div>

            {/* Location Picker with GPS & 36 States */}
            <div className="pt-2">
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Service Delivery Village / Location*
              </label>
              <LocationPicker
                state={state}
                setState={setState}
                district={district}
                setDistrict={setDistrict}
                village={villageOrTown}
                setVillage={setVillageOrTown}
                pincode={pincode}
                setPincode={setPincode}
                address={address}
                setAddress={setAddress}
                latitude={latitude}
                setLatitude={setLatitude}
                longitude={longitude}
                setLongitude={setLongitude}
                onLocationChange={handleLocationChange}
              />
            </div>
          </div>
        )}

        {/* STEP 5: Description, Voice & Attachments */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-black text-slate-900">Description & Citizen Verification</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Add an audio explanation, photos of the work site/machinery, and confirm contact details.
              </p>
            </div>

            {/* Description with Voice Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Detailed Description (विवरण)
                </label>
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition ${
                    isRecording
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  {isRecording ? 'Listening (बोलें)...' : 'Speak in Hindi / बोलकर लिखें'}
                </button>
              </div>

              <textarea
                rows={4}
                value={rawDescription}
                onChange={(e) => setRawDescription(e.target.value)}
                placeholder="Describe specific conditions, landmark instructions, or requirements..."
                className="w-full p-4 rounded-2xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Name*</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number*</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>
            </div>

            {/* Photo / Attachment URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Photo URL / Machinery Image (Optional)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
              />
            </div>
          </div>
        )}

        {/* Footer Wizard Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back / पीछे
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 text-sm"
            >
              Next Step / आगे बढ़ें
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black shadow-xl shadow-emerald-700/30 transition flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {schema?.isOffer ? 'Publish Availability Offering' : 'Submit & Find Compatible Matches'}
            </button>
          )}
        </div>
      </form>

      {/* Provider Match Modal */}
      <ProviderMatchModal
        isOpen={showMatchModal}
        onClose={() => {
          setShowMatchModal(false);
          if (onSuccess) onSuccess(createdProblem);
          else navigate('/user/problems');
        }}
        problem={createdProblem}
        matches={matches}
        isLoading={loadingMatches}
        onBookProvider={handleBookMatchedProvider}
      />
    </div>
  );
}
