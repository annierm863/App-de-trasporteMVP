import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes';

export const BackButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex size-10 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
    >
      <span className="material-symbols-outlined text-[24px]">arrow_back</span>
    </button>
  );
};

interface NavProps {
  active: string;
}

export const BottomNavClient: React.FC<NavProps> = ({ active }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-[#181611]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 z-50 max-w-md mx-auto">
    <div className="flex items-center justify-around">
      <Link to={ROUTES.CLIENT_HOME} className={`flex flex-col items-center gap-1 group w-16 ${active === 'home' ? 'text-primary' : 'text-gray-400'}`}>
        <span className={`material-symbols-outlined text-[26px] ${active === 'home' ? 'filled' : ''}`}>home</span>
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      <Link to={ROUTES.CLIENT_TRIPS} className={`flex flex-col items-center gap-1 group w-16 ${active === 'trips' ? 'text-primary' : 'text-gray-400'}`}>
        <span className={`material-symbols-outlined text-[26px] ${active === 'trips' ? 'filled' : ''}`}>history</span>
        <span className="text-[10px] font-medium">Trips</span>
      </Link>
      <Link to={ROUTES.CLIENT_PROFILE} className={`flex flex-col items-center gap-1 group w-16 ${active === 'profile' ? 'text-primary' : 'text-gray-400'}`}>
        <span className={`material-symbols-outlined text-[26px] ${active === 'profile' ? 'filled' : ''}`}>person</span>
        <span className="text-[10px] font-medium">Profile</span>
      </Link>
    </div>
  </div>
);

export const BottomNavAdmin: React.FC<NavProps> = ({ active }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-surface-dark/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 z-50 max-w-md mx-auto">
    <div className="flex justify-between items-center max-w-lg mx-auto">
      <Link to={ROUTES.ADMIN_DASHBOARD} className={`flex flex-col items-center gap-1 ${active === 'home' ? 'text-primary' : 'text-slate-400 hover:text-slate-200'}`}>
        <span className={`material-symbols-outlined ${active === 'home' ? 'filled' : ''}`}>dashboard</span>
        <span className="text-[10px] font-semibold">Home</span>
      </Link>
      <Link to={ROUTES.ADMIN_BOOKINGS} className={`flex flex-col items-center gap-1 ${active === 'bookings' ? 'text-primary' : 'text-slate-400 hover:text-slate-200'}`}>
        <span className={`material-symbols-outlined ${active === 'bookings' ? 'filled' : ''}`}>calendar_today</span>
        <span className="text-[10px] font-medium">Bookings</span>
      </Link>
      <Link to={ROUTES.ADMIN_CLIENTS} className={`flex flex-col items-center gap-1 ${active === 'clients' ? 'text-primary' : 'text-slate-400 hover:text-slate-200'}`}>
        <span className={`material-symbols-outlined ${active === 'clients' ? 'filled' : ''}`}>group</span>
        <span className="text-[10px] font-medium">Clients</span>
      </Link>
      <Link to={ROUTES.ADMIN_SETTINGS} className={`flex flex-col items-center gap-1 ${active === 'settings' ? 'text-primary' : 'text-slate-400 hover:text-slate-200'}`}>
        <span className={`material-symbols-outlined ${active === 'settings' ? 'filled' : ''}`}>settings</span>
        <span className="text-[10px] font-medium">Settings</span>
      </Link>
    </div>
  </div>
);
