'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

export default function EditStorePage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params?.id as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Store Details
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Medicines List
  const [medicines, setMedicines] = useState([{ name: '', price: '' }]);

  useEffect(() => {
    // Verify user is logged in
    const saved = localStorage.getItem('medfinder_user');
    if (!saved) {
      router.push('/');
      return;
    }

    if (!storeId) return;

    // Fetch existing store data
    fetch(`/api/store/${storeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const store = data.data;
          setStoreName(store.name || '');
          setAddress(store.address || '');
          setCity(store.city || '');
          setPincode(store.pincode || '');
          setImageUrl(store.imageUrl || '');
          
          if (store.medicines && store.medicines.length > 0) {
            setMedicines(store.medicines.map((m: any) => ({ name: m.name, price: m.price.toString() })));
          }
        } else {
          setMessage({ text: 'Could not load store details.', type: 'error' });
        }
        setInitialLoading(false);
      })
      .catch(err => {
        console.error(err);
        setMessage({ text: 'Error connecting to server.', type: 'error' });
        setInitialLoading(false);
      });
  }, [params.id, router]);

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
      medicines: validMedicines
    };

    try {
      const res = await fetch(`/api/store/${storeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ text: 'Pharmacy Updated Successfully! Redirecting...', type: 'success' });
        router.push('/store');
      } else {
        setMessage({ text: data.message || 'Error updating store', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Something went wrong. Try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <i className="fa-solid fa-spinner fa-spin text-4xl text-medgreen-500"></i>
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-800 antialiased bg-gray-50 min-h-screen flex flex-col">
      
      
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <i className="fa-solid fa-pen-to-square text-medgreen-500"></i>
              Manage Pharmacy
            </h1>
            <p className="text-sm text-gray-500 mt-1">Update your store details and manage inventory.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="text-sm text-red-500 hover:text-red-700 transition-colors font-semibold bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg"
            >
              <i className="fa-solid fa-trash mr-2"></i>Delete Store
            </button>
            <button 
              onClick={() => router.push('/store')}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
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
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                    <input 
                      type="text" required value={city} onChange={e => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-medgreen-500 focus:border-medgreen-500 outline-none bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Pincode / Zip</label>
                    <input 
                      type="text" required value={pincode} onChange={e => setPincode(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-medgreen-500 focus:border-medgreen-500 outline-none bg-gray-50 focus:bg-white transition-all"
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
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
        
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative animate-fade-in-up border border-gray-100 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Pharmacy?</h2>
            <p className="text-gray-500 mb-6 text-sm">Are you sure you want to delete this pharmacy? This action cannot be undone.</p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/store/${storeId}`, { method: 'DELETE' });
                    if (res.ok) router.push('/store');
                  } catch (err) {
                    alert('Error deleting pharmacy');
                  }
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-md shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
