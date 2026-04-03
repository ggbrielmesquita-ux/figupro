import { SignJWT, jwtVerify } from 'jose';
import { JWTPayload } from '@/types';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'figurinhas-pro-secret-deve-trocar-em-producao'
);

export async function signJWT(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}
