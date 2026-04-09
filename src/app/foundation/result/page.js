'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import SearchParamsWrapper from '@/components/SearchParamsWrapper';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  
  const score = parseInt(searchParams.get('score') || '0');
  const total = parseInt(searchParams.get('total') || '20');
  const passed = searchParams.get('passed') === 'true';
  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          
          if (passed) {
            // Store result in localStorage
            const assessmentResult = {
              userId: data.user.id,
              userName: data.user.name,
              score: score,
              total: total,
              passed: passed,
              percentage: percentage,
              date: new Date().toISOString(),
              certificateId: `DODO-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`
            };
            
            const existingResults = JSON.parse(localStorage.getItem('assessment_results') || '[]');
            existingResults.push(assessmentResult);
            localStorage.setItem('assessment_results', JSON.stringify(existingResults));
            localStorage.setItem('latest_assessment', JSON.stringify(assessmentResult));
            
            // Mark final lesson complete
            const completedLessons = JSON.parse(localStorage.getItem(`completed_lessons_${data.user.id}`) || '[]');
            if (!completedLessons.includes('5')) {
              completedLessons.push('5');
              localStorage.setItem(`completed_lessons_${data.user.id}`, JSON.stringify(completedLessons));
            }
          }
        } else {
          router.push('/login');
        }
      })
      .catch(() => {});
  }, [score, total, passed, percentage, router]);

  const downloadCertificate = () => {
    const result = JSON.parse(localStorage.getItem('latest_assessment') || '{}');
    if (!result.certificateId) return;
    
    const certificateHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificate - Dodo Academy</title>
        <style>
          body { margin: 0; padding: 0; background: #f0f0f0; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: 'Georgia', serif; }
          .certificate { width: 800px; height: 600px; background: white; border: 20px solid #0B1E33; position: relative; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
          .certificate:before { content: ''; position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px; border: 2px solid #FFB347; }
          h1 { color: #0B1E33; font-size: 42px; text-align: center; margin: 0; }
          h2 { color: #FFB347; font-size: 24px; text-align: center; margin: 10px 0; }
          .recipient { font-size: 32px; font-weight: bold; color: #0B1E33; text-align: center; margin: 40px 0; }
          .content { text-align: center; margin: 50px 0; }
          .date { margin-top: 50px; text-align: center; color: #666; }
          .signature { margin-top: 40px; text-align: left; font-style: italic; }
          .seal { position: absolute; bottom: 80px; right: 60px; width: 100px; height: 100px; border-radius: 50%; background: #FFB347; display: flex; align-items: center; justify-content: center; font-size: 12px; text-align: center; color: #0B1E33; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <h1>DODO ACADEMY</h1>
          <h2>Certificate of Completion</h2>
          <div class="content">
            <p>This certificate is proudly presented to</p>
            <div class="recipient">${result.userName || user?.name || 'Student'}</div>
            <p>for successfully completing the</p>
            <h2>Cybersecurity Foundation Course</h2>
            <p>with a score of <strong>${result.score || score}/${result.total || total}</strong></p>
            <div class="date">Date: ${new Date(result.date || Date.now()).toLocaleDateString()}</div>
          </div>
          <div class="signature">_____________________<br>Dr. Adebayo Ogunlesi<br>Director, Dodo Academy</div>
          <div class="seal">DODO<br>ACADEMY</div>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([certificateHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dodo_Academy_Certificate_${result.userName || user?.name || 'Student'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className={`rounded-2xl p-8 mb-6 ${passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        {passed ? (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">Congratulations!</h1>
            <p className="text-green-600 mb-4">You passed the final assessment!</p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-3xl font-bold text-red-700 mb-2">Keep Learning!</h1>
            <p className="text-red-600 mb-4">You didn't pass this time. Review the lessons and try again.</p>
          </>
        )}
        
        <div className="text-4xl font-bold mb-2">{score} / {total}</div>
        <p className="text-gray-600">Score: {percentage}%</p>
        
        {!passed && <p className="text-sm text-gray-500 mt-2">Passing score: 16/20 (80%)</p>}
      </div>
      
      {passed && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-lg mb-2">📜 Your Certificate</h3>
          <button onClick={downloadCertificate} className="btn-primary">Download Certificate</button>
        </div>
      )}
      
      <div className="space-y-4">
        <Link href="/foundation/dashboard" className="btn-primary inline-block mr-4">Go to Dashboard</Link>
        {!passed && <Link href="/foundation/assessment" className="btn-outline inline-block">Try Again</Link>}
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <SearchParamsWrapper>
      <ResultContent />
    </SearchParamsWrapper>
  );
}