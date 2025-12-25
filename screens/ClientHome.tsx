
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { seedDatabase } from '../services/seed';
import { ROUTES } from '../routes';
import { BottomNavClient } from '../components/Navigation';
import { getTravelAdvice } from '../services/geminiService';
import VoiceConcierge from '../components/VoiceConcierge';

const ClientHome: React.FC = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('point_to_point');
  const [passengers, setPassengers] = useState(2);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Form State
  const [pickup, setPickup] = useState('San Francisco Intl Airport');
  const [dropoff, setDropoff] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const handleAiAdvice = async () => {
    if (!aiQuery) return;
    setLoadingAi(true);
    const result = await getTravelAdvice(aiQuery);
    setAiResponse(result || '');
    setLoadingAi(false);
  };

  const handleSeed = async () => {
    if (confirm('Seed database with test data?')) {
      await seedDatabase();
      alert('Database seeded!');
    }
  };

  const handleRequestRide = async () => {
    if (!pickup || !dropoff) {
      alert('Please enter pickup and dropoff locations');
      return;
    }

    setIsBooking(true);
    try {
      // 1. Get the test client (James)
      // In a real app, this comes from auth context
      const clientId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

      // 2. Insert Booking
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          client_id: clientId,
          pickup_address: pickup,
          dropoff_address: dropoff,
          pickup_datetime: new Date().toISOString(),
          passengers: passengers,
          status: 'requested',
          estimated_fare_min: 85,
          estimated_fare_max: 110
        })
        .select()
        .single();

      if (error) throw error;

      // 3. Navigate to Ride Detail
      if (data) {
        navigate(ROUTES.CLIENT_RIDE_DETAIL.replace(':id', data.id));
      }

    } catch (err) {
      console.error('Booking failed:', err);
      alert('Failed to request ride. Make sure to seed the database first!');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-background-dark text-white font-display antialiased h-screen overflow-x-hidden pb-20">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <header className="flex items-center p-6 pb-2 justify-between">
          <Link to={ROUTES.CLIENT_PROFILE} className="flex items-center gap-3">
            <div className="relative">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBk71eS28oa5TXQ3AuyHHKX9t4gnbAKXtKgQkjDIJ0Qd510B290iFfENFK4v2lwIIivMPmyG4b64kZU3p9g4w3yjLiB23Ery2tvlgfYtnzxSjetI7j3Dmgm2XvA3AdTlALvPhwsqP_agzqahHSVFSNsBZhZnaGulwF0GJrxeLmjAoH9rVY2UtheqW05tNkGAwbP1dpPbd-1tgi6PCG_XVHDlybNOCqw_YWKaHRy4iJYQ-jCtr8WNSl9tGK89zPlTPF0zi5-sB5cx4c")' }}></div>
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-background-dark"></div>
            </div>
            <div>
              <h2 className="text-white text-base font-medium leading-tight">Good evening,</h2>
              <h1 className="text-primary text-xl font-bold leading-tight">James</h1>
            </div>
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handleSeed}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-400 hover:text-white"
              title="Dev: Seed DB"
            >
              SEED
            </button>
            <button
              onClick={() => setShowVoiceModal(true)}
              className="p-2 rounded-full bg-primary text-background-dark hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-[24px] filled">mic</span>
            </button>
            <button
              onClick={() => setShowAiModal(true)}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2 px-3"
            >
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col px-6 pb-32">
          <div className="py-4">
            <h2 className="text-white text-3xl font-bold leading-tight tracking-tight">Book your<br /><span className="text-white/50">private ride</span></h2>
          </div>

          <div className="py-4">
            <div className="flex h-12 w-full items-center justify-center rounded-xl bg-surface-dark p-1">
              {['Airport', 'Point to point', 'Hourly'].map((type) => {
                const value = type.toLowerCase().replace(/ /g, '_');
                return (
                  <button
                    key={value}
                    onClick={() => setTripType(value)}
                    className={`flex-1 h-full rounded-lg text-sm font-semibold transition-all duration-300 ${tripType === value ? 'bg-primary text-background-dark' : 'text-text-subtle hover:text-white'
                      }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-5 mt-2">
            <div className="relative flex flex-col gap-4">
              <div className="absolute left-[22px] top-[40px] bottom-[40px] w-0.5 border-l-2 border-dashed border-white/10 z-0"></div>
              <div className="relative z-10 group">
                <label className="block text-text-subtle text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Pickup</label>
                <div className="flex w-full items-center rounded-xl bg-surface-dark border border-white/5 group-focus-within:border-primary/50 group-focus-within:bg-surface-dark/80 transition-all">
                  <div className="flex items-center justify-center pl-4 pr-3 text-primary">
                    <span className="material-symbols-outlined filled text-[20px]">my_location</span>
                  </div>
                  <input
                    className="w-full bg-transparent border-none text-white placeholder-text-subtle/50 h-14 focus:ring-0 text-base font-medium"
                    placeholder="Current Location"
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                  />
                </div>
              </div>
              <div className="relative z-10 group">
                <label className="block text-text-subtle text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Dropoff</label>
                <div className="flex w-full items-center rounded-xl bg-surface-dark border border-white/5 group-focus-within:border-primary/50 group-focus-within:bg-surface-dark/80 transition-all">
                  <div className="flex items-center justify-center pl-4 pr-3 text-white/40 group-focus-within:text-primary">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                  </div>
                  <input
                    className="w-full bg-transparent border-none text-white placeholder-text-subtle/50 h-14 focus:ring-0 text-base font-medium"
                    placeholder="Where to?"
                    type="text"
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-text-subtle text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Date</label>
                <div className="flex w-full items-center rounded-xl bg-surface-dark border border-white/5 focus-within:border-primary/50 transition-colors h-14 px-4 cursor-pointer hover:bg-white/5">
                  <span className="material-symbols-outlined text-primary text-[20px] mr-3">calendar_month</span>
                  <span className="text-white font-medium">Today</span>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-text-subtle text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Time</label>
                <div className="flex w-full items-center rounded-xl bg-surface-dark border border-white/5 focus-within:border-primary/50 transition-colors h-14 px-4 cursor-pointer hover:bg-white/5">
                  <span className="material-symbols-outlined text-primary text-[20px] mr-3">schedule</span>
                  <span className="text-white font-medium">Now</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-dark border border-white/5">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-text-subtle">group</span>
                <span className="text-white font-medium">Passengers</span>
              </div>
              <div className="flex items-center gap-4 bg-background-dark rounded-lg p-1">
                <button
                  onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  className="size-8 flex items-center justify-center rounded-md bg-white/5 text-white hover:bg-white/10 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <span className="text-white font-bold w-4 text-center">{passengers}</span>
                <button
                  onClick={() => setPassengers(passengers + 1)}
                  className="size-8 flex items-center justify-center rounded-md bg-primary text-black hover:bg-primary/90 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        <div className="fixed bottom-20 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent max-w-md mx-auto z-10">
          <div className="mb-5 bg-[#2A261A] rounded-xl p-4 border-l-4 border-primary flex items-center justify-between shadow-lg backdrop-blur-sm border-white/5">
            <div>
              <p className="text-text-subtle text-[10px] font-bold uppercase tracking-widest mb-1">Estimated Fare</p>
              <p className="text-white text-2xl font-bold tracking-tight">$85 – $110</p>
            </div>
            <div className="size-10 rounded-full bg-white/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">info</span>
            </div>
          </div>
          <button
            onClick={handleRequestRide}
            disabled={isBooking}
            className="w-full bg-primary hover:bg-primary-dark active:scale-[0.98] text-background-dark font-bold text-lg py-4 rounded-xl shadow-[0_0_25px_rgba(244,192,37,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isBooking ? (
              <div className="size-6 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Request Ride</span>
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </>
            )}
          </button>
        </div>

        {showAiModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-surface-dark w-full max-w-md rounded-2xl p-6 border border-white/10 shadow-2xl animate-in slide-in-from-bottom-10">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <span className="material-symbols-outlined filled">auto_awesome</span>
                  </div>
                  <h3 className="text-lg font-bold">Smart Concierge</h3>
                </div>
                <button onClick={() => setShowAiModal(false)} className="text-white/40 hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-text-subtle mb-4">Ask about destinations, flight statuses, or luxury recommendations.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="e.g. Best luxury hotel in SF?"
                    className="flex-1 bg-background-dark border-none rounded-xl text-white placeholder:text-white/20 h-12 px-4 focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={handleAiAdvice}
                    disabled={loadingAi || !aiQuery}
                    className="size-12 rounded-xl bg-primary text-background-dark flex items-center justify-center disabled:opacity-50"
                  >
                    {loadingAi ? <div className="animate-spin size-5 border-2 border-background-dark border-t-transparent rounded-full" /> : <span className="material-symbols-outlined">send</span>}
                  </button>
                </div>
              </div>

              {aiResponse && (
                <div className="p-4 rounded-xl bg-background-dark border border-primary/10 mb-4 animate-in fade-in slide-in-from-bottom-2">
                  <p className="text-sm leading-relaxed text-gray-200">{aiResponse}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {['Hotel recommendations', 'Airport advice', 'Local events'].map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => setAiQuery(prompt)}
                    className="text-[10px] font-bold uppercase tracking-widest text-primary/60 border border-primary/20 px-3 py-1.5 rounded-full hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {showVoiceModal && <VoiceConcierge onClose={() => setShowVoiceModal(false)} />}

        <BottomNavClient active="home" />
      </div>
    </div>
  );
};

export default ClientHome;
