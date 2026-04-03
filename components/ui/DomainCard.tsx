import Link from "next/link";
import Image from "next/image";

interface DomainCardProps {
  id: string;
  titre: string;
  icone: string;
  description: string;
  variant?: "full" | "compact";
  enSavoirPlus?: string;
}

const domainImages: Record<string, string> = {
  sante: "/images/domaines/sante.jpg",
  education: "/images/domaines/education.jpg",
  femmes: "/images/domaines/femmes.jpg",
  eau: "/images/domaines/eau.jpg",
  urgences: "/images/domaines/urgences.jpg",
};

export default function DomainCard({
  id,
  titre,
  icone,
  description,
  variant = "full",
  enSavoirPlus,
}: DomainCardProps) {
  if (variant === "compact") {
    return (
      <a
        href={`#domaine-${id}`}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow text-sm whitespace-nowrap"
      >
        <span className="text-xl">{icone}</span>
        <span className="font-medium text-gray-800">{titre}</span>
      </a>
    );
  }

  const imageSrc = domainImages[id];

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {imageSrc && (
        <div className="relative h-40">
          <Image
            src={imageSrc}
            alt={titre}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{icone}</span>
          <h3 className="text-lg font-semibold text-gray-900">{titre}</h3>
        </div>
        <p className="text-sm text-gray-600 flex-1">{description}</p>
        <Link
          href={`/domaines#domaine-${id}`}
          className="mt-4 text-sm font-medium text-orange-700 hover:text-orange-800 transition-colors"
        >
          {enSavoirPlus || "En savoir plus"} →
        </Link>
      </div>
    </div>
  );
}
