import { useState } from "react";
import { Sparkles, Trophy, CheckCircle, ArrowUpRight, Shield, ArrowRight, Layers, FileText, Zap, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import ThreeDimensionalTilt from "../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../components/Subtle3DCanvas";
import { buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl } from "../config/siteNetwork";

interface SebraetecProps {
  onNavigate: (page: string) => void;
}

export default function Sebraetec({ onNavigate }: SebraetecProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const faqs = [
    {
      q: "O que é o Programa SEBRAETEC?",
      a: "O SEBRAETEC ? um programa nacional do SEBRAE que visa facilitar o acesso de micro e pequenas empresas ? inova??o e tecnologia. Ele conecta sua empresa a prestadores de servi?os tecnol?gicos registrados, como a TAG08, e subsidia at? 70% ou 80% do valor total do projeto."
    },
    {
      q: "Quem pode se beneficiar do subsídio?",
      a: "Podem participar Microempreendedores Individuais (MEI), Microempresas (ME) e Empresas de Pequeno Porte (EPP) com faturamento anual de até R$ 4,8 milhões e inscrição estadual/municipal regular."
    },
    {
      q: "Quais serviços da TAG08 podem receber o subsídio SEBRAETEC?",
      a: "Os principais serviços cobertos incluem Design de Identidade Visual (Branding Completo), Desenvolvimento de Websites Institucionais, Landing Pages de Conversão, E-commerces Estratégicos, Design de Embalagens e Diagnósticos de Otimização de Processos Digitais."
    },
    {
      q: "Como funciona o fluxo de aprovação?",
      a: "O fluxo é simples: realizamos uma reunião inicial para entender suas necessidades, formulamos a proposta técnica seguindo as diretrizes do Sebraetec, e encaminhamos ao Sebrae regional. Uma vez aprovado pelo Sebrae, o projeto inicia e você paga apenas a contrapartida subsidiada de 20% a 30%."
    },
    {
      q: "A TAG08 ajuda no processo de solicitação ao Sebrae?",
      a: "Sim, oferecemos suporte consultivo completo e auxiliamos na estruturação técnica da proposta e no envio dos documentos ao gestor responsável do Sebrae para acelerar a liberação do seu projeto."
    }
  ];

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Ambient gradients */}
      <div className="absolute top-[8%] left-[-15%] w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] bg-brand/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Floating 3D background elements */}
      <Subtle3DCanvas intensity={1.5} className="absolute right-[-8%] top-[5%] w-[480px] h-[480px] opacity-[0.35] mix-blend-screen hidden lg:block" />

      {/* HERO SECTION */}
      <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono self-start">
                PARCERIAS E INOVA??O SUBSIDIADA // SEBRAETEC
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter uppercase font-display">
                SEBRAETEC + TAG08 <br />
                <span className="text-brand-secondary">Inovação ao seu alcance com até 70% de subsídio.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-sans font-medium">
                Sua empresa pode modernizar a presença digital, reformular o branding e otimizar processos investindo apenas uma fração do custo real. Através do programa SEBRAETEC, o SEBRAE apoia micro e pequenos negócios financiando o desenvolvimento tecnológico executado pela equipe de alta performance da TAG08.
              </p>
            </div>
          </div>

          {/* Banner with absolute interactive overlay triggers */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <img 
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1600"
                alt="Empreendedorismo e inovação subsidiada Sebraetec"
                className="w-full h-full object-cover grayscale brightness-40 group-hover:scale-[1.01] transition-all duration-1000 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent pointer-events-none" />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{ transform: "translateZ(45px)" }}>
                <a
                  href={buildBrazilWhatsAppUrl("Olá,%20gostaria%20de%20saber%20como%20utilizar%20o%20subsídio%20do%20SEBRAETEC%20com%20a%20TAG08!")}
                  target="_blank"
                  rel="noreferrer"
                  className="group bg-brand-secondary text-black font-mono font-black text-[10px] sm:text-[11px] uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] hover:scale-105 duration-300 transition-all border border-brand-secondary hover:bg-brand-dark flex items-center gap-2 cursor-pointer z-20"
                >
                  <span>SOLICITAR CONSULTA SUBSIDIADA</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </a>
              </div>

              {/* Absolutes tags in corners */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="font-mono text-[8.5px] text-brand-secondary tracking-widest block uppercase font-bold">TAG08 HUB INTEGRADO</span>
                  <h4 className="font-display font-black text-white text-xs sm:text-sm uppercase tracking-tight leading-none">Inovação Tecnológica com Direção</h4>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-[8px] text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>SEBRAE_REG // REGISTERED_PROVIDER</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Até 70%</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Fundo Perdido subsidiado<br/>pelo SEBRAE para sua marca</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">20% a 30%</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Sua contrapartida real<br/>para implementar inovação</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">MEIs e PMEs</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Público-alvo oficial<br/>habilitado para o subsídio</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">Completo</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Branding, Web, Identidade<br/>e Otimização de Processos</span>
            </div>
          </div>

        </div>
      </section>

      {/* WHY SEBRAETEC? */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-zinc-950 text-left relative overflow-hidden">
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/[0.01] rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
              <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                VIABILIZA??O // BENEF?CIOS REAIS
              </span>
              <h3 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
                Por que usar o Sebraetec em seu projeto?
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                O maior obstáculo para muitas pequenas empresas investirem em sua transformação digital e posicionamento estético de ponta é o orçamento inicial de capitais circulantes. O SEBRAETEC elimina essa barreira de forma oficial e segura:
              </p>
              
              <div className="p-5 rounded-2xl bg-brand-secondary/[0.01] border border-brand-secondary/5 text-xs text-zinc-400 font-sans">
                <span className="text-brand-secondary font-black uppercase block mb-1">IMPACTO FINANCEIRO:</span>
                Um projeto de prestígio que custaria, por exemplo, R$ 10.000,00 reais passa a exigir um investimento real de cerca de R$ 3.000,00 do empreendedor, com o Sebrae pagando os R$ 7.000,00 restantes direto.
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {[
                "Acesso a metodologias sêniores de branding e desenvolvimento web de preço elevado com custo radicalmente minorado.",
                "Processo formalizado, auditado e com garantias absolutas de entrega fiscalmente limpa decretadas pelo próprio SEBRAE.",
                "Garantia de que você estará trabalhando com uma empresa devidamente credenciada e homologada por critérios rigorosos.",
                "Retorno sobre investimento imediato, permitindo reverter os recursos economizados para campanhas de marketing ou estoque comercial.",
                "Aumento visível da competitividade da sua marca no mercado digital perante grandes concorrentes com orçamento superior."
              ].map((benefit, idx) => (
                <div key={idx} className="flex gap-4 items-start p-4 rounded-2xl bg-charcoal-900 border border-white/[0.03] hover:border-white/[0.06] transition-all">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-secondary shrink-0 shadow-[0_0_8px_var(--color-brand-secondary)]" />
                  <p className="text-zinc-300 text-xs sm:text-sm font-sans font-medium leading-relaxed text-left">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* WHO CAN BENEFIT SEBRAETEC */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-12 border-t border-white/[0.04]">
            <div className="lg:col-span-4 space-y-4">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">REQUISITOS OPERACIONAIS</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-none tracking-tight">
                SUA MARCA ESTҁ APTA <span className="text-brand">AO SUBSҍDIO SEBRAETEC?</span>
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Verifique os critérios básicos estabelecidos para faturamento e documentação exigidos para protocolar seu projeto.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
                <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">01 // PORTE DA EMPRESA</span>
                <h4 className="text-white font-display font-bold text-sm uppercase">Faturamento Regularizado</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Sua empresa precisa estar classificada como MEI, ME (Microempresa) ou EPP (Empresa de Pequeno Porte). Produtores rurais formalizados com inscrição de produtor ativo também podem solicitar.
                </p>
              </div>

              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
                <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">02 // DOCUMENTA??O B?SICA</span>
                <h4 className="text-white font-display font-bold text-sm uppercase">Prontidão Cadastral</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  É preciso apresentar cartão CNPJ, cópia do contrato social ou CCMEI (no caso de MEI), e certidão negativa de débitos (CND) federais atualizada de forma regular junto aos órgãos de união.
                </p>
              </div>

              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
                <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">03 // LIMITE DO SUBSҍDIO</span>
                <h4 className="text-white font-display font-bold text-sm uppercase">Cotações por CNPJ</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Cada CNPJ possui um limite financeiro anual subsidiado (vari?vel por regi?o). ?0 poss?vel acumular e sequenciar diferentes projetos, como Branding primeiro e depois Desenvolvimento Web.
                </p>
              </div>

              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
                <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">04 // APOIO COOPERATIVO</span>
                <h4 className="text-white font-display font-bold text-sm uppercase">Suporte de Equipe Técnico</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Todo o tr?mite, preenchimento das solicita??es burocr?ticas e valida??es t?cnicas com os gestores credenciados do SEBRAE s?o acompanhados lado a lado pelas equipes estrat?gicas da TAG08.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE SOLUTIONS COVERED */}
      <section className="px-4 sm:px-6 md:px-8 py-24 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-bold">DIVERSIDADE EM SERVIçOS CREDENCIADOS</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">O que você pode criar com a TAG08 via SEBRAETEC</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Utilize o subsídio financeiro do SEBRAE para acessar as maiores linhas de inovação digital e visual disponíveis no mercado moderno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Layers className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-bold text-sm uppercase">Branding &amp; Marca Visual</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Criação de logotipo vetorial profissional, reformulação de manual de identidade, escolha unificada de cores institucionais, diagramação de propostas comerciais de luxo e papelaria digital completa.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-bold text-sm uppercase">Embalagem &amp; Design Rótulo</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Criação técnica tridimensional e conceitual de embalagens, rótulos comerciais, caixas de entrega exclusivas e fitas adesivas estéticas para e-commerces que precisam reter a valorização do cliente.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Zap className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-bold text-sm uppercase">Websites &amp; Landing Pages</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Desenvolvimento sob medida de sites corporativos de alta performance, landing pages otimizadas de captura de leads estruturadas sem templates repetitivos de mercado e com código leve.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <FileText className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-bold text-sm uppercase">E-commerces &amp; Sistemas</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Lojas virtuais elegantes integradas de ponta a ponta com gateways de pagamento seguros, sistemas consultivos de catálogos interativos estruturados e integrações automatizadas ERP de controle comercial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE INTEGRATION JOURNEY */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-900/30 text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="font-mono text-[10px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              JORNADA DO CLIENTE // FLUXO SEGURO
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">Como solicitar seu projeto subsidiado passo-a-passo</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Um fluxo rigorosamente estruturado que reduz a burocracia das solicitações do cliente e acelera a formalidade do termo final.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { num: "01", term: "DIAGNÓSTICO INICIAL", desc: "Reunião de alinhamento com a TAG08 para definir o escopo tecnológico ideal para o momento da sua empresa." },
              { num: "02", term: "PROPOSTA TÒ⬰CNICA", desc: "Elaboramos todo o material de projeto, escopo e justificativas em conformidade com as normas do Sebraetec." },
              { num: "03", term: "ENVIO & AN?LISE", desc: "Submetemos o projeto ao SEBRAE para an?lise e emiss?o do termo de concess?o com libera??o do subs?dio." },
              { num: "04", term: "EXECU??O DE ELITE", desc: "Com a anu?ncia oficial, iniciamos o projeto. Entregamos toda a maturidade de design e web da nossa equipe." },
              { num: "05", term: "HOMOLOGA??O", desc: "Voc? recebe o projeto finalizado, pronto e validado em faturamento ativo. O SEBRAE quita a parcela subsidiada." }
            ].map((step, sIdx) => (
              <div key={sIdx} className="bg-charcoal-900 border border-white/[0.04] p-6 rounded-2xl space-y-4 flex flex-col justify-between relative hover:border-brand/20 transition-all duration-300">
                <span className="font-display font-black text-3xl text-brand-secondary">{step.num}</span>
                <div className="space-y-1">
                  <h4 className="text-white font-mono text-[10.5px] uppercase tracking-wider font-bold">{step.term}</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <a
              href={buildBrazilWhatsAppUrl("Olá,%20gostaria%20de%20solicitar%20um%20diagnóstico%20técnico%20para%20o%20SEBRAETEC!")}
              target="_blank"
              rel="noreferrer"
              className="group bg-brand-secondary text-black font-mono font-black text-[10px] uppercase tracking-widest py-3.5 px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.22)] hover:scale-102 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>INICIAR DIAGNÒSTICO SUBSIDIADO</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => handleLinkClick("/contato")}
              className="text-white hover:text-brand font-mono text-[10px] uppercase tracking-widest px-6 py-3 transition-colors flex items-center gap-1 cursor-pointer focus:outline-none"
            >
              <span>FALE POR E-MAIL</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="px-4 sm:px-6 md:px-8 py-24 select-none max-w-4xl mx-auto space-y-12 text-left">
        <div className="text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-brand mx-auto" />
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">DҚVIDAS FREQUENTES SOBRE SEBRAETEC</h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-medium">
            Entenda de forma clara e objetiva os principais limites de atuação e solicitação do subsídio.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, fIdx) => (
            <div 
              key={fIdx} 
              className="border border-white/[0.04] bg-charcoal-900 rounded-2xl overflow-hidden hover:border-brand/20 transition-all duration-300"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === fIdx ? null : fIdx)}
                className="w-full p-6 text-left flex items-center justify-between text-white font-display font-semibold text-xs sm:text-sm uppercase tracking-tight focus:outline-none cursor-pointer"
                aria-expanded={activeFaq === fIdx}
              >
                <span>{faq.q}</span>
                <span className="text-brand font-sans text-lg shrink-0 ml-4 font-bold">
                  {activeFaq === fIdx ? "?? " : "?9"}
                </span>
              </button>
              
              {activeFaq === fIdx && (
                <div className="px-6 pb-6 text-zinc-400 text-[11.5px] sm:text-xs font-sans leading-relaxed border-t border-white/[0.02] pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION CARD */}
      <section className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto pt-8">
        <div className="border border-white/[0.08] bg-gradient-to-br from-charcoal-900 to-black rounded-[32px] p-8 sm:p-12 md:p-16 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-20%] w-[450px] h-[450px] bg-brand/10 blur-[130px] rounded-full pointer-events-none" />
          
          <span className="font-mono text-[9px] text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/20 px-3 py-1 rounded-full uppercase tracking-widest font-black inline-block z-10">
            SOLICITE CONEXÒO COM CONSULTOR ESPECIALISTA
          </span>
          
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tighter leading-tight max-w-3xl mx-auto z-10">
            PRONTO PARA ACELERAR COM <span className="text-brand-secondary">DIRE??O E AT?0 70% DE DESCONTO?</span>
          </h2>
          
          <p className="text-zinc-400 text-xs sm:text-sm font-medium max-w-2xl mx-auto z-10 leading-relaxed">
            Nossos consultores credenciados est?o ? disposi??o de sua marca para dar prioridade e celeridade ao seu diagn?stico cadastral. Pague menos, modernize mais e capte o real potencial comercial do seu CNPJ.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 z-10 relative">
            <a
              href={buildBrazilWhatsAppUrl("Olá,%20acabei%20de%20acessar%20a%20página%20do%20SEBRAETEC%20e%20gostaria%20de%20verificar%20a%20viabilidade%20do%20meu%20CNPJ%20para%20receber%20o%20subsídio!")}
              target="_blank"
              rel="noreferrer"
              className="group bg-brand-secondary text-black font-mono font-black text-[10px] uppercase tracking-widest py-4 px-10 rounded-full shadow-[0_20px_50px_rgba(var(--color-brand-secondary-rgb),0.3)] hover:scale-102 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>VERIFICAR VIABILIDADE DO MEU CNPJ</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}


