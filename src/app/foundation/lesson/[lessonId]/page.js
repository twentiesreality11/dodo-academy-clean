'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId;
  const [lesson, setLesson] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  async function fetchLesson() {
    try {
      const res = await fetch(`/api/lessons/${lessonId}`);
      const data = await res.json();
      
      if (res.status === 403) {
        toast.error('Please purchase the course to access lessons');
        router.push('/foundation/checkout');
        return;
      }
      
      if (data.lesson) {
        setLesson(data.lesson);
        setCompleted(data.completed);
      } else {
        toast.error('Lesson not found');
        router.push('/foundation/dashboard');
      }
    } catch (error) {
      toast.error('Error loading lesson');
      router.push('/foundation/dashboard');
    } finally {
      setLoading(false);
    }
  }

  async function markComplete() {
    try {
      const res = await fetch(`/api/lessons/${lessonId}/complete`, { 
        method: 'POST' 
      });
      
      if (res.ok) {
        setCompleted(true);
        toast.success('Lesson marked as complete!');
      } else {
        toast.error('Failed to mark lesson as complete');
      }
    } catch (error) {
      toast.error('Network error');
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB347]"></div>
        <p className="mt-2 text-gray-600">Loading lesson...</p>
      </div>
    );
  }

  if (!lesson) return null;

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
              Mark as Completed
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