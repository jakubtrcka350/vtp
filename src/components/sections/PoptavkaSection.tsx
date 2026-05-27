"use client";

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
    <section id="poptavka" className="min-h-screen flex items-center relative overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Warm glow */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#c8a96e] opacity-[0.035] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-32 w-full grid md:grid-cols-2 gap-16 items-center relative z-10">

        {/* Left — headline */}
        <div>
          <p className="section-label">Váš spolehlivý partner</p>
          <div className="section-accent-line" />
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
            Máte
            <br />
            projekt?
            <span className="text-[#c8a96e]">.</span>
          </h1>
          <p className="mt-6 text-[#9a9a9a] text-lg leading-relaxed max-w-md">
            Popište nám, co potřebujete. Ozveme se vám co nejdříve
            s&nbsp;nezávaznou nabídkou.
          </p>

          {/* Stats */}
          <div className="mt-12 flex gap-10">
            {[
              { value: "10+", label: "Let zkušeností" },
              { value: "200+", label: "Spokojených klientů" },
              { value: "100%", label: "Dokončených zakázek" },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-white tracking-tight">
                  {s.value}
                </div>
                <div className="text-[10px] text-[#555555] mt-1.5 tracking-widest uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="bg-[#0f0f0f] border border-[#2a2a2a] p-8 relative">
          {/* White top accent line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-white opacity-10" />

          {status === "sent" ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <div className="w-14 h-14 border border-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Poptávka odeslána!</h3>
              <p className="text-[#9a9a9a] text-sm">Ozveme se vám co nejdříve.</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 text-xs text-[#555555] hover:text-white underline underline-offset-4 transition-colors"
              >
                Odeslat další
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-base font-semibold text-white mb-6 tracking-wide">
                Nezávazná poptávka
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-[#555555] mb-1.5 tracking-widest uppercase">
                      Jméno *
                    </label>
                    <input type="text" required className="input-field" placeholder="Jan Novák"
                      value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#555555] mb-1.5 tracking-widest uppercase">
                      Telefon
                    </label>
                    <input type="tel" className="input-field" placeholder="+420 000 000 000"
                      value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-[#555555] mb-1.5 tracking-widest uppercase">
                    E-mail *
                  </label>
                  <input type="email" required className="input-field" placeholder="jan@example.cz"
                    value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-[10px] text-[#555555] mb-1.5 tracking-widest uppercase">
                    Popis projektu *
                  </label>
                  <textarea required rows={4} className="input-field resize-none"
                    placeholder="Stručně popište, co potřebujete..."
                    value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
                </div>

                {status === "error" && (
                  <p className="text-red-400 text-xs">Něco se pokazilo. Zkuste to prosím znovu.</p>
                )}

                <button type="submit" disabled={status === "sending"} className="btn-primary justify-center mt-2 disabled:opacity-50 tracking-widest">
                  {status === "sending" ? "Odesílám..." : "Odeslat poptávku"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="text-[10px] tracking-widest text-white uppercase">Scroll</span>
        <div className="w-px h-8 bg-white animate-pulse" />
      </div>
    </section>
  );
}
