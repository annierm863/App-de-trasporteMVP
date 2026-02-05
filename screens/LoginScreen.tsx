
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { ROUTES } from '../routes';
import Modal from '../components/Modal';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Modal State
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as 'info' | 'success' | 'error' });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        // Success: Clear fields, Show Modal, Switch to Login
        setEmail('');
        setPassword('');
        setIsSignUp(false);
        setModal({
          isOpen: true,
          title: 'Success',
          message: 'Account created! Please check your email to confirm your account before logging in.',
          type: 'success'
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate(ROUTES.CLIENT_HOME);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      let msg = error.message || 'An error occurred during authentication.';

      // Handle the specific "Email not confirmed" case which often comes as 400 Bad Request
      if (msg.includes("Email not confirmed") || (error.status === 400 && msg === "Invalid login credentials")) {
        // Sometimes Supabase returns "Invalid login credentials" for unverified emails too, 
        // but strictly "Email not confirmed" is ideal.
        // Let's make it generic but helpful if it's a 400 on login
        if (isSignUp === false) {
          msg = "Login failed. Please check your credentials or ensure your email is verified.";
        }
      }

      setModal({
        isOpen: true,
        title: 'Error',
        message: msg,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 text-white font-display">
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <img src="/logo-privaro.png" alt="Privaro" className="h-24 w-auto object-contain mb-4" />
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {isSignUp ? 'Create an account' : 'Sign in to your account'}
          </h2>
          <div className="mt-4 flex items-center justify-center space-x-2 bg-surface-dark/50 p-1 rounded-full border border-white/5">
            <button
              onClick={() => setIsSignUp(false)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${!isSignUp ? 'bg-[#f4c025] text-[#181611] shadow-lg font-bold' : 'text-[#bab29c] hover:text-white'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${isSignUp ? 'bg-[#f4c025] text-[#181611] shadow-lg font-bold' : 'text-[#bab29c] hover:text-white'
                }`}
            >
              Create Account
            </button>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
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
                className="relative block w-full rounded-xl border-0 bg-surface-dark py-4 px-4 text-white ring-1 ring-inset ring-white/10 placeholder:text-white/50 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
                placeholder="Email address"
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
                className="relative block w-full rounded-xl border-0 bg-surface-dark py-4 px-4 text-white ring-1 ring-inset ring-white/10 placeholder:text-white/50 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
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
              className="group relative flex w-full justify-center rounded-xl bg-primary px-3 py-4 text-sm font-bold text-background-dark hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 transition-all shadow-lg"
            >
              {loading ? (
                <span className="size-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="material-symbols-outlined h-5 w-5 text-background-dark/50 group-hover:text-background-dark">lock</span>
                  </span>
                  {isSignUp ? 'Sign up' : 'Sign in'}
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link to={ROUTES.ROOT} className="text-sm font-medium text-white/40 hover:text-white transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
