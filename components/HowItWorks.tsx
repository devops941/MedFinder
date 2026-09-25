const HowItWorks = () => (
  <section id="how-it-works" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">How MedFinder Works</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Getting your prescribed medications has never been easier. Follow these three simple steps.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
        {/* Connecting Line for desktop */}
        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gray-200 z-0"></div>
        
        {/* Step 1 */}
        <div className="relative z-10 flex flex-col items-center text-center group">
          <div className="w-24 h-24 bg-medblue-50 text-medblue-600 rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm border-4 border-white group-hover:bg-medblue-600 group-hover:text-white transition-all duration-300">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">1. Search Medicine</h3>
          <p className="text-gray-600 leading-relaxed">Enter the name of your medication and your current location or zip code into our search bar.</p>
        </div>
        
        {/* Step 2 */}
        <div className="relative z-10 flex flex-col items-center text-center group">
          <div className="w-24 h-24 bg-medgreen-50 text-medgreen-500 rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm border-4 border-white group-hover:bg-medgreen-500 group-hover:text-white transition-all duration-300">
            <i className="fa-solid fa-location-dot"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">2. Choose Pharmacy</h3>
          <p className="text-gray-600 leading-relaxed">View real-time stock at local pharmacies, compare prices, and select the most convenient option for you.</p>
        </div>
        
        {/* Step 3 */}
        <div className="relative z-10 flex flex-col items-center text-center group">
          <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm border-4 border-white group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
            <i className="fa-solid fa-bag-shopping"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">3. Reserve & Pickup</h3>
          <p className="text-gray-600 leading-relaxed">Reserve your medication online to ensure it's waiting for you when you arrive at the pharmacy.</p>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg">
          Create a Free Account
        </button>
      </div>
    </div>
  </section>
);

export default HowItWorks;
