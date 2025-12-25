
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-dark text-white font-display antialiased h-screen overflow-y-auto">
      <div className="relative flex h-full w-full flex-col max-w-md mx-auto border-x border-border-dark/30 shadow-2xl shadow-black">
        <div className="relative w-full h-64 shrink-0">
          <div className="absolute inset-0 bg-center bg-no-repeat bg-cover" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAdM_forxy-DHZ9liL2vUM-Rd9veQg0y8xdCbTHmDBiibDvt-Qb24Y6lC5imrql3ecqU1ElnO-U_vz_4fNgBh38niBsVTAUrLeKpIbT77Gj-6aOR5A_NDyB97CSvnB9suRhRJ3vtRhxbku5KZTsVBXThl_uY6pEIlJKf1rnXVwe6ZUpQDMPeF2h6T8kGflxZG-emaUkWgYTXPsqVyr9Yrmo6gjqF5mW6rrZv_JoCKL8X0jhM7-bXmmXjPK-K-gxydWDyplkSjGeglg")'}}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#181611]"></div>
          <div className="absolute top-6 left-0 right-0 flex justify-center items-center">
            <div className="w-12 h-12 rounded-full bg-background-dark/80 backdrop-blur-sm border border-primary/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl filled">diamond</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col px-6 pb-8 -mt-6 relative z-10">
          <div className="pb-6 text-center">
            <h2 className="text-white tracking-tight text-3xl font-bold leading-tight">Access Your Journey</h2>
            <p className="text-text-subtle text-sm mt-2 font-body">Experience the ultimate in luxury travel.</p>
          </div>
          
          <div className="space-y-3 mb-6">
            <button onClick={() => navigate('/client/home')} className="w-full bg-primary hover:bg-primary-dark text-background-dark font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all flex justify-center items-center gap-2">
              <span>Log In as Client</span>
              <span className="material-symbols-outlined text-[20px]">person</span>
            </button>
            <button onClick={() => navigate('/driver/profile')} className="w-full bg-surface-dark hover:bg-surface-dark/80 border border-border-dark text-white font-bold text-lg py-3.5 rounded-xl transition-all flex justify-center items-center gap-2">
              <span>Log In as Driver</span>
              <span className="material-symbols-outlined text-[20px]">directions_car</span>
            </button>
            <button onClick={() => navigate('/admin/dashboard')} className="w-full bg-surface-dark hover:bg-surface-dark/80 border border-border-dark text-white font-bold text-lg py-3.5 rounded-xl transition-all flex justify-center items-center gap-2">
              <span>Log In as Admin</span>
              <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
            </button>
          </div>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-dark"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background-dark px-3 text-text-subtle font-medium">Demo Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
