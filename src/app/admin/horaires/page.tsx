import { SITE } from "@/lib/site-config";
import { loadSettings } from "@/lib/settings";
import { saveHours } from "../actions";

export const dynamic = "force-dynamic";

const FIELDS = [
  { name: "openingHours", label: "Heures d'ouverture (français)", long: true },
  { name: "openingHoursEn", label: "Heures d'ouverture (anglais)", long: true },
  {
    name: "deliveryWindow",
    label: "Créneau de livraison (français)",
    long: false,
  },
  {
    name: "deliveryWindowEn",
    label: "Créneau de livraison (anglais)",
    long: false,
  },
] as const;

export default async function AdminHoursPage({
  searchParams,
}: {
  searchParams: { ok?: string };
}) {
  await loadSettings();

  return (
    <section>
      <h1 className="text-3xl text-ardoise">Horaires</h1>
      <p className="mt-2 text-slate-700">
        Ces textes apparaissent sur le site, dans les bons de commande et les
        emails de confirmation.
      </p>
      {searchParams.ok && (
        <p className="mt-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm text-emerald-800">
          Horaires enregistrés.
        </p>
      )}
      <form
        action={saveHours}
        className="mt-6 space-y-4 rounded-[18px] border border-slate-200 bg-white p-5"
      >
        {FIELDS.map((f) => (
          <label key={f.name} className="block text-sm">
            <span className="font-semibold text-ardoise">{f.label}</span>
            {f.long ? (
              <textarea
                name={f.name}
                rows={3}
                required
                defaultValue={SITE[f.name]}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            ) : (
              <input
                name={f.name}
                required
                defaultValue={SITE[f.name]}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            )}
          </label>
        ))}
        <button className="rounded-full bg-sapin px-6 py-3 font-semibold text-white hover:bg-sapin/90">
          Enregistrer les horaires
        </button>
      </form>
    </section>
  );
}
