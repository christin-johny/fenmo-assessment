export interface Expense {
  id: string;
  userId: string; // Fingerprint
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string
  createdAt: string; // ISO string
  idempotencyKey: string;
}

export type CreateExpenseInput = Omit<Expense, 'id' | 'createdAt'>;

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  globalTotalAmount: number;
  categoryTotals: Record<string, number>;
}
