import { RawTransaction, ReconciliationResult, ReconciledTransaction } from "./types";

const AMOUNT_TOLERANCE = 0.01;
const DATE_WINDOW_DAYS = 5;
const MERCHANT_MIN_SIMILARITY = 0.6;

function daysBetween(a: string, b: string): number {
  const diff = Math.abs(new Date(a).getTime() - new Date(b).getTime());
  return diff / (1000 * 60 * 60 * 24);
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
}

function merchantSimilarity(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.8;

  const setA = new Set(na.split(" "));
  const setB = new Set(nb.split(" "));
  const overlap = [...setA].filter((t) => setB.has(t)).length;
  return overlap / Math.max(setA.size, setB.size, 1);
}

export function reconcileTransactions(transactions: RawTransaction[]): ReconciliationResult {
  const pending = transactions.filter((t) => t.status === "pending");
  const posted = transactions.filter((t) => t.status === "posted");

  const matchedPairs: { pendingId: string; postedId: string }[] = [];
  const usedPending = new Set<string>();
  const usedPosted = new Set<string>();

  for (const p of posted) {
    if (!p.pendingTransactionId) continue;
    const match = pending.find(
      (pn) => pn.plaidTransactionId === p.pendingTransactionId && !usedPending.has(pn.plaidTransactionId)
    );
    if (match) {
      matchedPairs.push({ pendingId: match.plaidTransactionId, postedId: p.plaidTransactionId });
      usedPending.add(match.plaidTransactionId);
      usedPosted.add(p.plaidTransactionId);
    }
  }

  for (const p of posted) {
    if (usedPosted.has(p.plaidTransactionId)) continue;

    let bestMatch: RawTransaction | null = null;
    let bestScore = 0;

    for (const pn of pending) {
      if (usedPending.has(pn.plaidTransactionId)) continue;
      if (pn.accountId !== p.accountId) continue;
      if (Math.abs(pn.amount - p.amount) > AMOUNT_TOLERANCE) continue;
      if (daysBetween(pn.date, p.date) > DATE_WINDOW_DAYS) continue;

      const sim = merchantSimilarity(pn.merchantName, p.merchantName);
      if (sim >= MERCHANT_MIN_SIMILARITY && sim > bestScore) {
        bestScore = sim;
        bestMatch = pn;
      }
    }

    if (bestMatch) {
      matchedPairs.push({ pendingId: bestMatch.plaidTransactionId, postedId: p.plaidTransactionId });
      usedPending.add(bestMatch.plaidTransactionId);
      usedPosted.add(p.plaidTransactionId);
    }
  }

  const effective: ReconciledTransaction[] = posted.map((p) => {
    const pair = matchedPairs.find((m) => m.postedId === p.plaidTransactionId);
    return { ...p, matchedFrom: pair?.pendingId };
  });

  const unmatchedPending = pending.filter((pn) => !usedPending.has(pn.plaidTransactionId));
  effective.push(...unmatchedPending);

  return { effective, matchedPairs, unmatchedPending };
}