
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes';
import { BackButton, BottomNavAdmin } from '../components/Navigation';
import { getDrivers } from '../services/bookingService';

const AdminDrivers: React.FC = () => {
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDrivers = async () => {
            setLoading(true);
            try {
                const data = await getDrivers();
                setDrivers(data);
            } catch (error) {
                console.error('Error loading drivers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDrivers();
    }, []);

    return (
        <div className="bg-background-dark text-white font-display antialiased min-h-screen pb-24">
            <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
                <header className="sticky top-0 z-30 bg-background-dark/95 backdrop-blur-md shadow-none border-b border-white/5">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                            <BackButton />
                            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-white">Fleet Management</h2>
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex flex-col relative p-4 space-y-3">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-white/50">
                            <span className="size-8 border-2 border-white/20 border-t-primary rounded-full animate-spin mb-4"></span>
                            <p className="text-sm">Loading fleet...</p>
                        </div>
                    ) : drivers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-white/50 text-center">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">no_accounts</span>
                            <p className="text-sm font-medium">No drivers found</p>
                            <p className="text-xs opacity-60 mt-1">Add your first driver to get started.</p>
                        </div>
                    ) : (
                        drivers.map(driver => (
                            <Link
                                key={driver.id}
                                to={`/admin/driver/${driver.id}`}
                                className="w-full group flex items-center gap-4 bg-[#2C2C2C] p-3 rounded-xl border border-transparent shadow-sm hover:bg-[#363636] transition-all duration-200 text-left active:scale-[0.98]"
                            >
                                <div className="relative shrink-0">
                                    <div
                                        className="bg-center bg-no-repeat bg-cover rounded-full h-14 w-14 border border-white/5 lazy-image"
                                        style={{ backgroundImage: `url("${driver.avatar}")` }}
                                    ></div>
                                    {driver.status === 'active' && (
                                        <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-[#2C2C2C]"></div>
                                    )}
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className="text-white text-base font-semibold truncate group-hover:text-primary transition-colors">{driver.name}</p>
                                        <span className="flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded">
                                            <span className="material-symbols-outlined text-[12px]">star</span>
                                            {driver.rating}
                                        </span>
                                    </div>
                                    <p className="text-[#bab29c] text-sm truncate">{driver.vehicle ? `${driver.vehicle.make} ${driver.vehicle.model}` : 'No Vehicle Assigned'}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-white/40 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">route</span>
                                            {driver.totalTrips} Trips
                                        </span>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-white/20 group-hover:text-primary transition-colors">chevron_right</span>
                            </Link>
                        ))
                    )}
                </main>

                <Link to="/admin/driver/new" className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-black/40 hover:scale-110 active:scale-95 transition-all duration-200 text-background-dark">
                    <span className="material-symbols-outlined font-bold" style={{ fontSize: "32px" }}>add</span>
                </Link>

                <BottomNavAdmin active="settings" />
            </div>
        </div>
    );
};

export default AdminDrivers;
