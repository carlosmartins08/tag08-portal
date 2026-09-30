import { useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, BookOpen, Settings, Target } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ResilientImage from "../../../components/ResilientImage";
import { EvidenceReviewBadge } from "../../../components/ContentReview";
import { getEvidenceVisibilityMode, getVisibleEvidence } from "../../../content/publicEvidence";

interface SobreProps {
  onNavigate: (page: string) => void;
}

const PRIMARY_PROFILES = [
  { evidenceKey: "team/carlos-henrique-martins", name: "Carlos Henrique Martins", role: "Estrategista de negócios digitais", title: "Estratégia e direção de negócio", description: "Conecta objetivos comerciais, prioridades e soluções digitais para transformar o contexto do negócio em uma direção clara de projeto.", image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800", photo: "/team/carlos-henrique-martins.jpg", label: "Estratégia", support: "Negócios digitais e decisão" },
  { evidenceKey: "team/ignacio-quiroz", name: "Ignacio Quiroz", role: "Analista de marketing e comunicações", title: "Marketing e comunicação", description: "Organiza marca, segmentação e jornada do cliente para que a comunicação seja mais relevante, compreensível e orientada à conversão.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800", photo: "/team/ignacio-quiroz.jpg", label: "Comunicação", support: "Marca, jornada e conversão" },
  { evidenceKey: "team/pedro-felix", name: "Pedro Félix", role: "Analista de dados e desenvolvedor front-end", title: "Dados e experiência digital", description: "Une análise, planejamento e desenvolvimento front-end para transformar informação em decisões melhores e experiências digitais funcionais.", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800", photo: "/team/pedro-felix.jpg", label: "Dados e produto", support: "Planejamento e front-end" },
  { evidenceKey: "team/daniel-lopes", name: "Daniel Lopes", role: "Gerente de infraestrutura de TI", title: "Infraestrutura e continuidade", description: "Apoia a base tecnológica com visão de operações, redes, servidores, nuvem e governança para dar segurança à entrega.", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800", photo: "/team/daniel-lopes.jpg", label: "Tecnologia", support: "Operações e governança" }
] as const;

const COMPLEMENTARY_PROFILES = [
  { evidenceKey: "team/guilherme-gomes", name: "Guilherme Gomes", role: "Diretor de arte", photo: "/team/guilherme-gomes.jpg", description: "Define soluções visuais para campanhas e aplicações de marca, com atenção à hierarquia, estética e consistência das peças." },
  { evidenceKey: "team/amazing-design", name: "Amazing Design", role: "Designer gráfico e motion designer", photo: "/team/amazing-design.jpg", description: "Desenvolve criativos para redes, mídia paga e motion, adaptando a linguagem visual ao formato e ao objetivo de cada peça." },
  { evidenceKey: "team/andreia-braga", name: "Andréia Braga", role: "Colaboração de projeto", photo: "/team/andreia-braga.jpg", description: "Integra a rede de colaboradores acionada conforme a necessidade, o escopo e a etapa de cada projeto." }
] as const;

const CAPABILITIES = [
  { title: "Estratégia e direção", description: "Diagnóstico, posicionamento, prioridades e coordenação definem o que precisa acontecer antes da execução.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400", label: "Direção", support: "Contexto e decisão" },
  { title: "Conteúdo e expressão", description: "Narrativa, redação, design e audiovisual transformam direção em comunicação compreensível e consistente.", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400", label: "Comunicação", support: "Narrativa e presença" },
  { title: "Tecnologia e experiência", description: "Sites e estruturas digitais cumprem uma função dentro da presença e da jornada do negócio.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400", label: "Tecnologia", support: "Estrutura e experiência" },
  { title: "Processos e continuidade", description: "Fluxos, responsabilidades, documentação e acompanhamento reduzem improviso e sustentam a execução.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400", label: "Operação", support: "Processo e continuidade" }
] as const;

const METHOD_PRINCIPLES = [
  { icon: Target, title: "Diagnóstico antes da velocidade", description: "Entender contexto, gargalos e prioridades evita retrabalho e decisões frágeis." },
  { icon: BookOpen, title: "Estratégia antes do volume", description: "Mais campanha ou mais conteúdo não resolvem quando mensagem, público e posicionamento ainda estão confusos." },
  { icon: Settings, title: "Coordenação com função", description: "Design, conteúdo e tecnologia precisam servir ao mesmo objetivo e a uma operação capaz de sustentá-los." },
  { icon: ArrowRight, title: "Continuidade responsável", description: "Acompanhamos aprendizados, ajustamos rotas e organizamos os próximos passos depois da publicação." }
] as const;

const CLIENT_LOGOS = [
  { evidenceKey: "client-logo/cayuca", name: "CaYuCa", src: "/clients/CaYuCa_white.svg", imageClassName: "" },
  { evidenceKey: "client-logo/wscom", name: "WSCOM", src: "/clients/WSCOM_white.svg", imageClassName: "" },
  { evidenceKey: "client-logo/vr-imobiliaria", name: "VR Imobiliária", src: "/clients/VRImobiliaria_Black.svg", imageClassName: "invert" },
  { evidenceKey: "client-logo/vaqrama", name: "Vaqrama", src: "/clients/Vaqrama_white.svg", imageClassName: "" },
  { evidenceKey: "client-logo/alugue-por-temporada", name: "Alugue por Temporada", src: "/clients/logo-mono-white_AluguePorTemporada.svg", imageClassName: "" },
  { evidenceKey: "client-logo/segura-epi", name: "Segura EPI", src: "/clients/SeguraEPI_white.svg", imageClassName: "" },
  { evidenceKey: "client-logo/ruben-a", name: "Ruben A.", src: "/clients/RubenA_white.svg", imageClassName: "" },
  { evidenceKey: "client-logo/reavivare", name: "Reavivare", src: "/clients/Reavivare_white.svg", imageClassName: "" },
  { evidenceKey: "client-logo/raquel-cordeiro", name: "Raquel Cordeiro", src: "/clients/RaquelCordeiro_white.svg", imageClassName: "" },
  { evidenceKey: "client-logo/luciana-gadelha", name: "Luciana Gadelha", src: "/clients/LucianaGadelha_logo-dark.svg", imageClassName: "" },
  { evidenceKey: "client-logo/home-office", name: "HomeOffice", src: "/clients/HomeOffice_white.svg", imageClassName: "" },
  { evidenceKey: "client-logo/harmonic", name: "Harmonic", src: "/clients/Harmonic_white.svg", imageClassName: "" }
] as const;

const COLLABORATION_BLOCKS = [
  { id: "strategy", area: "Colaboração", title: "Pensamento estratégico", support: "Cultura TAG08", description: "Buscamos pessoas que entendam contexto, façam boas perguntas e conectem execução com objetivo.", requirements: ["Leitura de contexto antes da tarefa", "Perguntas que melhoram a direção", "Capacidade de ligar detalhe e resultado"] },
  { id: "craft", area: "Padrão de entrega", title: "Cuidado com a entrega", support: "Processo e revisão", description: "Qualidade não é detalhe final. É postura durante briefing, produção, revisão e melhoria.", requirements: ["Atenção ao briefing e ao escopo", "Ritmo consistente de revisão", "Compromisso com a melhoria contínua"] },
  { id: "process", area: "Processo", title: "Responsabilidade com o processo", support: "Equipe e rotina", description: "Trabalhar bem em equipe exige clareza de escopo, prazos possíveis, comunicação objetiva e registro das decisões.", requirements: ["Escopo claro antes da execução", "Comunicação objetiva entre áreas", "Registro das decisões e próximos passos"] }
] as const;

type CollaborationId = (typeof COLLABORATION_BLOCKS)[number]["id"];

const cardTransition = "transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out motion-reduce:transition-none";
const actionTransition = "transition-[transform,background-color,color,border-color] duration-150 ease-out active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none";

function CapabilityCard({ capability, featured = false, className = "" }: { capability: (typeof CAPABILITIES)[number]; featured?: boolean; className?: string }) {
  return (
    <article className={`group relative ${featured ? "min-h-[300px] border-brand/25 p-6 sm:p-8" : "min-h-[260px] border-white/[0.08] p-5"} overflow-hidden rounded-3xl border bg-charcoal-900 ${cardTransition} ${featured ? "" : "hover:border-brand/45"} ${className}`}>
      <ResilientImage fallbackLabel="Imagem editorial" sizes={featured ? "(max-width: 1024px) 100vw, 42vw" : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"} src={capability.image} alt="" className={`object-cover grayscale brightness-[0.7] transition-[opacity,transform] duration-300 ease-out motion-reduce:transform-none group-hover:scale-[1.02] ${featured ? "opacity-25 group-hover:opacity-35" : "opacity-40 group-hover:opacity-55"}`} referrerPolicy="no-referrer" />
      <div aria-hidden="true" className={`absolute inset-0 ${featured ? "bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" : "bg-gradient-to-t from-black via-black/45 to-transparent"}`} />
      <div className={`relative flex h-full flex-col ${featured ? "justify-between gap-16" : "justify-between gap-10"}`}>
        <p className={`self-start rounded-full px-3 py-1 text-xs font-bold ${featured ? "border border-brand/25 bg-brand/10 uppercase tracking-wider text-brand" : "border border-white/10 bg-black/60 text-zinc-200 backdrop-blur-md"}`}>{capability.label}</p>
        <div className="max-w-md space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">{capability.support}</p>
          <h3 className={`font-display font-black leading-none tracking-tight text-white ${featured ? "text-2xl sm:text-3xl" : "text-lg"}`}>{capability.title}</h3>
          <p className="text-sm leading-relaxed text-zinc-200">{capability.description}</p>
        </div>
      </div>
    </article>
  );
}

export default function Sobre({ onNavigate }: SobreProps) {
  const [selectedPrinciple, setSelectedPrinciple] = useState<CollaborationId | null>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const evidenceMode = getEvidenceVisibilityMode();
  const visiblePrimaryProfiles = getVisibleEvidence(PRIMARY_PROFILES, (profile) => profile.evidenceKey, "/sobre", evidenceMode);
  const visibleComplementaryProfiles = getVisibleEvidence(COMPLEMENTARY_PROFILES, (profile) => profile.evidenceKey, "/sobre", evidenceMode);
  const visibleClientLogos = getVisibleEvidence(CLIENT_LOGOS, (logo) => logo.evidenceKey, "/sobre", evidenceMode);
  const hasPublicTeamProfiles = visiblePrimaryProfiles.length > 0 || visibleComplementaryProfiles.length > 0;

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-charcoal-950 pb-20 pt-24 text-white sm:pt-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:20px_20px]" />
      <div aria-hidden="true" className="pointer-events-none absolute left-[-15%] top-[8%] h-[600px] w-[600px] rounded-full bg-brand/[0.015] blur-[150px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[20%] right-[-15%] h-[600px] w-[600px] rounded-full bg-brand/[0.02] blur-[150px]" />

      <section className="relative border-b border-white/[0.06] px-4 py-12 sm:px-6 sm:py-20 md:px-8">
        <div className="mx-auto max-w-7xl space-y-10 sm:space-y-14">
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-5 lg:col-span-7">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand">Sobre a TAG08</p>
              <h1 className="max-w-4xl font-display text-4xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">Direção para construir presença. <span className="text-brand">Estrutura para sustentar crescimento.</span></h1>
              <button data-testid="about-hero-cta-mobile" onClick={() => handleLinkClick("/contato")} className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-brand bg-brand px-5 py-3 text-xs font-black uppercase tracking-widest text-black sm:hidden ${actionTransition}`}>Falar com a TAG08 <ArrowUpRight className="h-4 w-4 stroke-[2.5]" /></button>
            </div>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-zinc-300 lg:col-span-5 lg:pb-1">A TAG08 conecta estratégia, conteúdo, design, tecnologia e processos para ajudar marcas e negócios a sair do improviso, organizar prioridades e construir uma presença digital mais clara, consistente e sustentável.</p>
          </div>

          <div className="group relative aspect-[16/10] overflow-hidden rounded-[24px] border border-white/[0.08] bg-charcoal-900 shadow-2xl sm:aspect-[2.39/1] sm:rounded-[32px]">
            <ResilientImage preload fallbackLabel="Imagem editorial" sizes="(max-width: 768px) 100vw, (max-width: 1280px) calc(100vw - 4rem), 1280px" src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1600" alt="" className="object-cover grayscale brightness-50 transition-transform duration-300 ease-out motion-reduce:transform-none group-hover:scale-[1.01]" referrerPolicy="no-referrer" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center px-5">
              <button data-testid="about-hero-cta" onClick={() => handleLinkClick("/contato")} className={`hidden min-h-11 rounded-full border border-brand bg-brand px-6 py-3 text-xs font-black uppercase tracking-widest text-black shadow-[0_12px_36px_rgba(var(--color-brand-rgb),0.25)] hover:bg-brand-dark sm:inline-flex sm:items-center sm:gap-2 sm:px-8 ${actionTransition}`}>Falar com a TAG08 <ArrowUpRight className="h-4 w-4 stroke-[2.5]" /></button>
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-6 sm:left-6 sm:right-6"><p className="text-sm font-bold text-white">Presença com direção</p><p className="hidden rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md sm:block">Direção TAG08</p></div>
          </div>
        </div>
      </section>

      <section className="relative border-b border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20 md:px-8">
        <div className="mx-auto max-w-7xl space-y-9 sm:space-y-12">
          <div className="max-w-3xl space-y-3"><h2 className="font-display text-3xl font-black leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl">Como a TAG08 atua.</h2><p className="text-sm leading-relaxed text-zinc-300">Cada projeto reúne as especialidades necessárias para entender o problema, produzir com critério e sustentar a entrega. A composição muda conforme a necessidade real, não por fórmula pronta.</p></div>
          {hasPublicTeamProfiles ? (
            <div data-testid="team-profiles" className="space-y-6">
              {visiblePrimaryProfiles.length > 0 && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
                  <article data-evidence-key={visiblePrimaryProfiles[0].evidenceKey} className={`group relative min-h-[300px] overflow-hidden rounded-3xl border border-brand/25 bg-charcoal-900 p-6 lg:col-span-5 sm:p-8 ${cardTransition}`}>
                    <ResilientImage fallbackLabel="Imagem editorial" sizes="(max-width: 1024px) 100vw, 42vw" src={visiblePrimaryProfiles[0].image} alt="" className="object-cover opacity-25 grayscale brightness-[0.7] transition-[opacity,transform] duration-300 ease-out motion-reduce:transform-none group-hover:scale-[1.01] group-hover:opacity-35" referrerPolicy="no-referrer" />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
                    <div className="relative flex items-center justify-between gap-4"><p className="rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">{visiblePrimaryProfiles[0].label}</p><Image src={visiblePrimaryProfiles[0].photo} alt={`Retrato de ${visiblePrimaryProfiles[0].name}`} width={48} height={48} sizes="48px" unoptimized className="h-12 w-12 rounded-full border border-white/20 object-cover" /></div>
                    <div className="relative mt-4"><EvidenceReviewBadge evidenceKey={visiblePrimaryProfiles[0].evidenceKey} /></div>
                    <div className="relative mt-16 max-w-md space-y-3"><p className="text-xs font-bold uppercase tracking-wider text-brand">{visiblePrimaryProfiles[0].role}</p><h3 className="font-display text-2xl font-black leading-none tracking-tight text-white sm:text-3xl">{visiblePrimaryProfiles[0].title}</h3><p className="text-sm leading-relaxed text-zinc-300">{visiblePrimaryProfiles[0].description}</p></div>
                  </article>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
                    {visiblePrimaryProfiles.slice(1).map((member, index) => (
                      <article key={member.evidenceKey} data-evidence-key={member.evidenceKey} className={`group relative min-h-[260px] overflow-hidden rounded-3xl border border-white/[0.08] bg-charcoal-900 p-5 ${index === 2 ? "md:col-span-2 lg:col-span-1" : ""} ${cardTransition} hover:border-brand/45`}>
                        <ResilientImage fallbackLabel="Imagem editorial" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw" src={member.image} alt="" className="object-cover opacity-40 grayscale brightness-[0.7] transition-[opacity,transform] duration-300 ease-out motion-reduce:transform-none group-hover:scale-[1.02] group-hover:opacity-55" referrerPolicy="no-referrer" />
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
                        <div className="relative flex items-center justify-between gap-3"><p className="rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-xs font-bold text-zinc-200 backdrop-blur-md">{member.label}</p><Image src={member.photo} alt={`Retrato de ${member.name}`} width={44} height={44} sizes="44px" unoptimized className="h-11 w-11 rounded-full border border-white/20 object-cover" /></div>
                        <div className="relative mt-3"><EvidenceReviewBadge evidenceKey={member.evidenceKey} /></div>
                        <div className="relative mt-14 space-y-2"><p className="text-xs font-bold uppercase tracking-wider text-brand">{member.role}</p><h3 className="font-display text-lg font-black leading-none tracking-tight text-white">{member.name}</h3><p className="text-sm leading-relaxed text-zinc-200">{member.description}</p></div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
              {visibleComplementaryProfiles.length > 0 && (
                <div className="grid grid-cols-1 gap-4 border-t border-white/[0.06] pt-6 md:grid-cols-2 lg:grid-cols-3">
                  {visibleComplementaryProfiles.map((profile, index) => <article key={profile.evidenceKey} data-evidence-key={profile.evidenceKey} className={`rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 ${index === 2 ? "md:col-span-2 lg:col-span-1" : ""}`}><div className="flex items-center gap-3"><Image src={profile.photo} alt={`Retrato de ${profile.name}`} width={44} height={44} sizes="44px" unoptimized className="h-11 w-11 shrink-0 rounded-full border border-white/15 object-cover" /><div><p className="text-xs font-bold uppercase tracking-wider text-brand">{profile.role}</p><h3 className="mt-1 font-display text-base font-black tracking-tight text-white">{profile.name}</h3></div></div><div className="mt-3"><EvidenceReviewBadge evidenceKey={profile.evidenceKey} /></div><p className="mt-3 text-sm leading-relaxed text-zinc-300">{profile.description}</p></article>)}
                </div>
              )}
            </div>
          ) : (
            <div data-testid="connected-capabilities" className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6"><CapabilityCard capability={CAPABILITIES[0]} featured className="lg:col-span-5" /><div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-7 lg:grid-cols-3">{CAPABILITIES.slice(1).map((capability, index) => <CapabilityCard key={capability.title} capability={capability} className={index === 2 ? "md:col-span-2 lg:col-span-1" : ""} />)}</div></div>
          )}
        </div>
      </section>

      <section className="relative border-b border-white/[0.06] bg-zinc-950/70 px-4 py-16 sm:px-6 sm:py-20 md:px-8">
        <div className="mx-auto max-w-7xl space-y-10 sm:space-y-14">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-14"><div className="space-y-5"><h2 className="font-display text-3xl font-black leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl">Método na prática.</h2><p className="max-w-xl text-sm leading-relaxed text-zinc-300">Comunicação, design, tecnologia e processos só geram valor quando estão conectados a um diagnóstico claro, prioridades bem definidas e uma execução possível de sustentar.</p><p className="max-w-xl border-l border-brand/50 pl-4 text-sm leading-relaxed text-zinc-200">A TAG08 não busca parecer maior do que é. Busca construir caminhos claros, coerentes e sustentáveis para cada marca.</p></div><div className="group relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/[0.08] bg-charcoal-900 shadow-2xl"><ResilientImage fallbackLabel="Método TAG08" sizes="(max-width: 1024px) 100vw, 50vw" src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" alt="" className="object-cover grayscale brightness-75 transition-transform duration-300 ease-out motion-reduce:transform-none group-hover:scale-[1.02]" referrerPolicy="no-referrer" /><div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" /><p className="absolute bottom-6 left-6 text-sm font-bold text-white">Direção aplicada</p></div></div>
          <ol className="grid grid-cols-1 border-y border-white/[0.08] md:grid-cols-2">{METHOD_PRINCIPLES.map((principle, index) => { const Icon = principle.icon; return <li key={principle.title} className={`min-h-[170px] p-6 ${index % 2 === 0 ? "md:border-r md:border-white/[0.08]" : ""} ${index < 2 ? "border-b border-white/[0.08]" : ""}`}><Icon aria-hidden="true" className="h-5 w-5 text-brand" /><h3 className="mt-7 font-display text-lg font-black tracking-tight text-white">{principle.title}</h3><p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-300">{principle.description}</p></li>; })}</ol>
          <div className="flex flex-col justify-between gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:flex-row sm:items-center"><div className="max-w-2xl"><h3 className="font-display text-lg font-black tracking-tight text-white">Um próximo passo coerente começa pelo entendimento.</h3><p className="mt-2 text-sm leading-relaxed text-zinc-300">Antes de transformar uma demanda em execução, organizamos prioridades, identificamos gargalos e indicamos um caminho viável.</p></div>
            <button onClick={() => handleLinkClick("/servicos")} className={`min-h-11 shrink-0 rounded-xl border border-brand/40 px-5 py-3 text-xs font-bold uppercase tracking-wider text-brand hover:bg-brand hover:text-black ${actionTransition}`}>Conhecer soluções</button></div>
        </div>
      </section>

      {visibleClientLogos.length > 0 && <section className="relative border-b border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20 md:px-8"><div className="mx-auto max-w-7xl space-y-8 sm:space-y-10"><div className="max-w-3xl space-y-3"><h2 className="font-display text-3xl font-black leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl">Repertório de colaborações.</h2><p className="text-sm leading-relaxed text-zinc-300">Uma seleção de negócios atendidos em diferentes momentos e frentes, apresentada com autorização de uso.</p></div><ul data-testid="client-logo-wall" className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4" aria-label="Marcas que já trabalharam com a TAG08">{visibleClientLogos.map((logo) => <li key={logo.evidenceKey} data-evidence-key={logo.evidenceKey} className="flex h-24 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 sm:h-28 sm:px-7"><Image src={logo.src} alt={`Logo da ${logo.name}`} width={180} height={72} unoptimized className={`max-h-11 w-full max-w-[10rem] object-contain ${logo.imageClassName}`} /></li>)}</ul><p className="max-w-3xl text-sm leading-relaxed text-zinc-400">A presença nesta seleção não representa recomendação pública, parceria ativa ou promessa de resultado.</p></div></section>}

      <section className="relative border-b border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20 md:px-8"><div className="mx-auto max-w-7xl space-y-9 sm:space-y-12"><div className="max-w-3xl space-y-3"><h2 className="font-display text-3xl font-black leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl">Cultura e colaboração.</h2><p className="text-sm leading-relaxed text-zinc-300">A TAG08 valoriza pessoas que sabem pensar antes de executar, respeitam processo, cuidam da qualidade e entendem que criatividade também precisa de método.</p></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{COLLABORATION_BLOCKS.map((block, index) => { const isOpen = selectedPrinciple === block.id; const panelId = `collaboration-principles-${block.id}`; const headingId = `collaboration-title-${block.id}`; return <article key={block.id} className={`flex min-h-[280px] flex-col rounded-3xl border border-white/[0.08] bg-charcoal-900/70 p-6 sm:p-7 ${index === 2 ? "md:col-span-2 lg:col-span-1" : ""} ${cardTransition} ${isOpen ? "border-brand/45 bg-black/60" : "hover:border-white/20"}`}><div className="flex items-start justify-between gap-4"><p className="text-xs font-bold uppercase tracking-wider text-zinc-300">{block.area}</p><p className="rounded-full border border-brand/25 bg-brand/10 px-2 py-1 text-xs font-bold text-brand">{block.support}</p></div><div className="mt-7"><h3 id={headingId} className="font-display text-xl font-black leading-tight tracking-tight text-white">{block.title}</h3><p className="mt-3 text-sm leading-relaxed text-zinc-300">{block.description}</p></div><AnimatePresence initial={false}>{isOpen && <motion.div id={panelId} role="region" aria-labelledby={headingId} initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }} transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: [0.23, 1, 0.32, 1] }} className="mt-5 overflow-hidden border-t border-white/[0.08] pt-4"><ul className="space-y-2.5">{block.requirements.map((requirement) => <li key={requirement} className="flex gap-2 text-sm leading-relaxed text-zinc-200"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{requirement}</li>)}</ul></motion.div>}</AnimatePresence>
          <button type="button" aria-expanded={isOpen} aria-controls={panelId} aria-label={`${isOpen ? "Ocultar" : "Ver"} princípios de ${block.title}`} onClick={() => setSelectedPrinciple(isOpen ? null : block.id)} className={`mt-auto inline-flex min-h-11 items-center self-start gap-2 pt-6 text-xs font-black uppercase tracking-wider ${isOpen ? "text-brand" : "text-zinc-200 hover:text-white"} ${actionTransition}`}>{isOpen ? "Ocultar princípios" : "Ver princípios"}<ArrowRight aria-hidden="true" className={`h-4 w-4 transition-transform duration-150 ease-out motion-reduce:transition-none ${isOpen ? "rotate-90" : ""}`} /></button></article>; })}</div>
        <div className="flex flex-col justify-between gap-5 rounded-3xl border border-white/[0.08] bg-charcoal-900 p-6 sm:flex-row sm:items-center sm:p-8"><div className="max-w-2xl"><h3 className="font-display text-xl font-black tracking-tight text-white">Quer fazer parte do jeito TAG08 de trabalhar?</h3><p className="mt-2 text-sm leading-relaxed text-zinc-300">Se você se identifica com pensamento estratégico, cuidado com a entrega e responsabilidade com o processo, vale conhecer nosso espaço de colaboração.</p></div>
          <button onClick={() => handleLinkClick("/trabalhe-conosco")} className={`min-h-11 shrink-0 rounded-xl bg-brand px-6 py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-brand-dark ${actionTransition}`}><span className="inline-flex items-center gap-2">Conhecer o Trabalhe Conosco <ArrowUpRight className="h-4 w-4 stroke-[2.5]" /></span></button></div>
      </div></section>

      <section className="relative px-4 py-20 sm:px-6 md:px-8"><div className="mx-auto max-w-3xl text-center"><h2 className="font-display text-3xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">O próximo passo começa pelo entendimento do momento atual.</h2><p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-zinc-300">Antes de propor uma solução, a TAG08 procura entender o momento, os desafios e as prioridades da marca para indicar um caminho claro, coerente e responsável.</p>
        <button onClick={() => handleLinkClick("/contato")} className={`mt-8 min-h-12 rounded-xl bg-brand px-8 py-3 text-xs font-black uppercase tracking-wider text-black shadow-[0_12px_36px_rgba(var(--color-brand-rgb),0.18)] hover:bg-brand-dark ${actionTransition}`}><span className="inline-flex items-center gap-2">Falar com a TAG08 <ArrowUpRight className="h-4 w-4 stroke-[2.5]" /></span></button></div></section>
    </div>
  );
}
