import assert from "node:assert/strict";
import { BLOG_POSTS, CASE_STUDIES } from "../src/data";
import { getVisibleEvidence, isEvidenceVisible, PUBLIC_EVIDENCE } from "../src/content/publicEvidence";
import { canonicalizeRoute, getIndexableLocales, getLocalizedPath, getPublishedLocales, getRouteByPath, indexedRoutePaths, isRouteLocalePublished, publicRoutePaths, renderableRoutePaths, routeRegistry, routeSitemapMeta, staticRouteSegments, INDEXABLE_LOCALES } from "../src/config/routeRegistry";
import { buildArticleSchema, buildOrganizationSchema, getRouteSeo } from "../src/lib/seo";
import { i18n } from "../src/i18n/siteI18n";
import { readFileSync } from "node:fs";

const routeContentSource = readFileSync("src/features/site/RouteContent.tsx", "utf8");
const catchAllPageSource = readFileSync("src/app/[locale]/[[...segments]]/page.tsx", "utf8");
const notFoundPageSource = readFileSync("src/app/[locale]/not-found.tsx", "utf8");
const onboardingPageSource = readFileSync("src/app/[locale]/cliente/onboarding/page.tsx", "utf8");
const socialPlansSource = readFileSync("src/features/site/pages/GestaoRedesSociais.tsx", "utf8");
const sebraetecSource = readFileSync("src/features/site/pages/Sebraetec.tsx", "utf8");

assert.deepEqual(INDEXABLE_LOCALES, ["pt"], "Only reviewed Portuguese content may be indexed until EN/ES approval");
const visitorLocaleRouteKeys = new Set([
  "home", "sobre", "servicos", "servicos-process-intelligence", "servicos-process-activation",
  "servicos-desenvolvimento-web", "servicos-branding-identidade", "servicos-gestao-redes-sociais",
  "servicos-producao-audiovisual", "contato", "privacidade", "trabalhe-conosco", "insights",
  "sebraetec-impulsionando-empreendedores", "programa-afiliados", "hospedagem-manutencao-sites",
  "servicos-assessoria-marketing-digital-estrategico"
]);
for (const route of routeRegistry) {
  const isVisitorLocalized = visitorLocaleRouteKeys.has(route.key);
  assert.deepEqual(getPublishedLocales(route), isVisitorLocalized ? ["pt", "en", "es"] : ["pt"], `${route.canonicalPath} locale availability must match route review`);
  assert.deepEqual(getIndexableLocales(route), ["pt"], `${route.canonicalPath} EN/ES must remain outside search indexing`);
  assert.equal(isRouteLocalePublished(route, "en"), isVisitorLocalized, `${route.canonicalPath} English availability must match route review`);
  assert.equal(isRouteLocalePublished(route, "es"), isVisitorLocalized, `${route.canonicalPath} Spanish availability must match route review`);
}
assert.ok(staticRouteSegments().some((segments) => segments.join("/") === "en"), "Reviewed English Home must be generated");
assert.ok(staticRouteSegments().some((segments) => segments.join("/") === "es"), "Reviewed Spanish Home must be generated");
assert.ok(staticRouteSegments().some((segments) => segments.join("/") === "en/sobre"), "English public pages must be generated");
assert.ok(staticRouteSegments().some((segments) => segments.join("/") === "es/sobre"), "Spanish public pages must be generated");
assert.ok(staticRouteSegments().some((segments) => segments.join("/") === "en/insights/conteudo-estrategico-apoia-decisoes"), "Translated legacy Insight routes must be generated");

const organizationSchema = buildOrganizationSchema();
assert.equal(organizationSchema["@type"], "Organization");
assert.equal(
  organizationSchema.description,
  "A TAG08 conecta estratégia, conteúdo, tecnologia e processos para organizar a presença digital de empresas com clareza, método e execução responsável."
);
assert.ok(JSON.parse(JSON.stringify(organizationSchema)).description, "Organization JSON-LD must serialize with a description");
assert.match(buildOrganizationSchema("en").description, /TAG08 brings strategy, content, technology, and processes together/);
assert.match(buildOrganizationSchema("es").description, /TAG08 conecta estrategia, contenido, tecnología y procesos/);
assert.equal(buildArticleSchema(`/insights/${BLOG_POSTS[0].slug}`, "pt")?.inLanguage, "pt-BR");
assert.equal(buildArticleSchema(`/insights/${BLOG_POSTS[0].slug}`, "en")?.inLanguage, "en", "translated Insights must carry English schema metadata");
assert.equal(buildArticleSchema(`/insights/${BLOG_POSTS[0].slug}`, "es")?.inLanguage, "es-ES", "translated Insights must carry Spanish schema metadata");

assert.match(socialPlansSource, /12 posts mensais para Instagram e Facebook, com planejamento mensal/);
assert.match(socialPlansSource, /uma captação de conteúdo por mês/);
assert.match(socialPlansSource, /Mínimo de 12 posts mensais, sem teto fixo/);
assert.match(socialPlansSource, /a verba de mídia é paga pelo cliente/);
assert.match(socialPlansSource, /Conheça as estruturas para diferentes momentos do negócio/);
assert.match(socialPlansSource, /Outra estrutura pode fazer sentido quando a necessidade/);
assert.doesNotMatch(socialPlansSource, /Evolua quando a rotina pedir/);
assert.doesNotMatch(sebraetecSource, /Sua empresa precisa estar classificada como MEI/);
assert.doesNotMatch(sebraetecSource, /cartão CNPJ, cópia do contrato social/);
assert.doesNotMatch(sebraetecSource, /Cada CNPJ pode ter um limite financeiro anual/);
assert.doesNotMatch(sebraetecSource, /SERVIÇOS CREDENCIADOS/);
assert.match(sebraetecSource, /dependem das regras vigentes do Sebrae regional/);
assert.match(sebraetecSource, /Frentes que podem ser avaliadas conforme as regras regionais/);
assert.match(sebraetecSource, /Se a participação da TAG08 e o serviço forem confirmados como aplicáveis/);
assert.match(sebraetecSource, /Quando essa participação for confirmada/);

const dispatchedPaths = Array.from(routeContentSource.matchAll(/(?:if|else if) \(path === "([^"]+)"\)/g), (match) => match[1]);
for (const path of dispatchedPaths) {
  const route = getRouteByPath(path);
  assert.ok(route, `RouteContent dispatch has no registry route: ${path}`);
  assert.notEqual(route.key, "not-found", `RouteContent must not render a technical not-found route: ${path}`);
}

for (const route of routeRegistry.filter((entry) => entry.key !== "not-found" && !entry.dynamic)) {
  const canonical = canonicalizeRoute(route.canonicalPath);
  assert.equal(canonical, route.canonicalPath, `Canonical path changed for ${route.key}`);
  assert.ok(getRouteByPath(canonical), `Route not resolvable for ${route.key}`);
  assert.ok(getLocalizedPath(canonical, "en").startsWith("/en"), `English path missing prefix for ${route.key}`);
  assert.ok(getLocalizedPath(canonical, "es").startsWith("/es"), `Spanish path missing prefix for ${route.key}`);

  for (const alias of route.aliases || []) {
    assert.equal(canonicalizeRoute(alias), route.canonicalPath, `Alias does not resolve: ${alias}`);
  }
}

for (const path of renderableRoutePaths) {
  const route = getRouteByPath(path);
  assert.ok(route, `Renderable path has no registry route: ${path}`);

  if (route.key === "cliente-onboarding") {
    assert.match(catchAllPageSource, /\.filter\(\(segments\) => resolveLocalizedPath\(segments\)\.path !== "\/cliente\/onboarding"\)/,
      "The dedicated onboarding route remains excluded from public catch-all static params");
    assert.match(onboardingPageSource, /export default async function OnboardingRoute/,
      "Onboarding is rendered by its dedicated App Router page");
    assert.match(onboardingPageSource, /OnboardingAccessGate[\s\S]*OnboardingSessionClient/,
      "The dedicated onboarding page preserves its access gate and authenticated renderer");
    assert.doesNotMatch(routeContentSource, /path === "\/cliente\/onboarding"/,
      "The generic dispatcher does not retain an unreachable duplicate onboarding renderer");
    continue;
  }

  if (route.dynamic && route.routeCategory === "case-study") {
    assert.match(routeContentSource, /route\?\.routeCategory === "case-study"\) page = <CaseStudyDetail/,
      "Dynamic case-study route must have an explicit renderer");
    assert.match(routeContentSource, /const CaseStudyDetail = dynamic\(\(\) => import\("\.\/pages\/CaseStudyDetail"\)\)/,
      "Dynamic case-study renderer must resolve to its page module");
    continue;
  }

  if (route.key === "insights") {
    assert.match(routeContentSource, /route\?\.key === "insights"\) page = <Insights onNavigate=\{navigate\} locale=\{locale\} articleSlug=/,
      "The Hub and its individual articles share the registered Insights renderer");
    continue;
  }

  const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const renderer = routeContentSource.match(new RegExp(`(?:if|else if) \\(path === "${escapedPath}"\\) page = <([A-Za-z0-9_]+)`))?.[1];
  assert.ok(renderer, `Renderable route has no explicit RouteContent renderer: ${path}`);
  assert.match(routeContentSource, new RegExp(`const ${renderer} = dynamic\\(\\(\\) => import\\("\\./pages\\/[A-Za-z0-9]+"\\)\\)`),
    `Renderer ${renderer} for ${path} must resolve to a page module`);
}

for (const route of routeRegistry) {
  if (!route.indexable) {
    assert.ok(!publicRoutePaths.includes(route.canonicalPath), `Non-indexable route leaked into public paths: ${route.canonicalPath}`);
  }
  if (!route.includeInSitemap) {
    assert.ok(!indexedRoutePaths.includes(route.canonicalPath), `Route excluded from sitemap appeared in indexed paths: ${route.canonicalPath}`);
    assert.ok(!routeSitemapMeta.some((entry) => entry.path === route.canonicalPath), `Route excluded from sitemap has metadata: ${route.canonicalPath}`);
  }
}

assert.ok(!renderableRoutePaths.includes("/404"), "/404 remains excluded from generated renderable paths");
assert.ok(!publicRoutePaths.includes("/404"), "/404 remains non-public/indexable");
assert.ok(!indexedRoutePaths.includes("/404"), "/404 remains outside sitemap paths");
const notFoundRegistryEntry = getRouteByPath("/404");
assert.equal(notFoundRegistryEntry?.key, "not-found", "Direct /404 currently resolves to the route-registry entry");
assert.equal(notFoundRegistryEntry?.indexable, false, "The /404 registry entry remains non-indexable");
assert.equal(notFoundRegistryEntry?.includeInSitemap, false, "The /404 registry entry remains excluded from the sitemap");
assert.doesNotMatch(routeContentSource, /path === "\/404"/, "RouteContent currently has no dedicated /404 renderer");
assert.match(catchAllPageSource, /const route = getRouteByPath\(canonicalPath\)/,
  "The catch-all uses one route registry for every runtime");
assert.doesNotMatch(catchAllPageSource, /ContentReview|review/i,
  "The App Router has no alternate editorial-rendering path");
assert.match(catchAllPageSource, /if \(!validLocale \|\| !route \|\| route\.key === "not-found"\) \{\s*notFound\(\);\s*\}/,
  "The catch-all sends unknown paths and the technical /404 entry to Next not-found");
assert.match(catchAllPageSource, /if \(!validLocale \|\| !route \|\| route\.key === "not-found"\) \{\s*return \{ robots: \{ index: false, follow: true \} \};\s*\}/,
  "The technical /404 route has no canonical metadata");
assert.match(notFoundPageSource, /return <NotFoundRoute locale=\{locale\} \/>/,
  "The framework not-found route renders the dedicated NotFoundRoute");
assert.equal(getRouteByPath("/casos/case-not-registered"), undefined,
  "Case-study data without a matching publication-evidence record must not create a route");

for (const path of indexedRoutePaths) {
  assert.ok(!routeRegistry.some((route) => route.aliases?.includes(path)), `Alias leaked into sitemap: ${path}`);
}

const assessoriaPath = "/servicos/assessoria-marketing-digital-estrategico";
const assessoriaRoute = getRouteByPath(assessoriaPath);
assert.ok(assessoriaRoute, "Assessoria route must resolve");
assert.equal(assessoriaRoute.title, "Assessoria Estratégica de Negócios | TAG08");
assert.equal(
  assessoriaRoute.description,
  "Assessoria Estratégica de Negócios para organizar posicionamento, prioridades, comunicação, canais e planejamento antes de ampliar a execução."
);
assert.deepEqual(getRouteSeo(assessoriaRoute, assessoriaPath, "pt"), {
  title: "Assessoria Estratégica de Negócios | TAG08",
  description: "Assessoria Estratégica de Negócios para organizar posicionamento, prioridades, comunicação, canais e planejamento antes de ampliar a execução."
});
assert.equal(
  i18n.pt.header.servicePages.find((service) => service.path === assessoriaPath)?.desc,
  "Posicionamento, prioridades e decisões de negócio"
);
assert.equal(
  i18n.pt.breadcrumbs.servicePages.find((service) => service.path === assessoriaPath)?.name,
  "Assessoria Estratégica de Negócios"
);

const partnershipRoute = getRouteByPath("/programa-afiliados");
assert.ok(partnershipRoute, "The approved public program name must preserve its current route");
assert.equal(partnershipRoute.canonicalPath, "/programa-afiliados");
assert.equal(getRouteSeo(partnershipRoute, "/programa-afiliados", "pt").title, "Programa de Parceria | TAG08");

const hostingRoute = getRouteByPath("/hospedagem-manutencao-sites");
assert.ok(hostingRoute, "Hosting remains available as a technology-continuity service");
assert.equal(hostingRoute.canonicalPath, "/hospedagem-manutencao-sites");

const sebraetecRoute = getRouteByPath("/sebraetec-impulsionando-empreendedores");
assert.ok(sebraetecRoute, "Sebraetec retains its dedicated route");
assert.equal(sebraetecRoute.canonicalPath, "/sebraetec-impulsionando-empreendedores");
assert.doesNotMatch(getRouteSeo(sebraetecRoute, sebraetecRoute.canonicalPath, "pt").description, /(?:70|30)%/,
  "Public Sebraetec metadata must not promise a uniform subsidy percentage");

const onboardingRoute = getRouteByPath("/cliente/onboarding");
assert.ok(onboardingRoute, "The onboarding route remains available for its current flow");
assert.equal(onboardingRoute.indexable, false);
assert.equal(onboardingRoute.includeInSitemap, false);
assert.ok(!i18n.pt.footer.institutionLinks.some((link) => "path" in link && String(link.path) === "/cliente/onboarding"),
  "Onboarding must not appear as a generic public footer link");

const talentRoute = getRouteByPath("/trabalhe-conosco");
assert.ok(talentRoute, "The permanent talent-bank route must remain available");
assert.equal(talentRoute.canonicalPath, "/trabalhe-conosco");
assert.equal(talentRoute.indexable, true);
assert.equal(talentRoute.includeInSitemap, true);
assert.deepEqual(getRouteSeo(talentRoute, talentRoute.canonicalPath, "pt"), {
  title: "Banco de Talentos TAG08 | Candidatura Espontânea",
  description: "Compartilhe seu perfil profissional com o Banco de Talentos da TAG08 para consideração em oportunidades futuras, sem garantia de vaga, contato ou contratação."
});

assert.deepEqual(
  CASE_STUDIES.filter((caseStudy) => getVisibleEvidence([caseStudy], (item) => `case-study/${item.id}`, `/casos/${caseStudy.id}`).length > 0),
  [],
  "Cases marked investigate are not eligible for public publication"
);
for (const caseStudy of CASE_STUDIES) {
  const casePath = `/casos/${caseStudy.id}`;
  assert.equal(PUBLIC_EVIDENCE[`case-study/${caseStudy.id}` as keyof typeof PUBLIC_EVIDENCE].status, "investigate");
  assert.equal(getRouteByPath(casePath), undefined, `${casePath} does not resolve as a public route`);
  assert.ok(!publicRoutePaths.includes(casePath), `${casePath} is absent from public routes`);
  assert.ok(!renderableRoutePaths.includes(casePath), `${casePath} is absent from generated renderable routes`);
  assert.ok(!staticRouteSegments().some((segments) => `/${segments.join("/")}` === casePath), `${casePath} is absent from static route segments`);
  assert.ok(!indexedRoutePaths.includes(casePath), `${casePath} is absent from indexed paths`);
  assert.ok(!routeSitemapMeta.some((entry) => entry.path === casePath), `${casePath} is absent from sitemap metadata`);
}

const driveCaseIds = [
  "lavarroupa-sa-branding-lavanderia-self-service",
  "centro-de-olhos-rebranding-clinica-oftalmologica",
  "levisage-branding-clinica-premium",
  "alugue-por-temporada-branding-produto-digital",
  "luciana-gadelha-marca-pessoal",
  "espaco-glau-campos-identidade-visual",
  "unida-construtora-presenca-digital",
  "econotrip-modelagem-prototipo-mvp",
  "personapp-evolucao-produto-digital",
  "liga-do-laser-preparacao-infoproduto",
  "sm-advocacia-marca-conteudo",
  "jl-corretora-rebranding",
  "chama-o-dermato-lancamentos",
  "doctorplay-modelagem-marca-produto"
];
for (const id of driveCaseIds) {
  const caseStudy = CASE_STUDIES.find((item) => item.id === id);
  assert.ok(caseStudy?.summary, `${id} has a Drive-grounded summary`);
  assert.ok(caseStudy?.deliverables?.length, `${id} uses listed deliverables rather than assumed results`);
  assert.ok(caseStudy?.relatedServicePath && getRouteByPath(caseStudy.relatedServicePath), `${id} links to a registered service`);
  assert.equal(caseStudy?.metric, undefined, `${id} does not invent a performance metric`);
  assert.equal(PUBLIC_EVIDENCE[`case-study/${id}` as keyof typeof PUBLIC_EVIDENCE].status, "investigate", `${id} detail page remains unpublished`);
  assert.equal(isEvidenceVisible(`case-study/${id}`, `/casos/${id}`), false, `${id} detail page remains behind its separate gate`);
  assert.equal(PUBLIC_EVIDENCE[`home-case/${id}` as keyof typeof PUBLIC_EVIDENCE].status, "approved", `${id} summary is approved for the Home`);
  assert.equal(isEvidenceVisible(`home-case/${id}`, "/"), true, `${id} summary is visible on the Home`);
}

for (const caseStudy of CASE_STUDIES) {
  const casePath = `/casos/${caseStudy.id}`;
  const approvedForRoute = isEvidenceVisible(`case-study/${caseStudy.id}`, casePath);
  assert.equal(Boolean(getRouteByPath(casePath)), approvedForRoute, `${casePath} is routable only when evidence is approved`);
  if (!approvedForRoute) assert.ok(!routeSitemapMeta.some((entry) => entry.path === casePath), `${casePath} is absent from the sitemap`);
}
