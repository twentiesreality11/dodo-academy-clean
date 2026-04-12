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
  const [loading, setLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const checkPaymentStatus = async () => {
    try {
      const res = await fetch('/api/payments/status?t=' + Date.now(), {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      console.log('Payment check result:', data);
      return data.hasPaid;
    } catch (error) {
      console.error('Payment check error:', error);
      return false;
    }
  };

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Get user
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();
        
        if (!meData.user) {
          router.push('/login?redirect=/foundation/dashboard');
          return;
        }
        
        setUser(meData.user);
        
        // Check if this is from a successful payment
        const paymentSuccess = searchParams.get('payment') === 'success';
        
        if (paymentSuccess) {
          setStatusMessage('Payment successful! Verifying your access...');
        }
        
        // Retry payment status check up to 5 times (every 2 seconds)
        let paid = false;
        const maxRetries = 5;
        
        for (let i = 0; i < maxRetries; i++) {
          paid = await checkPaymentStatus();
          setRetryCount(i + 1);
          
          if (paid) {
            setStatusMessage('Payment verified! Loading your course...');
            break;
          }
          
          if (i < maxRetries - 1) {
            await new Promise(r => setTimeout(r, 2000));
          }
        }
        
        if (!paid) {
          setHasPaid(false);
          setLoading(false);
          setStatusMessage('');
          return;
        }
        
        setHasPaid(true);
        setStatusMessage('');
        
        // Load lessons
        const lessonsRes = await fetch('/api/lessons');
        const lessonsData = await lessonsRes.json();
        
        if (lessonsData.lessons) {
          const completed = JSON.parse(localStorage.getItem(`completed_lessons_${meData.user.id}`) || '[]');
          const lessonsWithProgress = lessonsData.lessons.map(lesson => ({
            ...lesson,
            completed: completed.includes(lesson.id)
          }));
          setLessons(lessonsWithProgress);
        }
      } catch (error) {
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadDashboard();
  }, [router, searchParams]);

  const completedCount = lessons.filter(l => l.completed).length;
  const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB347]"></div>
        <p className="mt-2">{statusMessage || 'Loading dashboard...'}</p>
        {retryCount > 0 && retryCount < 5 && (
          <p className="text-sm text-gray-500 mt-2">Verifying payment ({retryCount}/5)...</p>
        )}
      </div>
    );
  }

  if (!hasPaid) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 mb-6">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-yellow-800 mb-4">Payment Required</h1>
          <p className="text-gray-700 mb-6">
            You need to purchase the Cybersecurity Foundation course to access the lessons.
          </p>
          <Link href="/foundation/checkout" className="btn-primary inline-block">
            Purchase Course - ₦50,000
          </Link>
        </div>
        {searchParams.get('payment') === 'error' && (
          <p className="text-red-600 text-sm">
            There was an issue verifying your payment. Please contact support if your payment was deducted.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      {searchParams.get('payment') === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-green-700 text-center">
          ✅ Payment successful! You now have full access to the course.
        </div>
      )}
      
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
      <p className="text-gray-600 mb-8">Track your progress through the Cybersecurity Foundation course.</p>

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
              <Link href={`/foundation/lesson/${lesson.id}`} className="text-lg font-semibold text-[#0B1E33] hover:text-[#FFB347]">
                {lesson.title}
              </Link>
            </div>
            {lesson.completed ? (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">✓ Completed</span>
            ) : (
              <Link href={`/foundation/lesson/${lesson.id}`} className="btn-outline text-sm py-1 px-4">Start</Link>
            )}
          </div>
        ))}
      </div>
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