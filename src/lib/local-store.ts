/**
 * Local file-based store used when Vercel KV env vars aren't configured.
 * Persists data to .local-db.json in the project root.
 * This file is only used in development — never in production.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import type { Work, Inquiry } from "./types";

const DB_PATH = join(process.cwd(), ".local-db.json");

interface LocalDB {
  works: Work[];
  inquiries: Inquiry[];
}

function readDB(): LocalDB {
  if (!existsSync(DB_PATH)) return { works: [], inquiries: [] };
  try {
    return JSON.parse(readFileSync(DB_PATH, "utf-8"));
  } catch {
    return { works: [], inquiries: [] };
  }
}

function writeDB(db: LocalDB) {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

// ─── Works ────────────────────────────────────────────────────────────────────

export function localGetWorks(): Work[] {
  return readDB().works.sort((a, b) => b.createdAt - a.createdAt);
}

export function localAddWork(work: Work): void {
  const db = readDB();
  db.works.push(work);
  writeDB(db);
}

export function localUpdateWork(work: Work): void {
  const db = readDB();
  const idx = db.works.findIndex((w) => w.id === work.id);
  if (idx !== -1) db.works[idx] = work;
  writeDB(db);
}

export function localDeleteWork(id: string): void {
  const db = readDB();
  db.works = db.works.filter((w) => w.id !== id);
  writeDB(db);
}

// ─── Inquiries ────────────────────────────────────────────────────────────────

export function localGetInquiries(): Inquiry[] {
  return readDB().inquiries.sort((a, b) => b.createdAt - a.createdAt);
}

export function localAddInquiry(inquiry: Inquiry): void {
  const db = readDB();
  db.inquiries.push(inquiry);
  writeDB(db);
}

export function localMarkInquiryRead(id: string): void {
  const db = readDB();
  const i = db.inquiries.find((x) => x.id === id);
  if (i) i.read = true;
  writeDB(db);
}

export function localDeleteInquiry(id: string): void {
  const db = readDB();
  db.inquiries = db.inquiries.filter((i) => i.id !== id);
  writeDB(db);
}
