/**
 * Session admin : cookie signé HMAC-SHA256 (Web Crypto, compatible middleware).
 * Format : "<expiration ms>.<signature hex>".
 */
export const ADMIN_COOKIE = "as_admin";
export const SESSION_DAYS = 7;

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  return s && s.length > 0 ? s : null;
}

async function sign(value: string, key: string) {
  const enc = new TextEncoder();
  const k = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", k, enc.encode(value));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(now = Date.now()) {
  const key = secret();
  if (!key) throw new Error("ADMIN_PASSWORD manquant");
  const exp = String(now + SESSION_DAYS * 24 * 3600 * 1000);
  return `${exp}.${await sign(`admin:${exp}`, key)}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
  now = Date.now(),
) {
  const key = secret();
  if (!key || !token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < now) return false;
  return safeEqual(sig, await sign(`admin:${exp}`, key));
}

export function checkCredentials(user: string, password: string) {
  const u = process.env.ADMIN_USER;
  const p = process.env.ADMIN_PASSWORD;
  return Boolean(u && p && safeEqual(user, u) && safeEqual(password, p));
}
