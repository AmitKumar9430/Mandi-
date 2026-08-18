import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export default function AdminNotFound() {
  return (
    <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
      <div className="w-16 h-16 bg-white text-pine-700 rounded-3xl flex items-center justify-center mx-auto border-2 border-stone-200 shadow-sm">
        <HelpCircle className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-black text-stone-900">Admin Page Not Found (404)</h1>
      <p className="text-xs text-stone-500 leading-relaxed">
        The administrative operations route you requested does not exist.
      </p>
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center space-x-1.5 bg-pine-700 hover:bg-pine-800 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow transition border border-emerald-500"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Operations Dashboard</span>
      </Link>
    </div>
  );
}
