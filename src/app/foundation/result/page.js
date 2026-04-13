'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ResultContent() {
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get('score') || '0');
  const total = parseInt(searchParams.get('total') || '20');
  const passed = searchParams.get('passed') === 'true';

  return (
    <div className="max-w-md mx-auto text-center">
      <div className={`rounded-2xl p-8 ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
        {passed ? (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-green-700 mb-2">Congratulations!</h1>
            <p className="text-green-600 mb-4">You passed! Your certificate has been emailed.</p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-2xl font-bold text-red-700 mb-2">Keep Learning!</h1>
            <p className="text-red-600 mb-4">You need 16/20 to pass. Try again!</p>
          </>
        )}
        <div className="text-4xl font-bold mb-4">{score}/{total}</div>
        <Link href="/foundation/dashboard" className="btn-primary inline-block">Back to Dashboard</Link>
        {!passed && <Link href="/foundation/assessment" className="btn-outline inline-block ml-4">Try Again</Link>}
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}