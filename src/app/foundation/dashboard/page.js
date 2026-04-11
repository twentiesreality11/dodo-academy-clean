'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);

  const checkPaymentStatus = async () => {
    try {
      console.log('Checking payment status...');
      const paymentRes = await fetch('/api/payments/status', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      const paymentData = await paymentRes.json();
      console.log('Payment status response:', paymentData);
      
      if (paymentData.hasPaid) {
        setHasPaid(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Payment check error:', error);
      return false;
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Step 1: Get user
        console.log('Fetching user...');
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();
        
        if (!meData.user) {
          console.log('No user, redirecting to login');
          router.push('/login?redirect=/foundation/dashboard');
          return;
        }
        
        setUser(meData.user);
        console.log('User found:', meData.user.email);
        
        // Step 2: Check payment status
        const paid = await checkPaymentStatus();
        setCheckingPayment(false);
        
        if (!paid) {
          console.log('User has not paid');
          setLoading(false);
          return;
        }
        
        // Step 3: Fetch lessons
        console.log('Fetching lessons...');
        const lessonsRes = await fetch('/api/lessons');
        
        if (!lessonsRes.ok) {
          console.error('Lessons API error:', lessonsRes.status);
          setLessons([]);
          setLoading(false);
          return;
        }
        
        const lessonsData = await lessonsRes.json();
        console.log('Lessons received:', lessonsData.lessons?.length || 0);
        
        if (lessonsData.lessons && lessonsData.lessons.length > 0) {
          // Get completed lessons from localStorage
          let completedLessons = [];
          try {
            completedLessons = JSON.parse(localStorage.getItem(`completed_lessons_${meData.user.id}`) || '[]');
          } catch (e) {
            console.error('Error reading localStorage:', e);
          }
          
          const lessonsWithProgress = lessonsData.lessons.map(lesson => ({
            ...lesson,
            completed: completedLessons.includes(lesson.id)
          }));
          
          setLessons(lessonsWithProgress);
        }
      } catch (error) {
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [router]);

  const completedCount = lessons.filter(l => l.completed).length;
  const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  if (loading || checkingPayment) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB347]"></div>
        <p className="mt-2 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  // Show payment required if not paid
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
        <button 
          onClick={() => window.location.reload()} 
          className="text-[#FFB347] hover:underline mb-4 block w-full text-center"
        >
          ↻ Refresh after payment
        </button>
        <Link href="/foundation" className="text-gray-500 hover:text-[#FFB347] text-sm">
          ← Back to Course Info
        </Link>
      </div>
    );
  }

  // Show lessons if paid
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
      <p className="text-gray-600 mb-8">Track your progress through the Cybersecurity Foundation course.</p>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Course Progress</span>
          <span className="text-[#FFB347] font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-[#FFB347] h-3 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{completedCount} of {lessons.length} lessons completed</p>
      </div>

      {/* Lessons List */}
      {lessons.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <p className="text-yellow-700">No lessons found. Please contact support.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, index) => (
            <div key={lesson.id} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <Link 
                  href={`/foundation/lesson/${lesson.id}`} 
                  className="text-lg font-semibold text-[#0B1E33] hover:text-[#FFB347] transition"
                >
                  {lesson.title}
                </Link>
              </div>
              {lesson.completed ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">✓ Completed</span>
              ) : (
                <Link 
                  href={`/foundation/lesson/${lesson.id}`}
                  className="btn-outline text-sm py-1 px-4"
                >
                  Start
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}