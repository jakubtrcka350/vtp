"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { services } from "@/lib/services";
import { useInView } from "@/hooks/useInView";

// Handles static photo, auto-cycling slideshow (2+ photos), or gradient fallback.
// Renders both the images and the dot indicators so both stay in sync with idx.
function CardBackground({
  photos,
  gradient,
  title,
}: {
  photos: string[];
  gradient: string;
  title: string;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (photos.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % photos.length), 4000);
    return () => clearInterval(id);
  }, [photos.length]);

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
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Dot indicators — only visible when there are multiple photos */}
      {photos.length > 1 && (
        <div className="absolute top-3 right-3 z-10 flex gap-1">
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

export default function ServicesSection() {
  const { ref: headRef, inView: headInView } = useInView<HTMLDivElement>();
  const { ref: gridRef, inView: gridInView } = useInView<HTMLDivElement>();

  return (
    <section id="sluzby" className="py-28 border-t border-white/[0.05] relative overflow-hidden bg-white">
        <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div
          ref={headRef}
          className={`mb-14 transition-all duration-700 ${headInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <p className="section-label">Služby</p>
          <div className="section-accent-line" />
          <h2 className="section-heading text-black">Co umíme.</h2>
          <p className="section-subheading">
            Voda, teplo, plyn, čištění potrubí, kamerové zkoušky i stavební práce.
            Každou zakázku přistupujeme individuálně.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const isWide = i === 0 || i === 3;
            const isFull = i === 4;

            const cardClass = [
              "group relative overflow-hidden border border-[#2a2a2a] transition-all duration-300",
              isWide ? "lg:col-span-2" : "",
              isFull ? "lg:col-span-3 min-h-[250px]" : "min-h-[300px]",
              !s.cta ? "hover:border-cobalt cursor-pointer" : "",
            ].join(" ");

            const inner = (
              <>
                {/* Background — slideshow, single photo, or gradient */}
                <CardBackground photos={s.photos} gradient={s.gradient} title={s.title} />

                {/* Scrim — gradient from bottom so text stays readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Hover accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ background: "linear-gradient(to right, #f06820, #0047AB)" }}
                />

                {/* Category badge — top left */}
                <div className="absolute top-3 left-3">
                  <span className="bg-black/60 text-[#f06820] text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 font-medium backdrop-blur-sm">
                    {s.category}
                  </span>
                </div>

                {/* "Více" hint — top right, only on linkable cards */}
                {!s.cta && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-black/60 text-white/70 text-[10px] tracking-widest uppercase px-2.5 py-1 backdrop-blur-sm flex items-center gap-1">
                      Více
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                )}

                {/* Text overlay — bottom */}
                <div className={[
                  "absolute bottom-0 left-0 right-0 p-5",
                  isFull ? "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4" : "",
                ].join(" ")}>
                  <div>
                    <h3 className="font-semibold text-white text-base leading-snug mb-1.5">
                      {s.title}
                    </h3>
                    <p className={[
                      "text-white/60 text-sm leading-relaxed group-hover:text-white/75 transition-colors duration-300",
                      isFull ? "" : "line-clamp-4",
                    ].join(" ")}>
                      {s.desc}
                    </p>
                  </div>

                  {s.cta && (
                    <a
                      href="#poptavka"
                      className="btn-primary whitespace-nowrap flex-shrink-0 self-start sm:self-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Poptat konzultaci
                    </a>
                  )}
                </div>
              </>
            );

            const delay = gridInView ? i * 90 : 0;
            const animStyle = {
              opacity: gridInView ? 1 : 0,
              transform: gridInView ? "translateY(0)" : "translateY(24px)",
              transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, border-color 0.3s ease`,
            };

            return s.cta ? (
              <div key={i} className={cardClass} style={animStyle}>{inner}</div>
            ) : (
              <Link key={i} href={`/sluzby/${s.slug}`} className={cardClass} style={animStyle}>{inner}</Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
