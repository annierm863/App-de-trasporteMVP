
import React from 'react';
import { BackButton } from '../components/Navigation';

const TripLive: React.FC = () => {
  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto shadow-2xl">
        <header className="flex items-center justify-between p-4 pb-2 z-20 bg-background-dark/80 backdrop-blur-md sticky top-0 border-b border-white/5">
          <BackButton />
          <div className="flex flex-col items-center">
            <h2 className="text-white text-lg font-bold leading-tight tracking-tight">On Your Way</h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Ref #2938</span>
          </div>
          <button className="size-10 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10">
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </header>

        <main className="flex-1 flex flex-col gap-6 p-4 pb-24 overflow-y-auto z-10">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[4/3]">
            {/* Mock Animated Map */}
            <div className="absolute inset-0 bg-[#1e1c14]">
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                <path d="M0 20 L100 20 M0 50 L100 50 M0 80 L100 80 M20 0 L20 100 M50 0 L50 100 M80 0 L80 100" stroke="white" strokeWidth="0.5" fill="none" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    <path d="M50 250 Q 200 200 350 50" stroke="#f4c025" strokeWidth="4" fill="none" strokeDasharray="10,10" className="animate-[dash_20s_linear_infinite]" />
                    <circle cx="50" cy="250" r="8" fill="#f4c025" />
                    <circle cx="350" cy="50" r="8" fill="#f4c025" />
                    {/* Pulsing car location */}
                    <g transform="translate(180, 180)" className="animate-pulse">
                      <circle r="20" fill="#f4c025" fillOpacity="0.2" />
                      <circle r="4" fill="#f4c025" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4">
              <div className="flex h-8 items-center justify-center gap-x-2 rounded-full bg-background-dark/90 backdrop-blur-md border border-primary/30 pl-3 pr-4 shadow-lg">
                <div className="size-2 rounded-full bg-primary animate-pulse"></div>
                <p className="text-white text-[10px] font-bold uppercase tracking-widest">Live Updates</p>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent pt-12">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-primary text-[10px] uppercase font-bold tracking-widest mb-1">Estimated Arrival</span>
                  <span className="text-white text-3xl font-bold">12 mins</span>
                </div>
                <div className="bg-primary p-3 rounded-2xl shadow-xl shadow-primary/20">
                  <span className="material-symbols-outlined text-background-dark text-3xl filled">directions_car</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-dark rounded-2xl p-6 shadow-sm border border-white/10">
            <h3 className="text-white text-xs font-bold mb-6 uppercase tracking-[0.2em] opacity-50">Itinerary</h3>
            <div className="grid grid-cols-[32px_1fr] gap-x-3">
              <div className="flex flex-col items-center gap-1 pt-1">
                <span className="material-symbols-outlined text-primary text-[20px] filled">radio_button_checked</span>
                <div className="w-[2px] bg-gradient-to-b from-primary to-primary/20 h-full grow rounded-full my-1"></div>
              </div>
              <div className="flex flex-col pb-8">
                <div className="flex justify-between items-baseline">
                  <p className="text-white text-lg font-bold leading-tight">JFK Terminal 4</p>
                  <span className="text-primary text-xs font-bold">10:00 AM</span>
                </div>
                <p className="text-text-secondary text-sm mt-1">Pickup Point</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
              </div>
              <div className="flex flex-col pt-1">
                <div className="flex justify-between items-baseline">
                  <p className="text-white text-lg font-bold leading-tight">The Plaza Hotel</p>
                  <span className="text-white/40 text-xs font-medium">11:15 AM</span>
                </div>
                <p className="text-text-secondary text-sm mt-1">Destination</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-dark rounded-2xl p-4 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlBfISc9dVFruiQkDrTejmSI-n61nNsGt8lgVuvtXwE6UJjpbZCVMQ8pnZar3xUTi01V2tH_bwT-Sk8dqKTV0SjHcbZKahLQ7oEYJ5J2LEvTxzvJ2xxS-1NcxCCnMVow_1KTFv7nUk8Znq1HEqupUtomtFMdOPjRgOrj5apYA7LzX77_AuGMFTbsws5o5DPYs1t7XiTHoNBkg9idNB3fTyC-juxu66yDN4YTHtzMU5cBr3Iq7xwRF6-7Ze6jTPSpsza_zr_z8a4_o" alt="Driver" className="size-12 rounded-full border border-primary/20" />
              <div>
                <p className="font-bold">James Anderson</p>
                <div className="flex items-center gap-2 text-xs text-text-subtle">
                   <span className="material-symbols-outlined text-[12px] filled text-primary">star</span>
                   <span>4.9</span>
                   <span>•</span>
                   <span>Black S-Class</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"><span className="material-symbols-outlined text-[20px]">chat</span></button>
              <button className="size-10 rounded-full bg-primary flex items-center justify-center text-background-dark"><span className="material-symbols-outlined text-[20px] filled">call</span></button>
            </div>
          </div>
        </main>
      </div>
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
      `}</style>
    </div>
  );
};

export default TripLive;
