export default function KontaktSection() {
  return (
    <footer id="kontakt" className="border-t border-[#1a1a1a]">
      {/* Contact info strip */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-[#c8a96e] text-xs tracking-[0.3em] uppercase mb-4 font-medium">
              Kontakt
            </p>
            <h2 className="section-heading">Pojďme spolupracovat.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Phone */}
            <div className="flex gap-4">
              <div className="w-10 h-10 border border-[#262626] flex items-center justify-center flex-shrink-0 text-[#c8a96e]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-[#555555] uppercase tracking-wide mb-1">
                  Telefon
                </div>
                <a
                  href="tel:+420000000000"
                  className="text-[#f0f0f0] hover:text-[#c8a96e] transition-colors font-medium"
                >
                  +420 000 000 000
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <div className="w-10 h-10 border border-[#262626] flex items-center justify-center flex-shrink-0 text-[#c8a96e]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-[#555555] uppercase tracking-wide mb-1">
                  E-mail
                </div>
                <a
                  href="mailto:info@firma.cz"
                  className="text-[#f0f0f0] hover:text-[#c8a96e] transition-colors font-medium"
                >
                  info@firma.cz
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-4">
              <div className="w-10 h-10 border border-[#262626] flex items-center justify-center flex-shrink-0 text-[#c8a96e]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-[#555555] uppercase tracking-wide mb-1">
                  Adresa
                </div>
                <address className="text-[#f0f0f0] not-italic font-medium leading-relaxed">
                  Ulice 123<br />
                  000 00 Město
                </address>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="border-t border-[#1a1a1a] py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#333333]">
            © {new Date().getFullYear()} NÁZEV FIRMY s.r.o. Všechna práva
            vyhrazena.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-[#333333] hover:text-[#888888] transition-colors"
            >
              Ochrana osobních údajů
            </a>
            <a
              href="#"
              className="text-xs text-[#333333] hover:text-[#888888] transition-colors"
            >
              Obchodní podmínky
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
