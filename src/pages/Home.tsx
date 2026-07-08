import React, { useState, useEffect } from "react";
import { ArrowUpRight, Check, CheckCircle2, TrendingUp, Cpu, Sparkles, Award, Shield, UserCheck, Play, HelpCircle, ArrowRight, MessageSquare, Activity, X, Wifi, Plus, Star, Layers, Zap, ArrowDown, ArrowLeft } from "lucide-react";
import { SERVICES, PLANS, CASE_STUDIES } from "../data";
import { CaseStudy } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { TAG08_OFFICIAL_CONTACT, TAG08_OFFICIAL_YOUTUBE_URL, buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl } from "../config/siteNetwork";
import type { OfficialContentApiResponse } from "../lib/officialContent";
import { trackOutboundClick } from "../lib/analytics";
import Subtle3DCanvas from "../components/Subtle3DCanvas";
import { Suspense, lazy } from "react";

import heroCyberMannequin from "../assets/images/hero_cyber_mannequin_1780448864545.jpg";
import creativeLeaderPortrait from "../assets/images/creative_leader_portrait_1780449653164.jpg";
import moodyClientPortrait from "../assets/images/moody_client_portrait_1780449811793.jpg";
import clientAlanRocha from "../assets/images/client_alan_rocha_1780449828496.jpg";

const DiagnosticDiagram = lazy(() => import("../components/DiagnosticDiagram"));

const CLIENT_CASES = [
  {
    id: "alan-rocha",
    name: "Alan Rocha",
    handle: "@alanrochap",
    categoryTags: ["DESIGN", "SOCIAL MEDIA", "BRANDING"],
    tagline: "A ÃšNICA REAÃ‡ÃƒO FOI PENSAR:",
    quote: "Parece que fui dirigida por alguÃ©m que me conhece de verdade. Que entende meu estilo, minha energia e o que quero mostrar.",
    avatar: clientAlanRocha,
    backgroundImg: moodyClientPortrait,
    colors: ["var(--color-brand)", "#111111"],
    caseName: "CASE DE POSICIONAMENTO â€” 2025"
  },
  {
    id: "le-visage",
    name: "ClÃ­nica Le Visage",
    handle: "@clinicalevisage",
    categoryTags: ["ESTÃ‰TICA", "LUXURY SPA", "IDENTIDADE"],
    tagline: "SOPRO DE SOFISTICAÃ‡ÃƒO E ARTE:",
    quote: "A TAG08 capturou o refinamento dermoestÃ©tico com absoluto primor. Nosso novo visual personifica o acolhimento elegante e o requinte que nossos pacientes exigem.",
    avatar: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=200",
    backgroundImg: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1200",
    colors: ["var(--color-brand)", "#111111"],
    caseName: "ESTÃ‰TICA DE LUXO â€” 2024"
  },
  {
    id: "luciana-gadelha",
    name: "Luciana Gadelha",
    handle: "@dra.lucianagadelha",
    categoryTags: ["MEDICINE", "ORAL ART", "BRANDING"],
    tagline: "TRANSMITINDO A ARTE DO SORRISO:",
    quote: "O branding desenvolvido trouxe a sofisticaÃ§Ã£o exata do nosso trabalho clÃ­nico. Elevou nossa comunicaÃ§Ã£o ao patamar de grife, gerando desejo imediato na nossa regiÃ£o.",
    avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200",
    backgroundImg: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=1200",
    colors: ["var(--color-brand)", "#111111"],
    caseName: "ODONTOLOGIA HIGH-END â€” 2024"
  },
  {
    id: "doctor-play",
    name: "Doctor Play",
    handle: "@doctorplay.br",
    categoryTags: ["MEDTECH", "STREAMING", "SISTEMA"],
    tagline: "CONTEÃšDO MÃ‰DICO REVOLUCIONADO:",
    quote: "Unimos entretenimento do streaming de alta qualidade com educaÃ§Ã£o tÃ©cnica em saÃºde. O design e posicionamento que a equipe estruturou nos destaca hoje como uma plataforma inovadora de extrema confianÃ§a.",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
    backgroundImg: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200",
    colors: ["var(--color-brand)", "#111111"],
    caseName: "PLATAFORMA STREAM â€” 2025"
  },
  {
    id: "legal-lab",
    name: "Legal Lab",
    handle: "@legallab.law",
    categoryTags: ["LAW TECH", "CORPORATIVO", "MINIMALISMO"],
    tagline: "DIREITO & INOVAÃ‡ÃƒO PRECISA:",
    quote: "Unindo a seriedade jurÃ­dica ao design de precisÃ£o digital hexagonal. Uma transiÃ§Ã£o visual impecÃ¡vel que reposicionou nossa marca perante grandes corporaÃ§Ãµes.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    backgroundImg: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1200",
    colors: ["var(--color-brand)", "#111111"],
    caseName: "LAW TECH CONCEITO â€” 2025"
  },
  {
    id: "squalis",
    name: "Squalis EducaÃ§Ã£o",
    handle: "@squaliseducacao",
    categoryTags: ["ACADEMIA", "PROCESSOS", "TECNOLOGIA"],
    tagline: "PERFORMANCE DE SINALIZAÃ‡ÃƒO:",
    quote: "O redesenho integral do ecossistema Squalis facilitou nÃ£o apenas as vendas nos canais de captaÃ§Ã£o de alunos, mas elevou incrivelmente o valor de mercado percebido pelos tomadores de decisÃ£o.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    backgroundImg: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
    colors: ["var(--color-brand)", "#111111"],
    caseName: "ACADEMIA CORPORATIVA â€” 2024"
  }
];

const YOUTUBE_VIDEOS = [
  {
    id: "posicionamento-alto-nivel",
    title: "O Posicionamento de PresenÃ§a Digital de Alto NÃ­vel",
    description: "AnÃ¡lise sÃªnior sobre como diretores e marcas conceitadas estruturam sua autoridade visual e tom de voz no ecossistema digital sem os clichÃªs das agÃªncias tradicionais.",
    duration: "12:45",
    date: "28 Mai, 2026",
    category: "BRANDING",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
    embedCode: "612U4R57M70", // A generic video presentation code, we also support direct channel handle redirect
    videoUrl: TAG08_OFFICIAL_YOUTUBE_URL,
    views: "12.4K visualizaÃ§Ãµes",
    tagline: "DIREÃ‡ÃƒO INTUITIVA & COESÃƒO VISUAL"
  },
  {
    id: "branding-blueprint",
    title: "Branding Blueprint: Criando uma Identidade Soberana",
    description: "Por trÃ¡s das cortinas do laboratÃ³rio estÃ©tico da TAG08. Como desenvolver contrastes, fontes com alma e diagramaÃ§Ãµes sÃªniores que transmitem autoridade imediata.",
    duration: "18:20",
    date: "14 Mai, 2026",
    category: "DESIGN SYSTEM",
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=1200",
    embedCode: "612U4R57M70",
    videoUrl: TAG08_OFFICIAL_YOUTUBE_URL,
    views: "8.9K visualizaÃ§Ãµes",
    tagline: "SOPRO DE SOFISTICAÃ‡ÃƒO E ARTE"
  },
  {
    id: "trafego-pago-saboroso",
    title: "Como Estruturar CaptaÃ§Ã£o e AnÃºncios Sem Queimar OrÃ§amento",
    description: "A matemÃ¡tica cirÃºrgica dos anÃºncios corporativos. Saiba como segmentar com alta intenÃ§Ã£o de compra e evitar desperdÃ­cios com campanhas genÃ©ricas ou superficiais.",
    duration: "15:10",
    date: "03 Mai, 2026",
    category: "MARKETING SÃŠNIOR",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    embedCode: "612U4R57M70",
    videoUrl: TAG08_OFFICIAL_YOUTUBE_URL,
    views: "14.2K visualizaÃ§Ãµes",
    tagline: "MÃXIMA EFICIÃŠNCIA OPERACIONAL"
  },
  {
    id: "sistemas-operacionais-digitais",
    title: "Sistemas Operacionais Digitais: O Fim das Planilhas de Feedback",
    description: "DemonstraÃ§Ã£o prÃ¡tica de como organizamos e orquestramos a produÃ§Ã£o de conteÃºdo com velocidade e sem conversas caÃ³ticas por e-mail ou WhatsApp corporativo irrelevantes.",
    duration: "09:55",
    date: "21 Abr, 2026",
    category: "FLUXO EXECUTIVO",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200",
    embedCode: "612U4R57M70",
    videoUrl: TAG08_OFFICIAL_YOUTUBE_URL,
    views: "7.5K visualizaÃ§Ãµes",
    tagline: "COMUNICAÃ‡ÃƒO CONCRETA ASSÃNCRONA"
  }
];

const SERVICOS_TILES = [
  {
    id: "redes-sociais",
    title: "GestÃ£o de Redes",
    subtitle: "CONTEÃšDO & INSTAGRAM",
    desc: "Planejamento editorial de alto nÃ­vel, redaÃ§Ã£o, roteiros e publicaÃ§Ã£o consistente.",
    bgClass: "bg-charcoal-900",
    textClass: "text-white",
    icon: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-black fill-current opacity-95">
        <g transform="rotate(-10, 50, 50)">
          <rect x="25" y="15" width="13" height="70" rx="4" />
          <rect x="43" y="15" width="13" height="70" rx="4" />
          <rect x="61" y="15" width="13" height="70" rx="4" transform="rotate(15, 68, 50)" />
        </g>
      </svg>
    ),
    slug: "/servicos/gestao-de-redes-sociais"
  },
  {
    id: "podcasts-audiovisual",
    title: "Audiovisual & Podcasts",
    subtitle: "REELS, PODCASTS, SHORTS",
    desc: "RoteirizaÃ§Ã£o magnÃ©tica, direÃ§Ã£o de cena, captaÃ§Ã£o e pÃ³s-produÃ§Ã£o integrada.",
    bgClass: "bg-charcoal-900",
    textClass: "text-white",
    icon: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-black fill-current opacity-95">
        <rect x="40" y="15" width="20" height="42" rx="10" />
        <path d="M28,36 C28,55 72,55 72,36" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        <rect x="45" y="58" width="10" height="22" rx="2" />
        <rect x="32" y="78" width="36" height="10" rx="4" />
      </svg>
    ),
    slug: "/servicos"
  },
  {
    id: "branding",
    title: "Branding & ID Luxo",
    subtitle: "MARCA AUTORAL HIGH-END",
    desc: "Posicionamento estÃ©tico refinado, paletas magnÃ©ticas e manuais indestrutÃ­veis.",
    bgClass: "bg-charcoal-900",
    textClass: "text-white",
    icon: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-black fill-none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
        <path d="M25 75 L75 25 M75 25 L38 25 M75 25 L75 62" />
      </svg>
    ),
    slug: "/servicos/branding-identidade"
  },
  {
    id: "trafego-pago",
    title: "TrÃ¡fego & Escala",
    subtitle: "META ADS, GOOGLE, LINKEDIN",
    desc: "AnÃºncios cirÃºrgicos para captar pÃºblico qualificado e acelerar os seus canais.",
    bgClass: "bg-charcoal-900",
    textClass: "text-white",
    icon: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-black fill-current opacity-95">
        <g transform="translate(50, 50)">
          {[...Array(8)].map((_, index) => (
            <rect
              key={index}
              x="-8"
              y="-40"
              width="16"
              height="80"
              rx="8"
              transform={`rotate(${index * 45})`}
            />
          ))}
        </g>
      </svg>
    ),
    slug: "/servicos"
  },
  {
    id: "copywriting",
    title: "Copywriting EstratÃ©gico",
    subtitle: "COMUNICAÃ‡ÃƒO DIRECIONADA",
    desc: "Roteiros e textos focados em extrair a personalidade exata do seu negÃ³cio.",
    bgClass: "bg-charcoal-900",
    textClass: "text-white",
    icon: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-black fill-current opacity-95">
        <path d="M30 40 C30 52 42 58 50 48 C58 58 70 52 70 40 C70 28 58 22 50 32 C42 22 30 28 30 40 Z" fill="none" stroke="currentColor" strokeWidth="10" />
        <circle cx="34" cy="40" r="8" />
        <circle cx="66" cy="40" r="8" />
        <circle cx="50" cy="24" r="8" />
        <circle cx="50" cy="56" r="8" />
      </svg>
    ),
    slug: "/servicos"
  },
  {
    id: "desenvolvimento-web",
    title: "Desenvolvimento Web",
    subtitle: "INSTITUCIONAIS & LANDING PAGES",
    desc: "Portais ultrarrÃ¡pidos codificados Ã  mÃ£o, limpos, que convertem acessos em vendas.",
    bgClass: "bg-charcoal-900",
    textClass: "text-white",
    icon: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-black fill-current opacity-95">
        <rect x="18" y="28" width="48" height="44" rx="12" />
        <polygon points="66,42 86,30 86,70 66,58" strokeLinejoin="round" />
        <circle cx="42" cy="50" r="6" fill="#BD856C" />
      </svg>
    ),
    slug: "/servicos/desenvolvimento-web"
  },
  {
    id: "process-intelligence",
    title: "Process Intelligence",
    subtitle: "ELIMINAR CAOS OPERACIONAL",
    desc: "Playbooks, centrais de conhecimento corporativas e modelagem de processos.",
    bgClass: "bg-charcoal-900",
    textClass: "text-white",
    icon: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-black fill-none" stroke="currentColor" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round">
        <path d="M75 25 L25 75 M25 75 L65 75 M25 75 L25 35" />
      </svg>
    ),
    slug: "/servicos/process-intelligence"
  }
];

const PORTFOLIO_SERVICES_DATA = [
  {
    id: "redes-sociais",
    title: "GestÃ£o de Redes",
    subtitle: "CONTEÃšDO & INSTAGRAM",
    shortDesc: "Planejamento de alto nÃ­vel e consistÃªncia refinada.",
    longDesc: "Alinhamos cada carrossel, roteiro de vÃ­deo e imagem estÃ¡tica para construir uma percepÃ§Ã£o de grife que gera desejo imediato na sua audiÃªncia de alta renda.",
    metricLabel: "CRESCIMENTO",
    metricValue: "+83%",
    chartLabel: "CONVERSÃƒO DE LEAD",
    chartSubtitle: "Filtros de conteÃºdo e trÃ¡fego pago integrados para eliminar curiosos da sua base.",
    bgImage: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1200",
    wavePath: "M10,48 C30,48 50,20 70,36 C90,52 110,8 130,28 C150,48 170,12 190,4",
    slug: "/servicos",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    )
  },
  {
    id: "podcasts-audiovisual",
    title: "Audiovisual & Podcasts",
    subtitle: "REELS, PODCASTS, SHORTS",
    shortDesc: "RoteirizaÃ§Ã£o magnÃ©tica e pÃ³s-produÃ§Ã£o integrada.",
    longDesc: "CaptaÃ§Ã£o com lentes cinematogrÃ¡ficas, tratamento acÃºstico impecÃ¡vel e ediÃ§Ã£o dinÃ¢mica com ritmo cirÃºrgico para elevar a retenÃ§Ã£o acima do patamar comum.",
    metricLabel: "RETENÃ‡ÃƒO DE REELS",
    metricValue: "68.4%",
    chartLabel: "TEMPO ASSISTIDO",
    chartSubtitle: "AnÃ¡lise quantitativa de retenÃ§Ã£o mÃ©dia das mÃ­dias verticais de vÃ­deo curto.",
    bgImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1200",
    wavePath: "M10,40 C30,10 50,45 70,15 C90,35 110,5 130,30 C150,10 170,40 190,15",
    slug: "/servicos",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
      </svg>
    )
  },
  {
    id: "branding",
    title: "Branding & ID Luxo",
    subtitle: "MARCA AUTORAL HIGH-END",
    shortDesc: "Posicionamento estÃ©tico e paletas magnÃ©ticas.",
    longDesc: "Desenhamos logotipos clÃ¡ssicos sob medida, tipografia com curadoria artÃ­stica fina e manuais completos de expressÃ£o de marca e tom de voz unificado corporativo.",
    metricLabel: "BRAND EQUITY",
    metricValue: "CLASSE A",
    chartLabel: "VALOR PERCEBIDO",
    chartSubtitle: "GeraÃ§Ã£o de atraÃ§Ã£o de clientes qualificados dispostos a investir sem objeÃ§Ã£o.",
    bgImage: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=1200",
    wavePath: "M10,45 L40,15 L70,35 L100,5 L130,25 L160,10 L190,5",
    slug: "/servicos/branding-identidade",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    )
  },
  {
    id: "trafego-pago",
    title: "TrÃ¡fego & Escala",
    subtitle: "META ADS, GOOGLE, LINKEDIN",
    shortDesc: "AnÃºncios cirÃºrgicos para captar pÃºblico qualificado.",
    longDesc: "DistribuiÃ§Ã£o inteligente das suas pautas estratÃ©gicas direcionadas especificamente a mÃ©dicos, empresÃ¡rios e decisores da sua regiÃ£o comercial.",
    metricLabel: "ROI RETORNO",
    metricValue: "5.4x",
    chartLabel: "CUSTO POR LEAD (CPL)",
    chartSubtitle: "Processo contÃ­nuo de otimizaÃ§Ã£o de lances para maior eficiÃªncia por real investido.",
    bgImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200",
    wavePath: "M10,50 L40,40 L70,30 L100,20 L130,15 L160,8 L190,2",
    slug: "/servicos",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )
  },
  {
    id: "copywriting",
    title: "Copywriting EstratÃ©gico",
    subtitle: "COMUNICAÃ‡ÃƒO DIRECIONADA",
    shortDesc: "Roteiros e textos que eliminam clichÃªs comerciais.",
    longDesc: "Lapidamos legendas, pÃ¡ginas e argumentos de vendas com redaÃ§Ã£o persuasiva polida, refinando e vestindo sua comunicaÃ§Ã£o corporativa com elegÃ¢ncia intelectual.",
    metricLabel: "CLIQUE TAXA (CTR)",
    metricValue: "+14.2%",
    chartLabel: "RETENÃ‡ÃƒO DO LEITOR",
    chartSubtitle: "Roteiros construÃ­dos com estrutura hipnÃ³tica que eliminam mensagens robÃ³ticas.",
    bgImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200",
    wavePath: "M10,35 C40,45 60,10 90,30 C120,45 150,15 190,10",
    slug: "/servicos",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    )
  },
  {
    id: "desenvolvimento-web",
    title: "Desenvolvimento Web",
    subtitle: "INSTITUCIONAIS & LANDING PAGES",
    shortDesc: "Portais ultrarrÃ¡pidos codificados Ã  mÃ£o.",
    longDesc: "Desenvolvemos cÃ³digos limpos, responsivos com performance exemplar de Lighthouse 100% para evitar qualquer atrito de carregamento em anÃºncios.",
    metricLabel: "PERFORMANCE SCORE",
    metricValue: "100",
    chartLabel: "VELOCIDADE CARREGAMENTO",
    chartSubtitle: "Servidores globais sob medida garantindo carregamento ultrarrÃ¡pido em celulares.",
    bgImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200",
    wavePath: "M10,48 L50,48 L90,12 L130,12 L170,12 L190,12",
    slug: "/servicos/desenvolvimento-web",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    )
  },
  {
    id: "process-intelligence",
    title: "Process Intelligence",
    subtitle: "ELIMINAR CAOS OPERACIONAL",
    shortDesc: "Playbooks, centrais de conhecimento corporativas.",
    longDesc: "Auditoria analÃ­tica operacional completa dos seus fluxos cotidianos e documentaÃ§Ã£o completa em um Hub de Conhecimento centralizado para acelerar on-boarding de equipe.",
    metricLabel: "EFICÃCIA OPERACIONAL",
    metricValue: "+45%",
    chartLabel: "TEMPO DE RESPOSTA",
    chartSubtitle: "Modelagem visual completa reduzindo drasticamente gargalos de comunicaÃ§Ã£o.",
    bgImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1200",
    wavePath: "M10,8 L40,25 L70,15 L100,35 L130,25 L160,45 L190,48",
    slug: "/servicos/process-intelligence",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    )
  }
];

const GMB_REVIEWS = [
  {
    name: "Dra. Roberta Chaves",
    role: "ClÃ­nica de Odontologia de Alta Performance",
    avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200",
    time: "hÃ¡ 2 semanas",
    tagline: "Nosso posicionamento e site finalmente transmitem tratamento de grife.",
    text: "Fizemos o reposicionamento estÃ©tico da nossa clÃ­nica e o novo site premium com a lindeza analÃ­tica da TAG08. Estou impactada com a precisÃ£o do design. Nosso volume de pacientes particulares de alto padrÃ£o aumentou muito porque finalmente nossa comunicaÃ§Ã£o condiz com o nosso tratamento.",
    category: "BRANDING ATIVO"
  },
  {
    name: "Marcus Azevedo",
    role: "CEO, Azevedo Asset",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    time: "hÃ¡ 1 mÃªs",
    tagline: "Desenhamos um hub operacional dinÃ¢mico focado em performance sem ruÃ­do.",
    text: "Trabalho impecÃ¡vel de Process Intelligence. Eles auditaram nossa estrutura e desenharam um hub assÃ­ncrono que acabou com a bagunÃ§a no WhatsApp. O time hoje sabe exatamente o que fazer com playbooks dinÃ¢micos. Economia gigantesca de tempo de gerÃªncia.",
    category: "PROCESSES"
  },
  {
    name: "Juliana Reis",
    role: "SÃ³cia Fundadora, Le Visage Spa",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    time: "hÃ¡ 3 semanas",
    tagline: "Fugimos dos padrÃµes genÃ©ricos e clichÃªs de agÃªncias comuns do mercado.",
    text: "A assessoria de redes sociais e conteÃºdo da TAG08 Ã© magnÃ­fica. Eles planejam os carrossÃ©is e roteiros de reels com foco em elegÃ¢ncia e sofisticaÃ§Ã£o, fugindo daquilo que as agÃªncias comuns entregam. Elevou nossa marca no mercado de luxo local.",
    category: "REDES SOCIAIS"
  },
  {
    name: "Dr. Arthur Mendes",
    role: "Diretor ClÃ­nico, Mendes Odontologia",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    time: "hÃ¡ 2 meses",
    tagline: "TrÃ¡fego de escala sÃªnior trazendo leads qualificados prontos para fechar.",
    text: "O trÃ¡fego de escala deles Ã© muito bem estruturado. JÃ¡ passei por trÃªs assessorias que apenas queimavam verba trazendo curiosos. Na TAG08 eles organizam filtros funcionais nos criativos e nos trazem leads mais qualificados para conversar sobre tratamentos.",
    category: "TRÃFEGO ADS"
  },
  {
    name: "Beatriz Nogueira",
    role: "Diretora de Marketing, Grupo BN",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    time: "hÃ¡ 1 mÃªs",
    tagline: "O diagnÃ³stico gratuito me revelou mais do que consultorias caras do setor.",
    text: "O diagnÃ³stico gratuito deles foi melhor do que muitas consultorias pagas que jÃ¡ contratamos. Eles mostram os furos exatos na estrutura de branding e oferecem um plano claro. Implementamos tudo e o resultado veio rÃ¡pido.",
    category: "DIAGNÃ“STICO"
  },
  {
    name: "Leonardo Castilho",
    role: "Fundador, Castilho Advocacia",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    time: "hÃ¡ 3 meses",
    tagline: "Nossos canais abrindo instantaneamente e transmitindo postura de grife.",
    text: "Desenvolver nosso ecossistema web com cÃ³digos nativos pela TAG08 foi o divisor de Ã¡guas da nossa captaÃ§Ã£o corporativa. O site abre instantaneamente no celular do cliente e passa uma postura de grife jurÃ­dica inabalÃ¡vel.",
    category: "DEV WEB PREMIUM"
  }
];

const DIAGNOSTIQUER_PHASES = {
  discovery: {
    title: "Discovery // Alinhamento EstÃ©tico & Posicionamento",
    badge: "FASE 01",
    desc: "Identificamos desvios invisÃ­veis no posicionamento institucional e na construÃ§Ã£o da sua marca frente ao seu pÃºblico premium.",
    rating: "Risco de Posicionamento: CrÃ­tico (82%)",
    ratingWidth: "82%",
    symptoms: [
      {
        id: "idea",
        label: "RUÃDO EDITORIAL",
        desc: "VocÃª produz conteÃºdos frequentes no digital, mas eles nÃ£o traduzem a senioridade e robustez tÃ©cnica real do negÃ³cio.",
        symptom: "A narrativa atrai curiosos em vez de diretores e clientes corporativos de alto padrÃ£o."
      },
      {
        id: "brand_friction",
        label: "CONTRASTE VISUAL AMADOR",
        desc: "Sua marca offline Ã© consagrada e fatura alto, mas a presenÃ§a digital parece menor, desatualizada ou genÃ©rica.",
        symptom: "Design desatualizado gera fricÃ§Ã£o comercial e exige esforÃ§o humano triplo para fechar vendas."
      }
    ]
  },
  analysis: {
    title: "Analysis // IdentificaÃ§Ã£o de Fugas e ConversÃ£o",
    badge: "FASE 02",
    desc: "Auditamos rigorosamente a experiÃªncia do usuÃ¡rio e a velocidade dos pontos de contato digitais para estancar o desperdÃ­cio analÃ­tico.",
    rating: "Vazamento de Capital: Alto (65%)",
    ratingWidth: "65%",
    symptoms: [
      {
        id: "bottlenecks",
        label: "FUNIL SITES LENTOS & COMPLEXOS",
        desc: "Seu site principal Ã© lento, com navegaÃ§Ã£o confusa ou falhas crÃ´nicas de UX que dispersam visitas de anÃºncios pagos.",
        symptom: "Perda imediata de ROI das campanhas patrocinadas antes mesmo do lead acionar o comercial."
      }
    ]
  },
  design: {
    title: "Design & Delivery // OperaÃ§Ãµes e ConstÃ¢ncia",
    badge: "FASE 03",
    desc: "Mapeamos e otimizamos as rotinas de processos para garantir que o crescimento comercial seja amparado por uma fundaÃ§Ã£o sÃ³lida.",
    rating: "Desgaste de OperaÃ§Ã£o: Muito Alto (78%)",
    ratingWidth: "78%",
    symptoms: [
      {
        id: "solutions",
        label: "CAOS DE OPERAÃ‡ÃƒO",
        desc: "Equipe ou agÃªncia atual opera no improviso tÃ¡tico, dependendo de reuniÃµes pesadas e alinhamentos diÃ¡rios urgentes.",
        symptom: "AusÃªncia de documentaÃ§Ã£o ou playbooks faz sua lideranÃ§a atuar como apagadora de incÃªndio."
      },
      {
        id: "scale",
        label: "FALTA DE MÃ‰TODO",
        desc: "HÃ¡ faturamento e traÃ§Ã£o inicial, porÃ©m falta previsibilidade e governanÃ§a de processos para garantir constÃ¢ncia na entrega sÃªnior.",
        symptom: "O ecossistema depende excessivamente de figuras especÃ­ficas e sofre com gargalos recorrentes."
      }
    ]
  }
};

interface CaseStudyCardProps {
  key?: string;
  item: CaseStudy;
  onClick: () => void;
}

function CaseStudyCard({ item, onClick }: CaseStudyCardProps) {
  const [imgError, setImgError] = useState(false);

  let CardIcon = Sparkles;
  if (item.id.includes("saas")) {
    CardIcon = Cpu;
  } else if (item.id.includes("advocacia")) {
    CardIcon = Shield;
  }

  return (
    <div
      onClick={onClick}
      className="bg-charcoal-900 border border-white/[0.04] p-5 pb-7 rounded-[28px] overflow-hidden cursor-pointer group flex flex-col justify-between transition-all duration-350 hover:border-brand/25 hover:-translate-y-1 relative shadow-lg h-full"
    >
      {/* Top Image area mimicking mockup precisely with premium grayscale/vibrant transition */}
      <div className="relative h-[210px] w-full rounded-[20px] overflow-hidden mb-2 bg-zinc-950">
        <div className="absolute inset-0 bg-black/40 z-10 hover:opacity-10 transition-opacity" />
        
        {imgError ? (
          /* Robust elegant architectural design fallback placeholder */
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-[#121214] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--color-brand-secondary-rgb),0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--color-brand-secondary-rgb),0.012)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-60" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand/[0.02] rounded-full blur-[60px] pointer-events-none" />
            
            <div className="flex flex-col items-center gap-2 text-center select-none p-4 w-full">
              <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-1">
                <CardIcon className="w-5 h-5 text-zinc-500 stroke-[1.2]" />
              </div>
              <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-semibold">
                {item.client}
              </span>
              <p className="font-sans text-[10px] text-zinc-600 max-w-[190px] leading-tight line-clamp-2">
                {item.category} // DIAGNÃ“STICO ATIVO
              </p>
            </div>
          </div>
        ) : (
          <img
            src={item.image}
            alt=""
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 grayscale group-hover:grayscale-0"
            referrerPolicy="no-referrer"
          />
        )}
        
        {/* Floating category tag top-left */}
        <span className="absolute top-4 left-4 z-20 bg-black/75 backdrop-blur-sm border border-white/[0.08] px-3 py-1 text-[9px] font-mono text-zinc-300 uppercase tracking-wider rounded-full">
          {item.category}
        </span>

        {/* Highly polished metric banner top-right */}
        <div className="absolute top-4 right-4 z-20 bg-brand text-black font-display font-black px-3 py-1 text-xs rounded-full shadow-lg flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {item.metric}
        </div>

        {/* Overlapping circular icon bottom-left */}
        <div className="absolute -bottom-3 left-5 w-11 h-11 rounded-full bg-brand text-black shadow-lg flex items-center justify-center z-20 transform transition-transform group-hover:scale-110 duration-300">
          <CardIcon className="w-4.5 h-4.5" />
        </div>
      </div>

      {/* Content under the image container */}
      <div className="pt-6 px-1 flex-1 flex flex-col justify-between text-left">
        <div className="space-y-2">
          <span className="font-mono text-[9px] text-brand tracking-widest uppercase font-black block">
            {item.client}
          </span>
          <h3 className="font-display font-semibold text-base sm:text-lg text-white leading-snug group-hover:text-brand transition-colors">
            {item.title}
          </h3>
          <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-sans line-clamp-3">
            {item.challenge}
          </p>
        </div>

        <div className="pt-6 mt-4 border-t border-white/[0.03] flex items-center gap-1.5 text-xs text-brand font-mono uppercase tracking-widest font-extrabold group-hover:underline">
          <span>Ver Detalhes do Case</span>
          <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeServiceTab, setActiveServiceTab] = useState(0);
  const [selectedEditorialPlan, setSelectedEditorialPlan] = useState<"start" | "base" | "performance">("base");
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeReview, setActiveReview] = useState(0);
  const [isHoveringGmb, setIsHoveringGmb] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [activeDiagPhase, setActiveDiagPhase] = useState<"discovery" | "analysis" | "design">("discovery");
  const [hoveredPill, setHoveredPill] = useState<string | null>(null);
  const [youtubeVideos, setYoutubeVideos] = useState(YOUTUBE_VIDEOS);
  const [gmbReviews, setGmbReviews] = useState(GMB_REVIEWS);
  const [contentSources, setContentSources] = useState<OfficialContentApiResponse["sources"]>({
    youtube: "fallback",
    googleBusiness: "fallback"
  });

  const YOUTUBE_VIDEOS = youtubeVideos;
  const GMB_REVIEWS = gmbReviews;

  useEffect(() => {
    const controller = new AbortController();

    const loadOfficialContent = async () => {
      try {
        const response = await fetch("/api/official-content", {
          signal: controller.signal,
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as OfficialContentApiResponse;
        if (controller.signal.aborted) {
          return;
        }

        if (Array.isArray(data.youtubeVideos) && data.youtubeVideos.length > 0) {
          setYoutubeVideos(data.youtubeVideos);
        }

        if (Array.isArray(data.gmbReviews) && data.gmbReviews.length > 0) {
          setGmbReviews(data.gmbReviews);
        }

        if (data.sources) {
          setContentSources(data.sources);
        }
      } catch {
        // Keep the local fallback content if the sync endpoint is unavailable.
      }
    };

    void loadOfficialContent();

    return () => controller.abort();
  }, []);

  const handleOutboundClick = (label: string, url: string, surface: string) => {
    trackOutboundClick({
      label,
      url,
      surface
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isHoveringGmb) return;
    const interval = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % GMB_REVIEWS.length);
    }, 8500);
    return () => clearInterval(interval);
  }, [isHoveringGmb]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5 range
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5 range
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const tagCategories = [
    { name: "ESTRATÃ‰GIA", style: "filled-neon" },
    { name: "BRANDING", style: "outline" },
    { name: "TRÃFEGO PAGO", style: "outline" },
    { name: "DEV WEB", style: "filled-white" },
    { name: "COPYWRITING", style: "outline" },
    { name: "REDES SOCIAIS", style: "filled-white" },
    { name: "DESIGN PREMIUM", style: "outline" },
    { name: "PROCESSOS DE ELITE", style: "outline" },
    { name: "MARKETING 365", style: "filled-neon" },
  ];

  return (
    <div className="bg-charcoal-950 text-white overflow-hidden">
      {/* SECTION 1 - NEW ADVANCED HIGH-DESCRIPTIVE HERO */}
      <section id="hero" className="relative min-h-screen flex items-center pt-28 pb-16 px-4 sm:px-6 md:px-8">
        {/* Full neon floating frame container styled exactly like reference image */}
        <div className="w-full max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden flex flex-col justify-between min-h-[82vh] lg:min-h-[85vh] shadow-[0_30px_80px_rgba(var(--color-brand-rgb),0.22)] border border-white/10 select-none">
          
          {/* Subtle neon tech grid background effect inside the lime container */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.1)_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
          
          {/* Deep glowing background ambient circles for tech contrast */}
          <div className="absolute right-[10%] top-[10%] w-[320px] h-[320px] bg-black/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute left-[5%] bottom-[15%] w-[250px] h-[250px] bg-brand-secondary/20 rounded-full blur-[60px] pointer-events-none" />

          {/* MASSIVE TITANIC TYPOGRAPHY BACKPLANE LAYER - LAYERED BEHIND CYBORG BUT IN FRONT OF LIGHT CONTAINER (Z-10) */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none select-none z-10 overflow-hidden mix-blend-overlay">
            <span className="font-display font-black text-[15vw] leading-none text-white tracking-tighter uppercase whitespace-nowrap block select-none">
              TAG08 AGENCY
            </span>
          </div>

          {/* CORE GRAPHICAL CONTENT & CONTROLS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center relative z-20 w-full my-auto">
            
            {/* LEFT COLUMN: DESCRIPTION, STRATEGY ACTION & SOUNDBAR WIDGET */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left order-2 lg:order-1">
              
              {/* Upper statement badge */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 border border-black/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                  <span className="font-mono text-[9px] tracking-widest uppercase font-bold text-black/70">
                    AceleraÃ§Ã£o de NegÃ³cios e PresenÃ§a
                  </span>
                </div>
                
                <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-black leading-[1.0] tracking-tighter uppercase">
                  AgÃªncia de marketing estratÃ©gico para marcas que querem crescer com direÃ§Ã£o.
                </h1>
                
                <p className="text-black/75 text-xs sm:text-sm max-w-sm leading-relaxed font-sans font-medium">
                  ConstruÃ­mos estrutura corporativa, identidade requintada e inteligÃªncia de trÃ¡fego de ponta a ponta. Deixe o improviso de lado.
                </p>
              </div>

              {/* Lower audio signal interactable widget exactly like reference image */}
              <div 
                onClick={() => handleLinkClick("/contato")}
                className="bg-black/5 hover:bg-black/10 transition-all duration-300 border border-black/10 p-5 rounded-2xl flex flex-col gap-4 max-w-sm cursor-pointer shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
                    </span>
                    <span className="font-mono text-[9px] text-black font-bold uppercase tracking-wider">
                      MÃ‰TODO DIAGNÃ“STICO ATIVO
                    </span>
                  </div>
                  
                  {/* Dynamic waveform visual bars inside widget */}
                  <div className="flex items-end gap-0.5 h-5">
                    {[12, 24, 16, 28, 20, 26, 14, 18, 24, 10, 16, 20].map((height, i) => (
                      <span 
                        key={i} 
                        className="w-0.5 bg-black rounded-full transition-all duration-500 origin-bottom" 
                        style={{ height: `${height}px` }} 
                      />
                    ))}
                  </div>
                </div>

                <div className="w-full bg-black/10 rounded-xl py-3 px-4 flex items-center justify-between group-hover:bg-black group-hover:text-brand transition-all duration-300">
                  <span className="font-mono text-[10px] font-extrabold tracking-wider uppercase">
                    COMEÃ‡AR DIAGNÃ“STICO AGORA â€” Ã‰ GRÃTIS
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* MIDDLE COLUMN: GLOSSY OBSIDIAN CYBER MANNEQUIN ASSET (Z-30 FOR BEAUTIFUL OVERLAY OVER THE TEXT + ACTIVE PARALLAX DEPTH & TILT) */}
            <div className="lg:col-span-4 flex justify-center items-center z-35 relative order-1 lg:order-2 px-4">
              <div 
                className="relative w-full max-w-[340px] aspect-square flex items-center justify-center"
                style={{ perspective: 1000 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Subtle Interactive 3D Canvas rendering a rotating icosahedron and floating particles */}
                <Subtle3DCanvas intensity={1.5} className="absolute inset-0 z-20 scale-125" />

                {/* Dynamic backlight that responds as the pointer tilts the perspective */}
                <div 
                  className="absolute inset-0 bg-black/20 blur-3xl rounded-full scale-110 pointer-events-none transition-transform duration-300"
                  style={{
                    transform: `translate(${mousePos.x * 35}px, ${mousePos.y * 35}px) scale(${1 + scrollY * 0.0002})`,
                  }}
                />
                
                <motion.div
                  style={{
                    y: scrollY * 0.28,
                    rotate: scrollY * 0.03,
                    rotateX: mousePos.y * -25,
                    rotateY: mousePos.x * 25,
                    opacity: Math.max(1 - scrollY / 600, 0.15),
                    scale: 1 + Math.sin(scrollY * 0.003) * 0.03,
                  }}
                  transition={{ type: "spring", stiffness: 150, damping: 25 }}
                  className="relative z-30 flex items-center justify-center pointer-events-none select-none"
                >
                  <img 
                    src={heroCyberMannequin} 
                    alt="TAG08 Cyborg Assistant" 
                    className="h-[360px] sm:h-[450px] lg:h-[480px] w-auto object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.65)]"
                  />

                  {/* Elegant floating neon wireframe telemetry indicator to accentuate high-end design */}
                  <div className="absolute inset-x-0 -bottom-8 flex justify-between px-4 font-mono text-[8px] text-black/45 tracking-widest uppercase">
                    <span>Z-POS: +{Math.round(scrollY * 0.28)}PX</span>
                    <span>TILT: {Math.round(mousePos.y * -25)}Â°</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* RIGHT COLUMN: BRAND SOCIAL AUDIENCE AND BUSINESS AREA CATEGORY CAPSULES (ROCK PILLS LOOKALIKES) */}
            <div className="lg:col-span-3 flex flex-col justify-between space-y-8 text-left lg:text-right order-3 z-20">
              
              {/* Trust profiles banner floating */}
              <div className="space-y-2 flex flex-col lg:items-end">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img className="w-7 h-7 rounded-full border-2 border-brand object-cover shadow-sm" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" />
                    <img className="w-7 h-7 rounded-full border-2 border-brand object-cover shadow-sm" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" />
                    <img className="w-7 h-7 rounded-full border-2 border-brand object-cover shadow-sm" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" />
                  </div>
                  <span className="font-sans font-extrabold text-sm text-black leading-tight">
                    +150 Clientes
                  </span>
                </div>
                
                <p className="text-black/60 font-mono text-[9px] uppercase tracking-wide font-bold">
                  DEDICAÃ‡ÃƒO MÃXIMA & EXCELÃŠNCIA SÃŠNIOR
                </p>
              </div>

              {/* Categorical tag widgets styled exactly like punk-rock and disco buttons in reference panel */}
              <div className="space-y-3">
                <div className="font-mono text-[9px] text-black/60 uppercase tracking-widest font-extrabold block lg:text-right">
                  NOSSAS DISCIPLINAS OPERACIONAIS:
                </div>
                
                <div className="flex flex-wrap lg:justify-end gap-1.5 max-w-sm lg:ml-auto">
                  {tagCategories.map((tag) => {
                    let pillClasses = "";
                    if (tag.style === "filled-neon") {
                      pillClasses = "bg-black text-brand font-extrabold border border-black text-[9px] tracking-wider px-3 py-1.5 rounded-full shadow-sm hover:scale-105 transition-transform duration-200";
                    } else if (tag.style === "filled-white") {
                      pillClasses = "bg-charcoal-900 text-white font-semibold border border-charcoal-800 text-[9px] tracking-wider px-3 py-1.5 rounded-full shadow-sm hover:scale-105 transition-transform duration-200";
                    } else {
                      pillClasses = "border border-black/30 bg-transparent text-black font-bold text-[9px] tracking-wider px-3 py-1.5 rounded-full hover:bg-black/5 hover:border-black transition-all duration-200";
                    }

                    return (
                      <button
                        key={tag.name}
                        onClick={() => scrollToSection("servicos-principais")}
                        className={`cursor-pointer select-none font-sans ${pillClasses}`}
                      >
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2 - PROBLEMA */}
      <section id="problema" className="py-24 px-6 border-b border-white/[0.04] bg-charcoal-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto space-y-4 mb-16"
          >
            <span className="font-mono text-xs text-brand uppercase tracking-widest font-semibold">
              O DiagnÃ³stico da Realidade
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-gradient">
              PresenÃ§a sem propÃ³sito Ã© sÃ³ barulho.
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Muitas marcas estÃ£o produzindo conteÃºdo, criando campanhas e tentando aparecer no digital sem uma direÃ§Ã£o clara. O resultado Ã© esforÃ§o disperso, comunicaÃ§Ã£o inconsistente e pouca percepÃ§Ã£o de valor.
            </p>
          </motion.div>


          {/* DIAGNOSTIC DIAGRAM - THE MAIN INTERACTIVE CENTERPIECE INSPIRED BY MULTIPURPOSE INFOGRAPHIC SLIDES */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <Suspense
              fallback={
                <div className="min-h-[420px] rounded-[28px] border border-white/[0.05] bg-white/[0.02] flex items-center justify-center px-6">
                  <div className="space-y-3 text-center max-w-md">
                    <div className="h-3 w-24 rounded-full bg-white/10 mx-auto animate-pulse" />
                    <div className="h-10 w-64 max-w-full rounded-2xl bg-white/10 mx-auto animate-pulse" />
                    <div className="h-4 w-80 max-w-full rounded-full bg-white/5 mx-auto animate-pulse" />
                    <div className="h-4 w-72 max-w-full rounded-full bg-white/5 mx-auto animate-pulse" />
                  </div>
                </div>
              }
            >
              <DiagnosticDiagram />
            </Suspense>
          </motion.div>

          {/* CTA INTERMEDIÃRIO APÃ“S O DIAGNÃ“STICO */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-12 p-8 rounded-3xl bg-neutral-900/60 border border-white/[0.05] relative overflow-hidden text-left"
          >
            {/* Design accents */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-brand/[0.02] rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-brand font-black bg-brand/5 border border-brand/10 px-2 py-0.5 rounded">
                    SESSÃƒO DIAGNÃ“STICA EXCLUSIVA
                  </span>
                </div>
                <h3 className="font-display font-medium text-xl sm:text-2xl text-white leading-tight uppercase">
                  Quer entender onde sua marca estÃ¡ travando de verdade?
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                  Realizamos uma anÃ¡lise profunda e confidencial do seu ecossistema digital e dos fluxos do seu negÃ³cio para decodificar gargalos reais antes de falar em soluÃ§Ãµes.
                </p>
              </div>

              <button
                onClick={() => {
                  onNavigate("/contato");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group relative px-7 py-4 bg-brand text-black text-xs font-mono font-semibold uppercase tracking-widest rounded-xl transition-all duration-300 shrink-0 overflow-hidden shadow-[0_8px_30px_rgba(var(--color-brand-secondary-rgb),0.15)] hover:shadow-[0_8px_35px_rgba(var(--color-brand-secondary-rgb),0.3)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full skew-x-12 group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                <span className="relative z-10 flex items-center gap-2">
                  Solicitar AnÃ¡lise Gratuita <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </motion.div>

          {/* NOVO BLOCO: BENTO GRID DE DIRECIONAMENTO E MATURIDADE */}
          <div className="mt-32 space-y-12 text-left animate-fade-in">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/10 bg-brand/5 font-mono text-[10px] uppercase tracking-widest text-brand-secondary font-black">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" /> DIRECIONAMENTO // MATURIDADE
              </div>
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-gradient uppercase tracking-tight leading-none">
                Em qual momento a sua marca se encontra hoje?
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl">
                Nossos mÃ©todos sÃ£o aplicados de acordo com o tamanho, faturamento e desafios estratÃ©gicos da sua empresa. Sem diagnÃ³sticos genÃ©ricos, identifique seu momento operacional imediato e conecte-se ao protocolo certo:
              </p>
            </div>

            {/* Main Bento Structure matching the uploaded wireframe mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch pt-2">
              
              {/* LEFT COLUMN/PANE OF BENTO */}
              <div className="flex flex-col gap-6">
                
                {/* Visual Card M-02: BRANDING ATIVO - Large landscape image (Top Left) */}
                <div 
                  onClick={() => {
                    onNavigate("/servicos/branding-identidade");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="relative group overflow-hidden rounded-3xl border border-white/[0.05] hover:border-brand-secondary/30 h-[260px] bg-charcoal-900 cursor-pointer transition-all duration-300"
                >
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                    alt="TAG08 Alinhamento de Posicionamento"
                    className="w-full h-full object-cover grayscale opacity-35 group-hover:grayscale-0 group-hover:scale-102 group-hover:opacity-50 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-6 text-left">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-[8px] font-black tracking-widest text-brand uppercase bg-brand/5 border border-brand/10 px-2.5 py-0.5 rounded">
                        M-02 // BRANDING ATIVO
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-brand transition-colors" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight mt-1.5 group-hover:text-brand transition-colors">
                      Preciso alinhar meu posicionamento
                    </h3>
                    <p className="text-zinc-400 text-[11px] font-sans max-w-md mt-1 leading-relaxed">
                      Meus canais estÃ£o desalinhados, amadores ou sem uma linha editorial corporativa que demonstre nossa real grandeza.
                    </p>
                  </div>
                </div>

                {/* Split Row below Card 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Left sub-column: Card M-01 & Card M-03 */}
                  <div className="flex flex-col gap-6">
                    
                    {/* Card M-01: PRESENÃ‡A DIGITAL */}
                    <div 
                      onClick={() => {
                        onNavigate("/servicos/gestao-de-redes-sociais");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="bg-charcoal-900 border border-white/[0.04] hover:border-brand-secondary/20 p-5 rounded-3xl flex flex-col justify-between h-[158px] relative overflow-hidden text-left group cursor-pointer transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center justify-between w-full">
                          <span className="font-mono text-[8px] text-brand uppercase tracking-widest bg-brand/5 border border-brand/10 px-2.5 py-0.5 rounded font-black">
                            M-01 // PRESENÃ‡A DIGITAL
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-brand transition-colors" />
                        </div>
                        <h4 className="text-white font-display font-semibold text-xs sm:text-sm uppercase leading-tight group-hover:text-brand transition-colors mt-2">
                          Estou comeÃ§ando no digital
                        </h4>
                        <p className="text-zinc-400 text-[10px] font-sans leading-normal mt-1.5">
                          Preciso estruturar uma presenÃ§a consistente e autoral preliminar para me posicionar como uma referÃªncia sÃ©ria.
                        </p>
                      </div>
                      
                      {/* Social Grid placeholder items with premium visual micro interactions */}
                      <div className="flex gap-2 mt-2 pt-2 border-t border-white/[0.03]">
                        <span className="w-6 h-6 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-[7.5px] text-brand-secondary font-sans group-hover:bg-brand-secondary/10 transition-colors">in</span>
                        <span className="w-6 h-6 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-[7.5px] text-brand-secondary font-sans group-hover:bg-brand-secondary/10 transition-colors">ig</span>
                        <span className="w-6 h-6 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-[7.5px] text-brand-secondary font-sans group-hover:bg-brand-secondary/10 transition-colors">wa</span>
                      </div>
                    </div>

                    {/* Card M-03: EVOLUÃ‡ÃƒO DE MARCA */}
                    <div 
                      onClick={() => {
                        onNavigate("/servicos/branding-identidade");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="bg-charcoal-900 border border-white/[0.04] hover:border-brand-secondary/25 p-5 rounded-3xl flex flex-col justify-between h-[158px] relative overflow-hidden text-left cursor-pointer group transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[8.5px] text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/15 px-2 py-0.5 rounded tracking-widest font-bold">M-03</span>
                        <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-semibold">EVOLUÃ‡ÃƒO DE MARCA</span>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-display font-semibold text-xs sm:text-sm uppercase leading-tight group-hover:text-brand transition-colors">
                          Busco Rebranding Profundo
                        </h4>
                        <p className="text-zinc-400 text-[10px] font-sans leading-relaxed mt-1.5">
                          Queremos uma evoluÃ§Ã£o sofisticada da marca que reflita a sobriedade e refinamento do nosso faturamento offline.
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Card M-04: SITES DE ALTO VALOR (Tall Lime Green Card aligned to companion height) */}
                  <div 
                    onClick={() => {
                      onNavigate("/servicos/desenvolvimento-web");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="bg-brand-secondary text-black p-8 rounded-3xl flex flex-col justify-between h-[340px] text-left relative overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-lg hover:shadow-brand/5"
                  >
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
                    
                    <div>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-[9px] font-black uppercase tracking-widest bg-black/10 border border-black/10 px-3 py-1 rounded-full block w-fit">
                          M-04 // DEV WEB PREMIUM
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-black/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                      <h3 className="font-display font-black text-5xl tracking-tighter mt-6 leading-none">M-04</h3>
                    </div>

                    <div className="space-y-2 relative z-10">
                      <h4 className="font-display font-extrabold text-[#111] text-sm uppercase tracking-tight">Desejo converter mais com meu site</h4>
                      <p className="text-[#333] text-[11px] font-sans leading-relaxed">
                        Nossos anÃºncios gastam verba ativa, mas as pÃ¡ginas lentas ou confusas falham em colher leads qualificados diariamente.
                      </p>
                    </div>
                  </div>

                </div>

              </div>

              {/* RIGHT COLUMN/PANE OF BENTO */}
              <div className="flex flex-col gap-6">
                
                {/* Split Row Top: Card M-05 & Card M-06 / DiagnÃ³stico */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Card M-05: INTELIGÃŠNCIA OPERACIONAL (Tall Dark Card) */}
                  <div 
                    onClick={() => {
                      onNavigate("/servicos/process-intelligence");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="bg-zinc-950 border border-white/[0.08] hover:border-brand/35 p-8 rounded-3xl flex flex-col justify-between h-[340px] text-left relative overflow-hidden group cursor-pointer transition-all duration-300"
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-[9px] font-black uppercase tracking-widest text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-3 py-1 rounded-full block w-fit">
                          M-05 // INTELIGÃŠNCIA OPERACIONAL
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-brand transition-colors" />
                      </div>
                      <h3 className="font-display font-black text-5xl text-white tracking-tighter mt-6 leading-none">M-05</h3>
                    </div>

                    <div className="space-y-2 relative z-10">
                      <h4 className="font-display font-extrabold text-white text-sm uppercase tracking-tight group-hover:text-brand transition-colors">Sinto um teto de escala interna</h4>
                      <p className="text-zinc-400 text-[11px] font-sans leading-relaxed">
                        A empresa faturou mais, mas a lideranÃ§a vive presa apagando incÃªndio e as rotinas estÃ£o na cabeÃ§a das pessoas.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-column of Split: Card M-06 & Diagnostics */}
                  <div className="flex flex-col gap-6">
                    
                    {/* Card M-06: GOVERNANÃ‡A & AUDITORIA */}
                    <div 
                      onClick={() => {
                        onNavigate("/servicos/process-activation");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="bg-zinc-100 text-charcoal-950 p-6 rounded-3xl flex flex-col justify-between h-[158px] text-left relative group overflow-hidden cursor-pointer hover:bg-zinc-200 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-semibold">M-06</span>
                        <span className="font-mono text-[8.5px] text-zinc-500 tracking-widest font-black">GOVERNANÃ‡A &amp; AUDITORIA</span>
                      </div>
                      
                      <div>
                        <h4 className="font-display font-extrabold text-xs uppercase tracking-tight leading-none text-black group-hover:text-brand transition-colors">Temos processos, mas ninguÃ©m cumpre</h4>
                        <p className="text-zinc-600 text-[9.5px] font-sans leading-normal mt-1.5">
                          Nossos playbooks e wikis viraram links esquecidos e os operadores continuam executando em desordem.
                        </p>
                      </div>
                    </div>

                    {/* Quick Call to Action Card */}
                    <div 
                      onClick={() => {
                        const target = document.getElementById("diagnostico");
                        if (target) {
                          target.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="bg-zinc-100 text-charcoal-950 p-6 rounded-3xl flex flex-col justify-between h-[158px] text-left relative group overflow-hidden cursor-pointer hover:bg-zinc-200 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display font-black text-2xl text-zinc-700 leading-none">FREE</span>
                        <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-semibold">DiagnÃ³stico Imediato</span>
                      </div>
                      
                      <div>
                        <h4 className="font-display font-extrabold text-xs uppercase tracking-tight leading-none text-black">Acessar Nosso FormulÃ¡rio</h4>
                        <p className="text-zinc-600 text-[9.5px] font-sans leading-relaxed mt-1.5">
                          Fale com o nosso estrategista sÃªnior para descobrir o nÃ­vel exato de escala do seu ecossistema.
                        </p>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Visual Card 8: Workspace (Bottom Right) */}
                <div 
                  onClick={() => {
                    const target = document.getElementById("diagnostico");
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="relative group overflow-hidden rounded-3xl border border-white/[0.05] hover:border-brand-secondary/20 h-[260px] bg-charcoal-900 cursor-pointer transition-all duration-300"
                >
                  <img
                    src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800"
                    alt="TAG08 Workspace de NegÃ³cios"
                    className="w-full h-full object-cover grayscale opacity-35 group-hover:grayscale-0 group-hover:scale-102 group-hover:opacity-50 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-6 text-left">
                    <span className="font-mono text-[8px] tracking-widest text-brand-secondary uppercase font-black">
                      ESTADO DA ARTE // DESIGN SYSTEM
                    </span>
                    <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight mt-1 group-hover:text-brand transition-colors">
                      Infraestrutura Excepcional
                    </h3>
                    <p className="text-zinc-400 text-[11px] font-sans max-w-md mt-1 leading-relaxed">
                      Estruturas limpas com carregamentos imediatos. A postura ideal para apresentar sua marca ao mercado.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* INDEPENDENT SECTION 2.1: DIAGNÃ“STICO // SINAL CORRUPTO */}
      <section id="diagnostico" className="py-28 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        {/* Subtle grid decor */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
        <div className="absolute top-1/4 left-0 w-[450px] h-[450px] bg-brand-secondary/[0.01] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/[0.01] rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-16">
          
          {/* Section Introduction */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="font-mono text-[9px] tracking-widest text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/15 px-3 py-1 rounded-full uppercase font-bold inline-block">
              DIAGNÃ“STICO // SINAL CORRUPTO
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-white uppercase tracking-tight leading-none">
              Sinais de refluxo e arrasto operacional
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans max-w-2xl mx-auto leading-relaxed">
              Identifique gargalos estruturais ocultos que provocam diluiÃ§Ã£o de marca e escape silencioso de orÃ§amento. 
              <strong> Passe o mouse ou clique nas Fases do Fluxo ou nas PÃ­lulas TÃ¡ticas</strong> abaixo para radiografar os sintomas comerciais e visualizar o diagnÃ³stico em tempo real no painel de auditoria.
            </p>
          </div>

          {/* DIAGRAMA EXPLICATIVO SUPERIOR - FLUXOGRAMA DE PROCESSO INTERATIVO */}
          <div className="relative">
            {/* Visual connector lines for desktop */}
            <div className="hidden md:block absolute top-[55px] left-[15%] right-[15%] h-[1px] border-t border-dashed border-white/[0.08] pointer-events-none z-0" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
              {[
                { 
                  id: "discovery", 
                  step: "01",
                  title: "Discovery", 
                  badge: "AproximaÃ§Ã£o",
                  desc: "Alinhamento & Posicionamento",
                  pills: [
                    { id: "idea", label: "Idea // Posicionamento" },
                    { id: "brand_friction", label: "AnÃ¡lise do NegÃ³cio" }
                  ]
                },
                { 
                  id: "analysis", 
                  step: "02",
                  title: "Analysis", 
                  badge: "Triagem",
                  desc: "Fugas & ConversÃ£o Digital",
                  pills: [
                    { id: "bottlenecks", label: "Isolamento de Gargalos" }
                  ]
                },
                { 
                  id: "design", 
                  step: "03",
                  title: "Delivery", 
                  badge: "Blindagem",
                  desc: "Processos & Entrega SÃªnior",
                  pills: [
                    { id: "solutions", label: "Desenho de SoluÃ§Ãµes" },
                    { id: "scale", label: "OperaÃ§Ã£o & Escala" }
                  ]
                }
              ].map((phase, pIdx) => {
                const isPhaseSelected = activeDiagPhase === phase.id;
                
                return (
                  <div
                    key={phase.id}
                    onMouseEnter={() => {
                      setActiveDiagPhase(phase.id as any);
                      setHoveredPill(null);
                    }}
                    onClick={() => {
                      setActiveDiagPhase(phase.id as any);
                      setHoveredPill(null);
                    }}
                    className={`p-6 rounded-[24px] border transition-all duration-300 bg-zinc-950/40 relative group text-left cursor-pointer flex flex-col justify-between ${
                      isPhaseSelected
                        ? "border-brand-secondary bg-brand-secondary/[0.02] shadow-[0_8px_32px_rgba(var(--color-brand-secondary-rgb),0.04)]"
                        : "border-white/[0.03] hover:border-white/10"
                    }`}
                  >
                    <div>
                      {/* Interactive indicator and step */}
                      <div className="flex items-center justify-between pb-4 border-b border-white/[0.03]">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full transition-transform duration-300 ${isPhaseSelected ? "bg-brand-secondary scale-125 shadow-[0_0_8px_var(--color-brand-secondary)]" : "bg-zinc-700"}`} />
                          <span className={`text-[9px] font-mono font-black uppercase tracking-widest ${isPhaseSelected ? "text-brand-secondary" : "text-zinc-500"}`}>
                            {phase.badge}
                          </span>
                        </div>
                        <span className="font-sans text-zinc-600 text-xs font-bold">FASE {phase.step}</span>
                      </div>

                      {/* Phase Info */}
                      <div className="mt-4">
                        <h4 className="font-display font-bold text-base text-white uppercase tracking-tight">
                          {phase.title}
                        </h4>
                        <p className="text-zinc-500 text-[11px] font-sans mt-1">
                          {phase.desc}
                        </p>
                      </div>
                    </div>

                    {/* Tactics Pills inside the column */}
                    <div className="mt-6 space-y-2 relative z-20">
                      <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest block font-bold">
                        PÃLULAS DE ATUAÃ‡ÃƒO:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {phase.pills.map((p) => {
                          const isPillActive = hoveredPill === p.id;
                          
                          return (
                            <button
                              key={p.id}
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setActiveDiagPhase(phase.id as any);
                                setHoveredPill(p.id);
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDiagPhase(phase.id as any);
                                setHoveredPill(p.id);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all border text-left cursor-pointer ${
                                isPillActive
                                  ? "bg-brand-secondary border-brand-secondary text-black font-bold shadow-[0_2px_8px_rgba(var(--color-brand-secondary-rgb),0.15)]"
                                  : isPhaseSelected && hoveredPill === null
                                    ? "bg-zinc-900/80 border-brand-secondary/20 text-zinc-300 hover:border-brand-secondary/60"
                                    : "bg-zinc-950/80 border-white/[0.04] text-zinc-500 hover:text-white hover:border-white/10"
                              }`}
                            >
                              {p.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Process connector visual flow indicators */}
                    {pIdx < 2 && (
                      <div className="hidden md:flex absolute top-1/2 -right-4 w-8 h-8 rounded-full border border-white/5 bg-charcoal-950 items-center justify-center -translate-y-1/2 z-30 shadow-md">
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* PAINEL DE AUDIO / DETALHES DE AUDITORIA DE SINTOMAS ABAIXO */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              {(() => {
                // Find currently active diagnostic symptom info to show
                const currentPhaseInfo = DIAGNOSTIQUER_PHASES[activeDiagPhase];
                const activeSymptomId = hoveredPill || currentPhaseInfo.symptoms[0].id;
                const activeSymptomObj = currentPhaseInfo.symptoms.find(s => s.id === activeSymptomId) || currentPhaseInfo.symptoms[0];

                return (
                  <motion.div
                    key={`${activeDiagPhase}-${activeSymptomId}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#121214]/75 border border-white/[0.04] p-6 sm:p-8 lg:p-10 rounded-[32px] relative overflow-hidden backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.4)] text-left"
                  >
                    {/* Console decoration grids */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-secondary/15 to-transparent" />

                    {/* ESQUERDA: RESUMO DA FASE & METRICAS DE RISCO (col-span-4) */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col justify-between space-y-6 relative z-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
                          <span className="font-mono text-[8.5px] text-brand-secondary font-bold tracking-widest uppercase pb-0.5">
                            FASE PRINCIPAL // MONITOR DE ALARME
                          </span>
                        </div>
                        
                        <h4 className="font-display font-medium text-xl text-white uppercase tracking-tight">
                          {currentPhaseInfo.title.split(" // ")[0]}
                        </h4>
                        
                        <p className="text-zinc-500 font-sans text-[11px] leading-relaxed">
                          {currentPhaseInfo.desc}
                        </p>
                      </div>

                      {/* Severity Metrics indicator */}
                      <div className="space-y-3 pt-6 border-t border-white/[0.03] mt-2">
                        <div className="flex justify-between items-center text-[10px] font-sans">
                          <span className="text-zinc-500 uppercase tracking-widest">ARRASTO OPERACIONAL RATING</span>
                          <span className="text-brand-secondary font-semibold">{currentPhaseInfo.rating}</span>
                        </div>
                        
                        <div className="w-full bg-zinc-950/80 h-2.5 rounded-full p-[1.5px] border border-white/[0.02] overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: currentPhaseInfo.ratingWidth }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="bg-gradient-to-r from-red-600 via-orange-500 to-brand-secondary h-full rounded-full shadow-[0_0_8px_rgba(var(--color-brand-secondary-rgb),0.3)]"
                          />
                        </div>
                        <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-tight">
                          O arrasto compromete a conversÃ£o silenciosa de orÃ§amentos digitais.
                        </p>
                      </div>
                    </div>

                    {/* DIREITA: CARDS DE SINTOMAS INDIVIDUAIS EM UM SEGUNDO GRID (col-span-8) */}
                    <div className="col-span-12 lg:col-span-8 border-t lg:border-t-0 lg:border-l border-white/[0.04] pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between space-y-6 relative z-10 text-left">
                      
                      <div className="space-y-4">
                        <span className="font-mono text-[8.5px] text-zinc-500 font-bold tracking-widest uppercase block border-b border-white/[0.03] pb-2">
                          DIAGNÃ“STICO DETALHADO DOS SINTOMAS TÃTICOS ATIVOS
                        </span>

                        {/* Responsive grid of cards for each symptom in this phase */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {currentPhaseInfo.symptoms.map((symptom) => {
                            const isThisSymptomActive = activeSymptomId === symptom.id;
                            
                            return (
                              <div
                                key={symptom.id}
                                onMouseEnter={() => setHoveredPill(symptom.id)}
                                onClick={() => setHoveredPill(symptom.id)}
                                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden ${
                                  isThisSymptomActive
                                    ? "bg-zinc-900/90 border-brand-secondary/40 shadow-[0_4px_24px_rgba(var(--color-brand-secondary-rgb),0.06)]"
                                    : "bg-zinc-950/50 border-white/[0.02] hover:border-white/10"
                                }`}
                              >
                                {isThisSymptomActive && (
                                  <div className="absolute top-0 left-0 w-[3px] h-full bg-brand-secondary" />
                                )}

                                <div className="space-y-2">
                                  {/* Symptom title & Status header */}
                                  <div className="flex items-center justify-between gap-2">
                                    <span className={`font-mono text-[9px] font-bold uppercase ${isThisSymptomActive ? "text-brand-secondary" : "text-zinc-500"}`}>
                                      GARGALOS // {symptom.label}
                                    </span>
                                    <div className={`w-2 h-2 rounded-full ${isThisSymptomActive ? "bg-brand-secondary shadow-[0_0_8px_var(--color-brand-secondary)] animate-pulse" : "bg-red-500/40"}`} />
                                  </div>

                                  <p className="text-zinc-200 text-xs font-semibold leading-relaxed font-sans">
                                    {symptom.desc}
                                  </p>
                                </div>

                                {/* Consequences quote */}
                                <div className="pt-3 border-t border-white/[0.02] space-y-1.5">
                                  <span className="font-sans text-[7.5px] text-zinc-500 uppercase tracking-widest block">GRAVIDADE / CONSEQUÃŠNCIA OPERACIONAL</span>
                                  <p className={`text-[10px] font-sans leading-relaxed italic border-l-2 pl-2.5 py-0.5 rounded ${
                                    isThisSymptomActive 
                                      ? "bg-red-950/10 border-red-500/35 text-red-300" 
                                      : "bg-zinc-900/10 border-zinc-700/30 text-zinc-400"
                                  }`}>
                                    &ldquo;{symptom.symptom}&rdquo;
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer containing quick link and status indicator */}
                      <div className="pt-6 border-t border-white/[0.03] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
                          <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest">
                            PAINEL INTERATIVO TAG08
                          </span>
                        </div>
                        
                        <button
                          onClick={() => {
                            const target = document.getElementById("contato");
                            if (target) {
                              target.scrollIntoView({ behavior: "smooth" });
                            } else {
                              onNavigate("/contato");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                          }}
                          className="text-xs text-brand-secondary hover:text-white font-sans font-bold flex items-center gap-1.5 group transition-colors cursor-pointer self-end"
                        >
                          Solicitar Auditoria Gratuita <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform animate-pulse" />
                        </button>
                      </div>

                    </div>

                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* INDEPENDENT SECTION 2.2: SUTILEZA OPERACIONAL // DIREÃ‡ÃƒO SÃŠNIOR */}
      <section id="metodologia" className="py-28 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-zinc-950 relative overflow-hidden">
        {/* Glow corner decors */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-brand-secondary/[0.01] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-white/[0.01] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header */}
          <div className="max-w-3xl text-left space-y-4">
            <span className="font-mono text-xs text-brand uppercase tracking-widest font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
              SUTILEZA OPERACIONAL // PROTOCOLOS SÃŠNIOR
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-white uppercase tracking-tight leading-tight">
              Nossa Metodologia Consultiva de RecomendaÃ§Ã£o
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans max-w-2xl leading-relaxed">
              A TAG08 nÃ£o comercializa pacotes engessados de serviÃ§os. NÃ³s somos assessores dedicados de marcas sÃ©rias e operamos seguindo um fluxo circular tÃ¡tico e blindado de decisÃµes corporativas:
            </p>
          </div>

          {/* Premium Curved Bento Flow precisely replicating Reference 1 Layout! */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative items-stretch">
            
            {/* Step 01: Entrevistas de DiagnÃ³stico */}
            <motion.div 
              whileHover={{ y: -3, scale: 1.01 }}
              className="bg-[#121214] border border-white/[0.05] p-8 sm:p-10 rounded-[28px] min-h-[220px] flex flex-col justify-between text-left group transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-black bg-white/[0.03] border border-white/10 px-2 py-0.5 rounded">PROTOCOLO 01</span>
                <span className="font-mono text-brand-secondary text-[10px] uppercase font-black tracking-widest">AproximaÃ§Ã£o</span>
              </div>
              
              <div className="space-y-2 mt-8">
                <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-tight">
                  Entrevistas de DiagnÃ³stico
                </h3>
                <p className="text-zinc-400 text-[11.5px] leading-relaxed font-sans font-medium">
                  Coletamos dados corporativos reais de faturamento atual, metas executivas gerais e robustez estrutural fÃ­sica antes de propor qualquer escopo de trabalho.
                </p>
              </div>

              <div className="pt-6 border-t border-white/[0.04] mt-8 flex items-center justify-between w-full text-zinc-500 font-mono text-[9px] uppercase tracking-wider">
                <span>01 // INÃCIO</span>
                <ArrowRight className="w-4 h-4 text-brand-secondary" />
              </div>
            </motion.div>

            {/* Step 02: AnÃ¡lise de Gargalos ClÃ­nicos */}
            <motion.div 
              whileHover={{ y: -3, scale: 1.01 }}
              className="bg-[#121214] border border-white/[0.05] p-8 sm:p-10 rounded-[28px] min-h-[220px] flex flex-col justify-between text-left group transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-black bg-white/[0.03] border border-white/10 px-2 py-0.5 rounded">PROTOCOLO 02</span>
                <span className="font-mono text-brand-secondary text-[10px] uppercase font-black tracking-widest">Exame ClÃ­nico</span>
              </div>
              
              <div className="space-y-2 mt-8">
                <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-tight">
                  AnÃ¡lise de Gargalos ClÃ­nicos
                </h3>
                <p className="text-zinc-400 text-[11.5px] leading-relaxed font-sans font-medium">
                  Mapeamos exatamente qual barreira de entrada impede sua marca de acelerar (seja identidade defasada, anÃºncios frios ou vazamentos de funil).
                </p>
              </div>

              <div className="pt-6 border-t border-white/[0.04] mt-8 flex items-center justify-between w-full text-zinc-500 font-mono text-[9px] uppercase tracking-wider">
                <span>02 // ANÃLISE ATIVA</span>
                <ArrowRight className="w-4 h-4 text-brand-secondary" />
              </div>
            </motion.div>

            {/* Step 03: PriorizaÃ§Ã£o do Essencial (With top-right curved border mimicking Reference 1 card!) */}
            <motion.div 
              whileHover={{ y: -3, scale: 1.01 }}
              className="bg-[#121214] border border-white/[0.05] p-8 sm:p-10 rounded-[28px] rounded-tr-[90px] min-h-[220px] flex flex-col justify-between text-left group transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-black bg-white/[0.03] border border-white/10 px-2 py-0.5 rounded">PROTOCOLO 03</span>
                <span className="font-mono text-brand-secondary text-[10px] uppercase font-black tracking-widest">Triagem</span>
              </div>
              
              <div className="space-y-2 mt-8 max-w-[85%]">
                <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-tight">
                  PriorizaÃ§Ã£o do Essencial
                </h3>
                <p className="text-zinc-400 text-[11.5px] leading-relaxed font-sans font-medium">
                  Se os seus bastidores operacionais estÃ£o confusos, priorizamos organizar a fundaÃ§Ã£o e processos de vendas antes de inflacionar seu orÃ§amento de anÃºncios de escala.
                </p>
              </div>

              <div className="pt-6 border-t border-white/[0.04] mt-8 flex items-center justify-between w-full text-zinc-500 font-mono text-[9px] uppercase tracking-wider">
                <span>03 // TRIAGEM SELETIVA</span>
                <ArrowDown className="w-4 h-4 text-brand-secondary" />
              </div>
            </motion.div>

            {/* Row 2 on desktop displays Step 4 (right block curving left to Step 5) */}
            
            {/* Step 05: Definitive Destination Banner (Occupies 2 columns on desktop) */}
            <motion.div 
              whileHover={{ y: -3, scale: 1.01 }}
              className="bg-brand-secondary text-black p-8 sm:p-10 rounded-[28px] rounded-r-[90px] md:col-span-1 lg:col-span-2 min-h-[240px] flex flex-col justify-between text-left group transition-all duration-500 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-transparent pointer-events-none" />
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-[9px] text-black/60 uppercase tracking-widest font-black bg-black/5 border border-black/10 px-2.5 py-0.5 rounded">DESTINO FINAL 05</span>
                <span className="font-mono font-black text-black text-xs uppercase bg-black/5 border border-black/10 px-3 py-1 rounded-full">Sua Marca Blindada</span>
              </div>
              
              <div className="space-y-2 mt-8 max-w-[90%]">
                <h3 className="font-display font-black text-xl sm:text-2xl text-black uppercase tracking-tight leading-none">
                  SustentaÃ§Ã£o, Auditoria & Escala MÃ¡xima
                </h3>
                <p className="text-black/80 text-xs sm:text-[13px] leading-relaxed font-sans font-semibold">
                  Garantimos a execuÃ§Ã£o contÃ­nua com reuniÃµes sistemÃ¡ticas tÃ¡ticas de acompanhamento, garantindo que seu ecossistema adote cada rotina de forma perene e sem recaÃ­das operacionais.
                </p>
              </div>

              <div className="pt-6 border-t border-black/[0.08] mt-8 flex items-center justify-between w-full text-black/60 font-mono text-[9.5px] uppercase tracking-widest">
                <span>05 // RESULTADO BLINDADO E CONTÃNUO</span>
                <button
                  onClick={() => {
                    const target = document.getElementById("contato");
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth" });
                    } else {
                      onNavigate("/contato");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="bg-black text-white hover:bg-black/90 text-[10px] font-semibold px-4 py-2 font-mono uppercase rounded-xl transition-all flex items-center gap-2 group/btn shadow-md"
                >
                  Assegurar Minha Escala <span className="group-hover/btn:translate-x-1 transition-transform">Ã¢â€ â€™</span>
                </button>
              </div>
            </motion.div>

            {/* Step 04: RecomendaÃ§Ã£o CirÃºrgica (with bottom-right curved border mimicking Reference 1 card!) */}
            <motion.div 
              whileHover={{ y: -3, scale: 1.01 }}
              className="bg-[#121214] border border-white/[0.05] p-8 sm:p-10 rounded-[28px] rounded-br-[90px] min-h-[220px] flex flex-col justify-between text-left group transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-black bg-white/[0.03] border border-white/10 px-2 py-0.5 rounded">PROTOCOLO 04</span>
                <span className="font-mono text-brand-secondary text-[10px] uppercase font-black tracking-widest">Desenho TÃ¡tico</span>
              </div>
              
              <div className="space-y-2 mt-8 max-w-[85%]">
                <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-tight">
                  RecomendaÃ§Ã£o CirÃºrgica
                </h3>
                <p className="text-zinc-400 text-[11.5px] leading-relaxed font-sans font-medium">
                  Nossa diretoria sÃªnior elabora o roteiro personalizado de aÃ§Ãµes, integrando design moderno, anÃºncios cirÃºrgicos e refinamentos em perfeita concordÃ¢ncia.
                </p>
              </div>

              <div className="pt-6 border-t border-brand-secondary/10 mt-8 flex items-center justify-between w-full text-zinc-500 font-mono text-[9px] uppercase tracking-wider">
                <span>04 // PRESCRIÃ‡ÃƒO</span>
                <ArrowLeft className="w-4 h-4 text-brand-secondary hidden lg:block" />
                <ArrowDown className="w-4 h-4 text-brand-secondary lg:hidden" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 3 - NOSSO DIFERENCIAL (BENTO GRID PREMIUM INSPIRADO NO ACORDO VISUAL SELECIONADO) */}
      <section id="solucao" className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-zinc-950 relative overflow-hidden">
        {/* Ambient top-right neon highlight mimicking fitness studio */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-brand-secondary/[0.02] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-white/[0.01] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          
          {/* Header Block of the Advantages Section */}
          <div className="max-w-3xl text-left space-y-4 mb-16">
            <span className="font-mono text-xs text-brand uppercase tracking-widest font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
              DIFERENCIAIS DE OPERAÃ‡ÃƒO
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-gradient leading-tight uppercase">
              Por que grandes lÃ­deres e marcas de excelÃªncia escolhem crescer conosco?
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Nossa operaÃ§Ã£o de crescimento desenha, executa e gerencia sua presenÃ§a digital sob demanda. Sem pacotes genÃ©ricos, sem fricÃ§Ã£o burocrÃ¡tica, com foco comercial consistente.
            </p>
          </div>

          {/* THE SEAMLESS BENTO GRID BLOCK */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* COLUMN 1 - LEFT SIDE (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
              
              {/* Card 1: Experience / Star Icon */}
              <motion.div 
                whileHover={{ y: -3, scale: 1.01 }}
                className="bg-[#121214] border border-white/[0.05] hover:border-brand/20 p-6 rounded-[28px] text-left flex flex-col justify-between min-h-[140px] group transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.08] text-brand-secondary flex items-center justify-center">
                    <Star className="w-4 h-4 fill-current text-brand" />
                  </div>
                  <span className="font-mono text-[9px] text-brand-secondary tracking-wider uppercase font-bold opacity-60">SÃŠNIOR</span>
                </div>
                <div className="mt-4 space-y-1">
                  <h4 className="font-display font-black text-xs sm:text-sm text-white uppercase tracking-tight">ConsÃ³rcio de Diretores</h4>
                  <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                    OperaÃ§Ãµes geridas diretamente por lÃ­deres experientes com mais de 10 anos de mercado real.
                  </p>
                </div>
              </motion.div>

              {/* Card 2: Strategic custom setup / Plus Icon */}
              <motion.div 
                whileHover={{ y: -3, scale: 1.01 }}
                className="bg-[#121214] border border-white/[0.05] hover:border-brand/20 p-6 rounded-[28px] text-left flex flex-col justify-between min-h-[140px] group transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.08] text-white flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white font-black" />
                  </div>
                  <span className="font-mono text-[9px] text-zinc-500 tracking-wider uppercase font-bold">SOB DEMANDA</span>
                </div>
                <div className="mt-4 space-y-1">
                  <h4 className="font-display font-black text-xs sm:text-sm text-white uppercase tracking-tight">AtuaÃ§Ã£o Estruturada</h4>
                  <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                    Sem engessamento. Planejamento flexÃ­vel desenhado em perfeita simbiose com seus objetivos corporativos.
                  </p>
                </div>
              </motion.div>

              {/* Card 3 & 4: Split Mini Cards */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Card 3: 4 Pilares */}
                <div className="bg-brand-secondary border border-black/10 p-5 rounded-[24px] text-left flex flex-col justify-between min-h-[135px] shadow-[0_10px_30px_rgba(var(--color-brand-secondary-rgb),0.1)] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute top-[-20px] right-[-20px] w-16 h-16 bg-white/20 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-mono text-[8px] font-black uppercase text-black/60 bg-black/5 px-2 py-0.5 rounded border border-black/5">01 // UNIFICADO</span>
                    <span className="font-sans text-[9px] font-bold text-black/70">STRATEGY</span>
                  </div>
                  <div className="space-y-1 relative z-10 mt-3">
                    <span className="font-display font-black text-3xl text-black tracking-tighter block leading-none">4 PILARES</span>
                    <p className="text-black font-display font-bold text-[10px] uppercase tracking-wider">ESTRATÃ‰GIA INTEGRADA</p>
                    <p className="text-black/60 text-[9.5px] leading-snug font-medium">Copy, Ads, WebDev e Design perfeitamente sem costuras.</p>
                  </div>
                </div>

                {/* Card 4: AtuaÃ§Ã£o Premium */}
                <div className="bg-[#121214] border border-white/[0.05] hover:border-brand/20 p-5 rounded-[24px] text-left flex flex-col justify-between min-h-[135px] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/[0.01] rounded-full blur-xl group-hover:bg-brand-secondary/[0.02] transition-all pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-mono text-[8px] font-black uppercase text-brand-secondary bg-brand-secondary/5 px-2 py-0.5 rounded border border-brand-secondary/10">02 // IMPACTO</span>
                    <Zap className="w-3 h-3 text-brand-secondary" />
                  </div>
                  <div className="space-y-1 relative z-10 mt-3">
                    <span className="font-display font-black text-3xl text-white tracking-tighter block leading-none">C-LEVEL</span>
                    <p className="text-white font-display font-bold text-[10px] uppercase tracking-wider">AUTORIDADE REAL</p>
                    <p className="text-zinc-500 text-[9.5px] leading-snug font-medium">GeraÃ§Ã£o de traÃ§Ã£o intelectual de alto ticket estruturado.</p>
                  </div>
                </div>

              </div>

            </div>

            {/* COLUMN 2 - MIDDLE HUGE VERTICAL CARD (lg:col-span-4) */}
            <div className="lg:col-span-4">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="relative rounded-[32px] overflow-hidden bg-cover bg-center border border-white/[0.08] shadow-2xl h-full min-h-[440px] flex flex-col justify-between p-8 text-left group"
                style={{ 
                  backgroundImage: "linear-gradient(to bottom, rgba(10,10,12,0.9), rgba(10,10,12,0.4), rgba(10,10,12,0.95)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80')" 
                }}
              >
                {/* High contrast glass highlight in the grid */}
                <div className="absolute inset-0 bg-black/45 z-0 transition-opacity duration-500 group-hover:opacity-20 pointer-events-none" />

                {/* Header tag */}
                <div className="relative z-10 flex justify-between items-center w-full">
                  <span className="font-mono text-[9px] text-brand-secondary tracking-widest uppercase font-extrabold bg-brand-secondary/10 px-2.5 py-1 rounded-full">
                    EstÃºdio Operacional
                  </span>
                  <span className="text-zinc-500 font-mono text-[8px]">SÃƒO PAULO / BR</span>
                </div>

                {/* HERO DIGITAL ".T" CENTERING */}
                <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-6 select-none">
                  {/* Outer circle layout matching the fitness aesthetic */}
                  <div className="absolute inset-x-0 h-40 scale-95 border-t border-b border-brand/5 rounded-full animate-pulse pointer-events-none" />
                  
                  {/* GIANT NEON BRANDING LETTER ".T" */}
                  <span className="font-display font-black text-9xl text-brand-secondary tracking-tighter drop-shadow-[0_15px_30px_rgba(var(--color-brand-secondary-rgb),0.35)] transform group-hover:scale-105 transition-transform duration-700">
                    .T
                  </span>
                  
                  <span className="text-white font-mono text-[10px] tracking-widest font-black uppercase mt-4">
                    TAG08 CONSÃ“RCIO
                  </span>
                </div>

                {/* Bottom detailed description */}
                <div className="relative z-10 pt-4 border-t border-white/5 space-y-2">
                  <h3 className="text-white font-display font-bold text-xs uppercase tracking-wider">Centro de InteligÃªncia Premium</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Nossa equipe aplica inteligÃªncia autoral com engenharia de processos, consolidando o posicionamento mais elegante para o seu funil de vendas.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* COLUMN 3 - RIGHT SIDE (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
              
              {/* Card 6 & 7: Split Mini Cards */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Card 6: Wifi / SincronizaÃ§Ã£o */}
                <div className="bg-[#121214] border border-white/[0.05] hover:border-brand/20 p-5 rounded-[24px] text-left flex flex-col justify-between min-h-[135px] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/[0.01] rounded-full blur-xl group-hover:bg-brand-secondary/[0.02] transition-all pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-mono text-[8px] font-black uppercase text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">03 // FLOW</span>
                    <Wifi className="w-3.5 h-3.5 text-zinc-400 group-hover:text-brand-secondary transition-colors" />
                  </div>
                  <div className="space-y-1 relative z-10 mt-3">
                    <span className="font-display font-black text-2xl text-white tracking-tighter block leading-none">ASSÃNCRONO</span>
                    <p className="text-white font-display font-bold text-[10px] uppercase tracking-wider">Sincronia Total</p>
                    <p className="text-zinc-500 text-[9.5px] leading-snug font-medium">Controle total via canais diretos e limpos.</p>
                  </div>
                </div>

                {/* Card 7: Layers / Tech Stack */}
                <div className="bg-[#121214] border border-white/[0.05] hover:border-brand/20 p-5 rounded-[24px] text-left flex flex-col justify-between min-h-[135px] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/[0.01] rounded-full blur-xl group-hover:bg-brand-secondary/[0.02] transition-all pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-mono text-[8px] font-black uppercase text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">04 // TECH</span>
                    <Layers className="w-3.5 h-3.5 text-zinc-400 group-hover:text-brand transition-colors" />
                  </div>
                  <div className="space-y-1 relative z-10 mt-3">
                    <span className="font-display font-black text-2xl text-white tracking-tighter block leading-none">ZERO NO-CODE</span>
                    <p className="text-white font-display font-bold text-[10px] uppercase tracking-wider">TECNOLOGIA LIMPA</p>
                    <p className="text-zinc-500 text-[9.5px] leading-snug font-medium">CÃ³digo limpo, leve e rÃ¡pido.</p>
                  </div>
                </div>

              </div>

              {/* Card 8: Fitness band tracker equivalent (MÃ©tricas e InteligÃªncia comercial) */}
              <motion.div 
                whileHover={{ y: -3, scale: 1.01 }}
                className="bg-[#121214] border border-white/[0.05] hover:border-brand/20 p-6 rounded-[28px] text-left flex flex-col justify-between min-h-[140px] group transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.08] text-zinc-300 flex items-center justify-center group-hover:text-brand-secondary group-hover:border-brand-secondary/30 transition-all">
                    <Activity className="w-4 h-4 animate-pulse text-brand" />
                  </div>
                  <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-extrabold">ANALYTICS ATIVO</span>
                </div>
                <div className="mt-4 space-y-1">
                  <h4 className="font-display font-black text-xs sm:text-sm text-white uppercase tracking-tight">DecisÃµes Guiadas por Dados</h4>
                  <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                    Evitamos suposiÃ§Ãµes estÃ©reis. Fornecemos dashboards dinÃ¢micos traduzindo cada trÃ¡fego, lead e conversÃ£o em crescimento tÃ¡tico palpÃ¡vel.
                  </p>
                </div>
              </motion.div>

              {/* Card 9 & 10: Performance Displays */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Card 9: R$ 50M+ */}
                <div className="bg-[#121214] border border-white/[0.05] hover:border-brand/20 p-5 rounded-[24px] text-left flex flex-col justify-between min-h-[140px] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.01] rounded-full blur-md group-hover:bg-brand-secondary/[0.01] transition-all pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-sans text-[7px] font-black uppercase text-brand-secondary bg-brand-secondary/5 px-1.5 py-0.5 rounded">BUDGETS</span>
                    <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <div className="mt-3 relative z-10 text-left">
                    <span className="font-display font-black text-2xl sm:text-3xl text-white tracking-tighter leading-none block">R$ 50M+</span>
                    <p className="text-white font-display font-bold text-[9.5px] uppercase tracking-wider mt-0.5">Gerenciados</p>
                    <p className="text-zinc-500 text-[9px] leading-snug">Em canais pagos de trÃ¡fego de alta conversÃ£o.</p>
                  </div>
                </div>

                {/* Card 10: RetenÃ§Ã£o */}
                <div className="bg-[#121214] border border-white/[0.05] hover:border-brand/20 p-5 rounded-[24px] text-left flex flex-col justify-between min-h-[140px] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute bottom-[-20px] right-[-20px] w-20 h-20 bg-brand/[0.015] rounded-full blur-xl group-hover:bg-brand-secondary/[0.03] transition-all pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-sans text-[7px] font-black uppercase text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded">LTV RATIO</span>
                    <div className="flex -space-x-1.5">
                      <img className="w-4 h-4 rounded-full ring-1 ring-black object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=50" />
                      <img className="w-4 h-4 rounded-full ring-1 ring-black object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=50" />
                      <img className="w-4 h-4 rounded-full ring-1 ring-black object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=50" />
                    </div>
                  </div>
                  <div className="mt-3 relative z-10 text-left">
                    <span className="font-display font-black text-2xl sm:text-3xl text-brand-secondary tracking-tighter leading-none block">+98%</span>
                    <p className="text-white font-display font-bold text-[9.5px] uppercase tracking-wider mt-0.5">Fidelidade</p>
                    <p className="text-zinc-500 text-[9px] leading-snug">Taxa de renovaÃ§Ã£o e sustentaÃ§Ã£o de contratos.</p>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Inline Link for further contact */}
          <div className="mt-16 text-center border-t border-white/[0.04] pt-8">
            <button
              onClick={() => handleLinkClick("/contato")}
              className="text-white/60 hover:text-brand-secondary font-mono text-[10px] sm:text-xs font-black uppercase tracking-widest inline-flex items-center gap-2 group transition-colors cursor-pointer"
            >
              Iniciar AnÃ¡lise do Modelo de DiagnÃ³stico do Seu NegÃ³cio &rarr;
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 4 - PORTFÃ“LIO DE SOLUÃ‡Ã•ES DE EXCELÃŠNCIA (BENTO GRID EDITORIAL DE ALTA NAVEGABILIDADE) */}
      <section id="servicos-principais" className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
        
        {/* Ambient background decoration */}
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-[350px] h-[350px] bg-white/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Main tablet content card in pure high fashion white */}
          <div className="bg-white text-black p-6 sm:p-14 lg:p-16 rounded-[44px] sm:rounded-[56px] border border-black/10 shadow-[0_45px_100px_rgba(0,0,0,0.9)] overflow-hidden relative">
            
            {/* Design Grid lines simulating print outline */}
            <div className="absolute inset-0 grid grid-cols-4 sm:grid-cols-8 h-full opacity-[0.02] pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border-r border-black h-full" />
              ))}
            </div>
            <div className="absolute inset-0 grid grid-rows-4 sm:grid-rows-8 w-full opacity-[0.02] pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border-b border-black w-full" />
              ))}
            </div>

            {/* TABLET NAV HEADER WRAPPER */}
            <div className="relative z-10 flex items-center justify-between border-b border-black/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 text-black">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-current animate-[spin_50s_linear_infinite]">
                    <g transform="translate(50, 50)">
                      {[...Array(8)].map((_, i) => (
                        <rect key={i} x="-3" y="-30" width="6" height="60" rx="3" transform={`rotate(${i * 45})`} />
                      ))}
                    </g>
                  </svg>
                </div>
                <span className="font-display font-black text-xs tracking-widest uppercase">TAG08 DIGITAL</span>
              </div>

              {/* Navigation items removed to enhance experience as requested */}
              <div className="hidden sm:block w-12" />
            </div>

            {/* GIANT EDITORIAL HEADLINE BLOCK */}
            <div className="relative z-10 pt-10 pb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
              <div className="text-left space-y-2 max-w-3xl">
                <p className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase font-extrabold block">
                  PORTFÃ“LIO DE SOLUÃ‡Ã•ES DE EXCELÃŠNCIA
                </p>
                <h2 className="font-display font-black text-4xl sm:text-7xl lg:text-[76px] leading-[0.85] tracking-tighter text-black uppercase">
                  DIGITAL MARKETING <br />
                  SERVICES
                </h2>
              </div>
              <p className="text-zinc-600 text-xs sm:text-sm font-sans font-medium tracking-tight leading-relaxed max-w-sm text-left xl:text-right xl:pb-2">
                Nossas soluÃ§Ãµes integram marca, design, conteÃºdo e engenharia operacional para consolidar o posicionamento premium que sua empresa merece no mercado.
              </p>
            </div>

            {/* STUNNING BENTO GRID OF ALL 7 ELITE SOLUTIONS */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 my-6">
              {PORTFOLIO_SERVICES_DATA.map((service, index) => {
                // Determine styling based on index to create a breathtaking editorial Bento structure
                let gridClass = "";
                let cardBg = "";
                let textColor = "";
                let taglineColor = "";
                let isDark = false;
                
                if (index === 0) {
                  // GestÃ£o de Redes: Big, premium light card
                  gridClass = "lg:col-span-8";
                  cardBg = "bg-zinc-50 border border-black/10";
                  textColor = "text-black";
                  taglineColor = "text-zinc-500 hover:text-black hover:underline";
                  isDark = false;
                } else if (index === 1) {
                  // Audiovisual: Dark luxury card
                  gridClass = "lg:col-span-4";
                  cardBg = "bg-zinc-900 border border-white/5 shadow-md";
                  textColor = "text-white";
                  taglineColor = "text-brand-secondary hover:underline";
                  isDark = true;
                } else if (index === 2) {
                  // Branding: Dark editorial card
                  gridClass = "lg:col-span-4";
                  cardBg = "bg-black border border-white/10 shadow-md";
                  textColor = "text-white";
                  taglineColor = "text-zinc-400 hover:text-white hover:underline";
                  isDark = true;
                } else if (index === 3) {
                  // TrÃ¡fego: Big, premium white card
                  gridClass = "lg:col-span-8";
                  cardBg = "bg-white border border-black/15 shadow-sm";
                  textColor = "text-black";
                  taglineColor = "text-zinc-600 hover:text-black hover:underline";
                  isDark = false;
                } else if (index === 4) {
                  // Copywriting: Medium card
                  gridClass = "lg:col-span-4";
                  cardBg = "bg-zinc-50 border border-black/5";
                  textColor = "text-black";
                  taglineColor = "text-zinc-500 hover:text-black hover:underline";
                  isDark = false;
                } else if (index === 5) {
                  // Dev Web: Medium card
                  gridClass = "lg:col-span-4";
                  cardBg = "bg-neutral-100 border border-black/10";
                  textColor = "text-black";
                  taglineColor = "text-zinc-500 hover:text-black hover:underline";
                  isDark = false;
                } else {
                  // Process Intelligence: Special glow card
                  gridClass = "lg:col-span-4";
                  cardBg = "bg-brand-secondary/10 border border-brand-secondary/20";
                  textColor = "text-black";
                  taglineColor = "text-zinc-700 hover:text-black hover:underline font-bold";
                  isDark = false;
                }

                return (
                  <motion.div
                    key={service.id}
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                    className={`${gridClass} ${cardBg} ${textColor} rounded-[32px] p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden group min-h-[350px] shadow-sm`}
                  >
                    {/* Design Grid overlay simulating print matrix for light cards */}
                    {!isDark && (
                      <div className="absolute inset-0 grid grid-cols-3 h-full opacity-[0.015] pointer-events-none">
                        <div className="border-r border-black h-full" />
                        <div className="border-r border-black h-full" />
                        <div className="border-r border-black h-full" />
                      </div>
                    )}

                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center justify-between border-b pb-3 border-current/10">
                        <span className="font-mono text-[9px] tracking-widest uppercase font-bold opacity-60">
                          COMPONENTE OPERACIONAL
                        </span>
                        <button 
                          onClick={() => handleLinkClick(service.slug)}
                          className={`font-mono text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 cursor-pointer ${taglineColor}`}
                        >
                          {service.subtitle} 
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'}`}>
                            {service.icon}
                          </div>
                          <h3 className="font-display font-black text-xl sm:text-2xl uppercase leading-none tracking-tight">
                            {service.title}
                          </h3>
                        </div>
                        <p className={`text-xs sm:text-sm font-sans leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                          {service.longDesc}
                        </p>
                      </div>
                    </div>

                    {/* Bottom metric & mini graph */}
                    <div className="pt-6 border-t border-current/10 mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-10 w-full">
                      <div className="flex flex-col">
                        <span className="font-mono text-[9px] uppercase tracking-widest opacity-50">
                          {service.metricLabel}
                        </span>
                        <span className="text-2xl sm:text-3xl font-display font-black tracking-tight mt-1">
                          {service.metricValue}
                        </span>
                      </div>

                      {/* Spark wave pattern lines */}
                      <div className="w-28 h-10 opacity-70 shrink-0 select-none">
                        <svg viewBox="0 0 200 60" className={`w-full h-full stroke-current ${isDark ? 'text-brand-secondary' : 'text-black'}`} fill="none" strokeWidth="3" strokeLinecap="round">
                          <path d={service.wavePath} />
                          <circle cx="190" cy="12" r="5" className="fill-current" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="h-4" />

          </div>
        </div>
      </section>

      {/* SECTION 4.5 - RESULTADOS E CASES (MÃ‰TODOS COM RESULTADO COMPROVADOS NA PRÃTICA) */}
      <section id="resultados-cases" className="py-24 px-6 border-b border-white/[0.04] bg-zinc-950 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Mockup Header line spacing and structure */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 text-left">
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-brand-secondary uppercase tracking-widest font-black block">
                Nossos Resultados de Crescimento
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-gradient uppercase tracking-tight leading-none">
                Nossos Cases e Resultados de Sucesso
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans max-w-2xl leading-relaxed">
                Provamos nossa competÃªncia gerando crescimento extraordinÃ¡rio, previsibilidade de vendas e autoridade inquestionÃ¡vel para marcas de alto padrÃ£o.
              </p>
            </div>
            <button
              onClick={() => handleLinkClick("/servicos")}
              className="text-xs font-mono text-brand-secondary hover:underline font-bold flex items-center justify-start md:justify-end gap-1.5 shrink-0 uppercase tracking-widest cursor-pointer"
            >
              Solicitar Estudo de Caso <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CASE_STUDIES.map((item) => (
              <CaseStudyCard
                key={item.id}
                item={item}
                onClick={() => handleLinkClick(`/casos/${item.id}`)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5 - TABELA DE PLANOS DE MÃDIAS SOCIAIS (REDESENHADA - INSPIRADO NO ACORDO VISUAL DO DEPOIMENTO DO CLIENTE) */}
      <section id="planos-redes" className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        {/* Luminous Container mimicking the uploaded design mockup but for Editorial strategy */}
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          
          {/* Internal subtle background paper/dot layout */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          {/* Left Column: Ultra-stylish Portrait layout adorned with design overlays just like the reference */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[520px] w-full">
            {/* Dark background silhouette framing to lift the image */}
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden" />
            
            <img 
              src={moodyClientPortrait} 
              alt="TAG08 Editorial Strategy" 
              className="absolute inset-0 w-full h-full object-cover rounded-[24px] mix-blend-normal brightness-[0.9] contrast-[1.05] grayscale-[10%] transition-all duration-500 hover:scale-105"
            />
            
            {/* Styled aesthetic watermark overlays mimicking the design language */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  EDITORIAL LAB
                </span>
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  INSTA_TACTICAL
                </span>
              </div>

              {/* Watermark text overlays */}
              <div className="space-y-1.5 opacity-30 select-none">
                <div className="font-display font-extrabold text-[1.8rem] text-white/40 tracking-widest leading-none uppercase select-none">
                  pautas_curadas
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                  estÃ©tica_instagram
                </div>
              </div>

              <div className="flex justify-between items-end">
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  CONSISTENCY: 100%
                </span>
                <span className="font-mono text-[9px] text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  PRESTÃGIO MÃXIMO
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Typography, Action Prompt & Overlaid Curved Card with interactive tabs */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 text-left h-full relative z-10 lg:pl-4">
            
            <div className="space-y-4">
              {/* Upper badge */}
              <div className="inline-flex items-center gap-2 text-black font-semibold">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/90">
                  CONFIRA PROTOCOLOS DE MÃDIA EXECUTIVA
                </span>
              </div>

              {/* Massive Bold Heading mirroring reference design */}
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black leading-[0.95] tracking-tighter uppercase">
                ESTRATÃ‰GIA EDITORIAL <br />
                &amp; MÃDIAS TÃTICAS!
              </h2>

              {/* Description Paragraph with high contrast block typeface layout */}
              <p className="text-black/85 text-[11px] sm:text-xs max-w-2xl leading-relaxed font-sans font-extrabold uppercase">
                VISTA SUA MARCA COM A SOBERANIA VISUAL E MENTAL QUE SÃ“ PROFISSIONAIS DE ALTO PRESTÃGIO COMPREENDEM. ESCOLHA SEU ESCALONAMENTO DE PRESENÃ‡A DIRETA DIGITAL.
              </p>
            </div>

            {/* Overlaid Premium Curved Dark Action Card modeled exactly off the uploaded picture but interactive for plans */}
            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 md:p-8 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 w-full relative overflow-hidden text-left text-white">
              {/* Glowing decorative background vector inside black card */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />

              {/* High precision mini horizontal digital switchers */}
              <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl self-start w-full">
                {(["start", "base", "performance"] as const).map((plan) => (
                  <button
                    key={plan}
                    onClick={() => setSelectedEditorialPlan(plan)}
                    className={`flex-1 text-center py-2 px-1 rounded-lg font-mono text-[9px] uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                      selectedEditorialPlan === plan
                        ? "bg-brand text-black shadow-md shadow-brand-secondary/15"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {plan === "start" ? "01 START" : plan === "base" ? "02 RECOMENDADO" : "03 PERFORMANCE"}
                  </button>
                ))}
              </div>

              {/* Current Active Plan Details showing Index, Title, Desc and Tags */}
              <div className="space-y-4">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-display font-black text-4xl text-brand tracking-tighter">
                    {selectedEditorialPlan === "start" ? "01" : selectedEditorialPlan === "base" ? "02" : "03"}
                  </span>
                  <span className="font-mono text-[9.5px] font-black uppercase text-brand tracking-widest bg-brand/10 border border-brand/20 px-2 py-0.5 rounded">
                    {selectedEditorialPlan === "start" ? "PLANO START" : selectedEditorialPlan === "base" ? "PLANO BASE (MÃXIMO FEED)" : "PLANO PERFORMANCE"}
                  </span>
                </div>

                <p className="text-zinc-200 text-xs leading-relaxed font-sans font-semibold">
                  {selectedEditorialPlan === "start" 
                    ? "EliminaÃ§Ã£o rÃ¡pida do amadorismo institucional para profissionais estruturarem autoridade inicial." 
                    : selectedEditorialPlan === "base"
                    ? "O verdadeiro padrÃ£o de excelÃªncia corporativo. ConteÃºdo impecÃ¡vel, carrossÃ©is de alto impacto e monitoramento."
                    : "Storytelling ultra magnÃ©tico com 12 roteiros cirÃºrgicos de vÃ­deo curto e pÃ³s-produÃ§Ã£o integrada nÃ­vel cinema."}
                </p>

                {/* Styled compact tags of the main deliverables */}
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {(selectedEditorialPlan === "start" ? [
                    "8 Pautas Curadas",
                    "Design SÃªnior",
                    "RedaÃ§Ã£o SEO",
                    "Suporte no Grupo",
                    "Legendas MagnÃ©ticas"
                  ] : selectedEditorialPlan === "base" ? [
                    "12 Pautas Exclusivas",
                    "Modelagem de Carrossel",
                    "Identidade Coesa",
                    "SEO de Alta Busca",
                    "Agendamento AutomÃ¡tico",
                    "ReuniÃ£o de Alinhamento"
                  ] : [
                    "12 Roteiros CinematogrÃ¡ficos",
                    "Storytelling Sob Medida",
                    "Modelagem de RetenÃ§Ã£o",
                    "EdiÃ§Ã£o com Lentes Pro",
                    "AtÃ© 8 Artes de Apoio",
                    "AnÃ¡lise de Engajamento"
                  ]).map((tag, idx) => (
                    <span 
                      key={idx} 
                      className={`font-mono text-[8.5px] px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                        selectedEditorialPlan === "base"
                          ? "bg-brand/10 border border-brand/20 text-brand font-bold"
                          : "bg-white/[0.04] border border-white/[0.08] text-white"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connection Button Indicator exactly matching the referenced model */}
              <div className="flex gap-4 items-start border-t border-white/[0.05] pt-4 select-none">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black shrink-0 shadow-lg shadow-brand/10 hover:scale-105 transition-transform duration-200">
                  <ArrowRight className="w-5 h-5 rotate-[-45deg] stroke-[2.5]" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-[8px] text-brand uppercase tracking-wider font-extrabold block">
                    {selectedEditorialPlan === "base" ? "RECOMENDAÃ‡ÃƒO OPERACIONAL" : "ALOCAÃ‡ÃƒO DE DIRETOR"}
                  </span>
                  <p className="text-white text-xs leading-snug font-sans font-semibold">
                    {selectedEditorialPlan === "base" 
                      ? "Eleve a maturidade intelectual da sua marca com o protocolo mais assinado das clÃ­nicas de luxo." 
                      : "Trabalho contÃ­nuo conduzido por estrategistas em design herÃ¡ldico e estÃ©tica sÃªnior."}
                  </p>
                </div>
              </div>

              {/* DUAL CLIENT CONNECTION CHANNELS (BR & INT) */}
              <div className="space-y-3">
                <a 
                  href={buildBrazilWhatsAppUrl(`OlÃ¡,%20gostaria%20de%20solicitar%20comunicaÃ§Ã£o%20de%20diretor%20para%20o%2520Plano%2520${selectedEditorialPlan.toUpperCase()}%2520da%2520TAG08!`)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleOutboundClick("WhatsApp", buildBrazilWhatsAppUrl(`OlÃƒÂ¡,%20gostaria%20de%20solicitar%20comunicaÃƒÂ§ÃƒÂ£o%20de%20diretor%20para%20o%2520Plano%2520${selectedEditorialPlan.toUpperCase()}%2520da%2520TAG08!`), "home-editorial-plan-br")}
                  className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-black transition-all duration-200">
                        <span className="text-[9px] font-mono font-black tracking-tight text-brand group-hover:text-black">BR</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase font-black tracking-wider leading-none">
                          PROPRIETÃRIO DIRETO (WhatsApp)
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
                  href={buildInternationalWhatsAppUrl(`Hello,%20I%20would%20like%20to%20request%20director%20communication%2520for%2520the%2520${selectedEditorialPlan.toUpperCase()}%2520Plan%2520from%2520TAG08`)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleOutboundClick("WhatsApp", buildInternationalWhatsAppUrl(`Hello,%20I%20would%20like%20to%20request%20director%20communication%2520for%2520the%2520${selectedEditorialPlan.toUpperCase()}%2520Plan%2520from%2520TAG08`), "home-editorial-plan-int")}
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

              {/* Status bar block with pulsing green glow */}
              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                  <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest font-extrabold">
                    AGÃŠNCIA TAG08
                  </span>
                </div>
                <span className="font-sans text-[8.5px] text-brand font-bold bg-brand/10 border border-brand/20 px-2 rounded">
                  OPERAÃ‡ÃƒO E CO-PILOTO 100% ATIVOS
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SECTION 6 - METODOLOGIA */}
      <section id="metodologia" className="py-24 px-6 border-b border-white/[0.04] bg-charcoal-900/10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
            <span className="font-mono text-xs text-brand uppercase tracking-widest font-semibold">
              Nosso MÃ©todo
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-gradient">
              Nosso mÃ©todo comeÃ§a antes da execuÃ§Ã£o.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              NÃ£o vendemos mÃ¡gica ou atalhos fÃ¡ceis. Entregamos consistÃªncia fundamentada em metodologia em cinco fases complementares e orientadas ao crescimento sustentÃ¡vel.
            </p>
          </div>

          {/* Timeline alignment */}
          <div className="relative border-l lg:border-l-0 lg:border-t border-white/[0.05] grid grid-cols-1 lg:grid-cols-5 gap-12 pt-10 pl-6 lg:pl-0">
            {/* Step 1 */}
            <div className="relative space-y-3">
              <div className="absolute -left-[31px] lg:left-0 -top-2 lg:-top-[46px] w-4 h-4 rounded-full bg-brand border-4 border-charcoal-950 z-10" />
              <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Passo 01</div>
              <h4 className="font-display font-semibold text-white">DiagnÃ³stico</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Entendemos profundamente qual o momento ideal da sua marca, os canais digitais atuais, os orÃ§amentos e as principais brechas comerciais.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative space-y-3">
              <div className="absolute -left-[31px] lg:left-0 -top-2 lg:-top-[46px] w-4 h-4 rounded-full bg-brand border-4 border-charcoal-950 z-10" />
              <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Passo 02</div>
              <h4 className="font-display font-semibold text-white">EstratÃ©gia</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Definimos o seu novo posicionamento, os canais mais promissores, a matriz de pautas autorais e os objetivos de marketing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative space-y-3">
              <div className="absolute -left-[31px] lg:left-0 -top-2 lg:-top-[46px] w-4 h-4 rounded-full bg-brand border-4 border-charcoal-950 z-10" />
              <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Passo 03</div>
              <h4 className="font-display font-semibold text-white">ProduÃ§Ã£o</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Desenhamos artes, escrevemos roteiros, desenvolvemos cÃ³digos limpos e produzimos campanhas com foco em gerar a melhor experiÃªncia possÃ­vel.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative space-y-3">
              <div className="absolute -left-[31px] lg:left-0 -top-2 lg:-top-[46px] w-4 h-4 rounded-full bg-brand border-4 border-charcoal-950 z-10" />
              <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Passo 04</div>
              <h4 className="font-display font-semibold text-white">AtivaÃ§Ã£o</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Campanhas ganham mÃ­dias, publicamos conteÃºdos autorais de acordo com cronograma, ou instalamos os playbooks operacionais da empresa.
              </p>
            </div>

            {/* Step 5 */}
            <div className="relative space-y-3">
              <div className="absolute -left-[31px] lg:left-0 -top-2 lg:-top-[46px] w-4 h-4 rounded-full bg-brand border-4 border-charcoal-950 z-10" />
              <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Passo 05</div>
              <h4 className="font-display font-semibold text-white">EvoluÃ§Ã£o</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Avaliamos mÃ©tricas de engajamento, analisamos dados no CRM das suas conversÃµes e otimizamos a estratÃ©gia mensalmente.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center border-t border-white/[0.04] pt-8 font-sans text-xs text-zinc-500">
            &ldquo;NÃ£o vendemos mÃ¡gica. Entregamos processo com resultado.&rdquo;
          </div>
        </div>
      </section>

      {/* SECTION 6.5 - PRODUÃ‡Ã•ES RECENTES NO YOUTUBE (REDESENHADOS COESOS INSPIRADOS NAS REFERÃŠNCIAS VISUAIS DE CARROSSEL E RETRATO EDITORIAL) */}
      <section id="videos-recentes" className="py-24 px-4 sm:px-6 md:px-8 bg-black border-b border-white/[0.04] relative overflow-hidden">
        {/* Subtle decorative grid overlay and luminous auras */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand/[0.025] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand/[0.015] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Section Header with top badge and clean typography */}
          <div className="max-w-3xl text-left space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono">
              CONTEÃšDO DE ALTA RETENÃ‡ÃƒO // YOUTUBE CHANNEL
            </div>
            
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white leading-[0.9] tracking-tighter uppercase">
              ÃšLTIMAS PRODUÃ‡Ã•ES <br />
              &amp; ENGENHARIA DE CONVERSÃƒO
            </h2>
            
            <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans max-w-2xl">
              Nossos vÃ­deos mostram a aplicaÃ§Ã£o prÃ¡tica de design sÃªnior, branding soberano e estratÃ©gias de captaÃ§Ã£o que realizamos para marcas de destaque. Selecione abaixo e assista diretamente do player incorporado.
            </p>
          </div>

          {/* Asymmetric Split Layout merging Ref 1 (Theater Card) + Ref 2 (Vertical list container) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Box (lg:col-span-8): Interactive Theater Player mimicking Ref 1 Premium style */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="relative w-full h-full rounded-[28px] sm:rounded-[36px] overflow-hidden bg-charcoal-950 border border-white/[0.08] shadow-[0_30px_70px_rgba(0,0,0,0.7)] flex flex-col justify-between p-6 sm:p-9 text-left group min-h-[460px] sm:min-h-[520px] lg:min-h-0 flex-1">
                
                {/* Simulated playback or Real YouTube IFrame */}
                {isPlayingVideo ? (
                  <div className="absolute inset-0 z-30 h-full w-full bg-black">
                    <iframe 
                      src={`https://www.youtube.com/embed/${YOUTUBE_VIDEOS[activeVideoIndex].embedCode}?autoplay=1`} 
                      title={YOUTUBE_VIDEOS[activeVideoIndex].title} 
                      className="w-full h-full border-0 absolute inset-0 rounded-[28px] sm:rounded-[36px]" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowFullScreen
                    ></iframe>
                    
                    {/* Disconnect / Stop Player button overlay in theater mode */}
                    <button 
                      onClick={() => setIsPlayingVideo(false)}
                      className="absolute top-4 right-4 z-40 bg-black/80 hover:bg-black border border-white/20 text-white hover:text-brand font-mono text-[9px] font-black tracking-widest px-3 py-1.5 rounded-full uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-3 h-3 text-brand" />
                      <span>FECHAR PLAYER</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Background Visual Backdrop with custom vignette */}
                    <div className="absolute inset-0 z-0 pointer-events-none select-none">
                      <img 
                        src={YOUTUBE_VIDEOS[activeVideoIndex].thumbnail} 
                        alt={YOUTUBE_VIDEOS[activeVideoIndex].title} 
                        className="w-full h-full object-cover opacity-75 group-hover:scale-[1.02] transition-transform duration-[1200ms] ease-out brightness-[0.7] contrast-[1.05] grayscale-[15%]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-95" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/35" />
                      
                      {/* Technical visual blueprint crosslines representing architectural design precision */}
                      <div className="absolute inset-0 grid grid-cols-6 h-full opacity-[0.06] pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="border-r border-white h-full" />
                        ))}
                      </div>
                      <div className="absolute inset-0 grid grid-rows-6 w-full opacity-[0.06] pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="border-b border-white w-full" />
                        ))}
                      </div>
                    </div>

                    {/* TOP HEADER DETAILS (Ref 1: Star icon on left-hand corner, menu indicator on right) */}
                    <div className="relative z-10 flex items-center justify-between">
                      {/* Simulated premium logo badge */}
                      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5">
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black shadow-md shrink-0">
                          <Star className="w-3 h-3 fill-black text-black" />
                        </div>
                        <span className="font-mono text-[9px] text-white/95 uppercase tracking-widest font-black">
                          TAG08 COMMUNITY
                        </span>
                      </div>

                      {/* Video Stats/Views label or menu points mimicking Ref 1 */}
                      <span className="font-mono text-[9px] text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/30 px-3 py-1.5 rounded-full uppercase font-black tracking-widest shadow-sm">
                        {YOUTUBE_VIDEOS[activeVideoIndex].views}
                      </span>
                    </div>

                    {/* INTERACTIVE CENTER PLAY OVERLAY (Pulsating icon) */}
                    <div className="relative z-10 flex flex-col items-center justify-center py-6 sm:py-12">
                      <button 
                        onClick={() => setIsPlayingVideo(true)}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand text-black hover:bg-brand-dark flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 active:scale-95 shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.3)] hover:shadow-[0_12px_50px_rgba(var(--color-brand-secondary-rgb),0.5)] cursor-pointer relative group-next"
                      >
                        {/* Ring pulses */}
                        <span className="absolute inset-0 rounded-full bg-brand/30 animate-ping pointer-events-none" />
                        <span className="absolute -inset-2 rounded-full border border-brand/15 animate-pulse pointer-events-none" />
                        <Play className="w-7 h-7 sm:w-9 sm:h-9 text-black fill-current translate-x-0.5 ml-0.5" />
                      </button>
                      <span className="font-mono text-[9.5px] text-zinc-300 uppercase tracking-widest font-black mt-3 transition-colors group-hover:text-brand">
                        REPRODUZIR AGORA
                      </span>
                    </div>

                    {/* BOTTOM TEXT BLOCK OVERLAYS */}
                    <div className="relative z-10 space-y-3 pt-6 border-b border-white/[0.04] pb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black">
                          {YOUTUBE_VIDEOS[activeVideoIndex].category}
                        </span>
                        <span className="text-white/20 text-xs">//</span>
                        <span className="font-mono text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                          DURAÃ‡ÃƒO: {YOUTUBE_VIDEOS[activeVideoIndex].duration} MIN
                        </span>
                      </div>
                      
                      <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tighter uppercase leading-none">
                        {YOUTUBE_VIDEOS[activeVideoIndex].title}
                      </h3>
                      
                      <p className="text-zinc-300 text-xs sm:text-[13px] font-sans leading-relaxed max-w-2xl font-medium">
                        {YOUTUBE_VIDEOS[activeVideoIndex].description}
                      </p>
                    </div>

                    {/* LOWER ACCURACY WATERMARKS (Meticulously structured) */}
                    <div className="relative z-10 flex items-center justify-between pt-1">
                      <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">
                        SYS // REC_WORK_SESSION_2026
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-[8.5px] text-brand-secondary font-black bg-white/[0.02] border border-white/5 py-1 px-3 rounded-lg uppercase">
                        <span>#</span>
                        <span>{YOUTUBE_VIDEOS[activeVideoIndex].tagline}</span>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>

            {/* Right Box (lg:col-span-4): Playlist list block container mimicking Ref 2 Premium Sidebar and design cues */}
            <div className="lg:col-span-4 bg-[#0a0a0c] border border-white/5 rounded-[28px] sm:rounded-[36px] p-5 sm:p-6 lg:p-7 flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.015] to-transparent pointer-events-none" />

              <div className="space-y-4">
                {/* Sidebar Title */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-2">
                  <div className="flex flex-col text-left">
                    <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-bold">PLAYLIST EXECUTIVA</span>
                    <span className="font-display font-black text-lg text-white uppercase tracking-tight mt-1">LATEST EPISODES</span>
                  </div>
                  
                  {/* Subtle record badge */}
                  <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse shadow-[0_0_8px_var(--color-brand-secondary)]" />
                </div>

                {/* Vertical list of episodes mimicking Ref 2 sidebar cards style */}
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {YOUTUBE_VIDEOS.map((item, idx) => {
                    const isActive = idx === activeVideoIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveVideoIndex(idx);
                          setIsPlayingVideo(false);
                        }}
                        className={`w-full flex gap-3.5 p-3 rounded-2xl border transition-all text-left relative overflow-hidden group cursor-pointer ${
                          isActive
                            ? "bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)] scale-[1.01]"
                            : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10 hover:bg-white/[0.03]"
                        }`}
                      >
                        {/* Mini rounded compact image mimicking visual story in Ref 2 */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-black relative border border-white/10">
                          <img 
                            src={item.thumbnail} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/25" />
                          
                          {/* Duration Tag overlay */}
                          <span className="absolute bottom-1 right-1 font-sans text-[7.5px] bg-black/80 border border-white/10 px-1 rounded text-white font-extrabold">
                            {item.duration}
                          </span>
                        </div>

                        {/* Text summary info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 text-left">
                          <div className="space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className={`font-sans text-[8px] font-bold ${isActive ? "text-black/60" : "text-brand"}`}>
                                EPISÃ“DIO {String(idx + 1).padStart(2, '0')}
                              </span>
                              <span className={`font-sans text-[8px] ${isActive ? "text-black/60" : "text-zinc-500"}`}>
                                {item.date}
                              </span>
                            </div>
                            <h4 className={`font-display font-black text-xs uppercase tracking-tight line-clamp-2 leading-tight ${isActive ? "text-black" : "text-white"}`}>
                              {item.title}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between pt-1 font-sans text-[8.5px]">
                            <span className={isActive ? "text-black/80 font-semibold" : "text-zinc-500"}>
                              {item.views}
                            </span>
                          </div>
                        </div>

                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Subscribe Action Box directly to YouTube channel */}
              <div className="bg-[#121215] border border-white/5 rounded-2xl p-4 flex flex-col space-y-3 relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/[0.03] rounded-full blur-xl pointer-events-none" />
                
                <div className="space-y-1">
                  <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block font-bold">YOUTUBE COMUNIDADE // {contentSources.youtube === "live" ? "SINCRONIZADO" : "FALLBACK"}</span>
                  <h4 className="text-white font-semibold text-xs leading-tight">Gostaria de ver pautas sÃªniores diÃ¡rias?</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Inscreva-se no canal para receber insights prÃ¡ticos e destrinchar posicionamentos corporativos.
                  </p>
                </div>
                
                <a
                  href={TAG08_OFFICIAL_YOUTUBE_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleOutboundClick("YouTube", TAG08_OFFICIAL_YOUTUBE_URL, "home-youtube")}
                  className="group w-full flex items-center justify-between bg-red-600 hover:bg-red-700 text-white font-mono font-black text-[9.5px] uppercase tracking-wider py-3 px-4 rounded-xl shadow-lg transition-all text-center cursor-pointer select-none"
                >
                  <span className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current tracking-normal">
                      <path d="M23.498 6.163c-.272-1.022-1.074-1.826-2.097-2.099C19.558 3.5 12 3.5 12 3.5s-7.558 0-9.401.564c-1.023.273-1.825 1.077-2.097 2.099C0 8.01 0 12 0 12s0 3.99.564 5.837c.272 1.022 1.074 1.826 2.097 2.099C4.442 20.5 12 20.5 12 20.5s7.558 0 9.401-.564c1.023-.273 1.825-1.077 2.097-2.099C24 15.99 24 12 24 12s0-3.99-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Inscrever-se no canal
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7 - DIFERENCIAIS */}
      <section id="diferenciais" className="py-24 px-6 border-b border-white/[0.04] bg-charcoal-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 text-left space-y-4">
              <span className="font-mono text-xs text-brand uppercase tracking-widest font-semibold">
                Nossas Vantagens
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-gradient leading-tight">
                O que torna a TAG08 diferente?
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                NÃ£o somos apenas mais uma agÃªncia criativa barulhenta enviando layouts coloridos sem utilidade comercial. Pensamos como empresÃ¡rios e estruturamos com foco sÃªnior.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-charcoal-900/60 p-6 rounded-xl border border-white/[0.05] flex gap-4">
                <div className="text-brand font-sans text-sm font-bold">01</div>
                <div>
                  <h4 className="text-base font-semibold text-white">EstratÃ©gia antes da estÃ©tica</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-1 leading-relaxed">
                    Design bonito importa muito, mas direÃ§Ã£o comercial importa infinitamente mais. Toda publicaÃ§Ã£o, cÃ³digo ou texto precisa possuir uma funÃ§Ã£o bem delimitada.
                  </p>
                </div>
              </div>

              <div className="bg-charcoal-900/60 p-6 rounded-xl border border-white/[0.05] flex gap-4">
                <div className="text-brand font-sans text-sm font-bold">02</div>
                <div>
                  <h4 className="text-base font-semibold text-white">Dados sem perder o humano</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-1 leading-relaxed">
                    Analisamos dados com profundidade cientÃ­fica, porÃ©m compreendemos e respeitamos a cultura organizacional, a maturidade de entrega e os tempos do nosso parceiro.
                  </p>
                </div>
              </div>

              <div className="bg-charcoal-900/60 p-6 rounded-xl border border-white/[0.05] flex gap-4">
                <div className="text-brand font-sans text-sm font-bold">03</div>
                <div>
                  <h4 className="text-base font-semibold text-white">ExecuÃ§Ã£o com mÃ©todo</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-1 leading-relaxed">
                    Operamos atravÃ©s de cronogramas integrados, prazos previsÃ­veis de recebimento, matrizes de aprovaÃ§Ã£o transparentes e suporte Ã¡gil.
                  </p>
                </div>
              </div>

              <div className="bg-charcoal-900/60 p-6 rounded-xl border border-white/[0.05] flex gap-4">
                <div className="text-brand font-sans text-sm font-bold">04</div>
                <div>
                  <h4 className="text-base font-semibold text-white">VisÃ£o realmente multidisciplinar</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-1 leading-relaxed">
                    Conectamos habilidades de marketing estratÃ©gico, design visual requintado, redaÃ§Ã£o autoral, tecnologia web e engenharia de processos em uma Ãºnica assessoria.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 - SOBRE A TAG08 */}
      <section id="sobre-simples" className="py-24 px-6 border-b border-white/[0.04] bg-charcoal-900/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-brand/5 blur-3xl rounded-full" />
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600"
              alt="ReuniÃ£o estratÃ©gica de equipe TAG08"
              className="rounded-2xl border border-white/[0.08] shadow-2xl relative z-10 w-full"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="lg:col-span-6 text-left space-y-6">
            <span className="font-mono text-xs text-brand uppercase tracking-widest font-semibold">
              Institucional
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-gradient">
              Uma agÃªncia para novos tempos.
            </h2>
            <div className="text-zinc-300 text-sm sm:text-base space-y-4 leading-relaxed font-sans">
              <p>
                A TAG08 nasceu para reconectar marcas e profissionais ao verdadeiro valor de se posicionar no digital. Em um mercado cheio de ruÃ­dos, fÃ³rmulas prontas e excesso de informaÃ§Ã£o, ajudamos negÃ³cios a encontrar clareza, construir presenÃ§a com propÃ³sito e crescer com mais consistÃªncia.
              </p>
              <p className="text-zinc-400">
                Somos um ecossistema estratÃ©gico que une pensamento, processo e performance. Aqui, conteÃºdo nÃ£o Ã© arte solta na rede. Ã‰ parte de uma construÃ§Ã£o maior.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => handleLinkClick("/sobre")}
                className="bg-brand text-black font-semibold text-xs font-sans px-6 py-3.5 rounded-lg hover:bg-brand-dark transition-all duration-200"
              >
                ConheÃ§a Nossa HistÃ³ria
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFÃ“LIO DE TESTEMUNHOS & CASOS DE CLIENTES (UNIFICADO - O CLIENTE DICTA A REVOLUÃ‡ÃƒO) */}
      <section id="portfolio-marcas" className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
        
        {/* Editorial magazine background grid lines */}
        <div className="absolute inset-0 grid grid-cols-4 sm:grid-cols-8 h-full opacity-5 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border-r border-white h-full" />
          ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-4 sm:grid-rows-8 w-full opacity-5 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border-b border-white w-full" />
          ))}
        </div>

        {/* Ambient backlighting to replicate high-fashion look */}
        <div className="absolute top-1/4 -left-32 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-[450px] h-[450px] bg-red-500/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          {/* Main Section Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/[0.08]">
            <div className="text-left space-y-3">
              <span className="font-mono text-xs text-brand uppercase tracking-widest font-extrabold block">
                CASES & POSICIONAMENTO DIGITAL
              </span>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.9] tracking-tighter uppercase">
                O CLIENTE DICTA <br />
                A REVOLUÃ‡ÃƒO_
              </h2>
            </div>

            {/* Direct Pinterest Board elegant linking */}
            <a 
              href="https://br.pinterest.com/agencia_tag08/identidade-visual/"
              target="_blank"
              rel="noreferrer"
              onClick={() => handleOutboundClick("Pinterest", "https://br.pinterest.com/agencia_tag08/identidade-visual/", "home-pinterest")}
              className="inline-flex items-center gap-4 bg-charcoal-900 hover:bg-white/[0.04] border border-white/10 px-5 py-3 rounded-2xl transition-all duration-300 self-start md:self-end group shrink-0 shadow-lg hover:border-brand/35"
            >
              <div className="w-10 h-10 rounded-full bg-[#bd081c]/10 flex items-center justify-center text-[#bd081c] group-hover:bg-[#bd081c] group-hover:text-white transition-all shadow-md">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.4 7.63 11.13-.1-.95-.2-2.4.04-3.43.22-.93 1.4-5.93 1.4-5.93s-.36-.72-.36-1.77c0-1.66.96-2.9 2.17-2.9 1.02 0 1.51.77 1.51 1.68 0 1.03-.65 2.56-.99 3.98-.28 1.18.6 2.15 1.76 2.15 2.11 0 3.73-2.22 3.73-5.43 0-2.84-2.04-4.83-4.96-4.83-3.38 0-5.37 2.54-5.37 5.16 0 1.02.4 2.12.89 2.72.1.12.11.23.08.35-.1.38-.3.1.25-.4l-.08-.34c-.11-.47-.79-3.23-.79-3.49 0-.28-.1-.52-.33-.65-1.57-.92-2.53-3.04-2.53-4.9 0-3.98 2.9-7.64 8.35-7.64 4.38 0 7.8 3.13 7.8 7.3 0 4.36-2.75 7.87-6.57 7.87-1.28 0-2.49-.67-2.9-1.45 0 0-.64 2.43-.79 3.03-.29 1.1-.85 2.22-1.32 2.99 1.12.35 2.3.54 3.52.54 6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
                </svg>
              </div>
              <div className="flex flex-col text-left font-sans">
                <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-bold">PortfÃ³lio Original</span>
                <span className="text-white text-xs font-semibold group-hover:text-brand transition-colors flex items-center gap-1.5 font-sans">
                  CONCEITOS NO PINTEREST <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </a>
          </div>

          {/* Asymmetric Split-Screen Bento-Grid Layout for Cases & Testimonials */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
            
            {/* Left Hand: Sleek list of Cases with detailed info and indicators */}
            <div className="lg:col-span-4 flex flex-col justify-start space-y-4">
              <div className="border-b border-white/[0.05] pb-4 mb-2">
                <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black block">
                  CRAFTSMANSHIP FILE // SELECTOR
                </span>
                <span className="font-sans text-[11px] text-zinc-500 uppercase tracking-widest font-bold block mt-1">
                  Selecione pauta editorial e marque a diferenÃ§a executiva:
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {CLIENT_CASES.map((cc, index) => {
                  const isActive = index === activeSlide;
                  return (
                    <button
                      key={cc.id}
                      onClick={() => setActiveSlide(index)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                        isActive
                          ? "bg-brand text-black border-brand shadow-[0_12px_30px_rgba(var(--color-brand-rgb),0.14)] scale-[1.02]"
                          : "bg-charcoal-900/40 border-white/[0.04] text-zinc-400 hover:text-white hover:border-white/10 hover:bg-charcoal-900/60"
                      }`}
                    >
                      {/* Active sidebar highlight accent */}
                      {isActive && (
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-black" />
                      )}

                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-[10px] font-black uppercase ${isActive ? "text-black/60" : "text-brand"}`}>
                          {String(index + 1).padStart(2, '0')}.
                        </span>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-display font-black text-sm uppercase tracking-tight truncate ${isActive ? "text-black" : "text-white"}`}>
                            {cc.name}
                          </h4>
                          <p className={`font-sans text-[9px] truncate ${isActive ? "text-black/80" : "text-zinc-500"}`}>
                            {cc.handle}
                          </p>
                        </div>

                        <ArrowRight className={`w-3.5 h-3.5 transition-transform shrink-0 ${
                          isActive ? "text-black rotate-[-45deg] stroke-[2.5]" : "text-zinc-500 group-hover:translate-x-1"
                        }`} />
                      </div>

                      {/* Small inline tags shown if not active, or in brand styling if active */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {cc.categoryTags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className={`font-mono text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ${
                              isActive 
                              ? "bg-black/10 border border-black/10 text-black/90" 
                                : "bg-white/[0.02] border border-white/[0.05] text-zinc-500"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Direct active statistics mini badge */}
              <div className="hidden lg:flex items-center justify-between bg-charcoal-900/35 border border-white/[0.05] p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                  <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-extrabold">
                    MÃXIMA RETENÃ‡ÃƒO VISUAL
                  </span>
                </div>
                <span className="font-sans text-[8.5px] text-brand font-bold bg-brand/5 border border-brand/10 px-1.5 rounded">
                  DIREÃ‡ÃƒO DE FLUXO TOTAL
                </span>
              </div>
            </div>

            {/* Right Hand: Immersive, beautifully styled Showcase Display */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, scale: 0.98, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -15 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="relative w-full rounded-[32px] sm:rounded-[40px] overflow-hidden aspect-[4/5] sm:aspect-[16/10] md:aspect-[1.65] bg-black border border-white/[0.08] shadow-[0_35px_80px_rgba(0,0,0,0.85)] flex flex-col justify-between p-6 sm:p-10 text-left group h-full"
                >
                  
                  {/* Dynamic moody background image with custom style lighting */}
                  <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <img 
                      src={CLIENT_CASES[activeSlide].backgroundImg} 
                      alt={CLIENT_CASES[activeSlide].name} 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-[1.03] transition-transform duration-1000 ease-out brightness-[0.75] contrast-[1.1] grayscale-[10%]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-95" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-transparent to-black/35" />
                    
                    {/* Horizontal and Vertical guidelines representing technical branding blueprint craftsmanship */}
                    <div className="absolute inset-0 grid grid-cols-4 sm:grid-cols-6 h-full opacity-10">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="border-r border-white/30 h-full" />
                      ))}
                    </div>
                    <div className="absolute inset-0 grid grid-rows-4 sm:grid-rows-6 w-full opacity-10">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="border-b border-white/30 w-full" />
                      ))}
                    </div>
                  </div>

                  {/* TOP HEADER LAYER: Editorial category tags & Rotating Neon Sunburst */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {CLIENT_CASES[activeSlide].categoryTags.map((tag) => (
                        <span 
                          key={tag} 
                          className="font-mono text-[9px] tracking-widest text-brand border border-brand/30 px-3 py-1 rounded-full uppercase font-bold bg-black/60 backdrop-blur-sm shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Star Logo under ambient glow spinning continuous */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 mix-blend-screen hover:scale-[1.1] transition-transform duration-500 ease-out shrink-0">
                      <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full text-brand fill-current animate-[spin_35s_linear_infinite] drop-shadow-[0_0_20px_rgba(var(--color-brand-rgb),0.55)]"
                      >
                        <g transform="translate(50, 50)">
                          {[...Array(8)].map((_, index) => (
                            <rect
                              key={index}
                              x="-6"
                              y="-45"
                              width="12"
                              height="90"
                              rx="6"
                              className="fill-brand"
                              transform={`rotate(${index * 45})`}
                            />
                          ))}
                        </g>
                      </svg>
                      <div className="absolute inset-0 bg-brand/25 rounded-full blur-xl scale-75 animate-pulse" />
                    </div>
                  </div>

                  {/* MIDDLE QUOTE & POSITIONING HEADER (Using layered curved details cards) */}
                  <div className="relative z-10 space-y-4 max-w-2xl mt-auto pt-4">
                    <span className="font-mono text-[10px] text-brand tracking-widest uppercase font-extrabold block">
                      {CLIENT_CASES[activeSlide].caseName}
                    </span>
                    
                    <h3 className="font-display font-black text-2.5xl sm:text-4xl md:text-[40px] text-brand leading-[0.95] tracking-tighter uppercase mb-2">
                      {CLIENT_CASES[activeSlide].tagline}
                    </h3>

                    <div className="bg-charcoal-950/80 backdrop-blur-md border border-white/10 p-5 rounded-2xl relative shadow-2xl">
                      <p className="text-white text-sm sm:text-base font-sans font-medium tracking-tight leading-relaxed italic block">
                        â€œ{CLIENT_CASES[activeSlide].quote}â€
                      </p>
                    </div>
                  </div>

                  {/* BOTTOM PROFILE WRAPPER MATCHING USER MOCKUP */}
                  <div className="relative z-10 flex items-center justify-between border-t border-white/[0.08] pt-4 mt-5">
                    <div className="font-mono text-[9px] text-white/40 tracking-widest font-extrabold uppercase hidden sm:block">
                      VERIFICADO // CO-PILOTO TAG08
                    </div>

                    {/* Profile card absolute design accuracy */}
                    <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-full py-1.5 pl-2 pr-4 border border-white/10 shadow-lg ml-auto">
                      <img 
                        src={CLIENT_CASES[activeSlide].avatar} 
                        alt={CLIENT_CASES[activeSlide].name} 
                        className="w-8 h-8 rounded-full object-cover border-2 border-brand"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col text-left">
                        <span className="text-white text-[11px] font-bold leading-tight uppercase font-sans">
                          {CLIENT_CASES[activeSlide].name}
                        </span>
                        <span className="text-brand font-mono text-[8.5px] tracking-wider font-semibold">
                          {CLIENT_CASES[activeSlide].handle}
                        </span>
                      </div>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 8.5 - GOOGLE MY BUSINESS REVIEWS */}
      <section id="avaliacoes-gmb" className="py-24 px-6 border-b border-white/[0.04] bg-charcoal-900/20 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 border-b border-white/[0.05] pb-8">
            <div className="space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/10 bg-brand/5 font-mono text-[9px] uppercase tracking-widest text-brand-secondary font-black">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" /> CREDIBILIDADE // SOCIAL PROOF
              </div>
              
              <h2 className="font-display font-black text-3xl sm:text-4xl text-gradient uppercase leading-none tracking-tighter">
                Quem decide confia: 5.0 estrelas no Google My Business
              </h2>
              
              <p className="text-zinc-400 text-xs sm:text-sm font-sans max-w-2xl">
                Nossos clientes avaliam a TAG08 com nota mÃ¡xima. Depoimentos de marcas e profissionais reais que consolidaram direÃ§Ã£o estratÃ©gica, processos blindados e marketing de alta conversÃ£o.
              </p>
            </div>
            
            {/* Google Rating Main Counter Card */}
            <div className="bg-charcoal-900 border border-white/[0.08] rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg text-left">
              <div className="w-12 h-12 bg-white/[0.03] rounded-xl flex items-center justify-center border border-white/[0.05]">
                {/* Clean Custom Styled Vector Google G logo */}
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-brand-secondary fill-current">
                  <path d="M12.24 10.285V13.4h6.887c-.275 1.564-1.852 4.579-6.887 4.579-4.343 0-7.884-3.593-7.884-8s3.541-8 7.884-8c2.464 0 4.114 1.029 5.057 1.93l2.457-2.365C18.114 1.343 15.371 0 12.24 0c-6.63 0-12 5.37-12 12s5.37 12 12 12c6.914 0 11.514-4.829 11.514-11.714 0-.785-.086-1.385-.185-1.999H12.24z"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-display font-black text-2xl text-white tracking-tight leading-none">5.0</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-brand-secondary text-brand-secondary" />
                    ))}
                  </div>
                </div>
                <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">
                  Google AvaliaÃ§Ãµes â€¢ 5.0 baseada em 48 avaliaÃ§Ãµes
                </p>
              </div>
            </div>
          </div>

          {/* Interactive GMB Review Presentation */}
          <div 
            onMouseEnter={() => setIsHoveringGmb(true)}
            onMouseLeave={() => setIsHoveringGmb(false)}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4"
          >
            {/* Left side: Pure Portrait Gallery Column with premium physical carousel wheel tracking */}
            <div className="lg:col-span-3 w-full overflow-hidden h-[170px] sm:h-[195px] lg:h-[500px] relative flex items-center lg:items-start select-none">
              <motion.div
                animate={isLargeScreen 
                  ? { y: -activeReview * (148 + 16), x: 0 } 
                  : { x: typeof window !== "undefined" && window.innerWidth >= 640 ? -activeReview * (98 + 16) : -activeReview * (85 + 16), y: 0 }
                }
                transition={{ type: "spring", stiffness: 140, damping: 22 }}
                className="flex flex-row lg:flex-col gap-4 absolute left-4 sm:left-6 lg:left-0 lg:top-0 h-[140px] sm:h-[160px] lg:h-auto items-center lg:items-center w-max lg:w-full py-2"
              >
                {GMB_REVIEWS.map((rev, index) => {
                  const isActive = index === activeReview;
                  return (
                    <div
                      key={index}
                      onClick={() => setActiveReview(index)}
                      className={`shrink-0 cursor-pointer transition-all duration-500 overflow-hidden relative rounded-2xl sm:rounded-[22px] flex items-center justify-center ${
                        isActive
                          ? "w-[105px] h-[140px] sm:w-[120px] sm:h-[160px] lg:w-[135px] lg:h-[180px] border-2 border-brand-secondary shadow-[0_4px_30px_rgba(var(--color-brand-secondary-rgb),0.2)] scale-105 z-10 opacity-100 grayscale-0"
                          : "w-[85px] h-[115px] sm:w-[98px] sm:h-[132px] lg:w-[110px] lg:h-[148px] border border-white/[0.06] opacity-35 grayscale hover:opacity-75 hover:grayscale-0 scale-95 hover:scale-98"
                      }`}
                    >
                      {/* Portrait headshot image fills container */}
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        className="w-full h-full object-cover transition-all duration-700 pointer-events-none"
                        referrerPolicy="no-referrer"
                      />

                      {/* Active highlighted subtle indicator pill in corner */}
                      {isActive && (
                        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-secondary shadow-[0_0_10px_var(--color-brand-secondary)]" />
                      )}
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Right side: Selected Active Detail Presentation Card */}
            <div className="lg:col-span-9 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReview}
                  initial={{ opacity: 0, x: 20, scale: 0.99 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.99 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="bg-charcoal-900/90 border border-white/[0.06] p-6 sm:p-10 lg:p-12 rounded-[28px] sm:rounded-[36px] relative overflow-hidden text-left shadow-2xl flex flex-col justify-between min-h-[380px] w-full group/card"
                >
                  {/* Absolute giant background quote marks mimicking the image mockup exactly */}
                  <span className="font-serif text-[180px] sm:text-[230px] text-brand-secondary/[0.03] absolute right-6 sm:right-10 -top-8 sm:-top-12 leading-none select-none pointer-events-none font-black italic">
                    â€œ
                  </span>

                  <div className="space-y-6 relative z-10 flex-1 flex flex-col justify-center">
                    {/* High-impact tagline summary in elegant sentence case as shown in the mockup */}
                    <h3 className="font-display font-medium text-lg sm:text-2xl lg:text-[28px] text-white leading-normal tracking-tight max-w-[95%]">
                      {GMB_REVIEWS[activeReview].tagline}
                    </h3>

                    {/* Supporting comprehensive details text (the body of the review) */}
                    <p className="text-zinc-400 text-xs sm:text-sm md:text-[15px] leading-relaxed font-sans font-normal">
                      {GMB_REVIEWS[activeReview].text}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-dashed border-white/[0.08] relative z-10">
                    {/* Bottom row displaying Author profile and 5-stars aligned exactly with mockup */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={GMB_REVIEWS[activeReview].avatar}
                          alt={GMB_REVIEWS[activeReview].name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-brand-secondary"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-left font-sans">
                          <h4 className="text-white font-display font-semibold text-sm">
                            {GMB_REVIEWS[activeReview].name}
                          </h4>
                          <p className="text-zinc-500 font-sans text-xs mt-0.5">
                            {GMB_REVIEWS[activeReview].role} â€¢ {GMB_REVIEWS[activeReview].time}
                          </p>
                        </div>
                      </div>

                      {/* Google Verified 5-Star counter aligned on the right of the dashed border equivalent */}
                      <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-brand-secondary text-brand-secondary" />
                          ))}
                        </div>
                        <span className="font-sans text-[7.5px] uppercase tracking-widest text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2 py-0.5 rounded">
                          {GMB_REVIEWS[activeReview].category} // GOOGLE VERIFIED
                        </span>
                      </div>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* GMB Call-To-Action Link Bar */}
          <div className="mt-12 p-5 bg-charcoal-900 border border-white/[0.05] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left select-none">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse shrink-0" />
              <p className="text-xs text-zinc-300 font-sans">
                Nossa reputaÃ§Ã£o Ã© 100% transparente. {contentSources.googleBusiness === "live" ? "As avaliaÃ§Ãµes estÃ£o sincronizadas com o perfil oficial." : "Se o sync ainda nÃ£o estiver ativo, a seÃ§Ã£o usa curadoria editorial."}
              </p>
            </div>
            <a
              href={TAG08_OFFICIAL_CONTACT.googleBusinessUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => handleOutboundClick("Google Meu Negócio", TAG08_OFFICIAL_CONTACT.googleBusinessUrl, "home-gmb-business-profile")}
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-brand hover:text-black border border-white/10 hover:border-brand text-[10px] text-white font-mono font-bold uppercase tracking-widest py-2.5 px-5 rounded-xl transition-all duration-300 shrink-0 cursor-pointer"
            >
              <span>ABRIR PERFIL NO GOOGLE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </section>

      {/* SECTION 9 - SEGURANÃ‡A OPERACIONAL & DESIGNS HIGH-END (MATCHING USER REFERENCE DESIGN) */}
      <section id="prova" className="py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        {/* Luminous Container mimicking the uploaded design mockup */}
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          
          {/* Internal subtle background paper/dot layout */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          {/* Left Column: Ultra-stylish Portrait layout adorned with design overlays just like "designbr" in reference */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[520px]">
            {/* Dark background silhouette framing to lift the image */}
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden" />
            
            <img 
              src={creativeLeaderPortrait} 
              alt="TAG08 Creative Director" 
              className="absolute inset-0 w-full h-full object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[15%] transition-all duration-500 hover:scale-105"
            />
            
            {/* Styled aesthetic watermark overlays mimicking reference image */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  OPERATIONAL CORE
                </span>
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  TAG08.v3
                </span>
              </div>

              {/* Seamlessly repeated design style text overlays to replicate the picture vibes perfectly */}
              <div className="space-y-1.5 opacity-30 select-none">
                <div className="font-display font-extrabold text-[1.8rem] text-white/40 tracking-widest leading-none uppercase select-none">
                  design_tag08
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                  estratÃ©gia360_
                </div>
              </div>

              <div className="flex justify-between items-end">
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  LATENCY: 12MS
                </span>
                <span className="font-mono text-[9px] text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  SÃŠNIOR SECURITY
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Typography, Action Prompt & Overlaid Curved Card */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 text-left h-full relative z-10 lg:pl-4">
            
            <div className="space-y-4">
              {/* Upper social network link */}
              <div className="inline-flex items-center gap-2 text-black font-semibold">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/90">
                  SISTEMA DE TRABALHO
                </span>
              </div>

              {/* Massive Bold Heading mirroring reference */}
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black leading-[0.9] tracking-tighter uppercase">
                DIREÃ‡ÃƒO CLARA <br />
                COM IMPACTO REAL
              </h2>

              {/* Description Paragraph with high contrast block typeface layout */}
              <p className="text-black/85 text-[11px] sm:text-xs max-w-lg leading-relaxed font-sans font-extrabold uppercase">
                Posicionamento, clareza e execuÃ§Ã£o para uma marca que precisa vender com mais direÃ§Ã£o.
              </p>
            </div>

            {/* Overlaid Premium Curved Dark Action Card modeled exactly off the uploaded picture */}
            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 max-w-md relative overflow-hidden text-left">
              {/* Glowing decorative indicator circle */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />

              {/* Row 1: Green circular arrow button block */}
              <div className="flex gap-4 items-start select-none">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black shrink-0 shadow-lg shadow-brand/10 hover:scale-105 transition-transform duration-200">
                  <ArrowUpRight className="w-5 h-5 rotate-45 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-[8px] text-brand uppercase tracking-wider font-extrabold block">
                    PADRÃƒO SÃŠNIOR
                  </span>
                  <p className="text-white text-xs leading-snug font-sans font-semibold">
                    Entregas consistentes, Ãºteis e coerentes com a marca.
                  </p>
                </div>
              </div>

              {/* DUAL CLIENT CONNECTION CHANNELS (BR & INT) */}
              <div className="space-y-3">
                <a 
                  href={buildBrazilWhatsAppUrl("OlÃ¡,%20gostaria%20de%20solicitar%20um%20diagnÃ³stico%20de%20posicionamento%20com%20a%20TAG08")}
              target="_blank"
              rel="noreferrer"
              onClick={() => handleOutboundClick("WhatsApp", buildBrazilWhatsAppUrl("OlÃƒÂ¡,%20gostaria%20de%20solicitar%20um%20diagnÃƒÂ³stico%20de%20posicionamento%20com%20a%20TAG08"), "home-diagnosis-br")}
              className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-black transition-all duration-200">
                        <span className="text-[9px] font-mono font-black tracking-tight text-brand group-hover:text-black">BR</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase font-black tracking-wider leading-none">
                          DIRETO NO WHATSAPP
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
                  href={buildInternationalWhatsAppUrl("Hello,%20I%20would%2520like%2520to%2520schedule%2520a%2520private%2520systems%2520and%2520marketing%2520positioning%2520diagnosis%2520from%2520TAG08")}
              target="_blank"
              rel="noreferrer"
              onClick={() => handleOutboundClick("WhatsApp", buildInternationalWhatsAppUrl("Hello,%20I%20would%2520like%2520to%2520schedule%2520a%2520private%2520systems%2520and%2520marketing%2520positioning%2520diagnosis%2520from%2520TAG08"), "home-diagnosis-int")}
              className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary shrink-0 group-hover:bg-brand-secondary group-hover:text-black transition-all duration-200">
                        <span className="text-[9px] font-mono font-black tracking-tight text-brand-secondary group-hover:text-black">INT</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase font-black tracking-wider leading-none">
                          INTERNATIONAL DIRECT
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

              {/* Row 3: Logo label alignment with live glowing green badge indicator */}
              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                  <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest font-extrabold">
                    TAG08
                  </span>
                </div>
                <span className="font-sans text-[8.5px] text-brand font-bold bg-brand/10 border border-brand/20 px-2 rounded">
                  OPERAÃ‡ÃƒO ATIVA
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>



      {/* SECTION 10 - FAQ & SISTEMA OPERACIONAL (REDESENHADO INSPIRADO NO ACORDO VISUAL ENVIADO PELO CLIENTE) */}
      <section id="faq-section" className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
        {/* Subtle luminous background aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[40px] bg-charcoal-950 border border-white/[0.04] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl">
          {/* Subtle grid texture overlay inside dark panel */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
            
            {/* Left Column: Title & FAQ Buttons list */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-4">
                {/* Visual upper badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono">
                  FAQ
                </div>
                
                {/* Section titles */}
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter uppercase">
                  DÃšVIDAS &amp; <br />
                  DECISÃƒO OPERACIONAL
                </h2>
                
                <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans max-w-sm">
                  Entenda como a TAG08 organiza design, conteÃºdo e operaÃ§Ã£o para reduzir ruÃ­do e acelerar decisÃ£o.
                </p>
              </div>

              {/* Vertical list of Accordion Triggers */}
              <div className="space-y-3 pt-4">
                {([
                  { id: 0, title: "ONBOARDING & SETUP" },
                  { id: 1, title: "PROPRIEDADE INTELECTUAL" },
                  { id: 2, title: "FIDELIDADE E MULTAS" },
                  { id: 3, title: "RITUAL DE MÃ‰TRICAS" }
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

            {/* Middle Column: Cover portrait with coiled text & the answer block superimposed */}
            <div className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-white/[0.04] bg-[#0c0c0e]">
              {/* Cover Image backdrop */}
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                alt="TAG08 Office Workspace"
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
              />

              {/* Styled neon line swirling overlay inspired by the ribbon thread on mockup */}
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>

              {/* Watermark in portrait */}
              <div className="absolute top-6 left-6 z-10 pointer-events-none font-mono text-[8px] text-white/20 uppercase tracking-widest leading-none">
                SYS // OPERATIONS_CORE
              </div>

              {/* Dynamic Answer panel floating bottom-aligned inside the picture card */}
              <div className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left">
                <span className="font-mono text-[8.5px] text-brand uppercase tracking-widest font-black block">
                  {([
                    "ONBOARDING & SETUP",
                    "PROPRIEDADE INTELECTUAL",
                    "FIDELIDADE E PRAZOS",
                    "discussÃµes e prestaÃ§Ã£o de contas"
                  ])[activeFaq]}
                </span>
                
                <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {([
                    "Como funciona a transiÃ§Ã£o inicial de pauta?",
                    "A titularidade das peÃ§as criadas pertence a quem?",
                    "A parceria conta com perÃ­odo obrigatÃ³rio ou multa?",
                    "Como ocorrem as discussÃµes operacionais diÃ¡rias?"
                  ])[activeFaq]}
                </h4>
                
                <p className="text-zinc-300 text-xs sm:text-[12.5px] leading-relaxed font-sans font-medium">
                  {([
                    "Nossa implantaÃ§Ã£o dura atÃ© 7 dias Ãºteis. Iniciamos com um onboarding cirÃºrgico para registrar as diretrizes do tom de voz e diretrizes de autoridade corporativa, planejando as pautas estÃ©ticas e organizando os marcos editoriais dos primeiros 15 dias sem atritos.",
                    "Todos os direitos de autoria de fotos orientadas, roteiros de alta retenÃ§Ã£o, modelos de design refinados e arquivos finais editÃ¡veis do Figma pertencem inteiramente Ã  sua empresa de forma limpa e transparente.",
                    "Nossos contratos operam sob flexibilidade intelectual. NÃ£o impomos fidelidades longas ou taxas de quebra abusivas â€” confiamos na constÃ¢ncia das mÃ©tricas corporativas. Exigimos apenas aviso prÃ©vio convencional de 30 dias por questÃµes de agendamento de pauta.",
                    "Disponibilizamos relatÃ³rios mensais claros contendo trÃ¡fego com alta intenÃ§Ã£o e mÃ©tricas de prestÃ­gio. Paralelamente, mantemos reuniÃµes recorrentes e mantemos um grupo de WhatsApp exclusivo ativo de prioridade mÃ¡xima para discussÃµes cotidianas."
                  ])[activeFaq]}
                </p>
              </div>
            </div>

            {/* Right Column: Mini auxiliary action cards */}
            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              {/* Card 1: Dark gray background elegant option panel */}
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-bold">PROPOSTA DE VALOR</span>
                  <h4 className="text-white font-semibold text-sm leading-snug">Como agimos de forma organizada?</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    Eliminamos planilhas confusas e ruÃ­dos de agÃªncias convencionais. Conduzimos reuniÃµes enxutas e focadas.
                  </p>
                </div>
                <button
                  onClick={() => handleLinkClick("/servicos")}
                  className="group flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5"
                >
                  <span>Ver ServiÃ§os</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* Card 2: Bright Neon / Brand color block */}
              <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-black/60 uppercase tracking-widest block font-extrabold">FALE COM O DIRETOR</span>
                  <h4 className="text-black font-black text-sm uppercase leading-tight tracking-tight">Quer desenhar uma estratÃ©gia sob medida?</h4>
                  <p className="text-black/85 text-[11.5px] font-semibold leading-relaxed font-mono">
                    Fale diretamente com os tomadores de decisÃ£o da TAG08 via WhatsApp para avaliar a viabilidade de alocaÃ§Ã£o de equipe.
                  </p>
                </div>
                <a
                  href={buildBrazilWhatsAppUrl("OlÃ¡,%20gostaria%20de%20consultar%20viabilidade%20estratÃ©gica%20especializada%20para%20minha%20marca!")}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleOutboundClick("WhatsApp", buildBrazilWhatsAppUrl("OlÃƒÂ¡,%20gostaria%20de%20consultar%20viabilidade%20estratÃƒÂ©gica%20especializada%20para%20minha%20marca!"), "home-offer-whatsapp")}
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
    </div>
  );
}





