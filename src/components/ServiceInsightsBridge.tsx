import { ArrowUpRight, BookOpen } from "lucide-react";
import { getServiceInsightsBridgeConfig, resolveServiceInsightsBridgeItems } from "../content/serviceInsightsBridge";

interface ServiceInsightsBridgeProps {
  servicePath: string;
  onNavigate?: (page: string) => void;
}

export default function ServiceInsightsBridge({
  servicePath,
  onNavigate,
}: ServiceInsightsBridgeProps) {
  const bridge = getServiceInsightsBridgeConfig(servicePath);

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

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="tag08-section--compact px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950/95 text-left">
      <div className="tag08-card tag08-surface-card max-w-7xl mx-auto p-5 sm:p-7 lg:p-8 space-y-7">
        <div className="flex flex-col gap-2.5 sm:gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3 max-w-2xl">
            <div className="tag08-kicker">
              <BookOpen className="w-3.5 h-3.5" />
              Insights relacionados
            </div>
            <h2 className="tag08-section__heading font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white">
              {bridge.title}
            </h2>
            <p className="tag08-section__copy text-zinc-400 text-xs sm:text-sm">
              {bridge.intro}
            </p>
          </div>

          <button
            onClick={goToHub}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand text-black px-4 py-3 tag08-action transition-colors duration-200 hover:bg-brand-dark self-start"
          >
            {bridge.hubCtaLabel}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {items.map((item, index) => {
            const isPublished = item.status === "published";

            return (
              <article
                key={`${bridge.servicePath}-${index}`}
                className={`tag08-card tag08-card--interactive ${isPublished ? "tag08-card--featured" : ""} p-5 sm:p-6 flex flex-col justify-between gap-5`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`tag08-kicker ${isPublished ? "text-brand" : "text-zinc-400"}`}>
                      {isPublished ? "Publicado" : "Tema planejado"}
                    </span>
                    <span className="tag08-meta text-zinc-500">
                      {bridge.serviceTitle}
                    </span>
                  </div>

                  <h3 className="text-white font-semibold text-base sm:text-lg leading-snug">
                    {isPublished ? item.post.title : item.title}
                  </h3>

                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    {isPublished ? item.post.excerpt : item.excerpt}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <p className="tag08-meta text-zinc-500">
                    {isPublished
                      ? item.note ?? item.post.serviceNote
                      : item.note ?? "Tema em preparação"}
                  </p>

                  {isPublished ? (
                    <button
                      onClick={goToHub}
                      className="inline-flex items-center gap-2 text-brand tag08-action hover:text-brand-dark transition-colors"
                    >
                      Ver no Hub
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="tag08-meta text-zinc-500">
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
