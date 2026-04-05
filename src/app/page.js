import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-[#0B1E33]/5 to-[#FFB347]/10 rounded-3xl">
        <h1 className="text-4xl md:text-6xl font-bold text-[#0B1E33] mb-4">
          Securing Nigeria's
          <span className="text-[#FFB347]"> Digital Future</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Empowering the next generation of cybersecurity defenders with world-class training 
          and strategic consultancy for critical infrastructure protection.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/foundation" className="btn-primary">
            Start Learning
          </Link>
          <Link href="/consultancy" className="btn-outline">
            Consultancy Services
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="card">
          <div className="text-3xl font-bold text-[#FFB347]">500+</div>
          <div className="text-gray-600">Students Trained</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-[#FFB347]">20+</div>
          <div className="text-gray-600">Expert Instructors</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-[#FFB347]">15+</div>
          <div className="text-gray-600">Corporate Clients</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-[#FFB347]">98%</div>
          <div className="text-gray-600">Success Rate</div>
        </div>
      </section>

      {/* Mission Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card group">
          <div className="text-4xl mb-3">🇳🇬</div>
          <h3 className="text-xl font-bold text-[#0B1E33] mb-3">Protecting National Assets</h3>
          <p className="text-gray-600">
            Specialised training for banking, power grid, telecommunications, and government 
            network security professionals.
          </p>
        </div>
        
        <div className="card group">
          <div className="text-4xl mb-3">🤝</div>
          <h3 className="text-xl font-bold text-[#0B1E33] mb-3">Partnering with NSCDC</h3>
          <p className="text-gray-600">
            Strategic collaboration with the Nigeria Security and Civil Defence Corps to 
            strengthen national cyber defence capabilities.
          </p>
        </div>
        
        <div className="card group">
          <div className="text-4xl mb-3">🌍</div>
          <h3 className="text-xl font-bold text-[#0B1E33] mb-3">Global Frameworks</h3>
          <p className="text-gray-600">
            Training aligned with NIST Cybersecurity Framework, ISO 27001, and CIS Controls 
            for global competitiveness.
          </p>
        </div>
      </div>

      {/* Critical Infrastructure Focus */}
      <section className="bg-gradient-to-r from-[#0B1E33] to-[#1A3A5F] text-white rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Critical Infrastructure Protection Program</h2>
        <p className="text-center mb-6 text-gray-200">
          Designed for professionals securing Nigeria's essential services
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <ul className="space-y-3">
            <li className="flex items-center gap-2">✓ Operational Technology (OT) Security</li>
            <li className="flex items-center gap-2">✓ SCADA and ICS Protection</li>
            <li className="flex items-center gap-2">✓ Incident Response for Critical Systems</li>
          </ul>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">✓ Compliance (NIST, ISO 27001, NITDA)</li>
            <li className="flex items-center gap-2">✓ Hands-on Cyber Range Simulations</li>
            <li className="flex items-center gap-2">✓ Nigerian Regulatory Frameworks</li>
          </ul>
        </div>
        <div className="text-center mt-6">
          <Link href="/critical" className="btn-secondary inline-block">
            Learn More About CIP
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold text-[#0B1E33] mb-4">Ready to Start Your Journey?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Join Dodo Academy today and become a certified cybersecurity professional.
        </p>
        <Link href="/foundation" className="btn-primary inline-block text-lg px-8 py-4">
          Enroll Now - ₦50,000 Only
        </Link>
      </section>
    </div>
  );
}