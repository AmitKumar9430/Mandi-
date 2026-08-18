import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  Star,
  MapPin,
  CheckCircle2,
  Phone,
  Tag,
  Clock
} from 'lucide-react';

export default function ResourceMatchingCard({ match, onSelect }) {
  const { lang } = useLanguage();
  const { resource, score, distanceKm, reasons } = match;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border-2 border-stone-200 p-5 transition-all space-y-3">
      {/* Top Header & Score Badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-pine-900 bg-pine-100 px-2.5 py-0.5 rounded-lg border border-pine-200">
              {resource.category}
            </span>
            {resource.verified && (
              <span className="text-emerald-800 bg-emerald-50 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-300 flex items-center space-x-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>VERIFIED</span>
              </span>
            )}
          </div>
          <h4 className="text-base font-black text-stone-900 mt-1.5">{resource.name}</h4>
        </div>

        {/* Transparent Match Score Badge in Pine Green */}
        <div className="text-right flex-shrink-0">
          <div className="bg-gradient-to-r from-pine-700 to-pine-900 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-sm border border-emerald-400">
            {Math.round(score)}% Match
          </div>
          <span className="text-[11px] text-stone-500 font-bold block mt-0.5">
            ~{distanceKm?.toFixed(1)} km
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
        {resource.description}
      </p>

      {/* Transparent Reasons List */}
      <div className="bg-pine-50/60 p-3 rounded-xl border border-pine-200 space-y-1.5">
        <span className="text-[10px] uppercase tracking-wider font-black text-pine-800 block">
          {lang === 'hi' ? 'सिफारिश का कारण (Why Recommended):' : 'Transparent Match Reasons:'}
        </span>
        {reasons?.map((reason, idx) => (
          <div key={idx} className="flex items-start space-x-1.5 text-xs text-stone-800 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{reason}</span>
          </div>
        ))}
      </div>

      {/* Contact & Location Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-600">
        <div className="flex items-center space-x-2 font-bold">
          {resource.rating && (
            <span className="flex items-center space-x-0.5 text-pine-800">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{resource.rating.toFixed(1)}</span>
            </span>
          )}
          <span className="flex items-center space-x-1 text-stone-500">
            <MapPin className="w-3.5 h-3.5 text-pine-600" />
            <span>{resource.villageOrTown || resource.district}</span>
          </span>
        </div>

        {resource.contactPhone && (
          <a
            href={`tel:${resource.contactPhone}`}
            className="flex items-center space-x-1 bg-pine-800 hover:bg-pine-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-300" />
            <span>Call</span>
          </a>
        )}
      </div>
    </div>
  );
}
