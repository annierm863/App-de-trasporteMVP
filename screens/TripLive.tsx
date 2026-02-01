
import React from 'react';
import { BackButton } from '../components/Navigation';

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton } from '../components/Navigation';
import { supabase } from '../services/supabase';
import { ROUTES } from '../routes';
import Modal from '../components/Modal';

const TripLive: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as 'info' | 'success' | 'error' });
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelFee, setCancelFee] = useState(0);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      if (!id) return;
      setLoading(true);
      // Join with driver info if possible, assuming 'drivers' table exists. 
      // If simple query, just get booking first.
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          driver:drivers(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setBooking(data);
    } catch (err) {
      console.error('Error fetching booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    // For MVP, updating might be complex. Show info.
    setModal({
      isOpen: true,
      title: 'Update Trip',
      message: 'To modify your reservation, please contact our support team directly or cancel and rebook if the time is distant.',
      type: 'info'
    });
  };

  const handleCancelClick = () => {
    if (!booking) return;
    const now = new Date();
    const pickup = new Date(booking.pickup_datetime);

    // Calculate difference in hours
    const diffMs = pickup.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1) {
      setCancelFee(7);
    } else {
      setCancelFee(0);
    }
    setConfirmCancel(true);
  };

  const confirmCancellation = async () => {
    try {
      setConfirmCancel(false);
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' }) // In a real app, record the fee in a separate ledger
        .eq('id', id);

      if (error) throw error;

      setModal({
        isOpen: true,
        title: 'Trip Cancelled',
        message: cancelFee > 0
          ? `Your trip has been cancelled. A late cancellation fee of $${cancelFee} will be applied to your account.`
          : 'Your trip has been cancelled successfully. No charge applied.',
        type: 'success'
      });
      fetchBooking(); // Refresh UI
    } catch (err) {
      setModal({
        isOpen: true,
        title: 'Error',
        message: 'Could not cancel trip. Please try again.',
        type: 'error'
      });
    }
  };

  if (loading) return <div className="min-h-screen bg-background-dark text-white p-6 justify-center flex items-center">Loading details...</div>;
  if (!booking) return <div className="min-h-screen bg-background-dark text-white p-6 justify-center flex items-center">Trip not found.</div>;

  const isCancelled = booking.status === 'cancelled';

  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen">
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      {/* Custom Confirmation Modal for Cancellation */}
      {confirmCancel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div className="bg-surface-dark w-full max-w-sm rounded-2xl p-6 border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Cancel Trip?</h3>
            <p className="text-white/80 mb-6">
              {cancelFee > 0
                ? `You are cancelling less than 1 hour before pickup. A $${cancelFee} fee applies.`
                : 'You are cancelling more than 1 hour in advance. No fee will be charged.'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmCancel(false)} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold h-12 rounded-xl">Keep Ride</button>
              <button onClick={confirmCancellation} className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 font-bold h-12 rounded-xl">Confirm Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="relative flex min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto shadow-2xl">
        <header className="flex items-center justify-between p-4 pb-2 z-20 bg-background-dark/80 backdrop-blur-md sticky top-0 border-b border-white/5">
          <BackButton />
          <div className="flex flex-col items-center">
            <h2 className="text-white text-lg font-bold leading-tight tracking-tight">On Your Way</h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Booking #{booking.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <button className="size-10 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10">
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </header>

        <main className="flex-1 flex flex-col gap-6 p-4 pb-24 overflow-y-auto z-10">

          {isCancelled && (
            <div className="w-full bg-red-500/20 border border-red-500/50 text-red-500 p-4 rounded-xl text-center font-bold">
              This trip has been cancelled.
            </div>
          )}

          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[4/3]">
            {/* Mock Animated Map */}
            <div className="absolute inset-0 bg-[#1e1c14]">
              {/* Map Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center text-white/10 text-4xl font-bold uppercase">Map View</div>
            </div>

            <div className="absolute top-4 right-4">
              <div className="flex h-8 items-center justify-center gap-x-2 rounded-full bg-background-dark/90 backdrop-blur-md border border-primary/30 pl-3 pr-4 shadow-lg">
                <div className={`size-2 rounded-full ${isCancelled ? 'bg-red-500' : 'bg-primary animate-pulse'}`}></div>
                <p className="text-white text-[10px] font-bold uppercase tracking-widest">{booking.status.replace(/_/g, ' ')}</p>
              </div>
            </div>

            {!isCancelled && (
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent pt-12">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-primary text-[10px] uppercase font-bold tracking-widest mb-1">Estimated Arrival</span>
                    <span className="text-white text-3xl font-bold">-- mins</span>
                  </div>
                  <div className="bg-primary p-3 rounded-2xl shadow-xl shadow-primary/20">
                    <span className="material-symbols-outlined text-background-dark text-3xl filled">directions_car</span>
                  </div>
                </div>
              </div>
            )}
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
                  <p className="text-white text-lg font-bold leading-tight truncate max-w-[200px]">{booking.pickup_address}</p>
                  <span className="text-primary text-xs font-bold">
                    {new Date(booking.pickup_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-text-secondary text-sm mt-1">Pickup Point</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
              </div>
              <div className="flex flex-col pt-1">
                <div className="flex justify-between items-baseline">
                  <p className="text-white text-lg font-bold leading-tight truncate max-w-[200px]">{booking.dropoff_address}</p>
                </div>
                <p className="text-text-secondary text-sm mt-1">Destination</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-dark rounded-2xl p-4 border border-white/5 flex items-center justify-between">
            {booking.driver ? (
              <div className="flex items-center gap-4">
                {/* Driver info if available */}
                <div className="size-12 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <p className="font-bold">{booking.driver.full_name}</p>
                  <p className="text-xs text-text-subtle">Your Chauffeur</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white/40">person_off</span>
                </div>
                <div>
                  <p className="font-bold text-white/60">No Driver Assigned</p>
                  <p className="text-xs text-text-subtle">We are locating a driver...</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button disabled={!booking.driver} className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-30"><span className="material-symbols-outlined text-[20px]">chat</span></button>
              <button disabled={!booking.driver} className="size-10 rounded-full bg-primary flex items-center justify-center text-background-dark disabled:opacity-30"><span className="material-symbols-outlined text-[20px] filled">call</span></button>
            </div>
          </div>

          {/* Actions */}
          {!isCancelled && (
            <div className="flex gap-3 mt-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-surface-dark border border-white/10 hover:bg-white/5 text-white font-bold h-14 rounded-xl transition-all"
              >
                Update Ride
              </button>
              <button
                onClick={handleCancelClick}
                className="flex-1 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-bold h-14 rounded-xl transition-all"
              >
                Cancel Ride
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default TripLive;
