
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../routes';
import { supabase } from '../services/supabase';
import { BackButton } from '../components/Navigation';

const RideDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            driver:drivers (
              *,
              vehicles (*)
            )
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

    fetchBooking();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('booking-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `id=eq.${id}` }, (payload) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setBooking((prev: any) => ({ ...prev, ...payload.new }));
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };

  }, [id]);

  if (loading) {
    return (
      <div className="bg-background-dark min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!booking) {
    return <div className="bg-background-dark min-h-screen text-white p-10 text-center">Booking not found.</div>;
  }

  const isAssigned = !!booking.driver;
  const driver = booking.driver;
  // Supabase returns an array for one-to-many relationship usually, but here checking vehicles
  // If we set up appropriate relationship it might be object or array. 
  // Based on schema, vehicle -> driver. driver doesn't necessarily know vehicle unless we select reverse.
  // Actually schema: vehicles.driver_id -> drivers.id.
  // Query: driver:drivers ( ..., vehicles (*) ) -> vehicles will be an array.
  const vehicle = driver?.vehicles?.[0];

  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen">
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-6 max-w-md mx-auto">
        <div className="sticky top-0 z-10 flex items-center bg-background-dark/95 backdrop-blur-sm p-4 pb-2 justify-between border-b border-white/5">
          <BackButton />
          <h2 className="text-white text-lg font-bold leading-tight flex-1 text-center pr-10">Ride Details</h2>
        </div>

        <div className="flex-1 px-4 pt-4 flex flex-col gap-6">
          <div className="flex justify-center">
            <div className={`flex items-center gap-x-2 rounded-full px-4 py-1.5 border ${booking.status === 'requested' ? 'bg-yellow-500/10 border-yellow-500/20' :
                booking.status === 'confirmed' ? 'bg-primary/10 border-primary/20' :
                  'bg-white/5 border-white/10'
              }`}>
              <span className={`material-symbols-outlined filled text-[18px] ${booking.status === 'requested' ? 'text-yellow-500' : 'text-primary'
                }`}>
                {booking.status === 'requested' ? 'hourglass_empty' : 'check_circle'}
              </span>
              <p className={`text-sm font-semibold tracking-wide uppercase ${booking.status === 'requested' ? 'text-yellow-500' : 'text-primary'
                }`}>
                {booking.status === 'started' ? 'In Progress' : booking.status}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[#2e291b] shadow-none p-5 flex flex-col gap-6">
            <div className="grid grid-cols-[32px_1fr] gap-x-3">
              <div className="flex flex-col items-center pt-1">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>radio_button_checked</span>
                <div className="w-[2px] bg-[#544e3b] h-full my-1 rounded-full"></div>
              </div>
              <div className="flex flex-col pb-6">
                <p className="text-white text-base font-semibold leading-tight">{booking.pickup_address}</p>
                {/* For MVP we don't have city parsed from address, so hiding subtitle or just repeating */}
                <p className="text-text-subtle text-sm mt-0.5">Pickup Location</p>
                <p className="text-primary text-sm font-medium mt-1">
                  {new Date(booking.pickup_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>location_on</span>
              </div>
              <div className="flex flex-col">
                <p className="text-white text-base font-semibold leading-tight">{booking.dropoff_address}</p>
                <p className="text-text-subtle text-sm mt-0.5">Destination</p>
                <p className="text-gray-500 text-sm mt-1">--</p>
              </div>
            </div>

            <div className="h-px w-full bg-white/10"></div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Date', val: new Date(booking.pickup_datetime).toLocaleDateString(), icon: 'calendar_today' },
                { label: 'Trip Type', val: 'One Way', icon: 'commute' },
                { label: 'Passengers', val: `${booking.passengers} People`, icon: 'group' },
                { label: 'Reference', val: `#${booking.id.slice(0, 8).toUpperCase()}`, icon: 'tag' }
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-text-subtle text-xs uppercase tracking-wider font-medium mb-1">{item.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: "18px" }}>{item.icon}</span>
                    <span className="text-white text-sm font-medium">{item.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!isAssigned ? (
            <div className="p-6 rounded-xl bg-surface-dark border border-white/5 flex flex-col items-center text-center animate-pulse">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-primary text-2xl">search</span>
              </div>
              <h3 className="text-white font-bold text-lg">Finding your Chauffeur</h3>
              <p className="text-text-subtle text-sm mt-1">We are locating the nearest premium driver for you...</p>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-white text-lg font-bold leading-tight px-1 pb-3">Chauffeur</h3>
                <div className="rounded-xl bg-[#2e291b] shadow-none p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <img alt="Driver" className="size-14 rounded-full object-cover border-2 border-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlBfISc9dVFruiQkDrTejmSI-n61nNsGt8lgVuvtXwE6UJjpbZCVMQ8pnZar3xUTi01V2tH_bwT-Sk8dqKTV0SjHcbZKahLQ7oEYJ5J2LEvTxzvJ2xxS-1NcxCCnMVow_1KTFv7nUk8Znq1HEqupUtomtFMdOPjRgOrj5apYA7LzX77_AuGMFTbsws5o5DPYs1t7XiTHoNBkg9idNB3fTyC-juxu66yDN4YTHtzMU5cBr3Iq7xwRF6-7Ze6jTPSpsza_zr_z8a4_o" />
                      <div className="absolute -bottom-1 -right-1 flex items-center justify-center bg-[#2e291b] rounded-full p-0.5">
                        <div className="bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">4.9 <span className="material-symbols-outlined text-[10px] filled">star</span></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-bold text-base truncate">{driver.full_name}</h4>
                          <p className="text-text-subtle text-sm truncate">Elite Chauffeur</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="size-9 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"><span className="material-symbols-outlined" style={{ fontSize: "20px" }}>chat</span></button>
                          <button className="size-9 rounded-full bg-primary text-background-dark hover:bg-primary/90 flex items-center justify-center transition-colors"><span className="material-symbols-outlined filled" style={{ fontSize: "20px" }}>call</span></button>
                        </div>
                      </div>
                      {vehicle && (
                        <div className="mt-3 p-3 bg-[#221e10] rounded-lg flex items-center gap-3">
                          <span className="material-symbols-outlined text-gray-500" style={{ fontSize: "24px" }}>directions_car</span>
                          <div className="flex-1">
                            <p className="text-white text-sm font-semibold">{vehicle.make} {vehicle.model}</p>
                            <div className="flex items-center gap-2 text-xs text-text-subtle">
                              <span>{vehicle.color}</span><span className="size-1 rounded-full bg-gray-400"></span><span className="bg-white/10 px-1.5 py-0.5 rounded text-gray-300 font-mono">{vehicle.plate_number}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}


          <div>
            <h3 className="text-white text-lg font-bold leading-tight px-1 pb-3">Payment</h3>
            <div className="rounded-xl bg-[#2e291b] shadow-none p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-subtle text-sm">Estimated Fare</span>
                <span className="text-white text-lg font-bold">${booking.estimated_fare_min} - ${booking.estimated_fare_max}</span>
              </div>
              <div className="h-px w-full bg-white/10 mb-3"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-5 bg-white/10 rounded border border-white/20 flex items-center justify-center">
                    <div className="flex gap-[1px]">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/80"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80"></div>
                    </div>
                  </div>
                  <span className="text-white text-sm font-medium">Visa ending in 4242</span>
                </div>
                <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">Personal</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 px-4 pb-4 pt-2">
          <Link to={ROUTES.CLIENT_SERVICE_INFO} className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-background-dark font-bold h-12 mb-3 hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(244,192,37,0.15)]">
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>support_agent</span>
            Contact Support
          </Link>
          <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-500/30 text-red-400 font-medium h-12 hover:bg-red-500/5 transition-colors">
            Cancel Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideDetails;
