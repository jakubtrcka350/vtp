import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { markInquiryRead, deleteInquiry } from "@/lib/kv";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthed(req))
    return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });

  await markInquiryRead(params.id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthed(req))
    return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });

  await deleteInquiry(params.id);
  return NextResponse.json({ ok: true });
}
