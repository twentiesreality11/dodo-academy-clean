'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      
      if (!meData.user) {
        router.push('/login?redirect=/foundation/dashboard');
        return;
      }
      
      setUser(meData.user);
      
      const lessonsRes = await fetch('/api/lessons');
      const lessonsData = await lessonsRes.json();
      
      setLessons(lessonsData.lessons || []);
      setHasPaid(lessonsData.hasPaid || false);
      setLoading(false);
    }
    
    loadData();
  }, [router]);

  const completedCount = lessons.filter(l => l.completed).length;
  const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {searchParams.get('payment') === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-green-700">
          ✅ Payment successful! You now have access to all lessons.
        </div>
      )}
      
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
      <p className="text-gray-600 mb-8">
        {hasPaid ? 'Complete the lessons below to earn your certificate.' : 'Purchase the course to unlock all lessons and earn your certificate.'}
      </p>

      <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Course Progress</span>
          <span className="text-[#FFB347] font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-[#FFB347] h-3 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{completedCount} of {lessons.length} lessons completed</p>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold">
                {index + 1}
              </div>
              <div>
                <div className="text-lg font-semibold text-[#0B1E33]">{lesson.title}</div>
                {lesson.locked && !hasPaid && (
                  <p className="text-xs text-gray-400">🔒 Locked - Purchase required</p>
                )}
              </div>
            </div>
            {lesson.completed ? (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">✓ Completed</span>
            ) : lesson.locked && !hasPaid ? (
              <Link href="/foundation/checkout" className="btn-primary text-sm py-2 px-4">
                Purchase to Unlock
              </Link>
            ) : (
              <Link href={`/foundation/lesson/${lesson.id}`} className="btn-outline text-sm py-1 px-4">
                Start
              </Link>
            )}
          </div>
        ))}
      </div>
      
      {hasPaid && completedCount === lessons.length && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold text-green-700 mb-2">🎉 You've Completed All Lessons!</h2>
          <p className="text-gray-700 mb-4">Take the final assessment to earn your certificate.</p>
          <Link href="/foundation/assessment" className="btn-primary inline-block">
            Take Final Assessment
          </Link>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}