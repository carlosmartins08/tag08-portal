import { useState } from "react";
import Image from "next/image";
import { Code2, Smartphone, LineChart, ArrowUpRight, ArrowRight, Layers } from "lucide-react";
import { useReducedMotion } from "motion/react";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import MiniCases from "../../../components/MiniCases";
import TrackedOutboundLink from "../../../components/TrackedOutboundLink";
import { buildBrazilWhatsAppUrl } from "../../../config/siteNetwork";

interface WebProps {
  onNavigate: (page: string) => void;
}

export default function DesenvolvimentoWeb({ onNavigate }: WebProps) {
  const [activeFaq, setActiveFaq] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pb-20 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-[8%] left-[-15%] w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] bg-brand/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle floating 3D element in the background of user focus */}
      <Subtle3DCanvas aria-hidden="true" intensity={1.3} className="absolute right-[-8%] top-[5%] w-[480px] h-[480px] opacity-[0.35] mix-blend-screen hidden lg:block" />

      {/* SECTION 1 - HERO: THE EDITORIAL SYSTEM (Synchronized Style) */}
      <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          {/* 1. Header Typography block (Ref Style: Expert guidance / tailored solution) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 lg:items-center text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta self-start">
                Desenvolvimento Web
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter font-display font-black">
                Sites e estruturas digitais <br />
                <span className="text-brand">com dire&ccedil;&atilde;o, clareza e fun&ccedil;&atilde;o comercial.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-sm leading-relaxed font-sans font-medium">
                A TAG08 desenvolve sites, landing pages, cat&aacute;logos e outras estruturas web para empresas que precisam apresentar melhor sua oferta, organizar informa&ccedil;&otilde;es, facilitar a navega&ccedil;&atilde;o e apoiar a jornada comercial com uma presen&ccedil;a digital pr&oacute;pria.
              </p>
            </div>
          </div>

          {/* 2. Panoramic Wide Banner Image with capsule neon overlay trigger wrapped in 3D perspective tilt container */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <Image
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1600"
                alt="Planejamento e desenvolvimento de estrutura web"
                fill
                priority
                sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1280px) calc(100vw - 4rem), 1152px"
                className="w-full h-full object-cover grayscale brightness-50 transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.01]"
                referrerPolicy="no-referrer"
              />
              {/* Elegant overlay masks */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />

              {/* Glowing neon action button floating inside face banner mimicking "Free Trial" anchor */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{ transform: "translateZ(45px)" }}>
                <TrackedOutboundLink
                  label="Falar com a TAG08"
                  surface="desenvolvimento-web-hero-cta"
                  href={buildBrazilWhatsAppUrl("Ol%C3%A1,%20gostaria%20de%20conversar%20sobre%20um%20projeto%20de%20desenvolvimento%20web%20com%20a%20TAG08")}
                  target="_blank"
                  rel="noreferrer"
                  className="group min-h-11 bg-brand-secondary text-black font-sans font-black text-xs sm:text-xs uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] hover:bg-brand-dark active:scale-[0.98] transition-[background-color,transform] duration-200 border border-brand-secondary flex items-center gap-2 cursor-pointer z-20"
                >
                  <span>FALAR COM A TAG08</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </TrackedOutboundLink>
              </div>

              {/* Absolute indicator tags on corners */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="tag08-meta text-xs text-brand-secondary tracking-widest block uppercase font-bold">Sistema web TAG08</span>
                  <p className="font-display font-black text-white text-xs sm:text-sm tracking-tight leading-none">Estrutura digital com dire&ccedil;&atilde;o e fun&ccedil;&atilde;o</p>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-xs text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>CLAREZA // CREDIBILIDADE</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* 3. High status core statistics row matching screenshot layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Clareza</span>
              <span className="block text-zinc-300 tag08-meta text-xs uppercase tracking-widest leading-normal">Informa&ccedil;&atilde;o organizada para facilitar entendimento da empresa e da oferta.</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">Credibilidade</span>
              <span className="block text-zinc-300 tag08-meta text-xs uppercase tracking-widest leading-normal">Presen&ccedil;a digital coerente com a identidade, o conte&uacute;do e o momento da marca.</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Organiza&ccedil;&atilde;o</span>
              <span className="block text-zinc-300 tag08-meta text-xs uppercase tracking-widest leading-normal">P&aacute;ginas, navega&ccedil;&atilde;o e conte&uacute;dos estruturados com fun&ccedil;&atilde;o definida.</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">Apoio comercial</span>
              <span className="block text-zinc-300 tag08-meta text-xs uppercase tracking-widest leading-normal">Caminhos de contato e pr&oacute;ximos passos integrados &agrave; jornada do visitante.</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2 - PAIN DIAGNOSTIC: METHODOLOGY COMPARATIVE */}
      <section className="px-4 sm:px-6 md:px-8 py-20 border-b border-white/[0.04] bg-charcoal-950 text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Comparativo: Site Bonito x Site Estratégico */}
          <div className="space-y-6">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              Sinais de desalinhamento digital
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight">
              Quando o site deixa de ajudar a marca a ser entendida.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed max-w-xl">
              Muitas empresas possuem um site, mas ainda dificultam a experi&ecirc;ncia de quem procura informa&ccedil;&otilde;es sobre a marca, os servi&ccedil;os ou o pr&oacute;ximo passo. Conte&uacute;do desatualizado, navega&ccedil;&atilde;o confusa, p&aacute;ginas sem fun&ccedil;&atilde;o definida e uma estrutura que n&atilde;o acompanha o neg&oacute;cio s&atilde;o sinais comuns desse desalinhamento.
            </p>
          </div>

          <div className="border border-white/[0.06] rounded-3xl overflow-hidden divide-y divide-white/[0.06] bg-charcoal-900/40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 tag08-meta text-xs text-zinc-300 uppercase tracking-widest bg-white/[0.01]">
              <div>Leitura da experi&ecirc;ncia atual</div>
              <div className="text-brand-secondary">Base digital TAG08</div>
            </div>

            {[
              { bad: "Informa&ccedil;&atilde;o dif&iacute;cil de encontrar", good: "A arquitetura organiza empresa, oferta e pr&oacute;ximos passos para reduzir esfor&ccedil;o de compreens&atilde;o." },
              { bad: "Site que n&atilde;o acompanha o neg&oacute;cio", good: "A estrutura digital &eacute; atualizada para refletir o momento, os servi&ccedil;os e as prioridades atuais da marca." },
              { bad: "P&aacute;ginas sem fun&ccedil;&atilde;o clara", good: "Cada p&aacute;gina &eacute; estruturada com um papel definido dentro da jornada: apresentar, explicar, orientar ou apoiar contato." },
              { bad: "Conte&uacute;do desalinhado", good: "Textos, imagens e chamadas seguem uma mesma l&oacute;gica de posicionamento, informa&ccedil;&atilde;o e experi&ecirc;ncia." }
            ].map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-7 text-xs sm:text-sm text-left">
                <div className="text-zinc-400 font-sans flex gap-3">
                  <span aria-hidden="true" className="text-zinc-300 font-sans font-bold shrink-0">–</span>
                  <span>{row.bad}</span>
                </div>
                <div className="text-zinc-200 font-sans flex gap-3 border-t md:border-t-0 border-white/[0.03] pt-4 md:pt-0">
                  <span aria-hidden="true" className="text-brand-secondary font-sans font-bold shrink-0">+</span>
                  <span>{row.good}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 3 - DELIVERABLES (The "What" with Clean Features Grid) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-bold">O que estruturamos</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">Um site precisa organizar informa&ccedil;&atilde;o, experi&ecirc;ncia e pr&oacute;ximo passo.</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              A TAG08 desenvolve estruturas digitais que organizam informa&ccedil;&atilde;o, conte&uacute;do, navega&ccedil;&atilde;o e pontos de contato para que a marca consiga apresentar melhor sua oferta e orientar a jornada do visitante.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-display font-black text-sm">Arquitetura da informa&ccedil;&atilde;o</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Organiza&ccedil;&atilde;o de p&aacute;ginas, se&ccedil;&otilde;es, menus e conte&uacute;dos para facilitar a localiza&ccedil;&atilde;o das informa&ccedil;&otilde;es e construir uma jornada mais compreens&iacute;vel.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <LineChart className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-display font-black text-sm">Design de interface</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Constru&ccedil;&atilde;o visual das interfaces com hierarquia, legibilidade, responsividade e coer&ecirc;ncia com a <a href="/servicos/branding-identidade" className="text-brand-secondary underline-offset-2 hover:underline">identidade da marca</a>.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-display font-black text-sm">Conte&uacute;do e narrativa</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Estrutura&ccedil;&atilde;o de textos, chamadas e blocos de conte&uacute;do para explicar empresa, oferta, processo, diferenciais e pr&oacute;ximos passos com maior clareza.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Layers className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-display font-black text-sm">Desenvolvimento t&eacute;cnico</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Implementa&ccedil;&atilde;o da estrutura web com aten&ccedil;&atilde;o a responsividade, estabilidade, organiza&ccedil;&atilde;o t&eacute;cnica e experi&ecirc;ncia de navega&ccedil;&atilde;o.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - DIFFERENTIALS DETAILS (Why TAG08 is superior) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04] bg-charcoal-900/10 text-left">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-bold">Crit&eacute;rios t&eacute;cnicos e estrat&eacute;gicos</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">O que torna uma estrutura web mais confi&aacute;vel.</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Um bom site n&atilde;o depende apenas de apar&ecirc;ncia. Ele precisa organizar informa&ccedil;&atilde;o, funcionar em diferentes dispositivos, orientar o visitante e permitir manuten&ccedil;&atilde;o e evolu&ccedil;&atilde;o depois da publica&ccedil;&atilde;o.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-2">
              <h3 className="text-white font-display font-black text-sm">Clareza de navega&ccedil;&atilde;o</h3>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                Menus, se&ccedil;&otilde;es e caminhos organizados para reduzir esfor&ccedil;o e facilitar a localiza&ccedil;&atilde;o das informa&ccedil;&otilde;es.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-2">
              <h3 className="text-white font-display font-black text-sm">Estrutura de conte&uacute;do</h3>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                Textos, chamadas e blocos organizados para apresentar empresa, oferta, contexto e pr&oacute;ximo passo.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-2">
              <h3 className="text-white font-display font-black text-sm">Design responsivo</h3>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                Interfaces preparadas para diferentes tamanhos de tela, preservando legibilidade, hierarquia e navega&ccedil;&atilde;o.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-2">
              <h3 className="text-white font-display font-black text-sm">Base t&eacute;cnica organizada</h3>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                Implementa&ccedil;&atilde;o estruturada para facilitar estabilidade, manuten&ccedil;&atilde;o e evolu&ccedil;&atilde;o do projeto.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-2">
              <h3 className="text-white font-display font-black text-sm">Continuidade de uso</h3>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                Estrutura preparada para receber ajustes, novas p&aacute;ginas, conte&uacute;dos e necessidades futuras quando tecnicamente previsto.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-2">
              <h3 className="text-white font-display font-black text-sm">Acompanhamento de publica&ccedil;&atilde;o</h3>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                Revis&atilde;o da entrega e orienta&ccedil;&otilde;es iniciais para manter a estrutura coerente ap&oacute;s a publica&ccedil;&atilde;o, conforme o escopo contratado.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* SECTION 5 - TRUST CORE BAR */}
      <section className="px-4 sm:px-6 md:px-8 py-10 border-b border-white/[0.04] bg-charcoal-900/40 text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-3xl">
            <h2 className="text-white font-display font-black text-sm tracking-tight">Crit&eacute;rios de confian&ccedil;a</h2>
            <p className="text-zinc-400 text-xs font-sans font-medium leading-relaxed">
              A estrutura web precisa ser compreens&iacute;vel para o visitante, coerente com a marca e funcional para a opera&ccedil;&atilde;o. O objetivo &eacute; construir uma base digital que possa ser usada, mantida e evolu&iacute;da com responsabilidade.
            </p>
          </div>
          <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest border border-brand-secondary/20 bg-brand-secondary/5 px-3.5 py-2 rounded-xl shrink-0 font-black">
            BASE CONFI&Aacute;VEL // TAG08
          </span>
        </div>
      </section>

      <ServiceInsightsBridge
        servicePath="/servicos/desenvolvimento-web"
        onNavigate={onNavigate}
      />

      {/* WEB DEV CLIENTS LOGO SOCIAL PROOF */}
      <MiniCases 
        route="/servicos/desenvolvimento-web"
        onNavigate={onNavigate} 
        title="Projetos que mostram estrutura digital com dire&ccedil;&atilde;o."
        subtitle="A prova de um projeto web n&atilde;o est&aacute; em prometer performance, mas em organizar informa&ccedil;&atilde;o, experi&ecirc;ncia, credibilidade e pr&oacute;ximo passo de forma coerente."
        badge="M&Eacute;TODO EM PR&Aacute;TICA"
      />
      {/* SECTION - WORK SYSTEM */}
      <section className="py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[520px]">
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden" />
            <Image
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
              alt="Profissional em ambiente de desenvolvimento web"
              className="object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[15%] transition-transform duration-200 motion-safe:hover:scale-[1.02]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between items-start">
                <span className="tag08-meta text-xs text-black/55 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-black/10">
                  Sistema de trabalho
                </span>
                <span className="font-sans text-xs text-black/45 tracking-wider">
                  TAG08
                </span>
              </div>
              <div className="space-y-1.5 opacity-25 select-none">
                <div className="font-display font-extrabold text-[1.8rem] text-black/35 tracking-widest leading-none uppercase select-none">
                  trabalho web
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-black/20 tracking-widest leading-none uppercase select-none pl-6">
                  processo claro
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-sans text-xs text-black/45 tracking-wider">
                  ETAPAS ORGANIZADAS
                </span>
                <span className="tag08-meta text-xs text-black/55 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-black/10">
                  CONTEXTO, ESTRUTURA E PUBLICA&Ccedil;&Atilde;O
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 text-left h-full relative z-10 lg:pl-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-black font-semibold">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                </div>
                <span className="tag08-meta text-xs tracking-widest uppercase font-bold text-black/90">
                  Sistema de trabalho
                </span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black leading-[0.9] tracking-tighter font-display">
                Como conduzimos um projeto web.
              </h2>
              <p className="text-black/85 text-xs sm:text-xs max-w-2xl leading-relaxed font-sans font-semibold">
                A TAG08 organiza o desenvolvimento web em etapas claras: entendimento do contexto, arquitetura da informa&ccedil;&atilde;o, defini&ccedil;&atilde;o da experi&ecirc;ncia, desenvolvimento, revis&atilde;o e publica&ccedil;&atilde;o conforme o escopo aprovado.
              </p>
            </div>

            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 max-w-2xl relative overflow-hidden text-left">
              <div aria-hidden="true" className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4 relative z-10">
                {[
                  {
                    title: "Entendimento",
                    text: "Leitura do momento da marca, objetivo da estrutura, p&uacute;blico, conte&uacute;dos necess&aacute;rios e pontos de contato.",
                  },
                  {
                    title: "Estrutura",
                    text: "Organiza&ccedil;&atilde;o de p&aacute;ginas, se&ccedil;&otilde;es, navega&ccedil;&atilde;o, mensagens e pr&oacute;ximos passos antes do desenvolvimento.",
                  },
                  {
                    title: "Design e desenvolvimento",
                    text: "Cria&ccedil;&atilde;o da interface e implementa&ccedil;&atilde;o t&eacute;cnica com aten&ccedil;&atilde;o a responsividade, hierarquia, clareza e estabilidade.",
                  },
                  {
                    title: "Revis&atilde;o e publica&ccedil;&atilde;o",
                    text: "Valida&ccedil;&atilde;o dos conte&uacute;dos, ajustes finais, publica&ccedil;&atilde;o e orienta&ccedil;&otilde;es para continuidade conforme o escopo contratado.",
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                    <h3 className="text-white text-xs sm:text-sm font-display font-bold tracking-tight flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
                      {item.title}
                    </h3>
                    <p className="text-zinc-300 text-xs sm:text-xs leading-relaxed font-sans">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2 relative z-10">
                <TrackedOutboundLink
                  label="WhatsApp oficial"
                  surface="desenvolvimento-web-contact-card"
                  href={buildBrazilWhatsAppUrl("Ol%C3%A1,%20gostaria%20de%20solicitar%20um%20projeto%20de%20Desenvolvimento%20Web%20com%20a%20TAG08")}
                  target="_blank"
                  rel="noreferrer"
                  className="block min-h-11 w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-3 px-4 transition-[background-color] duration-200 group shadow-inner"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col text-left">
                      <span className="tag08-meta text-xs text-zinc-300 uppercase font-black tracking-wider leading-none">
                        WhatsApp oficial
                      </span>
                      <span className="text-white text-xs font-sans font-bold tracking-wider group-hover:text-brand transition-colors mt-0.5">
                        FALAR COM A TAG08
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5] bg-brand rounded-full p-0.5" />
                  </div>
                </TrackedOutboundLink>

                <button
                  type="button"
                  onClick={() => handleLinkClick("/servicos")}
                  className="min-h-11 w-full bg-black/10 hover:bg-black/15 border border-black/10 rounded-2xl py-3 px-4 transition-[background-color] duration-200 group text-left active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col text-left">
                      <span className="tag08-meta text-xs text-black/80 uppercase font-black tracking-wider leading-none">
                        Pr&oacute;ximo passo
                      </span>
                      <span className="text-black text-xs font-sans font-bold tracking-wider mt-0.5">
                        VER SOLU&Ccedil;&Otilde;ES
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* SECTION - FAQ */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[160px] pointer-events-none" />

          <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[40px] bg-charcoal-950 border border-white/[0.04] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
                  D&uacute;vidas sobre desenvolvimento web
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter">
                  Antes de criar um site, entenda o que precisa ser estruturado.
                </h2>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-sans max-w-sm">
                  Um projeto web funciona melhor quando a marca entende qual papel o site precisa cumprir: apresentar, explicar, organizar, apoiar o comercial ou sustentar uma presen&ccedil;a digital pr&oacute;pria.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {([
                  { id: 0, title: "A TAG08 desenvolve apenas sites institucionais?" },
                  { id: 1, title: "Preciso ter todo o conte&uacute;do pronto antes de come&ccedil;ar?" },
                  { id: 2, title: "O site considera o apoio ao comercial?" },
                  { id: 3, title: "O projeto inclui responsividade e adapta&ccedil;&atilde;o para celular?" },
                  { id: 4, title: "Depois da publica&ccedil;&atilde;o, o site pode evoluir?" },
                  { id: 5, title: "Como a TAG08 define o escopo do site?" }
                ]).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveFaq(item.id)}
                    aria-expanded={activeFaq === item.id}
                    aria-controls={`web-faq-panel-${item.id}`}
                    className={`w-full min-h-11 flex items-center justify-between p-4 rounded-xl border transition-[background-color,border-color,color,box-shadow] duration-200 text-left group cursor-pointer active:scale-[0.99] ${
                      activeFaq === item.id
                        ? "bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)]"
                        : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                    }`}
                  >
                    <span id={`web-faq-heading-${item.id}`} className="tag08-meta text-xs font-black uppercase tracking-wider flex items-center gap-3">
                      <span className={activeFaq === item.id ? "text-black" : "text-brand"}>
                        {String(item.id + 1).padStart(2, '0')}.
                      </span>
                      {item.title}
                    </span>
                    <ArrowRight aria-hidden="true" className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                      activeFaq === item.id ? "text-black rotate-[-45deg] stroke-[2.5]" : "text-zinc-500"
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            <div id={`web-faq-panel-${activeFaq}`} role="region" aria-labelledby={`web-faq-heading-${activeFaq}`} className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-white/[0.04] bg-charcoal-900">
              <Image
                fill
                sizes="(max-width: 1024px) 100vw, 34vw"
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
                alt="TAG08 Web Design"
                className="object-cover grayscale brightness-[0.22] contrast-[1.1] transition-opacity duration-200 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div aria-hidden="true" className="absolute top-6 left-6 z-10 pointer-events-none tag08-meta text-xs text-white/20 uppercase tracking-widest leading-none">
                SYS // STATIC_WEB
              </div>

              <div className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left">
                <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black block">
                  {([
                    "A TAG08 desenvolve apenas sites institucionais?",
                    "Preciso ter todo o conte&uacute;do pronto antes de come&ccedil;ar?",
                    "O site considera o apoio ao comercial?",
                    "O projeto inclui responsividade e adapta&ccedil;&atilde;o para celular?",
                    "Depois da publica&ccedil;&atilde;o, o site pode evoluir?",
                    "Como a TAG08 define o escopo do site?"
                  ])[activeFaq]}
                </span>

                <h3 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {([
                    "A TAG08 desenvolve apenas sites institucionais?",
                    "Preciso ter todo o conte&uacute;do pronto antes de come&ccedil;ar?",
                    "O site considera o apoio ao comercial?",
                    "O projeto inclui responsividade e adapta&ccedil;&atilde;o para celular?",
                    "Depois da publica&ccedil;&atilde;o, o site pode evoluir?",
                    "Como a TAG08 define o escopo do site?"
                  ])[activeFaq]}
                </h3>

                <p className="text-zinc-300 text-xs sm:text-xs leading-relaxed font-sans font-medium">
                  {([
                    "N&atilde;o. A TAG08 pode desenvolver sites institucionais, landing pages, p&aacute;ginas de servi&ccedil;o, cat&aacute;logos digitais e outras estruturas web conforme a fun&ccedil;&atilde;o necess&aacute;ria, o conte&uacute;do e a jornada do usu&aacute;rio.",
                    "N&atilde;o necessariamente. O projeto pode incluir organiza&ccedil;&atilde;o da arquitetura da informa&ccedil;&atilde;o, defini&ccedil;&atilde;o dos blocos de conte&uacute;do e apoio na estrutura&ccedil;&atilde;o das mensagens necess&aacute;rias &agrave; p&aacute;gina, conforme o escopo aprovado.",
                    "Pode considerar. O site pode organizar informa&ccedil;&otilde;es, ofertas, d&uacute;vidas e caminhos de contato para apoiar a conversa comercial, mas n&atilde;o tratamos vendas ou convers&atilde;o como resultado autom&aacute;tico.",
                    "Sim. A interface &eacute; planejada para diferentes tamanhos de tela, preservando legibilidade, hierarquia, navega&ccedil;&atilde;o e acesso &agrave;s informa&ccedil;&otilde;es.",
                    "Sim. Conforme a estrutura t&eacute;cnica e o escopo, o site pode receber novas p&aacute;ginas, conte&uacute;dos, integra&ccedil;&otilde;es ou melhorias &agrave; medida que surgem novas necessidades.",
                    "O escopo &eacute; definido a partir do objetivo da estrutura, do momento da marca, da quantidade de p&aacute;ginas, dos conte&uacute;dos, das integra&ccedil;&otilde;es necess&aacute;rias e dos pontos de contato envolvidos."
                  ])[activeFaq]}
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              <div className="bg-charcoal-900 border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-[border-color] duration-200 text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-zinc-300 uppercase tracking-widest block font-bold">PROPOSTA DE VALOR</span>
                  <h3 className="text-white font-semibold text-sm leading-snug">O que o projeto precisa deixar claro?</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    A estrutura precisa deixar claro o papel da p&aacute;gina, a jornada do visitante e o pr&oacute;ximo passo esperado.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleLinkClick("/servicos")}
                  className="group min-h-11 flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand active:scale-[0.99] cursor-pointer select-none pt-2 border-t border-white/5 transition-colors duration-200"
                >
                  <span>VER SOLU&Ccedil;&Otilde;ES</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 hover:shadow-lg transition-shadow duration-200 text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-black/80 uppercase tracking-widest block font-extrabold">FALE COM A TAG08</span>
                  <h3 className="text-black font-black text-sm leading-tight tracking-tight">Quer conversar sobre o seu site?</h3>
                  <p className="text-black/85 text-xs font-semibold leading-relaxed font-sans">
                    Converse com a TAG08 para entender o que precisa ser estruturado, o que entra no escopo e qual caminho faz sentido para o projeto.
                  </p>
                </div>
                <TrackedOutboundLink
                  label="Falar com a TAG08"
                  surface="desenvolvimento-web-final-cta"
                  href={buildBrazilWhatsAppUrl("Ol%C3%A1,%20gostaria%20de%20conversar%20sobre%20um%20projeto%20de%20desenvolvimento%20web%20com%20a%20TAG08")}
                  target="_blank"
                  rel="noreferrer"
                  className="group min-h-11 flex items-center justify-between text-xs font-sans font-black text-black select-none border-t border-black/10 pt-3 hover:translate-x-0.5 transition-transform duration-200"
                >
                  <span>FALAR COM A TAG08</span>
                  <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
                </TrackedOutboundLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 - ACTION TRIGGER FOOTER */}
      <section className="px-4 sm:px-6 md:px-8 py-20 text-center space-y-6 max-w-4xl mx-auto">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-none tracking-tighter">
          Vamos entender qual estrutura web sua marca precisa?
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Antes de propor uma estrutura, a TAG08 entende o momento da marca, a jornada do usu&aacute;rio, os conte&uacute;dos necess&aacute;rios e a fun&ccedil;&atilde;o que o site precisa cumprir dentro da estrat&eacute;gia.
        </p>
        <div className="pt-4">
          <button
            type="button"
            onClick={() => handleLinkClick("/contato")}
            className="group min-h-11 bg-brand text-black font-sans font-black text-xs uppercase tracking-widest py-4 px-8 rounded-full shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.22)] hover:bg-brand-dark active:scale-[0.98] transition-[background-color,transform] duration-200 cursor-pointer flex items-center gap-2 mx-auto"
          >
            <span>PLANEJAR MEU SITE</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </section>
    </div>
  );
}
