import { useEffect, useRef, useState } from "react";
import { ArrowUp, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { type UiLanguage } from "../i18n/siteI18n";
import { TAG08_WHATSAPP_CONTACTS } from "../config/siteNetwork";
import { safeStorage } from "../utils/storage";
import { trackOutboundClick } from "../lib/analytics";

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
  const [isLgpdBannerOpen, setIsLgpdBannerOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const floatingRef = useRef<HTMLDivElement>(null);

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
      const customEvent = e as CustomEvent<{ visible?: boolean; custom?: boolean }>;
      setIsLgpdBannerOpen(Boolean(customEvent.detail?.visible));
      setIsCustomOpen(Boolean(customEvent.detail?.custom));
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const bottomOffset = isLgpdBannerOpen ? (isCustomOpen ? "bottom-[425px]" : "bottom-[245px]") : "bottom-6";

  return (
    <>
      <div className={`fixed left-4 sm:left-6 z-40 transition-all duration-500 ease-out ${bottomOffset}`}>
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              key="scroll-to-top"
              type="button"
              initial={{ opacity: 0, scale: 0.7, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 10 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleScrollToTop}
              className="bg-charcoal-900/90 text-white w-11 h-11 rounded-full flex items-center justify-center border border-white/10 hover:border-brand/40 hover:text-brand shadow-[0_8px_25px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
              title={copy.backTop}
              aria-label={copy.backTop}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div ref={floatingRef} className={`fixed right-4 sm:right-6 z-40 flex flex-col items-end transition-all duration-500 ease-out ${bottomOffset}`}>
        <AnimatePresence>
          {showNotification && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-3 w-[min(18rem,calc(100vw-2rem))] sm:w-80 bg-charcoal-900 border border-brand/20 rounded-xl p-4 shadow-2xl relative text-left"
            >
              <button
                type="button"
                aria-label={copy.close}
                onClick={() => {
                  setShowNotification(false);
                  safeStorage.set("whatsapp_notification_dismissed", "true");
                }}
                className="absolute top-2 right-2 text-zinc-500 hover:text-white p-1 cursor-pointer"
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
                    <span className="font-mono text-[10px] font-black uppercase tracking-wider">
                      {contact.badge}
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={copy.ariaOpen}
            aria-expanded={isOpen}
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand text-black shadow-[0_10px_35px_rgba(0,0,0,0.35)] transition-colors hover:bg-brand/90"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="mt-4 w-[min(20rem,calc(100vw-2rem))] sm:w-80 max-h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-white/[0.08] bg-charcoal-900 shadow-3xl"
            >
              <div className="flex items-center justify-between border-b border-white/[0.05] bg-charcoal-800 p-4">
                <div className="text-sm font-semibold text-white">{copy.title}</div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label={copy.close}
                  className="rounded-full p-1 text-zinc-400 hover:bg-white/[0.05] hover:text-white"
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
                      <span className="font-mono text-[10px] font-black uppercase tracking-wider">
                        {contact.badge}
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
