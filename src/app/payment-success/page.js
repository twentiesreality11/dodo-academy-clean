'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref');

  useEffect(() => {
    async function verifyPayment() {
      // Use reference or trxref (Paystack uses both)
      const paymentRef = reference || trxref;
      
      console.log('Verifying payment with reference:', paymentRef);
      
      if (!paymentRef) {
        console.log('No reference found in URL');
        setStatus('error');
        setErrorMessage('No payment reference found.');
        return;
      }

      try {
        // Call our verification API
        const res = await fetch(`/api/payments/verify?reference=${paymentRef}`);
        const data = await res.json();
        
        console.log('Verification response:', { status: res.status, data });
        
        if (res.ok && data.success) {
          setStatus('success');
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push('/foundation/dashboard');
          }, 3000);
        } else {
          setStatus('error');
          setErrorMessage(data.error || 'Verification failed. Please contact support.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setErrorMessage('Network error. Please check your connection.');
      }
    }

    verifyPayment();
  }, [reference, trxref, router]);

  if (status === 'verifying') {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB347]"></div>
        <p className="mt-2 text-gray-600">Verifying your payment...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we confirm your transaction.</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 max-w-md mx-auto">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-700 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-4">Your payment has been confirmed.</p>
          <p className="text-gray-600 mb-6">Redirecting you to your dashboard...</p>
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
        <p className="text-gray-600 mb-4">{errorMessage || 'We could not verify your payment.'}</p>
        <p className="text-sm text-gray-500 mb-6">If your payment was deducted, please contact support with your transaction reference.</p>
        <div className="space-y-3">
          <Link href="/foundation/checkout" className="btn-primary inline-block w-full">
            Try Again
          </Link>
          <Link href="/contact" className="btn-outline inline-block w-full">
            Contact Support
          </Link>
        </div>
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