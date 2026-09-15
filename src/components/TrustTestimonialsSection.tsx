import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowUpRight, Star } from "lucide-react";
import { TRUST_REVIEWS } from "../content/googleReviews";
import { getApprovedEvidence } from "../content/publicEvidence";

export default function TrustTestimonialsSection() {
  const [activeReview, setActiveReview] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const visibleReviews = getApprovedEvidence(TRUST_REVIEWS, (review) => review.evidenceKey);

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);
    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  const isLargeScreen = viewportWidth >= 1024;
  const currentReview = visibleReviews[activeReview] ?? visibleReviews[0];

  if (!currentReview) {
    return null;
  }

  const currentSourceLabel =
    currentReview.source === "google-business-profile" ? "Google Meu Negocio" : "Depoimento interno";

  return (
    <section className="tag08-section px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-900/20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 border-b border-white/[0.05] pb-8">
          <div className="tag08-section__header text-left">
            <div className="tag08-kicker">
              <span className={`w-1.5 h-1.5 rounded-full bg-brand-secondary ${prefersReducedMotion ? "" : "animate-pulse"}`} />
              Confianca construida na pratica
            </div>

            <h2 className="tag08-section__heading font-display font-black text-3xl sm:text-4xl text-gradient">
              Experiencias acompanhadas com clareza
            </h2>

            <p className="tag08-section__copy text-zinc-400 text-xs sm:text-sm font-sans">
              Quando o trabalho tem diagnostico, clareza e acompanhamento, o cliente entende melhor o caminho, participa das decisoes e percebe mais coerencia entre estrategia e entrega.
            </p>
          </div>

          <div className="tag08-card p-5 flex items-center gap-4 shrink-0 text-left max-w-xl">
            <div className="w-12 h-12 bg-white/[0.03] rounded-xl flex items-center justify-center border border-white/[0.05]">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-brand-secondary text-brand-secondary" />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-display font-bold text-xl text-white tracking-tight leading-none">Depoimentos</span>
                <span className="tag08-meta text-brand-secondary">
                  {currentSourceLabel}
                </span>
              </div>
              <p className="tag08-meta text-zinc-400 mt-1">
                A confianca se sustenta no acompanhamento, na clareza e na coerencia da entrega.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
          <div className="lg:col-span-3 w-full overflow-hidden h-[170px] sm:h-[195px] lg:h-[500px] relative flex items-center lg:items-start select-none">
            <motion.div
              animate={
                prefersReducedMotion
                  ? { x: 0, y: 0 }
                  : isLargeScreen
                    ? { y: -activeReview * (148 + 16), x: 0 }
                    : { x: typeof window !== "undefined" && window.innerWidth >= 640 ? -activeReview * (98 + 16) : -activeReview * (85 + 16), y: 0 }
              }
              transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 22 }}
              className="flex flex-row lg:flex-col gap-4 absolute left-4 sm:left-6 lg:left-0 lg:top-0 h-[140px] sm:h-[160px] lg:h-auto items-center lg:items-center w-max lg:w-full py-2"
            >
              {visibleReviews.map((review, index) => {
                const isActive = index === activeReview;

                return (
                  <button
                    key={review.name}
                    type="button"
                    onClick={() => setActiveReview(index)}
                    aria-pressed={isActive}
                    aria-label={`Selecionar depoimento de ${review.name}`}
                    className={`shrink-0 cursor-pointer transition-all duration-500 overflow-hidden relative rounded-2xl sm:rounded-[22px] flex items-center justify-center ${
                      isActive
                        ? "w-[105px] h-[140px] sm:w-[120px] sm:h-[160px] lg:w-[135px] lg:h-[180px] border-2 border-brand-secondary shadow-[0_4px_30px_rgba(var(--color-brand-secondary-rgb),0.2)] scale-105 z-10 opacity-100 grayscale-0"
                        : "w-[85px] h-[115px] sm:w-[98px] sm:h-[132px] lg:w-[110px] lg:h-[148px] border border-white/[0.06] opacity-35 grayscale hover:opacity-75 hover:grayscale-0 scale-95 hover:scale-98"
                    }`}
                  >
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      width={135}
                      height={180}
                      className="w-full h-full object-cover transition-all duration-700 pointer-events-none"
                      referrerPolicy="no-referrer"
                    />

                    {isActive && (
                      <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-secondary shadow-[0_0_10px_var(--color-brand-secondary)]" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </div>

          <div className="lg:col-span-9 flex flex-col justify-center">
            <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={activeReview}
              initial={false}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.99 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }}
              className="tag08-card tag08-surface-card p-6 sm:p-8 lg:p-10 relative overflow-hidden text-left flex flex-col justify-between min-h-[340px] w-full group/card"
            >
                <div className="space-y-5 relative z-10 flex-1 flex flex-col justify-center">
                  <h3 className="font-display font-medium text-lg sm:text-2xl lg:text-[28px] text-white leading-normal tracking-tight max-w-[95%]">
                    {currentReview.tagline}
                  </h3>

                  <p className="tag08-section__copy text-zinc-400 text-xs sm:text-sm md:text-sm font-sans font-normal">
                    {currentReview.text}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-dashed border-white/[0.08] relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={currentReview.avatar}
                        alt={currentReview.name}
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-full object-cover border-2 border-brand-secondary"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-left font-sans">
                        <h4 className="text-white font-display font-semibold text-sm">
                          {currentReview.name}
                        </h4>
                        <p className="text-zinc-400 font-sans text-xs mt-0.5">
                          {currentReview.role} • {currentReview.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-brand-secondary text-brand-secondary" />
                        ))}
                      </div>
                      <span className="tag08-meta text-brand-secondary">
                        {currentSourceLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

          <div className="tag08-card mt-10 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left select-none">
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full bg-[#34A853] shrink-0 ${prefersReducedMotion ? "" : "animate-pulse"}`} />
            <p className="text-xs text-zinc-300 font-sans">
              Enquanto os reviews oficiais nao sao fornecidos, estes depoimentos seguem marcados como internos para nao fingir validacao externa.
            </p>
          </div>
          <a
            href="/contato"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-brand hover:text-black border border-white/10 hover:border-brand text-white tag08-action py-2.5 px-5 rounded-xl transition-colors duration-200 shrink-0 cursor-pointer"
          >
            <span>FALAR COM A TAG08</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
