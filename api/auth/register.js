import bcrypt from 'bcryptjs';
import { supabase } from '../_lib/supabase.js';
import { signJWT, buildSessionCookie } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body || {};

  console.log('DEBUG body:', JSON.stringify(req.body), 'email:', JSON.stringify(email), 'password:', JSON.stringify(password));

  // Basic input validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input format' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  if (email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Hash the password (bcrypt with salt rounds = 10)
  const passwordHash = await bcrypt.hash(password, 10);

  // Insert user. Supabase uses parameterized queries, so this is SQL-injection safe
  // even though `normalizedEmail` is user input.
  const { data, error } = await supabase
    .from('users')
    .insert({ email: normalizedEmail, password_hash: passwordHash })
    .select('id, email')
    .single();

  if (error) {
    // Postgres error code 23505 = unique constraint violation (email already exists)
    if (error.code === '23505') {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    console.error('Register DB error:', error);
    return res.status(500).json({ error: 'Could not create account' });
  }

  // Auto-login: issue a session token immediately on successful registration
  const token = await signJWT({ id: data.id, email: data.email });
  res.setHeader('Set-Cookie', buildSessionCookie(token));

  return res.status(201).json({ user: { id: data.id, email: data.email } });
}