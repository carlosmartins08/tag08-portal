import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { 
  Building2, 
  Heart, 
  Cpu, 
  Scale, 
  TrendingUp, 
  GraduationCap, 
  Award, 
  ArrowUpRight,
  Shield,
  Zap,
  CheckCircle2
} from "lucide-react";

export interface LogoItem {
  name: string;
  industry?: string;
  metric?: string;
  metricLabel?: string;
  iconName?: "building" | "health" | "tech" | "law" | "finance" | "education" | "security" | "energy";
  logoUrl?: string; // fallback if an actual image is provided
}

interface MiniCasesProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  logos?: LogoItem[];
  highlightColor?: string; // e.g. 'var(--color-brand)'
  onNavigate?: (page: string) => void;
}

// Built-in map to resolve string names to Lucide icons safely
const iconMap = {
  building: Building2,
  health: Heart,
  tech: Cpu,
  law: Scale,
  finance: TrendingUp,
  education: GraduationCap,
  security: Shield,
  energy: Zap,
};

const DEFAULT_LOGOS: LogoItem[] = [
  {
    name: "Clínica Alphaville",
    industry: "Saúde & Estética Estrita",
    metric: "+240%",
    metricLabel: "Faturamento High-Ticket",
    iconName: "health"
  },
  {
    name: "ProcessFlow ERP",
    industry: "SaaS Enterprise B2B",
    metric: "4.2x",
    metricLabel: "Retorno de Mídia Pago (ROAS)",
    iconName: "tech"
  },
  {
    name: "Nunes & Associados",
    industry: "Advocacia Societária",
    metric: "18+",
    metricLabel: "Novos Contratos Anuais",
    iconName: "law"
  },
  {
    name: "Grupo Medeiros",
    industry: "Investimentos & Asset",
    metric: "R$ 12M+",
    metricLabel: "Captação Ativa Certificada",
    iconName: "finance"
  },
  {
    name: "Zenith Corporativo",
    industry: "Educação Integrada",
    metric: "98.7%",
    metricLabel: "Retenção de Alunos Sênior",
    iconName: "education"
  },
  {
    name: "Vanguard Sec",
    industry: "Segurança de Dados",
    metric: "Zero",
    metricLabel: "Tempo de Inatividade Crítico",
    iconName: "security"
  }
];

export default function MiniCases({
  title = "Prova real de nossos métodos ativos",
  subtitle = "Marcas de liderança incontestável que escolheram o ecossistema estratégico, direção estética e performance técnica da TAG08.",
  badge = "PORTFÓLIO DE PROVA SOCIAL // MARCAS PARCEIRAS",
  logos = DEFAULT_LOGOS,
  highlightColor = "var(--color-brand)",
  onNavigate
}: MiniCasesProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { type: "spring" as const, stiffness: 100, damping: 15 } 
    },
  };

  const handleCtaClick = () => {
    if (onNavigate) {
      onNavigate("/contato");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section 
      id="mini-cases-section" 
      className="tag08-section w-full px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-900/20 text-left font-sans"
    >
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Header Block and Text Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline">
          <div className="lg:col-span-7 tag08-section__header">
            <span className="tag08-kicker">
              {badge}
            </span>
            <h2 className="tag08-section__heading font-display font-black text-3xl sm:text-4xl text-white">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="tag08-section__copy text-zinc-400 text-xs sm:text-sm font-medium">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Dynamic Logo Cards Layout */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={prefersReducedMotion ? undefined : { once: true, margin: "-100px" }}
        >
          {logos.map((logo, idx) => {
            const IconComponent = logo.iconName ? iconMap[logo.iconName] : undefined;

            return (
              <motion.div
                key={`${logo.name}-${idx}`}
                variants={prefersReducedMotion ? undefined : itemVariants}
                className="tag08-card tag08-card--interactive p-6 flex flex-col justify-between min-h-[180px] group relative overflow-hidden"
              >
                {/* Micro Ambient Glow in background */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand/[0.015] blur-3xl rounded-full group-hover:bg-brand/[0.035] transition-all duration-500 pointer-events-none" />

                <div className="flex items-start justify-between relative z-10">
                  {/* Brand Typography & Visual Icon Wrapper */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-brand group-hover:border-brand/20 transition-all duration-300">
                      {logo.logoUrl ? (
                        <Image
                          src={logo.logoUrl} 
                          alt={logo.name} 
                          width={24}
                          height={24}
                          className="w-6 h-6 object-contain filter grayscale invert group-hover:grayscale-0 transition-all"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        IconComponent ? <IconComponent className="w-5 h-5 stroke-[1.5]" /> : <Building2 className="w-5 h-5 stroke-[1.5]" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-display font-black text-white text-base tracking-tight leading-none group-hover:text-brand transition-colors duration-300">
                        {logo.name}
                      </h4>
                      <p className="tag08-meta text-zinc-500">
                        {logo.industry || "Empresa Clientes"}
                      </p>
                    </div>
                  </div>

                  {/* Tiny action bullet or status indicator */}
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-brand transition-colors duration-300" />
                </div>

                {/* Proof Metric Block at bottom */}
                <div className="border-t border-white/[0.04] pt-4 mt-auto flex items-end justify-between relative z-10">
                  {logo.metric ? (
                    <div className="space-y-0.5 text-left">
                      <span className="block font-display font-black text-xl text-brand leading-none tracking-tight">
                        {logo.metric}
                      </span>
                      <span className="block text-zinc-500 tag08-meta leading-none">
                        {logo.metricLabel || "Indicador de Sucesso"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-zinc-500 tag08-meta">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand stroke-[2]" />
                    <span>Projeto entregue e homologado</span>
                    </div>
                  )}

                    <span className="tag08-meta text-zinc-600 group-hover:text-zinc-400 transition-colors duration-300 flex items-center gap-1">
                    Ativo <ArrowUpRight className="w-3 h-3 text-brand" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Context Link Trigger for consulting */}
        {onNavigate && (
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/[0.04]">
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-brand" />
              <p className="text-zinc-500 tag08-meta text-left">
                Gostaria de ver sua marca gerando este nível de autoridade e retenção?
              </p>
            </div>
            <button
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-brand text-zinc-300 hover:text-black border border-white/10 hover:border-transparent rounded-xl tag08-action transition-colors duration-200 cursor-pointer"
            >
              <span>Solicitar Diagnóstico de Posicionamento</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
