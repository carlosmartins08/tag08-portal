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
    title: "O Segredo do Minimalismo SÃ³brio",
    subtitle: "Bastidores de CriaÃ§Ã£o de Marca SÃªnior",
    category: "Branding & Design",
    duration: "42s",
    videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227e333ef33d97d477e6e5d8a011de&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=600",
    behindTheScenes: "Gravado com luz natural no estÃºdio da TAG08, focado na suavidade das transiÃ§Ãµes e no som ambiente refinado de escrita tÃ¡til (ASMR corporativo). Eliminamos trilhas sonoras genÃ©ricas e agitadas para manter o clima sÃ³brio da marca intelectual do cliente.",
    strategy: "Capturar atenÃ§Ã£o imediata nos primeiros 3 segundos exibindo um caderno Moleskine com esboÃ§os manuais antes de transicionar cirurgicamente para a vetorizaÃ§Ã£o no software CAD/iPad, demonstrando a obsessÃ£o artesanal por trÃ¡s do preÃ§o premium.",
    successMetric: "+45.000 visualizaÃ§Ãµes orgÃ¢nicas nas primeiras 48 horas e 18 leads corporativos entrando em contato na inbox de forma espontÃ¢nea.",
    metrics: {
      reach: "45.2K",
      saves: "411",
      directs: "18"
    },
    deliverables: [
      "DireÃ§Ã£o de arte e curadoria de cores",
      "CaptaÃ§Ã£o em alta resoluÃ§Ã£o (4K 60fps)",
      "EdiÃ§Ã£o rÃ­tmica e color grading cinematogrÃ¡fico",
      "RoteirizaÃ§Ã£o tÃ¡tica baseada em funil de imagem"
    ]
  },
  {
    id: "short-02",
    title: "Um Dia na Rotina de um CirurgiÃ£o SÃªnior",
    subtitle: "ElevaÃ§Ã£o de Imagem na Medicina de Elite",
    category: "Lifestyle Profissional",
    duration: "58s",
    videoUrl: "https://player.vimeo.com/external/435674703.sd.mp4?s=7f60714b9b94091ecf3306ee1b14c1e4004cbe90&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600",
    behindTheScenes: "Grips e enquadramentos imersivos da chegada do mÃ©dico cirurgiÃ£o ao complexo hospitalar de excelÃªncia. O conteÃºdo evita futilidades e foca puramente no prestÃ­gio cirÃºrgico, nas decisÃµes sob pressÃ£o e no cuidado Ã©tico inquestionÃ¡vel.",
    strategy: "Uso de trilhas orquestrais lentas com voz de estÃºdio refinada. A montagem cria um clima de responsabilidade e autoridade acadÃªmica insubstituÃ­vel. O encerramento sutil direciona ao agendamento de consultas exclusivas.",
    successMetric: "Aumento palpÃ¡vel de 350% em cliques orgÃ¢nicos no link de agendamento de consulta particular na biografia, elevando a percepÃ§Ã£o financeira.",
    metrics: {
      reach: "62.8K",
      saves: "582",
      directs: "32"
    },
    deliverables: [
      "Storyboarding estratÃ©gico completo",
      "CaptaÃ§Ã£o tÃ¡tica interna com direÃ§Ã£o",
      "Tratamento sonoro e locuÃ§Ã£o qualificada",
      "Ganchos dialÃ©ticos de alto status"
    ]
  },
  {
    id: "short-03",
    title: "PresenÃ§a de Impacto InstantÃ¢neo em PainÃ©is",
    subtitle: "Captando Ativos de Valor em Eventos Reais",
    category: "Bastidores Corporativos",
    duration: "35s",
    videoUrl: "https://player.vimeo.com/external/403841133.sd.mp4?s=d010d9c4fecd6a56f082e6ea9a75677ff0a65383&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600",
    behindTheScenes: "Acompanhamento dinÃ¢mico discreto de palestrantes e executivos de ponta em painÃ©is. Produzimos captaÃ§Ãµes que evidenciam o network, o palco e o prestÃ­gio pÃºblico da marca sem atrapalhar a dinÃ¢mica do evento.",
    strategy: "CriaÃ§Ã£o de montagens dinÃ¢micas enviadas e publicadas nas redes sociais da empresa apenas 40 minutos apÃ³s a fala final. O contraste de agilidade com design limpo passa uma sensaÃ§Ã£o de controle inabalÃ¡vel.",
    successMetric: "Onboarding qualificado de participantes em tempo real com aumento vertiginoso de networking orgÃ¢nico pÃ³s-painel.",
    metrics: {
      reach: "28.1K",
      saves: "193",
      directs: "11"
    },
    deliverables: [
      "OperaÃ§Ã£o Ã¡gil presencial sem interferÃªncia",
      "EdiÃ§Ã£o 'flash' em tempo real",
      "Copys voltadas a engajamento instantÃ¢neo",
      "Monitoramento de alcance territorial"
    ]
  },
  {
    id: "short-04",
    title: "Por que seu Canva afasta Clientes?",
    subtitle: "Teses de Posicionamento IrreversÃ­veis",
    category: "Design & NegÃ³cios",
    duration: "50s",
    videoUrl: "https://player.vimeo.com/external/517602126.sd.mp4?s=eef87fc4dc8d3df623f9bca7ddaff8e16fd4eb17&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600",
    behindTheScenes: "GravaÃ§Ã£o frontal com contraste de luz dramÃ¡tica de estÃºdio. O especialista posiciona-se de forma direta, emitindo opiniÃµes fortes contra o design clichÃª fofinho de mÃ­dias genÃ©ricas.",
    strategy: "Derrubar crenÃ§as consolidadas logo no inÃ­cio ('posts amigÃ¡veis demais dÃ£o prejuÃ­zo'). Uso de legendas com fontes mono, limpas e geomÃ©tricas que facilitam a leitura rÃ¡pida e retÃªm o usuÃ¡rio atÃ© o final da tese.",
    successMetric: "Compartilhado ativamente por mais de 150 tomadores de decisÃ£o e fundadores nas primeiras semanas do reels.",
    metrics: {
      reach: "78.4K",
      saves: "1.1K",
      directs: "47"
    },
    deliverables: [
      "Pesquisa profunda e embasamento de tese",
      "Metodologia tÃ¡tica de oratÃ³ria verbal",
      "EdiÃ§Ã£o limpa e efeitos visuais tÃ©cnicos",
      "Identidade tipogrÃ¡fica geomÃ©trica"
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
          
          {/* 1. Header Typography block (Ref Style: Expert guidance / tailored solution) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono self-start">
                DIVIsÃ£o DE NARRATIVAS DE CONTEaDO // TAG08
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter uppercase font-display">
                Gestao de redes sociais <br />
                <span className="text-brand">com estratÃ©gia, conteÃºdo e posicionamento.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-sans font-medium">
                Sua marca nÃ£o precisa de posts rasos, calendÃ¡rios genÃ©ricos de datas comemorativas ou artes sem critÃ©rio que enfraquecem a percepÃ§Ã£o do negÃ³cio. Unimos direÃ§Ã£o de arte sÃ³bria, copywriting consistente e planejamento editorial claro para que seus perfis atraiam contatos mais qualificados.
              </p>
            </div>
          </div>

          {/* 2. Panoramic Wide Banner Image with capsule neon overlay trigger wrapped in 3D perspective tilt container */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600"
                alt="DireÃ§Ã£o de Arte e CriaÃ§Ã£o Editorial TAG08"
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
                  <span>REESTRUTURAR MEU FEED</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Absolute indicator tags on corners */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="font-mono text-[8.5px] text-brand-secondary tracking-widest block uppercase font-bold">TAG08 NARRATIVE STUDIO</span>
                  <h4 className="font-display font-black text-white text-xs sm:text-sm uppercase tracking-tight leading-none">Editoriais com Impacto de Marca e Retenaao do Cliente</h4>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-[8px] text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>SOCIAL_CORE // ACTIVED</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* 3. High status core statistics row matching screenshot layout */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">100%</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Curadoria Totalmente Sabria<br/>Desenhada para Seu Pablico</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">3.2x</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Mais QualificaÃ§Ã£o de Leads<br/>nas Conversas de Direct</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">SÃªnior</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Linguagem e Imagem Alinhadas<br/>com Faturamento de Fato</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">30 Dias</span>
              <span className="block text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-normal">Garantia Prapria de<br/>Cronograma Antecipado Estrito</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2 - SEGMENTATION / QUANDO INVESTIR IN SOCIAL MEDIA */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04] bg-charcoal-900/10 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-4 space-y-4">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">POSICIONAMENTO MUDAR RAPIDAMENTE</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-none tracking-tight">
              CHEGA DAS REDES <span className="text-brand">SOCIAIS INFANTIS.</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Descubra por que a presenÃ§a atual de suas mÃ­dias sociais esta gerando ruÃ­dos graves de imagem e perdendo retenaao.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">01 // FIM DO CANVA AMADOR</span>
              <h4 className="text-white font-display font-black text-sm uppercase">Artes genÃ©ricas e coloridas demais</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                PadrÃµes de design desorganizados transmitem imagem de empresa sem direÃ§Ã£o. SubstituÃ­mos posts genÃ©ricos por grades minimalistas e tipografia limpa, coerentes com a marca.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">02 // CONTEaDOS COM VERDADEIRA SUBSTaNCIA</span>
              <h4 className="text-white font-display font-black text-sm uppercase">Chega de dancinhas e clichÃªs de autoajuda</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                O cliente qualificado nÃ£o tem tempo para dicas superficiais. Criamos narrativas tÃ©cnicas que educam sobre problemas profundos e estruturam o valor inquestionÃ­vel da sua soluaao.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">03 // INTELIGaNCIA EDITORIAL ALINHADA</span>
              <h4 className="text-white font-display font-black text-sm uppercase">Sua equipe comercial agradece</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                Alinhamos a copy do Instagram ou LinkedIn ao discurso das suas equipes de vendas, fazendo com que as redes sociais atuem como um pra-filtro passivo que qualifica os leads diariamente.
              </p>
            </div>

            <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl space-y-2 transition-all">
              <span className="font-mono text-[10px] text-brand uppercase font-black tracking-wider block">04 // PRESENaA DIGITAL CONVENIENTE</span>
              <h4 className="text-white font-display font-black text-sm uppercase">Regularidade e constÃ¢ncia de entrega</h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                VocÃª nÃ£o precisa mais se preocupar em lembrar o que postar ou correr no fim do dia gravando Ã s pressas. A equipe de redatores e designers da TAG08 planeja e entrega todo o fluxo com antecedÃªncia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - DELIVERABLES (The "What" with Clean Features Grid) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-bold">SUSTENTaÃ§Ã£o 360a TOTALMENTE GERENCIADA</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">O QUE CONSTRaI O SEU ECOSSISTEMA</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              EsqueÃ§a freelancers amadores que somem ou geram artes feias. Entregamos uma agÃªncia inteira de performance e copy cuidando de cada etapa do seu conteÃºdo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Curadoria Visual</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  DireÃ§Ã£o de arte estrita e refinada utilizando fontes geomÃ©tricas limpas, contrastes de alto impacto e aplicaÃ§Ã£o correta da herÃ¡ldica e branding para impor peso visual imediato.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Copywriting Salida</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Roteiros estruturados de reels, carrossÃ©is educativos com boa profundidade de leitura e legendas sÃ³brias com base em copywriting corporativo, convertendo interaÃ§Ãµes em Direct.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">Direcionamento de Vadeos</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Pautas, ganchos visuais e roteiros completos dinÃ¢micos para vocÃª ou representantes de ponta gravarem reels com maestria, incluindo referancias finas de enquadramento moderno.
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Users className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-display font-black text-sm uppercase">AgÃªnciamento e Post</h4>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                  Agendamento, acompanhamento de hashtags estratÃ©gicas territoriais de SEO e postagens estritas no cronograma diario, deixando vocÃª livre para focar em gerenciar as operaÃ§Ãµes de faturamento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - PLANOS DISPONaVEIS & COPES (Immediate Action Offerings) */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-900/10 text-left">
        <div className="max-w-7xl mx-auto space-y-28">
          
          {/* Seaao Planos Disponaveis */}
          <div className="space-y-12">
            <div className="space-y-3 max-w-3xl">
              <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                DIRECIONAMENTO // PRATELEIRA DE ESCOPOS
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-white leading-tight uppercase">
                Roteiros de ProduÃ§Ã£o de Redes de Alta Autoridade
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl">
                Nossos planos de acompanhamento mensal alinham o seu investimento de posicionamento aos objetivos de retenaao e faturamento da empresa. Escolha sua rota de escala:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {[
                {
                  name: "Plano Start",
                  audience: "EMPREENDEDORES & MEIS",
                  desc: "Estruturamos as bases qualificadas da sua presenÃ§a digital corporativa sem recorrer ao amadorismo visual e de roteiros.",
                  features: ["Planejamento de Pautas Semanais", "Roteiros SÃªnior de Reels", "CarrossÃ©is Educativos Limpos", "Legendas de Alta ConversÃ£o", "Suporte Completo no Onboarding"],
                  badge: "R-01"
                },
                {
                  name: "Plano Base",
                  audience: "MARCAS EM CRESCIMENTO",
                  desc: "Para empresas consolidadas que necessitam de consistancia inabalavel, design premium superior e narrativa de referancia.",
                  features: ["Todos os recursos do Start", "DireÃ§Ã£o Editorial Personalizada", "Identidade Visual de Feed Integrada", "Analise Mensal de Indicadores", "Relatarios Detalhados de Alcance"],
                  featured: true,
                  badge: "R-02"
                },
                {
                  name: "Plano Performance",
                  audience: "LaDERES DE MATURIDADE",
                  desc: "Tratamento profundo focado em clusters de trÃ¡fego, criativos exclusivos, conversÃ£o consistente e pautas estratÃ©gicas.",
                  features: ["Todos os recursos do Base", "Copy de Lanaamentos de Vendas", "Suporte sÃªnior prioritario", "EstruturaÃ§Ã£o de Clusters de Trafego", "Insights e OtimizaÃ§Ãµes de ConversÃ£o"],
                  badge: "R-03"
                }
              ].map((plan, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ y: -6 }}
                  className={`border rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                    plan.featured 
                      ? "bg-neutral-900 border-brand/35 shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.06)]" 
                      : "bg-charcoal-900 border-white/[0.04]"
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute top-0 right-0 bg-brand-secondary text-black font-mono text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl border-l border-b border-brand/20">
                      RECOMENDADO
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[9px] text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2 py-0.5 rounded font-black max-w-max">
                        {plan.audience}
                      </span>
                      <span className="font-sans text-[9px] text-zinc-500 font-bold">{plan.badge}</span>
                    </div>

                    <h3 className="text-white font-display font-medium text-xl uppercase tracking-tight leading-none pt-2">{plan.name}</h3>
                    <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">{plan.desc}</p>
                    
                    <div className="border-t border-white/[0.04] pt-5 space-y-3">
                      <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest font-black block">MaDULOS DE ENTREGA:</span>
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex gap-2.5 items-center text-xs text-zinc-300 font-sans font-medium">
                          <Check className="w-4 h-4 text-brand-secondary shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/[0.04] mt-8 flex items-center justify-between text-[9px] font-sans text-zinc-500">
                    <span>COMPROMISSO MENSAL</span>
                    <span className="text-white font-black uppercase bg-white/5 py-1 px-2 rounded">CANAIS DE ELITE</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Incluso x NÃ£o Incluso */}
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
                Nossa filosofia repudia falsas promessas de escopo infinito sem direÃ§Ã£o tÃ¡tica. Esclarecer com integridade os limites da nossa produÃ§Ã£o corporativa Ã© nossa garantia de sinergia:
              </p>

              <div className="p-5 rounded-2xl bg-brand-secondary/[0.01] border border-white/[0.03] text-xs text-zinc-400 font-sans leading-relaxed">
                Nossa equipe foca estritamente no planejamento, design e rotinas intelectuais. Para gravaÃ§Ã£o fÃ­sica, fornecemos roteiros clÃ­nicos que vocÃª ou seu time gravam de forma descomplicada.
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
                    "Design exclusivo sob Figma para carrossÃ©is",
                    "Legendas magnÃ©ticas para educar o pÃºblico",
                    "Agendamento e automaÃ§Ã£o das postagens"
                  ].map((inc, index) => (
                    <div key={index} className="flex gap-3 text-xs text-zinc-300 font-sans items-start font-medium leading-relaxed font-semibold">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-1.5 shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* NÃ£o incluso */}
              <div className="bg-charcoal-900 border border-white/[0.05] p-7 rounded-3xl space-y-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-zinc-600/30" />
                <span className="font-mono text-[9px] text-zinc-500 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded font-black uppercase inline-block">
                  NaO INCLUaDO NESTA DIVIsÃ£o
                </span>
                
                <div className="space-y-3.5">
                  {[
                    "GravaÃ§Ãµes de camera (deslocamento fasico)",
                    "Oraamento de trafego pago ativo",
                    "InteraÃ§Ãµes de Direct, comentarios e SAC",
                    "Apoio de co-produÃ§Ã£o fÃ­sica presencial",
                    "CriaÃ§Ã£o integral de nova marca/rebranding"
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

          {/* Ciclo Mensal de OperaÃ§Ã£o - CHRONOLOGICAL TIMELINE */}
          <div className="space-y-10 pt-12 border-t border-white/[0.04]">
            <div className="space-y-3">
              <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                METODOLOGIA DE FLUXO
              </span>
              <h3 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
                Nosso Ciclo Mensal SistemÃ¡tico
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl">
                Seguimos um ritmo de planejamento consistente para manter sua grade de canais digitais organizada, previsÃ­vel e sem dependÃªncia de Ãºltima hora:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Briefing & DireÃ§Ã£o", desc: "Alinhamos os seus gatilhos comerciais de ofertas e compromissos do perÃ­odo para mapear os temas do mÃªs." },
                { title: "Desenho e Roteiros", desc: "ConstruÃ­mos as falas e os carrossÃ©is no Notion para revisÃ£o estrutural." },
                { title: "Refinamento Visual", desc: "Criamos as artes estÃ¡ticas limpas exclusivas adequadas ao tom premium e liberamos para validaÃ§Ã£o pÃºblica." },
                { title: "AutomaÃ§Ã£o e AnÃ¡lise", desc: "Agendamos as postagens oficiais e extraÃ­mos mÃ©tricas e insights reais no tÃ©rmino de cada ciclo." }
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
                Monitoramos o seu Crescimento de Forma AnalÃ­tica
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                NÃ£o publicamos criativos por publicar. Acompanhamos indicadores cruciais para depurar o funil comercial e calibrar os desvios editoriais a cada ciclo renovado:
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Alcance Qualificado", desc: "Quantas contas executivas e tomadores de decisÃ£o visualizam sua marca no LinkedIn e Instagram mensalmente." },
                { title: "MÃ©tricas de RetenÃ§Ã£o", desc: "Mapeamos se os carrossÃ©is e vÃ­deos sÃ£o realmente lidos por completo ou abandonados antes do CTA." },
                { title: "AderÃªncia Direta", desc: "Monitoramos o volume real de novos links acessados ou directs que chegam ao comercial provindos espontÃ¢neamente." },
                { title: "CalibraÃ§Ã£o ContÃ­nua", desc: "Ajustamos os ganchos baseando-nos nos dados do perÃ­odo anterior para elevar a conversÃ£o sistÃªmica." }
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
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-3xl">
            <h4 className="text-white font-display font-black text-sm uppercase tracking-tight">MONITORAMENTO DE DADOS E RELATaRIOS MENSAIS SaRIOS</h4>
            <p className="text-zinc-400 text-xs font-sans font-medium leading-relaxed">
              Sem enrolaÃ§Ã£o de mÃ©tricas de vaidade. Mensuramos e apresentamos relatÃ³rios exclusivos focados unicamente no crescimento real de pÃºblico qualificado, cliques efetivos em links de compra e volume real de leads captados atravÃ©s de conversas.
            </p>
          </div>
          <span className="font-mono text-[8.5px] text-brand-secondary uppercase tracking-widest border border-brand-secondary/20 bg-brand-secondary/5 px-3.5 py-2 rounded-xl shrink-0 font-black">
            NATIVE SOCIAL HUB // TAG08
          </span>
        </div>
      </section>

      {/* CASE STUDIES / CLIENTS LOGO SOCIAL PROOF */}
      <MiniCases 
        onNavigate={onNavigate} 
        title="Impacto Editorial e Audiancia Real"
        subtitle="Empresas e mÃ©dicos que escalaram sua representaÃ§Ã£o digital atravÃ©s da curadoria e conteÃºdo qualificado da TAG08."
        badge="REEL & SOCIAL PROOF // MARCAS ATIVAS"
      />

      <MiniCases 
        onNavigate={onNavigate} 
        title="Impacto Editorial e Audiancia Real"
        subtitle="Empresas e mÃ©dicos que escalaram sua representaÃ§Ã£o digital atravÃ©s da curadoria e conteÃºdo qualificado da TAG08."
        badge="REEL & SOCIAL PROOF // MARCAS ATIVAS"
      />

      {/* INTERACTIVE INNOVATION: SIMULADOR DE CRESCIMENTO E EDITORIAL */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-neutral-950 text-left relative overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-brand/[0.01] rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              PLANEJAMENTO ESTRATaGICO // SIMULaÃ§Ã£o CORPORATIVA
            </span>
            <h2 className="font-display font-medium text-3xl text-white uppercase tracking-tight">
              Simulador de Alcance Organico e Funil Social
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
              O alcance orgÃ¢nico sÃªnior Ã© um jogo de regularidade editorial e distribuiÃ§Ã£o de alta qualidade tÃ©cnica. Ajuste a frequÃªncia de postagens semanais e descubra o impacto cumulativo projetado no LinkedIn e Instagram para a sua marca B2B ou Perfil MÃ©dico.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Controls */}
            <div className="lg:col-span-5 bg-charcoal-900/60 border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-6">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold block pb-3 border-b border-white/[0.05]">
                  FrequÃªncia Semanal Estimada:
                </span>

                {/* LinkedIn Frequency Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider block">
                    FrequÃªncia LinkedIn (Artigos/Posts):
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
                    FrequÃªncia Instagram / TikTok (Vadeos Reels):
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
                    Linha Editorial Principal de NegÃ³cios:
                  </label>
                  <select 
                    id="editorial-pillar"
                    onChange={() => {
                      (window as any)._updateSocialSim && (window as any)._updateSocialSim();
                    }}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-zinc-300 font-sans focus:outline-none focus:border-brand"
                  >
                    <option value="tech">Autoridade TÃ©cnica (Estudos Cientaficos e Engenharia)</option>
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
                  Nas nÃ£o apenas criamos artes bonitas. Nas estruturamos de forma ativa o tom de voz sÃªnior, criamos roteiros, fazemos a curadoria visual e cuidamos da distribuiÃ§Ã£o orgÃ¢nica e paga para que sua marca tenha falado comercial constante.
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
                      VisualizaÃ§Ãµes de suas postagens no feed orgÃ¢nico.
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="font-mono text-[8px] text-zinc-500 uppercase font-black block">Novos Visitantes de Perfil</span>
                    <p id="sim-growth" className="text-3xl font-display font-black text-brand">2.120</p>
                    <span className="text-[9.5px] text-zinc-400 block leading-tight font-sans">
                      EmpresÃ¡rios e potenciais parceiros acessando seu hub.
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-brand-secondary/[0.02] border border-brand-secondary/10 space-y-1">
                    <span className="font-mono text-[8px] text-brand-secondary/80 uppercase font-black block">Leads de Alto Padrao (SQL)</span>
                    <p id="sim-leads" className="text-3xl font-display font-black text-brand-secondary">18</p>
                    <span className="text-[9.5px] text-zinc-400 block leading-tight font-sans">
                      Contatos ultra-qualificados agendando reuniÃµes.
                    </span>
                  </div>
                </div>

                {/* Monthly Editorial Grid Preview */}
                <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold block">SimulaÃ§Ã£o de Grid do Feed Comercial</span>
                    <span className="font-sans text-[9px] text-zinc-500">Mas 01 (Preview do Planejamento)</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { week: "W1", name: "Analise Cientafica", tag: "AUTORIDADE" },
                      { week: "W1", name: "Estudo de Caso", tag: "PROVA SOCIAL" },
                      { week: "W2", name: "Entrevista de Time", tag: "BASTIDORES" },
                      { week: "W2", name: "VisÃ£o de Vanguarda", tag: "CONCEITO" },
                      { week: "W3", name: "Diagnastico Clanico", tag: "CONCEITO" },
                      { week: "W3", name: "Venda Direta", tag: "OFERTA" },
                      { week: "W4", name: "Processo Interno", tag: "BASTIDORES" },
                      { week: "W4", name: "Atendimento Vip", tag: "RELAÃ§Ãµes" }
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
                <span className="font-mono text-[8px] text-zinc-600">PROJEÃ§Ãµes DE CONVERsÃ£o BASEADAS EM CAMPANHAS REALIZADAS TAG08 // 2026</span>
                <button 
                  onClick={() => onNavigate("/contato")}
                  className="text-xs font-mono text-brand font-black uppercase hover:underline flex items-center gap-1.5 cursor-pointer focus:outline-none"
                >
                  Agendar SessÃ£o EstratÃ©gica <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHORTS & BASTIDORES PRODUCTION SHOWCASE */}
      <section className="px-4 sm:px-6 md:px-8 py-20 border-b border-white/[0.04] bg-charcoal-900/20 text-left relative overflow-hidden">
        {/* Background visual accents */}
        <div className="absolute top-1/4 right-[10%] w-[350px] h-[350px] bg-brand/[0.01] rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          {/* Header Typography Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-secondary/15 border border-brand-secondary/20 text-brand-secondary font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono">
                CANAIS VERTICAIS // ESTaDIO DE MOVIMENTO TAG08
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white leading-none tracking-tighter uppercase">
                SHOWCASE DE SHORTS & <br />
                <span className="text-brand-secondary">BASTIDORES ESTRUTURADOS.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                Sua marca nÃ£o precisa de futilidade e dancinhas coreografadas para atrair atenÃ§Ã£o. Produzimos narrativas em formato de tela vertical (Shorts e Reels) com boa retenÃ§Ã£o, roteiros sÃªnior e estÃ©tica sÃ³bria de autoridade. Passe o mouse sobre os cards para ver o loop e clique para abrir os bastidores e mÃ©tricas reais de cada peÃ§a de conteÃºdo.
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
                    <span>VER ESTRATaGIA</span>
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

              {/* Right Column - In-depth Strategy & Metrics */}
              <div className="w-full md:w-[58%] p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto h-full max-h-[85vh]">
                
                {/* Header Actions */}
                <div className="flex items-center justify-between pb-6 border-b border-white/5">
                  <div className="space-y-1">
                    <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-black block">
                      DIRETRIZES DO INSTAGRAM & REELS // TAG08 METRICS
                    </span>
                    <h3 className="font-display font-black text-xl text-white uppercase tracking-tight font-display">
                      ANaLISE COGNITIVA SaNIOR
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
                          OS BASTIDORES & CURADORIA FaSICA
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
                          ESTRATaGIA DO GATILHO EDITORIAL (HOOK)
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
                      MaTRICAS NATURAIS ORGaNICAS DO CLIENTE:
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex flex-col justify-between text-left">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase font-black">ALCANCE REAIS</span>
                        <span className="text-brand-secondary font-display font-black text-[1.4rem] leading-none mt-1">
                          {selectedShort.metrics.reach}
                        </span>
                      </div>
                      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex flex-col justify-between text-left">
                        <span className="font-mono text-[8.5px] text-zinc-500 uppercase font-black">SALVAMENTOS</span>
                        <span className="text-white font-display font-black text-[1.4rem] leading-none mt-1">
                          {selectedShort.metrics.saves}
                        </span>
                      </div>
                      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex flex-col justify-between text-left">
                        <span className="font-mono text-[8.5px] text-zinc-500 uppercase font-black">CONVERSAS DM</span>
                        <span className="text-brand-secondary font-display font-black text-[1.4rem] leading-none mt-1">
                          {selectedShort.metrics.directs}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Deliverables lists */}
                  <div className="space-y-2 text-left">
                    <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-black">
                      MaDULOS ENVOLVIDOS PELA AGaNCIA:
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
                      aÃ§Ã£o COMERCIAL IMEDIATA // DISPONÃVEL
                    </span>
                    <span className="text-zinc-400 text-[10px] leading-tight block">
                      Solicite um diagnÃ³stico sÃªnior ou replicamos esse estilo de vÃ­deo para seu negÃ³cio.
                    </span>
                  </div>

                  <a
                    href={buildBrazilWhatsAppUrl(`Ola%20TAG08!%20Estava%20assistindo%20aos%20bastidores%20do%20short%20"${encodeURIComponent(selectedShort.title)}"%20e%20gostaria%20de%20entender%20como%20posso%20estruturar%20vlogs%20e%20shorts%20de%20alta%20estatura%20para%20meu%20projeto.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-brand-secondary hover:bg-brand-dark text-black text-[11px] font-sans font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-[0_12px_35px_rgba(var(--color-brand-secondary-rgb),0.15)] cursor-pointer"
                  >
                    <span>replicar esta estratÃ©gia</span>
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </a>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 6 - WORK SYSTEM (WhatsApp Neon Callout inspired by screenshot) */}
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
                  OPERATIONAL CORE
                </span>
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  TAG08.v3
                </span>
              </div>
              <div className="space-y-1.5 opacity-30 select-none">
                <div className="font-display font-extrabold text-[1.8rem] text-white/40 tracking-widest leading-none uppercase select-none">
                  redes_sociais
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                  posicionamento360_
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  LATENCY: 12MS
                </span>
                <span className="font-mono text-[9px] text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  SaNIOR SECURITY
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
                TRANSFORME SEU FEED <br />
                EM ATRaÃ§Ã£o ATIVA!
              </h2>
              <p className="text-black/85 text-[11px] sm:text-xs max-w-lg leading-relaxed font-sans font-extrabold uppercase">
                ELEVE O NÃVEL DOS SEUS PERFIS COM PROCESSOS EDITORIAIS DE ELITE QUE EDUCAM SEU PÃšBLICO, CONVERSAM DIRETAMENTE COM DECISORES E MANTÃŠM SUA EMPRESA COMO MARCA CLASSE A NA MENTE DO MERCADO.
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
                    ELEVaÃ§Ã£o DE PADRaO
                  </span>
                  <p className="text-white text-xs leading-snug font-sans font-semibold">
                    Substitua o Canva amador por grades minimalistas e narrativas sÃ³brias de alto calibre, aumentando as conversas no Direct.
                  </p>
                </div>
              </div>

              {/* DUAL CLIENT CONNECTION CHANNELS (BR & INT) */}
              <div className="space-y-3">
                <a 
                  href={buildBrazilWhatsAppUrl("Ola,%20gostaria%20de%20solicitar%20um%20diagnÃ³stico%20de%20posicionamento%20para%20minhas%20Redes%20Sociais%20com%20a%20TAG08")}
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
                  href={buildInternationalWhatsAppUrl("Hello,%20I%20would%20like%20to%20request%20a%20social%20media%20strategies%20and%20positioning%20diagnosis%20from%20TAG08")}
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
                    AGaNCIA TAG08
                  </span>
                </div>
                <span className="font-sans text-[8.5px] text-brand font-bold bg-brand/10 border border-brand/20 px-2 rounded">
                  OPERaÃ§Ã£o ATIVA 100% online
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
              <span className="font-mono text-[9px] text-brand-secondary bg-brand-secondary/5 px-2.5 py-0.5 rounded border border-brand-secondary/10 uppercase tracking-widest font-black">CONSULTA DIAGNaSTICA</span>
              <h3 className="font-display font-semibold text-xl sm:text-2xl text-white uppercase tracking-tight">Pronto para estruturar suas redes como canal de vendas?</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                Converse com nossos estrategistas sÃªniores de canais corporativos e solicite uma sessÃ£o diagnÃ³stica de 15 minutos do feed e canal da sua empresa.
              </p>
            </div>
            
            <button
              onClick={() => {
                onNavigate("/contato");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group relative px-6 py-4 bg-brand-secondary hover:bg-brand-dark text-black text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shrink-0 overflow-hidden shadow-[0_8px_30px_rgba(var(--color-brand-secondary-rgb),0.15)] hover:-translate-y-0.5 relative z-10 cursor-pointer"
            >
              Agendar Diagnastico de Feed <ArrowRight className="w-4 h-4 ml-1.5 inline-block group-hover:translate-x-1 transition-transform" />
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
                  DaVIDAS &amp; <br />
                  PROTOCOLO DE REDES
                </h2>
                <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans max-w-sm">
                  Esclareaa as principais dÃºvidas sobre como a TAG08 modela e gerencia seu cronograma editorial de mÃ­dias sociais de alto nÃ­vel.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {([
                  { id: 0, title: "PLANEJAMENTO EDITORIAL" },
                  { id: 1, title: "DIRETRIZ DE GRAVAÃ§Ãµes" },
                  { id: 2, title: "COBERTURA DE PLATAFORMAS" },
                  { id: 3, title: "ONBOARDING INICIAL" }
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
                    "DIRETRIZ DE GRAVAÃ§Ãµes",
                    "COBERTURA DE PLATAFORMAS",
                    "ONBOARDING INICIAL"
                  ])[activeFaq]}
                </span>
                
                <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {([
                    "Como funciona o planejamento de postagens?",
                    "VocÃªs que gravam os vÃ­deos das mÃ­dias?",
                    "O conteÃºdo serve para qualquer rede social?",
                    "Qual o tempo de transiaao operacional?"
                  ])[activeFaq]}
                </h4>
                
                <p className="text-zinc-300 text-xs sm:text-[12.5px] leading-relaxed font-sans font-medium">
                  {([
                    "Planejamos e criamos 100% do conteÃºdo do seu feed com 15 a 30 dias de antecedÃªncia. Isso inclui roteiros de vÃ­deos de alta retenÃ§Ã£o, carrossÃ©is educativos sob medida e legendas persuasivas estruturadas por nossa equipe tÃ©cnica.",
                    "NÃ³s somos responsÃ¡veis pela inteligÃªncia editorial total: escrevemos as pautas cirÃºrgicas, ganchos magnÃ©ticos e roteiros de fala detalhados passo a passo. Os vÃ­deos sÃ£o gravados por vocÃª ou seu representante, seguindo nosso manual estrito de posicionamento e enquadramento de cÃ¢mera.",
                    "Nosso foco principal sÃ£o plataformas de alto alcance qualificado de negÃ³cios e conversÃ£o de leads, como Instagram e LinkedIn. Adaptamos a linguagem conforme a plataforma mantendo a integridade sÃ³bria e corporativa da marca.",
                    "Nosso processo de implantaÃ§Ã£o completo dura atÃ© 7 dias Ãºteis de onboarding. Entramos no seu ecossistema, catalogamos seu tom de voz de especialista e liberamos o primeiro lote de cronogramas editoriais validados."
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
                    Eliminamos posts batidos e cronogramas improvisados. Mantemos constÃ¢ncia e critÃ©rio.
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

              <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-black/60 uppercase tracking-widest block font-extrabold">FALE COM O DIRETOR</span>
                  <h4 className="text-black font-black text-sm uppercase leading-tight tracking-tight">Quer desenhar uma estratÃ©gia sob medida?</h4>
                  <p className="text-black/85 text-[11.5px] font-semibold leading-relaxed font-mono">
                    Fale diretamente com os tomadores de decisÃ£o da TAG08 via WhatsApp para avaliar a viabilidade de alocaÃ§Ã£o de equipe.
                  </p>
                </div>
                <a
                  href={buildBrazilWhatsAppUrl("Ola,%20gostaria%20de%20consultar%20viabilidade%20estratÃ©gica%20especializada%2520para%20minha%20marca!")}
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

      {/* SECTION 5 - ACTION TRIGGER FOOTER */}
      <section className="px-4 sm:px-6 md:px-8 py-20 text-center space-y-6 max-w-4xl mx-auto">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase leading-none tracking-tighter">
          CONVERSE COM O SEU PERFEITO PÃšBLICO <br />
          <span className="text-brand">E TORNE-SE UMA REFERaNCIA INDISCUTaVEL.</span>
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Garanta que seu canal de redes sociais pare de afastar clientes de alto ticket. Fale com nosso estrategista lÃ­der e alinhe seu plano de conteÃºdo sÃªnior hoje.
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













