"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { colors } from "../lib/colors";
import Image from "next/image";
import { services } from "@/lib/services";

const beforeLinks = [
  { label: "Poptávka", href: "#poptavka" },
];

const afterLinks = [
  { label: "O nás", href: "#o-nas" },
  { label: "Kontakt", href: "#kontakt" },
];

// Services that have their own detail page (exclude CTA card)
const serviceLinks = services.filter((s) => !s.cta);

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [dropOpen, setDropOpen]       = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false); // mobile sub-list
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled || menuOpen ? "border-white/[0.06]" : "border-transparent"
      }`}
    >
      {/* Dark background */}
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

        {/* Logo */}
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

        {/* Desktop nav + CTA */}
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-end gap-8">
          <nav className="hidden lg:flex items-center gap-8">

            {/* Links before Služby */}
            {beforeLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-lg text-white hover:text-[#777777] transition-colors duration-200 tracking-wide"
              >
                {l.label}
              </a>
            ))}

            {/* Služby dropdown */}
            <div ref={dropRef} className="relative">
              <button
                onClick={() => setDropOpen((o) => !o)}
                className="flex items-center gap-1.5 text-lg text-white hover:text-[#777777] transition-colors duration-200 tracking-wide"
                aria-expanded={dropOpen}
                aria-haspopup="true"
              >
                Služby
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown panel */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-[#111111] border border-white/[0.08] shadow-2xl transition-all duration-200 origin-top ${
                  dropOpen
                    ? "opacity-100 scale-y-100 pointer-events-auto"
                    : "opacity-0 scale-y-95 pointer-events-none"
                }`}
              >
                {/* Small arrow */}
                <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#111111] border-l border-t border-white/[0.08] rotate-45" />

                <ul className="py-2">
                  {serviceLinks.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/sluzby/${s.slug}`}
                        onClick={() => setDropOpen(false)}
                        className="group flex items-start gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors duration-150 border-l-2 border-transparent hover:border-[#f06820]"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[#f06820] tracking-[0.2em] uppercase font-medium mb-0.5">
                            {s.category}
                          </p>
                          <p className="text-white text-sm font-medium leading-snug group-hover:text-white/90">
                            {s.title}
                          </p>
                        </div>
                        <svg
                          className="w-3.5 h-3.5 mt-[3px] flex-shrink-0 text-white/20 group-hover:text-[#f06820] transition-colors duration-150"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  ))}

                  {/* Divider + homepage anchor */}
                  <li className="border-t border-white/[0.06] mt-1 pt-1">
                    <a
                      href="/#sluzby"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-white/40 hover:text-white/70 transition-colors duration-150"
                    >
                      Všechny služby
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Links after Služby */}
            {afterLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-lg text-white hover:text-[#777777] transition-colors duration-200 tracking-wide"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Instagram icon */}
          <a
            href="https://www.instagram.com/vtp_trcka/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center text-white hover:text-[#777777] transition-colors duration-200"
            aria-label="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

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
            className="lg:hidden p-4 -mr-4 text-white hover:text-[#777777] transition-colors"
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
      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-[600px] border-b border-white/[0.06]" : "max-h-0"
        }`}
      >
        <nav className="px-6 pb-6 pt-2 flex flex-col gap-1 bg-[#080808]/95 backdrop-blur-sm">

          {/* Links before Služby */}
          {beforeLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-white hover:text-[#777777] transition-colors py-2"
            >
              {l.label}
            </a>
          ))}

          {/* Služby expandable */}
          <button
            onClick={() => setServicesOpen((o) => !o)}
            className="flex items-center justify-between w-full text-sm font-normal text-white hover:text-[#777777] transition-colors py-2 bg-transparent"
          >
            <span>Služby</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Service sub-list */}
          <div className={`overflow-hidden transition-all duration-300 ${servicesOpen ? "max-h-96" : "max-h-0"}`}>
            <ul className="pl-3 border-l border-white/[0.08] mb-1 mt-1 space-y-0.5">
              {serviceLinks.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/sluzby/${s.slug}`}
                    onClick={() => { setMenuOpen(false); setServicesOpen(false); }}
                    className="flex items-center justify-between py-2 px-2 text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {s.title}
                    <svg className="w-3 h-3 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links after Služby */}
          {afterLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-white hover:text-[#777777] transition-colors py-2"
            >
              {l.label}
            </a>
          ))}

          <a
            href="https://www.instagram.com/vtp_trcka/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white hover:text-[#777777] transition-colors py-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </a>

          <a
            href="#poptavka"
            onClick={() => setMenuOpen(false)}
            className="btn-primary mt-3 justify-center text-xs tracking-widest"
          >
            Poptat práci
          </a>
        </nav>
      </div>
    </header>
  );
}
