import { useState, useEffect, useRef } from "react";
import { Compass, Sparkles, BookOpen, Layers, CheckCircle, ArrowUpRight, ArrowRight, Award, Shield, MessageSquare, Search, Image, Grid, ExternalLink, Heart, X, Palette, Type, TrendingUp, Briefcase } from "../../../components/DooIcons";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import ResilientImage from "../../../components/ResilientImage";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import ServiceInsightsBridge from "../../../components/ServiceInsightsBridge";
import TrackedOutboundLink from "../../../components/TrackedOutboundLink";
import { buildBrazilWhatsAppUrl, buildInternationalWhatsAppUrl, TAG08_OFFICIAL_PINTEREST_URL } from "../../../config/siteNetwork";
import { trackOutboundClick } from "../../../lib/analytics";
import type { RouteLocale } from "../../../config/routeRegistry";

interface BrandingProps {
  onNavigate: (page: string) => void;
  locale?: RouteLocale;
}

const BRANDING_COPY = {
  en: {
    "BRANDING E IDENTIDADE VISUAL // TAG08": "BRANDING & VISUAL IDENTITY // TAG08",
    "Identidade visual com direção": "Visual identity with direction",
    "para marcas que precisam comunicar melhor seu valor.": "for brands that need to communicate their value more clearly.",
    "A TAG08 desenvolve identidades visuais digitais para negócios que precisam organizar sua expressão de marca, alinhar materiais e construir uma presença mais clara, coerente e reconhecível nos principais pontos de contato.": "TAG08 develops digital visual identities for businesses that need to organize their brand expression, align materials, and build a clearer, more coherent, recognizable presence across key touchpoints.",
    "Falar com a TAG08": "Talk to TAG08",
    "Organizar minha identidade": "Organize my identity",
    "TAG08 VISUAL HUB": "TAG08 VISUAL HUB",
    "Identidade com coerência": "Identity with coherence",
    "IDENTIDADE // EM USO": "IDENTITY // IN USE",
    "SINAIS DE DESALINHAMENTO VISUAL": "SIGNS OF VISUAL MISALIGNMENT",
    "Quando a identidade visual já não sustenta o valor da marca.": "When visual identity no longer supports the brand’s value.",
    "Muitas marcas entregam valor, mas ainda se apresentam de forma visualmente inconsistente. O problema nem sempre é falta de design; muitas vezes é falta de direção visual, critérios de aplicação e coerência entre identidade, linguagem e pontos de contato.": "Many brands deliver value but still present themselves inconsistently. The issue is not always a lack of design; often, it is a lack of visual direction, application criteria, and coherence across identity, language, and touchpoints.",
    "CONSEQUÊNCIA DIRETA:": "DIRECT CONSEQUENCE:",
    "Quando a identidade não sustenta a percepção desejada, materiais e canais passam a exigir mais esforço para transmitir uma mesma mensagem.": "When identity does not support the intended perception, materials and channels require more effort to communicate a consistent message.",
    "IDENTIDADE SEM SISTEMA": "IDENTITY WITHOUT A SYSTEM",
    "Logo sozinho não resolve percepção.": "A logo alone cannot shape perception.",
    "Identidade precisa de regras para cor, tipografia, imagens, composição e materiais. Sem isso, cada ponto de contato acaba falando uma linguagem diferente.": "Identity needs rules for color, typography, imagery, composition, and materials. Without them, each touchpoint ends up speaking a different visual language.",
    "EIXO DE MARCA": "BRAND AXIS",
    "MATURIDADE DA MARCA": "BRAND MATURITY",
    "SISTEMAS VISUAIS SUSTENTAM CONSISTÊNCIA.": "VISUAL SYSTEMS SUPPORT CONSISTENCY.",
    "Veja onde a comunicação visual costuma perder clareza, coesão e reconhecimento ao longo da jornada da marca.": "See where visual communication often loses clarity, cohesion, and recognition throughout a brand’s journey.",
    "01 // UNIDADE FRÁGIL": "01 // FRAGILE UNITY",
    "Visual difícil de repetir": "A visual language that is hard to repeat",
    "Quando cada peça parece vir de uma referência diferente, a marca perde unidade e dificulta o reconhecimento ao longo do tempo.": "When every piece seems to draw on a different reference, the brand loses unity and becomes harder to recognize over time.",
    "02 // MATERIAIS DESALINHADOS": "02 // MISALIGNED MATERIALS",
    "Os materiais não seguem o mesmo padrão": "Materials do not follow the same standard",
    "Propostas, site, redes e apresentações precisam compartilhar uma mesma linguagem visual, não versões concorrentes da marca.": "Proposals, websites, social channels, and presentations should share one visual language, rather than competing versions of the brand.",
    "03 // PERCEPÇÃO ABAIXO DA ENTREGA": "03 // PERCEPTION LAGS BEHIND DELIVERY",
    "A apresentação não acompanha o momento da marca": "The presentation no longer reflects the brand’s current stage",
    "Quando a identidade visual fica aquém do momento atual do negócio, materiais e canais deixam de comunicar com a precisão necessária.": "When visual identity falls behind the business’s current stage, materials and channels stop communicating with the precision they require.",
    "04 // DIREÇÃO DE MARCA": "04 // BRAND DIRECTION",
    "A identidade precisa de critério": "Identity needs clear criteria",
    "Direção visual não é enfeite. Ela orienta escolhas de aplicação, padronização e continuidade em diferentes pontos de contato.": "Visual direction is not decoration. It guides application, consistency, and continuity across different touchpoints.",
    "O QUE ORGANIZAMOS": "WHAT WE ORGANIZE",
    "Identidade não é só logo. É um sistema para sustentar percepção.": "Identity is more than a logo. It is a system that supports perception.",
    "A TAG08 estrutura os elementos que formam a identidade visual da marca e orienta sua aplicação nos pontos de contato prioritários. O escopo depende do momento do negócio, dos canais envolvidos e da profundidade necessária.": "TAG08 structures the elements that form a brand’s visual identity and guides their use across priority touchpoints. Scope depends on the business stage, channels involved, and depth required.",
    "Diagnóstico visual": "Visual diagnosis",
    "Leitura da identidade atual, dos materiais existentes, dos pontos de contato e dos principais sinais de inconsistência visual.": "Review of the current identity, existing materials, touchpoints, and main signs of visual inconsistency.",
    "Direção de identidade": "Identity direction",
    "Definição de referências, caminhos visuais, linguagem estética e critérios para orientar a construção da identidade.": "Definition of references, visual directions, aesthetic language, and criteria to guide identity development.",
    "Sistema visual": "Visual system",
    "Organização de cores, tipografia, elementos gráficos, composição, imagens e hierarquias de uso.": "Organization of colors, typography, graphic elements, composition, imagery, and usage hierarchy.",
    "Aplicações da marca": "Brand applications",
    "Desenvolvimento dos materiais previstos no escopo para os pontos de contato prioritários.": "Development of the materials included in scope for priority touchpoints.",
    "Guia de uso": "Usage guide",
    "Registro das principais regras e orientações para facilitar aplicação e continuidade depois da entrega.": "A record of key rules and guidance to support application and continuity after delivery.",
    "CRITÉRIOS DE CONFIANÇA": "TRUST CRITERIA",
    "O que sustenta uma identidade mais consistente.": "What supports a more consistent identity.",
    "Uma identidade visual funciona melhor quando existe direção, sistema, aplicação e continuidade. O objetivo não é fazer a marca parecer algo que não é, mas apresentar com mais coerência aquilo que o negócio realmente entrega.": "Visual identity works best when direction, a system, application, and continuity come together. The goal is not to make a brand appear to be something it is not, but to present more coherently what the business actually delivers.",
    "DIREÇÃO VISUAL // TAG08": "VISUAL DIRECTION // TAG08",
    "PORTFÓLIO VISUAL // PINTEREST HUB": "VISUAL PORTFOLIO // PINTEREST HUB",
    "Aplicações que mostram a identidade em uso.": "Applications that show identity in use.",
    "O acervo reúne referências conceituais e aplicações autorizadas para mostrar como uma identidade pode funcionar em diferentes pontos de contato sem perder unidade.": "This collection brings together conceptual references and authorized applications to show how an identity can work across different touchpoints without losing unity.",
    "Mais do que uma vitrine estética, o acervo ajuda a visualizar como sistema visual, critérios de aplicação e repetição constroem continuidade de marca.": "More than an aesthetic showcase, the collection illustrates how a visual system, application criteria, and repetition build brand continuity.",
    "As referências não representam, por si só, clientes ativos, parceria ou promessa de resultado.": "These references do not, by themselves, represent active clients, partnerships, or promised results.",
    "FILTRAR PORTFÓLIO:": "FILTER PORTFOLIO:",
    "Ver detalhes da aplicação": "View application details",
    "REFERÊNCIA_VISUAL_TAG08": "TAG08_VISUAL_REFERENCE",
    "Aplicação visual": "Visual application",
    "Aplicação da identidade": "Identity application",
    "Sistema de trabalho": "Working system",
    "TAG08": "TAG08",
    "branding_claro": "clear_branding",
    "identidade_em_uso": "identity_in_use",
    "Etapas definidas": "Defined stages",
    "Sem improviso": "No improvisation",
    "SISTEMA DE TRABALHO": "WORKING SYSTEM",
    "Como conduzimos um projeto de identidade.": "How we guide an identity project.",
    "A TAG08 organiza o processo de branding em etapas claras: entendimento do contexto, direção visual, desenvolvimento do sistema, aplicações previstas e orientações de uso.": "TAG08 organizes branding into clear stages: understanding the context, setting visual direction, developing the system, creating agreed applications, and providing usage guidance.",
    "O objetivo é deixar a marca clara para quem cria, aprova e usa as peças depois da entrega.": "The goal is to make the brand clear to the people who create, approve, and use the materials after delivery.",
    "ORGANIZAR MINHA IDENTIDADE": "ORGANIZE MY IDENTITY",
    "Guias e critérios": "Guides and criteria",
    "Branding precisa de critério para ser aplicado.": "Branding needs clear criteria to be applied.",
    "Depois da criação visual, a marca precisa conseguir aplicar sua identidade com clareza. Guias, exemplos e orientações ajudam a reduzir improviso e manter consistência.": "After the visual work is created, the brand needs to apply its identity clearly. Guides, examples, and guidance help reduce improvisation and maintain consistency.",
    "Escolha um guia": "Choose a guide",
    "A seleção mostra como a TAG08 traduz a mesma identidade em usos diferentes sem perder clareza.": "This selection shows how TAG08 adapts the same identity to different uses without losing clarity.",
    "Preview da aplicação": "Application preview",
    "O que cobre:": "What it covers:",
    "Quando usar:": "When to use it:",
    "A ideia aqui é simples: menos improviso, mais repetição consistente do que já foi decidido.": "The idea is simple: less improvisation, more consistent repetition of what has already been decided.",
    "Os guias que sustentam o uso da marca": "Guides that support brand use",
    "O que precisa estar claro antes da marca entrar em circulação": "What needs to be clear before the brand goes into use",
    "Esses blocos resumem o que a TAG08 entrega para reduzir dúvida na hora de aplicar a identidade no dia a dia.": "These sections summarize what TAG08 delivers to reduce uncertainty when applying the identity day to day.",
    "Próximos passos": "Next steps",
    "Como colocar a identidade em uso sem bagunçar o sistema": "How to put the identity into use without disrupting the system",
    "Primeiro define-se a base. Depois a identidade entra nas peças que mais aparecem. Em seguida, a TAG08 orienta ajustes e padronização para manter tudo consistente.": "First, the foundation is defined. Then the identity is applied to the most visible materials. TAG08 then guides adjustments and standardization to keep everything consistent.",
    "FALAR COM A TAG08": "TALK TO TAG08",
    "Dúvidas sobre branding": "Questions about branding",
    "Antes de criar uma identidade, entenda o que precisa ser organizado.": "Before creating an identity, understand what needs to be organized.",
    "Identidade visual organiza a expressão da marca. Quando a direção, a proposta ou o público ainda não estão claros, o primeiro passo pode vir antes da construção visual.": "Visual identity organizes how a brand expresses itself. When direction, offer, or audience are not yet clear, the first step may come before visual development.",
    "SYS // BRANDING": "SYS // BRANDING",
    "GUIA DE IDENTIDADE": "IDENTITY GUIDE",
    "O que observar antes de fechar o escopo?": "What should be considered before confirming the scope?",
    "O escopo fica mais preciso quando considera canais, materiais existentes e o que precisa ser organizado primeiro.": "Scope becomes more precise when it accounts for channels, existing materials, and what needs to be organized first.",
    "Ver soluções": "View solutions",
    "FALE COM A TAG08": "TALK TO TAG08",
    "Precisa de orientação para o próximo passo?": "Need guidance on the next step?",
    "A TAG08 pode entender o momento da marca e indicar como estruturar a identidade de forma coerente com o escopo necessário.": "TAG08 can understand the brand’s current stage and suggest how to structure its identity in line with the required scope.",
    "Próximo passo": "Next step",
    "Vamos entender como sua marca precisa se apresentar?": "Let’s understand how your brand needs to present itself.",
    "Antes de propor uma identidade visual, a TAG08 entende o momento da marca, seus pontos de contato, a base existente e o que precisa ser organizado para definir um escopo coerente.": "Before proposing a visual identity, TAG08 learns about the brand’s current stage, its touchpoints, existing foundation, and what needs to be organized to define a coherent scope.",
    "VER SOLUÇÕES": "VIEW SOLUTIONS",
    "REFERÊNCIAS VISUAIS // TAG08": "VISUAL REFERENCES // TAG08",
    "REFERÊNCIA VISUAL": "VISUAL REFERENCE",
    "Ver acervo no Pinterest": "View the collection on Pinterest",
    "Contexto da marca": "Brand context",
    "Direção visual": "Visual direction",
    "Paleta de Cores": "Color palette",
    "Tipografia aplicada": "Typography in use",
    "CRITÉRIO VISUAL": "VISUAL CRITERIA",
    "Aplicações da marca:": "Brand applications:",
    "Fechar modal": "Close dialog",
    "Entendimento": "Discovery",
    "Leitura do negócio, do momento da marca, dos públicos, dos materiais existentes, dos canais e das necessidades de aplicação.": "Review of the business, brand stage, audiences, existing materials, channels, and application needs.",
    "Definição de referências, caminhos estéticos, linguagem e critérios para orientar a construção.": "Definition of references, visual directions, language, and criteria to guide development.",
    "Sistema de identidade": "Identity system",
    "Desenvolvimento e organização dos elementos visuais previstos no escopo.": "Development and organization of the visual elements included in the scope.",
    "Aplicações e continuidade": "Applications and continuity",
    "Aplicação nos materiais prioritários e orientação para manter o sistema coerente depois da entrega.": "Application to priority materials and guidance for keeping the system coherent after delivery.",
    "Guia de identidade": "Identity guide",
    "Exemplos de aplicação": "Application examples",
    "Critérios de consistência": "Consistency criteria",
    "Regras essenciais de uso da marca, cores, tipografia, elementos visuais e aplicações.": "Essential rules for using the brand, colors, typography, visual elements, and applications.",
    "Referências para aplicar a identidade em canais e materiais previstos no escopo.": "References for applying the identity across channels and materials included in the scope.",
    "Orientações para que novas peças respeitem a direção visual definida.": "Guidance to ensure new materials follow the established visual direction.",
    "Indicação do que deve ser aplicado primeiro conforme o momento e os pontos de contato da marca.": "Guidance on what to apply first based on the brand's current stage and touchpoints.",
    "01 // BASE": "01 // FOUNDATION",
    "02 // USO REAL": "02 // REAL-WORLD USE",
    "03 // PADRÃO": "03 // CONSISTENCY",
    "04 // ORDEM": "04 // SEQUENCE",
    "O logotipo identifica": "The logo identifies",
    "A identidade organiza": "Identity organizes",
    "O branding direciona": "Branding provides direction",
    "SIGNATURA": "SIGNATURE",
    "SISTEMA": "SYSTEM",
    "CONTEXTO": "CONTEXT",
    "A assinatura visual ajuda no reconhecimento, mas sozinha não organiza toda a expressão da marca.": "A visual signature supports recognition, but on its own it does not organize the brand's full expression.",
    "Cores, tipografia, elementos, composição e aplicações criam uma base visual mais consistente.": "Colors, typography, elements, composition, and applications create a more consistent visual foundation.",
    "O branding conecta percepção, posicionamento e expressão da marca. Quando essa direção ainda não está clara, pode ser necessário trabalhar o posicionamento antes da identidade.": "Branding connects perception, positioning, and brand expression. When that direction is unclear, positioning may need to be addressed before visual identity.",
    "Cores definidas\nTipografia principal\nElementos gráficos\nRegras de uso": "Defined colors\nPrimary typography\nGraphic elements\nUsage rules",
    "Redes sociais quando previsto\nApresentações prioritárias\nPropostas selecionadas\nSite e materiais quando previsto": "Social media when included\nPriority presentations\nSelected proposals\nWebsite and materials when included",
    "Ritmo visual\nEscala e contraste\nAlinhamento\nRepetição dos mesmos critérios": "Visual rhythm\nScale and contrast\nAlignment\nConsistent use of the same criteria",
    "Definir base\nAplicar nas peças prioritárias\nRevisar o conjunto\nExpandir com critério": "Define the foundation\nApply to priority materials\nReview the complete system\nExpand with clear criteria",
  },
  es: {
    "BRANDING E IDENTIDADE VISUAL // TAG08": "BRANDING E IDENTIDAD VISUAL // TAG08",
    "Identidade visual com direção": "Identidad visual con dirección",
    "para marcas que precisam comunicar melhor seu valor.": "para marcas que necesitan comunicar mejor su valor.",
    "A TAG08 desenvolve identidades visuais digitais para negócios que precisam organizar sua expressão de marca, alinhar materiais e construir uma presença mais clara, coerente e reconhecível nos principais pontos de contato.": "TAG08 desarrolla identidades visuales digitales para negocios que necesitan organizar su expresión de marca, alinear materiales y construir una presencia más clara, coherente y reconocible en los principales puntos de contacto.",
    "Falar com a TAG08": "Hablar con TAG08",
    "Organizar minha identidade": "Organizar mi identidad",
    "TAG08 VISUAL HUB": "CENTRO VISUAL TAG08",
    "Identidade com coerência": "Identidad coherente",
    "IDENTIDADE // EM USO": "IDENTIDAD // EN USO",
    "SINAIS DE DESALINHAMENTO VISUAL": "SEÑALES DE DESALINEACIÓN VISUAL",
    "Quando a identidade visual já não sustenta o valor da marca.": "Cuando la identidad visual deja de respaldar el valor de la marca.",
    "Muitas marcas entregam valor, mas ainda se apresentam de forma visualmente inconsistente. O problema nem sempre é falta de design; muitas vezes é falta de direção visual, critérios de aplicação e coerência entre identidade, linguagem e pontos de contato.": "Muchas marcas ofrecen valor, pero todavía se presentan de forma visualmente inconsistente. El problema no siempre es la falta de diseño; muchas veces es la falta de dirección visual, criterios de aplicación y coherencia entre identidad, lenguaje y puntos de contacto.",
    "CONSEQUÊNCIA DIRETA:": "CONSECUENCIA DIRECTA:",
    "Quando a identidade não sustenta a percepção desejada, materiais e canais passam a exigir mais esforço para transmitir uma mesma mensagem.": "Cuando la identidad no respalda la percepción deseada, los materiales y canales requieren más esfuerzo para transmitir un mensaje coherente.",
    "IDENTIDADE SEM SISTEMA": "IDENTIDAD SIN SISTEMA",
    "Logo sozinho não resolve percepção.": "Un logotipo por sí solo no define la percepción.",
    "Identidade precisa de regras para cor, tipografia, imagens, composição e materiais. Sem isso, cada ponto de contato acaba falando uma linguagem diferente.": "La identidad necesita reglas de color, tipografía, imágenes, composición y materiales. Sin ellas, cada punto de contacto termina hablando un lenguaje distinto.",
    "EIXO DE MARCA": "EJE DE MARCA",
    "MATURIDADE DA MARCA": "MADUREZ DE MARCA",
    "SISTEMAS VISUAIS SUSTENTAM CONSISTÊNCIA.": "LOS SISTEMAS VISUALES SOSTIENEN LA CONSISTENCIA.",
    "Veja onde a comunicação visual costuma perder clareza, coesão e reconhecimento ao longo da jornada da marca.": "Observa dónde la comunicación visual suele perder claridad, cohesión y reconocimiento durante el recorrido de la marca.",
    "01 // UNIDADE FRÁGIL": "01 // UNIDAD FRÁGIL",
    "Visual difícil de repetir": "Un estilo visual difícil de repetir",
    "Quando cada peça parece vir de uma referência diferente, a marca perde unidade e dificulta o reconhecimento ao longo do tempo.": "Cuando cada pieza parece partir de una referencia distinta, la marca pierde unidad y resulta más difícil reconocerla con el tiempo.",
    "02 // MATERIAIS DESALINHADOS": "02 // MATERIALES DESALINEADOS",
    "Os materiais não seguem o mesmo padrão": "Los materiales no siguen el mismo criterio",
    "Propostas, site, redes e apresentações precisam compartilhar uma mesma linguagem visual, não versões concorrentes da marca.": "Las propuestas, el sitio, las redes y las presentaciones deben compartir un mismo lenguaje visual, no versiones que compitan entre sí.",
    "03 // PERCEPÇÃO ABAIXO DA ENTREGA": "03 // PERCEPCIÓN POR DEBAJO DE LA ENTREGA",
    "A apresentação não acompanha o momento da marca": "La presentación no acompaña la etapa actual de la marca",
    "Quando a identidade visual fica aquém do momento atual do negócio, materiais e canais deixam de comunicar com a precisão necessária.": "Cuando la identidad visual queda por detrás de la etapa actual del negocio, los materiales y canales dejan de comunicar con la precisión necesaria.",
    "04 // DIREÇÃO DE MARCA": "04 // DIRECCIÓN DE MARCA",
    "A identidade precisa de critério": "La identidad necesita criterios claros",
    "Direção visual não é enfeite. Ela orienta escolhas de aplicação, padronização e continuidade em diferentes pontos de contato.": "La dirección visual no es decoración. Orienta las decisiones de aplicación, estandarización y continuidad en distintos puntos de contacto.",
    "O QUE ORGANIZAMOS": "QUÉ ORGANIZAMOS",
    "Identidade não é só logo. É um sistema para sustentar percepção.": "La identidad es más que un logotipo. Es un sistema que respalda la percepción.",
    "A TAG08 estrutura os elementos que formam a identidade visual da marca e orienta sua aplicação nos pontos de contato prioritários. O escopo depende do momento do negócio, dos canais envolvidos e da profundidade necessária.": "TAG08 estructura los elementos que forman la identidad visual de la marca y orienta su aplicación en los puntos de contacto prioritarios. El alcance depende de la etapa del negocio, los canales involucrados y la profundidad necesaria.",
    "Diagnóstico visual": "Diagnóstico visual",
    "Leitura da identidade atual, dos materiais existentes, dos pontos de contato e dos principais sinais de inconsistência visual.": "Análisis de la identidad actual, los materiales existentes, los puntos de contacto y las principales señales de inconsistencia visual.",
    "Direção de identidade": "Dirección de identidad",
    "Definição de referências, caminhos visuais, linguagem estética e critérios para orientar a construção da identidade.": "Definición de referencias, caminos visuales, lenguaje estético y criterios para orientar el desarrollo de la identidad.",
    "Sistema visual": "Sistema visual",
    "Organização de cores, tipografia, elementos gráficos, composição, imagens e hierarquias de uso.": "Organización de colores, tipografía, elementos gráficos, composición, imágenes y jerarquías de uso.",
    "Aplicações da marca": "Aplicaciones de marca",
    "Desenvolvimento dos materiais previstos no escopo para os pontos de contato prioritários.": "Desarrollo de los materiales incluidos en el alcance para los puntos de contacto prioritarios.",
    "Guia de uso": "Guía de uso",
    "Registro das principais regras e orientações para facilitar aplicação e continuidade depois da entrega.": "Registro de las reglas y orientaciones principales para facilitar la aplicación y continuidad después de la entrega.",
    "CRITÉRIOS DE CONFIANÇA": "CRITERIOS DE CONFIANZA",
    "O que sustenta uma identidade mais consistente.": "Qué sostiene una identidad más consistente.",
    "Uma identidade visual funciona melhor quando existe direção, sistema, aplicação e continuidade. O objetivo não é fazer a marca parecer algo que não é, mas apresentar com mais coerência aquilo que o negócio realmente entrega.": "Una identidad visual funciona mejor cuando hay dirección, sistema, aplicación y continuidad. El objetivo no es hacer que la marca parezca algo que no es, sino presentar con mayor coherencia lo que el negocio realmente ofrece.",
    "DIREÇÃO VISUAL // TAG08": "DIRECCIÓN VISUAL // TAG08",
    "PORTFÓLIO VISUAL // PINTEREST HUB": "PORTAFOLIO VISUAL // PINTEREST HUB",
    "Aplicações que mostram a identidade em uso.": "Aplicaciones que muestran la identidad en uso.",
    "O acervo reúne referências conceituais e aplicações autorizadas para mostrar como uma identidade pode funcionar em diferentes pontos de contato sem perder unidade.": "La colección reúne referencias conceptuales y aplicaciones autorizadas para mostrar cómo una identidad puede funcionar en distintos puntos de contacto sin perder unidad.",
    "Mais do que uma vitrine estética, o acervo ajuda a visualizar como sistema visual, critérios de aplicação e repetição constroem continuidade de marca.": "Más que una vitrina estética, la colección ayuda a visualizar cómo un sistema visual, los criterios de aplicación y la repetición construyen continuidad de marca.",
    "As referências não representam, por si só, clientes ativos, parceria ou promessa de resultado.": "Las referencias no representan por sí mismas clientes activos, alianzas ni promesas de resultados.",
    "FILTRAR PORTFÓLIO:": "FILTRAR PORTAFOLIO:",
    "Ver detalhes da aplicação": "Ver detalles de la aplicación",
    "REFERÊNCIA_VISUAL_TAG08": "REFERENCIA_VISUAL_TAG08",
    "Aplicação visual": "Aplicación visual",
    "Aplicação da identidade": "Aplicación de identidad",
    "Sistema de trabalho": "Sistema de trabajo",
    "TAG08": "TAG08",
    "branding_claro": "branding_claro",
    "identidade_em_uso": "identidad_en_uso",
    "Etapas definidas": "Etapas definidas",
    "Sem improviso": "Sin improvisación",
    "SISTEMA DE TRABALHO": "SISTEMA DE TRABAJO",
    "Como conduzimos um projeto de identidade.": "Cómo guiamos un proyecto de identidad.",
    "A TAG08 organiza o processo de branding em etapas claras: entendimento do contexto, direção visual, desenvolvimento do sistema, aplicações previstas e orientações de uso.": "TAG08 organiza el proceso de branding en etapas claras: comprensión del contexto, dirección visual, desarrollo del sistema, aplicaciones previstas y orientaciones de uso.",
    "O objetivo é deixar a marca clara para quem cria, aprova e usa as peças depois da entrega.": "El objetivo es que la marca sea clara para quienes crean, aprueban y usan las piezas después de la entrega.",
    "ORGANIZAR MINHA IDENTIDADE": "ORGANIZAR MI IDENTIDAD",
    "Guias e critérios": "Guías y criterios",
    "Branding precisa de critério para ser aplicado.": "El branding necesita criterios para aplicarse.",
    "Depois da criação visual, a marca precisa conseguir aplicar sua identidade com clareza. Guias, exemplos e orientações ajudam a reduzir improviso e manter consistência.": "Después del desarrollo visual, la marca necesita aplicar su identidad con claridad. Las guías, ejemplos y orientaciones ayudan a reducir la improvisación y mantener la consistencia.",
    "Escolha um guia": "Elige una guía",
    "A seleção mostra como a TAG08 traduz a mesma identidade em usos diferentes sem perder clareza.": "La selección muestra cómo TAG08 adapta la misma identidad a distintos usos sin perder claridad.",
    "Preview da aplicação": "Vista previa de la aplicación",
    "O que cobre:": "Qué incluye:",
    "Quando usar:": "Cuándo usarla:",
    "A ideia aqui é simples: menos improviso, mais repetição consistente do que já foi decidido.": "La idea es sencilla: menos improvisación y más repetición coherente de lo que ya se decidió.",
    "Os guias que sustentam o uso da marca": "Las guías que respaldan el uso de la marca",
    "O que precisa estar claro antes da marca entrar em circulação": "Qué debe estar claro antes de que la marca empiece a circular",
    "Esses blocos resumem o que a TAG08 entrega para reduzir dúvida na hora de aplicar a identidade no dia a dia.": "Estos bloques resumen lo que TAG08 entrega para reducir dudas al aplicar la identidad en el día a día.",
    "Próximos passos": "Próximos pasos",
    "Como colocar a identidade em uso sem bagunçar o sistema": "Cómo poner la identidad en uso sin desordenar el sistema",
    "Primeiro define-se a base. Depois a identidade entra nas peças que mais aparecem. Em seguida, a TAG08 orienta ajustes e padronização para manter tudo consistente.": "Primero se define la base. Después, la identidad se aplica en las piezas más visibles. Luego, TAG08 orienta los ajustes y la estandarización para mantener la coherencia.",
    "FALAR COM A TAG08": "HABLAR CON TAG08",
    "Dúvidas sobre branding": "Dudas sobre branding",
    "Antes de criar uma identidade, entenda o que precisa ser organizado.": "Antes de crear una identidad, entiende qué debe organizarse.",
    "Identidade visual organiza a expressão da marca. Quando a direção, a proposta ou o público ainda não estão claros, o primeiro passo pode vir antes da construção visual.": "La identidad visual organiza la expresión de la marca. Cuando la dirección, la propuesta o el público aún no están claros, el primer paso puede ser anterior al desarrollo visual.",
    "SYS // BRANDING": "SYS // BRANDING",
    "GUIA DE IDENTIDADE": "GUÍA DE IDENTIDAD",
    "O que observar antes de fechar o escopo?": "¿Qué considerar antes de definir el alcance?",
    "O escopo fica mais preciso quando considera canais, materiais existentes e o que precisa ser organizado primeiro.": "El alcance es más preciso cuando considera los canales, los materiales existentes y qué debe organizarse primero.",
    "Ver soluções": "Ver soluciones",
    "FALE COM A TAG08": "HABLA CON TAG08",
    "Precisa de orientação para o próximo passo?": "¿Necesitas orientación para el siguiente paso?",
    "A TAG08 pode entender o momento da marca e indicar como estruturar a identidade de forma coerente com o escopo necessário.": "TAG08 puede comprender la etapa de la marca e indicar cómo estructurar la identidad de acuerdo con el alcance necesario.",
    "Próximo passo": "Siguiente paso",
    "Vamos entender como sua marca precisa se apresentar?": "¿Entendemos cómo debe presentarse tu marca?",
    "Antes de propor uma identidade visual, a TAG08 entende o momento da marca, seus pontos de contato, a base existente e o que precisa ser organizado para definir um escopo coerente.": "Antes de proponer una identidad visual, TAG08 comprende la etapa de la marca, sus puntos de contacto, la base existente y qué debe organizarse para definir un alcance coherente.",
    "VER SOLUÇÕES": "VER SOLUCIONES",
    "REFERÊNCIAS VISUAIS // TAG08": "REFERENCIAS VISUALES // TAG08",
    "REFERÊNCIA VISUAL": "REFERENCIA VISUAL",
    "Ver acervo no Pinterest": "Ver la colección en Pinterest",
    "Contexto da marca": "Contexto de marca",
    "Direção visual": "Dirección visual",
    "Paleta de Cores": "Paleta de colores",
    "Tipografia aplicada": "Tipografía aplicada",
    "CRITÉRIO VISUAL": "CRITERIO VISUAL",
    "Aplicações da marca:": "Aplicaciones de marca:",
    "Fechar modal": "Cerrar ventana",
    "Entendimento": "Análisis inicial",
    "Leitura do negócio, do momento da marca, dos públicos, dos materiais existentes, dos canais e das necessidades de aplicação.": "Análisis del negocio, la etapa de la marca, sus públicos, los materiales existentes, los canales y las necesidades de aplicación.",
    "Definição de referências, caminhos estéticos, linguagem e critérios para orientar a construção.": "Definición de referencias, rutas estéticas, lenguaje y criterios para orientar el desarrollo.",
    "Sistema de identidade": "Sistema de identidad",
    "Desenvolvimento e organização dos elementos visuais previstos no escopo.": "Desarrollo y organización de los elementos visuales incluidos en el alcance.",
    "Aplicações e continuidade": "Aplicaciones y continuidad",
    "Aplicação nos materiais prioritários e orientação para manter o sistema coerente depois da entrega.": "Aplicación en los materiales prioritarios y orientación para mantener la coherencia del sistema después de la entrega.",
    "Guia de identidade": "Guía de identidad",
    "Exemplos de aplicação": "Ejemplos de aplicación",
    "Critérios de consistência": "Criterios de consistencia",
    "Regras essenciais de uso da marca, cores, tipografia, elementos visuais e aplicações.": "Reglas esenciales para usar la marca, los colores, la tipografía, los elementos visuales y sus aplicaciones.",
    "Referências para aplicar a identidade em canais e materiais previstos no escopo.": "Referencias para aplicar la identidad en los canales y materiales incluidos en el alcance.",
    "Orientações para que novas peças respeitem a direção visual definida.": "Orientaciones para que las nuevas piezas respeten la dirección visual definida.",
    "Indicação do que deve ser aplicado primeiro conforme o momento e os pontos de contato da marca.": "Indicación de qué aplicar primero según la etapa y los puntos de contacto de la marca.",
    "01 // BASE": "01 // BASE",
    "02 // USO REAL": "02 // USO REAL",
    "03 // PADRÃO": "03 // COHERENCIA",
    "04 // ORDEM": "04 // SECUENCIA",
    "O logotipo identifica": "El logotipo identifica",
    "A identidade organiza": "La identidad organiza",
    "O branding direciona": "El branding orienta",
    "SIGNATURA": "FIRMA VISUAL",
    "SISTEMA": "SISTEMA",
    "CONTEXTO": "CONTEXTO",
    "A assinatura visual ajuda no reconhecimento, mas sozinha não organiza toda a expressão da marca.": "La firma visual ayuda al reconocimiento, pero por sí sola no organiza toda la expresión de la marca.",
    "Cores, tipografia, elementos, composição e aplicações criam uma base visual mais consistente.": "Los colores, la tipografía, los elementos, la composición y las aplicaciones crean una base visual más coherente.",
    "O branding conecta percepção, posicionamento e expressão da marca. Quando essa direção ainda não está clara, pode ser necessário trabalhar o posicionamento antes da identidade.": "El branding conecta la percepción, el posicionamiento y la expresión de la marca. Si esa dirección aún no está clara, puede ser necesario trabajar el posicionamiento antes de la identidad visual.",
    "Cores definidas\nTipografia principal\nElementos gráficos\nRegras de uso": "Colores definidos\nTipografía principal\nElementos gráficos\nReglas de uso",
    "Redes sociais quando previsto\nApresentações prioritárias\nPropostas selecionadas\nSite e materiais quando previsto": "Redes sociales cuando estén incluidas\nPresentaciones prioritarias\nPropuestas seleccionadas\nSitio web y materiales cuando estén incluidos",
    "Ritmo visual\nEscala e contraste\nAlinhamento\nRepetição dos mesmos critérios": "Ritmo visual\nEscala y contraste\nAlineación\nRepetición de los mismos criterios",
    "Definir base\nAplicar nas peças prioritárias\nRevisar o conjunto\nExpandir com critério": "Definir la base\nAplicar en las piezas prioritarias\nRevisar el conjunto\nAmpliar con criterio",
  }
} as const;

export const getBrandingCopy = (text: string, locale: RouteLocale): string => {
  if (locale === "pt") return text;
  const translated = BRANDING_COPY[locale][text as keyof (typeof BRANDING_COPY)[typeof locale]];
  if (!translated) throw new Error(`Missing Branding ${locale} translation: ${text}`);
  return translated;
};

export default function Branding({ onNavigate, locale = "pt" }: BrandingProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeGuide, setActiveGuide] = useState<"identidade" | "aplicacao" | "consistencia" | "proximos">("identidade");
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeDialogButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const guidePreviews = {
    identidade: { card: "p-8 rounded-[24px] border-2 bg-charcoal-950 border-white/[0.08] text-left transition-colors duration-200 relative overflow-hidden flex flex-col justify-between min-h-[280px] shadow-[0_20px_50px_rgba(255,255,255,0.02)]", title: "text-xl sm:text-2xl text-white font-display uppercase tracking-tighter leading-tight font-black", tagline: "text-zinc-400 font-sans text-xs leading-relaxed", badge: "tag08-meta text-xs bg-white/5 text-white border border-white/10 px-2 py-0.5 rounded font-black uppercase", label: "IDENTIDADE", heading: "Guia de identidade", description: "Base visual para orientar o uso da marca em diferentes peças.", values: "Cores definidas\nTipografia principal\nElementos gráficos\nRegras de uso", fit: "Manual base para time interno e parceiros de produção" },
    aplicacao: { card: "p-8 rounded-[24px] border-2 bg-charcoal-950 border-brand/20 text-left transition-colors duration-200 relative overflow-hidden flex flex-col justify-between min-h-[280px] shadow-[0_20px_50px_rgba(var(--color-brand-rgb),0.05)]", title: "text-xl sm:text-2xl text-brand font-display uppercase tracking-tighter leading-none font-black", tagline: "text-zinc-300 font-sans text-xs leading-relaxed", badge: "tag08-meta text-xs bg-brand/10 text-brand border border-brand/20 px-2 py-0.5 rounded font-black uppercase", label: "APLICAÇÃO", heading: "Exemplos de aplicação", description: "Referências para aplicar a identidade nos pontos de contato previstos no escopo.", values: "Redes sociais quando previsto\nApresentações prioritárias\nPropostas selecionadas\nSite e materiais quando previsto", fit: "Pontos de contato que pedem leitura rápida e padronização" },
    consistencia: { card: "p-8 rounded-[24px] border-2 bg-charcoal-900 border-white/[0.08] text-left transition-colors duration-200 relative overflow-hidden flex flex-col justify-between min-h-[280px] shadow-[0_20px_50px_rgba(0,0,0,0.2)]", title: "text-xl sm:text-2xl text-white uppercase tracking-widest leading-tight font-semibold", tagline: "text-zinc-400 font-sans text-xs leading-relaxed", badge: "tag08-meta text-xs bg-white/5 text-zinc-200 border border-white/10 px-2 py-0.5 rounded font-black uppercase", label: "CONSISTÊNCIA", heading: "Critérios de consistência", description: "Critérios para manter unidade quando a marca entra em novas peças.", values: "Ritmo visual\nEscala e contraste\nAlinhamento\nRepetição dos mesmos critérios", fit: "Novas peças, campanhas e atualizações do dia a dia" },
    proximos: { card: "p-8 rounded-[24px] border-2 bg-charcoal-900 border-white/[0.08] text-left transition-colors duration-200 relative overflow-hidden flex flex-col justify-between min-h-[280px] shadow-[0_20px_50px_rgba(0,0,0,0.2)]", title: "text-xl sm:text-2xl text-white font-sans uppercase tracking-tight leading-none font-bold", tagline: "text-zinc-400 font-sans text-xs leading-relaxed", badge: "tag08-meta text-xs bg-white/5 text-zinc-200 border border-white/10 px-2 py-0.5 rounded font-black uppercase", label: "ORIENTAÇÃO", heading: "Próximos passos", description: "A ordem prática para sair da decisão e colocar a identidade em uso.", values: "Definir base\nAplicar nas peças prioritárias\nRevisar o conjunto\nExpandir com critério", fit: "Times que precisam colocar a marca em uso sem atraso" },
  };
  const guidePreview = guidePreviews[activeGuide];
  const localizedGuidePreview = locale === "pt"
    ? guidePreview
    : locale === "en"
      ? {
          identidade: { label: "IDENTITY", heading: "Identity guide", description: "Visual foundation for using the brand across different materials.", values: "Defined colors\nPrimary typography\nGraphic elements\nUsage rules", fit: "A foundation manual for in-house teams and production partners" },
          aplicacao: { label: "APPLICATION", heading: "Application examples", description: "References for applying the identity to touchpoints included in the scope.", values: "Social media when included\nPriority presentations\nSelected proposals\nWebsite and materials when included", fit: "Touchpoints that need quick reading and consistent presentation" },
          consistencia: { label: "CONSISTENCY", heading: "Consistency criteria", description: "Criteria for maintaining unity as the brand appears in new materials.", values: "Visual rhythm\nScale and contrast\nAlignment\nConsistent use of the same criteria", fit: "New materials, campaigns, and day-to-day updates" },
          proximos: { label: "GUIDANCE", heading: "Next steps", description: "A practical sequence for moving from decisions to using the identity.", values: "Define the foundation\nApply to priority materials\nReview the complete system\nExpand with clear criteria", fit: "Teams that need to put the brand into use without delay" },
        }[activeGuide]
      : {
          identidade: { label: "IDENTIDAD", heading: "Guía de identidad", description: "Base visual para orientar el uso de la marca en diferentes materiales.", values: "Colores definidos\nTipografía principal\nElementos gráficos\nReglas de uso", fit: "Manual base para equipos internos y socios de producción" },
          aplicacao: { label: "APLICACIÓN", heading: "Ejemplos de aplicación", description: "Referencias para aplicar la identidad en los puntos de contacto incluidos en el alcance.", values: "Redes sociales cuando estén incluidas\nPresentaciones prioritarias\nPropuestas seleccionadas\nSitio web y materiales cuando estén incluidos", fit: "Puntos de contacto que requieren lectura rápida y estandarización" },
          consistencia: { label: "COHERENCIA", heading: "Criterios de coherencia", description: "Criterios para mantener la unidad cuando la marca aparece en nuevas piezas.", values: "Ritmo visual\nEscala y contraste\nAlineación\nRepetición de los mismos criterios", fit: "Nuevas piezas, campañas y actualizaciones del día a día" },
          proximos: { label: "ORIENTACIÓN", heading: "Próximos pasos", description: "El orden práctico para pasar de las decisiones al uso de la identidad.", values: "Definir la base\nAplicar en las piezas prioritarias\nRevisar el conjunto\nAmpliar con criterio", fit: "Equipos que necesitan poner la marca en uso sin demora" },
        }[activeGuide];

  // State for active branding showcasing detail modal (similar to dynamic premium cases)
  const [selectedWork, setSelectedWork] = useState<{
    id: string;
    title: string;
    category: string;
    description: string;
    imageUrl: string;
    pinterestUrl: string;
    isCustom?: boolean;
    likesCount?: number;
    challenge?: string;
    solution?: string;
    colors?: string[];
    colorNames?: string[];
    typography?: string;
    achievement?: string;
    deliverables?: string[];
  } | null>(null);

  // Pinterest integration, showcase state and list management
  const [pinterestWorks, setPinterestWorks] = useState<{
    id: string;
    title: string;
    category: string;
    description: string;
    imageUrl: string;
    pinterestUrl: string;
    isCustom?: boolean;
    likesCount?: number;
    challenge?: string;
    solution?: string;
    colors?: string[];
    colorNames?: string[];
    typography?: string;
    achievement?: string;
    deliverables?: string[];
  }[]>([]);

  const [filterCategory, setFilterCategory] = useState<string>("todos");
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});

  const handleOutboundClick = (label: string, url: string, surface: string) => {
    trackOutboundClick({
      label,
      url,
      surface
    });
  };

  useEffect(() => {
    const DEFAULT_PINTEREST_WORKS = [
      {
        id: "pin-aura-derm",
        title: "Aura Clínica de Dermatologia",
        category: "Identidade para saúde",
        description: "Referência de sistema visual para uma clínica que precisa apresentar cuidado e continuidade em seus pontos de contato.",
        imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=650",
        pinterestUrl: TAG08_OFFICIAL_PINTEREST_URL,
        likesCount: 142,
        challenge: "Exemplo de contexto: alinhar materiais e presença digital a uma direção visual mais definida.",
        solution: "Direção visual proposta com paleta suave, monograma circular e aplicações para materiais institucionais e digitais.",
        colors: ["#FDFBF7", "#D4AF37", "#2D3748"],
        colorNames: ["Branco suave", "Dourado", "Cinza-azulado"],
        typography: "Serif editorial e sans-serif de apoio",
        achievement: "Aplicação pensada para manter unidade entre materiais e presença digital.",
        deliverables: ["Estudo de assinatura visual", "Exemplo de papelaria", "Diretrizes para materiais digitais", "Exemplo de aplicação em redes sociais"]
      },
      {
        id: "pin-lex-cooper",
        title: "Lex Cooper Advogados",
        category: "Identidade institucional",
        description: "Referência de identidade institucional para um escritório que busca mais unidade em materiais físicos e digitais.",
        imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=650",
        pinterestUrl: TAG08_OFFICIAL_PINTEREST_URL,
        likesCount: 98,
        challenge: "Exemplo de contexto: organizar apresentação, papelaria e presença institucional sob uma mesma linguagem visual.",
        solution: "Direção visual proposta com monograma, elementos de apoio e aplicações para canais físicos e digitais.",
        colors: ["#0C1017", "#B87333", "#E2E8F0"],
        colorNames: ["Preto", "Cobre", "Branco"],
        typography: "Serif institucional e mono de apoio",
        achievement: "Sistema pensado para manter unidade entre apresentação, papelaria e materiais institucionais.",
        deliverables: ["Estudo de monograma", "Sistema de apoio visual", "Exemplos de papelaria e apresentação", "Guia de aplicações"]
      },
      {
        id: "pin-vortex-tech",
        title: "Vortex Tech Partners",
        category: "Branding para tecnologia",
        description: "Referência de direção visual para um produto digital que precisa aproximar marca, interface e comunicação.",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=650",
        pinterestUrl: TAG08_OFFICIAL_PINTEREST_URL,
        likesCount: 187,
        challenge: "Exemplo de contexto: diferenciar um produto digital com uma identidade visual mais legível.",
        solution: "Direção visual proposta com elementos geométricos e aplicações para produto, interface e comunicação de lançamento.",
        colors: ["#020205", "var(--color-brand)", "#00F0FF"],
        colorNames: ["Preto", "Verde TAG08", "Ciano"],
        typography: "Sans-serif geométrica e mono de apoio",
        achievement: "Aplicação pensada para aproximar marca, produto e comunicação de lançamento.",
        deliverables: ["Estudo de assinatura responsiva", "Exemplos de componentes", "Diretrizes para interface", "Referências de motion"]
      },
      {
        id: "pin-emporio-sg",
        title: "Empório Saint Germain",
        category: "Branding para varejo",
        description: "Referência de direção visual para uma marca com embalagens e materiais de ponto de venda.",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=650",
        pinterestUrl: TAG08_OFFICIAL_PINTEREST_URL,
        likesCount: 214,
        challenge: "Exemplo de contexto: organizar embalagens e materiais para expressar origem e cuidado.",
        solution: "Direção visual proposta para rótulos, embalagens e materiais de ponto de venda.",
        colors: ["#1C1616", "#C5A880", "#FFFDF9"],
        colorNames: ["Marrom escuro", "Bege", "Branco"],
        typography: "Serif de apoio e sans-serif leve",
        achievement: "Sistema pensado para manter unidade entre embalagem e ponto de venda.",
        deliverables: ["Estudo de rótulos", "Exemplos de embalagens", "Materiais de apoio", "Guia de aplicação"]
      }
    ];

    setPinterestWorks(DEFAULT_PINTEREST_WORKS);

    try {
      const storedLikes = localStorage.getItem("tag08_pinterest_likes");
      if (storedLikes) {
        setLikedItems(JSON.parse(storedLikes));
      }
    } catch (e) {}
  }, []);

  const handleLikeItem = (id: string) => {
    const isLiked = !!likedItems[id];
    const newLikes = { ...likedItems, [id]: !isLiked };
    setLikedItems(newLikes);
    localStorage.setItem("tag08_pinterest_likes", JSON.stringify(newLikes));

    setPinterestWorks(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          likesCount: (item.likesCount || 0) + (isLiked ? -1 : 1)
        };
      }
      return item;
    }));
  };

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  const directWhatsAppUrl = buildBrazilWhatsAppUrl(
    "Olá, gostaria de entender como a TAG08 pode organizar a identidade visual da minha marca."
  );

  const openSelectedWork = (work: NonNullable<typeof selectedWork>, trigger?: HTMLElement) => {
    lastFocusedElementRef.current = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setSelectedWork(work);
  };

  const closeSelectedWork = () => {
    setSelectedWork(null);
    window.requestAnimationFrame(() => lastFocusedElementRef.current?.focus());
  };

  useEffect(() => {
    if (!selectedWork) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusDialogClose = () => window.requestAnimationFrame(() => closeDialogButtonRef.current?.focus());
    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSelectedWork();
        return;
      }

      if (event.key !== "Tab") return;
      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements?.length) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    focusDialogClose();
    document.addEventListener("keydown", handleDialogKeyDown);
    return () => {
      document.removeEventListener("keydown", handleDialogKeyDown);
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [selectedWork]);

  const faqCopy = locale === "pt" ? {
    questions: ["Branding é só criação de logo?", "Quando faz sentido investir em branding e identidade visual?", "A TAG08 cria manual de marca?", "O projeto inclui aplicações para redes sociais e materiais comerciais?", "Branding ajuda a comunicar a marca com mais clareza?"],
    answers: [
      "Não. O logotipo é uma parte da identidade. O trabalho pode envolver sistema visual, cores, tipografia, elementos, aplicações e orientações de uso para que a marca se apresente com maior unidade.",
      "Quando a marca já não representa bem o momento atual do negócio, quando materiais e canais parecem desconectados ou quando falta uma base visual que possa ser aplicada com continuidade.",
      "Pode criar, quando isso fizer parte do escopo. O guia registra regras, aplicações e orientações necessárias para facilitar o uso da identidade depois da entrega.",
      "Pode incluir. As aplicações são definidas conforme os pontos de contato prioritários e o escopo aprovado. Redes sociais, apresentações, propostas, papelaria e site não entram automaticamente em todo projeto.",
      "Uma identidade bem estruturada pode ajudar a organizar percepção e aplicação, mas não substitui posicionamento, oferta, entrega real ou estratégia. Quando o problema está antes da expressão visual, pode ser necessário trabalhar reposicionamento primeiro."
    ]
  } : locale === "en" ? {
    questions: ["Is branding just logo design?", "When does it make sense to invest in branding and visual identity?", "Does TAG08 create brand guidelines?", "Does the project include social and sales material applications?", "Can branding help communicate a brand more clearly?"],
    answers: [
      "No. A logo is one part of an identity. The work may include a visual system, colors, typography, elements, applications, and usage guidance so the brand can present itself more consistently.",
      "When the brand no longer reflects the business’s current stage, when materials and channels feel disconnected, or when there is no visual foundation that can be applied consistently.",
      "Yes, when included in scope. The guide records rules, applications, and guidance needed to support identity use after delivery.",
      "It can. Applications are defined according to priority touchpoints and the approved scope. Social media, presentations, proposals, stationery, and websites are not automatically included in every project.",
      "A well-structured identity can help organize perception and application, but it does not replace positioning, the offer, actual delivery, or strategy. If the issue comes before visual expression, positioning work may be needed first."
    ]
  } : {
    questions: ["¿El branding consiste solo en diseñar un logotipo?", "¿Cuándo conviene invertir en branding e identidad visual?", "¿TAG08 crea manuales de marca?", "¿El proyecto incluye aplicaciones para redes y materiales comerciales?", "¿El branding ayuda a comunicar la marca con más claridad?"],
    answers: [
      "No. El logotipo es una parte de la identidad. El trabajo puede incluir un sistema visual, colores, tipografía, elementos, aplicaciones y orientaciones de uso para que la marca se presente con mayor unidad.",
      "Cuando la marca ya no representa bien la etapa actual del negocio, cuando los materiales y canales parecen desconectados o cuando falta una base visual que pueda aplicarse de forma continua.",
      "Sí, cuando forma parte del alcance. La guía registra reglas, aplicaciones y orientaciones necesarias para facilitar el uso de la identidad después de la entrega.",
      "Puede incluirlas. Las aplicaciones se definen según los puntos de contacto prioritarios y el alcance aprobado. Redes, presentaciones, propuestas, papelería y sitios web no se incluyen automáticamente en todos los proyectos.",
      "Una identidad bien estructurada puede ayudar a organizar la percepción y la aplicación, pero no sustituye el posicionamiento, la oferta, la entrega real ni la estrategia. Si el problema es anterior a la expresión visual, puede ser necesario trabajar primero el posicionamiento."
    ]
  };

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
      <section className="order-1 px-4 sm:px-6 md:px-8 py-12 sm:py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          {/* 1. Header Typography block (Ref Style: Expert guidance / tailored solution) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 lg:items-center text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta self-start">
                {getBrandingCopy("BRANDING E IDENTIDADE VISUAL // TAG08", locale)}
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter font-display">
                {getBrandingCopy("Identidade visual com direção", locale)} <br />
                <span className="text-brand">{getBrandingCopy("para marcas que precisam comunicar melhor seu valor.", locale)}</span>
              </h1>
            </div>
            <div className="lg:col-span-5 space-y-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-sm leading-relaxed font-sans font-medium">
                {getBrandingCopy("A TAG08 desenvolve identidades visuais digitais para negócios que precisam organizar sua expressão de marca, alinhar materiais e construir uma presença mais clara, coerente e reconhecível nos principais pontos de contato.", locale)}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <TrackedOutboundLink
                  label="Falar com a TAG08"
                  surface="branding-hero"
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-xs tag08-meta font-black uppercase tracking-widest text-black transition-colors duration-200 hover:bg-brand-dark active:scale-[0.98]"
                >
                  {getBrandingCopy("Falar com a TAG08", locale)}
                  <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                </TrackedOutboundLink>
                <button
                  type="button"
                  onClick={() => handleLinkClick("/contato")}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-brand-secondary/50 bg-brand-secondary/10 px-5 py-3 text-xs tag08-meta font-black uppercase tracking-widest text-brand-secondary transition-colors duration-200 hover:bg-brand-secondary/20 active:scale-[0.98]"
                >
                  {getBrandingCopy("Organizar minha identidade", locale)}
                </button>
              </div>
            </div>
          </div>

          {/* 2. Panoramic Wide Banner Image with capsule neon overlay trigger wrapped in 3D perspective tilt container */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[21/9] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <ResilientImage
                fallbackLabel={locale === "pt" ? "Processo de construção de identidade visual" : locale === "en" ? "Visual identity development process" : "Proceso de desarrollo de identidad visual"}
                sizes="(max-width: 1280px) 100vw, 1280px"
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1600"
                alt={locale === "pt" ? "Processo de construção de identidade visual" : locale === "en" ? "Visual identity development process" : "Proceso de desarrollo de identidad visual"}
                preload
                className="object-cover grayscale brightness-50 transition-[filter] duration-200 ease-out"
                referrerPolicy="no-referrer"
              />
              {/* Elegant overlay masks */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />

              {/* Glowing neon action button floating inside face banner mimicking "Free Trial" anchor */}
              {/* Absolute indicator tags on corners */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none">
                <div className="space-y-1">
                  <span className="tag08-meta text-xs text-brand-secondary tracking-widest block uppercase font-semibold">{getBrandingCopy("TAG08 VISUAL HUB", locale)}</span>
              <span className="font-display font-black text-white text-xs sm:text-sm tracking-tight leading-none">{getBrandingCopy("Identidade com coerência", locale)}</span>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-xs text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span>{getBrandingCopy("IDENTIDADE // EM USO", locale)}</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

        </div>
      </section>

      {/* SECTION 2 - DIAGNOSTIC & PERSPECTIVE SHIFT */}
      <section className="order-2 py-16 sm:py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 text-left relative overflow-hidden">
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/[0.01] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-semibold bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                {getBrandingCopy("SINAIS DE DESALINHAMENTO VISUAL", locale)}
              </span>
              <h2 className="font-display font-medium text-3xl text-white tracking-tight">
                {getBrandingCopy("Quando a identidade visual já não sustenta o valor da marca.", locale)}
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                {getBrandingCopy("Muitas marcas entregam valor, mas ainda se apresentam de forma visualmente inconsistente. O problema nem sempre é falta de design; muitas vezes é falta de direção visual, critérios de aplicação e coerência entre identidade, linguagem e pontos de contato.", locale)}
              </p>

              <div className="p-5 rounded-2xl bg-brand-secondary/[0.01] border border-brand-secondary/5 text-xs text-zinc-400 font-sans">
                <span className="text-brand-secondary font-black uppercase block mb-1">{getBrandingCopy("CONSEQUÊNCIA DIRETA:", locale)}</span>
                {getBrandingCopy("Quando a identidade não sustenta a percepção desejada, materiais e canais passam a exigir mais esforço para transmitir uma mesma mensagem.", locale)}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {[
                "Peças desconectadas: apresentações, posts e materiais parecem ter sido criados em momentos diferentes, sem uma lógica visual comum.",
                "Percepção abaixo da entrega: a apresentação ainda não traduz com precisão o cuidado e a qualidade que o negócio busca comunicar.",
                "Identidade difícil de aplicar: cores, tipografia, elementos, imagens e aplicações não seguem critérios de uso suficientemente claros.",
                "Materiais com estilos diferentes: propostas, redes sociais, site, apresentações e documentos comerciais não parecem pertencer à mesma marca.",
                "Estética desconectada da proposta atual: a aparência existe, mas não acompanha o público, a mensagem ou o momento da marca."
              ].map((signal, sIdx) => (
                <div key={sIdx} className="flex gap-4 items-start p-4 rounded-2xl bg-charcoal-900 border border-white/[0.03] hover:border-white/[0.06] transition-colors duration-200">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-secondary shrink-0 shadow-[0_0_8px_var(--color-brand-secondary)]" />
                  <p className="text-zinc-300 text-xs sm:text-sm font-sans font-medium leading-relaxed text-left">{signal}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-baseline pt-12 border-t border-white/[0.04]">
            <div className="lg:col-span-4 space-y-4">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-semibold bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                {getBrandingCopy("IDENTIDADE SEM SISTEMA", locale)}
              </span>
              <h2 className="font-display font-medium text-3xl text-white tracking-tight leading-tight">
                {getBrandingCopy("Logo sozinho não resolve percepção.", locale)}
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                {getBrandingCopy("Identidade precisa de regras para cor, tipografia, imagens, composição e materiais. Sem isso, cada ponto de contato acaba falando uma linguagem diferente.", locale)}
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { title: "O logotipo identifica", focus: "SIGNATURA", desc: "A assinatura visual ajuda no reconhecimento, mas sozinha não organiza toda a expressão da marca." },
                { title: "A identidade organiza", focus: "SISTEMA", desc: "Cores, tipografia, elementos, composição e aplicações criam uma base visual mais consistente." },
                { title: "O branding direciona", focus: "CONTEXTO", desc: "O branding conecta percepção, posicionamento e expressão da marca. Quando essa direção ainda não está clara, pode ser necessário trabalhar o posicionamento antes da identidade." }
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-charcoal-900 border border-white/[0.04] space-y-4 hover:border-brand-secondary/15 hover:bg-white/[0.01] transition-colors duration-200">
                  <div className="flex items-center justify-between border-b border-white/[0.03] pb-3 text-xs font-sans text-zinc-300">
                    <span>{getBrandingCopy("EIXO DE MARCA", locale)}</span>
                    <span className="text-brand-secondary">{getBrandingCopy(item.focus, locale)}</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-white text-xs sm:text-sm font-display font-bold tracking-tight">{getBrandingCopy(item.title, locale)}</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans">{getBrandingCopy(item.desc, locale)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-12 border-t border-white/[0.04]">
            <div className="lg:col-span-4 space-y-4">
              <span className="tag08-meta text-xs text-zinc-300 uppercase tracking-widest block font-bold">{getBrandingCopy("MATURIDADE DA MARCA", locale)}</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white leading-none tracking-tight">
                {getBrandingCopy("SISTEMAS VISUAIS SUSTENTAM CONSISTÊNCIA.", locale)}
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                {getBrandingCopy("Veja onde a comunicação visual costuma perder clareza, coesão e reconhecimento ao longo da jornada da marca.", locale)}
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl space-y-2 transition-colors duration-200">
                <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">{getBrandingCopy("01 // UNIDADE FRÁGIL", locale)}</span>
                <h3 className="text-white font-display font-black text-sm">{getBrandingCopy("Visual difícil de repetir", locale)}</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {getBrandingCopy("Quando cada peça parece vir de uma referência diferente, a marca perde unidade e dificulta o reconhecimento ao longo do tempo.", locale)}
                </p>
              </div>

              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl space-y-2 transition-colors duration-200">
                <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">{getBrandingCopy("02 // MATERIAIS DESALINHADOS", locale)}</span>
                <h3 className="text-white font-display font-black text-sm">{getBrandingCopy("Os materiais não seguem o mesmo padrão", locale)}</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {getBrandingCopy("Propostas, site, redes e apresentações precisam compartilhar uma mesma linguagem visual, não versões concorrentes da marca.", locale)}
                </p>
              </div>

              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl space-y-2 transition-colors duration-200">
                <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">{getBrandingCopy("03 // PERCEPÇÃO ABAIXO DA ENTREGA", locale)}</span>
                <h3 className="text-white font-display font-black text-sm">{getBrandingCopy("A apresentação não acompanha o momento da marca", locale)}</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {getBrandingCopy("Quando a identidade visual fica aquém do momento atual do negócio, materiais e canais deixam de comunicar com a precisão necessária.", locale)}
                </p>
              </div>

              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl space-y-2 transition-colors duration-200">
                <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">{getBrandingCopy("04 // DIREÇÃO DE MARCA", locale)}</span>
                <h3 className="text-white font-display font-black text-sm">{getBrandingCopy("A identidade precisa de critério", locale)}</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {getBrandingCopy("Direção visual não é enfeite. Ela orienta escolhas de aplicação, padronização e continuidade em diferentes pontos de contato.", locale)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - DELIVERABLES */}
      <section className="order-3 px-4 sm:px-6 md:px-8 py-14 sm:py-16 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-bold">{getBrandingCopy("O QUE ORGANIZAMOS", locale)}</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">{getBrandingCopy("Identidade não é só logo. É um sistema para sustentar percepção.", locale)}</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              {getBrandingCopy("A TAG08 estrutura os elementos que formam a identidade visual da marca e orienta sua aplicação nos pontos de contato prioritários. O escopo depende do momento do negócio, dos canais envolvidos e da profundidade necessária.", locale)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left [&>*:last-child]:md:col-span-2 [&>*:last-child]:lg:col-span-1">
            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-charcoal-950 border border-white/5 flex items-center justify-center">
                <Search className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-display font-black text-sm">{getBrandingCopy("Diagnóstico visual", locale)}</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {getBrandingCopy("Leitura da identidade atual, dos materiais existentes, dos pontos de contato e dos principais sinais de inconsistência visual.", locale)}
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-charcoal-950 border border-white/5 flex items-center justify-center">
                <Compass className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-display font-black text-sm">{getBrandingCopy("Direção de identidade", locale)}</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {getBrandingCopy("Definição de referências, caminhos visuais, linguagem estética e critérios para orientar a construção da identidade.", locale)}
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-charcoal-950 border border-white/5 flex items-center justify-center">
                <Palette className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-display font-black text-sm">{getBrandingCopy("Sistema visual", locale)}</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {getBrandingCopy("Organização de cores, tipografia, elementos gráficos, composição, imagens e hierarquias de uso.", locale)}
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-charcoal-950 border border-white/5 flex items-center justify-center">
                <Layers className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-display font-black text-sm">{getBrandingCopy("Aplicações da marca", locale)}</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {getBrandingCopy("Desenvolvimento dos materiais previstos no escopo para os pontos de contato prioritários.", locale)}
                </p>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 duration-300 rounded-3xl p-6 space-y-4 group">
              <div className="w-10 h-10 rounded-2xl bg-charcoal-950 border border-white/5 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-display font-black text-sm">{getBrandingCopy("Guia de uso", locale)}</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {getBrandingCopy("Registro das principais regras e orientações para facilitar aplicação e continuidade depois da entrega.", locale)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - TRUST CORE BAR */}
      <section className="order-4 px-4 sm:px-6 md:px-8 py-10 border-b border-white/[0.04] bg-charcoal-900/40 text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-3xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-semibold bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              {getBrandingCopy("CRITÉRIOS DE CONFIANÇA", locale)}
            </span>
            <h3 className="text-white font-display font-black text-sm tracking-tight">{getBrandingCopy("O que sustenta uma identidade mais consistente.", locale)}</h3>
            <p className="text-zinc-400 text-xs font-sans font-medium leading-relaxed">
              {getBrandingCopy("Uma identidade visual funciona melhor quando existe direção, sistema, aplicação e continuidade. O objetivo não é fazer a marca parecer algo que não é, mas apresentar com mais coerência aquilo que o negócio realmente entrega.", locale)}
            </p>
          </div>
          <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest border border-brand-secondary/20 bg-brand-secondary/5 px-3.5 py-2 rounded-xl shrink-0 font-black">
            {getBrandingCopy("DIREÇÃO VISUAL // TAG08", locale)}
          </span>
        </div>
      </section>

      {/* PINTEREST SHOWCASE SECTION */}
      <section id="pinterest-brand-showcase" className="order-8 py-16 sm:py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden text-left">
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-brand-secondary/[0.015] rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end border-b border-white/[0.04] pb-8">
            <div className="lg:col-span-12 space-y-3">
              <span className="tag08-action text-xs text-brand-secondary uppercase tracking-widest font-semibold bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block select-none">
                {getBrandingCopy("PORTFÓLIO VISUAL // PINTEREST HUB", locale)}
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
                {getBrandingCopy("Aplicações que mostram a identidade em uso.", locale)}
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans font-medium max-w-2xl leading-relaxed">
                {getBrandingCopy("O acervo reúne referências conceituais e aplicações autorizadas para mostrar como uma identidade pode funcionar em diferentes pontos de contato sem perder unidade.", locale)}
              </p>
              <p className="text-zinc-300 text-xs sm:text-sm font-sans leading-relaxed max-w-2xl">
                {getBrandingCopy("Mais do que uma vitrine estética, o acervo ajuda a visualizar como sistema visual, critérios de aplicação e repetição constroem continuidade de marca.", locale)}
              </p>
              <p className="text-zinc-300 text-xs leading-relaxed max-w-2xl">
                {getBrandingCopy("As referências não representam, por si só, clientes ativos, parceria ou promessa de resultado.", locale)}
              </p>
            </div>

          </div>

          <div role="group" aria-label={locale === "pt" ? "Filtrar referências visuais" : locale === "en" ? "Filter visual references" : "Filtrar referencias visuales"} className="flex flex-wrap items-center gap-2 border-b border-white/[0.03] pb-4">
            <span className="tag08-meta text-xs text-zinc-300 uppercase tracking-widest block font-bold mr-3">{getBrandingCopy("FILTRAR PORTFÓLIO:", locale)}</span>
            {["todos", ...Array.from(new Set(pinterestWorks.map(item => item.category)))].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                type="button"
                aria-pressed={filterCategory === cat}
                className={`min-h-11 font-sans text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-lg border transition-[border-color,background-color,color] duration-200 cursor-pointer ${
                  filterCategory === cat
                    ? "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/30 shadow-[0_2px_12px_rgba(var(--color-brand-secondary-rgb),0.08)] font-bold"
                    : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                }`}
              >
                {cat === "todos" ? (locale === "pt" ? "Visualizar todas" : locale === "en" ? "View all" : "Ver todas") : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {pinterestWorks
                .filter(item => filterCategory === "todos" || item.category === filterCategory)
                .map((work) => {
                  const isItemLiked = !!likedItems[work.id];

                  return (
                    <motion.div
                      key={work.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                      className="relative bg-charcoal-900 border border-white/[0.06] hover:border-brand/40 rounded-3xl overflow-hidden flex flex-col justify-between group shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-[border-color,box-shadow] duration-200"
                    >
                      <button
                        type="button"
                        aria-label={locale === "pt" ? `Abrir aplicação da identidade: ${work.title}` : locale === "en" ? `Open identity application: ${work.title}` : `Abrir aplicación de identidad: ${work.title}`}
                        onClick={(event) => openSelectedWork(work, event.currentTarget as HTMLElement)}
                        className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
                      />
                      <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden border-b border-white/[0.04]">
                        <ResilientImage
                          fallbackLabel={locale === "pt" ? "Aplicação de identidade visual" : locale === "en" ? "Visual identity application" : "Aplicación de identidad visual"}
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          src={work.imageUrl}
                          alt={work.title}
                          className="object-cover transition-[filter] duration-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/30 opacity-70 group-hover:opacity-60 transition-opacity pointer-events-none" />

                        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
                          <span className="tag08-meta text-xs bg-black/60 backdrop-blur-md text-zinc-300 font-bold tracking-widest uppercase py-1 px-2.5 rounded-md border border-white/5 shadow-sm">
                            {work.category}
                          </span>

                          <button
                            type="button"
                            aria-label={locale === "pt" ? (isItemLiked ? `Remover ${work.title} dos favoritos` : `Adicionar ${work.title} aos favoritos`) : locale === "en" ? (isItemLiked ? `Remove ${work.title} from favorites` : `Add ${work.title} to favorites`) : (isItemLiked ? `Quitar ${work.title} de favoritos` : `Añadir ${work.title} a favoritos`)}
                            aria-pressed={isItemLiked}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLikeItem(work.id);
                            }}
                            className={`min-h-11 min-w-11 rounded-lg flex items-center justify-center backdrop-blur-md transition-colors duration-200 shadow-sm ${
                              isItemLiked
                                ? "bg-red-500/20 text-red-400 border border-red-500/35"
                                : "bg-black/60 border border-white/10 text-zinc-400 hover:text-white"
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isItemLiked ? "fill-red-400" : ""}`} />
                          </button>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-10">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openSelectedWork(work, e.currentTarget as HTMLElement);
                            }}
                            className="min-h-11 bg-brand-secondary hover:bg-white text-black tag08-meta text-xs uppercase tracking-widest font-black py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors duration-200 shadow-[0_4px_15px_rgba(var(--color-brand-secondary-rgb),0.3)]"
                          >
                            <span>{getBrandingCopy("Ver detalhes da aplicação", locale)}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div aria-hidden="true" className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-zinc-300 font-sans text-xs tracking-wider select-none pointer-events-none">
                          <span>{getBrandingCopy("REFERÊNCIA_VISUAL_TAG08", locale)}</span>
                          <span className="text-zinc-400 flex items-center gap-1">
                            <Heart className="w-2 h-2 text-red-500" />
                            {getBrandingCopy("Aplicação visual", locale)}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <h3 className="text-white font-display font-black text-sm group-hover:text-brand transition-colors text-left truncate">
                            {work.title}
                          </h3>
                          <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium line-clamp-3 text-left">
                            {work.description}
                          </p>
                        </div>

                        <div className="relative z-20 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                          <button
                            onClick={(event) => openSelectedWork(work, event.currentTarget as HTMLElement)}
                            className="min-h-11 text-xs font-sans text-zinc-300 hover:text-brand flex items-center gap-1 transition-colors duration-200 text-left cursor-pointer"
                          >
                            <span>{getBrandingCopy("Aplicação da identidade", locale)}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-brand-secondary" />
                          </button>

                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </div>

        </div>
      </section>
      {/* SECTION - WORK SYSTEM */}
      <section className="order-6 py-16 sm:py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[48px] bg-charcoal-900 border border-brand/30 text-white p-6 sm:p-10 lg:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-[0_30px_70px_rgba(0,0,0,0.34)] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[300px] sm:min-h-[360px] lg:min-h-[420px]">
            <div className="absolute inset-0 bg-black/10 rounded-[24px] overflow-hidden" />
            <ResilientImage
              fallbackLabel={locale === "pt" ? "Referência visual de identidade" : locale === "en" ? "Visual identity reference" : "Referencia visual de identidad"}
              sizes="(max-width: 1024px) 100vw, 42vw"
              src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800"
              alt={locale === "pt" ? "Referência visual de materiais e sistema de identidade" : locale === "en" ? "Visual reference for materials and identity system" : "Referencia visual de materiales y sistema de identidad"}
              className="object-cover rounded-[24px] mix-blend-normal brightness-[0.95] contrast-[1.05] grayscale-[15%] transition-[filter] duration-200"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex justify-between items-start">
                <span className="tag08-meta text-xs text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  {getBrandingCopy("Sistema de trabalho", locale)}
                </span>
                <span className="font-sans text-xs text-white/40 tracking-wider">
                  {getBrandingCopy("TAG08", locale)}
                </span>
              </div>
              <div className="space-y-1.5 opacity-30 select-none">
                <div className="font-display font-extrabold text-[1.8rem] text-white/40 tracking-widest leading-none uppercase select-none">
                  {getBrandingCopy("branding_claro", locale)}
                </div>
                <div aria-hidden="true" className="font-display font-extrabold text-[1.5rem] text-white/20 tracking-widest leading-none uppercase select-none pl-6">
                  {getBrandingCopy("identidade_em_uso", locale)}
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-sans text-xs text-white/40 tracking-wider">
                  {locale === "pt" ? "Etapas definidas" : locale === "en" ? "Defined stages" : "Etapas definidas"}
                </span>
                <span className="tag08-meta text-xs text-white/50 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">
                  {locale === "pt" ? "Sem improviso" : locale === "en" ? "No improvisation" : "Sin improvisación"}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 text-left h-full relative z-10 lg:pl-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-brand font-semibold">
                <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                </div>
                <span className="tag08-meta text-xs tracking-widest uppercase font-bold text-brand">
                  {getBrandingCopy("SISTEMA DE TRABALHO", locale)}
                </span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.9] tracking-tighter">
                {getBrandingCopy("Como conduzimos um projeto de identidade.", locale)}
              </h2>
              <p className="text-zinc-300 text-xs sm:text-xs max-w-lg leading-relaxed font-sans font-semibold">
              {getBrandingCopy("A TAG08 organiza o processo de branding em etapas claras: entendimento do contexto, direção visual, desenvolvimento do sistema, aplicações previstas e orientações de uso.", locale)}
              </p>
            </div>

            <div className="bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-7 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Entendimento",
                    text: "Leitura do negócio, do momento da marca, dos públicos, dos materiais existentes, dos canais e das necessidades de aplicação."
                  },
                  {
                    title: "Direção visual",
                    text: "Definição de referências, caminhos estéticos, linguagem e critérios para orientar a construção."
                  },
                  {
                    title: "Sistema de identidade",
                    text: "Desenvolvimento e organização dos elementos visuais previstos no escopo."
                  },
                  {
                    title: "Aplicações e continuidade",
                    text: "Aplicação nos materiais prioritários e orientação para manter o sistema coerente depois da entrega."
                  }
                ].map((step, index) => (
                  <div key={step.title} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-extrabold block">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-white text-sm font-semibold tracking-tight">
                      {getBrandingCopy(step.title, locale)}
                    </h3>
                    <p className="text-white/70 text-xs leading-relaxed font-sans">
                      {getBrandingCopy(step.text, locale)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-white/[0.05]">
                <p className="text-white/70 text-xs leading-relaxed font-sans max-w-md">
                  {getBrandingCopy("O objetivo é deixar a marca clara para quem cria, aprova e usa as peças depois da entrega.", locale)}
                </p>
                <button
                  onClick={() => handleLinkClick("/contato")}
                  className="group inline-flex min-h-11 items-center gap-2 bg-black text-brand font-sans font-black text-xs uppercase tracking-widest py-3.5 px-5 rounded-xl border border-black/10 hover:bg-white transition-colors duration-200 active:scale-[0.98] cursor-pointer"
                >
                  {getBrandingCopy("ORGANIZAR MINHA IDENTIDADE", locale)}
                  <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - SOLUTIONS & RICH GUIDES */}
      <section className="order-7 py-16 sm:py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-900/40 text-left">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="space-y-12">
            <div className="space-y-3 max-w-3xl">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-semibold bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                {getBrandingCopy("Guias e critérios", locale)}
              </span>
              <h2 className="font-display font-medium text-3xl text-white tracking-tight">
                {getBrandingCopy("Branding precisa de critério para ser aplicado.", locale)}
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                {locale === "pt" ? "Depois da criação visual, a marca precisa conseguir aplicar sua identidade com clareza. Guias, exemplos e orientações ajudam a reduzir improviso e manter consistência." : locale === "en" ? "After the visual work is created, the brand needs to apply its identity clearly. Guides, examples, and guidance help reduce improvisation and maintain consistency." : "Después del desarrollo visual, la marca necesita aplicar su identidad con claridad. Las guías, ejemplos y orientaciones ayudan a reducir la improvisación y mantener la consistencia."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-5 bg-charcoal-900/60 border border-white/[0.05] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 text-left">
                <div className="space-y-4">
                  <span className="tag08-meta text-xs text-zinc-300 uppercase tracking-widest font-bold block pb-2 border-b border-white/[0.05]">
                    {getBrandingCopy("Escolha um guia", locale)}
                  </span>

                  {[
                    {
                      id: "identidade",
                      name: "Guia de identidade",
                      desc: "Regras essenciais de uso da marca, cores, tipografia, elementos visuais e aplicações."
                    },
                    {
                      id: "aplicacao",
                      name: "Exemplos de aplicação",
                      desc: "Referências para aplicar a identidade em canais e materiais previstos no escopo."
                    },
                    {
                      id: "consistencia",
                      name: "Critérios de consistência",
                      desc: "Orientações para que novas peças respeitem a direção visual definida."
                    },
                    {
                      id: "proximos",
                      name: "Próximos passos",
                      desc: "Indicação do que deve ser aplicado primeiro conforme o momento e os pontos de contato da marca."
                    }
                  ].map((guide) => {
                    const isSelected = activeGuide === guide.id;

                    return (
                      <button
                        key={guide.id}
                        onClick={() => setActiveGuide(guide.id as typeof activeGuide)}
                        className={`guide-btn min-h-11 p-4 rounded-xl text-left border relative transition-[border-color,background-color,color] duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-brand-secondary/5 border-brand-secondary text-white"
                            : "bg-white/[0.01] border-white/5 text-zinc-400 hover:border-white/10"
                        }`}
                      >
                        <h3 className="text-white text-xs sm:text-sm font-semibold leading-tight">{getBrandingCopy(guide.name, locale)}</h3>
                        <p className="text-zinc-300 text-xs mt-1 leading-snug">{getBrandingCopy(guide.desc, locale)}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-zinc-400 leading-relaxed">
                  {getBrandingCopy("A seleção mostra como a TAG08 traduz a mesma identidade em usos diferentes sem perder clareza.", locale)}
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-center bg-charcoal-950 border border-white/[0.05] rounded-3xl p-6 sm:p-8 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-4">
                  <span className="tag08-meta text-xs text-zinc-300 uppercase tracking-widest font-bold block">
                    {getBrandingCopy("Preview da aplicação", locale)}
                  </span>

                  <div className={guidePreview.card}>
                    <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                      <span className={guidePreview.badge}>
                        {localizedGuidePreview.label}
                      </span>
                      <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      </div>
                    </div>

                    <div className="space-y-4 my-6">
                      <h3 className={guidePreview.title}>
                        {localizedGuidePreview.heading}
                      </h3>
                      <p className={guidePreview.tagline}>
                        {localizedGuidePreview.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-white/[0.05] pt-4 text-xs font-sans">
                      <div>
                        <span className="text-zinc-300 text-xs block uppercase">{getBrandingCopy("O que cobre:", locale)}</span>
                        <p className="text-zinc-300 text-xs whitespace-pre-line mt-1 font-bold leading-normal">
                          {localizedGuidePreview.values}
                        </p>
                      </div>
                      <div>
                        <span className="text-zinc-300 text-xs block uppercase">{getBrandingCopy("Quando usar:", locale)}</span>
                        <p className="text-zinc-300 text-xs mt-1 leading-normal font-sans">
                          {localizedGuidePreview.fit}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 font-sans text-center pt-2">
                    {getBrandingCopy("A ideia aqui é simples: menos improviso, mais repetição consistente do que já foi decidido.", locale)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-3">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-semibold bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                {getBrandingCopy("Os guias que sustentam o uso da marca", locale)}
              </span>
              <h3 className="font-display font-medium text-3xl text-white tracking-tight">
                {getBrandingCopy("O que precisa estar claro antes da marca entrar em circulação", locale)}
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl">
                {getBrandingCopy("Esses blocos resumem o que a TAG08 entrega para reduzir dúvida na hora de aplicar a identidade no dia a dia.", locale)}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: getBrandingCopy("Guia de identidade", locale),
                  focus: "01 // BASE",
                  desc: "Regras essenciais de uso da marca, cores, tipografia, elementos visuais e aplicações."
                },
                {
                  title: getBrandingCopy("Exemplos de aplicação", locale),
                  focus: "02 // USO REAL",
                  desc: "Referências para aplicar a identidade em canais e materiais previstos no escopo."
                },
                {
                  title: getBrandingCopy("Critérios de consistência", locale),
        focus: "03 // PADRÃO",
                  desc: "Orientações para que novas peças respeitem a direção visual definida."
                },
                {
                  title: getBrandingCopy("Próximos passos", locale),
                  focus: "04 // ORDEM",
                  desc: "Indicação do que deve ser aplicado primeiro conforme o momento e os pontos de contato da marca."
                }
              ].map((item, iIdx) => (
                <div key={iIdx} className="p-7 rounded-3xl bg-charcoal-900 border border-white/[0.04] flex flex-col justify-between space-y-6 hover:border-brand-secondary/15 transition-colors duration-200">
                  <div className="space-y-3">
                      <span className="font-sans text-xs text-zinc-300 font-bold block">{getBrandingCopy(item.focus, locale)}</span>
                    <h3 className="text-white font-display font-bold text-sm sm:text-base tracking-tight flex items-center gap-2">
                      {item.title}
                    </h3>
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans">{getBrandingCopy(item.desc, locale)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-7 sm:p-9 rounded-3xl bg-charcoal-900/60 border border-white/[0.05] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

              <div className="lg:col-span-8 space-y-3 relative z-10 text-left">
                <span className="tag08-meta text-xs text-zinc-300 uppercase tracking-widest font-black block">{getBrandingCopy("Próximos passos", locale)}</span>
                <h3 className="text-white font-display font-medium text-lg">{getBrandingCopy("Como colocar a identidade em uso sem bagunçar o sistema", locale)}</h3>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-xl">
                  {getBrandingCopy("Primeiro define-se a base. Depois a identidade entra nas peças que mais aparecem. Em seguida, a TAG08 orienta ajustes e padronização para manter tudo consistente.", locale)}
                </p>
              </div>

              <div className="lg:col-span-4 flex justify-start lg:justify-end relative z-10">
                <button
                  onClick={() => handleLinkClick("/contato")}
                  className="group relative min-h-11 px-6 py-4 bg-brand-secondary hover:bg-brand-dark text-black text-xs font-sans font-bold uppercase tracking-widest rounded-xl transition-colors duration-200 shrink-0 overflow-hidden shadow-[0_8px_30px_rgba(var(--color-brand-secondary-rgb),0.15)] active:scale-[0.98] relative z-10 cursor-pointer"
                >
                    {getBrandingCopy("FALAR COM A TAG08", locale)} <ArrowRight className="w-4 h-4 ml-1.5 inline-block group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="order-9">
        <ServiceInsightsBridge locale={locale} servicePath="/servicos/branding-identidade" onNavigate={onNavigate} />
      </div>

      {/* SECTION - FAQ */}
      <section className="order-10 py-16 sm:py-20 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[40px] bg-charcoal-950 border border-white/[0.04] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta">
                  {getBrandingCopy("Dúvidas sobre branding", locale)}
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-[0.95] tracking-tighter">
                  {getBrandingCopy("Antes de criar uma identidade, entenda o que precisa ser organizado.", locale)}
                </h2>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-sans max-w-sm">
                  {getBrandingCopy("Identidade visual organiza a expressão da marca. Quando a direção, a proposta ou o público ainda não estão claros, o primeiro passo pode vir antes da construção visual.", locale)}
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {faqCopy.questions.map((title, id) => ({ id, title })).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveFaq(item.id)}
                    type="button"
                    aria-expanded={activeFaq === item.id}
                    aria-controls="branding-faq-panel"
                    className={`w-full min-h-11 flex items-center justify-between p-4 rounded-xl border transition-[border-color,background-color,color] duration-200 text-left group cursor-pointer ${
                      activeFaq === item.id
                        ? 'bg-brand text-black border-brand shadow-[0_8px_25px_rgba(var(--color-brand-secondary-rgb),0.12)]'
                        : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
                    }`}
                  >
                    <span className="tag08-meta text-xs font-black uppercase tracking-wider flex items-center gap-3">
                      <span className={activeFaq === item.id ? 'text-black' : 'text-brand'}>
                        {String(item.id + 1).padStart(2, '0')}.
                      </span>
                      {item.title}
                    </span>
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                      activeFaq === item.id ? 'text-black rotate-[-45deg] stroke-[2.5]' : 'text-zinc-300'
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 relative flex flex-col justify-end p-6 min-h-[300px] sm:min-h-[360px] rounded-3xl overflow-hidden border border-white/[0.04] bg-charcoal-950">
              <ResilientImage
                fallbackLabel={locale === "pt" ? "Branding TAG08" : locale === "en" ? "TAG08 branding" : "Branding TAG08"}
                sizes="(max-width: 1024px) 100vw, 34vw"
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800"
                alt={locale === "pt" ? "TAG08 Branding" : locale === "en" ? "TAG08 branding" : "Branding TAG08"}
                className="object-cover grayscale brightness-[0.22] contrast-[1.1] pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                <svg aria-hidden="true" viewBox="0 0 100 100" className="w-full h-full text-brand fill-none stroke-current" strokeWidth="0.75" strokeLinecap="round">
                  <path d="M15,80 C40,40 20,10 60,35 C80,50 30,90 85,15" strokeDasharray="2,2" />
                  <circle cx="85" cy="15" r="1.5" className="fill-brand animate-pulse" />
                </svg>
              </div>
              <div aria-hidden="true" className="absolute top-6 left-6 z-10 pointer-events-none tag08-meta text-xs text-white/50 uppercase tracking-widest leading-none">
                {getBrandingCopy("SYS // BRANDING", locale)}
              </div>

              <div id="branding-faq-panel" role="region" aria-labelledby="branding-faq-panel-heading" aria-live="polite" className="relative z-20 bg-charcoal-900/95 backdrop-blur-2xl border border-white/[0.08] p-5 rounded-2xl space-y-3 shadow-2xl text-left">
                <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-black block">
                  {locale === "pt" ? `Pergunta ${String(activeFaq + 1).padStart(2, "0")}` : locale === "en" ? `Question ${String(activeFaq + 1).padStart(2, "0")}` : `Pregunta ${String(activeFaq + 1).padStart(2, "0")}`}
                </span>

                <h3 id="branding-faq-panel-heading" className="text-white font-semibold text-xs sm:text-sm leading-tight border-b border-white/5 pb-2">
                  {faqCopy.questions[activeFaq]}
                </h3>

                <p className="text-zinc-300 text-xs sm:text-xs leading-relaxed font-sans font-medium">
                  {faqCopy.answers[activeFaq]}
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              <div className="bg-charcoal-900 border border-white/5 rounded-2xl p-5 hover:border-brand/20 transition-colors duration-200 text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-zinc-300 uppercase tracking-widest block font-bold">{getBrandingCopy("GUIA DE IDENTIDADE", locale)}</span>
                  <h3 className="text-white font-semibold text-sm leading-snug">{getBrandingCopy("O que observar antes de fechar o escopo?", locale)}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    {getBrandingCopy("O escopo fica mais preciso quando considera canais, materiais existentes e o que precisa ser organizado primeiro.", locale)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleLinkClick('/servicos')}
                  className="group flex min-h-11 items-center justify-between gap-3 text-xs font-sans font-bold text-white hover:text-brand cursor-pointer select-none pt-2 border-t border-white/5 transition-colors duration-200"
                >
                  <span>{getBrandingCopy("Ver soluções", locale)}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-brand text-black rounded-2xl p-5 transition-colors duration-200 text-left flex flex-col justify-between space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="tag08-meta text-xs text-black/60 uppercase tracking-widest block font-extrabold">{getBrandingCopy("FALE COM A TAG08", locale)}</span>
                  <h3 className="text-black font-black text-sm leading-tight tracking-tight">{getBrandingCopy("Precisa de orientação para o próximo passo?", locale)}</h3>
                  <p className="text-black/85 text-xs font-semibold leading-relaxed font-sans">
                    {getBrandingCopy("A TAG08 pode entender o momento da marca e indicar como estruturar a identidade de forma coerente com o escopo necessário.", locale)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleLinkClick('/contato')}
                  className="group flex min-h-11 items-center justify-between gap-3 text-xs font-sans font-black text-black select-none border-t border-black/10 pt-3 hover:text-black/70 transition-colors duration-200"
                >
                  <span>{getBrandingCopy("Falar com a TAG08", locale)}</span>
                  <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - ACTION TRIGGER FOOTER */}
      <section className="order-11 px-4 sm:px-6 md:px-8 py-14 sm:py-16 text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta mx-auto">
          {getBrandingCopy("Próximo passo", locale)}
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-none tracking-tighter">
          {getBrandingCopy("Vamos entender como sua marca precisa se apresentar?", locale)}
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          {getBrandingCopy("Antes de propor uma identidade visual, a TAG08 entende o momento da marca, seus pontos de contato, a base existente e o que precisa ser organizado para definir um escopo coerente.", locale)}
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => handleLinkClick('/contato')}
            className="group min-h-11 bg-brand text-black font-sans font-black text-xs uppercase tracking-widest py-4 px-8 rounded-full shadow-[0_12px_40px_rgba(var(--color-brand-secondary-rgb),0.22)] hover:bg-brand-dark transition-colors duration-200 active:scale-[0.98] cursor-pointer flex items-center gap-2 justify-center"
          >
            <span>{getBrandingCopy("ORGANIZAR MINHA IDENTIDADE", locale)}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          <button
            onClick={() => handleLinkClick('/servicos')}
            className="group min-h-11 border border-white/10 bg-white/[0.03] text-white font-sans font-black text-xs uppercase tracking-widest py-4 px-8 rounded-full hover:border-white/20 hover:bg-white/[0.06] transition-colors duration-200 active:scale-[0.98] cursor-pointer flex items-center gap-2 justify-center"
          >
            <span>{getBrandingCopy("VER SOLUÇÕES", locale)}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </section>
      {/* IMMERSIVE BRAND PRESENTATION MODAL (Cases focus strategy - placed globally at root with z-[9999] layer security) */}
      <AnimatePresence>
        {selectedWork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto bg-black/95 backdrop-blur-xl cursor-zoom-out"
            onClick={closeSelectedWork}
            data-interaction-exception="modal-backdrop"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-5xl bg-charcoal-950 border border-white/[0.08] rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh] md:max-h-[85vh] text-left cursor-default overflow-y-auto md:overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="branding-work-dialog-title"
            >
              
              {/* Decorative background lights in modal */}
              <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-brand-secondary/[0.02] rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute bottom-[10%] left-[-10%] w-[300px] h-[300px] bg-red-600/[0.01] rounded-full blur-[90px] pointer-events-none" />

              {/* LEFT COLUMN: Media Showcase Frame */}
              <div className="md:w-[42%] bg-zinc-950 border-b md:border-b-0 md:border-r border-white/[0.04] p-6 flex flex-col justify-between relative shrink-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="tag08-meta text-xs bg-white/[0.04] text-zinc-400 font-bold tracking-widest uppercase py-1 px-2.5 rounded-md border border-white/5 select-none">
                      {getBrandingCopy("REFERÊNCIAS VISUAIS // TAG08", locale)}
                    </span>
                    
                    {/* Favorite Heart for interactive feedback */}
                    <div className="flex items-center gap-1.5 font-sans text-xs text-zinc-400 select-none">
                      <button
                        type="button"
                        aria-label={locale === "pt" ? (likedItems[selectedWork.id] ? `Remover ${selectedWork.title} dos favoritos` : `Adicionar ${selectedWork.title} aos favoritos`) : locale === "en" ? (likedItems[selectedWork.id] ? `Remove ${selectedWork.title} from favorites` : `Add ${selectedWork.title} to favorites`) : (likedItems[selectedWork.id] ? `Quitar ${selectedWork.title} de favoritos` : `Añadir ${selectedWork.title} a favoritos`)}
                        aria-pressed={Boolean(likedItems[selectedWork.id])}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeItem(selectedWork.id);
                          // Update selectedWork likes too so state updates reactively
                          setSelectedWork(prev => prev ? {
                            ...prev,
                            likesCount: (prev.likesCount || 0) + (likedItems[prev.id] ? -1 : 1)
                          } : null);
                        }}
                            className={`min-h-11 min-w-11 rounded-lg flex items-center justify-center transition-colors duration-200 bg-white/[0.03] border ${
                          likedItems[selectedWork.id] 
                            ? "border-red-500/30 text-red-100 bg-red-500/10" 
                            : "border-white/5 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${likedItems[selectedWork.id] ? "fill-red-400" : ""}`} />
                      </button>
                      <span>{getBrandingCopy("REFERÊNCIA VISUAL", locale)}</span>
                    </div>
                  </div>

                  {/* Image block in 3:4 perspective aspect ratios */}
                  <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/[0.05] relative group shadow-lg">
                    <ResilientImage
                      fallbackLabel={locale === "pt" ? "Aplicação de identidade visual" : locale === "en" ? "Visual identity application" : "Aplicación de identidad visual"}
                      sizes="(max-width: 768px) 100vw, 40vw"
                      src={selectedWork.imageUrl} 
                      alt={selectedWork.title} 
                      className="object-cover pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Bottom outbound anchor to validation source pin */}
                <div className="pt-6 mt-6 md:mt-0 border-t border-white/[0.04]">
                    <a 
                    href={selectedWork.pinterestUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full min-h-11 bg-red-600 hover:bg-red-700 text-white tag08-action text-xs uppercase tracking-widest font-black py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors duration-200 shadow-[0_4px_15px_rgba(220,38,38,0.25)]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{getBrandingCopy("Ver acervo no Pinterest", locale)}</span>
                  </a>
                </div>
              </div>

              {/* RIGHT COLUMN: Deep Strategic Portfolio Content */}
              <div className="md:w-[58%] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto md:max-h-[85vh] bg-charcoal-950 select-none">
                
                {/* Header line */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                      <span className="tag08-meta text-xs text-brand tracking-widest uppercase font-extrabold">{selectedWork.category}</span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={closeSelectedWork}
                      ref={closeDialogButtonRef}
                      aria-label={getBrandingCopy("Fechar modal", locale)}
                      className="min-h-11 min-w-11 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors duration-200 flex items-center justify-center border border-white/5 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Main Copy Area */}
                  <div className="space-y-4">
                    <h3 id="branding-work-dialog-title" className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-none">
                      {selectedWork.title}
                    </h3>
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium">
                      {selectedWork.description}
                    </p>
                  </div>

                  {/* Deep Strategic Focus (Matching Case Study Detail style) */}
                  <div className="space-y-5 pt-2">
                    
                    {/* O Desafio */}
                    <div className="space-y-1.5 text-left bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl">
                      <h4 className="tag08-meta text-xs text-zinc-400 tracking-widest font-extrabold flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-brand" />
                        {getBrandingCopy("Contexto da marca", locale)}
                      </h4>
                      <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                        {selectedWork.challenge || (locale === "pt" ? "A marca precisava alinhar seus pontos de contato para comunicar com mais clareza, coerência e continuidade." : locale === "en" ? "The brand needed to align its touchpoints to communicate with greater clarity, coherence, and continuity." : "La marca necesitaba alinear sus puntos de contacto para comunicar con mayor claridad, coherencia y continuidad.")}
                      </p>
                    </div>

                    {/* A Solução */}
                    <div className="space-y-1.5 text-left bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl">
                      <h4 className="tag08-meta text-xs text-zinc-400 tracking-widest font-extrabold flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-brand" />
                        {getBrandingCopy("Direção visual", locale)}
                      </h4>
                      <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                        {selectedWork.solution || (locale === "pt" ? "Organizamos elementos visuais, linguagem e aplicação para sustentar uma percepção mais coerente da marca." : locale === "en" ? "We organized visual elements, language, and applications to support a more coherent brand perception." : "Organizamos elementos visuales, lenguaje y aplicaciones para respaldar una percepción más coherente de la marca.")}
                      </p>
                    </div>

                    {/* Visual System parameters (Interactive Color chips) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Color Palette area */}
                      <div className="space-y-2 bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl text-left">
                        <h4 className="tag08-meta text-xs text-zinc-400 tracking-widest font-extrabold flex items-center gap-2">
                          <Palette className="w-3.5 h-3.5 text-brand" />
                          {getBrandingCopy("Paleta de Cores", locale)}
                        </h4>
                        <div className="flex flex-wrap gap-2.5 pt-1">
                          {(selectedWork.colors || ["#0D0D11", "#C5A880", "#FFFFFF"]).map((col, idx) => {
                            const name = selectedWork.colorNames ? selectedWork.colorNames[idx] : col;
                            return (
                              <button
                                type="button"
                                key={col} 
                                className="group/chip flex min-h-11 items-center gap-1.5 bg-black/40 border border-white/5 py-1 px-2.5 rounded-lg text-xs font-sans text-zinc-300 relative cursor-pointer active:scale-95 transition-colors duration-200"
                                onClick={() => {
                                  navigator.clipboard.writeText(col);
                                }}
                                title={locale === "pt" ? `Clique para copiar Hex ${col}` : locale === "en" ? `Click to copy hex ${col}` : `Haz clic para copiar el hex ${col}`}
                              >
                                <span className="w-2.5 h-2.5 rounded-full border border-white/10 shrink-0" style={{ backgroundColor: col }} />
                                <span className="group-hover/chip:text-brand transition-colors font-medium">{name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Typography selection */}
                      <div className="space-y-2 bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl text-left flex flex-col justify-center">
                        <h4 className="tag08-meta text-xs text-zinc-400 tracking-widest font-extrabold flex items-center gap-2">
                          <Type className="w-3.5 h-3.5 text-brand" />
                          {getBrandingCopy("Tipografia aplicada", locale)}
                        </h4>
                        <p className="text-brand font-display font-black text-xs uppercase tracking-wide pt-0.5">
                          {selectedWork.typography || "Space Grotesk & Inter Modern"}
                        </p>
                      </div>

                    </div>

                    {/* Success / Metric Indicators */}
                    <div className="bg-brand/[0.03] border border-brand-secondary/15 p-4 rounded-xl text-left space-y-1">
                      <span className="tag08-meta text-xs bg-brand-secondary/10 text-brand-secondary uppercase tracking-widest font-black px-2.5 py-0.5 rounded border border-brand-secondary/10 inline-block">
                        {getBrandingCopy("CRITÉRIO VISUAL", locale)}
                      </span>
                      <p className="text-zinc-200 text-xs font-sans font-medium flex items-center gap-1.5 pt-1">
                        <TrendingUp className="w-4 h-4 text-brand shrink-0" />
                        {selectedWork.achievement || (locale === "pt" ? "Aplicação pensada para manter unidade entre marca, linguagem e pontos de contato." : locale === "en" ? "Application designed to maintain unity across the brand, language, and touchpoints." : "Aplicación pensada para mantener la unidad entre la marca, el lenguaje y los puntos de contacto.")}
                      </p>
                    </div>

                    {/* Deliverables lists */}
                    <div className="text-left space-y-2">
                      <h4 className="tag08-meta text-xs text-zinc-300 tracking-widest font-extrabold">{getBrandingCopy("Aplicações da marca:", locale)}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {(selectedWork.deliverables || ["Diretrizes visuais", "Aplicações digitais", "Peças de marca", "Guia de uso"]).map((deliv, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-zinc-400 font-sans font-medium">
                            <CheckCircle className="w-3.5 h-3.5 text-brand shrink-0 stroke-[2.5]" />
                            <span>{deliv}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* WhatsApp CTA for portfolio contact */}
                <div className="pt-6 mt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center gap-4">
                  
                  <a 
                    href={buildBrazilWhatsAppUrl("Olá TAG08! Estava analisando uma referência visual de Branding e gostaria de entender como a TAG08 pode organizar a identidade da minha marca.")}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleOutboundClick("WhatsApp", buildBrazilWhatsAppUrl("Olá TAG08! Estava analisando uma referência visual de Branding e gostaria de entender como a TAG08 pode organizar a identidade da minha marca."), "branding-work-case-br")}
                    className="w-full min-h-11 sm:flex-1 bg-brand hover:bg-brand-dark text-black font-sans text-xs uppercase tracking-widest font-black py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 shadow-[0_4px_22px_rgba(var(--color-brand-secondary-rgb),0.2)] cursor-pointer text-center"
                  >
                    <span>{getBrandingCopy("Organizar minha identidade", locale)}</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </a>

                  <button
                    onClick={closeSelectedWork}
                    className="w-full min-h-11 sm:w-auto font-sans text-xs uppercase tracking-wider text-zinc-300 hover:text-white border border-white/5 py-4 px-6 rounded-xl cursor-pointer"
                  >
                    {getBrandingCopy("Fechar modal", locale)}
                  </button>

                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


