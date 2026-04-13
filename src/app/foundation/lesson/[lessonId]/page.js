'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.lessonId;
  const [lesson, setLesson] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meData.user) {
        router.push('/login');
        return;
      }
      
      const lessonsRes = await fetch('/api/lessons');
      const lessonsData = await lessonsRes.json();
      setHasPaid(lessonsData.hasPaid || false);
      
      if (!lessonsData.hasPaid) {
        router.push('/foundation/checkout');
        return;
      }
      
      const lessonRes = await fetch(`/api/lessons/${lessonId}`);
      const lessonData = await lessonRes.json();
      
      if (lessonData.lesson) {
        setLesson(lessonData.lesson);
        setCompleted(lessonData.completed);
      }
      setLoading(false);
    }
    
    fetchData();
  }, [lessonId, router]);

  async function markComplete() {
    const res = await fetch(`/api/lessons/${lessonId}/complete`, { method: 'POST' });
    if (res.ok) {
      setCompleted(true);
      alert('✅ Lesson marked as complete!');
    }
  }

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!lesson) return <div className="text-center py-12">Lesson not found.</div>;

  return (
    <div>
      <div className="mb-6"><Link href="/foundation/dashboard" className="text-[#FFB347] hover:underline">← Back to Dashboard</Link></div>
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{lesson.title}</h1>
        <div className="lesson-content" dangerouslySetInnerHTML={{ __html: lesson.content }} />
        <div className="mt-8 pt-6 border-t flex justify-between items-center">
          {!completed ? (
            <button onClick={markComplete} className="btn-primary">✓ Mark as Completed</button>
          ) : (
            <span className="text-green-600 font-semibold">✓ Lesson Completed</span>
          )}
          <Link href="/foundation/dashboard" className="text-gray-500 hover:text-[#FFB347]">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}