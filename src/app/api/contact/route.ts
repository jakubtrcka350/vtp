import { NextRequest, NextResponse } from "next/server";
import { addInquiry } from "@/lib/kv";
import type { Inquiry } from "@/lib/types";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Chybí povinné pole." },
        { status: 400 }
      );
    }

    const inquiry: Inquiry = {
      id: randomUUID(),
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : undefined,
      message: String(message).trim(),
      createdAt: Date.now(),
      read: false,
    };

    await addInquiry(inquiry);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] error:", err);
    return NextResponse.json(
      { error: "Interní chyba serveru." },
      { status: 500 }
    );
  }
}
