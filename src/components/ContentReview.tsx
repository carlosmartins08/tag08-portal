"use client";

import { getEvidenceStatusLabel, isContentReviewMode } from "../content/publicEvidence";

export function ContentReviewBanner() {
  if (!isContentReviewMode()) return null;
  return <div data-testid="content-review-banner" role="status" className="fixed inset-x-0 bottom-0 z-[100] border-t border-amber-300/60 bg-amber-300 px-4 py-2 text-center font-sans text-xs font-black tracking-widest text-black">REVISÃO LOCAL — NÃO PUBLICADO</div>;
}

export function EvidenceReviewBadge({ evidenceKey }: { evidenceKey: string }) {
  if (!isContentReviewMode() || getEvidenceStatusLabel(evidenceKey) !== "pending") return null;
  return <span data-testid={`evidence-pending-${evidenceKey}`} className="inline-flex rounded border border-amber-300/70 bg-amber-300/15 px-2 py-1 font-sans text-[10px] font-black uppercase tracking-wider text-amber-200">Pendente — não publicado</span>;
}
