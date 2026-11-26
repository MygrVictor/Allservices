import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { logout } from "@/app/espace-pro/actions";
import { AdminPwaRegister } from "@/components/admin-pwa-register";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Back-office",
  robots: { index: false, follow: false },
  // Back-office installable comme application (s'ouvre directement sur /admin).
  manifest: "/admin.webmanifest",
  icons: { apple: "/pwa/icon-180.png" },
  appleWebApp: {
    capable: true,
    title: "AS Admin",
    statusBarStyle: "default" as const,
  },
};

export const viewport = { themeColor: "#343a23" };

const NAV = [
  { href: "/admin", label: "Commandes" },
  { href: "/admin/prestations", label: "Prestations" },
  { href: "/admin/horaires", label: "Horaires" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageContainer>
      <AdminPwaRegister />
      <div className="py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] bg-ardoise px-5 py-4 text-white">
          <p className="font-semibold">Back-office All Services Montagne</p>
          <nav className="flex flex-wrap gap-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold transition hover:bg-white/25"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
              Déconnexion
            </button>
          </form>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </PageContainer>
  );
}
