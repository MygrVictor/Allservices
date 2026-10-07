import type { Metadata } from "next";
import { Merriweather, Source_Sans_3 } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LocaleProvider } from "@/components/locale-provider";
import { CartProvider } from "@/components/cart-provider";
import { getLocale } from "@/lib/i18n-server";
import { makeT } from "@/lib/i18n";
import { isSiteInStandby } from "@/lib/site-config";
import "./globals.css";

const headingFont = Merriweather({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.allservicesmontagne.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "All Services Montagne",
    template: "%s | All Services Montagne",
  },
  description: "Conciergerie et laverie aux Arcs 1800 et 2000",
  applicationName: "All Services Montagne",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "All Services Montagne",
    title: "All Services Montagne",
    description:
      "Conciergerie, laverie et location de linge & ski aux Arcs 1800 et 2000.",
    images: [
      {
        url: "/brand/logo-allservices.png",
        width: 1200,
        height: 630,
        alt: "All Services Montagne",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Services Montagne",
    description:
      "Conciergerie, laverie et location de linge & ski aux Arcs 1800 et 2000.",
    images: ["/brand/logo-allservices.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const standby = isSiteInStandby();
  const locale = getLocale();
  const t = makeT(locale);

  return (
    <html
      lang={locale}
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-neige text-slate-800 selection:bg-sapin/20">
        <LocaleProvider locale={locale}>
          <CartProvider>
            {standby && (
              <div className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-900">
                {t(
                  "Site en veille hors saison. Les demandes restent possibles via le formulaire de contact.",
                  "Off-season mode. Requests are still possible via the contact form.",
                )}
              </div>
            )}
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
