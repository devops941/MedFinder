'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PurchasePage() {
  const router = useRouter();
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchMedicine, setSearchMedicine] = useState('');
  const [searchZipcode, setSearchZipcode] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch('/api/store');
        const data = await res.json();
        if (data.success) {
          setStores(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  // Filter logic
  const filteredStores = stores.filter(store => {
    // Check if zip code matches
    const matchesZip = searchZipcode === '' || store.pincode.includes(searchZipcode) || store.city.toLowerCase().includes(searchZipcode.toLowerCase());
    
    // Check if any medicine matches
    const matchesMedicine = searchMedicine === '' || (store.medicines && store.medicines.some((med: any) => med.name.toLowerCase().includes(searchMedicine.toLowerCase())));
    
    return matchesZip && matchesMedicine;
  });

  return (
    <div className="font-sans text-gray-800 antialiased bg-gray-50 min-h-screen flex flex-col">
      

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header & Search */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Find Your Medicine</h1>
          <p className="text-gray-500 mb-6">Search for medications and find nearby pharmacies that have them in stock.</p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <i className="fa-solid fa-pills"></i>
              </div>
              <input 
                type="text" 
                value={searchMedicine}
                onChange={(e) => setSearchMedicine(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-medblue-500 transition-all shadow-sm"
                placeholder="Search for medicine (e.g. Paracetamol)"
              />
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <input 
                type="text" 
                value={searchZipcode}
                onChange={(e) => setSearchZipcode(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-medblue-500 transition-all shadow-sm"
                placeholder="City or Zip Code"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medblue-600"></div>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-3xl mx-auto mt-10">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-magnifying-glass-minus text-4xl text-red-300"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Pharmacies Found</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">We couldn't find any stores matching your current search criteria. Try adjusting your filters.</p>
            <button 
              onClick={() => { setSearchMedicine(''); setSearchZipcode(''); }}
              className="text-medblue-600 font-semibold hover:bg-medblue-50 px-6 py-2 rounded-xl transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Available Pharmacies <span className="text-gray-400 font-medium ml-2">({filteredStores.length})</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store, index) => {
                // If searching for a medicine, see if we can find its price to highlight
                let highlightMed = null;
                if (searchMedicine) {
                  highlightMed = store.medicines?.find((m: any) => m.name.toLowerCase().includes(searchMedicine.toLowerCase()));
                }

                return (
                  <div 
                    key={index} 
                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-medblue-200 transition-all duration-300 relative group overflow-hidden flex flex-col h-full cursor-pointer" 
                    onClick={() => router.push(`/purchase/${store._id}`)}
                  >
                    
                    {/* Image Header */}
                    <div className="h-56 -mx-6 -mt-6 mb-5 overflow-hidden bg-gradient-to-br from-medblue-50 to-gray-50 relative">
                      {store.imageUrl ? (
                        <img src={store.imageUrl} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-medblue-200/60 group-hover:scale-105 transition-transform duration-500">
                          <i className="fa-solid fa-store text-5xl mb-2"></i>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    </div>

                    <div className="relative z-10 flex-grow flex flex-col">
                      <div className="flex items-start justify-between mb-4 -mt-12 relative z-20">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-white text-gray-800 shadow-lg border border-gray-100">
                          <i className="fa-solid fa-shop text-medblue-600"></i>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 bg-white/90 backdrop-blur shadow-sm text-green-700 mt-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          Open
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-1">{store.name}</h3>
                      <p className="text-sm text-gray-500 mb-4 flex items-start gap-2">
                        <i className="fa-solid fa-location-dot mt-1 text-gray-400"></i>
                        <span>{store.address}, {store.city}, {store.pincode}</span>
                      </p>

                      {highlightMed ? (
                        <div className="bg-medblue-50 border border-medblue-100 rounded-xl p-3 mb-4 mt-auto">
                          <p className="text-xs text-medblue-600 font-bold uppercase tracking-wider mb-1">In Stock</p>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-900">{highlightMed.name}</span>
                            <span className="font-bold text-medblue-700">${highlightMed.price}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="border-t border-gray-100 pt-3 mt-auto flex justify-between items-center">
                           <div>
                              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Inventory</p>
                              <p className="font-bold text-gray-900">{store.medicines?.length || 0} items</p>
                           </div>
                        </div>
                      )}
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); router.push(`/purchase/${store._id}`); }}
                        className="w-full mt-4 bg-gray-900 hover:bg-medblue-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-md"
                      >
                        View Inventory & Reserve
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      
    </div>
  );
}
