
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BackButton, BottomNavAdmin } from '../components/Navigation';
import { getAdminClients } from '../services/bookingService';

const AdminClients: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'spend' | 'rides'>('all');

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const data = await getAdminClients({
          sortBy: activeFilter === 'all' ? 'recent' : activeFilter,
          searchQuery
        });
        setClients(data);
      } catch (error) {
        console.error('Error loading clients:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchClients();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [activeFilter, searchQuery]);

  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen pb-24">
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
        <header className="sticky top-0 z-30 bg-background-dark/95 backdrop-blur-md shadow-none border-b border-white/5">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <BackButton />
              <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-white">Client Database</h2>
            </div>
            <div
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer ${isSearchVisible ? 'bg-primary text-background-dark' : 'hover:bg-white/10 text-white'}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
                {isSearchVisible ? 'close' : 'search'}
              </span>
            </div>
          </div>

          {/* Animated Search Bar */}
          <div className={`overflow-hidden transition-[height] duration-300 ease-in-out ${isSearchVisible ? 'h-16' : 'h-0'}`}>
            <div className="px-4 pb-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-symbols-outlined text-white/40">search</span>
                </span>
                <input
                  type="text"
                  placeholder="Search client name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-dark border border-white/10 text-white rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-white/20 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar border-b border-white/5 snap-x">
            {[
              { id: 'all', label: 'All' },
              { id: 'spend', label: 'Top Spenders' },
              { id: 'rides', label: 'Most Active' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`flex h-8 shrink-0 items-center justify-center px-4 rounded-full transition-colors snap-start ${activeFilter === filter.id
                  ? 'bg-white text-black font-extrabold'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
              >
                <span className="text-xs font-bold capitalize">{filter.label}</span>
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 flex flex-col relative p-4 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/50">
              <span className="size-8 border-2 border-white/20 border-t-primary rounded-full animate-spin mb-4"></span>
              <p className="text-sm">Loading clients...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/50 text-center">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">person_off</span>
              <p className="text-sm font-medium">No clients found</p>
            </div>
          ) : (
            clients.map(client => (
              <Link
                key={client.id}
                to={`/admin/client/${client.id}`}
                className="w-full group flex items-center gap-4 bg-[#2C2C2C] p-3 rounded-xl border border-transparent shadow-sm hover:bg-[#363636] transition-all duration-200 text-left active:scale-[0.98]"
              >
                <div className="relative shrink-0">
                  <div
                    className="bg-center bg-no-repeat bg-cover rounded-full h-14 w-14 border border-white/5 lazy-image"
                    style={{ backgroundImage: `url("${client.avatar}")` }}
                  ></div>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-white text-base font-semibold truncate group-hover:text-primary transition-colors">{client.name}</p>
                    {client.totalSpend > 500 && (
                      <span className="text-[10px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded border border-primary/20">VIP</span>
                    )}
                  </div>
                  <p className="text-[#bab29c] text-sm truncate">{client.phone}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">directions_car</span>
                      {client.totalRides} Rides
                    </span>
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">payments</span>
                      ${client.totalSpend.toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-white/20 group-hover:text-primary transition-colors">chevron_right</span>
              </Link>
            ))
          )}
        </main>
        <BottomNavAdmin active="clients" />
      </div>
    </div>
  );
};

export default AdminClients;
