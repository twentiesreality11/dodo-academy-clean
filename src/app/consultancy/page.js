'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ConsultancyPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('company', formData.company);
    formDataToSend.append('service', formData.service);
    formDataToSend.append('message', formData.message);
    formDataToSend.append('_subject', `New Consultancy Inquiry from ${formData.name}`);
    
    try {
      // Replace YOUR_FORM_ID with your actual Formspree form ID
      const response = await fetch('https://formspree.io/f/mnjjjlqj', {
        method: 'POST',
        body: formDataToSend,
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: '',
          message: ''
        });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      icon: '🔒',
      title: 'Security Audits & Risk Assessments',
      description: 'Comprehensive evaluation of your security posture with actionable remediation plans aligned with ISO 27001 and NIST.',
      features: ['Vulnerability assessments', 'Penetration testing', 'Risk analysis', 'Security gap analysis']
    },
    {
      icon: '🏛️',
      title: 'Critical Infrastructure Advisory',
      description: 'Specialised guidance for operators of Nigeria\'s essential services: power, water, finance, and telecoms.',
      features: ['SCADA/ICS security', 'OT network protection', 'Regulatory compliance', 'Incident response planning']
    },
    {
      icon: '📜',
      title: 'Policy & Compliance',
      description: 'Development of security policies and compliance frameworks for NITDA, NDPR, and international standards.',
      features: ['Policy development', 'Compliance audits', 'NDPR implementation', 'ISO certification support']
    },
    {
      icon: '🎓',
      title: 'Custom Training Programs',
      description: 'Tailored in-house training for your team, from awareness to advanced technical skills.',
      features: ['Team workshops', 'Executive briefings', 'Technical labs', 'Continuous education']
    },
    {
      icon: '🛡️',
      title: 'Managed Security Services',
      description: '24/7 security monitoring and incident response for organizations without internal SOC teams.',
      features: ['SOC-as-a-Service', 'Threat hunting', 'Incident response', 'Security monitoring']
    },
    {
      icon: '📊',
      title: 'SOC Setup & Optimization',
      description: 'Design and implementation of Security Operations Centers tailored to your organization\'s needs.',
      features: ['SOC design', 'Tool selection', 'Playbook development', 'Team training']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[#0B1E33]">Cybersecurity Consultancy Services</h1>
        <div className="w-20 h-1 bg-[#FFB347] mx-auto"></div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
          We partner with organizations to build resilient defences against evolving cyber threats. 
          Our expert consultants bring real-world experience from protecting critical infrastructure.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {services.map((service, index) => (
          <div key={index} className="card group">
            <div className="text-4xl mb-3">{service.icon}</div>
            <h3 className="text-xl font-bold text-[#0B1E33] mb-3">{service.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{service.description}</p>
            <ul className="text-xs text-gray-500 space-y-1">
              {service.features.map((feature, i) => (
                <li key={i}>✓ {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Why Choose Us */}
      <div className="bg-gradient-to-r from-[#0B1E33] to-[#1A3A5F] text-white rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Dodo Academy Consultancy</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <ul className="space-y-3">
            <li>✓ Deep expertise in Nigerian and international security standards</li>
            <li>✓ Practical experience with real-world critical infrastructure</li>
            <li>✓ Certified professionals with global credentials</li>
            <li>✓ Collaborative approach - we work alongside your team</li>
          </ul>
          <ul className="space-y-3">
            <li>✓ Tailored solutions for your specific industry</li>
            <li>✓ Post-engagement support and training</li>
            <li>✓ Confidential and professional service</li>
            <li>✓ Proven track record with Nigerian organizations</li>
          </ul>
        </div>
      </div>

      {/* Industries We Serve */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#0B1E33]">Industries We Serve</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm"><span className="text-2xl block mb-2">🏦</span>Banking & Finance</div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm"><span className="text-2xl block mb-2">⚡</span>Power & Energy</div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm"><span className="text-2xl block mb-2">📡</span>Telecommunications</div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm"><span className="text-2xl block mb-2">🏛️</span>Government</div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm"><span className="text-2xl block mb-2">🏥</span>Healthcare</div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm"><span className="text-2xl block mb-2">🛢️</span>Oil & Gas</div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm"><span className="text-2xl block mb-2">📚</span>Education</div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm"><span className="text-2xl block mb-2">🏭</span>Manufacturing</div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-2xl p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Request a Consultation</h2>
        <p className="text-gray-600 text-center mb-6">
          Tell us about your needs and we'll get back to you within 24 hours.
        </p>
        
        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-700">
            ✅ Thank you! Your consultation request has been sent. We'll contact you soon.
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            ❌ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block font-semibold mb-2">Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block font-semibold mb-2">Company/Organization</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-2">Service Interested In *</label>
            <select name="service" value={formData.service} onChange={handleChange} required className="input-field">
              <option value="">Select a service</option>
              <option value="audit">Security Audit & Risk Assessment</option>
              <option value="advisory">Critical Infrastructure Advisory</option>
              <option value="compliance">Policy & Compliance</option>
              <option value="training">Custom Training Programs</option>
              <option value="mss">Managed Security Services</option>
              <option value="soc">SOC Setup & Optimization</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-2">Message / Requirements</label>
            <textarea name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB347]" placeholder="Tell us about your organization and security needs..." />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending...' : 'Request Consultation'}
          </button>
        </form>
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>For urgent inquiries, email us directly at <a href="mailto:consulting@dodoacademy.ng" className="text-[#FFB347]">consulting@dodoacademy.ng</a> or call +234 800 123 4567</p>
      </div>
    </div>
  );
}