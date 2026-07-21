import React, { useState } from "react";
import { ArrowUpRight, Star, ArrowRight, Zap, Target, Users, Settings, BookOpen, FileCheck2, Sparkles, Cpu, Award, Shield, Check, MessageSquare, Activity, Triangle, Layers, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ResilientImage from "../../../components/ResilientImage";
import { trackOutboundClick } from "../../../lib/analytics";

interface SobreProps {
  onNavigate: (page: string) => void;
}

export default function Sobre({ onNavigate }: SobreProps) {
  const [activeTab, setActiveTab] = useState<"missao" | "origem" | "futuro">("missao");
  const [selectedVaga, setSelectedVaga] = useState<number | null>(null);

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOutboundClick = (label: string, url: string, surface: string) => {
    trackOutboundClick({
      label,
      url,
      surface
    });
  };

    const TILES_HERO = [
    {
      name: "Carlos Eduardo",
      role: "Fundador & Diretor de Criação",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      tag: "ESTRATÉGIA",
      status: "ATIVO",
      badge: "FUNDADOR",
      linkedin: "https://www.linkedin.com/in/carlos-eduardo-tag08",
      connections: "Direção",
      focus: "Posicionamento e identidade"
    },
    {
      name: "Camila Martins",
      role: "Copywriter & Roteiro",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      tag: "CONTEÚDO",
      status: "ATIVA",
      badge: "REDAÇÃO",
      linkedin: "https://www.linkedin.com/in/camila-martins-tag08",
      connections: "Linha editorial",
      focus: "Narrativa e consistência"
    },
    {
      name: "Danilo Aguiar",
      role: "Tráfego & Analytics",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      tag: "MÍDIA",
      status: "ATIVO",
      badge: "ANÁLISE",
      linkedin: "https://www.linkedin.com/in/danilo-aguiar-tag08",
      connections: "Aquisição",
      focus: "Leads e critério"
    },
    {
      name: "Lucas Henrique",
      role: "Desenvolvimento Web",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
      tag: "WEB",
      status: "ATIVO",
      badge: "ARQUITETURA",
      linkedin: "https://www.linkedin.com/in/lucas-henrique-tag08",
      connections: "Estrutura",
      focus: "Sites e experiência"
    }
  ];

  const INTEGRATION_BRANDS = [
    {
      name: "PUMA S.A.",
      icon: <Activity className="w-4 h-4 text-zinc-400 group-hover:text-brand transition-colors" />,
      tagline: "Sports Tech Corp"
    },
    {
      name: "ADIDAS LAB",
      icon: <Triangle className="w-4 h-4 text-zinc-400 group-hover:text-brand transition-colors" />,
      tagline: "Direção"
    },
    {
      name: "VELORA CORP",
      icon: <Layers className="w-4 h-4 text-zinc-400 group-hover:text-brand transition-colors" />,
      tagline: "Corporate IP"
    },
    {
      name: "TAG08 CAPITAL",
      icon: <Sparkles className="w-4 h-4 text-yellow-400 group-hover:text-brand-secondary transition-colors" />,
      tagline: "Venture Partners"
    },
    {
      name: "NATIVE LAB",
      icon: <Cpu className="w-4 h-4 text-zinc-400 group-hover:text-brand transition-colors" />,
      tagline: "React & Systems"
    },
    {
      name: "SENSITIVE SYSTEM",
      icon: <Shield className="w-4 h-4 text-zinc-400 group-hover:text-brand transition-colors" />,
      tagline: "Sec Ops Guard"
    },
    {
      name: "VORTEX STUDIOS",
      icon: <Award className="w-4 h-4 text-zinc-400 group-hover:text-brand transition-colors" />,
      tagline: "Creative Motion"
    },
    {
      name: "NEXUS GROUP",
      icon: <MessageSquare className="w-4 h-4 text-zinc-400 group-hover:text-brand transition-colors" />,
      tagline: "Conversational Ads"
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

  const VAGAS_TALENTO = [
    {
      id: 0,
      area: "DESIGN & CREATIVE BRANDS",
      title: "Designer Gráfico / Visual Sênior",
      tempo: "Remoto ⬢ Contratação Recorrente",
      desc: "Estruturação de marcas ricas heráldicas, e layouts premium de redes sociais com tipografia avançada e senso estético exigente.",
      requirements: ["Domínio cirúrgico do Figma e Illustrator", "Apego extremo a espaçamento, tracking e contrastes", "Portfólio com soluções reais corporativas de alto requinte"],
      color: "border-brand/20 shadow-brand/2"
    },
    {
      id: 1,
      area: "GROWTH & ANALYTICS S?`NIOR",
      title: "Head de Performance Google / Meta Ads",
      tempo: "Remoto ⬢ Contratação Imediata",
      desc: "Gerenciamento estratégico de orçamentos de alta intensidade de compra para marcas B2B, consultorias e saúde premium.",
      requirements: ["Mais de 4 anos gerenciando contas reais exigentes", "Habilidade cirúrgica de traduzir táticas em ROI nos relatórios", "Foco em canais Meta Ads de alto tíquete"],
      color: "border-brand/20 shadow-brand/2"
    },
    {
      id: 2,
      area: "FRONT-END ARCHITECTURE",
      title: "Dev React.js / Node.js Sênior",
      tempo: "Remoto ⬢ Banco de Talentos",
      desc: "Transformar os protótipos de alta definição do Figma em código sênior, responsivo e ultra veloz sem construtores lentos.",
      requirements: ["Domínio supremo de React, Vite, TS e Tailwind", "Apreço intransigente pelo pixel-perfect do designer", "Obssessão por otimização técnica e Core Web Vitals"],
      color: "border-brand/20 shadow-brand/2"
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
                A TAG08 é uma consultoria criativa, estratégica e operacional que conecta comunicação, design, tecnologia e processos para ajudar marcas a saírem do improviso e construírem uma presença digital mais clara, consistente e responsável.
              </p>
            </div>
          </div>

          <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left">
            <ResilientImage
              fallbackLabel="Time TAG08"
              sizes="100vw"
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1600"
              alt="Time de Especialistas TAG08"
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
                <span className="tag08-meta text-xs text-brand-secondary tracking-widest block uppercase font-bold">TAG08 LAB CONSOLE</span>
                <h4 className="font-display font-black text-white text-xs sm:text-sm tracking-tight leading-none">Presença com direção</h4>
              </div>

              <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-xs text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                <span>TAG08 // DIREÇÃO</span>
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

          <div className="pt-12 sm:pt-16 border-t border-white/[0.04] space-y-8 text-left font-sans">
            <div className="space-y-2">
              <span className="tag08-meta text-xs text-brand tracking-widest block uppercase font-bold">ENTENDIMENTO E DIREÇÃO</span>
              <h3 className="font-display font-black text-white text-xl sm:text-2xl tracking-tight">Conversas diretas com quem pensa e executa.</h3>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed max-w-2xl font-medium">
                Você conversa com quem participa da direção do trabalho, sem prometer atalhos e sem intermediários que diluem o contexto.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
              <div className="lg:col-span-5 bg-gradient-to-br from-brand-secondary/[0.08] via-zinc-950 to-transparent border border-brand-secondary/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden group min-h-[360px] shadow-[0_15px_35px_rgba(var(--color-brand-secondary-rgb),0.03)] hover:border-brand-secondary/45 transition-all duration-300">
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <ResilientImage
                    fallbackLabel="Direção TAG08"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    src={TILES_HERO[0].avatar}
                    alt={TILES_HERO[0].name}
                    className="object-cover opacity-20 grayscale brightness-[0.7] group-hover:scale-[1.01] group-hover:opacity-30 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-brand-secondary/10 backdrop-blur-md px-3 py-1 rounded-full border border-brand-secondary/20 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
                    <span className="font-sans text-xs text-brand-secondary font-extrabold uppercase tracking-widest">{TILES_HERO[0].badge}</span>
                  </div>

                  <span className="tag08-meta text-xs text-zinc-500 font-bold uppercase tracking-wider">TAG08 // DIREÇÃO</span>
                </div>

                <div className="relative z-10 space-y-4 mt-auto">
                  <div className="space-y-1">
                    <span className="font-sans text-xs text-brand block uppercase font-bold">EQUIPE E DIREÇÃO</span>
                    <h4 className="font-display font-black text-2xl sm:text-3xl text-white leading-none tracking-tight">{TILES_HERO[0].name}</h4>
                    <p className="text-zinc-300 text-xs font-sans font-medium">{TILES_HERO[0].role}</p>
                    <p className="text-brand-secondary text-xs tag08-meta uppercase tracking-wider pt-1">{TILES_HERO[0].connections} // {TILES_HERO[0].focus}</p>
                    <p className="text-zinc-400 text-xs leading-relaxed max-w-sm pt-2 italic">
                      A TAG08 conecta estratégia, comunicação, design, tecnologia e processos para ajudar marcas a saírem do improviso e construírem uma presença digital mais clara, consistente e responsável.
                    </p>
                  </div>

                  <a
                    href={TILES_HERO[0].linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-secondary hover:bg-white text-black font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg hover:-translate-y-0.5 cursor-pointer max-w-max"
                  >
                    <Linkedin className="w-3.5 h-3.5 fill-black stroke-none" />
                    <span>Conhecer perfil</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {TILES_HERO.slice(1).map((member, idx) => (
                  <div
                    key={idx}
                    className="bg-charcoal-900 border border-white/[0.08] rounded-3xl p-5 flex flex-col justify-between text-left relative overflow-hidden h-[360px] group transition-all duration-300 hover:border-brand/40"
                  >
                    <div className="absolute inset-0 z-0 pointer-events-none">
                      <ResilientImage
                        fallbackLabel="Time TAG08"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        src={member.avatar}
                        alt={member.name}
                        className="object-cover opacity-45 grayscale brightness-[0.7] group-hover:scale-105 group-hover:opacity-55 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                        <span className="font-sans text-xs text-zinc-300 font-bold">{member.badge}</span>
                      </div>

                      <span className="font-sans text-xs text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/20 px-2 py-0.5 rounded-full font-black uppercase">
                        {member.status}
                      </span>
                    </div>

                    <div className="relative z-10 space-y-3.5 mt-auto">
                      <div className="space-y-1">
                        <span className="font-sans text-xs text-brand block uppercase font-bold">{member.tag}</span>
                        <h4 className="font-display font-black text-white text-base sm:text-lg leading-none tracking-tight">{member.name}</h4>
                        <p className="text-zinc-350 text-xs font-sans font-medium leading-tight">{member.role}</p>
                        <p className="text-brand-secondary text-xs font-sans uppercase tracking-wider pb-1">{member.connections} // {member.focus}</p>
                      </div>

                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-brand-secondary hover:text-black hover:font-bold border border-white/10 hover:border-transparent text-zinc-300 rounded-xl text-xs tag08-action tracking-widest transition-all duration-300 uppercase self-start"
                      >
                        <Linkedin className="w-3 h-3 fill-current stroke-none" />
                        <span>Ver perfil</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.06] rounded-3xl p-6 sm:p-10 relative overflow-hidden text-left mt-10">
              <div className="absolute top-[-30px] right-[-30px] w-64 h-64 bg-brand-secondary/[0.02] rounded-full blur-[100px] pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className="lg:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary tag08-meta text-xs lg:text-xs font-black tracking-widest uppercase">
                    <span>Rede de contexto e direção</span>
                  </div>
                  <h4 className="font-display font-black text-white text-lg sm:text-2xl tracking-tight leading-none">Acompanhe a TAG08 no LinkedIn</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed max-w-2xl font-medium">
                    Publicamos referências, bastidores e atualizações do que estamos construindo, sempre com foco em direção, método e aprendizagem aplicada.
                  </p>
                </div>

                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end w-full">
                  <div className="bg-black/45 border border-white/5 rounded-2xl p-4 text-center sm:text-left lg:text-left flex-1">
                    <span className="block font-display font-black text-xl text-brand-secondary">Direção</span>
                    <span className="block text-zinc-500 tag08-meta text-xs uppercase tracking-wider">Linha editorial e critério</span>
                  </div>
                  <div className="bg-black/45 border border-white/5 rounded-2xl p-4 text-center sm:text-left lg:text-left flex-1">
                    <span className="block font-display font-black text-xl text-white">Método</span>
                    <span className="block text-zinc-500 tag08-meta text-xs uppercase tracking-wider">Processo, postura e entrega</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              A TAG08 constrói relações a partir de diagnóstico, clareza de escopo, comunicação objetiva e execução responsável. Mais do que parecer grande, o trabalho precisa fazer sentido para o momento real da marca.
            </p>
            {/* Infinite Logo Marquee Carousel */}
            <div className="w-full overflow-hidden relative pt-8 pb-4 opacity-75 hover:opacity-100 transition-opacity duration-300 select-none">
              {/* Fade gradient masks for smooth entry/exit edges */}
              <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#070709] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#070709] to-transparent z-10 pointer-events-none" />
              
              <div className="animate-marquee flex gap-6">
                {/* First Copy */}
                {INTEGRATION_BRANDS.map((brand, index) => (
                  <div 
                    key={`brand-1-${index}`} 
                    className="flex items-center gap-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-brand/20 py-3 px-5 rounded-2xl transition-all duration-300 group shrink-0 select-none"
                  >
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                      {brand.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-display font-black text-xs sm:text-xs tracking-wider text-zinc-300 group-hover:text-white transition-colors uppercase leading-none">
                        {brand.name}
                      </div>
                      <span className="tag08-meta text-xs text-zinc-500 block uppercase tracking-widest mt-1">
                        {brand.tagline}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Second Copy for Perfect Infinite Loop Alignment */}
                {INTEGRATION_BRANDS.map((brand, index) => (
                  <div 
                    key={`brand-2-${index}`} 
                    className="flex items-center gap-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-brand/20 py-3 px-5 rounded-2xl transition-all duration-300 group shrink-0 select-none"
                  >
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                      {brand.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-display font-black text-xs sm:text-xs tracking-wider text-zinc-300 group-hover:text-white transition-colors uppercase leading-none">
                        {brand.name}
                      </div>
                      <span className="tag08-meta text-xs text-zinc-500 block uppercase tracking-widest mt-1">
                        {brand.tagline}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section Divider Concept Title */}
          <div className="max-w-3xl text-left space-y-3 pt-6">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest block font-bold">Diferenciais TAG08</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-none tracking-tighter">
              Quatro critérios que orientam a entrega.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed max-w-2xl">
              A TAG08 organiza estratégia, escopo, coordenação e revisão para evitar ruído e manter o trabalho coerente com o momento real da marca.
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
                  alt="Time de Especialistas TAG08"
                  className="object-cover grayscale brightness-75 group-hover:scale-105 duration-1000 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-95 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
                  <div className="space-y-1">
                    <span className="tag08-meta text-xs text-brand-secondary font-black uppercase tracking-widest block">TAG08 LAB CONSOLE</span>
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
                title: "Execução com responsabilidade",
                desc: "Cada entrega precisa respeitar escopo, contexto, prazo possível, qualidade e capacidade operacional.",
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-white/[0.04]">
            <div className="lg:col-span-7 space-y-8 bg-charcoal-900/40 p-8 rounded-3xl border border-white/[0.04]">
              <div className="space-y-2">
                <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-wider">FECHAMENTO OPERACIONAL</span>
                <h3 className="font-display font-medium text-xl sm:text-2xl text-white tracking-tight">
                  O que acreditamos vira critério de entrega.
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                  A TAG08 não busca parecer maior do que é. Busca construir caminhos mais claros, coerentes e sustentáveis para cada marca.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Contexto", desc: "Entender o momento da marca antes de propor soluções." },
                  { title: "Critério", desc: "Delimitar o que faz sentido executar agora e o que deve esperar." },
                  { title: "Sustentação", desc: "Organizar entregas que possam ser mantidas com responsabilidade." },
                  { title: "Continuidade", desc: "Revisar, ajustar e seguir com próximos passos mais claros." }
                ].map((point, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-brand/[0.01] border border-brand/5 space-y-1.5 hover:border-brand/20 transition-all">
                    <span className="font-sans text-xs text-brand font-bold">0{idx + 1}</span>
                    <h4 className="text-white text-xs font-display font-bold tracking-tight">{point.title}</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans">{point.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6 self-stretch flex flex-col justify-between">
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

              <div className="p-6 rounded-3xl bg-charcoal-900/40 border border-white/[0.04] space-y-4">
                <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-wider">APRENDIZADO EM PRÁTICA</span>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                  O trabalho não termina na publicação. Acompanhamos aprendizados, ajustamos rotas e organizamos próximos passos.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
                    <span className="block text-white text-xs font-display font-bold uppercase tracking-tight">Clareza</span>
                    <span className="block text-zinc-500 text-xs mt-1">A leitura vem antes da pressa.</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
                    <span className="block text-white text-xs font-display font-bold uppercase tracking-tight">Continuidade</span>
                    <span className="block text-zinc-500 text-xs mt-1">A execução sustenta o que foi acordado.</span>
                  </div>
                </div>
              </div>
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
            Pr?ximo passo
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight max-w-2xl mx-auto leading-none">
            Vamos entender como a TAG08 pode ajudar sua marca?
          </h2>

          <p className="text-zinc-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-sans">
            Antes de propor qualquer solução, entendemos o momento, os desafios e as prioridades da sua marca para indicar um caminho mais claro, coerente e responsável.
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
