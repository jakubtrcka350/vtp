import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, generateToken, COOKIE_NAME, TOKEN_TTL_MS } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Nesprávné heslo." }, { status: 401 });
  }

  const token = generateToken();

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_TTL_MS / 1000,
    path: "/",
  });

  return res;
}
