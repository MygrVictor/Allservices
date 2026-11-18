import Link from "next/link";
import {
  BookingStatus,
  Prisma,
  Residence,
  TargetAudience,
} from "@prisma/client";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { fr } from "date-fns/locale";
import { formatEuros } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { residenceLabel } from "@/lib/admin";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams: {
    q?: string;
    date?: string;
    residence?: string;
    audience?: string;
    page?: string;
    periode?: string;
    du?: string;
    au?: string;
  };
};

const PAGE_SIZE = 50;

const PERIODES = [
  { key: "aujourdhui", label: "Aujourd'hui" },
  { key: "hier", label: "Hier" },
  { key: "semaine", label: "Cette semaine" },
  { key: "semaine-derniere", label: "Semaine dernière" },
  { key: "mois", label: "Ce mois-ci" },
  { key: "mois-dernier", label: "Mois dernier" },
  { key: "annee", label: "Cette année" },
  { key: "annee-derniere", label: "Année dernière" },
  { key: "tout", label: "Tout" },
] as const;

function parseDay(v?: string) {
  if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return undefined;
  const d = new Date(`${v}T00:00:00`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function periodRange(
  periode: string | undefined,
  du?: string,
  au?: string,
): { from?: Date; to?: Date; label: string } {
  const now = new Date();
  const wk = { weekStartsOn: 1 as const };
  const fromCustom = parseDay(du);
  const toCustom = parseDay(au);
  if (fromCustom || toCustom) {
    return {
      from: fromCustom ? startOfDay(fromCustom) : undefined,
      to: toCustom ? endOfDay(toCustom) : undefined,
      label: `${fromCustom ? format(fromCustom, "dd/MM/yyyy") : "…"} → ${
        toCustom ? format(toCustom, "dd/MM/yyyy") : "…"
      }`,
    };
  }
  switch (periode) {
    case "aujourdhui":
      return { from: startOfDay(now), to: endOfDay(now), label: "Aujourd'hui" };
    case "hier": {
      const d = subDays(now, 1);
      return { from: startOfDay(d), to: endOfDay(d), label: "Hier" };
    }
    case "semaine":
      return {
        from: startOfWeek(now, wk),
        to: endOfWeek(now, wk),
        label: "Cette semaine",
      };
    case "semaine-derniere": {
      const d = subWeeks(now, 1);
      return {
        from: startOfWeek(d, wk),
        to: endOfWeek(d, wk),
        label: "Semaine dernière",
      };
    }
    case "mois-dernier": {
      const d = subMonths(now, 1);
      return {
        from: startOfMonth(d),
        to: endOfMonth(d),
        label: format(d, "MMMM yyyy", { locale: fr }),
      };
    }
    case "annee":
      return {
        from: startOfYear(now),
        to: endOfYear(now),
        label: `Année ${format(now, "yyyy")}`,
      };
    case "annee-derniere": {
      const d = subYears(now, 1);
      return {
        from: startOfYear(d),
        to: endOfYear(d),
        label: `Année ${format(d, "yyyy")}`,
      };
    }
    case "tout":
      return { label: "Depuis le début" };
    case "mois":
    default:
      return {
        from: startOfMonth(now),
        to: endOfMonth(now),
        label: format(now, "MMMM yyyy", { locale: fr }),
      };
  }
}

function pick<T extends string>(values: Record<string, T>, v?: string) {
  return v && (Object.values(values) as string[]).includes(v)
    ? (v as T)
    : undefined;
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminPageProps) {
  const q = searchParams.q?.trim();
  const residence = pick(Residence, searchParams.residence);
  const audience = pick(TargetAudience, searchParams.audience);
  const date = searchParams.date;
  const page = Math.max(1, Number(searchParams.page) || 1);
  const hasCustom = Boolean(searchParams.du || searchParams.au);
  const periode = hasCustom ? "perso" : (searchParams.periode ?? "mois");
  const range = periodRange(
    searchParams.periode,
    searchParams.du,
    searchParams.au,
  );

  const where: Prisma.BookingWhereInput = {
    // Seules les commandes payées (les paniers abandonnés restent cachés).
    status: BookingStatus.paid,
    ...(range.from || range.to
      ? {
          createdAt: {
            ...(range.from ? { gte: range.from } : {}),
            ...(range.to ? { lte: range.to } : {}),
          },
        }
      : {}),
    ...(residence ? { residence } : {}),
    ...(audience ? { targetAudience: audience } : {}),
    ...(date
      ? {
          dateArrivee: { lte: new Date(`${date}T23:59:59`) },
          dateDepart: { gte: new Date(`${date}T00:00:00`) },
        }
      : {}),
    ...(q
      ? {
          OR: [
            { id: { contains: q, mode: "insensitive" } },
            { clientNom: { contains: q, mode: "insensitive" } },
            { clientEmail: { contains: q, mode: "insensitive" } },
            { clientTelephone: { contains: q } },
            { propertyReference: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [bookings, count, totals, byStation] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: [{ createdAt: "desc" }],
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.booking.count({ where }),
    prisma.booking.aggregate({ where, _sum: { montantTotalCents: true } }),
    prisma.booking.groupBy({
      by: ["residence"],
      where,
      _sum: { montantTotalCents: true },
      _count: { _all: true },
    }),
  ]);

  const ca = totals._sum.montantTotalCents ?? 0;
  const panierMoyen = count > 0 ? Math.round(ca / count) : 0;

  const periodeHref = (key: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (residence) params.set("residence", residence);
    if (audience) params.set("audience", audience);
    if (date) params.set("date", date);
    params.set("periode", key);
    return `/admin?${params.toString()}`;
  };

  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (v) params.set(k, v);
    }
    params.set("page", String(p));
    return `/admin?${params.toString()}`;
  };

  return (
    <section>
      <h1 className="text-3xl text-ardoise">Commandes</h1>

      {/* Chiffre d'affaires par période */}
      <div className="mt-6 rounded-[18px] border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap gap-2">
          {PERIODES.map((p) => (
            <Link
              key={p.key}
              href={periodeHref(p.key)}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                periode === p.key
                  ? "border-ardoise bg-ardoise text-white"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>
        <form className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          {q && <input type="hidden" name="q" value={q} />}
          {residence && (
            <input type="hidden" name="residence" value={residence} />
          )}
          {audience && <input type="hidden" name="audience" value={audience} />}
          <span className="text-slate-600">Période personnalisée :</span>
          <input
            type="date"
            name="du"
            defaultValue={searchParams.du ?? ""}
            className="rounded-lg border border-slate-300 px-2 py-1.5"
          />
          <span>→</span>
          <input
            type="date"
            name="au"
            defaultValue={searchParams.au ?? ""}
            className="rounded-lg border border-slate-300 px-2 py-1.5"
          />
          <button className="rounded-lg bg-ardoise px-3 py-1.5 text-white">
            Appliquer
          </button>
        </form>

        <p className="mt-4 text-sm capitalize text-slate-600">{range.label}</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">
              Chiffre d&apos;affaires TTC
            </p>
            <p className="text-2xl font-semibold text-ardoise">
              {formatEuros(ca)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Commandes payées</p>
            <p className="text-2xl font-semibold text-ardoise">{count}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Panier moyen</p>
            <p className="text-2xl font-semibold text-ardoise">
              {formatEuros(panierMoyen)}
            </p>
          </div>
        </div>
        {byStation.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-700">
            {byStation.map((s) => (
              <li key={s.residence}>
                {residenceLabel(s.residence)} :{" "}
                <strong>{formatEuros(s._sum.montantTotalCents ?? 0)}</strong> (
                {s._count._all} cmd)
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-slate-500">
          Basé sur la date de paiement de la commande.
        </p>
      </div>

      <form className="mt-6 grid gap-3 rounded-[18px] border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
        {periode !== "perso" && (
          <input type="hidden" name="periode" value={periode} />
        )}
        {searchParams.du && (
          <input type="hidden" name="du" value={searchParams.du} />
        )}
        {searchParams.au && (
          <input type="hidden" name="au" value={searchParams.au} />
        )}
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Nom, email, tél., n° commande…"
          className="rounded-lg border border-slate-300 px-3 py-2 lg:col-span-2"
        />
        <select
          name="residence"
          defaultValue={residence ?? ""}
          className="rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="">Toutes stations</option>
          <option value="arc_1800">Arc 1800</option>
          <option value="arc_2000">Arc 2000</option>
        </select>
        <input
          name="date"
          type="date"
          title="Séjour en cours à cette date"
          defaultValue={date ?? ""}
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
        <div className="flex gap-2">
          <button className="flex-1 rounded-lg bg-ardoise px-4 py-2 text-white">
            Filtrer
          </button>
          <Link
            href="/admin"
            title="Réinitialiser"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            ✕
          </Link>
        </div>
      </form>

      <div className="mt-6 overflow-x-auto rounded-[18px] border border-slate-200 bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">N°</th>
              <th className="px-4 py-3">Passée le</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Station</th>
              <th className="px-4 py-3">Séjour</th>
              <th className="px-4 py-3">Articles</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t border-slate-100 align-top">
                <td className="whitespace-nowrap px-4 py-3 font-semibold">
                  {b.orderNumber}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {format(b.createdAt, "dd/MM/yyyy HH:mm", { locale: fr })}
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-ardoise">{b.clientNom}</p>
                  <p className="text-slate-600">{b.clientEmail}</p>
                  {b.clientTelephone && (
                    <p className="text-slate-600">{b.clientTelephone}</p>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {residenceLabel(b.residence)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {format(b.dateArrivee, "dd/MM", { locale: fr })} →{" "}
                  {format(b.dateDepart, "dd/MM/yy", { locale: fr })}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {b.items
                    .map((i) => `${i.product.name} ×${i.quantity}`)
                    .join(", ")}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                  {formatEuros(b.montantTotalCents)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <Link
                    href={`/admin/commandes/${b.id}`}
                    className="font-semibold text-sapin hover:underline"
                  >
                    Détail →
                  </Link>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-slate-600"
                >
                  Aucune commande pour ces critères.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4 text-sm">
          {page > 1 && (
            <Link href={pageHref(page - 1)} className="text-sapin">
              ← Précédent
            </Link>
          )}
          <span>
            Page {page} / {pages}
          </span>
          {page < pages && (
            <Link href={pageHref(page + 1)} className="text-sapin">
              Suivant →
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
