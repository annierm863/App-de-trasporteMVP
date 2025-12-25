
import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes';
import { BottomNavAdmin } from '../components/Navigation';

const AdminBookings: React.FC = () => {
  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen pb-24">
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
        <header className="sticky top-0 z-30 bg-background-dark/95 backdrop-blur-md shadow-none border-b border-white/5">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-white">Bookings</h2>
            <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-white" style={{ fontSize: "28px" }}>search</span>
            </div>
          </div>
          <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar border-b border-white/5">
            <button className="flex h-8 shrink-0 items-center justify-center px-4 rounded-full bg-white text-background-dark"><span className="text-xs font-bold">All</span></button>
            <button className="flex h-8 shrink-0 items-center justify-center px-4 rounded-full bg-white/10 text-gray-300"><span className="text-xs font-medium">Requested</span></button>
            <button className="flex h-8 shrink-0 items-center justify-center px-4 rounded-full bg-white/10 text-gray-300"><span className="text-xs font-medium">Confirmed</span></button>
          </div>
        </header>

        <main className="flex-1 px-4 pt-4">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-3">Today, Oct 24</h3>
            <div className="flex flex-col gap-3">
              <Link to={ROUTES.ADMIN_BOOKING_DETAIL.replace(':id', '1')} className="group relative flex flex-col gap-3 rounded-xl bg-surface-dark p-4 shadow-sm border border-white/5 active:scale-[0.98] transition-transform">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400" style={{ fontSize: "20px" }}>schedule</span>
                    <span className="text-lg font-bold text-white">10:00 AM</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
                    <span className="text-xs font-bold text-primary uppercase tracking-wide">On the way</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 relative pl-3 border-l-2 border-white/10 ml-1 py-1">
                  <div className="flex flex-col"><span className="text-xs text-gray-400 font-medium uppercase">Pickup</span><span className="text-sm font-medium text-gray-200 truncate">JFK Airport</span></div>
                  <div className="flex flex-col"><span className="text-xs text-gray-400 font-medium uppercase">Dropoff</span><span className="text-sm font-medium text-gray-200 truncate">The Plaza Hotel</span></div>
                </div>
              </Link>
            </div>
          </div>
        </main>

        <Link to={ROUTES.ADMIN_CREATE_BOOKING} className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-black/40 hover:scale-110 active:scale-95 transition-all duration-200">
          <span className="material-symbols-outlined text-background-dark font-bold" style={{ fontSize: "32px" }}>add</span>
        </Link>
        <BottomNavAdmin active="bookings" />
      </div>
    </div>
  );
};

export default AdminBookings;
