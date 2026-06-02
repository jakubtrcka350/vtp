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
      <body className="bg-bg text-text-primary antialiased">{children}</body>
    </html>
  );
}
