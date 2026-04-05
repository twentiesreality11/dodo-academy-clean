'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      
      if (!data.user) {
        router.push('/login?redirect=/foundation/dashboard');
        return;
      }
      
      setUser(data.user);
      await fetchLessons();
    } catch (error) {
      toast.error('Error loading dashboard');
      setLoading(false);
    }
  }

  async function fetchLessons() {
    try {
      const res = await fetch('/api/lessons');
      const data = await res.json();
      
      if (res.status === 403) {
        setHasAccess(false);
        toast.error('Please purchase the course to access lessons');
      } else if (data.lessons) {
        setLessons(data.lessons);
      }
    } catch (error) {
      toast.error('Error loading lessons');
    } finally {
      setLoading(false);
    }
  }

  const completedCount = lessons.filter(l => l.completed).length;
  const progressPercentage = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB347]"></div>
        <p className="mt-2 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-6">
            You need to purchase the Cybersecurity Foundation course to access the lessons.
          </p>
          <Link href="/foundation/checkout" className="btn-primary inline-block">
            Purchase Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">Track your progress through the Cybersecurity Foundation course.</p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Course Progress</span>
          <span className="text-[#FFB347] font-bold">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-[#FFB347] h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {completedCount} of {lessons.length} lessons completed
        </p>
      </div>

      {/* Lessons List */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold mb-4">Course Curriculum</h2>
        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="bg-white rounded-xl p-4 shadow-sm flex flex-wrap justify-between items-center hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-600">
                {index + 1}
              </div>
              <div>
                <Link 
                  href={`/foundation/lesson/${lesson.id}`} 
                  className="text-lg font-semibold text-[#0B1E33] hover:text-[#FFB347] transition"
                >
                  {lesson.title}
                </Link>
                {lesson.completed && (
                  <p className="text-xs text-green-600">Completed</p>
                )}
              </div>
            </div>
            {lesson.completed ? (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                ✓ Completed
              </span>
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