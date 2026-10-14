import Link from "next/link";
import { formatEuros, PRODUCTS } from "@/lib/catalog";
import { loadSettings } from "@/lib/settings";
import { CATEGORY_LABEL } from "@/lib/admin";

export const dynamic = "force-dynamic";

const AUDIENCE_LABEL = {
  vacancier: "Vacanciers (commande en ligne)",
  proprietaire: "Propriétaires (sur devis)",
} as const;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { ok?: string; supprime?: string; erreur?: string };
}) {
  await loadSettings();

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-ardoise">Prestations</h1>
          <p className="mt-2 text-slate-700">
            Ajoutez, modifiez ou retirez les prestations affichées sur le site.
          </p>
        </div>
        <Link
          href="/admin/prestations/nouvelle"
          className="rounded-full bg-sapin px-5 py-2.5 text-sm font-semibold text-white hover:bg-sapin/90"
        >
          + Nouvelle prestation
        </Link>
      </div>

      {searchParams.ok && (
        <p className="mt-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm text-emerald-800">
          Prestation enregistrée.
        </p>
      )}
      {searchParams.supprime && (
        <p className="mt-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm text-emerald-800">
          Prestation retirée du site. Les commandes passées ne sont pas
          modifiées.
        </p>
      )}
      {searchParams.erreur === "livraison" && (
        <p className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-800">
          La livraison ne peut pas être supprimée (vous pouvez modifier son
          prix).
        </p>
      )}

      {(["vacancier"] as const).map((audience) => (
        <div
          key={audience}
          className="mt-6 overflow-x-auto rounded-[18px] border border-slate-200 bg-white"
        >
          <h2 className="border-b border-slate-100 px-4 py-3 font-semibold text-ardoise">
            {AUDIENCE_LABEL[audience]}
          </h2>
          <table className="w-full min-w-[640px] text-sm">
            <tbody>
              {PRODUCTS.filter((p) => p.targetAudience === audience).map(
                (p) => (
                  <tr
                    key={p.code}
                    className="border-t border-slate-100 align-top"
                  >
                    <td className="w-20 px-4 py-3">
                      {p.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.photo}
                          alt=""
                          className="h-12 w-16 rounded object-cover"
                        />
                      ) : (
                        <div className="h-12 w-16 rounded bg-slate-100" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ardoise">{p.name}</p>
                      <p className="mt-0.5 line-clamp-2 text-slate-600">
                        {p.description}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {CATEGORY_LABEL[p.category]}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                      {p.pricePending || p.priceCents === 0
                        ? (p.pricePending ?? "—")
                        : formatEuros(p.priceCents)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {p.active ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                          En ligne
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          Masquée
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <Link
                        href={`/admin/prestations/${p.code}`}
                        className="font-semibold text-sapin hover:underline"
                      >
                        Modifier →
                      </Link>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
