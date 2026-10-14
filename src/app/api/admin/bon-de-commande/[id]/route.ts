import { NextRequest, NextResponse } from "next/server";
import {
  buildOrderPdf,
  loadOrderForPdf,
  orderPdfFilename,
  parseOrderPdfKind,
} from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Bon de commande pour le back-office (protégé par le middleware admin). */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const booking = await loadOrderForPdf({ id: params.id });
  if (!booking) {
    return NextResponse.json(
      { error: "Commande introuvable." },
      { status: 404 },
    );
  }

  const kind = parseOrderPdfKind(request.nextUrl.searchParams.get("type"));
  const pdf = await buildOrderPdf(booking, kind);
  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${orderPdfFilename(booking.id, kind)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
