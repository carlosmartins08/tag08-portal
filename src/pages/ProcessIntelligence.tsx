import { useState } from "react";
import { AlertCircle, ArrowUpRight, ArrowRight, BarChart, Workflow, FileText, Server, Layers, Cpu, CheckCircle, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl } from "../config/siteNetwork";
import ThreeDimensionalTilt from "../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../components/Subtle3DCanvas";
import MiniCases from "../components/MiniCases";

interface ProcessProps {
  onNavigate: (page: string) => void;
}

export default function ProcessIntelligence({ onNavigate }: ProcessProps) {
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
                DIVIsão DE PROCESSOS E ESTRUTURAS // TAG08
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter uppercase font-display">
                Process Intelligence <br />
                <span className="text-brand">para transformar caos operacional em clareza para crescer.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-sans font-medium">
                Sua empresa atende bem, mas sofre com fricção ou desorganização interna? Mapeamos, diagnosticamos e estruturamos todos os seus departamentos em wikis organizadas e fluxos táticos claros para que seu negócio ganhe autonomia de crescimento contínuo.
              </p>
            </div>
          </div>

          {/* 2. Panoramic Wide Banner Image with capsule neon overlay trigger wrapped in 3D perspective tilt container */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1600"
                alt="Mapeamento de Processos TAG08"
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
                  <span>RESERVAR AUDITORIA</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Absolute indicator tags on corners */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="font-mono text-[8.5px] text-brand-secondary tracking-widest block uppercase font-bold">TAG08 DIAGNOSTIC CONSOLE</span>
                  <h4 className="font-display font-black text-white text-xs sm:text-sm uppercase tracking-tight leading-none">Mapeamento Técnico de Fluxo de Produção</h4>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-[8px] text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>PROC_INTELLIGENCE // ENGAGED</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* 3. High status core statistics row matching screenshot layout */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">4 Semanas</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Mapeamento de Diagnastico<br/>e Entrega dos Playbooks</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">-50%</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Reduaao em Atividades e<br/>Reuniões Caaticas Secundarias</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Wiki</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Centralização das Senhas,<br/>Materiais e Diretrizes de Equipe</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">3x</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Mais Rapidez de Treinamento<br/>para Novos Integrantes</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2 - PAIN DIAGNOSTIC: THE INVISBLE CHAOS CHECKLIST */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-zinc-950 text-left relative overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-brand/[0.015] rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                PATOLOGIAS OPERACIONAIS // DIAGNaSTICO
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-white leading-tight uppercase">
                Sinais invisaveis de "Caos Organizado" na sua empresa
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                Muitas lideranças acreditam que a empresa está funcionando bem apenas porque faturam, ignorando a enorme queima de margem invisível gerada pelo improviso tático:
              </p>
            </div>

            <div className="lg:col-span-1" />

            <div className="lg:col-span-6 space-y-4">
              {[
                { title: "Buscas e Rastreamento Lentos", desc: "Sua equipe perde mais de 20 minutos todos os dias para localizar um arquivo simples, contrato, senha ou instrução básica." },
                { title: "Onboarding Demorado e Doloroso", desc: "Treinar um novo contratado exige longas reuniões manuais guiadas pelos gestores, queimando tempo de liderança sênior." },
                { title: "Dependência Severa de Pessoas-Chave", desc: "Se um funcionário central sênior adoece ou pede demissão, uma parte inteira da sua operação simplesmente colapsa ou para." },
                { title: "Refação Constantemente Ativa", desc: "A mesma tarefa precisa ser refeita múltiplas vezes porque os critérios de qualidade e padrões nunca foram formalizados." }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-charcoal-900 border border-white/[0.04] space-y-1">
                  <h4 className="text-white text-xs sm:text-sm font-display font-medium uppercase tracking-tight flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" /> {item.title}
                  </h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - DELIVERABLES (The "What" with Clean Features Grid) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-bold">ATIVOS TANGaVEIS ENTREGUES DE IMEDIATO</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">O QUE ENTREGAMOS NA NOSSA ASSESSORIA</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Não fazemos relatórios tearicos de 300 páginas que ninguam la. Entregamos ativos de processos prontos para rodar na rotina pratica do seu negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <BarChart className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Diagnastico Amplo</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Auditoria de ferramentas, entrevistas em detalhes com os colaboradores atuais, mensuração estruturada dos pontos cegos e desperdacio de retrabalho corporativo por falta de precedancia.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Workflow className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Mapeamento de Fluxos</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Organização dos organogramas de setores de forma visual no Miro ou Figma. Deixamos transparente o exato fluxo de cada tarefa no comita de decisaes de rotina.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <FileText className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Playbooks Práticos</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Manuais operacionais escritos por departamento (Onboarding, Comercial, Entrega, Suporte) em linguagem extremamente compreensível para treinamento ágil.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Server className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Base No Notion</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Construção de uma wiki corporativa integrada unificando senhas seguras, manuais em vídeo, contatos críticos e links recorrentes para a equipe consultar rápido sem perguntar em e-mails.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - METHODOLOGY FASES (How we build the intelligence) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04] bg-charcoal-900/10 text-left">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-2 max-w-2xl">
            <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-bold">INTEGRIDADE DE CONSTRUaaO DE ATIVOS</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">COMO DESENHAMOS SEUS PROCESSOS</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Nossa intervenaao técnica a estruturada em blocos seguros sem causar paralisações operacionais no seu faturamento diario.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-4">
              <span className="font-sans text-brand text-xs font-black">FASE A // DIAGNaSTICO PROFUNDO</span>
              <h4 className="text-white font-display font-black text-base uppercase leading-none">Mergulho no Cotidiano</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                Analise direta do ecossistema de produtividade, gargalos técnicos e vazamento produtivo por parte da equipe atual através de entrevistas e alocação de tempo real de tarefas.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-4">
              <span className="font-sans text-brand text-xs font-black">FASE B // REDESENHO DE FLUXOS</span>
              <h4 className="text-white font-display font-black text-base uppercase leading-none">A Engenharia do Workflow</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                Organizamos organogramas e precedancias visuais claras, extinguindo redundancias ou esperas longas de validação que paralisam o cronograma de entrega B2B das suas divisaes.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-4">
              <span className="font-sans text-brand text-xs font-black">FASE C // ENTREGA E CENTRALIZação</span>
              <h4 className="text-white font-display font-black text-base uppercase leading-none">Os Playbooks e Wikis Ativos</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                Montagem e refinamento no Notion ou Wiki prapria contendo senhas organizadas, canais, contatos e os playbooks escritos especificamente em linguagem acessavel e legavel de usar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE INNOVATION: CALCULADORA DE GaRGULAS E ROI DE EFICIaNCIA */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-950 text-left relative overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-brand-secondary/[0.01] rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              DIAGNaSTICO FINANCEIRO // CALCULADORA DE DESPERDaCIO
            </span>
            <h2 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
              Calculadora de Desperdacio Operacional e ROI de Processos
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
              Trabalho manual repetitivo drena o foco da sua equipe de vendas e operações. Estime abaixo o tempo perdido com preenchimento manual de planilhas, alertas de CRM ausentes e repetiaao de dados, e descubra o custo financeiro invisível anual que sua holding ou operação esta absorvendo de forma passiva.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Controles de Entrada */}
            <div className="lg:col-span-5 bg-charcoal-900/60 border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-6">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold block pb-3 border-b border-white/[0.05]">
                  Mapeamento da sua Operação:
                </span>

                {/* Slider 1: Colaboradores */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider">
                      Colaboradores Afetados:
                    </label>
                    <span className="text-sm font-sans text-brand-secondary font-black bg-brand-secondary/10 px-2.5 py-0.5 rounded-lg border border-brand-secondary/20">
                      <span id="colab-val">5</span> pessoas
                    </span>
                  </div>
                  <input 
                    type="range" 
                    id="colab-range"
                    min="1" 
                    max="40" 
                    step="1" 
                    defaultValue="5"
                    onChange={() => (window as any)._updateWasteSim && (window as any)._updateWasteSim()}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
                  />
                  <div className="flex items-center justify-between text-[9px] font-sans text-zinc-500">
                    <span>1 pessoa</span>
                    <span>20 pessoas</span>
                    <span>40 pessoas+</span>
                  </div>
                </div>

                {/* Slider 2: Horas Gastas */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider">
                      Tempo perdido por pessoa/dia:
                    </label>
                    <span className="text-sm font-sans text-white font-semibold">
                      <span id="hours-val">2.5</span> horas
                    </span>
                  </div>
                  <input 
                    type="range" 
                    id="hours-range"
                    min="0.5" 
                    max="8.0" 
                    step="0.5" 
                    defaultValue="2.5"
                    onChange={() => (window as any)._updateWasteSim && (window as any)._updateWasteSim()}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                  <div className="flex items-center justify-between text-[9px] font-sans text-zinc-500">
                    <span>30 min (Toleravel)</span>
                    <span>4 horas (Grave)</span>
                    <span>8 horas (Totalmente manual)</span>
                  </div>
                </div>

                {/* Slider 3: Salario Madio */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider">
                      Salario Madio Mensal (R$):
                    </label>
                    <span className="text-sm font-sans text-white font-semibold">
                      R$ <span id="salary-val">4.500</span>
                    </span>
                  </div>
                  <input 
                    type="range" 
                    id="salary-range"
                    min="2000" 
                    max="15000" 
                    step="500" 
                    defaultValue="4500"
                    onChange={() => (window as any)._updateWasteSim && (window as any)._updateWasteSim()}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                  <div className="flex items-center justify-between text-[9px] font-sans text-zinc-500">
                    <span>R$ 2.000</span>
                    <span>R$ 8.500</span>
                    <span>R$ 15.000+</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-2">
                <div className="flex items-center gap-2 text-brand">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider">A Gargula do Trabalho Invisavel</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  Quando um funcionário gasta 2 horas copiando dados de um site para o CRM, gerando PDFs manuais ou formatando propostas de forma desestruturada, o faturamento da empresa perde falado comercial ativo por falta de foco.
                </p>
              </div>
            </div>

            {/* Painel de Resultados */}
            <div className="lg:col-span-7 bg-[#09090b] border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-6 w-full">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold block">
                  Perda Produtiva e ROI Operacional Projetado:
                </span>

                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="font-mono text-[8px] text-zinc-500 uppercase font-black block">Horas Desperdiaadas / Ano</span>
                    <p id="waste-hours" className="text-3xl font-display font-black text-white">3.000h</p>
                    <span className="text-[9px] text-zinc-400 block leading-tight font-sans">
                      Peraodo total do time gasto em tarefas robaticas.
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-brand-secondary/[0.02] border border-brand-secondary/10 space-y-1">
                    <span className="font-mono text-[8px] text-brand-secondary/80 uppercase font-black block">Custo do Desperdacio / Ano</span>
                    <p id="waste-cost" className="text-2xl sm:text-3xl font-display font-black text-brand-secondary">R$ 84.375</p>
                    <span className="text-[9px] text-zinc-400 block leading-tight font-sans">
                      Dinheiro direto perdido pagando tempo improdutivo.
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 space-y-1">
                    <span className="font-mono text-[8px] text-emerald-500/80 uppercase font-black block">Horas Recuperaveis (Anual)</span>
                    <p id="recover-hours" className="text-3xl font-display font-black text-emerald-500">2.400h</p>
                    <span className="text-[9px] text-zinc-400 block leading-tight font-sans">
                      Tempo recuperado para direcionar a atividades de alta receita.
                    </span>
                  </div>
                </div>

                {/* Where is this time going? (Progress breakdown) */}
                <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5 space-y-4 text-xs">
                  <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold block">Gargalos Classicos de Perda Operacional</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-zinc-400">
                    <div className="space-y-1 bg-white/[0.01] p-3 rounded-xl border border-white/[0.02]">
                      <div className="flex items-center justify-between text-[10px] font-sans">
                        <span className="text-white font-bold">1. Atualização Manual de CRM</span>
                        <span>35% do desperdacio</span>
                      </div>
                      <p className="text-[9.5px] leading-tight text-zinc-500">Equipe digitando e colando nomes de leads e telefones de planilhas.</p>
                    </div>

                    <div className="space-y-1 bg-white/[0.01] p-3 rounded-xl border border-white/[0.02]">
                      <div className="flex items-center justify-between text-[10px] font-sans">
                        <span className="text-white font-bold">2. Criação de PDFs e Contratos</span>
                        <span>25% do desperdacio</span>
                      </div>
                      <p className="text-[9.5px] leading-tight text-zinc-500">Escrever contratos copiando dados antigos no Word um por um.</p>
                    </div>

                    <div className="space-y-1 bg-white/[0.01] p-3 rounded-xl border border-white/[0.02]">
                      <div className="flex items-center justify-between text-[10px] font-sans">
                        <span className="text-white font-bold">3. Avisos & Follow-ups Soltos</span>
                        <span>20% do desperdacio</span>
                      </div>
                      <p className="text-[9.5px] leading-tight text-zinc-500">Esquecer de cobrar propostas por falta de lembretes integrados e automáticos.</p>
                    </div>

                    <div className="space-y-1 bg-white/[0.01] p-3 rounded-xl border border-white/[0.02]">
                      <div className="flex items-center justify-between text-[10px] font-sans">
                        <span className="text-white font-bold">4. Transferancia de Arquivos</span>
                        <span>20% do desperdacio</span>
                      </div>
                      <p className="text-[9.5px] leading-tight text-zinc-500">Mover propostas do Drive para o e-mail ou WhatsApp manualmente.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* JS calculation script */}
              <script dangerouslySetInnerHTML={{
                __html: `
                  (function() {
                    window._updateWasteSim = function() {
                      const colabEl = document.getElementById("colab-range");
                      const hoursEl = document.getElementById("hours-range");
                      const salaryEl = document.getElementById("salary-range");

                      const colab = colabEl ? parseInt(colabEl.value) : 5;
                      const hours = hoursEl ? parseFloat(hoursEl.value) : 2.5;
                      const salary = salaryEl ? parseInt(salaryEl.value) : 4500;

                      const colabVal = document.getElementById("colab-val");
                      const hoursVal = document.getElementById("hours-val");
                      const salaryVal = document.getElementById("salary-val");

                      if (colabVal) colabVal.innerText = colab.toString();
                      if (hoursVal) hoursVal.innerText = hours.toFixed(1);
                      if (salaryVal) salaryVal.innerText = salary.toLocaleString("pt-BR");

                      // Math: 22 working days per month, 12 months. Total working hours/year = 22 * 12 * hours * colab
                      const annualWasteHours = Math.round(22 * 12 * hours * colab);
                      // Cost per hour = salary / (22 * 8 working hours per day)
                      const hourlyCost = salary / 176;
                      const annualWasteCost = Math.round(annualWasteHours * hourlyCost);
                      // Recoverable hours = 80% of waste hours
                      const recHours = Math.round(annualWasteHours * 0.8);

                      const whEl = document.getElementById("waste-hours");
                      const wcEl = document.getElementById("waste-cost");
                      const rhEl = document.getElementById("recover-hours");

                      if (whEl) whEl.innerText = annualWasteHours.toLocaleString("pt-BR") + "h";
                      if (wcEl) wcEl.innerText = "R$ " + annualWasteCost.toLocaleString("pt-BR");
                      if (rhEl) rhEl.innerText = recHours.toLocaleString("pt-BR") + "h";
                    };
                    setTimeout(() => {
                      window._updateWasteSim && window._updateWasteSim();
                    }, 500);
                  })();
                `
              }} />

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 mt-6">
                <span className="font-sans text-[8px] text-zinc-600">MaTRICAS BASEADAS EM DIAGNaSTICOS DE EMPRESAS B2B REALIZADOS // 2026</span>
                <button 
                  onClick={() => onNavigate("/contato")}
                  className="text-xs font-mono text-brand font-black uppercase hover:underline flex items-center gap-1.5 cursor-pointer focus:outline-none"
                >
                  Mapear Meus Gargalos <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - TRUST CORE BAR */}
      <section className="px-4 sm:px-6 md:px-8 py-10 border-b border-white/[0.04] bg-charcoal-900/40 text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-3xl">
            <h4 className="text-white font-display font-black text-sm uppercase tracking-tight">AUTONOMIA OPERACIONAL E GOVERNANaA DE VERDADE</h4>
            <p className="text-zinc-400 text-xs font-sans font-medium leading-relaxed">
              O objetivo final a fazer com que sua empresa ganhe autonomia real, permitindo que a equipe execute as entregas sob o mesmo nível rigoroso de qualidade sem que os fundadores precisem ficar vigiando ou ditando cada passo das tarefas.
            </p>
          </div>
          <span className="font-mono text-[8.5px] text-brand-secondary uppercase tracking-widest border border-brand-secondary/20 bg-brand-secondary/5 px-3.5 py-2 rounded-xl shrink-0 font-black">
            PROCESS INTELLIGENCE // TAG08
          </span>
        </div>
      </section>

      {/* OPERATIONS / PROCESSES CLIENTS LOGO SOCIAL PROOF */}
      <MiniCases 
        onNavigate={onNavigate} 
        title="Eficiência Operacional Homologada"
        subtitle="Empresas de escala que reduziram retrabalho e liberaram os fundadores do caos diário com a inteligência de processos da TAG08."
        badge="OPERATIONAL PROOF // PROCESSOS SÁBIOS"
      />

      {/* SECTION - WORK SYSTEM (WhatsApp Neon Callout inspired by screenshot) */}
      <section className="py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          {/* Left Column: Portrait */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[520px]">
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden" />
            <img 
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800" 
              alt="TAG08 Process Specialist" 
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
                  processes_intel
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                  governanaa_atamica_
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
                DESENHAMOS FLUXOS <br />
                E PROTOCOLOS SaRIOS!
              </h2>
              <p className="text-black/85 text-[11px] sm:text-xs max-w-lg leading-relaxed font-sans font-extrabold uppercase">
                ACABE COM A DESORGANIZação DE informações E EQUIPE. DOCUMENTAMOS PLAYBOOKS CIRaRGICOS, REDESENHAMOS WORKFLOWS NO NOTION E LIBERAMOS SUA EMPRESA DA DEPENDaNCIA DE PESSOAS-CHAVE.
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
                    GOVERNANaA PLENA
                  </span>
                  <p className="text-white text-xs leading-snug font-sans font-semibold">
                    Unifique diretrizes operacionais de faturamento, atendimento e onboarding de novos colaboradores em playbooks funcionais legaveis.
                  </p>
                </div>
              </div>

              {/* DUAL CLIENT CONNECTION CHANNELS (BR & INT) */}
              <div className="space-y-3">
                <a 
                  href={buildBrazilWhatsAppUrl("Ola,%20gostaria%20de%20solicitar%20um%20diagnóstico%20de%20Process%20Intelligence%20com%20a%20TAG08")}
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
                          PROPRIETaRIO DIRETO (WhatsApp)
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
                  href={buildInternationalWhatsAppUrl("Hello,%20I%20would%20like%20to%20request%20a%20process%20intelligence%20consultation%20from%20TAG08")}
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

      {/* NOVO BLOCO: CAOS ORGANIZADO, aREAS ESTRUTURADAS, INSUMOS, O QUE FICA, CTA PARA PROCESS ACTIVATION */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-zinc-950 text-left">
        <div className="max-w-7xl mx-auto space-y-24">
          


          {/* areas Estruturadas pelo Projeto */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-10 border-t border-white/[0.04]">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-[10px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                ESCOPO DE MAPEAMENTO
              </span>
              <h3 className="font-display font-medium text-2xl text-white">
                Os pilares operacionais que auditamos e desenhamos
              </h3>
                <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                Não fazemos modelagens teóricas abstratas. Desenhamos fluxos táticos funcionais em todas as frentes cruciais do seu modelo corporativo:
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Funil Comercial & Vendas B2B", desc: "Passo a passo exato do lead recebido, qualificação interna, roteiros de demonstração e transição de fechamento." },
                { title: "Onboarding de Novos Clientes", desc: "Disparo automático de boas-vindas, coleta segura de briefings e configuração de canais contratuais." },
                { title: "Execução & Entrega Técnica", desc: "Cadeia de produção, limites de escopo e fluxos internos de controle de qualidade para evitar perdas de margem." },
                { title: "Administrativo & Financeiro", desc: "Rotinas semanais de faturamento corporativo, cobranças automáticas de inadimplência e conciliações." }
              ].map((area, aIdx) => (
                <div key={aIdx} className="p-5 rounded-2xl bg-charcoal-900 border border-white/[0.04] space-y-1.5">
                  <h4 className="text-white font-display font-bold uppercase tracking-tight text-xs sm:text-sm text-brand">{area.title}</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{area.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* O que precisamos de você (Insumo do Cliente) */}
          <div className="space-y-8 pt-10 border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                ALIANÇA DE TRABALHO // REQUISITOS DE CONTA
              </span>
              <h3 className="font-display font-medium text-2xl text-white">
                O insumo necessário de sua marca no projeto de Inteligência
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed max-w-2xl">
                Nossa entrega metodológica é sênior, mas depende de entrevistas estratégicas básicas com sua liderança para catalogar os processos existentes:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { step: "A", title: "Entrevistas Gravadas de 40 min", desc: "Conversamos individualmente com cada gestor para colher as rotinas reais executadas nos bastidores." },
                { step: "B", title: "Acesso a Manuais Existentes", desc: "Analisamos blocos de anotações antigos, mensagens ou diretrizes informais soltas para consolidação estrita." },
                { step: "C", title: "Gravações Piloto de Tela (Loom)", desc: "Seus operadores gravam tarefas complexas em vídeo curto para podermos estruturar o passo a passo com precisão." }
              ].map((ins, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#0c0c0e] border border-white/[0.04] space-y-3 relative overflow-hidden">
                  <div className="absolute top-2 right-4 font-sans font-black text-white/5 text-4xl">{ins.step}</div>
                  <h4 className="text-white font-display font-bold text-xs sm:text-sm uppercase tracking-tight leading-tight">{ins.title}</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{ins.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* O que resta depois do projeto de Processos */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-10 border-t border-white/[0.04]">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-[10px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                PATRIMaNIO INTELECTUAL // LEGADO REAL
              </span>
              <h3 className="font-display font-medium text-2xl text-white">
                O que de fato fica na sua empresa apas nossa modelagem?
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                Nas não entregamos relatórios frios de consultoria tradicional que viram poeira digital em pastas do Google Drive. Entregamos ativos de processos reais:
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {[
                { title: "Wikis Centrais de Processos", desc: "Seu portal de processos unificado e limpo em plataformas como Notion ou similar, ordenado por departamentos." },
                { title: "Tutoriais Rapidos em Vadeo", desc: "Vadeos curtos anexos gravados explicativos de cada tarefa de sistema para que novos contratados executem sem davidas." },
                { title: "Diagramação de Fluxos Visuais", desc: "Mapas mentais geomatricos que descrevem visualmente quem faz o qua e qual o gatilho de cada decisão." },
                { title: "Checklists Operacionais de Rotina", desc: "Listagem diaria para guiar os operadores, deixando as obrigações absolutamente claras no inacio de cada manha." }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.03] space-y-1">
                  <h4 className="text-white font-display font-bold uppercase tracking-tight text-xs sm:text-sm">{item.title}</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA conectando ao Process Activation */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            <div className="space-y-1.5">
              <h3 className="font-display font-semibold text-lg text-white">Praximo Passo: Implantar com Maestria</h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans max-w-xl leading-relaxed">
                Se os processos forem mapeados mas sua equipe não os seguir, o caos continuara. Conheaa nossa divisão complementar de ativação e auditoria para garantir a adoção.
              </p>
            </div>
            <button
              onClick={() => {
                onNavigate("/servicos/process-activation");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-6 py-4 bg-brand-secondary hover:bg-brand-dark text-black text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shrink-0"
            >
              Conhecer Process Activation
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
                  INTELIGaNCIA
                </h2>
                <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans max-w-sm">
                  Esclareça as principais dúvidas sobre nossa auditoria e mapeamento de inteligência estrutural para sua equipe tática.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {([
                  { id: 0, title: "AUDITORIA DE ROTINA" },
                  { id: 1, title: "ENTREGA DE WIKIS" },
                  { id: 2, title: "ENVOLVIMENTO DO TIME" },
                  { id: 3, title: "ESFORaO DOS FUNDADORES" }
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
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"
                alt="TAG08 Process Intelligence"
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div className="absolute top-6 left-6 z-10 pointer-events-none font-mono text-[8px] text-white/20 uppercase tracking-widest leading-none">
                SYS // PROCESS_INTEL
              </div>

              <div className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left">
                <span className="font-mono text-[8.5px] text-brand uppercase tracking-widest font-black block">
                  {([
                    "AUDITORIA DE ROTINA",
                    "ENTREGA DE WIKIS",
                    "ENVOLVIMENTO DO TIME",
                    "ESFORaO DOS FUNDADORES"
                  ])[activeFaq]}
                </span>
                
                <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {([
                    "Como a feita a auditoria operacional inicial?",
                    "O que a entregue no final do projeto?",
                    "Minha equipe participara do redesenho?",
                    "Qual o tempo de esforço exigido de nossa empresa?"
                  ])[activeFaq]}
                </h4>
                
                <p className="text-zinc-300 text-xs sm:text-[12.5px] leading-relaxed font-sans font-medium">
                  {([
                    "Realizamos um mergulho assistido por meio de entrevistas sigilosas focadas e inspeï¿½ï¿½es cotidianas junto aos responsáveis de setores da sua empresa, identificando redundï¿½ncias, vazamento de energia e ruídos internos de comunicação.",
                    "Entregamos uma Wiki Corporativa personalizada e organizada de forma integrada (geralmente estruturada no Notion ou central da empresa) contendo todos os organogramas interativos de faturamento e manuais práticos de playbooks escritos.",
                    "Sim. Conduzimos reuniões curtas direcionadas com os colaboradores-chave para garantir que os workflows redesenhados condigam plenamente com a realidade operacional, assegurando máxima eficácia de onboarding da equipe futura.",
                    "Muito enxuto. O projeto é projetado para desonerar a agenda dos sócios. Exigimos apenas breves reuniões cirúrgicas de onboarding e validações rápidas semanais de progresso dos playbooks."
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
                    Eliminamos redundancias de tarefas e ruídos diarios internos. Blindamos suas decisaes comerciais.
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
          CONSTRUA UMA ESTRUTURA AUTï¿½NOMA <br />
          <span className="text-brand">QUE OPERA CUMPRINDO PROTOCOLOS SÁBIOS.</span>
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Chega de viver escravizado por dezenas de mensagens caóticas no WhatsApp da equipe. Fale conosco agora e agende sua auditoria diagnóstica operacional.
        </p>
        <div className="pt-4">
          <button
            onClick={() => handleLinkClick("/contato")}
            className="group bg-brand text-black font-mono font-black text-[10px] uppercase tracking-widest py-4 px-8 rounded-full shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.22)] hover:bg-brand-dark duration-300 transition-all cursor-pointer flex items-center gap-2 mx-auto"
          >
            <span>ESTRUTURAR MINHA ROTINA OPERACIONAL</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </section>
    </div>
  );
}










