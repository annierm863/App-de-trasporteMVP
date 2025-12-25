
import React from 'react';
import { Link } from 'react-router-dom';
import { BottomNavAdmin } from '../components/Navigation';

const AdminDashboard: React.FC = () => {
  return (
    <div className="bg-background-dark text-white font-display antialiased overflow-x-hidden pb-24 min-h-screen">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <div className="sticky top-0 z-30 bg-background-dark/95 backdrop-blur-md border-b border-white/5 px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-primary/20" 
                  style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBroOz_JMZa506vKwNlb3I0kQ8ndKC4fLtUuvSKGyFlm2rw3S49p1ijIRxyaup3zFpUpBmsmgv5A4gj_-nmKyD7vb6FwmpGt8wmy17fLrsrjjWGu0Am9rklvJWPZ48GE-gU5j5gjjrCdzZfzziyLdL6FE4LfYjCPic-MB3Lswp6Q8XGBDKtJP-Fpw9crB0tpSC1bkmyyutC6B9ofO3u-Ql_whcPWk8cL3z2RV0XxcfnFrv2VzXRhe-EvrHKtnjiC1spJnHy7B24nhE")'}}
                ></div>
                <div className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 border-2 border-background-dark"></div>
              </div>
              <div>
                <h2 className="text-sm text-slate-400 font-medium">Good evening,</h2>
                <h1 className="text-lg font-bold leading-tight tracking-tight">Admin</h1>
              </div>
            </div>
            <button className="relative flex items-center justify-center size-10 rounded-full bg-surface-dark shadow-sm active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-white" style={{fontSize: "24px"}}>notifications</span>
              <span className="absolute top-2 right-2 size-2.5 bg-primary rounded-full border border-surface-dark"></span>
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="px-4 mb-3 flex justify-between items-end">
            <h3 className="text-base font-bold text-white">Daily Overview</h3>
            <span className="text-xs font-medium text-slate-400">Oct 24, 2023</span>
          </div>
          <div className="flex overflow-x-auto gap-3 px-4 pb-2 no-scrollbar snap-x">
            <div className="snap-start flex min-w-[140px] flex-col justify-between rounded-xl p-4 bg-surface-dark shadow-sm border border-white/5">
              <div className="flex items-start justify-between">
                <span className="material-symbols-outlined text-slate-400" style={{fontSize: "20px"}}>local_taxi</span>
              </div>
              <div className="mt-3">
                <p className="text-3xl font-bold text-white">5</p>
                <p className="text-xs font-medium text-slate-400 mt-1">Today's Rides</p>
              </div>
            </div>
            <div className="snap-start flex min-w-[140px] flex-col justify-between rounded-xl p-4 bg-primary text-background-dark shadow-lg shadow-primary/20">
              <div className="flex items-start justify-between">
                <span className="material-symbols-outlined text-background-dark/70" style={{fontSize: "20px"}}>notification_important</span>
                <span className="flex size-2 bg-background-dark rounded-full animate-pulse"></span>
              </div>
              <div className="mt-3">
                <p className="text-3xl font-bold text-background-dark">2</p>
                <p className="text-xs font-bold text-background-dark/80 mt-1">Requested</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 px-4 flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Upcoming Rides</h3>
            <Link to="/admin/bookings" className="text-xs font-semibold text-primary hover:text-primary/80">See All</Link>
          </div>
          <div className="flex flex-col gap-4">
            <Link to="/admin/booking/1" className="bg-surface-dark rounded-xl p-4 shadow-sm border border-white/5 active:scale-[0.99] transition-transform block">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-md">
                  <span className="material-symbols-outlined text-slate-500 text-[16px]">schedule</span>
                  <span className="text-sm font-bold text-white">10:00 AM</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                  <span className="size-1.5 rounded-full bg-green-500"></span> Confirmed
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="bg-center bg-no-repeat bg-cover rounded-full size-12 shadow-inner" 
                  style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBex5PF4KvpTWZnJad8eLw2TwkLYxrdw0bOqre2scUmrz-azNCaw8mx80o4OS4Fh6pq0_ioeSfPYZSacG41UnTUZO7zdqfBB5kTt_eC_s1imQzH_WUZ1HK9Fou97NBgU1qsKw8ayWXCFLWzVNSvMtc3ZJXO0j5ztAoFrcc2b5zZB1qhD0UlGCHnjJ1Ec8NtlW6vtEcTdfqMTVYq9Y3Wo8gHLuqpgWxIootbPw_fD5VHGaY7nOtW0xECK5qvvTL9yIhkLYEHyWf_UxA")'}}
                ></div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-white truncate">John Doe</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="material-symbols-outlined text-slate-400 text-[14px]">stars</span>
                    <p className="text-xs text-slate-400">VIP Client</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <BottomNavAdmin active="home" />
      </div>
    </div>
  );
};

export default AdminDashboard;
