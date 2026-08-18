import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UserUnauthorized() {
  return (
    <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-black text-stone-900">Access Denied (403)</h1>
      <p className="text-xs text-stone-500 leading-relaxed">
        You don't have permission to access this citizen resource or private problem passport.
      </p>
      <Link
        to="/user/dashboard"
        className="inline-flex items-center space-x-1.5 bg-pine-700 hover:bg-pine-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to User Dashboard</span>
      </Link>
    </div>
  );
}
