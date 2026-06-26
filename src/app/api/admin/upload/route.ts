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
  try {
    if (!isAuthed(req))
      return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file)
      return NextResponse.json({ error: "Chybí soubor." }, { status: 400 });

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

    if (!blobAvailable()) {
      return NextResponse.json(
        { error: "Nahrávání souborů není nakonfigurováno (chybí BLOB_READ_WRITE_TOKEN)." },
        { status: 503 }
      );
    }

    const { put } = await import("@vercel/blob");
    const blob = await put(`works/${Date.now()}.${ext}`, file, { access: "public" });
    return NextResponse.json({ url: blob.url });

  } catch (err) {
    console.error("[upload] unhandled error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Chyba při nahrávání: ${message}` },
      { status: 500 }
    );
  }
}
