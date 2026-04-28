import bcrypt from 'bcryptjs';
import { supabase } from '../_lib/supabase.js';
import { signJWT, buildSessionCookie } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed', version: 'v3-marker' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON', version: 'v3-marker' });
    }
  }
  body = body || {};

  const rawEmail = body.email;
  const rawPassword = body.password;

  return res.status(200).json({
    version: 'v3-marker',
    bodyType: typeof req.body,
    receivedBody: body,
    rawEmail: rawEmail,
    rawEmailType: typeof rawEmail,
  });
}
