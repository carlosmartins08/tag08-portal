import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Star } from "lucide-react";
import { TRUST_REVIEWS } from "../content/googleReviews";

export default function TrustTestimonialsSection() {
  const [activeReview, setActiveReview] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);
    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  useEffect(() => {
    if (isHovering) return;

    const interval = window.setInterval(() => {
      setActiveReview((prev) => (prev + 1) % TRUST_REVIEWS.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [isHovering]);

  const isLargeScreen = viewportWidth >= 1024;
  const currentReview = TRUST_REVIEWS[activeReview];
  const currentSourceLabel =
    currentReview.source === "google-business-profile" ? "Google Meu Negocio" : "Depoimento interno";

  return (
    <section className="py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-900/20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 border-b border-white/[0.05] pb-6">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/10 bg-brand/5 font-mono text-[9px] uppercase tracking-widest text-brand-secondary font-black">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
              Confianca construida na pratica
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl text-gradient uppercase leading-none tracking-tighter">
              Experiencias acompanhadas com clareza
            </h2>

            <p className="text-zinc-400 text-xs sm:text-sm font-sans max-w-2xl">
              Quando o trabalho tem diagnostico, clareza e acompanhamento, o cliente entende melhor o caminho, participa das decisoes e percebe mais coerencia entre estrategia e entrega.
            </p>
          </div>

          <div className="bg-charcoal-900 border border-white/[0.08] rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg text-left">
            <div className="w-12 h-12 bg-white/[0.03] rounded-xl flex items-center justify-center border border-white/[0.05]">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-brand-secondary text-brand-secondary" />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-display font-black text-2xl text-white tracking-tight leading-none">DEPOIMENTOS</span>
                <span className="font-mono text-[8px] uppercase tracking-widest text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/15 px-2 py-0.5 rounded font-black">
                  {currentSourceLabel}
                </span>
              </div>
              <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">
                A confianca se sustenta no acompanhamento, na clareza e na coerencia da entrega.
              </p>
            </div>
          </div>
        </div>

        <div
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4"
        >
          <div className="lg:col-span-3 w-full overflow-hidden h-[170px] sm:h-[195px] lg:h-[500px] relative flex items-center lg:items-start select-none">
            <motion.div
              animate={
                isLargeScreen
                  ? { y: -activeReview * (148 + 16), x: 0 }
                  : { x: typeof window !== "undefined" && window.innerWidth >= 640 ? -activeReview * (98 + 16) : -activeReview * (85 + 16), y: 0 }
              }
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
              className="flex flex-row lg:flex-col gap-4 absolute left-4 sm:left-6 lg:left-0 lg:top-0 h-[140px] sm:h-[160px] lg:h-auto items-center lg:items-center w-max lg:w-full py-2"
            >
              {TRUST_REVIEWS.map((review, index) => {
                const isActive = index === activeReview;

                return (
                  <button
                    key={review.name}
                    type="button"
                    onClick={() => setActiveReview(index)}
                    className={`shrink-0 cursor-pointer transition-all duration-500 overflow-hidden relative rounded-2xl sm:rounded-[22px] flex items-center justify-center ${
                      isActive
                        ? "w-[105px] h-[140px] sm:w-[120px] sm:h-[160px] lg:w-[135px] lg:h-[180px] border-2 border-brand-secondary shadow-[0_4px_30px_rgba(var(--color-brand-secondary-rgb),0.2)] scale-105 z-10 opacity-100 grayscale-0"
                        : "w-[85px] h-[115px] sm:w-[98px] sm:h-[132px] lg:w-[110px] lg:h-[148px] border border-white/[0.06] opacity-35 grayscale hover:opacity-75 hover:grayscale-0 scale-95 hover:scale-98"
                    }`}
                  >
                    <img
                      src={review.avatar}
                      alt={review.name}
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
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReview}
                initial={{ opacity: 0, x: 20, scale: 0.99 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.99 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-charcoal-900/90 border border-white/[0.06] p-5 sm:p-8 lg:p-10 rounded-[28px] sm:rounded-[36px] relative overflow-hidden text-left shadow-2xl flex flex-col justify-between min-h-[340px] w-full group/card"
              >
                <span className="font-serif text-[180px] sm:text-[230px] text-brand-secondary/[0.03] absolute right-6 sm:right-10 -top-8 sm:-top-12 leading-none select-none pointer-events-none font-black italic">
                  "
                </span>

                <div className="space-y-5 relative z-10 flex-1 flex flex-col justify-center">
                  <h3 className="font-display font-medium text-lg sm:text-2xl lg:text-[28px] text-white leading-normal tracking-tight max-w-[95%]">
                    {currentReview.tagline}
                  </h3>

                  <p className="text-zinc-400 text-xs sm:text-sm md:text-[15px] leading-relaxed font-sans font-normal">
                    {currentReview.text}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-dashed border-white/[0.08] relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentReview.avatar}
                        alt={currentReview.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-brand-secondary"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-left font-sans">
                        <h4 className="text-white font-display font-semibold text-sm">
                          {currentReview.name}
                        </h4>
                        <p className="text-zinc-500 font-sans text-xs mt-0.5">
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
                      <span className="font-sans text-[7.5px] uppercase tracking-widest text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2 py-0.5 rounded">
                        {currentSourceLabel.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-10 p-4 sm:p-5 bg-charcoal-900 border border-white/[0.05] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left select-none">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse shrink-0" />
            <p className="text-xs text-zinc-300 font-sans">
              Enquanto os reviews oficiais nao sao fornecidos, estes depoimentos seguem marcados como internos para nao fingir validacao externa.
            </p>
          </div>
          <a
            href="/contato"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-brand hover:text-black border border-white/10 hover:border-brand text-[10px] text-white font-mono font-bold uppercase tracking-widest py-2.5 px-5 rounded-xl transition-all duration-300 shrink-0 cursor-pointer"
          >
            <span>FALAR COM A TAG08</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
