"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import type { Work } from "@/lib/types";

interface Props {
  work: Work;
  onClose: () => void;
}

export default function WorkModal({ work, onClose }: Props) {
  const [current, setCurrent] = useState(() =>
    work.images.indexOf(work.coverImage) !== -1
      ? work.images.indexOf(work.coverImage)
      : 0
  );
  const [visible, setVisible] = useState(false);

  // Animate in
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 250);
  }, [onClose]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + work.images.length) % work.images.length);
  }, [work.images.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % work.images.length);
  }, [work.images.length]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, prev, next]);

  const total = work.images.length;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 transition-opacity duration-250 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ background: "rgba(5,5,5,0.96)" }}
    >
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={close} />

      {/* Modal panel */}
      <div
        className={`relative w-full max-w-4xl mx-auto flex flex-col transition-all duration-250 ${
          visible ? "translate-y-0" : "translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute -top-10 right-0 text-[#888888] hover:text-white transition-colors flex items-center gap-2 text-sm z-10"
        >
          Zavřít
          <span className="text-lg leading-none">×</span>
        </button>

        {/* Image area */}
        <div className="relative bg-[#0f0f0f] border border-[#2a2a2a]">
          <div className="relative w-full" style={{ paddingTop: "62%" }}>
            {work.images.map((url, i) => (
              <div
                key={url}
                className={`absolute inset-0 transition-opacity duration-400 ${
                  i === current ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <Image
                  src={url}
                  alt={`${work.title} — foto ${i + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 896px"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {/* Prev / Next (only if more than 1 image) */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/90 border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all duration-200 group"
                aria-label="Předchozí foto"
              >
                <svg
                  className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/90 border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all duration-200 group"
                aria-label="Další foto"
              >
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {work.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`transition-all duration-200 rounded-full ${
                      i === current
                        ? "w-5 h-1.5 bg-white"
                        : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                    }`}
                    aria-label={`Foto ${i + 1}`}
                  />
                ))}
              </div>

              {/* Counter */}
              <div className="absolute top-3 right-3 bg-black/60 text-white/60 text-xs px-2 py-1 font-mono">
                {current + 1} / {total}
              </div>
            </>
          )}
        </div>

        {/* Info area */}
        <div className="bg-[#0d0d0d] border border-t-0 border-[#2a2a2a] px-6 py-5 max-h-48 overflow-y-auto">
          <h2 className="text-white font-semibold text-lg">{work.title}</h2>
          {work.description && (
            <p className="mt-2 text-[#9a9a9a] text-sm leading-relaxed whitespace-pre-wrap">
              {work.description}
            </p>
          )}
        </div>

        {/* Thumbnail strip (if 3+ images) */}
        {total >= 3 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {work.images.map((url, i) => (
              <button
                key={url}
                onClick={() => setCurrent(i)}
                className={`flex-shrink-0 w-16 h-12 relative border-2 transition-all duration-200 overflow-hidden ${
                  i === current
                    ? "border-white"
                    : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <Image
                  src={url}
                  alt={`Náhled ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
