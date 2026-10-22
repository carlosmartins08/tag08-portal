import type { RouteLocale } from "../config/routeRegistry";

/** Editorial EN/ES drafts for the Home pilot. Portuguese remains the source copy and fallback in Home.tsx. */
type WidenCopy<T> = T extends string
  ? string
  : T extends number | boolean
    ? T
    : T extends readonly (infer Item)[]
      ? readonly WidenCopy<Item>[]
      : T extends object
        ? { [Key in keyof T]: WidenCopy<T[Key]> }
        : T;

const HOME_EN_COPY = {
    institutional: {
      badge: "About TAG08",
      title: "Meet the people behind the work.",
      description: "Learn about the story, the team and the principles that guide TAG08 decisions.",
      button: "GET TO KNOW TAG08"
    },
    proof: {
      imageAlt: "TAG08 creative director",
      operationalCore: "OPERATIONS CORE",
      direction: "A presence with direction",
      titleFirstLine: "Presence",
      titleSecondLine: "with direction.",
      description: "A brand needs more than visibility. It needs to be understood by the right audience, communicate its value consistently and deliver on what it promises. Strategy shapes choices. Content builds understanding. Technology creates structure. Process sustains execution.",
      prompt: "Without direction, presence becomes noise.",
      intro: "The first conversation starts by understanding where you are now.",
      whatsappDirect: "WHATSAPP DIRECT",
      whatsappInternational: "INTERNATIONAL WHATSAPP",
      internationalDirect: "INTERNATIONAL DIRECT",
      whatsappMessage: "Hello, I would like to speak with TAG08",
      talkToTag08: "TALK TO TAG08",
      operationActive: "OPERATIONS ACTIVE"
    },
    reviews: {
      trustBadge: "Trust built through practice",
      title: "Clear, supported client experiences",
      description: "When work includes diagnosis, clarity and follow-through, clients can understand the path, take part in decisions and see greater alignment between strategy and delivery.",
      ratingTitle: "REVIEWS",
      ratingDescription: "Reviews record perspectives; trust is sustained through follow-through, clarity and consistent delivery.",
      ariaReview: "Review by {name}",
      googleVerified: "GOOGLE VERIFIED",
      cta: "TALK TO TAG08"
    },
    cases: {
      eyebrow: "CASES & DIGITAL POSITIONING",
      titleFirstLine: "CLIENTS SHAPE",
      titleSecondLine: "THE CHANGE_",
      directContact: "DIRECT CONTACT",
      contactCta: "TALK TO TAG08",
      selector: "CASE STUDY SELECTOR",
      selectorHint: "Choose a story to explore its positioning and outcomes:",
      unavailableTitle: "Client stories are not available in this language yet.",
      unavailableDescription: "These testimonials are attributed evidence and remain in their original Portuguese. They will appear here only after an approved, locale-safe version is available."
    },
    faq: {
      badge: "Important questions before we talk",
      titleFirstLine: "Important questions",
      titleSecondLine: "before we talk.",
      description: "Answers about TAG08’s role, choosing a service, scope, timing and expectations for results.",
      questions: [
        "What is TAG08’s role?",
        "How do we choose a service?",
        "How do packages and scope work?",
        "When can a project begin?",
        "How does TAG08 handle results and expectations?"
      ],
      categories: ["UNDERSTANDING", "DIAGNOSIS", "SCOPE", "START DATE", "EXPECTATIONS"],
      answers: [
        "TAG08 works across strategy, communication, design, content, technology and processes. Some deliverables are typical of a marketing agency; the difference is how we diagnose the situation and organize the path before execution.",
        "You do not need to know which solution to hire before reaching out. The initial context helps identify whether the challenge is positioning, content, identity, audiovisual production, web, processes or a combination of these areas.",
        "We offer structured solutions, but recommendations account for the current situation, maturity, investment capacity and the client’s required involvement. The goal is to keep the problem, scope and expectations aligned.",
        "The start date depends on the project, the information required, operational capacity and alignment steps. Diagnosis, scope, owners and dependencies are organized before execution.",
        "TAG08 does not promise instant growth or guaranteed results. Our commitment is to method, direction, responsible execution, follow-through and continuous improvement."
      ],
      imageAlt: "TAG08 team at work",
      rightCardTitle: "HOW TAG08 WORKS",
      rightCardHeading: "Diagnosis before a proposal.",
      rightCardDescription: "We align understanding, priorities and scope before starting any deliverable.",
      solutions: "EXPLORE SOLUTIONS",
      nextStep: "NEXT STEP",
      brandCardTitle: "The right path starts by understanding where you are now.",
      brandCardDescription: "Before making a proposal, TAG08 clarifies the context: what the company wants to build, what is holding it back and what structure can support the next stage.",
      contactCta: "FIND MY BEST PATH"
    },
    problem: {
      badge: "More execution cannot replace clear direction",
      title: "More execution cannot replace clear direction.",
      description: "A company can publish, advertise, produce videos and have a website without those efforts building the same perception. When positioning, communication and operations move in different directions, digital activity accumulates without helping the audience—or the company itself—make a decision. TAG08 addresses this gap: we identify what is misaligned, organize priorities and connect strategy with execution based on the business’s real situation.",
      ctaSr: "Featured:",
      ctaBadge: "EXCLUSIVE DIAGNOSTIC SESSION",
      ctaTitle: "Doing more does not always mean moving forward. Direction helps clarify what really needs to be done.",
      ctaDescription: "Content without strategy becomes volume. A website without a purpose becomes underused infrastructure. Technology without operations becomes a cost. Growth without structure becomes strain.",
      ctaButton: "Identify where you are now"
    },
    diagnosticDiagram: {
      maturity: "Maturity level",
      titleFirstLine: "A clear-eyed",
      titleSecondLine: "business assessment",
      description: "An efficiency assessment across the three strategic pillars of a business’s digital presence.",
      instruction: "Select a pillar to see its context.",
      qualitativeLabel: "Qualitative reading",
      pillars: {
        posicionamento: { name: "Positioning and perception", label: "Brand maturity", description: "Digital efforts go unnoticed. Generic posts fail to attract the audience that matches the service’s level." },
        canais: { name: "Channel alignment", label: "Funnel efficiency", description: "Ads run without a structured conversion funnel. Clicks are lost before they become viable proposals." },
        processos: { name: "Systems and playbooks", label: "Operational maturity", description: "Without consolidated workflows, the team depends on the owner’s time and approval to move forward." }
      }
    },
    hero: {
      categories: ["STRATEGY", "POSITIONING", "CONTENT", "TECHNOLOGY", "PROCESSES", "OPERATIONS"],
      eyebrow: "Strategy, content, technology and operations",
      heading: "Digital presence with clear direction for businesses ready to grow without guesswork.",
      description: "TAG08 brings positioning, communication, content, technology and processes together to turn scattered digital efforts into a clearer, more consistent presence that serves the business.",
      contactLabel: "Contact TAG08 to request an initial assessment",
      diagnosticLabel: "Assessment before execution",
      contactCta: "TALK TO TAG08",
      trust: "Method, clarity and responsible execution",
      promise: "DIRECTION TO BUILD. STRUCTURE TO GROW.",
      organize: "WHAT WE ORGANIZE:",
      shortcuts: "Shortcuts to TAG08 solutions"
    },
    mosaic: {
      intro: {
        kicker: "The right structure depends on where you are",
        title: "The right structure depends on where you are.",
        description: "The most comprehensive plan is not automatically the best. The right path depends on the company’s maturity and its capacity to take part in execution."
      },
      m02: {
        aria: "Explore Branding and Identity",
        imageAlt: "TAG08 positioning alignment",
        label: "M-02 // ACTIVE BRANDING",
        title: "Starting with direction",
        description: "The offer is reasonably clear, but communication, identity or the digital routine is still taking shape. Possible paths: Start and Digital Visual Identity."
      },
      m01: {
        aria: "Explore Social Media Management",
        label: "M-01 // DIGITAL PRESENCE",
        title: "An active presence, but inconsistent",
        description: "The business is already running, but communication, calendars and production still rely on one-off decisions. Possible paths: Base, Web Development or a complementary brand project."
      },
      m03: {
        aria: "Explore Audiovisual Production",
        category: "Audiovisual production",
        title: "A brand in growth",
        description: "Planning, video, production, publishing and follow-up need to work together more deeply. Possible paths: Performance, Audiovisual Production or Strategic Repositioning."
      },
      m04: {
        aria: "Explore Strategic Web Development",
        label: "M-04 // STRATEGIC WEB DEVELOPMENT",
        title: "A channel of your own, with a clear purpose",
        description: "A web structure should organize information, strengthen credibility and make the path from interest to contact easier."
      },
      m05: {
        aria: "Explore Process Intelligence",
        label: "M-05 // OPERATIONAL INTELLIGENCE",
        title: "Operations under pressure from growth",
        description: "The business has grown in volume, but processes, responsibilities or knowledge still depend too heavily on improvisation. A possible path: Process Intelligence."
      },
      m06: {
        aria: "Explore Process Activation",
        category: "Process activation",
        title: "Processes exist, but execution is inconsistent",
        description: "When the structure is already in place, Process Activation helps turn definitions into supported day-to-day practice."
      },
      nextStep: {
        aria: "Open the diagnosis",
        label: "Next step",
        category: "Immediate diagnosis",
        title: "Identify where you are now",
        description: "The initial conversation helps assess context, fit, maturity and priorities—without a canned promise or a solution being pushed."
      },
      m07: {
        aria: "Start the diagnosis",
        imageAlt: "TAG08 business workspace",
        label: "M-07 // STRATEGIC ADVISORY",
        title: "I need direction to decide what comes next",
        description: "When priorities are not yet clear, we map the situation, weigh the options and outline a possible route to execution."
      }
    },
    diagnostic: {
      intro: {
        kicker: "Signs of misalignment",
        title: "Signs of strain when digital growth lacks structure.",
        description: "As a digital presence grows without clarity, symptoms begin to show: disconnected decisions, constant urgency, directionless content, rework and difficulty turning effort into a real perception of value. TAG08 uses this assessment to distinguish communication problems from positioning or operational problems. Without that diagnosis, execution can simply accelerate the disorder."
      },
      overview: {
        discovery: { title: "Understanding", badge: "Read the current context", desc: "Understand the brand’s current moment, channels, communication, operations and the main signs of misalignment.", pills: ["Context clarity", "Signs of misalignment"] },
        analysis: { title: "Diagnosis", badge: "Identify root causes", desc: "Review bottlenecks to separate visible symptoms from root causes. Not every marketing problem is solved with more content.", pills: ["Root cause"] },
        design: { title: "Direction", badge: "Next steps", desc: "Recommend the most coherent path for the brand’s current moment, with clear priorities, next steps and boundaries.", pills: ["Priorities", "Next steps"] }
      },
      phaseAria: "Diagnosis: {title}",
      selectPhaseAria: "Select the {title} phase of the diagnosis",
      phaseLabel: "PHASE {step}",
      readingPoints: "ASSESSMENT POINTS:",
      details: {
        discovery: {
          title: "Discovery", desc: "Understand the brand’s current moment, channels, communication, operations and the main signs of misalignment. TAG08 identifies what is blocking clarity, consistency and decision-making.", rating: "Clarity", ratingWidth: 72,
          symptoms: [
            { id: "content_focus", label: "CONTENT WITHOUT DIRECTION", desc: "The brand may be publishing, but its content does not build a clear perception or guide the audience toward a decision.", symptom: "Communication exists, but it does not shape perception or create a next step." },
            { id: "urgency", label: "CONSTANT URGENCY", desc: "Everything seems urgent, yet few requests have clear criteria, an owner, a realistic deadline or defined strategic impact.", symptom: "The pace accelerates without filters, multiplying noise, rework and strain." }
          ]
        },
        analysis: {
          title: "Analysis", desc: "Review bottlenecks to separate visible symptoms from root causes. Not every marketing problem is solved with more content.", rating: "Criteria", ratingWidth: 58,
          symptoms: [{ id: "decisions", label: "DISCONNECTED DECISIONS", desc: "Changes happen under pressure, personal preference or anxiety—with no record and no connection to the plan.", symptom: "Without clear criteria, each adjustment reopens the work instead of consolidating it." }]
        },
        design: {
          title: "Direction", desc: "Recommend the most coherent path for the brand’s current moment, with clear priorities, next steps and boundaries. The deliverable is not a ready-made promise; it is a structured direction for better decisions.", rating: "Direction", ratingWidth: 68,
          symptoms: [{ id: "overloaded", label: "OVERLOADED OPERATIONS", desc: "The team delivers through sheer effort, but the workflow depends on a few people, a lot of memory and little predictability.", symptom: "When operations depend on too few people, growth becomes recurring exhaustion." }]
        }
      },
      readingMoment: "CURRENT MOMENT",
      misalignmentSignal: "MISALIGNMENT SIGNAL",
      effortInsight: "As digital activity grows without structure, effort increases faster than clarity.",
      observedSignals: "OBSERVED SIGNALS",
      signalPrefix: "SIGNAL //",
      possibleImpact: "POSSIBLE IMPACT",
      interactivePanel: "TAG08 INTERACTIVE PANEL",
      requestDiagnosis: "REQUEST AN INITIAL DIAGNOSIS"
    },
    methodCenter: {
      sectionReason: "Why brands in transition choose TAG08",
      sectionTitle: "Why growing brands choose TAG08.",
      sectionDescription: "TAG08 does not come in simply to execute disconnected requests. We understand the context, organize priorities, protect brand coherence and turn strategy into achievable delivery.",
      listen: "LISTEN",
      diagnosisTitle: "Diagnosis before execution",
      diagnosisDescription: "Before producing, we understand the brand’s moment, objectives, bottlenecks and the structure available to support the work.",
      delivery: "DELIVERY",
      strategyTitle: "Strategy with delivery",
      strategyDescription: "TAG08 goes beyond strategic talk. We organize direction, scope, content, design, technology and operations to put the plan into action.",
      unified: "01 // INTEGRATED",
      method: "METHOD",
      fourFronts: "FOUR PILLARS",
      integratedStrategy: "INTEGRATED STRATEGY",
      fourFrontsDescription: "Content, design, technology and operations working toward the same goal.",
      impact: "02 // IMPACT",
      clarity: "CLARITY",
      betterChoices: "BETTER DECISIONS",
      clarityDescription: "Every deliverable respects the context, scope and actual capacity of the operation.",
      center: "Method at the center",
      methodDescription: "Clear direction turns context, priorities and delivery into a path that can be put into practice.",
      editorialContinuity: "CONTINUITY",
      process: "PROCESS",
      followThrough: "PROCESS AND FOLLOW-THROUGH",
      followThroughDescription: "Briefing, approval and documentation reduce improvisation throughout the work.",
      technology: "04 // TECHNOLOGY",
      clearFunction: "CLEAR PURPOSE",
      appliedTechnology: "APPLIED TECHNOLOGY",
      technologyDescription: "Tools and development come in when they help fulfill a real purpose.",
      review: "REVIEW AND ADJUST",
      continuousImprovement: "Analysis and continuous improvement",
      improvementDescription: "Data and learning guide adjustments without turning a single metric into a promise of results.",
      proof: "PROOF",
      noPromise: "IN THE DIAGNOSIS",
      proofDescription: "Trust does not come from a ready-made promise. It comes from clear diagnosis, coherent strategy and responsible execution.",
      methodValue: "METHOD",
      coherence: "COHERENCE",
      trustDescription: "Trust is built through clarity, method and consistent delivery.",
      contact: "TALK TO TAG08"
    },
    solutionMap: {
      introLabel: "Solutions map",
      title: "Solutions for every stage of your brand.",
      description: "TAG08 does not start by offering a ready-made package. First, we understand the business’s current moment. Then we recommend the right structure for organizing presence, positioning, content, technology or operations.",
      moment: "Stage {number}",
      related: "Related:",
      ctaAll: "EXPLORE SOLUTIONS",
      cards: {
        "estrategia-posicionamento": { title: "Strategy and positioning", subtitle: "Clarity before execution", desc: "For businesses and professionals whose communication no longer reflects their value, audience or current stage of business.", related: "Strategic Advisory, Strategic Repositioning and Brand Identity.", cta: "Explore strategy and positioning" },
        "conteudo-redes-sociais": { title: "Content and social media", subtitle: "Presence with an editorial plan", desc: "For businesses that need to move beyond sporadic content and build a communication routine with defined topics, formats, frequency and intent.", related: "Start, Base, Performance, Social Media Management and Reels Editing.", cta: "Explore content and social media" },
        "producao-audiovisual": { title: "Audiovisual production", subtitle: "Purposeful images, voices and behind the scenes", desc: "For businesses, specialists and projects that need to turn knowledge, presence and events into useful communication and positioning assets.", related: "Audiovisual Production, Reels and tailored productions.", cta: "Explore audiovisual production" },
        "desenvolvimento-web": { title: "Web and digital infrastructure", subtitle: "An owned channel with a clear purpose", desc: "For brands that need to organize information, strengthen credibility and make the path from interest to contact easier.", related: "Strategic Websites, Landing Pages and web projects. E-commerce depends on an operational readiness assessment.", cta: "Explore web development" },
        "processos-operacao": { title: "Processes and operations", subtitle: "Less improvisation, more predictability", desc: "For companies where growth, demand or knowledge has become too dependent on a few people, memory or informal decisions.", related: "Process Intelligence and Process Activation.", cta: "Explore processes and operations" },
        "hospedagem-manutencao": { title: "Digital continuity", subtitle: "The project continues after launch", desc: "For businesses that need ongoing support to keep digital infrastructure monitored, updated and technically sustainable.", related: "Hosting and Maintenance.", cta: "Explore digital continuity" }
      }
    },
    methodology: {
      kicker: "From analysis to execution",
      title: "After diagnosis, execution needs a method.",
      description: "TAG08 organizes the path before producing: we understand the situation, set priorities, structure deliverables, support activation and adjust what needs to evolve.",
      steps: [
        { label: "01 // UNDERSTANDING", title: "Understanding", desc: "A review of the business, objectives, current moment, communication, channels, structure and relevant constraints." },
        { label: "02 // DIAGNOSIS AND DIRECTION", title: "Diagnosis and direction", desc: "Separating symptoms from causes to set priorities and define the most coherent path." },
        { label: "03 // PLANNING", title: "Planning", desc: "Organizing scope, execution sequence, responsibilities, dependencies and approval criteria." },
        { label: "04 // EXECUTION", title: "Execution", desc: "Production and development aligned with strategy, identity, channel and available capacity." },
        { label: "05 // EVOLUTION", title: "Evolution", desc: "Reviewing what we’ve learned, results and adjustments to carry into the next cycle." }
      ],
      closing: "Consistent execution starts with clear direction."
    },
    videos: {
      badge: "Audiovisual production",
      title: "Videos, behind the scenes and stories",
      titleSecondLine: "with brand intent.",
      description: "TAG08 creates audiovisual content for brands, specialists and events that need to turn presence, voices, places and behind-the-scenes moments into clear, polished assets with a strategic purpose.",
      closePlayer: "CLOSE PLAYER",
      watchAria: "Play TAG08 video: {title}",
      watch: "WATCH",
      consentDescription: "To load the YouTube player, we need your permission to use social media content.",
      consentDecline: "Not now",
      consentAccept: "Allow and play",
      duration: "DURATION: {duration}",
      about: "About this video",
      portfolio: "AUDIOVISUAL PORTFOLIO",
      formats: "FORMATS",
      episode: "EPISODE {number}",
      activeCuration: "ACTIVE CURATION",
      internalCuration: "INTERNAL CURATION",
      ctaTitle: "Want to explore TAG08 audiovisual production?",
      ctaDescription: "See how TAG08 turns images, voices and behind-the-scenes moments into clear, polished brand deliverables.",
      ctaButton: "EXPLORE AUDIOVISUAL PRODUCTION",
      fallback: [
        { title: "Brand stories", description: "Videos that present a brand, its story, differentiators and the value it creates.", date: "28 May, 2026", category: "BRAND STORIES", views: "PORTFOLIO 01", tagline: "CLEAR NARRATIVE" },
        { title: "Event coverage", description: "Strategic coverage of moments, behind-the-scenes activity, talks and experiences that extend an event’s value after it ends.", date: "14 May, 2026", category: "EVENTS", views: "PORTFOLIO 02", tagline: "PURPOSEFUL BEHIND THE SCENES" },
        { title: "Content for specialists", description: "Filming and editing talks, classes, interviews and expert content with clear language and a professional presence.", date: "03 May, 2026", category: "SPECIALISTS", views: "PORTFOLIO 03", tagline: "EXPERTISE ON CAMERA" },
        { title: "Social media assets", description: "Edits, reels, short videos and recurring formats aligned with the brand’s editorial direction and positioning.", date: "21 Apr, 2026", category: "SOCIAL MEDIA", views: "PORTFOLIO 04", tagline: "EDITORIAL DIRECTION" }
      ]
    }
} as const;

export type HomeDiagnosticDiagramCopy = WidenCopy<typeof HOME_EN_COPY.diagnosticDiagram>;

export const HOME_PILOT_COPY: Record<Exclude<RouteLocale, "pt">, WidenCopy<typeof HOME_EN_COPY>> = {
  en: HOME_EN_COPY,
  es: {
    institutional: {
      badge: "Sobre TAG08",
      title: "Conoce a las personas que están detrás del trabajo.",
      description: "Conoce la historia, el equipo y los principios que orientan las decisiones de TAG08.",
      button: "CONOCE TAG08"
    },
    proof: {
      imageAlt: "Dirección creativa de TAG08",
      operationalCore: "NÚCLEO OPERATIVO",
      direction: "Presencia con dirección",
      titleFirstLine: "Presencia",
      titleSecondLine: "con dirección.",
      description: "Una marca necesita más que visibilidad. Debe ser comprendida por el público adecuado, comunicar su valor con coherencia y cumplir lo que comunica. La estrategia define elecciones. El contenido construye entendimiento. La tecnología crea estructura. Los procesos sostienen la ejecución.",
      prompt: "Sin dirección, la presencia se convierte en ruido.",
      intro: "La conversación inicial empieza por entender el momento actual.",
      whatsappDirect: "CONTACTO DIRECTO POR WHATSAPP",
      whatsappInternational: "WHATSAPP INTERNACIONAL",
      internationalDirect: "CONTACTO INTERNACIONAL DIRECTO",
      whatsappMessage: "Hola, me gustaría hablar con TAG08",
      talkToTag08: "HABLAR CON TAG08",
      operationActive: "OPERACIÓN ACTIVA"
    },
    reviews: {
      trustBadge: "Confianza construida en la práctica",
      title: "Experiencias acompañadas con claridad",
      description: "Cuando el trabajo incluye diagnóstico, claridad y seguimiento, el cliente comprende mejor el camino, participa en las decisiones y percibe mayor coherencia entre estrategia y entrega.",
      ratingTitle: "RESEÑAS",
      ratingDescription: "Las reseñas registran percepciones; la confianza se sostiene con seguimiento, claridad y coherencia en la entrega.",
      ariaReview: "Reseña de {name}",
      googleVerified: "VERIFICADO EN GOOGLE",
      cta: "HABLAR CON TAG08"
    },
    cases: {
      eyebrow: "CASOS Y POSICIONAMIENTO DIGITAL",
      titleFirstLine: "LOS CLIENTES",
      titleSecondLine: "MARCAN EL CAMBIO_",
      directContact: "CONTACTO DIRECTO",
      contactCta: "HABLAR CON TAG08",
      selector: "SELECCIÓN DE CASOS",
      selectorHint: "Elige una historia para conocer su posicionamiento y resultados:",
      unavailableTitle: "Las historias de clientes aún no están disponibles en este idioma.",
      unavailableDescription: "Estos testimonios son evidencia atribuida y se mantienen en su portugués original. Solo se mostrarán aquí cuando exista una versión aprobada y segura para este idioma."
    },
    faq: {
      badge: "Preguntas importantes antes de conversar",
      titleFirstLine: "Preguntas importantes",
      titleSecondLine: "antes de conversar.",
      description: "Respuestas sobre el papel de TAG08, la elección del servicio, el alcance, el inicio y las expectativas de resultados.",
      questions: [
        "¿Cuál es el papel de TAG08?",
        "¿Cómo elegimos el servicio?",
        "¿Cómo funcionan los paquetes y el alcance?",
        "¿Cuándo puede comenzar el proyecto?",
        "¿Cómo aborda TAG08 los resultados y las expectativas?"
      ],
      categories: ["ENTENDIMIENTO", "DIAGNÓSTICO", "ALCANCE", "INICIO", "EXPECTATIVAS"],
      answers: [
        "TAG08 trabaja con estrategia, comunicación, diseño, contenido, tecnología y procesos. Algunas entregas son habituales en una agencia de marketing; la diferencia está en diagnosticar y organizar el camino antes de ejecutar.",
        "No es necesario saber qué solución contratar antes de contactarnos. El contexto inicial ayuda a identificar si el desafío está en posicionamiento, contenido, identidad, audiovisual, web, procesos o en la combinación de estas áreas.",
        "Hay soluciones estructuradas, pero la recomendación considera el momento, la madurez, la capacidad de inversión y la participación necesaria del cliente. El objetivo es alinear problema, alcance y expectativas.",
        "El inicio depende del tipo de proyecto, la información necesaria, la capacidad operativa y las etapas de alineación. El diagnóstico, el alcance, los responsables y las dependencias se organizan antes de ejecutar.",
        "TAG08 no promete crecimiento instantáneo ni resultados garantizados. El compromiso está en el método, la dirección, la ejecución responsable, el seguimiento y la mejora continua."
      ],
      imageAlt: "Equipo de TAG08 trabajando",
      rightCardTitle: "CÓMO TRABAJA TAG08",
      rightCardHeading: "Diagnóstico antes de la propuesta.",
      rightCardDescription: "Organizamos el entendimiento, las prioridades y el alcance antes de iniciar cualquier entrega.",
      solutions: "VER SOLUCIONES",
      nextStep: "PRÓXIMO PASO",
      brandCardTitle: "El mejor camino comienza por entender el momento actual.",
      brandCardDescription: "Antes de una propuesta, TAG08 organiza el contexto: qué quiere construir la empresa, qué está frenando ese avance y qué estructura puede sostener la siguiente etapa.",
      contactCta: "ENCONTRAR MI MEJOR CAMINO"
    },
    problem: {
      badge: "Más ejecución no corrige la falta de dirección",
      title: "Más ejecución no corrige la falta de dirección.",
      description: "Una empresa puede publicar, anunciarse, producir videos y tener un sitio web sin que esos esfuerzos transmitan una percepción coherente. Cuando el posicionamiento, la comunicación y la operación avanzan por caminos distintos, lo digital acumula acciones sin ayudar al público ni a la propia empresa a decidir. TAG08 aborda ese punto: identifica lo que está desalineado, organiza prioridades y conecta estrategia y ejecución con el momento real del negocio.",
      ctaSr: "Destacado:",
      ctaBadge: "SESIÓN DE DIAGNÓSTICO EXCLUSIVA",
      ctaTitle: "Hacer más no siempre significa avanzar. La dirección ayuda a entender qué hace falta de verdad.",
      ctaDescription: "El contenido sin estrategia se convierte en volumen. Un sitio sin función se convierte en una estructura desaprovechada. La tecnología sin operación se convierte en un costo. El crecimiento sin estructura se convierte en desgaste.",
      ctaButton: "Identificar mi momento"
    },
    diagnosticDiagram: {
      maturity: "Nivel de madurez",
      titleFirstLine: "El diagnóstico",
      titleSecondLine: "de la realidad",
      description: "Un análisis de eficiencia de los tres pilares estratégicos de la presencia empresarial.",
      instruction: "Selecciona un pilar para ver el contexto.",
      qualitativeLabel: "Lectura cualitativa",
      pillars: {
        posicionamento: { name: "Posicionamiento y percepción", label: "Madurez de marca", description: "El esfuerzo digital pasa desapercibido. Las publicaciones genéricas no atraen al público adecuado para el nivel del servicio." },
        canais: { name: "Sincronía de canales", label: "Eficiencia del embudo", description: "Los anuncios circulan sin un embudo de conversión estructurado. Los clics se pierden antes de convertirse en propuestas viables." },
        processos: { name: "Sistemas y playbooks", label: "Madurez operativa", description: "La ausencia de flujos consolidados hace que el equipo dependa del tiempo y la aprobación del dueño para avanzar." }
      }
    },
    hero: {
      categories: ["ESTRATEGIA", "POSICIONAMIENTO", "CONTENIDO", "TECNOLOGÍA", "PROCESOS", "OPERACIONES"],
      eyebrow: "Estrategia, contenido, tecnología y operaciones",
      heading: "Presencia digital con dirección para negocios que quieren crecer sin improvisar.",
      description: "TAG08 organiza el posicionamiento, la comunicación, el contenido, la tecnología y los procesos para convertir acciones digitales dispersas en una presencia más clara, coherente y útil para el negocio.",
      contactLabel: "Contactar con TAG08 para solicitar una evaluación inicial",
      diagnosticLabel: "Evaluación antes de la ejecución",
      contactCta: "HABLA CON TAG08",
      trust: "Método, claridad y ejecución responsable",
      promise: "DIRECCIÓN PARA CONSTRUIR. ESTRUCTURA PARA CRECER.",
      organize: "LO QUE ORGANIZAMOS:",
      shortcuts: "Accesos directos a las soluciones de TAG08"
    },
    mosaic: {
      intro: {
        kicker: "La estructura adecuada depende del momento",
        title: "La estructura adecuada depende del momento.",
        description: "El plan más completo no es automáticamente el mejor. El camino adecuado depende de la madurez de la empresa y de su capacidad para participar en la ejecución."
      },
      m02: {
        aria: "Ver el servicio de branding e identidad",
        imageAlt: "Alineación de posicionamiento de TAG08",
        label: "M-02 // BRANDING ACTIVO",
        title: "Empezar con dirección",
        description: "La oferta está razonablemente clara, pero la comunicación, la identidad o la rutina digital aún están en desarrollo. Caminos posibles: Start e Identidad Visual Digital."
      },
      m01: {
        aria: "Ver el servicio de gestión de redes sociales",
        label: "M-01 // PRESENCIA DIGITAL",
        title: "Presencia activa, pero inconsistente",
        description: "El negocio ya funciona, pero la comunicación, el calendario y la producción aún dependen de decisiones puntuales. Caminos posibles: Base, Desarrollo Web o un proyecto complementario de marca."
      },
      m03: {
        aria: "Ver el servicio de producción audiovisual",
        category: "Producción audiovisual",
        title: "Una marca en crecimiento",
        description: "Hace falta integrar mejor la planificación, el video, la producción, la publicación y el seguimiento. Caminos posibles: Performance, Producción Audiovisual o Reposicionamiento Estratégico."
      },
      m04: {
        aria: "Ver el servicio de desarrollo web estratégico",
        label: "M-04 // DESARROLLO WEB ESTRATÉGICO",
        title: "Un canal propio con una función clara",
        description: "La estructura web debe organizar la información, reforzar la credibilidad y facilitar el camino del interés al contacto."
      },
      m05: {
        aria: "Ver el servicio Process Intelligence",
        label: "M-05 // INTELIGENCIA OPERACIONAL",
        title: "Operación bajo presión por el crecimiento",
        description: "La empresa aumentó su volumen, pero los procesos, las responsabilidades o el conocimiento todavía dependen demasiado de la improvisación. Un camino posible: Process Intelligence."
      },
      m06: {
        aria: "Ver el servicio Process Activation",
        category: "Activación de procesos",
        title: "Hay procesos, pero la ejecución es irregular",
        description: "Cuando la estructura ya existe, Process Activation ayuda a convertir las definiciones en práctica acompañada."
      },
      nextStep: {
        aria: "Ir a la evaluación inicial",
        label: "Próximo paso",
        category: "Diagnóstico inmediato",
        title: "Identificar mi momento",
        description: "La conversación inicial ayuda a evaluar el contexto, el encaje, la madurez y las prioridades, sin promesas prefabricadas ni soluciones impuestas."
      },
      m07: {
        aria: "Iniciar la evaluación inicial",
        imageAlt: "Espacio de trabajo empresarial de TAG08",
        label: "M-07 // ASESORÍA ESTRATÉGICA",
        title: "Necesito dirección para decidir el próximo paso",
        description: "Cuando las prioridades aún no están claras, organizamos el escenario, las opciones y una posible ruta de ejecución."
      }
    },
    diagnostic: {
      intro: {
        kicker: "Señales de desalineación",
        title: "Señales de desgaste cuando lo digital crece sin estructura.",
        description: "Cuando la presencia digital crece sin claridad, aparecen algunos síntomas: decisiones aisladas, urgencias constantes, contenido sin dirección, retrabajo y dificultad para convertir el esfuerzo en una percepción real de valor. TAG08 utiliza esta lectura para distinguir los problemas de comunicación, posicionamiento y operación. Sin este diagnóstico, cualquier ejecución corre el riesgo de acelerar la desorganización."
      },
      overview: {
        discovery: { title: "Comprensión", badge: "Lectura del momento", desc: "Comprender el momento actual de la marca, sus canales, comunicación, operación y principales señales de desalineación.", pills: ["Claridad del contexto", "Señales de desalineación"] },
        analysis: { title: "Diagnóstico", badge: "Lectura de causas", desc: "Analizar los obstáculos para separar síntomas visibles de causas reales. No todos los problemas de marketing se resuelven con más contenido.", pills: ["Causa real"] },
        design: { title: "Dirección", badge: "Próximos pasos", desc: "Recomendar el camino más coherente para el momento de la marca, con prioridades, próximos pasos y límites claros.", pills: ["Prioridades", "Próximos pasos"] }
      },
      phaseAria: "Diagnóstico: {title}",
      selectPhaseAria: "Seleccionar la fase {title} del diagnóstico",
      phaseLabel: "FASE {step}",
      readingPoints: "PUNTOS DE ANÁLISIS:",
      details: {
        discovery: {
          title: "Descubrimiento", desc: "Comprender el momento actual de la marca, sus canales, comunicación, operación y principales señales de desalineación. TAG08 identifica qué bloquea la claridad, la coherencia y la toma de decisiones.", rating: "Claridad", ratingWidth: 72,
          symptoms: [
            { id: "content_focus", label: "CONTENIDO SIN DIRECCIÓN", desc: "La marca puede publicar, pero su contenido no construye una percepción clara ni guía al público hacia una decisión.", symptom: "La comunicación existe, pero no organiza la percepción ni genera un próximo paso." },
            { id: "urgency", label: "URGENCIA CONSTANTE", desc: "Todo parece prioritario, pero pocas demandas tienen criterios, responsables, plazos realistas o impacto estratégico definido.", symptom: "El ritmo se acelera sin filtros y multiplica el ruido, el retrabajo y el desgaste." }
          ]
        },
        analysis: {
          title: "Análisis", desc: "Analizar los obstáculos para separar síntomas visibles de causas reales. No todos los problemas de marketing se resuelven con más contenido.", rating: "Criterio", ratingWidth: 58,
          symptoms: [{ id: "decisions", label: "DECISIONES AISLADAS", desc: "Los cambios ocurren por presión, preferencias personales o ansiedad, sin registro ni conexión con el plan.", symptom: "La falta de criterio hace que cada ajuste reabra el trabajo en lugar de consolidarlo." }]
        },
        design: {
          title: "Dirección", desc: "Recomendar el camino más coherente para el momento de la marca, con prioridades, próximos pasos y límites claros. La entrega no es una promesa prefabricada, sino una dirección estructurada para decidir mejor.", rating: "Dirección", ratingWidth: 68,
          symptoms: [{ id: "overloaded", label: "OPERACIÓN SOBRECARGADA", desc: "El equipo cumple a base de esfuerzo, pero el flujo depende de pocas personas, mucha memoria y poca previsibilidad.", symptom: "Cuando la operación depende de pocas personas, el crecimiento se convierte en cansancio recurrente." }]
        }
      },
      readingMoment: "LECTURA DEL MOMENTO",
      misalignmentSignal: "SEÑAL DE DESALINEACIÓN",
      effortInsight: "Cuando lo digital crece sin estructura, el esfuerzo aumenta más rápido que la claridad.",
      observedSignals: "SEÑALES OBSERVADAS",
      signalPrefix: "SEÑAL //",
      possibleImpact: "POSIBLE IMPACTO",
      interactivePanel: "PANEL INTERACTIVO TAG08",
      requestDiagnosis: "SOLICITAR UN DIAGNÓSTICO INICIAL"
    },
    methodCenter: {
      sectionReason: "Por qué las marcas en evolución eligen TAG08",
      sectionTitle: "Por qué las marcas en crecimiento eligen TAG08.",
      sectionDescription: "TAG08 no llega solo para ejecutar demandas aisladas. Entendemos el contexto, organizamos prioridades, protegemos la coherencia de la marca y convertimos la estrategia en entregas posibles.",
      listen: "ESCUCHA",
      diagnosisTitle: "Diagnóstico antes de la ejecución",
      diagnosisDescription: "Antes de producir, entendemos el momento de la marca, sus objetivos, obstáculos y la estructura disponible para sostener el trabajo.",
      delivery: "ENTREGA",
      strategyTitle: "Estrategia con entrega",
      strategyDescription: "TAG08 no se queda en el discurso estratégico. Organizamos dirección, alcance, contenido, diseño, tecnología y operación para hacer realidad el plan.",
      unified: "01 // INTEGRADO",
      method: "MÉTODO",
      fourFronts: "CUATRO FRENTES",
      integratedStrategy: "ESTRATEGIA INTEGRADA",
      fourFrontsDescription: "Contenido, diseño, tecnología y operación trabajando en la misma dirección.",
      impact: "02 // IMPACTO",
      clarity: "CLARIDAD",
      betterChoices: "MEJORES DECISIONES",
      clarityDescription: "Cada entrega respeta el contexto, el alcance y la capacidad real de la operación.",
      center: "El método en el centro",
      methodDescription: "Una dirección clara transforma contexto, prioridades y entregas en un camino aplicable.",
      editorialContinuity: "CONTINUIDAD",
      process: "PROCESO",
      followThrough: "PROCESO Y ACOMPAÑAMIENTO",
      followThroughDescription: "El briefing, la aprobación y la documentación reducen la improvisación durante el trabajo.",
      technology: "04 // TECNOLOGÍA",
      clearFunction: "FUNCIÓN CLARA",
      appliedTechnology: "TECNOLOGÍA APLICADA",
      technologyDescription: "Las herramientas y el desarrollo se incorporan cuando ayudan a cumplir una función real.",
      review: "ANÁLISIS Y AJUSTE",
      continuousImprovement: "Análisis y mejora continua",
      improvementDescription: "Los datos y aprendizajes orientan ajustes sin convertir una métrica aislada en una promesa de resultados.",
      proof: "PRUEBA",
      noPromise: "EN EL DIAGNÓSTICO",
      proofDescription: "La confianza no nace de una promesa prefabricada. Nace de la claridad en el diagnóstico, la coherencia estratégica y la responsabilidad en la ejecución.",
      methodValue: "MÉTODO",
      coherence: "COHERENCIA",
      trustDescription: "La confianza se construye con claridad, método y entregas coherentes.",
      contact: "HABLA CON TAG08"
    },
    solutionMap: {
      introLabel: "Mapa de soluciones",
      title: "Soluciones para cada momento de tu marca.",
      description: "TAG08 no empieza ofreciendo un paquete prefabricado. Primero entendemos el momento del negocio. Después recomendamos la estructura más adecuada para organizar presencia, posicionamiento, contenido, tecnología u operación.",
      moment: "Momento {number}",
      related: "Relacionados:",
      ctaAll: "CONOCER SOLUCIONES",
      cards: {
        "estrategia-posicionamento": { title: "Estrategia y posicionamiento", subtitle: "Claridad antes de ejecutar", desc: "Para empresas y profesionales cuya comunicación ya no representa correctamente su valor, público o etapa actual del negocio.", related: "Asesoría Estratégica, Reposicionamiento Estratégico e Identidad de Marca.", cta: "Conocer estrategia y posicionamiento" },
        "conteudo-redes-sociais": { title: "Contenido y redes sociales", subtitle: "Presencia con línea editorial", desc: "Para negocios que necesitan dejar atrás la producción aislada y construir una rutina de comunicación con temas, formatos, frecuencia e intención definidos.", related: "Start, Base, Performance, Gestión de Redes Sociales y Edición de Reels.", cta: "Conocer contenido y redes sociales" },
        "producao-audiovisual": { title: "Producción audiovisual", subtitle: "Imagen, voz y detrás de escena con propósito", desc: "Para empresas, especialistas y proyectos que necesitan transformar conocimiento, presencia y acontecimientos en materiales útiles para la comunicación y el posicionamiento.", related: "Producción Audiovisual, Reels y producciones específicas.", cta: "Conocer producción audiovisual" },
        "desenvolvimento-web": { title: "Web e infraestructura digital", subtitle: "Un canal propio con una función clara", desc: "Para marcas que necesitan organizar información, fortalecer su credibilidad y facilitar el camino entre el interés y el contacto.", related: "Sitios Estratégicos, Landing Pages y proyectos web. El e-commerce depende de un diagnóstico de preparación operativa.", cta: "Conocer desarrollo web" },
        "processos-operacao": { title: "Procesos y operación", subtitle: "Menos improvisación, más previsibilidad", desc: "Para empresas en las que el crecimiento, las demandas o el conocimiento han empezado a depender demasiado de pocas personas, de la memoria o de decisiones informales.", related: "Process Intelligence y Process Activation.", cta: "Conocer procesos y operación" },
        "hospedagem-manutencao": { title: "Continuidad digital", subtitle: "El proyecto continúa después de la publicación", desc: "Para negocios que necesitan mantener sus estructuras digitales acompañadas, actualizadas y técnicamente sostenibles a lo largo del tiempo.", related: "Hospedaje y Mantenimiento.", cta: "Conocer continuidad digital" }
      }
    },
    methodology: {
      kicker: "Del análisis a la ejecución",
      title: "Después del diagnóstico, la ejecución necesita método.",
      description: "TAG08 organiza el camino antes de producir: entiende el escenario, define prioridades, estructura entregas, acompaña la activación y ajusta lo que debe evolucionar.",
      steps: [
        { label: "01 // COMPRENSIÓN", title: "Comprensión", desc: "Lectura del negocio, los objetivos, el momento actual, la comunicación, los canales, la estructura y las restricciones relevantes." },
        { label: "02 // DIAGNÓSTICO Y DIRECCIÓN", title: "Diagnóstico y dirección", desc: "Separar síntomas de causas para definir prioridades y el camino más coherente." },
        { label: "03 // PLANIFICACIÓN", title: "Planificación", desc: "Organizar el alcance, la secuencia de ejecución, las responsabilidades, las dependencias y los criterios de aprobación." },
        { label: "04 // EJECUCIÓN", title: "Ejecución", desc: "Producción y desarrollo alineados con la estrategia, la identidad, el canal y la capacidad disponible." },
        { label: "05 // EVOLUCIÓN", title: "Evolución", desc: "Análisis de aprendizajes, resultados y ajustes que deben entrar en el próximo ciclo." }
      ],
      closing: "No existe una ejecución coherente sin una dirección clara."
    },
    videos: {
      badge: "Producción audiovisual",
      title: "Videos, detrás de escena y narrativas",
      titleSecondLine: "con intención de marca.",
      description: "TAG08 produce contenido audiovisual para marcas, especialistas y eventos que necesitan convertir presencia, voz, espacios y momentos detrás de escena en materiales claros, cuidados y con función estratégica.",
      closePlayer: "CERRAR REPRODUCTOR",
      watchAria: "Reproducir video de TAG08: {title}",
      watch: "REPRODUCIR",
      consentDescription: "Para cargar el reproductor de YouTube, necesitamos tu autorización para usar contenido de redes sociales.",
      consentDecline: "Ahora no",
      consentAccept: "Permitir y reproducir",
      duration: "DURACIÓN: {duration}",
      about: "Sobre este video",
      portfolio: "PORTAFOLIO AUDIOVISUAL",
      formats: "FORMATOS",
      episode: "EPISODIO {number}",
      activeCuration: "CURADURÍA ACTIVA",
      internalCuration: "CURADURÍA INTERNA",
      ctaTitle: "¿Quieres conocer la producción audiovisual de TAG08?",
      ctaDescription: "Descubre cómo TAG08 organiza imágenes, voces y detrás de escena en entregas claras, cuidadas y con función de marca.",
      ctaButton: "CONOCER PRODUCCIÓN AUDIOVISUAL",
      fallback: [
        { title: "Historias de marca", description: "Videos que presentan una marca, su historia, sus diferenciales y la forma en que genera valor.", date: "28 may 2026", category: "INSTITUCIONAL", views: "PORTAFOLIO 01", tagline: "NARRATIVA CLARA" },
        { title: "Cobertura de eventos", description: "Registro estratégico de momentos, detrás de escena, intervenciones y experiencias para ampliar el valor del evento después de su cierre.", date: "14 may 2026", category: "EVENTOS", views: "PORTAFOLIO 02", tagline: "DETRÁS DE ESCENA CON PROPÓSITO" },
        { title: "Contenido para especialistas", description: "Grabación y edición de intervenciones, clases, entrevistas y contenido de autoridad con lenguaje claro y presencia profesional.", date: "03 may 2026", category: "ESPECIALISTAS", views: "PORTAFOLIO 03", tagline: "AUTORIDAD EN ESCENA" },
        { title: "Materiales para redes sociales", description: "Ediciones, reels, videos cortos y formatos recurrentes alineados con la línea editorial y el posicionamiento de la marca.", date: "21 abr 2026", category: "REDES SOCIALES", views: "PORTAFOLIO 04", tagline: "LÍNEA EDITORIAL" }
      ]
    }
  }
};
