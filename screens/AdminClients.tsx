
import React from 'react';
import { Link } from 'react-router-dom';
import { BackButton, BottomNavAdmin } from '../components/Navigation';

const AdminClients: React.FC = () => {
  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen pb-24">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <header className="bg-background-dark p-4 pb-2 flex items-center justify-between z-10 sticky top-0 border-b border-[#393528]">
          <BackButton />
          <h2 className="text-white text-lg font-bold">Client Database</h2>
          <div className="size-10"></div>
        </header>

        <main className="flex-1 flex flex-col overflow-hidden relative p-4 space-y-3">
          {[
            { id: 1, name: 'Alexander Hamilton', phone: '+1 (555) 123-4567', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbsoejBYrCe9ydqF4Z_nVt1QA7b3kV3oMEZpTZanA57Z-vsfo-EKFL2bYvTQrVphos49AlrdLc5yHDIi2P0lxa7p7u3soh4GO3-TpBKicTGtWHNXM6PYcSQLyFP4lT9CXd6cZt7szihItX1fR_1jQV4VAWwmKfGTtL0LkNhGe1UesvQ9fWABtgRNZAWBPYcMpZoYNjd1jiM00gKd0XkAQeEemggS67gZOx1k_0rVLzh3_KPinmQi2aNEQ4hZ8dzDEFtUPZU9I-G2w' },
            { id: 2, name: 'Elizabeth Schuyler', phone: '+1 (555) 987-6543', avatar: 'https://picsum.photos/id/1011/150/150' },
            { id: 3, name: 'Aaron Burr', phone: '+1 (555) 444-3333', avatar: 'https://picsum.photos/id/1025/150/150' }
          ].map(client => (
            <Link 
              key={client.id}
              to={`/admin/client/${client.id}`} 
              className="w-full group flex items-center gap-4 bg-[#2C2C2C] p-3 rounded-xl border border-transparent shadow-sm hover:bg-[#363636] transition-all duration-200 text-left"
            >
              <div className="relative shrink-0">
                <div 
                  className="bg-center bg-no-repeat bg-cover rounded-full h-14 w-14 border border-white/5" 
                  style={{backgroundImage: `url("${client.avatar}")`}}
                ></div>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-white text-base font-semibold truncate group-hover:text-primary transition-colors">{client.name}</p>
                <p className="text-[#bab29c] text-sm truncate">{client.phone}</p>
              </div>
              <span className="material-symbols-outlined text-white/20 group-hover:text-primary transition-colors">chevron_right</span>
            </Link>
          ))}
        </main>
        <BottomNavAdmin active="clients" />
      </div>
    </div>
  );
};

export default AdminClients;
