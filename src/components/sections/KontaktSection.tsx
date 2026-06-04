export default function KontaktSection() {
  return (
    <footer id="kontakt" className="border-t border-[#e5e5e5]">

      {/* Contact info strip — white */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-[#f06820] text-xs tracking-[0.3em] uppercase mb-4 font-medium">
              Kontakt
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] tracking-tight">
              Pojďme spolupracovat.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Phone */}
            <div className="flex gap-4">
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
            <div className="flex gap-4">
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
            <div className="flex gap-4">
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
      <div className="bg-[#0a0a0a] py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} VTP Trčka. Všechna práva vyhrazena.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/50 hover:text-[#888888] transition-colors">
              Ochrana osobních údajů
            </a>
            <a href="#" className="text-xs text-white/50 hover:text-[#888888] transition-colors">
              Obchodní podmínky
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
