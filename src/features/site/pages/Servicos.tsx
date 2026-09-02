import { Check, ArrowRight, ArrowUpRight, Award } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { buildBrazilWhatsAppUrl } from "../../../config/siteNetwork";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";

interface ServicosProps {
  onNavigate: (page: string) => void;
}

export default function Servicos({ onNavigate }: ServicosProps) {
  const [activeFaq, setActiveFaq] = useState(0);

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const SERVICE_DOMAINS = [
    {
      num: "01",
      title: "Presença Digital Recorrente",
      tags: ["Start", "Base", "Performance", "Consistência"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Plano Start", desc: "Estrutura de entrada para quem precisa começar com direção e participa mais ativamente da execução." },
        { name: "Plano Base", desc: "Planejamento e produção mensal para negócios ativos que precisam de consistência." },
        { name: "Plano Performance", desc: "Operação recorrente mais integrada para marcas que precisam de maior profundidade em conteúdo, vídeo, publicação e acompanhamento." }
      ],
      description: "Para profissionais e negócios que precisam organizar uma rotina de comunicação compatível com seu momento, sua maturidade e sua capacidade de participação.",
      ctaLabel: "CONHECER PRESENÇA DIGITAL",
      ctaPage: "/servicos/gestao-de-redes-sociais"
    },
    {
      num: "02",
      title: "Marca e Posicionamento",
      tags: ["Identidade", "Reposicionamento", "Percepção", "Coerência"],
      image: "https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Identidade Visual Digital", desc: "Sistema visual para organizar a expressão da marca nos canais digitais." },
        { name: "Reposicionamento Estratégico", desc: "Leitura e redefinição de percepção, público, proposta de valor, narrativa e direção quando o problema vai além da estética." },
        { name: "Clareza de aplicação", desc: "Definição de critérios para que a direção construída consiga ser aplicada com consistência." }
      ],
      description: "Para marcas cuja expressão visual ou posicionamento já não representam adequadamente o valor, o público ou a fase atual do negócio.",
      ctaLabel: "CONHECER MARCA E POSICIONAMENTO",
      ctaPage: "/servicos/branding-identidade"
    },
    {
      num: "03",
      title: "Produção Audiovisual",
      tags: ["Captação", "Reels", "Direção", "Conteúdo"],
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Captação Audiovisual Profissional", desc: "Planejamento e produção de imagens e falas com direção compatível com o uso previsto." },
        { name: "Edição de Reels", desc: "Transformação de material bruto em conteúdo curto adequado à linha editorial e ao canal." },
        { name: "Conteúdo para especialistas", desc: "Estrutura audiovisual para falas, entrevistas, aulas, bastidores ou conteúdo recorrente." }
      ],
      description: "Para empresas, especialistas e projetos que precisam transformar conhecimento, presença, ambiente ou material bruto em comunicação audiovisual com função definida.",
      ctaLabel: "CONHECER AUDIOVISUAL",
      ctaPage: "/servicos/producao-audiovisual"
    },
    {
      num: "04",
      title: "Web e Unidade Digital",
      tags: ["Sites", "Landing pages", "E-commerce", "Estrutura digital"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Desenvolvimento Web Estratégico", desc: "Sites e páginas construídos a partir de objetivo, público, conteúdo, jornada e função." },
        { name: "Landing pages", desc: "Estruturas específicas para campanhas, ofertas ou objetivos definidos." },
        { name: "Unidade Digital e E-commerce", desc: "Diagnóstico e modelagem da operação antes do desenvolvimento quando a empresa pretende vender online." },
        { name: "Prontidão operacional", desc: "Catálogo, estoque, logística, atendimento, políticas e responsabilidades precisam ser suficientemente claros antes da tecnologia." }
      ],
      description: "Para negócios que precisam de um canal próprio para apresentar, gerar confiança, apoiar conversão ou estruturar uma operação digital.",
      ctaLabel: "CONHECER WEB E UNIDADE DIGITAL",
      ctaPage: "/servicos/desenvolvimento-web"
    }
  ];

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Absolute Ambient Background Lights resembling our modern portfolio pages */}
      <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] bg-brand-secondary/[0.01] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] bg-brand/[0.01] rounded-full blur-[200px] pointer-events-none" />

      {/* Futuristic Floating 3D Graphic Canvas */}
      <Subtle3DCanvas intensity={1.6} className="absolute right-[-12%] top-[3%] w-[520px] h-[520px] opacity-[0.35] mix-blend-screen hidden lg:block pointer-events-none" />

      {/*=========================================
          HERO SECTION: THE GOLD STANDARD HEADER
         =========================================*/}
      <section className="px-4 sm:px-6 md:px-8 py-12 md:py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
                Serviços TAG08
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter">
                Soluções para organizar presença, posicionamento e crescimento com direção.
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
                A TAG08 organiza soluções de presença digital recorrente e projetos estratégicos de marca, conteúdo, audiovisual, web e unidade digital. A recomendação depende do gargalo, da maturidade e da capacidade de execução do negócio.
              </p>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                Antes de indicar uma solução, a TAG08 procura entender o momento atual, o que está travando o avanço e qual estrutura consegue sustentar o próximo passo.
              </p>

              {/* Grid tags of our core expertise */}
              <div className="flex flex-wrap gap-2 pt-2">
                {["Presença", "Marca", "Audiovisual", "Web"].map((tag, idx) => (
                  <span
                    key={idx}
                    className="tag08-meta text-xs tracking-wider uppercase px-3 py-1.5 border border-white/5 rounded-full bg-white/[0.02] text-zinc-300 hover:border-brand/40 hover:text-brand transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => handleLinkClick("/contato")}
                  className="inline-flex items-center justify-center gap-2 bg-brand text-black hover:bg-brand-dark tag08-meta font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-300"
                >
                  QUERO ENTENDER MEU MELHOR CAMINHO
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    const target = document.getElementById("servicos-principais");
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth" });
                      return;
                    }
                    handleLinkClick("/servicos");
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-white/[0.02] border border-white/10 text-white hover:bg-white/[0.08] tag08-meta font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-300"
                >
                  VER SOLUÇÕES
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 w-full">
              <ThreeDimensionalTilt>
                <div className="relative rounded-3xl overflow-hidden bg-charcoal-900 border border-white/[0.08] p-6 sm:p-8 shadow-2xl text-left space-y-6">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand/[0.02] via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                      <span className="tag08-meta text-xs uppercase tracking-widest text-brand-secondary">MAPA DE SOLUÇÕES</span>
                    </div>
                    <span className="font-sans text-xs text-zinc-600">QUATRO CAMINHOS</span>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <h4 className="tag08-meta text-xs text-zinc-500 tracking-widest">Presença</h4>
                        <p className="text-zinc-300 text-xs mt-0.5">Rotina de comunicação compatível com o momento do negócio.</p>
                      </div>
                      <span className="font-display font-black text-3xl text-white">Presença</span>
                    </div>

                    <div className="flex items-baseline justify-between border-t border-white/[0.04] pt-4">
                      <div>
                        <h4 className="tag08-meta text-xs text-zinc-500 tracking-widest">Marca</h4>
                        <p className="text-zinc-300 text-xs mt-0.5">Expressão e posicionamento coerentes com a fase atual.</p>
                      </div>
                      <span className="font-display font-black text-3xl text-brand-secondary">Marca</span>
                    </div>

                    <div className="flex items-baseline justify-between border-t border-white/[0.04] pt-4">
                      <div>
                        <h4 className="tag08-meta text-xs text-zinc-500 tracking-widest">Audiovisual</h4>
                        <p className="text-zinc-300 text-xs mt-0.5">Vídeo com direção e função definida para a comunicação.</p>
                      </div>
                      <span className="font-display font-black text-3xl text-brand">Audiovisual</span>
                    </div>

                    <div className="flex items-baseline justify-between border-t border-white/[0.04] pt-4">
                      <div>
                        <h4 className="tag08-meta text-xs text-zinc-500 tracking-widest">Web</h4>
                        <p className="text-zinc-300 text-xs mt-0.5">Canal próprio para apresentar, converter ou operar no digital.</p>
                      </div>
                      <span className="font-display font-black text-3xl text-white">Web</span>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0">
                      <Award className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h5 className="tag08-meta text-xs font-bold text-white tracking-wider leading-none">Diagnóstico</h5>
                      <p className="text-zinc-400 text-xs mt-1 leading-relaxed">O ponto de partida depende do problema real, não do serviço pedido inicialmente.</p>
                    </div>
                  </div>
                </div>
              </ThreeDimensionalTilt>
            </div>
          </div>
        </div>
      </section>

      {/*=========================================
          INTELLIGENT DIAGNOSTIC PROBLEM MATRIX
         =========================================*/}
      <section className="px-4 sm:px-6 md:px-8 py-20 bg-charcoal-950 text-left relative z-10 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl">
            <div className="space-y-3">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
                Diagnóstico por necessidade
              </span>
              <h3 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tighter">
                O que sua marca precisa organizar agora?
              </h3>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm md:pb-1">
              Nem toda marca precisa começar pelo mesmo serviço. Algumas precisam de clareza de posicionamento, outras de conteúdo, presença visual, estrutura digital ou organização operacional. Esta matriz ajuda a identificar o ponto de partida mais coerente.
            </p>
          </div>

          <div className="border border-white/[0.06] rounded-3xl overflow-hidden divide-y divide-white/[0.05] bg-charcoal-900/30 relative drop-shadow-2xl">
            <div className="absolute inset-0 bg-[#000]/10" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 tag08-meta text-xs text-zinc-500 uppercase tracking-widest bg-charcoal-900/60 font-semibold relative z-10 select-none">
              <div className="md:col-span-6">SINAL DE NECESSIDADE</div>
              <div className="md:col-span-4">PONTO DE PARTIDA TAG08</div>
              <div className="md:col-span-2 text-right hidden md:block">CAMINHO</div>
            </div>

            {[
              {
                problem: "Preciso começar ou organizar uma presença digital recorrente.",
                solution: "Quando a oferta existe, mas conteúdo, frequência, linha editorial e produção ainda dependem de improviso.",
                slug: "/servicos/gestao-de-redes-sociais",
                label: "Presença digital recorrente"
              },
              {
                problem: "Minha marca já não representa bem o momento do negócio.",
                solution: "Quando identidade, percepção, mensagem ou posicionamento precisam acompanhar uma nova fase, público ou proposta de valor.",
                slug: "/servicos/branding-identidade",
                label: "Marca e posicionamento"
              },
              {
                problem: "Preciso transformar conhecimento, presença ou acontecimentos em vídeo.",
                solution: "Quando captação, fala, bastidores ou material bruto precisam ganhar direção e formato para comunicação digital.",
                slug: "/servicos/producao-audiovisual",
                label: "Audiovisual"
              },
              {
                problem: "Meu site ou estrutura digital não acompanha o negócio",
                solution: "Quando a empresa precisa organizar apresentação, credibilidade, conversão ou validar uma estrutura própria para operar no digital.",
                slug: "/servicos/desenvolvimento-web",
                label: "Web e unidade digital"
              },
              {
                problem: "Ainda não sei qual é o principal gargalo.",
                solution: "Quando o problema aparece em várias frentes e ainda não está claro o que precisa vir primeiro.",
                slug: "/contato",
                label: "Diagnóstico inicial"
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 sm:p-7 items-center hover:bg-white/[0.015] transition-all duration-300 relative z-10 group"
              >
                <div className="md:col-span-6 flex gap-4 items-start">
                  <span className="font-sans text-xs text-zinc-600 mt-1 font-bold">[{idx + 1}]</span>
                  <div className="space-y-2">
                    <p className="text-zinc-100 text-xs sm:text-sm font-sans font-semibold leading-relaxed group-hover:text-white transition-colors">
                      {item.problem}
                    </p>
                    <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed group-hover:text-zinc-300 transition-colors max-w-xl">
                      {item.solution}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-4">
                  <span className="inline-flex px-3 py-1.5 rounded-xl bg-brand/5 border border-brand/10 text-brand text-xs tag08-meta font-bold uppercase tracking-tight group-hover:bg-brand group-hover:text-black transition-all duration-300">
                    {item.label}
                  </span>
                </div>

                <div className="md:col-span-2 md:text-right">
                  <button
                    onClick={() => handleLinkClick(item.slug)}
                    className="text-white hover:text-brand-secondary font-sans text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5 group/btn transition-colors cursor-pointer"
                  >
                    VER CAMINHO <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform text-brand-secondary" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*==========================================================
          THE HEROIC LIST: "DISCOVER OUR DIGITAL SOLUTIONS" (01 to 05)
         ==========================================================*/}
      <section id="servicos-principais" className="px-4 sm:px-6 md:px-8 py-20 relative z-10 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-semibold bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              Mapa de soluções
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tighter leading-none">
              Escolha o caminho pelo momento da sua marca.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
              Cada solução da TAG08 responde a um tipo de necessidade: clareza estratégica, presença digital, identidade, conteúdo, audiovisual, tecnologia ou processos. O melhor caminho depende do diagnóstico.
            </p>
          </div>

          <div className="space-y-12 max-w-5xl mx-auto">
            {SERVICE_DOMAINS.map((domain, index) => (
                <div
                  key={index}
                  className="bg-charcoal-900 border border-white/[0.06] rounded-[24px] p-6 sm:p-8 lg:p-12 relative overflow-hidden group hover:border-brand-secondary/20 transition-all duration-300 shadow-xl flex flex-col justify-between"
                >
                  {/* Neon top thin strip glow indicator to add extreme design fidelity */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-secondary/15 to-transparent transition-opacity group-hover:via-brand/45" />
                  
                  {/* Number count and status bar indicators */}
                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-5 mb-6 text-left select-none">
                    <span className="font-display font-black text-3xl sm:text-4xl text-zinc-800 group-hover:text-brand-secondary transition-colors uppercase">
                      {domain.num}.
                    </span>
                    <div className="flex items-center gap-1.5 tag08-meta text-xs text-zinc-500 uppercase tracking-widest">
                      <span>CAMINHO {domain.num}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary/40" />
                    </div>
                  </div>

                  {/* Main content grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Scope, Title, and details */}
                    <div className="lg:col-span-6 space-y-6 text-left">
                      <div className="space-y-3">
                        <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight group-hover:text-brand-secondary transition-colors leading-[1.1]">
                          {domain.title}
                        </h3>
                        
                        {/* Interactive dynamic tags mapping */}
                        <div className="flex flex-wrap gap-1.5">
                          {domain.tags.map((tag, tagIdx) => (
                            <span 
                              key={tagIdx}
                              className="text-xs font-sans font-medium tracking-wide border border-brand-secondary/10 text-brand bg-brand-secondary/[0.02] py-0.5 px-2 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                        {domain.description}
                      </p>

                      {/* Scope Deliverables Bullet List */}
                      <div className="space-y-4 pt-4 border-t border-white/[0.04]">
                        <p className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest leading-none font-bold">
                          Caminhos dentro desta frente
                        </p>
                        <div className="grid gap-3.5 pl-1">
                          {domain.subservices.map((sub, subIdx) => (
                            <div key={subIdx} className="flex gap-3">
                              <div className="mt-1 w-3.5 h-3.5 rounded-full bg-brand-secondary/5 text-brand flex items-center justify-center shrink-0 border border-brand-secondary/15">
                                <Check className="w-2 h-2 text-brand-secondary" />
                              </div>
                              <div>
                                <h4 className="text-white text-xs font-semibold">{sub.name}</h4>
                                <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">{sub.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Primary Navigation CTA and Scope Share */}
                      <div className="pt-6 flex flex-wrap gap-3 items-center">
                        <button
                          onClick={() => handleLinkClick(domain.ctaPage)}
                          className="inline-flex items-center gap-2 bg-white/5 hover:bg-brand hover:text-black border border-white/10 hover:border-brand text-xs text-white tag08-meta font-semibold uppercase tracking-widest py-3 px-6 rounded-xl transition-all duration-300 group/btn shrink-0"
                        >
                          <span>{domain.ctaLabel}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1.5 transition-transform" />
                        </button>
                      </div>

                    </div>

                    {/* Right Column: High Visual Mockup wrapped in subtle physical perspective frames */}
                    <div className="lg:col-span-6 w-full h-full xl:pl-6">
                      <ThreeDimensionalTilt>
                        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[1.5/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group/img">
                          <Image
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            src={domain.image}
                            alt=""
                            className="object-cover grayscale brightness-[0.4] group-hover/img:scale-105 group-hover/img:grayscale-0 group-hover/img:brightness-[0.6] transition-all duration-700 ease-out"
                            referrerPolicy="no-referrer"
                          />
                          {/* Rich overlays */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1.5 rounded-lg text-zinc-400 font-sans text-xs flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-brand" />
                            <span>SOLUÇÃO TAG08</span>
                          </div>
                        </div>
                      </ThreeDimensionalTilt>
                    </div>

                  </div>
                </div>
            ))}
          </div>

        </div>
      </section>

      {/*==========================================================
          THE STRATEGIC MATRIX OF COMBINED VALUE (User Screen 2 Style)
         ==========================================================*/}
      <section className="px-4 sm:px-6 md:px-8 py-20 relative z-10 border-b border-white/[0.04] bg-neutral-900/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-3 text-left max-w-2xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
              Combinação de frentes
            </span>
            <h3 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tighter leading-none">
              Alguns problemas atravessam mais de uma frente.
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Uma única solução pode ser suficiente. Quando o problema envolve mais de uma dimensão, a combinação precisa nascer do diagnóstico — não da tentativa de ampliar o escopo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                title: "Posicionamento + presença recorrente",
                desc: "Quando a marca precisa organizar mensagem e percepção antes de sustentar uma rotina de comunicação.",
                tag: "Quando fizer sentido"
              },
              {
                title: "Identidade + web",
                desc: "Quando expressão visual e estrutura digital precisam evoluir de forma coerente.",
                tag: "Quando fizer sentido"
              },
              {
                title: "Audiovisual + presença recorrente",
                desc: "Quando vídeo precisa fazer parte de uma linha editorial contínua, e não funcionar como produção isolada.",
                tag: "Quando fizer sentido"
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-7 rounded-[24px] bg-charcoal-900 border border-white/[0.05] hover:border-brand/40 hover:bg-white/[0.015] transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[240px] group"
              >
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-sans text-xs text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-0.5 rounded font-black tracking-widest">
                      {item.tag}
                    </span>
                    <span className="font-sans text-xs text-zinc-600">0{idx + 1}</span>
                  </div>
                  <h4 className="text-white text-base sm:text-lg font-display font-bold tracking-tight group-hover:text-brand-secondary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION - WORK SYSTEM (WhatsApp Neon Callout inspired by screenshot) */}
      <section className="py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[520px]">
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden" />
            <Image
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800"
              alt=""
              className="object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[15%] transition-all duration-500 hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between items-start">
                <span className="tag08-meta text-xs text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  CONTEXTO
                </span>
                <span className="font-sans text-xs text-white/40 tracking-wider">
                  DIREÇÃO TAG08
                </span>
              </div>
              <div className="space-y-1.5 opacity-30 select-none">
                <div className="font-display font-extrabold text-[1.8rem] text-white/40 tracking-widest leading-none uppercase select-none">
                  escopo definido
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                  execução acompanhada
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-sans text-xs text-white/40 tracking-wider">
                  EXECUÇÃO
                </span>
                <span className="tag08-meta text-xs text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  ACOMPANHAMENTO
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
                  Como conduzimos o trabalho
                </span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black leading-[0.9] tracking-tighter font-display">
                Da recomendação ao acompanhamento.
              </h2>
              <p className="text-black/85 text-xs sm:text-xs max-w-lg leading-relaxed font-sans font-extrabold uppercase font-bold">
                A TAG08 organiza cada projeto com escopo claro, responsáveis definidos, etapas visíveis e revisões necessárias para que a execução não dependa de improviso.
              </p>
            </div>

            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-5 max-w-2xl relative overflow-hidden text-left font-sans">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {[
                  {
                    title: "Alinhamento",
                    desc: "Entendimento do contexto, dos objetivos, das restrições e do que precisa ser priorizado."
                  },
                  {
                    title: "Escopo",
                    desc: "Definição do que será entregue, do que não faz parte do projeto e dos próximos passos."
                  },
                  {
                    title: "Execução",
                    desc: "Produção das entregas combinadas com acompanhamento, revisão e comunicação objetiva."
                  },
                  {
                    title: "Ajustes",
                    desc: "Leitura do que precisa evoluir para manter o trabalho coerente com o momento da marca."
                  }
                ].map((step, idx) => (
                  <div key={idx} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="tag08-meta text-xs text-brand uppercase tracking-wider font-extrabold">
                        0{idx + 1}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-brand-secondary/50" />
                    </div>
                    <h3 className="text-white text-sm font-semibold">{step.title}</h3>
                    <p className="text-zinc-300 text-xs leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex pt-2 relative z-10">
                <button
                  onClick={() => handleLinkClick("/contato")}
                  className="inline-flex items-center justify-center gap-2 bg-brand text-black hover:bg-brand-dark tag08-meta font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-300"
                >
                  FALAR COM A TAG08
                  <ArrowUpRight className="w-3.5 h-3.5" />
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
            {/* Left Column: Title & FAQ Buttons list */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
                  Dúvidas antes de escolher
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter">
                  Entenda como escolher <br />
                  a solução certa.
                </h2>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-sans max-w-sm">
                  A página de Serviços existe para orientar o ponto de partida. A recomendação final depende do momento da marca, dos gargalos atuais e da capacidade de execução.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {([
                  { id: 0, title: "PONTO DE PARTIDA" },
                  { id: 1, title: "SOLUÇÕES" },
                  { id: 2, title: "COMBINAÇÃO" },
                  { id: 3, title: "PROCESSO" },
                  { id: 4, title: "RESULTADOS" }
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

            {/* Middle Column: Cover image */}
            <div className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-white/[0.04] bg-[#0c0c0e]">
              <Image
                fill
                sizes="(max-width: 1024px) 100vw, 34vw"
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"
                alt=""
                className="object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div className="absolute top-6 left-6 z-10 pointer-events-none tag08-meta text-xs text-white/20 uppercase tracking-widest leading-none">
                ORIENTAÇÃO
              </div>

              <div className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left font-sans">
                <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black block">
                  {([
                    "PONTO DE PARTIDA",
                    "SOLUÇÕES",
                    "COMBINAÇÃO",
                    "PROCESSO",
                    "RESULTADOS"
                  ])[activeFaq]}
                </span>

                <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {([
                    "Preciso saber qual serviço contratar antes de falar com a TAG08?",
                    "A TAG08 trabalha com estruturas prontas?",
                    "Posso contratar apenas uma solução?",
                    "Por que o diagnóstico vem antes da proposta?",
                    "A TAG08 garante resultados?"
                  ])[activeFaq]}
                </h4>

                <p className="text-zinc-300 text-xs sm:text-xs leading-relaxed font-sans font-medium">
                  {([
                    "Não. O primeiro passo é entender o momento do negócio e o principal gargalo. A partir disso, a TAG08 avalia se o caminho envolve presença recorrente, marca e posicionamento, audiovisual, web, unidade digital ou uma combinação coerente.",
                    "Existem soluções e produtos definidos, mas a recomendação não é automática. Momento, maturidade, capacidade de investimento e participação necessária do cliente influenciam a indicação.",
                    "Sim. Quando uma única frente resolve o problema identificado, não há motivo para ampliar o escopo. Combinações só fazem sentido quando o diagnóstico mostra dependência entre diferentes necessidades.",
                    "Porque o pedido inicial nem sempre corresponde ao problema real. Diagnóstico reduz risco de escopo errado, expectativa desalinhada e investimento fora de prioridade.",
                    "Não. A TAG08 trabalha com método, direção e execução responsável. Resultado comercial também depende de oferta, mercado, atendimento, operação, investimento e outras variáveis que não estão sob controle de uma única empresa."
                  ])[activeFaq]}
                </p>
              </div>
            </div>

            {/* Right Column: Mini auxiliary action cards */}
            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest block font-bold">CRITÉRIO</span>
                  <h4 className="text-white font-semibold text-sm leading-snug font-display">A solução vem depois do entendimento.</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    O hub apresenta caminhos possíveis. A recomendação final depende de contexto, maturidade e capacidade de execução.
                  </p>
                </div>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-black/60 uppercase tracking-widest block font-extrabold">PRÓXIMO PASSO</span>
                  <h4 className="text-black font-black text-sm leading-tight tracking-tight">O melhor caminho começa pelo entendimento do momento atual.</h4>
                  <p className="text-black/85 text-xs font-semibold leading-relaxed font-sans">
                    A conversa inicial organiza contexto, prioridade e fit antes da proposta.
                  </p>
                </div>
                <a
                  href={buildBrazilWhatsAppUrl("Olá,%20gostaria%20de%20entender%20o%20melhor%20caminho%20para%20minha%20marca!")}
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

      {/*==========================================================
          THE EXECUTIVE CONVICTION CTA PANEL
         ==========================================================*/}
      <section className="px-4 sm:px-6 md:px-8 py-12 relative z-10 animate-fade-in border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto rounded-3xl bg-charcoal-900 border border-white/[0.06] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-left relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary/[0.01] via-transparent to-transparent pointer-events-none" />
          
          <div className="space-y-2">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-semibold bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              Próximo passo
            </span>
            <h3 className="font-display font-medium text-xl sm:text-2xl text-white tracking-tight leading-none">
              A solução certa precisa fazer sentido antes da contratação.
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              A TAG08 procura entender contexto, maturidade, prioridade e capacidade de execução antes de recomendar uma solução.
            </p>
          </div>
          
          <div className="flex shrink-0">
            <button
              onClick={() => handleLinkClick("/contato")}
              className="bg-brand-secondary hover:bg-brand hover:scale-105 duration-300 text-black font-black text-xs font-sans px-7 py-4 rounded-xl transition-all shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.15)] cursor-pointer"
            >
              QUERO ENTENDER MEU MELHOR CAMINHO
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}



