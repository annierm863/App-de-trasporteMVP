
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes';
import { signInAnonymously, supabase } from '../services/supabase';

const LandingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isQrEntry, setIsQrEntry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('ref') === 'qr_entry') {
      setIsQrEntry(true);
    }
  }, [location]);

  const handleGuestContinue = async () => {
    try {
      setLoading(true);
      const { user } = await signInAnonymously();

      if (user) {
        // Create Guest Profile if not exists
        const { error } = await supabase
          .from('clients')
          .insert([
            {
              id: user.id,
              full_name: 'Guest Client',
              phone: '000-000-0000', // Placeholder for guest
              is_guest: true
            }
          ])
          .select()
          .single();

        // If error code is 23505 (unique violation), it means profile exists (returning guest), which is fine.
        if (error && error.code !== '23505') {
          console.error('Error creating guest profile:', error);
          // Continue anyway, maybe they just need to reach home
        }

        navigate(ROUTES.CLIENT_HOME);
      }
    } catch (error) {
      console.error('Guest login failed:', error);
      alert('Could not sign in as Guest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-dark font-display overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBaNiAJKw3pT64B-Fu-_rsKG8OCOsPVWOgDdT3eQbRK8luNy2xgnyXFYyqOSlD0D-wE2MJePRDCpnTH-UXk-LXwVayIYwsFav6KeTHlQS8ppfdWFcYOMjoXBExCYEsx6o8vVHIqCw5bvYobEnUXusoC8t8oWByBD3tQ9Kse7zVTgYS9gLWjAH-tqsEOMR1HuIqsL-PXTUdncr-MRhMye4SYc-2iCm-KROMSWB2Xds6xogjrvnzfVscaQrBB8_jLcN4Mz-twxT9Iu8I')", backgroundSize: "100px 100px" }}></div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background-dark/50 to-background-dark pointer-events-none"></div>

      <div className="relative z-10 flex h-full flex-col justify-between px-6 py-8 md:py-12 max-w-md mx-auto w-full">
        <div className="flex-none h-1/6"></div>
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="mb-8 relative group">
            <div className="absolute -inset-1 rounded-full bg-primary/20 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex h-32 w-32 items-center justify-center rounded-2xl bg-[#2a261a] border border-primary/20 shadow-2xl p-4">
              <img src="/logo-privaro.png" alt="Privaro" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2 tracking-widest uppercase">PRIVARO</h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-primary/50"></div>
              <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-white/50">PREMIUM PRIVATE CHAUFFEUR</p>
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-primary/50"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full space-y-8 mb-8">
          <div className="text-center space-y-3">
            <h2 className="text-white text-[26px] font-bold leading-tight tracking-wide">
              {isQrEntry ? 'Welcome, Guest' : ''} {isQrEntry && <br />}
              <span className="text-white/90">{isQrEntry ? 'Ride in Style' : 'Scan, book and ride in executive class.'}</span>
            </h2>
            <p className="text-white/40 text-sm font-light leading-relaxed max-w-[280px] mx-auto">
              {isQrEntry
                ? 'Continue as a guest for a quick ride, or sign in for full benefits.'
                : ''}
            </p>
          </div>
          <div className="w-full pt-2">
            <div className="space-y-3">
              <button
                onClick={() => setShowModeSelector(true)}
                className="group w-full flex items-center justify-center rounded-lg bg-[#f4c025] h-[56px] px-6 text-[#181611] text-lg font-bold leading-normal tracking-wide shadow-[0_0_20px_-5px_rgba(244,192,37,0.3)] hover:shadow-[0_0_25px_-5px_rgba(244,192,37,0.5)] hover:bg-[#dcb010] active:scale-[0.99] transition-all duration-300"
              >
                <span className="truncate">Get started</span>
                <span className="material-symbols-outlined ml-2 text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
              </button>

              {/* Hidden/Subtle Admin Link for YOU */}
              <div className="pt-4 flex justify-center opacity-20 hover:opacity-100 transition-opacity">
                <Link to={ROUTES.LOGIN} className="text-[10px] uppercase tracking-widest text-white/50">
                  Staff Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ENTRY MODE CHOOSER MODAL --- */}
      {showModeSelector && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="bg-surface-dark w-full max-w-sm rounded-2xl p-6 border border-white/10 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">How would you like to start?</h3>
              <button onClick={() => setShowModeSelector(false)} className="text-white/40 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-sm text-text-subtle mb-8 leading-relaxed">
              You can book up to 3 rides as a guest, or create an account for unlimited bookings.
            </p>

            <div className="space-y-4">
              <button
                onClick={handleGuestContinue}
                disabled={loading}
                className="w-full flex items-center justify-center rounded-xl bg-surface-dark border border-primary h-[56px] px-6 text-white text-lg font-bold hover:bg-white/5 active:scale-[0.98] transition-all"
              >
                {loading ? (
                  <span className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span>Continue as guest</span>
                )}
              </button>

              <Link
                to={ROUTES.LOGIN}
                className="w-full flex items-center justify-center rounded-xl bg-primary h-[56px] px-6 text-background-dark text-lg font-bold hover:bg-primary-dark active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
