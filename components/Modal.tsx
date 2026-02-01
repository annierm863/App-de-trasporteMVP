import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'info';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message, type = 'info' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-in fade-in duration-200">
            <div className="bg-surface-dark w-full max-w-sm rounded-2xl p-6 border border-white/10 shadow-2xl animate-in zoom-in-95 leading-relaxed">
                <div className="flex items-center gap-4 mb-4">
                    <div className={`size-12 rounded-full flex items-center justify-center ${type === 'error' ? 'bg-red-500/20 text-red-500' :
                            type === 'success' ? 'bg-green-500/20 text-green-500' :
                                'bg-primary/20 text-primary'
                        }`}>
                        <span className="material-symbols-outlined text-2xl">
                            {type === 'error' ? 'error' : type === 'success' ? 'check_circle' : 'info'}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>
                <p className="text-white/80 mb-8">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full bg-[#f4c025] hover:bg-[#dcb010] text-[#181611] font-bold h-12 rounded-xl transition-colors"
                >
                    Okay
                </button>
            </div>
        </div>
    );
};

export default Modal;
