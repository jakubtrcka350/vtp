import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getWorks, addWork } from "@/lib/kv";
import type { Work } from "@/lib/types";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  if (!isAuthed(req))
    return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });

  const works = await getWorks();
  return NextResponse.json(works);
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req))
    return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });

  const { title, description, tag, images, coverImage } = await req.json();

  const imageList: string[] = Array.isArray(images) ? images.map(String) : [];

  if (!title || imageList.length === 0 || !coverImage) {
    return NextResponse.json(
      { error: "Název, obrázky a náhledová fotka jsou povinné." },
      { status: 400 }
    );
  }

  // coverImage must be one of the submitted images (prevents orphaned references)
  if (!imageList.includes(String(coverImage))) {
    return NextResponse.json(
      { error: "Náhledová fotka musí být jedním z nahraných obrázků." },
      { status: 400 }
    );
  }

  const work: Work = {
    id: randomUUID(),
    title: String(title).trim(),
    description: description ? String(description).trim() : "",
    tag: tag ? String(tag).trim() : undefined,
    images: imageList,
    coverImage: String(coverImage),
    createdAt: Date.now(),
  };

  try {
    await addWork(work);
  } catch (err) {
    console.error("[works] addWork error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Chyba při ukládání: ${message}` }, { status: 500 });
  }
  return NextResponse.json(work, { status: 201 });
}
