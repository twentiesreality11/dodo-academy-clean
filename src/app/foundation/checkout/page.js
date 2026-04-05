'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          router.push('/login?redirect=/foundation/checkout');
        } else {
          setUser(data.user);
        }
      })
      .catch(() => {
        router.push('/login?redirect=/foundation/checkout');
      })
      .finally(() => {
        setIsLoadingUser(false);
      });
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
        toast.error(data.error || 'Payment initiation failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    }
    
    setLoading(false);
  }

  if (isLoadingUser) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB347]"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
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
        <Link href="/foundation" className="text-gray-500 hover:text-[#FFB347] text-sm">
          ← Back to course page
        </Link>
      </p>
    </div>
  );
}