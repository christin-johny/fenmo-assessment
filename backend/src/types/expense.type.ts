export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;  
  createdAt: string;  
  idempotencyKey: string;
}

export type CreateExpenseInput = Omit<Expense, 'id' | 'createdAt'>;
