import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "vtp_admin";
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSecret(): string {
  return process.env.ADMIN_SECRET ?? "dev-secret-please-change";
}

export function generateToken(): string {
  const timestamp = Date.now().toString();
  const sig = createHmac("sha256", getSecret())
    .update(`auth:${timestamp}`)
    .digest("hex");
  return `${timestamp}.${sig}`;
}

export function verifyToken(token: string): boolean {
  const dot = token.indexOf(".");
  if (dot === -1) return false;

  const timestamp = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  // Check expiry
  if (Date.now() - parseInt(timestamp, 10) > TOKEN_TTL_MS) return false;

  const expectedSig = createHmac("sha256", getSecret())
    .update(`auth:${timestamp}`)
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
  } catch {
    return false;
  }
}

export function verifyPassword(input: string): boolean {
  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminPw) return false;
  try {
    return timingSafeEqual(Buffer.from(input), Buffer.from(adminPw));
  } catch {
    return false;
  }
}

export function isAuthed(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return !!token && verifyToken(token);
}

export { COOKIE_NAME, TOKEN_TTL_MS };
