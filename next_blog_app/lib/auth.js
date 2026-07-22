import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_NAME = 'fm_token';

/**
 * Sign a JWT for the given user id.
 */
export function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Set the auth cookie in a Next.js Route Handler response.
 * Call this on the cookieStore returned by next/headers.
 */
export async function setAuthCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/**
 * Clear the auth cookie.
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

/**
 * Read and verify the JWT from the request cookie.
 * Returns the decoded payload { sub: userId } or null if invalid.
 */
export async function verifyAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Middleware helper — call inside a Route Handler.
 * Returns { userId } if authenticated, or a 401 Response if not.
 */
export async function requireAuth() {
  const payload = await verifyAuth();
  if (!payload) {
    return {
      userId: null,
      error: Response.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  return { userId: payload.sub, error: null };
}
