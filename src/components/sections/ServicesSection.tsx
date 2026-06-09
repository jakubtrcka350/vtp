"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { services } from "@/lib/services";
import { useInView } from "@/hooks/useInView";

function PhotoSlideshow({ photos, gradient, title }: { photos: string[]; gradient: string; title: string }) {
  const [idx, setIdx] = useState(0);

  // Reset to first photo when the photo set changes (service switched)
  useEffect(() => { setIdx(0); }, [photos]);

  useEffect(() => {
    if (photos.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % photos.length), 4000);
    return () => clearInterval(id);
  }, [photos]);

  if (photos.length === 0) {
    return <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />;
  }

  return (
    <>
      {photos.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={i === 0 ? title : ""}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === idx ? "opacity-70" : "opacity-0"
          }`}
        />
      ))}

      {/* Dot indicators */}
      {photos.length > 1 && (
        <div className="absolute bottom-4 right-4 z-10 flex gap-1.5">
          {photos.map((_, j) => (
            <div
              key={j}
              className={`h-0.5 rounded-full transition-all duration-500 ${
                j === idx ? "w-4 bg-white" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}

const serviceLinks = services.filter((s) => !s.cta);
const ctaService   = services.find((s) => s.cta);

export default function ServicesSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = serviceLinks[activeIdx];

  const { ref: headRef, inView: headInView } = useInView<HTMLDivElement>();
  const { ref: bodyRef, inView: bodyInView } = useInView<HTMLDivElement>();

  return (
    <section id="sluzby" className="py-28 bg-white border-t border-black/[0.06] relative overflow-hidden">

      <div className="relative max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div
          ref={headRef}
          className={`mb-16 transition-all duration-700 ${headInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <p className="section-label">Služby</p>
          <div className="section-accent-line" />
          <h2 className="section-heading text-black">Co nabízíme.</h2>
          <p className="section-subheading">
            Voda, teplo, plyn, čištění potrubí, kamerové zkoušky i stavební práce.
            Každou zakázku řešíme individuálně.
          </p>
        </div>

        {/* Split panel */}
        <div
          ref={bodyRef}
          className={`flex flex-col lg:flex-row gap-6 lg:gap-10 transition-all duration-700 delay-150 ${bodyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >

          {/* ── Left: service list ──────────────────────────────────────── */}
          <div className="lg:w-[38%] flex flex-col justify-between gap-2 bg-black border border-[#1a1a1a] p-2">

            <ul className="space-y-1">
              {serviceLinks.map((s, i) => {
                const isActive = i === activeIdx;
                return (
                  <li key={s.slug}>
                    <button
                      onClick={() => setActiveIdx(i)}
                      className={`w-full text-left group flex items-start gap-4 px-5 py-4 border-l-2 transition-all duration-200 ${
                        isActive
                          ? "border-[#f06820] bg-white/[0.08]"
                          : "border-transparent hover:border-white/30 hover:bg-white/[0.05]"
                      }`}
                    >
                      {/* Number */}
                      <span className={`text-xs font-mono mt-0.5 flex-shrink-0 transition-colors duration-200 ${
                        isActive ? "text-[#f06820]" : "text-white/40 group-hover:text-white/60"
                      }`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <div className="flex-1 min-w-0">
                        <p className={`text-[10px] tracking-[0.2em] uppercase font-medium mb-1 transition-colors duration-200 ${
                          isActive ? "text-[#f06820]" : "text-white/50 group-hover:text-white/70"
                        }`}>
                          {s.category}
                        </p>
                        <p className={`font-semibold text-base leading-snug transition-colors duration-200 ${
                          isActive ? "text-white" : "text-white/75 group-hover:text-white"
                        }`}>
                          {s.title}
                        </p>
                      </div>

                      {/* Arrow — active only */}
                      <svg
                        className={`w-4 h-4 mt-1 flex-shrink-0 transition-all duration-200 ${
                          isActive ? "opacity-100 text-[#f06820] translate-x-0" : "opacity-0 -translate-x-1"
                        }`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* CTA row */}
            {ctaService && (
              <div className="mt-2 border border-white/[0.08] p-5">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#f06820] font-medium mb-1">
                  {ctaService.category}
                </p>
                <p className="text-white/80 text-sm font-medium mb-3">
                  {ctaService.desc}
                </p>
                <a href="#poptavka" className="btn-primary text-xs tracking-widest px-4 py-2.5 inline-flex">
                  Poptat konzultaci
                </a>
              </div>
            )}
          </div>

          {/* ── Right: full-height photo with overlaid text ─────────────── */}
          <div className="lg:flex-1 relative overflow-hidden bg-[#111] border border-[#303030] min-h-[360px] lg:min-h-0">
            <PhotoSlideshow photos={active.photos} gradient={active.gradient} title={active.title} />

            {/* Bottom-to-top scrim for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Top scrim for category badge */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent" />

            {/* Category badge — top left */}
            <div className="absolute top-4 left-4">
              <span className="bg-black/60 text-[#f06820] text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 font-medium backdrop-blur-sm">
                {active.category}
              </span>
            </div>

            {/* Text overlay — bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <h3 className="text-white font-bold text-xl lg:text-2xl mb-2">
                {active.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mb-5 max-w-prose">
                {active.detail}
              </p>

              {/* Sub-services */}
              {active.subServices && active.subServices.length > 0 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-5">
                  {active.subServices.slice(0, 4).map((sub, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/75">
                      <span className="mt-[6px] w-1 h-1 flex-shrink-0 rounded-full bg-[#f06820]" />
                      {sub.title}
                    </li>
                  ))}
                  {active.subServices.length > 4 && (
                    <li className="text-xs text-white/50 pl-3">
                      +{active.subServices.length - 4} další…
                    </li>
                  )}
                </ul>
              )}

              <Link
                href={`/sluzby/${active.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#f06820] transition-colors duration-200 group"
              >
                Zobrazit detail
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
