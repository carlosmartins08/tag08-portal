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
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ContactFormData, PARTNERSHIP_MODALITY_VALUES, type PartnershipModality } from "../../../types";
import { TAG08_OFFICIAL_CHANNELS, TAG08_OFFICIAL_CONTACT, TAG08_WHATSAPP_CONTACTS, buildGoogleMapsEmbedUrl } from "../../../config/siteNetwork";
import { trackFormError, trackFormStart, trackFormSubmit, trackLeadEvent, trackOutboundClick } from "../../../lib/analytics";
import { queueFormSubmission, removeQueuedSubmission } from "../../../lib/formQueue";
import { COOKIE_CONSENT_EVENT, readCookiePreferences, type CookiePreferences } from "../../../lib/cookieConsent";
import CountryFlag from "../../../components/CountryFlag";
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

export default function Contato({ locale = "pt" }: { locale?: RouteLocale }) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [marketingConsent, setMarketingConsent] = useState(false);
  const hasTrackedFormStartRef = useRef(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
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

  const faqData = [
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
      question: "Qual o perfil de cliente e faturamento atendido?",
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
  const finalStep = isPartnership ? 4 : 3;
  const isSubmitStep = activeStep === finalStep;

  useEffect(() => {
    const context = parseContactJourneyContext(window.location.search);
    setJourneyContext(context);
    if (!context.intent && !context.requestType) return;

    setFormData((previous) => ({
      ...previous,
      ...(context.requestType ? { requestType: context.requestType } : {}),
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
      return;
    }
    if (activeStep === 1 && formData.requestType === "partnership" && !partnershipModality) {
      setSubmitError("Escolha a modalidade de parceria para continuar.");
      return;
    }
    if (activeStep === 2 && formData.requestType === "new_project" && !formData.needsServiceGuidance && formData.serviceInterests.length === 0) {
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
    setFormData((prev) => ({
      ...prev,
      requestType,
      serviceInterests: requestType === "new_project" ? prev.serviceInterests : [],
      needsServiceGuidance: requestType === "new_project" ? prev.needsServiceGuidance : false
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
    const serviceInterests = isNewProject ? formData.serviceInterests : [];
    const needsServiceGuidance = isNewProject && formData.needsServiceGuidance;
    const legacyService = !isNewProject
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
    queueFormSubmission({ endpoint: "/api/contact", idempotencyKey, payload });
    let queuedForRetry = true;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error("submission_queued");
        }
        setSubmitError("Revise os campos obrigatórios e tente novamente.");
        removeQueuedSubmission(idempotencyKey);
        queuedForRetry = false;
        setLoading(false);
        return;
      }

      setLoading(false);
      removeQueuedSubmission(idempotencyKey);
      setSuccess(true);
      trackFormSubmit({
        form_name: "contact",
        form_surface: "contact-page",
        status: "success",
        page_path: "/contato"
      });
      trackLeadEvent({
        action: "contact_form_submit",
        surface: "contact-form",
        status: "success"
      });
    } catch {
      if (!queuedForRetry) {
        queueFormSubmission({ endpoint: "/api/contact", idempotencyKey, payload });
        queuedForRetry = true;
      }
      setLoading(false);
      setSubmitError("Não foi possível concluir o envio agora. Sua solicitação foi salva neste navegador para nova tentativa automática.");
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
    const requestLabels: Record<string, string> = {
      new_project: "Novo projeto",
      existing_client: "Cliente atual",
      partnership: "Parceria"
    };

    const selectedServices = formData.serviceInterests.map((service) => CONTACT_SERVICE_LABELS[service] || service).join(", ");
    const text = `Olá, preenchi os dados no formulário e quero agilizar meu contato.
- Motivo: ${requestLabels[formData.requestType] || "Contato"}
- Nome: ${formData.name}
- Empresa: ${formData.company}
- E-mail: ${formData.email}
- Serviços de interesse: ${formData.needsServiceGuidance ? "Preciso de orientação ou tenho outra necessidade" : selectedServices || "Não informado"}
- Mensagem: ${formData.message}`;

    const href = buildWhatsAppUrl(contact.phoneE164, text);
    trackOutboundClick({
      label: `WhatsApp ${contact.label}`,
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
              <span>Sessão de Alinhamento</span>
            </div>
            <h1 className="font-display font-medium text-4xl sm:text-5xl text-gradient leading-[1.1] tracking-tight">
              Vamos entender o melhor{" "}
              <span className="text-brand">caminho para sua marca?</span>
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Conte o que trouxe você até aqui. Suas respostas ajudam a contextualizar o contato e podem tornar a conversa mais útil.
            </p>
          </div>

          <div className="tag08-contact__directory space-y-4 border-t border-b border-white/[0.04] py-8 font-sans">
            <h2 className="sr-only">Canais de contato</h2>
            <div className="tag08-contact__direct-contacts space-y-4">

            {/* Email Contact Card */}
            <div className="flex gap-4 items-center justify-between group/item p-3 -mx-3 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/[0.03] transition-[background-color,border-color] duration-200">
              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded bg-brand/5 border border-brand/20 text-brand flex items-center justify-center shrink-0">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-xs tracking-wider tag08-meta">Diretoria Geral</h3>
                  <a href="mailto:contato@tag08.com.br" className="text-zinc-300 text-sm underline-offset-4 hover:text-brand hover:underline focus-visible:rounded-sm">contato@tag08.com.br</a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard("contato@tag08.com.br", "email")}
                aria-label="Copiar e-mail da diretoria"
                className="min-h-11 min-w-11 justify-center text-zinc-400 sm:opacity-70 sm:group-hover/item:opacity-100 focus-visible:opacity-100 transition-[transform,opacity,color,background-color,border-color] duration-150 motion-reduce:transition-none active:scale-[0.98] motion-reduce:active:scale-100 text-xs rounded-lg hover:text-brand hover:bg-brand/10 border border-transparent hover:border-brand/20 flex items-center gap-1.5 font-sans uppercase font-bold select-none cursor-pointer shrink-0"
              >
                {copiedStates["email"] ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-brand" />
                    <span className="text-brand">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
            {copiedStates["email-error"] && <p className="-mt-2 text-xs text-state-warning">Não foi possível copiar. Selecione o e-mail manualmente.</p>}

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
                        <CountryFlag country={contact.country} className="text-sm leading-none" /> WhatsApp {contact.label}
                      </h3>
                      <a
                        href={buildWhatsAppUrl(contact.phoneE164, "Olá, gostaria de falar com a TAG08.")}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackOutboundClick({ label: `WhatsApp ${contact.label}`, url: buildWhatsAppUrl(contact.phoneE164, "Olá, gostaria de falar com a TAG08."), surface: "contact-directory-whatsapp" })}
                        className="text-sm font-sans font-medium text-zinc-400 underline-offset-4 hover:text-brand hover:underline">
                        {contact.display}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(contact.phoneE164.replace("+", ""), contact.key)}
                    aria-label={`Copiar WhatsApp ${contact.label}`}
                    className="min-h-11 min-w-11 justify-center sm:opacity-70 sm:group-hover/item:opacity-100 focus-visible:opacity-100 transition-[transform,opacity,color,background-color,border-color] duration-150 motion-reduce:transition-none active:scale-[0.98] motion-reduce:active:scale-100 p-2 rounded-lg border border-transparent flex items-center gap-1.5 font-sans text-xs uppercase font-bold select-none cursor-pointer shrink-0 text-zinc-400 hover:text-brand hover:bg-brand/10 hover:border-brand/20"
                  >
                    {copiedStates[contact.key] ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-brand" />
                        <span className="text-brand">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                  </div>
                  {copiedStates[`${contact.key}-error`] && <p className="-mt-2 text-xs text-state-warning">Não foi possível copiar este número.</p>}
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
                  <h3 className="text-white font-semibold text-xs tracking-wider tag08-meta">Nosso Escritório</h3>
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
                aria-label="Copiar endereço do escritório"
                className="min-h-11 min-w-11 justify-center text-zinc-400 sm:opacity-70 sm:group-hover/item:opacity-100 focus-visible:opacity-100 transition-[transform,opacity,color,background-color,border-color] duration-150 motion-reduce:transition-none active:scale-[0.98] motion-reduce:active:scale-100 text-xs rounded-lg hover:text-brand hover:bg-brand/10 border border-transparent hover:border-brand/20 flex items-center gap-1.5 font-sans uppercase font-bold select-none cursor-pointer shrink-0"
              >
                {copiedStates["address"] ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-brand" />
                    <span className="text-brand">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
            </div>

            <div className="tag08-contact__map-card rounded-xl border border-white/[0.05] bg-black/20 overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.24)]">
              <div className="flex items-center justify-between gap-4 px-4 pt-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest tag08-meta text-brand font-black">Google Maps</p>
                  <h3 className="text-white text-sm font-semibold">Localização e avaliações da TAG08</h3>
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
                  Abrir no Maps
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
                      O mapa incorporado só é carregado quando os cookies de marketing já foram autorizados. Você também pode abrir a localização diretamente no Google Maps.
                    </p>
                    <a
                      href={TAG08_OFFICIAL_CONTACT.googleBusinessUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-brand/30 bg-brand/10 px-4 py-2 text-xs tag08-meta font-black uppercase tracking-widest text-brand transition-colors hover:bg-brand hover:text-black"
                    >
                      Abrir no Google Maps
                    </a>
                  </div>
                )}
              </div>

              <div className="px-4 pb-4 pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
                  O mapa e o perfil do Google Business concentram rota, endereço oficial e as avaliações públicas que validam nossa presença local.
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
                  Ver avaliações
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            </div>

          <div className="tag08-contact__channels rounded-xl border border-white/[0.05] bg-white/[0.02] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand" />
              <h3 className="text-white font-semibold text-xs tracking-wider tag08-meta">
                Canais oficiais da TAG08
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
              <strong>Após o envio:</strong> Você verá uma confirmação nesta página e poderá seguir pelos canais de contato direto, se preferir.
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
                    <span className="tag08-label">{isPartnership ? "Programa de Parceria" : "Diagnóstico inicial"}</span>
                    <h2 ref={stepHeadingRef} tabIndex={-1} className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">{activeStep === 1 ? "Como podemos ajudar?" : activeStep === 2 ? "Vamos entender o contexto" : activeStep === 3 ? "Como falar com você?" : "Revise sua inscrição"}</h2>
                    <p className="text-sm leading-relaxed text-zinc-400">Etapa {activeStep} de {finalStep} · {isPartnership ? "Revise os dados antes do envio." : "Suas respostas ajudam nossa equipe a chegar mais preparada."}</p>
                    <div className="mt-4 flex gap-2" role="progressbar" aria-label="Progresso do formulário" aria-valuemin={1} aria-valuemax={finalStep} aria-valuenow={activeStep}>
                      {Array.from({ length: finalStep }, (_, index) => index + 1).map((step) => <span key={step} className={`h-1 flex-1 rounded-full ${step <= activeStep ? "bg-brand" : "bg-white/10"}`} />)}
                    </div>
                  </div>
                  <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="contact-website">Não preencha este campo</label>
                    <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" ref={honeypotRef} />
                  </div>
                  {activeStep === 1 && <fieldset className="space-y-3">
                    <legend className="text-sm font-semibold text-white">Qual é o motivo do seu contato?</legend>
                    {[["new_project", "Quero iniciar um projeto"], ["existing_client", "Já sou cliente"], ["partnership", "Quero propor uma parceria"]].map(([value, label]) => (
                      <label key={value} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${formData.requestType === value ? "border-brand bg-brand/10 text-white" : "border-white/[0.08] text-zinc-300 hover:border-white/20"}`}>
                        <input type="radio" name="requestType" value={value} checked={formData.requestType === value} onChange={() => handleRequestTypeChange(value as ContactFormData["requestType"])} className="accent-[var(--color-brand)]" />{label}
                      </label>
                    ))}
                  </fieldset>}
                  {activeStep === 1 && isPartnership && <fieldset className="space-y-3">
                    <legend className="text-sm font-semibold text-white">Qual modalidade de parceria deseja propor?</legend>
                    {PARTNERSHIP_MODALITY_VALUES.map((modality) => (
                      <label key={modality} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${partnershipModality === modality ? "border-brand bg-brand/10 text-white" : "border-white/[0.08] text-zinc-300 hover:border-white/20"}`}>
                        <input type="radio" name="partnershipModality" value={modality} checked={partnershipModality === modality} onChange={() => { setPartnershipModality(modality); setSubmitError(""); }} className="accent-[var(--color-brand)]" />{PARTNERSHIP_MODALITY_LABELS[modality]}
                      </label>
                    ))}
                  </fieldset>}
                  {/* Row Name and company */}
                  {activeStep === 3 && <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="form-name" className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                        Qual o seu nome? *
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
                        placeholder="Ex: Fernando Guedes"
                      />
                      {errors.name && (
                        <p id="form-name-error" className="text-xs text-state-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="form-company" className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                        Nome da Empresa *
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
                        placeholder="Ex: Clínica Guedes Ltda"
                      />
                      {errors.company && (
                        <p id="form-company-error" className="text-xs text-state-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.company}</p>
                      )}
                    </div>
                  </div>

                  {/* Row Whatsapp and email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="form-whatsapp" className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                        WhatsApp *
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
                        placeholder="Ex: (11) 99999-9999"
                      />
                      {errors.whatsapp && (
                        <p id="form-whatsapp-error" className="text-xs text-state-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.whatsapp}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="form-email" className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">
                        E-mail Corporativo *
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
                        placeholder="Ex: fernando@clinicaguedes.com"
                      />
                      {errors.email && (
                        <p id="form-email-error" className="text-xs text-state-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>
                      )}
                    </div>
                  </div>

                  </div>}

                  {activeStep === 2 && <div className="space-y-5">
                    {formData.requestType === "new_project" && journeyContext.intent && <p className="rounded-lg border border-brand/20 bg-brand/5 px-3 py-2 text-xs leading-relaxed text-zinc-300" role="status">
                      Sugestão a partir de {journeyContext.origin ? CONTACT_ORIGIN_LABELS[journeyContext.origin] : "sua escolha"}: <strong className="text-white">{CONTACT_INTENT_CONTEXT_LABELS[journeyContext.intent]}</strong>. Você pode alterar ou complementar abaixo.
                    </p>}
                    {formData.requestType === "new_project" && !journeyContext.intent && journeyContext.origin === "sebraetec" && <p className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs leading-relaxed text-zinc-300" role="status">
                      Você veio da página do Sebraetec. Registre a necessidade que deseja encaminhar ou escolha outra opção.
                    </p>}
                    {formData.requestType === "new_project" ? <fieldset className="space-y-3">
                      <legend className="text-sm font-semibold text-white">Qual necessidade você quer encaminhar? <span className="font-normal text-zinc-400">(pode selecionar mais de uma)</span></legend>
                      <div className="space-y-4">
                        {CONTACT_INTENT_GROUPS.map((group) => (
                          <div key={group.label} role="group" aria-label={group.label} className="space-y-2">
                            <p className="tag08-meta text-xs font-semibold uppercase tracking-wider text-zinc-400">{group.label}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {group.options.map(([value, label]) => (
                                <label key={value} className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors ${formData.serviceInterests.includes(value) ? "border-brand bg-brand/10 text-white" : "border-white/[0.08] text-zinc-300 hover:border-white/20"}`}>
                                  <input type="checkbox" checked={formData.serviceInterests.includes(value)} onChange={() => toggleServiceInterest(value)} className="accent-[var(--color-brand)]" />{label}
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs leading-relaxed text-zinc-400">Tráfego, SEO, copywriting e performance são capacidades de apoio, não famílias independentes. Se a sua necessidade não estiver clara, descreva o contexto abaixo ou escolha a opção de orientação.</p>
                      <label className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm ${formData.needsServiceGuidance ? "border-brand bg-brand/10 text-white" : "border-white/[0.08] text-zinc-300"}`}>
                        <input type="checkbox" checked={formData.needsServiceGuidance} onChange={(event) => { setFormData((prev) => ({ ...prev, needsServiceGuidance: event.target.checked, serviceInterests: event.target.checked ? [] : prev.serviceInterests })); setSubmitError(""); }} className="accent-[var(--color-brand)]" />Preciso de orientação ou tenho outra necessidade
                      </label>
                    </fieldset> : <p className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm leading-relaxed text-zinc-300">{formData.requestType === "existing_client" ? "Conte o que você precisa agora e, se souber, identifique o projeto ou serviço." : "Conte brevemente qual parceria propõe e quem gostaria de envolver."}</p>}
                    <div className="space-y-2">
                      <label htmlFor="form-message" className="text-xs tag08-meta text-zinc-400 uppercase tracking-wider">{formData.requestType === "existing_client" ? "O que você precisa agora?" : formData.requestType === "partnership" ? "Qual parceria você propõe?" : "Qual resultado você busca?"} <span className="normal-case">(opcional)</span></label>
                      <textarea id="form-message" name="message" value={formData.message} onChange={handleChange} rows={4} maxLength={4000} className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg p-3 text-sm focus:outline-none focus:border-brand text-white resize-y" placeholder="Compartilhe apenas o necessário. Não inclua senhas ou dados confidenciais." />
                    </div>
                  </div>}

                  {activeStep === 3 && <>
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm text-zinc-300">
                      <p><strong className="text-white">Motivo:</strong> {formData.requestType === "new_project" ? "Novo projeto" : formData.requestType === "existing_client" ? "Cliente atual" : "Parceria"}</p>
                      {formData.requestType === "new_project" && <p className="mt-1"><strong className="text-white">Frentes:</strong> {formData.needsServiceGuidance ? "Preciso de orientação ou tenho outra necessidade" : formData.serviceInterests.map((service) => CONTACT_SERVICE_LABELS[service] || service).join(", ")}</p>}
                    </div>
                    <p className="text-xs text-zinc-400">Confira o motivo e as frentes informados antes de enviar sua solicitação.</p>
                  </>}
                  {activeStep === 4 && isPartnership && <div className="space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm text-zinc-300">
                    <dl className="space-y-3">
                      <div><dt className="font-semibold text-white">Modalidade</dt><dd>{partnershipModality ? PARTNERSHIP_MODALITY_LABELS[partnershipModality] : "Não selecionada"}</dd></div>
                      <div><dt className="font-semibold text-white">Nome</dt><dd>{formData.name}</dd></div>
                      <div><dt className="font-semibold text-white">Empresa</dt><dd>{formData.company}</dd></div>
                      <div><dt className="font-semibold text-white">E-mail e WhatsApp</dt><dd>{formData.email} · {formData.whatsapp}</dd></div>
                      <div><dt className="font-semibold text-white">Proposta</dt><dd>{formData.message.trim() || "Nenhum contexto adicional informado."}</dd></div>
                    </dl>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => { setPartnershipSendConfirmed(false); goToStep(1); }} className="min-h-10 rounded-lg border border-white/10 px-4 text-xs text-white hover:bg-white/5">Alterar modalidade</button>
                      <button type="button" onClick={() => { setPartnershipSendConfirmed(false); goToStep(2); }} className="min-h-10 rounded-lg border border-white/10 px-4 text-xs text-white hover:bg-white/5">Alterar proposta</button>
                      <button type="button" onClick={() => { setPartnershipSendConfirmed(false); goToStep(3); }} className="min-h-10 rounded-lg border border-white/10 px-4 text-xs text-white hover:bg-white/5">Alterar contato</button>
                    </div>
                  </div>}
                  {submitError ? <p role="alert" className="text-xs text-state-danger">{submitError}</p> : null}
                  <div className="flex gap-3 pt-2">
                    {activeStep > 1 && <button type="button" onClick={() => { setSubmitError(""); setPartnershipSendConfirmed(false); goToStep(activeStep - 1); }} className="min-h-11 rounded-lg border border-white/10 px-5 text-sm text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-transform duration-150 motion-reduce:transition-none active:scale-[0.98] motion-reduce:active:scale-100">Voltar</button>}
                    {activeStep < finalStep && <button type="button" onClick={continueFromStep} className="min-h-11 flex-1 rounded-lg bg-brand px-5 text-sm font-bold text-black hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-transform duration-150 motion-reduce:transition-none active:scale-[0.98] motion-reduce:active:scale-100">{isPartnership && activeStep === 3 ? "Revisar inscrição" : "Continuar"} <ArrowRight className="ml-2 inline h-4 w-4" /></button>}
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
                      Autorizo o uso destes dados para retorno sobre esta solicitação, conforme o aviso de privacidade da TAG08.
                    </span>
                  </label>
                  {consentError && <p id="form-consent-error" className="text-xs text-state-danger" role="alert">Confirme o consentimento para enviar seus dados.</p>}
                  {isPartnership && isSubmitStep && <>
                    <label htmlFor="partnership-send-confirmation" className={`flex items-start gap-2.5 px-4 py-3 rounded-xl bg-white/[0.02] border cursor-pointer ${partnershipSendConfirmationError ? "border-state-danger/70" : "border-white/[0.05]"}`}>
                      <input id="partnership-send-confirmation" type="checkbox" checked={partnershipSendConfirmed} onChange={(event) => { setPartnershipSendConfirmed(event.target.checked); if (event.target.checked) setPartnershipSendConfirmationError(false); }} aria-invalid={partnershipSendConfirmationError} aria-describedby={partnershipSendConfirmationError ? "partnership-send-confirmation-error" : undefined} className="mt-0.5 h-4 w-4 accent-[var(--color-brand)]" />
                      <span className="text-xs text-zinc-300 leading-relaxed">Confirmo o envio desta inscrição na modalidade selecionada.</span>
                    </label>
                    {partnershipSendConfirmationError && <p id="partnership-send-confirmation-error" className="text-xs text-state-danger" role="alert">Confirme o envio da inscrição para continuar.</p>}
                  </>}
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 mt-1.5 motion-safe:animate-pulse" aria-hidden="true" />
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      <strong>Uso responsável dos dados:</strong> Usaremos estas informações apenas para responder à solicitação e seguir o aviso de privacidade da TAG08. Em falhas temporárias, a solicitação pode ser armazenada localmente para nova tentativa automática.
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
                          <span className="w-4 h-4 border-2 border-black border-r-transparent rounded-full motion-safe:animate-spin" aria-hidden="true" /> Verificando Dados...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          {isPartnership ? "Confirmar e enviar inscrição" : "Enviar solicitação à TAG08"} <ArrowRight className="w-4 h-4" />
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
                    <h3 className="font-display font-semibold text-2xl text-white">{isPartnership ? "Inscrição enviada" : "Mensagem Enviada!"}</h3>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      {isPartnership
                        ? <>Obrigado, <strong>{formData.name}</strong>. Sua inscrição para <strong>{partnershipModality ? PARTNERSHIP_MODALITY_LABELS[partnershipModality] : "parceria"}</strong> foi enviada com sucesso. Esta confirmação registra somente o envio, sem indicar aprovação ou contratação.</>
                        : <>Obrigado, <strong>{formData.name}</strong>. Suas informações foram enviadas com sucesso. Se for necessário, a equipe poderá entrar em contato pelos canais informados para entender melhor sua necessidade.</>}
                    </p>
                  </div>

                  {/* Fast track to immediate whatsapp option */}
                  {!isPartnership && <div className="bg-zinc-950 p-6 rounded-xl border border-white/[0.04] space-y-4 max-w-md mx-auto">
                    <div className="flex justify-center items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-brand" />
                      <span className="tag08-meta text-xs tracking-widest text-brand uppercase">Fast Track Recomendado</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      Ao abrir o WhatsApp, o resumo das respostas será pré-preenchido para você revisar. Ele só será enviado à equipe TAG08 se você tocar em Enviar no aplicativo.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {TAG08_WHATSAPP_CONTACTS.map((contact) => (
                        <button
                          key={contact.key}
                          type="button"
                          onClick={() => handleLaunchWhatsAppFastTrack(contact)}
                          className="w-full font-semibold text-xs font-sans py-3.5 rounded-lg transition-[transform,background-color] duration-150 motion-reduce:transition-none active:scale-[0.98] motion-reduce:active:scale-100 flex items-center justify-center gap-2 bg-brand text-black hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        >
                          Falar no WhatsApp {contact.label}
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
              PRÓXIMOS PASSOS // TRANSPARÊNCIA
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-white">
              O que acontece depois do envio?
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">
              Suas respostas ajudam a contextualizar o pedido. Se necessário, a equipe poderá entrar em contato pelos canais informados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-charcoal-900 border border-white/[0.04] p-6 sm:p-8 rounded-2xl space-y-4 relative overflow-hidden group hover:border-brand/20 transition-[border-color] duration-200">
              <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/25 flex items-center justify-center text-brand font-sans text-sm font-bold">
                01
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-display font-semibold text-lg">Contexto informado</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  O motivo informado e, quando aplicável, as frentes de interesse ajudam a contextualizar o contato.
                </p>
              </div>
            <div className="flex items-center gap-1.5 pt-2 text-xs font-sans text-zinc-400">
                <Clock className="w-3 h-3 text-brand motion-safe:animate-pulse" />
                <span>Sem repetir o que você já contou</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-charcoal-900 border border-white/[0.04] p-6 sm:p-8 rounded-2xl space-y-4 relative overflow-hidden group hover:border-brand/20 transition-[border-color] duration-200">
              <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/25 flex items-center justify-center text-brand font-sans text-sm font-bold">
                02
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-display font-semibold text-lg">Contato, se necessário</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  Se for necessário entender melhor sua necessidade, a equipe poderá entrar em contato pelos canais informados.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-charcoal-900 border border-white/[0.04] p-6 sm:p-8 rounded-2xl space-y-4 relative overflow-hidden group hover:border-brand/20 transition-[border-color] duration-200">
              <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/25 flex items-center justify-center text-brand font-sans text-sm font-bold">
                03
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-display font-semibold text-lg">Próximo passo claro</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  Se houver necessidade de continuidade, a equipe poderá alinhar os próximos passos pelos canais informados.
                </p>
              </div>
            <div className="flex items-center gap-1.5 pt-2 text-xs font-sans text-zinc-400">
                <CheckCircle className="w-3 h-3 text-brand" />
                <span>Contato pelo canal informado</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ de Alinhamento Comercial */}
        <div className="tag08-contact__faq grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-charcoal-900/40 p-8 sm:p-12 rounded-3xl border border-white/[0.04]">
          <div className="lg:col-span-5 space-y-4">
            <span className="tag08-meta text-xs tracking-widest text-brand uppercase bg-brand/5 border border-brand/20 px-3 py-1 rounded-full col-span-1">
              AJUDA // PERGUNTAS FREQUENTES
            </span>
            <h2 className="font-display font-semibold text-3xl text-white leading-tight">
              Perguntas frequentes sobre nossa contratação
            </h2>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm font-sans">
              Esclarecemos os principais termos e processos comerciais de nossa agência de crescimento para que sua marca tenha total segurança jurídica e técnica.
            </p>
            
            <div className="pt-6 space-y-4">
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <Lock className="w-4 h-4 text-brand" />
                <span>LGPD: Dados protegidos por sigilo</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <Shield className="w-4 h-4 text-brand" />
                <span>NDA: Acordos de confidencialidade padrão</span>
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
                    className="min-h-11 w-full flex justify-between items-center text-left py-3 gap-4 text-white hover:text-brand transition-[transform,color] duration-150 motion-reduce:transition-none active:scale-[0.99] motion-reduce:active:scale-100 focus:outline-none"
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


