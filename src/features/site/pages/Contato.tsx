import React, { useRef, useState } from "react";
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
import { motion, AnimatePresence } from "motion/react";
import { ContactFormData } from "../../../types";
import { TAG08_OFFICIAL_CHANNELS, TAG08_OFFICIAL_CONTACT, TAG08_WHATSAPP_CONTACTS, buildGoogleMapsEmbedUrl } from "../../../config/siteNetwork";
import { trackFormError, trackFormStart, trackFormSubmit, trackLeadEvent, trackOutboundClick } from "../../../lib/analytics";
import { queueFormSubmission } from "../../../lib/formQueue";

export default function Contato() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const hasTrackedFormStartRef = useRef(false);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }));
      }, 1500);
    }).catch(err => {
      console.warn("Could not copy clipboard: ", err);
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
    service: "redes-sociais",
    stage: "improviso",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [consent, setConsent] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const tempErrors: Partial<ContactFormData> = {};
    if (!formData.name.trim()) tempErrors.name = "O nome é de preenchimento obrigatório.";
    if (!formData.company.trim()) tempErrors.company = "Insira o nome corporativo da empresa.";
    if (!formData.whatsapp.trim()) tempErrors.whatsapp = "O WhatsApp é vital para iniciarmos o contato.";
    if (!formData.email.includes("@")) tempErrors.email = "Insira um e-mail corporativo válido.";
    setErrors(tempErrors);
    if (Object.keys(tempErrors).length > 0) {
      trackFormError({
        form_name: "contact",
        form_surface: "contact-page",
        error_count: Object.keys(tempErrors).length,
        page_path: "/contato"
      });
    }
    return Object.keys(tempErrors).length === 0;
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
    if (!validate() || !consent) {
      if (!consent) setSubmitError("Confirme o consentimento para enviar seus dados.");
      return;
    }

    setLoading(true);
    setSubmitError("");
    try {
      const locale = document.documentElement.lang.startsWith("en") ? "en" : document.documentElement.lang.startsWith("es") ? "es" : "pt";
      const searchParams = new URLSearchParams(window.location.search);
      const idempotencyKey = crypto.randomUUID();
      const payload = {
        ...formData,
        consent,
        consentVersion: "contact-v1",
        locale,
        source: "contact-page",
        utm: {
          source: searchParams.get("utm_source") || "",
          medium: searchParams.get("utm_medium") || "",
          campaign: searchParams.get("utm_campaign") || "",
          content: searchParams.get("utm_content") || "",
          term: searchParams.get("utm_term") || ""
        }
      };
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
          queueFormSubmission({ endpoint: "/api/contact", idempotencyKey, payload });
          throw new Error("submission_queued");
        }
        setSubmitError("Revise os campos obrigatórios e tente novamente.");
        setLoading(false);
        return;
      }

      setLoading(false);
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
      setLoading(false);
      setSubmitError("Sua solicitação foi salva neste navegador e será reenviada quando a conexão voltar.");
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
    const serviceLabels: Record<string, string> = {
      "redes-sociais": "Gestão de Redes Sociais",
      "branding": "Branding & Identidade",
      "desenvolvimento-web": "Desenvolvimento Web",
      "trafego-performance": "Tráfego Pago & Performance",
      "process-intelligence": "Process Intelligence",
      "process-activation": "Process Activation"
    };

    const stageLabels: Record<string, string> = {
      "improviso": "Estamos operando no improviso",
      "estruturação": "Queremos organizar nossa equipe",
      "escala": "Buscamos escala e performance",
      "outro": "Outro momento corporativo"
    };

    const text = `Olá, preenchi os dados no formulário e quero agilizar meu contato tático.
- Nome: ${formData.name}
- Empresa: ${formData.company}
- E-mail: ${formData.email}
- Divisão de Interesse: ${serviceLabels[formData.service] || formData.service}
- Momento Da Empresa: ${stageLabels[formData.stage] || formData.stage}
- Mensagem: ${formData.message}`;

    const href = buildWhatsAppUrl(contact.phoneE164, text);
    trackOutboundClick({
      label: `WhatsApp ${contact.label}`,
      url: href,
      surface: "contact-fast-track"
    });
    window.open(href, "_blank");
  };

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left column info items */}
        <div className="lg:col-span-5 space-y-8 text-left sticky top-32">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/5 border border-brand/20 rounded-full text-brand text-xs font-sans">
              <span>Sessão de Alinhamento</span>
            </div>
            <h1 className="font-display font-medium text-4xl sm:text-5xl text-gradient leading-[1.1] tracking-tight">
              Vamos entender o melhor <br />
              <span className="text-brand">caminho para sua marca?</span>
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Conte um pouco sobre o seu momento. A TAG08 vai analisar sua necessidade e indicar uma solução com clareza, responsabilidade e direção.
            </p>
          </div>

          <div className="space-y-4 border-t border-b border-white/[0.04] py-8 font-sans">
            {/* Email Contact Card */}
            <div className="flex gap-4 items-center justify-between group/item p-3 -mx-3 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/[0.03] transition-all duration-300">
              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded bg-brand/5 border border-brand/20 text-brand flex items-center justify-center shrink-0">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">Diretoria Geral</h4>
                  <p className="text-zinc-400 text-sm">contato@tag08.com.br</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard("contato@tag08.com.br", "email")}
                className="opacity-60 sm:opacity-0 group-hover/item:opacity-100 focus:opacity-100 transition-all duration-200 text-zinc-500 hover:text-brand p-2 rounded-lg hover:bg-brand/10 border border-transparent hover:border-brand/20 flex items-center gap-1.5 font-mono text-[9px] uppercase font-bold select-none cursor-pointer shrink-0"
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

            <div className="grid grid-cols-1 gap-4">
              {TAG08_WHATSAPP_CONTACTS.map((contact) => (
                <div
                  key={contact.key}
                  className="flex gap-4 items-center justify-between group/item p-3 -mx-3 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/[0.03] transition-all duration-300"
                >
                  <div className="flex gap-4 items-start">
                    <div className={`w-9 h-9 rounded border flex items-center justify-center shrink-0 ${
                      contact.key === "brazil"
                        ? "bg-brand/5 border-brand/20 text-brand"
                        : "bg-brand-secondary/5 border-brand-secondary/20 text-brand-secondary"
                    }`}>
                      <Phone className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">
                        WhatsApp {contact.label}
                      </h4>
                      <p className={`text-sm font-sans font-medium ${
                        contact.key === "brazil" ? "text-zinc-400" : "text-brand-secondary"
                      }`}>
                        {contact.display}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(contact.phoneE164.replace("+", ""), contact.key)}
                    className={`opacity-60 sm:opacity-0 group-hover/item:opacity-100 focus:opacity-100 transition-all duration-200 p-2 rounded-lg border border-transparent flex items-center gap-1.5 font-mono text-[9px] uppercase font-bold select-none cursor-pointer shrink-0 ${
                      contact.key === "brazil"
                        ? "text-zinc-500 hover:text-brand hover:bg-brand/10 hover:border-brand/20"
                        : "text-zinc-500 hover:text-brand-secondary hover:bg-brand-secondary/10 hover:border-brand-secondary/20"
                    }`}
                  >
                    {copiedStates[contact.key] ? (
                      <>
                        <CheckCircle className={`w-3.5 h-3.5 ${contact.key === "brazil" ? "text-brand" : "text-brand-secondary"}`} />
                        <span className={contact.key === "brazil" ? "text-brand" : "text-brand-secondary"}>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Address Card */}
            <div className="flex gap-4 items-center justify-between group/item p-3 -mx-3 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/[0.03] transition-all duration-300">
              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded bg-brand/5 border border-brand/20 text-brand flex items-center justify-center shrink-0">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">Nosso Escritório</h4>
                  <p className="text-zinc-400 text-sm">{TAG08_OFFICIAL_CONTACT.address}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(TAG08_OFFICIAL_CONTACT.address, "address")}
                className="opacity-60 sm:opacity-0 group-hover/item:opacity-100 focus:opacity-100 transition-all duration-200 text-zinc-500 hover:text-brand p-2 rounded-lg hover:bg-brand/10 border border-transparent hover:border-brand/20 flex items-center gap-1.5 font-mono text-[9px] uppercase font-bold select-none cursor-pointer shrink-0"
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

            <div className="rounded-2xl border border-white/[0.05] bg-black/20 overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.24)]">
              <div className="flex items-center justify-between gap-4 px-4 pt-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest font-mono text-brand font-black">Google Maps</p>
                  <h4 className="text-white text-sm font-semibold">Localização e avaliações da TAG08</h4>
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
                  className="inline-flex items-center gap-2 rounded-xl border border-brand/20 bg-brand/10 px-3 py-2 text-[10px] font-mono font-black uppercase tracking-widest text-brand transition-colors hover:bg-brand hover:text-black"
                >
                  Abrir no Maps
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="mt-4 h-[280px] sm:h-[320px]">
                <iframe
                  title="Mapa da TAG08"
                  src={buildGoogleMapsEmbedUrl(TAG08_OFFICIAL_CONTACT.address)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              </div>

              <div className="px-4 pb-4 pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-[11px] text-zinc-500 leading-relaxed max-w-lg">
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
                  className="inline-flex items-center gap-2 text-[10px] font-mono font-black uppercase tracking-widest text-white hover:text-brand transition-colors"
                >
                  Ver avaliações
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            </div>

          <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand" />
              <h3 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">
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
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-black/20 px-4 py-3 transition-all duration-200 hover:border-brand/40 hover:bg-brand/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
                  >
                    <div>
                      <p className="text-sm text-white font-medium">{channel.label}</p>
                      <p className="text-[11px] text-zinc-500">{host}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand shrink-0" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="bg-charcoal-900 border border-white/[0.04] p-5 rounded-lg flex items-start gap-3">
            <ClipboardCheck className="w-5 h-5 text-brand shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-400 leading-relaxed">
              <strong>Procedimento pós-envio:</strong> Respondemos em no máximo 6 horas úteis enviando uma prévia diagnóstica da presença da sua marca direto no seu número WhatsApp.
            </p>
          </div>
        </div>

        {/* Right column form */}
        <div className="lg:col-span-7">
          <div className="bg-charcoal-900 border border-white/[0.06] rounded-2xl p-6 sm:p-10 shadow-xl backdrop-blur-md relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6 text-left"
                >
                  {/* Row Name and company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                        Qual o seu nome? *
                      </label>
                      <input
                        id="form-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full bg-zinc-950 border rounded-xl p-3 text-sm focus:outline-none focus:border-brand text-white transition-all ${
                          errors.name ? "border-red-500/50" : "border-white/[0.08]"
                        }`}
                        placeholder="Ex: Fernando Guedes"
                      />
                      {errors.name && (
                        <p className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="company" className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                        Nome da Empresa *
                      </label>
                      <input
                        id="form-company"
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className={`w-full bg-zinc-950 border rounded-xl p-3 text-sm focus:outline-none focus:border-brand text-white transition-all ${
                          errors.company ? "border-red-500/50" : "border-white/[0.08]"
                        }`}
                        placeholder="Ex: Clínica Guedes Ltda"
                      />
                      {errors.company && (
                        <p className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.company}</p>
                      )}
                    </div>
                  </div>

                  {/* Row Whatsapp and email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="whatsapp" className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                        WhatsApp *
                      </label>
                      <input
                        id="form-whatsapp"
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className={`w-full bg-zinc-950 border rounded-xl p-3 text-sm focus:outline-none focus:border-brand text-white transition-all ${
                          errors.whatsapp ? "border-red-500/50" : "border-white/[0.08]"
                        }`}
                        placeholder="Ex: (11) 99999-9999"
                      />
                      {errors.whatsapp && (
                        <p className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.whatsapp}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                        E-mail Corporativo *
                      </label>
                      <input
                        id="form-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full bg-zinc-950 border rounded-xl p-3 text-sm focus:outline-none focus:border-brand text-white transition-all ${
                          errors.email ? "border-red-500/50" : "border-white/[0.08]"
                        }`}
                        placeholder="Ex: fernando@clinicaguedes.com"
                      />
                      {errors.email && (
                        <p className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Dropdowns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="form-service" className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                        Serviço de maior interesse
                      </label>
                      <select
                        id="form-service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl p-3 text-sm focus:outline-none focus:border-brand text-zinc-300"
                      >
                        <option value="redes-sociais">Gestão de Redes Sociais</option>
                        <option value="branding">Branding &amp; Identidade Visual</option>
                        <option value="desenvolvimento-web">Desenvolvimento Web</option>
                        <option value="trafego-performance">Tráfego Pago &amp; Performance</option>
                        <option value="process-intelligence">Process Intelligence</option>
                        <option value="process-activation">Process Activation</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="form-stage" className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                        Momento Atual da Marca
                      </label>
                      <select
                        id="form-stage"
                        name="stage"
                        value={formData.stage}
                        onChange={handleChange}
                        className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl p-3 text-sm focus:outline-none focus:border-brand text-zinc-300"
                      >
                        <option value="improviso">Produzimos conteúdo sem direção estratégica</option>
                        <option value="estruturação">Queremos documentar playbooks e processos</option>
                        <option value="escala">Temos posicionamento claro e queremos escalar</option>
                        <option value="outro">Recém iniciando no setor comercial digital</option>
                      </select>
                    </div>
                  </div>

                  {/* Message field */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                      Conte mais detalhes sobre suas metas corporativas
                    </label>
                    <textarea
                      id="form-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl p-3 text-sm focus:outline-none focus:border-brand text-white resize-none"
                      placeholder="Fale brevemente sobre o seu modelo de negócio, seus principais canais atuais e quais são os gargalos de posicionamento e processos hoje..."
                    />
                  </div>

                  {/* LGPD Compliance badge & Data Security Lock Notice */}
                  <label className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(event) => setConsent(event.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[var(--color-brand)]"
                    />
                    <span className="text-[10px] text-zinc-300 leading-relaxed font-sans">
                      Autorizo o uso destes dados para retorno sobre esta solicitação, conforme o aviso de privacidade da TAG08.
                    </span>
                  </label>
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 mt-1.5 animate-pulse" />
                    <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                      <strong>Compromisso de Confidencialidade (LGPD):</strong> Seus dados corporativos e de contato estão 100% blindados sob camadas de criptografia. Nós nunca compartilhamos informações operacionais e não enviamos spam comercial.
                    </p>
                  </div>

                  {submitError ? <p role="alert" className="text-xs text-red-400">{submitError}</p> : null}

                  {/* Button Submit */}
                  <div className="pt-2">
                    <button
                      id="btn-form-submit"
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand hover:bg-brand-dark text-black font-bold font-mono text-xs uppercase py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_25px_rgba(var(--color-brand-rgb),0.15)]"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-black border-r-transparent rounded-full animate-spin" /> Verificando Dados...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          Solicitar Análise de Posicionamento <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success-container"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-8 text-center py-6"
                >
                  <div className="w-16 h-16 rounded-full bg-brand/10 border-2 border-brand text-brand flex items-center justify-center mx-auto shadow-2xl">
                    <CheckCircle className="w-9 h-9" />
                  </div>
                  
                  <div className="space-y-3 max-w-lg mx-auto">
                    <h3 className="font-display font-semibold text-2xl text-white">Mensagem Enviada!</h3>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      Prezado(a) <strong>{formData.name}</strong>, agradecemos a sua confiança. A equipe de consultoria estratégica da <strong>TAG08</strong> já foi informada do seu interesse.
                    </p>
                    <p className="text-zinc-400 text-xs font-sans">
                      Em breve (no máximo 6 horas úteis) entraremos em contato enviando um estudo prévio do cenário da sua empresa <strong>{formData.company}</strong>.
                    </p>
                  </div>

                  {/* Fast track to immediate whatsapp option */}
                  <div className="bg-zinc-950 p-6 rounded-xl border border-white/[0.04] space-y-4 max-w-md mx-auto">
                    <div className="flex justify-center items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-brand" />
                      <span className="font-mono text-[10px] tracking-widest text-brand uppercase">Fast Track Recomendado</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      Deseja agilizar os passos e bater um papo imediato por WhatsApp com o consultor agora mesmo? Nosso sistema condensou suas respostas abaixo:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {TAG08_WHATSAPP_CONTACTS.map((contact) => (
                        <button
                          key={contact.key}
                          type="button"
                          onClick={() => handleLaunchWhatsAppFastTrack(contact)}
                          className={`w-full font-semibold text-xs font-sans py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                            contact.key === "brazil"
                              ? "bg-brand hover:bg-brand-dark text-black"
                              : "bg-brand-secondary hover:bg-brand-secondary/90 text-black"
                          }`}
                        >
                          Falar no WhatsApp {contact.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* SECAO COMPLEMENTAR: ALINHAMENTO COM O PUBLICO ALVO */}
      <div className="max-w-7xl mx-auto px-6 mt-24 pt-20 border-t border-white/[0.04] space-y-20 text-left">
        
        {/* Próximos Passos (Timeline) */}
        <div className="space-y-12 animate-fade-in">
          <div className="text-center md:text-left space-y-4">
            <span className="font-mono text-[10px] tracking-widest text-brand uppercase bg-brand/5 border border-brand/20 px-3 py-1 rounded-full">
              PROCESSO DE ANALISE // TRANSPARENCIA
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-white">
              O que acontece após o envio dos seus dados?
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">
              Respeitamos o seu tempo e o de sua equipe. Nosso processo comercial é focado em clareza técnica imediata, eliminando reuniões comerciais vazias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-charcoal-900 border border-white/[0.04] p-6 sm:p-8 rounded-2xl space-y-4 relative overflow-hidden group hover:border-brand/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/25 flex items-center justify-center text-brand font-sans text-sm font-bold">
                01
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-display font-semibold text-lg">Análise Preliminar</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  Estudamos os canais atuais de sua marca, concorrentes mapeados e velocidade de carregamento dos seus criativos e sites. Criamos hipóteses válidas antes de qualquer contato.
                </p>
              </div>
              <div className="flex items-center gap-1.5 pt-2 text-[10px] font-sans text-zinc-500">
                <Clock className="w-3 h-3 text-brand animate-pulse" />
                <span>Prazo: nas primeiras 2h úteis</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-charcoal-900 border border-white/[0.04] p-6 sm:p-8 rounded-2xl space-y-4 relative overflow-hidden group hover:border-brand/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/25 flex items-center justify-center text-brand font-sans text-sm font-bold">
                02
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-display font-semibold text-lg">Retorno Diagnóstico</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  Enviamos as primeiras impressões táticas direto no seu WhatsApp de forma resumida e direta. Se houver fit de trabalho inicial, propomos uma agenda rápida de alinhamento.
                </p>
              </div>
              <div className="flex items-center gap-1.5 pt-2 text-[10px] font-sans text-zinc-500">
                <MessageSquare className="w-3 h-3 text-brand" />
                <span>Prazo: até 6h úteis totais</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-charcoal-900 border border-white/[0.04] p-6 sm:p-8 rounded-2xl space-y-4 relative overflow-hidden group hover:border-brand/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/25 flex items-center justify-center text-brand font-sans text-sm font-bold">
                03
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-display font-semibold text-lg">Chamada de Alinhamento</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  Uma conversa de 15 minutos baseada em soluções técnicas. Sanamos suas dúvidas sobre nossos playbooks operacionais de processos e apresentamos o plano de expansão ideal.
                </p>
              </div>
              <div className="flex items-center gap-1.5 pt-2 text-[10px] font-sans text-zinc-500">
                <CheckCircle className="w-3 h-3 text-brand" />
                <span>Duração: Chamada ágil de 15 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ de Alinhamento Comercial */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-charcoal-900/40 p-8 sm:p-12 rounded-3xl border border-white/[0.04]">
          <div className="lg:col-span-5 space-y-4">
            <span className="font-mono text-[10px] tracking-widest text-brand uppercase bg-brand/5 border border-brand/20 px-3 py-1 rounded-full col-span-1">
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
                  className="border-b border-white/[0.06] pb-4 transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center text-left py-3 gap-4 text-white hover:text-brand transition-colors focus:outline-none"
                  >
                    <span className="font-display font-medium text-sm sm:text-base leading-snug">
                      {faq.question}
                    </span>
                    <span className="text-brand shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
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


