import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";
import { getAccueil } from "@/lib/data/getAccueil";
import Hero from "@/components/sections/Hero";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const accueil = getAccueil();

  return (
    <>
      <Hero hero={accueil.hero} labels={dict.accueil.hero} />

      {/* Sections suivantes — Stories 2.2 à 2.7 */}
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-sm text-gray-400">
        Les sections Chiffres, Domaines, Projets, CTA, Équipe et Partenaires arrivent dans les prochaines stories.
      </div>
    </>
  );
}
