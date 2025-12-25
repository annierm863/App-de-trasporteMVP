
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BottomNavClient } from '../components/Navigation';

const ClientTrips: React.FC = () => {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen">
      <div className="relative flex flex-col max-w-md mx-auto min-h-screen pb-24">
        <div className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-white/5 pt-12 pb-4 px-6 flex items-center justify-between">
          <h1 className="text-white text-xl font-bold tracking-tight">My Trips</h1>
          <button className="text-white/70 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">sort</span>
          </button>
        </div>
        
        <div className="flex-1 flex flex-col px-4 pt-6 space-y-6">
          <div className="bg-surface-dark p-1 rounded-xl flex items-center">
            <button 
              onClick={() => setTab('upcoming')}
              className={`flex-1 py-2.5 px-4 rounded-lg transition-all duration-200 ${tab === 'upcoming' ? 'bg-primary text-background-dark shadow-sm' : 'text-[#bab29c] hover:text-white'}`}
            >
              <span className="text-sm font-bold">Upcoming</span>
            </button>
            <button 
              onClick={() => setTab('past')}
              className={`flex-1 py-2.5 px-4 rounded-lg transition-all duration-200 ${tab === 'past' ? 'bg-primary text-background-dark shadow-sm' : 'text-[#bab29c] hover:text-white'}`}
            >
              <span className="text-sm font-medium">Past</span>
            </button>
          </div>

          <div className="space-y-4">
            {tab === 'upcoming' ? (
              <Link to="/client/trip-live/1" className="block group relative bg-[#2c2920] rounded-xl p-5 border border-white/5 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-black/20">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center justify-start pt-1 min-w-[50px]">
                    <span className="text-2xl font-bold text-white leading-none">24</span>
                    <span className="text-xs font-semibold text-primary/80 uppercase mt-1">Oct</span>
                    <div className="mt-2 text-[10px] text-gray-400 font-medium">10:00 AM</div>
                  </div>
                  <div className="w-[1px] bg-white/10 my-1"></div>
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col"><span className="text-xs font-medium text-gray-400">Booking #8392</span></div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-900/30 text-green-400 border border-green-900/50 uppercase tracking-wide">Confirmed</span>
                    </div>
                    <div className="relative pl-2">
                      <div className="absolute left-[3.5px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-primary/50 to-white/20"></div>
                      <div className="flex flex-col gap-4">
                        <div className="relative flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(244,192,37,0.6)] z-10"></div>
                          <div><p className="text-white text-sm font-medium leading-tight">JFK Terminal 4</p><p className="text-gray-500 text-xs truncate max-w-[180px]">Queens, NY 11430</p></div>
                        </div>
                        <div className="relative flex items-center gap-3">
                          <div className="w-2 h-2 rounded-none rotate-45 border border-white/60 bg-[#2c2920] z-10"></div>
                          <div><p className="text-white text-sm font-medium leading-tight">The Plaza Hotel</p><p className="text-gray-500 text-xs truncate max-w-[180px]">5th Avenue</p></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="text-center py-12">
                <div className="size-20 rounded-full bg-surface-dark flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <span className="material-symbols-outlined text-white/20 text-4xl">history</span>
                </div>
                <p className="text-text-subtle text-sm">No past trips found.</p>
              </div>
            )}
          </div>
        </div>
        <BottomNavClient active="trips" />
      </div>
    </div>
  );
};

export default ClientTrips;
