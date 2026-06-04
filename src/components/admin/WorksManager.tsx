"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import type { Work } from "@/lib/types";
import WorkModal from "@/components/WorkModal";

interface ImageItem {
  preview: string;     // blob URL for new uploads, actual URL for existing
  file?: File;         // only present for new (not-yet-uploaded) images
  isCover: boolean;
  isExisting: boolean; // true = already in storage, no upload needed
}

type Mode = "add" | "edit";

// ── Skeleton row shown while works are loading ─────────────────────────────
function SkeletonRow() {
  return (
    <div className="bg-[#1a1a1a] border border-[#2e2e2e] flex gap-4 p-4 animate-pulse">
      <div className="w-24 h-20 bg-[#262626] flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2.5 py-1">
        <div className="h-3 bg-[#2a2a2a] rounded w-2/5" />
        <div className="h-2.5 bg-[#242424] rounded w-1/5" />
        <div className="h-2.5 bg-[#242424] rounded w-3/5" />
      </div>
    </div>
  );
}

export default function WorksManager() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState<Mode>("add");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", tag: "" });
  const [images, setImages] = useState<ImageItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [previewWork, setPreviewWork] = useState<Work | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Auto-dismiss success banner
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(t);
  }, [success]);

  const fetchWorks = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/works");
    if (res.ok) setWorks(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchWorks(); }, []);

  // Revoke blob URLs on unmount/change to avoid memory leaks
  useEffect(() => {
    return () => images.forEach((img) => {
      if (!img.isExisting) URL.revokeObjectURL(img.preview);
    });
  }, [images]);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isCover: false,
        isExisting: false,
      }));
    if (newItems.length === 0) return;
    setImages((prev) => {
      const hadCover = prev.some((p) => p.isCover);
      return [
        ...prev,
        ...newItems.map((item, i) => ({ ...item, isCover: !hadCover && i === 0 })),
      ];
    });
  };

  const setCover = useCallback((idx: number) => {
    setImages((prev) => prev.map((img, i) => ({ ...img, isCover: i === idx })));
  }, []);

  const removeImage = useCallback((idx: number) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      if (prev[idx].isCover && next.length > 0) next[0] = { ...next[0], isCover: true };
      return next;
    });
  }, []);

  const isFormDirty = form.title !== "" || form.description !== "" || form.tag !== "" || images.length > 0;

  const resetForm = () => {
    setMode("add");
    setEditId(null);
    setForm({ title: "", description: "", tag: "" });
    setImages([]);
    setError("");
    setUploadProgress({ current: 0, total: 0 });
    if (fileRef.current) fileRef.current.value = "";
  };

  const startEdit = (work: Work) => {
    setMode("edit");
    setEditId(work.id);
    setForm({
      title: work.title,
      description: work.description,
      tag: work.tag ?? "",
    });
    setImages(
      work.images.map((url) => ({
        preview: url,
        isCover: url === work.coverImage,
        isExisting: true,
      }))
    );
    setError("");
    setSuccess("");
    // Scroll form into view
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const buildPreviewWork = (): Work => {
    const coverImg = images.find((img) => img.isCover)?.preview ?? images[0]?.preview ?? "";
    return {
      id: editId ?? "preview",
      title: form.title || "Název realizace",
      description: form.description,
      tag: form.tag || undefined,
      images: images.map((img) => img.preview),
      coverImage: coverImg,
      createdAt: Date.now(),
    };
  };

  // Drag-and-drop handlers
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) { setError("Přidejte alespoň jednu fotografii."); return; }
    if (!images.some((img) => img.isCover)) { setError("Vyberte náhledovou fotografii."); return; }
    setError("");
    setSubmitting(true);

    // Upload only new images
    const newImages = images.filter((img) => !img.isExisting);
    setUploadProgress({ current: 0, total: newImages.length });

    const urls: string[] = [];
    let uploadedCount = 0;

    for (const item of images) {
      if (item.isExisting) {
        urls.push(item.preview); // existing URL — reuse directly
      } else {
        uploadedCount++;
        setUploadProgress({ current: uploadedCount, total: newImages.length });
        const fd = new FormData();
        fd.append("file", item.file!);
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
    }

    const coverIdx = images.findIndex((img) => img.isCover);
    const coverImage = urls[coverIdx];

    const endpoint = mode === "edit" && editId
      ? `/api/admin/works/${editId}`
      : "/api/admin/works";
    const method = mode === "edit" ? "PUT" : "POST";
    const body = mode === "edit" && editId
      ? { ...form, images: urls, coverImage, createdAt: works.find((w) => w.id === editId)?.createdAt }
      : { ...form, images: urls, coverImage };

    const saveRes = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!saveRes.ok) {
      const d = await saveRes.json();
      setError(d.error || "Chyba při ukládání.");
      setSubmitting(false);
      return;
    }

    setSuccess(mode === "edit" ? "Realizace byla aktualizována." : "Realizace byla přidána.");
    resetForm();
    await fetchWorks();
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/works/${id}`, { method: "DELETE" });
    setWorks((ws) => ws.filter((w) => w.id !== id));
    setConfirmDelete(null);
  };

  const submitLabel = submitting
    ? uploadProgress.total > 0
      ? `Nahrávám ${uploadProgress.current}/${uploadProgress.total}…`
      : "Ukládám…"
    : mode === "edit" ? "Uložit změny" : "Přidat realizaci";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold text-[#f0f0f0]">Naše práce</h2>
        {mode === "edit" && (
          <span className="text-xs text-[#f06820] bg-[#f06820]/10 px-3 py-1 border border-[#f06820]/20">
            Režim úprav
          </span>
        )}
      </div>

      {/* Success banner */}
      {success && (
        <div role="status" className="flex items-center gap-3 bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-sm px-4 py-3 mb-6">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {success}
        </div>
      )}

      {/* ── Add / Edit form ──────────────────────────────────────────────────── */}
      <div ref={formRef} className="bg-[#1a1a1a] border border-[#333333] p-6 mb-10">
        <h3 className="text-xs font-medium text-[#888888] mb-5 uppercase tracking-widest">
          {mode === "edit" ? "Upravit realizaci" : "Přidat realizaci"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Photo upload — drag-and-drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-4 border border-dashed transition-colors duration-200 ${
              dragOver
                ? "border-[#f06820]/60 bg-[#f06820]/5"
                : "border-[#333333]"
            }`}
          >
            <label className="block text-xs text-[#888888] mb-3 tracking-wide uppercase">
              Fotografie *
              <span className="normal-case ml-2 text-[#606060] tracking-normal">
                — přetáhněte sem nebo klikněte Přidat foto · klikněte na náhled pro výběr obálky
              </span>
            </label>

            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={img.preview} className="relative">
                  {/* Thumbnail */}
                  <div
                    onClick={() => setCover(i)}
                    className={`w-28 h-20 relative cursor-pointer overflow-hidden border-2 transition-all duration-200 ${
                      img.isCover
                        ? "border-white"
                        : "border-[#3a3a3a] hover:border-[#666666]"
                    }`}
                    title={img.isCover ? "Náhledová fotka" : "Klikněte pro nastavení jako náhled"}
                  >
                    <Image src={img.preview} alt={`Foto ${i + 1}`} fill className="object-cover" />
                    {img.isCover && (
                      <div className="absolute bottom-0 left-0 right-0 bg-white text-black text-[9px] font-bold text-center py-0.5 tracking-wider uppercase">
                        Náhled
                      </div>
                    )}
                    {img.isExisting && (
                      <div className="absolute top-0 right-0 bg-black/60 text-white/50 text-[8px] px-1 py-0.5">
                        uloženo
                      </div>
                    )}
                  </div>

                  {/* Remove button — always visible */}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-[#1a1a1a] border border-[#444444] text-[#888888] hover:text-red-400 hover:border-red-400 flex items-center justify-center text-sm transition-colors"
                    title="Odebrat"
                    aria-label={`Odebrat foto ${i + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Add photos button */}
              <label className="w-28 h-20 border border-dashed border-[#3a3a3a] hover:border-[#f06820] cursor-pointer flex flex-col items-center justify-center gap-1 text-[#606060] hover:text-[#f06820] transition-colors">
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
                  onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
                />
              </label>
            </div>

            {images.length > 0 && (
              <p className="text-[#666666] text-xs mt-2">
                {images.length} {images.length < 5 ? "fotografie" : "fotografií"}
                {images.some(img => !img.isExisting) && ` · ${images.filter(img => !img.isExisting).length} nové k nahrání`}
              </p>
            )}
          </div>

          {/* Title + Tag */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
            <div>
              <label htmlFor="work-title" className="block text-xs text-[#888888] mb-2 tracking-wide uppercase">
                Název *
              </label>
              <input
                id="work-title"
                type="text"
                required
                className="input-field"
                placeholder="Rekonstrukce koupelny..."
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="work-tag" className="block text-xs text-[#888888] mb-2 tracking-wide uppercase">
                Kategorie
              </label>
              <input
                id="work-tag"
                type="text"
                className="input-field"
                placeholder="Vodo-Topo-Plyn..."
                value={form.tag}
                onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="work-description" className="block text-xs text-[#888888] mb-2 tracking-wide uppercase">
              Popis
            </label>
            <textarea
              id="work-description"
              rows={5}
              className="input-field max-w-xl resize-y"
              placeholder="Detailní popis realizace — rozsah práce, použité materiály, délka projektu..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          {error && (
            <p role="alert" className="text-red-400 text-xs flex items-center gap-2">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3 items-center">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary self-start disabled:opacity-50"
            >
              {submitLabel}
            </button>

            {/* Preview button */}
            {images.length > 0 && (
              <button
                type="button"
                onClick={() => setPreviewWork(buildPreviewWork())}
                className="inline-flex items-center gap-2 border border-[#3a3a3a] hover:border-[#666666] text-[#888888] hover:text-[#f0f0f0] px-4 py-3 text-sm transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Náhled
              </button>
            )}

            {isFormDirty && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-[#666666] hover:text-[#999999] transition-colors self-center"
              >
                {mode === "edit" ? "Zrušit úpravy" : "Zrušit"}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Existing works ───────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col gap-3">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : works.length === 0 ? (
        <div className="text-[#555555] text-sm py-8 text-center border border-dashed border-[#2a2a2a]">
          Zatím žádné realizace.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {works.map((w) => (
            <div
              key={w.id}
              className={`bg-[#1a1a1a] border transition-colors duration-200 flex gap-4 p-4 ${
                editId === w.id ? "border-[#f06820]/40" : "border-[#2e2e2e]"
              }`}
            >
              {/* Cover image */}
              <div className="w-24 h-20 relative flex-shrink-0 bg-[#222222] overflow-hidden border border-[#2a2a2a]">
                <Image src={w.coverImage} alt={w.title} fill className="object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="font-medium text-[#f0f0f0] text-sm">{w.title}</div>
                  {w.tag && (
                    <span className="text-[#f06820] text-[10px] tracking-wide uppercase bg-[#f06820]/10 px-2 py-0.5 border border-[#f06820]/20">
                      {w.tag}
                    </span>
                  )}
                </div>
                <div className="text-[#666666] text-xs mt-1">
                  {w.images.length} {w.images.length < 5 ? "fotografie" : "fotografií"}
                </div>
                {w.description && (
                  <div className="text-[#666666] text-xs mt-1 line-clamp-2">{w.description}</div>
                )}
                <div className="text-[#555555] text-xs mt-1.5">
                  {new Date(w.createdAt).toLocaleDateString("cs-CZ")}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-start gap-1 flex-shrink-0">
                {/* Edit button */}
                <button
                  onClick={() => startEdit(w)}
                  className="w-9 h-9 flex items-center justify-center text-[#666666] hover:text-[#f0f0f0] hover:bg-white/5 transition-colors"
                  title="Upravit"
                  aria-label="Upravit realizaci"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                {/* Delete — inline confirm */}
                {confirmDelete === w.id ? (
                  <div className="flex items-center gap-2 pl-1 pt-2">
                    <span className="text-xs text-[#888888]">Smazat?</span>
                    <button
                      onClick={() => handleDelete(w.id)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
                    >
                      Ano
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="text-xs text-[#666666] hover:text-[#999999] transition-colors"
                    >
                      Ne
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(w.id)}
                    className="w-9 h-9 flex items-center justify-center text-[#555555] hover:text-red-400 transition-colors"
                    title="Smazat"
                    aria-label="Smazat realizaci"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal — uses the real WorkModal with a constructed Work object */}
      {previewWork && (
        <WorkModal work={previewWork} onClose={() => setPreviewWork(null)} />
      )}
    </div>
  );
}
