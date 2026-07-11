import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Sparkles, TrendingUp, Share2, Camera, Heart, ArrowUpRight, ArrowRight, BarChart3, Users, Check, Play, Pause, Volume2, VolumeX, Eye, Film, X, Clock, ExternalLink, Zap, Award } from "lucide-react";
import { buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl } from "../config/siteNetwork";
import ThreeDimensionalTilt from "../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../components/Subtle3DCanvas";
import MiniCases from "../components/MiniCases";

interface PlayableShort {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  duration: string;
  videoUrl: string;
  thumbnail: string;
  behindTheScenes: string;
  strategy: string;
  successMetric: string;
  metrics: {
    reach: string;
    saves: string;
    directs: string;
  };
  deliverables: string[];
}

const shortsData: PlayableShort[] = [
  {
    id: "short-01",
    title: "Bastidores de identidade",
    subtitle: "Processo visual e direção",
    category: "Branding & Design",
    duration: "42s",
    videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227e333ef33d97d477e6e5d8a011de&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=600",
    behindTheScenes: "Registro do processo de criacao, escolhas visuais e alinhamento com o posicionamento da marca.",
    strategy: "Mostra como os bastidores ajudam a explicar a logica da identidade sem depender de promessas comerciais artificiais.",
    successMetric: "Apoia reconhecimento e aproxima o publico da proposta da marca.",
    metrics: {
      reach: "Clareza",
      saves: "Coerencia",
      directs: "Aproximacao"
    },
    deliverables: [
      "Roteiro de bastidores",
      "Captacao do processo",
      "Edicao curta",
      "Apoio a linha editorial"
    ]
  },
  {
    id: "short-02",
    title: "Falas e autoridade",
    subtitle: "Conteudo com contexto",
    category: "Autoridade",
    duration: "58s",
    videoUrl: "https://player.vimeo.com/external/435674703.sd.mp4?s=7f60714b9b94091ecf3306ee1b14c1e4004cbe90&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600",
    behindTheScenes: "Recortes de fala, rotina ou explicacao que tornam a marca mais compreensivel para o publico.",
    strategy: "Valoriza a fala com ritmo e cortes que ajudam a leitura da ideia principal.",
    successMetric: "Recorte util para redes, site e pecas de apoio.",
    metrics: {
      reach: "Contexto",
      saves: "Ritmo",
      directs: "Aproximacao"
    },
    deliverables: [
      "Captacao de falas",
      "Recorte de entrevistas",
      "Edicao objetiva",
      "Versoes curtas para redes"
    ]
  },
  {
    id: "short-03",
    title: "Conteudo curto para redes",
    subtitle: "Formato rapido com linha editorial",
    category: "Recortes Sociais",
    duration: "35s",
    videoUrl: "https://player.vimeo.com/external/403841133.sd.mp4?s=d010d9c4fecd6a56f082e6ea9a75677ff0a65383&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600",
    behindTheScenes: "Pecas curtas pensadas para circular nas redes com funcao clara dentro da pauta.",
    strategy: "Ajuda a presenca a ficar recorrente sem depender de um unico formato ou de expectativas artificiais.",
    successMetric: "Formato que reforca presenca e facilita reaproveitamento.",
    metrics: {
      reach: "Linha",
      saves: "Frequencia",
      directs: "Distribuicao"
    },
    deliverables: [
      "Roteiro curto",
      "Edicao agil",
      "Legendagem objetiva",
      "Recortes para feed e stories"
    ]
  },
  {
    id: "short-04",
    title: "Reaproveitamento editorial",
    subtitle: "Transformacao de materiais",
    category: "Reaproveitamento",
    duration: "50s",
    videoUrl: "https://player.vimeo.com/external/517602126.sd.mp4?s=eef87fc4dc8d3df623f9bca7ddaff8e16fd4eb17&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600",
    behindTheScenes: "Transforma gravacoes, eventos e conteudos longos em recortes menores e mais distribuiiveis.",
    strategy: "Aproveita o que ja foi captado para ampliar a vida util do material na linha editorial.",
    successMetric: "Mais consistencia a partir de materiais ja existentes.",
    metrics: {
      reach: "Uso",
      saves: "Atencao",
      directs: "Continuidade"
    },
    deliverables: [
      "Selecao de trechos",
      "Montagem de recortes",
      "Ajuste de ritmo",
      "Versoes por canal"
    ]
  }
];

interface SocialMediaProps {
  onNavigate: (page: string) => void;
}

export default function GestaoRedesSociais({ onNavigate }: SocialMediaProps) {
  const [activeFaq, setActiveFaq] = useState(0);
  const [selectedShort, setSelectedShort] = useState<PlayableShort | null>(null);
  const [hoveredShort, setHoveredShort] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono self-start">
                GESTÃƒO DE REDES SOCIAIS // TAG08
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter uppercase font-display">
                Redes sociais <br />
                <span className="text-brand">com direÃ§Ã£o, linha editorial e consistÃªncia.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-sans font-medium">
                A TAG08 organiza a presenÃ§a da marca nas redes sociais com estratÃ©gia, narrativa, calendÃ¡rio, formatos e acompanhamento para que o conteÃºdo deixe de ser postagem solta e passe a cumprir uma funÃ§Ã£o clara.
              </p>
            </div>
          </div>

          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600"
                alt="PresenÃ§a com direÃ§Ã£o TAG08"
                className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-[1.01] transition-all duration-1000 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{ transform: "translateZ(45px)" }}>
                <button
                  onClick={() => handleLinkClick("/servicos/producao-audiovisual")}
                  className="group bg-brand-secondary text-black font-mono font-black text-[10px] sm:text-[11px] uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] hover:scale-105 duration-300 transition-all border border-brand-secondary hover:bg-brand-dark flex items-center gap-2 cursor-pointer z-20"
                >
                  <span>CONHECER PRODUCAO AUDIOVISUAL</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="font-mono text-[8.5px] text-brand-secondary tracking-widest block uppercase font-bold">FORMATOS EM USO // TAG08</span>
                  <h4 className="font-display font-black text-white text-xs sm:text-sm uppercase tracking-tight leading-none">Recortes com direção e revisão</h4>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-[8px] text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>CONTEUDO EM ANDAMENTO</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Linha editorial</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Temas, formatos e prioridades<br/>organizados com intenÃ§Ã£o</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">FrequÃªncia possÃ­vel</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">CadÃªncia pensada para a<br/>realidade da operaÃ§Ã£o</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">Narrativa de marca</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Mensagem coerente entre feed,<br/>legenda e conversa</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">Acompanhamento</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">RevisÃ£o contÃ­nua para ajustar<br/>a direÃ§Ã£o quando preciso</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - SEGMENTATION / QUANDO INVESTIR IN SOCIAL MEDIA */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04] bg-charcoal-900/10 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-4 space-y-4">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Sinais de desalinhamento</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-none tracking-tight">
              Quando as redes sociais <span className="text-brand">deixam de construir presenÃ§a.</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Muitas marcas publicam com frequÃªncia, mas ainda nÃƒÂ£o conseguem transmitir clareza, consistÃƒÂªncia ou percepÃƒÂ§ÃƒÂ£o de valor. O problema nem sempre ÃƒÂ© falta de conteÃƒÂºdo; muitas vezes ÃƒÂ© falta de linha editorial, posicionamento e critÃƒÂ©rio de produÃƒÂ§ÃƒÂ£o.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">Postagens sem direÃ§Ã£o</span>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                Os conteÃºdos saem, mas nÃƒÂ£o parecem construir uma narrativa clara sobre a marca, seus diferenciais ou sua forma de gerar valor.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">CalendÃ¡rio sem prioridade</span>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                A rotina existe, mas os temas sÃƒÂ£o definidos por urgÃƒÂªncia, tendÃƒÂªncia ou improviso, sem conexÃƒÂ£o com uma estratÃƒÂ©gia maior.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">Visual sem consistÃªncia</span>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                Cada peÃƒÂ§a parece seguir uma lÃƒÂ³gica diferente, enfraquecendo reconhecimento, confianÃƒÂ§a e percepÃƒÂ§ÃƒÂ£o profissional.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">Pouca conexÃ£o com o comercial</span>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                O conteÃƒÂºdo atÃƒÂ© movimenta a pÃƒÂ¡gina, mas nÃƒÂ£o ajuda o pÃƒÂºblico a entender melhor a oferta, o processo ou o prÃƒÂ³ximo passo.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all sm:col-span-2">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">ProduÃ§Ã£o difÃ­cil de sustentar</span>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                A marca depende de esforÃƒÂ§o pontual, ideias soltas e aprovaÃƒÂ§ÃƒÂµes demoradas, tornando a presenÃƒÂ§a instÃƒÂ¡vel.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* SECTION 3 - DELIVERABLES (The "What" with Clean Features Grid) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-bold">O que organizamos</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Gestão de redes não é só calendário. É direção editorial.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              A TAG08 estrutura temas, formatos, frequência, linguagem, design e revisão para que a presença da marca nas redes tenha consistência e função dentro da estratégia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Linha editorial</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Definição de temas, mensagens, pilares de conteúdo e prioridades para orientar a comunicação da marca.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Calendário possível</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Organização de uma rotina de publicação compatível com o momento, a equipe, os canais e a capacidade de aprovação.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Criação de conteúdo</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Desenvolvimento de legendas, peças, roteiros e formatos alinhados ao posicionamento e ao objetivo de cada publicação.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Users className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Direção visual</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Aplicação de identidade, estética, hierarquia e consistência visual para fortalecer reconhecimento e percepção profissional.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Acompanhamento e revisão</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Leitura do que precisa evoluir, ajustes de rota, organização de feedbacks e melhoria contínua do processo editorial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* SECTION 4 - PLANOS DISPONaVEIS & COPES (Immediate Action Offerings) */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-900/10 text-left">
        <div className="max-w-7xl mx-auto space-y-28">
          
          {/* SECTION 4 - PLANOS DISPONIVEIS */}
          <div className="space-y-3 max-w-3xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              Níveis de escopo
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-white leading-tight uppercase">
              Escolha o escopo pelo momento da sua presença digital.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl">
              A gestão de redes pode começar de forma mais enxuta ou evoluir para uma rotina editorial mais completa. O escopo ideal depende da maturidade da marca, da frequência possível e da estrutura disponível para aprovar e sustentar conteúdo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {[
              {
                name: "Presença organizada",
                subtitle: "Para marcas que precisam sair da postagem solta.",
                desc: "Organização inicial de temas, calendário, linguagem e peças para criar uma rotina mais clara e consistente nas redes.",
                badge: "01"
              },
              {
                name: "Linha editorial recorrente",
                subtitle: "Para marcas que precisam manter frequência com intenção.",
                desc: "Planejamento, criação e acompanhamento de conteúdos com narrativa, formatos definidos e alinhamento ao posicionamento da marca.",
                badge: "02"
              },
              {
                name: "Conteúdo com acompanhamento",
                subtitle: "Para marcas que precisam evoluir a presença com mais critério.",
                desc: "Gestão editorial com revisão, ajustes de rota, leitura de aprendizados e integração com outras frentes de comunicação.",
                badge: "03"
              }
            ].map((plan) => (
              <motion.div
                key={plan.badge}
                whileHover={{ y: -6 }}
                className="border rounded-3xl p-7 flex flex-col justify-between gap-8 transition-all duration-300 relative overflow-hidden bg-charcoal-900 border-white/[0.04]"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[9px] text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2 py-0.5 rounded font-black max-w-max">
                      {plan.badge}
                    </span>
                    <span className="font-sans text-[9px] text-zinc-500 font-bold">ESCOPO</span>
                  </div>

                  <h3 className="text-white font-display font-medium text-xl uppercase tracking-tight leading-none pt-2">{plan.name}</h3>
                  <p className="text-brand-secondary text-[10px] font-black uppercase tracking-[0.22em]">{plan.subtitle}</p>
                  <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">{plan.desc}</p>
                </div>

                <div className="pt-6 border-t border-white/[0.04] mt-8">
                  <button
                    type="button"
                    onClick={() => handleLinkClick("/contato")}
                    className="group inline-flex items-center justify-center gap-2 rounded-full border border-brand-secondary/20 bg-brand-secondary/10 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-brand-secondary transition-all duration-300 hover:bg-brand-secondary hover:text-black"
                  >
                    <span>ENTENDER ESCOPO</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Incluso x NÃƒÂ£o Incluso */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-12 border-t border-white/[0.04]">
            
            {/* Left intro details column */}
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
              <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                ALINHAMENTO DE EXPECTATIVAS // TRANSPARaNCIA
              </span>
              <h3 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
                O que garantimos (e o que foca em outras areas)
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                Nossa filosofia repudia falsas promessas de escopo infinito sem direÃƒÂ§ÃƒÂ£o tÃƒÂ¡tica. Esclarecer com integridade os limites da nossa produÃƒÂ§ÃƒÂ£o corporativa ÃƒÂ© nossa garantia de sinergia:
              </p>

              <div className="p-5 rounded-2xl bg-brand-secondary/[0.01] border border-white/[0.03] text-xs text-zinc-400 font-sans leading-relaxed">
                Nossa equipe foca estritamente no planejamento, design e rotinas intelectuais. Para gravaÃƒÂ§ÃƒÂ£o fÃƒÂ­sica, fornecemos roteiros clÃƒÂ­nicos que vocÃƒÂª ou seu time gravam de forma descomplicada.
              </div>
            </div>

            {/* Inclusions and Exclusions ledger boxes */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Incluso */}
              <div className="bg-charcoal-900 border border-white/[0.05] p-7 rounded-3xl space-y-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand/30" />
                <span className="font-mono text-[9px] text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded font-black uppercase inline-block">
                  INCLUSO NO ESCOPO MENSAL
                </span>
                
                <div className="space-y-3.5">
                  {[
                    "Planejamento de linha editorial sob medida",
                    "Roteiros escritos com gancho e call-to-action",
                    "Design exclusivo sob Figma para carrossÃƒÂ©is",
                    "Legendas magnÃƒÂ©ticas para educar o pÃƒÂºblico",
                    "Agendamento e automaÃƒÂ§ÃƒÂ£o das postagens"
                  ].map((inc, index) => (
                    <div key={index} className="flex gap-3 text-xs text-zinc-300 font-sans items-start font-medium leading-relaxed font-semibold">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-1.5 shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* NÃƒÂ£o incluso */}
              <div className="bg-charcoal-900 border border-white/[0.05] p-7 rounded-3xl space-y-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-zinc-600/30" />
                <span className="font-mono text-[9px] text-zinc-500 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded font-black uppercase inline-block">
                  NaO INCLUaDO NESTA DIVIsÃƒÂ£o
                </span>
                
                <div className="space-y-3.5">
                  {[
                    "GravaÃƒÂ§ÃƒÂµes de camera (deslocamento fasico)",
                    "Oraamento de trafego pago ativo",
                    "InteraÃƒÂ§ÃƒÂµes de Direct, comentarios e SAC",
                    "Apoio de co-produÃƒÂ§ÃƒÂ£o fÃƒÂ­sica presencial",
                    "CriaÃƒÂ§ÃƒÂ£o integral de nova marca/rebranding"
                  ].map((exc, index) => (
                    <div key={index} className="flex gap-3 text-xs text-zinc-400 font-sans items-start font-medium leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                      <span>{exc}</span>
                    </div>
                  ))}
                </div>
                
                <p className="text-[10px] text-zinc-500 font-mono leading-normal pt-2 border-t border-white/[0.03] uppercase">
                  * Disponaveis em outras frentes integradas do ecossistema.
                </p>
              </div>
            </div>
          </div>

          {/* Ciclo Mensal de OperaÃƒÂ§ÃƒÂ£o - CHRONOLOGICAL TIMELINE */}
          <div className="space-y-10 pt-12 border-t border-white/[0.04]">
            <div className="space-y-3">
              <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                METODOLOGIA DE FLUXO
              </span>
              <h3 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
                Nosso Ciclo Mensal SistemÃƒÂ¡tico
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl">
                Seguimos um ritmo de planejamento consistente para manter sua grade de canais digitais organizada, previsÃƒÂ­vel e sem dependÃƒÂªncia de ÃƒÂºltima hora:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Briefing & DireÃƒÂ§ÃƒÂ£o", desc: "Alinhamos os seus gatilhos comerciais de ofertas e compromissos do perÃƒÂ­odo para mapear os temas do mÃƒÂªs." },
                { title: "Desenho e Roteiros", desc: "ConstruÃƒÂ­mos as falas e os carrossÃƒÂ©is no Notion para revisÃƒÂ£o estrutural." },
                { title: "Refinamento Visual", desc: "Criamos as artes estÃƒÂ¡ticas limpas exclusivas adequadas ao tom premium e liberamos para validaÃƒÂ§ÃƒÂ£o pÃƒÂºblica." },
                { title: "AutomaÃƒÂ§ÃƒÂ£o e AnÃƒÂ¡lise", desc: "Agendamos as postagens oficiais e extraÃƒÂ­mos mÃƒÂ©tricas e insights reais no tÃƒÂ©rmino de cada ciclo." }
              ].map((step, sIdx) => (
                <div key={sIdx} className="bg-charcoal-900 border border-white/[0.04] p-6 rounded-2xl text-left space-y-4 hover:border-brand/10 transition-all duration-300">
                  <div className="font-sans text-[10px] font-black text-brand-secondary bg-brand-secondary/5 w-8 h-8 rounded-lg flex items-center justify-center border border-brand-secondary/10 shadow-[0_4px_10px_rgba(var(--color-brand-secondary-rgb),0.05)]">
                    0{sIdx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white font-display font-bold text-xs sm:text-sm uppercase tracking-tight">{step.title}</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Relatarios e Aprendizados - ACTIVE DASHBOARD PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-12 border-t border-white/[0.04]">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                CULTURE OF METRICS MENSAL
              </span>
              <h3 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
                Monitoramos o seu Crescimento de Forma AnalÃƒÂ­tica
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                NÃƒÂ£o publicamos criativos por publicar. Acompanhamos indicadores cruciais para depurar o funil comercial e calibrar os desvios editoriais a cada ciclo renovado:
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Alcance Qualificado", desc: "Quantas contas executivas e tomadores de decisÃƒÂ£o visualizam sua marca no LinkedIn e Instagram mensalmente." },
                { title: "MÃƒÂ©tricas de RetenÃƒÂ§ÃƒÂ£o", desc: "Mapeamos se os carrossÃƒÂ©is e vÃƒÂ­deos sÃƒÂ£o realmente lidos por completo ou abandonados antes do CTA." },
                { title: "AderÃƒÂ¯Ã‚Â¿Ã‚Â½ncia Direta", desc: "Monitoramos o volume real de novos links acessados ou directs que chegam ao comercial provindos espontÃƒÂ¢neamente." },
                { title: "CalibraÃƒÂ§ÃƒÂ£o ContÃƒÂ­nua", desc: "Ajustamos os ganchos baseando-nos nos dados do perÃƒÂ­odo anterior para elevar a conversÃƒÂ£o sistÃƒÂªmica." }
              ].map((item, iIdx) => (
                <div key={iIdx} className="p-5 rounded-2xl bg-charcoal-900/60 border border-white/[0.03] space-y-1.5 text-left hover:border-brand/10 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-brand-secondary" />
                  <h4 className="text-white text-xs sm:text-sm font-display font-bold uppercase tracking-tight">{item.title}</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5 - TRUST CORE BAR */}
      <section className="px-4 sm:px-6 md:px-8 py-10 border-b border-white/[0.04] bg-charcoal-900/40 text-left">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-2 max-w-3xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              Critérios de confiança
            </span>
            <h4 className="text-white font-display font-black text-sm uppercase tracking-tight">
              O que sustenta uma presença mais consistente.
            </h4>
            <p className="text-zinc-400 text-xs font-sans font-medium leading-relaxed max-w-2xl">
              A gestão de redes funciona melhor quando existe direção editorial, rotina possível, revisão constante e conexão com o posicionamento da marca.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3 space-y-1">
              <span className="block text-[9px] font-black uppercase tracking-widest text-brand-secondary">Linha editorial</span>
              <p className="text-[11px] leading-relaxed text-zinc-300">Temas, mensagens e formatos organizados antes da produção.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3 space-y-1">
              <span className="block text-[9px] font-black uppercase tracking-widest text-brand-secondary">Rotina possível</span>
              <p className="text-[11px] leading-relaxed text-zinc-300">Frequência compatível com a estrutura real da marca.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3 space-y-1">
              <span className="block text-[9px] font-black uppercase tracking-widest text-brand-secondary">Consistência visual</span>
              <p className="text-[11px] leading-relaxed text-zinc-300">Peças alinhadas à identidade, estética e percepção desejada.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3 space-y-1">
              <span className="block text-[9px] font-black uppercase tracking-widest text-brand-secondary">Acompanhamento</span>
              <p className="text-[11px] leading-relaxed text-zinc-300">Revisão, aprendizados e ajustes para manter a presença em evolução.</p>
            </div>
          </div>
        </div>
      </section>
      {/* CASE STUDIES / CLIENTS LOGO SOCIAL PROOF */}
      <MiniCases 
        onNavigate={onNavigate} 
        title="Projetos que mostram conteúdo com direção."
        subtitle="A gestão de redes funciona melhor quando a marca combina linha editorial, consistência visual, frequência possível e revisão contínua. Os projetos devem mostrar esse processo, não prometer resultado instantâneo."
        badge="MÉTODO EM PRÁTICA"
      />

      {false && (
      /* INTERACTIVE INNOVATION: SIMULADOR DE CRESCIMENTO E EDITORIAL */
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-950 text-left relative overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-brand/[0.01] rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              PLANEJAMENTO ESTRATaGICO // SIMULaÃƒÂ§ÃƒÂ£o CORPORATIVA
            </span>
            <h2 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
              Simulador de Alcance Organico e Funil Social
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
              O alcance orgÃƒÂ¢nico sÃƒÂªnior ÃƒÂ© um jogo de regularidade editorial e distribuiÃƒÂ§ÃƒÂ£o de alta qualidade tÃƒÂ¯Ã‚Â¿Ã‚Â½cnica. Ajuste a frequÃƒÂ¯Ã‚Â¿Ã‚Â½ncia de postagens semanais e descubra o impacto cumulativo projetado no LinkedIn e Instagram para a sua marca B2B ou Perfil MÃƒÂ¯Ã‚Â¿Ã‚Â½dico.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Controls */}
            <div className="lg:col-span-5 bg-charcoal-900/60 border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-6">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold block pb-3 border-b border-white/[0.05]">
                  FrequÃƒÂªncia Semanal Estimada:
                </span>

                {/* LinkedIn Frequency Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider block">
                    FrequÃƒÂªncia LinkedIn (Artigos/Posts):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "1x", name: "1x / sem" },
                      { id: "3x", name: "3x / sem" },
                      { id: "5x", name: "5x / sem" }
                    ].map((freq) => {
                      const isSelected = freq.id === "3x";
                      return (
                        <button
                          key={freq.id}
                          id={"btn-lk-" + freq.id}
                          onClick={() => {
                            (window as any)._linkedinFreq = freq.id;
                            document.querySelectorAll(".lk-btn").forEach((btn: any) => {
                              btn.className = "lk-btn py-2.5 text-center text-xs font-sans rounded-lg border cursor-pointer " + 
                                (btn.id === "btn-lk-" + freq.id ? "bg-brand-secondary/10 border-brand-secondary text-brand-secondary" : "bg-white/[0.01] border-white/5 text-zinc-400");
                            });
                            // Trigger calculation
                            (window as any)._updateSocialSim && (window as any)._updateSocialSim();
                          }}
                          className={`lk-btn py-2.5 text-center text-xs font-sans rounded-lg border cursor-pointer ${
                            isSelected ? "bg-brand-secondary/10 border-brand-secondary text-brand-secondary" : "bg-white/[0.01] border-white/5 text-zinc-400"
                          }`}
                        >
                          {freq.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Instagram Reels Frequency Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider block">
                    FrequÃƒÂªncia Instagram / TikTok (Vadeos Reels):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "2x", name: "2x / sem" },
                      { id: "4x", name: "4x / sem" },
                      { id: "7x", name: "Diario" }
                    ].map((freq) => {
                      const isSelected = freq.id === "4x";
                      return (
                        <button
                          key={freq.id}
                          id={"btn-in-" + freq.id}
                          onClick={() => {
                            (window as any)._instaFreq = freq.id;
                            document.querySelectorAll(".in-btn").forEach((btn: any) => {
                              btn.className = "in-btn py-2.5 text-center text-xs font-sans rounded-lg border cursor-pointer " + 
                                (btn.id === "btn-in-" + freq.id ? "bg-brand/10 border-brand text-white" : "bg-white/[0.01] border-white/5 text-zinc-400");
                            });
                            // Trigger calculation
                            (window as any)._updateSocialSim && (window as any)._updateSocialSim();
                          }}
                          className={`in-btn py-2.5 text-center text-xs font-sans rounded-lg border cursor-pointer ${
                            isSelected ? "bg-brand/10 border-brand text-white" : "bg-white/[0.01] border-white/5 text-zinc-400"
                          }`}
                        >
                          {freq.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content Pillar Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider block">
                    Linha Editorial Principal de NegÃƒÂ³cios:
                  </label>
                  <select 
                    id="editorial-pillar"
                    onChange={() => {
                      (window as any)._updateSocialSim && (window as any)._updateSocialSim();
                    }}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-zinc-300 font-sans focus:outline-none focus:border-brand"
                  >
                    <option value="tech">Autoridade TÃƒÂ©cnica (Estudos Cientaficos e Engenharia)</option>
                    <option value="behind">Bastidores Premium (Rotina Corporativa e Clientes Reais)</option>
                    <option value="sales">Venda Direta / Casos de Sucesso Comerciais</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-2">
                <div className="flex items-center gap-2 text-brand">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider">Distribuiaao Inteligente TAG08</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  Nas nÃƒÂ£o apenas criamos artes bonitas. Nas estruturamos de forma ativa o tom de voz sÃƒÂªnior, criamos roteiros, fazemos a curadoria visual e cuidamos da distribuiÃƒÂ§ÃƒÂ£o orgÃƒÂ¢nica e paga para que sua marca tenha falado comercial constante.
                </p>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-7 bg-[#09090b] border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-6 w-full">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold block">
                  Calculo de Funil Social Projetado (Mensal):
                </span>

                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="font-mono text-[8px] text-zinc-500 uppercase font-black block">Impressaes Organicas / Mas</span>
                    <p id="sim-impressions" className="text-3xl font-display font-black text-white">42.400</p>
                    <span className="text-[9.5px] text-zinc-400 block leading-tight font-sans">
                      VisualizaÃƒÂ§ÃƒÂµes de suas postagens no feed orgÃƒÂ¢nico.
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="font-mono text-[8px] text-zinc-500 uppercase font-black block">Novos Visitantes de Perfil</span>
                    <p id="sim-growth" className="text-3xl font-display font-black text-brand">2.120</p>
                    <span className="text-[9.5px] text-zinc-400 block leading-tight font-sans">
                      EmpresÃƒÂ¡rios e potenciais parceiros acessando seu hub.
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-brand-secondary/[0.02] border border-brand-secondary/10 space-y-1">
                    <span className="font-mono text-[8px] text-brand-secondary/80 uppercase font-black block">Leads de Alto Padrao (SQL)</span>
                    <p id="sim-leads" className="text-3xl font-display font-black text-brand-secondary">18</p>
                    <span className="text-[9.5px] text-zinc-400 block leading-tight font-sans">
                      Contatos ultra-qualificados agendando reuniÃƒÂµes.
                    </span>
                  </div>
                </div>

                {/* Monthly Editorial Grid Preview */}
                <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold block">SimulaÃƒÂ§ÃƒÂ£o de Grid do Feed Comercial</span>
                    <span className="font-sans text-[9px] text-zinc-500">Mas 01 (Preview do Planejamento)</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { week: "W1", name: "Analise Cientafica", tag: "AUTORIDADE" },
                      { week: "W1", name: "Estudo de Caso", tag: "PROVA SOCIAL" },
                      { week: "W2", name: "Entrevista de Time", tag: "BASTIDORES" },
                      { week: "W2", name: "VisÃƒÂ£o de Vanguarda", tag: "CONCEITO" },
                      { week: "W3", name: "Diagnastico Clanico", tag: "CONCEITO" },
                      { week: "W3", name: "Venda Direta", tag: "OFERTA" },
                      { week: "W4", name: "Processo Interno", tag: "BASTIDORES" },
                      { week: "W4", name: "Atendimento Vip", tag: "RELAÃƒÂ§ÃƒÂµes" }
                    ].map((cell, idx) => (
                      <div key={idx} className="p-3 bg-zinc-950/80 border border-white/5 rounded-xl space-y-1.5 text-left relative overflow-hidden">
                        <span className="font-sans text-[6.5px] text-zinc-500 font-bold block">{cell.week} // {cell.tag}</span>
                        <p className="text-white text-[9.5px] font-sans font-bold leading-tight line-clamp-2">{cell.name}</p>
                        <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden mt-2">
                          <div className="bg-brand-secondary h-full" style={{ width: `${Math.round(40 + Math.random() * 50)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* JS Dynamic logic mounting on load or trigger */}
              <script dangerouslySetInnerHTML={{
                __html: `
                  (function() {
                    window._updateSocialSim = function() {
                      const lk = window._linkedinFreq || "3x";
                      const insta = window._instaFreq || "4x";
                      const pillar = document.getElementById("editorial-pillar")?.value || "tech";

                      let lkMul = lk === "1x" ? 1.0 : lk === "3x" ? 2.8 : 4.5;
                      let insMul = insta === "2x" ? 1.5 : insta === "4x" ? 3.2 : 5.8;
                      let pillarMul = pillar === "tech" ? 1.2 : pillar === "behind" ? 1.0 : 0.8;

                      // Calculate
                      const baseImpressions = Math.round((lkMul * 8000 + insMul * 12000) * pillarMul);
                      const baseProfile = Math.round(baseImpressions * 0.05 * (pillar === "behind" ? 1.15 : 1.0));
                      const baseLeads = Math.round(baseProfile * 0.008 * (pillar === "sales" ? 1.3 : pillar === "tech" ? 1.1 : 0.8));

                      const impEl = document.getElementById("sim-impressions");
                      const groEl = document.getElementById("sim-growth");
                      const leaEl = document.getElementById("sim-leads");

                      if (impEl) impEl.innerText = baseImpressions.toLocaleString("pt-BR");
                      if (groEl) groEl.innerText = baseProfile.toLocaleString("pt-BR");
                      if (leaEl) leaEl.innerText = Math.max(2, baseLeads).toString();
                    };
                    setTimeout(() => {
                      window._updateSocialSim && window._updateSocialSim();
                    }, 500);
                  })();
                `
              }} />

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 mt-6">
                <span className="font-mono text-[8px] text-zinc-600">PROJEÃƒÂ§ÃƒÂµes DE CONVERsÃƒÂ£o BASEADAS EM CAMPANHAS REALIZADAS TAG08 // 2026</span>
                <button 
                  onClick={() => onNavigate("/contato")}
                  className="text-xs font-mono text-brand font-black uppercase hover:underline flex items-center gap-1.5 cursor-pointer focus:outline-none"
                >
                  Agendar SessÃƒÂ£o EstratÃƒÂ©gica <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* INTERACTIVE INNOVATION: SIMULADOR DE DIAGNÓSTICO EDITORIAL */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-950 text-left relative overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-brand/[0.01] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              Diagnóstico editorial
            </span>
            <h2 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
              O que está travando sua presença nas redes?
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
              Nem sempre o problema é postar pouco. Muitas vezes a presença digital trava por falta de linha editorial, frequência possível, clareza de mensagem, consistência visual ou processo de aprovação.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Controls */}
            <div className="lg:col-span-5 bg-charcoal-900/60 border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-6">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold block pb-3 border-b border-white/[0.05]">
                  Sinais de diagnóstico:
                </span>

                <div className="space-y-3">
                  <p className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider block">
                    1) Sua marca tem uma linha editorial clara?
                  </p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Temas, mensagens e formatos estão organizados antes da produção?
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "q1-yes", name: "Sim", value: "high" },
                      { id: "q1-mid", name: "Em construção", value: "mid" },
                      { id: "q1-no", name: "Não", value: "low" }
                    ].map((opt) => {
                      return (
                        <button
                          key={opt.id}
                          id={opt.id}
                          onClick={() => {
                            (window as any)._qEditorial = opt.value;
                            document.querySelectorAll(".q1-btn").forEach((btn: any) => {
                              btn.className = "q1-btn py-2.5 text-center text-xs font-sans rounded-lg border cursor-pointer " +
                                (btn.id === opt.id ? "bg-brand-secondary/10 border-brand-secondary text-brand-secondary" : "bg-white/[0.01] border-white/5 text-zinc-400");
                            });
                            (window as any)._updateSocialSim && (window as any)._updateSocialSim();
                          }}
                          className="q1-btn py-2.5 text-center text-xs font-sans rounded-lg border cursor-pointer bg-white/[0.01] border-white/5 text-zinc-400"
                        >
                          {opt.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider block">
                    2) A frequência atual é sustentável?
                  </p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    A rotina de conteúdo respeita a capacidade real de criação, aprovação e publicação?
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "q2-yes", name: "Sim", value: "high" },
                      { id: "q2-mid", name: "Parcial", value: "mid" },
                      { id: "q2-no", name: "Não", value: "low" }
                    ].map((opt) => {
                      return (
                        <button
                          key={opt.id}
                          id={opt.id}
                          onClick={() => {
                            (window as any)._qFrequencia = opt.value;
                            document.querySelectorAll(".q2-btn").forEach((btn: any) => {
                              btn.className = "q2-btn py-2.5 text-center text-xs font-sans rounded-lg border cursor-pointer " +
                                (btn.id === opt.id ? "bg-brand/10 border-brand text-white" : "bg-white/[0.01] border-white/5 text-zinc-400");
                            });
                            (window as any)._updateSocialSim && (window as any)._updateSocialSim();
                          }}
                          className="q2-btn py-2.5 text-center text-xs font-sans rounded-lg border cursor-pointer bg-white/[0.01] border-white/5 text-zinc-400"
                        >
                          {opt.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider block">
                    3) O visual comunica a mesma marca?
                  </p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    As peças mantêm consistência de identidade, hierarquia e percepção profissional?
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "q3-yes", name: "Sim", value: "high" },
                      { id: "q3-mid", name: "Em construção", value: "mid" },
                      { id: "q3-no", name: "Não", value: "low" }
                    ].map((opt) => {
                      return (
                        <button
                          key={opt.id}
                          id={opt.id}
                          onClick={() => {
                            (window as any)._qVisual = opt.value;
                            document.querySelectorAll(".q3-btn").forEach((btn: any) => {
                              btn.className = "q3-btn py-2.5 text-center text-xs font-sans rounded-lg border cursor-pointer " +
                                (btn.id === opt.id ? "bg-brand-secondary/10 border-brand-secondary text-brand-secondary" : "bg-white/[0.01] border-white/5 text-zinc-400");
                            });
                            (window as any)._updateSocialSim && (window as any)._updateSocialSim();
                          }}
                          className="q3-btn py-2.5 text-center text-xs font-sans rounded-lg border cursor-pointer bg-white/[0.01] border-white/5 text-zinc-400"
                        >
                          {opt.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider block">
                    4) O conteúdo ajuda o público a entender a oferta?
                  </p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    As publicações conduzem para clareza, confiança e próximo passo ou apenas ocupam o feed?
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "q4-yes", name: "Sim", value: "high" },
                      { id: "q4-mid", name: "Parcial", value: "mid" },
                      { id: "q4-no", name: "Não", value: "low" }
                    ].map((opt) => {
                      return (
                        <button
                          key={opt.id}
                          id={opt.id}
                          onClick={() => {
                            (window as any)._qOferta = opt.value;
                            document.querySelectorAll(".q4-btn").forEach((btn: any) => {
                              btn.className = "q4-btn py-2.5 text-center text-xs font-sans rounded-lg border cursor-pointer " +
                                (btn.id === opt.id ? "bg-brand/10 border-brand text-white" : "bg-white/[0.01] border-white/5 text-zinc-400");
                            });
                            (window as any)._updateSocialSim && (window as any)._updateSocialSim();
                          }}
                          className="q4-btn py-2.5 text-center text-xs font-sans rounded-lg border cursor-pointer bg-white/[0.01] border-white/5 text-zinc-400"
                        >
                          {opt.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider block">
                    5) Existe processo de revisão e melhoria?
                  </p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    A marca aprende com o que publica ou apenas repete formatos sem critério?
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "q5-yes", name: "Sim", value: "high" },
                      { id: "q5-mid", name: "Parcial", value: "mid" },
                      { id: "q5-no", name: "Não", value: "low" }
                    ].map((opt) => {
                      return (
                        <button
                          key={opt.id}
                          id={opt.id}
                          onClick={() => {
                            (window as any)._qProcesso = opt.value;
                            document.querySelectorAll(".q5-btn").forEach((btn: any) => {
                              btn.className = "q5-btn py-2.5 text-center text-xs font-sans rounded-lg border cursor-pointer " +
                                (btn.id === opt.id ? "bg-brand-secondary/10 border-brand-secondary text-brand-secondary" : "bg-white/[0.01] border-white/5 text-zinc-400");
                            });
                            (window as any)._updateSocialSim && (window as any)._updateSocialSim();
                          }}
                          className="q5-btn py-2.5 text-center text-xs font-sans rounded-lg border cursor-pointer bg-white/[0.01] border-white/5 text-zinc-400"
                        >
                          {opt.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-2">
                <div className="flex items-center gap-2 text-brand">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider">
                    Leitura editorial ativa
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  O diagnóstico não define destino, ele organiza decisão. O objetivo é reduzir ruído, clarear prioridades e transformar presença em direção.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#09090b] border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-6 w-full">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold block">
                  Diagnóstico inicial de presença:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="font-mono text-[8px] text-zinc-500 uppercase font-black block">Leitura atual</span>
                    <p id="sim-overall-level" className="text-2xl sm:text-3xl font-display font-black text-white">Presença sem direção clara</p>
                    <span className="text-[9.5px] text-zinc-400 block leading-tight font-sans">
                      Leitura inicial de maturidade editorial.
                    </span>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="font-mono text-[8px] text-zinc-500 uppercase font-black block">Risco principal</span>
                    <p id="sim-main-risk" className="text-2xl sm:text-3xl font-display font-black text-brand">Linha editorial em construção</p>
                    <span className="text-[9.5px] text-zinc-400 block leading-tight font-sans">
                      Ponto mais provável de travamento.
                    </span>
                  </div>
                  <div className="p-5 rounded-2xl bg-brand-secondary/[0.02] border border-brand-secondary/10 space-y-1">
                    <span className="font-mono text-[8px] text-brand-secondary/80 uppercase font-black block">Próximo passo</span>
                    <p id="sim-next-step" className="text-2xl sm:text-3xl font-display font-black text-brand-secondary">Rotina editorial parcialmente organizada</p>
                    <span className="text-[9.5px] text-zinc-400 block leading-tight font-sans">
                      Ajustes iniciais para manter consistência.
                    </span>
                  </div>
                </div>

                <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold block">Leitura do padrão editorial</span>
                    <span className="font-sans text-[9px] text-zinc-500">Mapeamento em andamento</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { week: "Q1", name: "Posicionamento", tag: "BASE" },
                      { week: "Q1", name: "Mensagem", tag: "CLAREZA" },
                      { week: "Q2", name: "Frequência", tag: "ROTINA" },
                      { week: "Q2", name: "Identidade", tag: "CONSISTÊNCIA" },
                      { week: "Q3", name: "Oferta", tag: "PROPOSITO" },
                      { week: "Q3", name: "Canal", tag: "ALINHAMENTO" },
                      { week: "Q4", name: "Revisão", tag: "MELHORIA" },
                      { week: "Q4", name: "Ajustes", tag: "PRÓXIMOS PASSOS" }
                    ].map((cell, idx) => (
                      <div key={idx} className="p-3 bg-zinc-950/80 border border-white/5 rounded-xl space-y-1.5 text-left relative overflow-hidden">
                        <span className="font-sans text-[6.5px] text-zinc-500 font-bold block">{cell.week} // {cell.tag}</span>
                        <p className="text-white text-[9.5px] font-sans font-bold leading-tight line-clamp-2">{cell.name}</p>
                        <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden mt-2">
                          <div className="bg-brand-secondary h-full sim-progress-segment" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p id="sim-summary-text" className="text-zinc-400 text-xs leading-relaxed mt-6">
                Essa leitura não substitui um diagnóstico completo, mas ajuda a identificar se o próximo passo deve ser organizar linha editorial, ajustar frequência, revisar identidade visual, melhorar processo ou integrar conteúdo com estratégia comercial.
              </p>

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 mt-6">
                <span className="font-mono text-[8px] text-zinc-600">DIAGNÓSTICO EDITORIAL // SIMULADOR</span>
                <button
                  onClick={() => onNavigate("/contato")}
                  className="text-xs font-mono text-brand font-black uppercase hover:underline flex items-center gap-1.5 cursor-pointer focus:outline-none"
                >
                  SOLICITAR DIAGNÓSTICO EDITORIAL <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    (function() {
                      const scoreMap = {
                        high: 2,
                        mid: 1,
                        low: 0,
                      };

                      const labels = [
                        "Presença sem direção clara",
                        "Linha editorial em construção",
                        "Rotina editorial parcialmente organizada",
                        "Presença consistente, pronta para evoluir",
                      ];

                      const getLevel = (score) => {
                        if (score >= 8) return labels[3];
                        if (score >= 5) return labels[2];
                        if (score >= 2) return labels[1];
                        return labels[0];
                      };

                      window._updateSocialSim = function() {
                        const score = (scoreMap[(window as any)._qEditorial || "mid"] || 0) +
                          (scoreMap[(window as any)._qFrequencia || "mid"] || 0) +
                          (scoreMap[(window as any)._qVisual || "mid"] || 0) +
                          (scoreMap[(window as any)._qOferta || "mid"] || 0) +
                          (scoreMap[(window as any)._qProcesso || "mid"] || 0);

                        const lowCount = [
                          (window as any)._qEditorial,
                          (window as any)._qFrequencia,
                          (window as any)._qVisual,
                          (window as any)._qOferta,
                          (window as any)._qProcesso,
                        ].filter((value) => value === "low").length;

                        const overall = getLevel(score);
                        const risk = lowCount >= 2 ? "Risco de execução sem direção" : "Risco parcial de priorização";
                        const nextStep = score >= 8
                          ? "Presença consistente, pronta para evoluir"
                          : score >= 5
                          ? "Organizar processo e revisão"
                          : score >= 2
                          ? "Reconstruir linha editorial"
                          : "Reorganizar prioridades e frequência";

                        const levelEl = document.getElementById("sim-overall-level");
                        const riskEl = document.getElementById("sim-main-risk");
                        const nextStepEl = document.getElementById("sim-next-step");
                        const segments = document.querySelectorAll(".sim-progress-segment");
                        const width = Math.max(12, Math.min(100, 18 + (score * 9)));

                        if (levelEl) levelEl.innerText = overall;
                        if (riskEl) riskEl.innerText = risk;
                        if (nextStepEl) nextStepEl.innerText = nextStep;

                        segments.forEach((segment, index) => {
                          const shift = (index % 4) * 5;
                          segment.style.width = Math.max(8, Math.min(100, width - shift)) + "%";
                        });
                      };

                      setTimeout(() => {
                        window._updateSocialSim && window._updateSocialSim();
                      }, 250);
                    })();
                  `,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SHORTS & BASTIDORES PRODUCTION SHOWCASE */}
      <section className="px-4 sm:px-6 md:px-8 py-20 border-b border-white/[0.04] bg-charcoal-900/20 text-left relative overflow-hidden">
        {/* Background visual accents */}
        <div className="absolute top-1/4 right-[10%] w-[350px] h-[350px] bg-brand/[0.01] rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-secondary/15 border border-brand-secondary/20 text-brand-secondary font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono">
                FORMATOS AUDIOVISUAIS // TAG08
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white leading-none tracking-tighter uppercase">
                Vídeos curtos, bastidores e recortes com função editorial.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                Quando fazem sentido para a estratégia, vídeos curtos, bastidores, falas e recortes ajudam a tornar a presença da marca mais humana, clara e recorrente nas redes sociais.
              </p>
            </div>
          </div>

          {/* Interactive Shorts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shortsData.map((item) => (
              <motion.div
                key={item.id}
                onMouseEnter={() => setHoveredShort(item.id)}
                onMouseLeave={() => setHoveredShort(null)}
                onClick={() => setSelectedShort(item)}
                className="group relative aspect-[9/16] bg-zinc-900 rounded-3xl overflow-hidden border border-white/[0.06] hover:border-brand-secondary/55 hover:shadow-[0_20px_50px_rgba(var(--color-brand-secondary-rgb),0.06)] transition-all duration-500 cursor-pointer flex flex-col justify-between"
                whileHover={{ y: -6 }}
              >
                {/* Autoplayers or thumb posters */}
                <div className="absolute inset-0 z-0">
                  {hoveredShort === item.id ? (
                    <video
                      src={item.videoUrl}
                      muted
                      playsInline
                      autoPlay
                      loop
                      className="w-full h-full object-cover brightness-[0.8] transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full relative">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover brightness-[0.7] transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  {/* Dark Vignette Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40 pointer-events-none" />
                </div>

                {/* Top Details (Duration & Category) */}
                <div className="relative z-10 p-5 flex justify-between items-center">
                  <span className="font-mono text-[9px] font-black tracking-widest text-brand-secondary bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/5 uppercase">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/5 font-sans text-[9.5px]">
                    <Clock className="w-3 h-3 text-brand-secondary shrink-0" />
                    <span>{item.duration}</span>
                  </div>
                </div>

                {/* Center Hover Action Indicator */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: hoveredShort === item.id ? 1 : 0.8, 
                      opacity: hoveredShort === item.id ? 1 : 0 
                    }}
                    className="w-12 h-12 rounded-full bg-brand-secondary flex items-center justify-center text-black shadow-lg shadow-brand-secondary/20"
                  >
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </motion.div>
                </div>

                {/* Bottom Metadata Block */}
                <div className="relative z-10 p-5 space-y-2 mt-auto">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider block">
                      {item.subtitle}
                    </span>
                    <h3 className="font-display font-bold text-base sm:text-lg text-white leading-tight uppercase group-hover:text-brand-secondary transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-brand-secondary font-black tracking-widest">
                    <span>VER RECORTE</span>
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* IMMERSIVE VERTICAL VIDEO PRESENTATION MODAL */}
      <AnimatePresence>
        {selectedShort && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto bg-black/95 backdrop-blur-xl cursor-zoom-out"
            onClick={() => setSelectedShort(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-5xl bg-[#09090b] border border-white/[0.08] rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh] md:max-h-[85vh] text-left cursor-default overflow-y-auto md:overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Column - Vertical Video Container */}
              <div className="w-full md:w-[42%] aspect-[9/16] md:aspect-auto md:h-full bg-black relative flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-white/[0.06]">
                <video
                  src={selectedShort.videoUrl}
                  muted={soundEnabled}
                  playsInline
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                />

                {/* Video controls / Custom elements overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
                
                {/* Audio Toggle control overlay */}
                <div className="absolute bottom-5 right-5 z-20">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 text-brand-secondary transition-colors flex items-center justify-center cursor-pointer shadow-lg"
                  >
                    {soundEnabled ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5 animate-pulse" />
                    )}
                  </button>
                </div>

                {/* Category indicator label overlays */}
                <div className="absolute top-5 left-5 z-20 flex gap-2">
                  <span className="font-mono text-[8px] sm:text-[9px] font-black tracking-widest text-brand-secondary bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 uppercase">
                    {selectedShort.category}
                  </span>
                </div>
              </div>

              {/* Right Column - Editorial Notes & Formats */}
              <div className="w-full md:w-[58%] p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto h-full max-h-[85vh]">
                
                {/* Header Actions */}
                <div className="flex items-center justify-between pb-6 border-b border-white/5">
                  <div className="space-y-1">
                    <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-black block">
                      FORMATOS AUDIOVISUAIS // TAG08
                    </span>
                    <h3 className="font-display font-black text-xl text-white uppercase tracking-tight font-display">
                      LEITURA EDITORIAL DO RECORTE
                    </h3>
                  </div>
                  
                  {/* Close modal */}
                  <button
                    onClick={() => setSelectedShort(null)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Strategy Details Block */}
                <div className="py-6 space-y-6 flex-grow">
                  <div className="space-y-1.5">
                    <span className="text-brand-secondary text-[10px] font-mono uppercase font-black tracking-wider block">
                      {selectedShort.subtitle}
                    </span>
                    <h2 className="text-white font-display font-medium text-2xl uppercase tracking-tight leading-none font-display">
                      {selectedShort.title}
                    </h2>
                  </div>

                  {/* Behind the scenes tese */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 text-left">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-brand-secondary" />
                        <span className="font-mono text-[9px] text-brand-secondary font-black uppercase tracking-wider">
                          OS BASTIDORES E O CONTEXTO
                        </span>
                      </div>
                      <p className="text-zinc-300 text-xs leading-relaxed font-sans font-medium">
                        {selectedShort.behindTheScenes}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-brand-secondary/[0.01] border border-brand-secondary/10 space-y-1.5 text-left">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-brand-secondary" />
                        <span className="font-mono text-[9px] text-brand-secondary font-black uppercase tracking-wider">
                          FUNCAO EDITORIAL DO RECORTE
                        </span>
                      </div>
                      <p className="text-zinc-300 text-xs leading-relaxed font-sans font-medium">
                        {selectedShort.strategy}
                      </p>
                    </div>
                  </div>

                  {/* In-depth stats row */}
                  <div className="space-y-3">
                    <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-black text-left">
                      FUNCOES EDITORIAIS DO RECORTE:
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex flex-col justify-between text-left">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase font-black">FUNCAO</span>
                        <span className="text-brand-secondary font-display font-black text-[1.4rem] leading-none mt-1">
                          {selectedShort.metrics.reach}
                        </span>
                      </div>
                      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex flex-col justify-between text-left">
                        <span className="font-mono text-[8.5px] text-zinc-500 uppercase font-black">APOIO</span>
                        <span className="text-white font-display font-black text-[1.4rem] leading-none mt-1">
                          {selectedShort.metrics.saves}
                        </span>
                      </div>
                      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex flex-col justify-between text-left">
                        <span className="font-mono text-[8.5px] text-zinc-500 uppercase font-black">PROXIMO PASSO</span>
                        <span className="text-brand-secondary font-display font-black text-[1.4rem] leading-none mt-1">
                          {selectedShort.metrics.directs}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Deliverables lists */}
                  <div className="space-y-2 text-left">
                    <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-black">
                      FORMATOS ENVOLVIDOS PELO PROJETO:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedShort.deliverables.map((del, dIdx) => (
                        <div key={dIdx} className="flex gap-2 items-center text-xs text-zinc-300 font-sans font-medium">
                          <Check className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal CTA footer */}
                <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-grow space-y-1 text-center sm:text-left">
                    <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-wider block font-bold">
                      APOIO EDITORIAL // DISPONIVEL
                    </span>
                    <span className="text-zinc-400 text-[10px] leading-tight block">
                      Quando fizer sentido, esses recortes podem apoiar a linha editorial da marca.
                    </span>
                  </div>

                  <button
                    onClick={() => handleLinkClick("/servicos/producao-audiovisual")}
                    className="w-full sm:w-auto px-6 py-3 bg-brand-secondary hover:bg-brand-dark text-black text-[11px] font-sans font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-[0_12px_35px_rgba(var(--color-brand-secondary-rgb),0.15)] cursor-pointer"
                  >
                    <span>CONHECER PRODUCAO AUDIOVISUAL</span>
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 6 - WORK SYSTEM (WhatsApp official contact block) */}
      <section className="py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          {/* Left Column: Portrait */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[520px]">
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden" />
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
              alt="TAG08 Social Media Specialist" 
              className="absolute inset-0 w-full h-full object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[15%] transition-all duration-500 hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  SISTEMA DE TRABALHO
                </span>
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  TAG08
                </span>
              </div>
              <div className="space-y-1.5 opacity-30 select-none">
                <div className="font-display font-extrabold text-[1.8rem] text-white/40 tracking-widest leading-none uppercase select-none">
                  redes_sociais
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                  linha_editorial
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  fluxo editorial
                </span>
                <span className="font-mono text-[9px] text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  acompanhamento
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
                  SISTEMA DE TRABALHO
                </span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black leading-[0.9] tracking-tighter uppercase font-display">
                COMO CONDUZIMOS A <br />
                GESTAO DE REDES SOCIAIS.
              </h2>
              <p className="text-black/85 text-[11px] sm:text-xs max-w-lg leading-relaxed font-sans font-extrabold uppercase">
                A TAG08 organiza a presenca nas redes com planejamento editorial, producao alinhada, revisao, publicacao e acompanhamento. O objetivo e reduzir improviso e manter a comunicacao coerente com o posicionamento da marca.
              </p>
            </div>

            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 max-w-md relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-4 items-start select-none">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black shrink-0 shadow-lg shadow-brand/10 hover:scale-105 transition-transform duration-200">
                  <ArrowUpRight className="w-5 h-5 rotate-45 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-[8px] text-brand uppercase tracking-wider font-extrabold block">
                    PLANEJAMENTO EDITORIAL
                  </span>
                  <p className="text-white text-xs leading-snug font-sans font-semibold">
                    Definimos temas, mensagens e prioridades antes da producao para orientar a linha editorial.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <a 
                  href={buildBrazilWhatsAppUrl("Ola,%20gostaria%20de%20falar%20com%20a%20TAG08%20sobre%20gestao%20de%20redes%20sociais.")}
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
                          WHATSAPP OFICIAL
                        </span>
                        <span className="text-white text-xs font-mono font-bold tracking-wider group-hover:text-brand transition-colors mt-0.5">
                          +55 83 9.9886-8882
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-brand font-mono font-bold uppercase tracking-wider bg-brand/10 py-1 px-2.5 rounded-lg group-hover:bg-brand group-hover:text-black transition-all">
                      FALAR COM A TAG08
                    </span>
                  </div>
                </a>

                <a 
                  href={buildInternationalWhatsAppUrl("Hello,%20I%20would%20like%20to%20talk%20to%20TAG08%20about%20social%20media%20management.")}
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
                          WHATSAPP INTERNACIONAL
                        </span>
                        <span className="text-white text-xs font-mono font-bold tracking-wider group-hover:text-brand-secondary transition-colors mt-0.5">
                          +56 9 9793 7611
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-brand-secondary font-mono font-bold uppercase tracking-wider bg-brand-secondary/10 py-1 px-2.5 rounded-lg group-hover:bg-brand-secondary group-hover:text-black transition-all">
                      FALAR COM A TAG08
                    </span>
                  </div>
                </a>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                  <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest font-extrabold">
                    TAG08
                  </span>
                </div>
                <span className="font-sans text-[8.5px] text-brand font-bold bg-brand/10 border border-brand/20 px-2 rounded">
                  ATENDIMENTO ONLINE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 - CTA para Landing Comercial - PREMIUM GRAPHIC BLOCK */}
      <section className="py-12 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-900/10 text-left">
        <div className="max-w-7xl mx-auto">
          <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900/50 border border-white/[0.06] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 text-left">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            
            <div className="relative z-10 space-y-2 max-w-2xl">
              <span className="font-mono text-[9px] text-brand-secondary bg-brand-secondary/5 px-2.5 py-0.5 rounded border border-brand-secondary/10 uppercase tracking-widest font-black">PRÓXIMO PASSO</span>
              <h3 className="font-display font-semibold text-xl sm:text-2xl text-white uppercase tracking-tight">Vamos organizar a presença da sua marca nas redes?</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                Antes de propor uma rotina de conteúdo, a TAG08 entende seu posicionamento, seus canais, sua frequência possível e os gargalos que hoje dificultam uma presença mais consistente.
              </p>
            </div>
            
            <button
              onClick={() => {
                onNavigate("/contato");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group relative px-6 py-4 bg-brand-secondary hover:bg-brand-dark text-black text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shrink-0 overflow-hidden shadow-[0_8px_30px_rgba(var(--color-brand-secondary-rgb),0.15)] hover:-translate-y-0.5 relative z-10 cursor-pointer"
            >
              ORGANIZAR MINHA PRESENÇA <ArrowRight className="w-4 h-4 ml-1.5 inline-block group-hover:translate-x-1 transition-transform" />
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
                  DÚVIDAS SOBRE GESTÃO DE REDES
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter uppercase">
                  Antes de contratar, <br />
                  entenda como a gestão funciona.
                </h2>
                <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans max-w-sm">
                  A gestão de redes sociais da TAG08 organiza linha editorial, frequência, formatos, criação, revisão e acompanhamento para construir uma presença mais clara e consistente.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {([
                  { id: 0, title: "GESTÃO DE REDES" },
                  { id: 1, title: "FREQUÊNCIA POSSÍVEL" },
                  { id: 2, title: "CRIAÇÃO DE CONTEÚDO" },
                  { id: 3, title: "VÍDEOS E BASTIDORES" },
                  { id: 4, title: "EXPECTATIVAS E RESULTADO" }
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
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800"
                alt="TAG08 Redes Sociais"
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div className="absolute top-6 left-6 z-10 pointer-events-none font-mono text-[8px] text-white/20 uppercase tracking-widest leading-none">
                SYS // SOCIAL_MGMT
              </div>

              <div className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left">
                <span className="font-mono text-[8.5px] text-brand uppercase tracking-widest font-black block">
                  {([
                    "PLANEJAMENTO EDITORIAL",
                    "FREQUÊNCIA POSSÍVEL",
                    "CRIAÇÃO DE CONTEÚDO",
                    "VÍDEOS E BASTIDORES",
                    "EXPECTATIVAS E RESULTADO"
                  ])[activeFaq]}
                </span>
                
                <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {([
                    "A gestão de redes sociais é só fazer posts?",
                    "Preciso postar todos os dias?",
                    "A TAG08 cria os conteúdos?",
                    "A gestão inclui vídeos e bastidores?",
                    "A TAG08 promete alcance ou engajamento?"
                  ])[activeFaq]}
                </h4>
                
                <p className="text-zinc-300 text-xs sm:text-[12.5px] leading-relaxed font-sans font-medium">
                  {([
                    "Não. A gestão envolve linha editorial, calendário, linguagem, criação, direção visual, revisão e acompanhamento. O objetivo é dar função ao conteúdo dentro da estratégia da marca.",
                    "Não necessariamente. A frequência precisa ser possível de sustentar e coerente com o momento da marca. Uma rotina realista costuma ser melhor do que volume sem critério.",
                    "Sim, dentro do escopo contratado. Podemos apoiar temas, legendas, peças, roteiros, formatos e organização editorial conforme a necessidade da marca.",
                    "Pode incluir ou se conectar com produção audiovisual quando isso fizer sentido para a estratégia. Vídeos curtos, bastidores e recortes devem servir à linha editorial, não apenas ocupar espaço.",
                    "Não prometemos alcance, engajamento ou crescimento instantâneo. Trabalhamos para construir clareza, consistência, presença e melhoria contínua com responsabilidade."
                  ])[activeFaq]}
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-bold">COMO AGIMOS</span>
                  <h4 className="text-white font-semibold text-sm leading-snug">Linha editorial, frequência possível e revisão constante.</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    Evitamos improviso e mantemos a presença coerente com o posicionamento da marca.
                  </p>
                </div>
                <button
                  onClick={() => handleLinkClick("/servicos")}
                  className="group flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5"
                >
                  <span>Ver Soluções</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-black/60 uppercase tracking-widest block font-extrabold">PRÓXIMO PASSO</span>
                  <h4 className="text-black font-black text-sm uppercase leading-tight tracking-tight">Quer entender o melhor caminho para sua marca?</h4>
                  <p className="text-black/85 text-[11.5px] font-semibold leading-relaxed font-mono">
                    Fale com a TAG08 para entender se gestão de redes, conteúdo, audiovisual ou outro caminho faz mais sentido agora.
                  </p>
                </div>
                <a
                  href={buildBrazilWhatsAppUrl("Ola,%20gostaria%20de%20entender%20a%20melhor%20forma%20de%20organizar%20a%20presenca%20da%20minha%20marca%20nas%20redes.")}
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

      {/* SECTION 5 - ACTION TRIGGER FOOTER */}
      <section className="px-4 sm:px-6 md:px-8 py-20 text-center space-y-6 max-w-4xl mx-auto">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase leading-none tracking-tighter">
          CONVERSE COM O SEU PERFEITO PÃƒÅ¡BLICO <br />
          <span className="text-brand">E TORNE-SE UMA REFERaNCIA INDISCUTaVEL.</span>
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Garanta que seu canal de redes sociais pare de afastar clientes de alto ticket. Fale com nosso estrategista lÃƒÂ­der e alinhe seu plano de conteÃƒÂºdo sÃƒÂªnior hoje.
        </p>
        <div className="pt-4">
          <button
            onClick={() => handleLinkClick("/contato")}
            className="group bg-brand text-black font-mono font-black text-[10px] uppercase tracking-widest py-4 px-8 rounded-full shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.22)] hover:bg-brand-dark duration-300 transition-all cursor-pointer flex items-center gap-2 mx-auto"
          >
            <span>DISPARAR ESTRATaGIA EDITORIAL SaNIOR</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </section>
    </div>
  );
}
















