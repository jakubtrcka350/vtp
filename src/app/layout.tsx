import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NÁZEV FIRMY — Váš spolehlivý partner",
  description:
    "Profesionální služby s důrazem na kvalitu a spolehlivost. Kontaktujte nás ještě dnes.",
  openGraph: {
    title: "NÁZEV FIRMY",
    description: "Profesionální služby s důrazem na kvalitu.",
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
