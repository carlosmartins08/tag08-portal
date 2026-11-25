import { useState } from "react";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { 
  Check, ArrowRight, ArrowUpRight, Camera, Video, Film, Sparkles, 
  Layers, Play, PlayCircle, Eye, Settings, Clock, ShieldCheck, 
  Smartphone, Monitor, ChevronDown, MessageSquare, Award, Tv,
  ListPlus, Plus, Info, HelpCircle
} from "../../../components/DooIcons";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import ResilientImage from "../../../components/ResilientImage";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import TrackedOutboundLink from "../../../components/TrackedOutboundLink";
import { buildBrazilWhatsAppUrl, TAG08_OFFICIAL_YOUTUBE_URL } from "../../../config/siteNetwork";
import { trackVideoEvent } from "../../../lib/analytics";
import { useSimulatorTracking } from "../../../lib/useSimulatorTracking";
import { useOfficialYouTubeVideos } from "../../../lib/useOfficialYouTubeVideos";
import type { RouteLocale } from "../../../config/routeRegistry";

interface Deliverable {
  id: string;
  name: string;
  category: "digital" | "event" | "inst" | "ads";
  desc: string;
}

const DELIVERABLES: Deliverable[] = [
  { id: "institucional", name: "Vídeos institucionais e de apresentação", category: "inst", desc: "Para apresentar a marca, equipe, história, método, serviço ou posicionamento de forma mais humana, visual e compreensível." },
  { id: "evento", name: "Cobertura de eventos e ações presenciais", category: "event", desc: "Para registrar encontros, lançamentos, inaugurações, treinamentos, palestras e ativações com olhar narrativo, pensando também no uso posterior do material." },
  { id: "redes", name: "Conteúdos para redes sociais", category: "digital", desc: "Para transformar falas, bastidores, rotinas, produtos, serviços e momentos da marca em vídeos curtos, cortes e publicações conectadas à linha editorial." },
  { id: "autoridade", name: "Depoimentos, entrevistas e autoridade", category: "digital", desc: "Para organizar falas de clientes, especialistas, lideranças ou equipe em conteúdos claros, objetivos e úteis para fortalecer confiança." },
  { id: "bastidores", name: "Bastidores, cultura e marca empregadora", category: "inst", desc: "Para mostrar pessoas, processos, ambiente, rotina e cultura de forma autêntica, sem transformar bastidor em encenação vazia." },
  { id: "apoio", name: "Materiais de apoio para site, campanhas e apresentações", category: "inst", desc: "Para gerar vídeos, chamadas, recortes e materiais visuais que apoiem páginas, propostas, apresentações comerciais e canais digitais." }
];

interface Formato {
  id: string;
  name: string;
  tag: string;
  desc: string;
  features: string[];
}

const FORMATOS: Formato[] = [
  {
    id: "institucional",
    name: "Registro institucional",
      tag: "APRESENTAÇÃO E POSICIONAMENTO",
    desc: "Para apresentar marca, equipe, história, método ou serviço com clareza.",
    features: [
      "Mensagem principal definida",
      "Roteiro objetivo",
      "Base para site e proposta",
      "Material para desdobrar cortes"
    ]
  },
  {
    id: "evento",
    name: "Cobertura de evento",
      tag: "REGISTRO E USO POSTERIOR",
    desc: "Para encontros, lançamentos, inaugurações, treinamentos e palestras que precisam gerar material útil depois.",
    features: [
      "Registro narrativo",
      "Falas e bastidores",
      "Cortes para comunicação posterior",
      "Material de apoio"
    ]
  },
  {
    id: "recorrente",
    name: "Conteúdo recorrente",
    tag: "LINHA EDITORIAL",
    desc: "Para transformar rotinas, bastidores e falas em materiais contínuos para canais digitais.",
    features: [
      "Captação reaproveitável",
      "Vídeos curtos",
      "Linha editorial",
      "Consistência de publicação"
    ]
  }
];

interface FAQCategory {
  id: number;
  title: string;
}

const faqCategories: FAQCategory[] = [
  { id: 0, title: "PLANEJAMENTO" },
  { id: 1, title: "FORMATO" },
  { id: 2, title: "EVENTOS" },
  { id: 3, title: "REAPROVEITAMENTO" },
  { id: 4, title: "CANAIS" }
];

const faqQuestions = [
  "A TAG08 faz apenas a gravação ou também ajuda no planejamento?",
  "Preciso saber exatamente qual vídeo quero produzir antes de falar com a TAG08?",
  "Vocês fazem cobertura de eventos?",
  "Uma gravação pode gerar vários conteúdos?",
  "A produção audiovisual serve só para redes sociais?"
];

const faqAnswers = [
  "A produção pode envolver planejamento, pauta, roteiro, direção, captação, edição e orientação de uso. Antes de gravar, entendemos o contexto da marca e a função que o material precisa cumprir.",
  "Não. A conversa inicial serve justamente para entender o momento da marca e indicar o formato mais coerente: institucional, evento, bastidores, depoimentos, conteúdo recorrente ou material de apoio.",
  "Sim. A cobertura pode registrar palestras, lançamentos, inaugurações, treinamentos, encontros, bastidores e momentos importantes. O material também pode ser pensado para uso posterior em redes, site, apresentações e comunicação institucional.",
  "Pode, desde que exista planejamento. Um mesmo material pode gerar vídeo principal, cortes, chamadas, bastidores, depoimentos, publicações e materiais de apoio, dependendo do escopo definido.",
  "Não. O material pode apoiar redes sociais, site, páginas comerciais, apresentações, campanhas, comunicação interna, branding, autoridade e relacionamento com clientes."
];

interface ProducaoProps {
  onNavigate: (page: string) => void;
  locale?: RouteLocale;
}

export const AUDIOVISUAL_COPY = {
  en: {
    heroBadge: "Audiovisual Production",
    heroTitle: "Audiovisual storytelling with",
    heroTitleAccent: "presence and a strategic purpose.",
    heroDescription: "TAG08 turns presence, speech, settings, behind-the-scenes moments and events into content with clarity, craft and a strategic purpose. Before filming, we understand the brand context, how the material will be used and which formats need to support communication, portfolio and relationships.",
    heroImageAlt: "TAG08 audiovisual production",
    talk: "TALK TO TAG08",
    plan: "PLAN MY AUDIOVISUAL PROJECT",
    heroCaption: "Storytelling, presence and directed content",
    heroMeta: "Capture, editing and distribution for ongoing use",
    benefits: ["Storytelling", "Clarity", "Application", "Continuity"],
    benefitDescriptions: ["Captures speech, behind-the-scenes moments and settings with editorial intent", "Organizes material for presentations, social media and websites", "Assets designed for consistent, recurring use", "Useful content that continues working after filming and editing"],
    section2Badge: "Signs of audiovisual misalignment",
    section2Title: "When a video exists but does not build presence.",
    section2Description: "Many brands film content, document events and publish videos, yet still struggle to turn that material into a clear, recurring and useful presence. The issue may be less about filming and more about the lack of storytelling, format, editing and a usage strategy.",
    signal: "SIGN",
    audienceBadge: "TAG08 USE CASES",
    audienceTitle: "For brands that need to turn presence into content.",
    audienceDescription: "TAG08 audiovisual production is suited to businesses, professionals and institutions with stories, experience, behind-the-scenes moments, events, people or knowledge to communicate, and a need to shape them into clear, well-edited formats for different channels.",
    youtubeLoading: "Loading official TAG08 videos…",
    youtubeUnavailable: "Official videos are temporarily unavailable. You can visit the official TAG08 channel.",
    openChannel: "OPEN OFFICIAL CHANNEL",
    plannerFormat: "1. CHOOSE THE FORMAT THAT FITS",
    plannerMaterials: "2. SELECT WHAT COULD BE PRODUCED",
    formatSummary: "AUDIOVISUAL FORMAT SUMMARY",
    evaluatedFormat: "FORMAT REVIEWED:",
    organizes: "WHAT THIS FORMAT HELPS ORGANIZE:",
    relatedMaterials: "RELATED MATERIALS",
    noMaterials: "No materials selected yet.",
    emptyMaterialsDescription: "Select at least one item to preview possible adaptations for this audiovisual format.",
    plannerCta: "DISCUSS MY AUDIOVISUAL FORMAT",
    materialLabel: "material",
    plannerCtaHint: "USE THIS SUMMARY AS A STARTING POINT FOR THE CONVERSATION",
    faqEyebrow: "FAQ // FIND ANSWERS",
    faqTitle: "QUESTIONS & ANSWERS",
    faqCategories: ["PLANNING", "FORMAT", "EVENTS", "REUSE", "CHANNELS"],
    faqQuestions: ["Does TAG08 only film, or can it also help with planning?", "Do I need to know exactly which video I want before contacting TAG08?", "Do you cover events?", "Can one shoot produce several pieces of content?", "Is audiovisual production only for social media?"],
    faqAnswers: ["Production may include planning, topics, scripting, direction, filming, editing and usage guidance. Before filming, we understand the brand context and the role the material needs to serve.", "No. The first conversation helps us understand the brand's situation and recommend a suitable format: institutional, event, behind-the-scenes, testimonials, recurring content or support material.", "Yes. Coverage can document talks, launches, openings, training sessions, meetings, behind-the-scenes moments and other important events. The material can also be planned for later use on social media, websites, presentations and institutional communications.", "It can, when planned. The same footage may produce a main video, short cuts, announcements, behind-the-scenes content, testimonials, posts and support materials, depending on the agreed scope.", "No. Content may support social media, websites, commercial pages, presentations, campaigns, internal communication, branding, authority and customer relationships."],
    servicesFormats: "SERVICES & FORMATS",
    pageCta: "TALK ABOUT MY AUDIOVISUAL PROJECT",
    deliverables: [
      { name: "Institutional and introduction videos", desc: "To present a brand, team, story, method, service or positioning in a more human, visual and clear way." },
      { name: "Event and in-person activity coverage", desc: "To document meetings, launches, openings, training, talks and activations with a narrative perspective and future use in mind." },
      { name: "Social media content", desc: "To turn speech, behind-the-scenes moments, routines, products, services and brand moments into short videos, edits and posts connected to the editorial direction." },
      { name: "Testimonials, interviews and expertise", desc: "To shape contributions from clients, specialists, leaders or teams into clear, useful content that supports trust." },
      { name: "Behind the scenes, culture and employer brand", desc: "To show people, processes, environment, routines and culture authentically, without turning behind-the-scenes content into empty staging." },
      { name: "Support material for websites, campaigns and presentations", desc: "To create videos, calls to action, edits and visual material that support pages, proposals, sales presentations and digital channels." }
    ],
    formats: [
      { id: "institucional", name: "Institutional profile", tag: "INTRODUCTION & POSITIONING", desc: "To present a brand, team, story, method or service clearly.", features: ["Defined key message", "Focused script", "Foundation for website and proposal", "Material for creating short edits"] },
      { id: "evento", name: "Event coverage", tag: "DOCUMENTATION & FUTURE USE", desc: "For meetings, launches, openings, training and talks that should produce useful material afterwards.", features: ["Narrative coverage", "Interviews and behind-the-scenes", "Edits for later communication", "Support material"] },
      { id: "recorrente", name: "Recurring content", tag: "EDITORIAL DIRECTION", desc: "To turn routines, behind-the-scenes moments and speech into ongoing material for digital channels.", features: ["Reusable filming", "Short videos", "Editorial direction", "Consistent publishing"] }
    ],
    plannerCtaMessage: "Hello TAG08! I would like to understand which audiovisual format best fits my brand right now.",
    problemCards: [
      { title: "Videos without a clear purpose", desc: "The content gets filmed, but it is unclear whether it should introduce the brand, educate an audience, document a moment, support sales or build expertise." },
      { title: "Underused behind-the-scenes material", desc: "Events, processes, customer service, teams and routines create valuable material, but it often is not shaped into useful brand content." },
      { title: "Speech without a narrative", desc: "Specialists and leaders have knowledge to share, but direction helps make videos clear, focused and reusable." },
      { title: "Content without continuity", desc: "The brand films from time to time without building a recurring audiovisual presence connected to its editorial direction." },
      { title: "Material that is not reused", desc: "A long video, event coverage or shoot can produce edits, announcements, behind-the-scenes content, posts and support material when planned." }
    ],
    audienceCards: [
      { title: "Businesses with relevant routines, teams and behind-the-scenes work", desc: "Businesses have processes, customer service, delivery, culture or operations happening every day, but have not yet turned that routine into clear content." },
      { title: "Professionals and specialists who need to communicate expertise", desc: "People know a subject, serve clients or lead a team, and need direction to turn knowledge and experience into focused videos." },
      { title: "Events that deserve strategic documentation", desc: "Meetings, launches, openings, training, talks and in-person activities should become useful material for later communication, not just a memory." },
      { title: "Brands that need content for social media, websites and campaigns", desc: "Businesses need videos, edits, behind-the-scenes material, testimonials and calls to action connected to their editorial direction and channels." },
      { title: "Projects that need an institutional story", desc: "Initiatives need to present their story, purpose, method, team, service or change in a more human, visual and clear way." }
    ],
    frontsTitle: "Audiovisual work with a clear purpose.",
    frontsDescription: "Production can take different forms, but every deliverable should answer a real brand need: introduce, document, explain, connect, educate or consistently support channels.",
    frontsBadge: "AUDIOVISUAL WORK // TAG08",
    frontLabel: "WORKSTREAM",
    possibleFormats: "POSSIBLE FORMATS:",
    fronts: [
      { title: "Institutional and introduction videos", desc: "Present the brand, team, story, structure, method, service or positioning in a more human, visual and clear way.", list: ["Brand introduction", "Team and structure", "Story and method", "Service and positioning", "Website and proposal material"] },
      { title: "Event and in-person activity coverage", desc: "Document meetings, launches, openings, training, talks and activations with a narrative perspective and future use in mind.", list: ["Meeting coverage", "Launches and openings", "Training and talks", "Activations and in-person events", "Material for later communication"] },
      { title: "Social media content", desc: "Turn speech, behind-the-scenes moments, routines, products, services and brand moments into short videos and posts connected to the editorial direction.", list: ["Short videos", "Edited speech clips", "Behind-the-scenes and routines", "Products and services", "Posts connected to editorial direction"] },
      { title: "Testimonials, interviews and expertise", desc: "Shape contributions from clients, specialists, leaders and teams into clear, useful content that supports trust.", list: ["Guided testimonials", "Focused interviews", "Specialist perspectives", "Leaders and teams", "Content that supports trust"] },
      { title: "Behind the scenes, culture and employer brand", desc: "Show people, processes, environment, routines and culture authentically, without staging empty behind-the-scenes content.", list: ["People and processes", "Environment and routines", "Everyday culture", "Employer brand", "Authentic behind-the-scenes"] },
      { title: "Support material for websites, campaigns and presentations", desc: "Create videos, calls to action, edits and visual material that support pages, proposals, sales presentations and digital channels.", list: ["Videos for pages", "Calls to action and edits", "Supporting visual material", "Sales proposals and presentations", "Brand digital channels"] }
    ],
    materialCategory: { digital: "digital", event: "event", inst: "institutional", ads: "campaign" },
    recentHeading: "Recent videos published on the channel.",
    recentDescription: "These are the latest videos from TAG08's official channel. They show behind-the-scenes moments, production, positioning and published work that help illustrate what audiovisual content can do.",
    recentBadge: "RECENT CONTENT // TAG08",
    videoPublished: "Published on channel",
    watch: "Watch",
    plannerBadge: "AUDIOVISUAL FORMAT DIAGNOSIS",
    plannerTitle: "Find the type of content that fits your situation.",
    plannerDescription: "Use your brand's context to identify whether it makes more sense to document, introduce, explain, reuse or consistently support your channels.",
    videoLinkLabel: "Watch {title} on TAG08's official YouTube channel",
    ctaImageAlt: "TAG08 audiovisual production support team",
    heroWhatsAppMessage: "Hello, I would like to discuss audiovisual production for my brand.",
    finalWhatsAppMessage: "Hello, I would like to understand which audiovisual format best fits my brand right now.",
    linkToServices: "VIEW SERVICES",
    serviceCardTitle: "Planning and clarity",
    serviceCardDescription: "The process begins by understanding the brand context, the role of the material and how it will be used after filming.",
    consultationBadge: "CONSULTATIVE CONVERSATION",
    consultationTitle: "Would you like to discuss your audiovisual project?",
    consultationDescription: "No preset package. We first understand the context, objective and intended use of the material.",
    methodologyBadge: "PRODUCTION METHOD // TAG08",
    methodologyTitle: "A process considered before, during and after filming.",
    methodologyDescription: "Audiovisual production does not begin on filming day. We first understand the brand context, define the content's purpose, organize suitable formats and plan how the material may be used afterwards.",
    processActive: "ACTIVE PROCESS",
    processSteps: [
      { tag: "UNDERSTANDING THE CONTEXT", title: "Understanding the context", list: ["We start by understanding the brand, its current situation, channels, audience and the role the audiovisual content needs to serve.", "We map what needs to be communicated clearly and what should provide a foundation for the next steps.", "We organize what already exists, what is missing and what can be reused.", "We align expectations to reduce noise and guide production with care.", "We define the starting point before making filming decisions."] },
      { tag: "STORY AND FORMAT", title: "Defining the story and formats", list: ["We organize priority messages and choose formats that suit the intended use.", "We determine whether the material should support an introduction, documentation, social media, a website, campaigns or institutional communication.", "We shape the story so the content has direction, not just images.", "We adapt each deliverable to the channel where it will be used.", "We create a clear foundation for filming."] },
      { tag: "FILMING, EDITING AND USE", title: "Directed filming, editing and delivery", list: ["We define the script, topics, scenes, talking points, filming approach, recording priorities and required materials.", "During filming, we guide the process to capture speech, settings, behind-the-scenes moments, details and key moments with clarity and intent.", "We edit, structure and adapt the footage into pieces aligned with the story, channels and communication goals.", "Alongside the final files, we explain how the material can support social media, websites, presentations, campaigns or institutional communication.", "We close with guidance on use and reuse."] }
    ],
    scopeBadge: "INCLUSIONS & ADD-ONS // TAG08",
    scopeTitle: "The scope should support how the material will be used.",
    scopeDescription: "A production may include different deliverables depending on the brand's goals, channels and current needs. The key is to define what must be filmed, edited and organized so the content remains useful after filming.",
    includedBadge: "SUPPORT MATERIAL // DEFINED SCOPE",
    includedFootnote: "SCOPE DEFINED BY REAL USE",
    included: [
      { title: "Main filming", desc: "Recording the speech, settings, scenes, behind-the-scenes moments, details and key moments needed to build the story." },
      { title: "Editing and finishing", desc: "Organizing the content into clear videos with pacing, cuts, visual adjustments, treated audio and a finish aligned with the brand identity." },
      { title: "Edits and adaptations", desc: "Creating shorter versions, calls to action, cuts and derivative materials for social media, websites, presentations or institutional communication." },
      { title: "Script, topics and direction", desc: "Support in deciding what should be said, recorded and prioritized so filming has more clarity and less improvisation." },
      { title: "Behind-the-scenes coverage", desc: "Additional recording of the team, setting, preparation, routine and details that help bring the brand closer to its audience." }
    ],
    addOnsBadge: "POSSIBLE ADD-ONS // DEFINED BY SCOPE",
    addOns: [
      { title: "Delivery and usage guidance", desc: "Guidance on how to use the material across brand channels, in line with context, editorial direction and communication goals." },
      { title: "Support material for websites and presentations", desc: "Videos, calls to action and edits that complement pages, proposals and sales presentations." },
      { title: "Additional behind-the-scenes coverage", desc: "Extra recording of the team, preparation, routine and setting when it supports the final material." },
      { title: "Additional filming planned in advance", desc: "Extra footage defined in the scope when there is a real need to expand the story or future use." },
      { title: "Adaptations for brand channels", desc: "Versions and edits organized to support institutional, social or commercial communication." }
    ],
    scopeFootnote: "ITEMS DEFINED ACCORDING TO SCOPE",
    synergyBadge: "INTEGRATION ACROSS SERVICES // TAG08",
    synergyTitle: "Audiovisual content does not have to stand alone.",
    synergyDescription: "A well-planned production can support different areas of communication: social media, websites, branding, sales presentations, campaigns, relationships and official brand channels such as YouTube, Vimeo, Pinterest, Google Business Profile and WhatsApp, when appropriate. Its value comes from planning how the material will be used after filming.",
    synergies: [
      { title: "Social media", desc: "Videos, edits, behind-the-scenes moments, calls to action and testimonials can support the editorial direction with greater presence, clarity and continuity.", cta: "Social Media Management" },
      { title: "Websites and commercial pages", desc: "Audiovisual material can introduce the brand, explain services, make pages more human and support decisions with more context.", cta: "Web Development" },
      { title: "Branding and positioning", desc: "Production can make identity, tone of voice, institutional story, culture and brand perception more tangible.", cta: "Branding & Identity" },
      { title: "Sales processes and relationships", desc: "Testimonials, presentations, institutional records and explanatory videos can support sales conversations without replacing consultative diagnosis.", cta: "Process Activation" }
    ],
    synergyLabel: "SYNERGY",
    finalConversation: "CONSULTATIVE CONVERSATION",
    finalTitle: "Let's find the production that fits your current needs.",
    finalDescription: "Tell us what you need to communicate, document or turn into content. We can then assess the most suitable format: institutional, event, behind-the-scenes, testimonials, recurring content or support material for digital channels.",
    finalContactLabel: "DISCUSS MY AUDIOVISUAL PROJECT",
    startConversation: "START A CONVERSATION",
    nextStep: "NEXT STEP",
    visualContentLabel: "content_with_purpose_"
  },
  es: {
    heroBadge: "Producción audiovisual",
    heroTitle: "Narrativa audiovisual con",
    heroTitleAccent: "presencia y propósito estratégico.",
    heroDescription: "TAG08 transforma presencia, discurso, espacios, momentos detrás de cámaras y eventos en contenido con claridad, cuidado y propósito estratégico. Antes de grabar, entendemos el contexto de la marca, los usos del material y los formatos que deben apoyar la comunicación, el portafolio y las relaciones.",
    heroImageAlt: "Producción audiovisual de TAG08",
    talk: "HABLAR CON TAG08",
    plan: "PLANIFICAR MI PROYECTO AUDIOVISUAL",
    heroCaption: "Narrativa, presencia y contenido con dirección",
    heroMeta: "Grabación, edición y distribución para uso continuo",
    benefits: ["Narrativa", "Claridad", "Aplicación", "Continuidad"],
    benefitDescriptions: ["Capta discursos, momentos detrás de cámaras y espacios con intención editorial", "Organiza el material para apoyar presentaciones, redes y sitios web", "Piezas pensadas para un uso recurrente y coherente", "Contenido útil después de la grabación y la edición"],
    section2Badge: "Señales de desalineación audiovisual",
    section2Title: "Cuando existe el video, pero no construye presencia.",
    section2Description: "Muchas marcas graban contenido, registran eventos y publican videos, pero todavía no logran convertir esos materiales en una presencia clara, recurrente y útil. El problema puede estar menos en la grabación y más en la falta de narrativa, formato, edición y estrategia de uso.",
    signal: "SEÑAL",
    audienceBadge: "CONTEXTOS DE APLICACIÓN // TAG08",
    audienceTitle: "Para marcas que necesitan convertir presencia en contenido.",
    audienceDescription: "La producción audiovisual de TAG08 tiene sentido para negocios, profesionales e instituciones que ya tienen historias, experiencias, momentos detrás de cámaras, eventos, personas o conocimientos para comunicar, pero necesitan organizarlos en formatos claros, bien editados y útiles para distintos canales.",
    youtubeLoading: "Cargando videos oficiales de TAG08…",
    youtubeUnavailable: "Los videos oficiales no están disponibles temporalmente. Puedes visitar el canal oficial de TAG08.",
    openChannel: "ABRIR CANAL OFICIAL",
    plannerFormat: "1. ELIGE EL FORMATO MÁS ADECUADO",
    plannerMaterials: "2. SELECCIONA LO QUE SE PUEDE PRODUCIR",
    formatSummary: "RESUMEN DEL FORMATO AUDIOVISUAL",
    evaluatedFormat: "FORMATO EVALUADO:",
    organizes: "QUÉ AYUDA A ORGANIZAR ESTE FORMATO:",
    relatedMaterials: "MATERIALES RELACIONADOS",
    noMaterials: "Todavía no seleccionaste materiales.",
    emptyMaterialsDescription: "Selecciona al menos un elemento para ver posibles adaptaciones de este formato audiovisual.",
    plannerCta: "CONVERSAR SOBRE MI FORMATO AUDIOVISUAL",
    materialLabel: "material",
    plannerCtaHint: "USA ESTE RESUMEN COMO PUNTO DE PARTIDA PARA LA CONVERSACIÓN",
    faqEyebrow: "FAQ // ENCUENTRA RESPUESTAS",
    faqTitle: "PREGUNTAS Y RESPUESTAS",
    faqCategories: ["PLANIFICACIÓN", "FORMATO", "EVENTOS", "REUTILIZACIÓN", "CANALES"],
    faqQuestions: ["¿TAG08 solo graba o también ayuda con la planificación?", "¿Necesito saber exactamente qué video quiero producir antes de hablar con TAG08?", "¿Realizan cobertura de eventos?", "¿Una grabación puede generar varios contenidos?", "¿La producción audiovisual sirve solo para redes sociales?"],
    faqAnswers: ["La producción puede incluir planificación, temas, guion, dirección, grabación, edición y orientación de uso. Antes de grabar, entendemos el contexto de la marca y la función que debe cumplir el material.", "No. La conversación inicial sirve para entender el momento de la marca e indicar un formato coherente: institucional, evento, detrás de cámaras, testimonios, contenido recurrente o material de apoyo.", "Sí. La cobertura puede registrar charlas, lanzamientos, inauguraciones, capacitaciones, encuentros, momentos detrás de cámaras y otros eventos importantes. El material también puede planificarse para su uso posterior en redes, sitios web, presentaciones y comunicación institucional.", "Sí, si existe planificación. Un mismo material puede generar un video principal, cortes, anuncios, contenido detrás de cámaras, testimonios, publicaciones y materiales de apoyo, según el alcance definido.", "No. El material puede apoyar redes sociales, sitios web, páginas comerciales, presentaciones, campañas, comunicación interna, branding, autoridad y relaciones con clientes."],
    servicesFormats: "SERVICIOS Y FORMATOS",
    pageCta: "HABLAR SOBRE MI PROYECTO AUDIOVISUAL"
    ,deliverables: [
      { name: "Videos institucionales y de presentación", desc: "Para presentar la marca, el equipo, la historia, el método, el servicio o el posicionamiento de forma más humana, visual y clara." },
      { name: "Cobertura de eventos y acciones presenciales", desc: "Para registrar encuentros, lanzamientos, inauguraciones, capacitaciones, charlas y activaciones con mirada narrativa y pensando también en el uso posterior." },
      { name: "Contenido para redes sociales", desc: "Para convertir discursos, momentos detrás de cámaras, rutinas, productos, servicios y momentos de marca en videos cortos, cortes y publicaciones conectadas con la línea editorial." },
      { name: "Testimonios, entrevistas y autoridad", desc: "Para organizar aportes de clientes, especialistas, líderes o equipos en contenidos claros y útiles que fortalezcan la confianza." },
      { name: "Detrás de cámaras, cultura y marca empleadora", desc: "Para mostrar personas, procesos, entorno, rutinas y cultura de forma auténtica, sin convertir lo que ocurre detrás de cámaras en una puesta en escena vacía." },
      { name: "Material de apoyo para sitios, campañas y presentaciones", desc: "Para crear videos, llamadas, cortes y materiales visuales que apoyen páginas, propuestas, presentaciones comerciales y canales digitales." }
    ],
    formats: [
      { id: "institucional", name: "Registro institucional", tag: "PRESENTACIÓN Y POSICIONAMIENTO", desc: "Para presentar con claridad la marca, el equipo, la historia, el método o el servicio.", features: ["Mensaje principal definido", "Guion conciso", "Base para sitio y propuesta", "Material para crear cortes"] },
      { id: "evento", name: "Cobertura de eventos", tag: "REGISTRO Y USO POSTERIOR", desc: "Para encuentros, lanzamientos, inauguraciones, capacitaciones y charlas que deben generar material útil después.", features: ["Registro narrativo", "Discursos y detrás de cámaras", "Cortes para comunicación posterior", "Material de apoyo"] },
      { id: "recorrente", name: "Contenido recurrente", tag: "LÍNEA EDITORIAL", desc: "Para convertir rutinas, momentos detrás de cámaras y discursos en materiales continuos para canales digitales.", features: ["Grabación reutilizable", "Videos cortos", "Línea editorial", "Constancia de publicación"] }
    ],
    plannerCtaMessage: "Hola TAG08. Quiero entender qué formato audiovisual tiene más sentido para el momento actual de mi marca.",
    problemCards: [
      { title: "Videos sin una función clara", desc: "Se graba el contenido, pero no queda claro si debe presentar la marca, educar al público, registrar un momento, apoyar ventas o fortalecer autoridad." },
      { title: "Momentos detrás de cámaras poco aprovechados", desc: "Eventos, procesos, atención, equipo y rutinas generan material valioso, pero a menudo no se convierten en contenido útil para la marca." },
      { title: "Discursos sin narrativa", desc: "Especialistas y líderes tienen conocimientos para compartir, pero una dirección ayuda a que los videos sean claros, concretos y reutilizables." },
      { title: "Contenido sin continuidad", desc: "La marca graba de vez en cuando, pero no construye una presencia audiovisual recurrente conectada con su línea editorial." },
      { title: "Material que no se reutiliza", desc: "Un video largo, una cobertura o una grabación pueden generar cortes, anuncios, momentos detrás de cámaras, publicaciones y materiales de apoyo si se planifican." }
    ],
    audienceCards: [
      { title: "Empresas con rutinas, equipos y momentos relevantes detrás de cámaras", desc: "Los negocios tienen procesos, atención, entregas, cultura u operaciones diarias, pero aún no convierten esa rutina en contenido claro." },
      { title: "Profesionales y especialistas que necesitan comunicar su autoridad", desc: "Personas que dominan un tema, atienden clientes o lideran un área y necesitan dirección para convertir experiencia y conocimiento en videos concretos." },
      { title: "Eventos que merecen un registro estratégico", desc: "Encuentros, lanzamientos, inauguraciones, capacitaciones, charlas y acciones presenciales deben convertirse en material útil para la comunicación posterior, no solo en un recuerdo." },
      { title: "Marcas que necesitan contenido para redes, sitios y campañas", desc: "Los negocios necesitan videos, cortes, momentos detrás de cámaras, testimonios y llamadas conectados con la línea editorial y los canales de la marca." },
      { title: "Proyectos que necesitan una narrativa institucional", desc: "Iniciativas que necesitan presentar su historia, propósito, método, equipo, servicio o cambio de forma más humana, visual y clara." }
    ],
    frontsTitle: "Frentes audiovisuales con una función clara.",
    frontsDescription: "La producción puede adoptar distintos formatos, pero cada entrega debe responder a una necesidad concreta de la marca: presentar, registrar, explicar, acercar, educar o apoyar los canales con constancia.",
    frontsBadge: "FORMATOS AUDIOVISUALES // TAG08",
    frontLabel: "FRENTE",
    possibleFormats: "FORMATOS POSIBLES:",
    fronts: [
      { title: "Videos institucionales y de presentación", desc: "Presentar la marca, el equipo, la historia, la estructura, el método, el servicio o el posicionamiento de forma más humana, visual y clara.", list: ["Presentación de la marca", "Equipo y estructura", "Historia y método", "Servicio y posicionamiento", "Material para sitios y propuestas"] },
      { title: "Cobertura de eventos y acciones presenciales", desc: "Registrar encuentros, lanzamientos, inauguraciones, capacitaciones, charlas y activaciones con mirada narrativa y pensando también en el uso posterior.", list: ["Registro de encuentros", "Lanzamientos e inauguraciones", "Capacitaciones y charlas", "Activaciones y acciones presenciales", "Material para comunicación posterior"] },
      { title: "Contenido para redes sociales", desc: "Convertir discursos, momentos detrás de cámaras, rutinas, productos, servicios y momentos de marca en videos cortos y publicaciones conectadas con la línea editorial.", list: ["Videos cortos", "Cortes de discursos", "Momentos detrás de cámaras y rutinas", "Productos y servicios", "Publicaciones conectadas con la línea editorial"] },
      { title: "Testimonios, entrevistas y autoridad", desc: "Organizar discursos de clientes, especialistas, líderes o equipos en contenidos claros y útiles que fortalezcan la confianza.", list: ["Testimonios guiados", "Entrevistas concretas", "Discursos de especialistas", "Liderazgo y equipo", "Contenido para fortalecer la confianza"] },
      { title: "Detrás de cámaras, cultura y marca empleadora", desc: "Mostrar personas, procesos, entorno, rutinas y cultura de forma auténtica, sin convertir el detrás de cámaras en una puesta en escena vacía.", list: ["Personas y procesos", "Entorno y rutinas", "Cultura cotidiana", "Marca empleadora", "Momentos auténticos detrás de cámaras"] },
      { title: "Material de apoyo para sitios, campañas y presentaciones", desc: "Crear videos, llamadas, cortes y materiales visuales que apoyen páginas, propuestas, presentaciones comerciales y canales digitales.", list: ["Videos para páginas", "Llamadas y cortes", "Material visual de apoyo", "Propuestas y presentaciones comerciales", "Canales digitales de la marca"] }
    ],
    materialCategory: { digital: "digital", event: "evento", inst: "institucional", ads: "campaña" },
    recentHeading: "Videos recientes publicados en el canal.",
    recentDescription: "Estos son los videos más recientes del canal oficial de TAG08. Muestran momentos detrás de cámaras, producción, posicionamiento y trabajos publicados que ayudan a entender qué puede generar el contenido audiovisual.",
    recentBadge: "CONTENIDO RECIENTE // TAG08",
    videoPublished: "Publicado en el canal",
    watch: "Ver",
    plannerBadge: "DIAGNÓSTICO DE FORMATO AUDIOVISUAL",
    plannerTitle: "Descubre qué tipo de contenido encaja con tu momento.",
    plannerDescription: "Responde desde el contexto de tu marca para identificar si conviene más registrar, presentar, explicar, reutilizar o alimentar los canales con constancia.",
    videoLinkLabel: "Ver {title} en el canal oficial de YouTube de TAG08",
    ctaImageAlt: "Equipo de apoyo a la producción audiovisual de TAG08",
    heroWhatsAppMessage: "Hola TAG08. Quiero conversar sobre una producción audiovisual para mi marca.",
    finalWhatsAppMessage: "Hola TAG08. Quiero entender qué formato audiovisual tiene más sentido para el momento actual de mi marca.",
    linkToServices: "VER SERVICIOS",
    serviceCardTitle: "Planificación y claridad",
    serviceCardDescription: "El proceso comienza por entender el contexto de la marca, la función del material y el uso previsto después de la grabación.",
    consultationBadge: "CONVERSACIÓN CONSULTIVA",
    consultationTitle: "¿Quieres hablar sobre tu proyecto audiovisual?",
    consultationDescription: "Sin paquetes predefinidos. Primero entendemos el contexto, el objetivo y el uso previsto del material.",
    methodologyBadge: "MÉTODO DE PRODUCCIÓN // TAG08",
    methodologyTitle: "Un proceso pensado antes, durante y después de la grabación.",
    methodologyDescription: "La producción audiovisual no comienza el día de la grabación. Primero entendemos el contexto de la marca, definimos la función del contenido, organizamos formatos adecuados y planificamos cómo se podrá usar el material después.",
    processActive: "PROCESO ACTIVO",
    processSteps: [
      { tag: "COMPRENSIÓN DEL CONTEXTO", title: "Comprensión del contexto", list: ["Empezamos por entender la marca, el momento actual, los canales, el público y la función que debe cumplir el contenido audiovisual.", "Mapeamos qué debe comunicarse con claridad y qué servirá de base para las etapas siguientes.", "Organizamos lo que ya existe, lo que falta y lo que se puede reutilizar.", "Alineamos expectativas para reducir el ruido y orientar la producción con criterio.", "Definimos el punto de partida antes de decidir la grabación."] },
      { tag: "NARRATIVA Y FORMATO", title: "Definición de narrativa y formatos", list: ["Organizamos los mensajes prioritarios y los formatos más adecuados para el uso previsto.", "Definimos si el material debe servir para presentar, registrar, redes sociales, el sitio web, campañas o comunicación institucional.", "Estructuramos la narrativa para que el contenido tenga dirección y no solo imágenes.", "Ajustamos cada entrega al canal donde se utilizará.", "Creamos una base clara para orientar la grabación."] },
      { tag: "GRABACIÓN, EDICIÓN Y USO", title: "Grabación con dirección, edición y entrega", list: ["Definimos guion, temas, escenas, discursos, dinámica de grabación, prioridades de registro y materiales necesarios.", "Durante la grabación, guiamos el proceso para registrar discursos, espacios, momentos detrás de cámaras, detalles y momentos clave con claridad e intención.", "Editamos, estructuramos y adaptamos el material en piezas coherentes con la narrativa, los canales y los objetivos de comunicación.", "Además de los archivos finales, indicamos cómo utilizar el material en redes sociales, el sitio web, presentaciones, campañas o comunicación institucional.", "Cerramos el proceso con orientación de uso y reutilización."] }
    ],
    scopeBadge: "INCLUSIONES Y COMPLEMENTOS // TAG08",
    scopeTitle: "El alcance debe acompañar el uso del material.",
    scopeDescription: "Cada producción puede incluir distintas entregas según el objetivo, los canales y el momento de la marca. Lo importante es definir qué se grabará, editará y organizará para que el contenido tenga un uso real después de la grabación.",
    includedBadge: "MATERIALES DE APOYO // ALCANCE DEFINIDO",
    includedFootnote: "ALCANCE DEFINIDO SEGÚN EL USO REAL",
    included: [
      { title: "Grabación principal", desc: "Registro de discursos, espacios, escenas, momentos detrás de cámaras, detalles y momentos esenciales para construir la narrativa." },
      { title: "Edición y finalización", desc: "Organización del contenido en videos claros, con ritmo, cortes, ajustes visuales, audio tratado y acabado coherente con la identidad de la marca." },
      { title: "Cortes y adaptaciones", desc: "Creación de versiones más breves, llamadas, cortes y materiales derivados para redes sociales, sitios web, presentaciones o comunicación institucional." },
      { title: "Guion, temas y dirección", desc: "Apoyo para definir qué decir, registrar y priorizar, de modo que la grabación tenga más claridad y menos improvisación." },
      { title: "Registro detrás de cámaras", desc: "Grabación complementaria del equipo, el entorno, la preparación, la rutina y los detalles que acercan la marca al público." }
    ],
    addOnsBadge: "COMPLEMENTOS POSIBLES // SEGÚN EL ALCANCE",
    addOns: [
      { title: "Entrega y orientación de uso", desc: "Orientación sobre cómo aprovechar los materiales en los canales de la marca, respetando el contexto, la línea editorial y el objetivo de comunicación." },
      { title: "Materiales de apoyo para sitios y presentaciones", desc: "Videos, llamadas y cortes que complementan páginas, propuestas y presentaciones comerciales." },
      { title: "Cobertura complementaria detrás de cámaras", desc: "Registro adicional del equipo, la preparación, la rutina y el entorno cuando aporte al material final." },
      { title: "Grabación adicional planificada", desc: "Registros extra definidos en el alcance cuando exista una necesidad real de ampliar la narrativa o el uso posterior." },
      { title: "Adaptaciones para canales de la marca", desc: "Versiones y cortes organizados para apoyar la comunicación institucional, social o comercial." }
    ],
    scopeFootnote: "ELEMENTOS DEFINIDOS SEGÚN EL ALCANCE",
    synergyBadge: "INTEGRACIÓN ENTRE SERVICIOS // TAG08",
    synergyTitle: "El contenido audiovisual no tiene que quedar aislado.",
    synergyDescription: "Una producción bien planificada puede apoyar distintas áreas de comunicación: redes sociales, sitios web, branding, presentaciones comerciales, campañas, relaciones y canales oficiales de la marca como YouTube, Vimeo, Pinterest, Google Business Profile y WhatsApp, cuando tenga sentido. Su valor está en planificar desde el inicio cómo se usará el material después de la grabación.",
    synergies: [
      { title: "Redes sociales", desc: "Videos, cortes, momentos detrás de cámaras, llamadas y testimonios pueden apoyar la línea editorial con más presencia, claridad y continuidad.", cta: "Gestión de Redes Sociales" },
      { title: "Sitios web y páginas comerciales", desc: "El material audiovisual puede presentar la marca, explicar servicios, humanizar páginas y apoyar decisiones con más contexto.", cta: "Desarrollo Web" },
      { title: "Branding y posicionamiento", desc: "La producción puede reforzar la identidad, el tono de voz, la narrativa institucional, la cultura y la percepción de marca de forma más concreta.", cta: "Branding e Identidad" },
      { title: "Procesos comerciales y relaciones", desc: "Testimonios, presentaciones, registros institucionales y videos explicativos pueden apoyar conversaciones comerciales sin reemplazar el diagnóstico consultivo.", cta: "Activación de Procesos" }
    ],
    synergyLabel: "SINERGIA",
    finalConversation: "CONVERSACIÓN CONSULTIVA",
    finalTitle: "Veamos qué producción tiene sentido para tu momento.",
    finalDescription: "Cuéntanos qué necesitas comunicar, registrar o convertir en contenido. A partir de ahí, evaluamos el formato más adecuado: institucional, eventos, detrás de cámaras, testimonios, contenido recurrente o material de apoyo para canales digitales.",
    finalContactLabel: "HABLAR SOBRE MI PROYECTO AUDIOVISUAL",
    startConversation: "INICIAR CONVERSACIÓN",
    nextStep: "PRÓXIMO PASO",
    visualContentLabel: "contenido_con_función_"
  }
};

export default function ProducaoAudiovisual({ onNavigate, locale = "pt" }: ProducaoProps) {
  const copy = locale === "pt" ? null : AUDIOVISUAL_COPY[locale];
  const formats = copy?.formats ?? FORMATOS;
  const deliverables = copy?.deliverables ?? DELIVERABLES;
  const [activeFaq, setActiveFaq] = useState<number>(0);
  const prefersReducedMotion = useReducedMotion();
  const { videos: youtubeVideos, source: youtubeSource, isLoading: isYouTubeLoading } = useOfficialYouTubeVideos(4);
  
  // Custom calculator states
  const [selectedFormat, setSelectedFormat] = useState<string>("institucional");
  const [selectedTools, setSelectedTools] = useState<string[]>(["institucional", "apoio"]);
  const trackSimulator = useSimulatorTracking("audiovisual_scope_planner", 1, "/servicos/producao-audiovisual");

  const handleToggleTool = (toolId: string) => {
    trackSimulator("input_changed");
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(t => t !== toolId) 
        : [...prev, toolId]
    );
  };

  const currentFormatDetails = formats.find((f) => f.id === selectedFormat) ?? formats[0];
  const currentSelectedTools = selectedTools
    .map((id) => {
      const sourceIndex = DELIVERABLES.findIndex((item) => item.id === id);
      return deliverables[sourceIndex]?.name;
    })
    .filter((name): name is string => Boolean(name))
    .join(", ");
  const hasSelectedTools = selectedTools.length > 0;

  const getWhatsAppLink = () => {
    const formatName = currentFormatDetails.name;

    const message = `${copy?.plannerCtaMessage ?? "Olá TAG08! Quero entender qual formato audiovisual faz mais sentido para o momento da minha marca."}

- FORMATO AVALIADO: ${formatName}
- MATERIAIS RELACIONADOS: ${currentSelectedTools}

Quero conversar sobre o próximo passo com a TAG08.`;

    return buildBrazilWhatsAppUrl(message);
  };

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pb-20 relative overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-[8%] left-[-10%] w-[580px] h-[580px] bg-brand/[0.015] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[25%] right-[-12%] w-[580px] h-[580px] bg-brand/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Floating 3D Geometric Mesh for Tech/Artistic Authority */}
      <div aria-hidden="true">
        <Subtle3DCanvas intensity={1.5} className="absolute right-[-8%] top-[5%] w-[480px] h-[480px] opacity-[0.35] mix-blend-screen hidden lg:block animate-pulse-slow" />
      </div>

      {/*=========================================
          SECTION 1: HERO - THE CINEMATIC SYSTEM
         =========================================*/}
      <section className="px-6 md:px-8 py-12 md:py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 lg:items-center text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
                {copy?.heroBadge ?? "Produção Audiovisual"}
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter font-display">
                {copy?.heroTitle ?? "Narrativa audiovisual com"} <br />
                <span className="text-brand">{copy?.heroTitleAccent ?? "presença e função estratégica."}</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-sm leading-relaxed font-sans font-medium">
                {copy?.heroDescription ?? "A TAG08 transforma presença, fala, ambiente, bastidores e eventos em conteúdo com clareza, estética e função estratégica. Antes de gravar, entendemos o contexto da marca, os usos do material e os formatos que precisam sustentar comunicação, portfólio e relacionamento."}
              </p>
            </div>
          </div>

          {/* Epic Widescreen Cinematic Image Banner with Hover badging */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px]">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.35/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <ResilientImage
                fallbackLabel={copy?.heroImageAlt ?? "Produção Audiovisual TAG08"}
                priority
                sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1280px) calc(100vw - 4rem), 1152px"
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1600"
                alt={copy?.heroImageAlt ?? "Produção Audiovisual TAG08"}
                className="object-cover grayscale brightness-40 motion-safe:group-hover:scale-[1.02] transition-transform duration-200 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent pointer-events-none" />

              {/* Central Floating Callout */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{ transform: "translateZ(50px)" }}>
                <div className="flex flex-col items-center gap-3">
                  <TrackedOutboundLink
                    label="Falar com a TAG08 sobre produção audiovisual"
                    surface="audiovisual-hero"
                    href={buildBrazilWhatsAppUrl(copy?.heroWhatsAppMessage ?? "Olá, quero conversar sobre uma produção audiovisual para a minha marca.")}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-11 bg-brand-secondary text-black font-sans font-black text-xs uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.3)] motion-safe:hover:scale-105 active:scale-[0.98] transition-transform duration-200 border border-brand-secondary hover:bg-brand-dark flex items-center gap-2 cursor-pointer z-20"
                  >
                    <span>{copy?.talk ?? "FALAR COM A TAG08"}</span>
                    <ArrowUpRight aria-hidden="true" className="w-4 h-4 stroke-[2.5]" />
                  </TrackedOutboundLink>
                  <a href="#planner" className="min-h-11 inline-flex items-center rounded-full border border-white/30 bg-black/50 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/60 active:scale-[0.98]">
                    {copy?.plan ?? "PLANEJAR MEU AUDIOVISUAL"}
                  </a>
                </div>
              </div>

              {/* Bottom detail row */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="tag08-meta text-xs text-brand-secondary tracking-widest block uppercase font-bold">TAG08 AUDIOVISUAL</span>
                  <p className="font-display font-black text-white text-xs sm:text-sm tracking-tight leading-none">{copy?.heroCaption ?? "Narrativa, presença e conteúdo com direção"}</p>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-xs text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
                  <span>{copy?.heroMeta ?? "Captação, edição e distribuição para uso recorrente"}</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* Hero benefit cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-6 pb-2 text-left border-t border-white/[0.04]">
            <div className="space-y-1.5">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">{copy?.benefits[0] ?? "Narrativa"}</span>
              <span className="block text-zinc-300 tag08-meta text-xs uppercase tracking-widest leading-normal">{copy?.benefitDescriptions[0] ?? "Capta fala, bastidores e ambiente com intenção editorial"}</span>
            </div>
            <div className="space-y-1.5">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">{copy?.benefits[1] ?? "Clareza"}</span>
              <span className="block text-zinc-300 tag08-meta text-xs uppercase tracking-widest leading-normal">{copy?.benefitDescriptions[1] ?? "Organiza o material para apoiar apresentação, redes e site"}</span>
            </div>
            <div className="space-y-1.5">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">{copy?.benefits[2] ?? "Aplicação"}</span>
              <span className="block text-zinc-300 tag08-meta text-xs uppercase tracking-widest leading-normal">{copy?.benefitDescriptions[2] ?? "Peças pensadas para uso recorrente e consistente"}</span>
            </div>
            <div className="space-y-1.5">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">{copy?.benefits[3] ?? "Continuidade"}</span>
              <span className="block text-zinc-300 tag08-meta text-xs uppercase tracking-widest leading-normal">{copy?.benefitDescriptions[3] ?? "Conteúdo útil depois da gravação e da edição"}</span>
            </div>
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 2: PROBLEM PANEL (Muitas marcas registram momentos, mas...)
         =========================================*/}
      <section className="px-6 md:px-8 py-20 bg-charcoal-900/15 border-b border-white/[0.04] text-left relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl">
            <div className="space-y-3">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
                {copy?.section2Badge ?? "Sinais de desalinhamento audiovisual"}
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tighter">
                {copy?.section2Title ?? "Quando o vídeo existe, mas não constrói presença."}
              </h2>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {copy?.section2Description ?? "Muitas marcas gravam conteúdos, registram eventos e publicam vídeos, mas ainda não conseguem transformar esses materiais em presença clara, recorrente e útil para a comunicação. O problema pode estar menos na captação e mais na falta de narrativa, formato, edição e estratégia de uso."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {[
              {
                title: "Vídeos sem função clara",
                desc: "O conteúdo é gravado, mas não fica claro se ele deve apresentar a marca, educar o público, registrar um momento, apoiar vendas ou fortalecer autoridade."
              },
              {
                title: "Bastidores pouco aproveitados",
                desc: "Eventos, processos, atendimentos, equipe e rotina geram material valioso, mas acabam não sendo transformados em conteúdo útil para a marca."
              },
              {
                title: "Falas sem narrativa",
                desc: "Especialistas e lideranças têm conhecimento para compartilhar, mas os vídeos precisam de direção para ficarem claros, objetivos e reaproveitáveis."
              },
              {
                title: "Conteúdo sem continuidade",
                desc: "A marca grava em momentos pontuais, mas não constrói uma presença audiovisual recorrente conectada à linha editorial."
              },
              {
                title: "Material sem reaproveitamento",
                desc: "Um vídeo longo, cobertura ou gravação pode gerar cortes, chamadas, bastidores, reels, publicações e materiais de apoio, desde que exista planejamento."
              }
            ].map((item, idx) => {
              const localizedItem = copy?.problemCards[idx] ?? item;
              return (
              <div 
                key={idx}
                className="bg-charcoal-900 border border-white/[0.04] rounded-2xl p-6 sm:p-7 space-y-3 transition-colors duration-200 hover:border-red-500/20"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/5 text-red-400 border border-red-500/10 flex items-center justify-center font-sans text-xs font-bold">
                  SINAL {String(idx + 1).padStart(2, '0')}
                </div>
                <h3 className="text-white text-base sm:text-lg font-display font-semibold tracking-tight">
                  {localizedItem.title}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed">
                  {localizedItem.desc}
                </p>
              </div>
              );
            })}
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 3: TARGET AUDIENCE (Para quem é)
         =========================================*/}
      <section className="px-6 md:px-8 py-20 border-b border-white/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto space-y-14 text-center">
          
          <div className="max-w-2xl mx-auto space-y-3 text-center">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                {copy?.audienceBadge ?? "CONTEXTOS DE APLICAÇÃO // TAG08"}
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tighter">
              {copy?.audienceTitle ?? "Para marcas que precisam transformar presença em conteúdo."}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              {copy?.audienceDescription ?? "A produção audiovisual da TAG08 faz sentido para negócios, profissionais e instituições que já têm histórias, experiências, bastidores, eventos, pessoas ou conhecimento para comunicar, mas precisam organizar isso em formatos claros, bem editados e úteis para diferentes canais."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              {
                icon: Award,
                title: "Empresas com rotina, equipe e bastidores relevantes",
                desc: "Negócios que têm processos, atendimentos, entregas, cultura ou operação acontecendo todos os dias, mas ainda não transformam essa rotina em conteúdo com clareza."
              },
              {
                icon: Play,
                title: "Profissionais e especialistas que precisam comunicar autoridade",
                desc: "Pessoas que dominam um assunto, atendem clientes ou lideram uma área, mas precisam de direção para transformar fala, conhecimento e experiência em vídeos objetivos."
              },
              {
                icon: Video,
                title: "Eventos que merecem registro estratégico",
                desc: "Encontros, lançamentos, inaugurações, treinamentos, palestras e ações presenciais que não devem virar apenas lembrança, mas material útil para comunicação posterior."
              },
              {
                icon: Monitor,
                title: "Marcas que precisam alimentar redes, site e campanhas",
                desc: "Negócios que precisam de vídeos, cortes, bastidores, depoimentos, chamadas e materiais audiovisuais conectados à linha editorial e aos canais da marca."
              },
              {
                icon: Film,
                title: "Projetos que precisam de narrativa institucional",
                desc: "Iniciativas que precisam apresentar história, propósito, método, equipe, serviço ou transformação de forma mais humana, visual e compreensível."
              }
            ].map((audience, idx) => {
              const AudienceIcon = audience.icon;
              const localizedAudience = copy?.audienceCards[idx] ?? audience;
              return (
                <div 
                  key={idx}
                    className="bg-charcoal-900 border border-white/[0.05] rounded-2xl p-6 hover:border-brand/30 hover:bg-white/[0.015] transition-colors duration-200 flex flex-col justify-between group min-h-64"
                >
                  <div className="space-y-4">
                    <div className="p-2.5 bg-white/[0.03] text-zinc-400 group-hover:text-brand group-hover:bg-brand/10 rounded-xl transition-colors duration-200 w-10 h-10 flex items-center justify-center">
                      <AudienceIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-white text-base sm:text-lg font-display font-semibold tracking-tight group-hover:text-brand transition-colors">
                      {localizedAudience.title}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed">
                      {localizedAudience.desc}
                    </p>
                  </div>
                  <div className="text-xs tag08-meta text-zinc-300 uppercase tracking-widest select-none">
                    DIRECIONAMENTO // COD_0{idx + 1}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 4: ACTIVE FRONTS OF ACTION (Frentes de atuação)
         =========================================*/}
      <section className="px-6 md:px-8 py-20 bg-charcoal-900/10 border-b border-white/[0.04] text-left relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-left space-y-3 max-w-2xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
              {copy?.frontsBadge ?? "FRENTES AUDIOVISUAIS // TAG08"}
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tighter">
              {copy?.frontsTitle ?? "Frentes audiovisuais com função clara."}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              {copy?.frontsDescription ?? "A produção pode assumir diferentes formatos, mas cada entrega precisa responder a uma necessidade concreta da marca: apresentar, registrar, explicar, aproximar, educar, documentar ou alimentar canais com consistência."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                num: "FRENTE 01",
                title: "Vídeos institucionais e de apresentação",
                desc: "Para apresentar a marca, equipe, história, estrutura, método, serviço ou posicionamento de forma mais humana, visual e compreensível.",
                list: ["Apresentação da marca", "Equipe e estrutura", "História e método", "Serviço e posicionamento", "Materiais para site e propostas"]
              },
              {
                num: "FRENTE 02",
                title: "Cobertura de eventos e ações presenciais",
                desc: "Para registrar encontros, lançamentos, inaugurações, treinamentos, palestras e ativações com olhar narrativo, pensando também no uso posterior do material.",
                list: ["Registro de encontros", "Lançamentos e inaugurações", "Treinamentos e palestras", "Ativações e ações presenciais", "Material para comunicação posterior"]
              },
              {
                num: "FRENTE 03",
                title: "Conteúdos para redes sociais",
                desc: "Para transformar falas, bastidores, rotinas, produtos, serviços e momentos da marca em vídeos curtos, cortes e publicações conectadas à linha editorial.",
                list: ["Vídeos curtos", "Cortes de falas", "Bastidores e rotinas", "Produtos e serviços", "Publicações conectadas à linha editorial"]
              },
              {
                num: "FRENTE 04",
                title: "Depoimentos, entrevistas e autoridade",
                desc: "Para organizar falas de clientes, especialistas, lideranças ou equipe em conteúdos claros, objetivos e úteis para fortalecer confiança.",
                list: ["Depoimentos guiados", "Entrevistas objetivas", "Falas de especialistas", "Lideranças e equipe", "Conteúdo para fortalecer confiança"]
              },
              {
                num: "FRENTE 05",
                title: "Bastidores, cultura e marca empregadora",
                desc: "Para mostrar pessoas, processos, ambiente, rotina e cultura de forma autêntica, sem transformar bastidor em encenação vazia.",
                list: ["Pessoas e processos", "Ambiente e rotina", "Cultura do dia a dia", "Marca empregadora", "Bastidores autênticos"]
              },
              {
                num: "FRENTE 06",
                title: "Materiais de apoio para site, campanhas e apresentações",
                desc: "Para gerar vídeos, chamadas, recortes e materiais visuais que apoiem páginas, propostas, apresentações comerciais e canais digitais.",
                list: ["Vídeos para páginas", "Chamadas e recortes", "Materiais visuais de apoio", "Propostas e apresentações comerciais", "Canais digitais da marca"]
              }
            ].map((frente, idx) => (
              <div 
                key={idx}
                className="bg-charcoal-900 border border-white/[0.06] rounded-2.5xl p-6 sm:p-10 space-y-6 hover:border-brand/40 hover:bg-white/[0.01] transition-colors duration-200 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/[0.015] rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-brand-secondary font-black uppercase tracking-widest">{copy?.frontLabel ?? "FRENTE"} {String(idx + 1).padStart(2, "0")}</span>
                  <h3 className="font-display font-medium text-lg sm:text-xl text-white leading-snug">
                    {copy?.fronts[idx]?.title ?? frente.title}
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed">
                    {copy?.fronts[idx]?.desc ?? frente.desc}
                  </p>
                </div>

                <div className="space-y-3.5 pt-4 border-t border-white/[0.04]">
                  <span className="tag08-meta text-xs text-zinc-300 uppercase tracking-widest block font-bold">{copy?.possibleFormats ?? "FORMATOS POSSÍVEIS:"}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {frente.list.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex gap-2.5 items-center">
                        <Check className="w-3.5 h-3.5 text-brand shrink-0 stroke-[2.5]" />
                        <span className="text-zinc-300 text-xs font-medium font-sans">{copy?.fronts[idx]?.list[itemIdx] ?? item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 4.5: FORMATOS AUDIOVISUAIS // TAG08 (Conteúdos recentes do canal)
         =========================================*/}
      <section className="px-6 md:px-8 py-20 border-b border-white/[0.04] bg-charcoal-950/80 text-left relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-3 max-w-2xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
                {copy?.recentBadge ?? "FORMATOS AUDIOVISUAIS // TAG08"}
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tighter">
              {copy?.recentHeading ?? "Conteúdos recentes publicados no canal."}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              {copy?.recentDescription ?? "Estes são os conteúdos mais recentes do canal oficial da TAG08. Eles mostram bastidores, produção, posicionamento e trabalhos já publicados que ajudam a entender o tipo de material que o audiovisual pode gerar."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {isYouTubeLoading ? (
              <div role="status" aria-live="polite" aria-busy="true" className="sm:col-span-2 lg:col-span-3 rounded-[28px] border border-white/[0.06] bg-white/[0.02] p-6 text-sm leading-relaxed text-zinc-400">
                {copy ? (locale === "en" ? "Loading official videos…" : "Cargando videos oficiales…") : "Carregando vídeos oficiais…"}
              </div>
            ) : youtubeSource === "live" && youtubeVideos.length > 0 ? youtubeVideos.map((video) => (
              <a
                key={video.id}
                aria-label={copy?.videoLinkLabel.replace("{title}", video.title)}
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackVideoEvent({
                    action: "selected",
                    video_id: video.embedCode,
                    video_source: "youtube",
                    surface: "audiovisual-shorts",
                    page_path: "/servicos/producao-audiovisual"
                  })
                }
                className="group block h-full overflow-hidden rounded-[28px] border border-white/[0.05] bg-charcoal-900 transition-colors duration-200 hover:border-brand/30"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <Image
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    src={video.thumbnail}
                    alt={video.title}
                    className="object-cover brightness-[0.82] contrast-[1.05] transition-transform duration-200 motion-safe:group-hover:scale-[1.03]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-black/45 px-2.5 py-1 tag08-meta text-xs uppercase tracking-widest text-white/75 backdrop-blur-sm">
                      {copy?.recentBadge ?? "CONTEÚDO RECENTE"}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center rounded-full border border-brand-secondary/15 bg-brand-secondary/10 px-2.5 py-1 tag08-meta text-xs uppercase tracking-widest text-brand-secondary backdrop-blur-sm">
                      YOUTUBE
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/90 backdrop-blur-sm transition-transform duration-200 motion-safe:group-hover:scale-105">
                      <PlayCircle className="h-7 w-7" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  <h3 className="text-sm sm:text-sm font-semibold leading-snug text-white">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between border-t border-white/[0.05] pt-3">
                    <span className="tag08-meta text-xs uppercase tracking-widest text-zinc-300">
                      {copy?.videoPublished ?? "Publicado no canal"}
                    </span>
                    <span className="inline-flex items-center gap-1 tag08-meta text-xs font-bold uppercase tracking-widest text-brand-secondary">
                      {copy?.watch ?? "Assistir"}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </a>
            )) : (
              <div role="status" aria-live="polite" className="sm:col-span-2 lg:col-span-3 flex flex-col items-start gap-4 rounded-[28px] border border-white/[0.06] bg-white/[0.02] p-6 text-sm leading-relaxed text-zinc-400">
                <p>{copy?.youtubeUnavailable ?? "Os vídeos oficiais estão temporariamente indisponíveis. Você pode acessar o canal oficial da TAG08."}</p>
                <a href={TAG08_OFFICIAL_YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-xl bg-brand px-5 py-3 text-xs font-black uppercase tracking-wider text-black transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                  {copy?.openChannel ?? "Abrir canal oficial"}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/*=========================================
          SECTION 5: INTERACTIVE SIMULATOR (PLANNER)
         =========================================*/}
      <section id="planner" className="px-6 md:px-8 py-16 sm:py-20 border-b border-white/[0.04] text-left relative z-10 scroll-mt-24">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 max-w-5xl">
            <div className="space-y-2.5 sm:space-y-3">
              <span className="tag08-meta text-xs sm:text-xs text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              {copy?.plannerBadge ?? "DIAGNÓSTICO DE FORMATO AUDIOVISUAL"}
              </span>
              <h2 className="font-display font-black text-[1.55rem] sm:text-3xl md:text-4xl text-white tracking-tighter leading-[0.95]">
                {copy?.plannerTitle ?? "Entenda qual tipo de conteúdo faz mais sentido para o seu momento."}
              </h2>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {copy?.plannerDescription ?? "Responda a partir do contexto da sua marca para identificar se faz mais sentido registrar, apresentar, explicar, reaproveitar ou alimentar canais com mais consistência."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Lado Esquerdo: Formato (Column) + Entregáveis */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              
              {/* Formatos Buttons Selector */}
              <div className="space-y-3 sm:space-y-4">
                <span className="tag08-meta text-xs sm:text-xs text-zinc-300 uppercase tracking-widest font-bold block">{copy?.plannerFormat ?? "1. ESCOLHA O FORMATO QUE FAZ MAIS SENTIDO"}</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {formats.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={selectedFormat === f.id}
                      onClick={() => {
                        trackSimulator("input_changed");
                        setSelectedFormat(f.id);
                        // Ajusta os materiais sugeridos de acordo com o formato selecionado.
                        if (f.id === "institucional") setSelectedTools(["institucional", "apoio"]);
                        else if (f.id === "evento") setSelectedTools(["evento", "autoridade", "redes"]);
                        else setSelectedTools(["redes", "bastidores", "autoridade", "apoio"]);
                      }}
                      className={`p-3.5 sm:p-4 rounded-xl text-left border relative transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary min-h-[88px] ${
                        selectedFormat === f.id
                          ? "bg-brand/5 border-brand text-white shadow-xl shadow-brand/5"
                          : "bg-white/[0.01] border-white/5 text-zinc-400 hover:border-white/10"
                      }`}
                    >
                      <span className="font-sans text-xs sm:text-xs text-brand block mb-1 font-black uppercase tracking-wider">{f.tag}</span>
                      <h3 className="text-white text-xs sm:text-sm font-semibold leading-tight">{f.name}</h3>
                    </button>
                  ))}
                </div>
              </div>

              {/* Deliverables Grid selector */}
              <div className="space-y-3 sm:space-y-4">
                <span className="tag08-meta text-xs sm:text-xs text-zinc-300 uppercase tracking-widest font-bold block">{copy?.plannerMaterials ?? "2. MARQUE O QUE PODE SER PRODUZIDO"}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                  {DELIVERABLES.map((sourceDeliverable, index) => {
                    const del = { ...sourceDeliverable, ...deliverables[index] };
                    const isSelected = selectedTools.includes(del.id);
                    return (
                      <button
                        key={del.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleToggleTool(del.id)}
                        className={`p-3.5 sm:p-4 rounded-xl border text-left transition-colors duration-200 relative flex flex-col justify-between min-h-[10rem] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary group ${
                          isSelected
                            ? "bg-brand text-black border-brand/40 shadow-lg shadow-brand/5 font-medium"
                            : "bg-white/[0.01] border-white/5 text-zinc-400 hover:border-white/10"
                        }`}
                      >
                        <div className="space-y-1 text-left">
                          <h3 className={`text-xs sm:text-xs uppercase font-semibold font-display tracking-tight leading-snug group-hover:text-white transition-colors ${isSelected ? "text-black group-hover:text-black" : "text-white"}`}>
                            {del.name}
                          </h3>
                          <p className={`text-xs sm:text-xs leading-relaxed font-medium transition-colors ${isSelected ? "text-black/75" : "text-zinc-300 group-hover:text-zinc-400"}`}>
                            {del.desc}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center w-full pt-2 border-t border-black/5">
                          <span className={`font-sans text-xs font-bold uppercase ${isSelected ? "text-black/80" : "text-zinc-400"}`}>{copy ? copy.materialCategory[del.category] : del.category} {copy?.materialLabel ?? "material"}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? "bg-black text-brand border-black" : "border-zinc-700 text-zinc-500"}`}>
                            {isSelected ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <Plus className="w-2.5 h-2.5" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Lado Direito: Preview de Setup a enviar por WhatsApp */}
            <div className="lg:col-span-5">
              <div className="bg-charcoal-900 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4 sm:space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
                
                  <div className="flex justify-between items-center gap-3 border-b border-white/[0.04] pb-3 sm:pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                    <span className="tag08-meta text-xs sm:text-xs text-brand uppercase tracking-wider font-extrabold">{copy?.formatSummary ?? "RESUMO DO FORMATO AUDIOVISUAL"}</span>
                    </div>
                  <span className="font-sans text-xs sm:text-xs text-zinc-300">TAG08_AUDIOVISUAL</span>
                  </div>

                {/* Setup selected details */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5">
                    <span className="font-sans text-xs sm:text-xs text-zinc-300 uppercase font-black block">{copy?.evaluatedFormat ?? "FORMATO AVALIADO:"}</span>
                    <h3 className="font-display font-medium text-base sm:text-lg text-brand-secondary tracking-tight leading-none">
                      {currentFormatDetails.name}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-xs leading-normal">
                      {currentFormatDetails.desc}
                    </p>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-white/[0.04] space-y-2.5 text-left">
                    <span className="font-sans text-xs sm:text-xs text-zinc-300 uppercase font-black block">{copy?.organizes ?? "O QUE ESSE FORMATO AJUDA A ORGANIZAR:"}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentFormatDetails.features.map((feat, fidx) => (
                        <div key={fidx} className="flex gap-2 items-center">
                          <Check className="w-3 h-3 text-brand text-xs shrink-0" />
                          <span className="text-zinc-300 text-xs sm:text-xs font-medium font-sans">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chosen tools list output */}
                    <div className="pt-3 sm:pt-4 border-t border-white/[0.04] space-y-2.5">
                      <span className="font-sans text-xs sm:text-xs text-zinc-300 uppercase font-black block">{copy?.relatedMaterials ?? "MATERIAIS RELACIONADOS"} ({selectedTools.length}):</span>
                      {hasSelectedTools ? (
                        <div className="flex flex-wrap gap-2 text-left max-h-40 overflow-y-auto pr-1">
                          {selectedTools.map((tId) => {
                            const sourceIndex = DELIVERABLES.findIndex((d) => d.id === tId);
                            const dl = sourceIndex < 0 ? null : deliverables[sourceIndex];
                            if (!dl) return null;
                            return (
                              <span key={tId} className="px-2.5 py-1 bg-white/[0.03] border border-white/5 text-zinc-300 text-xs rounded-lg font-sans font-medium hover:border-brand/40 transition-colors">
                                {dl.name}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-white/8 bg-white/[0.02] px-4 py-4 sm:py-5 space-y-2">
                          <h3 className="text-sm sm:text-sm font-semibold text-white">{copy?.noMaterials ?? "Nenhum material selecionado ainda."}</h3>
                          <p className="text-xs leading-relaxed text-zinc-400 max-w-md">
                            {copy?.emptyMaterialsDescription ?? "Marque ao menos um item para visualizar possibilidades de desdobramento para esse formato audiovisual."}
                          </p>
                        </div>
                      )}
                    </div>
                </div>

                {/* Core action trigger with prefilled parameters */}
                <div className="pt-3 sm:pt-4 space-y-2.5 sm:space-y-3">
                  <TrackedOutboundLink
                    label="Enviar briefing audiovisual por WhatsApp"
                    surface="audiovisual-planner-result"
                    href={getWhatsAppLink()}
                    onClick={() => trackSimulator("cta_clicked")}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-11 block w-full bg-brand-secondary hover:bg-brand hover:shadow-[0_15px_35px_rgba(var(--color-brand-secondary-rgb),0.22)] text-black text-xs sm:text-xs font-sans font-black uppercase tracking-widest py-3.5 sm:py-4 rounded-xl text-center transition-[background-color,box-shadow] duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_30px_rgba(var(--color-brand-secondary-rgb),0.15)]"
                  >
                    <MessageSquare className="w-4 h-4 text-black" />
                    <span>{copy?.plannerCta ?? "CONVERSAR SOBRE MEU FORMATO AUDIOVISUAL"}</span>
                  </TrackedOutboundLink>
                  <span className="block text-center font-sans text-xs sm:text-xs text-zinc-300 uppercase leading-none select-none">
                     {copy?.plannerCtaHint ?? "USE ESTE RESUMO COMO PONTO DE PARTIDA PARA A CONVERSA"}
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 6: METHODOLOGY TIMELINE (Antes, Durante, Depois)
         =========================================*/}
      <section className="px-6 md:px-8 py-20 border-b border-white/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              {copy?.methodologyBadge ?? "METODOLOGIA DE PRODUÇÃO // TAG08"}
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tighter">
              {copy?.methodologyTitle ?? "Um processo pensado antes, durante e depois da gravação."}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
              {copy?.methodologyDescription ?? "A produção audiovisual não começa no dia da captação. Antes de gravar, entendemos o contexto da marca, definimos a função do conteúdo, organizamos formatos possíveis e planejamos como o material poderá ser usado depois."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left relative">
            {/* Visual connector lines for large screens */}
            <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-gradient-to-r from-brand/20 via-brand/40 to-transparent z-0 hidden lg:block -translate-y-16" />

            {[
              {
                num: "01",
                tag: "ENTENDIMENTO DO CONTEXTO",
                title: "Entendimento do contexto",
                color: "group-hover:border-brand/40",
                list: [
                  "Começamos entendendo a marca, o momento, os canais, o público e a função que o conteúdo audiovisual precisa cumprir.",
                  "Mapeamos o que precisa ser comunicado com clareza e o que deve ficar como base para as próximas etapas.",
                  "Organizamos o que já existe, o que falta e o que pode ser reaproveitado no processo.",
                  "Alinhamos expectativas para evitar excesso de ruído e orientar a produção com critério.",
                  "Definimos o ponto de partida antes de qualquer decisão de captação."
                ]
              },
              {
                num: "02",
                tag: "NARRATIVA E FORMATO",
                title: "Definição de narrativa e formatos",
                color: "group-hover:border-brand-secondary/40 border-l border-r border-white/5",
                list: [
                  "Organizamos quais mensagens são prioritárias e quais formatos fazem mais sentido para o uso previsto.",
                  "Definimos se o material precisa servir para apresentação, registro, redes, site, campanhas ou comunicação institucional.",
                  "Estruturamos a narrativa para que o conteúdo tenha direção e não apenas presença de imagem.",
                  "Ajustamos o recorte de cada entrega ao canal em que ela será usada.",
                  "Criamos uma base clara para orientar a captação."
                ]
              },
              {
                num: "03",
                tag: "CAPTAÇÃO, EDIÇÃO E USO",
                title: "Captação com direção, edição e entrega",
                color: "group-hover:border-brand/40",
                list: [
                  "Definimos roteiro, pauta, cenas, falas, dinâmica de gravação, prioridades de registro e materiais que precisam ser captados.",
                  "Durante a gravação, conduzimos o processo para registrar falas, ambientes, bastidores, detalhes e momentos com clareza e intenção.",
                  "O material captado é editado, estruturado e desdobrado em peças coerentes com a narrativa, os canais e os objetivos de comunicação.",
                  "Além dos arquivos finais, indicamos como os materiais podem ser utilizados em redes sociais, site, apresentações, campanhas ou comunicação institucional.",
                  "Fechamos o processo com orientação de uso e reaproveitamento."
                ]
              }
            ].map((step, idx) => (
              <div 
                key={idx}
                className="bg-charcoal-900 border border-white/[0.05] rounded-2xl p-6 sm:p-9 relative z-10 group hover:bg-white/[0.015] transition-colors duration-200 flex flex-col justify-between"
              >
                <div className="space-y-5 text-left">
                  <div className="flex justify-between items-center">
                    <span className="font-display font-black text-2xl text-zinc-800 group-hover:text-brand transition-colors select-none">
                      {step.num}.
                    </span>
                    <span className="font-sans text-xs text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2 py-0.5 rounded uppercase font-black uppercase">
                      {copy?.processSteps[idx]?.tag ?? step.tag}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white tracking-tight group-hover:text-brand transition-colors leading-[1.25]">
                    {copy?.processSteps[idx]?.title ?? step.title}
                  </h3>

                  <ul className="space-y-3 pt-3 border-t border-white/[0.04]">
                    {step.list.map((item, idxx) => (
                      <li key={idxx} className="flex gap-2.5 items-start">
                        <Check className="w-3.5 h-3.5 text-brand shrink-0 stroke-[2.5] mt-0.5" />
                        <span className="text-zinc-400 text-xs sm:text-xs leading-relaxed group-hover:text-zinc-300">
                          {copy?.processSteps[idx]?.list[idxx] ?? item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/[0.04] text-xs tag08-meta text-zinc-300 uppercase tracking-widest flex justify-between">
                  <span>{copy?.processActive ?? "PROCESSO ATIVO"}</span>
                  <span className="text-brand font-bold select-none">TAG08_PROCESS_0{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 7: INCLUSIONS AND COMPLEMENTS
         =========================================*/}
      <section className="px-6 md:px-8 py-20 bg-charcoal-900/10 border-b border-white/[0.04] text-left relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-left space-y-3 max-w-2xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded-md inline-block">
              {copy?.scopeBadge ?? "INCLUSÕES E COMPLEMENTOS // TAG08"}
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tighter">
              {copy?.scopeTitle ?? "O escopo precisa acompanhar o uso do material."}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              {copy?.scopeDescription ?? "Cada produção pode envolver diferentes entregas, dependendo do objetivo, dos canais e do momento da marca. O importante é definir o que precisa ser captado, editado e organizado para que o conteúdo tenha uso real depois da gravação."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* ITENS DEFINIDOS NO ESCOPO */}
            <div className="bg-charcoal-900 border border-white/[0.06] rounded-2.5xl p-6 sm:p-9 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-brand tag08-meta text-xs uppercase tracking-widest font-black pb-4 border-b border-white/[0.04]">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>{copy?.includedBadge ?? "MATERIAIS DE APOIO // ESCOPOS DEFINIDOS"}</span>
                </div>
                
                <div className="grid gap-4.5 pt-6 text-left">
                  {[
                    { title: "Captação principal", desc: "Registro das falas, ambientes, cenas, bastidores, detalhes e momentos essenciais para construir a narrativa do material." },
                    { title: "Edição e finalização", desc: "Organização do conteúdo em vídeos claros, com ritmo, cortes, ajustes visuais, áudio tratado e acabamento coerente com a identidade da marca." },
                    { title: "Cortes e desdobramentos", desc: "Criação de versões menores, chamadas, recortes e materiais derivados para redes sociais, site, apresentações ou comunicação institucional." },
                    { title: "Roteiro, pauta e direção", desc: "Apoio na definição do que precisa ser dito, registrado e priorizado para que a gravação tenha mais clareza e menos improviso." },
                    { title: "Cobertura de bastidores", desc: "Registro complementar de equipe, ambiente, preparação, rotina e detalhes que ajudam a aproximar a marca do público." }
                  ].map((inc, iIdx) => (
                    <div key={iIdx} className="flex gap-3 text-left">
                      <div className="w-5 h-5 rounded-md bg-brand/10 text-brand flex items-center justify-center font-bold text-xs shrink-0 font-sans mt-0.5">
                        {iIdx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-white text-xs sm:text-sm font-semibold">{copy?.included[iIdx]?.title ?? inc.title}</h3>
                        <p className="text-zinc-400 text-xs leading-normal">{copy?.included[iIdx]?.desc ?? inc.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-white/[0.04] text-xs tag08-meta text-zinc-300 uppercase tracking-widest">
                {copy?.includedFootnote ?? "ESCOPOS DEFINIDOS CONFORME USO REAL"}
              </div>
            </div>

            {/* COMPLEMENTOS POSSÍVEIS */}
            <div className="bg-white/[0.01] border border-white/[0.04] rounded-2.5xl p-6 sm:p-9 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-zinc-300 tag08-meta text-xs uppercase tracking-widest font-bold pb-4 border-b border-white/[0.04]">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-650" />
                  <span>{copy?.addOnsBadge ?? "COMPLEMENTOS POSSÍVEIS // DEFINIDOS CONFORME ESCOPO"}</span>
                </div>
                
                <div className="grid gap-4.5 pt-6 text-left">
                  {[
                    { title: "Entrega e orientação de uso", desc: "Indicação de como os materiais podem ser aproveitados nos canais da marca, respeitando contexto, linha editorial e objetivo de comunicação." },
                    { title: "Materiais de apoio para site e apresentações", desc: "Vídeos, chamadas e recortes que complementam páginas, propostas e apresentações comerciais." },
                    { title: "Cobertura complementar de bastidores", desc: "Registro extra de equipe, preparação, rotina e ambiente quando isso fizer sentido para o material final." },
                    { title: "Captação adicional prevista no planejamento", desc: "Registros extras definidos no escopo quando houver necessidade real de ampliar a narrativa ou o uso posterior." },
                    { title: "Desdobramentos para canais da marca", desc: "Versões e cortes organizados para apoiar comunicação institucional, social ou comercial." }
                  ].map((opt, oIdx) => (
                    <div key={oIdx} className="flex gap-3 text-left">
                      <div className="w-5 h-5 rounded-md bg-white/5 text-zinc-400 border border-white/5 flex items-center justify-center font-bold text-xs shrink-0 font-sans mt-0.5">
                        +{oIdx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-zinc-300 text-xs sm:text-sm font-semibold">{copy?.addOns[oIdx]?.title ?? opt.title}</h3>
                        <p className="text-zinc-300 text-xs leading-normal">{copy?.addOns[oIdx]?.desc ?? opt.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-white/[0.04] text-xs tag08-meta text-zinc-300 uppercase tracking-widest">
                {copy?.scopeFootnote ?? "ITENS DEFINIDOS CONFORME ESCOPO"}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/*=========================================
          SECTION 8: SYNERGY INTEGRATION (Audiovisual + soluções)
         =========================================*/}
      <section className="px-6 md:px-8 py-20 border-b border-white/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
              {copy?.synergyBadge ?? "INTEGRAÇÃO ENTRE FRENTES // TAG08"}
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tighter">
              {copy?.synergyTitle ?? "Audiovisual não precisa ficar isolado."}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
              {copy?.synergyDescription ?? "Uma produção bem planejada pode alimentar diferentes frentes da comunicação: redes sociais, site, branding, apresentações comerciais, campanhas, relacionamento e canais oficiais da marca, como YouTube, Vimeo, Pinterest, Google Meu Negócio e WhatsApp, quando fizer sentido. O valor está em pensar o material desde o início para que ele tenha função depois da gravação."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              {
                title: "Redes sociais",
                desc: "Vídeos, cortes, bastidores, chamadas e depoimentos podem alimentar a linha editorial com mais presença, clareza e recorrência.",
                cta: "Gestão de Redes Sociais",
                page: "/servicos/gestao-de-redes-sociais"
              },
              {
                title: "Site e páginas comerciais",
                desc: "Materiais audiovisuais podem ajudar a apresentar a marca, explicar serviços, humanizar páginas e apoiar jornadas de decisão com mais contexto.",
                cta: "Desenvolvimento Web",
                page: "/servicos/desenvolvimento-web"
              },
              {
                title: "Branding e posicionamento",
                desc: "A produção pode reforçar identidade, tom de voz, narrativa institucional, cultura e percepção de marca de forma mais concreta.",
                cta: "Branding & Identidade",
                page: "/servicos/branding-identidade"
              },
              {
                title: "Processos comerciais e relacionamento",
                desc: "Depoimentos, apresentações, registros institucionais e vídeos explicativos podem apoiar conversas comerciais sem substituir o diagnóstico consultivo.",
                cta: "Process Activation",
                page: "/servicos/process-activation"
              }
            ].map((syn, idx) => (
              <div 
                key={idx}
                className="bg-charcoal-900 border border-white/[0.05] rounded-2xl p-6.5 sm:p-7 hover:border-brand/40 transition-colors duration-200 flex flex-col justify-between min-h-[18rem] group"
              >
                <div className="space-y-4">
                  <span className="tag08-meta text-xs text-brand-secondary font-black uppercase tracking-widest block">{copy?.synergyLabel ?? "SINERGIA"} {String(idx + 1).padStart(2, '0')}</span>
                  <h3 className="text-white text-base sm:text-lg font-display font-semibold tracking-tight group-hover:text-brand transition-colors leading-[1.2]">
                    {copy?.synergies[idx]?.title ?? syn.title}
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    {copy?.synergies[idx]?.desc ?? syn.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleLinkClick(syn.page)}
                  className="group min-h-11 flex items-center justify-between text-xs font-sans font-bold text-zinc-300 hover:text-brand cursor-pointer select-none pt-3 border-t border-white/5 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary transition-colors duration-200"
                >
                  <span className="uppercase text-xs tracking-widest">{copy?.synergies[idx]?.cta ?? syn.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      <ServiceInsightsBridge servicePath="/servicos/producao-audiovisual" onNavigate={onNavigate} locale={locale} />

      {/*=========================================
          SECTION 9: BOTTOM CTA CARD (WHATSAPP NEON)
         =========================================*/}
      <section className="py-20 px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden animate-fade-in">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-brand text-black p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(var(--color-brand-rgb),0.18)] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

          {/* Left Block: Image frame */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[440px]">
            <div className="absolute inset-0 bg-black/15 rounded-[24px] overflow-hidden" />
            <Image
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 42vw"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'%3E%3Cdefs%3E%3CradialGradient id='g' cx='30%25' cy='30%25' r='80%25'%3E%3Cstop offset='0%25' stop-color='%23f5f5f5' stop-opacity='.18'/%3E%3Cstop offset='60%25' stop-color='%23000000' stop-opacity='.25'/%3E%3Cstop offset='100%25' stop-color='%23000000' stop-opacity='.85'/%3E%3C/radialGradient%3E%3ClinearGradient id='l' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23d4d4d8' stop-opacity='.12'/%3E%3Cstop offset='100%25' stop-color='%233f3f46' stop-opacity='.45'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='500' fill='%230b0b0d'/%3E%3Crect width='800' height='500' fill='url(%23g)'/%3E%3Cg opacity='.65'%3E%3Ccircle cx='180' cy='120' r='96' fill='url(%23l)'/%3E%3Ccircle cx='610' cy='360' r='160' fill='%23facc15' fill-opacity='.08'/%3E%3Cpath d='M80 390C180 300 290 320 380 250s170-90 320-30' fill='none' stroke='%23ffffff' stroke-opacity='.15' stroke-width='2'/%3E%3Cpath d='M110 150h180M510 120h180M120 420h120' stroke='%23ffffff' stroke-opacity='.08' stroke-width='3'/%3E%3C/g%3E%3C/svg%3E" 
              alt={copy?.ctaImageAlt ?? "TAG08 Equipe Técnica Apoio Audiovisual"}
              className="object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[10%] motion-safe:hover:scale-[1.02] transition-transform duration-200"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between items-start">
                <span className="tag08-meta text-xs text-white/60 bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-black border border-white/5">
                  {copy?.heroBadge ?? "AUDIOVISUAL"}
                </span>
                <span className="font-sans text-xs text-white/50 tracking-wider font-extrabold">
                  TAG08
                </span>
              </div>
              <div className="space-y-1.5 opacity-25 select-none">
                <div className="font-display font-extrabold text-[1.8rem] text-white/50 tracking-widest leading-none uppercase select-none">
                  audiovisual
                </div>
                <div className="font-display font-extrabold text-[1.5rem] text-white/30 tracking-widest leading-none uppercase select-none pl-6">
                  {copy?.visualContentLabel ?? "conteudo_com_funcao_"}
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-sans text-xs text-white/40 tracking-wider">
                  {copy?.processActive ?? "PROCESSO ORGANIZADO"}
                </span>
                <span className="tag08-meta text-xs text-white/60 bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-black border border-white/5">
                  CONTEXTO DEFINIDO
                </span>
              </div>
            </div>
          </div>

          {/* Right Block: Details */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 text-left h-full relative z-10 lg:pl-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-black font-semibold">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                </div>
                <span className="tag08-meta text-xs tracking-widest uppercase font-bold text-black/90">
                  {copy?.finalConversation ?? "CONVERSA CONSULTIVA"}
                </span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black leading-[0.9] tracking-tighter font-display">
                {copy?.finalTitle ?? "Vamos entender qual produção faz sentido para o seu momento?"}
              </h2>
              <p className="text-black/85 text-xs sm:text-xs max-w-lg leading-relaxed font-sans font-bold uppercase">
                {copy?.finalDescription ?? "Conte um pouco sobre o que você precisa comunicar, registrar ou transformar em conteúdo. A partir disso, avaliamos o formato mais coerente: institucional, evento, bastidores, depoimentos, conteúdo recorrente ou material de apoio para canais digitais."}
              </p>
            </div>
            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 max-w-md relative overflow-hidden text-left font-sans">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-4 items-start select-none">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black shrink-0 shadow-lg shadow-brand/10 motion-safe:hover:scale-105 transition-transform duration-200">
                  <ArrowUpRight className="w-5 h-5 rotate-45 stroke-[2.5] text-black" />
                </div>
                <div className="space-y-0.5">
                  <span className="tag08-meta text-xs text-brand uppercase tracking-wider font-extrabold block">
                    {copy?.finalConversation ?? "CONVERSA CONSULTIVA"}
                  </span>
                  <p className="text-white text-xs leading-snug font-sans font-semibold">
                    {copy?.consultationDescription ?? "Sem pacote pronto. Primeiro entendemos contexto, objetivo e uso do material."}
                  </p>
                </div>
              </div>

              {/* Contacts info details */}
              <div className="space-y-3 font-sans">
                <TrackedOutboundLink
                  label="Conversar sobre meu audiovisual"
                  surface="audiovisual-final-cta"
                  href={buildBrazilWhatsAppUrl(copy?.finalWhatsAppMessage ?? "Olá, quero entender qual formato audiovisual faz mais sentido para o momento da minha marca.")}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl py-2.5 px-4 transition-colors duration-200 group shadow-inner cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-black transition-colors duration-200">
                        <span className="text-xs font-sans font-black tracking-tight text-brand group-hover:text-black">BR</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="tag08-meta text-xs text-zinc-300 uppercase font-black tracking-wider leading-none">
                          {copy?.finalContactLabel ?? "CONVERSAR SOBRE MEU AUDIOVISUAL"}
                        </span>
                        <span className="text-white text-xs font-sans font-bold tracking-wider group-hover:text-brand transition-colors mt-0.5">
                          +55 83 9.9886-8882
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-brand tag08-meta font-bold uppercase tracking-wider bg-brand/10 py-1 px-2.5 rounded-lg group-hover:bg-brand group-hover:text-black transition-colors duration-200">
                      {copy?.startConversation ?? "INICIAR CONVERSA"}
                    </span>
                  </div>
                </TrackedOutboundLink>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 text-xs font-sans select-none">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                  <span className="tag08-meta text-xs text-white/50 uppercase tracking-widest font-extrabold">
                    TAG08 AUDIOVISUAL
                  </span>
                </div>
                <span className="font-sans text-xs text-brand font-bold bg-brand/10 border border-brand/25 px-2 py-0.5 rounded uppercase leading-none">
                  {copy?.nextStep ?? "PRÓXIMO PASSO"}
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

            {/*=========================================
          SECTION 10: FAQ (12-Column Layout)
         =========================================*/}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto rounded-[28px] sm:rounded-[40px] bg-charcoal-950 border border-white/[0.04] p-4 sm:p-8 lg:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch relative z-10">
            {/* Left Side: Accordion Category selector */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-5 sm:space-y-8 text-left">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs sm:text-xs rounded-lg uppercase tracking-widest tag08-meta">
                  {copy?.faqEyebrow ?? "FAQ // ENCONTRE RESPOSTAS"}
                </div>
                <h2 className="font-display font-black text-[1.6rem] sm:text-4xl text-white leading-[0.95] tracking-tighter">
                  {copy ? (locale === "en" ? "Common questions about audiovisual production" : "Preguntas frecuentes sobre producción audiovisual") : "Dúvidas comuns sobre produção audiovisual"}
                </h2>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-sans max-w-sm">
                  {copy ? (locale === "en" ? "Before filming, it helps to understand the objective, context, format and future use of the material. These answers explain how TAG08 approaches the process." : "Antes de grabar, conviene entender el objetivo, el contexto, el formato y el uso posterior del material. Estas respuestas explican cómo TAG08 lleva adelante el proceso.") : "Antes de gravar, é importante entender objetivo, contexto, formato e uso posterior do material. Essas respostas ajudam a esclarecer como a TAG08 conduz esse processo."}
                </p>
              </div>

              <div className="space-y-2.5 sm:space-y-3 pt-3 sm:pt-4">
                {faqCategories.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-expanded={activeFaq === item.id}
                    aria-controls={`web-audiovisual-faq-panel-${item.id}`}
                    onClick={() => setActiveFaq(item.id)}
                    className={`w-full min-h-11 flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-colors duration-200 text-left group cursor-pointer active:scale-[0.99] ${
                      activeFaq === item.id
                        ? "bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)]"
                        : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                    }`}
                  >
                    <span className="tag08-meta text-xs sm:text-xs font-black uppercase tracking-wider flex items-center gap-2.5 sm:gap-3">
                      <span className={activeFaq === item.id ? "text-black" : "text-brand"}>
                        {String(item.id + 1).padStart(2, '0')}.
                      </span>
                      {copy?.faqCategories[item.id] ?? item.title}
                    </span>
                    <ArrowRight aria-hidden="true" className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 ${
                      activeFaq === item.id ? "text-black rotate-[-45deg] stroke-[2.5]" : "text-zinc-500"
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Central Side: Responsive image + Answer container */}
            <div className="lg:col-span-4 relative flex flex-col justify-end p-4 sm:p-6 min-h-[300px] sm:min-h-[380px] rounded-3xl overflow-hidden border border-white/[0.04] bg-charcoal-900">
              <ResilientImage
                fallbackLabel="Produção Audiovisual TAG08"
                sizes="(max-width: 1024px) 100vw, 34vw"
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800"
                alt="TAG08 Produção Audiovisual"
                className="object-cover grayscale brightness-[0.22] contrast-[1.1] transition-opacity duration-200 pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div aria-hidden="true" className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 pointer-events-none tag08-meta text-xs sm:text-xs text-white/20 uppercase tracking-widest leading-none">
                SYS // BROADCAST_FAQ
              </div>

              <div id={`web-audiovisual-faq-panel-${activeFaq}`} role="region" aria-labelledby={`web-audiovisual-faq-heading-${activeFaq}`} className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-4 sm:p-5 rounded-2xl space-y-2.5 sm:space-y-3 shadow-2xl text-left font-sans">
                <span className="tag08-meta text-xs sm:text-xs text-brand uppercase tracking-widest font-black block">
                  {copy?.faqCategories[activeFaq] ?? faqCategories[activeFaq].title}
                </span>
                
                <h3 id={`web-audiovisual-faq-heading-${activeFaq}`} className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {copy?.faqQuestions[activeFaq] ?? faqQuestions[activeFaq]}
                </h3>
                
                <p className="text-zinc-300 text-xs sm:text-xs leading-relaxed font-sans font-medium">
                  {copy?.faqAnswers[activeFaq] ?? faqAnswers[activeFaq]}
                </p>
              </div>
            </div>

            {/* Right Side: Proportional side cards */}
            <div className="lg:col-span-3 flex flex-col justify-between gap-3 sm:gap-4">
              <div className="bg-charcoal-900 border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-brand/20 transition-colors duration-200 text-left flex flex-col justify-between space-y-3 sm:space-y-4 flex-1">
                <div className="space-y-1.5 sm:space-y-2">
                  <span className="tag08-meta text-xs sm:text-xs text-zinc-300 uppercase tracking-widest block font-bold">{copy?.servicesFormats ?? "SERVIÇOS & FORMATOS"}</span>
                  <h3 className="text-white font-semibold text-sm leading-snug">{copy?.serviceCardTitle ?? "Planejamento e clareza"}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    {copy?.serviceCardDescription ?? "O processo começa entendendo o contexto da marca, a função do material e o uso esperado depois da gravação."}
                  </p>
                </div>
                <button
                  onClick={() => handleLinkClick("/servicos")}
                  type="button"
                  className="group min-h-11 flex items-center justify-between text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5 transition-colors duration-200"
                >
                  <span>{copy?.linkToServices ?? "VER SERVIÇOS"}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-brand text-black rounded-2xl p-4 sm:p-5 motion-safe:hover:scale-[1.01] transition-transform duration-200 text-left flex flex-col justify-between space-y-3 sm:space-y-4 flex-1">
                <div className="space-y-1.5 sm:space-y-2">
                  <span className="tag08-meta text-xs sm:text-xs text-black/80 uppercase tracking-widest block font-extrabold">{copy?.consultationBadge ?? "CONVERSA CONSULTIVA"}</span>
                  <h3 className="text-black font-black text-sm leading-tight tracking-tight">{copy?.consultationTitle ?? "Quer conversar sobre seu audiovisual?"}</h3>
                  <p className="text-black/85 text-xs font-semibold leading-relaxed font-sans">
                    {copy?.consultationDescription ?? "Sem pacote pronto. Primeiro entendemos contexto, objetivo e uso do material."}
                  </p>
                </div>
                <TrackedOutboundLink
                  label="Conversar sobre meu audiovisual"
                  surface="audiovisual-mobile-cta"
                  href={buildBrazilWhatsAppUrl(copy?.finalWhatsAppMessage ?? "Olá, quero entender qual formato audiovisual faz mais sentido para o momento da minha marca.")}
                  target="_blank"
                  rel="noreferrer"
                  className="group min-h-11 flex items-center justify-between text-xs font-sans font-bold text-black border-t border-black/10 pt-2 cursor-pointer select-none transition-colors duration-200"
                >
                  <span>{copy?.pageCta ?? "CONVERSAR SOBRE MEU AUDIOVISUAL"}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </TrackedOutboundLink>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
