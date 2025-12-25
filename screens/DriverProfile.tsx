
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes';
import { BackButton } from '../components/Navigation';

const DriverProfile: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <div className="sticky top-0 z-50 flex items-center bg-background-dark/95 backdrop-blur-md p-4 border-b border-border-dark/30 justify-between">
          <BackButton />
          <h2 className="text-white text-lg font-bold flex-1 text-center">Driver Profile</h2>
          <Link to={ROUTES.LOGIN} className="flex w-12 items-center justify-end text-text-secondary">
            <span className="material-symbols-outlined">logout</span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col pb-24">
          <div className="flex flex-col items-center pt-8 pb-6 px-4">
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full h-32 w-32 ring-4 ring-surface-dark shadow-xl border-2 border-primary/20"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC9RuViuFB44xGjrGR8SQR55FzDoEgCEXLN7qKDqxt-zflI0iqRac28nmFyRVmdE-YbDDORkk9iMjZ9mvLhAz1CKpM7VeRupvNFiAhoAk64iBgKP4KaCWPdQ9-eqnMmrkHK_LU9hwVsWi6NQYMRu8Xp2Gl-QJTDywEFmUIX07A57l11SuKdxnRInVLWKthF0fmRzQZgmyyZbkqVp3bvaeu0MjEiay6OXE7OvRT2cbIt55WX8W1Br4F3DqGotpQIBeBq3VSYICxVdSA")' }}
            ></div>
            <h1 className="mt-4 text-white text-[22px] font-bold">James Anderson</h1>
            <p className="text-text-subtle text-sm">Mercedes-Benz S-Class • LUX-555</p>
          </div>

          <div className="px-4 mb-2">
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className="w-full bg-surface-dark rounded-xl p-4 border border-border-dark/50 flex items-center justify-between transition-all active:scale-95"
            >
              <span className="text-white font-semibold text-lg">{isAvailable ? 'Available' : 'Offline'}</span>
              <div className={`w-6 h-6 rounded-full ${isAvailable ? 'bg-primary shadow-[0_0_10px_rgba(244,192,37,0.5)]' : 'bg-red-500'}`}></div>
            </button>
          </div>

          <div className="mt-8 px-4 grid grid-cols-2 gap-4">
            <div className="bg-surface-dark p-5 rounded-2xl border border-white/5">
              <span className="material-symbols-outlined text-primary mb-2">trending_up</span>
              <p className="text-2xl font-bold">$342</p>
              <p className="text-xs text-text-subtle uppercase tracking-widest font-bold">Today's Earnings</p>
            </div>
            <div className="bg-surface-dark p-5 rounded-2xl border border-white/5">
              <span className="material-symbols-outlined text-primary mb-2">stars</span>
              <p className="text-2xl font-bold">4.9</p>
              <p className="text-xs text-text-subtle uppercase tracking-widest font-bold">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
