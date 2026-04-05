'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) setUser(data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  }

  const isActive = (path) => pathname === path;

  return (
    <header className="bg-[#0B1E33] text-white sticky top-0 z-50 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-[#FFB347] bg-clip-text text-transparent">
            Dodo Academy
          </Link>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row w-full md:w-auto gap-4 md:gap-6 items-center mt-4 md:mt-0`}>
            <Link href="/" className={`hover:text-[#FFB347] transition ${isActive('/') ? 'text-[#FFB347]' : ''}`}>
              Home
            </Link>
            <Link href="/critical" className={`hover:text-[#FFB347] transition ${isActive('/critical') ? 'text-[#FFB347]' : ''}`}>
              Critical Infrastructure
            </Link>
            <Link href="/foundation" className={`hover:text-[#FFB347] transition ${isActive('/foundation') ? 'text-[#FFB347]' : ''}`}>
              Foundation Course
            </Link>
            <Link href="/consultancy" className={`hover:text-[#FFB347] transition ${isActive('/consultancy') ? 'text-[#FFB347]' : ''}`}>
              Consultancy
            </Link>
            
            {user ? (
              <>
                <Link href="/foundation/dashboard" className="hover:text-[#FFB347] transition">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="bg-[#FFB347] text-[#0B1E33] px-4 py-2 rounded-full font-semibold hover:bg-[#FFC97A] transition">
                  Logout ({user.name})
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-[#FFB347] transition">
                  Login
                </Link>
                <Link href="/register" className="bg-[#FFB347] text-[#0B1E33] px-4 py-2 rounded-full font-semibold hover:bg-[#FFC97A] transition">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}