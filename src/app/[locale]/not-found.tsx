import NotFoundRoute from "../../features/site/NotFoundRoute";
import type { RouteLocale } from "../../config/routeRegistry";

export default async function NotFoundPage({ params }: { params?: Promise<{ locale?: RouteLocale }> }) {
  const locale = (await params)?.locale;
  return <NotFoundRoute locale={locale} />;
}
