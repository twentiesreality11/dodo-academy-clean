'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.lessonId;
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    // Check if user has paid
    const paid = localStorage.getItem('has_paid') === 'true';
    setHasPaid(paid);
    
    async function fetchLesson() {
      try {
        const res = await fetch('/api/lessons');
        const data = await res.json();
        if (data.lessons) {
          const found = data.lessons.find(l => l.id === lessonId);
          setLesson(found);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLesson();
  }, [lessonId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB347]"></div>
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  if (!hasPaid) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-yellow-800 mb-4">Payment Required</h1>
          <p className="text-gray-700 mb-6">
            You need to purchase the course to access this lesson.
          </p>
          <Link href="/foundation/checkout" className="btn-primary inline-block">
            Purchase Course - ₦50,000
          </Link>
        </div>
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
        <div className="lesson-content" dangerouslySetInnerHTML={{ __html: lesson.content }} />
      </div>
    </div>
  );
}