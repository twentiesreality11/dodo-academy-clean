import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1E33] text-white/80 pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-semibold text-lg mb-3 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#FFB347]">
              Dodo Academy
            </h4>
            <p className="text-sm leading-relaxed">
              Securing Nigeria's digital future through world-class cybersecurity education 
              and expert consultancy for critical infrastructure protection.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-lg mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[#FFB347] transition">Home</Link></li>
              <li><Link href="/critical" className="hover:text-[#FFB347] transition">Critical Infrastructure</Link></li>
              <li><Link href="/foundation" className="hover:text-[#FFB347] transition">Foundation Course</Link></li>
              <li><Link href="/consultancy" className="hover:text-[#FFB347] transition">Consultancy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-lg mb-3">Resources</h4>
        {/* Resources section */}
<ul className="space-y-2 text-sm">
  <li><Link href="/blog" className="hover:text-[#FFB347] transition">Blog</Link></li>
  <li><Link href="/faqs" className="hover:text-[#FFB347] transition">FAQs</Link></li>
  <li><Link href="/privacy" className="hover:text-[#FFB347] transition">Privacy Policy</Link></li>
  <li><Link href="/terms" className="hover:text-[#FFB347] transition">Terms of Service</Link></li>
</ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-lg mb-3">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 info@dodoacademy.ng</li>
              <li>📞 +234 800 123 4567</li>
              <li>📍 Abuja, Nigeria</li>
            </ul>
          </div>
        </div>

        <div className="text-center text-xs text-white/50 pt-8 mt-8 border-t border-white/10">
          &copy; {currentYear} Dodo Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}