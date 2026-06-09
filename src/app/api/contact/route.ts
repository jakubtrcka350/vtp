import { NextRequest, NextResponse } from "next/server";
import { addInquiry } from "@/lib/kv";
import type { Inquiry } from "@/lib/types";
import { randomUUID } from "crypto";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendConfirmationEmail, sendOwnerNotification } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  name:    100,
  email:   254,
  phone:    30,
  message: 2000,
} as const;

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 submissions per IP per 10 minutes
    const ip = getClientIp(req);
    const allowed = await checkRateLimit("contact", ip, 5, 600);
    if (!allowed) {
      return NextResponse.json(
        { error: "Příliš mnoho zpráv. Zkuste to prosím za chvíli." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, phone, message } = body;

    // Required field presence
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Chybí povinné pole." }, { status: 400 });
    }

    // Type coercion + trim
    const cleanName    = String(name).trim();
    const cleanEmail   = String(email).trim().toLowerCase();
    const cleanPhone   = phone ? String(phone).trim() : undefined;
    const cleanMessage = String(message).trim();

    // Length limits
    if (cleanName.length    > LIMITS.name)    return NextResponse.json({ error: `Jméno je příliš dlouhé (max ${LIMITS.name} znaků).` },    { status: 400 });
    if (cleanEmail.length   > LIMITS.email)   return NextResponse.json({ error: "E-mail je příliš dlouhý." },                               { status: 400 });
    if (cleanMessage.length > LIMITS.message) return NextResponse.json({ error: `Zpráva je příliš dlouhá (max ${LIMITS.message} znaků).` }, { status: 400 });
    if (cleanPhone && cleanPhone.length > LIMITS.phone) return NextResponse.json({ error: "Telefon je příliš dlouhý." }, { status: 400 });

    // Email format
    if (!EMAIL_RE.test(cleanEmail)) {
      return NextResponse.json({ error: "Neplatná e-mailová adresa." }, { status: 400 });
    }

    const inquiry: Inquiry = {
      id: randomUUID(),
      name:    cleanName,
      email:   cleanEmail,
      phone:   cleanPhone,
      message: cleanMessage,
      createdAt: Date.now(),
      read: false,
    };

    // Save to database
    await addInquiry(inquiry);

    // Send emails — fire-and-forget so a mail failure never blocks the response
    Promise.all([
      sendConfirmationEmail(inquiry),
      sendOwnerNotification(inquiry),
    ]).catch((err) => console.error("[contact] email error:", err));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] error:", err);
    return NextResponse.json({ error: "Interní chyba serveru." }, { status: 500 });
  }
}
