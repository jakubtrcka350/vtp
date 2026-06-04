import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VTP Trčka — Vodoinstalatérství a topenářství",
  description:
    "Odborné vodoinstalatérské a topenářské práce. Instalace kotlů, podlahové vytápění, rekonstrukce koupelen. Nezávazná poptávka zdarma.",
  openGraph: {
    title: "VTP Trčka",
    description: "Odborné vodoinstalatérství a topenářství.",
    locale: "cs_CZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="bg-bg text-text-primary antialiased">
        {/* Skip to main content — visible on keyboard focus only */}
        <a
          href="#poptavka"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-white focus:text-[#0a0a0a] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg"
        >
          Přeskočit na obsah
        </a>
        {children}
      </body>
    </html>
  );
}
