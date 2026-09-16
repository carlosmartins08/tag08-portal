import { NextResponse, type NextRequest } from "next/server";
import { canonicalizeRoute, getLocalizedPath, type RouteLocale } from "./config/routeRegistry";

const supportedLocales = new Set(["pt", "en", "es"]);
const internalLocaleRewriteHeader = "x-tag08-internal-locale-rewrite";

export function proxy(request: NextRequest) {
  const requestedLocale = request.nextUrl.searchParams.get("lang");
  const url = request.nextUrl.clone();

  // Public assets must bypass locale routing. Without this guard, paths such
  // as /team/carlos-henrique-martins.jpg are rewritten as application routes.
  if (/\.[^/]+$/.test(url.pathname)) {
    return NextResponse.next();
  }

  const [, requestedPrefix] = url.pathname.split("/");
  const currentLocale = supportedLocales.has(requestedPrefix) ? requestedPrefix : undefined;
  const isInternalLocaleRewrite = request.headers.get(internalLocaleRewriteHeader) === "1";

  if (requestedLocale && (requestedLocale === "en" || requestedLocale === "es")) {
    const pathname = url.pathname.replace(/^\/(pt|en|es)(?=\/|$)/, "") || "/";
    url.pathname = pathname === "/" ? `/${requestedLocale}` : `/${requestedLocale}${pathname}`;
    url.searchParams.delete("lang");
    return NextResponse.redirect(url, 308);
  }

  if (currentLocale === "pt") {
    if (isInternalLocaleRewrite) {
      return NextResponse.next();
    }

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
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(internalLocaleRewriteHeader, "1");
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|llms.txt|brand/).*)"]
};
