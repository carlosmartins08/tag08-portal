import type { RouteKey, RouteLocale } from "../config/routeRegistry";

export type TranslationState = "pending" | "approved";

type LocaleReview = {
  state: TranslationState;
  /** SHA-256 of the Portuguese source reviewed for this translation. */
  sourceFingerprint?: string;
};

export type RouteLocalizationReadiness = {
  /** Route component that owns the page-level experience. */
  entryFile: string;
  /** Explicit manifest of files whose visible copy, SEO, or editorial evidence is reviewed for this route. */
  sourceFiles: readonly string[];
  /** Aggregate SHA-256 of the normalized source manifest reviewed by editorial. */
  sourceFingerprint?: string;
  locales: Record<Exclude<RouteLocale, "pt">, LocaleReview>;
};

const sharedRouteSources = [
  "src/features/site/RouteContent.tsx",
  "src/features/site/SiteShell.tsx",
  "src/components/Header.tsx",
  "src/components/Breadcrumbs.tsx",
  "src/components/Footer.tsx",
  "src/components/WhatsAppButton.tsx",
  "src/i18n/siteI18n.ts",
  "src/config/routeRegistry.ts",
  "src/lib/seo.ts",
  "src/i18n/languageAvailability.mjs",
  "src/app/[locale]/[[...segments]]/page.tsx",
  "src/app/sitemap.ts"
] as const;

const pending = (sourceFile: string, additionalSources: readonly string[] = []): RouteLocalizationReadiness => ({
  entryFile: sourceFile,
  sourceFiles: [...new Set([...sharedRouteSources, sourceFile, ...additionalSources])].sort(),
  locales: {
    en: { state: "pending" },
    es: { state: "pending" }
  }
});


const approved = (sourceFile: string, fingerprint: string, additionalSources: readonly string[] = []): RouteLocalizationReadiness => ({
  ...pending(sourceFile, additionalSources),
  sourceFingerprint: fingerprint,
  locales: {
    en: { state: "approved", sourceFingerprint: fingerprint },
    es: { state: "approved", sourceFingerprint: fingerprint }
  }
});

/**
 * Single publication gate for translations. Adding a locale to a route is not
 * enough: its review must match the exact source content fingerprint.
 */
export const localizationReadiness: Record<RouteKey, RouteLocalizationReadiness> = {
  // EN/ES visitor availability is approved for the translated public routes; search indexing remains PT-only.
  home: approved("src/features/site/pages/Home.tsx", "386930dd270a799ae553571639521bd30583f095aff61c3627a27bfc090d722f", ["src/features/site/pages/HomeMethodSection.tsx", "src/components/HeroEditorialStage.tsx", "src/i18n/homeCopy.ts", "src/i18n/externalContent.ts", "src/data.ts", "src/content/publicEvidence.ts", "src/components/TrustTestimonialsSection.tsx", "src/lib/officialContent.ts"]),
  sobre: approved("src/features/site/pages/Sobre.tsx", "18453d756bb0b986f64ee8cc826d9674402a4c5a4b190d45625056acc4a8d158", ["src/data.ts", "src/content/publicEvidence.ts", "src/components/TrustTestimonialsSection.tsx"]),
  servicos: approved("src/features/site/pages/Servicos.tsx", "20f90b6af492ce184ceb612ba39750aaeb722c7a624935305fa845060bd020a6", ["src/data.ts", "src/components/ServiceInsightsBridge.tsx", "src/content/serviceInsightsBridge.ts"]),
  "servicos-process-intelligence": approved("src/features/site/pages/ProcessIntelligence.tsx", "4ebdb81b24f10c7345038a11d5656d3699f42f577719b6fcb47fdbd8c41122ef", ["src/components/ServiceInsightsBridge.tsx", "src/content/serviceInsightsBridge.ts", "src/lib/simulators/processIntelligence.ts"]),
  "servicos-process-activation": approved("src/features/site/pages/ProcessActivation.tsx", "81353cc933d89fce88475e57165ecbee597fdec55ef1f33ccbffa3deda407c15", ["src/components/ServiceInsightsBridge.tsx", "src/content/serviceInsightsBridge.ts", "src/lib/simulators/processActivation.ts"]),
  "servicos-desenvolvimento-web": approved("src/features/site/pages/DesenvolvimentoWeb.tsx", "9f9985757d2d232200f1bb1e9ebd85fb1cc23a3ca370bc09130ab6ab44f97cb7", ["src/components/ServiceInsightsBridge.tsx", "src/content/serviceInsightsBridge.ts"]),
  "servicos-branding-identidade": approved("src/features/site/pages/Branding.tsx", "03cc6374eafe67601d1650e544569cfa08a32d3b0680862eb3589d1647933ad1", ["src/components/ServiceInsightsBridge.tsx", "src/content/serviceInsightsBridge.ts"]),
  "servicos-gestao-redes-sociais": approved("src/features/site/pages/GestaoRedesSociais.tsx", "edf1c4138be0339e2712f26a176b0dd4452786b3177b832a5bf0ab1a233b640e", ["src/components/ServiceInsightsBridge.tsx", "src/content/serviceInsightsBridge.ts", "src/lib/useOfficialYouTubeVideos.ts", "src/lib/officialContent.ts"]),
  "servicos-producao-audiovisual": approved("src/features/site/pages/ProducaoAudiovisual.tsx", "4cf848ce8dd2922613512221bbd295434ce0e26db3e89c44319cac9405d00936", ["src/components/ServiceInsightsBridge.tsx", "src/content/serviceInsightsBridge.ts", "src/lib/useOfficialYouTubeVideos.ts", "src/lib/officialContent.ts"]),
  "servicos-assessoria-marketing-digital-estrategico": approved("src/features/site/pages/AssessoriaMarketingDigitalEstrategico.tsx", "c2017c276cc59ff3053c3d4a1b73e3d7b52688742bbcb275ebdc9e9ae9a69b5c", ["src/components/ServiceInsightsBridge.tsx", "src/content/serviceInsightsBridge.ts", "src/components/TrustTestimonialsSection.tsx", "src/content/publicEvidence.ts"]),
  contato: approved("src/features/site/pages/Contato.tsx", "9e9d5823184322c94f5a9f169acc1dae6f739618a9a2856b811896a26f1243f5", ["src/config/siteNetwork.ts"]),
  privacidade: approved("src/features/site/pages/Privacidade.tsx", "93c2bbef1ea5de8381825c022a2c636fa90b59eb6bde6197b8bf7e567930f84c"),
  "trabalhe-conosco": approved("src/features/site/pages/TrabalheConosco.tsx", "d1dfeb0614218bf1a4a19b07db2cfa15c1f1d125d003fbc121a2b07aebda0d98", ["src/config/siteNetwork.ts"]),
  insights: approved("src/features/site/pages/Insights.tsx", "45b9ad4c70223108c2b2ca12045a42d292d81f96159eb33cfd170dbe9154a7ec", ["src/features/site/pages/insightsTranslations.ts", "src/data.ts"]),
  "case-study-detail": pending("src/features/site/pages/CaseStudyDetail.tsx", ["src/data.ts", "src/content/publicEvidence.ts"]),
  "sebraetec-impulsionando-empreendedores": approved("src/features/site/pages/Sebraetec.tsx", "8342edc050d16d32b3d07c99d96ab5cf3f9167675e939a6d325681414678499b"),
  "programa-afiliados": approved("src/features/site/pages/ProgramaAfiliados.tsx", "1a78ed7d1ee53d7425ab83bdfb5241143a1f239f01f1e9051af4cf9501685db6", ["src/lib/simulators/affiliateCommission.ts", "src/components/ServiceInsightsBridge.tsx", "src/content/serviceInsightsBridge.ts"]),
  "hospedagem-manutencao-sites": approved("src/features/site/pages/HospedagemManutencaoSites.tsx", "b6743f77f0b48a62b2ae43e5d14cebb243f2c7dee0d41a2768954f71594e1147", ["src/lib/simulators/hostingPrice.ts", "src/components/ServiceInsightsBridge.tsx", "src/content/serviceInsightsBridge.ts"]),
  "not-found": pending("src/features/site/pages/NotFound.tsx"),
  "cliente-onboarding": pending("src/features/site/pages/ClienteOnboarding.tsx")
};

export const isLocaleTranslationReady = (routeKey: RouteKey, locale: RouteLocale): boolean => {
  if (locale === "pt") return true;

  const entry = localizationReadiness[routeKey];
  const review = entry.locales[locale];
  return review.state === "approved" && Boolean(entry.sourceFingerprint) && review.sourceFingerprint === entry.sourceFingerprint;
};
