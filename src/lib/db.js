import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let dbInstance = null;

export async function getDb() {
  if (!dbInstance) {
    try {
      dbInstance = await open({
        filename: path.join(process.cwd(), 'database.sqlite'),
        driver: sqlite3.Database,
      });
      
      console.log('Database connected successfully');
      
      // Initialize all tables
      await dbInstance.exec(`
        -- Users table
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE,
          name TEXT,
          password TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Payments table
        CREATE TABLE IF NOT EXISTS payments (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          reference TEXT UNIQUE,
          amount INTEGER,
          status TEXT,
          course_type TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id)
        );
        
        -- Lessons table
        CREATE TABLE IF NOT EXISTS lessons (
          id TEXT PRIMARY KEY,
          title TEXT,
          content TEXT,
          order_num INTEGER
        );
        
        -- Progress table
        CREATE TABLE IF NOT EXISTS progress (
          user_id TEXT,
          lesson_id TEXT,
          completed BOOLEAN DEFAULT 0,
          completed_at DATETIME,
          PRIMARY KEY (user_id, lesson_id)
        );
        
        -- Assessment questions table
        CREATE TABLE IF NOT EXISTS assessment_questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          lesson_id TEXT,
          question TEXT NOT NULL,
          options TEXT NOT NULL,
          correct_answer INTEGER NOT NULL
        );
        
        -- Assessment attempts table
        CREATE TABLE IF NOT EXISTS assessment_attempts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          score INTEGER NOT NULL,
          passed BOOLEAN NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id)
        );
        
        -- Inquiries table
        CREATE TABLE IF NOT EXISTS inquiries (
          id TEXT PRIMARY KEY,
          name TEXT,
          email TEXT,
          message TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      // Check if lessons are empty and seed them
      const lessonCount = await dbInstance.get('SELECT COUNT(*) as count FROM lessons');
      if (lessonCount.count === 0) {
        await seedLessons(dbInstance);
      }
      
      // Check if assessment questions are empty and seed them
      const questionCount = await dbInstance.get('SELECT COUNT(*) as count FROM assessment_questions');
      if (questionCount.count === 0) {
        await seedAssessmentQuestions(dbInstance);
      }
      
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }
  return dbInstance;
}

async function seedLessons(db) {
  const lessons = [
    {
      id: '1',
      title: 'Introduction to Cybersecurity',
      content: '<h2>Welcome to Cybersecurity</h2><p>Learn the fundamentals...</p>',
      order_num: 1
    },
    {
      id: '2',
      title: 'Network Security Fundamentals',
      content: '<h2>Network Security</h2><p>Understanding network protection...</p>',
      order_num: 2
    },
    {
      id: '3',
      title: 'Cryptography Basics',
      content: '<h2>Cryptography</h2><p>The art of secure communication...</p>',
      order_num: 3
    },
    {
      id: '4',
      title: 'Ethical Hacking Basics',
      content: '<h2>Ethical Hacking</h2><p>Think like an attacker to defend...</p>',
      order_num: 4
    },
    {
      id: '5',
      title: 'Final Assessment',
      content: '<h2>Final Assessment</h2><p>Test your knowledge with our 20-question assessment.</p><p><a href="/foundation/assessment" class="btn-primary">Start Assessment</a></p>',
      order_num: 5
    }
  ];
  
  for (const lesson of lessons) {
    await db.run(
      'INSERT INTO lessons (id, title, content, order_num) VALUES (?, ?, ?, ?)',
      [lesson.id, lesson.title, lesson.content, lesson.order_num]
    );
  }
}

async function seedAssessmentQuestions(db) {
  const questions = [
    {
      question: 'What does the "C" in the CIA triad stand for?',
      options: JSON.stringify(['Confidentiality', 'Cryptography', 'Centralization', 'Continuity']),
      correct_answer: 0
    },
    {
      question: 'Which Nigerian agency is responsible for national cyber defence?',
      options: JSON.stringify(['NITDA', 'NSCDC', 'NIBSS', 'CBN']),
      correct_answer: 1
    },
    {
      question: 'What type of attack tricks users into revealing passwords via fake emails?',
      options: JSON.stringify(['Phishing', 'DDoS', 'Ransomware', 'Spoofing']),
      correct_answer: 0
    },
    {
      question: 'What device directs traffic between different networks?',
      options: JSON.stringify(['Switch', 'Router', 'Modem', 'Hub']),
      correct_answer: 1
    },
    {
      question: 'What does a firewall do?',
      options: JSON.stringify(['Speeds up connection', 'Monitors and controls traffic', 'Stores passwords', 'Encrypts data']),
      correct_answer: 1
    },
    {
      question: 'Which protocol is used for secure web browsing?',
      options: JSON.stringify(['HTTP', 'FTP', 'HTTPS', 'SMTP']),
      correct_answer: 2
    },
    {
      question: 'In symmetric encryption, how many keys are used?',
      options: JSON.stringify(['One', 'Two', 'Three', 'Four']),
      correct_answer: 0
    },
    {
      question: 'What is the main disadvantage of symmetric encryption?',
      options: JSON.stringify(['Slow speed', 'Key distribution problem', 'Weak security', 'Large key size']),
      correct_answer: 1
    },
    {
      question: 'What is the first phase of ethical hacking methodology?',
      options: JSON.stringify(['Scanning', 'Exploitation', 'Reconnaissance', 'Reporting']),
      correct_answer: 2
    },
    {
      question: 'Which tool is a popular framework for exploiting vulnerabilities?',
      options: JSON.stringify(['Nmap', 'Wireshark', 'Metasploit', 'Burp Suite']),
      correct_answer: 2
    },
    {
      question: 'In Nigeria, unauthorised hacking is illegal under which act?',
      options: JSON.stringify(['NITDA Act', 'Cybercrimes Act 2015', 'CBN Act', 'Companies Act']),
      correct_answer: 1
    },
    {
      question: 'What colour hat describes an ethical hacker?',
      options: JSON.stringify(['Black', 'White', 'Grey', 'Red']),
      correct_answer: 1
    },
    {
      question: 'What is a DDoS attack designed to disrupt?',
      options: JSON.stringify(['Data integrity', 'Availability', 'Confidentiality', 'Authentication']),
      correct_answer: 1
    },
    {
      question: 'What does a hash function produce?',
      options: JSON.stringify(['Variable-length output', 'Fixed-size output', 'Encrypted message', 'Private key']),
      correct_answer: 1
    },
    {
      question: 'Which of these is a hashing algorithm?',
      options: JSON.stringify(['RSA', 'AES', 'SHA-256', 'ECC']),
      correct_answer: 2
    },
    {
      question: 'Digital signatures provide which two security services?',
      options: JSON.stringify(['Confidentiality & integrity', 'Authentication & non-repudiation', 'Availability & confidentiality', 'Integrity & speed']),
      correct_answer: 1
    },
    {
      question: 'What should an ethical hacker always have before testing?',
      options: JSON.stringify(['New computer', 'Written permission', 'Kali Linux license', 'Team of five']),
      correct_answer: 1
    },
    {
      question: 'What is a rogue access point?',
      options: JSON.stringify(['Legitimate Wi-Fi hotspot', 'Fake Wi-Fi network set up by attackers', 'Type of firewall', 'Network switch']),
      correct_answer: 1
    },
    {
      question: 'What does VPN stand for?',
      options: JSON.stringify(['Virtual Private Network', 'Very Private Network', 'Virtual Protected Network', 'Verified Personal Network']),
      correct_answer: 0
    },
    {
      question: 'What is social engineering?',
      options: JSON.stringify(['Engineering social media', 'Manipulating people to reveal information', 'Building social networks', 'Social media marketing']),
      correct_answer: 1
    }
  ];
  
  for (const q of questions) {
    await db.run(
      'INSERT INTO assessment_questions (question, options, correct_answer) VALUES (?, ?, ?)',
      [q.question, q.options, q.correct_answer]
    );
  }
}