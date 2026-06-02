"use client";

import { useEffect, useState, useCallback } from "react";
import type { Work } from "@/lib/types";

interface Props {
  work: Work;
  onClose: () => void;
}

export default function WorkModal({ work, onClose }: Props) {
  const [current, setCurrent] = useState(() => {
    const idx = work.images.indexOf(work.coverImage);
    return idx !== -1 ? idx : 0;
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 250);
  }, [onClose]);

  const prev = useCallback(
    () => setCurrent(c => (c - 1 + work.images.length) % work.images.length),
    [work.images.length]
  );
  const next = useCallback(
    () => setCurrent(c => (c + 1) % work.images.length),
    [work.images.length]
  );

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
      style={{ background: "rgba(5,5,5,0.75)" }}
    >
      {/* Click-outside backdrop */}
      <div className="absolute inset-0" onClick={close} />

      {/* Modal — stacked on mobile, side-by-side on lg */}
      <div
        className={`relative flex flex-col lg:flex-row overflow-hidden transition-transform duration-250 w-[95vw] lg:w-[80vw] max-h-[90vh] lg:max-h-none ${
          visible ? "translate-y-0" : "translate-y-4"
        }`}
        style={{ maxWidth: "1400px", height: "80vh" }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── Top/Left: image viewer ──────────────────────────────── */}
        <div className="relative backdrop-blur-md flex items-center justify-center overflow-hidden h-56 sm:h-72 flex-shrink-0 lg:h-auto lg:flex-1 lg:min-h-0">

          {/* Crossfading images — shown whole, no scaling beyond natural size */}
          {work.images.map((url, i) => (
            <div
              key={url}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                i === current ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={i === 0 ? work.title : ""}
                className="max-w-full max-h-full block"
              />
            </div>
          ))}

          {/* Prev / Next */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-black/90 border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all duration-200 z-10"
                aria-label="Předchozí foto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-black/90 border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all duration-200 z-10"
                aria-label="Další foto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Counter */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white/50 text-xs px-2.5 py-1 font-mono backdrop-blur-sm z-10">
                {current + 1} / {total}
              </div>
            </>
          )}
        </div>

        {/* ── Bottom/Right: info panel (white) ──────────────────── */}
        <div className="w-full lg:w-[40%] bg-white flex flex-col flex-shrink-0 border-t lg:border-t-0 lg:border-l border-[#e8e8e8] overflow-y-auto min-h-0">

          {/* Title + close */}
          <div className="flex items-start justify-between gap-4 px-8 py-6 border-b border-[#eeeeee]">
            <div className="min-w-0">
              <p className="text-[#f06820] text-[10px] tracking-[0.25em] uppercase font-medium mb-2">
                {work.tag ?? "Realizace"}
              </p>
              <h2 className="text-[#0a0a0a] font-semibold text-xl leading-snug uppercase tracking-wide">
                {work.title}
              </h2>
            </div>
            <button
              onClick={close}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-[#bbbbbb] hover:text-[#0a0a0a] hover:bg-black/5 transition-colors"
              aria-label="Zavřít"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Description */}
          {work.description ? (
            <div className="px-8 pt-10 pb-8 flex-1">
              <p className="text-black text-lg leading-[1.85] whitespace-pre-wrap font-sans tracking-[0.03em]">
                {work.description}
              </p>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* Footer */}
          <div className="px-8 py-5 border-t border-[#eeeeee]">
            <p className="text-[#aaaaaa] text-xs">
              {new Date(work.createdAt).toLocaleDateString("cs-CZ", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </p>
            {total > 1 && (
              <p className="text-[#cccccc] text-xs mt-1">
                {total} {total < 5 ? "fotografie" : "fotografií"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
