import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowUpRight, MessageSquare, Phone, Mail, MapPin, ShieldAlert, CheckCircle, Eye, Type, RefreshCw, Instagram, Linkedin, Youtube, Facebook, Twitter, Cookie, Lock, Scale, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { i18n, type UiLanguage } from "../i18n/siteI18n";
import { getLocalizedNetworkLinks, TAG08_OFFICIAL_CONTACT, TAG08_OFFICIAL_PINTEREST_URL, TAG08_OFFICIAL_YOUTUBE_URL, TAG08_WHATSAPP_CONTACTS } from "../config/siteNetwork";
import { safeStorage } from "../utils/storage";
import { trackOutboundClick } from "../lib/analytics";
import { readCookiePreferences, saveCookiePreferences, type CookiePreferences } from "../lib/cookieConsent";
import CountryFlag from "./CountryFlag";

interface FooterProps {
  onNavigate: (page: string) => void;
  language: UiLanguage;
}

type FooterCopy = {
  brandStatement: string;
  brandQuote: string;
  badge: string;
  servicesTitle: string;
  programsTitle: string;
  institutionTitle: string;
  connectTitle: string;
  ecosystemTitle: string;
  serviceLinks: Array<{ label: string; path: string }>;
  programLinks: Array<{ label: string; path: string }>;
  institutionLinks: Array<{ label: string; path?: string; action?: "privacy" | "terms" }>;
  contactEmailTitle: string;
  contactPhoneTitle: string;
  locationTitle: string;
  locationValue: string;
  brandRows: string[];
  companyLine: string;
  rightsLine: string;
  legalLabelPrivacy: string;
  legalLabelTerms: string;
  modalClose: string;
  modalAgree: string;
  cookieTitle: string;
  cookieDescription: string;
  cookieCustomizeLabel: string;
  cookieCloseCustomizeLabel: string;
  cookieRejectLabel: string;
  cookieAcceptLabel: string;
  cookieSaveLabel: string;
};

const FOOTER_COPY: Record<UiLanguage, FooterCopy> = {
  pt: {
    brandStatement: "Agência Estratégica",
    brandQuote: "Posicionamento com propósito. Estratégia com direção.",
    badge: "Atendimento Nacional",
    servicesTitle: "SOLUÇÕES",
    programsTitle: "PROGRAMAS",
    institutionTitle: "INSTITUCIONAL",
    connectTitle: "CONEXÒO",
    ecosystemTitle: "ECOSISTEMA TAG08",
    serviceLinks: [
      { label: "Assessoria de Marketing", path: "/servicos/assessoria-marketing-digital-estrategico" },
      { label: "Gestão de Redes Sociais", path: "/servicos/gestao-de-redes-sociais" },
      { label: "Branding & Identidade", path: "/servicos/branding-identidade" },
      { label: "Desenvolvimento Web", path: "/servicos/desenvolvimento-web" },
      { label: "Produção Audiovisual", path: "/servicos/producao-audiovisual" },
      { label: "Process Intelligence", path: "/servicos/process-intelligence" },
      { label: "Process Activation", path: "/servicos/process-activation" },
      { label: "Hospedagem & Manutenção", path: "/hospedagem-manutencao-sites" },
    ],
    programLinks: [
      { label: "Sebraetec", path: "/sebraetec-impulsionando-empreendedores" },
      { label: "Programa de Afiliados", path: "/programa-afiliados" },
    ],
    institutionLinks: [
      { label: "Início", path: "/" },
      { label: "Sobre Nós", path: "/sobre" },
      { label: "Soluções Integradas", path: "/servicos" },
      { label: "Insights Estratégicos", path: "/insights" },
      { label: "Trabalhe Conosco", path: "/trabalhe-conosco" },
      { label: "Contato", path: "/contato" },
      { label: "Política de Privacidade", action: "privacy" },
      { label: "Termos de Uso", action: "terms" },
    ],
    contactEmailTitle: "Envie um e-mail",
    contactPhoneTitle: "WhatsApp",
    locationTitle: "Localização",
    locationValue: "João Pessoa - PB",
    brandRows: ["Atendimento Consultivo", "Entrega Sistemática"],
    companyLine: "TAG08 CONSULTORIA E MARKETING LTDA | CNPJ: 26.828.685/0001-52 | Registrado e desenvolvido de forma estratégica",
    rightsLine: "TAG08. Todos os direitos reservados.",
    legalLabelPrivacy: "Política de Privacidade",
    legalLabelTerms: "Termos de Uso",
    modalClose: "Fechar",
    modalAgree: "Entendi e concordo",
    cookieTitle: "Privacidade & Cookies (LGPD)",
    cookieDescription:
      "Valorizamos sua privacidade. Nós e nossos parceiros usamos cookies para analisar o tráfego do portal e otimizar recursos de acordo com seus interesses, em conformidade com a LGPD.",
    cookieCustomizeLabel: "[ Personalizar... ]",
    cookieCloseCustomizeLabel: "[ Fechar Ajustes ]",
    cookieRejectLabel: "Rejeitar",
    cookieAcceptLabel: "Aceitar Todos",
    cookieSaveLabel: "Salvar Ajustes",
  },
  en: {
    brandStatement: "Strategic Agency",
    brandQuote: "Positioning with purpose. Strategy with direction.",
    badge: "Global Support",
    servicesTitle: "SERVICES",
    programsTitle: "PROGRAMS",
    institutionTitle: "COMPANY",
    connectTitle: "CONTACT",
    ecosystemTitle: "TAG08 ECOSYSTEM",
    serviceLinks: [
      { label: "Marketing Advisory", path: "/servicos/assessoria-marketing-digital-estrategico" },
      { label: "Social Media Management", path: "/servicos/gestao-de-redes-sociais" },
      { label: "Branding & Identity", path: "/servicos/branding-identidade" },
      { label: "Web Development", path: "/servicos/desenvolvimento-web" },
      { label: "Audiovisual Production", path: "/servicos/producao-audiovisual" },
      { label: "Process Intelligence", path: "/servicos/process-intelligence" },
      { label: "Process Activation", path: "/servicos/process-activation" },
      { label: "Hosting & Maintenance", path: "/hospedagem-manutencao-sites" },
    ],
    programLinks: [
      { label: "Sebraetec", path: "/sebraetec-impulsionando-empreendedores" },
      { label: "Affiliate Program", path: "/programa-afiliados" },
    ],
    institutionLinks: [
      { label: "Home", path: "/" },
      { label: "About Us", path: "/sobre" },
      { label: "Integrated Services", path: "/servicos" },
      { label: "Insights Estratégicos", path: "/insights" },
      { label: "Careers", path: "/trabalhe-conosco" },
      { label: "Contact", path: "/contato" },
      { label: "Privacy Policy", action: "privacy" },
      { label: "Termos de Uso", action: "terms" },
    ],
    contactEmailTitle: "Send an email",
    contactPhoneTitle: "WhatsApp",
    locationTitle: "Location",
    locationValue: "João Pessoa - PB",
    brandRows: ["Strategic advisory", "Systematic delivery"],
    companyLine: "TAG08 CONSULTING & MARKETING LTDA | CNPJ: 26.828.685/0001-52 | Built as a strategic operation",
    rightsLine: "TAG08. All rights reserved.",
    legalLabelPrivacy: "Privacy Policy",
    legalLabelTerms: "Termos de Uso",
    modalClose: "Close",
    modalAgree: "I understand and agree",
    cookieTitle: "Privacy & Cookies (LGPD)",
    cookieDescription:
      "We and our partners use cookies to analyze traffic and improve the site in line with your preferences, according to LGPD rules.",
    cookieCustomizeLabel: "[ Customize... ]",
    cookieCloseCustomizeLabel: "[ Close Settings ]",
    cookieRejectLabel: "Reject",
    cookieAcceptLabel: "Accept All",
    cookieSaveLabel: "Save Settings",
  },
  es: {
    brandStatement: "Agência Estratégica",
    brandQuote: "Posicionamiento con propósito. Estrategia con dirección.",
    badge: "Atención Nacional",
    servicesTitle: "SERVICIOS",
    programsTitle: "PROGRAMAS",
    institutionTitle: "INSTITUCIONAL",
    connectTitle: "CONEXIÓN",
    ecosystemTitle: "ECOSISTEMA TAG08",
    serviceLinks: [
      { label: "Asesoría de Marketing", path: "/servicos/assessoria-marketing-digital-estrategico" },
      { label: "Gestión de Redes Sociales", path: "/servicos/gestao-de-redes-sociais" },
      { label: "Branding & Identidad", path: "/servicos/branding-identidade" },
      { label: "Desarrollo Web", path: "/servicos/desenvolvimento-web" },
      { label: "Producción Audiovisual", path: "/servicos/producao-audiovisual" },
      { label: "Process Intelligence", path: "/servicos/process-intelligence" },
      { label: "Process Activation", path: "/servicos/process-activation" },
      { label: "Hosting & Mantenimiento", path: "/hospedagem-manutencao-sites" },
    ],
    programLinks: [
      { label: "Sebraetec", path: "/sebraetec-impulsionando-empreendedores" },
      { label: "Programa de Afiliados", path: "/programa-afiliados" },
    ],
    institutionLinks: [
      { label: "Inicio", path: "/" },
      { label: "Sobre Nosotros", path: "/sobre" },
      { label: "Servicios Integrados", path: "/servicos" },
      { label: "Insights Estratégicos", path: "/insights" },
      { label: "Trabaja con nosotros", path: "/trabalhe-conosco" },
      { label: "Contacto", path: "/contato" },
      { label: "Política de Privacidad", action: "privacy" },
      { label: "Términos de Uso", action: "terms" },
    ],
    contactEmailTitle: "Enviar un correo",
    contactPhoneTitle: "WhatsApp",
    locationTitle: "Ubicación",
    locationValue: "João Pessoa - PB",
    brandRows: ["Atenção consultiva", "Entrega sistêmica"],
    companyLine: "TAG08 CONSULTORIA Y MARKETING LTDA | CNPJ: 26.828.685/0001-52 | Construida de forma estratégica",
    rightsLine: "TAG08. Todos los derechos reservados.",
    legalLabelPrivacy: "Política de Privacidad",
    legalLabelTerms: "Términos de Uso",
    modalClose: "Cerrar",
    modalAgree: "Entendido y acepto",
    cookieTitle: "Privacidad & Cookies (LGPD)",
    cookieDescription:
      "Respetamos tu privacidad. Junto con nuestros socios usamos cookies para analizar el trafico y mejorar la experiencia con estandares LGPD.",
    cookieCustomizeLabel: "[ Personalizar... ]",
    cookieCloseCustomizeLabel: "[ Cerrar ajustes ]",
    cookieRejectLabel: "Rechazar",
    cookieAcceptLabel: "Aceptar todo",
    cookieSaveLabel: "Guardar ajustes",
  },
};

export default function Footer({ onNavigate, language }: FooterProps) {
  const source = i18n[language].footer;
  const copy = {
    ...FOOTER_COPY[language],
    brandStatement: source.brandStatement,
    brandQuote: source.brandQuote,
    servicesTitle: source.serviceLabel.toUpperCase(),
    programsTitle: source.programLabel.toUpperCase(),
    institutionTitle: source.institutionLabel.toUpperCase(),
    connectTitle: source.connectLabel.toUpperCase(),
    ecosystemTitle: source.ecosystemTitle ?? source.connectLabel,
    serviceLinks: source.serviceLinks,
    programLinks: source.programLinks,
    institutionLinks: source.institutionLinks,
    contactEmailTitle: source.contactTitleEmail,
    contactPhoneTitle: source.contactTitleWhatsapp,
    locationTitle: source.locationLabel,
    locationValue: source.contactCity,
    brandRows: [source.brandRow, source.brandRow2],
    companyLine: source.companyLine,
    rightsLine: source.rightsLine,
    legalLabelPrivacy: source.privacyLabel,
    legalLabelTerms: source.termsLabel,
    modalClose: source.closeModal,
    modalAgree: source.agree,
    cookieTitle: source.policyTitle,
    cookieDescription: source.launchTop,
    cookieCloseCustomizeLabel: source.cookieCloseCustomizeLabel ?? FOOTER_COPY[language].cookieCloseCustomizeLabel,
    cookieCustomizeLabel: source.cookieCustomizeLabel,
    cookieRejectLabel: source.cookieRejectLabel,
    cookieAcceptLabel: source.cookieAcceptLabel,
    cookieSaveLabel: source.cookieSaveLabel,
  };
  const ecosystemLinks = getLocalizedNetworkLinks(language);
  const officialContact = TAG08_OFFICIAL_CONTACT;
  const [activeModal, setActiveModal] = useState<"privacy" | "terms" | null>(null);

  // Accessibility parameters state
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return safeStorage.get("tag08_high_contrast") === "true";
  });
  const [fontSizeScale, setFontSizeScale] = useState<number>(() => {
    return Number(safeStorage.get("tag08_font_size_scale")) || 100;
  });

  // Sync state parameters to persistent storage and documentElement classes
  useEffect(() => {
    safeStorage.set("tag08_high_contrast", String(highContrast));
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    safeStorage.set("tag08_font_size_scale", String(fontSizeScale));
    if (fontSizeScale === 100) {
      document.documentElement.style.fontSize = "";
    } else {
      document.documentElement.style.fontSize = `${fontSizeScale}%`;
    }
  }, [fontSizeScale]);

  const handleResetAccessibility = () => {
    setHighContrast(false);
    setFontSizeScale(100);
  };

  // LGPD & Cookie Privacy States
  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(false);
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>({
    essential: true,
    performance: true,
    marketing: true
  });
  const [customizeCookies, setCustomizeCookies] = useState<boolean>(false);

  // Sync cookie banner visibility & mode with floating widgets via custom event standard
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("lgpd-banner-change", {
        detail: { visible: showCookieBanner, custom: customizeCookies }
      })
    );
  }, [showCookieBanner, customizeCookies]);

  // States for interactive LGPD Data Subject Rights Request (Exercer Direitos)
  const [lgpdRequestEmail, setLgpdRequestEmail] = useState("");
  const [lgpdRequestName, setLgpdRequestName] = useState("");
  const [lgpdRequestType, setLgpdRequestType] = useState<"exclusão" | "acesso" | "correção">("exclusão");
  const [lgpdRequestDetails, setLgpdRequestDetails] = useState("");
  const [lgpdRequestSuccess, setLgpdRequestSuccess] = useState(false);
  const [lgpdRequestLoading, setLgpdRequestLoading] = useState(false);
  const [showLgpdForm, setShowLgpdForm] = useState(false);

  const handleOutboundClick = (label: string, url: string, surface: string) => {
    trackOutboundClick({
      label,
      url,
      surface,
      language
    });
  };

  useEffect(() => {
    const preferences = readCookiePreferences();
    if (!preferences) {
      const timer = setTimeout(() => {
        setShowCookieBanner(true);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      try {
        setCookiePreferences(preferences);
      } catch (e) {
        // Safe fallback
      }
    }
  }, []);

  const handleAcceptAllCookies = () => {
    const preferences: CookiePreferences = { essential: true, performance: true, marketing: true };
    setCookiePreferences(preferences);
    saveCookiePreferences(preferences);
    setShowCookieBanner(false);
  };

  const handleRejectCookies = () => {
    const preferences: CookiePreferences = { essential: true, performance: false, marketing: false };
    setCookiePreferences(preferences);
    saveCookiePreferences(preferences);
    setShowCookieBanner(false);
    setCustomizeCookies(false);
  };

  const handleSaveCookiePreferences = () => {
    saveCookiePreferences(cookiePreferences);
    setShowCookieBanner(false);
    setCustomizeCookies(false);
  };

  const handleLgpdSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!lgpdRequestEmail || !lgpdRequestName) return;
    setLgpdRequestLoading(true);
    setTimeout(() => {
      setLgpdRequestLoading(false);
      setLgpdRequestSuccess(true);
    }, 1500);
  };

  const handleResetLgpdForm = () => {
    setLgpdRequestEmail("");
    setLgpdRequestName("");
    setLgpdRequestType("exclusão");
    setLgpdRequestDetails("");
    setLgpdRequestSuccess(false);
    setShowLgpdForm(false);
  };

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="main-footer" className="bg-charcoal-950 border-t border-white/[0.05] pt-16 pb-12 relative overflow-hidden">
      {/* Background visual geometry */}
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-brand/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="space-y-6 lg:col-span-1">
            <div>
              <Image
                src="/brand/logos/logo-horizontal-mono-white.svg"
                alt="TAG08"
                width={190}
                height={36}
                className="h-9 w-auto max-w-[190px]"
              />
              <p className="text-zinc-400 text-xs font-mono tracking-widest mt-2 uppercase">
                Agência Estratégica
              </p>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              &ldquo;Posicionamento com Propósito. Estratégia com Performance.&rdquo;
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2.5">
                <a
                  href="https://www.instagram.com/tag08.com.br/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleOutboundClick("Instagram", "https://www.instagram.com/tag08.com.br/", "footer-social")}
                  className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 hover:border-brand-secondary hover:text-brand-secondary flex items-center justify-center transition-all duration-300 text-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
                  aria-label="Siga-nos no Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/tag08-com-br/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleOutboundClick("LinkedIn", "https://www.linkedin.com/company/tag08-com-br/", "footer-social")}
                  className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 hover:border-brand-secondary hover:text-brand-secondary flex items-center justify-center transition-all duration-300 text-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
                  aria-label="Siga-nos no LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={TAG08_OFFICIAL_YOUTUBE_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleOutboundClick("YouTube", TAG08_OFFICIAL_YOUTUBE_URL, "footer-social")}
                  className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 hover:border-brand-secondary hover:text-brand-secondary flex items-center justify-center transition-all duration-300 text-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
                  aria-label="Inscreva-se no YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/tag08.com.br"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleOutboundClick("Facebook", "https://www.facebook.com/tag08.com.br", "footer-social")}
                  className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 hover:border-brand-secondary hover:text-brand-secondary flex items-center justify-center transition-all duration-300 text-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
                  aria-label="Siga-nos no Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://x.com/TAG08_com_br"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleOutboundClick("X", "https://x.com/TAG08_com_br", "footer-social")}
                  className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 hover:border-brand-secondary hover:text-brand-secondary flex items-center justify-center transition-all duration-300 text-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
                  aria-label="Siga-nos no Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href={TAG08_OFFICIAL_PINTEREST_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleOutboundClick("Pinterest", TAG08_OFFICIAL_PINTEREST_URL, "footer-social")}
                  className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 hover:border-brand-secondary hover:text-brand-secondary flex items-center justify-center transition-all duration-300 text-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 pointer-events-auto"
                  aria-label="Siga-nos no Pinterest"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.4 7.63 11.13-.1-.95-.2-2.4.04-3.43.22-.93 1.4-5.93 1.4-5.93s-.36-.72-.36-1.77c0-1.66.96-2.9 2.17-2.9 1.02 0 1.51.77 1.51 1.68 0 1.03-.65 2.56-.99 3.98-.28 1.18.6 2.15 1.76 2.15 2.11 0 3.73-2.22 3.73-5.43 0-2.84-2.04-4.83-4.96-4.83-3.38 0-5.37 2.54-5.37 5.16 0 1.02.4 2.12.89 2.72.1.12.11.23.08.35-.1.38-.3.1.25-.4l-.08-.34c-.11-.47-.79-3.23-.79-3.49 0-.28-.1-.52-.33-.65-1.57-.92-2.53-3.04-2.53-4.9 0-3.98 2.9-7.64 8.35-7.64 4.38 0 7.8 3.13 7.8 7.3 0 4.36-2.75 7.87-6.57 7.87-1.28 0-2.49-.67-2.9-1.45 0 0-.64 2.43-.79 3.03-.29 1.1-.85 2.22-1.32 2.99 1.12.35 2.3.54 3.52.54 6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
                  </svg>
                </a>
              </div>
              <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-zinc-400 text-[11px] font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" /> {copy.badge}
              </span>
              </div>
            </div>
          </div>

              {/* Soluções (Services) Sitemap */}
              <div>
                <h4 className="font-display font-semibold text-white text-sm tracking-wide mb-6">
                  {copy.servicesTitle}
                </h4>
                <ul className="space-y-3 font-sans text-sm text-zinc-400">
                  {copy.serviceLinks.map((link) => (
                    <li key={link.path}>
                      <button
                        onClick={() => handleLinkClick(link.path)}
                        className="hover:text-brand transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 cursor-pointer flex items-center gap-1.5"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Programas (Partnerships & Portals) Sitemap */}
              <div>
                <h4 className="font-display font-semibold text-white text-sm tracking-wide mb-6">
                  {copy.programsTitle}
                </h4>
                <ul className="space-y-3 font-sans text-sm text-zinc-400">
                  {copy.programLinks.map((link) => (
                    <li key={link.path}>
                      <button
                        onClick={() => handleLinkClick(link.path)}
                        className="group hover:text-brand transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{link.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct Sitemap (Institucional) */}
              <div>
                <h4 className="font-display font-semibold text-white text-sm tracking-wide mb-6">
                  {copy.institutionTitle}
                </h4>
                <ul className="space-y-3 font-sans text-sm text-zinc-400">
                  {copy.institutionLinks.map((link) => (
                    <li key={link.label + (link.path ?? link.action)}>
                      <button
                        onClick={() => {
                          if (link.action === "privacy" || link.action === "terms") {
                            setActiveModal(link.action);
                          } else if (link.path) {
                            handleLinkClick(link.path);
                          }
                        }}
                        className="hover:text-brand transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 cursor-pointer"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

          {/* Ecosystem cross-domain links */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wide mb-6">
              {copy.ecosystemTitle}
            </h4>
            <ul className="space-y-3 font-sans text-sm text-zinc-400">
              {ecosystemLinks.map((property) => (
                <li key={property.key}>
                  <a
                    href={property.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-brand transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    {property.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Contact */}
              <div>
                <h4 className="font-display font-semibold text-white text-sm tracking-wide mb-6">
                  {copy.connectTitle}
                </h4>
                <ul className="space-y-4 font-sans text-sm text-zinc-400">
                  <li className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-brand mt-0.5" />
                    <div>
                      <p className="text-[11px] text-zinc-500 uppercase font-sans tracking-wider">{copy.contactEmailTitle}</p>
                      <a
                        href="mailto:contato@tag08.com.br"
                        onClick={() => handleOutboundClick("contato@tag08.com.br", "mailto:contato@tag08.com.br", "footer-contact-email")}
                        className="text-white hover:text-brand transition-colors font-sans text-[13px]"
                      >
                        contato@tag08.com.br
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-brand mt-0.5" />
                    <div>
                      <p className="text-[11px] text-zinc-500 uppercase font-sans tracking-wider">{copy.contactPhoneTitle}</p>
                      <div className="space-y-2 mt-1 font-mono text-[13px]">
                        {TAG08_WHATSAPP_CONTACTS.map((contact) => (
                          <div key={contact.key}>
                            <a
                              href={contact.href}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => handleOutboundClick(contact.label, contact.href, "footer-contact-whatsapp")}
                              className={`transition-colors inline-flex items-center gap-1.5 ${
                                contact.key === "brazil" ? "text-white hover:text-brand" : "text-white hover:text-brand-secondary"
                              }`}
                              aria-label={`Abrir WhatsApp ${contact.label}`}
                            >
                              <span className="text-sm leading-none" title={contact.country.name}>
                                <CountryFlag country={contact.country} />
                              </span>
                              <span>{contact.display}</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-brand mt-0.5" />
                    <div>
                      <p className="text-[11px] text-zinc-500 uppercase font-sans tracking-wider">{copy.locationTitle}</p>
                      <a
                        href={officialContact.googleBusinessUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white text-sm hover:text-brand transition-colors"
                      >
                        {copy.locationValue}
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
        </div>

        {/* Brand statement / certifications */}
        <div className="py-8 border-t border-b border-white/[0.04] grid grid-cols-1 md:grid-cols-2 gap-6 items-center font-sans text-[11px] text-zinc-500">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-zinc-400 uppercase tracking-widest text-[10px]">TAG08 ACADEMY &amp; PROCESS:</span>
            <span className="flex items-center gap-1 text-zinc-450 uppercase text-[10px]"><CheckCircle className="w-3.5 h-3.5 text-brand" /> Atendimento Consultivo</span>
            <span className="flex items-center gap-1 text-zinc-450 uppercase text-[10px]"><CheckCircle className="w-3.5 h-3.5 text-brand" /> Entrega sistêmica</span>
          </div>
          <div className="md:text-right uppercase tracking-widest text-[10px] text-zinc-500">
            TAG08 CONSULTORIA E MARKETING LTDA &bull; CNPJ: 26.828.685/0001-52 &bull; Registrado e Desenvolvido de Forma Estratégica
          </div>
        </div>

        {/* Legal / Copyright row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between font-sans text-xs text-zinc-500 gap-4">
          <p>&copy; {new Date().getFullYear()} TAG08. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <button
              aria-label="Abrir política de privacidade"
              onClick={() => setActiveModal("privacy")}
              className="hover:text-brand transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
            >
              Política de Privacidade
            </button>
            <button
              aria-label="Abrir termos de uso"
              onClick={() => setActiveModal("terms")}
              className="hover:text-brand transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
            >
              Termos de Uso
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Modal for Privacy Policy / Termos de Uso */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-charcoal-900 border border-white/[0.08] max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-xl p-8 shadow-2xl relative"
            >
              <button
                aria-label="Fechar modal"
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
              >
                &times; Fechar
              </button>

              {activeModal === "privacy" ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                    <ShieldAlert className="w-6 h-6 text-brand-secondary" />
                    <div>
                      <h3 className="text-xl font-display font-semibold text-white">
                        Política de Privacidade &amp; Proteção de Dados (LGPD)
                      </h3>
                      <p className="text-xs text-zinc-500 font-sans">Em conformidade com a Lei Geral de Proteção de Dados (Lei n 13.709/2018)</p>
                    </div>
                  </div>

                  <div className="text-zinc-300 text-sm space-y-4 font-sans leading-relaxed">
                    <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider bg-white/[0.03] px-3 py-1.5 rounded-md border border-white/[0.05]">
                      Última atualização: Junho de 2026 &bull; TAG08 Consultoria e Marketing LTDA
                    </p>
                    <p>
                      Na <strong>TAG08</strong>, a privacidade e a segurança dos seus dados pessoais são prioridades absolutas. Tratamos todas as informações coletadas com confidencialidade extrema, ética e rigor técnico.
                    </p>

                    <div className="border-l-2 border-brand-secondary pl-3.5 space-y-2 py-1">
                      <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-brand">1. O QUE COLETAMOS E POR QU?</h4>
                      <p className="text-xs">
                        Coletamos apenas dados voluntariamente fornecidos pelo titular em nossos formulários (Nome, E-mail, Empresa e WhatsApp) ou cookies de navegação autorizados. O tratamento possui base legal fundamentada no <strong>Artigo 7, Inciso V (Execução de Contrato/Procedimentos Preliminares)</strong> ou no <strong>Artigo 7, Inciso I (Consentimento)</strong> da LGPD.
                      </p>
                    </div>

                    <div className="border-l-2 border-brand-secondary pl-3.5 space-y-2 py-1">
                      <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-brand">2. SEUS DIREITOS COMO TITULAR (ART. 18 LGPD)</h4>
                      <p className="text-xs">
                        Você possui controle total sobre suas informações. A qualquer momento, você pode nos solicitar:
                      </p>
                      <ul className="list-disc pl-4 text-xs space-y-1 text-zinc-400">
                        <li>Confirmação da existancia de tratamento dos seus dados pessoais.</li>
                        <li>Acesso, consulta e correo de dados inexatos ou incompletos.</li>
                        <li>Eliminação definitiva de e-mails ou telefones dos canais de vendas.</li>
                        <li>Revogao imediata de consentimento previamente cedido.</li>
                      </ul>
                    </div>

                    {/* Interactive Cookie Preference Switchboard inside Policy Modal */}
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Cookie className="w-4 h-4 text-brand" />
                        <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Configurações de Privacidade do Navegador</h4>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Ative ou desative categorias de cookies abaixo. Cookies estritamente necessários não podem ser desligados, pois garantem a segurança do portal.
                      </p>
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between text-xs bg-black/20 p-2.5 rounded border border-white/[0.03]">
                          <div>
                            <span className="font-semibold text-white block">Cookies Essenciais (obrigatórios)</span>
                        <span className="text-[10px] text-zinc-500">Parâmetros de contraste, segurança do formulário e temas.</span>
                          </div>
                          <span className="text-[10px] text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded uppercase font-mono">Sempre Ativo</span>
                        </div>

                        <div className="flex items-center justify-between text-xs bg-black/20 p-2.5 rounded border border-white/[0.03]">
                          <div>
                            <span className="font-semibold text-white block">Estatísticas &amp; Análise de Desempenho</span>
                          <span className="text-[10px] text-zinc-500">Análise de cliques e tempo de permanência de forma animada.</span>
                          </div>
                          <button
                            aria-label={cookiePreferences.performance ? "Desativar cookies de desempenho" : "Ativar cookies de desempenho"}
                            onClick={() => setCookiePreferences(prev => ({ ...prev, performance: !prev.performance }))}
                            className={`px-3 py-1 rounded text-[10px] font-sans transition-all font-black ${
                              cookiePreferences.performance 
                                ? "bg-brand-secondary text-black hover:bg-white" 
                                : "bg-white/5 text-zinc-400 hover:bg-white/10"
                            }`}
                          >
                            {cookiePreferences.performance ? "ATIVADO" : "DESATIVADO"}
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-xs bg-black/20 p-2.5 rounded border border-white/[0.03]">
                          <div>
                            <span className="font-semibold text-white block">Marketing &amp; Redes Sociais</span>
                            <span className="text-[10px] text-zinc-500">Direcionamento inteligente e conteúdos incorporados do Facebook/YouTube.</span>
                          </div>
                          <button
                            aria-label={cookiePreferences.marketing ? "Desativar cookies de marketing" : "Ativar cookies de marketing"}
                            onClick={() => setCookiePreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                            className={`px-3 py-1 rounded text-[10px] font-sans transition-all font-black ${
                              cookiePreferences.marketing 
                                ? "bg-brand-secondary text-black hover:bg-white" 
                                : "bg-white/5 text-zinc-400 hover:bg-white/10"
                            }`}
                          >
                            {cookiePreferences.marketing ? "ATIVADO" : "DESATIVADO"}
                          </button>
                        </div>
                      </div>
                      <div className="pt-2 text-right">
                        <button aria-label="Salvar preferências de privacidade"
                          onClick={handleSaveCookiePreferences}
                          className="text-[11px] font-sans font-bold text-black bg-brand-secondary hover:bg-white px-3 py-1.5 rounded transition-all shrink-0 cursor-pointer"
                        >
                          Salvar Preferências de Privacidade
                        </button>
                      </div>
                    </div>

                    {/* Interactive Data subject Request Form (Exercer Direitos) */}
                    <div className="border border-brand-secondary/20 bg-brand-secondary/[0.02] p-4.5 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Scale className="w-4 h-4 text-brand-secondary" />
                          <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Canal LGPD - Exercer Meus Direitos</h4>
                        </div>
                        <button
                          onClick={() => {
                            if (showLgpdForm) {
                              handleResetLgpdForm();
                            } else {
                              setShowLgpdForm(true);
                            }
                          }}
                          className="text-[10px] font-sans text-brand-secondary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 cursor-pointer"
                        >
                          {showLgpdForm ? "[ Recolher Formulário ]" : "[ Abrir Pedido de Direitos ]"}
                        </button>
                      </div>

                      {showLgpdForm && (
                        <div className="pt-2">
                          {lgpdRequestSuccess ? (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-black/30 border border-green-500/30 rounded-lg p-4 space-y-2.5 text-xs"
                            >
                              <div className="flex items-center gap-2 text-green-400 font-bold">
                                <CheckCircle className="w-4 h-4 shrink-0" />
                                <span>Solicitação Legal Protocolada com Sucesso!</span>
                              </div>
                              <p className="text-zinc-300 leading-relaxed">
                                Em conformidade com o Artigo 19 da LGPD, iniciamos os procedimentos para analisar e processar sua demanda. Um retorno formal contendo o comprovante da execução de sua solicitação será enviado para o e-mail cadastrado em até <strong>15 dias</strong>, conforme prazo legal preconizado pela Autoridade Nacional de Proteção de Dados (ANPD).
                              </p>
                              <div className="p-2.5 bg-black/50 border border-white/5 rounded font-sans text-[10px] text-zinc-400 flex justify-between items-center">
                                <span>Protocolo de Pedido:</span>
                                <span className="text-brand-secondary font-black">#LGPD-{Math.floor(102500 + Math.random() * 885000)}</span>
                              </div>
                              <div className="pt-1.5">
                                <button
                                  aria-label="Fechar mensagem de sucesso"
                                  type="button"
                                  onClick={handleResetLgpdForm}
                                  className="text-[10px] font-sans text-zinc-400 hover:text-white underline cursor-pointer"
                                >
                                  Fazer nova solicitação
                                </button>
                              </div>
                            </motion.div>
                          ) : (
                            <form onSubmit={handleLgpdSubmit} className="space-y-3 text-xs">
                              <p className="text-zinc-400 text-[11px]">
                                Preencha o Formulário abaixo para enviar um pedido formal de tratamento de dados ao nosso Encarregado de Dados (DPO) através do e-mail oficial <strong className="text-white">contato@tag08.com.br</strong>:
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-zinc-400 text-[10px] uppercase font-mono mb-1">Seu Nome Completo *</label>
                                  <input
                                    required
                                    type="text"
                                    value={lgpdRequestName}
                                    onChange={(e) => setLgpdRequestName(e.target.value)}
                                    placeholder="Ex: Carlos Eduardo de Oliveira"
                                    className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 focus:border-brand-secondary"
                                  />
                                </div>
                                <div>
                                  <label className="block text-zinc-400 text-[10px] uppercase font-mono mb-1">Seu E-mail Cadastrado *</label>
                                  <input
                                    required
                                    type="email"
                                    value={lgpdRequestEmail}
                                    onChange={(e) => setLgpdRequestEmail(e.target.value)}
                                    placeholder="Ex: seuemail@dominio.com"
                                    className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 focus:border-brand-secondary"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-zinc-400 text-[10px] uppercase font-mono mb-1">Qual direito deseja exercer? *</label>
                                <select
                                  value={lgpdRequestType}
                                  onChange={(e) => setLgpdRequestType(e.target.value as any)}
                                  className="w-full bg-black border border-white/10 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 focus:border-brand-secondary"
                                >
                                  <option value="exclusão">Eliminação / Exclusão total dos meus dados (Data Wipeout)</option>
                                  <option value="acesso">Acesso e Consulta detalhada sobre meus dados coletados</option>
                                  <option value="correção">Correção ou atualização de dados cadastrados incorretamente</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-zinc-400 text-[10px] uppercase font-mono mb-1 font-mono">Observações / Detalhes Adicionais</label>
                                <textarea
                                  rows={2}
                                  value={lgpdRequestDetails}
                                  onChange={(e) => setLgpdRequestDetails(e.target.value)}
                                  placeholder="Escreva detalhes para ajudar nossa equipe a identificar suas inscrições."
                                  className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 focus:border-brand-secondary resize-none"
                                />
                              </div>

                              <button
                                type="submit"
                                disabled={lgpdRequestLoading}
                                className="w-full bg-brand-secondary text-black text-[11px] font-mono font-black uppercase tracking-wider py-2 rounded shadow hover:bg-white transition-all disabled:opacity-50 cursor-pointer"
                              >
                                {lgpdRequestLoading ? "Processando e gerando protocolo..." : "Enviar Solicitação Legal TAG08"}
                              </button>
                            </form>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] bg-white/[0.02] border border-white/5 rounded-lg p-3 text-zinc-400">
                      <strong>Encarregado pelo Tratamento de Dados Pessoais (DPO):</strong> Carlos Eduardo &bull; Qualquer dúvida ou solicitação direta de alteração legal de consentimento em lote pode ser direcionada ao e-mail de governança <strong className="text-white">contato@tag08.com.br</strong>.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                    <FileText className="w-6 h-6 text-brand-secondary" />
                    <div>
                      <h3 className="text-xl font-display font-semibold text-white">
                        Termos de Uso &amp; Diretrizes Comerciais
                      </h3>
                      <p className="text-xs text-zinc-500 font-sans">Regulamento Operacional de Serviços e Consultoria Executiva</p>
                    </div>
                  </div>

                  <div className="text-zinc-300 text-sm space-y-4 font-sans leading-relaxed">
                    <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider bg-white/[0.03] px-3 py-1.5 rounded-md border border-white/[0.05]">
                      TAG08 Consultoria e Marketing LTDA &bull; CNPJ 26.828.685/0001-52
                    </p>
                    <p>
                      Ao usufruir da navegação deste portal e solicitar orientações estratégicas, você concorda e se vincula às diretrizes operacionais de excelência intelectual expressas a seguir:
                    </p>
                    <p>
                      <strong>1. Ausência de promessas milagrosas:</strong> Nossos métodos de branding, mídia e otimização de processos baseiam-se em engenharia de dados, testes reais e execução sistêmica madura. Não vendemos ilusões de faturamentos rápidos ou atalhos fáceis de atração de leads sem consistência de marca.
                    </p>
                    <p>
                      <strong>2. Propriedade Intelectual:</strong> Todos os ativos customizados gerados durante nossa parceria de serviços (vetores de identidade de marca, layouts, templates comerciais, manuais de posicionamento e códigos personalizados) tornam-se de propriedade exclusiva do cliente respectivo imediatamente após a regularização financeira do plano correspondente.
                    </p>
                    <p>
                      <strong>3. Relacionamento profissional:</strong> Preconizamos a eficácia, o respeito à agenda executiva e o acompanhamento claro de cronogramas. Nenhuma prática de má conduta, desavença ou assédio corporativo é tolerada em nossos fluxos operacionais estratégicos.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-4 border-t border-zinc-800 text-right">
                <button
                  aria-label="Fechar modal de termos e diretrizes"
                  onClick={() => setActiveModal(null)}
                  className="bg-brand text-black font-semibold px-5 py-2 rounded text-xs hover:bg-brand-dark transition-all duration-200"
                >
                  Entendi e concordo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LGPD Cookie Consent Banner */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-lg bg-charcoal-950/95 backdrop-blur-lg border border-white/[0.08] p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-40 text-left"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-brand-secondary/10 rounded-lg text-brand-secondary shrink-0 mt-0.5">
                  <Cookie className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-display font-semibold text-white flex items-center gap-2">
                    Privacidade &amp; Cookies (LGPD)
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                    Valorizamos sua privacidade. Com a TAG08 e nossos parceiros (Facebook, YouTube, Google) operamos cookies para analisar o tráfego do portal e otimizar recursos de acordo com seus interesses, em conformidade com a LGPD brasileira (Lei n 13.709/18).
                  </p>
                </div>
              </div>

              {customizeCookies ? (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-black/30 rounded-lg p-3 space-y-2 border border-white/[0.04] text-xs font-sans text-left"
                >
                  <p className="text-[11px] text-zinc-400 mb-2 font-sans">Configure suas preferências de cookies abaixo:</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">Essenciais</span>
                      <span className="text-[10px] text-zinc-500">Tema do portal e formulários seguros.</span>
                    </div>
                    <span className="text-[10px] text-brand-secondary/80 font-mono">OBRIGATÓRIO</span>
                  </div>

                  <hr className="border-white/[0.04] my-1" />

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">Desempenho &amp; Estatísticas</span>
                      <span className="text-[10px] text-zinc-500">Google Analytics anônimo.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCookiePreferences(prev => ({ ...prev, performance: !prev.performance }))}
                      className={`text-[10px] font-sans px-2 py-0.5 rounded font-black ${
                        cookiePreferences.performance ? "bg-brand-secondary text-black" : "bg-white/5 text-zinc-400"
                      }`}
                    >
                      {cookiePreferences.performance ? "ATIVADO" : "DESATIVADO"}
                    </button>
                  </div>

                  <hr className="border-white/[0.04] my-1" />

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">Marketing &amp; Redes Sociais</span>
                      <span className="text-[10px] text-zinc-500">Youtube, Facebook e links externos.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCookiePreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                      className={`text-[10px] font-sans px-2 py-0.5 rounded font-black ${
                        cookiePreferences.marketing ? "bg-brand-secondary text-black" : "bg-white/5 text-zinc-400"
                      }`}
                    >
                      {cookiePreferences.marketing ? "ATIVADO" : "DESATIVADO"}
                    </button>
                  </div>
                </motion.div>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-2 pt-1.5 justify-end text-xs font-sans">
                    <button
                      aria-label={customizeCookies ? "Fechar personalização de cookies" : "Abrir personalização de cookies"}
                      type="button"
                      onClick={() => setCustomizeCookies(!customizeCookies)}
                      className="text-zinc-400 hover:text-white px-3 py-2 text-center transition-all cursor-pointer"
                >
                  {customizeCookies ? "[ Fechar Ajustes ]" : "[ Personalizar... ]"}
                </button>
                    <button
                      aria-label="Rejeitar todos os cookies"
                      type="button"
                      onClick={handleRejectCookies}
                      className="border border-white/10 hover:bg-white/5 text-zinc-300 font-bold px-3.5 py-2 rounded-lg transition-all text-center cursor-pointer"
                >
                  Rejeitar
                </button>
                <button
                  aria-label={customizeCookies ? "Salvar ajustes de cookies" : "Aceitar todos os cookies"}
                  type="button"
                  onClick={customizeCookies ? handleSaveCookiePreferences : handleAcceptAllCookies}
                  className="bg-brand-secondary hover:bg-white text-black font-black px-4 py-2 rounded-lg transition-all text-center cursor-pointer shadow-[0_2px_10px_rgba(var(--color-brand-secondary-rgb),0.2)]"
                >
                  {customizeCookies ? "Salvar Ajustes" : "Aceitar Todos"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
















