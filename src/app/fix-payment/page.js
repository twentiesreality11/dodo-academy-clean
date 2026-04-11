'use client';

import { useState } from 'react';

export default function FixPaymentPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const fixPayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fix-payment', { method: 'POST' });
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      setStatus({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Fix Payment Status</h1>
      <button onClick={fixPayment} disabled={loading} className="btn-primary mb-4">
        {loading ? 'Fixing...' : 'Fix My Payment'}
      </button>
      {status && (
        <pre className="bg-gray-100 p-4 rounded-lg text-left overflow-auto">
          {JSON.stringify(status, null, 2)}
        </pre>
      )}
    </div>
  );
}