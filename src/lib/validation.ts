import { z } from "zod";

export const audienceSchema = z.enum(["proprietaire", "vacancier"]);
export const residenceSchema = z.enum(["arc_1800", "arc_2000"]);

export const bookingItemSchema = z.object({
  productCode: z.string().min(1),
  quantity: z.number().int().min(1),
});

export const checkoutPayloadSchema = z
  .object({
    // La commande directe est réservée aux vacanciers (propriétaires : contact)
    targetAudience: z.literal("vacancier"),
    residence: residenceSchema,
    dateArrivee: z.string().date(),
    dateDepart: z.string().date(),
    /** livraison = 17h-19h planifiée par l'équipe ; retrait = en magasin */
    modeRecuperation: z.enum(["livraison", "retrait"]),
    adresseLivraison: z.string().trim().max(300).optional(),
    clientNom: z.string().trim().min(2, "Indiquez votre nom.").max(120),
    clientEmail: z.string().trim().email("Adresse email invalide."),
    clientTelephone: z
      .string()
      .trim()
      .regex(/^[+0-9 ().-]{8,20}$/, "Numéro de téléphone invalide."),
    notes: z.string().trim().max(1000).optional(),
    items: z.array(bookingItemSchema).min(1).max(50),
  })
  .superRefine((data, ctx) => {
    if (data.modeRecuperation === "livraison" && !data.adresseLivraison) {
      ctx.addIssue({
        code: "custom",
        path: ["adresseLivraison"],
        message: "L'adresse de livraison est obligatoire.",
      });
    }

    if (new Date(data.dateDepart) <= new Date(data.dateArrivee)) {
      ctx.addIssue({
        code: "custom",
        path: ["dateDepart"],
        message: "La date de départ doit être après la date d'arrivée.",
      });
    }
  });

export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>;

export const CONTACT_SUBJECTS = [
  "Propriétaire — demande de prestations",
  "Vacancier — question sur une commande",
  "Location de ski",
  "Laverie Arc 2000",
  "Autre demande",
] as const;

/** Libellés anglais des sujets (la valeur envoyée reste en français). */
export const CONTACT_SUBJECTS_EN: Record<
  (typeof CONTACT_SUBJECTS)[number],
  string
> = {
  "Propriétaire — demande de prestations": "Owner — service request",
  "Vacancier — question sur une commande":
    "Holidaymaker — question about an order",
  "Location de ski": "Ski rental",
  "Laverie Arc 2000": "Arc 2000 launderette",
  "Autre demande": "Other request",
};

export const contactSchema = z.object({
  prenom: z.string().trim().min(2, "Indiquez votre prénom.").max(80),
  telephone: z
    .string()
    .trim()
    .regex(/^[+0-9 ().-]{8,20}$/, "Numéro de téléphone invalide."),
  email: z.string().trim().email("Adresse email invalide.").max(200),
  sujet: z.enum(CONTACT_SUBJECTS, { message: "Choisissez un sujet." }),
  message: z
    .string()
    .trim()
    .min(10, "Votre message est trop court (10 caractères min.).")
    .max(3000),
  // Anti-spam : champ piège (doit rester vide) + horodatage d'affichage
  website: z.string().max(500).optional(),
  startedAt: z.number().int(),
});

export type ContactPayload = z.infer<typeof contactSchema>;
