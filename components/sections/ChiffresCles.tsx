import type { ChiffreCle } from "@/lib/types";

interface ChiffresClesProps {
  chiffres: ChiffreCle[];
  titre: string;
}

export default function ChiffresCles({ chiffres, titre }: ChiffresClesProps) {
  return (
    <section id="chiffres" className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
          {titre}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {chiffres.map((chiffre, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-orange-700">
                {chiffre.valeur}
                {chiffre.unite && (
                  <span className="text-lg ml-1">{chiffre.unite}</span>
                )}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                {chiffre.label.replace(/\s*\[A VALIDER\]\s*/g, "")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
