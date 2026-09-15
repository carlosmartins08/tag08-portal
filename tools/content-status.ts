import { PUBLICATION_CONTRACTS } from "../src/content/publicationContracts";
import { PUBLIC_EVIDENCE, getEvidenceStatusLabel } from "../src/content/publicEvidence";

for (const contract of PUBLICATION_CONTRACTS) {
  const items = contract.evidenceKeys.map((key) => {
    const evidence = PUBLIC_EVIDENCE[key];
    const status = getEvidenceStatusLabel(key);
    const routeAllowed = evidence.allowedRoutes.includes(contract.route);

    return {
      key,
      label: evidence.label,
      status: routeAllowed ? status : "outside-authorized-route",
      reason: routeAllowed ? evidence.reason : `Aprovado ou registrado para: ${evidence.allowedRoutes.join(", ")}.`
    };
  });
  const counts = items.reduce<Record<string, number>>((total, item) => ({ ...total, [item.status]: (total[item.status] ?? 0) + 1 }), {});
  console.log(`\n${contract.route} :: ${contract.section}`);
  console.log(`  público: ${counts.approved ?? 0} | pendentes: ${counts.pending ?? 0} | fora da rota autorizada: ${counts["outside-authorized-route"] ?? 0} | removidos: ${counts.remove ?? 0}`);
  items.filter((item) => item.status !== "approved").forEach((item) => console.log(`  - ${item.status}: ${item.label} (${item.reason})`));
}
