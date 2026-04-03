import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ONG CHADIA | Ensemble pour le Tchad",
    template: "%s | ONG CHADIA",
  },
  description:
    "ONG CHADIA agit au Tchad pour la santé communautaire, l'éducation et l'autonomisation des femmes. Découvrez nos projets et comment nous rejoindre.",
  metadataBase: new URL("https://ong-chadia.com"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    siteName: "ONG CHADIA",
    title: "ONG CHADIA | Ensemble pour le Tchad",
    description:
      "ONG CHADIA agit au Tchad pour la santé communautaire, l'éducation et l'autonomisation des femmes.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ONG CHADIA — Ensemble pour le Tchad",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
