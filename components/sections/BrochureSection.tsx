interface BrochureSectionProps {
  labels: {
    titre: string;
    bouton: string;
  };
}

export default function BrochureSection({ labels }: BrochureSectionProps) {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {labels.titre}
        </h2>
        <a
          href="/documents/brochure-chadia.pdf"
          download
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-700 text-white font-semibold rounded-lg hover:bg-orange-800 transition-colors"
          aria-label={labels.bouton}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {labels.bouton}
        </a>
      </div>
    </section>
  );
}
