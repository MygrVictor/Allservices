import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  checkCredentials,
  createSessionToken,
  verifySessionToken,
} from "./admin-session";

describe("session admin", () => {
  beforeEach(() => {
    process.env.ADMIN_USER = "carmen";
    process.env.ADMIN_PASSWORD = "secret-1";
    delete process.env.ADMIN_SESSION_SECRET;
  });
  afterEach(() => {
    delete process.env.ADMIN_USER;
    delete process.env.ADMIN_PASSWORD;
  });

  it("accepte un jeton valide", async () => {
    expect(await verifySessionToken(await createSessionToken())).toBe(true);
  });

  it("refuse un jeton expiré", async () => {
    const t = await createSessionToken(Date.now() - 8 * 24 * 3600 * 1000);
    expect(await verifySessionToken(t)).toBe(false);
  });

  it("refuse un jeton falsifié (expiration modifiée)", async () => {
    const [, sig] = (await createSessionToken()).split(".");
    expect(await verifySessionToken(`${Date.now() + 1e12}.${sig}`)).toBe(false);
  });

  it("invalide les sessions si le mot de passe change", async () => {
    const t = await createSessionToken();
    process.env.ADMIN_PASSWORD = "nouveau";
    expect(await verifySessionToken(t)).toBe(false);
  });

  it("refuse vide / absent", async () => {
    expect(await verifySessionToken(undefined)).toBe(false);
    expect(await verifySessionToken("abc")).toBe(false);
  });

  it("vérifie les identifiants", () => {
    expect(checkCredentials("carmen", "secret-1")).toBe(true);
    expect(checkCredentials("carmen", "faux")).toBe(false);
    expect(checkCredentials("autre", "secret-1")).toBe(false);
  });
});
