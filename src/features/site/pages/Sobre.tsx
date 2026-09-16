import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, Target, Settings, BookOpen, FileCheck2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ResilientImage from "../../../components/ResilientImage";
import { getEvidenceVisibilityMode, getVisibleEvidence } from "../../../content/publicEvidence";
import { EvidenceReviewBadge } from "../../../components/ContentReview";

interface SobreProps {
  onNavigate: (page: string) => void;
}

export default function Sobre({ onNavigate }: SobreProps) {
  const [selectedVaga, setSelectedVaga] = useState<number | null>(null);

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const TILES_HERO = [
    {
      evidenceKey: "team/carlos-henrique-martins",
      name: "Carlos Henrique Martins",
      role: "Estrategista de negócios digitais",
      title: "Estratégia e direção de negócio",
      description: "Conecta objetivos comerciais, prioridades e soluções digitais para transformar o contexto do negócio em uma direção clara de projeto.",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800",
      photo: "/team/carlos-henrique-martins.jpg",
      label: "ESTRATÉGIA",
      support: "Negócios digitais // decisão"
    },
    {
      evidenceKey: "team/ignacio-quiroz",
      name: "Ignacio Quiroz",
      role: "Analista de marketing e comunicações",
      title: "Marketing e comunicação",
      description: "Organiza marca, segmentação e jornada do cliente para que a comunicação seja mais relevante, compreensível e orientada à conversão.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
      photo: "/team/ignacio-quiroz.jpg",
      label: "COMUNICAÇÃO",
      support: "Marca // jornada // conversão"
    },
    {
      evidenceKey: "team/pedro-felix",
      name: "Pedro Félix",
      role: "Analista de dados e desenvolvedor front-end",
      title: "Dados e experiência digital",
      description: "Une análise, planejamento e desenvolvimento front-end para transformar informação em decisões melhores e experiências digitais funcionais.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
      photo: "/team/pedro-felix.jpg",
      label: "DADOS & PRODUTO",
      support: "Planejamento // front-end"
    },
    {
      evidenceKey: "team/daniel-lopes",
      name: "Daniel Lopes",
      role: "Gerente de infraestrutura de TI",
      title: "Infraestrutura e continuidade",
      description: "Apoia a base tecnológica com visão de operações, redes, servidores, nuvem e governança para dar segurança à entrega.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
      photo: "/team/daniel-lopes.jpg",
      label: "TECNOLOGIA",
      support: "Operações // governança"
    }
  ];

  const COMPLEMENTARY_PROFILES = [
    {
      evidenceKey: "team/guilherme-gomes",
      name: "Guilherme Gomes",
      role: "Diretor de arte",
      photo: "/team/guilherme-gomes.jpg",
      description: "Define soluções visuais para campanhas e aplicações de marca, com atenção à hierarquia, estética e consistência das peças."
    },
    {
      evidenceKey: "team/amazing-design",
      name: "Amazing Design",
      role: "Designer gráfico e motion designer",
      photo: "/team/amazing-design.jpg",
      description: "Desenvolve criativos para redes, mídia paga e motion, adaptando a linguagem visual ao formato e ao objetivo de cada peça."
    },
    {
      evidenceKey: "team/andreia-braga",
      name: "Andréia Braga",
      role: "Colaboração de projeto",
      photo: "/team/andreia-braga.jpg",
      description: "Integra a rede de colaboradores acionada conforme a necessidade, o escopo e a etapa de cada projeto."
    }
  ];

  const evidenceMode = getEvidenceVisibilityMode();
  const visiblePrimaryProfiles = getVisibleEvidence(TILES_HERO, (profile) => profile.evidenceKey, "/sobre", evidenceMode);
  const visibleComplementaryProfiles = getVisibleEvidence(COMPLEMENTARY_PROFILES, (profile) => profile.evidenceKey, "/sobre", evidenceMode);
  const hasPublicTeamProfiles = visiblePrimaryProfiles.length > 0 || visibleComplementaryProfiles.length > 0;

  const CONNECTED_CAPABILITIES = [
    {
      title: "Estratégia e direção",
      description: "Diagnóstico, posicionamento, prioridades e coordenação ajudam a definir o que precisa acontecer antes da execução.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      label: "DIREÇÃO",
      support: "Contexto // decisão"
    },
    {
      title: "Conteúdo e expressão",
      description: "Narrativa, redação, design e audiovisual transformam direção em comunicação compreensível e consistente.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      label: "COMUNICAÇÃO",
      support: "Narrativa // presença"
    },
    {
      title: "Tecnologia e experiência",
      description: "Sites e estruturas digitais são construídos para cumprir uma função dentro da presença e da jornada do negócio.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      label: "TECNOLOGIA",
      support: "Estrutura // experiência"
    },
    {
      title: "Processos e continuidade",
      description: "Fluxos, responsabilidades, documentação e acompanhamento ajudam a reduzir improviso e sustentar a execução.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
      label: "OPERAÇÃO",
      support: "Processo // continuidade"
    }
  ];

  const CORES_DIFERENCIAIS = [
    {
      title: "Diagnóstico antes da execução",
      desc: "Antes de propor entregas, entendemos contexto, gargalos, prioridades e capacidade real de execução.",
      gradientClass: "from-brand/10 to-transparent border-brand/15 hover:border-brand/35",
      iconColor: "text-brand",
      badge: "DIAGNÓSTICO",
      delay: 0.1
    },
    {
      title: "Clareza de escopo",
      desc: "Organizamos o que será feito, por que será feito, o que fica fora e quais próximos passos são viáveis.",
      gradientClass: "from-brand/10 to-transparent border-brand/15 hover:border-brand/35",
      iconColor: "text-brand",
      badge: "ESCOPO",
      delay: 0.2
    },
    {
      title: "Coordenação entre áreas",
      desc: "Conectamos estratégia, conteúdo, design, tecnologia e processos para evitar soluções soltas.",
      gradientClass: "from-brand/10 to-transparent border-brand/15 hover:border-brand/35",
      iconColor: "text-brand",
      badge: "COORDENAÇÃO",
      delay: 0.3
    },
    {
      title: "Entrega com responsabilidade",
      desc: "A execução acontece com critério, revisão e alinhamento, sem promessa artificial ou pressão por atalhos.",
      gradientClass: "from-brand/10 to-transparent border-brand/15 hover:border-brand/35",
      iconColor: "text-brand",
      badge: "RESPONSABILIDADE",
      delay: 0.4
    }
  ];


  const COLLABORATION_BLOCKS = [
    {
      id: 0,
      area: "COLABORAÇÃO",
      title: "Pensamento estratégico",
      tempo: "Cultura TAG08",
      desc: "Buscamos pessoas que entendam contexto, façam boas perguntas e conectem execução com objetivo.",
      requirements: ["Leitura de contexto antes da tarefa", "Perguntas que melhoram a direção", "Capacidade de ligar detalhe e resultado"],
      color: "border-brand/20 shadow-brand/2"
    },
    {
      id: 1,
    area: "PADRÃO DE ENTREGA",
      title: "Cuidado com a entrega",
      tempo: "Processo e revisão",
      desc: "Qualidade não é detalhe final. É postura durante briefing, produção, revisão e melhoria.",
      requirements: ["Atenção ao briefing e ao escopo", "Ritmo consistente de revisão", "Compromisso com a melhoria contínua"],
      color: "border-brand/20 shadow-brand/2"
    },
    {
      id: 2,
      area: "PROCESSO",
      title: "Responsabilidade com o processo",
      tempo: "Equipe e rotina",
      desc: "Trabalhar bem em equipe exige clareza de escopo, prazos possíveis, comunicação objetiva e registro das decisões.",
      requirements: ["Escopo claro antes da execução", "Comunicação objetiva entre áreas", "Registro das decisões e próximos passos"],
      color: "border-brand/20 shadow-brand/2"
    }
  ];

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pt-24 sm:pt-28 pb-20 relative overflow-hidden">
      
      {/* Visual background grid texture inspired by the site architecture */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute top-[8%] left-[-15%] w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] bg-brand/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* SECTION 1 - HERO: THE EDITORIAL SYSTEM (Inspired by screenshot layout) */}
      <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta self-start font-bold">
                Sobre a TAG08
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter">
                Direção para construir presença. <br />
                <span className="text-brand">Estrutura para sustentar crescimento.</span>
              </h1>
            </div>

            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-sm leading-relaxed font-sans font-medium">
                A TAG08 conecta estratégia, conteúdo, design, tecnologia e processos para ajudar marcas e negócios a sair do improviso, organizar prioridades e construir uma presença digital mais clara, consistente e sustentável.
              </p>
            </div>
          </div>

          <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left">
            <ResilientImage
              fallbackLabel="Imagem editorial"
              sizes="100vw"
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1600"
              alt=""
              className="object-cover grayscale brightness-50 group-hover:scale-[1.01] transition-all duration-1000 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />

            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => handleLinkClick("/contato")}
                className="group bg-brand-secondary text-black font-sans font-black text-xs sm:text-xs uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] hover:scale-105 duration-300 transition-all border border-brand-secondary hover:bg-brand-dark flex items-center gap-2 cursor-pointer z-20"
              >
                <span>FALAR COM A TAG08</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
              <div className="space-y-1">
                <span className="tag08-meta text-xs text-brand-secondary tracking-widest block uppercase font-bold">PRINCÍPIOS DE TRABALHO</span>
                <h4 className="font-display font-black text-white text-xs sm:text-sm tracking-tight leading-none">Presença com direção</h4>
              </div>

              <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-xs text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                <span>DIREÇÃO TAG08</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Clareza</span>
              <span className="block text-zinc-500 tag08-meta text-xs uppercase tracking-widest leading-normal">Entendimento do momento<br />da marca</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">Método</span>
              <span className="block text-zinc-500 tag08-meta text-xs uppercase tracking-widest leading-normal">Direção antes da execução</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Estrutura</span>
              <span className="block text-zinc-500 tag08-meta text-xs uppercase tracking-widest leading-normal">Comunicação, design e operação<br />organizados com critério</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">Execução responsável</span>
              <span className="block text-zinc-500 tag08-meta text-xs uppercase tracking-widest leading-normal">Entrega acompanhada<br />e sustentada no tempo</span>
            </div>
          </div>

          {!hasPublicTeamProfiles && <div data-testid="connected-capabilities" className="pt-12 sm:pt-16 border-t border-white/[0.04] space-y-8 text-left font-sans">
            <div className="space-y-2">
              <span className="tag08-meta text-xs text-brand tracking-widest block uppercase font-bold">COMPETÊNCIAS CONECTADAS</span>
              <h3 className="font-display font-black text-white text-xl sm:text-2xl tracking-tight">Diferentes especialidades trabalham na mesma direção.</h3>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed max-w-2xl font-medium">
                A estrutura de cada projeto é organizada de acordo com o problema, o escopo e a capacidade necessária para diagnosticar, produzir, revisar e sustentar a entrega.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
              <div className="lg:col-span-5 bg-gradient-to-br from-brand-secondary/[0.08] via-zinc-950 to-transparent border border-brand-secondary/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden group min-h-[360px] shadow-[0_15px_35px_rgba(var(--color-brand-secondary-rgb),0.03)] hover:border-brand-secondary/45 transition-all duration-300">
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <ResilientImage
                    fallbackLabel="Imagem editorial"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    src={CONNECTED_CAPABILITIES[0].image}
                    alt=""
                    className="object-cover opacity-20 grayscale brightness-[0.7] group-hover:scale-[1.01] group-hover:opacity-30 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-brand-secondary/10 backdrop-blur-md px-3 py-1 rounded-full border border-brand-secondary/20 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
                    <span className="font-sans text-xs text-brand-secondary font-extrabold uppercase tracking-widest">{CONNECTED_CAPABILITIES[0].label}</span>
                  </div>
                  <span className="tag08-meta text-xs text-zinc-500 font-bold uppercase tracking-wider">DIREÇÃO TAG08</span>
                </div>

                <div className="relative z-10 space-y-4 mt-auto">
                  <div className="space-y-1">
                    <span className="font-sans text-xs text-brand block uppercase font-bold">{CONNECTED_CAPABILITIES[0].label}</span>
                    <h4 className="font-display font-black text-2xl sm:text-3xl text-white leading-none tracking-tight">{CONNECTED_CAPABILITIES[0].title}</h4>
                    <p className="text-brand-secondary text-xs tag08-meta uppercase tracking-wider pt-1">{CONNECTED_CAPABILITIES[0].support}</p>
                    <p className="text-zinc-400 text-xs leading-relaxed max-w-sm pt-2 italic">{CONNECTED_CAPABILITIES[0].description}</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {CONNECTED_CAPABILITIES.slice(1).map((capability) => (
                  <div
                    key={capability.title}
                    className="bg-charcoal-900 border border-white/[0.08] rounded-3xl p-5 flex flex-col justify-between text-left relative overflow-hidden h-[360px] group transition-all duration-300 hover:border-brand/40"
                  >
                    <div className="absolute inset-0 z-0 pointer-events-none">
                      <ResilientImage
                        fallbackLabel="Imagem editorial"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        src={capability.image}
                        alt=""
                        className="object-cover opacity-45 grayscale brightness-[0.7] group-hover:scale-105 group-hover:opacity-55 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                        <span className="font-sans text-xs text-zinc-300 font-bold">{capability.label}</span>
                      </div>
                    </div>

                    <div className="relative z-10 space-y-3.5 mt-auto">
                      <div className="space-y-1">
                        <span className="font-sans text-xs text-brand block uppercase font-bold">{capability.label}</span>
                        <h4 className="font-display font-black text-white text-base sm:text-lg leading-none tracking-tight">{capability.title}</h4>
                        <p className="text-zinc-350 text-xs font-sans font-medium leading-relaxed">{capability.description}</p>
                        <p className="text-brand-secondary text-xs font-sans uppercase tracking-wider pb-1">{capability.support}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>}

          {hasPublicTeamProfiles && <div data-testid="team-profiles" className="pt-12 sm:pt-16 border-t border-white/[0.04] space-y-8 text-left font-sans">
            <div className="space-y-2">
              <span className="tag08-meta text-xs text-brand tracking-widest block uppercase font-bold">COMPETÊNCIAS CONECTADAS</span>
              <h3 className="font-display font-black text-white text-xl sm:text-2xl tracking-tight">Pessoas com especialidades distintas, reunidas pela necessidade real de cada projeto.</h3>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed max-w-2xl font-medium">
                A composição não é fixa: estratégia, comunicação, dados, infraestrutura e criação entram quando ajudam a resolver o problema, produzir melhor e sustentar a entrega.
              </p>
            </div>

            {visiblePrimaryProfiles.length > 0 && <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
              <div data-evidence-key={visiblePrimaryProfiles[0].evidenceKey} className="lg:col-span-5 bg-gradient-to-br from-brand-secondary/[0.08] via-zinc-950 to-transparent border border-brand-secondary/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden group min-h-[360px] shadow-[0_15px_35px_rgba(var(--color-brand-secondary-rgb),0.03)] hover:border-brand-secondary/45 transition-all duration-300">
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <ResilientImage
                    fallbackLabel="Imagem editorial"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    src={visiblePrimaryProfiles[0].image}
                    alt=""
                    className="object-cover opacity-20 grayscale brightness-[0.7] group-hover:scale-[1.01] group-hover:opacity-30 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                </div>

                  <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-brand-secondary/10 backdrop-blur-md px-3 py-1 rounded-full border border-brand-secondary/20 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
                    <span className="font-sans text-xs text-brand-secondary font-extrabold uppercase tracking-widest">{visiblePrimaryProfiles[0].label}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="tag08-meta text-xs text-zinc-500 font-bold uppercase tracking-wider hidden sm:block">{visiblePrimaryProfiles[0].name}</span>
                    <Image
                      src={visiblePrimaryProfiles[0].photo}
                      alt={`Retrato de ${visiblePrimaryProfiles[0].name}`}
                      width={48}
                      height={48}
                      sizes="48px"
                      unoptimized
                      className="h-12 w-12 rounded-full border border-white/20 object-cover grayscale opacity-80 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                    />
                  </div>
                  <div className="relative z-10 pt-3"><EvidenceReviewBadge evidenceKey={visiblePrimaryProfiles[0].evidenceKey} /></div>
                </div>

                <div className="relative z-10 space-y-4 mt-auto">
                  <div className="space-y-1">
                    <span className="font-sans text-xs text-brand block uppercase font-bold">{visiblePrimaryProfiles[0].role}</span>
                    <h4 className="font-display font-black text-2xl sm:text-3xl text-white leading-none tracking-tight">{visiblePrimaryProfiles[0].title}</h4>
                    <p className="text-brand-secondary text-xs tag08-meta uppercase tracking-wider pt-1">{visiblePrimaryProfiles[0].support}</p>
                    <p className="text-zinc-400 text-xs leading-relaxed max-w-sm pt-2 italic">
                      {visiblePrimaryProfiles[0].description}
                    </p>
                  </div>

                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {visiblePrimaryProfiles.slice(1).map((member, idx) => (
                  <div
                    key={idx}
                    data-evidence-key={member.evidenceKey}
                    className="bg-charcoal-900 border border-white/[0.08] rounded-3xl p-5 flex flex-col justify-between text-left relative overflow-hidden h-[360px] group transition-all duration-300 hover:border-brand/40"
                  >
                    <div className="absolute inset-0 z-0 pointer-events-none">
                      <ResilientImage
                        fallbackLabel="Imagem editorial"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        src={member.image}
                        alt=""
                        className="object-cover opacity-45 grayscale brightness-[0.7] group-hover:scale-105 group-hover:opacity-55 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                        <span className="font-sans text-xs text-zinc-300 font-bold">{member.label}</span>
                      </div>
                      <Image
                        src={member.photo}
                        alt={`Retrato de ${member.name}`}
                        width={44}
                        height={44}
                        sizes="44px"
                        unoptimized
                        className="h-11 w-11 rounded-full border border-white/20 object-cover grayscale opacity-80 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                      />

                    </div>
                    <div className="relative z-10 pt-3"><EvidenceReviewBadge evidenceKey={member.evidenceKey} /></div>

                    <div className="relative z-10 space-y-3.5 mt-auto">
                      <div className="space-y-1">
                        <span className="font-sans text-xs text-brand block uppercase font-bold">{member.role}</span>
                        <h4 className="font-display font-black text-white text-base sm:text-lg leading-none tracking-tight">{member.name}</h4>
                        <p className="text-zinc-350 text-xs font-sans font-medium leading-relaxed">{member.description}</p>
                        <p className="text-brand-secondary text-xs font-sans uppercase tracking-wider pb-1">{member.support}</p>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>}

            {visibleComplementaryProfiles.length > 0 && <div className="border-t border-white/[0.04] pt-6 sm:pt-8">
              <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest block mb-4">Especialidades complementares</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {visibleComplementaryProfiles.map((profile) => (
                  <article key={profile.name} data-evidence-key={profile.evidenceKey} className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={profile.photo}
                        alt={`Retrato de ${profile.name}`}
                        width={44}
                        height={44}
                        sizes="44px"
                        unoptimized
                        className="h-11 w-11 shrink-0 rounded-full border border-white/15 object-cover grayscale opacity-75 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                      />
                      <div className="space-y-1">
                        <p className="font-sans text-xs text-brand uppercase tracking-wider font-bold">{profile.role}</p>
                        <h4 className="font-display font-black text-base text-white tracking-tight">{profile.name}</h4>
                      </div>
                    </div>
                    <EvidenceReviewBadge evidenceKey={profile.evidenceKey} />
                    <p className="text-zinc-400 text-xs leading-relaxed">{profile.description}</p>
                  </article>
                ))}
              </div>
            </div>}

          </div>}
        </div>
      </section>

      {/* SECTION 2 - LOGOWALL & DYNAMICAL DIFFERENTIALS (Ref 1 styled Color Tiles with Arrow right details) */}
      <section className="px-4 sm:px-6 md:px-8 py-20 border-b border-white/[0.04] bg-[#070709]/40 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Logo Title Block */}
          <div className="text-center space-y-3">
            <span className="tag08-meta text-xs text-brand-secondary font-black uppercase tracking-widest bg-brand/5 border border-brand/10 px-3 py-1 rounded-full inline-block">
              Confiança construída com método
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-none tracking-tighter max-w-4xl mx-auto">
              A confiança vem da forma como o trabalho é conduzido.
            </h2>
            <p className="font-sans text-xs sm:text-xs text-zinc-400 leading-relaxed max-w-3xl mx-auto">
              A TAG08 constrói relações a partir de diagnóstico, clareza de escopo, coordenação e execução responsável. Mais do que parecer grande, o trabalho precisa fazer sentido para o momento real da marca.
            </p>
          </div>

          {/* Reference 1: "Fast and flexible" colored tiles grid layout with top right oblique arrow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
            {CORES_DIFERENCIAIS.map((tile, i) => (
              <div
                key={i}
                className={`group border rounded-3xl p-6 flex flex-col justify-between text-left transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] relative overflow-hidden min-h-[220px] bg-white/[0.01] ${tile.gradientClass}`}
              >
                {/* Background light gradient overlay inside each card to mimic color matching */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

                {/* Top-Right Discretionary Arrow pointing high right, mimicking Teamway "Fast and flexible" visual key */}
                <div className="absolute top-5 right-6 flex items-center justify-center w-7 h-7 bg-white/[0.02] border border-white/5 group-hover:bg-brand group-hover:border-brand rounded-full transition-all text-zinc-500 group-hover:text-black">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                {/* Top badge or pill info */}
                <span className={`tag08-meta text-xs font-black tracking-widest uppercase ${tile.iconColor} bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded-md self-start mb-4`}>
                  {tile.badge}
                </span>

                {/* Text Title & body */}
                <div className="space-y-2 mt-auto">
                  <h3 className="font-display font-black text-sm text-white tracking-tight leading-snug group-hover:text-white transition-colors">
                    {tile.title}
                  </h3>
                  <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors text-xs leading-relaxed font-sans font-medium">
                    {tile.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* NOVO BLOCO: O QUE ACREDITAMOS NA PRÁTICA (Valores vivos aplicados, cultura e parceria) */}
      <section className="px-4 sm:px-6 md:px-8 py-24 border-b border-white/[0.04] bg-zinc-950 text-left">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <span className="tag08-meta text-xs tracking-widest text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/15 px-3 py-1 rounded-full uppercase inline-block">
                O que acreditamos na prática
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-white leading-tight tracking-tight">
                Presença digital precisa de direção, não de improviso.
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed max-w-md">
                A TAG08 acredita que comunicação, design, tecnologia e processos só geram valor quando estão conectados a um diagnóstico claro, a prioridades bem definidas e a uma execução possível de sustentar.
              </p>

              <div className="p-5 rounded-2xl bg-charcoal-900 border border-white/[0.03] space-y-2.5">
                <span className="font-sans text-xs text-zinc-500 block uppercase">CRITÉRIO DE BASE</span>
                <p className="text-zinc-300 text-xs font-sans leading-relaxed">
                  A TAG08 não busca parecer maior do que é. Busca construir caminhos mais claros, coerentes e sustentáveis para cada marca.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden aspect-[4/3] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left">
                <ResilientImage
                  fallbackLabel="Método TAG08"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                  alt=""
                  className="object-cover grayscale brightness-75 group-hover:scale-105 duration-1000 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-95 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
                  <div className="space-y-1">
                    <span className="tag08-meta text-xs text-brand-secondary font-black uppercase tracking-widest block">MÉTODO TAG08</span>
                    <h4 className="font-display font-black text-white text-sm sm:text-base tracking-tight leading-none">Direção aplicada</h4>
                  </div>

                  <div className="bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl font-sans text-xs text-zinc-400 flex items-center gap-1.5 select-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                    <span>Método // prática</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                title: "Clareza antes da velocidade",
                desc: "Crescer rápido sem entender o caminho costuma gerar retrabalho, ruído e decisões frágeis.",
                icon: <Target className="w-4 h-4 text-brand" />
              },
              {
                title: "Estratégia antes do volume",
                desc: "Mais conteúdo, mais campanha ou mais ferramenta não resolvem quando a mensagem, o público e o posicionamento ainda estão confusos.",
                icon: <BookOpen className="w-4 h-4 text-brand" />
              },
              {
                title: "Tecnologia com função",
                desc: "Ferramentas, sites e estruturas digitais precisam estar conectados a um objetivo claro e a uma operação capaz de utilizá-los.",
                icon: <Settings className="w-4 h-4 text-brand" />
              },
              {
                title: "Melhoria contínua",
                desc: "O trabalho não termina na publicação. Acompanhamos aprendizados, ajustamos rotas e organizamos próximos passos.",
                icon: <FileCheck2 className="w-4 h-4 text-brand" />
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-charcoal-900/60 border border-white/[0.04] hover:border-brand/10 hover:bg-white/[0.01] transition-all duration-300 text-left space-y-4 min-h-[220px]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-brand">
                    {item.icon}
                  </div>
                  <h3 className="text-white text-xs sm:text-sm font-display font-bold tracking-tight">{item.title}</h3>
                </div>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="max-w-2xl pt-8 border-t border-white/[0.04]">
            <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/[0.06] relative overflow-hidden text-left">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
              <div className="relative z-10 space-y-2">
                <h4 className="text-white font-display font-semibold text-lg tracking-tight">Próximo passo com clareza</h4>
                <p className="text-zinc-400 text-xs sm:text-sm font-sans max-w-xl leading-relaxed">
                  Antes de transformar qualquer demanda em execução, a TAG08 ajuda a organizar prioridades, identificar gargalos e indicar um caminho coerente.
                </p>
              </div>
              <button
                onClick={() => handleLinkClick("/servicos")}
                className="mt-6 group relative px-6 py-3.5 bg-brand-secondary hover:bg-brand-dark text-black text-xs tag08-meta font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shrink-0 overflow-hidden shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.15)] hover:-translate-y-0.5"
              >
                CONHECER SOLUÇÕES
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - CULTURA E COLABORAÇÃO */}
      <section className="px-4 sm:px-6 md:px-8 py-24 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-14">
          
          {/* Section Header */}
          <div className="max-w-3xl text-left space-y-3">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest block font-bold">CULTURA E COLABORAÇÃO</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-none tracking-tighter">
              Trabalhar com a TAG08 exige critério, clareza e responsabilidade.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed max-w-2xl font-medium">
              A TAG08 valoriza pessoas que sabem pensar antes de executar, respeitam processo, cuidam da qualidade e entendem que criatividade também precisa de método.
            </p>
          </div>

          {/* Bloco de princípios de colaboração */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {COLLABORATION_BLOCKS.map((vaga) => {
              const isOpen = selectedVaga === vaga.id;
              return (
                <div 
                  key={vaga.id}
                  className={`border rounded-3xl p-6 sm:p-7 text-left transition-all duration-300 relative overflow-hidden bg-charcoal-900/50 flex flex-col justify-between min-h-[300px] hover:scale-[1.01] ${vaga.color} ${
                    isOpen 
                      ? "border-brand-secondary shadow-[0_12px_30px_rgba(var(--color-brand-secondary-rgb),0.06)] bg-black/60" 
                      : "hover:border-white/10"
                  }`}
                >
                  {/* Decorative background grid subtle overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.006)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  {/* Main content block */}
                  <div className="space-y-5 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="tag08-meta text-xs text-zinc-500 font-bold uppercase tracking-widest block">
                        {vaga.area}
                      </span>
                      <span className="font-sans text-xs text-brand bg-brand/5 border border-brand/20 px-2 py-0.5 rounded font-black">
                        {vaga.tempo}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-display font-black text-white text-base sm:text-lg leading-tight tracking-tight">
                        {vaga.title}
                      </h3>
                      <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                        {vaga.desc}
                      </p>
                    </div>

                    {/* Requirements accordion with smooth react transition */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="pt-4 border-t border-white/[0.05] space-y-2.5"
                        >
                          <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest font-black block">PRINCÍPIOS ESSENCIAIS:</span>
                          <div className="space-y-1.5">
                            {vaga.requirements.map((req, rIdx) => (
                              <div key={rIdx} className="flex gap-2 text-xs text-zinc-300 items-start leading-relaxed font-sans font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                                <span>{req}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Footer interaction trigger */}
                  <div className="relative z-10 pt-6 border-t border-white/[0.05] mt-6 flex items-center justify-between">
                    <span className="tag08-meta text-xs text-white/30 uppercase tracking-widest">
                      TAG08 // CULTURA
                    </span>

                    <button
                      onClick={() => setSelectedVaga(isOpen ? null : vaga.id)}
                      className={`font-sans text-xs font-black uppercase px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                        isOpen 
                          ? "bg-brand text-black" 
                          : "bg-white/[0.01] border border-white/10 hover:border-brand/40 text-zinc-300 hover:text-white"
                      }`}
                    >
                      <span>{isOpen ? "ENTENDIDO" : "PRINCÍPIOS"}</span>
                      <ArrowRight className={`w-3 h-3 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Ponte para o trabalho conjunto */}
          <div className="max-w-5xl mx-auto rounded-3xl bg-charcoal-900 border border-white/[0.06] p-6 sm:p-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden text-left shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/[0.015] rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-1.5 max-w-xl">
              <h4 className="text-white font-display font-black text-sm sm:text-base">QUER FAZER PARTE DO JEITO TAG08 DE TRABALHAR?</h4>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                Se você se identifica com pensamento estratégico, cuidado com a entrega e responsabilidade com o processo, vale conhecer nosso espaço de colaboração.
              </p>
            </div>
            
            <button
              onClick={() => handleLinkClick("/trabalhe-conosco")}
              className="bg-brand-secondary hover:bg-brand-dark text-black font-sans font-black text-xs uppercase tracking-wider px-6 py-4 rounded-xl shadow-lg transition-all flex items-center gap-1.5 shrink-0 hover:scale-[1.02] cursor-pointer"
            >
              <span>CONHECER O TRABALHE CONOSCO</span>
              <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 5 - ACTION FOOT CTA */}
      <section className="px-4 sm:px-6 md:px-8 py-20 bg-[radial-gradient(circle_at_right_top,_rgba(var(--color-brand-rgb),0.035),_transparent_55%)]">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-secondary/10 border border-brand-secondary/30 text-brand font-black text-xs rounded-lg uppercase tracking-widest tag08-meta">
            Próximo passo
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight max-w-2xl mx-auto leading-none">
            O próximo passo começa pelo entendimento do momento atual.
          </h2>

          <p className="text-zinc-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-sans">
            Antes de propor uma solução, a TAG08 procura entender o momento, os desafios e as prioridades da marca para indicar um caminho mais claro, coerente e responsável.
          </p>

          <div className="pt-4">
            <button
              onClick={() => handleLinkClick("/contato")}
              className="bg-brand hover:bg-brand-dark text-black font-sans font-black text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_12px_45px_rgba(var(--color-brand-secondary-rgb),0.18)] flex items-center gap-1.5 mx-auto hover:scale-[1.02] cursor-pointer"
            >
              <span>FALAR COM A TAG08</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
