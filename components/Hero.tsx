'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const router = useRouter();
  const [medicine, setMedicine] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    const user = localStorage.getItem('medfinder_user');
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { role: 'customer' } }));
      return;
    }

    // If logged in, navigate to purchase page
    router.push('/purchase');
  };

  return (
    <header className="hero-gradient relative pt-20 pb-28 lg:pt-25 lg:pb-32 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-medblue-100 opacity-50 blur-3xl mix-blend-multiply"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-medgreen-100 opacity-50 blur-3xl mix-blend-multiply"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row-reverse items-center justify-between gap-12 lg:gap-16">

        {/* Left Side: Text and Search */}
        <div className="text-center lg:text-left flex-1 lg:max-w-2xl">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-medblue-600 to-medgreen-500">Medicine</span> You Need,<br className="hidden lg:block" /> Right When You Need It.
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 mx-auto lg:mx-0 mb-10 max-w-2xl">
            Instantly search thousands of local pharmacies to check real-time stock availability, compare prices, and reserve your medications.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto lg:mx-0 bg-white rounded-full shadow-2xl p-2 flex flex-col sm:flex-row border border-gray-100 relative z-20">
            <div className="flex-grow flex items-center px-4 py-3 sm:py-0 border-b sm:border-b-0 sm:border-r border-gray-100">
              <i className="fa-solid fa-magnifying-glass text-gray-400 mr-3"></i>
              <input
                type="text"
                placeholder="Search for medicine (e.g. Paracetamol)..."
                className="w-full bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 outline-none"
                value={medicine}
                onChange={(e) => setMedicine(e.target.value)}
              />
            </div>
            <div className="flex items-center px-4 py-3 sm:py-0 mb-2 sm:mb-0">
              <i className="fa-solid fa-location-dot text-gray-400 mr-3"></i>
              <input
                type="text"
                placeholder="Zip Code or City"
                className="w-full sm:w-48 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-medblue-600 hover:bg-medblue-700 text-white rounded-full py-3 px-8 font-semibold transition-colors duration-300 w-full sm:w-auto shadow-md shrink-0"
            >
              Search
            </button>
          </div>

          <div className="mt-8 flex justify-center lg:justify-start items-center space-x-6 text-sm text-gray-500 font-medium">
            <span className="flex items-center"><i className="fa-solid fa-check-circle text-medgreen-500 mr-2"></i> 10,000+ Pharmacies</span>
            <span className="flex items-center"><i className="fa-solid fa-check-circle text-medgreen-500 mr-2"></i> Real-time Updates</span>
          </div>
        </div>

        {/* Right Side (Now Left): Dynamic Image */}
        <div className="w-full max-w-xs lg:max-w-sm mt-12 lg:mt-0 relative group perspective-1000 z-0 mx-auto lg:mx-0">
          <div className="relative transform transition-all duration-700 ease-out group-hover:-translate-y-4 group-hover:scale-105 group-hover:-rotate-2">
            <img
              src="/floating_medicine.jpg"
              alt="Medical App Illustration"
              className="w-full h-auto rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] mix-blend-multiply border-4 border-white"
            />

            {/* Floating Badges */}
            <div className="absolute -top-4 -left-2 md:-left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl animate-bounce border border-gray-100" style={{ animationDuration: '3s' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-medgreen-50 text-medgreen-500 flex items-center justify-center text-sm">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Pharmacy</p>
                  <p className="font-bold text-gray-900 text-xs">Nearby</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-2 -right-2 md:-right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl animate-bounce border border-gray-100" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-medblue-50 text-medblue-600 flex items-center justify-center text-sm">
                  <i className="fa-solid fa-check"></i>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Status</p>
                  <p className="font-bold text-gray-900 text-xs">In Stock</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Hero;
