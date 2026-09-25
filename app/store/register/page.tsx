'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterStorePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('medfinder_user');
    if (saved) {
      const user = JSON.parse(saved);
      setUserEmail(user.email);
    } else {
      router.push('/');
    }
  }, [router]);

  // Store Details
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Medicines List
  const [medicines, setMedicines] = useState([{ name: '', price: '' }]);

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', price: '' }]);
  };

  const handleRemoveMedicine = (index: number) => {
    const newMeds = [...medicines];
    newMeds.splice(index, 1);
    setMedicines(newMeds);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to ~2MB to avoid huge base64 strings in MongoDB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateMedicine = (index: number, field: string, value: string) => {
    const newMeds = [...medicines];
    newMeds[index] = { ...newMeds[index], [field]: value };
    setMedicines(newMeds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Filter out completely empty medicine rows
    const validMedicines = medicines
      .filter(m => m.name.trim() !== '')
      .map(m => ({
        name: m.name,
        price: Number(m.price) || 0
      }));

    const payload = {
      name: storeName,
      address,
      city,
      pincode,
      imageUrl,
      ownerEmail: userEmail,
      medicines: validMedicines
    };

    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ text: 'Pharmacy Registered Successfully! Redirecting...', type: 'success' });
        router.push('/store');
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
    <div className="font-sans text-gray-800 antialiased bg-gray-50 min-h-screen flex flex-col">
      
      
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <i className="fa-solid fa-store text-medgreen-500"></i>
              Register New Pharmacy
            </h1>
            <p className="text-sm text-gray-500 mt-1">Fill in your store details and build your initial inventory.</p>
          </div>
          <button 
            onClick={() => router.push('/store')}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>

        {message && (
          <div className={`p-3 mb-4 rounded-lg text-sm font-semibold flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
            <i className={`fa-solid ${message.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'} text-lg`}></i>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Left Side: Store Details Section */}
            <div className="w-full md:w-1/2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="w-6 h-6 rounded-full bg-medblue-100 text-medblue-600 flex items-center justify-center text-xs">1</span>
                Store Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Pharmacy Name</label>
                  <input 
                    type="text" required value={storeName} onChange={e => setStoreName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-medgreen-500 focus:border-medgreen-500 outline-none bg-gray-50 focus:bg-white transition-all"
                    placeholder="e.g. HealthPlus Pharmacy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Store Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                      Upload Image
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {imageUrl && (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setImageUrl('')}
                          className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <i className="fa-solid fa-xmark text-xl"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Street Address</label>
                  <input 
                    type="text" required value={address} onChange={e => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-medgreen-500 focus:border-medgreen-500 outline-none bg-gray-50 focus:bg-white transition-all"
                    placeholder="123 Medical Ave"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                    <input 
                      type="text" required value={city} onChange={e => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-medgreen-500 focus:border-medgreen-500 outline-none bg-gray-50 focus:bg-white transition-all"
                      placeholder="New York"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Pincode / Zip</label>
                    <input 
                      type="text" required value={pincode} onChange={e => setPincode(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-medgreen-500 focus:border-medgreen-500 outline-none bg-gray-50 focus:bg-white transition-all"
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Medicines Section */}
            <div className="w-full md:w-1/2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col max-h-[500px]">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-medgreen-100 text-medgreen-600 flex items-center justify-center text-xs">2</span>
                  Inventory (Medicines)
                </div>
                <button 
                  type="button" 
                  onClick={handleAddMedicine}
                  className="text-xs bg-medblue-50 text-medblue-600 hover:bg-medblue-100 px-2.5 py-1.5 rounded font-semibold transition-colors"
                >
                  + Add Row
                </button>
              </h3>
              
              <div className="space-y-3 overflow-y-auto pr-2 flex-grow">
                {medicines.map((med, index) => (
                  <div key={index} className="flex gap-3 items-end bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex-grow">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Medicine Name</label>
                      <input 
                        type="text" value={med.name} onChange={e => updateMedicine(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-medblue-500 outline-none bg-white transition-all"
                        placeholder="e.g. Paracetamol 500mg"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Price ($)</label>
                      <input 
                        type="number" step="0.01" value={med.price} onChange={e => updateMedicine(index, 'price', e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-medblue-500 outline-none bg-white transition-all"
                        placeholder="9.99"
                      />
                    </div>
                    {medicines.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveMedicine(index)}
                        className="text-red-400 hover:text-red-600 p-2 mb-0.5 transition-colors"
                        title="Remove row"
                      >
                        <i className="fa-solid fa-trash text-sm"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="mt-8">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-medgreen-600 text-white font-semibold py-4 px-4 rounded-xl shadow-md transition-all duration-300 flex justify-center items-center text-sm"
            >
              {loading ? (
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              ) : (
                <>
                  <i className="fa-solid fa-check mr-2"></i>
                  Save Pharmacy & Inventory
                </>
              )}
            </button>
          </div>
        </form>
        
      </main>
    </div>
  );
}
