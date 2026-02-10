
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes';
import { BottomNavAdmin } from '../components/Navigation';
import { getAdminBookings, updateBookingStatus } from '../services/bookingService';
import { BookingActionModal } from '../components/BookingActionModal';

const AdminBookings: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch data when filters change
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await getAdminBookings({ status: activeFilter, searchQuery });
        setBookings(data);
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchBookings();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [activeFilter, searchQuery]);

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
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'confirmed' } : b));
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
      handleCloseModal();
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert('Failed to reject booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleContact = (contact: string, type: 'phone' | 'email') => {
    if (type === 'phone') window.location.href = `tel:${contact}`;
    else window.location.href = `mailto:${contact}`;
  };

  // Group bookings by date
  const groupedBookings = bookings.reduce((groups: any, booking: any) => {
    const date = booking.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(booking);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedBookings).sort((a, b) => {
    // Sort logic depends on date format, but here we can rely on order from Backend if rawDate was available or parse string
    // Let's rely on backend sort mostly, but here keys are date strings.
    // Better to use rawDate for sorting if possible, but for now simple string comparison or generic sort
    return new Date(a).getTime() - new Date(b).getTime();
  });

  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen pb-24">
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
        <header className="sticky top-0 z-30 bg-background-dark/95 backdrop-blur-md shadow-none border-b border-white/5">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-white">Bookings</h2>
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
                  placeholder="Search client, address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-dark border border-white/10 text-white rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-white/20 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar border-b border-white/5 snap-x">
            {['all', 'requested', 'confirmed', 'cancelled', 'completed'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex h-8 shrink-0 items-center justify-center px-4 rounded-full transition-colors snap-start ${activeFilter === filter
                    ? 'bg-white text-background-dark'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
              >
                <span className="text-xs font-bold capitalize">{filter}</span>
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 px-4 pt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/50">
              <span className="size-8 border-2 border-white/20 border-t-primary rounded-full animate-spin mb-4"></span>
              <p className="text-sm">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/50 text-center">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">toc</span>
              <p className="text-sm font-medium">No bookings found</p>
              <p className="text-xs opacity-60 max-w-[200px] mt-1">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            Object.keys(groupedBookings).map((date) => (
              <div key={date} className="mb-6 animate-fade-in-up">
                <h3 className="text-lg font-bold text-white mb-3 sticky top-[130px] z-10 py-1 mix-blend-difference">{date}</h3>
                <div className="flex flex-col gap-3">
                  {groupedBookings[date].map((booking: any) => (
                    <button
                      key={booking.id}
                      onClick={() => handleBookingClick(booking)}
                      className="group w-full text-left relative flex flex-col gap-3 rounded-xl bg-surface-dark p-4 shadow-sm border border-white/5 active:scale-[0.98] transition-transform hover:border-white/10"
                    >
                      <div className="flex justify-between items-start w-full">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-gray-400" style={{ fontSize: "20px" }}>schedule</span>
                          <span className="text-lg font-bold text-white">{booking.time}</span>
                        </div>
                        <div className={`px-2.5 py-1 rounded-md border ${booking.status === 'confirmed' ? 'bg-green-500/10 border-green-500/20' :
                            booking.status === 'requested' ? 'bg-yellow-500/10 border-yellow-500/20' :
                              booking.status === 'cancelled' ? 'bg-red-500/10 border-red-500/20' :
                                'bg-white/5 border-white/10'
                          }`}>
                          <span className={`text-xs font-bold uppercase tracking-wide ${booking.status === 'confirmed' ? 'text-green-500' :
                              booking.status === 'requested' ? 'text-yellow-500' :
                                booking.status === 'cancelled' ? 'text-red-500' :
                                  'text-gray-400'
                            }`}>
                            {booking.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 relative pl-3 border-l-2 border-white/10 ml-1 py-1 w-full">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 font-medium uppercase">Pickup</span>
                          <span className="text-sm font-medium text-gray-200 truncate pr-4">{booking.pickupAddress}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 font-medium uppercase">Dropoff</span>
                          <span className="text-sm font-medium text-gray-200 truncate pr-4">{booking.dropoffAddress}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-1 pt-3 border-t border-white/5">
                        <div
                          className="size-6 rounded-full bg-cover bg-center"
                          style={{ backgroundImage: `url("${booking.clientAvatar}")` }}
                        ></div>
                        <span className="text-xs font-bold text-white/70">{booking.clientName}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </main>

        <Link to={ROUTES.ADMIN_CREATE_BOOKING} className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-black/40 hover:scale-110 active:scale-95 transition-all duration-200 text-background-dark">
          <span className="material-symbols-outlined font-bold" style={{ fontSize: "32px" }}>add</span>
        </Link>
        <BottomNavAdmin active="bookings" />

        {selectedBooking && (
          <BookingActionModal
            booking={selectedBooking}
            onClose={handleCloseModal}
            onConfirm={handleConfirm}
            onReject={handleReject}
            onContact={handleContact}
          />
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
