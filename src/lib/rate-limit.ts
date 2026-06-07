/**
 * KV-backed rate limiter for Vercel production.
 * Falls back to "always allow" in development (no KV configured).
 *
 * Uses a sliding-window counter: increments a key on every call,
 * sets a TTL on first increment, rejects when count exceeds limit.
 */

function kvAvailable(): boolean {
  return !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;
}

/**
 * @param prefix   Namespace, e.g. "login" or "contact"
 * @param id       Per-caller key, e.g. an IP address
 * @param limit    Max requests allowed in the window
 * @param windowSecs  Window length in seconds
 * @returns true if the request is allowed, false if rate-limited
 */
export async function checkRateLimit(
  prefix: string,
  id: string,
  limit: number,
  windowSecs: number
): Promise<boolean> {
  if (!kvAvailable()) return true; // dev: always allow

  try {
    const { kv } = await import("@vercel/kv");
    const key = `rl:${prefix}:${id}`;
    const count: number = await kv.incr(key);
    if (count === 1) await kv.expire(key, windowSecs);
    return count <= limit;
  } catch {
    return true; // fail open — don't block requests if KV is unavailable
  }
}

/** Extract the best available client IP from a Next.js request. */
export function getClientIp(req: { headers: { get(name: string): string | null } }): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
