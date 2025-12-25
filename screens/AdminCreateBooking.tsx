
import React from 'react';
import { BackButton } from '../components/Navigation';

const AdminCreateBooking: React.FC = () => {
  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen pb-24">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 flex items-center bg-background-dark/95 backdrop-blur-md p-4 border-b border-[#393528]">
          <BackButton />
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">New Reservation</h2>
        </header>

        <main className="flex-1 flex flex-col p-4 gap-6">
          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary px-1">Client Information</h3>
            <div className="grid gap-3">
              <input className="bg-surface-dark rounded-lg px-4 py-3 border-none text-white w-full focus:ring-1 focus:ring-primary" placeholder="Full Name" type="text"/>
              <input className="bg-surface-dark rounded-lg px-4 py-3 border-none text-white w-full focus:ring-1 focus:ring-primary" placeholder="Phone Number" type="tel"/>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary px-1">Trip Details</h3>
            <div className="grid gap-3">
              <input className="bg-surface-dark rounded-lg px-4 py-3 border-none text-white w-full focus:ring-1 focus:ring-primary" placeholder="Pickup Address" type="text"/>
              <input className="bg-surface-dark rounded-lg px-4 py-3 border-none text-white w-full focus:ring-1 focus:ring-primary" placeholder="Dropoff Address" type="text"/>
              <div className="flex gap-3">
                <input className="flex-1 bg-surface-dark rounded-lg px-4 py-3 border-none text-white focus:ring-1 focus:ring-primary" type="date"/>
                <input className="flex-1 bg-surface-dark rounded-lg px-4 py-3 border-none text-white focus:ring-1 focus:ring-primary" type="time"/>
              </div>
            </div>
          </section>
        </main>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-dark/95 backdrop-blur border-t border-[#393528] max-w-md mx-auto z-50">
          <button className="w-full bg-primary hover:bg-yellow-400 text-background-dark font-bold text-lg py-4 rounded-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
            Create Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateBooking;
