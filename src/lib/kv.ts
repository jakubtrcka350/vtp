import type { Work, Inquiry } from "./types";
import {
  localGetWorks,
  localAddWork,
  localUpdateWork,
  localDeleteWork,
  localGetInquiries,
  localAddInquiry,
  localMarkInquiryRead,
  localDeleteInquiry,
} from "./local-store";

// Namespace prefix — keeps our keys isolated when sharing a Redis instance
// with other projects.
const NS = "vtp";

function kvAvailable(): boolean {
  return !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;
}

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
  if (!kvAvailable()) return localGetWorks();

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
  } catch {
    return localGetWorks();
  }
}

export async function addWork(work: Work): Promise<void> {
  if (!kvAvailable()) return localAddWork(work);

  const kv = await getKV();
  await kv.hset(`${NS}:work:${work.id}`, serializeWork(work));
  await kv.sadd(`${NS}:works`, work.id);
}

export async function updateWork(work: Work): Promise<void> {
  if (!kvAvailable()) return localUpdateWork(work);

  const kv = await getKV();
  await kv.hset(`${NS}:work:${work.id}`, serializeWork(work));
}

export async function deleteWork(id: string): Promise<void> {
  if (!kvAvailable()) return localDeleteWork(id);

  const kv = await getKV();
  await kv.del(`${NS}:work:${id}`);
  await kv.srem(`${NS}:works`, id);
}

// ─── Inquiries ────────────────────────────────────────────────────────────────

export async function getInquiries(): Promise<Inquiry[]> {
  if (!kvAvailable()) return localGetInquiries();

  try {
    const kv = await getKV();
    const ids: string[] = await kv.smembers(`${NS}:inquiries`);
    if (!ids || ids.length === 0) return [];

    const items = await Promise.all(
      ids.map((id: string) => kv.hgetall(`${NS}:inquiry:${id}`))
    );

    return (items as (Inquiry | null)[])
      .filter((i): i is Inquiry => i !== null)
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return localGetInquiries();
  }
}

export async function addInquiry(inquiry: Inquiry): Promise<void> {
  if (!kvAvailable()) return localAddInquiry(inquiry);

  const kv = await getKV();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await kv.hset(`${NS}:inquiry:${inquiry.id}`, inquiry as any);
  await kv.sadd(`${NS}:inquiries`, inquiry.id);
}

export async function markInquiryRead(id: string): Promise<void> {
  if (!kvAvailable()) return localMarkInquiryRead(id);

  const kv = await getKV();
  await kv.hset(`${NS}:inquiry:${id}`, { read: true });
}

export async function deleteInquiry(id: string): Promise<void> {
  if (!kvAvailable()) return localDeleteInquiry(id);

  const kv = await getKV();
  await kv.del(`${NS}:inquiry:${id}`);
  await kv.srem(`${NS}:inquiries`, id);
}
