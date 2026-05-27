export default function AboutSection() {
  return (
    <section id="o-nas" className="py-28 border-t border-white/[0.05] bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* Image placeholder */}
        <div className="relative">
          <div className="aspect-[4/3] bg-[#141414] border border-[#2a2a2a] flex items-center justify-center overflow-hidden">
            <div className="flex flex-col items-center gap-3 text-[#2e2e2e]">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs tracking-wider">Fotka týmu</span>
            </div>
          </div>
          {/* Decorative white corner */}
          <div className="absolute -bottom-4 -right-4 w-28 h-28 border border-white/10 pointer-events-none" />
          <div className="absolute -bottom-2 -right-2 w-16 h-16 border border-[#c8a96e]/20 pointer-events-none" />
        </div>

        {/* Text */}
        <div>
          <p className="section-label">O nás</p>
          <div className="section-accent-line" />
          <h2 className="section-heading">
            Děláme práci,
            <br />
            na kterou jsme hrdí.
          </h2>

          <p className="mt-6 text-[#9a9a9a] leading-relaxed">
            Jsme rodinná firma s více než desetiletou tradicí. Zakládáme si na
            poctivém řemesle, spolehlivém přístupu a osobním jednání s každým
            klientem.
          </p>
          <p className="mt-4 text-[#9a9a9a] leading-relaxed">
            Ať už se jedná o malou opravu nebo velkou zakázku — každé práci
            věnujeme stejnou péči a pozornost. Protože věříme, že kvalita se
            vyplácí.
          </p>

          {/* Values */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { title: "Spolehlivost", desc: "Dodržujeme termíny i sliby." },
              { title: "Kvalita", desc: "Používáme jen prověřené materiály." },
              { title: "Transparentnost", desc: "Žádné skryté náklady." },
              { title: "Zkušenosti", desc: "10+ let na trhu." },
            ].map((v) => (
              <div key={v.title} className="border-l-2 border-white/20 pl-4 py-1 hover:border-white/50 transition-colors">
                <div className="text-sm font-semibold text-white">{v.title}</div>
                <div className="text-xs text-[#555555] mt-0.5">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
