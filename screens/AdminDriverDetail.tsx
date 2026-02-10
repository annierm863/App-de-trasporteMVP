
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton } from '../components/Navigation';
import { getDriver, saveDriver } from '../services/bookingService';

const AdminDriverDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNew = id === 'new' || !id;

    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'vehicle'>('profile');

    // Form State
    const [driver, setDriver] = useState({
        id: isNew ? 'new' : id,
        name: '',
        phone: '',
        email: '',
        avatar: '',
        status: 'inactive'
    });

    const [vehicle, setVehicle] = useState({
        id: '', // Vehicle ID
        make: '',
        model: '',
        color: '',
        plateNumber: ''
    });

    useEffect(() => {
        const fetchDriver = async () => {
            if (isNew || !id) return;
            try {
                const data = await getDriver(id);
                setDriver({
                    id: data.id,
                    name: data.name,
                    phone: data.phone,
                    email: data.email || '',
                    avatar: data.avatar || '',
                    status: data.status
                });

                if (data.vehicle) {
                    setVehicle({
                        id: data.vehicle.id,
                        make: data.vehicle.make || '',
                        model: data.vehicle.model || '',
                        color: data.vehicle.color || '',
                        plateNumber: data.vehicle.plate_number || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching driver:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDriver();
    }, [id, isNew]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveDriver(driver, vehicle);
            // Navigate back or show success
            navigate('/admin/drivers');
        } catch (error) {
            console.error('Error saving driver:', error);
            alert('Failed to save driver. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-background-dark min-h-screen flex items-center justify-center text-white/50">
                <span className="size-8 border-2 border-white/20 border-t-primary rounded-full animate-spin"></span>
            </div>
        );
    }

    return (
        <div className="bg-background-dark text-white font-display antialiased min-h-screen pb-24">
            <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
                <header className="sticky top-0 z-30 bg-background-dark/95 backdrop-blur-md shadow-none border-b border-white/5">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                            <BackButton />
                            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-white">
                                {isNew ? 'Add Driver' : 'Edit Driver'}
                            </h2>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="text-sm font-bold text-primary disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                    {/* Tabs */}
                    <div className="flex px-4 border-b border-white/5">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'profile' ? 'border-primary text-white' : 'border-transparent text-gray-500'}`}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('vehicle')}
                            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'vehicle' ? 'border-primary text-white' : 'border-transparent text-gray-500'}`}
                        >
                            Vehicle
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-5 space-y-6">
                    {/* Preview Card */}
                    <div className="bg-[#2C2C2C] p-4 rounded-xl border border-white/5 flex items-center gap-4 opacity-80 pointer-events-none select-none grayscale-[0.3]">
                        <div className="relative shrink-0">
                            <div
                                className="bg-center bg-no-repeat bg-cover rounded-full h-14 w-14 border border-white/5 lazy-image"
                                style={{ backgroundImage: `url("${driver.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name || 'D')}&background=random`}")` }}
                            ></div>
                            <div className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#2C2C2C] ${driver.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <p className="text-white text-base font-semibold truncate">{driver.name || 'Driver Name'}</p>
                            <p className="text-[#bab29c] text-sm truncate">{vehicle.make} {vehicle.model}</p>
                        </div>
                    </div>

                    {activeTab === 'profile' ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    value={driver.name}
                                    onChange={(e) => setDriver({ ...driver, name: e.target.value })}
                                    className="bg-surface-dark border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="e.g. Raul Perez"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</label>
                                <input
                                    type="tel"
                                    value={driver.phone}
                                    onChange={(e) => setDriver({ ...driver, phone: e.target.value })}
                                    className="bg-surface-dark border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label>
                                <input
                                    type="email"
                                    value={driver.email}
                                    onChange={(e) => setDriver({ ...driver, email: e.target.value })}
                                    className="bg-surface-dark border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="driver@example.com"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avatar URL</label>
                                <input
                                    type="text"
                                    value={driver.avatar}
                                    onChange={(e) => setDriver({ ...driver, avatar: e.target.value })}
                                    className="bg-surface-dark border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="https://"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-surface-dark rounded-xl border border-white/5">
                                <span className="text-sm font-semibold">Active Status</span>
                                <button
                                    onClick={() => setDriver({ ...driver, status: driver.status === 'active' ? 'inactive' : 'active' })}
                                    className={`w-12 h-6 rounded-full relative transition-colors ${driver.status === 'active' ? 'bg-green-500' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${driver.status === 'active' ? 'right-1' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Make</label>
                                <input
                                    type="text"
                                    value={vehicle.make}
                                    onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
                                    className="bg-surface-dark border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="e.g. Tesla"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Model</label>
                                <input
                                    type="text"
                                    value={vehicle.model}
                                    onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                                    className="bg-surface-dark border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="e.g. Model X"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col gap-2 flex-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Color</label>
                                    <input
                                        type="text"
                                        value={vehicle.color}
                                        onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })}
                                        className="bg-surface-dark border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="e.g. Black"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 flex-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Plate</label>
                                    <input
                                        type="text"
                                        value={vehicle.plateNumber}
                                        onChange={(e) => setVehicle({ ...vehicle, plateNumber: e.target.value })}
                                        className="bg-surface-dark border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="XYZ-123"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDriverDetail;
