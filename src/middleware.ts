import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-session";

export async function middleware(request: NextRequest) {
  const ok = await verifySessionToken(
    request.cookies.get(ADMIN_COOKIE)?.value,
  );
  if (ok) return NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = "/espace-pro";
  url.search = `?suite=${encodeURIComponent(request.nextUrl.pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
