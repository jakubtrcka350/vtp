"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const services = [
  {
    category: "Voda · Teplo · Plyn",
    title: "Vodo-topo-plyn",
    desc: "Kompletní instalace a rozvody vody, topení i plynu. Montáž kotlů, radiátorů, podlahového vytápění, koupelen a plynových spotřebičů. Opravy havárií i plánované rekonstrukce.",
    photos: [
      "/images/services/vtp/koupelna.jpeg",
      "/images/services/vtp/ocel_radiatory.jpeg",
      "/images/services/vtp/podlah_topeni.jpeg",
      "/images/services/vtp/poz_potrubi.jpeg",
    ],
    gradient: "from-[#0d1520] to-[#080e18]",
  },
  {
    category: "Čištění potrubí",
    title: "Čištění vodovodního a odpadního potrubí",
    desc: "Profesionální čištění vodovodního i odpadního potrubí vysokotlakým čištěním. Odstraňujeme usazeniny, ucpávky a inkrustace — bez zbytečného bourání.",
    photos: ["/images/services/cist_potrubi/cist_potrubi.jpeg"],
    gradient: "from-[#1a0e08] to-[#110a05]",
  },
  {
    category: "Diagnostika",
    title: "Kamerové zkoušky",
    desc: "Inspekce potrubí průmyslovou kamerou. Přesná diagnostika závad, prasklin a ucpávek s videozáznamem — ideální podklad pro opravu i pojistné události.",
    photos: ["/images/services/diagn/diagn.jpeg"],
    gradient: "from-[#0f1a0d] to-[#0a1108]",
  },
  {
    category: "Stavební práce",
    title: "Zednické a obkladačské práce",
    desc: "Kompletní zednické a obkladačské práce. Obklady a dlažby do koupelen, kuchyní i ostatních prostor. Přesné provedení, kvalitní materiály.",
    photos: ["/images/services/zedn_prace/zednicke_prace.jpeg"],
    gradient: "from-[#141420] to-[#0d0d18]",
  },
  {
    category: "Poradenství",
    title: "Konzultace zdarma",
    desc: "Nejste si jistí, jaké řešení je pro vás nejlepší? Poradíme vám zdarma a bez závazků. Zavolejte nebo napište.",
    photos: ["/images/services/consult/handshake.jpg"],
    gradient: "from-[#1a1208] to-[#0f0d05]",
    cta: true,
  },
];

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
  return (
    <section id="sluzby" className="py-28 border-t border-white/[0.05] relative overflow-hidden bg-white">
        {/*
        <div className="absolute inset-0">
              <Image src="/images/hero.jpeg" alt="dsada" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-[#080808]/80" />
        </div>
        */}
        
        <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="mb-14">
          <p className="section-label">Služby</p>
          <div className="section-accent-line" />
          <h2 className="section-heading text-black">Co umíme.</h2>
          <p className="section-subheading">
            Voda, teplo, plyn, čištění potrubí, kamerové zkoušky i stavební práce.
            Každou zakázku přistupujeme individuálně.
          </p>
        </div>

        {/*
          Bento grid — 3 cols on lg, 2 on md, 1 on mobile.

          lg:
            Row 1:  [card 0 – col-span-2] [card 1]
            Row 2:  [card 2]  [card 3 – col-span-2]
            Row 3:  [card 4 – col-span-3, CTA strip]
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const isWide = i === 0 || i === 3;
            const isFull = i === 4;

            return (
              <div
                key={i}
                className={[
                  "group relative overflow-hidden border border-[#2a2a2a] hover:border-cobalt transition-all duration-300",
                  isWide ? "lg:col-span-2" : "",
                  isFull ? "lg:col-span-3 min-h-[200px]" : "min-h-[300px]",
                ].join(" ")}
              >
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
                      isFull ? "" : "line-clamp-2",
                    ].join(" ")}>
                      {s.desc}
                    </p>
                  </div>

                  {s.cta && (
                    <a
                      href="#poptavka"
                      className="btn-primary whitespace-nowrap flex-shrink-0 self-start sm:self-auto"
                    >
                      Poptat konzultaci
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
