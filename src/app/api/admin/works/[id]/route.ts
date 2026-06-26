import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { updateWork, deleteWork } from "@/lib/kv";
import type { Work } from "@/lib/types";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthed(req))
    return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });

  const { id } = await params;
  const { title, description, tag, images, coverImage, createdAt } = await req.json();

  const imageList: string[] = Array.isArray(images) ? images.map(String) : [];

  if (!title || imageList.length === 0 || !coverImage) {
    return NextResponse.json(
      { error: "Název, obrázky a náhledová fotka jsou povinné." },
      { status: 400 }
    );
  }

  // coverImage must be one of the submitted images
  if (!imageList.includes(String(coverImage))) {
    return NextResponse.json(
      { error: "Náhledová fotka musí být jedním z nahraných obrázků." },
      { status: 400 }
    );
  }

  const work: Work = {
    id,
    title: String(title).trim(),
    description: description ? String(description).trim() : "",
    tag: tag ? String(tag).trim() : undefined,
    images: imageList,
    coverImage: String(coverImage),
    createdAt: Number(createdAt) || Date.now(),
  };

  try {
    await updateWork(work);
  } catch (err) {
    console.error("[works] updateWork error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Chyba při ukládání: ${message}` }, { status: 500 });
  }
  return NextResponse.json(work);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthed(req))
    return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });

  const { id } = await params;
  try {
    await deleteWork(id);
  } catch (err) {
    console.error("[works] deleteWork error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Chyba při mazání: ${message}` }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
