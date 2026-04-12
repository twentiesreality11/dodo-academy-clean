'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();
        
        if (!meData.user) {
          router.push('/login?redirect=/foundation/dashboard');
          return;
        }
        
        setUser(meData.user);
        
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
  }, [router]);

  const completedCount = lessons.filter(l => l.completed).length;
  const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB347]"></div>
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}