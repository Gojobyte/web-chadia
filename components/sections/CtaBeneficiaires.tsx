interface CtaBeneficiairesProps {
  whatsapp: string;
  whatsappMessage: string;
  labels: {
    titre: string;
    texte: string;
    bouton: string;
  };
}

export default function CtaBeneficiaires({
  whatsapp,
  whatsappMessage,
  labels,
}: CtaBeneficiairesProps) {
  // Nettoyer le numéro WhatsApp (retirer espaces, [A VALIDER], etc.)
  const cleanNumber = whatsapp.replace(/[^+\d]/g, "");
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section className="bg-green-700 text-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          {labels.titre}
        </h2>
        <p className="text-green-100 text-lg mb-8">
          {labels.texte}
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-green-700 font-bold rounded-lg hover:bg-green-50 transition-colors text-lg"
          aria-label={labels.bouton}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.61.61l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.488-.656-6.333-1.793l-.378-.238-3.273 1.097 1.097-3.273-.238-.378A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
          {labels.bouton}
        </a>
      </div>
    </section>
  );
}
