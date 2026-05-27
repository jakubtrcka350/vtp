"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import type { Work } from "@/lib/types";

interface ImageItem {
  /** Temporary local preview URL (revoced on cleanup) */
  preview: string;
  file: File;
  /** Is this the selected cover/thumbnail? */
  isCover: boolean;
}

export default function WorksManager() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ title: "", description: "" });
  const [images, setImages] = useState<ImageItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const fetchWorks = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/works");
    if (res.ok) setWorks(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  // Revoke object URLs to avoid memory leaks
  useEffect(() => {
    return () => images.forEach((img) => URL.revokeObjectURL(img.preview));
  }, [images]);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems: ImageItem[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file, i) => ({
        file,
        preview: URL.createObjectURL(file),
        // First batch of images: auto-select first as cover
        isCover: images.length === 0 && i === 0,
      }));
    setImages((prev) => {
      // If there was already a cover keep it; if not, first new image becomes cover
      const hadCover = prev.some((p) => p.isCover);
      return [
        ...prev,
        ...newItems.map((item, i) => ({
          ...item,
          isCover: !hadCover && i === 0 ? true : item.isCover,
        })),
      ];
    });
  };

  const setCover = useCallback((idx: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isCover: i === idx }))
    );
  }, []);

  const removeImage = useCallback((idx: number) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      // If we removed the cover, auto-assign first remaining
      if (prev[idx].isCover && next.length > 0) {
        next[0] = { ...next[0], isCover: true };
      }
      return next;
    });
  }, []);

  const resetForm = () => {
    setForm({ title: "", description: "" });
    setImages([]);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError("Přidejte alespoň jednu fotografii.");
      return;
    }
    if (!images.some((img) => img.isCover)) {
      setError("Vyberte náhledovou fotografii.");
      return;
    }
    setError("");
    setSubmitting(true);

    // Upload all images one by one
    const urls: string[] = [];
    for (const item of images) {
      const fd = new FormData();
      fd.append("file", item.file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Chyba při nahrávání obrázku.");
        setSubmitting(false);
        return;
      }
      const { url } = await res.json();
      urls.push(url);
    }

    // coverImage is the URL at the same index as the isCover image
    const coverIdx = images.findIndex((img) => img.isCover);
    const coverImage = urls[coverIdx];

    // Save work
    const saveRes = await fetch("/api/admin/works", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, images: urls, coverImage }),
    });

    if (!saveRes.ok) {
      const d = await saveRes.json();
      setError(d.error || "Chyba při ukládání.");
      setSubmitting(false);
      return;
    }

    resetForm();
    await fetchWorks();
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Smazat tuto realizaci?")) return;
    await fetch(`/api/admin/works/${id}`, { method: "DELETE" });
    setWorks((ws) => ws.filter((w) => w.id !== id));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#f0f0f0] mb-8">
        Naše práce
      </h2>

      {/* ── Add form ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#111111] border border-[#262626] p-6 mb-10">
        <h3 className="text-xs font-medium text-[#555555] mb-5 uppercase tracking-widest">
          Přidat realizaci
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Photo grid */}
          <div>
            <label className="block text-xs text-[#555555] mb-2 tracking-wide uppercase">
              Fotografie *
              <span className="normal-case ml-2 text-[#333333] tracking-normal">
                — klikněte na foto pro výběr náhledu
              </span>
            </label>

            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={img.preview} className="relative group">
                  {/* Thumbnail */}
                  <div
                    onClick={() => setCover(i)}
                    className={`w-28 h-20 relative cursor-pointer overflow-hidden border-2 transition-all duration-200 ${
                      img.isCover
                        ? "border-white"
                        : "border-[#2a2a2a] hover:border-[#555555]"
                    }`}
                    title={img.isCover ? "Náhledová fotka" : "Klikněte pro nastavení jako náhled"}
                  >
                    <Image
                      src={img.preview}
                      alt={`Foto ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                    {/* Cover badge */}
                    {img.isCover && (
                      <div className="absolute bottom-0 left-0 right-0 bg-white text-black text-[9px] font-bold text-center py-0.5 tracking-wider uppercase">
                        Náhled
                      </div>
                    )}
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-[#1a1a1a] border border-[#333333] text-[#888888] hover:text-red-400 hover:border-red-400 flex items-center justify-center text-xs transition-colors opacity-0 group-hover:opacity-100"
                    title="Odebrat"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Add photos button */}
              <label className="w-28 h-20 border border-dashed border-[#2a2a2a] hover:border-[#c8a96e] cursor-pointer flex flex-col items-center justify-center gap-1 text-[#333333] hover:text-[#c8a96e] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-[10px] tracking-wide">Přidat foto</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    addFiles(e.target.files);
                    // Reset so same file can be re-added
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            {images.length > 0 && (
              <p className="text-[#444444] text-xs mt-2">
                {images.length} {images.length === 1 ? "fotografie" : images.length < 5 ? "fotografie" : "fotografií"} — bílý rámeček = náhledová fotka na hlavní stránce
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs text-[#555555] mb-2 tracking-wide uppercase">
              Název *
            </label>
            <input
              type="text"
              required
              className="input-field max-w-md"
              placeholder="Rekonstrukce koupelny..."
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-[#555555] mb-2 tracking-wide uppercase">
              Popis
            </label>
            <textarea
              rows={5}
              className="input-field max-w-xl resize-y"
              placeholder="Detailní popis realizace — rozsah práce, použité materiály, délka projektu..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary self-start disabled:opacity-50"
            >
              {submitting ? "Ukládám..." : "Přidat realizaci"}
            </button>
            {images.length > 0 && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-[#555555] hover:text-[#888888] transition-colors self-center"
              >
                Zrušit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Existing works ────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="text-[#555555] text-sm py-8">Načítám...</div>
      ) : works.length === 0 ? (
        <div className="text-[#333333] text-sm py-8 text-center border border-dashed border-[#1a1a1a]">
          Zatím žádné realizace.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {works.map((w) => (
            <div key={w.id} className="bg-[#111111] border border-[#262626] flex gap-4 p-4">
              {/* Cover image */}
              <div className="w-24 h-20 relative flex-shrink-0 bg-[#1c1c1c] overflow-hidden border border-[#1f1f1f]">
                <Image
                  src={w.coverImage}
                  alt={w.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[#f0f0f0] text-sm">{w.title}</div>
                <div className="text-[#444444] text-xs mt-1">
                  {w.images.length} {w.images.length === 1 ? "fotografie" : w.images.length < 5 ? "fotografie" : "fotografií"}
                </div>
                {w.description && (
                  <div className="text-[#555555] text-xs mt-1 line-clamp-2">
                    {w.description}
                  </div>
                )}
                <div className="text-[#333333] text-xs mt-2">
                  {new Date(w.createdAt).toLocaleDateString("cs-CZ")}
                </div>
              </div>
              <button
                onClick={() => handleDelete(w.id)}
                className="text-[#333333] hover:text-red-400 transition-colors flex-shrink-0 self-start"
                title="Smazat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
