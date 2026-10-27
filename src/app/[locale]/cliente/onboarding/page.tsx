import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { cookies } from "next/headers";
import { ROUTE_LOCALES, getRouteByPath, getPublishedLocales, type RouteLocale } from "../../../../config/routeRegistry";
import { getAbsoluteLocalizedUrl, getAlternates } from "../../../../lib/seo";
import { ONBOARDING_SESSION_COOKIE, resolveOnboardingSession, getOnboardingPrisma } from "../../../../../server/onboardingAccess";
import { OnboardingAccessGate, OnboardingSessionClient } from "../../../../features/site/onboarding/OnboardingRouteClient";
import { isOnboardingEnabled } from "../../../../../server/onboardingAvailability.mjs";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isOnboardingEnabled()) return { robots: { index: false, follow: false } };
  const { locale: rawLocale } = await params;
  const locale = ROUTE_LOCALES.includes(rawLocale as RouteLocale) ? rawLocale as RouteLocale : "pt";
  return {
    title: "Onboarding de clientes | TAG08",
    robots: { index: false, follow: true },
    alternates: {
      canonical: getAbsoluteLocalizedUrl("/cliente/onboarding", locale),
      languages: getAlternates("/cliente/onboarding")
    }
  };
}

export default async function OnboardingRoute({ params }: PageProps) {
  if (!isOnboardingEnabled()) notFound();
  const { locale: rawLocale } = await params;
  const locale = (ROUTE_LOCALES.includes(rawLocale as RouteLocale) ? rawLocale : "pt") as RouteLocale;
  const route = getRouteByPath("/cliente/onboarding");
  if (route && !getPublishedLocales(route).includes(locale)) {
    permanentRedirect(route.canonicalPath);
  }
  const cookieStore = await cookies();
  const secret = cookieStore.get(ONBOARDING_SESSION_COOKIE)?.value;
  if (!secret) return <OnboardingAccessGate locale={locale} />;

  try {
    const session = await resolveOnboardingSession(getOnboardingPrisma(), secret);
    if (!session) return <OnboardingAccessGate locale={locale} />;
    return <OnboardingSessionClient locale={locale} />;
  } catch {
    return <OnboardingAccessGate locale={locale} />;
  }
}
