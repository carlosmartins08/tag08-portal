import { PUBLICATION_CONTRACTS } from "../src/content/publicationContracts";
import { PUBLIC_EVIDENCE, getEvidenceStatusLabel } from "../src/content/publicEvidence";

for (const contract of PUBLICATION_CONTRACTS) {
  const items = contract.evidenceKeys.map((key) => ({ key, label: PUBLIC_EVIDENCE[key].label, status: getEvidenceStatusLabel(key), reason: PUBLIC_EVIDENCE[key].reason }));
  const counts = items.reduce<Record<string, number>>((total, item) => ({ ...total, [item.status]: (total[item.status] ?? 0) + 1 }), {});
  console.log(`\n${contract.route} :: ${contract.section}`);
  console.log(`  público: ${counts.approved ?? 0} | suprimidos pendentes: ${counts.pending ?? 0} | removidos: ${counts.remove ?? 0}`);
  items.filter((item) => item.status !== "approved").forEach((item) => console.log(`  - ${item.status}: ${item.label} (${item.reason})`));
}
