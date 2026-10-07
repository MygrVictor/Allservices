import { NextRequest, NextResponse } from "next/server";
import { BookingStatus } from "@prisma/client";
import { buildOrderPdf, loadOrderForPdf } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Téléchargement du bon de commande (sans compte : accès par jeton secret). */
export async function GET(
  _request: NextRequest,
  { params }: { params: { token: string } },
) {
  if (!/^[a-z0-9]{20,40}$/i.test(params.token)) {
    return NextResponse.json({ error: "Lien invalide." }, { status: 404 });
  }

  const booking = await loadOrderForPdf({ downloadToken: params.token });
  if (!booking || booking.status !== BookingStatus.paid) {
    return NextResponse.json(
      { error: "Bon de commande indisponible (paiement non confirmé)." },
      { status: 404 },
    );
  }

  const pdf = await buildOrderPdf(booking);
  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="bon-de-commande-${booking.id}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
