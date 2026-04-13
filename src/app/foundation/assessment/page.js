'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AssessmentPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meData.user) {
        router.push('/login');
        return;
      }
      setUser(meData.user);
      
      const lessonsRes = await fetch('/api/lessons');
      const lessonsData = await lessonsRes.json();
      setHasPaid(lessonsData.hasPaid || false);
      
      if (!lessonsData.hasPaid) {
        router.push('/foundation/checkout');
        return;
      }
      
      const questionsRes = await fetch('/api/assessment/questions');
      const questionsData = await questionsRes.json();
      setQuestions(questionsData.questions || []);
      setLoading(false);
    }
    fetchData();
  }, [router]);

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers(prev => ({ ...prev, [`q${questionIndex}`]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(answers).length !== questions.length) {
      alert(`Please answer all ${questions.length} questions.`);
      return;
    }
    
    setSubmitting(true);
    const res = await fetch('/api/assessment/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, userId: user?.id }),
    });
    const data = await res.json();
    router.push(`/foundation/result?score=${data.score}&total=${data.total}&passed=${data.passed}`);
    setSubmitting(false);
  };

  if (loading) return <div className="text-center py-12">Loading assessment...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Final Assessment</h1>
      <p className="text-gray-600 mb-6">You need at least 16/20 to pass.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, index) => {
          const options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
          return (
            <div key={q.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="font-semibold mb-4">{index + 1}. {q.question}</p>
              <div className="space-y-2">
                {options.map((opt, optIndex) => (
                  <label key={optIndex} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                    <input type="radio" name={`q${index}`} value={optIndex} onChange={() => handleAnswerChange(index, optIndex)} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
        <button type="submit" disabled={submitting} className="btn-primary w-full">Submit Assessment</button>
      </form>
    </div>
  );
}