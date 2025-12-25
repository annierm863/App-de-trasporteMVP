
import React from 'react';
import { BackButton } from '../components/Navigation';

const TermsPage: React.FC = () => {
  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen">
      <div className="relative flex h-full min-h-screen w-full max-w-md mx-auto flex-col overflow-x-hidden bg-background-dark">
        <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-background-dark/95 backdrop-blur-md border-b border-white/5">
          <BackButton />
          <h1 className="text-lg font-bold tracking-tight text-white flex-1 text-center pr-8">Terms & Policies</h1>
        </header>

        <main className="flex-1 w-full max-w-md mx-auto px-4 pt-4 pb-8">
          <div className="mb-6">
            <p className="text-base font-normal leading-relaxed text-gray-300/90">Please read these terms carefully before using our services.</p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { 
                title: 'Cancellation Policy', 
                icon: 'event_busy', 
                content: 'Cancellations made less than <span className="text-primary font-medium">2 hours</span> before pickup incur a full charge. No-shows are billed at the full rate plus gratuity.'
              },
              { 
                title: 'Privacy Policy', 
                icon: 'lock', 
                content: 'We value your privacy. Your trip history and personal details are encrypted and never shared with third parties.'
              },
              { 
                title: 'Usage Terms', 
                icon: 'gavel', 
                content: 'Passengers must adhere to local laws during transport. LuxeRide reserves the right to terminate service for disruptive behavior.'
              }
            ].map((item) => (
              <details key={item.title} className="group flex flex-col rounded-xl bg-white/5 border border-white/5 overflow-hidden transition-all duration-300">
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 select-none hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-500 transition-transform duration-300 group-open:-rotate-180">expand_more</span>
                </summary>
                <div className="px-4 pb-4 pt-0">
                  <div className="h-px w-full bg-white/10 mb-3"></div>
                  <p className="text-sm leading-relaxed text-gray-400" dangerouslySetInnerHTML={{ __html: item.content }} />
                </div>
              </details>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TermsPage;
