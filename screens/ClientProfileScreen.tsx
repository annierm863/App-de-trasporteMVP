
import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes';
import { BackButton, BottomNavClient } from '../components/Navigation';

const ClientProfileScreen: React.FC = () => {
  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen">
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24 max-w-md mx-auto">
        <header className="flex items-center justify-between p-4 pb-2 sticky top-0 z-20 bg-background-dark/95 backdrop-blur-md">
          <BackButton />
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">My Profile</h2>
          <div className="size-10"></div>
        </header>

        <div className="flex flex-col items-center pt-4 pb-6 px-4">
          <div className="relative group cursor-pointer">
            <div
              className="size-28 rounded-full bg-cover bg-center border-2 border-[#2A271F] shadow-xl"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAU9DyvXRZFlxmqafFZ08mm1t6U_5lyCKuaCegfR1xbx21hp__uULA4joXsi9q4kbAR7IRe9BfTqRK7n6VjwklzzWrHVFD6hiJWXGrcRaLbWD1xkc-IMTkJq4k2rz40_He3gulUeuEyGgbve8Ahau_ASqXE-KHYPAwqtua_oY8fu5Q8w0NziGbjvfl3diQU-ZIcv5NB4b5QAsRfLL90AVKo97Y-P89l74BGqQpPSxiY4lLunQ5Elw29grmsoi2Z8MO8UcTMg3miHV0")' }}
            ></div>
            <div className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-black shadow-lg flex items-center justify-center border-2 border-background-dark">
              <span className="material-symbols-outlined text-[18px] font-bold">photo_camera</span>
            </div>
          </div>
          <button className="mt-3 text-primary text-sm font-semibold tracking-wide hover:underline">Change Photo</button>
        </div>

        <div className="flex flex-col gap-5 px-4 max-w-[480px] w-full mx-auto">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#bab29c] ml-1">Full Name</span>
            <div className="relative flex items-center">
              <input className="w-full bg-input-bg border-none rounded-xl h-14 px-4 text-base font-medium text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm" type="text" defaultValue="Jonathan Doe" />
              <span className="material-symbols-outlined absolute right-4 text-slate-500 pointer-events-none">edit</span>
            </div>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#bab29c] ml-1">Phone Number</span>
            <div className="relative flex items-center">
              <input className="w-full bg-input-bg border-none rounded-xl h-14 px-4 text-base font-medium text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm" type="tel" defaultValue="+1 (555) 012-3456" />
              <span className="material-symbols-outlined absolute right-4 text-slate-500 pointer-events-none">call</span>
            </div>
          </label>
        </div>

        <div className="flex flex-col mt-8 px-4 gap-3 max-w-[480px] w-full mx-auto">
          <Link to={ROUTES.CLIENT_SERVICE_INFO} className="flex items-center justify-between p-4 bg-input-bg/50 rounded-xl active:bg-input-bg transition-colors border border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-8 rounded-full bg-white/10 text-white">
                <span className="material-symbols-outlined text-[18px]">info</span>
              </div>
              <span className="text-base font-medium">Service Info</span>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </Link>
          <Link to={ROUTES.CLIENT_TERMS} className="flex items-center justify-between p-4 bg-input-bg/50 rounded-xl active:bg-input-bg transition-colors border border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-8 rounded-full bg-white/10 text-white">
                <span className="material-symbols-outlined text-[18px]">gavel</span>
              </div>
              <span className="text-base font-medium">Terms & Policies</span>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </Link>
        </div>

        <div className="mt-auto px-4 pt-8 pb-4 w-full max-w-[480px] mx-auto flex flex-col items-center gap-4">
          <Link to={ROUTES.LOGIN} className="flex items-center gap-2 px-6 py-2 text-rose-400 text-sm font-semibold rounded-lg hover:bg-rose-500/10 transition-colors">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Log Out
          </Link>
        </div>
        <BottomNavClient active="profile" />
      </div>
    </div>
  );
};

export default ClientProfileScreen;
