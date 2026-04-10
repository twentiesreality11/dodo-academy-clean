'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('verifying');
  const reference = searchParams.get('reference');

  useEffect(() => {
    async function verifyPayment() {
      if (!reference) {
        setStatus('error');
        return;
      }

      try {
        // Call verification API
        const res = await fetch(`/api/payments/verify?reference=${reference}`);
        
        if (res.ok) {
          setStatus('success');
          // Force a small delay then redirect to dashboard
          setTimeout(() => {
            window.location.href = '/foundation/dashboard';
          }, 2000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
      }
    }

    verifyPayment();
  }, [reference]);

  if (status === 'verifying') {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB347]"></div>
        <p className="mt-2">Verifying your payment...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 max-w-md mx-auto">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-700 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">Redirecting to your dashboard...</p>
          <Link href="/foundation/dashboard" className="btn-primary inline-block">
            Go to Dashboard Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-red-700 mb-4">Payment Verification Failed</h1>
        <p className="text-gray-600 mb-6">Please contact support if your payment was deducted.</p>
        <Link href="/foundation/checkout" className="btn-primary inline-block">
          Try Again
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}