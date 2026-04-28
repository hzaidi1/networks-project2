import bcrypt from 'bcryptjs';
import { supabase } from '../_lib/supabase.js';
import { signJWT, buildSessionCookie } from '../_lib/auth.js';

// A bcrypt hash of an unguessable random string. Used so that login attempts
// for non-existent emails take the same time as real ones (prevents user enumeration via timing).
const DUMMY_HASH = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8h6OVnG8h7GgJqCrWeKxOyq6q.qqjW';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body || {};

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Look up the user (parameterized query, SQL-injection safe)
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, password_hash')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (error) {
    console.error('Login DB error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }

  // Compare against either the real hash or the dummy hash. Constant-time-ish.
  const hashToCompare = user?.password_hash || DUMMY_HASH;
  const valid = await bcrypt.compare(password, hashToCompare);

  if (!user || !valid) {
    // Generic error message — don't reveal whether the email exists
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Log the successful attempt (for monitoring evidence in the report)
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  await supabase.from('login_attempts').insert({
    ip,
    email: normalizedEmail,
    success: true,
  });

  // Issue session cookie
  const token = await signJWT({ id: user.id, email: user.email });
  res.setHeader('Set-Cookie', buildSessionCookie(token));

  return res.status(200).json({ user: { id: user.id, email: user.email } });
}