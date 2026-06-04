import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg":  "jpg",
  "image/png":  "png",
  "image/webp": "webp",
  "image/gif":  "gif",
  "image/avif": "avif",
};

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

  // Validate MIME type against allowlist — never trust the client-supplied filename
  const ext = MIME_TO_EXT[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Povolené formáty: JPEG, PNG, WebP, GIF, AVIF." },
      { status: 400 }
    );
  }

  if (file.size > 10 * 1024 * 1024)
    return NextResponse.json(
      { error: "Maximální velikost souboru je 10 MB." },
      { status: 400 }
    );

  // ── Production: Vercel Blob ───────────────────────────────────────────────
  if (blobAvailable()) {
    const { put } = await import("@vercel/blob");
    // Safe filename built from timestamp + server-validated extension only
    const blob = await put(`works/${Date.now()}.${ext}`, file, {
      access: "public",
    });
    return NextResponse.json({ url: blob.url });
  }

  // ── Development: save to public/uploads/ ─────────────────────────────────
  const { writeFile, mkdir } = await import("fs/promises");
  const { join } = await import("path");

  const uploadsDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const filename = `${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();
  await writeFile(join(uploadsDir, filename), Buffer.from(bytes));

  return NextResponse.json({ url: `/uploads/${filename}` });
}
