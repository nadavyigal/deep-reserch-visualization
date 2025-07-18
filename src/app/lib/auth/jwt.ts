import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export interface JWTPayload {
  sub: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export async function signJWT(payload: JWTPayload): Promise<string> {
  try {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 24 * 7; // 7 days

    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setExpirationTime(exp)
      .setIssuedAt(iat)
      .setNotBefore(iat)
      .sign(JWT_SECRET);
  } catch (error) {
    console.error('Error signing JWT:', error);
    throw new Error('Failed to sign JWT');
  }
}

export async function verifyJWT(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    // Cast to unknown first, then to our custom type
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('Error verifying JWT:', error);
    throw new Error('Invalid token');
  }
}

export async function getJWTFromCookies(req?: NextRequest): Promise<string | null> {
  if (req) {
    // For middleware and API routes
    const token = req.cookies.get('auth-token')?.value;
    return token || null;
  }
  
  // For server components
  const cookieStore = cookies();
  // Await the cookies promise
  const token = (await cookieStore).get('auth-token')?.value;
  return token || null;
} 