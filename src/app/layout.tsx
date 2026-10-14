import type { Metadata } from "next";
import { Fraunces, Merriweather, Source_Sans_3 } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LocaleProvider } from "@/components/locale-provider";
import { CartProvider } from "@/components/cart-provider";
import { getLocale } from "@/lib/i18n-server";
import { makeT } from "@/lib/i18n";
import { loadSettings } from "@/lib/settings";
import { SettingsHydrator } from "@/components/settings-hydrator";
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

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.allservicesmontagne.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "All Services Montagne",
    template: "%s | All Services Montagne",
  },
  description: "Conciergerie et laverie sur les Arcs 1800 et 2000",
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
      "Conciergerie, laverie et location de linge & ski sur les Arcs 1800 et 2000.",
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
      "Conciergerie, laverie et location de linge & ski sur les Arcs 1800 et 2000.",
    images: ["/brand/logo-allservices.png"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await loadSettings();
  const locale = getLocale();
  const t = makeT(locale);

  return (
    <html
      lang={locale}
      className={`${headingFont.variable} ${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-neige text-slate-800 selection:bg-sapin/20">
        <SettingsHydrator settings={settings}>
          <LocaleProvider locale={locale}>
            <CartProvider>
              <SiteHeader />
              <main>{children}</main>
              <SiteFooter />
            </CartProvider>
          </LocaleProvider>
        </SettingsHydrator>
      </body>
    </html>
  );
}
