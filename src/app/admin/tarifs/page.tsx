import { formatEuros, PRODUCTS } from "@/lib/catalog";
import { loadSettings } from "@/lib/settings";
import { savePrices } from "../actions";

export const dynamic = "force-dynamic";

const AUDIENCE_LABEL = {
  proprietaire: "Propriétaires",
  vacancier: "Vacanciers",
} as const;

export default async function AdminPricesPage({
  searchParams,
}: {
  searchParams: { ok?: string };
}) {
  await loadSettings();
  const groups = (["vacancier"] as const).map((audience) => ({
    audience,
    products: PRODUCTS.filter((p) => p.targetAudience === audience),
  }));

  return (
    <section>
      <h1 className="text-3xl text-ardoise">Tarifs</h1>
      <p className="mt-2 text-slate-700">
        Modifiez les prix (en euros TTC) puis enregistrez. Décochez « En ligne »
        pour masquer un produit du site. Un pack ski dont le prix est renseigné
        devient commandable.
      </p>
      {searchParams.ok && (
        <p className="mt-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm text-emerald-800">
          Tarifs enregistrés. Les nouvelles commandes utilisent ces prix.
        </p>
      )}

      <form action={savePrices} className="mt-6 space-y-6">
        {groups.map(({ audience, products }) => (
          <div
            key={audience}
            className="overflow-x-auto rounded-[18px] border border-slate-200 bg-white"
          >
            <h2 className="border-b border-slate-100 px-4 py-3 font-semibold text-ardoise">
              {AUDIENCE_LABEL[audience]}
            </h2>
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="px-4 py-2">Produit</th>
                  <th className="px-4 py-2">Prix actuel</th>
                  <th className="px-4 py-2">Nouveau prix (€)</th>
                  <th className="px-4 py-2 text-center">En ligne</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.code} className="border-t border-slate-100">
                    <td className="px-4 py-2">
                      <p className="font-semibold text-ardoise">{p.name}</p>
                      {p.pricePending && (
                        <p className="text-xs text-amber-700">
                          {p.pricePending}
                        </p>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-slate-600">
                      {p.priceCents > 0 ? formatEuros(p.priceCents) : "—"}
                    </td>
                    <td className="px-4 py-2">
                      <input
                        name={`price:${p.code}`}
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={(p.priceCents / 100).toFixed(2)}
                        className="w-28 rounded-lg border border-slate-300 px-3 py-1.5"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input
                        name={`active:${p.code}`}
                        type="checkbox"
                        defaultChecked={p.active}
                        className="h-4 w-4"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        <button className="rounded-full bg-sapin px-6 py-3 font-semibold text-white hover:bg-sapin/90">
          Enregistrer les tarifs
        </button>
      </form>
    </section>
  );
}
