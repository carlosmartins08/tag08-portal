import { TAG08_OFFICIAL_YOUTUBE_URL } from "../config/siteNetwork";

export type OfficialContentSourceStatus = "live" | "fallback" | "partial" | "disabled" | "error";

export type OfficialYouTubeVideo = {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  category: string;
  thumbnail: string;
  embedCode: string;
  videoUrl: string;
  views: string;
  tagline: string;
  source: OfficialContentSourceStatus;
};

export type OfficialGoogleReview = {
  name: string;
  role: string;
  avatar: string;
  time: string;
  tagline: string;
  text: string;
  category: string;
  source: OfficialContentSourceStatus;
};

export type OfficialContentBundle = {
  youtubeVideos: OfficialYouTubeVideo[];
  gmbReviews: OfficialGoogleReview[];
  sources: {
    youtube: OfficialContentSourceStatus;
    googleBusiness: OfficialContentSourceStatus;
  };
  fetchedAt?: string;
};

export type OfficialContentApiResponse = {
  ok: boolean;
  status: OfficialContentSourceStatus;
  sources: OfficialContentBundle["sources"];
  youtubeVideos: OfficialYouTubeVideo[];
  gmbReviews: OfficialGoogleReview[];
  fetchedAt?: string;
  error?: string;
};

const DEFAULT_YOUTUBE_VIDEO_URL = TAG08_OFFICIAL_YOUTUBE_URL;

const fallbackAvatarGradient = (name: string) => {
  const palette = ["#0A0A0A", "#111111", "#171717", "#1F2937", "#2D2D2D"];
  const index = Math.abs(name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % palette.length;
  return palette[index];
};

export const createAvatarDataUri = (name: string, accent = "#D4FF00") => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  const background = fallbackAvatarGradient(name);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${background}" />
          <stop offset="100%" stop-color="#000000" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="60" fill="url(#bg)" />
      <circle cx="60" cy="60" r="52" fill="none" stroke="${accent}" stroke-opacity="0.28" stroke-width="2" />
      <text
        x="50%"
        y="54%"
        fill="${accent}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="38"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="middle"
      >${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;
};

export const formatCompactDate = (date: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);

export const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  if (diffDays < 7) {
    return `há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
  }

  if (diffDays < 30) {
    const weeks = Math.max(1, Math.floor(diffDays / 7));
    return `há ${weeks} semana${weeks > 1 ? "s" : ""}`;
  }

  const months = Math.max(1, Math.floor(diffDays / 30));
  return `há ${months} mês${months > 1 ? "es" : ""}`;
};

export const formatViewCount = (value: number | string) => {
  const numeric = typeof value === "string" ? Number(value) : value;
  const safeNumeric = Number.isFinite(numeric) ? numeric : 0;
  return `${new Intl.NumberFormat("pt-BR").format(safeNumeric)} visualizações`;
};

export const formatIsoDuration = (duration: string) => {
  const match = duration.match(/P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) {
    return "00:00";
  }

  const [, days, hours, minutes, seconds] = match;
  const parts = [
    days ? Number(days) * 24 + Number(hours ?? 0) : Number(hours ?? 0),
    Number(minutes ?? 0),
    Number(seconds ?? 0)
  ];

  if (parts[0] > 0) {
    return `${String(parts[0]).padStart(2, "0")}:${String(parts[1]).padStart(2, "0")}:${String(parts[2]).padStart(2, "0")}`;
  }

  return `${String(parts[1]).padStart(2, "0")}:${String(parts[2]).padStart(2, "0")}`;
};

export const FALLBACK_YOUTUBE_VIDEOS: OfficialYouTubeVideo[] = [
  {
    id: "posicionamento-alto-nivel",
    title: "Conteúdo institucional",
    description: "Vídeos que apresentam a marca, sua história, seus diferenciais e sua forma de gerar valor.",
    duration: "12:45",
    date: "28 Mai, 2026",
    category: "INSTITUCIONAL",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
    embedCode: "612U4R57M70",
    videoUrl: DEFAULT_YOUTUBE_VIDEO_URL,
    views: "PORTFÓLIO 01",
    tagline: "NARRATIVA CLARA",
    source: "fallback"
  },
  {
    id: "branding-blueprint",
    title: "Cobertura de eventos",
    description: "Registro estratégico de momentos, bastidores, falas e experiências para ampliar o valor do evento depois que ele acontece.",
    duration: "18:20",
    date: "14 Mai, 2026",
    category: "EVENTOS",
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=1200",
    embedCode: "612U4R57M70",
    videoUrl: DEFAULT_YOUTUBE_VIDEO_URL,
    views: "PORTFÓLIO 02",
    tagline: "BASTIDORES COM FUNÇÃO",
    source: "fallback"
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
    videoUrl: DEFAULT_YOUTUBE_VIDEO_URL,
    views: "PORTFÓLIO 03",
    tagline: "AUTORIDADE EM CENA",
    source: "fallback"
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
    videoUrl: DEFAULT_YOUTUBE_VIDEO_URL,
    views: "PORTFÓLIO 04",
    tagline: "LINHA EDITORIAL",
    source: "fallback"
  }
];

export const FALLBACK_GMB_REVIEWS: OfficialGoogleReview[] = [
  {
    name: "Dra. Roberta Chaves",
    role: "Clínica de Odontologia",
    avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200",
    time: "há 2 semanas",
    tagline: "Clareza no posicionamento",
    text:
      "Fizemos o reposicionamento estético da nossa clínica e o novo site estruturado com a TAG08. Estou impactada com a precisão do design. Nosso volume de pacientes particulares de alto padrão aumentou muito porque finalmente nossa comunicação condiz com o nosso tratamento.",
    category: "BRANDING ATIVO",
    source: "fallback"
  },
  {
    name: "Marcus Azevedo",
    role: "CEO, Azevedo Asset",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    time: "há 1 mês",
    tagline: "Acompanhamento do processo",
    text:
      "Trabalho impecável de Process Intelligence. Eles auditaram nossa estrutura e desenharam um hub assíncrono que acabou com a bagunça no WhatsApp. O time hoje sabe exatamente o que fazer com playbooks dinâmicos. Economia gigantesca de tempo de gerência.",
    category: "PROCESSES",
    source: "fallback"
  },
  {
    name: "Juliana Reis",
    role: "Sócia Fundadora, Le Visage Spa",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    time: "há 3 semanas",
    tagline: "Coerência entre promessa e entrega",
    text:
      "A assessoria de redes sociais e conteúdo da TAG08 é magnífica. Eles planejam os carrosséis e roteiros de reels com foco em elegância e sofisticação, fugindo daquilo que as agências comuns entregam. Elevou nossa marca no mercado de luxo local.",
    category: "REDES SOCIAIS",
    source: "fallback"
  },
  {
    name: "Dr. Arthur Mendes",
    role: "Diretor Clínico, Mendes Odontologia",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    time: "há 2 meses",
    tagline: "Direção comercial mais clara",
    text:
      "O tráfego deles é muito bem estruturado. Já passei por três assessorias que apenas queimavam verba trazendo curiosos. Na TAG08 eles organizam filtros funcionais nos criativos e nos trazem leads mais qualificados para conversar sobre tratamentos.",
    category: "TRÁFEGO ADS",
    source: "fallback"
  },
  {
    name: "Beatriz Nogueira",
    role: "Diretora de Marketing, Grupo BN",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    time: "há 1 mês",
    tagline: "Diagnóstico com mais clareza",
    text:
      "O diagnóstico inicial deles foi melhor do que muitas consultorias pagas que já contratamos. Eles mostram os furos exatos na estrutura de branding e oferecem um plano claro. Implementamos tudo e o caminho ficou mais claro.",
    category: "DIAGNÓSTICO",
    source: "fallback"
  },
  {
    name: "Leonardo Castilho",
    role: "Fundador, Castilho Advocacia",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    time: "há 3 meses",
    tagline: "Estrutura digital mais consistente",
    text:
      "Desenvolver nosso ecossistema web com códigos nativos pela TAG08 foi importante para a nossa captação corporativa. O site abre no celular do cliente e passa uma postura consistente para o escritório.",
    category: "DEV WEB",
    source: "fallback"
  }
];

export const DEFAULT_OFFICIAL_CONTENT: OfficialContentBundle = {
  youtubeVideos: FALLBACK_YOUTUBE_VIDEOS,
  gmbReviews: FALLBACK_GMB_REVIEWS,
  sources: {
    youtube: "fallback",
    googleBusiness: "fallback"
  }
};
