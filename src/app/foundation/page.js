'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function FoundationPage() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch('/api/auth/me').then(res => res.json()).then(data => setUser(data.user)).catch(() => {});
  }, []);

  return (
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Cybersecurity Foundation Course</h1>
      <p className="text-xl text-gray-600 mb-4">Self-paced learning with a digital badge upon completion!</p>
      <p className="text-2xl font-bold text-[#FFB347] mb-8">₦50,000 (one-time payment)</p>
      <div className="text-left bg-gray-50 p-6 rounded-2xl mb-8">
        <h2 className="text-xl font-bold mb-3">What you'll learn:</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Networking fundamentals</li>
          <li>Operating system security</li>
          <li>Ethical hacking basics</li>
          <li>Cryptography essentials</li>
        </ul>
      </div>
      {user ? <Link href="/foundation/checkout" className="btn-primary">Enroll Now</Link> :
        <div><p className="mb-4">Please login or register to enroll.</p><Link href="/login?redirect=/foundation/checkout" className="btn-primary mr-4">Login</Link><Link href="/register?redirect=/foundation/checkout" className="btn-outline">Register</Link></div>}
    </div>
  );
}