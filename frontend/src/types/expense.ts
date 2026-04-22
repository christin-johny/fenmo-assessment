export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  idempotencyKey: string;
}

export type CreateExpenseInput = {
  amount: number;
  category: string;
  description: string;
  date: string;
  idempotencyKey: string;
};

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
