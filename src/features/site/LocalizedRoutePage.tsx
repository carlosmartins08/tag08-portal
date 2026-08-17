"use client";

import { ArrowRight, CheckCircle2, Mail, MessageCircle } from "lucide-react";
import type { RouteKey, RouteLocale } from "../../config/routeRegistry";
import { TAG08_OFFICIAL_CONTACT } from "../../config/siteNetwork";

type LocalizedPageCopy = {
  eyebrow: string;
  title: string;
  description: string;
  outcomes: [string, string, string];
  primaryCta: string;
  secondaryCta: string;
};

type LocalizedCopyByRoute = Record<RouteKey, LocalizedPageCopy>;

const english: LocalizedCopyByRoute = {
  home: { eyebrow: "TAG08 strategic marketing", title: "A clear digital presence for brands ready to grow.", description: "We align positioning, digital channels and operational routines so marketing becomes a practical business asset.", outcomes: ["Sharper positioning and messages", "A focused channel plan", "Consistent execution with measurable next steps"], primaryCta: "Start a conversation", secondaryCta: "Explore services" },
  sobre: { eyebrow: "About TAG08", title: "Strategy that connects brand, operation and growth.", description: "TAG08 works with companies that need clearer priorities, stronger communication and an execution structure that teams can sustain.", outcomes: ["Practical diagnosis before recommendations", "Senior guidance across brand and channels", "Decisions translated into an actionable plan"], primaryCta: "Talk to TAG08", secondaryCta: "View our services" },
  servicos: { eyebrow: "Integrated services", title: "The right structure for the stage your business is in.", description: "Our services connect brand direction, content, web presence and operations instead of treating each channel as an isolated task.", outcomes: ["Strategy and positioning", "Web, content and audiovisual presence", "Process intelligence and activation"], primaryCta: "Request a diagnostic", secondaryCta: "Contact us" },
  "servicos-process-intelligence": { eyebrow: "Process Intelligence", title: "Turn operational friction into a clear way of working.", description: "We map bottlenecks, responsibilities and handoffs to create playbooks that reduce ambiguity and support growth.", outcomes: ["Operational diagnosis", "Clear ownership and routines", "Usable documentation and playbooks"], primaryCta: "Discuss your operation", secondaryCta: "See all services" },
  "servicos-process-activation": { eyebrow: "Process Activation", title: "Make the process work in the real world.", description: "Activation turns a designed process into training, adoption and a sustainable operating rhythm for the team.", outcomes: ["Implementation support", "Team enablement", "Review points and continuous improvement"], primaryCta: "Plan an activation", secondaryCta: "Contact TAG08" },
  "servicos-desenvolvimento-web": { eyebrow: "Web development", title: "Websites that explain value and make the next step obvious.", description: "We build fast, structured digital experiences for companies that need a credible presence and a clear conversion path.", outcomes: ["Information architecture", "Performance-minded implementation", "Conversion-oriented contact paths"], primaryCta: "Plan your website", secondaryCta: "Talk to a specialist" },
  "servicos-branding-identidade": { eyebrow: "Branding and identity", title: "A brand identity people can understand and trust.", description: "We align positioning, verbal direction and visual identity so the brand communicates its actual value with consistency.", outcomes: ["Positioning and narrative", "Visual identity system", "Guidance for consistent application"], primaryCta: "Discuss your brand", secondaryCta: "Explore services" },
  "servicos-gestao-redes-sociais": { eyebrow: "Social media management", title: "Content with a point of view and a business purpose.", description: "Editorial planning, production direction and channel management for brands that want a coherent, ongoing presence.", outcomes: ["Editorial strategy", "Content production direction", "Channel performance review"], primaryCta: "Plan your channels", secondaryCta: "Contact TAG08" },
  "servicos-producao-audiovisual": { eyebrow: "Audiovisual production", title: "Video and event coverage that extend your brand story.", description: "We plan and produce audiovisual material for campaigns, authority content, institutional communication and events.", outcomes: ["Creative and production direction", "Authority and campaign content", "Event coverage with a clear narrative"], primaryCta: "Discuss a production", secondaryCta: "See all services" },
  "servicos-assessoria-marketing-digital-estrategico": { eyebrow: "Marketing advisory", title: "Senior direction for decisions that cannot stay improvised.", description: "A strategic partnership for leaders who need to prioritize channels, positioning and commercial actions with more clarity.", outcomes: ["Channel and positioning diagnosis", "Decision support for leadership", "A prioritized execution roadmap"], primaryCta: "Request an assessment", secondaryCta: "Contact TAG08" },
  contato: { eyebrow: "Contact TAG08", title: "Tell us what your company needs to make clearer.", description: "Choose the contact channel that works for you. We use the first conversation to understand context, priorities and fit.", outcomes: ["WhatsApp for an initial conversation", "Email for detailed requests", "A strategic diagnostic before a proposal"], primaryCta: "Open WhatsApp", secondaryCta: "Send an email" },
  "trabalhe-conosco": { eyebrow: "Careers", title: "Build thoughtful work with a team that values direction.", description: "We look for people who combine craft, responsibility and a willingness to improve how work gets done.", outcomes: ["Clear professional expectations", "Multidisciplinary work", "Continuous learning through real projects"], primaryCta: "Contact the team", secondaryCta: "Learn about TAG08" },
  insights: { eyebrow: "Strategic insights", title: "Ideas for clearer marketing and better operations.", description: "Our insights connect positioning, content, web performance and process design to help leaders make better decisions.", outcomes: ["Brand and positioning", "Digital presence and conversion", "Operational clarity"], primaryCta: "Talk to TAG08", secondaryCta: "Explore services" },
  "case-study-detail": { eyebrow: "TAG08 case study", title: "Context, choices and a clearer path forward.", description: "Each case examines the business context, the strategic decision and the work required to create a more coherent presence.", outcomes: ["Business context", "Strategic direction", "Operational learning"], primaryCta: "Discuss a similar challenge", secondaryCta: "View services" },
  "sebraetec-impulsionando-empreendedores": { eyebrow: "Sebraetec", title: "Innovation support for companies ready to strengthen their presence.", description: "We help eligible businesses understand where design, channels and web structure can support a more competitive next phase.", outcomes: ["Program eligibility guidance", "Structured digital priorities", "A practical project direction"], primaryCta: "Ask about Sebraetec", secondaryCta: "Contact TAG08" },
  "programa-afiliados": { eyebrow: "Affiliate program", title: "Introduce a company that needs direction and build a trusted connection.", description: "The program is designed for partners who know businesses that could benefit from TAG08 services and a clearer digital structure.", outcomes: ["Straightforward referral process", "Transparent commercial conversation", "Long-term partnership potential"], primaryCta: "Talk about partnerships", secondaryCta: "Contact TAG08" },
  "hospedagem-manutencao-sites": { eyebrow: "Hosting and maintenance", title: "Keep your website secure, current and dependable.", description: "Hosting and maintenance for companies that need a stable web presence with clear ownership and responsive support.", outcomes: ["Performance and availability care", "Security and update routines", "A reliable support channel"], primaryCta: "Discuss maintenance", secondaryCta: "See web development" },
  "cliente-onboarding": { eyebrow: "Client onboarding", title: "Start your project with clear information.", description: "Use the multilingual onboarding flow to share the strategic context needed for a safe and productive kickoff.", outcomes: ["Guided information collection", "Privacy-aware submission", "A clearer project kickoff"], primaryCta: "Start onboarding", secondaryCta: "Contact TAG08" },
  "not-found": { eyebrow: "Page not found", title: "This route is not available.", description: "Return to the home page or contact TAG08 if you need help finding the right information.", outcomes: ["Clear navigation", "Direct contact", "Strategic guidance"], primaryCta: "Go home", secondaryCta: "Contact TAG08" }
};

const spanish: LocalizedCopyByRoute = {
  home: { eyebrow: "Marketing estratégico TAG08", title: "Una presencia digital clara para marcas listas para crecer.", description: "Alineamos posicionamiento, canales digitales y rutinas operativas para que el marketing sea un activo real del negocio.", outcomes: ["Posicionamiento y mensaje más claros", "Plan de canales enfocado", "Ejecución consistente con próximos pasos medibles"], primaryCta: "Iniciar una conversación", secondaryCta: "Explorar servicios" },
  sobre: { eyebrow: "Sobre TAG08", title: "Estrategia que conecta marca, operación y crecimiento.", description: "TAG08 trabaja con empresas que necesitan prioridades más claras, comunicación más fuerte y una estructura de ejecución sostenible.", outcomes: ["Diagnóstico práctico antes de recomendar", "Dirección senior para marca y canales", "Decisiones convertidas en un plan accionable"], primaryCta: "Hablar con TAG08", secondaryCta: "Ver servicios" },
  servicos: { eyebrow: "Servicios integrados", title: "La estructura adecuada para la etapa actual de tu negocio.", description: "Nuestros servicios conectan dirección de marca, contenido, presencia web y operación, sin tratar cada canal como una tarea aislada.", outcomes: ["Estrategia y posicionamiento", "Web, contenido y audiovisual", "Inteligencia y activación de procesos"], primaryCta: "Solicitar diagnóstico", secondaryCta: "Contáctanos" },
  "servicos-process-intelligence": { eyebrow: "Process Intelligence", title: "Convierte la fricción operativa en una forma de trabajo clara.", description: "Mapeamos cuellos de botella, responsabilidades y entregas para crear playbooks que reducen la ambigüedad y apoyan el crecimiento.", outcomes: ["Diagnóstico operacional", "Responsabilidades y rutinas claras", "Documentación y playbooks utilizables"], primaryCta: "Hablar sobre tu operación", secondaryCta: "Ver todos los servicios" },
  "servicos-process-activation": { eyebrow: "Process Activation", title: "Haz que el proceso funcione en el trabajo real.", description: "La activación convierte un proceso diseñado en capacitación, adopción y un ritmo operativo sostenible para el equipo.", outcomes: ["Acompañamiento de implementación", "Capacitación del equipo", "Revisión y mejora continua"], primaryCta: "Planear una activación", secondaryCta: "Contactar TAG08" },
  "servicos-desenvolvimento-web": { eyebrow: "Desarrollo web", title: "Sitios que explican valor y hacen evidente el siguiente paso.", description: "Creamos experiencias digitales rápidas y estructuradas para empresas que necesitan credibilidad y una ruta clara de conversión.", outcomes: ["Arquitectura de información", "Implementación enfocada en rendimiento", "Rutas de contacto orientadas a conversión"], primaryCta: "Planear tu sitio", secondaryCta: "Hablar con un especialista" },
  "servicos-branding-identidade": { eyebrow: "Branding e identidad", title: "Una identidad de marca que las personas entienden y en la que confían.", description: "Alineamos posicionamiento, dirección verbal e identidad visual para comunicar el valor real de la marca con consistencia.", outcomes: ["Posicionamiento y narrativa", "Sistema de identidad visual", "Guía para una aplicación coherente"], primaryCta: "Hablar sobre tu marca", secondaryCta: "Explorar servicios" },
  "servicos-gestao-redes-sociais": { eyebrow: "Gestión de redes sociales", title: "Contenido con punto de vista y propósito comercial.", description: "Plan editorial, dirección de producción y gestión de canales para marcas que quieren una presencia coherente y continua.", outcomes: ["Estrategia editorial", "Dirección de producción de contenido", "Revisión de rendimiento de canales"], primaryCta: "Planear tus canales", secondaryCta: "Contactar TAG08" },
  "servicos-producao-audiovisual": { eyebrow: "Producción audiovisual", title: "Video y cobertura de eventos que amplían la historia de tu marca.", description: "Planeamos y producimos material audiovisual para campañas, contenido de autoridad, comunicación institucional y eventos.", outcomes: ["Dirección creativa y de producción", "Contenido de autoridad y campañas", "Cobertura de eventos con narrativa clara"], primaryCta: "Hablar de una producción", secondaryCta: "Ver todos los servicios" },
  "servicos-assessoria-marketing-digital-estrategico": { eyebrow: "Asesoría de marketing", title: "Dirección senior para decisiones que no pueden seguir improvisadas.", description: "Una alianza estratégica para líderes que necesitan priorizar canales, posicionamiento y acciones comerciales con mayor claridad.", outcomes: ["Diagnóstico de canales y posicionamiento", "Apoyo a decisiones de liderazgo", "Hoja de ruta priorizada"], primaryCta: "Solicitar evaluación", secondaryCta: "Contactar TAG08" },
  contato: { eyebrow: "Contacto TAG08", title: "Cuéntanos qué necesita aclarar tu empresa.", description: "Elige el canal que prefieras. La primera conversación sirve para entender contexto, prioridades y compatibilidad.", outcomes: ["WhatsApp para una primera conversación", "Correo para solicitudes detalladas", "Diagnóstico estratégico antes de una propuesta"], primaryCta: "Abrir WhatsApp", secondaryCta: "Enviar correo" },
  "trabalhe-conosco": { eyebrow: "Trabaja con nosotros", title: "Construye trabajo cuidadoso con un equipo que valora la dirección.", description: "Buscamos personas que combinen oficio, responsabilidad y voluntad de mejorar la manera en que se trabaja.", outcomes: ["Expectativas profesionales claras", "Trabajo multidisciplinario", "Aprendizaje continuo en proyectos reales"], primaryCta: "Contactar al equipo", secondaryCta: "Conocer TAG08" },
  insights: { eyebrow: "Insights estratégicos", title: "Ideas para un marketing más claro y mejores operaciones.", description: "Nuestros insights conectan posicionamiento, contenido, rendimiento web y diseño de procesos para apoyar mejores decisiones.", outcomes: ["Marca y posicionamiento", "Presencia digital y conversión", "Claridad operativa"], primaryCta: "Hablar con TAG08", secondaryCta: "Explorar servicios" },
  "case-study-detail": { eyebrow: "Caso TAG08", title: "Contexto, decisiones y un camino más claro.", description: "Cada caso analiza el contexto de negocio, la decisión estratégica y el trabajo necesario para crear una presencia más coherente.", outcomes: ["Contexto de negocio", "Dirección estratégica", "Aprendizaje operacional"], primaryCta: "Hablar de un desafío similar", secondaryCta: "Ver servicios" },
  "sebraetec-impulsionando-empreendedores": { eyebrow: "Sebraetec", title: "Apoyo a la innovación para empresas listas para fortalecer su presencia.", description: "Ayudamos a negocios elegibles a entender dónde diseño, canales y estructura web pueden apoyar una fase más competitiva.", outcomes: ["Orientación sobre elegibilidad", "Prioridades digitales estructuradas", "Dirección práctica de proyecto"], primaryCta: "Consultar Sebraetec", secondaryCta: "Contactar TAG08" },
  "programa-afiliados": { eyebrow: "Programa de afiliados", title: "Conecta una empresa que necesita dirección y construye una relación de confianza.", description: "El programa es para socios que conocen negocios que pueden beneficiarse de los servicios TAG08 y una estructura digital más clara.", outcomes: ["Proceso de recomendación directo", "Conversación comercial transparente", "Potencial de asociación a largo plazo"], primaryCta: "Hablar de alianzas", secondaryCta: "Contactar TAG08" },
  "hospedagem-manutencao-sites": { eyebrow: "Hosting y mantenimiento", title: "Mantén tu sitio seguro, actualizado y confiable.", description: "Hosting y mantenimiento para empresas que necesitan una presencia web estable, responsable y con soporte claro.", outcomes: ["Cuidado de rendimiento y disponibilidad", "Rutinas de seguridad y actualizaciones", "Canal de soporte confiable"], primaryCta: "Hablar de mantenimiento", secondaryCta: "Ver desarrollo web" },
  "cliente-onboarding": { eyebrow: "Onboarding de clientes", title: "Inicia tu proyecto con información clara.", description: "Usa el flujo de onboarding multilingüe para compartir el contexto estratégico necesario para un inicio seguro y productivo.", outcomes: ["Recopilación guiada de información", "Envío con foco en privacidad", "Inicio de proyecto más claro"], primaryCta: "Iniciar onboarding", secondaryCta: "Contactar TAG08" },
  "not-found": { eyebrow: "Página no encontrada", title: "Esta ruta no está disponible.", description: "Vuelve al inicio o contacta TAG08 si necesitas ayuda para encontrar la información adecuada.", outcomes: ["Navegación clara", "Contacto directo", "Dirección estratégica"], primaryCta: "Ir al inicio", secondaryCta: "Contactar TAG08" }
};

export const getLocalizedRouteCopy = (locale: Exclude<RouteLocale, "pt">, routeKey: RouteKey) =>
  (locale === "en" ? english : spanish)[routeKey];

export default function LocalizedRoutePage({ routeKey, locale, onNavigate }: { routeKey: RouteKey; locale: Exclude<RouteLocale, "pt">; onNavigate: (path: string) => void }) {
  const copy = getLocalizedRouteCopy(locale, routeKey);
  const whatsappHref = TAG08_OFFICIAL_CONTACT.whatsappBusinessUrl;

  return (
    <main className="min-h-screen bg-charcoal-950 px-6 pb-24 pt-28 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="tag08-meta text-xs font-bold uppercase tracking-[0.22em] text-brand">{copy.eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-6xl">{copy.title}</h1>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">{copy.description}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {copy.outcomes.map((outcome) => (
            <div key={outcome} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-relaxed text-zinc-200">
              <CheckCircle2 className="mb-3 h-5 w-5 text-brand" aria-hidden="true" />
              {outcome}
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          {routeKey === "contato" ? (
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 font-semibold text-black transition hover:bg-brand/90">
              <MessageCircle className="h-4 w-4" /> {copy.primaryCta}
            </a>
          ) : (
            <button type="button" onClick={() => onNavigate("/contato")} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 font-semibold text-black transition hover:bg-brand/90">
              {copy.primaryCta} <ArrowRight className="h-4 w-4" />
            </button>
          )}
          {routeKey === "contato" ? (
            <a href={`mailto:${TAG08_OFFICIAL_CONTACT.email}`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/5">
              <Mail className="h-4 w-4" /> {copy.secondaryCta}
            </a>
          ) : (
            <button type="button" onClick={() => onNavigate(routeKey === "servicos" ? "/" : "/servicos")} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/5">
              {copy.secondaryCta}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
