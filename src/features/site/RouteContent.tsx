"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import ErrorBoundary from "../../components/ErrorBoundary";
import { canonicalizeRoute, getContentReviewRouteByPath, getLocalizedPath, getRouteByPath, type RouteLocale } from "../../config/routeRegistry";

const Home = dynamic(() => import("./pages/Home"));
const Sobre = dynamic(() => import("./pages/Sobre"));
const Servicos = dynamic(() => import("./pages/Servicos"));
const ProcessIntelligence = dynamic(() => import("./pages/ProcessIntelligence"));
const ProcessActivation = dynamic(() => import("./pages/ProcessActivation"));
const DesenvolvimentoWeb = dynamic(() => import("./pages/DesenvolvimentoWeb"));
const Branding = dynamic(() => import("./pages/Branding"));
const GestaoRedesSociais = dynamic(() => import("./pages/GestaoRedesSociais"));
const Contato = dynamic(() => import("./pages/Contato"));
const TrabalheConosco = dynamic(() => import("./pages/TrabalheConosco"));
const Insights = dynamic(() => import("./pages/Insights"));
const ClienteOnboarding = dynamic(() => import("./pages/ClienteOnboarding"));
const CaseStudyDetail = dynamic(() => import("./pages/CaseStudyDetail"));
const Sebraetec = dynamic(() => import("./pages/Sebraetec"));
const ProgramaAfiliados = dynamic(() => import("./pages/ProgramaAfiliados"));
const HospedagemManutencaoSites = dynamic(() => import("./pages/HospedagemManutencaoSites"));
const AssessoriaMarketingDigitalEstrategico = dynamic(() => import("./pages/AssessoriaMarketingDigitalEstrategico"));
const ProducaoAudiovisual = dynamic(() => import("./pages/ProducaoAudiovisual"));

export default function RouteContent({ path, locale }: { path: string; locale: RouteLocale }) {
  const router = useRouter();
  const navigate = (targetPath: string) => router.push(getLocalizedPath(canonicalizeRoute(targetPath), locale));
  const route = getRouteByPath(path) ?? getContentReviewRouteByPath(path);

  let page = null;
  if (route?.routeCategory === "case-study") page = <CaseStudyDetail caseId={path.replace("/casos/", "")} onNavigate={navigate} />;
  else if (path === "/") page = <Home onNavigate={navigate} locale={locale} />;
  else if (path === "/sobre") page = <Sobre onNavigate={navigate} />;
  else if (path === "/servicos") page = <Servicos onNavigate={navigate} />;
  else if (path === "/servicos/process-intelligence") page = <ProcessIntelligence onNavigate={navigate} />;
  else if (path === "/servicos/process-activation") page = <ProcessActivation onNavigate={navigate} />;
  else if (path === "/servicos/desenvolvimento-web") page = <DesenvolvimentoWeb onNavigate={navigate} />;
  else if (path === "/servicos/branding-identidade") page = <Branding onNavigate={navigate} />;
  else if (path === "/servicos/gestao-de-redes-sociais") page = <GestaoRedesSociais onNavigate={navigate} />;
  else if (path === "/servicos/producao-audiovisual") page = <ProducaoAudiovisual onNavigate={navigate} />;
  else if (path === "/contato") page = <Contato locale={locale} />;
  else if (path === "/trabalhe-conosco") page = <TrabalheConosco onNavigate={navigate} locale={locale} />;
  else if (path === "/insights") page = <Insights onNavigate={navigate} />;
  else if (path === "/cliente/onboarding") page = <ClienteOnboarding onNavigate={navigate} />;
  else if (path === "/sebraetec-impulsionando-empreendedores") page = <Sebraetec onNavigate={navigate} />;
  else if (path === "/programa-afiliados") page = <ProgramaAfiliados onNavigate={navigate} />;
  else if (path === "/hospedagem-manutencao-sites") page = <HospedagemManutencaoSites onNavigate={navigate} />;
  else if (path === "/servicos/assessoria-marketing-digital-estrategico") page = <AssessoriaMarketingDigitalEstrategico onNavigate={navigate} />;

  return <ErrorBoundary boundaryName={`route:${path}`}>{page}</ErrorBoundary>;
}
