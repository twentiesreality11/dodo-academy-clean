'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16">
      
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-[#0B1E33]/5 to-[#FFB347]/10 rounded-3xl">
        <h1 className="text-4xl md:text-6xl font-bold text-[#0B1E33] mb-4">
          Securing Nigeria's <span className="text-[#FFB347]">Digital Future</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Dodo Academy is Nigeria's premier cybersecurity training institution, dedicated to protecting critical infrastructure 
          and developing the next generation of security professionals.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          {user ? (
            <Link href="/foundation/dashboard" className="btn-primary text-lg px-8 py-3">
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/register" className="btn-primary text-lg px-8 py-3">
              Get Started Free
            </Link>
          )}
          <Link href="/critical" className="btn-outline text-lg px-8 py-3">
            Learn About CIP
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="card">
          <div className="text-3xl font-bold text-[#FFB347]">500+</div>
          <div className="text-gray-600 text-sm">Students Trained</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-[#FFB347]">15+</div>
          <div className="text-gray-600 text-sm">Expert Instructors</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-[#FFB347]">30+</div>
          <div className="text-gray-600 text-sm">Corporate Clients</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-[#FFB347]">98%</div>
          <div className="text-gray-600 text-sm">Success Rate</div>
        </div>
      </section>

      {/* About Dodo Academy */}
      <section>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#0B1E33] mb-4">About Dodo Academy</h2>
            <div className="w-20 h-1 bg-[#FFB347] mb-6"></div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Founded to address the growing cybersecurity skills gap in Nigeria, Dodo Academy provides world-class 
              training in cybersecurity fundamentals and critical infrastructure protection.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Our mission is to equip Nigerian professionals with the skills needed to protect our nation's most 
              vital assets - from banking systems and power grids to telecommunications networks and government databases.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Through our partnership with the Nigeria Security and Civil Defence Corps (NSCDC) and alignment with 
              global frameworks like NIST and ISO 27001, we ensure our graduates are ready to face real-world cyber threats.
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#0B1E33] to-[#1A3A5F] text-white rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4 text-[#FFB347]">Our Commitment</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3"><span className="text-[#FFB347] text-xl">✓</span> <span>Quality education aligned with global standards</span></li>
              <li className="flex items-start gap-3"><span className="text-[#FFB347] text-xl">✓</span> <span>Practical, hands-on training with real scenarios</span></li>
              <li className="flex items-start gap-3"><span className="text-[#FFB347] text-xl">✓</span> <span>Partnerships with government and industry leaders</span></li>
              <li className="flex items-start gap-3"><span className="text-[#FFB347] text-xl">✓</span> <span>Lifetime access to course materials</span></li>
              <li className="flex items-start gap-3"><span className="text-[#FFB347] text-xl">✓</span> <span>Career support and job placement assistance</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#0B1E33] mb-3">What We Offer</h2>
          <div className="w-20 h-1 bg-[#FFB347] mx-auto"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Comprehensive cybersecurity training and programs tailored to Nigeria's unique needs
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card text-center group hover:-translate-y-2 transition">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-xl font-bold mb-3">Cybersecurity Foundation Course</h3>
            <p className="text-gray-600 mb-4">Self-paced training covering networking, cryptography, ethical hacking, and security fundamentals.</p>
            <ul className="text-left text-sm text-gray-500 space-y-1">
              <li>✓ 5 comprehensive modules</li>
              <li>✓ 20-question final assessment</li>
              <li>✓ Digital certificate upon completion</li>
              <li>✓ Lifetime access</li>
            </ul>
            <Link href="/foundation/dashboard" className="inline-block mt-4 text-[#FFB347] font-semibold hover:underline">Learn more →</Link>
          </div>
          <div className="card text-center group hover:-translate-y-2 transition">
            <div className="text-5xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-3">Critical Infrastructure Protection</h3>
            <p className="text-gray-600 mb-4">Advanced training for securing Nigeria's essential services and national assets.</p>
            <ul className="text-left text-sm text-gray-500 space-y-1">
              <li>✓ SCADA/ICS Security</li>
              <li>✓ Operational Technology (OT) Protection</li>
              <li>✓ Incident Response for Critical Systems</li>
              <li>✓ NIST & ISO 27001 Compliance</li>
            </ul>
            <Link href="/critical" className="inline-block mt-4 text-[#FFB347] font-semibold hover:underline">Learn more →</Link>
          </div>
          <div className="card text-center group hover:-translate-y-2 transition">
            <div className="text-5xl mb-4">💼</div>
            <h3 className="text-xl font-bold mb-3">Cybersecurity Consultancy</h3>
            <p className="text-gray-600 mb-4">Expert advisory services for organizations seeking to strengthen their security posture.</p>
            <ul className="text-left text-sm text-gray-500 space-y-1">
              <li>✓ Security Audits & Assessments</li>
              <li>✓ Policy & Compliance</li>
              <li>✓ Managed Security Services</li>
              <li>✓ SOC Setup & Optimization</li>
            </ul>
            <Link href="/consultancy" className="inline-block mt-4 text-[#FFB347] font-semibold hover:underline">Learn more →</Link>
          </div>
        </div>
      </section>

      {/* NSCDC Partnership */}
      <section className="bg-amber-50 rounded-2xl p-8 border-l-4 border-[#FFB347]">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="text-center md:text-left">
            <div className="text-5xl mb-3">🤝</div>
            <h3 className="text-2xl font-bold text-[#0B1E33]">Partnering with NSCDC</h3>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-700 leading-relaxed">
              Dodo Academy collaborates with the <strong>Nigeria Security and Civil Defence Corps (NSCDC)</strong> to strengthen 
              national cyber defense capabilities. Our programs align with NSCDC's mandate to protect critical national assets 
              and infrastructure, ensuring our graduates are prepared to support Nigeria's cyber security efforts.
            </p>
          </div>
        </div>
      </section>

      {/* Global Frameworks */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#0B1E33] mb-3">Global Standards & Frameworks</h2>
          <div className="w-20 h-1 bg-[#FFB347] mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[#FFB347] mb-2">NIST</div>
            <p className="text-xs text-gray-500">Cybersecurity Framework</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[#FFB347] mb-2">ISO 27001</div>
            <p className="text-xs text-gray-500">Information Security</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[#FFB347] mb-2">CIS</div>
            <p className="text-xs text-gray-500">Critical Security Controls</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[#FFB347] mb-2">NITDA</div>
            <p className="text-xs text-gray-500">Nigeria Regulations</p>
          </div>
        </div>
      </section>

      {/* Why Choose Dodo Academy */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#0B1E33] mb-3">Why Choose Dodo Academy</h2>
          <div className="w-20 h-1 bg-[#FFB347] mx-auto"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="text-3xl mb-3">🇳🇬</div>
            <h3 className="font-bold text-lg mb-2">Nigerian Focus</h3>
            <p className="text-gray-600 text-sm">Curriculum designed specifically for Nigeria's unique cybersecurity challenges and critical infrastructure needs.</p>
          </div>
          <div className="card">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="font-bold text-lg mb-2">Global Standards</h3>
            <p className="text-gray-600 text-sm">Training aligned with international frameworks including NIST, ISO 27001, and CIS Controls.</p>
          </div>
          <div className="card">
            <div className="text-3xl mb-3">👨‍🏫</div>
            <h3 className="font-bold text-lg mb-2">Expert Instructors</h3>
            <p className="text-gray-600 text-sm">Learn from experienced cybersecurity professionals with real-world industry experience.</p>
          </div>
          <div className="card">
            <div className="text-3xl mb-3">📜</div>
            <h3 className="font-bold text-lg mb-2">Certification</h3>
            <p className="text-gray-600 text-sm">Earn a digital certificate and shareable badge upon completion of our foundation course.</p>
          </div>
          <div className="card">
            <div className="text-3xl mb-3">💼</div>
            <h3 className="font-bold text-lg mb-2">Career Support</h3>
            <p className="text-gray-600 text-sm">Job placement assistance, resume reviews, and career guidance for our graduates.</p>
          </div>
          <div className="card">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="font-bold text-lg mb-2">Lifetime Access</h3>
            <p className="text-gray-600 text-sm">One-time payment gives you lifetime access to course materials and future updates.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 rounded-2xl p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#0B1E33] mb-3">What Our Students Say</h2>
          <div className="w-20 h-1 bg-[#FFB347] mx-auto"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-[#FFB347] text-2xl mb-3">"</div>
            <p className="text-gray-600 text-sm mb-4">The foundation course gave me the confidence to pursue a career in cybersecurity. The practical examples and Nigerian case studies were invaluable.</p>
            <div className="font-semibold">- Adebayo O.</div>
            <div className="text-xs text-gray-400">Security Analyst</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-[#FFB347] text-2xl mb-3">"</div>
            <p className="text-gray-600 text-sm mb-4">As an IT professional, the CIP program opened my eyes to the unique challenges of protecting critical infrastructure. Highly recommended!</p>
            <div className="font-semibold">- Chioma E.</div>
            <div className="text-xs text-gray-400">Network Engineer</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-[#FFB347] text-2xl mb-3">"</div>
            <p className="text-gray-600 text-sm mb-4">The partnership with NSCDC gives credibility to the training. I landed a government cybersecurity role within months of completing the course.</p>
            <div className="font-semibold">- Samuel O.</div>
            <div className="text-xs text-gray-400">Govt. Security</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 bg-gradient-to-r from-[#0B1E33] to-[#1A3A5F] text-white rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Cybersecurity Journey?</h2>
        <p className="text-xl mb-6 opacity-90">Join hundreds of students building careers in cybersecurity.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          {user ? (
            <Link href="/foundation/dashboard" className="bg-[#FFB347] text-[#0B1E33] px-8 py-3 rounded-full font-bold text-lg hover:bg-[#FFC97A] transition">
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/register" className="bg-[#FFB347] text-[#0B1E33] px-8 py-3 rounded-full font-bold text-lg hover:bg-[#FFC97A] transition">
              Get Started Today
            </Link>
          )}
          <Link href="/critical" className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-[#0B1E33] transition">
            Learn About CIP
          </Link>
        </div>
        <p className="text-sm mt-6 opacity-75">Free preview available • 7-day money-back guarantee • Lifetime access</p>
      </section>
    </div>
  );
}