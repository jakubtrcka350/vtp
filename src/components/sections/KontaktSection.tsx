"use client";

import { useState } from "react";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import { services } from "@/lib/services";

const serviceLinks = services.filter((s) => !s.cta);

export default function KontaktSection() {
  const { ref: headRef, inView: headInView } = useInView<HTMLDivElement>();
  const { ref: blocksRef, inView: blocksInView } = useInView<HTMLDivElement>();
  const [sluzbyOpen, setSluzbyOpen] = useState(false);

  return (
    <footer id="kontakt" className="border-t border-[#e5e5e5]">

      {/* Contact info strip — white */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div
            ref={headRef}
            className={`mb-12 transition-all duration-700 ${headInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          >
            <p className="text-[#f06820] text-xs tracking-[0.3em] uppercase mb-4 font-medium">
              Kontakt
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] tracking-tight">
              Pojďme spolupracovat.
            </h2>
          </div>

          <div ref={blocksRef} className="grid md:grid-cols-3 gap-8">
            {/* Phone */}
            <div className="flex gap-4" style={{ opacity: blocksInView ? 1 : 0, transform: blocksInView ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease 0s, transform 0.6s ease 0s" }}>
              <div className="w-10 h-10 border border-[#e0e0e0] hover:border-[#0047AB]/40 flex items-center justify-center flex-shrink-0 text-[#f06820] transition-colors duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-[#aaaaaa] uppercase tracking-wide mb-1">Telefon</div>
                <a href="tel:+420731863896" className="text-[#0a0a0a] hover:text-[#f06820] transition-colors font-medium">
                  +420 731 863 896
                </a>
                <br />
                <a href="tel:+420603162571" className="text-[#0a0a0a] hover:text-[#f06820] transition-colors font-medium">
                  +420 603 162 571
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4" style={{ opacity: blocksInView ? 1 : 0, transform: blocksInView ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s" }}>
              <div className="w-10 h-10 border border-[#e0e0e0] hover:border-[#0047AB]/40 flex items-center justify-center flex-shrink-0 text-[#f06820] transition-colors duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-[#aaaaaa] uppercase tracking-wide mb-1">E-mail</div>
                <a href="mailto:vodo-topo-trcka@seznam.cz" className="text-[#0a0a0a] hover:text-[#f06820] transition-colors font-medium">
                  vodo-topo-trcka@seznam.cz
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-4" style={{ opacity: blocksInView ? 1 : 0, transform: blocksInView ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s" }}>
              <div className="w-10 h-10 border border-[#e0e0e0] hover:border-[#0047AB]/40 flex items-center justify-center flex-shrink-0 text-[#f06820] transition-colors duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-[#aaaaaa] uppercase tracking-wide mb-1">Adresa</div>
                <address className="text-[#0a0a0a] not-italic font-medium leading-relaxed">
                  756 12 Horní Lideč
                </address>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar — dark */}
      <div className="bg-[#0a0a0a] py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6 pb-6 border-b border-white/[0.06]">

            {/* CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="text-white/50 text-sm">Připraveni začít?</p>
              <a
                href="#poptavka"
                className="inline-flex items-center gap-2 bg-white text-[#0a0a0a] px-5 py-2.5 text-xs font-semibold tracking-widest hover:bg-[#f0f0f0] transition-colors duration-200"
              >
                Poptat práci
              </a>
            </div>

            {/* Quick nav */}
            <nav className="flex flex-wrap gap-x-6 gap-y-2 items-start">
              {[
                { label: "Poptávka", href: "#poptavka" },
                { label: "O nás", href: "#o-nas" },
                { label: "Kontakt", href: "#kontakt" },
              ].map((l) => (
                <a key={l.href} href={l.href} className="text-xs text-white/40 hover:text-white/80 transition-colors duration-200">
                  {l.label}
                </a>
              ))}

              {/* Služby — expandable */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setSluzbyOpen((o) => !o)}
                  className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors duration-200"
                >
                  Služby
                  <svg
                    className={`w-2.5 h-2.5 transition-transform duration-200 ${sluzbyOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${sluzbyOpen ? "max-h-96" : "max-h-0"}`}>
                  <ul className="flex flex-col gap-1 mt-1">
                    {serviceLinks.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/sluzby/${s.slug}`}
                          className="text-xs text-white/30 hover:text-white/70 transition-colors duration-200"
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </nav>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} VTP Trčka. Všechna práva vyhrazena.
            </p>
            <div className="flex items-center gap-4">
              <a href="tel:+420731863896" className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200">
                +420 731 863 896
              </a>
              <span className="text-white/10">·</span>
              <a href="tel:+420603162571" className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200">
                +420 603 162 571
              </a>
              <span className="text-white/10">·</span>
              <a href="https://www.instagram.com/vtp_trcka/" target="_blank" rel="noopener noreferrer" className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200">
                Instagram
              </a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.04]">
            <p className="text-xs text-white/20">
              Vytvořil{" "}
              <a
                href="https://romanmachala.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/50 transition-colors duration-200"
              >
                Roman Machala
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
