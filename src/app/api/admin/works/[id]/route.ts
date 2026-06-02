import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { deleteWork } from "@/lib/kv";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthed(req))
    return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });

  await deleteWork(params.id);
  return NextResponse.json({ ok: true });
}
