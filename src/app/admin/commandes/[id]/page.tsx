import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatEuros } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { residenceLabel } from "@/lib/admin";
import { orderPdfKinds } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function AdminOrderPage({
  params,
}: {
  params: { id: string };
}) {
  const b = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: true } } },
  });
  if (!b) notFound();

  const d = (date: Date | null) =>
    date ? format(date, "dd/MM/yyyy HH:mm", { locale: fr }) : "—";

  const rows: [string, React.ReactNode][] = [
    ["N° de commande", b.id],
    ["Passée le", d(b.createdAt)],
    ["Payée le", d(b.paidAt)],
    ["Client", b.clientNom],
    [
      "Email",
      <a key="e" href={`mailto:${b.clientEmail}`} className="text-sapin">
        {b.clientEmail}
      </a>,
    ],
    [
      "Téléphone",
      b.clientTelephone ? (
        <a key="t" href={`tel:${b.clientTelephone}`} className="text-sapin">
          {b.clientTelephone}
        </a>
      ) : (
        "—"
      ),
    ],
    [
      "Public",
      b.targetAudience === "proprietaire" ? "Propriétaire" : "Vacancier",
    ],
    ["Station", residenceLabel(b.residence)],
    ["Arrivée", format(b.dateArrivee, "EEEE dd MMMM yyyy", { locale: fr })],
    ["Départ", format(b.dateDepart, "EEEE dd MMMM yyyy", { locale: fr })],
    ["Récupération", b.creneauLivraison ?? "—"],
    ["Adresse / bien", b.propertyReference ?? "—"],
    ["Notes du client", b.notes ?? "—"],
    [
      "Paiement",
      [b.paymentProvider, b.paymentRef].filter(Boolean).join(" · ") || "—",
    ],
  ];

  return (
    <section>
      <Link href="/admin" className="text-sm text-sapin hover:underline">
        ← Toutes les commandes
      </Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-ardoise">Commande de {b.clientNom}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {orderPdfKinds(b).map((kind) => (
            <a
              key={kind}
              href={`/api/admin/bon-de-commande/${b.id}?type=${kind}`}
              className="rounded-full bg-sapin px-5 py-2.5 text-sm font-semibold text-white hover:bg-sapin/90"
            >
              {kind === "ski" ? "Bon ski Skiset (PDF)" : "Bon linge (PDF)"}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <dl className="divide-y divide-slate-100 rounded-[18px] border border-slate-200 bg-white">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-[10rem_1fr] gap-3 px-4 py-2.5 text-sm"
            >
              <dt className="text-slate-500">{label}</dt>
              <dd className="break-words text-ardoise">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="space-y-6">
          <div className="rounded-[18px] border border-slate-200 bg-white p-4">
            <h2 className="font-semibold text-ardoise">Articles</h2>
            <table className="mt-3 w-full text-sm">
              <tbody>
                {b.items.map((i) => (
                  <tr key={i.id} className="border-t border-slate-100">
                    <td className="py-2 pr-2">{i.product.name}</td>
                    <td className="py-2 pr-2 text-right">×{i.quantity}</td>
                    <td className="py-2 text-right whitespace-nowrap">
                      {formatEuros(i.unitPriceCents * i.quantity)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-slate-200 font-semibold">
                  <td className="py-2" colSpan={2}>
                    Total
                  </td>
                  <td className="py-2 text-right">
                    {formatEuros(b.montantTotalCents)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
