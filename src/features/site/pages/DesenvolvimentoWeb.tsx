import { useState } from "react";
import Image from "next/image";
import ItsHoverActionIcon from "../../../components/ItsHoverActionIcon";
import { Smartphone, LineChart, ArrowUpRight, ArrowRight, Layers } from "../../../components/DooIcons";
import { useReducedMotion } from "motion/react";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import TrackedOutboundLink from "../../../components/TrackedOutboundLink";
import { buildBrazilWhatsAppUrl } from "../../../config/siteNetwork";
import type { RouteLocale } from "../../../config/routeRegistry";

interface WebProps {
  onNavigate: (page: string) => void;
  locale?: RouteLocale;
}

const WEB_COPY = {
  en: {
    badge: "Web Development",
    heading: "Websites and digital structures",
    headingAccent: "with direction, clarity, and a clear business role.",
    summary: "TAG08 develops websites, e-commerce experiences, and specific digital solutions according to the diagnosis, modeling, validation, and structure required. For e-commerce, operational readiness is also part of the decision.",
    heroCta: "TALK TO TAG08",
    heroSystem: "TAG08 web system",
    heroStructure: "Digital structure with direction and purpose",
    heroSignals: "CLARITY // CREDIBILITY",
    heroAlt: "Planning and development of a web structure",
    heroValues: [
      ["Clarity", "Information organized to make the company and its offer easier to understand."],
      ["Credibility", "A digital presence aligned with the brand identity, content, and current stage."],
      ["Organization", "Pages, navigation, and content structured around a defined purpose."],
      ["Commercial support", "Contact paths and next steps integrated into the visitor journey."]
    ],
    mismatchLabel: "Signs of digital misalignment",
    mismatchTitle: "When a website no longer helps people understand the brand.",
    mismatchDescription: "Many companies have a website that still makes it difficult to find information about the brand, its services, or the next step. Outdated content, confusing navigation, pages without a clear role, and a structure that no longer fits the business are common signs of this misalignment.",
    comparisonLabels: ["Reading the current experience", "TAG08 digital foundation"],
    comparisonRows: [
      ["Information is hard to find", "The architecture organizes the company, its offer, and next steps to reduce the effort needed to understand them."],
      ["A website that no longer fits the business", "The digital structure is updated to reflect the brand’s current stage, services, and priorities."],
      ["Pages without a clear purpose", "Each page has a defined role in the journey: introduce, explain, guide, or support contact."],
      ["Misaligned content", "Copy, images, and calls to action follow a consistent approach to positioning, information, and experience."]
    ],
    deliverablesLabel: "What we structure",
    deliverablesTitle: "A website should organize information, experience, and the next step.",
    deliverablesDescription: "TAG08 develops digital structures that organize information, content, navigation, and contact points so the brand can present its offer clearly and guide the visitor journey.",
    deliverables: [
      ["Information architecture", "Pages, sections, menus, and content organized to make information easier to find and the journey easier to follow."],
      ["Interface design", "Interfaces built with hierarchy, readability, responsiveness, and alignment with the brand identity."],
      ["Content and narrative", "Copy, calls to action, and content blocks structured to explain the company, offer, process, differentiators, and next steps clearly."],
      ["Technical development", "Web implementation focused on responsiveness, stability, technical organization, and navigation experience."]
    ],
    criteriaLabel: "Technical and strategic criteria",
    criteriaTitle: "What makes a web structure more reliable.",
    criteriaDescription: "A good website is more than appearance. It needs to organize information, work across devices, guide visitors, and support maintenance and future development after publication.",
    criteria: [
      ["Clear navigation", "Menus, sections, and paths organized to reduce effort and make information easier to find."],
      ["Content structure", "Copy, calls to action, and sections organized to present the company, offer, context, and next step."],
      ["Responsive design", "Interfaces prepared for different screen sizes while preserving readability, hierarchy, and navigation."],
      ["Organized technical foundation", "A structured implementation that supports stability, maintenance, and project evolution."],
      ["Continuity of use", "A structure prepared for adjustments, new pages, content, and future needs when included in the technical scope."],
      ["Publication support", "Delivery review and initial guidance to keep the structure coherent after publication, according to the agreed scope."]
    ],
    trustTitle: "Trust criteria",
    trustDescription: "A web structure should be understandable to visitors, consistent with the brand, and useful to the operation. The goal is to build a digital foundation that can be used, maintained, and developed responsibly.",
    trustBadge: "RELIABLE FOUNDATION // TAG08",
    workLabel: "Work system",
    workImageLabel: "Web development process",
    workStepsLabel: "ORGANIZED STEPS",
    workContextLabel: "CONTEXT, STRUCTURE, AND PUBLICATION",
    workTitle: "How we guide a web project.",
    workDescription: "TAG08 organizes web development into clear stages: understanding the context, information architecture, experience definition, development, review, and publication within the approved scope.",
    workSteps: [
      ["Understanding", "Reviewing the brand’s stage, structural goal, audience, required content, and touchpoints."],
      ["Structure", "Organizing pages, sections, navigation, messages, and next steps before development."],
      ["Design and development", "Creating the interface and technical implementation with attention to responsiveness, hierarchy, clarity, and stability."],
      ["Review and publication", "Validating content, making final adjustments, publishing, and providing continuity guidance within the agreed scope."]
    ],
    whatsappLabel: "Official WhatsApp",
    whatsappCta: "TALK TO TAG08",
    nextStep: "Next step",
    solutionsCta: "VIEW SOLUTIONS",
    faqBadge: "Web development questions",
    faqIntroTitle: "Before creating a website, understand what needs to be structured.",
    faqIntro: "A web project works best when the brand understands the role the site needs to play: introduce, explain, organize, support sales conversations, or sustain its own digital presence.",
    faq: [
      ["Does TAG08 only develop corporate websites?", "No. TAG08 can develop corporate websites, landing pages, service pages, digital catalogs, and other web structures according to the required purpose, content, and user journey."],
      ["Do I need all the content ready before we start?", "Not necessarily. Depending on the approved scope, the project can include information architecture, content block definition, and support in structuring the messages needed for the page."],
      ["Can the website support the commercial process?", "It can. A website can organize information, offers, questions, and contact paths to support commercial conversations, but sales or conversion are not automatic outcomes."],
      ["Does the project include responsive design for mobile?", "Yes. The interface is planned for different screen sizes while preserving readability, hierarchy, navigation, and access to information."],
      ["Can the website evolve after publication?", "Yes. Depending on the technical structure and scope, the site can receive new pages, content, integrations, or improvements as needs change."],
      ["How does TAG08 define the website scope?", "Scope is defined from the structure’s goal, the brand’s stage, page count, content, required integrations, and touchpoints."],
      ["What does an e-commerce Digital Unit involve?", "A Digital Unit connects the buying experience with the operation that supports it; e-commerce does not begin with technology alone. The work can include diagnosis, modeling, strategic validation, operational structuring, development, testing, activation, training, and follow-up. Depending on the business, readiness considers catalog, inventory, logistics, payments, commercial policies, service, and responsibilities. This assessment guides the conversation and scope; it is not an automatic diagnosis or a checklist visitors must complete."]
    ],
    valueLabel: "VALUE PROPOSITION",
    valueTitle: "What should the project make clear?",
    valueDescription: "The structure should clarify the page’s role, the visitor journey, and the expected next step.",
    contactLabel: "TALK TO TAG08",
    contactTitle: "Would you like to discuss your website?",
    contactDescription: "Talk with TAG08 to understand what needs to be structured, what belongs in scope, and which path makes sense for the project.",
    finalTitle: "Let’s understand which web structure your brand needs.",
    finalDescription: "Before proposing a structure, TAG08 considers the brand’s current stage, the visitor journey, the content required, and the role the website needs to play in the strategy.",
    finalCta: "PLAN MY WEBSITE",
    waMessage: "Hello, I would like to discuss a web development project with TAG08"
  },
  es: {
    badge: "Desarrollo web",
    heading: "Sitios web y estructuras digitales",
    headingAccent: "con dirección, claridad y una función comercial definida.",
    summary: "TAG08 desarrolla sitios web, experiencias de comercio electrónico y soluciones digitales específicas según el diagnóstico, el modelado, la validación y la estructura necesarios. En comercio electrónico, la preparación operativa también forma parte de la decisión.",
    heroCta: "HABLAR CON TAG08",
    heroSystem: "Sistema web TAG08",
    heroStructure: "Estructura digital con dirección y propósito",
    heroSignals: "CLARIDAD // CREDIBILIDAD",
    heroAlt: "Planificación y desarrollo de una estructura web",
    heroValues: [
      ["Claridad", "Información organizada para facilitar la comprensión de la empresa y su oferta."],
      ["Credibilidad", "Presencia digital coherente con la identidad, el contenido y el momento de la marca."],
      ["Organización", "Páginas, navegación y contenidos estructurados con una función definida."],
      ["Apoyo comercial", "Canales de contacto y próximos pasos integrados en el recorrido del visitante."]
    ],
    mismatchLabel: "Señales de desalineación digital",
    mismatchTitle: "Cuando el sitio deja de ayudar a comprender la marca.",
    mismatchDescription: "Muchas empresas tienen un sitio web que todavía dificulta encontrar información sobre la marca, sus servicios o el siguiente paso. El contenido desactualizado, la navegación confusa, las páginas sin una función clara y una estructura que ya no acompaña al negocio son señales frecuentes de esta desalineación.",
    comparisonLabels: ["Lectura de la experiencia actual", "Base digital TAG08"],
    comparisonRows: [
      ["Información difícil de encontrar", "La arquitectura organiza la empresa, su oferta y los próximos pasos para reducir el esfuerzo de comprensión."],
      ["Un sitio que ya no acompaña al negocio", "La estructura digital se actualiza para reflejar el momento, los servicios y las prioridades actuales de la marca."],
      ["Páginas sin una función clara", "Cada página cumple un papel definido en el recorrido: presentar, explicar, orientar o facilitar el contacto."],
      ["Contenido desalineado", "Los textos, las imágenes y las llamadas siguen una lógica coherente de posicionamiento, información y experiencia."]
    ],
    deliverablesLabel: "Lo que estructuramos",
    deliverablesTitle: "Un sitio debe organizar información, experiencia y el siguiente paso.",
    deliverablesDescription: "TAG08 desarrolla estructuras digitales que organizan información, contenido, navegación y puntos de contacto para que la marca presente mejor su oferta y oriente el recorrido del visitante.",
    deliverables: [
      ["Arquitectura de información", "Páginas, secciones, menús y contenidos organizados para facilitar la búsqueda de información y un recorrido más comprensible."],
      ["Diseño de interfaz", "Interfaces construidas con jerarquía, legibilidad, adaptación a distintos dispositivos y coherencia con la identidad de marca."],
      ["Contenido y narrativa", "Textos, llamadas y bloques estructurados para explicar la empresa, la oferta, el proceso, los diferenciales y los próximos pasos con claridad."],
      ["Desarrollo técnico", "Implementación web con atención a la adaptación, estabilidad, organización técnica y experiencia de navegación."]
    ],
    criteriaLabel: "Criterios técnicos y estratégicos",
    criteriaTitle: "Qué hace más confiable una estructura web.",
    criteriaDescription: "Un buen sitio no depende solo de su apariencia. Necesita organizar información, funcionar en distintos dispositivos, orientar al visitante y permitir mantenimiento y evolución después de su publicación.",
    criteria: [
      ["Navegación clara", "Menús, secciones y recorridos organizados para reducir el esfuerzo y facilitar la búsqueda de información."],
      ["Estructura de contenido", "Textos, llamadas y bloques organizados para presentar la empresa, la oferta, el contexto y el siguiente paso."],
      ["Diseño adaptable", "Interfaces preparadas para distintos tamaños de pantalla, preservando legibilidad, jerarquía y navegación."],
      ["Base técnica organizada", "Una implementación estructurada que facilita la estabilidad, el mantenimiento y la evolución del proyecto."],
      ["Continuidad de uso", "Una estructura preparada para ajustes, nuevas páginas, contenidos y necesidades futuras cuando el alcance técnico lo contemple."],
      ["Acompañamiento de publicación", "Revisión de la entrega y orientación inicial para mantener la coherencia de la estructura después de publicar, según el alcance acordado."]
    ],
    trustTitle: "Criterios de confianza",
    trustDescription: "La estructura web debe ser comprensible para el visitante, coherente con la marca y útil para la operación. El objetivo es construir una base digital que pueda utilizarse, mantenerse y evolucionar con responsabilidad.",
    trustBadge: "BASE CONFIABLE // TAG08",
    workLabel: "Sistema de trabajo",
    workImageLabel: "Proceso de desarrollo web",
    workStepsLabel: "ETAPAS ORGANIZADAS",
    workContextLabel: "CONTEXTO, ESTRUCTURA Y PUBLICACIÓN",
    workTitle: "Cómo guiamos un proyecto web.",
    workDescription: "TAG08 organiza el desarrollo web en etapas claras: comprensión del contexto, arquitectura de información, definición de la experiencia, desarrollo, revisión y publicación según el alcance aprobado.",
    workSteps: [
      ["Comprensión", "Lectura del momento de la marca, el objetivo de la estructura, el público, los contenidos necesarios y los puntos de contacto."],
      ["Estructura", "Organización de páginas, secciones, navegación, mensajes y próximos pasos antes del desarrollo."],
      ["Diseño y desarrollo", "Creación de la interfaz e implementación técnica con atención a adaptación, jerarquía, claridad y estabilidad."],
      ["Revisión y publicación", "Validación de contenidos, ajustes finales, publicación y orientación para la continuidad según el alcance acordado."]
    ],
    whatsappLabel: "WhatsApp oficial",
    whatsappCta: "HABLAR CON TAG08",
    nextStep: "Siguiente paso",
    solutionsCta: "VER SOLUCIONES",
    faqBadge: "Dudas sobre desarrollo web",
    faqIntroTitle: "Antes de crear un sitio, entiende qué debe estructurarse.",
    faqIntro: "Un proyecto web funciona mejor cuando la marca entiende qué papel debe cumplir el sitio: presentar, explicar, organizar, apoyar la conversación comercial o sostener una presencia digital propia.",
    faq: [
      ["¿TAG08 desarrolla solo sitios institucionales?", "No. TAG08 puede desarrollar sitios institucionales, páginas de aterrizaje, páginas de servicios, catálogos digitales y otras estructuras web según la función necesaria, el contenido y el recorrido del usuario."],
      ["¿Necesito tener todo el contenido listo para empezar?", "No necesariamente. Según el alcance aprobado, el proyecto puede incluir la organización de la arquitectura de información, la definición de bloques de contenido y apoyo para estructurar los mensajes necesarios."],
      ["¿El sitio puede apoyar el proceso comercial?", "Puede hacerlo. El sitio puede organizar información, ofertas, dudas y vías de contacto para apoyar la conversación comercial, pero las ventas o conversiones no son un resultado automático."],
      ["¿El proyecto incluye adaptación para móviles?", "Sí. La interfaz se planifica para distintos tamaños de pantalla, preservando legibilidad, jerarquía, navegación y acceso a la información."],
      ["¿El sitio puede evolucionar después de publicarse?", "Sí. Según la estructura técnica y el alcance, el sitio puede recibir nuevas páginas, contenidos, integraciones o mejoras cuando surjan nuevas necesidades."],
      ["¿Cómo define TAG08 el alcance del sitio?", "El alcance parte del objetivo de la estructura, el momento de la marca, la cantidad de páginas, los contenidos, las integraciones necesarias y los puntos de contacto."],
      ["¿Qué implica una Unidad Digital de comercio electrónico?", "Una Unidad Digital integra la experiencia de compra con la operación que la sostiene; el comercio electrónico no empieza solo con tecnología. El trabajo puede incluir diagnóstico, modelado, validación estratégica, estructura operativa, desarrollo, pruebas, activación, capacitación y seguimiento. Según el negocio, la preparación considera catálogo, inventario, logística, pagos, políticas comerciales, atención y responsabilidades. Esta evaluación orienta la conversación y el alcance; no es un diagnóstico automático ni una lista previa para el visitante."]
    ],
    valueLabel: "PROPUESTA DE VALOR",
    valueTitle: "¿Qué debe dejar claro el proyecto?",
    valueDescription: "La estructura debe aclarar la función de la página, el recorrido del visitante y el siguiente paso esperado.",
    contactLabel: "HABLA CON TAG08",
    contactTitle: "¿Quieres conversar sobre tu sitio?",
    contactDescription: "Habla con TAG08 para entender qué debe estructurarse, qué forma parte del alcance y qué camino tiene sentido para el proyecto.",
    finalTitle: "Entendamos qué estructura web necesita tu marca.",
    finalDescription: "Antes de proponer una estructura, TAG08 considera el momento de la marca, el recorrido del visitante, los contenidos necesarios y la función que el sitio debe cumplir dentro de la estrategia.",
    finalCta: "PLANIFICAR MI SITIO",
    waMessage: "Hola, me gustaría conversar sobre un proyecto de desarrollo web con TAG08"
  }
} as const;

export default function DesenvolvimentoWeb({ onNavigate, locale = "pt" }: WebProps) {
  const copy = locale === "pt" ? null : WEB_COPY[locale];
  const faqItems = copy?.faq ?? [
    ["A TAG08 desenvolve apenas sites institucionais?", "Não. A TAG08 pode desenvolver sites institucionais, landing pages, páginas de serviço, catálogos digitais e outras estruturas web conforme a função necessária, o conteúdo e a jornada do usuário."],
    ["Preciso ter todo o conteúdo pronto antes de começar?", "Não necessariamente. O projeto pode incluir organização da arquitetura da informação, definição dos blocos de conteúdo e apoio na estruturação das mensagens necessárias à página, conforme o escopo aprovado."],
    ["O site considera o apoio ao comercial?", "Pode considerar. O site pode organizar informações, ofertas, dúvidas e caminhos de contato para apoiar a conversa comercial, mas não tratamos vendas ou conversão como resultado automático."],
    ["O projeto inclui responsividade e adaptação para celular?", "Sim. A interface é planejada para diferentes tamanhos de tela, preservando legibilidade, hierarquia, navegação e acesso às informações."],
    ["Depois da publicação, o site pode evoluir?", "Sim. Conforme a estrutura técnica e o escopo, o site pode receber novas páginas, conteúdos, integrações ou melhorias à medida que surgem novas necessidades."],
    ["Como a TAG08 define o escopo do site?", "O escopo é definido a partir do objetivo da estrutura, do momento da marca, da quantidade de páginas, dos conteúdos, das integrações necessárias e dos pontos de contato envolvidos."],
    ["O que envolve uma Unidade Digital de e-commerce?", "Uma Unidade Digital integra a experiência de compra à operação que a sustenta; o e-commerce não começa apenas pela tecnologia. A condução passa por diagnóstico, modelagem, validação estratégica, estruturação operacional, desenvolvimento, testes, ativação, treinamento e acompanhamento. Conforme o negócio, a prontidão considera catálogo, estoque, logística, pagamentos, políticas comerciais, atendimento e responsabilidades. Essa leitura orienta a conversa e o escopo; não representa diagnóstico automático nem exige um checklist prévio do visitante."]
  ] as const;
  const [activeFaq, setActiveFaq] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pb-20 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-[8%] left-[-15%] w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] bg-brand/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle floating 3D element in the background of user focus */}
      <Subtle3DCanvas aria-hidden="true" intensity={1.3} className="absolute right-[-8%] top-[5%] w-[480px] h-[480px] opacity-[0.35] mix-blend-screen hidden lg:block" />

      {/* SECTION 1 - HERO: proposta e contexto */}
      <section className="context-inverse tag08-contextual-section px-4 sm:px-6 md:px-8 py-12 sm:py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          {/* 1. Header Typography block (Ref Style: Expert guidance / tailored solution) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 lg:items-center text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta self-start">
                {copy?.badge ?? "Desenvolvimento Web"}
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter">
                {copy?.heading ?? "Sites e estruturas digitais"} <br />
                <span className="text-brand">{copy?.headingAccent ?? "com direção, clareza e função comercial."}</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-sm leading-relaxed font-sans font-medium">
                {copy?.summary ?? "A família Tecnologia contempla websites, e-commerce/unidade digital e soluções digitais específicas. A TAG08 desenvolve essas estruturas conforme diagnóstico, modelagem, validação e estruturação; em e-commerce, a prontidão operacional também faz parte da decisão."}
              </p>
            </div>
          </div>

          {/* 2. Panoramic Wide Banner Image with capsule neon overlay trigger wrapped in 3D perspective tilt container */}
          <ThreeDimensionalTilt className="rounded-3xl overflow-visible">
            <div className="relative rounded-3xl overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] group text-left h-full w-full">
              <Image
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1600"
                alt={copy?.heroAlt ?? "Planejamento e desenvolvimento de estrutura web"}
                fill
                priority
                sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1280px) calc(100vw - 4rem), 1152px"
                className="w-full h-full object-cover grayscale brightness-50 transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.01]"
                referrerPolicy="no-referrer"
              />
              {/* Elegant overlay masks */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />

              {/* Glowing neon action button floating inside face banner mimicking "Free Trial" anchor */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{ transform: "translateZ(45px)" }}>
                <TrackedOutboundLink
                  label="Falar com a TAG08"
                  surface="desenvolvimento-web-hero-cta"
                  href={buildBrazilWhatsAppUrl(encodeURIComponent(copy?.waMessage ?? "Olá, gostaria de conversar sobre um projeto de desenvolvimento web com a TAG08"))}
                  target="_blank"
                  rel="noreferrer"
                  className="group min-h-11 bg-brand-secondary text-black font-sans font-black text-sm uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] hover:bg-brand-dark active:scale-[0.98] transition-[background-color,transform] duration-200 border border-brand-secondary flex items-center gap-2 cursor-pointer z-20"
                >
                  <span>{copy?.heroCta ?? "FALAR COM A TAG08"}</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </TrackedOutboundLink>
              </div>

              {/* Absolute indicator tags on corners */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="tag08-meta text-xs text-brand-secondary tracking-widest block uppercase font-bold">{copy?.heroSystem ?? "Sistema web TAG08"}</span>
                  <p className="font-display font-black text-white text-sm tracking-tight leading-none">{copy?.heroStructure ?? "Estrutura digital com direção e função"}</p>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-xs text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>{copy?.heroSignals ?? "CLAREZA // CREDIBILIDADE"}</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* 3. High status core statistics row matching screenshot layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">{copy?.heroValues[0][0] ?? "Clareza"}</span>
              <span className="block text-zinc-300 tag08-meta text-sm uppercase tracking-widest leading-normal">{copy?.heroValues[0][1] ?? "Informação organizada para facilitar entendimento da empresa e da oferta."}</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">{copy?.heroValues[1][0] ?? "Credibilidade"}</span>
              <span className="block text-zinc-300 tag08-meta text-sm uppercase tracking-widest leading-normal">{copy?.heroValues[1][1] ?? "Presença digital coerente com a identidade, o conteúdo e o momento da marca."}</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">{copy?.heroValues[2][0] ?? "Organização"}</span>
              <span className="block text-zinc-300 tag08-meta text-sm uppercase tracking-widest leading-normal">{copy?.heroValues[2][1] ?? "Páginas, navegação e conteúdos estruturados com função definida."}</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">{copy?.heroValues[3][0] ?? "Apoio comercial"}</span>
              <span className="block text-zinc-300 tag08-meta text-sm uppercase tracking-widest leading-normal">{copy?.heroValues[3][1] ?? "Caminhos de contato e próximos passos integrados à jornada do visitante."}</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2 - PAIN DIAGNOSTIC: METHODOLOGY COMPARATIVE */}
      <div className="context-default">
      <section className="tag08-contextual-section px-4 sm:px-6 md:px-8 py-20 text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Comparativo: Site Bonito x Site Estratégico */}
          <div className="space-y-6">
            <span className="tag08-meta text-xs text-[color:var(--color-action-readable)] uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              {copy?.mismatchLabel ?? "Sinais de desalinhamento digital"}
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-[color:var(--color-content-primary)] tracking-tight">
              {copy?.mismatchTitle ?? "Quando o site deixa de ajudar a marca a ser entendida."}
            </h2>
            <p className="text-[color:var(--color-content-secondary)] text-sm font-sans leading-relaxed max-w-xl">
              {copy?.mismatchDescription ?? "Muitas empresas possuem um site, mas ainda dificultam a experiência de quem procura informações sobre a marca, os serviços ou o próximo passo. Conteúdo desatualizado, navegação confusa, páginas sem função definida e uma estrutura que não acompanha o negócio são sinais comuns desse desalinhamento."}
            </p>
          </div>

          <div className="border-y border-[color:var(--color-border-default)] overflow-hidden divide-y divide-[color:var(--color-border-default)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-5 tag08-meta text-xs text-[color:var(--color-content-secondary)] uppercase tracking-widest">
              <div>{copy?.comparisonLabels[0] ?? "Leitura da experiência atual"}</div>
              <div className="text-[color:var(--color-action-readable)]">{copy?.comparisonLabels[1] ?? "Base digital TAG08"}</div>
            </div>

            {(copy?.comparisonRows ?? [
              ["Informação difícil de encontrar", "A arquitetura organiza empresa, oferta e próximos passos para reduzir esforço de compreensão."],
              ["Site que não acompanha o negócio", "A estrutura digital é atualizada para refletir o momento, os serviços e as prioridades atuais da marca."],
              ["Páginas sem função clara", "Cada página é estruturada com um papel definido dentro da jornada: apresentar, explicar, orientar ou apoiar contato."],
              ["Conteúdo desalinhado", "Textos, imagens e chamadas seguem uma mesma lógica de posicionamento, informação e experiência."]
            ]).map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 sm:py-7 text-sm text-left">
                <div className="text-[color:var(--color-content-secondary)] font-sans flex gap-3">
                  <span aria-hidden="true" className="text-[color:var(--color-content-secondary)] font-sans font-bold shrink-0">–</span>
                  <span>{row[0]}</span>
                </div>
                <div className="text-[color:var(--color-content-primary)] font-sans flex gap-3 border-t md:border-t-0 border-[color:var(--color-border-default)] pt-4 md:pt-0">
                  <span aria-hidden="true" className="text-[color:var(--color-action-readable)] font-sans font-bold shrink-0">+</span>
                  <span>{row[1]}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 3 - entregas funcionais */}
      <section className="tag08-contextual-section px-4 sm:px-6 md:px-8 py-16">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-[color:var(--color-action-readable)] uppercase tracking-widest font-bold">{copy?.deliverablesLabel ?? "O que estruturamos"}</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[color:var(--color-content-primary)] tracking-tight">{copy?.deliverablesTitle ?? "Um site precisa organizar informação, experiência e próximo passo."}</h2>
            <p className="text-[color:var(--color-content-secondary)] text-sm font-medium">
              {copy?.deliverablesDescription ?? "A TAG08 desenvolve estruturas digitais que organizam informação, conteúdo, navegação e pontos de contato para que a marca consiga apresentar melhor sua oferta e orientar a jornada do visitante."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div data-its-hover-icon-interaction className="tag08-card bg-[color:var(--color-surface-default)] border border-[color:var(--color-border-default)] hover:border-[color:var(--color-border-strong)] duration-300 rounded-xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-lg bg-[color:var(--color-surface-subtle)] border border-[color:var(--color-border-default)] flex items-center justify-center">
                <ItsHoverActionIcon name="code" size={20} className="text-[color:var(--color-content-primary)]" />
              </div>
              <div className="space-y-1">
              <h3 className="text-[color:var(--color-content-primary)] font-display font-black text-sm">{copy?.deliverables[0][0] ?? "Arquitetura da informação"}</h3>
                <p className="text-[color:var(--color-content-secondary)] text-sm leading-relaxed font-medium">
                  {copy?.deliverables[0][1] ?? "Organização de páginas, seções, menus e conteúdos para facilitar a localização das informações e construir uma jornada mais compreensível."}
                </p>
              </div>
            </div>

            <div className="tag08-card bg-[color:var(--color-surface-default)] border border-[color:var(--color-border-default)] hover:border-[color:var(--color-border-strong)] duration-300 rounded-xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-lg bg-[color:var(--color-surface-subtle)] border border-[color:var(--color-border-default)] flex items-center justify-center">
                <LineChart className="w-5 h-5 text-[color:var(--color-content-primary)]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[color:var(--color-content-primary)] font-display font-black text-sm">{copy?.deliverables[1][0] ?? "Design de interface"}</h3>
                <p className="text-[color:var(--color-content-secondary)] text-sm leading-relaxed font-medium">
                  {copy?.deliverables[1][1] ?? <>Construção visual das interfaces com hierarquia, legibilidade, responsividade e coerência com a <a href="/servicos/branding-identidade" className="text-[color:var(--color-action-readable)] underline-offset-2 hover:underline">identidade da marca</a>.</>}
                </p>
              </div>
            </div>

            <div className="tag08-card bg-[color:var(--color-surface-default)] border border-[color:var(--color-border-default)] hover:border-[color:var(--color-border-strong)] duration-300 rounded-xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-lg bg-[color:var(--color-surface-subtle)] border border-[color:var(--color-border-default)] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-[color:var(--color-content-primary)]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[color:var(--color-content-primary)] font-display font-black text-sm">{copy?.deliverables[2][0] ?? "Conteúdo e narrativa"}</h3>
                <p className="text-[color:var(--color-content-secondary)] text-sm leading-relaxed font-medium">
                  {copy?.deliverables[2][1] ?? "Estruturação de textos, chamadas e blocos de conteúdo para explicar empresa, oferta, processo, diferenciais e próximos passos com maior clareza."}
                </p>
              </div>
            </div>

            <div className="tag08-card bg-[color:var(--color-surface-default)] border border-[color:var(--color-border-default)] hover:border-[color:var(--color-border-strong)] duration-300 rounded-xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-lg bg-[color:var(--color-surface-subtle)] border border-[color:var(--color-border-default)] flex items-center justify-center">
                <Layers className="w-5 h-5 text-[color:var(--color-content-primary)]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[color:var(--color-content-primary)] font-display font-black text-sm">{copy?.deliverables[3][0] ?? "Desenvolvimento técnico"}</h3>
                <p className="text-[color:var(--color-content-secondary)] text-sm leading-relaxed font-medium">
                  {copy?.deliverables[3][1] ?? "Implementação da estrutura web com atenção a responsividade, estabilidade, organização técnica e experiência de navegação."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - critérios técnicos e estratégicos */}
      <section className="tag08-contextual-section px-4 sm:px-6 md:px-8 py-16 border-b border-[color:var(--color-border-default)] text-left">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-[color:var(--color-action-readable)] uppercase tracking-widest font-bold">{copy?.criteriaLabel ?? "Critérios técnicos e estratégicos"}</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[color:var(--color-content-primary)] tracking-tight">{copy?.criteriaTitle ?? "O que torna uma estrutura web mais confiável."}</h2>
            <p className="text-[color:var(--color-content-secondary)] text-sm font-medium">
              {copy?.criteriaDescription ?? "Um bom site não depende apenas de aparência. Ele precisa organizar informação, funcionar em diferentes dispositivos, orientar o visitante e permitir manutenção e evolução depois da publicação."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border-t border-[color:var(--color-border-default)] pt-5 sm:pt-6 space-y-2">
              <h3 className="text-[color:var(--color-content-primary)] font-display font-black text-sm">{copy?.criteria[0][0] ?? "Clareza de navegação"}</h3>
              <p className="text-[color:var(--color-content-secondary)] text-sm leading-relaxed font-medium">
                {copy?.criteria[0][1] ?? "Menus, seções e caminhos organizados para reduzir esforço e facilitar a localização das informações."}
              </p>
            </div>

            <div className="border-t border-[color:var(--color-border-default)] pt-5 sm:pt-6 space-y-2">
              <h3 className="text-[color:var(--color-content-primary)] font-display font-black text-sm">{copy?.criteria[1][0] ?? "Estrutura de conteúdo"}</h3>
              <p className="text-[color:var(--color-content-secondary)] text-sm leading-relaxed font-medium">
                {copy?.criteria[1][1] ?? "Textos, chamadas e blocos organizados para apresentar empresa, oferta, contexto e próximo passo."}
              </p>
            </div>

            <div className="border-t border-[color:var(--color-border-default)] pt-5 sm:pt-6 space-y-2">
              <h3 className="text-[color:var(--color-content-primary)] font-display font-black text-sm">{copy?.criteria[2][0] ?? "Design responsivo"}</h3>
              <p className="text-[color:var(--color-content-secondary)] text-sm leading-relaxed font-medium">
                {copy?.criteria[2][1] ?? "Interfaces preparadas para diferentes tamanhos de tela, preservando legibilidade, hierarquia e navegação."}
              </p>
            </div>

            <div className="border-t border-[color:var(--color-border-default)] pt-5 sm:pt-6 space-y-2">
              <h3 className="text-[color:var(--color-content-primary)] font-display font-black text-sm">{copy?.criteria[3][0] ?? "Base técnica organizada"}</h3>
              <p className="text-[color:var(--color-content-secondary)] text-sm leading-relaxed font-medium">
                {copy?.criteria[3][1] ?? "Implementação estruturada para facilitar estabilidade, manutenção e evolução do projeto."}
              </p>
            </div>

            <div className="border-t border-[color:var(--color-border-default)] pt-5 sm:pt-6 space-y-2">
              <h3 className="text-[color:var(--color-content-primary)] font-display font-black text-sm">{copy?.criteria[4][0] ?? "Continuidade de uso"}</h3>
              <p className="text-[color:var(--color-content-secondary)] text-sm leading-relaxed font-medium">
                {copy?.criteria[4][1] ?? "Estrutura preparada para receber ajustes, novas páginas, conteúdos e necessidades futuras quando tecnicamente previsto."}
              </p>
            </div>

            <div className="border-t border-[color:var(--color-border-default)] pt-5 sm:pt-6 space-y-2">
              <h3 className="text-[color:var(--color-content-primary)] font-display font-black text-sm">{copy?.criteria[5][0] ?? "Acompanhamento de publicação"}</h3>
              <p className="text-[color:var(--color-content-secondary)] text-sm leading-relaxed font-medium">
                {copy?.criteria[5][1] ?? "Revisão da entrega e orientações iniciais para manter a estrutura coerente após a publicação, conforme o escopo contratado."}
              </p>
            </div>
          </div>
        </div>
      </section>
      <ServiceInsightsBridge
        servicePath="/servicos/desenvolvimento-web"
        onNavigate={onNavigate}
        locale={locale}
        variant="editorial-light"
        layout="two-at-tablet"
      />
      </div>

      {/* SECTION 5 - TRUST CORE BAR */}
      <section className="context-inverse tag08-contextual-section px-4 sm:px-6 md:px-8 py-10 border-b border-white/[0.04] bg-charcoal-900/40 text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-3xl">
            <h2 className="text-white font-display font-black text-sm tracking-tight">{copy?.trustTitle ?? "Critérios de confiança"}</h2>
            <p className="text-zinc-400 text-sm font-sans font-medium leading-relaxed">
              {copy?.trustDescription ?? "A estrutura web precisa ser compreensível para o visitante, coerente com a marca e funcional para a operação. O objetivo é construir uma base digital que possa ser usada, mantida e evoluída com responsabilidade."}
            </p>
          </div>
          <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest border border-brand-secondary/20 bg-brand-secondary/5 px-3.5 py-2 rounded-xl shrink-0 font-black">
            {copy?.trustBadge ?? "BASE CONFIÁVEL // TAG08"}
          </span>
        </div>
      </section>
      {/* SECTION - WORK SYSTEM */}
       <section className="context-brand tag08-contextual-section py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
         <div className="max-w-7xl mx-auto rounded-3xl bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center select-none">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[520px]">
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden" />
            <Image
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
              alt={copy?.heroAlt ?? "Profissional em ambiente de desenvolvimento web"}
              className="object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[15%] transition-transform duration-200 motion-safe:hover:scale-[1.02]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between items-start">
                <span className="tag08-meta text-xs text-black/55 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-black/10">
                  {copy?.workLabel ?? "Sistema de trabalho"}
                </span>
                <span className="font-sans text-xs text-black/45 tracking-wider">
                  TAG08
                </span>
              </div>
              <div className="space-y-1.5 opacity-25 select-none">
                 <div className="font-display font-extrabold text-3xl text-black/35 tracking-widest leading-none uppercase select-none">
                  {copy?.workImageLabel ?? "trabalho web"}
                </div>
                 <div className="font-display font-extrabold text-2xl text-black/20 tracking-widest leading-none uppercase select-none pl-6">
                  {copy?.workTitle ?? "processo claro"}
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-sans text-xs text-black/45 tracking-wider">
                  {copy?.workStepsLabel ?? "ETAPAS ORGANIZADAS"}
                </span>
                <span className="tag08-meta text-xs text-black/55 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-black/10">
                  {copy?.workContextLabel ?? "CONTEXTO, ESTRUTURA E PUBLICAÇÃO"}
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
                  {copy?.workLabel ?? "Sistema de trabalho"}
                </span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black leading-[0.9] tracking-tighter">
                {copy?.workTitle ?? "Como conduzimos um projeto web."}
              </h2>
              <p className="text-black/85 text-sm max-w-2xl leading-relaxed font-sans font-semibold">
                {copy?.workDescription ?? "A TAG08 organiza o desenvolvimento web em etapas claras: entendimento do contexto, arquitetura da informação, definição da experiência, desenvolvimento, revisão e publicação conforme o escopo aprovado."}
              </p>
            </div>

             <div className="bg-charcoal-900/98 border border-white/[0.08] p-6 sm:p-7 rounded-2xl space-y-6 max-w-2xl relative overflow-hidden text-left">
              <div aria-hidden="true" className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4 relative z-10">
                {(copy?.workSteps ?? [
                  {
                    title: "Entendimento",
                    text: "Leitura do momento da marca, objetivo da estrutura, público, conteúdos necessários e pontos de contato.",
                  },
                  {
                    title: "Estrutura",
                    text: "Organização de páginas, seções, navegação, mensagens e próximos passos antes do desenvolvimento.",
                  },
                  {
                    title: "Design e desenvolvimento",
                    text: "Criação da interface e implementação técnica com atenção a responsividade, hierarquia, clareza e estabilidade.",
                  },
                  {
                    title: "Revisão e publicação",
                    text: "Validação dos conteúdos, ajustes finais, publicação e orientações para continuidade conforme o escopo contratado.",
                  },
                ]).map((item) => (
                  <div key={item[0]} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                    <h3 className="text-white text-sm font-display font-bold tracking-tight flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
                      {item[0]}
                    </h3>
                    <p className="text-zinc-300 text-sm leading-relaxed font-sans">{item[1]}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2 relative z-10">
                <TrackedOutboundLink
                  label="WhatsApp oficial"
                  surface="desenvolvimento-web-contact-card"
                  href={buildBrazilWhatsAppUrl(encodeURIComponent(copy?.waMessage ?? "Olá, gostaria de solicitar um projeto de Desenvolvimento Web com a TAG08"))}
                  target="_blank"
                  rel="noreferrer"
                  className="block min-h-11 w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-xl py-3 px-4 transition-[background-color] duration-200 group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col text-left">
                      <span className="tag08-meta text-xs text-zinc-300 uppercase font-black tracking-wider leading-none">
                      {copy?.whatsappLabel ?? "WhatsApp oficial"}
                      </span>
                      <span className="text-white text-sm font-sans font-bold tracking-wider group-hover:text-brand transition-colors mt-0.5">
                        {copy?.heroCta ?? "FALAR COM A TAG08"}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5] bg-brand rounded-full p-0.5" />
                  </div>
                </TrackedOutboundLink>

                <button
                  type="button"
                  onClick={() => handleLinkClick("/servicos")}
                  className="min-h-11 w-full bg-black/10 hover:bg-black/15 border border-black/10 rounded-xl py-3 px-4 transition-[background-color] duration-200 group text-left active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col text-left">
                      <span className="tag08-meta text-xs text-black/80 uppercase font-black tracking-wider leading-none">
                        {copy?.nextStep ?? "Próximo passo"}
                      </span>
                      <span className="text-black text-sm font-sans font-bold tracking-wider mt-0.5">
                        {copy?.solutionsCta ?? "VER SOLUÇÕES"}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* SECTION - FAQ */}
      <section className="context-inverse tag08-contextual-section py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[160px] pointer-events-none" />

          <div className="max-w-7xl mx-auto rounded-3xl bg-charcoal-950 border border-white/[0.04] p-6 sm:p-10 lg:p-14 relative overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
                  {copy?.faqBadge ?? "Dúvidas sobre desenvolvimento web"}
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter">
                  {copy?.faqIntroTitle ?? "Antes de criar um site, entenda o que precisa ser estruturado."}
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed font-sans max-w-sm">
                  {copy?.faqIntro ?? "Um projeto web funciona melhor quando a marca entende qual papel o site precisa cumprir: apresentar, explicar, organizar, apoiar o comercial ou sustentar uma presença digital própria."}
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {faqItems.map((item, id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveFaq(id)}
                    aria-expanded={activeFaq === id}
                    aria-controls={`web-faq-panel-${id}`}
                    className={`w-full min-h-11 flex items-center justify-between p-4 rounded-xl border transition-[background-color,border-color,color,box-shadow] duration-200 text-left group cursor-pointer active:scale-[0.99] ${
                      activeFaq === id
                        ? "bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)]"
                        : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                    }`}
                  >
                    <span id={`web-faq-heading-${id}`} className="tag08-meta text-sm font-black uppercase tracking-wider flex items-center gap-3">
                      <span className={activeFaq === id ? "text-black" : "text-brand"}>
                        {String(id + 1).padStart(2, '0')}.
                      </span>
                      {item[0]}
                    </span>
                    <ArrowRight aria-hidden="true" className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                      activeFaq === id ? "text-black rotate-[-45deg] stroke-[2.5]" : "text-zinc-500"
                    }`} />
                  </button>
                ))}
              </div>
            </div>

              <div id={`web-faq-panel-${activeFaq}`} role="region" aria-labelledby={`web-faq-heading-${activeFaq}`} className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-white/[0.04] bg-charcoal-900">
              <Image
                fill
                sizes="(max-width: 1024px) 100vw, 34vw"
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
                alt={copy?.heroAlt ?? "TAG08 Web Design"}
                className="object-cover grayscale brightness-[0.22] contrast-[1.1] transition-opacity duration-200 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div aria-hidden="true" className="absolute top-6 left-6 z-10 pointer-events-none tag08-meta text-xs text-white/20 uppercase tracking-widest leading-none">
                SYS // STATIC_WEB
              </div>

              <div className="relative z-20 bg-charcoal-900/95 border border-white/[0.08] p-5 rounded-2xl space-y-3 text-left">
                <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black block">
                  {faqItems[activeFaq][0]}
                </span>

                <h3 className="text-white font-semibold text-sm leading-tight border-b border-white/5 pb-2">
                  {faqItems[activeFaq][0]}
                </h3>

                <p className="text-zinc-300 text-sm leading-relaxed font-sans font-medium">
                  {faqItems[activeFaq][1]}
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              <div className="bg-charcoal-900 border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-[border-color] duration-200 text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-zinc-300 uppercase tracking-widest block font-bold">{copy?.valueLabel ?? "PROPOSTA DE VALOR"}</span>
                  <h3 className="text-white font-semibold text-sm leading-snug">{copy?.valueTitle ?? "O que o projeto precisa deixar claro?"}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-sans">
                    {copy?.valueDescription ?? "A estrutura precisa deixar claro o papel da página, a jornada do visitante e o próximo passo esperado."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleLinkClick("/servicos")}
                  className="group min-h-11 flex items-center justify-between text-sm font-sans font-bold text-white hover:text-brand active:scale-[0.99] cursor-pointer select-none pt-2 border-t border-white/5 transition-colors duration-200"
                >
                  <span>{copy?.solutionsCta ?? "VER SOLUÇÕES"}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-charcoal-900 border border-brand/20 rounded-2xl p-5 hover:border-brand/40 transition-[border-color] duration-200 text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-brand uppercase tracking-widest block font-extrabold">{copy?.contactLabel ?? "FALE COM A TAG08"}</span>
                  <h3 className="text-white font-black text-sm leading-tight tracking-tight">{copy?.contactTitle ?? "Quer conversar sobre o seu site?"}</h3>
                  <p className="text-zinc-300 text-sm font-semibold leading-relaxed font-sans">
                    {copy?.contactDescription ?? "Converse com a TAG08 para entender o que precisa ser estruturado, o que entra no escopo e qual caminho faz sentido para o projeto."}
                  </p>
                </div>
                <TrackedOutboundLink
                  label="Falar com a TAG08"
                  surface="desenvolvimento-web-final-cta"
                  href={buildBrazilWhatsAppUrl(encodeURIComponent(copy?.waMessage ?? "Olá, gostaria de conversar sobre um projeto de desenvolvimento web com a TAG08"))}
                  target="_blank"
                  rel="noreferrer"
                  className="group min-h-11 flex items-center justify-between text-sm font-sans font-black text-brand select-none border-t border-white/5 pt-3 hover:translate-x-0.5 transition-[transform,color] duration-200"
                >
                      <span>{copy?.heroCta ?? "FALAR COM A TAG08"}</span>
                  <ArrowUpRight className="w-4 h-4 text-brand stroke-[2.5]" />
                </TrackedOutboundLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 - ACTION TRIGGER FOOTER */}
      <div className="context-default">
      <section className="tag08-contextual-section px-4 sm:px-6 md:px-8 py-24 sm:py-28 text-center border-y border-[color:var(--color-border-default)]">
        <div className="max-w-3xl mx-auto space-y-7">
          <h2 className="font-display font-black text-3xl sm:text-5xl text-[color:var(--color-content-primary)] leading-[0.95] tracking-tighter">
            {copy?.finalTitle ?? "Vamos entender qual estrutura web sua marca precisa?"}
          </h2>
          <p className="text-[color:var(--color-content-secondary)] text-sm max-w-xl mx-auto leading-relaxed">
            {copy?.finalDescription ?? "Antes de propor uma estrutura, a TAG08 entende o momento da marca, a jornada do usuário, os conteúdos necessários e a função que o site precisa cumprir dentro da estratégia."}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleLinkClick("/contato")}
              className="group min-h-11 bg-brand text-black font-sans font-black text-sm uppercase tracking-widest py-4 px-8 rounded-xl shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.22)] hover:bg-brand-dark active:scale-[0.98] transition-[background-color,transform] duration-200 cursor-pointer flex items-center gap-2 mx-auto"
            >
              <span>{copy?.finalCta ?? "PLANEJAR MEU SITE"}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
