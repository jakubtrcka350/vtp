"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface Props {
  photos: string[];
  title: string;
}

export default function ServiceCarousel({ photos, title }: Props) {
  const [current, setCurrent] = useState(0);
  const total = photos.length;
  const touchStartX = useRef<number>(0);

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + total) % total),
    [total]
  );
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % total),
    [total]
  );

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
  };

  return (
    <div
      className="relative w-full h-full bg-[#0d0d0d] flex items-center justify-center overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* Images — crossfade, respects reduced motion */}
      {photos.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 motion-safe:transition-opacity motion-safe:duration-500 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={i === 0 ? title : ""}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* Subtle dark vignette around edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 80px rgba(0,0,0,0.5)" }}
      />

      {/* Prev / Next — only if multiple photos */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/80 border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all duration-200 z-10 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
            aria-label="Předchozí"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/80 border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all duration-200 z-10 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
            aria-label="Další"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Foto ${i + 1}`}
                className={`rounded-full transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none ${
                  i === current
                    ? "w-5 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-4 right-4 bg-black/50 text-white/50 text-xs px-2.5 py-1 font-mono backdrop-blur-sm z-10">
            {current + 1} / {total}
          </div>
        </>
      )}
    </div>
  );
}
