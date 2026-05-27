import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { getWorks, addWork } from "@/lib/kv";
import type { Work } from "@/lib/types";
import { randomUUID } from "crypto";

function isAuthed(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return !!token && verifyToken(token);
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req))
    return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });

  const works = await getWorks();
  return NextResponse.json(works);
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req))
    return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });

  const { title, description, images, coverImage } = await req.json();

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
    images: images.map(String),
    coverImage: String(coverImage),
    createdAt: Date.now(),
  };

  await addWork(work);
  return NextResponse.json(work, { status: 201 });
}
