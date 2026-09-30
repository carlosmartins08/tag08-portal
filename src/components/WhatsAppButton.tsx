import { useEffect, useRef, useState } from "react";
import { ArrowUp, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { type UiLanguage } from "../i18n/siteI18n";
import { TAG08_WHATSAPP_CONTACTS } from "../config/siteNetwork";
import { safeStorage } from "../utils/storage";
import { trackOutboundClick } from "../lib/analytics";
import CountryFlag from "./CountryFlag";

interface WhatsAppButtonProps {
  language: UiLanguage;
  currentPage: string;
}

type Copy = {
  title: string;
  body: string;
  open: string;
  close: string;
  backTop: string;
  ariaOpen: string;
};

const COPY: Record<UiLanguage, Copy> = {
  pt: {
    title: "Atendimento TAG08",
    body: "Escolha o WhatsApp ideal para o seu atendimento.",
    open: "Abrir opções",
    close: "Fechar",
    backTop: "Voltar ao topo",
    ariaOpen: "Abrir atendimento no WhatsApp",
  },
  en: {
    title: "TAG08 Support",
    body: "Choose the right WhatsApp channel for your request.",
    open: "Open options",
    close: "Close",
    backTop: "Back to top",
    ariaOpen: "Open WhatsApp support",
  },
  es: {
    title: "Atencion TAG08",
    body: "Elige el WhatsApp ideal para tu atención.",
    open: "Abrir opciones",
    close: "Cerrar",
    backTop: "Volver arriba",
    ariaOpen: "Abrir atencion por WhatsApp",
  },
};

export default function WhatsAppButton({ language, currentPage }: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<UiLanguage>(language);
  const [lgpdBannerHeight, setLgpdBannerHeight] = useState(0);
  const floatingRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const copy = COPY[selectedLanguage] ?? COPY.pt;

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  useEffect(() => {
    setIsOpen(false);
    setShowNotification(false);
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    const handleLgpdChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ visible?: boolean; height?: number }>;
      setLgpdBannerHeight(customEvent.detail?.visible ? Math.ceil(customEvent.detail.height ?? 0) : 0);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setShowNotification(false);
      }
    };

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (floatingRef.current && !floatingRef.current.contains(target)) {
        setIsOpen(false);
        setShowNotification(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("lgpd-banner-change" as any, handleLgpdChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("lgpd-banner-change" as any, handleLgpdChange);
    };
  }, []);

  const handleLaunchWhatsApp = (href: string, label: string, surface: string) => {
    trackOutboundClick({
      label,
      url: href,
      surface,
      language: selectedLanguage
    });
    window.open(href, "_blank", "noopener,noreferrer");
    setIsOpen(false);
    setShowNotification(false);
    safeStorage.set("whatsapp_notification_dismissed", "true");
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  const bottomOffset = lgpdBannerHeight > 0
    ? `calc(${lgpdBannerHeight}px + 1.75rem + env(safe-area-inset-bottom))`
    : undefined;

  return (
    <>
      <div className="fixed bottom-3 left-4 z-40 transition-[bottom] duration-200 ease-out sm:bottom-6 sm:left-6" style={bottomOffset ? { bottom: bottomOffset } : undefined}>
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              key="scroll-to-top"
              type="button"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: 10 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: 10 }}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.08 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
              onClick={handleScrollToTop}
              className="bg-charcoal-900/90 text-white h-11 w-11 rounded-full flex items-center justify-center border border-white/10 hover:border-brand/40 hover:text-brand shadow-[0_8px_25px_rgba(0,0,0,0.5)] backdrop-blur-md transition-[border-color,color] duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 motion-reduce:transition-none"
              title={copy.backTop}
              aria-label={copy.backTop}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div ref={floatingRef} className="fixed bottom-3 right-4 z-40 flex flex-col items-end transition-[bottom] duration-200 ease-out sm:bottom-6 sm:right-6" style={bottomOffset ? { bottom: bottomOffset } : undefined}>
        <AnimatePresence>
          {showNotification && !isOpen && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 15 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
              className="mb-3 w-[min(18rem,calc(100vw-2rem))] sm:w-80 bg-charcoal-900 border border-brand/20 rounded-xl p-4 shadow-2xl relative text-left"
            >
              <button
                type="button"
                aria-label={copy.close}
                onClick={() => {
                  setShowNotification(false);
                  safeStorage.set("whatsapp_notification_dismissed", "true");
                }}
                className="absolute right-2 top-2 flex min-h-11 min-w-11 items-center justify-center text-zinc-300 hover:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="text-sm font-semibold text-white">{copy.title}</div>
              <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">{copy.body}</p>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {TAG08_WHATSAPP_CONTACTS.map((contact) => (
                  <button
                    key={contact.key}
                    type="button"
                    onClick={() => handleLaunchWhatsApp(contact.href, contact.label, "floating-notification")}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                      contact.key === "brazil"
                        ? "bg-brand text-black hover:bg-brand/90"
                        : "bg-brand-secondary text-black hover:bg-brand-secondary/90"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm leading-none" title={contact.country.name}>
                      <CountryFlag country={contact.country} />
                    </span>
                    <span>{contact.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

          <motion.button
            type="button"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={copy.ariaOpen}
            aria-expanded={isOpen}
            aria-controls="whatsapp-panel"
            className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-brand text-black shadow-[0_10px_35px_rgba(0,0,0,0.35)] transition-colors duration-200 hover:bg-brand/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 motion-reduce:transition-none"
          >
            <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="whatsapp-panel"
              role="region"
              aria-labelledby="whatsapp-panel-title"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
              className="mt-4 w-[min(20rem,calc(100vw-2rem))] sm:w-80 max-h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-white/[0.08] bg-charcoal-900 shadow-3xl"
            >
              <div className="flex items-center justify-between border-b border-white/[0.05] bg-charcoal-800 p-4">
                <h2 id="whatsapp-panel-title" className="text-sm font-semibold text-white">{copy.title}</h2>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label={copy.close}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-zinc-300 hover:bg-white/[0.05] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm text-zinc-300">{copy.body}</p>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  {TAG08_WHATSAPP_CONTACTS.map((contact) => (
                    <button
                      key={contact.key}
                      type="button"
                      onClick={() => handleLaunchWhatsApp(contact.href, contact.label, "floating-panel")}
                      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                        contact.key === "brazil"
                          ? "bg-brand text-black hover:bg-brand/90"
                          : "bg-brand-secondary text-black hover:bg-brand-secondary/90"
                      }`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm leading-none" title={contact.country.name}>
                        <CountryFlag country={contact.country} />
                      </span>
                      <span>{contact.display}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
