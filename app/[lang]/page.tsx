import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";
import { getAccueil } from "@/lib/data/getAccueil";
import { getDomaines } from "@/lib/data/getDomaines";
import { getProjets } from "@/lib/data/getProjets";
import { getContact } from "@/lib/data/getContact";
import Hero from "@/components/sections/Hero";
import ChiffresCles from "@/components/sections/ChiffresCles";
import DomainesSection from "@/components/sections/DomainesSection";
import ProjetsSection from "@/components/sections/ProjetsSection";
import CtaBeneficiaires from "@/components/sections/CtaBeneficiaires";
import EquipePartenaires from "@/components/sections/EquipePartenaires";
import BrochureSection from "@/components/sections/BrochureSection";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const accueil = getAccueil();
  const domaines = getDomaines();
  const projets = getProjets();
  const contact = getContact();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "ONG CHADIA",
    alternateName: "CHADIA",
    url: "https://ong-chadia.com",
    logo: "https://ong-chadia.com/images/logo.png",
    address: {
      "@type": "PostalAddress",
      addressLocality: "N'Djaména",
      addressCountry: "TD",
    },
    areaServed: "TD",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero hero={accueil.hero} labels={dict.accueil.hero} />
      <ChiffresCles chiffres={accueil.chiffres} titre={dict.accueil.chiffres.titre} />
      <DomainesSection domaines={domaines} labels={dict.accueil.domaines} />
      <ProjetsSection projets={projets} labels={dict.accueil.projets} />
      <CtaBeneficiaires
        whatsapp={contact.whatsapp}
        whatsappMessage={accueil.ctaBeneficiaires.whatsappMessage}
        labels={dict.accueil.ctaBeneficiaires}
      />
      <EquipePartenaires
        equipe={accueil.equipe}
        partenaires={accueil.partenaires}
        labels={{
          equipe: dict.accueil.equipe.titre,
          partenaires: dict.accueil.partenaires.titre,
        }}
      />
      <BrochureSection labels={dict.accueil.brochure} />
    </>
  );
}
