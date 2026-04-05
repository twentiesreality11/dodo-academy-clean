'use client';

import Link from 'next/link';

export default function ConsultancyPage() {
  const services = [
    {
      icon: '🔒',
      title: 'Security Audits & Risk Assessments',
      description: 'Comprehensive evaluation of your current security posture, identifying vulnerabilities and providing actionable remediation plans aligned with ISO 27001 and NIST.'
    },
    {
      icon: '🏛️',
      title: 'Critical Infrastructure Advisory',
      description: 'Specialised guidance for operators of Nigeria\'s essential services: power, water, finance, and telecoms. We help you meet regulatory requirements.'
    },
    {
      icon: '📜',
      title: 'Policy & Compliance',
      description: 'Development of cybersecurity policies, incident response plans, and compliance frameworks tailored to your industry and Nigerian regulations (NITDA, ngCERT).'
    },
    {
      icon: '🎓',
      title: 'Custom Training',
      description: 'In-house training programs for your team, from foundational awareness to advanced technical workshops on threat hunting and incident response.'
    },
    {
      icon: '🛡️',
      title: 'Penetration Testing',
      description: 'Simulated cyber attacks to test your defences. Our ethical hackers will attempt to breach your systems and provide a detailed report with fixes.'
    },
    {
      icon: '📊',
      title: 'Security Operations Center (SOC) Setup',
      description: 'Design and implementation of 24/7 security monitoring capabilities to detect and respond to threats in real-time.'
    }
  ];

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Cybersecurity Consultancy Services</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We partner with organisations to build resilient defences against evolving cyber threats.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {services.map((service, index) => (
          <div key={index} className="card group">
            <div className="text-4xl mb-3">{service.icon}</div>
            <h3 className="text-xl font-bold text-[#0B1E33] mb-3">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-[#0B1E33] to-[#1A3A5F] text-white rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Why Choose Dodo Academy Consultancy?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <ul className="space-y-2">
            <li>✓ Deep expertise in Nigerian and international standards</li>
            <li>✓ Practical experience with real-world critical infrastructure</li>
            <li>✓ Collaborative approach – we work alongside your team</li>
            <li>✓ Ongoing support and mentorship</li>
          </ul>
          <ul className="space-y-2">
            <li>✓ Certified professionals with global credentials</li>
            <li>✓ Tailored solutions for your specific industry</li>
            <li>✓ Post-engagement support and training</li>
            <li>✓ Confidential and professional service</li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Strengthen Your Organisation?</h2>
        <p className="text-gray-600 mb-6">
          Contact us today for a confidential consultation.
        </p>
        <Link href="/critical" className="btn-primary inline-block">
          Request a Consultation
        </Link>
      </div>
    </div>
  );
}