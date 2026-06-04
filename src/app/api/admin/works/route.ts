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

  if (!title || !Array.isArray(images) || images.length === 0 || !coverImage) {
    return NextResponse.json(
      { error: "Název, obrázky a náhledová fotka jsou povinné." },
      { status: 400 }
    );
  }

  const work: Work = {
    id: randomUUID(),
    title: String(title).trim(),
    description: description ? String(description).trim() : "",
    tag: tag ? String(tag).trim() : undefined,
    images: images.map(String),
    coverImage: String(coverImage),
    createdAt: Date.now(),
  };

  await addWork(work);
  return NextResponse.json(work, { status: 201 });
}
