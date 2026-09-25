'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';

const Navbar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState<'customer' | 'staff'>('customer');
  const [user, setUser] = useState<{ name: string, role: string, email: string } | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const visibleNotifications = notifications.filter(n => !n.isArchived);
  const unreadCount = visibleNotifications.filter(n => !n.isRead).length;

  const fetchNotifications = async (email: string) => {
    try {
      const res = await fetch(`/api/reservation?storeOwnerEmail=${email}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const checkUser = () => {
    const saved = localStorage.getItem('medfinder_user');
    if (saved) {
      const parsedUser = JSON.parse(saved);
      setUser(parsedUser);
      if (parsedUser.role === 'staff') {
        fetchNotifications(parsedUser.email);
        // Poll for notifications every 30 seconds
        const interval = setInterval(() => fetchNotifications(parsedUser.email), 30000);
        return () => clearInterval(interval);
      }
    } else {
      setUser(null);
      setNotifications([]);
    }
  };

  const handleViewDetails = async (notif: any) => {
    setSelectedNotification(notif);
    setIsNotificationOpen(false); // Close dropdown

    if (!notif.isRead) {
      // Optimistic UI update
      setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));

      try {
        await fetch(`/api/reservation/${notif._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead: true })
        });
      } catch (error) {
        console.error('Failed to mark notification as read', error);
      }
    }
  };

  const handleDismissNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Optimistic update
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isArchived: true } : n));
    try {
      await fetch(`/api/reservation/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived: true })
      });
    } catch (error) {
      console.error('Failed to dismiss notification', error);
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener('user-login', checkUser);

    const handleOpenAuthModal = (e: any) => {
      openModal(e.detail?.role || 'customer');
    };
    window.addEventListener('open-auth-modal', handleOpenAuthModal);

    return () => {
      window.removeEventListener('user-login', checkUser);
      window.removeEventListener('open-auth-modal', handleOpenAuthModal);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('medfinder_user');
    checkUser();
    router.push('/');
  };

  const openModal = (role: 'customer' | 'staff') => {
    setAuthRole(role);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <div className="w-10 h-10 bg-medblue-600 rounded-lg flex items-center justify-center text-white mr-3 shadow-md">
                <i className="fa-solid fa-pills text-xl"></i>
              </div>
              <span className="font-bold text-2xl tracking-tight text-gray-900">
                Med<span className="text-medblue-600">Finder</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">

              {/* Auth Section */}
              {user ? (
                <div className="flex items-center space-x-6">
                  {/* History Icon (Both Staff & Customer) */}
                  <button
                    onClick={() => router.push(user.role === 'staff' ? '/store/history' : '/purchase/history')}
                    className="text-gray-500 hover:text-medblue-600 transition-colors mt-1"
                    title={user.role === 'staff' ? 'Order History' : 'My Reservations'}
                  >
                    <i className="fa-solid fa-clock-rotate-left text-xl"></i>
                  </button>

                  {/* Notification Bell (Staff Only) */}
                  {user.role === 'staff' && (
                    <div className="relative">
                      <button
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className="text-gray-500 hover:text-medblue-600 transition-colors relative mt-1"
                      >
                        <i className="fa-solid fa-bell text-xl"></i>
                        {unreadCount > 0 && (
                          <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] text-white font-bold items-center justify-center">
                              {unreadCount}
                            </span>
                          </span>
                        )}
                      </button>

                      {/* Dropdown Menu */}
                      {isNotificationOpen && (
                        <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && <span className="text-xs bg-medblue-100 text-medblue-700 px-2 py-0.5 rounded-full font-bold">{unreadCount} new</span>}
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {visibleNotifications.length === 0 ? (
                              <div className="p-6 text-center text-gray-400">
                                <i className="fa-regular fa-bell-slash text-3xl mb-2 opacity-50"></i>
                                <p className="text-sm">No new reservations</p>
                              </div>
                            ) : (
                              <div className="divide-y divide-gray-50">
                                {visibleNotifications.map((notif, idx) => (
                                  <div key={idx} className={`p-4 transition-colors relative group ${notif.isRead ? 'bg-white opacity-70 hover:opacity-100' : 'bg-medblue-50/30'}`}>
                                    <button
                                      onClick={(e) => handleDismissNotification(e, notif._id)}
                                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                                      title="Dismiss notification"
                                    >
                                      <i className="fa-solid fa-xmark text-xs"></i>
                                    </button>

                                    <div className="flex justify-between items-start mb-1 pr-6">
                                      <div className="flex items-center gap-2">
                                        {!notif.isRead && <span className="w-2 h-2 rounded-full bg-medblue-500"></span>}
                                        <span className="font-bold text-gray-900 text-sm">{notif.customerName}</span>
                                      </div>
                                      <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2 pl-4">Reserved {notif.items.length} item(s) for <span className="font-bold text-medblue-600">${notif.totalPrice.toFixed(2)}</span></p>
                                    <button
                                      onClick={() => handleViewDetails(notif)}
                                      className="w-full mt-2 text-xs font-bold bg-white border border-gray-200 hover:bg-medblue-50 hover:text-medblue-600 text-gray-700 py-1.5 rounded-lg transition-colors"
                                    >
                                      View Details
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {user.role === 'staff' && (
                    <div className="border-l border-gray-300 h-6"></div>
                  )}

                  <div className="flex items-center space-x-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'staff' ? 'bg-medgreen-100 text-medgreen-600' : 'bg-medblue-100 text-medblue-600'}`}>
                      <i className={`fa-solid ${user.role === 'staff' ? 'fa-user-tie' : 'fa-user'} text-lg`}></i>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{user.name || user.email.split('@')[0]}</span>
                      <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-500 ml-4 transition-colors"
                    title="Logout"
                  >
                    <i className="fa-solid fa-right-from-bracket text-lg"></i>
                  </button>
                </div>
              ) : (
                <>
                  <a href="#how-it-works" className="text-gray-600 hover:text-medblue-600 font-medium transition-colors">How it Works</a>


                  <div className="border-l border-gray-300 h-6 mx-2"></div>

                  <button
                    onClick={() => openModal('customer')}
                    className="text-medblue-600 bg-white border-2 border-medblue-600 hover:bg-medblue-50 font-semibold py-2 px-5 rounded-full transition-all duration-300"
                  >
                    Customer Login
                  </button>
                  <button
                    onClick={() => openModal('staff')}
                    className="bg-medgreen-500 hover:bg-medgreen-600 text-white shadow-lg shadow-medgreen-500/30 font-semibold py-2 px-5 rounded-full transition-all duration-300"
                  >
                    Staff Login
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
              >
                <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 pb-4 px-4 shadow-lg absolute w-full">
            <div className="flex flex-col space-y-4 pt-4">

              {user ? (
                <>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'staff' ? 'bg-medgreen-100 text-medgreen-600' : 'bg-medblue-100 text-medblue-600'}`}>
                        <i className={`fa-solid ${user.role === 'staff' ? 'fa-user-tie' : 'fa-user'} text-lg`}></i>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{user.name || user.email.split('@')[0]}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                    </div>
                    {/* Notification Bell Mobile (Staff Only) */}
                    {user.role === 'staff' && (
                      <button className="text-gray-500 hover:text-medblue-600 transition-colors relative mr-2">
                        <i className="fa-solid fa-bell text-xl"></i>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="w-full text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 font-semibold py-3 px-5 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="#how-it-works" className="text-gray-600 font-medium text-lg">How it Works</a>
                  <a href="#about" className="text-gray-600 font-medium text-lg">About Us</a>
                  <a href="#contact" className="text-gray-600 font-medium text-lg">Contact</a>
                  <hr className="border-gray-100" />

                  <button
                    onClick={() => openModal('customer')}
                    className="w-full text-medblue-600 bg-white border-2 border-medblue-600 font-semibold py-3 px-5 rounded-lg"
                  >
                    Customer Login
                  </button>
                  <button
                    onClick={() => openModal('staff')}
                    className="w-full bg-medgreen-500 text-white font-semibold py-3 px-5 rounded-lg shadow-md"
                  >
                    Staff Login
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        role={authRole}
      />

      {/* Reservation Details Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative animate-fade-in-up border border-gray-100">
            <button
              onClick={() => setSelectedNotification(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-medblue-100 text-medblue-600 flex items-center justify-center shadow-inner">
                <i className="fa-solid fa-receipt text-lg"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Customer Info</p>
                <p className="font-bold text-gray-900 text-lg mb-2">{selectedNotification.customerName}</p>
                <div className="space-y-1.5">
                  <p className="text-gray-600 text-sm flex items-center gap-2">
                    <i className="fa-solid fa-envelope text-gray-400 w-4"></i>
                    {selectedNotification.customerEmail}
                  </p>
                  <p className="text-gray-600 text-sm flex items-center gap-2">
                    <i className="fa-solid fa-phone text-gray-400 w-4"></i>
                    {selectedNotification.customerMobile || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Medicines List */}
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">Medicines Ordered</p>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {selectedNotification.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-white border border-gray-100 shadow-sm p-3 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-medblue-50 text-medblue-600 flex items-center justify-center">
                          <i className="fa-solid fa-pills text-sm"></i>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500 font-semibold bg-gray-100 inline-block px-2 py-0.5 rounded-md mt-1">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Price</p>
                        <span className="font-extrabold text-medblue-700">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Price */}
              <div className="border-t border-gray-100 pt-4 flex justify-between items-end bg-medblue-50/50 p-4 rounded-2xl">
                <p className="text-medblue-800 font-bold uppercase text-sm tracking-wide">Total Amount</p>
                <p className="text-3xl font-extrabold text-medblue-700">${selectedNotification.totalPrice.toFixed(2)}</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
