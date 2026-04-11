import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PartnerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Mocking partner data if not present (to prevent crashes during development view)
  const partnerName = user?.name || "Acme Partner Corp";

  const navLinks = [
    { to: '/partner/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/partner/workers', icon: 'group', label: 'Worker Management' },
    { to: '/partner/applications', icon: 'description', label: 'Applications' },
    { to: '/partner/schemes', icon: 'account_balance', label: 'Schemes' },
    { to: '/partner/analytics', icon: 'monitoring', label: 'Analytics' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/partner-login');
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex selection:bg-primary-fixed">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full flex flex-col py-6 bg-white font-headline font-medium text-sm w-64 border-r border-surface-container z-40 transition-transform md:translate-x-0 -translate-x-full">
        {/* Partner Branding Header in Left Corner */}
        <div className="px-8 mb-8 pb-6 border-b border-surface-container">
          <h1 className="text-base font-bold text-indigo-900 truncate" title={partnerName}>
            {partnerName}
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Invisible India Partner</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-4 px-8 py-4 transition-all font-bold ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-900 border-r-4 border-indigo-900'
                    : 'text-slate-500 hover:text-indigo-900 hover:bg-slate-50'
                }`
              }
            >
              <span 
                className="material-symbols-outlined" 
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {link.icon}
              </span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="px-6 mt-auto space-y-2">
          <button 
            onClick={handleLogout}
            className="w-full py-4 px-6 flex items-center justify-center gap-2 bg-error-container text-on-error-container rounded-xl font-bold transition-colors hover:bg-error hover:text-white"
          >
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
