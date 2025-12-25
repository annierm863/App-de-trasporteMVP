
import React from 'react';
import { BackButton } from '../components/Navigation';

const AdminRateDetail: React.FC = () => {
  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <div className="flex items-center justify-between p-4 pb-2 bg-background-dark sticky top-0 z-20 border-b border-white/5">
          <BackButton />
          <h2 className="text-white text-lg font-bold flex-1 text-center pr-10">Edit Rate</h2>
        </div>

        <div className="flex flex-col gap-6 px-4 pt-6">
          <label className="flex flex-col w-full">
            <p className="text-white/80 text-base font-medium pb-2">Rate Name</p>
            <input className="rounded-lg text-white border-none bg-[#393528] h-14 p-4 text-base focus:ring-1 focus:ring-primary" defaultValue="Standard SUV Hourly"/>
          </label>
          <label className="flex flex-col w-full">
            <p className="text-white/80 text-base font-medium pb-2">Price</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">$</span>
              <input className="rounded-lg text-white border-none bg-[#393528] h-14 pl-8 p-4 text-base w-full focus:ring-1 focus:ring-primary" defaultValue="95.00"/>
            </div>
          </label>
          <button className="w-full h-14 bg-primary rounded-xl text-[#221e10] font-bold text-base shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all mt-4">
            Save Rate
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRateDetail;
