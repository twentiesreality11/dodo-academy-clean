'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FixPaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  const fixPayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fix-payment', { method: 'POST' });
      const data = await res.json();
      setStatus(data);
      if (data.success) {
        setTimeout(() => router.push('/foundation/dashboard'), 2000);
      }
    } catch (error) {
      setStatus({ error: error.message });
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-8 text-center">
        <p>Please login first</p>
        <a href="/login" className="btn-primary inline-block mt-4">Login</a>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <div className="bg-white rounded-2xl p-6 shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Fix Payment Access</h1>
        
        <div className="mb-4 p-3 bg-gray-100 rounded-lg text-left">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
        </div>
        
        <button 
          onClick={fixPayment} 
          disabled={loading} 
          className="btn-primary w-full"
        >
          {loading ? 'Processing...' : 'Fix My Access'}
        </button>
        
        {status && (
          <div className={`mt-4 p-3 rounded-lg ${status.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status.success ? '✅ Access granted! Redirecting...' : status.error || JSON.stringify(status)}
          </div>
        )}
      </div>
    </div>
  );
}