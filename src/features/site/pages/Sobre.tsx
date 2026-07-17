import React, { useState } from "react";
import { ArrowUpRight, Star, ArrowRight, Zap, Target, Users, Settings, BookOpen, FileCheck2, Sparkles, Cpu, Award, Shield, Check, MessageSquare, Activity, Triangle, Layers, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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
      role: "Fundador & Diretor de CriaÃ§Ã£o",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      tag: "ESTRATÃ‰GIA",
      status: "ATIVO",
      badge: "FUNDADOR",
      linkedin: "https://www.linkedin.com/in/carlos-eduardo-tag08",
      connections: "DireÃ§Ã£o",
      focus: "Posicionamento e identidade"
    },
    {
      name: "Camila Martins",
      role: "Copywriter & Roteiro",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      tag: "CONTEÃšDO",
      status: "ATIVA",
      badge: "REDA??O",
      linkedin: "https://www.linkedin.com/in/camila-martins-tag08",
      connections: "Linha editorial",
      focus: "Narrativa e consistÃªncia"
    },
    {
      name: "Danilo Aguiar",
      role: "TrÃ¡fego & Analytics",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      tag: "MÃDIA",
      status: "ATIVO",
      badge: "ANÃLISE",
      linkedin: "https://www.linkedin.com/in/danilo-aguiar-tag08",
      connections: "AquisiÃ§Ã£o",
      focus: "Leads e critÃ©rio"
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
      focus: "Sites e experiÃªncia"
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
      tagline: "DireÃ§Ã£o"
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
      icon: <Award className="w-4 h-4 text-zinc-400 group-hover:text-brand-secondary transition-colors" />,
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
      title: "DiagnÃ³stico antes da execuÃ§Ã£o",
      desc: "Antes de propor entregas, entendemos contexto, gargalos, prioridades e capacidade real de execuÃ§Ã£o.",
      gradientClass: "from-brand-secondary/10 to-transparent border-brand-secondary/15 hover:border-brand-secondary/35",
      iconColor: "text-brand-secondary",
      badge: "DIAGNÃ“STICO",
      delay: 0.1
    },
    {
      title: "Clareza de escopo",
      desc: "Organizamos o que serÃ¡ feito, por que serÃ¡ feito, o que fica fora e quais prÃ³ximos passos sÃ£o viÃ¡veis.",
      gradientClass: "from-purple-500/10 to-transparent border-purple-500/15 hover:border-purple-500/35",
      iconColor: "text-[#a855f7]",
      badge: "ESCOPO",
      delay: 0.2
    },
    {
      title: "CoordenaÃ§Ã£o entre Ã¡reas",
      desc: "Conectamos estratÃ©gia, conteÃºdo, design, tecnologia e processos para evitar soluÃ§Ãµes soltas.",
      gradientClass: "from-blue-500/10 to-transparent border-blue-500/15 hover:border-blue-500/35",
      iconColor: "text-[#3b82f6]",
      badge: "COORDENA??O",
      delay: 0.3
    },
    {
      title: "Entrega com responsabilidade",
      desc: "A execuÃ§Ã£o acontece com critÃ©rio, revisÃ£o e alinhamento, sem promessa artificial ou pressÃ£o por atalhos.",
      gradientClass: "from-emerald-500/10 to-transparent border-emerald-500/15 hover:border-emerald-500/35",
      iconColor: "text-[#10b981]",
      badge: "RESPONSABILIDADE",
      delay: 0.4
    }
  ];

  const VAGAS_TALENTO = [
    {
      id: 0,
      area: "DESIGN & CREATIVE BRANDS",
      title: "Designer GrÃ¡fico / Visual SÃªnior",
      tempo: "Remoto â¬¢ ContrataÃ§Ã£o Recorrente",
      desc: "EstruturaÃ§Ã£o de marcas ricas herÃ¡ldicas, e layouts premium de redes sociais com tipografia avanÃ§ada e senso estÃ©tico exigente.",
      requirements: ["DomÃ­nio cirÃºrgico do Figma e Illustrator", "Apego extremo a espaÃ§amento, tracking e contrastes", "PortfÃ³lio com soluÃ§Ãµes reais corporativas de alto requinte"],
      color: "border-brand-secondary/20 shadow-brand-secondary/2"
    },
    {
      id: 1,
      area: "GROWTH & ANALYTICS S?`NIOR",
      title: "Head de Performance Google / Meta Ads",
      tempo: "Remoto â¬¢ ContrataÃ§Ã£o Imediata",
      desc: "Gerenciamento estratÃ©gico de orÃ§amentos de alta intensidade de compra para marcas B2B, consultorias e saÃºde premium.",
      requirements: ["Mais de 4 anos gerenciando contas reais exigentes", "Habilidade cirÃºrgica de traduzir tÃ¡ticas em ROI nos relatÃ³rios", "Foco em canais Meta Ads de alto tÃ­quete"],
      color: "border-purple-500/20 shadow-purple-500/2"
    },
    {
      id: 2,
      area: "FRONT-END ARCHITECTURE",
      title: "Dev React.js / Node.js SÃªnior",
      tempo: "Remoto Ã¢Â¬Â¢ Banco de Talentos",
      desc: "Transformar os protÃ³tipos de alta definiÃ§Ã£o do Figma em cÃ³digo sÃªnior, responsivo e ultra veloz sem construtores lentos.",
      requirements: ["DomÃ­nio supremo de React, Vite, TS e Tailwind", "ApreÃ§o intransigente pelo pixel-perfect do designer", "ObssessÃ£o por otimizaÃ§Ã£o tÃ©cnica e Core Web Vitals"],
      color: "border-blue-500/20 shadow-blue-500/2"
    }
  ];

  const COLLABORATION_BLOCKS = [
    {
      id: 0,
      area: "COLABORA??O",
      title: "Pensamento estratÃ©gico",
      tempo: "Cultura TAG08",
      desc: "Buscamos pessoas que entendam contexto, faÃ§am boas perguntas e conectem execuÃ§Ã£o com objetivo.",
      requirements: ["Leitura de contexto antes da tarefa", "Perguntas que melhoram a direÃ§Ã£o", "Capacidade de ligar detalhe e resultado"],
      color: "border-brand-secondary/20 shadow-brand-secondary/2"
    },
    {
      id: 1,
      area: "PADR?O DE ENTREGA",
      title: "Cuidado com a entrega",
      tempo: "Processo e revisÃ£o",
      desc: "Qualidade nÃ£o Ã© detalhe final. Ã‰ postura durante briefing, produÃ§Ã£o, revisÃ£o e melhoria.",
      requirements: ["AtenÃ§Ã£o ao briefing e ao escopo", "Ritmo consistente de revisÃ£o", "Compromisso com a melhoria contÃ­nua"],
      color: "border-purple-500/20 shadow-purple-500/2"
    },
    {
      id: 2,
      area: "PROCESSO",
      title: "Responsabilidade com o processo",
      tempo: "Equipe e rotina",
      desc: "Trabalhar bem em equipe exige clareza de escopo, prazos possÃ­veis, comunicaÃ§Ã£o objetiva e registro das decisÃµes.",
      requirements: ["Escopo claro antes da execuÃ§Ã£o", "ComunicaÃ§Ã£o objetiva entre Ã¡reas", "Registro das decisÃµes e prÃ³ximos passos"],
      color: "border-blue-500/20 shadow-blue-500/2"
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono self-start font-bold">
                Sobre a TAG08
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter uppercase">
                DireÃ§Ã£o para construir presenÃ§a. <br />
                <span className="text-brand">Estrutura para sustentar crescimento.</span>
              </h1>
            </div>

            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-sans font-medium">
                A TAG08 Ã© uma consultoria criativa, estratÃ©gica e operacional que conecta comunicaÃ§Ã£o, design, tecnologia e processos para ajudar marcas a saÃ­rem do improviso e construÃ­rem uma presenÃ§a digital mais clara, consistente e responsÃ¡vel.
              </p>
            </div>
          </div>

          <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1600"
              alt="Time de Especialistas TAG08"
              className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-[1.01] transition-all duration-1000 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />

            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => handleLinkClick("/contato")}
                className="group bg-brand-secondary text-black font-mono font-black text-[10px] sm:text-[11px] uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] hover:scale-105 duration-300 transition-all border border-brand-secondary hover:bg-brand-dark flex items-center gap-2 cursor-pointer z-20"
              >
                <span>FALAR COM A TAG08</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
              <div className="space-y-1">
                <span className="font-mono text-[8.5px] text-brand-secondary tracking-widest block uppercase font-bold">TAG08 LAB CONSOLE</span>
                <h4 className="font-display font-black text-white text-xs sm:text-sm uppercase tracking-tight leading-none">PresenÃ§a com direÃ§Ã£o</h4>
              </div>

              <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-[8px] text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                <span>TAG08 // DIRE??O</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Clareza</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Entendimento do momento<br />da marca</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">MÃ©todo</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">DireÃ§Ã£o antes da execuÃ§Ã£o</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Estrutura</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">ComunicaÃ§Ã£o, design e operaÃ§Ã£o<br />organizados com critÃ©rio</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">ExecuÃ§Ã£o responsÃ¡vel</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Entrega acompanhada<br />e sustentada no tempo</span>
            </div>
          </div>

          <div className="pt-12 sm:pt-16 border-t border-white/[0.04] space-y-8 text-left font-sans">
            <div className="space-y-2">
              <span className="font-mono text-[8px] text-brand tracking-widest block uppercase font-bold">ENTENDIMENTO E DIRE??O</span>
              <h3 className="font-display font-black text-white text-xl sm:text-2xl uppercase tracking-tight">Conversas diretas com quem pensa e executa.</h3>
              <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed max-w-2xl font-medium">
                VocÃª conversa com quem participa da direÃ§Ã£o do trabalho, sem prometer atalhos e sem intermediÃ¡rios que diluem o contexto.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
              <div className="lg:col-span-5 bg-gradient-to-br from-brand-secondary/[0.08] via-zinc-950 to-transparent border border-brand-secondary/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden group min-h-[360px] shadow-[0_15px_35px_rgba(var(--color-brand-secondary-rgb),0.03)] hover:border-brand-secondary/45 transition-all duration-300">
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <img
                    src={TILES_HERO[0].avatar}
                    alt={TILES_HERO[0].name}
                    className="w-full h-full object-cover opacity-20 grayscale brightness-[0.7] group-hover:scale-[1.01] group-hover:opacity-30 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-brand-secondary/10 backdrop-blur-md px-3 py-1 rounded-full border border-brand-secondary/20 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
                    <span className="font-sans text-[7.5px] text-brand-secondary font-extrabold uppercase tracking-widest">{TILES_HERO[0].badge}</span>
                  </div>

                  <span className="font-mono text-[8px] text-zinc-500 font-bold uppercase tracking-wider">TAG08 // DIRE??O</span>
                </div>

                <div className="relative z-10 space-y-4 mt-auto">
                  <div className="space-y-1">
                    <span className="font-mono text-[8.5px] text-brand block uppercase font-bold">EQUIPE E DIRE??O</span>
                    <h4 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-none tracking-tight">{TILES_HERO[0].name}</h4>
                    <p className="text-zinc-300 text-xs font-sans font-medium">{TILES_HERO[0].role}</p>
                    <p className="text-brand-secondary text-[8.5px] font-mono uppercase tracking-wider pt-1">{TILES_HERO[0].connections} // {TILES_HERO[0].focus}</p>
                    <p className="text-zinc-400 text-xs leading-relaxed max-w-sm pt-2 italic">
                      A TAG08 conecta estratÃ©gia, comunicaÃ§Ã£o, design, tecnologia e processos para ajudar marcas a saÃ­rem do improviso e construÃ­rem uma presenÃ§a digital mais clara, consistente e responsÃ¡vel.
                    </p>
                  </div>

                  <a
                    href={TILES_HERO[0].linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-secondary hover:bg-white text-black font-sans font-bold text-[9.5px] uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg hover:-translate-y-0.5 cursor-pointer max-w-max"
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
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover opacity-45 grayscale brightness-[0.7] group-hover:scale-105 group-hover:opacity-55 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                        <span className="font-sans text-[7px] text-zinc-300 font-bold">{member.badge}</span>
                      </div>

                      <span className="font-sans text-[7.5px] text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/20 px-2 py-0.5 rounded-full font-black uppercase">
                        {member.status}
                      </span>
                    </div>

                    <div className="relative z-10 space-y-3.5 mt-auto">
                      <div className="space-y-1">
                        <span className="font-mono text-[8px] text-brand block uppercase font-bold">{member.tag}</span>
                        <h4 className="font-display font-black text-white text-base sm:text-lg uppercase leading-none tracking-tight">{member.name}</h4>
                        <p className="text-zinc-350 text-xs font-sans font-medium leading-tight">{member.role}</p>
                        <p className="text-brand-secondary text-[7.5px] font-sans uppercase tracking-wider pb-1">{member.connections} // {member.focus}</p>
                      </div>

                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-brand-secondary hover:text-black hover:font-bold border border-white/10 hover:border-transparent text-zinc-300 rounded-xl text-[9px] font-mono tracking-widest transition-all duration-300 uppercase self-start"
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
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary font-mono text-[8px] lg:text-[9.5px] font-black tracking-widest uppercase">
                    <span>Rede de contexto e direÃ§Ã£o</span>
                  </div>
                  <h4 className="font-display font-black text-white text-lg sm:text-2xl uppercase tracking-tight leading-none">Acompanhe a TAG08 no LinkedIn</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed max-w-2xl font-medium">
                    Publicamos referÃªncias, bastidores e atualizaÃ§Ãµes do que estamos construindo, sempre com foco em direÃ§Ã£o, mÃ©todo e aprendizagem aplicada.
                  </p>
                </div>

                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end w-full">
                  <div className="bg-black/45 border border-white/5 rounded-2xl p-4 text-center sm:text-left lg:text-left flex-1">
                    <span className="block font-display font-black text-xl text-brand-secondary">DireÃ§Ã£o</span>
                    <span className="block text-zinc-500 font-mono text-[8px] uppercase tracking-wider">Linha editorial e critÃ©rio</span>
                  </div>
                  <div className="bg-black/45 border border-white/5 rounded-2xl p-4 text-center sm:text-left lg:text-left flex-1">
                    <span className="block font-display font-black text-xl text-white">MÃ©todo</span>
                    <span className="block text-zinc-500 font-mono text-[8px] uppercase tracking-wider">Processo, postura e entrega</span>
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
            <span className="font-mono text-[9px] text-brand-secondary font-black uppercase tracking-widest bg-brand/5 border border-brand/10 px-3 py-1 rounded-full inline-block">
              ConfianÃ§a construÃ­da com mÃ©todo
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase leading-none tracking-tighter max-w-4xl mx-auto">
              A confianÃ§a vem da forma como o trabalho Ã© conduzido.
            </h2>
            <p className="font-sans text-xs sm:text-[13px] text-zinc-400 leading-relaxed max-w-3xl mx-auto">
              A TAG08 constrÃ³i relaÃ§Ãµes a partir de diagnÃ³stico, clareza de escopo, comunicaÃ§Ã£o objetiva e execuÃ§Ã£o responsÃ¡vel. Mais do que parecer grande, o trabalho precisa fazer sentido para o momento real da marca.
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
                      <div className="font-display font-black text-[11px] sm:text-[12px] tracking-wider text-zinc-300 group-hover:text-white transition-colors uppercase leading-none">
                        {brand.name}
                      </div>
                      <span className="font-mono text-[8px] text-zinc-500 block uppercase tracking-widest mt-1">
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
                      <div className="font-display font-black text-[11px] sm:text-[12px] tracking-wider text-zinc-300 group-hover:text-white transition-colors uppercase leading-none">
                        {brand.name}
                      </div>
                      <span className="font-mono text-[8px] text-zinc-500 block uppercase tracking-widest mt-1">
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
            <span className="font-mono text-xs text-brand uppercase tracking-widest block font-bold">Diferenciais TAG08</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase leading-none tracking-tighter">
              Quatro critÃ©rios que orientam a entrega.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed max-w-2xl">
              A TAG08 organiza estratÃ©gia, escopo, coordenaÃ§Ã£o e revisÃ£o para evitar ruÃ­do e manter o trabalho coerente com o momento real da marca.
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
                <span className={`font-mono text-[8px] font-black tracking-widest uppercase ${tile.iconColor} bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded-md self-start mb-4`}>
                  {tile.badge}
                </span>

                {/* Text Title & body */}
                <div className="space-y-2 mt-auto">
                  <h3 className="font-display font-black text-sm text-white uppercase tracking-tight leading-snug group-hover:text-white transition-colors">
                    {tile.title}
                  </h3>
                  <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors text-[11px] leading-relaxed font-sans font-medium">
                    {tile.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* NOVO BLOCO: O QUE ACREDITAMOS NA PRÃTICA (Valores vivos aplicados, cultura e parceria) */}
      <section className="px-4 sm:px-6 md:px-8 py-24 border-b border-white/[0.04] bg-zinc-950 text-left">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <span className="font-mono text-[9px] tracking-widest text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/15 px-3 py-1 rounded-full uppercase inline-block">
                O que acreditamos na prÃ¡tica
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-white uppercase leading-tight tracking-tight">
                PresenÃ§a digital precisa de direÃ§Ã£o, nÃ£o de improviso.
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed max-w-md">
                A TAG08 acredita que comunicaÃ§Ã£o, design, tecnologia e processos sÃ³ geram valor quando estÃ£o conectados a um diagnÃ³stico claro, a prioridades bem definidas e a uma execuÃ§Ã£o possÃ­vel de sustentar.
              </p>

              <div className="p-5 rounded-2xl bg-charcoal-900 border border-white/[0.03] space-y-2.5">
                <span className="font-mono text-[8px] text-zinc-500 block uppercase">CRITÃ‰RIO DE BASE</span>
                <p className="text-zinc-300 text-xs font-sans leading-relaxed">
                  A TAG08 nÃ£o busca parecer maior do que Ã©. Busca construir caminhos mais claros, coerentes e sustentÃ¡veis para cada marca.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden aspect-[4/3] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                  alt="Time de Especialistas TAG08"
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-105 duration-1000 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-95 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] text-brand-secondary font-black uppercase tracking-widest block">TAG08 LAB CONSOLE</span>
                    <h4 className="font-display font-black text-white text-sm sm:text-base uppercase tracking-tight leading-none">DireÃ§Ã£o aplicada</h4>
                  </div>

                  <div className="bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl font-sans text-[8px] text-zinc-400 flex items-center gap-1.5 select-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                    <span>MÃ©todo // prÃ¡tica</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                title: "Clareza antes da velocidade",
                desc: "Crescer rÃ¡pido sem entender o caminho costuma gerar retrabalho, ruÃ­do e decisÃµes frÃ¡geis.",
                icon: <Target className="w-4 h-4 text-brand" />
              },
              {
                title: "EstratÃ©gia antes do volume",
                desc: "Mais conteÃºdo, mais campanha ou mais ferramenta nÃ£o resolvem quando a mensagem, o pÃºblico e o posicionamento ainda estÃ£o confusos.",
                icon: <BookOpen className="w-4 h-4 text-brand" />
              },
              {
                title: "ExecuÃ§Ã£o com responsabilidade",
                desc: "Cada entrega precisa respeitar escopo, contexto, prazo possÃ­vel, qualidade e capacidade operacional.",
                icon: <Settings className="w-4 h-4 text-brand" />
              },
              {
                title: "Melhoria contÃ­nua",
                desc: "O trabalho nÃ£o termina na publicaÃ§Ã£o. Acompanhamos aprendizados, ajustamos rotas e organizamos prÃ³ximos passos.",
                icon: <FileCheck2 className="w-4 h-4 text-brand" />
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-charcoal-900/60 border border-white/[0.04] hover:border-brand/10 hover:bg-white/[0.01] transition-all duration-300 text-left space-y-4 min-h-[220px]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-brand">
                    {item.icon}
                  </div>
                  <h3 className="text-white text-xs sm:text-sm font-display font-bold uppercase tracking-tight">{item.title}</h3>
                </div>
                <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-white/[0.04]">
            <div className="lg:col-span-7 space-y-8 bg-charcoal-900/40 p-8 rounded-3xl border border-white/[0.04]">
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-wider">FECHAMENTO OPERACIONAL</span>
                <h3 className="font-display font-medium text-xl sm:text-2xl text-white uppercase tracking-tight">
                  O que acreditamos vira critÃ©rio de entrega.
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                  A TAG08 nÃ£o busca parecer maior do que Ã©. Busca construir caminhos mais claros, coerentes e sustentÃ¡veis para cada marca.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Contexto", desc: "Entender o momento da marca antes de propor soluÃ§Ãµes." },
                  { title: "CritÃ©rio", desc: "Delimitar o que faz sentido executar agora e o que deve esperar." },
                  { title: "SustentaÃ§Ã£o", desc: "Organizar entregas que possam ser mantidas com responsabilidade." },
                  { title: "Continuidade", desc: "Revisar, ajustar e seguir com prÃ³ximos passos mais claros." }
                ].map((point, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-brand/[0.01] border border-brand/5 space-y-1.5 hover:border-brand/20 transition-all">
                    <span className="font-mono text-[9px] text-brand font-bold">0{idx + 1}</span>
                    <h4 className="text-white text-xs font-display font-bold uppercase tracking-tight">{point.title}</h4>
                    <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">{point.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6 self-stretch flex flex-col justify-between">
              <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/[0.06] relative overflow-hidden text-left">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
                <div className="relative z-10 space-y-2">
                  <h4 className="text-white font-display font-semibold text-lg uppercase tracking-tight">PrÃ³ximo passo com clareza</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm font-sans max-w-xl leading-relaxed">
                    Antes de transformar qualquer demanda em execuÃ§Ã£o, a TAG08 ajuda a organizar prioridades, identificar gargalos e indicar um caminho coerente.
                  </p>
                </div>
                <button
                  onClick={() => handleLinkClick("/servicos")}
                  className="mt-6 group relative px-6 py-3.5 bg-brand-secondary hover:bg-brand-dark text-black text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shrink-0 overflow-hidden shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.15)] hover:-translate-y-0.5"
                >
                  CONHECER SOLUÃ‡Ã•ES
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-charcoal-900/40 border border-white/[0.04] space-y-4">
                <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-wider">APRENDIZADO EM PRÃTICA</span>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                  O trabalho nÃ£o termina na publicaÃ§Ã£o. Acompanhamos aprendizados, ajustamos rotas e organizamos prÃ³ximos passos.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
                    <span className="block text-white text-xs font-display font-bold uppercase tracking-tight">Clareza</span>
                    <span className="block text-zinc-500 text-[11px] mt-1">A leitura vem antes da pressa.</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
                    <span className="block text-white text-xs font-display font-bold uppercase tracking-tight">Continuidade</span>
                    <span className="block text-zinc-500 text-[11px] mt-1">A execuÃ§Ã£o sustenta o que foi acordado.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - CULTURA E COLABORA??O */}
      <section className="px-4 sm:px-6 md:px-8 py-24 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-14">
          
          {/* Section Header */}
          <div className="max-w-3xl text-left space-y-3">
            <span className="font-mono text-xs text-brand uppercase tracking-widest block font-bold">CULTURA E COLABORA??O</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase leading-none tracking-tighter">
              Trabalhar com a TAG08 exige critÃ©rio, clareza e responsabilidade.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed max-w-2xl font-medium">
              A TAG08 valoriza pessoas que sabem pensar antes de executar, respeitam processo, cuidam da qualidade e entendem que criatividade tambÃ©m precisa de mÃ©todo.
            </p>
          </div>

          {/* Bloco de princÃ­pios de colaboraÃ§Ã£o */}
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
                      <span className="font-mono text-[8.5px] text-zinc-500 font-bold uppercase tracking-widest block">
                        {vaga.area}
                      </span>
                      <span className="font-sans text-[8px] text-brand bg-brand/5 border border-brand/20 px-2 py-0.5 rounded font-black">
                        {vaga.tempo}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-display font-black text-white text-base sm:text-lg uppercase leading-tight tracking-tight">
                        {vaga.title}
                      </h3>
                      <p className="text-zinc-400 text-[11.5px] leading-relaxed font-sans">
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
                          <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-black block">PRINCÃPIOS ESSENCIAIS:</span>
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
                    <span className="font-mono text-[8.5px] text-white/30 uppercase tracking-widest">
                      TAG08 // CULTURA
                    </span>

                    <button
                      onClick={() => setSelectedVaga(isOpen ? null : vaga.id)}
                      className={`font-mono text-[9px] font-black uppercase px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                        isOpen 
                          ? "bg-brand text-black" 
                          : "bg-white/[0.01] border border-white/10 hover:border-brand/40 text-zinc-300 hover:text-white"
                      }`}
                    >
                      <span>{isOpen ? "ENTENDIDO" : "PRINCÃPIOS"}</span>
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
              <h4 className="text-white font-display font-black text-sm sm:text-base uppercase">QUER FAZER PARTE DO JEITO TAG08 DE TRABALHAR?</h4>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                Se vocÃª se identifica com pensamento estratÃ©gico, cuidado com a entrega e responsabilidade com o processo, vale conhecer nosso espaÃ§o de colaboraÃ§Ã£o.
              </p>
            </div>
            
            <button
              onClick={() => handleLinkClick("/trabalhe-conosco")}
              className="bg-brand-secondary hover:bg-brand-dark text-black font-mono font-black text-[10px] uppercase tracking-wider px-6 py-4 rounded-xl shadow-lg transition-all flex items-center gap-1.5 shrink-0 hover:scale-[1.02] cursor-pointer"
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-secondary/10 border border-brand-secondary/30 text-brand font-black text-[9px] rounded-lg uppercase tracking-widest font-mono">
            Pr?ximo passo
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight max-w-2xl mx-auto leading-none">
            Vamos entender como a TAG08 pode ajudar sua marca?
          </h2>

          <p className="text-zinc-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-sans">
            Antes de propor qualquer solu??o, entendemos o momento, os desafios e as prioridades da sua marca para indicar um caminho mais claro, coerente e respons?vel.
          </p>

          <div className="pt-4">
            <button
              onClick={() => handleLinkClick("/contato")}
              className="bg-brand hover:bg-brand-dark text-black font-mono font-black text-[10px] uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_12px_45px_rgba(var(--color-brand-secondary-rgb),0.18)] flex items-center gap-1.5 mx-auto hover:scale-[1.02] cursor-pointer"
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
