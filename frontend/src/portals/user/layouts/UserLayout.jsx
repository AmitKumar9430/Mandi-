import React from 'react';
import { Outlet } from 'react-router-dom';
import UserNavbar from './UserNavbar';
import UserFooter from './UserFooter';
import WelcomingStrip from '../../../components/WelcomingStrip';
import MandiAiAssistant from '../../../components/MandiAiAssistant';

export default function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50 font-sans text-stone-900 relative">
      <UserNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <WelcomingStrip />
      <UserFooter />
      {/* Global Floating MANDI AI Assistant Bot */}
      <MandiAiAssistant />
    </div>
  );
}

