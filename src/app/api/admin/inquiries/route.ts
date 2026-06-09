import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getInquiries } from "@/lib/kv";

export async function GET(req: NextRequest) {
  if (!isAuthed(req))
    return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });

  const inquiries = await getInquiries();
  return NextResponse.json(inquiries);
}
