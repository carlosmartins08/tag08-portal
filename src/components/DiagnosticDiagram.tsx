import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Compass, ShieldCheck, Workflow } from "lucide-react";

interface DiagnosticPillar {
  id: "posicionamento" | "canais" | "processos";
  name: string;
  score: number;
  label: string;
  description: string;
}

const PILLARS: DiagnosticPillar[] = [
  {
    id: "posicionamento",
    name: "Posicionamento e percepção",
    score: 34,
    label: "Maturidade de marca",
    description:
      "Esforço invisível no digital. Postagens genéricas não atraem o público correspondente ao calibre do serviço."
  },
  {
    id: "canais",
    name: "Sincronia de canais",
    score: 48,
    label: "Eficiência de funil",
    description:
      "Anúncios rodam sem um funil estruturado de conversão. Cliques se perdem antes de se tornarem propostas viáveis."
  },
  {
    id: "processos",
    name: "Sistemas e playbooks",
    score: 21,
    label: "Maturidade operacional",
    description:
      "A ausência de fluxos consolidados deixa a equipe dependente do tempo e da validação do dono para avançar."
  }
];

const PILLAR_ICONS = {
  posicionamento: Compass,
  canais: Workflow,
  processos: ShieldCheck
};

export default function DiagnosticDiagram() {
  const [activePillarId, setActivePillarId] = useState<DiagnosticPillar["id"]>("posicionamento");
  const prefersReducedMotion = useReducedMotion();
  const activePillar = PILLARS.find((pillar) => pillar.id === activePillarId) ?? PILLARS[0];
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (activePillar.score / 100) * circumference;

  return (
    <div className="relative mt-12 overflow-hidden rounded-[32px] border border-white/[0.05] bg-charcoal-900/30 px-6 py-10 sm:px-10 sm:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.018)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-5 text-left lg:col-span-4">
          <span className="inline-flex items-center rounded-md border border-brand/20 bg-brand/10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-brand">
            Nível de maturidade
          </span>
          <div className="space-y-3">
            <h3 className="font-display text-3xl font-bold uppercase leading-tight tracking-tight text-white">
              O diagnóstico<br />da realidade
            </h3>
            <p className="max-w-sm font-sans text-xs leading-relaxed text-zinc-400 sm:text-[13px]">
              Uma análise de eficiência sobre os três pilares estratégicos da presença corporativa.
            </p>
          </div>
          <p className="border-t border-white/5 pt-4 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Selecione um pilar para ver o contexto.
          </p>
        </div>

        <div className="flex justify-center py-2 lg:col-span-4">
          <div className="relative flex h-60 w-60 items-center justify-center">
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
              <circle cx="100" cy="100" r={radius} stroke="rgba(255, 255, 255, 0.06)" strokeWidth="5" fill="none" />
              <motion.circle
                cx="100"
                cy="100"
                r={radius}
                stroke="var(--color-brand)"
                strokeWidth="6"
                fill="none"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset: dashOffset }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>

            <div className="relative z-10 flex h-[172px] w-[172px] flex-col items-center justify-center rounded-full border border-white/[0.05] bg-[#0a0a0c] px-5 text-center shadow-xl">
              <span className="font-mono text-[8px] font-black uppercase tracking-widest text-zinc-500">
                {activePillar.label}
              </span>
              <motion.div
                key={activePillar.score}
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
                className="mt-2 flex items-center justify-center gap-1 font-display text-5xl font-black leading-none tracking-tighter text-white"
              >
                {activePillar.score}<span className="text-xl leading-none text-brand">%</span>
              </motion.div>
              <p className="mt-2 font-mono text-[8px] font-bold uppercase tracking-wider text-zinc-500">Índice médio</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-left lg:col-span-4">
          {PILLARS.map((pillar) => {
            const Icon = PILLAR_ICONS[pillar.id];
            const isActive = pillar.id === activePillarId;

            return (
              <button
                key={pillar.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActivePillarId(pillar.id)}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  isActive
                    ? "border-brand/40 bg-brand/[0.05]"
                    : "border-white/[0.04] bg-transparent hover:border-white/15 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isActive ? "bg-brand/10 text-brand" : "bg-white/5 text-zinc-500"}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className={`font-sans text-xs font-bold uppercase tracking-wide ${isActive ? "text-brand" : "text-zinc-300"}`}>
                        {pillar.name}
                      </span>
                      <span className={`rounded px-1.5 py-0.5 font-sans text-[9px] font-bold ${isActive ? "bg-brand/15 text-brand" : "bg-white/5 text-zinc-500"}`}>
                        {pillar.score}%
                      </span>
                    </span>
                    <span className={`mt-1 block text-[11px] leading-relaxed ${isActive ? "text-zinc-400" : "line-clamp-1 text-zinc-600"}`}>
                      {pillar.description}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
