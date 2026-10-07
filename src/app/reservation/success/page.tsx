import Link from "next/link";
import { BookingStatus } from "@prisma/client";
import { PageContainer } from "@/components/page-container";
import { orderDownloadPath } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { getT } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function ReservationSuccessPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  const booking = searchParams.ref
    ? await prisma.booking.findUnique({
        where: { downloadToken: searchParams.ref },
        select: {
          id: true,
          status: true,
          clientEmail: true,
          downloadToken: true,
        },
      })
    : null;
  const paid = booking?.status === BookingStatus.paid;
  const t = getT();

  return (
    <PageContainer>
      <section className="py-14">
        <div className="max-w-2xl rounded-panel border border-primary/30 bg-primary-light p-6">
          <h1 className="text-3xl text-ardoise">
            {paid
              ? t("Paiement confirmé", "Payment confirmed")
              : t(
                  "Paiement en cours de confirmation",
                  "Payment being confirmed",
                )}
          </h1>
          <p className="mt-3 text-ardoise">
            {t("Merci !", "Thank you!")}{" "}
            {booking ? `${t("Référence", "Reference")} : ${booking.id}.` : ""}
          </p>
          {paid && booking ? (
            <p className="mt-2 text-ardoise">
              {t(
                "Votre bon de commande vient d'être envoyé à",
                "Your order form (in French) has just been sent to",
              )}{" "}
              <strong>{booking.clientEmail}</strong>.{" "}
              {t(
                "Vous pouvez aussi le télécharger dès maintenant.",
                "You can also download it right now.",
              )}
            </p>
          ) : (
            <p className="mt-2 text-ardoise" role="status">
              {t(
                "La confirmation de votre banque peut prendre quelques instants. Votre bon de commande vous sera envoyé par email dès réception. Vous pouvez actualiser cette page.",
                "Your bank's confirmation may take a few moments. Your order form will be emailed to you as soon as it is received. You can refresh this page.",
              )}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            {paid && booking && (
              <a
                href={orderDownloadPath(booking.downloadToken)}
                className="rounded-full bg-accent px-5 py-2.5 font-bold text-ardoise hover:bg-accent-dark"
              >
                {t(
                  "Télécharger le bon de commande (PDF)",
                  "Download the order form (PDF)",
                )}
              </a>
            )}
            <Link
              href="/"
              className="rounded-full bg-primary px-4 py-2.5 text-white"
            >
              {t("Retour accueil", "Back to home")}
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-primary px-4 py-2.5 text-ardoise"
            >
              {t("Nous contacter", "Contact us")}
            </Link>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
