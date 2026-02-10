import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BackButton } from '../components/Navigation';
import { getClientDetails } from '../services/bookingService';

const AdminClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const details = await getClientDetails(id);
        setData(details);
      } catch (error) {
        console.error('Error loading client details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleContact = (contact: string | undefined, type: 'phone' | 'email') => {
    if (!contact) return;
    if (type === 'phone') window.location.href = `tel:${contact}`;
    else window.location.href = `mailto:${contact}`;
  };

  if (loading) {
    return (
      <div className="bg-background-dark min-h-screen flex items-center justify-center text-white/50">
        <span className="size-8 border-2 border-white/20 border-t-primary rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-background-dark min-h-screen flex items-center justify-center text-white">
        Client not found
      </div>
    );
  }

  const { profile, stats, rides } = data;

  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen pb-24">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <header className="flex items-center px-4 py-4 justify-between sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md">
          <BackButton />
          <h2 className="text-white text-lg font-bold flex-1 text-center">Client Detail</h2>
          <div className="w-10"></div>
        </header>

        <main className="flex-1 overflow-y-auto pb-8">
          <div className="flex flex-col items-center pt-2 pb-6 px-4">
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full h-28 w-28 border-2 border-primary/20 shadow-lg mb-4 lazy-image"
              style={{ backgroundImage: `url("${profile.avatar}")` }}
            ></div>
            <h1 className="text-white text-2xl font-bold text-center mb-1">{profile.name}</h1>
            <p className="text-text-secondary text-base text-center mb-6">{profile.phone}</p>

            <div className="flex gap-3 mb-2">
              <button
                onClick={() => handleContact(profile.phone, 'phone')}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm font-bold hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                Call
              </button>
              <button
                onClick={() => handleContact(profile.email, 'email')}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm font-bold hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">mail</span>
                Email
              </button>
            </div>
          </div>

          <div className="px-6 space-y-6">
            <div className="bg-surface-dark rounded-xl p-5 border border-white/5">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Total Activity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">{stats.totalRides}</span>
                  <span className="text-xs text-text-subtle">Completed Trips</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">${stats.totalSpend.toLocaleString()}</span>
                  <span className="text-xs text-text-subtle">Lifetime Spend</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-dark rounded-xl p-5 border border-white/5">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Preferences</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Default Vehicle</span>
                  <span className="text-sm font-bold">SUV Luxury</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Member Since</span>
                  <span className="text-sm font-bold">{profile.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-dark rounded-xl p-5 border border-white/5">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {rides.length === 0 ? (
                  <p className="text-sm text-gray-400">No rides history.</p>
                ) : (
                  rides.slice(0, 5).map((ride: any) => (
                    <div key={ride.id} className="flex flex-col gap-1 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-white">{ride.date}</span>
                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${ride.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                            ride.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-white/10 text-gray-400'
                          }`}>{ride.status}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {ride.time}
                      </div>
                      <p className="text-xs text-gray-300 truncate mt-1">To: {ride.dropoff}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminClientDetail;
