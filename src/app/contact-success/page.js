'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-6">
        <div className="text-6xl mb-4">📧</div>
        <h1 className="text-3xl font-bold text-green-700 mb-2">Inquiry Sent!</h1>
        <p className="text-green-600 mb-4">
          Thank you for reaching out to Dodo Academy.
        </p>
        <p className="text-gray-600">
          Our team will review your inquiry and get back to you within 24-48 hours.
        </p>
      </div>
      
      <div className="space-y-4">
        <Link href="/" className="btn-primary inline-block">
          Return to Home
        </Link>
        <p className="text-sm text-gray-500">
          You will be redirected automatically in 5 seconds...
        </p>
      </div>
    </div>
  );
}