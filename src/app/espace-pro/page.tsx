import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-session";
import { login } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Espace pro",
  robots: { index: false, follow: false },
};

export default async function EspaceProPage({
  searchParams,
}: {
  searchParams: { erreur?: string; suite?: string };
}) {
  if (await verifySessionToken(cookies().get(ADMIN_COOKIE)?.value)) {
    redirect("/admin");
  }
  const suite = searchParams.suite?.startsWith("/admin")
    ? searchParams.suite
    : "/admin";

  return (
    <PageContainer>
      <section className="mx-auto max-w-sm py-16">
        <h1 className="text-3xl text-ardoise">Espace pro</h1>
        <p className="mt-2 text-sm text-slate-600">
          Accès réservé à l&apos;équipe All Services.
        </p>
        <form
          action={login}
          className="mt-6 space-y-4 rounded-panel border border-slate-200 bg-white p-6 shadow-sm"
        >
          <input type="hidden" name="suite" value={suite} />
          <label className="block text-sm font-semibold text-ardoise">
            Identifiant
            <input
              name="user"
              required
              autoComplete="username"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal"
            />
          </label>
          <label className="block text-sm font-semibold text-ardoise">
            Mot de passe
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal"
            />
          </label>
          {searchParams.erreur && (
            <p role="alert" className="text-sm font-medium text-red-700">
              Identifiant ou mot de passe incorrect.
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-sapin px-5 py-2.5 text-sm font-semibold text-white hover:bg-sapin/90"
          >
            Se connecter
          </button>
        </form>
      </section>
    </PageContainer>
  );
}
