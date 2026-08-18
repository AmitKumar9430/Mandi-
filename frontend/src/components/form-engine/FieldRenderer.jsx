import React from 'react';
import { HelpCircle, AlertCircle } from 'lucide-react';

export default function FieldRenderer({ field, value, onChange, error }) {
  if (!field) return null;

  const {
    fieldName,
    label,
    type = 'text',
    required = false,
    placeholder = '',
    helpText = '',
    options = []
  } = field;

  const inputId = `field-${fieldName}`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="block text-sm font-semibold text-slate-800">
          {label}
          {required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </label>
        {helpText && (
          <span className="text-xs text-slate-400 flex items-center gap-1" title={helpText}>
            <HelpCircle className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      {type === 'select' && (
        <div className="relative">
          <select
            id={inputId}
            name={fieldName}
            value={value !== undefined ? value : ''}
            onChange={(e) => onChange(fieldName, e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border bg-white text-slate-800 font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              error ? 'border-red-400 bg-red-50/20' : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <option value="" disabled>-- Select / चुनें --</option>
            {options && options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {type === 'boolean' && (
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            id={inputId}
            role="switch"
            aria-checked={!!value}
            onClick={() => onChange(fieldName, !value)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${
              value ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                value ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className="text-sm font-medium text-slate-700 select-none cursor-pointer" onClick={() => onChange(fieldName, !value)}>
            {value ? 'Yes / हाँ (Included/Available)' : 'No / नहीं (Not needed)'}
          </span>
        </div>
      )}

      {type === 'number' && (
        <input
          id={inputId}
          name={fieldName}
          type="number"
          step="any"
          placeholder={placeholder}
          value={value !== undefined ? value : ''}
          onChange={(e) => onChange(fieldName, e.target.value === '' ? '' : Number(e.target.value))}
          className={`w-full px-4 py-2.5 rounded-xl border bg-white text-slate-800 font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            error ? 'border-red-400 bg-red-50/20' : 'border-slate-300 hover:border-slate-400'
          }`}
        />
      )}

      {type === 'textarea' && (
        <textarea
          id={inputId}
          name={fieldName}
          rows={3}
          placeholder={placeholder}
          value={value !== undefined ? value : ''}
          onChange={(e) => onChange(fieldName, e.target.value)}
          className={`w-full px-4 py-2.5 rounded-xl border bg-white text-slate-800 font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y ${
            error ? 'border-red-400 bg-red-50/20' : 'border-slate-300 hover:border-slate-400'
          }`}
        />
      )}

      {type === 'text' && (
        <input
          id={inputId}
          name={fieldName}
          type="text"
          placeholder={placeholder}
          value={value !== undefined ? value : ''}
          onChange={(e) => onChange(fieldName, e.target.value)}
          className={`w-full px-4 py-2.5 rounded-xl border bg-white text-slate-800 font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            error ? 'border-red-400 bg-red-50/20' : 'border-slate-300 hover:border-slate-400'
          }`}
        />
      )}

      {type === 'date' && (
        <input
          id={inputId}
          name={fieldName}
          type="date"
          value={value || ''}
          onChange={(e) => onChange(fieldName, e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      )}

      {type === 'time' && (
        <input
          id={inputId}
          name={fieldName}
          type="time"
          value={value || ''}
          onChange={(e) => onChange(fieldName, e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      )}

      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}

      {helpText && !error && (
        <p className="text-xs text-slate-500 mt-0.5">{helpText}</p>
      )}
    </div>
  );
}
