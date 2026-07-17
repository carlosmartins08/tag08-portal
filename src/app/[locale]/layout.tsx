import type { Metadata } from "next";
import "../../index.css";
import { getHreflang } from "../../lib/seo";
import { ROUTE_LOCALES, type RouteLocale } from "../../config/routeRegistry";

export const metadata: Metadata = {
  metadataBase: new URL("https://tag08.com.br"),
  applicationName: "TAG08",
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION
  }
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;
  const resolvedLocale = ROUTE_LOCALES.includes(locale as RouteLocale) ? (locale as RouteLocale) : "pt";

  return (
    <html lang={getHreflang(resolvedLocale)} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
