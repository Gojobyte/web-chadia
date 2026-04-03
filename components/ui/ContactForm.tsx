"use client";

import { useState } from "react";
import Link from "next/link";

interface ContactFormProps {
  labels: {
    nom: string;
    email: string;
    sujet: string;
    message: string;
    consentement: string;
    envoyer: string;
    envoyerEnCours: string;
  };
  sujets: {
    partenariat: string;
    don: string;
    benevolat: string;
    aide: string;
    autre: string;
  };
  succes: string;
  erreur: string;
  mentionsLegalesLabel: string;
}

export default function ContactForm({ labels, sujets, succes, erreur, mentionsLegalesLabel }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: data.get("nom"),
          email: data.get("email"),
          sujet: data.get("sujet"),
          message: data.get("message"),
          fax: data.get("fax"),
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6" aria-live="polite">
        <p className="text-green-800">{succes}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4" aria-live="polite">
          <p className="text-red-800 text-sm">{erreur}</p>
        </div>
      )}

      {/* Honeypot */}
      <input
        name="fax"
        type="text"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
      />

      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
          {labels.nom}
        </label>
        <input
          id="nom"
          name="nom"
          type="text"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          {labels.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      <div>
        <label htmlFor="sujet" className="block text-sm font-medium text-gray-700 mb-1">
          {labels.sujet}
        </label>
        <select
          id="sujet"
          name="sujet"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="partenariat">{sujets.partenariat}</option>
          <option value="don">{sujets.don}</option>
          <option value="benevolat">{sujets.benevolat}</option>
          <option value="aide">{sujets.aide}</option>
          <option value="autre">{sujets.autre}</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          {labels.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      <div className="flex items-start gap-2">
        <input
          id="consentement"
          name="consentement"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 text-orange-700 focus:ring-orange-500 border-gray-300 rounded"
        />
        <label htmlFor="consentement" className="text-sm text-gray-600">
          {labels.consentement}{" "}
          <Link href="/mentions-legales#confidentialite" className="text-orange-700 underline">
            {mentionsLegalesLabel}
          </Link>
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full px-6 py-3 bg-orange-700 text-white font-semibold rounded-lg hover:bg-orange-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? labels.envoyerEnCours : labels.envoyer}
      </button>
    </form>
  );
}
