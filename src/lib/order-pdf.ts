import { readFile } from "node:fs/promises";
import path from "node:path";
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
  orderNumber: number;
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
  /** Type de bon : linge (conciergerie) ou ski (retrait chez Skiset). */
  kind?: "linge" | "ski";
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
const LIGHT = rgb(232 / 255, 234 / 255, 220 / 255);

const imageCache = new Map<string, Uint8Array | null>();
async function loadPublicImage(file: string) {
  if (imageCache.has(file)) return imageCache.get(file) ?? null;
  let bytes: Uint8Array | null;
  try {
    bytes = await readFile(path.join(process.cwd(), "public", file));
  } catch {
    bytes = null;
  }
  imageCache.set(file, bytes);
  return bytes;
}
const loadLogo = () => loadPublicImage("brand/logo-allservices.png");
const loadSkisetLogo = () => loadPublicImage("partners/skiset.png");

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
  pdf.setTitle(`Bon de commande ${order.orderNumber}`);
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

  // En-tête : logo à gauche, titre à droite
  const top = page.getHeight() - 40;
  const logoBytes = await loadLogo();
  if (logoBytes) {
    const logo = await pdf.embedPng(logoBytes);
    const logoW = 200;
    const logoH = (logo.height / logo.width) * logoW;
    page.drawImage(logo, {
      x: margin,
      y: top - logoH,
      width: logoW,
      height: logoH,
    });
  } else {
    page.drawText(safe(SITE.name), {
      x: margin,
      y: top - 24,
      size: 20,
      font: bold,
      color: KAKI,
    });
  }
  const isSki = order.kind === "ski";
  const title = isSki ? "BON DE RETRAIT SKI" : "BON DE COMMANDE";
  page.drawText(title, {
    x: margin + width - bold.widthOfTextAtSize(title, 18),
    y: top - 18,
    size: 18,
    font: bold,
    color: KAKI,
  });
  const sub = safe(`N° ${order.orderNumber}`);
  page.drawText(sub, {
    x: margin + width - font.widthOfTextAtSize(sub, 9),
    y: top - 34,
    size: 9,
    font,
    color: GREY,
  });
  const sub2 = safe("Les Arcs 1800 & 2000");
  page.drawText(sub2, {
    x: margin + width - font.widthOfTextAtSize(sub2, 9),
    y: top - 46,
    size: 9,
    font,
    color: GREY,
  });
  page.drawRectangle({
    x: margin,
    y: top - 62,
    width,
    height: 2.5,
    color: KAKI,
  });
  y = top - 88;

  // Bandeau partenaire Skiset
  if (isSki) {
    const skisetBytes = await loadSkisetLogo();
    const bandH = 46;
    page.drawRectangle({
      x: margin,
      y: y - bandH + 14,
      width,
      height: bandH,
      borderColor: KAKI,
      borderWidth: 0.8,
    });
    const label = "Location de matériel en partenariat avec";
    page.drawText(label, {
      x: margin + 14,
      y: y - 12,
      size: 10,
      font: bold,
      color: KAKI,
    });
    if (skisetBytes) {
      const skiset = await pdf.embedPng(skisetBytes);
      const h = 30;
      const w = (skiset.width / skiset.height) * h;
      page.drawImage(skiset, {
        x: margin + width - w - 14,
        y: y - bandH + 22,
        width: w,
        height: h,
      });
    } else {
      page.drawText("SKISET", {
        x: margin + width - 80,
        y: y - 12,
        size: 14,
        font: bold,
        color: KAKI,
      });
    }
    y -= bandH + 14;
  }

  const station = STATIONS.find((s) => s.id === order.residence);
  const fmt = (d: Date) => format(d, "dd/MM/yyyy", { locale: fr });

  // Deux encadrés : Client / Séjour
  const boxW = (width - 14) / 2;
  const fitLines = (s: string, w: number) => wrap(s, font, 9.5, w - 20);
  const clientLines = [
    order.clientNom,
    order.clientEmail,
    order.clientTelephone ?? "",
    `Commandé le ${fmt(order.createdAt)}${order.paidAt ? ` · payé le ${fmt(order.paidAt)}` : ""}`,
  ]
    .filter(Boolean)
    .flatMap((s) => fitLines(s, boxW));
  const stayLines = [
    `Station : ${station?.name ?? "—"}`,
    `Arrivée : ${fmt(order.dateArrivee)}`,
    `Départ : ${fmt(order.dateDepart)}`,
    order.propertyReference ? `Adresse : ${order.propertyReference}` : "",
  ]
    .filter(Boolean)
    .flatMap((s) => fitLines(s, boxW));
  const boxH = 30 + Math.max(clientLines.length, stayLines.length) * 13;
  const drawBox = (x: number, label: string, lines: string[]) => {
    page.drawRectangle({
      x,
      y: y - boxH,
      width: boxW,
      height: boxH,
      color: LIGHT,
    });
    page.drawText(label, {
      x: x + 10,
      y: y - 16,
      size: 9,
      font: bold,
      color: KAKI,
    });
    lines.forEach((l, i) =>
      page.drawText(l, {
        x: x + 10,
        y: y - 32 - i * 13,
        size: 9.5,
        font: i === 0 ? bold : font,
        color: INK,
      }),
    );
  };
  drawBox(margin, "CLIENT", clientLines);
  drawBox(margin + boxW + 14, "SÉJOUR", stayLines);
  y -= boxH + 16;
  if (order.creneauLivraison && !isSki) {
    text(`Récupération : ${order.creneauLivraison}`, {
      bold: true,
      color: KAKI,
    });
  }
  y -= 10;

  // Tableau
  ensureSpace(30);
  page.drawRectangle({
    x: margin,
    y: y - 6,
    width,
    height: 20,
    color: KAKI,
  });
  const th = (label: string, x: number) =>
    page.drawText(label, { x, y, size: 9.5, font: bold, color: rgb(1, 1, 1) });
  th("Prestation", margin + 6);
  th("Prix unit.", margin + width - 200);
  th("Qté", margin + width - 115);
  th("Total", margin + width - 60);
  y -= 24;

  for (const item of order.items) {
    const lines = wrap(item.name, font, 10, width - 220);
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
    page.drawText(safe(formatEuros(item.unitPriceCents)), {
      x: margin + width - 200,
      y: rowTop,
      size: 10,
      font,
      color: GREY,
    });
    page.drawText(String(item.quantity), {
      x: margin + width - 110,
      y: rowTop,
      size: 10,
      font,
      color: INK,
    });
    page.drawText(safe(formatEuros(item.unitPriceCents * item.quantity)), {
      x: margin + width - 60,
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

  y -= 10;
  ensureSpace(34);
  const totalLabel = safe(`TOTAL PAYÉ : ${formatEuros(order.totalCents)} TTC`);
  const tw = bold.widthOfTextAtSize(totalLabel, 12) + 24;
  page.drawRectangle({
    x: margin + width - tw,
    y: y - 9,
    width: tw,
    height: 26,
    color: KAKI,
  });
  page.drawText(totalLabel, {
    x: margin + width - tw + 12,
    y,
    size: 12,
    font: bold,
    color: rgb(1, 1, 1),
  });
  y -= 40;

  // Informations pratiques
  const hasSki =
    order.kind !== "linge" &&
    order.items.some(
      (item) => PRODUCTS.find((p) => p.code === item.code)?.category === "ski",
    );
  text("Informations pratiques", { bold: true, size: 12, color: KAKI });
  if (isSki) {
    // uniquement le retrait ski ci-dessous
  } else if (order.creneauLivraison?.startsWith("Livraison")) {
    text(
      `Livraison du linge planifiée entre ${SITE.deliveryWindow} le jour de votre arrivée. Le créneau exact est organisé par nos soins.`,
    );
  } else {
    text(
      `Retrait en magasin toute la journée, pendant les heures d'ouverture de la conciergerie (${SITE.openingHours}). Présentez ce bon (papier ou téléphone).`,
    );
    text(
      "Une empreinte de carte bancaire sera demandée en agence comme caution du linge.",
    );
  }
  if (hasSki) {
    y -= 6;
    const stationName = station?.name ?? "votre station";
    const skiLines = [
      `Ce bon vous permet de retirer votre matériel de ski dans n'importe quel magasin Skiset d'${stationName}.`,
      "Le matériel est déjà réglé : il vous suffit de présenter ce bon (imprimé ou sur votre téléphone) avec une pièce d'identité.",
      "Prévoyez la pointure et la taille / le poids de chaque skieur pour le réglage des fixations.",
      `Le retrait se fait à partir du ${fmt(order.dateArrivee)}. Le matériel est à rendre dans un magasin Skiset d'${stationName} au plus tard le ${fmt(order.dateDepart)}.`,
    ].flatMap((s) => wrap(s, font, 9.5, width - 28));
    const skiH = 34 + skiLines.length * 13;
    ensureSpace(skiH + 10);
    page.drawRectangle({
      x: margin,
      y: y - skiH + 12,
      width,
      height: skiH,
      borderColor: KAKI,
      borderWidth: 1.5,
      color: LIGHT,
    });
    page.drawText(
      safe(
        `LOCATION DE SKI · PARTENAIRE SKISET · ${stationName.toUpperCase()}`,
      ),
      { x: margin + 14, y: y - 4, size: 10.5, font: bold, color: KAKI },
    );
    skiLines.forEach((l, i) =>
      page.drawText(l, {
        x: margin + 14,
        y: y - 22 - i * 13,
        size: 9.5,
        font,
        color: INK,
      }),
    );
    y -= skiH + 8;
  }
  if (station) {
    text(`${station.name} : ${station.address}. ${station.directions}`, {
      color: GREY,
    });
  }
  text(`Contact : ${SITE.phone} — ${SITE.email}`, { color: GREY });

  // Pied de page sur chaque page
  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    p.drawLine({
      start: { x: margin, y: 36 },
      end: { x: p.getWidth() - margin, y: 36 },
      thickness: 0.5,
      color: KAKI,
    });
    const foot = safe(
      `${SITE.name} · Les Arcs · ${SITE.phone} · ${SITE.email}`,
    );
    p.drawText(foot, { x: margin, y: 24, size: 8, font, color: GREY });
    const num = `${i + 1} / ${pages.length}`;
    p.drawText(num, {
      x: p.getWidth() - margin - font.widthOfTextAtSize(num, 8),
      y: 24,
      size: 8,
      font,
      color: GREY,
    });
  });

  return pdf.save();
}
