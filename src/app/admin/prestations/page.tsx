import Link from "next/link";
import { formatEuros, PRODUCTS, skiPriceForDays } from "@/lib/catalog";
import { loadSettings } from "@/lib/settings";
import { CATEGORY_LABEL } from "@/lib/admin";

export const dynamic = "force-dynamic";

type Row = (typeof PRODUCTS)[number];

function ProductTable({
  title,
  subtitle,
  products,
  createHref,
  createLabel,
}: {
  title: string;
  subtitle: string;
  products: Row[];
  createHref: string;
  createLabel: string;
}) {
  return (
    <div className="mt-8 overflow-x-auto rounded-[18px] border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div>
          <h2 className="font-semibold text-ardoise">{title}</h2>
          <p className="text-sm text-slate-600">{subtitle}</p>
        </div>
        <Link
          href={createHref}
          className="rounded-full bg-sapin px-5 py-2.5 text-sm font-semibold text-white hover:bg-sapin/90"
        >
          {createLabel}
        </Link>
      </div>
      <table className="w-full min-w-[640px] text-sm">
        <tbody>
          {products.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-center text-slate-500">
                Aucun élément pour l&apos;instant.
              </td>
            </tr>
          )}
          {products.map((p) => (
            <tr key={p.code} className="border-t border-slate-100 align-top">
              <td className="w-20 px-4 py-3">
                {p.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.photo}
                    alt=""
                    className={`h-12 w-16 rounded ${p.category === "ski" ? "bg-white object-contain" : "object-cover"}`}
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
                {p.pricePending || p.priceCents === 0 ? (
                  (p.pricePending ?? "—")
                ) : p.category === "ski" ? (
                  <>
                    {formatEuros(p.priceCents)}
                    <span className="block text-xs font-normal text-slate-500">
                      pour 6 jours ·{" "}
                      {formatEuros(skiPriceForDays(p.priceCents, 1))} / jour
                    </span>
                  </>
                ) : (
                  formatEuros(p.priceCents)
                )}
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
            Les prestations de linge et de services, et les packs de location de
            ski, se gèrent séparément.
          </p>
        </div>
      </div>

      {searchParams.ok && (
        <p className="mt-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm text-emerald-800">
          Enregistré.
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

      <ProductTable
        title="Linge et services"
        subtitle="Linge, ménage, équipement bébé, clés, livraison… (forfait 7 jours)"
        products={PRODUCTS.filter(
          (p) => p.targetAudience === "vacancier" && p.category !== "ski",
        )}
        createHref="/admin/prestations/nouvelle"
        createLabel="+ Nouvelle prestation"
      />
      <ProductTable
        title="Packs de ski"
        subtitle="Prix pour 6 jours, calculé au jour près selon la durée choisie par le client"
        products={PRODUCTS.filter(
          (p) => p.targetAudience === "vacancier" && p.category === "ski",
        )}
        createHref="/admin/prestations/nouvelle?type=ski"
        createLabel="+ Nouveau pack ski"
      />
    </section>
  );
}
