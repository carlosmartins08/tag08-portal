import fs from "fs";
import path from "path";
import { CASE_STUDIES } from "./src/data";
import { routeSitemapMeta } from "./src/config/routeRegistry";
import { PRIMARY_SITE_DOMAIN } from "./src/config/siteNetwork";

const DOMAIN = PRIMARY_SITE_DOMAIN;
const currentDate = new Date().toISOString().split("T")[0];

function generateSitemap() {
  console.log("Generating XML sitemap dynamically based on existing routes...");
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const seenPaths = new Set<string>();
  
  // Add static files
  routeSitemapMeta.forEach((entry) => {
    if (seenPaths.has(entry.path)) return;
    seenPaths.add(entry.path);
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}${entry.path}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  // Add dynamic case studies
  if (Array.isArray(CASE_STUDIES)) {
    CASE_STUDIES.forEach((caseStudy) => {
      const casePath = `/casos/${caseStudy.id}`;
      if (seenPaths.has(casePath)) return;
      seenPaths.add(casePath);
      xml += '  <url>\n';
      xml += `    <loc>${DOMAIN}${casePath}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += '  </url>\n';
    });
  }
  
  xml += '</urlset>\n';
  
  // Ensure "public" directory exists
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  const outputPath = path.join(publicDir, "sitemap.xml");
  fs.writeFileSync(outputPath, xml, "utf8");
  
  console.log(`Successfully generated sitemap.xml at ${outputPath}`);
}

generateSitemap();
