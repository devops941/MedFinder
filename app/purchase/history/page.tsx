'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CustomerHistoryPage() {
  const [userEmail, setUserEmail] = useState('');
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('medfinder_user');
    if (saved) {
      const user = JSON.parse(saved);
      setUserEmail(user.email);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetch(`/api/reservation?customerEmail=${userEmail}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setReservations(data.data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [userEmail]);

  return (
    <div className="font-sans text-gray-800 antialiased bg-gray-50 min-h-screen flex flex-col">
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/purchase" className="text-gray-400 hover:text-medblue-600 transition-colors">
                <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <i className="fa-solid fa-clock-rotate-left text-medblue-600"></i> My Reservations
            </h1>
            <p className="text-gray-500 mt-1">View the status of your medicine reservations</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <i className="fa-solid fa-spinner fa-spin text-4xl text-medgreen-500"></i>
          </div>
        ) : reservations.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-16 flex flex-col items-center justify-center text-center">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                <i className="fa-solid fa-receipt text-3xl text-gray-400"></i>
             </div>
             <h2 className="text-2xl font-bold text-gray-900 mb-2">No Reservations Yet</h2>
             <p className="text-gray-500 max-w-md mb-6">You haven't made any reservations. Search for medicines to get started.</p>
             <Link href="/purchase" className="bg-medblue-600 hover:bg-medblue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
               Browse Medicines
             </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5 font-bold">Date & Time</th>
                    <th className="p-5 font-bold">Items</th>
                    <th className="p-5 font-bold">Total Amount</th>
                    <th className="p-5 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reservations.map((order, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-5">
                        <p className="text-sm font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </td>
                      <td className="p-5">
                        <p className="text-sm font-bold text-gray-900">{order.items.length} item(s)</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                          {order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}
                        </p>
                      </td>
                      <td className="p-5">
                        <p className="font-extrabold text-medblue-700">${order.totalPrice.toFixed(2)}</p>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-700' 
                            : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-orange-100 text-orange-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            order.status === 'completed' ? 'bg-green-500' : order.status === 'cancelled' ? 'bg-red-500' : 'bg-orange-500'
                          }`}></span>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
