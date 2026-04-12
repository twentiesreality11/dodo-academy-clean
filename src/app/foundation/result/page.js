'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  
  const score = parseInt(searchParams.get('score') || '0');
  const total = parseInt(searchParams.get('total') || '20');
  const passed = searchParams.get('passed') === 'true';
  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          router.push('/login');
        }
      })
      .catch(() => {});
  }, [router]);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className={`rounded-2xl p-8 mb-6 ${passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        {passed ? (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">Congratulations!</h1>
            <p className="text-green-600 mb-4">You passed the final assessment!</p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-3xl font-bold text-red-700 mb-2">Keep Learning!</h1>
            <p className="text-red-600 mb-4">You didn't pass this time. Review the lessons and try again.</p>
          </>
        )}
        
        <div className="text-4xl font-bold mb-2">
          {score} / {total}
        </div>
        <p className="text-gray-600">Score: {percentage}%</p>
        
        {!passed && (
          <p className="text-sm text-gray-500 mt-2">
            Passing score: 16/20 (80%)
          </p>
        )}
      </div>
      
      <div className="space-y-4">
        <Link href="/foundation/dashboard" className="btn-primary inline-block mr-4">
          Go to Dashboard
        </Link>
        {!passed && (
          <Link href="/foundation/assessment" className="btn-outline inline-block">
            Try Again
          </Link>
        )}
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}