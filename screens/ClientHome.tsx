
import React, { useState, useEffect } from 'react';
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
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('Now');
  const [isBooking, setIsBooking] = useState(false);

  // Auth & Guest State
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [isGuest, setIsGuest] = useState(false);

  // Modals & Flows
  const [showGuestInfoModal, setShowGuestInfoModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Guest Info Form
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  // Payment State
  const [selectedPayment, setSelectedPayment] = useState<'cash' | 'zelle' | 'card'>('cash');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        fetchUserProfile(data.user.id);
      }
    });
  }, []);

  const fetchUserProfile = async (id: string) => {
    const { data } = await supabase.from('clients').select('is_guest, full_name, phone, email').eq('id', id).single();
    if (data) {
      if (data.is_guest) setIsGuest(true);

      // Populate local state
      if (data.full_name && data.full_name !== 'Guest Client') {
        setUserName(data.full_name.split(' ')[0]);
        setGuestName(data.full_name);
      } else {
        setUserName('Guest');
      }

      if (data.phone && data.phone !== '000-000-0000') setGuestPhone(data.phone);
      if (data.email) setGuestEmail(data.email);

      // Enforce Guest Profile Completion on Mount
      if (data.is_guest) {
        const isIncomplete = !data.full_name ||
          data.full_name === 'Guest Client' ||
          !data.phone ||
          data.phone === '000-000-0000' ||
          !data.email;

        if (isIncomplete) {
          setShowGuestInfoModal(true);
        }
      }
    }
  };

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

  // Step 1: Initiate Request
  const handleRequestRideClick = async () => {
    if (!pickup || !dropoff) {
      alert('Please enter pickup and dropoff locations');
      return;
    }

    if (!userId) {
      alert('You must be logged in to request a ride.');
      navigate(ROUTES.LOGIN);
      return;
    }

    // Check Guest Status & Info Readiness
    if (isGuest) {
      // Validate Limit
      const { count } = await supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('client_id', userId);
      if ((count || 0) >= 3) {
        alert('Guest Limit Reached.\n\nPlease sign up for a full account to enjoy unlimited premium travel.');
        return;
      }

      // Check if we have their info
      if (!guestName || !guestPhone || !guestEmail || guestName === 'Guest Client' || userName === 'Guest') {
        setShowGuestInfoModal(true);
        return;
      }
    }

    // If all good, proceed to payment
    setShowPaymentModal(true);
  };

  // Step 2: Save Guest Info (if needed)
  const handleSaveGuestInfo = async () => {
    if (!guestName || !guestPhone || !guestEmail) return alert('Name, Phone and Email are required.');

    try {
      const { error } = await supabase.from('clients').update({
        full_name: guestName,
        phone: guestPhone,
        email: guestEmail
      }).eq('id', userId);

      if (error) throw error;

      setUserName(guestName.split(' ')[0]); // Update header instantly
      setShowGuestInfoModal(false);
      // We don't automatically open payment modal here per requirements, we return to booking screen.
    } catch (err) {
      console.error('Error saving info:', err);
      alert('Could not save info. Please try again.');
    }
  };

  // Step 3: Finalize Booking
  const handleConfirmBooking = async () => {
    setIsBooking(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          client_id: userId,
          pickup_address: pickup,
          dropoff_address: dropoff,
          pickup_datetime: new Date().toISOString(), // In real app use selectedDate + selectedTime
          passengers: passengers,
          status: 'requested',
          estimated_fare_min: 85,
          estimated_fare_max: 110,
          payment_method: selectedPayment,
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setShowPaymentModal(false);

      // Success Message (Toast substitute)
      alert(`Booking Requested Successfully!\n\nBooking ID: ${data?.id}`);

      // Do NOT navigate, stay on screen per instructions
      // navigate(ROUTES.CLIENT_RIDE_DETAIL.replace(':id', data.id));

    } catch (err) {
      console.error('Booking failed:', err);
      alert('Failed to request ride. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-background-dark text-white font-display antialiased h-screen overflow-x-hidden pb-32">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <header className="flex items-center p-6 pb-2 justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-privaro.png" alt="Privaro" className="h-10 w-auto object-contain" />
            <div>
              <h1 className="text-white text-lg font-bold tracking-widest uppercase">PRIVARO</h1>
              <p className="text-[10px] text-primary tracking-[0.2em] uppercase">Luxe Ride</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link to={ROUTES.CLIENT_PROFILE} className="flex flex-col items-end mr-2">
              <span className="text-white/60 text-[10px] font-medium leading-tight">Welcome,</span>
              <span className="text-primary text-sm font-bold leading-tight">{userName || '...'}</span>
            </Link>
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

        <main className="flex-1 flex flex-col px-6">
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
                <div className="flex w-full items-center rounded-xl bg-surface-dark border border-white/5 focus-within:border-primary/50 transition-colors h-14 px-4 cursor-pointer hover:bg-white/5 relative">
                  <span className="material-symbols-outlined text-primary text-[20px] mr-3">calendar_month</span>
                  <input
                    type="text"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent border-none text-white w-full h-full focus:ring-0 p-0 font-medium"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-text-subtle text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Time</label>
                <div className="flex w-full items-center rounded-xl bg-surface-dark border border-white/5 focus-within:border-primary/50 transition-colors h-14 px-4 cursor-pointer hover:bg-white/5 relative">
                  <span className="material-symbols-outlined text-primary text-[20px] mr-3">schedule</span>
                  <input
                    type="text"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="bg-transparent border-none text-white w-full h-full focus:ring-0 p-0 font-medium"
                  />
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

            {/* MOVED: Estimated Fare & Request Button (In-flow) */}
            <div className="mt-6 mb-10 w-full">
              <div className="mb-5 bg-[#2A261A] rounded-xl p-4 border-l-4 border-[#f4c025] flex items-center justify-between shadow-lg backdrop-blur-sm border-white/5">
                <div>
                  <p className="text-text-subtle text-[10px] font-bold uppercase tracking-widest mb-1">Estimated Fare</p>
                  <p className="text-white text-2xl font-bold tracking-tight">$85 – $110</p>
                </div>
                <div className="size-10 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">info</span>
                </div>
              </div>
              <button
                onClick={handleRequestRideClick}
                disabled={isBooking}
                className="w-full bg-[#f4c025] hover:bg-[#dcb010] active:scale-[0.98] text-[#181611] font-bold text-lg py-4 rounded-xl shadow-[0_0_25px_rgba(244,192,37,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
          </div>
        </main>

        {/* --- GUEST INFO MODAL --- */}
        {showGuestInfoModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
            <div className="bg-surface-dark w-full max-w-sm rounded-2xl p-6 border border-white/10 shadow-2xl animate-in fade-in zoom-in-95">
              <h3 className="text-xl font-bold text-white mb-2">Guest Check-in</h3>
              <p className="text-sm text-white/60 mb-6">Please provide your contact details so your chauffeur can reach you.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase font-bold text-text-subtle mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    className="w-full bg-background-dark border border-white/10 rounded-lg h-12 px-4 text-white focus:border-primary"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold text-text-subtle mb-1 block">Phone Number</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={e => setGuestPhone(e.target.value)}
                    className="w-full bg-background-dark border border-white/10 rounded-lg h-12 px-4 text-white focus:border-primary"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold text-text-subtle mb-1 block">Email (Required)</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={e => setGuestEmail(e.target.value)}
                    className="w-full bg-background-dark border border-white/10 rounded-lg h-12 px-4 text-white focus:border-primary"
                    placeholder="receipt@example.com"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveGuestInfo}
                className="w-full bg-[#f4c025] text-[#181611] font-bold h-12 rounded-xl mt-6 hover:bg-[#dcb010]"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* --- PAYMENT MODAL --- */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6">
            <div className="bg-surface-dark w-full max-w-sm rounded-2xl p-6 border border-white/10 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Payment Method</h3>
                <button onClick={() => setShowPaymentModal(false)} className="text-white/40 hover:text-white"><span className="material-symbols-outlined">close</span></button>
              </div>

              <div className="space-y-3 mb-8">
                {/* CASH */}
                <button
                  onClick={() => setSelectedPayment('cash')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedPayment === 'cash' ? 'bg-primary/10 border-primary' : 'bg-background-dark border-white/5 hover:border-white/20'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${selectedPayment === 'cash' ? 'bg-primary text-background-dark' : 'bg-white/10 text-white'}`}>
                      <span className="material-symbols-outlined text-xl">payments</span>
                    </div>
                    <div className="text-left">
                      <p className={`font-bold ${selectedPayment === 'cash' ? 'text-primary' : 'text-white'}`}>Cash</p>
                      <p className="text-xs text-white/40">Pay chauffeur at pickup</p>
                    </div>
                  </div>
                  {selectedPayment === 'cash' && <span className="material-symbols-outlined text-primary">check_circle</span>}
                </button>

                {/* ZELLE / CASHAPP */}
                <button
                  onClick={() => setSelectedPayment('zelle')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedPayment === 'zelle' ? 'bg-primary/10 border-primary' : 'bg-background-dark border-white/5 hover:border-white/20'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${selectedPayment === 'zelle' ? 'bg-primary text-background-dark' : 'bg-white/10 text-white'}`}>
                      <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
                    </div>
                    <div className="text-left">
                      <p className={`font-bold ${selectedPayment === 'zelle' ? 'text-primary' : 'text-white'}`}>Zelle / CashApp</p>
                      <p className="text-xs text-white/40">Scan QR code safely</p>
                    </div>
                  </div>
                  {selectedPayment === 'zelle' && <span className="material-symbols-outlined text-primary">check_circle</span>}
                </button>

                {/* CARD */}
                <button
                  onClick={() => setSelectedPayment('card')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedPayment === 'card' ? 'bg-primary/10 border-primary' : 'bg-background-dark border-white/5 hover:border-white/20'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${selectedPayment === 'card' ? 'bg-primary text-background-dark' : 'bg-white/10 text-white'}`}>
                      <span className="material-symbols-outlined text-xl">credit_card</span>
                    </div>
                    <div className="text-left">
                      <p className={`font-bold ${selectedPayment === 'card' ? 'text-primary' : 'text-white'}`}>Credit Card</p>
                      <p className="text-xs text-white/40">Secure Payment Link</p>
                    </div>
                  </div>
                  {selectedPayment === 'card' && <span className="material-symbols-outlined text-primary">check_circle</span>}
                </button>
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={isBooking}
                className="w-full bg-[#f4c025] hover:bg-[#dcb010] text-[#181611] font-bold text-lg py-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                {isBooking ? (
                  <div className="size-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Confirm Booking</span>
                )}
              </button>
            </div>
          </div>
        )}

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
