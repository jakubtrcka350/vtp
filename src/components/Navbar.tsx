"use client";

import { useState, useEffect } from "react";
import {colors} from "../lib/colors";
import Image from "next/image";

const links = [
  { label: "Poptávka", href: "#poptavka" },
  { label: "Služby", href: "#sluzby" },
  { label: "Naše práce", href: "#nase-prace" },
  { label: "O nás", href: "#o-nas" },
  { label: "Kontakt", href: "#kontakt" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled || menuOpen ? "border-white/[0.06]" : "border-transparent"}`}>

      {/* Dark right-side background */}
      <div
        className={`absolute inset-0 transition-colors duration-300 ${
          scrolled || menuOpen ? "bg-[#080808]/80 backdrop-blur-sm" : "bg-transparent"
        }`}
      />

      {/* White logo panel with diagonal right edge */}
      <div
        className="absolute inset-y-0 left-0 bg-white"
        style={{ width: "var(--navbar-panel)", clipPath: "polygon(0 0, 100% 0, calc(100% - 60px) 100%, 0 100%)" }}
      />

      {/* Thin orange accent line along the diagonal */}
      <div
        className="absolute inset-y-0 left-0 pointer-events-none"
        style={{
          width: "var(--navbar-panel)",
          clipPath: "polygon(calc(100% - 4px) 0, 100% 0, calc(100% - 60px) 100%, calc(100% - 64px) 100%)",
          background: colors.accent,
          opacity: 0.8,
        }}
      />
      <div
        className="absolute inset-y-0 left-0 pointer-events-none"
        style={{
          width: "var(--navbar-panel)",
          clipPath: "polygon(calc(100% - 10px) 0, calc(100% - 4px) 0, calc(100% - 64px) 100%, calc(100% - 70px) 100%)",
          background: colors.cobalt,
          opacity: 0.6,
        }}
      />

      <div className="relative z-10 h-[90px]">

        {/* Logo — container matches the white panel width so the logo right-aligns
            against the diagonal edge at any viewport width or zoom level.
            pr accounts for the diagonal slope (60px over 90px → ~30px at midheight) */}
        <div
          className="absolute inset-y-0 left-0 flex items-center justify-end pr-[72px]"
          style={{ width: "var(--navbar-panel)" }}
        >
          <a
            href="#poptavka"
            className="flex items-center group transition-opacity duration-200 hover:opacity-80"
          >
            <Image
              src="/logo.png"
              alt="VTP Trčka"
              width={1100}
              height={1000}
              className="h-[58px] w-auto object-contain"
              priority
            />
          </a>
        </div>

        {/* Nav + CTA + hamburger — own max-w container, pushed to the right */}
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-end gap-8">

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-lg text-white hover:text-[#777777] transition-colors duration-200 tracking-wide"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <a
            href="#poptavka"
            className="hidden lg:inline-flex btn-primary text-sm tracking-widest px-5 py-2.5"
          >
            Poptat práci
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="lg:hidden p-3 text-white hover:text-[#777777] transition-colors"
            aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`block h-px bg-current transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block h-px bg-current transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu" className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 border-b border-white/[0.06]" : "max-h-0"}`}>
        <nav className="px-6 pb-6 pt-2 flex flex-col gap-4 bg-[#080808]/95 backdrop-blur-sm">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-white hover:text-[#777777] transition-colors py-1"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#poptavka"
            onClick={() => setMenuOpen(false)}
            className="btn-primary mt-2 justify-center text-xs tracking-widest"
          >
            Poptat práci
          </a>
        </nav>
      </div>
    </header>
  );
}
