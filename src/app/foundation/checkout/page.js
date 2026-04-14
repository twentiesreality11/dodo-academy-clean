'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(true);

  useEffect(() => {
    async function checkUserAndPayment() {
      try {
        // Check user
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();
        
        if (!meData.user) {
          router.push('/login?redirect=/foundation/checkout');
          return;
        }
        
        setUser(meData.user);
        
        // Check if already paid
        const lessonsRes = await fetch('/api/lessons');
        const lessonsData = await lessonsRes.json();
        
        if (lessonsData.hasPaid) {
          // User already paid, redirect to dashboard
          router.push('/foundation/dashboard');
          return;
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setCheckingPayment(false);
      }
    }
    
    checkUserAndPayment();
  }, [router]);

  async function handlePayment() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      
      if (res.ok && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        setError(data.error || 'Payment initiation failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (checkingPayment) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB347]"></div>
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Complete Your Enrollment</h1>
      
      <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
        <p className="text-xl font-semibold">Cybersecurity Foundation Course</p>
        <p className="text-3xl font-bold text-[#FFB347] my-4">₦50,000</p>
        <p className="text-gray-600">One-time payment, lifetime access</p>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Student: {user.name}</p>
          <p className="text-sm text-gray-500">Email: {user.email}</p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <button 
        onClick={handlePayment} 
        disabled={loading} 
        className="btn-primary w-full"
      >
        {loading ? 'Processing...' : 'Pay with Paystack'}
      </button>
      
      <p className="text-center mt-4">
        <Link href="/foundation/dashboard" className="text-gray-500 hover:text-[#FFB347] text-sm">
          ← Back to Dashboard
        </Link>
      </p>
    </div>
  );
}