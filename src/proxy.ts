import { NextResponse, type NextRequest } from "next/server";
import { canonicalizeRoute, getLocalizedPath, getRouteByPath, type RouteLocale } from "./config/routeRegistry";

const supportedLocales = new Set(["pt", "en", "es"]);
const internalLocaleRewriteHeader = "x-tag08-internal-locale-rewrite";

const requestsMarkdown = (accept: string | null): boolean => {
  if (!accept) return false;

  const markdownPreference = accept
    .split(",")
    .map((item) => item.trim())
    .find((item) => item.split(";")[0]?.trim().toLowerCase() === "text/markdown");

  if (!markdownPreference) return false;
  const qualityParameter = markdownPreference.split(";").slice(1).find((parameter) => /^\s*q\s*=/i.test(parameter));
  if (!qualityParameter) return true;

  const quality = Number(qualityParameter.split("=").slice(1).join("=").trim());
  return Number.isFinite(quality) && quality > 0 && quality <= 1;
};

const isMissingRoute = (path: string): boolean => {
  const canonicalPath = canonicalizeRoute(path);
  if (canonicalPath !== path) return false;

  const route = getRouteByPath(canonicalPath);
  return !route || route.key === "not-found";
};

const preventMissingRouteCaching = (response: NextResponse): NextResponse => {
  response.headers.set("Cache-Control", "no-store");
  return response;
};

const markdownNotFound = (path: string, accept: string | null): Response | undefined => {
  if (!isMissingRoute(path) || !requestsMarkdown(accept)) return undefined;

  return new Response(
    `## Página não encontrada\n\nO endereço solicitado não corresponde a uma página disponível. Consulte o [índice de conteúdo](/llms.txt).\n`,
    {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "no-store",
        "Vary": "Accept",
        "X-Robots-Tag": "noindex, follow"
      }
    }
  );
};

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
    const pathWithoutLocale = url.pathname.replace(/^\/(pt|en|es)(?=\/|$)/, "") || "/";
    const canonicalPath = canonicalizeRoute(pathWithoutLocale);
    const localizedCanonicalPath = getLocalizedPath(canonicalPath, currentLocale as RouteLocale);

    if (url.pathname !== localizedCanonicalPath) {
      url.pathname = localizedCanonicalPath;
      return NextResponse.redirect(url, 308);
    }

    const markdownResponse = markdownNotFound(pathWithoutLocale, request.headers.get("accept"));
    if (markdownResponse) return markdownResponse;

    const response = NextResponse.next();
    return isMissingRoute(pathWithoutLocale) ? preventMissingRouteCaching(response) : response;
  }

  const canonicalPath = canonicalizeRoute(url.pathname);
  if (canonicalPath !== url.pathname) {
    url.pathname = canonicalPath;
    return NextResponse.redirect(url, 308);
  }

  const markdownResponse = markdownNotFound(url.pathname, request.headers.get("accept"));
  if (markdownResponse) return markdownResponse;

  url.pathname = url.pathname === "/" ? "/pt" : `/pt${url.pathname}`;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(internalLocaleRewriteHeader, "1");
  const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  return isMissingRoute(canonicalPath) ? preventMissingRouteCaching(response) : response;
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|llms.txt|brand/).*)"]
};
