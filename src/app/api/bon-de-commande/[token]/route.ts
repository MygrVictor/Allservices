import { NextRequest, NextResponse } from "next/server";
import { BookingStatus } from "@prisma/client";
import {
  buildOrderPdf,
  loadOrderForPdf,
  orderPdfFilename,
  parseOrderPdfKind,
} from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Téléchargement du bon de commande (sans compte : accès par jeton secret). */
export async function GET(
  request: NextRequest,
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

  const kind = parseOrderPdfKind(request.nextUrl.searchParams.get("type"));
  const pdf = await buildOrderPdf(booking, kind);
  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${orderPdfFilename(booking.id, kind)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
