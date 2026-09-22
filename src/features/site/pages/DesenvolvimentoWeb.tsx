import { useState } from "react";
import Image from "next/image";
import { Check, Cpu, Code2, Smartphone, LineChart, ShieldCheck, ArrowUpRight, ArrowRight, Layers, Award, MessageSquare, Globe, Laptop, ExternalLink, Eye, Activity, Sparkles, X, Server, CheckCircle2, Monitor, Database, Zap, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import MiniCases from "../../../components/MiniCases";
import { buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl } from "../../../config/siteNetwork";

interface WebProject {
  id: string;
  title: string;
  category: string;
  client: string;
  year: string;
  tagline: string;
  description: string;
  strategy: {
    challenge: string;
    solution: string;
    result: string;
  };
  technologies: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  screenshot: string;
}

const webProjects: WebProject[] = [
  {
    id: "proj-medvinci",
    title: "MedVinci Oncology Group",
    category: "Portal Corporativo",
    client: "MedVinci Onco & Saúde Sênior",
    year: "2026",
    tagline: "Elevação clínica e autoridade digital inquestionável focado em tratamentos premium.",
      description: "Um ecossistema digital sob medida para uma das principais clínicas oncológicas do país. Projetado para desmistificar procedimentos complexos de radioterapia e imunoterapia, direcionando o lead para atendimento particular de forma segura.",
    strategy: {
      challenge: "Clínicas oncológicas enfrentam barreiras de frieza institucional e ansiedade do paciente. O site precisava passar acolhimento humano ao mesmo tempo que transmitia competência científica inabalável e alto status.",
      solution: "Estruturação de um layout com tipografia moderna, fotografia premium tratada em tons de sépia corporativo e cinza sutil, e carregamento instantâneo via Next.js estático. Desenvolvemos uma árvore de decisões baseada em sintomas para conduzir doadores e agendadores.",
      result: "Aumento de 180% no agendamento de consultas de pacientes particulares por meio do canal digital primário de conversão nas primeiras 12 semanas pós-lançamento."
    },
    technologies: ["React / Next.js", "Tailwind CSS", "Vercel Edge", "Framer Motion", "Google Maps Platform Integration"],
    metrics: [
      { label: "Tempo de Carregamento", value: "0.4s" },
      { label: "Nota Lighthouse API", value: "100/100" },
      { label: "Ativação de Leads", value: "+42%" }
    ],
    screenshot: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "proj-kronos",
    title: "Kronos Multi-Asset Group",
    category: "Landing Page B2B",
    client: "Kronos Partners Trust",
    year: "2025",
    tagline: "Validação institucional sóbria para captação de fortunas com investidores qualificados.",
    description: "Landing page corporativa extremamente focada, desenhada para captar fundos de investimentos alternativos voltada a family offices e trusts familiares. O site rejeita designs genéricos de fintechs coloridas e abraça a sobriedade analítica de investidores seniores.",
    strategy: {
      challenge: "Investidores senis e gestores de fortunas ignoram landing pages comuns de startups. O portfólio de ativos exigia um visual heráldico de legado, com total segurança de criptografia e seriedade heráldica pura.",
      solution: "Layout brutalista minimalista com tons monocromáticos de ardósia, finas linhas pretas e brancas, micro-interações analíticas realistas e um simulador de carteira estático ultrarrápido rodando localmente no navegador.",
      result: "Ativação de 34 leads institucionais qualificados adicionais nas primeiras 6 semanas de veiculação em canais exclusivos de tráfego, movimentando R$ 82M sob custódia corporativa."
    },
    technologies: ["React / Vite SPA", "WebGL Matrix Background", "Tailwind CSS", "Docker Engine Deploy", "Resend API Integration"],
    metrics: [
      { label: "Captação Estimada", value: "R$ 82M" },
      { label: "Retenção na Página", value: "3m 45s" },
      { label: "Taxa de Rejeição", value: "12%" }
    ],
    screenshot: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "proj-aerolog",
    title: "AeroCargo International",
    category: "Web System",
    client: "AeroCargo S.A.",
    year: "2026",
    tagline: "Painel de controle com rastreamento geoespacial em tempo real para cargas aéreas exclusivas.",
    description: "Desenvolvimento de interface em Single Page Application interconectada à API de aeronaves comerciais. O cockpit possibilita que os contratantes acompanhem a logística física ativa em mapas ricos com total confidencialidade de mercadorias.",
    strategy: {
      challenge: "Sistemas ERP tradicionais e portais de fretamento operam com softwares cinzas, obsoletos, ruidosos e lentos, gerando atrito operacional constante de coordenação presencial.",
      solution: "Criação de um painel em modo dark integral e design com alto contraste, utilizando bibliotecas de renderização vetorial rápidas para plotagem de rotas e status de aeroportos em tempo real via canais web.",
      result: "Redução de 40% no envio de e-mails manuais de suporte operacional e 100% de elogios no onboarding de clientes VIP."
    },
    technologies: ["Vite / React Routing", "WebSockets Engine", "Mapbox GL JS Map", "Tailwind CSS grid", "Node.js API Microservices"],
    metrics: [
      { label: "Latência de Dados", value: "<150ms" },
      { label: "Segurança de Fluxo", value: "End-to-End" },
      { label: "Redução de Suporte", value: "40%" }
    ],
    screenshot: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "proj-therastudio",
    title: "Thera Digital Health Hub",
    category: "Portal Multipáginas",
    client: "Clínica Thera Integrada",
    year: "2025",
    tagline: "Presença digital delicada e sofisticada para clínica premium de bem-estar integrado.",
    description: "O portal hospeda e centraliza frentes de atendimento como psicologia clínica sênior, fisiatria preventiva e nutrologia esportiva de alto ticket. O design foca em transmitir uma experiência orgânica de calma sensorial sofisticada.",
    strategy: {
      challenge: "Falta de coesão visual na apresentação de especialidades clínicas diferentes afastava potenciais pacientes que buscavam soluções holísticas sob o mesmo selo de excelência.",
      solution: "Uso de tipografia serifada elegante, paletas de cores quentes e off-white refinadas, transições de páginas extremamente fluidas via framer-motion e sistema de agendamento integrado via cal.com customizado.",
      result: "Centralização operacional perfeita de 3 especialidades em uma única marca harmônica, elevando o tíquete-médio do paciente de R$ 350 para R$ 1.200 por consulta."
    },
    technologies: ["React SPA", "Custom Headless API Gateway", "Tailwind CSS utility", "Motion API", "Cal.com Booking Engine API"],
    metrics: [
      { label: "Sessões Agendadas", value: "+540" },
      { label: "Tempo de Permanência", value: "4m 12s" },
      { label: "Lighthouse Performance", value: "98/100" }
    ],
    screenshot: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
  }
];

interface WebProps {
  onNavigate: (page: string) => void;
}

export default function DesenvolvimentoWeb({ onNavigate }: WebProps) {
  const [activeFaq, setActiveFaq] = useState(0);
  const [selectedProject, setSelectedProject] = useState<WebProject | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("TODOS");
  const [activeNeed, setActiveNeed] = useState<string>("empresa");

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const portfolioProjects: WebProject[] = webProjects.map((project, index) => {
    const consultative = [
      {
        title: 'Portal institucional',
        category: 'Institucional',
        client: 'Marca com oferta clara',
        tagline: 'Estrutura pensada para apresentar a empresa, os servi\u00e7os e os caminhos de contato de forma organizada.',
        description: 'Estrutura para apresentar empresa, servi\u00e7os, diferenciais e caminhos de contato de forma organizada.',
      },
      {
        title: 'Landing de oferta',
        category: 'Oferta',
        client: 'Time comercial',
        tagline: 'P\u00e1gina focada em explicar uma oferta espec\u00edfica, responder d\u00favidas essenciais e conduzir para um pr\u00f3ximo passo.',
        description: 'P\u00e1gina focada em explicar uma oferta espec\u00edfica, responder d\u00favidas essenciais e conduzir para um pr\u00f3ximo passo.',
      },
      {
        title: 'Cat\u00e1logo digital',
        category: 'Cat\u00e1logo',
        client: 'Portf\u00f3lio de produtos',
        tagline: 'Estrutura naveg\u00e1vel para organizar produtos, servi\u00e7os ou conte\u00fados e facilitar consulta.',
        description: 'Estrutura naveg\u00e1vel para organizar produtos, servi\u00e7os ou conte\u00fados e facilitar consulta.',
      },
      {
        title: 'Estrutura personalizada',
        category: 'Personalizada',
        client: 'Opera\u00e7\u00e3o espec\u00edfica',
        tagline: 'Projeto adaptado a jornadas, integra\u00e7\u00f5es e necessidades espec\u00edficas da opera\u00e7\u00e3o.',
        description: 'Projeto adaptado a jornadas, integra\u00e7\u00f5es e necessidades espec\u00edficas da opera\u00e7\u00e3o.',
      },
    ][index] ?? {
      title: project.title,
      category: project.category,
      client: project.client,
      tagline: project.tagline,
      description: project.description,
    };

    return {
      ...project,
      title: consultative.title,
      category: consultative.category,
      client: consultative.client,
      tagline: consultative.tagline,
      description: consultative.description,
      strategy: {
        challenge: 'A marca precisa de uma base digital mais clara para orientar visita, contato e leitura da oferta.',
        solution: 'Estrutura\u00e7\u00e3o de conte\u00fado, navega\u00e7\u00e3o e design para apresentar melhor a marca e sustentar sua jornada.',
        result: 'Uma presen\u00e7a digital mais organizada, f\u00e1cil de explicar e coerente com o momento da empresa.',
      },
      metrics: [
        { label: 'Fun\u00e7\u00e3o', value: consultative.category },
        { label: 'Foco', value: 'Clareza' },
        { label: 'Aplica\u00e7\u00e3o', value: 'Contato' },
      ],
    };
  });
  const needOptions = [
    {
      id: 'empresa',
      title: 'Sua marca precisa apresentar melhor a empresa?',
      text: 'Quando o visitante ainda n\u00e3o entende com clareza quem \u00e9 a marca, o que ela faz e por que deveria confiar.',
      result: 'Site institucional',
      tags: ['Institucional', 'Clareza', 'Credibilidade'],
    },
    {
      id: 'oferta',
      title: 'Voc\u00ea precisa explicar uma oferta espec\u00edfica?',
      text: 'Quando um servi\u00e7o, produto, campanha ou solu\u00e7\u00e3o precisa de uma p\u00e1gina pr\u00f3pria para ser compreendido.',
      result: 'Landing page',
      tags: ['Oferta', 'Jornada', 'Contato'],
    },
    {
      id: 'comercial',
      title: 'Seu comercial precisa de apoio digital?',
      text: 'Quando propostas, atendimento e conversas precisam de uma base clara para apresentar informa\u00e7\u00f5es e pr\u00f3ximos passos.',
      result: 'P\u00e1gina de servi\u00e7o',
      tags: ['Comercial', 'Organiza\u00e7\u00e3o', 'Pr\u00f3ximo passo'],
    },
    {
      id: 'catalogo',
      title: 'Voc\u00ea precisa organizar cat\u00e1logo, servi\u00e7os ou conte\u00fados?',
      text: 'Quando h\u00e1 muitas informa\u00e7\u00f5es dispersas e o usu\u00e1rio precisa encontrar o que procura com menos esfor\u00e7o.',
      result: 'Cat\u00e1logo digital',
      tags: ['Cat\u00e1logo', 'Navega\u00e7\u00e3o', 'Atualiza\u00e7\u00e3o'],
    },
    {
      id: 'evolucao',
      title: 'A estrutura atual precisa evoluir?',
      text: 'Quando o site existe, mas j\u00e1 n\u00e3o acompanha o momento, a oferta, a linguagem ou a opera\u00e7\u00e3o da marca.',
      result: 'Estrutura web evolutiva',
      tags: ['Evolu\u00e7\u00e3o', 'Conte\u00fado', 'Opera\u00e7\u00e3o'],
    },
  ];
  const activeNeedCard = needOptions.find((item) => item.id === activeNeed) ?? needOptions[0];

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pb-20 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-[8%] left-[-15%] w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] bg-brand/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle floating 3D element in the background of user focus */}
      <Subtle3DCanvas intensity={1.3} className="absolute right-[-8%] top-[5%] w-[480px] h-[480px] opacity-[0.35] mix-blend-screen hidden lg:block" />

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
                sizes="100vw"
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
                  className="group bg-brand-secondary text-black font-sans font-black text-xs sm:text-xs uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] hover:scale-105 duration-300 transition-all border border-brand-secondary hover:bg-brand-dark flex items-center gap-2 cursor-pointer z-20"
                >
                  <span>PLANEJAR MEU SITE</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Absolute indicator tags on corners */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="tag08-meta text-xs text-brand-secondary tracking-widest block uppercase font-bold">Sistema web TAG08</span>
                  <h4 className="font-display font-black text-white text-xs sm:text-sm tracking-tight leading-none">Estrutura digital com dire&ccedil;&atilde;o e fun&ccedil;&atilde;o</h4>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-xs text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>CLAREZA // CREDIBILIDADE</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* 3. High status core statistics row matching screenshot layout */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Clareza</span>
              <span className="block text-zinc-500 tag08-meta text-xs uppercase tracking-widest leading-normal">Informa&ccedil;&atilde;o organizada para facilitar<br/>entendimento da empresa e da oferta.</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">Credibilidade</span>
              <span className="block text-zinc-500 tag08-meta text-xs uppercase tracking-widest leading-normal">Presen&ccedil;a digital coerente com a identidade,<br/>o conte&uacute;do e o momento da marca.</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Organiza&ccedil;&atilde;o</span>
              <span className="block text-zinc-500 tag08-meta text-xs uppercase tracking-widest leading-normal">P&aacute;ginas, navega&ccedil;&atilde;o e conte&uacute;dos<br/>estruturados com fun&ccedil;&atilde;o definida.</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">Apoio comercial</span>
              <span className="block text-zinc-500 tag08-meta text-xs uppercase tracking-widest leading-normal">Caminhos de contato e pr&oacute;ximos passos<br/>integrados &agrave; jornada do visitante.</span>
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
            <h3 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight">
              Quando o site deixa de ajudar a marca a ser entendida.
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed max-w-xl">
              Muitas empresas possuem um site, mas ainda dificultam a experi&ecirc;ncia de quem procura informa&ccedil;&otilde;es sobre a marca, os servi&ccedil;os ou o pr&oacute;ximo passo. Conte&uacute;do desatualizado, navega&ccedil;&atilde;o confusa, p&aacute;ginas sem fun&ccedil;&atilde;o definida e uma estrutura que n&atilde;o acompanha o neg&oacute;cio s&atilde;o sinais comuns desse desalinhamento.
            </p>
          </div>

          <div className="border border-white/[0.06] rounded-3xl overflow-hidden divide-y divide-white/[0.06] bg-neutral-900/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 tag08-meta text-xs text-zinc-500 uppercase tracking-widest bg-white/[0.01]">
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
                  <span className="text-zinc-600 font-sans font-bold shrink-0">[-]</span>
                  <span>{row.bad}</span>
                </div>
                <div className="text-zinc-200 font-sans flex gap-3 border-t md:border-t-0 border-white/[0.03] pt-4 md:pt-0">
                  <span className="text-brand-secondary font-sans font-bold shrink-0">[+]</span>
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
                <h4 className="text-white font-display font-black text-sm">Arquitetura da informa&ccedil;&atilde;o</h4>
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
                <h4 className="text-white font-display font-black text-sm">Design de interface</h4>
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
                <h4 className="text-white font-display font-black text-sm">Conte&uacute;do e narrativa</h4>
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
                <h4 className="text-white font-display font-black text-sm">Desenvolvimento t&eacute;cnico</h4>
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
              <h4 className="text-white font-display font-black text-sm">Clareza de navega&ccedil;&atilde;o</h4>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                Menus, se&ccedil;&otilde;es e caminhos organizados para reduzir esfor&ccedil;o e facilitar a localiza&ccedil;&atilde;o das informa&ccedil;&otilde;es.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-2">
              <h4 className="text-white font-display font-black text-sm">Estrutura de conte&uacute;do</h4>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                Textos, chamadas e blocos organizados para apresentar empresa, oferta, contexto e pr&oacute;ximo passo.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-2">
              <h4 className="text-white font-display font-black text-sm">Design responsivo</h4>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                Interfaces preparadas para diferentes tamanhos de tela, preservando legibilidade, hierarquia e navega&ccedil;&atilde;o.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-2">
              <h4 className="text-white font-display font-black text-sm">Base t&eacute;cnica organizada</h4>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                Implementa&ccedil;&atilde;o estruturada para facilitar estabilidade, manuten&ccedil;&atilde;o e evolu&ccedil;&atilde;o do projeto.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-2">
              <h4 className="text-white font-display font-black text-sm">Continuidade de uso</h4>
              <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                Estrutura preparada para receber ajustes, novas p&aacute;ginas, conte&uacute;dos e necessidades futuras quando tecnicamente previsto.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-2">
              <h4 className="text-white font-display font-black text-sm">Acompanhamento de publica&ccedil;&atilde;o</h4>
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
            <h4 className="text-white font-display font-black text-sm tracking-tight">Crit&eacute;rios de confian&ccedil;a</h4>
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
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[520px]">
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden" />
            <Image
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
              alt="Profissional em ambiente de desenvolvimento web"
              className="object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[15%] transition-all duration-500 hover:scale-105"
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
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
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
                <a
                  href={buildBrazilWhatsAppUrl("Ol%C3%A1,%20gostaria%20de%20solicitar%20um%20projeto%20de%20Desenvolvimento%20Web%20com%20a%20TAG08")}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-3 px-4 transition-all duration-300 group shadow-inner"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col text-left">
                      <span className="tag08-meta text-xs text-zinc-500 uppercase font-black tracking-wider leading-none">
                        WhatsApp oficial
                      </span>
                      <span className="text-white text-xs font-sans font-bold tracking-wider group-hover:text-brand transition-colors mt-0.5">
                        FALAR COM A TAG08
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5] bg-brand rounded-full p-0.5" />
                  </div>
                </a>

                <button
                  onClick={() => handleLinkClick("/servicos")}
                  className="w-full bg-black/10 hover:bg-black/15 border border-black/10 rounded-2xl py-3 px-4 transition-all duration-300 group text-left"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col text-left">
                      <span className="tag08-meta text-xs text-black/55 uppercase font-black tracking-wider leading-none">
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
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

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
                    onClick={() => setActiveFaq(item.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group cursor-pointer ${
                      activeFaq === item.id
                        ? "bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)]"
                        : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                    }`}
                  >
                    <span className="tag08-meta text-xs font-black uppercase tracking-wider flex items-center gap-3">
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
              <Image
                fill
                sizes="(max-width: 1024px) 100vw, 34vw"
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
                alt="TAG08 Web Design"
                className="object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div className="absolute top-6 left-6 z-10 pointer-events-none tag08-meta text-xs text-white/20 uppercase tracking-widest leading-none">
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

                <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {([
                    "A TAG08 desenvolve apenas sites institucionais?",
                    "Preciso ter todo o conte&uacute;do pronto antes de come&ccedil;ar?",
                    "O site considera o apoio ao comercial?",
                    "O projeto inclui responsividade e adapta&ccedil;&atilde;o para celular?",
                    "Depois da publica&ccedil;&atilde;o, o site pode evoluir?",
                    "Como a TAG08 define o escopo do site?"
                  ])[activeFaq]}
                </h4>

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
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest block font-bold">PROPOSTA DE VALOR</span>
                  <h4 className="text-white font-semibold text-sm leading-snug">O que o projeto precisa deixar claro?</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    A estrutura precisa deixar claro o papel da p&aacute;gina, a jornada do visitante e o pr&oacute;ximo passo esperado.
                  </p>
                </div>
                <button
                  onClick={() => handleLinkClick("/servicos")}
                  className="group flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5"
                >
                  <span>VER SOLU&Ccedil;&Otilde;ES</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-black/60 uppercase tracking-widest block font-extrabold">FALE COM A TAG08</span>
                  <h4 className="text-black font-black text-sm leading-tight tracking-tight">Quer conversar sobre o seu site?</h4>
                  <p className="text-black/85 text-xs font-semibold leading-relaxed font-sans">
                    Converse com a TAG08 para entender o que precisa ser estruturado, o que entra no escopo e qual caminho faz sentido para o projeto.
                  </p>
                </div>
                <a
                  href={buildBrazilWhatsAppUrl("Ol%C3%A1,%20gostaria%20de%20conversar%20sobre%20um%20projeto%20de%20desenvolvimento%20web%20com%20a%20TAG08")}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between text-xs font-sans font-black text-black select-none border-t border-black/10 pt-3 hover:translate-x-0.5 transition-all"
                >
                  <span>FALAR COM A TAG08</span>
                  <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
                </a>
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
            onClick={() => handleLinkClick("/contato")}
            className="group bg-brand text-black font-sans font-black text-xs uppercase tracking-widest py-4 px-8 rounded-full shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.22)] hover:bg-brand-dark duration-300 transition-all cursor-pointer flex items-center gap-2 mx-auto"
          >
            <span>PLANEJAR MEU SITE</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </section>
    </div>
  );
}
