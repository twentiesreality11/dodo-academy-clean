'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me').then(res => res.json()).then(data => {
      if (data.user) setUser(data.user);
    }).catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  return (
    <header className="bg-[#0B1E33] text-white sticky top-0 z-50 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-[#FFB347] bg-clip-text text-transparent">
          Dodo Academy
        </Link>
        <div className="flex flex-wrap gap-4 md:gap-6 items-center">
          <Link href="/" className="hover:text-[#FFB347] transition">Home</Link>
          <Link href="/critical" className="hover:text-[#FFB347] transition">Critical Infrastructure</Link>
          <Link href="/foundation" className="hover:text-[#FFB347] transition">Foundation Course</Link>
          <Link href="/consultancy" className="hover:text-[#FFB347] transition">Consultancy</Link>
          {user ? (
            <>
              <Link href="/foundation/dashboard" className="hover:text-[#FFB347] transition">Dashboard</Link>
              <button onClick={handleLogout} className="bg-[#FFB347] text-[#0B1E33] px-4 py-2 rounded-full font-semibold hover:bg-[#FFC97A] transition">
                Logout ({user.name})
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-[#FFB347] transition">Login</Link>
              <Link href="/register" className="bg-[#FFB347] text-[#0B1E33] px-4 py-2 rounded-full font-semibold hover:bg-[#FFC97A] transition">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}