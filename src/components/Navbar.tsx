"use client";

import { useState, useEffect } from "react";

const links = [
  { label: "Poptávka", href: "#poptavka" },
  { label: "O nás", href: "#o-nas" },
  { label: "Naše práce", href: "#nase-prace" },
  { label: "Služby", href: "#sluzby" },
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-[#080808]/95 backdrop-blur-sm border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <a
          href="#poptavka"
          className="font-bold text-lg tracking-[0.15em] text-white hover:text-white transition-colors uppercase"
        >
          NÁZEV<span className="text-[#c8a96e]">.</span>
        </a>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[#777777] hover:text-white transition-colors duration-200 tracking-wide"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#poptavka"
          className="hidden md:inline-flex btn-primary text-xs tracking-widest px-5 py-2.5"
        >
          Poptat práci
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden p-2 text-[#777777] hover:text-white transition-colors"
          aria-label="Otevřít menu"
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span className={`block h-px bg-current transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block h-px bg-current transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 border-b border-white/[0.06]" : "max-h-0"}`}>
        <nav className="px-6 pb-6 flex flex-col gap-4 bg-[#080808]/95 backdrop-blur-sm">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-[#777777] hover:text-white transition-colors py-1"
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
