// scripts/seed-neon.js
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('❌ Error: POSTGRES_URL environment variable is not set!');
  console.error('\nPlease set your Neon database connection string in .env.local');
  process.exit(1);
}

console.log('✅ Database connection string found');
const sql = neon(connectionString);

// Create tables first
async function createTables() {
  console.log('📋 Creating tables...');
  
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      name TEXT,
      password TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  await sql`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      reference TEXT UNIQUE,
      amount INTEGER,
      status TEXT,
      course_type TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `;
  
  await sql`
    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      title TEXT,
      content TEXT,
      order_num INTEGER
    )
  `;
  
  await sql`
    CREATE TABLE IF NOT EXISTS progress (
      user_id TEXT,
      lesson_id TEXT,
      completed BOOLEAN DEFAULT FALSE,
      completed_at TIMESTAMP,
      PRIMARY KEY (user_id, lesson_id)
    )
  `;
  
  await sql`
    CREATE TABLE IF NOT EXISTS assessment_questions (
      id SERIAL PRIMARY KEY,
      lesson_id TEXT,
      question TEXT NOT NULL,
      options JSONB NOT NULL,
      correct_answer INTEGER NOT NULL
    )
  `;
  
  await sql`
    CREATE TABLE IF NOT EXISTS assessment_attempts (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      passed BOOLEAN NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `;
  
  await sql`
    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      phone TEXT,
      organization TEXT,
      message TEXT,
      type TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  console.log('✅ Tables created successfully');
}

const lessons = [
  {
    id: '1',
    title: 'Introduction to Cybersecurity',
    content: `
<div class="lesson-content">
  <h2>Welcome to Cybersecurity: Protecting Our Digital World</h2>
  
  <p>Imagine waking up one morning to find your bank account empty, your social media accounts posting spam, and your company's customer database stolen. This isn't a movie plot—it's a real scenario happening every day to millions of people worldwide.</p>

  <h3>The CIA Triad: The Foundation of Security</h3>
  <ul>
    <li><strong>Confidentiality:</strong> Only authorized people can access information</li>
    <li><strong>Integrity:</strong> Information is accurate and hasn't been tampered with</li>
    <li><strong>Availability:</strong> Information and systems are accessible when needed</li>
  </ul>

  <div class="bg-blue-50 p-4 rounded-lg my-4">
    <h4 class="font-bold">📖 Nigerian Case Study</h4>
    <p>In 2022, hackers attempted to breach First Bank's internal systems. Thanks to robust security measures, they were detected within minutes.</p>
  </div>

  <h3>Common Cyber Threats</h3>
  <ul>
    <li><strong>Phishing:</strong> Fake emails tricking you into revealing passwords</li>
    <li><strong>Malware:</strong> Viruses, worms, and ransomware</li>
    <li><strong>DDoS:</strong> Overwhelming websites with traffic</li>
  </ul>
</div>
    `,
    order_num: 1
  },
  {
    id: '2',
    title: 'Network Security Fundamentals',
    content: `
<div class="lesson-content">
  <h2>Network Security: Building Digital Fortresses</h2>
  
  <p>Think of a network as a digital highway. Data packets are cars traveling from one destination to another. Network security protects that highway.</p>

  <h3>Network Devices</h3>
  <ul>
    <li><strong>Firewalls:</strong> Gatekeepers that monitor traffic</li>
    <li><strong>Routers:</strong> Traffic directors between networks</li>
    <li><strong>Switches:</strong> Internal connectors for devices</li>
  </ul>

  <h3>Common Network Attacks</h3>
  <ul>
    <li><strong>Eavesdropping:</strong> Capturing data packets</li>
    <li><strong>Man-in-the-Middle:</strong> Intercepting communications</li>
    <li><strong>DDoS:</strong> Flooding networks with traffic</li>
  </ul>

  <div class="bg-blue-50 p-4 rounded-lg my-4">
    <h4 class="font-bold">📖 Case Study: Nigerian Bank MITM Attack</h4>
    <p>In 2015, Nigerian bank customers lost over $1 million to MITM attacks that intercepted SMS authentication codes.</p>
  </div>
</div>
    `,
    order_num: 2
  },
  {
    id: '3',
    title: 'Cryptography Basics',
    content: `
<div class="lesson-content">
  <h2>Cryptography: The Art of Secret Communication</h2>
  
  <p>Cryptography transforms readable data into unreadable format using mathematical algorithms and keys.</p>

  <h3>Key Concepts</h3>
  <ul>
    <li><strong>Symmetric Encryption:</strong> Same key to encrypt and decrypt</li>
    <li><strong>Asymmetric Encryption:</strong> Public/private key pairs</li>
    <li><strong>Hashing:</strong> One-way function for passwords</li>
  </ul>

  <div class="bg-blue-50 p-4 rounded-lg my-4">
    <h4 class="font-bold">📖 Real-World Application</h4>
    <p>WhatsApp uses end-to-end encryption, protecting over 2 billion users worldwide—including millions in Nigeria.</p>
  </div>
</div>
    `,
    order_num: 3
  },
  {
    id: '4',
    title: 'Ethical Hacking Basics',
    content: `
<div class="lesson-content">
  <h2>Ethical Hacking: Thinking Like an Attacker to Defend</h2>
  
  <p>Ethical hackers use the same techniques as criminals but with permission to improve security.</p>

  <h3>Types of Hackers</h3>
  <ul>
    <li><strong>Black Hat:</strong> Malicious criminals</li>
    <li><strong>White Hat:</strong> Ethical hackers</li>
    <li><strong>Grey Hat:</strong> In between (still illegal)</li>
  </ul>

  <h3>Ethical Hacking Methodology</h3>
  <ol>
    <li>Reconnaissance (Information gathering)</li>
    <li>Scanning (Finding vulnerabilities)</li>
    <li>Exploitation (Attempting to break in)</li>
    <li>Reporting (Documenting findings)</li>
  </ol>

  <div class="bg-blue-50 p-4 rounded-lg my-4">
    <h4 class="font-bold">📖 Case Study: NIMC Portal Security</h4>
    <p>Ethical hackers found an SQL injection vulnerability before launch, protecting millions of citizen records.</p>
  </div>
</div>
    `,
    order_num: 4
  },
  {
    id: '5',
    title: 'Final Assessment',
    content: `
<div class="lesson-content">
  <h2>Final Assessment: Test Your Knowledge</h2>
  
  <p>Congratulations on completing all four foundation lessons!</p>

  <div class="bg-blue-50 p-4 rounded-lg my-4">
    <h4 class="font-bold">🎯 Assessment Details:</h4>
    <ul>
      <li><strong>Questions:</strong> 20 multiple-choice questions</li>
      <li><strong>Passing Score:</strong> 16/20 (80%)</li>
      <li><strong>Attempts:</strong> Unlimited</li>
    </ul>
  </div>

  <div class="text-center my-8">
    <a href="/foundation/assessment" class="btn-primary inline-block px-8 py-3 text-lg">
      Start Assessment
    </a>
  </div>
</div>
    `,
    order_num: 5
  }
];

const assessmentQuestions = [
  { question: 'What does the "C" in the CIA triad stand for?', options: JSON.stringify(['Confidentiality', 'Cryptography', 'Centralization', 'Continuity']), correct_answer: 0 },
  { question: 'Which Nigerian agency is responsible for national cyber defence?', options: JSON.stringify(['NITDA', 'NSCDC', 'NIBSS', 'CBN']), correct_answer: 1 },
  { question: 'What type of attack tricks users into revealing passwords via fake emails?', options: JSON.stringify(['Phishing', 'DDoS', 'Ransomware', 'Spoofing']), correct_answer: 0 },
  { question: 'What device directs traffic between different networks?', options: JSON.stringify(['Switch', 'Router', 'Modem', 'Hub']), correct_answer: 1 },
  { question: 'What does a firewall do?', options: JSON.stringify(['Speeds up connection', 'Monitors and controls traffic', 'Stores passwords', 'Encrypts data']), correct_answer: 1 },
  { question: 'Which protocol is used for secure web browsing?', options: JSON.stringify(['HTTP', 'FTP', 'HTTPS', 'SMTP']), correct_answer: 2 },
  { question: 'In symmetric encryption, how many keys are used?', options: JSON.stringify(['One', 'Two', 'Three', 'Four']), correct_answer: 0 },
  { question: 'What is the main disadvantage of symmetric encryption?', options: JSON.stringify(['Slow speed', 'Key distribution problem', 'Weak security', 'Large key size']), correct_answer: 1 },
  { question: 'What is the first phase of ethical hacking methodology?', options: JSON.stringify(['Scanning', 'Exploitation', 'Reconnaissance', 'Reporting']), correct_answer: 2 },
  { question: 'Which tool is a popular framework for exploiting vulnerabilities?', options: JSON.stringify(['Nmap', 'Wireshark', 'Metasploit', 'Burp Suite']), correct_answer: 2 },
  { question: 'In Nigeria, unauthorised hacking is illegal under which act?', options: JSON.stringify(['NITDA Act', 'Cybercrimes Act 2015', 'CBN Act', 'Companies Act']), correct_answer: 1 },
  { question: 'What colour hat describes an ethical hacker?', options: JSON.stringify(['Black', 'White', 'Grey', 'Red']), correct_answer: 1 },
  { question: 'What is a DDoS attack designed to disrupt?', options: JSON.stringify(['Data integrity', 'Availability', 'Confidentiality', 'Authentication']), correct_answer: 1 },
  { question: 'What does a hash function produce?', options: JSON.stringify(['Variable-length output', 'Fixed-size output', 'Encrypted message', 'Private key']), correct_answer: 1 },
  { question: 'Which of these is a hashing algorithm?', options: JSON.stringify(['RSA', 'AES', 'SHA-256', 'ECC']), correct_answer: 2 },
  { question: 'Digital signatures provide which two security services?', options: JSON.stringify(['Confidentiality & integrity', 'Authentication & non-repudiation', 'Availability & confidentiality', 'Integrity & speed']), correct_answer: 1 },
  { question: 'What should an ethical hacker always have before testing?', options: JSON.stringify(['New computer', 'Written permission', 'Kali Linux license', 'Team of five']), correct_answer: 1 },
  { question: 'What is a rogue access point?', options: JSON.stringify(['Legitimate Wi-Fi hotspot', 'Fake Wi-Fi network set up by attackers', 'Type of firewall', 'Network switch']), correct_answer: 1 },
  { question: 'What does VPN stand for?', options: JSON.stringify(['Virtual Private Network', 'Very Private Network', 'Virtual Protected Network', 'Verified Personal Network']), correct_answer: 0 },
  { question: 'What is social engineering?', options: JSON.stringify(['Engineering social media', 'Manipulating people to reveal information', 'Building social networks', 'Social media marketing']), correct_answer: 1 }
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Create tables first
    await createTables();
    
    // Clear existing data
    console.log('Clearing existing data...');
    await sql`TRUNCATE TABLE lessons RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE assessment_questions RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE payments RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE progress RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE assessment_attempts RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE inquiries RESTART IDENTITY CASCADE`;
    
    // Seed lessons
    console.log(`Seeding ${lessons.length} lessons...`);
    for (const lesson of lessons) {
      await sql`
        INSERT INTO lessons (id, title, content, order_num)
        VALUES (${lesson.id}, ${lesson.title}, ${lesson.content}, ${lesson.order_num})
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          order_num = EXCLUDED.order_num
      `;
      console.log(`  ✓ Added: ${lesson.title}`);
    }
    
    // Seed assessment questions
    console.log(`Seeding ${assessmentQuestions.length} assessment questions...`);
    for (const q of assessmentQuestions) {
      await sql`
        INSERT INTO assessment_questions (question, options, correct_answer)
        VALUES (${q.question}, ${q.options}, ${q.correct_answer})
      `;
    }
    console.log(`  ✓ Added ${assessmentQuestions.length} questions`);
    
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();