"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import ErrorBoundary from "../../components/ErrorBoundary";
import { canonicalizeRoute, getLocalizedPath, getRouteByPath, type RouteLocale } from "../../config/routeRegistry";
import { contextualizeContactTarget } from "../../lib/contactJourney";

const Home = dynamic(() => import("./pages/Home"));
const Sobre = dynamic(() => import("./pages/Sobre"));
const Servicos = dynamic(() => import("./pages/Servicos"));
const ProcessIntelligence = dynamic(() => import("./pages/ProcessIntelligence"));
const ProcessActivation = dynamic(() => import("./pages/ProcessActivation"));
const DesenvolvimentoWeb = dynamic(() => import("./pages/DesenvolvimentoWeb"));
const Branding = dynamic(() => import("./pages/Branding"));
const GestaoRedesSociais = dynamic(() => import("./pages/GestaoRedesSociais"));
const Contato = dynamic(() => import("./pages/Contato"));
const Privacidade = dynamic(() => import("./pages/Privacidade"));
const TrabalheConosco = dynamic(() => import("./pages/TrabalheConosco"));
const Insights = dynamic(() => import("./pages/Insights"));
const CaseStudyDetail = dynamic(() => import("./pages/CaseStudyDetail"));
const Sebraetec = dynamic(() => import("./pages/Sebraetec"));
const ProgramaAfiliados = dynamic(() => import("./pages/ProgramaAfiliados"));
const HospedagemManutencaoSites = dynamic(() => import("./pages/HospedagemManutencaoSites"));
const AssessoriaMarketingDigitalEstrategico = dynamic(() => import("./pages/AssessoriaMarketingDigitalEstrategico"));
const ProducaoAudiovisual = dynamic(() => import("./pages/ProducaoAudiovisual"));

export default function RouteContent({ path, locale }: { path: string; locale: RouteLocale }) {
  const router = useRouter();
  const getNavigationHref = (targetPath: string) => {
    const contextualTarget = contextualizeContactTarget(path, targetPath);
    const [targetWithoutHash] = contextualTarget.split("#", 1);
    const queryIndex = targetWithoutHash.indexOf("?");
    const targetRoute = queryIndex === -1 ? targetWithoutHash : targetWithoutHash.slice(0, queryIndex);
    const query = queryIndex === -1 ? "" : targetWithoutHash.slice(queryIndex);
    return `${getLocalizedPath(canonicalizeRoute(targetRoute), locale)}${query}`;
  };
  const navigate = (targetPath: string) => router.push(getNavigationHref(targetPath));
  const route = getRouteByPath(path);

  let page = null;
  if (route?.routeCategory === "case-study") page = <CaseStudyDetail caseId={path.replace("/casos/", "")} onNavigate={navigate} locale={locale} />;
  else if (path === "/") page = <Home onNavigate={navigate} contactHref={getNavigationHref("/contato")} locale={locale} />;
  else if (path === "/sobre") page = <Sobre onNavigate={navigate} locale={locale} />;
  else if (path === "/servicos") page = <Servicos onNavigate={navigate} locale={locale} />;
  else if (path === "/servicos/process-intelligence") page = <ProcessIntelligence onNavigate={navigate} locale={locale} />;
  else if (path === "/servicos/process-activation") page = <ProcessActivation onNavigate={navigate} locale={locale} />;
  else if (path === "/servicos/desenvolvimento-web") page = <DesenvolvimentoWeb onNavigate={navigate} locale={locale} />;
  else if (path === "/servicos/branding-identidade") page = <Branding onNavigate={navigate} locale={locale} />;
  else if (path === "/servicos/gestao-de-redes-sociais") page = <GestaoRedesSociais onNavigate={navigate} locale={locale} />;
  else if (path === "/servicos/producao-audiovisual") page = <ProducaoAudiovisual onNavigate={navigate} locale={locale} />;
  else if (path === "/contato") page = <Contato locale={locale} />;
  else if (path === "/privacidade") page = <Privacidade onNavigate={navigate} locale={locale} />;
  else if (path === "/trabalhe-conosco") page = <TrabalheConosco onNavigate={navigate} locale={locale} />;
  else if (route?.key === "insights") page = <Insights onNavigate={navigate} locale={locale} articleSlug={path === "/insights" ? undefined : path.slice("/insights/".length)} />;
  else if (path === "/sebraetec-impulsionando-empreendedores") page = <Sebraetec onNavigate={navigate} locale={locale} />;
  else if (path === "/programa-afiliados") page = <ProgramaAfiliados onNavigate={navigate} contactHref={getNavigationHref("/contato")} locale={locale} />;
  else if (path === "/hospedagem-manutencao-sites") page = <HospedagemManutencaoSites onNavigate={navigate} locale={locale} />;
  else if (path === "/servicos/assessoria-marketing-digital-estrategico") page = <AssessoriaMarketingDigitalEstrategico onNavigate={navigate} locale={locale} />;

  return <ErrorBoundary boundaryName={`route:${path}`}>{page}</ErrorBoundary>;
}
