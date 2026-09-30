import Image from "next/image";
import { useState, useEffect, useRef, type CSSProperties } from "react";
import { ChevronDown, Menu, X, ArrowUpRight, MessageSquare, Briefcase, Compass, Settings, Users, Mail, Award, Activity, Video } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { i18n, type UiLanguage } from "../i18n/siteI18n";
import { getRouteByPath, isRouteLocalePublished } from "../config/routeRegistry";
import { TAG08_WHATSAPP_CONTACTS } from "../config/siteNetwork";
import { trackCtaClick, trackOutboundClick } from "../lib/analytics";
import CountryFlag from "./CountryFlag";
import FocusManagedDialog from "./FocusManagedDialog";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  language: UiLanguage;
  onLanguageChange: (language: UiLanguage) => void;
}

export default function Header({ currentPage, onNavigate, language, onLanguageChange }: HeaderProps) {
  const copy = i18n[language].header;
  const languageOptions: Array<{ code: UiLanguage; label: string; name: string }> = [
    { code: "pt", label: "PT", name: "Português" },
    { code: "en", label: "EN", name: "English" },
    { code: "es", label: "ES", name: "Español" }
  ];
  const currentRoute = getRouteByPath(currentPage);
  const isLanguageAvailable = (candidate: UiLanguage) =>
    !currentRoute || isRouteLocalePublished(currentRoute, candidate);
  const serviceIcons = [Award, MessageSquare, Compass, Settings, Video, Briefcase, Users];
  const localizedServices = copy.servicePages.map((svc, index) => ({
    ...svc,
    icon: serviceIcons[index],
  }));
  const serviceClusterCopy = {
    pt: [
      ["Organizar presença", "Conteúdo, canais e presença digital."],
      ["Posicionar a marca", "Clareza de oferta, linguagem e direção."],
      ["Estruturar operação", "Processos, tecnologia e continuidade."]
    ],
    en: [
      ["Organize presence", "Content, channels and digital presence."],
      ["Position the brand", "Clear offer, language and direction."],
      ["Structure operations", "Processes, technology and continuity."]
    ],
    es: [
      ["Organizar presencia", "Contenido, canales y presencia digital."],
      ["Posicionar la marca", "Claridad de oferta, lenguaje y dirección."],
      ["Estructurar la operación", "Procesos, tecnología y continuidad."]
    ]
  }[language];
  const serviceClusters = [
    {
      paths: ["/servicos/gestao-de-redes-sociais", "/servicos/producao-audiovisual"]
    },
    {
      paths: ["/servicos/assessoria-marketing-digital-estrategico", "/servicos/branding-identidade", "/servicos/desenvolvimento-web"]
    },
    {
      paths: ["/servicos/process-intelligence", "/servicos/process-activation"]
    }
  ].map((cluster, index) => ({
    label: serviceClusterCopy[index][0],
    description: serviceClusterCopy[index][1],
    ...cluster,
    services: cluster.paths
      .map((path) => localizedServices.find((service) => service.path === path))
      .filter((service): service is (typeof localizedServices)[number] => Boolean(service))
  }));
  const firstServicePath = serviceClusters.flatMap((cluster) => cluster.services).at(0)?.path;
  const localizedMainLinks = [
    { id: 0, label: copy.navHome, path: "/" },
    { id: 1, label: copy.navAbout, path: "/sobre" },
    { id: 2, label: copy.navServices, path: "/servicos", isDropdown: true },
    { id: 3, label: copy.navInsights, path: "/insights" },
  ];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(88);
  const prefersReducedMotion = useReducedMotion();
  const scrollFrameRef = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const servicesTriggerRef = useRef<HTMLButtonElement>(null);
  const firstServiceRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLButtonElement>(null);

  const availableLanguageOptions = languageOptions.filter((option) => isLanguageAvailable(option.code));

  useEffect(() => {
    const handleScroll = () => {
      if (scrollFrameRef.current !== null) return;
      scrollFrameRef.current = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0);
        scrollFrameRef.current = null;
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current);
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const updateHeaderHeight = () => setHeaderHeight(Math.ceil(header.getBoundingClientRect().height));
    updateHeaderHeight();
    const observer = new ResizeObserver(updateHeaderHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, [scrolled]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setDropdownOpen(false);
        servicesTriggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [dropdownOpen]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const frame = window.requestAnimationFrame(() => firstServiceRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [dropdownOpen]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && !target.closest("[aria-controls='desktop-services-panel']") && !target.closest("#desktop-services-panel")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [dropdownOpen]);

  const handleLinkClick = (page: string, ctaName: string, ctaLocation: string, ctaType: string = "navigation") => {
    trackCtaClick({
      cta_name: ctaName,
      cta_location: ctaLocation,
      cta_type: ctaType,
      page_path: currentPage,
      language
    });
    onNavigate(page);
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  const handleOutboundClick = (label: string, url: string, surface: string) => {
    trackOutboundClick({
      label,
      url,
      surface,
      language
    });
  };

  const handleLanguageSelection = (nextLanguage: UiLanguage, surface: string) => {
    if (nextLanguage === language || !isLanguageAvailable(nextLanguage)) return;

    trackCtaClick({
      cta_name: `language_${nextLanguage}`,
      cta_location: surface,
      cta_type: "navigation",
      page_path: currentPage,
      language
    });
    onLanguageChange(nextLanguage);
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  };

  const isSolutionsActive = [
    "/servicos/assessoria-marketing-digital-estrategico",
    "/assessoria-marketing-digital-estrategico",
    "/servicos/gestao-de-redes-sociais",
    "/servicos/branding-identidade",
    "/servicos/desenvolvimento-web",
    "/servicos/producao-audiovisual",
    "/servicos/process-intelligence",
    "/servicos/process-activation",
    "/servicos"
  ].includes(currentPage);

  return (
    <header
      ref={headerRef}
      id="main-header"
      style={{ "--tag08-header-height": `${headerHeight}px` } as CSSProperties}
      className={`fixed top-0 left-0 right-0 z-50 transition-[padding,background-color,border-color,box-shadow] duration-200 ${
        scrolled
          ? "py-3 bg-charcoal-950/98 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.9)]"
          : "py-6 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-2 focus:z-[60] focus:rounded-md focus:bg-brand focus:px-3 focus:py-2 focus:text-xs focus:font-bold focus:text-black">
          Pular para o conteúdo
        </a>
        {/* Logo with futuristic tracking */}
        <button
          id="btn-logo-home"
          type="button"
          onClick={() => handleLinkClick("/", copy.brandSubtitle, "header-logo", "brand")}
          className="flex items-center gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 group select-none"
        >
          <Image
            src="/brand/logos/logo-horizontal-no-tagline-primary.svg"
            alt="TAG08"
            width={200}
            height={32}
            preload
            className="h-auto w-[150px] sm:w-[200px] opacity-95 transition-opacity duration-300 group-hover:opacity-100"
          />
          <span className="sr-only">{copy.brandSubtitle}</span>
        </button>

        {/* Desktop Navigation with Sliding Glider */}
        <nav
          id="desktop-nav"
          className="hidden lg:flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.05] p-1 rounded-full relative"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {localizedMainLinks.map((link) => {
            const isActive = link.isDropdown ? isSolutionsActive : currentPage === link.path;
            
            if (link.isDropdown) {
              return (
                <div
                  key={link.id}
                  className="relative"
                  onMouseEnter={() => setHoveredIndex(link.id)}
                >
                  <button
                    ref={servicesTriggerRef}
                    type="button"
                    aria-expanded={dropdownOpen}
                    aria-controls="desktop-services-panel"
                    aria-haspopup="true"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setDropdownOpen((open) => !open)}
                    onFocus={() => setHoveredIndex(link.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold font-sans relative z-10 transition-colors duration-300 flex items-center gap-1 cursor-pointer ${
                      isActive ? "text-brand" : "text-zinc-300 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        id="desktop-services-panel"
                        role="region"
                        aria-labelledby="desktop-services-heading"
                         initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 15, scale: 0.97 }}
                         animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                         exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.97 }}
                         transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
                        className="absolute left-1/2 -translate-x-[40%] mt-3 max-h-[calc(100dvh-7rem)] w-[640px] overflow-y-auto rounded-2xl border border-white/[0.08] bg-charcoal-900/98 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl grid grid-cols-12 gap-6"
                      >
                        {/* Background subtle glow inside dropdown */}
                        <div className="absolute top-0 right-0 w-44 h-44 bg-brand/3 rounded-full blur-[40px] pointer-events-none" />

                        {/* Left column: Services */}
                        <div className="col-span-7 space-y-4">
                          <div id="desktop-services-heading" className="tag08-meta text-xs text-brand uppercase tracking-widest font-bold border-b border-white/[0.04] pb-1.5 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5" /> {copy.navTitleServices}
                          </div>
                          
                          <div className="space-y-4">
                            {serviceClusters.map((cluster) => (
                              <div key={cluster.label} className="space-y-1.5">
                                <div>
                                  <p className="text-xs font-bold text-white">{cluster.label}</p>
                                  <p className="text-xs leading-snug text-zinc-400">{cluster.description}</p>
                                </div>
                                <div className="grid gap-1.5">
                                  {cluster.services.map((svc) => (
                                    <button
                                      key={svc.path}
                                      ref={svc.path === firstServicePath ? firstServiceRef : undefined}
                                      type="button"
                                      onClick={() => handleLinkClick(svc.path, svc.name, "header-services-dropdown", "navigation")}
                                      className="group flex min-h-11 gap-3 rounded-xl p-2 text-left transition-[background-color] duration-200 hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-inset"
                                    >
                                      <div className="mt-0.5 shrink-0 rounded-lg bg-white/[0.02] p-2 text-zinc-300 transition-[background-color,color] duration-200 group-hover:bg-brand/10 group-hover:text-brand">
                                        <svc.icon className="h-3.5 w-3.5" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-1 text-xs font-semibold text-white transition-colors duration-200 group-hover:text-brand">
                                          {svc.name}
                                          <ArrowUpRight className="h-3 w-3 opacity-0 transition-[opacity,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
                                        </div>
                                        <p className="mt-0.5 truncate text-xs leading-snug text-zinc-400">{svc.desc}</p>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-white/[0.04]">
                             <button
                               type="button"
                               className="min-h-11 text-xs font-bold font-sans text-brand hover:text-brand-dark transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900"
                               onClick={() => handleLinkClick("/servicos", copy.navExploreAllServices, "header-services-dropdown-cta", "navigation")}
                             >
                              {copy.navExploreAllServices} <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Right column: Highlights Info Premium Block */}
                        <div className="col-span-5 bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 flex flex-col justify-between relative overflow-hidden text-left">
                          <div className="space-y-4 relative z-10">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand/10 text-brand text-xs font-sans font-bold">
                              <Award className="w-3 h-3" /> {copy.navAccelerateTag}
                            </div>
                            <div className="space-y-1">
                              <p className="font-display font-bold text-sm text-white">{copy.navAccelerateText}</p>
                              <p className="text-zinc-400 text-xs leading-relaxed">
                                {copy.navAccelerateSubtext}
                              </p>
                            </div>

                            <div className="space-y-2 pt-2">
                              <div className="flex items-center gap-2 text-white font-sans text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                                <span>{copy.navAccelerateMetricA}</span>
                              </div>
                              <div className="flex items-center gap-2 text-white font-sans text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                                <span>{copy.navAccelerateMetricB}</span>
                              </div>
                            </div>
                          </div>

                           <button
                             type="button"
                            onClick={() => handleLinkClick("/contato", copy.navSolutionsCta, "header-services-dropdown-cta", "conversion")}
                             className="w-full min-h-11 mt-4 bg-brand hover:bg-brand-dark text-black font-bold font-sans text-xs uppercase py-2.5 rounded-lg transition-[background-color,box-shadow] duration-200 hover:shadow-[0_4px_15px_rgba(var(--color-brand-rgb),0.15)] select-none text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900"
                          >
                            {copy.navSolutionsCta}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleLinkClick(link.path, link.label, "header-nav", "navigation")}
                onMouseEnter={() => setHoveredIndex(link.id)}
                onFocus={() => setHoveredIndex(link.id)}
                aria-current={isActive ? "page" : undefined}
                    className={`min-h-11 px-4 py-2 rounded-full text-xs font-semibold font-sans relative transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 ${
                  isActive ? "text-brand" : "text-zinc-300 hover:text-white"
                }`}
              >
                {/* Frictionless Glide Backdrop Pill */}
                {hoveredIndex === link.id && (
                  <motion.span
                    layoutId="desktop-nav-backplane"
                    className="absolute inset-0 bg-white/[0.04] rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Language choice and the primary conversion action. */}
        <div className="hidden lg:flex items-center gap-5">
          <div aria-label="Selecionar idioma" className="flex items-center rounded-lg border border-white/[0.08] bg-white/[0.03] p-1" role="group">
            {availableLanguageOptions.map((option) => (
              <button
                key={option.code}
                type="button"
                aria-label={`Navegar em ${option.name}`}
                aria-pressed={language === option.code}
                disabled={!isLanguageAvailable(option.code)}
                onClick={() => handleLanguageSelection(option.code, "header-language")}
                title={option.name}
                  className={`min-h-11 rounded-md px-2.5 py-1.5 font-sans text-xs font-black tracking-wider transition-colors ${
                  language === option.code ? "bg-brand text-black" : isLanguageAvailable(option.code) ? "text-zinc-400 hover:text-white" : "cursor-not-allowed text-zinc-600 opacity-60"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            id="btn-nav-contato"
            onClick={() => handleLinkClick("/contato", copy.navMobileContact, "header-cta", "conversion")}
             className="min-h-11 cursor-pointer bg-brand hover:bg-brand-dark text-black text-xs font-bold font-sans px-5 py-2.5 rounded-lg transition-[background-color,box-shadow] duration-200 flex items-center gap-1.5 shadow-[0_4px_20px_rgba(var(--color-brand-rgb),0.15)] hover:shadow-[0_4px_25px_rgba(var(--color-brand-rgb),0.35)] select-none rounded-tl-none rounded-br-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
          >
            {copy.navMobileContact} <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Actions block including trigger and quick toggles */}
        <div className="lg:hidden flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleLinkClick("/contato", copy.navMobileContact, "mobile-header-cta", "conversion")}
            aria-label="Falar com a TAG08"
            className="min-h-11 rounded-lg bg-brand px-3 py-2 text-xs font-bold text-black transition-[background-color,box-shadow] duration-200 hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
          >
            Falar
          </button>
          <button
            id="btn-toggle-mobile-menu"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="p-2 text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 focus:ring-1 focus:ring-brand/30 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-brand" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Modern Fullscreen/Drawer Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <FocusManagedDialog
            id="mobile-navigation"
            ariaLabel="Navegação principal"
            initialFocusRef={firstMobileLinkRef}
            onClose={() => setMobileMenuOpen(false)}
             className="lg:hidden fixed inset-x-0 top-[var(--tag08-header-height)] z-40 max-h-[calc(100dvh-var(--tag08-header-height))] min-h-[calc(100dvh-var(--tag08-header-height))] overflow-y-auto bg-charcoal-950/98 pb-[env(safe-area-inset-bottom)] backdrop-blur-3xl border-b border-white/[0.08] shadow-3xl"
          >
            <motion.div
               initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
               animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
               exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -15 }}
               transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", duration: 0.4 }}
              className="flex min-h-full flex-col justify-between"
            >
            <div className="px-6 py-8 space-y-8">
              {/* Primary list of navigation */}
              <div className="space-y-4">
                <div className="tag08-meta text-xs text-zinc-400 uppercase tracking-[0.2em] mb-2 font-bold">
                  {copy.navMobileTitle}
                </div>
                
                <div className="grid gap-3">
                  {localizedMainLinks.map((link) => {
                    const isActive = link.isDropdown ? isSolutionsActive : currentPage === link.path;
                    if (link.isDropdown) return null; // We display services separately beautifully below
                    return (
                      <button
                        key={link.id}
                        ref={link.id === 0 ? firstMobileLinkRef : undefined}
                        type="button"
                        onClick={() => handleLinkClick(link.path, link.label, "mobile-nav", "navigation")}
                         className={`text-left text-xl font-display font-medium min-h-11 py-1 transition-[color,padding-left] duration-200 flex items-center justify-between border-b border-white/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 ${
                          isActive ? "text-brand pl-2" : "text-white/80 hover:text-white"
                        }`}
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className={`w-4 h-4 opacity-50 ${isActive ? "text-brand opacity-100" : ""}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 border-t border-white/[0.05] pt-6">
                <p className="tag08-meta text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Idioma do portal</p>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(5rem,1fr))] gap-2">
                  {availableLanguageOptions.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      aria-pressed={language === option.code}
                      aria-label={`Navegar em ${option.name}`}
                      disabled={!isLanguageAvailable(option.code)}
                      onClick={() => handleLanguageSelection(option.code, "mobile-language")}
                      title={option.name}
                       className={`min-h-11 rounded-lg border px-3 py-2.5 text-xs font-sans font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 ${
                        language === option.code
                          ? "border-brand bg-brand text-black"
                          : isLanguageAvailable(option.code)
                            ? "border-white/[0.07] bg-white/[0.02] text-zinc-400 hover:text-white"
                            : "cursor-not-allowed border-white/[0.04] bg-white/[0.01] text-zinc-600 opacity-60"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progressive disclosure for specialized services */}
              <div className="space-y-4">
                <button
                  type="button"
                  aria-expanded={mobileServicesOpen}
                  aria-controls="mobile-services-list"
                  onClick={() => setMobileServicesOpen((open) => !open)}
                  className="flex min-h-11 w-full items-center justify-between border-b border-white/[0.05] pb-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
                >
                  <span className="tag08-meta flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand">
                    <Activity className="h-3.5 w-3.5" aria-hidden="true" /> {copy.navMobileSolutionsTitle}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-brand transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
                {mobileServicesOpen && (
                  <div id="mobile-services-list" className="space-y-4">
                    {serviceClusters.map((cluster) => (
                      <div key={cluster.label} className="space-y-2">
                        <div>
                          <p className="text-xs font-bold text-white">{cluster.label}</p>
                          <p className="text-xs leading-snug text-zinc-400">{cluster.description}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          {cluster.services.map((svc) => (
                            <button
                              key={svc.path}
                              type="button"
                              onClick={() => handleLinkClick(svc.path, svc.name, "mobile-services", "navigation")}
                              className={`flex min-h-11 gap-3 rounded-xl border p-3 text-left text-xs transition-[background-color,border-color,color] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 ${
                                currentPage === svc.path
                                  ? "border-brand/30 bg-brand/10 text-brand"
                                  : "border-white/[0.04] bg-white/[0.01] text-zinc-300 hover:bg-white/[0.03] hover:text-white"
                              }`}
                            >
                              <div className="shrink-0 rounded-lg bg-white/[0.03] p-1.5 text-brand">
                                <svc.icon className="h-3.5 w-3.5" />
                              </div>
                              <div>
                                <div className="font-semibold text-white">{svc.name}</div>
                                <div className="mt-0.5 text-xs leading-snug text-zinc-400">{svc.desc}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleLinkClick("/servicos", copy.navExploreAllServices, "mobile-services-cta", "navigation")}
                      className="min-h-11 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 text-center text-xs font-semibold text-brand transition-colors duration-200 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
                    >
                      {copy.navExploreAllServices}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Contacts Footer in Menu */}
            <div className="px-6 py-8 bg-charcoal-900/55 border-t border-white/[0.04] space-y-6">
              <div className="grid grid-cols-1 gap-3 text-xs">
                {TAG08_WHATSAPP_CONTACTS.map((contact) => (
                  <a
                    key={contact.key}
                    href={contact.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleOutboundClick(`whatsapp_${contact.key}`, contact.href, "mobile-header-whatsapp-link")}
                    className="flex min-h-11 items-center gap-3 text-zinc-400 hover:text-white transition-colors font-sans focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
                  >
                    <MessageSquare className="w-4 h-4 text-brand/70" />
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-flex items-center justify-center text-sm leading-none" title={contact.country.name}>
                        <CountryFlag country={contact.country} />
                      </span>
                      <span>{contact.display}</span>
                    </span>
                  </a>
                ))}
                <a
                  href="mailto:contato@tag08.com.br"
                  onClick={() => handleOutboundClick("contato@tag08.com.br", "mailto:contato@tag08.com.br", "header-contact-email")}
                   className="flex min-h-11 items-center gap-3 text-zinc-400 hover:text-white transition-colors font-sans focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
                >
                  <Mail className="w-4 h-4 text-brand/70" />
                  <span>contato@tag08.com.br</span>
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {TAG08_WHATSAPP_CONTACTS.map((contact) => (
                  <a
                    key={contact.key}
                    href={contact.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleOutboundClick(`whatsapp_${contact.key}`, contact.href, "mobile-header-whatsapp-cta")}
                    className={`min-h-11 font-sans font-bold text-xs py-3.5 rounded-xl text-center transition-[background-color,color] duration-200 ${
                      contact.key === "brazil"
                        ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                        : "bg-brand hover:bg-brand-dark text-black"
                    }`}
                    aria-label={`Abrir WhatsApp ${contact.label}`}
                  >
                    <CountryFlag country={contact.country} className="mr-1" /> WhatsApp
                  </a>
                ))}
              </div>
            </div>
            </motion.div>
          </FocusManagedDialog>
        )}
      </AnimatePresence>
      
      {/* Sleek, micro-thin Cupertino scroll progress indicator bar */}
      <div 
        className="absolute bottom-0 left-0 z-50 h-[1.5px] pointer-events-none bg-gradient-to-r from-brand to-brand-dark transition-[width] duration-75 shadow-[0_1px_5px_rgba(var(--color-brand-rgb),0.5)] motion-reduce:transition-none"
        style={{ width: `${scrollProgress}%` }} 
      />
    </header>
  );
}



