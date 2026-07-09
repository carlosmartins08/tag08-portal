import React, { useState } from "react";
import { ArrowUpRight, Star, ArrowRight, Zap, Target, Users, Settings, BookOpen, FileCheck2, Sparkles, Cpu, Award, Shield, Check, MessageSquare, Activity, Triangle, Layers, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { trackOutboundClick } from "../lib/analytics";

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
      tag: "ESTÉTICA SOBERANA",
      status: "ONLINE",
      badge: "FUNDADOR",
      linkedin: "https://www.linkedin.com/in/carlos-eduardo-tag08",
      connections: "12k+ Conexões",
      focus: "Branding de Luxo & Design Estratégico"
    },
    {
      name: "Camila Martins",
      role: "Copywriter & Roteiro Sênior",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      tag: "TEXTO MAGNÉTICO",
      status: "FOCO TOTAL",
      badge: "RETENÇÃO SÊNIOR",
      linkedin: "https://www.linkedin.com/in/camila-martins-tag08",
      connections: "6.8k+ Conexões",
      focus: "Storytelling de Elite & Posicionamento"
    },
    {
      name: "Danilo Aguiar",
      role: "Tráfego Cirúrgico & Analytics",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      tag: "ALTA INTENÇÃO B2B",
      status: "CAMPANHA ATIVA",
      badge: "ALFA INTEL",
      linkedin: "https://www.linkedin.com/in/danilo-aguiar-tag08",
      connections: "8.5k+ Conexões",
      focus: "Atribuição Google/Meta High-Ticket"
    },
    {
      name: "Lucas Henrique",
      role: "Full-Stack Web Dev Lead",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
      tag: "REACTIVE CODING SPA",
      status: "ONLINE",
      badge: "ZERO TEMPLATES",
      linkedin: "https://www.linkedin.com/in/lucas-henrique-tag08",
      connections: "5.2k+ Conexões",
      focus: "Engenharia Web & Carregamento < 2s"
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
      tagline: "Performance"
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
      title: "Design Sênior Centrado na Autenticidade",
      desc: "Não usamos bancos de imagens clichês ou diagramação amadora que desvalorizam o preço final do seu serviço.",
      gradientClass: "from-brand-secondary/10 to-transparent border-brand-secondary/15 hover:border-brand-secondary/35",
      iconColor: "text-brand-secondary",
      badge: "ZERO CORES PADRÒO",
      delay: 0.1
    },
    {
      title: "Performance Operacional Sob Demanda",
      desc: "Canalizamos verba para funis segmentados com base em intenção de compra exata de diretores e tomadores de decisão.",
      gradientClass: "from-purple-500/10 to-transparent border-purple-500/15 hover:border-purple-500/35",
      iconColor: "text-[#a855f7]",
      badge: "RETENÇÃO SÊNIOR",
      delay: 0.2
    },
    {
      title: "Autonomia de Fluxo Livre Assíncrono",
      desc: "Todas as entregas são organizadas no sistema proprietário da TAG08. Sem reuniões longas de Zoom sem pauta definida.",
      gradientClass: "from-blue-500/10 to-transparent border-blue-500/15 hover:border-blue-500/35",
      iconColor: "text-[#3b82f6]",
      badge: "COMUNICAï¿½!ï¿½O PRï¿½TICA",
      delay: 0.3
    },
    {
      title: "Soberania de Presença Digital Corp",
      desc: "Ajudamos pequenas e médias marcas de destaque a se posicionarem visualmente como grandes líderes em seus setores.",
      gradientClass: "from-emerald-500/10 to-transparent border-emerald-500/15 hover:border-emerald-500/35",
      iconColor: "text-[#10b981]",
      badge: "CONVERSÃO DE PRESTÍGIO",
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
      color: "border-brand-secondary/20 shadow-brand-secondary/2"
    },
    {
      id: 1,
      area: "GROWTH & ANALYTICS Sï¿½`NIOR",
      title: "Head de Performance Google / Meta Ads",
      tempo: "Remoto ⬢ Contratação Imediata",
      desc: "Gerenciamento estratégico de orçamentos de alta intensidade de compra para marcas B2B, consultorias e saúde premium.",
      requirements: ["Mais de 4 anos gerenciando contas reais exigentes", "Habilidade cirúrgica de traduzir táticas em ROI nos relatórios", "Foco em canais Meta Ads de alto tíquete"],
      color: "border-purple-500/20 shadow-purple-500/2"
    },
    {
      id: 2,
      area: "FRONT-END ARCHITECTURE",
      title: "Dev React.js / Node.js Sênior",
      tempo: "Remoto ⬢ Banco de Talentos",
      desc: "Transformar os protótipos de alta definição do Figma em código sênior, responsivo e ultra veloz sem construtores lentos.",
      requirements: ["Domínio supremo de React, Vite, TS e Tailwind", "Apreço intransigente pelo pixel-perfect do designer", "Obssessão por otimização técnica e Core Web Vitals"],
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
          
          {/* 1. Header Typography block (Ref Style: Expert guidance / tailored solution) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono self-start font-bold">
                SOBRE A TAG08 // ESTRATÉGIA
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter uppercase">
                Clareza para marcas que <br />
                <span className="text-brand">querem crescer com propósito.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-sans font-medium">
                Adapte sua marca à era da soberania digital e escale com presteza operacional. Nascemos para estruturar identidades visuais ricas, engenharia de tráfego B2B com alta intenção de compra e sistemas nativos sem construtores lentos.
              </p>
            </div>
          </div>

          {/* 2. Panoramic Wide Banner Image with capsule neon overlay (Free Trial button style) */}
          <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left">
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1600"
              alt="Time de Especialistas TAG08"
              className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-[1.01] transition-all duration-1000 ease-out"
              referrerPolicy="no-referrer"
            />
            {/* Elegant overlay masks */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />

            {/* Glowing neon action button floating inside face banner mimicking "Free Trial" anchor */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => handleLinkClick("/contato")}
                className="group bg-brand-secondary text-black font-mono font-black text-[10px] sm:text-[11px] uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] hover:scale-105 duration-300 transition-all border border-brand-secondary hover:bg-brand-dark flex items-center gap-2 cursor-pointer z-20"
              >
                <span>AGENDE UM DIAGNÓSTICO</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Absolute indicator tags on corners */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
              <div className="space-y-1">
                <span className="font-mono text-[8.5px] text-brand-secondary tracking-widest block uppercase font-bold">TAG08 LAB CONSOLE</span>
                <h4 className="font-display font-black text-white text-xs sm:text-sm uppercase tracking-tight leading-none">Estabilizando o Alto Valor de Marcas Ativas</h4>
              </div>

              <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-[8px] text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                <span>SEC_SYS_CORE // ACTIVE</span>
              </div>
            </div>
          </div>

          {/* 3. High status core statistics row matching screenshot layout */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">94.8%</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Taxa de Retenção de<br/>Parcerias e LTV Ativo</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">40+</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Marcas, Clínicas e<br/>Consultórios Premium</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">R$ 50M+</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Gerados de Faturamento<br/>Real para Clientes</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">100%</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Estrutura Nativa Puro<br/>Cód. sem Construtores</span>
            </div>
          </div>

          {/* 4. Active Members profiles section seamlessly integrated into the team area */}
          <div className="pt-12 sm:pt-16 border-t border-white/[0.04] space-y-8 text-left font-sans">
            <div className="space-y-2">
              <span className="font-mono text-[8px] text-brand tracking-widest block uppercase font-bold">CONSELHO E DIREÇÃO OPERACIONAL</span>
              <h3 className="font-display font-black text-white text-xl sm:text-2xl uppercase tracking-tight">MENTES ATIVAS POR TRÁS DOS MÉTODOS</h3>
              <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed max-w-2xl font-medium">Você conversa diretamente com os idealizadores do projeto nas pontas de direção, sem intermediários juniores ou burocráticos.</p>
            </div>

            {/* Layout Split: Featured Founder on left, team grid on right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
              
              {/* Highlighted Founder (Carlos Eduardo) */}
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

                  <span className="font-mono text-[8px] text-zinc-500 font-bold uppercase tracking-wider">
                    SISTEMA CORPORATIVO // INICIALIZADO
                  </span>
                </div>

                <div className="relative z-10 space-y-4 mt-auto">
                  <div className="space-y-1">
                    <span className="font-mono text-[8.5px] text-brand block uppercase font-bold">LIDERANï¿½!A & CONCEPï¿½!ï¿½O</span>
                    <h4 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-none tracking-tight">{TILES_HERO[0].name}</h4>
                    <p className="text-zinc-300 text-xs font-sans font-medium">{TILES_HERO[0].role}</p>
                    <p className="text-brand-secondary text-[8.5px] font-mono uppercase tracking-wider pt-1">{TILES_HERO[0].connections} // {TILES_HERO[0].focus}</p>
                    <p className="text-zinc-400 text-xs leading-relaxed max-w-sm pt-2 italic">
                    "Acreditamos que design consistente e engenharia de tráfego focada devem responder às necessidades de solidez operacional das marcas de destaque."
                    </p>
                  </div>

                  <a 
                    href={TILES_HERO[0].linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-secondary hover:bg-white text-black font-sans font-bold text-[9.5px] uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg hover:-translate-y-0.5 cursor-pointer max-w-max"
                  >
                    <Linkedin className="w-3.5 h-3.5 fill-black stroke-none" />
                    <span>Conectar via LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Other Senior Team members (Slicing index 1 onwards) */}
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
                        <p className="text-brand-secondary text-[7.5px] font-sans uppercase tracking-wider pb-1">{member.connections} ⬢ {member.focus}</p>
                      </div>

                      <a 
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-brand-secondary hover:text-black hover:font-bold border border-white/10 hover:border-transparent text-zinc-300 rounded-xl text-[9px] font-mono tracking-widest transition-all duration-300 uppercase self-start"
                      >
                        <Linkedin className="w-3 h-3 fill-current stroke-none" />
                        <span>Ver LinkedIn</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* TEAM COLLECTIVE LINKEDIN HUB SECTION */}
            <div className="bg-charcoal-900 border border-white/[0.06] rounded-3xl p-6 sm:p-10 relative overflow-hidden text-left mt-10">
              <div className="absolute top-[-30px] right-[-30px] w-64 h-64 bg-brand-secondary/[0.02] rounded-full blur-[100px] pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className="lg:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary font-mono text-[8px] lg:text-[9.5px] font-black tracking-widest uppercase">
                    <Linkedin className="w-3.5 h-3.5 fill-brand-secondary stroke-none" />
                    <span>Rede de Autoridade e Insights Operacionais</span>
                  </div>
                  <h4 className="font-display font-black text-white text-lg sm:text-2xl uppercase tracking-tight leading-none">
                    Acompanhe nosso ecossistema de perto no LinkedIn
                  </h4>
                  <p className="text-zinc-400 text-xs leading-relaxed max-w-2xl font-medium">
                    Nossos diretores e o fundador publicam artigos técnicos diários, playbooks de faturamento, manuais de sustentação de processos e as evoluções estéticas do ecossistema TAG08. Conecte-se conosco para absorver conceitos estratégicos diretamente na sua rede.
                  </p>
                </div>
                
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end w-full">
                  <div className="bg-black/45 border border-white/5 rounded-2xl p-4 text-center sm:text-left lg:text-left flex-1">
                    <span className="block font-display font-black text-xl text-brand-secondary">32k+</span>
                    <span className="block text-zinc-500 font-mono text-[8px] uppercase tracking-wider">Conexões profissionais combinadas</span>
                  </div>
                  <div className="bg-black/45 border border-white/5 rounded-2xl p-4 text-center sm:text-left lg:text-left flex-1">
                    <span className="block font-display font-black text-xl text-white">Diário // Semanal</span>
                    <span className="block text-zinc-500 font-mono text-[8px] uppercase tracking-wider">Metodologias e insights ativos</span>
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
              INTEGRAï¿½!ï¿½O ATIVA DE MERCADO
            </span>
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              CONFIADO POR MAIS DE 40+ EMPRESAS, MARCAS COMPACTAS E CONSULTï¿½RIOS DE PRESTÍGIO NACIONAL
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
            <span className="font-mono text-xs text-brand uppercase tracking-widest block font-bold">O FIM DA FRAQUEZA VISUAL</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase leading-none tracking-tighter">
              DIFFERENTIAL TILES DE ALTO IMPACTO
            </h2>
            <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed max-w-2xl">
              Nossa sistemática foi desenhada para superar as barreiras de ruído tradicionais das agências. Veja como eliminamos os maiores pontos de fricção modernos:
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

      {/* NOVO BLOCO: O QUE ACREDITAMOS NA PRÁTICA (Valores vivos aplicados, cultura e parceria) */}
      <section className="px-4 sm:px-6 md:px-8 py-24 border-b border-white/[0.04] bg-zinc-950 text-left">
        <div className="max-w-7xl mx-auto space-y-24">
          
          {/* O que acreditamos na prática - Bento Visual Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left informational block */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <span className="font-mono text-[9px] tracking-widest text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/15 px-3 py-1 rounded-full uppercase inline-block">
                ALINHAMENTO OPERACIONAL DE ATITUDE
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-white uppercase leading-tight tracking-tight">
                Nossos Filtros de Decisão Operacional
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed max-w-md">
                Evitamos discursos bonitos mas inócuos de missão e visão. Nossa operação atua sob filtros técnicos práticos de atitude e ética de faturamento para blindar seu investimento.
              </p>

              <div className="p-5 rounded-2xl bg-charcoal-900 border border-white/[0.03] space-y-2.5">
                <span className="font-mono text-[8px] text-zinc-500 block uppercase">CONCEITO CENTRAL</span>
                <p className="text-zinc-300 text-xs font-sans leading-relaxed">
                  Tratamos o orçamento de marketing com o mesmo rigor cirúrgico que um investidor trata sua carteira de Venture Capital: focado em blindagem, consistência e tração operacional sênior.
                </p>
              </div>
            </div>
 
            {/* Right comparison grid (Highly interactive and polished) */}
            <div className="lg:col-span-7 space-y-4">
              {[
                { 
                  rule: "Recomendação Saudável", 
                  bad: "REJEITAMOS: Oferecer contratações caras de equipes pesadas para quem precisa estruturar apenas manuais fundamentais.",
                  clean: "ASSEGURAMOS: Indicamos apenas o remédio tático preciso para seu estágio de vendas atual, protegendo seu caixa de desperdício.",
                  icon: <Cpu className="w-4 h-4 text-brand" />
                },
                { 
                  rule: "Qualidade Autoral sobre Volume", 
                  bad: "REJEITAMOS: Criar fluxos industriais de 30 posts repetitivos vazios para satisfazer métrica de vaidade no calendário.",
                  clean: "ASSEGURAMOS: Desenvolvemos menor quantidade de postagens digitais, mas todas ancoradas em narrativas profundas e com design premium.",
                  icon: <Sparkles className="w-4 h-4 text-brand" />
                },
                { 
                  rule: "Visão Sistêmica", 
                  bad: "REJEITAMOS: Entregar criativos isolados bonitos sem sincronia com os botões de anúncios e página de vendas.",
                  clean: "ASSEGURAMOS: Integramos o design e a tecnologia. Cada arte, copy ou linha de código funciona para alimentar o funil comercial real.",
                  icon: <Layers className="w-4 h-4 text-brand" />
                },
                { 
                  rule: "Sustentação Sólida", 
                  bad: "REJEITAMOS: Prometer resultados mágicos repentinos ou 'hacks secrets' de algoritmo na próxima semana.",
                  clean: "ASSEGURAMOS: Construímos consistência. O crescimento robusto vem de playbooks diários constantes e inteligência sistêmica e refinada.",
                  icon: <Activity className="w-4 h-4 text-brand" />
                },
                { 
                  rule: "Integridade Direta", 
                  bad: "REJEITAMOS: Esconder atrasos dos colaboradores ou gargalos operacionais internos que atrapalham o faturamento do negócio.",
                  clean: "ASSEGURAMOS: Emitimos alertas nítidos de performance. Se encontramos barreiras operacionais nos seus fluxos de atendimento, propomos correção imediata.",
                  icon: <Shield className="w-4 h-4 text-brand" />
                }
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-charcoal-900/60 border border-white/[0.04] hover:border-brand/10 hover:bg-white/[0.01] transition-all duration-300 text-left space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-brand">
                      {item.icon}
                    </div>
                    <h3 className="text-white text-xs sm:text-sm font-display font-bold uppercase tracking-tight">{item.rule}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/[0.03] text-xs font-sans">
                    <div className="text-zinc-500 border-r border-white/[0.02] pr-2">
                      <span className="font-mono text-[8px] text-zinc-500 block uppercase tracking-wider mb-1">CONDUTA DE VETO</span>
                      {item.bad}
                    </div>
                    <div className="text-brand-secondary font-medium pl-0 md:pl-2">
                      <span className="font-mono text-[8px] text-brand block uppercase tracking-wider mb-1">CONDUTA DE VALOR</span>
                      {item.clean}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Como nossa cultura e parceria aparecem na entrega */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12 border-t border-white/[0.04]">
            
            {/* Cultura na entrega */}
            <div className="lg:col-span-6 space-y-8 bg-charcoal-900/40 p-8 rounded-3xl border border-white/[0.04]">
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-wider">MODO DE SER</span>
                <h3 className="font-display font-medium text-xl sm:text-2xl text-white uppercase tracking-tight">
                  Como nossa cultura aparece na entrega
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-mono">
                  A cultura interna da TAG08 dita as decisões que tomamos quando ninguém está olhando. Convertemos pilares morais em entregas reais:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Clareza Técnica", desc: "Fornecemos diagnósticos nítidos semanais, detalhando erros em planilhas diretas e relatórios enxutos." },
                  { title: "Direção Estratégica", desc: "Não fazemos tarefas soltas. Todas as ações seguem o seu roteiro macro de autoridade para o trimestre." },
                  { title: "Senso de Responsabilidade", desc: "Seu prazo é importante. Cumprimos horários com previsibilidade, executando as tarefas pontualmente." },
                  { title: "Evolução Sob Métricas", desc: "A cada fim de ciclo de marketing, lapidamos criativos e rotas de código com base nos testes reais de funil." }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03] space-y-1.5 hover:border-brand-secondary/10 transition-all">
                    <span className="font-sans text-[9px] text-brand-secondary font-bold">0{idx + 1}</span>
                    <h4 className="text-white text-xs font-display font-bold uppercase tracking-tight">{item.title}</h4>
                    <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nossa forma de parceria */}
            <div className="lg:col-span-6 space-y-8 bg-charcoal-900/40 p-8 rounded-3xl border border-white/[0.04]">
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-brand uppercase tracking-wider">MODO DE COOPERAï¿½!ï¿½O</span>
                <h3 className="font-display font-medium text-xl sm:text-2xl text-white uppercase tracking-tight">
                  Nossa forma de parceria integrada
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                  Não operamos como um fornecedor distante que aguarda tickets abertos. Atuamos como conselheiros engenheiros táticos do seu negócio:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Desenho Conjunto", desc: "Sentamos periodicamente com fundadores e C-Levels definindo o melhor posicionamento de liderança do segmento." },
                  { title: "Execução Técnica Sênior", desc: "Codificamos de forma ágil, criamos projetos heráldicos e escrevemos copys autorais sem recorrer a modelos padrão." },
                  { title: "Acompanhamento Ativo", desc: "Monitoramos faturamento de anúncios e saúde de tráfego, garantindo que o seu fluxo de anúncios seja preservado." },
                  { title: "Calibragem Descomplicada", desc: "Adaptamos campanhas institucionais e pautas a qualquer momento com respostas rápidas e sem excesso de contratos." }
                ].map((point, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-brand/[0.01] border border-brand/5 space-y-1.5 hover:border-brand/20 transition-all">
                    <span className="font-mono text-[9px] text-brand font-bold">FLOW_G{idx + 1}</span>
                    <h4 className="text-white text-xs font-display font-bold uppercase tracking-tight">{point.title}</h4>
                    <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">{point.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA para Soluções - GLASS DESIGN */}
          <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900/50 border border-white/[0.06] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-left">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
            <div className="relative z-10 space-y-2">
              <h4 className="text-white font-display font-semibold text-lg uppercase tracking-tight">Pronto para colocar ordem operacional sênior?</h4>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans max-w-xl leading-relaxed">
                Explore a prateleira tática de soluções que a TAG08 desenhou cuidadosamente para consolidar marcas de referência nacional.
              </p>
            </div>
            <button
              onClick={() => {
                onNavigate("/servicos");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group relative px-6 py-3.5 bg-brand-secondary hover:bg-brand-dark text-black text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shrink-0 overflow-hidden shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.15)] hover:-translate-y-0.5 relative z-10"
            >
              Conhecer Catálogo de Soluções
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 3 - NARRATIVE OF POWER: SPLIT CONTRAST (Ref 1: More value. Less friction style) */}
      <section className="px-4 sm:px-6 md:px-8 py-24 border-b border-white/[0.04] bg-[#070709]/20 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side text matching structural styling of "More value. Less friction" typography */}
            <div className="lg:col-span-6 text-left space-y-6">
              <span className="font-mono text-[8.5px] text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/20 px-3 py-1 rounded-md tracking-widest font-black uppercase inline-block">
                SYS // CULTURA E COMPROMISSO
              </span>
              
              <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white uppercase leading-[0.88] tracking-tighter">
                MAIS VALOR ESTï¿½0TICO. <br />
                <span className="text-brand">MENOS ENROLAï¿½!ï¿½O.</span>
              </h2>
              
              <div className="space-y-4 text-zinc-300 text-xs sm:text-[13.5px] leading-relaxed font-sans max-w-xl">
                <p className="font-medium text-white text-sm sm:text-base leading-relaxed">
                  Não acreditamos em hacks rasos, postagens genéricas de feeds ou design feito com pressa e preguiça intelectual.
                </p>
                <p className="text-zinc-400">
                  Nosso núcleo existe para dar direção às marcas que merecem ser notadas e pagas pelo que realmente valem. Fazemos isso aliando design heráldico sofisticado desenvolvidos do zero no Figma, à engenharia de captação de leads sêniores.
                </p>
                <p className="text-zinc-400">
                  Do código nativo veloz até os roteiros cirúrgicos de retenção para o Instagram e YouTube – cada detalhe da sua marca é polido e defendido por pessoas experientes dedicadas a construir uma autoridade digital inquestionável.
                </p>
              </div>

              {/* Watermark key principles */}
              <div className="bg-charcoal-900 border border-white/5 p-4 rounded-xl space-y-2 max-w-md">
                <div className="flex items-center gap-2 text-[10.5px] text-zinc-400 font-sans">
                  <Check className="w-3.5 h-3.5 text-brand" />
                  <span>Soberania visual para produtos e serviços estratégicos</span>
                </div>
                <div className="flex items-center gap-2 text-[10.5px] text-zinc-400 font-sans">
                  <Check className="w-3.5 h-3.5 text-brand" />
                  <span>Código responsivo, limpo e rápido</span>
                </div>
              </div>
            </div>

            {/* Right side high quality image presentation resembling team cooperation placeholder layout in Ref 1 */}
            <div className="lg:col-span-6">
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden aspect-[4/3] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left">
                
                {/* Real corporate team coding design high definition photo */}
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                  alt="Time de Especialistas TAG08"
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-105 duration-1000 ease-out"
                  referrerPolicy="no-referrer"
                />
                
                {/* Elegant overlay tints matching the aesthetic */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-95 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Live indicators and data badge overlapping image bottom in high status detail */}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] text-brand-secondary font-black uppercase tracking-widest block">TAG08 LAB CONSOLE</span>
                    <h4 className="font-display font-black text-white text-sm sm:text-base uppercase tracking-tight leading-none">Vanguarda do Desenvolvimento</h4>
                  </div>

                  <div className="bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl font-sans text-[8px] text-zinc-400 flex items-center gap-1.5 select-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                    <span>SEC_ENG_SESSION_2026 // LIVE</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4 - RECRUITING & CARREERS: THE PORTRAIT PROTOCOLS (Ref 2 interactive grid layout style) */}
      <section className="px-4 sm:px-6 md:px-8 py-24 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-14">
          
          {/* Section Header */}
          <div className="max-w-3xl text-left space-y-3">
            <span className="font-mono text-xs text-brand uppercase tracking-widest block font-bold">RECRUTAMENTO SÊNIORES ATIVOS // RECRUIT_CORE</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase leading-none tracking-tighter">
              PORTFÓLIOS OBSTINADOS <br />
              &amp; ENGENHARIA DE DESIGN
            </h2>
            <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed max-w-2xl font-medium">
              Repudiamos a mediocridade do mercado digital padrão e veja se há aderência:
            </p>
          </div>

          {/* Reference 2 styled structured portrait card layout but interactive for digital vacancies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {VAGAS_TALENTO.map((vaga) => {
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
                          <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-black block">REQUISITOS ESSENCIAIS:</span>
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
                      TAG08 // REC2026
                    </span>

                    <button
                      onClick={() => setSelectedVaga(isOpen ? null : vaga.id)}
                      className={`font-mono text-[9px] font-black uppercase px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                        isOpen 
                          ? "bg-brand text-black" 
                          : "bg-white/[0.01] border border-white/10 hover:border-brand/40 text-zinc-300 hover:text-white"
                      }`}
                    >
                      <span>{isOpen ? "ENTENDIDO" : "REQUISITOS"}</span>
                      <ArrowRight className={`w-3 h-3 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Banco de talentos general trigger card */}
          <div className="max-w-5xl mx-auto rounded-3xl bg-charcoal-900 border border-white/[0.06] p-6 sm:p-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden text-left shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/[0.015] rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-1.5 max-w-xl">
              <h4 className="text-white font-display font-black text-sm sm:text-base uppercase">NÃO ACHOU SUA VAGA DE PREFERÊNCIA?</h4>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                Se você é um programador de interface impecável, designer exigente com as próprias marcas ou roteirista experiente focados em presteza de retenção, nós queremos conhecer você para o banco contínuo da TAG08.
              </p>
            </div>
            
            <button
              onClick={() => {
                handleOutboundClick(
                  "vagas@tag08.com.br",
                  "mailto:vagas@tag08.com.br?subject=Aplica%C3%A7%C3%A3o%20de%20Vaga%20-%20Banco%20de%20Talentos%20S%C3%AAnior",
                  "about-careers-cta"
                );
                window.open("mailto:vagas@tag08.com.br?subject=Aplica%C3%A7%C3%A3o de Vaga - Banco de Talentos Sênior", "_blank");
              }}
              className="bg-brand-secondary hover:bg-brand-dark text-black font-mono font-black text-[10px] uppercase tracking-wider px-6 py-4 rounded-xl shadow-lg transition-all flex items-center gap-1.5 shrink-0 hover:scale-[1.02] cursor-pointer"
            >
              <span>APLICAR PORTFÓLIO</span>
              <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 5 - ACTION FOOT CTA */}
      <section className="px-4 sm:px-6 md:px-8 py-20 bg-[radial-gradient(circle_at_right_top,_rgba(var(--color-brand-rgb),0.035),_transparent_55%)]">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-secondary/10 border border-brand-secondary/30 text-brand font-black text-[9px] rounded-lg uppercase tracking-widest font-mono">
            AGENDAMENTO SÊNIORES // SOLVÊNCIA
          </div>
          
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight max-w-2xl mx-auto leading-none">
            ESTABILIZAR VALOR DE MARCA <br />
            ï¿½É UM TRABALHO DE ELITE.
          </h2>
          
          <p className="text-zinc-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-sans">
            Compreenda nossos diferenciais e marque seu onboarding hoje diretamente com nossos diretores seniores. Sem retóricas vazias.
          </p>
          
          <div className="pt-4">
            <button
              onClick={() => handleLinkClick("/contato")}
              className="bg-brand hover:bg-brand-dark text-black font-mono font-black text-[10px] uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_12px_45px_rgba(var(--color-brand-secondary-rgb),0.18)] flex items-center gap-1.5 mx-auto hover:scale-[1.02] cursor-pointer"
            >
              <span>RESERVAR DIAGNÓSTICO</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}


