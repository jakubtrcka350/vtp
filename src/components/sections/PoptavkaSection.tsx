"use client";

import Image from "next/image";
import { useState } from "react";

export default function PoptavkaSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="poptavka" className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── Background ────────────────────────────────────────────── */}
      {/*
        Replace this div with a real hero photo when the client provides one:

        Then change the overlay opacity to ~0.75
      */}
      <div className="absolute inset-0">
        <Image src="/images/hero.jpeg" alt="Hero" fill className="object-cover" priority />
        {/* Dark overlay — keeps text readable */}
        <div className="absolute inset-0 bg-[#080808]/80" />
        {/* Warm glow — bottom-left */}
        <div className="absolute bottom-0 left-0 w-[700px] h-[400px] bg-[#f06820] opacity-[0.12] blur-3xl" />
        {/* Cool glow — top-right */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-[0.04] blur-3xl" />
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 lg:pt-48 pb-20">
        <div className="grid lg:grid-cols-[1fr_560px] gap-10 lg:gap-16 items-center">

          {/* Left — headline block */}
          <div className="flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-6 h-px bg-[#f06820]" />
              <p className="text-[#f06820] text-xs tracking-[0.35em] uppercase font-medium">
                Váš spolehlivý partner
              </p>
            </div>

            {/* Main headline */}
            <h1 className="text-[clamp(2rem,8vw,6rem)] font-bold text-white leading-[1.0] tracking-tight">
              <span className="text-cobalt">Voda</span>, <span className="text-accent">teplo</span> a plyn,
              <br />
              <span className="text-white/40">jak má</span>
              <br />
              vždy být.
            </h1>

            {/* Sub-headline */}
            <p className="mt-8 text-white text-lg leading-relaxed max-w-[420px]">
              Vodo-topo-plyn, čištění potrubí, kamerové zkoušky a stavební práce s více než desetiletou praxí.
              Poptejte práci — odpovíme do 24 hodin.
            </p>

            {/* Divider */}
            <div className="mt-10 mb-10 w-full max-w-[420px] h-px bg-accent/60" />

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-y-4">
              {[
                { value: "10+", label: "let zkušeností" },
                { value: "200+", label: "spokojených klientů" },
                { value: "100%", label: "dokončených zakázek" },
              ].map((s, i) => (
                <div key={i} className="flex items-stretch">
                  <div className="pr-8">
                    <div className="text-2xl font-bold text-white tracking-tight">{s.value}</div>
                    <div className="text-[10px] text-white mt-1 tracking-widest uppercase leading-tight">{s.label}</div>
                  </div>
                  {i < 2 && <div className="w-px bg-accent mr-8 my-0.5" />}
                </div>
              ))}
            </div>
          </div>

          {/* Right — form card */}
          <div className="relative w-full">
            {/* Gradient border wrapper: 1px gradient bg + inner card fills the rest */}
            {/* style={{ background: "linear-gradient(to bottom right, #f06820, #0047AB)", padding: "1px" }} className="rounded-xl*/}
            <div>
            <div className="backdrop-blur-xs p-7 rounded-xl">
              {status === "sent" ? (
                <div className="flex flex-col items-center justify-center py-14 text-center gap-5">
                  <div className="w-14 h-14 border border-white/70 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Poptávka odeslána!</h3>
                    <p className="text-white/50 text-sm mt-2">Ozveme se vám do 24 hodin.</p>
                  </div>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-xs text-white/50 hover:text-white underline underline-offset-4 transition-colors"
                  >
                    Odeslat další
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-white font-semibold text-base tracking-wide">
                      Nezávazná poptávka
                    </h2>
                    <p className="text-white/40 text-xs mt-1">Vyplňte formulář a my se ozveme.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-white/50 mb-1.5 tracking-widest uppercase">Jméno a příjmení *</label>
                        <input type="text" required className="input-field bg-white/90 text-black" placeholder="Jan Novák"
                          value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/50 mb-1.5 tracking-widest uppercase">Telefon</label>
                        <input type="tel" className="input-field bg-white/90 text-black" placeholder="+420 123 456 789"
                          value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-white/50 mb-1.5 tracking-widest uppercase">E-mail *</label>
                      <input type="email" required className="input-field bg-white/90 text-black" placeholder="jan.novak@ukazka.cz"
                        value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                    </div>

                    <div>
                      <label className="block text-[10px] text-white/50 mb-1.5 tracking-widest uppercase">Popis projektu *</label>
                      <textarea required rows={4} className="input-field bg-white/90 resize-none text-black" 
                        placeholder="Potřebuji vyměnit staré potrubí v koupelně a kuchyni, ..."
                        value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
                    </div>

                    {status === "error" && (
                      <p className="text-red-400 text-xs">Něco se pokazilo. Zkuste to prosím znovu.</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="btn-primary justify-center mt-1 tracking-widest disabled:opacity-50"
                    >
                      {status === "sending" ? "Odesílám..." : "Odeslat poptávku"}
                    </button>

                    <p className="text-white/50 text-[10px] text-center tracking-wide">
                      Bez závazků · Odpovíme do 24 hodin
                    </p>
                  </form>
                </>
              )}
            </div>
            </div>{/* end gradient wrapper */}
          </div>
        </div>
      </div>
    </section>
  );
}

