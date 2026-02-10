
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes';
import { BottomNavAdmin } from '../components/Navigation';
import { supabase } from '../services/supabase';
import { getAdminStats, getAdminBookings, updateBookingStatus } from '../services/bookingService';
import { BookingActionModal } from '../components/BookingActionModal';

const AdminDashboard: React.FC = () => {
  const [adminName, setAdminName] = useState('Admin');
  const [stats, setStats] = useState({ todayCount: 0, requestedCount: 0 });
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'requested'>('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // 1. Get User Info
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.full_name) {
          setAdminName(user.user_metadata.full_name);
        } else if (user?.email) {
          setAdminName(user.email.split('@')[0]);
        }

        // 2. Get Stats
        const statsData = await getAdminStats();
        setStats(statsData);

        // 3. Get Bookings
        const bookingsData = await getAdminBookings();
        setBookings(bookingsData);

      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleStatClick = (type: 'today' | 'requested') => {
    setFilter(filter === type ? 'all' : type);
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return b.pickupDatetime.startsWith(today);
    }
    if (filter === 'requested') {
      return b.status === 'requested';
    }
    return true; // 'all' - shows all upcoming
  });

  const handleBookingClick = (booking: any) => {
    setSelectedBooking(booking);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
  };

  const handleConfirm = async (id: string) => {
    try {
      setActionLoading(true);
      await updateBookingStatus(id, 'confirmed');
      // Refresh local state
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'confirmed' } : b));
      // Update stats if needed (re-fetch is safer but local update is faster)
      setStats(prev => ({ ...prev, requestedCount: Math.max(0, prev.requestedCount - 1) }));
      handleCloseModal();
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('Failed to confirm booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoading(true);
      await updateBookingStatus(id, 'cancelled');
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
      setStats(prev => ({ ...prev, requestedCount: Math.max(0, prev.requestedCount - 1) }));
      handleCloseModal();
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert('Failed to reject booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleContact = (contact: string, type: 'phone' | 'email') => {
    if (type === 'phone') {
      window.location.href = `tel:${contact}`;
    } else {
      window.location.href = `mailto:${contact}`;
    }
  };

  return (
    <div className="bg-background-dark text-white font-display antialiased overflow-x-hidden pb-24 min-h-screen">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background-dark/95 backdrop-blur-md border-b border-white/5 px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-primary/20"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBroOz_JMZa506vKwNlb3I0kQ8ndKC4fLtUuvSKGyFlm2rw3S49p1ijIRxyaup3zFpUpBmsmgv5A4gj_-nmKyD7vb6FwmpGt8wmy17fLrsrjjWGu0Am9rklvJWPZ48GE-gU5j5gjjrCdzZfzziyLdL6FE4LfYjCPic-MB3Lswp6Q8XGBDKtJP-Fpw9crB0tpSC1bkmyyutC6B9ofO3u-Ql_whcPWk8cL3z2RV0XxcfnFrv2VzXRhe-EvrHKtnjiC1spJnHy7B24nhE")' }}
                ></div>
                <div className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 border-2 border-background-dark"></div>
              </div>
              <div>
                <h2 className="text-sm text-slate-400 font-medium">Good evening,</h2>
                <h1 className="text-lg font-bold leading-tight tracking-tight">{adminName}</h1>
              </div>
            </div>
            <button className="relative flex items-center justify-center size-10 rounded-full bg-surface-dark shadow-sm active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-white" style={{ fontSize: "24px" }}>notifications</span>
              <span className="absolute top-2 right-2 size-2.5 bg-primary rounded-full border border-surface-dark"></span>
            </button>
          </div>
        </div>

        {/* Stats / Daily Overview */}
        <div className="mt-6">
          <div className="px-4 mb-3 flex justify-between items-end">
            <h3 className="text-base font-bold text-white">Daily Overview</h3>
            <span className="text-xs font-medium text-slate-400">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex overflow-x-auto gap-3 px-4 pb-2 no-scrollbar snap-x">
            {/* Today's Rides Card */}
            <div
              onClick={() => handleStatClick('today')}
              className={`snap-start flex min-w-[140px] flex-col justify-between rounded-xl p-4 shadow-sm border cursor-pointer transition-all ${filter === 'today' ? 'bg-surface-dark border-primary ring-1 ring-primary' : 'bg-surface-dark border-white/5'}`}
            >
              <div className="flex items-start justify-between">
                <span className="material-symbols-outlined text-slate-400" style={{ fontSize: "20px" }}>local_taxi</span>
              </div>
              <div className="mt-3">
                <p className="text-3xl font-bold text-white">{stats.todayCount}</p>
                <p className="text-xs font-medium text-slate-400 mt-1">Today's Rides</p>
              </div>
            </div>

            {/* Requested Card */}
            <div
              onClick={() => handleStatClick('requested')}
              className={`snap-start flex min-w-[140px] flex-col justify-between rounded-xl p-4 shadow-lg shadow-primary/20 cursor-pointer transition-all ${filter === 'requested' ? 'bg-primary border border-white' : 'bg-primary border-transparent'}`}
            >
              <div className="flex items-start justify-between">
                <span className="material-symbols-outlined text-background-dark/70" style={{ fontSize: "20px" }}>notification_important</span>
                {stats.requestedCount > 0 && <span className="flex size-2 bg-background-dark rounded-full animate-pulse"></span>}
              </div>
              <div className="mt-3">
                <p className="text-3xl font-bold text-background-dark">{stats.requestedCount}</p>
                <p className="text-xs font-bold text-background-dark/80 mt-1">Requested</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Rides List */}
        <div className="mt-8 px-4 flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              {filter === 'today' ? "Today's Rides" : filter === 'requested' ? "Requested Rides" : "Upcoming Rides"}
            </h3>
            <button onClick={() => setFilter('all')} className="text-xs font-semibold text-primary hover:text-primary/80">See All</button>
          </div>

          <div className="flex flex-col gap-4 pb-6">
            {loading ? (
              <div className="text-center py-10 text-white/50">Loading rides...</div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-10 text-white/50 bg-surface-dark rounded-xl border border-white/5">
                <p>No rides found.</p>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <button
                  key={booking.id}
                  onClick={() => handleBookingClick(booking)}
                  className="bg-surface-dark w-full text-left rounded-xl p-4 shadow-sm border border-white/5 active:scale-[0.99] transition-transform block hover:border-white/10"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-md">
                      <span className="material-symbols-outlined text-slate-500 text-[16px]">schedule</span>
                      <span className="text-sm font-bold text-white">{booking.time}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        booking.status === 'requested' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          booking.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                      <span className={`size-1.5 rounded-full ${booking.status === 'confirmed' ? 'bg-green-500' :
                          booking.status === 'requested' ? 'bg-yellow-500' :
                            booking.status === 'cancelled' ? 'bg-red-500' :
                              'bg-slate-500'
                        }`}></span>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="bg-center bg-no-repeat bg-cover rounded-full size-12 shadow-inner border border-white/10"
                      style={{ backgroundImage: `url("${booking.clientAvatar}")` }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-white truncate">{booking.clientName}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {booking.isVip ? (
                          <>
                            <span className="material-symbols-outlined text-primary text-[14px]">stars</span>
                            <p className="text-xs text-primary font-bold">VIP Client</p>
                          </>
                        ) : (
                          <p className="text-xs text-slate-400">Regular Client</p>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {selectedBooking && (
          <BookingActionModal
            booking={selectedBooking}
            onClose={handleCloseModal}
            onConfirm={handleConfirm}
            onReject={handleReject}
            onContact={handleContact}
          />
        )}

        <BottomNavAdmin active="home" />
      </div>
    </div>
  );
};

export default AdminDashboard;
