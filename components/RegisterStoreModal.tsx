'use client';

import { useState } from 'react';

interface RegisterStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export default function RegisterStoreModal({ isOpen, onClose, userEmail }: RegisterStoreModalProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  // Store Details
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  // Initial Medicine
  const [medName, setMedName] = useState('');
  const [medPrice, setMedPrice] = useState('');
  const [medStock, setMedStock] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      name: storeName,
      address,
      city,
      pincode,
      ownerEmail: userEmail,
      medicines: medName ? [{
        name: medName,
        price: Number(medPrice),
        stock: Number(medStock)
      }] : []
    };

    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ text: 'Pharmacy Registered Successfully!', type: 'success' });
        onClose();
        // Reset form
        setStoreName(''); setAddress(''); setCity(''); setPincode('');
        setMedName(''); setMedPrice(''); setMedStock('');
        setMessage(null);
        // Dispatch event to refresh store list
        window.dispatchEvent(new Event('store-added'));
      } else {
        setMessage({ text: data.message || 'Error registering store', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Something went wrong. Try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto py-10">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative my-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="p-8 md:p-10">
          <div className="mb-8 border-b border-gray-100 pb-6">
            <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <i className="fa-solid fa-store text-medgreen-500"></i>
              Register New Pharmacy
            </h2>
            <p className="text-gray-500 mt-2">Fill in your store details and add your first medicine to the inventory.</p>
          </div>

          {message && (
            <div className={`p-4 mb-6 rounded-xl text-sm font-semibold flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
              <i className={`fa-solid ${message.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'} text-lg`}></i>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Store Details Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-medblue-100 text-medblue-600 flex items-center justify-center text-xs">1</span>
                Store Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Name</label>
                  <input 
                    type="text" required value={storeName} onChange={e => setStoreName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-medgreen-500 focus:border-medgreen-500 outline-none bg-gray-50 focus:bg-white transition-all"
                    placeholder="e.g. HealthPlus Pharmacy"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input 
                    type="text" required value={address} onChange={e => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-medgreen-500 focus:border-medgreen-500 outline-none bg-gray-50 focus:bg-white transition-all"
                    placeholder="123 Medical Ave"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    type="text" required value={city} onChange={e => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-medgreen-500 focus:border-medgreen-500 outline-none bg-gray-50 focus:bg-white transition-all"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode / Zip</label>
                  <input 
                    type="text" required value={pincode} onChange={e => setPincode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-medgreen-500 focus:border-medgreen-500 outline-none bg-gray-50 focus:bg-white transition-all"
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>

            {/* Initial Inventory Section */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-medblue-100 text-medblue-600 flex items-center justify-center text-xs">2</span>
                Add First Medicine (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                  <input 
                    type="text" value={medName} onChange={e => setMedName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-medblue-500 outline-none bg-white transition-all"
                    placeholder="e.g. Paracetamol 500mg"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input 
                    type="number" step="0.01" value={medPrice} onChange={e => setMedPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-medblue-500 outline-none bg-white transition-all"
                    placeholder="9.99"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input 
                    type="number" value={medStock} onChange={e => setMedStock(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-medblue-500 outline-none bg-white transition-all"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-medgreen-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-gray-200 hover:shadow-medgreen-500/40 transition-all duration-300 flex justify-center items-center text-lg"
            >
              {loading ? (
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              ) : (
                <>
                  <i className="fa-solid fa-check mr-2"></i>
                  Complete Registration
                </>
              )}
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}
