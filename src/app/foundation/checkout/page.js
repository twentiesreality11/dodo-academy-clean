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
  const [hasPaid, setHasPaid] = useState(false);
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
        const paymentRes = await fetch('/api/payments/status');
        const paymentData = await paymentRes.json();
        
        if (paymentData.hasPaid) {
          setHasPaid(true);
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push('/foundation/dashboard');
          }, 2000);
        }
      } catch (error) {
        console.error('Error:', error);
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
        toast.error(data.error || 'Payment initiation failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    }
    
    setLoading(false);
  }

  if (checkingPayment) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB347]"></div>
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  if (hasPaid) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-700 mb-4">You Already Have Access!</h1>
          <p className="text-gray-600 mb-6">Redirecting you to your dashboard...</p>
          <Link href="/foundation/dashboard" className="btn-primary inline-block">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Complete Your Enrollment</h1>
      
      <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
        <p className="text-xl font-semibold">Cybersecurity Foundation Course</p>
        <p className="text-3xl font-bold text-[#FFB347] my-4">₦50,000</p>
        <p className="text-gray-600">One-time payment, lifetime access</p>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Student: {user?.name}</p>
          <p className="text-sm text-gray-500">Email: {user?.email}</p>
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