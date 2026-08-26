import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();

  if (location.pathname === '/' || location.pathname === '/user/home') {
    return null; // Homepage has its own hero section
  }

  const pathnames = location.pathname.split('/').filter((x) => x);

  const routeNameMap = {
    'mandi-prices': 'Mandi Prices',
    'market-directory': 'Market Directory',
    'auctions': 'Auctions',
    'gov-schemes': 'Government Schemes',
    'notices': 'Notices',
    'grievance': 'Grievance Portal',
    'reports': 'Reports & Analytics',
    'trader-dashboard': 'Trader Dashboard',
    'user': 'User Portal',
    'agriculture': 'Commodities & Agriculture',
    'bookings': 'Transport Services',
    'profile': 'My Account Profile',
    'dashboard': 'Citizen Dashboard'
  };

  return (
    <nav className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8 text-[11px] font-medium text-slate-500">
      <div className="max-w-7xl mx-auto flex items-center space-x-2 flex-wrap">
        <Link to="/" className="hover:text-[#DC2626] flex items-center space-x-1 font-semibold text-slate-700">
          <span>Home</span>
        </Link>

        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = routeNameMap[name.toLowerCase()] || decodeURIComponent(name).replace(/-/g, ' ');

          return (
            <React.Fragment key={routeTo}>
              <span className="text-slate-400 font-bold select-none">&gt;</span>
              {isLast ? (
                <span className="font-bold text-[#0A3663] capitalize">{displayName}</span>
              ) : (
                <Link to={routeTo} className="hover:text-[#DC2626] hover:underline capitalize text-slate-600">
                  {displayName}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}

