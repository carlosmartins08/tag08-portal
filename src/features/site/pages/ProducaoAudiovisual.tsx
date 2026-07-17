import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, ArrowRight, ArrowUpRight, Camera, Video, Film, Sparkles, 
  Layers, Play, PlayCircle, Eye, Settings, Clock, ShieldCheck, 
  Smartphone, Monitor, ChevronDown, MessageSquare, Award, Tv,
  ListPlus, Plus, Info, HelpCircle
} from "lucide-react";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import MiniCases from "../../../components/MiniCases";
import { buildBrazilWhatsAppUrl } from "../../../config/siteNetwork";

interface Deliverable {
  id: string;
  name: string;
  category: "digital" | "event" | "inst" | "ads";
  desc: string;
}

const DELIVERABLES: Deliverable[] = [
  { id: "institucional", name: "VÃ­deos institucionais e de apresentaÃ§Ã£o", category: "inst", desc: "Para apresentar a marca, equipe, histÃ³ria, mÃ©todo, serviÃ§o ou posicionamento de forma mais humana, visual e compreensÃ­vel." },
  { id: "evento", name: "Cobertura de eventos e aÃ§Ãµes presenciais", category: "event", desc: "Para registrar encontros, lanÃ§amentos, inauguraÃ§Ãµes, treinamentos, palestras e ativaÃ§Ãµes com olhar narrativo, pensando tambÃ©m no uso posterior do material." },
  { id: "redes", name: "ConteÃºdos para redes sociais", category: "digital", desc: "Para transformar falas, bastidores, rotinas, produtos, serviÃ§os e momentos da marca em vÃ­deos curtos, cortes e publicaÃ§Ãµes conectadas Ã  linha editorial." },
  { id: "autoridade", name: "Depoimentos, entrevistas e autoridade", category: "digital", desc: "Para organizar falas de clientes, especialistas, lideranÃ§as ou equipe em conteÃºdos claros, objetivos e Ãºteis para fortalecer confianÃ§a." },
  { id: "bastidores", name: "Bastidores, cultura e marca empregadora", category: "inst", desc: "Para mostrar pessoas, processos, ambiente, rotina e cultura de forma autÃªntica, sem transformar bastidor em encenaÃ§Ã£o vazia." },
  { id: "apoio", name: "Materiais de apoio para site, campanhas e apresentaÃ§Ãµes", category: "inst", desc: "Para gerar vÃ­deos, chamadas, recortes e materiais visuais que apoiem pÃ¡ginas, propostas, apresentaÃ§Ãµes comerciais e canais digitais." }
];

interface Formato {
  id: string;
  name: string;
  tag: string;
  desc: string;
  features: string[];
}

const FORMATOS: Formato[] = [
  {
    id: "institucional",
    name: "Registro institucional",
      tag: "APRESENTAÃ‡ÃƒO E POSICIONAMENTO",
    desc: "Para apresentar marca, equipe, histÃ³ria, mÃ©todo ou serviÃ§o com clareza.",
    features: [
      "Mensagem principal definida",
      "Roteiro objetivo",
      "Base para site e proposta",
      "Material para desdobrar cortes"
    ]
  },
  {
    id: "evento",
    name: "Cobertura de evento",
      tag: "REGISTRO E USO POSTERIOR",
    desc: "Para encontros, lanÃ§amentos, inauguraÃ§Ãµes, treinamentos e palestras que precisam gerar material Ãºtil depois.",
    features: [
      "Registro narrativo",
      "Falas e bastidores",
      "Cortes para comunicaÃ§Ã£o posterior",
      "Material de apoio"
    ]
  },
  {
    id: "recorrente",
    name: "ConteÃºdo recorrente",
    tag: "LINHA EDITORIAL",
    desc: "Para transformar rotinas, bastidores e falas em materiais contÃ­nuos para canais digitais.",
    features: [
      "CaptaÃ§Ã£o reaproveitÃ¡vel",
      "VÃ­deos curtos",
      "Linha editorial",
      "ConsistÃªncia de publicaÃ§Ã£o"
    ]
  }
];

const TAG08_CHANNEL_SHORTS = [
  {
    id: "dOGBAq02Ji8",
    title: "ProduÃ§Ã£o de vÃ­deos no sertÃ£o da ParaÃ­ba, muito calor diversÃ£o e novas ideias. ðŸ’¡"
  },
  {
    id: "JRTSyDm7F04",
    title: "Como fazemos as coisas aqui, o coraÃ§Ã£o da TAG08 pulsa forte o verbo â€œACREDITARâ€"
  },
  {
    id: "TxSfU-W75tI",
    title: "CriaÃ§Ã£o de conteÃºdo para Unida Construtor"
  },
  {
    id: "BVkLt70eZfw",
    title: "SedaÃ§Ã£o Ambulatorial- Bastidores com GlÃ³ria Pimenta"
  },
  {
    id: "ptGg7_AGe8o",
    title: "Fashion Filme Doctor Play | #Shorts"
  },
  {
    id: "tbKkbZx4kAk",
    title: "Making Of #08 | #Shorts"
  }
].map((item) => ({
  ...item,
  href: `https://www.youtube.com/shorts/${item.id}`,
  thumbnail: `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`
}));

interface FAQCategory {
  id: number;
  title: string;
}

const faqCategories: FAQCategory[] = [
  { id: 0, title: "PLANEJAMENTO" },
  { id: 1, title: "FORMATO" },
  { id: 2, title: "EVENTOS" },
  { id: 3, title: "REAPROVEITAMENTO" },
  { id: 4, title: "CANAIS" }
];

const faqQuestions = [
  "A TAG08 faz apenas a gravaÃ§Ã£o ou tambÃ©m ajuda no planejamento?",
  "Preciso saber exatamente qual vÃ­deo quero produzir antes de falar com a TAG08?",
  "VocÃªs fazem cobertura de eventos?",
  "Uma gravaÃ§Ã£o pode gerar vÃ¡rios conteÃºdos?",
  "A produÃ§Ã£o audiovisual serve sÃ³ para redes sociais?"
];

const faqAnswers = [
  "A produÃ§Ã£o pode envolver planejamento, pauta, roteiro, direÃ§Ã£o, captaÃ§Ã£o, ediÃ§Ã£o e orientaÃ§Ã£o de uso. Antes de gravar, entendemos o contexto da marca e a funÃ§Ã£o que o material precisa cumprir.",
  "NÃ£o. A conversa inicial serve justamente para entender o momento da marca e indicar o formato mais coerente: institucional, evento, bastidores, depoimentos, conteÃºdo recorrente ou material de apoio.",
  "Sim. A cobertura pode registrar palestras, lanÃ§amentos, inauguraÃ§Ãµes, treinamentos, encontros, bastidores e momentos importantes. O material tambÃ©m pode ser pensado para uso posterior em redes, site, apresentaÃ§Ãµes e comunicaÃ§Ã£o institucional.",
  "Pode, desde que exista planejamento. Um mesmo material pode gerar vÃ­deo principal, cortes, chamadas, bastidores, depoimentos, publicaÃ§Ãµes e materiais de apoio, dependendo do escopo definido.",
  "NÃ£o. O material pode apoiar redes sociais, site, pÃ¡ginas comerciais, apresentaÃ§Ãµes, campanhas, comunicaÃ§Ã£o interna, branding, autoridade e relacionamento com clientes."
];

interface ProducaoProps {
  onNavigate: (page: string) => void;
}

export default function ProducaoAudiovisual({ onNavigate }: ProducaoProps) {
  const [activeFaq, setActiveFaq] = useState<number>(0);
  
  // Custom calculator states
  const [selectedFormat, setSelectedFormat] = useState<string>("institucional");
  const [selectedTools, setSelectedTools] = useState<string[]>(["institucional", "apoio"]);

  const handleToggleTool = (toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(t => t !== toolId) 
        : [...prev, toolId]
    );
  };

  const currentFormatDetails = FORMATOS.find(f => f.id === selectedFormat) || FORMATOS[0];
  const currentSelectedTools = selectedTools
    .map((id) => DELIVERABLES.find((d) => d.id === id)?.name)
    .filter((name): name is string => Boolean(name))
    .join(", ");
  const hasSelectedTools = selectedTools.length > 0;

  const getWhatsAppLink = () => {
    const formatName = currentFormatDetails.name;

    const message = `OlÃ¡ TAG08! Quero entender qual formato audiovisual faz mais sentido para o momento da minha marca.

- FORMATO AVALIADO: ${formatName}
- MATERIAIS RELACIONADOS: ${currentSelectedTools}

Quero conversar sobre o prÃ³ximo passo com a TAG08.`;

    return buildBrazilWhatsAppUrl(message);
  };

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-[8%] left-[-10%] w-[580px] h-[580px] bg-brand/[0.015] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[25%] right-[-12%] w-[580px] h-[580px] bg-brand/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Floating 3D Geometric Mesh for Tech/Artistic Authority */}
      <Subtle3DCanvas intensity={1.5} className="absolute right-[-8%] top-[5%] w-[480px] h-[480px] opacity-[0.35] mix-blend-screen hidden lg:block animate-pulse-slow" />

      {/*=========================================
          SECTION 1: HERO - THE CINEMATIC SYSTEM
         =========================================*/}
      <section className="px-6 md:px-8 py-12 md:py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-baseline text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono">
                ProduÃ§Ã£o Audiovisual
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter uppercase font-display">
                Narrativa audiovisual com <br />
                <span className="text-brand">presenÃ§a e funÃ§Ã£o estratÃ©gica.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-[15px] leading-relaxed font-sans font-medium">
                A TAG08 transforma presenÃ§a, fala, ambiente, bastidores e eventos em conteÃºdo com clareza, estÃ©tica e funÃ§Ã£o estratÃ©gica. Antes de gravar, entendemos o contexto da marca, os usos do material e os formatos que precisam sustentar comunicaÃ§Ã£o, portfÃ³lio e relacionamento.
              </p>
            </div>
          </div>

          {/* Epic Widescreen Cinematic Image Banner with Hover badging */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px]">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.35/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <img 
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1600"
                alt="ProduÃ§Ã£o Audiovisual TAG08"
                className="w-full h-full object-cover grayscale brightness-40 group-hover:scale-[1.02] transition-all duration-1000 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent pointer-events-none" />

              {/* Central Floating Callout */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{ transform: "translateZ(50px)" }}>
                <a
                  href="#planner"
                  className="bg-brand-secondary text-black font-mono font-black text-[9.5px] sm:text-[10.5px] uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.3)] hover:scale-105 duration-300 transition-all border border-brand-secondary hover:bg-brand-dark flex items-center gap-2 cursor-pointer z-20"
                >
                  <span>PLANEJAR MEU AUDIOVISUAL</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </a>
              </div>

              {/* Bottom detail row */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="font-mono text-[8.5px] text-brand-secondary tracking-widest block uppercase font-bold">TAG08 AUDIOVISUAL</span>
                  <h4 className="font-display font-black text-white text-xs sm:text-sm uppercase tracking-tight leading-none">Narrativa, presenÃ§a e conteÃºdo com direÃ§Ã£o</h4>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-[8.5px] text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
                  <span>CaptaÃ§Ã£o, ediÃ§Ã£o e distribuiÃ§Ã£o para uso recorrente</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* Hero benefit cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-2 text-left border-t border-white/[0.04]">
            <div className="space-y-1.5">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Narrativa</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Capta fala, bastidores e ambiente<br/>com intenÃ§Ã£o editorial</span>
            </div>
            <div className="space-y-1.5">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">Clareza</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Organiza o material para apoiar<br/>apresentaÃ§Ã£o, redes e site</span>
            </div>
            <div className="space-y-1.5">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">AplicaÃ§Ã£o</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">PeÃ§as pensadas para uso recorrente<br/>e consistente</span>
            </div>
            <div className="space-y-1.5">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">Continuidade</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">ConteÃºdo Ãºtil depois da gravaÃ§Ã£o<br/>e da ediÃ§Ã£o</span>
            </div>
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 2: PROBLEM PANEL (Muitas marcas registram momentos, mas...)
         =========================================*/}
      <section className="px-6 md:px-8 py-20 bg-charcoal-900/15 border-b border-white/[0.04] text-left relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl">
            <div className="space-y-3">
              <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
                Sinais de desalinhamento audiovisual
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tighter">
                Quando o vÃ­deo existe, mas nÃ£o constrÃ³i presenÃ§a.
              </h2>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Muitas marcas gravam conteÃºdos, registram eventos e publicam vÃ­deos, mas ainda nÃ£o conseguem transformar esses materiais em presenÃ§a clara, recorrente e Ãºtil para a comunicaÃ§Ã£o. O problema pode estar menos na captaÃ§Ã£o e mais na falta de narrativa, formato, ediÃ§Ã£o e estratÃ©gia de uso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {[
              {
                title: "VÃ­deos sem funÃ§Ã£o clara",
                desc: "O conteÃºdo Ã© gravado, mas nÃ£o fica claro se ele deve apresentar a marca, educar o pÃºblico, registrar um momento, apoiar vendas ou fortalecer autoridade."
              },
              {
                title: "Bastidores pouco aproveitados",
                desc: "Eventos, processos, atendimentos, equipe e rotina geram material valioso, mas acabam nÃ£o sendo transformados em conteÃºdo Ãºtil para a marca."
              },
              {
                title: "Falas sem narrativa",
                desc: "Especialistas e lideranÃ§as tÃªm conhecimento para compartilhar, mas os vÃ­deos precisam de direÃ§Ã£o para ficarem claros, objetivos e reaproveitÃ¡veis."
              },
              {
                title: "ConteÃºdo sem continuidade",
                desc: "A marca grava em momentos pontuais, mas nÃ£o constrÃ³i uma presenÃ§a audiovisual recorrente conectada Ã  linha editorial."
              },
              {
                title: "Material sem reaproveitamento",
                desc: "Um vÃ­deo longo, cobertura ou gravaÃ§Ã£o pode gerar cortes, chamadas, bastidores, reels, publicaÃ§Ãµes e materiais de apoio, desde que exista planejamento."
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-charcoal-900 border border-white/[0.04] rounded-2xl p-6 sm:p-7 space-y-3 hover:border-red-500/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/5 text-red-400 border border-red-500/10 flex items-center justify-center font-sans text-[10px] font-bold">
                  SINAL {String(idx + 1).padStart(2, '0')}
                </div>
                <h4 className="text-white text-base sm:text-lg font-display font-semibold uppercase tracking-tight">
                  {item.title}
                </h4>
                <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 3: TARGET AUDIENCE (Para quem Ã©)
         =========================================*/}
      <section className="px-6 md:px-8 py-20 border-b border-white/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto space-y-14 text-center">
          
          <div className="max-w-2xl mx-auto space-y-3 text-center">
            <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              CONTEXTOS DE APLICAÃ‡ÃƒO // TAG08
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tighter">
              Para marcas que precisam transformar presenÃ§a em conteÃºdo.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              A produÃ§Ã£o audiovisual da TAG08 faz sentido para negÃ³cios, profissionais e instituiÃ§Ãµes que jÃ¡ tÃªm histÃ³rias, experiÃªncias, bastidores, eventos, pessoas ou conhecimento para comunicar, mas precisam organizar isso em formatos claros, bem editados e Ãºteis para diferentes canais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              {
                icon: Award,
                title: "Empresas com rotina, equipe e bastidores relevantes",
                desc: "NegÃ³cios que tÃªm processos, atendimentos, entregas, cultura ou operaÃ§Ã£o acontecendo todos os dias, mas ainda nÃ£o transformam essa rotina em conteÃºdo com clareza."
              },
              {
                icon: Play,
                title: "Profissionais e especialistas que precisam comunicar autoridade",
                desc: "Pessoas que dominam um assunto, atendem clientes ou lideram uma Ã¡rea, mas precisam de direÃ§Ã£o para transformar fala, conhecimento e experiÃªncia em vÃ­deos objetivos."
              },
              {
                icon: Video,
                title: "Eventos que merecem registro estratÃ©gico",
                desc: "Encontros, lanÃ§amentos, inauguraÃ§Ãµes, treinamentos, palestras e aÃ§Ãµes presenciais que nÃ£o devem virar apenas lembranÃ§a, mas material Ãºtil para comunicaÃ§Ã£o posterior."
              },
              {
                icon: Monitor,
                title: "Marcas que precisam alimentar redes, site e campanhas",
                desc: "NegÃ³cios que precisam de vÃ­deos, cortes, bastidores, depoimentos, chamadas e materiais audiovisuais conectados Ã  linha editorial e aos canais da marca."
              },
              {
                icon: Film,
                title: "Projetos que precisam de narrativa institucional",
                desc: "Iniciativas que precisam apresentar histÃ³ria, propÃ³sito, mÃ©todo, equipe, serviÃ§o ou transformaÃ§Ã£o de forma mais humana, visual e compreensÃ­vel."
              }
            ].map((audience, idx) => {
              const AudienceIcon = audience.icon;
              return (
                <div 
                  key={idx}
                  className="bg-charcoal-900 border border-white/[0.05] rounded-2xl p-6 hover:border-brand/30 hover:bg-white/[0.015] transition-all duration-300 flex flex-col justify-between group h-64"
                >
                  <div className="space-y-4">
                    <div className="p-2.5 bg-white/[0.03] text-zinc-400 group-hover:text-brand group-hover:bg-brand/10 rounded-xl transition-all w-10 h-10 flex items-center justify-center">
                      <AudienceIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-white text-base sm:text-lg font-display font-semibold uppercase tracking-tight group-hover:text-brand transition-colors">
                      {audience.title}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                      {audience.desc}
                    </p>
                  </div>
                  <div className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest select-none">
                    DIRECIONAMENTO // COD_0{idx + 1}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 4: ACTIVE FRONTS OF ACTION (Frentes de atuaÃ§Ã£o)
         =========================================*/}
      <section className="px-6 md:px-8 py-20 bg-charcoal-900/10 border-b border-white/[0.04] text-left relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-left space-y-3 max-w-2xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
              FRENTES AUDIOVISUAIS // TAG08
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-white uppercase tracking-tighter">
              Frentes audiovisuais com funÃ§Ã£o clara.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              A produÃ§Ã£o pode assumir diferentes formatos, mas cada entrega precisa responder a uma necessidade concreta da marca: apresentar, registrar, explicar, aproximar, educar, documentar ou alimentar canais com consistÃªncia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                num: "FRENTE 01",
                title: "VÃ­deos institucionais e de apresentaÃ§Ã£o",
                desc: "Para apresentar a marca, equipe, histÃ³ria, estrutura, mÃ©todo, serviÃ§o ou posicionamento de forma mais humana, visual e compreensÃ­vel.",
                list: ["ApresentaÃ§Ã£o da marca", "Equipe e estrutura", "HistÃ³ria e mÃ©todo", "ServiÃ§o e posicionamento", "Materiais para site e propostas"]
              },
              {
                num: "FRENTE 02",
                title: "Cobertura de eventos e aÃ§Ãµes presenciais",
                desc: "Para registrar encontros, lanÃ§amentos, inauguraÃ§Ãµes, treinamentos, palestras e ativaÃ§Ãµes com olhar narrativo, pensando tambÃ©m no uso posterior do material.",
                list: ["Registro de encontros", "LanÃ§amentos e inauguraÃ§Ãµes", "Treinamentos e palestras", "AtivaÃ§Ãµes e aÃ§Ãµes presenciais", "Material para comunicaÃ§Ã£o posterior"]
              },
              {
                num: "FRENTE 03",
                title: "ConteÃºdos para redes sociais",
                desc: "Para transformar falas, bastidores, rotinas, produtos, serviÃ§os e momentos da marca em vÃ­deos curtos, cortes e publicaÃ§Ãµes conectadas Ã  linha editorial.",
                list: ["VÃ­deos curtos", "Cortes de falas", "Bastidores e rotinas", "Produtos e serviÃ§os", "PublicaÃ§Ãµes conectadas Ã  linha editorial"]
              },
              {
                num: "FRENTE 04",
                title: "Depoimentos, entrevistas e autoridade",
                desc: "Para organizar falas de clientes, especialistas, lideranÃ§as ou equipe em conteÃºdos claros, objetivos e Ãºteis para fortalecer confianÃ§a.",
                list: ["Depoimentos guiados", "Entrevistas objetivas", "Falas de especialistas", "LideranÃ§as e equipe", "ConteÃºdo para fortalecer confianÃ§a"]
              },
              {
                num: "FRENTE 05",
                title: "Bastidores, cultura e marca empregadora",
                desc: "Para mostrar pessoas, processos, ambiente, rotina e cultura de forma autÃªntica, sem transformar bastidor em encenaÃ§Ã£o vazia.",
                list: ["Pessoas e processos", "Ambiente e rotina", "Cultura do dia a dia", "Marca empregadora", "Bastidores autÃªnticos"]
              },
              {
                num: "FRENTE 06",
                title: "Materiais de apoio para site, campanhas e apresentaÃ§Ãµes",
                desc: "Para gerar vÃ­deos, chamadas, recortes e materiais visuais que apoiem pÃ¡ginas, propostas, apresentaÃ§Ãµes comerciais e canais digitais.",
                list: ["VÃ­deos para pÃ¡ginas", "Chamadas e recortes", "Materiais visuais de apoio", "Propostas e apresentaÃ§Ãµes comerciais", "Canais digitais da marca"]
              }
            ].map((frente, idx) => (
              <div 
                key={idx}
                className="bg-charcoal-900 border border-white/[0.06] rounded-2.5xl p-6 sm:p-10 space-y-6 hover:border-brand/40 hover:bg-white/[0.01] transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/[0.015] rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-2">
                  <span className="font-mono text-[9px] text-brand-secondary font-black uppercase tracking-widest">{frente.num}</span>
                  <h3 className="font-display font-medium text-lg sm:text-xl text-white uppercase leading-snug">
                    {frente.title}
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                    {frente.desc}
                  </p>
                </div>

                <div className="space-y-3.5 pt-4 border-t border-white/[0.04]">
                  <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-bold">FORMATOS POSSÃVEIS:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {frente.list.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex gap-2.5 items-center">
                        <Check className="w-3.5 h-3.5 text-brand shrink-0 stroke-[2.5]" />
                        <span className="text-zinc-300 text-xs font-medium font-sans">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 4.5: FORMATOS AUDIOVISUAIS // TAG08 (Shorts reais do canal)
         =========================================*/}
      <section className="px-6 md:px-8 py-20 border-b border-white/[0.04] bg-black/35 text-left relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-3 max-w-2xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
              FORMATOS AUDIOVISUAIS // TAG08
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tighter">
              Shorts reais publicados no canal.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Estes sÃ£o exemplos reais do canal oficial da TAG08. Eles mostram bastidores, produÃ§Ã£o, posicionamento e trabalhos jÃ¡ publicados que ajudam a entender o tipo de material que o audiovisual pode gerar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {TAG08_CHANNEL_SHORTS.map((short) => (
              <a
                key={short.id}
                href={short.href}
                target="_blank"
                rel="noreferrer"
                className="group block h-full overflow-hidden rounded-[28px] border border-white/[0.05] bg-charcoal-900 transition-all duration-300 hover:border-brand/30 hover:-translate-y-0.5"
              >
                <div className="relative aspect-[9/16] overflow-hidden bg-black">
                  <img
                    src={short.thumbnail}
                    alt={short.title}
                    className="h-full w-full object-cover brightness-[0.82] contrast-[1.05] transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-black/45 px-2.5 py-1 font-mono text-[8px] uppercase tracking-widest text-white/75 backdrop-blur-sm">
                      SHORT REAL
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center rounded-full border border-brand-secondary/15 bg-brand-secondary/10 px-2.5 py-1 font-mono text-[8px] uppercase tracking-widest text-brand-secondary backdrop-blur-sm">
                      YOUTUBE
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/90 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                      <PlayCircle className="h-7 w-7" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  <h3 className="text-sm sm:text-[15px] font-semibold leading-snug text-white">
                    {short.title}
                  </h3>
                  <div className="flex items-center justify-between border-t border-white/[0.05] pt-3">
                    <span className="font-mono text-[8.5px] uppercase tracking-widest text-zinc-500">
                      Publicado no canal
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-widest text-brand-secondary">
                      Assistir
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/*=========================================
          SECTION 5: INTERACTIVE SIMULATOR (PLANNER)
         =========================================*/}
      <section id="planner" className="px-6 md:px-8 py-16 sm:py-20 border-b border-white/[0.04] text-left relative z-10 scroll-mt-24">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 max-w-5xl">
            <div className="space-y-2.5 sm:space-y-3">
              <span className="font-mono text-[8px] sm:text-[9px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                DIAGNÃ“STICO DE FORMATO AUDIOVISUAL
              </span>
              <h2 className="font-display font-black text-[1.55rem] sm:text-3xl md:text-4xl text-white uppercase tracking-tighter leading-[0.95]">
                Entenda qual tipo de conteÃºdo faz mais sentido para o seu momento.
              </h2>
            </div>
            <p className="text-zinc-400 text-[13px] sm:text-sm leading-relaxed max-w-sm">
              Responda a partir do contexto da sua marca para identificar se faz mais sentido registrar, apresentar, explicar, reaproveitar ou alimentar canais com mais consistÃªncia.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Lado Esquerdo: Formato (Column) + EntregÃ¡veis */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              
              {/* Formatos Buttons Selector */}
              <div className="space-y-3 sm:space-y-4">
                <span className="font-mono text-[8px] sm:text-[9.5px] text-zinc-500 uppercase tracking-widest font-bold block">1. ESCOLHA O FORMATO QUE FAZ MAIS SENTIDO</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {FORMATOS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setSelectedFormat(f.id);
                        // Ajusta os materiais sugeridos de acordo com o formato selecionado.
                        if (f.id === "institucional") setSelectedTools(["institucional", "apoio"]);
                        else if (f.id === "evento") setSelectedTools(["evento", "autoridade", "redes"]);
                        else setSelectedTools(["redes", "bastidores", "autoridade", "apoio"]);
                      }}
                      className={`p-3.5 sm:p-4 rounded-xl text-left border relative transition-all cursor-pointer focus:outline-none min-h-[88px] sm:min-h-0 ${
                        selectedFormat === f.id
                          ? "bg-brand/5 border-brand text-white shadow-xl shadow-brand/5"
                          : "bg-white/[0.01] border-white/5 text-zinc-400 hover:border-white/10"
                      }`}
                    >
                      <span className="font-sans text-[8px] sm:text-[7px] text-brand block mb-1 font-black uppercase tracking-wider">{f.tag}</span>
                      <h4 className="text-white text-[13px] sm:text-sm font-semibold uppercase leading-tight">{f.name}</h4>
                    </button>
                  ))}
                </div>
              </div>

              {/* Deliverables Grid selector */}
              <div className="space-y-3 sm:space-y-4">
                <span className="font-mono text-[8px] sm:text-[9.5px] text-zinc-500 uppercase tracking-widest font-bold block">2. MARQUE O QUE PODE SER PRODUZIDO</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                  {DELIVERABLES.map((del) => {
                    const isSelected = selectedTools.includes(del.id);
                    return (
                      <button
                        key={del.id}
                        onClick={() => handleToggleTool(del.id)}
                        className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between min-h-[10rem] sm:h-36 cursor-pointer focus:outline-none group ${
                          isSelected
                            ? "bg-brand text-black border-brand/40 shadow-lg shadow-brand/5 font-medium"
                            : "bg-white/[0.01] border-white/5 text-zinc-400 hover:border-white/10"
                        }`}
                      >
                        <div className="space-y-1 text-left">
                          <h5 className={`text-[13px] sm:text-xs uppercase font-semibold font-display tracking-tight leading-snug group-hover:text-white transition-colors ${isSelected ? "text-black group-hover:text-black" : "text-white"}`}>
                            {del.name}
                          </h5>
                          <p className={`text-[11px] sm:text-[10px] leading-relaxed line-clamp-2 sm:line-clamp-3 font-medium transition-colors ${isSelected ? "text-black/75" : "text-zinc-500 group-hover:text-zinc-400"}`}>
                            {del.desc}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center w-full pt-2 border-t border-black/5">
                          <span className={`font-sans text-[7px] font-bold uppercase ${isSelected ? "text-black/60" : "text-zinc-400"}`}>{del.category} material</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? "bg-black text-brand border-black" : "border-zinc-700 text-zinc-500"}`}>
                            {isSelected ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <Plus className="w-2.5 h-2.5" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Lado Direito: Preview de Setup a enviar por WhatsApp */}
            <div className="lg:col-span-5">
              <div className="bg-charcoal-900 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4 sm:space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
                
                  <div className="flex justify-between items-center gap-3 border-b border-white/[0.04] pb-3 sm:pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                    <span className="font-mono text-[8px] sm:text-[9px] text-brand uppercase tracking-wider font-extrabold">RESUMO DO FORMATO AUDIOVISUAL</span>
                    </div>
                  <span className="font-mono text-[8px] sm:text-[9px] text-zinc-500">TAG08_AUDIOVISUAL</span>
                  </div>

                {/* Setup selected details */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5">
                    <span className="font-mono text-[8px] sm:text-[9px] text-zinc-500 uppercase font-black block">FORMATO AVALIADO:</span>
                    <h4 className="font-display font-medium text-base sm:text-lg text-brand-secondary uppercase tracking-tight leading-none">
                      {currentFormatDetails.name}
                    </h4>
                    <p className="text-zinc-400 text-[13px] sm:text-xs leading-normal">
                      {currentFormatDetails.desc}
                    </p>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-white/[0.04] space-y-2.5 text-left">
                    <span className="font-mono text-[8px] sm:text-[9px] text-zinc-500 uppercase font-black block">O QUE ESSE FORMATO AJUDA A ORGANIZAR:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentFormatDetails.features.map((feat, fidx) => (
                        <div key={fidx} className="flex gap-2 items-center">
                          <Check className="w-3 h-3 text-brand text-xs shrink-0" />
                          <span className="text-zinc-300 text-[11px] sm:text-[11px] font-medium font-sans">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chosen tools list output */}
                    <div className="pt-3 sm:pt-4 border-t border-white/[0.04] space-y-2.5">
                      <span className="font-mono text-[8px] sm:text-[9px] text-zinc-500 uppercase font-black block">MATERIAIS RELACIONADOS ({selectedTools.length}):</span>
                      {hasSelectedTools ? (
                        <div className="flex flex-wrap gap-2 text-left max-h-40 overflow-y-auto pr-1">
                          {selectedTools.map((tId) => {
                            const dl = DELIVERABLES.find(d => d.id === tId);
                            if (!dl) return null;
                            return (
                              <span key={tId} className="px-2.5 py-1 bg-white/[0.03] border border-white/5 text-zinc-300 text-[10px] rounded-lg font-sans font-medium hover:border-brand/40 transition-colors">
                                {dl.name}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-white/8 bg-white/[0.02] px-4 py-4 sm:py-5 space-y-2">
                          <h5 className="text-sm sm:text-sm font-semibold text-white">Nenhum material selecionado ainda.</h5>
                          <p className="text-[11px] leading-relaxed text-zinc-400 max-w-md">
                            Marque ao menos um item para visualizar possibilidades de desdobramento para esse formato audiovisual.
                          </p>
                        </div>
                      )}
                    </div>
                </div>

                {/* Core action trigger with prefilled parameters */}
                <div className="pt-3 sm:pt-4 space-y-2.5 sm:space-y-3">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full bg-brand-secondary hover:bg-brand hover:shadow-[0_15px_35px_rgba(var(--color-brand-secondary-rgb),0.22)] text-black text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest py-3.5 sm:py-4 rounded-xl text-center transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_30px_rgba(var(--color-brand-secondary-rgb),0.15)]"
                  >
                    <MessageSquare className="w-4 h-4 text-black" />
                    <span>CONVERSAR SOBRE MEU FORMATO AUDIOVISUAL</span>
                  </a>
                  <span className="block text-center font-mono text-[7px] sm:text-[8px] text-zinc-500 uppercase leading-none select-none">
                    USE ESTE RESUMO COMO PONTO DE PARTIDA PARA A CONVERSA
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 6: METHODOLOGY TIMELINE (Antes, Durante, Depois)
         =========================================*/}
      <section className="px-6 md:px-8 py-20 border-b border-white/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              METODOLOGIA DE PRODUÃ‡ÃƒO // TAG08
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tighter">
              Um processo pensado antes, durante e depois da gravaÃ§Ã£o.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
              A produÃ§Ã£o audiovisual nÃ£o comeÃ§a no dia da captaÃ§Ã£o. Antes de gravar, entendemos o contexto da marca, definimos a funÃ§Ã£o do conteÃºdo, organizamos formatos possÃ­veis e planejamos como o material poderÃ¡ ser usado depois.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left relative">
            {/* Visual connector lines for large screens */}
            <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-gradient-to-r from-brand/20 via-brand/40 to-transparent z-0 hidden lg:block -translate-y-16" />

            {[
              {
                num: "01",
                tag: "ENTENDIMENTO DO CONTEXTO",
                title: "Entendimento do contexto",
                color: "group-hover:border-brand/40",
                list: [
                  "ComeÃ§amos entendendo a marca, o momento, os canais, o pÃºblico e a funÃ§Ã£o que o conteÃºdo audiovisual precisa cumprir.",
                  "Mapeamos o que precisa ser comunicado com clareza e o que deve ficar como base para as prÃ³ximas etapas.",
                  "Organizamos o que jÃ¡ existe, o que falta e o que pode ser reaproveitado no processo.",
                  "Alinhamos expectativas para evitar excesso de ruÃ­do e orientar a produÃ§Ã£o com critÃ©rio.",
                  "Definimos o ponto de partida antes de qualquer decisÃ£o de captaÃ§Ã£o."
                ]
              },
              {
                num: "02",
                tag: "NARRATIVA E FORMATO",
                title: "DefiniÃ§Ã£o de narrativa e formatos",
                color: "group-hover:border-brand-secondary/40 border-l border-r border-white/5",
                list: [
                  "Organizamos quais mensagens sÃ£o prioritÃ¡rias e quais formatos fazem mais sentido para o uso previsto.",
                  "Definimos se o material precisa servir para apresentaÃ§Ã£o, registro, redes, site, campanhas ou comunicaÃ§Ã£o institucional.",
                  "Estruturamos a narrativa para que o conteÃºdo tenha direÃ§Ã£o e nÃ£o apenas presenÃ§a de imagem.",
                  "Ajustamos o recorte de cada entrega ao canal em que ela serÃ¡ usada.",
                  "Criamos uma base clara para orientar a captaÃ§Ã£o."
                ]
              },
              {
                num: "03",
                tag: "CAPTAÃ‡ÃƒO, EDIÃ‡ÃƒO E USO",
                title: "CaptaÃ§Ã£o com direÃ§Ã£o, ediÃ§Ã£o e entrega",
                color: "group-hover:border-brand/40",
                list: [
                  "Definimos roteiro, pauta, cenas, falas, dinÃ¢mica de gravaÃ§Ã£o, prioridades de registro e materiais que precisam ser captados.",
                  "Durante a gravaÃ§Ã£o, conduzimos o processo para registrar falas, ambientes, bastidores, detalhes e momentos com clareza e intenÃ§Ã£o.",
                  "O material captado Ã© editado, estruturado e desdobrado em peÃ§as coerentes com a narrativa, os canais e os objetivos de comunicaÃ§Ã£o.",
                  "AlÃ©m dos arquivos finais, indicamos como os materiais podem ser utilizados em redes sociais, site, apresentaÃ§Ãµes, campanhas ou comunicaÃ§Ã£o institucional.",
                  "Fechamos o processo com orientaÃ§Ã£o de uso e reaproveitamento."
                ]
              }
            ].map((step, idx) => (
              <div 
                key={idx}
                className="bg-charcoal-900 border border-white/[0.05] rounded-2xl p-6 sm:p-9 relative z-10 group hover:bg-white/[0.015] transition-all duration-300 flex flex-col justify-between min-h-[440px]"
              >
                <div className="space-y-5 text-left">
                  <div className="flex justify-between items-center">
                    <span className="font-display font-black text-2xl text-zinc-800 group-hover:text-brand transition-colors select-none">
                      {step.num}.
                    </span>
                    <span className="font-mono text-[8px] text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2 py-0.5 rounded uppercase font-black uppercase">
                      {step.tag}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight group-hover:text-brand transition-colors leading-[1.25]">
                    {step.title}
                  </h3>

                  <ul className="space-y-3 pt-3 border-t border-white/[0.04]">
                    {step.list.map((item, idxx) => (
                      <li key={idxx} className="flex gap-2.5 items-start">
                        <Check className="w-3.5 h-3.5 text-brand shrink-0 stroke-[2.5] mt-0.5" />
                        <span className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed group-hover:text-zinc-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/[0.04] text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest flex justify-between">
                  <span>PROCESSO ATIVO</span>
                  <span className="text-brand font-bold select-none">TAG08_PROCESS_0{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 7: INCLUSIONS AND COMPLEMENTS
         =========================================*/}
      <section className="px-6 md:px-8 py-20 bg-charcoal-900/10 border-b border-white/[0.04] text-left relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-left space-y-3 max-w-2xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
              INCLUSÃ•ES E COMPLEMENTOS // TAG08
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tighter">
              O escopo precisa acompanhar o uso do material.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Cada produÃ§Ã£o pode envolver diferentes entregas, dependendo do objetivo, dos canais e do momento da marca. O importante Ã© definir o que precisa ser captado, editado e organizado para que o conteÃºdo tenha uso real depois da gravaÃ§Ã£o.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* ITENS DEFINIDOS NO ESCOPO */}
            <div className="bg-charcoal-900 border border-white/[0.06] rounded-2.5xl p-6 sm:p-9 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-brand font-mono text-[9px] uppercase tracking-widest font-black pb-4 border-b border-white/[0.04]">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>MATERIAIS DE APOIO // ESCOPOS DEFINIDOS</span>
                </div>
                
                <div className="grid gap-4.5 pt-6 text-left">
                  {[
                    { title: "CaptaÃ§Ã£o principal", desc: "Registro das falas, ambientes, cenas, bastidores, detalhes e momentos essenciais para construir a narrativa do material." },
                    { title: "EdiÃ§Ã£o e finalizaÃ§Ã£o", desc: "OrganizaÃ§Ã£o do conteÃºdo em vÃ­deos claros, com ritmo, cortes, ajustes visuais, Ã¡udio tratado e acabamento coerente com a identidade da marca." },
                    { title: "Cortes e desdobramentos", desc: "CriaÃ§Ã£o de versÃµes menores, chamadas, recortes e materiais derivados para redes sociais, site, apresentaÃ§Ãµes ou comunicaÃ§Ã£o institucional." },
                    { title: "Roteiro, pauta e direÃ§Ã£o", desc: "Apoio na definiÃ§Ã£o do que precisa ser dito, registrado e priorizado para que a gravaÃ§Ã£o tenha mais clareza e menos improviso." },
                    { title: "Cobertura de bastidores", desc: "Registro complementar de equipe, ambiente, preparaÃ§Ã£o, rotina e detalhes que ajudam a aproximar a marca do pÃºblico." }
                  ].map((inc, iIdx) => (
                    <div key={iIdx} className="flex gap-3 text-left">
                      <div className="w-5 h-5 rounded-md bg-brand/10 text-brand flex items-center justify-center font-bold text-[10px] shrink-0 font-sans mt-0.5">
                        {iIdx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-white text-xs sm:text-sm font-semibold uppercase">{inc.title}</h4>
                        <p className="text-zinc-400 text-xs leading-normal">{inc.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-white/[0.04] text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                ESCOPOS DEFINIDOS CONFORME USO REAL
              </div>
            </div>

            {/* COMPLEMENTOS POSSÃVEIS */}
            <div className="bg-white/[0.01] border border-white/[0.04] rounded-2.5xl p-6 sm:p-9 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-zinc-500 font-mono text-[9px] uppercase tracking-widest font-bold pb-4 border-b border-white/[0.04]">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-650" />
                  <span>COMPLEMENTOS POSSÃVEIS // DEFINIDOS CONFORME ESCOPO</span>
                </div>
                
                <div className="grid gap-4.5 pt-6 text-left">
                  {[
                    { title: "Entrega e orientaÃ§Ã£o de uso", desc: "IndicaÃ§Ã£o de como os materiais podem ser aproveitados nos canais da marca, respeitando contexto, linha editorial e objetivo de comunicaÃ§Ã£o." },
                    { title: "Materiais de apoio para site e apresentaÃ§Ãµes", desc: "VÃ­deos, chamadas e recortes que complementam pÃ¡ginas, propostas e apresentaÃ§Ãµes comerciais." },
                    { title: "Cobertura complementar de bastidores", desc: "Registro extra de equipe, preparaÃ§Ã£o, rotina e ambiente quando isso fizer sentido para o material final." },
                    { title: "CaptaÃ§Ã£o adicional prevista no planejamento", desc: "Registros extras definidos no escopo quando houver necessidade real de ampliar a narrativa ou o uso posterior." },
                    { title: "Desdobramentos para canais da marca", desc: "VersÃµes e cortes organizados para apoiar comunicaÃ§Ã£o institucional, social ou comercial." }
                  ].map((opt, oIdx) => (
                    <div key={oIdx} className="flex gap-3 text-left">
                      <div className="w-5 h-5 rounded-md bg-white/5 text-zinc-400 border border-white/5 flex items-center justify-center font-bold text-[10px] shrink-0 font-sans mt-0.5">
                        +{oIdx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-zinc-300 text-xs sm:text-sm font-semibold uppercase">{opt.title}</h4>
                        <p className="text-zinc-500 text-xs leading-normal">{opt.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-white/[0.04] text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest">
                ITENS DEFINIDOS CONFORME ESCOPO
              </div>
            </div>
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 8: SYNERGY INTEGRATION (Audiovisual + soluÃ§Ãµes)
         =========================================*/}
      <section className="px-6 md:px-8 py-20 border-b border-white/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              INTEGRAÃ‡ÃƒO ENTRE FRENTES // TAG08
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tighter">
              Audiovisual nÃ£o precisa ficar isolado.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
              Uma produÃ§Ã£o bem planejada pode alimentar diferentes frentes da comunicaÃ§Ã£o: redes sociais, site, branding, apresentaÃ§Ãµes comerciais, campanhas, relacionamento e canais oficiais da marca, como YouTube, Vimeo, Pinterest, Google Meu NegÃ³cio e WhatsApp, quando fizer sentido. O valor estÃ¡ em pensar o material desde o inÃ­cio para que ele tenha funÃ§Ã£o depois da gravaÃ§Ã£o.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              {
                title: "Redes sociais",
                desc: "VÃ­deos, cortes, bastidores, chamadas e depoimentos podem alimentar a linha editorial com mais presenÃ§a, clareza e recorrÃªncia.",
                cta: "GestÃ£o de Redes Sociais",
                page: "/servicos/gestao-de-redes-sociais"
              },
              {
                title: "Site e pÃ¡ginas comerciais",
                desc: "Materiais audiovisuais podem ajudar a apresentar a marca, explicar serviÃ§os, humanizar pÃ¡ginas e apoiar jornadas de decisÃ£o com mais contexto.",
                cta: "Desenvolvimento Web",
                page: "/servicos/desenvolvimento-web"
              },
              {
                title: "Branding e posicionamento",
                desc: "A produÃ§Ã£o pode reforÃ§ar identidade, tom de voz, narrativa institucional, cultura e percepÃ§Ã£o de marca de forma mais concreta.",
                cta: "Branding & Identidade",
                page: "/servicos/branding-identidade"
              },
              {
                title: "Processos comerciais e relacionamento",
                desc: "Depoimentos, apresentaÃ§Ãµes, registros institucionais e vÃ­deos explicativos podem apoiar conversas comerciais sem substituir o diagnÃ³stico consultivo.",
                cta: "Process Activation",
                page: "/servicos/process-activation"
              }
            ].map((syn, idx) => (
              <div 
                key={idx}
                className="bg-charcoal-900 border border-white/[0.05] rounded-2xl p-6.5 sm:p-7 hover:border-brand/40 transition-colors duration-300 flex flex-col justify-between h-72 group"
              >
                <div className="space-y-4">
                  <span className="font-mono text-[8.5px] text-brand-secondary font-black uppercase tracking-widest block">SINERGIA {String(idx + 1).padStart(2, '0')}</span>
                  <h3 className="text-white text-base sm:text-lg font-display font-semibold uppercase tracking-tight group-hover:text-brand transition-colors leading-[1.2]">
                    {syn.title}
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    {syn.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleLinkClick(syn.page)}
                  className="group flex items-center justify-between text-xs font-sans font-bold text-zinc-500 hover:text-brand cursor-pointer select-none pt-3 border-t border-white/5 w-full focus:outline-none"
                >
                  <span className="uppercase text-[10px] tracking-widest">{syn.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* MiniCases Validation panel */}
      <MiniCases onNavigate={onNavigate} />

      {/*=========================================
          SECTION 9: BOTTOM CTA CARD (WHATSAPP NEON)
         =========================================*/}
      <section className="py-20 px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden animate-fade-in">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

          {/* Left Block: Image frame */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[500px]">
            <div className="absolute inset-0 bg-black/15 rounded-[24px] overflow-hidden" />
            <img 
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'%3E%3Cdefs%3E%3CradialGradient id='g' cx='30%25' cy='30%25' r='80%25'%3E%3Cstop offset='0%25' stop-color='%23f5f5f5' stop-opacity='.18'/%3E%3Cstop offset='60%25' stop-color='%23000000' stop-opacity='.25'/%3E%3Cstop offset='100%25' stop-color='%23000000' stop-opacity='.85'/%3E%3C/radialGradient%3E%3ClinearGradient id='l' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23d4d4d8' stop-opacity='.12'/%3E%3Cstop offset='100%25' stop-color='%233f3f46' stop-opacity='.45'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='500' fill='%230b0b0d'/%3E%3Crect width='800' height='500' fill='url(%23g)'/%3E%3Cg opacity='.65'%3E%3Ccircle cx='180' cy='120' r='96' fill='url(%23l)'/%3E%3Ccircle cx='610' cy='360' r='160' fill='%23facc15' fill-opacity='.08'/%3E%3Cpath d='M80 390C180 300 290 320 380 250s170-90 320-30' fill='none' stroke='%23ffffff' stroke-opacity='.15' stroke-width='2'/%3E%3Cpath d='M110 150h180M510 120h180M120 420h120' stroke='%23ffffff' stroke-opacity='.08' stroke-width='3'/%3E%3C/g%3E%3C/svg%3E" 
              alt="TAG08 Equipe TÃ©cnica Apoio Audiovisual" 
              className="absolute inset-0 w-full h-full object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[10%] hover:scale-105 duration-500 transition-all"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] text-white/60 bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-black border border-white/5">
                  AUDIOVISUAL
                </span>
                <span className="font-mono text-[9px] text-white/50 tracking-wider font-extrabold">
                  TAG08
                </span>
              </div>
              <div className="space-y-1.5 opacity-25 select-none">
                <div className="font-display font-extrabold text-[1.8rem] text-white/50 tracking-widest leading-none uppercase select-none">
                  audiovisual
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/30 tracking-widest leading-none uppercase select-none pl-6">
                  conteudo_com_funcao_
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  PROCESSO ORGANIZADO
                </span>
                <span className="font-mono text-[9px] text-white/60 bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-black border border-white/5">
                  CONTEXTO DEFINIDO
                </span>
              </div>
            </div>
          </div>

          {/* Right Block: Details */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 text-left h-full relative z-10 lg:pl-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-black font-semibold">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/90">
                  CONVERSA CONSULTIVA
                </span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black leading-[0.9] tracking-tighter uppercase font-display">
                Vamos entender qual produÃ§Ã£o <br />
                faz sentido para o seu momento?
              </h2>
              <p className="text-black/85 text-[11px] sm:text-xs max-w-lg leading-relaxed font-sans font-bold uppercase">
                Conte um pouco sobre o que vocÃª precisa comunicar, registrar ou transformar em conteÃºdo. A partir disso, avaliamos o formato mais coerente: institucional, evento, bastidores, depoimentos, conteÃºdo recorrente ou material de apoio para canais digitais.
              </p>
            </div>
            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 max-w-md relative overflow-hidden text-left font-sans">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-4 items-start select-none">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black shrink-0 shadow-lg shadow-brand/10 hover:scale-105 transition-all">
                  <ArrowUpRight className="w-5 h-5 rotate-45 stroke-[2.5] text-black" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-[8px] text-brand uppercase tracking-wider font-extrabold block">
                    CONVERSA CONSULTIVA
                  </span>
                  <p className="text-white text-xs leading-snug font-sans font-semibold">
                    Sem pacote pronto. Primeiro entendemos contexto, objetivo e uso do material.
                  </p>
                </div>
              </div>

              {/* Contacts info details */}
              <div className="space-y-3 font-sans">
                <a 
                  href={buildBrazilWhatsAppUrl("OlÃ¡, quero entender qual formato audiovisual faz mais sentido para o momento da minha marca.")}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-black transition-all">
                        <span className="text-[9px] font-mono font-black tracking-tight text-brand group-hover:text-black">BR</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase font-black tracking-wider leading-none">
                          CONVERSAR SOBRE MEU AUDIOVISUAL
                        </span>
                        <span className="text-white text-xs font-mono font-bold tracking-wider group-hover:text-brand transition-colors mt-0.5">
                          +55 83 9.9886-8882
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-brand font-mono font-bold uppercase tracking-wider bg-brand/10 py-1 px-2.5 rounded-lg group-hover:bg-brand group-hover:text-black transition-all">
                      INICIAR CONVERSA
                    </span>
                  </div>
                </a>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 text-xs font-sans select-none">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                  <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest font-extrabold">
                    TAG08 AUDIOVISUAL
                  </span>
                </div>
                <span className="font-mono text-[8.5px] text-brand font-bold bg-brand/10 border border-brand/25 px-2 py-0.5 rounded uppercase leading-none">
                  PRÃ“XIMO PASSO
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

            {/*=========================================
          SECTION 10: FAQ (12-Column Layout)
         =========================================*/}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto rounded-[28px] sm:rounded-[40px] bg-charcoal-950 border border-white/[0.04] p-4 sm:p-8 lg:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch relative z-10">
            {/* Left Side: Accordion Category selector */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-5 sm:space-y-8 text-left">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-[8px] sm:text-[9px] rounded-lg uppercase tracking-widest font-mono">
                  FAQ // ENCONTRE RESPOSTAS
                </div>
                <h2 className="font-display font-black text-[1.6rem] sm:text-4xl text-white leading-[0.95] tracking-tighter uppercase">
                  DÃºvidas comuns sobre produÃ§Ã£o audiovisual
                </h2>
                <p className="text-zinc-400 text-[13px] sm:text-[13px] leading-relaxed font-sans max-w-sm">
                  Antes de gravar, Ã© importante entender objetivo, contexto, formato e uso posterior do material. Essas respostas ajudam a esclarecer como a TAG08 conduz esse processo.
                </p>
              </div>

              <div className="space-y-2.5 sm:space-y-3 pt-3 sm:pt-4">
                {faqCategories.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveFaq(item.id)}
                    className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all text-left group cursor-pointer ${
                      activeFaq === item.id
                        ? "bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)]"
                        : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                    }`}
                  >
                    <span className="font-mono text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-2.5 sm:gap-3">
                      <span className={activeFaq === item.id ? "text-black" : "text-brand"}>
                        {String(item.id + 1).padStart(2, '0')}.
                      </span>
                      {item.title}
                    </span>
                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1 ${
                      activeFaq === item.id ? "text-black rotate-[-45deg] stroke-[2.5]" : "text-zinc-500"
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Central Side: Responsive image + Answer container */}
            <div className="lg:col-span-4 relative flex flex-col justify-end p-4 sm:p-6 min-h-[300px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-white/[0.04] bg-[#0c0c0e]">
              <img
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800"
                alt="TAG08 ProduÃ§Ã£o Audiovisual"
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 pointer-events-none font-mono text-[7px] sm:text-[8px] text-white/20 uppercase tracking-widest leading-none">
                SYS // BROADCAST_FAQ
              </div>

              <div className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-4 sm:p-5 rounded-2xl space-y-2.5 sm:space-y-3 shadow-2xl text-left font-sans">
                <span className="font-mono text-[8px] sm:text-[8.5px] text-brand uppercase tracking-widest font-black block">
                  {faqCategories[activeFaq].title}
                </span>
                
                <h4 className="text-white font-semibold text-[13px] sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {faqQuestions[activeFaq]}
                </h4>
                
                <p className="text-zinc-300 text-[13px] sm:text-[12.5px] leading-relaxed font-sans font-medium">
                  {faqAnswers[activeFaq]}
                </p>
              </div>
            </div>

            {/* Right Side: Proportional side cards */}
            <div className="lg:col-span-3 flex flex-col justify-between gap-3 sm:gap-4">
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-brand/20 transition-all text-left flex flex-col justify-between space-y-3 sm:space-y-4 flex-1">
                <div className="space-y-1.5 sm:space-y-2">
                  <span className="font-mono text-[8px] sm:text-[8.5px] text-zinc-500 uppercase tracking-widest block font-bold">SERVIÃ‡OS &amp; FORMATOS</span>
                  <h4 className="text-white font-semibold text-sm leading-snug">Planejamento e clareza</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    O processo comeÃ§a entendendo o contexto da marca, a funÃ§Ã£o do material e o uso esperado depois da gravaÃ§Ã£o.
                  </p>
                </div>
                <button
                  onClick={() => handleLinkClick("/servicos")}
                  className="group flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5"
                >
                  <span>VER SERVIÃ‡OS</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-brand text-black rounded-2xl p-4 sm:p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-3 sm:space-y-4 flex-1">
                <div className="space-y-1.5 sm:space-y-2">
                  <span className="font-mono text-[8px] sm:text-[8.5px] text-black/60 uppercase tracking-widest block font-extrabold">CONVERSA CONSULTIVA</span>
                  <h4 className="text-black font-black text-sm uppercase leading-tight tracking-tight">Quer conversar sobre seu audiovisual?</h4>
                  <p className="text-black/85 text-[11.5px] font-semibold leading-relaxed font-sans">
                    Sem pacote pronto. Primeiro entendemos contexto, objetivo e uso do material.
                  </p>
                </div>
                <a
                  href={buildBrazilWhatsAppUrl("OlÃ¡, quero entender qual formato audiovisual faz mais sentido para o momento da minha marca.")}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between text-xs font-sans font-bold text-black border-t border-black/10 pt-2 cursor-pointer select-none"
                >
                  <span>CONVERSAR SOBRE MEU AUDIOVISUAL</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
