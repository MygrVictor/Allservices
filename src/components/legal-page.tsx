import { PageContainer } from "@/components/page-container";

/** Mise en page commune aux pages légales (mentions, CGV). */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <PageContainer>
      <section className="mx-auto max-w-3xl py-12">
        <h1 className="text-4xl text-ardoise">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          Dernière mise à jour : {updated}
        </p>
        <div className="mt-8 space-y-8 text-[15px] leading-7 text-slate-700">
          {children}
        </div>
      </section>
    </PageContainer>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-panel border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-xl text-ardoise">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

/** Information manquante à fournir par la cliente (bien visible). */
export function Todo({ children }: { children: React.ReactNode }) {
  return (
    <mark className="rounded bg-amber-100 px-1 font-semibold text-amber-900">
      [À COMPLÉTER : {children}]
    </mark>
  );
}
