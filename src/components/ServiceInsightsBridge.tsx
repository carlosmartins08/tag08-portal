import { ArrowUpRight, BookOpen } from "lucide-react";
import { getServiceInsightsBridgeConfig, resolveServiceInsightsBridgeItems } from "../content/serviceInsightsBridge";

interface ServiceInsightsBridgeProps {
  servicePath: string;
  onNavigate?: (page: string) => void;
  variant?: "legacy" | "editorial-light";
  layout?: "default" | "two-at-tablet";
}

export default function ServiceInsightsBridge({
  servicePath,
  onNavigate,
  variant = "legacy",
  layout = "default",
}: ServiceInsightsBridgeProps) {
  const bridge = getServiceInsightsBridgeConfig(servicePath);
  const isEditorialLight = variant === "editorial-light";

  if (!bridge) {
    return null;
  }

  const items = resolveServiceInsightsBridgeItems(bridge);
  if (!items.length) {
    return null;
  }

  const goToHub = () => {
    if (onNavigate) {
      onNavigate(bridge.hubPath);
    } else {
      window.location.assign(bridge.hubPath);
    }

    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <section
      className={`tag08-contextual-section tag08-section--compact px-4 sm:px-6 md:px-8 border-b text-left ${
        isEditorialLight
          ? "context-default border-[color:var(--color-border-default)] bg-[color:var(--color-surface-canvas)] text-[color:var(--color-content-primary)]"
          : "border-white/[0.04] bg-charcoal-950/95"
      }`}
      data-variant={variant}
    >
      <div
        className={
          isEditorialLight
            ? "max-w-7xl mx-auto space-y-7 p-5 sm:p-7 lg:p-8"
            : "tag08-card tag08-surface-card max-w-7xl mx-auto space-y-7 p-5 sm:p-7 lg:p-8"
        }
      >
        <div className="flex flex-col gap-2.5 sm:gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3 max-w-2xl">
            <div className={`tag08-kicker ${isEditorialLight ? "text-[color:var(--color-action-readable)]" : ""}`}>
              <BookOpen className="w-3.5 h-3.5" />
              Insights relacionados
            </div>
            <h2
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

          <button
            onClick={goToHub}
            className={`inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl px-4 py-3 tag08-action transition-[background-color,border-color,color,transform] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              isEditorialLight
                ? "border border-[color:var(--color-surface-inverse)] bg-[color:var(--color-surface-inverse)] text-[color:var(--color-content-inverse)] hover:border-[color:var(--color-charcoal-700)] hover:bg-[color:var(--color-charcoal-700)] focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-[color:var(--color-surface-canvas)]"
                : "bg-brand text-black hover:bg-brand-dark focus-visible:ring-brand/60 focus-visible:ring-offset-charcoal-950"
            }`}
          >
            {bridge.hubCtaLabel}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className={`grid gap-3 ${layout === "two-at-tablet" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-3"}`}>
          {items.map((item, index) => {
            const isPublished = item.status === "published";

            return (
              <article
                key={`${bridge.servicePath}-${index}`}
                className={`tag08-card ${isPublished ? "tag08-card--interactive tag08-card--featured" : ""} flex flex-col justify-between gap-5 p-5 sm:p-6 ${
                  isEditorialLight
                    ? "!border-[color:var(--color-border-default)] !bg-[color:var(--color-surface-default)] !text-[color:var(--color-content-primary)] shadow-[var(--shadow-base)] transition-[border-color,box-shadow,transform] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:!border-[color:var(--color-action-readable)] motion-safe:hover:!shadow-[var(--shadow-emphasis)] motion-reduce:transform-none"
                    : ""
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`tag08-kicker ${
                        isPublished
                          ? isEditorialLight
                            ? "text-[color:var(--color-action-readable)]"
                            : "text-brand"
                          : "text-zinc-400"
                      }`}
                    >
                      {isPublished ? "Publicado" : "Tema planejado"}
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
                    {isPublished ? item.post.title : item.title}
                  </h3>

                  <p
                    className={`text-xs leading-relaxed sm:text-sm ${
                      isEditorialLight ? "text-[color:var(--color-content-secondary)]" : "text-zinc-400"
                    }`}
                  >
                    {isPublished ? item.post.excerpt : item.excerpt}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <p className={`tag08-meta ${isEditorialLight ? "text-[color:var(--color-content-secondary)]" : "text-zinc-300"}`}>
                    {isPublished
                      ? item.note ?? item.post.serviceNote
                      : item.note ?? "Tema em preparação"}
                  </p>

                  {isPublished ? (
                    <button
                      type="button"
                      onClick={goToHub}
                      className={`inline-flex min-h-11 items-center gap-2 tag08-action transition-[color,transform] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        isEditorialLight
                          ? "text-[color:var(--color-action-readable)] hover:text-[color:var(--color-charcoal-700)] focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-[color:var(--color-surface-default)]"
                          : "text-brand hover:text-brand-dark focus-visible:ring-brand/60 focus-visible:ring-offset-charcoal-950"
                      }`}
                    >
                      Ver no Hub
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className={`tag08-meta ${isEditorialLight ? "text-[color:var(--color-content-secondary)]" : "text-zinc-300"}`}>
                      Sem link ainda
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
