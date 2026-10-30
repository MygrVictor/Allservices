import { Resend } from "resend";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type EmailBookingItem = {
  name: string;
  quantity: number;
  unitPriceCents: number;
};

type EmailPayload = {
  bookingId: string;
  orderNumber: number;
  audience: "proprietaire" | "vacancier";
  clientNom: string;
  clientEmail: string;
  clientTelephone?: string | null;
  dateArrivee: Date;
  dateDepart: Date;
  residence?: string | null;
  propertyReference?: string | null;
  creneauLivraison?: string | null;
  totalCents: number;
  items: EmailBookingItem[];
  /** Bons PDF (linge et/ou ski) joints au mail, avec leur lien de téléchargement. */
  documents?: {
    kind: "linge" | "ski";
    filename: string;
    pdf: Uint8Array;
    url?: string;
  }[];
};

function formatEuros(cents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export async function sendBookingEmails(payload: EmailPayload) {
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.EMAIL_FROM ||
    !process.env.EMAIL_TO_MANAGER
  ) {
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const summary = payload.items
    .map(
      (item) =>
        `- ${item.name} x${item.quantity} (${formatEuros(item.unitPriceCents)})`,
    )
    .join("\n");

  const period = `${format(payload.dateArrivee, "dd/MM/yyyy", { locale: fr })} → ${format(
    payload.dateDepart,
    "dd/MM/yyyy",
    { locale: fr },
  )}`;

  const docs = payload.documents ?? [];
  const attachments = docs.length
    ? docs.map((d) => ({
        filename: d.filename,
        content: Buffer.from(d.pdf),
      }))
    : undefined;
  const docLabel = (kind: "linge" | "ski") =>
    kind === "ski"
      ? "Bon de retrait ski (valable dans n'importe quel magasin Skiset de votre station)"
      : "Bon de commande linge / conciergerie";
  const docsText = docs.length
    ? `Vos documents (en pièce jointe) :\n${docs
        .map((d) => `- ${docLabel(d.kind)}${d.url ? ` : ${d.url}` : ""}`)
        .join("\n")}\n\n`
    : "";

  await Promise.all([
    resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: payload.clientEmail,
      subject: "All Services Montagne - Votre bon de commande",
      attachments,
      text:
        `Bonjour ${payload.clientNom},\n\n` +
        `Votre paiement est confirmé.\n\n` +
        docsText +
        `Période : ${period}\n` +
        `${payload.residence ? `Résidence : ${payload.residence}\n` : ""}` +
        `${payload.propertyReference ? `Bien : ${payload.propertyReference}\n` : ""}` +
        `${payload.creneauLivraison ? `Créneau : ${payload.creneauLivraison}\n` : ""}` +
        `\nPrestations :\n${summary}\n\n` +
        `Total payé : ${formatEuros(payload.totalCents)}\n\n` +
        `Merci et à bientôt sur Les Arcs.`,
    }),
    resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO_MANAGER,
      subject: `Nouvelle réservation #${payload.orderNumber}`,
      attachments,
      text:
        `Nouvelle réservation confirmée\n\n` +
        `Client : ${payload.clientNom} (${payload.clientEmail})\n` +
        `${payload.clientTelephone ? `Téléphone : ${payload.clientTelephone}\n` : ""}` +
        `Public : ${payload.audience}\n` +
        `Période : ${period}\n` +
        `${payload.residence ? `Résidence : ${payload.residence}\n` : ""}` +
        `${payload.propertyReference ? `Bien : ${payload.propertyReference}\n` : ""}` +
        `${payload.creneauLivraison ? `Créneau : ${payload.creneauLivraison}\n` : ""}` +
        `\nPrestations :\n${summary}\n\n` +
        `Total : ${formatEuros(payload.totalCents)}`,
    }),
  ]);
}

export type ContactMessage = {
  prenom: string;
  telephone: string;
  email: string;
  sujet: string;
  message: string;
};

/** Envoie le message du formulaire de contact à l'équipe. Retourne false si l'envoi est impossible. */
export async function sendContactEmail(contact: ContactMessage) {
  const to = process.env.EMAIL_TO_CONTACT ?? process.env.EMAIL_TO_MANAGER;
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || !to) {
    console.warn("Email non configuré : message de contact non envoyé.", {
      sujet: contact.sujet,
    });
    return false;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    replyTo: contact.email,
    subject: `[Site] ${contact.sujet} — ${contact.prenom}`,
    text:
      `Nouveau message depuis le formulaire de contact\n\n` +
      `Prénom : ${contact.prenom}\n` +
      `Téléphone : ${contact.telephone}\n` +
      `Email : ${contact.email}\n` +
      `Sujet : ${contact.sujet}\n\n` +
      `${contact.message}`,
  });

  if (error) {
    console.error("Erreur d'envoi du message de contact", error);
    return false;
  }
  return true;
}
