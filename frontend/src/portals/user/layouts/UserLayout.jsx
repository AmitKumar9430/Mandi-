import React from 'react';
import { Outlet } from 'react-router-dom';
import UserNavbar from './UserNavbar';
import UserFooter from './UserFooter';
import Breadcrumbs from '../../../components/Breadcrumbs';
import MandiAiAssistant from '../../../components/MandiAiAssistant';

export default function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-slate-800 relative">
      <UserNavbar />
      <Breadcrumbs />
      <main className="flex-grow">
        <Outlet />
      </main>
      <UserFooter />
      {/* Global MANDI AI Assistant Bot */}
      <MandiAiAssistant />
    </div>
  );
}


