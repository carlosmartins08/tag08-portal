"use client";

import { getEvidenceStatusLabel, hasUnpublishedPublicEvidence, isContentReviewMode } from "../content/publicEvidence";

export function ContentReviewBanner() {
  if (!isContentReviewMode() || !hasUnpublishedPublicEvidence()) return null;
  return <div data-testid="content-review-banner" role="status" className="fixed inset-x-0 bottom-0 z-[100] border-t border-amber-300/60 bg-amber-300 px-4 py-2 text-center font-sans text-xs font-black tracking-widest text-black">REVISÃO LOCAL — NÃO PUBLICADO</div>;
}

export function EvidenceReviewBadge({ evidenceKey }: { evidenceKey: string }) {
  const status = getEvidenceStatusLabel(evidenceKey);
  if (!isContentReviewMode() || (status !== "pending" && status !== "investigate")) return null;

  const isInvestigating = status === "investigate";
  const label = isInvestigating ? "Em investigação — não publicado" : "Pendente — não publicado";
  const testId = isInvestigating ? "evidence-investigate" : "evidence-pending";

  return <span data-testid={`${testId}-${evidenceKey}`} className="inline-flex rounded border border-amber-300/70 bg-amber-300/15 px-2 py-1 font-sans text-[10px] font-black uppercase tracking-wider text-amber-200">{label}</span>;
}
