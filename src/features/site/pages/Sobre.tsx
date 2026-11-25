import { useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, BookOpen, Settings, Target } from "../../../components/DooIcons";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ResilientImage from "../../../components/ResilientImage";
import { getVisibleEvidence } from "../../../content/publicEvidence";
import { getRouteByPath, isRouteLocalePublished, type RouteLocale } from "../../../config/routeRegistry";

interface SobreProps {
  onNavigate: (page: string) => void;
  locale?: RouteLocale;
}

const ABOUT_COPY = {
  en: {
    "Sobre a TAG08": "About TAG08",
    "Direção para construir presença. ": "Direction to build a presence. ",
    "Estrutura para sustentar crescimento.": "Structure to sustain growth.",
    "Falar com a TAG08": "Talk to TAG08",
    "A TAG08 conecta estratégia, conteúdo, design, tecnologia e processos para ajudar marcas e negócios a sair do improviso, organizar prioridades e construir uma presença digital mais clara, consistente e sustentável.": "TAG08 brings strategy, content, design, technology, and processes together to help brands and businesses move beyond improvisation, organize priorities, and build a clearer, more consistent, and sustainable digital presence.",
    "Imagem editorial": "Editorial image",
    "Presença com direção": "A presence with direction",
    "Direção TAG08": "TAG08 direction",
    "Profissionais que podem integrar os projetos.": "Professionals who may join client projects.",
    "A composição da equipe varia conforme o escopo de cada cliente. Conheça as pessoas e áreas de atuação que podem participar das entregas.": "The team composition varies with each client's scope. Meet the people and areas of expertise that may contribute to project delivery.",
    "Retrato de ": "Portrait of ",
    "Abrir perfil de ": "Open ",
    " no LinkedIn em nova guia": "'s LinkedIn profile in a new tab",
    "Método na prática.": "Method in practice.",
    "Comunicação, design, tecnologia e processos só geram valor quando estão conectados a um diagnóstico claro, prioridades bem definidas e uma execução possível de sustentar.": "Communication, design, technology, and processes create value when they are connected to a clear diagnosis, well-defined priorities, and an execution plan the business can sustain.",
    "A TAG08 não busca parecer maior do que é. Busca construir caminhos claros, coerentes e sustentáveis para cada marca.": "TAG08 does not try to appear larger than it is. It aims to build clear, coherent, and sustainable paths for each brand.",
    "Método TAG08": "TAG08 method",
    "Direção aplicada": "Direction in practice",
    "Um próximo passo coerente começa pelo entendimento.": "A coherent next step starts with understanding.",
    "Antes de transformar uma demanda em execução, organizamos prioridades, identificamos gargalos e indicamos um caminho viável.": "Before turning a request into execution, we organize priorities, identify bottlenecks, and point to a viable path.",
    "Conhecer soluções": "Explore our solutions",
    "Repertório de colaborações.": "A record of collaborations.",
    "Uma seleção de negócios atendidos em diferentes momentos e frentes, apresentada com autorização de uso.": "A selection of businesses we have supported at different stages and across different areas, shown with permission.",
    "Marcas que já trabalharam com a TAG08": "Brands that have worked with TAG08",
    "Logo da ": "Logo of ",
    "A presença nesta seleção não representa recomendação pública, parceria ativa ou promessa de resultado.": "Being included here does not imply a public endorsement, active partnership, or promise of results.",
    "Cultura e colaboração.": "Culture and collaboration.",
    "A TAG08 valoriza pessoas que sabem pensar antes de executar, respeitam processo, cuidam da qualidade e entendem que criatividade também precisa de método.": "TAG08 values people who think before acting, respect process, care about quality, and understand that creativity also needs method.",
    "Ocultar": "Hide",
    "Ver": "View",
    " princípios de ": " principles of ",
    "Ocultar princípios": "Hide principles",
    "Ver princípios": "View principles",
    "Quer fazer parte do jeito TAG08 de trabalhar?": "Would you like to work the TAG08 way?",
    "Se você se identifica com pensamento estratégico, cuidado com a entrega e responsabilidade com o processo, vale conhecer nosso espaço de colaboração.": "If you value strategic thinking, care in delivery, and responsibility for the process, learn more about our collaboration opportunities.",
    "Conhecer o Trabalhe Conosco": "Explore career opportunities",
    "O próximo passo começa pelo entendimento do momento atual.": "The next step starts with understanding where you are today.",
    "Antes de propor uma solução, a TAG08 procura entender o momento, os desafios e as prioridades da marca para indicar um caminho claro, coerente e responsável.": "Before proposing a solution, TAG08 seeks to understand the brand's current situation, challenges, and priorities so it can recommend a clear, coherent, and responsible path."
  },
  es: {
    "Sobre a TAG08": "Sobre TAG08",
    "Direção para construir presença. ": "Dirección para construir presencia. ",
    "Estrutura para sustentar crescimento.": "Estructura para sostener el crecimiento.",
    "Falar com a TAG08": "Hablar con TAG08",
    "A TAG08 conecta estratégia, conteúdo, design, tecnologia e processos para ajudar marcas e negócios a sair do improviso, organizar prioridades e construir uma presença digital mais clara, consistente e sustentável.": "TAG08 conecta estrategia, contenido, diseño, tecnología y procesos para ayudar a marcas y empresas a dejar atrás la improvisación, organizar prioridades y construir una presencia digital más clara, coherente y sostenible.",
    "Imagem editorial": "Imagen editorial",
    "Presença com direção": "Presencia con dirección",
    "Direção TAG08": "Dirección TAG08",
    "Profissionais que podem integrar os projetos.": "Profesionales que pueden integrarse a los proyectos.",
    "A composição da equipe varia conforme o escopo de cada cliente. Conheça as pessoas e áreas de atuação que podem participar das entregas.": "La composición del equipo varía según el alcance de cada cliente. Conoce a las personas y áreas de especialidad que pueden participar en las entregas.",
    "Retrato de ": "Retrato de ",
    "Abrir perfil de ": "Abrir el perfil de ",
    " no LinkedIn em nova guia": " en LinkedIn en una nueva pestaña",
    "Método na prática.": "Método en práctica.",
    "Comunicação, design, tecnologia e processos só geram valor quando estão conectados a um diagnóstico claro, prioridades bem definidas e uma execução possível de sustentar.": "La comunicación, el diseño, la tecnología y los procesos generan valor cuando se conectan con un diagnóstico claro, prioridades definidas y una ejecución que la empresa pueda sostener.",
    "A TAG08 não busca parecer maior do que é. Busca construir caminhos claros, coerentes e sustentáveis para cada marca.": "TAG08 no busca aparentar ser más grande de lo que es. Busca construir caminos claros, coherentes y sostenibles para cada marca.",
    "Método TAG08": "Método TAG08",
    "Direção aplicada": "Dirección aplicada",
    "Um próximo passo coerente começa pelo entendimento.": "Un próximo paso coherente comienza por comprender.",
    "Antes de transformar uma demanda em execução, organizamos prioridades, identificamos gargalos e indicamos um caminho viável.": "Antes de convertir una necesidad en ejecución, organizamos prioridades, identificamos obstáculos e indicamos un camino viable.",
    "Conhecer soluções": "Conocer las soluciones",
    "Repertório de colaborações.": "Experiencia en colaboraciones.",
    "Uma seleção de negócios atendidos em diferentes momentos e frentes, apresentada com autorização de uso.": "Una selección de empresas atendidas en distintas etapas y áreas, presentada con autorización de uso.",
    "Marcas que já trabalharam com a TAG08": "Marcas que han trabajado con TAG08",
    "Logo da ": "Logotipo de ",
    "A presença nesta seleção não representa recomendação pública, parceria ativa ou promessa de resultado.": "La presencia en esta selección no representa una recomendación pública, una alianza activa ni una promesa de resultados.",
    "Cultura e colaboração.": "Cultura y colaboración.",
    "A TAG08 valoriza pessoas que sabem pensar antes de executar, respeitam processo, cuidam da qualidade e entendem que criatividade também precisa de método.": "TAG08 valora a las personas que piensan antes de actuar, respetan los procesos, cuidan la calidad y entienden que la creatividad también necesita método.",
    "Ocultar": "Ocultar",
    "Ver": "Ver",
    " princípios de ": " principios de ",
    "Ocultar princípios": "Ocultar principios",
    "Ver princípios": "Ver principios",
    "Quer fazer parte do jeito TAG08 de trabalhar?": "¿Quieres trabajar al estilo TAG08?",
    "Se você se identifica com pensamento estratégico, cuidado com a entrega e responsabilidade com o processo, vale conhecer nosso espaço de colaboração.": "Si te identificas con el pensamiento estratégico, el cuidado en la entrega y la responsabilidad en los procesos, conoce nuestras oportunidades de colaboración.",
    "Conhecer o Trabalhe Conosco": "Conocer las oportunidades de colaboración",
    "O próximo passo começa pelo entendimento do momento atual.": "El próximo paso comienza por comprender la situación actual.",
    "Antes de propor uma solução, a TAG08 procura entender o momento, os desafios e as prioridades da marca para indicar um caminho claro, coerente e responsável.": "Antes de proponer una solución, TAG08 busca comprender la situación, los desafíos y las prioridades de la marca para indicar un camino claro, coherente y responsable."
  }
} as const;

const ABOUT_DYNAMIC_COPY: Record<Exclude<RouteLocale, "pt">, Record<string, string>> = {
  en: {
    "Estratégia de conteúdo e marketing": "Content and marketing strategy",
    "Estratégia e direção": "Strategy and direction",
    "Atua com estratégia de conteúdo, estratégia de marketing e consultoria, conectando objetivos de negócio a uma direção clara para cada projeto.": "Works with content strategy, marketing strategy, and consulting, connecting business goals to a clear direction for each project.",
    "Estratégia": "Strategy",
    "Conteúdo, marketing e consultoria": "Content, marketing, and consulting",
    "Marketing e comunicação": "Marketing and communications",
    "Marca e jornada do cliente": "Brand and customer journey",
    "Desenvolve estratégias de comunicação digital com atenção ao modelo de negócio, à segmentação, à marca e à jornada do cliente, buscando melhorar a experiência e a conversão.": "Develops digital communication strategies with attention to the business model, segmentation, brand, and customer journey, aiming to improve experience and conversion.",
    "Comunicação": "Communications",
    "Marca, jornada e conversão": "Brand, journey, and conversion",
    "Dados e desenvolvimento web": "Data and web development",
    "Dados e experiência digital": "Data and digital experience",
    "Combina análise de dados, dashboards e desenvolvimento de aplicações web para organizar processos e apoiar decisões e experiências digitais.": "Combines data analysis, dashboards, and web application development to organize processes and support decisions and digital experiences.",
    "Dados e produto": "Data and product",
    "Análise e desenvolvimento web": "Analytics and web development",
    "Especialista em servidores, hospedagem e tecnologia": "Server, hosting, and technology specialist",
    "Infraestrutura tecnológica": "Technology infrastructure",
    "Atua com servidores, hospedagem e tecnologia em diferentes contextos, não apenas em sites e aplicativos.": "Works with servers, hosting, and technology across different contexts, not only websites and applications.",
    "Tecnologia": "Technology",
    "Servidores, hospedagem e tecnologia": "Servers, hosting, and technology",
    "Diretor de arte": "Art director",
    "Define soluções visuais para campanhas e aplicações de marca, com atenção à hierarquia, estética e consistência das peças.": "Defines visual solutions for campaigns and brand applications, with attention to hierarchy, aesthetics, and consistency.",
    "Designer gráfico e motion designer": "Graphic and motion designer",
    "Desenvolve criativos para redes, mídia paga e motion, adaptando a linguagem visual ao formato e ao objetivo de cada peça.": "Creates assets for social media, paid media, and motion, adapting the visual language to each format and objective.",
    "Colaboradora de projetos": "Project collaborator",
    "Integra projetos da TAG08 conforme o escopo e as necessidades de cada cliente; sua participação é definida para cada frente de trabalho.": "Contributes to TAG08 projects according to each client's scope and needs; her participation is defined for each workstream.",
    "Diagnóstico antes da velocidade": "Diagnosis before speed",
    "Entender contexto, gargalos e prioridades evita retrabalho e decisões frágeis.": "Understanding context, bottlenecks, and priorities helps avoid rework and weak decisions.",
    "Estratégia antes do volume": "Strategy before volume",
    "Mais campanha ou mais conteúdo não resolvem quando mensagem, público e posicionamento ainda estão confusos.": "More campaigns or content will not help when the message, audience, and positioning are still unclear.",
    "Coordenação com função": "Coordination with purpose",
    "Design, conteúdo e tecnologia precisam servir ao mesmo objetivo e a uma operação capaz de sustentá-los.": "Design, content, and technology need to serve the same goal and an operation capable of sustaining them.",
    "Continuidade responsável": "Responsible continuity",
    "Acompanhamos aprendizados, ajustamos rotas e organizamos os próximos passos depois da publicação.": "We track what we learn, adjust direction, and organize next steps after publication.",
    "Colaboração": "Collaboration",
    "Pensamento estratégico": "Strategic thinking",
    "Cultura TAG08": "TAG08 culture",
    "Buscamos pessoas que entendam contexto, façam boas perguntas e conectem execução com objetivo.": "We look for people who understand context, ask good questions, and connect execution to objectives.",
    "Leitura de contexto antes da tarefa": "Understand context before starting a task",
    "Perguntas que melhoram a direção": "Ask questions that improve direction",
    "Capacidade de ligar detalhe e resultado": "Connect details to outcomes",
    "Padrão de entrega": "Delivery standards",
    "Cuidado com a entrega": "Care in delivery",
    "Processo e revisão": "Process and review",
    "Qualidade não é detalhe final. É postura durante briefing, produção, revisão e melhoria.": "Quality is not a final detail. It is a practice throughout briefing, production, review, and improvement.",
    "Atenção ao briefing e ao escopo": "Pay attention to the brief and scope",
    "Ritmo consistente de revisão": "Maintain a consistent review cadence",
    "Compromisso com a melhoria contínua": "Commit to continuous improvement",
    "Processo": "Process",
    "Responsabilidade com o processo": "Responsibility for the process",
    "Equipe e rotina": "Team and routine",
    "Trabalhar bem em equipe exige clareza de escopo, prazos possíveis, comunicação objetiva e registro das decisões.": "Working well as a team requires a clear scope, realistic timelines, direct communication, and documented decisions.",
    "Escopo claro antes da execução": "Clarify scope before execution",
    "Comunicação objetiva entre áreas": "Communicate clearly across teams",
    "Registro das decisões e próximos passos": "Document decisions and next steps"
  },
  es: {
    "Estratégia de conteúdo e marketing": "Estrategia de contenido y marketing",
    "Estratégia e direção": "Estrategia y dirección",
    "Atua com estratégia de conteúdo, estratégia de marketing e consultoria, conectando objetivos de negócio a uma direção clara para cada projeto.": "Trabaja en estrategia de contenido, estrategia de marketing y consultoría, conectando los objetivos del negocio con una dirección clara para cada proyecto.",
    "Estratégia": "Estrategia",
    "Conteúdo, marketing e consultoria": "Contenido, marketing y consultoría",
    "Marketing e comunicação": "Marketing y comunicación",
    "Marca e jornada do cliente": "Marca y recorrido del cliente",
    "Desenvolve estratégias de comunicação digital com atenção ao modelo de negócio, à segmentação, à marca e à jornada do cliente, buscando melhorar a experiência e a conversão.": "Desarrolla estrategias de comunicación digital considerando el modelo de negocio, la segmentación, la marca y el recorrido del cliente, con el objetivo de mejorar la experiencia y la conversión.",
    "Comunicação": "Comunicación",
    "Marca, jornada e conversão": "Marca, recorrido y conversión",
    "Dados e desenvolvimento web": "Datos y desarrollo web",
    "Dados e experiência digital": "Datos y experiencia digital",
    "Combina análise de dados, dashboards e desenvolvimento de aplicações web para organizar processos e apoiar decisões e experiências digitais.": "Combina análisis de datos, paneles y desarrollo de aplicaciones web para organizar procesos y apoyar decisiones y experiencias digitales.",
    "Dados e produto": "Datos y producto",
    "Análise e desenvolvimento web": "Análisis y desarrollo web",
    "Especialista em servidores, hospedagem e tecnologia": "Especialista en servidores, alojamiento y tecnología",
    "Infraestrutura tecnológica": "Infraestructura tecnológica",
    "Atua com servidores, hospedagem e tecnologia em diferentes contextos, não apenas em sites e aplicativos.": "Trabaja con servidores, alojamiento y tecnología en distintos contextos, no solo en sitios web y aplicaciones.",
    "Tecnologia": "Tecnología",
    "Servidores, hospedagem e tecnologia": "Servidores, alojamiento y tecnología",
    "Diretor de arte": "Director de arte",
    "Define soluções visuais para campanhas e aplicações de marca, com atenção à hierarquia, estética e consistência das peças.": "Define soluciones visuales para campañas y aplicaciones de marca, con atención a la jerarquía, la estética y la coherencia de las piezas.",
    "Designer gráfico e motion designer": "Diseñador gráfico y de motion",
    "Desenvolve criativos para redes, mídia paga e motion, adaptando a linguagem visual ao formato e ao objetivo de cada peça.": "Desarrolla piezas para redes sociales, medios pagos y motion, adaptando el lenguaje visual al formato y al objetivo de cada pieza.",
    "Colaboradora de projetos": "Colaboradora de proyectos",
    "Integra projetos da TAG08 conforme o escopo e as necessidades de cada cliente; sua participação é definida para cada frente de trabalho.": "Participa en proyectos de TAG08 según el alcance y las necesidades de cada cliente; su participación se define para cada línea de trabajo.",
    "Diagnóstico antes da velocidade": "Diagnóstico antes que velocidad",
    "Entender contexto, gargalos e prioridades evita retrabalho e decisões frágeis.": "Comprender el contexto, los obstáculos y las prioridades ayuda a evitar retrabajo y decisiones poco sólidas.",
    "Estratégia antes do volume": "Estrategia antes que volumen",
    "Mais campanha ou mais conteúdo não resolvem quando mensagem, público e posicionamento ainda estão confusos.": "Más campañas o contenido no resuelven el problema si el mensaje, el público y el posicionamiento aún no están claros.",
    "Coordenação com função": "Coordinación con propósito",
    "Design, conteúdo e tecnologia precisam servir ao mesmo objetivo e a uma operação capaz de sustentá-los.": "El diseño, el contenido y la tecnología deben servir al mismo objetivo y a una operación capaz de sostenerlos.",
    "Continuidade responsável": "Continuidad responsable",
    "Acompanhamos aprendizados, ajustamos rotas e organizamos os próximos passos depois da publicação.": "Acompañamos los aprendizajes, ajustamos el rumbo y organizamos los próximos pasos después de la publicación.",
    "Colaboração": "Colaboración",
    "Pensamento estratégico": "Pensamiento estratégico",
    "Cultura TAG08": "Cultura TAG08",
    "Buscamos pessoas que entendam contexto, façam boas perguntas e conectem execução com objetivo.": "Buscamos personas que comprendan el contexto, hagan buenas preguntas y conecten la ejecución con los objetivos.",
    "Leitura de contexto antes da tarefa": "Comprender el contexto antes de la tarea",
    "Perguntas que melhoram a direção": "Hacer preguntas que mejoren la dirección",
    "Capacidade de ligar detalhe e resultado": "Conectar los detalles con los resultados",
    "Padrão de entrega": "Estándar de entrega",
    "Cuidado com a entrega": "Cuidado en la entrega",
    "Processo e revisão": "Proceso y revisión",
    "Qualidade não é detalhe final. É postura durante briefing, produção, revisão e melhoria.": "La calidad no es un detalle final. Es una práctica durante el briefing, la producción, la revisión y la mejora.",
    "Atenção ao briefing e ao escopo": "Atención al briefing y al alcance",
    "Ritmo consistente de revisão": "Ritmo constante de revisión",
    "Compromisso com a melhoria contínua": "Compromiso con la mejora continua",
    "Processo": "Proceso",
    "Responsabilidade com o processo": "Responsabilidad con el proceso",
    "Equipe e rotina": "Equipo y rutina",
    "Trabalhar bem em equipe exige clareza de escopo, prazos possíveis, comunicação objetiva e registro das decisões.": "Trabajar bien en equipo requiere claridad sobre el alcance, plazos realistas, comunicación directa y registro de las decisiones.",
    "Escopo claro antes da execução": "Alcance claro antes de ejecutar",
    "Comunicação objetiva entre áreas": "Comunicación directa entre áreas",
    "Registro das decisões e próximos passos": "Registro de decisiones y próximos pasos"
  }
};

const translateAbout = (source: string, locale: RouteLocale): string => {
  if (locale === "pt") return source;

  const translation = ABOUT_DYNAMIC_COPY[locale][source] ?? ABOUT_COPY[locale][source as keyof (typeof ABOUT_COPY)[typeof locale]];
  if (!translation) {
    throw new Error(`Missing ${locale} translation in About page copy catalog.`);
  }

  return translation;
};

// These approved source records were accidentally removed from the working copy
// while the page JSX continued to consume them. Keep the existing evidence gate.
const PRIMARY_PROFILES = [
  { evidenceKey: "team/carlos-henrique-martins", name: "Carlos Henrique Martins", role: "Estratégia de conteúdo e marketing", title: "Estratégia e direção", description: "Atua com estratégia de conteúdo, estratégia de marketing e consultoria, conectando objetivos de negócio a uma direção clara para cada projeto.", linkedin: "https://www.linkedin.com/in/carlosmartins08/", photo: "/team/carlos-henrique-martins.jpg", label: "Estratégia", support: "Conteúdo, marketing e consultoria" },
  { evidenceKey: "team/ignacio-quiroz", name: "Ignacio Quiroz", role: "Marketing e comunicação", title: "Marca e jornada do cliente", description: "Desenvolve estratégias de comunicação digital com atenção ao modelo de negócio, à segmentação, à marca e à jornada do cliente, buscando melhorar a experiência e a conversão.", linkedin: "https://www.linkedin.com/in/ignacio-quiroz-b1568a52/", photo: "/team/ignacio-quiroz.jpg", label: "Comunicação", support: "Marca, jornada e conversão" },
  { evidenceKey: "team/pedro-felix", name: "Pedro Félix", role: "Dados e desenvolvimento web", title: "Dados e experiência digital", description: "Combina análise de dados, dashboards e desenvolvimento de aplicações web para organizar processos e apoiar decisões e experiências digitais.", linkedin: "https://www.linkedin.com/in/pedrovsfelix/", photo: "/team/pedro-felix.jpg", label: "Dados e produto", support: "Análise e desenvolvimento web" },
  { evidenceKey: "team/daniel-lopes", name: "Daniel Lopes", role: "Especialista em servidores, hospedagem e tecnologia", title: "Infraestrutura tecnológica", description: "Atua com servidores, hospedagem e tecnologia em diferentes contextos, não apenas em sites e aplicativos.", linkedin: "https://www.linkedin.com/in/daniellopesjp/", photo: "/team/daniel-lopes.jpg", label: "Tecnologia", support: "Servidores, hospedagem e tecnologia" }
] as const;

const COMPLEMENTARY_PROFILES = [
  { evidenceKey: "team/guilherme-gomes", name: "Guilherme Gomes", role: "Diretor de arte", photo: "/team/guilherme-gomes.jpg", description: "Define soluções visuais para campanhas e aplicações de marca, com atenção à hierarquia, estética e consistência das peças." },
  { evidenceKey: "team/amazing-design", name: "Amazing Design", role: "Designer gráfico e motion designer", photo: "/team/amazing-design.jpg", description: "Desenvolve criativos para redes, mídia paga e motion, adaptando a linguagem visual ao formato e ao objetivo de cada peça." },
  { evidenceKey: "team/andreia-braga", name: "Andréia Braga", role: "Colaboradora de projetos", linkedin: "https://www.linkedin.com/in/andr%C3%A9ia-braga-3b064a221/", photo: "/team/andreia-braga.jpg", description: "Integra projetos da TAG08 conforme o escopo e as necessidades de cada cliente; sua participação é definida para cada frente de trabalho." }
] as const;

const METHOD_PRINCIPLES = [
  { icon: Target, title: "Diagnóstico antes da velocidade", description: "Entender contexto, gargalos e prioridades evita retrabalho e decisões frágeis." },
  { icon: BookOpen, title: "Estratégia antes do volume", description: "Mais campanha ou mais conteúdo não resolvem quando mensagem, público e posicionamento ainda estão confusos." },
  { icon: Settings, title: "Coordenação com função", description: "Design, conteúdo e tecnologia precisam servir ao mesmo objetivo e a uma operação capaz de sustentá-los." },
  { icon: ArrowRight, title: "Continuidade responsável", description: "Acompanhamos aprendizados, ajustamos rotas e organizamos os próximos passos depois da publicação." }
] as const;

const CLIENT_LOGOS = [
  { evidenceKey: "client-logo/cayuca", name: "CaYuCa", src: "/clients/CaYuCa_white.svg", imageClassName: "" },
  { evidenceKey: "client-logo/wscom", name: "WSCOM", src: "/clients/WSCOM_white.svg", imageClassName: "" },
  { evidenceKey: "client-logo/vr-imobiliaria", name: "VR Imobiliária", src: "/clients/VRImobiliaria_Black.svg", imageClassName: "invert" },
  { evidenceKey: "client-logo/vaqrama", name: "Vaqrama", src: "/clients/Vaqrama_white.svg", imageClassName: "" },
  { evidenceKey: "client-logo/alugue-por-temporada", name: "Alugue por Temporada", src: "/clients/logo-mono-white_AluguePorTemporada.svg", imageClassName: "" },
  { evidenceKey: "client-logo/segura-epi", name: "Segura EPI", src: "/clients/SeguraEPI_white.svg", imageClassName: "" },
  { evidenceKey: "client-logo/ruben-a", name: "Ruben A.", src: "/clients/RubenA_white.svg", imageClassName: "" },
  { evidenceKey: "client-logo/reavivare", name: "Reavivare", src: "/clients/Reavivare_white.svg", imageClassName: "" },
  { evidenceKey: "client-logo/raquel-cordeiro", name: "Raquel Cordeiro", src: "/clients/RaquelCordeiro_white.svg", imageClassName: "" },
  { evidenceKey: "client-logo/luciana-gadelha", name: "Luciana Gadelha", src: "/clients/LucianaGadelha_logo-dark.svg", imageClassName: "" },
  { evidenceKey: "client-logo/home-office", name: "HomeOffice", src: "/clients/HomeOffice_white.svg", imageClassName: "" },
  { evidenceKey: "client-logo/harmonic", name: "Harmonic", src: "/clients/Harmonic_white.svg", imageClassName: "" }
] as const;

const COLLABORATION_BLOCKS = [
  { id: "strategy", area: "Colaboração", title: "Pensamento estratégico", support: "Cultura TAG08", description: "Buscamos pessoas que entendam contexto, façam boas perguntas e conectem execução com objetivo.", requirements: ["Leitura de contexto antes da tarefa", "Perguntas que melhoram a direção", "Capacidade de ligar detalhe e resultado"] },
  { id: "craft", area: "Padrão de entrega", title: "Cuidado com a entrega", support: "Processo e revisão", description: "Qualidade não é detalhe final. É postura durante briefing, produção, revisão e melhoria.", requirements: ["Atenção ao briefing e ao escopo", "Ritmo consistente de revisão", "Compromisso com a melhoria contínua"] },
  { id: "process", area: "Processo", title: "Responsabilidade com o processo", support: "Equipe e rotina", description: "Trabalhar bem em equipe exige clareza de escopo, prazos possíveis, comunicação objetiva e registro das decisões.", requirements: ["Escopo claro antes da execução", "Comunicação objetiva entre áreas", "Registro das decisões e próximos passos"] }
] as const;

type CollaborationId = (typeof COLLABORATION_BLOCKS)[number]["id"];

const cardTransition = "transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out motion-reduce:transition-none";
const actionTransition = "transition-[transform,background-color,color,border-color] duration-150 ease-out active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none";

export default function Sobre({ onNavigate, locale = "pt" }: SobreProps) {
  const t = (source: string) => translateAbout(source, locale);
  const isRouteAvailable = (path: string) => {
    if (locale === "pt") return true;
    const route = getRouteByPath(path);
    return route ? isRouteLocalePublished(route, locale) : false;
  };
  const canNavigateToContact = isRouteAvailable("/contato");
  const canNavigateToServices = isRouteAvailable("/servicos");
  const canNavigateToCareers = isRouteAvailable("/trabalhe-conosco");
  const [selectedPrinciple, setSelectedPrinciple] = useState<CollaborationId | null>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const visiblePrimaryProfiles = getVisibleEvidence(PRIMARY_PROFILES, (profile) => profile.evidenceKey, "/sobre");
  const visibleComplementaryProfiles = getVisibleEvidence(COMPLEMENTARY_PROFILES, (profile) => profile.evidenceKey, "/sobre");
  const visibleClientLogos = getVisibleEvidence(CLIENT_LOGOS, (logo) => logo.evidenceKey, "/sobre");
  const hasPublicTeamProfiles = visiblePrimaryProfiles.length > 0 || visibleComplementaryProfiles.length > 0;

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-charcoal-950 pb-20 pt-24 text-white sm:pt-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:20px_20px]" />
      <div aria-hidden="true" className="pointer-events-none absolute left-[-15%] top-[8%] h-[600px] w-[600px] rounded-full bg-brand/[0.015] blur-[150px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[20%] right-[-15%] h-[600px] w-[600px] rounded-full bg-brand/[0.02] blur-[150px]" />

      <section className="relative border-b border-white/[0.06] px-4 pt-2 pb-12 sm:px-6 sm:py-20 md:px-8">
        <div className="mx-auto max-w-7xl space-y-10 sm:space-y-14">
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-5 lg:col-span-7">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand">{t("Sobre a TAG08")}</p>
              <h1 className="max-w-4xl font-display text-4xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">{t("Direção para construir presença. ")}<span className="text-brand">{t("Estrutura para sustentar crescimento.")}</span></h1>
              {canNavigateToContact && <button data-testid="about-hero-cta-mobile" onClick={() => handleLinkClick("/contato")} className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-brand bg-brand px-5 py-3 text-xs font-black uppercase tracking-widest text-black sm:hidden ${actionTransition}`}>{t("Falar com a TAG08")} <ArrowUpRight className="h-4 w-4 stroke-[2.5]" /></button>}
            </div>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-zinc-300 lg:col-span-5 lg:pb-1">{t("A TAG08 conecta estratégia, conteúdo, design, tecnologia e processos para ajudar marcas e negócios a sair do improviso, organizar prioridades e construir uma presença digital mais clara, consistente e sustentável.")}</p>
          </div>

          <div className="group relative aspect-[16/10] overflow-hidden rounded-[24px] border border-white/[0.08] bg-charcoal-900 shadow-2xl sm:aspect-[2.39/1] sm:rounded-[32px]">
            <ResilientImage preload fallbackLabel={t("Imagem editorial")} sizes="(max-width: 768px) 100vw, (max-width: 1280px) calc(100vw - 4rem), 1280px" src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1600" alt="" className="object-cover grayscale brightness-50 transition-transform duration-300 ease-out motion-reduce:transform-none group-hover:scale-[1.01]" referrerPolicy="no-referrer" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center px-5">
              {canNavigateToContact && <button data-testid="about-hero-cta" onClick={() => handleLinkClick("/contato")} className={`hidden min-h-11 rounded-full border border-brand bg-brand px-6 py-3 text-xs font-black uppercase tracking-widest text-black shadow-[0_12px_36px_rgba(var(--color-brand-rgb),0.25)] hover:bg-brand-dark sm:inline-flex sm:items-center sm:gap-2 sm:px-8 ${actionTransition}`}>{t("Falar com a TAG08")} <ArrowUpRight className="h-4 w-4 stroke-[2.5]" /></button>}
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-6 sm:left-6 sm:right-6"><p className="text-sm font-bold text-white">{t("Presença com direção")}</p><p className="hidden rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md sm:block">{t("Direção TAG08")}</p></div>
          </div>
        </div>
      </section>

      <section className="relative border-b border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20 md:px-8">
        <div className="mx-auto max-w-7xl space-y-9 sm:space-y-12">
          {hasPublicTeamProfiles && (
            <div className="space-y-6">
              <div className="max-w-3xl space-y-2"><h3 className="font-display text-2xl font-black tracking-tight text-white sm:text-3xl">{t("Profissionais que podem integrar os projetos.")}</h3><p className="text-sm leading-relaxed text-zinc-300">{t("A composição da equipe varia conforme o escopo de cada cliente. Conheça as pessoas e áreas de atuação que podem participar das entregas.")}</p></div>
              <div data-testid="team-profiles" className="space-y-6">
              {visiblePrimaryProfiles.length > 0 && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
                  <article data-evidence-key={visiblePrimaryProfiles[0].evidenceKey} className={`group relative min-h-[300px] overflow-hidden rounded-3xl border border-brand/25 bg-charcoal-900 p-6 lg:col-span-5 sm:p-8 ${cardTransition}`}>
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-brand/10 via-charcoal-900 to-zinc-950" />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
                    <div className="relative flex items-center justify-between gap-4"><p className="rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">{visiblePrimaryProfiles[0].label}</p><Image src={visiblePrimaryProfiles[0].photo} alt={`${t("Retrato de ")}${visiblePrimaryProfiles[0].name}`} width={48} height={48} sizes="48px" unoptimized className="h-12 w-12 rounded-full border border-white/20 object-cover" /></div>
                                        <div className="relative mt-16 max-w-md space-y-3"><p className="text-sm font-semibold text-white">{visiblePrimaryProfiles[0].name}</p><p className="text-xs font-bold uppercase tracking-wider text-brand">{t(visiblePrimaryProfiles[0].role)}</p><h3 className="font-display text-2xl font-black leading-none tracking-tight text-white sm:text-3xl">{t(visiblePrimaryProfiles[0].title)}</h3><p className="text-sm leading-relaxed text-zinc-300">{t(visiblePrimaryProfiles[0].description)}</p><a href={visiblePrimaryProfiles[0].linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${t("Abrir perfil de ")}${visiblePrimaryProfiles[0].name}${t(" no LinkedIn em nova guia")}`} className="inline-flex min-h-11 items-center gap-2 pt-2 text-xs font-bold uppercase tracking-wider text-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">LinkedIn <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a></div>
                  </article>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
                    {visiblePrimaryProfiles.slice(1).map((member, index) => (
                      <article key={member.evidenceKey} data-evidence-key={member.evidenceKey} className={`group relative min-h-[260px] overflow-hidden rounded-3xl border border-white/[0.08] bg-charcoal-900 p-5 ${index === 2 ? "md:col-span-2 lg:col-span-1" : ""} ${cardTransition} hover:border-brand/45`}>
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-brand/10 via-charcoal-900 to-zinc-950" />
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
                        <div className="relative flex items-center justify-between gap-3"><p className="rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-xs font-bold text-zinc-200 backdrop-blur-md">{t(member.label)}</p><Image src={member.photo} alt={`${t("Retrato de ")}${member.name}`} width={44} height={44} sizes="44px" unoptimized className="h-11 w-11 rounded-full border border-white/20 object-cover" /></div>
                                                <div className="relative mt-14 space-y-2"><p className="text-xs font-bold uppercase tracking-wider text-brand">{t(member.role)}</p><h3 className="font-display text-lg font-black leading-none tracking-tight text-white">{member.name}</h3><p className="text-sm leading-relaxed text-zinc-200">{t(member.description)}</p><a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${t("Abrir perfil de ")}${member.name}${t(" no LinkedIn em nova guia")}`} className="inline-flex min-h-11 items-center gap-2 pt-2 text-xs font-bold uppercase tracking-wider text-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">LinkedIn <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a></div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
              {visibleComplementaryProfiles.length > 0 && (
                <div className="grid grid-cols-1 gap-4 border-t border-white/[0.06] pt-6 md:grid-cols-2 lg:grid-cols-3">
                  {visibleComplementaryProfiles.map((profile, index) => <article key={profile.evidenceKey} data-evidence-key={profile.evidenceKey} className={`rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 ${index === 2 ? "md:col-span-2 lg:col-span-1" : ""}`}><div className="flex items-center gap-3"><Image src={profile.photo} alt={`${t("Retrato de ")}${profile.name}`} width={44} height={44} sizes="44px" unoptimized className="h-11 w-11 shrink-0 rounded-full border border-white/15 object-cover" /><div><p className="text-xs font-bold uppercase tracking-wider text-brand">{t(profile.role)}</p><h3 className="mt-1 font-display text-base font-black tracking-tight text-white">{profile.name}</h3></div></div><p className="mt-3 text-sm leading-relaxed text-zinc-300">{t(profile.description)}</p>{"linkedin" in profile && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${t("Abrir perfil de ")}${profile.name}${t(" no LinkedIn em nova guia")}`} className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">LinkedIn <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>}</article>)}
                </div>
              )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="relative border-b border-white/[0.06] bg-zinc-950/70 px-4 py-16 sm:px-6 sm:py-20 md:px-8">
        <div className="mx-auto max-w-7xl space-y-10 sm:space-y-14">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-14"><div className="space-y-5"><h2 className="font-display text-3xl font-black leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl">{t("Método na prática.")}</h2><p className="max-w-xl text-sm leading-relaxed text-zinc-300">{t("Comunicação, design, tecnologia e processos só geram valor quando estão conectados a um diagnóstico claro, prioridades bem definidas e uma execução possível de sustentar.")}</p><p className="max-w-xl border-l border-brand/50 pl-4 text-sm leading-relaxed text-zinc-200">{t("A TAG08 não busca parecer maior do que é. Busca construir caminhos claros, coerentes e sustentáveis para cada marca.")}</p></div><div className="group relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/[0.08] bg-charcoal-900 shadow-2xl"><ResilientImage fallbackLabel={t("Método TAG08")} sizes="(max-width: 1024px) 100vw, 50vw" src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" alt="" className="object-cover grayscale brightness-75 transition-transform duration-300 ease-out motion-reduce:transform-none group-hover:scale-[1.02]" referrerPolicy="no-referrer" /><div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" /><p className="absolute bottom-6 left-6 text-sm font-bold text-white">{t("Direção aplicada")}</p></div></div>
          <ol className="grid grid-cols-1 border-y border-white/[0.08] md:grid-cols-2">{METHOD_PRINCIPLES.map((principle, index) => { const Icon = principle.icon; return <li key={principle.title} className={`min-h-[170px] p-6 ${index % 2 === 0 ? "md:border-r md:border-white/[0.08]" : ""} ${index < 2 ? "border-b border-white/[0.08]" : ""}`}><Icon aria-hidden="true" className="h-5 w-5 text-brand" /><h3 className="mt-7 font-display text-lg font-black tracking-tight text-white">{t(principle.title)}</h3><p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-300">{t(principle.description)}</p></li>; })}</ol>
          <div className="flex flex-col justify-between gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:flex-row sm:items-center"><div className="max-w-2xl"><h3 className="font-display text-lg font-black tracking-tight text-white">{t("Um próximo passo coerente começa pelo entendimento.")}</h3><p className="mt-2 text-sm leading-relaxed text-zinc-300">{t("Antes de transformar uma demanda em execução, organizamos prioridades, identificamos gargalos e indicamos um caminho viável.")}</p></div>
            {canNavigateToServices && <button onClick={() => handleLinkClick("/servicos")} className={`min-h-11 shrink-0 rounded-xl border border-brand/40 px-5 py-3 text-xs font-bold uppercase tracking-wider text-brand hover:bg-brand hover:text-black ${actionTransition}`}>{t("Conhecer soluções")}</button>}</div>
        </div>
      </section>

      {visibleClientLogos.length > 0 && <section className="relative border-b border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20 md:px-8"><div className="mx-auto max-w-7xl space-y-8 sm:space-y-10"><div className="max-w-3xl space-y-3"><h2 className="font-display text-3xl font-black leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl">{t("Repertório de colaborações.")}</h2><p className="text-sm leading-relaxed text-zinc-300">{t("Uma seleção de negócios atendidos em diferentes momentos e frentes, apresentada com autorização de uso.")}</p></div><ul data-testid="client-logo-wall" className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4" aria-label={t("Marcas que já trabalharam com a TAG08")}>{visibleClientLogos.map((logo) => <li key={logo.evidenceKey} data-evidence-key={logo.evidenceKey} className="flex h-24 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 sm:h-28 sm:px-7"><Image src={logo.src} alt={`${t("Logo da ")}${logo.name}`} width={180} height={72} unoptimized className={`max-h-11 w-full max-w-[10rem] object-contain ${logo.imageClassName}`} /></li>)}</ul><p className="max-w-3xl text-sm leading-relaxed text-zinc-400">{t("A presença nesta seleção não representa recomendação pública, parceria ativa ou promessa de resultado.")}</p></div></section>}

      <section className="relative border-b border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20 md:px-8"><div className="mx-auto max-w-7xl space-y-9 sm:space-y-12"><div className="max-w-3xl space-y-3"><h2 className="font-display text-3xl font-black leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl">{t("Cultura e colaboração.")}</h2><p className="text-sm leading-relaxed text-zinc-300">{t("A TAG08 valoriza pessoas que sabem pensar antes de executar, respeitam processo, cuidam da qualidade e entendem que criatividade também precisa de método.")}</p></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{COLLABORATION_BLOCKS.map((block, index) => { const isOpen = selectedPrinciple === block.id; const panelId = `collaboration-principles-${block.id}`; const headingId = `collaboration-title-${block.id}`; return <article key={block.id} className={`flex min-h-[280px] flex-col rounded-3xl border border-white/[0.08] bg-charcoal-900/70 p-6 sm:p-7 ${index === 2 ? "md:col-span-2 lg:col-span-1" : ""} ${cardTransition} ${isOpen ? "border-brand/45 bg-black/60" : "hover:border-white/20"}`}><div className="flex items-start justify-between gap-4"><p className="text-xs font-bold uppercase tracking-wider text-zinc-300">{t(block.area)}</p><p className="rounded-full border border-brand/25 bg-brand/10 px-2 py-1 text-xs font-bold text-brand">{t(block.support)}</p></div><div className="mt-7"><h3 id={headingId} className="font-display text-xl font-black leading-tight tracking-tight text-white">{t(block.title)}</h3><p className="mt-3 text-sm leading-relaxed text-zinc-300">{t(block.description)}</p></div><AnimatePresence initial={false}>{isOpen && <motion.div id={panelId} role="region" aria-labelledby={headingId} initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }} transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: [0.23, 1, 0.32, 1] }} className="mt-5 overflow-hidden border-t border-white/[0.08] pt-4"><ul className="space-y-2.5">{block.requirements.map((requirement) => <li key={requirement} className="flex gap-2 text-sm leading-relaxed text-zinc-200"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{t(requirement)}</li>)}</ul></motion.div>}</AnimatePresence>
          <button type="button" aria-expanded={isOpen} aria-controls={panelId} aria-label={`${t(isOpen ? "Ocultar" : "Ver")} ${t(" princípios de ")}${t(block.title)}`} onClick={() => setSelectedPrinciple(isOpen ? null : block.id)} className={`mt-auto inline-flex min-h-11 items-center self-start gap-2 pt-6 text-xs font-black uppercase tracking-wider ${isOpen ? "text-brand" : "text-zinc-200 hover:text-white"} ${actionTransition}`}>{t(isOpen ? "Ocultar princípios" : "Ver princípios")}<ArrowRight aria-hidden="true" className={`h-4 w-4 transition-transform duration-150 ease-out motion-reduce:transition-none ${isOpen ? "rotate-90" : ""}`} /></button></article>; })}</div>
        <div className="flex flex-col justify-between gap-5 rounded-3xl border border-white/[0.08] bg-charcoal-900 p-6 sm:flex-row sm:items-center sm:p-8"><div className="max-w-2xl"><h3 className="font-display text-xl font-black tracking-tight text-white">{t("Quer fazer parte do jeito TAG08 de trabalhar?")}</h3><p className="mt-2 text-sm leading-relaxed text-zinc-300">{t("Se você se identifica com pensamento estratégico, cuidado com a entrega e responsabilidade com o processo, vale conhecer nosso espaço de colaboração.")}</p></div>
          {canNavigateToCareers && <button onClick={() => handleLinkClick("/trabalhe-conosco")} className={`min-h-11 shrink-0 rounded-xl bg-brand px-6 py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-brand-dark ${actionTransition}`}><span className="inline-flex items-center gap-2">{t("Conhecer o Trabalhe Conosco")} <ArrowUpRight className="h-4 w-4 stroke-[2.5]" /></span></button>}</div>
      </div></section>

      <section className="relative px-4 py-20 sm:px-6 md:px-8"><div className="mx-auto max-w-3xl text-center"><h2 className="font-display text-3xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">{t("O próximo passo começa pelo entendimento do momento atual.")}</h2><p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-zinc-300">{t("Antes de propor uma solução, a TAG08 procura entender o momento, os desafios e as prioridades da marca para indicar um caminho claro, coerente e responsável.")}</p>
        {canNavigateToContact && <button onClick={() => handleLinkClick("/contato")} className={`mt-8 min-h-12 rounded-xl bg-brand px-8 py-3 text-xs font-black uppercase tracking-wider text-black shadow-[0_12px_36px_rgba(var(--color-brand-rgb),0.18)] hover:bg-brand-dark ${actionTransition}`}><span className="inline-flex items-center gap-2">{t("Falar com a TAG08")} <ArrowUpRight className="h-4 w-4 stroke-[2.5]" /></span></button>}</div></section>
    </div>
  );
}
