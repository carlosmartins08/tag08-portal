import { useState, useEffect } from "react";
import { ChevronDown, Menu, X, ArrowUpRight, MessageSquare, Briefcase, Compass, Settings, Users, Mail, Award, Activity, Sun, Moon, Video } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { i18n, type UiLanguage } from "../i18n/siteI18n";
import { TAG08_WHATSAPP_CONTACTS } from "../config/siteNetwork";
import { trackCtaClick, trackOutboundClick } from "../lib/analytics";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  theme: "light" | "dark" | "balanced";
  setTheme: (theme: "light" | "dark" | "balanced") => void;
  language: UiLanguage;
  onLanguageChange: (language: UiLanguage) => void;
}

export default function Header({ currentPage, onNavigate, theme, setTheme, language, onLanguageChange }: HeaderProps) {
  const copy = i18n[language].header;
  const serviceIcons = [Award, MessageSquare, Compass, Settings, Video, Briefcase, Users];
  const localizedServices = copy.servicePages.map((svc, index) => ({
    ...svc,
    icon: serviceIcons[index],
  }));
  const localizedMainLinks = [
    { id: 0, label: copy.navHome, path: "/" },
    { id: 1, label: copy.navAbout, path: "/sobre" },
    { id: 2, label: copy.navServices, path: "/servicos", isDropdown: true },
  ];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOutboundClick = (label: string, url: string, surface: string) => {
    trackOutboundClick({
      label,
      url,
      surface,
      language
    });
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
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-charcoal-950/85 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)]"
          : "py-6 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo with futuristic tracking */}
        <button
          id="btn-logo-home"
          onClick={() => handleLinkClick("/", copy.brandSubtitle, "header-logo", "brand")}
          className="flex items-center gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 group select-none"
        >
          <img
            src="/brand/logos/logo-horizontal-no-tagline-primary.svg"
            alt="TAG08"
            className="h-8 w-auto max-w-[150px] sm:max-w-[200px] opacity-95 transition-opacity duration-300 group-hover:opacity-100"
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
                  onMouseEnter={() => {
                    setHoveredIndex(link.id);
                    setDropdownOpen(true);
                  }}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    onClick={() => handleLinkClick("/servicos", link.label, "header-services-dropdown", "navigation")}
                    className={`px-4 py-2 rounded-full text-xs font-semibold font-sans relative z-10 transition-colors duration-300 flex items-center gap-1 cursor-pointer ${
                      isActive ? "text-brand" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.97 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-1/2 -translate-x-[40%] mt-3 w-[640px] bg-charcoal-900/98 backdrop-blur-3xl border border-white/[0.08] rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden grid grid-cols-12 gap-6"
                      >
                        {/* Background subtle glow inside dropdown */}
                        <div className="absolute top-0 right-0 w-44 h-44 bg-brand/3 rounded-full blur-[40px] pointer-events-none" />

                        {/* Left column: Services */}
                        <div className="col-span-7 space-y-4">
                          <div className="font-mono text-[9px] text-brand uppercase tracking-widest font-bold border-b border-white/[0.04] pb-1.5 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5" /> {copy.navTitleServices}
                          </div>
                          
                          <div className="grid gap-1.5">
                            {localizedServices.map((svc) => (
                              <button
                                key={svc.path}
                                onClick={() => handleLinkClick(svc.path, svc.name, "header-services-dropdown", "navigation")}
                                className="group flex gap-3 text-left p-2 rounded-xl hover:bg-white/[0.04] transition-all duration-200"
                              >
                                <div className="mt-0.5 p-2 rounded-lg bg-white/[0.02] text-zinc-400 group-hover:text-brand group-hover:bg-brand/10 transition-colors duration-200 shrink-0">
                                  <svc.icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-white font-semibold text-xs group-hover:text-brand transition-colors flex items-center gap-1">
                                    {svc.name}
                                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                  </div>
                                  <p className="text-zinc-500 text-[10px] leading-snug mt-0.5 truncate">{svc.desc}</p>
                                </div>
                              </button>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-white/[0.04]">
                            <button
                              onClick={() => handleLinkClick("/servicos", copy.navExploreAllServices, "header-services-dropdown-cta", "navigation")}
                              className="text-[11px] font-bold font-sans text-brand hover:text-brand-dark transition-colors flex items-center gap-1"
                            >
                              {copy.navExploreAllServices} <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Right column: Highlights Info Premium Block */}
                        <div className="col-span-5 bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 flex flex-col justify-between relative overflow-hidden text-left">
                          <div className="space-y-4 relative z-10">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand/10 text-brand text-[9px] font-sans font-bold">
                              <Award className="w-3 h-3" /> {copy.navAccelerateTag}
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-display font-bold text-sm text-white">{copy.navAccelerateText}</h4>
                              <p className="text-zinc-400 text-[10px] leading-relaxed">
                                {copy.navAccelerateSubtext}
                              </p>
                            </div>

                            <div className="space-y-2 pt-2">
                              <div className="flex items-center gap-2 text-white font-sans text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                                <span>{copy.navAccelerateMetricA}</span>
                              </div>
                              <div className="flex items-center gap-2 text-white font-sans text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                                <span>{copy.navAccelerateMetricB}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleLinkClick("/contato", copy.navSolutionsCta, "header-services-dropdown-cta", "conversion")}
                            className="w-full mt-4 bg-brand hover:bg-brand-dark text-black font-bold font-mono text-[10px] uppercase py-2.5 rounded-lg transition-all duration-300 hover:shadow-[0_4px_15px_rgba(var(--color-brand-rgb),0.15)] select-none text-center"
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
                onClick={() => handleLinkClick(link.path, link.label, "header-nav", "navigation")}
                onMouseEnter={() => setHoveredIndex(link.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold font-sans relative transition-colors duration-300 cursor-pointer ${
                  isActive ? "text-brand" : "text-white/70 hover:text-white"
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

        {/* Right Corner Buttons: Fixed redundancies beautifully with high-end SP live indicator & single clean CTA */}
        <div className="hidden lg:flex items-center gap-5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] shadow-inner select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-white/50">
              {copy.statusTag}
            </span>
          </div>

          {/* Theme selection toggle button */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 hover:border-brand/40 text-white/80 hover:text-brand transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 cursor-pointer flex items-center justify-center shadow"
            title={theme === "light" ? copy.lightThemeTooltip : copy.darkThemeTooltip}
            aria-label="Alternar tema visual"
          >
            {theme === "light" ? (
              <Moon className="w-3.5 h-3.5" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-brand stroke-[2.5]" />
            )}
          </button>

          <button
            id="btn-nav-contato"
            onClick={() => handleLinkClick("/contato", copy.navMobileContact, "header-cta", "conversion")}
            className="cursor-pointer bg-brand hover:bg-brand-dark text-black text-xs font-bold font-sans px-5 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-1.5 shadow-[0_4px_20px_rgba(var(--color-brand-rgb),0.15)] hover:shadow-[0_4px_25px_rgba(var(--color-brand-rgb),0.35)] select-none rounded-tl-none rounded-br-none"
          >
            {copy.navMobileContact} <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Actions block including trigger and quick toggles */}
        <div className="lg:hidden flex items-center gap-2.5">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 text-white/80 hover:text-brand rounded-xl bg-white/[0.02] border border-white/[0.05] shadow cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 flex items-center justify-center"
            title={theme === "light" ? copy.lightThemeTooltip : copy.darkThemeTooltip}
            aria-label="Alternar tema visual mobile"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-brand stroke-[2.5]" />
            )}
          </button>

          <button
            id="btn-toggle-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 focus:ring-1 focus:ring-brand/30 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-brand" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Modern Fullscreen/Drawer Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="lg:hidden fixed inset-x-0 top-[65px] bg-charcoal-950/98 backdrop-blur-3xl border-b border-white/[0.08] shadow-3xl h-[calc(100vh-65px)] overflow-y-auto z-40 flex flex-col justify-between"
          >
            <div className="px-6 py-8 space-y-8">
              {/* Primary list of navigation */}
              <div className="space-y-4">
                <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-[0.2em] mb-2 font-bold">
                  {copy.navMobileTitle}
                </div>
                
                <div className="grid gap-3">
                  {localizedMainLinks.map((link) => {
                    const isActive = link.isDropdown ? isSolutionsActive : currentPage === link.path;
                    if (link.isDropdown) return null; // We display services separately beautifully below
                    return (
                      <button
                        key={link.id}
                        onClick={() => handleLinkClick(link.path, link.label, "mobile-nav", "navigation")}
                        className={`text-left text-xl font-display font-medium py-1 transition-all duration-300 flex items-center justify-between border-b border-white/[0.02] ${
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

              {/* Grid of Specialized services */}
              <div className="space-y-4">
                <div className="font-mono text-[9px] text-brand uppercase tracking-[0.2em] mb-2 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> {copy.navMobileSolutionsTitle}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {localizedServices.map((svc) => (
                    <button
                      key={svc.path}
                      onClick={() => handleLinkClick(svc.path, svc.name, "mobile-services", "navigation")}
                      className={`text-left p-3 rounded-xl border transition-all duration-300 text-xs flex gap-3 ${
                        currentPage === svc.path
                          ? "bg-brand/10 border-brand/30 text-brand"
                          : "bg-white/[0.01] border-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-white/[0.03] text-brand shrink-0">
                        <svc.icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{svc.name}</div>
                        <div className="text-[10px] text-zinc-500 leading-snug mt-0.5">{svc.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleLinkClick("/servicos", copy.navExploreAllServices, "mobile-services-cta", "navigation")}
                  className="w-full py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center text-xs font-sans font-semibold text-brand hover:bg-white/[0.06] transition-colors"
                >
                  {copy.navExploreAllServices}
                </button>
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
                    className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors font-sans"
                  >
                    <MessageSquare className="w-4 h-4 text-brand/70" />
                    <span className="inline-flex items-center gap-2">
                      <span className="text-[8px] font-black uppercase bg-white/[0.04] border border-white/[0.08] px-1.5 py-0.5 rounded text-zinc-300">
                        {contact.badge}
                      </span>
                      <span>{contact.display}</span>
                    </span>
                  </a>
                ))}
                <a
                  href="mailto:contato@tag08.com.br"
                  onClick={() => handleOutboundClick("contato@tag08.com.br", "mailto:contato@tag08.com.br", "header-contact-email")}
                  className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors font-sans"
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
                    className={`font-sans font-bold text-xs py-3.5 rounded-xl text-center transition-all duration-300 ${
                      contact.key === "brazil"
                        ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                        : "bg-brand hover:bg-brand-dark text-black"
                    }`}
                    aria-label={`Abrir WhatsApp ${contact.label}`}
                  >
                    {contact.badge} WhatsApp
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sleek, micro-thin Cupertino scroll progress indicator bar */}
      <div 
        className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-brand to-brand-dark transition-all duration-75 pointer-events-none z-50 shadow-[0_1px_5px_rgba(var(--color-brand-rgb),0.5)]" 
        style={{ width: `${scrollProgress}%` }} 
      />
    </header>
  );
}



