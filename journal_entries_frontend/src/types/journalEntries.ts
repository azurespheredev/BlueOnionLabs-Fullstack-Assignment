export interface APIResponse {
  results?: JournalEntryReport[];
  error?: string;
}

export interface JournalEntryReport {
  journal_entry_date: string;
  entries: JournalEntry[];
  totals: {
    debit_total: number;
    credit_total: number;
  };
}

export interface JournalEntry {
  account: string;
  debit: number | null;
  credit: number | null;
  description: string;
}

export interface JournalFilter {
  month: number;
  year: number;
}
