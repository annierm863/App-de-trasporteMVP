
import React from 'react';
import { BackButton } from '../components/Navigation';

const ServiceInfo: React.FC = () => {
  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen">
      <div className="relative flex h-full min-h-screen w-full max-w-md mx-auto flex-col overflow-x-hidden bg-background-dark shadow-2xl">
        <header className="sticky top-0 z-20 flex items-center justify-between p-4 pb-2 bg-background-dark/95 backdrop-blur-md border-b border-white/5">
          <BackButton />
          <h2 className="text-lg font-bold leading-tight flex-1 text-center pr-10 tracking-tight">Service Details</h2>
        </header>

        <main className="flex-1 flex flex-col gap-6 p-4">
          <div className="relative w-full overflow-hidden rounded-xl bg-gray-900 aspect-[16/9] shadow-lg group">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBigT3ZvpggEbLdl8RCnQw6zEdiFIIfn1lv46q2vkgKYTnjvgOt7YuO2uZHt8XOMfB09ubDVHWBROyaY2d41gbPs4Ush81ss1WyA7fNNKis-MexnS0F-9UGa-GhBBF1HMe1EQ_EhVot1HuOBq3zvl7VrGTaF8fkuxa_s36w-Rv_PiivOYjZG3lIYiMFhv9ufon2opB7Mx-GuWbMG7aTnodiPb1Trc2ZyubejVyCyyQhOkK5ZtwO56iljPZ9kO0TXJYhbg2x5_aWoj0')"}}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-5 w-full">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-[18px] filled">star</span>
                <p className="text-primary text-xs font-bold uppercase tracking-wider">World Class</p>
              </div>
              <h1 className="text-white text-2xl font-bold leading-tight drop-shadow-sm">Premium Chauffeur<br/>Experience</h1>
            </div>
          </div>

          <section className="flex flex-col gap-3 rounded-xl bg-white/5 p-5 border border-white/5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[20px] filled">verified_user</span>
              </div>
              <h3 className="text-lg font-bold text-white">About Us</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              LuxeRide provides executive black car services with elite, professional drivers. 
              We guarantee punctuality, discretion, and ultimate comfort for every journey. 
              Our fleet features the latest models of Mercedes-Benz, BMW, and Cadillac.
            </p>
          </section>

          <section className="flex flex-col gap-3 rounded-xl bg-white/5 p-5 border border-white/5 shadow-sm">
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Our Fleet</h3>
            <div className="space-y-4">
              {[
                { name: 'Executive Sedan', desc: 'Mercedes S-Class or similar', capacity: '3 Pax' },
                { name: 'Premium SUV', desc: 'Cadillac Escalade or similar', capacity: '6 Pax' },
                { name: 'Luxury Sprinter', desc: 'Custom Mercedes Sprinter', capacity: '12 Pax' }
              ].map((fleet) => (
                <div key={fleet.name} className="flex justify-between items-center pb-3 border-b border-white/5 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold">{fleet.name}</p>
                    <p className="text-xs text-text-subtle">{fleet.desc}</p>
                  </div>
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">{fleet.capacity}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ServiceInfo;
