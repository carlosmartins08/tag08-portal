import { useState, useEffect, useRef } from "react";
import { Compass, Sparkles, BookOpen, Layers, CheckCircle, ArrowUpRight, ArrowRight, Award, Shield, MessageSquare, Search, Image, Grid, ExternalLink, Heart, X, Palette, Type, TrendingUp, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ResilientImage from "../../../components/ResilientImage";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import MiniCases from "../../../components/MiniCases";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import { buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl, TAG08_OFFICIAL_PINTEREST_URL } from "../../../config/siteNetwork";
import { trackOutboundClick } from "../../../lib/analytics";

interface BrandingProps {
  onNavigate: (page: string) => void;
}

export default function Branding({ onNavigate }: BrandingProps) {
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeGuide, setActiveGuide] = useState<"identidade" | "aplicacao" | "consistencia" | "proximos">("identidade");
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeDialogButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const guidePreviews = {
    identidade: { card: "p-8 rounded-[24px] border-2 bg-zinc-950 border-zinc-800 text-left transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[360px] shadow-[0_20px_50px_rgba(255,255,255,0.02)]", title: "text-xl sm:text-2xl text-white font-display uppercase tracking-tighter leading-tight font-black", tagline: "text-zinc-400 font-sans text-xs leading-relaxed", badge: "tag08-meta text-xs bg-white/5 text-white border border-white/10 px-2 py-0.5 rounded font-black uppercase", label: "IDENTIDADE", heading: "Guia de identidade", description: "Base visual para orientar o uso da marca em diferentes peças.", values: "Cores definidas\nTipografia principal\nElementos gráficos\nRegras de uso", fit: "Manual base para time interno e parceiros de produção" },
    aplicacao: { card: "p-8 rounded-[24px] border-2 bg-black border-brand/20 text-left transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[360px] shadow-[0_20px_50px_rgba(var(--color-brand-rgb),0.05)]", title: "text-xl sm:text-2xl text-brand font-display uppercase tracking-tighter leading-none font-black", tagline: "text-zinc-300 font-sans text-xs leading-relaxed", badge: "tag08-meta text-xs bg-brand/10 text-brand border border-brand/20 px-2 py-0.5 rounded font-black uppercase", label: "APLICAÇÃO", heading: "Exemplos de aplicação", description: "Referências para aplicar a identidade nos pontos de contato previstos no escopo.", values: "Redes sociais quando previsto\nApresentações prioritárias\nPropostas selecionadas\nSite e materiais quando previsto", fit: "Pontos de contato que pedem leitura rápida e padronização" },
    consistencia: { card: "p-8 rounded-[24px] border-2 bg-charcoal-900 border-white/[0.08] text-left transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[360px] shadow-[0_20px_50px_rgba(0,0,0,0.2)]", title: "text-xl sm:text-2xl text-white uppercase tracking-widest leading-tight font-semibold", tagline: "text-zinc-400 font-sans text-xs leading-relaxed", badge: "tag08-meta text-xs bg-white/5 text-zinc-200 border border-white/10 px-2 py-0.5 rounded font-black uppercase", label: "CONSISTÊNCIA", heading: "Critérios de consistência", description: "Critérios para manter unidade quando a marca entra em novas peças.", values: "Ritmo visual\nEscala e contraste\nAlinhamento\nRepetição dos mesmos critérios", fit: "Novas peças, campanhas e atualizações do dia a dia" },
    proximos: { card: "p-8 rounded-[24px] border-2 bg-charcoal-900 border-white/[0.08] text-left transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[360px] shadow-[0_20px_50px_rgba(0,0,0,0.2)]", title: "text-xl sm:text-2xl text-white font-sans uppercase tracking-tight leading-none font-bold", tagline: "text-zinc-400 font-sans text-xs leading-relaxed", badge: "tag08-meta text-xs bg-white/5 text-zinc-200 border border-white/10 px-2 py-0.5 rounded font-black uppercase", label: "ORIENTAÇÃO", heading: "Próximos passos", description: "A ordem prática para sair da decisão e colocar a identidade em uso.", values: "Definir base\nAplicar nas peças prioritárias\nRevisar o conjunto\nExpandir com critério", fit: "Times que precisam colocar a marca em uso sem atraso" },
  };
  const guidePreview = guidePreviews[activeGuide];

  // State for active branding showcasing detail modal (similar to dynamic premium cases)
  const [selectedWork, setSelectedWork] = useState<{
    id: string;
    title: string;
    category: string;
    description: string;
    imageUrl: string;
    pinterestUrl: string;
    isCustom?: boolean;
    likesCount?: number;
    challenge?: string;
    solution?: string;
    colors?: string[];
    colorNames?: string[];
    typography?: string;
    achievement?: string;
    deliverables?: string[];
  } | null>(null);

  // Pinterest integration, showcase state and list management
  const [pinterestWorks, setPinterestWorks] = useState<{
    id: string;
    title: string;
    category: string;
    description: string;
    imageUrl: string;
    pinterestUrl: string;
    isCustom?: boolean;
    likesCount?: number;
    challenge?: string;
    solution?: string;
    colors?: string[];
    colorNames?: string[];
    typography?: string;
    achievement?: string;
    deliverables?: string[];
  }[]>([]);

  const [filterCategory, setFilterCategory] = useState<string>("todos");
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});

  const handleOutboundClick = (label: string, url: string, surface: string) => {
    trackOutboundClick({
      label,
      url,
      surface
    });
  };

  useEffect(() => {
    const DEFAULT_PINTEREST_WORKS = [
      {
        id: "pin-aura-derm",
        title: "Aura Clínica de Dermatologia",
        category: "Identidade para saúde",
        description: "Referência de sistema visual para uma clínica que precisa apresentar cuidado e continuidade em seus pontos de contato.",
        imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=650",
        pinterestUrl: TAG08_OFFICIAL_PINTEREST_URL,
        likesCount: 142,
        challenge: "Exemplo de contexto: alinhar materiais e presença digital a uma direção visual mais definida.",
        solution: "Direção visual proposta com paleta suave, monograma circular e aplicações para materiais institucionais e digitais.",
        colors: ["#FDFBF7", "#D4AF37", "#2D3748"],
        colorNames: ["Branco suave", "Dourado", "Cinza-azulado"],
        typography: "Serif editorial e sans-serif de apoio",
        achievement: "Aplicação pensada para manter unidade entre materiais e presença digital.",
        deliverables: ["Estudo de assinatura visual", "Exemplo de papelaria", "Diretrizes para materiais digitais", "Exemplo de aplicação em redes sociais"]
      },
      {
        id: "pin-lex-cooper",
        title: "Lex Cooper Advogados",
        category: "Identidade institucional",
        description: "Referência de identidade institucional para um escritório que busca mais unidade em materiais físicos e digitais.",
        imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=650",
        pinterestUrl: TAG08_OFFICIAL_PINTEREST_URL,
        likesCount: 98,
        challenge: "Exemplo de contexto: organizar apresentação, papelaria e presença institucional sob uma mesma linguagem visual.",
        solution: "Direção visual proposta com monograma, elementos de apoio e aplicações para canais físicos e digitais.",
        colors: ["#0C1017", "#B87333", "#E2E8F0"],
        colorNames: ["Preto", "Cobre", "Branco"],
        typography: "Serif institucional e mono de apoio",
        achievement: "Sistema pensado para manter unidade entre apresentação, papelaria e materiais institucionais.",
        deliverables: ["Estudo de monograma", "Sistema de apoio visual", "Exemplos de papelaria e apresentação", "Guia de aplicações"]
      },
      {
        id: "pin-vortex-tech",
        title: "Vortex Tech Partners",
        category: "Branding para tecnologia",
        description: "Referência de direção visual para um produto digital que precisa aproximar marca, interface e comunicação.",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=650",
        pinterestUrl: TAG08_OFFICIAL_PINTEREST_URL,
        likesCount: 187,
        challenge: "Exemplo de contexto: diferenciar um produto digital com uma identidade visual mais legível.",
        solution: "Direção visual proposta com elementos geométricos e aplicações para produto, interface e comunicação de lançamento.",
        colors: ["#020205", "var(--color-brand)", "#00F0FF"],
        colorNames: ["Preto", "Verde TAG08", "Ciano"],
        typography: "Sans-serif geométrica e mono de apoio",
        achievement: "Aplicação pensada para aproximar marca, produto e comunicação de lançamento.",
        deliverables: ["Estudo de assinatura responsiva", "Exemplos de componentes", "Diretrizes para interface", "Referências de motion"]
      },
      {
        id: "pin-emporio-sg",
        title: "Empório Saint Germain",
        category: "Branding para varejo",
        description: "Referência de direção visual para uma marca com embalagens e materiais de ponto de venda.",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=650",
        pinterestUrl: TAG08_OFFICIAL_PINTEREST_URL,
        likesCount: 214,
        challenge: "Exemplo de contexto: organizar embalagens e materiais para expressar origem e cuidado.",
        solution: "Direção visual proposta para rótulos, embalagens e materiais de ponto de venda.",
        colors: ["#1C1616", "#C5A880", "#FFFDF9"],
        colorNames: ["Marrom escuro", "Bege", "Branco"],
        typography: "Serif de apoio e sans-serif leve",
        achievement: "Sistema pensado para manter unidade entre embalagem e ponto de venda.",
        deliverables: ["Estudo de rótulos", "Exemplos de embalagens", "Materiais de apoio", "Guia de aplicação"]
      }
    ];

    setPinterestWorks(DEFAULT_PINTEREST_WORKS);

    try {
      const storedLikes = localStorage.getItem("tag08_pinterest_likes");
      if (storedLikes) {
        setLikedItems(JSON.parse(storedLikes));
      }
    } catch (e) {}
  }, []);

  const handleLikeItem = (id: string) => {
    const isLiked = !!likedItems[id];
    const newLikes = { ...likedItems, [id]: !isLiked };
    setLikedItems(newLikes);
    localStorage.setItem("tag08_pinterest_likes", JSON.stringify(newLikes));

    setPinterestWorks(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          likesCount: (item.likesCount || 0) + (isLiked ? -1 : 1)
        };
      }
      return item;
    }));
  };

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openSelectedWork = (work: NonNullable<typeof selectedWork>, trigger?: HTMLElement) => {
    lastFocusedElementRef.current = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setSelectedWork(work);
  };

  const closeSelectedWork = () => {
    setSelectedWork(null);
    window.requestAnimationFrame(() => lastFocusedElementRef.current?.focus());
  };

  useEffect(() => {
    if (!selectedWork) return;

    const focusDialogClose = () => window.requestAnimationFrame(() => closeDialogButtonRef.current?.focus());
    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSelectedWork();
        return;
      }

      if (event.key !== "Tab") return;
      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements?.length) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    focusDialogClose();
    document.addEventListener("keydown", handleDialogKeyDown);
    return () => document.removeEventListener("keydown", handleDialogKeyDown);
  }, [selectedWork]);

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
                BRANDING E IDENTIDADE VISUAL // TAG08
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter font-display">
                Identidade visual com direção <br />
                <span className="text-brand">para marcas que precisam comunicar melhor seu valor.</span>
              </h1>
            </div>
            <div className="lg:col-span-5 space-y-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-sm leading-relaxed font-sans font-medium">
                A TAG08 desenvolve identidades visuais digitais para negócios que precisam organizar sua expressão de marca, alinhar materiais e construir uma presença mais clara, coerente e reconhecível nos principais pontos de contato.
              </p>
              <button
                type="button"
                onClick={() => handleLinkClick("/contato")}
                className="inline-flex items-center gap-2 rounded-full border border-brand bg-brand-secondary px-5 py-3 text-xs tag08-meta font-black uppercase tracking-widest text-black transition-transform hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                Organizar minha identidade
                <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* 2. Panoramic Wide Banner Image with capsule neon overlay trigger wrapped in 3D perspective tilt container */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <ResilientImage
                fallbackLabel="Processo de construção de identidade visual"
                sizes="100vw"
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1600"
                alt="Processo de construção de identidade visual"
                className="object-cover grayscale brightness-50 group-hover:scale-[1.01] transition-all duration-1000 ease-out"
                referrerPolicy="no-referrer"
              />
              {/* Elegant overlay masks */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />

              {/* Glowing neon action button floating inside face banner mimicking "Free Trial" anchor */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{ transform: "translateZ(45px)" }}>
                <button
                  onClick={() => handleLinkClick("/contato")}
                  className="group bg-brand-secondary text-black font-display font-black text-xs sm:text-xs uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] hover:scale-105 duration-300 transition-all border border-brand-secondary hover:bg-brand-dark flex items-center gap-2 cursor-pointer z-20"
                >
                  <span>ORGANIZAR MINHA IDENTIDADE</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Absolute indicator tags on corners */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="tag08-meta text-xs text-brand-secondary tracking-widest block uppercase font-semibold">TAG08 VISUAL HUB</span>
                  <h4 className="font-display font-black text-white text-xs sm:text-sm tracking-tight leading-none">Identidade com coerência</h4>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-xs text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>IDENTIDADE // EM USO</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* 3. High status core statistics row matching screenshot layout */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Clareza visual</span>
              <span className="block text-zinc-500 tag08-meta text-xs uppercase tracking-widest leading-normal">Elementos organizados para facilitar<br/>leitura, aplicação e continuidade</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">Coerência</span>
              <span className="block text-zinc-500 tag08-meta text-xs uppercase tracking-widest leading-normal">Marca mais alinhada entre canais,<br/>materiais e pontos de contato</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Reconhecimento</span>
              <span className="block text-zinc-500 tag08-meta text-xs uppercase tracking-widest leading-normal">Sistema visual mais fácil de identificar<br/>e repetir ao longo do tempo</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">Direção de marca</span>
              <span className="block text-zinc-500 tag08-meta text-xs uppercase tracking-widest leading-normal">Identidade construída para traduzir<br/>uma direção já definida</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2 - DIAGNOSTIC & PERSPECTIVE SHIFT */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-zinc-950 text-left relative overflow-hidden">
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/[0.01] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-semibold bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                SINAIS DE DESALINHAMENTO VISUAL
              </span>
              <h3 className="font-display font-medium text-3xl text-white tracking-tight">
                Quando a identidade visual já não sustenta o valor da marca.
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                Muitas marcas entregam valor, mas ainda se apresentam de forma visualmente inconsistente. O problema nem sempre é falta de design; muitas vezes é falta de direção visual, critérios de aplicação e coerência entre identidade, linguagem e pontos de contato.
              </p>

              <div className="p-5 rounded-2xl bg-brand-secondary/[0.01] border border-brand-secondary/5 text-xs text-zinc-400 font-sans">
                <span className="text-brand-secondary font-black uppercase block mb-1">CONSEQUÊNCIA DIRETA:</span>
                Quando a identidade não sustenta a percepção desejada, materiais e canais passam a exigir mais esforço para transmitir uma mesma mensagem.
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {[
                "Peças desconectadas: apresentações, posts e materiais parecem ter sido criados em momentos diferentes, sem uma lógica visual comum.",
                "Percepção abaixo da entrega: a apresentação ainda não traduz com precisão o cuidado e a qualidade que o negócio busca comunicar.",
                "Identidade difícil de aplicar: cores, tipografia, elementos, imagens e aplicações não seguem critérios de uso suficientemente claros.",
                "Materiais com estilos diferentes: propostas, redes sociais, site, apresentações e documentos comerciais não parecem pertencer à mesma marca.",
                "Estética desconectada da proposta atual: a aparência existe, mas não acompanha o público, a mensagem ou o momento da marca."
              ].map((signal, sIdx) => (
                <div key={sIdx} className="flex gap-4 items-start p-4 rounded-2xl bg-charcoal-900 border border-white/[0.03] hover:border-white/[0.06] transition-all">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-secondary shrink-0 shadow-[0_0_8px_var(--color-brand-secondary)]" />
                  <p className="text-zinc-300 text-xs sm:text-sm font-sans font-medium leading-relaxed text-left">{signal}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-baseline pt-12 border-t border-white/[0.04]">
            <div className="lg:col-span-4 space-y-4">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-semibold bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                IDENTIDADE SEM SISTEMA
              </span>
              <h2 className="font-display font-medium text-3xl text-white tracking-tight leading-tight">
                Logo sozinho não resolve percepção.
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                Identidade precisa de regras para cor, tipografia, imagens, composição e materiais. Sem isso, cada ponto de contato acaba falando uma linguagem diferente.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { title: "O logotipo identifica", focus: "SIGNATURA", desc: "A assinatura visual ajuda no reconhecimento, mas sozinha não organiza toda a expressão da marca." },
                { title: "A identidade organiza", focus: "SISTEMA", desc: "Cores, tipografia, elementos, composição e aplicações criam uma base visual mais consistente." },
                { title: "O branding direciona", focus: "CONTEXTO", desc: "O branding conecta percepção, posicionamento e expressão da marca. Quando essa direção ainda não está clara, pode ser necessário trabalhar o posicionamento antes da identidade." }
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-neutral-900/40 border border-white/[0.04] space-y-4 hover:border-brand-secondary/15 hover:bg-white/[0.01] transition-all duration-300">
                  <div className="flex items-center justify-between border-b border-white/[0.03] pb-3 text-xs font-sans text-zinc-500">
                    <span>EIXO DE MARCA</span>
                    <span className="text-brand-secondary">{item.focus}</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white text-xs sm:text-sm font-display font-bold tracking-tight">{item.title}</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-12 border-t border-white/[0.04]">
            <div className="lg:col-span-4 space-y-4">
              <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest block font-bold">MATURIDADE DA MARCA</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white leading-none tracking-tight">
                SISTEMAS VISUAIS SUSTENTAM CONSISTÊNCIA.
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Veja onde a comunicação visual costuma perder clareza, coesão e reconhecimento ao longo da jornada da marca.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
                <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">01 // UNIDADE FRÁGIL</span>
                <h4 className="text-white font-display font-black text-sm">Visual difícil de repetir</h4>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Quando cada peça parece vir de uma referência diferente, a marca perde unidade e dificulta o reconhecimento ao longo do tempo.
                </p>
              </div>

              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
                <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">02 // MATERIAIS DESALINHADOS</span>
                <h4 className="text-white font-display font-black text-sm">Os materiais não seguem o mesmo padrão</h4>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Propostas, site, redes e apresentações precisam compartilhar uma mesma linguagem visual, não versões concorrentes da marca.
                </p>
              </div>

              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
                <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">03 // PERCEPÇÃO ABAIXO DA ENTREGA</span>
                <h4 className="text-white font-display font-black text-sm">A apresentação não acompanha o momento da marca</h4>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Quando a identidade visual fica aquém do momento atual do negócio, materiais e canais deixam de comunicar com a precisão necessária.
                </p>
              </div>

              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
                <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">04 // DIREÇÃO DE MARCA</span>
                <h4 className="text-white font-display font-black text-sm">A identidade precisa de critério</h4>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Direção visual não é enfeite. Ela orienta escolhas de aplicação, padronização e continuidade em diferentes pontos de contato.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - DELIVERABLES */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-bold">O QUE ORGANIZAMOS</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">Identidade não é só logo. É um sistema para sustentar percepção.</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              A TAG08 estrutura os elementos que formam a identidade visual da marca e orienta sua aplicação nos pontos de contato prioritários. O escopo depende do momento do negócio, dos canais envolvidos e da profundidade necessária.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Search className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm">Diagnóstico visual</h4>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Leitura da identidade atual, dos materiais existentes, dos pontos de contato e dos principais sinais de inconsistência visual.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Compass className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm">Direção de identidade</h4>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Definição de referências, caminhos visuais, linguagem estética e critérios para orientar a construção da identidade.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Palette className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm">Sistema visual</h4>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Organização de cores, tipografia, elementos gráficos, composição, imagens e hierarquias de uso.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Layers className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm">Aplicações da marca</h4>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Desenvolvimento dos materiais previstos no escopo para os pontos de contato prioritários.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm">Guia de uso</h4>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  Registro das principais regras e orientações para facilitar aplicação e continuidade depois da entrega.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - TRUST CORE BAR */}
      <section className="px-4 sm:px-6 md:px-8 py-10 border-b border-white/[0.04] bg-charcoal-900/40 text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-3xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-semibold bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              CRITÉRIOS DE CONFIANÇA
            </span>
            <h4 className="text-white font-display font-black text-sm tracking-tight">O que sustenta uma identidade mais consistente.</h4>
            <p className="text-zinc-400 text-xs font-sans font-medium leading-relaxed">
              Uma identidade visual funciona melhor quando existe direção, sistema, aplicação e continuidade. O objetivo não é fazer a marca parecer algo que não é, mas apresentar com mais coerência aquilo que o negócio realmente entrega.
            </p>
          </div>
          <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest border border-brand-secondary/20 bg-brand-secondary/5 px-3.5 py-2 rounded-xl shrink-0 font-black">
            DIREÇÃO VISUAL // TAG08
          </span>
        </div>
      </section>

      {/* BRANDING CLIENTS LOGO SOCIAL PROOF */}
      <MiniCases 
        route="/servicos/branding-identidade"
        onNavigate={onNavigate} 
        title="Referências para observar identidade com direção."
        subtitle="Uma identidade visual ganha sentido quando marca, linguagem, aplicação e percepção seguem critérios compatíveis."
        badge="MÉTODO EM PRÁTICA"
      />

      {/* PINTEREST SHOWCASE SECTION */}
      <section id="pinterest-brand-showcase" className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-950/40 relative overflow-hidden text-left">
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-brand-secondary/[0.015] rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end border-b border-white/[0.04] pb-8">
            <div className="lg:col-span-12 space-y-3">
              <span className="tag08-action text-xs text-brand-secondary uppercase tracking-widest font-semibold bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block select-none">
                PORTFÓLIO VISUAL // PINTEREST HUB
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
                Aplicações que mostram a identidade em uso.
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans font-medium max-w-2xl leading-relaxed">
                O portfólio visual reúne aplicações e referências para mostrar como uma identidade pode funcionar em diferentes pontos de contato sem perder unidade.
              </p>
              <p className="text-zinc-500 text-xs sm:text-sm font-sans leading-relaxed max-w-2xl">
                Mais do que uma vitrine estética, o acervo ajuda a visualizar como sistema visual, critérios de aplicação e repetição constroem continuidade de marca.
              </p>
            </div>

          </div>

          <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.03] pb-4">
            <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest block font-bold mr-3">FILTRAR PORTFÓLIO:</span>
            {["todos", ...Array.from(new Set(pinterestWorks.map(item => item.category)))].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`font-sans text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  filterCategory === cat
                    ? "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/30 shadow-[0_2px_12px_rgba(var(--color-brand-secondary-rgb),0.08)] font-bold"
                    : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                }`}
              >
                {cat === "todos" ? "Visualizar todas" : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {pinterestWorks
                .filter(item => filterCategory === "todos" || item.category === filterCategory)
                .map((work) => {
                  const isItemLiked = !!likedItems[work.id];

                  return (
                    <motion.div
                      key={work.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="bg-charcoal-900 border border-white/[0.06] hover:border-brand/40 duration-300 rounded-3xl overflow-hidden flex flex-col justify-between group shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all"
                    >
                      <button
                        type="button"
                        aria-label={`Abrir aplicação da identidade: ${work.title}`}
                        onClick={(event) => openSelectedWork(work, event.currentTarget as HTMLElement)}
                        className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
                      />
                      <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden border-b border-white/[0.04]">
                        <ResilientImage
                          fallbackLabel="Aplicação de identidade visual"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          src={work.imageUrl}
                          alt={work.title}
                          className="object-cover group-hover:scale-105 duration-700 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/30 opacity-70 group-hover:opacity-60 transition-opacity pointer-events-none" />

                        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
                          <span className="tag08-meta text-xs bg-black/60 backdrop-blur-md text-zinc-300 font-bold tracking-widest uppercase py-1 px-2.5 rounded-md border border-white/5 shadow-sm">
                            {work.category}
                          </span>

                          <button
                            type="button"
                            aria-label={isItemLiked ? `Remover ${work.title} dos favoritos` : `Adicionar ${work.title} aos favoritos`}
                            aria-pressed={isItemLiked}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLikeItem(work.id);
                            }}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
                              isItemLiked
                                ? "bg-red-500/20 text-red-400 border border-red-500/35"
                                : "bg-black/60 border border-white/10 text-zinc-400 hover:text-white"
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isItemLiked ? "fill-red-400" : ""}`} />
                          </button>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openSelectedWork(work, event.currentTarget as HTMLElement);
                            }}
                            className="bg-brand-secondary hover:bg-white text-black tag08-meta text-xs uppercase tracking-widest font-black py-2.5 px-4 rounded-xl flex items-center gap-1.5 scale-90 group-hover:scale-100 transition-all duration-300 shadow-[0_4px_15px_rgba(var(--color-brand-secondary-rgb),0.3)]"
                          >
                            <span>Ver detalhes da aplicação</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-zinc-500 font-sans text-xs tracking-wider select-none pointer-events-none">
                          <span>REFERÊNCIA_VISUAL_TAG08</span>
                          <span className="text-zinc-400 flex items-center gap-1">
                            <Heart className="w-2 h-2 text-red-500" />
                            Aplicação visual
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <h4 className="text-white font-display font-black text-sm group-hover:text-brand transition-colors text-left truncate">
                            {work.title}
                          </h4>
                          <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium line-clamp-3 text-left">
                            {work.description}
                          </p>
                        </div>

                        <div className="relative z-20 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                          <button
                            onClick={(event) => openSelectedWork(work, event.currentTarget as HTMLElement)}
                            className="text-xs font-sans text-zinc-400 hover:text-brand flex items-center gap-1 group-hover:translate-x-0.5 transition-all text-left cursor-pointer"
                          >
                            <span>Aplicação da identidade</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-brand-secondary" />
                          </button>

                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </div>

        </div>
      </section>
      {/* SECTION - WORK SYSTEM */}
      <section className="py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-charcoal-900 border border-brand/30 text-white p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(0,0,0,0.34)] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[520px]">
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden" />
            <ResilientImage
              fallbackLabel="Referência visual de identidade"
              sizes="(max-width: 1024px) 100vw, 42vw"
              src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800"
              alt="Referência visual de materiais e sistema de identidade"
              className="object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[15%] transition-all duration-500 hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between items-start">
                <span className="tag08-meta text-xs text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  Sistema de trabalho
                </span>
                <span className="font-sans text-xs text-white/40 tracking-wider">
                  TAG08
                </span>
              </div>
              <div className="space-y-1.5 opacity-30 select-none">
                <div className="font-display font-extrabold text-[1.8rem] text-white/40 tracking-widest leading-none uppercase select-none">
                  branding_claro
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                  identidade_em_uso
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-sans text-xs text-white/40 tracking-wider">
                  Etapas definidas
                </span>
                <span className="tag08-meta text-xs text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  Sem improviso
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 text-left h-full relative z-10 lg:pl-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-brand font-semibold">
                <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                </div>
                <span className="tag08-meta text-xs tracking-widest uppercase font-bold text-brand">
                  SISTEMA DE TRABALHO
                </span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.9] tracking-tighter">
                Como conduzimos um projeto de identidade.
              </h2>
              <p className="text-zinc-300 text-xs sm:text-xs max-w-lg leading-relaxed font-sans font-semibold">
              A TAG08 organiza o processo de branding em etapas claras: entendimento do contexto, direção visual, desenvolvimento do sistema, aplicações previstas e orientações de uso.
              </p>
            </div>

            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Entendimento",
                    text: "Leitura do negócio, do momento da marca, dos públicos, dos materiais existentes, dos canais e das necessidades de aplicação."
                  },
                  {
                    title: "Direção visual",
                    text: "Definição de referências, caminhos estéticos, linguagem e critérios para orientar a construção."
                  },
                  {
                    title: "Sistema de identidade",
                    text: "Desenvolvimento e organização dos elementos visuais previstos no escopo."
                  },
                  {
                    title: "Aplicações e continuidade",
                    text: "Aplicação nos materiais prioritários e orientação para manter o sistema coerente depois da entrega."
                  }
                ].map((step, index) => (
                  <div key={step.title} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-extrabold block">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-white text-sm font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-white/70 text-xs leading-relaxed font-sans">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-white/[0.05]">
                <p className="text-white/70 text-xs leading-relaxed font-sans max-w-md">
                  O objetivo é deixar a marca clara para quem cria, aprova e usa as peças depois da entrega.
                </p>
                <button
                  onClick={() => handleLinkClick("/contato")}
                  className="group inline-flex items-center gap-2 bg-black text-brand font-sans font-black text-xs uppercase tracking-widest py-3.5 px-5 rounded-xl border border-black/10 hover:bg-white transition-all duration-300 cursor-pointer"
                >
                  ORGANIZAR MINHA IDENTIDADE
                  <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - SOLUTIONS & RICH GUIDES */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-900/10 text-left">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="space-y-12">
            <div className="space-y-3 max-w-3xl">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-semibold bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                Guias e critérios
              </span>
              <h2 className="font-display font-medium text-3xl text-white tracking-tight">
                Branding precisa de critério para ser aplicado.
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                Depois da criação visual, a marca precisa conseguir aplicar sua identidade com clareza. Guias, exemplos e orientações ajudam a reduzir improviso e manter consistência.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-5 bg-charcoal-900/60 border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 text-left">
                <div className="space-y-4">
                  <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest font-bold block pb-2 border-b border-white/[0.05]">
                    Escolha um guia
                  </span>

                  {[
                    {
                      id: "identidade",
                      name: "Guia de identidade",
                      desc: "Regras essenciais de uso da marca, cores, tipografia, elementos visuais e aplicações."
                    },
                    {
                      id: "aplicacao",
                      name: "Exemplos de aplicação",
                      desc: "Referências para aplicar a identidade em canais e materiais previstos no escopo."
                    },
                    {
                      id: "consistencia",
                      name: "Critérios de consistência",
                      desc: "Orientações para que novas peças respeitem a direção visual definida."
                    },
                    {
                      id: "proximos",
                      name: "Próximos passos",
                      desc: "Indicação do que deve ser aplicado primeiro conforme o momento e os pontos de contato da marca."
                    }
                  ].map((guide) => {
                    const isSelected = activeGuide === guide.id;

                    return (
                      <button
                        key={guide.id}
                        onClick={() => setActiveGuide(guide.id as typeof activeGuide)}
                        className={`guide-btn p-4 rounded-xl text-left border relative transition-all cursor-pointer ${
                          isSelected
                            ? "bg-brand-secondary/5 border-brand-secondary text-white"
                            : "bg-white/[0.01] border-white/5 text-zinc-400 hover:border-white/10"
                        }`}
                      >
                        <h4 className="text-white text-xs sm:text-sm font-semibold leading-tight">{guide.name}</h4>
                        <p className="text-zinc-500 text-xs mt-1 leading-snug">{guide.desc}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-zinc-400 leading-relaxed">
                  A seleção mostra como a TAG08 traduz a mesma identidade em usos diferentes sem perder clareza.
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-center bg-[#09090b] border border-white/[0.05] rounded-3xl p-6 sm:p-8 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-4">
                  <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest font-bold block">
                    Preview da aplicação
                  </span>

                  <div className={guidePreview.card}>
                    <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                      <span className={guidePreview.badge}>
                        {guidePreview.label}
                      </span>
                      <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      </div>
                    </div>

                    <div className="space-y-4 my-6">
                      <h3 className={guidePreview.title}>
                        {guidePreview.heading}
                      </h3>
                      <p className={guidePreview.tagline}>
                        {guidePreview.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-white/[0.05] pt-4 text-xs font-sans">
                      <div>
                        <span className="text-zinc-500 text-xs block uppercase">O que cobre:</span>
                        <p className="text-zinc-300 text-xs whitespace-pre-line mt-1 font-bold leading-normal">
                          {guidePreview.values}
                        </p>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-xs block uppercase">Quando usar:</span>
                        <p className="text-zinc-300 text-xs mt-1 leading-normal font-sans">
                          {guidePreview.fit}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 font-sans text-center pt-2">
                    A ideia aqui é simples: menos improviso, mais repetição consistente do que já foi decidido.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-3">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-semibold bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                Os guias que sustentam o uso da marca
              </span>
              <h3 className="font-display font-medium text-3xl text-white tracking-tight">
                O que precisa estar claro antes da marca entrar em circulação
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl">
                Esses blocos resumem o que a TAG08 entrega para reduzir dúvida na hora de aplicar a identidade no dia a dia.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Guia de identidade",
                  focus: "01 // BASE",
                  desc: "Regras essenciais de uso da marca, cores, tipografia, elementos visuais e aplicações."
                },
                {
                  title: "Exemplos de aplicação",
                  focus: "02 // USO REAL",
                  desc: "Referências para aplicar a identidade em canais e materiais previstos no escopo."
                },
                {
                  title: "Critérios de consistência",
        focus: "03 // PADRÃO",
                  desc: "Orientações para que novas peças respeitem a direção visual definida."
                },
                {
                  title: "Próximos passos",
                  focus: "04 // ORDEM",
                  desc: "Indicação do que deve ser aplicado primeiro conforme o momento e os pontos de contato da marca."
                }
              ].map((item, iIdx) => (
                <div key={iIdx} className="p-7 rounded-3xl bg-neutral-900/50 border border-white/[0.04] flex flex-col justify-between space-y-6 hover:border-brand-secondary/15 transition-all">
                  <div className="space-y-3">
                    <span className="font-sans text-xs text-zinc-500 font-bold block">{item.focus}</span>
                    <h4 className="text-white font-display font-bold text-sm sm:text-base tracking-tight flex items-center gap-2">
                      {item.title}
                    </h4>
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-7 sm:p-9 rounded-3xl bg-neutral-900/30 border border-white/[0.05] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

              <div className="lg:col-span-8 space-y-3 relative z-10 text-left">
                <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest font-black block">Próximos passos</span>
                <h4 className="text-white font-display font-medium text-lg">Como colocar a identidade em uso sem bagunçar o sistema</h4>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-xl">
                  Primeiro define-se a base. Depois a identidade entra nas peças que mais aparecem. Em seguida, a TAG08 orienta ajustes e padronização para manter tudo consistente.
                </p>
              </div>

              <div className="lg:col-span-4 flex justify-start lg:justify-end relative z-10">
                <button
                  onClick={() => handleLinkClick("/contato")}
                  className="group relative px-6 py-4 bg-brand-secondary hover:bg-brand-dark text-black text-xs font-sans font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shrink-0 overflow-hidden shadow-[0_8px_30px_rgba(var(--color-brand-secondary-rgb),0.15)] hover:-translate-y-0.5 relative z-10 cursor-pointer"
                >
                  FALAR COM A TAG08 <ArrowRight className="w-4 h-4 ml-1.5 inline-block group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceInsightsBridge servicePath="/servicos/branding-identidade" onNavigate={onNavigate} />

      {/* SECTION - FAQ */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[40px] bg-charcoal-950 border border-white/[0.04] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
                  Dúvidas sobre branding
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter">
                  Antes de criar uma identidade, entenda o que precisa ser organizado.
                </h2>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-sans max-w-sm">
                  Identidade visual organiza a expressão da marca. Quando a direção, a proposta ou o público ainda não estão claros, o primeiro passo pode vir antes da construção visual.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {([
                  { id: 0, title: 'Branding é só criação de logo?' },
                  { id: 1, title: 'Quando faz sentido investir em branding e identidade visual?' },
                  { id: 2, title: 'A TAG08 cria manual de marca?' },
                  { id: 3, title: 'O projeto inclui aplicações para redes sociais e materiais comerciais?' },
                  { id: 4, title: 'Branding ajuda a comunicar a marca com mais clareza?' }
                ]).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveFaq(item.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group cursor-pointer ${
                      activeFaq === item.id
                        ? 'bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)]'
                        : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
                    }`}
                  >
                    <span className="tag08-meta text-xs font-black uppercase tracking-wider flex items-center gap-3">
                      <span className={activeFaq === item.id ? 'text-black' : 'text-brand'}>
                        {String(item.id + 1).padStart(2, '0')}.
                      </span>
                      {item.title}
                    </span>
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                      activeFaq === item.id ? 'text-black rotate-[-45deg] stroke-[2.5]' : 'text-zinc-500'
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-white/[0.04] bg-[#0c0c0e]">
              <ResilientImage
                fallbackLabel="Branding TAG08"
                sizes="(max-width: 1024px) 100vw, 34vw"
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800"
                alt="TAG08 Branding"
                className="object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div className="absolute top-6 left-6 z-10 pointer-events-none tag08-meta text-xs text-white/20 uppercase tracking-widest leading-none">
                SYS // BRANDING
              </div>

              <div className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left">
                <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black block">
                  {([
                    'Pergunta 01',
                    'Pergunta 02',
                    'Pergunta 03',
                    'Pergunta 04',
                    'Pergunta 05'
                  ])[activeFaq]}
                </span>

                <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {([
                    'Branding é só criação de logo?',
                    'Quando faz sentido investir em branding e identidade visual?',
                    'A TAG08 cria manual de marca?',
                    'O projeto inclui aplicações para redes sociais e materiais comerciais?',
                    'Branding ajuda a comunicar a marca com mais clareza?'
                  ])[activeFaq]}
                </h4>

                <p className="text-zinc-300 text-xs sm:text-xs leading-relaxed font-sans font-medium">
                  {([
                    'Não. O logotipo é uma parte da identidade. O trabalho pode envolver sistema visual, cores, tipografia, elementos, aplicações e orientações de uso para que a marca se apresente com maior unidade.',
                    'Quando a marca já não representa bem o momento atual do negócio, quando materiais e canais parecem desconectados ou quando falta uma base visual que possa ser aplicada com continuidade.',
                    'Pode criar, quando isso fizer parte do escopo. O guia registra regras, aplicações e orientações necessárias para facilitar o uso da identidade depois da entrega.',
                    'Pode incluir. As aplicações são definidas conforme os pontos de contato prioritários e o escopo aprovado. Redes sociais, apresentações, propostas, papelaria e site não entram automaticamente em todo projeto.',
                    'Uma identidade bem estruturada pode ajudar a organizar percepção e aplicação, mas não substitui posicionamento, oferta, entrega real ou estratégia. Quando o problema está antes da expressão visual, pode ser necessário trabalhar reposicionamento primeiro.'
                  ])[activeFaq]}
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest block font-bold">GUIA DE IDENTIDADE</span>
                  <h4 className="text-white font-semibold text-sm leading-snug">O que observar antes de fechar o escopo?</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    O escopo fica mais preciso quando considera canais, materiais existentes e o que precisa ser organizado primeiro.
                  </p>
                </div>
                <button
                  onClick={() => handleLinkClick('/servicos')}
                  className="group flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5"
                >
                  <span>Ver soluções</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-black/60 uppercase tracking-widest block font-extrabold">FALE COM A TAG08</span>
                  <h4 className="text-black font-black text-sm leading-tight tracking-tight">Precisa de orientação para o próximo passo?</h4>
                  <p className="text-black/85 text-xs font-semibold leading-relaxed font-sans">
                    A TAG08 pode entender o momento da marca e indicar como estruturar a identidade de forma coerente com o escopo necessário.
                  </p>
                </div>
                <button
                  onClick={() => handleLinkClick('/contato')}
                  className="group flex items-center justify-between text-xs font-sans font-black text-black select-none border-t border-black/10 pt-3 hover:translate-x-0.5 transition-all"
                >
                  <span>Falar com a TAG08</span>
                  <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - ACTION TRIGGER FOOTER */}
      <section className="px-4 sm:px-6 md:px-8 py-20 text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta mx-auto">
          Próximo passo
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-none tracking-tighter">
          Vamos entender como sua marca precisa se apresentar?
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Antes de propor uma identidade visual, a TAG08 entende o momento da marca, seus pontos de contato, a base existente e o que precisa ser organizado para definir um escopo coerente.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => handleLinkClick('/contato')}
            className="group bg-brand text-black font-sans font-black text-xs uppercase tracking-widest py-4 px-8 rounded-full shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.22)] hover:bg-brand-dark duration-300 transition-all cursor-pointer flex items-center gap-2 justify-center"
          >
            <span>ORGANIZAR MINHA IDENTIDADE</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          <button
            onClick={() => handleLinkClick('/servicos')}
            className="group border border-white/10 bg-white/[0.03] text-white font-sans font-black text-xs uppercase tracking-widest py-4 px-8 rounded-full hover:border-white/20 hover:bg-white/[0.06] duration-300 transition-all cursor-pointer flex items-center gap-2 justify-center"
          >
            <span>VER SOLUÇÕES</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </section>
      {/* IMMERSIVE BRAND PRESENTATION MODAL (Cases focus strategy - placed globally at root with z-[9999] layer security) */}
      <AnimatePresence>
        {selectedWork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto bg-black/95 backdrop-blur-xl cursor-zoom-out"
            onClick={closeSelectedWork}
            data-interaction-exception="modal-backdrop"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-5xl bg-neutral-950 border border-white/[0.08] rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh] md:max-h-[85vh] text-left cursor-default overflow-y-auto md:overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="branding-work-dialog-title"
            >
              
              {/* Decorative background lights in modal */}
              <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-brand-secondary/[0.02] rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute bottom-[10%] left-[-10%] w-[300px] h-[300px] bg-red-600/[0.01] rounded-full blur-[90px] pointer-events-none" />

              {/* LEFT COLUMN: Media Showcase Frame */}
              <div className="md:w-[42%] bg-zinc-950 border-b md:border-b-0 md:border-r border-white/[0.04] p-6 flex flex-col justify-between relative shrink-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="tag08-meta text-xs bg-white/[0.04] text-zinc-400 font-bold tracking-widest uppercase py-1 px-2.5 rounded-md border border-white/5 select-none">
                      REFERÊNCIAS VISUAIS // TAG08
                    </span>
                    
                    {/* Favorite Heart for interactive feedback */}
                    <div className="flex items-center gap-1.5 font-sans text-xs text-zinc-400 select-none">
                      <button
                        type="button"
                        aria-label={likedItems[selectedWork.id] ? `Remover ${selectedWork.title} dos favoritos` : `Adicionar ${selectedWork.title} aos favoritos`}
                        aria-pressed={Boolean(likedItems[selectedWork.id])}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeItem(selectedWork.id);
                          // Update selectedWork likes too so state updates reactively
                          setSelectedWork(prev => prev ? {
                            ...prev,
                            likesCount: (prev.likesCount || 0) + (likedItems[prev.id] ? -1 : 1)
                          } : null);
                        }}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all bg-white/[0.03] border ${
                          likedItems[selectedWork.id] 
                            ? "border-red-500/30 text-red-100 bg-red-500/10" 
                            : "border-white/5 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${likedItems[selectedWork.id] ? "fill-red-400" : ""}`} />
                      </button>
                      <span>REFERÊNCIA VISUAL</span>
                    </div>
                  </div>

                  {/* Image block in 3:4 perspective aspect ratios */}
                  <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/[0.05] relative group shadow-lg">
                    <ResilientImage
                      fallbackLabel="Aplicação de identidade visual"
                      sizes="(max-width: 768px) 100vw, 40vw"
                      src={selectedWork.imageUrl} 
                      alt={selectedWork.title} 
                      className="object-cover pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Bottom outbound anchor to validation source pin */}
                <div className="pt-6 mt-6 md:mt-0 border-t border-white/[0.04]">
                    <a 
                    href={selectedWork.pinterestUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-red-600 hover:bg-red-700 text-white tag08-action text-xs uppercase tracking-widest font-black py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_15px_rgba(220,38,38,0.25)] hover:scale-[1.01]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ver acervo no Pinterest</span>
                  </a>
                </div>
              </div>

              {/* RIGHT COLUMN: Deep Strategic Portfolio Content */}
              <div className="md:w-[58%] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto md:max-h-[85vh] bg-[#0d0d11]/80 select-none">
                
                {/* Header line */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                      <span className="tag08-meta text-xs text-brand tracking-widest uppercase font-extrabold">{selectedWork.category}</span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={closeSelectedWork}
                      ref={closeDialogButtonRef}
                      aria-label="Fechar detalhes da aplicação"
                      className="w-8 h-8 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all flex items-center justify-center border border-white/5 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Main Copy Area */}
                  <div className="space-y-4">
                    <h3 id="branding-work-dialog-title" className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-none">
                      {selectedWork.title}
                    </h3>
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium">
                      {selectedWork.description}
                    </p>
                  </div>

                  {/* Deep Strategic Focus (Matching Case Study Detail style) */}
                  <div className="space-y-5 pt-2">
                    
                    {/* O Desafio */}
                    <div className="space-y-1.5 text-left bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl">
                      <h4 className="tag08-meta text-xs text-zinc-400 tracking-widest font-extrabold flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-brand" />
                        Contexto da marca
                      </h4>
                      <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                        {selectedWork.challenge || "A marca precisava alinhar seus pontos de contato para comunicar com mais clareza, coerência e continuidade."}
                      </p>
                    </div>

                    {/* A Solução */}
                    <div className="space-y-1.5 text-left bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl">
                      <h4 className="tag08-meta text-xs text-zinc-400 tracking-widest font-extrabold flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-brand" />
                        Direção visual
                      </h4>
                      <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                        {selectedWork.solution || "Organizamos elementos visuais, linguagem e aplicação para sustentar uma percepção mais coerente da marca."}
                      </p>
                    </div>

                    {/* Visual System parameters (Interactive Color chips) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Color Palette area */}
                      <div className="space-y-2 bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl text-left">
                        <h4 className="tag08-meta text-xs text-zinc-400 tracking-widest font-extrabold flex items-center gap-2">
                          <Palette className="w-3.5 h-3.5 text-brand" />
                          Paleta de Cores
                        </h4>
                        <div className="flex flex-wrap gap-2.5 pt-1">
                          {(selectedWork.colors || ["#0D0D11", "#C5A880", "#FFFFFF"]).map((col, idx) => {
                            const name = selectedWork.colorNames ? selectedWork.colorNames[idx] : col;
                            return (
                              <button
                                type="button"
                                key={col} 
                                className="group/chip flex items-center gap-1.5 bg-black/40 border border-white/5 py-1 px-2.5 rounded-lg text-xs font-sans text-zinc-300 relative cursor-pointer active:scale-95 transition-all"
                                onClick={() => {
                                  navigator.clipboard.writeText(col);
                                }}
                                title={`Clique para copiar Hex ${col}`}
                              >
                                <span className="w-2.5 h-2.5 rounded-full border border-white/10 shrink-0" style={{ backgroundColor: col }} />
                                <span className="group-hover/chip:text-brand transition-colors font-medium">{name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Typography selection */}
                      <div className="space-y-2 bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl text-left flex flex-col justify-center">
                        <h4 className="tag08-meta text-xs text-zinc-400 tracking-widest font-extrabold flex items-center gap-2">
                          <Type className="w-3.5 h-3.5 text-brand" />
                          Tipografia aplicada
                        </h4>
                        <p className="text-brand font-display font-black text-xs uppercase tracking-wide pt-0.5">
                          {selectedWork.typography || "Space Grotesk & Inter Modern"}
                        </p>
                      </div>

                    </div>

                    {/* Success / Metric Indicators */}
                    <div className="bg-brand/[0.03] border border-brand-secondary/15 p-4 rounded-xl text-left space-y-1">
                      <span className="tag08-meta text-xs bg-brand-secondary/10 text-brand-secondary uppercase tracking-widest font-black px-2.5 py-0.5 rounded border border-brand-secondary/10 inline-block">
                        CRITÉRIO VISUAL
                      </span>
                      <p className="text-zinc-200 text-xs font-sans font-medium flex items-center gap-1.5 pt-1">
                        <TrendingUp className="w-4 h-4 text-brand shrink-0" />
                        {selectedWork.achievement || "Aplicação pensada para manter unidade entre marca, linguagem e pontos de contato."}
                      </p>
                    </div>

                    {/* Deliverables lists */}
                    <div className="text-left space-y-2">
                      <h5 className="tag08-meta text-xs text-zinc-500 tracking-widest font-extrabold">Aplicações da marca:</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {(selectedWork.deliverables || ["Diretrizes visuais", "Aplicações digitais", "Peças de marca", "Guia de uso"]).map((deliv, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-zinc-400 font-sans font-medium">
                            <CheckCircle className="w-3.5 h-3.5 text-brand shrink-0 stroke-[2.5]" />
                            <span>{deliv}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* WhatsApp CTA for portfolio contact */}
                <div className="pt-6 mt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center gap-4">
                  
                  <a 
                    href={buildBrazilWhatsAppUrl("Olá TAG08! Estava analisando uma referência visual de Branding e gostaria de entender como a TAG08 pode organizar a identidade da minha marca.")}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleOutboundClick("WhatsApp", buildBrazilWhatsAppUrl("Olá TAG08! Estava analisando uma referência visual de Branding e gostaria de entender como a TAG08 pode organizar a identidade da minha marca."), "branding-work-case-br")}
                    className="w-full sm:flex-1 bg-brand hover:bg-brand-dark text-black font-sans text-xs uppercase tracking-widest font-black py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_22px_rgba(var(--color-brand-secondary-rgb),0.2)] hover:scale-[1.01] hover:shadow-[0_4px_30px_rgba(var(--color-brand-secondary-rgb),0.3)] cursor-pointer text-center"
                  >
                    <span>Organizar minha identidade</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </a>

                  <button
                    onClick={closeSelectedWork}
                    className="w-full sm:w-auto font-sans text-xs uppercase tracking-wider text-zinc-500 hover:text-white border border-white/5 py-4 px-6 rounded-xl cursor-pointer"
                  >
                    Fechar modal
                  </button>

                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


