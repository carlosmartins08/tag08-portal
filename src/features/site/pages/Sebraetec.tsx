import { useState } from "react";
import { Sparkles, ArrowUpRight, ArrowRight, Layers, FileText, Zap, HelpCircle } from "../../../components/DooIcons";
import { useReducedMotion } from "motion/react";
import ResilientImage from "../../../components/ResilientImage";
import ThreeDimensionalTilt from "../../../components/ThreeDimensionalTilt";
import Subtle3DCanvas from "../../../components/Subtle3DCanvas";
import { buildBrazilWhatsAppUrl } from "../../../config/siteNetwork";
import TrackedOutboundLink from "../../../components/TrackedOutboundLink";
import type { RouteLocale } from "../../../config/routeRegistry";

interface SebraetecProps {
  onNavigate: (page: string) => void;
  locale?: RouteLocale;
}

const SEBRAETEC_COPY: Record<string, { en: string; es: string }> = {
  "SEBRAETEC + TAG08": { en: "SEBRAETEC + TAG08", es: "SEBRAETEC + TAG08" },
  "O que é o Programa SEBRAETEC?": { en: "What is the SEBRAETEC Program?", es: "¿Qué es el Programa SEBRAETEC?" },
  "O Sebrae pode subsidiar parte de um projeto, conforme as regras, a disponibilidade e a aprovação aplicáveis na região. Consulte as condições vigentes do Sebraetec diretamente com o Sebrae da sua região.": { en: "Sebrae may subsidize part of a project, subject to the rules, availability, and approval applicable in the region. Check current SEBRAETEC conditions directly with the Sebrae office in your region.", es: "Sebrae puede subsidiar parte de un proyecto, según las reglas, la disponibilidad y la aprobación aplicables en la región. Consulta las condiciones vigentes de Sebraetec directamente con la oficina de Sebrae de tu región." },
  "Quem pode se beneficiar do subsídio?": { en: "Who may qualify for the subsidy?", es: "¿Quién puede beneficiarse del subsidio?" },
  "A elegibilidade depende das regras vigentes do Sebrae da região, do perfil da empresa e do projeto, da disponibilidade e da análise do Sebrae. Consulte as condições aplicáveis diretamente com o Sebrae da sua região.": { en: "Eligibility depends on the current rules of the regional Sebrae office, the company and project profile, availability, and Sebrae's assessment. Check the applicable conditions directly with the Sebrae office in your region.", es: "La elegibilidad depende de las reglas vigentes de la oficina regional de Sebrae, del perfil de la empresa y del proyecto, de la disponibilidad y del análisis de Sebrae. Consulta las condiciones aplicables directamente con la oficina de Sebrae de tu región." },
  "Quais serviços da TAG08 podem receber o subsídio SEBRAETEC?": { en: "Which TAG08 services may be eligible for SEBRAETEC support?", es: "¿Qué servicios de TAG08 pueden recibir el subsidio SEBRAETEC?" },
  "A disponibilidade de serviços e projetos depende das regras vigentes do Sebrae da região e da análise do escopo. Confirme com o Sebrae da sua região quais serviços podem ser considerados antes de tratar qualquer oferta como elegível.": { en: "Service and project availability depends on current regional Sebrae rules and scope assessment. Confirm with your regional Sebrae office which services may be considered before treating any offer as eligible.", es: "La disponibilidad de servicios y proyectos depende de las reglas vigentes de Sebrae en la región y del análisis del alcance. Confirma con la oficina de Sebrae de tu región qué servicios pueden considerarse antes de tratar una oferta como elegible." },
  "Como funciona o fluxo de aprovação?": { en: "How does the approval process work?", es: "¿Cómo funciona el proceso de aprobación?" },
  "Realizamos uma reunião inicial, estruturamos a proposta técnica conforme as diretrizes aplicáveis e encaminhamos o material ao Sebrae regional. Se o projeto for aprovado, o início, a contrapartida e as demais condições de pagamento seguem o regulamento e o plano aprovados.": { en: "We hold an initial meeting, prepare the technical proposal according to applicable guidelines, and submit the materials to the regional Sebrae office. If the project is approved, its start, counterpart contribution, and other payment conditions follow the approved rules and plan.", es: "Realizamos una reunión inicial, estructuramos la propuesta técnica según las directrices aplicables y enviamos el material a la oficina regional de Sebrae. Si se aprueba el proyecto, el inicio, la contrapartida y las demás condiciones de pago se rigen por el reglamento y el plan aprobados." },
  "A TAG08 ajuda no processo de solicitação ao Sebrae?": { en: "Does TAG08 help with the application to Sebrae?", es: "¿TAG08 ayuda con la solicitud a Sebrae?" },
  "Sim, oferecemos suporte consultivo e auxiliamos na estruturação técnica da proposta e na organização dos documentos para avaliação pelo gestor responsável do Sebrae.": { en: "Yes. We provide advisory support and help structure the technical proposal and organize documents for assessment by the responsible Sebrae manager.", es: "Sí. Ofrecemos asesoría y ayudamos a estructurar la propuesta técnica y organizar los documentos para que los evalúe la persona responsable de Sebrae." },
  "ORIENTAÇÃO SOBRE CONDIÇÕES REGIONAIS // SEBRAETEC": { en: "GUIDANCE ON REGIONAL CONDITIONS // SEBRAETEC", es: "ORIENTACIÓN SOBRE CONDICIONES REGIONALES // SEBRAETEC" },
  "Consulte as condições vigentes na sua região.": { en: "Check the current conditions in your region.", es: "Consulta las condiciones vigentes en tu región." },
  "O Sebrae pode subsidiar parte do projeto, conforme regras, disponibilidade e aprovação aplicáveis na sua região. Consulte as condições vigentes do Sebraetec junto ao Sebrae da sua região.": { en: "Sebrae may subsidize part of the project, subject to the rules, availability, and approval applicable in your region. Check current SEBRAETEC conditions with the Sebrae office in your region.", es: "Sebrae puede subsidiar parte del proyecto, según las reglas, disponibilidad y aprobación aplicables en tu región. Consulta las condiciones vigentes de Sebraetec con la oficina de Sebrae de tu región." },
  "Equipe reunida em uma conversa sobre inovação e negócios": { en: "Team meeting to discuss innovation and business", es: "Equipo reunido para conversar sobre innovación y negocios" },
  "Inovação aplicada com a TAG08": { en: "Innovation put into practice with TAG08", es: "Innovación aplicada con TAG08" },
  "Consultar condições do Sebraetec": { en: "Check SEBRAETEC conditions", es: "Consultar las condiciones de Sebraetec" },
  "Olá,%20gostaria%20de%20consultar%20as%20condições%20vigentes%20do%20Sebraetec%20na%20minha%20região.": { en: "Hello,%20I%20would%20like%20to%20check%20the%20current%20SEBRAETEC%20conditions%20in%20my%20region.", es: "Hola,%20quisiera%20consultar%20las%20condiciones%20vigentes%20de%20Sebraetec%20en%20mi%20región." },
  "CONSULTAR CONDIÇÕES VIGENTES": { en: "CHECK CURRENT CONDITIONS", es: "CONSULTAR CONDICIONES VIGENTES" },
  "TAG08 HUB INTEGRADO": { en: "TAG08 INTEGRATED HUB", es: "ECOSISTEMA INTEGRADO TAG08" },
  "Inovação tecnológica com direção": { en: "Technology innovation with direction", es: "Innovación tecnológica con dirección" },
  "PROGRAMA SEBRAETEC": { en: "SEBRAETEC PROGRAM", es: "PROGRAMA SEBRAETEC" },
  "Variável": { en: "Variable", es: "Variable" },
  "Percentual de apoio": { en: "Support percentage", es: "Porcentaje de apoyo" },
  "definido no projeto": { en: "defined in the project", es: "definido en el proyecto" },
  "Definida": { en: "Defined", es: "Definida" },
  "Contrapartida conforme": { en: "Counterpart contribution under", es: "Contrapartida según" },
  "as regras aplicáveis": { en: "applicable rules", es: "las reglas aplicables" },
  "Perfil regional": { en: "Regional profile", es: "Perfil regional" },
  "Elegibilidade definida": { en: "Eligibility determined", es: "Elegibilidad definida" },
  "pelo Sebrae da região": { en: "by the regional Sebrae office", es: "por Sebrae de la región" },
  "Sob análise": { en: "Under review", es: "En evaluación" },
  "Serviços conforme regras,": { en: "Services subject to rules,", es: "Servicios según las reglas," },
  "disponibilidade e aprovação": { en: "availability, and approval", es: "disponibilidad y aprobación" },
  "VIABILIZAÇÃO // BENEFÍCIOS REAIS": { en: "FEASIBILITY // PRACTICAL BENEFITS", es: "VIABILIDAD // BENEFICIOS REALES" },
  "Por que usar o Sebraetec em seu projeto?": { en: "Why consider SEBRAETEC for your project?", es: "¿Por qué considerar Sebraetec para tu proyecto?" },
  "O Sebrae pode subsidiar parte do projeto, conforme regras, disponibilidade e aprovação aplicáveis na sua região. Consulte as condições vigentes diretamente com o Sebrae regional.": { en: "Sebrae may subsidize part of the project, subject to the rules, availability, and approval applicable in your region. Check current conditions directly with your regional Sebrae office.", es: "Sebrae puede subsidiar parte del proyecto, según las reglas, disponibilidad y aprobación aplicables en tu región. Consulta las condiciones vigentes directamente con la oficina regional de Sebrae." },
  "IMPACTO FINANCEIRO:": { en: "FINANCIAL IMPACT:", es: "IMPACTO FINANCIERO:" },
  "Um projeto de R$ 10.000,00 é apenas uma simulação ilustrativa. O valor da contrapartida e a forma de pagamento devem ser confirmados no projeto aprovado.": { en: "A R$ 10,000.00 project is only an illustrative example. The counterpart contribution and payment terms must be confirmed in the approved project.", es: "Un proyecto de R$ 10.000,00 es solo un ejemplo ilustrativo. La contrapartida y la forma de pago deben confirmarse en el proyecto aprobado." },
  "Acesso a diagnóstico e execução de branding, web e processos dentro de um projeto estruturado.": { en: "Access to assessment and branding, web, and process execution within a structured project.", es: "Acceso al diagnóstico y a la ejecución de branding, web y procesos dentro de un proyecto estructurado." },
  "Proposta técnica organizada para avaliação conforme as diretrizes aplicáveis do Sebrae.": { en: "A technical proposal organized for review under applicable Sebrae guidelines.", es: "Una propuesta técnica organizada para evaluación según las directrices aplicables de Sebrae." },
  "Acompanhamento da documentação e das etapas que dependem do projeto e da região.": { en: "Support with documentation and steps that depend on the project and region.", es: "Acompañamiento de la documentación y de las etapas que dependen del proyecto y la región." },
  "Mais clareza para decidir quais frentes de inovação fazem sentido para o momento da empresa.": { en: "Greater clarity when deciding which innovation initiatives fit the company's current needs.", es: "Más claridad para decidir qué iniciativas de innovación son adecuadas para el momento de la empresa." },
  "Uma entrega digital planejada para apoiar a presença e a operação do negócio.": { en: "A digital deliverable planned to support the business's presence and operations.", es: "Una entrega digital planificada para apoyar la presencia y la operación del negocio." },
  "VALIDAÇÃO REGIONAL": { en: "REGIONAL VERIFICATION", es: "VALIDACIÓN REGIONAL" },
  "AS CONDIÇÕES DO ": { en: "SEBRAETEC CONDITIONS ", es: "LAS CONDICIONES DE SEBRAETEC " },
  "SEBRAETEC VARIAM POR REGIÃO.": { en: "VARY BY REGION.", es: "VARÍAN SEGÚN LA REGIÓN." },
  "Elegibilidade, documentação, serviços contemplados, disponibilidade e limites dependem das regras vigentes do Sebrae regional. Confirme esses requisitos com a unidade responsável antes de iniciar uma proposta.": { en: "Eligibility, documentation, covered services, availability, and limits depend on the current rules of the regional Sebrae office. Confirm these requirements with the responsible office before preparing a proposal.", es: "La elegibilidad, la documentación, los servicios contemplados, la disponibilidad y los límites dependen de las reglas vigentes de la oficina regional de Sebrae. Confirma estos requisitos con la unidad responsable antes de iniciar una propuesta." },
  "01 // ELEGIBILIDADE": { en: "01 // ELIGIBILITY", es: "01 // ELEGIBILIDAD" },
  "Confirme o perfil atendido": { en: "Confirm the eligible profile", es: "Confirma el perfil admitido" },
  "O enquadramento da empresa e do projeto deve ser confirmado diretamente com o Sebrae da sua região.": { en: "The company's and project's eligibility must be confirmed directly with the Sebrae office in your region.", es: "La clasificación de la empresa y del proyecto debe confirmarse directamente con la oficina de Sebrae de tu región." },
  "02 // DOCUMENTAÇÃO": { en: "02 // DOCUMENTATION", es: "02 // DOCUMENTACIÓN" },
  "Consulte a lista vigente": { en: "Check the current list", es: "Consulta la lista vigente" },
  "Os documentos e comprovantes exigidos dependem das regras atuais da unidade responsável. Não inicie o protocolo com base em uma lista genérica.": { en: "Required documents and supporting records depend on the responsible office's current rules. Do not start the application using a generic list.", es: "Los documentos y comprobantes exigidos dependen de las reglas actuales de la unidad responsable. No inicies el trámite basándote en una lista genérica." },
  "03 // SERVIÇOS E DISPONIBILIDADE": { en: "03 // SERVICES AND AVAILABILITY", es: "03 // SERVICIOS Y DISPONIBILIDAD" },
  "Verifique o escopo regional": { en: "Verify the regional scope", es: "Verifica el alcance regional" },
  "Serviços contemplados, limites e disponibilidade precisam ser confirmados com o Sebrae regional para cada projeto.": { en: "Covered services, limits, and availability must be confirmed with the regional Sebrae office for each project.", es: "Los servicios contemplados, los límites y la disponibilidad deben confirmarse con Sebrae regional para cada proyecto." },
  "04 // APOIO COOPERATIVO": { en: "04 // COORDINATED SUPPORT", es: "04 // APOYO COORDINADO" },
  "Suporte da equipe técnica": { en: "Support from the technical team", es: "Apoyo del equipo técnico" },
  "A TAG08 pode apoiar a estruturação técnica após confirmar a aderência do serviço e as condições aplicáveis com o Sebrae regional.": { en: "TAG08 may support the technical proposal after confirming service fit and applicable conditions with the regional Sebrae office.", es: "TAG08 puede apoyar la estructuración técnica después de confirmar con Sebrae regional la pertinencia del servicio y las condiciones aplicables." },
  "CAPACIDADES DA TAG08": { en: "TAG08 CAPABILITIES", es: "CAPACIDADES DE TAG08" },
  "Frentes que podem ser avaliadas conforme as regras regionais": { en: "Initiatives that may be assessed under regional rules", es: "Iniciativas que pueden evaluarse según las reglas regionales" },
  "O Sebrae define quais serviços podem ser considerados, conforme as regras vigentes, disponibilidade e análise regional do projeto. Os exemplos abaixo descrevem capacidades da TAG08 e não confirmam cobertura ou elegibilidade no programa.": { en: "Sebrae determines which services may be considered, based on current rules, availability, and regional project assessment. The examples below describe TAG08 capabilities and do not confirm program coverage or eligibility.", es: "Sebrae determina qué servicios pueden considerarse según las reglas vigentes, la disponibilidad y el análisis regional del proyecto. Los siguientes ejemplos describen capacidades de TAG08 y no confirman cobertura ni elegibilidad en el programa." },
  "Branding & marca visual": { en: "Branding & visual identity", es: "Branding e identidad visual" },
  "Criação de logotipo vetorial profissional, reformulação de manual de identidade, escolha unificada de cores institucionais, diagramação de propostas comerciais de luxo e papelaria digital completa.": { en: "Professional vector logo creation, identity guide updates, coordinated institutional color selection, layout for premium sales proposals, and complete digital stationery.", es: "Creación profesional de logotipos vectoriales, actualización del manual de identidad, selección unificada de colores institucionales, diseño de propuestas comerciales prémium y papelería digital completa." },
  "Embalagem & design de rótulo": { en: "Packaging & label design", es: "Envases y diseño de etiquetas" },
  "Criação técnica tridimensional e conceitual de embalagens, rótulos comerciais, caixas de entrega exclusivas e fitas adesivas estéticas para e-commerces que precisam reter a valorização do cliente.": { en: "Technical and conceptual 3D packaging design, commercial labels, distinctive delivery boxes, and branded adhesive tape for e-commerce businesses seeking to reinforce customer value.", es: "Diseño técnico y conceptual tridimensional de envases, etiquetas comerciales, cajas de entrega exclusivas y cintas adhesivas estéticas para comercios electrónicos que buscan reforzar el valor para sus clientes." },
  "Websites & landing pages": { en: "Websites & landing pages", es: "Sitios web y landing pages" },
  "Desenvolvimento sob medida de sites corporativos de alta performance, landing pages otimizadas de captura de leads estruturadas sem templates repetitivos de mercado e com código leve.": { en: "Custom development of high-performance corporate websites and optimized lead-capture landing pages, built without repetitive market templates and with lightweight code.", es: "Desarrollo a medida de sitios corporativos de alto rendimiento y landing pages optimizadas para captar leads, sin plantillas repetitivas del mercado y con código ligero." },
  "E-commerces & sistemas": { en: "E-commerce & systems", es: "Comercio electrónico y sistemas" },
  "Lojas virtuais elegantes integradas de ponta a ponta com gateways de pagamento seguros, sistemas consultivos de catálogos interativos estruturados e integrações automatizadas ERP de controle comercial.": { en: "Refined online stores integrated end to end with secure payment gateways, structured interactive catalogs, and automated ERP integrations for commercial operations.", es: "Tiendas en línea elegantes integradas de principio a fin con pasarelas de pago seguras, catálogos interactivos estructurados e integraciones automatizadas de ERP para la gestión comercial." },
  "JORNADA DO CLIENTE // FLUXO SEGURO": { en: "CLIENT JOURNEY // CONTROLLED PROCESS", es: "RECORRIDO DEL CLIENTE // PROCESO CONTROLADO" },
  "Como consultar as condições do Sebraetec": { en: "How to check SEBRAETEC conditions", es: "Cómo consultar las condiciones de Sebraetec" },
  "A TAG08 pode apoiar a estruturação técnica da proposta. A elegibilidade, a aprovação, a disponibilidade e as condições são definidas pelo Sebrae da região.": { en: "TAG08 may support the technical proposal. Eligibility, approval, availability, and conditions are determined by the Sebrae office in the region.", es: "TAG08 puede apoyar la estructuración técnica de la propuesta. La elegibilidad, la aprobación, la disponibilidad y las condiciones las define Sebrae en la región." },
  "DIAGNÓSTICO INICIAL": { en: "INITIAL ASSESSMENT", es: "DIAGNÓSTICO INICIAL" },
  "Conversa para compreender a necessidade e avaliar se há um caminho compatível com o programa e as regras da sua região.": { en: "A conversation to understand the need and assess whether there may be a path compatible with the program and the rules in your region.", es: "Una conversación para comprender la necesidad y evaluar si existe una alternativa compatible con el programa y las reglas de tu región." },
  "PROPOSTA TÉCNICA": { en: "TECHNICAL PROPOSAL", es: "PROPUESTA TÉCNICA" },
  "Quando a participação da TAG08 e o serviço forem confirmados como aplicáveis, estruturamos o escopo e os materiais técnicos para avaliação conforme as diretrizes vigentes.": { en: "If TAG08's participation and the service are confirmed as applicable, we prepare the scope and technical materials for review under current guidelines.", es: "Cuando se confirme que la participación de TAG08 y el servicio son aplicables, estructuramos el alcance y los materiales técnicos para su evaluación según las directrices vigentes." },
  "ENVIO & ANÁLISE": { en: "SUBMISSION & REVIEW", es: "ENVÍO Y ANÁLISIS" },
  "Se a participação da TAG08 e o serviço forem confirmados como aplicáveis, a proposta poderá ser encaminhada ao Sebrae regional para avaliação.": { en: "If TAG08's participation and the service are confirmed as applicable, the proposal may be submitted to the regional Sebrae office for review.", es: "Si se confirma que la participación de TAG08 y el servicio son aplicables, la propuesta podrá enviarse a Sebrae regional para su evaluación." },
  "EXECUÇÃO DO PROJETO": { en: "PROJECT DELIVERY", es: "EJECUCIÓN DEL PROYECTO" },
  "Com a aprovação e as condições confirmadas, iniciamos o projeto conforme o escopo acordado.": { en: "Once approval and conditions are confirmed, we begin the project according to the agreed scope.", es: "Una vez confirmadas la aprobación y las condiciones, iniciamos el proyecto según el alcance acordado." },
  "ENTREGA E PRESTAÇÃO DE CONTAS": { en: "DELIVERY & REPORTING", es: "ENTREGA Y RENDICIÓN DE CUENTAS" },
  "Quando essa participação for confirmada, a execução e a documentação seguem as etapas aplicáveis definidas para o projeto.": { en: "Once this participation is confirmed, delivery and documentation follow the applicable steps defined for the project.", es: "Cuando se confirme esta participación, la ejecución y la documentación seguirán las etapas aplicables definidas para el proyecto." },
  "IR PARA O CONTATO": { en: "GO TO CONTACT", es: "IR A CONTACTO" },
  "DÚVIDAS FREQUENTES SOBRE SEBRAETEC": { en: "FREQUENT QUESTIONS ABOUT SEBRAETEC", es: "PREGUNTAS FRECUENTES SOBRE SEBRAETEC" },
  "Entenda os limites de atuação da TAG08 e confirme as regras e condições vigentes diretamente com o Sebrae da sua região.": { en: "Understand TAG08's role and confirm current rules and conditions directly with the Sebrae office in your region.", es: "Conoce el alcance de TAG08 y confirma las reglas y condiciones vigentes directamente con la oficina de Sebrae de tu región." },
  "FALE COM A TAG08 SOBRE A VIABILIDADE": { en: "TALK TO TAG08 ABOUT FEASIBILITY", es: "HABLA CON TAG08 SOBRE LA VIABILIDAD" },
  "PRONTO PARA AVALIAR ": { en: "READY TO ASSESS ", es: "¿LISTO PARA EVALUAR " },
  "SEU PROJETO COM O SEBRAETEC?": { en: "YOUR PROJECT WITH SEBRAETEC?", es: "TU PROYECTO CON SEBRAETEC?" },
  "A TAG08 pode ajudar a estruturar o diagnóstico e a proposta técnica. A elegibilidade, o percentual de apoio e a aprovação são definidos pelo Sebrae regional.": { en: "TAG08 can help structure the assessment and technical proposal. Eligibility, the support percentage, and approval are determined by the regional Sebrae office.", es: "TAG08 puede ayudar a estructurar el diagnóstico y la propuesta técnica. Sebrae regional define la elegibilidad, el porcentaje de apoyo y la aprobación." },
  "Consultar condições com o Sebrae regional": { en: "Check conditions with the regional Sebrae office", es: "Consultar las condiciones con Sebrae regional" },
  "Olá,%20acabei%20de%20acessar%20a%20página%20do%20SEBRAETEC%20e%20gostaria%20de%20verificar%20a%20elegibilidade%20e%20a%20viabilidade%20do%20meu%20projeto%20conforme%20as%20regras%20da%20minha%20região.": { en: "Hello,%20I%20just%20visited%20the%20SEBRAETEC%20page%20and%20would%20like%20to%20check%20my%20project's%20eligibility%20and%20feasibility%20under%20the%20rules%20in%20my%20region.", es: "Hola,%20acabo%20de%20visitar%20la%20página%20de%20Sebraetec%20y%20quisiera%20verificar%20la%20elegibilidad%20y%20viabilidad%20de%20mi%20proyecto%20según%20las%20reglas%20de%20mi%20región." },
  "CONSULTAR CONDIÇÕES REGIONAIS": { en: "CHECK REGIONAL CONDITIONS", es: "CONSULTAR CONDICIONES REGIONALES" }
};

const localizeSebraetec = (source: string, locale: RouteLocale): string => {
  if (locale === "pt") return source;
  const translated = SEBRAETEC_COPY[source]?.[locale];
  if (!translated) throw new Error(`Missing ${locale} Sebraetec copy for: ${source}`);
  return translated;
};

export default function Sebraetec({ onNavigate, locale = "pt" }: SebraetecProps) {
  const t = (source: string) => localizeSebraetec(source, locale);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const prefersReducedMotion = useReducedMotion();

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  const faqs = [
    {
      q: t("O que é o Programa SEBRAETEC?"),
      a: t("O Sebrae pode subsidiar parte de um projeto, conforme as regras, a disponibilidade e a aprovação aplicáveis na região. Consulte as condições vigentes do Sebraetec diretamente com o Sebrae da sua região.")
    },
    {
      q: t("Quem pode se beneficiar do subsídio?"),
      a: t("A elegibilidade depende das regras vigentes do Sebrae da região, do perfil da empresa e do projeto, da disponibilidade e da análise do Sebrae. Consulte as condições aplicáveis diretamente com o Sebrae da sua região.")
    },
    {
      q: t("Quais serviços da TAG08 podem receber o subsídio SEBRAETEC?"),
      a: t("A disponibilidade de serviços e projetos depende das regras vigentes do Sebrae da região e da análise do escopo. Confirme com o Sebrae da sua região quais serviços podem ser considerados antes de tratar qualquer oferta como elegível.")
    },
    {
      q: t("Como funciona o fluxo de aprovação?"),
      a: t("Realizamos uma reunião inicial, estruturamos a proposta técnica conforme as diretrizes aplicáveis e encaminhamos o material ao Sebrae regional. Se o projeto for aprovado, o início, a contrapartida e as demais condições de pagamento seguem o regulamento e o plano aprovados.")
    },
    {
      q: t("A TAG08 ajuda no processo de solicitação ao Sebrae?"),
      a: t("Sim, oferecemos suporte consultivo e auxiliamos na estruturação técnica da proposta e na organização dos documentos para avaliação pelo gestor responsável do Sebrae.")
    }
  ];

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Ambient gradients */}
      <div className="absolute top-[8%] left-[-15%] w-[600px] h-[600px] bg-brand/[0.015] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] bg-brand/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Floating 3D background elements */}
      <Subtle3DCanvas intensity={1.5} className="absolute right-[-8%] top-[5%] w-[480px] h-[480px] opacity-[0.35] mix-blend-screen hidden lg:block" />

      {/* HERO SECTION */}
      <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline text-left">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-black font-semibold text-xs rounded-lg uppercase tracking-widest tag08-meta self-start">
                {t("ORIENTAÇÃO SOBRE CONDIÇÕES REGIONAIS // SEBRAETEC")}</div>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.0] tracking-tighter">
                {t("SEBRAETEC + TAG08")}<br />
                <span className="text-brand-secondary">{t("Consulte as condições vigentes na sua região.")}</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-zinc-400 text-xs sm:text-sm md:text-sm leading-relaxed font-sans font-medium">
                {t("O Sebrae pode subsidiar parte do projeto, conforme regras, disponibilidade e aprovação aplicáveis na sua região. Consulte as condições vigentes do Sebraetec junto ao Sebrae da sua região.")}</p>
            </div>
          </div>

          {/* Banner with absolute interactive overlay triggers */}
          <ThreeDimensionalTilt className="rounded-[24px] sm:rounded-[36px] overflow-visible">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden aspect-[4/3] sm:aspect-[2.39/1] bg-charcoal-900 border border-white/[0.08] shadow-2xl group text-left h-full w-full">
              <ResilientImage
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1280px"
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1600"
                alt={t("Equipe reunida em uma conversa sobre inovação e negócios")}
                fallbackLabel={t("Inovação aplicada com a TAG08")}
                className="object-cover grayscale brightness-40 transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.01]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent pointer-events-none" />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{ transform: "translateZ(45px)" }}>
                <TrackedOutboundLink
                  label={t("Consultar condições do Sebraetec")}
                  surface="sebraetec-hero-cta"
                  href={buildBrazilWhatsAppUrl(t("Olá,%20gostaria%20de%20consultar%20as%20condições%20vigentes%20do%20Sebraetec%20na%20minha%20região."))}
                  target="_blank"
                  rel="noreferrer"
                  className="group min-h-11 bg-brand-secondary text-black font-sans font-black text-xs uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.35)] motion-safe:hover:scale-105 transition-[background-color,box-shadow,transform] duration-200 border border-brand-secondary hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-black flex items-center gap-2 cursor-pointer z-20"
                >
                  <span>{t("CONSULTAR CONDIÇÕES VIGENTES")}</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </TrackedOutboundLink>
              </div>

              {/* Absolutes tags in corners */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 pointer-events-none" style={{ transform: "translateZ(25px)" }}>
                <div className="space-y-1">
                  <span className="tag08-meta text-xs text-brand-secondary tracking-widest block uppercase font-bold">{t("TAG08 HUB INTEGRADO")}</span>
                  <p className="font-display font-black text-white text-xs sm:text-sm tracking-tight leading-none">{t("Inovação tecnológica com direção")}</p>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/5 px-2.5 py-1.5 rounded-xl font-sans text-xs text-zinc-400 flex items-center gap-1.5 select-none hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand motion-safe:animate-pulse" aria-hidden="true" />
                  <span>{t("PROGRAMA SEBRAETEC")}</span>
                </div>
              </div>
            </div>
          </ThreeDimensionalTilt>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4 text-left border-t border-white/[0.04]">
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">{t("Variável")}</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">{t("Percentual de apoio")}<br/>{t("definido no projeto")}</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand-secondary">{t("Definida")}</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">{t("Contrapartida conforme")}<br/>{t("as regras aplicáveis")}</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-white">{t("Perfil regional")}</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">{t("Elegibilidade definida")}<br/>{t("pelo Sebrae da região")}</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display font-black text-3xl sm:text-4xl text-brand">{t("Sob análise")}</span>
              <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-widest leading-normal">{t("Serviços conforme regras,")}<br/>{t("disponibilidade e aprovação")}</span>
            </div>
          </div>

        </div>
      </section>

      {/* WHY SEBRAETEC? */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-950 text-left relative overflow-hidden">
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/[0.01] rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
                {t("VIABILIZAÇÃO // BENEFÍCIOS REAIS")}</span>
              <h2 className="font-display font-medium text-3xl text-white tracking-tight">
                {t("Por que usar o Sebraetec em seu projeto?")}</h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                {t("O Sebrae pode subsidiar parte do projeto, conforme regras, disponibilidade e aprovação aplicáveis na sua região. Consulte as condições vigentes diretamente com o Sebrae regional.")}</p>
              
              <div className="p-5 rounded-2xl bg-brand-secondary/[0.01] border border-brand-secondary/5 text-xs text-zinc-400 font-sans">
                <span className="text-brand-secondary font-black uppercase block mb-1">{t("IMPACTO FINANCEIRO:")}</span>
                {t("Um projeto de R$ 10.000,00 é apenas uma simulação ilustrativa. O valor da contrapartida e a forma de pagamento devem ser confirmados no projeto aprovado.")}</div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {[
                t("Acesso a diagnóstico e execução de branding, web e processos dentro de um projeto estruturado."),
                t("Proposta técnica organizada para avaliação conforme as diretrizes aplicáveis do Sebrae."),
                t("Acompanhamento da documentação e das etapas que dependem do projeto e da região."),
                t("Mais clareza para decidir quais frentes de inovação fazem sentido para o momento da empresa."),
                t("Uma entrega digital planejada para apoiar a presença e a operação do negócio.")
              ].map((benefit, idx) => (
                <div key={idx} className="flex gap-4 items-start p-4 rounded-2xl bg-charcoal-900 border border-white/[0.03] hover:border-white/[0.06] transition-[border-color] duration-200">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-secondary shrink-0 shadow-[0_0_8px_var(--color-brand-secondary)]" />
                  <p className="text-zinc-300 text-xs sm:text-sm font-sans font-medium leading-relaxed text-left">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* WHO CAN BENEFIT SEBRAETEC */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-12 border-t border-white/[0.04]">
            <div className="lg:col-span-4 space-y-4">
              <span className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest block font-bold">{t("VALIDAÇÃO REGIONAL")}</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white leading-none tracking-tight">
                {t("AS CONDIÇÕES DO ")}{" "}<span className="text-brand">{t("SEBRAETEC VARIAM POR REGIÃO.")}</span>
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                {t("Elegibilidade, documentação, serviços contemplados, disponibilidade e limites dependem das regras vigentes do Sebrae regional. Confirme esses requisitos com a unidade responsável antes de iniciar uma proposta.")}</p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl space-y-2 transition-[border-color] duration-200">
                <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">{t("01 // ELEGIBILIDADE")}</span>
                <h3 className="text-white font-display font-bold text-sm">{t("Confirme o perfil atendido")}</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {t("O enquadramento da empresa e do projeto deve ser confirmado diretamente com o Sebrae da sua região.")}</p>
              </div>

              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl space-y-2 transition-[border-color] duration-200">
                <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">{t("02 // DOCUMENTAÇÃO")}</span>
                <h3 className="text-white font-display font-bold text-sm">{t("Consulte a lista vigente")}</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {t("Os documentos e comprovantes exigidos dependem das regras atuais da unidade responsável. Não inicie o protocolo com base em uma lista genérica.")}</p>
              </div>

              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl space-y-2 transition-[border-color] duration-200">
                <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">{t("03 // SERVIÇOS E DISPONIBILIDADE")}</span>
                <h3 className="text-white font-display font-bold text-sm">{t("Verifique o escopo regional")}</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {t("Serviços contemplados, limites e disponibilidade precisam ser confirmados com o Sebrae regional para cada projeto.")}</p>
              </div>

              <div className="p-6 bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl space-y-2 transition-[border-color] duration-200">
                <span className="tag08-meta text-xs text-brand uppercase font-black tracking-wider block">{t("04 // APOIO COOPERATIVO")}</span>
                <h3 className="text-white font-display font-bold text-sm">{t("Suporte da equipe técnica")}</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {t("A TAG08 pode apoiar a estruturação técnica após confirmar a aderência do serviço e as condições aplicáveis com o Sebrae regional.")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE SOLUTIONS COVERED */}
      <section className="px-4 sm:px-6 md:px-8 py-24 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand uppercase tracking-widest font-bold">{t("CAPACIDADES DA TAG08")}</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">{t("Frentes que podem ser avaliadas conforme as regras regionais")}</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              {t("O Sebrae define quais serviços podem ser considerados, conforme as regras vigentes, disponibilidade e análise regional do projeto. Os exemplos abaixo descrevem capacidades da TAG08 e não confirmam cobertura ou elegibilidade no programa.")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl p-6 space-y-4 group transition-[border-color] duration-200">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Layers className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-display font-bold text-sm">{t("Branding & marca visual")}</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {t("Criação de logotipo vetorial profissional, reformulação de manual de identidade, escolha unificada de cores institucionais, diagramação de propostas comerciais de luxo e papelaria digital completa.")}</p>
              </div>
            </div>

              <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl p-6 space-y-4 group transition-[border-color] duration-200">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-display font-bold text-sm">{t("Embalagem & design de rótulo")}</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {t("Criação técnica tridimensional e conceitual de embalagens, rótulos comerciais, caixas de entrega exclusivas e fitas adesivas estéticas para e-commerces que precisam reter a valorização do cliente.")}</p>
              </div>
            </div>

              <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl p-6 space-y-4 group transition-[border-color] duration-200">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <Zap className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-display font-bold text-sm">{t("Websites & landing pages")}</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {t("Desenvolvimento sob medida de sites corporativos de alta performance, landing pages otimizadas de captura de leads estruturadas sem templates repetitivos de mercado e com código leve.")}</p>
              </div>
            </div>

              <div className="bg-charcoal-900 border border-white/[0.08] hover:border-brand/40 rounded-3xl p-6 space-y-4 group transition-[border-color] duration-200">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                <FileText className="w-5 h-5 text-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-display font-bold text-sm">{t("E-commerces & sistemas")}</h3>
                <p className="text-zinc-400 text-xs sm:text-xs leading-relaxed font-medium">
                  {t("Lojas virtuais elegantes integradas de ponta a ponta com gateways de pagamento seguros, sistemas consultivos de catálogos interativos estruturados e integrações automatizadas ERP de controle comercial.")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE INTEGRATION JOURNEY */}
      <section className="py-24 px-4 sm:px-6 md:px-8 border-b border-white/[0.04] bg-charcoal-900/30 text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-2.5 py-1 rounded-md inline-block">
              {t("JORNADA DO CLIENTE // FLUXO SEGURO")}</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">{t("Como consultar as condições do Sebraetec")}</h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              {t("A TAG08 pode apoiar a estruturação técnica da proposta. A elegibilidade, a aprovação, a disponibilidade e as condições são definidas pelo Sebrae da região.")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { num: "01", term: t("DIAGNÓSTICO INICIAL"), desc: t("Conversa para compreender a necessidade e avaliar se há um caminho compatível com o programa e as regras da sua região.") },
              { num: "02", term: t("PROPOSTA TÉCNICA"), desc: t("Quando a participação da TAG08 e o serviço forem confirmados como aplicáveis, estruturamos o escopo e os materiais técnicos para avaliação conforme as diretrizes vigentes.") },
              { num: "03", term: t("ENVIO & ANÁLISE"), desc: t("Se a participação da TAG08 e o serviço forem confirmados como aplicáveis, a proposta poderá ser encaminhada ao Sebrae regional para avaliação.") },
              { num: "04", term: t("EXECUÇÃO DO PROJETO"), desc: t("Com a aprovação e as condições confirmadas, iniciamos o projeto conforme o escopo acordado.") },
              { num: "05", term: t("ENTREGA E PRESTAÇÃO DE CONTAS"), desc: t("Quando essa participação for confirmada, a execução e a documentação seguem as etapas aplicáveis definidas para o projeto.") }
            ].map((step, sIdx) => (
              <div key={sIdx} className="bg-charcoal-900 border border-white/[0.04] p-6 rounded-2xl space-y-4 flex flex-col justify-between relative hover:border-brand/20 transition-[border-color] duration-200">
                <span className="font-display font-black text-3xl text-brand-secondary">{step.num}</span>
                <div className="space-y-1">
                  <h3 className="text-white tag08-meta text-xs tracking-wider font-bold">{step.term}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <TrackedOutboundLink
              label={t("Consultar condições do Sebraetec")}
              surface="sebraetec-diagnostic-cta"
              href={buildBrazilWhatsAppUrl(t("Olá,%20gostaria%20de%20consultar%20as%20condições%20vigentes%20do%20Sebraetec%20na%20minha%20região."))}
              target="_blank"
              rel="noreferrer"
              className="group min-h-11 bg-brand-secondary text-black font-sans font-black text-xs uppercase tracking-widest py-3.5 px-8 rounded-full shadow-[0_15px_45px_rgba(var(--color-brand-secondary-rgb),0.22)] motion-safe:hover:scale-[1.02] transition-[background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 flex items-center gap-2 cursor-pointer"
            >
              <span>{t("CONSULTAR CONDIÇÕES VIGENTES")}</span>
              <ArrowRight className="w-4 h-4" />
            </TrackedOutboundLink>
            <button
              onClick={() => handleLinkClick("/contato")}
              className="min-h-11 text-white hover:text-brand font-sans text-xs uppercase tracking-widest px-6 py-3 transition-colors flex items-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900"
            >
              <span>{t("IR PARA O CONTATO")}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="px-4 sm:px-6 md:px-8 py-24 max-w-4xl mx-auto space-y-12 text-left">
        <div className="text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-brand mx-auto" />
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">{t("DÚVIDAS FREQUENTES SOBRE SEBRAETEC")}</h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-medium">
            {t("Entenda os limites de atuação da TAG08 e confirme as regras e condições vigentes diretamente com o Sebrae da sua região.")}</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, fIdx) => (
            <div 
              key={fIdx} 
              className="border border-white/[0.04] bg-charcoal-900 rounded-2xl overflow-hidden hover:border-brand/20 transition-[border-color] duration-200"
            >
              <h3 className="m-0">
                <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === fIdx ? null : fIdx)}
                id={`sebraetec-faq-question-${fIdx}`}
                aria-expanded={activeFaq === fIdx}
                aria-controls={`sebraetec-faq-panel-${fIdx}`}
                className="min-h-11 w-full p-6 text-left flex items-center justify-between text-white font-display font-semibold text-xs sm:text-sm uppercase tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset cursor-pointer"
                >
                <span>{faq.q}</span>
                <span aria-hidden="true" className="text-brand font-sans text-lg shrink-0 ml-4 font-bold">
                  {activeFaq === fIdx ? "−" : "+"}
                </span>
                </button>
              </h3>
              
              {activeFaq === fIdx && (
                <div id={`sebraetec-faq-panel-${fIdx}`} role="region" aria-labelledby={`sebraetec-faq-question-${fIdx}`} className="px-6 pb-6 text-zinc-400 text-xs sm:text-xs font-sans leading-relaxed border-t border-white/[0.02] pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION CARD */}
      <section className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto pt-8">
        <div className="border border-white/[0.08] bg-gradient-to-br from-charcoal-900 to-black rounded-[32px] p-8 sm:p-12 md:p-16 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-20%] w-[450px] h-[450px] bg-brand/10 blur-[130px] rounded-full pointer-events-none" />
          
          <span className="tag08-meta text-xs text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/20 px-3 py-1 rounded-full uppercase tracking-widest font-black inline-block z-10">
            {t("FALE COM A TAG08 SOBRE A VIABILIDADE")}</span>
          
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tighter leading-tight max-w-3xl mx-auto z-10">
            {t("PRONTO PARA AVALIAR ")}{" "}<span className="text-brand-secondary">{t("SEU PROJETO COM O SEBRAETEC?")}</span>
          </h2>
          
          <p className="text-zinc-400 text-xs sm:text-sm font-medium max-w-2xl mx-auto z-10 leading-relaxed">
            {t("A TAG08 pode ajudar a estruturar o diagnóstico e a proposta técnica. A elegibilidade, o percentual de apoio e a aprovação são definidos pelo Sebrae regional.")}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 z-10 relative">
            <TrackedOutboundLink
              label={t("Consultar condições com o Sebrae regional")}
              surface="sebraetec-final-cta"
              href={buildBrazilWhatsAppUrl(t("Olá,%20acabei%20de%20acessar%20a%20página%20do%20SEBRAETEC%20e%20gostaria%20de%20verificar%20a%20elegibilidade%20e%20a%20viabilidade%20do%20meu%20projeto%20conforme%20as%20regras%20da%20minha%20região."))}
              target="_blank"
              rel="noreferrer"
              className="group min-h-11 bg-brand-secondary text-black font-sans font-black text-xs uppercase tracking-widest py-4 px-10 rounded-full shadow-[0_20px_50px_rgba(var(--color-brand-secondary-rgb),0.3)] motion-safe:hover:scale-[1.02] transition-[background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 flex items-center gap-2 cursor-pointer"
            >
              <span>{t("CONSULTAR CONDIÇÕES REGIONAIS")}</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </TrackedOutboundLink>
          </div>
        </div>
      </section>

    </div>
  );
}


