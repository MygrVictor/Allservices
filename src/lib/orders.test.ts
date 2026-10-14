import { beforeEach, describe, expect, it, vi } from "vitest";

// Base de données et emails simulés : on vérifie seulement la logique.
const updateMany = vi.fn();
const findUnique = vi.fn();
const sendBookingEmails = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: { booking: { updateMany, findUnique } },
}));
vi.mock("@/lib/email", () => ({ sendBookingEmails }));
vi.mock("@/lib/settings", () => ({ loadSettings: vi.fn() }));
vi.mock("@/lib/order-pdf", () => ({
  generateOrderPdf: vi.fn(async () => new Uint8Array([1])),
}));

const { confirmOrderPayment } = await import("@/lib/orders");

const booking = {
  id: "b1",
  downloadToken: "tok",
  targetAudience: "vacancier",
  clientNom: "Test",
  clientEmail: "t@example.com",
  clientTelephone: null,
  createdAt: new Date(),
  paidAt: new Date(),
  dateArrivee: new Date(),
  dateDepart: new Date(),
  residence: "arc_1800",
  propertyReference: null,
  creneauLivraison: null,
  montantTotalCents: 2800,
  items: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  findUnique.mockResolvedValue(booking);
});

describe("confirmOrderPayment — notification reçue en double", () => {
  it("confirme et envoie les emails la première fois", async () => {
    updateMany.mockResolvedValueOnce({ count: 1 });
    await confirmOrderPayment({
      bookingId: "b1",
      paymentRef: "tx",
      provider: "systempay",
    });

    // Ne passe à « payée » qu'une commande encore en attente
    expect(updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "b1", status: "pending" } }),
    );
    expect(sendBookingEmails).toHaveBeenCalledTimes(1);
  });

  it("ne renvoie rien si la commande est déjà payée", async () => {
    updateMany
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 0 });
    await confirmOrderPayment({
      bookingId: "b1",
      paymentRef: "tx",
      provider: "systempay",
    });
    await confirmOrderPayment({
      bookingId: "b1",
      paymentRef: "tx",
      provider: "systempay",
    });
    expect(sendBookingEmails).toHaveBeenCalledTimes(1);
  });

  it("ne fait rien pour une commande inconnue", async () => {
    updateMany.mockResolvedValueOnce({ count: 0 });
    await confirmOrderPayment({
      bookingId: "inconnue",
      paymentRef: "tx",
      provider: "systempay",
    });
    expect(sendBookingEmails).not.toHaveBeenCalled();
  });
});
