import { useState } from "react";
import { Sparkles, ArrowUpRight, ArrowRight, Layers, FileText, Zap, HelpCircle } from "lucide-react";
import { useReducedMotion } from "motion/react";
import ResilientImage from "../../../components/ResilientImage";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import { buildBrazilWhatsAppUrl } from "../../../config/siteNetwork";
import TrackedOutboundLink from "../../../components/TrackedOutboundLink";

interface SebraetecProps {
  onNavigate: (page: string) => void;
}

export default function Sebraetec({ onNavigate }: SebraetecProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const prefersReducedMotion = useReducedMotion();

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  const faqs = [
    {
      q: "O que é o Programa SEBRAETEC?",
      a: "O SEBRAETEC é um programa do SEBRAE que facilita o acesso de micro e pequenas empresas à inovação e tecnologia. Ele conecta sua empresa a prestadores de serviços tecnológicos e pode oferecer subsídio conforme as regras da região e do projeto."
    },
    {
      q: "Quem pode se beneficiar do subsídio?",
      a: "Em geral, o programa atende Microempreendedores Individuais (MEI), Microempresas (ME) e Empresas de Pequeno Porte (EPP). Os critérios de faturamento, regularidade cadastral e elegibilidade devem ser confirmados com o Sebrae da sua região."
    },
    {
      q: "Quais serviços da TAG08 podem receber o subsídio SEBRAETEC?",
      a: "Os principais serviços cobertos incluem Design de Identidade Visual (Branding Completo), Desenvolvimento de Websites Institucionais, Landing Pages de Conversão, E-commerces Estratégicos, Design de Embalagens e Diagnósticos de Otimização de Processos Digitais."
    },
    {
      q: "Como funciona o fluxo de aprovação?",
      a: "Realizamos uma reunião inicial, estruturamos a proposta técnica conforme as diretrizes aplicáveis e encaminhamos o material ao Sebrae regional. Se o projeto for aprovado, o início, a contrapartida e as demais condições de pagamento seguem o regulamento e o plano aprovados."
    },
    {
      q: "A TAG08 ajuda no processo de solicitação ao Sebrae?",
      a: "Sim, oferecemos suporte consultivo e auxiliamos na estruturação técnica da proposta e na organização dos documentos para avaliação pelo gestor responsável do Sebrae."
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta self-start">
                PARCERIAS E INOVAÇÃO SUBSIDIADA // SEBRAETEC
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter">
                SEBRAETEC + TAG08 <br />
                <span className="text-brand-secondary">Inovação ao seu alcance com subsídio sujeito à aprovação.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-sm leading-relaxed font-sans font-medium">
                Sua empresa pode avaliar projetos de presença digital, branding e processos dentro do programa SEBRAETEC. O percentual de apoio, a elegibilidade e a aprovação dependem do Sebrae regional e do projeto apresentado.
              </p>
            </div>
          </div>

          {/* Banner with absolute interactive overlay triggers */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[4/3] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <ResilientImage
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1280px"
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1600"
                alt="Equipe reunida em uma conversa sobre inovação e negócios"
                fallbackLabel="Inovação aplicada com a TAG08"
                className="object-cover grayscale brightness-40 transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.01]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent pointer-events-none" />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{ transform: "translateZ(45px)" }}>
                <TrackedOutboundLink
                  label="Solicitar consulta subsidiada"
                  surface="sebraetec-hero-cta"
                  href={buildBrazilWhatsAppUrl("Olá,%20gostaria%20de%20saber%20como%20utilizar%20o%20subsídio%20do%20SEBRAETEC%20com%20a%20TAG08!")}
                  target="_blank"
                  rel="noreferrer"
                  className="group min-h-11 bg-brand-secondary text-black font-sans font-black text-xs uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] motion-safe:hover:scale-105 transition-[background-color,box-shadow,transform] duration-200 border border-brand-secondary hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-black flex items-center gap-2 cursor-pointer z-20"
                >
                  <span>SOLICITAR CONSULTA SUBSIDIADA</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </TrackedOutboundLink>
              </div>

              {/* Absolutes tags in corners */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="tag08-meta text-xs text-brand-secondary tracking-widest block uppercase font-bold">TAG08 HUB INTEGRADO</span>
                  <p className="font-display font-black text-white text-xs sm:text-sm tracking-tight leading-none">Inovação tecnológica com direção</p>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-xs text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand motion-safe:animate-pulse" aria-hidden="true" />
                  <span>PROGRAMA SEBRAETEC</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Variável</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">Percentual de apoio<br/>definido no projeto</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">Definida</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">Contrapartida conforme<br/>as regras aplicáveis</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">MEIs e PMEs</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">MEI, ME e EPP<br/>sujeitos à elegibilidade</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">Completo</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">Branding, Web, Identidade<br/>e processos digitais</span>
            </div>
          </div>

        </div>
      </section>

      {/* WHY SEBRAETEC? */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 text-left relative overflow-hidden">
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/[0.01] rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                VIABILIZAÇÃO // BENEFÍCIOS REAIS
              </span>
              <h2 className="font-display font-medium text-3xl text-white tracking-tight">
                Por que usar o Sebraetec em seu projeto?
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                O programa pode reduzir o investimento inicial de pequenos negócios, mas a elegibilidade, o percentual de apoio e a aprovação dependem da análise regional do Sebrae.
              </p>
              
              <div className="p-5 rounded-2xl bg-brand-secondary/[0.01] border border-brand-secondary/5 text-xs text-zinc-400 font-sans">
                <span className="text-brand-secondary font-black uppercase block mb-1">IMPACTO FINANCEIRO:</span>
                Um projeto de R$ 10.000,00 é apenas uma simulação ilustrativa. O valor da contrapartida e a forma de pagamento devem ser confirmados no projeto aprovado.
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {[
                "Acesso a diagnóstico e execução de branding, web e processos dentro de um projeto estruturado.",
                "Proposta técnica organizada para avaliação conforme as diretrizes aplicáveis do Sebrae.",
                "Acompanhamento da documentação e das etapas que dependem do projeto e da região.",
                "Mais clareza para decidir quais frentes de inovação fazem sentido para o momento da empresa.",
                "Uma entrega digital planejada para apoiar a presença e a operação do negócio."
              ].map((benefit, idx) => (
                <div key={idx} className="flex gap-4 items-start p-4 rounded-2xl bg-charcoal-900 border border-white/[0.03] hover:border-white/[0.06] transition-[border-color] duration-200">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-secondary shrink-0 shadow-[0_0_8px_var(--color-brand-secondary)]" />
                  <p className="text-zinc-300 text-xs sm:text-sm font-sans font-medium leading-relaxed text-left">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* WHO CAN BENEFIT SEBRAETEC */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-12 border-t border-white/[0.04]">
            <div className="lg:col-span-4 space-y-4">
              <span className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest block font-bold">REQUISITOS OPERACIONAIS</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white leading-none tracking-tight">
                SUA MARCA ESTÁ APTA <span className="text-brand">AO SUBSÍDIO SEBRAETEC?</span>
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Verifique os critérios básicos estabelecidos para faturamento e documentação exigidos para protocolar seu projeto.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl space-y-2 transition-[border-color] duration-200">
                <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">01 // PORTE DA EMPRESA</span>
                <h3 className="text-white font-display font-bold text-sm">Faturamento regularizado</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Sua empresa precisa estar classificada como MEI, ME (Microempresa) ou EPP (Empresa de Pequeno Porte). Produtores rurais formalizados com inscrição de produtor ativo também podem solicitar.
                </p>
              </div>

              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl space-y-2 transition-[border-color] duration-200">
                <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">02 // DOCUMENTAÇÃO BÁSICA</span>
                <h3 className="text-white font-display font-bold text-sm">Prontidão cadastral</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  É preciso apresentar cartão CNPJ, cópia do contrato social ou CCMEI (no caso de MEI), e certidão negativa de débitos (CND) federais atualizada de forma regular junto aos órgãos de união.
                </p>
              </div>

              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl space-y-2 transition-[border-color] duration-200">
                <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">03 // LIMITE DO SUBSÍDIO</span>
                <h3 className="text-white font-display font-bold text-sm">Cotações por CNPJ</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Cada CNPJ pode ter um limite financeiro anual que varia por região. A possibilidade de sequenciar projetos deve ser confirmada com o Sebrae responsável.
                </p>
              </div>

              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl space-y-2 transition-[border-color] duration-200">
                <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">04 // APOIO COOPERATIVO</span>
                <h3 className="text-white font-display font-bold text-sm">Suporte da equipe técnica</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  A TAG08 acompanha a organização da proposta e dos documentos necessários para avaliação pelos gestores responsáveis do SEBRAE.
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
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-bold">DIVERSIDADE EM SERVIçOS CREDENCIADOS</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">O que você pode criar com a TAG08 via SEBRAETEC</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Utilize o subsídio financeiro do SEBRAE para acessar as maiores linhas de inovação digital e visual disponíveis no mercado moderno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl p-6 space-y-4 group transition-[border-color] duration-200">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Layers className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-display font-bold text-sm">Branding &amp; marca visual</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Criação de logotipo vetorial profissional, reformulação de manual de identidade, escolha unificada de cores institucionais, diagramação de propostas comerciais de luxo e papelaria digital completa.
                </p>
              </div>
            </div>

              <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl p-6 space-y-4 group transition-[border-color] duration-200">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-display font-bold text-sm">Embalagem &amp; design de rótulo</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Criação técnica tridimensional e conceitual de embalagens, rótulos comerciais, caixas de entrega exclusivas e fitas adesivas estéticas para e-commerces que precisam reter a valorização do cliente.
                </p>
              </div>
            </div>

              <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl p-6 space-y-4 group transition-[border-color] duration-200">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Zap className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-display font-bold text-sm">Websites &amp; landing pages</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Desenvolvimento sob medida de sites corporativos de alta performance, landing pages otimizadas de captura de leads estruturadas sem templates repetitivos de mercado e com código leve.
                </p>
              </div>
            </div>

              <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl p-6 space-y-4 group transition-[border-color] duration-200">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <FileText className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-display font-bold text-sm">E-commerces &amp; sistemas</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Lojas virtuais elegantes integradas de ponta a ponta com gateways de pagamento seguros, sistemas consultivos de catálogos interativos estruturados e integrações automatizadas ERP de controle comercial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE INTEGRATION JOURNEY */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-900/30 text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              JORNADA DO CLIENTE // FLUXO SEGURO
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">Como solicitar seu projeto subsidiado passo-a-passo</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Um fluxo rigorosamente estruturado que reduz a burocracia das solicitações do cliente e acelera a formalidade do termo final.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { num: "01", term: "DIAGNÓSTICO INICIAL", desc: "Reunião de alinhamento com a TAG08 para definir o escopo tecnológico ideal para o momento da sua empresa." },
              { num: "02", term: "PROPOSTA TÉCNICA", desc: "Elaboramos o material de projeto, escopo e justificativas para avaliação conforme as diretrizes aplicáveis do Sebraetec." },
              { num: "03", term: "ENVIO & ANÁLISE", desc: "Submetemos o projeto ao Sebrae regional para análise e retorno conforme o fluxo aplicável." },
              { num: "04", term: "EXECUÇÃO DO PROJETO", desc: "Com a aprovação e as condições confirmadas, iniciamos o projeto conforme o escopo acordado." },
              { num: "05", term: "ENTREGA E PRESTAÇÃO DE CONTAS", desc: "Entregamos o projeto e seguimos as etapas de validação e documentação previstas no programa." }
            ].map((step, sIdx) => (
              <div key={sIdx} className="bg-charcoal-900 border border-white/[0.04] p-6 rounded-2xl space-y-4 flex flex-col justify-between relative hover:border-brand/20 transition-[border-color] duration-200">
                <span className="font-display font-black text-3xl text-brand-secondary">{step.num}</span>
                <div className="space-y-1">
                  <h3 className="text-white tag08-meta text-xs tracking-wider font-bold">{step.term}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <TrackedOutboundLink
              label="Iniciar diagnóstico subsidiado"
              surface="sebraetec-diagnostic-cta"
              href={buildBrazilWhatsAppUrl("Olá,%20gostaria%20de%20solicitar%20um%20diagnóstico%20técnico%20para%20o%20SEBRAETEC!")}
              target="_blank"
              rel="noreferrer"
              className="group min-h-11 bg-brand-secondary text-black font-sans font-black text-xs uppercase tracking-widest py-3.5 px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.22)] motion-safe:hover:scale-[1.02] transition-[background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 flex items-center gap-2 cursor-pointer"
            >
              <span>INICIAR DIAGNÓSTICO DE VIABILIDADE</span>
              <ArrowRight className="w-4 h-4" />
            </TrackedOutboundLink>
            <button
              onClick={() => handleLinkClick("/contato")}
              className="min-h-11 text-white hover:text-brand font-sans text-xs uppercase tracking-widest px-6 py-3 transition-colors flex items-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900"
            >
              <span>IR PARA O CONTATO</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="px-4 sm:px-6 md:px-8 py-24 max-w-4xl mx-auto space-y-12 text-left">
        <div className="text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-brand mx-auto" />
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">DÚVIDAS FREQUENTES SOBRE SEBRAETEC</h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-medium">
            Entenda de forma clara e objetiva os principais limites de atuação e solicitação do subsídio.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, fIdx) => (
            <div 
              key={fIdx} 
              className="border border-white/[0.04] bg-charcoal-900 rounded-2xl overflow-hidden hover:border-brand/20 transition-[border-color] duration-200"
            >
              <h3 className="m-0">
                <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === fIdx ? null : fIdx)}
                id={`sebraetec-faq-question-${fIdx}`}
                aria-expanded={activeFaq === fIdx}
                aria-controls={`sebraetec-faq-panel-${fIdx}`}
                className="min-h-11 w-full p-6 text-left flex items-center justify-between text-white font-display font-semibold text-xs sm:text-sm uppercase tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset cursor-pointer"
                >
                <span>{faq.q}</span>
                <span aria-hidden="true" className="text-brand font-sans text-lg shrink-0 ml-4 font-bold">
                  {activeFaq === fIdx ? "−" : "+"}
                </span>
                </button>
              </h3>
              
              {activeFaq === fIdx && (
                <div id={`sebraetec-faq-panel-${fIdx}`} role="region" aria-labelledby={`sebraetec-faq-question-${fIdx}`} className="px-6 pb-6 text-zinc-400 text-xs sm:text-xs font-sans leading-relaxed border-t border-white/[0.02] pt-4">
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
          
          <span className="tag08-meta text-xs text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/20 px-3 py-1 rounded-full uppercase tracking-widest font-black inline-block z-10">
            FALE COM A TAG08 SOBRE A VIABILIDADE
          </span>
          
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tighter leading-tight max-w-3xl mx-auto z-10">
            PRONTO PARA AVALIAR <span className="text-brand-secondary">SEU PROJETO COM O SEBRAETEC?</span>
          </h2>
          
          <p className="text-zinc-400 text-xs sm:text-sm font-medium max-w-2xl mx-auto z-10 leading-relaxed">
            A TAG08 pode ajudar a estruturar o diagnóstico e a proposta técnica. A elegibilidade, o percentual de apoio e a aprovação são definidos pelo Sebrae regional.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 z-10 relative">
            <TrackedOutboundLink
              label="Verificar elegibilidade do projeto"
              surface="sebraetec-final-cta"
              href={buildBrazilWhatsAppUrl("Olá,%20acabei%20de%20acessar%20a%20página%20do%20SEBRAETEC%20e%20gostaria%20de%20verificar%20a%20elegibilidade%20e%20a%20viabilidade%20do%20meu%20projeto%20conforme%20as%20regras%20da%20minha%20região.")}
              target="_blank"
              rel="noreferrer"
              className="group min-h-11 bg-brand-secondary text-black font-sans font-black text-xs uppercase tracking-widest py-4 px-10 rounded-full shadow-[0_20px_50px_rgba(var(--color-brand-secondary-rgb),0.3)] motion-safe:hover:scale-[1.02] transition-[background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 flex items-center gap-2 cursor-pointer"
            >
              <span>VERIFICAR ELEGIBILIDADE DO PROJETO</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </TrackedOutboundLink>
          </div>
        </div>
      </section>

    </div>
  );
}


