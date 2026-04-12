import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const LESSONS = [
  { 
    id: '1', 
    title: 'Introduction to Cybersecurity', 
    order_num: 1,
    content: `<div class="lesson-content">
      <h2>Introduction to Cybersecurity: Protecting Our Digital World</h2>
      <p>Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks.</p>
      <h3>The CIA Triad</h3>
      <ul>
        <li><strong>Confidentiality:</strong> Only authorized people can access information</li>
        <li><strong>Integrity:</strong> Information is accurate and hasn't been tampered with</li>
        <li><strong>Availability:</strong> Information is accessible when needed</li>
      </ul>
      <div class="bg-blue-50 p-4 rounded-lg my-4">
        <h4 class="font-bold">📖 Nigerian Case Study</h4>
        <p>In 2022, hackers attempted to breach First Bank's internal systems. Thanks to robust security measures, they were detected within minutes.</p>
      </div>
    </div>`
  },
  { 
    id: '2', 
    title: 'Network Security Fundamentals', 
    order_num: 2,
    content: `<div class="lesson-content">
      <h2>Network Security Fundamentals</h2>
      <p>Network security protects the integrity, confidentiality, and accessibility of computer networks.</p>
      <h3>Key Network Devices</h3>
      <ul>
        <li><strong>Firewalls:</strong> Monitor and control incoming/outgoing traffic</li>
        <li><strong>Routers:</strong> Direct traffic between networks</li>
        <li><strong>Switches:</strong> Connect devices within a network</li>
      </ul>
      <div class="bg-blue-50 p-4 rounded-lg my-4">
        <h4 class="font-bold">📖 Case Study</h4>
        <p>In 2015, Nigerian bank customers lost over $1 million to MITM attacks that intercepted SMS authentication codes.</p>
      </div>
    </div>`
  },
  { 
    id: '3', 
    title: 'Cryptography Basics', 
    order_num: 3,
    content: `<div class="lesson-content">
      <h2>Cryptography Basics</h2>
      <p>Cryptography transforms readable data into unreadable format using mathematical algorithms.</p>
      <h3>Key Concepts</h3>
      <ul>
        <li><strong>Symmetric Encryption:</strong> Same key to encrypt and decrypt</li>
        <li><strong>Asymmetric Encryption:</strong> Public/private key pairs</li>
        <li><strong>Hashing:</strong> One-way function for passwords</li>
      </ul>
      <div class="bg-blue-50 p-4 rounded-lg my-4">
        <h4 class="font-bold">📖 Real-World Application</h4>
        <p>WhatsApp uses end-to-end encryption, protecting over 2 billion users worldwide.</p>
      </div>
    </div>`
  },
  { 
    id: '4', 
    title: 'Ethical Hacking Basics', 
    order_num: 4,
    content: `<div class="lesson-content">
      <h2>Ethical Hacking Basics</h2>
      <p>Ethical hackers use the same techniques as criminals but with permission to improve security.</p>
      <h3>Types of Hackers</h3>
      <ul>
        <li><strong>Black Hat:</strong> Malicious criminals</li>
        <li><strong>White Hat:</strong> Ethical hackers</li>
        <li><strong>Grey Hat:</strong> In between (still illegal)</li>
      </ul>
      <h3>Ethical Hacking Methodology</h3>
      <ol>
        <li>Reconnaissance</li>
        <li>Scanning</li>
        <li>Exploitation</li>
        <li>Reporting</li>
      </ol>
    </div>`
  },
  { 
    id: '5', 
    title: 'Final Assessment', 
    order_num: 5,
    content: `<div class="lesson-content">
      <h2>Final Assessment</h2>
      <p>Congratulations on completing all lessons!</p>
      <div class="bg-blue-50 p-4 rounded-lg my-4">
        <h4 class="font-bold">🎯 Assessment Details</h4>
        <ul>
          <li>20 multiple-choice questions</li>
          <li>Passing score: 16/20 (80%)</li>
          <li>Unlimited attempts</li>
        </ul>
      </div>
    </div>`
  },
];

export async function GET(request) {
  const sessionId = request.cookies.get('session')?.value;
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Get completed lessons from localStorage (passed via cookie or header)
  // For simplicity, return all lessons without progress tracking
  
  return NextResponse.json({ lessons: LESSONS });
}