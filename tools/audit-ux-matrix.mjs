import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const collectPageFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectPageFiles(path) : entry.name.endsWith(".tsx") ? [path] : [];
  });

const sourceFiles = collectPageFiles("src/features/site/pages").filter((file) => {
  const source = readFileSync(file, "utf8");
  return /<h1|<section|ServiceInsightsBridge|MiniCases|<form/.test(source);
});

const countMatches = (source, pattern) => [...source.matchAll(pattern)].length;

const getOpaqueSupportAccentUses = (source) =>
  source.split(/\r?\n/).flatMap((line, index) => {
    const matches = [
      ...line.matchAll(
        /(?:^|[\s"'`])(?:(?:sm|md|lg|xl|2xl):)?(?:bg|from|via|to)-brand-secondary(?!\/)(?=$|[\s"'`])/g
      )
    ];

    return matches.map((match) => ({
      line: index + 1,
      utility: match[0].trim()
    }));
  });

const getDominantSupportAccentSurfaces = (source) =>
  getOpaqueSupportAccentUses(source).filter(({ line }) => {
    const lines = source.split(/\r?\n/);
    const classLineIndex = line - 1;
    const tagStart = lines
      .slice(0, classLineIndex + 1)
      .reduceRight((found, currentLine, index) => (found === null && currentLine.includes("<") ? index : found), null);

    if (tagStart === null) return false;

    const element = lines.slice(tagStart, classLineIndex + 1).join(" ");
    const tag = element.match(/<([A-Za-z.]+)/)?.[1];
    const hasLargeDimensions = /(?:\b(?:min-h|h)-\[(?:[2-9]\d{2}|[1-9]\d{3,})px\]|\bp-(?:[6-9]|[1-9]\d)\b)/.test(element);

    return ["div", "section", "article", "aside", "main", "motion.div"].includes(tag) && hasLargeDimensions;
  });

const pages = sourceFiles.map((file) => {
  const source = readFileSync(file, "utf8");
  const sections = (source.match(/<section\b/g) || []).length;
  const monoLabels = (source.match(/font-mono/g) || []).length;
  const accentSupportReferences = (source.match(/brand-secondary/g) || []).length;
  const opaqueSupportAccentUses = getOpaqueSupportAccentUses(source);
  const dominantSupportAccentSurfaces = getDominantSupportAccentSurfaces(source);
  const risks = [];

  if (!/<h1\b/.test(source)) risks.push({ severity: "P1", rule: "missing_h1" });
  if (/<form\b/.test(source) && !/<label\b/.test(source)) risks.push({ severity: "P1", rule: "form_without_label" });
  if (sections > 18) risks.push({ severity: "P2", rule: "high_section_density", count: sections });
  if (monoLabels > 180) risks.push({ severity: "P2", rule: "high_mono_label_density", count: monoLabels });
  if (dominantSupportAccentSurfaces.length > 1) {
    risks.push({
      severity: "P2",
      rule: "high_opaque_support_accent_surface_density",
      count: dominantSupportAccentSurfaces.length,
      surfaces: dominantSupportAccentSurfaces
    });
  }

  return {
    file,
    sections,
    monoLabels,
    accentSupportReferences,
    opaqueSupportAccentUses,
    dominantSupportAccentSurfaces,
    hasH1: /<h1\b/.test(source),
    hasForm: /<form\b/.test(source),
    hasInsightsBridge: /ServiceInsightsBridge/.test(source),
    hasProof: /MiniCases|TrustTestimonialsSection|Case/.test(source),
    hasImage: /<Image\b/.test(source),
    hasVideo: /trackVideoEvent|youtube|YouTube/.test(source),
    risks
  };
});

const findings = pages.flatMap((page) => page.risks.map((risk) => ({ ...risk, file: page.file })));
mkdirSync(".audit", { recursive: true });
writeFileSync(
  ".audit/ux-matrix.json",
  JSON.stringify(
    {
      pages,
      findings,
      methodology: {
        signals: [
          "sections, monoLabels and accentSupportReferences are source-level review signals, not visual defects by themselves.",
          "opaqueSupportAccentUses lists base or breakpoint-specific opaque support-accent background and gradient utilities.",
          "dominantSupportAccentSurfaces is restricted to broad structural containers; buttons, progress bars, badges, indicators, interactive, translucent, border, text and glow uses do not trigger the support-accent density rule."
        ]
      }
    },
    null,
    2
  )
);
console.log(
  JSON.stringify({
    event: "ux_matrix_complete",
    pages: pages.length,
    findings: findings.length,
    report: ".audit/ux-matrix.json"
  })
);

if (findings.some((finding) => finding.severity === "P1")) process.exitCode = 1;
