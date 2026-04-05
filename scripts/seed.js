const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const bcrypt = require('bcryptjs');

async function seed() {
  const db = await open({
    filename: path.join(process.cwd(), 'database.sqlite'),
    driver: sqlite3.Database,
  });

  console.log('Seeding database...');

  // Seed lessons
  const lessons = [
    { id: '1', title: 'Introduction to Cybersecurity', content: '<h2>Introduction to Cybersecurity</h2><p>Learn the fundamentals of cybersecurity and why it matters for Nigeria\'s critical infrastructure.</p>', order_num: 1 },
    { id: '2', title: 'Network Security Fundamentals', content: '<h2>Network Security Fundamentals</h2><p>Understanding how to protect networks from cyber threats.</p>', order_num: 2 },
    { id: '3', title: 'Cryptography Basics', content: '<h2>Cryptography Basics</h2><p>The art of secure communication and data protection.</p>', order_num: 3 },
    { id: '4', title: 'Ethical Hacking Basics', content: '<h2>Ethical Hacking Basics</h2><p>Think like an attacker to better defend your systems.</p>', order_num: 4 },
    { id: '5', title: 'Final Assessment', content: '<h2>Final Assessment</h2><p>Test your knowledge with our comprehensive assessment.</p><p><a href="/foundation/assessment" class="btn-primary">Start Assessment</a></p>', order_num: 5 },
  ];

  for (const lesson of lessons) {
    await db.run(
      'INSERT OR REPLACE INTO lessons (id, title, content, order_num) VALUES (?, ?, ?, ?)',
      [lesson.id, lesson.title, lesson.content, lesson.order_num]
    );
  }
  console.log('✓ Lessons seeded');

  // Seed assessment questions
  const questions = [
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
    { question: 'What is social engineering?', options: JSON.stringify(['Engineering social media', 'Manipulating people to reveal information', 'Building social networks', 'Social media marketing']), correct_answer: 1 },
  ];

  for (const q of questions) {
    await db.run(
      'INSERT OR REPLACE INTO assessment_questions (question, options, correct_answer) VALUES (?, ?, ?)',
      [q.question, q.options, q.correct_answer]
    );
  }
  console.log('✓ Assessment questions seeded');

  console.log('Database seeding complete!');
  await db.close();
}

seed().catch(console.error);