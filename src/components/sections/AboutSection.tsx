"use client";

import { useInView } from "@/hooks/useInView";

const values = [
  { title: "Spolehlivost", desc: "Dodržujeme termíny i sliby." },
  { title: "Kvalita", desc: "Prověřené materiály a postupy." },
  { title: "Transparentnost", desc: "Žádné skryté náklady." },
  { title: "Zkušenosti", desc: "25+ let vodoinstalatérství." },
];

export default function AboutSection() {
  const { ref: imgRef, inView: imgInView } = useInView<HTMLDivElement>();
  const { ref: textRef, inView: textInView } = useInView<HTMLDivElement>();

  return (
    <section id="o-nas" className="py-28 border-t border-[#e5e5e5] bg-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* Image — slides in from left */}
        <div
          ref={imgRef}
          className="relative overflow-hidden"
          style={{
            opacity: imgInView ? 1 : 0,
            transform: imgInView ? "translateX(0)" : "translateX(-32px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <div className="aspect-[4/3] bg-[#f5f5f5] border border-[#e0e0e0] flex items-center justify-center overflow-hidden">
            {/* Replace with real team photo: <Image src="/images/tym.jpg" alt="Tým VTP Trčka" fill className="object-cover" /> */}
            <div className="flex flex-col items-center gap-3 text-[#cccccc]">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs tracking-wider">Fotka týmu</span>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-28 h-28 border border-[#0047AB]/20 pointer-events-none" />
          <div className="absolute -bottom-2 -right-2 w-16 h-16 border border-[#f06820]/30 pointer-events-none" />
        </div>

        {/* Text — slides in from right */}
        <div
          ref={textRef}
          style={{
            opacity: textInView ? 1 : 0,
            transform: textInView ? "translateX(0)" : "translateX(32px)",
            transition: "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s",
          }}
        >
          <p className="section-label">O nás</p>
          <div className="section-accent-line" />
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] tracking-tight">
            Voda a teplo,
            <br />
            jak mají být.
          </h2>

          <p className="mt-6 text-[#666666] leading-relaxed">
            Jsme rodinná firma VTP Trčka specializující se na vodo-topo-plyn,
            čištění potrubí, kamerové zkoušky a zednické a obkladačské práce.
            S více než desetiletou praxí v oboru přistupujeme ke každé zakázce
            s důrazem na poctivé řemeslo a spokojenost klienta.
          </p>
          <p className="mt-4 text-[#666666] leading-relaxed">
            Ať se jedná o drobnou opravu nebo kompletní rekonstrukci — každé
            práci věnujeme stejnou péči. Protože věříme, že kvalita a
            spolehlivost jsou základem dlouhodobé důvěry.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="border-l-2 border-[#f06820]/30 pl-4 py-1 hover:border-[#f06820] transition-colors"
                style={{
                  opacity: textInView ? 1 : 0,
                  transform: textInView ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.5s ease ${0.3 + i * 0.1}s, transform 0.5s ease ${0.3 + i * 0.1}s`,
                }}
              >
                <div className="text-sm font-semibold text-[#0a0a0a]">{v.title}</div>
                <div className="text-xs text-[#888888] mt-0.5">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
