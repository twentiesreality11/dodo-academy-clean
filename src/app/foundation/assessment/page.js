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
  const [error, setError] = useState('');

  // Fetch user and questions on page load
  useEffect(() => {
    async function fetchData() {
      try {
        // Get current user
        const userRes = await fetch('/api/auth/me');
        const userData = await userRes.json();
        
        if (!userData.user) {
          router.push('/login?redirect=/foundation/assessment');
          return;
        }
        
        setUser(userData.user);
        
        // Get assessment questions
        const questionsRes = await fetch('/api/assessment/questions');
        const questionsData = await questionsRes.json();
        
        if (questionsRes.ok && questionsData.questions) {
          setQuestions(questionsData.questions);
          // Initialize answers object
          const initialAnswers = {};
          questionsData.questions.forEach((_, index) => {
            initialAnswers[`q${index}`] = '';
          });
          setAnswers(initialAnswers);
        } else {
          setError('Failed to load assessment questions');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [router]);

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [`q${questionIndex}`]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Check if all questions are answered
    const answeredCount = Object.values(answers).filter(a => a !== '' && a !== undefined).length;
    
    if (answeredCount !== questions.length) {
      setError(`Please answer all ${questions.length} questions. You've answered ${answeredCount}.`);
      return;
    }
    
    setSubmitting(true);
    
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers, 
          userId: user?.id 
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        router.push(`/foundation/result?score=${data.score}&total=${data.total}&passed=${data.passed}`);
      } else {
        setError(data.error || 'Error submitting assessment');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB347]"></div>
        <p className="mt-2 text-gray-600">Loading assessment...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/foundation/dashboard" className="text-[#FFB347] hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Final Assessment</h1>
      <p className="text-gray-600 mb-6">
        Test your knowledge with this {questions.length}-question assessment. You need at least 16/20 to pass.
      </p>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, index) => {
          let options = [];
          try {
            options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
          } catch (e) {
            console.error('Error parsing options:', e);
            options = [];
          }
          
          return (
            <div key={q.id || index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="font-semibold mb-4 text-lg">
                {index + 1}. {q.question}
              </p>
              <div className="space-y-3">
                {options.map((option, optIndex) => (
                  <label 
                    key={optIndex} 
                    className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition"
                  >
                    <input
                      type="radio"
                      name={`question_${index}`}
                      value={optIndex}
                      checked={answers[`q${index}`] === String(optIndex)}
                      onChange={() => handleAnswerChange(index, String(optIndex))}
                      className="w-4 h-4 text-[#FFB347] focus:ring-[#FFB347] focus:ring-offset-0"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
        
        <div className="text-center pt-4">
          <button 
            type="submit" 
            disabled={submitting} 
            className="btn-primary px-8 py-3 text-lg"
          >
            {submitting ? 'Submitting...' : 'Submit Assessment'}
          </button>
        </div>
      </form>
    </div>
  );
}