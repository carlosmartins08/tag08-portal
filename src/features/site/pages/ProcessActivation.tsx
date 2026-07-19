import { useState } from "react";
import Image from "next/image";
import { BookOpen, ShieldAlert, ArrowUpRight, CheckSquare, Zap, Target, RefreshCw, BarChart2, ArrowRight, MessageSquare, Workflow } from "lucide-react";
import { motion } from "motion/react";
import { buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl } from "../../../config/siteNetwork";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import MiniCases from "../../../components/MiniCases";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import { ACTIVATION_LEVELS, ACTIVATION_ROADMAPS, type ActivationLevel } from "../../../lib/simulators/processActivation";
import { useSimulatorTracking } from "../../../lib/useSimulatorTracking";

interface ActivationProps {
  onNavigate: (page: string) => void;
}

export default function ProcessActivation({ onNavigate }: ActivationProps) {
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeLevel, setActiveLevel] = useState<ActivationLevel>("bronze");
  const trackSimulator = useSimulatorTracking("process_activation_maturity", 1, "/servicos/process-activation");
  const roadmap = ACTIVATION_ROADMAPS[activeLevel];

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-[8%] left-[-15%] w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] bg-brand/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle floating 3D element in the background of user focus */}
      <Subtle3DCanvas intensity={1.3} className="absolute right-[-8%] top-[5%] w-[480px] h-[480px] opacity-[0.35] mix-blend-screen hidden lg:block" />

      {/* SECTION 1 - HERO: THE EDITORIAL SYSTEM (Synchronized Style) */}
      <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          {/* 1. Header Typography block (Ref Style: Expert guidance / tailored solution) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono self-start">
                DIVIsão DE SUSTENTação OPERACIONAL // TAG08
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter uppercase font-display">
                Process Activation <br />
                <span className="text-brand">para transformar processos estruturados em execução real.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-sans font-medium">
                De que adiantam manuais perfeitos documentados em PDFs ou wikis se o seu time os ignora na vida real? O Process Activation ensina com workshops práticos, ativa as wikis diretamente nas tarefas diárias e audita com relatórios para sustentar a nova conduta de crescimento corporativo.
              </p>
            </div>
          </div>

          {/* 2. Panoramic Wide Banner Image with capsule neon overlay trigger wrapped in 3D perspective tilt container */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600"
                alt="Habilitação Operacional e Aprendizado Aplicado TAG08"
                fill
                sizes="100vw"
                className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-[1.01] transition-all duration-1000 ease-out"
                referrerPolicy="no-referrer"
              />
              {/* Elegant overlay masks */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />

              {/* Glowing neon action button floating inside face banner mimicking "Free Trial" anchor */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{ transform: "translateZ(45px)" }}>
                <button
                  onClick={() => handleLinkClick("/contato")}
                  className="group bg-brand-secondary text-black font-mono font-black text-[10px] sm:text-[11px] uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] hover:scale-105 duration-300 transition-all border border-brand-secondary hover:bg-brand-dark flex items-center gap-2 cursor-pointer z-20"
                >
                  <span>ATIVAR NOVA ROTINA</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Absolute indicator tags on corners */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="font-mono text-[8.5px] text-brand-secondary tracking-widest block uppercase font-bold">TAG08 OPERATIONAL ACTIVATOR</span>
                  <h4 className="font-display font-black text-white text-xs sm:text-sm uppercase tracking-tight leading-none">Cultura de Adesão e Sustentabilidade de Rotinas</h4>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-[8px] text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>PROC_ACTIVATION // ENABLED</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* CRITICAL CONTRACT PREREQUISITE ALERT (Beautifully integrated as an editorial premium notice) */}
          <div className="bg-brand/[0.03] border-2 border-brand/20 p-6 rounded-3xl flex items-start gap-4 text-left max-w-7xl mx-auto shadow-lg">
            <div className="p-3 bg-brand/10 text-brand rounded-2xl shrink-0">
              <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-mono text-[10px] text-brand tracking-wider uppercase font-black">Importante: Condição Essencial de Contratação</h4>
              <p className="text-zinc-300 text-xs sm:text-[13px] leading-relaxed font-sans font-medium">
                O <strong>Process Activation</strong> é expressamente condicionado à contratação e conclusão prévia do <strong>Process Intelligence</strong>. Ele não atua criando manuais do absoluto zero ou substituindo o mapeamento técnico. Sua função é implantar, de forma prática e supervisionada, as wikis e playbooks já construídos na primeira fase de assessoria técnica.
              </p>
            </div>
          </div>

          {/* 3. High status core statistics row matching screenshot layout */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">70%</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Do Sucesso da Operação Depende<br/>exclusivamente da Disciplina</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">Sessões</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Treinamentos e Alinhamentos<br/>Coordenados de Transição</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Auditoria</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Acompanhamento e Pontuação<br/>de Conduta da Equipe</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">30 Dias</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Supervisão Técnica Core por<br/>Diretores Seniores Ativos</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2 - SEGMENTATION / PARA QUEM a (Desafios comuns) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04] bg-charcoal-900/10 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-4 space-y-4">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">FRICaaO PaS ESTRUTURação</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-none tracking-tight">
              POR QUE PROCESSOS REAIS DE <span className="text-brand">QUALIDADE FALHAM?</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Escrever um manual operacional limpo a 30% do esforço; a rotina tática de adoção do time responde pelos outros 70%.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">01 // MANUAIS ESQUECIDOS</span>
              <h4 className="text-white font-display font-black text-sm uppercase">O PDF perfeito foi ignorado pelo time</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                Seus manuais estao perfeitos em documentos compartilhados no Google Drive, mas a equipe ignora no cotidiano, repetindo as velhas metodologias do improviso. Transponha essa inarcia.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">02 // INDISCIPLINA DE ROTINAS ANTIGAS</span>
              <h4 className="text-white font-display font-black text-sm uppercase">Fricção de adesão de colaboradores</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                Membros mais antigos do time sentem extrema dificuldade em preencher relatórios, centralizar conversas e usar a nova wiki corporativa. Atuamos com paciancia técnico-metodológica.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">03 // FALTA DE TEMPO DA GESTÃO DE TOPO</span>
              <h4 className="text-white font-display font-black text-sm uppercase">Fundadores exaustos de fiscalizar o fluxo</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                Sua diretoria de sócios não possui disponibilidade semanal para cobrar a conduta das regras dos setores na ponta do cronograma. Nós assumimos essa responsabilidade tática.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">04 // EVAPORAÇÃO SILENCIOSA DO MÉTODO</span>
              <h4 className="text-white font-display font-black text-sm uppercase">A nova cultura evapora gradualmente</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                A euforia das primeiras duas semanas de playbooks passa, e o time lentamente retorna ao caos e às conversas sem rumo por falta de fiscalização séria recorrente. Proteja seu investimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - DELIVERABLES PILARES (The "What" with Clean Features Grid) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-bold">PILARES DE ATIVAÇÃO PRÁTICA SÊNIOR</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">COMO NOSSA ATIVAÇÃO CONDUZ SEU TIME</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Agimos como um vetor ativo de disciplina. Treinamos, testamos na rotina prática e cobramos a consolidação da nova rotina com foco na autonomia plena.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Zap className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Implantação Imediata</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Organizamos ritos práticos de introdução por meio de checklists dinâmicos no dia a dia do colaborador, vinculando as wikis aos cards de tarefas reais de forma rápida.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Workshops Dedicados</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Workshops interativos em vídeo com o time focado no uso das ferramentas, gravação de dúvidas conceituais das wikis, e preenchimento de métricas comerciais de rotina operacional.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Target className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Auditoria Recorrente</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Analises de adesão periódicas no cronograma das wikis. Destacómos condutas exemplares e auxiliamos os colaboradores com dificuldades técnicas no funil operacional da empresa.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Ajustes Incrementais</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  A rotina prática esbarra em atritos inevitáveis. Customizamos e polimos as regras e os playbooks de forma orgânica de acordo com o crescimento real das suas divisões táticas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - BENEFITS (Why activate) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04] bg-charcoal-900/10 text-left">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-2 max-w-2xl">
            <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-bold">DESVOLVIMENTO DA MAIOR DISCIPLINA</span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">BENEFÍCIOS DA GOVERNANÇA ATIVA</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Garanta que sua empresa funcione de forma automatizada sob padrões estruturados de excelência, sem depender do monitoramento microgerenciado dos sócios.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-5 bg-zinc-900/40 border border-white/[0.03] rounded-3xl space-y-2">
              <CheckSquare className="w-5 h-5 text-brand" />
              <h4 className="text-white font-display font-black text-sm uppercase">Aprendizado Pratico</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">O time aprende engajado em sessões assistidas rápidas diretamente nas rotinas de tarefas da empresa.</p>
            </div>
            <div className="p-5 bg-zinc-900/40 border border-white/[0.03] rounded-3xl space-y-2">
              <CheckSquare className="w-5 h-5 text-brand" />
              <h4 className="text-white font-display font-black text-sm uppercase">Precedancia e Ordem</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">Estruturação de prazos claros unificados baseados em checklists transparentes a vista de toda a equipe.</p>
            </div>
            <div className="p-5 bg-zinc-900/40 border border-white/[0.03] rounded-3xl space-y-2">
              <CheckSquare className="w-5 h-5 text-brand" />
              <h4 className="text-white font-display font-black text-sm uppercase">Sustentabilidade Core</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">Garantimos a fiscalização contínua das regras táticas sem gastar o cronograma pessoal semanal dos fundadores.</p>
            </div>
            <div className="p-5 bg-zinc-900/40 border border-white/[0.03] rounded-3xl space-y-2">
              <CheckSquare className="w-5 h-5 text-brand" />
              <h4 className="text-white font-display font-black text-sm uppercase">Cultura de Autonomia</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">Os manuais permanecem vivos, sofrendo polimentos constantes táticos para guiar novos crescimentos futuros.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - TRUST CORE BAR */}
      <section className="px-4 sm:px-6 md:px-8 py-10 border-b border-white/[0.04] bg-charcoal-900/40 text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-3xl">
            <h4 className="text-white font-display font-black text-sm uppercase tracking-tight">O FIM DA CENTRALIZAÇÃO DESESPERADA</h4>
            <p className="text-zinc-400 text-xs font-sans font-medium leading-relaxed">
              O Process Activation cria uma cultura operacional de autonomia. O time passa a conduzir com mais clareza as atividades de venda, suporte e faturamento mesmo na ausência do fundador.
            </p>
          </div>
          <span className="font-mono text-[8.5px] text-brand-secondary uppercase tracking-widest border border-brand-secondary/20 bg-brand-secondary/5 px-3.5 py-2 rounded-xl shrink-0 font-black">
            PROCESS ACTIVATION // TAG08
          </span>
        </div>
      </section>

      {/* OPERATIONS / PROCESS ACTIVATION CLIENTS LOGO SOCIAL PROOF */}
      <MiniCases 
        onNavigate={onNavigate} 
        title="Garantia de Adesão e Disciplina Operacional"
        subtitle="Times integrados que atingiram 100% de conformidade com seus novos playbooks táticos sob a metodologia de ativação da TAG08."
        badge="ACTIVATION PROOF // ADOÇÃO REAL DE PROCESSOS"
      />

      {/* INTERACTIVE INNOVATION: SIMULADOR DE MATURIDADE OPERACIONAL & CRONOGRAMA */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-950 text-left relative overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-brand/[0.01] rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              METODOLOGIA ATIVA // ROADMAP DE EXECUÇÃO
            </span>
            <h2 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
              Simulador de Maturidade Operacional e Cronograma
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
              O sucesso de uma automação corporativa não depende do software, mas da adesão do time. Identifique abaixo o nível de maturidade atual da sua operação e visualize o plano de cronograma exato para ativação e integração de playbooks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Controls */}
            <div className="lg:col-span-5 bg-charcoal-900/60 border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-6">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold block pb-3 border-b border-white/[0.05]">
                  Nível de Maturidade Atual:
                </span>

                {/* Level Selectors */}
                {ACTIVATION_LEVELS.map((level) => {
                  const isSelected = level.id === activeLevel;
                  return (
                    <button
                      key={level.id}
                      onClick={() => { trackSimulator("input_changed"); setActiveLevel(level.id); }}
                      className={`p-4 rounded-xl text-left border relative transition-all cursor-pointer ${
                        isSelected ? "bg-brand-secondary/5 border-brand-secondary text-white" : "bg-white/[0.01] border-white/5 text-zinc-400 hover:border-white/10"
                      }`}
                    >
                      <h4 className="text-white text-xs sm:text-sm font-semibold uppercase leading-tight">{level.name}</h4>
                      <p className="text-zinc-500 text-[10px] mt-1 leading-snug">{level.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-2">
                <div className="flex items-center gap-2 text-brand">
                  <Zap className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider">Metodologia Hands-on TAG08</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  Nossa equipe não entrega apenas manuais estáticos em PDF que ninguém lê. Nós conduzimos as sessões, gravamos treinamentos curtos, estruturamos ferramentas e auditamos a execução por 30 dias para garantir adoção real de 100% do time.
                </p>
              </div>
            </div>

            {/* Timeline Panel */}
            <div className="lg:col-span-7 bg-[#09090b] border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-6 w-full">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold block">
                    Plano de Cronograma e Entregas de Ativação:
                  </span>
                  <span className="font-sans text-[9.5px] text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded font-black">
                    {roadmap.duration}
                  </span>
                </div>

                {/* Vertical Timeline Steps */}
                <div className="space-y-4">
                  {roadmap.phases.map((phase) => (
                    <div key={phase.step} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-start gap-4 hover:border-brand/20 transition-all">
                      <div className="font-sans text-[8.5px] font-black text-brand bg-brand/5 border border-brand/10 rounded px-2.5 py-1 shrink-0 mt-0.5">
                        {phase.step}
                      </div>
                      <div className="space-y-1 text-left">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white text-xs sm:text-sm font-bold uppercase leading-tight">
                            {phase.title}
                          </h4>
                          <span className="text-[9px] font-sans text-zinc-500 font-bold">
                            {phase.badge}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-sans">
                          {phase.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 mt-6">
                <span className="font-sans text-[8px] text-zinc-600">PROCESSO REGULADO SOB CONFORMIDADE OPERACIONAL ISO 9001 // 2026</span>
                <button 
                  onClick={() => onNavigate("/contato")}
                  className="text-xs font-mono text-brand font-black uppercase hover:underline flex items-center gap-1.5 cursor-pointer focus:outline-none"
                >
                  Cronometrar Minha Ativação <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION - WORK SYSTEM (WhatsApp Neon Callout inspired by screenshot) */}
      <section className="py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          {/* Left Column: Portrait */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[520px]">
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden" />
            <Image
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
              alt="TAG08 Activation Specialist" 
              className="object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[15%] transition-all duration-500 hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  OPERATIONAL CORE
                </span>
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  TAG08.v3
                </span>
              </div>
              <div className="space-y-1.5 opacity-30 select-none">
                <div className="font-display font-extrabold text-[1.8rem] text-white/40 tracking-widest leading-none uppercase select-none">
                  processes_active
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                  sustentação_rota_
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  LATENCY: 12MS
                </span>
                <span className="font-mono text-[9px] text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  SÊNIOR SECURITY
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 text-left h-full relative z-10 lg:pl-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-black font-semibold">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/90">
                  CONFIRA NOSSO SISTEMA DE TRABALHO
                </span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black leading-[0.9] tracking-tighter uppercase font-display">
                ATIVAMOS SISTEMAS <br />
                E SUSTENTAMOS REGRAS!
              </h2>
              <p className="text-black/85 text-[11px] sm:text-xs max-w-lg leading-relaxed font-sans font-extrabold uppercase">
                INTEGRAMOS WORKSHOPS PRaTICOS PARALELOS, CRIAMOS ROTINAS COM CHECKLISTS DIaRIAS DIRETAS NO PAINEL E AUDITAMOS CONTINUAMENTE A ADEsão DA SUA EQUIPE PARA GERAR AUTONOMIA REAL DAS OPERAções.
              </p>
            </div>

            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 max-w-md relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-4 items-start select-none">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black shrink-0 shadow-lg shadow-brand/10 hover:scale-105 transition-transform duration-200">
                  <Workflow className="w-5 h-5 stroke-[2.5] text-black" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-[8px] text-brand uppercase tracking-wider font-extrabold block">
                  GOVERNANÇA ATIVA
                  </span>
                  <p className="text-white text-xs leading-snug font-sans font-semibold">
                    Evite manuais de processo engavetados. Sustentamos as regras de trabalho para que o time opere de forma autanoma sem supervisão.
                  </p>
                </div>
              </div>

              {/* DUAL CLIENT CONNECTION CHANNELS (BR & INT) */}
              <div className="space-y-3">
                <a 
                  href={buildBrazilWhatsAppUrl("Ola,%20gostaria%20de%20solicitar%20um%20diagnóstico%20de%20Process%20Activation%20com%20a%20TAG08")}
                  onClick={() => trackSimulator("cta_clicked")}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-black transition-all duration-200">
                        <span className="text-[9px] font-mono font-black tracking-tight text-brand group-hover:text-black">BR</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase font-black tracking-wider leading-none">
                          PROPRIETÁRIO DIRETO (WhatsApp)
                        </span>
                        <span className="text-white text-xs font-mono font-bold tracking-wider group-hover:text-brand transition-colors mt-0.5">
                          +55 83 9.9886-8882
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-brand font-mono font-bold uppercase tracking-wider bg-brand/10 py-1 px-2.5 rounded-lg group-hover:bg-brand group-hover:text-black transition-all">
                      CONECTAR
                    </span>
                  </div>
                </a>

                <a 
                  href={buildInternationalWhatsAppUrl("Hello,%20I%20would%20like%20to%20request%20process%20activation%20consulting%20and%20corporate%2520training%2520from%2520TAG08")}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary shrink-0 group-hover:bg-brand-secondary group-hover:text-black transition-all duration-200">
                        <span className="text-[9px] font-mono font-black tracking-tight text-brand-secondary group-hover:text-black">INT</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase font-black tracking-wider leading-none">
                          INTERNATIONAL DIRECT (WhatsApp)
                        </span>
                        <span className="text-white text-xs font-mono font-bold tracking-wider group-hover:text-brand-secondary transition-colors mt-0.5">
                          +56 9 9793 7611
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-brand-secondary font-mono font-bold uppercase tracking-wider bg-brand-secondary/10 py-1 px-2.5 rounded-lg group-hover:bg-brand-secondary group-hover:text-black transition-all">
                      CONECTAR
                    </span>
                  </div>
                </a>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                  <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest font-extrabold">
                    AGaNCIA TAG08
                  </span>
                </div>
                <span className="font-sans text-[8.5px] text-brand font-bold bg-brand/10 border border-brand/20 px-2 rounded">
                  OPERação ATIVA 100% online
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOVO BLOCO: PRa-REQUISITOS, O QUE NaO FAZEMOS, CICLO DE AUDITORIA, MATRIZ E CTA */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-zinc-950 text-left">
        <div className="max-w-7xl mx-auto space-y-24">
          
          {/* Pra-requisitos para contratação */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                ALINHAMENTO DE ENTRADA // EXIGaNCIAS PRaVIAS
              </span>
              <h2 className="font-display font-medium text-2xl sm:text-3xl text-gradient">
                Sua empresa esta pronta para a Ativação de Processos?
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                A divisão de Activation é extremamente realizadora e tática, mas exige que sua empresa preencha critérios de entrada mínimos. Sem eles, qualquer esforço de implantação de auditoria será inofensivo:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { title: "Processos Mapeados", desc: "Sua marca precisa ter manuais, playbooks ou fluxos de trabalho previamente consolidados (caso não possua, indicómos nossa divisão Process Intelligence)." },
                { title: "Lideranaa Comprometida", desc: "Os diretores e fundadores precisam dar respaldo absoluto de autoridade aos nossos auditores para cobrar a equipe." }
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-charcoal-900 border border-white/[0.04] space-y-2">
                  <h4 className="text-white text-xs sm:text-sm font-display font-medium uppercase tracking-tight text-brand-secondary">{item.title}</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* O que nas NaO fazemos na Ativação */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10 border-t border-white/[0.04]">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-[10px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                LIMITES DE ESCOPO // ATUação PROFISSIONAL
              </span>
              <h3 className="font-display font-medium text-2xl text-white">
                O que NaO esta incluso na Ativação de Processos
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                Nas auditamos, implantamos e cobramos conformidade técnica com afinco, mas não assumimos atribuições internas que pertencem pura e exclusivamente a sua diretoria:
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { title: "Não Somos RH do Cliente", desc: "Nós reportamos o não cumprimento de processos e erros operacionais, mas demissões, contratações e advertências legais cabem ao seu RH." },
                { title: "Não Alteramos Seus Contratos", desc: "Não fazemos alterações legais em obrigações de trabalho de colaboradores ou fornecedores externos sem sua expressa validação." },
                { title: "Não Somos Gerentes Permanentes", desc: "Nossa divisão opera para implantar autonomia. Treinamos seus líderes internos para que eles assumam a sustentação permanente." },
                { title: "Não Gerenciamos Suas Finanças", desc: "Efetuamos auditoria operacional na prestação de contas, mas transferências bancárias e decisões de tesouraria continuam com você." }
              ].map((point, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.03] space-y-1">
                  <h4 className="text-white text-xs sm:text-sm font-display font-medium uppercase tracking-tight text-zinc-300">{point.title}</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ciclo de auditoria semanal */}
          <div className="space-y-8 pt-10 border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                SISTEMA SEMANAL DE CRITÉRIOS
              </span>
              <h3 className="font-display font-medium text-2xl text-white">
                O funcionamento prático do nosso Ciclo Mensal e Semanal
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed max-w-2xl">
                A adesão aos manuais do seu negócio ocorre por insistência e constância analítica. Nosso time executa um cronograma estável e repetitivo nos bastidores:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              {[
                { title: "1. Monitoramento Ativo", desc: "Nossos auditores extraem diariamente relatórios de sistemas (Notion, Trello, CRM, etc.) para verificar conformidade tática." },
                { title: "2. Cobrança e Apoio", desc: "Colaboradores com atraso recebem alertas e suporte rápido para esclarecer possíveis dúvidas sistêmicas." },
                { title: "3. Briefing de Resultados", desc: "Reunião rápida semanal com a diretoria para relatar o cumprimento exato dos indicadores de aderência dos times." },
                { title: "4. Calibragem Mensal", desc: "Encontros de fim de ciclo para ajustar fluxos que geram ruído estrutural ou gargalos operacionais frequentes." }
              ].map((step, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-charcoal-900 border border-white/[0.04] space-y-2">
                  <h4 className="text-white font-display font-semibold text-xs sm:text-sm uppercase tracking-tight text-brand">{step.title}</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Matriz de Responsabilidades (TAG08 vs. Cliente) */}
          <div className="space-y-6 pt-10 border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                MATRIZ DE FRONTEIRAS // RESPONSABILIDADE OPERACIONAL
              </span>
              <h3 className="font-display font-medium text-2xl text-white">
                Quem responde por qual entrega?
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed max-w-xl">
                Operamos integrados, mas as fronteiras de decisão precisam estar desenhadas com absoluta clareza técnica:
              </p>
            </div>

            <div className="border border-white/[0.06] rounded-2xl overflow-hidden divide-y divide-white/[0.06] bg-charcoal-900/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 font-mono text-[10px] text-zinc-500 uppercase tracking-wider bg-white/[0.01]">
                <div>Esfera de Atuação TAG08</div>
                <div>Esfera de Atuação do Cliente</div>
              </div>

              {[
                { col1: "Auditoria contínua de adesão aos manuais operacionais cadastrados.", col2: "Atendimento ou execução direta das tarefas operacionais cotidianas." },
                { col1: "Alertas de atraso e notificações individuais de inconformidade tática.", col2: "Sanções oficiais de RH, reuniões de advertência ou demissões." },
                { col1: "Criação de sessões explicativas adicionais de sistemas se necessário.", col2: "Disponibilizar tempo dos times para as reuniões de alinhamento." },
                { col1: "Garantir notas mensais agregadas de qualidade operacional por área.", col2: "Definir metas comerciais sêniores e direcionar investimentos do negócio." }
              ].map((row, rIdx) => (
                <div key={rIdx} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 text-xs sm:text-sm">
                  <div className="text-zinc-300 font-sans flex gap-2">
                    <span className="text-brand-secondary font-mono font-bold shrink-0">[TAG08]</span>
                    <span>{row.col1}</span>
                  </div>
                  <div className="text-zinc-400 font-sans flex gap-2 border-t md:border-t-0 border-white/[0.03] pt-3 md:pt-0">
                    <span className="text-zinc-500 font-sans font-bold shrink-0">[CLIENTE]</span>
                    <span>{row.col2}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quando Contratar */}
          <div className="p-6 sm:p-8 rounded-3xl bg-charcoal-900 border border-white/[0.05] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-10 border-t border-white/[0.04]">
            <div className="lg:col-span-8 space-y-2">
              <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-black block">CRITÉRIO DE ESCOLHA OPERACIONAL</span>
              <h4 className="text-white font-display font-medium text-lg uppercase">Quando contratar nossa ativação sênior?</h4>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                Se sua empresa já ultrapassou o faturamento bruto anual de R$ 300k, possui mais de 4 pessoas na operação, mas você sente que, como fundador, continua preso no operacional de microgerenciamento de tarefas básicas e cobranças redundantes todos os dias, a TAG08 Activation é o encaixe operacional perfeito para a libertação estratégica de seu tempo de negócios.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-end">
              <span className="font-sans text-[10px] text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/15 px-4 py-2 rounded-xl">
                ESTRUTURA DE AUDITORIA ATIVA
              </span>
            </div>
          </div>

          {/* CTA para Ativação */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
            <div className="space-y-1">
              <h3 className="font-display font-semibold text-lg text-white">Sua equipe precisa de acompanhamento operacional sênior?</h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans max-w-xl leading-relaxed">
                Fale com nossos engenheiros de processos e agende um diagnóstico sobre a atual taxa de adesão a manuais e playbooks da sua empresa.
              </p>
            </div>
            <button
              onClick={() => {
                onNavigate("/contato");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-6 py-4 bg-brand-secondary hover:bg-brand-dark text-black text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shrink-0"
            >
              Auditar Adesão de Processos
            </button>
          </div>

        </div>
      </section>

      <ServiceInsightsBridge servicePath="/servicos/process-activation" onNavigate={onNavigate} />

      {/* SECTION - FAQ */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[40px] bg-charcoal-950 border border-white/[0.04] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono">
                  FAQ // ENCONTRE RESPOSTAS
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter uppercase">
                  DÚVIDAS &amp; <br />
                  ATIVAÇÃO PRÁTICA
                </h2>
                <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans max-w-sm">
                  Esclareça as principais dúvidas sobre como a metodologia ativa playbooks na rotina real dos colaboradores.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {([
                  { id: 0, title: "REQUISITO INTELLIGENCE" },
                  { id: 1, title: "ENGANJAMENTO DO TIME" },
                  { id: 2, title: "SISTEMAS DE AUDITORIA" },
                  { id: 3, title: "PERaODO DE SUSTENTação" }
                ]).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveFaq(item.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group cursor-pointer ${
                      activeFaq === item.id
                        ? "bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)]"
                        : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                    }`}
                  >
                    <span className="font-mono text-xs font-black uppercase tracking-wider flex items-center gap-3">
                      <span className={activeFaq === item.id ? "text-black" : "text-brand"}>
                        {String(item.id + 1).padStart(2, '0')}.
                      </span>
                      {item.title}
                    </span>
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                      activeFaq === item.id ? "text-black rotate-[-45deg] stroke-[2.5]" : "text-zinc-500"
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-white/[0.04] bg-[#0c0c0e]">
              <Image
                fill
                sizes="(max-width: 1024px) 100vw, 34vw"
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                alt="TAG08 Process Activation"
                className="object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div className="absolute top-6 left-6 z-10 pointer-events-none font-mono text-[8px] text-white/20 uppercase tracking-widest leading-none">
                SYS // PROCESS_ACTIVE
              </div>

              <div className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left">
                <span className="font-mono text-[8.5px] text-brand uppercase tracking-widest font-black block">
                  {([
                    "REQUISITO INTELLIGENCE",
                    "ENGANJAMENTO DO TIME",
                    "SISTEMAS DE AUDITORIA",
                    "PERaODO DE SUSTENTação"
                  ])[activeFaq]}
                </span>
                
                <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {([
                    "Posso contratar o Activation sem o Intelligence?",
                    "Como vocês engajam a equipe na nova cultura?",
                    "Quem audita o cumprimento dos fluxos?",
                    "Qual o período de sustentação supervisionada?"
                  ])[activeFaq]}
                </h4>
                
                <p className="text-zinc-300 text-xs sm:text-[12.5px] leading-relaxed font-sans font-medium">
                  {([
                    "Não. O Process Activation exige a conclusão prévia do Process Intelligence. Não implantamos manuais sem os playbooks e as wikis estarem estruturados e organizados sob nossa aprovação de calibre técnico.",
                    "Promovemos workshops dinâmicos assistidos voltados ao uso correto das ferramentas, criamos rotinas com checklists visuais de tarefas diárias e conectamos as bases de senhas diretas à mesa de trabalho produtiva de cada colaborador.",
                    "Nossa assessoria sênior realiza vistorias periódicas de conformidade diretamente nos painéis digitais, quantifica a adesão operacional da equipe e auxilia individualmente colaboradores que demonstrem gargalos de ritmo ou aprendizagem.",
                    "O programa dura em média até 30 dias de acompanhamento diário ativo, garantindo polimentos finos de playbooks diante de fricções do mundo real e gerando a consolidação final da autonomia do seu negócio."
                  ])[activeFaq]}
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-bold">PROPOSTA DE VALOR</span>
                  <h4 className="text-white font-semibold text-sm leading-snug">Como agimos de forma organizada?</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    Eliminamos o esquecimento operacional e táticas manuais obsoletas. Garantimos sustentação de rotas.
                  </p>
                </div>
                <button
                  onClick={() => handleLinkClick("/servicos")}
                  className="group flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5"
                >
                  <span>Ver Serviços</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-black/60 uppercase tracking-widest block font-extrabold">FALE COM O DIRETOR</span>
                  <h4 className="text-black font-black text-sm uppercase leading-tight tracking-tight">Quer desenhar uma estratégia sob medida?</h4>
                  <p className="text-black/85 text-[11.5px] font-semibold leading-relaxed font-mono">
                    Fale diretamente com os tomadores de decisão da TAG08 via WhatsApp para avaliar a viabilidade de alocação de equipe.
                  </p>
                </div>
                <a
                  href={buildBrazilWhatsAppUrl("Ola,%20gostaria%20de%20consultar%20viabilidade%20estratégica%20especializada%2520para%20minha%20marca!")}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between text-xs font-sans font-black text-black select-none border-t border-black/10 pt-3 hover:translate-x-0.5 transition-all"
                >
                  <span>Conversar Agora</span>
                  <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 - ACTION TRIGGER FOOTER */}
      <section className="px-4 sm:px-6 md:px-8 py-20 text-center space-y-6 max-w-4xl mx-auto">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase leading-none tracking-tighter">
          SAIA DA INDISCIPLINA INTELECTUAL <br />
          <span className="text-brand">E GARANTA A ADOaaO PLENA DOS SEUS PROCESSOS.</span>
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Evite gastar milhares de reais escrevendo wikis de qualidade para deixa-las engavetadas pegando poeira digital. Fale com nosso diretor de sustentação.
        </p>
        <div className="pt-4">
          <button
            onClick={() => handleLinkClick("/contato")}
            className="group bg-brand text-black font-mono font-black text-[10px] uppercase tracking-widest py-4 px-8 rounded-full shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.22)] hover:bg-brand-dark duration-300 transition-all cursor-pointer flex items-center gap-2 mx-auto"
          >
            <span>DISPARAR ATIVAÇÃO DE PROCESSOS DE ELITE</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </section>
    </div>
  );
}












