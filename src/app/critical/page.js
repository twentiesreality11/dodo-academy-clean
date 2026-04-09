'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CriticalPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
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
    
    // Create FormData object for Formspree
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('organization', formData.organization);
    formDataToSend.append('message', formData.message);
    formDataToSend.append('_subject', `New Critical Infrastructure Inquiry from ${formData.name}`);
    
    try {
      // Replace YOUR_FORM_ID with your actual Formspree form ID
      const response = await fetch('https://formspree.io/f/mnjjjlqj', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          organization: '',
          message: ''
        });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const data = await response.json();
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-[#0B1E33]">Critical Infrastructure Protection</h1>
      
      {/* Overview */}
      <div className="bg-gradient-to-r from-[#0B1E33] to-[#1A3A5F] text-white rounded-2xl p-8 mb-8">
        <p className="text-lg mb-4">
          Nigeria's critical infrastructure - banking systems, power grids, telecommunications networks, and government databases - faces constant cyber threats. Our Critical Infrastructure Protection (CIP) program trains professionals to defend these essential services.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="font-bold mb-3 text-[#FFB347]">🎯 Program Focus</h3>
            <ul className="space-y-2 text-sm">
              <li>• Operational Technology (OT) Security</li>
              <li>• SCADA and Industrial Control Systems (ICS)</li>
              <li>• Incident Response for Critical Systems</li>
              <li>• Compliance with NIST, ISO 27001, NITDA</li>
              <li>• Nigerian Power Grid Protection</li>
              <li>• Banking and Financial Security</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-[#FFB347]">🏢 Who Should Attend</h3>
            <ul className="space-y-2 text-sm">
              <li>• IT Security Professionals</li>
              <li>• Government Agency Staff</li>
              <li>• Bank Security Teams</li>
              <li>• Telecom Engineers</li>
              <li>• Power Grid Operators</li>
              <li>• Military and Law Enforcement</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Partnership with NSCDC */}
      <div className="bg-amber-50 border-l-4 border-[#FFB347] rounded-r-2xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-[#0B1E33] mb-3">🤝 Partnership with NSCDC</h2>
        <p className="text-gray-700 mb-3">
          Dodo Academy collaborates with the Nigeria Security and Civil Defence Corps (NSCDC) to strengthen national cyber defense capabilities. Our CIP program aligns with NSCDC's mandate to protect critical national assets and infrastructure.
        </p>
        <p className="text-gray-700">
          Graduates of our program are equipped to support NSCDC's efforts in securing Nigeria's digital landscape.
        </p>
      </div>

      {/* Course Modules */}
      <h2 className="text-2xl font-bold mb-4 text-[#0B1E33]">Program Modules</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-2">Module 1: OT/ICS Security Fundamentals</h3>
          <p className="text-gray-600 text-sm">Understanding operational technology, industrial control systems, and SCADA architectures.</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-2">Module 2: Network Security for Critical Infrastructure</h3>
          <p className="text-gray-600 text-sm">Securing network perimeters, segmentation, and monitoring for industrial environments.</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-2">Module 3: Incident Response and Recovery</h3>
          <p className="text-gray-600 text-sm">Developing and executing incident response plans for critical system breaches.</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-2">Module 4: Compliance and Risk Management</h3>
          <p className="text-gray-600 text-sm">NIST framework, ISO 27001, NITDA guidelines, and Nigerian regulations.</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-2">Module 5: Threat Intelligence and Hunting</h3>
          <p className="text-gray-600 text-sm">Proactive threat detection and intelligence gathering for critical infrastructure.</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-2">Module 6: Capstone Project</h3>
          <p className="text-gray-600 text-sm">Real-world simulation protecting a critical infrastructure environment.</p>
        </div>
      </div>

      {/* Request Info Form with Formspree */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4">Request Program Information</h2>
        <p className="text-gray-600 mb-6">
          Fill out the form below. Our team will contact you within 24-48 hours with program details and pricing.
        </p>
        
        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-700">
            ✅ Thank you! Your inquiry has been sent. We'll contact you soon.
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            ❌ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="+234 800 123 4567"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Organization/Company</label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="input-field"
              placeholder="Your company name"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Message (Optional)</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB347]"
              placeholder="Tell us about your organization and specific interests..."
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary w-full"
          >
            {loading ? 'Sending...' : 'Send Inquiry'}
          </button>
        </form>
        
        <p className="text-xs text-gray-400 text-center mt-4">
          Your information will be sent securely via Formspree. We respect your privacy.
        </p>
      </div>
    </div>
  );
}