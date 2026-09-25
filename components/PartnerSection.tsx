const PartnerSection = () => (
  <section className="py-16 bg-medblue-600 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="white" strokeWidth="2" fill="none"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pattern)"></rect>
      </svg>
    </div>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between">
      <div className="text-center lg:text-left mb-8 lg:mb-0 lg:max-w-2xl">
        <h2 className="text-3xl font-bold text-white mb-4">Are you a Pharmacy Owner or Staff?</h2>
        <p className="text-medblue-100 text-lg">Join our network to manage your inventory, receive online reservations, and reach thousands of new patients in your local area.</p>
      </div>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <button className="bg-white text-medblue-600 hover:bg-gray-50 font-bold py-3 px-8 rounded-full shadow-lg transition-colors">
          Partner With Us
        </button>
        <button className="bg-transparent border border-white text-white hover:bg-white hover:text-medblue-600 font-bold py-3 px-8 rounded-full transition-colors">
          Staff Portal
        </button>
      </div>
    </div>
  </section>
);

export default PartnerSection;
