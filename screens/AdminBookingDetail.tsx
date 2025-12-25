
import React from 'react';
import { BackButton } from '../components/Navigation';

const AdminBookingDetail: React.FC = () => {
  return (
    <div className="bg-[#181611] text-white font-display antialiased min-h-screen pb-24">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <div className="sticky top-0 z-50 flex items-center bg-[#181611]/95 backdrop-blur-sm p-4 pb-2 justify-between border-b border-[#393528]">
          <BackButton />
          <div className="flex flex-col items-center">
            <h2 className="text-white text-lg font-bold leading-tight">Booking #4829</h2>
            <span className="text-[#bab29c] text-xs">Oct 24 • 10:00 AM</span>
          </div>
          <div className="flex w-12 justify-end">
            <button className="text-primary font-bold">Save</button>
          </div>
        </div>

        <div className="flex flex-col gap-6 px-4 pt-6 w-full">
          <div className="flex flex-col items-center gap-2">
             <div className="flex h-8 items-center justify-center gap-x-2 rounded-full bg-primary/20 pl-3 pr-4 border border-primary/30">
                <span className="material-symbols-outlined text-primary text-[20px] filled">check_circle</span>
                <p className="text-primary text-sm font-bold leading-normal uppercase tracking-wide">Confirmed</p>
            </div>
          </div>

          <div className="bg-background-dark rounded-xl border border-[#393528] p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-white text-base font-bold">Client Info</h3>
              <span className="bg-[#393528] text-[#bab29c] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide">VIP</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBAF7wlTfpwRpIGZ_M08w9rYrPrirXEy5kZdnLwrK75Kswx32OASDxqBm655qhpetjJHkgG_EACTaUyE1rqBi2t-mB9YcOju4FKL91A9C7Eufu6C0AXNGh19aBSArcsC75QyJLhtgIBmKkgCrdfD7AV51peX_h4Y_HH0hR3mOMWjepttvw_KAtBbqGpCcGQJj1JKXcmwtyIf0F5cK6FsIdta9RiBNEgTtq0fuXhX6SgVEi0H-g2JI8TZTvUu0SsPLcVhH5KBGFuFA" 
                  className="w-full h-full object-cover"
                  alt="Client"
                />
              </div>
              <div><p className="text-lg font-bold text-white">Alexander Pierce</p></div>
            </div>
          </div>

          <div className="bg-background-dark rounded-xl border border-[#393528] overflow-hidden">
            <h3 className="text-white text-base font-bold px-4 py-3 bg-surface-dark/50 border-b border-[#393528]">Assignment</h3>
            <div className="p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[#bab29c] text-xs font-bold uppercase tracking-wider pl-1">Driver</label>
                <select className="w-full bg-surface-dark text-white rounded-lg p-3 border border-[#393528]">
                  <option>Michael Schumacher</option>
                  <option>Lewis Hamilton</option>
                  <option>Ayrton Senna</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDetail;
