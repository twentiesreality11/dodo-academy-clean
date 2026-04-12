'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    if (reference) {
      // Mark user as paid in localStorage
      localStorage.setItem('has_paid', 'true');
      setTimeout(() => {
        router.push('/foundation/dashboard');
      }, 2000);
    }
  }, [reference, router]);

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

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}