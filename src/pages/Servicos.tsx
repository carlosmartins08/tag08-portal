import { Check, ArrowRight, ArrowUpRight, ShieldCheck, Cpu, Sparkles, Settings2, Share2, TrendingUp, BarChart3, Award, Copy, Star, Calendar, Video } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl } from "../config/siteNetwork";
import ThreeDimensionalTilt from "../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../components/Subtle3DCanvas";
import MiniCases from "../components/MiniCases";

interface ServicosProps {
  onNavigate: (page: string) => void;
}

type CategoryType = "presence" | "branding" | "performance" | "web" | "processes" | "advisory";

export default function Servicos({ onNavigate }: ServicosProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType | "all">("all");
  const [copiedDomainSlug, setCopiedDomainSlug] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState(0);

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopyDomainScope = (domain: any) => {
    const scopeLines = domain.subservices.map((sub: any) => `- ${sub.name}: ${sub.desc}`).join("\n");
    const textToCopy = `TAG08 - Escopo de Atendimento: ${domain.title}\n${domain.description}\n\nEntregáveis:\n${scopeLines}\n\nPara mais informações, fale com a nossa equipe em tag08.com.br`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedDomainSlug(domain.slug);
      setTimeout(() => {
        setCopiedDomainSlug(null);
      }, 2000);
    }).catch(err => {
      console.warn("Clipboard copy failure: ", err);
    });
  };

  const SERVICE_DOMAINS = [
    {
      num: "01",
      title: "Assessoria de Marketing Estratégico",
      slug: "advisory",
      icon: Award,
      tags: ["CMO Externo", "Auditorias Semanais", "Diagnóstico Inteligente", "Full Scale Strategy"],
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Direção CMO Dedicado", desc: "Acompanhamento de ponta a ponta com um estrategista sênior ditando seu crescimento." },
        { name: "Simulador de Diagnóstico", desc: "Varredura contínua contra ruídos de imagem e vazamentos do funil comercial." },
        { name: "Garantia Estrita de SLA", desc: "Controle executivo absoluto sob prazos de postagem e relatórios." },
        { name: "Business Intelligence Looker", desc: "Transparência total sob o seu investimento em tempo real integrado direto ao seu CRM." },
        { name: "Presença Estética Premium", desc: "Escrita de altíssica convicção e landing pages rápidas em código nativo." }
      ],
      description: "Nossa solução executiva sênior unificada. Tenha nossa direção estratégica, engenharia tática e equipe criativa engajadas em sua marca sob o controle de um estrategista dedicado.",
      ctaPage: "/servicos/assessoria-marketing-digital-estrategico"
    },
    {
      num: "02",
      title: "Presença Digital & Conteúdo",
      slug: "presence",
      icon: Share2,
      tags: ["Redes Sociais B2B", "Produção Audiovisual", "Copywriting de Elite", "Direção de Arte Sóbria"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Gestão de Redes Sociais", desc: "Posicionamento regular no Instagram, LinkedIn e mídias principais." },
        { name: "Planejamento de Conteúdo", desc: "Pautas autorais, estudos de mercado e calendários estruturados." },
        { name: "Produção Audiovisual", desc: "Pós-produção avançada e roteiros de Reels, TikTok e Shorts." },
        { name: "Copywriting de Conversão", desc: "Escrita persuasiva e conceitual para despertar convicção." },
        { name: "Publicação e Monitoramento", desc: "Agendamento tático e respostas consultivas a comentários." }
      ],
      description: "Construção de rotina digital consistente, eliminando o amadorismo e trazendo autoridade inquestionável para seu perfil institucional.",
      ctaPage: "/servicos/gestao-de-redes-sociais"
    },
    {
      num: "03",
      title: "Marca & Posicionamento",
      slug: "branding",
      icon: Sparkles,
      tags: ["Relational Branding", "Identidades Visuais", "Arquitetura Linguística", "Storytelling"],
      image: "https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Branding Conceitual", desc: "Arquitetura linguística e posicionamento perante concorrentes." },
        { name: "Identidade Visual Estratégica", desc: "Design completo de logotipos, manuais tipográficos e paletas sóbrias." },
        { name: "Linha Editorial Personalizada", desc: "Tom de voz, jargões profissionais recomendados e territórios de comunicação." },
        { name: "Narrativa de Marca Coporal", desc: "Storytelling institucional, manifestos de liderança e comunicados." },
        { name: "Campanhas Institucionais", desc: "Design de lançamentos de produtos e ritos corporativos de valor." }
      ],
      description: "Desenvolvimento de marcas refinadas que comunicam liderança de mercado e justificam investimentos de alto ticket antes mesmo do contato comercial.",
      ctaPage: "/servicos/branding-identidade"
    },
    {
      num: "04",
      title: "Performance & Tráfego Pago",
      slug: "performance",
      icon: ShieldCheck,
      tags: ["Meta Ads Sênior", "Google Search", "LinkedIn Ads B2B", "Analytics Transparente"],
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Tráfego Pago Otimizado", desc: "Alocação cirúrgica de verbas publicitárias nas plataformas de alta intenção." },
        { name: "Design de Landing Pages", desc: "Interfaces dinâmicas específicas preparadas cientificamente para conversão." },
        { name: "Campanhas de Leads Qualificados", desc: "Funil integrado de atração desenhado para o público de alto poder aquisitivo." },
        { name: "Relatórios de Dados em Tempo Real", desc: "Dashboards analíticos detalhados com transparência integral de métricas." }
      ],
      description: "Aceleração controlada de leads qualificados. Alocação inteligente de orçamento onde de fato reside seu comprador ideal.",
      ctaPage: "/contato"
    },
    {
      num: "05",
      title: "Estruturas Digitais & Web",
      slug: "web",
      icon: Settings2,
      tags: ["Engenharia Web", "Estética Minimalista", "Otimização de SEO", "Carregamento Instantâneo"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Desenvolvimento de Portais", desc: "Sistemas corporativos nativos, rápidos, codificados do zero absolute sem gargalos." },
        { name: "Landing Pages Institucionais", desc: "Páginas estéticas de alta velocidade otimizadas para captação B2B rápida." },
        { name: "UI/UX Premium Design", desc: "Estudos de usabilidade tática para ampliação de conversão e cadastros." },
        { name: "Integração Segura de Dados", desc: "Conexões seguras com CRMs, APIs do WhatsApp e sistemas legados de dados." }
      ],
      description: "Sistemas e portais de tecnologia avançada com carregamento abaixo de 2 segundos que blindam sua presença digital e convertem contatos.",
      ctaPage: "/servicos/desenvolvimento-web"
    },
    {
      num: "06",
      title: "Processos, Mapeamentos & Organização",
      slug: "processes",
      icon: Cpu,
      tags: ["Process Intelligence", "Process Activation", "Playbooks Notion / Wiki", "Auditoria de Rotinas"],
      image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Process Intelligence", desc: "Assessoria diagnóstica operacional, mapeamento de atividades e gargalos." },
        { name: "Process Activation", desc: "Ensino ativo aplicado diretamente à sua equipe para fixação de rotinas." },
        { name: "Playbooks Operacionais Sólidos", desc: "Wikis internas organizadas e estruturadas escritas em linguagem simples." },
        { name: "Governança de Execução", desc: "Auditoria semanal presencial ou remota dos fluxogramas para evitar retrocessos." }
      ],
      description: "Substitua o estresse e apagamento de incêndios diários por fluxos autônomos. Processos construídos para operarem de forma independente.",
      ctaPage: "/servicos/process-intelligence"
    },
    {
      num: "07",
      title: "Produção Audiovisual & Cobertura",
      slug: "audiovisual",
      icon: Video,
      tags: ["Audiovisual Sênior", "Aftermovies de Elite", "Direção Narrativa", "Cortes de Alta Retenção"],
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Cobertura de Eventos", desc: "Registro estratégico, depoimentos isentos de dor e aftermovie sob medida." },
        { name: "Cortes Rápidos (9:16)", desc: "Formatação 9:16 (Reels/TikTok) com legendas premium dinâmicas." },
        { name: "Vídeos Institucionais", desc: "Manifestos de posicionamento e apresentações executivas elegantes." },
        { name: "Roteirização Técnica", desc: "Mapeamento tático do tom de voz e marcação de cenas antes das gravações." }
      ],
      description: "Transformamos momentos, bastidores, eventos e histórias de marca em conteúdos estratégicos para redes sociais, captação, autoridade b2b e reputação.",
      ctaPage: "/servicos/producao-audiovisual"
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
          {/* Main Hero grid containing title and stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left side text column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono">
                DIREÇÃO INTEGRAL // TAG08
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter uppercase">
                Direção de marca, <br />
                conteúdo e operação.
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
                Estratégia, design e execução para reduzir ruído, organizar a comunicação e aumentar a confiança na decisão.
              </p>

              {/* Grid tags of our premium expertise mimicking user-uploaded wireframes */}
              <div className="flex flex-wrap gap-2 pt-2">
                {["Social Media", "Branding", "Engenharia Web", "Tráfego Sênior", "Processos"].map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="font-mono text-[9px] tracking-wider uppercase px-3 py-1.5 border border-white/5 rounded-full bg-white/[0.02] text-zinc-300 hover:border-brand/40 hover:text-brand transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right side interactive 3D Hero Stats Card mimicking user uploaded design elements */}
            <div className="lg:col-span-5 w-full">
              <ThreeDimensionalTilt>
                <div className="relative rounded-3xl overflow-hidden bg-charcoal-900 border border-white/[0.08] p-6 sm:p-8 shadow-2xl text-left space-y-6">
                  {/* Grid overlay mask */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand/[0.02] via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                  
                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                      <span className="font-mono text-[9px] uppercase tracking-widest text-brand-secondary">DESEMPENHO DO NҚCLEO</span>
                    </div>
                    <span className="font-mono text-[9px] text-zinc-600">TAG08_BOARD</span>
                  </div>

                  <div className="space-y-5">
                    {/* Stat Item 1 */}
                    <div className="flex items-baseline justify-between">
                      <div>
                        <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">NPS CORPORATIVO</h4>
                        <p className="text-zinc-300 text-xs mt-0.5">Sessões de alinhamento e auditoria</p>
                      </div>
                      <span className="font-display font-black text-3xl text-white">98.4%</span>
                    </div>

                    {/* Stat Item 2 */}
                    <div className="flex items-baseline justify-between border-t border-white/[0.04] pt-4">
                      <div>
                        <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Aceleração de Tráfego</h4>
                        <p className="text-zinc-300 text-xs mt-0.5">Retorno médio sob investimento</p>
                      </div>
                      <span className="font-display font-black text-3xl text-brand-secondary">+3.2x</span>
                    </div>

                    {/* Stat Item 3 */}
                    <div className="flex items-baseline justify-between border-t border-white/[0.04] pt-4">
                      <div>
                        <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Velocidade de Código</h4>
                        <p className="text-zinc-300 text-xs mt-0.5">Média de carregamento de páginas</p>
                      </div>
                      <span className="font-display font-black text-3xl text-brand">&lt;1.8s</span>
                    </div>
                  </div>

                  {/* Trust mark badge inside bento */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0">
                      <Award className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h5 className="font-mono text-[9px] font-bold text-white uppercase tracking-wider leading-none">Métricas Comprovadas</h5>
                      <p className="text-zinc-400 text-[9.5px] mt-1 leading-relaxed">Infraestruturas e estratégias validadas em campo operacional pelas principais divisões corporativas.</p>
                    </div>
                  </div>
                </div>
              </ThreeDimensionalTilt>
            </div>

          </div>
        </div>
      </section>

      {/*=========================================
          INFINITE ROTATING MARQUEE BAR WITH TAGS
         =========================================*/}
      <div className="py-5 border-y border-white/[0.04] bg-charcoal-900/40 relative z-20 overflow-hidden select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
          <span className="flex items-center gap-3"><span className="text-brand font-black text-base">*</span> PRESENÒ⬡A DIGITAL INTELIGENTE</span>
          <span className="flex items-center gap-3"><span className="text-brand-secondary font-black text-base">*</span> ENGENHARIA WEB INSTANTNEA</span>
          <span className="flex items-center gap-3"><span className="text-brand font-black text-base">*</span> CONTROL OPERATIONAL SYSTEMS</span>
          <span className="flex items-center gap-3"><span className="text-brand-secondary font-black text-base">*</span> DIRECIONAMENTO CONCEITUAL SÒBRIO</span>
          <span className="flex items-center gap-3"><span className="text-brand font-black text-base">*</span> PROCESS INTELLIGENCE ASSESSMENT</span>
          <span className="flex items-center gap-3"><span className="text-brand-secondary font-black text-base">*</span> METAS ADS B2B DE ELITE</span>
          <span className="flex items-center gap-3"><span className="text-brand font-black text-base">*</span> BRANDING CONCEITUAL SҊNIOR</span>
          
          {/* Repeat once more to secure contiguous slide chain */}
          <span className="flex items-center gap-3"><span className="text-brand font-black text-base">*</span> PRESENÒ⬡A DIGITAL INTELIGENTE</span>
          <span className="flex items-center gap-3"><span className="text-brand-secondary font-black text-base">*</span> ENGENHARIA WEB INSTANTNEA</span>
          <span className="flex items-center gap-3"><span className="text-brand font-black text-base">*</span> CONTROL OPERATIONAL SYSTEMS</span>
          <span className="flex items-center gap-3"><span className="text-brand-secondary font-black text-base">*</span> DIRECIONAMENTO CONCEITUAL SÒBRIO</span>
          <span className="flex items-center gap-3"><span className="text-brand font-black text-base">*</span> PROCESS INTELLIGENCE ASSESSMENT</span>
          <span className="flex items-center gap-3"><span className="text-brand-secondary font-black text-base">*</span> METAS ADS B2B DE ELITE</span>
          <span className="flex items-center gap-3"><span className="text-brand font-black text-base">*</span> BRANDING CONCEITUAL SҊNIOR</span>
        </div>
      </div>

      {/*=========================================
          INTELLIGENT DIAGNOSTIC PROBLEM MATRIX
         =========================================*/}
      <section className="px-4 sm:px-6 md:px-8 py-20 bg-charcoal-950 text-left relative z-10 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl">
            <div className="space-y-3">
              <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
                DIAGNOSTICADOR DE AJUSTE COMERCIAL // METODOLOGIA
              </span>
              <h3 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tighter">
                Qual é a barreira operacional ou de imagem que trava sua marca hoje?
              </h3>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm md:pb-1">
              Fomos a campo catalogar os piores gargalos de corporações B2B e definimos respostas corretivas imediatas operadas pelos nossos especialistas.
            </p>
          </div>

          {/* Polished interactive grid container resembling high-contrast bento style with neon dividers */}
          <div className="border border-white/[0.06] rounded-3xl overflow-hidden divide-y divide-white/[0.05] bg-charcoal-900/30 relative drop-shadow-2xl">
            <div className="absolute inset-0 bg-[#000]/10" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />
            
            {/* Table layout header */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 font-mono text-[9px] text-zinc-500 uppercase tracking-widest bg-charcoal-900/60 font-semibold relative z-10 select-none">
              <div className="md:col-span-6">SINTOMA / SINAL DE ANOMALIA</div>
              <div className="md:col-span-4">PRESCRIÇÃO CORRETIVA TAG08</div>
              <div className="md:col-span-2 text-right hidden md:block">PROTOCOLO</div>
            </div>

            {/* Matrix Row Blocks */}
            {[
              {
                problem: "Falta de discernimento editorial. Nossa marca produz conteúdo instável, parecendo amadora perto de concorrentes menores.",
                solution: "Gestão Corporativa de Redes Sociais",
                slug: "/servicos/gestao-de-redes-sociais"
              },
              {
                problem: "Marca visual antiquada ou desconectada do real prestígio e robustez offline que colhemos ao longo dos anos.",
                solution: "Branding & Identidades Conceituais",
                slug: "/servicos/branding-identidade"
              },
              {
                problem: "Site lento, defasado, que trava em celulares corporativos e falha em registrar leads no CRM de forma integrada.",
                solution: "Desenvolvimento & Engenharia Web Sênior",
                slug: "/servicos/desenvolvimento-web"
              },
              {
                problem: "Processos retidos unicamente na mente da diretoria. A equipe trabalha de forma caótica quando o fundador se ausenta.",
                solution: "Process Intelligence (Mapeamento)",
                slug: "/servicos/process-intelligence"
              },
              {
                problem: "Manuais existem no drive, mas ninguém os consulta. O time opera em desajuste reiterado e ignora os playbooks.",
                solution: "Process Activation (Auditoria de Rotinas)",
                slug: "/servicos/process-activation"
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 sm:p-7 items-center hover:bg-white/[0.015] transition-all duration-300 relative z-10 group"
              >
                <div className="md:col-span-6 flex gap-4 items-start">
                  <span className="font-sans text-[10px] text-zinc-600 mt-1 font-bold">[{idx + 1}]</span>
                  <p className="text-zinc-300 text-xs sm:text-sm font-sans font-medium leading-relaxed group-hover:text-white transition-colors">
                    {item.problem}
                  </p>
                </div>
                
                <div className="md:col-span-4">
                  <span className="inline-flex px-3 py-1.5 rounded-xl bg-brand/5 border border-brand/10 text-brand text-xs font-mono font-bold uppercase tracking-tight group-hover:bg-brand group-hover:text-black transition-all duration-300">
                    {item.solution}
                  </span>
                </div>

                <div className="md:col-span-2 md:text-right">
                  <button
                    onClick={() => handleLinkClick(item.slug)}
                    className="text-white hover:text-brand-secondary font-mono text-[9px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 group/btn transition-colors cursor-pointer"
                  >
                    DIAGNOSTICAR <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform text-brand-secondary" />
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
      <section className="px-4 sm:px-6 md:px-8 py-20 relative z-10 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-semibold bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              LINHA DE PRODUÇÃO INTEGRAL
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tighter leading-none">
              Nossos Núcleos de Atuação Especializados
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
              Soluções executivas sofisticadas desenhadas para redefinir o tom de voz corporativo, automatizar fluxos operacionais e acelerar a captação de clientes.
            </p>
          </div>

          <div className="space-y-12 max-w-5xl mx-auto">
            {SERVICE_DOMAINS.map((domain, index) => {
              const IconComponent = domain.icon;
              return (
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
                    <div className="flex items-center gap-1.5 font-mono text-[8px] text-zinc-500 uppercase tracking-widest">
                      <span>NҚCLEO INSTALADO // {domain.slug}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary/40" />
                    </div>
                  </div>

                  {/* Main content grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Scope, Title, and details */}
                    <div className="lg:col-span-6 space-y-6 text-left">
                      <div className="space-y-3">
                        <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight group-hover:text-brand-secondary transition-colors leading-[1.1]">
                          {domain.title}
                        </h3>
                        
                        {/* Interactive dynamic tags mapping */}
                        <div className="flex flex-wrap gap-1.5">
                          {domain.tags.map((tag, tagIdx) => (
                            <span 
                              key={tagIdx}
                              className="text-[9px] font-sans font-medium tracking-wide border border-brand-secondary/10 text-brand bg-brand-secondary/[0.02] py-0.5 px-2 rounded-md"
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
                        <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest leading-none font-bold">
                          Entregas e Escopo Operado:
                        </p>
                        <div className="grid gap-3.5 pl-1">
                          {domain.subservices.map((sub, subIdx) => (
                            <div key={subIdx} className="flex gap-3">
                              <div className="mt-1 w-3.5 h-3.5 rounded-full bg-brand-secondary/5 text-brand flex items-center justify-center shrink-0 border border-brand-secondary/15">
                                <Check className="w-2 h-2 text-brand-secondary" />
                              </div>
                              <div>
                                <h4 className="text-white text-xs font-semibold">{sub.name}</h4>
                                <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">{sub.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Primary Navigation CTA and Scope Share */}
                      <div className="pt-6 flex flex-wrap gap-3 items-center">
                        <button
                          onClick={() => handleLinkClick(domain.ctaPage)}
                          className="inline-flex items-center gap-2 bg-white/5 hover:bg-brand hover:text-black border border-white/10 hover:border-brand text-xs text-white font-mono font-semibold uppercase tracking-widest py-3 px-6 rounded-xl transition-all duration-300 group/btn shrink-0"
                        >
                          <span>FALAR COM ESPECIALISTA</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1.5 transition-transform" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyDomainScope(domain)}
                          className="inline-flex items-center gap-2 bg-white/[0.02] hover:bg-white/[0.08] border border-white/[0.05] hover:border-white/20 text-xs text-zinc-300 hover:text-white font-mono font-medium uppercase tracking-widest py-3 px-5 rounded-xl transition-all duration-300 shrink-0 select-none cursor-pointer"
                        >
                          {copiedDomainSlug === domain.slug ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-brand" />
                              <span className="text-brand text-[11px]">Escopo Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Copiar Escopo</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>

                    {/* Right Column: High Visual Mockup wrapped in subtle physical perspective frames */}
                    <div className="lg:col-span-6 w-full h-full xl:pl-6">
                      <ThreeDimensionalTilt>
                        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[1.5/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group/img">
                          <img
                            src={domain.image}
                            alt={domain.title}
                            className="w-full h-full object-cover grayscale brightness-[0.4] group-hover/img:scale-105 group-hover/img:grayscale-0 group-hover/img:brightness-[0.6] transition-all duration-700 ease-out"
                            referrerPolicy="no-referrer"
                          />
                          {/* Rich overlays */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1.5 rounded-lg text-zinc-400 font-sans text-[8px] flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-brand" />
                            <span>TAG08_CORE_METRIC</span>
                          </div>
                        </div>
                      </ThreeDimensionalTilt>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/*==========================================================
          THE STRATEGIC MATRIX OF COMBINED VALUE (User Screen 2 Style)
         ==========================================================*/}
      <section className="px-4 sm:px-6 md:px-8 py-20 relative z-10 border-b border-white/[0.04] bg-neutral-900/10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="space-y-3 text-left max-w-2xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
              ALTA SINERGIA // INTEGRAï¿½ï¿½O DE ATIVOS
            </span>
            <h3 className="font-display font-medium text-3xl sm:text-4xl text-white uppercase tracking-tighter leading-none">
              Arquitetura de Sinergia de Soluções
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Módulos isolados funcionam, mas é na intersecção dos nossos núcleos que reside o verdadeiro destravamento comercial do seu negócio. Veja como associamos nossas forças:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                title: "Engenharia Sutil e Identidade",
                action: "DESIGN COESIVO",
                tagline: "Desenvolvimento + Branding",
                desc: "Sua identidade refinada, manifestos e tom de voz B2B sênior codificados sob medida, gerando carregamento em menos de 2 segundos."
              },
              {
                title: "Conteúdo Qualificado e Escala",
                action: "CAPTAï¿½ï¿½O ELEVADA",
                tagline: "Redes Sociais + Tráfego",
                desc: "Roteiros de alta persuasão de Reels e campanhas estruturadas focando em captar contatos que possuem alta renda e interesse real de compra."
              },
              {
                title: "Mapeamento Estável e Governança",
                action: "BLINDAGEM OPERACIONAL",
                tagline: "Process Intelligence + Organização",
                desc: "Playbooks ricos no Notion integrados à nossa cobrança tática diária, reduzindo o desgaste da alta gestão e criando liberdade."
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="p-8 rounded-[24px] bg-charcoal-900 border border-white/[0.05] hover:border-brand/40 hover:bg-white/[0.015] transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-72 group"
              >
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8.5px] text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-0.5 rounded font-black tracking-widest">
                      {item.action}
                    </span>
                    <span className="font-sans text-[9px] text-zinc-600">COMBO_0{idx+1}</span>
                  </div>
                  <h4 className="text-white text-base sm:text-lg font-display font-bold uppercase tracking-tight group-hover:text-brand-secondary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed leading-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between text-[9px] font-sans text-zinc-500 relative z-10">
                  <span>Mï¿½DULO DE INTEGRAï¿½ï¿½O</span>
                  <span className="text-brand-secondary font-semibold">{item.tagline}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Trust validation client logos section */}
      <MiniCases onNavigate={onNavigate} />

      {/* SECTION - WORK SYSTEM (WhatsApp Neon Callout inspired by screenshot) */}
      <section className="py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          {/* Left Column: Portrait */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[520px]">
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden" />
            <img 
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800" 
              alt="TAG08 Directors Partnership" 
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
                  synergy_engine
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                  combos_scale_
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
                  SISTEMA DE TRABALHO
                </span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black leading-[0.9] tracking-tighter uppercase font-display">
                NҚCLEOS INTEGRADOS <br />
                EM PERFEITA SINERGIA!
              </h2>
              <p className="text-black/85 text-[11px] sm:text-xs max-w-lg leading-relaxed font-sans font-extrabold uppercase font-bold">
                CONECTAMOS TODAS AS NOSSAS DISCIPLINAS OPERACIONAIS EM UMA SÒ ENGRENAGEM DE CRESCIMENTO ATIVO, MULTIPLICANDO A AUTORIDADE DA SUA MARCA ENQUANTO BLINDAMOS SEU FUNIL DE VENDAS.
              </p>
            </div>

            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 max-w-md relative overflow-hidden text-left font-sans">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-4 items-start select-none">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black shrink-0 shadow-lg shadow-brand/10 hover:scale-105 transition-transform duration-200">
                  <ArrowUpRight className="w-5 h-5 rotate-45 stroke-[2.5] text-black" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-[8px] text-brand uppercase tracking-wider font-extrabold block">
                    SINERGIA TOTAL DE ATIVOS
                  </span>
                  <p className="text-white text-xs leading-snug font-sans font-semibold">
                    Alinhe Branding, Design, Tráfego e Engenharia Web sob uma única direção executiva sênior, reduzindo ruído técnico.
                  </p>
                </div>
              </div>

              {/* DUAL CLIENT CONNECTION CHANNELS (BR & INT) */}
              <div className="space-y-3 font-sans">
                <a 
                  href={buildBrazilWhatsAppUrl("Olá,%20gostaria%20de%20solicitar%20um%20diagnóstico%20de%20sinergia%20de%20serviços%20com%20a%20TAG08")}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner cursor-pointer"
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
                  href={buildInternationalWhatsAppUrl("Hello,%20I%20would%2520like%2520to%2520schedule%252520a%252520private%252520synergy%252520strategy%252520diagnosis%252520from%252520TAG08")}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-black transition-all duration-200">
                        <span className="text-[9px] font-mono font-black tracking-tight text-brand group-hover:text-black">INT</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase font-black tracking-wider leading-none">
                          INTERNATIONAL DIRECT (WhatsApp)
                        </span>
                        <span className="text-white text-xs font-mono font-bold tracking-wider group-hover:text-brand transition-colors mt-0.5">
                          +56 9 9793 7611
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-brand font-mono font-bold uppercase tracking-wider bg-brand/10 py-1 px-2.5 rounded-lg group-hover:bg-brand group-hover:text-black transition-all">
                      CONECTAR
                    </span>
                  </div>
                </a>
              </div>

              {/* LIVE BADGE STATUS */}
              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 text-xs font-sans">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                  <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest font-extrabold">
                    TAG08
                  </span>
                </div>
                <span className="font-sans text-[8.5px] text-brand font-bold bg-brand/10 border border-brand/20 px-2 rounded">
                  OPERAÇÃO ATIVA
                </span>
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
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono">
                  FAQ // ENCONTRE RESPOSTAS
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter uppercase">
                  DҚVIDAS &amp; <br />
                  SINERGIA DE SERVIÒ⬡OS
                </h2>
                <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans max-w-sm">
                  Esclareï¿½a as principais dï¿½vidas sobre como a TAG08 gerencia múltiplos nï¿½cleos de entrega simultï¿½neos em prol do crescimento da sua marca.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {([
                  { id: 0, title: "ECOSSISTEMA" },
                  { id: 1, title: "MÒDULOS" },
                  { id: 2, title: "ALINHAMENTO" },
                  { id: 3, title: "PRAZO" }
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

            {/* Middle Column: Cover image */}
            <div className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-white/[0.04] bg-[#0c0c0e]">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"
                alt="TAG08 Meeting"
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div className="absolute top-6 left-6 z-10 pointer-events-none font-mono text-[8px] text-white/20 uppercase tracking-widest leading-none">
                SYS // INTEGRATIONS
              </div>

              <div className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left font-sans">
                <span className="font-mono text-[8.5px] text-brand uppercase tracking-widest font-black block">
                  {([
                    "ECOSSISTEMA",
                    "MÒDULOS",
                    "ALINHAMENTO",
                    "PRAZO"
                  ])[activeFaq]}
                </span>

                <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {([
                    "Como os serviços se conectam?",
                    "Preciso contratar tudo de uma vez?",
                    "Como funciona o alinhamento?",
                    "Quando vejo os primeiros ativos?"
                  ])[activeFaq]}
                </h4>

                <p className="text-zinc-300 text-xs sm:text-[12.5px] leading-relaxed font-sans font-medium">
                  {([
                    "Branding, redes, web e processos operam sob a mesma direção.",
                    "Não. Você pode começar pelo que trava mais seu crescimento.",
                    "Centralizamos a comunicação para reduzir ruído e acelerar decisão.",
                    "Após o onboarding, os primeiros ativos entram em produção."
                  ])[activeFaq]}
                </p>
              </div>
            </div>

            {/* Right Column: Mini auxiliary action cards */}
            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-bold">PROPOSTA</span>
                  <h4 className="text-white font-semibold text-sm leading-snug font-display">Como agimos de forma organizada?</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    Eliminamos ruído e priorizamos clareza, foco e execução.
                  </p>
                </div>
                <button
                  onClick={() => handleLinkClick("/")}
                  className="group flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5"
                >
                  <span>Voltar</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-black/60 uppercase tracking-widest block font-extrabold">FALE COM O DIRETOR</span>
                  <h4 className="text-black font-black text-sm uppercase leading-tight tracking-tight">Quer uma estratégia sob medida?</h4>
                  <p className="text-black/85 text-[11.5px] font-semibold leading-relaxed font-mono">
                    Fale com a TAG08 via WhatsApp e avalie o próximo passo com clareza.
                  </p>
                </div>
                <a
                  href={buildBrazilWhatsAppUrl("Olá,%20gostaria%20de%20consultar%20viabilidade%20estratégica%20especializada%20para%20minha%20marca!")}
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

      {/*==========================================================
          THE EXECUTIVE CONVICTION CTA PANEL
         ==========================================================*/}
      <section className="px-4 sm:px-6 md:px-8 py-12 relative z-10 animate-fade-in border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto rounded-3xl bg-charcoal-900 border border-white/[0.06] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-left relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary/[0.01] via-transparent to-transparent pointer-events-none" />
          
          <div className="space-y-2">
            <h3 className="font-display font-medium text-xl sm:text-2xl text-white uppercase tracking-tight leading-none">
              Não sabe por onde começar?
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Agende um diagnóstico curto e receba direção clara para o próximo passo.
            </p>
          </div>
          
          <button
            onClick={() => handleLinkClick("/contato")}
            className="bg-brand-secondary hover:bg-brand hover:scale-105 duration-300 text-black font-black text-xs font-sans px-7 py-4 rounded-xl transition-all shrink-0 shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.15)] cursor-pointer"
          >
            AGENDAR DIAGNÒSTICO
          </button>
        </div>
      </section>
    </div>
  );
}


