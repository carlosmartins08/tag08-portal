import { Check, ArrowRight, ArrowUpRight, ShieldCheck, Cpu, Sparkles, Settings2, Share2, TrendingUp, BarChart3, Award, Copy, Star, Calendar, Video } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { buildBrazilWhatsAppUrl } from "../../../config/siteNetwork";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import MiniCases from "../../../components/MiniCases";

interface ServicosProps {
  onNavigate: (page: string) => void;
}

export default function Servicos({ onNavigate }: ServicosProps) {
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
      slug: "strategy",
      icon: Award,
      tags: ["Posicionamento", "Mensagem", "Prioridades", "Diagnóstico"],
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Leitura do momento", desc: "Entendimento do cenário atual, gargalos e capacidade real de execução." },
        { name: "Mensagem e proposta de valor", desc: "Organização da comunicação para deixar claro o que a marca faz e por que importa." },
        { name: "Prioridades de ação", desc: "Definição do que vem primeiro para evitar dispersão e esforço sem direção." },
        { name: "Direção de canais", desc: "Recomendação do melhor ponto de partida entre presença, conteúdo, site ou operação." }
      ],
      description: "Para marcas que precisam organizar posicionamento, mensagem e prioridades antes de investir em ações soltas.",
      ctaPage: "/servicos/assessoria-marketing-digital-estrategico"
    },
    {
      num: "02",
      title: "Gestão de Redes Sociais",
      slug: "presence",
      icon: Share2,
      tags: ["Linha editorial", "Frequência", "Narrativa", "Consistência"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Linha editorial", desc: "Temas e mensagens definidos para sustentar a presença ao longo do tempo." },
        { name: "Calendário possível", desc: "Organização de frequência com base na realidade operacional da marca." },
        { name: "Narrativa de marca", desc: "Conteúdo com intenção e coerência entre o que se publica e o posicionamento." },
        { name: "Acompanhamento de consistência", desc: "Ajustes contínuos para manter clareza e continuidade na comunicação." }
      ],
      description: "Para negócios que querem deixar de postar por obrigação e construir conteúdo com frequência, narrativa, intenção comercial e consistência.",
      ctaPage: "/servicos/gestao-de-redes-sociais"
    },
    {
      num: "03",
      title: "Produção Audiovisual",
      slug: "audiovisual",
      icon: Video,
      tags: ["Imagem", "Fala", "Bastidores", "Conteúdo"],
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Vídeos institucionais", desc: "Apresentação da marca, de sua história e dos diferenciais que sustentam seu valor." },
        { name: "Cobertura de eventos", desc: "Registro de momentos, falas e bastidores para ampliar o valor do encontro depois que ele acontece." },
        { name: "Conteúdo para especialistas", desc: "Captação e edição de falas, entrevistas e aulas com presença profissional." },
        { name: "Formatos para redes", desc: "Cortes e vídeos curtos alinhados à linha editorial e ao posicionamento da marca." }
      ],
      description: "Para empresas, especialistas e eventos que precisam transformar presença, ambiente e conhecimento em vídeos com clareza e função estratégica.",
      ctaPage: "/servicos/producao-audiovisual"
    },
    {
      num: "04",
      title: "Branding e Identidade",
      slug: "branding",
      icon: Sparkles,
      tags: ["Identidade visual", "Linguagem", "Estética", "Coerência"],
      image: "https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Identidade visual", desc: "Organização de elementos visuais para refletir melhor o momento da marca." },
        { name: "Linguagem e tom", desc: "Ajuste da forma de falar para ampliar clareza e confiança." },
        { name: "Materiais de apoio", desc: "Piezas visuais para manter consistência em canais e apresentações." },
        { name: "Percepção coerente", desc: "Ajustes para aproximar a aparência da marca do valor que ela entrega." }
      ],
      description: "Para marcas que precisam alinhar identidade, linguagem, estética e materiais ao momento atual do negócio.",
      ctaPage: "/servicos/branding-identidade"
    },
    {
      num: "05",
      title: "Desenvolvimento Web",
      slug: "web",
      icon: Settings2,
      tags: ["Site próprio", "Landing page", "Catálogo", "Credibilidade"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Site institucional", desc: "Estrutura digital para apresentar a marca com mais clareza e credibilidade." },
        { name: "Landing pages", desc: "Páginas específicas para apoiar campanhas, ofertas e conversas comerciais." },
        { name: "Catálogo e apresentação", desc: "Organização de informações para facilitar compreensão e navegação." },
        { name: "Apoio ao comercial", desc: "Base digital pensada para sustentar o próximo passo de contato e conversão." }
      ],
      description: "Para negócios que precisam de site, landing page, catálogo ou estrutura digital para apresentar melhor, gerar credibilidade e apoiar o comercial.",
      ctaPage: "/servicos/desenvolvimento-web"
    },
    {
      num: "06",
      title: "Process Intelligence",
      slug: "intelligence",
      icon: Cpu,
      tags: ["Mapeamento", "Rotina", "Fluxos", "Gargalos"],
      image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Mapeamento de rotinas", desc: "Leitura do que acontece hoje para entender onde o trabalho se perde." },
        { name: "Gargalos e dependências", desc: "Identificação do que trava a operação e força improviso." },
        { name: "Responsabilidades", desc: "Organização de quem faz o quê para reduzir ruído e retrabalho." },
        { name: "Fluxos e decisões", desc: "Estruturação de caminhos para o time decidir com mais critério." }
      ],
      description: "Para empresas que precisam mapear rotinas, gargalos, responsabilidades, fluxos e decisões antes de propor melhorias ou automações.",
      ctaPage: "/servicos/process-intelligence"
    },
    {
      num: "07",
      title: "Process Activation",
      slug: "activation",
      icon: BarChart3,
      tags: ["Implantação", "Governança", "Ferramentas", "Acompanhamento"],
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Implantação de processos", desc: "Transformação do diagnóstico em prática operacional." },
        { name: "Rotina e ferramenta", desc: "Ajuste de cadência e recursos para que o processo saia do papel." },
        { name: "Automação possível", desc: "Identificação do que pode ser automatizado sem romper a operação." },
        { name: "Governança e revisão", desc: "Acompanhamento para sustentar o que foi implementado." }
      ],
      description: "Para negócios que já identificaram gargalos e precisam transformar diagnóstico em implantação, rotina, ferramenta, automação ou governança.",
      ctaPage: "/servicos/process-activation"
    },
    {
      num: "08",
      title: "Hospedagem e Manutenção",
      slug: "maintenance",
      icon: ShieldCheck,
      tags: ["Hospedagem", "Manutenção", "Atualização", "Monitoramento"],
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
      subservices: [
        { name: "Hospedagem ativa", desc: "Estrutura estável para manter o site no ar com segurança." },
        { name: "Manutenção técnica", desc: "Ajustes e cuidados recorrentes depois da publicação." },
        { name: "Atualizações de segurança", desc: "Correções e atualizações para reduzir risco operacional." },
        { name: "Monitoramento contínuo", desc: "Acompanhamento para manter disponibilidade e continuidade." }
      ],
      description: "Para marcas que precisam manter seus sites ativos, atualizados, monitorados e acompanhados com responsabilidade.",
      ctaPage: "/hospedagem-manutencao-sites"
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
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono">
                Serviços TAG08
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter uppercase">
                Soluções para organizar presença, posicionamento e crescimento com direção.
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
                A TAG08 estrutura serviços de estratégia, conteúdo, design, tecnologia e processos para marcas que precisam sair do improviso e construir uma presença digital mais clara, consistente e responsável.
              </p>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                Antes de indicar qualquer solução, entendemos o momento do negócio, os gargalos atuais e a capacidade de execução para recomendar o caminho mais coerente.
              </p>

              {/* Grid tags of our core expertise */}
              <div className="flex flex-wrap gap-2 pt-2">
                {["Estratégia", "Conteúdo", "Tecnologia", "Processos"].map((tag, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[9px] tracking-wider uppercase px-3 py-1.5 border border-white/5 rounded-full bg-white/[0.02] text-zinc-300 hover:border-brand/40 hover:text-brand transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => handleLinkClick("/contato")}
                  className="inline-flex items-center justify-center gap-2 bg-brand text-black hover:bg-brand-dark font-mono font-black text-[10px] uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-300"
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
                  className="inline-flex items-center justify-center gap-2 bg-black/5 border border-black/10 text-black hover:bg-black/10 font-mono font-black text-[10px] uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-300"
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
                      <span className="font-mono text-[9px] uppercase tracking-widest text-brand-secondary">MAPA DE SOLUÇÕES</span>
                    </div>
                    <span className="font-mono text-[9px] text-zinc-600">TAG08_BOARD</span>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Estratégia</h4>
                        <p className="text-zinc-300 text-xs mt-0.5">Clareza para decidir o que vem antes da execução.</p>
                      </div>
                      <span className="font-display font-black text-3xl text-white">Estratégia</span>
                    </div>

                    <div className="flex items-baseline justify-between border-t border-white/[0.04] pt-4">
                      <div>
                        <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Conteúdo</h4>
                        <p className="text-zinc-300 text-xs mt-0.5">Linha editorial para construir presença com intenção.</p>
                      </div>
                      <span className="font-display font-black text-3xl text-brand-secondary">Conteúdo</span>
                    </div>

                    <div className="flex items-baseline justify-between border-t border-white/[0.04] pt-4">
                      <div>
                        <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Tecnologia</h4>
                        <p className="text-zinc-300 text-xs mt-0.5">Estruturas digitais para apoiar comunicação e operação.</p>
                      </div>
                      <span className="font-display font-black text-3xl text-brand">Tecnologia</span>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0">
                      <Award className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h5 className="font-mono text-[9px] font-bold text-white uppercase tracking-wider leading-none">Processos</h5>
                      <p className="text-zinc-400 text-[9.5px] mt-1 leading-relaxed">Organização para reduzir improviso e sustentar crescimento.</p>
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
          <span className="flex items-center gap-3"><span className="text-brand font-black text-base">*</span> PROCESSOS E OPERA??O</span>
          <span className="flex items-center gap-3"><span className="text-brand-secondary font-black text-base">*</span> PRESEN?A COM DIRE??O</span>
          <span className="flex items-center gap-3"><span className="text-brand font-black text-base">*</span> BRANDING E IDENTIDADE</span>
          
          {/* Repeat once more to secure contiguous slide chain */}
          <span className="flex items-center gap-3"><span className="text-brand font-black text-base">*</span> PRESENÒ⬡A DIGITAL INTELIGENTE</span>
          <span className="flex items-center gap-3"><span className="text-brand-secondary font-black text-base">*</span> ENGENHARIA WEB INSTANTNEA</span>
          <span className="flex items-center gap-3"><span className="text-brand font-black text-base">*</span> CONTROL OPERATIONAL SYSTEMS</span>
          <span className="flex items-center gap-3"><span className="text-brand-secondary font-black text-base">*</span> DIRECIONAMENTO CONCEITUAL SÒBRIO</span>
          <span className="flex items-center gap-3"><span className="text-brand font-black text-base">*</span> PROCESSOS E OPERA??O</span>
          <span className="flex items-center gap-3"><span className="text-brand-secondary font-black text-base">*</span> PRESEN?A COM DIRE??O</span>
          <span className="flex items-center gap-3"><span className="text-brand font-black text-base">*</span> BRANDING E IDENTIDADE</span>
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
                Diagnóstico por necessidade
              </span>
              <h3 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tighter">
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

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 font-mono text-[9px] text-zinc-500 uppercase tracking-widest bg-charcoal-900/60 font-semibold relative z-10 select-none">
              <div className="md:col-span-6">SINAL DE NECESSIDADE</div>
              <div className="md:col-span-4">PONTO DE PARTIDA TAG08</div>
              <div className="md:col-span-2 text-right hidden md:block">CAMINHO</div>
            </div>

            {[
              {
                problem: "Minha marca comunica pouco ou comunica sem clareza",
                solution: "Quando o valor existe, mas o público ainda não entende bem o que a marca faz, para quem faz e por que deveria confiar.",
                slug: "/servicos/assessoria-marketing-digital-estrategico",
                label: "Estratégia e posicionamento"
              },
              {
                problem: "Tenho presença digital, mas falta consistência",
                solution: "Quando a empresa posta, aparece e tenta manter canais ativos, mas a comunicação ainda não tem linha editorial clara.",
                slug: "/servicos/gestao-de-redes-sociais",
                label: "Conteúdo e redes sociais"
              },
              {
                problem: "Preciso melhorar percepção visual e autoridade",
                solution: "Quando a marca precisa parecer mais alinhada ao valor que entrega, com identidade, linguagem e materiais mais coerentes.",
                slug: "/servicos/branding-identidade",
                label: "Branding e audiovisual"
              },
              {
                problem: "Meu site ou estrutura digital não acompanha o negócio",
                solution: "Quando a presença digital precisa de uma base própria para apresentar, converter, organizar informações ou apoiar o comercial.",
                slug: "/servicos/desenvolvimento-web",
                label: "Desenvolvimento web"
              },
              {
                problem: "A operação cresceu e ficou pesada",
                solution: "Quando processos, responsabilidades, aprovações e decisões dependem de improviso, memória e esforço excessivo.",
                slug: "/servicos/process-intelligence",
                label: "Processos e operação"
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 sm:p-7 items-center hover:bg-white/[0.015] transition-all duration-300 relative z-10 group"
              >
                <div className="md:col-span-6 flex gap-4 items-start">
                  <span className="font-sans text-[10px] text-zinc-600 mt-1 font-bold">[{idx + 1}]</span>
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
                  <span className="inline-flex px-3 py-1.5 rounded-xl bg-brand/5 border border-brand/10 text-brand text-xs font-mono font-bold uppercase tracking-tight group-hover:bg-brand group-hover:text-black transition-all duration-300">
                    {item.label}
                  </span>
                </div>

                <div className="md:col-span-2 md:text-right">
                  <button
                    onClick={() => handleLinkClick(item.slug)}
                    className="text-white hover:text-brand-secondary font-mono text-[9px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 group/btn transition-colors cursor-pointer"
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
      <section className="px-4 sm:px-6 md:px-8 py-20 relative z-10 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-semibold bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              Mapa de soluções
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tighter leading-none">
              Escolha o caminho pelo momento da sua marca.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
              Cada solução da TAG08 responde a um tipo de necessidade: clareza estratégica, presença digital, identidade, conteúdo, audiovisual, tecnologia ou processos. O melhor caminho depende do diagnóstico.
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
                      <span>CAMINHO ATIVO // {domain.slug}</span>
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
                          Entregas e escopo:
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
                          <span>ENTENDER SOLU??O</span>
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
                            <span>TAG08_MAP</span>
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
      <section id="servicos-principais" className="px-4 sm:px-6 md:px-8 py-20 relative z-10 border-b border-white/[0.04] bg-neutral-900/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-3 text-left max-w-2xl">
            <span className="font-mono text-[9px] text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
              Combinação de frentes
            </span>
            <h3 className="font-display font-medium text-3xl sm:text-4xl text-white uppercase tracking-tighter leading-none">
              Nem todo projeto precisa de tudo. Mas algumas soluções funcionam melhor juntas.
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Depois do diagnóstico, a TAG08 identifica quais frentes precisam atuar em conjunto para resolver o problema real da marca. A combinação certa evita escopo excessivo, retrabalho e investimento fora de prioridade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 text-left">
            {[
              {
                title: "Posicionamento + Conteúdo",
                desc: "Quando a marca precisa organizar mensagem, temas, linha editorial e presença recorrente.",
                tag: "Combinação útil"
              },
              {
                title: "Branding + Desenvolvimento Web",
                desc: "Quando a percepção visual e a estrutura digital precisam transmitir mais clareza e confiança.",
                tag: "Base e aparência"
              },
              {
                title: "Audiovisual + Redes Sociais",
                desc: "Quando imagem, fala, bastidores e conteúdo precisam ganhar frequência e intenção editorial.",
                tag: "Conteúdo aplicado"
              },
              {
                title: "Process Intelligence + Process Activation",
                desc: "Quando a empresa precisa entender gargalos e transformar diagnóstico em rotina, ferramenta ou governança.",
                tag: "Operação organizada"
              },
              {
                title: "Estratégia + Operação",
                desc: "Quando o desafio não é apenas comunicar melhor, mas organizar prioridades, decisões e execução.",
                tag: "Direção completa"
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-7 rounded-[24px] bg-charcoal-900 border border-white/[0.05] hover:border-brand/40 hover:bg-white/[0.015] transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[240px] group"
              >
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[8.5px] text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-0.5 rounded font-black tracking-widest">
                      {item.tag}
                    </span>
                    <span className="font-sans text-[9px] text-zinc-600">0{idx + 1}</span>
                  </div>
                  <h4 className="text-white text-base sm:text-lg font-display font-bold uppercase tracking-tight group-hover:text-brand-secondary transition-colors">
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

      {/* Trust validation client logos section */}
      <MiniCases onNavigate={onNavigate} />

      {/* SECTION - WORK SYSTEM (WhatsApp Neon Callout inspired by screenshot) */}
      <section className="py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

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
                  ACORDO CLARO
                </span>
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  TAG08.v3
                </span>
              </div>
              <div className="space-y-1.5 opacity-30 select-none">
                <div className="font-display font-extrabold text-[1.8rem] text-white/40 tracking-widest leading-none uppercase select-none">
                  alinhamento_claro
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                  execucao_visivel
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-mono text-[9px] text-white/40 tracking-wider">
                  ETAPAS CLARAS
                </span>
                <span className="font-mono text-[9px] text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  PROCESSO ATIVO
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
                <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/90">
                  Como conduzimos o trabalho
                </span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black leading-[0.9] tracking-tighter uppercase font-display">
                Da recomendação ao acompanhamento.
              </h2>
              <p className="text-black/85 text-[11px] sm:text-xs max-w-lg leading-relaxed font-sans font-extrabold uppercase font-bold">
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
                      <span className="font-mono text-[8px] text-brand uppercase tracking-wider font-extrabold">
                        0{idx + 1}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-brand-secondary/50" />
                    </div>
                    <h3 className="text-white text-sm font-semibold">{step.title}</h3>
                    <p className="text-zinc-300 text-xs leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 relative z-10">
                <button
                  onClick={() => handleLinkClick("/contato")}
                  className="inline-flex items-center justify-center gap-2 bg-brand text-black hover:bg-brand-dark font-mono font-black text-[10px] uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-300"
                >
                  FALAR COM A TAG08
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleLinkClick("/servicos")}
                  className="inline-flex items-center justify-center gap-2 bg-black/5 border border-black/10 text-black hover:bg-black/10 font-mono font-black text-[10px] uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-300"
                >
                  VER SOLUÇÕES
                  <ArrowRight className="w-3.5 h-3.5" />
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
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-[9px] rounded-lg uppercase tracking-widest font-mono">
                  Dúvidas antes de escolher
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter uppercase">
                  Entenda como escolher <br />
                  a solução certa.
                </h2>
                <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans max-w-sm">
                  A página de Serviços existe para orientar o ponto de partida. A recomendação final depende do momento da marca, dos gargalos atuais e da capacidade de execução.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {([
                  { id: 0, title: "PONTO DE PARTIDA" },
                  { id: 1, title: "PACOTES" },
                  { id: 2, title: "COMBINA??O" },
                  { id: 3, title: "TEMPO" },
                  { id: 4, title: "RESULTADO" }
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
                    "PONTO DE PARTIDA",
                    "PACOTES",
                    "COMBINA??O",
                    "TEMPO",
                    "RESULTADO"
                  ])[activeFaq]}
                </span>

                <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {([
                    "Preciso saber qual serviço contratar antes de falar com a TAG08?",
                    "A TAG08 trabalha com pacotes prontos?",
                    "Posso contratar apenas uma solução específica?",
                    "Por que o diagnóstico vem antes da proposta?",
                    "A TAG08 promete resultado com os serviços?"
                  ])[activeFaq]}
                </h4>

                <p className="text-zinc-300 text-xs sm:text-[12.5px] leading-relaxed font-sans font-medium">
                  {([
                    "Não. O primeiro passo é entender o momento da sua marca. A partir do diagnóstico, indicamos se faz mais sentido começar por estratégia, conteúdo, identidade, site, audiovisual, processos ou manutenção.",
                    "Temos soluções estruturadas, mas a recomendação não é automática. O escopo depende do problema real, da maturidade da marca, da urgência e da estrutura disponível para executar.",
                    "Sim. Quando a necessidade está clara, uma frente específica pode ser suficiente. Quando o problema envolve várias áreas, a TAG08 pode recomendar uma combinação de soluções.",
                    "Porque nem todo problema de presença digital se resolve com mais conteúdo, mais design, mais mídia ou mais tecnologia. O diagnóstico evita escopo errado, expectativa desalinhada e investimento fora de prioridade.",
                    "Não prometemos crescimento instantâneo ou resultado artificial. Trabalhamos para construir clareza, consistência, direção e melhoria contínua com responsabilidade."
                  ])[activeFaq]}
                </p>
              </div>
            </div>

            {/* Right Column: Mini auxiliary action cards */}
            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-bold">ORIENTA??O</span>
                  <h4 className="text-white font-semibold text-sm leading-snug font-display">Escolha melhor antes de avançar</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    A TAG08 organiza o ponto de partida para evitar escolhas apressadas e escopos desalinhados.
                  </p>
                </div>
                <button
                  onClick={() => handleLinkClick("/")}
                  className="group flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5"
                >
                  <span>VOLTAR</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="font-mono text-[8.5px] text-black/60 uppercase tracking-widest block font-extrabold">PRÓXIMO PASSO</span>
                  <h4 className="text-black font-black text-sm uppercase leading-tight tracking-tight">Quer entender o melhor caminho?</h4>
                  <p className="text-black/85 text-[11.5px] font-semibold leading-relaxed font-mono">
                    Antes de propor qualquer solução, a TAG08 entende seu momento, seus desafios e suas prioridades.
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
            <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-semibold bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              Próximo passo
            </span>
            <h3 className="font-display font-medium text-xl sm:text-2xl text-white uppercase tracking-tight leading-none">
              Vamos entender qual solução faz sentido para a sua marca?
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Antes de propor um serviço, a TAG08 entende seu momento, seus desafios e suas prioridades para indicar um caminho mais claro, coerente e responsável.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => handleLinkClick("/contato")}
              className="bg-brand-secondary hover:bg-brand hover:scale-105 duration-300 text-black font-black text-xs font-sans px-7 py-4 rounded-xl transition-all shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.15)] cursor-pointer"
            >
              QUERO ENTENDER MEU MELHOR CAMINHO
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
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs font-sans px-7 py-4 rounded-xl transition-all shrink-0 cursor-pointer"
            >
              VOLTAR PARA SOLUÇÕES
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}



