import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, Todo } from "@/components/legal-page";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales" updated="octobre 2026">
      <LegalSection title="Éditeur du site">
        <p>
          Le site allservicesmontagne.com est édité par{" "}
          <strong>ALL SERVICES</strong>, SARL (société à responsabilité limitée)
          au capital de 800 €.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Siège social : Les Arcs 1800, Centre commercial du Charvet, 73700
            Bourg-Saint-Maurice
          </li>
          <li>SIRET : 848 507 422 00014 · RCS Chambéry 848 507 422</li>
          <li>TVA intracommunautaire : FR69848507422</li>
          <li>
            Agence Arc 1800 : Galerie commerçante du Charvet, 73700 Les Arcs
            1800
          </li>
          <li>
            Agence Arc 2000 : Place haute, face à Skiset Aiguille Rouge, 73700
            Les Arcs 2000
          </li>
          <li>
            Téléphone : <a href={SITE.phoneHref}>{SITE.phone}</a> · Email :{" "}
            <a href={`mailto:${SITE.email}`} className="underline">
              {SITE.email}
            </a>
          </li>
          <li>Directrice de la publication : Carmen Ramirez Diaz, gérante</li>
        </ul>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>
          Site hébergé par <strong>Vercel Inc.</strong>, 440 N Barranca Ave
          #4133, Covina, CA 91723, États-Unis — vercel.com.
        </p>
        <p>
          Base de données hébergée par <strong>Supabase Inc.</strong> —
          supabase.com. Les données sont stockées dans l&apos;Union européenne
          (Irlande).
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          L&apos;ensemble des contenus du site (textes, logo, photographies,
          mise en page) est la propriété de {SITE.name} ou est utilisé avec
          autorisation. Toute reproduction, même partielle, sans accord écrit
          préalable est interdite.
        </p>
        <p>
          Le logo Skiset est une marque de son propriétaire, utilisée dans le
          cadre de notre partenariat.
        </p>
      </LegalSection>

      <LegalSection title="Données personnelles">
        <p>
          <strong>Responsable du traitement :</strong> ALL SERVICES SARL,
          joignable à{" "}
          <a href={`mailto:${SITE.email}`} className="underline">
            {SITE.email}
          </a>
          .
        </p>
        <p>
          <strong>Données collectées :</strong> lors d&apos;une commande : nom,
          email, téléphone, station, adresse du logement et dates de séjour. Via
          le formulaire de contact : prénom, téléphone, email et message.
        </p>
        <p>
          <strong>Finalités :</strong> traitement et suivi des commandes, envoi
          du bon de commande, réponse aux demandes de contact. Base légale :
          exécution du contrat et, pour le contact, votre demande.
        </p>
        <p>
          <strong>Destinataires :</strong> uniquement {SITE.name} et ses
          prestataires techniques : Systempay (Banque Populaire / Caisse
          d&apos;Épargne) pour le paiement — vos données bancaires ne transitent
          jamais par notre site —, Resend pour l&apos;envoi des emails, Vercel
          et Supabase pour l&apos;hébergement. Aucune donnée n&apos;est vendue
          ni cédée.
        </p>
        <p>
          <strong>Durée de conservation :</strong> les données de commande sont
          conservées 10 ans (obligations comptables) ; les messages de contact{" "}
          <Todo>durée, ex. 3 ans</Todo>.
        </p>
        <p>
          <strong>Vos droits :</strong> vous disposez d&apos;un droit
          d&apos;accès, de rectification, d&apos;effacement, de limitation et
          d&apos;opposition. Pour les exercer, écrivez à{" "}
          <a href={`mailto:${SITE.email}`} className="underline">
            {SITE.email}
          </a>
          . Vous pouvez également introduire une réclamation auprès de la CNIL
          (cnil.fr).
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          Ce site n&apos;utilise aucun cookie publicitaire ni de mesure
          d&apos;audience. Seuls des éléments techniques indispensables au
          fonctionnement (langue choisie, panier) sont enregistrés sur votre
          appareil ; ils ne nécessitent pas de consentement.
        </p>
      </LegalSection>

      <p className="text-sm">
        Voir aussi nos{" "}
        <Link href="/cgv" className="font-semibold underline">
          conditions générales de vente
        </Link>
        .
      </p>
    </LegalPage>
  );
}
