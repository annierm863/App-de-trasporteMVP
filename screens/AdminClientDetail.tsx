
import React from 'react';
import { BackButton } from '../components/Navigation';

const AdminClientDetail: React.FC = () => {
  return (
    <div className="bg-background-dark text-white font-display antialiased min-h-screen pb-24">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <header className="flex items-center px-4 py-4 justify-between sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md">
          <BackButton />
          <h2 className="text-white text-lg font-bold flex-1 text-center">Client Detail</h2>
          <button className="text-primary font-bold">Edit</button>
        </header>

        <main className="flex-1 overflow-y-auto pb-8">
          <div className="flex flex-col items-center pt-2 pb-6 px-4">
            <div 
              className="bg-center bg-no-repeat bg-cover rounded-full h-28 w-28 border-2 border-primary/20 shadow-lg mb-4" 
              style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDLa9Eamk5TkCDoW7fZdEj53xjshUIUD44m6pgFkJm8EOJrq7zmuazNLVgkdow-SjOBMYvqlPy4iRDdyXgebUG5MtdLP-7k1Ozn09qu733Gj56JRB2_S-Ed_NY8hcoII_X9E9U47BiBwF3oeCILmJlQ4Uop6UOR0lzjrjsCygsZBdgmFre_CvlQ87qUfQ-YXJe9XkvdzTxt9vvgsLaqeMZig2_RyduAuebfNZrR2_g21YYdms-Lw8G52sqfiC-ATOl0A0uxKhrdjlw")'}}
            ></div>
            <h1 className="text-white text-2xl font-bold text-center mb-1">Alexander Hamilton</h1>
            <p className="text-text-secondary text-base text-center mb-6">+1 (555) 019-2834</p>
          </div>

          <div className="px-6 space-y-6">
            <div className="bg-surface-dark rounded-xl p-5 border border-white/5">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Total Activity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">42</span>
                  <span className="text-xs text-text-subtle">Completed Trips</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">$5,240</span>
                  <span className="text-xs text-text-subtle">Lifetime Spend</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-dark rounded-xl p-5 border border-white/5">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Preferences</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Default Vehicle</span>
                  <span className="text-sm font-bold">SUV Luxury</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Water Preference</span>
                  <span className="text-sm font-bold">Sparkling</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminClientDetail;
