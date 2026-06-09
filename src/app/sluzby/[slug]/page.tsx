import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ServiceCarousel from "@/components/ServiceCarousel";
import { services } from "@/lib/services";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services
    .filter((s) => !s.cta)
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `${service.title} — VTP Trčka`,
    description: service.desc,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug && !s.cta);
  if (!service) notFound();

  return (
    <>
      <Navbar />

      <main className="pt-[90px] min-h-dvh flex flex-col lg:flex-row">

        {/* ── Left: photo carousel ──────────────────────────────── */}
        <div className="w-full h-[60vw] min-h-[280px] max-h-[500px] lg:h-[calc(100dvh-90px)] lg:max-h-none lg:w-1/2 lg:sticky lg:top-[90px]">
          <ServiceCarousel photos={service.photos} title={service.title} />
        </div>

        {/* ── Right: info panel ─────────────────────────────────── */}
        <div className="w-full lg:w-1/2 bg-white flex flex-col px-8 py-10 lg:px-14 lg:py-16 border-t border-[#e8e8e8] lg:border-t-0 lg:border-l lg:overflow-y-auto lg:max-h-[calc(100dvh-90px)]">

          {/* Back link */}
          <Link
            href="/#sluzby"
            className="inline-flex items-center gap-2 text-[#aaaaaa] hover:text-[#0a0a0a] text-sm transition-colors mb-6 lg:mb-10 py-2 group w-fit"
          >
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zpět na služby
          </Link>

          {/* Category + title */}
          <div className="mb-8">
            <p className="text-[#f06820] text-[10px] tracking-[0.3em] uppercase font-medium mb-3">
              {service.category}
            </p>
            <h1 className="text-[#0a0a0a] font-bold text-3xl lg:text-4xl leading-tight">
              {service.title}
            </h1>
          </div>

          {/* Accent line */}
          <div
            className="h-px w-12 mb-8"
            style={{ background: "linear-gradient(to right, #f06820, #0047AB)" }}
          />

          {/* Detail text */}
          <div className="flex-1 mb-10">
            {/* Intro paragraph */}
            {service.detail && (
              <p className="text-[#555555] text-base font-serif leading-[1.9] mb-8 max-w-prose">
                {service.detail}
              </p>
            )}

            {/* Sub-services list */}
            {service.subServices && service.subServices.length > 0 && (
              <ul className="space-y-6">
                {service.subServices.map((sub, i) => (
                  <li key={i} className="flex gap-4">
                    {/* Accent dot */}
                    <div className="mt-[7px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#f06820]" />
                    <div>
                      <h3 className="text-[#0a0a0a] font-semibold text-sm mb-1">
                        {sub.title}
                      </h3>
                      <p className="text-[#666666] text-sm leading-relaxed">
                        {sub.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* CTA */}
          <div className="border-t border-[#eeeeee] pt-8">
            <p className="text-[#888888] text-sm mb-4">
              Potřebujete poradit nebo máte zájem?
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link href="/#poptavka" className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white px-6 py-3 font-semibold text-sm tracking-wide transition-all duration-200 hover:bg-[#f06820] active:scale-[0.98]">
                Poptat nezávazně
              </Link>
              <div className="flex flex-col gap-1.5">
                <a
                  href="tel:+420731863896"
                  className="inline-flex items-center gap-2 text-[#0a0a0a] hover:text-[#f06820] transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +420 731 863 896
                </a>
                <a
                  href="tel:+420603162571"
                  className="inline-flex items-center gap-2 text-[#0a0a0a] hover:text-[#f06820] transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +420 603 162 571
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
