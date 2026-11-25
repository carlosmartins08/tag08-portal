/**
 * Expose only Portuguese and route translations explicitly marked published.
 */
export function isLocaleOptionAvailable(locale, { hasRoute, isPublished }) {
  if (locale === "pt") return true;
  return hasRoute === true && isPublished === true;
}

export function resolveLocaleNavigationPath(locale, requestedPath, homePath, isRequestedRoutePublished) {
  if (locale === "pt" || isRequestedRoutePublished || !requestedPath.startsWith("/")) {
    return requestedPath;
  }

  return homePath;
}
