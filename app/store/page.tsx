'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StorePage() {
  const [userEmail, setUserEmail] = useState('');
  const [stores, setStores] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('medfinder_user');
    if (saved) {
      const user = JSON.parse(saved);
      setUserEmail(user.email);
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      Promise.all([
        fetch(`/api/store?email=${userEmail}`).then(res => res.json()),
        fetch(`/api/reservation?storeOwnerEmail=${userEmail}`).then(res => res.json())
      ])
        .then(([storeData, reservationData]) => {
          if (storeData.success) {
            setStores(storeData.data);
          }
          if (reservationData.success) {
            setReservations(reservationData.data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [userEmail]);

  const updateReservationStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/reservation/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setReservations(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const activeStores = stores.length;
  const totalMedicines = stores.reduce((acc, store) => acc + (store.medicines?.length || 0), 0);

  return (
    <div className="font-sans text-gray-800 antialiased bg-gray-50 min-h-screen flex flex-col">
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Staff Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your pharmacy locations and inventory</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">

            <Link
              href="/store/register"
              className="bg-medgreen-500 hover:bg-medgreen-600 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md shadow-medgreen-500/30 transition-all duration-300 flex items-center space-x-2"
            >
              <i className="fa-solid fa-plus text-sm"></i>
              <span>Add New Store</span>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-2xl">
              <i className="fa-solid fa-store"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Stores</p>
              <h3 className="text-2xl font-bold text-gray-900">{activeStores}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center text-2xl">
              <i className="fa-solid fa-pills"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Medicines</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalMedicines}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-2xl">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Reservations</p>
              <h3 className="text-2xl font-bold text-gray-900">{reservations.filter(r => r.status === 'pending').length}</h3>
            </div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <i className="fa-solid fa-spinner fa-spin text-4xl text-medgreen-500"></i>
          </div>
        ) : stores.length === 0 ? (
          /* Empty State Section */
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-16 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-medgreen-100/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-medblue-100/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="relative z-10">
              <div className="mx-auto w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center mb-8 border-8 border-white shadow-lg relative">
                <div className="absolute inset-0 rounded-full animate-ping bg-medgreen-100 opacity-20"></div>
                <i className="fa-solid fa-store-slash text-4xl text-gray-400 group-hover:text-medgreen-500 transition-colors duration-500"></i>
              </div>

              <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                No Pharmacy Registered
              </h2>

              <p className="text-gray-500 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
                Your dashboard is currently empty. Get started by adding your first pharmacy location to our network and reach thousands of local customers looking for their prescriptions.
              </p>

              <Link
                href="/store/register"
                className="relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gray-900 rounded-full hover:bg-medgreen-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medgreen-500 overflow-hidden group/btn shadow-xl shadow-gray-200 hover:shadow-medgreen-500/40"
              >
                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                <span className="relative flex items-center space-x-3">
                  <i className="fa-solid fa-plus group-hover/btn:rotate-90 transition-transform duration-300"></i>
                  <span>Register a Pharmacy</span>
                </span>
              </Link>
            </div>
          </div>
        ) : (
          /* Store Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, index) => (
              <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-medgreen-200 transition-all duration-300 relative group overflow-hidden flex flex-col h-full">

                {/* Image or Placeholder Header */}
                <div className="h-56 -mx-6 -mt-6 mb-5 overflow-hidden bg-gradient-to-br from-medgreen-50 to-gray-50 relative">
                  {store.imageUrl ? (
                    <img src={store.imageUrl} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-medgreen-200/60 group-hover:scale-105 transition-transform duration-500">
                      <i className="fa-solid fa-store text-5xl mb-2"></i>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>

                <div className="relative z-10 flex-grow flex flex-col">
                  {/* Icon & Badge Row - Always overlaps the header */}
                  <div className="flex items-start justify-between mb-4 -mt-12 relative z-20">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-white text-gray-800 shadow-lg border border-gray-100">
                      <i className="fa-solid fa-shop"></i>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 bg-white/90 backdrop-blur shadow-sm text-green-700 mt-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      Active
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">{store.name}</h3>
                  <p className="text-sm text-gray-500 mb-2 flex items-start gap-2">
                    <i className="fa-solid fa-location-dot mt-1 text-gray-400"></i>
                    <span>{store.address}, {store.city}, {store.pincode}</span>
                  </p>

                  <div className="border-t border-gray-100 pt-2 flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Inventory</p>
                      <p className="font-bold text-gray-900">{store.medicines?.length || 0} items</p>
                    </div>
                    <Link
                      href={`/store/edit/${store._id}`}
                      className="text-medgreen-600 hover:text-white border border-medgreen-200 hover:bg-medgreen-500 px-4 py-2 rounded-lg text-sm font-semibold transition-all inline-block text-center"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
