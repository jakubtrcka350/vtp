import { NextResponse } from "next/server";
import { getWorks } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  const works = await getWorks();
  return NextResponse.json(works);
}
