import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom, email, sujet, message, fax } = body;

    // Honeypot — si rempli, c'est un bot
    if (fax) {
      return NextResponse.json({ ok: true });
    }

    // Vérification RESEND_API_KEY
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY manquante");
      return NextResponse.json(
        { error: "Configuration serveur incomplète" },
        { status: 503 }
      );
    }

    // Validation côté serveur
    if (!nom || !email || !sujet || !message) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Routing email selon le sujet
    const destinataire =
      sujet === "partenariat"
        ? process.env.CONTACT_EMAIL_PARTENARIAT || process.env.CONTACT_EMAIL_GENERAL
        : process.env.CONTACT_EMAIL_GENERAL;

    if (!destinataire) {
      console.error("CONTACT_EMAIL_GENERAL manquante");
      return NextResponse.json(
        { error: "Configuration serveur incomplète" },
        { status: 503 }
      );
    }

    // Envoi via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Formulaire ONG CHADIA <contact@ong-chadia.com>",
        to: destinataire,
        subject: `[Contact Site] ${sujet} — ${nom}`,
        text: `Nom: ${nom}\nEmail: ${email}\nSujet: ${sujet}\n\nMessage:\n${message}`,
      }),
    });

    if (!res.ok) {
      const resendError = await res.text();
      console.error("Erreur Resend:", res.status, resendError);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi", details: resendError },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    console.error("Erreur serveur contact");
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
