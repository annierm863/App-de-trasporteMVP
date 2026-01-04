
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { ROUTES } from '../routes';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

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
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate(ROUTES.CLIENT_HOME);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 text-white font-display">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <img src="/privaro_logo.png" alt="Privaro" className="h-16 w-auto object-contain mb-4" />
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {isSignUp ? 'Create an account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-sm text-text-subtle">
            Or <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-primary hover:text-primary-dark transition-colors">{isSignUp ? 'sign in to existing account' : 'create a new account'}</button>
          </p>
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
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-xl border-0 bg-surface-dark py-4 px-4 text-white ring-1 ring-inset ring-white/10 placeholder:text-white/50 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
                placeholder="Password"
              />
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
