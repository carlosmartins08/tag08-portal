import React, { useEffect, useRef, useState } from "react";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  ArrowRight, 
  ClipboardCheck, 
  Sparkles, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Lock,
  Shield,
  Clock,
  Copy
} from "../../../components/DooIcons";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ContactFormData, PARTNERSHIP_MODALITY_VALUES, type PartnershipModality } from "../../../types";
import { TAG08_OFFICIAL_CHANNELS, TAG08_OFFICIAL_CONTACT, TAG08_WHATSAPP_CONTACTS, buildGoogleMapsEmbedUrl } from "../../../config/siteNetwork";
import { trackFormError, trackFormStart, trackFormSubmit, trackLeadEvent, trackOutboundClick } from "../../../lib/analytics";
import { queueFormSubmission, removeQueuedSubmission } from "../../../lib/formQueue";
import { confirmsSheetsSubmission } from "../../../lib/sheetsDeliveryConfirmation";
import { COOKIE_CONSENT_EVENT, readCookiePreferences, type CookiePreferences } from "../../../lib/cookieConsent";
import CountryFlag from "../../../components/CountryFlag";
import ItsHoverActionIcon from "../../../components/ItsHoverActionIcon";
import type { RouteLocale } from "../../../config/routeRegistry";
import { getContactJourneyOriginSource, parseContactJourneyContext, type ContactJourneyOrigin } from "../../../lib/contactJourney";

const CONTACT_INTENT_GROUPS: { label: string; options: readonly (readonly [string, string])[] }[] = [
  {
    label: "Presença, comunicação e marca",
    options: [
      ["redes-sociais", "Melhorar presença digital e redes sociais"],
      ["producao-audiovisual", "Produzir conteúdo audiovisual"],
      ["branding", "Organizar marca ou posicionamento"]
    ]
  },
  {
    label: "Estratégia e tecnologia",
    options: [
      ["assessoria-estrategica", "Obter direção estratégica para o negócio"],
      ["desenvolvimento-web", "Desenvolver site, e-commerce ou solução digital"],
      ["hospedagem", "Dar continuidade à hospedagem ou manutenção do projeto digital"]
    ]
  },
  {
    label: "Processos e operação",
    options: [
      ["process-intelligence", "Entender e organizar processos"],
      ["process-activation", "Ativar melhorias na operação"]
    ]
  },
  {
    label: "Capacidades que podem apoiar uma frente",
    options: [["trafego-performance", "Tráfego, SEO, copywriting ou performance"]]
  }
];
const CONTACT_SERVICE_OPTIONS = CONTACT_INTENT_GROUPS.flatMap((group) => group.options);
const CONTACT_SERVICE_LABELS = Object.fromEntries(CONTACT_SERVICE_OPTIONS) as Record<string, string>;
const CONTACT_INTENT_CONTEXT_LABELS: Record<string, string> = {
  ...CONTACT_SERVICE_LABELS,
  orientacao: "Orientação ou outra necessidade"
};
const CONTACT_ORIGIN_LABELS: Record<ContactJourneyOrigin, string> = {
  home: "Home",
  services: "Serviços",
  offer: "página de oferta",
  sebraetec: "página do Sebraetec",
  "partnership-program": "Programa de Parceria"
};
const PARTNERSHIP_MODALITY_LABELS: Record<PartnershipModality, string> = {
  referral: "Parceiro de Indicação",
  active_commercial: "Parceiro Comercial Ativo"
};

const CONTACT_PILOT_COPY = {
  en: {
    intro: { badge: "Alignment session", title: "Let’s find the right path", highlight: "for your business.", description: "Tell us what brought you here. Your answers provide context and can make the conversation more useful." },
    directory: { title: "Contact channels", leadership: "General office", copy: "Copy", copied: "Copied", copyEmail: "Copy the TAG08 contact email", copyAddress: "Copy the office address", copyWhatsapp: "Copy WhatsApp number for {label}", copyErrorEmail: "Could not copy the email. Select it manually.", copyErrorPhone: "Could not copy this number.", office: "Our office", locationReviews: "TAG08 location and reviews", openMaps: "Open in Maps", openGoogleMaps: "Open in Google Maps", mapConsent: "The embedded map loads only after marketing cookies have been authorized. You can also open the location directly in Google Maps.", mapDescription: "The Google Business profile brings together directions, the official address and public reviews that confirm our local presence.", seeReviews: "See reviews", officialChannels: "TAG08 official channels", afterSend: "After you submit:", afterSendDescription: "You will see a confirmation on this page and can continue through the direct contact channels if you prefer.", defaultWhatsappMessage: "Hello, I would like to speak with TAG08." },
    form: {
      partnership: "Partnership Program", diagnostic: "Initial guidance", headings: ["How can we help?", "Let’s understand the context", "How can we contact you?", "Review your application"],
      description: "Your answers help our team prepare for the conversation.", reviewDescription: "Review your details before submitting.", step: "Step {active} of {total}", progress: "Form progress", honeypot: "Do not fill in this field",
      requestLegend: "What brings you here?", diagnosticLegend: "What would you like to work through?", chooseOne: "(choose one)",
      requestTypes: { new_project: "I want to start a project", diagnostic: "I need guidance on what to address", existing_client: "I am an existing client", partnership: "I would like to propose a partnership" },
      partnershipLegend: "Which partnership model would you like to propose?", modalities: { referral: "Referral Partner", active_commercial: "Active Commercial Partner" },
      fields: { name: "What is your name?", company: "Company name", whatsapp: "WhatsApp", email: "Business email", namePlaceholder: "e.g. Fernando Guedes", companyPlaceholder: "e.g. Guedes Clinic Ltd.", whatsappPlaceholder: "e.g. +1 555 123 4567", emailPlaceholder: "e.g. fernando@example.com" },
      suggestion: "Suggested from {origin}: {intent}. You can change or add to this below.", yourChoice: "your choice", origins: { home: "Home", services: "Services", offer: "the service page", sebraetec: "the Sebraetec page", partnership: "the Partnership Program" },
      sebraetecContext: "You came from the Sebraetec page. Describe the need you want to discuss or choose another option.", serviceLegend: "Which need or context would you like to discuss?", diagnosticServiceLegend: "Which need or context would you like to understand?", multiple: "(select all that apply)",
      serviceGroups: ["Presence, communication and brand", "Strategy and technology", "Processes and operations", "Capabilities that can support a workstream"],
      services: { "redes-sociais": "Improve digital presence and social media", "producao-audiovisual": "Produce audiovisual content", branding: "Organize the brand or positioning", "assessoria-estrategica": "Get strategic direction for the business", "desenvolvimento-web": "Build a website, e-commerce store or digital solution", hospedagem: "Continue hosting or maintaining a digital project", "process-intelligence": "Understand and organize processes", "process-activation": "Activate operational improvements", "trafego-performance": "Paid traffic, SEO, copywriting or performance" },
      capabilitiesNote: "Paid traffic, SEO, copywriting and performance are supporting capabilities, not separate service families. If your need is unclear, describe the context below or choose the guidance option.",
      guidance: "I need guidance or have another need", currentClientContext: "Tell us what you need now and, if you know, identify the project or service.", partnershipContext: "Briefly describe the partnership you propose and who you would like to involve.",
      messageLabels: { existing: "What do you need now?", partnership: "What partnership are you proposing?", diagnostic: "What general context should we consider?", outcome: "What outcome are you looking for?", optional: "(optional)", messagePlaceholder: "Share only what is needed. Do not include passwords or confidential information." },
      requestReason: "Reason", diagnosticRequest: "Guidance / diagnosis", newProject: "New project", existingClient: "Existing client", partnershipLabel: "Partnership", workstreams: "Areas of interest", reviewPrompt: "Review the reason and areas you selected before submitting your request.",
      modality: "Partnership model", notSelected: "Not selected", name: "Name", company: "Company", emailWhatsapp: "Email and WhatsApp", proposal: "Proposal", noAdditionalContext: "No additional context provided.",
      changeModality: "Change partnership model", changeProposal: "Change proposal", changeContact: "Change contact", back: "Back", continue: "Continue", review: "Review application",
      consent: "I authorize the use of this information to respond to this request, in accordance with TAG08’s privacy notice.", consentError: "Confirm your consent before submitting your information.", partnershipConsent: "I confirm that I am submitting this application under the selected partnership model.", partnershipConsentError: "Confirm that you want to submit this application to continue.",
      dataUseTitle: "Responsible use of information:", dataUse: "We will use this information only to respond to your request and in accordance with TAG08’s privacy notice. If a temporary issue occurs, the request may be stored in this browser for an automatic retry.",
      submitLoading: "Checking information…", submitPartnership: "Confirm and submit application", submitDiagnostic: "Send guidance request", submitDefault: "Send request to TAG08",
      successPartnershipTitle: "Application submitted", successDiagnosticTitle: "Guidance request submitted", successDefaultTitle: "Message sent", successThanks: "Thank you,", successPartnership: "Your application to join as {modality} was submitted. This confirms submission only; it does not indicate approval or a contract.", successDiagnostic: "Your guidance request was submitted. This confirms submission only; it does not mean a diagnosis has been completed or an automatic recommendation made.", successDefault: "Your information was submitted. If needed, the team may contact you through the channels provided to better understand your needs.",
      fastTrack: "Recommended next step", fastTrackDescription: "When WhatsApp opens, a summary of your answers will be prefilled for you to review. It will be sent to the TAG08 team only if you tap Send in the app.", talkWhatsapp: "Talk on WhatsApp {label}", requestLabels: { new_project: "New project", existing_client: "Existing client", partnership: "Partnership", diagnostic: "Guidance request" }, guidanceWhatsapp: "I need guidance or have another need", notProvided: "Not provided", whatsappSummary: "Hello, I completed the form and would like to continue the conversation.\n- Reason: {reason}\n- Name: {name}\n- Company: {company}\n- Email: {email}\n- Areas of interest: {services}\n- Message: {message}"
    },
    errors: {
      "O nome é de preenchimento obrigatório.": "Please enter your name.", "Insira o nome corporativo da empresa.": "Please enter your company name.", "O WhatsApp é vital para iniciarmos o contato.": "Please enter a WhatsApp number so we can contact you.", "Insira um e-mail corporativo válido.": "Please enter a valid business email address.",
      "Escolha o motivo do contato para continuar.": "Choose a reason for contacting us to continue.", "Escolha a modalidade de parceria para continuar.": "Choose a partnership model to continue.", "Selecione ao menos um serviço ou escolha a opção de orientação.": "Select at least one area of interest or choose the guidance option.", "Revise os campos obrigatórios e tente novamente.": "Review the required fields and try again.", "Não foi possível concluir o envio agora. Sua solicitação foi salva neste navegador para nova tentativa automática.": "We could not complete the submission. Your request was saved in this browser for an automatic retry.", "O envio não foi concluído e não foi possível salvar uma tentativa neste navegador. Seus dados continuam no formulário; tente novamente.": "The submission was not completed, and we could not save a retry in this browser. Your information remains in the form; please try again."
    },
    steps: { eyebrow: "NEXT STEPS // WHAT TO EXPECT", title: "What happens after you submit?", description: "Your answers provide context for the request. If needed, the team may contact you through the channels provided.", context: "Context provided", contextDescription: "The reason you share and, when relevant, the areas of interest help give context to your request.", noRepeat: "No need to repeat what you have already shared", contact: "Contact, if needed", contactDescription: "If we need to better understand your request, the team may contact you through the channels provided.", next: "A clear next step", nextDescription: "If follow-up is needed, the team can align next steps through the channels provided.", contactChannel: "Contact through the channel you provided" },
    faq: { eyebrow: "HELP // FREQUENTLY ASKED QUESTIONS", title: "Frequently asked questions about working with us", description: "We explain key commercial terms and processes so you can understand how TAG08 works with your business.", lgpd: "Privacy notice: translated summary available; Portuguese source prevails while under review.", nda: "Do not include confidential information in this form", items: [
      { question: "Are TAG08's analyses free?", answer: "Yes. All analyses offered by TAG08 are free of charge." },
      { question: "Does TAG08 serve clients in other languages?", answer: "Yes. TAG08 serves clients in Portuguese, English and Spanish." },
      { question: "How should I share confidential information?", answer: "Do not include confidential information in this form. Discuss any confidentiality requirements with TAG08 before sharing sensitive material. Do not assume that an NDA is in place unless both parties have agreed to it." },
      { question: "How is the scope of a TAG08 project defined?", answer: "The scope depends on the needs and priorities identified for each project. The proposed work is discussed with you before an engagement begins." },
      { question: "What kinds of organizations does TAG08 work with?", answer: "We work with growing companies, industries, established clinics, corporate firms and brands that need marketing supported by clear governance and responsible use of resources." }
    ] }
  },
  es: {
    intro: { badge: "Sesión de alineación", title: "Encontremos el camino adecuado", highlight: "para su empresa.", description: "Cuéntenos qué le trajo hasta aquí. Sus respuestas aportan contexto y pueden hacer que la conversación sea más útil." },
    directory: { title: "Canales de contacto", leadership: "Dirección general", copy: "Copiar", copied: "Copiado", copyEmail: "Copiar el correo de contacto de TAG08", copyAddress: "Copiar la dirección de la oficina", copyWhatsapp: "Copiar el número de WhatsApp de {label}", copyErrorEmail: "No se pudo copiar el correo. Selecciónelo manualmente.", copyErrorPhone: "No se pudo copiar este número.", office: "Nuestra oficina", locationReviews: "Ubicación y reseñas de TAG08", openMaps: "Abrir en Maps", openGoogleMaps: "Abrir en Google Maps", mapConsent: "El mapa integrado solo se carga después de autorizar las cookies de marketing. También puede abrir la ubicación directamente en Google Maps.", mapDescription: "El perfil de Google Business reúne indicaciones, la dirección oficial y reseñas públicas que confirman nuestra presencia local.", seeReviews: "Ver reseñas", officialChannels: "Canales oficiales de TAG08", afterSend: "Después de enviar:", afterSendDescription: "Verá una confirmación en esta página y, si lo prefiere, podrá continuar por los canales de contacto directo.", defaultWhatsappMessage: "Hola, quisiera hablar con TAG08." },
    form: {
      partnership: "Programa de Alianzas", diagnostic: "Orientación inicial", headings: ["¿Cómo podemos ayudarle?", "Entendamos el contexto", "¿Cómo podemos contactarle?", "Revise su solicitud"],
      description: "Sus respuestas ayudan a nuestro equipo a prepararse para la conversación.", reviewDescription: "Revise sus datos antes de enviar.", step: "Paso {active} de {total}", progress: "Progreso del formulario", honeypot: "No complete este campo",
      requestLegend: "¿Cuál es el motivo de su contacto?", diagnosticLegend: "¿Qué desea resolver?", chooseOne: "(elija una opción)",
      requestTypes: { new_project: "Quiero iniciar un proyecto", diagnostic: "Necesito orientación para saber qué resolver", existing_client: "Ya soy cliente", partnership: "Quiero proponer una alianza" },
      partnershipLegend: "¿Qué modalidad de alianza desea proponer?", modalities: { referral: "Socio de Referencia", active_commercial: "Socio Comercial Activo" },
      fields: { name: "¿Cuál es su nombre?", company: "Nombre de la empresa", whatsapp: "WhatsApp", email: "Correo electrónico corporativo", namePlaceholder: "p. ej., Fernando Guedes", companyPlaceholder: "p. ej., Clínica Guedes Ltda.", whatsappPlaceholder: "p. ej., +34 600 123 456", emailPlaceholder: "p. ej., fernando@empresa.com" },
      suggestion: "Sugerencia desde {origin}: {intent}. Puede cambiarla o añadir información abajo.", yourChoice: "su elección", origins: { home: "Inicio", services: "Servicios", offer: "la página del servicio", sebraetec: "la página de Sebraetec", partnership: "el Programa de Alianzas" },
      sebraetecContext: "Viene de la página de Sebraetec. Describa la necesidad que desea conversar o elija otra opción.", serviceLegend: "¿Qué necesidad o contexto desea conversar?", diagnosticServiceLegend: "¿Qué necesidad o contexto desea comprender?", multiple: "(puede elegir más de una opción)",
      serviceGroups: ["Presencia, comunicación y marca", "Estrategia y tecnología", "Procesos y operación", "Capacidades que pueden apoyar un área"],
      services: { "redes-sociais": "Mejorar la presencia digital y las redes sociales", "producao-audiovisual": "Producir contenido audiovisual", branding: "Organizar la marca o el posicionamiento", "assessoria-estrategica": "Obtener dirección estratégica para el negocio", "desenvolvimento-web": "Desarrollar un sitio, comercio electrónico o solución digital", hospedagem: "Dar continuidad al alojamiento o mantenimiento del proyecto digital", "process-intelligence": "Comprender y organizar procesos", "process-activation": "Activar mejoras en la operación", "trafego-performance": "Publicidad de pago, SEO, redacción o rendimiento" },
      capabilitiesNote: "La publicidad de pago, el SEO, la redacción y el rendimiento son capacidades de apoyo, no familias de servicios independientes. Si su necesidad no está clara, describa el contexto abajo o elija la opción de orientación.",
      guidance: "Necesito orientación o tengo otra necesidad", currentClientContext: "Cuéntenos qué necesita ahora y, si lo sabe, identifique el proyecto o servicio.", partnershipContext: "Describa brevemente la alianza que propone y a quién le gustaría involucrar.",
      messageLabels: { existing: "¿Qué necesita ahora?", partnership: "¿Qué alianza propone?", diagnostic: "¿Qué contexto general debemos considerar?", outcome: "¿Qué resultado busca?", optional: "(opcional)", messagePlaceholder: "Comparta solo lo necesario. No incluya contraseñas ni información confidencial." },
      requestReason: "Motivo", diagnosticRequest: "Orientación / diagnóstico", newProject: "Nuevo proyecto", existingClient: "Cliente actual", partnershipLabel: "Alianza", workstreams: "Áreas de interés", reviewPrompt: "Revise el motivo y las áreas indicadas antes de enviar su solicitud.",
      modality: "Modalidad de alianza", notSelected: "No seleccionada", name: "Nombre", company: "Empresa", emailWhatsapp: "Correo y WhatsApp", proposal: "Propuesta", noAdditionalContext: "No se indicó contexto adicional.",
      changeModality: "Cambiar modalidad", changeProposal: "Cambiar propuesta", changeContact: "Cambiar contacto", back: "Volver", continue: "Continuar", review: "Revisar solicitud",
      consent: "Autorizo el uso de estos datos para responder a esta solicitud, de acuerdo con el aviso de privacidad de TAG08.", consentError: "Confirme su consentimiento antes de enviar sus datos.", partnershipConsent: "Confirmo el envío de esta solicitud en la modalidad de alianza seleccionada.", partnershipConsentError: "Confirme el envío de la solicitud para continuar.",
      dataUseTitle: "Uso responsable de los datos:", dataUse: "Usaremos esta información únicamente para responder a la solicitud y de acuerdo con el aviso de privacidad de TAG08. Ante una falla temporal, la solicitud puede guardarse en este navegador para un nuevo intento automático.",
      submitLoading: "Verificando la información…", submitPartnership: "Confirmar y enviar solicitud", submitDiagnostic: "Enviar solicitud de orientación", submitDefault: "Enviar solicitud a TAG08",
      successPartnershipTitle: "Solicitud enviada", successDiagnosticTitle: "Solicitud de orientación enviada", successDefaultTitle: "Mensaje enviado", successThanks: "Gracias,", successPartnership: "Su solicitud para participar como {modality} fue enviada. Esta confirmación solo acredita el envío; no indica aprobación ni contratación.", successDiagnostic: "Su solicitud de orientación fue enviada. Esta confirmación solo acredita el envío; no significa que se haya completado un diagnóstico ni que exista una recomendación automática.", successDefault: "Su información fue enviada. Si es necesario, el equipo podrá contactarle por los canales indicados para comprender mejor su necesidad.",
      fastTrack: "Siguiente paso recomendado", fastTrackDescription: "Al abrir WhatsApp, verá un resumen de sus respuestas ya preparado para que lo revise. Solo se enviará al equipo de TAG08 si pulsa Enviar en la aplicación.", talkWhatsapp: "Hablar por WhatsApp {label}", requestLabels: { new_project: "Nuevo proyecto", existing_client: "Cliente actual", partnership: "Alianza", diagnostic: "Solicitud de orientación" }, guidanceWhatsapp: "Necesito orientación o tengo otra necesidad", notProvided: "No indicado", whatsappSummary: "Hola, completé el formulario y quisiera continuar la conversación.\n- Motivo: {reason}\n- Nombre: {name}\n- Empresa: {company}\n- Correo: {email}\n- Áreas de interés: {services}\n- Mensaje: {message}"
    },
    errors: {
      "O nome é de preenchimento obrigatório.": "Ingrese su nombre.", "Insira o nome corporativo da empresa.": "Ingrese el nombre de su empresa.", "O WhatsApp é vital para iniciarmos o contato.": "Ingrese un número de WhatsApp para que podamos contactarle.", "Insira um e-mail corporativo válido.": "Ingrese un correo electrónico corporativo válido.",
      "Escolha o motivo do contato para continuar.": "Elija el motivo del contacto para continuar.", "Escolha a modalidade de parceria para continuar.": "Elija una modalidad de alianza para continuar.", "Selecione ao menos um serviço ou escolha a opção de orientação.": "Seleccione al menos un área de interés o elija la opción de orientación.", "Revise os campos obrigatórios e tente novamente.": "Revise los campos obligatorios e inténtelo de nuevo.", "Não foi possível concluir o envio agora. Sua solicitação foi salva neste navegador para nova tentativa automática.": "No se pudo completar el envío. La solicitud se guardó en este navegador para un nuevo intento automático.", "O envio não foi concluído e não foi possível salvar uma tentativa neste navegador. Seus dados continuam no formulário; tente novamente.": "El envío no se completó y no fue posible guardar un nuevo intento en este navegador. Sus datos permanecen en el formulario; inténtelo de nuevo."
    },
    steps: { eyebrow: "PRÓXIMOS PASOS // QUÉ ESPERAR", title: "¿Qué ocurre después del envío?", description: "Sus respuestas aportan contexto a la solicitud. Si es necesario, el equipo podrá contactarle por los canales indicados.", context: "Contexto proporcionado", contextDescription: "El motivo indicado y, cuando corresponda, las áreas de interés aportan contexto a la solicitud.", noRepeat: "Sin repetir lo que ya nos contó", contact: "Contacto, si es necesario", contactDescription: "Si necesitamos comprender mejor su necesidad, el equipo podrá contactarle por los canales indicados.", next: "Un siguiente paso claro", nextDescription: "Si hace falta continuar, el equipo podrá acordar los siguientes pasos por los canales indicados.", contactChannel: "Contacto por el canal indicado" },
    faq: { eyebrow: "AYUDA // PREGUNTAS FRECUENTES", title: "Preguntas frecuentes sobre cómo trabajamos", description: "Explicamos los principales términos y procesos comerciales para que comprenda cómo TAG08 puede trabajar con su empresa.", lgpd: "Aviso de privacidad: hay un resumen traducido; el texto en portugués prevalece mientras esté en revisión.", nda: "No incluya información confidencial en este formulario", items: [
      { question: "¿Los análisis de TAG08 son gratuitos?", answer: "Sí. Todos los análisis ofrecidos por TAG08 son gratuitos." },
      { question: "¿TAG08 atiende a clientes en otros idiomas?", answer: "Sí. TAG08 atiende a clientes en portugués, inglés y español." },
      { question: "¿Cómo debo compartir información confidencial?", answer: "No incluya información confidencial en este formulario. Consulte con TAG08 cualquier requisito de confidencialidad antes de compartir material sensible. No dé por hecho que existe un acuerdo de confidencialidad sin el consentimiento de ambas partes." },
      { question: "¿Cómo se define el alcance de un proyecto de TAG08?", answer: "El alcance depende de las necesidades y prioridades identificadas para cada proyecto. El trabajo propuesto se conversa con usted antes de iniciar la colaboración." },
      { question: "¿Con qué tipo de organizaciones trabaja TAG08?", answer: "Trabajamos con empresas en expansión, industrias, clínicas consolidadas, firmas corporativas y marcas que necesitan marketing con gobernanza clara y uso responsable de los recursos." }
    ] }
  }
} as const;

const LOCALIZED_PRIVACY_SOURCE_NOTICE = {
  en: "This page offers a translated summary. It is provisional and under review; consult the Portuguese source for the original text.",
  es: "Esta p\u00e1gina ofrece un resumen traducido. Es provisional y est\u00e1 en revisi\u00f3n; consulte el texto original en portugu\u00e9s."
} as const;

const LOCALIZED_PRIVACY_SOURCE_LINK = {
  en: "Portuguese source",
  es: "Fuente en portugu\u00e9s"
} as const;

export default function Contato({ locale = "pt" }: { locale?: RouteLocale }) {
  const pilotCopy = locale === "pt" ? null : CONTACT_PILOT_COPY[locale];
  const privacySourceNotice = locale === "pt" ? null : LOCALIZED_PRIVACY_SOURCE_NOTICE[locale];
  const serviceLabel = (service: string) => pilotCopy?.form.services[service as keyof typeof CONTACT_PILOT_COPY.en.form.services] ?? CONTACT_SERVICE_LABELS[service] ?? service;
  const modalityLabel = (modality: PartnershipModality) => pilotCopy?.form.modalities[modality] ?? PARTNERSHIP_MODALITY_LABELS[modality];
  const localizedError = (message: string) => {
    if (!pilotCopy) return message;
    return pilotCopy.errors[message as keyof typeof CONTACT_PILOT_COPY.en.errors]
      ?? (locale === "en"
        ? "We could not process this request. Please review the form and try again."
        : "No pudimos procesar la solicitud. Revise el formulario e inténtelo de nuevo.");
  };
  const localizedOrigin = (origin: ContactJourneyOrigin) => pilotCopy?.form.origins[origin] ?? CONTACT_ORIGIN_LABELS[origin];
  const visibleContactLabel = (label: string) => locale === "en" ? ({ Brasil: "Brazil", Internacional: "International" }[label] ?? label) : locale === "es" ? ({ Brasil: "Brasil", Internacional: "Internacional" }[label] ?? label) : label;
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [marketingConsent, setMarketingConsent] = useState(false);
  const hasTrackedFormStartRef = useRef(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const requestTypeFirstOptionRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const syncMarketingConsent = (preferences: CookiePreferences | null) => {
      setMarketingConsent(preferences?.marketing === true);
    };

    syncMarketingConsent(readCookiePreferences());
    const handleConsentChange = (event: Event) => {
      syncMarketingConsent((event as CustomEvent<CookiePreferences>).detail);
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const copyToClipboard = (text: string, id: string) => {
    const reportCopyError = () => {
      setCopiedStates(prev => ({ ...prev, [`${id}-error`]: true }));
      window.setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [`${id}-error`]: false }));
      }, 2500);
    };

    if (!navigator.clipboard?.writeText) {
      reportCopyError();
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }));
      }, 1500);
    }).catch(() => {
      reportCopyError();
    });
  };

  const faqData = pilotCopy?.faq.items ?? [
    {
      question: "O diagnóstico de posicionamento e processos é cobrado?",
      answer: "Absolutamente não. A análise de presença digital prévia que realizamos e a primeira chamada de qualificação e alinhamento são investimentos 100% nossos para atestar o fit de atendimento mútuo."
    },
    {
      question: "Vocês prestam atendimento internacional em outros idiomas?",
      answer: "Sim. Para empresas e operações brasileiras, nosso atendimento e entregáveis técnicos são mantidos integralmente em Português. Para corporações e parceiros localizados fora do país, dispomos de suporte estratégico e técnico bilíngue completo, estruturado em Inglês ou Espanhol."
    },
    {
      question: "Vocês aceitam assinar Acordo de Confidencialidade (NDA)?",
      answer: "Sim. Por lidarmos rotineiramente com planos comerciais confidenciais, faturamentos e gargalos estruturais das empresas, assinamos NDAs corporativos em conformidade total antes que qualquer dado sensível seja compartilhado."
    },
    {
      question: "As soluções da TAG08 são modulares ou fechadas?",
      answer: "Somos modulares. Sua empresa pode iniciar corrigindo gargalos internos urgentes via Process Intelligence, estruturar uma nova máquina web com nossa divisão de Engenharia de Sistemas, ou delegar a gestão contínua de canais de atração integrada."
    },
    {
      question: "Que tipo de organização pode trabalhar com a TAG08?",
      answer: "Atendemos empresas em fase de expansão, indústrias, clínicas sênior, escritórios corporativos e marcas que já entenderam que marketing barato sem governança gera ruído e desperdício de caixa."
    }
  ];

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    company: "",
    whatsapp: "",
    email: "",
    requestType: "",
    serviceInterests: [],
    needsServiceGuidance: false,
    service: "not_applicable",
    stage: "not_collected",
    message: ""
  });
  const [journeyContext, setJourneyContext] = useState<ReturnType<typeof parseContactJourneyContext>>({});
  const [activeStep, setActiveStep] = useState(1);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [partnershipModality, setPartnershipModality] = useState<PartnershipModality>();
  const [partnershipSendConfirmed, setPartnershipSendConfirmed] = useState(false);
  const [partnershipSendConfirmationError, setPartnershipSendConfirmationError] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const isPartnership = formData.requestType === "partnership";
  const isDiagnostic = formData.requestType === "diagnostic";
  const collectsServiceContext = formData.requestType === "new_project" || isDiagnostic;
  const finalStep = isPartnership ? 4 : 3;
  const isSubmitStep = activeStep === finalStep;

  useEffect(() => {
    const context = parseContactJourneyContext(window.location.search);
    setJourneyContext(context);
    if (!context.intent && !context.requestType) return;

    setFormData((previous) => ({
      ...previous,
      ...(context.requestType ? { requestType: context.requestType } : context.intent === "orientacao" ? { requestType: "diagnostic" as const } : {}),
      ...(context.intent ? {
        serviceInterests: context.intent === "orientacao" ? [] : [context.intent],
        needsServiceGuidance: context.intent === "orientacao"
      } : {})
    }));
  }, []);

  useEffect(() => {
    if (success) {
      window.requestAnimationFrame(() => successRef.current?.focus());
    }
  }, [success]);

  const validateContact = () => {
    const tempErrors: Partial<ContactFormData> = {};
    if (!formData.name.trim()) tempErrors.name = "O nome é de preenchimento obrigatório.";
    if (!formData.company.trim()) tempErrors.company = "Insira o nome corporativo da empresa.";
    if (!formData.whatsapp.trim()) tempErrors.whatsapp = "O WhatsApp é vital para iniciarmos o contato.";
    if (!formData.email.includes("@")) tempErrors.email = "Insira um e-mail corporativo válido.";
    setErrors(tempErrors);
    if (Object.keys(tempErrors).length > 0) {
      const firstInvalidField = Object.keys(tempErrors)[0];
      window.requestAnimationFrame(() => document.getElementById(`form-${firstInvalidField}`)?.focus());
      trackFormError({
        form_name: "contact",
        form_surface: "contact-page",
        error_count: Object.keys(tempErrors).length,
        page_path: "/contato"
      });
    }
    return Object.keys(tempErrors).length === 0;
  };

  const goToStep = (step: number) => {
    setActiveStep(step);
    window.requestAnimationFrame(() => stepHeadingRef.current?.focus());
  };

  const continueFromStep = () => {
    if (activeStep === 1 && !formData.requestType) {
      setSubmitError("Escolha o motivo do contato para continuar.");
      window.requestAnimationFrame(() => requestTypeFirstOptionRef.current?.focus());
      return;
    }
    if (activeStep === 1 && formData.requestType === "partnership" && !partnershipModality) {
      setSubmitError("Escolha a modalidade de parceria para continuar.");
      return;
    }
    if (activeStep === 2 && collectsServiceContext && !formData.needsServiceGuidance && formData.serviceInterests.length === 0) {
      setSubmitError("Selecione ao menos um serviço ou escolha a opção de orientação.");
      return;
    }
    if (activeStep === 3 && isPartnership && !validateContact()) return;
    setSubmitError("");
    setPartnershipSendConfirmed(false);
    setPartnershipSendConfirmationError(false);
    goToStep(activeStep + 1);
  };

  const handleRequestTypeChange = (requestType: ContactFormData["requestType"]) => {
    if (requestType !== "partnership") {
      setPartnershipModality(undefined);
      setPartnershipSendConfirmed(false);
      setPartnershipSendConfirmationError(false);
    }
    const retainsServiceContext = requestType === "new_project" || requestType === "diagnostic";
    setFormData((prev) => ({
      ...prev,
      requestType,
      serviceInterests: retainsServiceContext ? prev.serviceInterests : [],
      needsServiceGuidance: retainsServiceContext ? prev.needsServiceGuidance : false
    }));
    setSubmitError("");
  };

  const toggleServiceInterest = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceInterests: prev.serviceInterests.includes(service)
        ? prev.serviceInterests.filter((item) => item !== service)
        : [...prev.serviceInterests, service],
      needsServiceGuidance: false
    }));
    setSubmitError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!hasTrackedFormStartRef.current) {
      hasTrackedFormStartRef.current = true;
      trackFormStart({
        form_name: "contact",
        form_surface: "contact-page",
        page_path: "/contato"
      });
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formIsValid = validateContact();
    setConsentError(!consent);
    const requiresPartnershipConfirmation = isPartnership && !partnershipSendConfirmed;
    setPartnershipSendConfirmationError(requiresPartnershipConfirmation);
    if (!formIsValid || !consent || !partnershipModality && isPartnership || requiresPartnershipConfirmation) {
      if (!formIsValid) {
        setSubmitError("");
      } else if (!consent) {
        setSubmitError("");
        window.requestAnimationFrame(() => document.getElementById("form-consent")?.focus());
      } else if (requiresPartnershipConfirmation) {
        window.requestAnimationFrame(() => document.getElementById("partnership-send-confirmation")?.focus());
      }
      return;
    }

    setLoading(true);
    setSubmitError("");
    setConsentError(false);
    const idempotencyKey = crypto.randomUUID();
    const searchParams = new URLSearchParams(window.location.search);
    const isNewProject = formData.requestType === "new_project";
    const includesServiceContext = isNewProject || isDiagnostic;
    const serviceInterests = includesServiceContext ? formData.serviceInterests : [];
    const needsServiceGuidance = includesServiceContext && formData.needsServiceGuidance;
    const legacyService = !includesServiceContext
      ? "not_applicable"
      : needsServiceGuidance
        ? "not_sure"
        : serviceInterests.length === 1
          ? serviceInterests[0]
          : "multiple";
    const payload = {
      ...formData,
      ...(isPartnership && partnershipModality ? { partnershipApplication: { version: 1, modality: partnershipModality } } : {}),
      serviceInterests,
      needsServiceGuidance,
      service: legacyService,
      stage: "not_collected",
      website: honeypotRef.current?.value || "",
      consent,
      consentVersion: "contact-v1",
      locale,
      source: getContactJourneyOriginSource(journeyContext.origin),
      utm: {
        source: searchParams.get("utm_source") || "",
        medium: searchParams.get("utm_medium") || "",
        campaign: searchParams.get("utm_campaign") || "",
        content: searchParams.get("utm_content") || "",
        term: searchParams.get("utm_term") || ""
      }
    };
    // Preserve the same key and payload while the request is in flight so a page reload
    // can replay this exact submission instead of creating a second record.
    let queuedForRetry = queueFormSubmission({ endpoint: "/api/contact", idempotencyKey, payload });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error("submission_queued");
        }
        setSubmitError("Revise os campos obrigatórios e tente novamente.");
        removeQueuedSubmission(idempotencyKey);
        setLoading(false);
        return;
      }

      if (!confirmsSheetsSubmission(response.status, result, "contact")) {
        throw new Error("submission_persistence_unconfirmed");
      }

      setLoading(false);
      removeQueuedSubmission(idempotencyKey);
      setSuccess(true);
      trackFormSubmit({
        form_name: "contact",
        form_surface: "contact-page",
        status: "success",
        request_type: formData.requestType,
        page_path: "/contato",
        submission_key: idempotencyKey
      });
      trackLeadEvent({
        action: "contact_form_submit",
        surface: "contact-form",
        status: "success"
      });
    } catch {
      if (!queuedForRetry) {
        queuedForRetry = queueFormSubmission({ endpoint: "/api/contact", idempotencyKey, payload });
      }
      setLoading(false);
      setSubmitError(queuedForRetry
        ? "Não foi possível concluir o envio agora. Sua solicitação foi salva neste navegador para nova tentativa automática."
        : "O envio não foi concluído e não foi possível salvar uma tentativa neste navegador. Seus dados continuam no formulário; tente novamente.");
      trackFormError({
        form_name: "contact",
        form_surface: "contact-page",
        error_count: 1,
        page_path: "/contato"
      });
    }
  };

  const buildWhatsAppUrl = (phoneE164: string, text: string) => {
    return `https://wa.me/${phoneE164.replace("+", "")}?text=${encodeURIComponent(text)}`;
  };

  const handleLaunchWhatsAppFastTrack = (contact = TAG08_WHATSAPP_CONTACTS[0]) => {
    const selectedServices = formData.serviceInterests.map(serviceLabel).join(", ");
    const messageTemplate = pilotCopy?.form.whatsappSummary ?? "Olá, preenchi os dados no formulário e quero agilizar meu contato.\n- Motivo: {reason}\n- Nome: {name}\n- Empresa: {company}\n- E-mail: {email}\n- Serviços de interesse: {services}\n- Mensagem: {message}";
    const text = messageTemplate
      .replace("{reason}", pilotCopy?.form.requestLabels[formData.requestType] ?? CONTACT_INTENT_CONTEXT_LABELS[formData.requestType] ?? "Contato")
      .replace("{name}", formData.name)
      .replace("{company}", formData.company)
      .replace("{email}", formData.email)
      .replace("{services}", formData.needsServiceGuidance
        ? pilotCopy?.form.guidance ?? "Preciso de orientação ou tenho outra necessidade"
        : selectedServices || pilotCopy?.form.notProvided || "Não informado")
      .replace("{message}", formData.message || pilotCopy?.form.notProvided || "Não informado");

    const href = buildWhatsAppUrl(contact.phoneE164, text);
    trackOutboundClick({
      label: "WhatsApp " + contact.label,
      url: href,
      surface: "contact-fast-track"
    });
    window.open(href, "_blank", "noopener,noreferrer");
  };
  return (
    <div className="tag08-contact bg-charcoal-950 text-white min-h-screen pt-16 pb-20">
      <div className="tag08-contact__primary max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left column info items */}
        <div className="tag08-contact__overview lg:col-span-5 space-y-8 text-left">
          <div className="tag08-contact__intro space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/5 border border-brand/20 rounded-full text-brand text-xs font-sans">
              <span>{pilotCopy?.intro.badge ?? "Sessão de Alinhamento"}</span>
            </div>
            <h1 className="font-display font-medium text-4xl sm:text-5xl text-gradient leading-[1.1] tracking-tight">
              {pilotCopy?.intro.title ?? "Vamos entender o melhor"}{" "}
              <span className="text-brand">{pilotCopy?.intro.highlight ?? "caminho para sua marca?"}</span>
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {pilotCopy?.intro.description ?? "Conte o que trouxe você até aqui. Suas respostas ajudam a contextualizar o contato e podem tornar a conversa mais útil."}
            </p>
          </div>

          <div className="tag08-contact__directory space-y-4 border-t border-b border-white/[0.04] py-8 font-sans">
            <h2 className="sr-only">{pilotCopy?.directory.title ?? "Canais de contato"}</h2>
            <div className="tag08-contact__direct-contacts space-y-4">

            {/* Email Contact Card */}
            <div className="flex gap-4 items-center justify-between group/item p-3 -mx-3 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/[0.03] transition-[background-color,border-color] duration-200">
              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded bg-brand/5 border border-brand/20 text-brand flex items-center justify-center shrink-0">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-xs tracking-wider tag08-meta">{pilotCopy?.directory.leadership ?? "Diretoria Geral"}</h3>
                  <a href="mailto:contato@tag08.com.br" className="text-zinc-300 text-sm underline-offset-4 hover:text-brand hover:underline focus-visible:rounded-sm">contato@tag08.com.br</a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard("contato@tag08.com.br", "email")}
                aria-label={pilotCopy?.directory.copyEmail ?? "Copiar e-mail da diretoria"}
                className="min-h-11 min-w-11 justify-center text-zinc-400 sm:opacity-70 sm:group-hover/item:opacity-100 focus-visible:opacity-100 transition-[transform,opacity,color,background-color,border-color] duration-150 motion-reduce:transition-none active:scale-[0.98] motion-reduce:active:scale-100 text-xs rounded-lg hover:text-brand hover:bg-brand/10 border border-transparent hover:border-brand/20 flex items-center gap-1.5 font-sans uppercase font-bold select-none cursor-pointer shrink-0"
              >
                {copiedStates["email"] ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-brand" />
                    <span className="text-brand">{pilotCopy?.directory.copied ?? "Copiado"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{pilotCopy?.directory.copy ?? "Copiar"}</span>
                  </>
                )}
              </button>
            </div>
            {copiedStates["email-error"] && <p className="-mt-2 text-xs text-state-warning">{pilotCopy?.directory.copyErrorEmail ?? "Não foi possível copiar. Selecione o e-mail manualmente."}</p>}

            <div className="grid grid-cols-1 gap-4">
              {TAG08_WHATSAPP_CONTACTS.map((contact) => (
                <React.Fragment key={contact.key}>
                  <div
                    className="flex gap-4 items-center justify-between group/item p-3 -mx-3 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/[0.03] transition-[background-color,border-color] duration-200"
                  >
                  <div className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded border flex items-center justify-center shrink-0 bg-brand/5 border-brand/20 text-brand">
                      <Phone className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="flex items-center gap-1.5 text-white font-semibold text-xs tracking-wider tag08-meta">
                        <CountryFlag country={contact.country} className="text-sm leading-none" /> WhatsApp {visibleContactLabel(contact.label)}
                      </h3>
                      <a
                        href={buildWhatsAppUrl(contact.phoneE164, pilotCopy?.directory.defaultWhatsappMessage ?? "Olá, gostaria de falar com a TAG08.")}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackOutboundClick({ label: `WhatsApp ${contact.label}`, url: buildWhatsAppUrl(contact.phoneE164, pilotCopy?.directory.defaultWhatsappMessage ?? "Olá, gostaria de falar com a TAG08."), surface: "contact-directory-whatsapp" })}
                        className="text-sm font-sans font-medium text-zinc-400 underline-offset-4 hover:text-brand hover:underline">
                        {contact.display}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(contact.phoneE164.replace("+", ""), contact.key)}
                    aria-label={pilotCopy?.directory.copyWhatsapp.replace("{label}", visibleContactLabel(contact.label)) ?? `Copiar WhatsApp ${contact.label}`}
                    className="min-h-11 min-w-11 justify-center sm:opacity-70 sm:group-hover/item:opacity-100 focus-visible:opacity-100 transition-[transform,opacity,color,background-color,border-color] duration-150 motion-reduce:transition-none active:scale-[0.98] motion-reduce:active:scale-100 p-2 rounded-lg border border-transparent flex items-center gap-1.5 font-sans text-xs uppercase font-bold select-none cursor-pointer shrink-0 text-zinc-400 hover:text-brand hover:bg-brand/10 hover:border-brand/20"
                  >
                    {copiedStates[contact.key] ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-brand" />
                        <span className="text-brand">{pilotCopy?.directory.copied ?? "Copiado"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{pilotCopy?.directory.copy ?? "Copiar"}</span>
                      </>
                    )}
                  </button>
                  </div>
                  {copiedStates[`${contact.key}-error`] && <p className="-mt-2 text-xs text-state-warning">{pilotCopy?.directory.copyErrorPhone ?? "Não foi possível copiar este número."}</p>}
                </React.Fragment>
              ))}
            </div>

            {/* Address Card */}
            <div className="flex gap-4 items-center justify-between group/item p-3 -mx-3 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/[0.03] transition-[background-color,border-color] duration-200">
              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded bg-brand/5 border border-brand/20 text-brand flex items-center justify-center shrink-0">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-xs tracking-wider tag08-meta">{pilotCopy?.directory.office ?? "Nosso Escritório"}</h3>
                  <a
                    href={TAG08_OFFICIAL_CONTACT.googleBusinessUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackOutboundClick({ label: "Google Business Profile", url: TAG08_OFFICIAL_CONTACT.googleBusinessUrl, surface: "contact-address" })}
                    className="text-zinc-300 text-sm underline-offset-4 hover:text-brand hover:underline focus-visible:rounded-sm"
                  >
                    {TAG08_OFFICIAL_CONTACT.address}
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(TAG08_OFFICIAL_CONTACT.address, "address")}
                aria-label={pilotCopy?.directory.copyAddress ?? "Copiar endereço do escritório"}
                className="min-h-11 min-w-11 justify-center text-zinc-400 sm:opacity-70 sm:group-hover/item:opacity-100 focus-visible:opacity-100 transition-[transform,opacity,color,background-color,border-color] duration-150 motion-reduce:transition-none active:scale-[0.98] motion-reduce:active:scale-100 text-xs rounded-lg hover:text-brand hover:bg-brand/10 border border-transparent hover:border-brand/20 flex items-center gap-1.5 font-sans uppercase font-bold select-none cursor-pointer shrink-0"
              >
                {copiedStates["address"] ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-brand" />
                    <span className="text-brand">{pilotCopy?.directory.copied ?? "Copiado"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{pilotCopy?.directory.copy ?? "Copiar"}</span>
                  </>
                )}
              </button>
            </div>
            </div>

            <div className="tag08-contact__map-card rounded-xl border border-white/[0.05] bg-black/20 overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.24)]">
              <div className="flex items-center justify-between gap-4 px-4 pt-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest tag08-meta text-brand font-black">Google Maps</p>
                  <h3 className="text-white text-sm font-semibold">{pilotCopy?.directory.locationReviews ?? "Localização e avaliações da TAG08"}</h3>
                </div>
                <a
                  href={TAG08_OFFICIAL_CONTACT.googleBusinessUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    trackOutboundClick({
                      label: "Google Meu Negócio",
                      url: TAG08_OFFICIAL_CONTACT.googleBusinessUrl,
                      surface: "contact-google-maps"
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-brand/20 bg-brand/10 px-3 py-2 text-xs tag08-meta font-black uppercase tracking-widest text-brand transition-colors hover:bg-brand hover:text-black"
                >
                  {pilotCopy?.directory.openMaps ?? "Abrir no Maps"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="mt-4 h-[220px] sm:h-[280px]">
                {marketingConsent ? (
                  <iframe
                    title="Mapa da TAG08"
                    src={buildGoogleMapsEmbedUrl(TAG08_OFFICIAL_CONTACT.address)}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 bg-zinc-950 px-6 text-center">
                    <p className="max-w-md text-xs leading-relaxed text-zinc-400">
                      {pilotCopy?.directory.mapConsent ?? "O mapa incorporado só é carregado quando os cookies de marketing já foram autorizados. Você também pode abrir a localização diretamente no Google Maps."}
                    </p>
                    <a
                      href={TAG08_OFFICIAL_CONTACT.googleBusinessUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-brand/30 bg-brand/10 px-4 py-2 text-xs tag08-meta font-black uppercase tracking-widest text-brand transition-colors hover:bg-brand hover:text-black"
                    >
                      {pilotCopy?.directory.openGoogleMaps ?? "Abrir no Google Maps"}
                    </a>
                  </div>
                )}
              </div>

              <div className="px-4 pb-4 pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
                  {pilotCopy?.directory.mapDescription ?? "O mapa e o perfil do Google Business concentram rota, endereço oficial e as avaliações públicas que validam nossa presença local."}
                </p>
                <a
                  href={TAG08_OFFICIAL_CONTACT.googleBusinessUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    trackOutboundClick({
                      label: "Google Business Profile",
                      url: TAG08_OFFICIAL_CONTACT.googleBusinessUrl,
                      surface: "contact-google-business-profile"
                    })
                  }
                  className="inline-flex items-center gap-2 text-xs tag08-meta font-black uppercase tracking-widest text-white hover:text-brand transition-colors"
                >
                  {pilotCopy?.directory.seeReviews ?? "Ver avaliações"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            </div>

          <div className="tag08-contact__channels rounded-xl border border-white/[0.05] bg-white/[0.02] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand" />
              <h3 className="text-white font-semibold text-xs tracking-wider tag08-meta">
                {pilotCopy?.directory.officialChannels ?? "Canais oficiais da TAG08"}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TAG08_OFFICIAL_CHANNELS.map((channel) => {
                const host = new URL(channel.href).hostname.replace(/^www\./, "");
                return (
                  <a
                    key={channel.key}
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      trackOutboundClick({
                        label: channel.label,
                        url: channel.href,
                        surface: "contact-official-channel"
                      })
                    }
                    className="min-h-11 flex items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-black/20 px-4 py-3 transition-[background-color,border-color] duration-200 hover:border-brand/40 hover:bg-brand/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
                  >
                    <div>
                      <p className="text-sm text-white font-medium">{channel.label}</p>
                      <p className="text-xs text-zinc-400">{host}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand shrink-0" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="tag08-contact__response-note bg-charcoal-900 border border-white/[0.04] p-5 rounded-lg flex items-start gap-3">
            <ClipboardCheck className="w-5 h-5 text-brand shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-400 leading-relaxed">
              <strong>{pilotCopy?.directory.afterSend ?? "Após o envio:"}</strong> {pilotCopy?.directory.afterSendDescription ?? "Você verá uma confirmação nesta página e poderá seguir pelos canais de contato direto, se preferir."}
            </p>
          </div>
        </div>

        {/* Right column form */}
        <div className="tag08-contact__form-column lg:col-span-7">
          <div className="tag08-contact__form bg-charcoal-900 border border-white/[0.06] rounded-2xl p-6 sm:p-10 shadow-xl backdrop-blur-md relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  aria-busy={loading}
                  className="space-y-6 text-left"
                >
                  <div className="tag08-contact__form-intro">
                    <span className="tag08-label">{isPartnership ? pilotCopy?.form.partnership ?? "Programa de Parceria" : pilotCopy?.form.diagnostic ?? "Diagnóstico inicial"}</span>
                    <h2 ref={stepHeadingRef} tabIndex={-1} className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">{pilotCopy?.form.headings[activeStep - 1] ?? (activeStep === 1 ? "Como podemos ajudar?" : activeStep === 2 ? "Vamos entender o contexto" : activeStep === 3 ? "Como falar com você?" : "Revise sua inscrição")}</h2>
                    <p className="text-sm leading-relaxed text-zinc-400">{pilotCopy?.form.step.replace("{active}", String(activeStep)).replace("{total}", String(finalStep)) ?? `Etapa ${activeStep} de ${finalStep}`} · {isPartnership ? pilotCopy?.form.reviewDescription ?? "Revise os dados antes do envio." : pilotCopy?.form.description ?? "Suas respostas ajudam nossa equipe a chegar mais preparada."}</p>
                    <div className="mt-4 flex gap-2" role="progressbar" aria-label={pilotCopy?.form.progress ?? "Progresso do formulário"} aria-valuemin={1} aria-valuemax={finalStep} aria-valuenow={activeStep}>
                      {Array.from({ length: finalStep }, (_, index) => index + 1).map((step) => <span key={step} className={`h-1 flex-1 rounded-full ${step <= activeStep ? "bg-brand" : "bg-white/10"}`} />)}
                    </div>
                  </div>
                  <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="contact-website">{pilotCopy?.form.honeypot ?? "Não preencha este campo"}</label>
                    <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" ref={honeypotRef} />
                  </div>
                  {activeStep === 1 && <fieldset className="space-y-3" aria-invalid={Boolean(!formData.requestType && submitError)} aria-describedby={!formData.requestType && submitError ? "contact-request-type-error" : undefined}>
                    <legend className="text-sm font-semibold text-white">{isDiagnostic ? pilotCopy?.form.diagnosticLegend ?? "O que você deseja resolver?" : pilotCopy?.form.requestLegend ?? "Qual é o motivo do seu contato?"} <span className="text-zinc-400">{pilotCopy?.form.chooseOne ?? "(escolha uma opção)"}</span></legend>
                    {(["new_project", "diagnostic", "existing_client", "partnership"] as const).map((value) => (
                      <label key={value} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${formData.requestType === value ? "border-brand bg-brand/10 text-white" : "border-white/[0.08] text-zinc-300 hover:border-white/20"}`}>
                        <input ref={value === "new_project" ? requestTypeFirstOptionRef : undefined} type="radio" name="requestType" value={value} required={value === "new_project"} checked={formData.requestType === value} onChange={() => handleRequestTypeChange(value as ContactFormData["requestType"])} className="accent-[var(--color-brand)]" />{pilotCopy?.form.requestTypes[value] ?? ({ new_project: "Quero iniciar um projeto", diagnostic: "Quero orientação para entender o que resolver", existing_client: "Já sou cliente", partnership: "Quero propor uma parceria" }[value])}
                      </label>
                    ))}
                  </fieldset>}
                  {activeStep === 1 && isPartnership && <fieldset className="space-y-3">
                    <legend className="text-sm font-semibold text-white">{pilotCopy?.form.partnershipLegend ?? "Qual modalidade de parceria deseja propor?"}</legend>
                    {PARTNERSHIP_MODALITY_VALUES.map((modality) => (
                      <label key={modality} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${partnershipModality === modality ? "border-brand bg-brand/10 text-white" : "border-white/[0.08] text-zinc-300 hover:border-white/20"}`}>
                        <input type="radio" name="partnershipModality" value={modality} checked={partnershipModality === modality} onChange={() => { setPartnershipModality(modality); setSubmitError(""); }} className="accent-[var(--color-brand)]" />{modalityLabel(modality)}
                      </label>
                    ))}
                  </fieldset>}
                  {/* Row Name and company */}
                  {activeStep === 3 && <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="form-name" className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                        {pilotCopy?.form.fields.name ?? "Qual o seu nome? *"}
                      </label>
                      <input
                        id="form-name"
                        type="text"
                        name="name"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "form-name-error" : undefined}
                        className={`w-full bg-zinc-950 border rounded-lg p-3 text-sm focus:outline-none focus:border-brand text-white transition-[border-color,box-shadow] duration-200 ${
                          errors.name ? "border-state-danger/50" : "border-white/[0.08]"
                        }`}
                        placeholder={pilotCopy?.form.fields.namePlaceholder ?? "Ex: Fernando Guedes"}
                      />
                      {errors.name && (
                        <p id="form-name-error" className="text-xs text-state-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {localizedError(errors.name)}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="form-company" className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                        {pilotCopy?.form.fields.company ?? "Nome da Empresa *"}
                      </label>
                      <input
                        id="form-company"
                        type="text"
                        name="company"
                        autoComplete="organization"
                        required
                        value={formData.company}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.company)}
                        aria-describedby={errors.company ? "form-company-error" : undefined}
                        className={`w-full bg-zinc-950 border rounded-lg p-3 text-sm focus:outline-none focus:border-brand text-white transition-[border-color,box-shadow] duration-200 ${
                          errors.company ? "border-state-danger/50" : "border-white/[0.08]"
                        }`}
                        placeholder={pilotCopy?.form.fields.companyPlaceholder ?? "Ex: Cl?nica Guedes Ltda"}
                      />
                      {errors.company && (
                        <p id="form-company-error" className="text-xs text-state-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {localizedError(errors.company)}</p>
                      )}
                    </div>
                  </div>

                  {/* Row Whatsapp and email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="form-whatsapp" className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                        {pilotCopy?.form.fields.whatsapp ?? "WhatsApp *"}
                      </label>
                      <input
                        id="form-whatsapp"
                        type="tel"
                        name="whatsapp"
                        autoComplete="tel"
                        required
                        value={formData.whatsapp}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.whatsapp)}
                        aria-describedby={errors.whatsapp ? "form-whatsapp-error" : undefined}
                        className={`w-full bg-zinc-950 border rounded-lg p-3 text-sm focus:outline-none focus:border-brand text-white transition-[border-color,box-shadow] duration-200 ${
                          errors.whatsapp ? "border-state-danger/50" : "border-white/[0.08]"
                        }`}
                        placeholder={pilotCopy?.form.fields.whatsappPlaceholder ?? "Ex: (11) 99999-9999"}
                      />
                      {errors.whatsapp && (
                        <p id="form-whatsapp-error" className="text-xs text-state-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {localizedError(errors.whatsapp)}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="form-email" className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                        {pilotCopy?.form.fields.email ?? "E-mail Corporativo *"}
                      </label>
                      <input
                        id="form-email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "form-email-error" : undefined}
                        className={`w-full bg-zinc-950 border rounded-lg p-3 text-sm focus:outline-none focus:border-brand text-white transition-[border-color,box-shadow] duration-200 ${
                          errors.email ? "border-state-danger/50" : "border-white/[0.08]"
                        }`}
                        placeholder={pilotCopy?.form.fields.emailPlaceholder ?? "Ex: fernando@clinicaguedes.com"}
                      />
                      {errors.email && (
                        <p id="form-email-error" className="text-xs text-state-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {localizedError(errors.email)}</p>
                      )}
                    </div>
                  </div>

                  </div>}

                  {activeStep === 2 && <div className="space-y-5">
                    {collectsServiceContext && journeyContext.intent && <p className="rounded-lg border border-brand/20 bg-brand/5 px-3 py-2 text-xs leading-relaxed text-zinc-300" role="status">
                      {(pilotCopy?.form.suggestion ?? "Sugestão a partir de {origin}: {intent}. Você pode alterar ou complementar abaixo.").replace("{origin}", journeyContext.origin ? localizedOrigin(journeyContext.origin) : (pilotCopy?.form.yourChoice ?? "sua escolha")).replace("{intent}", serviceLabel(journeyContext.intent))}
                    </p>}
                    {formData.requestType === "new_project" && !journeyContext.intent && journeyContext.origin === "sebraetec" && <p className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs leading-relaxed text-zinc-300" role="status">
                      {pilotCopy?.form.sebraetecContext ?? "Você veio da página do Sebraetec. Registre a necessidade que deseja encaminhar ou escolha outra opção."}
                    </p>}
                    {collectsServiceContext ? <fieldset className="space-y-3">
                      <legend className="text-sm font-semibold text-white">{isDiagnostic ? pilotCopy?.form.diagnosticServiceLegend ?? "Qual necessidade ou contexto deseja entender?" : pilotCopy?.form.serviceLegend ?? "Qual necessidade você quer encaminhar?"} <span className="font-normal text-zinc-400">{pilotCopy?.form.multiple ?? "(pode selecionar mais de uma)"}</span></legend>
                      <div className="space-y-4">
                        {CONTACT_INTENT_GROUPS.map((group) => (
                          <div key={group.label} role="group" aria-label={pilotCopy?.form.serviceGroups[CONTACT_INTENT_GROUPS.indexOf(group)] ?? group.label} className="space-y-2">
                            <p className="tag08-meta text-xs font-semibold uppercase tracking-wider text-zinc-400">{pilotCopy?.form.serviceGroups[CONTACT_INTENT_GROUPS.indexOf(group)] ?? group.label}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {group.options.map(([value, label]) => (
                                <label key={value} className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors ${formData.serviceInterests.includes(value) ? "border-brand bg-brand/10 text-white" : "border-white/[0.08] text-zinc-300 hover:border-white/20"}`}>
                                  <input type="checkbox" checked={formData.serviceInterests.includes(value)} onChange={() => toggleServiceInterest(value)} className="accent-[var(--color-brand)]" />{serviceLabel(value)}
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs leading-relaxed text-zinc-400">{pilotCopy?.form.capabilitiesNote ?? "Tráfego, SEO, copywriting e performance são capacidades de apoio, não famílias independentes. Se a sua necessidade não estiver clara, descreva o contexto abaixo ou escolha a opção de orientação."}</p>
                      <label className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm ${formData.needsServiceGuidance ? "border-brand bg-brand/10 text-white" : "border-white/[0.08] text-zinc-300"}`}>
                        <input type="checkbox" checked={formData.needsServiceGuidance} onChange={(event) => { setFormData((prev) => ({ ...prev, needsServiceGuidance: event.target.checked, serviceInterests: event.target.checked ? [] : prev.serviceInterests })); setSubmitError(""); }} className="accent-[var(--color-brand)]" />{pilotCopy?.form.guidance ?? "Preciso de orientação ou tenho outra necessidade"}
                      </label>
                    </fieldset> : <p className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm leading-relaxed text-zinc-300">{formData.requestType === "existing_client" ? pilotCopy?.form.currentClientContext ?? "Conte o que você precisa agora e, se souber, identifique o projeto ou serviço." : pilotCopy?.form.partnershipContext ?? "Conte brevemente qual parceria propõe e quem gostaria de envolver."}</p>}
                    <div className="space-y-2">
                      <label htmlFor="form-message" className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">{formData.requestType === "existing_client" ? pilotCopy?.form.messageLabels.existing ?? "O que você precisa agora?" : formData.requestType === "partnership" ? pilotCopy?.form.messageLabels.partnership ?? "Qual parceria você propõe?" : isDiagnostic ? pilotCopy?.form.messageLabels.diagnostic ?? "Que contexto geral devemos considerar?" : pilotCopy?.form.messageLabels.outcome ?? "Qual resultado você busca?"} <span className="normal-case">{pilotCopy?.form.messageLabels.optional ?? "(opcional)"}</span></label>
                      <textarea id="form-message" name="message" value={formData.message} onChange={handleChange} rows={4} maxLength={4000} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg p-3 text-sm focus:outline-none focus:border-brand text-white resize-y" placeholder={pilotCopy?.form.messageLabels.messagePlaceholder ?? "Compartilhe apenas o necessário. Não inclua senhas ou dados confidenciais."} />
                    </div>
                  </div>}

                  {activeStep === 3 && <>
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm text-zinc-300">
                      <p><strong className="text-white">{pilotCopy?.form.requestReason ?? "Motivo:"}</strong> {isDiagnostic ? pilotCopy?.form.diagnosticRequest ?? "Diagnóstico / orientação" : formData.requestType === "new_project" ? pilotCopy?.form.newProject ?? "Novo projeto" : formData.requestType === "existing_client" ? pilotCopy?.form.existingClient ?? "Cliente atual" : pilotCopy?.form.partnershipLabel ?? "Parceria"}</p>
                      {collectsServiceContext && <p className="mt-1"><strong className="text-white">{pilotCopy?.form.workstreams ?? "Frentes:"}</strong> {formData.needsServiceGuidance ? pilotCopy?.form.guidance ?? "Preciso de orientação ou tenho outra necessidade" : formData.serviceInterests.map(serviceLabel).join(", ")}</p>}
                    </div>
                    <p className="text-xs text-zinc-400">{pilotCopy?.form.reviewPrompt ?? "Confira o motivo e as frentes informados antes de enviar sua solicitação."}</p>
                  </>}
                  {activeStep === 4 && isPartnership && <div className="space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm text-zinc-300">
                    <dl className="space-y-3">
                      <div><dt className="font-semibold text-white">{pilotCopy?.form.modality ?? "Modalidade"}</dt><dd>{partnershipModality ? modalityLabel(partnershipModality) : pilotCopy?.form.notSelected ?? "Não selecionada"}</dd></div>
                      <div><dt className="font-semibold text-white">{pilotCopy?.form.name ?? "Nome"}</dt><dd>{formData.name}</dd></div>
                      <div><dt className="font-semibold text-white">{pilotCopy?.form.company ?? "Empresa"}</dt><dd>{formData.company}</dd></div>
                      <div><dt className="font-semibold text-white">{pilotCopy?.form.emailWhatsapp ?? "E-mail e WhatsApp"}</dt><dd>{formData.email} · {formData.whatsapp}</dd></div>
                      <div><dt className="font-semibold text-white">{pilotCopy?.form.proposal ?? "Proposta"}</dt><dd>{formData.message.trim() || pilotCopy?.form.noAdditionalContext || "Nenhum contexto adicional informado."}</dd></div>
                    </dl>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => { setPartnershipSendConfirmed(false); goToStep(1); }} className="min-h-10 rounded-lg border border-white/10 px-4 text-xs text-white hover:bg-white/5">{pilotCopy?.form.changeModality ?? "Alterar modalidade"}</button>
                      <button type="button" onClick={() => { setPartnershipSendConfirmed(false); goToStep(2); }} className="min-h-10 rounded-lg border border-white/10 px-4 text-xs text-white hover:bg-white/5">{pilotCopy?.form.changeProposal ?? "Alterar proposta"}</button>
                      <button type="button" onClick={() => { setPartnershipSendConfirmed(false); goToStep(3); }} className="min-h-10 rounded-lg border border-white/10 px-4 text-xs text-white hover:bg-white/5">{pilotCopy?.form.changeContact ?? "Alterar contato"}</button>
                    </div>
                  </div>}
                  {submitError ? <p id={activeStep === 1 && !formData.requestType ? "contact-request-type-error" : undefined} role="alert" className="text-xs text-state-danger">{localizedError(submitError)}</p> : null}
                  <div className="flex gap-3 pt-2">
                    {activeStep > 1 && <button type="button" onClick={() => { setSubmitError(""); setPartnershipSendConfirmed(false); goToStep(activeStep - 1); }} className="min-h-11 rounded-lg border border-white/10 px-5 text-sm text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-transform duration-150 motion-reduce:transition-none active:scale-[0.98] motion-reduce:active:scale-100">{pilotCopy?.form.back ?? "Voltar"}</button>}
                    {activeStep < finalStep && <button type="button" onClick={continueFromStep} className="min-h-11 flex-1 rounded-lg bg-brand px-5 text-sm font-bold text-black hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-transform duration-150 motion-reduce:transition-none active:scale-[0.98] motion-reduce:active:scale-100">{isPartnership && activeStep === 3 ? (pilotCopy?.form.review ?? "Revisar inscrição") : (pilotCopy?.form.continue ?? "Continuar")} <ArrowRight className="ml-2 inline h-4 w-4" /></button>}
                  </div>

                  {((activeStep === 3 && !isPartnership) || isSubmitStep) && <>
                  {/* LGPD Compliance badge & Data Security Lock Notice */}
                  <label htmlFor="form-consent" className={`flex items-start gap-2.5 px-4 py-3 rounded-xl bg-white/[0.02] border cursor-pointer ${consentError ? "border-state-danger/70" : "border-white/[0.05]"}`}>
                    <input
                      id="form-consent"
                      type="checkbox"
                      checked={consent}
                      onChange={(event) => {
                        setConsent(event.target.checked);
                        if (event.target.checked) setConsentError(false);
                      }}
                      aria-invalid={consentError}
                      aria-describedby={consentError ? "form-consent-error" : undefined}
                      className="mt-0.5 h-4 w-4 accent-[var(--color-brand)]"
                    />
                    <span className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {pilotCopy?.form.consent ?? "Autorizo o uso destes dados para retorno sobre esta solicitação, conforme o aviso de privacidade da TAG08."}
                    </span>
                  </label>
                  {privacySourceNotice && <p className="pl-7 text-xs leading-relaxed text-zinc-400">{privacySourceNotice} <a href="/pt/privacidade" lang="pt-BR" className="underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">{LOCALIZED_PRIVACY_SOURCE_LINK[locale]}</a></p>}
                  {consentError && <p id="form-consent-error" className="text-xs text-state-danger" role="alert">{pilotCopy?.form.consentError ?? "Confirme o consentimento para enviar seus dados."}</p>}
                  {isPartnership && isSubmitStep && <>
                    <label htmlFor="partnership-send-confirmation" className={`flex items-start gap-2.5 px-4 py-3 rounded-xl bg-white/[0.02] border cursor-pointer ${partnershipSendConfirmationError ? "border-state-danger/70" : "border-white/[0.05]"}`}>
                      <input id="partnership-send-confirmation" type="checkbox" checked={partnershipSendConfirmed} onChange={(event) => { setPartnershipSendConfirmed(event.target.checked); if (event.target.checked) setPartnershipSendConfirmationError(false); }} aria-invalid={partnershipSendConfirmationError} aria-describedby={partnershipSendConfirmationError ? "partnership-send-confirmation-error" : undefined} className="mt-0.5 h-4 w-4 accent-[var(--color-brand)]" />
                      <span className="text-xs text-zinc-300 leading-relaxed">{pilotCopy?.form.partnershipConsent ?? "Confirmo o envio desta inscrição na modalidade selecionada."}</span>
                    </label>
                    {partnershipSendConfirmationError && <p id="partnership-send-confirmation-error" className="text-xs text-state-danger" role="alert">{pilotCopy?.form.partnershipConsentError ?? "Confirme o envio da inscrição para continuar."}</p>}
                  </>}
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 mt-1.5 motion-safe:animate-pulse" aria-hidden="true" />
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      <strong>{pilotCopy?.form.dataUseTitle ?? "Uso responsável dos dados:"}</strong> {pilotCopy?.form.dataUse ?? "Usaremos estas informações apenas para responder à solicitação e seguir o aviso de privacidade da TAG08."}
                    </p>
                  </div>
                  </>}

                  {/* Button Submit */}
                  {isSubmitStep && <div className="pt-2">
                    <button
                      id="btn-form-submit"
                      type="submit"
                      disabled={loading}
                      className="min-h-11 w-full bg-brand hover:bg-brand-dark text-black font-bold font-sans text-xs uppercase py-4 rounded-lg transition-[transform,background-color,box-shadow,opacity] duration-150 motion-reduce:transition-none active:scale-[0.98] motion-reduce:active:scale-100 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_25px_rgba(var(--color-brand-rgb),0.15)]"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-black border-r-transparent rounded-full motion-safe:animate-spin" aria-hidden="true" /> {pilotCopy?.form.submitLoading ?? "Verificando dados..."}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          {isPartnership ? pilotCopy?.form.submitPartnership ?? "Confirmar e enviar inscrição" : isDiagnostic ? pilotCopy?.form.submitDiagnostic ?? "Enviar pedido de orientação" : pilotCopy?.form.submitDefault ?? "Enviar solicitação à TAG08"} <ItsHoverActionIcon name="send" size={16} />
                        </span>
                      )}
                    </button>
                  </div>}
                </motion.form>
              ) : (
                <motion.div
                  key="success-container"
                  initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.96, opacity: 0 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                  className="space-y-8 text-center py-6"
                  ref={successRef}
                  tabIndex={-1}
                  role="status"
                  aria-live="polite"
                >
                  <div className="w-16 h-16 rounded-full bg-brand/10 border-2 border-brand text-brand flex items-center justify-center mx-auto shadow-2xl">
                    <CheckCircle className="w-9 h-9" />
                  </div>
                  
                  <div className="space-y-3 max-w-lg mx-auto">
                    <h3 className="font-display font-semibold text-2xl text-white">{isPartnership ? pilotCopy?.form.successPartnershipTitle ?? "Inscrição enviada" : isDiagnostic ? pilotCopy?.form.successDiagnosticTitle ?? "Pedido de orientação enviado" : pilotCopy?.form.successDefaultTitle ?? "Mensagem enviada"}</h3>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      {isPartnership
                        ? <>{pilotCopy?.form.successThanks ?? "Obrigado,"} <strong>{formData.name}</strong>. {(pilotCopy?.form.successPartnership ?? "Sua inscrição para {modality} foi enviada. Esta confirmação registra somente o envio; não representa aprovação ou contratação.").replace("{modality}", modalityLabel(partnershipModality ?? "referral"))}</>
                        : isDiagnostic
                          ? <>{pilotCopy?.form.successThanks ?? "Obrigado,"} <strong>{formData.name}</strong>. {pilotCopy?.form.successDiagnostic ?? "Seu pedido de orientação foi enviado. Esta confirmação registra somente o envio; não representa um diagnóstico concluído nem recomendação automática."}</>
                        : <>{pilotCopy?.form.successThanks ?? "Obrigado,"} <strong>{formData.name}</strong>. {pilotCopy?.form.successDefault ?? "Suas informações foram enviadas. Se necessário, a equipe poderá entrar em contato pelos canais informados."}</>}
                    </p>
                  </div>

                  {/* Fast track to immediate whatsapp option */}
                  {!isPartnership && <div className="bg-zinc-950 p-6 rounded-xl border border-white/[0.04] space-y-4 max-w-md mx-auto">
                    <div className="flex justify-center items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-brand" />
                      <span className="tag08-meta text-xs tracking-widest text-brand uppercase">{pilotCopy?.form.fastTrack ?? "Fast Track Recomendado"}</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {pilotCopy?.form.fastTrackDescription ?? "Ao abrir o WhatsApp, o resumo das respostas ser? pr?-preenchido para voc? revisar. Ele s? ser? enviado ? equipe TAG08 se voc? tocar em Enviar no aplicativo."}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {TAG08_WHATSAPP_CONTACTS.map((contact) => (
                        <button
                          key={contact.key}
                          type="button"
                          onClick={() => handleLaunchWhatsAppFastTrack(contact)}
                          className="w-full font-semibold text-xs font-sans py-3.5 rounded-lg transition-[transform,background-color] duration-150 motion-reduce:transition-none active:scale-[0.98] motion-reduce:active:scale-100 flex items-center justify-center gap-2 bg-brand text-black hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        >
                          {pilotCopy?.form.talkWhatsapp.replace("{label}", visibleContactLabel(contact.label)) ?? `Falar no WhatsApp ${contact.label}`}
                        </button>
                      ))}
                    </div>
                  </div>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* SECAO COMPLEMENTAR: ALINHAMENTO COM O PUBLICO ALVO */}
      <div className="tag08-contact__support max-w-7xl mx-auto px-6 mt-24 pt-20 border-t border-white/[0.04] space-y-20 text-left">
        
        {/* Próximos Passos (Timeline) */}
        <div className="tag08-contact__steps space-y-12">
          <div className="text-center md:text-left space-y-4">
                  <span className="tag08-meta text-xs tracking-widest text-brand uppercase bg-brand/5 border border-brand/20 px-3 py-1 rounded-full">
              {pilotCopy?.steps.eyebrow ?? "PRÓXIMOS PASSOS // TRANSPARÊNCIA"}
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-white">
              {pilotCopy?.steps.title ?? "O que acontece depois do envio?"}
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">
              {pilotCopy?.steps.description ?? "Suas respostas ajudam a contextualizar o pedido. Se necessário, a equipe poderá entrar em contato pelos canais informados."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-charcoal-900 border border-white/[0.04] p-6 sm:p-8 rounded-2xl space-y-4 relative overflow-hidden group hover:border-brand/20 transition-[border-color] duration-200">
              <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/25 flex items-center justify-center text-brand font-sans text-sm font-bold">
                01
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-display font-semibold text-lg">{pilotCopy?.steps.context ?? "Contexto informado"}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  {pilotCopy?.steps.contextDescription ?? "O motivo informado e, quando aplicável, as frentes de interesse ajudam a contextualizar o contato."}
                </p>
              </div>
            <div className="flex items-center gap-1.5 pt-2 text-xs font-sans text-zinc-400">
                <Clock className="w-3 h-3 text-brand motion-safe:animate-pulse" />
                <span>{pilotCopy?.steps.noRepeat ?? "Sem repetir o que você já contou"}</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-charcoal-900 border border-white/[0.04] p-6 sm:p-8 rounded-2xl space-y-4 relative overflow-hidden group hover:border-brand/20 transition-[border-color] duration-200">
              <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/25 flex items-center justify-center text-brand font-sans text-sm font-bold">
                02
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-display font-semibold text-lg">{pilotCopy?.steps.contact ?? "Contato, se necessário"}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  {pilotCopy?.steps.contactDescription ?? "Se for necessário entender melhor sua necessidade, a equipe poderá entrar em contato pelos canais informados."}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-charcoal-900 border border-white/[0.04] p-6 sm:p-8 rounded-2xl space-y-4 relative overflow-hidden group hover:border-brand/20 transition-[border-color] duration-200">
              <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/25 flex items-center justify-center text-brand font-sans text-sm font-bold">
                03
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-display font-semibold text-lg">{pilotCopy?.steps.next ?? "Próximo passo claro"}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  {pilotCopy?.steps.nextDescription ?? "Se houver necessidade de continuidade, a equipe poderá alinhar os próximos passos pelos canais informados."}
                </p>
              </div>
            <div className="flex items-center gap-1.5 pt-2 text-xs font-sans text-zinc-400">
                <CheckCircle className="w-3 h-3 text-brand" />
                <span>{pilotCopy?.steps.contactChannel ?? "Contato pelo canal informado"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ de Alinhamento Comercial */}
        <div className="tag08-contact__faq grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-charcoal-900/40 p-8 sm:p-12 rounded-3xl border border-white/[0.04]">
          <div className="lg:col-span-5 space-y-4">
            <span className="tag08-meta text-xs tracking-widest text-brand uppercase bg-brand/5 border border-brand/20 px-3 py-1 rounded-full col-span-1">
              {pilotCopy?.faq.eyebrow ?? "AJUDA // PERGUNTAS FREQUENTES"}
            </span>
            <h2 className="font-display font-semibold text-3xl text-white leading-tight">
              {pilotCopy?.faq.title ?? "Perguntas frequentes sobre nossa contratação"}
            </h2>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm font-sans">
              {pilotCopy?.faq.description ?? "Esclarecemos os principais termos e processos comerciais para que você compreenda como a TAG08 trabalha com sua empresa."}
            </p>
            
            <div className="pt-6 space-y-4">
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <Lock className="w-4 h-4 text-brand" />
                <span>{pilotCopy?.faq.lgpd ?? "LGPD: Dados protegidos por sigilo"}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <Shield className="w-4 h-4 text-brand" />
                <span>{pilotCopy?.faq.nda ?? "NDA: Acordos de confidencialidade"}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {faqData.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index} 
                  className="border-b border-white/[0.06] pb-4 transition-[border-color] duration-200"
                >
                  <h3 className="m-0">
                    <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    id={`faq-question-${index}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    className="min-h-11 w-full flex justify-between items-center text-left py-3 gap-4 text-white hover:text-brand transition-[transform,color] duration-150 motion-reduce:transition-none active:scale-[0.99] motion-reduce:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
                  >
                    <span className="font-display font-medium text-sm sm:text-base leading-snug">
                      {faq.question}
                    </span>
                    <span className="text-brand shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                    </button>
                  </h3>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${index}`}
                        role="region"
                        aria-labelledby={`faq-question-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-zinc-400 text-xs leading-relaxed pt-2 pb-3 font-sans max-w-2xl">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}


