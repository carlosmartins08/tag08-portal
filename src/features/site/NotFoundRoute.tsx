"use client";

import { useParams, useRouter } from "next/navigation";
import { getLocalizedPath, ROUTE_LOCALES, type RouteLocale } from "../../config/routeRegistry";
import NotFound from "./pages/NotFound";

export default function NotFoundRoute({ locale }: { locale?: RouteLocale }) {
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const routeLocale = locale ?? (ROUTE_LOCALES.includes(params.locale as RouteLocale) ? params.locale as RouteLocale : "pt");

  return <NotFound locale={routeLocale} onNavigate={(path) => router.push(getLocalizedPath(path, routeLocale))} />;
}
