import { ArrowLeft, ArrowUpRight, Compass, Globe, MessageSquare, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import type { RouteLocale } from "../../../config/routeRegistry";
import { buildBrazilWhatsAppUrl } from "../../../config/siteNetwork";
import { getNotFoundCopy } from "../../../i18n/notFoundCopy";

interface NotFoundProps {
  locale: RouteLocale;
  onNavigate: (page: string) => void;
}

export default function NotFound({ locale, onNavigate }: NotFoundProps) {
  const copy = getNotFoundCopy(locale);
  const navigate = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full bg-[#070709] text-white font-sans min-h-screen pt-32 pb-24 relative overflow-hidden select-none flex items-center justify-center">
      <div className="absolute top-[10%] left-[-15%] w-[600px] h-[600px] bg-brand-secondary/[0.012] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-15%] w-[600px] h-[600px] bg-brand-secondary/[0.008] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.002)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.002)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(var(--color-brand-secondary-rgb),0.015)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none opacity-30" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="md:col-span-5 flex flex-col justify-center items-center md:items-start space-y-4">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="relative">
              <div className="text-[120px] sm:text-[150px] md:text-[160px] font-display font-black leading-none text-brand-secondary tracking-tighter select-none animate-pulse opacity-95">404</div>
              <div className="absolute top-2 left-1 text-[120px] sm:text-[150px] md:text-[160px] font-display font-black leading-none text-white tracking-tighter opacity-15 select-none pointer-events-none blur-[1px]" />
              <div className="absolute -bottom-1 -right-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
                <span className="tag08-meta text-xs text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldAlert className="w-3 h-3 text-brand-secondary" />
                  {copy.systemStatus}
                </span>
              </div>
            </motion.div>

            <div className="pt-2 text-center md:text-left space-y-2">
              <span className="tag08-meta text-xs text-zinc-500 uppercase tracking-widest font-black block">{copy.eyebrow}</span>
              <p className="text-zinc-500 text-xs leading-relaxed font-sans max-w-xs mx-auto md:mx-0 select-none">{copy.technicalDescription}</p>
            </div>
          </div>

          <div className="md:col-span-7 space-y-8 text-left">
            <div className="space-y-3.5">
              <span className="tag08-meta text-xs text-brand-secondary uppercase tracking-widest font-black bg-brand-secondary/5 border border-brand-secondary/15 px-3 py-1 rounded w-max block">{copy.badge}</span>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-none text-left">{copy.title}</h1>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-lg">{copy.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.button onClick={() => navigate("/")} whileHover={{ scale: 1.01, y: -2 }} transition={{ duration: 0.2 }} className="bg-[#121214] hover:bg-[#161619] border border-white/5 hover:border-brand/20 p-5 rounded-2xl text-left space-y-3 group cursor-pointer transition-all duration-300">
                <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand-secondary group-hover:bg-brand-secondary group-hover:text-black transition-all"><Compass className="w-4 h-4 stroke-[2.5]" /></div>
                <div className="space-y-1">
                  <h4 className="text-white font-semibold text-xs sm:text-sm font-display flex items-center gap-1.5"><span>{copy.homeTitle}</span><ArrowLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 duration-200 text-brand" /></h4>
                  <p className="text-zinc-500 text-xs leading-snug">{copy.homeDescription}</p>
                </div>
              </motion.button>

              <motion.button onClick={() => navigate("/servicos")} whileHover={{ scale: 1.01, y: -2 }} transition={{ duration: 0.2 }} className="bg-[#121214] hover:bg-[#161619] border border-white/5 hover:border-brand-secondary/20 p-5 rounded-2xl text-left space-y-3 group cursor-pointer transition-all duration-300">
                <div className="w-8 h-8 rounded-lg bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center text-brand-secondary group-hover:bg-brand-secondary group-hover:text-black transition-all"><Globe className="w-4 h-4 stroke-[2.5]" /></div>
                <div className="space-y-1">
                  <h4 className="text-white font-semibold text-xs sm:text-sm font-display flex items-center gap-1.5"><span>{copy.servicesTitle}</span><ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 duration-200 text-brand" /></h4>
                  <p className="text-zinc-500 text-xs leading-snug">{copy.servicesDescription}</p>
                </div>
              </motion.button>
            </div>

            <div className="bg-brand-secondary text-black rounded-2xl p-5 flex flex-col sm:flex-row items-center sm:justify-between gap-4 shadow-xl">
              <div className="flex gap-3.5 items-center text-left">
                <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-brand-secondary shrink-0"><MessageSquare className="w-4 h-4 text-brand-secondary" /></div>
                <div className="space-y-0.5">
                  <span className="tag08-meta text-xs text-black/60 uppercase tracking-wider font-extrabold block">{copy.supportEyebrow}</span>
                  <p className="text-black font-semibold text-xs leading-none font-sans">{copy.supportQuestion}</p>
                </div>
              </div>

              <a href={buildBrazilWhatsAppUrl(copy.supportMessage)} target="_blank" rel="noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center gap-1 bg-black hover:bg-neutral-900 border border-black text-white px-4 py-2.5 rounded-xl font-sans text-xs uppercase font-black tracking-widest hover:scale-[1.02] transition-all cursor-pointer whitespace-nowrap">
                <span>{copy.supportAction}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-brand-secondary" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
