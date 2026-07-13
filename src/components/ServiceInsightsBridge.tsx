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
    <section className="px-4 sm:px-6 md:px-8 py-10 sm:py-12 border-b border-white/[0.04] bg-charcoal-950/95 text-left">
      <div className="max-w-7xl mx-auto rounded-[28px] sm:rounded-[36px] border border-white/[0.05] bg-white/[0.02] p-4 sm:p-6 lg:p-7 space-y-5">
        <div className="flex flex-col gap-2.5 sm:gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-mono uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5" />
              Insights relacionados
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-tight tracking-tighter">
              {bridge.title}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
              {bridge.intro}
            </p>
          </div>

          <button
            onClick={goToHub}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand/30 bg-brand text-black px-4 py-3 font-mono text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:bg-brand-dark self-start"
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
                className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all duration-300 ${
                  isPublished
                    ? "border-brand/20 bg-brand/5"
                    : "border-white/[0.06] bg-white/[0.02]"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[9px] font-mono font-black uppercase tracking-widest ${
                        isPublished
                          ? "bg-brand text-black"
                          : "bg-white/[0.05] text-zinc-300 border border-white/[0.08]"
                      }`}
                    >
                      {isPublished ? "Publicado" : "Tema planejado"}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">
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
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                    {isPublished
                      ? item.note ?? item.post.serviceNote
                      : item.note ?? "Tema em preparação"}
                  </p>

                  {isPublished ? (
                    <button
                      onClick={goToHub}
                      className="inline-flex items-center gap-2 text-brand text-xs font-mono font-black uppercase tracking-widest hover:text-brand-dark transition-colors"
                    >
                      Ver no Hub
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="inline-flex items-center rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
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
