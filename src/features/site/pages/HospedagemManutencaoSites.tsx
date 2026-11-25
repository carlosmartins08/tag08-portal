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
} from "../../../components/DooIcons";
import { useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { activateOnKeyboard } from "../../../lib/keyboard";
import ResilientImage from "../../../components/ResilientImage";
import { buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl } from "../../../config/siteNetwork";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import TrackedOutboundLink from "../../../components/TrackedOutboundLink";
import { trackSimulatorEvent } from "../../../lib/analytics";
import { calculateHostingPrice, HOSTING_PRICE_CONFIG, type HostingPlan } from "../../../lib/simulators/hostingPrice";
import type { RouteLocale } from "../../../config/routeRegistry";

interface PageProps {
  onNavigate: (page: string) => void;
  locale?: RouteLocale;
}

export default function HospedagemManutencaoSites({ onNavigate, locale = "pt" }: PageProps) {
  const copy = <T,>(pt: T, en: T, es: T): T => locale === "en" ? en : locale === "es" ? es : pt;
  const [activeFaq, setActiveFaq] = useState<number>(0);
  const [activeJourney, setActiveJourney] = useState<number>(0);
  const [selectedHosting, setSelectedHosting] = useState<string>("compartilhada");
  const [planCategory, setPlanCategory] = useState<"todos" | "corporativo" | "especializado">("todos");

  // Plan customization simulator states
  const [simPlan, setSimPlan] = useState<HostingPlan>("basico");
  const [simSites, setSimSites] = useState<number>(1);
  const [simEmails, setSimEmails] = useState<number>(10);
  const [simStorage, setSimStorage] = useState<number>(5);
  const [simApplyUpgrade, setSimApplyUpgrade] = useState<boolean>(false);
  const trackedSimulatorActions = useRef(new Set<string>());

  const trackHostingSimulator = (action: "input_changed" | "cta_clicked") => {
    const base = {
      simulator_id: "hosting_price",
      simulator_version: HOSTING_PRICE_CONFIG.version,
      page_path: "/hospedagem-manutencao-sites"
    };

    if (!trackedSimulatorActions.current.has("started")) {
      trackSimulatorEvent({ ...base, action: "started" });
      trackedSimulatorActions.current.add("started");
    }

    if (!trackedSimulatorActions.current.has(action)) {
      trackSimulatorEvent({ ...base, action });
      trackedSimulatorActions.current.add(action);
    }

    if (action === "input_changed" && !trackedSimulatorActions.current.has("result_viewed")) {
      trackSimulatorEvent({ ...base, action: "result_viewed" });
      trackedSimulatorActions.current.add("result_viewed");
    }
  };

  const handlePlanChange = (plan: HostingPlan) => {
    trackHostingSimulator("input_changed");
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

  const simulatedPrice = calculateHostingPrice({
    plan: simPlan,
    sites: simSites,
    emails: simEmails,
    storageGb: simStorage,
    applyUpgrade: simApplyUpgrade
  });

  const simulatorPlanLabel = simPlan === "basico" ? "CLOUD SOLO (1 vCPU / 1GB RAM)" : simPlan === "intermediario" ? "CLOUD DUO (2 vCPUs / 4GB RAM)" : "CLOUD QUAD (4 vCPUs / 8GB RAM)";
  const baseStorage = simPlan === "basico" ? 5 : simPlan === "intermediario" ? 15 : 30;
  const extraStorage = simStorage > baseStorage ? ` (+${simStorage - baseStorage} ${copy("GB adicionais", "additional GB", "GB adicionales")})` : "";
  const simulatorMessage = copy(
    `Olá TAG08! Configurei minha proposta técnica usando o simulador inteligente sob medida no site de hospedagem e cheguei no seguinte setup:\n\n- ENGINE DE SERVIDOR ESCOLHIDO: ${simulatorPlanLabel}\n- NÚMERO DE SITES INTEGRADOS: ${simSites} site(s)\n- ARMAZENAMENTO SSD NVMe: ${simStorage} GB${extraStorage}\n- CONTAS DE EMAIL: ${simPlan === "avancado" ? "Ilimitadas inclusas" : `${simEmails} contas`}\n- COBERTURA EXTRA TÉCNICA: ${simApplyUpgrade ? "Ativado" : "Não ativado"}\n\n- VALOR MENSAL ESTIMADO CONSOLIDADO: R$ ${simulatedPrice.toFixed(2)}/mês\n\nGostaria de formalizar este escopo técnico com o departamento comercial!`,
    `Hello TAG08! I configured a hosting proposal with the website simulator. Here is the setup:\n\n- SELECTED SERVER ENGINE: ${simulatorPlanLabel}\n- NUMBER OF HOSTED WEBSITES: ${simSites}\n- SSD NVMe STORAGE: ${simStorage} GB${extraStorage}\n- EMAIL ACCOUNTS: ${simPlan === "avancado" ? "Unlimited included" : `${simEmails} accounts`}\n- ADDITIONAL TECHNICAL COVERAGE: ${simApplyUpgrade ? "Enabled" : "Not enabled"}\n\n- ESTIMATED TOTAL MONTHLY PRICE: BRL ${simulatedPrice.toFixed(2)}/month\n\nI would like to discuss this technical scope with the sales team.`,
    `Hola TAG08. Configuré una propuesta de alojamiento con el simulador del sitio. Esta es la configuración:\n\n- MOTOR DE SERVIDOR ELEGIDO: ${simulatorPlanLabel}\n- NÚMERO DE SITIOS ALOJADOS: ${simSites}\n- ALMACENAMIENTO SSD NVMe: ${simStorage} GB${extraStorage}\n- CUENTAS DE CORREO: ${simPlan === "avancado" ? "Ilimitadas incluidas" : `${simEmails} cuentas`}\n- COBERTURA TÉCNICA ADICIONAL: ${simApplyUpgrade ? "Activada" : "No activada"}\n\n- PRECIO MENSUAL TOTAL ESTIMADO: R$ ${simulatedPrice.toFixed(2)}/mes\n\nQuisiera formalizar este alcance técnico con el equipo comercial.`
  );

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Structured guide list for hosting classifications
  const hostingTypes = copy([
    {
      id: "compartilhada",
      title: "Hospedagem Compartilhada",
      niche: "Pequenas empresas, blogs pessoais e portfólios online",
      category: "especializado",
      description: "Opção econômica ideal para projetos iniciais. Os recursos do servidor, como memória e processamento, são distribuídos de forma equilibrada entre vários sites parceiros, com custo otimizado e facilidade operacional.",
      specs: ["Preço altamente competitivo", "Gestão automatizada de painel", "Perfeito para validação", "Armazenamento SSD seguro"],
      badge: "Início rápido"
    },
    {
      id: "vps",
      title: "Hospedagem VPS (Virtual Private)",
      niche: "Sites de médio porte, e-commerces moderados e blogs ricos",
      category: "corporativo",
      description: "Um servidor físico segmentado em várias máquinas virtuais isoladas. Cada ambiente atua de modo individual, com recursos dedicados garantidos, proporcionando flexibilidade administrativa e tolerância a picos de acesso.",
      specs: ["Recursos Dedicados (CPU/RAM)", "IP Dedicado Exclusivo", "Escalabilidade Gradual", "Controle Total de Root"],
      badge: "Mais Popular"
    },
    {
      id: "dedicada",
      title: "Hospedagem Dedicada",
      niche: "Grandes empresas, e-commerce de alto volume, portais complexos",
      category: "corporativo",
      description: "Um hardware computacional completo alocado exclusivamente para sustentar a soberania digital da sua marca. Máxima velocidade com isolamento térmico e físico, desempenho consistente e liberdade de segurança avançada.",
      specs: ["Baixa latência operacional", "Zeladoria física especializada", "Ambiente 100% isolado", "Políticas personalizadas"],
      badge: "Alta Performance"
    },
    {
      id: "nuvem",
      title: "Hospedagem na Nuvem (Cloud)",
      niche: "Startups, aplicações SaaS escaláveis, tráfego dinâmico",
      category: "corporativo",
      description: "Arquitetura distribuída entre múltiplos servidores no ecossistema global. Suas cargas de processamento flutuam dinamicamente para neutralizar e mitigar sobrecargas de acessos, com cobranças transparentes baseadas em uso real.",
      specs: ["Auto-escalonamento Inteligente", "99.99% Uptime Provado", "Distribuição Multirregional", "Redundância Contínua"],
      badge: "Suprema Elasticidade"
    },
    {
      id: "wordpress",
      title: "Hospedagem Sênior WordPress",
      niche: "Sites acadêmicos, blogs profissionais, portais de marcas",
      category: "especializado",
      description: "Infraestrutura estritamente calibrada e desenhada de forma cirúrgica para as exigências refinadas do CMS mais famoso do planeta. Garanta carregamentos imperceptíveis, atualizações estáticas seguras e cache agressivo na última milha.",
      specs: ["Caching Integrado em Nível de Server", "Segurança WordPress Ativa", "Fácil Gestão de Ambientes", "Plugins Pré-otimizados"],
      badge: "Focado em CMS"
    },
    {
      id: "ecommerce",
      title: "E-Commerce de Luxo & Alta Escala",
      niche: "Lojas virtuais estruturadas, catálogos pesados e vendas ativas",
      category: "especializado",
      description: "Suite integrada para garantir que nenhum carrinho de compras seja abandonado por lentidão técnica. Suporte nativo a múltiplos gateways de pagamentos criptografados, selos dinâmicos de segurança e barreira de proteção robusta.",
      specs: ["Certificação SSL Inclusão", "Segurança PCI Compliant", "Tempo de Resposta Acelerado", "Faturamento Seguro"],
      badge: "Foco Comercial"
    }
  ], [
    { id: "compartilhada", title: "Shared Hosting", niche: "Small businesses, personal blogs and online portfolios", category: "especializado", description: "An affordable option for early-stage projects. Server resources such as memory and processing are balanced across multiple sites, with optimized cost and straightforward operation.", specs: ["Competitive pricing", "Automated control panel", "Ideal for validation", "Secure SSD storage"], badge: "Quick start" },
    { id: "vps", title: "VPS Hosting (Virtual Private Server)", niche: "Mid-sized websites, moderate e-commerce and content-rich blogs", category: "corporativo", description: "A physical server divided into isolated virtual machines. Each environment operates independently with guaranteed dedicated resources, providing administrative flexibility and tolerance for traffic spikes.", specs: ["Dedicated resources (CPU/RAM)", "Exclusive dedicated IP", "Gradual scalability", "Full root control"], badge: "Most popular" },
    { id: "dedicada", title: "Dedicated Hosting", niche: "Large businesses, high-volume e-commerce and complex portals", category: "corporativo", description: "Complete computing hardware allocated exclusively to support your brand's digital sovereignty. Maximum speed with thermal and physical isolation, consistent performance and freedom to apply advanced security policies.", specs: ["Low operating latency", "Specialized hardware care", "100% isolated environment", "Custom policies"], badge: "High performance" },
    { id: "nuvem", title: "Cloud Hosting", niche: "Startups, scalable SaaS applications and dynamic traffic", category: "corporativo", description: "An architecture distributed across multiple servers in a global ecosystem. Processing loads fluctuate dynamically to neutralize and mitigate access overload, with transparent billing based on actual usage.", specs: ["Intelligent auto-scaling", "99.99% proven uptime", "Multi-region distribution", "Continuous redundancy"], badge: "Supreme elasticity" },
    { id: "wordpress", title: "Senior WordPress Hosting", niche: "Academic websites, professional blogs and brand portals", category: "especializado", description: "Infrastructure precisely calibrated for the requirements of the world's most popular CMS. Ensure imperceptible load times, secure static updates and aggressive caching at the last mile.", specs: ["Integrated server-level caching", "Active WordPress security", "Easy environment management", "Pre-optimized plugins"], badge: "CMS-focused" },
    { id: "ecommerce", title: "Luxury & High-Scale E-Commerce", niche: "Established online stores, large catalogs and active sales", category: "especializado", description: "An integrated suite to ensure that no shopping cart is abandoned because of technical slowness. Native support for multiple encrypted payment gateways, dynamic security seals and a robust protection barrier.", specs: ["SSL certificate included", "PCI-compliant security", "Faster response time", "Secure transactions"], badge: "Commercial focus" }
  ], [
    { id: "compartilhada", title: "Alojamiento compartido", niche: "Pequeñas empresas, blogs personales y portafolios online", category: "especializado", description: "Una opción económica para proyectos iniciales. Los recursos del servidor, como memoria y procesamiento, se distribuyen de forma equilibrada entre varios sitios, con costos optimizados y una operación sencilla.", specs: ["Precio competitivo", "Panel de control automatizado", "Ideal para validación", "Almacenamiento SSD seguro"], badge: "Inicio rápido" },
    { id: "vps", title: "Alojamiento VPS (servidor privado virtual)", niche: "Sitios medianos, comercio electrónico moderado y blogs con mucho contenido", category: "corporativo", description: "Un servidor físico dividido en máquinas virtuales aisladas. Cada entorno funciona de forma independiente con recursos dedicados garantizados, flexibilidad administrativa y tolerancia a picos de tráfico.", specs: ["Recursos dedicados (CPU/RAM)", "IP dedicada exclusiva", "Escalabilidad gradual", "Control root completo"], badge: "Más popular" },
    { id: "dedicada", title: "Alojamiento dedicado", niche: "Grandes empresas, comercio electrónico de alto volumen y portales complejos", category: "corporativo", description: "Hardware informático completo asignado exclusivamente para respaldar la soberanía digital de tu marca. Máxima velocidad con aislamiento térmico y físico, rendimiento constante y libertad para aplicar seguridad avanzada.", specs: ["Baja latencia operativa", "Mantenimiento de hardware especializado", "Entorno 100% aislado", "Políticas personalizadas"], badge: "Alto rendimiento" },
    { id: "nuvem", title: "Alojamiento en la nube", niche: "Startups, aplicaciones SaaS escalables y tráfico dinámico", category: "corporativo", description: "Arquitectura distribuida entre varios servidores de un ecosistema global. Las cargas de procesamiento fluctúan dinámicamente para neutralizar y mitigar sobrecargas de acceso, con facturación transparente basada en el uso real.", specs: ["Autoescalado inteligente", "99,99% de disponibilidad comprobada", "Distribución multirregional", "Redundancia continua"], badge: "Elasticidad suprema" },
    { id: "wordpress", title: "Alojamiento WordPress sénior", niche: "Sitios académicos, blogs profesionales y portales de marca", category: "especializado", description: "Infraestructura calibrada con precisión para los requisitos del CMS más popular del planeta. Garantiza cargas imperceptibles, actualizaciones estáticas seguras y caché agresiva en el último tramo.", specs: ["Caché integrado a nivel de servidor", "Seguridad activa para WordPress", "Gestión sencilla del entorno", "Plugins preoptimizados"], badge: "Enfocado en CMS" },
    { id: "ecommerce", title: "Comercio electrónico de lujo y a gran escala", niche: "Tiendas online consolidadas, catálogos amplios y ventas activas", category: "especializado", description: "Suite integrada para garantizar que ningún carrito de compra se abandone por lentitud técnica. Incluye compatibilidad nativa con varias pasarelas de pago cifradas, sellos de seguridad dinámicos y una sólida barrera de protección.", specs: ["Certificado SSL incluido", "Seguridad compatible con PCI", "Respuesta acelerada", "Facturación segura"], badge: "Enfoque comercial" }
  ]);

  // Journey timeline
  const journeySteps = copy([
    {
      id: 0,
      title: "A Fortaleza e Seus Gigantes",
      label: "DATA CENTERS & SERVIDORES",
      description: "Imagine os servidores como titãs de processamento operando dentro de data centers de segurança máxima. Eles são guardiães de alta performance que nunca adormecem, alimentados por canais de energia redundante para manter seus arquivos vivos a cada fração de milissegundo.",
      metric: "99.99% Uptime Seguro"
    },
    {
      id: 1,
      title: "Os Sentinelas de Fronteira",
      label: "PROTOCOLOS DE SEGURANÇA",
      description: "Nas portas da fortaleza digital, barramentos de firewalls de última geração e criptografia SSL/TLS atuam como vigilantes. Eles barram invasões indesejadas, blindam acessos indevidos e garantem transações criptografadas perfeitas em tempo real.",
      metric: "Redução de Riscos 100%"
    },
    {
      id: 2,
      title: "O Artesão da Alta Performance",
      label: "MANUTENÇÃO & ENGENHARIA",
      description: "A engenharia dedicada da TAG08 acompanha cada engrenagem da sua aplicação. Auditorias, revisões regulares, atualizações de temas e plugins e backups preventivos mantêm o site em evolução contínua.",
      metric: "Updates Proativos"
    }
  ], [
    { id: 0, title: "The fortress and its giants", label: "DATA CENTERS & SERVERS", description: "Imagine servers as processing titans operating inside maximum-security data centers. They are high-performance guardians that never sleep, powered by redundant energy channels to keep your files alive every millisecond.", metric: "99.99% secure uptime" },
    { id: 1, title: "The border sentinels", label: "SECURITY PROTOCOLS", description: "At the gates of the digital fortress, state-of-the-art firewalls and SSL/TLS encryption act as sentinels. They block unwanted intrusions, shield against unauthorized access and ensure flawless encrypted transactions in real time.", metric: "100% risk reduction" },
    { id: 2, title: "The performance craft", label: "MAINTENANCE & ENGINEERING", description: "TAG08 engineering keeps track of your application through audits, regular reviews, theme and plugin updates, and preventive backups to support ongoing improvement.", metric: "Proactive updates" }
  ], [
    { id: 0, title: "La fortaleza y sus gigantes", label: "CENTROS DE DATOS Y SERVIDORES", description: "Imagina los servidores como titanes de procesamiento dentro de centros de datos de máxima seguridad. Son guardianes de alto rendimiento que nunca duermen, alimentados por canales de energía redundantes para mantener tus archivos activos cada milisegundo.", metric: "99,99% de disponibilidad segura" },
    { id: 1, title: "Los centinelas de frontera", label: "PROTOCOLOS DE SEGURIDAD", description: "En las puertas de la fortaleza digital, los firewalls de última generación y el cifrado SSL/TLS actúan como centinelas. Bloquean intrusiones no deseadas, protegen contra accesos no autorizados y garantizan transacciones cifradas impecables en tiempo real.", metric: "100% de reducción de riesgos" },
    { id: 2, title: "Ingeniería de rendimiento", label: "MANTENIMIENTO E INGENIERÍA", description: "El equipo de ingeniería de TAG08 acompaña tu aplicación con auditorías, revisiones periódicas, actualizaciones de temas y plugins, y copias preventivas para apoyar su evolución continua.", metric: "Actualizaciones proactivas" }
  ]);

  const planNames: Record<"en" | "es", Record<string, { name: string; audience: string; purpose: string; badge: string; resources: Array<{ label: string; value: string; tooltip: string }> }>> = {
    en: {
      basico: { name: "Basic plan", audience: "Business websites & portfolios", purpose: "A practical starting point for emerging brands, landing pages, news blogs and polished portfolios.", badge: "FOUNDATION", resources: [
        { label: "Storage", value: "5 GB SSD NVMe", tooltip: "Business-grade solid-state drives with fast transfer rates for images and pages." }, { label: "Business email", value: "10 accounts included", tooltip: "Custom domain email accounts with spam protection and business gateway." }, { label: "Monthly traffic", value: "500 GB volume", tooltip: "Data allowance for ongoing browsing by your visitors." }, { label: "Databases", value: "1 MySQL database", tooltip: "A structured database for a WordPress site or application." }, { label: "Regular maintenance", value: "Quarterly updates", tooltip: "On-demand reviews and updates every three months for plugins and themes." }, { label: "SSL certificate", value: "Let's Encrypt included", tooltip: "HTTPS encryption for data protection and secure website access." }
      ] },
      intermediario: { name: "Intermediate plan", audience: "Small e-commerce & businesses", purpose: "For growing businesses, commercial websites and brands investing in ongoing paid traffic.", badge: "MOST RECOMMENDED", resources: [
        { label: "Storage", value: "15 GB SSD NVMe", tooltip: "Expanded storage for product catalogs with images and rich media." }, { label: "Business email", value: "50 accounts included", tooltip: "A suitable allowance for support, finance, partnerships and leadership." }, { label: "Monthly traffic", value: "2 TB volume", tooltip: "Traffic allowance for visitor surges from Meta Ads or Google Ads." }, { label: "Databases", value: "5 MySQL databases", tooltip: "Host subsystems, isolated test environments or member areas." }, { label: "Regular maintenance", value: "Monthly updates", tooltip: "Technical maintenance every 30 days, including WordPress cleanup and vulnerability review." }, { label: "Preventive backup", value: "Weekly isolated backup", tooltip: "An additional backup copied automatically to a separate data center." }
      ] },
      avancado: { name: "Advanced plan", audience: "Premium brands & high traffic", purpose: "For complex corporate websites, busy online stores and premium brands with heavier traffic.", badge: "CORPORATE PERFORMANCE", resources: [
        { label: "Storage", value: "30 GB SSD NVMe", tooltip: "Fast storage with priority CPU and higher IOPS limits to help manage latency." }, { label: "Business email", value: "Unlimited accounts", tooltip: "Create the number of business email accounts your operation needs." }, { label: "Monthly traffic", value: "4.5 TB volume", tooltip: "Traffic allowance for product launches, campaigns and seasonal peaks." }, { label: "Databases", value: "Unlimited databases", tooltip: "Host multiple databases for internal CRM, stores or complex integrations." }, { label: "Regular maintenance", value: "Weekly active review", tooltip: "Technical maintenance with periodic vulnerability testing, database optimization and monitoring." }, { label: "Global acceleration", value: "Integrated CDN", tooltip: "Global routing brings static and media files closer to visitors." }
      ] }
    },
    es: {
      basico: { name: "Plan básico", audience: "Sitios corporativos y portafolios", purpose: "Un punto de partida práctico para marcas emergentes, páginas de aterrizaje, blogs y portafolios cuidados.", badge: "BASE", resources: [
        { label: "Almacenamiento", value: "5 GB SSD NVMe", tooltip: "Unidades de estado sólido de nivel empresarial con rápidas tasas de transferencia para imágenes y páginas." }, { label: "Correo corporativo", value: "10 cuentas incluidas", tooltip: "Cuentas de correo con dominio propio, protección contra spam y pasarela corporativa." }, { label: "Tráfico mensual", value: "500 GB de volumen", tooltip: "Límite de datos para la navegación habitual de tus visitantes." }, { label: "Bases de datos", value: "1 base MySQL", tooltip: "Una base estructurada para un sitio WordPress o una aplicación." }, { label: "Mantenimiento periódico", value: "Actualizaciones trimestrales", tooltip: "Revisiones y actualizaciones cada tres meses para plugins y temas." }, { label: "Certificado SSL", value: "Let's Encrypt incluido", tooltip: "Cifrado HTTPS para la protección de datos y el acceso seguro al sitio." }
      ] },
      intermediario: { name: "Plan intermedio", audience: "Pequeño comercio electrónico y empresas", purpose: "Para empresas en crecimiento, sitios comerciales y marcas que invierten en tráfico pago de forma continua.", badge: "MÁS RECOMENDADO", resources: [
        { label: "Almacenamiento", value: "15 GB SSD NVMe", tooltip: "Almacenamiento ampliado para catálogos de productos con imágenes y contenido multimedia." }, { label: "Correo corporativo", value: "50 cuentas incluidas", tooltip: "Una cantidad adecuada para organizar soporte, finanzas, alianzas y dirección." }, { label: "Tráfico mensual", value: "2 TB de volumen", tooltip: "Límite de tráfico para picos de visitas generados por Meta Ads o Google Ads." }, { label: "Bases de datos", value: "5 bases MySQL", tooltip: "Aloja subsistemas, entornos de prueba aislados o áreas para miembros." }, { label: "Mantenimiento periódico", value: "Actualizaciones mensuales", tooltip: "Mantenimiento técnico cada 30 días, incluida la limpieza de WordPress y la revisión de vulnerabilidades." }, { label: "Copia preventiva", value: "Copia semanal aislada", tooltip: "Una copia de seguridad adicional transferida automáticamente a otro centro de datos." }
      ] },
      avancado: { name: "Plan avanzado", audience: "Marcas premium y alto tráfico", purpose: "Para sitios corporativos complejos, tiendas online con mucha actividad y marcas premium con tráfico elevado.", badge: "RENDIMIENTO CORPORATIVO", resources: [
        { label: "Almacenamiento", value: "30 GB SSD NVMe", tooltip: "Almacenamiento rápido con CPU prioritaria y límites de IOPS más altos para ayudar a gestionar la latencia." }, { label: "Correo corporativo", value: "Cuentas ilimitadas", tooltip: "Crea las cuentas de correo corporativo que necesite tu operación." }, { label: "Tráfico mensual", value: "4,5 TB de volumen", tooltip: "Límite de tráfico para lanzamientos, campañas y temporadas de alta demanda." }, { label: "Bases de datos", value: "Bases ilimitadas", tooltip: "Aloja varias bases de datos para CRM interno, tiendas o integraciones complejas." }, { label: "Mantenimiento periódico", value: "Revisión semanal activa", tooltip: "Mantenimiento técnico con pruebas periódicas de vulnerabilidades, optimización de bases de datos y monitoreo." }, { label: "Aceleración global", value: "CDN integrada", tooltip: "El enrutamiento global acerca archivos estáticos y multimedia a los visitantes." }
      ] }
    }
  };

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
        <h2>{copy("Hospedagem e Manutenção de Sites: Soluções Completas para o Sucesso Online - Agência TAG08", "Website Hosting and Maintenance: Complete Solutions for Online Success - TAG08 Agency", "Alojamiento y mantenimiento web: soluciones completas para el éxito online - Agencia TAG08")}</h2>
        <p>{copy("Descubra soluções inovadoras em hospedagem e manutenção de sites com a Agência TAG08. Expertise, segurança e suporte personalizado para elevar seu negócio no mundo digital. Explore agora!", "Discover innovative website hosting and maintenance from TAG08 Agency. Expertise, security and tailored support to help your business grow online. Explore now!", "Descubre soluciones innovadoras de alojamiento y mantenimiento web con TAG08. Experiencia, seguridad y soporte personalizado para impulsar tu negocio en el mundo digital. ¡Explora ahora!")}</p>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 space-y-20 md:space-y-32">
        
        {/* HERO SECTION: DIGITAL PORTAL */}
        <section className="pt-8 sm:pt-16 pb-6 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <span className="tag08-meta text-xs text-brand bg-brand/10 border border-brand/20 px-3 py-1 rounded-md inline-flex items-center gap-1.5 uppercase tracking-widest font-black">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> {copy("INFRAESTRUTURA DE SOBERANIDADE CORPORATIVA", "CORPORATE-GRADE DIGITAL INFRASTRUCTURE", "INFRAESTRUCTURA DIGITAL PARA EMPRESAS")}
              </span>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter">
                {copy("CONTINUIDADE TECNOLÓGICA", "TECHNOLOGY CONTINUITY", "CONTINUIDAD TECNOLÓGICA")} <br />
                <span className="text-brand">{copy("PARA ESTRUTURAS WEB EM OPERAÇÃO.", "FOR WEB OPERATIONS ALREADY IN MOTION.", "PARA OPERACIONES WEB EN MARCHA.")}</span>
              </h1>
            </div>
            <div className="lg:col-span-5 space-y-4 pt-1 lg:pt-8">
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans font-medium">
                {copy("Hospedagem e manutenção são serviços de continuidade tecnológica ligados ao ecossistema de Tecnologia/Web. A página mantém as informações comerciais existentes, ainda sujeitas à validação específica de valores, limites, SLA e condições.", "Hosting and maintenance provide technology continuity within the Technology/Web ecosystem. The existing commercial information is retained and remains subject to specific validation of prices, limits, SLAs and terms.", "El alojamiento y el mantenimiento dan continuidad tecnológica dentro del ecosistema de Tecnología/Web. Se conserva la información comercial existente, sujeta a validación específica de precios, límites, SLA y condiciones.")}
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href="#escolha-plano"
                  className="px-6 py-3.5 bg-brand hover:bg-brand-dark text-black text-xs font-sans font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-[0_12px_40px_rgba(var(--color-brand-rgb),0.15)] cursor-pointer"
                >
                  <span>{copy("Mapear minha hospedagem", "Explore hosting options", "Explorar opciones de alojamiento")}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </a>
                <TrackedOutboundLink
                  label={copy("Falar com especialista", "Talk to a specialist", "Hablar con un especialista")}
                  surface="hospedagem-hero-cta"
                  href={buildBrazilWhatsAppUrl(copy("Olá TAG08! Gostaria de conversar sobre as soluções de Hospedagem e Manutenção de Sites.", "Hello TAG08! I would like to discuss website hosting and maintenance solutions.", "Hola TAG08. Me gustaría conversar sobre las soluciones de alojamiento y mantenimiento web."))}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3.5 bg-white/[0.02] border border-white/10 hover:border-brand/45 text-white hover:text-brand text-xs font-sans font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{copy("Falar com especialista", "Talk to a specialist", "Hablar con un especialista")}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </TrackedOutboundLink>
              </div>
            </div>
          </div>

          {/* Hero Main Media - Immersive Server Rack Graphic or Layout */}
          <div className="mt-12 sm:mt-16">
            <ThreeDimensionalTilt className="rounded-[28px] overflow-visible">
              <div className="relative rounded-[28px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group flex items-center justify-center">
                <ResilientImage
                  sizes="100vw"
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1800"
                  alt={copy("Soberania de Servidores e Criptografia Computacional", "Server infrastructure and encryption", "Infraestructura de servidores y cifrado")}
                  fallbackLabel={copy("Infraestrutura e proteção operacional", "Infrastructure and operational protection", "Infraestructura y protección operativa")}
                  className="object-cover grayscale brightness-[0.35] group-hover:scale-[1.01] transition-all duration-[1200ms] ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent opacity-80" />
                
                {/* Floating cyber metrics overlays showing maximum telemetry */}
                <div className="absolute inset-x-6 bottom-6 sm:inset-x-10 sm:bottom-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pointer-events-none">
                  <div className="space-y-2">
                    <span className="tag08-meta text-xs text-brand/85 tracking-widest font-bold uppercase block leading-none">
                      {copy("ZELADORIA ATIVA EM TEMPO REAL", "ACTIVE REAL-TIME MAINTENANCE", "MANTENIMIENTO ACTIVO EN TIEMPO REAL")}
                    </span>
                    <h3 className="font-display font-black text-white text-xl sm:text-2xl tracking-tight">
                      {copy("PROTEÇÃO ROBUSTA E MONITORAMENTO CONTÍNUO", "ROBUST PROTECTION AND CONTINUOUS MONITORING", "PROTECCIÓN ROBUSTA Y MONITOREO CONTINUO")}
                    </h3>
                  </div>
                  
                  {/* Mock live monitoring hardware panels */}
                  <div className="flex gap-4 sm:gap-6 bg-black/75 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/15 w-full md:w-auto">
                    <div className="space-y-1 text-left">
                      <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest font-black block leading-none">
                        {copy("PING MONITOR", "PING MONITOR", "MONITOR DE PING")}
                      </span>
                      <span className="text-brand font-sans font-black text-xs sm:text-sm flex items-center gap-1.5 leading-none">
                        <Activity className="w-4 h-4 animate-pulse stroke-[2.5]" /> {copy("12ms ATIVO", "12ms ACTIVE", "12ms ACTIVO")}
                      </span>
                    </div>
                    <div className="w-px bg-white/10" />
                    <div className="space-y-1 text-left">
                      <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest font-black block leading-none">
                        {copy("FIREWALL STATE", "FIREWALL STATUS", "ESTADO DEL FIREWALL")}
                      </span>
                      <span className="text-white font-sans font-black text-xs sm:text-sm flex items-center gap-1.5 leading-none">
                        <Lock className="w-3.5 h-3.5 stroke-[2.5]" /> {copy("ENCRYPTED", "ENCRYPTED", "CIFRADO")}
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
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/15 px-2.5 py-1 rounded-md inline-block self-start">
              {copy("A ESSÊNCIA DA VITALIDADE WEB", "THE FOUNDATION OF A HEALTHY WEB PRESENCE", "LA BASE DE UNA PRESENCIA WEB SALUDABLE")}
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-tight tracking-tighter">
              {copy("A HARMONIA ENTRE INFRAESTRUTURA E MANUTENÇÃO DA SUA PRESENÇA DIGITAL.", "BALANCING INFRASTRUCTURE AND MAINTENANCE FOR YOUR DIGITAL PRESENCE.", "EL EQUILIBRIO ENTRE INFRAESTRUCTURA Y MANTENIMIENTO PARA TU PRESENCIA DIGITAL.")}
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans font-medium">
              {copy("No vasto oceano digital da internet, seu site enfrenta tempestades mecânicas silenciosas todos os dias. Para garantir que ele resista com altivez soberana, aplicamos uma filosofia de equilíbrio perfeito.", "On the vast digital ocean, your website faces unseen technical challenges every day. We apply a balanced approach to help it stay reliable.", "En el vasto océano digital, tu sitio web enfrenta desafíos técnicos invisibles cada día. Aplicamos un enfoque equilibrado para ayudarlo a seguir siendo confiable.")}
            </p>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans font-medium">
              {copy("Não se trata apenas de depositar arquivos em uma maquina compartilhada genarica; trata-se de manter uma simbiose de vigilancia que zela pela integridade da infraestrutura fasica enquanto aprimora a inteligência lagica da aplicação.", "This is more than placing files on a generic shared machine. It is ongoing care for the physical infrastructure while improving the application itself.", "No se trata solo de alojar archivos en una máquina compartida genérica. Se trata de cuidar la infraestructura física y mejorar la aplicación de forma continua.")}
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#09090b] border border-white/[0.04] p-8 lg:p-10 rounded-[32px] hover:border-brand/35 transition-all duration-300 space-y-6 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mb-1">
                  <Database className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-display font-black text-xl text-white">
                  {copy("A Hospedagem", "Hosting", "Alojamiento")} <br />
                  <span className="text-brand font-sans font-normal text-xs tracking-widest block mt-0.5">{copy("// O CORAÇÃO PULSANTE", "// THE BEATING HEART", "// EL CORAZÓN LATENTE")}</span>
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                  {copy("a o lar digital seguro, acolhedor e blindado onde seus dados residem. Composta por servidores dedicados e estaveis que permanecem conectados em data centers supremos de alta segurança, garantindo que seu projeto esteja totalmente visavel para o planeta a qualquer minuto.", "A secure digital home for your data, supported by dedicated, stable servers in data centers designed for security and continuous availability.", "Un hogar digital seguro para tus datos, respaldado por servidores dedicados y estables en centros de datos diseñados para ofrecer seguridad y disponibilidad continua.")}
                </p>
              </div>
              <span className="font-sans text-xs text-zinc-650 group-hover:text-brand transition-colors block">{copy("RESIDaNCIA SaLIDA", "A SOLID HOME", "UN HOGAR SÓLIDO")} &gt;&gt;</span>
            </div>

            <div className="bg-[#09090b] border border-white/[0.04] p-8 lg:p-10 rounded-[32px] hover:border-brand/35 transition-all duration-300 space-y-6 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mb-1">
                  <RefreshCw className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-display font-black text-xl text-white">
                  {copy("A Manutenção", "Maintenance", "Mantenimiento")} <br />
                  <span className="text-brand font-sans font-normal text-xs tracking-widest block mt-0.5">{copy("// A ALMA CUIDADOSA", "// THE CAREFUL CRAFT", "// EL CUIDADO CONTINUO")}</span>
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                  {copy("A engrenagem ativa que supervisiona a saúde, o vigor e o rejuvenescimento do seu código. Realizamos atualizações periódicas de CMS, otimizamos bancos de dados, ajustamos blocos de segurança técnica e aplicómos patches contra qualquer brecha ou vulnerabilidade silenciosa.", "Ongoing work that supports your code's health: periodic CMS updates, database optimization, security adjustments and patches for identified vulnerabilities.", "Un trabajo continuo para cuidar el código: actualizaciones periódicas del CMS, optimización de bases de datos, ajustes de seguridad y parches para las vulnerabilidades detectadas.")}
                </p>
              </div>
              <span className="font-sans text-xs text-zinc-650 group-hover:text-brand transition-colors block">{copy("OTIMIZação PROATIVA", "PROACTIVE OPTIMIZATION", "OPTIMIZACIÓN PROACTIVA")} &gt;&gt;</span>
            </div>
          </div>
        </section>

        {/* SECTION 5: PILARES & MANUTENaaO REGULAR */}
        <section className="space-y-12 text-left">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="tag08-meta text-xs text-brand bg-brand/10 border border-brand/15 px-3 py-1 rounded inline-block uppercase tracking-widest font-black leading-none">
              {copy("DILIGaNCIA SEM CONCESSaES", "DILIGENCE WITHOUT COMPROMISE", "DILIGENCIA SIN CONCESIONES")}
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tighter leading-none">
              {copy("PROCESSOS CONTÍNUOS DE PROTEÇÃO & OTIMIZAÇÃO.", "ONGOING PROTECTION & OPTIMIZATION.", "PROTECCIÓN Y OPTIMIZACIÓN CONTINUAS.")}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans">
              {copy("Zelar pela saúde e alto dinamismo da sua presença virtual não é um esforço esporádico. Operamos em ciclos rígidos de auditorias periódicas para garantir que tudo opere em velocidade máxima e estabilidade cirúrgica.", "Maintaining a healthy, responsive online presence takes ongoing work. We use regular review cycles to support performance and stability.", "Mantener una presencia digital saludable y dinámica requiere trabajo continuo. Realizamos ciclos periódicos de revisión para apoyar el rendimiento y la estabilidad.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-8 rounded-[28px] bg-white/[0.01] border border-white/[0.04] space-y-6 hover:border-brand/15 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand">
                <FileCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-3">
                <h4 className="text-white text-lg font-display font-black">{copy("Manutenção Regular", "Regular maintenance", "Mantenimiento periódico")}</h4>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                  {copy("Realizamos a atualização síncrona de CMSs, plugins essenciais e temas estruturais para fechar lacunas e melhorar a integridade técnica das entregas de carregamento.", "We update CMSs, essential plugins and themes to address gaps and support technical integrity and loading performance.", "Actualizamos CMS, plugins esenciales y temas para corregir brechas y respaldar la integridad técnica y el rendimiento de carga.")}
                </p>
              </div>
              <ul className="space-y-2 pt-2 border-t border-white/5 text-xs text-zinc-450 font-sans">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" /> {copy("Updates Semanais Certificados", "Weekly updates", "Actualizaciones semanales")}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" /> {copy("Testabilidade Pas-deploy", "Post-deployment testing", "Pruebas posteriores al despliegue")}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" /> {copy("Otimização Fina de Banco", "Database optimization", "Optimización de bases de datos")}</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-[28px] bg-white/[0.01] border border-white/[0.04] space-y-6 hover:border-brand/15 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand">
                <Award className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-3">
                <h4 className="text-white text-lg font-display font-black">{copy("Auditorias de Segurança", "Security audits", "Auditorías de seguridad")}</h4>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                  {copy("Rigorosas avaliações periódicas para detectar eventuais scripts invasivos ou brechas, mapeando com absoluta precisão qualquer vulnerabilidade para rápido reparo.", "Regular assessments to identify intrusive scripts or security gaps and map vulnerabilities for prompt remediation.", "Evaluaciones periódicas para detectar scripts intrusivos o brechas de seguridad e identificar vulnerabilidades para corregirlas a tiempo.")}
                </p>
              </div>
              <ul className="space-y-2 pt-2 border-t border-white/5 text-xs text-zinc-450 font-sans">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" /> {copy("Varreduras Heurísticas Ativas", "Active heuristic scans", "Análisis heurísticos activos")}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" /> {copy("Emissão de Relatórios Claros", "Clear reporting", "Informes claros")}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" /> {copy("Correção Imediata de Bugs", "Prompt bug fixes", "Corrección rápida de errores")}</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-[28px] bg-white/[0.01] border border-white/[0.04] space-y-6 hover:border-brand/15 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-3">
                <h4 className="text-white text-lg font-display font-display font-black">{copy("Fila de Backups e Rollback", "Backups and rollback", "Copias de seguridad y reversión")}</h4>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                  {copy("Garantimos capias de segurança redundantes, de forma que, caso ocorra alguma falha cratica provocêda por scripts externos ou erro de operação, o site possa ser restaurado sem sobressaltos.", "We maintain redundant backups so the website can be restored if an issue is caused by external scripts or an operational error.", "Mantenemos copias redundantes para poder restaurar el sitio si ocurre un problema debido a scripts externos o a un error operativo.")}
                </p>
              </div>
              <ul className="space-y-2 pt-2 border-t border-white/5 text-xs text-zinc-450 font-sans">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" /> {copy("Retenção físico-geográfica", "Geographically distributed retention", "Retención geográficamente distribuida")}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" /> {copy("Planos de Reparo Clássicos", "Recovery plans", "Planes de recuperación")}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" /> {copy("Rollback sob medida e rápido", "Tailored, fast rollback", "Reversión rápida y personalizada")}</li>
              </ul>
            </div>

          </div>
        </section>

        {/* SECTION 3: IMMERSIVE COCKPIT - SERVIDORES & PROTOCOLOS DE segurança */}
        <section className="bg-[#050505]/40 border border-white/[0.04] rounded-[40px] p-6 sm:p-10 md:p-14 text-left relative overflow-hidden space-y-12">
          {/* Subtle cyber background grid decoration */}
          <div className="absolute inset-0 radial-grid opacity-[0.14] pointer-events-none" />

          {/* Heading */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end relative z-10 border-b border-white/[0.06] pb-8">
            <div className="lg:col-span-7 space-y-3">
              <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black leading-none flex items-center gap-1.5">
                <Terminal className="w-4 h-4 animate-pulse text-brand" /> {copy("CONTROLE TaTICO & TELEMETRIA", "TACTICAL CONTROL & TELEMETRY", "CONTROL TÁCTICO Y TELEMETRÍA")}
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3.5xl md:text-4xl text-white leading-none tracking-tight">
                {copy("A INFRAESTRUTURA POR TRaS DA BLINDAGEM.", "THE INFRASTRUCTURE BEHIND THE PROTECTION.", "LA INFRAESTRUCTURA QUE RESPALDA LA PROTECCIÓN.")}
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-450 text-xs sm:text-sm font-sans leading-relaxed">
                {copy("Nossos pacotes computacionais combinam máquinas dedicadas de alta performance com inteligência cibernética integrada, protegendo o legado digital da sua corporação com máxima segurança contra intrusões maliciosas e ataques de negação de serviço.", "Our computing packages combine dedicated high-performance machines with integrated security measures to help protect your organization's digital assets from malicious intrusions and denial-of-service attacks.", "Nuestros paquetes de infraestructura combinan máquinas dedicadas de alto rendimiento con medidas de seguridad integradas para ayudar a proteger los activos digitales de tu organización frente a intrusiones maliciosas y ataques de denegación de servicio.")}
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
                    <span className="tag08-meta text-xs text-white/95 font-bold uppercase tracking-widest">{copy("SERVIDORES DE ALTA PERFORMANCE VATIVOS", "HIGH-PERFORMANCE ACTIVE SERVERS", "SERVIDORES ACTIVOS DE ALTO RENDIMIENTO")}</span>
                  </div>
                  <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest">{copy("NODES INTACT // BR & US", "NODES ONLINE // BR & US", "NODOS ACTIVOS // BR Y EE. UU.")}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Tech indicator 1 */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1 text-left">
                    <span className="text-zinc-500 tag08-meta text-xs uppercase font-black tracking-wider block">{copy("POTÊNCIA GERAL", "COMPUTING POWER", "POTENCIA DE CÓMPUTO")}</span>
                    <h4 className="text-white font-display font-black text-base leading-none">{copy("MaXIMO PODER", "MAXIMUM POWER", "MÁXIMA POTENCIA")}</h4>
                    <p className="text-zinc-455 text-xs font-sans leading-tight mt-1.5">
                      {copy("Processadores de múltiplos núcleos para manter seu site rodando com carregamentos estáveis e ausência total de lentidão.", "Multi-core processors to support stable website loading and performance.", "Procesadores multinúcleo para respaldar una carga y un rendimiento estables del sitio web.")}
                    </p>
                  </div>
                  {/* Tech indicator 2 */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1 text-left">
                    <span className="text-zinc-500 tag08-meta text-xs uppercase font-black tracking-wider block">{copy("TECNOLOGIA DE PONTA", "ADVANCED TECHNOLOGY", "TECNOLOGÍA AVANZADA")}</span>
                    <h4 className="text-white font-display font-black text-base leading-none">{copy("HARDWARE SSD NVMe", "NVMe SSD HARDWARE", "HARDWARE SSD NVMe")}</h4>
                    <p className="text-zinc-455 text-xs font-sans leading-tight mt-1.5">
                      {copy("Arquiteturas robustas em estado sólido e memória de alta transferência computacional para carregar fotos e dados instantaneamente.", "Solid-state storage and high-throughput memory to load images and data quickly.", "Almacenamiento de estado sólido y memoria de alta velocidad para cargar imágenes y datos con rapidez.")}
                    </p>
                  </div>
                  {/* Tech indicator 3 */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1 text-left">
                    <span className="text-zinc-500 tag08-meta text-xs uppercase font-black tracking-wider block">{copy("SUPERVISÃO", "MONITORING", "MONITOREO")}</span>
                    <h4 className="text-brand font-display font-black text-base leading-none">{copy("MONITORIA 24/7", "24/7 MONITORING", "MONITOREO 24/7")}</h4>
                    <p className="text-zinc-455 text-xs font-sans leading-tight mt-1.5">
                      {copy("Sistemas inteligentes que fiscalizam hardware e integridade de arquivos constantemente, alertando técnicos proativamente.", "Systems continuously monitor hardware and file integrity and notify technicians when needed.", "Los sistemas supervisan continuamente el hardware y la integridad de los archivos, y avisan al equipo técnico cuando es necesario.")}
                    </p>
                  </div>
                </div>

                {/* Progress bars showing live resources */}
                <div className="space-y-3.5 pt-2">
                  <div className="space-y-1 text-left">
                    <div className="flex justify-between font-sans text-xs text-zinc-400 font-black">
                      <span>{copy("MÉDIA GERAL DE DISPONIBILIDADE (UPTIME)", "OVERALL AVAILABILITY (UPTIME)", "DISPONIBILIDAD GENERAL (UPTIME)")}</span>
                      <span className="text-brand">{copy("99.99% GARANTIDO", "99.99% GUARANTEED", "99,99% GARANTIZADO")}</span>
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
                    <div className="flex justify-between font-sans text-xs text-zinc-400 font-black">
                      <span>{copy("BLINDAGEM CONTRA ATAQUES COGNITIVOS DDOS", "PROTECTION AGAINST DDOS ATTACKS", "PROTECCIÓN CONTRA ATAQUES DDOS")}</span>
                      <span className="text-white">{copy("FILTRO DE 100% DAS AMEAaAS", "100% THREAT FILTERING", "FILTRADO DEL 100% DE LAS AMENAZAS")}</span>
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
                <span className="tag08-meta text-xs text-brand uppercase font-black tracking-widest block leading-none">
                  {copy("SISTEMA DE BLINDAGEM ATIVA", "ACTIVE PROTECTION SYSTEM", "SISTEMA DE PROTECCIÓN ACTIVA")}
                </span>
                <p className="text-zinc-450 text-xs sm:text-sm font-sans leading-relaxed">
                  {copy("Tratamos a segurança das suas informações de forma minuciosa, integrando camadas tecnolagicas de inteligência e varreduras com auditora regular:", "We take a careful approach to information security, combining technology layers with regular scans and reviews:", "Cuidamos de la seguridad de tu información con atención, combinando capas tecnológicas con análisis y revisiones periódicas:")}
                </p>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-brand/20 transition-all flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
                      <Shield className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="space-y-0.5">
                    <h4 className="text-white text-xs sm:text-sm font-display font-black">{copy("Firewalls e Detecção de Intrusão", "Firewalls and intrusion detection", "Firewalls y detección de intrusiones")}</h4>
                      <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                        {copy("Filtros inteligentes que servem como primeira linha de defesa ativa, mitigando acessos maliciosos antes que afetem seus serviços.", "Intelligent filters that serve as a first line of defense and help mitigate malicious access before it affects your services.", "Filtros inteligentes que sirven como primera línea de defensa y ayudan a mitigar accesos maliciosos antes de que afecten tus servicios.")}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-brand/20 transition-all flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
                      <Key className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="space-y-0.5">
                    <h4 className="text-white text-xs sm:text-sm font-display font-black">{copy("Certificados SSL/TLS Avançados", "Advanced SSL/TLS certificates", "Certificados SSL/TLS avanzados")}</h4>
                      <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                        {copy("Criptografia robusta entre o site e seus visitantes para salvaguardar senhas, dados de pagamentos comerciais e formulários de conversão.", "Encryption between the website and its visitors to help protect passwords, payment information and conversion forms.", "Cifrado entre el sitio web y sus visitantes para ayudar a proteger contraseñas, datos de pago y formularios de conversión.")}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-brand/20 transition-all flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
                      <Lock className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-white text-xs sm:text-sm font-display font-black">{copy("Atualizações e Patches de Segurança Contínuos", "Ongoing security updates and patches", "Actualizaciones y parches de seguridad continuos")}</h4>
                      <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                        {copy("Fechamento imediato de vulnerabilidades em tempo recorde através de rotinas aplicadas por especialistas em infraestrutura da TAG08.", "TAG08 infrastructure specialists apply maintenance routines to address identified vulnerabilities.", "El equipo de infraestructura de TAG08 aplica rutinas de mantenimiento para corregir las vulnerabilidades detectadas.")}
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
              <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black leading-none">
                {copy("ENGENHARIA E OPERAÇÕES // SIMPLICIDADE EXPLICITADA", "ENGINEERING & OPERATIONS // MADE SIMPLE", "INGENIERÍA Y OPERACIONES // EN SIMPLE")}
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4.5xl md:text-5xl text-white leading-none tracking-tighter">
                {copy("COMO FUNCIONA:", "HOW IT WORKS:", "CÓMO FUNCIONA:")} <br />
                <span className="text-brand">{copy("UMA JORNADA POR DETRaS DAS CORTINAS.", "A LOOK BEHIND THE SCENES.", "UN RECORRIDO ENTRE BASTIDORES.")}</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                {copy("Toda grande presença corporativa possui segredos de harmonia técnica invisaveis aos olhos comuns. Veja abaixo como combinamos hardware soberano e carinho técnico em etapas simplificadas.", "A reliable corporate presence depends on technical work that often goes unseen. See how we combine infrastructure and maintenance in a few clear steps.", "Una presencia corporativa confiable depende de un trabajo técnico que suele pasar inadvertido. Descubre cómo combinamos infraestructura y mantenimiento en unos pocos pasos claros.")}
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
                      <span className="tag08-meta text-xs uppercase tracking-widest font-semibold block text-zinc-500">
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
                      <span className="font-sans text-xs text-brand bg-brand/10 border border-brand/15 px-2.5 py-1 rounded uppercase font-black">
                        {journeySteps[activeJourney].label}
                      </span>
                      <span className="font-sans text-xs text-zinc-500">{copy("AUDITORIA TÉCNICA TAG08", "TAG08 TECHNICAL REVIEW", "REVISIÓN TÉCNICA TAG08")}</span>
                    </div>
                    
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
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
                      <span className="tag08-meta text-xs text-zinc-400 font-bold uppercase tracking-wider">{copy("MÉTRICA ATIVA DE ENTREGA", "ACTIVE SERVICE METRIC", "MÉTRICA ACTIVA DEL SERVICIO")}</span>
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
              <span className="tag08-meta text-xs text-brand bg-brand/10 border border-brand/15 px-2.5 py-1 rounded inline-block uppercase tracking-widest font-black">
                {copy("SELEaaO INTELIGENTE POR NICHO", "SMART SELECTION BY NEED", "SELECCIÓN SEGÚN TUS NECESIDADES")}
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4.5xl md:text-5xl text-white tracking-tighter leading-none">
                {copy("ESCOLHA A HOSPEDAGEM PERFEITA", "CHOOSE THE RIGHT HOSTING", "ELIGE EL ALOJAMIENTO ADECUADO")} <br />
                <span className="text-brand">{copy("E COMECE DA MANEIRA CERTA.", "AND GET STARTED WITH CONFIDENCE.", "Y EMPIEZA CON BUEN PIE.")}</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                {copy("Cada estágio comercial necessita de uma dosagem específica de recursos de servidores e infraestrutura para garantir viabilidade orçamentária e performance sólida. Encontre a ideal abaixo.", "Each business stage needs a different balance of server resources and infrastructure. Find an option that fits below.", "Cada etapa del negocio necesita un equilibrio distinto de recursos de servidor e infraestructura. Encuentra una opción adecuada a continuación.")}
              </p>
            </div>
          </div>

          {/* Elegant Category Filter Buttons */}
          <div className="flex flex-wrap gap-2.5 pb-2">
            {[
              { id: "todos", label: copy("Todos os Setups", "All setups", "Todos los planes") },
              { id: "corporativo", label: copy("Infraestrutura Corporativa", "Corporate infrastructure", "Infraestructura corporativa") },
              { id: "especializado", label: copy("Ambientes e Nichos", "Specialized environments", "Entornos especializados") },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setPlanCategory(cat.id as any)}
                className={`px-5 py-2.5 rounded-xl font-sans text-xs font-black uppercase tracking-widest transition-all duration-300 pointer-events-auto cursor-pointer border ${
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
                        className={`p-6 sm:p-8 rounded-[32px] border transition-all duration-300 relative flex flex-col justify-between text-left ${
                          isSelected
                            ? "bg-[#09090b] border-brand shadow-[0_15px_45px_rgba(var(--color-brand-rgb),0.06)] scale-[1.01]"
                            : "bg-white/[0.01] border-white/5 hover:border-white/15"
                        }`}
                      >
                        <button
                          type="button"
                          aria-label={copy(`Selecionar ${host.title}`, `Select ${host.title}`, `Seleccionar ${host.title}`)}
                          aria-pressed={isSelected}
                          onClick={() => setSelectedHosting(host.id)}
                          className="absolute inset-0 z-10 rounded-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
                        />
                        {/* Floating Selection Indicator Badge */}
                        <div className="absolute top-5 right-5 flex items-center gap-1.5">
                          <span className="tag08-meta text-xs text-zinc-500 font-bold uppercase tracking-widest">
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
                            <h3 className="font-display font-black text-lg sm:text-xl text-white tracking-tight leading-tight">
                              {host.title}
                            </h3>
                            <span className="font-sans text-xs sm:text-xs text-brand font-semibold uppercase block leading-none">
                              {copy("IDEAL PARA:", "IDEAL FOR:", "IDEAL PARA:")} {host.niche}
                            </span>
                          </div>

                          <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                            {host.description}
                          </p>
                        </div>

                        {/* Built-in high specs lists */}
                        <div className="border-t border-white/[0.05] pt-6 mt-6 space-y-3 justify-end">
                          <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest block font-bold leading-none">{copy("CARACTERÍSTICAS INCLUSAS:", "INCLUDED FEATURES:", "CARACTERÍSTICAS INCLUIDAS:")}</span>
                          <ul className="space-y-2 text-xs sm:text-xs font-sans text-zinc-400">
                            {host.specs.map((spec, sIdx) => (
                              <li key={sIdx} className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" />
                                <span>{spec}</span>
                              </li>
                            ))}
                          </ul>
                          <TrackedOutboundLink
                            label={copy(`Solicitar ${host.title}`, `Request ${host.title}`, `Solicitar ${host.title}`)}
                            surface="hospedagem-solution-card"
                            href={buildBrazilWhatsAppUrl(copy(`Olá TAG08! Gostaria de conversar sobre a solução de "${host.title}" para minha empresa.`, `Hello TAG08! I would like to discuss the "${host.title}" solution for my business.`, `Hola TAG08. Me gustaría conversar sobre la solución "${host.title}" para mi empresa.`))}
                            target="_blank"
                            rel="noreferrer"
                            className="relative z-20 mt-6 w-full min-h-11 py-3 rounded-xl tag08-action text-xs font-black uppercase text-center block tracking-widest transition-all duration-300 border bg-white/5 border-white/10 text-white hover:bg-brand hover:border-brand hover:text-black hover:shadow-lg"
                          >
                            {copy("Solicitar esta opção", "Request this option", "Solicitar esta opción")}
                          </TrackedOutboundLink>
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
                <span className="tag08-meta text-xs text-brand bg-brand/10 border border-brand/15 px-2.5 py-1 rounded inline-block uppercase tracking-widest font-black">
                  {copy("ALICERCES PADRONIZADOS PRONTOS", "STANDARD PLANS READY TO GO", "PLANES ESTÁNDAR LISTOS")}
                </span>
                <h2 className="font-display font-black text-3xl sm:text-4.5xl md:text-5xl text-white tracking-tighter leading-none">
                  {copy("PLANOS DE HOSPEDAGEM", "HOSTING PLANS", "PLANES DE ALOJAMIENTO")} <br />
                  <span className="text-brand">{copy("& ZELADORIA REGULAR.", "& REGULAR MAINTENANCE.", "Y MANTENIMIENTO PERIÓDICO.")}</span>
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {copy("Perfeito para empresas que buscam conveniência e configurações de ponta já ajustadas à demanda da fase atual. Escolha seu plano com faturamento fixo mensal em cloud.", "For businesses looking for convenience and configurations suited to their current needs. Choose a plan with a fixed monthly cloud price.", "Para empresas que buscan comodidad y configuraciones adecuadas a sus necesidades actuales. Elige un plan con un precio mensual fijo en la nube.")}
                </p>
              </div>
            </div>

            {/* High-Contrast Comparative 3-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {[
                {
                  id: "basico",
                  name: "Plano Básico",
                  startingPrice: "R$ 49,00",
                  audience: "Institucionais & Portfalios",
                  purpose: "Validação ágil de marcas emergentes, landing pages escaláveis, blogs jornalasticos e portfalios elegantes de alto impacto.",
                  accentBorder: "border-white/5",
                  bgCard: "bg-[#0b0c0e] hover:border-white/12",
                  highlightBadge: null,
                  resources: [
                    { label: "Armazenamento", value: "5 GB SSD NVMe", tooltip: "Solid State Drives corporativos com taxas de transferência ultrarrápidas, carregando imagens e páginas instantaneamente." },
                    { label: "Emails Profissionais", value: "10 Contas inclusas", tooltip: "Contas personalizadas com seu domínio (seu@nome.com.br) com proteção nativa contra spam e gateway corporativo." },
                    { label: "Tráfego Mensal", value: "500 GB de Volume", tooltip: "Banda larga de dados expansiva apta para resistir à navegação constante de milhares de visitantes." },
                    { label: "Bancos de Dados", value: "1 Banco MySQL", tooltip: "Base estruturada e blindada ideal para sustentar o banco de dados principal do seu WordPress ou aplicação sênior." },
                    { label: "Zeladoria Regular", value: "Updates Trimestrais", tooltip: "Revisão e atualizações proativas a cada 3 meses sob demanda para certificar que seus plugins e temas estejam saudáveis." },
                    { label: "Certificação SSL", value: "Let's Encrypt Incluso", tooltip: "Criptografia HTTPS de segurança máxima ativa para proteção de dados sensíveis e melhor ranqueamento no algoritmo de buscas." },
                  ]
                },
                {
                  id: "intermediario",
      name: "Plano Intermediário",
                  startingPrice: "R$ 99,00",
                  audience: "Pequenos E-commerces & Empresas",
                  purpose: "Ideal para empresas em crescimento estável, portais comerciais e marcas que investem em captação contínua em tráfego pago.",
                  accentBorder: "border-brand/45",
                  bgCard: "bg-[#090a0d] border-brand/40 shadow-[0_15px_45px_rgba(var(--color-brand-rgb),0.04)]",
                  highlightBadge: "MAIS RECOMENDADO",
                  resources: [
                    { label: "Armazenamento", value: "15 GB SSD NVMe", tooltip: "Armazenamento corporativo expandido, ideal para catálogos de produtos com muitas fotos e mídias ricas." },
                    { label: "Emails Profissionais", value: "50 Contas inclusas", tooltip: "Franquia sob medida para organizar todos os seus canais: suporte, financeiro, parcerias e conselho." },
                    { label: "Tráfego Mensal", value: "2 TB de Volume", tooltip: "Franquia colossal desenvolvida para aguentar surtos reais de visitas gerados por investimentos no Meta Ads ou Google Ads." },
                    { label: "Bancos de Dados", value: "5 Bancos MySQL", tooltip: "Oferece flexibilidade total para instalar e hospedar subsistemas, ambientes de teste isolados ou áreas de membro." },
                    { label: "Zeladoria Regular", value: "Updates Mensais", tooltip: "Zeladoria técnica proativa a cada 30 dias com limpeza preventiva do WP, otimização de consultas lentas e análise de vulnerabilidade." },
                    { label: "Cópia Preventiva", value: "Backup Semanal Isolado", tooltip: "Backup adicional de segurança periódico gerado e copiado automaticamente para um data center secundário isolado." },
                  ]
                },
                {
                  id: "avancado",
                  name: "Plano Avançado",
                  startingPrice: "R$ 199,00",
                  audience: "Marcas Premium & Alto Volume",
                  purpose: "A engrenagem topo de linha perfeita para portais institucionais complexos, lojas virtuais massivas e marcas premium com tráfego intenso.",
                  accentBorder: "border-brand",
                  bgCard: "bg-[#0d0e11] border-brand shadow-[0_20px_50px_rgba(var(--color-brand-rgb),0.08)]",
      highlightBadge: "POTÊNCIA TOTAL CORPORATIVA",
                  resources: [
                    { label: "Armazenamento", value: "30 GB SSD NVMe", tooltip: "Armazenamento ultrarrápido premium com CPU prioritária dedicada e limites de IOPS elevados para tolerância zero à latência." },
                    { label: "Emails Profissionais", value: "Contas ILIMITADAS", tooltip: "Crie quantas caixas corporativas sua operação necessitar sem qualquer cobrança por caixas extras. Liberdade total para novos funcionários." },
                    { label: "Tráfego Mensal", value: "4.5 TB de Volume", tooltip: "Vazão de dados monumental capaz de suportar lançamentos robustos de infoprodutos, campanhas agressivas e Black Fridays." },
                    { label: "Bancos de Dados", value: "Bancos ILIMITADOS", tooltip: "Flexibilidade para hospedar múltiplos bancos de dados para CRM interno, múltiplos e-commerces paralelos ou integrações complexas." },
                    { label: "Zeladoria Regular", value: "Análise Semanal Ativa", tooltip: "Zeladoria técnica de alto nível com testes periódicos de vulnerabilidade externa, otimização intensiva de banco e monitoramento ativo." },
                    { label: "Aceleração Global", value: "CDN Giga Integrada", tooltip: "Roteamento global que entrega arquivos estáticos e de mídia próximos ao local de acesso de cada usuário, reduzindo latência em até 80%." },
                  ]
                }
              ].map((plan) => {
                const localizedPlan = locale === "pt" ? plan : planNames[locale][plan.id];
                const outboundPlanName = locale === "pt" ? plan.name : localizedPlan.name;
                const localizedBadge = locale === "pt" ? plan.highlightBadge : planNames[locale][plan.id].badge;
                return (
                <div
                  key={plan.id}
                  className={`p-8 rounded-[32px] border flex flex-col justify-between transition-all duration-300 relative text-left ${plan.accentBorder} ${plan.bgCard}`}
                >
                  {plan.highlightBadge && (
                    <div className="absolute top-5 right-5 font-sans text-xs tracking-widest font-black uppercase bg-brand text-black px-2.5 py-1 rounded">
                      {localizedBadge}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <span className="tag08-meta text-xs text-brand font-black uppercase tracking-widest block">
                        {localizedPlan.audience}
                      </span>
                      <h3 className="font-display font-black text-2xl text-white tracking-tight">
                        {localizedPlan.name}
                      </h3>
                      <p className="text-zinc-400 text-xs font-sans leading-relaxed pt-2 border-b border-white/[0.04] pb-4">
                        {localizedPlan.purpose}
                      </p>
                    </div>

                    <div className="py-2 border-b border-white/[0.04] pb-6 flex items-baseline gap-1.5">
                      <span className="text-zinc-500 font-sans text-xs uppercase">{copy("INVESTIMENTO INTEGRAL:", "TOTAL INVESTMENT:", "INVERSIÓN TOTAL:")}</span>
                      <span className="font-sans text-3xl font-black text-white">{plan.startingPrice}</span>
                      <span className="text-zinc-500 text-xs font-sans">{copy("/mês", "/month", "/mes")}</span>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4 pt-2">
                      <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest block font-bold">{copy("REQUISITOS TÉCNICOS INTEGRADOS:", "INCLUDED TECHNICAL SPECIFICATIONS:", "ESPECIFICACIONES TÉCNICAS INCLUIDAS:")}</span>
                      <ul className="space-y-2.5">
                        {plan.resources.map((res, rIdx) => {
                          const localizedResource = locale === "pt" ? res : localizedPlan.resources[rIdx];
                          return (
                          <li key={rIdx} className="flex items-center justify-between group/feat py-0.5 border-b border-white/[0.02]">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                              <span className="text-xs text-zinc-300 font-medium">{localizedResource.value}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-500 font-sans hidden sm:inline-block opacity-0 group-hover/feat:opacity-85 transition-opacity">
                                {localizedResource.label}
                              </span>
                              <div className="relative group/tool inline-flex items-center">
                                <HelpCircle className="w-3.5 h-3.5 text-zinc-600 hover:text-brand cursor-help transition-colors select-none" />
                                <div className="absolute bottom-full right-0 mb-3 w-64 bg-[#0a0a0c] border border-white/10 text-zinc-300 text-xs p-4 rounded-xl opacity-0 pointer-events-none group-hover/tool:opacity-100 transition-opacity duration-200 shadow-2xl z-50 leading-relaxed font-sans normal-case tracking-normal">
                                  <div className="absolute top-full right-1.5 border-[6px] border-transparent border-t-[#0a0a0c] w-0 h-0" />
                                  <div className="tag08-meta text-xs text-brand font-black uppercase tracking-wider mb-1.5">
                                    {localizedResource.label}
                                  </div>
                                  {localizedResource.tooltip}
                                </div>
                              </div>
                            </div>
                          </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8 mt-8 border-t border-white/[0.04]">
                    <TrackedOutboundLink
                      label={copy(`Contratar ${plan.name}`, `Choose ${outboundPlanName}`, `Contratar ${outboundPlanName}`)}
                      surface="hospedagem-plan-cta"
                      href={buildBrazilWhatsAppUrl(`${encodeURIComponent(
                        locale === "pt"
                          ? `Olá TAG08! Gostaria de conversar com os engenheiros comerciais para fechar a contratação do "${plan.name.toUpperCase()}" de Hospedagem & Zeladoria no valor recorrente de ${plan.startingPrice}/mês. Aguardo retorno!`
                          : locale === "en"
                            ? `Hello TAG08! I would like to discuss purchasing the "${outboundPlanName.toUpperCase()}" hosting and maintenance plan at ${plan.startingPrice}/month. I look forward to hearing from you!`
                            : `Hola TAG08. Me gustaría conversar sobre la contratación del plan de alojamiento y mantenimiento "${outboundPlanName.toUpperCase()}" por ${plan.startingPrice}/mes. Quedo atento a su respuesta.`
                      )}`)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-4 rounded-xl bg-white hover:bg-brand hover:text-black hover:border-brand text-[#030303] tag08-action text-xs font-black uppercase text-center block tracking-widest transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] shadow-md border border-white/10"
                    >
                      {copy("CONTRATAR ESTE ALICERCE", "CHOOSE THIS PLAN", "CONTRATAR ESTE PLAN")}
                    </TrackedOutboundLink>
                  </div>
                </div>
              );})}
            </div>
            
            <div className="pt-6 text-center">
              <span className="text-zinc-550 font-sans text-xs uppercase tracking-widest block leading-relaxed">
                {copy("* Todos os planos de alicerce contam com isolamento de kernel virtual, mitigação ativa de DDoS de 50 Gbps e suporte a SSL Let's Encrypt gratuito com updates proativos incluídos.", "* All plans include virtual kernel isolation, active 50 Gbps DDoS mitigation, free Let's Encrypt SSL and proactive updates.", "* Todos los planes incluyen aislamiento de kernel virtual, mitigación activa de DDoS de 50 Gbps, SSL gratuito de Let's Encrypt y actualizaciones proactivas.")}
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
                  <span className="tag08-meta text-xs text-brand bg-brand/10 border border-brand/20 px-3 py-1 rounded inline-block uppercase tracking-widest font-black">
                    {copy("CUSTOMIZação EM REAL-TIME", "CUSTOMIZE IN REAL TIME", "PERSONALIZA EN TIEMPO REAL")}
                  </span>
                  <h2 className="font-display font-black text-3.5xl sm:text-4.5xl md:text-5.5xl text-white tracking-tighter leading-none">
                    {copy("MONTE SEU SETUP", "BUILD YOUR SETUP", "CONFIGURA TU PLAN")} <br />
                    <span className="text-brand">{copy("SOB MEDIDA.", "TAILORED TO YOU.", "A TU MEDIDA.")}</span>
                  </h2>
                </div>
                <div className="lg:col-span-5 text-left">
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed border-l-2 border-brand/20 pl-4">
                    {copy("Selecione o estágio de partida que melhor traduz o momento atual do seu negócio e adicione recursos dedicados de forma fluida. O simulador reajusta os valores instantaneamente.", "Choose the starting point that best fits your business today, then add resources as needed. The simulator updates the estimate instantly.", "Elige el punto de partida que mejor se adapte a tu negocio y añade recursos según lo necesites. El simulador actualiza el cálculo al instante.")}
                  </p>
                </div>
              </div>

              {/* Step 1: Base Engine Selector tabs */}
              <div className="space-y-6 text-left">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
                  <span className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest block font-black">{copy("PASSO #01 // DEFINA SEU ENGINE DE SERVIDOR (CPU & RAM BASE)", "STEP #01 // CHOOSE YOUR SERVER ENGINE (BASE CPU & RAM)", "PASO #01 // ELIGE EL MOTOR DEL SERVIDOR (CPU Y RAM BASE)")}</span>
                </div>
                
                <fieldset className="min-w-0">
                  <legend className="sr-only">{copy("Selecione o plano de servidor", "Select a server plan", "Selecciona un plan de servidor")}</legend>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {[
                    {
                      id: "basico",
                      name: "CLOUD SOLO",
                      cpu: "1 vCPU Dedicada",
                      ram: "1 GB RAM",
                      audience: "1 Core de Processamento",
                      purpose: "Motor leve perfeito para landing pages, sites institucionais padrão e blogs jornalísticos focados em velocidade.",
                      startingPrice: "R$ 49,00",
                      badge: "V-Core Alpha I",
                    },
                    {
                      id: "intermediario",
                      name: "CLOUD DUO",
                      cpu: "2 vCPUs Dedicadas",
                      ram: "4 GB RAM",
                      audience: "2 Cores de Processamento",
                      purpose: "Processamento duplicado calibrado para suportar múltiplos portais comerciais, pequenos e-commerces e tráfego estável.",
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
                    const audience = copy(p.audience, `${p.id === "basico" ? "1" : p.id === "intermediario" ? "2" : "4"} processing ${p.id === "basico" ? "core" : "cores"}`, `${p.id === "basico" ? "1" : p.id === "intermediario" ? "2" : "4"} ${p.id === "basico" ? "núcleo" : "núcleos"} de procesamiento`);
                    const purpose = copy(
                      p.purpose,
                      p.id === "basico" ? "A lightweight engine perfect for landing pages, standard corporate websites and news blogs focused on speed." : p.id === "intermediario" ? "Duplicated processing power calibrated to support multiple business websites, small online stores and steady traffic." : "A powerful engine in an isolated environment focused on complex corporate websites, active online stores and severe traffic peaks.",
                      p.id === "basico" ? "Un motor ligero, perfecto para páginas de aterrizaje, sitios corporativos estándar y blogs informativos enfocados en la velocidad." : p.id === "intermediario" ? "Procesamiento duplicado calibrado para admitir varios sitios comerciales, pequeñas tiendas online y tráfico estable." : "Un motor potente en un entorno aislado, enfocado en sitios corporativos complejos, tiendas online activas y picos intensos de tráfico."
                    );
                    const cpu = copy(p.cpu, p.cpu.replace(" Dedicadas", " dedicated").replace(" Dedicada", " dedicated"), p.cpu.replace(" Dedicadas", " dedicadas").replace(" Dedicada", " dedicada"));
                      return (
                      <div
                        key={p.id}
                        className={`group/card relative flex cursor-pointer select-none flex-col justify-between rounded-2xl border p-6 text-left transition-all duration-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-brand/70 focus-within:ring-offset-2 focus-within:ring-offset-charcoal-950 ${
                          isActive
                            ? "bg-[#0b0b0e] border-brand text-white shadow-[0_0_40px_rgba(var(--color-brand-rgb),0.06)]"
                            : "bg-[#121214]/40 border-white/5 text-zinc-400 hover:border-white/12 hover:bg-[#121214]/65"
                        }`}
                      >
                        <input
                          id={`hosting-plan-${p.id}`}
                          type="radio"
                          name="hosting-server-plan"
                          value={p.id}
                          aria-label={`${p.name}: ${audience}`}
                          checked={isActive}
                          onChange={() => handlePlanChange(p.id as HostingPlan)}
                          className="sr-only"
                        />
                        {/* Selected Indicator Badge */}
                        <div className="absolute top-4 right-4 flex items-center gap-1.5">
                          {isActive ? (
                            <span className="font-sans text-xs font-black uppercase text-black bg-brand px-2 py-0.5 rounded shadow-[0_0_10px_rgba(var(--color-brand-rgb),0.2)] animate-pulse">
                              {copy("ENGINE BASE ATIVO", "BASE ENGINE ACTIVE", "MOTOR BASE ACTIVO")}
                            </span>
                          ) : (
                            <span className="font-sans text-xs text-zinc-600 group-hover/card:text-zinc-400 transition-colors uppercase font-black bg-white/5 border border-white/5 px-2 py-0.5 rounded leading-none">
                              {p.badge}
                            </span>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <span className={`text-xs tag08-meta font-black uppercase tracking-widest block transition-colors ${isActive ? "text-brand" : "text-zinc-500 group-hover/card:text-zinc-400"}`}>
                              {audience}
                            </span>
                            <h3 className="font-display font-black text-sm tracking-tight text-white block">
                              {p.name}
                            </h3>
                          </div>

                          <p className="text-xs text-zinc-400 leading-relaxed font-sans border-b border-white/[0.04] pb-4">
                            {purpose}
                          </p>

                          <div className="grid grid-cols-2 gap-2 text-left font-sans text-xs">
                            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
                              <span className="block text-zinc-600 text-xs uppercase font-bold tracking-wider">{copy("MÁQUINA CPU:", "CPU:", "CPU:")}</span>
                              <span className="text-zinc-300 font-bold">{cpu}</span>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
                              <span className="block text-zinc-650 text-xs uppercase font-bold tracking-wider">{copy("MÁQUINA RAM:", "RAM:", "RAM:")}</span>
                              <span className="text-zinc-300 font-bold">{p.ram}</span>
                            </div>
                          </div>

                          <div className="py-2 flex items-baseline gap-1">
                            <span className="text-zinc-500 text-xs tag08-meta uppercase tracking-widest">{copy("CUSTO DO ENGINE:", "ENGINE COST:", "COSTO DEL MOTOR:")}</span>
                            <span className={`font-sans text-xl font-black transition-colors ${isActive ? "text-brand" : "text-zinc-300"}`}>
                              {p.startingPrice}
                            </span>
                            <span className="text-xs text-zinc-500 font-sans leading-none">{copy("/mês", "/month", "/mes")}</span>
                          </div>
                        </div>

                        <div className={`mt-4 pt-3 border-t border-white/[0.04] text-center tag08-meta text-xs uppercase font-black tracking-widest transition-all ${
                          isActive 
                            ? "text-brand" 
                            : "text-zinc-500 group-hover/card:text-zinc-350"
                        }`}>
                          {isActive ? copy("✓ SOLUÇÃO ACOPLADA AO TRABALHO DE CUSTOMIZAÇÃO", "✓ BASE PLAN SELECTED", "✓ PLAN BASE SELECCIONADO") : copy("[-] CLIQUE SELECIONAR E CUSTOMIZAR", "[-] SELECT TO CUSTOMIZE", "[-] SELECCIONA PARA PERSONALIZAR")}
                        </div>
                        <label htmlFor={`hosting-plan-${p.id}`} aria-hidden="true" className="absolute inset-0 z-10 cursor-pointer rounded-2xl" />
                      </div>
                    );
                  })}
                  </div>
                </fieldset>
              </div>

              {/* Simulator Core Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
                
                {/* Left Controls Box */}
                <div className="lg:col-span-7 space-y-8 bg-[#121214]/25 border border-white/[0.05] rounded-3xl p-6 sm:p-8 text-left backdrop-blur-sm">
                  
                  {/* Control 1: Websites */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="tag08-meta text-xs text-brand uppercase tracking-wider block font-black">{copy("RECURSO #02 // MULTI-SITES", "FEATURE #02 // MULTI-SITE HOSTING", "RECURSO #02 // VARIOS SITIOS")}</span>
                    <h3 className="text-white font-bold text-sm sm:text-base tracking-tight">{copy("Número de Sites Hospedados", "Number of hosted websites", "Número de sitios alojados")}</h3>
                        <p className="text-zinc-400 text-xs font-sans">{copy("Quantos portais independentes irão compartilhar estes recursos isolados?", "How many independent websites will share these isolated resources?", "¿Cuántos sitios independientes compartirán estos recursos aislados?")}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-black/60 border border-white/10 rounded-xl p-1.5 shrink-0 self-start sm:self-center">
                        <button
                          aria-label={copy("Diminuir número de sites", "Decrease number of websites", "Reducir el número de sitios")}
                          onClick={() => {
                            trackHostingSimulator("input_changed");
                            setSimSites(Math.max(1, simSites - 1));
                          }}
                          disabled={simSites <= 1}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 disabled:opacity-30 text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer border border-white/5"
                        >
                          -
                        </button>
                        <span className="font-sans font-black text-white text-base w-8 text-center">
                          {simSites}
                        </span>
                        <button
                          aria-label={copy("Aumentar número de sites", "Increase number of websites", "Aumentar el número de sitios")}
                          onClick={() => {
                            trackHostingSimulator("input_changed");
                            setSimSites(Math.min(10, simSites + 1));
                          }}
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
                      <div className="flex justify-between font-sans text-xs text-zinc-550">
                        <span>{copy("1 PORTAL INICIAL (INCLUSO)", "1 WEBSITE INCLUDED", "1 SITIO INICIAL (INCLUIDO)")}</span>
                        <span>{copy("MÁXIMO: 10 PORTAIS CONVIVENTES", "MAXIMUM: 10 HOSTED WEBSITES", "MÁXIMO: 10 SITIOS ALOJADOS")}</span>
                      </div>
                    </div>

                    {simSites > 1 && (
                      <span className="text-xs text-zinc-500 font-sans block pl-2 border-l border-brand/30">
                        {copy("* Incluso 1 site base gratuito. Cada portal adicional: ", "* One base website included. Each additional website: ", "* Se incluye 1 sitio base. Cada sitio adicional: ")}<strong>+ R$ 50,00{copy("/mês", "/month", "/mes")}</strong>.
                      </span>
                    )}
                  </div>

                  {/* Control 2: Storage Slider & Preset Badges */}
                  <div className="space-y-4 border-t border-white/[0.05] pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="tag08-meta text-xs text-brand uppercase tracking-wider block font-black">{copy("RECURSO #03 // ARMAZENAMENTO ULTRA-RAW", "FEATURE #03 // SSD NVME STORAGE", "RECURSO #03 // ALMACENAMIENTO SSD NVME")}</span>
                    <h3 className="text-white font-bold text-sm sm:text-base tracking-tight">{copy("Espaço de Disco SSD NVMe Dedicado", "Dedicated SSD NVMe storage", "Espacio de almacenamiento SSD NVMe dedicado")}</h3>
                        <p className="text-zinc-400 text-xs font-sans">
                          {copy("Sua máquina conta com discos SSD corporativos com taxas de leitura de até 7.000 MB/s.", "Your server uses business-grade SSDs with read speeds of up to 7,000 MB/s.", "Tu servidor utiliza discos SSD empresariales con velocidades de lectura de hasta 7.000 MB/s.")}
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
                          aria-label={copy("Armazenamento SSD do plano selecionado", "Selected plan SSD storage", "Almacenamiento SSD del plan seleccionado")}
                          min={simPlan === "basico" ? 5 : simPlan === "intermediario" ? 15 : 30}
                          max={simPlan === "basico" ? 50 : simPlan === "intermediario" ? 100 : 300}
                          step="5"
                          value={simStorage}
                          onChange={(e) => {
                            trackHostingSimulator("input_changed");
                            setSimStorage(parseInt(e.target.value, 10));
                          }}
                          className="w-full accent-brand bg-white/10 h-1.5 rounded-lg cursor-pointer hover:bg-white/15 transition-all"
                        />
                        <div className="flex justify-between font-sans text-xs text-zinc-500 mt-1">
                          <span>{copy("Min:", "Min:", "Mín:")} {simPlan === "basico" ? copy("5 GB (Básico)", "5 GB (Basic)", "5 GB (Básico)") : simPlan === "intermediario" ? copy("15 GB (Médio)", "15 GB (Intermediate)", "15 GB (Intermedio)") : copy("30 GB (Alto)", "30 GB (Advanced)", "30 GB (Avanzado)")}</span>
                          <span>{copy("Max:", "Max:", "Máx:")} {simPlan === "basico" ? "50 GB" : simPlan === "intermediario" ? "100 GB" : "300 GB"}</span>
                        </div>
                      </div>

                      {/* UX Upgrade: Clickable Storage Presets */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="tag08-meta text-xs text-zinc-550 uppercase tracking-wider flex items-center pr-1.5">{copy("Atalhos rápidos:", "Quick options:", "Opciones rápidas:")}</span>
                        {(simPlan === "basico" 
                          ? [5, 15, 30, 50] 
                          : simPlan === "intermediario" 
                            ? [15, 30, 60, 100] 
                            : [30, 60, 150, 300]
                        ).map((presetVal) => (
                          <button
                            key={presetVal}
                            onClick={() => {
                              trackHostingSimulator("input_changed");
                              setSimStorage(presetVal);
                            }}
                            className={`px-3 py-1 rounded-md font-sans text-xs uppercase transition-all cursor-pointer ${
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
                    
                    <span className="text-xs text-zinc-500 font-sans block pl-2 border-l border-brand/35">
                    {simPlan === "basico" && copy("* 5 GB inclusos. Adicional: R$ 3,00 por GB ao mês.", "* 5 GB included. Additional storage: BRL 3.00 per GB per month.", "* 5 GB incluidos. Almacenamiento adicional: R$ 3,00 por GB al mes.")}
                    {simPlan === "intermediario" && copy("* 15 GB inclusos. Adicional: R$ 5,00 por GB ao mês.", "* 15 GB included. Additional storage: BRL 5.00 per GB per month.", "* 15 GB incluidos. Almacenamiento adicional: R$ 5,00 por GB al mes.")}
                      {simPlan === "avancado" && copy("* 30 GB inclusos. Adicional: R$ 10,00 por GB ao mês.", "* 30 GB included. Additional storage: BRL 10.00 per GB per month.", "* 30 GB incluidos. Almacenamiento adicional: R$ 10,00 por GB al mes.")}
                    </span>
                  </div>

                  {/* Control 3: Emails Selector */}
                  <div className="space-y-4 border-t border-white/[0.05] pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="tag08-meta text-xs text-brand uppercase tracking-wider block font-black">{copy("RECURSO #04 // EMAILS CORPORATIVOS", "FEATURE #04 // BUSINESS EMAIL", "RECURSO #04 // CORREO CORPORATIVO")}</span>
                        <h3 className="text-white font-bold text-sm sm:text-base tracking-tight">{copy("Caixas de E-mail Profissionais", "Professional email accounts", "Cuentas de correo profesionales")}</h3>
                        <p className="text-zinc-400 text-xs font-sans font-light">{copy("Contas personalizadas @suamarca para comunicação direta, contendo isolamento anti-spam de ponta.", "Custom @yourbrand accounts for direct communication, with advanced spam isolation.", "Cuentas personalizadas @tumarca para comunicación directa, con aislamiento antispam avanzado.")}</p>
                      </div>

                      {simPlan === "avancado" ? (
                        <span className="font-sans font-black text-black text-xs tracking-widest bg-brand px-3.5 py-1.5 rounded-lg shrink-0 self-start sm:self-center shadow-[0_0_15px_rgba(var(--color-brand-rgb),0.1)]">
                          {copy("ILIMITADAS INCLUSAS", "UNLIMITED ACCOUNTS INCLUDED", "CUENTAS ILIMITADAS INCLUIDAS")}
                        </span>
                      ) : (
                        <div className="flex items-center gap-3 bg-black/60 border border-white/10 rounded-xl p-1.5 shrink-0 select-none self-start sm:self-center">
                          <button
                            aria-label={copy("Diminuir número de contas de e-mail", "Decrease number of email accounts", "Reducir el número de cuentas de correo")}
                            onClick={() => {
                              const step = simPlan === "basico" ? 5 : 10;
                              const min = simPlan === "basico" ? 10 : 50;
                              trackHostingSimulator("input_changed");
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
                            aria-label={copy("Aumentar número de contas de e-mail", "Increase number of email accounts", "Aumentar el número de cuentas de correo")}
                            onClick={() => {
                              const step = simPlan === "basico" ? 5 : 10;
                              trackHostingSimulator("input_changed");
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

                    <span className="text-xs text-zinc-550 block font-sans">
                      {simPlan === "basico" && copy("* 10 contas inclusas nativamente. Caixa extra: R$ 5,00 por lote de 5 e-mails.", "* 10 accounts included. Extra accounts: BRL 5.00 per batch of 5 email accounts.", "* 10 cuentas incluidas. Cuentas adicionales: R$ 5,00 por cada grupo de 5 cuentas.")}
                      {simPlan === "intermediario" && copy("* 50 contas inclusas nativamente. Caixa extra: R$ 10,00 por lote de 10 e-mails.", "* 50 accounts included. Extra accounts: BRL 10.00 per batch of 10 email accounts.", "* 50 cuentas incluidas. Cuentas adicionales: R$ 10,00 por cada grupo de 10 cuentas.")}
                      {simPlan === "avancado" && copy("* Caixa premium sem limite básico de contas no plano corporativo avançado.", "* Premium email accounts with no basic account limit on the advanced corporate plan.", "* Cuentas premium sin límite básico en el plan corporativo avanzado.")}
                    </span>
                  </div>

                  {/* Control 4: Active Upgrade */}
                  <div className="space-y-4 border-t border-white/[0.05] pt-6">
                    <div className="space-y-1">
                      <span className="tag08-meta text-xs text-brand uppercase tracking-wider block font-black">{copy("RECURSO #05 // ZELADORIA E ADICIONAIS", "FEATURE #05 // MAINTENANCE & ADD-ONS", "RECURSO #05 // MANTENIMIENTO Y EXTRAS")}</span>
                      <h3 className="text-white font-bold text-sm sm:text-base tracking-tight">{copy("Opcional Técnico de Alta Performance", "Optional technical support", "Soporte técnico opcional")}</h3>
                      <p className="text-zinc-400 text-xs font-sans">{copy("Turbine sua operação com auditoria especializada de segurança e canais prioritarios exclusivos.", "Add specialized security audits and dedicated support channels to your setup.", "Añade auditorías de seguridad especializadas y canales de soporte dedicados a tu servicio.")}</p>
                    </div>

                    <div className="pt-1">
                      <div
                        onClick={() => {
                          trackHostingSimulator("input_changed");
                          setSimApplyUpgrade(!simApplyUpgrade);
                        }}
                        onKeyDown={(event) => activateOnKeyboard(event, () => {
                          trackHostingSimulator("input_changed");
                          setSimApplyUpgrade(!simApplyUpgrade);
                        })}
                        role="checkbox"
                        aria-checked={simApplyUpgrade}
                        aria-label={copy("Adicionar cobertura técnica extra", "Add extra technical coverage", "Añadir cobertura técnica adicional")}
                        tabIndex={0}
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
                            {simApplyUpgrade && <span className="text-xs font-black">✓</span>}
                          </div>
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="tag08-meta text-xs font-black uppercase tracking-wider bg-white/5 px-2.5 py-0.5 rounded text-white inline-block">
                      {simPlan === "basico" && copy("AUDITORIA & SUPORTE SÊNIOR", "EXPERT AUDIT & SUPPORT", "AUDITORÍA Y SOPORTE ESPECIALIZADOS")}
                              {simPlan === "intermediario" && copy("BACKUP AGRESSIVO SEMANAL EXTRA", "ADDITIONAL WEEKLY BACKUP", "COPIA DE SEGURIDAD SEMANAL ADICIONAL")}
                              {simPlan === "avancado" && copy("CANAL REATIVO PRIORITÁRIO (VIP)", "PRIORITY SUPPORT CHANNEL (VIP)", "CANAL DE SOPORTE PRIORITARIO (VIP)")}
                            </span>
                            <span className="font-sans text-xs text-brand font-black">
                      {simPlan === "basico" && `+ R$ 15,00${copy("/mês", "/month", "/mes")}`}
                      {simPlan === "intermediario" && `+ R$ 20,00${copy("/mês", "/month", "/mes")}`}
                              {simPlan === "avancado" && `+ R$ 50,00${copy("/mês", "/month", "/mes")}`}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 font-sans leading-snug">
                      {simPlan === "basico" && copy("Correção técnica preferencial e monitoramento de indisponibilidade de forma ativa.", "Priority technical fixes and active availability monitoring.", "Correcciones técnicas prioritarias y monitoreo activo de disponibilidad.")}
                      {simPlan === "intermediario" && copy("Criação de backup adicional guardado em segundo data center independente (proteção máxima).", "An additional backup stored in a second, independent data center (maximum protection).", "Una copia de seguridad adicional almacenada en un segundo centro de datos independiente (protección máxima).")}
                            {simPlan === "avancado" && copy("Acesso direto via link telefônico aos engenheiros de infra da TAG08 (Tempo de reação < 15 min).", "Direct phone access to TAG08 infrastructure engineers (response time under 15 min).", "Acceso directo por teléfono al equipo de infraestructura de TAG08 (tiempo de respuesta inferior a 15 min).")}
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
                      <span className="tag08-meta text-xs text-brand uppercase tracking-widest block font-bold">{copy("FECHAMENTO CONSOLIDADO", "COST SUMMARY", "RESUMEN DE COSTOS")}</span>
                      <h3 className="font-display font-black text-white text-lg sm:text-xl tracking-tight">{copy("RESUMO DA INFRAESTRUTURA", "INFRASTRUCTURE SUMMARY", "RESUMEN DE INFRAESTRUCTURA")}</h3>
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
                        <div className="flex justify-between items-center text-xs pl-3 border-l border-white/5">
                          <span className="text-zinc-500">. {simSites - 1} {copy("Portal(is) Adicionais", "Additional website(s)", "Sitio(s) adicional(es)")}</span>
                          <span className="text-white font-medium">+ R$ {((simSites - 1) * 50).toFixed(2)}</span>
                        </div>
                      )}

                      {/* Storage line compute */}
                      {((simPlan === "basico" && simStorage > 5) || 
                        (simPlan === "intermediario" && simStorage > 15) || 
                        (simPlan === "avancado" && simStorage > 30)) && (
                        <div className="flex justify-between items-center text-xs pl-3 border-l border-white/5">
                          <span className="text-zinc-500">
                            . +{simStorage - (simPlan === "basico" ? 5 : simPlan === "intermediario" ? 15 : 30)} GB {copy("SSD extra", "additional SSD", "SSD adicionales")}
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
                        <div className="flex justify-between items-center text-xs pl-3 border-l border-white/5">
                          <span className="text-zinc-500">
                            . +{simEmails - (simPlan === "basico" ? 10 : 50)} {copy("Caixas de E-mail", "email accounts", "cuentas de correo")}
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
                        <div className="flex justify-between items-center text-xs pl-3 border-l border-brand/20 text-brand">
                          <span>
                            . {copy("Técnico:", "Technical:", "Técnico:")} {simPlan === "basico" ? copy("Auditoria e Suporte", "Audit and support", "Auditoría y soporte") : simPlan === "intermediario" ? copy("Backup Extra", "Extra backup", "Copia de seguridad adicional") : copy("Atendimento VIP", "VIP support", "Atención VIP")}
                          </span>
                          <span className="font-bold">
                            + R$ {simPlan === "basico" ? "15,00" : simPlan === "intermediario" ? "20,00" : "50,00"}
                          </span>
                        </div>
                      )}

                      <div className="pt-2 text-xs leading-relaxed text-zinc-550 font-sans border-t border-white/[0.04] mt-2">
                        {copy("✓ Integrado por Definição: Isolação cPanel/WHM, SSL Criptográfico Ilimitado, Mitigação Ativa de DDoS e Tráfego Mensal com Integridade.", "✓ Included by default: cPanel/WHM isolation, unlimited SSL encryption, active DDoS mitigation and monthly traffic allowance.", "✓ Incluido por defecto: aislamiento cPanel/WHM, cifrado SSL ilimitado, mitigación activa de DDoS y tráfico mensual.")}
                      </div>
                    </div>

                    {/* UX Upgrade: Real-Time Consultative Diagnosis Advisor */}
                    <div className="bg-[#121214]/60 border border-white/5 p-4 rounded-2xl space-y-2 transition-all">
                      <div className="flex items-center gap-1.5 font-sans text-xs text-brand font-black">
                        <Zap className="w-3.5 h-3.5 text-brand shrink-0 animate-pulse" />
                <span>{copy("DIAGNÓSTICO ESTRATÉGICO TAG08", "TAG08 STRATEGIC DIAGNOSIS", "DIAGNÓSTICO ESTRATÉGICO TAG08")}</span>
                      </div>
                      <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                        {simPlan === "basico" && simStorage <= 15 && copy("Gargalo técnico: baixo. Excelente relação custo-benefício para marcas novas que validam landing pages e sistemas básicos.", "Technical bottleneck: low. Excellent value for emerging brands validating landing pages and basic systems.", "Cuello de botella técnico: bajo. Excelente relación calidad-precio para marcas nuevas que validan páginas de aterrizaje y sistemas básicos.")}
                        {simPlan === "basico" && simStorage > 15 && copy("Atributo expandido: você ampliou o espaço em disco do plano básico. Se os portais começarem a crescer ou receber blogs com muitas fotos, migrar para o plano intermediário otimiza o ganho por GB extra.", "Expanded capacity: you increased the basic plan's storage. If your websites grow or add photo-heavy blogs, moving to the intermediate plan improves the value per extra GB.", "Capacidad ampliada: aumentaste el almacenamiento del plan básico. Si los sitios crecen o incorporan blogs con muchas fotos, pasar al plan intermedio mejora el valor por GB adicional.")}
                        {simPlan === "intermediario" && simSites <= 1 && copy("Diagnóstico Avançado: Configuração corporativa equilibrada. Sólido para portais comerciais que dependem de constância em SEO e carregamentos menores que 1.2 segundos.", "Advanced diagnosis: balanced corporate setup. Suited to commercial websites that depend on consistent SEO and loading times under 1.2 seconds.", "Diagnóstico avanzado: configuración corporativa equilibrada. Adecuada para sitios comerciales que dependen de un SEO constante y cargas inferiores a 1,2 segundos.")}
                        {simPlan === "intermediario" && simSites > 1 && copy("Aviso Multissite: Os recursos físicos serão distribuídos entre as marcas de forma equilibrada. Gerenciamento proativo com proteção centralizada.", "Multi-site notice: physical resources will be shared across brands. Proactive management with centralized protection.", "Aviso de varios sitios: los recursos físicos se distribuirán entre las marcas. Gestión proactiva con protección centralizada.")}
                        {simPlan === "avancado" && copy("Soberania Digital: Ideal para redes de lojas virtuais de alto tráfego com carrinhos simultâneos ou sistemas corporativos escaláveis de grande alcance.", "Digital sovereignty: ideal for networks of high-traffic online stores with concurrent carts or large-scale, scalable corporate systems.", "Soberanía digital: ideal para redes de tiendas online con mucho tráfico y carritos simultáneos, o sistemas corporativos escalables de gran alcance.")}
                      </p>
                    </div>

                    {/* Dynamic Cost Display Widget */}
                    <div className="bg-[#111113] border border-white/5 rounded-2xl p-5 space-y-1.5 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-inner">
                      <div className="absolute inset-0 bg-brand/[0.005] pointer-events-none" />
                      <span className="tag08-meta text-xs text-zinc-400 font-bold uppercase tracking-widest block">{copy("VALOR MENSAL TOTAL ESTIMADO", "ESTIMATED TOTAL MONTHLY PRICE", "PRECIO MENSUAL TOTAL ESTIMADO")}</span>
                      
                      <div className="flex items-baseline justify-center gap-1.5 pt-1">
                        <span className="font-sans text-white text-xs sm:text-sm font-bold">R$</span>
                        <motion.span 
                          key={simulatedPrice}
                          initial={{ opacity: 0, y: -4, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className="font-display font-black text-brand text-3.5xl sm:text-4.5xl tracking-tighter"
                        >
                          {simulatedPrice.toFixed(2)}
                        </motion.span>
                        <span className="tag08-meta text-zinc-500 text-xs uppercase tracking-wider">{copy("/mês", "/month", "/mes")}</span>
                      </div>
                      
                      <span className="text-xs text-zinc-550 font-sans block pt-1 leading-none">
                        {copy("Faturamento de recorrência mensal pós-ativação. Sem carência.", "Monthly recurring billing after activation. No waiting period.", "Facturación mensual recurrente después de la activación. Sin periodo de espera.")}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6">
                    <TrackedOutboundLink
                      href={buildBrazilWhatsAppUrl(simulatorMessage)}
                      target="_blank"
                      rel="noreferrer"
                      label={copy("Solicitar setup de hospedagem", "Request a hosting setup", "Solicitar configuración de alojamiento")}
                      surface="hosting-simulator"
                      onClick={() => trackHostingSimulator("cta_clicked")}
                      className="group/btn w-full py-4 rounded-xl bg-brand hover:bg-brand-secondary text-black font-sans text-xs font-black uppercase text-center block tracking-widest transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] shadow-[0_12px_40px_rgba(var(--color-brand-rgb),0.15)] focus:outline-none cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>{copy("SOLICITAR SETUP VIA WHATSAPP", "REQUEST SETUP VIA WHATSAPP", "SOLICITAR CONFIGURACIÓN POR WHATSAPP")}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </TrackedOutboundLink>
                    
                    <span className="text-xs text-zinc-550 block text-center pt-3 font-sans">
                      {copy("* Redireciona de forma criptografada para os consultores corporativos da TAG08.", "* Opens an encrypted WhatsApp conversation with TAG08's corporate consultants.", "* Abre una conversación cifrada de WhatsApp con los consultores corporativos de TAG08.")}
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
                <span className="tag08-meta text-xs text-brand bg-brand/10 border border-brand/15 px-2.5 py-0.5 rounded inline-block font-black uppercase tracking-widest">
                  {copy("O PACTO ANCESTRAL DA EXCELÊNCIA", "THE TAG08 QUALITY COMMITMENT", "EL COMPROMISO DE CALIDAD TAG08")}
                </span>
                <h3 className="font-display font-black text-2.5xl sm:text-3xl text-white leading-tight tracking-tight">
                  {copy("O COMPROMISSO DE QUALIDADE TAG08.", "THE TAG08 QUALITY COMMITMENT.", "EL COMPROMISO DE CALIDAD TAG08.")}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                  {copy("Tratamos o ecossistema digital corporativo do seu negócio com o respeito que um legado precioso merece. Nossas ações de engenharia são pautadas em compromisso indestrutável com sua receita líquida.", "We care for your business's digital ecosystem with respect for the work behind it. Our engineering approach is guided by a commitment to your business.", "Cuidamos del ecosistema digital de tu negocio con respeto por el trabajo que representa. Nuestro enfoque de ingeniería se guía por el compromiso con tu empresa.")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1">
                  <h4 className="text-white text-xs sm:text-sm font-display font-black flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-brand shrink-0" /> {copy("Monitoramento Integral", "Ongoing monitoring", "Monitoreo continuo")}
                  </h4>
                  <p className="text-zinc-400 text-xs font-sans">
                    {copy("Nossa equipe supervisiona as interfaces e tempos de carregamento para sanar qualquer anomalia.", "Our team reviews interfaces and loading times to identify potential issues.", "Nuestro equipo revisa las interfaces y los tiempos de carga para identificar posibles problemas.")}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1">
                  <h4 className="text-white text-xs sm:text-sm font-display font-black flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-brand shrink-0" /> {copy("Escudo Anti-DDoS", "Anti-DDoS protection", "Protección anti-DDoS")}
                  </h4>
                  <p className="text-zinc-400 text-xs font-sans">
                    {copy("Defesas configuradas diretamente nas bordas da rede para neutralizar picos e acessos mecanicos maliciosos.", "Network-edge defenses configured to help handle traffic spikes and malicious automated requests.", "Defensas configuradas en el borde de la red para ayudar a gestionar picos de tráfico y solicitudes automatizadas maliciosas.")}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1">
                  <h4 className="text-white text-xs sm:text-sm font-display font-black flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-brand shrink-0" /> {copy("Canais de Expansão", "Growth options", "Opciones de crecimiento")}
                  </h4>
                  <p className="text-zinc-400 text-xs font-sans">
                    {copy("Oferecemos registros rápidos de domínios nacionais/estrangeiros e integração integral de e-mails corporativos.", "We offer domain registration and business email integration.", "Ofrecemos registro de dominios e integración de correo corporativo.")}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1">
                  <h4 className="text-white text-xs sm:text-sm font-display font-black flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-brand shrink-0" /> {copy("Certificados Salidos", "Verified certifications", "Certificaciones verificadas")}
                  </h4>
                  <p className="text-zinc-400 text-xs font-sans">
                    {copy("Parcerias estratégicas que reforaam as frentes digitais de nossa frota corporativa nacional e global.", "Strategic partnerships that support our digital services in Brazil and abroad.", "Alianzas estratégicas que respaldan nuestros servicios digitales en Brasil y otros mercados.")}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 mt-4 flex items-center gap-4 text-xs text-zinc-500 font-sans">
              <span className="uppercase font-bold tracking-widest flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand" /> {copy("EXCELÊNCIA HOMOLOGADA E GARANTIDA", "QUALITY STANDARDS CONFIRMED", "ESTÁNDARES DE CALIDAD CONFIRMADOS")}
              </span>
            </div>
          </div>

          {/* Right Column: Escalabilidade & Alinhamento de Portfalio expandido */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-white/[0.01] border border-white/[0.04] p-8 sm:p-10 rounded-[36px]">
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="font-sans text-xs text-brand bg-brand/10 border border-brand/15 px-2.5 py-0.5 rounded inline-block font-black uppercase">
                  {copy("ECOSSISTEMA DE EXPANSÃO DIGITAL", "DIGITAL GROWTH ECOSYSTEM", "ECOSISTEMA DE CRECIMIENTO DIGITAL")}
                </span>
                <h3 className="font-display font-black text-2.5xl sm:text-3xl text-white leading-tight tracking-tight">
                  {copy("ESCALABILIDADE COMO UMA ÁRVORE SOBERANA.", "SCALABILITY LIKE A SOVEREIGN TREE.", "ESCALABILIDAD COMO UN ÁRBOL SOBERANO.")}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                  {copy("Assim como uma árvore robusta estende seus ramos de forma equilibrada conforme se nutre do solo fértil, o seu ecossistema digital cresce com flexibilidade sob a nossa tutela. À medida que as demandas de processamento se alteram, você flexibiliza planos de forma elástica, sem travas penosas.", "Your digital ecosystem can grow flexibly as processing needs change, with options to adjust plans over time.", "Tu ecosistema digital puede crecer con flexibilidad a medida que cambian las necesidades de procesamiento, con opciones para ajustar los planes con el tiempo.")}
                </p>
              </div>

              {/* Expansão e Universo Expandido */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#09090b]/50 border border-white/5 space-y-4">
                <span className="tag08-meta text-xs text-brand font-black uppercase tracking-widest block lider-none">
                  {copy("UNIVERSO CLÁSSICO EXPANDIDO TAG08", "THE BROADER TAG08 ECOSYSTEM", "EL ECOSISTEMA AMPLIADO DE TAG08")}
                </span>
                <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                  {copy("Para alam do hardware puro da hospedagem de sites corporativos, nossa agência conta com uma galaxia inteira de soluções integradas prontas para impulsionar a sua faturamento laquido:", "Beyond hosting infrastructure, our agency offers integrated services that can support your business's digital growth:", "Además de la infraestructura de alojamiento, nuestra agencia ofrece servicios integrados que pueden apoyar el crecimiento digital de tu negocio:")}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-display font-bold text-white uppercase">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                    <span>{copy("Registro do Domanio Ideal", "Ideal domain registration", "Registro de dominio ideal")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                    <span>{copy("Marketing de Ativação", "Activation marketing", "Marketing de activación")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                    <span>{copy("Criação de Identidade Visual", "Visual identity design", "Diseño de identidad visual")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                    <span>{copy("Auditoria de Conteado", "Content audit", "Auditoría de contenido")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.05] mt-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left justify-between">
              <p className="text-zinc-500 text-xs font-sans leading-tight">
                {copy("Seu site de ponta cresce sem gargalos técnicos e sem dores operacionais de cabeça. Cuidamos do motor técnico para você acelerar.", "Your advanced website can grow without technical bottlenecks or operational headaches. We take care of the technical engine so you can move faster.", "Tu sitio web puede crecer sin cuellos de botella técnicos ni dolores de cabeza operativos. Nos encargamos del motor técnico para que avances.")}
              </p>
              <TrackedOutboundLink
                label={copy("Conhecer planos", "Explore plans", "Ver planes")}
                surface="hospedagem-explanatory-cta"
                href={buildBrazilWhatsAppUrl(copy("Olá TAG08! Gostaria de saber mais sobre a hospedagem escalável.", "Hello TAG08! I would like to learn more about scalable hosting.", "Hola TAG08. Me gustaría saber más sobre el alojamiento escalable."))}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-white/5 border border-white/10 text-white hover:text-brand hover:border-brand/45 tag08-action text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 block text-center"
              >
                {copy("Conhecer planos", "Explore plans", "Ver planes")}
              </TrackedOutboundLink>
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
            <ResilientImage
              fallbackLabel={copy("Especialista em hospedagem TAG08", "TAG08 hosting specialist", "Especialista en alojamiento de TAG08")}
                sizes="(max-width: 1024px) 100vw, 42vw"
                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=800" 
                alt={copy("Especialista de hospedagem TAG08", "TAG08 hosting specialist", "Especialista en alojamiento de TAG08")}
                className="object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[15%] transition-all duration-500 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
                <div className="flex justify-between items-start">
                  <span className="tag08-meta text-xs text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                    {copy("ZELADORIA DE ELITE", "EXPERT MAINTENANCE", "MANTENIMIENTO ESPECIALIZADO")}
                  </span>
                  <span className="font-sans text-xs text-white/40 tracking-wider">
                    TAG08.v3
                  </span>
                </div>
                <div className="space-y-1.5 opacity-30 select-none">
                  <div className="font-display font-extrabold text-[1.8rem] text-white/40 tracking-widest leading-none uppercase select-none">
                    {copy("hosting_engine", "hosting_engine", "motor_alojamiento")}
                  </div>
                  <div className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                    {copy("secure_dns_routing_", "secure_dns_routing_", "enrutamiento_dns_seguro_")}
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <span className="font-sans text-xs text-white/40 tracking-wider">
                    {copy("UPTIME: 99.99%", "UPTIME: 99.99%", "DISPONIBILIDAD: 99,99%")}
                  </span>
                  <span className="tag08-meta text-xs text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                    {copy("ZELADORIA ATIVA", "ACTIVE MAINTENANCE", "MANTENIMIENTO ACTIVO")}
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
                  <span className="tag08-meta text-xs tracking-widest uppercase font-bold text-black/90">
                    {copy("CONFIRA NOSSO SISTEMA DE TRABALHO", "SEE HOW WE WORK", "CONOCE NUESTRA FORMA DE TRABAJAR")}
                  </span>
                </div>
                <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black leading-[0.9] tracking-tighter font-display">
                  {copy("HOSPEDAGEM", "HOSTING", "ALOJAMIENTO")} <br />
                  {copy("& SEGURANÇA IMEDIATA!", "& SECURITY, RIGHT AWAY!", "¡Y SEGURIDAD DESDE EL INICIO!")}
                </h2>
                <p className="text-black/85 text-xs sm:text-xs max-w-lg leading-relaxed font-sans font-extrabold uppercase">
                  {copy("ESTRUTURAMOS A HOSPEDAGEM DE ALTO RENDIMENTO DO SEU SITE E FAZEMOS ATUALIZAÇÕES CRÍTICAS CONTÍNUAS, GARANTINDO SERVIDORES SEGUROS, CACHING REFINADO E TRÁFEGO FLUIDO.", "WE SET UP HIGH-PERFORMANCE HOSTING FOR YOUR WEBSITE AND APPLY ONGOING CRITICAL UPDATES, WITH SECURE SERVERS, REFINED CACHING AND SMOOTH TRAFFIC FLOW.", "CONFIGURAMOS ALOJAMIENTO DE ALTO RENDIMIENTO PARA TU SITIO Y APLICAMOS ACTUALIZACIONES CRÍTICAS CONTINUAS, CON SERVIDORES SEGUROS, CACHÉ OPTIMIZADA Y TRÁFICO FLUIDO.")}
                </p>
              </div>

              <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 max-w-md relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex gap-4 items-start select-none">
                  <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black shrink-0 shadow-lg shadow-brand/10 hover:scale-105 transition-transform duration-200">
                    <Cpu className="w-5 h-5 stroke-[2.5] text-black" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="tag08-meta text-xs text-brand uppercase tracking-wider font-extrabold block">
                      {copy("INFRAESTRUTURA INTEGRAL", "COMPLETE INFRASTRUCTURE", "INFRAESTRUCTURA INTEGRAL")}
                    </span>
                    <p className="text-white text-xs leading-snug font-sans font-semibold">
                      {copy("Migre gratuitamente e livre-se de instabilidades que custam caro. Garantimos monitoramento contínuo de uptime e patches preventivos anti-malware.", "Migrate for free and reduce costly instability. We provide ongoing uptime monitoring and preventive anti-malware patches.", "Migra gratis y reduce las inestabilidades costosas. Ofrecemos monitoreo continuo de disponibilidad y parches preventivos contra malware.")}
                    </p>
                  </div>
                </div>

                {/* DUAL CLIENT CONNECTION CHANNELS (BR & INT) */}
                <div className="space-y-3">
                  <TrackedOutboundLink
                    label={copy("WhatsApp Brasil", "WhatsApp Brazil", "WhatsApp Brasil")}
                    surface="hospedagem-contact-card-br"
                    href={buildBrazilWhatsAppUrl(copy("Olá, gostaria de consultar plano de Hospedagem e Manutenção da TAG08", "Hello, I would like to ask about TAG08 hosting and maintenance plans.", "Hola. Quisiera consultar los planes de alojamiento y mantenimiento de TAG08."))}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-black transition-all duration-200">
                          <span className="text-xs font-sans font-black tracking-tight text-brand group-hover:text-black">BR</span>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="tag08-meta text-xs text-zinc-500 uppercase font-black tracking-wider leading-none">
                            {copy("PROPRIETÁRIO DIRETO (WhatsApp)", "DIRECT CONTACT (WhatsApp)", "CONTACTO DIRECTO (WhatsApp)")}
                          </span>
                          <span className="text-white text-xs font-sans font-bold tracking-wider group-hover:text-brand transition-colors mt-0.5">
                            +55 83 9.9886-8882
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-brand tag08-meta font-bold uppercase tracking-wider bg-brand/10 py-1 px-2.5 rounded-lg group-hover:bg-brand group-hover:text-black transition-all">
                        {copy("CONECTAR", "CONNECT", "CONECTAR")}
                      </span>
                    </div>
                  </TrackedOutboundLink>

                  <TrackedOutboundLink
                    label={copy("WhatsApp Internacional", "International WhatsApp", "WhatsApp internacional")}
                    surface="hospedagem-contact-card-int"
                    href={buildInternationalWhatsAppUrl(copy("Olá, gostaria de consultar os planos de hospedagem e manutenção da TAG08.", "Hello, I would like to ask about TAG08 hosting and maintenance plans.", "Hola, quisiera consultar los planes de alojamiento y mantenimiento de TAG08."))}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-all duration-300 group shadow-inner"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary shrink-0 group-hover:bg-brand-secondary group-hover:text-black transition-all duration-200">
                          <span className="text-xs font-sans font-black tracking-tight text-brand-secondary group-hover:text-black">INT</span>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="tag08-meta text-xs text-zinc-500 uppercase font-black tracking-wider leading-none">
                            {copy("CONTATO INTERNACIONAL DIRETO (WhatsApp)", "INTERNATIONAL DIRECT (WhatsApp)", "CONTACTO INTERNACIONAL DIRECTO (WhatsApp)")}
                          </span>
                          <span className="text-white text-xs font-sans font-bold tracking-wider group-hover:text-brand-secondary transition-colors mt-0.5">
                            +56 9 9793 7611
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-brand-secondary tag08-meta font-bold uppercase tracking-wider bg-brand-secondary/10 py-1 px-2.5 rounded-lg group-hover:bg-brand-secondary group-hover:text-black transition-all">
                        {copy("CONECTAR", "CONNECT", "CONECTAR")}
                      </span>
                    </div>
                  </TrackedOutboundLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-900/10 text-left">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="space-y-3 max-w-2xl">
              <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/15 px-2.5 py-1 rounded-md inline-block">
                {copy("PROVA DE MÉTODO", "OUR METHOD", "NUESTRO MÉTODO")}
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-tight tracking-tighter">
                {copy("Hospedagem e manutenção existem para sustentar a operação depois da publicação.", "Hosting and maintenance support operations after launch.", "El alojamiento y el mantenimiento respaldan la operación después del lanzamiento.")}
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans font-medium max-w-3xl">
                {copy("A TAG08 trata essa frente como continuidade operacional: rotina de revisão, monitoramento, atualizações, backup, segurança e suporte para que o site continue confiável quando o projeto já estiver no ar.", "TAG08 approaches this as operational continuity: regular reviews, monitoring, updates, backups, security and support to help keep your website reliable after launch.", "TAG08 aborda esta área como continuidad operativa: revisiones periódicas, monitoreo, actualizaciones, copias de seguridad y soporte para ayudar a mantener tu sitio confiable después del lanzamiento.")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-charcoal-900 border border-white/[0.06] rounded-3xl p-6 space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-display font-black text-sm tracking-tight">{copy("Rotina de manutenção", "Maintenance routine", "Rutina de mantenimiento")}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    {copy("Revisões periódicas para manter conteúdo, links, integrações e ajustes técnicos em ordem.", "Regular reviews to keep content, links, integrations and technical details in order.", "Revisiones periódicas para mantener en orden el contenido, los enlaces, las integraciones y los ajustes técnicos.")}
                  </p>
                </div>
              </div>

              <div className="bg-charcoal-900 border border-white/[0.06] rounded-3xl p-6 space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-display font-black text-sm tracking-tight">{copy("Monitoramento", "Monitoring", "Monitoreo")}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    {copy("Acompanhamento de estabilidade, disponibilidade e comportamento do site para identificar sinais de problema antes que virem interrupção.", "Tracking website stability, availability and behavior to identify signs of trouble before they become an outage.", "Seguimiento de la estabilidad, disponibilidad y comportamiento del sitio para identificar señales de problemas antes de que provoquen una interrupción.")}
                  </p>
                </div>
              </div>

              <div className="bg-charcoal-900 border border-white/[0.06] rounded-3xl p-6 space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-display font-black text-sm tracking-tight">{copy("Backup e segurança", "Backups and security", "Copias de seguridad y protección")}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    {copy("Cópias de segurança, revisão de acessos e cuidado preventivo para reduzir risco operacional e perda de informação.", "Backups, access reviews and preventive care to reduce operational risk and information loss.", "Copias de seguridad, revisión de accesos y medidas preventivas para reducir el riesgo operativo y la pérdida de información.")}
                  </p>
                </div>
              </div>

              <div className="bg-charcoal-900 border border-white/[0.06] rounded-3xl p-6 space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-display font-black text-sm tracking-tight">{copy("Suporte pós-publicação", "Post-launch support", "Soporte después del lanzamiento")}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    {copy("A operação segue acompanhada depois da entrega, com responsabilidade sobre ajustes e estabilidade do que já entrou no ar.", "We continue to support the operation after delivery, helping with adjustments and the stability of what is live.", "Seguimos acompañando la operación después de la entrega, con atención a los ajustes y la estabilidad de lo que ya está publicado.")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h3 className="text-white font-display font-black text-base sm:text-lg tracking-tight">
                  {copy("O site não termina no lançamento.", "A website's work does not end at launch.", "El trabajo de un sitio web no termina con su lanzamiento.")}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl">
                  {copy("Quando hospedagem e manutenção são tratadas como continuidade, a marca ganha menos improviso, mais previsibilidade e uma base mais confiável para evoluir.", "Treating hosting and maintenance as ongoing work reduces improvisation, improves predictability and gives the brand a more reliable foundation to grow.", "Tratar el alojamiento y el mantenimiento como un trabajo continuo reduce la improvisación, aporta previsibilidad y ofrece a la marca una base más confiable para crecer.")}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-2 text-xs tag08-meta uppercase tracking-widest text-brand">
                <Lock className="w-3.5 h-3.5" />
                {copy("Publicação acompanhada", "Supported launch", "Publicación acompañada")}
              </div>
            </div>
          </div>
        </section>

        <ServiceInsightsBridge
          servicePath="/hospedagem-manutencao-sites"
          onNavigate={onNavigate}
          locale={locale}
        />

        {/* SECTION 8 - FAQ */}
        <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[160px] pointer-events-none" />

          <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[40px] bg-charcoal-950 border border-white/[0.04] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
              <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
                    {copy("FAQ // ENCONTRE RESPOSTAS", "FAQ // FIND ANSWERS", "FAQ // ENCUENTRA RESPUESTAS")}
                  </div>
                  <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter">
                    {copy("DÚVIDAS &", "QUESTIONS &", "PREGUNTAS Y")} <br />
                    {copy("ZELADORIA", "MAINTENANCE", "MANTENIMIENTO")}
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-sans max-w-sm">
                    {copy("Esclareça as principais dúvidas sobre infraestrutura, servidores dedicados e otimização contínua de código.", "Find answers to common questions about infrastructure, dedicated servers and ongoing code optimization.", "Resuelve tus dudas sobre infraestructura, servidores dedicados y optimización continua del código.")}
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  {([
                    { id: 0, title: copy("MIGRAÇÃO DE SITES", "WEBSITE MIGRATION", "MIGRACIÓN DE SITIOS WEB") },
                    { id: 1, title: copy("segurança ATIVA", "ACTIVE SECURITY", "SEGURIDAD ACTIVA") },
                    { id: 2, title: copy("ZELADORIA E SUPORTE", "MAINTENANCE & SUPPORT", "MANTENIMIENTO Y SOPORTE") },
                    { id: 3, title: copy("DESEMPENHO DO PORTAL", "WEBSITE PERFORMANCE", "RENDIMIENTO DEL SITIO") }
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

              <div className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-white/[0.04] bg-[#0c0c0e]">
                <ResilientImage
                  fallbackLabel={copy("Hospedagem e manutenção TAG08", "TAG08 hosting and maintenance", "Alojamiento y mantenimiento TAG08")}
                  sizes="(max-width: 1024px) 100vw, 34vw"
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800"
                  alt={copy("TAG08 Hospedagem e Manutenção", "TAG08 hosting and maintenance", "Alojamiento y mantenimiento TAG08")}
                  className="object-cover grayscale brightness-[0.22] contrast-[1.1] transition-transform duration-700 pointer-events-none"
                />
                <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                    <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                    <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                  </svg>
                </div>
                <div className="absolute top-6 left-6 z-10 pointer-events-none tag08-meta text-xs text-white/20 uppercase tracking-widest leading-none">
                  {copy("SYS // CLOUD_HOST", "SYS // CLOUD_HOST", "SIS // HOST_EN_LA_NUBE")}
                </div>

                <div className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left">
                  <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black block">
                    {([
                      copy("MIGRAÇÃO DE SITES", "WEBSITE MIGRATION", "MIGRACIÓN DE SITIOS WEB"),
                      copy("segurança ATIVA", "ACTIVE SECURITY", "SEGURIDAD ACTIVA"),
                      copy("ZELADORIA E SUPORTE", "MAINTENANCE & SUPPORT", "MANTENIMIENTO Y SOPORTE"),
                      copy("DESEMPENHO DO PORTAL", "WEBSITE PERFORMANCE", "RENDIMIENTO DEL SITIO")
                    ])[activeFaq]}
                  </span>
                  
                  <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                    {([
                      copy("Posso migrar meu site ja existente para a hospedagem da TAG08?", "Can I migrate my existing website to TAG08 hosting?", "¿Puedo migrar mi sitio web actual al alojamiento de TAG08?"),
                      copy("Como a TAG08 garante a segurança inabalavel do meu site?", "How does TAG08 help protect my website?", "¿Cómo ayuda TAG08 a proteger mi sitio web?"),
                      copy("Preciso entender de tecnologia para gerenciar meu site?", "Do I need technical knowledge to manage my website?", "¿Necesito conocimientos técnicos para gestionar mi sitio web?"),
                      copy("A hospedagem e manutenção influenciam o desempenho do site?", "Do hosting and maintenance affect website performance?", "¿El alojamiento y el mantenimiento influyen en el rendimiento del sitio?")
                    ])[activeFaq]}
                  </h4>
                  
                  <p className="text-zinc-350 text-xs sm:text-xs leading-relaxed font-sans font-medium">
                    {([
                      copy("Sim, absolutamente! Fornecemos um serviço de migração expressa 100% integral e gratuito. Nossa equipe de especialistas técnicos cuida da transferência rigorosa do banco de dados, arquivos e chaves criptográficas para nossos servidores velozes, eliminando qualquer risco de indisponibilidade ou perda de faturamento durante o processo.", "Yes, absolutely! We provide a fully comprehensive, 100% free express migration service. Our technical specialists carefully transfer your database, files and cryptographic keys to our fast servers, eliminating any risk of downtime or lost revenue during the process.", "¡Sí, absolutamente! Ofrecemos un servicio de migración exprés integral, 100% gratuito. Nuestro equipo de especialistas técnicos transfiere cuidadosamente la base de datos, los archivos y las claves criptográficas a nuestros rápidos servidores, eliminando cualquier riesgo de indisponibilidad o pérdida de ingresos durante el proceso."),
                      copy("Operamos com um cinturão de segurança robusto que combina firewalls dinâmicos ativos na camada CDN, monitoramento ininterrupto de tráfego contra DDoS, varreduras heurísticas de vírus e invasões de arquivos, além de backups semanais geo-distribuídos automáticos.", "We operate a robust security shield combining active dynamic firewalls at the CDN layer, uninterrupted traffic monitoring against DDoS, heuristic scans for viruses and file intrusions, and automatic weekly geo-distributed backups.", "Operamos con un robusto escudo de seguridad que combina firewalls dinámicos activos en la capa CDN, monitoreo ininterrumpido del tráfico contra DDoS, análisis heurísticos de virus e intrusiones en archivos, además de copias de seguridad semanales distribuidas geográficamente de forma automática."),
                      copy("Absolutamente não! Esse é o grande diferencial do nosso compromisso de zeladoria digital contínua: cuidamos da burocracia técnica, atualizações de servidores, otimização de caching e blindagem cibernética para que você possa focar em vender.", "Absolutely not! That is the key difference in our commitment to ongoing digital maintenance: we handle the technical details, server updates, caching optimization and cyber protection so you can focus on selling.", "¡Absolutamente no! Esa es la gran diferencia de nuestro compromiso de mantenimiento digital continuo: nos ocupamos de los aspectos técnicos, las actualizaciones de servidores, la optimización de caché y la protección cibernética para que puedas enfocarte en vender."),
                      copy("Profundamente. Um servidor tecnicamente otimizado e atualizado entrega tempos de resposta inferiores a 0.5s, o que aumenta de forma orgânica as avaliações no ranking SEO do Google. Portais desatualizados ou sem cache tendem a sofrer gargalos de hardware crônicos.", "Significantly. A technically optimized and updated server delivers response times below 0.5 seconds, which organically improves Google SEO rankings. Outdated portals or those without caching tend to suffer chronic hardware bottlenecks.", "Mucho. Un servidor optimizado y actualizado técnicamente ofrece tiempos de respuesta inferiores a 0,5 s, lo que mejora orgánicamente las posiciones SEO en Google. Los portales desactualizados o sin caché tienden a sufrir cuellos de botella crónicos de hardware.")
                    ])[activeFaq]}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-3 flex flex-col justify-between gap-4">
                <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                  <div className="space-y-2">
                    <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest block font-bold">{copy("PROPOSTA DE VALOR", "OUR APPROACH", "NUESTRA PROPUESTA")}</span>
                    <h4 className="text-white font-semibold text-sm leading-snug">{copy("Como agimos de forma organizada?", "How do we work?", "¿Cómo trabajamos?")}</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                      {copy("Eliminamos lentidão excessiva e falhas técnicas crônicas. Garantimos máxima performance dos seus servidores.", "We eliminate excessive slowness and chronic technical failures. We guarantee maximum server performance.", "Eliminamos la lentitud excesiva y las fallas técnicas crónicas. Garantizamos el máximo rendimiento de tus servidores.")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleLinkClick("/servicos")}
                    className="group flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5"
                  >
                    <span>{copy("Ver Serviços", "View services", "Ver servicios")}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                <div className="bg-brand text-black rounded-2xl p-5 hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-4 flex-1">
                  <div className="space-y-2">
                    <span className="tag08-meta text-xs text-black/60 uppercase tracking-widest block font-extrabold">{copy("FALE COM O DIRETOR", "TALK TO A DIRECTOR", "HABLA CON UN DIRECTOR")}</span>
                    <h4 className="text-black font-black text-sm leading-tight tracking-tight">{copy("Quer desenhar uma estratégia sob medida?", "Would you like to shape a tailored strategy?", "¿Quieres diseñar una estrategia a tu medida?")}</h4>
                    <p className="text-black/85 text-xs font-semibold leading-relaxed font-sans">
                      {copy("Fale diretamente com os tomadores de decisão da TAG08 via WhatsApp para avaliar a viabilidade de alocação de equipe.", "Talk directly with TAG08 decision-makers on WhatsApp to discuss team allocation.", "Habla directamente con las personas responsables de las decisiones en TAG08 por WhatsApp para evaluar la asignación del equipo.")}
                    </p>
                  </div>
                  <TrackedOutboundLink
                    label={copy("Conversar agora", "Talk now", "Hablar ahora")}
                    surface="hospedagem-final-cta"
                    href={buildBrazilWhatsAppUrl(copy("Olá, gostaria de consultar a viabilidade de uma estratégia especializada para minha marca!", "Hello, I would like to discuss the feasibility of a tailored strategy for my brand.", "Hola, me gustaría consultar la viabilidad de una estrategia especializada para mi marca."))}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between text-xs font-sans font-black text-black select-none border-t border-black/10 pt-3 hover:translate-x-0.5 transition-all"
                  >
                    <span>{copy("Conversar Agora", "Talk now", "Hablar ahora")}</span>
                    <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
                  </TrackedOutboundLink>
                </div>
              </div>
            </div>
          </div>
        </section>



      </div>
    </div>
  );
}












