import { useState } from "react";
import { Check, Cpu, Code2, Smartphone, LineChart, ShieldCheck, ArrowUpRight, ArrowRight, Layers, Award, MessageSquare, Globe, Laptop, ExternalLink, Eye, Activity, Sparkles, X, Server, CheckCircle2, Monitor, Database, Zap, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ThreeDimensionalTilt from "../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../components/Subtle3DCanvas";
import MiniCases from "../components/MiniCases";
import { buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl } from "../config/siteNetwork";

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
                DIVISÃO DE ENGENHARIA DE ESTRUTURAS // TAG08
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter uppercase font-display font-black">
                Desenvolvimento web <br />
                <span className="text-brand">para sites que posicionam, explicam e convertem.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-sans font-medium">
                Sistemas elegantes, de carregamento estático e estruturado à mão sem criadores pesados ou lentos. Unimos copy cirúrgica de alta conversão, design tático responsivo e código limpo para blindar a autoridade intelectual da sua marca e gerar novas captações qualificadas de leads de forma diária.
              </p>
            </div>
          </div>

          {/* 2. Panoramic Wide Banner Image with capsule neon overlay trigger wrapped in 3D perspective tilt container */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <img 
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1600"
                alt="Engenharia Web Estática TAG08"
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
                  <span>CODIFICAR NOVO SITE</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Absolute indicator tags on corners */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="font-mono text-[8.5px] text-brand-secondary tracking-widest block uppercase font-bold">TAG08 STATIC ENGINE</span>
                  <h4 className="font-display font-black text-white text-xs sm:text-sm uppercase tracking-tight leading-none">Carregamento Imediato no Google Core Web Vitals</h4>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-[8px] text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>TECH_CORE // 99_SCORE</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* 3. High status core statistics row matching screenshot layout */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">&lt; 1.5s</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Velocidade Média Real de<br/>Carregamento de Páginas</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">98% +</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Pontuação Lighthouse no<br/>Google Core Web Vitals</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Nativo</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Linguagens sem Construtores<br/>Wordpress ou Elementor</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">100%</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Segurança Contra Invasões<br/>e Quedas de Servidor</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2 - PAIN DIAGNOSTIC: METHODOLOGY COMPARATIVE */}
      <section className="px-4 sm:px-6 md:px-8 py-20 border-b border-white/[0.04] bg-charcoal-950 text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Comparativo: Site Bonito x Site Estratégico */}
          <div className="space-y-6">
            <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              MÉTRICAS DE PERFORMANCE REAL // VISÃO DE ENGENHARIA
            </span>
            <h3 className="font-display font-medium text-3xl sm:text-4xl text-white uppercase tracking-tight">
              Arquiteturas Amadoras vs. Engenharia Web Sênior
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed max-w-xl">
              A maioria das agências utiliza temas WordPress lentos e repletos de plugins de segurança frágil. Nós construímos aplicações estáticas sob demanda:
            </p>
          </div>

          <div className="border border-white/[0.06] rounded-3xl overflow-hidden divide-y divide-white/[0.06] bg-neutral-900/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 font-mono text-[9px] text-zinc-500 uppercase tracking-widest bg-white/[0.01]">
              <div>CONTRAPARTIDA INSTITUCIONAL (AMADOR)</div>
              <div className="text-brand-secondary">ENGENHARIA INTEGRADA TAG08 (SҊNIOR)</div>
            </div>

            {[
              { bad: "Apresenta a marca de maneira genérica sem ganchos ou lógica rítmica comercial.", good: "Interpreta com inteligência as dores do seu cliente e conduz a tomada de ação imediata." },
              { bad: "Carregamento demorado em celulares 4G degradando o ranqueamento orgânico do Google.", good: "Construído em código nativo de carregamento imediato (menor que 2 segundos)." },
              { bad: "Depende de plugins complexos de terceiros propensos a contaminação ou desconfigurações.", good: "Sistema estático blindado que elimina vulnerabilidades clássicas de segurança." },
              { bad: "Botões de conversão e rotas de e-mail desalinhados com dezenas de desvios visuais.", good: "Estruturas refinadas de CTA focadas em conduzir leads fáceis para o seu time comercial." }
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
            <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-bold">FRENTES DE DESENVOLVIMENTO DE ELEVADA LINHA</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">SOLUÇÕES MODULARES DE TECNOLOGIA</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Não importamos temas genéricos. Nossos engenheiros constroem cada coluna de layout, carregamento de fontes e regras de SEO com o máximo de asseio editorial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Portais Corporativos</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Portais corporativos integrando toda a narrativa, valores, setores e diferenciais corporativos de forma séria e estruturada para encantar parceiros e consolidar faturamento institucional.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <LineChart className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Landing Pages</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Interfaces específicas de alta conversão. Alinhamos sua copy persuasiva com um design de ultra velocidade, preparando suas campanhas de tráfego pago B2B para o maior retorno tático.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Foco Clínico Focado</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Estruturas focadas em expor tratamentos particulares complexos, cirurgias e infraestrutura médica sem termos assustadores, aumentando radicalmente o desejo das agendadoras.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Layers className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Sistemas Integrados</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Configuração de formulários seguros contra spam, integrações nativas com CRMs (como RD Station, Active Campaign), APIs estritas de WhatsApp e rastreadores analíticos do Google Analytics de ponta.
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
            <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-bold">ENGENHARIA DIGNA DE ADMIRAÇÃO</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">O ATRIBUTO SUPERIOR DO NOSSO CÒDIGO</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Eliminamos a poluição visual e o peso computacional de carregamentos arrastados comuns em agências tradicionais.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-2">
              <h4 className="text-white font-display font-black text-sm uppercase">Estratégia Antes do Código</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                Mapeamos as dúvidas e barreiras mentais do público alvo antes de desenhar a primeira linha de layout, criando fluxos naturais de leitura instintiva.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-2">
              <h4 className="text-white font-display font-black text-sm uppercase">Copywriting Sérias</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                Textos escritos exclusivamente por copywriters experientes com base em seu tom de voz de líder. Nada de textos falsos de Lorem Ipsum ou genéricos rasos.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-2">
              <h4 className="text-white font-display font-black text-sm uppercase">Mobile First Verdadeiro</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                Mais de 85% dos cliques vêm de smartphones. Nossos botões de ação e parágrafos são dimensionados perfeitamente para cliques fáceis, sem microtextos embaçados.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-2">
              <h4 className="text-white font-display font-black text-sm uppercase">Performance Isolada</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                A TAG08 desenvolve sem plugins remotos caóticos que derrubam o site. Código otimizado que reflete rapidez incomparável e máxima segurança.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-2">
              <h4 className="text-white font-display font-black text-sm uppercase">Segurança e Backup</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                Hospedagem estática segura, imune a quedas de banco de dados ou ataques coordenados. Proteção rígida do portal de informações institucional da sua corporação.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900/40 border border-white/[0.05] rounded-3xl space-y-2">
              <h4 className="text-white font-display font-black text-sm uppercase">SEO Técnico Base</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                Tags estruturadas, metatitles inteligentes de pesquisa, indexação limpa no Google Search Console e sitemaps automatizados pré-configurados instalados de imediato.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - TRUST CORE BAR */}
      <section className="px-4 sm:px-6 md:px-8 py-10 border-b border-white/[0.04] bg-charcoal-900/40 text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-3xl">
            <h4 className="text-white font-display font-black text-sm uppercase tracking-tight">AUDITORIA E SUPORTE PÓS-IMPLANTAÇÃO</h4>
            <p className="text-zinc-400 text-xs font-sans font-medium leading-relaxed">
              O projeto não morre na publicação. Entregamos suporte técnico garantido de 30 dias para pequenos ajustes de texto, calibragem fina do CRM, e validação plena do carregamento móvel em todas as operadoras nacionais.
            </p>
          </div>
          <span className="font-mono text-[8.5px] text-brand-secondary uppercase tracking-widest border border-brand-secondary/20 bg-brand-secondary/5 px-3.5 py-2 rounded-xl shrink-0 font-black">
            NATIVE CODE ENGINE // TAG08
          </span>
        </div>
      </section>

      {/* WEB DEV CLIENTS LOGO SOCIAL PROOF */}
      <MiniCases 
        onNavigate={onNavigate} 
        title="Estruturas Rápidas de Alta Conversão"
        subtitle="Empresas corporativas e startups inovadoras que confiam na engenharia limpa e nos tempos de carregamento imperceptíveis da TAG08."
        badge="ENGINEERING SOCIAL PROOF // PORTFÒLIO WEB"
      />

      {/* SECTION - WORK SYSTEM (WhatsApp Neon Callout inspired by screenshot) */}
      <section className="py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          {/* Left Column: Portrait */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[520px]">
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden" />
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800" 
              alt="TAG08 Web Specialist" 
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
                  static_engine
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                  core_web_vitals_
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  LATENCY: 12MS
                </span>
                <span className="font-mono text-[9px] text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  SҊNIOR SECURITY
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
                APLICAÇÕES WEB <br />
                QUE EXPLICAM E CONVERTEM!
              </h2>
              <p className="text-black/85 text-[11px] sm:text-xs max-w-lg leading-relaxed font-sans font-extrabold uppercase">
                CÓDIGO NATIVO ESTÁTICO DE CARREGAMENTO IMEDIATO, CONECTADOS DIRETAMENTE AO SEU CRM E SEM AS FALHAS OU LENTIDÃO DO WORDPRESS.
              </p>
            </div>

            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 max-w-md relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-4 items-start select-none">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black shrink-0 shadow-lg shadow-brand/10 hover:scale-105 transition-transform duration-200">
                  <Cpu className="w-5 h-5 stroke-[2.5] text-black" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-[8px] text-brand uppercase tracking-wider font-extrabold block">
                    SISTEMA ISOLADO
                  </span>
                  <p className="text-white text-xs leading-snug font-sans font-semibold">
                    Substitua templates pesados por aplicações de velocidade intocável que geram segurança irrestrita contra ataques de queda.
                  </p>
                </div>
              </div>

              {/* DUAL CLIENT CONNECTION CHANNELS (BR & INT) */}
              <div className="space-y-3">
                <a 
                  href={buildBrazilWhatsAppUrl("Olá,%20gostaria%20de%20solicitar%20um%20projeto%20de%20Desenvolvimento%20Web%20com%20a%20TAG08")}
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
                          PROPRIETҁRIO DIRETO (WhatsApp)
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
                  href={buildInternationalWhatsAppUrl("Hello,%20I%20would%20like%20to%20request%20high-performance%20custom%20web%20systems%20consultation%20from%20TAG08")}
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
                    AGҊNCIA TAG08
                  </span>
                </div>
                <span className="font-sans text-[8.5px] text-brand font-bold bg-brand/10 border border-brand/20 px-2 rounded">
                  OPERAÇÃO ATIVA 100% online
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOVO BLOCO: QUE TIPO DE SITE, SITE BONITO X SITE ESTRATÒ⬰GICO, OUTROS DETALHES, PÒS-ENTREGA */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-zinc-950 text-left relative overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-brand/[0.015] rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-28 relative z-10">
          
          {/* INTERACTIVE INNOVATION: SIMULADOR DE PERFORMANCE & ROI WEB */}
          <div className="space-y-12">
            <div className="space-y-3 max-w-3xl">
              <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                FERRAMENTA INTERATIVA // SIMULAÇÃO EM TEMPO REAL
              </span>
              <h2 className="font-display font-medium text-3xl text-white uppercase tracking-tight leading-tight">
                Simulador de Impacto Financeiro da Velocidade Web
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                Descubra como cada milissegundo de lentidão afeta diretamente sua receita. Arraste os seletores abaixo e veja como a velocidade do seu site impacta a taxa de rejeição, geração de leads e desperdício de tráfego pago.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Controles de Simulação */}
              <div className="lg:col-span-5 bg-charcoal-900/60 border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-8 text-left">
                <div className="space-y-6">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold block pb-3 border-b border-white/[0.05]">
                    Configure sua Operação Atual:
                  </span>

                  {/* Slider 1: Velocidade do site */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider">
                        Tempo de Carregamento:
                      </label>
                      <span className="text-sm font-sans text-brand-secondary font-black bg-brand-secondary/10 px-2.5 py-0.5 rounded-lg border border-brand-secondary/20">
                        {(() => {
                          const val = typeof window !== "undefined" && (window as any)._simSpeed !== undefined ? (window as any)._simSpeed : 2.5;
                          return typeof val === 'number' ? val.toFixed(1) : "2.5";
                        })()}s
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="0.4" 
                      max="6.0" 
                      step="0.1" 
                      defaultValue="2.5"
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        (window as any)._simSpeed = val;
                        // Trigger re-render by calling a force update or updating a dummy state if needed.
                        // We will add state and update it correctly.
                        const speedEl = document.getElementById("speed-val");
                        const bounceEl = document.getElementById("bounce-val");
                        const lossEl = document.getElementById("loss-val");
                        const leadsEl = document.getElementById("leads-val");
                        const scoreEl = document.getElementById("score-val");
                        const scoreCircle = document.getElementById("score-circle");
                        
                        if (speedEl) speedEl.innerText = val.toFixed(1) + "s";
                        
                        // Bounce calculation
                        const bounce = Math.min(90, Math.max(12, Math.round(12 + (val - 0.4) * 14)));
                        if (bounceEl) bounceEl.innerText = bounce + "%";
                        
                        // Conversion rate
                        const conv = Math.max(0.5, parseFloat((4.5 - (val - 0.4) * 0.7).toFixed(2)));
                        
                        // Dynamic waste based on budget slider
                        const budgetInput = document.getElementById("budget-range") as HTMLInputElement;
                        const budget = budgetInput ? parseInt(budgetInput.value) : 5000;
                        
                        const waste = Math.round(budget * (bounce / 100) * 0.8);
                        if (lossEl) lossEl.innerText = "R$ " + waste.toLocaleString("pt-BR");
                        
                        // Leads generated
                        const clicks = budget / 2;
                        const leads = Math.round(clicks * (conv / 100));
                        if (leadsEl) leadsEl.innerText = leads.toString();

                        // Score 
                        const score = Math.min(100, Math.max(15, Math.round(100 - (val - 0.4) * 15)));
                        if (scoreEl) scoreEl.innerText = score.toString();

                        if (scoreCircle) {
                          scoreCircle.className = `w-14 h-14 rounded-full flex items-center justify-center font-sans font-black text-sm border-2 ${
                            score >= 90 ? "border-brand-secondary bg-brand-secondary/10 text-brand-secondary" :
                            score >= 50 ? "border-amber-500 bg-amber-500/10 text-amber-500" :
                            "border-rose-500 bg-rose-500/10 text-rose-500"
                          }`;
                        }
                      }}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
                    />
                    <div className="flex items-center justify-between text-[9px] font-sans text-zinc-500">
                      <span>0.4s (Padrão TAG08)</span>
                      <span>3s (Média WordPress)</span>
                      <span>6.0s (Crítico)</span>
                    </div>
                  </div>

                  {/* Slider 2: Verba de tráfego */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider">
                        Investimento Mensal em Ads:
                      </label>
                      <span className="text-sm font-sans text-white font-semibold">
                        R$ <span id="budget-val">5.000</span>
                      </span>
                    </div>
                    <input 
                      type="range" 
                      id="budget-range"
                      min="1000" 
                      max="30000" 
                      step="1000" 
                      defaultValue="5000"
                      onChange={(e) => {
                        const budget = parseInt(e.target.value);
                        const budgetVal = document.getElementById("budget-val");
                        if (budgetVal) budgetVal.innerText = budget.toLocaleString("pt-BR");

                        // Trigger change in formulas using the current speed value
                        const speedRange = document.querySelector("input[type='range']") as HTMLInputElement;
                        const val = speedRange ? parseFloat(speedRange.value) : 2.5;

                        const bounce = Math.min(90, Math.max(12, Math.round(12 + (val - 0.4) * 14)));
                        const conv = Math.max(0.5, parseFloat((4.5 - (val - 0.4) * 0.7).toFixed(2)));
                        const waste = Math.round(budget * (bounce / 100) * 0.8);
                        
                        const lossEl = document.getElementById("loss-val");
                        if (lossEl) lossEl.innerText = "R$ " + waste.toLocaleString("pt-BR");
                        
                        const clicks = budget / 2;
                        const leads = Math.round(clicks * (conv / 100));
                        const leadsEl = document.getElementById("leads-val");
                        if (leadsEl) leadsEl.innerText = leads.toString();
                      }}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                    <div className="flex items-center justify-between text-[9px] font-sans text-zinc-500">
                      <span>R$ 1.000</span>
                      <span>R$ 15.000</span>
                      <span>R$ 30.000+</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-2">
                  <div className="flex items-center gap-2 text-brand-secondary">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider">A Vantagem da Engenharia Estática</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans font-medium">
                    Enquanto ferramentas de clique arrastado como WordPress / Elementor forçam o navegador a processar dezenas de banco de dados por requisição, o código puro estruturado da TAG08 envia pacotes ultraleves já compilados de imediato para a tela.
                  </p>
                </div>
              </div>

              {/* Painel de Resultados */}
              <div className="lg:col-span-7 bg-[#09090b] border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-6 w-full">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                      Métricas e Perdas Operacionais Projetadas:
                    </span>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-sans text-zinc-400">Google Lighthouse Score:</span>
                      <div id="score-circle" className="w-14 h-14 rounded-full flex items-center justify-center font-sans font-black text-sm border-2 border-amber-500 bg-amber-500/10 text-amber-500">
                        <span id="score-val">68</span>
                      </div>
                    </div>
                  </div>

                  {/* Bento Grid de Resultados */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* Item 1: Taxa de Rejeição */}
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1 relative">
                      <span className="font-mono text-[8px] text-zinc-500 uppercase font-black block">Taxa de Rejeição (Bounce)</span>
                      <p id="bounce-val" className="text-3xl font-display font-black text-white">41%</p>
                      <span className="text-[9px] text-zinc-400 block leading-tight font-sans">
                        Porcentagem de visitantes que abandonam sem interagir.
                      </span>
                    </div>

                    {/* Item 2: Leads Estimados */}
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1 relative">
                      <span className="font-mono text-[8px] text-zinc-500 uppercase font-black block">Leads Ativados / Mês</span>
                      <p id="leads-val" className="text-3xl font-display font-black text-brand">76</p>
                      <span className="text-[9px] text-zinc-400 block leading-tight font-sans">
                        Usuários altamente propensos a agendar reuniões comerciais.
                      </span>
                    </div>

                    {/* Item 3: Desperdício de Verba */}
                    <div className="p-5 rounded-2xl bg-rose-500/[0.02] border border-rose-500/10 space-y-1 relative">
                      <span className="font-mono text-[8px] text-rose-500/80 uppercase font-black block">Desperdício de Tráfego / Mês</span>
                      <p id="loss-val" className="text-2xl sm:text-3xl font-display font-black text-rose-500">R$ 1.640</p>
                      <span className="text-[9px] text-rose-400 block leading-tight font-sans">
                        Capital de anúncios queimado por lentidão de carregamento.
                      </span>
                    </div>

                  </div>

                  {/* Gráfico Comparativo de Carregamento */}
                  <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-4 space-y-3 text-xs">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold block">Comparativo de Velocidade TAG08 vs Outros</span>
                    
                    <div className="space-y-2">
                      {/* Linha TAG08 */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between font-sans text-[10px]">
                          <span className="text-brand font-black">TAG08 Static Engine (Código Limpo)</span>
                          <span className="text-brand-secondary">0.4s (Instantâneo)</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                          <div className="bg-brand h-full rounded-full" style={{ width: "8%" }} />
                        </div>
                      </div>

                      {/* Linha WordPress padrão */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between font-sans text-[10px] text-zinc-400">
                          <span>Site WordPress Típico (Elementor / Plugins)</span>
                          <span>3.5s (Atraso Significativo)</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                          <div className="bg-zinc-600 h-full rounded-full" style={{ width: "65%" }} />
                        </div>
                      </div>

                      {/* Linha Criador de Sites Drag&Drop */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between font-sans text-[10px] text-zinc-400">
                          <span>Criadores Genéricos (Wix / Squarespace)</span>
                          <span>5.2s (Crítico para Tráfego Pago)</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                          <div className="bg-zinc-700 h-full rounded-full" style={{ width: "90%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 mt-6">
                  <span className="font-sans text-[8px] text-zinc-600">FONTE: GOOGLE CORE WEB VITALS BENCHMARKS // 2026</span>
                  <button 
                    onClick={() => handleLinkClick("/contato")}
                    className="text-xs font-mono text-brand font-black uppercase hover:underline flex items-center gap-1.5 cursor-pointer focus:outline-none"
                  >
                    Obter Diagnóstico Técnico Gratuito <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Que formato de presença web sua empresa precisa? */}
          <div className="space-y-12">
            <div className="space-y-3 max-w-3xl">
              <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                DIRECIONAMENTO TÒ⬰CNICO // ARQUITETURA WEB
              </span>
              <h2 className="font-display font-medium text-3xl text-white uppercase tracking-tight leading-tight">
                Que formato de presença web sua empresa precisa?
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed max-w-2xl">
                Desenvolver um site sem propósito comercial vira apenas despesa de hospedagem. Escolha a arquitetura ideal recomendada pelos nossos engenheiros de software:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Site Institucional", tag: "REPUTAÇÃO SÊNIOR", desc: "Estruturas corporativas impecáveis voltadas para validar sua autoridade do mundo real, detalhando soluções e chancelando negociações de alto ticket." },
                { title: "Landing Page Comercial", tag: "ANÚNCIOS & CONVERSÃO", desc: "Páginas estéticas extremamente velozes, otimizadas para receber tráfego de anúncios pagos e transformá-los em contatos reais." },
                { title: "Páginas de Serviço", tag: "EXPLICATIVAS DE VALOR", desc: "Páginas dedicadas a explicar detalhadamente uma especialidade ou procedimento técnico, conscientizando leads qualificados." },
                { title: "Páginas de Vendas (VSL)", tag: "CONVERSÃO INTEGRADA", desc: "Foco absoluto em conversões com vídeos embutidos e layouts adaptados para fechamento rápido de checkout." },
                { title: "Hub de Insights", tag: "SEO & TRÁFEGO ORGÂNICO", desc: "O hub ideal de conteúdos página de buscas orgânicas do Google." },
                { title: "Portal Corporativo B2B", tag: "SISTEMAS SOB MEDIDA", desc: "Painéis estruturados e bancos de dados integrados para times comerciais internos e transações estruturadas." }
              ].map((site, sIdx) => (
                <div key={sIdx} className="p-7 bg-neutral-900/40 border border-white/[0.04] rounded-3xl flex flex-col justify-between hover:border-brand-secondary/15 hover:bg-white/[0.01] transition-all duration-300 min-h-[190px]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[8.5px] text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2 py-0.5 rounded font-black uppercase">
                        {site.tag}
                      </span>
                      <span className="font-sans text-[9px] text-zinc-600">0{sIdx+1} // ARCH</span>
                    </div>
                    <h3 className="text-white font-display font-bold text-base sm:text-lg uppercase tracking-tight">{site.title}</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans">{site.desc}</p>
                  </div>
                  <div className="pt-3 font-mono text-[9px] text-zinc-600 uppercase tracking-widest border-t border-white/[0.03] mt-4">
                    COMPUTAÇÃO SÊNIOR TAG08
                  </div>
                </div>
              ))}
            </div>
          </div>



          {/* SEÇÃO PORTFÓLIO WEB PREMIUM */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
              <div className="lg:col-span-7 space-y-3">
                <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                  CÒDIGO SOB MEDIDA // DESIGN AUTORAL
                </span>
                <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white uppercase leading-tight tracking-tighter">
                  PORTFÒLIO WEB EXCLUSIVO <br />
                  <span className="text-brand-secondary">E CASOS DE SUCESSO COGNITIVO.</span>
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed font-medium">
                  Não criamos apenas sites; esculpimos joias digitais de alto escalão para marcas que se recusam a ser comuns. Cada linha de código é otimizada para velocidade cirúrgica, conversões e uma experiência visual de alto status internacional. Filtre abaixo e clique para detalhar.
                </p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2.5 border-b border-white/[0.04] pb-6">
              {["TODOS", "PORTAIS", "LANDING PAGES", "SISTEMAS"].map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 font-mono text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-brand-secondary text-black shadow-[0_10px_30px_rgba(var(--color-brand-secondary-rgb),0.12)] border border-brand-secondary"
                        : "bg-white/[0.01] text-zinc-400 border border-white/5 hover:text-white hover:border-white/10"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {webProjects
                .filter((proj) => {
                  if (activeFilter === "TODOS") return true;
                  if (activeFilter === "PORTAIS") return proj.category.includes("Portal");
                  if (activeFilter === "LANDING PAGES") return proj.category.includes("Landing");
                  if (activeFilter === "SISTEMAS") return proj.category.includes("Web System") || proj.category.includes("System");
                  return true;
                })
                .map((proj) => (
                  <motion.div
                    key={proj.id}
                    onMouseEnter={() => setHoveredProject(proj.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                    onClick={() => setSelectedProject(proj)}
                    className="group relative bg-[#09090b] border border-white/[0.04] hover:border-brand-secondary/40 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-[0_22px_60px_rgba(var(--color-brand-secondary-rgb),0.04)] flex flex-col justify-between"
                  >
                    {/* Visual Mockup Container */}
                    <div className="aspect-[16/10] overflow-hidden relative border-b border-white/[0.04]">
                      <img
                        src={proj.screenshot}
                        alt={proj.title}
                        className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      {/* Dark edge vignette overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10 opacity-65 pointer-events-none" />
                      
                      {/* Interactive View Badge */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-black/45 backdrop-blur-xs">
                        <span className="px-5 py-2.5 rounded-full bg-brand-secondary text-black font-mono font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <Eye className="w-4 h-4 text-black stroke-[3]" />
                          <span>ver análises</span>
                        </span>
                      </div>
                    </div>

                    {/* Metadata & Strategical Highlights */}
                    <div className="p-6 sm:p-8 space-y-6 flex-grow flex flex-col justify-between text-left">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[9px] text-brand-secondary bg-brand-secondary/10 px-2.5 py-1 rounded border border-brand-secondary/15 font-black uppercase tracking-wider">
                            {proj.category}
                          </span>
                          <span className="font-sans text-[10px] text-zinc-650 font-bold">
                            {proj.client} // {proj.year}
                          </span>
                        </div>
                        <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight group-hover:text-brand-secondary transition-colors leading-none pt-1">
                          {proj.title}
                        </h3>
                        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans font-medium line-clamp-2">
                          {proj.tagline}
                        </p>
                      </div>

                      {/* Display Key Metrics Directly */}
                      <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/[0.04]">
                        {proj.metrics.map((metric, mIdx) => (
                          <div key={mIdx} className="space-y-0.5 text-left">
                            <span className="font-mono text-[7px] sm:text-[8px] text-zinc-500 uppercase font-black block leading-none">
                              {metric.label}
                            </span>
                            <span className="text-white font-display font-black text-xs sm:text-sm uppercase tracking-tight block">
                              {metric.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between font-mono text-[9.5px] font-black text-zinc-500 group-hover:text-brand-secondary uppercase tracking-wider transition-colors pt-2">
                        <span>ESTUDO DE CASO COMPACTO</span>
                        <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                ))
              }
            </div>
          </div>


          {/* DETALHE MODELO / MODAL */}
          <AnimatePresence>
            {selectedProject && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto bg-black/95 backdrop-blur-xl cursor-zoom-out"
                onClick={() => setSelectedProject(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, y: 30, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.95, y: 30, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 180 }}
                  className="relative w-full max-w-5xl bg-[#09090b] border border-white/[0.08] rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh] md:max-h-[85vh] text-left cursor-default overflow-y-auto md:overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Left Column: Mockup & Image Panel */}
                  <div className="w-full md:w-[42%] bg-zinc-950 relative flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-white/[0.06] aspect-video md:aspect-auto md:h-full min-h-[220px] md:min-h-0">
                    <img
                      src={selectedProject.screenshot}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />
                    
                    {/* Floating Web Details info tag overlays */}
                    <div className="absolute bottom-5 left-5 right-5 bg-black/75 backdrop-blur-md rounded-2xl p-4 border border-white/5 hidden sm:block">
                      <div className="flex justify-between items-center text-[10px] font-sans text-brand-secondary">
                        <span className="uppercase font-black tracking-widest flex items-center gap-1.5 leading-none">
                          <Laptop className="w-3.5 h-3.5" /> ESTADO ATIVO
                        </span>
                        <span className="font-bold">0.4s SPEED GRADE</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Deep Strategy Breakdown */}
                  <div className="w-full md:w-[58%] p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto h-full max-h-[85vh]">
                    
                    {/* Header actions */}
                    <div className="flex items-center justify-between pb-6 border-b border-white/5">
                      <div className="space-y-1">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-black block">
                          DIRETRIZ DE ENGENHARIA DE SOFTWARE // TAG08
                        </span>
                        <h3 className="font-display font-black text-xl text-white uppercase tracking-tight leading-none">
                          ESTUDO DE CASO TҁTICO
                        </h3>
                      </div>
                      
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Detailed estrategic analytics */}
                    <div className="py-6 space-y-6 flex-grow">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[9px] text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/15 px-2.5 py-0.5 rounded font-black uppercase">
                            {selectedProject.category}
                          </span>
                          <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase">
                            CLIENTE: {selectedProject.client}
                          </span>
                        </div>
                        <h2 className="text-white font-display font-black text-2xl uppercase tracking-tight leading-none pt-1">
                          {selectedProject.title}
                        </h2>
                      </div>

                      {/* Summary text */}
                      <p className="text-zinc-400 text-xs sm:text-sm font-sans font-medium leading-relaxed">
                        {selectedProject.description}
                      </p>

                      {/* Behind challenges, solution, results triplets */}
                      <div className="space-y-4 pt-2">
                        <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1">
                          <span className="font-mono text-[8px] text-brand-secondary font-black uppercase tracking-wider block">
                            01. O DESAFIO DE NEGÒCIO
                          </span>
                          <p className="text-zinc-300 text-xs font-sans leading-relaxed">
                            {selectedProject.strategy.challenge}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-brand-secondary/[0.01] border border-brand-secondary/10 space-y-1">
                          <span className="font-mono text-[8px] text-brand-secondary font-black uppercase tracking-wider block">
                            02. A SOLUÇÃO TÉCNICA E DESIGN SOBERANO
                          </span>
                          <p className="text-zinc-300 text-xs font-sans leading-relaxed">
                            {selectedProject.strategy.solution}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1">
                          <span className="font-mono text-[8px] text-brand-secondary font-black uppercase tracking-wider block">
                            03. MҁXIMO IMPACTO & RESULTADOS OBTIDOS
                          </span>
                          <p className="text-zinc-300 text-xs font-sans leading-relaxed">
                            {selectedProject.strategy.result}
                          </p>
                        </div>
                      </div>

                      {/* Detailed metrics card row */}
                      <div className="grid grid-cols-3 gap-3 pt-2">
                        {selectedProject.metrics.map((met, metIdx) => (
                          <div key={metIdx} className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl text-left flex flex-col justify-between">
                            <span className="font-sans text-[7.5px] text-zinc-500 uppercase font-black tracking-wider leading-none">
                              {met.label}
                            </span>
                            <span className="text-brand-secondary font-display font-black text-lg mt-1.5 leading-none">
                              {met.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Technologies wrap */}
                      <div className="space-y-2">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-black block">
                          TECNOLOGIAS USADAS NO PROJETO:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.technologies.map((tech, tIdx) => (
                            <span key={tIdx} className="px-2.5 py-1 text-[9px] font-mono font-black text-white/70 bg-white/[0.3] border border-white/5 rounded-lg uppercase">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Modal footer call to action */}
                    <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex-grow space-y-1 text-center sm:text-left">
                        <span className="font-mono text-[8.5px] text-brand-secondary uppercase tracking-wider block font-bold">
                          ORÇAMENTO SOB DESIGN SÊNIOR
                        </span>
                        <span className="text-zinc-400 text-[10px] leading-tight block">
                          Precisa de um ecossistema digital similar com esse nível de entrega? Converse com nosso arquiteto de software.
                        </span>
                      </div>

                      <a
                        href={buildBrazilWhatsAppUrl(`Olá%20TAG08!%20Estava%20visualizando%20o%20caso%20de%20sucesso%20do%20projeto%20"${encodeURIComponent(selectedProject.title)}"%20e%20gostaria%20de%20solicitar%20um%20diagnóstico%20estratégico%20de%20design%20e%20desenvolvimento%20web%20para%20minha%20empresa.`)}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto px-6 py-3 bg-brand-secondary hover:bg-brand-dark text-black text-[11px] font-sans font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-[0_12px_35px_rgba(var(--color-brand-secondary-rgb),0.15)] cursor-pointer animate-pulse"
                      >
                        <span>solicitar site similar</span>
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </a>
                    </div>

                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* O que está incluso & Pré-requisitos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t border-white/[0.04]">
            {/* O que está incluso */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2 py-0.5 rounded font-black uppercase inline-block">ATIVOS DO PROJETO</span>
                <h3 className="font-display font-semibold text-xl sm:text-2xl text-white uppercase tracking-tight">O que está integrado no escopo</h3>
              </div>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                Escrevemos códigos otimizados sob padrões estritos de arquitetura de software, sem usar construtores visuais lentos ou templates de prateleira:
              </p>
              <div className="grid gap-3 pt-2">
                {[
                  { name: "Arquitetura da Informação", desc: "Mapeamento minucioso do fluxo de cliques do visitante para garantir navegação instintiva." },
                  { name: "Copy Persuasiva do Negócio", desc: "Textos redigidos do zero de acordo com o vocabulário clínico ou corporativo de autoridade." },
                  { name: "Interfaces Totalmente Responsivas", desc: "Testes rigorosos de responsividade em todas as escalas e proporções de telas de dispositivos móveis." },
                  { name: "Sistemas em Código Limpo", desc: "Otimizações severas para alcançar a nota máxima de rapidez técnica (Google Lighthouse)." },
                  { name: "Encaminhamento Automático de Leads", desc: "Conexões seguras para enviar cadastros diretamente para seu CRM ou WhatsApp comercial." }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-neutral-900/40 border border-white/[0.04] space-y-1">
                    <h4 className="text-white text-xs sm:text-sm font-display font-medium uppercase tracking-tight flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" /> {item.name}
                    </h4>
                    <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pré-requisitos técnicos */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase inline-block">ALINHAMENTO OPERACIONAL</span>
                <h3 className="font-display font-semibold text-xl sm:text-2xl text-white uppercase tracking-tight">Os pré-requisitos essenciais</h3>
              </div>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                Para darmos vazão tática e garantirmos o prazo estipulado de entrega, certifique-se de dispor desse alinhamento inicial:
              </p>
              <div className="grid gap-3 pt-2">
                {[
                  { title: "Domínio Registrado", desc: "Endereço corporativo próprio (ex: suaempresa.com.br). Fornecemos auxílio técnico caso necessite registrar do zero." },
                  { title: "Serviço de Hospedagem Segura", desc: "Servidores em nuvem de alta estabilidade onde instalamos as soluções e fazemos as publicações." },
                  { title: "Identidade Visual Definida", desc: "Tipografia, logotipo oficial e paleta de cores primárias. Se necessário, conte com nossa divisão de Branding." },
                  { title: "Conteúdo Base", desc: "Técnica para dar autenticidade e humanidade às páginas." },
                  { title: "Acessos Técnicos de Provedores", desc: "Credenciais de DNS necessárias para interligarmos registros visando a publicação final do site." }
                ].map((point, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-charcoal-900 border border-white/[0.03] space-y-1">
                    <h4 className="text-brand-secondary text-xs font-display font-bold uppercase tracking-tight">{point.title}</h4>
                    <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">{point.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seção Pós-entrega - LEGADO WEB BANNER */}
          <div className="p-7 sm:p-9 rounded-3xl bg-neutral-900/30 border border-white/[0.05] space-y-6 relative overflow-hidden text-left">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            
            <div className="space-y-2 relative z-10">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-black block">LEGADO WEB // SOBERANIA DIGITAL</span>
              <h3 className="text-white font-display font-medium text-xl uppercase">Acompanhamento Técnico Pós-Entrega e Segurança Ativa</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl">
                O término da codificação é apenas a primeira etapa de um ecossistema digital estável. Nosso acordo técnico corporativo protege e atualiza sua aplicação para que sua operação nunca sofra interrupções:
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2 relative z-10">
              {[
                { title: "Suporte Imediato", desc: "Atendimento prioritário de plantão técnico para correções imediatas de bugs ocorridos." },
                { title: "Monitoramento Ativo", desc: "Monitoração contínua da velocidade e nota de performance visual em celulares." },
                { title: "Hospedagem Gerenciada", desc: "Infraestrutura de nuvem, certificado SSL ativo e backups de segurança periódicos." },
                { title: "Evoluções Planificadas", desc: "Criamos novas landing pages e ajustamos blocos operacionais de textos sob demanda." }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5 p-4 rounded-2xl bg-zinc-950/40 border border-white/[0.03]">
                  <h4 className="text-white text-xs font-display font-bold uppercase tracking-tight">{item.title}</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA para Análise Web - PREMIUM CONVERSION */}
          <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900/50 border border-white/[0.06] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 text-left font-sans">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            
            <div className="relative z-10 space-y-2 max-w-2xl">
              <span className="font-mono text-[9px] text-brand-secondary bg-brand-secondary/5 px-2.5 py-0.5 rounded border border-brand-secondary/10 uppercase tracking-widest font-black">AUDITORIA DE PERFORMANCE</span>
              <h3 className="font-display font-semibold text-xl sm:text-2xl text-white uppercase tracking-tight">O site da sua empresa está engasgando ou perdendo dinheiro?</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-semibold">
                Analisamos e identificamos os gargalos de rapidez do seu portal de forma totalmente gratuita. Converse com nossa divisão de engenharia de software e solicite uma avaliação.
              </p>
            </div>
            
            <button
              onClick={() => {
                onNavigate("/contato");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group relative px-6 py-4 bg-brand-secondary hover:bg-brand-dark text-black text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shrink-0 overflow-hidden shadow-[0_8px_30px_rgba(var(--color-brand-secondary-rgb),0.15)] hover:-translate-y-0.5 relative z-10"
            >
              Auditar Meu Portal <ArrowRight className="w-4 h-4 ml-1.5 inline-block group-hover:translate-x-1 transition-transform" />
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
                  DҚVIDAS &amp; <br />
                  DESENVOLVIMENTO
                </h2>
                <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans max-w-sm">
                  Esclareça as principais dúvidas sobre nossa divisão técnica de engenharia web focada em alta performance e design estático.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {([
                  { id: 0, title: "CMS VS CÒDIGO NATIVO" },
                  { id: 1, title: "DIRETRIZ DE COPYWRITING" },
                  { id: 2, title: "COMPATIBILIDADE MOBILE" },
                  { id: 3, title: "SISTEMAS E RASTREAMENTO" }
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
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
                alt="TAG08 Web Design"
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div className="absolute top-6 left-6 z-10 pointer-events-none font-mono text-[8px] text-white/20 uppercase tracking-widest leading-none">
                SYS // STATIC_WEB
              </div>

              <div className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left">
                <span className="font-mono text-[8.5px] text-brand uppercase tracking-widest font-black block">
                  {([
                    "CMS VS CÒDIGO NATIVO",
                    "DIRETRIZ DE COPYWRITING",
                    "COMPATIBILIDADE MOBILE",
                    "SISTEMAS E RASTREAMENTO"
                  ])[activeFaq]}
                </span>
                
                <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {([
                    "O site é feito em WordPress ou Elementor?",
                    "Quem fará os textos das páginas de destino?",
                    "O site se adapta a smartphones?",
                    "Vocês cuidam dos rastreamentos e tags?"
                  ])[activeFaq]}
                </h4>
                
                <p className="text-zinc-300 text-xs sm:text-[12.5px] leading-relaxed font-sans font-medium">
                  {([
                    "Não. Nossos sites são inteiramente desenvolvidos em código limpo estático nativo utilizando ferramentas modernas de alta performance (como React, Tailwind CSS e Vite). Isso confere imunidade total a invasões, quedas, falhas de plugins e velocidade de carregamento insuperável.",
                    "Nossa própria equipe de copywriting escreve todos os títulos de impacto, narrativas de autoridade e chamadas de ação baseando-se em estudo prévio do seu comportamento de vendas, eliminando clichês de autoajuda ou textos irrelevantes.",
                    "Sim. Seguimos o princípio estrito de Mobile First. Mais de 85% do público de anúncios chega por celulares, por isso, cada componente, formulário e fluxo de clique é dimensionado perfeitamente para dedões e telas verticais de toque.",
                    "Sim. Integramos APIs seguras de WhatsApp, formulários dinâmicos com proteção anti-spam e configuramos tags fundamentais do Google Tag Manager, pixels do Meta Ads, e indexações limpas nas plataformas do Google Search Console."
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
                    Eliminamos lentidão excessiva e falha técnica crônica. Garantimos máxima performance Google.
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
                  href={buildBrazilWhatsAppUrl("Olá,%20gostaria%20de%20consultar%20viabilidade%20estratégica%20especializada%2520para%20minha%20marca!")}
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
          COLOQUE SEU ENDEREçO DIGITAL <br />
          <span className="text-brand">ELEVE A ALTURA DO SEU PRESTÍGIO COMERCIAL.</span>
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Evite continuar perdendo orçamentos em telas que demoram séculos para carregar no 4G. Fale agora mesmo com nosso engenheiro líder de projetos.
        </p>
        <div className="pt-4">
          <button
            onClick={() => handleLinkClick("/contato")}
            className="group bg-brand text-black font-mono font-black text-[10px] uppercase tracking-widest py-4 px-8 rounded-full shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.22)] hover:bg-brand-dark duration-300 transition-all cursor-pointer flex items-center gap-2 mx-auto"
          >
            <span>CONSTRUIR ESTRUTURA WEB EXCLUSIVA</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </section>
    </div>
  );
}

