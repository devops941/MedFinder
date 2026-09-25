'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function StorePurchasePage() {
  const router = useRouter();
  const params = useParams();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [reserving, setReserving] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchStore = async () => {
      if (!params || !params.id) return;
      try {
        const res = await fetch(`/api/store/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setStore(data.data);

          // Removed: quantities are initialized to 0 implicitly so the 'Add' button shows first.
        }
      } catch (error) {
        console.error('Failed to fetch store details', error);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchStore();
    }
  }, [params?.id]);

  const updateQuantity = (medName: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[medName] || 0;
      const next = current + delta;

      const newQuantities = { ...prev };
      if (next <= 0) {
        delete newQuantities[medName];
      } else {
        newQuantities[medName] = next;
      }
      return newQuantities;
    });
  };

  const handleReserve = (med: any) => {
    const qty = quantities[med.name] || 1;
    setReserving(med.name);

    // Simulate API call for reservation
    setTimeout(() => {
      alert(`Successfully reserved ${qty}x ${med.name} at ${store.name} for $${(qty * parseFloat(med.price)).toFixed(2)}`);
      setReserving(null);
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medblue-600"></div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-grow flex items-center justify-center text-center p-6">
          <div>
            <i className="fa-solid fa-store-slash text-6xl text-gray-300 mb-4"></i>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pharmacy Not Found</h1>
            <p className="text-gray-500 mb-6">The store you are looking for does not exist or has been removed.</p>
            <Link href="/purchase" className="bg-medblue-600 text-white font-semibold py-3 px-6 rounded-xl">Back to Pharmacies</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-800 antialiased bg-gray-50 min-h-screen flex flex-col">
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Back Button */}
        <Link href="/purchase" className="inline-flex items-center gap-2 text-gray-500 hover:text-medblue-600 font-medium mb-6 transition-colors">
          <i className="fa-solid fa-arrow-left"></i>
          Back to all pharmacies
        </Link>

        {/* Pharmacy Info Header */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-10">
          <div className="h-48 md:h-64 bg-medblue-50 relative">
            {store.imageUrl ? (
              <img src={store.imageUrl} alt={store.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-medblue-200/60">
                <i className="fa-solid fa-store text-6xl mb-2"></i>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          <div className="p-8 relative">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center text-3xl text-medblue-600 absolute -top-8 left-8">
              <i className="fa-solid fa-shop"></i>
            </div>

            <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-extrabold text-gray-900">{store.name}</h1>
                  <span className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 bg-green-50 text-green-700 border border-green-200">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Open
                  </span>
                </div>
                <p className="text-gray-500 flex items-center gap-2 text-lg">
                  <i className="fa-solid fa-location-dot"></i>
                  {store.address}, {store.city}, {store.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Medicines List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Inventory</h2>

          {(!store.medicines || store.medicines.length === 0) ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
              <i className="fa-solid fa-box-open text-5xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Medicines Available</h3>
              <p className="text-gray-500">This pharmacy hasn't added any inventory yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {store.medicines.map((med: any, index: number) => {
                  const qty = quantities[med.name] || 0;

                  return (
                    <div key={index} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-medblue-50 text-medblue-600 flex items-center justify-center text-xl shrink-0">
                          <i className="fa-solid fa-pills"></i>
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="text-lg font-bold text-gray-900 truncate" title={med.name}>{med.name}</h3>
                          <p className="text-xs font-semibold text-green-600 flex items-center gap-1">
                            <i className="fa-solid fa-check-circle"></i> In Stock
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto border-t border-gray-100 pt-4 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Price</p>
                          <span className="font-extrabold text-lg text-medblue-700">${med.price}</span>
                        </div>

                        {qty > 0 ? (
                          <div className="flex items-center bg-gray-50 rounded-lg border border-medblue-200 overflow-hidden shadow-sm h-9">
                            <button
                              onClick={() => updateQuantity(med.name, -1)}
                              className={`w-8 h-full flex items-center justify-center transition-colors font-bold shrink-0 ${qty === 1 ? 'text-red-500 hover:bg-red-50' : 'text-medblue-600 hover:bg-medblue-100'}`}
                            >
                              {qty === 1 ? <i className="fa-solid fa-trash-can text-xs"></i> : <i className="fa-solid fa-minus text-xs"></i>}
                            </button>
                            <div className="w-8 text-center font-bold text-gray-900 bg-white h-full flex items-center justify-center border-x border-gray-200 text-sm">
                              {qty}
                            </div>
                            <button
                              onClick={() => updateQuantity(med.name, 1)}
                              className="w-8 h-full flex items-center justify-center text-medblue-600 hover:bg-medblue-100 transition-colors font-bold shrink-0"
                            >
                              <i className="fa-solid fa-plus text-xs"></i>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => updateQuantity(med.name, 1)}
                            className="font-bold py-1.5 px-4 rounded-lg transition-all bg-medblue-50 text-medblue-700 hover:bg-medblue-600 hover:text-white text-sm flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <i className="fa-solid fa-plus text-xs"></i> Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Reservation Bar */}
              {Object.keys(quantities).filter(k => quantities[k] > 0).length > 0 && (
                <div className={`mt-10 backdrop-blur-xl rounded-full py-4 px-6 sm:px-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-8 z-50 transition-all duration-500 animate-fade-in-up w-full max-w-4xl mx-auto ${showSuccess ? 'bg-green-600/95 border border-green-500' : 'bg-gray-900/95 border border-gray-800'}`}>

                  {showSuccess ? (
                    <div className="w-full flex items-center justify-center gap-4 text-white py-2">
                      <div className="w-10 h-10 rounded-full bg-white text-green-600 flex items-center justify-center text-xl shrink-0">
                        <i className="fa-solid fa-check"></i>
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold">Reservation sent to pharmacy!</h3>
                        <p className="text-sm opacity-90">The staff has been notified and will prepare your order.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-medblue-400 text-xl shadow-inner shrink-0 hidden sm:flex">
                          <i className="fa-solid fa-cart-shopping"></i>
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-0.5">
                            {Object.keys(quantities).filter(k => quantities[k] > 0).length} items selected
                          </h3>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            Total Estimated Price: <span className="font-extrabold text-white text-base sm:text-lg ml-1">
                              ${Object.keys(quantities).reduce((acc, medName) => {
                                const med = store.medicines.find((m: any) => m.name === medName);
                                return acc + (quantities[medName] * (med ? parseFloat(med.price) : 0));
                              }, 0).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          setReserving('all');

                          try {
                            // Get customer from local storage
                            const userStr = localStorage.getItem('medfinder_user');
                            const user = userStr ? JSON.parse(userStr) : null;

                            if (!user) {
                              alert('Please login first to make a reservation');
                              setReserving(null);
                              return;
                            }

                            // Prepare items
                            const items = Object.keys(quantities).filter(k => quantities[k] > 0).map(medName => {
                              const med = store.medicines.find((m: any) => m.name === medName);
                              return {
                                name: medName,
                                quantity: quantities[medName],
                                price: med ? parseFloat(med.price) : 0
                              };
                            });

                            const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

                            // Send to API
                            const response = await fetch('/api/reservation', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                storeId: store._id,
                                storeOwnerEmail: store.ownerEmail,
                                customerName: user.name,
                                customerEmail: user.email,
                                customerMobile: user.mobile || 'N/A',
                                items,
                                totalPrice
                              })
                            });

                            if (response.ok) {
                              setShowSuccess(true);
                              setTimeout(() => {
                                setQuantities({});
                                setShowSuccess(false);
                                setReserving(null);
                              }, 3500); // Hide success after 3.5s
                            } else {
                              throw new Error('Failed to reserve');
                            }
                          } catch (error) {
                            console.error('Reservation failed', error);
                            alert('Failed to place reservation. Please try again.');
                            setReserving(null);
                          }
                        }}
                        disabled={reserving !== null}
                        className="w-full sm:w-auto bg-medblue-600 hover:bg-medblue-500 text-white font-bold text-base py-3 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-medblue-500"
                      >
                        {reserving ? (
                          <><i className="fa-solid fa-circle-notch fa-spin"></i> Processing...</>
                        ) : (
                          <>Reserve Selected <i className="fa-solid fa-arrow-right"></i></>
                        )}
                      </button>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>

      </main>

    </div>
  );
}
