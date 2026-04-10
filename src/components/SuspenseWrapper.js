'use client';

import { Suspense } from 'react';

export default function SuspenseWrapper({ children }) {
  return <Suspense fallback={<div className="text-center py-12">Loading...</div>}>{children}</Suspense>;
}