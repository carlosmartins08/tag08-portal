import assert from "node:assert/strict";
import { CASE_STUDIES } from "../src/data";
import { getVisibleEvidence, PUBLIC_EVIDENCE } from "../src/content/publicEvidence";
import { canonicalizeRoute, getContentReviewRouteByPath, getLocalizedPath, getRouteByPath, indexedRoutePaths, publicRoutePaths, renderableRoutePaths, routeRegistry, routeSitemapMeta, staticRouteSegments } from "../src/config/routeRegistry";
import { getRouteSeo } from "../src/lib/seo";
import { i18n } from "../src/i18n/siteI18n";
import { readFileSync } from "node:fs";

const routeContentSource = readFileSync("src/features/site/RouteContent.tsx", "utf8");
const catchAllPageSource = readFileSync("src/app/[locale]/[[...segments]]/page.tsx", "utf8");
const notFoundPageSource = readFileSync("src/app/[locale]/not-found.tsx", "utf8");
const onboardingPageSource = readFileSync("src/app/[locale]/cliente/onboarding/page.tsx", "utf8");
const socialPlansSource = readFileSync("src/features/site/pages/GestaoRedesSociais.tsx", "utf8");
const sebraetecSource = readFileSync("src/features/site/pages/Sebraetec.tsx", "utf8");

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
assert.match(catchAllPageSource, /const route = getRouteByPath\(canonicalPath\) \?\? getContentReviewRouteByPath\(canonicalPath\)/,
  "The catch-all currently resolves direct /404 through the route registry");
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

const originalNodeEnv = process.env.NODE_ENV;
const originalReviewFlag = process.env.NEXT_PUBLIC_TAG08_CONTENT_REVIEW;
const mutableEnvironment = process.env as unknown as Record<string, string | undefined>;
try {
  mutableEnvironment.NODE_ENV = "development";
  mutableEnvironment.NEXT_PUBLIC_TAG08_CONTENT_REVIEW = "1";
  for (const caseStudy of CASE_STUDIES) {
    const casePath = `/casos/${caseStudy.id}`;
    assert.ok(getContentReviewRouteByPath(casePath), `${casePath} remains reachable only through local review`);
    assert.equal(getRouteByPath(casePath), undefined, `${casePath} does not become a public route in review mode`);
    assert.ok(!routeSitemapMeta.some((entry) => entry.path === casePath), `${casePath} never enters the sitemap through review mode`);
  }
} finally {
  if (originalNodeEnv === undefined) delete mutableEnvironment.NODE_ENV;
  else mutableEnvironment.NODE_ENV = originalNodeEnv;
  if (originalReviewFlag === undefined) delete mutableEnvironment.NEXT_PUBLIC_TAG08_CONTENT_REVIEW;
  else mutableEnvironment.NEXT_PUBLIC_TAG08_CONTENT_REVIEW = originalReviewFlag;
}
