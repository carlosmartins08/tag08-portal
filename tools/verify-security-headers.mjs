const baseUrl = (process.env.VERIFY_BASE_URL ?? process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");

const requiredHeaders = {
  "x-content-type-options": /nosniff/i,
  "referrer-policy": /strict-origin-when-cross-origin/i,
  "x-frame-options": /sameorigin/i,
  "permissions-policy": /camera=\(\)/i,
  "content-security-policy-report-only": /default-src 'self'/i
};

const response = await fetch(`${baseUrl}/`, { redirect: "manual" });
const failures = Object.entries(requiredHeaders).flatMap(([name, pattern]) => {
  const value = response.headers.get(name);
  return value && pattern.test(value) ? [] : `${name} ausente ou inválido`;
});

if (!response.ok) {
  failures.push(`home respondeu HTTP ${response.status}`);
}

if (failures.length > 0) {
  console.error(`Falha na validação de headers em ${baseUrl}:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Headers de segurança validados em ${baseUrl}.`);
