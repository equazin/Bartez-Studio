import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const ADMIN_COOKIE_NAME = "admin_session";
const ISSUER = "bartez-admin";
const AUDIENCE = "bartez-content-management";
export type AdminSession = JWTPayload & { username: string };

function jwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_JWT_SECRET debe tener al menos 32 caracteres.");
  return new TextEncoder().encode(secret);
}

export async function signToken(username: string) {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(username)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("6h")
    .sign(jwtSecret());
}

export async function verifyToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, jwtSecret(), { algorithms: ["HS256"], issuer: ISSUER, audience: AUDIENCE });
    if (typeof payload.username !== "string" || payload.sub !== payload.username) return null;
    return payload as AdminSession;
  } catch {
    return null;
  }
}

export function tokenFromCookieHeader(header: string | null) {
  if (!header) return null;
  const prefix = `${ADMIN_COOKIE_NAME}=`;
  const item = header.split(";").map((part) => part.trim()).find((part) => part.startsWith(prefix));
  return item ? decodeURIComponent(item.slice(prefix.length)) : null;
}
