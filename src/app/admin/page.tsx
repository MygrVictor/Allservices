import Link from "next/link";
import {
  BookingStatus,
  Prisma,
  Residence,
  TargetAudience,
} from "@prisma/client";
import { format } from "date-fns";
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
  };
};

const PAGE_SIZE = 50;

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

  const where: Prisma.BookingWhereInput = {
    // Seules les commandes payées (les paniers abandonnés restent cachés).
    status: BookingStatus.paid,
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

  const [bookings, count, totals] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: [{ createdAt: "desc" }],
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.booking.count({ where }),
    prisma.booking.aggregate({ where, _sum: { montantTotalCents: true } }),
  ]);

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
      <p className="mt-2 text-slate-700">
        {count} commande{count > 1 ? "s" : ""} ·{" "}
        {formatEuros(totals._sum.montantTotalCents ?? 0)} au total
      </p>

      <form className="mt-6 grid gap-3 rounded-[18px] border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
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
