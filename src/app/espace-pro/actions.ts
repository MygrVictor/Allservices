"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  SESSION_DAYS,
  checkCredentials,
  createSessionToken,
} from "@/lib/admin-session";

function safeNext(value: FormDataEntryValue | null) {
  const s = String(value ?? "");
  return s.startsWith("/admin") ? s : "/admin";
}

export async function login(formData: FormData) {
  const user = String(formData.get("user") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("suite"));

  if (!checkCredentials(user, password)) {
    // petit délai contre les essais en rafale
    await new Promise((r) => setTimeout(r, 800));
    redirect(`/espace-pro?erreur=1&suite=${encodeURIComponent(next)}`);
  }

  cookies().set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 3600,
  });
  redirect(next);
}

export async function logout() {
  cookies().delete(ADMIN_COOKIE);
  redirect("/espace-pro");
}
