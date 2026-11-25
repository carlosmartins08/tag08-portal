import { Check, ArrowRight, ArrowUpRight, Award } from "../../../components/DooIcons";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { buildBrazilWhatsAppUrl } from "../../../config/siteNetwork";
import { getLocalizedPath, type RouteLocale } from "../../../config/routeRegistry";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import TrackedOutboundLink from "../../../components/TrackedOutboundLink";
interface ServicosProps {
    onNavigate: (page: string) => void;
    locale: RouteLocale;
}

const copyForLocale = (locale: RouteLocale, pt: string, en: string, es: string) =>
    locale === "pt" ? pt : locale === "en" ? en : es;

const MATRIX_COPY = {
    en: [
        { problem: "I need to start or organize a recurring digital presence.", solution: "When the offer exists, but content, frequency, editorial direction, and production still rely on improvisation.", label: "Recurring digital presence" },
        { problem: "My brand no longer represents the current stage of the business.", solution: "When identity, perception, messaging, or positioning needs to reflect a new stage, audience, or value proposition.", label: "Brand and positioning" },
        { problem: "I need to turn knowledge, presence, or events into video.", solution: "When filming, speaking, behind-the-scenes material, or raw footage needs direction and a format for digital communication.", label: "Audiovisual" },
        { problem: "My website or digital structure no longer supports the business.", solution: "When the company needs to organize its presentation, credibility, conversion, or validate a structure of its own for operating digitally.", label: "Technology" },
        { problem: "I need strategic direction to set priorities and next steps.", solution: "When positioning, channels, and planning need to match the business goals and its actual capacity.", label: "Strategic consulting / business" },
        { problem: "The operation depends too much on a few people or informal decisions.", solution: "Process Intelligence helps understand and organize workflows; Process Activation supports the guided adoption of defined practices.", label: "Processes / operations" },
        { problem: "My digital project needs continuity after publication.", solution: "Hosting and Maintenance is an adjacent technology-continuity offer within the Technology/Web service area.", label: "Technology continuity" },
        { problem: "I still do not know the main bottleneck.", solution: "When the problem spans several areas and it is not yet clear what should come first.", label: "Initial conversation" }
    ],
    es: [
        { problem: "Necesito iniciar u organizar una presencia digital recurrente.", solution: "Cuando existe una oferta, pero el contenido, la frecuencia, la línea editorial y la producción aún dependen de la improvisación.", label: "Presencia digital recurrente" },
        { problem: "Mi marca ya no representa el momento actual del negocio.", solution: "Cuando la identidad, percepción, mensaje o posicionamiento deben acompañar una nueva etapa, público o propuesta de valor.", label: "Marca y posicionamiento" },
        { problem: "Necesito convertir conocimiento, presencia o acontecimientos en video.", solution: "Cuando la captación, los testimonios, el detrás de cámaras o el material bruto necesitan dirección y formato para la comunicación digital.", label: "Audiovisual" },
        { problem: "Mi sitio o estructura digital ya no acompaña al negocio.", solution: "Cuando la empresa necesita organizar su presentación, credibilidad, conversión o validar una estructura propia para operar en digital.", label: "Tecnología" },
        { problem: "Necesito dirección estratégica para definir prioridades y próximos pasos.", solution: "Cuando el posicionamiento, los canales y la planificación deben responder a los objetivos y a la capacidad real del negocio.", label: "Asesoría estratégica / negocios" },
        { problem: "La operación depende demasiado de pocas personas o de decisiones informales.", solution: "Process Intelligence ayuda a entender y organizar el flujo; Process Activation acompaña la adopción de las prácticas definidas.", label: "Procesos / operación" },
        { problem: "Mi proyecto digital necesita continuidad después de publicarse.", solution: "Hospedaje y Mantenimiento es una oferta complementaria de continuidad tecnológica dentro del área Tecnología/Web.", label: "Continuidad tecnológica" },
        { problem: "Aún no sé cuál es el principal cuello de botella.", solution: "Cuando el problema aparece en varias áreas y todavía no está claro qué debe ir primero.", label: "Conversación inicial" }
    ]
} satisfies Record<Exclude<RouteLocale, "pt">, Array<{ problem: string; solution: string; label: string }>>;

const COMBINATION_COPY = {
    en: [
        { title: "Positioning + recurring presence", desc: "When a brand needs to organize its message and perception before sustaining a communication routine." },
        { title: "Identity + web", desc: "When visual expression and digital structure need to evolve coherently." },
        { title: "Audiovisual + recurring presence", desc: "When video should be part of an ongoing editorial line rather than a one-off production." }
    ],
    es: [
        { title: "Posicionamiento + presencia recurrente", desc: "Cuando la marca necesita organizar su mensaje y percepción antes de sostener una rutina de comunicación." },
        { title: "Identidad + web", desc: "Cuando la expresión visual y la estructura digital necesitan evolucionar con coherencia." },
        { title: "Audiovisual + presencia recurrente", desc: "Cuando el video debe formar parte de una línea editorial continua y no ser una producción aislada." }
    ]
} satisfies Record<Exclude<RouteLocale, "pt">, Array<{ title: string; desc: string }>>;

const WORK_COPY = {
    en: [
        { title: "Alignment", desc: "Understanding the context, objectives, constraints, and what needs to be prioritized." },
        { title: "Scope", desc: "Defining what will be delivered, what is outside the project, and the next steps." },
        { title: "Execution", desc: "Producing the agreed deliverables with follow-up, review, and clear communication." },
        { title: "Adjustments", desc: "Reviewing what needs to evolve so the work remains aligned with the brand's current stage." }
    ],
    es: [
        { title: "Alineación", desc: "Comprender el contexto, los objetivos, las restricciones y lo que debe priorizarse." },
        { title: "Alcance", desc: "Definir qué se entregará, qué queda fuera del proyecto y cuáles son los siguientes pasos." },
        { title: "Ejecución", desc: "Producir las entregas acordadas con seguimiento, revisión y comunicación clara." },
        { title: "Ajustes", desc: "Revisar qué debe evolucionar para mantener el trabajo acorde con el momento actual de la marca." }
    ]
} satisfies Record<Exclude<RouteLocale, "pt">, Array<{ title: string; desc: string }>>;

const FAQ_COPY = {
    en: [
        { title: "STARTING POINT", question: "Do I need to know which service to hire before speaking with TAG08?", answer: "No. The first step is to understand the business stage and its main bottleneck. TAG08 then considers which of its six service areas, or which coherent combination, best responds to the need." },
        { title: "SOLUTIONS", question: "Does TAG08 work with predefined packages?", answer: "Some solutions and products have a defined scope, but recommendations are not automatic. The business stage, maturity, investment capacity, and required client participation all influence the recommendation." },
        { title: "COMBINATIONS", question: "Can I hire just one solution?", answer: "Yes. When one service area addresses the identified problem, there is no reason to expand scope. Combinations make sense only when the diagnosis shows dependencies between needs." },
        { title: "PROCESS", question: "Why does diagnosis come before a proposal?", answer: "Because the initial request does not always match the actual problem. Diagnosis reduces the risk of an incorrect scope, misaligned expectations, and investment outside the current priorities." },
        { title: "RESULTS", question: "Does TAG08 guarantee results?", answer: "No. TAG08 works with method, direction, and responsible execution. Commercial results also depend on the offer, market, service, operations, investment, and other factors outside any one company's control." }
    ],
    es: [
        { title: "PUNTO DE PARTIDA", question: "¿Necesito saber qué servicio contratar antes de hablar con TAG08?", answer: "No. El primer paso es comprender el momento del negocio y su principal obstáculo. Después, TAG08 evalúa cuál de sus seis áreas, o qué combinación coherente, responde mejor a la necesidad." },
        { title: "SOLUCIONES", question: "¿TAG08 trabaja con paquetes predefinidos?", answer: "Algunas soluciones y productos tienen un alcance definido, pero la recomendación no es automática. El momento del negocio, su madurez, capacidad de inversión y participación necesaria del cliente influyen en la indicación." },
        { title: "COMBINACIÓN", question: "¿Puedo contratar una sola solución?", answer: "Sí. Si un área resuelve el problema identificado, no hay motivo para ampliar el alcance. Las combinaciones tienen sentido solo cuando el diagnóstico muestra dependencias entre distintas necesidades." },
        { title: "PROCESO", question: "¿Por qué el diagnóstico va antes de la propuesta?", answer: "Porque la solicitud inicial no siempre corresponde al problema real. El diagnóstico reduce el riesgo de definir un alcance incorrecto, crear expectativas desalineadas o invertir fuera de las prioridades actuales." },
        { title: "RESULTADOS", question: "¿TAG08 garantiza resultados?", answer: "No. TAG08 trabaja con método, dirección y ejecución responsable. Los resultados comerciales también dependen de la oferta, el mercado, la atención, la operación, la inversión y otros factores que no controla una sola empresa." }
    ]
} satisfies Record<Exclude<RouteLocale, "pt">, Array<{ title: string; question: string; answer: string }>>;

export default function Servicos({ onNavigate, locale }: ServicosProps) {
    const [activeFaq, setActiveFaq] = useState(0);
    const prefersReducedMotion = useReducedMotion() ?? false;
    const handleLinkClick = (page: string) => {
        onNavigate(page);
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    };
    const SERVICE_DOMAINS = [
        {
            num: "01",
            title: "Gestão de Redes Sociais / Presença Digital",
            tags: ["Start", "Base", "Performance", "Consistência"],
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
            subservices: [
                { name: "Plano Start", desc: "Estrutura de entrada para quem precisa começar com direção e participa mais ativamente da execução." },
                { name: "Plano Base", desc: "Planejamento e produção mensal para negócios ativos que precisam de consistência." },
                { name: "Plano Performance", desc: "Operação recorrente mais integrada para marcas que precisam de maior profundidade em conteúdo, vídeo, publicação e acompanhamento." }
            ],
            description: "Para profissionais e negócios que precisam organizar uma rotina de comunicação compatível com seu momento, sua maturidade e sua capacidade de participação.",
            ctaLabel: "CONHECER PRESENÇA DIGITAL",
            ctaPage: "/servicos/gestao-de-redes-sociais",
            secondaryCta: null
        },
        {
            num: "02",
            title: "Branding / Posicionamento",
            tags: ["Identidade", "Reposicionamento", "Percepção", "Coerência"],
            image: "https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&q=80&w=1200",
            subservices: [
                { name: "Identidade Visual Digital", desc: "Sistema visual para organizar a expressão da marca nos canais digitais." },
                { name: "Reposicionamento Estratégico", desc: "Leitura e redefinição de percepção, público, proposta de valor, narrativa e direção quando o problema vai além da estética." },
                { name: "Clareza de aplicação", desc: "Definição de critérios para que a direção construída consiga ser aplicada com consistência." }
            ],
            description: "Para marcas cuja expressão visual ou posicionamento já não representam adequadamente o valor, o público ou a fase atual do negócio.",
            ctaLabel: "CONHECER MARCA E POSICIONAMENTO",
            ctaPage: "/servicos/branding-identidade",
            secondaryCta: null
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
            ctaPage: "/servicos/producao-audiovisual",
            secondaryCta: null
        },
        {
            num: "04",
            title: "Tecnologia",
            tags: ["Websites", "E-commerce", "Soluções digitais", "Continuidade"],
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200",
            subservices: [
                { name: "Desenvolvimento Web Estratégico", desc: "Sites e páginas construídos a partir de objetivo, público, conteúdo, jornada e função." },
                { name: "Landing pages", desc: "Estruturas específicas para campanhas, ofertas ou objetivos definidos." },
                { name: "Unidade Digital e E-commerce", desc: "Diagnóstico e modelagem da operação antes do desenvolvimento quando a empresa pretende vender online." },
                { name: "Prontidão operacional", desc: "Catálogo, estoque, logística, atendimento, políticas e responsabilidades precisam ser suficientemente claros antes da tecnologia." },
                { name: "Hospedagem e Manutenção", desc: "Continuidade tecnológica adjacente à família Tecnologia/Web após a publicação." }
            ],
            description: "Para organizações que precisam estruturar websites, e-commerce ou soluções digitais específicas. O caminho considera prontidão operacional antes do desenvolvimento.",
            ctaLabel: "CONHECER TECNOLOGIA",
            ctaPage: "/servicos/desenvolvimento-web",
            secondaryCta: { label: "CONTINUIDADE WEB", page: "/hospedagem-manutencao-sites" }
        },
        {
            num: "05",
            title: "Assessoria Estratégica / Negócios",
            tags: ["Direção", "Prioridades", "Canais", "Planejamento"],
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
            subservices: [
                { name: "Direção estratégica", desc: "Organização de prioridades e escolhas para o momento do negócio." },
                { name: "Posicionamento e canais", desc: "Clareza sobre percepção, comunicação e papel dos canais sem substituir Branding ou execução de mídia." },
                { name: "Planejamento", desc: "Definição de próximos passos coerentes com objetivos e capacidade de execução." }
            ],
            description: "Para empresas que precisam de direção estratégica para organizar prioridades, posicionamento, canais e planejamento antes de ampliar a execução.",
            ctaLabel: "CONHECER ASSESSORIA ESTRATÉGICA",
            ctaPage: "/servicos/assessoria-marketing-digital-estrategico",
            secondaryCta: null
        },
        {
            num: "06",
            title: "Processos / Operação",
            tags: ["Process Intelligence", "Process Activation", "Rotina", "Previsibilidade"],
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
            subservices: [
                { name: "Process Intelligence", desc: "Diagnóstico e organização de fluxos, responsabilidades e conhecimento operacional." },
                { name: "Process Activation", desc: "Ativação acompanhada de processos e práticas já definidos para a operação." }
            ],
            description: "Para empresas em que crescimento, demandas ou conhecimento dependem demais de poucas pessoas, memória ou decisões informais.",
            ctaLabel: "CONHECER PROCESS INTELLIGENCE",
            ctaPage: "/servicos/process-intelligence",
            secondaryCta: { label: "CONHECER PROCESS ACTIVATION", page: "/servicos/process-activation" }
        }
    ];
    const localizedDomains: Array<Partial<(typeof SERVICE_DOMAINS)[number]> & { secondaryLabel?: string }> = locale === "pt" ? SERVICE_DOMAINS : (locale === "en" ? [
        { title: "Social Media Management / Digital Presence", tags: ["Start", "Base", "Performance", "Consistency"], description: "For professionals and businesses that need a communication routine suited to their stage, maturity, and ability to participate.", ctaLabel: "EXPLORE DIGITAL PRESENCE", subservices: [
            { name: "Start Plan", desc: "An entry structure for businesses that need direction and want to take a more active role in execution." },
            { name: "Base Plan", desc: "Monthly planning and production for active businesses that need consistency." },
            { name: "Performance Plan", desc: "A more integrated recurring operation for brands that need greater depth across content, video, publishing, and follow-up." }
        ] },
        { title: "Branding / Positioning", tags: ["Identity", "Repositioning", "Perception", "Consistency"], description: "For brands whose visual expression or positioning no longer represents the value, audience, or current stage of the business.", ctaLabel: "EXPLORE BRANDING AND POSITIONING", subservices: [
            { name: "Digital Visual Identity", desc: "A visual system to organize how the brand expresses itself across digital channels." },
            { name: "Strategic Repositioning", desc: "A review and definition of perception, audience, value proposition, narrative, and direction when the issue goes beyond aesthetics." },
            { name: "Application Clarity", desc: "Criteria that help the chosen direction be applied consistently." }
        ] },
        { title: "Audiovisual Production", tags: ["Capture", "Reels", "Direction", "Content"], description: "For companies, specialists, and projects that need to turn knowledge, presence, environments, or raw footage into audiovisual communication with a clear purpose.", ctaLabel: "EXPLORE AUDIOVISUAL PRODUCTION", subservices: [
            { name: "Professional Audiovisual Production", desc: "Planning and production of images and spoken content with direction suited to its intended use." },
            { name: "Reels Editing", desc: "Turning raw footage into short content suited to the editorial line and channel." },
            { name: "Content for Specialists", desc: "Audiovisual structure for talks, interviews, classes, behind-the-scenes content, or recurring communication." }
        ] },
        { title: "Technology", tags: ["Websites", "E-commerce", "Digital solutions", "Continuity"], description: "For organizations that need websites, e-commerce, or specific digital solutions. The path considers operational readiness before development.", ctaLabel: "EXPLORE TECHNOLOGY", secondaryLabel: "HOSTING AND MAINTENANCE", subservices: [
            { name: "Strategic Web Development", desc: "Websites and pages shaped by their goal, audience, content, journey, and function." },
            { name: "Landing Pages", desc: "Focused structures for defined campaigns, offers, or objectives." },
            { name: "Digital Business and E-commerce", desc: "Operational diagnosis and modeling before development when a company plans to sell online." },
            { name: "Operational Readiness", desc: "Catalog, inventory, logistics, service, policies, and responsibilities need enough clarity before technology is implemented." },
            { name: "Hosting and Maintenance", desc: "Technology continuity alongside the Technology/Web service area after publication." }
        ] },
        { title: "Strategic Consulting / Business", tags: ["Direction", "Priorities", "Channels", "Planning"], description: "For businesses that need strategic direction to organize priorities, positioning, channels, and planning before expanding execution.", ctaLabel: "EXPLORE STRATEGIC CONSULTING", subservices: [
            { name: "Strategic Direction", desc: "Organizing priorities and choices for the current stage of the business." },
            { name: "Positioning and Channels", desc: "Clarity on perception, communication, and channel roles without replacing Branding or media execution." },
            { name: "Planning", desc: "Defining next steps that fit the objectives and the ability to execute." }
        ] },
        { title: "Processes / Operations", tags: ["Process Intelligence", "Process Activation", "Routine", "Predictability"], description: "For businesses where growth, demand, or operational knowledge depend too heavily on a few people, memory, or informal decisions.", ctaLabel: "EXPLORE PROCESS INTELLIGENCE", secondaryLabel: "EXPLORE PROCESS ACTIVATION", subservices: [
            { name: "Process Intelligence", desc: "Diagnosis and organization of workflows, responsibilities, and operational knowledge." },
            { name: "Process Activation", desc: "Guided activation of processes and practices already defined for the operation." }
        ] }
    ] : [
        { title: "Gestión de Redes Sociales / Presencia Digital", tags: ["Start", "Base", "Rendimiento", "Constancia"], description: "Para profesionales y negocios que necesitan una rutina de comunicación acorde con su etapa, madurez y capacidad de participación.", ctaLabel: "CONOCER PRESENCIA DIGITAL", subservices: [
            { name: "Plan Start", desc: "Estructura de entrada para quienes necesitan dirección y participan más activamente en la ejecución." },
            { name: "Plan Base", desc: "Planificación y producción mensual para negocios activos que necesitan constancia." },
            { name: "Plan Performance", desc: "Operación recurrente más integrada para marcas que necesitan mayor profundidad en contenido, video, publicación y seguimiento." }
        ] },
        { title: "Branding / Posicionamiento", tags: ["Identidad", "Reposicionamiento", "Percepción", "Coherencia"], description: "Para marcas cuya expresión visual o posicionamiento ya no representan adecuadamente el valor, el público o la etapa actual del negocio.", ctaLabel: "CONOCER BRANDING Y POSICIONAMIENTO", subservices: [
            { name: "Identidad Visual Digital", desc: "Sistema visual para organizar la expresión de la marca en los canales digitales." },
            { name: "Reposicionamiento Estratégico", desc: "Lectura y definición de percepción, público, propuesta de valor, narrativa y dirección cuando el problema va más allá de la estética." },
            { name: "Claridad de aplicación", desc: "Criterios para aplicar con coherencia la dirección definida." }
        ] },
        { title: "Producción Audiovisual", tags: ["Captación", "Reels", "Dirección", "Contenido"], description: "Para empresas, especialistas y proyectos que necesitan convertir conocimiento, presencia, entorno o material bruto en comunicación audiovisual con una función definida.", ctaLabel: "CONOCER PRODUCCIÓN AUDIOVISUAL", subservices: [
            { name: "Producción Audiovisual Profesional", desc: "Planificación y producción de imágenes y testimonios con dirección acorde al uso previsto." },
            { name: "Edición de Reels", desc: "Transformación de material bruto en contenido breve adecuado a la línea editorial y al canal." },
            { name: "Contenido para especialistas", desc: "Estructura audiovisual para charlas, entrevistas, clases, detrás de cámaras o contenido recurrente." }
        ] },
        { title: "Tecnología", tags: ["Sitios web", "Comercio electrónico", "Soluciones digitales", "Continuidad"], description: "Para organizaciones que necesitan sitios web, comercio electrónico o soluciones digitales específicas. El camino considera la preparación operativa antes del desarrollo.", ctaLabel: "CONOCER TECNOLOGÍA", secondaryLabel: "HOSPEDAJE Y MANTENIMIENTO", subservices: [
            { name: "Desarrollo Web Estratégico", desc: "Sitios y páginas definidos a partir del objetivo, público, contenido, recorrido y función." },
            { name: "Landing pages", desc: "Estructuras específicas para campañas, ofertas u objetivos definidos." },
            { name: "Negocio Digital y Comercio Electrónico", desc: "Diagnóstico y modelado de la operación antes del desarrollo cuando la empresa planea vender en línea." },
            { name: "Preparación operativa", desc: "Catálogo, inventario, logística, atención, políticas y responsabilidades deben estar suficientemente claros antes de implementar tecnología." },
            { name: "Hospedaje y Mantenimiento", desc: "Continuidad tecnológica complementaria al área Tecnología/Web después de la publicación." }
        ] },
        { title: "Asesoría Estratégica / Negocios", tags: ["Dirección", "Prioridades", "Canales", "Planificación"], description: "Para empresas que necesitan dirección estratégica para organizar prioridades, posicionamiento, canales y planificación antes de ampliar la ejecución.", ctaLabel: "CONOCER ASESORÍA ESTRATÉGICA", subservices: [
            { name: "Dirección estratégica", desc: "Organización de prioridades y decisiones para el momento del negocio." },
            { name: "Posicionamiento y canales", desc: "Claridad sobre percepción, comunicación y función de los canales, sin reemplazar Branding ni la ejecución de medios." },
            { name: "Planificación", desc: "Definición de próximos pasos coherentes con los objetivos y la capacidad de ejecución." }
        ] },
        { title: "Procesos / Operación", tags: ["Process Intelligence", "Process Activation", "Rutina", "Previsibilidad"], description: "Para empresas donde el crecimiento, la demanda o el conocimiento operativo dependen demasiado de pocas personas, de la memoria o de decisiones informales.", ctaLabel: "CONOCER PROCESS INTELLIGENCE", secondaryLabel: "CONOCER PROCESS ACTIVATION", subservices: [
            { name: "Process Intelligence", desc: "Diagnóstico y organización de flujos, responsabilidades y conocimiento operativo." },
            { name: "Process Activation", desc: "Activación acompañada de procesos y prácticas ya definidos para la operación." }
        ] }
    ]);
    const displayDomains = SERVICE_DOMAINS.map((domain, index) => {
        if (locale === "pt") return domain;
        const translated = localizedDomains[index];
        return { ...domain, ...translated, secondaryCta: domain.secondaryCta ? { ...domain.secondaryCta, label: translated.secondaryLabel ?? domain.secondaryCta.label } : null };
    });
    return (<div className="flex flex-col bg-charcoal-950 text-white min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Absolute Ambient Background Lights resembling our modern portfolio pages */}
      <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none"/>
      <div className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] bg-brand-secondary/[0.01] rounded-full blur-[180px] pointer-events-none"/>
      <div className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] bg-brand/[0.01] rounded-full blur-[200px] pointer-events-none"/>

      {/* Futuristic Floating 3D Graphic Canvas */}
      <Subtle3DCanvas intensity={1.6} className="absolute right-[-12%] top-[3%] w-[520px] h-[520px] opacity-[0.35] mix-blend-screen hidden lg:block pointer-events-none"/>

      {/*=========================================
            HERO SECTION: THE GOLD STANDARD HEADER
           =========================================*/}
      <section className="px-4 sm:px-6 md:px-8 py-12 md:py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
                {copyForLocale(locale, "Serviços TAG08", "TAG08 Services", "Servicios TAG08")}
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter">
                {copyForLocale(locale, "Soluções para organizar presença, posicionamento e crescimento com direção.", "Solutions to organize your presence, positioning, and growth with direction.", "Soluciones para organizar presencia, posicionamiento y crecimiento con dirección.")}
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
                {copyForLocale(locale, "A TAG08 atua em seis famílias: Gestão de Redes Sociais / Presença Digital, Produção Audiovisual, Tecnologia, Assessoria Estratégica / Negócios, Branding / Posicionamento e Processos / Operação. SEO, tráfego, copywriting e performance são capacidades aplicadas quando adequadas à necessidade.", "TAG08 works across six service areas: Social Media Management / Digital Presence, Audiovisual Production, Technology, Strategic Business Consulting, Branding / Positioning, and Processes / Operations. SEO, paid media, copywriting, and performance are capabilities applied when they fit the need.", "TAG08 trabaja en seis áreas: Gestión de Redes Sociales / Presencia Digital, Producción Audiovisual, Tecnología, Asesoría Estratégica / Negocios, Branding / Posicionamiento y Procesos / Operación. SEO, medios pagados, copywriting y rendimiento son capacidades que se aplican cuando responden a la necesidad.")}
              </p>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                {copyForLocale(locale, "Antes de indicar uma solução, a TAG08 procura entender o momento atual, o que está travando o avanço e qual estrutura consegue sustentar o próximo passo.", "Before recommending a solution, TAG08 seeks to understand the current situation, what is holding progress back, and which structure can support the next step.", "Antes de recomendar una solución, TAG08 busca entender la situación actual, qué está frenando el avance y qué estructura puede sostener el siguiente paso.")}
              </p>

              {/* Grid tags of our core expertise */}
              <div className="flex flex-wrap gap-2 pt-2">
                {(locale === "pt" ? ["Redes Sociais / Presença", "Produção Audiovisual", "Tecnologia", "Assessoria Estratégica", "Branding / Posicionamento", "Processos / Operação"] : locale === "en" ? ["Social Media / Presence", "Audiovisual Production", "Technology", "Strategic Consulting", "Branding / Positioning", "Processes / Operations"] : ["Redes Sociales / Presencia", "Producción Audiovisual", "Tecnología", "Asesoría Estratégica", "Branding / Posicionamiento", "Procesos / Operación"]).map((tag, idx) => (<span key={idx} className="tag08-meta text-xs tracking-wider uppercase px-3 py-1.5 border border-white/5 rounded-full bg-white/[0.02] text-zinc-300 hover:border-brand/40 hover:text-brand transition-colors cursor-default">
                    {tag}
                  </span>))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button onClick={() => handleLinkClick("/contato")} className="inline-flex min-h-11 items-center justify-center gap-2 bg-brand text-black hover:bg-brand-dark tag08-meta font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-colors duration-200">
                  {copyForLocale(locale, "QUERO ENTENDER MEU MELHOR CAMINHO", "FIND THE RIGHT PATH FOR MY BUSINESS", "QUIERO ENTENDER EL MEJOR CAMINO PARA MI NEGOCIO")}
                  <ArrowUpRight className="w-3.5 h-3.5"/>
                </button>
                <button onClick={() => {
            const target = document.getElementById("servicos-principais");
            if (target) {
                target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
                return;
            }
            handleLinkClick("/servicos");
        }} className="inline-flex min-h-11 items-center justify-center gap-2 bg-white/[0.02] border border-white/10 text-white hover:bg-white/[0.08] tag08-meta font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-colors duration-200">
                  {copyForLocale(locale, "VER SOLUÇÕES", "EXPLORE SOLUTIONS", "VER SOLUCIONES")}
                  <ArrowRight className="w-3.5 h-3.5"/>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 w-full">
              <ThreeDimensionalTilt>
                <div className="relative rounded-3xl overflow-hidden bg-charcoal-900 border border-white/[0.08] p-6 sm:p-8 shadow-2xl text-left space-y-6">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand/[0.02] via-transparent to-transparent pointer-events-none"/>
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"/>

                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand animate-pulse"/>
                      <span className="tag08-meta text-xs uppercase tracking-widest text-brand-secondary">{copyForLocale(locale, "MAPA DE SOLUÇÕES", "SOLUTION MAP", "MAPA DE SOLUCIONES")}</span>
                    </div>
                    <span className="font-sans text-xs text-zinc-300">{copyForLocale(locale, "SEIS FAMÍLIAS", "SIX SERVICE AREAS", "SEIS ÁREAS")}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                    {displayDomains.map((domain) => (<div key={domain.num} className="border-t border-white/[0.04] pt-3">
                        <span className="tag08-meta text-xs text-zinc-300 tracking-widest">{domain.title}</span>
                        <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{domain.description}</p>
                      </div>))}
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0">
                      <Award className="w-4.5 h-4.5"/>
                    </div>
                    <div>
                      <p className="tag08-meta text-xs font-bold text-white tracking-wider leading-none">{copyForLocale(locale, "Diagnóstico", "Diagnosis", "Diagnóstico")}</p>
                      <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{copyForLocale(locale, "O ponto de partida depende do problema real, não do serviço pedido inicialmente.", "The starting point depends on the actual problem, not on the service initially requested.", "El punto de partida depende del problema real, no del servicio solicitado inicialmente.")}</p>
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
      <section className="order-2 px-4 sm:px-6 md:px-8 py-14 sm:py-20 bg-charcoal-950 text-left relative z-10 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl">
            <div className="space-y-3">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
                {copyForLocale(locale, "Diagnóstico por necessidade", "Diagnosis by need", "Diagnóstico según la necesidad")}
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tighter">
                {copyForLocale(locale, "O que sua marca precisa organizar agora?", "What does your brand need to organize now?", "¿Qué necesita organizar ahora tu marca?")}
              </h2>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm md:pb-1">
              {copyForLocale(locale, "Nem todo negócio precisa começar pelo mesmo caminho. A matriz liga sinais de necessidade a uma família ou oferta adjacente, sem transformar capacidades em novas frentes.", "Not every business needs to start in the same place. This matrix connects signs of need to a service area or adjacent offer without turning capabilities into separate service lines.", "No todos los negocios necesitan empezar por el mismo camino. La matriz conecta señales de necesidad con un área de servicio u oferta complementaria, sin convertir capacidades en nuevas líneas.")}
            </p>
          </div>

          <div className="border border-white/[0.06] rounded-3xl overflow-hidden divide-y divide-white/[0.05] bg-charcoal-900/30 relative drop-shadow-2xl">
            <div className="absolute inset-0 bg-black/10" aria-hidden="true"/>
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none"/>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 tag08-meta text-xs text-zinc-300 uppercase tracking-widest bg-charcoal-900/60 font-semibold relative z-10 select-none">
              <div className="md:col-span-6">{copyForLocale(locale, "SINAL DE NECESSIDADE", "SIGN OF NEED", "SEÑAL DE NECESIDAD")}</div>
              <div className="md:col-span-4">{copyForLocale(locale, "PONTO DE PARTIDA TAG08", "TAG08 STARTING POINT", "PUNTO DE PARTIDA TAG08")}</div>
              <div className="md:col-span-2 text-right hidden md:block">{copyForLocale(locale, "CAMINHO", "PATH", "CAMINO")}</div>
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
                label: "Tecnologia"
            },
            {
                problem: "Preciso de direção estratégica para decidir prioridades e próximos passos.",
                solution: "Quando posicionamento, canais e planejamento precisam responder aos objetivos e à capacidade real do negócio.",
                slug: "/servicos/assessoria-marketing-digital-estrategico",
                label: "Assessoria Estratégica / Negócios"
            },
            {
                problem: "A operação depende demais de poucas pessoas ou de decisões informais.",
                solution: "Process Intelligence ajuda a entender e organizar o fluxo; Process Activation atua na ativação acompanhada das práticas definidas.",
                slug: "/servicos/process-intelligence",
                label: "Processos / Operação"
            },
            {
                problem: "Meu projeto digital precisa de continuidade depois da publicação.",
                solution: "Hospedagem e Manutenção são uma oferta adjacente de continuidade tecnológica, dentro do ecossistema Tecnologia/Web.",
                slug: "/hospedagem-manutencao-sites",
                label: "Continuidade tecnológica"
            },
            {
                problem: "Ainda não sei qual é o principal gargalo.",
                solution: "Quando o problema aparece em várias frentes e ainda não está claro o que precisa vir primeiro.",
                slug: "/contato",
                label: "Conversa inicial"
            }
        ].map((item, idx) => (<div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 sm:p-7 items-center hover:bg-white/[0.015] transition-colors duration-200 relative z-10 group">
                <div className="md:col-span-6 flex gap-4 items-start">
                  <span className="font-sans text-xs text-zinc-300 mt-1 font-bold" aria-hidden="true">[{idx + 1}]</span>
                  <div className="space-y-2">
                    <p className="text-zinc-100 text-xs sm:text-sm font-sans font-semibold leading-relaxed group-hover:text-white transition-colors">
                      {locale === "pt" ? item.problem : MATRIX_COPY[locale][idx].problem}
                    </p>
                    <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed group-hover:text-zinc-300 transition-colors max-w-xl">
                      {locale === "pt" ? item.solution : MATRIX_COPY[locale][idx].solution}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-4">
                  <span className="inline-flex px-3 py-1.5 rounded-xl bg-brand/5 border border-brand/10 text-brand text-xs tag08-meta font-bold uppercase tracking-tight group-hover:bg-brand group-hover:text-black transition-colors duration-200">
                    {locale === "pt" ? item.label : MATRIX_COPY[locale][idx].label}
                  </span>
                </div>

                <div className="md:col-span-2 md:text-right">
                    <button onClick={() => handleLinkClick(item.slug)} className="min-h-11 text-white hover:text-brand-secondary font-sans text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5 group/btn transition-colors duration-200 cursor-pointer">
                    {copyForLocale(locale, "VER CAMINHO", "EXPLORE THIS PATH", "VER ESTE CAMINO")} <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform text-brand-secondary"/>
                  </button>
                </div>
              </div>))}
          </div>
        </div>
      </section>

      {/*==========================================================
            THE HEROIC LIST: "DISCOVER OUR DIGITAL SOLUTIONS" (01 to 05)
           ==========================================================*/}
      <section id="servicos-principais" className="order-1 px-4 sm:px-6 md:px-8 py-14 sm:py-20 relative z-10 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-semibold bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              {copyForLocale(locale, "Mapa de soluções", "Solution map", "Mapa de soluciones")}
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tighter leading-none">
              {copyForLocale(locale, "Escolha o caminho pelo momento da sua marca.", "Choose a path that fits your brand's current stage.", "Elige un camino acorde con el momento actual de tu marca.")}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
              {copyForLocale(locale, "Cada solução da TAG08 responde a um tipo de necessidade: clareza estratégica, presença digital, identidade, conteúdo, audiovisual, tecnologia ou processos. O melhor caminho depende do diagnóstico.", "Each TAG08 solution addresses a type of need: strategic clarity, digital presence, identity, content, audiovisual production, technology, or processes. The right path depends on the diagnosis.", "Cada solución de TAG08 responde a un tipo de necesidad: claridad estratégica, presencia digital, identidad, contenido, producción audiovisual, tecnología o procesos. El mejor camino depende del diagnóstico.")}
            </p>
          </div>

          <div className="space-y-12 max-w-5xl mx-auto">
            {displayDomains.map((domain, index) => (<div key={index} className={`tag08-service-domain ${index === 0 ? "tag08-service-domain--light" : "bg-charcoal-900"} border border-white/[0.06] rounded-[24px] p-6 sm:p-8 lg:p-12 relative overflow-hidden group hover:border-brand-secondary/20 transition-colors duration-200 shadow-xl flex flex-col justify-between`}>
                  {/* Neon top thin strip glow indicator to add extreme design fidelity */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-secondary/15 to-transparent transition-opacity group-hover:via-brand/45"/>
                  
                  {/* Number count and status bar indicators */}
                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-5 mb-6 text-left select-none">
                    <span className="font-display font-black text-3xl sm:text-4xl text-zinc-500 group-hover:text-brand-secondary transition-colors uppercase" aria-hidden="true">
                      {domain.num}.
                    </span>
                    <div className="flex items-center gap-1.5 tag08-meta text-xs text-zinc-400 uppercase tracking-widest">
                      <span>{copyForLocale(locale, "CAMINHO", "PATH", "CAMINO")} {domain.num}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary/40"/>
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
                          {domain.tags.map((tag, tagIdx) => (<span key={tagIdx} className="text-xs font-sans font-medium tracking-wide border border-brand-secondary/10 text-brand bg-brand-secondary/[0.02] py-0.5 px-2 rounded-md">
                              {tag}
                            </span>))}
                        </div>
                      </div>

                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                        {domain.description}
                      </p>

                      {/* Scope Deliverables Bullet List */}
                      <div className="space-y-4 pt-4 border-t border-white/[0.04]">
                        <p className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest leading-none font-bold">
                          {copyForLocale(locale, "Caminhos dentro desta frente", "Services in this area", "Servicios de esta área")}
                        </p>
                        <div className="grid gap-3.5 pl-1">
                          {domain.subservices.map((sub, subIdx) => (<div key={subIdx} className="flex gap-3">
                              <div className="mt-1 w-3.5 h-3.5 rounded-full bg-brand-secondary/5 text-brand flex items-center justify-center shrink-0 border border-brand-secondary/15">
                                <Check className="w-2 h-2 text-brand-secondary"/>
                              </div>
                              <div>
                                <h3 className="text-white text-xs font-semibold">{sub.name}</h3>
                                <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">{sub.desc}</p>
                              </div>
                            </div>))}
                        </div>
                      </div>

                      {/* Primary Navigation CTA and Scope Share */}
                      <div className="pt-6 flex flex-wrap gap-3 items-center">
                        <Link href={getLocalizedPath(domain.ctaPage, locale)} className="inline-flex min-h-11 items-center gap-2 bg-white/5 hover:bg-brand hover:text-black border border-white/10 hover:border-brand text-xs text-white tag08-meta font-semibold uppercase tracking-widest py-3 px-6 rounded-xl transition-colors duration-200 group/btn shrink-0">
                          <span>{domain.ctaLabel}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1.5 transition-transform"/>
                        </Link>
                        {domain.secondaryCta && (<Link href={getLocalizedPath(domain.secondaryCta.page, locale)} className="inline-flex min-h-11 items-center gap-2 border border-white/10 hover:border-brand/50 text-xs text-zinc-300 hover:text-white tag08-meta font-semibold uppercase tracking-widest py-3 px-4 rounded-xl transition-colors duration-200">
                            {domain.secondaryCta.label}
                          </Link>)}
                      </div>

                    </div>

                    {/* Right Column: High Visual Mockup wrapped in subtle physical perspective frames */}
                    <div className="lg:col-span-6 w-full h-full xl:pl-6">
                      <div className="tag08-service-domain__media relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[1.5/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group/img">
                          <Image fill sizes="(max-width: 1024px) 100vw, 50vw" src={domain.image} alt="" className="object-cover grayscale brightness-[0.4] group-hover/img:grayscale-0 group-hover/img:brightness-[0.6] transition-[filter] duration-200 ease-out" referrerPolicy="no-referrer"/>
                          {/* Rich overlays */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none"/>
                          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1.5 rounded-lg text-zinc-400 font-sans text-xs flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-brand"/>
                          <span>{copyForLocale(locale, "SOLUÇÃO TAG08", "TAG08 SOLUTION", "SOLUCIÓN TAG08")}</span>
                          </div>
                      </div>
                    </div>

                  </div>
                </div>))}
          </div>

        </div>
      </section>

      {/*==========================================================
            THE STRATEGIC MATRIX OF COMBINED VALUE (User Screen 2 Style)
           ==========================================================*/}
      <section className="order-3 px-4 sm:px-6 md:px-8 py-14 sm:py-20 relative z-10 border-b border-white/[0.04] bg-charcoal-950">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-3 text-left max-w-2xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
              {copyForLocale(locale, "Combinação de frentes", "Combining service areas", "Combinación de áreas")}
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tighter leading-none">
              {copyForLocale(locale, "Alguns problemas atravessam mais de uma frente.", "Some problems span more than one service area.", "Algunos problemas abarcan más de un área.")}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              {copyForLocale(locale, "Uma única solução pode ser suficiente. Quando o problema envolve mais de uma dimensão, a combinação precisa nascer do diagnóstico — não da tentativa de ampliar o escopo.", "One solution may be enough. When a problem involves more than one dimension, any combination should come from the diagnosis, not from an attempt to expand scope.", "Una sola solución puede ser suficiente. Si el problema abarca más de una dimensión, la combinación debe surgir del diagnóstico, no de un intento de ampliar el alcance.")}
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
        ].map((item, idx) => (<div key={idx} className="p-6 sm:p-7 rounded-[24px] bg-charcoal-900 border border-white/[0.05] hover:border-brand/40 hover:bg-white/[0.015] transition-colors duration-200 relative overflow-hidden flex flex-col justify-between group">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"/>

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-sans text-xs text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-0.5 rounded font-black tracking-widest">
                      {copyForLocale(locale, item.tag, "When it fits", "Cuando tenga sentido")}
                    </span>
                    <span className="font-sans text-xs text-zinc-300" aria-hidden="true">0{idx + 1}</span>
                  </div>
                  <h3 className="text-white text-base sm:text-lg font-display font-bold tracking-tight group-hover:text-brand-secondary transition-colors">
                    {locale === "pt" ? item.title : COMBINATION_COPY[locale][idx].title}
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    {locale === "pt" ? item.desc : COMBINATION_COPY[locale][idx].desc}
                  </p>
                </div>
              </div>))}
          </div>
        </div>
      </section>

      {/* SECTION - WORK SYSTEM (WhatsApp Neon Callout inspired by screenshot) */}
      <section className="order-4 py-14 sm:py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none"/>

          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[520px]">
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden"/>
            <Image fill sizes="(max-width: 1024px) 100vw, 42vw" src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800" alt="" className="object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[15%]" referrerPolicy="no-referrer"/>
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between items-start">
                <span className="tag08-meta text-xs text-white/80 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  {copyForLocale(locale, "CONTEXTO", "CONTEXT", "CONTEXTO")}
                </span>
                <span className="font-sans text-xs text-white/70 tracking-wider">
                  {copyForLocale(locale, "DIREÇÃO TAG08", "TAG08 DIRECTION", "DIRECCIÓN TAG08")}
                </span>
              </div>
              <div className="space-y-1.5 opacity-30 select-none">
                <div className="font-display font-extrabold text-[1.8rem] text-white/40 tracking-widest leading-none uppercase select-none">
                  {copyForLocale(locale, "escopo definido", "scope defined", "alcance definido")}
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                  {copyForLocale(locale, "execução acompanhada", "guided execution", "ejecución acompañada")}
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-sans text-xs text-white/70 tracking-wider">
                  {copyForLocale(locale, "EXECUÇÃO", "EXECUTION", "EJECUCIÓN")}
                </span>
                <span className="tag08-meta text-xs text-white/80 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  {copyForLocale(locale, "ACOMPANHAMENTO", "FOLLOW-UP", "SEGUIMIENTO")}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 text-left h-full relative z-10 lg:pl-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-black font-semibold">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-brand animate-ping"/>
                </div>
                <span className="tag08-meta text-xs tracking-widest uppercase font-bold text-black/90">
                  {copyForLocale(locale, "Como conduzimos o trabalho", "How we work", "Cómo trabajamos")}
                </span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black leading-[0.9] tracking-tighter font-display">
                {copyForLocale(locale, "Da recomendação ao acompanhamento.", "From recommendation to follow-up.", "De la recomendación al seguimiento.")}
              </h2>
              <p className="text-black/85 text-xs sm:text-xs max-w-lg leading-relaxed font-sans font-extrabold uppercase font-bold">
                {copyForLocale(locale, "A TAG08 organiza cada projeto com escopo claro, responsáveis definidos, etapas visíveis e revisões necessárias para que a execução não dependa de improviso.", "TAG08 organizes each project around a clear scope, defined responsibilities, visible stages, and necessary reviews so execution does not depend on improvisation.", "TAG08 organiza cada proyecto con un alcance claro, responsables definidos, etapas visibles y revisiones necesarias para que la ejecución no dependa de la improvisación.")}
              </p>
            </div>

            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-5 max-w-2xl relative overflow-hidden text-left font-sans">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none"/>
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
        ].map((step, idx) => (<div key={idx} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="tag08-meta text-xs text-brand uppercase tracking-wider font-extrabold">
                        0{idx + 1}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-brand-secondary/50"/>
                    </div>
                    <h3 className="text-white text-sm font-semibold">{locale === "pt" ? step.title : WORK_COPY[locale][idx].title}</h3>
                    <p className="text-zinc-300 text-xs leading-relaxed">{locale === "pt" ? step.desc : WORK_COPY[locale][idx].desc}</p>
                  </div>))}
              </div>

              <div className="flex pt-2 relative z-10">
                <button onClick={() => handleLinkClick("/contato")} className="inline-flex min-h-11 items-center justify-center gap-2 bg-brand text-black hover:bg-brand-dark tag08-meta font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-colors duration-200">
                  {copyForLocale(locale, "FALAR COM A TAG08", "TALK TO TAG08", "HABLAR CON TAG08")}
                  <ArrowUpRight className="w-3.5 h-3.5"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION - FAQ */}
      <section className="order-5 py-16 sm:py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[160px] pointer-events-none"/>

        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[40px] bg-charcoal-950 border border-white/[0.04] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none"/>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
            {/* Left Column: Title & FAQ Buttons list */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
                  {copyForLocale(locale, "Dúvidas antes de escolher", "Questions before choosing", "Dudas antes de elegir")}
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter">
                  {copyForLocale(locale, "Entenda como escolher", "Learn how to choose", "Entiende cómo elegir")} <br />
                  {copyForLocale(locale, "a solução certa.", "the right solution.", "la solución adecuada.")}
                </h2>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-sans max-w-sm">
                  {copyForLocale(locale, "A página de Serviços existe para orientar o ponto de partida. A recomendação final depende do momento da marca, dos gargalos atuais e da capacidade de execução.", "This Services page helps identify a starting point. The final recommendation depends on the brand's stage, current bottlenecks, and ability to execute.", "Esta página de Servicios orienta el punto de partida. La recomendación final depende del momento de la marca, sus obstáculos actuales y su capacidad de ejecución.")}
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {([
            { id: 0, title: "PONTO DE PARTIDA" },
            { id: 1, title: "SOLUÇÕES" },
            { id: 2, title: "COMBINAÇÃO" },
            { id: 3, title: "PROCESSO" },
            { id: 4, title: "RESULTADOS" }
        ]).map((item) => (<button key={item.id} onClick={() => setActiveFaq(item.id)} aria-expanded={activeFaq === item.id} aria-controls="faq-panel" className={`w-full min-h-11 flex items-center justify-between p-4 rounded-xl border transition-colors duration-200 text-left group cursor-pointer ${activeFaq === item.id
                ? "bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)]"
                : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"}`}>
                    <span className="tag08-meta text-xs font-black uppercase tracking-wider flex items-center gap-3">
                      <span className={activeFaq === item.id ? "text-black" : "text-brand"}>
                        {String(item.id + 1).padStart(2, '0')}.
                      </span>
                      {locale === "pt" ? item.title : FAQ_COPY[locale][item.id].title}
                    </span>
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${activeFaq === item.id ? "text-black rotate-[-45deg] stroke-[2.5]" : "text-zinc-500"}`}/>
                  </button>))}
              </div>
            </div>

            {/* Middle Column: Cover image */}
            <div className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[300px] sm:min-h-[360px] rounded-3xl overflow-hidden border border-white/[0.04] bg-charcoal-900">
              <Image fill sizes="(max-width: 1024px) 100vw, 34vw" src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800" alt="" className="object-cover grayscale brightness-[0.22] contrast-[1.1] pointer-events-none"/>
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30" aria-hidden="true">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2"/>
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse"/>
                </svg>
              </div>
              <div className="absolute top-6 left-6 z-10 pointer-events-none tag08-meta text-xs text-white/50 uppercase tracking-widest leading-none" aria-hidden="true">
                {copyForLocale(locale, "ORIENTAÇÃO", "GUIDANCE", "ORIENTACIÓN")}
              </div>

              <div id="faq-panel" role="region" aria-live="polite" aria-labelledby="faq-panel-heading" className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left font-sans">
                <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black block">
                  {locale === "pt" ? ([
            "PONTO DE PARTIDA",
            "SOLUÇÕES",
            "COMBINAÇÃO",
            "PROCESSO",
            "RESULTADOS"
        ])[activeFaq] : FAQ_COPY[locale][activeFaq].title}
                </span>

                <h3 id="faq-panel-heading" className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {locale === "pt" ? ([
            "Preciso saber qual serviço contratar antes de falar com a TAG08?",
            "A TAG08 trabalha com estruturas prontas?",
            "Posso contratar apenas uma solução?",
            "Por que o diagnóstico vem antes da proposta?",
            "A TAG08 garante resultados?"
        ])[activeFaq] : FAQ_COPY[locale][activeFaq].question}
                </h3>

                <p className="text-zinc-300 text-xs sm:text-xs leading-relaxed font-sans font-medium">
                  {locale === "pt" ? ([
            "Não. O primeiro passo é entender o momento do negócio e o principal gargalo. A partir disso, a TAG08 avalia qual das seis famílias — ou qual combinação coerente — responde melhor à necessidade.",
            "Existem soluções e produtos definidos, mas a recomendação não é automática. Momento, maturidade, capacidade de investimento e participação necessária do cliente influenciam a indicação.",
            "Sim. Quando uma única frente resolve o problema identificado, não há motivo para ampliar o escopo. Combinações só fazem sentido quando o diagnóstico mostra dependência entre diferentes necessidades.",
            "Porque o pedido inicial nem sempre corresponde ao problema real. Diagnóstico reduz risco de escopo errado, expectativa desalinhada e investimento fora de prioridade.",
            "Não. A TAG08 trabalha com método, direção e execução responsável. Resultado comercial também depende de oferta, mercado, atendimento, operação, investimento e outras variáveis que não estão sob controle de uma única empresa."
        ])[activeFaq] : FAQ_COPY[locale][activeFaq].answer}
                </p>
              </div>
            </div>

            {/* Right Column: Mini auxiliary action cards */}
            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              <div id="service-criterion-card" className="bg-charcoal-900 border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-colors duration-200 text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest block font-bold">{copyForLocale(locale, "CRITÉRIO", "CRITERION", "CRITERIO")}</span>
                  <h3 className="text-white font-semibold text-sm leading-snug font-display">{copyForLocale(locale, "A solução vem depois do entendimento.", "A solution follows understanding.", "La solución viene después de comprender la necesidad.")}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    {copyForLocale(locale, "O hub apresenta caminhos possíveis. A recomendação final depende de contexto, maturidade e capacidade de execução.", "This hub presents possible paths. The final recommendation depends on context, maturity, and ability to execute.", "El hub presenta caminos posibles. La recomendación final depende del contexto, la madurez y la capacidad de ejecución.")}
                  </p>
                </div>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 hover:bg-brand-dark transition-colors duration-200 text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-black/60 uppercase tracking-widest block font-extrabold">{copyForLocale(locale, "PRÓXIMO PASSO", "NEXT STEP", "SIGUIENTE PASO")}</span>
                  <h3 className="text-black font-black text-sm leading-tight tracking-tight">{copyForLocale(locale, "O melhor caminho começa pelo entendimento do momento atual.", "The right path starts with understanding the current situation.", "El mejor camino comienza por comprender el momento actual.")}</h3>
                  <p className="text-black/85 text-xs font-semibold leading-relaxed font-sans">
                    {copyForLocale(locale, "A conversa inicial organiza contexto, prioridade e fit antes da proposta.", "The initial conversation organizes context, priorities, and fit before a proposal is prepared.", "La conversación inicial organiza el contexto, las prioridades y la adecuación antes de preparar una propuesta.")}
                  </p>
                </div>
                <TrackedOutboundLink label="Falar com a TAG08" surface="servicos-final-cta" href={buildBrazilWhatsAppUrl(copyForLocale(locale, "Olá, gostaria de entender o melhor caminho para minha marca!", "Hello, I would like to understand the right path for my business.", "Hola, me gustaría entender el mejor camino para mi negocio."))} target="_blank" rel="noreferrer" className="group flex min-h-11 items-center justify-between text-xs font-sans font-black text-black select-none border-t border-black/10 pt-3 hover:border-black/30 transition-colors duration-200">
                  <span>{copyForLocale(locale, "FALAR COM A TAG08", "TALK TO TAG08", "HABLAR CON TAG08")}</span>
                  <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]"/>
                </TrackedOutboundLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*==========================================================
            THE EXECUTIVE CONVICTION CTA PANEL
           ==========================================================*/}
      <section className="order-6 px-4 sm:px-6 md:px-8 py-10 sm:py-12 relative z-10 animate-fade-in border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto rounded-3xl bg-charcoal-900 border border-white/[0.06] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-left relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary/[0.01] via-transparent to-transparent pointer-events-none"/>
          
          <div className="space-y-2">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-semibold bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              {copyForLocale(locale, "Próximo passo", "Next step", "Siguiente paso")}
            </span>
            <h2 className="font-display font-medium text-xl sm:text-2xl text-white tracking-tight leading-none">
              {copyForLocale(locale, "A solução certa precisa fazer sentido antes da contratação.", "The right solution should make sense before you commit.", "La solución adecuada debe tener sentido antes de contratarla.")}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              {copyForLocale(locale, "A TAG08 procura entender contexto, maturidade, prioridade e capacidade de execução antes de recomendar uma solução.", "TAG08 seeks to understand context, maturity, priorities, and execution capacity before recommending a solution.", "TAG08 busca comprender el contexto, la madurez, las prioridades y la capacidad de ejecución antes de recomendar una solución.")}
            </p>
          </div>
          
          <div className="flex shrink-0">
            <button onClick={() => handleLinkClick("/contato")} className="min-h-11 bg-brand-secondary hover:bg-brand text-black font-black text-xs font-sans px-7 py-4 rounded-xl transition-colors duration-200 shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.15)] cursor-pointer">
              {copyForLocale(locale, "QUERO ENTENDER MEU MELHOR CAMINHO", "FIND THE RIGHT PATH FOR MY BUSINESS", "QUIERO ENTENDER EL MEJOR CAMINO PARA MI NEGOCIO")}
            </button>
          </div>
        </div>
      </section>
    </div>);
}
