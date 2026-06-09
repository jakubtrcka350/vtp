import type { Work } from "./types";

// Namespace prefix — keeps our keys isolated when sharing a Redis instance
// with other projects.
const NS = "vtp";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getKV(): Promise<any> {
  const { kv } = await import("@vercel/kv");
  return kv;
}

// Redis hash values are strings — serialize the images array
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeWork(work: Work): Record<string, any> {
  return { ...work, images: JSON.stringify(work.images) };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deserializeWork(raw: Record<string, any>): Work {
  return {
    ...raw,
    images:
      typeof raw.images === "string"
        ? JSON.parse(raw.images)
        : (raw.images ?? []),
  } as Work;
}

// ─── Works ───────────────────────────────────────────────────────────────────

export async function getWorks(): Promise<Work[]> {
  try {
    const kv = await getKV();
    const ids: string[] = await kv.smembers(`${NS}:works`);
    if (!ids || ids.length === 0) return [];

    const raws = await Promise.all(
      ids.map((id: string) => kv.hgetall(`${NS}:work:${id}`))
    );

    return (raws as (Record<string, unknown> | null)[])
      .filter((r): r is Record<string, unknown> => r !== null)
      .map(deserializeWork)
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) {
    console.error("[kv] getWorks error:", err);
    return [];
  }
}

export async function addWork(work: Work): Promise<void> {
  const kv = await getKV();
  await kv.hset(`${NS}:work:${work.id}`, serializeWork(work));
  await kv.sadd(`${NS}:works`, work.id);
}

export async function updateWork(work: Work): Promise<void> {
  const kv = await getKV();
  await kv.hset(`${NS}:work:${work.id}`, serializeWork(work));
}

export async function deleteWork(id: string): Promise<void> {
  const kv = await getKV();
  await kv.del(`${NS}:work:${id}`);
  await kv.srem(`${NS}:works`, id);
}
