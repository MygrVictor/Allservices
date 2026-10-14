import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { SystempayForm } from "@/components/systempay-form";
import { formatEuros } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Paiement sécurisé",
  robots: { index: false, follow: false },
};

export default function PaiementPage({
  searchParams,
}: {
  searchParams: {
    formToken?: string;
    success?: string;
    cancel?: string;
    amount?: string;
  };
}) {
  const { formToken, success = "", cancel = "/commande" } = searchParams;
  const amount = Number(searchParams.amount);
  const publicKey = process.env.NEXT_PUBLIC_SYSTEMPAY_PUBLIC_KEY ?? "";
  const isTest = /testpublickey/i.test(publicKey);

  const returnUrl = `/api/payment/return/systempay?${new URLSearchParams({
    success,
    cancel,
  }).toString()}`;

  return (
    <PageContainer>
      <section className="mx-auto max-w-md py-12">
        <h1 className="text-3xl text-ardoise">Paiement sécurisé</h1>
        {Number.isFinite(amount) && amount > 0 && (
          <p className="mt-2 text-slate-700">
            Montant à régler : <strong>{formatEuros(amount)}</strong>
          </p>
        )}

        {isTest && (
          <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            <p className="font-semibold">Mode test — aucun débit réel</p>
            <p className="mt-1">
              Carte : <code>4970 1000 0000 0055</code> · date future quelconque
              · CVV <code>123</code>
            </p>
          </div>
        )}

        <div className="mt-6 rounded-[22px] border border-primary/10 bg-white p-6 shadow-sm">
          {formToken && publicKey ? (
            <SystempayForm
              publicKey={publicKey}
              formToken={formToken}
              successUrl={returnUrl}
            />
          ) : (
            <p className="text-sm text-red-700">
              Session de paiement invalide. Merci de recommencer votre commande.
            </p>
          )}
        </div>

        <Link
          href={
            cancel.startsWith("http")
              ? new URL(cancel).pathname + new URL(cancel).search
              : cancel
          }
          className="mt-4 inline-block text-sm text-sapin hover:underline"
        >
          ← Annuler et revenir à la commande
        </Link>
      </section>
    </PageContainer>
  );
}
