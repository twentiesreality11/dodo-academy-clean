import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const sql = neon(process.env.POSTGRES_URL);

export async function createUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4();
  
  await sql`
    INSERT INTO users (id, name, email, password)
    VALUES (${userId}, ${name}, ${email}, ${hashedPassword})
  `;
  
  return { id: userId, name, email };
}

export async function getUserByEmail(email) {
  const users = await sql`SELECT * FROM users WHERE email = ${email}`;
  return users[0] || null;
}

export async function getUserById(id) {
  const users = await sql`SELECT id, name, email FROM users WHERE id = ${id}`;
  return users[0] || null;
}

export async function verifyUser(email, password) {
  const user = await getUserByEmail(email);
  if (!user) return null;
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  
  return user;
}

export async function hasUserPaid(userId) {
  const payments = await sql`
    SELECT status FROM payments 
    WHERE user_id = ${userId} AND status = 'success' AND course_type = 'foundation'
    LIMIT 1
  `;
  return payments.length > 0;
}

export async function createPayment(userId, reference, amount) {
  await sql`
    INSERT INTO payments (id, user_id, reference, amount, status, course_type)
    VALUES (${uuidv4()}, ${userId}, ${reference}, ${amount}, 'pending', 'foundation')
  `;
}

export async function updatePaymentStatus(reference, status) {
  await sql`
    UPDATE payments SET status = ${status} WHERE reference = ${reference}
    RETURNING user_id
  `;
}

export async function getLessons() {
  return await sql`SELECT * FROM lessons ORDER BY order_num`;
}

export async function getLessonById(id) {
  const lessons = await sql`SELECT * FROM lessons WHERE id = ${id}`;
  return lessons[0] || null;
}

export async function getProgress(userId) {
  const progress = await sql`
    SELECT lesson_id, completed FROM progress WHERE user_id = ${userId}
  `;
  return progress;
}

export async function markLessonComplete(userId, lessonId) {
  await sql`
    INSERT INTO progress (user_id, lesson_id, completed, completed_at)
    VALUES (${userId}, ${lessonId}, true, NOW())
    ON CONFLICT (user_id, lesson_id) DO UPDATE SET completed = true, completed_at = NOW()
  `;
}

export async function getAssessmentQuestions() {
  return await sql`SELECT * FROM assessment_questions ORDER BY id`;
}

export async function saveAssessmentAttempt(userId, score, passed) {
  await sql`
    INSERT INTO assessment_attempts (user_id, score, passed)
    VALUES (${userId}, ${score}, ${passed})
  `;
}

export async function hasPassedAssessment(userId) {
  const attempts = await sql`
    SELECT passed FROM assessment_attempts WHERE user_id = ${userId} AND passed = true LIMIT 1
  `;
  return attempts.length > 0;
}