"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const touchStartX = useRef<number>(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      setVisible(true);
      // Move focus into the modal for accessibility
      closeRef.current?.focus();
    });
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Track scroll position to hide the fade affordance when at bottom
  const handlePanelScroll = () => {
    const el = panelRef.current;
    if (!el) return;
    setScrolled(el.scrollTop + el.clientHeight >= el.scrollHeight - 8);
  };

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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-8 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ background: "rgba(5,5,5,0.75)" }}
    >
      {/* Click-outside backdrop */}
      <div className="absolute inset-0" onClick={close} />

      {/* Modal — stacked on mobile (auto height), side-by-side on lg (fixed 80vh) */}
      <div
        className={`relative flex flex-col lg:flex-row overflow-hidden transition-transform duration-300 w-[95vw] lg:w-[80vw] max-h-[90dvh] lg:h-[80vh] lg:max-h-none ${
          visible ? "translate-y-0" : "translate-y-4"
        }`}
        style={{ maxWidth: "1400px" }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── Top/Left: image viewer ──────────────────────────────── */}
        <div
          className="relative backdrop-blur-md overflow-hidden h-[75vw] min-h-[320px] max-h-[520px] flex-shrink-0 lg:h-full lg:min-h-0 lg:max-h-none lg:flex-1"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >

          {/* Crossfading images */}
          {work.images.map((url, i) => (
            <div
              key={url}
              className={`absolute inset-0 motion-safe:transition-opacity motion-safe:duration-300 ${
                i === current ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={i === 0 ? work.title : ""}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}

          {/* Prev / Next */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/60 hover:bg-black/90 border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all duration-200 z-10 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
                aria-label="Předchozí foto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/60 hover:bg-black/90 border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all duration-200 z-10 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
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
        <div
          ref={panelRef}
          onScroll={handlePanelScroll}
          className="relative w-full lg:w-[40%] bg-white flex flex-col flex-1 min-h-0 border-t lg:border-t-0 lg:border-l border-[#e8e8e8] overflow-y-auto"
        >

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
              ref={closeRef}
              onClick={close}
              className="flex-shrink-0 w-11 h-11 flex items-center justify-center text-[#bbbbbb] hover:text-[#0a0a0a] hover:bg-black/5 transition-colors focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:outline-none"
              aria-label="Zavřít"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Description */}
          {work.description ? (
            <div className="px-8 pt-6 lg:pt-10 pb-8 flex-1">
              <p className="text-[#555555] text-[15px] font-serif leading-[1.7] whitespace-pre-wrap">
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
          </div>

          {/* Scroll affordance — fades out when panel is scrolled to bottom */}
          <div
            className={`sticky bottom-0 left-0 right-0 h-10 pointer-events-none transition-opacity duration-300 ${
              scrolled ? "opacity-0" : "opacity-100"
            }`}
            style={{ background: "linear-gradient(to top, white, transparent)" }}
          />
        </div>
      </div>
    </div>
  );
}
