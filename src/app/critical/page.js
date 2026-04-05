'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CriticalPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

// Simplified version using Formspree
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const res = await fetch('https://formspree.io/f/mnjjjlqj', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (res.ok) {
      toast.success('Inquiry sent successfully!');
      setFormData({ name: '', email: '', phone: '', organization: '', message: '' });
    } else {
      toast.error('Failed to send inquiry');
    }
  } catch (error) {
    toast.error('Network error');
  }
  setLoading(false);
};
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Critical Infrastructure Protection</h1>
      
      <div className="bg-gradient-to-r from-[#0B1E33] to-[#1A3A5F] text-white rounded-2xl p-6 mb-8">
        <p className="text-lg mb-4">
          This program is designed for professionals who secure Nigeria's essential services: 
          banking, power grid, telecom, and government networks.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold mb-2">🎯 What You'll Learn</h3>
            <ul className="space-y-1 text-sm">
              <li>• Operational Technology (OT) Security</li>
              <li>• SCADA and ICS Protection</li>
              <li>• Incident Response for Critical Systems</li>
              <li>• Compliance (NIST, ISO 27001, NITDA)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">🏢 Who Should Apply</h3>
            <ul className="space-y-1 text-sm">
              <li>• IT Security Professionals</li>
              <li>• Government Agency Staff</li>
              <li>• Bank Security Teams</li>
              <li>• Telecom Engineers</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4">Request Information</h2>
        <p className="text-gray-600 mb-6">
          Fill out the form below and our team will contact you with more details about 
          the Critical Infrastructure Protection program.
        </p>
        
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
          
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending...' : 'Request Information'}
          </button>
        </form>
      </div>
    </div>
  );
}