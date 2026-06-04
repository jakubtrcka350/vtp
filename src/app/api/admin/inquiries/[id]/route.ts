import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { markInquiryRead, deleteInquiry } from "@/lib/kv";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthed(req))
    return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });

  const { id } = await params;
  await markInquiryRead(id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthed(req))
    return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });

  const { id } = await params;
  await deleteInquiry(id);
  return NextResponse.json({ ok: true });
}
