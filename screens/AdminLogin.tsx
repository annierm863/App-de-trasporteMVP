
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { ROUTES } from '../routes';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // In a real app, we would check for admin role here.
            // For MVP/Owner-Driver model, successful login acts as access.
            navigate(ROUTES.ADMIN_DASHBOARD);

        } catch (err: any) {
            console.error('Admin login failed:', err);
            setErrorMsg(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#12100d] flex flex-col items-center justify-center p-6 text-white font-display">
            <div className="w-full max-w-sm space-y-8">
                <div className="flex flex-col items-center">
                    <div className="size-20 rounded-2xl bg-[#f4c025]/10 border border-[#f4c025]/20 flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl text-[#f4c025]">admin_panel_settings</span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white uppercase tracking-wider">
                        Staff Portal
                    </h2>
                    <p className="text-white/40 text-sm mt-2">Restricted Access</p>
                </div>

                {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {errorMsg}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="relative block w-full rounded-xl border-0 bg-[#27241b] py-4 px-4 text-white ring-1 ring-inset ring-white/10 placeholder:text-white/30 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#f4c025] sm:text-sm sm:leading-6 transition-all"
                                placeholder="Admin Email"
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="relative block w-full rounded-xl border-0 bg-[#27241b] py-4 px-4 text-white ring-1 ring-inset ring-white/10 placeholder:text-white/30 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#f4c025] sm:text-sm sm:leading-6 transition-all"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 z-20 text-white/50 hover:text-white transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined">
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-xl bg-[#f4c025] px-3 py-4 text-sm font-bold text-[#181611] hover:bg-[#dcb010] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4c025] disabled:opacity-70 transition-all shadow-lg shadow-[#f4c025]/20"
                        >
                            {loading ? (
                                <span className="size-5 border-2 border-[#181611] border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                'Authenticate'
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <Link to={ROUTES.ROOT} className="text-xs font-medium text-white/20 hover:text-white/60 transition-colors uppercase tracking-widest">
                        Exit Portal
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
