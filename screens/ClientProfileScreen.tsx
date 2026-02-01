import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { ROUTES } from '../routes';
import { BackButton, BottomNavClient } from '../components/Navigation';

const ClientProfileScreen: React.FC = () => {
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState(false);

  // Form state
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase.from('clients').select('*').eq('id', user.id).single();
      if (data) {
        setProfile(data);
        setName(data.full_name || '');
        setPhone(data.phone || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const { error } = await supabase.from('clients').update({
        full_name: name,
        phone: phone
      }).eq('id', profile.id);

      if (error) throw error;
      setEditing(false);
      fetchProfile();
      alert('Profile updated!');
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = ROUTES.LOGIN;
  };

  if (loading) return <div className="min-h-screen bg-background-dark text-white p-6">Loading profile...</div>;

  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen">
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24 max-w-md mx-auto">
        <header className="flex items-center justify-between p-4 pb-2 sticky top-0 z-20 bg-background-dark/95 backdrop-blur-md">
          <BackButton />
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">My Profile</h2>
          {editing ? (
            <button onClick={handleUpdate} className="text-primary text-sm font-bold">Save</button>
          ) : (
            <button onClick={() => setEditing(true)} className="text-primary text-sm font-bold">Edit</button>
          )}
        </header>

        <div className="flex flex-col items-center pt-4 pb-6 px-4">
          <div className="relative group cursor-pointer">
            <div
              className="size-28 rounded-full bg-cover bg-center border-2 border-[#2A271F] shadow-xl bg-surface-dark flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-4xl text-white/20">person</span>
            </div>
            {/* Photo upload hook would go here */}
          </div>
          <div className="mt-3 text-center">
            <h3 className="text-xl font-bold">{profile?.full_name || 'Guest User'}</h3>
            <p className="text-sm text-text-subtle">{profile?.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-4 max-w-[480px] w-full mx-auto">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#bab29c] ml-1">Full Name</span>
            <div className="relative flex items-center">
              <input
                className={`w-full bg-input-bg border-none rounded-xl h-14 px-4 text-base font-medium text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm ${!editing && 'opacity-60 cursor-not-allowed'}`}
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={!editing}
              />
              {editing && <span className="material-symbols-outlined absolute right-4 text-primary pointer-events-none">edit</span>}
            </div>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#bab29c] ml-1">Phone Number</span>
            <div className="relative flex items-center">
              <input
                className={`w-full bg-input-bg border-none rounded-xl h-14 px-4 text-base font-medium text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm ${!editing && 'opacity-60 cursor-not-allowed'}`}
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                disabled={!editing}
              />
              {editing && <span className="material-symbols-outlined absolute right-4 text-primary pointer-events-none">call</span>}
            </div>
          </label>
        </div>

        <div className="flex flex-col mt-8 px-4 gap-3 max-w-[480px] w-full mx-auto">
          <Link to={ROUTES.CLIENT_SERVICE_INFO} className="flex items-center justify-between p-4 bg-input-bg/50 rounded-xl active:bg-input-bg transition-colors border border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-8 rounded-full bg-white/10 text-white">
                <span className="material-symbols-outlined text-[18px]">info</span>
              </div>
              <span className="text-base font-medium">Service Info</span>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </Link>
          <Link to={ROUTES.CLIENT_TERMS} className="flex items-center justify-between p-4 bg-input-bg/50 rounded-xl active:bg-input-bg transition-colors border border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-8 rounded-full bg-white/10 text-white">
                <span className="material-symbols-outlined text-[18px]">gavel</span>
              </div>
              <span className="text-base font-medium">Terms & Policies</span>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </Link>
        </div>

        <div className="mt-auto px-4 pt-8 pb-4 w-full max-w-[480px] mx-auto flex flex-col items-center gap-4">
          <button onClick={handleSignOut} className="flex items-center gap-2 px-6 py-2 text-rose-400 text-sm font-semibold rounded-lg hover:bg-rose-500/10 transition-colors">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Log Out
          </button>
        </div>
        <BottomNavClient active="profile" />
      </div>
    </div>
  );
};

export default ClientProfileScreen;
