import React, { useEffect, useRef, useState } from "react";
import ResilientImage from "../../../components/ResilientImage";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  User, 
  Mail, 
  Phone, 
  Linkedin, 
  Globe, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  ArrowUpRight,
  Sparkles, 
  Terminal, 
  Lock,
} from "lucide-react";
import { trackFormError, trackFormStart, trackFormStep, trackFormSubmit, trackOutboundClick } from "../../../lib/analytics";
import { queueFormSubmission } from "../../../lib/formQueue";
import type { RouteLocale } from "../../../config/routeRegistry";
import {
  TALENT_COMMERCIAL_OPERATIONAL_AREAS,
  TALENT_CREATIVE_TECHNICAL_AREAS,
  TALENT_INTEREST_AREAS,
  type TalentInterestArea
} from "../../../types/talent";

interface TalentApplicationContext {
  id: string;
  title: string;
}

export default function TrabalheConosco({ onNavigate, locale = "pt" }: { onNavigate: (page: string) => void; locale?: RouteLocale }) {
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formLinkedin, setFormLinkedin] = useState("");
  const [formResumeUrl, setFormResumeUrl] = useState("");
  const [formPortfolio, setFormPortfolio] = useState("");
  const [interestAreas, setInterestAreas] = useState<TalentInterestArea[]>([]);
  const [otherSpecialty, setOtherSpecialty] = useState("");
  const [experienceSummary, setExperienceSummary] = useState("");
  const [availability, setAvailability] = useState("");
  const [motivation, setMotivation] = useState("");
  const [relevantProjects, setRelevantProjects] = useState("");
  const [relevantExperience, setRelevantExperience] = useState("");
  
  // File Onboarding Wizard state
  const [currentStep, setCurrentStep] = useState(1);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const hasCreativeTechnicalArea = interestAreas.some((area) => TALENT_CREATIVE_TECHNICAL_AREAS.includes(area));
  const hasCommercialOperationalArea = interestAreas.some((area) => TALENT_COMMERCIAL_OPERATIONAL_AREAS.includes(area));

  const toggleInterestArea = (area: TalentInterestArea, checked: boolean) => {
    const nextAreas = checked
      ? [...new Set([...interestAreas, area])]
      : interestAreas.filter((selectedArea) => selectedArea !== area);
    setInterestAreas(nextAreas);
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors.interestAreas;
      delete nextErrors.otherSpecialty;
      return nextErrors;
    });
    if (!nextAreas.includes("other_specialties")) setOtherSpecialty("");
    if (!nextAreas.some((selectedArea) => TALENT_CREATIVE_TECHNICAL_AREAS.includes(selectedArea))) setRelevantProjects("");
    if (!nextAreas.some((selectedArea) => TALENT_COMMERCIAL_OPERATIONAL_AREAS.includes(selectedArea))) setRelevantExperience("");
  };

  useEffect(() => {
    if (currentStep > 1) {
      requestAnimationFrame(() => stepHeadingRef.current?.focus());
    }
  }, [currentStep]);

  const handleOutboundClick = (label: string, url: string, surface: string) => {
    trackOutboundClick({
      label,
      url,
      surface
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (interestAreas.length === 0) newErrors.interestAreas = "Selecione pelo menos uma \u00e1rea de interesse.";
      if (interestAreas.includes("other_specialties") && !otherSpecialty.trim()) newErrors.otherSpecialty = "Descreva a especialidade que deseja indicar.";
      if (!formName.trim()) newErrors.name = "Nome \u00e9 obrigat\u00f3rio";
      if (!/^\S+@\S+\.\S+$/.test(formEmail.trim())) newErrors.email = "E-mail v\u00e1lido \u00e9 obrigat\u00f3rio";
      if (!formPhone.trim()) newErrors.phone = "Telefone \u00e9 obrigat\u00f3rio";
    } else if (step === 2) {
      const validHttpsUrl = (value: string) => {
        if (!value.trim()) return true;
        try {
          return new URL(value.trim()).protocol === "https:";
        } catch {
          return false;
        }
      };
      if (formLinkedin.trim()) {
        try {
          const linkedinUrl = new URL(formLinkedin.trim());
          if (linkedinUrl.protocol !== "https:" || !["linkedin.com", "www.linkedin.com"].includes(linkedinUrl.hostname)) throw new Error("invalid_linkedin");
        } catch {
          newErrors.linkedin = "Use um link v\u00e1lido do LinkedIn com HTTPS.";
        }
      }
      if (!validHttpsUrl(formResumeUrl)) newErrors.resumeUrl = "Use um link seguro (HTTPS) para o curr\u00edculo.";
      if (!validHttpsUrl(formPortfolio)) newErrors.portfolio = "Use um link seguro (HTTPS) para o portf\u00f3lio.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstInvalidField = Object.keys(newErrors)[0];
      const focusTargets: Record<string, string> = { interestAreas: "talent-area-design", otherSpecialty: "talent-other-specialty", resumeUrl: "talent-resume-url" };
      requestAnimationFrame(() => document.getElementById(focusTargets[firstInvalidField] || "talent-" + firstInvalidField)?.focus());
      trackFormError({ form_name: "talent_application", form_surface: "talent-page", error_count: Object.keys(newErrors).length, page_path: "/trabalhe-conosco" });
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3 && !consent) {
        setSubmitError("Confirme o consentimento para revisar sua candidatura.");
        requestAnimationFrame(() => document.getElementById("talent-consent")?.focus());
        return;
      }
      setErrors({});
      setSubmitError("");
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      trackFormStep({
        form_name: "talent_application",
        form_surface: "talent-page",
        step: nextStep,
        total_steps: 4,
        page_path: "/trabalhe-conosco"
      });
    }
  };

  const handlePrevStep = () => {
    setErrors({});
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleApply = () => {
    setCurrentStep(1);
    setErrors({});
    setSubmitSuccess(false);
    trackFormStart({
      form_name: "talent_application",
      form_surface: "talent-page",
      page_path: "/trabalhe-conosco"
    });
    const formElement = document.getElementById("application-form-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrors({});
    setSubmitError("");

    if (currentStep !== 4) return;

    const invalidStep = [1, 2, 3].find((step) => !validateStep(step));
    if (invalidStep !== undefined) {
      setCurrentStep(invalidStep);
      return;
    }

    if (!consent) {
      setCurrentStep(3);
      setSubmitError("Confirme o consentimento para enviar sua candidatura.");
      requestAnimationFrame(() => document.getElementById("talent-consent")?.focus());
      trackFormSubmit({
        form_name: "talent_application",
        form_surface: "talent-page",
        status: "validation_error",
        page_path: "/trabalhe-conosco"
      });
      return;
    }

    setSubmitting(true);
    try {
      const idempotencyKey = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const payload = {
        contractVersion: 2,
        interestAreas: TALENT_INTEREST_AREAS.filter(({ value }) => interestAreas.includes(value)).map(({ value }) => value),
        ...(interestAreas.includes("other_specialties") ? { otherSpecialty } : {}),
        name: formName,
        email: formEmail,
        phone: formPhone,
        linkedin: formLinkedin,
        resumeUrl: formResumeUrl,
        portfolio: formPortfolio,
        experienceSummary,
        availability,
        motivation,
        ...(hasCreativeTechnicalArea ? { relevantProjects } : {}),
        ...(hasCommercialOperationalArea ? { relevantExperience } : {}),
        ...(honeypotRef.current?.value ? { website: honeypotRef.current.value } : {}),
        consent,
        consentVersion: "talent-v2",
        locale,
        source: "talent-page"
      };
      const response = await fetch("/api/talent-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.applicationId) {
        if (response.status >= 500) {
          queueFormSubmission({ endpoint: "/api/talent-applications", idempotencyKey, payload });
          throw new Error("submission_queued");
        }
        setSubmitError("Revise os campos obrigatórios e tente novamente.");
        return;
      }

      setSubmitSuccess(true);
      setCurrentStep(1);
      setFormName("");
      setFormEmail("");
      setFormPhone("");
      setFormLinkedin("");
      setFormResumeUrl("");
      setFormPortfolio("");
      setInterestAreas([]);
      setOtherSpecialty("");
      setExperienceSummary("");
      setAvailability("");
      setMotivation("");
      setRelevantProjects("");
      setRelevantExperience("");
      setConsent(false);
      trackFormSubmit({
        form_name: "talent_application",
        form_surface: "talent-page",
        status: "success",
        page_path: "/trabalhe-conosco"
      });
    } catch {
      setSubmitError("Sua candidatura foi salva neste navegador e será reenviada quando a conexão voltar.");
      trackFormSubmit({
        form_name: "talent_application",
        form_surface: "talent-page",
        status: "queued",
        page_path: "/trabalhe-conosco"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-charcoal-950 text-left relative overflow-hidden">
      
      {/* SECTION 1: THE PREMIUM DARK HERO HEADER (Inspired by mockup's head section) */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-16 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Block */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand/10 border border-brand/20 text-brand font-bold text-xs rounded-lg tracking-widest uppercase tag08-meta">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              CULTURA DE TRABALHO // TAG08
            </div>
            
            <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tighter leading-[1.0]">
              Banco de Talentos da TAG08
              <br />
              <span className="text-brand">Compartilhe seu perfil profissional.</span>
            </h1>
            
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg">
              Você pode compartilhar seu perfil profissional para o Banco de Talentos da TAG08, mesmo quando não há uma vaga aberta. Ele poderá ser considerado em oportunidades futuras, sem garantia de contato ou contratação.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#banco-de-talentos-anchor"
                className="inline-flex min-h-11 items-center gap-2 px-6 py-3 bg-brand text-black tag08-action font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 transition-[background-color,box-shadow] duration-200 shadow-[0_8px_25px_rgba(var(--color-brand-rgb),0.15)]"
              >
                Conhecer o Banco de Talentos <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a 
                href="#aplicacao-direta-anchor" 
                className="inline-flex min-h-11 items-center px-6 py-3 bg-white/5 text-zinc-300 tag08-action text-xs uppercase tracking-widest rounded-xl border border-white/10 hover:border-white/25 hover:text-white focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 transition-[border-color,color,background-color] duration-200"
              >
                Enviar meu perfil
              </a>
            </div>
          </div>

          {/* Right Hero Image Frame (Mockup Style: Tablet Holding Professional) */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 to-transparent rounded-[32px] transform translate-y-3 translate-x-3 -z-10 blur-md pointer-events-none" />
            <div className="relative aspect-[4/5] border border-white/10 rounded-[32px] overflow-hidden bg-charcoal-900 group">
              <ResilientImage
                fallbackLabel="Pessoas TAG08"
                priority
                sizes="(max-width: 1024px) calc(100vw - 3rem), 30rem"
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" 
                alt="Profissional TAG08" 
                className="object-cover transition-transform duration-200 motion-reduce:transition-none"
                referrerPolicy="no-referrer"
              />
              {/* Floating aesthetic widget over image */}
              <div className="absolute bottom-5 left-5 right-5 bg-black/75 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-brand tag08-meta uppercase tracking-widest font-bold">POSICIONAMENTO SÊNIOR</p>
                  <p className="text-white text-xs font-bold mt-0.5">Let's grow your brand!</p>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: THE ELEGANT FLOATING CORE CAPSULE PILL CONTAINER (White Background) */}
      <div className="relative px-6 md:px-12 pb-32">
        <div className="max-w-6xl mx-auto bg-white text-zinc-900 rounded-[32px] sm:rounded-[48px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-8 sm:p-14 space-y-16 relative z-10 -mt-16 sm:-mt-24">
          
          {/* Bento layout secondary header cards inspired by tablet display */}
          <h2 className="sr-only">Como trabalhamos na TAG08</h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch border-b border-zinc-100 pb-12">
            
            {/* List column on left */}
            <div className="lg:col-span-3 space-y-4">
              <p className="text-xs text-zinc-400 uppercase tracking-widest tag08-meta font-bold">DIRETRIZES // EXPERTISE</p>
              <ul className="space-y-2.5 font-display text-sm font-bold text-zinc-800">
                <li className="flex items-center gap-2 border-b border-zinc-50 pb-2">
                  <span className="w-1.5 h-1.5 bg-brand border border-black/10 rounded-full" />
                  Strategy &amp; Positioning
                </li>
                <li className="flex items-center gap-2 border-b border-zinc-50 pb-2">
                  <span className="w-1.5 h-1.5 bg-brand border border-black/10 rounded-full" />
                  Content Creation
                </li>
                <li className="flex items-center gap-2 border-b border-zinc-50 pb-2">
                  <span className="w-1.5 h-1.5 bg-brand border border-black/10 rounded-full" />
                  SEO &amp; High Integrity Web
                </li>
                <li className="flex items-center gap-2 border-b border-zinc-50 pb-2">
                  <span className="w-1.5 h-1.5 bg-brand border border-black/10 rounded-full" />
                  Premium Graphic Design
                </li>
                <li className="flex items-center gap-2 border-b border-zinc-50 pb-2">
                  <span className="w-1.5 h-1.5 bg-brand border border-black/10 rounded-full" />
                  Performance Ads
                </li>
              </ul>
            </div>

            {/* Core culture central column */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-4 lg:border-l lg:border-zinc-100 lg:pl-10">
              <div className="space-y-2">
                <p className="text-xs text-zinc-400 uppercase tracking-widest tag08-meta font-bold">VALORES EXTRAORDINÁRIOS</p>
                <h3 className="font-display font-black text-xl text-zinc-900 tracking-tight">
                  Processos e <br/>colaboração
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed font-sans">
                  Não criamos apenas posts redundantes de feed. Estruturamos autoria, tom de narrativa impecável e canais ativos que geram relevância e conversão premium para clientes de alto ticket.
                </p>
              </div>
              <a 
                href="#banco-de-talentos-anchor"
                className="inline-flex min-h-11 items-center self-start px-4 py-2 bg-zinc-950 text-white tag08-action font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 transition-[background-color] duration-200"
              >
                Como funciona o Banco de Talentos
              </a>
            </div>

            {/* Dynamic Black Premium Statement Card on Right */}
            <div className="lg:col-span-5 bg-zinc-950 text-white p-7 rounded-3xl flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-bl-full pointer-events-none" />
              <div className="space-y-2">
                <p className="text-xs text-brand uppercase tracking-widest tag08-meta font-bold">TAG08 ECOSSISTEMA</p>
                <h3 className="font-display font-black text-2xl tracking-tighter leading-none">
                  Crescer com <br />direção e parceria
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans mt-2">
                  Oferecer serviços com prazos claros e processos bem documentados faz parte do nosso trabalho. Se você se identifica com essa forma de atuação, compartilhe seu perfil para possíveis oportunidades futuras.
                </p>
              </div>
              <a 
                href="#aplicacao-direta-anchor"
                className="inline-flex min-h-11 items-center self-start px-4 py-2.5 bg-white text-zinc-950 hover:bg-brand tag08-action font-bold text-xs uppercase tracking-widest rounded-xl transition-[background-color,color] duration-200 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                Enviar meu perfil
              </a>
            </div>

          </div>

          {/* TEAM PROFILE CARDS SHOWCASE ("Copitattes Togetter" Design block from mockup) */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 font-sans">
              <div className="space-y-1 text-left">
                <span className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest font-bold">INTERAÇÃO SOCIAL &amp; COMPANHEIRISMO</span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-zinc-900 tracking-tight">
                  Nosso Time &amp; Líderes <span className="text-brand drop-shadow-sm font-light font-sans">●</span>
                </h2>
              </div>
              <p className="text-zinc-500 text-xs sm:text-sm font-sans tracking-wider max-w-xs leading-tight">
                Profissionais experientes que consolidam nosso ecossistema de entrega cirúrgica rápida.
              </p>
            </div>

            {/* Split layout: Highlighted Founder on the Left (styled with high status dark block for visual rhythm within the white capsule), and the 4 experienced leaders in a 2x2 grid on the Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-sans">
              
              {/* Highlighter Founder Card (Dark contrast container for dynamic style rhythm) */}
              <div className="lg:col-span-4 bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden group shadow-lg">
                <div className="absolute inset-0 z-0 pointer-events-none">
                  {/* Founder photo */}
                  <ResilientImage
                    fallbackLabel="Liderança TAG08"
                    sizes="(max-width: 1024px) 100vw, 34vw"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" 
                    alt="Carlos Eduardo" 
                    className="object-cover opacity-15 grayscale brightness-[0.7] transition-[opacity] duration-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/75 to-transparent" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="px-2.5 py-1 bg-brand/10 border border-brand/25 rounded text-brand text-xs tag08-meta uppercase tracking-widest font-bold">
                    FUNDADOR // CE
                  </div>
                  <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                </div>

                <div className="relative z-10 space-y-4 mt-auto">
                  <div className="space-y-1">
                    <span className="font-sans text-xs text-zinc-500 block uppercase font-bold">DIREÇÃO GERAL</span>
                    <h3 className="font-display font-black text-xl text-white tracking-tight">Carlos Eduardo</h3>
                    <p className="text-brand text-xs font-sans uppercase leading-none">Fundador &amp; Diretor de Criação</p>
                    <p className="text-zinc-400 text-xs leading-relaxed pt-2 italic">
                      "Conduz o posicionamento das marcas parceiras por meio de metodologias consistentes de design e estética refinada."
                    </p>
                  </div>

                  <a 
                    href="https://www.linkedin.com/in/carlos-eduardo-tag08"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleOutboundClick("LinkedIn", "https://www.linkedin.com/in/carlos-eduardo-tag08", "careers-profile-carlos")}
                    className="inline-flex min-h-11 items-center gap-1.5 px-4 py-2.5 bg-brand hover:bg-white text-zinc-950 font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-[background-color,color,box-shadow] duration-200 shadow-md focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 cursor-pointer max-w-max"
                  >
                    <Linkedin className="w-3.5 h-3.5 fill-current stroke-none" />
                    <span>Conectar no LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Leaders Grid (4 Cards in a high efficiency 2x2 grid) */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Leader Card 1 */}
                <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-3xl flex flex-col justify-between space-y-5 hover:shadow-md transition-[box-shadow] duration-200 group">
                  <div className="flex min-w-0 gap-4 items-start">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-200 shrink-0 relative">
                      <ResilientImage
                        fallbackLabel="Time TAG08"
                        sizes="80px"
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250" 
                        alt="Marina Fontes" 
                        className="object-cover transition-opacity duration-200"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1 text-left">
                      <span className="font-sans text-xs text-zinc-400 uppercase tracking-widest inline-block max-w-full break-words whitespace-normal bg-zinc-200/50 px-2 py-0.5 rounded">UI/UX &amp; Brand Director</span>
                      <h3 className="font-display font-black text-base text-zinc-900 tracking-tight leading-none pt-0.5">Marina Fontes</h3>
                      <p className="text-zinc-500 text-xs font-sans leading-snug pt-1">
                        Cria diretrizes estéticas e manuais gráficos para marcas com exigência alta de consistência visual.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-zinc-200/40 pt-3 flex items-center justify-between text-xs font-sans text-zinc-400 uppercase">
                    <span className="flex items-center gap-1">📍 Joinville / SC</span>
                    <a 
                      href="https://www.linkedin.com/in/marina-fontes-tag08"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleOutboundClick("LinkedIn", "https://www.linkedin.com/in/marina-fontes-tag08", "careers-profile-marina")}
                      className="inline-flex min-h-11 items-center gap-1 px-3 py-1.5 bg-zinc-950 hover:bg-brand text-white hover:text-black hover:font-bold rounded-lg transition-[background-color,color] duration-200 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 text-xs tracking-wider uppercase font-sans cursor-pointer"
                    >
                      <Linkedin className="w-3 h-3 fill-current stroke-none" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>

                {/* Leader Card 2 */}
                <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-3xl flex flex-col justify-between space-y-5 hover:shadow-md transition-[box-shadow] duration-200 group">
                  <div className="flex min-w-0 gap-4 items-start">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-200 shrink-0 relative">
                      <ResilientImage
                        fallbackLabel="Time TAG08"
                        sizes="80px"
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250" 
                        alt="Renato Silveira" 
                        className="object-cover transition-opacity duration-200"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1 text-left">
                      <span className="font-sans text-xs text-zinc-400 uppercase tracking-widest inline-block max-w-full break-words whitespace-normal bg-zinc-200/50 px-2 py-0.5 rounded">Tech Lead Architect</span>
                      <h3 className="font-display font-black text-base text-zinc-900 tracking-tight leading-none pt-0.5">Renato Silveira</h3>
                      <p className="text-zinc-500 text-xs font-sans leading-snug pt-1">
                        Responsável pela integridade técnica, empacotamento leve e SEO dos sites.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-zinc-200/40 pt-3 flex items-center justify-between text-xs font-sans text-zinc-400 uppercase">
                    <span className="flex items-center gap-1">📍 São Paulo / SP</span>
                    <a 
                      href="https://www.linkedin.com/in/renato-silveira-tag08"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleOutboundClick("LinkedIn", "https://www.linkedin.com/in/renato-silveira-tag08", "careers-profile-renato")}
                      className="inline-flex min-h-11 items-center gap-1 px-3 py-1.5 bg-zinc-950 hover:bg-brand text-white hover:text-black hover:font-bold rounded-lg transition-[background-color,color] duration-200 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 text-xs tracking-wider uppercase font-sans cursor-pointer"
                    >
                      <Linkedin className="w-3 h-3 fill-current stroke-none" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>

                {/* Leader Card 3 */}
                <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-3xl flex flex-col justify-between space-y-5 hover:shadow-md duration-200 group transition-[box-shadow]">
                  <div className="flex min-w-0 gap-4 items-start">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-200 shrink-0 relative">
                      <ResilientImage
                        fallbackLabel="Time TAG08"
                        sizes="80px"
                        src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250" 
                        alt="Amanda Reis" 
                        className="object-cover transition-opacity duration-200"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1 text-left">
                      <span className="font-sans text-xs text-zinc-400 uppercase tracking-widest inline-block max-w-full break-words whitespace-normal bg-zinc-200/50 px-2 py-0.5 rounded">Content Strategist</span>
                      <h3 className="font-display font-black text-base text-zinc-900 tracking-tight leading-none pt-0.5">Amanda Reis</h3>
                      <p className="text-zinc-500 text-xs font-sans leading-snug pt-1">
                        Domínio em roteiros, storytelling e manuais de voz para executivos.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-zinc-200/40 pt-3 flex items-center justify-between text-xs font-sans text-zinc-400 uppercase">
                    <span className="flex items-center gap-1">📍 Remoto / Brasil</span>
                    <a 
                      href="https://www.linkedin.com/in/amanda-reis-tag08"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleOutboundClick("LinkedIn", "https://www.linkedin.com/in/amanda-reis-tag08", "careers-profile-amanda")}
                      className="inline-flex min-h-11 items-center gap-1 px-3 py-1.5 bg-zinc-950 hover:bg-brand text-white hover:text-black hover:font-bold rounded-lg transition-[background-color,color] duration-200 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 text-xs tracking-wider uppercase font-sans cursor-pointer"
                    >
                      <Linkedin className="w-3 h-3 fill-current stroke-none" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>

                {/* Leader Card 4 */}
                <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-3xl flex flex-col justify-between space-y-5 hover:shadow-md transition-[box-shadow] duration-200 group">
                  <div className="flex min-w-0 gap-4 items-start">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-200 shrink-0 relative">
                      <ResilientImage
                        fallbackLabel="Time TAG08"
                        sizes="80px"
                        src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250" 
                        alt="Lucas Mendes" 
                        className="object-cover transition-opacity duration-200"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1 text-left">
                      <span className="font-sans text-xs text-zinc-400 uppercase tracking-widest inline-block max-w-full break-words whitespace-normal bg-zinc-200/50 px-2 py-0.5 rounded">Performance Specialist</span>
                      <h3 className="font-display font-black text-base text-zinc-900 tracking-tight leading-none pt-0.5">Lucas Mendes</h3>
                      <p className="text-zinc-500 text-xs font-sans leading-snug pt-1">
                        Análise fria de CPA, LTV e otimização cirúrgica no Meta &amp; Google Ads.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-zinc-200/40 pt-3 flex items-center justify-between text-xs font-sans text-zinc-400 uppercase">
                    <span className="flex items-center gap-1">📍 São Paulo / SP</span>
                    <a 
                      href="https://www.linkedin.com/in/lucas-mendes-tag08"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleOutboundClick("LinkedIn", "https://www.linkedin.com/in/lucas-mendes-tag08", "careers-profile-lucas")}
                      className="inline-flex min-h-11 items-center gap-1 px-3 py-1.5 bg-zinc-950 hover:bg-brand text-white hover:text-black hover:font-bold rounded-lg transition-[background-color,color] duration-200 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 text-xs tracking-wider uppercase font-sans cursor-pointer"
                    >
                      <Linkedin className="w-3 h-3 fill-current stroke-none" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>

              </div>

            </div>

            {/* TEAM COLLECTIVE LINKEDIN HUB SECTION */}
            <div className="bg-zinc-50 border border-zinc-200/80 rounded-3xl p-6 sm:p-8 mt-10 relative overflow-hidden text-left">
              <div className="absolute top-[-30px] right-[-30px] w-64 h-64 bg-brand/[0.05] rounded-full blur-[100px] pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 font-sans">
                <div className="lg:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-950 text-brand tag08-meta text-xs lg:text-xs font-black tracking-widest uppercase">
                    <Linkedin className="w-3.5 h-3.5 fill-brand stroke-none" />
                    <span>Inovação, Processos & Insights Diários</span>
                  </div>
                  <h3 className="font-display font-black text-zinc-900 text-lg sm:text-xl tracking-tight leading-none">
                    Engaje com nossos diretores no LinkedIn
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed max-w-2xl font-medium">
                    Acompanhe a rotina de faturamento de alto ticket, as preleções de design estratégico do nosso fundador e a engenharia web sem construtores de código desenvolvida pelo nosso time. Conecte-se com nossos líderes para insights diários que aceleram carreiras e marcas corporativas.
                  </p>
                </div>
                
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end w-full">
                  <div className="bg-white border border-zinc-200 rounded-2xl p-4 text-center sm:text-left lg:text-left flex-1 shadow-sm">
                    <span className="block font-display font-black text-lg text-zinc-900">32k+ conexões</span>
                    <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-wider mt-0.5">Autoridade de mercado unificada</span>
                  </div>
                  <div className="bg-zinc-950 text-white rounded-2xl p-4 text-center sm:text-left lg:text-left flex-1 shadow-sm">
                    <span className="block font-display font-black text-lg text-brand">Insights Reais</span>
                    <span className="block text-zinc-400 tag08-meta text-xs uppercase tracking-wider mt-0.5">Artigos e playbooks semanais</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Permanent talent bank */}
          <div id="banco-de-talentos-anchor" className="space-y-10 pt-8 border-t border-zinc-100">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-zinc-100 pb-5">
              <div className="text-left space-y-1">
                <span className="tag08-meta text-xs text-brand bg-black px-2 py-0.5 rounded uppercase tracking-widest font-black">CANDIDATURA ESPONTÂNEA // TAG08</span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-zinc-900 tracking-tight">
                  Banco de Talentos
                </h2>
              </div>
              <p className="max-w-md text-zinc-500 text-xs leading-relaxed">
                Compartilhe seu perfil mesmo quando não houver vaga aberta. Ele poderá ser considerado em oportunidades futuras, sem garantia de contato ou contratação.
              </p>
            </div>

            <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <h3 className="font-display font-black text-xl text-zinc-900">Compartilhe sua trajetória profissional</h3>
                <p className="text-zinc-600 text-sm leading-relaxed max-w-2xl">Conte sobre sua experiência, área de atuação e projetos. O envio não representa candidatura a uma vaga aberta nem garante contato ou contratação.</p>
              </div>
              <button
                onClick={handleApply}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 px-4 py-2.5 bg-zinc-950 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 transition-[background-color] duration-200 cursor-pointer"
              >
                Enviar meu perfil <ArrowRight className="w-3.5 h-3.5 text-brand" />
              </button>
            </div>
          </div>

          {/* Cultura e orientações sobre o Banco de Talentos */}
          <div className="space-y-12 pt-12 border-t border-zinc-100 text-left">
            
            {/* Cultura e Expectativas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
              <div className="space-y-4">
                <span className="tag08-meta text-xs text-brand bg-zinc-950 px-2.5 py-1 rounded font-black uppercase tracking-widest inline-block">
                  NOSSO MANIFESTO INTERNO // RIGOR DE ENTREGA
                </span>
                <h3 className="font-display font-black text-2xl text-zinc-900 leading-tight">
                  O que esperamos do seu trabalho todos os dias
                </h3>
                <p className="text-zinc-500 text-xs sm:text-sm font-sans leading-relaxed">
                  A TAG08 executa uma parceria consultiva sólida baseada em processos e rigor técnico de ponta. Não somos um local de improvisações ou desculpas de cronogramas. Nosso pacto operacional baseia-se em quatro pilares estritos:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Rigor Clônico de Prazos", desc: "Se uma tarefa está mapeada para entrega na terça-feira às 14h, ela será disponibilizada pontualmente sem atrasos." },
                  { title: "Documentação de Ativos", desc: "Todo o seu escopo intelectual de processos e designs precisa ser documentado de maneira limpa para a equipe." },
                  { title: "Comunicação Altamente Ativa", desc: "Esperamos respostas céleres sobre as demandas ativas, sem barreiras de silêncio ou pendências." },
                  { title: "Constância de Qualidade", desc: "Sua centésima entrega de arte, copy ou código deve conter o mesmo padrão de excelência clínica da primeira." }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1.5">
                    <h4 className="text-zinc-900 font-display font-bold text-xs tracking-tight">{item.title}</h4>
                    <p className="text-zinc-500 text-xs leading-relaxed font-sans">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-100">
              <span className="tag08-meta text-xs text-zinc-400 uppercase tracking-widest font-bold block">BANCO PERMANENTE DE TALENTOS</span>
              <h3 className="font-display font-black text-xl text-zinc-900">O que acontece depois do envio</h3>
              <p className="text-zinc-500 text-xs sm:text-sm font-sans leading-relaxed max-w-2xl">
                Após o envio confirmado, seu perfil poderá ser considerado em oportunidades futuras compatíveis. A candidatura espontânea não corresponde a uma vaga aberta e não garante avaliação em prazo específico, contato ou contratação.
              </p>
            </div>

          </div>

          {/* APPLICATION FORM & LOCAL REVIEWS DESK */}
          <div id="application-form-section" className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8 border-t border-zinc-100 items-start">
            
            {/* Form desk on left (Dynamic Animated Multi-step Wizard) */}
            <div id="aplicacao-direta-anchor" className="lg:col-span-7 bg-zinc-50 border border-zinc-100 p-6 sm:p-9 rounded-3xl relative overflow-hidden space-y-6 flex flex-col justify-between">
              
              <div className="space-y-6">
                
                {/* Visual Step Progress Indicator */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4].map((step) => (
                      <React.Fragment key={step}>
                        <button
                          type="button"
                          onClick={() => {
                            if (step < currentStep) {
                              setCurrentStep(step);
                              setErrors({});
                              return;
                            }

                            for (let stepToValidate = currentStep; stepToValidate < step; stepToValidate += 1) {
                              if (!validateStep(stepToValidate)) return;
                              if (stepToValidate === 3 && !consent) {
                                setSubmitError("Confirme o consentimento para revisar sua candidatura.");
                                requestAnimationFrame(() => document.getElementById("talent-consent")?.focus());
                                return;
                              }
                            }

                            setSubmitError("");
                            setCurrentStep(step);
                          }}
                          aria-current={currentStep === step ? "step" : undefined}
                          aria-label={`Ir para a etapa ${step}${currentStep === step ? ", etapa atual" : ""}`}
                          className={`flex min-h-11 min-w-11 items-center justify-center rounded-xl text-xs font-sans font-bold transition-[background-color,border-color,color,box-shadow] duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
                            currentStep === step 
                              ? "bg-zinc-950 text-white shadow-md ring-2 ring-brand" 
                              : currentStep > step 
                                ? "bg-green-600 text-white" 
                                : "bg-white border border-zinc-200 text-zinc-400 hover:border-zinc-300"
                          }`}
                        >
                          {currentStep > step ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : step}
                        </button>
                        {step < 4 && (
                          <div className="flex-1 h-0.5 rounded-full overflow-hidden bg-zinc-200">
                            <motion.div 
                              className="h-full bg-green-600"
                              initial={{ width: "0%" }}
                              animate={{ width: currentStep > step ? "100%" : "0%" }}
                              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                            />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Header text containing dynamic personalization */}
                  <div className="space-y-1 text-left">
                    <span className="tag08-meta text-xs text-brand bg-black px-2 py-0.5 rounded font-black uppercase tracking-widest inline-block">
                      ETAPA {currentStep} DE 4 ? {currentStep === 1 ? "AREAS E DADOS" : currentStep === 2 ? "LINKS OPCIONAIS" : currentStep === 3 ? "EXPERIENCIA E CONTEXTO" : "REVISAO FINAL"}
                    </span>
                    <h2 ref={stepHeadingRef} tabIndex={-1} className="font-display font-black text-2xl text-zinc-900 tracking-tight focus:outline-none">
                      {currentStep === 1 ? "Areas e dados" : currentStep === 2 ? "Links opcionais" : currentStep === 3 ? "Experiencia e contexto" : "Revise sua candidatura"}
                    </h2>
                    <p className="text-zinc-700 text-xs">
                      {currentStep === 1
                        ? "Escolha uma ou mais areas e informe seus dados."
                        : currentStep === 2
                          ? "LinkedIn, curriculo e portfolio sao opcionais."
                          : currentStep === 3
                            ? "Compartilhe apenas o contexto profissional que considerar relevante."
                            : "Confira os dados e edite qualquer etapa antes do envio."}
                    </p>
                  </div>
                </div>

                {/* Submitting the form block */}
                <form id="talent-application-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="talent-website">Não preencha este campo</label>
                    <input id="talent-website" name="website" type="text" tabIndex={-1} autoComplete="off" ref={honeypotRef} />
                  </div>
                  <AnimatePresence mode="wait">
                    
                    {/* STEP 1: APRESENTAÇÃO PRIMÁRIA */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                        className="space-y-4"
                      >
                        <fieldset className="space-y-3 text-left" aria-describedby={errors.interestAreas ? "talent-interest-areas-error" : undefined}>
                          <legend className="text-xs uppercase tracking-widest font-bold text-zinc-700 tag08-meta">
                            Áreas de interesse * <span className="normal-case tracking-normal font-normal">(selecione uma ou mais)</span>
                          </legend>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {TALENT_INTEREST_AREAS.map(({ value, label }) => (
                              <label key={value} htmlFor={`talent-area-${value}`} className="flex min-h-11 items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 cursor-pointer focus-within:ring-2 focus-within:ring-brand">
                                <input
                                  id={`talent-area-${value}`}
                                  type="checkbox"
                                  name="interestAreas"
                                  value={value}
                                  checked={interestAreas.includes(value)}
                                  onChange={(event) => toggleInterestArea(value, event.target.checked)}
                                  aria-invalid={Boolean(errors.interestAreas)}
                                  aria-describedby={errors.interestAreas ? "talent-interest-areas-error" : undefined}
                                  className="h-4 w-4 shrink-0 accent-[var(--color-brand)]"
                                />
                                <span>{label}</span>
                              </label>
                            ))}
                          </div>
                          {errors.interestAreas ? <p id="talent-interest-areas-error" role="alert" className="text-xs text-red-600">{errors.interestAreas}</p> : null}
                        </fieldset>

                        {interestAreas.includes("other_specialties") ? (
                          <div className="space-y-1.5 text-left">
                            <label htmlFor="talent-other-specialty" className="block text-xs uppercase tracking-widest font-bold text-zinc-700 tag08-meta">Qual especialidade?</label>
                            <input
                              id="talent-other-specialty"
                              type="text"
                              maxLength={120}
                              value={otherSpecialty}
                              onChange={(event) => setOtherSpecialty(event.target.value)}
                              aria-invalid={Boolean(errors.otherSpecialty)}
                              aria-describedby={errors.otherSpecialty ? "talent-other-specialty-error" : undefined}
                              className="w-full bg-white border border-zinc-200 rounded-xl py-3 px-3 text-xs text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                            />
                            {errors.otherSpecialty ? <p id="talent-other-specialty-error" role="alert" className="text-xs text-red-600">{errors.otherSpecialty}</p> : null}
                          </div>
                        ) : null}

                        <div id="field-name" className="space-y-1.5 text-left">
                          <label htmlFor="talent-name" className="block text-xs uppercase tracking-widest font-bold text-zinc-700 tag08-meta">
                            Nome Completo *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                            <input
                              id="talent-name"
                              type="text"
                              name="name"
                              autoComplete="name"
                              placeholder="Ex: Carlos Silva"
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              aria-invalid={Boolean(errors.name)}
                              aria-describedby={errors.name ? "talent-name-error" : undefined}
                              className={`w-full bg-white border rounded-xl py-3 px-10 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-zinc-900 font-sans ${
                                errors.name ? "border-red-500 ring-1 ring-red-500/20" : "border-zinc-200"
                              }`}
                            />
                          </div>
                          {errors.name && <span id="talent-name-error" role="alert" className="text-red-500 text-xs font-sans block mt-1">{errors.name}</span>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div id="field-email" className="space-y-1.5 text-left">
                            <label htmlFor="talent-email" className="block text-xs uppercase tracking-widest font-bold text-zinc-700 tag08-meta">
                              E-mail de Contato *
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                              <input
                                id="talent-email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                placeholder="Ex: carlos@empresa.com"
                                value={formEmail}
                                onChange={(e) => setFormEmail(e.target.value)}
                                aria-invalid={Boolean(errors.email)}
                                aria-describedby={errors.email ? "talent-email-error" : undefined}
                                className={`w-full bg-white border rounded-xl py-3 px-10 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-zinc-900 font-sans ${
                                  errors.email ? "border-red-500 ring-1 ring-red-500/20" : "border-zinc-200"
                                }`}
                              />
                            </div>
                            {errors.email && <span id="talent-email-error" role="alert" className="text-red-500 text-xs font-sans block mt-1">{errors.email}</span>}
                          </div>

                          <div id="field-phone" className="space-y-1.5 text-left">
                            <label htmlFor="talent-phone" className="block text-xs uppercase tracking-widest font-bold text-zinc-700 tag08-meta">
                              WhatsApp de Contato *
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                              <input
                                id="talent-phone"
                                type="tel"
                                name="phone"
                                autoComplete="tel"
                                placeholder="Ex: (47) 99999-9999"
                                value={formPhone}
                                onChange={(e) => setFormPhone(e.target.value)}
                                aria-invalid={Boolean(errors.phone)}
                                aria-describedby={errors.phone ? "talent-phone-error" : undefined}
                                className={`w-full bg-white border rounded-xl py-3 px-10 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-zinc-900 font-sans ${
                                  errors.phone ? "border-red-500" : "border-zinc-200"
                                }`}
                              />
                            </div>
                            {errors.phone && <span id="talent-phone-error" role="alert" className="text-red-500 text-xs font-sans block mt-1">{errors.phone}</span>}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: CONEXÕES PROFISSIONAIS */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                        className="space-y-4"
                      >
                        <div id="field-linkedin" className="space-y-1.5 text-left">
                          <label htmlFor="talent-linkedin" className="block text-xs uppercase tracking-widest font-bold text-zinc-700 tag08-meta">
                            Perfil do LinkedIn (opcional)
                          </label>
                          <div className="relative">
                            <Linkedin className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                            <input
                              id="talent-linkedin"
                              type="url"
                              name="linkedin"
                              autoComplete="url"
                              placeholder="https://www.linkedin.com/in/seunome"
                              value={formLinkedin}
                              onChange={(e) => setFormLinkedin(e.target.value)}
                              aria-invalid={Boolean(errors.linkedin)}
                              aria-describedby={errors.linkedin ? "talent-linkedin-error" : undefined}
                              className={`w-full bg-white border rounded-xl py-3 px-10 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-zinc-900 font-sans ${
                                errors.linkedin ? "border-red-500" : "border-zinc-200"
                              }`}
                            />
                          </div>
                          {errors.linkedin && <span id="talent-linkedin-error" role="alert" className="text-red-500 text-xs font-sans block mt-1">{errors.linkedin}</span>}
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label htmlFor="talent-resume-url" className="block text-xs uppercase tracking-widest font-bold text-zinc-700 tag08-meta">Link do currículo (opcional)</label>
                          <input
                            id="talent-resume-url"
                            type="url"
                            name="resumeUrl"
                            autoComplete="url"
                            placeholder="https://..."
                            value={formResumeUrl}
                            onChange={(event) => setFormResumeUrl(event.target.value)}
                            aria-invalid={Boolean(errors.resumeUrl)}
                            aria-describedby={errors.resumeUrl ? "talent-resume-url-error" : undefined}
                            className="w-full bg-white border border-zinc-200 rounded-xl py-3 px-3 text-xs text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                          />
                          {errors.resumeUrl ? <p id="talent-resume-url-error" role="alert" className="text-xs text-red-600">{errors.resumeUrl}</p> : null}
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label htmlFor="talent-portfolio" className="block text-xs uppercase tracking-widest font-bold text-zinc-700 tag08-meta">
                            Link do Portfólio / GitHub (Opcional)
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                            <input
                              id="talent-portfolio"
                              type="url"
                              name="portfolio"
                              autoComplete="url"
                              placeholder="Ex: behance.net/seunome ou github.com/seunome"
                              value={formPortfolio}
                              onChange={(e) => setFormPortfolio(e.target.value)}
                              className="w-full bg-white border border-zinc-200 rounded-xl py-3 px-10 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-zinc-900 font-sans"
                            />
                          </div>
                          <p className="text-xs text-zinc-600 leading-tight">
                            Se desejar, inclua seu portfólio para contextualizar sua experiência.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: APRESENTAÇÃO & MINI LETTER */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                        className="space-y-4"
                      >
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-left">
                          <p className="text-xs tag08-meta font-bold uppercase tracking-widest text-zinc-700">Experi&ecirc;ncia e contexto</p>
                          <p className="mt-1 text-xs leading-relaxed text-zinc-700">Compartilhe apenas o que considerar relevante. N&atilde;o recebemos arquivos nesta etapa.</p>
                        </div>
                        <div className="space-y-1.5 text-left">
                          <label htmlFor="talent-experience-summary" className="block text-xs uppercase tracking-widest font-bold text-zinc-700 tag08-meta">Experi&ecirc;ncia profissional (opcional)</label>
                          <textarea id="talent-experience-summary" rows={3} maxLength={1000} value={experienceSummary} onChange={(event) => setExperienceSummary(event.target.value)} className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-xs text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand" />
                        </div>
                        <div className="space-y-1.5 text-left">
                          <label htmlFor="talent-availability" className="block text-xs uppercase tracking-widest font-bold text-zinc-700 tag08-meta">Disponibilidade (opcional)</label>
                          <input id="talent-availability" type="text" maxLength={240} value={availability} onChange={(event) => setAvailability(event.target.value)} className="w-full bg-white border border-zinc-200 rounded-xl py-3 px-3 text-xs text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand" />
                        </div>
                        <div className="space-y-1.5 text-left">
                          <label htmlFor="talent-motivation" className="block text-xs uppercase tracking-widest font-bold text-zinc-700 tag08-meta">O que motiva seu interesse? (opcional)</label>
                          <textarea id="talent-motivation" rows={2} maxLength={1000} value={motivation} onChange={(event) => setMotivation(event.target.value)} className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-xs text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand" />
                        </div>
                        {hasCreativeTechnicalArea ? (
                          <div className="space-y-1.5 text-left">
                            <label htmlFor="talent-relevant-projects" className="block text-xs uppercase tracking-widest font-bold text-zinc-700 tag08-meta">Trabalhos ou projetos relevantes (opcional)</label>
                            <textarea id="talent-relevant-projects" rows={3} maxLength={2000} value={relevantProjects} onChange={(event) => setRelevantProjects(event.target.value)} className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-xs text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand" />
                          </div>
                        ) : null}
                        {hasCommercialOperationalArea ? (
                          <div className="space-y-1.5 text-left">
                            <label htmlFor="talent-relevant-experience" className="block text-xs uppercase tracking-widest font-bold text-zinc-700 tag08-meta">Conte brevemente uma experi&ecirc;ncia relacionada &agrave;s &aacute;reas (opcional)</label>
                            <textarea id="talent-relevant-experience" rows={3} maxLength={1200} value={relevantExperience} onChange={(event) => setRelevantExperience(event.target.value)} className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-xs text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand" />
                          </div>
                        ) : null}
                        <label htmlFor="talent-consent" className="flex items-start gap-2 text-left text-xs text-zinc-700 cursor-pointer">
                          <input
                            type="checkbox"
                            id="talent-consent"
                            name="consent"
                            checked={consent}
                            onChange={(event) => setConsent(event.target.checked)}
                            aria-invalid={Boolean(submitError && !consent)}
                            aria-describedby={submitError && !consent ? "talent-consent-error" : undefined}
                            className="mt-0.5 h-4 w-4 accent-[var(--color-brand)]"
                          />
                          <span>Autorizo o uso destes dados para considerar meu perfil no Banco de Talentos da TAG08 em oportunidades futuras.</span>
                        </label>
                        {submitError ? <p id={!consent ? "talent-consent-error" : undefined} role="alert" className="text-xs text-red-600">{submitError}</p> : null}
                      </motion.div>
                    )}

                    {currentStep === 4 && (
                      <motion.div
                        key="step-4"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                        className="space-y-4"
                        data-testid="talent-application-review"
                      >
                        {submitError ? <p role="alert" className="text-xs text-red-600">{submitError}</p> : null}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-left">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-display text-lg font-bold text-zinc-900">Dados pessoais</h3>
                            <button type="button" onClick={() => setCurrentStep(1)} className="min-h-11 rounded-lg px-3 text-xs font-bold text-zinc-700 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand" aria-label="Editar dados pessoais">Editar</button>
                          </div>
                          <dl className="mt-2 grid gap-2 text-xs text-zinc-700 sm:grid-cols-2">
                            <div><dt className="font-bold">Nome</dt><dd>{formName}</dd></div>
                            <div><dt className="font-bold">E-mail</dt><dd>{formEmail}</dd></div>
                            <div><dt className="font-bold">Telefone</dt><dd>{formPhone}</dd></div>
                            <div><dt className="font-bold">Áreas de interesse</dt><dd>{TALENT_INTEREST_AREAS.filter(({ value }) => interestAreas.includes(value)).map(({ label }) => label).join(", ")}</dd></div>
                            {otherSpecialty.trim() ? <div><dt className="font-bold">Outra especialidade</dt><dd>{otherSpecialty}</dd></div> : null}
                          </dl>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-left">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-display text-lg font-bold text-zinc-900">Links profissionais</h3>
                            <button type="button" onClick={() => setCurrentStep(2)} className="min-h-11 rounded-lg px-3 text-xs font-bold text-zinc-700 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand" aria-label="Editar links profissionais">Editar</button>
                          </div>
                          <dl className="mt-2 grid gap-2 text-xs text-zinc-700">
                            {formLinkedin.trim() ? <div><dt className="font-bold">LinkedIn</dt><dd className="break-all">{formLinkedin}</dd></div> : null}
                            {formResumeUrl.trim() ? <div><dt className="font-bold">Currículo</dt><dd className="break-all">{formResumeUrl}</dd></div> : null}
                            {formPortfolio.trim() ? <div><dt className="font-bold">Portfólio</dt><dd className="break-all">{formPortfolio}</dd></div> : null}
                          </dl>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-left">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-display text-lg font-bold text-zinc-900">Apresentação</h3>
                            <button type="button" onClick={() => setCurrentStep(3)} className="min-h-11 rounded-lg px-3 text-xs font-bold text-zinc-700 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand" aria-label="Editar contexto profissional">Editar</button>
                          </div>
                          <dl className="mt-2 grid gap-2 text-xs text-zinc-700">
                            {experienceSummary.trim() ? <div><dt className="font-bold">Experiência</dt><dd className="whitespace-pre-wrap">{experienceSummary}</dd></div> : null}
                            {availability.trim() ? <div><dt className="font-bold">Disponibilidade</dt><dd>{availability}</dd></div> : null}
                            {motivation.trim() ? <div><dt className="font-bold">Motivação</dt><dd className="whitespace-pre-wrap">{motivation}</dd></div> : null}
                            {relevantProjects.trim() ? <div><dt className="font-bold">Trabalhos ou projetos relevantes</dt><dd className="whitespace-pre-wrap">{relevantProjects}</dd></div> : null}
                            {relevantExperience.trim() ? <div><dt className="font-bold">Experiência relacionada</dt><dd className="whitespace-pre-wrap">{relevantExperience}</dd></div> : null}
                          </dl>
                          <p className="mt-3 text-xs text-zinc-600">Consentimento para consideração em oportunidades futuras: confirmado.</p>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </form>

              </div>

              {/* Step Navigation Controls bottom footer */}
              <div className="pt-6 border-t border-zinc-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-zinc-400 leading-tight flex items-center gap-1.5 self-start sm:self-center">
                  <Lock className="w-3.5 h-3.5 text-zinc-500 shrink-0" /> Tratamento responsável dos dados enviados.
                </p>
                
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex min-h-11 items-center gap-1.5 px-5 py-3 border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-[background-color,border-color,color] duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                    >
                      Voltar
                    </button>
                  )}
                  
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={(event) => { event.preventDefault(); handleNextStep(); }}
                      className="inline-flex min-h-11 w-full sm:w-auto items-center justify-center gap-1.5 px-6 py-3 bg-zinc-950 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-[background-color] duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                    >
                      {currentStep === 3 ? "Revisar candidatura" : "Continuar"} <ArrowRight className="w-3.5 h-3.5 text-brand" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      form="talent-application-form"
                      disabled={submitting}
                      className="inline-flex min-h-11 w-full sm:w-auto items-center justify-center gap-1.5 px-6 py-3 bg-brand hover:bg-brand-dark disabled:hover:bg-brand text-black font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-[background-color,box-shadow] duration-200 shadow-[0_4px_12px_rgba(var(--color-brand-rgb),0.15)] cursor-pointer focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? "Enviando..." : "Enviar candidatura"} <Send className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  )}
                </div>
              </div>

              {/* SUCCESS MODAL PANEL */}
              <AnimatePresence>
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 z-30"
                    data-testid="talent-application-success"
                  >
                    <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-5 border border-green-200">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-display font-black text-xl text-zinc-900 tracking-tight">
                      Candidatura enviada!
                    </h3>
                    <p className="text-zinc-700 text-xs sm:text-sm mt-2 max-w-sm leading-relaxed">
                      Agradecemos seu interesse em fazer parte da TAG08. Suas informações foram enviadas com sucesso e poderão ser consideradas em oportunidades futuras compatíveis. Caso exista interesse em avançar, poderemos entrar em contato pelos canais informados.
                    </p>
                    
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <button
                        onClick={() => setSubmitSuccess(false)}
                      className="inline-flex min-h-11 items-center px-4 py-2.5 bg-zinc-950 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-[background-color] duration-200 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 cursor-pointer"
                      >
                        Enviar Outra Ficha
                      </button>
                      <button
                        onClick={() => onNavigate("/")}
                        className="inline-flex min-h-11 items-center px-4 py-2.5 bg-zinc-100 text-zinc-800 border border-zinc-200 font-sans text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-[background-color,border-color] duration-200 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 cursor-pointer"
                      >
                        Página Inicial
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Application privacy notice */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-zinc-50 border border-zinc-100 p-5 sm:p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 tag08-meta text-xs text-brand bg-black px-2 py-0.5 rounded font-bold uppercase tracking-wider self-start inline-flex">
                  <Terminal className="w-3.5 h-3.5 animate-pulse" />
                  Envio protegido
                </div>
                
                <h3 className="font-display font-black text-lg text-zinc-900 tracking-tight leading-none">
                  Como funciona a candidatura
                </h3>
                <p className="text-zinc-700 text-xs leading-relaxed">
                  Seus dados são enviados com consentimento para o Banco de Talentos. Em caso de falha temporária, o navegador pode manter a candidatura em uma fila local até que o reenvio seja concluído.
                </p>

                <div className="space-y-2.5 pt-1 border border-dashed border-zinc-200 rounded-2xl p-5 text-left">
                  <p className="text-zinc-700 text-xs font-semibold">1. Recebimento e confirmação</p>
                  <p className="text-zinc-700 text-xs leading-relaxed">A candidatura é registrada antes da confirmação exibida na tela.</p>
                  <p className="text-zinc-700 text-xs font-semibold">2. Possíveis oportunidades futuras</p>
                  <p className="text-zinc-700 text-xs leading-relaxed">Se surgir uma oportunidade compatível, seu perfil poderá ser considerado. O envio não garante prazo de retorno, contato ou contratação. Você pode solicitar a revisão ou exclusão dos dados pelo canal de contato da TAG08.</p>
                </div>
              </div>

              {/* Cultural Banner */}
              <div className="bg-zinc-950 text-white p-6 rounded-3xl text-left space-y-3.5 shadow-md relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
                <div className="inline-flex px-2 py-0.5 bg-brand/10 text-brand font-sans text-xs font-black uppercase rounded-md">
                  CULTURA TAG08
                </div>
                <h3 className="font-display font-bold text-white text-xs sm:text-sm">
                  Pacto de Alinhamento de Valor
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  Se você se identifica com a forma de trabalho da TAG08, compartilhe seu perfil para possíveis oportunidades futuras.
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
      
    </div>
  );
}
