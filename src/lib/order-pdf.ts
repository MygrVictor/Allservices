import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatEuros, PRODUCTS } from "@/lib/catalog";
import { SITE, STATIONS } from "@/lib/site-config";

export type OrderPdfInput = {
  bookingId: string;
  createdAt: Date;
  paidAt?: Date | null;
  clientNom: string;
  clientEmail: string;
  clientTelephone?: string | null;
  residence?: string | null;
  propertyReference?: string | null;
  dateArrivee: Date;
  dateDepart: Date;
  creneauLivraison?: string | null;
  totalCents: number;
  items: {
    code?: string;
    name: string;
    quantity: number;
    unitPriceCents: number;
  }[];
};

const KAKI = rgb(74 / 255, 82 / 255, 51 / 255);
const INK = rgb(0.15, 0.16, 0.12);
const GREY = rgb(0.4, 0.4, 0.4);

/** Les polices standard PDF (WinAnsi) ne couvrent pas tous les caractères. */
function safe(text: string) {
  return text
    .replace(/[\u202F\u2009]/g, " ")
    .replace(/→/g, "->")
    .replace(/[^\x00-\xFF€—–’‘“”…•·]/g, "?");
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = safe(text).split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function generateOrderPdf(
  order: OrderPdfInput,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Bon de commande ${order.bookingId}`);
  pdf.setAuthor(SITE.name);

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page: PDFPage = pdf.addPage([595.28, 841.89]); // A4
  const margin = 48;
  const width = page.getWidth() - margin * 2;
  let y = page.getHeight() - margin;

  const ensureSpace = (needed: number) => {
    if (y - needed < margin) {
      page = pdf.addPage([595.28, 841.89]);
      y = page.getHeight() - margin;
    }
  };

  const text = (
    value: string,
    opts: {
      size?: number;
      bold?: boolean;
      color?: ReturnType<typeof rgb>;
      x?: number;
    } = {},
  ) => {
    const size = opts.size ?? 10;
    const f = opts.bold ? bold : font;
    for (const line of wrap(
      value,
      f,
      size,
      width - ((opts.x ?? margin) - margin),
    )) {
      ensureSpace(size + 4);
      page.drawText(line, {
        x: opts.x ?? margin,
        y,
        size,
        font: f,
        color: opts.color ?? INK,
      });
      y -= size + 4;
    }
  };

  // En-tête
  page.drawRectangle({
    x: 0,
    y: page.getHeight() - 90,
    width: page.getWidth(),
    height: 90,
    color: KAKI,
  });
  page.drawText(safe(SITE.name), {
    x: margin,
    y: page.getHeight() - 45,
    size: 20,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText(safe("Bon de commande — Les Arcs 1800 & 2000"), {
    x: margin,
    y: page.getHeight() - 68,
    size: 11,
    font,
    color: rgb(1, 1, 1),
  });
  y = page.getHeight() - 120;

  const station = STATIONS.find((s) => s.id === order.residence);
  const fmt = (d: Date) => format(d, "dd/MM/yyyy", { locale: fr });

  text(`Référence : ${order.bookingId}`, { bold: true, size: 12 });
  text(
    `Date de commande : ${fmt(order.createdAt)}${order.paidAt ? ` — payée le ${fmt(order.paidAt)}` : ""}`,
  );
  y -= 6;
  text("Client", { bold: true, size: 12, color: KAKI });
  text(
    `${order.clientNom} — ${order.clientEmail}${order.clientTelephone ? ` — ${order.clientTelephone}` : ""}`,
  );
  y -= 6;
  text("Séjour", { bold: true, size: 12, color: KAKI });
  text(
    `Station : ${station?.name ?? "—"}  ·  Du ${fmt(order.dateArrivee)} au ${fmt(order.dateDepart)}`,
  );
  if (order.creneauLivraison) text(`Récupération : ${order.creneauLivraison}`);
  if (order.propertyReference)
    text(`Adresse / hébergement : ${order.propertyReference}`);
  y -= 10;

  // Tableau
  ensureSpace(30);
  page.drawRectangle({
    x: margin,
    y: y - 6,
    width,
    height: 20,
    color: rgb(232 / 255, 234 / 255, 220 / 255),
  });
  page.drawText("Prestation", {
    x: margin + 6,
    y,
    size: 10,
    font: bold,
    color: INK,
  });
  page.drawText("Qté", {
    x: margin + width - 170,
    y,
    size: 10,
    font: bold,
    color: INK,
  });
  page.drawText("Total", {
    x: margin + width - 70,
    y,
    size: 10,
    font: bold,
    color: INK,
  });
  y -= 24;

  for (const item of order.items) {
    const lines = wrap(item.name, font, 10, width - 190);
    ensureSpace(lines.length * 14 + 6);
    const rowTop = y;
    lines.forEach((line, i) =>
      page.drawText(line, {
        x: margin + 6,
        y: rowTop - i * 14,
        size: 10,
        font,
        color: INK,
      }),
    );
    page.drawText(String(item.quantity), {
      x: margin + width - 165,
      y: rowTop,
      size: 10,
      font,
      color: INK,
    });
    page.drawText(safe(formatEuros(item.unitPriceCents * item.quantity)), {
      x: margin + width - 70,
      y: rowTop,
      size: 10,
      font,
      color: INK,
    });
    y = rowTop - lines.length * 14 - 6;
    page.drawLine({
      start: { x: margin, y: y + 8 },
      end: { x: margin + width, y: y + 8 },
      thickness: 0.5,
      color: rgb(0.85, 0.85, 0.85),
    });
  }

  y -= 6;
  ensureSpace(20);
  page.drawText(safe(`Total payé : ${formatEuros(order.totalCents)} TTC`), {
    x: margin + width - 200,
    y,
    size: 12,
    font: bold,
    color: KAKI,
  });
  y -= 30;

  // Informations pratiques
  const hasSki = order.items.some(
    (item) => PRODUCTS.find((p) => p.code === item.code)?.category === "ski",
  );
  text("Informations pratiques", { bold: true, size: 12, color: KAKI });
  if (order.creneauLivraison?.startsWith("Livraison")) {
    text(
      `Livraison du linge planifiée entre ${SITE.deliveryWindow} le jour de votre arrivée. Le créneau exact est organisé par nos soins.`,
    );
  } else {
    text(
      `Retrait en magasin toute la journée, pendant les heures d'ouverture de la conciergerie (${SITE.openingHours}). Présentez ce bon (papier ou téléphone).`,
    );
  }
  if (hasSki) {
    text(
      "Location de ski : présentez ce bon au magasin partenaire pour retirer votre matériel.",
    );
  }
  if (station) {
    text(`${station.name} : ${station.address}. ${station.directions}`, {
      color: GREY,
    });
  }
  text(`Contact : ${SITE.phone} — ${SITE.email}`, { color: GREY });

  return pdf.save();
}
