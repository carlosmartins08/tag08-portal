import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
import { HOME_PILOT_COPY } from "../src/i18n/homeCopy.ts";

const homeSource = readFileSync(new URL("../src/features/site/pages/Home.tsx", import.meta.url), "utf8");

test("Home has localized EN/ES YouTube loading and unavailable messages", () => {
  for (const locale of ["en", "es"] as const) {
    const copy = HOME_PILOT_COPY[locale].youtubeUnavailable;

    assert.ok(copy.loading.trim().length > 0, `${locale}: loading message is required`);
    assert.ok(copy.unavailable.trim().length > 0, `${locale}: unavailable message is required`);
    assert.ok(copy.link.trim().length > 0, `${locale}: channel link label is required`);
  }

  assert.match(HOME_PILOT_COPY.en.youtubeUnavailable.loading, /official channel/i);
  assert.match(HOME_PILOT_COPY.es.youtubeUnavailable.loading, /canal oficial/i);
  assert.match(HOME_PILOT_COPY.en.youtubeUnavailable.unavailable, /temporarily unavailable/i);
  assert.match(HOME_PILOT_COPY.es.youtubeUnavailable.unavailable, /temporalmente/i);
  assert.match(homeSource, /pilotCopy\?\.youtubeUnavailable\s*\?\?/);
  assert.match(homeSource, /youtubeUnavailableCopy\.loading\s*:\s*youtubeUnavailableCopy\.unavailable/);
});

test("Home provides localized EN/ES notice when client reviews cannot safely be shown", () => {
  for (const locale of ["en", "es"] as const) {
    const copy = HOME_PILOT_COPY[locale].reviews;

    assert.ok(copy.unavailableTitle.trim().length > 0, `${locale}: notice title is required`);
    assert.ok(copy.unavailableDescription.trim().length > 0, `${locale}: notice explanation is required`);
    assert.match(copy.unavailableDescription, /original language|idioma original/i);
    assert.match(copy.unavailableDescription, /approved|aprobada/i);
  }

  assert.match(homeSource, /const reviewsLocaleReady\s*=\s*gmbReviewsLocale === locale/);
  assert.match(homeSource, /review\.machineTranslated === true/);
  assert.match(homeSource, /review\.original !== undefined/);
  assert.match(
    homeSource,
    /locale !== "pt" && contentSources\.googleBusiness === "live" && gmbReviewsLocale === locale && !reviewsLocaleReady && visibleGmbReviews\.length > 0/
  );
  assert.match(homeSource, /role="status"[\s\S]*?reviewsCopy\?\.unavailableTitle[\s\S]*?reviewsCopy\?\.unavailableDescription/);
  assert.match(homeSource, /contentSources\.googleBusiness === "live" && gmbReviewsLocale === locale && reviewsLocaleReady && visibleGmbReviews\.length > 0/);
});

test("Home solution cards have a localized entry for every rendered service id", () => {
  const mapStart = homeSource.indexOf("const MAPA_SOLUCOES_DATA = [");
  const mapEnd = homeSource.indexOf("const MAPA_SOLUCOES_PAIRS", mapStart);
  assert.ok(mapStart >= 0 && mapEnd > mapStart, "active Home solution map must be discoverable");
  const renderedMap = homeSource.slice(mapStart, mapEnd);
  const ids = [...renderedMap.matchAll(/id: "([^"]+)"/g)].map((match) => match[1]);
  assert.ok(ids.length > 0, "Home solution map must contain service cards");

  for (const locale of ["en", "es"] as const) {
    const cards = HOME_PILOT_COPY[locale].solutionMap.cards as Record<string, {
      title: string;
      subtitle: string;
      desc: string;
      related: string;
      cta: string;
    }>;
    for (const id of ids) {
      const card = cards[id];
      assert.ok(card, `${locale}: missing translated Home solution card for ${id}`);
      for (const field of ["title", "subtitle", "desc", "related", "cta"] as const) {
        assert.ok(card[field].trim().length > 0, `${locale}.${id}.${field} must not be empty`);
      }
    }
  }

  assert.match(homeSource, /return translated \? \{ \.\.\.service, \.\.\.translated \} : service/);
});

test("all 14 approved Home cases have complete EN/ES card translations", () => {
  const approvedHomeCaseIds = [
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

  for (const locale of ["en", "es"] as const) {
    const cases = HOME_PILOT_COPY[locale].cases;
    assert.deepEqual(Object.keys(cases.items).sort(), [...approvedHomeCaseIds].sort(), `${locale}: case translation inventory must match the approved Home set`);
    for (const id of approvedHomeCaseIds) {
      const item = cases.items[id as keyof typeof cases.items];
      for (const field of ["title", "category", "summary", "solution"] as const) {
        assert.ok(item[field].trim().length > 0, `${locale}.${id}.${field} must be translated`);
      }
    }
    for (const field of ["countLabel", "controlsLabel", "carouselLabel", "carouselRoleDescription", "previousCase", "nextCase", "challengeLabel", "responseLabel", "relatedCta"] as const) {
      assert.ok(cases[field].trim().length > 0, `${locale}.cases.${field} must be localized`);
    }
  }

  assert.match(homeSource, /const localizedClientCases = visibleClientCases\.map/);
  assert.match(homeSource, /localizedClientCases\.map\(\(caseStudy, caseIndex\)/);
  assert.match(homeSource, /visibleClientCases\.length > 0 \?/);
});

test("Portuguese Home case count fallback is localized and keeps the dynamic count", () => {
  assert.match(homeSource, /Veja \{count\} projetos e os desafios que orientaram cada trabalho\./);
  assert.match(homeSource, /\(casesCopy\?\.countLabel \?\? [^)]*\)\.replace\("\{count\}", String\(localizedClientCases\.length\)\)/);
  assert.doesNotMatch(homeSource, /Explore \{count\} projects and the challenges they addressed\./);
});

test("Home audiovisual heading joins both title fragments with a real space", () => {
  assert.match(homeSource, /const videoHeading = `\$\{videoCopy\?\.title[^`]+\} \$\{videoCopy\?\.titleSecondLine[^`]+\}`/);
  assert.match(homeSource, /<h2[^>]*>\s*\{videoHeading\}\s*<\/h2>/);
});

test("Home EN/ES catalogs are structurally complete and nonempty", () => {
  const collectPaths = (value: unknown, prefix = ""): string[] => {
    if (typeof value === "string") {
      assert.ok(value.trim().length > 0, `${prefix} must not be empty`);
      return [prefix];
    }
    if (Array.isArray(value)) {
      return value.flatMap((item, index) => collectPaths(item, `${prefix}[${index}]`));
    }
    if (value && typeof value === "object") {
      return Object.entries(value).flatMap(([key, child]) => collectPaths(child, prefix ? `${prefix}.${key}` : key));
    }
    return [];
  };

  const englishPaths = collectPaths(HOME_PILOT_COPY.en).sort();
  const spanishPaths = collectPaths(HOME_PILOT_COPY.es).sort();
  assert.deepEqual(spanishPaths, englishPaths, "EN and ES Home copy must cover the same visible-copy contract");
});

test("Home localized-copy expressions do not rely on Portuguese fallback literals", () => {
  const sourceFile = ts.createSourceFile("Home.tsx", homeSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const aliases = new Map<string, string[]>();

  const readPath = (expression: ts.Expression): { root: string; path: string[] } | null => {
    const path: string[] = [];
    let current = expression;
    while (ts.isPropertyAccessExpression(current) || ts.isElementAccessExpression(current)) {
      if (ts.isPropertyAccessExpression(current)) {
        path.unshift(current.name.text);
      } else {
        const argument = current.argumentExpression;
        if (!argument || !(ts.isStringLiteral(argument) || ts.isNumericLiteral(argument))) return null;
        path.unshift(argument.text);
      }
      current = current.expression;
    }
    return ts.isIdentifier(current) ? { root: current.text, path } : null;
  };

  const visitAliases = (node: ts.Node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      const reference = readPath(node.initializer);
      if (reference?.root === "pilotCopy") aliases.set(node.name.text, reference.path);
    }
    ts.forEachChild(node, visitAliases);
  };
  visitAliases(sourceFile);

  const missing: string[] = [];
  const visitFallbacks = (node: ts.Node) => {
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken) {
      const reference = readPath(node.left);
      if (reference) {
        const basePath = reference.root === "pilotCopy" ? [] : aliases.get(reference.root);
        if (basePath) {
          const path = [...basePath, ...reference.path];
          let value: unknown = HOME_PILOT_COPY.en;
          for (const key of path) value = value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined;
          if (value === undefined || value === null) missing.push(path.join("."));
        }
      }
    }
    ts.forEachChild(node, visitFallbacks);
  };
  visitFallbacks(sourceFile);

  assert.deepEqual([...new Set(missing)], [], "every Home EN fallback expression must resolve from the localized catalog");
});
