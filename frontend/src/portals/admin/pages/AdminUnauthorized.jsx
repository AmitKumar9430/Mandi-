import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AdminUnauthorized() {
  return (
    <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
      <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto border-2 border-red-200 shadow-sm">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-black text-stone-900">Administrative Access Forbidden (403)</h1>
      <p className="text-xs text-stone-500 leading-relaxed">
        Your current credentials or role do not possess the required Super Administrator or Operations privileges.
      </p>
      <Link
        to="/admin/login"
        className="inline-flex items-center space-x-1.5 bg-pine-700 hover:bg-pine-800 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow transition border border-emerald-500"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Admin Login</span>
      </Link>
    </div>
  );
}
