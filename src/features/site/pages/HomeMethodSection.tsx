import { Activity, Layers, Plus, Star, TrendingUp, Wifi, Zap } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import { HOME_PILOT_COPY } from "../../../i18n/homeCopy";

type MethodCenterCopy = typeof HOME_PILOT_COPY.en.methodCenter;

interface HomeMethodSectionProps {
  copy: MethodCenterCopy | undefined;
  heroEyebrow: string | undefined;
  onContact: () => void;
}

export default function HomeMethodSection({ copy, heroEyebrow, onContact }: HomeMethodSectionProps) {
  return (
      <section id="solucao" className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-zinc-950 relative overflow-hidden">
        {/* Ambient top-right neon highlight mimicking fitness studio */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-white/[0.015] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-white/[0.01] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">

          {/* Header Block of the Advantages Section */}
          <div className="max-w-3xl text-left space-y-4 mb-16">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
              {copy?.sectionReason ?? "Por que escolher a TAG08"}
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-gradient leading-tight">
              {copy?.sectionTitle ?? "Por que marcas em evolução escolhem a TAG08."}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
              {copy?.sectionDescription ?? "Porque a TAG08 não entra apenas para executar demandas soltas. Entramos para entender o contexto, organizar prioridades, proteger a coerência da marca e transformar estratégia em entrega possível."}
            </p>
          </div>

          {/* THE SEAMLESS BENTO GRID BLOCK */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

            {/* COLUMN 1 - LEFT SIDE (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-5 justify-between">

              {/* Card 1: Experience / Star Icon */}
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                className="bg-[#121214] border border-white/[0.05] hover:border-brand/20 p-6 rounded-[28px] text-left flex flex-col justify-between min-h-[140px] group transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.08] text-brand-secondary flex items-center justify-center">
                    <Star className="w-4 h-4 fill-current text-brand" />
                  </div>
                  <span className="tag08-meta text-xs text-brand-secondary tracking-wider uppercase font-bold opacity-60">{copy?.listen ?? "ESCUTA"}</span>
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="font-display font-black text-xs sm:text-sm text-white tracking-tight">{copy?.diagnosisTitle ?? "Diagnóstico antes da execução"}</h3>
                  <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed">
                    {copy?.diagnosisDescription ?? "Antes de produzir, entendemos o momento da marca, os objetivos, os gargalos e a estrutura disponível para sustentar o trabalho."}
                  </p>
                </div>
              </motion.div>

              {/* Card 2: Strategic custom setup / Plus Icon */}
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                className="bg-[#121214] border border-white/[0.05] hover:border-brand/20 p-6 rounded-[28px] text-left flex flex-col justify-between min-h-[140px] group transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.08] text-white flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white font-black" />
                  </div>
                  <span className="tag08-meta text-xs text-zinc-400 tracking-wider uppercase font-bold">{copy?.delivery ?? "ENTREGA"}</span>
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="font-display font-black text-xs sm:text-sm text-white tracking-tight">{copy?.strategyTitle ?? "Estratégia com entrega"}</h3>
                  <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed">
                    {copy?.strategyDescription ?? "A TAG08 não fica apenas no discurso estratégico. Organizamos direção, escopo, conteúdo, design, tecnologia e operação para tirar o plano do papel."}
                  </p>
                </div>
              </motion.div>

              {/* Card 3 & 4: Split Mini Cards */}
              <div className="grid grid-cols-2 gap-4">

                {/* Card 3: 4 Pilares */}
                <div className="bg-brand-secondary border border-black/10 p-5 rounded-[24px] text-left flex flex-col justify-between min-h-[135px] shadow-[0_10px_30px_rgba(var(--color-brand-secondary-rgb),0.1)] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute top-[-20px] right-[-20px] w-16 h-16 bg-white/20 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-sans text-xs font-black uppercase text-black/60 bg-black/5 px-2 py-0.5 rounded border border-black/5">{copy?.unified ?? "01 // UNIFICADO"}</span>
                    <span className="font-sans text-xs font-bold text-black/70">{copy?.method ?? "MÉTODO"}</span>
                  </div>
                  <div className="space-y-1 relative z-10 mt-3">
                    <span className="font-display font-black text-3xl text-black tracking-tighter block leading-none">{copy?.fourFronts ?? "QUATRO PILARES"}</span>
                    <p className="text-black font-display font-bold text-xs uppercase tracking-wider">{copy?.integratedStrategy ?? "ESTRATÉGIA INTEGRADA"}</p>
                    <p className="text-black/60 text-xs leading-snug font-medium">{copy?.fourFrontsDescription ?? "Conteúdo, design, tecnologia e operação trabalhando no mesmo sentido."}</p>
                  </div>
                </div>

                {/* Card 4: Atuação Premium */}
                <div className="bg-[#121214] border border-white/[0.05] hover:border-brand/20 p-5 rounded-[24px] text-left flex flex-col justify-between min-h-[135px] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/[0.01] rounded-full blur-xl group-hover:bg-white/[0.03] transition-all pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-sans text-xs font-black uppercase text-brand-secondary bg-brand-secondary/5 px-2 py-0.5 rounded border border-brand-secondary/10">{copy?.impact ?? "02 // IMPACTO"}</span>
                    <Zap className="w-3 h-3 text-brand-secondary" />
                  </div>
                  <div className="space-y-1 relative z-10 mt-3">
                    <span className="font-display font-black text-3xl text-white tracking-tighter block leading-none">{copy?.clarity ?? "CLAREZA"}</span>
                    <p className="text-white font-display font-bold text-xs uppercase tracking-wider">{copy?.betterChoices ?? "ESCOLHAS MELHORES"}</p>
                    <p className="text-zinc-400 text-xs leading-snug font-medium">{copy?.clarityDescription ?? "Cada entrega respeita contexto, escopo e capacidade real da operação."}</p>
                  </div>
                </div>

              </div>

            </div>

            {/* COLUMN 2 - MIDDLE HUGE VERTICAL CARD (lg:col-span-4) */}
            <div className="lg:col-span-4">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative rounded-[32px] overflow-hidden bg-cover bg-center border border-white/[0.08] shadow-2xl h-full min-h-[440px] flex flex-col justify-between p-8 text-left group"
                style={{
                  backgroundImage: "linear-gradient(to bottom, rgba(10,10,12,0.9), rgba(10,10,12,0.4), rgba(10,10,12,0.95)), url('https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80')"
                }}
              >
                {/* High contrast glass highlight in the grid */}
                <div className="absolute inset-0 bg-black/45 z-0 transition-opacity duration-500 group-hover:opacity-20 pointer-events-none" />

                {/* Header tag */}
                <div className="relative z-10 flex justify-between items-center w-full">
                  <span className="tag08-meta text-xs text-brand-secondary tracking-widest uppercase font-extrabold bg-brand-secondary/10 px-2.5 py-1 rounded-full">
                    {copy?.center ?? "Centro de método"}
                  </span>
                </div>

                {/* HERO DIGITAL ".T" CENTERING */}
                <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-6 select-none">
                  {/* Outer circle layout matching the fitness aesthetic */}
                  <div className="absolute inset-x-0 h-40 scale-95 border-t border-b border-brand/5 rounded-full animate-pulse pointer-events-none" />

                  {/* OFFICIAL TAG08 SYMBOL */}
                  <Image
                    src="/brand/SVG/symbol-primary.svg"
                    alt=""
                    aria-hidden="true"
                    width={160}
                    height={160}
                    className="h-32 w-32 object-contain drop-shadow-[0_15px_30px_rgba(var(--color-brand-secondary-rgb),0.35)] transition-transform duration-700 motion-safe:group-hover:scale-105 motion-reduce:transform-none sm:h-40 sm:w-40"
                  />

                  <span className="text-white tag08-meta text-xs tracking-widest font-black uppercase mt-4">
                    {heroEyebrow ?? "Estratégia, conteúdo, tecnologia e processos"}
                  </span>
                </div>

                {/* Bottom detailed description */}
                <div className="relative z-10 pt-4 border-t border-white/5 space-y-2">
                  <h3 className="text-white font-display font-bold text-xs tracking-wider">{copy?.center ?? "Centro de método"}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    {copy?.methodDescription ?? "Direção clara para transformar contexto, prioridade e entrega em um caminho aplicável."}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* COLUMN 3 - RIGHT SIDE (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-5 justify-between">

              {/* Card 6 & 7: Split Mini Cards */}
              <div className="grid grid-cols-2 gap-4">

                {/* Card 6: Wifi / Sincronização */}
                <div className="bg-[#121214] border border-white/[0.05] hover:border-brand/20 p-5 rounded-[24px] text-left flex flex-col justify-between min-h-[135px] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/[0.01] rounded-full blur-xl group-hover:bg-white/[0.03] transition-all pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-sans text-xs font-black uppercase text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">03 // {copy?.process ?? "PROCESSO"}</span>
                    <Wifi className="w-3.5 h-3.5 text-zinc-400 group-hover:text-brand-secondary transition-colors" />
                  </div>
                  <div className="space-y-1 relative z-10 mt-3">
                    <span className="font-display font-black text-2xl text-white tracking-tighter block leading-none">{copy?.editorialContinuity ?? "CONTINUIDADE"}</span>
                    <p className="text-white font-display font-bold text-xs uppercase tracking-wider">{copy?.followThrough ?? "PROCESSO E ACOMPANHAMENTO"}</p>
                    <p className="text-zinc-400 text-xs leading-snug font-medium">{copy?.followThroughDescription ?? "Briefing, aprovação e documentação reduzem improviso ao longo do trabalho."}</p>
                  </div>
                </div>

                {/* Card 7: Layers / Tech Stack */}
                <div className="bg-[#121214] border border-white/[0.05] hover:border-brand/20 p-5 rounded-[24px] text-left flex flex-col justify-between min-h-[135px] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/[0.01] rounded-full blur-xl group-hover:bg-brand-secondary/[0.02] transition-all pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-sans text-xs font-black uppercase text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">{copy?.technology ?? "04 // TECNOLOGIA"}</span>
                    <Layers className="w-3.5 h-3.5 text-zinc-400 group-hover:text-brand transition-colors" />
                  </div>
                  <div className="space-y-1 relative z-10 mt-3">
                    <span className="font-display font-black text-2xl text-white tracking-tighter block leading-none">{copy?.clearFunction ?? "FUNÇÃO CLARA"}</span>
                    <p className="text-white font-display font-bold text-xs uppercase tracking-wider">{copy?.appliedTechnology ?? "TECNOLOGIA APLICADA"}</p>
                    <p className="text-zinc-400 text-xs leading-snug font-medium">{copy?.technologyDescription ?? "Ferramentas e desenvolvimento entram quando ajudam a cumprir uma função real."}</p>
                  </div>
                </div>

              </div>

              {/* Card 8: Fitness band tracker equivalent (Métricas e Inteligência comercial) */}
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                className="bg-[#121214] border border-white/[0.05] hover:border-brand/20 p-6 rounded-[28px] text-left flex flex-col justify-between min-h-[140px] group transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.08] text-zinc-300 flex items-center justify-center group-hover:text-brand-secondary group-hover:border-brand-secondary/30 transition-all">
                    <Activity className="w-4 h-4 animate-pulse text-brand" />
                  </div>
                    <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-extrabold">{copy?.review ?? "ANÁLISE E AJUSTE"}</span>
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="font-display font-black text-xs sm:text-sm text-white tracking-tight">{copy?.continuousImprovement ?? "Análise e melhoria contínua"}</h3>
                  <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed">
                    {copy?.improvementDescription ?? "Dados e aprendizados orientam ajustes, sem transformar uma métrica isolada em promessa de resultado."}
                  </p>
                </div>
              </motion.div>

              {/* Card 9 & 10: Performance Displays */}
              <div className="grid grid-cols-2 gap-4">

                {/* Card 9: R$ 50M+ */}
                <div className="bg-[#121214] border border-white/[0.05] hover:border-brand/20 p-5 rounded-[24px] text-left flex flex-col justify-between min-h-[140px] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.015] rounded-full blur-md group-hover:bg-white/[0.03] transition-all pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-sans text-xs font-black uppercase text-brand-secondary bg-brand-secondary/5 px-1.5 py-0.5 rounded">{copy?.proof ?? "PROVA"}</span>
                    <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <div className="mt-3 relative z-10 text-left">
                    <span className="font-display font-black text-2xl sm:text-3xl text-white tracking-tighter leading-none block">{copy?.clarity ?? "CLAREZA"}</span>
                    <p className="text-white font-display font-bold text-xs uppercase tracking-wider mt-0.5">{copy?.noPromise ?? "NO DIAGNÓSTICO"}</p>
                    <p className="text-zinc-400 text-xs leading-snug">{copy?.proofDescription ?? "A confiança não vem de promessa pronta. Vem de clareza no diagnóstico, coerência na estratégia e responsabilidade na execução."}</p>
                  </div>
                </div>

                {/* Card 10: Retenção */}
                <div className="bg-[#121214] border border-white/[0.05] hover:border-brand/20 p-5 rounded-[24px] text-left flex flex-col justify-between min-h-[140px] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute bottom-[-20px] right-[-20px] w-20 h-20 bg-brand/[0.015] rounded-full blur-xl group-hover:bg-white/[0.03] transition-all pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-sans text-xs font-black uppercase text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded">{copy?.editorialContinuity ?? "CONTINUIDADE"}</span>
                    <div className="flex -space-x-1.5">
                      <Image width={16} height={16} className="w-4 h-4 rounded-full ring-1 ring-black object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=50" alt="" />
                      <Image width={16} height={16} className="w-4 h-4 rounded-full ring-1 ring-black object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=50" alt="" />
                      <Image width={16} height={16} className="w-4 h-4 rounded-full ring-1 ring-black object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=50" alt="" />
                    </div>
                  </div>
                  <div className="mt-3 relative z-10 text-left">
                    <span className="font-display font-black text-2xl sm:text-3xl text-brand-secondary tracking-tighter leading-none block">{copy?.methodValue ?? "MÉTODO"}</span>
                    <p className="text-white font-display font-bold text-xs uppercase tracking-wider mt-0.5">{copy?.coherence ?? "COERÊNCIA"}</p>
                    <p className="text-zinc-400 text-xs leading-snug">{copy?.trustDescription ?? "Confiança se constrói com clareza, método e entrega coerente."}</p>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Inline Link for further contact */}
          <div className="mt-16 text-center border-t border-white/[0.04] pt-8">
            <button
              onClick={onContact}
              className="text-white/60 hover:text-brand-secondary font-sans text-xs sm:text-xs font-black uppercase tracking-widest inline-flex items-center gap-2 group transition-colors cursor-pointer"
            >
              {copy?.contact ?? "FALAR COM A TAG08"} &rarr;
            </button>
          </div>

        </div>
      </section>
  );
}
