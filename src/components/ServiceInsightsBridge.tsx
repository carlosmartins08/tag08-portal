"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen } from "lucide-react";
import {
  isCanonicalBlogArticleUrl,
  type EditorialCardV1,
  type EditorialSectionId,
} from "../content/editorialContentV1";
import { getServiceInsightsBridgeConfig } from "../content/serviceInsightsBridge";

interface ServiceInsightsBridgeProps {
  servicePath: string;
  /** Kept for compatibility with existing page composition; article links are canonical blog URLs. */
  onNavigate?: (page: string) => void;
  variant?: "legacy" | "editorial-light";
  layout?: "default" | "two-at-tablet";
}

function isEditorialProjection(value: unknown, sectionId: EditorialSectionId): value is {
  ok: true;
  sectionId: EditorialSectionId;
  items: EditorialCardV1[];
} {
  if (typeof value !== "object" || value === null || !("ok" in value) || value.ok !== true ||
    !("sectionId" in value) || value.sectionId !== sectionId || !("items" in value) ||
    !Array.isArray(value.items)) return false;

  return value.items.every((item) =>
    typeof item === "object" && item !== null &&
    typeof item.id === "string" && item.id.trim().length > 0 &&
    typeof item.slug === "string" && item.slug.trim().length > 0 &&
    typeof item.title === "string" && item.title.trim().length > 0 &&
    typeof item.summary === "string" &&
    isCanonicalBlogArticleUrl(item.canonicalUrl, item.slug),
  );
}

export default function ServiceInsightsBridge({
  servicePath,
  variant = "legacy",
  layout = "default",
}: ServiceInsightsBridgeProps) {
  const bridge = getServiceInsightsBridgeConfig(servicePath);
  const [projection, setProjection] = useState<{
    sectionId: EditorialSectionId | null;
    items: EditorialCardV1[];
  }>({ sectionId: null, items: [] });
  const isEditorialLight = variant === "editorial-light";

  useEffect(() => {
    if (!bridge) {
      setProjection({ sectionId: null, items: [] });
      return;
    }

    const controller = new AbortController();
    setProjection({ sectionId: bridge.sectionId, items: [] });

    void fetch(`/api/editorial-content/v1?sectionId=${encodeURIComponent(bridge.sectionId)}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    }).then(async (response) => {
      if (!response.ok) return [];
      const payload: unknown = await response.json();
      return isEditorialProjection(payload, bridge.sectionId) ? payload.items : [];
    }).then((nextItems) => {
      if (!controller.signal.aborted) setProjection({ sectionId: bridge.sectionId, items: nextItems });
    }).catch(() => {
      if (!controller.signal.aborted) setProjection({ sectionId: bridge.sectionId, items: [] });
    });

    return () => controller.abort();
  }, [bridge]);

  const items = bridge && projection.sectionId === bridge.sectionId ? projection.items : [];
  if (!bridge || !items.length) return null;

  return (
    <section
      className={`tag08-contextual-section tag08-section--compact px-4 sm:px-6 md:px-8 border-b text-left ${
        isEditorialLight
          ? "context-default border-[color:var(--color-border-default)] bg-[color:var(--color-surface-canvas)] text-[color:var(--color-content-primary)]"
          : "border-white/[0.04] bg-charcoal-950/95"
      }`}
      data-variant={variant}
      aria-labelledby={`editorial-${bridge.sectionId}-heading`}
    >
      <div
        className={
          isEditorialLight
            ? "max-w-7xl mx-auto space-y-7 p-5 sm:p-7 lg:p-8"
            : "tag08-card tag08-surface-card max-w-7xl mx-auto space-y-7 p-5 sm:p-7 lg:p-8"
        }
      >
        <div className="space-y-3 max-w-2xl">
          <div className={`tag08-kicker ${isEditorialLight ? "text-[color:var(--color-action-readable)]" : ""}`}>
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            Conteúdos do blog
          </div>
          <h2
            id={`editorial-${bridge.sectionId}-heading`}
            className={`tag08-section__heading font-display font-black text-2xl sm:text-3xl lg:text-4xl ${
              isEditorialLight ? "text-[color:var(--color-content-primary)]" : "text-white"
            }`}
          >
            {bridge.title}
          </h2>
          <p
            className={`tag08-section__copy text-xs sm:text-sm ${
              isEditorialLight ? "text-[color:var(--color-content-secondary)]" : "text-zinc-400"
            }`}
          >
            {bridge.intro}
          </p>
        </div>

        <div className={`grid gap-3 ${layout === "two-at-tablet" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-3"}`}>
          {items.map((item) => (
            <article
              key={item.id}
              className={`tag08-card flex flex-col justify-between gap-5 p-5 sm:p-6 ${
                isEditorialLight
                  ? "!border-[color:var(--color-border-default)] !bg-[color:var(--color-surface-default)] !text-[color:var(--color-content-primary)] shadow-[var(--shadow-base)] transition-[border-color,box-shadow,transform] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:!border-[color:var(--color-action-readable)] motion-safe:hover:!shadow-[var(--shadow-emphasis)] motion-reduce:transform-none"
                  : ""
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <span className={`tag08-kicker ${isEditorialLight ? "text-[color:var(--color-action-readable)]" : "text-brand"}`}>
                    Publicado no blog
                  </span>
                  <span className={`tag08-meta ${isEditorialLight ? "text-[color:var(--color-content-secondary)]" : "text-zinc-300"}`}>
                    {bridge.serviceTitle}
                  </span>
                </div>
                <h3
                  className={`font-semibold text-base leading-snug sm:text-lg ${
                    isEditorialLight ? "text-[color:var(--color-content-primary)]" : "text-white"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-xs leading-relaxed sm:text-sm ${
                    isEditorialLight ? "text-[color:var(--color-content-secondary)]" : "text-zinc-400"
                  }`}
                >
                  {item.summary}
                </p>
              </div>

              <a
                href={item.canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-11 items-center gap-2 tag08-action transition-[color,transform] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  isEditorialLight
                    ? "text-[color:var(--color-action-readable)] hover:text-[color:var(--color-charcoal-700)] focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-[color:var(--color-surface-default)]"
                    : "text-brand hover:text-brand-dark focus-visible:ring-brand/60 focus-visible:ring-offset-charcoal-950"
                }`}
              >
                Ler no blog
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
