import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { contactSchema } from "@/lib/validation";

export const runtime = "nodejs";

// Limitation simple par IP (mémoire du process) : 5 messages / 10 min.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnu";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de messages envoyés. Réessayez dans quelques minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides." },
      { status: 400 },
    );
  }

  const { website, startedAt, ...contact } = parsed.data;
  const elapsed = Date.now() - startedAt;
  // Bot probable (champ piège rempli ou formulaire soumis en < 3 s) :
  // on répond « OK » sans envoyer pour ne pas renseigner le robot.
  if (website || elapsed < 3000 || elapsed > 24 * 60 * 60 * 1000) {
    return NextResponse.json({ ok: true });
  }

  const sent = await sendContactEmail(contact);
  if (!sent) {
    return NextResponse.json(
      { error: "Le message n'a pas pu être envoyé. Appelez-nous directement." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
