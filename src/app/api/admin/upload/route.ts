import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";

function blobAvailable(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req))
    return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file)
    return NextResponse.json({ error: "Chybí soubor." }, { status: 400 });

  if (!file.type.startsWith("image/"))
    return NextResponse.json(
      { error: "Povoleny jsou pouze obrázky." },
      { status: 400 }
    );

  if (file.size > 10 * 1024 * 1024)
    return NextResponse.json(
      { error: "Maximální velikost souboru je 10 MB." },
      { status: 400 }
    );

  // ── Production: Vercel Blob ───────────────────────────────────────────────
  if (blobAvailable()) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`works/${Date.now()}-${file.name}`, file, {
      access: "public",
    });
    return NextResponse.json({ url: blob.url });
  }

  // ── Development: save to public/uploads/ ─────────────────────────────────
  const { writeFile, mkdir } = await import("fs/promises");
  const { join } = await import("path");

  const uploadsDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();
  await writeFile(join(uploadsDir, filename), Buffer.from(bytes));

  return NextResponse.json({ url: `/uploads/${filename}` });
}
