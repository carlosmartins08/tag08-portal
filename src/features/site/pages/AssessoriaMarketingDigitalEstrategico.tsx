import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, LineChart, MessageSquare, Settings, Target } from "../../../components/DooIcons";
import ResilientImage from "../../../components/ResilientImage";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import TrustTestimonialsSection from "../../../components/TrustTestimonialsSection";
import { buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl } from "../../../config/siteNetwork";
import { trackOutboundClick } from "../../../lib/analytics";
import { useSimulatorTracking } from "../../../lib/useSimulatorTracking";
import type { RouteLocale } from "../../../config/routeRegistry";

interface AssessoriaProps {
  onNavigate: (page: string) => void;
  locale?: RouteLocale;
}

interface Question {
  id: number;
  text: string;
  options: Array<{ label: string; value: number; text: string }>;
}

const AUDIT_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Como as prioridades de marketing são definidas hoje?",
    options: [
      { label: "A", value: 10, text: "A urgência da semana define o que entra na frente" },
      { label: "B", value: 16, text: "Existe um plano, mas ele muda com frequência e sem critério claro" },
      { label: "C", value: 23, text: "As prioridades existem, mas nem toda a equipe ou parceiro as entende" },
      { label: "D", value: 30, text: "As prioridades são acordadas, registradas e revisadas com quem decide" }
    ]
  },
  {
    id: 2,
    text: "A mensagem da marca se mantém coerente entre os canais?",
    options: [
      { label: "A", value: 10, text: "Cada canal ou pessoa fala de um jeito, conforme a demanda" },
      { label: "B", value: 16, text: "Temos uma ideia de mensagem, mas ela varia muito na prática" },
      { label: "C", value: 23, text: "A mensagem é clara, porém ainda há pontos de contato desalinhados" },
      { label: "D", value: 30, text: "Existe uma direção comum para mensagem, canal e material comercial" }
    ]
  },
  {
    id: 3,
    text: "Como as decisões entre equipe, parceiros e liderança são conduzidas?",
    options: [
      { label: "A", value: 10, text: "As decisões ficam soltas ou dependem de quem está disponível" },
      { label: "B", value: 16, text: "Cada parceiro executa sua parte, mas faltam critérios compartilhados" },
      { label: "C", value: 23, text: "Há responsáveis, mas aprovações e decisões ainda geram retrabalho" },
      { label: "D", value: 30, text: "Papéis, critérios de aprovação e momentos de revisão estão claros" }
    ]
  },
  {
    id: 4,
    text: "Qual é a capacidade real de transformar uma decisão em execução?",
    options: [
      { label: "A", value: 10, text: "Não há responsável ou rotina para sustentar as decisões" },
      { label: "B", value: 16, text: "A execução acontece por esforço, mas sem uma sequência sustentável" },
      { label: "C", value: 23, text: "Há capacidade e responsáveis, embora alguns alinhamentos travem o fluxo" },
      { label: "D", value: 30, text: "A operação tem donos, rotina de acompanhamento e espaço para ajustes" }
    ]
  }
];

const CAPABILITIES = [
  { icon: Target, title: "Posicionamento e mensagem", description: "Clareza sobre oferta, público, percepção e mensagens que precisam sustentar a marca." },
  { icon: MessageSquare, title: "Conteúdo e relacionamento", description: "Argumentos e conversas que ajudam o público a compreender melhor a marca e sua oferta." },
  { icon: LineChart, title: "Canais e conversão", description: "Pontos de contato organizados para apoiar a jornada e o próximo passo." },
  { icon: Settings, title: "Operação e acompanhamento", description: "Responsáveis, prioridades, revisão e rotina para reduzir improviso." }
] as const;

const METHOD_STEPS = [
  { title: "Entender o cenário", description: "Contexto, objetivos, gargalos, canais e limitações reais antes de recomendar ações." },
  { title: "Ler a maturidade", description: "Desalinhamentos entre oferta, mensagem, rotina e capacidade de execução." },
  { title: "Definir prioridades", description: "O que vem primeiro, o que pode esperar e qual sequência é viável agora." },
  { title: "Acompanhar decisões", description: "Critérios, revisões e ajustes compatíveis com o escopo combinado." }
] as const;

const FIT_SIGNALS = [
  "A marca já tem frentes, pessoas ou parceiros em movimento, mas falta uma direção comum.",
  "As prioridades mudam sem critério e cada decisão reabre discussões ou cria retrabalho.",
  "Existe disposição para compartilhar contexto, participar das decisões e sustentar uma rotina possível."
] as const;

const NON_FIT_SIGNALS = [
  "A necessidade é uma entrega isolada, com escopo já totalmente definido.",
  "A expectativa é receber uma solução pronta sem acesso ao contexto ou participação nas decisões.",
  "Ainda não existe uma pessoa disponível para validar prioridades, aprovar caminhos e acompanhar a evolução."
] as const;

const FAQ_ITEMS = [
  { question: "O que é a Assessoria Estratégica de Negócios da TAG08?", answer: "É um acompanhamento para organizar posicionamento, prioridades, comunicação, canais e próximos passos antes de ampliar a execução. O foco é melhorar a qualidade das decisões de negócio e reduzir ações soltas." },
  { question: "A assessoria inclui execução de marketing?", answer: "Depende do escopo. Em alguns casos, a assessoria orienta decisões e organiza o planejamento. Em outros, ela se conecta a soluções específicas da TAG08. A proposta define o que está incluído, quem executa e quais decisões seguem com a empresa." },
  { question: "Quando a assessoria faz sentido?", answer: "Quando decisões, canais, equipes ou parceiros precisam trabalhar com uma direção comum. Pode não ser o melhor caminho para uma entrega pontual, para quem espera execução sem participação ou quando não há uma pessoa disponível para decidir e acompanhar." },
  { question: "Qual é o ritmo e a participação esperada?", answer: "O ritmo é definido no escopo. A marca compartilha contexto, indica uma pessoa com poder de decisão e participa dos retornos combinados. A TAG08 organiza a condução; decisões de negócio continuam sendo da empresa." },
  { question: "A TAG08 substitui equipe interna ou parceiros?", answer: "Não. A assessoria pode organizar prioridades, critérios e planejamento para que equipe interna e parceiros trabalhem com maior alinhamento. Papéis, aprovações e responsabilidades são definidos no início." },
  { question: "Quanto tempo dura e como o investimento é definido?", answer: "Tempo e investimento dependem do contexto, escopo, quantidade de frentes e disponibilidade da operação. A TAG08 propõe um formato somente depois de entender o cenário e confirmar o encaixe." },
  { question: "A TAG08 faz promessas de resultado?", answer: "Não. A assessoria não promete crescimento instantâneo, retorno financeiro ou resultado artificial. O trabalho busca clareza, critério, planejamento, consistência e melhoria contínua com responsabilidade." }
] as const;

const ASSESSORIA_COPY = {
  en: {
    heroEyebrow: "Strategic Business Advisory",
    heroTitle: "Strategic direction for",
    heroHighlight: "business priorities and decisions.",
    contact: "Talk to TAG08",
    contactAria: "Talk to TAG08 on WhatsApp, opens in a new tab",
    initialReading: "Start an initial assessment",
    intro: "TAG08 organizes context, positioning, priorities, channels, and next steps so business decisions can move beyond urgency and follow clearer criteria.",
    imageAlt: "Strategic planning meeting",
    imageFallback: "Strategic planning image",
    imageCaption: "Diagnosis, priorities, and marketing direction.",
    fitTitle: "When advisory makes sense.",
    fitIntro: "Advisory helps address a lack of direction and coordination. It does not replace a decision the business is not yet willing or able to make.",
    fitLabel: "It may be a fit when",
    nonFitLabel: "It may not be the right time when",
    fitSignals: [
      "The brand already has initiatives, people, or partners in motion, but lacks a shared direction.",
      "Priorities change without clear criteria, and each decision reopens discussions or creates rework.",
      "There is a willingness to share context, take part in decisions, and sustain a workable routine."
    ],
    nonFitSignals: [
      "The need is a standalone deliverable with a fully defined scope.",
      "The expectation is a ready-made solution without access to context or participation in decisions.",
      "No one is available to validate priorities, approve direction, and follow progress."
    ],
    decisionTitle: "How TAG08 structures decisions.",
    decisionIntro: "Execution becomes consistent when context, priorities, and responsibilities are aligned.",
    methodSteps: [
      { title: "Understand the context", description: "Context, objectives, bottlenecks, channels, and real constraints before recommending actions." },
      { title: "Assess maturity", description: "Misalignment across the offer, messaging, routine, and execution capacity." },
      { title: "Set priorities", description: "What comes first, what can wait, and which sequence is viable now." },
      { title: "Review decisions", description: "Criteria, reviews, and adjustments that fit the agreed scope." }
    ],
    organizeTitle: "What we organize before expanding initiatives.",
    organizeIntro: "Advisory connects positioning, communication, channels, and operations. Not every initiative needs to happen at once; the choice depends on context, priority, and actual execution capacity.",
    capabilities: [
      { title: "Positioning and messaging", description: "Clarity about the offer, audience, perception, and messages that need to support the brand." },
      { title: "Content and relationships", description: "Arguments and conversations that help the audience better understand the brand and its offer." },
      { title: "Channels and conversion", description: "Organized touchpoints that support the journey and its next step." },
      { title: "Operations and follow-up", description: "Owners, priorities, reviews, and routines that reduce improvisation." }
    ],
    diagnosticEyebrow: "Optional initial assessment",
    diagnosticTitle: "Does your business have enough direction to execute consistently?",
    diagnosticIntro: "This initial assessment helps identify whether priorities, messaging, channels, responsibilities, and execution capacity are organized enough to support the next steps.",
    maturityReading: "MATURITY ASSESSMENT",
    questionOf: (current: number, total: number) => `Question ${current} of ${total}`,
    progressAria: "Assessment progress",
    questionAria: (current: number, total: number) => `Question ${current} of ${total}`,
    backQuestion: "Previous question",
    answerCanChange: "You can change your answer before viewing the final assessment.",
    assessmentComplete: "GUIDANCE ASSESSMENT COMPLETE",
    currentReading: "CURRENT ASSESSMENT",
    assessmentDisclaimer: "This assessment organizes the company's own perceptions; it does not replace a technical diagnosis, channel analysis, or commercial recommendation.",
    whatsappBrazil: "WhatsApp Brazil",
    whatsappInternational: "International WhatsApp",
    whatsappReadingAria: "Discuss this assessment on WhatsApp in Brazil, opens in a new tab",
    whatsappInternationalAria: "Discuss this assessment on WhatsApp internationally, opens in a new tab",
    repeatAssessment: "Take the assessment again",
    faqTitle: "Questions before a conversation.",
    faqIntro: "These answers help clarify what to expect before evaluating a scope.",
    finalTitle: "Let's see whether advisory makes sense for your business.",
    finalDescription: "Before proposing any format, TAG08 considers context, positioning, priorities, and execution capacity to recommend the most coherent path for this moment.",
    otherSolutions: "Explore other solutions",
    consultationMessage: "Hello TAG08! I would like to discuss Strategic Business Advisory and understand possible next steps for my company.",
    diagnosticMessage: (level: string, score: number, focus: string, recommendation: string) => `Hello TAG08! I completed the initial maturity assessment for Strategic Business Advisory. My result was “${level}” (${score}/120). Suggested focus: ${focus} Next recommendation: ${recommendation}`,
    diagnosticResults: [
      { level: "Limited clarity", description: "The brand still relies on isolated actions and loosely organized decisions.", focus: "The first focus is usually strategic clarity and communication alignment.", recommendation: "The priority now is to structure the foundation before expanding execution." },
      { level: "Clarity taking shape", description: "There is already activity, but communication can become more consistent across channels and materials.", focus: "Refine messaging, consistency, and channel structure.", recommendation: "Organize priorities before expanding any initiative." },
      { level: "Clear direction", description: "The brand has a more consistent path, but its operating routine can still be better sustained.", focus: "Focus on follow-up, review, and continuity of what has already been structured.", recommendation: "The next step is to consolidate the method and sustain responsible execution." },
      { level: "More established direction", description: "There is an organized foundation for decisions and execution, although priorities and context still need operational review.", focus: "Prioritize consistency, review, and continuity.", recommendation: "This assessment does not replace a full analysis, but it indicates a structured foundation for next steps." }
    ],
    questions: [
      { text: "How are marketing priorities set today?", options: ["Weekly urgency determines what comes first", "There is a plan, but it changes often without clear criteria", "Priorities exist, but not everyone on the team or among partners understands them", "Priorities are agreed, documented, and reviewed with decision-makers"] },
      { text: "Does the brand's message stay consistent across channels?", options: ["Each channel or person communicates differently depending on the request", "We have an idea of our message, but it varies considerably in practice", "The message is clear, although some touchpoints are still misaligned", "There is a shared direction for messaging, channels, and sales materials"] },
      { text: "How are decisions among the team, partners, and leadership handled?", options: ["Decisions are disconnected or depend on who is available", "Each partner handles their part, but shared criteria are missing", "There are owners, but approvals and decisions still create rework", "Roles, approval criteria, and review points are clear"] },
      { text: "What is the actual capacity to turn a decision into execution?", options: ["There is no owner or routine to sustain decisions", "Execution depends on effort, without a sustainable sequence", "There is capacity and ownership, although some alignment issues slow the flow", "The operation has owners, follow-up routines, and room for adjustments"] }
    ],
    faq: [
      { question: "What is TAG08 Strategic Business Advisory?", answer: "It is an advisory engagement to organize positioning, priorities, communication, channels, and next steps before expanding execution. Its focus is to improve business decision-making and reduce disconnected actions." },
      { question: "Does advisory include marketing execution?", answer: "It depends on the scope. In some cases, advisory guides decisions and organizes planning. In others, it connects to specific TAG08 solutions. The proposal defines what is included, who executes it, and which decisions remain with the company." },
      { question: "When does advisory make sense?", answer: "When decisions, channels, teams, or partners need to work in a shared direction. It may not be the best path for a one-off deliverable, for those expecting execution without participation, or when no one is available to decide and follow up." },
      { question: "What pace and participation are expected?", answer: "The pace is defined in the scope. The company shares context, appoints a decision-maker, and participates in agreed reviews. TAG08 facilitates the process; business decisions remain with the company." },
      { question: "Does TAG08 replace an internal team or partners?", answer: "No. Advisory can organize priorities, criteria, and planning so internal teams and partners work with better alignment. Roles, approvals, and responsibilities are defined at the start." },
      { question: "How long does it last, and how is the investment determined?", answer: "Timing and investment depend on context, scope, the number of initiatives, and operational availability. TAG08 proposes a format only after understanding the situation and confirming fit." },
      { question: "Does TAG08 promise results?", answer: "No. Advisory does not promise instant growth, financial returns, or artificial results. The work aims for clarity, sound criteria, planning, consistency, and responsible continuous improvement." }
    ]
  },
  es: {
    heroEyebrow: "Asesoría Estratégica de Negocios",
    heroTitle: "Dirección estratégica para",
    heroHighlight: "las prioridades y decisiones del negocio.",
    contact: "Hablar con TAG08",
    contactAria: "Hablar con TAG08 por WhatsApp; se abre en una pestaña nueva",
    initialReading: "Iniciar una evaluación inicial",
    intro: "TAG08 organiza el contexto, el posicionamiento, las prioridades, los canales y los próximos pasos para que las decisiones de negocio dejen de responder a la urgencia y sigan criterios más claros.",
    imageAlt: "Reunión de planificación estratégica",
    imageFallback: "Imagen de planificación estratégica",
    imageCaption: "Diagnóstico, prioridades y dirección de marketing.",
    fitTitle: "Cuándo tiene sentido la asesoría.",
    fitIntro: "La asesoría ayuda a resolver la falta de dirección y coordinación. No sustituye una decisión que la marca todavía no quiere o no puede tomar.",
    fitLabel: "Puede encajar cuando",
    nonFitLabel: "Quizás no sea el momento si",
    fitSignals: [
      "La marca ya tiene iniciativas, personas o socios en marcha, pero le falta una dirección común.",
      "Las prioridades cambian sin criterios claros y cada decisión reabre conversaciones o genera retrabajo.",
      "Hay disposición para compartir el contexto, participar en las decisiones y sostener una rutina viable."
    ],
    nonFitSignals: [
      "La necesidad es una entrega puntual cuyo alcance ya está completamente definido.",
      "Se espera recibir una solución lista sin compartir el contexto ni participar en las decisiones.",
      "No hay una persona disponible para validar prioridades, aprobar el rumbo y acompañar la evolución."
    ],
    decisionTitle: "Cómo TAG08 organiza las decisiones.",
    decisionIntro: "La ejecución gana consistencia cuando el contexto, las prioridades y las responsabilidades están alineados.",
    methodSteps: [
      { title: "Entender el contexto", description: "Contexto, objetivos, obstáculos, canales y limitaciones reales antes de recomendar acciones." },
      { title: "Leer la madurez", description: "Desajustes entre la oferta, el mensaje, la rutina y la capacidad de ejecución." },
      { title: "Definir prioridades", description: "Qué va primero, qué puede esperar y qué secuencia es viable ahora." },
      { title: "Acompañar decisiones", description: "Criterios, revisiones y ajustes compatibles con el alcance acordado." }
    ],
    organizeTitle: "Qué organizamos antes de ampliar iniciativas.",
    organizeIntro: "La asesoría conecta posicionamiento, comunicación, canales y operación. No todas las iniciativas deben ocurrir al mismo tiempo; la elección depende del contexto, la prioridad y la capacidad real de ejecución.",
    capabilities: [
      { title: "Posicionamiento y mensaje", description: "Claridad sobre la oferta, el público, la percepción y los mensajes que deben sostener la marca." },
      { title: "Contenido y relaciones", description: "Argumentos y conversaciones que ayudan al público a comprender mejor la marca y su oferta." },
      { title: "Canales y conversión", description: "Puntos de contacto organizados para apoyar el recorrido y el siguiente paso." },
      { title: "Operación y seguimiento", description: "Responsables, prioridades, revisiones y rutinas para reducir la improvisación." }
    ],
    diagnosticEyebrow: "Evaluación inicial opcional",
    diagnosticTitle: "¿Tu empresa tiene suficiente dirección para ejecutar con consistencia?",
    diagnosticIntro: "Esta evaluación inicial ayuda a identificar si las prioridades, el mensaje, los canales, las responsabilidades y la capacidad de ejecución están organizados para sostener los próximos pasos.",
    maturityReading: "LECTURA DE MADUREZ",
    questionOf: (current: number, total: number) => `Pregunta ${current} de ${total}`,
    progressAria: "Progreso de la evaluación",
    questionAria: (current: number, total: number) => `Pregunta ${current} de ${total}`,
    backQuestion: "Volver a la pregunta anterior",
    answerCanChange: "Puedes cambiar tu respuesta antes de ver la evaluación final.",
    assessmentComplete: "EVALUACIÓN ORIENTATIVA COMPLETADA",
    currentReading: "LECTURA ACTUAL",
    assessmentDisclaimer: "Esta lectura organiza las percepciones de la propia empresa; no sustituye un diagnóstico técnico, un análisis de canales ni una recomendación comercial.",
    whatsappBrazil: "WhatsApp Brasil",
    whatsappInternational: "WhatsApp Internacional",
    whatsappReadingAria: "Hablar sobre esta evaluación por WhatsApp en Brasil; se abre en una pestaña nueva",
    whatsappInternationalAria: "Hablar sobre esta evaluación por WhatsApp internacional; se abre en una pestaña nueva",
    repeatAssessment: "Repetir la evaluación",
    faqTitle: "Dudas antes de conversar.",
    faqIntro: "Estas respuestas ayudan a entender qué esperar antes de evaluar un alcance.",
    finalTitle: "Veamos si la asesoría tiene sentido para tu marca.",
    finalDescription: "Antes de proponer cualquier formato, TAG08 entiende el contexto, el posicionamiento, las prioridades y la capacidad de ejecución para indicar el camino más coherente para este momento.",
    otherSolutions: "Ver otras soluciones",
    consultationMessage: "Hola TAG08. Me gustaría conversar sobre la Asesoría Estratégica de Negocios y entender los próximos pasos para mi empresa.",
    diagnosticMessage: (level: string, score: number, focus: string, recommendation: string) => `Hola TAG08. Completé la evaluación inicial de madurez para la Asesoría Estratégica de Negocios. Mi resultado fue «${level}» (${score}/120). Enfoque sugerido: ${focus} Próxima recomendación: ${recommendation}`,
    diagnosticResults: [
      { level: "Claridad limitada", description: "La marca todavía depende de acciones aisladas y decisiones poco organizadas.", focus: "El primer enfoque suele ser la claridad estratégica y la alineación de la comunicación.", recommendation: "La prioridad ahora es estructurar la base antes de ampliar la ejecución." },
      { level: "Claridad en construcción", description: "Ya hay movimiento, pero la comunicación todavía puede ganar consistencia entre canales y materiales.", focus: "Ajustar el mensaje, la consistencia y la estructura de los canales.", recommendation: "Conviene organizar las prioridades antes de ampliar cualquier iniciativa." },
      { level: "Buena dirección", description: "La marca tiene un camino más consistente, aunque todavía puede sostener mejor su rutina.", focus: "Enfocarse en el seguimiento, la revisión y la continuidad de lo ya estructurado.", recommendation: "El siguiente paso es consolidar el método y mantener una ejecución responsable." },
      { level: "Dirección más consolidada", description: "Existe una base organizada para decidir y ejecutar, aunque las prioridades y el contexto deben revisarse con la operación.", focus: "Priorizar la consistencia, la revisión y la continuidad.", recommendation: "Esta lectura no sustituye un análisis completo, pero indica una base estructurada para los próximos pasos." }
    ],
    questions: [
      { text: "¿Cómo se definen hoy las prioridades de marketing?", options: ["La urgencia de la semana define qué va primero", "Hay un plan, pero cambia con frecuencia y sin criterios claros", "Las prioridades existen, pero no todo el equipo o los socios las entienden", "Las prioridades se acuerdan, se registran y se revisan con quienes deciden"] },
      { text: "¿El mensaje de la marca se mantiene coherente entre canales?", options: ["Cada canal o persona comunica de manera distinta según la demanda", "Tenemos una idea del mensaje, pero varía mucho en la práctica", "El mensaje es claro, aunque algunos puntos de contacto todavía están desalineados", "Hay una dirección común para el mensaje, los canales y los materiales comerciales"] },
      { text: "¿Cómo se toman las decisiones entre el equipo, los socios y el liderazgo?", options: ["Las decisiones quedan desconectadas o dependen de quién esté disponible", "Cada socio ejecuta su parte, pero faltan criterios compartidos", "Hay responsables, pero las aprobaciones y decisiones todavía generan retrabajo", "Los roles, criterios de aprobación y momentos de revisión están claros"] },
      { text: "¿Cuál es la capacidad real para convertir una decisión en ejecución?", options: ["No hay una persona responsable ni una rutina para sostener las decisiones", "La ejecución depende del esfuerzo, pero carece de una secuencia sostenible", "Hay capacidad y responsables, aunque algunos acuerdos traban el flujo", "La operación tiene responsables, una rutina de seguimiento y espacio para ajustes"] }
    ],
    faq: [
      { question: "¿Qué es la Asesoría Estratégica de Negocios de TAG08?", answer: "Es un acompañamiento para organizar el posicionamiento, las prioridades, la comunicación, los canales y los próximos pasos antes de ampliar la ejecución. El foco es mejorar la calidad de las decisiones de negocio y reducir las acciones desconectadas." },
      { question: "¿La asesoría incluye ejecución de marketing?", answer: "Depende del alcance. En algunos casos, la asesoría orienta decisiones y organiza la planificación. En otros, se conecta con soluciones específicas de TAG08. La propuesta define qué incluye, quién ejecuta y qué decisiones siguen siendo de la empresa." },
      { question: "¿Cuándo tiene sentido la asesoría?", answer: "Cuando las decisiones, los canales, los equipos o los socios necesitan trabajar con una dirección común. Puede no ser el mejor camino para una entrega puntual, para quien espera ejecución sin participar o cuando no hay una persona disponible para decidir y hacer seguimiento." },
      { question: "¿Qué ritmo y participación se esperan?", answer: "El ritmo se define en el alcance. La marca comparte el contexto, designa a una persona con poder de decisión y participa en las revisiones acordadas. TAG08 organiza el proceso; las decisiones de negocio siguen siendo de la empresa." },
      { question: "¿TAG08 sustituye al equipo interno o a los socios?", answer: "No. La asesoría puede organizar prioridades, criterios y planificación para que el equipo interno y los socios trabajen con mayor alineación. Los roles, las aprobaciones y las responsabilidades se definen al inicio." },
      { question: "¿Cuánto dura y cómo se define la inversión?", answer: "El tiempo y la inversión dependen del contexto, el alcance, la cantidad de iniciativas y la disponibilidad de la operación. TAG08 propone un formato solo después de entender la situación y confirmar que encaja." },
      { question: "¿TAG08 promete resultados?", answer: "No. La asesoría no promete crecimiento inmediato, retorno financiero ni resultados artificiales. El trabajo busca claridad, criterios, planificación, consistencia y mejora continua responsable." }
    ]
  }
} satisfies Record<Exclude<RouteLocale, "pt">, {
  heroEyebrow: string; heroTitle: string; heroHighlight: string; contact: string; contactAria: string;
  initialReading: string; intro: string; imageAlt: string; imageFallback: string; imageCaption: string;
  fitTitle: string; fitIntro: string; fitLabel: string; nonFitLabel: string; fitSignals: string[]; nonFitSignals: string[];
  decisionTitle: string; decisionIntro: string; methodSteps: Array<{ title: string; description: string }>;
  organizeTitle: string; organizeIntro: string; capabilities: Array<{ title: string; description: string }>;
  diagnosticEyebrow: string; diagnosticTitle: string; diagnosticIntro: string; maturityReading: string;
  questionOf: (current: number, total: number) => string; progressAria: string;
  questionAria: (current: number, total: number) => string; backQuestion: string; answerCanChange: string;
  assessmentComplete: string; currentReading: string; assessmentDisclaimer: string; whatsappBrazil: string;
  whatsappInternational: string; whatsappReadingAria: string; whatsappInternationalAria: string;
  repeatAssessment: string; faqTitle: string; faqIntro: string; finalTitle: string; finalDescription: string;
  otherSolutions: string; consultationMessage: string;
  diagnosticMessage: (level: string, score: number, focus: string, recommendation: string) => string;
  diagnosticResults: Array<{ level: string; description: string; focus: string; recommendation: string }>;
  questions: Array<{ text: string; options: string[] }>; faq: Array<{ question: string; answer: string }>;
}>;

const actionTransition = "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none";

export default function AssessoriaMarketingDigitalEstrategico({ onNavigate, locale = "pt" }: AssessoriaProps) {
  const copy = locale === "pt" ? null : ASSESSORIA_COPY[locale];
  const questions = copy
    ? AUDIT_QUESTIONS.map((question, questionIndex) => ({
      ...question,
      text: copy.questions[questionIndex].text,
      options: question.options.map((option, optionIndex) => ({ ...option, text: copy.questions[questionIndex].options[optionIndex] }))
    }))
    : AUDIT_QUESTIONS;
  const capabilities = copy ? CAPABILITIES.map((capability, index) => ({ ...capability, ...copy.capabilities[index] })) : CAPABILITIES;
  const methodSteps = copy ? METHOD_STEPS.map((step, index) => ({ ...step, ...copy.methodSteps[index] })) : METHOD_STEPS;
  const fitSignals = copy?.fitSignals ?? FIT_SIGNALS;
  const nonFitSignals = copy?.nonFitSignals ?? NON_FIT_SIGNALS;
  const faqItems = copy?.faq ?? FAQ_ITEMS;
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { score: number; text: string }>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [shouldRestoreQuizFocus, setShouldRestoreQuizFocus] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const trackSimulator = useSimulatorTracking("marketing_assessment_quiz", 1, "/servicos/assessoria-marketing-digital-estrategico");
  const brazilConsultationWhatsappUrl = buildBrazilWhatsAppUrl(copy?.consultationMessage ?? "Olá TAG08! Gostaria de conversar sobre Assessoria Estratégica de Negócios e entender os próximos passos para a minha empresa.");

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  const scrollToDiagnostic = () => {
    document.getElementById("diagnostic-audit")?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  };

  const handleConsultationWhatsAppClick = (surface: string) => {
    trackSimulator("cta_clicked");
    trackOutboundClick({ label: "WhatsApp Brasil", url: brazilConsultationWhatsappUrl, surface });
  };

  const handleDiagnosticWhatsAppClick = (label: string, url: string) => {
    trackSimulator("cta_clicked");
    trackOutboundClick({ label, url, surface: "assessoria-diagnostic-result" });
  };

  const handleSelectOption = (questionId: number, score: number, text: string) => {
    trackSimulator("input_changed");
    setAnswers((current) => ({ ...current, [questionId]: { score, text } }));
    setShouldRestoreQuizFocus(true);

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((current) => current + 1);
      return;
    }

    setQuizCompleted(true);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIdx === 0) return;
    setShouldRestoreQuizFocus(true);
    setCurrentQuestionIdx((current) => current - 1);
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setCurrentQuestionIdx(0);
    setQuizCompleted(false);
    setShouldRestoreQuizFocus(true);
  };

  useEffect(() => {
    if (!shouldRestoreQuizFocus) return;

    const timer = window.setTimeout(() => {
      (quizCompleted ? resultHeadingRef.current : questionHeadingRef.current)?.focus();
      setShouldRestoreQuizFocus(false);
    }, prefersReducedMotion ? 0 : 220);

    return () => window.clearTimeout(timer);
  }, [currentQuestionIdx, prefersReducedMotion, quizCompleted, shouldRestoreQuizFocus]);

  const totalScore = Object.values(answers).reduce((sum, answer) => sum + answer.score, 0);
  const diagnosticIndex = totalScore <= 59 ? 0 : totalScore <= 79 ? 1 : totalScore <= 100 ? 2 : 3;
  const portugueseDiagnostic = totalScore <= 59
    ? { level: "Baixa clareza", tone: "text-red-300", description: "A marca ainda depende de ações isoladas e de decisões pouco organizadas.", focus: "O primeiro foco costuma ser clareza estratégica e alinhamento de comunicação.", recommendation: "A prioridade agora é estruturar a base antes de ampliar a execução." }
    : totalScore <= 79
      ? { level: "Clareza em construção", tone: "text-brand", description: "Já existe movimento, mas a comunicação ainda pode ganhar consistência entre canais e materiais.", focus: "Ajustar mensagem, consistência e estrutura de canais.", recommendation: "Vale organizar prioridades antes de ampliar qualquer frente." }
      : totalScore <= 100
        ? { level: "Boa direção", tone: "text-brand", description: "A marca tem um caminho mais consistente, mas ainda pode ganhar clareza na sustentação da rotina.", focus: "Foco em acompanhamento, revisão e continuidade do que já foi estruturado.", recommendation: "O próximo passo é consolidar método e manter a execução responsável." }
        : { level: "Direção mais consolidada", tone: "text-brand", description: "Existe uma base organizada para decidir e executar, embora prioridades e contexto precisem ser revistos com a operação.", focus: "Prioridade em consistência, revisão e continuidade.", recommendation: "A leitura não substitui uma análise completa, mas indica uma base estruturada para os próximos passos." };
  const diagnostic = copy ? { ...portugueseDiagnostic, ...copy.diagnosticResults[diagnosticIndex] } : portugueseDiagnostic;
  const portugueseDiagnosticMessage = `Olá TAG08! Concluí a leitura inicial de maturidade para Assessoria Estratégica de Negócios. Minha leitura foi "${diagnostic.level}" (${totalScore}/120). Foco indicado: ${diagnostic.focus} Próxima recomendação: ${diagnostic.recommendation}`;
  const localizedDiagnosticMessage = copy?.diagnosticMessage(diagnostic.level, totalScore, diagnostic.focus, diagnostic.recommendation);
  const brazilDiagnosticWhatsappUrl = buildBrazilWhatsAppUrl(localizedDiagnosticMessage ?? portugueseDiagnosticMessage);
  const internationalDiagnosticWhatsappUrl = buildInternationalWhatsAppUrl(localizedDiagnosticMessage ?? `Hello TAG08! I completed the initial Strategic Marketing Advisory assessment. My reading was "${diagnostic.level}" (${totalScore}/120). Recommended focus: ${diagnostic.focus} Next recommendation: ${diagnostic.recommendation}`);
  const quizProgress = quizCompleted ? 100 : Math.round(((currentQuestionIdx + 1) / questions.length) * 100);
  const quizTransition = prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: [0.23, 1, 0.32, 1] as const };

  return (
    <div className="min-h-screen overflow-hidden bg-charcoal-950 pb-20 text-white">
      <section className="border-b border-white/[0.06] px-4 py-12 sm:px-6 sm:py-20 md:px-8">
        <div className="mx-auto max-w-7xl space-y-10 sm:space-y-14">
          <div className="grid grid-cols-1 items-end gap-7 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-5 lg:col-span-7">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand">{copy?.heroEyebrow ?? "Assessoria Estratégica de Negócios"}</p>
              <h1 className="max-w-4xl font-display text-4xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
                {copy?.heroTitle ?? "Direção estratégica para"} <span className="text-brand">{copy?.heroHighlight ?? "prioridades e decisões de negócio."}</span>
              </h1>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a data-testid="assessoria-hero-contact" href={brazilConsultationWhatsappUrl} onClick={() => handleConsultationWhatsAppClick("assessoria-hero")} target="_blank" rel="noreferrer" aria-label={copy?.contactAria ?? "Falar com a TAG08 pelo WhatsApp, abre em nova guia"} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-xs font-black uppercase tracking-widest text-black shadow-[0_12px_36px_rgba(var(--color-brand-rgb),0.18)] ${actionTransition}`}>
                  <span>{copy?.contact ?? "Falar com a TAG08"}</span><ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                </a>
                <button type="button" onClick={scrollToDiagnostic} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-200 ${actionTransition}`}>
                  <span>{copy?.initialReading ?? "Fazer leitura inicial"}</span><ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-zinc-300 lg:col-span-5 lg:pb-1">{copy?.intro ?? "A TAG08 organiza contexto, posicionamento, prioridades, canais e próximos passos para que decisões de negócio deixem de nascer da urgência e passem a seguir critérios mais claros."}</p>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] border border-white/[0.08] bg-charcoal-900 shadow-2xl sm:aspect-[2.39/1] sm:rounded-[32px]">
            <ResilientImage fallbackLabel={copy?.imageFallback ?? "Imagem de planejamento estratégico"} preload sizes="(max-width: 768px) 100vw, (max-width: 1280px) calc(100vw - 4rem), 1280px" src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1600" alt={copy?.imageAlt ?? "Reunião de planejamento estratégico"} className="object-cover grayscale brightness-50" referrerPolicy="no-referrer" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6"><p className="text-sm font-bold text-white">{copy?.imageCaption ?? "Diagnóstico, prioridades e direção de marketing."}</p></div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-zinc-950/70 px-4 py-16 sm:px-6 sm:py-20 md:px-8">
        <div className="mx-auto max-w-7xl space-y-10 sm:space-y-14">
          <div className="max-w-3xl space-y-3">
            <h2 className="font-display text-3xl font-black leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl">{copy?.fitTitle ?? "Quando a assessoria faz sentido."}</h2>
            <p className="text-sm leading-relaxed text-zinc-300">{copy?.fitIntro ?? "A assessoria resolve falta de direção e coordenação. Não substitui uma decisão que a marca ainda não quer ou não consegue tomar."}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 border-y border-white/[0.08] py-1 md:grid-cols-2">
            <article className="border-b border-white/[0.08] py-7 md:border-b-0 md:border-r md:pr-8">
              <p className="text-sm font-bold text-brand">{copy?.fitLabel ?? "Há encaixe quando"}</p>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-200">
                {fitSignals.map((item) => <li key={item} className="flex gap-3"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" /><span>{item}</span></li>)}
              </ul>
            </article>
            <article className="py-7 md:pl-8">
              <p className="text-sm font-bold text-zinc-200">{copy?.nonFitLabel ?? "Talvez não seja agora se"}</p>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-300">
                {nonFitSignals.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true" className="mt-0.5 text-brand">—</span><span>{item}</span></li>)}
              </ul>
            </article>
          </div>
          <div className="space-y-5">
            <div className="max-w-3xl">
              <h2 className="font-display text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">{copy?.decisionTitle ?? "Como a TAG08 organiza a decisão."}</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{copy?.decisionIntro ?? "A execução só ganha consistência quando contexto, prioridade e responsabilidade estão alinhados."}</p>
            </div>
            <ol className="grid grid-cols-1 border-t border-white/[0.08] md:grid-cols-2 lg:grid-cols-4">
              {methodSteps.map((step, index) => <li key={step.title} className={`min-h-[170px] border-b border-white/[0.08] py-6 ${index % 2 === 0 ? "md:border-r md:pr-6 lg:border-r" : "md:pl-6 lg:border-r lg:pr-6"} ${index === 3 ? "lg:border-r-0" : ""}`}><h3 className="text-sm font-bold text-white">{step.title}</h3><p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-300">{step.description}</p></li>)}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20 md:px-8">
        <div className="mx-auto max-w-7xl space-y-9 sm:space-y-12">
          <div className="max-w-3xl space-y-3">
            <h2 className="font-display text-3xl font-black leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl">{copy?.organizeTitle ?? "O que organizamos antes de ampliar frentes."}</h2>
            <p className="text-sm leading-relaxed text-zinc-300">{copy?.organizeIntro ?? "A assessoria conecta posicionamento, comunicação, canais e operação. Nem toda frente precisa acontecer ao mesmo tempo; a escolha depende do contexto, da prioridade e da capacidade real de execução."}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability) => {
              const Icon = capability.icon;
              return <article key={capability.title} className="border-t border-white/[0.12] py-5"><Icon aria-hidden="true" className="h-5 w-5 text-brand" /><h3 className="mt-8 font-display text-lg font-black tracking-tight text-white">{capability.title}</h3><p className="mt-3 text-sm leading-relaxed text-zinc-300">{capability.description}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section id="diagnostic-audit" className="scroll-mt-24 border-b border-white/[0.06] bg-zinc-950/70 px-4 py-16 sm:px-6 sm:py-20 md:px-8">
        <div className="mx-auto max-w-5xl space-y-9 sm:space-y-12">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand">{copy?.diagnosticEyebrow ?? "Leitura inicial opcional"}</p>
            <h2 className="font-display text-3xl font-black leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl">{copy?.diagnosticTitle ?? "Sua empresa tem direção suficiente para executar com consistência?"}</h2>
            <p className="text-sm leading-relaxed text-zinc-300">{copy?.diagnosticIntro ?? "Esta leitura inicial ajuda a perceber se prioridades, mensagem, canais, responsabilidades e capacidade de execução estão organizados o suficiente para sustentar os próximos passos."}</p>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-charcoal-900 p-6 shadow-2xl sm:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {!quizCompleted ? <motion.div key={currentQuestionIdx} initial={prefersReducedMotion ? false : { opacity: 0, transform: "translateX(10px)" }} animate={{ opacity: 1, transform: "translateX(0)" }} exit={prefersReducedMotion ? undefined : { opacity: 0, transform: "translateX(-8px)" }} transition={quizTransition} className="space-y-7">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4"><p className="text-xs font-bold uppercase tracking-widest text-brand">{copy?.maturityReading ?? "Leitura de maturidade"}</p><p className="text-xs text-zinc-300">{copy?.questionOf(currentQuestionIdx + 1, questions.length) ?? `${currentQuestionIdx + 1} de ${questions.length}`}</p></div>
                <div role="progressbar" aria-label={copy?.progressAria ?? "Progresso do diagnóstico"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={quizProgress} aria-valuetext={copy?.questionAria(currentQuestionIdx + 1, questions.length) ?? `Pergunta ${currentQuestionIdx + 1} de ${questions.length}`} className="h-1 w-full overflow-hidden rounded-full bg-white/[0.08]"><div className="h-full bg-brand transition-[width] duration-200 ease-out motion-reduce:transition-none" style={{ width: `${quizProgress}%` }} /></div>
                <h3 ref={questionHeadingRef} tabIndex={-1} className="font-display text-xl font-black leading-snug text-white sm:text-2xl">{questions[currentQuestionIdx].text}</h3>
                <div className="grid gap-3">
                  {questions[currentQuestionIdx].options.map((option) => {
                    const isSelected = answers[questions[currentQuestionIdx].id]?.score === option.value;
                    return <button key={option.label} type="button" onClick={() => handleSelectOption(questions[currentQuestionIdx].id, option.value, option.text)} aria-pressed={isSelected} className={`flex min-h-12 w-full items-center gap-4 rounded-xl border p-4 text-left text-sm ${isSelected ? "border-brand/60 bg-brand/[0.08] text-white" : "border-white/[0.10] bg-white/[0.01] text-zinc-200 hover:border-brand/45 hover:bg-white/[0.03]"} ${actionTransition}`}><span aria-hidden="true" className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-black ${isSelected ? "bg-brand text-black" : "bg-white/[0.08] text-zinc-200"}`}>{option.label}</span><span>{option.text}</span></button>;
                  })}
                </div>
                <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <button type="button" onClick={handlePreviousQuestion} disabled={currentQuestionIdx === 0} className={`inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-zinc-200 disabled:cursor-not-allowed disabled:opacity-45 ${actionTransition}`}>{copy?.backQuestion ?? "Voltar uma pergunta"}</button>
                  <p className="text-xs leading-relaxed text-zinc-300 sm:text-right">{copy?.answerCanChange ?? "Sua resposta pode ser alterada antes da leitura final."}</p>
                </div>
              </motion.div> : <motion.div initial={prefersReducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={quizTransition} className="space-y-7">
                <div className="border-b border-white/[0.08] pb-4"><p className="text-xs font-bold uppercase tracking-widest text-brand">{copy?.assessmentComplete ?? "Leitura orientativa concluída"}</p></div>
                <div className="rounded-2xl border border-white/[0.08] bg-black/25 p-6"><p className="text-xs font-bold uppercase tracking-widest text-zinc-300">{copy?.currentReading ?? "Leitura atual"}</p><h3 ref={resultHeadingRef} tabIndex={-1} className={`mt-3 font-display text-3xl font-black leading-none ${diagnostic.tone}`}>{diagnostic.level}</h3><p className="mt-5 text-sm leading-relaxed text-zinc-200">{diagnostic.description}</p><p className="mt-4 border-t border-white/[0.08] pt-4 text-sm font-semibold leading-relaxed text-white">{diagnostic.focus}</p><p className="mt-3 text-sm leading-relaxed text-zinc-300">{diagnostic.recommendation}</p></div>
                <p className="text-sm leading-relaxed text-zinc-300">{copy?.assessmentDisclaimer ?? "Esta leitura organiza percepções da própria empresa; não substitui diagnóstico técnico, análise de canais ou recomendação comercial."}</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <a href={brazilDiagnosticWhatsappUrl} onClick={() => handleDiagnosticWhatsAppClick(copy?.whatsappBrazil ?? "WhatsApp Brasil", brazilDiagnosticWhatsappUrl)} target="_blank" rel="noreferrer" aria-label={copy?.whatsappReadingAria ?? "Falar no WhatsApp Brasil sobre esta leitura, abre em nova guia"} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-xs font-black uppercase tracking-widest text-black ${actionTransition}`}><MessageSquare className="h-4 w-4" />{copy?.whatsappBrazil ?? "WhatsApp Brasil"}</a>
                  <a href={internationalDiagnosticWhatsappUrl} onClick={() => handleDiagnosticWhatsAppClick(copy?.whatsappInternational ?? "WhatsApp Internacional", internationalDiagnosticWhatsappUrl)} target="_blank" rel="noreferrer" aria-label={copy?.whatsappInternationalAria ?? "Falar no WhatsApp Internacional sobre esta leitura, abre em nova guia"} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-brand/45 px-5 py-3 text-xs font-black uppercase tracking-widest text-brand ${actionTransition}`}><MessageSquare className="h-4 w-4" />{copy?.whatsappInternational ?? "WhatsApp Internacional"}</a>
                  <button type="button" onClick={handleResetQuiz} className={`min-h-11 rounded-xl border border-white/10 px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-200 sm:col-span-2 ${actionTransition}`}>{copy?.repeatAssessment ?? "Repetir leitura"}</button>
                </div>
              </motion.div>}
            </AnimatePresence>
          </div>
        </div>
      </section>
      <TrustTestimonialsSection locale={locale} />

      <section className="border-b border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20 md:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="max-w-3xl space-y-3"><h2 className="font-display text-3xl font-black leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl">{copy?.faqTitle ?? "Dúvidas antes de conversar."}</h2><p className="text-sm leading-relaxed text-zinc-300">{copy?.faqIntro ?? "As respostas abaixo ajudam a entender o que esperar antes de avaliar um escopo."}</p></div>
          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              const panelId = `assessoria-faq-panel-${index}`;
              const headingId = `assessoria-faq-heading-${index}`;
              return (
                <article key={item.question} className="py-1">
                  <h3 id={headingId}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className={`flex min-h-14 w-full items-center justify-between gap-5 py-4 text-left text-base font-bold text-white ${actionTransition}`}
                    >
                      <span>{item.question}</span>
                      <ChevronDown aria-hidden="true" className={`h-5 w-5 shrink-0 text-brand transition-transform duration-200 ease-out motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  </h3>
                  {isOpen && (
                    <div id={panelId} role="region" aria-labelledby={headingId} className="pb-5 pr-10 text-sm leading-relaxed text-zinc-300">
                      {item.answer}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-brand p-7 text-black sm:p-10">
          <div className="max-w-2xl"><h2 className="font-display text-3xl font-black leading-[0.98] tracking-[-0.04em] sm:text-4xl">{copy?.finalTitle ?? "Vamos entender se a assessoria faz sentido para sua marca?"}</h2><p className="mt-5 text-sm leading-relaxed text-black/75">{copy?.finalDescription ?? "Antes de propor qualquer formato, a TAG08 entende contexto, posicionamento, prioridades e capacidade de execução para indicar o caminho mais coerente para este momento."}</p></div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href={brazilConsultationWhatsappUrl} onClick={() => handleConsultationWhatsAppClick("assessoria-final-cta")} target="_blank" rel="noreferrer" aria-label={copy?.contactAria ?? "Falar com a TAG08 pelo WhatsApp, abre em nova guia"} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-black uppercase tracking-widest text-white ${actionTransition}`}>{copy?.contact ?? "Falar com a TAG08"}<ArrowUpRight className="h-4 w-4" /></a>
            <button type="button" onClick={() => handleLinkClick("/servicos")} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/15 px-5 py-3 text-xs font-bold uppercase tracking-widest text-black ${actionTransition}`}>{copy?.otherSolutions ?? "Ver outras soluções"}<ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      </section>

      <ServiceInsightsBridge servicePath="/servicos/assessoria-marketing-digital-estrategico" locale={locale} onNavigate={onNavigate} />
    </div>
  );
}
