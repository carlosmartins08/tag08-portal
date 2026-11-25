import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MessageSquare, Sparkles, TrendingUp, ArrowUpRight, ArrowRight, Users, Plus, Minus } from "../../../components/DooIcons";
import { buildBrazilWhatsAppUrl } from "../../../config/siteNetwork";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import ResilientImage from "../../../components/ResilientImage";
import TrackedOutboundLink from "../../../components/TrackedOutboundLink";
import { trackVideoEvent } from "../../../lib/analytics";
import { useSimulatorTracking } from "../../../lib/useSimulatorTracking";
import { useOfficialYouTubeVideos } from "../../../lib/useOfficialYouTubeVideos";
import type { RouteLocale } from "../../../config/routeRegistry";

type DiagnosticKey = "challenge" | "routine" | "channels" | "priority" | "formats" | "moment";
type DiagnosticAnswer = string | string[];

interface DiagnosticOption {
  value: string;
  label: string;
}

interface DiagnosticQuestion {
  key: DiagnosticKey;
  step: string;
  title: string;
  helper: string;
  multi?: boolean;
  options: DiagnosticOption[];
}

const EDITORIAL_DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    key: "challenge",
    step: "Etapa 01",
    title: "Qual é o principal desafio hoje?",
    helper: "Escolha a leitura que mais descreve o travamento atual.",
    options: [
      { value: "clarity", label: "Falta clareza" },
      { value: "consistency", label: "Falta consistência" },
      { value: "time", label: "Falta tempo" },
      { value: "direction", label: "Não sei por onde começar" }
    ]
  },
  {
    key: "routine",
    step: "Etapa 02",
    title: "Como a rotina atual funciona?",
    helper: "Queremos entender se existe fluxo, improviso ou pausa.",
    options: [
      { value: "none", label: "Ainda não existe" },
      { value: "improvised", label: "É improvisada" },
      { value: "partial", label: "Existe, mas é parcial" },
      { value: "reviewed", label: "Já existe com revisão" }
    ]
  },
  {
    key: "channels",
    step: "Etapa 03",
    title: "Quais canais vocês usam hoje?",
    helper: "Marque os canais que fazem parte da rotina da marca.",
    multi: true,
    options: [
      { value: "instagram", label: "Instagram" },
      { value: "tiktok", label: "TikTok" },
      { value: "linkedin", label: "LinkedIn" },
      { value: "youtube", label: "YouTube" },
      { value: "site-whatsapp", label: "Site e WhatsApp" }
    ]
  },
  {
    key: "priority",
    step: "Etapa 04",
    title: "Qual função principal a presença nas redes precisa cumprir agora?",
    helper: "Escolha a função principal da presença nas redes neste momento.",
    options: [
      { value: "authority", label: "Fortalecer percepção e autoridade" },
      { value: "recurrence", label: "Presença recorrente" },
      { value: "behind-scenes", label: "Mostrar bastidores e processo" },
      { value: "commercial-support", label: "Apoiar comunicação comercial" }
    ]
  },
  {
    key: "formats",
    step: "Etapa 05",
    title: "Quais formatos fazem sentido para a rotina atual?",
    helper: "Marque os formatos que podem fazer sentido para a comunicação atual. A escolha não significa inclusão automática no escopo.",
    multi: true,
    options: [
      { value: "reels", label: "Reels e cortes" },
      { value: "carousels", label: "Carrosséis" },
      { value: "testimonials", label: "Depoimentos" },
      { value: "institutional", label: "Vídeo institucional" },
      { value: "bastidores", label: "Bastidores" }
    ]
  },
  {
    key: "moment",
    step: "Etapa 06",
    title: "Qual é o momento da marca?",
    helper: "Isso ajuda a entender o nível de organização e a profundidade de apoio necessária.",
    options: [
      { value: "foundation", label: "Precisa organizar a base" },
      { value: "review", label: "Quer revisar a direção" },
      { value: "accelerate", label: "Quer avançar com mais consistência" },
      { value: "start", label: "Quer iniciar uma rotina" }
    ]
  }
];

const EDITORIAL_DIAGNOSTIC_STEP_COUNT = EDITORIAL_DIAGNOSTIC_QUESTIONS.length + 1;

const SOCIAL_COPY = {
  en: {
    heroBadge: "SOCIAL MEDIA MANAGEMENT // TAG08",
    heroTitle: "Social media",
    heroAccent: "with direction, an editorial line, and consistency.",
    heroDescription: "TAG08 organizes a brand’s social media presence through planning, an editorial line, formats, production, and follow-up, so content serves a clear role in communication and the commercial process.",
    talk: "TALK TO TAG08",
    startDiagnostic: "START THE EDITORIAL DIAGNOSTIC",
    imageAlt: "Social media content planning",
    imageFallback: "A directed presence with TAG08",
    diagnosticTitle: "Editorial diagnostic",
    diagnosticIntro: "Answer a few questions to understand the current moment, editorial priorities, and a possible next step.",
    diagnosticSectionHeading: "A first reading of what may be holding back your social media presence.",
    diagnosticSectionDescription: "The issue is not always posting too little. A digital presence can stall because of an unclear editorial line, an unsustainable cadence, an unclear message, inconsistent visuals, or an approval process that gets in the way.",
    selectedPlanMessage: "You indicated interest in",
    selectedPlanFollowup: "The diagnostic conversation helps determine whether this structure fits the brand’s current stage.",
    stepPrefix: "Editorial qualification",
    completed: "Completed",
    progressLabel: "Editorial qualification progress",
    diagnosticComplete: "Diagnostic complete",
    multiSelect: " You can select more than one option.",
    selectMany: "Select one or more options.",
    selectOne: "Select one option.",
    currentSelection: "Current selection:",
    finalStep: "Final step",
    contactTitle: "Where should we send this summary?",
    contactHint: "Your details are used so the conversation can continue with the context you just provided.",
    name: "Name",
    namePlaceholder: "Your name",
    consent: "I authorize TAG08 to use these answers to continue the conversation on WhatsApp, so I do not need to repeat everything.",
    completedLabel: "Diagnostic complete",
    summaryTitle: "Your summary is ready to send.",
    summaryIntro: "This summary helps TAG08 continue the conversation without repeating questions or losing context.",
    initialReading: "Initial reading",
    qualification: "Editorial qualification",
    challenge: "Main challenge",
    routine: "Current routine",
    channels: "Channels in use",
    priority: "Editorial priority",
    formats: "Formats of interest",
    moment: "Brand stage",
    nextRead: "Complete the answers to receive an initial reading and next step.",
    recommendationDirection: "Start with editorial direction, priority topics, and a sustainable routine before deciding on volume.",
    recommendationClarity: "Review the narrative, editorial priorities, and formats that explain the offer more clearly.",
    recommendationConsistency: "Organize cadence, review, and formats to reduce improvisation and sustain the brand’s presence.",
    recommendationNext: "The conversation can move on to scope, responsibilities, and a cadence that fits the current routine.",
    recommendationDefault: "TAG08 can help turn this reading into an editorial line, suitable formats, and clearer next steps.",
    reviewAnswers: "REVIEW ANSWERS",
    back: "BACK",
    whatsapp: "Share on WhatsApp",
    watchYoutube: "Watch on YouTube",
    heroImageLabel: "CONTENT AND FORMATS",
    heroImageTitle: "Content with direction and review",
    heroImageStatus: "CONTENT IN CONTEXT",
    signalsLabel: "Signs of misalignment",
    signalsTitle: "When social media",
    signalsAccent: "stops building presence.",
    signalsDescription: "Many brands publish frequently but still struggle to communicate clarity, consistency, or the right perception of value. The issue is not always a lack of content; it is often a lack of editorial direction, positioning, priorities, and production criteria.",
    signals: [
      ["Posts without direction", "Content goes out, but does not seem to build a clear narrative about the brand, its differentiators, or how it creates value."],
      ["A calendar without priorities", "A routine exists, but topics are chosen by urgency, trends, or improvisation, with no connection to a broader strategy."],
      ["Inconsistent visuals", "Each asset seems to follow a different logic, making recognition and continuity of the brand identity harder."],
      ["Little connection to sales", "Content may bring activity to the page, but does not help people better understand the offer, process, or next step."],
      ["Production that is hard to sustain", "The brand relies on one-off effort, disconnected ideas, and slow approvals, making its presence unstable."]
    ],
    deliverablesLabel: "What we organize",
    deliverablesTitle: "Social media management is more than a calendar. It needs editorial direction.",
    deliverablesDescription: "TAG08 organizes topics, formats, cadence, language, production, applied visual identity, and review so the brand’s social presence has coherence, continuity, and a role within its strategy.",
    deliverables: [
      ["Editorial line", "Topics, messages, pillars, and priorities that guide content before production."],
      ["A workable calendar", "A routine suited to the current stage, channels, team, and real approval capacity."],
      ["Content creation", "Production of the formats defined in scope, based on the approved editorial line."],
      ["Visual direction", "Consistent application of the brand identity to materials produced for the selected channels."],
      ["Follow-up and review", "Review of each cycle to adjust topics, language, formats, and priorities when needed."]
    ],
    plansLabel: "Recurring structures",
    plansTitle: "Structures for different stages of a business.",
    plansDescription: "Start, Base, and Performance address different needs and levels of participation. The diagnostic confirms fit before a proposal.",
    plans: [
      { name: "Start Plan", eyebrow: "STRATEGIC START", stage: "GUIDED START", subtitle: "For getting started with direction and greater client participation.", desc: "A coherent minimum structure to organize an initial digital presence, with direction and client participation. Recommendations consider the business’s needs and current stage, not only its size or budget.", includes: ["12 monthly posts for Instagram and Facebook, with monthly planning", "One monthly meeting with the planning team and basic organization of the digital presence", "Audiovisual capture is not included and is contracted separately when needed. The client normally participates in approvals and publishing."], support: "Another structure may make sense when the needs, routine, or ability to participate change." },
      { name: "Base Plan", eyebrow: "MONTHLY CONSISTENCY", stage: "ESTABLISHED ROUTINE", subtitle: "For active businesses that need to turn improvised communication into a routine.", desc: "For growing operations that need more resources, analysis, and distribution alongside recurring planning and production.", includes: ["12 monthly posts for Instagram and Facebook and one content capture session per month", "Strategic reports and analysis", "YouTube distribution using a transmedia approach when applicable", "One Google Ads campaign when there is a website and strategic fit; management is included when applicable, while the client pays the media budget."], support: "More channels and responsibilities may call for a different composition, depending on needs and operational capacity." },
      { name: "Performance Plan", eyebrow: "INTEGRATED OPERATION", stage: "BROADER COORDINATION", subtitle: "For brands that need more integration across planning, production, and follow-up.", desc: "A modular structure for operations that need customization, scale, measurement, and data-informed adaptation.", includes: ["At least 12 monthly posts, with no fixed cap; volume and formats evolve with needs and scope", "Channel-adapted assets and formats; blog posts when there is a website and strategic fit", "Multiple Google Ads and Meta Ads campaigns according to strategy; the client pays the media budget", "Measurement and optimization guided by data, objectives, and the business’s stage; expanding scope may adjust the fee."], support: "Recommended when the operation requires more coordination, not simply more volume." }
    ],
    scopeLabel: "SCOPE AND EXPECTATIONS",
    scopeTitle: "Scope changes with the contracted structure.",
    scopeDescription: "Start, Base, and Performance do not assign responsibilities in the same way. The proposal confirms formats, publishing, follow-up, channels, and responsibilities before work begins.",
    scopeNote: "The final composition is confirmed in the current proposal.",
    includedLabel: "MAY BE PART OF MANAGEMENT",
    included: ["Initial diagnostic or brief", "Planning and editorial line", "Calendar or schedule", "Assets, captions, and content included in scope", "Scripts and recording guidance", "Review and approval flow", "Publishing, when included in the proposal", "Follow-up, according to the contracted structure"],
    excludedLabel: "NOT INCLUDED AUTOMATICALLY",
    excluded: ["Paid media", "Customer service, comments, or inbox management", "On-site content capture", "Complete visual identity or rebranding", "Website, landing page, or funnel development", "Automations", "Unlimited support", "Urgent requests outside the cycle", "Guaranteed leads, sales, or growth"],
    scopeFooter: "Additional items depend on their own diagnostic, scope, capacity, and investment.",
    cycleLabel: "MONTHLY CYCLE",
    cycleTitle: "A methodical content routine.",
    cycleDescription: "The cycle organizes context, production, review, and learning to keep communication coherent without relying on last-minute urgency.",
    cycle: [["Review and planning", "We organize context, objectives, topics, priorities, and formats before production for the cycle."], ["Production", "We create the materials included in scope based on the editorial line and defined priorities."], ["Review and distribution", "We manage review and approval and, when included in the proposal, publishing on the selected channels."], ["Follow-up", "What we learn in each cycle helps guide future topics, formats, language, and adjustments."]],
    learningLabel: "REVIEW AND LEARNING",
    learningTitle: "We review the presence to improve editorial consistency",
    learningDescription: "Reviewing the work helps adjust topics, formats, cadence, and improvement areas without turning social media into a promise of results.",
    learning: [["More coherent presence", "The focus is to make communication clearer, more recognizable, and connected to the brand positioning."], ["Content review", "We assess whether formats support the narrative or simply take up space."], ["Audience understanding", "We assess whether content, formats, and messages help people better understand the brand, offer, and next step."], ["Ongoing adjustment", "Learning from each cycle helps refine topics, cadence, and editorial language."]],
    videoLabel: "VIDEO WITHIN THE EDITORIAL LINE",
    videoTitle: "Audiovisual content also needs a purpose.",
    videoDescription: "When it fits the strategy, video, behind-the-scenes, speaking segments, and edits expand the brand’s formats without breaking editorial coherence.",
    noVideos: "Official videos are not available in this language yet. Visit TAG08’s official YouTube channel for the source content.",
    sourceLabel: "OFFICIAL SOURCE",
    sourceDescription: "When available, content is synced from TAG08’s official channel and serves as a real reference for language, format, and production.",
    faqLabel: "Questions about social media management",
    faqTitle: "Before hiring, understand how management works.",
    faqDescription: "TAG08’s social media management organizes editorial direction, cadence, formats, creation, review, and follow-up to build a clearer and more consistent presence.",
    faq: [
      { id: 0, eyebrow: "Role of management", question: "Is social media management just post production?", answer: "No. Production is part of the work, but management starts with context, an editorial line, planning, formats, review, and follow-up." },
      { id: 1, eyebrow: "Choosing a plan", question: "What is the difference between Start, Base, and Performance?", answer: "Each addresses a different need, not just a quantity of assets. Start organizes an initial presence with 12 monthly posts for Instagram and Facebook, planning, and a monthly meeting; content capture is not included. Base adds one monthly capture session, reports and analysis, transmedia distribution on YouTube when applicable, and one Google Ads campaign when there is a website and strategic fit; management is included when applicable, but the client pays the media budget. Performance starts at 12 posts, without a fixed cap, and adapts channels, formats, and campaigns to data and objectives. The final composition is confirmed during the diagnostic and in the proposal." },
      { id: 2, eyebrow: "Publishing", question: "Does TAG08 publish the content?", answer: "It depends on the contracted structure. With Start, publishing normally remains with the client. Base and Performance may include publishing on selected channels, according to the current proposal." },
      { id: 3, eyebrow: "Video and capture", question: "Is video included in management?", answer: "Scripts, editing, and video content may be part of certain scopes. On-site capture is not included automatically and, when needed, is handled as a project or an additional engagement." },
      { id: 4, eyebrow: "Results", question: "Does TAG08 guarantee reach, leads, or sales?", answer: "No. TAG08 works to organize direction, consistency, production, and follow-up. Results also depend on the offer, market, customer service, investment, operations, and other variables." }
    ],
    howWeWork: "How we work",
    howWeWorkTitle: "Editorial direction, a workable cadence, and ongoing review.",
    howWeWorkDescription: "We reduce improvisation by organizing topics, formats, production, and review around the brand positioning and the operation’s actual capacity.",
    nextStep: "NEXT STEP",
    nextStepTitle: "The right path starts by understanding the current stage.",
    nextStepDescription: "The initial conversation organizes context, priorities, responsibilities, and fit before a proposal.",
    finalTitle: "A consistent presence starts with a routine the brand can sustain.",
    finalDescription: "TAG08 organizes editorial planning, formats, production, and follow-up according to the brand’s stage and the structure needed to sustain communication.",
    finalCta: "SEE WHETHER MANAGEMENT FITS"
  },
  es: {
    heroBadge: "GESTIÓN DE REDES SOCIALES // TAG08",
    heroTitle: "Redes sociales",
    heroAccent: "con dirección, línea editorial y constancia.",
    heroDescription: "TAG08 organiza la presencia de una marca en redes sociales mediante planificación, línea editorial, formatos, producción y seguimiento, para que el contenido cumpla una función clara en la comunicación y el proceso comercial.",
    talk: "HABLAR CON TAG08",
    startDiagnostic: "INICIAR EL DIAGNÓSTICO EDITORIAL",
    imageAlt: "Planificación de contenido para redes sociales",
    imageFallback: "Presencia con dirección TAG08",
    diagnosticTitle: "Diagnóstico editorial",
    diagnosticIntro: "Responde algunas preguntas para entender el momento actual, las prioridades editoriales y un posible siguiente paso.",
    diagnosticSectionHeading: "Una primera lectura de lo que puede estar frenando tu presencia en redes.",
    diagnosticSectionDescription: "El problema no siempre es publicar poco. La presencia digital puede estancarse por falta de línea editorial, una frecuencia difícil de sostener, un mensaje poco claro, falta de coherencia visual o un proceso de aprobación que dificulta el avance.",
    selectedPlanMessage: "Indicaste interés en",
    selectedPlanFollowup: "La conversación de diagnóstico ayuda a entender si esta estructura encaja con el momento actual de la marca.",
    stepPrefix: "Calificación editorial",
    completed: "Completada",
    progressLabel: "Progreso de la calificación editorial",
    diagnosticComplete: "Diagnóstico completado",
    multiSelect: " Puedes seleccionar más de una opción.",
    selectMany: "Selecciona una o varias opciones.",
    selectOne: "Selecciona una opción.",
    currentSelection: "Selección actual:",
    finalStep: "Paso final",
    contactTitle: "¿A quién enviamos este resumen?",
    contactHint: "Usaremos tus datos para que la conversación continúe con el contexto que acabas de completar.",
    name: "Nombre",
    namePlaceholder: "Tu nombre",
    consent: "Autorizo a TAG08 a usar estas respuestas para continuar la atención por WhatsApp y evitar que tenga que repetirlo todo.",
    completedLabel: "Diagnóstico completado",
    summaryTitle: "Tu resumen está listo para enviar.",
    summaryIntro: "Esta lectura permite que TAG08 continúe la conversación sin repetir preguntas ni perder el contexto.",
    initialReading: "Lectura inicial",
    qualification: "Calificación editorial",
    challenge: "Desafío principal",
    routine: "Rutina actual",
    channels: "Canales utilizados",
    priority: "Prioridad editorial",
    formats: "Formatos de interés",
    moment: "Momento de la marca",
    nextRead: "Completa las respuestas para recibir una lectura inicial y un siguiente paso.",
    recommendationDirection: "Empieza por la dirección editorial, los temas prioritarios y una rutina posible antes de pensar en volumen.",
    recommendationClarity: "Revisa la narrativa, las prioridades editoriales y los formatos que expliquen mejor la oferta.",
    recommendationConsistency: "Organiza la frecuencia, la revisión y los formatos para reducir la improvisación y sostener la presencia.",
    recommendationNext: "La conversación puede avanzar hacia el alcance, las responsabilidades y una frecuencia compatible con la rutina actual.",
    recommendationDefault: "TAG08 puede ayudar a convertir esta lectura en una línea editorial, formatos y próximos pasos más claros.",
    reviewAnswers: "REVISAR RESPUESTAS",
    back: "VOLVER",
    whatsapp: "Compartir por WhatsApp",
    watchYoutube: "Ver en YouTube",
    heroImageLabel: "CONTENIDO Y FORMATOS",
    heroImageTitle: "Contenido con dirección y revisión",
    heroImageStatus: "CONTENIDO EN CONTEXTO",
    signalsLabel: "Señales de desajuste",
    signalsTitle: "Cuando las redes sociales",
    signalsAccent: "dejan de construir presencia.",
    signalsDescription: "Muchas marcas publican con frecuencia, pero todavía no logran comunicar claridad, coherencia o una percepción adecuada de valor. El problema no siempre es la falta de contenido; muchas veces es la falta de línea editorial, posicionamiento, prioridades y criterios de producción.",
    signals: [
      ["Publicaciones sin dirección", "El contenido se publica, pero no parece construir una narrativa clara sobre la marca, sus diferenciales o su forma de generar valor."],
      ["Calendario sin prioridades", "Existe una rutina, pero los temas se definen por urgencia, tendencias o improvisación, sin conexión con una estrategia más amplia."],
      ["Falta de coherencia visual", "Cada pieza parece seguir una lógica distinta, lo que dificulta el reconocimiento y la continuidad de la identidad de marca."],
      ["Poca conexión con lo comercial", "El contenido puede generar actividad en la página, pero no ayuda a entender mejor la oferta, el proceso o el siguiente paso."],
      ["Producción difícil de sostener", "La marca depende de esfuerzos puntuales, ideas sueltas y aprobaciones lentas, lo que vuelve inestable su presencia."]
    ],
    deliverablesLabel: "Qué organizamos",
    deliverablesTitle: "La gestión de redes no es solo un calendario. Es dirección editorial.",
    deliverablesDescription: "TAG08 organiza temas, formatos, frecuencia, lenguaje, producción, aplicación de identidad visual y revisión para que la presencia de la marca en redes tenga coherencia, continuidad y una función dentro de la estrategia.",
    deliverables: [
      ["Línea editorial", "Definición de temas, mensajes, pilares y prioridades que orientan el contenido antes de producirlo."],
      ["Calendario viable", "Organización de una rutina compatible con el momento, los canales, el equipo y la capacidad real de aprobación."],
      ["Creación de contenido", "Producción de los formatos previstos en el alcance a partir de la línea editorial aprobada."],
      ["Dirección visual", "Aplicación coherente de la identidad de marca en los materiales para los canales definidos."],
      ["Seguimiento y revisión", "Lectura de cada ciclo para ajustar temas, lenguaje, formatos y prioridades cuando sea necesario."]
    ],
    plansLabel: "Estructuras recurrentes",
    plansTitle: "Estructuras para distintos momentos del negocio.",
    plansDescription: "Start, Base y Performance responden a necesidades y niveles de participación diferentes. El diagnóstico confirma la adecuación antes de la propuesta.",
    plans: [
      { name: "Plan Start", eyebrow: "INICIO ESTRATÉGICO", stage: "INICIO ORIENTADO", subtitle: "Para empezar con dirección y mayor participación del cliente.", desc: "Estructura mínima coherente para organizar una presencia digital inicial, con dirección y participación del cliente. La recomendación considera las necesidades y el momento del negocio, no solo su tamaño o presupuesto.", includes: ["12 publicaciones mensuales para Instagram y Facebook, con planificación mensual", "Una reunión mensual con el equipo de planificación y organización básica de la presencia digital", "La captación audiovisual no está incluida y se contrata por separado cuando sea necesaria. Normalmente, el cliente participa en las aprobaciones y la publicación."], support: "Otra estructura puede tener sentido si cambian las necesidades, la rutina o la capacidad de participación." },
      { name: "Plan Base", eyebrow: "CONSTANCIA MENSUAL", stage: "RUTINA CONSOLIDADA", subtitle: "Para negocios activos que necesitan convertir la comunicación improvisada en una rutina.", desc: "Para operaciones en crecimiento que necesitan más recursos, análisis y distribución, además de planificación y producción recurrentes.", includes: ["12 publicaciones mensuales para Instagram y Facebook y una sesión mensual de captación de contenido", "Informes y análisis estratégicos", "Distribución en YouTube con lógica transmedia cuando corresponda", "Una campaña de Google Ads cuando haya sitio web y pertinencia estratégica; la gestión se incluye cuando corresponda y el cliente paga la inversión en medios."], support: "Más canales y responsabilidades pueden requerir otra composición, según las necesidades y la capacidad operativa." },
      { name: "Plan Performance", eyebrow: "OPERACIÓN INTEGRADA", stage: "COORDINACIÓN AMPLIADA", subtitle: "Para marcas que necesitan más integración entre planificación, producción y seguimiento.", desc: "Estructura modular para operaciones que necesitan personalización, escala, medición y adaptación basada en datos.", includes: ["Mínimo de 12 publicaciones mensuales, sin límite fijo; el volumen y los formatos evolucionan según las necesidades y el alcance", "Activos y formatos adaptados a cada canal; artículos de blog cuando haya sitio web y pertinencia estratégica", "Varias campañas en Google Ads y Meta Ads según la estrategia; el cliente paga la inversión en medios", "Medición y optimización guiadas por datos, objetivos y el momento del negocio; ampliar el alcance puede ajustar el valor."], support: "Recomendado cuando la operación necesita más coordinación, no solo más volumen." }
    ],
    scopeLabel: "ALCANCE Y EXPECTATIVAS",
    scopeTitle: "El alcance cambia según la estructura contratada.",
    scopeDescription: "Start, Base y Performance distribuyen las responsabilidades de forma diferente. La propuesta confirma formatos, publicación, seguimiento, canales y responsabilidades antes de empezar.",
    scopeNote: "La composición final se confirma en la propuesta vigente.",
    includedLabel: "PUEDE FORMAR PARTE DE LA GESTIÓN",
    included: ["Diagnóstico o brief inicial", "Planificación y línea editorial", "Calendario o cronograma", "Piezas, textos y contenidos previstos en el alcance", "Guiones y orientación para grabaciones", "Flujo de revisión y aprobación", "Publicación, cuando esté prevista en la propuesta", "Seguimiento según la estructura contratada"],
    excludedLabel: "NO SE INCLUYE AUTOMÁTICAMENTE",
    excluded: ["Publicidad paga", "Gestión de atención al cliente, comentarios o mensajes", "Captación presencial", "Identidad visual completa o rebranding", "Sitio web, landing page o desarrollo de embudo", "Automatizaciones", "Atención ilimitada", "Urgencias fuera del ciclo", "Garantía de leads, ventas o crecimiento"],
    scopeFooter: "Los elementos adicionales dependen de un diagnóstico, alcance, capacidad e inversión propios.",
    cycleLabel: "CICLO MENSUAL",
    cycleTitle: "Una rutina de contenido con método.",
    cycleDescription: "El ciclo organiza contexto, producción, revisión y aprendizajes para mantener una comunicación coherente sin depender de urgencias de último momento.",
    cycle: [["Lectura y planificación", "Organizamos contexto, objetivos, temas, prioridades y formatos antes de producir el ciclo."], ["Producción", "Desarrollamos los materiales previstos en el alcance a partir de la línea editorial y las prioridades definidas."], ["Revisión y distribución", "Conducimos la revisión y aprobación y, cuando esté previsto en la propuesta, la publicación en los canales definidos."], ["Seguimiento", "Los aprendizajes del ciclo ayudan a orientar temas, formatos, lenguaje y ajustes futuros."]],
    learningLabel: "LECTURA Y APRENDIZAJE",
    learningTitle: "Seguimos la presencia para mejorar la coherencia editorial",
    learningDescription: "La lectura del trabajo sirve para ajustar temas, formatos, frecuencia y oportunidades de mejora sin convertir las redes sociales en una promesa de resultados.",
    learning: [["Presencia más coherente", "El objetivo es que la comunicación sea más clara, reconocible y conectada con el posicionamiento de la marca."], ["Lectura del contenido", "Observamos si los formatos ayudan a sostener la narrativa o solo ocupan espacio."], ["Acercamiento al público", "Observamos si los contenidos, formatos y mensajes ayudan a entender mejor la marca, la oferta y el siguiente paso."], ["Ajuste continuo", "Los aprendizajes de cada ciclo ayudan a afinar temas, frecuencia y lenguaje editorial."]],
    videoLabel: "VIDEO DENTRO DE LA LÍNEA EDITORIAL",
    videoTitle: "El contenido audiovisual también necesita cumplir una función.",
    videoDescription: "Cuando tiene sentido para la estrategia, los videos, bastidores, intervenciones y recortes amplían los formatos de la marca sin romper la coherencia editorial.",
    noVideos: "Los videos oficiales todavía no están disponibles en este idioma. Visita el canal oficial de TAG08 en YouTube para consultar el contenido fuente.",
    sourceLabel: "FUENTE OFICIAL",
    sourceDescription: "Cuando están disponibles, los contenidos se sincronizan desde el canal oficial de TAG08 y sirven como referencia real de lenguaje, formato y producción.",
    faqLabel: "Dudas sobre gestión de redes",
    faqTitle: "Antes de contratar, entiende cómo funciona la gestión.",
    faqDescription: "La gestión de redes de TAG08 organiza línea editorial, frecuencia, formatos, creación, revisión y seguimiento para construir una presencia más clara y coherente.",
    faq: [
      { id: 0, eyebrow: "Función de la gestión", question: "¿La gestión de redes sociales consiste solo en producir publicaciones?", answer: "No. La producción forma parte del servicio, pero la gestión empieza con contexto, línea editorial, planificación, formatos, revisión y seguimiento." },
      { id: 1, eyebrow: "Elección del plan", question: "¿Cuál es la diferencia entre Start, Base y Performance?", answer: "Cada uno responde a una necesidad distinta, no solo a una cantidad de piezas. Start organiza una presencia inicial con 12 publicaciones mensuales para Instagram y Facebook, planificación y una reunión mensual; no incluye captación. Base añade una sesión mensual de captación, informes y análisis, distribución transmedia en YouTube cuando corresponda y una campaña de Google Ads cuando haya sitio web y pertinencia estratégica; la gestión se incluye cuando corresponda, pero el cliente paga la inversión en medios. Performance parte de al menos 12 publicaciones, sin límite fijo, y adapta canales, formatos y campañas a los datos y objetivos. La composición final se confirma en el diagnóstico y la propuesta." },
      { id: 2, eyebrow: "Publicación", question: "¿TAG08 publica los contenidos?", answer: "Depende de la estructura contratada. En Start, normalmente la publicación queda a cargo del cliente. Base y Performance pueden incluir publicación en los canales definidos según la propuesta vigente." },
      { id: 3, eyebrow: "Video y captación", question: "¿Los videos forman parte de la gestión?", answer: "Los guiones, la edición y los contenidos en video pueden formar parte de ciertos alcances. La captación presencial no se incluye automáticamente y, si es necesaria, se gestiona como proyecto o contratación complementaria." },
      { id: 4, eyebrow: "Resultados", question: "¿TAG08 garantiza alcance, leads o ventas?", answer: "No. TAG08 trabaja para organizar dirección, coherencia, producción y seguimiento. Los resultados también dependen de la oferta, el mercado, la atención, la inversión, la operación y otras variables." }
    ],
    howWeWork: "Cómo trabajamos",
    howWeWorkTitle: "Línea editorial, una frecuencia posible y revisión continua.",
    howWeWorkDescription: "Reducimos la improvisación al organizar temas, formatos, producción y revisión según el posicionamiento y la capacidad real de la operación.",
    nextStep: "SIGUIENTE PASO",
    nextStepTitle: "El mejor camino empieza por entender el momento actual.",
    nextStepDescription: "La conversación inicial organiza contexto, prioridades, responsabilidades y adecuación antes de la propuesta.",
    finalTitle: "Una presencia coherente empieza con una rutina que la marca puede sostener.",
    finalDescription: "TAG08 organiza planificación editorial, formatos, producción y seguimiento según el momento de la marca y la estructura necesaria para sostener la comunicación.",
    finalCta: "ENTENDER SI LA GESTIÓN TIENE SENTIDO"
  }
} as const;

const QUESTION_COPY = {
  en: {
    challenge: { step: "Step 01", title: "What is the main challenge right now?", helper: "Choose the option that best describes what is currently holding things back.", options: ["We need more clarity", "We need more consistency", "We lack time", "We are not sure where to start"] },
    routine: { step: "Step 02", title: "How does the current routine work?", helper: "We want to understand whether there is a process, improvisation, or a pause.", options: ["There is no routine yet", "It is improvised", "It exists, but only partly", "It exists and is reviewed"] },
    channels: { step: "Step 03", title: "Which channels do you use today?", helper: "Select the channels that are part of the brand’s current routine.", options: ["Instagram", "TikTok", "LinkedIn", "YouTube", "Website and WhatsApp"] },
    priority: { step: "Step 04", title: "What should your social media presence do right now?", helper: "Choose the main role social media should play at this stage.", options: ["Strengthen perception and authority", "Maintain a recurring presence", "Show behind the scenes and process", "Support commercial communication"] },
    formats: { step: "Step 05", title: "Which formats fit the current routine?", helper: "Select formats that may suit the current communication. Selection does not mean they are automatically included in scope.", options: ["Reels and short clips", "Carousels", "Testimonials", "Institutional video", "Behind the scenes"] },
    moment: { step: "Step 06", title: "What stage is the brand at?", helper: "This helps us understand the level of organization and depth of support needed.", options: ["Needs to organize the foundation", "Wants to review its direction", "Wants to move forward more consistently", "Wants to start a routine"] }
  },
  es: {
    challenge: { step: "Etapa 01", title: "¿Cuál es el principal desafío hoy?", helper: "Elige la opción que mejor describa lo que está frenando el avance.", options: ["Falta claridad", "Falta constancia", "Falta tiempo", "No sé por dónde empezar"] },
    routine: { step: "Etapa 02", title: "¿Cómo funciona la rutina actual?", helper: "Queremos entender si existe un flujo, improvisación o una pausa.", options: ["Todavía no existe", "Es improvisada", "Existe, pero es parcial", "Existe y se revisa"] },
    channels: { step: "Etapa 03", title: "¿Qué canales utilizan hoy?", helper: "Marca los canales que forman parte de la rutina actual de la marca.", options: ["Instagram", "TikTok", "LinkedIn", "YouTube", "Sitio web y WhatsApp"] },
    priority: { step: "Etapa 04", title: "¿Qué función debe cumplir ahora la presencia en redes?", helper: "Elige la función principal de la presencia en redes en este momento.", options: ["Fortalecer la percepción y la autoridad", "Mantener una presencia recurrente", "Mostrar bastidores y procesos", "Apoyar la comunicación comercial"] },
    formats: { step: "Etapa 05", title: "¿Qué formatos encajan con la rutina actual?", helper: "Marca los formatos que pueden servir para la comunicación actual. La selección no implica que se incluyan automáticamente en el alcance.", options: ["Reels y clips", "Carruseles", "Testimonios", "Video institucional", "Bastidores"] },
    moment: { step: "Etapa 06", title: "¿En qué momento está la marca?", helper: "Esto ayuda a entender el nivel de organización y la profundidad de apoyo necesaria.", options: ["Necesita organizar la base", "Quiere revisar la dirección", "Quiere avanzar con más constancia", "Quiere iniciar una rutina"] }
  }
} as const;

const getDiagnosticQuestion = (key: DiagnosticKey, locale: RouteLocale = "pt"): DiagnosticQuestion | undefined => {
  const question = EDITORIAL_DIAGNOSTIC_QUESTIONS.find((item) => item.key === key);
  if (!question || locale === "pt") return question;
  const localized = QUESTION_COPY[locale][key];
  return {
    ...question,
    ...localized,
    options: question.options.map((option, index) => ({ ...option, label: localized.options[index] }))
  };
};

const getPendingAnswerLabel = (locale: RouteLocale) =>
  locale === "en" ? "Awaiting an answer" : locale === "es" ? "Esperando respuesta" : "Aguardando resposta";

const getDiagnosticValueLabel = (key: DiagnosticKey, value: DiagnosticAnswer, locale: RouteLocale = "pt") => {
  const question = getDiagnosticQuestion(key, locale);
  if (!question) {
    return getPendingAnswerLabel(locale);
  }

  if (Array.isArray(value)) {
    if (!value.length) {
      return getPendingAnswerLabel(locale);
    }

    return value
      .map((item) => question.options.find((option) => option.value === item)?.label ?? item)
      .join(" • ");
  }

  return question.options.find((option) => option.value === value)?.label ?? getPendingAnswerLabel(locale);
};

const buildDiagnosticRecommendation = ({
  challenge,
  routine,
  moment,
  locale,
}: {
  challenge: string;
  routine: string;
  moment: string;
  locale: RouteLocale;
}) => {
  if (locale !== "pt") {
    const copy = SOCIAL_COPY[locale];
    if (!challenge || !routine || !moment) return copy.nextRead;
    if (challenge === "direction" || routine === "none") return copy.recommendationDirection;
    if (challenge === "clarity" || moment === "review") return copy.recommendationClarity;
    if (challenge === "consistency" || routine === "improvised") return copy.recommendationConsistency;
    if (moment === "accelerate") return copy.recommendationNext;
    return copy.recommendationDefault;
  }
  if (!challenge || !routine || !moment) {
    return "Complete as respostas para gerar a leitura final e o próximo passo.";
  }

  if (challenge === "direction" || routine === "none") {
    return "Começar por direção editorial, temas prioritários e uma rotina possível antes de pensar em volume.";
  }

  if (challenge === "clarity" || moment === "review") {
    return "Revisar narrativa, prioridade editorial e formatos que expliquem melhor a oferta.";
  }

  if (challenge === "consistency" || routine === "improvised") {
    return "Organizar frequência, revisão e formatos para reduzir improviso e sustentar presença.";
  }

  if (moment === "accelerate") {
    return "A conversa pode avançar para escopo, responsabilidades e cadência compatíveis com a rotina atual.";
  }

  return "A TAG08 pode ajudar a transformar esta leitura em linha editorial, formatos e próximos passos mais claros.";
};

interface SocialMediaProps {
  onNavigate: (page: string) => void;
  locale?: RouteLocale;
}

export default function GestaoRedesSociais({ onNavigate, locale = "pt" }: SocialMediaProps) {
  const copy = locale === "pt" ? null : SOCIAL_COPY[locale];
  const prefersReducedMotion = useReducedMotion();
  const diagnosticHeadingRef = useRef<HTMLHeadingElement>(null);
  const diagnosticHasMounted = useRef(false);
  const [activeFaq, setActiveFaq] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [diagnosticStep, setDiagnosticStep] = useState(0);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<Record<DiagnosticKey, DiagnosticAnswer>>({
    challenge: "",
    routine: "",
    channels: [],
    priority: "",
    formats: [],
    moment: ""
  });
  const [diagnosticName, setDiagnosticName] = useState("");
  const [diagnosticWhatsapp, setDiagnosticWhatsapp] = useState("");
  const [diagnosticConsent, setDiagnosticConsent] = useState(false);
  const trackSimulator = useSimulatorTracking("social_editorial_diagnostic", 1, "/servicos/gestao-de-redes-sociais");

  const isContactStep = diagnosticStep === EDITORIAL_DIAGNOSTIC_QUESTIONS.length;
  const isDiagnosticComplete = diagnosticStep === EDITORIAL_DIAGNOSTIC_STEP_COUNT;
  const diagnosticProgress = Math.round((Math.min(diagnosticStep, EDITORIAL_DIAGNOSTIC_STEP_COUNT) / EDITORIAL_DIAGNOSTIC_STEP_COUNT) * 100);
  const activeDiagnosticQuestion = isContactStep || isDiagnosticComplete
    ? null
    : getDiagnosticQuestion(EDITORIAL_DIAGNOSTIC_QUESTIONS[diagnosticStep].key, locale);
  const activeDiagnosticAnswer = activeDiagnosticQuestion
    ? diagnosticAnswers[activeDiagnosticQuestion.key]
    : "";
  const activeDiagnosticSelectedValues = Array.isArray(activeDiagnosticAnswer)
    ? activeDiagnosticAnswer
    : activeDiagnosticAnswer
      ? [activeDiagnosticAnswer]
      : [];
  const activeDiagnosticSelectedLabels = activeDiagnosticQuestion
    ? getDiagnosticValueLabel(activeDiagnosticQuestion.key, activeDiagnosticAnswer, locale)
    : getPendingAnswerLabel(locale);
  const hasActiveDiagnosticSelection = activeDiagnosticSelectedLabels !== getPendingAnswerLabel(locale);
  const challengeLabel = getDiagnosticValueLabel("challenge", diagnosticAnswers.challenge, locale);
  const routineLabel = getDiagnosticValueLabel("routine", diagnosticAnswers.routine, locale);
  const channelsLabel = getDiagnosticValueLabel("channels", diagnosticAnswers.channels, locale);
  const priorityLabel = getDiagnosticValueLabel("priority", diagnosticAnswers.priority, locale);
  const formatsLabel = getDiagnosticValueLabel("formats", diagnosticAnswers.formats, locale);
  const momentLabel = getDiagnosticValueLabel("moment", diagnosticAnswers.moment, locale);
  const diagnosticReady = Boolean(
    challengeLabel !== getPendingAnswerLabel(locale) &&
    routineLabel !== getPendingAnswerLabel(locale) &&
    channelsLabel !== getPendingAnswerLabel(locale) &&
    priorityLabel !== getPendingAnswerLabel(locale) &&
    formatsLabel !== getPendingAnswerLabel(locale) &&
    momentLabel !== getPendingAnswerLabel(locale) &&
    diagnosticName.trim() &&
    diagnosticWhatsapp.trim() &&
    diagnosticConsent
  );
  const canContinueDiagnostic = activeDiagnosticQuestion
    ? hasActiveDiagnosticSelection
    : isContactStep
      ? diagnosticReady
      : false;
  const diagnosticRecommendation = buildDiagnosticRecommendation({
    challenge: diagnosticAnswers.challenge as string,
    routine: diagnosticAnswers.routine as string,
    moment: diagnosticAnswers.moment as string,
    locale
  });
  useEffect(() => {
    if (!diagnosticHasMounted.current) {
      diagnosticHasMounted.current = true;
      return;
    }
    diagnosticHeadingRef.current?.focus();
  }, [diagnosticStep]);
  const { videos: youtubeVideos, source: youtubeSource, isLoading: isYouTubeLoading } = useOfficialYouTubeVideos(3);
  const visibleVideos = locale === "pt" && youtubeSource === "live" ? youtubeVideos : [];
  const diagnosticSummaryCards = [
    { label: copy?.challenge ?? "Principal desafio", value: challengeLabel },
    { label: copy?.routine ?? "Rotina atual", value: routineLabel },
    { label: copy?.channels ?? "Canais usados", value: channelsLabel },
    { label: copy?.priority ?? "Prioridade editorial", value: priorityLabel },
    { label: copy?.formats ?? "Formatos de interesse", value: formatsLabel },
    { label: copy?.moment ?? "Momento da marca", value: momentLabel }
  ];
  const diagnosticMessage = locale === "en"
    ? `Hello TAG08! I completed the editorial diagnostic.\n\nEditorial diagnostic summary\n\nMain challenge: ${challengeLabel}\nCurrent routine: ${routineLabel}\nChannels in use: ${channelsLabel}\nEditorial priority: ${priorityLabel}\nFormats of interest: ${formatsLabel}\nBrand stage: ${momentLabel}\nStructure of interest: ${selectedPlan ?? "Not indicated yet"}\nName: ${diagnosticName.trim()}\nWhatsApp: ${diagnosticWhatsapp.trim()}\nConsent: ${diagnosticConsent ? "Authorized" : "Not authorized"}\n\nNext step: talk with TAG08 to understand the context, scope, and editorial direction.`
    : locale === "es"
      ? `¡Hola TAG08! Completé el diagnóstico editorial.\n\nResumen del diagnóstico editorial\n\nDesafío principal: ${challengeLabel}\nRutina actual: ${routineLabel}\nCanales utilizados: ${channelsLabel}\nPrioridad editorial: ${priorityLabel}\nFormatos de interés: ${formatsLabel}\nMomento de la marca: ${momentLabel}\nEstructura de interés: ${selectedPlan ?? "Todavía no indicada"}\nNombre: ${diagnosticName.trim()}\nWhatsApp: ${diagnosticWhatsapp.trim()}\nConsentimiento: ${diagnosticConsent ? "Autorizado" : "No autorizado"}\n\nSiguiente paso: conversar con TAG08 para entender el contexto, el alcance y la dirección editorial.`
      : `Olá TAG08! Concluí meu diagnóstico editorial.\n\nSeu diagnóstico editorial\n\nPrincipal desafio: ${challengeLabel}\nRotina atual: ${routineLabel}\nCanais usados: ${channelsLabel}\nPrioridade editorial: ${priorityLabel}\nFormatos desejados: ${formatsLabel}\nMomento da marca: ${momentLabel}\nEstrutura de interesse sinalizada: ${selectedPlan ?? "Ainda não indicada"}\nNome: ${diagnosticName.trim()}\nWhatsApp: ${diagnosticWhatsapp.trim()}\nConsentimento: ${diagnosticConsent ? "Autorizado" : "Não autorizado"}\n\nPróximo passo: conversar com a TAG08 para entender contexto, escopo e direção editorial.`;
  const diagnosticWhatsAppUrl = buildBrazilWhatsAppUrl(diagnosticMessage);
  const directWhatsAppUrl = buildBrazilWhatsAppUrl(encodeURIComponent(locale === "en"
    ? "Hello, I would like to understand how TAG08 can organize my brand’s social media presence."
    : locale === "es"
      ? "Hola, me gustaría entender cómo TAG08 puede organizar la presencia de mi marca en redes sociales."
      : "Olá, gostaria de entender como a TAG08 pode organizar a presença da minha marca nas redes sociais."));

  const scrollToEditorialDiagnostic = () => {
    document.getElementById("diagnostico-editorial")?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  };

  const setDiagnosticSingleAnswer = (key: Exclude<DiagnosticKey, "channels" | "formats">, value: string) => {
    trackSimulator("input_changed");
    setDiagnosticAnswers((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleDiagnosticMultiAnswer = (key: "channels" | "formats", value: string) => {
    trackSimulator("input_changed");
    setDiagnosticAnswers((prev) => {
      const current = Array.isArray(prev[key]) ? (prev[key] as string[]) : [];
      return {
        ...prev,
        [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
      };
    });
  };

  const handleDiagnosticAnswerSelect = (question: DiagnosticQuestion, optionValue: string) => {
    if (question.multi) {
      toggleDiagnosticMultiAnswer(question.key as "channels" | "formats", optionValue);
      return;
    }

    setDiagnosticSingleAnswer(question.key as Exclude<DiagnosticKey, "channels" | "formats">, optionValue);
  };

  const continueDiagnostic = () => {
    if (isDiagnosticComplete) return;

    if (isContactStep) {
      if (!diagnosticReady) return;
      setDiagnosticStep(EDITORIAL_DIAGNOSTIC_STEP_COUNT);
      return;
    }

    const question = EDITORIAL_DIAGNOSTIC_QUESTIONS[diagnosticStep];
    const value = diagnosticAnswers[question.key];
    const hasAnswer = Array.isArray(value) ? value.length > 0 : Boolean(value);
    if (!hasAnswer) return;

    setDiagnosticStep((current) => current + 1);
  };

  const goToPreviousDiagnosticStep = () => {
    if (diagnosticStep > 0) {
      setDiagnosticStep((current) => current - 1);
    }
  };

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  const signals = copy?.signals ?? [
    ["Postagens sem direção", "Os conteúdos saem, mas não parecem construir uma narrativa clara sobre a marca, seus diferenciais ou sua forma de gerar valor."],
    ["Calendário sem prioridade", "A rotina existe, mas os temas são definidos por urgência, tendência ou improviso, sem conexão com uma estratégia maior."],
    ["Visual sem consistência", "Cada peça parece seguir uma lógica diferente, dificultando reconhecimento e continuidade da identidade entre as publicações."],
    ["Pouca conexão com o comercial", "O conteúdo até movimenta a página, mas não ajuda o público a entender melhor a oferta, o processo ou o próximo passo."],
    ["Produção difícil de sustentar", "A marca depende de esforço pontual, ideias soltas e aprovações demoradas, tornando a presença instável."]
  ];
  const deliverables = copy?.deliverables ?? [
    ["Linha editorial", "Definição de temas, mensagens, pilares e prioridades que orientam o conteúdo antes da produção."],
    ["Calendário possível", "Organização de uma rotina compatível com o momento, os canais, a equipe e a capacidade real de aprovação."],
    ["Criação de conteúdo", "Produção dos formatos previstos no escopo a partir da linha editorial aprovada."],
    ["Direção visual", "Aplicação consistente da identidade da marca nos materiais produzidos para os canais definidos."],
    ["Acompanhamento e revisão", "Leitura do ciclo para ajustar temas, linguagem, formatos e prioridades quando necessário."]
  ];
  const plans = copy?.plans ?? [
    {
      name: "Plano Start",
      eyebrow: "ENTRADA ESTRATÉGICA",
      stage: "INÍCIO ORIENTADO",
      subtitle: "Para começar com direção e maior participação do cliente.",
      desc: "Estrutura mínima coerente para organizar uma presença digital inicial, com direção e participação do cliente. A indicação considera a necessidade e o momento do negócio, não apenas o porte ou o orçamento.",
      includes: ["12 posts mensais para Instagram e Facebook, com planejamento mensal", "Uma reunião mensal com a equipe de planejamento e organização básica da presença digital", "Captação audiovisual não incluída; quando necessária, é contratada separadamente. O cliente normalmente participa das aprovações e da publicação."],
      support: "Outra estrutura pode fazer sentido quando a necessidade, a rotina ou a capacidade de participação mudarem."
    },
    {
      name: "Plano Base",
      eyebrow: "CONSISTÊNCIA MENSAL",
      stage: "ROTINA CONSOLIDADA",
      subtitle: "Para negócios ativos que precisam transformar comunicação improvisada em rotina.",
      desc: "Para operações em crescimento que precisam de mais recursos, análise e distribuição, além de planejamento e produção recorrentes.",
      includes: ["12 posts mensais para Instagram e Facebook e uma captação de conteúdo por mês", "Relatórios e análises estratégicas", "Distribuição no YouTube por lógica transmídia quando aplicável", "Uma campanha de Google Ads quando houver site e pertinência estratégica; a gestão é incluída quando aplicável, e a verba de mídia é paga pelo cliente."],
      support: "Mais canais e responsabilidades podem pedir outra composição, conforme a necessidade e a capacidade de operação."
    },
    {
      name: "Plano Performance",
      eyebrow: "OPERAÇÃO INTEGRADA",
      stage: "COORDENAÇÃO AMPLIADA",
      subtitle: "Para marcas que precisam de maior integração entre planejamento, produção e acompanhamento.",
      desc: "Estrutura modular para operações que precisam de personalização, escala, mensuração e adaptação orientada por dados.",
      includes: ["Mínimo de 12 posts mensais, sem teto fixo; volume e formatos evoluem conforme a necessidade e o escopo", "Ativos e formatos adaptados por canal; blog posts quando houver site e pertinência", "Múltiplas campanhas em Google Ads e Meta Ads conforme estratégia; a verba de mídia é paga pelo cliente", "Mensuração e otimização orientadas por dados, objetivos e momento do negócio; ampliação de escopo pode ajustar o valor."],
      support: "Indicado quando a operação exige mais coordenação, não apenas mais volume."
    }
  ];
  const includedItems = copy?.included ?? ["Diagnóstico ou briefing inicial", "Planejamento e linha editorial", "Calendário ou cronograma", "Peças, legendas e conteúdos previstos no escopo", "Roteiros e direcionamentos de gravação", "Fluxo de revisão e aprovação", "Publicação, quando prevista na proposta", "Acompanhamento, conforme estrutura contratada"];
  const excludedItems = copy?.excluded ?? ["Tráfego pago", "Gestão de SAC, comentários ou inbox", "Captação presencial", "Identidade visual completa ou rebranding", "Site, landing page ou desenvolvimento de funil", "Automações", "Atendimento ilimitado", "Urgências fora do ciclo", "Garantia de leads, vendas ou crescimento"];
  const cycle = copy?.cycle ?? [["Leitura e planejamento", "Organizamos contexto, objetivos, temas, prioridades e formatos antes da produção do ciclo."], ["Produção", "Desenvolvemos os materiais previstos no escopo a partir da linha editorial e das prioridades definidas."], ["Revisão e distribuição", "Conduzimos revisão e aprovação e, quando previsto na proposta, publicação nos canais definidos."], ["Acompanhamento", "Os aprendizados do ciclo ajudam a orientar temas, formatos, linguagem e ajustes futuros."]];
  const learning = copy?.learning ?? [["Presença mais coerente", "O foco é tornar a comunicação mais clara, reconhecível e conectada ao posicionamento da marca."], ["Leitura de conteúdo", "Observamos se os formatos ajudam a sustentar a narrativa ou apenas ocupam espaço."], ["Aproximação do público", "Observamos se conteúdos, formatos e mensagens ajudam o público a compreender melhor a marca, a oferta e o próximo passo."], ["Ajuste contínuo", "Usamos os aprendizados do ciclo para refinar temas, frequência e linguagem editorial."]];
  const faqItems = copy?.faq ?? [
    {
      id: 0,
      eyebrow: "Função da gestão",
      question: "A gestão de redes sociais é só produção de posts?",
      answer:
        "Não. A produção faz parte da entrega, mas a gestão começa por contexto, linha editorial, planejamento, formatos, revisão e acompanhamento."
    },
    {
      id: 1,
      eyebrow: "Escolha do plano",
      question: "Qual é a diferença entre Start, Base e Performance?",
      answer:
        "Todos partem de uma necessidade diferente, não apenas de quantidade de peças. O Start organiza a presença inicial com 12 posts mensais para Instagram e Facebook, planejamento e reunião mensal; captação não está incluída. O Base acrescenta uma captação mensal, relatórios e análises, distribuição transmídia no YouTube quando aplicável e uma campanha de Google Ads quando houver site e pertinência; a gestão é incluída quando aplicável, mas a verba de mídia é do cliente. O Performance parte de pelo menos 12 posts, sem teto fixo, e adapta canais, formatos e campanhas aos dados e objetivos. A composição final é confirmada no diagnóstico e na proposta."
    },
    {
      id: 2,
      eyebrow: "Publicação",
      question: "A TAG08 publica os conteúdos?",
      answer:
        "Depende da estrutura contratada. No Start, a publicação normalmente fica com o cliente. Base e Performance podem incluir publicação nos canais definidos conforme a proposta vigente."
    },
    {
      id: 3,
      eyebrow: "Vídeo e captação",
      question: "Vídeos fazem parte da gestão?",
      answer:
        "Roteiros, edição e conteúdos em vídeo podem compor determinados escopos. Captação presencial não está incluída automaticamente e, quando necessária, é tratada como projeto ou contratação complementar."
    },
    {
      id: 4,
      eyebrow: "Resultados",
      question: "A TAG08 garante alcance, leads ou vendas?",
      answer:
        "Não. A TAG08 trabalha para organizar direção, consistência, produção e acompanhamento. Resultados também dependem de oferta, mercado, atendimento, investimento, operação e outras variáveis."
    }
  ];
  const activeFaqItem = faqItems[activeFaq] ?? faqItems[0];

  return (
    <div className="flex flex-col bg-charcoal-950 text-white min-h-screen pb-20 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-[8%] left-[-15%] w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] bg-brand/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle floating 3D element in the background of user focus */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Subtle3DCanvas intensity={1.3} className="absolute right-[-8%] top-[5%] w-[480px] h-[480px] opacity-[0.35] mix-blend-screen hidden lg:block" />
      </div>

      {/* SECTION 1 - HERO: THE EDITORIAL SYSTEM (Synchronized Style) */}
      <section className="order-1 tag08-section px-4 sm:px-6 md:px-8 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 lg:items-center text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta self-start">
                {copy?.heroBadge ?? "GESTÃO DE REDES SOCIAIS // TAG08"}
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter font-display">
                {copy?.heroTitle ?? "Redes sociais"} <br />
                <span className="text-brand">{copy?.heroAccent ?? "com direção, linha editorial e consistência."}</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-sm leading-relaxed font-sans font-medium">
                {copy?.heroDescription ?? "A TAG08 organiza a presença da marca nas redes sociais com planejamento, linha editorial, formatos, produção e acompanhamento para que o conteúdo deixe de ser postagem solta e passe a cumprir uma função clara na comunicação e no processo comercial."}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <TrackedOutboundLink
                  label="Falar com a TAG08"
                  surface="gestao-redes-hero"
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition-colors duration-200 hover:bg-brand-dark active:scale-[0.98]"
                >
                  {copy?.talk ?? "FALAR COM A TAG08"}
                  <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                </TrackedOutboundLink>
                <button
                  type="button"
                  onClick={scrollToEditorialDiagnostic}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-brand-secondary/40 px-6 py-3 text-xs font-black uppercase tracking-widest text-brand-secondary transition-colors duration-200 hover:bg-brand-secondary/10 active:scale-[0.98]"
                >
                  {copy?.startDiagnostic ?? "FAZER DIAGNÓSTICO EDITORIAL"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[4/3] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <ResilientImage
                sizes="(max-width: 1280px) 100vw, 1280px"
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600"
                alt={copy?.imageAlt ?? "Planejamento de conteúdo para redes sociais"}
                fallbackLabel={copy?.imageFallback ?? "Presença com direção TAG08"}
                preload
                className="object-cover grayscale brightness-50 transition-[filter] duration-200 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-12 left-6 right-6 flex items-end justify-between z-10 pointer-events-none sm:bottom-6">
                <div className="space-y-1">
                  <span className="tag08-meta text-xs text-brand-secondary tracking-widest block uppercase font-bold">{copy?.heroImageLabel ?? "CONTEÚDO E FORMATOS"}</span>
                  <span className="font-display font-black text-white text-xs sm:text-sm tracking-tight leading-none">{copy?.heroImageTitle ?? "Conteúdo com direção e revisão"}</span>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-xs text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>{copy?.heroImageStatus ?? "CONTEÚDO EM CONTEXTO"}</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

        </div>
      </section>

      {/* SECTION 2 - SEGMENTATION / QUANDO INVESTIR IN SOCIAL MEDIA */}
      <section className="order-2 tag08-section px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-900/10 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-4 space-y-4">
            <span className="tag08-meta text-xs text-zinc-300 uppercase tracking-widest block font-bold">{copy?.signalsLabel ?? "Sinais de desalinhamento"}</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white leading-none tracking-tight">
              {copy?.signalsTitle ?? "Quando as redes sociais"} <span className="text-brand">{copy?.signalsAccent ?? "deixam de construir presença."}</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              {copy?.signalsDescription ?? "Muitas marcas publicam com frequência, mas ainda não conseguem transmitir clareza, consistência ou percepção correta de valor. O problema nem sempre é falta de conteúdo; muitas vezes é falta de linha editorial, posicionamento, prioridade e critério de produção."}
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {signals.map(([title, description], index) => (
              <div key={title} className={`tag08-surface-card p-6 border hover:border-brand/40 rounded-3xl space-y-3 transition-colors duration-200 ${index === signals.length - 1 ? "sm:col-span-2" : ""}`}>
                <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">{title}</span>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* SECTION 3 - DELIVERABLES (The "What" with Clean Features Grid) */}
      <section className="order-3 tag08-section px-4 sm:px-6 md:px-8 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-bold">{copy?.deliverablesLabel ?? "O que organizamos"}</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              {copy?.deliverablesTitle ?? "Gestão de redes não é só calendário. É direção editorial."}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              {copy?.deliverablesDescription ?? "A TAG08 organiza temas, formatos, frequência, linguagem, produção, identidade visual aplicada e revisão para que a presença da marca nas redes sociais tenha coerência, continuidade e função dentro da estratégia."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left [&>*:last-child]:md:col-span-2 [&>*:last-child]:lg:col-span-1">
            {deliverables.map(([title, description], index) => {
              const DeliverableIcon = [Sparkles, MessageSquare, TrendingUp, Users, Sparkles][index];
              return (
                <div key={title} className="tag08-surface-card border hover:border-brand/40 rounded-3xl p-6 space-y-4 group transition-colors duration-200">
                  <div className="w-10 h-10 rounded-2xl bg-charcoal-950 border border-white/5 flex items-center justify-center">
                    <DeliverableIcon className="w-5 h-5 text-brand" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-white font-display font-black text-sm">{title}</h3>
                    <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">{description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* SECTION 4 - PLANOS DISPONaVEIS & COPES (Immediate Action Offerings) */}
      <section className="order-4 tag08-section px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-900/40 text-left">
        <div className="max-w-7xl mx-auto space-y-16 lg:space-y-20">
          
          {/* SECTION 4 - PLANOS DISPONIVEIS */}
          <div className="space-y-3 max-w-3xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              {copy?.plansLabel ?? "Estruturas recorrentes"}
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-white leading-tight">
              {copy?.plansTitle ?? "Conheça as estruturas para diferentes momentos do negócio."}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl">
              {copy?.plansDescription ?? "Start, Base e Performance respondem a necessidades e níveis de participação diferentes. O diagnóstico confirma a aderência antes da proposta."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                className="border rounded-3xl p-7 flex flex-col justify-between gap-8 transition-[border-color,box-shadow] duration-200 relative overflow-hidden bg-charcoal-900 border-white/[0.04]"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2 py-0.5 rounded font-black max-w-max">
                      {plan.eyebrow}
                    </span>
                    <span className="font-sans text-xs text-zinc-400 font-bold">{plan.stage}</span>
                  </div>

                  <h3 className="text-white font-display font-medium text-xl tracking-tight leading-none pt-2">{plan.name}</h3>
                  <p className="text-brand-secondary text-xs font-black uppercase tracking-[0.14em]">{plan.subtitle}</p>
                  <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">{plan.desc}</p>
                  <div className="space-y-3 rounded-2xl border border-white/[0.04] bg-white/[0.01] p-4">
                    <p className="tag08-meta text-xs font-black uppercase tracking-widest text-zinc-300">{locale === "en" ? "What this structure organizes" : locale === "es" ? "Qué organiza esta estructura" : "O que esta estrutura organiza"}</p>
                    <ul className="space-y-2">
                      {plan.includes.map((item) => (
                        <li key={item} className="flex gap-2 text-xs font-sans leading-relaxed text-zinc-300">
                          <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-secondary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-zinc-300 text-xs font-sans leading-relaxed border-l border-brand-secondary/30 pl-3">{plan.support}</p>
                </div>

                <div className="pt-6 border-t border-white/[0.04] mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlan(plan.name);
                      scrollToEditorialDiagnostic();
                    }}
                    aria-label={locale === "en" ? `Assess fit for ${plan.name}` : locale === "es" ? `Evaluar la adecuación de ${plan.name}` : `Avaliar adequação ao ${plan.name}`}
                    className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-brand-secondary/20 bg-brand-secondary/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-brand-secondary transition-colors duration-200 hover:bg-brand-secondary hover:text-black active:scale-[0.98]"
                  >
                    <span>{locale === "en" ? "UNDERSTAND THE SCOPE" : locale === "es" ? "ENTENDER EL ALCANCE" : "ENTENDER ESCOPO"}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Incluso x Não Incluso */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-12 border-t border-white/[0.04]">
            
            {/* Left intro details column */}
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
              <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                {copy?.scopeLabel ?? "LIMITES E EXPECTATIVAS"}
              </span>
              <h3 className="font-display font-medium text-3xl text-white tracking-tight">
                {copy?.scopeTitle ?? "O escopo muda conforme a estrutura contratada."}
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                {copy?.scopeDescription ?? "Start, Base e Performance não possuem a mesma divisão de responsabilidades. A proposta confirma formatos, publicação, acompanhamento, canais e responsabilidades antes do início."}
              </p>

              <div className="p-5 rounded-2xl bg-brand-secondary/[0.01] border border-white/[0.03] text-xs text-zinc-400 font-sans leading-relaxed">
                {copy?.scopeNote ?? "A composição final é confirmada na proposta vigente."}
              </div>
            </div>

            {/* Inclusions and Exclusions ledger boxes */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Incluso */}
              <div className="bg-charcoal-900 border border-white/[0.05] p-7 rounded-3xl space-y-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand/30" />
                <span className="font-sans text-xs text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2.5 py-1 rounded font-black uppercase inline-block">
                  {copy?.includedLabel ?? "PODE COMPOR A GESTÃO"}
                </span>
                
                <div className="space-y-3.5">
                  {includedItems.map((inc, index) => (
                    <div key={index} className="flex gap-3 text-xs text-zinc-300 font-sans items-start font-medium leading-relaxed font-semibold">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-1.5 shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Não incluso */}
              <div className="bg-charcoal-900 border border-white/[0.05] p-7 rounded-3xl space-y-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-zinc-600/30" />
                <span className="font-sans text-xs text-zinc-300 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded font-black uppercase inline-block">
                  {copy?.excludedLabel ?? "NÃO ENTRA AUTOMATICAMENTE"}
                </span>
                
                <div className="space-y-3.5">
                  {excludedItems.map((exc, index) => (
                    <div key={index} className="flex gap-3 text-xs text-zinc-400 font-sans items-start font-medium leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                      <span>{exc}</span>
                    </div>
                  ))}
                </div>
                
                <p className="text-xs text-zinc-300 font-sans leading-normal pt-2 border-t border-white/[0.03] uppercase">
                  {copy?.scopeFooter ?? "Itens complementares dependem de diagnóstico, escopo, capacidade e investimento próprios."}
                </p>
              </div>
            </div>
          </div>

          {/* Ciclo Mensal de Operação - CHRONOLOGICAL TIMELINE */}
          <div className="space-y-10 pt-12 border-t border-white/[0.04]">
            <div className="space-y-3">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                {copy?.cycleLabel ?? "CICLO MENSAL"}
              </span>
              <h3 className="font-display font-medium text-3xl text-white tracking-tight">
                {copy?.cycleTitle ?? "Uma rotina de conteúdo com método."}
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl">
                {copy?.cycleDescription ?? "O ciclo organiza contexto, produção, revisão e aprendizados para manter a comunicação coerente sem depender de urgência de última hora."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {cycle.map(([title, description], sIdx) => (
                <div key={sIdx} className="bg-charcoal-900 border border-white/[0.04] p-6 rounded-2xl text-left space-y-4 hover:border-brand/10 transition-colors duration-200">
                  <div className="font-sans text-xs font-black text-brand-secondary bg-brand-secondary/5 w-8 h-8 rounded-lg flex items-center justify-center border border-brand-secondary/10 shadow-[0_4px_10px_rgba(var(--color-brand-secondary-rgb),0.05)]">
                    0{sIdx + 1}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-white font-display font-bold text-xs sm:text-sm tracking-tight">{title}</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Relatórios e Aprendizados - ACTIVE DASHBOARD PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-12 border-t border-white/[0.04]">
            <div className="lg:col-span-5 space-y-4">
              <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md inline-block">
                {copy?.learningLabel ?? "LEITURA E APRENDIZADO"}
              </span>
              <h3 className="font-display font-medium text-3xl text-white tracking-tight">
                {copy?.learningTitle ?? "Acompanhamos a presença para melhorar a consistência editorial"}
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                {copy?.learningDescription ?? "A leitura do trabalho serve para ajustar temas, formatos, frequência e pontos de melhoria sem transformar redes sociais em promessa de resultado."}
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {learning.map(([title, description], iIdx) => (
                <div key={iIdx} className="p-5 rounded-2xl bg-charcoal-900/60 border border-white/[0.03] space-y-1.5 text-left hover:border-brand/10 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-brand-secondary" />
                  <h3 className="text-white text-xs sm:text-sm font-display font-bold tracking-tight">{title}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <div className="order-9">
        <ServiceInsightsBridge
          servicePath="/servicos/gestao-de-redes-sociais"
          onNavigate={onNavigate}
          locale={locale}
        />
      </div>

      {/* INTERACTIVE INNOVATION: SIMULADOR DE DIAGNÓSTICO EDITORIAL */}
      <section id="diagnostico-editorial" className="order-5 py-16 sm:py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 text-left relative overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-brand/[0.01] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              {copy?.diagnosticTitle ?? "Diagnóstico editorial"}
            </span>
            <h2 className="font-display font-medium text-3xl text-white tracking-tight">
              {copy?.diagnosticSectionHeading ?? "Leitura do que pode estar travando sua presença nas redes."}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
              {copy?.diagnosticSectionDescription ?? "Nem sempre o problema é postar pouco. Muitas vezes a presença digital trava por falta de linha editorial, frequência possível, clareza de mensagem, consistência visual ou processo de aprovação."}
            </p>
            {selectedPlan && (
              <p className="border-l border-brand-secondary/40 pl-3 text-xs font-sans leading-relaxed text-zinc-300">
                {copy?.selectedPlanMessage ?? "Você sinalizou interesse no"} <strong className="font-bold text-white">{selectedPlan}</strong>. {copy?.selectedPlanFollowup ?? "A conversa de diagnóstico ajuda a entender se essa estrutura faz sentido para o momento da marca."}
              </p>
            )}
          </div>

          <div className="mx-auto max-w-4xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-charcoal-950 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
            <div className="space-y-3 border-b border-white/[0.06] px-6 pb-5 pt-6 sm:px-10 sm:pt-8">
              <div className="flex items-center justify-between gap-4">
                <span aria-live="polite" className="tag08-meta text-xs text-zinc-400 tracking-wide">
                  {copy?.qualification ?? "Pré-qualificação editorial"} · {isDiagnosticComplete ? (copy?.completed ?? "Concluída") : `${copy?.stepPrefix ?? "Etapa"} ${diagnosticStep + 1} ${locale === "es" ? "de" : "of"} ${EDITORIAL_DIAGNOSTIC_STEP_COUNT}`}
                </span>
                <span className="tag08-meta text-xs text-zinc-400 tracking-wide">
                  {diagnosticProgress}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={copy?.progressLabel ?? "Progresso da pré-qualificação editorial"}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={diagnosticProgress}
                aria-valuetext={isDiagnosticComplete ? (copy?.diagnosticComplete ?? "Diagnóstico concluído") : `${copy?.stepPrefix ?? "Etapa"} ${diagnosticStep + 1} ${locale === "es" ? "de" : "of"} ${EDITORIAL_DIAGNOSTIC_STEP_COUNT}`}
                className="h-1 rounded-full bg-white/[0.06] overflow-hidden"
              >
                <div
                  className="h-full rounded-full bg-brand-secondary transition-[width] duration-200"
                  style={{ width: `${diagnosticProgress}%` }}
                />
              </div>
            </div>

            <div className="px-6 py-8 sm:px-10 sm:py-10">
              {activeDiagnosticQuestion && (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black block">
                      {activeDiagnosticQuestion.step}
                    </span>
                    <h3 ref={diagnosticHeadingRef} tabIndex={-1} className="font-display text-2xl font-medium tracking-tight text-white outline-none sm:text-3xl">
                      {activeDiagnosticQuestion.title}
                    </h3>
                    <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
                      {activeDiagnosticQuestion.helper}
                      {activeDiagnosticQuestion.multi && (copy?.multiSelect ?? " Você pode selecionar mais de uma opção.")}
                    </p>
                  </div>

                  <fieldset className="grid grid-cols-1 gap-3 border-0 p-0 sm:grid-cols-2">
                    <legend className="sr-only">
                      {activeDiagnosticQuestion.title}. {activeDiagnosticQuestion.multi ? (copy?.selectMany ?? "Selecione uma ou mais opções.") : (copy?.selectOne ?? "Selecione uma opção.")}
                    </legend>
                    {activeDiagnosticQuestion.options.map((option) => {
                      const isActive = activeDiagnosticSelectedValues.includes(option.value);
                      return (
                        <label
                          key={option.value}
                          className={`min-h-[76px] rounded-2xl border px-4 py-4 text-left text-sm leading-snug transition-[border-color,background-color,color] duration-200 cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-secondary focus-within:ring-offset-2 focus-within:ring-offset-charcoal-950 ${
                            isActive
                              ? "border-brand-secondary bg-brand-secondary/10 text-brand-secondary shadow-[0_12px_30px_rgba(var(--color-brand-secondary-rgb),0.08)]"
                              : "border-white/[0.10] bg-white/[0.015] text-zinc-200 hover:border-white/25 hover:bg-white/[0.035] hover:text-white"
                          }`}
                        >
                          <input
                            type={activeDiagnosticQuestion.multi ? "checkbox" : "radio"}
                            name={`diagnostic-${activeDiagnosticQuestion.key}`}
                            checked={isActive}
                            onChange={() => handleDiagnosticAnswerSelect(activeDiagnosticQuestion, option.value)}
                            className="sr-only"
                          />
                          {option.label}
                        </label>
                      );
                    })}
                  </fieldset>

                  {hasActiveDiagnosticSelection && (
                    <p className="tag08-meta text-xs uppercase tracking-widest text-brand-secondary">
                      {copy?.currentSelection ?? "Seleção atual:"} {activeDiagnosticSelectedLabels}
                    </p>
                  )}
                </div>
              )}

              {isContactStep && (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black block">
                      {copy?.finalStep ?? "Etapa final"}
                    </span>
                    <h3 ref={diagnosticHeadingRef} tabIndex={-1} className="font-display text-2xl font-medium tracking-tight text-white outline-none sm:text-3xl">
                      {copy?.contactTitle ?? "Para quem enviamos este resumo?"}
                    </h3>
                    <p id="diagnostic-contact-hint" className="max-w-2xl text-sm leading-relaxed text-zinc-400">
                      {copy?.contactHint ?? "Seus dados entram apenas para que a conversa continue com o contexto que você acabou de preencher."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label htmlFor="diagnostic-name" className="space-y-2">
                      <span className="tag08-meta text-xs text-zinc-400 tracking-wide block">{copy?.name ?? "Nome"}</span>
                      <input
                        id="diagnostic-name"
                        type="text"
                        name="name"
                        autoComplete="name"
                        required
                        aria-describedby="diagnostic-contact-hint"
                        value={diagnosticName}
                        onChange={(event) => setDiagnosticName(event.target.value)}
                        placeholder={copy?.namePlaceholder ?? "Seu nome"}
                        className="min-h-12 w-full rounded-2xl border border-white/[0.10] bg-white/[0.015] px-4 py-3 text-sm text-white placeholder-zinc-400 outline-none transition-colors focus:border-brand-secondary"
                      />
                    </label>

                    <label htmlFor="diagnostic-whatsapp" className="space-y-2">
                      <span className="tag08-meta text-xs text-zinc-400 tracking-wide block">WhatsApp</span>
                      <input
                        id="diagnostic-whatsapp"
                        type="tel"
                        name="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        required
                        aria-describedby="diagnostic-contact-hint"
                        value={diagnosticWhatsapp}
                        onChange={(event) => setDiagnosticWhatsapp(event.target.value)}
                        placeholder="+55 83 9XXXX-XXXX"
                        className="min-h-12 w-full rounded-2xl border border-white/[0.10] bg-white/[0.015] px-4 py-3 text-sm text-white placeholder-zinc-400 outline-none transition-colors focus:border-brand-secondary"
                      />
                    </label>
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.015] p-4">
                    <input
                      id="diagnostic-consent"
                      type="checkbox"
                      checked={diagnosticConsent}
                      onChange={(event) => setDiagnosticConsent(event.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-black/40 accent-brand"
                    />
                    <span className="text-xs leading-relaxed text-zinc-300">
                      {copy?.consent ?? "Autorizo a TAG08 a usar estas respostas para continuar o atendimento por WhatsApp e evitar que eu repita tudo depois."}
                    </span>
                  </label>
                </div>
              )}

              {isDiagnosticComplete && (
                <div className="space-y-7">
                  <div className="space-y-3">
                    <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black block">
                      {copy?.completedLabel ?? "Diagnóstico concluído"}
                    </span>
                    <h3 ref={diagnosticHeadingRef} tabIndex={-1} className="font-display text-2xl font-medium tracking-tight text-white outline-none sm:text-3xl">
                      {copy?.summaryTitle ?? "Seu resumo está pronto para enviar."}
                    </h3>
                    <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
                      {copy?.summaryIntro ?? "A leitura abaixo permite que a TAG08 continue a conversa sem repetir perguntas nem perder o contexto."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {diagnosticSummaryCards.map((card) => (
                      <div key={card.label} className="space-y-1.5 rounded-2xl border border-white/[0.08] bg-white/[0.015] p-4">
                        <span className="tag08-meta text-xs text-zinc-300 uppercase tracking-widest font-bold block">
                          {card.label}
                        </span>
                        <p className="text-sm font-semibold leading-snug text-white">{card.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 rounded-2xl border border-brand-secondary/20 bg-brand-secondary/[0.04] p-5">
                    <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black block">
                      {copy?.initialReading ?? "Leitura inicial"}
                    </span>
                    <p className="text-sm font-semibold leading-snug text-white">{diagnosticRecommendation}</p>
                    <p className="text-xs leading-relaxed text-zinc-400">
                      {locale === "en" ? "Fit for Start, Base, and Performance is confirmed during the diagnostic conversation." : locale === "es" ? "La adecuación de Start, Base y Performance se confirma durante la conversación de diagnóstico." : "A aderência entre Start, Base e Performance é confirmada na conversa de diagnóstico."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] bg-white/[0.015] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
              {isDiagnosticComplete ? (
                <button
                  type="button"
                  onClick={() => setDiagnosticStep(0)}
                  className="min-h-11 rounded-full border border-white/[0.10] px-5 tag08-meta text-xs font-black uppercase tracking-widest text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                >
                  {copy?.reviewAnswers ?? "Revisar respostas"}
                </button>
              ) : diagnosticStep > 0 ? (
                <button
                  type="button"
                  onClick={goToPreviousDiagnosticStep}
                  className="min-h-11 rounded-full border border-white/[0.10] px-5 tag08-meta text-xs font-black uppercase tracking-widest text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                >
                  {copy?.back ?? "Voltar"}
                </button>
              ) : (
                <span className="hidden sm:block" />
              )}

              {isDiagnosticComplete ? (
                  <TrackedOutboundLink
                    label="Enviar diagnóstico editorial por WhatsApp"
                    surface="gestao-redes-diagnostic-result"
                  href={diagnosticReady ? diagnosticWhatsAppUrl : "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-disabled={!diagnosticReady}
                  onClick={(event) => {
                    if (!diagnosticReady) {
                      event.preventDefault();
                    } else {
                      trackSimulator("cta_clicked");
                    }
                  }}
                  className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 tag08-meta text-xs font-black uppercase tracking-widest text-black transition-colors duration-200 hover:bg-brand-dark active:scale-[0.98]"
                >
                  <span>{copy?.whatsapp ?? "Compartilhar por WhatsApp"}</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5] transition-transform group-hover:translate-x-1" />
                  </TrackedOutboundLink>
              ) : (
                <button
                  type="button"
                  onClick={continueDiagnostic}
                  disabled={!canContinueDiagnostic}
                  className={`min-h-11 rounded-full px-5 tag08-meta text-xs font-black uppercase tracking-widest transition-[background-color,color,border-color] duration-200 ${
                    canContinueDiagnostic
                      ? "bg-brand text-black hover:bg-brand-dark"
                      : "cursor-not-allowed bg-white/[0.06] text-zinc-400"
                  }`}
                >
                  {isContactStep ? (locale === "en" ? "View summary" : locale === "es" ? "Ver resumen" : "Ver resumo") : (locale === "en" ? "Continue" : locale === "es" ? "Continuar" : "Continuar")}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* SHORTS & BASTIDORES PRODUCTION SHOWCASE */}
      <section className="order-8 px-4 sm:px-6 md:px-8 py-14 sm:py-20 border-b border-white/[0.04] bg-charcoal-900/20 text-left relative overflow-hidden">
        {/* Background visual accents */}
        <div className="absolute top-1/4 right-[10%] w-[350px] h-[350px] bg-brand/[0.01] rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-secondary/15 border border-brand-secondary/20 text-brand-secondary font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
                {copy?.videoLabel ?? "VÍDEO DENTRO DA LINHA EDITORIAL"}
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white leading-none tracking-tighter">
                {copy?.videoTitle ?? "Conteúdo audiovisual também precisa cumprir uma função."}
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                {copy?.videoDescription ?? "Quando faz sentido para a estratégia, vídeo, bastidores, falas e recortes ampliam os formatos da marca sem romper a coerência da linha editorial."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {isYouTubeLoading ? (
              <div
                role="status"
                aria-live="polite"
                aria-busy="true"
                className="sm:col-span-2 lg:col-span-3 rounded-[28px] border border-white/[0.06] bg-white/[0.02] p-6 text-xs sm:text-sm leading-relaxed text-zinc-400"
              >
                {locale === "en" ? "Loading official videos…" : locale === "es" ? "Cargando videos oficiales…" : "Carregando vídeos oficiais…"}
              </div>
            ) : visibleVideos.length > 0 ? visibleVideos.map((video) => (
              <motion.a
                key={video.id}
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackVideoEvent({
                    action: "selected",
                    video_id: video.embedCode,
                    video_source: "youtube",
                    surface: "social-media-shorts",
                    page_path: "/servicos/gestao-de-redes-sociais"
                  })
                }
                whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                className="group block rounded-[28px] overflow-hidden border border-white/[0.06] bg-white/[0.02] transition-[border-color,box-shadow] duration-200 hover:border-brand-secondary/45 hover:shadow-[0_18px_50px_rgba(var(--color-brand-secondary-rgb),0.08)]"
              >
                <div className="relative aspect-[16/10] bg-zinc-900">
                  <ResilientImage
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    src={video.thumbnail}
                    alt={video.title}
                    fallbackLabel="Vídeo oficial TAG08"
                    className="object-cover transition-[filter] duration-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/25" />

                  <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                    <span className="tag08-meta text-xs font-black uppercase tracking-[0.16em] text-brand-secondary">
                      CONTEÚDO RECENTE
                    </span>
                  </div>

                  <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                    <span className="tag08-meta text-xs font-black uppercase tracking-[0.16em] text-zinc-200">
                      YouTube oficial
                    </span>
                  </div>

                  <div className="absolute inset-x-4 bottom-4 space-y-2">
                    <span className="tag08-meta text-xs font-black uppercase tracking-[0.18em] text-brand-secondary/90">
                      {video.category}
                    </span>
                    <h3 className="font-display text-lg leading-tight font-black text-white">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs tag08-meta font-bold uppercase tracking-[0.18em] text-zinc-200">
                      <span>Assistir no YouTube</span>
                      <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              </motion.a>
            )) : (
              <div className="sm:col-span-2 lg:col-span-3 rounded-[28px] border border-white/[0.06] bg-white/[0.02] p-6 text-zinc-400 text-xs sm:text-sm leading-relaxed">
                {copy?.noVideos ?? "Nenhum vídeo oficial está disponível neste momento. Quando houver conteúdo publicado no canal oficial, ele aparecerá aqui."}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 border border-white/[0.05] bg-white/[0.02] rounded-[24px] p-5 sm:p-6">
            <span className="tag08-meta text-xs font-black uppercase tracking-[0.18em] text-brand-secondary">
              {copy?.sourceLabel ?? "Fonte oficial"}
            </span>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              {copy?.sourceDescription ?? "Quando disponíveis, os conteúdos são sincronizados do canal oficial da TAG08 e funcionam como referência real de linguagem, formato e produção."}
            </p>
          </div>

        </div>
      </section>

      {/* SECTION - FAQ */}
      <section className="order-6 py-16 sm:py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[40px] bg-charcoal-950 border border-white/[0.04] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
                  {copy?.faqLabel ?? "Dúvidas sobre gestão de redes"}
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter">
                  {copy?.faqTitle ?? <>Antes de contratar, <br /> entenda como a gestão funciona.</>}
                </h2>
                <p className="text-zinc-300 font-medium text-xs sm:text-xs leading-relaxed font-sans max-w-sm">
                  {copy?.faqDescription ?? "A gestão de redes sociais da TAG08 organiza linha editorial, frequência, formatos, criação, revisão e acompanhamento para construir uma presença mais clara e consistente."}
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {faqItems.map((item) => {
                  const isActive = activeFaq === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveFaq(item.id)}
                      aria-expanded={isActive}
                      aria-controls="gestao-redes-faq-panel"
                      className={`w-full min-h-[66px] flex items-center justify-between gap-4 px-4 py-4 rounded-xl border transition-[border-color,background-color,color] duration-200 text-left group cursor-pointer ${
                        isActive
                          ? "bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)]"
                          : "bg-white/[0.015] border-white/10 text-zinc-300 hover:text-white hover:border-white/20 hover:bg-white/[0.03]"
                      }`}
                    >
                      <span className="min-w-0 tag08-meta text-xs font-semibold uppercase tracking-wider flex items-center gap-3">
                        <span className={isActive ? "shrink-0 text-black" : "shrink-0 text-brand"}>
                          {String(item.id + 1).padStart(2, "0")}.
                        </span>
                        <span className="truncate">{item.question}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                          isActive
                            ? "border-black/15 bg-black/10 text-black"
                            : "border-white/10 bg-white/5 text-zinc-200 group-hover:text-white"
                        }`}
                      >
                        {isActive ? <Minus className="h-4 w-4 stroke-[2.5]" /> : <Plus className="h-4 w-4 stroke-[2.5]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[300px] sm:min-h-[360px] rounded-3xl overflow-hidden border border-white/[0.04] bg-charcoal-950">
              <ResilientImage
                sizes="(max-width: 1024px) 100vw, 34vw"
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800"
                alt={locale === "en" ? "Social media management planning" : locale === "es" ? "Planificación de gestión de redes sociales" : "Planejamento de gestão de redes sociais"}
                fallbackLabel={locale === "en" ? "TAG08 social media management" : locale === "es" ? "Gestión de redes sociales TAG08" : "Gestão de redes TAG08"}
                className="object-cover grayscale brightness-[0.22] contrast-[1.1] pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div aria-hidden="true" className="absolute top-6 left-6 z-10 pointer-events-none tag08-meta text-xs text-white/50 uppercase tracking-widest leading-none">
                {locale === "en" ? "SOCIAL MEDIA MANAGEMENT" : locale === "es" ? "GESTIÓN DE REDES" : "GESTÃO DE REDES"}
              </div>

              <div
                id="gestao-redes-faq-panel"
                role="region"
                aria-labelledby="gestao-redes-faq-panel-heading"
                aria-live="polite"
                aria-atomic="true"
                className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left"
              >
                <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black block">
                  {activeFaqItem.eyebrow}
                </span>

                <h3 id="gestao-redes-faq-panel-heading" className="text-white font-semibold text-sm sm:text-base leading-tight border-b border-white/5 pb-2">
                  {activeFaqItem.question}
                </h3>

                <p className="text-zinc-300 text-xs sm:text-xs leading-relaxed font-sans font-medium">
                  {activeFaqItem.answer}
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              <div className="bg-charcoal-900 border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-colors duration-200 text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-zinc-300 uppercase tracking-widest block font-bold">{copy?.howWeWork ?? "Como agimos"}</span>
                  <h3 className="text-white font-semibold text-sm leading-snug">{copy?.howWeWorkTitle ?? "Linha editorial, frequência possível e revisão contínua."}</h3>
                  <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                    {copy?.howWeWorkDescription ?? "Reduzimos improviso organizando temas, formatos, produção e revisão de acordo com o posicionamento e a capacidade real da operação."}
                  </p>
                </div>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 transition-colors duration-200 text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-black/60 uppercase tracking-widest block font-extrabold">{copy?.nextStep ?? "Próximo passo"}</span>
                  <h3 className="text-black font-black text-sm leading-tight tracking-tight">{copy?.nextStepTitle ?? "O melhor caminho começa pelo entendimento do momento atual."}</h3>
                  <p className="text-black/85 text-xs font-semibold leading-relaxed font-sans">
                    {copy?.nextStepDescription ?? "A conversa inicial organiza contexto, prioridades, responsabilidades e aderência antes da proposta."}
                  </p>
                </div>
                <TrackedOutboundLink
                  label={copy?.talk ?? "Falar com a TAG08"}
                  surface="gestao-redes-final-cta"
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-h-11 items-center justify-between gap-3 text-xs font-sans font-black text-black select-none border-t border-black/10 pt-3 transition-colors duration-200 hover:text-black/70 active:scale-[0.98]"
                >
                  <span>{copy?.talk ?? "FALAR COM A TAG08"}</span>
                  <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
                </TrackedOutboundLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - ACTION TRIGGER FOOTER */}
      <section className="order-7 px-4 sm:px-6 md:px-8 py-12 sm:py-16 text-center space-y-4 sm:space-y-5 max-w-4xl mx-auto">
        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-tight tracking-tighter">
          {copy?.finalTitle ?? "Presença consistente começa com uma rotina que a marca consegue sustentar."}
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          {copy?.finalDescription ?? "A TAG08 organiza planejamento editorial, formatos, produção e acompanhamento de acordo com o momento da marca e com a estrutura necessária para sustentar a comunicação."}
        </p>
        <div className="pt-2 sm:pt-3">
          <button
            onClick={() => handleLinkClick("/contato")}
            className="group min-h-11 bg-brand text-black font-sans font-black text-xs uppercase tracking-widest py-3.5 px-7 rounded-full shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.22)] hover:bg-brand-dark transition-colors duration-200 active:scale-[0.98] cursor-pointer flex items-center gap-2 mx-auto"
          >
            <span>{copy?.finalCta ?? "ENTENDER SE A GESTÃO FAZ SENTIDO"}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </section>

    </div>
  );
}

















