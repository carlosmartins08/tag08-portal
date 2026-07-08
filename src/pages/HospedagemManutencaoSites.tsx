import { useState } from "react";
import {
  CheckCircle,
  Cpu,
  ShieldCheck,
  Server,
  Database,
  Lock,
  Globe,
  RefreshCw,
  Radio,
  Zap,
  HelpCircle,
  ChevronDown,
  ArrowUpRight,
  Shield,
  Activity,
  CheckCircle2,
  AlertCircle,
  Key,
  Layers,
  ArrowRight,
  Terminal,
  FileCheck,
  Award,
  Mail,
  Sliders
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl } from "../config/siteNetwork";
import ThreeDimensionalTilt from "../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../components/Subtle3DCanvas";

interface PageProps {
  onNavigate: (page: string) => void;
}

export default function HospedagemManutencaoSites({ onNavigate }: PageProps) {
  const [activeFaq, setActiveFaq] = useState<number>(0);
  const [activeJourney, setActiveJourney] = useState<number>(0);
  const [selectedHosting, setSelectedHosting] = useState<string>("compartilhada");
  const [planCategory, setPlanCategory] = useState<"todos" | "corporativo" | "especializado">("todos");

  // Plan customization simulator states
  const [simPlan, setSimPlan] = useState<"basico" | "intermediario" | "avancado">("basico");
  const [simSites, setSimSites] = useState<number>(1);
  const [simEmails, setSimEmails] = useState<number>(10);
  const [simStorage, setSimStorage] = useState<number>(5);
  const [simApplyUpgrade, setSimApplyUpgrade] = useState<boolean>(false);

  const handlePlanChange = (plan: "basico" | "intermediario" | "avancado") => {
    setSimPlan(plan);
    setSimSites(1);
    setSimApplyUpgrade(false);
    if (plan === "basico") {
      setSimStorage(5);
      setSimEmails(10);
    } else if (plan === "intermediario") {
      setSimStorage(15);
      setSimEmails(50);
    } else if (plan === "avancado") {
      setSimStorage(30);
      setSimEmails(100); // displaying as Unlimited anyway
    }
  };

  const calculateSimulatedPrice = () => {
    let basePrice = 49;
    let extraStorageCost = 0;
    let extraEmailCost = 0;
    let upgradeCost = 0;
    let extraSitesCost = 0;

    // Additional sites cost
    if (simSites > 1) {
      extraSitesCost = (simSites - 1) * 50;
    }

    if (simPlan === "basico") {
      basePrice = 49;
      // Espaao adicional: R$ 3,00 por GB acima de 5 GB
      if (simStorage > 5) {
        extraStorageCost = (simStorage - 5) * 3;
      }
      // E-mails extras: R$ 5,00 por conjunto adicional de 5 e-mails acima de 10
      if (simEmails > 10) {
        const extraEmails = simEmails - 10;
        extraEmailCost = Math.ceil(extraEmails / 5) * 5;
      }
      // Upgrade (Suporte Avanaado): R$ 15,00/mas
      if (simApplyUpgrade) {
        upgradeCost = 15;
      }
    } else if (simPlan === "intermediario") {
      basePrice = 99;
      // Espaao adicional: R$ 5,00 por GB acima de 15 GB
      if (simStorage > 15) {
        extraStorageCost = (simStorage - 15) * 5;
      }
      // E-mails extras: R$ 10,00 por conjunto adicional de 10 e-mails acima de 50
      if (simEmails > 50) {
        const extraEmails = simEmails - 50;
        extraEmailCost = Math.ceil(extraEmails / 10) * 10;
      }
      // Upgrade (Backup Extra Semanal): R$ 20,00/mas
      if (simApplyUpgrade) {
        upgradeCost = 20;
      }
    } else if (simPlan === "avancado") {
      basePrice = 199;
      // Espaao adicional: R$ 10,00 por GB acima de 30 GB
      if (simStorage > 30) {
        extraStorageCost = (simStorage - 30) * 10;
      }
      // Emails are Unlimited, so extra emails cost is 0
      extraEmailCost = 0;
      // Upgrade (Suporte Personalizado): R$ 50,00/mas
      if (simApplyUpgrade) {
        upgradeCost = 50;
      }
    }

    return basePrice + extraStorageCost + extraEmailCost + upgradeCost + extraSitesCost;
  };

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Structured guide list for hosting classifications
  const hostingTypes = [
    {
      id: "compartilhada",
      title: "Hospedagem Compartilhada",
      niche: "Pequenas empresas, blogs pessoais, portfalios online",
      category: "especializado",
      description: "Opaao econamica ideal para projetos iniciais. Os recursos do servidor (como memaria e processamento) sÃ£o distribuados de forma equilibrada entre varios sites parceiros, com custo otimizado e total fÃ¡cilidade operacional.",
      specs: ["PreÃ§o Altamente Competitivo", "Gestao Automatizada de Painel", "Perfeito para ValidaÃ§Ã£o", "Armazenamento SSD Seguro"],
      badge: "InÃ­cio Rapido"
    },
    {
      id: "vps",
      title: "Hospedagem VPS (Virtual Private)",
      niche: "Sites de madio porte, e-commerces moderados, blogs ricos",
      category: "corporativo",
      description: "Um robusto servidor fasico segmentado em varias maquinas virtuais isoladas. Cada ambiente atua de modo individual with recursos dedicados garantidos, proporcionando total flexibilidade administrativa e tolerancia a picos de acessos.",
      specs: ["Recursos Dedicados (CPU/RAM)", "IP Dedicado Exclusivo", "Escalabilidade Gradual", "Controle Total de Root"],
      badge: "Mais Popular"
    },
    {
      id: "dedicada",
      title: "Hospedagem Dedicada",
      niche: "Grandes empresas, e-commerce de alto volume, portais complexos",
      category: "corporativo",
      description: "Um hardware computacional completo alocado exclusivamente para sustentar a soberania digital da sua marca. Maxima velocidade com isolamento tarmico e fasico absoluto, desempenho impecavel e total liberdade de seguranÃ§a avanaada.",
      specs: ["Nula Latancia Operacional", "Zeladoria Fasica Suprema", "Ambiente 100% Isolado", "PolÃ­ticas Customizadas"],
      badge: "Alta Performance"
    },
    {
      id: "nuvem",
      title: "Hospedagem na Nuvem (Cloud)",
      niche: "Startups, aplicaÃ§Ãµes SaaS escalÃ¡veis, trafego dinÃ¢mico",
      category: "corporativo",
      description: "Arquitetura distribuÃ­da entre mÃºltiplos servidores no ecossistema global. Suas cargas de processamento flutuam dinamicamente para neutralizar e mitigar sobrecargas de acessos, com cobranÃ§as transparentes baseadas em uso real.",
      specs: ["Auto-escalonamento Inteligente", "99.99% Uptime Provado", "DistribuiÃ§Ã£o Multirregional", "RedundÃ¢ncia ContÃ­nua"],
      badge: "Suprema Elasticidade"
    },
    {
      id: "wordpress",
      title: "Hospedagem SÃªnior WordPress",
      niche: "Sites acadÃªmicos, blogs profissionais, portais de marcas",
      category: "especializado",
      description: "Infraestrutura estritamente calibrada e desenhada de forma cirÃºrgica para as exigÃªncias refinadas do CMS mais famoso do planeta. Garanta carregamentos imperceptÃ­veis, atualizaÃ§Ãµes estÃ¡ticas seguras e cache agressivo na Ãºltima milha.",
      specs: ["Caching Integrado em NÃ­vel de Server", "SeguranÃ§a WordPress Ativa", "FÃ¡cil GestÃ£o de Ambientes", "Plugins PrÃ©-otimizados"],
      badge: "Focado em CMS"
    },
    {
      id: "ecommerce",
      title: "E-Commerce de Luxo & Alta Escala",
      niche: "Lojas virtuais estruturadas, catalogos pesados, vendas ativas",
      category: "especializado",
      description: "Suate integrada para garantir que nenhum carrinho de compras seja abandonado por lentidao tÃ©cnica. Suporte nativo a mÃºltiplos gateways de pagamentos criptografados, selos dinÃ¢micos de seguranÃ§a e barreira de proteÃ§Ã£o robusta.",
      specs: ["CertificaÃ§Ã£o SSL InclusÃ£o", "SeguranÃ§a PCI Compliant", "Tempo de Resposta Acelerado", "Faturamento Seguro"],
      badge: "Foco Comercial"
    }
  ];

  // Journey timeline
  const journeySteps = [
    {
      id: 0,
      title: "A Fortaleza e Seus Gigantes",
      label: "DATA CENTERS & SERVIDORES",
      description: "Imagine os servidores como titas de processamento operando dentro de data centers de seguranÃ§a maxima. Eles sÃ£o guardiaes de alta performance que nunca adormecem, alimentados por canais de energia redundante para manter seus arquivos vivos a cada fraÃ§Ã£o de milissegundo.",
      metric: "99.99% Uptime Seguro"
    },
    {
      id: 1,
      title: "Os Sentinelas de Fronteira",
      label: "PROTOCOLOS DE SEGURANÃ‡A",
      description: "Nas portas da fortaleza digital, barramentos de firewalls de Ãºltima geraÃ§Ã£o e criptografia SSL/TLS atuam como vigilantes. Eles barram invasÃµes indesejadas, blindam acessos indevidos e garantem transaÃ§Ãµes criptografadas perfeitas em tempo real.",
      metric: "ReduÃ§Ã£o de Riscos 100%"
    },
    {
      id: 2,
      title: "O ArtesÃ£o da Alta Performance",
      label: "MANUTENaaO & ENGENHARIA",
      description: "Paralelamente, a engenharia dedicada da TAG08 sintoniza finamente cada engrenagem da sua aplicaÃ§Ã£o. Auditorias, revisaes regulares, atualizaÃ§Ãµes de temas/plugins e backups preventivos se combinam de forma artastica para polir seu site continuamente.",
      metric: "Updates Proativos"
    }
  ];

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pt-28 pb-16 relative overflow-hidden selection:bg-brand selection:text-black">
      {/* Dynamic Backing Effects & Tech Grids */}
      <div className="absolute inset-0 radial-grid opacity-[0.25] pointer-events-none z-0" />
      <div className="absolute top-[8%] left-[-15%] w-[650px] h-[650px] bg-brand/[0.015] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[650px] h-[650px] bg-brand/[0.02] rounded-full blur-[160px] pointer-events-none" />

      {/* Subtle Floating 3D Vector Background element */}
      <Subtle3DCanvas intensity={1.1} className="absolute right-[-6%] top-[4%] w-[500px] h-[500px] opacity-[0.4] mix-blend-screen hidden lg:block" />

      {/* SEO META HELPER */}
      <div className="sr-only">
        <h2>Hospedagem e ManutenÃ§Ã£o de Sites: SoluÃ§Ãµes Completas para o Sucesso Online - AgÃªncia TAG08</h2>
        <p>Descubra soluÃ§Ãµes inovadoras em hospedagem e manutenÃ§Ã£o de sites com a AgÃªncia TAG08. Expertise, seguranÃ§a e suporte personalizado para elevar seu negÃ³cio no mundo digital. Explore agora!</p>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 space-y-20 md:space-y-32">
        
        {/* HERO SECTION: DIGITAL PORTAL */}
        <section className="pt-8 sm:pt-16 pb-6 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <span className="font-mono text-[9px] text-brand bg-brand/10 border border-brand/20 px-3 py-1 rounded-md inline-flex items-center gap-1.5 uppercase tracking-widest font-black">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> INFRAESTRUTURA DE SOBERANIDADE CORPORATIVA
              </span>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-[1.0] tracking-tighter">
                HOSPEDAGEM E MANUTENaaO: <br />
                <span className="text-brand">SEU PORTAL PARA O FUTURO DIGITAL.</span>
              </h1>
            </div>
            <div className="lg:col-span-5 space-y-4 pt-1 lg:pt-8">
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans font-medium">
                Bem-vindo ao ecossistema da AgÃªncia TAG08, onde cada byte e pixel Ã© supervisionado por especialistas para garantir que seu site permaneÃ§a estÃ¡vel, rÃ¡pido e confiÃ¡vel. Aqui, nossa jornada de engenharia Ã© guiada por inovaÃ§Ã£o, previsibilidade e suporte contÃ­nuo para sua operaÃ§Ã£o digital.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href="#escolha-plano"
                  className="px-6 py-3.5 bg-brand hover:bg-brand-dark text-black text-[11px] font-sans font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-[0_12px_40px_rgba(var(--color-brand-rgb),0.15)] cursor-pointer"
                >
                  <span>Mapear minha hospedagem</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </a>
                <a
                  href={buildBrazilWhatsAppUrl("Ola%20TAG08!%20Gostaria%20de%20conversar%20sobre%20as%20soluÃ§Ãµes%20de%20Hospedagem%20e%20ManutenÃ§Ã£o%20de%20Sites.")}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3.5 bg-white/[0.02] border border-white/10 hover:border-brand/45 text-white hover:text-brand text-[11px] font-sans font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Falar com especialista</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Hero Main Media - Immersive Server Rack Graphic or Layout */}
          <div className="mt-12 sm:mt-16">
            <ThreeDimensionalTilt className="rounded-[28px] overflow-visible">
              <div className="relative rounded-[28px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1800"
                  alt="Soberania de Servidores e Criptografia Computacional"
                  className="w-full h-full object-cover grayscale brightness-[0.35] group-hover:scale-[1.01] transition-all duration-[1200ms] ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent opacity-80" />
                
                {/* Floating cyber metrics overlays showing maximum telemetry */}
                <div className="absolute inset-x-6 bottom-6 sm:inset-x-10 sm:bottom-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pointer-events-none">
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] text-brand/85 tracking-widest font-bold uppercase block leading-none">
                      ZELADORIA ATIVA EM TEMPO REAL
                    </span>
                    <h3 className="font-display font-black text-white text-xl sm:text-2xl uppercase tracking-tight">
                      PROTEaaO ROBUSTA COM 99.99% UPTIME PROVADO
                    </h3>
                  </div>
                  
                  {/* Mock live monitoring hardware panels */}
                  <div className="flex gap-4 sm:gap-6 bg-black/75 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/15 w-full md:w-auto">
                    <div className="space-y-1 text-left">
                      <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest font-black block leading-none">
                        PING MONITOR
                      </span>
                      <span className="text-brand font-sans font-black text-xs sm:text-sm flex items-center gap-1.5 leading-none">
                        <Activity className="w-4 h-4 animate-pulse stroke-[2.5]" /> 12ms ATIVO
                      </span>
                    </div>
                    <div className="w-px bg-white/10" />
                    <div className="space-y-1 text-left">
                      <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest font-black block leading-none">
                        FIREWALL STATE
                      </span>
                      <span className="text-white font-sans font-black text-xs sm:text-sm flex items-center gap-1.5 leading-none">
                        <Lock className="w-3.5 h-3.5 stroke-[2.5]" /> ENCRYPTED
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ThreeDimensionalTilt>
          </div>
        </section>

        {/* SECTION 2: THE HARMONY - WHAT IS HOSTING & ZELADORIA (Yin & Yang concept) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-center">
            <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/15 px-2.5 py-1 rounded-md inline-block self-start">
              A ESSaNCIA DA VITALIDADE WEB
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase leading-tight tracking-tighter">
              A HARMONIA DO YIN &amp; YANG DA SUA PRESENaA DIGITIAL.
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans font-medium">
              No vasto oceano digital da internet, seu site enfrenta tempestades mecÃ¢nicas silenciosas todos os dias. Para garantir que ele resista com altivez soberana, aplicÃ³mos uma filosofia de equilabrio perfeito.
            </p>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans font-medium">
              NÃ£o se trata apenas de depositar arquivos em uma maquina compartilhada genarica; trata-se de manter uma simbiose de vigilancia que zela pela integridade da infraestrutura fasica enquanto aprimora a inteligÃªncia lagica da aplicaÃ§Ã£o.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#09090b] border border-white/[0.04] p-8 lg:p-10 rounded-[32px] hover:border-brand/35 transition-all duration-300 space-y-6 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mb-1">
                  <Database className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-display font-black text-xl text-white uppercase">
                  A Hospedagem <br />
                  <span className="text-brand font-mono font-normal text-xs tracking-widest block mt-0.5">// O CORaÃ§Ã£o PULSANTE</span>
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                  a o lar digital seguro, acolhedor e blindado onde seus dados residem. Composta por servidores dedicados e estaveis que permanecem conectados em data centers supremos de alta seguranÃ§a, garantindo que seu projeto esteja totalmente visavel para o planeta a qualquer minuto.
                </p>
              </div>
              <span className="font-sans text-[9px] text-zinc-650 group-hover:text-brand transition-colors block">RESIDaNCIA SaLIDA &gt;&gt;</span>
            </div>

            <div className="bg-[#09090b] border border-white/[0.04] p-8 lg:p-10 rounded-[32px] hover:border-brand/35 transition-all duration-300 space-y-6 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mb-1">
                  <RefreshCw className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-display font-black text-xl text-white uppercase">
                  A ManutenÃ§Ã£o <br />
                  <span className="text-brand font-mono font-normal text-xs tracking-widest block mt-0.5">// A ALMA CUIDADOSA</span>
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                  A engrenagem ativa que supervisiona a saÃºde, o vigor e o rejuvenescimento do seu cÃ³digo. Realizamos atualizaÃ§Ãµes periÃ³dicas de CMS, otimizamos bancos de dados, ajustamos blocos de seguranÃ§a tÃ©cnica e aplicÃ³mos patches contra qualquer brecha ou vulnerabilidade silenciosa.
                </p>
              </div>
              <span className="font-sans text-[9px] text-zinc-650 group-hover:text-brand transition-colors block">OTIMIZaÃ§Ã£o PROATIVA &gt;&gt;</span>
            </div>
          </div>
        </section>

        {/* SECTION 5: PILARES & MANUTENaaO REGULAR */}
        <section className="space-y-12 text-left">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="font-mono text-[9px] text-brand bg-brand/10 border border-brand/15 px-3 py-1 rounded inline-block uppercase tracking-widest font-black leading-none">
              DILIGaNCIA SEM CONCESSaES
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tighter leading-none">
              PROCESSOS CONTÃNUOS DE PROTEÃ‡ÃƒO &amp; OTIMIZAÃ‡ÃƒO.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans">
              Zelar pela saÃºde e alto dinamismo da sua presenÃ§a virtual nÃ£o Ã© um esforÃ§o esporÃ¡dico. Operamos em ciclos rÃ­gidos de auditorias periÃ³dicas para garantir que tudo opere em velocidade mÃ¡xima e estabilidade cirÃºrgica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-8 rounded-[28px] bg-white/[0.01] border border-white/[0.04] space-y-6 hover:border-brand/15 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand">
                <FileCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-3">
                <h4 className="text-white text-lg font-display font-black uppercase">ManutenÃ§Ã£o Regular</h4>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                  Realizamos a atualizaÃ§Ã£o sÃ­ncrona de CMSs, plugins essenciais e temas estruturais para fechar lacunas e melhorar a integridade tÃ©cnica das entregas de carregamento.
                </p>
              </div>
              <ul className="space-y-2 pt-2 border-t border-white/5 text-[11px] text-zinc-450 font-sans">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" /> Updates Semanais Certificados</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" /> Testabilidade Pas-deploy</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" /> OtimizaÃ§Ã£o Fina de Banco</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-[28px] bg-white/[0.01] border border-white/[0.04] space-y-6 hover:border-brand/15 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand">
                <Award className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-3">
                <h4 className="text-white text-lg font-display font-black uppercase">Auditorias de SeguranÃ§a</h4>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                  Rigorosas avaliaÃ§Ãµes periÃ³dicas para detectar eventuais scripts invasivos ou brechas, mapeando com absoluta precisÃ£o qualquer vulnerabilidade para rÃ¡pido reparo.
                </p>
              </div>
              <ul className="space-y-2 pt-2 border-t border-white/5 text-[11px] text-zinc-450 font-sans">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" /> Varreduras Heurasticas Ativas</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" /> EmissÃ£o de Relatarios Claros</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" /> Correaao Imediata de Bugs</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-[28px] bg-white/[0.01] border border-white/[0.04] space-y-6 hover:border-brand/15 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-3">
                <h4 className="text-white text-lg font-display font-display font-black uppercase">Fila de Backups e Rollback</h4>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                  Garantimos capias de seguranÃ§a redundantes, de forma que, caso ocorra alguma falha cratica provocÃªda por scripts externos ou erro de operaÃ§Ã£o, o site possa ser restaurado sem sobressaltos.
                </p>
              </div>
              <ul className="space-y-2 pt-2 border-t border-white/5 text-[11px] text-zinc-450 font-sans">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" /> Retenaao Fasico-geografica</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" /> Planos de Reparo Classicos</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" /> Rollback sob Medida e Rapido</li>
              </ul>
            </div>

          </div>
        </section>

        {/* SECTION 3: IMMERSIVE COCKPIT - SERVIDORES & PROTOCOLOS DE seguranÃ§a */}
        <section className="bg-[#050505]/40 border border-white/[0.04] rounded-[40px] p-6 sm:p-10 md:p-14 text-left relative overflow-hidden space-y-12">
          {/* Subtle cyber background grid decoration */}
          <div className="absolute inset-0 radial-grid opacity-[0.14] pointer-events-none" />

          {/* Heading */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end relative z-10 border-b border-white/[0.06] pb-8">
            <div className="lg:col-span-7 space-y-3">
              <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-black leading-none flex items-center gap-1.5">
                <Terminal className="w-4 h-4 animate-pulse text-brand" /> CONTROLE TaTICO &amp; TELEMETRIA
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3.5xl md:text-4xl text-white uppercase leading-none tracking-tight">
                A INFRAESTRUTURA POR TRaS DA BLINDAGEM.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-450 text-xs sm:text-sm font-sans leading-relaxed">
                Nossos pacotes computacionais combinam mÃ¡quinas dedicadas de alta performance com inteligÃªncia cibernÃ©tica integrada, protegendo o legado digital da sua corporaÃ§Ã£o com mÃ¡xima seguranÃ§a contra intrusÃµes maliciosas e ataques de negaÃ§Ã£o de serviÃ§o.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
            
            {/* Left Side: Dynamic Virtual Server Telemetry Center */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-[24px] bg-[#09090b] border border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand animate-ping" />
                    <span className="font-mono text-[10px] text-white/95 font-bold uppercase tracking-widest">SERVIDORES DE ALTA PERFORMANCE VATIVOS</span>
                  </div>
                  <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">NODES INTACT // BR &amp; US</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Tech indicator 1 */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1 text-left">
                    <span className="text-zinc-500 font-mono text-[8px] uppercase font-black tracking-wider block">POTaNCIA GERAL</span>
                    <h4 className="text-white font-display font-black text-base uppercase leading-none">MaXIMO PODER</h4>
                    <p className="text-zinc-455 text-[10.5px] font-sans leading-tight mt-1.5">
                      Processadores de mÃºltiplos nacleos para manter seu site rodando com carregamentos estaveis e ausancia total de lentidao.
                    </p>
                  </div>
                  {/* Tech indicator 2 */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1 text-left">
                    <span className="text-zinc-500 font-mono text-[8px] uppercase font-black tracking-wider block">TECNOLOGIA DE PONTA</span>
                    <h4 className="text-white font-display font-black text-base uppercase leading-none">HARDWARE SSD NVMe</h4>
                    <p className="text-zinc-455 text-[10.5px] font-sans leading-tight mt-1.5">
                      Arquiteturas robustas em estado sÃ³lido e memÃ³ria de alta transferÃªncia computacional para carregar fotos e dados instantaneamente.
                    </p>
                  </div>
                  {/* Tech indicator 3 */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1 text-left">
                    <span className="text-zinc-500 font-mono text-[8px] uppercase font-black tracking-wider block">SUPERVIsÃ£o</span>
                    <h4 className="text-brand font-display font-black text-base uppercase leading-none">MONITORIA 24/7</h4>
                    <p className="text-zinc-455 text-[10.5px] font-sans leading-tight mt-1.5">
                      Sistemas inteligentes que fiscalizam hardware e integridade de arquivos constantemente, alertando tÃ©cnicos proativamente.
                    </p>
                  </div>
                </div>

                {/* Progress bars showing live resources */}
                <div className="space-y-3.5 pt-2">
                  <div className="space-y-1 text-left">
                    <div className="flex justify-between font-sans text-[9px] text-zinc-400 font-black">
                      <span>MaDIA GERAL DE DISPONIBILIDADE (UPTIME)</span>
                      <span className="text-brand">99.99% GARANTIDO</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "99.9%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-brand rounded-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <div className="flex justify-between font-sans text-[9px] text-zinc-400 font-black">
                      <span>BLINDAGEM CONTRA ATAQUES COGNITIVOS DDOS</span>
                      <span className="text-white">FILTRO DE 100% DAS AMEAaAS</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.2, duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-white rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Security Protocols Checklist */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-5 text-left">
                <span className="font-mono text-[9px] text-brand uppercase font-black tracking-widest block leading-none">
                  SISTEMA DE BLINDAGEM ATIVA
                </span>
                <p className="text-zinc-450 text-xs sm:text-sm font-sans leading-relaxed">
                  Tratamos a seguranÃ§a das suas informaÃ§Ãµes de forma minuciosa, integrando camadas tecnolagicas de inteligÃªncia e varreduras com auditora regular:
                </p>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-brand/20 transition-all flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
                      <Shield className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-white text-xs sm:text-sm font-display font-black uppercase">Firewalls e Detecaao de IntrusÃ£o</h4>
                      <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                        Filtros inteligentes que servem como primeira linha de defesa ativa, mitigando acessos maliciosos antes que afetem seus serviÃ§os.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-brand/20 transition-all flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
                      <Key className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-white text-xs sm:text-sm font-display font-black uppercase">Certificados SSL/TLS Avanaados</h4>
                      <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                        Criptografia robusta entre o site e seus visitantes para salvaguardar senhas, dados de pagamentos comerciais e formulÃ¡rios de conversÃ£o.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-brand/20 transition-all flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
                      <Lock className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-white text-xs sm:text-sm font-display font-black uppercase">AtualizaÃ§Ãµes e Patches de SeguranÃ§a ContÃ­nuos</h4>
                      <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                        Fechamento imediato de vulnerabilidades em tempo recorde atravÃ©s de rotinas aplicadas por especialistas em infraestrutura da TAG08.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: THE BEHIND THE SCENES JOURNEY - COMO FUNCIONA */}
        <section className="space-y-12 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-white/[0.04] pb-6">
            <div className="lg:col-span-7 space-y-3">
              <span className="font-mono text-[9px] text-brand uppercase tracking-widest font-black leading-none">
                ENGENHARIA E OPERAÃ§Ãµes // SIMPLICIDADE EXPLICITADA
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4.5xl md:text-5xl text-white uppercase leading-none tracking-tighter">
                COMO FUNCIONA: <br />
                <span className="text-brand">UMA JORNADA POR DETRaS DAS CORTINAS.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Toda grande presenÃ§a corporativa possui segredos de harmonia tÃ©cnica invisaveis aos olhos comuns. Veja abaixo como combinamos hardware soberano e carinho tÃ©cnico em etapas simplificadas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Interactive Steps List Nav */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-3.5">
              {journeySteps.map((step, idx) => {
                const isActive = activeJourney === idx;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveJourney(idx)}
                    className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 w-full flex items-start gap-4 ${
                      isActive
                        ? "bg-[#09090b] border-brand/40 shadow-lg text-white"
                        : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                    }`}
                  >
                    <span className={`font-sans text-xs px-2.5 py-1 rounded-lg font-black leading-none ${
                      isActive ? "bg-brand text-black" : "bg-white/5 text-zinc-500"
                    }`}>
                      0{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <span className="font-mono text-[8px] uppercase tracking-widest font-semibold block text-zinc-500">
                        {step.label}
                      </span>
                      <h4 className={`text-sm sm:text-base font-display font-black uppercase transition-colors ${
                        isActive ? "text-brand" : "text-white"
                      }`}>
                        {step.title}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Display Active Step Dynamic Box */}
            <div className="lg:col-span-7 bg-[#09090b] border border-white/[0.04] rounded-3xl p-8 sm:p-10 flex flex-col justify-between text-left transition-all duration-300 hover:border-brand/15 relative overflow-hidden min-h-[380px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeJourney}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="space-y-6 flex-1 flex flex-col justify-between h-full"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[9px] text-brand bg-brand/10 border border-brand/15 px-2.5 py-1 rounded uppercase font-black">
                        {journeySteps[activeJourney].label}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500">TAG08 EXPERT AUDIT</span>
                    </div>
                    
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                      {journeySteps[activeJourney].title}
                    </h3>
                    
                    <p className="text-zinc-350 text-sm sm:text-base font-sans leading-relaxed font-light">
                      {journeySteps[activeJourney].description}
                    </p>
                  </div>

                  {/* Status footer inside card */}
                  <div className="border-t border-white/5 pt-6 mt-8 flex flex-col sm:flex-row items-center gap-4 justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-brand" />
                      <span className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-wider">MaTRICA ATIVA DE ENTREGA</span>
                    </div>
                    <span className="font-sans text-xs text-brand font-black bg-brand/5 border border-brand/10 px-3 py-1.5 rounded-lg">
                      {journeySteps[activeJourney].metric}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* SECTION 6: CHOOSE THE PERFECT PLAN - CATEGORIZED MATRIX */}
        <section id="escolha-plano" className="space-y-12 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-white/[0.04] pb-6">
            <div className="lg:col-span-7 space-y-3">
              <span className="font-mono text-[9px] text-brand bg-brand/10 border border-brand/15 px-2.5 py-1 rounded inline-block uppercase tracking-widest font-black">
                SELEaaO INTELIGENTE POR NICHO
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4.5xl md:text-5xl text-white uppercase tracking-tighter leading-none">
                ESCOLHA A HOSPEDAGEM PERFEITA <br />
                <span className="text-brand">E COMECE DA MANEIRA CERTA.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Cada estagio comercial necessita de uma dosagem especafica de recursos de servidores e infraestrutura para garantir viabilidade oraamentaria e performance salida. Encontre a ideal abaixo.
              </p>
            </div>
          </div>

          {/* Elegant Category Filter Buttons */}
          <div className="flex flex-wrap gap-2.5 pb-2">
            {[
              { id: "todos", label: "Todos os Setups" },
              { id: "corporativo", label: "Infraestrutura Corporativa" },
              { id: "especializado", label: "Ambientes e Nichos" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setPlanCategory(cat.id as any)}
                className={`px-5 py-2.5 rounded-xl font-mono text-[9px] font-black uppercase tracking-widest transition-all duration-300 pointer-events-auto cursor-pointer border ${
                  planCategory === cat.id
                    ? "bg-brand border-brand text-black shadow-[0_4px_20px_rgba(var(--color-brand-rgb),0.15)]"
                    : "bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:border-white/15"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <motion.div 
              layout 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {hostingTypes
                  .filter((host) => planCategory === "todos" || host.category === planCategory)
                  .map((host) => {
                    const isSelected = selectedHosting === host.id;
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        key={host.id}
                        onClick={() => setSelectedHosting(host.id)}
                        className={`p-6 sm:p-8 rounded-[32px] border cursor-pointer transition-all duration-300 relative flex flex-col justify-between text-left ${
                          isSelected
                            ? "bg-[#09090b] border-brand shadow-[0_15px_45px_rgba(var(--color-brand-rgb),0.06)] scale-[1.01]"
                            : "bg-white/[0.01] border-white/5 hover:border-white/15"
                        }`}
                      >
                        {/* Floating Selection Indicator Badge */}
                        <div className="absolute top-5 right-5 flex items-center gap-1.5">
                          <span className="font-mono text-[8px] text-zinc-500 font-bold uppercase tracking-widest">
                            {host.badge}
                          </span>
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-brand bg-brand text-black" : "border-white/15 bg-transparent"
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <span className="p-2 h-10 w-10 flex items-center justify-center bg-brand/5 border border-brand/10 text-brand rounded-lg">
                            <Server className="w-5 h-5 stroke-[2]" />
                          </span>

                          <div className="space-y-1">
                            <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight leading-tight">
                              {host.title}
                            </h3>
                            <span className="font-mono text-[8px] sm:text-[9.5px] text-brand font-semibold uppercase block leading-none">
                              IDEAL PARA: {host.niche}
                            </span>
                          </div>

                          <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                            {host.description}
                          </p>
                        </div>

                        {/* Built-in high specs lists */}
                        <div className="border-t border-white/[0.05] pt-6 mt-6 space-y-3 justify-end">
                          <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block font-bold leading-none">CARACTERÃSTICAS INCLUSAS:</span>
                          <ul className="space-y-2 text-[11px] sm:text-xs font-sans text-zinc-400">
                            {host.specs.map((spec, sIdx) => (
                              <li key={sIdx} className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" />
                                <span>{spec}</span>
                              </li>
                            ))}
                          </ul>
                          <a
                            href={buildBrazilWhatsAppUrl(`Ola%20TAG08!%20Gostaria%20de%20conversar%20sobre%20a%20soluaao%20de%20"${encodeURIComponent(host.title)}"%20para%20minha%20empresa.`)}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-6 w-full py-3 rounded-xl font-mono text-[10px] font-black uppercase text-center block tracking-widest transition-all duration-300 border bg-white/5 border-white/10 text-white hover:bg-brand hover:border-brand hover:text-black hover:shadow-lg"
                          >
                            Solicitar esta opaao
                          </a>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* SECTION 6.5: VALORES & PLANOS DE REFERaNCIA - TABELA COMPARATIVA DE ALTO CONTRASTE */}
        <section id="planos-diretos" className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-[#030303] rounded-[42px] relative overflow-hidden text-left border border-white/5">
          {/* Subtle Ambient background decorations */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto space-y-12 relative z-10">
            {/* Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-white/[0.04] pb-6">
              <div className="lg:col-span-7 space-y-3">
                <span className="font-mono text-[9px] text-brand bg-brand/10 border border-brand/15 px-2.5 py-1 rounded inline-block uppercase tracking-widest font-black">
                  ALICERCES PADRONIZADOS PRONTOS
                </span>
                <h2 className="font-display font-black text-3xl sm:text-4.5xl md:text-5xl text-white uppercase tracking-tighter leading-none">
                  PLANOS DE HOSPEDAGEM <br />
                  <span className="text-brand">& ZELADORIA REGULAR.</span>
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  Perfeito para empresas que buscam conveniancia absoluta e setups de ponta ja sintonizados de acordo com sua demanda fasica atual. Escolha seu plano com faturamento fixo mensal em cloud.
                </p>
              </div>
            </div>

            {/* High-Contrast Comparative 3-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {[
                {
                  id: "basico",
                  name: "Plano Basico",
                  startingPrice: "R$ 49,00",
                  audience: "Institucionais & Portfalios",
                  purpose: "ValidaÃ§Ã£o Ã¡gil de marcas emergentes, landing pages escalÃ¡veis, blogs jornalasticos e portfalios elegantes de alto impacto.",
                  accentBorder: "border-white/5",
                  bgCard: "bg-[#0b0c0e] hover:border-white/12",
                  highlightBadge: null,
                  resources: [
                    { label: "Armazenamento", value: "5 GB SSD NVMe", tooltip: "Solid State Drives corporativos com taxas de transferÃªncia ultrarrÃ¡pidas, carregando imagens e pÃ¡ginas instantaneamente." },
                    { label: "Emails Profissionais", value: "10 Contas inclusas", tooltip: "Contas personalizadas com seu domÃ­nio (seu@nome.com.br) com proteÃ§Ã£o nativa contra spam e gateway corporativo." },
                    { label: "Trafego Mensal", value: "500 GB de Volume", tooltip: "Banda larga de dados expansiva apta para resistir a navegaÃ§Ã£o constante de milhares de visitantes." },
                    { label: "Bancos de Dados", value: "1 Banco MySQL", tooltip: "Base estruturada e blindada ideal para sustentar o banco de dados principal do seu WordPress ou aplicaÃ§Ã£o sÃªnior." },
                    { label: "Zeladoria Regular", value: "Updates Trimestrais", tooltip: "RevisÃ£o e atualizaÃ§Ãµes proativas a cada 3 meses sob demanda para certificar que seus plugins e temas estejam saudÃ¡veis." },
                    { label: "CertificaÃ§Ã£o SSL", value: "Let's Encrypt Incluso", tooltip: "Criptografia HTTPS de seguranÃ§a maxima ativa para proteÃ§Ã£o de dados sensaveis e melhor ranqueamento no algoritmo de buscas." },
                  ]
                },
                {
                  id: "intermediario",
                  name: "Plano Intermediario",
                  startingPrice: "R$ 99,00",
                  audience: "Pequenos E-commerces & Empresas",
                  purpose: "Ideal para empresas em crescimento estavel, portais comerciais e marcas que investem em captaÃ§Ã£o contÃ­nua em trafego pago.",
                  accentBorder: "border-brand/45",
                  bgCard: "bg-[#090a0d] border-brand/40 shadow-[0_15px_45px_rgba(var(--color-brand-rgb),0.04)]",
                  highlightBadge: "MAIS RECOMENDADO",
                  resources: [
                    { label: "Armazenamento", value: "15 GB SSD NVMe", tooltip: "Armazenamento corporativo expandido, ideal para catÃ¡logos de produtos com muitas fotos e mÃ­dias ricas." },
                    { label: "Emails Profissionais", value: "50 Contas inclusas", tooltip: "Franquia sob medida para organizar todos os seus canais: suporte, financeiro, parcerias e conselho." },
                    { label: "Trafego Mensal", value: "2 TB de Volume", tooltip: "Franquia colossal desenvolvida para aguentar surtos reais de visitas gerados por investimentos no Meta Ads ou Google Ads." },
                    { label: "Bancos de Dados", value: "5 Bancos MySQL", tooltip: "Oferece flexibilidade total para instalar e hospedar subsistemas, ambientes de teste isolados ou Ã¡reas de membro." },
                    { label: "Zeladoria Regular", value: "Updates Mensais", tooltip: "Zeladoria tÃ©cnica proativa a cada 30 dias com limpeza preventiva do WP, otimizaÃ§Ã£o de consultas lentas e anÃ¡lise de vulnerabilidade." },
                    { label: "CÃ³pia Preventiva", value: "Backup Semanal Isolado", tooltip: "Backup adicional de seguranÃ§a periÃ³dico gerado e copiado automaticamente para um data center secundÃ¡rio isolado." },
                  ]
                },
                {
                  id: "avancado",
                  name: "Plano Avanaado",
                  startingPrice: "R$ 199,00",
                  audience: "Marcas Premium & Alto Volume",
                  purpose: "A engrenagem topo de linha perfeita para portais institucionais complexos, lojas virtuais massivas e marcas premium com trafego intenso.",
                  accentBorder: "border-brand",
                  bgCard: "bg-[#0d0e11] border-brand shadow-[0_20px_50px_rgba(var(--color-brand-rgb),0.08)]",
                  highlightBadge: "POTaNCIA TOTAL CORPORATIVA",
                  resources: [
                    { label: "Armazenamento", value: "30 GB SSD NVMe", tooltip: "Armazenamento ultrarrÃ¡pido premium com CPU prioritaria dedicada e limites de IOPS elevados para tolerancia zero a latancia." },
                    { label: "Emails Profissionais", value: "Contas ILIMITADAS", tooltip: "Crie quantas caixas corporativas sua operaÃ§Ã£o necessitar sem qualquer cobranÃ§a por caixas extras. Liberdade total para novos funcionÃ¡rios." },
                    { label: "Trafego Mensal", value: "4.5 TB de Volume", tooltip: "Vazao de dados monumental capaz de suportar lanaamentos robustos de infoprodutos, campanhas agressivas e Black Fridays." },
                    { label: "Bancos de Dados", value: "Bancos ILIMITADOS", tooltip: "Flexibilidade para hospedar mÃºltiplos bancos de dados para CRM interno, mÃºltiplos e-commerces paralelos ou integraÃ§Ãµes complexas." },
                    { label: "Zeladoria Regular", value: "Analise Semanal Ativa", tooltip: "Zeladoria tÃ©cnica de alto nÃ­vel com testes periÃ³dicos de vulnerabilidade externa, otimizaÃ§Ã£o intensiva de banco e monitoramento ativo." },
                    { label: "AceleraÃ§Ã£o Global", value: "CDN Giga Integrada", tooltip: "Roteamento global que entrega arquivos estÃ¡ticos e de madia praximos ao local de acesso de cada usuario, reduzindo latancia em ata 80%." },
                  ]
                }
              ].map((plan) => (
                <div
                  key={plan.id}
                  className={`p-8 rounded-[32px] border flex flex-col justify-between transition-all duration-300 relative text-left ${plan.accentBorder} ${plan.bgCard}`}
                >
                  {plan.highlightBadge && (
                    <div className="absolute top-5 right-5 font-sans text-[7px] tracking-widest font-black uppercase bg-brand text-black px-2.5 py-1 rounded">
                      {plan.highlightBadge}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <span className="font-mono text-[8px] text-brand font-black uppercase tracking-widest block">
                        {plan.audience}
                      </span>
                      <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                        {plan.name}
                      </h3>
                      <p className="text-zinc-400 text-xs font-sans leading-relaxed pt-2 border-b border-white/[0.04] pb-4">
                        {plan.purpose}
                      </p>
                    </div>

                    <div className="py-2 border-b border-white/[0.04] pb-6 flex items-baseline gap-1.5">
                      <span className="text-zinc-500 font-mono text-[8.5px] uppercase">INVESTIMENTO INTEGRAL:</span>
                      <span className="font-sans text-3xl font-black text-white">{plan.startingPrice}</span>
                      <span className="text-zinc-500 text-xs font-sans">/mas</span>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4 pt-2">
                      <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block font-bold">REQUISITOS TaCNICOS INTEGRADOS:</span>
                      <ul className="space-y-2.5">
                        {plan.resources.map((res, rIdx) => (
                          <li key={rIdx} className="flex items-center justify-between group/feat py-0.5 border-b border-white/[0.02]">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                              <span className="text-xs text-zinc-300 font-medium">{res.value}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-zinc-500 font-sans hidden sm:inline-block opacity-0 group-hover/feat:opacity-85 transition-opacity">
                                {res.label}
                              </span>
                              <div className="relative group/tool inline-flex items-center">
                                <HelpCircle className="w-3.5 h-3.5 text-zinc-600 hover:text-brand cursor-help transition-colors select-none" />
                                <div className="absolute bottom-full right-0 mb-3 w-64 bg-[#0a0a0c] border border-white/10 text-zinc-300 text-xs p-4 rounded-xl opacity-0 pointer-events-none group-hover/tool:opacity-100 transition-opacity duration-200 shadow-2xl z-50 leading-relaxed font-sans normal-case tracking-normal">
                                  <div className="absolute top-full right-1.5 border-[6px] border-transparent border-t-[#0a0a0c] w-0 h-0" />
                                  <div className="font-mono text-[8.5px] text-brand font-black uppercase tracking-wider mb-1.5">
                                    {res.label}
                                  </div>
                                  {res.tooltip}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8 mt-8 border-t border-white/[0.04]">
                    <a
                      href={buildBrazilWhatsAppUrl(`${encodeURIComponent(
                        `Ola TAG08! Gostaria de conversar com os engenheiros comerciais para fechar a contrataÃ§Ã£o do "${plan.name.toUpperCase()}" de Hospedagem & Zeladoria no valor recorrente de ${plan.startingPrice}/mas. Aguardo retorno!`
                      )}`)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-4 rounded-xl bg-white hover:bg-brand hover:text-black hover:border-brand text-[#030303] font-mono text-[10px] font-black uppercase text-center block tracking-widest transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] shadow-md border border-white/10"
                    >
                      CONTRATAR ESTE ALICERCE
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-6 text-center">
              <span className="text-zinc-550 font-sans text-[9px] uppercase tracking-widest block leading-relaxed">
                * Todos os planos de alicerce contam com isolamento de kernel virtual, mitigaÃ§Ã£o ativa de DDoS de 50 Gbps e suporte a SSL Let's Encrypt gratuito com updates proativos incluados.
              </span>
            </div>
          </div>
        </section>

        {/* INTERACTIVE CONFIGURATOR / PLAN SIMULATOR */}
        <section id="simulator-section" className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand/[0.015] rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand/[0.01] rounded-full blur-[160px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />

          <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[40px] bg-[#0c0c0e] border border-white/[0.05] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(215,255,0,0.012)_1.5px,transparent_1.5px)] [background-size:32px_32px] pointer-events-none" />

            <div className="relative z-10 space-y-12">
              {/* Simulator Header */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-white/[0.06] pb-10">
                <div className="lg:col-span-7 space-y-4 text-left">
                  <span className="font-mono text-[9px] text-brand bg-brand/10 border border-brand/20 px-3 py-1 rounded inline-block uppercase tracking-widest font-black">
                    CUSTOMIZaÃ§Ã£o EM REAL-TIME
                  </span>
                  <h2 className="font-display font-black text-3.5xl sm:text-4.5xl md:text-5.5xl text-white uppercase tracking-tighter leading-none">
                    MONTE SEU SETUP <br />
                    <span className="text-brand">SOB MEDIDA.</span>
                  </h2>
                </div>
                <div className="lg:col-span-5 text-left">
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed border-l-2 border-brand/20 pl-4">
                    Selecione o estagio fasico de partida que melhor traduz o momento atual do seu negÃ³cio e adicione recursos dedicados de forma fluida. O simulador reajusta os valores instantaneamente.
                  </p>
                </div>
              </div>

              {/* Step 1: Base Engine Selector tabs */}
              <div className="space-y-6 text-left">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
                  <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest block font-black">PASSO #01 // DEFINA SEU ENGINE DE SERVIDOR (CPU & RAM BASE)</span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {[
                    {
                      id: "basico",
                      name: "CLOUD SOLO",
                      cpu: "1 vCPU Dedicada",
                      ram: "1 GB RAM",
                      audience: "1 Core de Processamento",
                      purpose: "Motor leve perfeito para landing pages, sites institucionais padrÃ£o e blogs jornalÃ­sticos focados em velocidade.",
                      startingPrice: "R$ 49,00",
                      badge: "V-Core Alpha I",
                    },
                    {
                      id: "intermediario",
                      name: "CLOUD DUO",
                      cpu: "2 vCPUs Dedicadas",
                      ram: "4 GB RAM",
                      audience: "2 Cores de Processamento",
                      purpose: "Processamento duplicado calibrado para suportar mÃºltiplos portais comerciais, pequenos e-commerces e trafego estavel.",
                      startingPrice: "R$ 99,00",
                      badge: "V-Core Pro II",
                    },
                    {
                      id: "avancado",
                      name: "CLOUD QUAD",
                      cpu: "4 vCPUs Dedicadas",
                      ram: "8 GB RAM",
                      audience: "4 Cores de Processamento",
                      purpose: "Motor bruto em ambiente isolado focado em portais corporativos complexos, lojas virtuais ativas e picos severos de acessos.",
                      startingPrice: "R$ 199,00",
                      badge: "V-Core Scaler IV",
                    }
                  ].map((p) => {
                    const isActive = simPlan === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => handlePlanChange(p.id as any)}
                        className={`group/card p-6 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 relative cursor-pointer outline-none select-none ${
                          isActive
                            ? "bg-[#0b0b0e] border-brand text-white shadow-[0_0_40px_rgba(var(--color-brand-rgb),0.06)]"
                            : "bg-[#121214]/40 border-white/5 text-zinc-400 hover:border-white/12 hover:bg-[#121214]/65"
                        }`}
                      >
                        {/* Selected Indicator Badge */}
                        <div className="absolute top-4 right-4 flex items-center gap-1.5">
                          {isActive ? (
                            <span className="font-sans text-[7px] font-black uppercase text-black bg-brand px-2 py-0.5 rounded shadow-[0_0_10px_rgba(var(--color-brand-rgb),0.2)] animate-pulse">
                              ENGINE BASE ATIVO
                            </span>
                          ) : (
                            <span className="font-sans text-[7px] text-zinc-600 group-hover/card:text-zinc-400 transition-colors uppercase font-black bg-white/5 border border-white/5 px-2 py-0.5 rounded leading-none">
                              {p.badge}
                            </span>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <span className={`text-[8px] font-mono font-black uppercase tracking-widest block transition-colors ${isActive ? "text-brand" : "text-zinc-500 group-hover/card:text-zinc-400"}`}>
                              {p.audience}
                            </span>
                            <h3 className="font-display font-black text-sm uppercase tracking-tight text-white block">
                              {p.name}
                            </h3>
                          </div>

                          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans border-b border-white/[0.04] pb-4">
                            {p.purpose}
                          </p>

                          <div className="grid grid-cols-2 gap-2 text-left font-sans text-[9px]">
                            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
                              <span className="block text-zinc-600 text-[7px] uppercase font-bold tracking-wider">MaQUINA CPU:</span>
                              <span className="text-zinc-300 font-bold">{p.cpu}</span>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
                              <span className="block text-zinc-650 text-[7px] uppercase font-bold tracking-wider">MaQUINA RAM:</span>
                              <span className="text-zinc-300 font-bold">{p.ram}</span>
                            </div>
                          </div>

                          <div className="py-2 flex items-baseline gap-1">
                            <span className="text-zinc-500 text-[8px] font-mono uppercase tracking-widest">CUSTO DO ENGINE:</span>
                            <span className={`font-sans text-xl font-black transition-colors ${isActive ? "text-brand" : "text-zinc-300"}`}>
                              {p.startingPrice}
                            </span>
                            <span className="text-[9px] text-zinc-500 font-sans leading-none">/Mas</span>
                          </div>
                        </div>

                        <div className={`mt-4 pt-3 border-t border-white/[0.04] text-center font-mono text-[8px] uppercase font-black tracking-widest transition-all ${
                          isActive 
                            ? "text-brand" 
                            : "text-zinc-500 group-hover/card:text-zinc-350"
                        }`}>
                          {isActive ? "? SOLUaaO ACOPLADA AO TRABALHO DE CUSTOMIZaÃ§Ã£o" : "[-] CLIQUE SELECIONAR E CUSTOMIZAR"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Simulator Core Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
                
                {/* Left Controls Box */}
                <div className="lg:col-span-7 space-y-8 bg-[#121214]/25 border border-white/[0.05] rounded-3xl p-6 sm:p-8 text-left backdrop-blur-sm">
                  
                  {/* Control 1: Websites */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="font-mono text-[8.5px] text-brand uppercase tracking-wider block font-black">RECURSO #02 // MULTI-SITES</span>
                        <h3 className="text-white font-bold text-sm sm:text-base uppercase tracking-tight">Namero de Sites Hospedados</h3>
                        <p className="text-zinc-400 text-xs font-sans">Quantos portais independentes irao compartilhar estes recursos isolados?</p>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-black/60 border border-white/10 rounded-xl p-1.5 shrink-0 self-start sm:self-center">
                        <button
                          onClick={() => setSimSites(Math.max(1, simSites - 1))}
                          disabled={simSites <= 1}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 disabled:opacity-30 text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer border border-white/5"
                        >
                          -
                        </button>
                        <span className="font-sans font-black text-white text-base w-8 text-center">
                          {simSites}
                        </span>
                        <button
                          onClick={() => setSimSites(Math.min(10, simSites + 1))}
                          disabled={simSites >= 10}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 disabled:opacity-30 text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer border border-white/5"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Visual Meter bar chart with glowing blocks */}
                    <div className="space-y-2">
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden flex gap-0.5 p-[1px]">
                        {Array.from({ length: 10 }).map((_, idx) => {
                          const isFilled = idx < simSites;
                          return (
                            <div
                              key={idx}
                              className={`h-full flex-1 rounded-sm transition-all duration-300 ${
                                isFilled 
                                  ? "bg-brand shadow-[0_0_10px_rgba(var(--color-brand-rgb),0.4)]" 
                                  : "bg-white/5"
                              }`}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-between font-sans text-[8px] text-zinc-550">
                        <span>1 PORTAL INICIAL (INCLUSO)</span>
                        <span>MaXIMO: 10 PORTAIS CONVIVENTES</span>
                      </div>
                    </div>

                    {simSites > 1 && (
                      <span className="text-[10px] text-zinc-500 font-sans block pl-2 border-l border-brand/30">
                        * Incluso 1 site base gratuito. Cada portal adicional: <strong>+ R$ 50,00/mas</strong>.
                      </span>
                    )}
                  </div>

                  {/* Control 2: Storage Slider & Preset Badges */}
                  <div className="space-y-4 border-t border-white/[0.05] pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="font-mono text-[8.5px] text-brand uppercase tracking-wider block font-black">RECURSO #03 // ARMAZENAMENTO ULTRA-RAW</span>
                        <h3 className="text-white font-bold text-sm sm:text-base uppercase tracking-tight">Espaao de Disco SSD NVMe Dedicado</h3>
                        <p className="text-zinc-400 text-xs font-sans">
                          Sua maquina conta com discos SSD corporativos com taxas de leitura de ata 7.000 MB/s.
                        </p>
                      </div>
                      <span className="font-sans font-black text-brand text-sm sm:text-base bg-brand/10 px-3.5 py-1.5 rounded-lg border border-brand/20 shrink-0 self-start sm:self-center shadow-[0_0_15px_rgba(var(--color-brand-rgb),0.05)]">
                        {simStorage} GB SSD
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Range Input element wrapper */}
                      <div className="relative pt-1">
                        <input
                          type="range"
                          min={simPlan === "basico" ? 5 : simPlan === "intermediario" ? 15 : 30}
                          max={simPlan === "basico" ? 50 : simPlan === "intermediario" ? 100 : 300}
                          step="5"
                          value={simStorage}
                          onChange={(e) => setSimStorage(parseInt(e.target.value))}
                          className="w-full accent-brand bg-white/10 h-1.5 rounded-lg cursor-pointer hover:bg-white/15 transition-all"
                        />
                        <div className="flex justify-between font-sans text-[8.5px] text-zinc-500 mt-1">
                          <span>Min: {simPlan === "basico" ? "5 GB (Basico)" : simPlan === "intermediario" ? "15 GB (Madio)" : "30 GB (Alto)"}</span>
                          <span>Max: {simPlan === "basico" ? "50 GB" : simPlan === "intermediario" ? "100 GB" : "300 GB"}</span>
                        </div>
                      </div>

                      {/* UX Upgrade: Clickable Storage Presets */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="font-mono text-[8px] text-zinc-550 uppercase tracking-wider flex items-center pr-1.5">Atalhos rÃ¡pidos:</span>
                        {(simPlan === "basico" 
                          ? [5, 15, 30, 50] 
                          : simPlan === "intermediario" 
                            ? [15, 30, 60, 100] 
                            : [30, 60, 150, 300]
                        ).map((presetVal) => (
                          <button
                            key={presetVal}
                            onClick={() => setSimStorage(presetVal)}
                            className={`px-3 py-1 rounded-md font-mono text-[9px] uppercase transition-all cursor-pointer ${
                              simStorage === presetVal
                                ? "bg-brand text-black font-black shadow-[0_2px_8px_rgba(var(--color-brand-rgb),0.2)]"
                                : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {presetVal} GB
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <span className="text-[10px] text-zinc-500 font-sans block pl-2 border-l border-brand/35">
                      {simPlan === "basico" && `* 5 GB inclusos. Adicional: R$ 3,00 por GB ao mas.`}
                      {simPlan === "intermediario" && `* 15 GB inclusos. Adicional: R$ 5,00 por GB ao mas.`}
                      {simPlan === "avancado" && `* 30 GB inclusos. Adicional: R$ 10,00 por GB ao mas.`}
                    </span>
                  </div>

                  {/* Control 3: Emails Selector */}
                  <div className="space-y-4 border-t border-white/[0.05] pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="font-mono text-[8.5px] text-brand uppercase tracking-wider block font-black">RECURSO #04 // EMAILS CORPORATIVOS</span>
                        <h3 className="text-white font-bold text-sm sm:text-base uppercase tracking-tight">Caixas de E-mail Profissionais</h3>
                        <p className="text-zinc-400 text-xs font-sans font-light">Contas personalizadas @suamarca para comunicaÃ§Ã£o direta, contendo isolamento anti-spam de ponta.</p>
                      </div>

                      {simPlan === "avancado" ? (
                        <span className="font-mono font-black text-black text-[9px] tracking-widest bg-brand px-3.5 py-1.5 rounded-lg shrink-0 self-start sm:self-center shadow-[0_0_15px_rgba(var(--color-brand-rgb),0.1)]">
                          ILIMITADAS INCLUSAS
                        </span>
                      ) : (
                        <div className="flex items-center gap-3 bg-black/60 border border-white/10 rounded-xl p-1.5 shrink-0 select-none self-start sm:self-center">
                          <button
                            onClick={() => {
                              const step = simPlan === "basico" ? 5 : 10;
                              const min = simPlan === "basico" ? 10 : 50;
                              setSimEmails(Math.max(min, simEmails - step));
                            }}
                            disabled={simEmails <= (simPlan === "basico" ? 10 : 50)}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 disabled:opacity-30 text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer border border-white/5"
                          >
                            -
                          </button>
                          <span className="font-sans font-black text-white text-base w-10 text-center">
                            {simEmails}
                          </span>
                          <button
                            onClick={() => {
                              const step = simPlan === "basico" ? 5 : 10;
                              setSimEmails(Math.min(200, simEmails + step));
                            }}
                            disabled={simEmails >= 200}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 disabled:opacity-30 text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer border border-white/5"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-zinc-550 block font-sans">
                      {simPlan === "basico" && "* 10 contas inclusas nativamente. Caixa extra: R$ 5,00 por lote de 5 e-mails."}
                      {simPlan === "intermediario" && "* 50 contas inclusas nativamente. Caixa extra: R$ 10,00 por lote de 10 e-mails."}
                      {simPlan === "avancado" && "* Caixa premium sem limite fasico de contas no plano corporativo avanaado."}
                    </span>
                  </div>

                  {/* Control 4: Active Upgrade */}
                  <div className="space-y-4 border-t border-white/[0.05] pt-6">
                    <div className="space-y-1">
                      <span className="font-mono text-[8.5px] text-brand uppercase tracking-wider block font-black">RECURSO #05 // ZELADORIA E ADICIONAIS</span>
                      <h3 className="text-white font-bold text-sm sm:text-base uppercase tracking-tight">Opcional TÃ©cnico de Alta Performance</h3>
                      <p className="text-zinc-400 text-xs font-sans">Turbine sua operaÃ§Ã£o com auditoria especializada de seguranÃ§a e canais prioritarios exclusivos.</p>
                    </div>

                    <div className="pt-1">
                      <div
                        onClick={() => setSimApplyUpgrade(!simApplyUpgrade)}
                        className={`p-4 rounded-2xl border text-left flex items-start gap-4 cursor-pointer transition-all duration-300 select-none ${
                          simApplyUpgrade
                            ? "bg-brand/[0.02] border-brand text-white shadow-[0_8px_30px_rgba(var(--color-brand-rgb),0.04)]"
                            : "bg-black/20 border-white/5 text-zinc-400 hover:border-white/12"
                        }`}
                      >
                        <div className="pt-0.5 shrink-0">
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            simApplyUpgrade ? "bg-brand border-brand text-black" : "border-zinc-750 bg-black/50"
                          }`}>
                            {simApplyUpgrade && <span className="text-xs font-black">?</span>}
                          </div>
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="font-mono text-[9px] font-black uppercase tracking-wider bg-white/5 px-2.5 py-0.5 rounded text-white inline-block">
                              {simPlan === "basico" && "AUDITORIA & SUPORTE SaNIOR"}
                              {simPlan === "intermediario" && "BACKUP AGRESSIVO SEMANAL EXTRA"}
                              {simPlan === "avancado" && "CANAL REATIVO PRIORITaRIO (VIP)"}
                            </span>
                            <span className="font-sans text-[10.5px] text-brand font-black">
                              {simPlan === "basico" && "+ R$ 15,00/mas"}
                              {simPlan === "intermediario" && "+ R$ 20,00/mas"}
                              {simPlan === "avancado" && "+ R$ 50,00/mas"}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 font-sans leading-snug">
                            {simPlan === "basico" && "Correaao tÃ©cnica preferencial e monitoramento de indisponibilidade de forma ativa."}
                            {simPlan === "intermediario" && "CriaÃ§Ã£o de backup adicional guardado em segundo data-center independente (proteÃ§Ã£o maxima)."}
                            {simPlan === "avancado" && "Acesso direto via link telefanico aos engenheiros de infra da TAG08 (Tempo de reaÃ§Ã£o < 15 min)."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Receipt & Summary Box */}
                <div className="lg:col-span-5 bg-[#08080a] border border-white/[0.08] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden text-left shadow-2xl">
                  {/* Subtle top decoration */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[linear-gradient(90deg,var(--color-brand)_0%,#000000_100%)]" />
                  <div className="absolute top-0 right-0 w-36 h-36 bg-brand/[0.02] rounded-full blur-3xl pointer-events-none" />

                  <div className="space-y-6">
                    <div className="border-b border-white/[0.06] pb-4 space-y-1">
                      <span className="font-mono text-[8px] text-brand uppercase tracking-widest block font-bold">FECHAMENTO CONSOLIDADO</span>
                      <h3 className="font-display font-black text-white text-lg sm:text-xl uppercase tracking-tight">RESUMO DA INFRAESTRUTURA</h3>
                    </div>

                    {/* Receipt Details with jagged visual dividers */}
                    <div className="space-y-3 font-sans text-zinc-400 text-xs pb-4 border-b border-dashed border-white/10">
                      {/* Plan base entry */}
                      <div className="flex justify-between items-center text-zinc-300">
                        <span className="uppercase font-bold text-white">
                          {simPlan === "basico" ? "Engine Cloud Solo" : simPlan === "intermediario" ? "Engine Cloud Duo" : "Engine Cloud Quad"}
                        </span>
                        <span className="text-white font-bold">
                          R$ {simPlan === "basico" ? "49,00" : simPlan === "intermediario" ? "99,00" : "199,00"}
                        </span>
                      </div>
                      
                      {/* Additional sites line */}
                      {simSites > 1 && (
                        <div className="flex justify-between items-center text-[11px] pl-3 border-l border-white/5">
                          <span className="text-zinc-500">. {simSites - 1} Portal(is) Adicionais</span>
                          <span className="text-white font-medium">+ R$ {((simSites - 1) * 50).toFixed(2)}</span>
                        </div>
                      )}

                      {/* Storage line compute */}
                      {((simPlan === "basico" && simStorage > 5) || 
                        (simPlan === "intermediario" && simStorage > 15) || 
                        (simPlan === "avancado" && simStorage > 30)) && (
                        <div className="flex justify-between items-center text-[11px] pl-3 border-l border-white/5">
                          <span className="text-zinc-500">
                            . +{simStorage - (simPlan === "basico" ? 5 : simPlan === "intermediario" ? 15 : 30)} GB SSD extra
                          </span>
                          <span className="text-white font-medium">
                            + R$ {(
                              simPlan === "basico" 
                                ? (simStorage - 5) * 3 
                                : simPlan === "intermediario" 
                                  ? (simStorage - 15) * 5 
                                  : (simStorage - 30) * 10
                            ).toFixed(2)}
                          </span>
                        </div>
                      )}

                      {/* Emails line compute */}
                      {((simPlan === "basico" && simEmails > 10) || 
                        (simPlan === "intermediario" && simEmails > 50)) && (
                        <div className="flex justify-between items-center text-[11px] pl-3 border-l border-white/5">
                          <span className="text-zinc-500">
                            . +{simEmails - (simPlan === "basico" ? 10 : 50)} Caixas de E-mail
                          </span>
                          <span className="text-white font-medium">
                            + R$ {(
                              simPlan === "basico"
                                ? Math.ceil((simEmails - 10) / 5) * 5
                                : Math.ceil((simEmails - 50) / 10) * 10
                            ).toFixed(2)}
                          </span>
                        </div>
                      )}

                      {/* Upgrade line compute */}
                      {simApplyUpgrade && (
                        <div className="flex justify-between items-center text-[11px] pl-3 border-l border-brand/20 text-brand">
                          <span>
                            . TÃ©cnico: {simPlan === "basico" ? "Auditoria e Suporte" : simPlan === "intermediario" ? "Backup Extra" : "Atendimento VIP"}
                          </span>
                          <span className="font-bold">
                            + R$ {simPlan === "basico" ? "15,00" : simPlan === "intermediario" ? "20,00" : "50,00"}
                          </span>
                        </div>
                      )}

                      <div className="pt-2 text-[9px] leading-relaxed text-zinc-550 font-sans border-t border-white/[0.04] mt-2">
                        ? Integrado por Definiaao: IsolaÃ§Ã£o cPanel/WHM, SSL Criptografico Ilimitado, MitigaÃ§Ã£o Ativa de DDoS e Trafego Mensal Integridade.
                      </div>
                    </div>

                    {/* UX Upgrade: Real-Time Consultative Diagnosis Advisor */}
                    <div className="bg-[#121214]/60 border border-white/5 p-4 rounded-2xl space-y-2 transition-all">
                      <div className="flex items-center gap-1.5 font-sans text-[9px] text-brand font-black">
                        <Zap className="w-3.5 h-3.5 text-brand shrink-0 animate-pulse" />
                        <span>DIAGNaSTICO ESTRATaGICO TAG08</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                        {simPlan === "basico" && simStorage <= 15 && (
                          "Gargalo TÃ©cnico: Baixo. Excelente relaÃ§Ã£o custo-benefacio para marcas novas que validam landing pages e sistemas basicos."
                        )}
                        {simPlan === "basico" && simStorage > 15 && (
                          "Atributo Expandido: VocÃª turbinou o espaao em disco do plano basico. Se os portais comeaarem a crescer ou receber blogs com muitas fotos, migrar para o plano Intermediario otimiza o ganho por GB extra."
                        )}
                        {simPlan === "intermediario" && simSites <= 1 && (
                          "Diagnastico Avanaado: ConfiguraÃ§Ã£o corporativa equilibrada. Salido para portais comerciais que dependem de constÃ¢ncia em SEO e carregamentos menores que 1.2 segundos."
                        )}
                        {simPlan === "intermediario" && simSites > 1 && (
                          "Aviso Multissite: Os recursos fasicos serao distribuados entre as marcas de forma equilibrada. Pra-ativo no gerenciamento simultaneo com proteÃ§Ã£o centralizada."
                        )}
                        {simPlan === "avancado" && (
                          "Soberania Digital: Ideal para redes de lojas virtuais de alto trafego com carrinhos simultaneos ou sistemas corporativos escalÃ¡veis de grande alcance."
                        )}
                      </p>
                    </div>

                    {/* Dynamic Cost Display Widget */}
                    <div className="bg-[#111113] border border-white/5 rounded-2xl p-5 space-y-1.5 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-inner">
                      <div className="absolute inset-0 bg-brand/[0.005] pointer-events-none" />
                      <span className="font-mono text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">VALOR MENSAL TOTAL ESTIMADO</span>
                      
                      <div className="flex items-baseline justify-center gap-1.5 pt-1">
                        <span className="font-sans text-white text-xs sm:text-sm font-bold">R$</span>
                        <motion.span 
                          key={calculateSimulatedPrice()}
                          initial={{ opacity: 0, y: -4, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className="font-display font-black text-brand text-3.5xl sm:text-4.5xl tracking-tighter"
                        >
                          {calculateSimulatedPrice().toFixed(2)}
                        </motion.span>
                        <span className="font-mono text-zinc-500 text-[9px] uppercase tracking-wider">/mas</span>
                      </div>
                      
                      <span className="text-[8px] text-zinc-550 font-sans block pt-1 leading-none">
                        Faturamento de recorrancia mensal pas-ativaÃ§Ã£o. Sem carancia.
                      </span>
                    </div>
                  </div>

                  <div className="pt-6">
                    <a
                      href={buildBrazilWhatsAppUrl(`Ola TAG08! Configurei minha proposta tÃ©cnica usando o simulador inteligente sob medida no site de hospedagem e cheguei no seguinte setup:
 
 - ENGINE DE SERVIDOR ESCOLHIDO: ${simPlan === "basico" ? "CLOUD SOLO (1 vCPU / 1GB RAM)" : simPlan === "intermediario" ? "CLOUD DUO (2 vCPUs / 4GB RAM)" : "CLOUD QUAD (4 vCPUs / 8GB RAM)"}
 - NaMERO DE SITES INTEGRADOS: ${simSites} site(s)
 - ARMAZENAMENTO SSD NVMe: ${simStorage} GB ${simStorage > (simPlan === "basico" ? 5 : simPlan === "intermediario" ? 15 : 30) ? `(+${simStorage - (simPlan === "basico" ? 5 : simPlan === "intermediario" ? 15 : 30)} GB adicionais)` : ""}
 - CONTAS DE EMAIL: ${simPlan === "avancado" ? "Ilimitadas inclusas" : `${simEmails} contas`}
 - COBERTURA EXTRA TaCNICA: ${simApplyUpgrade ? "Ativado" : "NÃ£o ativado"}
 
 - VALOR MENSAL ESTIMADO CONSOLIDADO: R$ ${calculateSimulatedPrice().toFixed(2)}/mas
 
 Gostaria de formalizar este escopo tÃ©cnico com o departamento comercial!`)}
                      target="_blank"
                      rel="noreferrer"
                      className="group/btn w-full py-4 rounded-xl bg-brand hover:bg-brand-secondary text-black font-mono text-[10px] font-black uppercase text-center block tracking-widest transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] shadow-[0_12px_40px_rgba(var(--color-brand-rgb),0.15)] focus:outline-none cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>SOLICITAR SETUP VIA WHATSAPP</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                    
                    <span className="text-[8.5px] text-zinc-550 block text-center pt-3 font-mono">
                      * Redireciona de forma criptografada para os consultores corporativos da TAG08.
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 7: O COMPROMISSO TAG08 & PARCERIAS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left items-stretch">
          
          {/* Left Column: Compromisso e Pilares */}
          <div className="lg:col-span-6 bg-[#09090b] border border-white/[0.04] p-8 sm:p-10 rounded-[36px] space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="font-mono text-[9px] text-brand bg-brand/10 border border-brand/15 px-2.5 py-0.5 rounded inline-block font-black uppercase tracking-widest">
                  O PACTO ANCESTRAL DA EXCELaNCIA
                </span>
                <h3 className="font-display font-black text-2.5xl sm:text-3xl text-white uppercase leading-tight tracking-tight">
                  O COMPROMISSO DE QUALIDADE TAG08.
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                  Tratamos o ecossistema digital corporativo do seu negÃ³cio com o respeito que um legado precioso merece. Nossas aÃ§Ãµes de engenharia sÃ£o pautadas em compromisso indestrutavel com sua receita laquida.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1">
                  <h4 className="text-white text-xs sm:text-sm font-display font-black uppercase flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-brand shrink-0" /> Monitoramento Integral
                  </h4>
                  <p className="text-zinc-400 text-xs font-sans">
                    Nossa equipe supervisiona as interfaces e tempos de carregamento para sanar qualquer anomalia.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1">
                  <h4 className="text-white text-xs sm:text-sm font-display font-black uppercase flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-brand shrink-0" /> Escudo Anti-DDoS
                  </h4>
                  <p className="text-zinc-400 text-xs font-sans">
                    Defesas configuradas diretamente nas bordas da rede para neutralizar picos e acessos mecanicos maliciosos.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1">
                  <h4 className="text-white text-xs sm:text-sm font-display font-black uppercase flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-brand shrink-0" /> Canais de ExpansÃ£o
                  </h4>
                  <p className="text-zinc-400 text-xs font-sans">
                    Oferecemos registros rÃ¡pidos de domÃ­nios nacionais/estrangeiros e integraÃ§Ã£o integral de e-mails corporativos.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1">
                  <h4 className="text-white text-xs sm:text-sm font-display font-black uppercase flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-brand shrink-0" /> Certificados Salidos
                  </h4>
                  <p className="text-zinc-400 text-xs font-sans">
                    Parcerias estratÃ©gicas que reforaam as frentes digitais de nossa frota corporativa nacional e global.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 mt-4 flex items-center gap-4 text-[10px] text-zinc-500 font-sans">
              <span className="uppercase font-bold tracking-widest flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand" /> EXCELaNCIA HOMOLOGADA E GARANTIDA
              </span>
            </div>
          </div>

          {/* Right Column: Escalabilidade & Alinhamento de Portfalio expandido */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-white/[0.01] border border-white/[0.04] p-8 sm:p-10 rounded-[36px]">
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="font-mono text-[9px] text-brand bg-brand/10 border border-brand/15 px-2.5 py-0.5 rounded inline-block font-black uppercase">
                  ECCOSSISTEMA DE EXPANsÃ£o DIGITAL
                </span>
                <h3 className="font-display font-black text-2.5xl sm:text-3xl text-white uppercase leading-tight tracking-tight">
                  ESCALABILIDADE COMO UMA aRVORE SOBERANA.
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                  Assim como uma arvore robusta estende seus ramos de forma equilibrada conforme se nutre do solo fartil, o seu ecossistema digital cresce com flexibilidade sob a nossa tutela. a medida que as demandas de processamento se alteram, vocÃª flexibiliza planos de forma elastica, sem travas penosas.
                </p>
              </div>

              {/* ExpansÃ£o e Universo Expandido */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#09090b]/50 border border-white/5 space-y-4">
                <span className="font-mono text-[8px] text-brand font-black uppercase tracking-widest block lider-none">
                  UNIVERSO CLaSSICO EXPANDIDO TAG08
                </span>
                <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                  Para alam do hardware puro da hospedagem de sites corporativos, nossa agÃªncia conta com uma galaxia inteira de soluÃ§Ãµes integradas prontas para impulsionar a sua faturamento laquido:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-display font-bold text-white uppercase">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                    <span>Registro do Domanio Ideal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                    <span>Marketing de AtivaÃ§Ã£o</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                    <span>CriaÃ§Ã£o de Identidade Visual</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                    <span>Auditoria de Conteado</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.05] mt-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left justify-between">
              <p className="text-zinc-500 text-[10.5px] font-sans leading-tight">
                Seu site de ponta cresce sem gargalos tÃ©cnicos e sem dores operacionais de cabeÃ§a. Cuidamos do motor tÃ©cnico para vocÃª acelerar.
              </p>
              <a
                href={buildBrazilWhatsAppUrl("Ola%20TAG08!%20Gostaria%20de%20saber%2520mais%2520sobre%2520a%2520hospedagem%2520escalavel.")}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-white/5 border border-white/10 text-white hover:text-brand hover:border-brand/45 font-mono text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 block text-center"
              >
                Conhecer planos
              </a>
            </div>
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
                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=800" 
                alt="TAG08 Hosting Specialist" 
                className="absolute inset-0 w-full h-full object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[15%] transition-all duration-500 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[9px] text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                    ZELADORIA DE ELITE
                  </span>
                  <span className="font-mono text-[9px] text-white/40 tracking-wider">
                    TAG08.v3
                  </span>
                </div>
                <div className="space-y-1.5 opacity-30 select-none">
                  <div className="font-display font-extrabold text-[1.8rem] text-white/40 tracking-widest leading-none uppercase select-none">
                    hosting_engine
                  </div>
                  <div className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                    secure_dns_routing_
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <span className="font-mono text-[9px] text-white/40 tracking-wider">
                    UPTIME: 99.99%
                  </span>
                  <span className="font-mono text-[9px] text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                    ZELADORIA ATIVA
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
                  HOSPEDAGEM <br />
                  &amp; seguranÃ§a IMEDIATA!
                </h2>
                <p className="text-black/85 text-[11px] sm:text-xs max-w-lg leading-relaxed font-sans font-extrabold uppercase">
                  ESTRUTURAMOS A HOSPEDAGEM DE ALTO RENDIMENTO DO SEU SITE E FAZEMOS ATUALIZAÃ§Ãµes CRaTICAS CONTaNUAS, GARANTINDO SERVIDORES SEGUROS, CACHING REFINADO E TRaFEGO FLUIDO.
                </p>
              </div>

              <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 max-w-md relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex gap-4 items-start select-none">
                  <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black shrink-0 shadow-lg shadow-brand/10 hover:scale-105 transition-transform duration-200">
                    <Cpu className="w-5 h-5 stroke-[2.5] text-black" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-mono text-[8px] text-brand uppercase tracking-wider font-extrabold block">
                      INFRAESTRUTURA INTEGRAL
                    </span>
                    <p className="text-white text-xs leading-snug font-sans font-semibold">
                      Migre gratuitamente e livre-se de instabilidades que custam caro. Garantimos monitoramento contÃ­nuo de uptime e patches preventivos anti-malware.
                    </p>
                  </div>
                </div>

                {/* DUAL CLIENT CONNECTION CHANNELS (BR & INT) */}
                <div className="space-y-3">
                  <a 
                    href={buildBrazilWhatsAppUrl("Ola,%20gostaria%20de%20consultar%20plano%20de%20Hospedagem%20e%20ManutenÃ§Ã£o%20da%20TAG08")}
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
                    href={buildInternationalWhatsAppUrl("Hello,%20I%20would%20like%20to%20consult%20TAG08%2520holding%2520and%2520maintenance%2520plans")}
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
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8 - FAQ */}
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
                    ZELADORIA
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans max-w-sm">
                    Esclareaa as principais dÃºvidas sobre nossa divisÃ£o tÃ©cnica de infraestrutura, servidores dedicados e otimizaÃ§Ã£o contÃ­nua de cÃ³digo.
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  {([
                    { id: 0, title: "MIGRaÃ§Ã£o DE SITES" },
                    { id: 1, title: "seguranÃ§a ATIVA" },
                    { id: 2, title: "ZELADORIA E SUPORTE" },
                    { id: 3, title: "DESEMPENHO DO PORTAL" }
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
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800"
                  alt="TAG08 Hospedagem e ManutenÃ§Ã£o"
                  className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
                />
                <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                    <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                    <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                  </svg>
                </div>
                <div className="absolute top-6 left-6 z-10 pointer-events-none font-mono text-[8px] text-white/20 uppercase tracking-widest leading-none">
                  SYS // CLOUD_HOST
                </div>

                <div className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left">
                  <span className="font-mono text-[8.5px] text-brand uppercase tracking-widest font-black block">
                    {([
                      "MIGRaÃ§Ã£o DE SITES",
                      "seguranÃ§a ATIVA",
                      "ZELADORIA E SUPORTE",
                      "DESEMPENHO DO PORTAL"
                    ])[activeFaq]}
                  </span>
                  
                  <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                    {([
                      "Posso migrar meu site ja existente para a hospedagem da TAG08?",
                      "Como a TAG08 garante a seguranÃ§a inabalavel do meu site?",
                      "Preciso entender de tecnologia para gerenciar meu site?",
                      "A hospedagem e manutenÃ§Ã£o influenciam o desempenho do site?"
                    ])[activeFaq]}
                  </h4>
                  
                  <p className="text-zinc-350 text-xs sm:text-[12.5px] leading-relaxed font-sans font-medium">
                    {([
                      "Sim, absolutamente! Fornecemos um serviÃ§o de migraÃ§Ã£o expressa 100% integral e gratuito. Nossa equipe de especialistas tÃ©cnicos cuida da transferÃªncia rigorosa do banco de dados, arquivos e chaves criptogrÃ¡ficas para nossos servidores velozes, eliminando qualquer risco de indisponibilidade ou perda de faturamento durante o processo.",
                      "Operamos com um cinturÃ£o de seguranÃ§a robusto que combina firewalls dinÃ¢micos ativos na camada CDN, monitoramento ininterrupto de trÃ¡fego contra DDoS, varreduras heurÃ­sticas de vÃ­rus e invasÃµes de arquivos, alÃ©m de backups semanais geo-distribuÃ­dos automÃ¡ticos.",
                      "Absolutamente nÃ£o! Esse Ã© o grande diferencial do nosso compromisso de zeladoria digital contÃ­nua: cuidamos da burocracia tÃ©cnica, atualizaÃ§Ãµes de servidores, otimizaÃ§Ã£o de caching e blindagem cibernÃ©tica para que vocÃª possa focar em vender.",
                      "Profundamente. Um servidor tecnicamente otimizado e atualizado entrega tempos de resposta inferiores a 0.5s, o que aumenta de forma orgÃ¢nica as avaliaÃ§Ãµes no ranking SEO do Google. Portais desatualizados ou sem cache tendem a sofrer gargalos de hardware crÃ´nicos."
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
                      Eliminamos lentidao excessiva e falha tÃ©cnica cranica. Garantimos maxima performance de seus servidores.
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
                    href={buildBrazilWhatsAppUrl("Ola,%20gostaria%20de%20consultar%20viabilidade%20estratÃ©gica%20especializada%2520para%20minha%2520marca!")}
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



      </div>
    </div>
  );
}












