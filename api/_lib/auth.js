import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const SESSION_DURATION_SECONDS = 60 * 60; // 1 hour

/**
 * Sign a JWT containing the user payload.
 * Used after a successful login to create a session token.
 */
export async function signJWT(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secret);
}

/**
 * Verify a JWT from the session cookie.
 * Returns the decoded payload if valid, or null if invalid/expired.
 */
export async function verifyJWT(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

/**
 * Build the Set-Cookie header value for the session cookie.
 * Sets HttpOnly + Secure + SameSite=Strict — the secure session pattern.
 */
export function buildSessionCookie(token) {
  return [
    `session=${token}`,
    'HttpOnly',          // JS can't read this cookie (XSS protection)
    'Secure',            // Only sent over HTTPS
    'SameSite=Strict',   // Not sent on cross-site requests (CSRF protection)
    'Path=/',
    `Max-Age=${SESSION_DURATION_SECONDS}`,
  ].join('; ');
}

/**
 * Build a Set-Cookie header that immediately clears the session cookie.
 * Used for logout.
 */
export function buildClearCookie() {
  return 'session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0';
}

/**
 * Parse cookies from a request header into an object.
 */
export function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [key, ...rest] = c.trim().split('=');
      return [key, rest.join('=')];
    })
  );
}

/**
 * Read the session JWT from the request and return the user payload.
 * Use this in protected routes to check authentication.
 */
export async function getSessionUser(req) {
  const cookies = parseCookies(req.headers.cookie || req.headers.Cookie);
  return await verifyJWT(cookies.session);
}