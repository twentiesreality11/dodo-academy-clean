'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.lessonId;
  const [user, setUser] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();
        
        if (!meData.user) {
          router.push('/login');
          return;
        }
        
        setUser(meData.user);
        
        const completedLessons = JSON.parse(localStorage.getItem(`completed_lessons_${meData.user.id}`) || '[]');
        setCompleted(completedLessons.includes(lessonId));
        
        const lessonRes = await fetch(`/api/lessons/${lessonId}`);
        const lessonData = await lessonRes.json();
        
        if (lessonData.lesson) {
          setLesson(lessonData.lesson);
        } else {
          router.push('/foundation/dashboard');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [lessonId, router]);

  const markComplete = () => {
    if (!user) return;
    
    const completedLessons = JSON.parse(localStorage.getItem(`completed_lessons_${user.id}`) || '[]');
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
      localStorage.setItem(`completed_lessons_${user.id}`, JSON.stringify(completedLessons));
      setCompleted(true);
      alert('✅ Lesson marked as complete!');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB347]"></div>
        <p className="mt-2">Loading lesson...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <p>Lesson not found.</p>
        <Link href="/foundation/dashboard" className="btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/foundation/dashboard" className="text-[#FFB347] hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{lesson.title}</h1>
        
        <div 
          className="lesson-content"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
        
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
          {!completed ? (
            <button onClick={markComplete} className="btn-primary">
              ✓ Mark as Completed
            </button>
          ) : (
            <span className="text-green-600 font-semibold flex items-center gap-2">
              ✓ Lesson Completed
            </span>
          )}
          
          <Link href="/foundation/dashboard" className="text-gray-500 hover:text-[#FFB347]">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}