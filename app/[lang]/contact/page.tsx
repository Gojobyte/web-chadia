import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";
import { getContact } from "@/lib/data/getContact";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Contact | ONG CHADIA",
  description:
    "Contactez l'ONG CHADIA par formulaire, email, téléphone ou WhatsApp. Partenariats, dons, bénévolat ou demande d'aide.",
};

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const contact = getContact();
  const t = dict.contact;
  const cleanWhatsapp = contact.whatsapp.replace(/[^+\d]/g, "");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
        {t.titre}
      </h1>

      {/* WhatsApp EN PREMIER */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-10">
        <a
          href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Bonjour ONG CHADIA, j'ai besoin d'information.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors"
          aria-label={t.whatsapp}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.61.61l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.488-.656-6.333-1.793l-.378-.238-3.273 1.097 1.097-3.273-.238-.378A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
          {t.whatsapp}
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Formulaire */}
        <div>
          <ContactForm
            labels={t.formulaire}
            sujets={t.sujets}
            succes={t.succes}
            erreur={t.erreur}
            mentionsLegalesLabel={dict.legal.titre}
          />
        </div>

        {/* Coordonnées */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.coordonnees}</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <a href={`mailto:${contact.email}`} className="text-orange-700 hover:underline">
                {contact.email}
              </a>
            </div>
            <div>
              <p className="font-medium text-gray-900">Téléphone</p>
              <p>{contact.telephone.replace(/\s*\[A VALIDER\]\s*/g, "")}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Adresse</p>
              <p>{contact.adresse.replace(/\s*\[A VALIDER\]\s*/g, "")}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Horaires</p>
              <p>{contact.horaires}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
