'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AssessmentPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      const res = await fetch('/api/assessment/questions');
      const data = await res.json();
      
      if (res.status === 403) {
        if (data.error === 'You have already passed the assessment') {
          toast.error('You have already passed the assessment');
          router.push('/foundation/dashboard');
        } else {
          router.push('/foundation/checkout');
        }
        return;
      }
      
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        // Initialize answers object
        const initialAnswers = {};
        data.questions.forEach((_, index) => {
          initialAnswers[`q${index}`] = '';
        });
        setAnswers(initialAnswers);
      } else {
        toast.error('No questions found');
      }
    } catch (error) {
      console.error('Error loading assessment:', error);
      toast.error('Error loading assessment');
    } finally {
      setLoading(false);
    }
  }

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [`q${questionIndex}`]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all questions are answered
    const answeredCount = Object.values(answers).filter(a => a !== '' && a !== undefined).length;
    
    if (answeredCount !== questions.length) {
      toast.error(`Please answer all ${questions.length} questions. You've answered ${answeredCount}.`);
      return;
    }
    
    setSubmitting(true);
    
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        router.push(`/foundation/result?score=${data.score}&total=${data.total}&passed=${data.passed}`);
      } else {
        toast.error(data.error || 'Error submitting assessment');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Network error. Please try again.');
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

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No questions available. Please contact support.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Final Assessment</h1>
      <p className="text-gray-600 mb-6">
        Test your knowledge with this {questions.length}-question assessment. You need at least 16/20 to pass.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, index) => {
          let options = [];
          try {
            options = JSON.parse(q.options);
          } catch (e) {
            console.error('Error parsing options:', e);
            options = [];
          }
          
          return (
            <div key={q.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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