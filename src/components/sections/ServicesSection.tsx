const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Služba 1",
    desc: "Zde bude popis první nabízené služby. Doplňte konkrétní informace o tom, co nabízíte.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Služba 2",
    desc: "Zde bude popis druhé nabízené služby. Doplňte konkrétní informace o tom, co nabízíte.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Služba 3",
    desc: "Zde bude popis třetí nabízené služby. Doplňte konkrétní informace o tom, co nabízíte.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "Služba 4",
    desc: "Zde bude popis čtvrté nabízené služby. Doplňte konkrétní informace o tom, co nabízíte.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Služba 5",
    desc: "Zde bude popis páté nabízené služby. Doplňte konkrétní informace o tom, co nabízíte.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Konzultace",
    desc: "Poradíme vám zdarma a bez závazků. Kontaktujte nás a společně najdeme nejlepší řešení.",
  },
];

export default function ServicesSection() {
  return (
    <section id="sluzby" className="py-28 border-t border-white/[0.05] bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <p className="section-label">Služby</p>
          <div className="section-accent-line" />
          <h2 className="section-heading">Co umíme.</h2>
          <p className="section-subheading">
            Nabízíme komplexní řešení pro vaše potřeby. Každou zakázku přistupujeme individuálně.
          </p>
        </div>

        {/* Grid separated by 1px white/dark lines */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
          {services.map((s, i) => (
            <div
              key={i}
              className="bg-[#0d0d0d] p-8 group hover:bg-[#111111] transition-colors duration-300 relative"
            >
              {/* Top border on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              <div className="text-white/30 group-hover:text-white/60 mb-5 transition-colors duration-300">
                {s.icon}
              </div>
              <h3 className="font-semibold text-white mb-3 text-base">{s.title}</h3>
              <p className="text-[#555555] text-sm leading-relaxed group-hover:text-[#777777] transition-colors duration-300">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <a href="#poptavka" className="btn-primary">
            Nezávazně poptat
          </a>
        </div>
      </div>
    </section>
  );
}
