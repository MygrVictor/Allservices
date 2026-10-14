import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DELIVERY_PRODUCT_CODE,
  englishFor,
  PRODUCTS,
  type CatalogProduct,
} from "@/lib/catalog";
import { loadSettings } from "@/lib/settings";
import { CATEGORY_LABEL } from "@/lib/admin";
import { deleteProduct, saveProduct } from "../../actions";

export const dynamic = "force-dynamic";

const input = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2";

export default async function AdminProductEditPage({
  params,
  searchParams,
}: {
  params: { code: string };
  searchParams: { erreur?: string };
}) {
  await loadSettings();
  const isNew = params.code === "nouvelle";
  const found = PRODUCTS.find(
    (p) => p.code === params.code && p.targetAudience === "vacancier",
  );
  if (!isNew && !found) notFound();

  const p: CatalogProduct = found ?? {
    code: "",
    name: "",
    description: "",
    priceCents: 0,
    targetAudience: "vacancier",
    category: "linge",
    active: true,
  };
  const en = found ? englishFor(found) : { name: "", description: "" };

  return (
    <section className="max-w-3xl">
      <Link
        href="/admin/prestations"
        className="text-sm text-sapin hover:underline"
      >
        ← Toutes les prestations
      </Link>
      <h1 className="mt-3 text-3xl text-ardoise">
        {isNew ? "Nouvelle prestation" : p.name}
      </h1>

      {searchParams.erreur && (
        <p className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-800">
          {searchParams.erreur === "photo"
            ? "Photo refusée : formats JPG, PNG ou WebP, 5 Mo maximum."
            : "Vérifiez le nom (2 caractères min.), le prix et la catégorie."}
        </p>
      )}

      <form
        action={saveProduct}
        className="mt-6 space-y-5 rounded-[18px] border border-slate-200 bg-white p-5"
      >
        <input type="hidden" name="code" value={p.code} />

        <div className="flex flex-wrap items-start gap-4">
          <div className="flex h-32 w-44 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-400">
            {p.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.photo}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              "Aucune photo"
            )}
          </div>
          <div className="space-y-2 text-sm">
            <label className="block">
              <span className="font-semibold text-ardoise">
                {p.photo ? "Remplacer la photo" : "Ajouter une photo"}
              </span>
              <input
                type="file"
                name="photo"
                accept="image/jpeg,image/png,image/webp"
                className="mt-1 block text-sm"
              />
            </label>
            <p className="text-xs text-slate-500">
              JPG, PNG ou WebP · 5 Mo max.
            </p>
            {p.photo && (
              <label className="flex items-center gap-2">
                <input type="checkbox" name="removePhoto" className="h-4 w-4" />
                <span className="text-red-700">Retirer la photo</span>
              </label>
            )}
          </div>
        </div>

        <fieldset className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="font-semibold text-ardoise">Nom (français) *</span>
            <input
              name="name"
              required
              defaultValue={p.name}
              className={input}
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-semibold text-ardoise">
              Contenu / description (français)
            </span>
            <textarea
              name="description"
              rows={3}
              defaultValue={p.description}
              placeholder="Ex. : Drap housse, drap plat et 2 taies pour lit double."
              className={input}
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-semibold text-ardoise">Nom (anglais)</span>
            <input
              name="nameEn"
              defaultValue={p.nameEn ?? (found ? en.name : "")}
              placeholder="Laissez vide pour réutiliser le nom français"
              className={input}
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-semibold text-ardoise">
              Contenu / description (anglais)
            </span>
            <textarea
              name="descriptionEn"
              rows={3}
              defaultValue={p.descriptionEn ?? (found ? en.description : "")}
              className={input}
            />
          </label>
        </fieldset>

        <fieldset className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-semibold text-ardoise">Prix TTC (€) *</span>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={(p.priceCents / 100).toFixed(2)}
              className={input}
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-ardoise">Catégorie *</span>
            <select name="category" defaultValue={p.category} className={input}>
              {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        <details
          className="rounded-lg border border-slate-200 p-4 text-sm"
          open={p.category === "ski"}
        >
          <summary className="cursor-pointer font-semibold text-ardoise">
            Options avancées (packs ski, tarif en attente)
          </summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-slate-600">Station</span>
              <select
                name="residence"
                defaultValue={p.residence ?? ""}
                className={input}
              >
                <option value="">Les deux stations</option>
                <option value="arc_1800">Arc 1800 uniquement</option>
                <option value="arc_2000">Arc 2000 uniquement</option>
              </select>
            </label>
            <label className="block">
              <span className="text-slate-600">Pack ski pour</span>
              <select
                name="skier"
                defaultValue={p.skier ?? ""}
                className={input}
              >
                <option value="">—</option>
                <option value="adulte">Adulte</option>
                <option value="enfant">Enfant</option>
              </select>
            </label>
            <label className="block">
              <span className="text-slate-600">Texte « tarif en attente »</span>
              <input
                name="pricePending"
                defaultValue={p.pricePending ?? ""}
                placeholder="Ex. : Tarif à confirmer"
                className={input}
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Si un texte « tarif en attente » est renseigné, la prestation est
            affichée mais ne peut pas être commandée.
          </p>
        </details>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="active"
            defaultChecked={p.active}
            className="h-4 w-4"
          />
          <span className="font-semibold text-ardoise">
            Visible sur le site
          </span>
        </label>

        <button className="rounded-full bg-sapin px-6 py-3 font-semibold text-white hover:bg-sapin/90">
          {isNew ? "Créer la prestation" : "Enregistrer"}
        </button>
      </form>

      {found && found.code !== DELIVERY_PRODUCT_CODE && (
        <form action={deleteProduct} className="mt-4">
          <input type="hidden" name="code" value={found.code} />
          <button className="text-sm text-red-700 hover:underline">
            Supprimer cette prestation du site
          </button>
        </form>
      )}
    </section>
  );
}
