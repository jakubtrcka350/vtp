"use client";

import { useState } from "react";
import Image from "next/image";
import type { Work } from "@/lib/types";
import WorkModal from "@/components/WorkModal";

interface Props {
  works: Work[];
}

export default function WorksSection({ works }: Props) {
  const [selected, setSelected] = useState<Work | null>(null);

  return (
    <section id="nase-prace" className="py-28 border-t border-[#1f1f1f]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <p className="text-[#c8a96e] text-xs tracking-[0.3em] uppercase mb-3 font-medium">
              Naše práce
            </p>
            <div className="w-8 h-px bg-white mb-5 opacity-20" />
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Co jsme dokázali.
            </h2>
          </div>
          {works.length > 0 && (
            <p className="text-[#555555] text-sm">
              {works.length}{" "}
              {works.length === 1
                ? "realizace"
                : works.length < 5
                  ? "realizace"
                  : "realizací"}
            </p>
          )}
        </div>

        {/* Grid */}
        {works.length === 0 ? (
          <div className="border border-dashed border-[#2a2a2a] py-24 flex flex-col items-center gap-4 text-[#333333]">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="text-sm">Realizace budou přidány brzy.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {works.map((work) => (
              <article
                key={work.id}
                onClick={() => setSelected(work)}
                className="group cursor-pointer bg-[#111111] border border-[#2a2a2a] hover:border-white overflow-hidden transition-all duration-300"
              >
                {/* Cover image */}
                <div className="aspect-[4/3] relative overflow-hidden bg-[#1c1c1c]">
                  <Image
                    src={work.coverImage}
                    alt={work.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Photo count badge */}
                  {work.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white/80 text-xs px-2 py-0.5 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01"
                        />
                      </svg>
                      {work.images.length}
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/60 text-white text-xs tracking-widest uppercase px-4 py-2">
                      Zobrazit
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 border-t border-[#1f1f1f] group-hover:border-[#333333] transition-colors">
                  <h3 className="font-semibold text-white text-base">
                    {work.title}
                  </h3>
                  {work.description && (
                    <p className="mt-2 text-[#777777] text-sm leading-relaxed line-clamp-2">
                      {work.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <WorkModal work={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
