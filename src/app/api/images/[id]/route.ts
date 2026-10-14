import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/** Sert une photo envoyée depuis le back-office. */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!/^[a-z0-9]{10,40}$/i.test(params.id)) {
    return new NextResponse("Not found", { status: 404 });
  }
  const image = await prisma.image.findUnique({ where: { id: params.id } });
  if (!image) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(Buffer.from(image.data), {
    headers: {
      "Content-Type": image.mimeType,
      // L'id change à chaque nouvelle photo : cache long sans risque.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
