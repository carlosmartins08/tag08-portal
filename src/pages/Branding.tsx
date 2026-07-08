import { useState, useEffect } from "react";
import { Compass, Sparkles, BookOpen, Layers, CheckCircle, ArrowUpRight, ArrowRight, Award, Shield, MessageSquare, Link2, Plus, Search, Image, Grid, Trash2, ExternalLink, Heart, Bookmark, X, Palette, Type, TrendingUp, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ThreeDimensionalTilt from "../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../components/Subtle3DCanvas";
import MiniCases from "../components/MiniCases";
import { buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl } from "../config/siteNetwork";
import { trackOutboundClick } from "../lib/analytics";

interface BrandingProps {
  onNavigate: (page: string) => void;
}

export default function Branding({ onNavigate }: BrandingProps) {
  const [activeFaq, setActiveFaq] = useState(0);

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
  
  // Custom Pinterest Item inputs
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Identidade Visual");
  const [newDescription, setNewDescription] = useState("");
  const [newPinterestUrl, setNewPinterestUrl] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [additionSuccess, setAdditionSuccess] = useState(false);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});

  // Secret admin state to prevent normal visitors from seeing the incorporator
  const [isAdmin, setIsAdmin] = useState(false);
  const [badgeClicks, setBadgeClicks] = useState(0);

  const handleOutboundClick = (label: string, url: string, surface: string) => {
    trackOutboundClick({
      label,
      url,
      surface
    });
  };

  const handleBadgeClick = () => {
    const nextClicks = badgeClicks + 1;
    setBadgeClicks(nextClicks);
    if (nextClicks >= 5) {
      setIsAdmin(prev => {
        const after = !prev;
        if (after) {
          setFormOpen(true);
        } else {
          setFormOpen(false);
        }
        return after;
      });
      setBadgeClicks(0);
    }
  };

  useEffect(() => {
    const DEFAULT_PINTEREST_WORKS = [
      {
        id: "pin-aura-derm",
        title: "Aura ClÃƒÆ’Ã‚Â­nica de Dermatologia",
        category: "ClÃƒÆ’Ã‚Â­nicas & High-Ticket",
        description: "Estudo tipogrÃƒÆ’Ã‚Â¡fico e herÃƒÆ’Ã‚Â¡ldica minimalista para medicina integrativa com acabamento premium. Foco em paleta off-white, dourada e cinza ardÃƒÆ’Ã‚Â³sia.",
        imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=650",
        pinterestUrl: "https://br.pinterest.com/pin/433401532892978001/",
        likesCount: 142,
        challenge: "Substituir a abordagem ambulatorial tradicional de uma clÃƒÆ’Ã‚Â­nica mÃƒÆ’Ã‚Â©dica por um conceito premium focado em bem-estar estÃƒÆ’Ã‚Â©tico de alto padrÃƒÆ’Ã‚Â£o e acolhimento personalizado.",
        solution: "Desenvolvemos um monograma circular unindo as letras A e U na proporÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o ÃƒÆ’Ã‚Â¡urea, utilizando espaÃƒÆ’Ã‚Â§amentos nobres e uma comunicaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o visual ultra clean e luminosa.",
        colors: ["#FDFBF7", "#D4AF37", "#2D3748"],
        colorNames: ["Off-White CrÃƒÆ’Ã‚Â¨me", "Dourado Matte", "ArdÃƒÆ’Ã‚Â³sia Escuro"],
        typography: "Playfair Display & Inter Modern",
        achievement: "+160% de valorizaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o mÃƒÆ’Ã‚Â©dia de consulta e exames no 1Ãƒâ€šÃ‚Âº semestre.",
        deliverables: ["Marca GrÃƒÆ’Ã‚Â¡fica & Selo Autoral", "Papelaria Texturizada Fine-Paper", "Diretrizes Ambientais da ClÃƒÆ’Ã‚Â­nica", "Design Guide Grid para Redes Sociais"]
      },
      {
        id: "pin-lex-cooper",
        title: "Lex Cooper Advogados",
        category: "EscritÃƒÆ’Ã‚Â³rios de Advocacia",
        description: "Rebranding completo com monograma simÃƒÆ’Ã‚Â©trico sÃƒÆ’Ã‚Âªnior e papelaria fÃƒÆ’Ã‚Â­sica em relevo seco e hot stamping cobre para banca corporativa.",
        imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=650",
        pinterestUrl: "https://br.pinterest.com/pin/433401532892978002/",
        likesCount: 98,
        challenge: "Transmitir solidez secular, sofisticaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o e agressividade jurÃƒÆ’Ã‚Â­dica inteligente para atrair fusÃƒÆ’Ã‚Âµes e aquisiÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes e grandes corporaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes internacionais.",
        solution: "Engenharia de marcas sÃƒÆ’Ã‚Âªnior: um monograma geomÃƒÆ’Ã‚Â©trico simÃƒÆ’Ã‚Â©trico com ancoragem de escudo sutil. Uso de papelaria tÃƒÆ’Ã‚Â¡til em relevo seco e acabamentos metalizados texturizados.",
        colors: ["#0C1017", "#B87333", "#E2E8F0"],
        colorNames: ["Preto Imperial", "Cobre Acetinado", "Branco de Alabastro"],
        typography: "Cinzel Serif & JetBrains Mono Technology",
        achievement: "Reposicionamento bem-sucedido resultando no fechamento de 4 novos contratos corporativos de grande porte.",
        deliverables: ["Monograma Institucional Regulado", "Estudo Geral de HerÃƒÆ’Ã‚Â¡ldica", "Papelaria de PrestÃƒÆ’Ã‚Â­gio (Hot Stamping)", "Template Corporativo Unificado"]
      },
      {
        id: "pin-vortex-tech",
        title: "Vortex Tech Partners",
        category: "SaaS & Tech Enterprise",
        description: "Manual de diretrizes visuais unificadas sob grid de alta precisÃƒÆ’Ã‚Â£o geomÃƒÆ’Ã‚Â©trica. Cores frias intercaladas com neon tÃƒÆ’Ã‚Â¡tico estrutural.",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=650",
        pinterestUrl: "https://br.pinterest.com/pin/433401532892978003/",
        likesCount: 187,
        challenge: "Diferenciar um SaaS corporativo em um oceano azul de logotipos azuis e tipografias genÃƒÆ’Ã‚Â©ricas e arredondadas.",
        solution: "Contraste absoluto com uma semiÃƒÆ’Ã‚Â³tica geomÃƒÆ’Ã‚Â©trica de alta tecnologia baseada na velocidade do fluxo e espirais estruturadas (Vortex). Sistema de neon ativo sob ardÃƒÆ’Ã‚Â³sia.",
        colors: ["#020205", "var(--color-brand)", "#00F0FF"],
        colorNames: ["Preto Absoluto", "LimÃƒÆ’Ã‚Â£o QuÃƒÆ’Ã‚Â­mico TAG08", "Ciano Fluorescente"],
        typography: "Space Grotesk & Fira Code Tech",
        achievement: "+80% de engajamento no lanÃƒÆ’Ã‚Â§amento comercial e grande diferenciaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o em pitches de VC.",
        deliverables: ["Logotipo Responsivo FlexÃƒÆ’Ã‚Â­vel", "Biblioteca de Componentes SVG", "UI Style Kit de Design LÃƒÆ’Ã‚Â­quido", "Motion Brand Guideline"]
      },
      {
        id: "pin-emporio-sg",
        title: "EmpÃƒÆ’Ã‚Â³rio Saint Germain",
        category: "Varejo & Premium Brand",
        description: "DireÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o estÃƒÆ’Ã‚Â©tica sÃƒÆ’Ã‚Âªnior aplicada a embalagens de vidro pintadas sob silk, sacolas em papel artesanal e tipografia com respiro clÃƒÆ’Ã‚Â¡ssico.",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=650",
        pinterestUrl: "https://br.pinterest.com/pin/433401532892978004/",
        likesCount: 214,
        challenge: "LanÃƒÆ’Ã‚Â§ar uma nova linha gourmet artesanal de vinhos, azeites e massas premium importadas que precisava comunicar instantaneamente sua tradiÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o europeia refinada.",
        solution: "Tipografia italiana com respiros generosos e ilustraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes sob traÃƒÆ’Ã‚Â§o de caneta bico de pena, integradas a selos herÃƒÆ’Ã‚Â¡ldicos impressos em relevo de cera tÃƒÆ’Ã‚Â¡til.",
        colors: ["#1C1616", "#C5A880", "#FFFDF9"],
        colorNames: ["CafÃƒÆ’Ã‚Â© Expresso", "Ouro Champanhe", "Gesso Natural"],
        typography: "Cormorant Handdrawn & Inter Light",
        achievement: "Esgotamento do primeiro lote de importaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o em apenas 22 dias de relanÃƒÆ’Ã‚Â§amento de prateleira.",
        deliverables: ["Identidade de RÃƒÆ’Ã‚Â³tulos de Garrafas", "Selo HerÃƒÆ’Ã‚Â¡ldico de Origem", "Sacolas e Embalagens em Papel Kraft Fino", "Book de Campanha de LanÃƒÆ’Ã‚Â§amento"]
      }
    ];

    try {
      const stored = localStorage.getItem("tag08_pinterest_works");
      const storedParsed = stored ? JSON.parse(stored) : [];
      // Merge stored with defaults
      const combined = [...storedParsed];
      DEFAULT_PINTEREST_WORKS.forEach(def => {
        if (!combined.some(x => x.id === def.id)) {
          combined.push(def);
        }
      });
      setPinterestWorks(combined);
    } catch (e) {
      setPinterestWorks(DEFAULT_PINTEREST_WORKS);
    }

    try {
      const storedLikes = localStorage.getItem("tag08_pinterest_likes");
      if (storedLikes) {
        setLikedItems(JSON.parse(storedLikes));
      }
    } catch (e) {}
  }, []);

  const handleAddPinterestWork = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!newTitle || !newPinterestUrl) return;

    let finalImg = newImageUrl.trim();
    if (!finalImg) {
      const randomId = Math.floor(Math.random() * 1000);
      finalImg = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=650&sig=${randomId}`;
    }

    const newWork = {
      id: "custom-" + Date.now(),
      title: newTitle,
      category: newCategory,
      description: newDescription || "Projeto de marca autoral com identidade visual refinada integrada ao acervo de design estratÃƒÆ’Ã‚Â©gico da TAG08.",
      imageUrl: finalImg,
      pinterestUrl: newPinterestUrl,
      isCustom: true,
      likesCount: Math.floor(Math.random() * 15) + 1,
      challenge: "Posicionar a marca de forma distinta em seu nicho atravÃƒÆ’Ã‚Â©s de um design autÃƒÆ’Ã‚Âªntico sob medida, transmitindo valor sÃƒÆ’Ã‚Âªnior.",
      solution: "ConstruÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de uma herÃƒÆ’Ã‚Â¡ldica geomÃƒÆ’Ã‚Â©trica exclusiva com tipologia moderna e respiros nobres estruturando harmonia e peso estÃƒÆ’Ã‚Â©tico.",
      colors: ["#16161D", "var(--color-brand)", "#FFFFFF"],
      colorNames: ["Cinza Escuro", "LimÃƒÆ’Ã‚Â£o QuÃƒÆ’Ã‚Â­mico TAG08", "Branco Puro"],
      typography: "Space Grotesk & Inter UI",
      achievement: "ElevaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o imediata do padrÃƒÆ’Ã‚Â£o estÃƒÆ’Ã‚Â©tico digital e manual de diretrizes visuais homologado.",
      deliverables: ["Marca e Vetoriais Regulados", "Paleta de Cores e Tipografias", "Mockups Conceituais", "Diretrizes de MÃƒÆ’Ã‚Â­dia"]
    };

    const updated = [newWork, ...pinterestWorks];
    setPinterestWorks(updated);
    
    // Save only custom ones to local storage
    const customOnly = updated.filter(x => x.isCustom);
    localStorage.setItem("tag08_pinterest_works", JSON.stringify(customOnly));
    
    // Reset
    setNewTitle("");
    setNewDescription("");
    setNewPinterestUrl("");
    setNewImageUrl("");
    setNewCategory("Identidade Visual");
    setAdditionSuccess(true);
    setTimeout(() => setAdditionSuccess(false), 3000);
  };

  const handleDeleteWork = (id: string) => {
    const updated = pinterestWorks.filter(x => x.id !== id);
    setPinterestWorks(updated);
    const customOnly = updated.filter(x => x.isCustom);
    localStorage.setItem("tag08_pinterest_works", JSON.stringify(customOnly));
  };

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
                DIVISÃƒÆ’Ã†â€™O DE VEREDICTO DE MARCA // TAG08
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter uppercase font-display">
                Branding e identidade visual <br />
                <span className="text-brand">para marcas que precisam comunicar valor.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-sans font-medium">
                ConstruÃƒÆ’Ã‚Â­mos ecossistemas visuais sÃƒÆ’Ã‚Â³brios, memorÃƒÆ’Ã‚Â¡veis e totalmente integrados ÃƒÆ’Ã‚Â  altura da maturidade do seu faturamento real. Elevamos a percepÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o estÃƒÆ’Ã‚Â©tica da sua marca para capturar o respeito instantÃƒÆ’Ã‚Â¢neo de clientes que pagam mais caro.
              </p>
            </div>
          </div>

          {/* 2. Panoramic Wide Banner Image with capsule neon overlay trigger wrapped in 3D perspective tilt container */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <img 
                src="https://images.unsplash.com/photo-1541462608141-27b2c7453166?auto=format&fit=crop&q=80&w=1600"
                alt="Processo Criativo de Branding TAG08"
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
                  className="group bg-brand-secondary text-black font-display font-black text-[10px] sm:text-[11px] uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] hover:scale-105 duration-300 transition-all border border-brand-secondary hover:bg-brand-dark flex items-center gap-2 cursor-pointer z-20"
                >
                  <span>REPROJETAR MINHA MARCA</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Absolute indicator tags on corners */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="font-mono text-[8.5px] text-brand-secondary tracking-widest block uppercase font-semibold">TAG08 VISUAL HUB</span>
                  <h4 className="font-display font-black text-white text-xs sm:text-sm uppercase tracking-tight leading-none">Matrizes de Alto Calibre e DiferenciaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o</h4>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-[8px] text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>BRAND_CORE // ENGAGED</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* 3. High status core statistics row matching screenshot layout */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">100%</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Arquivos Vetorizados<br/>Completos em Alta DefinaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">2.5x</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Mais Autoridade e<br/>PercepÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de Valor Imediata</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">SÃƒÆ’Ã‚Â³brio</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Paletas Estritamente<br/>Elegantes e Atemporais</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">30 Dias</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Prazo MÃƒÆ’Ã‚Â©dio Estrito de<br/>Estoque de CriaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o Core</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2 - DIAGNOSTIC & PERSPECTIVE SHIFT (AUDITORIA INTERAL E DOR) */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-zinc-950 text-left relative overflow-hidden">
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/[0.01] rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-28 relative z-10">
          
          {/* Sinais de que sua marca precisa de branding - CLINICAL DIAGNOSTIC CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
              <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-semibold bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                AUDITORIA INTERNA // POSICIONAMENTO
              </span>
              <h3 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
                Instabilidades Atuais de Autoridade
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                Se os seus canais transmitem incoerÃƒÆ’Ã‚Âªncia tÃƒÆ’Ã‚Â©cnica ou falta de capricho, seus clientes tentarÃƒÆ’Ã‚Â£o forÃƒÆ’Ã‚Â§ar barganhas constantes por falta de diferenciaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o soberana. Verifique se o seu posicionamento ÃƒÆ’Ã‚Â© frÃƒÆ’Ã‚Â¡gil:
              </p>
              
              <div className="p-5 rounded-2xl bg-brand-secondary/[0.01] border border-brand-secondary/5 text-xs text-zinc-400 font-sans">
                <span className="text-brand-secondary font-black uppercase block mb-1">CONSEQUÃƒÆ’Ã…Â NCIA DIRETA:</span>
                Sem uniformidade nos criativos, cada arte ou PDF gerado parece ter sido concebido por uma empresa de menor autoridade.
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {[
                "Sua marca atual nÃƒÆ’Ã‚Â£o transmite a sofisticaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o ou a real magnitude fÃƒÆ’Ã‚Â­sica offline da sua entrega comercial.",
                "Cada material, proposta comercial ou rede do ecossistema carrega paletas distintas e layouts desestruturados.",
                "Seus clientes costumam tentar comparar seus preÃƒÆ’Ã‚Â§os de forma direta por sentirem falta de um valor majestoso.",
                "Seu time de vendas opera em timidez intelectual por nÃƒÆ’Ã‚Â£o possuir um tom verbal ou direcionador claro.",
                "A identidade que sustenta seu posicionamento atual estÃƒÆ’Ã‚Â¡ defasada e jÃƒÆ’Ã‚Â¡ nÃƒÆ’Ã‚Â£o condiz com seu faturamento real."
              ].map((signal, sIdx) => (
                <div key={sIdx} className="flex gap-4 items-start p-4 rounded-2xl bg-charcoal-900 border border-white/[0.03] hover:border-white/[0.06] transition-all">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-secondary shrink-0 shadow-[0_0_8px_var(--color-brand-secondary)]" />
                  <p className="text-zinc-300 text-xs sm:text-sm font-sans font-medium leading-relaxed text-left">{signal}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Logo NÃƒÆ’Ã‚Â£o ÃƒÆ’Ã‚Â© Branding - ASYMMETRIC GRID INTERACTIVES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-baseline pt-12 border-t border-white/[0.04]">
            <div className="lg:col-span-4 space-y-4">
              <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-semibold bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                DESMISTIFICAÃƒÆ’Ã¢â‚¬Â¡ÃƒÆ’Ã†â€™O // VALOR PERCEBIDO
              </span>
              <h2 className="font-display font-medium text-3xl text-white uppercase tracking-tight leading-tight">
                Logotipo ÃƒÆ’Ã‚Â© apenas a ponta do iceberg visual
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                Muitas empresas contratam designers amadores focadas puramente em sÃƒÆ’Ã‚Â­mbolos baratos, ignorando que o posicionamento e os canais de fidelizaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o constituem o verdadeiro faturamento de marcas sÃƒÆ’Ã‚Âªnior:
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { title: "O Logotipo Identifica", focus: "SIGNATURA", desc: "A assinatura vetorial minimalista. Serve unicamente para que seus clientes o identifiquem em faturas e mÃƒÆ’Ã‚Â­dias." },
                { title: "A Identidade Organiza", focus: "HARMONIZAÃƒÆ’Ã¢â‚¬Â¡ÃƒÆ’Ã†â€™O", desc: "Regula o ecossistema estÃƒÆ’Ã‚Â©tico: paletas rÃƒÆ’Ã‚Â­tmicas de cores, regras de layout e fontes sÃƒÆ’Ã‚Âªniores unificadas de expressÃƒÆ’Ã‚Â£o." },
                { title: "O Branding ConstrÃƒÆ’Ã‚Â³i", focus: "SOBERANIA", desc: "O manual intelectual estratÃƒÆ’Ã‚Â©gico invisÃƒÆ’Ã‚Â­vel. Guia o tom de voz sÃƒÆ’Ã‚Âªnior, a copy autoral de lÃƒÆ’Ã‚Â­der e impÃƒÆ’Ã‚Âµe preÃƒÆ’Ã‚Â§o premium." }
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-neutral-900/40 border border-white/[0.04] space-y-4 hover:border-brand-secondary/15 hover:bg-white/[0.01] transition-all duration-300">
                  <div className="flex items-center justify-between border-b border-white/[0.03] pb-3 text-[9px] font-sans text-zinc-500">
                    <span>EIXO DE MARCA</span>
                    <span className="text-brand-secondary">{item.focus}</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white text-xs sm:text-sm font-display font-bold uppercase tracking-tight">{item.title}</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maturidade EstÃƒÆ’Ã‚Â©tica - QUANDO INVESTIR IN DESIGN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-12 border-t border-white/[0.04]">
            <div className="lg:col-span-4 space-y-4">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">MATURIDADE ESTÃƒÆ’Ã¢â‚¬Â°TICA</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-none tracking-tight">
                SISTEMAS VISUAIS SÃƒÆ’Ã†â€™O <span className="text-brand">ACELERADORES DE VALOR.</span>
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Descubra os pontos cruciais onde a comunicaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o amadora da sua marca estÃƒÆ’Ã‚Â¡ vazando lucros silenciosos no ambiente digital.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
                <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">01 // MARCA COM INCOMPATIBILIDADE</span>
                <h4 className="text-white font-display font-black text-sm uppercase">O offline fatura, mas o online afasta</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Seu serviÃƒÆ’Ã‚Â§o prestado no mundo real ÃƒÆ’Ã‚Â© impecÃƒÆ’Ã‚Â¡vel e de ticket relevante, mas o design das suas pÃƒÆ’Ã‚Â¡ginas de captura passa pressa e amadorismo. Harmonizamos essa coerÃƒÆ’Ã‚Âªncia de imediato.
                </p>
              </div>

              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
                <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">02 // ESCAPE DO COMMODITY</span>
                <h4 className="text-white font-display font-black text-sm uppercase">Fuga da mesmice visual saturada</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Evite bancos de vetores clichÃƒÆ’Ã‚Âªs, logos prontos e paletas infantis coloridas demais. Fornecemos estruturas discretas, tÃƒÆ’Ã‚Â¡ticas e com tipografia imponente focada em peso corporativo.
                </p>
              </div>

              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
                <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">03 // BLINDAGEM DE CONTRATO</span>
                <h4 className="text-white font-display font-black text-sm uppercase">PrestÃƒÆ’Ã‚Â­gio cognitivo imediato</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Sua marca corporativa atua como o primeiro argumento silencioso. Reduza objeÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes de preÃƒÆ’Ã‚Â§os altos surpreendendo o visitante desde o primeiro pixel visÃƒÆ’Ã‚Â­vel de contato.
                </p>
              </div>

              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
                <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">04 // PADRÃƒÆ’Ã†â€™O UNIFICADO MÃƒÆ’Ã…Â¡LTIPLO</span>
                <h4 className="text-white font-display font-black text-sm uppercase">Escalonamento com seguranÃƒÆ’Ã‚Â§a de equipe</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  A equipe comercial, os fornecedores e as grÃƒÆ’Ã‚Â¡ficas de impressÃƒÆ’Ã‚Â£o passam a operar sob as mesmas regras exatas detalhadas no Manual Visual da TAG08, sem ruÃƒÆ’Ã‚Â­do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - DELIVERABLES (The "What" with Clean Features Grid) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-bold">ENTREGÃƒÆ’Ã‚ÂVEIS DE ALTO IMPACTO CORPORATIVO</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">ATIVADE OPERACIONAL DE CRIAÃƒÆ’Ã¢â‚¬Â¡ÃƒÆ’Ã†â€™O VISUAL</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              NÃƒÆ’Ã‚Â£o entregamos apenas um arquivo solto de logo. Entregamos uma arquitetura de marca de ponta a ponta pronta para performar nos maiores nÃƒÆ’Ã‚Â­veis do mercado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Compass className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Identidade Corporativa</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Logotipos modernos corporativos, sÃƒÆ’Ã‚Â­mbolos geomÃƒÆ’Ã‚Â©tricos discretos e a icÃƒÆ’Ã‚Â´nica combinaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o da paleta sÃƒÆ’Ã‚Â³bria (preto absoluto, ardÃƒÆ’Ã‚Â³sia e neon tÃƒÆ’Ã‚Â¡tico) com tipografias exclusivas de alto calibre.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Manual de Diretrizes</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Guia estrutural cirurgicamente detalhado que ensina seus parceiros internos, agÃƒÆ’Ã‚Âªncias e subcontratados de marketing a aplicarem as diretrizes de design sem alterar as proporÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes ou desorganizar a comunicaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Tom de Voz &amp; Copys</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Matrizes verbais orientadas ÃƒÆ’Ã‚Â  maturidade da imagem empresarial. Definimos as exatas palavras recomendadas, jargÃƒÆ’Ã‚Âµes estratÃƒÆ’Ã‚Â©gicos e narrativas proprietÃƒÆ’Ã‚Â¡rias de storytelling para blindar o status da sua empresa.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Layers className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">AplicaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes Reais</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Mapeamento de templates institucionais prontos, papelarias digitais refinadas de envio corporativo, apresentaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes de proposta comercial elegantÃƒÆ’Ã‚Â­ssimas e assinaturas eletroneves unificadas de e-mail.
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
            <h4 className="text-white font-display font-black text-sm uppercase tracking-tight">ARQUIVOS ORIGINAIS VETORIZADOS INDEPENDENTES</h4>
            <p className="text-zinc-400 text-xs font-sans font-medium leading-relaxed">
              Sem burocracias. ApÃƒÆ’Ã‚Â³s a validaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o mÃƒÆ’Ã‚Âºtua, compartilhamos pastas na nuvem permanentes em nossa infraestrutura contendo todos os arquivos editÃƒÆ’Ã‚Â¡veis nativos (SVG, EPS, PDF Vetorizado e Adobe Illustrator original) para uso irrestrito da sua marca de ponta a ponta.
            </p>
          </div>
          <span className="font-mono text-[8.5px] text-brand-secondary uppercase tracking-widest border border-brand-secondary/20 bg-brand-secondary/5 px-3.5 py-2 rounded-xl shrink-0 font-black">
            NATIVE BRAND VERDICT // TAG08
          </span>
        </div>
      </section>

      {/* BRANDING CLIENTS LOGO SOCIAL PROOF */}
      <MiniCases 
        onNavigate={onNavigate} 
        title="Posicionamento e Identidade Consolidada"
        subtitle="InstituiÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes, escritÃƒÆ’Ã‚Â³rios e clÃƒÆ’Ã‚Â­nicas mÃƒÆ’Ã‚Â©dicas que confiam na direÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de arte sÃƒÆ’Ã‚Â³bria da TAG08."
        badge="BRANDING PROOF // IDENTIDADES DE ALTO PRESTÃƒÆ’Ã‚ÂGIO"
      />

      {/* PINTEREST SHOWCASE SECTION */}
      <section id="pinterest-brand-showcase" className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-950/40 relative overflow-hidden text-left">
        {/* Ambient shadow gradient */}
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-brand-secondary/[0.015] rounded-full blur-[130px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          {/* Section Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end border-b border-white/[0.04] pb-8">
            <div className={`${isAdmin ? "lg:col-span-8" : "lg:col-span-12"} space-y-3`}>
              <span 
                onClick={handleBadgeClick}
                className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-semibold bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block cursor-help select-none active:scale-95 transition-transform"
                title="ÃƒÆ’Ã‚Ârea restrita de gestÃƒÆ’Ã‚Â£o. Clique 5 vezes para habilitar recursos ocultos."
              >
                {isAdmin ? "PORTFÃƒÆ’Ã¢â‚¬Å“LIO IMERSIVO // PAINEL RESTRITO DE GESTÃƒÆ’Ã†â€™O (ATIVADO) ÃƒÂ¢Ã…Â¡Ã¢â€žÂ¢ÃƒÂ¯Ã‚Â¸Ã‚Â" : "PORTFÃƒÆ’Ã¢â‚¬Å“LIO IMERSIVO // PINTEREST HUB"}
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight leading-none">
                Estilo &amp; Identidades Autorais
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans font-medium max-w-2xl leading-relaxed">
                Nossas marcas usam o <span className="text-brand">br.pinterest.com</span> de forma estratÃƒÆ’Ã‚Â©gica para armazenar o acervo de herÃƒÆ’Ã‚Â¡ldica, tipologia e conceito definitivo em alta definiÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o. Navegue no portfÃƒÆ’Ã‚Â³lio coletivo abaixo e acesse as pranchas originais.
              </p>
            </div>
            
            {isAdmin && (
              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <button
                  onClick={() => setFormOpen(!formOpen)}
                  className={`group flex items-center gap-2 p-3 rounded-xl font-mono text-[10px] uppercase tracking-widest font-semibold transition-all border ${
                    formOpen 
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                      : "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20 hover:bg-brand-secondary hover:text-black hover:shadow-[0_4px_20px_rgba(var(--color-brand-secondary-rgb),0.15)]"
                  }`}
                >
                  {formOpen ? (
                    <>
                      <span>FECHAR PAINEL GESTÃƒÆ’Ã†â€™O</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>INCORPORAR NOVA MARCA</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Collapsable Creator Panel */}
          <AnimatePresence>
            {formOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:p-8 bg-charcoal-900 border border-white/[0.08] rounded-3xl space-y-6 relative">
                  <div className="absolute top-4 right-4 font-mono text-[8px] text-zinc-600">SYS // PIN_LINK_STRATEGY</div>
                  
                  <div className="space-y-1">
                    <h3 className="text-white font-display font-bold text-sm uppercase flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-brand" />
                      Adicionar Nova Marca Criativa (Hyperlink Pinterest)
                    </h3>
                    <p className="text-zinc-400 text-xs font-sans">
                      Insira o tÃƒÆ’Ã‚Â­tulo da marca, selecione o setor e forneÃƒÆ’Ã‚Â§a o link ativo do Pinterest correspondente para que ele seja incorporado dinamicamente ao portfÃƒÆ’Ã‚Â³lio.
                    </p>
                  </div>

                  <form onSubmit={handleAddPinterestWork} className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="md:col-span-4 space-y-1">
                      <label className="block font-mono text-[9px] uppercase text-zinc-500 tracking-wider font-bold">TÃƒÆ’Ã‚Â­tulo da Marca / Cliente</label>
                      <input 
                        type="text"
                        required
                        placeholder="Ex: Arctica Concept"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand font-medium tracking-wide placeholder-zinc-700 transition-all"
                      />
                    </div>

                    <div className="md:col-span-4 space-y-1">
                      <label className="block font-mono text-[9px] uppercase text-zinc-500 tracking-wider font-bold">Setor / Categoria de Marca</label>
                      <select 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand font-medium tracking-wide transition-all"
                      >
                        <option value="ClÃƒÆ’Ã‚Â­nicas & High-Ticket">ClÃƒÆ’Ã‚Â­nicas &amp; High-Ticket</option>
                        <option value="EscritÃƒÆ’Ã‚Â³rios de Advocacia">EscritÃƒÆ’Ã‚Â³rios de Advocacia</option>
                        <option value="SaaS &amp; Tech Enterprise">SaaS &amp; Tech Enterprise</option>
                        <option value="Varejo &amp; Premium Brand">Varejo &amp; Premium Brand</option>
                        <option value="Identidade Autoral">Identidade Autoral</option>
                        <option value="Rebranding EstÃƒÆ’Ã‚Âºdio">Rebranding EstÃƒÆ’Ã‚Âºdio</option>
                      </select>
                    </div>

                    <div className="md:col-span-4 space-y-1">
                      <label className="block font-mono text-[9px] uppercase text-zinc-500 tracking-wider font-bold">Pinterest Link (Hyperlink de Origem)</label>
                      <input 
                        type="url"
                        required
                        placeholder="Ex: https://br.pinterest.com/pin/..."
                        value={newPinterestUrl}
                        onChange={(e) => setNewPinterestUrl(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand font-medium tracking-wide placeholder-zinc-700 transition-all"
                      />
                    </div>

                    <div className="md:col-span-8 space-y-1">
                      <label className="block font-mono text-[9px] uppercase text-zinc-500 tracking-wider font-bold">DescriÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o Curta Conceitual</label>
                      <input 
                        type="text"
                        placeholder="Descreva brevemente a herÃƒÆ’Ã‚Â¡ldica, a harmonia e o posicionamento estÃƒÆ’Ã‚Â©tico da marca..."
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand font-medium tracking-wide placeholder-zinc-700 transition-all"
                      />
                    </div>

                    <div className="md:col-span-4 space-y-1">
                      <label className="block font-mono text-[9px] uppercase text-zinc-500 tracking-wider font-bold">Link da Imagem de Capa (Opcional)</label>
                      <input 
                        type="url"
                        placeholder="Vazio para gerar capa estÃƒÆ’Ã‚Â©tica minimalista"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand font-medium tracking-wide placeholder-zinc-700 transition-all"
                      />
                    </div>

                    <div className="md:col-span-12 flex justify-between items-center pt-3 border-t border-white/[0.04]">
                      <span className="text-[10px] text-zinc-500 font-sans">
                        *As marcas adicionadas serÃƒÆ’Ã‚Â£o salvas temporariamente no seu navegador usando LocalStorage.
                      </span>

                      <button
                        type="submit"
                        className="bg-brand-secondary hover:bg-brand-dark text-black font-mono font-black text-[10px] uppercase tracking-widest py-3 px-6 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Publicar e Incorporar no Feed</span>
                      </button>
                    </div>
                  </form>

                  {additionSuccess && (
                     <div className="p-3.5 bg-brand/10 border border-brand/20 text-brand rounded-xl text-xs font-sans flex items-center gap-2">
                       <CheckCircle className="w-4 h-4 animate-bounce" />
                       <span>A marca foi adicionada com sucesso e estruturada no feed de hiperlinks abaixo!</span>
                     </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filtering Tabs Row */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.03] pb-4">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block font-bold mr-3">FILTRAR PORTFÃƒÆ’Ã¢â‚¬Å“LIO:</span>
            {["todos", ...Array.from(new Set(pinterestWorks.map(item => item.category)))].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`font-mono text-[9px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  filterCategory === cat
                    ? "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/30 shadow-[0_2px_12px_rgba(var(--color-brand-secondary-rgb),0.08)] font-bold"
                    : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                }`}
              >
                {cat === "todos" ? "Visualizar Todas" : cat}
              </button>
            ))}
          </div>

          {/* Pinterest Fluid Grid */}
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
                      onClick={() => setSelectedWork(work)}
                      className="bg-charcoal-900 border border-white/[0.06] hover:border-brand/40 duration-300 rounded-3xl overflow-hidden flex flex-col justify-between group shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all cursor-pointer"
                    >
                      {/* Image Frame with hover scale */}
                      <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden border-b border-white/[0.04]">
                        <img 
                          src={work.imageUrl} 
                          alt={work.title} 
                          className="w-full h-full object-cover group-hover:scale-105 duration-700 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        {/* Elegant overlay masks */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/30 opacity-70 group-hover:opacity-60 transition-opacity pointer-events-none" />
                        
                        {/* Upper indicators */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
                          <span className="font-mono text-[8px] bg-black/60 backdrop-blur-md text-zinc-300 font-bold tracking-widest uppercase py-1 px-2.5 rounded-md border border-white/5 shadow-sm">
                            {work.category}
                          </span>
                          
                          {/* Favorite/Engagement Heart */}
                          <button
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

                        {/* Floating interaction overlay on image center */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedWork(work);
                            }}
                            className="bg-brand-secondary hover:bg-white text-black font-mono text-[9px] uppercase tracking-widest font-black py-2.5 px-4 rounded-xl flex items-center gap-1.5 scale-90 group-hover:scale-100 transition-all duration-300 shadow-[0_4px_15px_rgba(var(--color-brand-secondary-rgb),0.3)]"
                          >
                            <span>Apreciar Conceito</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        {/* Bottom technical index bar */}
                        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-zinc-500 font-sans text-[7px] tracking-wider select-none pointer-events-none">
                          <span>CONCEPT_CASE_TAG08</span>
                          <span className="text-zinc-400 flex items-center gap-1">
                            <Heart className="w-2 h-2 text-red-500" />
                            {work.likesCount || 0}
                          </span>
                        </div>
                      </div>

                      {/* Card Information */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <h4 className="text-white font-display font-black text-sm uppercase group-hover:text-brand transition-colors text-left truncate">
                            {work.title}
                          </h4>
                          <p className="text-zinc-400 text-[11px] leading-relaxed font-sans font-medium line-clamp-3 text-left">
                            {work.description}
                          </p>
                        </div>

                        {/* Card bottom direct actions */}
                        <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => setSelectedWork(work)}
                            className="text-[10px] font-sans text-zinc-400 hover:text-brand flex items-center gap-1 group-hover:translate-x-0.5 transition-all text-left cursor-pointer"
                          >
                            <span>ApresentaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o Visual</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-brand-secondary" />
                          </button>

                          {work.isCustom && isAdmin && (
                            <button
                              onClick={() => handleDeleteWork(work.id)}
                              className="text-zinc-600 hover:text-zinc-300 transition-colors p-1 cursor-pointer"
                              title="Remover este pin customizado"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </div>

          {/* Pinterest Integration Tips banner */}
          {isAdmin && (
            <div className="p-6 bg-charcoal-900 border border-white/[0.06] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center shrink-0">
                  <Bookmark className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <h5 className="text-white text-xs font-mono font-bold uppercase">IntegraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o do Hub de Criatividade TAG08</h5>
                  <p className="text-zinc-400 text-[11px]">VocÃƒÆ’Ã‚Âª pode organizar todas as referÃƒÆ’Ã‚Âªncias criando pins dedicados em seu Pinterest empresarial e carregando-os diretamente aqui neste espaÃƒÆ’Ã‚Â§o.</p>
                </div>
              </div>
              <a 
              href="https://br.pinterest.com" 
              target="_blank" 
              rel="noreferrer" 
              onClick={() => handleOutboundClick("Pinterest", "https://br.pinterest.com", "branding-pinterest")}
              className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest hover:underline bg-red-500/5 px-3.5 py-2 rounded-xl border border-red-500/10"
              >
                Ir para o br.pinterest.com
              </a>
            </div>
          )}



        </div>
      </section>

      {/* SECTION - WORK SYSTEM (WhatsApp Neon Callout inspired by screenshot) */}
      <section className="py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          {/* Left Column: Portrait */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[520px]">
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden" />
            <img 
              src="https://images.unsplash.com/photo-1541462608141-27b2c7453166?auto=format&fit=crop&q=80&w=800" 
              alt="TAG08 Branding Specialist" 
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
                  branding_conceitual
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                  identidade_sÃƒÆ’Ã‚Âªnior_
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  LATENCY: 12MS
                </span>
                <span className="font-mono text-[9px] text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  SÃƒÆ’Ã…Â NIOR SECURITY
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
                SISTEMA VISUAL <br />
                SÃƒÆ’Ã…Â NIOR E CONCEITUAL!
              </h2>
              <p className="text-black/85 text-[11px] sm:text-xs max-w-lg leading-relaxed font-sans font-extrabold uppercase">
                ELEVE A REPUTAÃƒÆ’Ã¢â‚¬Â¡ÃƒÆ’Ã†â€™O DO SEU NEGÃƒÆ’Ã¢â‚¬Å“CIO COM A HERÃƒÆ’Ã‚ÂLDICA, TIPOGRAFIAS CONCEITUAIS SELECIONADAS E UMA PALETA EXCLUSIVA DESENHADA PARA ATRAIR EXCLUSIVAMENTE CLIENTES SÃƒÆ’Ã…Â NIOR E DE GRANDE ESCALA.
              </p>
            </div>

            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 max-w-md relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-4 items-start select-none">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black shrink-0 shadow-lg shadow-brand/10 hover:scale-105 transition-transform duration-200">
                  <Compass className="w-5 h-5 stroke-[2.5] text-black" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-[8px] text-brand uppercase tracking-wider font-extrabold block">
                    EQUILÃƒÆ’Ã‚ÂBRIO COGNITIVO
                  </span>
                  <p className="text-white text-xs leading-snug font-sans font-semibold">
                    Substitua logotipos clichÃƒÆ’Ã‚Âªs por marcas expressivas e minimalistas que impÃƒÆ’Ã‚Âµem autoridade intelectual imediata perante concorrentes.
                  </p>
                </div>
              </div>

              {/* DUAL CLIENT CONNECTION CHANNELS (BR & INT) */}
              <div className="space-y-3">
                <a 
                  href={buildBrazilWhatsAppUrl("OlÃƒÆ’Ã‚Â¡,%20gostaria%20de%20solicitar%20um%20diagnÃƒÆ’Ã‚Â³stico%20de%20branding%20com%20a%20TAG08")}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleOutboundClick("WhatsApp", buildBrazilWhatsAppUrl("OlÃƒÆ’Ã‚Â¡,%20gostaria%20de%20solicitar%20um%20diagnÃƒÆ’Ã‚Â³stico%20de%20branding%20com%20a%20TAG08"), "branding-diagnosis-br")}
                  className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-black transition-all duration-200">
                        <span className="text-[9px] font-mono font-black tracking-tight text-brand group-hover:text-black">BR</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase font-black tracking-wider leading-none">
                          PROPRIETÃƒÆ’Ã‚ÂRIO DIRETO (WhatsApp)
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
                  href={buildInternationalWhatsAppUrl("Hello,%20I%20would%20like%20to%20request%20a%20premium%20branding%20and%20identity%20diagnosis%20for%20our%20enterprise%20from%20TAG08")}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleOutboundClick("WhatsApp", buildInternationalWhatsAppUrl("Hello,%20I%20would%20like%20to%20request%20a%20premium%20branding%20and%20identity%20diagnosis%20for%20our%20enterprise%20from%20TAG08"), "branding-diagnosis-int")}
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
                    AGÃƒÆ’Ã…Â NCIA TAG08
                  </span>
                </div>
                <span className="font-sans text-[8.5px] text-brand font-bold bg-brand/10 border border-brand/20 px-2 rounded">
                  OPERAÃƒÆ’Ã¢â‚¬Â¡ÃƒÆ’Ã†â€™O ATIVA 100% online
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - SOLUTIONS & RICH GUIDES (ENTREGÃƒÆ’Ã‚ÂVEIS FINOS, EVOLUÃƒÆ’Ã¢â‚¬Â¡ÃƒÆ’Ã†â€™O E FECHAMENTO) */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-900/10 text-left">
        <div className="max-w-7xl mx-auto space-y-28">

          {/* INTERACTIVE INNOVATION: SIMULADOR DE ARQUÃƒÆ’Ã¢â‚¬Â°TIPOS E DIREÃƒÆ’Ã¢â‚¬Â¡ÃƒÆ’Ã†â€™O VISUAL */}
          <div className="space-y-12">
            <div className="space-y-3 max-w-3xl">
              <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-semibold bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                DIREÃƒÆ’Ã¢â‚¬Â¡ÃƒÆ’Ã†â€™O CRIATIVA // SIMULADOR DE POSICIONAMENTO
              </span>
              <h2 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
                Simulador de ArquÃƒÆ’Ã‚Â©tipos e DireÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de Marca
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                Marcas lÃƒÆ’Ã‚Â­deres de faturamento nÃƒÆ’Ã‚Â£o surgem por acaso; elas sÃƒÆ’Ã‚Â£o construÃƒÆ’Ã‚Â­das sobre pilares psicolÃƒÆ’Ã‚Â³gicos fortes. Escolha um dos quatro arquÃƒÆ’Ã‚Â©tipos corporativos abaixo para visualizar instantaneamente como o direcionamento tipogrÃƒÆ’Ã‚Â¡fico, paleta de cores e tom verbal moldam a percepÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de status da sua marca.
              </p>
            </div>

            {/* Simulated Interactive Widgets Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Archetype Selectors */}
              <div className="lg:col-span-5 bg-charcoal-900/60 border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 text-left">
                <div className="space-y-4">
                  <span className="font-mono text-[9.5px] text-zinc-500 uppercase tracking-widest font-bold block pb-2 border-b border-white/[0.05]">
                    ESCOLHA O ARQUÃƒÆ’Ã¢â‚¬Â°TIPO CORPORATIVO:
                  </span>

                  {/* Archetype buttons */}
                  {[
                    { id: "sabio", name: "O SÃƒÆ’Ã‚Â¡bio (Autoridade ClÃƒÆ’Ã‚Â­nica)", desc: "Focado em exatidÃƒÆ’Ã‚Â£o, verdade tÃƒÆ’Ã‚Â©cnica e prestÃƒÆ’Ã‚Â­gio consistente. Excelente para clÃƒÆ’Ã‚Â­nicas, escritÃƒÆ’Ã‚Â³rios de advocacia e assessorias que precisam de posicionamento sÃƒÆ’Ã‚Â³lido." },
                    { id: "criador", name: "O Criador (Design & InovaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o)", desc: "EstÃƒÆ’Ã‚Â©tica de luxo vanguardista, quebra de convenÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes e originalidade absoluta. Indicado para empresas de tecnologia e startups com viÃƒÆ’Ã‚Â©s estÃƒÆ’Ã‚Â©tico." },
                    { id: "governante", name: "O Governante (Legado e Solidez)", desc: "Estilo sÃƒÆ’Ã‚Â³brio, imperial, com viÃƒÆ’Ã‚Â©s clÃƒÆ’Ã‚Â¡ssico herÃƒÆ’Ã‚Â¡ldico de riqueza estÃƒÆ’Ã‚Â¡vel. Ideal para holdings, family offices e incorporadoras premium." },
                    { id: "mago", name: "O Mago (Tecnologia Disruptiva)", desc: "Linguagem futurista e experiÃƒÆ’Ã‚Âªncias quase mÃƒÆ’Ã‚Â¡gicas de automaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o e agilidade. Perfeito para softwares de vanguarda e inteligÃƒÆ’Ã‚Âªncia de dados." }
                  ].map((arch) => {
                    const isSelected = (() => {
                      const active = typeof window !== "undefined" && (window as any)._activeArch ? (window as any)._activeArch : "sabio";
                      return active === arch.id;
                    })();
                    return (
                      <button
                        key={arch.id}
                        onClick={() => {
                          (window as any)._activeArch = arch.id;
                          // Force UI refresh by updating targets manually
                          const previewCard = document.getElementById("brand-preview-card");
                          const previewTitle = document.getElementById("preview-title");
                          const previewTagline = document.getElementById("preview-tagline");
                          const previewBadge = document.getElementById("preview-badge");
                          const previewValues = document.getElementById("preview-values");
                          const previewFit = document.getElementById("preview-fit");
                          
                          if (previewCard && previewTitle && previewTagline && previewBadge && previewValues && previewFit) {
                            if (arch.id === "sabio") {
                              previewCard.className = "p-8 rounded-[24px] border-2 bg-zinc-950 border-zinc-800 text-left transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[360px] shadow-[0_20px_50px_rgba(255,255,255,0.02)]";
                              previewTitle.className = "text-xl sm:text-2xl text-amber-50 font-serif tracking-tight uppercase leading-tight font-medium";
                              previewTitle.innerText = "ClÃƒÆ’Ã‚Â­nica Dr. Gabriel MedVinci";
                              previewTagline.innerText = '"Autoridade clÃƒÆ’Ã‚Â­nica e excelÃƒÆ’Ã‚Âªncia cientÃƒÆ’Ã‚Â­fica inabalÃƒÆ’Ã‚Â¡vel focado em tratamentos particulares premium."';
                              previewTagline.className = "text-zinc-400 font-sans italic text-xs leading-relaxed";
                              previewBadge.innerText = "PRESTÃƒÆ’Ã‚ÂGIO & EXATIDÃƒÆ’Ã†â€™O";
                              previewBadge.className = "font-mono text-[8px] bg-white/5 text-amber-100 border border-white/10 px-2 py-0.5 rounded font-black uppercase";
                              previewValues.innerText = "ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Credibilidade TÃƒÆ’Ã‚Â©cnica\nÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Verdade CientÃƒÆ’Ã‚Â­fica\nÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ DiagnÃƒÆ’Ã‚Â³stico CirÃƒÆ’Ã‚Âºrgico";
                              previewFit.innerText = "Medicina SÃƒÆ’Ã‚Âªnior, Advocacia de Elite, Fundos de Investimento";
                            } else if (arch.id === "criador") {
                              previewCard.className = "p-8 rounded-[24px] border-2 bg-black border-brand/20 text-left transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[360px] shadow-[0_20px_50px_rgba(var(--color-brand-rgb),0.05)]";
                              previewTitle.className = "text-xl sm:text-2xl text-brand font-display uppercase tracking-tighter leading-none font-black";
                              previewTitle.innerText = "TAG08 Studio & Tech";
                              previewTagline.innerText = '"Se o seu nicho de mercado ÃƒÆ’Ã‚Â© comum e comoditizado, altere as regras do jogo e refine seu status."';
                              previewTagline.className = "text-zinc-300 font-mono text-xs font-bold uppercase tracking-tight leading-snug";
                              previewBadge.innerText = "VANGUARDA VISUAL // DESIGN NATIVO";
                              previewBadge.className = "font-mono text-[8px] bg-brand/10 text-brand border border-brand/20 px-2 py-0.5 rounded font-black uppercase";
                              previewValues.innerText = "ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ EstÃƒÆ’Ã‚Â©tica Autoral de Luxo\nÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ DiferenciaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o Radical\nÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Interfaces Autorais";
                              previewFit.innerText = "Tecnologia, Startups SaaS, AgÃƒÆ’Ã‚Âªncias de Marca, EstÃƒÆ’Ã‚Âºdios";
                            } else if (arch.id === "governante") {
                              previewCard.className = "p-8 rounded-[24px] border-2 bg-[#091122] border-[#1b2b4e] text-left transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[360px] shadow-[0_20px_50px_rgba(251,191,36,0.03)]";
                              previewTitle.className = "text-xl sm:text-2xl text-amber-400 uppercase tracking-widest leading-tight font-semibold";
                              previewTitle.innerText = "Kronos Partners Trust";
                              previewTagline.innerText = '"A heranÃƒÆ’Ã‚Â§a invisÃƒÆ’Ã‚Â­vel de faturamento sÃƒÆ’Ã‚Â³lido, blindagem patrimonial e seguranÃƒÆ’Ã‚Â§a institucional soberana."';
                              previewTagline.className = "text-zinc-400 font-serif text-xs leading-relaxed";
                              previewBadge.innerText = "LEGADO & PODER HIERÃƒÆ’Ã‚ÂRDICO";
                              previewBadge.className = "font-mono text-[8px] bg-amber-400/5 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded font-black uppercase";
                              previewValues.innerText = "ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Solidez Geracional\nÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Alta GovernanÃƒÆ’Ã‚Â§a B2B\nÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Respeito Institucional";
                              previewFit.innerText = "Holdings Financeiras, Incorporadoras de Luxo, Family Offices";
                            } else {
                              previewCard.className = "p-8 rounded-[24px] border-2 bg-[#0d0722] border-[#25174e] text-left transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[360px] shadow-[0_20px_50px_rgba(168,85,247,0.05)]";
                              previewTitle.className = "text-xl sm:text-2xl text-purple-400 font-sans uppercase tracking-tight leading-none font-bold";
                              previewTitle.innerText = "AeroCargo LogÃƒÆ’Ã‚Â­stica Int.";
                              previewTagline.innerText = '"Sistemas fluidos e transformaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes que dissolvem atritos manuais em segundos de carregamento."';
                              previewTagline.className = "text-zinc-400 font-sans text-xs leading-relaxed";
                              previewBadge.innerText = "TRANSFORMAÃƒÆ’Ã¢â‚¬Â¡ÃƒÆ’Ã†â€™O DIGITAL // FLUIDEZ";
                              previewBadge.className = "font-mono text-[8px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-black uppercase";
                              previewValues.innerText = "ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ ExperiÃƒÆ’Ã‚Âªncia de UsuÃƒÆ’Ã‚Â¡rio Fluida\nÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Engenharia Veloz\nÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ VisÃƒÆ’Ã‚Â£o RevolucionÃƒÆ’Ã‚Â¡ria";
                              previewFit.innerText = "SaaS Corporativos, InteligÃƒÆ’Ã‚Âªncia de Dados, LogÃƒÆ’Ã‚Â­stica de Elite";
                            }
                          }
                          // Add active styles to clicked button
                          document.querySelectorAll(".arch-btn").forEach((btn: any) => {
                            btn.className = "arch-btn p-4 rounded-xl text-left border relative transition-all cursor-pointer " + 
                              (btn.id === "btn-" + arch.id 
                                ? "bg-brand-secondary/5 border-brand-secondary text-white" 
                                : "bg-white/[0.01] border-white/5 text-zinc-400 hover:border-white/10");
                          });
                        }}
                        id={"btn-" + arch.id}
                        className={`arch-btn p-4 rounded-xl text-left border relative transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-brand-secondary/5 border-brand-secondary text-white" 
                            : "bg-white/[0.01] border-white/5 text-zinc-400 hover:border-white/10"
                        }`}
                      >
                        <h4 className="text-white text-xs sm:text-sm font-semibold uppercase leading-tight">{arch.name}</h4>
                        <p className="text-zinc-500 text-[10px] mt-1 leading-snug">{arch.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brand Visualizer Mock Card (Live Preview) */}
              <div className="lg:col-span-7 flex flex-col justify-center bg-[#09090b] border border-white/[0.05] rounded-3xl p-6 sm:p-8 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-4">
                  <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest font-bold block">
                    PREVIEW DA IDENTIDADE E CONCEITO VISUAL:
                  </span>

                  {/* The Preview Card */}
                  <div 
                    id="brand-preview-card"
                    className="p-8 rounded-[24px] border-2 bg-zinc-950 border-zinc-800 text-left transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[360px] shadow-[0_20px_50px_rgba(255,255,255,0.02)]"
                  >
                    {/* Top line indicator */}
                    <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                      <span id="preview-badge" className="font-mono text-[8px] bg-white/5 text-amber-100 border border-white/10 px-2 py-0.5 rounded font-black uppercase">
                        PRESTÃƒÆ’Ã‚ÂGIO & EXATIDÃƒÆ’Ã†â€™O
                      </span>
                      <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      </div>
                    </div>

                    {/* Middle Core Info */}
                    <div className="space-y-4 my-6">
                      <h3 id="preview-title" className="text-xl sm:text-2xl text-amber-50 font-serif tracking-tight uppercase leading-tight font-medium">
                        ClÃƒÆ’Ã‚Â­nica Dr. Gabriel MedVinci
                      </h3>
                      <p id="preview-tagline" className="text-zinc-400 font-sans italic text-xs leading-relaxed">
                        "Autoridade clÃƒÆ’Ã‚Â­nica e excelÃƒÆ’Ã‚Âªncia cientÃƒÆ’Ã‚Â­fica inabalÃƒÆ’Ã‚Â¡vel focado em tratamentos particulares premium."
                      </p>
                    </div>

                    {/* Bottom stats & details */}
                    <div className="grid grid-cols-2 gap-4 border-t border-white/[0.05] pt-4 text-xs font-sans">
                      <div>
                        <span className="text-zinc-500 text-[8px] block uppercase">Valores de LideranÃƒÆ’Ã‚Â§a:</span>
                        <p id="preview-values" className="text-zinc-300 text-[10px] whitespace-pre-line mt-1 font-bold leading-normal">
                          ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Credibilidade TÃƒÆ’Ã‚Â©cnica
                          ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Verdade CientÃƒÆ’Ã‚Â­fica
                          ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ DiagnÃƒÆ’Ã‚Â³stico CirÃƒÆ’Ã‚Âºrgico
                        </p>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[8px] block uppercase">Indicado para:</span>
                        <p id="preview-fit" className="text-zinc-300 text-[10px] mt-1 leading-normal font-sans">
                          Medicina SÃƒÆ’Ã‚Âªnior, Advocacia de Elite, Fundos de Investimento
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-500 font-sans text-center pt-2">
                    *Toda a tipografia, distanciamentos de logo e cÃƒÆ’Ã‚Â³digo de cores sÃƒÆ’Ã‚Â£o compilados em um Manual de Identidade Visual de alto rigor tÃƒÆ’Ã‚Â©cnico pela TAG08.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* EntregÃƒÆ’Ã‚Â¡veis de um projeto completo de Branding - HIGH CONTRAST MATRIX */}
          <div className="space-y-10">
            <div className="space-y-3">
              <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-semibold bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                EFICIÃƒÆ’Ã…Â NCIA CORPORATIVA
              </span>
              <h3 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
                Os Arquivos e Diretrizes de Entrega
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl">
                Nossos projetos estruturam todas as frentes reguladoras de branding fundamentais para certificar que os seus canais rodeiem de forma integrada e inquestionÃƒÆ’Ã‚Â¡vel:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "DiagnÃƒÆ’Ã‚Â³stico ClÃƒÆ’Ã‚Â­nico", focus: "01 // ANÃƒÆ’Ã‚ÂLISE", desc: "AvaliaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o sistemÃƒÆ’Ã‚Â¡tica de concorrentes e mapeamento das vulnerabilidades estÃƒÆ’Ã‚Â©ticas encontradas." },
                { title: "Posicionamento de LideranÃƒÆ’Ã‚Â§a", focus: "02 // ESTRATÃƒÆ’Ã¢â‚¬Â°GIA", desc: "FÃƒÆ’Ã‚Â³rmula de discurso verbal exclusiva, diferenciando sua voz institucional das rÃƒÆ’Ã‚Â©plicas baratas do segmento." },
                { title: "SÃƒÆ’Ã‚Â­mbolos e Logotipos", focus: "03 // VETORIZAÃƒÆ’Ã¢â‚¬Â¡ÃƒÆ’Ã†â€™O", desc: "Assinaturas premium criadas sob metodologias geomÃƒÆ’Ã‚Â©tricas rÃƒÆ’Ã‚Â­gidas com curvas impecÃƒÆ’Ã‚Â¡veis para qualquer fim." },
                { title: "Linguagem e Tom Verbal", focus: "04 // ARQUÃƒÆ’Ã¢â‚¬Â°TIPOS", desc: "Manuais objetivos detalhando palavras de autoridade permitidas, vocabulÃƒÆ’Ã‚Â¡rios de marca e roteiros de e-mail." },
                { title: "Manual Base de Identidade", focus: "05 // CÃƒÆ’Ã¢â‚¬Å“DIGO VISUAL", desc: "A wiki centralizada com cÃƒÆ’Ã‚Â³digos sÃƒÆ’Ã‚Âªnior exatos de tipografia, distanciamentos de arte e guias de feed." },
                { title: "PeÃƒÆ’Ã‚Â§as de AplicaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o FÃƒÆ’Ã‚Â­sica", focus: "06 // DESPLUGAMENTO", desc: "Layouts prontos e acabados de papelaria sÃƒÆ’Ã‚Âªnior, sacolas, cartÃƒÆ’Ã‚Âµes executivos de apresentaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o e fardas." }
              ].map((item, iIdx) => (
                <div key={iIdx} className="p-7 rounded-3xl bg-neutral-900/50 border border-white/[0.04] flex flex-col justify-between space-y-6 hover:border-brand-secondary/15 transition-all">
                  <div className="space-y-3">
                    <span className="font-sans text-[9px] text-zinc-500 font-bold block">{item.focus}</span>
                    <h4 className="text-white font-display font-bold text-sm sm:text-base uppercase tracking-tight flex items-center gap-2">
                      {item.title}
                    </h4>
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans">{item.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-white/[0.03] text-[9.5px] font-mono text-zinc-600">PRODUÃƒÆ’Ã¢â‚¬Â¡ÃƒÆ’Ã†â€™O TAG08_SYS</div>
                </div>
              ))}
            </div>
          </div>

          {/* Rebranding sem perda de reconhecimento - HIGH-END BANNER COMPONENT */}
          <div className="p-7 sm:p-9 rounded-3xl bg-neutral-900/30 border border-white/[0.05] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
            
            <div className="lg:col-span-8 space-y-3 relative z-10 text-left">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-black block">REBRANDING SEGURO // PRESERVAÃƒÆ’Ã¢â‚¬Â¡ÃƒÆ’Ã†â€™O HISTÃƒÆ’Ã¢â‚¬Å“RICA</span>
              <h4 className="text-white font-display font-medium text-lg uppercase">Como fazemos a evoluÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o da sua marca sem apagar seu legado</h4>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-xl">
                NÃƒÆ’Ã‚Â³s sabemos que evoluir uma imagem institucional consolidada exige extremo zelo. Nosso protocolo tÃƒÆ’Ã‚Â©cnico regula o Rebranding para conservar os pontos marcantes e herÃƒÆ’Ã‚Â¡ldicos jÃƒÆ’Ã‚Â¡ fixados em seu nicho de mercado, readequando apenas geometrias frÃƒÆ’Ã‚Â¡geis, contrastes ineficazes e implantando a elegÃƒÆ’Ã‚Â¢ncia do minimalismo sÃƒÆ’Ã‚Âªnior.
              </p>
            </div>
            
            <div className="lg:col-span-4 flex justify-start lg:justify-end relative z-10">
              <span className="font-mono text-[9px] text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/15 px-4 py-2.5 rounded-xl uppercase tracking-wider font-extrabold shadow-lg">
                PATRIMÃƒÆ’Ã¢â‚¬ÂNIO COGNITIVO PRESERVADO
              </span>
            </div>
          </div>

          {/* CTA Comercial - PREMIUM CONVERSION */}
          <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900/50 border border-white/[0.06] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 text-left">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            
            <div className="relative z-10 space-y-2 max-w-2xl">
              <span className="font-mono text-[9px] text-brand-secondary bg-brand-secondary/5 px-2.5 py-0.5 rounded border border-brand-secondary/10 uppercase tracking-widest font-black">CONSULTA DE REBRANDING</span>
              <h3 className="font-display font-semibold text-xl sm:text-2xl text-white uppercase tracking-tight">Deseja migrar seu posicionamento para um nicho de alto ticket?</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                Converse com nossos estrategistas seniores de marca e solicite um prÃƒÆ’Ã‚Â©-diagnÃƒÆ’Ã‚Â³stico clÃƒÆ’Ã‚Â­nico do posicionamento e valor percebido da sua identidade atual.
              </p>
            </div>
            
            <button
              onClick={() => {
                onNavigate("/contato");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group relative px-6 py-4 bg-brand-secondary hover:bg-brand-dark text-black text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shrink-0 overflow-hidden shadow-[0_8px_30px_rgba(var(--color-brand-secondary-rgb),0.15)] hover:-translate-y-0.5 relative z-10 cursor-pointer"
            >
              Agendar DiagnÃƒÆ’Ã‚Â³stico Gratuito <ArrowRight className="w-4 h-4 ml-1.5 inline-block group-hover:translate-x-1 transition-transform" />
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
                  DÃƒÆ’Ã…Â¡VIDAS &amp; <br />
                  DIRETRIZ DE MARCA
                </h2>
                <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans max-w-sm">
                  EsclareÃƒÆ’Ã‚Â§a as principais dÃƒÆ’Ã‚Âºvidas sobre como a TAG08 concebe e desenvolve identidades visuais corporativas sofisticadas.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {([
                  { id: 0, title: "REGISTRO DE PATENTE" },
                  { id: 1, title: "PROCESSO DE CRIAÃƒÆ’Ã¢â‚¬Â¡ÃƒÆ’Ã†â€™O" },
                  { id: 2, title: "CRONOGRAMAS E PRAZOS" },
                  { id: 3, title: "ENTREGA DE ARQUIVOS" }
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
                src="https://images.unsplash.com/photo-1541462608141-27b2c7453166?auto=format&fit=crop&q=80&w=800"
                alt="TAG08 Branding"
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div className="absolute top-6 left-6 z-10 pointer-events-none font-mono text-[8px] text-white/20 uppercase tracking-widest leading-none">
                SYS // BRANDING
              </div>

              <div className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left">
                <span className="font-mono text-[8.5px] text-brand uppercase tracking-widest font-black block">
                  {([
                    "REGISTRO DE PATENTE",
                    "PROCESSO DE CRIAÃƒÆ’Ã¢â‚¬Â¡ÃƒÆ’Ã†â€™O",
                    "CRONOGRAMAS E PRAZOS",
                    "ENTREGA DE ARQUIVOS"
                  ])[activeFaq]}
                </span>
                
                <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {([
                    "O projeto inclui registro no INPI?",
                    "Posso propor alteraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes no layout?",
                    "Quanto tempo demora a criaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o visual total?",
                    "Quais arquivos de entrega receberei?"
                  ])[activeFaq]}
                </h4>
                
                <p className="text-zinc-300 text-xs sm:text-[12.5px] leading-relaxed font-sans font-medium">
                  {([
                    "A TAG08 desenha o manual, herÃƒÆ’Ã‚Â¡ldica, tipografia e toda a parte visual estratÃƒÆ’Ã‚Â©gica autoral. A assessoria jurÃƒÆ’Ã‚Â­dica de registro de marca na patente do INPI ÃƒÆ’Ã‚Â© efetuada atravÃƒÆ’Ã‚Â©s de escritÃƒÆ’Ã‚Â³rios parceiros especialistas recomendados por nossa governanÃƒÆ’Ã‚Â§a.",
                    "Certamente. Nosso fluxo prevÃƒÆ’Ã‚Âª rodadas organizadas de refinamento intelectual durante o desenvolvimento do conceito preliminar de branding, garantindo que o resultado final reflita com perfeiÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o sua verdade comercial e visÃƒÆ’Ã‚Â£o corporativa sÃƒÆ’Ã‚Âªnior.",
                    "Estimamos um tempo mÃƒÆ’Ã‚Â©dio estrito de 30 dias ÃƒÆ’Ã‚Âºteis para a montagem de todos os estudos, curadoria intelectual de fontes e fechamento tÃƒÆ’Ã‚Â©cnico do Manual de Diretrizes de Marca corporativa.",
                    "Disponibilizamos uma estrutura na nuvem contendo todos os arquivos nativos de produÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o vetorizados, editÃƒÆ’Ã‚Â¡veis e prontos para uso em alta definiÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de forma irrestrita (formatos SVG, PDF, Illustrator original e assets exportados para Figma)."
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
                    Eliminamos marcas obsoletas que enfraquecem o prestÃƒÆ’Ã‚Â­gio comercial. Entregamos maturidade visual.
                  </p>
                </div>
                <button
                  onClick={() => handleLinkClick("/servicos")}
                  className="group flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5"
                >
                  <span>Ver ServiÃƒÆ’Ã‚Â§os</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-black/60 uppercase tracking-widest block font-extrabold">FALE COM O DIRETOR</span>
                  <h4 className="text-black font-black text-sm uppercase leading-tight tracking-tight">Quer desenhar uma estratÃƒÆ’Ã‚Â©gia sob medida?</h4>
                  <p className="text-black/85 text-[11.5px] font-semibold leading-relaxed font-mono">
                    Fale diretamente com os tomadores de decisÃƒÆ’Ã‚Â£o da TAG08 via WhatsApp para avaliar a viabilidade de alocaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de equipe.
                  </p>
                </div>
                <a
                  href={buildBrazilWhatsAppUrl("OlÃƒÆ’Ã‚Â¡,%20gostaria%20de%20consultar%20viabilidade%20estratÃƒÆ’Ã‚Â©gica%20especializada%2520para%20minha%20marca!")}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleOutboundClick("WhatsApp", buildBrazilWhatsAppUrl("OlÃƒÆ’Ã‚Â¡,%20gostaria%20de%20consultar%20viabilidade%20estratÃƒÆ’Ã‚Â©gica%20especializada%2520para%20minha%20marca!"), "branding-viability-br")}
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

      {/* SECTION 5 - ACTION TRIGGER FOOTER */}
      <section className="px-4 sm:px-6 md:px-8 py-20 text-center space-y-6 max-w-4xl mx-auto">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase leading-none tracking-tighter">
          CONSOLIDE O PRESTÃƒÆ’Ã‚ÂGIO SOBERANO <br />
          <span className="text-brand">E REVERTA A PERCEPÃƒÆ’Ã¢â‚¬Â¡ÃƒÆ’Ã†â€™O AMADORA HOJE.</span>
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Agende um bate-papo de escopo visual com nosso diretor estratÃƒÆ’Ã‚Â©gico sÃƒÆ’Ã‚Âªnior e desenhe detalhadamente a nova fase icÃƒÆ’Ã‚Â´nica da imagem da sua marca hoje.
        </p>
        <div className="pt-4">
          <button
            onClick={() => handleLinkClick("/contato")}
            className="group bg-brand text-black font-mono font-black text-[10px] uppercase tracking-widest py-4 px-8 rounded-full shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.22)] hover:bg-brand-dark duration-300 transition-all cursor-pointer flex items-center gap-2 mx-auto"
          >
            <span>REDIRECIONAR DIRETRIZ VISUAL DE ELITE</span>
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
            onClick={() => setSelectedWork(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-5xl bg-neutral-950 border border-white/[0.08] rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh] md:max-h-[85vh] text-left cursor-default overflow-y-auto md:overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Decorative background lights in modal */}
              <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-brand-secondary/[0.02] rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute bottom-[10%] left-[-10%] w-[300px] h-[300px] bg-red-600/[0.01] rounded-full blur-[90px] pointer-events-none" />

              {/* LEFT COLUMN: Media Showcase Frame */}
              <div className="md:w-[42%] bg-zinc-950 border-b md:border-b-0 md:border-r border-white/[0.04] p-6 flex flex-col justify-between relative shrink-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] bg-white/[0.04] text-zinc-400 font-bold tracking-widest uppercase py-1 px-2.5 rounded-md border border-white/5 select-none">
                      STUDIO // CASE SYSTEM
                    </span>
                    
                    {/* Favorite Heart for interactive feedback */}
                    <div className="flex items-center gap-1.5 font-sans text-[9px] text-zinc-400 select-none">
                      <button
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
                      <span>{selectedWork.likesCount || 0} CO-SIGNERS</span>
                    </div>
                  </div>

                  {/* Image block in 3:4 perspective aspect ratios */}
                  <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/[0.05] relative group shadow-lg">
                    <img 
                      src={selectedWork.imageUrl} 
                      alt={selectedWork.title} 
                      className="w-full h-full object-cover pointer-events-none"
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
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-mono text-[9px] uppercase tracking-widest font-black py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_15px_rgba(220,38,38,0.25)] hover:scale-[1.01]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ver Quadro de InspiraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o Original</span>
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
                      <span className="font-mono text-[9px] text-brand tracking-widest uppercase font-extrabold">{selectedWork.category}</span>
                    </div>
                    
                    <button
                      onClick={() => setSelectedWork(null)}
                      className="w-8 h-8 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all flex items-center justify-center border border-white/5 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Main Copy Area */}
                  <div className="space-y-4">
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-none">
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
                      <h4 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-extrabold flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-brand" />
                        O Desafio EstratÃƒÆ’Ã‚Â©gico
                      </h4>
                      <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                        {selectedWork.challenge || "Posicionar e consolidar a marca esteticamente em seu respectivo ecossistema, gerando identificabilidade instantÃƒÆ’Ã‚Â¢nea sÃƒÆ’Ã‚Âªnior perante clientes de alto prestÃƒÆ’Ã‚Â­gio."}
                      </p>
                    </div>

                    {/* A SoluÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o */}
                    <div className="space-y-1.5 text-left bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl">
                      <h4 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-extrabold flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-brand" />
                        DireÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de Marca &amp; Conceito
                      </h4>
                      <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                        {selectedWork.solution || "Desenvolvemos herÃƒÆ’Ã‚Â¡ldica refinada com grids precisos e sistemas cromÃƒÆ’Ã‚Â¡ticos elegantes que comunicam seriedade, sobriedade e maturidade corporativa."}
                      </p>
                    </div>

                    {/* Visual System parameters (Interactive Color chips) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Color Palette area */}
                      <div className="space-y-2 bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl text-left">
                        <h4 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-extrabold flex items-center gap-2">
                          <Palette className="w-3.5 h-3.5 text-brand" />
                          Paleta de Cores
                        </h4>
                        <div className="flex flex-wrap gap-2.5 pt-1">
                          {(selectedWork.colors || ["#0D0D11", "#C5A880", "#FFFFFF"]).map((col, idx) => {
                            const name = selectedWork.colorNames ? selectedWork.colorNames[idx] : col;
                            return (
                              <div 
                                key={col} 
                                className="group/chip flex items-center gap-1.5 bg-black/40 border border-white/5 py-1 px-2.5 rounded-lg text-[9px] font-sans text-zinc-300 relative cursor-pointer active:scale-95 transition-all"
                                onClick={() => {
                                  navigator.clipboard.writeText(col);
                                }}
                                title={`Clique para copiar Hex ${col}`}
                              >
                                <span className="w-2.5 h-2.5 rounded-full border border-white/10 shrink-0" style={{ backgroundColor: col }} />
                                <span className="group-hover/chip:text-brand transition-colors font-medium">{name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Typography selection */}
                      <div className="space-y-2 bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl text-left flex flex-col justify-center">
                        <h4 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-extrabold flex items-center gap-2">
                          <Type className="w-3.5 h-3.5 text-brand" />
                          Arquitetura TipogrÃƒÆ’Ã‚Â¡fica
                        </h4>
                        <p className="text-brand font-display font-black text-[13px] uppercase tracking-wide pt-0.5">
                          {selectedWork.typography || "Space Grotesk & Inter Modern"}
                        </p>
                      </div>

                    </div>

                    {/* Success / Metric Indicators */}
                    <div className="bg-brand/[0.03] border border-brand-secondary/15 p-4 rounded-xl text-left space-y-1">
                      <span className="font-mono text-[9px] bg-brand-secondary/10 text-brand-secondary uppercase tracking-widest font-black px-2.5 py-0.5 rounded border border-brand-secondary/10 inline-block">
                        INDICADOR SUCESSO COLETIVO
                      </span>
                      <p className="text-zinc-200 text-[11px] font-sans font-medium flex items-center gap-1.5 pt-1">
                        <TrendingUp className="w-4 h-4 text-brand shrink-0" />
                        {selectedWork.achievement || "ElevaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o substancial no ÃƒÆ’Ã‚Â­ndice de memorabilidade digital e percepÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o estÃƒÆ’Ã‚Â©tica consolidada."}
                      </p>
                    </div>

                    {/* Deliverables lists */}
                    <div className="text-left space-y-2">
                      <h5 className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-extrabold">EntregÃƒÆ’Ã‚Â¡veis Fine-Art:</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {(selectedWork.deliverables || ["Logotipo Vetorial Vetado", "Manual de Identidade Geral", "Diretrizes de AmbientaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o", "Assets Digitais Integrados"]).map((deliv, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[10.5px] text-zinc-400 font-sans font-medium">
                            <CheckCircle className="w-3.5 h-3.5 text-brand shrink-0 stroke-[2.5]" />
                            <span>{deliv}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Massive premium WhatsApp CTA */}
                <div className="pt-6 mt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center gap-4">
                  
                  <a 
                    href={buildBrazilWhatsAppUrl(`Ol%C3%A1%20TAG08!%20Estava%20analisando%20o%20portf%C3%B3lio%20de%20Branding%20e%20fiquei%20impressionado%20com%20o%20case%20da%20marca%20"${encodeURIComponent(selectedWork.title)}".%20Gostaria%20de%20solicitar%20um%20diagn%C3%B3stico%20de%20branding%20premium%20para%20o%20meu%20neg%C3%B3cio!`)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleOutboundClick("WhatsApp", buildBrazilWhatsAppUrl(`Ol%C3%A1%20TAG08!%20Estava%20analisando%20o%20portf%C3%B3lio%20de%20Branding%20e%20fiquei%20impressionado%20com%20o%20case%20da%20marca%20"${encodeURIComponent(selectedWork.title)}".%20Gostaria%20de%20solicitar%20um%20diagn%C3%B3stico%20de%20branding%20premium%20para%20o%20meu%20neg%C3%B3cio!`), "branding-work-case-br")}
                    className="w-full sm:flex-1 bg-brand hover:bg-brand-dark text-black font-mono text-[10px] uppercase tracking-widest font-black py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_22px_rgba(var(--color-brand-secondary-rgb),0.2)] hover:scale-[1.01] hover:shadow-[0_4px_30px_rgba(var(--color-brand-secondary-rgb),0.3)] cursor-pointer text-center"
                  >
                    <span>Solicitar DiagnÃƒÆ’Ã‚Â³stico como este case</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </a>

                  <button
                    onClick={() => setSelectedWork(null)}
                    className="w-full sm:w-auto font-mono text-[9px] uppercase tracking-wider text-zinc-500 hover:text-white border border-white/5 py-4 px-6 rounded-xl cursor-pointer"
                  >
                    Fechar Painel
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


