import { BookingStatus, Residence, TargetAudience } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PageContainer } from "@/components/page-container";
import { prisma } from "@/lib/prisma";

type AdminPageProps = {
  searchParams: {
    date?: string;
    residence?: Residence;
    audience?: TargetAudience;
  };
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const filters = {
    date: searchParams.date,
    residence: searchParams.residence,
    audience: searchParams.audience,
  };

  const bookings = await prisma.booking.findMany({
    where: {
      status: BookingStatus.paid,
      ...(filters.residence ? { residence: filters.residence } : {}),
      ...(filters.audience ? { targetAudience: filters.audience } : {}),
      ...(filters.date
        ? {
            dateArrivee: {
              lte: new Date(filters.date),
            },
            dateDepart: {
              gte: new Date(filters.date),
            },
          }
        : {}),
    },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: [{ dateArrivee: "asc" }],
    take: 200,
  });

  return (
    <PageContainer>
      <section className="py-12">
        <h1 className="text-4xl text-ardoise">Admin · Réservations à venir</h1>
        <p className="mt-3 text-slate-700">
          Filtrez par date, résidence et type de public.
        </p>

        <form className="mt-6 grid gap-3 rounded-panel border border-slate-200 bg-white p-4 sm:grid-cols-4">
          <input
            name="date"
            type="date"
            defaultValue={filters.date ?? ""}
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
          <select
            name="residence"
            defaultValue={filters.residence ?? ""}
            className="rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">Toutes résidences</option>
            <option value="arc_1800">Arc 1800</option>
            <option value="arc_2000">Arc 2000</option>
          </select>
          <select
            name="audience"
            defaultValue={filters.audience ?? ""}
            className="rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">Tous publics</option>
            <option value="proprietaire">Propriétaire</option>
            <option value="vacancier">Vacancier</option>
          </select>
          <button className="rounded-lg bg-ardoise px-4 py-2 text-white">
            Filtrer
          </button>
        </form>

        <div className="mt-6 space-y-4">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-panel border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-semibold text-ardoise">#{booking.id}</h2>
                <p className="text-sm text-slate-600">
                  {format(booking.dateArrivee, "dd/MM/yyyy", { locale: fr })} →{" "}
                  {format(booking.dateDepart, "dd/MM/yyyy", { locale: fr })}
                </p>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                {booking.targetAudience === "proprietaire"
                  ? "Propriétaire"
                  : "Vacancier"}
                {booking.residence
                  ? ` · ${booking.residence === "arc_1800" ? "Arc 1800" : "Arc 2000"}`
                  : ""}
                {booking.propertyReference
                  ? ` · Bien: ${booking.propertyReference}`
                  : ""}
              </p>
              <p className="text-sm text-slate-700">
                {booking.clientNom} · {booking.clientEmail} ·{" "}
                {booking.clientTelephone || "Sans téléphone"}
              </p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
                {booking.items.map((item) => (
                  <li key={item.id}>
                    {item.product.name} x{item.quantity}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          {bookings.length === 0 && (
            <div className="rounded-panel border border-slate-200 bg-white p-6 text-slate-600">
              Aucune réservation payée pour ces critères.
            </div>
          )}
        </div>
      </section>
    </PageContainer>
  );
}
