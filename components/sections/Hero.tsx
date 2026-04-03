import Link from "next/link";
import Image from "next/image";
import type { Accueil } from "@/lib/types";

interface HeroProps {
  hero: Accueil["hero"];
  labels: {
    ctaProjets: string;
    ctaContact: string;
  };
}

export default function Hero({ hero, labels }: HeroProps) {
  return (
    <section className="relative text-white overflow-hidden">
      {/* Image de fond */}
      <Image
        src="/images/hero/hero-bg.jpg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      {/* Overlay sombre pour lisibilité du texte */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-orange-800/70 to-amber-700/70" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          {hero.titre}
        </h1>

        <p className="text-lg sm:text-xl text-orange-100 max-w-2xl mx-auto mb-6">
          {hero.tagline}
        </p>

        {/* Badge PRECOM */}
        {hero.precomBadge.visible && (
          <p className="inline-block bg-white/15 backdrop-blur-sm text-orange-50 text-sm px-4 py-2 rounded-full mb-8">
            {hero.precomBadge.texte}
          </p>
        )}

        {/* Boutons CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <a
            href="#projets"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-700 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
          >
            {labels.ctaProjets}
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            {labels.ctaContact}
          </Link>
        </div>
      </div>
    </section>
  );
}
