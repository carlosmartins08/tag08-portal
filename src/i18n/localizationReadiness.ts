import type { RouteKey, RouteLocale } from "../config/routeRegistry";

export type TranslationState = "pending" | "approved";

type LocaleReview = {
  state: TranslationState;
  /** SHA-256 of the Portuguese source reviewed for this translation. */
  sourceFingerprint?: string;
};

export type RouteLocalizationReadiness = {
  /** Component that owns the source content until it is extracted to a catalog. */
  sourceFile: string;
  /** SHA-256 of the source reviewed by editorial. */
  sourceFingerprint?: string;
  locales: Record<Exclude<RouteLocale, "pt">, LocaleReview>;
};

const pending = (sourceFile: string): RouteLocalizationReadiness => ({
  sourceFile,
  locales: {
    en: { state: "pending" },
    es: { state: "pending" }
  }
});

/**
 * Single publication gate for translations. Adding a locale to a route is not
 * enough: its review must match the exact source content fingerprint.
 */
export const localizationReadiness: Record<RouteKey, RouteLocalizationReadiness> = {
  home: pending("src/features/site/pages/Home.tsx"),
  sobre: pending("src/features/site/pages/Sobre.tsx"),
  servicos: pending("src/features/site/pages/Servicos.tsx"),
  "servicos-process-intelligence": pending("src/features/site/pages/ProcessIntelligence.tsx"),
  "servicos-process-activation": pending("src/features/site/pages/ProcessActivation.tsx"),
  "servicos-desenvolvimento-web": pending("src/features/site/pages/DesenvolvimentoWeb.tsx"),
  "servicos-branding-identidade": pending("src/features/site/pages/Branding.tsx"),
  "servicos-gestao-redes-sociais": pending("src/features/site/pages/GestaoRedesSociais.tsx"),
  "servicos-producao-audiovisual": pending("src/features/site/pages/ProducaoAudiovisual.tsx"),
  "servicos-assessoria-marketing-digital-estrategico": pending("src/features/site/pages/AssessoriaMarketingDigitalEstrategico.tsx"),
  contato: pending("src/features/site/pages/Contato.tsx"),
  "trabalhe-conosco": pending("src/features/site/pages/TrabalheConosco.tsx"),
  insights: pending("src/features/site/pages/Insights.tsx"),
  "case-study-detail": pending("src/features/site/pages/CaseStudyDetail.tsx"),
  "sebraetec-impulsionando-empreendedores": pending("src/features/site/pages/Sebraetec.tsx"),
  "programa-afiliados": pending("src/features/site/pages/ProgramaAfiliados.tsx"),
  "hospedagem-manutencao-sites": pending("src/features/site/pages/HospedagemManutencaoSites.tsx"),
  "not-found": pending("src/features/site/pages/NotFound.tsx"),
  "cliente-onboarding": {
    sourceFile: "src/features/site/pages/ClienteOnboarding.tsx",
    sourceFingerprint: "45a7a9830703bed6c1894ebd4fdd01391b8e66f2e54e39bf4012a5761e9607f2",
    locales: {
      en: { state: "approved", sourceFingerprint: "45a7a9830703bed6c1894ebd4fdd01391b8e66f2e54e39bf4012a5761e9607f2" },
      es: { state: "approved", sourceFingerprint: "45a7a9830703bed6c1894ebd4fdd01391b8e66f2e54e39bf4012a5761e9607f2" }
    }
  }
};

export const isLocaleTranslationReady = (routeKey: RouteKey, locale: RouteLocale): boolean => {
  if (locale === "pt") return true;

  const entry = localizationReadiness[routeKey];
  const review = entry.locales[locale];
  return review.state === "approved" && Boolean(entry.sourceFingerprint) && review.sourceFingerprint === entry.sourceFingerprint;
};
