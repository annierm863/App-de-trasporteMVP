
import React from 'react';

interface BookingActionModalProps {
    booking: any;
    onClose: () => void;
    onConfirm: (id: string) => void;
    onReject: (id: string) => void;
    onContact: (contact: string, type: 'phone' | 'email') => void;
}

export const BookingActionModal: React.FC<BookingActionModalProps> = ({ booking, onClose, onConfirm, onReject, onContact }) => {
    if (!booking) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-sm bg-surface-dark rounded-2xl border border-white/10 p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="flex flex-col items-center mb-6">
                    <div
                        className="size-20 rounded-full bg-cover bg-center border-2 border-primary mb-3"
                        style={{ backgroundImage: `url("${booking.clientAvatar}")` }}
                    ></div>
                    <h3 className="text-xl font-bold text-white text-center">{booking.clientName}</h3>
                    {booking.isVip && (
                        <div className="flex items-center gap-1 mt-1 text-primary">
                            <span className="material-symbols-outlined text-sm">stars</span>
                            <span className="text-xs font-bold uppercase tracking-wider">VIP Client</span>
                        </div>
                    )}
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 size-2 rounded-full bg-primary shrink-0"></div>
                        <div>
                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold">Pickup</p>
                            <p className="text-sm text-white font-medium">{booking.time} - {booking.date}</p>
                            <p className="text-sm text-white/80">{booking.pickupAddress || 'Address not available'}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-1 size-2 rounded-full bg-red-500 shrink-0"></div>
                        <div>
                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold">Dropoff</p>
                            <p className="text-sm text-white/80">{booking.dropoffAddress || 'Address not available'}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                        onClick={() => onContact(booking.clientPhone, 'phone')}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all border border-white/5"
                    >
                        <span className="material-symbols-outlined text-[20px]">call</span>
                        Call
                    </button>
                    <button
                        onClick={() => onContact(booking.clientEmail, 'email')}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all border border-white/5"
                    >
                        <span className="material-symbols-outlined text-[20px]">mail</span>
                        Email
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => onReject(booking.id)}
                        className="py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-sm transition-all border border-red-500/20"
                    >
                        Reject
                    </button>
                    <button
                        onClick={() => onConfirm(booking.id)}
                        className="py-3 rounded-xl bg-[#f4c025] hover:bg-[#dcb010] text-[#181611] font-bold text-sm transition-all shadow-lg shadow-[#f4c025]/20"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};
