import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <h1 className="text-5xl font-bold text-gray-300 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mb-3">
        Page introuvable
      </h2>
      <p className="text-gray-600 mb-8">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 bg-orange-700 text-white font-semibold rounded-lg hover:bg-orange-800 transition-colors"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
