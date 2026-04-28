import bcrypt from 'bcryptjs';
import { supabase } from '../_lib/supabase.js';
import { signJWT, buildSessionCookie } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }
  body = body || {};

  console.log('DEBUG body type:', typeof req.body, 'parsed:', JSON.stringify(body));

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  if (!email.includes('@') || !email.includes('.') || email.length > 255) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const normalizedEmail = email.toLowerCase();
  const passwordHash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert({ email: normalizedEmail, password_hash: passwordHash })
    .select('id, email')
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    console.error('Register DB error:', error);
    return res.status(500).json({ error: 'Could not create account' });
  }

  const token = await signJWT({ id: data.id, email: data.email });
  res.setHeader('Set-Cookie', buildSessionCookie(token));

  return res.status(201).json({ user: { id: data.id, email: data.email } });
}