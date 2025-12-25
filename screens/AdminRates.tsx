
import React from 'react';
import { Link } from 'react-router-dom';
import { BackButton } from '../components/Navigation';

const AdminRates: React.FC = () => {
  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <header className="flex items-center px-4 py-4 bg-background-dark sticky top-0 z-10 border-b border-white/5">
          <BackButton />
          <h1 className="text-white text-xl font-bold ml-3">Rates Management</h1>
        </header>

        <main className="flex-1 flex flex-col p-4 gap-4">
          {[
            { id: 1, name: 'JFK to Manhattan', price: '$125.00' },
            { id: 2, name: 'LAX to Beverly Hills', price: '$145.00' },
            { id: 3, name: 'Standard SUV Hourly', price: '$95.00/hr' }
          ].map(rate => (
            <Link 
              key={rate.id}
              to={`/admin/rate/${rate.id}`} 
              className="group flex flex-col gap-3 rounded-xl bg-surface-dark p-4 border border-white/5 hover:border-primary/30 transition-all"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-white font-bold text-base">{rate.name}</h3>
                <span className="material-symbols-outlined text-gray-400">edit</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-lg font-bold">{rate.price}</span>
                <span className="text-green-400 text-xs font-semibold bg-green-500/10 px-2 py-1 rounded">Active</span>
              </div>
            </Link>
          ))}
        </main>
      </div>
    </div>
  );
};

export default AdminRates;
