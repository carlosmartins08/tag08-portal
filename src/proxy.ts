import { NextResponse, type NextRequest } from "next/server";
import { canonicalizeRoute, getLocalizedPath, type RouteLocale } from "./config/routeRegistry";

const supportedLocales = new Set(["pt", "en", "es"]);

export function proxy(request: NextRequest) {
  const requestedLocale = request.nextUrl.searchParams.get("lang");
  const url = request.nextUrl.clone();
  const [, requestedPrefix] = url.pathname.split("/");
  const currentLocale = supportedLocales.has(requestedPrefix) ? requestedPrefix : undefined;

  if (requestedLocale && (requestedLocale === "en" || requestedLocale === "es")) {
    const pathname = url.pathname.replace(/^\/(pt|en|es)(?=\/|$)/, "") || "/";
    url.pathname = pathname === "/" ? `/${requestedLocale}` : `/${requestedLocale}${pathname}`;
    url.searchParams.delete("lang");
    return NextResponse.redirect(url, 308);
  }

  if (currentLocale === "pt") {
    url.pathname = url.pathname.replace(/^\/pt(?=\/|$)/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  if (currentLocale) {
    const canonicalPath = canonicalizeRoute(url.pathname.replace(/^\/(pt|en|es)(?=\/|$)/, "") || "/");
    const localizedCanonicalPath = getLocalizedPath(canonicalPath, currentLocale as RouteLocale);

    if (url.pathname !== localizedCanonicalPath) {
      url.pathname = localizedCanonicalPath;
      return NextResponse.redirect(url, 308);
    }

    return NextResponse.next();
  }

  const canonicalPath = canonicalizeRoute(url.pathname);
  if (canonicalPath !== url.pathname) {
    url.pathname = canonicalPath;
    return NextResponse.redirect(url, 308);
  }

  url.pathname = url.pathname === "/" ? "/pt" : `/pt${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|brand/).*)"]
};
