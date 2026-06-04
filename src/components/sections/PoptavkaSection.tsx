"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

// ── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1500, start = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);

  return value;
}

const stats = [
  { raw: 25, suffix: "+", label: "let zkušeností" },
  { raw: 200, suffix: "+", label: "spokojených klientů" },
  { raw: 100, suffix: "%", label: "dokončených zakázek" },
];

function StatItem({ raw, suffix, label, animate }: typeof stats[0] & { animate: boolean }) {
  const value = useCountUp(raw, 1200, animate);
  return (
    <div>
      <div className="text-2xl font-bold text-white tracking-tight tabular-nums">
        {value}{suffix}
      </div>
      <div className="text-[10px] text-white mt-1 tracking-widest uppercase leading-tight">{label}</div>
    </div>
  );
}

export default function PoptavkaSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Trigger count-up when stats scroll into view
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsVisible(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
    <section id="poptavka" className="relative min-h-dvh flex items-center overflow-hidden">

      {/* ── Background ──────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <Image
          src="/images/background.jpeg"
          alt="Instalatérské práce VTP Trčka"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#080808]/65" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[400px] bg-[#f06820] opacity-[0.12] blur-3xl" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-[0.04] blur-3xl" />
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 lg:pt-48 pb-20">
        <div className="grid lg:grid-cols-[1fr_560px] gap-10 lg:gap-16 items-center">

          {/* Left — headline block */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-6 h-px bg-[#f06820]" />
              <p className="text-[#f06820] text-xs tracking-[0.35em] uppercase font-medium">
                Váš spolehlivý partner
              </p>
            </div>

            <h1 className="text-[clamp(2rem,8vw,6rem)] font-bold text-white leading-[1.0] tracking-tight">
              <span className="text-cobalt">Voda</span>, <span className="text-accent">teplo</span> a plyn,
              <br />
              <span className="text-white/55">jak má</span>
              <br />
              vždy být.
            </h1>

            <p className="mt-8 text-white text-lg leading-relaxed max-w-[420px]">
              Vodo-topo-plyn, čištění potrubí, kamerové zkoušky a stavební práce s více než desetiletou praxí.
              Poptejte práci — odpovíme do 24 hodin.
            </p>

            <div className="mt-10 mb-10 w-full max-w-[420px] h-px bg-accent/60" />

            {/* Stats — count-up on scroll into view */}
            <div ref={statsRef} className="flex flex-wrap items-center gap-y-4">
              {stats.map((s, i) => (
                <div key={i} className="flex items-stretch">
                  <div className="pr-8">
                    <StatItem {...s} animate={statsVisible} />
                  </div>
                  {i < 2 && <div className="w-px bg-accent mr-8 my-0.5" />}
                </div>
              ))}
            </div>
          </div>

          {/* Right — form card */}
          <div className="relative w-full">
            <div className="bg-black/35 backdrop-blur-sm p-7 rounded-xl border border-white/10">
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
                        <label htmlFor="contact-name" className="block text-[10px] text-white/50 mb-1.5 tracking-widest uppercase">
                          Jméno a příjmení *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          autoComplete="name"
                          className="input-field bg-white/90 text-black placeholder-black/40"
                          placeholder="Jan Novák"
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-phone" className="block text-[10px] text-white/50 mb-1.5 tracking-widest uppercase">
                          Telefon
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          autoComplete="tel"
                          className="input-field bg-white/90 text-black placeholder-black/40"
                          placeholder="+420 123 456 789"
                          value={form.phone}
                          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-[10px] text-white/50 mb-1.5 tracking-widest uppercase">
                        E-mail *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        autoComplete="email"
                        className="input-field bg-white/90 text-black placeholder-black/40"
                        placeholder="jan.novak@ukazka.cz"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-[10px] text-white/50 mb-1.5 tracking-widest uppercase">
                        Popis projektu *
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        autoComplete="off"
                        className="input-field bg-white/90 resize-none text-black placeholder-black/40"
                        placeholder="Potřebuji vyměnit staré potrubí v koupelně a kuchyni, ..."
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      />
                    </div>

                    {status === "error" && (
                      <p role="alert" className="text-red-400 text-xs">
                        Něco se pokazilo. Zkuste to prosím znovu.
                      </p>
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
          </div>
        </div>
      </div>
    </section>
  );
}
