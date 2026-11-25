import { useState, useEffect } from "react";
import { ArrowLeft, ArrowUpRight, CheckCircle2, ChevronRight, Copy, Check, Zap, Target, TrendingUp } from "../../../components/DooIcons";
import { motion } from "motion/react";
import Image from "next/image";
import { CASE_STUDIES } from "../../../data";
import { getPublicEvidence, getVisibleEvidence } from "../../../content/publicEvidence";
import type { RouteLocale } from "../../../config/routeRegistry";

const CASE_STUDY_DETAIL_EMPTY_STATE_COPY = {
  pt: {
    title: "Caso de Sucesso não encontrado",
    description: "O caso estratégico solicitado não pôde ser localizado em nossa base operacional.",
    backHome: "Voltar ao Início"
  },
  en: {
    title: "Case study not found",
    description: "The requested case study could not be found.",
    backHome: "Back to Home"
  },
  es: {
    title: "Caso de éxito no encontrado",
    description: "No se pudo encontrar el caso solicitado.",
    backHome: "Volver al inicio"
  }
} satisfies Record<RouteLocale, { title: string; description: string; backHome: string }>;

interface CaseStudyDetailProps {
  caseId: string;
  onNavigate: (page: string) => void;
  locale?: RouteLocale;
}

export default function CaseStudyDetail({ caseId, onNavigate, locale = "pt" }: CaseStudyDetailProps) {
  const [copied, setCopied] = useState(false);
  const emptyStateCopy = CASE_STUDY_DETAIL_EMPTY_STATE_COPY[locale];
  const selectedCase = getVisibleEvidence(CASE_STUDIES, (caseStudy) => `case-study/${caseStudy.id}`, `/casos/${caseId}`)
    .find((caseStudy) => caseStudy.id === caseId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [caseId]);

  if (!selectedCase) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-charcoal-950 text-white font-sans">
        <h2 className="font-display font-black text-3xl text-zinc-400 mb-4">{emptyStateCopy.title}</h2>
        <p className="text-zinc-500 text-sm max-w-md mb-8">
          {emptyStateCopy.description}
        </p>
        <button
          onClick={() => onNavigate("/")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-secondary text-black font-black tag08-meta text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{emptyStateCopy.backHome}</span>
        </button>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const evidenceKey = `case-study/${selectedCase.id}`;
  const evidence = getPublicEvidence(evidenceKey);
  const caseDeliverables = selectedCase.deliverables ?? [];
  const hasApprovedMetric = evidence?.status === "approved" && Boolean(selectedCase.metric && selectedCase.metricLabel);

  return (
    <div data-evidence-key={`case-study/${selectedCase.id}`} className="w-full bg-[#070709] text-white font-sans min-h-screen pb-24 relative overflow-hidden">
      {/* Decorative architectural grids and background light overlays */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-brand/[0.03] via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-brand/[0.012] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-brand/[0.012] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-32 sm:pt-40 space-y-12 relative z-10">
        
        {/* Breadcrumb Navigation \& Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.04] pb-6">
          <div className="flex items-center gap-2 text-xs tag08-meta text-zinc-500 uppercase tracking-widest">
            <button 
              onClick={() => onNavigate("/")} 
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              Início
            </button>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <button 
              onClick={() => onNavigate("/")} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Cases de Sucesso
            </button>
            <ChevronRight className="w-3 h-3 text-zinc-650" />
            <span className="text-brand-secondary font-semibold">{selectedCase.client}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.02] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 rounded-xl text-xs font-sans tracking-wider transition-all duration-300 text-zinc-400 hover:text-white cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-brand-secondary" />
                  <span>Link Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Link</span>
                </>
              )}
            </button>
            <button
              onClick={() => onNavigate("/")}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-secondary/5 hover:bg-brand-secondary/10 border border-brand-secondary/10 hover:border-brand-secondary/20 text-brand-secondary rounded-xl text-xs font-sans tracking-wider transition-all duration-300 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Início</span>
            </button>
          </div>
        </div>

        {/* Dynamic Multi-column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* LEFT AREA: Key Editorial Content */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Title Block & Meta information */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-brand/10 border border-brand/20 text-brand tag08-meta text-xs uppercase tracking-widest px-2.5 py-1 rounded font-black">
                  {selectedCase.category}
                </span>
                <span className="text-zinc-500 tag08-meta text-xs tracking-wide uppercase">
                  Case de cliente
                </span>

              </div>

              <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight leading-[1.1] text-left">
                {selectedCase.title}
              </h1>

              <p className="text-zinc-400 text-sm leading-relaxed font-sans text-left max-w-2xl">
                {selectedCase.summary ?? selectedCase.challenge}
              </p>
            </div>

            {selectedCase.image ? (
              <div className="relative h-[280px] sm:h-[420px] rounded-[32px] overflow-hidden group shadow-2xl border border-white/[0.04]">
                <Image fill sizes="(max-width: 1024px) 100vw, 66vw" src={selectedCase.image} alt={selectedCase.title} className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
            ) : null}

            {/* Editorial Content Breakdown: Challenge \& Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="bg-[#121214] border border-white/[0.03] p-6 sm:p-8 rounded-[24px] space-y-4 text-left relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/[0.015] blur-3xl pointer-events-none" />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <h3 className="font-sans text-xs tracking-wider text-red-450 font-black">
                    O CÊNARIO ANTERIOR (O DESAFIO)
                  </h3>
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-sans font-normal">
                  {selectedCase.challenge}
                </p>
                <div className="pt-2 border-t border-white/[0.03] flex items-center gap-2 text-xs font-sans text-zinc-500 uppercase">
                  <Target className="w-3.5 h-3.5 text-red-550" />
                  <span>Diagnóstico de pontos fracos</span>
                </div>
              </div>

              <div className="bg-[#121214] border border-brand/10 p-6 sm:p-8 rounded-[24px] space-y-4 text-left relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/[0.015] blur-3xl pointer-events-none" />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-secondary" />
                  <h3 className="font-sans text-xs tracking-wider text-brand-secondary font-black">
                    A ESTRATÉGIA ADOTADA (SOLUÇÃO)
                  </h3>
                </div>
                <p className="text-zinc-350 text-xs sm:text-sm leading-relaxed font-sans font-normal">
                  {selectedCase.solution}
                </p>
                <div className="pt-2 border-t border-white/[0.03] flex items-center gap-2 text-xs font-sans text-zinc-500 uppercase">
                  <Zap className="w-3.5 h-3.5 text-brand" />
                  <span>Métodos ativos aplicados</span>
                </div>
              </div>
            </div>

            {/* In-depth details section mock blog post metrics progression */}
            <div className="space-y-6 pt-6 text-left">
              <h3 className="font-display font-medium text-xl text-white tracking-tight">
                Entregas do projeto
              </h3>
              
              {caseDeliverables.length > 0 ? <ul className="grid gap-4">
                {caseDeliverables.map((res, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 bg-white/[0.01] border border-white/[0.04] p-5 rounded-2xl hover:border-brand/20 hover:bg-white/[0.02] transition-all duration-300"
                  >
                    <div className="w-7 h-7 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4.5 h-4.5 stroke-[2]" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs tag08-meta text-zinc-500 uppercase tracking-wider">Entrega {index + 1}</span>
                      <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{res}</p>
                    </div>
                  </motion.li>
                ))}
              </ul> : null}
            </div>

          </div>

          {/* RIGHT AREA: Sticky Summary Metrics & CTA */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            
            {/* Summary Metrics card */}
            <div className="bg-charcoal-900 border border-white/[0.06] rounded-[28px] p-6 text-left relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/[0.015] blur-3xl pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-20" />

              <div className="space-y-6">
                <div>
                <span className="tag08-meta text-xs text-brand-secondary font-black uppercase tracking-widest block bg-brand-secondary/5 border border-brand-secondary/15 px-2 py-0.5 rounded w-max mb-1">
                    Projeto
                  </span>
                  <p className="font-display font-black text-white text-xl uppercase tracking-tight">
                    {selectedCase.client}
                  </p>
                </div>

                {hasApprovedMetric && <div className="border-t border-white/[0.04] pt-5 bg-gradient-to-br from-white/[0.01] to-transparent p-4 rounded-xl border border-white/5">
                  <span className="text-zinc-400 tag08-meta text-xs uppercase tracking-wider block">Resultado Medido</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display font-black text-4xl text-brand-secondary tracking-tight">
                      {selectedCase.metric}
                    </span>
                    <TrendingUp className="w-5 h-5 text-brand-secondary" />
                  </div>
                  <p className="text-zinc-300 text-xs mt-1.5 leading-snug font-medium font-sans">
                    {selectedCase.metricLabel}
                  </p>
                </div>}

                {selectedCase.relatedServicePath && selectedCase.relatedServiceTitle && <div className="border-t border-white/[0.04] pt-4 space-y-2 text-xs text-zinc-400 font-sans leading-relaxed">
                  <span className="text-zinc-500 tag08-meta uppercase tracking-wider">Serviço relacionado</span>
                  <button onClick={() => onNavigate(selectedCase.relatedServicePath!)} className="flex items-center gap-2 text-white hover:text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-secondary">
                    <span>{selectedCase.relatedServiceTitle}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>}
              </div>
            </div>

            {/* Direct Consulting call block */}
            <div className="bg-brand-secondary text-black rounded-[28px] p-6 lg:p-7 text-left space-y-5 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.15] blur-3xl pointer-events-none" />
              
              <div className="space-y-2.5">
                <span className="text-xs tag08-meta font-black uppercase tracking-widest bg-black/5 px-2 py-0.5 rounded w-max block">
                  Próximo passo
                </span>
                <h3 className="font-display font-black text-xl lg:text-2xl tracking-tight leading-none text-left">
                  Entenda o caminho adequado ao seu projeto
                </h3>
                <p className="text-zinc-800 text-xs font-sans leading-relaxed text-left">
                  Cada projeto depende do contexto, das prioridades e das entregas necessárias. Converse com a TAG08 para avaliar o seu cenário.
                </p>
              </div>

              <button
                onClick={() => {
                  onNavigate("/contato");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full inline-flex items-center justify-between gap-2 px-5 py-3.5 bg-black hover:bg-neutral-900 text-white font-black font-sans text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md group-hover:scale-[1.02] cursor-pointer"
              >
                <span>Conversar com a TAG08</span>
                <ArrowUpRight className="w-4 h-4 text-brand-secondary stroke-[2.5]" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
