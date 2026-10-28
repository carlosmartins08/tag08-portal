import React, { useState, useEffect } from "react";
import { ArrowUpRight, Check, CheckCircle2, TrendingUp, Cpu, Sparkles, Award, Shield, UserCheck, Play, HelpCircle, ArrowRight, MessageSquare, X, Star, Layers } from "lucide-react";
import { ArrowNarrowRightIcon } from "../../../components/icons/ItsHoverIcons";
import Link from "next/link";
import Image from "next/image";
import { SERVICES, PLANS } from "../../../data";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { TAG08_OFFICIAL_CONTACT, TAG08_OFFICIAL_YOUTUBE_URL, buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl } from "../../../config/siteNetwork";
import { getVideoDescriptionPreview, type OfficialContentApiResponse, type OfficialGoogleReview, type OfficialYouTubeVideo } from "../../../lib/officialContent";
import { trackOutboundClick, trackVideoEvent } from "../../../lib/analytics";
import { activateOnKeyboard } from "../../../lib/keyboard";
import { COOKIE_CONSENT_EVENT, grantMarketingConsent, readCookiePreferences, type CookiePreferences } from "../../../lib/cookieConsent";
import { getLocalizedPath, type RouteLocale } from "../../../config/routeRegistry";
import { externalContentCopy } from "../../../i18n/externalContent";
import { HOME_PILOT_COPY, type HomeDiagnosticDiagramCopy } from "../../../i18n/homeCopy";
import HeroEditorialStage from "../../../components/HeroEditorialStage";
import HomeMethodSection from "./HomeMethodSection";
import { Suspense, lazy } from "react";
import heroTag08StrategyStage from "../../../assets/images/hero_tag08_strategy-stage.webp";
import creativeLeaderPortrait from "../../../assets/images/creative_leader_portrait_1780449653164.jpg";
import moodyClientPortrait from "../../../assets/images/moody_client_portrait_1780449811793.jpg";
import clientAlanRocha from "../../../assets/images/client_alan_rocha_1780449828496.jpg";
import { getEvidenceVisibilityMode, getVisibleEvidence } from "../../../content/publicEvidence";
import { EvidenceReviewBadge } from "../../../components/ContentReview";

const DiagnosticDiagram = lazy(() => import("../../../components/DiagnosticDiagram"));

const CLIENT_CASES = [
  {
    id: "alan-rocha",
    name: "Alan Rocha",
    handle: "@alanrochap",
    categoryTags: ["DESIGN", "SOCIAL MEDIA", "BRANDING"],
    tagline: "A ÚNICA REAÇÃO FOI PENSAR:",
    quote: "Parece que fui dirigida por alguém que me conhece de verdade. Que entende meu estilo, minha energia e o que quero mostrar.",
    avatar: clientAlanRocha.src,
    backgroundImg: moodyClientPortrait.src,
    colors: ["var(--color-brand)", "#111111"],
    caseName: "CASE DE POSICIONAMENTO — 2025"
  },
  {
    id: "le-visage",
    name: "Clínica Le Visage",
    handle: "@clinicalevisage",
    categoryTags: ["ESTÉTICA", "LUXURY SPA", "IDENTIDADE"],
    tagline: "SOPRO DE SOFISTICAÇÃO E ARTE:",
    quote: "A TAG08 capturou o refinamento dermoestético com absoluto primor. Nosso novo visual personifica o acolhimento elegante e o requinte que nossos pacientes exigem.",
    avatar: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=200",
    backgroundImg: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1200",
    colors: ["var(--color-brand)", "#111111"],
    caseName: "ESTÉTICA DE LUXO — 2024"
  },
  {
    id: "luciana-gadelha",
    name: "Luciana Gadelha",
    handle: "@dra.lucianagadelha",
    categoryTags: ["MEDICINE", "ORAL ART", "BRANDING"],
    tagline: "TRANSMITINDO A ARTE DO SORRISO:",
    quote: "O branding desenvolvido trouxe a sofisticação exata do nosso trabalho clínico. Elevou nossa comunicação ao patamar de grife, gerando desejo imediato na nossa região.",
    avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200",
    backgroundImg: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=1200",
    colors: ["var(--color-brand)", "#111111"],
    caseName: "ODONTOLOGIA HIGH-END — 2024"
  },
  {
    id: "doctor-play",
    name: "Doctor Play",
    handle: "@doctorplay.br",
    categoryTags: ["MEDTECH", "STREAMING", "SISTEMA"],
    tagline: "CONTEÚDO MÉDICO REVOLUCIONADO:",
    quote: "Unimos entretenimento do streaming de alta qualidade com educação técnica em saúde. O design e posicionamento que a equipe estruturou nos destaca hoje como uma plataforma inovadora de extrema confiança.",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
    backgroundImg: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200",
    colors: ["var(--color-brand)", "#111111"],
    caseName: "PLATAFORMA STREAM — 2025"
  },
  {
    id: "legal-lab",
    name: "Legal Lab",
    handle: "@legallab.law",
    categoryTags: ["LAW TECH", "CORPORATIVO", "MINIMALISMO"],
    tagline: "DIREITO & INOVAÇÃO PRECISA:",
    quote: "Unindo a seriedade jurídica ao design de precisão digital hexagonal. Uma transição visual impecável que reposicionou nossa marca perante grandes corporações.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    backgroundImg: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1200",
    colors: ["var(--color-brand)", "#111111"],
    caseName: "LAW TECH CONCEITO — 2025"
  },
  {
    id: "squalis",
    name: "Squalis Educação",
    handle: "@squaliseducacao",
    categoryTags: ["ACADEMIA", "PROCESSOS", "TECNOLOGIA"],
    tagline: "PERFORMANCE DE SINALIZAÇÃO:",
    quote: "O redesenho integral do ecossistema Squalis facilitou não apenas as vendas nos canais de captação de alunos, mas elevou incrivelmente o valor de mercado percebido pelos tomadores de decisão.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    backgroundImg: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
    colors: ["var(--color-brand)", "#111111"],
    caseName: "ACADEMIA CORPORATIVA — 2024"
  }
];

const YOUTUBE_VIDEOS = [
  {
    id: "posicionamento-alto-nivel",
    title: "Conteúdo institucional",
    description: "Vídeos que apresentam a marca, sua história, seus diferenciais e sua forma de gerar valor.",
    duration: "12:45",
    date: "28 Mai, 2026",
    category: "INSTITUCIONAL",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
    embedCode: "612U4R57M70", // A generic video presentation code, we also support direct channel handle redirect
    videoUrl: TAG08_OFFICIAL_YOUTUBE_URL,
    views: "PORTFÓLIO 01",
    tagline: "NARRATIVA CLARA"
  },
  {
    id: "branding-blueprint",
    title: "Cobertura de eventos",
    description: "Registro estratégico de momentos, bastidores, falas e experiências para ampliar o valor do evento depois que ele acontece.",
    duration: "18:20",
    date: "14 Mai, 2026",
    category: "EVENTOS",
    thumbnail: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1200",
    embedCode: "612U4R57M70",
    videoUrl: TAG08_OFFICIAL_YOUTUBE_URL,
    views: "PORTFÓLIO 02",
    tagline: "BASTIDORES COM FUNÇÃO"
  },
  {
    id: "trafego-pago-saboroso",
    title: "Conteúdo para especialistas",
    description: "Captação e edição de falas, aulas, entrevistas e conteúdos de autoridade com linguagem clara e presença profissional.",
    duration: "15:10",
    date: "03 Mai, 2026",
    category: "ESPECIALISTAS",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    embedCode: "612U4R57M70",
    videoUrl: TAG08_OFFICIAL_YOUTUBE_URL,
    views: "PORTFÓLIO 03",
    tagline: "AUTORIDADE EM CENA"
  },
  {
    id: "sistemas-operacionais-digitais",
    title: "Materiais para redes sociais",
    description: "Cortes, reels, vídeos curtos e formatos recorrentes alinhados à linha editorial e ao posicionamento da marca.",
    duration: "09:55",
    date: "21 Abr, 2026",
    category: "REDES SOCIAIS",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200",
    embedCode: "612U4R57M70",
    videoUrl: TAG08_OFFICIAL_YOUTUBE_URL,
    views: "PORTFÓLIO 04",
    tagline: "LINHA EDITORIAL"
  }
];

const getYoutubeFallbackForLocale = (locale: RouteLocale): OfficialYouTubeVideo[] => {
  if (locale === "pt") return YOUTUBE_VIDEOS;

  const localizedCopy = HOME_PILOT_COPY[locale].videos.fallback;
  return YOUTUBE_VIDEOS.map((video, index) => ({
    ...video,
    ...localizedCopy[index]
  }));
};

const SERVICOS_TILES = [
  {
    id: "redes-sociais",
    title: "Gestão de Redes",
    subtitle: "CONTEÚDO & PRESENÇA",
    desc: "Planejamento editorial com redação, roteiros e publicação consistente.",
    metricLabel: "CLAREZA",
    metricValue: "Direção",
    chartLabel: "CONSTRUÇÃO DE PRESENÇA",
    chartSubtitle: "Organiza conteúdo e distribuição para dar mais coerência à presença digital.",
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
    desc: "Roteirização, direção de cena, captação e pós-produção integrada.",
    metricLabel: "CONSISTÊNCIA",
    metricValue: "Presença",
    chartLabel: "TEMPO EM TELA",
    chartSubtitle: "Orienta cortes e formatos recorrentes com base na narrativa da marca.",
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
    title: "Branding & Identidade",
    subtitle: "MARCA AUTORAL",
    desc: "Posicionamento estético, paletas e manuais de expressão de marca.",
    metricLabel: "PERCEPÇÃO",
    metricValue: "Coerência",
    chartLabel: "VALOR PERCEBIDO",
    chartSubtitle: "Direção visual e verbal para reforçar a leitura da marca.",
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
    title: "Tráfego & Aquisição",
    subtitle: "META ADS, GOOGLE, LINKEDIN",
    desc: "Anúncios para alcançar públicos mais alinhados à oferta.",
    metricLabel: "MÉTODO APLICADO",
    metricValue: "Estrutura",
    chartLabel: "LEADS QUALIFICADOS",
    chartSubtitle: "Segmentação e otimização contínua para organizar a entrada de contatos.",
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
    title: "Copywriting Estratégico",
    subtitle: "COMUNICAÇÃO DIRECIONADA",
    desc: "Roteiros e textos focados em extrair a personalidade do seu negócio.",
    metricLabel: "CONTEÚDO",
    metricValue: "Com direção",
    chartLabel: "RETENÇÃO DA LEITURA",
    chartSubtitle: "Estrutura textual que favorece compreensão e continuidade.",
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
    desc: "Portais limpos, responsivos e codificados à mão.",
    metricLabel: "EXECUÇÃO",
    metricValue: "Com critério",
    chartLabel: "VELOCIDADE DE ACESSO",
    chartSubtitle: "Arquitetura pensada para navegação clara em desktop e mobile.",
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
    subtitle: "ROTINA E PREVISIBILIDADE",
    desc: "Playbooks, centrais de conhecimento corporativas e modelagem de processos.",
    metricLabel: "CONTINUIDADE",
    metricValue: "Organizada",
    chartLabel: "TEMPO DE RESPOSTA",
    chartSubtitle: "Organização de fluxo para reduzir retrabalho e improviso.",
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
    title: "Gestão de Redes",
    subtitle: "CONTEÚDO & PRESENÇA",
    shortDesc: "Planejamento editorial com ritmo e consistência.",
    longDesc: "Organizamos pautas, formatos e publicações para sustentar uma presença digital clara e coerente.",
    metricLabel: "CLAREZA",
    metricValue: "Direção",
    chartLabel: "CONSTRUÇÃO DE PRESENÇA",
    chartSubtitle: "Conteúdo alinhado a um plano editorial que ajuda a manter a comunicação consistente.",
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
    shortDesc: "Roteirização e pós-produção integradas.",
    longDesc: "Captação, direção e edição para transformar fala, presença e bastidores em materiais úteis para a marca.",
    metricLabel: "CONSISTÊNCIA",
    metricValue: "Presença",
    chartLabel: "TEMPO EM TELA",
    chartSubtitle: "Formatos pensados para sustentar a narrativa em vídeo com clareza.",
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
    title: "Branding & Identidade",
    subtitle: "MARCA AUTORAL",
    shortDesc: "Posicionamento visual e verbal coerente.",
    longDesc: "Desenvolvemos identidade, tom e sistema visual para alinhar percepção e contexto de marca.",
    metricLabel: "PERCEPÇÃO",
    metricValue: "Coerência",
    chartLabel: "VALOR PERCEBIDO",
    chartSubtitle: "Direção visual e verbal para reforçar a leitura da marca.",
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
    title: "Tráfego & Aquisição",
    subtitle: "MÍDIA PAGA",
    shortDesc: "Anúncios para alcançar públicos mais alinhados.",
    longDesc: "Estruturamos campanhas com segmentação, criativos e acompanhamento para apoiar a entrada de contatos.",
    metricLabel: "MÉTODO APLICADO",
    metricValue: "Estrutura",
    chartLabel: "ENTRADA DE CONTATOS",
    chartSubtitle: "Ajustes contínuos para organizar a captação sem depender de promessas exageradas.",
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
    title: "Copywriting Estratégico",
    subtitle: "COMUNICAÇÃO DIRECIONADA",
    shortDesc: "Textos que deixam a mensagem mais clara.",
    longDesc: "Redigimos legendas, páginas e argumentos para comunicar com precisão e menos ruído.",
    metricLabel: "CONTEÚDO",
    metricValue: "Com direção",
    chartLabel: "RETENÇÃO DA LEITURA",
    chartSubtitle: "Estrutura textual que favorece compreensão e continuidade.",
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
    subtitle: "CANAL PRÓPRIO",
    shortDesc: "Portais responsivos codificados à mão.",
    longDesc: "Criamos sites e landing pages com estrutura limpa, acessível e pensada para navegação clara.",
    metricLabel: "EXECUÇÃO",
    metricValue: "Com critério",
    chartLabel: "VELOCIDADE DE ACESSO",
    chartSubtitle: "Arquitetura pensada para navegação clara em desktop e mobile.",
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
    subtitle: "ROTINA E PREVISIBILIDADE",
    shortDesc: "Fluxos, playbooks e rotinas com mais clareza.",
    longDesc: "Organizamos fluxos, responsabilidades e documentação para reduzir improviso e retrabalho.",
    metricLabel: "CONTINUIDADE",
    metricValue: "Organizada",
    chartLabel: "TEMPO DE RESPOSTA",
    chartSubtitle: "Fluxos desenhados para facilitar a circulação de informação.",
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
    role: "Clínica de Odontologia",
    avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200",
    time: "há 2 semanas",
    tagline: "Clareza no posicionamento",
    text: "Fizemos o reposicionamento estético da nossa clínica e o novo site estruturado com a TAG08. Estou impactada com a precisão do design. Nosso volume de pacientes particulares de alto padrão aumentou muito porque finalmente nossa comunicação condiz com o nosso tratamento.",
    category: "BRANDING ATIVO"
  },
  {
    name: "Marcus Azevedo",
    role: "CEO, Azevedo Asset",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    time: "há 1 mês",
    tagline: "Acompanhamento do processo",
    text: "Trabalho impecável de Process Intelligence. Eles auditaram nossa estrutura e desenharam um hub assíncrono que acabou com a bagunça no WhatsApp. O time hoje sabe exatamente o que fazer com playbooks dinâmicos. Economia gigantesca de tempo de gerência.",
    category: "PROCESSES"
  },
  {
    name: "Juliana Reis",
    role: "Sócia Fundadora, Le Visage Spa",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    time: "há 3 semanas",
    tagline: "Coerência entre promessa e entrega",
    text: "A assessoria de redes sociais e conteúdo da TAG08 é magnífica. Eles planejam os carrosséis e roteiros de reels com foco em elegância e sofisticação, fugindo daquilo que as agências comuns entregam. Elevou nossa marca no mercado de luxo local.",
    category: "REDES SOCIAIS"
  },
  {
    name: "Dr. Arthur Mendes",
    role: "Diretor Clínico, Mendes Odontologia",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    time: "há 2 meses",
    tagline: "Direção comercial mais clara",
    text: "O tráfego deles é muito bem estruturado. Já passei por três assessorias que apenas queimavam verba trazendo curiosos. Na TAG08 eles organizam filtros funcionais nos criativos e nos trazem leads mais qualificados para conversar sobre tratamentos.",
    category: "TRÁFEGO ADS"
  },
  {
    name: "Beatriz Nogueira",
    role: "Diretora de Marketing, Grupo BN",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    time: "há 1 mês",
    tagline: "Diagnóstico com mais clareza",
    text: "O diagnóstico inicial deles foi melhor do que muitas consultorias pagas que já contratamos. Eles mostram os furos exatos na estrutura de branding e oferecem um plano claro. Implementamos tudo e o caminho ficou mais claro.",
    category: "DIAGNÓSTICO"
  },
  {
    name: "Leonardo Castilho",
    role: "Fundador, Castilho Advocacia",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    time: "há 3 meses",
    tagline: "Estrutura digital mais consistente",
    text: "Desenvolver nosso ecossistema web com códigos nativos pela TAG08 foi importante para a nossa captação corporativa. O site abre no celular do cliente e passa uma postura consistente para o escritório.",
    category: "DEV WEB"
  }
];

const DIAGNOSTIQUER_PHASES = {
  discovery: {
    title: "Entendimento",
    badge: "FASE 01",
    desc: "Entendimento do momento atual da marca, seus canais, sua comunicação, sua operação e os principais sinais de desalinhamento. Aqui a TAG08 identifica o que está travando clareza, consistência e tomada de decisão.",
    rating: "Clareza",
    ratingWidth: 72,
    symptoms: [
      {
        id: "content_focus",
        label: "CONTEÚDO SEM DIREÇÃO",
        desc: "A marca até publica, mas os conteúdos não constroem uma percepção clara nem conduzem o público para uma decisão.",
        symptom: "A comunicação existe, mas não organiza percepção nem gera próximo passo."
      },
      {
        id: "urgency",
        label: "URGÊNCIA CONSTANTE",
        desc: "Tudo parece prioridade, mas poucas demandas têm critério, responsável, prazo real ou impacto estratégico definido.",
        symptom: "O ritmo acelera sem filtro e multiplica ruído, retrabalho e desgaste."
      }
    ]
  },
  analysis: {
    title: "Analysis",
    badge: "FASE 02",
    desc: "Leitura dos gargalos encontrados para separar sintomas aparentes de causas reais. Nem todo problema de marketing se resolve com mais conteúdo.",
    rating: "Critério",
    ratingWidth: 58,
    symptoms: [
      {
        id: "decisions",
        label: "DECISÕES SOLTAS",
        desc: "Mudanças acontecem por pressão, gosto pessoal ou ansiedade, sem registro e sem conexão com o plano.",
        symptom: "A falta de critério faz cada ajuste reabrir o trabalho em vez de consolidá-lo."
      }
    ]
  },
  design: {
    title: "Delivery",
    badge: "FASE 03",
    desc: "Recomendação do caminho mais coerente para o momento da marca, com prioridades, próximos passos e limites claros. A entrega não é uma promessa pronta. É uma direção estruturada para decidir melhor.",
    rating: "Direção",
    ratingWidth: 68,
    symptoms: [
      {
        id: "overloaded",
        label: "OPERAÇÃO SOBRECARREGADA",
        desc: "A equipe entrega no esforço, mas o fluxo depende de poucas pessoas, muita memória e pouca previsibilidade.",
        symptom: "Quando a operação depende de poucas mãos, o crescimento vira cansaço recorrente."
      }
    ]
  }
};

interface CaseStudyCardProps {
  key?: string;
  item: {
    id: string;
    title: string;
    image: string;
    category?: string;
    client?: string;
    metric?: string;
    metricLabel?: string;
    challenge?: string;
    proofTitle?: string;
    proofDescription?: string;
    proofMode?: boolean;
  };
  onClick: () => void;
}

function CaseStudyCard({ item, onClick }: CaseStudyCardProps) {
  const [imgError, setImgError] = useState(false);
  const proofMode = Boolean(item.proofMode);

  let CardIcon = Sparkles;
  if (item.id.includes("saas")) {
    CardIcon = Cpu;
  } else if (item.id.includes("advocacia")) {
    CardIcon = Shield;
  }

  return (
    <div
      onClick={onClick}
      onKeyDown={(event) => activateOnKeyboard(event, onClick)}
      role="button"
      tabIndex={0}
      aria-label={`Abrir case: ${item.client}`}
      className="bg-charcoal-900 border border-white/[0.04] p-5 pb-7 rounded-[28px] overflow-hidden cursor-pointer group flex flex-col justify-between transition-all duration-350 hover:border-brand/25 hover:-translate-y-1 relative shadow-lg h-full"
    >
      {/* Top Image area mimicking mockup precisely with premium grayscale/vibrant transition */}
      <div className="relative aspect-[4/3] w-full rounded-[20px] overflow-hidden mb-2 bg-zinc-950">
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
              <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                {proofMode ? "Método em prática" : item.client}
              </span>
              <p className="font-sans text-xs text-zinc-600 max-w-[190px] leading-tight line-clamp-2">
                {proofMode ? (item.proofDescription ?? item.challenge ?? "") : `${item.category} // DIAGNÓSTICO ATIVO`}
              </p>
            </div>
          </div>
        ) : (
            <Image
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            src={item.image}
            alt=""
            onError={() => setImgError(true)}
            className="object-cover group-hover:scale-103 transition-transform duration-700 grayscale group-hover:grayscale-0"
            referrerPolicy="no-referrer"
          />
        )}
        
        {proofMode ? (
          <span className="absolute top-4 left-4 z-20 bg-black/75 backdrop-blur-sm border border-white/[0.08] px-3 py-1 text-xs tag08-meta text-zinc-300 uppercase tracking-wider rounded-full">
            Método em prática
          </span>
        ) : (
          <>
            {/* Floating category tag top-left */}
            <span className="absolute top-4 left-4 z-20 bg-black/75 backdrop-blur-sm border border-white/[0.08] px-3 py-1 text-xs tag08-meta text-zinc-300 uppercase tracking-wider rounded-full">
              {item.category}
            </span>

            {/* Highly polished metric banner top-right */}
            <div className="absolute top-4 right-4 z-20 bg-brand text-black font-display font-black px-3 py-1 text-xs rounded-full shadow-lg flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {item.metric}
            </div>
          </>
        )}

        {/* Overlapping circular icon bottom-left */}
        <div className="absolute -bottom-3 left-5 w-11 h-11 rounded-full bg-brand text-black shadow-lg flex items-center justify-center z-20 transform transition-transform group-hover:scale-110 duration-300">
          <CardIcon className="w-4.5 h-4.5" />
        </div>
      </div>

      {/* Content under the image container */}
      <div className="pt-6 px-1 flex-1 flex flex-col justify-between text-left">
        <div className="space-y-2">
          <span className="tag08-meta text-xs text-brand tracking-widest uppercase font-black block">
            {proofMode ? "MÉTODO APLICADO" : item.client}
          </span>
          <h3 className="font-display font-semibold text-base sm:text-lg text-white leading-snug group-hover:text-brand transition-colors">
            {proofMode ? item.proofTitle ?? item.title : item.title}
          </h3>
          <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-sans line-clamp-3">
            {proofMode ? item.proofDescription ?? item.challenge : item.challenge}
          </p>
        </div>

        <div className="pt-6 mt-4 border-t border-white/[0.03] flex items-center gap-1.5 text-xs text-brand tag08-meta uppercase tracking-widest font-extrabold group-hover:underline">
          <span>{proofMode ? "Solicitar Estudo de Caso" : "Ver Detalhes do Case"}</span>
          <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}

interface HomeProps {
  onNavigate: (page: string) => void;
  contactHref: string;
  locale?: RouteLocale;
}

export default function Home({ onNavigate, contactHref, locale = "pt" }: HomeProps) {
  const prefersReducedMotion = useReducedMotion();
  const scrollBehavior = prefersReducedMotion ? "auto" : "smooth";
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeServiceTab, setActiveServiceTab] = useState(0);
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [youtubeConsentGranted, setYoutubeConsentGranted] = useState(false);
  const [showYoutubeConsentPrompt, setShowYoutubeConsentPrompt] = useState(false);
  const [activeReview, setActiveReview] = useState(0);
  const [showOriginalReview, setShowOriginalReview] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [activeDiagPhase, setActiveDiagPhase] = useState<"discovery" | "analysis" | "design">("discovery");
  const [hoveredPill, setHoveredPill] = useState<string | null>(null);
  const [youtubeVideos, setYoutubeVideos] = useState<OfficialYouTubeVideo[]>(() => getYoutubeFallbackForLocale(locale));
  const [youtubeVideosLocale, setYoutubeVideosLocale] = useState<RouteLocale>(locale);
  const [gmbReviews, setGmbReviews] = useState<OfficialGoogleReview[]>([]);
  const [gmbReviewsLocale, setGmbReviewsLocale] = useState<RouteLocale | null>(null);
  const [contentSources, setContentSources] = useState<OfficialContentApiResponse["sources"]>({
    youtube: "fallback",
    googleBusiness: "fallback"
  });

  const visibleYoutubeVideos = youtubeVideosLocale === locale
    ? youtubeVideos
    : getYoutubeFallbackForLocale(locale);
  const safeActiveVideoIndex = Math.min(activeVideoIndex, Math.max(0, visibleYoutubeVideos.length - 1));
  const visibleGmbReviews = gmbReviews;
  const safeActiveReview = Math.min(activeReview, Math.max(0, visibleGmbReviews.length - 1));
  const externalCopy = externalContentCopy[locale];
  const pilotCopy = locale === "pt" ? null : HOME_PILOT_COPY[locale];
  const problemCopy = pilotCopy?.problem;
  const videoCopy = pilotCopy?.videos;
  const institutionalCopy = pilotCopy?.institutional;
  const proofCopy = pilotCopy?.proof;
  const reviewsCopy = pilotCopy?.reviews;
  const casesCopy = pilotCopy?.cases;
  const faqCopy = pilotCopy?.faq;
  const diagnosisCopy = pilotCopy?.diagnostic;
  const methodCopy = pilotCopy?.methodCenter;
  const solutionMapCopy = pilotCopy?.solutionMap;
  const methodologyCopy = pilotCopy?.methodology;

  const PROOF_CASES_DATA = [
    {
      id: "case-clinica-alphaville",
      title: "Reposicionamento com mais clareza comercial",
      proofDescription: "Organização de mensagem, percepção de valor e presença digital para uma marca que precisava comunicar melhor o que já entregava.",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=600",
      proofMode: true
    },
    {
      id: "case-saas-process",
      title: "Presença digital com estrutura de canais",
      proofDescription: "Construção de uma base mais coerente entre comunicação, conteúdo, site e pontos de contato para apoiar o processo comercial.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
      proofMode: true
    },
    {
      id: "case-branding-advocacia",
      title: "Identidade e comunicação para serviço especializado",
      proofDescription: "Alinhamento visual, linguagem e narrativa para uma marca que precisava transmitir mais clareza, confiança e profissionalismo.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=600",
      proofMode: true
    }
  ];

  const MAPA_SOLUCOES_DATA = [
    {
      id: "conteudo-redes-sociais",
      title: "Gestão de Redes Sociais / Presença Digital",
      subtitle: "Presença com linha editorial",
      desc: "Para negócios que precisam organizar comunicação, conteúdo e frequência de acordo com o momento e a capacidade de execução.",
      related: "Planos Start, Base e Performance; capacidades como copywriting e tráfego são aplicadas quando fizerem sentido.",
      cta: "Conhecer presença digital",
      slug: "/servicos/gestao-de-redes-sociais"
    },
    {
      id: "producao-audiovisual",
      title: "Produção Audiovisual",
      subtitle: "Imagem, fala e bastidores com função",
      desc: "Para empresas e especialistas que precisam transformar conhecimento, presença ou acontecimentos em conteúdo audiovisual com direção.",
      related: "Captação, edição e produções alinhadas ao uso previsto.",
      cta: "Conhecer produção audiovisual",
      slug: "/servicos/producao-audiovisual"
    },
    {
      id: "desenvolvimento-web",
      title: "Tecnologia",
      subtitle: "Estruturas digitais adequadas ao negócio",
      desc: "Para organizações que precisam de websites, e-commerce/unidade digital ou soluções digitais específicas, com prontidão operacional avaliada antes da execução.",
      related: "Hospedagem e Manutenção são continuidade tecnológica adjacente à família Web.",
      cta: "Conhecer soluções de Tecnologia",
      slug: "/servicos/desenvolvimento-web"
    },
    {
      id: "assessoria-estrategica",
      title: "Assessoria Estratégica / Negócios",
      subtitle: "Direção para decisões do negócio",
      desc: "Para empresas que precisam organizar prioridades, posicionamento, canais e planejamento antes de ampliar a execução.",
      related: "Direção estratégica sem substituir Branding, Processos ou a execução de mídia.",
      cta: "Conhecer Assessoria Estratégica",
      slug: "/servicos/assessoria-marketing-digital-estrategico"
    },
    {
      id: "branding-posicionamento",
      title: "Branding / Posicionamento",
      subtitle: "Coerência entre identidade e fase do negócio",
      desc: "Para marcas cuja identidade, percepção ou mensagem já não representam adequadamente seu valor ou momento atual.",
      related: "Identidade, posicionamento e reposicionamento dentro da mesma família.",
      cta: "Conhecer Branding e Posicionamento",
      slug: "/servicos/branding-identidade"
    },
    {
      id: "processos-operacao",
      title: "Processos / Operação",
      subtitle: "Mais previsibilidade para executar",
      desc: "Para empresas em que crescimento, demandas ou conhecimento dependem demais de poucas pessoas, memória ou decisões informais.",
      related: "Process Intelligence e Process Activation permanecem ofertas distintas dentro desta família.",
      cta: "Conhecer Processos e Operação",
      slug: "/servicos/process-intelligence"
    }
  ];
  const MAPA_SOLUCOES_PAIRS = Array.from(
    { length: Math.ceil(MAPA_SOLUCOES_DATA.length / 2) },
    (_, pairIndex) => MAPA_SOLUCOES_DATA.slice(pairIndex * 2, pairIndex * 2 + 2)
  );
  const localizedSolutionPairs = MAPA_SOLUCOES_PAIRS.map((pair) => pair.map((service) => {
    const translated = solutionMapCopy?.cards[service.id as keyof typeof solutionMapCopy.cards];
    return translated ? { ...service, ...translated } : service;
  }));

  const evidenceMode = getEvidenceVisibilityMode();
  const visibleClientCases = getVisibleEvidence(CLIENT_CASES, (caseStudy) => `home-case/${caseStudy.id}`, "/", evidenceMode);
  // Client quotes are attributed evidence. Keep them out of EN/ES until a locale-safe source is approved.
  const clientCasesLocaleReady = locale === "pt";
  const reviewsLocaleReady = gmbReviewsLocale === locale && (locale === "pt" || (
    visibleGmbReviews.length > 0 && visibleGmbReviews.every((review) =>
      review.machineTranslated === true &&
      review.original !== undefined &&
      ["role", "time", "tagline", "text", "category"].every((field) =>
        review[field as keyof OfficialGoogleReview] !== review.original?.[field as keyof NonNullable<OfficialGoogleReview["original"]>]
      )
    )
  ));

  useEffect(() => {
    const syncYoutubeConsent = (preferences: CookiePreferences | null) => {
      setYoutubeConsentGranted(preferences?.marketing === true);
    };

    syncYoutubeConsent(readCookiePreferences());
    const handleCookieConsent = (event: Event) => {
      syncYoutubeConsent((event as CustomEvent<CookiePreferences>).detail);
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleCookieConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleCookieConsent);
  }, []);

  const startYoutubePlayer = () => {
    const video = visibleYoutubeVideos[safeActiveVideoIndex];
    setIsPlayingVideo(true);
    trackVideoEvent({
      action: "started",
      video_id: video.embedCode,
      video_source: "youtube",
      surface: "home-video-theater",
      page_path: "/"
    });
  };

  const openYoutubePlayer = () => {
    if (!youtubeConsentGranted) {
      setShowYoutubeConsentPrompt(true);
      return;
    }

    startYoutubePlayer();
  };

  const acceptYoutubeConsentAndPlay = () => {
    grantMarketingConsent();
    setShowYoutubeConsentPrompt(false);
    startYoutubePlayer();
  };

  useEffect(() => {
    const controller = new AbortController();
    setYoutubeVideos(getYoutubeFallbackForLocale(locale));
    setYoutubeVideosLocale(locale);
    setActiveVideoIndex(0);
    setIsPlayingVideo(false);
    setGmbReviews([]);
    setGmbReviewsLocale(null);
    setActiveReview(0);
    setContentSources({ youtube: "fallback", googleBusiness: "fallback" });

    const loadOfficialContent = async () => {
      try {
        const response = await fetch(`/api/official-content?locale=${locale}`, {
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

        if (locale === "pt" && data.sources?.youtube === "live" && Array.isArray(data.youtubeVideos) && data.youtubeVideos.length > 0) {
          setYoutubeVideos(data.youtubeVideos);
          setYoutubeVideosLocale(locale);
        }

        if (data.sources?.googleBusiness === "live" && Array.isArray(data.gmbReviews) && data.gmbReviews.length > 0) {
          setGmbReviews(data.gmbReviews);
          setGmbReviewsLocale(locale);
        }

        if (data.sources) {
          setContentSources({
            youtube: locale === "pt" ? data.sources.youtube : "fallback",
            googleBusiness: data.sources.googleBusiness
          });
        }
      } catch {
        // Keep the local fallback content if the sync endpoint is unavailable.
      }
    };

    void loadOfficialContent();

    return () => controller.abort();
  }, [locale]);

  useEffect(() => {
    setShowOriginalReview(false);
  }, [activeReview]);

  useEffect(() => {
    setActiveReview((current) => Math.min(current, Math.max(0, visibleGmbReviews.length - 1)));
  }, [visibleGmbReviews.length]);

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

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: scrollBehavior });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: scrollBehavior, block: "start" });
    }
  };

  const tagCategories = [
    { name: "ESTRATÉGIA" },
    { name: "POSICIONAMENTO" },
    { name: "CONTEÚDO" },
    { name: "TECNOLOGIA" },
    { name: "PROCESSOS" },
    { name: "OPERAÇÃO" },
  ];
  const localizedTagCategories = pilotCopy?.hero.categories ?? tagCategories.map((tag) => tag.name);

  return (
    <div className="tag08-home-flow bg-charcoal-950 text-white overflow-hidden">
      {/* SECTION 1 - NEW ADVANCED HIGH-DESCRIPTIVE HERO */}
      <section id="hero" className="relative min-h-screen flex items-center pt-28 pb-16 px-4 sm:px-6 md:px-8">
        {/* Full neon floating frame container styled exactly like reference image */}
        <div className="w-full max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-[#070707] text-white p-6 sm:p-10 lg:p-16 relative overflow-hidden flex flex-col justify-between min-h-[74vh] lg:min-h-[72vh] shadow-[0_30px_80px_rgba(var(--color-brand-rgb),0.12)] border border-white/10 select-none">
          <HeroEditorialStage image={heroTag08StrategyStage} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25 pointer-events-none z-10" />

          {/* CORE GRAPHICAL CONTENT & CONTROLS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center relative z-20 w-full my-auto">
            
            {/* LEFT COLUMN: DESCRIPTION, STRATEGY ACTION & SOUNDBAR WIDGET */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left order-2 lg:order-1">
              
              {/* Upper statement badge */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span className="tag08-meta text-xs tracking-widest uppercase font-bold text-white/80">
                    {pilotCopy?.hero.eyebrow ?? "Estratégia, conteúdo, tecnologia e processos"}
                  </span>
                </div>
                
                <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.0] tracking-tighter">
                  {pilotCopy?.hero.heading ?? "Presença digital com direção para negócios que querem crescer sem improviso."}
                </h1>
                
                <p className="text-white/72 text-xs sm:text-sm max-w-sm leading-relaxed font-sans font-medium">
                  {pilotCopy?.hero.description ?? "A TAG08 organiza posicionamento, comunicação, conteúdo, tecnologia e processos para transformar ações digitais dispersas em uma presença mais clara, consistente e útil ao negócio."}
                </p>
              </div>

              {/* Lower audio signal interactable widget exactly like reference image */}
              <Link
                href={contactHref}
                aria-label={pilotCopy?.hero.contactLabel ?? "Ir para contato e solicitar diagnóstico"}
                className="bg-black/35 hover:bg-black/55 transition-[background-color,border-color,box-shadow] duration-200 border border-white/15 p-5 rounded-2xl flex flex-col gap-4 max-w-sm cursor-pointer shadow-sm backdrop-blur-sm group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                  </span>
                  <span className="tag08-meta text-xs text-white font-bold uppercase tracking-wider">
                      {pilotCopy?.hero.diagnosticLabel ?? "Diagnóstico antes da execução"}
                  </span>
                  </div>
                  
                  {/* Dynamic waveform visual bars inside widget */}
                  <div className="flex items-end gap-0.5 h-5">
                    {[12, 24, 16, 28, 20, 26, 14, 18, 24, 10, 16, 20].map((height, i) => (
                      <span 
                        key={i} 
                        className="w-0.5 bg-brand rounded-full transition-all duration-500 origin-bottom"
                        style={{ height: `${height}px` }} 
                      />
                    ))}
                  </div>
                </div>

                <div className="w-full bg-brand text-black rounded-xl py-3 px-4 flex items-center justify-between group-hover:bg-brand-dark group-hover:text-white transition-[background-color,color] duration-200">
                  <span className="tag08-meta text-xs font-extrabold tracking-wider uppercase">
                    {pilotCopy?.hero.contactCta ?? "FALAR COM A TAG08"}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>

            {/* The image is now the stage itself; this column preserves the editorial reading space. */}
            <div className="hidden lg:order-2 lg:block lg:col-span-4" aria-hidden="true" />

            {/* RIGHT COLUMN: BRAND SOCIAL AUDIENCE AND BUSINESS AREA CATEGORY CAPSULES (ROCK PILLS LOOKALIKES) */}
            <div className="lg:col-span-3 flex flex-col justify-between space-y-8 text-left lg:text-right order-3 z-20">
              
              {/* Trust banner */}
              <div className="space-y-2 flex flex-col lg:items-end">
                <span className="font-sans font-extrabold text-sm text-white leading-tight max-w-[180px] lg:text-right">
                  {pilotCopy?.hero.trust ?? "Método, clareza e execução responsável"}
                </span>
                
                <p className="text-white/55 tag08-meta text-xs uppercase tracking-wide font-bold">
                  {pilotCopy?.hero.promise ?? "DIREÇÃO PARA CONSTRUIR. ESTRUTURA PARA CRESCER."}
                </p>
              </div>

              {/* Secondary shortcuts to the solutions section */}
              <div className="space-y-3">
                <div className="tag08-meta text-xs text-brand uppercase tracking-widest font-extrabold block lg:text-right">
                  {pilotCopy?.hero.organize ?? "O QUE ORGANIZAMOS:"}
                </div>
                <nav aria-label={pilotCopy?.hero.shortcuts ?? "Atalhos para as soluções da TAG08"}>
                  <div className="flex flex-wrap lg:justify-end gap-1.5 max-w-sm lg:ml-auto">
                    {localizedTagCategories.map((tag) => (
                      <a
                        key={tag}
                        href="#servicos-principais"
                        onClick={(event) => {
                          if (
                            event.button !== 0 ||
                            event.metaKey ||
                            event.ctrlKey ||
                            event.shiftKey ||
                            event.altKey
                          ) return;
                          event.preventDefault();
                          scrollToSection("servicos-principais");
                        }}
                        className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.03] px-3 py-1.5 font-sans text-xs font-semibold tracking-wider text-white/80 transition-[background-color,border-color,color] duration-200 hover:border-white/40 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
                      >
                        {tag}
                      </a>
                    ))}
                  </div>
                </nav>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2 - PROBLEMA */}
      <section id="problema" className="tag08-section px-4 sm:px-6 border-b border-white/[0.04] bg-charcoal-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="tag08-section__header mb-16 text-left"
          >
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-semibold">
              {problemCopy?.badge ?? "Mais execução não corrige falta de direção"}
            </span>
            <h2 className="tag08-section__heading font-display font-medium text-3xl sm:text-4xl text-gradient">
              {problemCopy?.title ?? "Mais execução não corrige falta de direção."}
            </h2>
            <p className="tag08-section__copy text-zinc-400 text-sm sm:text-base">
              {problemCopy?.description ?? "Uma empresa pode publicar, anunciar, produzir vídeos e ter um site sem que essas frentes construam a mesma percepção. Quando posicionamento, comunicação e operação seguem caminhos diferentes, o digital acumula ações, mas continua sem organizar a decisão do público ou da própria empresa. A TAG08 trabalha nesse ponto: identifica o que está desalinhado, organiza prioridades e conecta estratégia e execução ao momento real do negócio."}
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
              <DiagnosticDiagram copy={pilotCopy?.diagnosticDiagram} />
            </Suspense>
          </motion.div>

          {/* CTA INTERMEDIÁRIO APÓS O DIAGNÓSTICO */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="tag08-card mt-12 relative overflow-hidden border !border-[color:var(--color-charcoal-700)] !bg-[color:var(--color-text-primary)] p-8 text-left text-[color:var(--color-main)] shadow-[var(--shadow-base)] transition-[border-color,box-shadow,transform] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:!border-[color:var(--color-main)] motion-safe:hover:shadow-[var(--shadow-emphasis)] motion-reduce:transform-none"
          >
            {/* Design accents */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(10,10,10,0.05)_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="pointer-events-none absolute right-0 top-0 h-[300px] w-[400px] rounded-full bg-brand/[0.04] blur-[100px]" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="tag08-kicker text-[color:var(--color-accent-readable)]">
                  <span className="sr-only">{problemCopy?.ctaSr ?? "Destaque:"}</span>
                  <span>
                    {problemCopy?.ctaBadge ?? "SESSÃO DIAGNÓSTICA EXCLUSIVA"}
                  </span>
                </div>
                <h3 className="font-display text-xl font-medium leading-tight text-[color:var(--color-main)] sm:text-2xl">
                  {problemCopy?.ctaTitle ?? "Fazer mais nem sempre é avançar. Direção ajuda a entender o que realmente precisa ser feito."}
                </h3>
                <p className="font-sans text-xs leading-relaxed text-[color:var(--color-charcoal-700)] sm:text-sm">
                  {problemCopy?.ctaDescription ?? "Conteúdo sem estratégia vira volume. Site sem função vira estrutura subutilizada. Tecnologia sem operação vira custo. Crescimento sem estrutura vira desgaste."}
                </p>
              </div>

              <button
                onClick={() => {
                  onNavigate("/contato");
                  window.scrollTo({ top: 0, behavior: scrollBehavior });
                }}
                className="group relative min-h-11 shrink-0 overflow-hidden rounded-xl border border-[color:var(--color-main)] bg-[color:var(--color-main)] px-7 py-4 tag08-action text-[color:var(--color-text-primary)] shadow-[var(--shadow-base)] transition-[background-color,border-color,box-shadow,transform] duration-200 hover:border-[color:var(--color-charcoal-700)] hover:bg-[color:var(--color-charcoal-700)] hover:shadow-[var(--shadow-emphasis)] active:scale-[0.98] motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-main)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-text-primary)] motion-reduce:transform-none"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full skew-x-12 motion-safe:group-hover:translate-x-full transition-transform duration-200 ease-out" />
                <span className="relative z-10 flex items-center gap-2">
                  {problemCopy?.ctaButton ?? "Identificar meu momento"} <ArrowNarrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </motion.div>

          {/* NOVO BLOCO: BENTO GRID DE DIRECIONAMENTO E MATURIDADE */}
          <div className="mt-24 sm:mt-32 space-y-12 text-left animate-fade-in">
            <div className="tag08-section__header max-w-3xl">
              <div className="tag08-kicker">
                {pilotCopy?.mosaic.intro.kicker ?? "A estrutura certa depende do momento"}
              </div>
              <h2 className="tag08-section__heading font-display font-medium text-3xl sm:text-4xl text-gradient">
                {pilotCopy?.mosaic.intro.title ?? "A estrutura certa depende do momento."}
              </h2>
              <p className="tag08-section__copy text-zinc-400 text-xs sm:text-sm font-sans">
                {pilotCopy?.mosaic.intro.description ?? "O plano mais completo não é automaticamente o melhor. O caminho adequado depende da maturidade da empresa e da capacidade de participar da execução."}
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
                    window.scrollTo({ top: 0, behavior: scrollBehavior });
                  }}
                  onKeyDown={(event) => activateOnKeyboard(event, () => {
                    onNavigate("/servicos/branding-identidade");
                    window.scrollTo({ top: 0, behavior: scrollBehavior });
                  })}
                  role="link"
                  tabIndex={0}
                  aria-label={pilotCopy?.mosaic.m02.aria ?? "Conhecer Branding e Identidade"}
                  className="tag08-card tag08-card--interactive relative group overflow-hidden min-h-[220px] sm:min-h-[260px] bg-charcoal-900 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <Image
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                    alt={pilotCopy?.mosaic.m02.imageAlt ?? "TAG08 Alinhamento de Posicionamento"}
                    className="object-cover grayscale opacity-35 group-hover:grayscale-0 group-hover:scale-102 group-hover:opacity-50 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-6 sm:p-8 text-left">
                      <div className="flex items-center justify-between w-full">
                        <span className="tag08-kicker">
                          {pilotCopy?.mosaic.m02.label ?? "M-02 // BRANDING ATIVO"}
                        </span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-brand transition-colors" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white tracking-tight mt-1.5 group-hover:text-brand transition-colors">
                      {pilotCopy?.mosaic.m02.title ?? "Começando com direção"}
                    </h3>
                    <p className="text-zinc-400 text-xs font-sans max-w-md mt-1 leading-relaxed">
                      {pilotCopy?.mosaic.m02.description ?? "Existe uma oferta minimamente clara, mas comunicação, identidade ou rotina digital ainda estão em construção. Caminhos possíveis: Start e Identidade Visual Digital."}
                    </p>
                  </div>
                </div>

                {/* Split Row below Card 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Left sub-column: Card M-01 & Card M-03 */}
                  <div className="flex flex-col gap-6">
                    
                    {/* Card M-01: PRESENÇA DIGITAL */}
                    <div 
                      onClick={() => {
                        onNavigate("/servicos/gestao-de-redes-sociais");
                        window.scrollTo({ top: 0, behavior: scrollBehavior });
                      }}
                      onKeyDown={(event) => activateOnKeyboard(event, () => {
                        onNavigate("/servicos/gestao-de-redes-sociais");
                        window.scrollTo({ top: 0, behavior: scrollBehavior });
                      })}
                      role="link"
                      tabIndex={0}
                      aria-label={pilotCopy?.mosaic.m01.aria ?? "Conhecer Gestão de Redes Sociais"}
                      className="tag08-card tag08-card--interactive p-6 sm:p-8 flex flex-col justify-between min-h-[194px] relative overflow-hidden text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <div>
                        <div className="flex items-center justify-between w-full">
                        <span className="tag08-kicker">
                          {pilotCopy?.mosaic.m01.label ?? "M-01 // PRESENÇA DIGITAL"}
                        </span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-brand transition-colors" />
                        </div>
                        <h3 className="text-white font-display font-semibold text-xs sm:text-sm leading-tight group-hover:text-brand transition-colors mt-2">
                          {pilotCopy?.mosaic.m01.title ?? "Presença ativa, mas inconsistente"}
                        </h3>
                        <p className="text-zinc-400 text-xs font-sans leading-normal mt-1.5">
                          {pilotCopy?.mosaic.m01.description ?? "O negócio já funciona, porém comunicação, calendário e produção ainda dependem de decisões pontuais. Caminhos possíveis: Base, Desenvolvimento Web ou projeto complementar de marca."}
                        </p>
                      </div>
                      
                      {/* Social Grid placeholder items with premium visual micro interactions */}
                      <div className="flex gap-2 mt-2 pt-2 border-t border-white/[0.03]">
                        <span className="w-6 h-6 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-xs text-brand-secondary font-sans group-hover:bg-brand-secondary/10 transition-colors">in</span>
                        <span className="w-6 h-6 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-xs text-brand-secondary font-sans group-hover:bg-brand-secondary/10 transition-colors">ig</span>
                        <span className="w-6 h-6 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-xs text-brand-secondary font-sans group-hover:bg-brand-secondary/10 transition-colors">wa</span>
                      </div>
                    </div>

                    {/* Card M-03: PRODUÇÃO AUDIOVISUAL */}
                    <div 
                      onClick={() => {
                        onNavigate("/servicos/producao-audiovisual");
                        window.scrollTo({ top: 0, behavior: scrollBehavior });
                      }}
                      onKeyDown={(event) => activateOnKeyboard(event, () => {
                        onNavigate("/servicos/producao-audiovisual");
                        window.scrollTo({ top: 0, behavior: scrollBehavior });
                      })}
                      role="link"
                      tabIndex={0}
                      aria-label={pilotCopy?.mosaic.m03.aria ?? "Conhecer Produção Audiovisual"}
                      className="tag08-card tag08-card--interactive p-6 sm:p-8 flex flex-col justify-between min-h-[194px] relative overflow-hidden text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <div className="flex items-center justify-between">
                        <span className="tag08-kicker">M-03</span>
                        <span className="tag08-meta text-zinc-400">{pilotCopy?.mosaic.m03.category ?? "Produção audiovisual"}</span>
                      </div>
                      
                      <div>
                        <h3 className="text-white font-display font-semibold text-xs sm:text-sm leading-tight group-hover:text-brand transition-colors">
                          {pilotCopy?.mosaic.m03.title ?? "Marca em crescimento"}
                        </h3>
                        <p className="text-zinc-400 text-xs font-sans leading-relaxed mt-1.5">
                          {pilotCopy?.mosaic.m03.description ?? "Existe necessidade de integrar planejamento, vídeo, produção, publicação e acompanhamento. O caminho pode combinar Gestão de Redes Sociais, Produção Audiovisual e Branding/Posicionamento conforme o diagnóstico."}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Card M-04: active state uses the support accent as guidance, not as a full surface. */}
                  <div 
                    onClick={() => {
                      onNavigate("/servicos/desenvolvimento-web");
                      window.scrollTo({ top: 0, behavior: scrollBehavior });
                    }}
                    onKeyDown={(event) => activateOnKeyboard(event, () => {
                      onNavigate("/servicos/desenvolvimento-web");
                      window.scrollTo({ top: 0, behavior: scrollBehavior });
                    })}
                    role="link"
                    tabIndex={0}
                    aria-label={pilotCopy?.mosaic.m04.aria ?? "Conhecer Desenvolvimento Web Estratégico"}
                    className="tag08-card tag08-card--interactive tag08-card--featured text-white p-8 flex flex-col justify-between min-h-[340px] sm:min-h-[412px] text-left relative overflow-hidden group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/[0.06] rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
                    
                    <div>
                      <div className="flex items-center justify-between w-full">
                        <span className="tag08-kicker">
                          {pilotCopy?.mosaic.m04.label ?? "M-04 // DESENVOLVIMENTO WEB ESTRATÉGICO"}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-brand-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                      <h3 className="font-display font-bold text-3xl text-white tracking-tighter mt-6 leading-none">M-04</h3>
                    </div>

                    <div className="space-y-2 relative z-10">
                      <h3 className="font-display font-extrabold text-white text-sm tracking-tight">{pilotCopy?.mosaic.m04.title ?? "Um canal próprio com função clara"}</h3>
                      <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                        {pilotCopy?.mosaic.m04.description ?? "A estrutura web precisa organizar informação, fortalecer credibilidade e facilitar o caminho entre interesse e contato."}
                      </p>
                    </div>
                  </div>

                </div>

              </div>

              {/* RIGHT COLUMN/PANE OF BENTO */}
              <div className="flex flex-col gap-6">
                
                {/* Split Row Top: Card M-05 & Card M-06 / Diagnóstico */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Card M-05: INTELIGÊNCIA OPERACIONAL (Tall Dark Card) */}
                  <div 
                    onClick={() => {
                      onNavigate("/servicos/process-intelligence");
                      window.scrollTo({ top: 0, behavior: scrollBehavior });
                    }}
                    onKeyDown={(event) => activateOnKeyboard(event, () => {
                      onNavigate("/servicos/process-intelligence");
                      window.scrollTo({ top: 0, behavior: scrollBehavior });
                    })}
                    role="link"
                    tabIndex={0}
                    aria-label={pilotCopy?.mosaic.m05.aria ?? "Conhecer Process Intelligence"}
                      className="tag08-card tag08-card--interactive p-8 flex flex-col justify-between min-h-[300px] sm:min-h-[340px] text-left relative overflow-hidden group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div>
                      <div className="flex items-center justify-between w-full">
                        <span className="tag08-kicker">
                          {pilotCopy?.mosaic.m05.label ?? "M-05 // INTELIGÊNCIA OPERACIONAL"}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-brand transition-colors" />
                      </div>
                      <h3 className="font-display font-bold text-3xl text-white tracking-tighter mt-6 leading-none">M-05</h3>
                    </div>

                    <div className="space-y-2 relative z-10">
                      <h3 className="font-display font-extrabold text-white text-sm tracking-tight group-hover:text-brand transition-colors">{pilotCopy?.mosaic.m05.title ?? "Operação pressionada pelo crescimento"}</h3>
                      <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                        {pilotCopy?.mosaic.m05.description ?? "A empresa aumentou o volume, mas processos, responsabilidades ou conhecimento ainda dependem demais de improviso. Process Intelligence mapeia essas rotinas em fluxos claros e materiais de consulta."}
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-column of Split: Card M-06 & Diagnostics */}
                  <div className="flex flex-col gap-6">
                    
                    {/* Card M-06: GOVERNANÇA & AUDITORIA */}
                    <div 
                      onClick={() => {
                        onNavigate("/servicos/process-activation");
                        window.scrollTo({ top: 0, behavior: scrollBehavior });
                      }}
                      onKeyDown={(event) => activateOnKeyboard(event, () => {
                        onNavigate("/servicos/process-activation");
                        window.scrollTo({ top: 0, behavior: scrollBehavior });
                      })}
                      role="link"
                      tabIndex={0}
                      aria-label={pilotCopy?.mosaic.m06.aria ?? "Conhecer Process Activation"}
                      className="tag08-card tag08-card--interactive text-white p-6 flex flex-col justify-between min-h-[158px] text-left relative group overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <div className="flex items-center justify-between">
                        <span className="tag08-kicker">M-06</span>
                        <span className="tag08-meta text-zinc-400">{pilotCopy?.mosaic.m06.category ?? "Ativação de processos"}</span>
                      </div>
                      
                      <div>
                        <h3 className="font-display font-bold text-sm tracking-tight leading-none text-white group-hover:text-brand transition-colors">{pilotCopy?.mosaic.m06.title ?? "Processos existentes, execução irregular"}</h3>
                        <p className="text-zinc-400 text-xs font-sans leading-normal mt-1.5">
                          {pilotCopy?.mosaic.m06.description ?? "Quando os processos já estão estruturados, Process Activation ajuda a colocá-los em prática e acompanhar sua adoção no trabalho diário."}
                        </p>
                      </div>
                    </div>

                    {/* Quick Call to Action Card */}
                    <div 
                      onClick={() => {
                        const target = document.getElementById("diagnostico");
                        if (target) {
                          target.scrollIntoView({ behavior: scrollBehavior });
                        }
                      }}
                      onKeyDown={(event) => activateOnKeyboard(event, () => {
                        const target = document.getElementById("diagnostico");
                        if (target) target.scrollIntoView({ behavior: scrollBehavior, block: "start" });
                      })}
                      role="button"
                      tabIndex={0}
                      aria-label={pilotCopy?.mosaic.nextStep.aria ?? "Abrir diagnóstico"}
                      className="tag08-card tag08-card--interactive text-white p-6 flex flex-col justify-between min-h-[158px] text-left relative group overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <div className="flex items-center justify-between">
                        <span className="tag08-kicker">{pilotCopy?.mosaic.nextStep.label ?? "Próximo passo"}</span>
                        <span className="tag08-meta text-zinc-400">{pilotCopy?.mosaic.nextStep.category ?? "Diagnóstico imediato"}</span>
                      </div>
                      
                      <div>
                        <h3 className="font-display font-bold text-sm tracking-tight leading-none text-white">{pilotCopy?.mosaic.nextStep.title ?? "Identificar meu momento"}</h3>
                        <p className="text-zinc-400 text-xs font-sans leading-relaxed mt-1.5">
                          {pilotCopy?.mosaic.nextStep.description ?? "A conversa inicial ajuda a avaliar contexto, fit, maturidade e prioridade, sem promessa pronta ou solução empurrada."}
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
                      target.scrollIntoView({ behavior: scrollBehavior });
                    }
                  }}
                  onKeyDown={(event) => activateOnKeyboard(event, () => {
                    const target = document.getElementById("diagnostico");
                    if (target) target.scrollIntoView({ behavior: scrollBehavior, block: "start" });
                  })}
                  role="button"
                  tabIndex={0}
                  aria-label={pilotCopy?.mosaic.m07.aria ?? "Iniciar diagnóstico"}
                  className="tag08-card tag08-card--interactive relative group grid min-h-[300px] sm:min-h-[332px] flex-1 grid-cols-1 sm:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] overflow-hidden cursor-pointer border-[color:var(--color-charcoal-700)] !bg-[color:var(--color-text-primary)] !text-[color:var(--color-main)] !shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <div className="relative min-h-[180px] overflow-hidden sm:min-h-0">
                    <Image
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1024px) 45vw, 30vw"
                      src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800"
                      alt={pilotCopy?.mosaic.m07.imageAlt ?? "TAG08 Workspace de Negócios"}
                      className="object-cover grayscale transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col justify-between gap-8 p-6 text-left sm:p-8">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <span className="tag08-kicker !text-[color:var(--color-accent-readable)]">
                          {pilotCopy?.mosaic.m07.label ?? "M-07 // ASSESSORIA ESTRATÉGICA"}
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-[color:var(--color-main)] transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" aria-hidden="true" />
                      </div>
                      <span className="mt-6 block font-display text-3xl font-black leading-none tracking-tighter text-[color:var(--color-main)]">
                        M-07
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold tracking-tight text-[color:var(--color-main)]">
                        {pilotCopy?.mosaic.m07.title ?? "Preciso de direção para decidir o próximo movimento"}
                      </h3>
                      <p className="mt-2 max-w-md font-sans text-xs leading-relaxed text-[color:var(--color-charcoal-700)] sm:text-sm">
                        {pilotCopy?.mosaic.m07.description ?? "Quando a prioridade ainda não está clara, organizamos cenário, escolhas e uma rota possível de execução."}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* INDEPENDENT SECTION 2.1: SINAIS DE DESALINHAMENTO */}
      <section id="diagnostico" className="tag08-section px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        {/* Subtle grid decor */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
        <div className="absolute top-1/4 left-0 w-[450px] h-[450px] bg-white/[0.01] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/[0.01] rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-16">
          
          {/* Section Introduction */}
          <div className="tag08-section__header text-left">
            <span className="tag08-kicker">
              {diagnosisCopy?.intro.kicker ?? "Sinais de desalinhamento"}
            </span>
            <h2 className="tag08-section__heading font-display font-medium text-3xl sm:text-4xl text-white tracking-tight">
              {diagnosisCopy?.intro.title ?? "Sinais de desgaste quando o digital cresce sem estrutura."}
            </h2>
            <p className="tag08-section__copy text-zinc-400 text-xs sm:text-sm font-sans">
              {diagnosisCopy?.intro.description ?? "Quando a presença digital cresce sem clareza, alguns sintomas começam a aparecer: decisões soltas, urgências constantes, conteúdo sem direção, retrabalho e dificuldade de transformar esforço em percepção real de valor. A TAG08 usa essa leitura para separar o que é problema de comunicação, o que é problema de posicionamento e o que é problema de operação. Sem esse diagnóstico, qualquer execução corre o risco de apenas acelerar a desorganização."}
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
                  title: diagnosisCopy?.overview.discovery.title ?? "Entendimento",
                  badge: diagnosisCopy?.overview.discovery.badge ?? "Leitura do momento",
                  desc: diagnosisCopy?.overview.discovery.desc ?? "Entendimento do momento atual da marca, seus canais, sua comunicação, sua operação e os principais sinais de desalinhamento.",
                  pills: [
                    { id: "idea", label: diagnosisCopy?.overview.discovery.pills[0] ?? "Clareza de contexto" },
                    { id: "brand_friction", label: diagnosisCopy?.overview.discovery.pills[1] ?? "Sinais de desalinhamento" }
                  ]
                },
                { 
                  id: "analysis", 
                  step: "02",
                  title: diagnosisCopy?.overview.analysis.title ?? "Diagnóstico",
                  badge: diagnosisCopy?.overview.analysis.badge ?? "Leitura de causas",
                  desc: diagnosisCopy?.overview.analysis.desc ?? "Leitura dos gargalos encontrados para separar sintomas aparentes de causas reais. Nem todo problema de marketing se resolve com mais conteúdo.",
                  pills: [
                    { id: "bottlenecks", label: diagnosisCopy?.overview.analysis.pills[0] ?? "Causa real" }
                  ]
                },
                { 
                  id: "design", 
                  step: "03",
                  title: diagnosisCopy?.overview.design.title ?? "Direção",
                  badge: diagnosisCopy?.overview.design.badge ?? "Próximos passos",
                  desc: diagnosisCopy?.overview.design.desc ?? "Recomendação do caminho mais coerente para o momento da marca, com prioridades, próximos passos e limites claros.",
                  pills: [
                    { id: "solutions", label: diagnosisCopy?.overview.design.pills[0] ?? "Prioridades" },
                    { id: "scale", label: diagnosisCopy?.overview.design.pills[1] ?? "Próximos passos" }
                  ]
                }
              ].map((phase, pIdx) => {
                const isPhaseSelected = activeDiagPhase === phase.id;
                
                return (
                  <div
                    key={phase.id}
                    role="group"
                    aria-label={diagnosisCopy?.phaseAria.replace("{title}", phase.title) ?? `Diagnóstico: ${phase.title}`}
                    className={`p-6 rounded-[24px] border transition-[background-color,border-color,box-shadow] duration-200 bg-zinc-950/40 relative group text-left cursor-pointer flex flex-col justify-between ${
                      isPhaseSelected
                        ? "border-brand-secondary bg-brand-secondary/[0.02] shadow-[0_8px_32px_rgba(var(--color-brand-secondary-rgb),0.04)]"
                        : "border-white/[0.03] hover:border-white/10"
                    }`}
                  >
                    <button
                      type="button"
                      aria-label={diagnosisCopy?.selectPhaseAria.replace("{title}", phase.title) ?? `Selecionar a fase ${phase.title} do diagnóstico`}
                      aria-pressed={isPhaseSelected}
                      onClick={() => {
                        setActiveDiagPhase(phase.id as any);
                        setHoveredPill(null);
                      }}
                      className="absolute inset-0 z-10 rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-inset"
                    />
                    <div>
                      {/* Interactive indicator and step */}
                      <div className="flex items-center justify-between pb-4 border-b border-white/[0.03]">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full transition-transform duration-300 ${isPhaseSelected ? "bg-brand-secondary scale-125 shadow-[0_0_8px_var(--color-brand-secondary)]" : "bg-zinc-700"}`} />
                          <span className={`text-xs tag08-meta font-black uppercase tracking-widest ${isPhaseSelected ? "text-brand-secondary" : "text-zinc-300"}`}>
                            {phase.badge}
                          </span>
                        </div>
                        <span className="font-sans text-zinc-300 text-xs font-bold">{diagnosisCopy?.phaseLabel.replace("{step}", phase.step) ?? `FASE ${phase.step}`}</span>
                      </div>

                      {/* Phase Info */}
                      <div className="mt-4">
                        <h3 className="font-display font-bold text-base text-white tracking-tight">
                          {phase.title}
                        </h3>
                        <p className="text-zinc-300 text-xs font-sans mt-1">
                          {phase.desc}
                        </p>
                      </div>
                    </div>

                    {/* Tactics Pills inside the column */}
                    <div className="mt-6 space-y-2 relative z-20">
                      <span className="text-xs tag08-meta text-zinc-300 uppercase tracking-widest block font-bold">
                        {diagnosisCopy?.readingPoints ?? "PONTOS DE LEITURA:"}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {phase.pills.map((p) => {
                          const isPillActive = hoveredPill === p.id;
                          
                          return (
                            <button
                              type="button"
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
                              className={`min-h-11 px-3 py-2 rounded-lg text-xs font-sans uppercase tracking-wider transition-[background-color,border-color,color,box-shadow] duration-200 border text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary ${
                                isPillActive
                                  ? "bg-brand-secondary border-brand-secondary text-black font-bold shadow-[0_2px_8px_rgba(var(--color-brand-secondary-rgb),0.15)]"
                                  : isPhaseSelected && hoveredPill === null
                                    ? "bg-zinc-900/80 border-brand-secondary/20 text-zinc-300 hover:border-brand-secondary/60"
                                    : "bg-zinc-950/80 border-white/[0.04] text-zinc-300 hover:text-white hover:border-white/10"
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
                const currentPhaseInfo = diagnosisCopy?.details[activeDiagPhase] ?? DIAGNOSTIQUER_PHASES[activeDiagPhase];
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
                          <span className="tag08-meta text-xs text-brand-secondary font-bold tracking-widest uppercase pb-0.5">
                            {diagnosisCopy?.readingMoment ?? "LEITURA DO MOMENTO"}
                          </span>
                        </div>
                        
                        <h3 className="font-display font-medium text-xl text-white tracking-tight">
                          {currentPhaseInfo.title.split(" // ")[0]}
                        </h3>
                        
                        <p className="text-zinc-300 font-sans text-xs leading-relaxed">
                          {currentPhaseInfo.desc}
                        </p>
                      </div>

                      {/* Severity Metrics indicator */}
                      <div className="space-y-3 pt-6 border-t border-white/[0.03] mt-2">
                        <div className="flex justify-between items-center text-xs font-sans">
                          <span className="text-zinc-300 uppercase tracking-widest">{diagnosisCopy?.misalignmentSignal ?? "SINAL DE DESALINHAMENTO"}</span>
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
                        <p className="text-xs tag08-meta text-zinc-300 uppercase tracking-tight">
                          {diagnosisCopy?.effortInsight ?? "Quando o digital cresce sem estrutura, o esforço aumenta mais rápido que a clareza."}
                        </p>
                      </div>
                    </div>

                    {/* DIREITA: CARDS DE SINTOMAS INDIVIDUAIS EM UM SEGUNDO GRID (col-span-8) */}
                    <div className="col-span-12 lg:col-span-8 border-t lg:border-t-0 lg:border-l border-white/[0.04] pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between space-y-6 relative z-10 text-left">
                      
                      <div className="space-y-4">
                        <span className="tag08-meta text-xs text-zinc-300 font-bold tracking-widest uppercase block border-b border-white/[0.03] pb-2">
                          {diagnosisCopy?.observedSignals ?? "SINAIS OBSERVADOS"}
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
                                onKeyDown={(event) => activateOnKeyboard(event, () => setHoveredPill(symptom.id))}
                                role="button"
                                tabIndex={0}
                                aria-pressed={isThisSymptomActive}
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
                                    <span className={`font-sans text-xs font-bold uppercase ${isThisSymptomActive ? "text-brand-secondary" : "text-zinc-300"}`}>
                                      {diagnosisCopy?.signalPrefix ?? "SINAL //"} {symptom.label}
                                    </span>
                                    <div className={`w-2 h-2 rounded-full ${isThisSymptomActive ? "bg-brand-secondary shadow-[0_0_8px_var(--color-brand-secondary)] animate-pulse" : "bg-red-500/40"}`} />
                                  </div>

                                  <p className="text-zinc-200 text-xs font-semibold leading-relaxed font-sans">
                                    {symptom.desc}
                                  </p>
                                </div>

                                {/* Consequences quote */}
                                <div className="pt-3 border-t border-white/[0.02] space-y-1.5">
                                  <span className="font-sans text-xs text-zinc-300 uppercase tracking-widest block">{diagnosisCopy?.possibleImpact ?? "IMPACTO POSSÍVEL"}</span>
                                  <p className={`text-xs font-sans leading-relaxed italic border-l pl-2.5 py-0.5 rounded ${
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
                          <span className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest">
                            {diagnosisCopy?.interactivePanel ?? "PAINEL INTERATIVO TAG08"}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => {
                            const target = document.getElementById("contato");
                            if (target) {
                              target.scrollIntoView({ behavior: scrollBehavior });
                            } else {
                              onNavigate("/contato");
                              window.scrollTo({ top: 0, behavior: scrollBehavior });
                            }
                          }}
                          className="text-xs text-brand-secondary hover:text-white font-sans font-bold flex items-center gap-1.5 group transition-colors cursor-pointer self-end"
                        >
                          {diagnosisCopy?.requestDiagnosis ?? "SOLICITAR DIAGNÓSTICO INICIAL"} <ArrowNarrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform animate-pulse" />
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


      {/* SECTION 3 - NOSSO DIFERENCIAL (BENTO GRID PREMIUM INSPIRADO NO ACORDO VISUAL SELECIONADO) */}
      <HomeMethodSection
        copy={methodCopy}
        heroEyebrow={pilotCopy?.hero.eyebrow}
        onContact={() => handleLinkClick("/contato")}
      />

      {/* SECTION 4 - PORTFÓLIO DE SOLUÇÕES DE EXCELÊNCIA (BENTO GRID EDITORIAL DE ALTA NAVEGABILIDADE) */}
      {/*
      const MAPA_SOLUCOES_DATA = [
        {
          id: "estrategia-posicionamento",
          title: "Estratégia e posicionamento",
          subtitle: "Clareza antes da execução",
          desc: "Para marcas que precisam entender melhor seu público, reorganizar sua mensagem e comunicar com mais clareza o valor que já possuem.",
          slug: "/servicos/assessoria-marketing-digital-estrategico"
        },
        {
          id: "conteudo-redes-sociais",
          title: "Conteúdo e redes sociais",
          subtitle: "Presença com linha editorial",
          desc: "Para negócios que precisam sair da postagem solta e construir presença com frequência, narrativa, intenção comercial e consistência.",
          slug: "/servicos/gestao-de-redes-sociais"
        },
        {
          id: "producao-audiovisual",
          title: "Produção audiovisual",
          subtitle: "Imagem, fala e bastidores com intenção",
          desc: "Para empresas, especialistas e eventos que precisam transformar vídeo, presença e bastidores em conteúdo com valor de marca.",
          slug: "/servicos/producao-audiovisual"
        },
        {
          id: "branding-identidade",
          title: "Branding e identidade",
          subtitle: "Percepção visual mais coerente",
          desc: "Para marcas que precisam alinhar identidade visual, tom, estética e percepção ao momento atual do negócio.",
          slug: "/servicos/branding-identidade"
        },
        {
          id: "desenvolvimento-web",
          title: "Desenvolvimento web",
          subtitle: "Canal próprio para apresentar e converter",
          desc: "Para marcas que precisam de site, landing page, catálogo ou estrutura digital própria para gerar credibilidade e apoiar o comercial.",
          slug: "/servicos/desenvolvimento-web"
        },
        {
          id: "processos-operacao",
          title: "Processos e operação",
          subtitle: "Menos improviso, mais previsibilidade",
          desc: "Para empresas que cresceram no esforço e agora precisam organizar rotina, responsabilidades, fluxo e tomada de decisão.",
          slug: "/servicos/process-intelligence"
        },
        {
          id: "hospedagem-manutencao",
          title: "Continuidade tecnológica",
          subtitle: "Continuidade depois da entrega",
          desc: "Para negócios que precisam manter seus sites ativos, seguros, atualizados e acompanhados depois da publicação.",
          slug: "/hospedagem-manutencao-sites"
        }
      ];

      */}
      <section id="servicos-principais" className="tag08-section px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
        
        {/* Ambient background decoration */}
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-[350px] h-[350px] bg-white/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Main tablet content card in pure high fashion white */}
          <div className="bg-white text-black p-6 sm:p-12 lg:p-16 rounded-[36px] sm:rounded-[48px] border border-black/[0.08] shadow-[0_28px_72px_rgba(0,0,0,0.55)] overflow-hidden relative">
            
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
            </div>            {/* GIANT EDITORIAL HEADLINE BLOCK */}
            <div className="relative z-10 pt-10 pb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
              <div className="text-left space-y-2 max-w-3xl">
                <p className="tag08-meta text-xs text-zinc-500 tracking-widest uppercase font-extrabold block">
                  {solutionMapCopy?.introLabel ?? "Mapa de soluções"}
                </p>
                <h2 className="font-display font-black text-4xl sm:text-7xl lg:text-[76px] leading-[0.9] tracking-tighter text-black text-balance">
                  {solutionMapCopy?.title ?? "Soluções para cada momento da sua marca."}
                </h2>
              </div>
              <p className="text-zinc-600 text-xs sm:text-sm font-sans font-medium tracking-tight leading-relaxed max-w-md text-left xl:text-right xl:pb-2">
                {solutionMapCopy?.description ?? "A TAG08 não começa oferecendo um pacote pronto. Primeiro entendemos o momento do negócio. Depois indicamos a estrutura mais adequada para organizar presença, posicionamento, conteúdo, tecnologia ou operação."}
              </p>
            </div>

            <div className="relative z-10 -mt-3 mb-8 flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-3">
              <p className="text-sm font-medium text-zinc-700">
                {solutionMapCopy?.orientationPrompt ?? "Ainda não sabe qual caminho escolher?"}
              </p>
              <Link
                href={contactHref}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-sans text-sm font-bold text-accent-readable underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-readable focus-visible:ring-offset-2"
              >
                {solutionMapCopy?.orientationCta ?? "Conte o momento do seu negócio"}
                <ArrowNarrowRightIcon aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative z-10 my-6 space-y-8 sm:space-y-10">
              {localizedSolutionPairs.map((pair, pairIndex) => (
                <div key={`solution-pair-${pairIndex}`} className="relative">
                  <div className="mb-4 flex items-center gap-3 text-[0.65rem] font-black uppercase tracking-[0.16em] text-zinc-500">
                    <span className="shrink-0 text-accent-readable">
                      {String(pairIndex * 2 + 1).padStart(2, "0")}—{String(pairIndex * 2 + pair.length).padStart(2, "0")}
                    </span>
                    <span aria-hidden="true" className="h-px flex-1 bg-black/10" />
                  </div>

                  <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 sm:gap-8">
                    {pair.map((service, pairOffset) => {
                      const index = pairIndex * 2 + pairOffset;
                      const cardBg = "bg-zinc-50 border border-black/10";
                      const textColor = "text-black";
                      const subColor = "text-zinc-600";
                      const labelColor = "text-accent-readable";

                      return (
                        <motion.div
                          key={service.id}
                          data-testid="solution-map-card"
                          whileHover={{ y: -4 }}
                          transition={{ duration: 0.3 }}
                          className={`${cardBg} ${textColor} rounded-[24px] p-6 sm:p-8 lg:p-9 text-left relative overflow-hidden group h-full flex flex-col transition-[border-color,background-color] duration-300 hover:border-black/25`}
                        >
                          <div className="absolute inset-0 grid grid-cols-3 h-full opacity-[0.015] pointer-events-none">
                            <div className="border-r border-black h-full" />
                            <div className="border-r border-black h-full" />
                            <div className="border-r border-black h-full" />
                          </div>

                          <div className="relative z-10 flex min-h-0 flex-1 flex-col">
                            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-current/10 pb-4">
                              <span className={`tag08-meta text-xs tracking-widest uppercase font-bold leading-relaxed ${labelColor}`}>
                                {solutionMapCopy?.moment.replace("{number}", String(index + 1).padStart(2, "0")) ?? `Momento ${String(index + 1).padStart(2, "0")}`}
                              </span>
                              <span className="max-w-[11rem] text-right tag08-meta text-xs uppercase leading-relaxed tracking-widest opacity-60">
                                {service.subtitle}
                              </span>
                            </div>

                            <div className="flex flex-1 flex-col pt-5">
                              <h3 className="font-display text-xl font-black leading-[0.95] tracking-tight sm:text-2xl">
                                {service.title}
                              </h3>
                              <p className={`mt-4 text-xs font-sans leading-relaxed sm:text-sm ${subColor}`}>
                                {service.desc}
                              </p>
                              <p className={`mt-3 text-xs font-sans leading-relaxed ${subColor}`}>
                                <span className="font-bold">{solutionMapCopy?.related ?? "Relacionados:"}</span> {service.related}
                              </p>
                            </div>

                            <div className="mt-6 flex w-full items-center justify-between gap-4 border-t border-current/10 pt-5">
                              <Link
                                href={getLocalizedPath(service.slug, locale)}
                                className="min-h-11 flex items-center gap-1.5 font-sans text-xs font-black uppercase tracking-widest cursor-pointer hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-readable"
                              >
                                {service.cta}
                                <ArrowNarrowRightIcon aria-hidden="true" className="w-3.5 h-3.5" />
                              </Link>
                              <div className={`text-xs tag08-meta uppercase tracking-widest ${labelColor}`}>
                                {String(index + 1).padStart(2, "0")}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-10 flex justify-start mt-2">
              <button
                onClick={() => handleLinkClick("/servicos")}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black text-white px-5 py-3 text-xs tag08-meta font-black tracking-widest uppercase hover:bg-zinc-800 transition-colors"
              >
                {solutionMapCopy?.ctaAll ?? "CONHECER SOLUÇÕES"}
                <ArrowNarrowRightIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="h-4" />

          </div>
        </div>
      </section>


      {/* SECTION 6 - METODOLOGIA */}
      <section id="metodologia" className="py-24 px-6 border-b border-white/[0.04] bg-charcoal-900/10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-semibold">
              {methodologyCopy?.kicker ?? "Da análise à execução"}
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-gradient">
              {methodologyCopy?.title ?? "Depois do diagnóstico, a execução precisa de método."}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              {methodologyCopy?.description ?? "A TAG08 organiza o caminho antes de produzir: entende o cenário, define prioridades, estrutura entregas, acompanha a ativação e ajusta o que precisa evoluir."}
            </p>
          </div>

          {/* Timeline alignment */}
          <div className="relative border-l lg:border-l-0 lg:border-t border-white/[0.05] grid grid-cols-1 lg:grid-cols-5 gap-12 pt-10 pl-6 lg:pl-0">
            {/* Step 1 */}
            <div className="relative space-y-3">
              <div className="absolute -left-[31px] lg:left-0 -top-2 lg:-top-[46px] w-4 h-4 rounded-full bg-brand border-4 border-charcoal-950 z-10" />
              <div className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest">{methodologyCopy?.steps[0].label ?? "01 // ENTENDIMENTO"}</div>
              <h3 className="font-display font-semibold text-white">{methodologyCopy?.steps[0].title ?? "Entendimento"}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {methodologyCopy?.steps[0].desc ?? "Leitura do negócio, objetivos, momento, comunicação, canais, estrutura e restrições relevantes."}
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative space-y-3">
              <div className="absolute -left-[31px] lg:left-0 -top-2 lg:-top-[46px] w-4 h-4 rounded-full bg-brand border-4 border-charcoal-950 z-10" />
              <div className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest">{methodologyCopy?.steps[1].label ?? "02 // DIAGNÓSTICO E DIREÇÃO"}</div>
              <h3 className="font-display font-semibold text-white">{methodologyCopy?.steps[1].title ?? "Diagnóstico e direção"}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {methodologyCopy?.steps[1].desc ?? "Separação entre sintomas e causas para definir prioridades e o caminho mais coerente."}
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative space-y-3">
              <div className="absolute -left-[31px] lg:left-0 -top-2 lg:-top-[46px] w-4 h-4 rounded-full bg-brand border-4 border-charcoal-950 z-10" />
              <div className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest">{methodologyCopy?.steps[2].label ?? "03 // PLANEJAMENTO"}</div>
              <h3 className="font-display font-semibold text-white">{methodologyCopy?.steps[2].title ?? "Planejamento"}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {methodologyCopy?.steps[2].desc ?? "Organização de escopo, sequência de execução, responsabilidades, dependências e critérios de aprovação."}
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative space-y-3">
              <div className="absolute -left-[31px] lg:left-0 -top-2 lg:-top-[46px] w-4 h-4 rounded-full bg-brand border-4 border-charcoal-950 z-10" />
              <div className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest">{methodologyCopy?.steps[3].label ?? "04 // EXECUÇÃO"}</div>
              <h3 className="font-display font-semibold text-white">{methodologyCopy?.steps[3].title ?? "Execução"}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {methodologyCopy?.steps[3].desc ?? "Produção e desenvolvimento alinhados à estratégia, à identidade, ao canal e à capacidade disponível."}
              </p>
            </div>

            {/* Step 5 */}
            <div className="relative space-y-3">
              <div className="absolute -left-[31px] lg:left-0 -top-2 lg:-top-[46px] w-4 h-4 rounded-full bg-brand border-4 border-charcoal-950 z-10" />
              <div className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest">{methodologyCopy?.steps[4].label ?? "05 // EVOLUÇÃO"}</div>
              <h3 className="font-display font-semibold text-white">{methodologyCopy?.steps[4].title ?? "Evolução"}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {methodologyCopy?.steps[4].desc ?? "Análise de aprendizados, resultados e ajustes que precisam entrar no próximo ciclo."}
              </p>
            </div>
          </div>

          <div className="mt-16 text-center border-t border-white/[0.04] pt-8 font-sans text-xs text-zinc-400">
            {methodologyCopy?.closing ?? "Não existe execução consistente sem direção clara."}
          </div>
        </div>
      </section>

      {/* SECTION 6.5 - PRODUÇÃO AUDIOVISUAL */}
      <section id="videos-recentes" className="py-24 px-4 sm:px-6 md:px-8 bg-black border-b border-white/[0.04] relative overflow-hidden">
        {/* Subtle decorative grid overlay and luminous auras */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand/[0.025] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand/[0.015] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Section Header with top badge and clean typography */}
          <div className="max-w-3xl text-left space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
              {videoCopy?.badge ?? "Produção audiovisual"}
            </div>
            
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white leading-[0.9] tracking-tighter">
              {videoCopy?.title ?? "Vídeos, bastidores e narrativas"}{" "}{videoCopy?.titleSecondLine ?? "com intenção de marca."}
            </h2>
            
            <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-sans max-w-2xl">
              {videoCopy?.description ?? "A TAG08 produz conteúdos audiovisuais para marcas, especialistas e eventos que precisam transformar presença, fala, ambiente e bastidores em materiais com clareza, estética e função estratégica."}
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
                      src={`https://www.youtube-nocookie.com/embed/${visibleYoutubeVideos[safeActiveVideoIndex].embedCode}?autoplay=1&rel=0`}
                      title={visibleYoutubeVideos[safeActiveVideoIndex].title}
                      className="w-full h-full border-0 absolute inset-0 rounded-[28px] sm:rounded-[36px]" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowFullScreen
                    ></iframe>
                    
                    {/* Disconnect / Stop Player button overlay in theater mode */}
                    <button 
                      onClick={() => {
                        trackVideoEvent({
                          action: "closed",
                          video_id: visibleYoutubeVideos[safeActiveVideoIndex].embedCode,
                          video_source: "youtube",
                          surface: "home-video-theater",
                          page_path: "/"
                        });
                        setIsPlayingVideo(false);
                      }}
                      className="absolute top-4 right-4 z-40 bg-black/80 hover:bg-black border border-white/20 text-white hover:text-brand font-sans text-xs font-black tracking-widest px-3 py-1.5 rounded-full uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-3 h-3 text-brand" />
                      <span>{videoCopy?.closePlayer ?? "FECHAR PLAYER"}</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Background Visual Backdrop with custom vignette */}
                    <div className="absolute inset-0 z-0 pointer-events-none select-none">
                      <Image
                        src={visibleYoutubeVideos[safeActiveVideoIndex].thumbnail}
                        alt={visibleYoutubeVideos[safeActiveVideoIndex].title}
                        fill
                        sizes="(max-width: 768px) 100vw, 1200px"
                        className="w-full h-full object-cover opacity-75 group-hover:scale-[1.02] transition-transform duration-[1200ms] ease-out brightness-[0.62] contrast-[1.05] grayscale-[45%]"
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
                        <span className="tag08-meta text-xs text-white/95 uppercase tracking-widest font-black">
                          TAG08 AUDIOVISUAL
                        </span>
                      </div>

                      {/* Video Stats/Views label or menu points mimicking Ref 1 */}
                      <span className="tag08-meta text-xs text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/30 px-3 py-1.5 rounded-full uppercase font-black tracking-widest shadow-sm">
                        {visibleYoutubeVideos[safeActiveVideoIndex].views}
                      </span>
                    </div>

                    {/* INTERACTIVE CENTER PLAY OVERLAY (Pulsating icon) */}
                    <div className="relative z-10 flex flex-col items-center justify-center py-6 sm:py-12">
                      <button
                        type="button"
                        aria-label={videoCopy?.watchAria.replace("{title}", visibleYoutubeVideos[safeActiveVideoIndex].title) ?? "Assistir vídeo institucional da TAG08"}
                        onClick={openYoutubePlayer}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand text-black hover:bg-brand-dark flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 active:scale-95 shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.3)] hover:shadow-[0_12px_50px_rgba(var(--color-brand-secondary-rgb),0.5)] cursor-pointer relative group-next"
                      >
                        {/* Ring pulses */}
                        <span className="absolute inset-0 rounded-full bg-brand/30 animate-ping pointer-events-none" />
                        <span className="absolute -inset-2 rounded-full border border-brand/15 animate-pulse pointer-events-none" />
                        <Play className="w-7 h-7 sm:w-9 sm:h-9 text-black fill-current translate-x-0.5 ml-0.5" />
                      </button>
                      <span className="tag08-meta text-xs text-zinc-300 uppercase tracking-widest font-black mt-3 transition-colors group-hover:text-brand">
                        {videoCopy?.watch ?? "ASSISTIR"}
                      </span>
                      {showYoutubeConsentPrompt ? (
                        <div className="mt-4 max-w-sm rounded-2xl border border-white/10 bg-black/80 p-4 text-center shadow-2xl">
                          <p className="text-xs leading-relaxed text-zinc-200">
                            {videoCopy?.consentDescription ?? "Para carregar o player do YouTube, precisamos da sua autorização para conteúdo de redes sociais."}
                          </p>
                          <div className="mt-3 flex justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setShowYoutubeConsentPrompt(false)}
                              className="rounded-lg border border-white/15 px-3 py-2 text-xs tag08-meta font-bold uppercase tracking-wider text-zinc-300"
                            >
                              {videoCopy?.consentDecline ?? "Agora não"}
                            </button>
                            <button
                              type="button"
                              onClick={acceptYoutubeConsentAndPlay}
                              className="rounded-lg bg-brand px-3 py-2 text-xs tag08-action font-black uppercase tracking-wider text-black"
                            >
                              {videoCopy?.consentAccept ?? "Permitir e assistir"}
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {/* BOTTOM TEXT BLOCK OVERLAYS */}
                    <div className="relative z-10 space-y-3 pt-6 border-b border-white/[0.04] pb-4">
                      <div className="flex items-center gap-2">
                        <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black">
                          {visibleYoutubeVideos[safeActiveVideoIndex].category}
                        </span>
                        <span className="text-white/20 text-xs">//</span>
                        <span className="tag08-meta text-xs text-zinc-400 font-bold uppercase tracking-wider">
                          {videoCopy?.duration.replace("{duration}", visibleYoutubeVideos[safeActiveVideoIndex].duration) ?? `DURAÇÃO: ${visibleYoutubeVideos[safeActiveVideoIndex].duration} MIN`}
                        </span>
                      </div>
                      
                      <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tighter leading-none">
                        {visibleYoutubeVideos[safeActiveVideoIndex].title}
                      </h3>
                      
                      <p className="max-w-[66ch] text-zinc-300 text-xs sm:text-xs font-sans leading-relaxed font-medium line-clamp-4">
                        <span className="mb-1 block tag08-meta text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                          {videoCopy?.about ?? "Sobre este vídeo"}
                        </span>
                        {getVideoDescriptionPreview(visibleYoutubeVideos[safeActiveVideoIndex].description)}
                      </p>
                    </div>

                    {/* LOWER ACCURACY WATERMARKS (Meticulously structured) */}
                    <div className="relative z-10 flex items-center justify-between pt-1">
                    <span className="tag08-meta text-xs text-white/30 uppercase tracking-widest">
                        {videoCopy?.portfolio ?? "PORTFÓLIO AUDIOVISUAL"} // TAG08
                      </span>
                      <div className="flex items-center gap-1.5 font-sans text-xs text-brand-secondary font-black bg-white/[0.02] border border-white/5 py-1 px-3 rounded-lg uppercase">
                        <span>#</span>
                        <span>{visibleYoutubeVideos[safeActiveVideoIndex].tagline}</span>
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
                    <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-bold">{videoCopy?.portfolio ?? "PORTFÓLIO AUDIOVISUAL"}</span>
                    <span className="font-display font-black text-lg text-white uppercase tracking-tight mt-1">{videoCopy?.formats ?? "FORMATOS"}</span>
                  </div>
                  
                  {/* Subtle record badge */}
                  <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse shadow-[0_0_8px_var(--color-brand-secondary)]" />
                </div>

                {/* Vertical list of episodes mimicking Ref 2 sidebar cards style */}
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {visibleYoutubeVideos.map((item, idx) => {
                    const isActive = idx === safeActiveVideoIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          trackVideoEvent({
                            action: "selected",
                            video_id: item.embedCode,
                            video_source: "youtube",
                            surface: "home-video-playlist",
                            page_path: "/"
                          });
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
                          <Image
                            src={item.thumbnail} 
                            alt={item.title} 
                            fill
                            sizes="64px"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/25" />
                          
                          {/* Duration Tag overlay */}
                          <span className="absolute bottom-1 right-1 font-sans text-xs bg-black/80 border border-white/10 px-1 rounded text-white font-extrabold">
                            {item.duration}
                          </span>
                        </div>

                        {/* Text summary info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 text-left">
                          <div className="space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className={`font-sans text-xs font-bold ${isActive ? "text-black/60" : "text-brand"}`}>
                                {videoCopy?.episode.replace("{number}", String(idx + 1).padStart(2, "0")) ?? `EPISÓDIO ${String(idx + 1).padStart(2, "0")}`}
                              </span>
                              <span className={`font-sans text-xs ${isActive ? "text-black/60" : "text-zinc-400"}`}>
                                {item.date}
                              </span>
                            </div>
                            <h3 className={`font-display font-black text-xs uppercase tracking-tight line-clamp-2 leading-tight ${isActive ? "text-black" : "text-white"}`}>
                              {item.title}
                            </h3>
                          </div>

                          <div className="flex items-center justify-between pt-1 font-sans text-xs">
                            <span className={isActive ? "text-black/80 font-semibold" : "text-zinc-400"}>
                              {item.views}
                            </span>
                          </div>
                        </div>

                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom CTA Box for audiovisual services */}
              <div className="bg-[#121215] border border-white/5 rounded-2xl p-4 flex flex-col space-y-3 relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/[0.03] rounded-full blur-xl pointer-events-none" />
                
                <div className="space-y-1">
                  <span className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest block font-bold">{videoCopy?.portfolio ?? "PORTFÓLIO AUDIOVISUAL"} // {locale === "pt" && contentSources.youtube === "live" ? (videoCopy?.activeCuration ?? "CURADORIA ATIVA") : (videoCopy?.internalCuration ?? "CURADORIA INTERNA")}</span>
                  <h3 className="text-white font-semibold text-xs leading-tight">{videoCopy?.ctaTitle ?? "Quer conhecer a produção audiovisual da TAG08?"}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    {videoCopy?.ctaDescription ?? "Veja como a TAG08 organiza imagem, fala e bastidores em entregas com clareza, estética e função de marca."}
                  </p>
                </div>
                
                <a
                  href="/servicos/producao-audiovisual"
                  onClick={(e) => { e.preventDefault(); handleLinkClick("/servicos/producao-audiovisual"); }}
                  className="group w-full flex items-center justify-between bg-red-600 hover:bg-red-700 text-white font-sans font-black text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-lg transition-all text-center cursor-pointer select-none"
                >
                  <span className="flex items-center gap-1.5">
                    {videoCopy?.ctaButton ?? "CONHECER PRODUÇÃO AUDIOVISUAL"}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* SECTION 8 - INSTITUCIONAL CTA */}
      <section id="sobre-simples" className="border-b border-white/[0.04] bg-charcoal-900/10 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="tag08-meta text-xs font-semibold uppercase tracking-widest text-brand">
            {institutionalCopy?.badge ?? "Sobre a TAG08"}
          </span>
          <h2 className="mt-3 font-display text-3xl font-medium text-gradient sm:text-4xl">
            {institutionalCopy?.title ?? "Conheça quem está por trás do trabalho."}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">
            {institutionalCopy?.description ?? "Veja a história, a equipe e os critérios que orientam as decisões da TAG08."}
          </p>
          <button
            type="button"
            onClick={() => handleLinkClick("/sobre")}
            className="mt-6 rounded-lg bg-brand px-6 py-3.5 font-sans text-xs font-semibold text-black transition-all duration-200 hover:bg-brand-dark"
          >
            {institutionalCopy?.button ?? "CONHECER A TAG08"}
          </button>
        </div>
      </section>

      {/* PORTFÓLIO DE TESTEMUNHOS & CASOS DE CLIENTES (UNIFICADO - O CLIENTE DICTA A REVOLUÇÃO) */}
      {((locale !== "pt") || visibleClientCases.length > 0) && <section id="portfolio-marcas" data-testid="home-client-cases" className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
        
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
              <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-extrabold block">
                {casesCopy?.eyebrow ?? "CASES & POSICIONAMENTO DIGITAL"}
              </span>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.9] tracking-tighter">
                {casesCopy?.titleFirstLine ?? "O CLIENTE DICTA"} <br />
                {casesCopy?.titleSecondLine ?? "A REVOLUÇÃO_"}
              </h2>
            </div>

            {/* Direct contact CTA */}
            <a 
              href="/contato"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("/contato");
              }}
              className="inline-flex items-center gap-4 bg-charcoal-900 hover:bg-white/[0.04] border border-white/10 px-5 py-3 rounded-2xl transition-all duration-300 self-start md:self-end group shrink-0 shadow-lg hover:border-brand/35"
            >
              <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-black transition-all shadow-md">
                <ArrowNarrowRightIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left font-sans">
                <span className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest font-bold">{casesCopy?.directContact ?? "Contato direto"}</span>
                <span className="text-white text-xs font-semibold group-hover:text-brand transition-colors flex items-center gap-1.5 font-sans">
                  {casesCopy?.contactCta ?? "FALAR COM A TAG08"} <ArrowNarrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </a>
          </div>

          {clientCasesLocaleReady && visibleClientCases.length > 0 ? <>
          {/* Asymmetric Split-Screen Bento-Grid Layout for Cases & Testimonials */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
            
            {/* Left Hand: Sleek list of Cases with detailed info and indicators */}
            <div className="lg:col-span-4 flex flex-col justify-start space-y-4">
              <div className="border-b border-white/[0.05] pb-4 mb-2">
                <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black block">
                  {casesCopy?.selector ?? "CRAFTSMANSHIP FILE // SELECTOR"}
                </span>
                <span className="font-sans text-xs text-zinc-400 uppercase tracking-widest font-bold block mt-1">
                  {casesCopy?.selectorHint ?? "Selecione pauta editorial e marque a diferença executiva:"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {visibleClientCases.map((cc, index) => {
                  const isActive = index === activeSlide;
                  return (
                    <button
                      key={cc.id}
                      data-evidence-key={`home-case/${cc.id}`}
                      aria-pressed={isActive}
                      onClick={() => setActiveSlide(index)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                        isActive
                          ? "bg-brand text-black border-brand shadow-[0_12px_30px_rgba(var(--color-brand-rgb),0.14)]"
                          : "bg-charcoal-900/40 border-white/[0.04] text-zinc-400 hover:text-white hover:border-white/10 hover:bg-charcoal-900/60"
                      }`}
                    >
                      {/* Active sidebar highlight accent */}
                      {isActive && (
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-black" />
                      )}

                      <div className="flex items-center gap-3">
                        <span className={`font-sans text-xs font-black uppercase ${isActive ? "text-black/60" : "text-brand"}`}>
                          {String(index + 1).padStart(2, '0')}.
                        </span>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-display font-black text-sm uppercase tracking-tight truncate ${isActive ? "text-black" : "text-white"}`}>
                            {cc.name}
                          </h3>
                          <EvidenceReviewBadge evidenceKey={`home-case/${cc.id}`} />
                          <p className={`font-sans text-xs truncate ${isActive ? "text-black/80" : "text-zinc-400"}`}>
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
                            className={`tag08-meta text-xs px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ${
                              isActive 
                              ? "bg-black/10 border border-black/10 text-black/90" 
                                : "bg-white/[0.02] border border-white/[0.05] text-zinc-400"
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
                  <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest font-extrabold">
                    MÁXIMA RETENÇÃO VISUAL
                  </span>
                </div>
                <span className="font-sans text-xs text-brand font-bold bg-brand/5 border border-brand/10 px-1.5 rounded">
                  DIREÇÃO DE FLUXO TOTAL
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
                    <Image
                      src={visibleClientCases[activeSlide].backgroundImg}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 1200px"
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
                      {visibleClientCases[activeSlide].categoryTags.map((tag) => (
                        <span 
                          key={tag} 
                          className="tag08-meta text-xs tracking-widest text-brand border border-brand/30 px-3 py-1 rounded-full uppercase font-bold bg-black/60 backdrop-blur-sm shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Star Logo under ambient glow spinning continuous */}
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 opacity-50 mix-blend-screen shrink-0" aria-hidden="true">
                      <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full text-brand fill-current"
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
                      <div className="absolute inset-0 bg-brand/20 rounded-full blur-xl scale-75" />
                    </div>
                  </div>

                  {/* MIDDLE QUOTE & POSITIONING HEADER (Using layered curved details cards) */}
                  <div className="relative z-10 space-y-4 max-w-2xl mt-auto pt-4">
                    <span className="tag08-meta text-xs text-brand tracking-widest uppercase font-extrabold block">
                      {visibleClientCases[activeSlide].caseName}
                    </span>
                    
                    <h3 className="font-display font-black text-2.5xl sm:text-4xl md:text-[40px] text-brand leading-[0.95] tracking-tighter mb-2">
                      {visibleClientCases[activeSlide].tagline}
                    </h3>

                    <div className="relative">
                      <p className="text-white text-sm sm:text-base font-sans font-medium tracking-tight leading-relaxed italic block">
                        “{visibleClientCases[activeSlide].quote}”
                      </p>
                    </div>
                  </div>

                  {/* BOTTOM PROFILE WRAPPER MATCHING USER MOCKUP */}
                  <div className="relative z-10 flex items-center justify-between border-t border-white/[0.08] pt-4 mt-5">
                    <div className="hidden sm:block">
                      <EvidenceReviewBadge evidenceKey={`home-case/${visibleClientCases[activeSlide].id}`} />
                    </div>

                    {/* Profile card absolute design accuracy */}
                    <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-full py-1.5 pl-2 pr-4 border border-white/10 shadow-lg ml-auto">
                      <Image
                        src={visibleClientCases[activeSlide].avatar}
                        alt=""
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover border-2 border-brand"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col text-left">
                        <span className="text-white text-xs font-bold leading-tight uppercase font-sans">
                          {visibleClientCases[activeSlide].name}
                        </span>
                        <span className="text-brand font-sans text-xs tracking-wider font-semibold">
                          {visibleClientCases[activeSlide].handle}
                        </span>
                      </div>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

          </div>
          </> : <div role="status" className="rounded-2xl border border-white/[0.08] bg-charcoal-900/40 px-6 py-8 text-left">
            <h3 className="font-display text-lg font-semibold text-white">{casesCopy?.unavailableTitle}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">{casesCopy?.unavailableDescription}</p>
          </div>}
        </div>
      </section>}

      {/* SECTION 8.5 - GOOGLE MY BUSINESS REVIEWS */}
      {contentSources.googleBusiness === "live" && gmbReviewsLocale === locale && reviewsLocaleReady && visibleGmbReviews.length > 0 && <section id="avaliacoes-gmb" className="py-24 px-6 border-b border-white/[0.04] bg-charcoal-900/20 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 border-b border-white/[0.05] pb-8">
            <div className="space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/10 bg-brand/5 tag08-meta text-xs uppercase tracking-widest text-brand-secondary font-black">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" /> {reviewsCopy?.trustBadge ?? "Confiança construída na prática"}
              </div>
              
              <h2 className="font-display font-black text-3xl sm:text-4xl text-gradient leading-none tracking-tighter">
                {reviewsCopy?.title ?? "Experiências acompanhadas com clareza"}
              </h2>
              
              <p className="text-zinc-400 text-xs sm:text-sm font-sans max-w-2xl">
                {reviewsCopy?.description ?? "Quando o trabalho tem diagnóstico, clareza e acompanhamento, o cliente entende melhor o caminho, participa das decisões e percebe mais coerência entre estratégia e entrega."}
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
                  <span className="font-display font-black text-2xl text-white tracking-tight leading-none">{reviewsCopy?.ratingTitle ?? "AVALIAÇÕES"}</span>
                </div>
                <p className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest mt-1 font-bold">
                  {reviewsCopy?.ratingDescription ?? "Avaliações ajudam a registrar percepções, mas a confiança se sustenta no acompanhamento, na clareza e na coerência da entrega."}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive GMB Review Presentation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
            {/* Left side: Pure Portrait Gallery Column with premium physical carousel wheel tracking */}
            <div className="lg:col-span-3 w-full overflow-hidden h-[170px] sm:h-[195px] lg:h-[500px] relative flex items-center lg:items-start select-none">
              <motion.div
                animate={isLargeScreen 
                  ? { y: -safeActiveReview * (148 + 16), x: 0 }
                  : { x: typeof window !== "undefined" && window.innerWidth >= 640 ? -safeActiveReview * (98 + 16) : -safeActiveReview * (85 + 16), y: 0 }
                }
                transition={{ type: "spring", stiffness: 140, damping: 22 }}
                className="flex flex-row lg:flex-col gap-4 absolute left-4 sm:left-6 lg:left-0 lg:top-0 h-[140px] sm:h-[160px] lg:h-auto items-center lg:items-center w-max lg:w-full py-2"
              >
                {visibleGmbReviews.map((rev, index) => {
                  const isActive = index === safeActiveReview;
                  return (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setActiveReview(index)}
                      aria-pressed={isActive}
                      aria-label={(reviewsCopy?.ariaReview ?? "Ver avaliação de {name}").replace("{name}", rev.name)}
                      className={`shrink-0 cursor-pointer text-left transition-all duration-500 overflow-hidden relative rounded-2xl sm:rounded-[22px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 ${
                        isActive
                          ? "w-[105px] h-[140px] sm:w-[120px] sm:h-[160px] lg:w-[135px] lg:h-[180px] border-2 border-brand-secondary shadow-[0_4px_30px_rgba(var(--color-brand-secondary-rgb),0.2)] scale-105 z-10 opacity-100 grayscale-0"
                          : "w-[85px] h-[115px] sm:w-[98px] sm:h-[132px] lg:w-[110px] lg:h-[148px] border border-white/[0.06] opacity-35 grayscale hover:opacity-75 hover:grayscale-0 scale-95 hover:scale-98"
                      }`}
                    >
                      {/* Portrait headshot image fills container */}
                      <Image
                        src={rev.avatar}
                        alt=""
                        width={135}
                        height={180}
                        className="w-full h-full object-cover transition-all duration-700 pointer-events-none"
                        referrerPolicy="no-referrer"
                      />

                      {/* Active highlighted subtle indicator pill in corner */}
                      {isActive && (
                        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-secondary shadow-[0_0_10px_var(--color-brand-secondary)]" />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            </div>

            {/* Right side: Selected Active Detail Presentation Card */}
            <div className="lg:col-span-9 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={safeActiveReview}
                  initial={{ opacity: 0, x: 20, scale: 0.99 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.99 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="bg-charcoal-900/90 border border-white/[0.06] p-6 sm:p-10 lg:p-12 rounded-[28px] sm:rounded-[36px] relative overflow-hidden text-left shadow-2xl flex flex-col justify-between min-h-[380px] w-full group/card"
                >
                  {/* Absolute giant background quote marks mimicking the image mockup exactly */}
                  <span className="font-serif text-[180px] sm:text-[230px] text-white/[0.04] absolute right-6 sm:right-10 -top-8 sm:-top-12 leading-none select-none pointer-events-none font-black italic">
                    “
                  </span>

                  <div className="space-y-6 relative z-10 flex-1 flex flex-col justify-center">
                    {/* High-impact tagline summary in elegant sentence case as shown in the mockup */}
                    <h3 className="font-display font-medium text-lg sm:text-2xl lg:text-[28px] text-white leading-normal tracking-tight max-w-[95%]">
                      {visibleGmbReviews[safeActiveReview].tagline}
                    </h3>

                    {/* Supporting comprehensive details text (the body of the review) */}
                    <p className="text-zinc-400 text-xs sm:text-sm md:text-sm leading-relaxed font-sans font-normal">
                      {showOriginalReview ? visibleGmbReviews[safeActiveReview].original?.text ?? visibleGmbReviews[safeActiveReview].text : visibleGmbReviews[safeActiveReview].text}
                    </p>
                    {visibleGmbReviews[safeActiveReview].machineTranslated ? (
                      <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-zinc-400">
                        <span>{externalCopy.machineTranslationLabel}</span>
                        <button
                          type="button"
                          onClick={() => setShowOriginalReview((current) => !current)}
                          className="text-brand hover:underline"
                        >
                          {showOriginalReview ? externalCopy.hideOriginalLabel : externalCopy.showOriginalLabel}
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-8 pt-6 border-t border-dashed border-white/[0.08] relative z-10">
                    {/* Bottom row displaying Author profile and 5-stars aligned exactly with mockup */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={visibleGmbReviews[safeActiveReview].avatar}
                          alt={visibleGmbReviews[safeActiveReview].name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover border-2 border-brand-secondary"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-left font-sans">
                          <h3 className="text-white font-display font-semibold text-sm">
                            {visibleGmbReviews[safeActiveReview].name}
                          </h3>
                          <p className="text-zinc-400 font-sans text-xs mt-0.5">
                            {visibleGmbReviews[safeActiveReview].role} ⬢ {visibleGmbReviews[safeActiveReview].time}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <span className="font-sans text-xs uppercase tracking-widest text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2 py-0.5 rounded">
                          {visibleGmbReviews[safeActiveReview].category} // {reviewsCopy?.googleVerified ?? "GOOGLE VERIFIED"}
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
                {reviewsCopy?.ratingDescription ?? "Avaliações ajudam a registrar percepções, mas a confiança se sustenta no acompanhamento, na clareza e na coerência da entrega."}
              </p>
            </div>
            <a
              href="/contato"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("/contato");
              }}
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-brand hover:text-black border border-white/10 hover:border-brand text-xs text-white font-sans font-bold uppercase tracking-widest py-2.5 px-5 rounded-xl transition-all duration-300 shrink-0 cursor-pointer"
            >
              <span>{reviewsCopy?.cta ?? "FALAR COM A TAG08"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </section>}

      {/* SECTION 9 - SEGURANÇA OPERACIONAL & DESIGNS HIGH-END (MATCHING USER REFERENCE DESIGN) */}
      <section id="prova" className="py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        {/* Luminous Container mimicking the uploaded design mockup */}
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-charcoal-900 border border-brand/30 text-white p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(0,0,0,0.34)]">
          
          {/* Internal subtle background paper/dot layout */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          {/* Left Column: Ultra-stylish Portrait layout adorned with design overlays just like "designbr" in reference */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[520px]">
            {/* Dark background silhouette framing to lift the image */}
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden" />
            
            <Image 
              src={creativeLeaderPortrait} 
              alt={proofCopy?.imageAlt ?? "TAG08 Creative Director"}
              className="absolute inset-0 w-full h-full object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[15%] transition-all duration-500 hover:scale-105"
            />
            
            {/* Styled aesthetic watermark overlays mimicking reference image */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between items-start">
                <span className="tag08-meta text-xs text-white/65 bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/10">
                  {proofCopy?.operationalCore ?? "Núcleo operacional"}
                </span>
              </div>

            </div>
          </div>

          {/* Right Column: Dynamic Typography, Action Prompt & Overlaid Curved Card */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 text-left h-full relative z-10 lg:pl-4">
            
            <div className="space-y-4">
              {/* Upper social network link */}
              <div className="inline-flex items-center gap-2 text-brand font-semibold">
                <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                </div>
                <span className="tag08-meta text-xs tracking-widest uppercase font-bold text-brand">
                  {proofCopy?.direction ?? "Presença com direção"}
                </span>
              </div>

                {/* Massive Bold Heading mirroring reference */}
                <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.9] tracking-tighter">
                {proofCopy?.titleFirstLine ?? "Presença"} <br />
                {proofCopy?.titleSecondLine ?? "com direção."}
                </h2>

                {/* Description Paragraph with high contrast block typeface layout */}
              <p className="text-zinc-300 text-xs sm:text-xs max-w-lg leading-relaxed font-sans font-bold uppercase">
                {proofCopy?.description ?? "Uma marca não precisa apenas aparecer. Precisa ser compreendida pelo público certo, apresentar seu valor com coerência e sustentar aquilo que comunica. Estratégia define escolhas. Conteúdo constrói entendimento. Tecnologia cria estrutura. Processo ajuda a sustentar a execução."}
              </p>
            </div>

            {/* Overlaid Premium Curved Dark Action Card modeled exactly off the uploaded picture */}
            <div className="bg-black/80 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 max-w-md relative overflow-hidden text-left">
              {/* Glowing decorative indicator circle */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />

              {/* Row 1: Green circular arrow button block */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black shrink-0 shadow-lg shadow-brand/10 hover:scale-105 transition-transform duration-200">
                  <ArrowUpRight className="w-5 h-5 rotate-45 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5">
                    <span className="tag08-meta text-xs text-brand uppercase tracking-wider font-extrabold block">
                    {proofCopy?.prompt ?? "Presença sem direção vira ruído."}
                    </span>
                    <p className="text-white text-xs leading-snug font-sans font-semibold">
                    {proofCopy?.intro ?? "A conversa inicial começa pelo entendimento do momento atual."}
                    </p>
                  </div>
                </div>

              {/* DUAL CLIENT CONNECTION CHANNELS (BR & INT) */}
              <div className="space-y-3">
                <a 
                  href={buildBrazilWhatsAppUrl(proofCopy?.whatsappMessage ?? "Olá, gostaria de falar com a TAG08")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleOutboundClick("WhatsApp Brasil", buildBrazilWhatsAppUrl(proofCopy?.whatsappMessage ?? "Olá, gostaria de falar com a TAG08"), "home-operational-proof-br")}
              className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-black transition-all duration-200">
                        <span className="text-xs font-sans font-black tracking-tight text-brand group-hover:text-black">BR</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="tag08-meta text-xs text-zinc-500 uppercase font-black tracking-wider leading-none">
                          {proofCopy?.whatsappDirect ?? "DIRETO NO WHATSAPP"}
                        </span>
                        <span className="text-white text-xs font-sans font-bold tracking-wider group-hover:text-brand transition-colors mt-0.5">
                          +55 83 9.9886-8882
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-brand tag08-meta font-bold uppercase tracking-wider bg-brand/10 py-1 px-2.5 rounded-lg group-hover:bg-brand group-hover:text-black transition-all">
                      {proofCopy?.talkToTag08 ?? "FALAR COM A TAG08"}
                    </span>
                  </div>
                </a>

                <a 
                  href={buildInternationalWhatsAppUrl(proofCopy?.whatsappMessage ?? "Hello, I would like to speak with TAG08")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleOutboundClick("WhatsApp International", buildInternationalWhatsAppUrl(proofCopy?.whatsappMessage ?? "Hello, I would like to speak with TAG08"), "home-operational-proof-int")}
              className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary shrink-0 group-hover:bg-brand-secondary group-hover:text-black transition-all duration-200">
                        <span className="text-xs font-sans font-black tracking-tight text-brand-secondary group-hover:text-black">INT</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="tag08-meta text-xs text-zinc-500 uppercase font-black tracking-wider leading-none">
                          {proofCopy?.internationalDirect ?? "INTERNATIONAL DIRECT"}
                        </span>
                        <span className="text-white text-xs font-sans font-bold tracking-wider group-hover:text-brand-secondary transition-colors mt-0.5">
                          +56 9 9793 7611
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-brand-secondary tag08-meta font-bold uppercase tracking-wider bg-brand-secondary/10 py-1 px-2.5 rounded-lg group-hover:bg-brand-secondary group-hover:text-black transition-all">
                      {proofCopy?.talkToTag08 ?? "FALAR COM A TAG08"}
                    </span>
                  </div>
                </a>
              </div>

              {/* Row 3: Logo label alignment with live glowing green badge indicator */}
              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                  <span className="tag08-meta text-xs text-white/50 uppercase tracking-widest font-extrabold">
                    TAG08
                  </span>
                </div>
                <span className="font-sans text-xs text-brand font-bold bg-brand/10 border border-brand/20 px-2 rounded">
                  {proofCopy?.operationActive ?? "OPERAÇÃO ATIVA"}
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
                  {faqCopy?.badge ?? "Dúvidas importantes antes da conversa"}
                </div>
                
                {/* Section titles */}
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter">
                  {faqCopy?.titleFirstLine ?? "Dúvidas importantes"} <br />
                  {faqCopy?.titleSecondLine ?? "antes da conversa."}
                </h2>
                
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-sans max-w-sm">
                  {faqCopy?.description ?? "Respostas para entender o papel da TAG08, a escolha do serviço, o escopo, o início e as expectativas de resultado."}
                </p>
              </div>

              {/* Vertical list of Accordion Triggers */}
              <div className="space-y-3 pt-4">
                {(faqCopy?.questions ?? [
                  "Qual é o papel da TAG08?",
                  "Como escolhemos o serviço?",
                  "Como funcionam pacotes e escopo?",
                  "Quando o projeto pode começar?",
                  "Como a TAG08 trata resultados e expectativas?"
                ]).map((title, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveFaq(index)}
                    id={`home-faq-question-${index}`}
                    aria-expanded={activeFaq === index}
                    aria-controls="home-faq-panel"
                    className={`min-h-11 w-full flex items-center justify-between p-4 rounded-xl border transition-[background-color,border-color,color,box-shadow] duration-200 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset ${
                      activeFaq === index
                        ? "bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)]"
                        : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                    }`}
                  >
                    <span className="tag08-meta text-xs font-black uppercase tracking-wider flex items-center gap-3">
                      <span className={activeFaq === index ? "text-black" : "text-brand"}>
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      {title}
                    </span>
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                      activeFaq === index ? "text-black rotate-[-45deg] stroke-[2.5]" : "text-zinc-500"
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Middle Column: Cover portrait with coiled text & the answer block superimposed */}
            <div className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-white/[0.04] bg-[#0c0c0e]">
              {/* Cover Image backdrop */}
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                alt={faqCopy?.imageAlt ?? "TAG08 Office Workspace"}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
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
              <div className="absolute top-6 left-6 z-10 pointer-events-none tag08-meta text-xs text-white/20 uppercase tracking-widest leading-none">
                SYS // OPERATIONS_CORE
              </div>

              {/* Dynamic Answer panel floating bottom-aligned inside the picture card */}
              <div id="home-faq-panel" role="region" aria-labelledby={`home-faq-question-${activeFaq}`} className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left">
                <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black block">
                  {(faqCopy?.categories ?? [
                    "ENTENDIMENTO",
                    "DIAGNÓSTICO",
                    "ESCOPO",
                    "TEMPO DE INÍCIO",
                    "EXPECTATIVA"
                  ])[activeFaq]}
                </span>
                
                <h3 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {(faqCopy?.questions ?? [
                    "Qual é o papel da TAG08?",
                    "Como escolhemos o serviço?",
                    "Como funcionam pacotes e escopo?",
                    "Quando o projeto pode começar?",
                    "Como a TAG08 trata resultados e expectativas?"
                  ])[activeFaq]}
                </h3>
                
                <p className="text-zinc-300 text-xs sm:text-xs leading-relaxed font-sans font-medium">
                  {(faqCopy?.answers ?? [
                    "A TAG08 atua com estratégia, comunicação, design, conteúdo, tecnologia e processos. Algumas entregas são típicas de uma agência de marketing; a diferença está na forma de diagnosticar e organizar o caminho antes da execução.",
                    "Não é necessário chegar sabendo qual solução contratar. O contexto inicial ajuda a identificar se o problema está em posicionamento, conteúdo, identidade, audiovisual, web, processos ou na combinação entre essas frentes.",
                    "Existem soluções estruturadas, mas a recomendação considera momento, maturidade, capacidade de investimento e participação necessária do cliente. O objetivo é preservar aderência entre problema, escopo e expectativa.",
                    "O início depende do tipo de projeto, das informações necessárias, da capacidade operacional e das etapas de alinhamento. Diagnóstico, escopo, responsáveis e dependências são organizados antes da execução.",
                    "A TAG08 não trabalha com promessa de crescimento instantâneo ou resultado garantido. O compromisso está em método, direção, execução responsável, acompanhamento e melhoria contínua."
                  ])[activeFaq]}
                </p>
              </div>
            </div>

            {/* Right Column: Mini auxiliary action cards */}
            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              {/* Card 1: Dark gray background elegant option panel */}
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest block font-bold">{faqCopy?.rightCardTitle ?? "COMO A TAG08 TRABALHA"}</span>
                  <h3 className="text-white font-semibold text-sm leading-snug">{faqCopy?.rightCardHeading ?? "Diagnóstico antes da proposta."}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    {faqCopy?.rightCardDescription ?? "Organizamos entendimento, prioridades e escopo antes de iniciar qualquer entrega."}
                  </p>
                </div>
                <button
                  onClick={() => handleLinkClick("/servicos")}
                  className="group flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5"
                >
                  <span>{faqCopy?.solutions ?? "VER SOLUÇÕES"}</span>
                  <ArrowNarrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* Card 2: Bright Neon / Brand color block */}
              <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-black/60 uppercase tracking-widest block font-extrabold">{faqCopy?.nextStep ?? "PRÓXIMO PASSO"}</span>
                  <h3 className="text-black font-black text-sm leading-tight tracking-tight">{faqCopy?.brandCardTitle ?? "O melhor caminho começa pelo entendimento do momento atual."}</h3>
                  <p className="text-black/85 text-xs font-semibold leading-relaxed font-sans">
                    {faqCopy?.brandCardDescription ?? "Antes de uma proposta, a TAG08 organiza o contexto: o que a empresa quer construir, o que está travando esse avanço e qual estrutura consegue sustentar a próxima etapa."}
                  </p>
                </div>
                <a
                  href="/contato"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick("/contato");
                  }}
                  className="group flex items-center justify-between text-xs font-sans font-black text-black select-none border-t border-black/10 pt-3 hover:translate-x-0.5 transition-all"
                >
                  <span>{faqCopy?.contactCta ?? "ENTENDER MEU MELHOR CAMINHO"}</span>
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





