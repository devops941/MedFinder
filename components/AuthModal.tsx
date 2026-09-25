'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ModalMode = 'login' | 'register';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'customer' | 'staff';
}

export default function AuthModal({ isOpen, onClose, role }: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<ModalMode>('login');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  
  // Feedback state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  // Reset state when opened or role changes
  useEffect(() => {
    if (isOpen) {
      setMode('login');
      setEmail('');
      setPassword('');
      setName('');
      setMobile('');
      setMessage(null);
    }
  }, [isOpen, role]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = mode === 'login' 
      ? { email, password }
      : { name, mobile, email, password, role };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ text: data.message, type: 'success' });
        
        // Save user to localStorage to maintain session
        if (data.data?.user) {
          localStorage.setItem('medfinder_user', JSON.stringify(data.data.user));
          // Dispatch a custom event so Navbar can update immediately
          window.dispatchEvent(new Event('user-login'));
        }

        // After a delay, close the modal and navigate
        setTimeout(() => {
          onClose();
          // Clear inputs for next time
          setEmail(''); setPassword(''); setName(''); setMobile('');
          setMode('login');
          setMessage(null);
          
          if (data.data?.user) {
            if (data.data.user.role === 'staff') {
              router.push('/store');
            } else if (data.data.user.role === 'customer') {
              router.push('/purchase');
            }
          }
        }, 1000);
      } else {
        setMessage({ text: data.message, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Something went wrong. Try again later.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: ModalMode) => {
    setMode(newMode);
    setMessage(null);
  };

  const roleText = role === 'staff' ? 'Staff' : 'Customer';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 focus:outline-none transition-colors"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${role === 'staff' ? 'bg-medgreen-100 text-medgreen-600' : 'bg-medblue-100 text-medblue-600'}`}>
              <i className={`fa-solid ${role === 'staff' ? 'fa-user-tie' : 'fa-user'} text-xl`}></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {mode === 'login' ? `${roleText} Login` : `Register ${roleText}`}
            </h2>
            <p className="text-gray-500">
              {mode === 'login' 
                ? 'Enter your credentials to access your account' 
                : 'Join us to find and reserve medicines easily'}
            </p>
          </div>

          {message && (
            <div className={`p-3 mb-6 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-medblue-500 focus:border-medblue-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input 
                    type="tel" 
                    value={mobile} 
                    onChange={e => setMobile(e.target.value)} 
                    required 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-medblue-500 focus:border-medblue-500 outline-none transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-medblue-500 focus:border-medblue-500 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-medblue-500 focus:border-medblue-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 mt-6 disabled:opacity-70 flex justify-center items-center ${role === 'staff' ? 'bg-medgreen-500 hover:bg-medgreen-600' : 'bg-medblue-600 hover:bg-medblue-700'}`}
            >
              {loading ? (
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button 
                  onClick={() => switchMode('register')} 
                  className={`${role === 'staff' ? 'text-medgreen-600' : 'text-medblue-600'} font-semibold hover:underline outline-none`}
                >
                  Create {roleText}
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button 
                  onClick={() => switchMode('login')} 
                  className={`${role === 'staff' ? 'text-medgreen-600' : 'text-medblue-600'} font-semibold hover:underline outline-none`}
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
