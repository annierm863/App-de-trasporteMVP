
import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes';
import { BackButton, BottomNavAdmin } from '../components/Navigation';

const AdminSettings: React.FC = () => {
  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-4 bg-background-dark/95 backdrop-blur-md border-b border-white/5">
          <BackButton />
          <h1 className="text-lg font-bold flex-1 text-center pr-10">Global Settings</h1>
        </div>

        <main className="flex-1 px-5 py-6 space-y-8">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Policies</h2>
            <Link to={ROUTES.ADMIN_RATES} className="block w-full rounded-xl bg-surface-dark p-4 border border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors">
              <span>Manage Rates</span>
              <span className="material-symbols-outlined text-primary">chevron_right</span>
            </Link>
            <div className="block w-full rounded-xl bg-surface-dark p-4 border border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
              <span>Cancellation Rules</span>
              <span className="material-symbols-outlined text-primary">chevron_right</span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">System</h2>
            <div className="block w-full rounded-xl bg-surface-dark p-4 border border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
              <span>Push Notifications</span>
              <div className="w-12 h-6 bg-primary rounded-full relative">
                <div className="absolute right-1 top-1 size-4 bg-background-dark rounded-full"></div>
              </div>
            </div>
          </div>
        </main>
        <BottomNavAdmin active="settings" />
      </div>
    </div>
  );
};

export default AdminSettings;
