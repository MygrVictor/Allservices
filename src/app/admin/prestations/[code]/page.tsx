import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DELIVERY_PRODUCT_CODE,
  englishFor,
  PRODUCTS,
  skiPriceForDays,
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
  searchParams: { erreur?: string; type?: string };
}) {
  await loadSettings();
  const isNew = params.code === "nouvelle";
  const found = PRODUCTS.find(
    (p) => p.code === params.code && p.targetAudience === "vacancier",
  );
  if (!isNew && !found) notFound();

  const isSki = found ? found.category === "ski" : searchParams.type === "ski";
  const p: CatalogProduct = found ?? {
    code: "",
    name: "",
    description: "",
    priceCents: 0,
    targetAudience: "vacancier",
    category: isSki ? "ski" : "linge",
    active: true,
    skier: isSki ? "adulte" : undefined,
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
        {isNew ? (isSki ? "Nouveau pack ski" : "Nouvelle prestation") : p.name}
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        {isSki
          ? "Pack de location de ski (retirable à la station choisie au paiement)."
          : "Prestation de linge ou de services (forfait 7 jours)."}
      </p>

      {searchParams.erreur && (
        <p className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-800">
          {searchParams.erreur === "photo"
            ? "Photo refusée : formats JPG, PNG ou WebP, 5 Mo maximum."
            : "Vérifiez le nom (2 caractères min.) et le prix."}
        </p>
      )}

      <form
        action={saveProduct}
        className="mt-6 space-y-5 rounded-[18px] border border-slate-200 bg-white p-5"
      >
        <input type="hidden" name="code" value={p.code} />
        {isSki && <input type="hidden" name="category" value="ski" />}

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
              placeholder={
                isSki
                  ? "Ex. : Skis + chaussures + bâtons pour débutants."
                  : "Ex. : Drap housse, drap plat et 2 taies pour lit double."
              }
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

        {isSki ? (
          <>
            <fieldset className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-semibold text-ardoise">
                  Prix TTC pour 6 jours (€) *
                </span>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  defaultValue={(p.priceCents / 100).toFixed(2)}
                  className={input}
                />
                <span className="mt-1 block text-xs text-slate-500">
                  {p.priceCents > 0
                    ? `Soit ${(skiPriceForDays(p.priceCents, 1) / 100).toFixed(2)} € par jour : le client choisit de 1 à 14 jours et paie au prorata.`
                    : "Le client choisit de 1 à 14 jours et paie au prorata (tarif 6 jours ÷ 6 × nombre de jours)."}
                </span>
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-ardoise">Pack pour *</span>
                <select
                  name="skier"
                  defaultValue={p.skier ?? "adulte"}
                  className={input}
                >
                  <option value="adulte">Adulte</option>
                  <option value="enfant">Enfant</option>
                </select>
              </label>
            </fieldset>
          </>
        ) : (
          <>
            <fieldset className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-semibold text-ardoise">
                  Prix TTC (€) *
                </span>
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
                <span className="font-semibold text-ardoise">
                  Supplément par jour dès le 8e jour (€)
                </span>
                <input
                  name="extraDay"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={((p.extraDayCents ?? 0) / 100).toFixed(2)}
                  className={input}
                />
                <span className="mt-1 block text-xs text-slate-500">
                  Le prix ci-dessus couvre 7 jours. 0 = pas de supplément.
                </span>
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-ardoise">Catégorie *</span>
                <select
                  name="category"
                  defaultValue={p.category}
                  className={input}
                >
                  {Object.entries(CATEGORY_LABEL)
                    .filter(([value]) => value !== "ski")
                    .map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-ardoise">
                  Texte « tarif en attente »
                </span>
                <input
                  name="pricePending"
                  defaultValue={p.pricePending ?? ""}
                  placeholder="Ex. : Tarif à confirmer"
                  className={input}
                />
                <span className="mt-1 block text-xs text-slate-500">
                  Si renseigné, la prestation est affichée mais ne peut pas être
                  commandée.
                </span>
              </label>
            </fieldset>
          </>
        )}

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
          {isNew
            ? isSki
              ? "Créer le pack ski"
              : "Créer la prestation"
            : "Enregistrer"}
        </button>
      </form>

      {found && found.code !== DELIVERY_PRODUCT_CODE && (
        <form action={deleteProduct} className="mt-4">
          <input type="hidden" name="code" value={found.code} />
          <button className="text-sm text-red-700 hover:underline">
            Supprimer {isSki ? "ce pack" : "cette prestation"} du site
          </button>
        </form>
      )}
    </section>
  );
}
