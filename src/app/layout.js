import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Dodo Academy', description: 'Cybersecurity Training' };

function Header() {
  return (
    <header className="bg-[#0B1E33] text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">Dodo Academy</Link>
        <nav className="flex gap-6">
          <Link href="/" className="hover:text-[#FFB347]">Home</Link>
          <Link href="/foundation/dashboard" className="hover:text-[#FFB347]">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0B1E33] text-white/70 text-center p-6 mt-12">
      <p>&copy; 2024 Dodo Academy. All rights reserved.</p>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow max-w-6xl mx-auto p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}