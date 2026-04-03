import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary } from "@/lib/i18n";
import { getContact } from "@/lib/data/getContact";
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
  title: "ONG CHADIA | Ensemble pour le Tchad",
  description:
    "ONG CHADIA agit au Tchad pour la santé communautaire, l'éducation et l'autonomisation des femmes. Découvrez nos projets et comment nous rejoindre.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dict = getDictionary("fr");
  const contact = getContact();

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header nav={dict.nav} />
        <main className="flex-1">{children}</main>
        <Footer footer={dict.footer} nav={dict.nav} contact={contact} />
        <SpeedInsights />
      </body>
    </html>
  );
}
