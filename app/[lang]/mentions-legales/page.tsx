import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Mentions Légales",
  robots: "noindex, follow",
};

export default async function MentionsLegalesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {dict.legal.titre}
      </h1>

      {/* Mentions légales */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mentions légales</h2>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Dénomination :</strong> ONG CHADIA</p>
          <p><strong>Siège social :</strong> N&apos;Djaména, Tchad</p>
          <p><strong>Directeur de la publication :</strong> Le Directeur Exécutif de l&apos;ONG CHADIA</p>
          <p><strong>Hébergement :</strong> Vercel Inc., San Francisco, CA, USA</p>
        </div>
      </section>

      {/* Politique de confidentialité */}
      <section id="confidentialite">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Politique de confidentialité</h2>
        <div className="text-sm text-gray-700 space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Données collectées</h3>
            <p>Lors de l&apos;utilisation du formulaire de contact, nous collectons : votre nom, votre adresse email, le sujet de votre demande et le contenu de votre message.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Finalité du traitement</h3>
            <p>Vos données sont utilisées uniquement pour répondre à votre demande de contact. Elles ne sont jamais vendues, partagées ou utilisées à des fins commerciales.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Durée de conservation</h3>
            <p>Vos données sont conservées pendant une durée maximale de 6 mois après le dernier échange, puis supprimées.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Vos droits</h3>
            <p>Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous à l&apos;adresse : contact@ong-chadia.com</p>
          </div>
        </div>
      </section>
    </div>
  );
}
