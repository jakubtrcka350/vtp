"use client";

import { useState } from "react";
import Image from "next/image";
import type { Work } from "@/lib/types";
import WorkModal from "@/components/WorkModal";
import { useInView } from "@/hooks/useInView";

const INITIAL_SHOW = 3;

interface Props {
  works: Work[];
}

export default function WorksSection({ works }: Props) {
  const [selected, setSelected] = useState<Work | null>(null);
  const [showAll, setShowAll] = useState(false);
  const { ref: headRef, inView: headInView } = useInView<HTMLDivElement>();

  const displayed = showAll ? works : works.slice(0, INITIAL_SHOW);
  const hidden = works.length - INITIAL_SHOW;

  return (
    <section id="nase-prace" className="py-28 border-t border-[#1f1f1f]">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div
          ref={headRef}
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14 transition-all duration-700 ${headInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <div>
            <p className="section-label">Naše práce</p>
            <div className="section-accent-line" />
            <h2 className="section-heading">Co jsme dokázali.</h2>
          </div>
        </div>

        {works.length === 0 ? (
          <div className="border border-dashed border-[#2a2a2a] py-24 flex flex-col items-center gap-4 text-[#333333]">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm">Realizace budou přidány brzy.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-5">
              {displayed.map((work, i) => {
                const isRevealed = showAll && i >= INITIAL_SHOW;
                return (
                  <article
                    key={work.id}
                    onClick={() => setSelected(work)}
                    style={isRevealed ? { animationDelay: `${(i - INITIAL_SHOW) * 60}ms` } : undefined}
                    className={`group cursor-pointer relative aspect-[4/3] overflow-hidden bg-[#1c1c1c] border border-[#2a2a2a] hover:border-white transition-colors duration-300 w-full md:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] ${
                      isRevealed ? "motion-safe:animate-fade-up [animation-fill-mode:both]" : ""
                    }`}
                  >
                    {/* Cover image */}
                    <Image
                      src={work.coverImage}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Accent line — animates in on hover (desktop), always visible on touch */}
                    <div
                      className="absolute top-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 md:scale-x-0 scale-x-100 transition-transform duration-500 origin-left z-10"
                      style={{ background: "linear-gradient(to right, #f06820, #0047AB)" }}
                    />

                    {/* Multi-image badge */}
                    {work.images.length > 1 && (
                      <div className="absolute top-3 right-3 z-10 bg-black/60 text-white/70 text-[10px] px-2 py-0.5 flex items-center gap-1 backdrop-blur-sm">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
                        </svg>
                        {work.images.length}
                      </div>
                    )}

                    {/* Scrim + title overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-semibold text-white text-sm leading-snug uppercase tracking-wide">
                        {work.title}
                      </h3>
                    </div>

                    {/* Hover "Zobrazit" overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-[#f06820]/70 text-[#f06820] text-[11px] tracking-widest uppercase px-4 py-2">
                        Zobrazit
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Show more / Show less */}
            {hidden > 0 && (
              <div className="mt-12 flex justify-center">
                {!showAll ? (
                  <button
                    onClick={() => setShowAll(true)}
                    className="group inline-flex items-center gap-3 border border-[#2a2a2a] hover:border-white text-[#888888] hover:text-white px-8 py-3.5 text-sm transition-all duration-300"
                  >
                    Zobrazit všechny realizace
                    <span className="text-[#444444] group-hover:text-[#888888] transition-colors tabular-nums">+{hidden}</span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAll(false)}
                    className="group inline-flex items-center gap-3 border border-[#2a2a2a] hover:border-white text-[#888888] hover:text-white px-8 py-3.5 text-sm transition-all duration-300"
                  >
                    Zobrazit méně
                    <svg className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {selected && <WorkModal work={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
