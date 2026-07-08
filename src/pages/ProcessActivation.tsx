import { useState } from "react";
import { BookOpen, ShieldAlert, ArrowUpRight, CheckSquare, Zap, Target, RefreshCw, BarChart2, ArrowRight, MessageSquare, Workflow } from "lucide-react";
import { motion } from "motion/react";
import { buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl } from "../config/siteNetwork";
import ThreeDimensionalTilt from "../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../components/Subtle3DCanvas";
import MiniCases from "../components/MiniCases";

interface ActivationProps {
  onNavigate: (page: string) => void;
}

export default function ProcessActivation({ onNavigate }: ActivationProps) {
  const [activeFaq, setActiveFaq] = useState(0);

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
                DIVIsÃ£o DE SUSTENTaÃ§Ã£o OPERACIONAL // TAG08
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter uppercase font-display">
                Process Activation <br />
                <span className="text-brand">para transformar processos estruturados em execuÃ§Ã£o real.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-sans font-medium">
                De que adiantam manuais perfeitos documentados em PDFs ou wikis se o seu time os ignora na vida real? O Process Activation ensina com workshops prÃ¡ticos, ativa as wikis diretamente nas tarefas diÃ¡rias e audita com relatÃ³rios para sustentar a nova conduta de crescimento corporativo.
              </p>
            </div>
          </div>

          {/* 2. Panoramic Wide Banner Image with capsule neon overlay trigger wrapped in 3D perspective tilt container */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600"
                alt="HabilitaÃ§Ã£o Operacional e Aprendizado Aplicado TAG08"
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
                  <h4 className="font-display font-black text-white text-xs sm:text-sm uppercase tracking-tight leading-none">Cultura de AdesÃ£o e Sustentabilidade de Rotinas</h4>
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
              <h4 className="font-mono text-[10px] text-brand tracking-wider uppercase font-black">Importante: CondiÃ§Ã£o Essencial de ContrataÃ§Ã£o</h4>
              <p className="text-zinc-300 text-xs sm:text-[13px] leading-relaxed font-sans font-medium">
                O <strong>Process Activation</strong> Ã© expressamente condicionado Ã  contrataÃ§Ã£o e conclusÃ£o prÃ©via do <strong>Process Intelligence</strong>. Ele nÃ£o atua criando manuais do absoluto zero ou substituindo o mapeamento tÃ©cnico. Sua funÃ§Ã£o Ã© implantar, de forma prÃ¡tica e supervisionada, as wikis e playbooks jÃ¡ construÃ­dos na primeira fase de assessoria tÃ©cnica.
              </p>
            </div>
          </div>

          {/* 3. High status core statistics row matching screenshot layout */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">70%</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Do Sucesso da OperaÃ§Ã£o Depende<br/>exclusivamente da Disciplina</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">SessÃµes</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Treinamentos e Alinhamentos<br/>Coordenados de TransiÃ§Ã£o</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Auditoria</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Acompanhamento e PontuaÃ§Ã£o<br/>de Conduta da Equipe</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">30 Dias</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">SupervisÃ£o TÃ©cnica Core por<br/>Diretores Seniores Ativos</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2 - SEGMENTATION / PARA QUEM a (Desafios comuns) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04] bg-charcoal-900/10 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-4 space-y-4">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">FRICaaO PaS ESTRUTURaÃ§Ã£o</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-none tracking-tight">
              POR QUE PROCESSOS REAIS DE <span className="text-brand">QUALIDADE FALHAM?</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Escrever um manual operacional limpo a 30% do esforÃ§o; a rotina tÃ¡tica de adoÃ§Ã£o do time responde pelos outros 70%.
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
              <h4 className="text-white font-display font-black text-sm uppercase">FricÃ§Ã£o de adesÃ£o de colaboradores</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                Membros mais antigos do time sentem extrema dificuldade em preencher relatÃ³rios, centralizar conversas e usar a nova wiki corporativa. Atuamos com paciancia tÃ©cnico-metodolÃ³gica.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">03 // FALTA DE TEMPO DA GESTaO DE TOPO</span>
              <h4 className="text-white font-display font-black text-sm uppercase">Fundadores exaustos de fiscalizar o fluxo</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                Sua diretoria de sÃ³cios nÃ£o possui disponibilidade semanal para cobrar a conduta das regras dos setores na ponta do cronograma. NÃ³s assumimos essa responsabilidade tÃ¡tica.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">04 // EVAPORAÃ‡ÃƒO SILENCIOSA DO MÃ‰TODO</span>
              <h4 className="text-white font-display font-black text-sm uppercase">A nova cultura evapora gradualmente</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                A euforia das primeiras duas semanas de playbooks passa, e o time lentamente retorna ao caos e Ã s conversas sem rumo por falta de fiscalizaÃ§Ã£o sÃ©ria recorrente. Proteja seu investimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - DELIVERABLES PILARES (The "What" with Clean Features Grid) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-bold">PILARES DE ATIVaÃ§Ã£o PRaTICA SaNIOR</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">COMO NOSSA ATIVaÃ§Ã£o CONDUZ SEU TIME</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Agimos como um vetor ativo de disciplina. Treinamos, testamos na rotina fatica e cobramos a consolidaÃ§Ã£o da nova rotina com o foco na autonomia plena.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Zap className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">ImplantaÃ§Ã£o Imediata</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Organizamos ritos prÃ¡ticos de introduÃ§Ã£o por meio de checklists dinÃ¢micos no dia a dia do colaborador, vinculando as wikis aos cards de tarefas reais de forma rÃ¡pida.
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
                  Workshops interativos em vÃ­deo com o time focado no uso das ferramentas, gravaÃ§Ã£o de dÃºvidas conceituais das wikis, e preenchimento de mÃ©tricas comerciais de rotina operacional.
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
                  Analises de adesÃ£o periÃ³dicas no cronograma das wikis. DestacÃ³mos condutas exemplares e auxiliamos os colaboradores com dificuldades tÃ©cnicas no funil operacional da empresa.
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
                  A rotina pratica esbarra em atritos inevitaveis. Customizamos e polimos as regras e os playbooks de forma orgÃ¢nica de acordo com o crescimento real das suas divisaes tÃ¡ticas.
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
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">BENEFaCIOS DA GOVERNANaA ATIVA</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Garanta que sua empresa funcione de forma automatizada sob padrÃµes estruturados de excelÃªncia, sem depender do monitoramento microgerenciado dos sÃ³cios.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-5 bg-zinc-900/40 border border-white/[0.03] rounded-3xl space-y-2">
              <CheckSquare className="w-5 h-5 text-brand" />
              <h4 className="text-white font-display font-black text-sm uppercase">Aprendizado Pratico</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">O time aprende engajado em sessÃµes assistidas rÃ¡pidas diretamente nas rotinas de tarefas da empresa.</p>
            </div>
            <div className="p-5 bg-zinc-900/40 border border-white/[0.03] rounded-3xl space-y-2">
              <CheckSquare className="w-5 h-5 text-brand" />
              <h4 className="text-white font-display font-black text-sm uppercase">Precedancia e Ordem</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">EstruturaÃ§Ã£o de prazos claros unificados baseados em checklists transparentes a vista de toda a equipe.</p>
            </div>
            <div className="p-5 bg-zinc-900/40 border border-white/[0.03] rounded-3xl space-y-2">
              <CheckSquare className="w-5 h-5 text-brand" />
              <h4 className="text-white font-display font-black text-sm uppercase">Sustentabilidade Core</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">Garantimos a fiscalizaÃ§Ã£o contÃ­nua das regras tÃ¡ticas sem gastar o cronograma pessoal semanal dos fundadores.</p>
            </div>
            <div className="p-5 bg-zinc-900/40 border border-white/[0.03] rounded-3xl space-y-2">
              <CheckSquare className="w-5 h-5 text-brand" />
              <h4 className="text-white font-display font-black text-sm uppercase">Cultura de Autonomia</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">Os manuais permanecem vivos, sofrendo polimentos constantes tÃ¡ticos para guiar novos crescimentos futuros.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - TRUST CORE BAR */}
      <section className="px-4 sm:px-6 md:px-8 py-10 border-b border-white/[0.04] bg-charcoal-900/40 text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-3xl">
            <h4 className="text-white font-display font-black text-sm uppercase tracking-tight">O FIM DA CENTRALIZaÃ§Ã£o DESESPERADA</h4>
            <p className="text-zinc-400 text-xs font-sans font-medium leading-relaxed">
              O Process Activation cria a verdadeira cultura operacional de autonomia. Traga a seguranÃ§a intelectual de que o seu time consegue conduzir com maestria as atividades de venda, suporte e faturamento na sua ausancia.
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
        title="Garantia de AdesÃ£o e Disciplina Operacional"
        subtitle="Times integrados que atingiram 100% de conformidade com seus novos playbooks tÃ¡ticos sob a metodologia de ativaÃ§Ã£o da TAG08."
        badge="ACTIVATION PROOF // ADOaaO REAL DE PROCESSOS"
      />

      {/* OPERATIONS / PROCESS ACTIVATION CLIENTS LOGO SOCIAL PROOF */}
      <MiniCases 
        onNavigate={onNavigate} 
        title="Garantia de AdesÃ£o e Disciplina Operacional"
        subtitle="Times integrados que atingiram 100% de conformidade com seus novos playbooks tÃ¡ticos sob a metodologia de ativaÃ§Ã£o da TAG08."
        badge="ACTIVATION PROOF // ADOaaO REAL DE PROCESSOS"
      />

      {/* INTERACTIVE INNOVATION: SIMULADOR DE MATURIDADE OPERACIONAL & CRONOGRAMA */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-950 text-left relative overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-brand/[0.01] rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              METODOLOGIA ATIVA // ROADMAP DE EXECUÃ‡ÃƒO
            </span>
            <h2 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
              Simulador de Maturidade Operacional e Cronograma
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
              O sucesso de uma automaÃ§Ã£o corporativa nÃ£o depende do software, mas da adesÃ£o do time. Identifique abaixo o nÃ­vel de maturidade atual da sua operaÃ§Ã£o e visualize o plano de cronograma exato para ativaÃ§Ã£o e integraÃ§Ã£o de playbooks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Controls */}
            <div className="lg:col-span-5 bg-charcoal-900/60 border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-6">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold block pb-3 border-b border-white/[0.05]">
                  NÃ­vel de Maturidade Atual:
                </span>

                {/* Level Selectors */}
                {[
                  { id: "bronze", name: "Bronze // OperaÃ§Ã£o Caatica", desc: "Processos na cabeÃ§a das pessoas, planilhas desorganizadas, WhatsApp misturado e fundadores como gargalo diario de dÃºvidas." },
                  { id: "prata", name: "Prata // OrganizaÃ§Ã£o Loose", desc: "Alguns playbooks escritos mas desatualizados, ferramentas como Trello e Notion com uso inconsistente pela equipe." },
                  { id: "ouro", name: "Ouro // AutomaÃ§Ã£o Pronta", desc: "Deseja integrar sistemas em tempo real (CRMs, ERPs, Chatbots) e certificar que o time execute tudo sem atrito." }
                ].map((lvl) => {
                  const isSelected = lvl.id === "bronze";
                  return (
                    <button
                      key={lvl.id}
                      id={"btn-lvl-" + lvl.id}
                      onClick={() => {
                        (window as any)._activeLvl = lvl.id;
                        document.querySelectorAll(".lvl-btn").forEach((btn: any) => {
                          btn.className = "lvl-btn p-4 rounded-xl text-left border relative transition-all cursor-pointer " + 
                            (btn.id === "btn-lvl-" + lvl.id ? "bg-brand-secondary/5 border-brand-secondary text-white" : "bg-white/[0.01] border-white/5 text-zinc-400 hover:border-white/10");
                        });
                        // Trigger calculation
                        (window as any)._updateRoadmap && (window as any)._updateRoadmap();
                      }}
                      className={`lvl-btn p-4 rounded-xl text-left border relative transition-all cursor-pointer ${
                        isSelected ? "bg-brand-secondary/5 border-brand-secondary text-white" : "bg-white/[0.01] border-white/5 text-zinc-400 hover:border-white/10"
                      }`}
                    >
                      <h4 className="text-white text-xs sm:text-sm font-semibold uppercase leading-tight">{lvl.name}</h4>
                      <p className="text-zinc-500 text-[10px] mt-1 leading-snug">{lvl.desc}</p>
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
                  Nossa equipe nÃ£o entrega apenas manuais estÃ¡ticos em PDF que ninguÃ©m lÃª. NÃ³s conduzimos as sessÃµes, gravamos treinamentos curtos, estruturamos ferramentas e auditamos a execuÃ§Ã£o por 30 dias para garantir adoÃ§Ã£o real de 100% do time.
                </p>
              </div>
            </div>

            {/* Timeline Panel */}
            <div className="lg:col-span-7 bg-[#09090b] border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-6 w-full">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold block">
                    Plano de Cronograma e Entregas de AtivaÃ§Ã£o:
                  </span>
                  <span id="roadmap-duration" className="font-sans text-[9.5px] text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded font-black">
                    DURaÃ§Ã£o: 4 SEMANAS
                  </span>
                </div>

                {/* Vertical Timeline Steps */}
                <div className="space-y-4">
                  {[
                    { step: "FASE 1", title: "Mapeamento e DiagnÃ³stico ClÃ­nico", desc: "Entrevistas individuais com o time, catalogaÃ§Ã£o de gargalos de tempo e desenho do mapa de processos inicial.", badge: "W1 - W2" },
                    { step: "FASE 2", title: "Escrita de Playbooks e CriaÃ§Ã£o de Wikis", desc: "EstruturaÃ§Ã£o das wikis de ferramentas, senhas de equipe, roteiros de onboarding e criaÃ§Ã£o de playbooks visuais e intuitivos.", badge: "W2 - W3" },
                    { step: "FASE 3", title: "AutomaÃ§Ã£o Operacional e Treinamentos", desc: "SessÃµes dinÃ¢micas de handoff com toda a equipe, ajustes ao vivo nos sistemas, gravaÃ§Ã£o de vÃ­deos curtos explicativos de 3 minutos.", badge: "W3 - W4" },
                    { step: "FASE 4", title: "Auditoria Ativa e Garantia de AdoÃ§Ã£o", desc: "ReuniÃµes semanais de auditoria para verificar a disciplina das planilhas, CRM e n8n, refinando processos conforme o uso prÃ¡tico.", badge: "W4" }
                  ].map((phase, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-start gap-4 hover:border-brand/20 transition-all">
                      <div className="font-sans text-[8.5px] font-black text-brand bg-brand/5 border border-brand/10 rounded px-2.5 py-1 shrink-0 mt-0.5">
                        {phase.step}
                      </div>
                      <div className="space-y-1 text-left">
                        <div className="flex items-center justify-between">
                          <h4 id={`phase-title-${idx}`} className="text-white text-xs sm:text-sm font-bold uppercase leading-tight">
                            {phase.title}
                          </h4>
                          <span id={`phase-badge-${idx}`} className="text-[9px] font-sans text-zinc-500 font-bold">
                            {phase.badge}
                          </span>
                        </div>
                        <p id={`phase-desc-${idx}`} className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-sans">
                          {phase.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* JS Dynamic logic for activation roadmap */}
              <script dangerouslySetInnerHTML={{
                __html: `
                  (function() {
                    window._updateRoadmap = function() {
                      const lvl = window._activeLvl || "bronze";
                      const durEl = document.getElementById("roadmap-duration");
                      
                      const t0 = document.getElementById("phase-title-0");
                      const d0 = document.getElementById("phase-desc-0");
                      const b0 = document.getElementById("phase-badge-0");

                      const t1 = document.getElementById("phase-title-1");
                      const d1 = document.getElementById("phase-desc-1");
                      const b1 = document.getElementById("phase-badge-1");

                      const t2 = document.getElementById("phase-title-2");
                      const d2 = document.getElementById("phase-desc-2");
                      const b2 = document.getElementById("phase-badge-2");

                      const t3 = document.getElementById("phase-title-3");
                      const d3 = document.getElementById("phase-desc-3");
                      const b3 = document.getElementById("phase-badge-3");

                      if (lvl === "bronze") {
                        if (durEl) durEl.innerText = "DURaÃ§Ã£o: 4 SEMANAS";
                        if (t0) t0.innerText = "Mapeamento e Diagnastico Clanico";
                        if (d0) d0.innerText = "Entrevistas com equipe de holding e comercial, catalogaÃ§Ã£o de gargalos de tempo e desenho do mapa inicial.";
                        if (b0) b0.innerText = "Semana 1";

                        if (t1) t1.innerText = "Escrita de Playbooks e CriaÃ§Ã£o de Wikis";
                        if (d1) d1.innerText = "EstruturaÃ§Ã£o das wikis de ferramentas, senhas de equipe, roteiros de onboarding e criaÃ§Ã£o de playbooks visuais no Notion.";
                        if (b1) b1.innerText = "Semana 2";

                        if (t2) t2.innerText = "SessÃµes Ativas e Treinamentos Curtos";
                        if (d2) d2.innerText = "SessÃµes dinÃ¢micas de handoff com toda a equipe, gravaÃ§Ã£o de vÃ­deos curtos explicativos de 3 minutos para fixaÃ§Ã£o.";
                        if (b2) b2.innerText = "Semana 3";

                        if (t3) t3.innerText = "Auditoria de Disciplina e AdesÃ£o";
                        if (d3) d3.innerText = "Auditoria ativa diÃ¡ria para verificar conformidade com planilhas, novos canais e fluxos, ajustando atritos prÃ¡ticos.";
                        if (b3) b3.innerText = "Semana 4";
                      } else if (lvl === "prata") {
                        if (durEl) durEl.innerText = "DURaÃ§Ã£o: 6 SEMANAS";
                        if (t0) t0.innerText = "Inventario de Sistemas e Auditoria de Processos";
                        if (d0) d0.innerText = "Mapeamento das ferramentas ativas (CRMs, Trello, Planilhas), identificaÃ§Ã£o de dados duplicados e furos de follow-up.";
                        if (b0) b0.innerText = "Semana 1 - 2";

                        if (t1) t1.innerText = "ReestruturaÃ§Ã£o e AtualizaÃ§Ã£o de Wikis";
                        if (d1) d1.innerText = "ConsolidaÃ§Ã£o de uma Wiki Central soberana e reformulaÃ§Ã£o de fluxos confusos. Limpeza de checklists antigos.";
                        if (b1) b1.innerText = "Semana 2 - 3";

                        if (t2) t2.innerText = "IntegraÃ§Ã£o de Alertas e AutomaÃ§Ã£o Basica";
                        if (d2) d2.innerText = "CriaÃ§Ã£o de automaÃ§Ãµes leves de notificaÃ§Ã£o por WhatsApp/Slack para alerts urgentes de leads abandonados.";
                        if (b2) b2.innerText = "Semana 4 - 5";

                        if (t3) t3.innerText = "Simulados PrÃ¡ticos de AtivaÃ§Ã£o";
                        if (d3) d3.innerText = "Treinamento intensivo da equipe comercial sob cenÃ¡rios reais, certificando adoÃ§Ã£o de 100% das novas regras de CRM.";
                        if (b3) b3.innerText = "Semana 6";
                      } else {
                        if (durEl) durEl.innerText = "DURaÃ§Ã£o: 8 SEMANAS";
                        if (t0) t0.innerText = "Arquitetura de Dados e Blueprint API";
                        if (d0) d0.innerText = "Desenho tÃ©cnico do fluxo de informaÃ§Ãµes entre ERP, CRMs, WhatsApp Cloud API e banco de dados analÃ­tico.";
                        if (b0) b0.innerText = "Semana 1 - 2";

                        if (t1) t1.innerText = "Desenvolvimento de AutomaÃ§Ãµes Nativas (n8n/Make)";
                        if (d1) d1.innerText = "CodificaÃ§Ã£o e desenvolvimento dos fluxos de integraÃ§Ã£o automÃ¡tica, Webhooks e gatilhos de sincronizaÃ§Ã£o constante.";
                        if (b1) b1.innerText = "Semana 3 - 5";

                        if (t2) t2.innerText = "Simulados e Tratamento de Erros";
                        if (d2) d2.innerText = "Fase de testes de estresse, implementaÃ§Ã£o de alertas de erro automÃ¡ticos e manuais de contingÃªncia operacional.";
                        if (b2) b2.innerText = "Semana 6 - 7";

                        if (t3) t3.innerText = "Handoff TÃ©cnico e AtivaÃ§Ã£o Operacional";
                        if (d3) d3.innerText = "Entrega dos fluxogramas, documentaÃ§Ã£o de APIs, painel de monitoramento e treinamento do encarregado interno de sistemas.";
                        if (b3) b3.innerText = "Semana 8";
                      }
                    };
                    setTimeout(() => {
                      window._updateRoadmap && window._updateRoadmap();
                    }, 500);
                  })();
                `
              }} />

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 mt-6">
                <span className="font-sans text-[8px] text-zinc-600">PROCESSO REGULADO SOB CONFORMIDADE OPERACIONAL ISO 9001 // 2026</span>
                <button 
                  onClick={() => onNavigate("/contato")}
                  className="text-xs font-mono text-brand font-black uppercase hover:underline flex items-center gap-1.5 cursor-pointer focus:outline-none"
                >
                  Cronometrar Minha AtivaÃ§Ã£o <ArrowRight className="w-3.5 h-3.5" />
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
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
              alt="TAG08 Activation Specialist" 
              className="absolute inset-0 w-full h-full object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[15%] transition-all duration-500 hover:scale-105"
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
                  sustentaÃ§Ã£o_rota_
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  LATENCY: 12MS
                </span>
                <span className="font-mono text-[9px] text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  SaNIOR SECURITY
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
                INTEGRAMOS WORKSHOPS PRaTICOS PARALELOS, CRIAMOS ROTINAS COM CHECKLISTS DIaRIAS DIRETAS NO PAINEL E AUDITAMOS CONTINUAMENTE A ADEsÃ£o DA SUA EQUIPE PARA GERAR AUTONOMIA REAL DAS OPERAÃ§Ãµes.
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
                    GOVERNANaA ATIVA
                  </span>
                  <p className="text-white text-xs leading-snug font-sans font-semibold">
                    Evite manuais de processo engavetados. Sustentamos as regras de trabalho para que o time opere de forma autanoma sem supervisÃ£o.
                  </p>
                </div>
              </div>

              {/* DUAL CLIENT CONNECTION CHANNELS (BR & INT) */}
              <div className="space-y-3">
                <a 
                  href={buildBrazilWhatsAppUrl("Ola,%20gostaria%20de%20solicitar%20um%20diagnÃ³stico%20de%20Process%20Activation%20com%20a%20TAG08")}
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
                          PROPRIETÃRIO DIRETO (WhatsApp)
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
                  OPERaÃ§Ã£o ATIVA 100% online
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOVO BLOCO: PRa-REQUISITOS, O QUE NaO FAZEMOS, CICLO DE AUDITORIA, MATRIZ E CTA */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-zinc-950 text-left">
        <div className="max-w-7xl mx-auto space-y-24">
          
          {/* Pra-requisitos para contrataÃ§Ã£o */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                ALINHAMENTO DE ENTRADA // EXIGaNCIAS PRaVIAS
              </span>
              <h2 className="font-display font-medium text-2xl sm:text-3xl text-gradient">
                Sua empresa esta pronta para a AtivaÃ§Ã£o de Processos?
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                A divisÃ£o de Activation Ã© extremamente realizadora e tÃ¡tica, mas exige que sua empresa preencha critÃ©rios de entrada mÃ­nimos. Sem eles, qualquer esforÃ§o de implantaÃ§Ã£o de auditoria serÃ¡ inofensivo:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { title: "Processos Mapeados", desc: "Sua marca precisa ter manuais, playbooks ou fluxos de trabalho previamente consolidados (caso nÃ£o possua, indicÃ³mos nossa divisÃ£o Process Intelligence)." },
                { title: "Lideranaa Comprometida", desc: "Os diretores e fundadores precisam dar respaldo absoluto de autoridade aos nossos auditores para cobrar a equipe." }
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-charcoal-900 border border-white/[0.04] space-y-2">
                  <h4 className="text-white text-xs sm:text-sm font-display font-medium uppercase tracking-tight text-brand-secondary">{item.title}</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* O que nas NaO fazemos na AtivaÃ§Ã£o */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10 border-t border-white/[0.04]">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-[10px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                LIMITES DE ESCOPO // ATUaÃ§Ã£o PROFISSIONAL
              </span>
              <h3 className="font-display font-medium text-2xl text-white">
                O que NaO esta incluso na AtivaÃ§Ã£o de Processos
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                Nas auditamos, implantamos e cobramos conformidade tÃ©cnica com afinco, mas nÃ£o assumimos atribuiÃ§Ãµes internas que pertencem pura e exclusivamente a sua diretoria:
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { title: "NÃ£o Somos RH do Cliente", desc: "NÃ³s reportamos o nÃ£o cumprimento de processos e erros operacionais, mas demissÃµes, contrataÃ§Ãµes e advertÃªncias legais cabem ao seu RH." },
                { title: "NÃ£o Alteramos Seus Contratos", desc: "NÃ£o fazemos alteraÃ§Ãµes legais em obrigaÃ§Ãµes de trabalho de colaboradores ou fornecedores externos sem sua expressa validaÃ§Ã£o." },
                { title: "NÃ£o Somos Gerentes Permanentes", desc: "Nossa divisÃ£o opera para implantar autonomia. Treinamos seus lÃ­deres internos para que eles assumam a sustentaÃ§Ã£o permanente." },
                { title: "NÃ£o Gerenciamos Suas FinanÃ§as", desc: "Efetuamos auditoria operacional na prestaÃ§Ã£o de contas, mas transferÃªncias bancÃ¡rias e decisÃµes de tesouraria continuam com vocÃª." }
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
                SISTEMA SEMANAL DE CRITaRIOS
              </span>
              <h3 className="font-display font-medium text-2xl text-white">
                O funcionamento prÃ¡tico do nosso Ciclo Mensal e Semanal
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed max-w-2xl">
                A adesÃ£o aos manuais do seu negÃ³cio ocorre por insistÃªncia e constÃ¢ncia analÃ­tica. Nosso time executa um cronograma estÃ¡vel e repetitivo nos bastidores:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              {[
                { title: "1. Monitoramento Ativo", desc: "Nossos auditores extraem diariamente relatÃ³rios de sistemas (Notion, Trello, CRM, etc.) para verificar conformidade tÃ¡tica." },
                { title: "2. CobranÃ§a e Apoio", desc: "Colaboradores com atraso recebem alertas e suporte rÃ¡pido para esclarecer possÃ­veis dÃºvidas sistÃªmicas." },
                { title: "3. Briefing de Resultados", desc: "ReuniÃ£o rÃ¡pida semanal com a diretoria para relatar o cumprimento exato dos indicadores de aderÃªncia dos times." },
                { title: "4. Calibragem Mensal", desc: "Encontros de fim de ciclo para ajustar fluxos que geram ruÃ­do estrutural ou gargalos operacionais frequentes." }
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
                Operamos integrados, mas as fronteiras de decisÃ£o precisam estar desenhadas com absoluta clareza tÃ©cnica:
              </p>
            </div>

            <div className="border border-white/[0.06] rounded-2xl overflow-hidden divide-y divide-white/[0.06] bg-charcoal-900/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 font-mono text-[10px] text-zinc-500 uppercase tracking-wider bg-white/[0.01]">
                <div>Esfera de AtuaÃ§Ã£o TAG08</div>
                <div>Esfera de AtuaÃ§Ã£o do Cliente</div>
              </div>

              {[
                { col1: "Auditoria contÃ­nua de adesÃ£o aos manuais operacionais cadastrados.", col2: "Atendimento ou execuÃ§Ã£o direta das tarefas operacionais cotidianas." },
                { col1: "Alertas de atraso e notificaÃ§Ãµes individuais de inconformidade tÃ¡tica.", col2: "SanÃ§Ãµes oficiais de RH, reuniÃµes de advertÃªncia ou demissÃµes." },
                { col1: "CriaÃ§Ã£o de sessÃµes explicativas adicionais de sistemas se necessÃ¡rio.", col2: "Disponibilizar tempo dos times para as reuniÃµes de alinhamento." },
                { col1: "Garantir notas mensais agregadas de qualidade operacional por Ã¡rea.", col2: "Definir metas comerciais sÃªniores e direcionar investimentos do negÃ³cio." }
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
              <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-black block">CRITÃ‰RIO DE ESCOLHA OPERACIONAL</span>
              <h4 className="text-white font-display font-medium text-lg uppercase">Quando contratar nossa ativaÃ§Ã£o sÃªnior?</h4>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                Se sua empresa jÃ¡ ultrapassou o faturamento bruto anual de R$ 300k, possui mais de 4 pessoas na operaÃ§Ã£o, mas vocÃª sente que, como fundador, continua preso no operacional de microgerenciamento de tarefas bÃ¡sicas e cobranÃ§as redundantes todos os dias, a TAG08 Activation Ã© o encaixe operacional perfeito para a libertaÃ§Ã£o estratÃ©gica de seu tempo de negÃ³cios.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-end">
              <span className="font-sans text-[10px] text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/15 px-4 py-2 rounded-xl">
                ESTRUTURA DE AUDITORIA ATIVA
              </span>
            </div>
          </div>

          {/* CTA para AtivaÃ§Ã£o */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
            <div className="space-y-1">
              <h3 className="font-display font-semibold text-lg text-white">Sua equipe precisa de acompanhamento operacional sÃªnior?</h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans max-w-xl leading-relaxed">
                Fale com nossos engenheiros de processos e agende um diagnÃ³stico sobre a atual taxa de adesÃ£o a manuais e playbooks da sua empresa.
              </p>
            </div>
            <button
              onClick={() => {
                onNavigate("/contato");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-6 py-4 bg-brand-secondary hover:bg-brand-dark text-black text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shrink-0"
            >
              Auditar AdesÃ£o de Processos
            </button>
          </div>

        </div>
      </section>

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
                  DaVIDAS &amp; <br />
                  ATIVaÃ§Ã£o PRaTICA
                </h2>
                <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans max-w-sm">
                  Esclareaa as principais dÃºvidas sobre como nossa metodologia ativa os playbooks estruturais na rotina real dos colaboradores.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {([
                  { id: 0, title: "REQUISITO INTELLIGENCE" },
                  { id: 1, title: "ENGANJAMENTO DO TIME" },
                  { id: 2, title: "SISTEMAS DE AUDITORIA" },
                  { id: 3, title: "PERaODO DE SUSTENTaÃ§Ã£o" }
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
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                alt="TAG08 Process Activation"
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
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
                    "PERaODO DE SUSTENTaÃ§Ã£o"
                  ])[activeFaq]}
                </span>
                
                <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {([
                    "Posso contratar o Activation sem o Intelligence?",
                    "Como vocÃªs engajam a equipe na nova cultura?",
                    "Quem audita o cumprimento dos fluxos?",
                    "Qual o perÃ­odo de sustentaÃ§Ã£o supervisionada?"
                  ])[activeFaq]}
                </h4>
                
                <p className="text-zinc-300 text-xs sm:text-[12.5px] leading-relaxed font-sans font-medium">
                  {([
                    "NÃ£o. O Process Activation exige a conclusÃ£o prÃ©via do Process Intelligence. NÃ£o implantamos manuais sem os playbooks e as wikis estarem estruturados e organizados sob nossa aprovaÃ§Ã£o de calibre tÃ©cnico.",
                    "Promovemos workshops dinÃ¢micos assistidos voltados ao uso correto das ferramentas, criamos rotinas com checklists visuais de tarefas diÃ¡rias e conectamos as bases de senhas diretas Ã  mesa de trabalho produtiva de cada colaborador.",
                    "Nossa assessoria sÃªnior realiza vistorias periÃ³dicas de conformidade diretamente nos painÃ©is digitais, quantifica a adesÃ£o operacional da equipe e auxilia individualmente colaboradores que demonstrem gargalos de ritmo ou aprendizagem.",
                    "O programa dura em mÃ©dia atÃ© 30 dias de acompanhamento diÃ¡rio ativo, garantindo polimentos finos de playbooks diante de fricÃ§Ãµes do mundo real e gerando a consolidaÃ§Ã£o final da autonomia do seu negÃ³cio."
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
                    Eliminamos o esquecimento operacional e tÃ¡ticas manuais obsoletas. Garantimos sustentaÃ§Ã£o de rotas.
                  </p>
                </div>
                <button
                  onClick={() => handleLinkClick("/servicos")}
                  className="group flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5"
                >
                  <span>Ver ServiÃ§os</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-black/60 uppercase tracking-widest block font-extrabold">FALE COM O DIRETOR</span>
                  <h4 className="text-black font-black text-sm uppercase leading-tight tracking-tight">Quer desenhar uma estratÃ©gia sob medida?</h4>
                  <p className="text-black/85 text-[11.5px] font-semibold leading-relaxed font-mono">
                    Fale diretamente com os tomadores de decisÃ£o da TAG08 via WhatsApp para avaliar a viabilidade de alocaÃ§Ã£o de equipe.
                  </p>
                </div>
                <a
                  href={buildBrazilWhatsAppUrl("Ola,%20gostaria%20de%20consultar%20viabilidade%20estratÃ©gica%20especializada%2520para%20minha%20marca!")}
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
          Evite gastar milhares de reais escrevendo wikis de qualidade para deixa-las engavetadas pegando poeira digital. Fale com nosso diretor de sustentaÃ§Ã£o.
        </p>
        <div className="pt-4">
          <button
            onClick={() => handleLinkClick("/contato")}
            className="group bg-brand text-black font-mono font-black text-[10px] uppercase tracking-widest py-4 px-8 rounded-full shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.22)] hover:bg-brand-dark duration-300 transition-all cursor-pointer flex items-center gap-2 mx-auto"
          >
            <span>DISPARAR ATIVaÃ§Ã£o DE PROCESSOS DE ELITE</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </section>
    </div>
  );
}












