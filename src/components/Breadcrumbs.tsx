import { ChevronRight, Home, ArrowLeft, ArrowRight, Layers } from "lucide-react";
import { motion } from "motion/react";
import { CASE_STUDIES } from "../data";
import { getRouteByPath } from "../config/routeRegistry";
import { i18n, type UiLanguage } from "../i18n/siteI18n";

interface BreadcrumbsProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  language: UiLanguage;
}

interface Breadcrumb {
  label: string;
  path: string;
}

interface ServiceBreadcrumb {
  path: string;
  shortName: string;
}

export default function Breadcrumbs({ currentPage, onNavigate, language }: BreadcrumbsProps) {
  if (currentPage === "/") return null;

  const copy = i18n[language].breadcrumbs;
  const pathMap = copy.paths;
  const services = (copy.servicePages || []) as ServiceBreadcrumb[];
  const isCaseStudyPage = getRouteByPath(currentPage)?.routeCategory === "case-study";

  const getBreadcrumbs = () => {
    const list: Breadcrumb[] = [];
    list.push({ label: copy.home, path: "/" });

    if (isCaseStudyPage) {
      const caseId = currentPage.replace("/casos/", "");
      const selectedCase = CASE_STUDIES.find((caseStudy) => caseStudy.id === caseId);
      const clientName = selectedCase?.client || caseId
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      list.push({ label: copy.case, path: "/" });
      list.push({ label: clientName || copy.pageFallback, path: currentPage });
      return list;
    }

    if (currentPage.startsWith("/servicos/")) {
      list.push({ label: copy.serviceHomeLabel, path: "/servicos" });
      const serviceTitle = pathMap[currentPage] || copy.pageFallback;
      list.push({ label: serviceTitle, path: currentPage });
      return list;
    }

    const title = pathMap[currentPage] || copy.pageFallback;
    list.push({ label: title, path: currentPage });
    return list;
  };

  const breadcrumbs = getBreadcrumbs();
  const currentServiceIndex = services.findIndex(s => s.path === currentPage);
  const isServicePage = currentServiceIndex !== -1;

  const handlePrevService = () => {
    if (currentServiceIndex === -1) return;
    const prevIndex = (currentServiceIndex - 1 + services.length) % services.length;
    onNavigate(services[prevIndex].path);
  };

  const handleNextService = () => {
    if (currentServiceIndex === -1) return;
    const nextIndex = (currentServiceIndex + 1) % services.length;
    onNavigate(services[nextIndex].path);
  };

  return (
    <div className="w-full relative z-30 pt-24 pb-4 md:pt-28 md:pb-6 border-b border-white/[0.04] bg-charcoal-950/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-xs md:text-sm font-medium">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <div key={crumb.path + idx} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />}
                {idx === 0 ? (
                  <button
                    onClick={() => onNavigate(crumb.path)}
                    className="flex items-center gap-1 text-zinc-400 hover:text-brand transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
                    title={copy.homeBackTitle}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{crumb.label}</span>
                  </button>
                ) : isLast ? (
                  <span className="text-brand font-semibold select-none max-w-[200px] sm:max-w-none truncate">
                    {crumb.label}
                  </span>
                ) : (
                  <button
                    onClick={() => onNavigate(crumb.path)}
                    className="text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
                  >
                    {crumb.label}
                  </button>
                )}
              </div>
            );
          })}
        </nav>

        {isServicePage && (
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] p-1 rounded-lg mr-2">
              <span className="text-xs font-sans uppercase text-zinc-500 px-2 flex items-center gap-1">
                <Layers className="w-3 h-3 text-brand" /> {copy.shortcutLabel}
              </span>
              {services.map((svc) => {
                const isActive = svc.path === currentPage;
                return (
                  <button
                    key={svc.path}
                    onClick={() => onNavigate(svc.path)}
                    className={`px-2.5 py-1 rounded text-xs transition-all cursor-pointer font-medium ${
                      isActive
                        ? "bg-brand text-black font-semibold shadow"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {svc.shortName}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.05] p-1 rounded-lg">
              <button
                onClick={handlePrevService}
                className="p-1 px-2 text-zinc-400 hover:text-white hover:bg-white/[0.05] rounded transition-colors flex items-center gap-1 text-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
                title={copy.prevServiceLabel}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{copy.prevServiceLabel}</span>
              </button>
              <div className="w-[1px] h-4 bg-white/[0.08]" />
              <button
                onClick={handleNextService}
                className="p-1 px-2 text-zinc-400 hover:text-white hover:bg-white/[0.05] rounded transition-colors flex items-center gap-1 text-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
                title={copy.nextServiceLabel}
              >
                <span className="hidden xs:inline">{copy.nextServiceLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {isCaseStudyPage && (
          <button
            onClick={() => onNavigate("/")}
            className="text-xs flex items-center gap-1 text-zinc-400 hover:text-brand cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {copy.backCases}
          </button>
        )}
      </div>
    </div>
  );
}



