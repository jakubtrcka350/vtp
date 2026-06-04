import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { updateWork, deleteWork } from "@/lib/kv";
import type { Work } from "@/lib/types";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthed(req))
    return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });

  const { title, description, tag, images, coverImage, createdAt } = await req.json();

  if (!title || !Array.isArray(images) || images.length === 0 || !coverImage) {
    return NextResponse.json(
      { error: "Název, obrázky a náhledová fotka jsou povinné." },
      { status: 400 }
    );
  }

  const work: Work = {
    id: params.id,
    title: String(title).trim(),
    description: description ? String(description).trim() : "",
    tag: tag ? String(tag).trim() : undefined,
    images: images.map(String),
    coverImage: String(coverImage),
    createdAt: Number(createdAt) || Date.now(),
  };

  await updateWork(work);
  return NextResponse.json(work);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthed(req))
    return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });

  await deleteWork(params.id);
  return NextResponse.json({ ok: true });
}
