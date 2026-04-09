'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [assessmentResults, setAssessmentResults] = useState([]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          
          // Load from localStorage
          const lessons = JSON.parse(localStorage.getItem(`completed_lessons_${data.user.id}`) || '[]');
          setCompletedLessons(lessons);
          
          const results = JSON.parse(localStorage.getItem('assessment_results') || '[]');
          const userResults = results.filter(r => r.userId === data.user.id);
          setAssessmentResults(userResults);
        }
      });
  }, []);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p>Please login to view your profile.</p>
        <Link href="/login" className="btn-primary">Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Account Information</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Progress</h2>
        <p><strong>Completed Lessons:</strong> {completedLessons.length} / 5</p>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div 
            className="bg-[#FFB347] h-3 rounded-full" 
            style={{ width: `${(completedLessons.length / 5) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {assessmentResults.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4">Assessment History</h2>
          {assessmentResults.map((result, index) => (
            <div key={index} className="border-b border-gray-100 py-3">
              <p><strong>Date:</strong> {new Date(result.date).toLocaleDateString()}</p>
              <p><strong>Score:</strong> {result.score}/{result.total} ({result.percentage}%)</p>
              <p><strong>Status:</strong> {result.passed ? '✅ Passed' : '❌ Failed'}</p>
              {result.passed && result.certificateId && (
                <p><strong>Certificate ID:</strong> {result.certificateId}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}