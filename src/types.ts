export type TransactionStatus = "pending" | "posted";

export interface RawTransaction {
  plaidTransactionId: string;
  accountId: string;
  amount: number;
  date: string;
  merchantName: string;
  status: TransactionStatus;
  pendingTransactionId?: string | null;
}

export interface ReconciledTransaction extends RawTransaction {
  matchedFrom?: string;
}

export interface ReconciliationResult {
  effective: ReconciledTransaction[];
  matchedPairs: { pendingId: string; postedId: string }[];
  unmatchedPending: RawTransaction[];
}