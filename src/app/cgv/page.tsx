import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, Todo } from "@/components/legal-page";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = { title: "Conditions générales de vente" };

export default function CgvPage() {
  return (
    <LegalPage title="Conditions générales de vente" updated="octobre 2026">
      <LegalSection title="1. Objet">
        <p>
          Les présentes conditions régissent les commandes passées en ligne sur
          allservicesmontagne.com auprès de la SARL ALL SERVICES ({SITE.name},
          SIRET 848 507 422 00014) : location de linge, services de
          blanchisserie, équipements et packs de location de ski proposés avec
          notre partenaire Skiset, aux Arcs 1800 et 2000.
        </p>
        <p>
          Toute commande implique l&apos;acceptation sans réserve des présentes
          conditions.
        </p>
      </LegalSection>

      <LegalSection title="2. Prix">
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises (TTC). Le prix
          applicable est celui affiché au moment de la commande. Les éventuels
          frais de livraison sont indiqués avant le paiement.
        </p>
      </LegalSection>

      <LegalSection title="3. Commande et paiement">
        <p>
          La commande est validée après paiement intégral par carte bancaire via
          la plateforme sécurisée Systempay. Vos données bancaires sont traitées
          exclusivement par Systempay et ne sont jamais stockées sur notre site.
        </p>
        <p>
          Après paiement, un email de confirmation vous est envoyé avec votre ou
          vos bons de commande au format PDF (bon linge et/ou bon de retrait
          ski), également téléchargeables depuis la page de confirmation.
        </p>
      </LegalSection>

      <LegalSection title="4. Retrait, livraison et restitution">
        <p>
          <strong>Linge :</strong> retrait dans l&apos;agence choisie (Arc 1800
          ou Arc 2000) pendant les heures d&apos;ouverture, ou livraison dans
          votre logement le jour de votre arrivée si cette option a été choisie.
          Le linge est à restituer <Todo>modalités et date de restitution</Todo>
          .
        </p>
        <p>
          <strong>Location de ski :</strong> le matériel se retire dans
          n&apos;importe quel magasin Skiset de la station choisie, sur
          présentation du bon de retrait ski, et se restitue au plus tard le
          jour du départ indiqué sur le bon.
        </p>
        <p>
          En cas de linge ou de matériel perdu ou détérioré :{" "}
          <Todo>conditions de facturation</Todo>.
        </p>
      </LegalSection>

      <LegalSection title="5. Annulation et remboursement">
        <p>
          <Todo>
            conditions d&apos;annulation (ex. remboursement intégral
            jusqu&apos;à X jours avant l&apos;arrivée, puis …)
          </Todo>
        </p>
        <p>
          Toute demande d&apos;annulation se fait par email à{" "}
          <a href={`mailto:${SITE.email}`} className="underline">
            {SITE.email}
          </a>{" "}
          ou par téléphone au {SITE.phone}.
        </p>
      </LegalSection>

      <LegalSection title="6. Droit de rétractation">
        <p>
          Conformément à l&apos;article L221-28 12° du Code de la consommation,
          le droit de rétractation ne s&apos;applique pas aux prestations de
          services de location (linge, matériel de ski) fournies à une date ou
          selon une période déterminée. Les conditions d&apos;annulation de
          l&apos;article 5 s&apos;appliquent.
        </p>
      </LegalSection>

      <LegalSection title="7. Responsabilité">
        <p>
          {SITE.name} s&apos;engage à fournir les prestations commandées avec
          soin. La location de matériel de ski est assurée par notre partenaire
          Skiset, selon ses propres conditions applicables en magasin.
        </p>
      </LegalSection>

      <LegalSection title="8. Réclamations et médiation">
        <p>
          Pour toute réclamation, contactez-nous à{" "}
          <a href={`mailto:${SITE.email}`} className="underline">
            {SITE.email}
          </a>
          .
        </p>
        <p>
          En cas de litige non résolu, vous pouvez recourir gratuitement au
          médiateur de la consommation :{" "}
          <Todo>nom, adresse et site web du médiateur</Todo>.
        </p>
      </LegalSection>

      <LegalSection title="9. Droit applicable">
        <p>Les présentes conditions sont soumises au droit français.</p>
      </LegalSection>

      <p className="text-sm">
        Voir aussi nos{" "}
        <Link href="/mentions-legales" className="font-semibold underline">
          mentions légales
        </Link>
        .
      </p>
    </LegalPage>
  );
}
