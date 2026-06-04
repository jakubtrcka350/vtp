import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "vtp_admin";
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_SECRET environment variable must be set in production");
    }
    return "dev-secret-please-change";
  }
  return secret;
}

// Hash both sides to a fixed-length digest before comparing.
// Prevents the length-mismatch throw from timingSafeEqual leaking
// information about the expected value via the exception path.
function safeEqual(a: string, b: string): boolean {
  const ha = createHmac("sha256", "cmp").update(a).digest();
  const hb = createHmac("sha256", "cmp").update(b).digest();
  return timingSafeEqual(ha, hb);
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

  // ① Verify HMAC first — prevents expiry oracle: attacker can't probe
  //    whether a timestamp is "within window" without a valid signature.
  const expectedSig = createHmac("sha256", getSecret())
    .update(`auth:${timestamp}`)
    .digest("hex");

  if (!safeEqual(sig, expectedSig)) return false;

  // ② Then check expiry
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts) || Date.now() - ts > TOKEN_TTL_MS) return false;

  return true;
}

export function verifyPassword(input: string): boolean {
  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminPw) return false;
  return safeEqual(input, adminPw);
}

export function isAuthed(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return !!token && verifyToken(token);
}

export { COOKIE_NAME, TOKEN_TTL_MS };
