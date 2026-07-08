import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, ShieldCheck, Workflow, Sparkles } from "lucide-react";

interface DiagnosticPillar {
  id: string;
  name: string;
  score: number;
  label: string;
  color: string;
  leakageLabel: string;
  description: string;
}

export default function DiagnosticDiagram() {
  const [activePillar, setActivePillar] = useState<string>("posicionamento");
  const [radialAngle, setRadialAngle] = useState(0);

  // Rotating elements animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setRadialAngle((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const pillars: DiagnosticPillar[] = [
    {
      id: "posicionamento",
      name: "Posicionamento & Percepção",
      score: 34,
      label: "Maturidade de Marca",
      color: "var(--color-brand)", // Brand accent
      leakageLabel: "Vazamento de Autoridade",
      description: "Esforço invisível no digital. Criação de postagens genéricas que não atraem o público correspondente ao seu calibre de serviço."
    },
    {
      id: "canais",
      name: "Sincronia de Canais",
      score: 48,
      label: "Eficiência de Funil",
      color: "var(--color-brand)", // Greenish yellow
      leakageLabel: "Dispersão de Tráfego",
      description: "Anúncios rodando sem funil estruturado de conversão ativa. Cliques perdidos que nunca se tornam propostas viáveis."
    },
    {
      id: "processos",
      name: "Sistemas & Playbooks",
      score: 21,
      label: "Maturidade Operacional",
      color: "var(--color-brand)",
      leakageLabel: "Dependência de Fundadores",
      description: "Ausência de fluxos operacionais consolidados. Equipe dependente do tempo e de validações do dono para tudo."
    }
  ];

  const currentPillar = pillars.find((p) => p.id === activePillar) || pillars[0];

  // Map the percentage score to the SVG dash stroke offset
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (currentPillar.score / 100) * circumference;

  return (
    <div className="w-full mt-12 py-12 px-6 sm:px-12 bg-charcoal-900/5 border border-white/[0.02] rounded-[32px] relative overflow-hidden select-none">
      {/* Absolute ambient lights */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand/[0.012] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/[0.008] rounded-full blur-[160px] pointer-events-none" />

      {/* Decorative guidelines representing minimalist slides */}
      <div className="absolute left-6 top-10 h-16 w-px bg-white/5 flex flex-col justify-between pointer-events-none">
        <span className="w-1 h-1 rounded-full bg-brand/30 -ml-[1.5px]" />
        <span className="w-1 h-1 rounded-full bg-brand/30 -ml-[1.5px] mt-auto" />
      </div>
      <div className="absolute right-6 bottom-10 h-16 w-px bg-white/5 flex flex-col justify-between pointer-events-none">
        <span className="w-1 h-1 rounded-full bg-brand/30 -ml-[1.5px]" />
        <span className="w-1 h-1 rounded-full bg-brand/30 -ml-[1.5px] mt-auto" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Simplified Grid mirroring clean slide image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* COLUMN 1: Simple Headline Context (Left) */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-brand/10 border border-brand/20 text-brand font-bold text-[9px] rounded-md tracking-wider font-mono">
              <Sparkles className="w-2.5 h-2.5" />
              NÍVEL DE MATURIDADE
            </div>
            
            <div className="space-y-3">
              <h3 className="font-display font-bold text-3xl text-white tracking-tight leading-tight uppercase">
                O DIAGNÓSTICO <br/>
                DA REALIDADE
              </h3>
              <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed max-w-sm">
                Uma análise de eficiência sobre os três pilares estratégicos da sua presença corporativa sênior.
              </p>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono tracking-wider pt-4 border-t border-white/5 uppercase">
              Selecione os pilares à direita para interagir.
            </div>
          </div>

          {/* COLUMN 2: Stunning Orbital Gauge (Center) */}
          <div className="lg:col-span-4 flex justify-center py-4">
            <div className="relative w-60 h-60 flex items-center justify-center">
              {/* Spinning orbiting elements */}
              <svg 
                viewBox="0 0 200 200" 
                className="absolute inset-0 w-full h-full transform"
                style={{ transform: `rotate(${radialAngle}deg)` }}
              >
                <circle cx="100" cy="100" r="92" stroke="rgba(255, 255, 255, 0.01)" strokeWidth="0.5" fill="none" />
                <circle cx="100" cy="100" r="84" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" fill="none" strokeDasharray="3 3" />
                
                {/* Satellite small dot */}
                <circle cx="100" cy="8" r="3" fill="var(--color-brand-secondary)" className="opacity-80" />
                <circle cx="12" cy="100" r="1.5" fill="rgba(255,255,255,0.2)" />
              </svg>

              {/* Central Vector Circle Scale */}
              <svg viewBox="0 0 200 200" className="w-[88%] h-[88%] relative z-10 transform -rotate-90">
                <defs>
                  <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-brand-secondary)" />
                    <stop offset="100%" stopColor="var(--color-brand)" />
                  </linearGradient>
                </defs>
                
                {/* Track */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.03)"
                  strokeWidth="5"
                  fill="none"
                />

                {/* Animated Indicator */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="url(#neonGlow)"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 0.95, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>

              {/* Flat dark central card */}
              <div className="absolute w-[172px] h-[172px] rounded-full bg-[#0a0a0c] border border-white/[0.03] shadow-xl flex flex-col items-center justify-center text-center p-4 z-20">
                <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-black">
                  {currentPillar.label}
                </span>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPillar.score}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="font-sans font-black text-5xl text-white tracking-widest leading-none mt-1 flex items-baseline justify-center"
                  >
                    {currentPillar.score}
                    <span className="text-xl text-brand ml-0.5">%</span>
                  </motion.div>
                </AnimatePresence>

                <p className="text-zinc-500 text-[8px] uppercase tracking-wider font-mono mt-1.5 font-bold">
                  Índice Médio
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-brand mt-2 animate-pulse" />
              </div>
            </div>
          </div>

          {/* COLUMN 3: Balanced stacked list items inspired perfectly by right items on Slide (Right) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            {pillars.map((p) => {
              const isActive = activePillar === p.id;
              
              return (
                <div
                  key={p.id}
                  onClick={() => setActivePillar(p.id)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none ${
                    isActive
                      ? "bg-white/[0.02] border-brand/20 shadow-[0_4px_20px_rgba(var(--color-brand-secondary-rgb),0.03)]"
                      : "bg-transparent border-white/[0.02] hover:border-white/5 hover:bg-white/[0.005]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isActive ? "bg-brand/10 text-brand" : "bg-white/5 text-zinc-500"
                    }`}>
                      {p.id === "posicionamento" && <Compass className="w-4.5 h-4.5" />}
                      {p.id === "canais" && <Workflow className="w-4.5 h-4.5" />}
                      {p.id === "processos" && <ShieldCheck className="w-4.5 h-4.5" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                          isActive ? "text-brand-secondary" : "text-zinc-300"
                        }`}>
                          {p.name}
                        </h4>
                        <span className={`font-sans text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isActive ? "bg-brand/15 text-brand" : "bg-white/5 text-zinc-500"
                        }`}>
                          {p.score}%
                        </span>
                      </div>
                      
                      {/* Interactive display of snippet description only when selected or subtle preview */}
                      <p className={`text-[11px] leading-relaxed mt-1 transition-all duration-300 ${
                        isActive ? "text-zinc-400" : "text-zinc-600 line-clamp-1"
                      }`}>
                        {p.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
