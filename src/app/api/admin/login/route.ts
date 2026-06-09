import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, generateToken, COOKIE_NAME, TOKEN_TTL_MS } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limit: 10 attempts per IP per 60 seconds
  const ip = getClientIp(req);
  const allowed = await checkRateLimit("login", ip, 10, 60);
  if (!allowed) {
    return NextResponse.json(
      { error: "Příliš mnoho pokusů. Zkuste to znovu za chvíli." },
      { status: 429 }
    );
  }

  const { password } = await req.json();

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Nesprávné heslo." }, { status: 401 });
  }

  const token = generateToken();

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: TOKEN_TTL_MS / 1000,
    path: "/",
  });

  return res;
}
